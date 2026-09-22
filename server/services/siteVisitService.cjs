'use strict';

/* 站点访问记录：把请求自带的匿名网络信息整理成一行访问记录。
   只记录请求本身携带的网络/环境字段，不做第三方 IP 归属地查询，
   因此不会把你的 IP 发给站外服务。 */
const crypto = require('node:crypto');
const repository = require('../repositories/siteVisitRepository.cjs');
const { clientAddress } = require('../lib/client.cjs');

const LIMITS = {
  visitId: 96,
  userId: 64,
  ip: 64,
  forwardedFor: 256,
  userAgent: 400,
  referer: 400,
  acceptLanguage: 160,
  path: 200,
  screen: 40,
  timezone: 80,
  language: 40,
};

function clean(value, max) {
  if (value === undefined || value === null) return null;
  // 去掉控制字符，避免把换行/空字节写进数据库
  const text = String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  return text ? text.slice(0, max) : null;
}

function record(request, body = {}) {
  const { ip, forwardedFor } = clientAddress(request);
  const result = repository.upsert({
    visitId: clean(body.visitId, LIMITS.visitId) || crypto.randomUUID(),
    userId: clean(body.userId, LIMITS.userId),
    ip,
    forwardedFor,
    userAgent: clean(request.headers['user-agent'], LIMITS.userAgent),
    referer: clean(request.headers.referer, LIMITS.referer),
    acceptLanguage: clean(request.headers['accept-language'], LIMITS.acceptLanguage),
    path: clean(body.path, LIMITS.path),
    screen: clean(body.screen, LIMITS.screen),
    timezone: clean(body.timezone, LIMITS.timezone),
    language: clean(body.language, LIMITS.language),
    onboarded: Boolean(body.onboarded),
  });
  return {
    visitId: result.visitId,
    firstVisit: result.firstVisit,
    onboarded: Boolean(result.row && result.row.onboarded),
    visitCount: result.row ? result.row.visit_count : 1,
  };
}

function count() {
  return repository.count();
}

module.exports = { record, count, clean, clientAddress, LIMITS };
