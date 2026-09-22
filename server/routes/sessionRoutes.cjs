'use strict';

/* 设备令牌接口：POST /api/session
   服务端签发 HMAC 签名的匿名设备令牌；用户数据接口都用令牌里的 uid 作为身份，
   因此客户端无法冒充别人的 userId。仍然无需注册，也不采集任何身份信息。
   首次可以带上本地已有的设备标识来沿用历史数据（标识是随机串，猜不到别人的）。 */
const { sendJson, readJsonBody } = require('../lib/http.cjs');
const rateLimit = require('../lib/rateLimit.cjs');
const { clientAddress } = require('../lib/client.cjs');
const config = require('../config.cjs');
const session = require('../lib/session.cjs');

function register(router) {
  router.post('/api/session', async (request, response) => {
    rateLimit.guard(clientAddress(request).ip);
    const body = await readJsonBody(request);
    const claimed = session.sanitizeUid((body && body.userId) || request.headers['x-zhixu-user']);
    const userId = claimed || session.randomUid();
    const expiresAt = Date.now() + config.session.ttlMs;
    sendJson(response, 200, {
      userId,
      adopted: Boolean(claimed),
      token: session.issue(userId, { secret: config.session.secret, ttlMs: config.session.ttlMs }),
      expiresAt: new Date(expiresAt).toISOString(),
      required: config.session.require,
    });
  });
}

module.exports = { register };
