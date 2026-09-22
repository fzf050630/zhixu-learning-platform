'use strict';

/* 只读数据库观察台的鉴权：请求头 X-Zhixu-Admin 必须等于 ZHIXU_ADMIN_TOKEN。
   未配置令牌时整套管理接口直接关闭（403），避免默认开放。
   令牌比较使用定时安全比较，防止时序侧信道。 */
const crypto = require('node:crypto');
const config = require('../config.cjs');
const { HttpError } = require('./errors.cjs');

function adminEnabled() {
  return Boolean(config.admin.token);
}

function requireAdmin(request) {
  if (!adminEnabled()) {
    throw new HttpError(403, 'ADMIN_DISABLED', '未配置 ZHIXU_ADMIN_TOKEN，管理接口已关闭');
  }
  const header = request.headers['x-zhixu-admin'];
  const given = typeof header === 'string' ? header.trim() : '';
  const expected = config.admin.token;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (!given || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new HttpError(401, 'UNAUTHORIZED', '管理令牌无效');
  }
  return true;
}

module.exports = { requireAdmin, adminEnabled };
