const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../数据结构可视化/node_modules/playwright');
require('../数据结构可视化/tests/browser/windows-cleanup.cjs');
const { createCatalog } = require('./catalog.cjs');
const destination = path.resolve(__dirname, '../docs/verification/platform');
fs.mkdirSync(destination, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8767';
  const results = [];
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1050 : 844 });
    for (const theme of ['light', 'dark']) {
      for (const [name, url] of [['portal', '/'], ['data-structures', '/subjects/data-structures/index.html#/lab/quick-sort'], ['probability', '/subjects/probability/index.html#ch2-s5']]) {
        await page.goto(base + url);
        await page.evaluate(value => window.Zhixu.Theme.set(value), theme);
        await page.waitForTimeout(200);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        if (overflow) errors.push(`${name}-${width}-${theme}: page overflow`);
        await page.screenshot({ path: path.join(destination, `${name}-${width}-${theme}.png`), fullPage: name === 'portal' });
        results.push({ name, width, theme, overflow });
      }
    }
  }
  // Every probability section must still render formulas and registered widgets.
  for (const entry of createCatalog().entries.filter(item => item.subject === 'probability')) {
    await page.goto(base + '/subjects/probability/index.html' + entry.hash);
    await page.waitForSelector('#view .sec-title');
    const rendered = await page.locator('#view').innerText();
    if (!rendered.includes(entry.title)) errors.push('Missing section: ' + entry.hash);
    if (await page.locator('.katex-error').count()) errors.push('KaTeX error: ' + entry.hash);
  }
  fs.writeFileSync(path.join(destination, 'ui-results.json'), JSON.stringify({ results, probabilitySections: 44, errors }, null, 2));
  console.log(JSON.stringify({ screenshots: results.length, probabilitySections: 44, errors }, null, 2));
  await browser.close();
  if (errors.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
