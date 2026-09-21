'use strict';

/* 知序 · 一键启动
   1) 若 dist 不存在则先构建静态站点
   2) 启动后端（同时提供 dist 与 /api）
   3) 自动打开浏览器
   用法：双击根目录「启动知序.cmd」，或运行 node scripts/launch.cjs
*/

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const distIndex = path.join(root, 'dist', 'index.html');

if (!fs.existsSync(distIndex)) {
  console.log('首次运行：正在构建静态站点（dist）…');
  execFileSync(process.execPath, [path.join(root, 'scripts', 'build.cjs')], { cwd: root, stdio: 'inherit' });
}

if (process.env.ZHIXU_OPEN === undefined) process.env.ZHIXU_OPEN = 'true';

const app = require(path.join(root, 'server', 'index.cjs'));

app.start().catch(error => {
  console.error('启动失败：' + error.message);
  if (String(error.code) === 'EADDRINUSE') {
    console.error('端口被占用，可设置环境变量 ZHIXU_PORT 换一个端口后重试。');
  }
  process.exit(1);
});
