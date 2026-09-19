const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const portIndex = process.argv.indexOf('--port');
const port = Number(portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 8766);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('请先运行 npm run build');
const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  try {
    const url = new URL(request.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    // Test the same release beneath a prefix without changing any source files.
    if (pathname === '/preview') { response.writeHead(302, { Location: '/preview/' }).end(); return; }
    if (pathname.startsWith('/preview/')) pathname = pathname.slice('/preview'.length);
    if (pathname.includes('\\') || pathname.split('/').some(part => part.startsWith('.'))) { response.writeHead(403).end(); return; }
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(302, { Location: url.pathname + '/' + url.search }).end(); return; }
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('页面不存在'); return; }
    const real = fs.realpathSync(file);
    if (!real.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(file).on('error', () => response.destroy()).pipe(response);
  } catch (_) { response.writeHead(400).end('Bad request'); }
});
server.listen(port, '127.0.0.1', () => console.log(`知序本地预览：http://127.0.0.1:${port}/`));
