'use strict';

/* 解析客户端真实地址：反向代理下优先取 X-Forwarded-For 首段，其次 X-Real-IP，最后 socket 地址。
   限流与访问记录共用同一套判定，避免两处口径不一致。 */
function clean(value, max) {
  if (value === undefined || value === null) return null;
  const text = String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  return text ? text.slice(0, max) : null;
}

function clientAddress(request) {
  const forwardedFor = clean(request.headers['x-forwarded-for'], 256);
  const first = forwardedFor ? forwardedFor.split(',')[0].trim() : '';
  const realIp = clean(request.headers['x-real-ip'], 64);
  const socketIp = clean(request.socket && request.socket.remoteAddress, 64);
  return { ip: first || realIp || socketIp || null, forwardedFor };
}

module.exports = { clientAddress, clean };
