(function () {
  'use strict';
  const P = window.Zhixu;
  const esc = P.escape;
  const byId = id => document.getElementById(id);
  const groupName = group => group === '408' ? '408 计算机基础' : '考研数学';
  byId('subjectNav').innerHTML = ['408', 'math'].map(group => `<section class="nav-group"><h2>${groupName(group)}</h2>${P.subjects.filter(subject => subject.group === group).map(subject => subject.status === 'ready' ? `<a class="nav-item" href="${esc(P.url(subject.id))}"><span class="nav-code">${subject.code}</span>${subject.short}<small>↗</small></a>` : `<div class="nav-item planned"><span class="nav-code">${subject.code}</span>${subject.short}<small>待建设</small></div>`).join('')}</section>`).join('');
  const visuals = {
    'data-structures': { label: '二叉搜索树查找路径动画', meta: () => '逐步播放 · 自定义输入' },
    probability: { label: '正态分布分区与抽样直方图动画', meta: stats => `${stats.visualizations} 个交互图示` },
    'computer-organization': { label: 'Cache 地址划分与组相联查找动画', meta: stats => `${stats.visualizations} 个交互图示` },
    'operating-systems': { label: '进程五状态转换与调度动画', meta: stats => `${stats.visualizations} 个交互图示` },
    'computer-networks': { label: '数据逐层封装与比特流传输动画', meta: stats => `${stats.visualizations} 个交互图示` },
    calculus: { label: '函数曲线、积分面积与动点切线动画', meta: stats => `${stats.visualizations} 个交互图示` },
    'linear-algebra': { label: '矩阵线性变换与基向量动画', meta: stats => `${stats.visualizations} 个交互图示` },
  };
  byId('featuredSubjects').innerHTML = P.subjects.filter(subject => subject.status === 'ready').map(subject => {
    const stats = P.catalog.subjects[subject.id];
    const visual = visuals[subject.id] || { label: subject.title, meta: () => '' };
    return `<article class="subject-card" data-subject-card="${subject.id}" data-status="ready" data-group="${subject.group}"><div class="subject-visual ${subject.id}"><div class="visual-caption"><span>${groupName(subject.group)}</span><span>${subject.code} / INTERACTIVE</span></div><canvas data-preview="${subject.id}" role="img" aria-label="${visual.label}"></canvas></div><div class="subject-body"><div class="subject-title-row"><h3>${subject.title}</h3><span class="available-label">已开放</span></div><p>${subject.detail}</p><div class="subject-meta"><span>${stats.chapters} 个章节</span><span>${stats.items} 个${stats.unit}</span><span>${visual.meta(stats)}</span></div><a class="subject-entry" href="${esc(P.url(subject.id))}"><span>进入${subject.short} <span class="zx-sr">学习空间</span></span><span aria-hidden="true">↗</span></a></div></article>`;
  }).join('');
  byId('plannedSubjects').innerHTML = P.subjects.filter(subject => subject.status === 'planned').map(subject => `<article class="planned-card" data-subject-card="${subject.id}" data-status="planned" data-group="${subject.group}"><span class="planned-icon">${subject.code}</span><div><h3>${subject.title}</h3><p>${subject.description}</p></div><span class="planned-status">待建设</span></article>`).join('');
  if (!P.subjects.some(subject => subject.status === 'planned')) byId('plannedSubjects')?.closest('.roadmap-section')?.setAttribute('hidden', '');
  function renderRecent() {
    const entries = P.recent();
    byId('recentList').innerHTML = entries.length ? entries.map(entry => `<a class="recent-link" href="${esc(P.url(entry.subject, entry.hash))}"><span class="planned-icon">${P.subject(entry.subject).code}</span><div><strong>${esc(entry.title)}</strong><small>${P.subject(entry.subject).title} · ${esc(entry.chapter)}</small></div><span class="result-arrow" aria-hidden="true">→</span></a>`).join('') : '<div class="recent-empty"><span aria-hidden="true">↺</span><span>还没有探索记录。进入一个实验或知识点，下次从这里继续。</span></div>';
  }
  renderRecent();
  window.addEventListener('pageshow', renderRecent);
  const input = byId('globalSearch');
  function search() {
    const query = input.value.trim().toLowerCase();
    byId('searchPanel').hidden = !query;
    byId('overviewContent').hidden = !!query;
    if (!query) { byId('searchResults').replaceChildren(); drawPreviews(); return; }
    const words = query.split(/\s+/);
    const entries = P.catalog.entries.filter(entry => {
      const text = `${entry.title} ${entry.chapter} ${entry.number || ''} ${P.subject(entry.subject).title}`.toLowerCase();
      return words.every(word => text.includes(word));
    });
    byId('searchSummary').textContent = `找到 ${entries.length} 个学习入口`;
    byId('searchResults').innerHTML = entries.length ? entries.map(entry => `<a class="search-result" href="${esc(P.url(entry.subject, entry.hash))}"><span class="planned-icon">${P.subject(entry.subject).code}</span><div><strong>${esc(entry.number ? entry.number + ' ' : '')}${esc(entry.title)}</strong><small>${P.subject(entry.subject).title} / ${esc(entry.chapter)} · ${entry.kind}</small></div><span class="result-arrow" aria-hidden="true">→</span></a>`).join('') : '<p class="search-empty">没有找到相关内容。可以试试“排序”“贝叶斯”“Cache”或“流水线”。目前搜索覆盖数据结构、概率统计与计算机组成原理。</p>';
  }
  input.addEventListener('input', search);
  byId('clearSearch').addEventListener('click', () => { input.value = ''; search(); input.focus(); });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-subject-card]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.group !== button.dataset.filter; });
    drawPreviews();
  }));
  const menu = byId('portalMenu');
  const sidebar = byId('portalSidebar');
  function setMenu(open, restoreFocus = false) {
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    sidebar.inert = window.innerWidth <= 720 && !open;
    byId('portalScrim').hidden = !open;
    if (open) sidebar.querySelector('a')?.focus();
    if (restoreFocus) menu.focus();
  }
  menu.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  byId('portalScrim').addEventListener('click', () => setMenu(false, true));
  sidebar.querySelector('.overview-link').addEventListener('click', () => setMenu(false, true));
  window.addEventListener('resize', () => { if (innerWidth > 720) setMenu(false); else sidebar.inert = !document.body.classList.contains('menu-open'); });
  setMenu(false);
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.target.closest('input, textarea, select, [contenteditable]')) { event.preventDefault(); input.focus(); }
    if (event.key === 'Escape') {
      if (document.body.classList.contains('menu-open')) setMenu(false, true);
      else if (document.activeElement === input) { input.value = ''; search(); }
    }
    if (event.key === 'Tab' && document.body.classList.contains('menu-open')) {
      const links = [...sidebar.querySelectorAll('a')];
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); links.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); links[0].focus(); }
    }
  });
  /* ============================================================
     主页封面插画：七科小幅动画
     主题联动 / 自适应宽度 / 尊重 prefers-reduced-motion
     ============================================================ */
  const TAU = Math.PI * 2;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
  const lerp = (from, to, k) => from + (to - from) * k;
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const MONO = 'ui-monospace, "Cascadia Code", Consolas, monospace';
  const SANS = '"MiSans", "思源黑体 CN", "Microsoft YaHei UI", "PingFang SC", system-ui, sans-serif';

  function withAlpha(color, alpha) {
    const value = String(color).trim();
    if (value.startsWith('#')) {
      let hex = value.slice(1);
      if (hex.length === 3) hex = hex.split('').map(ch => ch + ch).join('');
      const n = parseInt(hex, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
    }
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(',').map(Number);
      return `rgba(${parts[0] || 0},${parts[1] || 0},${parts[2] || 0},${alpha})`;
    }
    return value;
  }
  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
  function dot(ctx, x, y, r, color) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = color; ctx.fill(); }
  function arrowHead(ctx, x, y, angle, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(angle - .42), y - size * Math.sin(angle - .42));
    ctx.lineTo(x - size * Math.cos(angle + .42), y - size * Math.sin(angle + .42));
    ctx.closePath(); ctx.fill();
  }
  const quadX = (from, ctrl, to, k) => (1 - k) * (1 - k) * from + 2 * (1 - k) * k * ctrl + k * k * to;
  // 固定序列的近似正态样本，保证每次重绘分布稳定
  function gaussian(index) {
    const u = Math.abs(Math.sin(index * 12.9898 + 78.233) * 43758.5453) % 1;
    const v = Math.abs(Math.sin(index * 93.9898 + 12.345) * 24634.6345) % 1;
    return Math.sqrt(-2 * Math.log(Math.max(u, 1e-6))) * Math.cos(TAU * Math.min(v, .9999));
  }
  function paletteOf(canvas) {
    const style = getComputedStyle(canvas);
    const root = getComputedStyle(document.documentElement);
    const read = (source, name, fallback) => source.getPropertyValue(name).trim() || fallback;
    return {
      a: read(style, '--viz-a', read(root, '--zx-brand', '#405cce')),
      b: read(style, '--viz-b', read(root, '--zx-green', '#267567')),
      ink: read(root, '--zx-ink', '#202737'),
      muted: read(root, '--zx-muted', '#697587'),
      line: read(root, '--zx-line', '#e3e7ee'),
      surface: read(root, '--zx-surface', '#ffffff'),
      danger: read(root, '--zx-danger', '#c2410c'),
    };
  }

  function paintTree(ctx, w, h, t, p) {
    const s = Math.min(w / 560, 1);
    ctx.fillStyle = withAlpha(p.line, .55);
    for (let x = 18; x < w - 12; x += 30) for (let y = 14; y < h - 8; y += 26) { ctx.beginPath(); ctx.arc(x, y, .9, 0, TAU); ctx.fill(); }
    const nodes = [[.5, .21, '8'], [.3, .51, '3'], [.7, .51, '12'], [.19, .81, '1'], [.41, .81, '6'], [.59, .81, '10'], [.81, .81, '15']];
    const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
    const route = [0, 1, 4];
    const u = Math.min((t % 5.6) / 5.6 * 3.2, 3.2);
    const reached = Math.min(Math.floor(u), 2);
    const move = u < 3 ? u - Math.floor(u) : 1;
    const radius = Math.max(9, 13 * s);
    const at = index => [nodes[index][0] * w, nodes[index][1] * h];
    edges.forEach(([from, to]) => {
      const onPath = route.indexOf(from) >= 0 && route.indexOf(to) === route.indexOf(from) + 1;
      ctx.strokeStyle = onPath ? withAlpha(p.a, .38) : withAlpha(p.line, .95);
      ctx.lineWidth = onPath ? 1.8 : 1.2;
      ctx.beginPath(); ctx.moveTo(...at(from)); ctx.lineTo(...at(to)); ctx.stroke();
    });
    route.forEach((node, index) => {
      if (index === 0 || index > reached + 1) return;
      const from = at(route[index - 1]), to = at(node);
      const k = index <= reached ? 1 : move;
      ctx.strokeStyle = withAlpha(p.a, .85); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(...from); ctx.lineTo(lerp(from[0], to[0], k), lerp(from[1], to[1], k)); ctx.stroke();
    });
    if (u < 3 && route[reached + 1] !== undefined) {
      const from = at(route[reached]), to = at(route[reached + 1]);
      ctx.shadowBlur = 12; ctx.shadowColor = withAlpha(p.a, .8);
      dot(ctx, lerp(from[0], to[0], move), lerp(from[1], to[1], move), 4.2, p.a);
      ctx.shadowBlur = 0;
    }
    nodes.forEach((node, index) => {
      const [x, y] = at(index);
      const routeIndex = route.indexOf(index);
      const visited = routeIndex >= 0 && routeIndex <= reached;
      const active = routeIndex >= 0 && routeIndex === Math.min(reached, 2);
      const gradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
      gradient.addColorStop(0, p.a); gradient.addColorStop(1, p.b);
      if (active) { ctx.shadowBlur = 16; ctx.shadowColor = withAlpha(p.a, .5); }
      else if (!visited) { ctx.shadowBlur = 5; ctx.shadowColor = withAlpha(p.line, .8); }
      ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU);
      ctx.fillStyle = visited ? gradient : p.surface; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = visited ? withAlpha(p.b, .9) : withAlpha(p.a, .5); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.fillStyle = visited ? p.surface : withAlpha(p.ink, .78);
      ctx.font = `700 ${Math.round(11 * s + 2)}px ${MONO}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(node[2], x, y + .5);
      if (active) {
        ctx.beginPath(); ctx.arc(x, y, radius + 4 + 1.6 * Math.sin(t * 3.4), 0, TAU);
        ctx.strokeStyle = withAlpha(p.a, .35); ctx.lineWidth = 1.4; ctx.stroke();
      }
    });
    ctx.font = `600 11px ${MONO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    let chipX = 14;
    ['8', '3', '6'].forEach((token, index) => {
      ctx.fillStyle = index <= reached ? p.a : withAlpha(p.muted, .55);
      ctx.fillText(token, chipX, 15);
      chipX += ctx.measureText(token).width + 5;
      if (index < 2) { ctx.fillStyle = withAlpha(p.muted, .55); ctx.fillText('→', chipX, 15); chipX += ctx.measureText('→').width + 5; }
    });
  }

  function paintCache(ctx, w, h, t, p) {
    const s = Math.min(w / 560, 1);
    const pad = 14, barX = pad, barW = w - pad * 2, barY = 20, barH = 16;
    const fields = [
      { label: '标记 tag', bits: 19, base: .10 },
      { label: '组号 index', bits: 8, base: .22 },
      { label: '块内 offset', bits: 5, base: .12 },
    ];
    const bounds = [barX];
    fields.forEach(field => bounds.push(bounds[bounds.length - 1] + barW * field.bits / 32));
    fields.forEach((field, index) => {
      const x = bounds[index], fw = bounds[index + 1] - bounds[index];
      const pulse = index === 1 ? .06 + .05 * Math.sin(t * 2.4) : 0;
      ctx.fillStyle = withAlpha(p.a, field.base + pulse);
      roundRect(ctx, x + 1, barY, fw - 2, barH, 4); ctx.fill();
      ctx.strokeStyle = withAlpha(p.a, index === 1 ? .75 : .35); ctx.lineWidth = 1; ctx.stroke();
      if (fw > 56) {
        ctx.fillStyle = withAlpha(p.a, .95); ctx.font = `600 9px ${SANS}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(field.label, x + fw / 2, barY + barH / 2 + .5);
      }
    });
    ctx.font = `500 8.5px ${MONO}`; ctx.fillStyle = withAlpha(p.muted, .95);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('31', barX + 7, barY + barH + 5);
    ctx.fillText('13', bounds[1], barY + barH + 5);
    ctx.fillText('5', bounds[2], barY + barH + 5);
    ctx.fillText('0', barX + barW - 7, barY + barH + 5);
    const rows = 4, ways = 4, gap = 4;
    const gridX = pad, gridW = Math.min(w * .60, w - pad * 2 - 96);
    const gridY = barY + barH + 22, gridH = h - gridY - 12;
    const cellH = (gridH - gap * (rows - 1)) / rows, cellW = (gridW - gap * (ways - 1)) / ways;
    const table = [
      ['0x2F1', '0x11B', '0x0C7', '0x3D1'],
      ['0x07E', '0x1A3', '0x290', '0x255'],
      ['0x10F', '0x2B4', '0x3E8', '0x0A1'],
      ['0x0A1', '0x155', '0x1A3', '0x0C7'],
    ];
    const scenarios = [{ set: 2, way: 1, hit: false }, { set: 1, way: 1, hit: true }, { set: 3, way: 2, hit: true }];
    const cycle = 6.2;
    const scenario = scenarios[Math.floor(t / cycle) % scenarios.length];
    const local = (t % cycle) / cycle;
    const rowY = gridY + scenario.set * (cellH + gap), rowCy = rowY + cellH / 2;
    const indexCx = (bounds[1] + bounds[2]) / 2;
    const probeY = barY + barH + 2;
    const ctrlY = probeY + (rowCy - probeY) * .45;
    const travel = clamp(local / .38, 0, 1);
    ctx.setLineDash([4, 4]); ctx.strokeStyle = withAlpha(p.a, .35); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(indexCx, probeY); ctx.quadraticCurveTo(indexCx, ctrlY, gridX - 10, rowCy); ctx.stroke();
    ctx.setLineDash([]);
    for (let row = 0; row < rows; row++) {
      const y = gridY + row * (cellH + gap);
      const lit = row === scenario.set ? clamp((local - .26) / .2, 0, 1) : 0;
      for (let way = 0; way < ways; way++) {
        const x = gridX + way * (cellW + gap);
        const isTarget = row === scenario.set && way === scenario.way;
        const flash = isTarget && scenario.hit && local > .55 ? clamp(1 - (local - .55) / .34, 0, 1) : 0;
        roundRect(ctx, x, y, cellW, cellH, 3.5);
        if (flash) {
          const fill = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
          fill.addColorStop(0, withAlpha(p.b, .30 + .38 * flash));
          fill.addColorStop(1, withAlpha(p.a, .30 + .32 * flash));
          ctx.fillStyle = fill;
        } else {
          ctx.fillStyle = row === scenario.set ? withAlpha(p.a, .08 + .10 * lit) : withAlpha(p.line, .28);
        }
        ctx.fill();
        ctx.strokeStyle = isTarget && local > .55 ? (scenario.hit ? withAlpha(p.b, .9) : withAlpha(p.danger, .85)) : withAlpha(p.a, row === scenario.set ? .38 : .22);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = isTarget && flash > .1 ? p.surface : withAlpha(p.muted, .95);
        ctx.font = `500 8px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(table[row][way], x + cellW / 2, y + cellH / 2 + .5);
      }
    }
    ctx.shadowBlur = 10; ctx.shadowColor = withAlpha(p.a, .7);
    dot(ctx, quadX(indexCx, indexCx, gridX - 10, travel), quadX(probeY, ctrlY, rowCy, travel), 3.4, p.a);
    ctx.shadowBlur = 0;
    const statusX = gridX + gridW + 12;
    ctx.fillStyle = withAlpha(p.muted, .9); ctx.font = `500 8.5px ${MONO}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('L1 · 4 路组相联', Math.min(statusX, w - 92), 10);
    if (local > .5) {
      const alpha = clamp((local - .5) / .2, 0, 1);
      const color = scenario.hit ? p.b : p.danger;
      roundRect(ctx, Math.min(statusX - 4, w - 96), gridY + rowCy - 12, 84, 24, 6);
      ctx.fillStyle = withAlpha(color, .12 * alpha); ctx.fill();
      ctx.strokeStyle = withAlpha(color, .55 * alpha); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = withAlpha(color, alpha); ctx.font = `700 11px ${SANS}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(scenario.hit ? '命中 hit' : '缺失 miss', Math.min(statusX + 38, w - 54), gridY + rowCy + .5);
    }
    scenarios.forEach((item, index) => {
      const active = item === scenario;
      ctx.beginPath(); ctx.arc(Math.min(statusX + 8 + index * 11, w - 18), h - 8, active ? 3.2 : 2.2, 0, TAU);
      ctx.fillStyle = active ? p.a : withAlpha(p.line, .9); ctx.fill();
    });
  }

  function paintProcess(ctx, w, h, t, p) {
    const s = Math.min(w / 560, 1);
    const nodes = {
      new: { x: .10, y: .30, label: '新建' },
      ready: { x: .33, y: .30, label: '就绪' },
      run: { x: .57, y: .30, label: '运行' },
      block: { x: .74, y: .82, label: '阻塞' },
      exit: { x: .91, y: .30, label: '终止' },
    };
    const edges = [
      { from: 'new', to: 'ready' },
      { from: 'ready', to: 'run' },
      { from: 'run', to: 'ready', ctrl: [.45, .02] },
      { from: 'run', to: 'block', ctrl: [.70, .54] },
      { from: 'block', to: 'ready', ctrl: [.46, 1.04] },
      { from: 'run', to: 'exit', ctrl: [.77, .08] },
    ];
    const at = key => [nodes[key].x * w, nodes[key].y * h];
    const shrink = 24 * s;
    edges.forEach(edge => {
      const from = at(edge.from), to = at(edge.to);
      const ctrl = edge.ctrl ? [edge.ctrl[0] * w, edge.ctrl[1] * h] : null;
      const angle = Math.atan2(to[1] - (ctrl ? ctrl[1] : from[1]), to[0] - (ctrl ? ctrl[0] : from[0]));
      ctx.strokeStyle = withAlpha(p.line, .95); ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(from[0], from[1]);
      if (ctrl) ctx.quadraticCurveTo(ctrl[0], ctrl[1], to[0], to[1]); else ctx.lineTo(to[0], to[1]);
      ctx.stroke();
      arrowHead(ctx, to[0] - shrink * Math.cos(angle), to[1] - shrink * Math.sin(angle), angle, 6, withAlpha(p.muted, .8));
    });
    const route = [
      { from: 'new', to: 'ready', dur: .8 },
      { from: 'ready', to: 'run', dur: .8 },
      { from: 'run', to: 'block', dur: 1 },
      { from: 'block', to: 'ready', dur: 1.2 },
      { from: 'ready', to: 'run', dur: .8 },
      { from: 'run', to: 'exit', dur: 1.1 },
    ];
    const total = route.reduce((sum, edge) => sum + edge.dur, 0) + 1.4;
    let clock = t % total, current = null, local = 0;
    for (const edge of route) {
      if (clock < edge.dur) { current = edge; local = clock / edge.dur; break; }
      clock -= edge.dur;
    }
    if (current) {
      const from = at(current.from), to = at(current.to);
      const edge = edges.find(item => item.from === current.from && item.to === current.to);
      const ctrl = edge && edge.ctrl ? [edge.ctrl[0] * w, edge.ctrl[1] * h] : null;
      const k = ease(clamp(local, 0, 1));
      const x = ctrl ? quadX(from[0], ctrl[0], to[0], k) : lerp(from[0], to[0], k);
      const y = ctrl ? quadX(from[1], ctrl[1], to[1], k) : lerp(from[1], to[1], k);
      ctx.setLineDash([5, 4]); ctx.lineDashOffset = -t * 16;
      ctx.strokeStyle = withAlpha(p.a, .5); ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(from[0], from[1]);
      if (ctrl) ctx.quadraticCurveTo(ctrl[0], ctrl[1], to[0], to[1]); else ctx.lineTo(to[0], to[1]);
      ctx.stroke(); ctx.setLineDash([]);
      ctx.shadowBlur = 14; ctx.shadowColor = withAlpha(p.a, .8);
      dot(ctx, x, y, 5, p.a);
      ctx.shadowBlur = 0;
    }
    Object.entries(nodes).forEach(([key, node]) => {
      const [x, y] = at(key);
      ctx.font = `600 ${Math.round(10.5 * s + 1)}px ${SANS}`;
      const textW = ctx.measureText(node.label).width;
      const pw = textW + 22 * s, ph = 21 * s;
      const hot = !!current && (current.to === key || current.from === key);
      roundRect(ctx, x - pw / 2, y - ph / 2, pw, ph, ph / 2);
      if (hot) {
        const gradient = ctx.createLinearGradient(x - pw / 2, y, x + pw / 2, y);
        gradient.addColorStop(0, p.a); gradient.addColorStop(1, p.b);
        ctx.shadowBlur = 16; ctx.shadowColor = withAlpha(p.a, .45);
        ctx.fillStyle = gradient; ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = withAlpha(p.b, .9);
      } else {
        ctx.fillStyle = withAlpha(p.surface, .92); ctx.fill();
        ctx.strokeStyle = withAlpha(p.line, .95);
      }
      ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = hot ? p.surface : p.ink;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(node.label, x, y + .5);
    });
    ctx.fillStyle = withAlpha(p.muted, .9); ctx.font = `500 8.5px ${MONO}`;
    ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText('调度 · 时间片', w - 12, 10);
  }

  function paintNetwork(ctx, w, h, t, p) {
    const s = Math.min(w / 560, 1);
    const layers = ['应用层', '传输层', '网络层', '链路层'];
    const protocols = ['HTTP · DNS', 'TCP · UDP', 'IP · ICMP', 'Ethernet'];
    const layerX = 14, layerW = Math.min(w * .30, 132), layerY = 12, layerH = 17, layerGap = 7;
    layers.forEach((label, index) => {
      const y = layerY + index * (layerH + layerGap);
      ctx.fillStyle = withAlpha(p.a, .10 + index * .035);
      roundRect(ctx, layerX, y, layerW, layerH, 5); ctx.fill();
      ctx.strokeStyle = withAlpha(p.a, .34); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = withAlpha(p.a, .92); ctx.font = `600 9.5px ${SANS}`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(label, layerX + 10, y + layerH / 2 + .5);
      if (layerW > 108) {
        ctx.textAlign = 'right';
        ctx.fillStyle = withAlpha(p.muted, .8); ctx.font = `500 8px ${MONO}`;
        ctx.fillText(protocols[index], layerX + layerW - 8, y + layerH / 2 + .5);
      }
    });
    const stages = [
      { parts: [['数据', 58, 'body']], pdu: '报文' },
      { parts: [['TCP', 26, 'head'], ['数据', 58, 'body']], pdu: '报文段' },
      { parts: [['IP', 24, 'head'], ['TCP', 26, 'head'], ['数据', 58, 'body']], pdu: '数据报' },
      { parts: [['帧头', 28, 'head'], ['IP', 24, 'head'], ['TCP', 26, 'head'], ['数据', 58, 'body'], ['FCS', 26, 'tail']], pdu: '帧' },
    ];
    const cycle = 8, phases = 5;
    const phase = (t % cycle) / cycle * phases;
    const index = Math.min(Math.floor(phase), phases - 1);
    const within = clamp(phase - index, 0, 1);
    const layerCy = value => layerY + value * (layerH + layerGap) + layerH / 2;
    const packetCx = layerX + layerW + (w - layerX - layerW) * .46;
    const parts = stages[Math.min(index, 3)].parts;
    const partH = 24;
    const totalW = parts.reduce((sum, part) => sum + part[1], 0) + (parts.length - 1) * 2;
    const previous = layerCy(Math.max(0, index - 1));
    const target = layerCy(Math.min(index, 3));
    const packetCy = index === 0 ? target : index < 4 ? lerp(previous, target, ease(within)) : target;
    const packetX = packetCx - totalW / 2;
    let cursorX = packetX;
    ctx.font = `600 9px ${SANS}`;
    parts.forEach(([label, partW, kind]) => {
      roundRect(ctx, cursorX, packetCy - partH / 2, partW, partH, 4);
      if (kind === 'body') {
        ctx.fillStyle = withAlpha(p.a, .16); ctx.fill();
        ctx.setLineDash([3, 3]); ctx.strokeStyle = withAlpha(p.a, .6); ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
      } else if (kind === 'head') {
        const gradient = ctx.createLinearGradient(cursorX, packetCy - partH / 2, cursorX + partW, packetCy + partH / 2);
        gradient.addColorStop(0, withAlpha(p.b, .88)); gradient.addColorStop(1, withAlpha(p.a, .88));
        ctx.fillStyle = gradient; ctx.fill();
        ctx.strokeStyle = withAlpha(p.b, .7); ctx.lineWidth = 1; ctx.stroke();
      } else {
        ctx.fillStyle = withAlpha(p.b, .30); ctx.fill();
        ctx.strokeStyle = withAlpha(p.b, .65); ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.fillStyle = kind === 'head' ? p.surface : withAlpha(p.ink, .92);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, cursorX + partW / 2, packetCy + .5);
      cursorX += partW + 2;
    });
    if (index < 4) {
      ctx.setLineDash([3, 4]); ctx.strokeStyle = withAlpha(p.a, .45); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(layerX + layerW + 4, packetCy); ctx.lineTo(packetX - 6, packetCy); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = withAlpha(p.muted, .95); ctx.font = `500 9px ${MONO}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('PDU · ' + stages[Math.min(index, 3)].pdu, packetCx - 22, packetCy + partH / 2 + 10);
    const wireY = h - 13, wireX0 = layerX + layerW + 36, wireX1 = w - 14;
    ctx.strokeStyle = withAlpha(p.line, .95); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(wireX0, wireY); ctx.lineTo(wireX1, wireY); ctx.stroke();
    if (index === 4) {
      for (let k = 0; k < 10; k++) {
        const offset = (t * 90 + k * 26) % Math.max(1, wireX1 - wireX0 - 6);
        ctx.fillStyle = withAlpha(k % 2 ? p.b : p.a, .85);
        ctx.fillRect(wireX0 + offset, wireY - 3, 7, 6);
      }
    }
  }

  function paintCalculus(ctx, w, h, t, p) {
    const left = w * .08, right = w * .94, base = h * .72, amplitude = h * .22;
    const xTo = x => left + (x + 3.4) / 6.8 * (right - left);
    const yTo = y => base - y * amplitude;
    ctx.strokeStyle = withAlpha(p.line, .7); ctx.lineWidth = 1;
    for (let gx = -3; gx <= 3; gx++) { const x = xTo(gx); ctx.beginPath(); ctx.moveTo(x, 14); ctx.lineTo(x, base + 6); ctx.stroke(); }
    [-1, 0, 1].forEach(gy => { const y = yTo(gy); ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke(); });
    const area = ctx.createLinearGradient(0, yTo(1), 0, base);
    area.addColorStop(0, withAlpha(p.a, .30));
    area.addColorStop(1, withAlpha(p.a, .02));
    ctx.beginPath(); ctx.moveTo(xTo(-1.2), base);
    for (let x = -1.2; x <= 1.81; x += .06) ctx.lineTo(xTo(x), yTo(Math.sin(x)));
    ctx.lineTo(xTo(1.8), base); ctx.closePath();
    ctx.fillStyle = area; ctx.fill();
    ctx.beginPath();
    for (let x = -3.4; x <= 3.41; x += .05) { const px = xTo(x), py = yTo(Math.sin(x)); x === -3.4 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
    ctx.strokeStyle = p.a; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.stroke();
    const x0 = 2.5 * Math.sin(t * .7);
    const y0 = Math.sin(x0), slope = Math.cos(x0), span = .85;
    ctx.setLineDash([4, 4]); ctx.strokeStyle = withAlpha(p.b, .7); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(xTo(x0), yTo(0)); ctx.lineTo(xTo(x0), yTo(y0)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = p.b; ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(xTo(x0 - span), yTo(y0 - slope * span));
    ctx.lineTo(xTo(x0 + span), yTo(y0 + slope * span));
    ctx.stroke();
    ctx.shadowBlur = 12; ctx.shadowColor = withAlpha(p.b, .8);
    dot(ctx, xTo(x0), yTo(y0), 4.6, p.b);
    ctx.shadowBlur = 0;
    ctx.font = `600 10px ${MONO}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = withAlpha(p.b, .95);
    ctx.fillText(`f′(x₀) = cos(x₀) = ${slope >= 0 ? ' ' : ''}${slope.toFixed(3)}`, left, 13);
    ctx.textAlign = 'right';
    ctx.fillStyle = withAlpha(p.a, .95);
    ctx.fillText('∫₋₁.₂¹.⁸ f(x)dx = 0.590', right, 13);
    ctx.fillStyle = withAlpha(p.muted, .9); ctx.font = `500 8.5px ${MONO}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    [-2, 0, 2].forEach(tick => ctx.fillText(String(tick), xTo(tick), base + 9));
  }

  function paintAlgebra(ctx, w, h, t, p) {
    const ox = w * .46, oy = h * .70;
    const unit = Math.min(w / 13, h / 6.2);
    const A = [[1.6, .8], [.4, 1.4]];
    const k = ease((1 - Math.cos(t * .55)) / 2);
    const M = v => [
      v[0] * lerp(1, A[0][0], k) + v[1] * lerp(0, A[0][1], k),
      v[0] * lerp(0, A[1][0], k) + v[1] * lerp(1, A[1][1], k),
    ];
    const toScreen = v => [ox + v[0] * unit, oy - v[1] * unit];
    ctx.strokeStyle = withAlpha(p.line, .65); ctx.lineWidth = 1;
    for (let gx = -4; gx <= 4; gx++) {
      const a = toScreen([gx, -3]), b = toScreen([gx, 3]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      const c = toScreen([-4, gx]), d = toScreen([4, gx]);
      ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
    }
    ctx.strokeStyle = withAlpha(p.a, .38); ctx.lineWidth = 1.1;
    for (let gx = -4; gx <= 4; gx++) {
      const a = toScreen(M([gx, -3])), b = toScreen(M([gx, 3]));
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      const c = toScreen(M([-4, gx])), d = toScreen(M([4, gx]));
      ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
    }
    const quad = [[0, 0], [1, 0], [1, 1], [0, 1]].map(v => toScreen(M(v)));
    ctx.beginPath(); ctx.moveTo(quad[0][0], quad[0][1]);
    quad.slice(1).forEach(point => ctx.lineTo(point[0], point[1]));
    ctx.closePath();
    const fill = ctx.createLinearGradient(quad[0][0], quad[0][1], quad[2][0], quad[2][1]);
    fill.addColorStop(0, withAlpha(p.a, .22));
    fill.addColorStop(1, withAlpha(p.b, .16));
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = withAlpha(p.a, .8); ctx.lineWidth = 1.6; ctx.stroke();
    const drawVector = (v, color, label) => {
      const end = toScreen(M(v));
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(end[0], end[1]); ctx.stroke();
      arrowHead(ctx, end[0], end[1], Math.atan2(end[1] - oy, end[0] - ox), 7, color);
      ctx.fillStyle = color; ctx.font = `600 9.5px ${MONO}`;
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(label, end[0] + 6, end[1] - 8);
    };
    drawVector([1, 0], p.a, 'Ae₁');
    drawVector([0, 1], p.b, 'Ae₂');
    ctx.font = `500 9px ${MONO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = withAlpha(p.muted, .95);
    ctx.fillText(`t = ${k.toFixed(2)}`, 12, h - 10);
    ctx.fillStyle = withAlpha(p.a, .95);
    ctx.fillText('det A = 1.92', 12, 13);
  }

  function paintProbability(ctx, w, h, t, p) {
    const base = h * .80, sigma = w * .112, center = w * .5, amplitude = h * .60;
    const pdf = z => Math.exp(-z * z / 2);
    const xTo = z => center + z * sigma;
    const yTo = value => base - value * amplitude;
    const bins = 34, span = 3, binWidth = 2 * span / bins * sigma;
    const count = Math.min(Math.floor((t % 7) / 7 * 260), 260);
    const histogram = new Array(bins).fill(0);
    let maximum = 1;
    for (let index = 0; index < count; index++) {
      const z = gaussian(index);
      if (Math.abs(z) > span) continue;
      const bin = clamp(Math.floor((z + span) / (2 * span) * bins), 0, bins - 1);
      histogram[bin]++;
      if (histogram[bin] > maximum) maximum = histogram[bin];
    }
    const barScale = h * .40 / maximum;
    for (let index = 0; index < bins; index++) {
      if (!histogram[index]) continue;
      const x = center + (-span + index / bins * 2 * span) * sigma;
      ctx.fillStyle = withAlpha(p.b, .30);
      ctx.fillRect(x + .5, base - histogram[index] * barScale, binWidth - 1.4, histogram[index] * barScale);
    }
    [[0, 1, .24], [1, 2, .13], [2, 3, .06]].forEach(([from, to, alpha]) => {
      [-1, 1].forEach(side => {
        ctx.beginPath(); ctx.moveTo(xTo(side * from), base);
        for (let z = from; z <= to + .001; z += .05) ctx.lineTo(xTo(side * z), yTo(pdf(z)));
        ctx.lineTo(xTo(side * to), base); ctx.closePath();
        ctx.fillStyle = withAlpha(p.a, side > 0 ? alpha : alpha * .82); ctx.fill();
      });
    });
    ctx.beginPath();
    for (let z = -3.6; z <= 3.61; z += .06) { const px = xTo(z), py = yTo(pdf(z)); z === -3.6 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
    ctx.strokeStyle = p.a; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.stroke();
    ctx.setLineDash([3, 4]); ctx.strokeStyle = withAlpha(p.a, .45); ctx.lineWidth = 1;
    [-3, -2, -1, 1, 2, 3].forEach(z => { ctx.beginPath(); ctx.moveTo(xTo(z), base); ctx.lineTo(xTo(z), yTo(pdf(z))); ctx.stroke(); });
    ctx.setLineDash([]);
    ctx.fillStyle = withAlpha(p.muted, .95); ctx.font = `500 8.5px ${MONO}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    [-3, -2, -1, 0, 1, 2, 3].forEach(z => ctx.fillText(z === 0 ? 'μ' : (z > 0 ? `${z}σ` : `−${-z}σ`), xTo(z), base + 5));
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = withAlpha(p.b, .95); ctx.font = `600 10px ${MONO}`;
    ctx.fillText(`n = ${count}`, 12, 14);
    ctx.textAlign = 'right';
    ctx.fillStyle = withAlpha(p.a, .95);
    ctx.fillText('P(μ±σ) = 68.3%', w - 12, 14);
  }

  const painters = {
    'data-structures': paintTree,
    'computer-organization': paintCache,
    'operating-systems': paintProcess,
    'computer-networks': paintNetwork,
    calculus: paintCalculus,
    'linear-algebra': paintAlgebra,
    probability: paintProbability,
  };

  const entries = [...document.querySelectorAll('[data-preview]')].map(canvas => ({ canvas, ctx: canvas.getContext('2d'), w: 0, h: 0, scale: 1, colors: null }));
  function measure(entry) {
    const width = entry.canvas.clientWidth, height = entry.canvas.clientHeight;
    if (!width || !height) { entry.w = 0; return false; }
    const scale = Math.min(devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(width * scale), pixelHeight = Math.round(height * scale);
    if (entry.canvas.width !== pixelWidth || entry.canvas.height !== pixelHeight) { entry.canvas.width = pixelWidth; entry.canvas.height = pixelHeight; }
    entry.w = width; entry.h = height; entry.scale = scale;
    entry.colors = paletteOf(entry.canvas);
    return true;
  }
  function render(entry, time) {
    if (!entry.w) return;
    const painter = painters[entry.canvas.dataset.preview];
    if (!painter) return;
    entry.ctx.setTransform(entry.scale, 0, 0, entry.scale, 0, 0);
    entry.ctx.clearRect(0, 0, entry.w, entry.h);
    try { painter(entry.ctx, entry.w, entry.h, time, entry.colors); } catch (error) { /* 插画异常不影响门户功能 */ }
  }
  let startedAt = performance.now();
  function drawPreviews() {
    const time = reduceMotion ? 1.4 : (performance.now() - startedAt) / 1000;
    entries.forEach(entry => { if (measure(entry)) render(entry, time); });
  }
  let rafId = null, lastFrame = 0;
  function tick(now) {
    rafId = null;
    if (document.hidden) return;
    if (now - lastFrame >= 32) {
      lastFrame = now;
      const time = (now - startedAt) / 1000;
      entries.forEach(entry => { if (entry.w) render(entry, time); });
    }
    rafId = requestAnimationFrame(tick);
  }
  const observer = new ResizeObserver(() => drawPreviews());
  entries.forEach(entry => observer.observe(entry.canvas));
  window.addEventListener('zhixu:theme', () => drawPreviews());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !reduceMotion && rafId === null) { lastFrame = 0; rafId = requestAnimationFrame(tick); }
  });
  drawPreviews();
  if (!reduceMotion) { startedAt = performance.now(); rafId = requestAnimationFrame(tick); }
})();
