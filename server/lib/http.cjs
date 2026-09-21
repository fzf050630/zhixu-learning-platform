'use strict';

const { HttpError, badRequest } = require('./errors.cjs');

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

module.exports = { createRouter, sendJson, sendError, readJsonBody, resolveUserId, MAX_BODY_BYTES };
