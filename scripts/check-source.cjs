/* 源码直检（无需构建）：直接以 file:// 打开科目源码页，逐个入口检查
   组件报错、控制台异常、页面溢出与文本越界。
   用法：
     node scripts/check-source.cjs 计算机网络可视化            # 全部入口
     node scripts/check-source.cjs 计算机网络可视化 ch3-s3 ch4-s2
   可选：--width=390 指定视口宽度（默认 1440）。 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { chromium } = require('../数据结构可视化/node_modules/playwright');
require('../数据结构可视化/tests/browser/windows-cleanup.cjs');

const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const directory = args.find(a => !a.startsWith('--'));
if (!directory) { console.error('用法：node scripts/check-source.cjs <科目目录> [hash...] [--width=1440]'); process.exit(2); }
const widthArg = args.find(a => a.startsWith('--width='));
const width = widthArg ? Number(widthArg.split('=')[1]) : 1440;
const hashes = args.filter(a => !a.startsWith('--') && a !== directory);

const subjectFile = path.join(root, directory, 'index.html');
if (!fs.existsSync(subjectFile)) { console.error('找不到科目目录：' + directory); process.exit(2); }

function loadEntries() {
  if (directory === '数据结构可视化') {
    const sandbox = { console };
    sandbox.window = sandbox;
    const context = vm.createContext(sandbox);
    const html = fs.readFileSync(subjectFile, 'utf8');
    for (const match of html.matchAll(/<script\s+src="([^"]+)"/g)) {
      if (!/^(content\/|assets\/js\/algorithms\/|assets\/js\/core\/(input-validation|graph-input)\.js)/.test(match[1])) continue;
      vm.runInContext(fs.readFileSync(path.join(root, directory, match[1]), 'utf8'), context, { filename: match[1] });
    }
    return sandbox.DS.Content.experiments.map(e => ({ hash: '#/lab/' + e.id, title: e.title }));
  }
  const html = fs.readFileSync(subjectFile, 'utf8');
  const scriptSrc = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m => m[1]);
  const chapters = scriptSrc.filter(s => /^content\/ch\d+\.js$/.test(s)).length;
  const sandbox = { console };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  for (const src of scriptSrc) {
    if (!/^content\//.test(src)) continue;
    const full = path.join(root, directory, src);
    if (fs.existsSync(full)) vm.runInContext(fs.readFileSync(full, 'utf8'), context, { filename: src });
  }
  const entries = [];
  for (let i = 1; i <= chapters; i++) {
    const chapter = sandbox['CH' + i];
    if (!chapter) continue;
    for (const section of chapter.sections) entries.push({ hash: '#' + section.id, title: section.num + ' ' + section.title });
  }
  return entries;
}

const inspect = () => {
  const out = [];
  const text = document.body.innerText || '';
  if (text.includes('组件加载失败')) out.push('组件加载失败');
  if (/组件 [\w$]+ 未实现/.test(text)) out.push('组件未实现');
  if (document.querySelector('.katex-error')) out.push('KaTeX 错误');
  if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push('页面横向溢出');
  const body = document.querySelector('.viz-body, .stage-panel');
  return out;
};

(async () => {
  const entries = loadEntries().filter(e => !hashes.length || hashes.some(h => e.hash.includes(h)));
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width, height: 960 } });
  let errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + String(e.message).split('\n')[0].slice(0, 160)));
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text().split('\n')[0].slice(0, 160)); });
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith('file://')) errors.push(r.status() + ' ' + r.url().slice(-80)); });
  const fileURL = pathToFileURL(subjectFile).href;
  let failed = 0;
  for (const entry of entries) {
    errors = [];
    try {
      await page.goto(fileURL + entry.hash, { waitUntil: 'load', timeout: 20000 });
      if (directory === '数据结构可视化') await page.waitForSelector('#labView:not([hidden])', { timeout: 12000 });
      else await page.waitForSelector('#view .sec-title', { timeout: 12000 });
      await page.waitForTimeout(directory === '数据结构可视化' ? 850 : 700);
      const problems = await page.evaluate(inspect);
      const unique = [...new Set(errors)].filter(x => !/favicon/i.test(x));
      if (problems.length || unique.length) {
        failed++;
        console.log(`✗ ${entry.hash} ${entry.title}`);
        problems.forEach(p => console.log('    ! ' + p));
        unique.slice(0, 4).forEach(e => console.log('    · ' + e));
      } else console.log(`✓ ${entry.hash} ${entry.title}`);
    } catch (error) {
      failed++;
      console.log(`✗ ${entry.hash} ${entry.title} :: ${String(error.message).split('\n')[0].slice(0, 120)}`);
    }
  }
  console.log(`\n${directory}：${entries.length - failed}/${entries.length} 通过，${failed} 个问题页面`);
  await browser.close();
  process.exitCode = failed ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
