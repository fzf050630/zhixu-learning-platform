(function () {
  "use strict";
  const { chapters, experiments } = DS.Content;
  const byId = (id) => document.getElementById(id);
  const els = {
    nav: byId("chapterNav"),
    grid: byId("chapterGrid"),
    home: byId("homeView"),
    knowledge: byId("knowledgeView"),
    lab: byId("labView"),
    crumb: byId("crumb"),
    title: byId("labTitle"),
    chapter: byId("labChapter"),
    tag: byId("labTag"),
    canvas: byId("stageCanvas"),
    input: byId("experimentInput"),
    tabletOptions: byId("tabletExperimentDetails"),
    tabletOptionsSummary: byId("tabletExperimentSummary"),
    algoPanel: byId("algoPanel"),
    stateTables: byId("stateTables"),
    layoutControls: byId('layoutControls'),
    code: byId("codeList"),
    message: byId("stepMessage"),
    counter: byId("stepCounter"),
    prev: byId("prevBtn"),
    next: byId("nextBtn"),
    play: byId("playBtn"),
    reset: byId("resetBtn"),
    speed: byId("speedRange"),
    speedText: byId("speedText"),
    menu: byId("menuBtn"),
    sidebar: byId("sidebar"),
    scrim: byId("scrim"),
    theme: byId("themeBtn"),
    search: byId("sideSearch"),
  };
  const runtime = DS.LabRuntime.createRuntime(els);
  const isTabletDrawer = () => window.matchMedia("(any-pointer: coarse) and (min-width: 721px) and (max-width: 1500px) and (min-height: 560px)").matches;
  const isCompactDrawer = () => window.innerWidth <= 720 || isTabletDrawer();
  const updateTabletOptions = () => {
    const hasInput = !els.input.hidden;
    const hasLayout = !els.layoutControls.hidden;
    const hasOptions = hasInput || hasLayout;
    els.tabletOptions.hidden = !hasOptions;
    els.tabletOptionsSummary.textContent = hasInput && hasLayout ? "实验参数与画布布局" : hasInput ? "实验参数" : "画布布局";
    if (hasOptions) els.tabletOptions.open = !isTabletDrawer();
  };
  let disposeInput = () => {};
  const expById = (id) => experiments.find((e) => e.id === id);
  const chapterById = (id) => chapters.find((c) => c.id === id);
  const closeMenu = () => {
    if (els.sidebar.classList.contains('open') && els.sidebar.contains(document.activeElement)) els.menu.focus();
    els.sidebar.classList.remove("open");
    els.scrim.classList.remove("show");
    els.menu.setAttribute("aria-expanded", "false");
    els.sidebar.inert = isCompactDrawer();
    els.menu.setAttribute("aria-label", "打开章节目录");
  };
  function renderNav() {
    els.nav.innerHTML = DS.WangdaoView.navHtml() + chapters
      .map(
        (ch) =>
          `<section><a class="chapter-link" href="#/chapter/${ch.id}" data-chapter="${ch.id}"><b>${ch.no}</b><strong>${ch.title}</strong><i>⌄</i></a><div class="nav-labs">${ch.experiments
            .map((id) => {
              const e = expById(id);
              return `<a href="#/lab/${id}" data-search="${e.title.toLowerCase()}"><span></span>${e.title}</a>`;
            })
            .join("")}</div></section>`,
      )
      .join("");
  }
  function renderHome(filter) {
    if (filter && !chapterById(filter)) filter = null;
    const list = filter ? [chapterById(filter)].filter(Boolean) : chapters;
    els.grid.innerHTML = list
      .map(
        (ch) =>
          `<article class="chapter-card"><span class="no">CHAPTER ${ch.no}</span><h2>${ch.title}</h2><p>${ch.subtitle}</p><ul>${ch.experiments
            .map((id) => {
              const e = expById(id);
              return `<li><a href="#/lab/${id}">${e.title}</a><span>→</span></li>`;
            })
            .join("")}</ul></article>`,
      )
      .join("");
    els.knowledge.hidden = true;
    byId("knowledgeGrid").innerHTML = DS.WangdaoView.homeHtml();
    els.home.hidden = false;
    els.lab.hidden = true;
    els.crumb.textContent = filter ? chapterById(filter).title : "算法实验室";
    document
      .querySelectorAll("#chapterNav a")
      .forEach((a) =>
        a.classList.toggle("active", a.dataset.chapter === filter),
      );
  }
  function renderAlgoPanel(e) {
    const panel = els.algoPanel;
    if (!panel) return;
    const info = e.explain;
    if (!info || !info.goal || !Array.isArray(info.steps) || !info.steps.length) {
      panel.hidden = true;
      panel.innerHTML = "";
      return;
    }
    const steps = info.steps
      .map(
        (step, index) =>
          `<li><span class="algo-step-no">${String(index + 1).padStart(2, "0")}</span><span class="algo-step-text">${step}</span></li>`,
      )
      .join("");
    const keys = (info.keys || []).length
      ? `<div class="algo-keys"><div class="algo-keys-title">关键点与易错</div><ul>${info.keys.map((key) => `<li>${key}</li>`).join("")}</ul></div>`
      : "";
    panel.innerHTML =
      `<details class="algo-details" ${isTabletDrawer() ? '' : 'open'}><summary class="algo-head"><span class="algo-badge">算法流程</span><span class="algo-name">${e.title}</span>` +
      (e.tag ? `<span class="algo-role">${e.tag}</span>` : "") +
      (info.cost ? `<span class="algo-cost">${info.cost}</span>` : "") +
      `<span class="algo-expand-hint" aria-hidden="true">查看说明</span></summary><div class="algo-content">` +
      `<p class="algo-line"><span class="algo-key">做什么</span><span>${info.goal}</span></p>` +
      (info.inputs ? `<p class="algo-line"><span class="algo-key">输入与前提</span><span>${info.inputs}</span></p>` : "") +
      `<div class="algo-steps-title">执行步骤</div><ol class="algo-steps">${steps}</ol>` +
      keys + `</div></details>`;
    panel.hidden = false;
  }
  function mount(id) {
    const e = expById(id);
    if (!e) {
      runtime.destroy();
      disposeInput();
      disposeInput = () => {};
      location.hash = "#/";
      return;
    }
    disposeInput();
    disposeInput = () => {};
    const ch = chapterById(e.chapter);
    els.knowledge.hidden = true;
    els.home.hidden = true;
    els.lab.hidden = false;
    els.lab.dataset.visualizer = e.visualizer;
    els.crumb.textContent = `${ch.title} / ${e.title}`;
    els.chapter.textContent = `CHAPTER ${ch.no} · ${ch.title}`;
    els.title.textContent = e.title;
    els.tag.textContent = e.tag;
    renderAlgoPanel(e);
    document
      .querySelectorAll("#chapterNav a")
      .forEach((a) =>
        a.classList.toggle(
          "active",
          a.dataset.chapter === ch.id ||
            a.getAttribute("href") === `#/lab/${id}`,
        ),
      );
    disposeInput = DS.ExperimentInput.createExperimentInput(
      els.input,
      e,
      {
        onApply(values) {
          return runtime.mount(e, {
            input: values,
            onInputError: (error) => disposeInput.setError(error.message),
          });
        },
        onPreset(values) {
          return runtime.mount(e, {
            input: values,
            onInputError: (error) => disposeInput.setError(error.message),
          });
        },
      },
    );
    runtime.mount(e);
    updateTabletOptions();
  }
  function route() {
    closeMenu();
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    if (parts[0] === "lab") mount(parts[1]);
    else if (parts[0] === "knowledge" && DS.Wangdao.chapters.some(ch => ch.id === parts[1])) {
      runtime.destroy(); disposeInput(); disposeInput = () => {};
      els.home.hidden = true; els.lab.hidden = true; els.knowledge.hidden = false;
      DS.WangdaoView.render(parts[1], els.knowledge);
      els.crumb.textContent = "教材知识 / " + DS.Wangdao.chapters.find(ch => ch.id === parts[1]).title;
      document.querySelectorAll("#chapterNav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === location.hash));
    }
    else {
      runtime.destroy();
      disposeInput();
      disposeInput = () => {};
      renderHome(parts[0] === "chapter" ? parts[1] : null);
    }
  }
  els.menu.addEventListener("click", () => {
    if (els.sidebar.classList.contains("open")) { closeMenu(); return; }
    els.sidebar.inert = false;
    els.sidebar.classList.add("open");
    els.scrim.classList.add("show");
    els.menu.setAttribute("aria-expanded", "true");
    els.menu.setAttribute("aria-label", "关闭章节目录");
    els.nav.querySelector("a:not([hidden])")?.focus({ preventScroll: true });
  });
  els.scrim.addEventListener("click", closeMenu);
  els.theme.addEventListener("click", () => {
    if (window.Zhixu?.Theme) { window.Zhixu.Theme.toggle(); return; }
    const theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("ds-theme", theme);
    } catch (_) {
      /* Theme works without storage. */
    }
    runtime.redraw();
  });
  window.addEventListener('zhixu:theme', () => runtime.redraw());
  els.search.addEventListener("input", () => {
    const query = els.search.value.trim().toLowerCase();
    document.querySelectorAll(".nav-labs a, .knowledge-link").forEach((a) => {
      a.hidden = !!query && !(a.dataset.search || a.textContent).toLowerCase().includes(query);
    });
  });
  window.addEventListener("hashchange", route);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
    if (event.key === 'Tab' && els.sidebar.classList.contains('open') && isCompactDrawer()) {
      const controls = [...els.sidebar.querySelectorAll('a, button, input, select')].filter(element => !element.hidden && !element.disabled && element.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (
      event.key === "/" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.target.closest("input, textarea, select, button, a, [contenteditable]")
    ) {
      event.preventDefault();
      if (isCompactDrawer()) els.menu.click();
      els.search.focus();
    }
  });
  let theme = "light";
  try {
    if (localStorage.getItem("ds-theme") === "dark") theme = "dark";
  } catch (_) {
    /* Offline storage may be restricted. */
  }
  document.documentElement.dataset.theme = window.Zhixu?.Theme ? window.Zhixu.Theme.get() : theme;
  document.fonts?.ready.then(() => runtime.redraw());
  byId("chapterCount").textContent = chapters.length;
  byId("experimentCount").textContent = experiments.length;
  byId("structureCount").textContent = new Set(
    experiments.map((e) => e.visualizer),
  ).size;
  byId("experimentSummary").textContent = `${experiments.length} 个实验 · ${DS.Wangdao.chapters.length} 章知识`;
  renderNav();
  window.addEventListener('resize', () => {
    els.sidebar.inert = isCompactDrawer() && !els.sidebar.classList.contains('open');
    document.querySelectorAll('#algoPanel .algo-details').forEach(details => {
      details.open = !isTabletDrawer();
    });
    updateTabletOptions();
  });
  route();
})();
