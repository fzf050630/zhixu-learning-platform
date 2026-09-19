const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");
const url = pathToFileURL(path.resolve(__dirname, "../../index.html")).href;

test("custom sort input keeps cases isolated and resets safely", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => {
    if (e.type() === "error") errors.push(e.text());
  });
  await page.clock.install();
  await page.goto(url + "#/lab/quick-sort");

  for (const id of [
    "quick-sort",
    "heap-sort",
    "insertion-sort",
    "merge-sort",
  ]) {
    await page.evaluate((experimentId) => {
      location.hash = "#/lab/" + experimentId;
    }, id);
    const expectedTotal = await page.evaluate((experimentId) => {
      const experiment = DS.Content.experiments.find(
        (item) => item.id === experimentId,
      );
      return experiment.createSteps([3, -1, 3, 0]).length;
    }, id);
    const expectedCounter =
      "01 / " + String(expectedTotal).padStart(2, "0");
    await page.locator("#arrayInput").fill("3, -1, 3, 0");
    await page.locator("#applyInputBtn").click();
    await expect(page.locator("#stepCounter")).toHaveText(expectedCounter);
    await expect(page.locator("#playBtn")).toHaveText("播放");

    for (let attempt = 0; attempt < 10; attempt += 1) {
      await page.locator("#arrayInput").fill("3, -1, 3, 0");
      await page.locator("#applyInputBtn").click();
      await expect(page.locator("#stepCounter")).toHaveText(expectedCounter);
    }
    await page.locator("#nextBtn").click();
    await expect(page.locator("#stepCounter")).toHaveText(
      "02 / " + String(expectedTotal).padStart(2, "0"),
    );
    await page.locator("#arrayInput").fill("3,,1");
    await page.locator("#applyInputBtn").click();
    await expect(page.locator("#inputError")).toContainText("缺少整数");
    await expect(page.locator("#stepCounter")).toHaveText(
      "02 / " + String(expectedTotal).padStart(2, "0"),
    );

    await page.locator("#resetBtn").click();
    await expect(page.locator("#stepCounter")).toHaveText(expectedCounter);
    await page.locator("#playBtn").click();
    await page.clock.runFor(800);
    await expect(page.locator("#stepCounter")).not.toHaveText(expectedCounter);
    await page.locator("#arrayInput").fill("1 2");
    await page.locator("#applyInputBtn").click();
    const replacementCounter = await page.locator("#stepCounter").textContent();
    await expect(page.locator("#playBtn")).toHaveText("播放");
    await page.clock.runFor(4000);
    await expect(page.locator("#stepCounter")).toHaveText(replacementCounter);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    location.hash = "#/lab/quick-sort";
  });
  await expect(page.locator("#experimentInput")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/custom-sort-input-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("dark theme, blocked storage and high DPI remain usable offline", async ({
  browser,
}) => {
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const errors = [],
    external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (/^https?:/.test(r.url())) external.push(r.url());
  });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("storage blocked");
    };
    Storage.prototype.setItem = () => {
      throw new Error("storage blocked");
    };
  });
  await page.goto(url + "#/lab/prim");
  await page.locator("#themeBtn").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  for (const id of await page.evaluate(() =>
    DS.Content.experiments.map((e) => e.id),
  )) {
    await page.evaluate((id) => {
      location.hash = "#/lab/" + id;
    }, id);
    await expect(page.locator("#prevBtn")).toBeDisabled();
    await page.locator("#nextBtn").click();
    await expect(page.locator("#stepCounter")).toHaveText(/^02/);
  }
  expect(
    await page
      .locator("#stageCanvas")
      .evaluate(
        (c) => c.width === Math.round(c.getBoundingClientRect().width * 2),
      ),
  ).toBe(true);
  await page.evaluate(() => {
    location.hash = "#/lab/topological";
  });
  await expect(page.locator("#labTitle")).toHaveText("拓扑排序");
  await page.screenshot({ path: "test-results/dark-lab.png", fullPage: true });
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  await context.close();
});

test("runtime cleans up failed initialization and asynchronous render failures", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto(url);
  await page.evaluate(() => {
    document.getElementById("homeView").hidden = true;
    document.getElementById("labView").hidden = false;
    const names = {
      canvas: "stageCanvas",
      code: "codeList",
      message: "stepMessage",
      counter: "stepCounter",
      prev: "prevBtn",
      next: "nextBtn",
      play: "playBtn",
      reset: "resetBtn",
      speed: "speedRange",
      speedText: "speedText",
    };
    window.testRuntime = DS.LabRuntime.createRuntime(
      Object.fromEntries(
        Object.entries(names).map(([k, v]) => [k, document.getElementById(v)]),
      ),
    );
    window.testExperiment = DS.Content.experiments.find((e) => e.id === "prim");
    testRuntime.mount({
      ...testExperiment,
      createSteps: () => [{ line: 999, state: {}, message: "bad" }],
    });
  });
  await expect(page.locator("#stepMessage")).toContainText("快照无效");
  await expect(page.locator("#nextBtn")).toBeDisabled();
  await page.evaluate(() => {
    window.originalRenderer = DS.Renderers.graph;
    DS.Renderers.graph = () => {
      throw new Error("首帧失败");
    };
    testRuntime.mount(testExperiment);
  });
  await expect(page.locator("#stepMessage")).toContainText("首帧失败");
  await page.evaluate(() => {
    DS.Renderers.graph = originalRenderer;
    testRuntime.mount(testExperiment);
  });
  await page.locator("#playBtn").click();
  await page.evaluate(() => {
    DS.Renderers.graph = () => {
      throw new Error("定时帧失败");
    };
  });
  await page.clock.runFor(1000);
  await expect(page.locator("#stepMessage")).toContainText("定时帧失败");
  await expect(page.locator("#playBtn")).toBeDisabled();
  await page.evaluate(() => {
    DS.Renderers.graph = originalRenderer;
    testRuntime.mount(testExperiment);
  });
  await page.clock.runFor(4000);
  await expect(page.locator("#stepCounter")).toHaveText(/^01/);
  await page.locator("#nextBtn").click();
  await expect(page.locator("#stepCounter")).toHaveText(/^02/);
  await page.evaluate(() => {
    DS.Renderers.graph = () => {
      throw new Error("重绘失败");
    };
    testRuntime.redraw();
  });
  await expect(page.locator("#stepMessage")).toContainText("重绘失败");
});

test("all 54 offline routes autoplay to a synchronized end", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => {
    if (e.type() === "error") errors.push(e.text());
  });
  await page.clock.install();
  await page.goto(url);
  const ids = await page.evaluate(() =>
    DS.Content.experiments.map((e) => e.id),
  );
  expect(ids).toHaveLength(54);
  for (const id of ids) {
    await page.evaluate((id) => {
      location.hash = "#/lab/" + id;
    }, id);
    await expect(page.locator("#labTitle")).toHaveText(
      await page.evaluate(
        (id) => DS.Content.experiments.find((e) => e.id === id).title,
        id,
      ),
    );
    const result = await page.evaluate((id) => {
      const e = DS.Content.experiments.find((e) => e.id === id),
        steps = e.createSteps();
      return {
        total: steps.length,
        line: steps.at(-1).line,
        message: steps.at(-1).message,
      };
    }, id);
    await page.locator("#playBtn").click();
    await page.clock.runFor(result.total * 760);
    await expect(page.locator("#playBtn")).toHaveText("已完成");
    await expect(page.locator("#nextBtn")).toBeDisabled();
    await expect(page.locator("#stepMessage")).toHaveText(result.message);
    await expect(page.locator("#codeList li.active")).toHaveCount(1);
    await expect(page.locator("#codeList li").nth(result.line - 1)).toHaveClass(
      /active/,
    );
    await expect(page.locator("#stepCounter")).toHaveText(
      `${String(result.total).padStart(2, "0")} / ${String(result.total).padStart(2, "0")}`,
    );
  }
  expect(errors).toEqual([]);
});

test("transport, keyboard, route disposal and theme", async ({ page }) => {
  await page.clock.install();
  await page.goto(url + "#/lab/prim");
  await page.locator("#nextBtn").click();
  await expect(page.locator("#stepCounter")).toHaveText(/^02/);
  await page.locator("#prevBtn").click();
  await expect(page.locator("#prevBtn")).toBeDisabled();
  await page.locator("#playBtn").click();
  await page.clock.runFor(800);
  await page.locator("#playBtn").click();
  const paused = await page.locator("#stepCounter").textContent();
  await page.clock.runFor(4000);
  await expect(page.locator("#stepCounter")).toHaveText(paused);
  await page.locator("#resetBtn").click();
  await page.locator("#labTitle").click();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#stepCounter")).toHaveText(/^02/);
  await page.locator("#playBtn").click();
  await page.evaluate(() => {
    location.hash = "#/lab/bfs";
  });
  await expect(page.locator("#labTitle")).toContainText("广度");
  await page.clock.runFor(3000);
  await expect(page.locator("#stepCounter")).toHaveText(/^01/);
  await page.locator("#themeBtn").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.evaluate(() => {
    location.hash = "#/chapter/missing";
  });
  await expect(page.locator("#homeView")).toBeVisible();
});

test("runtime contains renderer errors and can remount", async ({ page }) => {
  await page.clock.install();
  await page.goto(url + "#/lab/prim");
  await page.evaluate(() => {
    DS.Renderers.graph = () => {
      throw new Error("测试绘制异常");
    };
  });
  await page.locator("#nextBtn").click();
  await expect(page.locator("#stepMessage")).toContainText("测试绘制异常");
  await expect(page.locator("#playBtn")).toBeDisabled();
  await page.evaluate(() => {
    location.hash = "#/lab/quick-sort";
  });
  await expect(page.locator("#labTitle")).toHaveText("快速排序");
  await expect(page.locator("#playBtn")).toBeEnabled();
});

test("local font, code indentation and responsive canvas", async ({ page }) => {
  await page.goto(url + "#/lab/dijkstra");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() =>
      [...document.fonts].some(
        (f) =>
          f.family.replaceAll('"', "") === "JetBrains Mono" &&
          f.status === "loaded",
      ),
    ),
  ).toBe(true);
  await expect(page.locator("#codeList code").first()).toHaveCSS(
    "font-family",
    /JetBrains Mono/,
  );
  await expect(page.locator("#codeList code").first()).toHaveCSS(
    "white-space",
    "pre-wrap",
  );
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(100);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const size = await page.locator("#stageCanvas").evaluate((c) => ({
      actual: c.width,
      target: Math.round(c.clientWidth * Math.min(devicePixelRatio, 2)),
    }));
    expect(size.actual).toBe(size.target);
  }
  await page.screenshot({
    path: "test-results/mobile-lab.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "test-results/desktop-lab.png",
    fullPage: true,
  });
});

test("speed, search, mobile menu and reduced motion", async ({ page }) => {
  await page.clock.install();
  await page.goto(url + "#/lab/prim");
  await page.locator("#speedRange").fill("180");
  await expect(page.locator("#speedText")).toHaveText("4.2×");
  await page.locator("#playBtn").click();
  await page.clock.runFor(400);
  await expect(page.locator("#stepCounter")).toHaveText(/^03/);
  await page.locator("#playBtn").click();
  await page.locator("#sideSearch").fill("prim");
  await expect(page.locator(".nav-labs a:visible")).toHaveCount(1);
  await page.locator("#sideSearch").fill("");
  await expect(page.locator(".nav-labs a:visible")).toHaveCount(54);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#labTitle").click();
  await page.keyboard.press("/");
  await expect(page.locator("#menuBtn")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(page.locator("#sideSearch")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#menuBtn")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(page.locator("#sidebar")).toHaveCSS("transition-duration", "0s");
  await page.evaluate(() => {
    location.hash = "#/";
  });
  await expect(page.locator("#chapterCount")).toHaveText("6");
  await expect(page.locator("#experimentCount")).toHaveText("54");
  await expect(page.locator("#structureCount")).toHaveText("11");
});

test("failed rendering clears the entire scaled mobile canvas", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(url + "#/lab/prim");
  await page.evaluate(() => {
    const original = DS.Renderers.graph;
    DS.Renderers.graph = (canvas, state) => {
      original(canvas, state);
      const context = canvas.getContext("2d");
      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.fillStyle = "#ff00ff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
      throw new Error("mobile failure");
    };
  });
  await page.locator("#nextBtn").click();
  await expect(page.locator("#stepMessage")).toContainText("mobile failure");
  expect(
    await page
      .locator("#stageCanvas")
      .evaluate(
        (canvas) =>
          canvas
            .getContext("2d")
            .getImageData(canvas.width - 1, canvas.height - 1, 1, 1).data[3],
      ),
  ).toBe(0);
});
