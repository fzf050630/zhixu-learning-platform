const { test, expect } = require('../../数据结构可视化/node_modules/@playwright/test');

test('portal opens all seven subjects and searches real lessons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-subject-card]')).toHaveCount(7);
  await expect(page.locator('[data-subject-card][data-status="ready"]')).toHaveCount(7);
  await page.getByRole('searchbox', { name: '搜索全部已接入内容' }).fill('快速排序');
  await page.locator('#searchResults a').first().click();
  await expect(page.locator('#labTitle')).toContainText('快速排序');
  await page.locator('#nextBtn').click();
  await expect(page.locator('#stepCounter')).not.toHaveText('01 / 01');
  await page.reload();
  await expect(page.locator('#labTitle')).toContainText('快速排序');
});

test('theme survives subject navigation and recently visited points to a real lesson', async ({ page }) => {
  await page.goto('/');
  await page.locator('#platformTheme').click();
  const theme = await page.locator('html').getAttribute('data-theme');
  await page.locator('[data-subject-card="data-structures"] a').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await page.locator('#platformSubject').selectOption('probability');
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await page.goto('/subjects/probability/index.html#ch1-s1');
  await expect(page.locator('#view')).toContainText('样本空间与随机事件');
  await expect(page.locator('#view canvas').first()).toBeVisible();
  await page.locator('#platformHome').click();
  await expect(page.locator('#recentList')).toContainText('样本空间与随机事件');
});

test('published assets and deep links work below a URL prefix', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(r.url()); });
  await page.goto('/preview/');
  await page.locator('[data-subject-card="probability"] a').click();
  await expect(page).toHaveURL(/\/preview\/subjects\/probability\//);
  await page.locator('#platformSubject').selectOption('data-structures');
  await expect(page).toHaveURL(/\/preview\/subjects\/data-structures\//);
  await page.locator('#platformHome').click();
  await expect(page).toHaveURL(/\/preview\/index.html/);
  expect(errors).toEqual([]);
});

test('mobile portal drawer and subject pages fit without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#portalMenu').click();
  await expect(page.locator('#portalSidebar')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#portalMenu')).toBeFocused();
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/subjects/data-structures/index.html#/lab/quick-sort', '/subjects/probability/index.html#ch1-s1', '/subjects/probability/index.html#ch2-s5']) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      expect(overflow, `${width}: ${route}`).toBe(false);
    }
  }
});

test('probability controls keep values on theme change and mastery survives reload', async ({ page }) => {
  await page.goto('/subjects/probability/index.html#ch2-s5');
  const slider = page.locator('#view input[type="range"]').first();
  await expect(slider).toBeAttached();
  const value = await slider.evaluate(element => {
    element.value = Number(element.min) + (Number(element.max) - Number(element.min)) * 0.65;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    return element.value;
  });
  const before = await page.locator('#view canvas').first().evaluate(canvas => canvas.toDataURL());
  await page.locator('#platformTheme').click();
  await expect(slider).toHaveValue(value);
  await expect.poll(() => page.locator('#view canvas').first().evaluate(canvas => canvas.toDataURL())).not.toBe(before);
  await page.locator('#masterBtn').click();
  await expect(page.locator('#masterBtn')).toContainText('已掌握');
  await page.reload();
  await expect(page.locator('#masterBtn')).toContainText('已掌握');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#platformHeader')).toBeHidden();
  const background = await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor);
  expect(background).toBe('rgb(255, 255, 255)');
});

test('storage restrictions and corrupt recent routes do not break the platform', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('zhixu-recent-v1', JSON.stringify([{ subject: 'probability', hash: 'javascript:alert(1)' }, null, { subject: 'missing', hash: '#bad' }])));
  await page.reload();
  await expect(page.locator('#recentList')).toContainText('还没有探索记录');
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage disabled'); };
    Storage.prototype.setItem = () => { throw new Error('Storage disabled'); };
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await page.locator('#platformTheme').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-subject-card="probability"] a').click();
  await expect(page.locator('#view')).toBeVisible();
  expect(errors).toEqual([]);
});

test('search empty state, filters and browser history stay usable', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-filter="math"]').click();
  await expect(page.locator('[data-subject-card]:visible')).toHaveCount(3);
  await page.locator('#globalSearch').fill('不存在的知识点xyz');
  await expect(page.locator('#searchSummary')).toHaveText('找到 0 个学习入口');
  await page.locator('#clearSearch').click();
  await page.locator('[data-subject-card="probability"] a').click();
  await page.locator('#platformTheme').click();
  const theme = await page.locator('html').getAttribute('data-theme');
  await page.goBack();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
});

for (const subject of ['data-structures', 'probability']) {
  test(`${subject}: mobile drawer keeps keyboard focus inside and closes with Escape`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/subjects/${subject}/index.html`);
    await expect(page.locator('#sidebar')).toHaveJSProperty('inert', true);
    await page.locator('#menuBtn').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#sideSearch')).toBeFocused();
    const last = page.locator('#sidebar').locator('a:visible, button:visible, input:visible, select:visible').last();
    await last.focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.getElementById('sidebar').contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#sidebar')).toHaveJSProperty('inert', true);
    await expect(page.locator('#menuBtn')).toBeFocused();
  });
}

test('corrupt probability mastery data falls back to an empty usable state', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('kaoyan-prob-progress-v1', 'null'));
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/subjects/probability/index.html#ch1-s1');
  await expect(page.locator('#view')).toContainText('样本空间与随机事件');
  await page.locator('#masterBtn').click();
  await expect(page.locator('#masterBtn')).toContainText('已掌握');
  expect(errors).toEqual([]);
});
