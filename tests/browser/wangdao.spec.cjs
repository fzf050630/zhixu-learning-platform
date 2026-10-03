const { test, expect } = require('../../数据结构可视化/node_modules/@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('zhixu-onboarding-v1', '1'));
});

test('eight textbook chapters render all 93 topics and retain the 54 experiment links', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/subjects/data-structures/index.html');
  await expect(page.locator('.knowledge-link')).toHaveCount(8);
  await expect(page.locator('.nav-labs a')).toHaveCount(54);
  let total = 0;
  for (let chapter = 1; chapter <= 8; chapter++) {
    await page.goto('/subjects/data-structures/index.html#/knowledge/ch' + chapter);
    await expect(page.locator('#knowledgeView')).toBeVisible();
    await expect(page.locator('#labView')).toBeHidden();
    total += await page.locator('[data-wangdao-topic]').count();
    const questionCount=await page.evaluate(ch=>window.ZhixuQuiz.countFor('data-structures:knowledge/ch'+ch),chapter);
    await expect(page.locator('#zxQuizEntry')).toContainText(questionCount+' 题');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  }
  expect(total).toBe(93);
  expect(errors).toEqual([]);
});

test('matrix calculator, quiz and switching between theory and animation remain functional', async ({ page }) => {
  await page.goto('/subjects/data-structures/index.html#/knowledge/ch3');
  const tool = page.locator('[data-tool="compressed-matrix"]');
  await tool.locator('[name="i"]').fill('2');
  await tool.locator('[name="j"]').fill('4');
  await expect(tool.locator('output')).toContainText('k=7');
  await tool.locator('[name="kind"]').selectOption('tridiagonal');
  await expect(tool.locator('output')).toContainText('固定零');
  await page.locator('#zxQuizEntry button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('.zx-quiz-close').click();
  await page.locator('.knowledge-lab-links a').first().click();
  await expect(page.locator('#labView')).toBeVisible();
  await expect(page.locator('#knowledgeView')).toBeHidden();
  await page.locator('#nextBtn').click();
  await page.locator('.knowledge-link').first().click();
  await expect(page.locator('#knowledgeView')).toBeVisible();
  await expect(page.locator('#knowledgeView .zx-section-nav')).toBeVisible();
});

test('tablet theory page uses the viewport with the chapter drawer closed', async ({ browser }) => {
  const context = await browser.newContext({ viewport: {width:1400,height:920}, deviceScaleFactor:2, hasTouch:true });
  const page = await context.newPage();
  await page.goto('/subjects/data-structures/index.html#/knowledge/ch8');
  await expect(page.locator('#knowledgeView')).toBeVisible();
  await expect(page.locator('#sidebar')).not.toHaveClass(/open/);
  expect(await page.locator('#sidebar').evaluate(el => el.getBoundingClientRect().right)).toBeLessThanOrEqual(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
  await page.screenshot({path:'docs/verification/wangdao-tablet.png',fullPage:false});
  await context.close();
});

test('cache address slider labels use real powers of two and never fractional bit counts', async ({ page }) => {
  await page.goto('/subjects/computer-organization/index.html#ch3-s6');
  const capacity = page.getByRole('slider', {name:'Cache 容量'});
  const block = page.getByRole('slider', {name:'块大小'});
  const ways = page.getByRole('slider', {name:'组相联路数'});
  await capacity.fill('3');
  await block.fill('4');
  await ways.fill('2');
  await expect(capacity.locator('..')).toContainText('8 KB');
  await expect(block.locator('..')).toContainText('16 B');
  await expect(ways.locator('..')).toContainText('4 路');
  const visualizer = capacity.locator('xpath=ancestor::div[contains(@class,"viz")][last()]');
  expect(await visualizer.innerText()).not.toMatch(/\d+\.\d+ 位/);
});
