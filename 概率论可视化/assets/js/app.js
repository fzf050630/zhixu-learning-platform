/* ============================================================
   app.js — 应用主程序：路由 / 渲染 / 进度 / 搜索 / 主题
   章节内容由 content/chN.js 注册到 window.CHN，此处自动收集。
   ============================================================ */
(function (global) {
  'use strict';

  const D = global.Draw;
  const SYL = global.SYLLABUS;
  // 自动收集已注册的章节内容：新增 content/chN.js 后在此登记即可
  const CHAPTERS = {};
  ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8'].forEach(id => {
    const c = global[id.toUpperCase()];
    if (c) CHAPTERS[id] = c;
  });
  const DONE_IDS = SYL.probStructure.filter(c => c.status === 'done' && CHAPTERS[c.id]).map(c => c.id);
  const STORE_KEY = 'kaoyan-prob-progress-v1';
  const THEME_KEY = 'kaoyan-prob-theme';

  /* ---------- DOM ---------- */
  const $ = id => document.getElementById(id);
  const app = document.querySelector('.app');
  const view = $('view');
  const tocEl = $('toc');
  const crumbsEl = $('crumbs');
  const scrollEl = $('scroll');
  const searchEl = $('sideSearch');

  /* ---------- 状态 ---------- */
  let progress = loadProgress();
  let current = { ch: null, sec: null };
  const collapsed = {};

  /* ============================================================
     进度存储
     ============================================================ */
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const value = raw ? JSON.parse(raw) : {};
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (e) { return {}; }
  }
  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { }
    updateProgressBar();
  }
  function isDone(id) { return !!progress[id]; }
  function toggleDone(id) {
    if (progress[id]) delete progress[id]; else progress[id] = Date.now();
    saveProgress();
    refreshTocState();
    renderMasterBtn();
  }
  function updateProgressBar() {
    const all = SYL.coverage.map(c => c.sec);
    const uniq = [...new Set(all)];
    const done = uniq.filter(isDone).length;
    const pct = uniq.length ? Math.round(done / uniq.length * 100) : 0;
    $('progressFill').style.width = pct + '%';
    $('progressText').textContent = pct + '%';
  }

  /* ============================================================
     主题
     ============================================================ */
  function initTheme() {
    if (global.Zhixu?.Theme) { document.documentElement.dataset.theme = global.Zhixu.Theme.get(); D.Theme.read(); return; }
    let t = 'light';
    try { t = localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) { }
    document.documentElement.dataset.theme = t;
    D.Theme.read();
  }
  $('themeBtn').addEventListener('click', () => {
    if (global.Zhixu?.Theme) { global.Zhixu.Theme.toggle(); return; }
    const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = cur;
    try { localStorage.setItem(THEME_KEY, cur); } catch (e) { }
    // 等 CSS 变量生效后重绘
    requestAnimationFrame(() => { D.refreshTheme(); renderCurrent(true); });
  });
  $('printBtn').addEventListener('click', () => global.print());
  global.addEventListener('zhixu:theme', () => requestAnimationFrame(() => D.refreshTheme()));
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('确定要清空所有学习进度吗？')) return;
    progress = {}; saveProgress(); refreshTocState(); renderMasterBtn();
  });

  /* ============================================================
     目录树
     ============================================================ */
  function buildToc() {
    tocEl.innerHTML = '';
    SYL.probStructure.forEach(ch => {
      const grp = document.createElement('div');
      grp.className = 'toc-group';

      const btn = document.createElement('button');
      btn.className = 'toc-chapter';
      btn.type = 'button';
      btn.innerHTML = `<span class="ch-num">${ch.no}</span><span>${ch.title}</span><span class="caret">▾</span>`;
      btn.addEventListener('click', () => {
        if (ch.status === 'done') {
          const c = CHAPTERS[ch.id];
          location.hash = '#' + c.sections[0].id;
        } else {
          grp.classList.toggle('collapsed');
          collapsed[ch.id] = grp.classList.contains('collapsed');
        }
      });
      grp.appendChild(btn);

      const items = document.createElement('div');
      items.className = 'toc-items';

      if (ch.status === 'done') {
        CHAPTERS[ch.id].sections.forEach(sec => {
          const it = document.createElement('button');
          it.className = 'toc-item';
          it.type = 'button';
          it.dataset.sec = sec.id;
          it.innerHTML = `<span class="dot"></span><span class="t-label">${sec.num} ${sec.title}</span>`;
          it.addEventListener('click', () => { location.hash = '#' + sec.id; closeNav(); });
          items.appendChild(it);
        });
      } else {
        const it = document.createElement('button');
        it.className = 'toc-item';
        it.type = 'button';
        it.innerHTML = `<span class="dot"></span><span class="t-label" style="opacity:.55">待建设</span>`;
        it.addEventListener('click', () => { location.hash = '#overview'; closeNav(); });
        items.appendChild(it);
      }

      grp.appendChild(items);
      tocEl.appendChild(grp);
    });
  }

  function refreshTocState() {
    tocEl.querySelectorAll('.toc-item[data-sec]').forEach(it => {
      it.classList.toggle('done', isDone(it.dataset.sec));
    });
  }

  /* ============================================================
     渲染：知识点块
     ============================================================ */

  /**
   * 数学块内的裸 < 与 > 会被 HTML 解析器当作标签（例如 \( x<a \) 中的 <a），
   * 导致公式被截断。这里只转义 \(...\) 与 \[...\] 内部，保留外层 HTML 结构。
   * 注意：不转义 & —— LaTeX 的 cases 环境依赖 & 作为对齐符。
   */
  function escapeMath(html) {
    if (html === undefined || html === null) return '';
    return String(html).replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, m =>
      m.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    );
  }

  /** 纯文本整体转义（用于大纲原文等非 HTML 内容） */
  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderBlock(b) {
    const el = document.createElement('div');
    switch (b.t) {
      case 'h3':
        el.className = 'sub-head';
        el.innerHTML = `<h3 class="sub"><span class="idx">${b.idx}</span>${escapeMath(b.text)}</h3>`;
        break;
      case 'p':
        el.innerHTML = `<p>${escapeMath(b.html)}</p>`;
        break;
      case 'list':
        el.innerHTML = b.ordered
          ? `<ol class="clean">${b.items.map(i => `<li>${escapeMath(i)}</li>`).join('')}</ol>`
          : `<ul class="clean">${b.items.map(i => `<li>${escapeMath(i)}</li>`).join('')}</ul>`;
        break;
      case 'card':
        el.className = `card ${b.kind || ''}`;
        el.innerHTML = `<div class="card-title"><span class="tag">${b.tag}</span>${escapeMath(b.title)}</div>${escapeMath(b.html)}`;
        break;
      case 'table':
        el.innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr>${b.head.map(h => `<th>${escapeMath(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${escapeMath(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
        break;
      case 'viz': {
        const box = document.createElement('div');
        box.className = 'viz';
        box.innerHTML = `<div class="viz-head"><span class="v-title">◈ ${b.title}</span><span class="v-sub">${b.sub || ''}</span></div><div class="viz-host"></div>`;
        const host = box.querySelector('.viz-host');
        el.appendChild(box);
        // 延迟到插入 DOM 后初始化（需要宽度）
        requestAnimationFrame(() => {
          const fn = global.WIDGETS[b.build];
          if (fn) { try { fn(host); } catch (e) { console.error('widget ' + b.build, e); host.innerHTML = '<div class="viz-body" style="color:var(--red)">组件加载失败：' + e.message + '</div>'; } }
          else host.innerHTML = '<div class="viz-body" style="color:var(--ink-3)">组件 ' + b.build + ' 未实现</div>';
        });
        break;
      }
      default:
        el.innerHTML = escapeMath(b.html || '');
    }
    return el;
  }

  function renderExample(ex) {
    const box = document.createElement('div');
    box.className = 'ex';
    box.innerHTML =
      `<div class="ex-head"><span class="ex-no">${ex.no}</span><span>${ex.meta || ''}</span><span class="ex-meta"></span></div>` +
      `<div class="ex-body"><p><b>题目：</b>${escapeMath(ex.q)}</p>` +
      `<div class="sol"><span class="sol-label">解答</span>${escapeMath(ex.sol)}</div></div>`;
    return box;
  }

  function renderSection(ch, sec) {
    const frag = document.createDocumentFragment();

    // 章节头
    const head = document.createElement('div');
    head.className = 'sec-head';
    head.innerHTML =
      `<div class="sec-kicker">第 ${ch.no} 章 · ${ch.title}</div>` +
      `<h1 class="sec-title">${sec.num} ${sec.title}</h1>` +
      `<p class="sec-sub">${sec.lead}</p>`;
    frag.appendChild(head);

    // 块
    sec.blocks.forEach(b => frag.appendChild(renderBlock(b)));

    // 例题
    if (sec.examples && sec.examples.length) {
      const h = document.createElement('h2');
      h.className = 'blk';
      h.textContent = '典型例题';
      frag.appendChild(h);
      sec.examples.forEach(ex => frag.appendChild(renderExample(ex)));
    }

    // 易错点
    if (sec.pitfalls && sec.pitfalls.length) {
      const c = document.createElement('div');
      c.className = 'card warn';
      c.innerHTML = `<div class="card-title"><span class="tag">易错点</span>必须避开的坑</div><ul class="none">${sec.pitfalls.map(p => `<li>${escapeMath(p)}</li>`).join('')}</ul>`;
      frag.appendChild(c);
    }

    // 掌握按钮
    const mr = document.createElement('div');
    mr.className = 'master-row';
    mr.id = 'masterRow';
    frag.appendChild(mr);

    // 上下节导航
    const idx = ch.sections.findIndex(s => s.id === sec.id);
    const prev = ch.sections[idx - 1], next = ch.sections[idx + 1];
    const nav = document.createElement('div');
    nav.className = 'nav-row';
    nav.innerHTML =
      (prev ? `<button class="btn" data-go="${prev.id}">← ${prev.num} ${prev.title}</button>` : '<span></span>') +
      (next ? `<button class="btn primary" data-go="${next.id}">${next.num} ${next.title} →</button>` : '<span></span>');
    frag.appendChild(nav);

    return frag;
  }

  function renderMasterBtn() {
    const row = $('masterRow');
    if (!row) return;
    const sec = current.sec;
    if (!sec) { row.innerHTML = ''; return; }
    const done = isDone(sec.id);
    row.innerHTML = `<button class="btn ${done ? 'done' : 'primary'}" id="masterBtn">${done ? '✓ 已掌握（点击取消）' : '标记为已掌握'}</button>`;
    $('masterBtn').addEventListener('click', () => toggleDone(sec.id));
  }

  /* ============================================================
     渲染：首页
     ============================================================ */
  function renderOverview() {
    const frag = document.createDocumentFragment();

    const hero = document.createElement('div');
    hero.className = 'hero';
    hero.innerHTML =
      `<h1>考研数学（一）<span class="grad">概率论与数理统计</span><br>可视化学习系统</h1>` +
      `<p>以《2026 年全国硕士研究生招生考试数学考试大纲》为唯一依据，把大纲的每一条考试内容与考试要求逐项落地为「概念 → 公式 → 图示 → 例题 → 易错点」的完整学习路径。当前已完成第 ${DONE_IDS.map(id => CHAPTERS[id].no).join('、')} 章。</p>`;
    frag.appendChild(hero);

    // 数据统计
    const secCount = Object.values(CHAPTERS).reduce((s, c) => s + c.sections.length, 0);
    const exCount = Object.values(CHAPTERS).reduce((s, c) => s + c.sections.reduce((a, x) => a + (x.examples ? x.examples.length : 0), 0), 0);
    const vizCount = Object.values(CHAPTERS).reduce((s, c) => s + c.sections.reduce((a, x) => a + x.blocks.filter(b => b.t === 'viz').length, 0), 0);
    const stats = document.createElement('div');
    stats.className = 'stat-grid';
    stats.innerHTML =
      `<div class="stat b"><div class="n">${DONE_IDS.length}</div><div class="l">已完成章节</div></div>` +
      `<div class="stat p"><div class="n">${secCount}</div><div class="l">知识小节</div></div>` +
      `<div class="stat g"><div class="n">${exCount}</div><div class="l">典型例题</div></div>` +
      `<div class="stat a"><div class="n">${vizCount}</div><div class="l">交互可视化</div></div>`;
    frag.appendChild(stats);

    // 大纲结构
    const h1 = document.createElement('h2');
    h1.className = 'blk';
    h1.textContent = '大纲结构（概率论与数理统计 · 数学一）';
    frag.appendChild(h1);

    const st = document.createElement('div');
    st.innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>章</th><th>内容</th><th class="center">状态</th></tr></thead><tbody>${
      SYL.probStructure.map(c => `<tr><td style="width:52px"><b>${c.no}</b></td><td>${c.title}</td><td class="center">${c.status === 'done' ? '<span class="pill g">已完成</span>' : '<span class="pill">待建设</span>'}</td></tr>`).join('')
    }</tbody></table></div>`;
    frag.appendChild(st);

    // 章节卡片
    const h2 = document.createElement('h2');
    h2.className = 'blk';
    h2.textContent = '开始学习';
    frag.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'map-grid';
    Object.values(CHAPTERS).forEach(ch => {
      const card = document.createElement('button');
      card.className = 'map-card';
      card.type = 'button';
      card.innerHTML =
        `<div class="mc-top"><span class="mc-num">第 ${ch.no} 章</span><span class="mc-t">${ch.title}</span></div>` +
        `<div class="mc-d">${ch.subtitle}</div>` +
        `<div class="mc-tags">${ch.tags.slice(0, 6).map(t => `<span class="pill">${t}</span>`).join('')}</div>`;
      card.addEventListener('click', () => { location.hash = '#' + ch.sections[0].id; closeNav(); });
      grid.appendChild(card);
    });
    frag.appendChild(grid);

    // 考试结构
    const h3 = document.createElement('h2');
    h3.className = 'blk';
    h3.textContent = '试卷结构（数学一）';
    frag.appendChild(h3);

    const es = SYL.examStructure;
    const esEl = document.createElement('div');
    esEl.innerHTML =
      `<div class="tbl-wrap"><table class="tbl">` +
      `<thead><tr><th>题型</th><th class="center">题数</th><th class="center">每题分值</th><th class="center">合计</th></tr></thead><tbody>` +
      es.types.map(t => `<tr><td>${t.name}</td><td class="center">${t.n}</td><td class="center">${t.per || '—'}</td><td class="center">${t.score}</td></tr>`).join('') +
      `<tr><td><b>合计</b></td><td class="center"><b>22</b></td><td class="center">—</td><td class="center"><b>150 分 / 180 分钟</b></td></tr>` +
      `</tbody></table></div>` +
      `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>科目</th><th class="center">占比</th><th class="center">分值</th></tr></thead><tbody>` +
      es.parts.map(p => `<tr><td>${p.name}</td><td class="center">${p.ratio}</td><td class="center">${p.score}</td></tr>`).join('') +
      `</tbody></table></div>`;
    frag.appendChild(esEl);

    // 覆盖自检表
    const h4 = document.createElement('h2');
    h4.className = 'blk';
    h4.textContent = '大纲覆盖自检表（已完成章节）';
    frag.appendChild(h4);

    const note = document.createElement('p');
    note.innerHTML = '<span style="color:var(--ink-3);font-size:13.5px">下表逐条列出大纲考试内容，并给出对应页面锚点，用于机械化核对「不漏知识点」。点击可跳转。</span>';
    frag.appendChild(note);

    DONE_IDS.forEach(cid => {
      const ch = CHAPTERS[cid];
      const rows = SYL.coverage.filter(c => c.ch === cid);
      const box = document.createElement('div');
      box.innerHTML =
        `<h3 class="sub"><span class="idx">${ch.no}</span>${ch.title}</h3>` +
        `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>大纲考试内容</th><th class="center">要求</th><th>对应小节</th></tr></thead><tbody>` +
        rows.map(r => `<tr><td>${r.item}</td><td class="center"><span class="pill b">${r.level}</span></td><td><a href="#${r.sec}" style="color:var(--brand);text-decoration:none;font-weight:600">${r.secTitle}</a></td></tr>`).join('') +
        `</tbody></table></div>`;
      frag.appendChild(box);
    });

    // 大纲原文
    const h5 = document.createElement('h2');
    h5.className = 'blk';
    h5.textContent = '大纲原文（逐字摘录）';
    frag.appendChild(h5);

    DONE_IDS.forEach(cid => {
      const o = SYL.official[cid];
      if (!o) return;
      const d = document.createElement('details');
      d.className = 'acc';
      d.innerHTML =
        `<summary>${o.no}、${o.title} —— 考试内容与考试要求</summary>` +
        `<div class="acc-body">` +
        `<p><b>考试内容</b></p><p>${o.content.map(esc).join('　')}</p>` +
        `<p><b>考试要求</b></p><ol class="clean">${o.requirements.map(r => `<li>${esc(r)}</li>`).join('')}</ol>` +
        `</div>`;
      frag.appendChild(d);
    });

    const src = document.createElement('div');
    src.className = 'card flat';
    src.innerHTML = `<p class="tight" style="font-size:13px;color:var(--ink-3);margin:0">来源：${SYL.source}<br>对应页码：${SYL.sourcePage}</p>`;
    frag.appendChild(src);

    return frag;
  }

  /* ============================================================
     路由与渲染
     ============================================================ */
  function renderCurrent(keepScroll) {
    const hash = (location.hash || '#overview').slice(1);
    const y = keepScroll ? scrollEl.scrollTop : 0;

    // 先注销即将被移除的画布实例，避免监听器与动画泄漏
    D.prune();
    view.innerHTML = '';
    if (hash === 'overview' || hash === '') {
      current = { ch: null, sec: null };
      view.appendChild(renderOverview());
      crumbsEl.innerHTML = '概览';
    } else {
      const sec = findSection(hash);
      if (!sec) { view.appendChild(renderOverview()); crumbsEl.innerHTML = '概览'; }
      else {
        current = { ch: sec.ch, sec: sec.sec };
        view.appendChild(renderSection(sec.ch, sec.sec));
        crumbsEl.innerHTML = `<b>第 ${sec.ch.no} 章</b> ${sec.ch.title} <span>›</span> <b>${sec.sec.num}</b> ${sec.sec.title}`;
      }
    }

    // 数学公式渲染
    if (global.renderMathInElement) {
      try {
        renderMathInElement(view, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false,
          errorColor: '#B7332F',
          macros: { '\\d': '\\mathrm{d}' }
        });
      } catch (e) { console.warn('katex', e); }
    }

    renderMasterBtn();
    refreshTocState();
    updateProgressBar();
    markActiveToc();

    // 滚动
    if (keepScroll) scrollEl.scrollTop = y;
    else scrollEl.scrollTop = 0;

    // 组件需要重新测量
    requestAnimationFrame(() => { D.refreshTheme(); });
  }

  function findSection(id) {
    for (const cid of Object.keys(CHAPTERS)) {
      const ch = CHAPTERS[cid];
      const sec = ch.sections.find(s => s.id === id);
      if (sec) return { ch, sec };
    }
    return null;
  }

  function markActiveToc() {
    tocEl.querySelectorAll('.toc-item').forEach(it => {
      it.classList.toggle('active', current.sec && it.dataset.sec === current.sec.id);
    });
  }

  /* ---------- 事件委托 ---------- */
  view.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) { location.hash = '#' + go.dataset.go; return; }
    const a = e.target.closest('a[href^="#"]');
    if (a) { e.preventDefault(); location.hash = a.getAttribute('href'); }
  });

  /* ---------- 回到顶部 ---------- */
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.innerHTML = '↑';
  toTop.title = '回到顶部';
  toTop.addEventListener('click', () => scrollEl.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(toTop);
  scrollEl.addEventListener('scroll', () => {
    toTop.classList.toggle('show', scrollEl.scrollTop > 400);
  });

  /* ---------- 移动端导航 ---------- */
  function closeNav() {
    if (app.classList.contains('nav-open') && $('sidebar').contains(document.activeElement)) $('menuBtn').focus();
    app.classList.remove('nav-open');
    $('sidebar').inert = global.innerWidth <= 820;
    $('menuBtn').setAttribute('aria-expanded', 'false');
  }
  function openNav() {
    $('sidebar').inert = false;
    app.classList.add('nav-open');
    $('menuBtn').setAttribute('aria-expanded', 'true');
    searchEl.focus();
  }
  $('menuBtn').setAttribute('aria-controls', 'sidebar');
  $('menuBtn').setAttribute('aria-label', '打开章节目录');
  $('menuBtn').addEventListener('click', () => app.classList.contains('nav-open') ? closeNav() : openNav());
  global.addEventListener('resize', () => {
    $('sidebar').inert = global.innerWidth <= 820 && !app.classList.contains('nav-open');
  });
  closeNav();
  $('scrim').addEventListener('click', closeNav);

  /* ---------- 搜索 ---------- */
  searchEl.addEventListener('input', () => {
    const q = searchEl.value.trim().toLowerCase();
    tocEl.querySelectorAll('.toc-item[data-sec]').forEach(it => {
      const sec = findSection(it.dataset.sec);
      if (!sec) return;
      const hay = (sec.sec.num + ' ' + sec.sec.title + ' ' + sec.ch.title + ' ' + (sec.ch.tags || []).join(' ')).toLowerCase();
      const hit = !q || hay.includes(q);
      it.style.display = hit ? '' : 'none';
    });
    tocEl.querySelectorAll('.toc-group').forEach(g => {
      const any = [...g.querySelectorAll('.toc-item[data-sec]')].some(it => it.style.display !== 'none');
      g.style.display = (!q || any) ? '' : 'none';
      if (q && any) g.classList.remove('collapsed');
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.target.closest('input, textarea, select, button, a, [contenteditable]')) {
      e.preventDefault(); if (global.innerWidth <= 820) openNav(); searchEl.focus(); searchEl.select();
    }
    if (e.key === 'Escape' && app.classList.contains('nav-open')) { closeNav(); return; }
    if (e.key === 'Tab' && app.classList.contains('nav-open') && global.innerWidth <= 820) {
      const controls = [...$('sidebar').querySelectorAll('a, button, input, select')].filter(element => !element.hidden && !element.disabled && element.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    if (e.key === 'Escape' && document.activeElement === searchEl) { searchEl.blur(); searchEl.value = ''; searchEl.dispatchEvent(new Event('input')); }
  });

  /* ---------- 路由 ---------- */
  global.addEventListener('hashchange', () => renderCurrent(false));

  /* ============================================================
     启动
     ============================================================ */
  function boot() {
    initTheme();
    buildToc();
    updateProgressBar();
    renderCurrent(false);
    // 首屏尺寸稳定后重绘所有图表
    setTimeout(() => D.refreshTheme(), 120);
    setTimeout(() => D.refreshTheme(), 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window);
