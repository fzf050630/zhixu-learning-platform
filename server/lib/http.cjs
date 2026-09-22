'use strict';

const { HttpError, badRequest, unauthorized } = require('./errors.cjs');
const config = require('../config.cjs');
const session = require('./session.cjs');

const MAX_BODY_BYTES = 1024 * 256;

function compile(pattern) {
  const names = [];
  const source = pattern
    .split('/')
    .map(segment => {
      if (!segment.startsWith(':')) return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      names.push(segment.slice(1));
      return '([^/]+)';
    })
    .join('/');
  return { regex: new RegExp('^' + source + '/?$'), names };
}

function createRouter() {
  const routes = [];
  return {
    add(method, pattern, handler) {
      routes.push({ method: method.toUpperCase(), ...compile(pattern), handler });
      return this;
    },
    get(pattern, handler) { return this.add('GET', pattern, handler); },
    post(pattern, handler) { return this.add('POST', pattern, handler); },
    put(pattern, handler) { return this.add('PUT', pattern, handler); },
    match(method, pathname) {
      for (const route of routes) {
        if (route.method !== method.toUpperCase()) continue;
        const found = route.regex.exec(pathname);
        if (!found) continue;
        const params = {};
        route.names.forEach((name, index) => { params[name] = decodeURIComponent(found[index + 1]); });
        return { handler: route.handler, params };
      }
      return null;
    },
    methodsFor(pathname) {
      return routes.filter(route => route.regex.test(pathname)).map(route => route.method);
    },
  };
}

function sendJson(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  response.end(body);
}

function sendError(response, error) {
  if (error instanceof HttpError) {
    sendJson(response, error.status, { error: { code: error.code, message: error.message, details: error.details } });
    return;
  }
  sendJson(response, 500, { error: { code: 'INTERNAL', message: '服务器内部错误' } });
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, 'PAYLOAD_TOO_LARGE', '请求体过大'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      if (!chunks.length) { resolve({}); return; }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (_) {
        reject(badRequest('请求体不是合法 JSON'));
      }
    });
    request.on('error', reject);
  });
}

function resolveUserId(request, body) {
  const header = request.headers['x-zhixu-user'];
  const raw = (typeof header === 'string' && header.trim()) || (body && body.userId) || '';
  const value = String(raw).trim();
  if (!value) return 'anonymous';
  return value.slice(0, 64).replace(/[^\w:.-]/g, '');
}

/* 用户身份：优先使用服务端签发的设备令牌（令牌里的 uid 才是权威身份），
   这样客户端无法冒充别人的 userId。需要令牌但缺失/无效时抛 401；
   ZHIXU_REQUIRE_SESSION=false 时退回旧的「请求头自称 userId」模式。 */
function resolveIdentity(request, body) {
  const header = request.headers['x-zhixu-token'];
  const token = (typeof header === 'string' && header.trim()) || (body && body.token) || '';
  const verified = token ? session.verify(token, { secret: config.session.secret }) : null;
  if (verified) return { userId: verified.uid, verified: true, expiresAt: verified.expiresAt };
  if (token) throw unauthorized('设备令牌无效或已过期，请刷新页面');
  if (config.session.require) throw unauthorized('需要有效的设备令牌，请先申请：POST /api/session');
  return { userId: resolveUserId(request, body), verified: false };
}

module.exports = { createRouter, sendJson, sendError, readJsonBody, resolveUserId, resolveIdentity, MAX_BODY_BYTES };
