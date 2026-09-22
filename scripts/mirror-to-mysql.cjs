'use strict';

/* 知序 · 把 SQLite 数据镜像到 MySQL，供博客的数据库工作台直接浏览。
   在服务器上运行（由 deploy/zhixu-mysql-mirror.sh 调用，cron 每 10 分钟一次）：
     - 读取 SQLite 的 zx_* 表，生成 zhixu_* 表（结构与列按 SQLite 动态映射）
     - 每次全量刷新，最新 N 行（ZHIXU_MIRROR_MAX_ROWS，默认 5000），避免无限增长
     - 只读语义：不改动 SQLite，也不碰 MySQL 里博客自己的表
   凭据通过环境变量传入的 --defaults-extra-file 使用，脚本本身不接触密码。 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const { DatabaseSync } = require('node:sqlite');

const cnf = process.env.ZHIXU_MYSQL_CNF || '';
const database = process.env.ZHIXU_MYSQL_DB || 'recaordweb';
const maxRows = Math.max(1, Number(process.env.ZHIXU_MIRROR_MAX_ROWS) || 5000);
const sqlitePath = process.env.ZHIXU_DB || path.join(root, 'server', 'data', 'zhixu.db');
const only = (process.env.ZHIXU_MIRROR_TABLES || '').split(',').map(x => x.trim()).filter(Boolean);

const dryRun = Boolean(process.env.ZHIXU_MIRROR_SQL_OUT);
if (!dryRun && (!cnf || !fs.existsSync(cnf))) {
  console.error('缺少可用的 MySQL 凭据文件（环境变量 ZHIXU_MYSQL_CNF）');
  process.exit(1);
}
if (!fs.existsSync(sqlitePath)) {
  console.error('找不到 SQLite 数据库：' + sqlitePath);
  process.exit(1);
}

const db = new DatabaseSync(sqlitePath, { readOnly: true });

function mysqlType(sqliteType) {
  const type = String(sqliteType || '').toUpperCase();
  if (type.includes('INT')) return 'BIGINT';
  if (type.includes('REAL') || type.includes('FLOA') || type.includes('DOUB')) return 'DOUBLE';
  if (type.includes('BLOB')) return 'LONGBLOB';
  return 'TEXT';
}

function quote(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'bigint') return String(value);
  if (Buffer.isBuffer(value)) return '0x' + value.toString('hex');
  return "'" + String(value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\0/g, '\\0') + "'";
}

function tables() {
  const names = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'zx_%' ORDER BY name")
    .all()
    .map(row => row.name);
  return only.length ? names.filter(name => only.includes(name)) : names;
}

function columnsOf(table) {
  return db.prepare('PRAGMA table_info(' + table + ')').all();
}

const statements = [];
statements.push('SET NAMES utf8mb4;');
statements.push('SET SESSION sql_mode = \'\';');
statements.push('SET FOREIGN_KEY_CHECKS = 0;');

const summary = [];
for (const table of tables()) {
  const target = 'zhixu_' + table.replace(/^zx_/, '');
  const columns = columnsOf(table);
  if (!columns.length) continue;

  const definitions = columns.map(column => {
    const notNull = column.notnull || column.pk ? ' NOT NULL' : '';
    return '`' + column.name + '` ' + mysqlType(column.type) + notNull;
  });
  const pkColumns = columns.filter(column => column.pk).map(column => '`' + column.name + '`');
  const orderBy = columns.some(column => column.name === 'id') ? 'id' : pkColumns[0] || columns[0].name;

  statements.push('CREATE TABLE IF NOT EXISTS `' + target + '` (' +
    definitions.join(', ') +
    ', `_mirrored_at` DATETIME NOT NULL' +
    (pkColumns.length ? ', PRIMARY KEY (' + pkColumns.join(', ') + ')' : '') +
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;');
  statements.push('DELETE FROM `' + target + '`;');

  const rows = db
    .prepare('SELECT * FROM ' + table + ' ORDER BY ' + orderBy + ' DESC LIMIT ' + maxRows)
    .all();
  const columnNames = columns.map(column => '`' + column.name + '`').join(', ');
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const batchSize = 200;
  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    const values = batch
      .map(row => '(' + columns.map(column => quote(row[column.name])).join(', ') + ", '" + now + "')")
      .join(', ');
    statements.push('INSERT INTO `' + target + '` (' + columnNames + ', `_mirrored_at`) VALUES ' + values + ';');
  }
  summary.push(target + '=' + rows.length);
}

const sqlFile = path.join(os.tmpdir(), 'zhixu-mirror-' + process.pid + '.sql');
fs.writeFileSync(sqlFile, statements.join('\n'));
try {
  if (process.env.ZHIXU_MIRROR_SQL_OUT) {
    // 干跑：只输出生成的 SQL，不连接 MySQL（本地自检用）
    fs.copyFileSync(sqlFile, process.env.ZHIXU_MIRROR_SQL_OUT);
    console.log('[' + new Date().toISOString() + '] 已生成 SQL（未执行）→ ' + process.env.ZHIXU_MIRROR_SQL_OUT + '：' + summary.join(' '));
  } else {
    execFileSync('mysql', [
      '--defaults-extra-file=' + cnf,
      '--database=' + database,
      '--batch',
      '--silent',
    ], { input: fs.readFileSync(sqlFile), stdio: ['pipe', 'inherit', 'inherit'] });
    console.log('[' + new Date().toISOString() + '] 镜像完成 → ' + database + '：' + summary.join(' '));
  }
} finally {
  fs.rmSync(sqlFile, { force: true });
}
