'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zhixu-api-'));
process.env.ZHIXU_DB = path.join(tempDir, 'test.db');
process.env.ZHIXU_STATIC = path.join(tempDir, 'no-dist');
process.env.ZHIXU_EVAL_MIN_INTERVAL_MS = '0';
process.env.ZHIXU_JEV_ENABLED = 'false';

const app = require('../../server/index.cjs');

const NODE_ID = 'data-structures:lab/avl-rotations';
const USER = 'test-user-1';
let base;
let token = '';

function api(pathname, options = {}) {
  return fetch(base + pathname, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-Zhixu-Token': token } : {}),
      'X-Zhixu-User': USER,
      ...(options.headers || {}),
    },
  });
}

function submit(correct, extra = {}) {
  return api('/api/learning/events', {
    method: 'POST',
    body: JSON.stringify({
      knowledgeNodeId: NODE_ID,
      type: 'QUESTION_SUBMIT',
      data: { questionId: 'q1', correct, attempt: 1, durationSeconds: 60, ...extra },
    }),
  });
}

test.before(async () => {
  const server = await app.start(0, '127.0.0.1');
  base = `http://127.0.0.1:${server.address().port}`;
  // 用户数据接口需要设备令牌；这里沿用固定 userId 以便断言历史数据
  const response = await fetch(base + '/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: USER }),
  });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.userId, USER);
  assert.ok(data.token);
  token = data.token;
});

test.after(async () => {
  await app.stop();
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('健康检查可用', async () => {
  const response = await api('/healthz');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.jevEnabled, false);
});

test('未知事件类型被拒绝', async () => {
  const response = await api('/api/learning/events', {
    method: 'POST',
    body: JSON.stringify({ knowledgeNodeId: NODE_ID, type: 'NOT_A_TYPE', data: {} }),
  });
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.error.code, 'BAD_REQUEST');
});

test('事件入库后掌握度从数据不足变为已评估', async () => {
  await submit(false, { hintUsed: true });
  await submit(true);
  const before = await api(`/api/knowledge/${encodeURIComponent(NODE_ID)}/mastery`);
  const beforeBody = await before.json();
  assert.equal(beforeBody.status, 'INSUFFICIENT_DATA');
  assert.equal(beforeBody.mastery, null);
  assert.equal(beforeBody.message, '完成一些练习后即可评估');

  const third = await submit(true);
  assert.equal(third.status, 202);

  const after = await api(`/api/knowledge/${encodeURIComponent(NODE_ID)}/mastery`);
  const afterBody = await after.json();
  assert.equal(afterBody.status, 'EVALUATED');
  assert.ok(afterBody.mastery.score >= 0 && afterBody.mastery.score <= 100);
  assert.ok(afterBody.recommendation.label);
  assert.ok(afterBody.recommendation.nextReviewAt);
});

test('重新评估返回三个独立分数与算法版本快照', async () => {
  const response = await api(`/internal/mastery/evaluate/${encodeURIComponent(NODE_ID)}`, { method: 'POST', body: '{}' });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'EVALUATED');
  assert.equal(typeof body.breakdown.ruleScore, 'number');
  assert.equal(body.breakdown.jevScore, null);
  assert.equal(typeof body.breakdown.finalScore, 'number');
  assert.ok(body.breakdown.components);
});

test('事件查询与复习计划可读取', async () => {
  const events = await (await api(`/api/learning/events?nodeId=${encodeURIComponent(NODE_ID)}`)).json();
  assert.equal(events.count, 3);

  const reviews = await (await api('/api/learning/reviews')).json();
  assert.ok(reviews.count >= 1);
  assert.equal(reviews.reviews[0].nodeId, NODE_ID);

  const overview = await (await api('/api/learning/overview')).json();
  assert.equal(overview.evaluatedNodes, 1);
  assert.equal(typeof overview.averageMastery, 'number');

  const heatmap = await (await api('/api/learning/heatmap')).json();
  assert.equal(heatmap.subjects.length, 1);
  assert.equal(heatmap.subjects[0].subject, 'data-structures');
  assert.equal(heatmap.subjects[0].chapters[0].chapter, '查找');
  assert.equal(typeof heatmap.overall.mastery, 'number');
});
