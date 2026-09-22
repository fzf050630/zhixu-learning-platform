'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zhixu-security-'));
process.env.ZHIXU_DB = path.join(tempDir, 'security.db');
process.env.ZHIXU_STATIC = path.join(tempDir, 'no-dist');
process.env.ZHIXU_JEV_ENABLED = 'false';
process.env.ZHIXU_REQUIRE_SESSION = 'true';
process.env.ZHIXU_RATE_PER_MIN = '500';
process.env.ZHIXU_RATE_PER_DAY = '20000';
process.env.ZHIXU_SESSION_SECRET = 'test-secret-for-security-suite';

const app = require('../../server/index.cjs');
const session = require('../../server/lib/session.cjs');
const config = require('../../server/config.cjs');
const jevBudget = require('../../server/services/jevBudget.cjs');
const { getDatabase } = require('../../server/db/database.cjs');

const NODE_ID = 'data-structures:lab/avl-rotations';
let base;

function post(pathname, body, headers = {}) {
  return fetch(base + pathname, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function eventBody(type = 'QUESTION_SUBMIT') {
  return { knowledgeNodeId: NODE_ID, type, data: { questionId: 'q1', correct: true, attempt: 1 } };
}

test.before(async () => {
  const server = await app.start(0, '127.0.0.1');
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await app.stop();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('没有设备令牌时写接口返回 401，不落库', async () => {
  const response = await post('/api/learning/events', eventBody(), { 'X-Zhixu-User': 'attacker-1' });
  assert.equal(response.status, 401);
  const body = await response.json();
  assert.equal(body.error.code, 'UNAUTHORIZED');
  const count = getDatabase().prepare('SELECT COUNT(*) AS n FROM zx_learning_event').get();
  assert.equal(Number(count.n), 0, '未授权的请求不能写入任何数据');
});

test('伪造或篡改的令牌被拒绝', async () => {
  const issued = await (await post('/api/session', { userId: 'forger-1' })).json();
  assert.ok(issued.token);
  const [payload] = issued.token.split('.');

  const tampered = await post('/api/learning/events', eventBody(), {
    'X-Zhixu-Token': payload + '.deadbeef',
  });
  assert.equal(tampered.status, 401);

  const forged = session.issue('victim-1', { secret: 'another-secret', ttlMs: 60000 });
  const rejected = await post('/api/learning/events', eventBody(), { 'X-Zhixu-Token': forged });
  assert.equal(rejected.status, 401, '用别的密钥签发的令牌必须无效');

  const expired = session.issue('victim-2', { secret: config.session.secret, ttlMs: -1000 });
  const expiredResponse = await post('/api/learning/events', eventBody(), { 'X-Zhixu-Token': expired });
  assert.equal(expiredResponse.status, 401, '过期令牌必须无效');
});

test('身份取自令牌，忽略客户端自称的 userId', async () => {
  const sessionData = await (await post('/api/session', { userId: 'owner-1' })).json();
  const response = await post('/api/learning/events', eventBody(), {
    'X-Zhixu-Token': sessionData.token,
    'X-Zhixu-User': 'someone-else',      // 头部自称无效
  });
  assert.equal(response.status, 202);

  const own = getDatabase().prepare('SELECT COUNT(*) AS n FROM zx_learning_event WHERE user_id = ?').get('owner-1');
  const other = getDatabase().prepare('SELECT COUNT(*) AS n FROM zx_learning_event WHERE user_id = ?').get('someone-else');
  assert.equal(Number(own.n), 1, '数据必须记在令牌对应的身份下');
  assert.equal(Number(other.n), 0, '不能把数据写到自称的 userId 下');
});

test('申请令牌时可以沿用本地设备标识', async () => {
  const adopted = await (await post('/api/session', { userId: 'device-from-before' })).json();
  assert.equal(adopted.userId, 'device-from-before');
  assert.equal(adopted.adopted, true);

  const fresh = await (await post('/api/session', {})).json();
  assert.match(fresh.userId, /^u-/, '未提供标识时由服务端随机生成');
  assert.equal(fresh.adopted, false);
});

test('设备令牌可以正常读取自己的掌握度数据', async () => {
  const sessionData = await (await post('/api/session', { userId: 'reader-1' })).json();
  const headers = { 'X-Zhixu-Token': sessionData.token };
  for (const pathname of ['/api/learning/overview', '/api/learning/heatmap', '/api/learning/reviews']) {
    const response = await fetch(base + pathname, { headers });
    assert.equal(response.status, 200, pathname + ' 应可用');
  }
  const withoutToken = await fetch(base + '/api/learning/overview', { headers: { 'X-Zhixu-User': 'reader-1' } });
  assert.equal(withoutToken.status, 401, '读取用户数据同样需要令牌');
});

test('访问记录接口需要令牌，聚合计数不需要', async () => {
  const denied = await post('/api/visit', { visitId: 'no-token:2026-09-22' });
  assert.equal(denied.status, 401);

  const sessionData = await (await post('/api/session', { userId: 'visitor-1' })).json();
  const accepted = await post('/api/visit', { visitId: 'visitor-1:2026-09-22' }, { 'X-Zhixu-Token': sessionData.token });
  assert.equal(accepted.status, 202);

  const count = await fetch(base + '/api/visit/count');
  assert.equal(count.status, 200);
  assert.ok((await count.json()).visitors >= 1);
});

test('事件批量条数有上限', async () => {
  const sessionData = await (await post('/api/session', { userId: 'batch-1' })).json();
  const response = await post('/api/learning/events', {
    events: Array.from({ length: 201 }, (_, i) => ({ ...eventBody('QUESTION_SUBMIT'), eventId: 'batch-1-' + i })),
  }, { 'X-Zhixu-Token': sessionData.token });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error.message, /最多/);
});

test('Jev 成本保险丝：单 IP 与全局限额都会触发回退', async () => {
  const original = { ip: config.jev.dailyLimitPerIp, global: config.jev.dailyLimit };
  try {
    jevBudget.reset();
    config.jev.dailyLimitPerIp = 2;
    config.jev.dailyLimit = 100;
    assert.equal(jevBudget.tryConsume('203.0.113.9').allowed, true);
    assert.equal(jevBudget.tryConsume('203.0.113.9').allowed, true);
    const blocked = jevBudget.tryConsume('203.0.113.9');
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.scope, 'ip');
    assert.equal(jevBudget.tryConsume('203.0.113.10').allowed, true, '其他 IP 不受影响');

    // 全局额度：用当日调用日志估算（重启后依然有效）
    config.jev.dailyLimitPerIp = 100;
    config.jev.dailyLimit = 1;
    const day = new Date().toISOString();
    getDatabase().prepare(`
      INSERT INTO zx_jev_call_log (request_id, user_id, knowledge_node_id, model, success, created_at)
      VALUES (?, ?, ?, ?, 1, ?)
    `).run('cost-1', 'someone', NODE_ID, 'jev-test', day);
    jevBudget.reset();
    const globalBlocked = jevBudget.tryConsume('198.51.100.5');
    assert.equal(globalBlocked.allowed, false);
    assert.equal(globalBlocked.scope, 'global');
    assert.equal(jevBudget.snapshot().globalUsed >= 1, true);
  } finally {
    config.jev.dailyLimitPerIp = original.ip;
    config.jev.dailyLimit = original.global;
    jevBudget.reset();
  }
});
