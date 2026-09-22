'use strict';

/* 访问记录接口：
   POST /api/visit       记录一次访问（需要有效设备令牌；确认说明后再次调用标记 onboarded）
   GET  /api/visit/count 返回聚合计数，便于健康检查与前端展示；不返回任何 IP 或明细。 */
const { sendJson, readJsonBody, resolveIdentity } = require('../lib/http.cjs');
const rateLimit = require('../lib/rateLimit.cjs');
const { clientAddress } = require('../lib/client.cjs');
const siteVisitService = require('../services/siteVisitService.cjs');

function register(router) {
  router.post('/api/visit', async (request, response) => {
    rateLimit.guard(clientAddress(request).ip);
    const body = await readJsonBody(request);
    const identity = resolveIdentity(request, body);
    const result = siteVisitService.record(request, { ...body, userId: identity.userId });
    sendJson(response, 202, { recorded: true, ...result });
  });

  router.get('/api/visit/count', (request, response) => {
    sendJson(response, 200, siteVisitService.count());
  });
}

module.exports = { register };
