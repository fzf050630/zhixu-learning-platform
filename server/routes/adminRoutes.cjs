'use strict';

/* 知序 · 只读数据库观察台接口（需要 X-Zhixu-Admin 管理令牌）
   GET  /api/admin/overview                 各表行数 + 访问汇总 + 配置快照
   GET  /api/admin/tables                   表清单（含列定义与行数）
   GET  /api/admin/table/:name             分页浏览某张表（IP 默认打码）
   POST /api/admin/query                   只读 SELECT 查询（单条语句、强制行数上限）
   全部只读：不提供任何写入接口；表名必须来自白名单，值不拼接进 SQL。 */
const { sendJson, readJsonBody } = require('../lib/http.cjs');
const { badRequest, notFound } = require('../lib/errors.cjs');
const rateLimit = require('../lib/rateLimit.cjs');
const { clientAddress } = require('../lib/client.cjs');
const { requireAdmin } = require('../lib/adminAuth.cjs');
const { getDatabase } = require('../db/database.cjs');
const repository = require('../repositories/siteVisitRepository.cjs');
const config = require('../config.cjs');
const jevBudget = require('../services/jevBudget.cjs');

const FORBIDDEN = /\b(attach|detach|pragma|insert|update|delete|drop|alter|create|replace|vacuum|reindex|trigger|view|index)\b/i;
const MASK_KEYS = new Set(['ip', 'forwarded_for', 'user_agent']);

function maskIp(value) {
  if (!value || typeof value !== 'string') return value;
  if (value.includes(':')) return value.split(':').slice(0, 4).join(':') + '::/64';
  const parts = value.split('.');
  return parts.length === 4 ? parts.slice(0, 3).join('.') + '.x' : value;
}

function maskRow(row, mask) {
  if (!mask) return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === 'ip') out[key] = maskIp(value);
    else if (key === 'forwarded_for') out[key] = value ? maskIp(String(value).split(',')[0].trim()) + ' …' : value;
    else if (key === 'user_agent') out[key] = value ? String(value).slice(0, 60) + (String(value).length > 60 ? '…' : '') : value;
    else out[key] = value;
  }
  return out;
}

function tableNames() {
  return getDatabase()
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'zx_%' ORDER BY name")
    .all()
    .map(row => row.name);
}

function columnsOf(table) {
  return getDatabase().prepare('PRAGMA table_info(' + table + ')').all()
    .map(row => ({ name: row.name, type: row.type, notNull: Boolean(row.notnull), pk: Boolean(row.pk) }));
}

function rowCount(table) {
  const row = getDatabase().prepare('SELECT COUNT(*) AS n FROM ' + table).get();
  return Number(row && row.n) || 0;
}

function requireTable(name) {
  const table = String(name || '');
  if (!tableNames().includes(table)) throw notFound('表不存在或不在白名单内：' + table);
  return table;
}

function runReadonlyQuery(sql) {
  const text = String(sql || '').trim().replace(/;\s*$/, '');
  if (!text) throw badRequest('SQL 不能为空');
  if (text.includes(';')) throw badRequest('一次只能执行一条语句');
  if (!/^(select|with)\b/i.test(text)) throw badRequest('只允许 SELECT / WITH 查询');
  if (FORBIDDEN.test(text)) throw badRequest('查询包含被禁止的关键字');
  const max = Math.max(1, Number(config.admin.maxRows) || 200);
  const started = Date.now();
  let rows;
  try {
    rows = getDatabase().prepare('SELECT * FROM (' + text + ') LIMIT ' + (max + 1)).all();
  } catch (error) {
    // 语法/字段错误直接回显给管理员，便于排查（只读接口，无写入风险）
    throw badRequest('SQL 执行失败：' + (error && error.message ? error.message : '未知错误'));
  }
  return {
    columns: rows.length ? Object.keys(rows[0]) : [],
    rows: rows.slice(0, max),
    rowCount: Math.min(rows.length, max),
    truncated: rows.length > max,
    elapsedMs: Date.now() - started,
  };
}

function register(router) {
  router.get('/api/admin/overview', (request, response) => {
    rateLimit.guard(clientAddress(request).ip);
    requireAdmin(request);
    const tables = tableNames().map(name => ({ name, rows: rowCount(name) }));
    sendJson(response, 200, {
      tables,
      visits: repository.count(),
      visitsByDay: repository.listByDay(7),
      jev: { ...jevBudget.snapshot(), enabled: config.jev.enabled, model: config.jev.model },
      runtime: {
        algorithmVersion: config.algorithmVersion,
        questionVersion: config.questionVersion,
        dbPath: config.dbPath,
        requireSession: config.session.require,
        rateLimit: config.rateLimit,
      },
    });
  });

  router.get('/api/admin/tables', (request, response) => {
    rateLimit.guard(clientAddress(request).ip);
    requireAdmin(request);
    sendJson(response, 200, {
      tables: tableNames().map(name => ({ name, rows: rowCount(name), columns: columnsOf(name) })),
    });
  });

  router.get('/api/admin/table/:name', (request, response, params, url) => {
    rateLimit.guard(clientAddress(request).ip);
    requireAdmin(request);
    const table = requireTable(params.name);
    const max = Math.max(1, Math.min(1000, Number(url.searchParams.get('limit')) || 50));
    const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
    const columns = columnsOf(table);
    const orderColumn = columns.some(column => column.name === 'id') ? 'id' : columns[0].name;
    const mask = url.searchParams.get('mask') !== '0';
    const rows = getDatabase()
      .prepare('SELECT * FROM ' + table + ' ORDER BY ' + orderColumn + ' DESC LIMIT ? OFFSET ?')
      .all(max, offset)
      .map(row => maskRow(row, mask));
    sendJson(response, 200, {
      table,
      total: rowCount(table),
      limit: max,
      offset,
      orderBy: orderColumn + ' DESC',
      masked: mask,
      columns: columns.map(column => column.name),
      rows,
    });
  });

  router.post('/api/admin/query', async (request, response) => {
    rateLimit.guard(clientAddress(request).ip);
    requireAdmin(request);
    const body = await readJsonBody(request);
    sendJson(response, 200, { sql: String(body.sql || ''), ...runReadonlyQuery(body.sql) });
  });
}

module.exports = { register, runReadonlyQuery, maskIp, tableNames, columnsOf };
