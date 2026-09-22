'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zhixu-admin-'));
process.env.ZHIXU_DB = path.join(tempDir, 'admin.db');
process.env.ZHIXU_STATIC = path.join(tempDir, 'no-dist');
process.env.ZHIXU_JEV_ENABLED = 'false';
process.env.ZHIXU_REQUIRE_SESSION = 'true';
process.env.ZHIXU_RATE_PER_MIN = '2000';
process.env.ZHIXU_RATE_PER_DAY = '20000';
process.env.ZHIXU_ADMIN_TOKEN = 'test-admin-token-1234567890';
const ADMIN = process.env.ZHIXU_ADMIN_TOKEN;

const app = require('../../server/index.cjs');
const config = require('../../server/config.cjs');

let base;

function admin(pathname, options = {}) {
  return fetch(base + pathname, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'X-Zhixu-Admin': ADMIN, ...(options.headers || {}) },
  });
}

test.before(async () => {
  const server = await app.start(0, '127.0.0.1');
  base = `http://127.0.0.1:${server.address().port}`;

  // 造一条带 IP 的访问记录，便于验证打码
  const session = await (await fetch(base + '/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'admin-test-device' }),
  })).json();
  await fetch(base + '/api/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Zhixu-Token': session.token, 'X-Forwarded-For': '203.0.113.55' },
    body: JSON.stringify({ visitId: 'admin-test-device:2026-09-22', path: '/math-modeling/', onboarded: true }),
  });
});

test.after(async () => {
  await app.stop();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('管理接口必须带正确令牌，否则 401', async () => {
  for (const pathname of ['/api/admin/overview', '/api/admin/tables']) {
    const missing = await fetch(base + pathname);
    assert.equal(missing.status, 401, pathname + ' 缺令牌应 401');
    const wrong = await fetch(base + pathname, { headers: { 'X-Zhixu-Admin': 'wrong-token' } });
    assert.equal(wrong.status, 401, pathname + ' 错令牌应 401');
    const ok = await admin(pathname);
    assert.equal(ok.status, 200, pathname + ' 正确令牌应 200');
  }
});

test('概览返回表行数、访问汇总、Jev 预算与运行配置', async () => {
  const response = await admin('/api/admin/overview');
  const body = await response.json();
  const names = body.tables.map(item => item.name);
  for (const table of ['zx_learning_event', 'zx_user_knowledge_state', 'zx_mastery_evaluation', 'zx_review_schedule', 'zx_jev_call_log', 'zx_site_visit']) {
    assert.ok(names.includes(table), '概览应包含表 ' + table);
  }
  assert.equal(body.visits.visitors, 1);
  assert.equal(body.visits.onboarded, 1);
  assert.ok(Array.isArray(body.visitsByDay) && body.visitsByDay.length >= 1);
  assert.equal(typeof body.jev.globalLimit, 'number');
  assert.equal(body.runtime.requireSession, true);
  assert.equal(typeof body.runtime.rateLimit.perMinute, 'number');
  assert.ok(!/203\.0\.113\.55/.test(JSON.stringify(body)), '概览不应泄露完整 IP');
});

test('表清单包含列定义，分页浏览默认对 IP 与 UA 打码', async () => {
  const tables = await (await admin('/api/admin/tables')).json();
  const visitTable = tables.tables.find(item => item.name === 'zx_site_visit');
  assert.ok(visitTable.columns.length >= 10);
  assert.ok(visitTable.columns.some(column => column.name === 'ip'));

  const masked = await (await admin('/api/admin/table/zx_site_visit?limit=10')).json();
  assert.equal(masked.table, 'zx_site_visit');
  assert.equal(masked.total, 1);
  assert.equal(masked.masked, true);
  assert.equal(masked.rows[0].ip, '203.0.113.x');
  assert.ok(masked.rows[0].onboarded === 1);

  const full = await (await admin('/api/admin/table/zx_site_visit?mask=0')).json();
  assert.equal(full.rows[0].ip, '203.0.113.55');
});

test('未知表返回 404，不做任何字符串拼接', async () => {
  const response = await admin('/api/admin/table/sqlite_master');
  assert.equal(response.status, 404);
  const injected = await admin('/api/admin/table/zx_site_visit%3B%20DROP%20TABLE%20zx_site_visit');
  assert.equal(injected.status, 404);
  const stillThere = await (await admin('/api/admin/table/zx_site_visit')).json();
  assert.equal(stillThere.total, 1, '注入尝试不应影响数据');
});

test('只读 SQL：允许 SELECT，拒绝写操作与多语句', async () => {
  const ok = await admin('/api/admin/query', {
    method: 'POST',
    body: JSON.stringify({ sql: 'SELECT knowledge_node_id, mastery_score FROM zx_user_knowledge_state' }),
  });
  assert.equal(ok.status, 200);
  const okBody = await ok.json();
  assert.ok(Array.isArray(okBody.rows));
  assert.equal(typeof okBody.elapsedMs, 'number');

  // 字段写错时应回显原因（400），而不是 500
  const badColumn = await admin('/api/admin/query', { method: 'POST', body: JSON.stringify({ sql: 'SELECT nope FROM zx_site_visit' }) });
  assert.equal(badColumn.status, 400);
  assert.match((await badColumn.json()).error.message, /SQL 执行失败/);

  for (const sql of [
    "INSERT INTO zx_site_visit (visit_id) VALUES ('x')",
    'DROP TABLE zx_site_visit',
    'UPDATE zx_site_visit SET ip = NULL',
    'DELETE FROM zx_site_visit',
    'PRAGMA table_info(zx_site_visit)',
    'SELECT 1; SELECT 2',
    'SELECT 1; DROP TABLE zx_site_visit',
  ]) {
    const response = await admin('/api/admin/query', { method: 'POST', body: JSON.stringify({ sql }) });
    assert.equal(response.status, 400, '应拒绝：' + sql);
  }

  const counts = await (await admin('/api/admin/overview')).json();
  assert.equal(counts.visits.visitors, 1, '被拒的写操作不能改动数据');
});

test('查询结果行数被强制截断', async () => {
  const original = config.admin.maxRows;
  try {
    config.admin.maxRows = 2;
    const response = await admin('/api/admin/query', {
      method: 'POST',
      body: JSON.stringify({ sql: "SELECT name FROM sqlite_master WHERE type = 'table'" }),
    });
    const body = await response.json();
    assert.equal(body.rows.length, 2);
    assert.equal(body.truncated, true);
  } finally {
    config.admin.maxRows = original;
  }
});
