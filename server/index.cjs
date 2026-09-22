'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.cjs');
const logger = require('./lib/logger.cjs');
const { createRouter, sendJson, sendError } = require('./lib/http.cjs');
const { openDatabase, closeDatabase } = require('./db/database.cjs');
const learningRoutes = require('./routes/learningRoutes.cjs');
const siteVisitRoutes = require('./routes/siteVisitRoutes.cjs');
const sessionRoutes = require('./routes/sessionRoutes.cjs');
const adminRoutes = require('./routes/adminRoutes.cjs');

const router = createRouter();

router.get('/healthz', (request, response) => {
  sendJson(response, 200, {
    status: 'ok',
    algorithmVersion: config.algorithmVersion,
    jevEnabled: config.jev.enabled,
    time: new Date().toISOString(),
  });
});

// 供反向代理下的前端做连通性探测（与 /healthz 等价）。
router.get('/api/healthz', (request, response) => {
  sendJson(response, 200, {
    status: 'ok',
    algorithmVersion: config.algorithmVersion,
    jevEnabled: config.jev.enabled,
    time: new Date().toISOString(),
  });
});

learningRoutes.register(router);
siteVisitRoutes.register(router);
sessionRoutes.register(router);
adminRoutes.register(router);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
};

function applyCors(request, response) {
  const origin = request.headers.origin;
  if (!origin) return;
  response.setHeader('Access-Control-Allow-Origin', origin);
  response.setHeader('Vary', 'Origin');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Zhixu-User');
  response.setHeader('Access-Control-Max-Age', '600');
}

function serveStatic(request, response, pathname) {
  const root = config.staticDir;
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    sendJson(response, 503, { error: { code: 'NO_BUILD', message: '尚未构建静态站点，请先运行 npm run build' } });
    return;
  }
  let file = path.resolve(root, '.' + decodeURIComponent(pathname));
  if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('页面不存在');
    return;
  }
  const real = fs.realpathSync(file);
  if (!real.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  response.writeHead(200, {
    'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  if (request.method === 'HEAD') response.end();
  else fs.createReadStream(file).on('error', () => response.destroy()).pipe(response);
}

const server = http.createServer(async (request, response) => {
  applyCors(request, response);
  if (request.method === 'OPTIONS') { response.writeHead(204).end(); return; }

  let url;
  try {
    url = new URL(request.url, 'http://localhost');
  } catch (_) {
    response.writeHead(400).end('Bad request');
    return;
  }

  const matched = router.match(request.method, url.pathname);
  if (matched) {
    try {
      await matched.handler(request, response, matched.params, url);
    } catch (error) {
      if (!response.headersSent) sendError(response, error);
      else response.destroy();
      if (!error.status) logger.error('请求处理异常', { path: url.pathname, error: error.message });
    }
    return;
  }

  if (['GET', 'HEAD'].includes(request.method)) {
    serveStatic(request, response, url.pathname);
    return;
  }

  const allowed = router.methodsFor(url.pathname);
  if (allowed.length) response.writeHead(405, { Allow: allowed.join(', ') }).end();
  else sendJson(response, 404, { error: { code: 'NOT_FOUND', message: '接口不存在' } });
});

function openBrowser(url) {
  const { spawn } = require('node:child_process');
  const platform = process.platform;
  const command = platform === 'win32' ? 'cmd' : platform === 'darwin' ? 'open' : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', url] : [url];
  try {
    spawn(command, args, { detached: true, stdio: 'ignore' }).unref();
  } catch (_) { /* 打不开浏览器不影响服务 */ }
}

function start(port = config.port, host = config.host) {
  openDatabase();
  if (!process.env.ZHIXU_SESSION_SECRET) {
    logger.warn('未配置 ZHIXU_SESSION_SECRET：本次启动的设备令牌在重启后会失效（前端会自动重新申请）');
  }
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      const address = server.address();
      const url = `http://${host}:${address.port}/`;
      logger.info('知序后端已启动', {
        url,
        db: config.dbPath,
        jevEnabled: config.jev.enabled,
        requireSession: config.session.require,
        rateLimit: config.rateLimit,
      });
      if (config.open) openBrowser(url);
      resolve(server);
    });
  });
}

function stop() {
  return new Promise(resolve => {
    server.close(() => { closeDatabase(); resolve(); });
    if (typeof server.closeAllConnections === 'function') server.closeAllConnections();
  });
}

module.exports = { server, router, start, stop };

if (require.main === module) {
  start().catch(error => {
    logger.error('后端启动失败', { error: error.message });
    process.exit(1);
  });
  process.on('SIGINT', () => { stop().then(() => process.exit(0)); });
  process.on('SIGTERM', () => { stop().then(() => process.exit(0)); });
}
