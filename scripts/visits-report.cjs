'use strict';

/* 知序 · 站点访问记录报告（在服务器本机运行，不经过公网接口）
   用法：
     node scripts/visits-report.cjs            # 汇总 + 最近 20 条（IP 末段打码）
     node scripts/visits-report.cjs 30         # 最近 30 天按天统计
     node scripts/visits-report.cjs 30 --full  # 显示完整 IP
   数据库路径与后端一致：优先 ZHIXU_DB，其次 .env，最后 server/data/zhixu.db。 */
const path = require('node:path');

const root = path.resolve(__dirname, '..');
try {
  require(path.join(root, 'server', 'lib', 'env.cjs')).loadEnv(path.join(root, '.env'));
} catch (_) { /* 没有 .env 也能运行 */ }

const { openDatabase, closeDatabase } = require(path.join(root, 'server', 'db', 'database.cjs'));
const repository = require(path.join(root, 'server', 'repositories', 'siteVisitRepository.cjs'));

const args = process.argv.slice(2);
const full = args.includes('--full');
const days = Number(args.find(arg => /^\d+$/.test(arg))) || 14;

function mask(ip) {
  if (!ip) return '—';
  if (full) return ip;
  if (ip.includes(':')) return ip.split(':').slice(0, 4).join(':') + '::/64';
  const parts = ip.split('.');
  return parts.length === 4 ? parts.slice(0, 3).join('.') + '.x' : ip;
}

openDatabase();
const totals = repository.count();
console.log('=== 知序访问汇总 ===');
console.log(`独立访客（按设备/日）：${totals.visitors}　累计访问：${totals.hits}　已确认说明：${totals.onboarded}`);

console.log(`\n=== 最近 ${days} 天 ===`);
const byDay = repository.listByDay(days);
if (!byDay.length) console.log('（暂无记录）');
byDay.forEach(row => console.log(`${row.day}　访客 ${row.visitors}　访问 ${row.hits}　确认 ${row.onboarded}`));

console.log('\n=== 最近 20 条明细 ===');
const recent = repository.listRecent(20);
if (!recent.length) console.log('（暂无记录）');
recent.forEach(row => {
  console.log([
    row.last_seen_at,
    mask(row.ip),
    `x${row.visit_count}`,
    row.onboarded ? '已确认' : '未确认',
    row.path || '—',
    (row.user_agent || '—').slice(0, 60),
  ].join('　'));
});

closeDatabase();
