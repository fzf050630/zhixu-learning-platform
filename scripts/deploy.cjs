'use strict';

/* 知序 · 一键部署到服务器（本地运行）
   1) 构建 dist 与节点注册表
   2) 打包前端与后端
   3) 上传并在服务器执行 deploy/zhixu-remote.sh
   密钥从本地 .env 的 TYPESAFE_API_KEY 读取，不会写入仓库。

   用法：npm run deploy   （可用 ZHIXU_DEPLOY_HOST 指定 SSH 别名，默认 my-server）
*/

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const host = process.env.ZHIXU_DEPLOY_HOST || 'my-server';

require(path.join(root, 'server', 'lib', 'env.cjs')).loadEnv(path.join(root, '.env'));
const apiKey = process.env.TYPESAFE_API_KEY || '';
if (!apiKey) {
  console.error('缺少 TYPESAFE_API_KEY：请在项目根目录的 .env 中填写后再部署。');
  process.exit(1);
}

/* 设备令牌签名密钥：只存在本地 .env 与服务器 .env，不进仓库。
   首次部署时自动生成并写回本地 .env，保证多次部署之间令牌不失效。 */
let sessionSecret = process.env.ZHIXU_SESSION_SECRET || '';
if (!sessionSecret) {
  sessionSecret = require('node:crypto').randomBytes(32).toString('base64url');
  fs.appendFileSync(path.join(root, '.env'), '\nZHIXU_SESSION_SECRET=' + sessionSecret + '\n');
  console.log('已生成 ZHIXU_SESSION_SECRET 并写入本地 .env（.env 不入库）');
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'zhixu-deploy-'));
const run = (command, args, options) => execFileSync(command, args, { stdio: 'inherit', ...(options || {}) });

try {
  console.log('== 构建 ==');
  run(process.execPath, [path.join(root, 'scripts', 'build.cjs')], { cwd: root });

  console.log('== 打包 ==');
  const site = path.join(temp, 'site.tar.gz');
  const backend = path.join(temp, 'backend.tar.gz');
  run('tar', ['-czf', site, '-C', path.join(root, 'dist'), '.']);
  run('tar', [
    '-czf', backend,
    '--exclude=server/data/*.db',
    '--exclude=server/data/*.db-wal',
    '--exclude=server/data/*.db-shm',
    '-C', root, 'server', 'scripts/catalog.cjs', 'scripts/visits-report.cjs', 'package.json',
  ]);

  console.log('== 生成远程脚本 ==');
  const template = fs.readFileSync(path.join(root, 'deploy', 'zhixu-remote.sh'), 'utf8');
  const scriptPath = path.join(temp, 'deploy.sh');
  fs.writeFileSync(scriptPath, template.replace('__API_KEY__', apiKey).replace(/__SESSION_SECRET__/g, sessionSecret));

  console.log('== 上传到 ' + host + ' ==');
  run('scp', ['-o', 'BatchMode=yes', site, backend, scriptPath, host + ':/tmp/']);

  console.log('== 远程部署 ==');
  run('ssh', ['-o', 'BatchMode=yes', host, 'bash /tmp/deploy.sh']);

  console.log('部署完成。');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
