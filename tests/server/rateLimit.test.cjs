'use strict';

/* 限流用例单独一个进程：这里的每分钟阈值故意设得很低，避免影响其他安全用例。 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zhixu-ratelimit-'));
process.env.ZHIXU_DB = path.join(tempDir, 'ratelimit.db');
process.env.ZHIXU_STATIC = path.join(tempDir, 'no-dist');
process.env.ZHIXU_JEV_ENABLED = 'false';
process.env.ZHIXU_REQUIRE_SESSION = 'true';
process.env.ZHIXU_SESSION_SECRET = 'rate-limit-test-secret';
process.env.ZHIXU_RATE_PER_MIN = '4';
process.env.ZHIXU_RATE_PER_DAY = '7';

const app = require('../../server/index.cjs');
const NODE_ID = 'data-structures:lab/avl-rotations';
let base;

function post(pathname, body, headers = {}) {
  return fetch(base + pathname, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

test.before(async () => {
  const server = await app.start(0, '127.0.0.1');
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await app.stop();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('超过每分钟上限后返回 429，并带重试建议', async () => {
  const sessionData = await (await post('/api/session', { userId: 'flood-1' })).json();
  assert.ok(sessionData.token, '令牌接口本身也在限流范围内，第一次应放行');
  const headers = { 'X-Zhixu-Token': sessionData.token };

  const statuses = [];
  for (let i = 0; i < 8; i++) {
    const response = await post('/api/learning/events', {
      knowledgeNodeId: NODE_ID,
      type: 'QUESTION_CORRECT',
      data: { questionId: 'q' + i, correct: true, attempt: 1 },
      eventId: 'flood-' + i,
    }, headers);
    statuses.push(response.status);
    if (response.status === 429) {
      const body = await response.json();
      assert.equal(body.error.code, 'TOO_MANY_REQUESTS');
      assert.equal(body.error.details.scope, 'minute');
      assert.ok(body.error.details.retryAfterMs > 0, '应给出重试等待时间');
      const retryAfter = Number(response.headers.get('retry-after') || 0);
      assert.ok(retryAfter === 0 || retryAfter > 0);
    }
  }
  assert.ok(statuses.includes(429), '持续超量请求必须被限流：' + statuses.join(','));
  assert.ok(statuses.filter(code => code === 202).length <= 4, '放行数量不应超过每分钟阈值');
  assert.ok(statuses.indexOf(429) <= 7);
});

test('限流按 IP 维度：换一个来源 IP 仍然可用', async () => {
  const sessionData = await (await post('/api/session', { userId: 'flood-2' }, { 'X-Forwarded-For': '198.51.100.77' })).json();
  const response = await post('/api/learning/events', {
    knowledgeNodeId: NODE_ID,
    type: 'QUESTION_CORRECT',
    data: { questionId: 'other-ip', correct: true, attempt: 1 },
    eventId: 'other-ip-1',
  }, { 'X-Zhixu-Token': sessionData.token, 'X-Forwarded-For': '198.51.100.77' });
  assert.equal(response.status, 202, '另一个 IP 不应被前一个 IP 的限流影响');
});
