/* ============================================================
   calc2.js — 第2章 一元函数微分学 可视化组件
   tangentDerivative：导数定义（割线→切线）
   monotonicExtrema：单调性与极值（f 与 f' 对照）
   concavityInflection：凹凸性、拐点与渐近线
   curvatureCircle：曲率与曲率圆
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3, f4 } = UI;

  /* ---------- 导数定义 ---------- */
  W.tangentDerivative = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -2.4, xMax: 2.4, yMin: -1.4, yMax: 5.2,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { x0: 0.6, h: 1 };
    const f = x => x * x;

    UI.slider(ctrl, { label: 'x₀', min: -2, max: 2, step: 0.1, value: state.x0, fmt: v => v.toFixed(1), onInput: v => { state.x0 = v; render(); } });
    UI.slider(ctrl, { label: 'Δx = h', min: -1.5, max: 1.5, step: 0.05, value: state.h, fmt: v => v.toFixed(2), onInput: v => { state.h = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      const x0 = state.x0, h = state.h, x1 = x0 + h;
      const slope = (f(x1) - f(x0)) / (x1 - x0 || 1e-9);
      const k = 2 * x0;
      plot.clearLayers();
      plot.curve(f, { color: T['--brand'], width: 2.6, from: -2.4, to: 2.4 });
      // 割线
      plot.custom((p, ctx) => {
        const xa = p.X(Math.min(x0, x1)) - 30, xb = p.X(Math.max(x0, x1)) + 30;
        const ya = p.Y(f(x0) + slope * (Math.min(x0, x1) + (xa - p.X(Math.min(x0, x1))) / (p.pw / (p.o.xMax - p.o.xMin)) - Math.min(x0, x1)));
        // 直接用像素画割线更稳妥
        const px0 = p.X(x0), py0 = p.Y(f(x0));
        const px1 = p.X(x1), py1 = p.Y(f(x1));
        const dx = px1 - px0, dy = py1 - py0;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        ctx.save();
        ctx.strokeStyle = D.withAlpha(C('--red'), 0.85); ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(px0 - ux * 120, py0 - uy * 120);
        ctx.lineTo(px0 + ux * 120, py0 + uy * 120);
        ctx.stroke();
        ctx.restore();
      });
      // 切线
      plot.curve(x => f(x0) + k * (x - x0), { color: T['--accent'], width: 2, to: 2.4, from: -2.4 });
      plot.dot(x0, f(x0), { color: T['--brand'] });
      plot.dot(x1, f(x1), { color: T['--red'] });
      plot.vline(x0, { color: D.withAlpha(T['--brand'], 0.4) });
      plot.vline(x1, { color: D.withAlpha(T['--red'], 0.4) });
      plot.note(x0 + 0.08, f(x0) - 0.35, 'A', { align: 'left', color: T['--brand'], size: 12 });
      plot.note(x1 + 0.08, f(x1) + 0.18, 'B', { align: 'left', color: T['--red'], size: 12 });
      plot.render();
      UI.readout(out, [
        ['f(x₀)', f(x0).toFixed(3)],
        ['割线斜率 Δy/Δx', slope.toFixed(5)],
        ['切线斜率 f′(x₀) = 2x₀', k.toFixed(5)],
        ['|割线 − 切线|', Math.abs(slope - k).toExponential(3)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 单调性与极值 ---------- */
  W.monotonicExtrema = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -2.6, xMax: 2.6, yMin: -1.6, yMax: 3.2,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const state = { a: 1 };
    const f = (x, a) => x * x * x / 3 - a * x;
    const fp = (x, a) => x * x - a;

    UI.slider(ctrl, { label: '参数 a', min: -2, max: 3, step: 0.1, value: 1, fmt: v => v.toFixed(1), onInput: v => { state.a = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      const a = state.a;
      plot.clearLayers();
      plot.o.yMin = -3.2; plot.o.yMax = 3.2;
      plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
      plot.curve(x => f(x, a), { color: T['--brand'], width: 2.6, from: -2.6, to: 2.6 });
      plot.curve(x => fp(x, a) / 3, { color: T['--purple'], width: 1.8, dash: [5, 4], from: -2.6, to: 2.6 });
      if (a > 0) {
        const r = Math.sqrt(a);
        plot.dot(-r, f(-r, a), { color: T['--red'] });
        plot.dot(r, f(r, a), { color: T['--green'] });
        plot.vline(-r, { color: D.withAlpha(T['--red'], 0.45) });
        plot.vline(r, { color: D.withAlpha(T['--green'], 0.45) });
        plot.note(-r - 0.1, f(-r, a) + 0.3, '极大值', { align: 'right', color: T['--red'], size: 11 });
        plot.note(r + 0.1, f(r, a) - 0.3, '极小值', { align: 'left', color: T['--green'], size: 11 });
      } else {
        plot.note(0, 0.5, a === 0 ? 'a = 0：f′ ≥ 0，无极值（拐点）' : 'a < 0：f′ > 0，函数单调递增', { align: 'center', color: T['--ink-3'], size: 11 });
      }
      plot.note(2.45, 2.6, '蓝色 f(x)', { align: 'right', color: T['--brand'], size: 10.5 });
      plot.note(2.45, 2.2, '紫色 f′(x)/3（示意）', { align: 'right', color: T['--purple'], size: 10.5 });
      plot.render();
      UI.readout(out, [
        ['f′(x) = x² − a', a > 0 ? `零点 x = ±${Math.sqrt(a).toFixed(3)}` : (a === 0 ? 'x = 0（不变号）' : '无实零点')],
        ['单调递增区间', a > 0 ? `(−∞, −${Math.sqrt(a).toFixed(2)}) ∪ (${Math.sqrt(a).toFixed(2)}, +∞)` : '(−∞, +∞)'],
        ['单调递减区间', a > 0 ? `(−${Math.sqrt(a).toFixed(2)}, ${Math.sqrt(a).toFixed(2)})` : '无'],
        ['极值', a > 0 ? '极大值 + 极小值（f″ = 2x 变号处）' : '无极值']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 凹凸性与拐点 ---------- */
  W.concavityInflection = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -2.6, xMax: 2.6, yMin: -2.2, yMax: 2.2,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'cubic' };
    UI.seg(ctrl, [
      { label: '三次函数（有拐点）', value: 'cubic' },
      { label: '水平渐近线', value: 'horiz' },
      { label: '铅直渐近线', value: 'vert' },
      { label: '斜渐近线', value: 'slant' }
    ], v => { state.mode = v; render(); }, 0);

    function render() {
      const T = D.Theme.cache;
      plot.clearLayers();
      if (state.mode === 'cubic') {
        const f = x => x * x * x - 3 * x;
        plot.curve(f, { color: T['--brand'], width: 2.6, from: -2.2, to: 2.2 });
        plot.custom((p, ctx) => {
          ctx.save(); ctx.strokeStyle = D.withAlpha(C('--accent'), 0.7); ctx.setLineDash([4, 4]);
          ctx.beginPath();
          const y0 = p.Y(0);
          ctx.moveTo(p.px, y0); ctx.lineTo(p.px + p.pw, y0);
          ctx.stroke(); ctx.restore();
        });
        plot.dot(0, 0, { color: T['--red'] });
        plot.vline(0, { color: D.withAlpha(T['--red'], 0.5) });
        plot.note(0.1, 0.25, '拐点 (0, 0)', { align: 'left', color: T['--red'], size: 11 });
        plot.note(-2.4, 1.6, 'x<0：f″>0，凹（下凹/凹向上）', { align: 'left', color: T['--brand'], size: 11 });
        plot.note(0.2, -1.9, 'x>0：f″<0，凸', { align: 'left', color: T['--ink-3'], size: 11 });
        UI.readout(out, [['f″(x) = 6x', '在 x=0 两侧变号'], ['拐点', '(0, 0)'], ['凹区间', 'x < 0'], ['凸区间', 'x > 0']]);
      } else if (state.mode === 'horiz') {
        const f = x => 1 + 1 / (x * x + 1);
        plot.curve(f, { color: T['--brand'], width: 2.6, from: -2.6, to: 2.6 });
        plot.hline(1, { color: T['--accent'], dash: [5, 4] });
        plot.note(2.4, 1.12, 'y = 1（水平渐近线）', { align: 'right', color: T['--accent'], size: 11 });
        UI.readout(out, [['水平渐近线', 'y = 1（x → ±∞ 时 f(x) → 1）']]);
      } else if (state.mode === 'vert') {
        const f = x => 1 / (x - 1);
        plot.curve(f, { color: T['--brand'], width: 2.6, from: -2.6, to: 1 - 0.02, clipY: true });
        plot.curve(f, { color: T['--brand'], width: 2.6, from: 1 + 0.02, to: 3.6, clipY: true });
        plot.vline(1, { color: T['--red'], dash: [5, 4] });
        plot.note(1.06, 1.6, 'x = 1（铅直渐近线）', { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [['铅直渐近线', 'x = 1（x → 1 时 |f(x)| → ∞）']]);
      } else {
        const f = x => x + 1 / x;
        plot.curve(f, { color: T['--brand'], width: 2.6, from: -2.6, to: -0.16, clipY: true });
        plot.curve(f, { color: T['--brand'], width: 2.6, from: 0.16, to: 2.6, clipY: true });
        plot.curve(x => x, { color: T['--accent'], width: 1.8, dash: [5, 4], from: -2.6, to: 2.6 });
        plot.vline(0, { color: T['--red'], dash: [5, 4] });
        plot.note(2.4, 2.1, 'y = x（斜渐近线）', { align: 'right', color: T['--accent'], size: 11 });
        plot.note(0.1, -1.9, 'x = 0（铅直渐近线）', { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [['斜渐近线', 'y = x'], ['铅直渐近线', 'x = 0'], ['规律', 'a = lim f(x)/x，b = lim (f(x) − ax)']]);
      }
      plot.render();
    }
    render();
    return s;
  };

  /* ---------- 曲率 ---------- */
  W.curvatureCircle = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -3.2, xMax: 3.2, yMin: -1.6, yMax: 3.2,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const state = { x0: 1 };
    const f = x => Math.exp(-x * x / 2) * 1.6;
    const fp = x => -x * f(x);
    const fpp = x => (x * x - 1) * f(x);
    UI.slider(ctrl, { label: 'x₀', min: -2.6, max: 2.6, step: 0.05, value: state.x0, fmt: v => v.toFixed(2), onInput: v => { state.x0 = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      const x0 = state.x0;
      const k1 = fp(x0), k2 = fpp(x0);
      const K = Math.abs(k2) / Math.pow(1 + k1 * k1, 1.5);
      const R = K > 1e-9 ? 1 / K : Infinity;
      // 法线方向 (−f′, 1)，曲率中心沿法线偏移 R
      const ux = -k1 / Math.hypot(k1, 1), uy = 1 / Math.hypot(k1, 1);
      const ccx = x0 + (k2 >= 0 ? R : -R) * ux;
      const ccy = f(x0) + (k2 >= 0 ? R : -R) * uy;
      plot.clearLayers();
      plot.o.yMin = -1.6; plot.o.yMax = 3.2;
      plot.curve(f, { color: T['--brand'], width: 2.6, from: -3.2, to: 3.2 });
      plot.dot(x0, f(x0), { color: T['--red'] });
      plot.custom((p, ctx) => {
        if (!isFinite(R) || R > 30) return;
        ctx.save();
        ctx.strokeStyle = D.withAlpha(C('--purple'), 0.5); ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(p.X(ccx), p.Y(ccy), R * (p.pw / (p.o.xMax - p.o.xMin)), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.fillStyle = C('--purple');
        ctx.beginPath(); ctx.arc(p.X(ccx), p.Y(ccy), 4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      plot.note(2.9, 2.8, '紫色虚线圆为曲率圆', { align: 'right', color: T['--purple'], size: 10.5 });
      plot.render();
      UI.readout(out, [
        ['f′(x₀)', k1.toFixed(4)], ['f″(x₀)', k2.toFixed(4)],
        ['曲率 K', K.toFixed(4)], ['曲率半径 R = 1/K', isFinite(R) ? R.toFixed(4) : '∞'],
        ['曲率最大处', '|f″| 最大处（本函数在 x = ±1 附近弯曲最明显）']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 求导法则（链式法则分层 / 乘积法则几何验证） ---------- */
  W.derivativeRules = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'chain', x0: 1, dx: 0.15, step: 3 };

    UI.seg(ctrl, [
      { label: '链式法则（分层）', value: 'chain' },
      { label: '乘积法则（面积）', value: 'product' }
    ], v => { state.mode = v; syncControls(); render(); }, 0);
    UI.slider(ctrl, { label: 'x₀', min: 0.25, max: 1.35, step: 0.05, value: 1, fmt: v => v.toFixed(2), onInput: v => { state.x0 = v; render(); } });
    UI.slider(ctrl, { label: 'Δx', min: 0.03, max: 0.25, step: 0.01, value: 0.15, fmt: v => v.toFixed(2), onInput: v => { state.dx = v; render(); } });
    const tr = UI.transport(ctrl, { total: 4, speed: 750, onChange: k => { state.step = k; render(); } });
    const trEl = ctrl.lastElementChild;
    tr.go(3);

    function syncControls() {
      trEl.style.display = state.mode === 'chain' ? '' : 'none';
    }

    /* 三块面积 / 链式分层共用的小面板 */
    function drawPanel(ctx, T, px0, w, rows, noteTitle, noteBody, accent) {
      rows.forEach((r, i) => {
        const y = 30 + i * 34;
        D.G.box(ctx, px0, y, w, 28, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
        D.G.label(ctx, px0 + 8, y + 9, r[0], { align: 'left', size: 10, color: T['--ink-3'] });
        D.G.label(ctx, px0 + w - 8, y + 19, r[1], { align: 'right', size: 11, weight: 700, color: T['--brand'], mono: true });
      });
      const ny = 30 + rows.length * 34;
      D.G.box(ctx, px0, ny, w, 84, { fill: D.withAlpha(accent, 0.08), stroke: D.withAlpha(accent, 0.4), radius: 7 });
      D.G.label(ctx, px0 + 8, ny + 14, noteTitle, { align: 'left', size: 10.5, weight: 700, color: accent });
      D.G.lines(ctx, px0 + 8, ny + 32, noteBody, { size: 9.5, lineHeight: 14, align: 'left', color: T['--ink-2'] });
    }

    function render() {
      const T = D.Theme.cache;
      scene.clearLayers();
      const x0 = state.x0, dx = state.dx;
      const panelW = Math.max(118, Math.min(186, (scene.w || 640) * 0.24));
      scene.layer((p, ctx) => {
        const B = { x: 16, y: 42, w: Math.max(120, p.w - 32 - panelW - 10), h: p.h - 72 };
        const px0 = p.w - panelW - 6;
        D.G.label(ctx, 16, 18, state.mode === 'chain'
          ? '链式法则：y = sin u，u = x² + 1　—　由外向里逐层求导再相乘'
          : '乘积法则：A(x) = u(x)·v(x)　—　ΔA 的三块面积', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });

        if (state.mode === 'chain') {
          const u = x0 * x0 + 1, yv = Math.sin(u);
          const aW = Math.max(34, Math.min(84, B.w * 0.17));
          const bW = Math.max(30, (B.w - 16 - 2 * aW) / 3);
          const rowW = 3 * bW + 2 * aW;
          const bx = B.x + Math.max(0, (B.w - rowW) / 2);
          const by = B.y + 26, bh = Math.min(72, B.h * 0.32);
          const cy = by + bh / 2;
          const boxes = [
            { t: 'x', sub: '自变量', c: T['--ink-2'] },
            { t: 'u = x² + 1', sub: `u = ${u.toFixed(3)}`, c: T['--purple'] },
            { t: 'y = sin u', sub: `y = ${yv.toFixed(3)}`, c: T['--green'] }
          ];
          const hi = state.step;
          boxes.forEach((b, i) => {
            const x = bx + i * (bW + aW);
            const lit = hi >= i + 1 || hi >= 3;
            D.G.box(ctx, x, by, bW, bh, {
              fill: D.withAlpha(b.c, lit ? 0.14 : 0.06), stroke: D.withAlpha(b.c, lit ? 0.95 : 0.5),
              radius: 9, width: lit ? 2 : 1.2
            });
            D.G.fitted(ctx, x + bW / 2, by + bh * 0.36, b.t, Math.max(20, bW - 12), { size: 13, weight: 800, color: lit ? b.c : T['--ink-2'] });
            D.G.fitted(ctx, x + bW / 2, by + bh * 0.7, b.sub, Math.max(20, bW - 10), { size: 10.5, weight: 600, color: T['--ink-3'], mono: true });
          });
          const arrows = [
            { from: 0, to: 1, up: 'u = x² + 1', dn: 'du/dx', val: 2 * x0, c: T['--purple'] },
            { from: 1, to: 2, up: 'y = sin u', dn: 'dy/du', val: Math.cos(u), c: T['--green'] }
          ];
          arrows.forEach((a, i) => {
            const x1 = bx + a.from * (bW + aW) + bW + 2;
            const x2 = bx + a.to * (bW + aW) - 2;
            const lit = hi >= i + 1;
            D.G.arrow(ctx, [[x1, cy], [x2, cy]], { color: lit ? a.c : T['--line-2'], width: lit ? 2.4 : 1.4, head: 7 });
            D.G.fitted(ctx, (x1 + x2) / 2, cy - 22, a.up, Math.max(24, aW - 4), { size: 10, weight: 700, color: lit ? a.c : T['--ink-3'] });
            D.G.fitted(ctx, (x1 + x2) / 2, cy + 20, `${a.dn} = ${a.val.toFixed(3)}`, Math.max(24, aW + 30), { size: 10, weight: 700, color: lit ? T['--red'] : T['--ink-3'], mono: true });
          });
          // 结果链
          const ry = by + bh + 44;
          D.G.box(ctx, B.x + 6, ry, B.w - 12, 40, {
            fill: D.withAlpha(C('--red'), hi >= 3 ? 0.09 : 0.04),
            stroke: D.withAlpha(C('--red'), hi >= 3 ? 0.7 : 0.3), radius: 8
          });
          D.G.fitted(ctx, B.x + B.w / 2, ry + 20,
            `dy/dx = (dy/du)·(du/dx) = cos(u)·2x = ${(2 * x0 * Math.cos(u)).toFixed(4)}`,
            B.w - 40, { size: 12.5, weight: 800, color: hi >= 3 ? C('--red') : T['--ink-3'], mono: true });
          D.G.label(ctx, B.x + 6, ry + 58, `数值验证：中心差分 g′(x₀) = ${numDeriv(x0).toFixed(4)}，公式值 = ${(2 * x0 * Math.cos(u)).toFixed(4)}`, { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
          D.G.label(ctx, B.x + 6, ry + 74, '口诀：层层剥皮，每层乘以内层导数', { align: 'left', size: 10.5, color: C('--purple') });

          drawPanel(ctx, T, px0, panelW,
            [['u(x₀)', u.toFixed(4)], ['du/dx', (2 * x0).toFixed(4)], ['dy/du', Math.cos(u).toFixed(4)], ['dy/dx', (2 * x0 * Math.cos(u)).toFixed(4)]],
            '链式法则', ['【f(g(x))】′ = f′(u)·g′(x)', '由外向里，每层求导相乘'], C('--purple'));
          UI.readout(out, [
            ['复合结构', 'y = sin(u)，u = x² + 1'],
            ['du/dx', (2 * x0).toFixed(4)],
            ['dy/du', Math.cos(u).toFixed(4)],
            ['dy/dx = dy/du · du/dx', (2 * x0 * Math.cos(u)).toFixed(4)],
            ['数值校验', `中心差分 ${numDeriv(x0).toFixed(4)}`]
          ]);
        } else {
          const x1 = x0 + dx;
          const u0 = x0 * x0, u1 = x1 * x1;
          const v0 = Math.sin(x0), v1 = Math.sin(x1);
          const du = u1 - u0, dv = v1 - v0;
          const scale = Math.min(B.w * 0.7 / Math.max(u1, 1e-6), B.h * 0.72 / Math.max(v1, 1e-6));
          const bx = B.x + B.w * 0.08, by = B.y + B.h * 0.94;
          const w0 = u0 * scale, wR = du * scale, h0 = v0 * scale, hT = dv * scale;
          // 基础矩形 u×v
          D.G.box(ctx, bx, by - h0, w0, h0, { fill: D.withAlpha(C('--brand'), 0.14), stroke: D.withAlpha(C('--brand'), 0.85), radius: 2, width: 1.6 });
          // 右条带 Δu·v
          D.G.box(ctx, bx + w0, by - h0, wR, h0, { fill: D.withAlpha(C('--red'), 0.28), stroke: D.withAlpha(C('--red'), 0.9), radius: 1, width: 1.4 });
          // 上条带 u·Δv
          D.G.box(ctx, bx, by - h0 - hT, w0, hT, { fill: D.withAlpha(C('--purple'), 0.28), stroke: D.withAlpha(C('--purple'), 0.9), radius: 1, width: 1.4 });
          // 角块 Δu·Δv
          D.G.box(ctx, bx + w0, by - h0 - hT, wR, hT, { fill: D.withAlpha(C('--accent'), 0.5), stroke: D.withAlpha(C('--accent'), 0.95), radius: 1, width: 1.2 });
          D.G.fitted(ctx, bx + w0 / 2, by - h0 / 2, 'A = u·v', Math.max(20, w0 - 6), { size: 12, weight: 800, color: C('--brand') });
          D.G.label(ctx, bx + w0 / 2, by + 14, `u = ${u0.toFixed(3)}`, { align: 'center', size: 10.5, weight: 700, color: T['--ink-2'], mono: true });
          D.G.label(ctx, bx + w0 + wR / 2, by + 14, `u+Δu = ${u1.toFixed(3)}`, { align: 'center', size: 10.5, weight: 700, color: C('--red'), mono: true });
          D.G.label(ctx, bx - 8, by - h0 / 2, `v = ${v0.toFixed(3)}`, { align: 'right', size: 10.5, weight: 700, color: T['--ink-2'], mono: true });
          D.G.label(ctx, bx - 8, by - h0 - hT / 2 - 4, `v+Δv`, { align: 'right', size: 10.5, weight: 700, color: C('--purple') });
          D.G.fitted(ctx, bx + w0 + wR / 2, by - h0 / 2, `u′vΔx`, Math.max(16, wR), { size: 10, weight: 700, color: C('--red') });
          D.G.fitted(ctx, bx + w0 / 2, by - h0 - hT / 2, `uv′Δx`, Math.max(16, w0), { size: 10, weight: 700, color: C('--purple') });
          const exact = u1 * v1 - u0 * v0;
          const lin = (2 * x0 * v0 + u0 * Math.cos(x0)) * dx;
          D.G.label(ctx, B.x + 6, by - h0 - hT - 26, `ΔA = u′vΔx + uv′Δx + o(Δx)：三块面积之和 = ${exact.toFixed(5)}，线性主部 = ${lin.toFixed(5)}`, { align: 'left', size: 11, weight: 700, color: C('--red') });
          D.G.label(ctx, B.x + 6, by - h0 - hT - 46, `角块 Δu·Δv = ${(du * dv).toFixed(6)}（比 Δx 更高阶，求导时可忽略）`, { align: 'left', size: 10.5, color: T['--ink-3'], mono: true });

          drawPanel(ctx, T, px0, panelW,
            [['u(x₀)', u0.toFixed(4)], ['v(x₀)', v0.toFixed(4)], ['(uv)′ = u′v+uv′', (2 * x0 * v0 + u0 * Math.cos(x0)).toFixed(4)], ['数值导数', numDerivProd(x0).toFixed(4)]],
            '乘积法则', ['(uv)′ = u′v + uv′', '矩形面积增量：两条窄带之和'], C('--green'));
          UI.readout(out, [
            ['u, v', `x² 与 sin x，x₀ = ${x0.toFixed(2)}`],
            ['ΔA / dx（精确商）', (exact / dx).toFixed(4)],
            ['u′v + uv′', (2 * x0 * v0 + u0 * Math.cos(x0)).toFixed(4)],
            ['Δu·Δv 项', (du * dv).toFixed(6)],
            ['结论', 'Δx → 0 时角块是高阶无穷小，(uv)′ = u′v + uv′']
          ]);
        }
      });
      scene.render();
    }

    function numDeriv(x) {
      const h = 1e-5, g = t => Math.sin(t * t + 1);
      return (g(x + h) - g(x - h)) / (2 * h);
    }
    function numDerivProd(x) {
      const h = 1e-5, A = t => t * t * Math.sin(t);
      return (A(x + h) - A(x - h)) / (2 * h);
    }

    syncControls();
    render();
    return s;
  };

  /* ---------- 洛必达法则对比 ---------- */
  W.lhopitalCompare = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -0.02, xMax: 2.2, yMin: -0.05, yMax: 1.3,
      height: 300, xLabel: 'x', yLabel: '比值', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { key: 'sinx', x0: 1.2 };
    const cases = {
      sinx: {
        label: 'sin x / x', f: x => Math.sin(x), g: x => x,
        fp: x => Math.cos(x), gp: () => 1, L: 1,
        fname: 'f = sin x，g = x', fpn: "f′ = cos x，g′ = 1"
      },
      cosx: {
        label: '(1 − cos x) / x²', f: x => 1 - Math.cos(x), g: x => x * x,
        fp: x => Math.sin(x), gp: x => 2 * x, L: 0.5,
        fname: 'f = 1 − cos x，g = x²', fpn: "f′ = sin x，g′ = 2x"
      },
      expx: {
        label: '(eˣ − 1 − x) / x²', f: x => Math.exp(x) - 1 - x, g: x => x * x,
        fp: x => Math.exp(x) - 1, gp: x => 2 * x, L: 0.5,
        fname: 'f = eˣ − 1 − x，g = x²', fpn: "f′ = eˣ − 1，g′ = 2x"
      }
    };
    const keys = Object.keys(cases);
    UI.seg(ctrl, keys.map(k => ({ label: cases[k].label, value: k })), v => { state.key = v; render(true); }, 0);
    UI.slider(ctrl, {
      label: 'x₀（向 0 靠近）', min: 0.05, max: 1.6, step: 0.01, value: 1.2,
      fmt: v => v.toFixed(2), onInput: v => { state.x0 = v; render(false); }
    });

    function ratio1(x) {
      const c = cases[state.key];
      const d = c.g(x);
      return Math.abs(d) < 1e-12 ? NaN : c.f(x) / d;
    }
    function ratio2(x) {
      const c = cases[state.key];
      const d = c.gp(x);
      return Math.abs(d) < 1e-12 ? NaN : c.fp(x) / d;
    }

    function render(animate) {
      const T = D.Theme.cache;
      const c = cases[state.key];
      const x0 = state.x0;
      plot.clearLayers();
      plot.curve(ratio1, { color: T['--brand'], width: 2.6, from: 0.02, to: 2.2, clipY: true });
      plot.curve(ratio2, { color: T['--accent'], width: 2.2, dash: [6, 4], from: 0.02, to: 2.2, clipY: true });
      plot.hline(c.L, { color: T['--green'], dash: [5, 4] });
      plot.vline(x0, { color: D.withAlpha(T['--ink-3'], 0.55) });
      plot.dot(x0, ratio1(x0), { color: T['--brand'] });
      plot.dot(x0, ratio2(x0), { color: T['--accent'] });
      plot.note(2.16, c.L + 0.06, `y = ${UI.f3(c.L)}（公共极限）`, { align: 'right', color: T['--green'], size: 11 });
      plot.note(0.06, 1.22, `实线：f/g = ${c.label}　　虚线：f′/g′`, { align: 'left', color: T['--brand'], size: 11 });
      plot.note(x0 + 0.05, ratio1(x0) + 0.09, `f/g = ${UI.f4(ratio1(x0))}`, { align: 'left', color: T['--brand'], size: 10.5 });
      plot.note(x0 + 0.05, ratio2(x0) - 0.09, `f′/g′ = ${UI.f4(ratio2(x0))}`, { align: 'left', color: T['--accent'], size: 10.5 });
      if (animate) plot.animate(430); else plot.render();
      UI.readout(out, [
        ['未定式', `x → 0 时 ${c.label} 为 0/0 型`],
        ['f 与 g', c.fname],
        ['f′ 与 g′', c.fpn],
        ['f/g(x₀) 与 f′/g′(x₀)', `${UI.f4(ratio1(x0))} / ${UI.f4(ratio2(x0))}`],
        ['结论', `两者同趋于 ${UI.f3(c.L)}：lim f/g = lim f′/g′`]
      ]);
    }
    render(true);
    return s;
  };

})(window);
