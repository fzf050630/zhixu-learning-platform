const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const url = pathToFileURL(path.resolve(__dirname, '../../index.html')).href;

test('snapshot tables follow playback, history, input, errors and route disposal', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install();
  await page.goto(url + '#/lab/dijkstra');
  const tables = page.locator('#stateTables');
  await expect(tables).toContainText('∞');
  const first = await tables.innerText();
  await page.locator('#nextBtn').click();
  expect(await tables.innerText()).not.toBe(first);
  await page.locator('#prevBtn').click();
  expect(await tables.innerText()).toBe(first);
  await page.locator('#playBtn').click();
  await page.clock.runFor(30000);
  await expect(page.locator('#playBtn')).toHaveText('已完成');
  await expect(tables).not.toContainText('∞');
  await page.locator('#resetBtn').click();
  expect(await tables.innerText()).toBe(first);

  await page.goto(url + '#/lab/quick-sort');
  await page.locator('#arrayInput').fill('3,-1,3,0');
  await page.locator('#applyInputBtn').click();
  await expect(tables.locator('table').first().locator('tbody tr')).toHaveCount(4);
  const custom = await tables.innerText();
  await page.locator('#arrayInput').fill('bad');
  await page.locator('#applyInputBtn').click();
  expect(await tables.innerText()).toBe(custom);
  await page.locator('#playBtn').click();
  await page.clock.runFor(30000);
  expect(await tables.locator('table').first().locator('tbody tr td:nth-child(2)').allTextContents()).toEqual(['-1', '0', '3', '3']);
  await page.locator('#resetBtn').click();
  expect(await tables.innerText()).toBe(custom);
  await page.evaluate(() => { DS.Renderers.array = () => { throw new Error('table cleanup'); }; });
  await page.locator('#nextBtn').click();
  await expect(tables).toBeHidden();
  await expect(tables.locator('table')).toHaveCount(0);
  await page.evaluate(() => { location.hash = '#/'; });
  await expect(page.locator('#homeView')).toBeVisible();
  await expect(tables.locator('table')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('all snapshot descriptions render offline and contain scrolling on small screens', async ({ page }) => {
  await page.goto(url);
  const result = await page.evaluate(() => {
    const container = document.createElement('div');
    let count = 0;
    for (const experiment of DS.Content.experiments) {
      for (const step of experiment.createSteps()) {
        const before = structuredClone(step.state);
        DS.StateTable.render(container, step.state, experiment.describeState);
        if (!container.querySelector('table caption')) throw new Error(experiment.id);
        if (JSON.stringify(step.state) !== JSON.stringify(before)) throw new Error('Mutated state');
        count++;
      }
    }
    DS.StateTable.render(container, {}, () => [{ title: '<img src=x>', columns: ['value'], rows: [['<script>bad()</script>']] }]);
    if (container.querySelector('img,script')) throw new Error('Unsafe HTML');
    return count;
  });
  expect(result).toBeGreaterThan(100);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(url + '#/lab/floyd');
  await expect(page.locator('#stateTables')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.state-table-scroll').first().evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/state-table-mobile.png', fullPage: true });
});
