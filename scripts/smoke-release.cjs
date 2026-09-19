const { chromium } = require('../数据结构可视化/node_modules/playwright');
require('../数据结构可视化/tests/browser/windows-cleanup.cjs');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.SMOKE_URL || 'http://127.0.0.1:8767/';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [], checked = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => { if (!request.failure()?.errorText.includes('ERR_ABORTED')) errors.push(`${request.failure()?.errorText} ${request.url()}`); });
  try {
    await page.goto(base);
    const data = await page.evaluate(() => ({ subjects: Zhixu.subjects, entries: Zhixu.catalog.entries }));
    if (data.subjects.filter(s => s.status === 'ready').length !== 7) throw new Error('Expected seven ready subjects');
    for (const subject of data.subjects) {
      const url = new URL(subject.path, base);
      await page.goto(url.href + subject.home);
      await page.waitForSelector('#platformSubject');
      const entry = data.entries.find(item => item.subject === subject.id);
      await page.goto(url.href + entry.hash);
      await page.waitForTimeout(180);
      if (!(await page.locator('main').innerText()).includes(entry.title)) throw new Error(`Missing content: ${subject.id}`);
      const slider = page.locator('main input[type="range"]').first();
      if (await slider.count()) await slider.evaluate(el => { el.value = Number(el.min || 0) + Number(el.step || 1); el.dispatchEvent(new Event('input', { bubbles: true })); });
      await page.locator('#platformTheme').click();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(100);
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) errors.push('Mobile overflow: ' + subject.id);
      checked.push({ subject: subject.id, title: entry.title });
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    const directory = path.resolve(__dirname, '../docs/verification/deployment-20260918');
    fs.mkdirSync(directory, { recursive: true });
    const result = { base, checked, entries: data.entries.length, errors };
    fs.writeFileSync(path.join(directory, base.startsWith('https:') ? 'production-smoke.json' : 'local-smoke.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
    if (errors.length) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
