'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zhixu-visit-'));
process.env.ZHIXU_DB = path.join(tempDir, 'visit.db');
process.env.ZHIXU_STATIC = path.join(tempDir, 'no-dist');
process.env.ZHIXU_JEV_ENABLED = 'false';

const app = require('../../server/index.cjs');
const repository = require('../../server/repositories/siteVisitRepository.cjs');

let base;

function post(body, headers = {}) {
  return fetch(base + '/api/visit', {
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
});

test('访问记录写入网络信息并可按 visitId 累计', async () => {
  const first = await post(
    { visitId: 'device-a:2026-09-22', path: '#/overview', screen: '1440x900', timezone: 'Asia/Shanghai', language: 'zh-CN' },
    { 'X-Forwarded-For': '203.0.113.7, 10.0.0.1', 'User-Agent': 'Mozilla/5.0 TestAgent', Referer: 'https://recaord.top/', 'Accept-Language': 'zh-CN,zh;q=0.9' },
  );
  assert.equal(first.status, 202);
  const created = await first.json();
  assert.equal(created.recorded, true);
  assert.equal(created.firstVisit, true);
  assert.equal(created.onboarded, false);

  const row = repository.findById('device-a:2026-09-22');
  assert.equal(row.ip, '203.0.113.7', '反向代理下应取 X-Forwarded-For 首段');
  assert.equal(row.forwarded_for, '203.0.113.7, 10.0.0.1');
  assert.equal(row.user_agent, 'Mozilla/5.0 TestAgent');
  assert.equal(row.referer, 'https://recaord.top/');
  assert.equal(row.accept_language, 'zh-CN,zh;q=0.9');
  assert.equal(row.screen, '1440x900');
  assert.equal(row.timezone, 'Asia/Shanghai');
  assert.equal(row.visit_count, 1);
  assert.ok(row.created_at && row.last_seen_at, '需要记录时间');

  const again = await (await post({ visitId: 'device-a:2026-09-22' }, { 'X-Forwarded-For': '203.0.113.7' })).json();
  assert.equal(again.firstVisit, false, '同一 visitId 再次上报不算新访客');
  assert.equal(again.visitCount, 2);
  assert.equal(repository.findById('device-a:2026-09-22').visit_count, 2);
});

test('确认首次说明后 onboarded 置位且不回退', async () => {
  const body = { visitId: 'device-b:2026-09-22', onboarded: true, path: '#' };
  const result = await (await post(body, { 'X-Real-IP': '198.51.100.24' })).json();
  assert.equal(result.onboarded, true);
  assert.equal(repository.findById('device-b:2026-09-22').ip, '198.51.100.24', '无 XFF 时回退 X-Real-IP');

  await post({ visitId: 'device-b:2026-09-22', onboarded: false });
  assert.equal(repository.findById('device-b:2026-09-22').onboarded, 1, 'onboarded 只能从 0 变 1');
});

test('超长与含控制字符的字段被截断清理，不会写入换行', async () => {
  const longAgent = 'A'.repeat(900);
  await post({ visitId: 'device-c:2026-09-22', path: 'x\u0000y\nz', screen: 'S'.repeat(120) }, { 'User-Agent': longAgent });
  const row = repository.findById('device-c:2026-09-22');
  assert.equal(row.user_agent.length, 400);
  assert.equal(row.path, 'x y z');
  assert.equal(row.screen.length, 40);
});

test('聚合计数接口只返回数字，不暴露 IP 与明细', async () => {
  const response = await fetch(base + '/api/visit/count');
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(typeof data.visitors, 'number');
  assert.equal(typeof data.hits, 'number');
  assert.equal(typeof data.onboarded, 'number');
  assert.ok(data.visitors >= 3, '至少记录了三个 visitId');
  const text = JSON.stringify(data);
  assert.ok(!/203\.0\.113|198\.51\.100|Mozilla/.test(text), '聚合接口不能泄露 IP 或 UA');
});

test('非法请求体被拒绝，不产生访问记录', async () => {
  const before = repository.count().visitors;
  const broken = await post('{not json');
  assert.equal(broken.status, 400);
  assert.equal(repository.count().visitors, before, '解析失败不应写入记录');
});
