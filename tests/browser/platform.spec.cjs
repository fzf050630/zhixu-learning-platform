const { test, expect } = require('../../数据结构可视化/node_modules/@playwright/test');

test.beforeEach(async ({ page }) => {
  // The portal's one-time, scroll-to-accept introduction is covered separately.
  // Keep integration clicks on the lesson content so this suite tests platform wiring.
  await page.addInitScript(() => localStorage.setItem('zhixu-onboarding-v1', '1'));
});

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

test('site theme follows the shared preference and writes it when changed', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('RECAORD_THEME', 'dark'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#141922');
  await page.locator('#platformTheme').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f6f7f9');
  expect(await page.evaluate(() => localStorage.getItem('RECAORD_THEME'))).toBe('light');
});

test('mobile site menu closes on Escape and outside click', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('.zx-network-mobile');
  const trigger = menu.locator('summary');
  await trigger.click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(10, 420);
  await expect(menu).not.toHaveAttribute('open');
});

test('published assets and deep links work below a URL prefix', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => {
    if (r.status() >= 400 && /\.(?:js|css|woff2?|ttf)(?:\?|$)/i.test(r.url())) errors.push(r.url());
  });
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
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        offenders: [...document.querySelectorAll('body *')].map(element => ({ element,
          tag: element.tagName, className: typeof element.className === 'string' ? element.className : '',
          right: Math.round(element.getBoundingClientRect().right),
        })).filter(item => item.right > innerWidth + 2).slice(0, 5).map(item => {
          const ancestors = [];
          for (let parent = item.element.parentElement; parent && ancestors.length < 6; parent = parent.parentElement) {
            const style = getComputedStyle(parent), rect = parent.getBoundingClientRect();
            ancestors.push({ tag: parent.tagName, className: typeof parent.className === 'string' ? parent.className : '', right: Math.round(rect.right), overflowX: style.overflowX, scrollWidth: parent.scrollWidth, width: Math.round(rect.width) });
          }
          return { tag: item.tag, className: item.className, right: item.right, ancestors };
        }),
      }));
      expect(layout.overflow, `${width}: ${route} ${JSON.stringify(layout.offenders)}`).toBe(false);
    }
  }
});

test('320px data-structures lesson places playback after the visualizer without covering the explanation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/subjects/data-structures/index.html#/lab/quick-sort');
  const explanation = page.locator('#algoPanel');
  const playback = page.locator('.transport');
  await expect(explanation).toBeVisible();
  await expect(playback).toBeVisible();
  const explanationBox = await explanation.boundingBox();
  const stageBox = await page.locator('.stage-panel').boundingBox();
  const codeBox = await page.locator('.code-panel').boundingBox();
  const playbackBox = await playback.boundingBox();
  const stateBox = await page.locator('#stateTables').boundingBox();
  const sectionNavBox = await page.locator('.zx-section-nav').boundingBox();
  expect(explanationBox).not.toBeNull();
  expect(stageBox).not.toBeNull();
  expect(codeBox).not.toBeNull();
  expect(playbackBox).not.toBeNull();
  expect(stateBox).not.toBeNull();
  expect(sectionNavBox).not.toBeNull();
  expect(playbackBox.y).toBeGreaterThanOrEqual(explanationBox.y + explanationBox.height - 1);
  expect(playbackBox.y).toBeGreaterThanOrEqual(stageBox.y + stageBox.height - 1);
  expect(playbackBox.y + playbackBox.height).toBeLessThanOrEqual(codeBox.y + 1);
  expect(codeBox.y - (playbackBox.y + playbackBox.height)).toBeLessThanOrEqual(40);
  expect(sectionNavBox.y).toBeGreaterThanOrEqual(stateBox.y + stateBox.height - 1);
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
  const intro = page.locator('#zxOnboardBody');
  if (await intro.isVisible()) {
    await intro.evaluate(element => { element.scrollTop = element.scrollHeight; element.dispatchEvent(new Event('scroll')); });
    await page.getByRole('button', { name: '我已阅读并开始学习' }).click();
  }
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
    await expect(page.locator('#sidebar .toc-chapter, #sidebar #chapterNav a').first()).toBeFocused();
    await expect(page.locator('#sideSearch')).not.toBeFocused();
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
