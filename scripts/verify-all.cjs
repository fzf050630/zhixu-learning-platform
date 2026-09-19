/* 全量页面检查：逐个访问七科每个学习入口，
   收集脚本错误、资源错误、组件失败、横向溢出与文本重叠。
   用法：node scripts/serve.cjs --port 8767 后运行 node scripts/verify-all.cjs */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../数据结构可视化/node_modules/playwright');
require('../数据结构可视化/tests/browser/windows-cleanup.cjs');
const { createCatalog } = require('./catalog.cjs');

const destination = path.resolve(__dirname, '../docs/verification/full');
fs.mkdirSync(destination, { recursive: true });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8767';
const subjectPaths = {
  'data-structures': '/subjects/data-structures/index.html',
  probability: '/subjects/probability/index.html',
  'computer-organization': '/subjects/computer-organization/index.html',
  'operating-systems': '/subjects/operating-systems/index.html',
  'computer-networks': '/subjects/computer-networks/index.html',
  calculus: '/subjects/calculus/index.html',
  'linear-algebra': '/subjects/linear-algebra/index.html',
};

const inspectPage = () => {
  const problems = [];
  const text = document.body.innerText || '';
  if (text.includes('组件加载失败')) problems.push('widget-crash');
  if (/组件 [\w$]+ 未实现/.test(text)) problems.push('widget-missing');
  if (document.querySelector('.katex-error')) problems.push('katex-error');
  if (document.documentElement.scrollWidth > window.innerWidth + 1) problems.push('page-overflow');
  return { problems, vizCount: document.querySelectorAll('.viz').length };
};

const inspectText = () => {
  const issues = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const rects = [];
  const clipToAncestors = (node, rect) => {
    let r = { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    let el = node.parentElement;
    while (el && el !== document.body) {
      const cs = getComputedStyle(el);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || cs.clipPath !== 'none') {
        const b = el.getBoundingClientRect();
        r = { left: Math.max(r.left, b.left), right: Math.min(r.right, b.right), top: Math.max(r.top, b.top), bottom: Math.min(r.bottom, b.bottom) };
        if (r.right <= r.left || r.bottom <= r.top) return null;
      }
      el = el.parentElement;
    }
    return r;
  };
  let node;
  while ((node = walker.nextNode())) {
    const value = (node.nodeValue || '').trim();
    if (value.length < 2) continue;
    const parent = node.parentElement;
    if (!parent) continue;
    const cs = getComputedStyle(parent);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0' || cs.clipPath !== 'none') continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.width < 2 || r.height < 2) continue;
      const clipped = clipToAncestors(node, r);
      if (!clipped) continue;
      rects.push({ r: clipped, tag: parent.tagName, cls: String(parent.className || '').slice(0, 40), area: clipped.width * clipped.height });
    }
  }
  for (const item of rects) {
    const { r } = item;
    if (r.left < -2 || r.right > window.innerWidth + 2) {
      issues.push(`outside-viewport:${item.tag}.${item.cls}:${Math.round(r.left)}..${Math.round(r.right)}`);
      if (issues.length > 12) break;
    }
  }
  for (let i = 0; i < rects.length && issues.length <= 12; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      if (a.tag === b.tag && a.cls === b.cls) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (w <= 0 || h <= 0) continue;
      const inter = w * h;
      const small = Math.min(a.area, b.area);
      if (inter > small * 0.42 && small > 60 && inter > 60) {
        issues.push(`overlap:${a.tag}.${a.cls}+${b.tag}.${b.cls}`);
        break;
      }
    }
  }
  return issues;
};

(async () => {
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const catalog = createCatalog();
  const report = { total: catalog.entries.length, checked: 0, failures: [], overlaps: [], widgetErrors: [], screenshots: [] };
  let pageErrors = [];
  let consoleErrors = [];
  let badResponses = [];
  page.on('pageerror', e => pageErrors.push(String(e.message).slice(0, 200)));
  page.on('console', m => { if (['error', 'warning'].includes(m.type()) && !m.text().includes('ERR_INTERNET')) consoleErrors.push(m.type() + ':' + m.text().slice(0, 200)); });
  page.on('response', r => { if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url().slice(-90)}`); });

  for (const entry of catalog.entries) {
    pageErrors = []; consoleErrors = []; badResponses = [];
    const url = base + subjectPaths[entry.subject] + entry.hash;
    let inspected = { problems: [], vizCount: 0 };
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      if (entry.subject === 'data-structures') await page.waitForSelector('#labView:not([hidden])', { timeout: 15000 });
      else await page.waitForSelector('#view .sec-title', { timeout: 15000 });
      await page.waitForTimeout(entry.subject === 'data-structures' ? 900 : 750);
      inspected = await page.evaluate(inspectPage);
      const textIssues = await page.evaluate(inspectText);
      if (textIssues.length) report.overlaps.push({ subject: entry.subject, hash: entry.hash, issues: textIssues });
    } catch (error) {
      inspected.problems.push('navigation:' + String(error.message).slice(0, 120));
    }
    const uniqueConsole = [...new Set(consoleErrors)].filter(m => !m.includes('favicon'));
    if (inspected.problems.length || pageErrors.length || uniqueConsole.length || badResponses.length) {
      report.failures.push({
        subject: entry.subject, hash: entry.hash, title: entry.title,
        problems: inspected.problems, pageErrors: [...new Set(pageErrors)], console: uniqueConsole.slice(0, 4), http: badResponses.slice(0, 4),
      });
    }
    report.checked++;
  }
  fs.writeFileSync(path.join(destination, 'verify-all.json'), JSON.stringify(report, null, 2));
  console.log(`检查 ${report.checked}/${report.total} 个入口`);
  console.log(`失败页面 ${report.failures.length}`);
  report.failures.slice(0, 40).forEach(f => console.log(`  ✗ ${f.subject} ${f.hash} ${f.title} :: ${[...f.problems, ...f.pageErrors, ...f.console, ...f.http].slice(0, 3).join(' | ')}`));
  console.log(`文本异常页面 ${report.overlaps.length}`);
  report.overlaps.slice(0, 30).forEach(o => console.log(`  ⚠ ${o.subject} ${o.hash} :: ${o.issues.slice(0, 3).join(' | ')}`));
  await browser.close();
  process.exitCode = report.failures.length ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
