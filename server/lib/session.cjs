'use strict';

/* 服务端签发的设备令牌：HMAC-SHA256 签名的不透明令牌，绑定一个匿名设备 id。
   目的：用户数据的 userId 由令牌决定，客户端无法随意冒充别人的 id；
   不涉及注册、不采集身份信息，令牌里只有一个随机设备标识与有效期。 */
const crypto = require('node:crypto');

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function issue(uid, { secret, ttlMs }) {
  const payload = Buffer.from(JSON.stringify({ uid, iat: Date.now(), exp: Date.now() + ttlMs })).toString('base64url');
  return payload + '.' + sign(payload, secret);
}

function verify(token, { secret }) {
  if (typeof token !== 'string' || !token || token.length > 4096 || !secret) return null;
  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) return null;
  const payload = token.slice(0, dot);
  const expected = sign(payload, secret);
  const given = token.slice(dot + 1);
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const uid = sanitizeUid(data && data.uid);
    if (!uid) return null;
    const expiresAt = Number(data.exp) || 0;
    if (expiresAt && Date.now() > expiresAt) return null;
    return { uid, issuedAt: Number(data.iat) || null, expiresAt: expiresAt || null };
  } catch (_) {
    return null;
  }
}

function randomUid() {
  return 'u-' + Date.now().toString(36) + '-' + crypto.randomBytes(6).toString('hex');
}

/* 与前端 localStorage 里的设备标识保持同一字符集，便于老用户沿用历史数据。 */
function sanitizeUid(value) {
  const text = String(value === undefined || value === null ? '' : value).trim().slice(0, 64);
  return /^[\w:.-]+$/.test(text) ? text : '';
}

function randomSecret() {
  return crypto.randomBytes(32).toString('base64url');
}

module.exports = { issue, verify, randomUid, sanitizeUid, randomSecret };
