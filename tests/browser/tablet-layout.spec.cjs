const { test, expect } = require('../../数据结构可视化/node_modules/@playwright/test');

const origin = process.env.ZHIXU_TABLET_ORIGIN || 'http://127.0.0.1:8766';
const lessons = [
  ['#/lab/sequence-insert', '顺序表插入'],
  ['#/lab/quick-sort', '快速排序'],
  ['#/lab/prim', 'Prim'],
];

test('2800×1840 landscape tablet keeps the chapter drawer closed and the visualizer beside readable pseudocode', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1400, height: 920 }, deviceScaleFactor: 2, hasTouch: true, isMobile: false, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400 && /\.(js|css|woff2?|ttf)(\?|$)/i.test(response.url())) errors.push(response.status() + ' ' + response.url());
  });
  try {
    for (const [hash, title] of lessons) {
      await page.goto(`${origin}/subjects/data-structures/index.html${hash}`);
      await expect(page.locator('#labTitle')).toContainText(title);
      await expect(page.locator('#sidebar')).toHaveJSProperty('inert', true);
      await expect(page.locator('#menuBtn')).toBeVisible();
      await expect(page.locator('#menuBtn')).toHaveAttribute('aria-expanded', 'false');
      const stage = await page.locator('.stage-panel').boundingBox();
      const code = await page.locator('.code-panel').boundingBox();
      const transport = await page.locator('.transport').boundingBox();
      expect(Math.abs(stage.y - code.y), `${title}: same top edge`).toBeLessThan(12);
      expect(stage.x + stage.width).toBeLessThanOrEqual(code.x + 2);
      expect(stage.width).toBeGreaterThanOrEqual(350);
      expect(code.width).toBeGreaterThanOrEqual(320);
      expect(code.y + code.height).toBeLessThan(920);
      expect(transport.y + transport.height).toBeLessThan(920);
      const options = page.locator('#tabletExperimentDetails');
      if (await options.isVisible()) {
        await expect(options).not.toHaveAttribute('open', '');
        await options.locator('summary').click();
        await expect(options).toHaveAttribute('open', '');
        await options.locator('summary').click();
        await expect(options).not.toHaveAttribute('open', '');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `test-results/tablet-layout/${hash.split('/').at(-1)}-2800x1840.png`, scale: 'device' });
      await page.locator('#menuBtn').click();
      await expect(page.locator('#sidebar')).toHaveClass(/open/);
      await expect(page.locator('#chapterNav a').first()).toBeFocused();
      await expect(page.locator('#sideSearch')).not.toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.locator('#sidebar')).not.toHaveClass(/open/);
      await expect(page.locator('#menuBtn')).toBeFocused();
    }
    expect(errors).toEqual([]);
  } finally { await context.close(); }
});

test('tablet portrait keeps chapters behind a reachable drawer and supports split panels at a usable width', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1024, height: 1366 }, deviceScaleFactor: 2, hasTouch: true, isMobile: false, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(`${origin}/subjects/data-structures/index.html#/lab/quick-sort`);
    await expect(page.locator('#labTitle')).toContainText('快速排序');
    await expect(page.locator('#sidebar')).toHaveJSProperty('inert', true);
    await expect(page.locator('#menuBtn')).toBeVisible();
    const stage = await page.locator('.stage-panel').boundingBox();
    const code = await page.locator('.code-panel').boundingBox();
    expect(Math.abs(stage.y - code.y), 'portrait tablet split has one aligned top row').toBeLessThan(12);
    expect(stage.x + stage.width).toBeLessThanOrEqual(code.x + 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  } finally { await context.close(); }
});

test('tablet header keeps a populated mastery badge in one readable row', async ({ browser }) => {
  for (const viewport of [{ width: 1024, height: 768 }, { width: 850, height: 900 }, { width: 768, height: 1024 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 2, hasTouch: true, isMobile: false });
    const page = await context.newPage();
    try {
      await page.goto(`${origin}/subjects/data-structures/index.html#/lab/heap-insert`);
      const badge = page.locator('#platformHeader .zx-mastery-badge');
      await expect(badge).toBeAttached();
      await badge.evaluate(element => {
        element.closest('.zx-mastery').hidden = false;
        element.dataset.level = 'BASIC';
        element.innerHTML = '掌握度 <strong>66%</strong> · 基本掌握';
      });

      const layout = await page.evaluate(() => {
        const rect = element => {
          const box = element.getBoundingClientRect();
          return { x: box.x, y: box.y, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
        };
        const header = document.querySelector('#platformHeader');
        const badge = header.querySelector('.zx-mastery-badge');
        const groups = [
          [...header.children],
          [...header.querySelector('.zx-header-actions').children].filter(element => !element.classList.contains('zx-sr')),
        ];
        const overlaps = groups.flatMap(group => {
          const items = group.filter(element => getComputedStyle(element).display !== 'none')
            .map(element => ({ name: element.id || element.className, rect: rect(element) }));
          return items.reduce((result, item, index) => {
            for (const other of items.slice(index + 1)) {
              const horizontal = Math.min(item.rect.right, other.rect.right) - Math.max(item.rect.x, other.rect.x);
              const vertical = Math.min(item.rect.bottom, other.rect.bottom) - Math.max(item.rect.y, other.rect.y);
              if (horizontal > 1 && vertical > 1) result.push([item.name, other.name]);
            }
            return result;
          }, []);
        });
        return { header: rect(header), badge: rect(badge), overlaps };
      });

      expect(layout.badge.width, `badge width at ${viewport.width}px`).toBeGreaterThanOrEqual(120);
      expect(layout.badge.height, `badge height at ${viewport.width}px`).toBeLessThanOrEqual(44);
      expect(layout.badge.y, `badge top at ${viewport.width}px`).toBeGreaterThanOrEqual(layout.header.y);
      expect(layout.badge.bottom, `badge bottom at ${viewport.width}px`).toBeLessThanOrEqual(layout.header.bottom);
      expect(layout.overlaps, `header controls overlap at ${viewport.width}px`).toEqual([]);
    } finally { await context.close(); }
  }
});

test('desktop retains its always-visible chapter navigation', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1, hasTouch: false, isMobile: false });
  const page = await context.newPage();
  try {
    await page.goto(`${origin}/subjects/data-structures/index.html#/lab/quick-sort`);
    await expect(page.locator('#sidebar')).not.toHaveJSProperty('inert', true);
    await expect(page.locator('#menuBtn')).toBeHidden();
    const stage = await page.locator('.stage-panel').boundingBox();
    const code = await page.locator('.code-panel').boundingBox();
    expect(Math.abs(stage.y - code.y)).toBeLessThan(12);
  } finally { await context.close(); }
});

test('all seven subjects put tablet chapter navigation behind a working drawer', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1400, height: 920 }, deviceScaleFactor: 2, hasTouch: true, isMobile: false });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('zhixu-onboarding-v1', '1'));
  try {
    await page.goto(`${origin}/`);
    const subjects = await page.evaluate(() => Zhixu.subjects.filter(subject => subject.status === 'ready').map(subject => ({ id: subject.id, href: Zhixu.url(subject.id) })));
    for (const viewport of [{ width: 1400, height: 920 }, { width: 920, height: 1400 }]) {
      await page.setViewportSize(viewport);
    for (const subject of subjects) {
      const target = new URL(subject.href);
      await page.goto(target.href);
      await expect(page.locator('#menuBtn')).toBeVisible();
      await expect(page.locator('#sidebar')).toHaveJSProperty('inert', true);
      const closedLayout = await page.evaluate(() => {
        const sidebar = document.getElementById('sidebar');
        const main = document.querySelector('.main');
        const header = document.getElementById('platformHeader');
        return { sidebarRight: sidebar.getBoundingClientRect().right, position: getComputedStyle(sidebar).position,
          mainTop: main.getBoundingClientRect().top, mainHeight: main.getBoundingClientRect().height,
          headerBottom: header.getBoundingClientRect().bottom, availableHeight: innerHeight - header.getBoundingClientRect().bottom };
      });
      expect(closedLayout.sidebarRight, subject.id + ': closed drawer is outside viewport').toBeLessThanOrEqual(0);
      expect(closedLayout.position, subject.id + ': drawer does not occupy a grid row').toBe('fixed');
      expect(closedLayout.mainTop, subject.id + ': lesson starts directly under header').toBeLessThanOrEqual(closedLayout.headerBottom + 2);
      expect(closedLayout.mainHeight, subject.id + ': full lesson viewport').toBeGreaterThanOrEqual(closedLayout.availableHeight - 2);
      await page.locator('#menuBtn').click();
      await expect(page.locator('#sidebar')).not.toHaveJSProperty('inert', true);
      const firstDirectoryControl = page.locator('#sidebar .toc-chapter, #sidebar #chapterNav a').first();
      await expect(firstDirectoryControl).toBeFocused();
      await expect.poll(() => page.locator('#sidebar').evaluate(el => el.getBoundingClientRect().left), { message: subject.id + ': opened drawer visible' }).toBeGreaterThanOrEqual(0);
      expect(await page.locator('.main').evaluate(el => el.getBoundingClientRect().top), subject.id + ': open drawer overlays instead of pushing the lesson').toBeLessThanOrEqual(closedLayout.headerBottom + 2);
      await expect(page.locator('#sideSearch')).not.toBeFocused();
      await page.keyboard.press('Escape');
      await expect(page.locator('#sidebar')).toHaveJSProperty('inert', true);
      await expect.poll(() => page.locator('#sidebar').evaluate(el => el.getBoundingClientRect().right), { message: subject.id + ': closed drawer outside viewport' }).toBeLessThanOrEqual(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), subject.id).toBe(true);
    }
    }
  } finally { await context.close(); }
});
