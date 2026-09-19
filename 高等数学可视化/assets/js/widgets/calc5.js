/* ============================================================
   calc5.js — 第5章 多元函数微分学 可视化组件
   partialDerivative：偏导数与全微分（等高线 + 截线）
   directionalGradient：方向导数与梯度
   lagrange：条件极值与拉格朗日乘数法
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3 } = UI;

  /* 在画布上绘制等值线背景 */
  function contour(ctx, box, fn, T, opts) {
    opts = opts || {};
    const { x, y, w, h } = box;
    const xMin = -2.4, xMax = 2.4, yMin = -2.4, yMax = 2.4;
    const step = 8;
    for (let py = y; py < y + h; py += step) {
      for (let px = x; px < x + w; px += step) {
        const X = xMin + (px - x) / w * (xMax - xMin);
        const Y = yMax - (py - y) / h * (yMax - yMin);
        const v = fn(X, Y);
        const t = Math.max(0, Math.min(1, v / (opts.max || 6)));
        ctx.save();
        ctx.fillStyle = `rgba(46,90,224,${(0.05 + t * 0.22).toFixed(3)})`;
        if (opts.negative && v < 0) ctx.fillStyle = `rgba(194,82,27,${(0.08 + Math.min(0.2, -v / 8)).toFixed(3)})`;
        ctx.fillRect(px, py, step, step);
        ctx.restore();
      }
    }
    // 等值线
    const levels = opts.levels || [0.5, 1, 1.5, 2, 3, 4, 5.5];
    ctx.save();
    ctx.strokeStyle = D.withAlpha(T['--brand'], 0.35);
    ctx.lineWidth = 1;
    levels.forEach(lv => {
      ctx.beginPath();
      let started = false;
      for (let i = 0; i <= 200; i++) {
        const ang = i / 200 * Math.PI * 2;
        const xn = Math.cos(ang), yn = Math.sin(ang);
        // 仅对圆对称函数有效：沿射线找 f = lv
        let lo = 0, hi = 3.2;
        for (let k = 0; k < 30; k++) {
          const mid = (lo + hi) / 2;
          if (fn(mid * xn, mid * yn) < lv) lo = mid; else hi = mid;
        }
        const px = x + (lo * xn - xMin) / (xMax - xMin) * w;
        const py = y + (yMax - lo * yn) / (yMax - yMin) * h;
        if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
    ctx.restore();
    ctx.strokeStyle = D.withAlpha(T['--line'], 0.6);
    ctx.strokeRect(x, y, w, h);
  }

  /* ---------- 偏导数与全微分 ---------- */
  W.partialDerivative = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { x: 1.2, y: 0.8 };
    const f = (x, y) => 0.5 * x * x + y * y;
    const fx = x => x, fy = y => 2 * y;
    const box = { x: 70, y: 24, w: 0, h: 0 };

    UI.slider(ctrl, { label: 'x', min: -1.6, max: 1.6, step: 0.05, value: state.x, fmt: v => v.toFixed(2), onInput: v => { state.x = v; render(); } });
    UI.slider(ctrl, { label: 'y', min: -1.6, max: 1.6, step: 0.05, value: state.y, fmt: v => v.toFixed(2), onInput: v => { state.y = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const B = { x: 70, y: 24, w: p.w - 70 - 190, h: p.h - 48 };
        contour(ctx, B, f, T, { max: 4.4 });
        const X = v => B.x + (v + 2.4) / 4.8 * B.w;
        const Y = v => B.y + (2.4 - v) / 4.8 * B.h;
        // 截线：y 固定（沿 x）
        ctx.save(); ctx.strokeStyle = C('--red'); ctx.lineWidth = 2; ctx.beginPath();
        for (let x = -2.4; x <= 2.4; x += 0.05) { const px = X(x), py = Y(state.y); x === -2.4 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
        ctx.stroke();
        ctx.strokeStyle = C('--green'); ctx.beginPath();
        for (let y = -2.4; y <= 2.4; y += 0.05) { const px = X(state.x), py = Y(y); y === -2.4 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
        ctx.stroke(); ctx.restore();
        D.G.dot(ctx, X(state.x), Y(state.y), 5, C('--red'));
        D.G.label(ctx, X(state.x) + 12, Y(state.y) - 12, `P(${state.x.toFixed(2)}, ${state.y.toFixed(2)})`, { align: 'left', size: 11, weight: 700, color: T['--red'] });
        D.G.label(ctx, B.x + 8, B.y + 14, '红色：y 固定，沿 x 的截线（∂f/∂x）', { align: 'left', size: 10.5, color: T['--red'] });
        D.G.label(ctx, B.x + 8, B.y + 30, '绿色：x 固定，沿 y 的截线（∂f/∂y）', { align: 'left', size: 10.5, color: T['--green'] });

        // 右侧数值面板
        const px0 = p.w - 180;
        const rows = [
          ['f(x, y)', f(state.x, state.y).toFixed(4)],
          ['∂f/∂x = x', fx(state.x).toFixed(4)],
          ['∂f/∂y = 2y', fy(state.y).toFixed(4)],
          ['全微分 df', `${fx(state.x).toFixed(3)}dx + ${fy(state.y).toFixed(3)}dy`]
        ];
        rows.forEach((r, i) => {
          const y = 30 + i * 42;
          D.G.box(ctx, px0, y, 168, 34, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 10, y + 11, r[0], { align: 'left', size: 10.5, color: T['--ink-3'] });
          D.G.label(ctx, px0 + 158, y + 23, r[1], { align: 'right', size: 12.5, weight: 700, color: T['--brand'], mono: true });
        });
        D.G.box(ctx, px0, 30 + 4 * 42, 168, 62, { fill: D.withAlpha(C('--teal'), 0.08), stroke: D.withAlpha(C('--teal'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 10, 30 + 4 * 42 + 16, '全微分存在条件', { align: 'left', size: 10.5, weight: 700, color: C('--teal') });
        D.G.label(ctx, px0 + 10, 30 + 4 * 42 + 34, '偏导连续 ⇒ 可微', { align: 'left', size: 10.5, color: T['--ink-2'] });
        D.G.label(ctx, px0 + 10, 30 + 4 * 42 + 50, '可微 ⇒ 偏导存在', { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['f(x, y)', f(state.x, state.y).toFixed(4)],
        ['∂f/∂x（对 x 偏导）', fx(state.x).toFixed(4)],
        ['∂f/∂y（对 y 偏导）', fy(state.y).toFixed(4)],
        ['全微分', `df = ${fx(state.x).toFixed(3)}dx + ${fy(state.y).toFixed(3)}dy`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 方向导数与梯度 ---------- */
  W.directionalGradient = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { x: 0.9, y: 0.7, theta: 40 };
    const f = (x, y) => 0.5 * x * x + y * y;
    const grad = (x, y) => [x, 2 * y];
    UI.slider(ctrl, { label: 'x', min: -1.4, max: 1.4, step: 0.05, value: 0.9, fmt: v => v.toFixed(2), onInput: v => { state.x = v; render(); } });
    UI.slider(ctrl, { label: 'y', min: -1.4, max: 1.4, step: 0.05, value: 0.7, fmt: v => v.toFixed(2), onInput: v => { state.y = v; render(); } });
    UI.slider(ctrl, { label: '方向角 θ', min: 0, max: 360, step: 1, value: 40, fmt: v => v + '°', onInput: v => { state.theta = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const B = { x: 56, y: 20, w: p.w - 56 - 210, h: p.h - 44 };
        contour(ctx, B, f, T, { max: 3 });
        const X = v => B.x + (v + 2.4) / 4.8 * B.w;
        const Y = v => B.y + (2.4 - v) / 4.8 * B.h;
        const g = grad(state.x, state.y);
        const gn = Math.hypot(g[0], g[1]) || 1e-9;
        // 梯度箭头（长度归一化显示）
        D.G.arrow(ctx, [[X(state.x), Y(state.y)], [X(state.x + g[0] / gn * 1.3), Y(state.y + g[1] / gn * 1.3)]], { color: C('--red'), width: 2.6, head: 8 });
        D.G.label(ctx, X(state.x + g[0] / gn * 1.3) + 8, Y(state.y + g[1] / gn * 1.3), '∇f', { align: 'left', size: 12, weight: 800, color: T['--red'] });
        // 方向向量
        const th = state.theta * Math.PI / 180;
        const u = [Math.cos(th), Math.sin(th)];
        D.G.arrow(ctx, [[X(state.x), Y(state.y)], [X(state.x + u[0] * 1.3), Y(state.y + u[1] * 1.3)]], { color: C('--teal'), width: 2.4, head: 8 });
        D.G.label(ctx, X(state.x + u[0] * 1.3) + 8, Y(state.y + u[1] * 1.3) + 12, 'e', { align: 'left', size: 12, weight: 800, color: T['--teal'] });
        D.G.dot(ctx, X(state.x), Y(state.y), 5, C('--brand'));
        // 面板
        const px0 = p.w - 198;
        const dirDeriv = g[0] * u[0] + g[1] * u[1];
        const rows = [
          ['∇f(x, y)', `(${g[0].toFixed(3)}, ${g[1].toFixed(3)})`],
          ['|∇f|', gn.toFixed(4)],
          ['单位方向 e', `(${u[0].toFixed(3)}, ${u[1].toFixed(3)})`],
          ['方向导数 ∂f/∂e', dirDeriv.toFixed(4)]
        ];
        rows.forEach((r, i) => {
          const y = 26 + i * 40;
          D.G.box(ctx, px0, y, 186, 32, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 9, y + 10, r[0], { align: 'left', size: 10.5, color: T['--ink-3'] });
          D.G.label(ctx, px0 + 177, y + 22, r[1], { align: 'right', size: 12, weight: 700, color: T['--brand'], mono: true });
        });
        D.G.box(ctx, px0, 26 + 4 * 40, 186, 86, { fill: D.withAlpha(C('--teal'), 0.08), stroke: D.withAlpha(C('--teal'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 15, '结论', { align: 'left', size: 11, weight: 700, color: C('--teal') });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 33, '梯度方向 = 方向导数最大方向', { align: 'left', size: 10, color: T['--ink-2'] });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 49, '最大值 = |∇f|', { align: 'left', size: 10, color: T['--ink-2'] });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 65, '梯度垂直于等值线', { align: 'left', size: 10, color: T['--ink-2'] });
      });
      scene.render();
      const g = grad(state.x, state.y);
      const th = state.theta * Math.PI / 180;
      const dd = g[0] * Math.cos(th) + g[1] * Math.sin(th);
      UI.readout(out, [
        ['梯度 ∇f', `(${g[0].toFixed(3)}, ${g[1].toFixed(3)})`],
        ['|∇f|（最大方向导数）', Math.hypot(g[0], g[1]).toFixed(4)],
        ['当前方向导数', dd.toFixed(4)],
        ['关系', '∂f/∂e = ∇f · e = |∇f| cos φ']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 拉格朗日乘数法 ---------- */
  W.lagrange = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { r: 1.6 };
    UI.slider(ctrl, { label: '约束半径 x² + y² = r²', min: 0.6, max: 2.2, step: 0.05, value: 1.6, fmt: v => v.toFixed(2), onInput: v => { state.r = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const B = { x: 60, y: 22, w: p.w - 60 - 200, h: p.h - 46 };
        const f = (x, y) => x * y;   // 目标函数
        contour(ctx, B, f, T, { max: 2.4, negative: true });
        const X = v => B.x + (v + 2.4) / 4.8 * B.w;
        const Y = v => B.y + (2.4 - v) / 4.8 * B.h;
        // 约束圆
        ctx.save(); ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.4; ctx.beginPath();
        const r = state.r;
        for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; const px = X(r * Math.cos(a)), py = Y(r * Math.sin(a)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.closePath(); ctx.stroke(); ctx.restore();
        // 极值点（xy 在圆上：±r/√2）
        const c1 = r / Math.SQRT2, pts = [[c1, c1], [-c1, -c1]];
        pts.forEach(([x, y], i) => {
          D.G.dot(ctx, X(x), Y(y), 5, C('--red'));
          D.G.label(ctx, X(x) + 10, Y(y) + (i ? 14 : -12), `${i ? '极小' : '极大'}值 ${(x * y).toFixed(4)}`, { align: 'left', size: 10.5, weight: 700, color: T['--red'] });
        });
        D.G.label(ctx, B.x + 8, B.y + 14, '背景：目标函数 f = xy 的等值线（双曲线族）', { align: 'left', size: 10.5, color: T['--ink-2'] });
        D.G.label(ctx, B.x + 8, B.y + 30, '紫色：约束 x² + y² = r²', { align: 'left', size: 10.5, color: C('--purple') });
        const px0 = p.w - 186;
        const rows = [
          ['∇f = (y, x)', `(${c1.toFixed(3)}, ${c1.toFixed(3)})`],
          ['∇g = (2x, 2y)', `(${(2 * c1).toFixed(3)}, ${(2 * c1).toFixed(3)})`],
          ['λ = y / 2x', (0.5).toFixed(3)],
          ['条件极值', `±${(c1 * c1).toFixed(4)}`]
        ];
        rows.forEach((row, i) => {
          const y = 26 + i * 40;
          D.G.box(ctx, px0, y, 176, 32, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 9, y + 10, row[0], { align: 'left', size: 10.5, color: T['--ink-3'] });
          D.G.label(ctx, px0 + 167, y + 22, row[1], { align: 'right', size: 11.5, weight: 700, color: T['--brand'], mono: true });
        });
        D.G.box(ctx, px0, 26 + 4 * 40, 176, 76, { fill: D.withAlpha(C('--green'), 0.08), stroke: D.withAlpha(C('--green'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 16, '拉格朗日乘数法', { align: 'left', size: 11, weight: 700, color: C('--green') });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 34, 'L = f + λg，令 ∇L = 0', { align: 'left', size: 10, color: T['--ink-2'] });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 50, '即 ∇f = λ∇g', { align: 'left', size: 10, color: T['--ink-2'] });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 66, '等高线与约束相切处取极值', { align: 'left', size: 10, color: T['--ink-2'] });
      });
      scene.render();
      const c1 = state.r / Math.SQRT2;
      UI.readout(out, [
        ['约束', `x² + y² = ${(state.r * state.r).toFixed(3)}`],
        ['极大值 f', (c1 * c1).toFixed(4)],
        ['极小值 f', (-c1 * c1).toFixed(4)],
        ['条件', '∇f = λ∇g ⇔ (y, x) = λ(2x, 2y)']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 链式法则变量树 ---------- */
  W.chainRuleTree = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { target: 'x', x: 1, y: 0.6, step: 3 };

    UI.seg(ctrl, [
      { label: '求 ∂z/∂x', value: 'x' }, { label: '求 ∂z/∂y', value: 'y' }
    ], v => { state.target = v; render(); }, 0);
    UI.slider(ctrl, { label: 'x₀', min: -1.4, max: 1.4, step: 0.05, value: 1, fmt: v => v.toFixed(2), onInput: v => { state.x = v; render(); } });
    UI.slider(ctrl, { label: 'y₀', min: -1.4, max: 1.4, step: 0.05, value: 0.6, fmt: v => v.toFixed(2), onInput: v => { state.y = v; render(); } });
    const tr = UI.transport(ctrl, { total: 4, speed: 800, onChange: k => { state.step = k; render(); } });
    tr.go(3);

    function P(x, y) {
      const u = x * x - y * y, v = x * y;
      const zu = 2 * u + v, zv = u;
      return {
        u, v, zu, zv, ux: 2 * x, uy: -2 * y, vx: y, vy: x,
        zx: zu * 2 * x + zv * y, zy: zu * (-2 * y) + zv * x
      };
    }
    function numDeriv(x, y, t) {
      const h = 1e-5;
      const f = (x2, y2) => {
        const u = x2 * x2 - y2 * y2, v = x2 * y2;
        return u * u + u * v;
      };
      if (t === 'x') return (f(x + h, y) - f(x - h, y)) / (2 * h);
      return (f(x, y + h) - f(x, y - h)) / (2 * h);
    }

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const tg = state.target, x = state.x, y = state.y;
        const G2 = P(x, y);
        const panelW = Math.max(150, Math.min(260, p.w * 0.34));
        const B = { x: 16, y: 40, w: Math.max(200, p.w - panelW - 44), h: p.h - 66 };
        const cx = B.x + B.w / 2;
        const r1 = B.y + 24, r2 = B.y + B.h * 0.4, r3 = B.y + B.h * 0.64;
        const dxm = Math.min(106, B.w * 0.17), dxb = Math.min(138, B.w * 0.23);
        const step = state.step;
        const lit1 = step >= 1, lit2 = step >= 2, lit3 = step >= 3;
        const cA = C('--red'), cB = C('--purple');

        function node(px, py, w, h, title, sub, color, lit) {
          D.G.box(ctx, px - w / 2, py - h / 2, w, h, {
            fill: D.withAlpha(color, lit ? 0.16 : 0.05),
            stroke: D.withAlpha(color, lit ? 0.95 : 0.4), radius: 9, width: lit ? 2.2 : 1.2
          });
          D.G.fitted(ctx, px, py - 7, title, w - 8, { size: 13, weight: 800, color: lit ? color : T['--ink-2'], mono: true });
          D.G.fitted(ctx, px, py + 9, sub, w - 8, { size: 9.5, weight: 600, color: T['--ink-3'] });
        }

        node(cx, r1, 96, 40, 'z', `z = ${(G2.u * G2.u + G2.u * G2.v).toFixed(3)}`, T['--brand'], true);
        node(cx - dxm, r2, 104, 40, 'u', `u = ${G2.u.toFixed(3)}`, T['--teal'], lit1);
        node(cx + dxm, r2, 104, 40, 'v', `v = ${G2.v.toFixed(3)}`, T['--green'], lit2);
        node(cx - dxb, r3, 98, 40, tg === 'x' ? 'x₀' : 'x', tg === 'x' ? `= ${x.toFixed(2)}` : '自变量', T['--accent'], lit1);
        node(cx + dxb, r3, 98, 40, tg === 'y' ? 'y₀' : 'y', tg === 'y' ? `= ${y.toFixed(2)}` : '自变量', T['--accent'], lit2);

        function edge(ax, ay, bx, by, label, lit, color, near) {
          const dim = lit ? 1 : 0.22;
          D.G.arrow(ctx, [[ax, ay], [bx, by]], { color: D.withAlpha(color, dim), width: lit ? 2.2 : 1.1, head: 7 });
          if (!label) return;
          const mx = near === 'near' ? ax + (bx - ax) * 0.72 : ax + (bx - ax) * 0.42;
          const my = near === 'near' ? ay + (by - ay) * 0.72 : ay + (by - ay) * 0.42;
          D.G.fitted(ctx, mx + 6, my - 2, label, 118, { size: 9.5, weight: 700, align: 'left', color: D.withAlpha(lit ? color : T['--ink-3'], lit ? 1 : 0.8), mono: true });
        }
        edge(cx - 20, r1 + 20, cx - dxm + 20, r2 - 20, '∂z/∂u = 2u + v', lit1, cA);
        edge(cx + 20, r1 + 20, cx + dxm - 20, r2 - 20, '∂z/∂v = u', lit2, cB);
        const lx = tg === 'x', uxr = cx - dxm + 16, uxl = cx - dxm - 16, vxr = cx + dxm + 16, vxl = cx + dxm - 16;
        const yl = cx - dxb + 16, yr = cx + dxb - 16;
        edge(uxr, r2 + 20, yl, r3 - 20, '2x', lit1 && lx, cA, 'near');
        edge(uxl, r2 + 20, yr, r3 - 20, '−2y', lit1 && !lx, cA, 'near');
        edge(vxl, r2 + 20, yl - 30, r3 - 20, 'y', lit2 && lx, cB, 'near');
        edge(vxr, r2 + 20, yr, r3 - 20, 'x', lit2 && !lx, cB, 'near');

        // 底部求和面板
        const by = B.y + B.h - 60;
        D.G.box(ctx, B.x + 6, by, B.w - 12, 62, {
          fill: D.withAlpha(C('--green'), lit3 ? 0.09 : 0.03),
          stroke: D.withAlpha(C('--green'), lit3 ? 0.75 : 0.25), radius: 8
        });
        const t1 = tg === 'x' ? G2.zu * G2.ux : G2.zu * G2.uy;
        const t2 = tg === 'x' ? G2.zv * G2.vx : G2.zv * G2.vy;
        const tot = t1 + t2;
        D.G.label(ctx, B.x + 16, by + 14, `路径①　∂z/∂u · ∂u/∂${tg} = ${(tg === 'x' ? G2.zu : G2.zu).toFixed(3)} × ${(tg === 'x' ? G2.ux : G2.uy).toFixed(3)} = ${t1.toFixed(4)}`, { align: 'left', size: 10.5, color: cA, mono: true });
        D.G.label(ctx, B.x + 16, by + 31, `路径②　∂z/∂v · ∂v/∂${tg} = ${G2.zv.toFixed(3)} × ${(tg === 'x' ? G2.vx : G2.vy).toFixed(3)} = ${t2.toFixed(4)}`, { align: 'left', size: 10.5, color: cB, mono: true });
        D.G.fitted(ctx, B.x + 16, by + 50, `∂z/∂${tg} = ① + ② = ${tot.toFixed(4)}`, B.w - 40, { size: 12.5, weight: 800, align: 'left', color: lit3 ? C('--green') : T['--ink-3'], mono: true });

        D.G.label(ctx, 16, 18, `复合函数求导链式图：z = u² + uv，u = x² − y²，v = xy　—　求 ∂z/∂${tg} 的两条路径`, { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });

        // 右侧面板
        const px0 = p.w - panelW - 4;
        const rows = [
          ['∂z/∂u = 2u + v', G2.zu.toFixed(4)],
          ['∂z/∂v = u', G2.zv.toFixed(4)],
          [`∂u/∂${tg}`, (tg === 'x' ? G2.ux : G2.uy).toFixed(4)],
          [`∂v/∂${tg}`, (tg === 'x' ? G2.vx : G2.vy).toFixed(4)],
          [`∂z/∂${tg}`, tot.toFixed(4)],
          ['数值校验', numDeriv(x, y, tg).toFixed(4)]
        ];
        rows.forEach((r, i) => {
          const y2 = 30 + i * 36;
          D.G.box(ctx, px0, y2, panelW, 30, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 8, y2 + 10, r[0], { align: 'left', size: 10, color: T['--ink-3'] });
          D.G.label(ctx, px0 + panelW - 8, y2 + 21, r[1], { align: 'right', size: 11, weight: 700, color: T['--brand'], mono: true });
        });
        const ny = 30 + rows.length * 36;
        D.G.box(ctx, px0, ny, panelW, 60, { fill: D.withAlpha(C('--teal'), 0.08), stroke: D.withAlpha(C('--teal'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 8, ny + 15, '口诀', { align: 'left', size: 10.5, weight: 700, color: C('--teal') });
        D.G.lines(ctx, px0 + 8, ny + 33, ['画变量树，每条路径', '各段相乘，路径相加'], { size: 9.5, lineHeight: 13, align: 'left', color: T['--ink-2'] });
      });
      scene.render();
      const tg = state.target, G2 = P(state.x, state.y);
      const t1 = tg === 'x' ? G2.zu * G2.ux : G2.zu * G2.uy;
      const t2 = tg === 'x' ? G2.zv * G2.vx : G2.zv * G2.vy;
      UI.readout(out, [
        ['函数关系', 'z = u² + uv，u = x² − y²，v = xy'],
        [`∂z/∂${tg}（公式）`, (t1 + t2).toFixed(5)],
        [`∂z/∂${tg}（数值微分）`, numDeriv(state.x, state.y, tg).toFixed(5)],
        ['链式公式', `∂z/∂${tg} = f₁′·∂u/∂${tg} + f₂′·∂v/∂${tg}`],
        ['要点', '有几条路径，公式就有几项；抽象函数二阶导要继续用链式法则']
      ]);
    }

    render();
    return s;
  };

  /* ---------- 空间曲线切线与曲面切平面 ---------- */
  W.tangentPlane = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'curve', t0: 0.9, x: 0.8, y: 0.6 };

    UI.seg(ctrl, [
      { label: '空间曲线的切线', value: 'curve' }, { label: '曲面的切平面', value: 'surface' }
    ], v => { state.mode = v; render(); }, 0);
    const tS = UI.slider(ctrl, { label: '参数 t₀', min: -2.4, max: 2.4, step: 0.05, value: 0.9, fmt: v => v.toFixed(2), onInput: v => { state.t0 = v; render(); } });
    const xS = UI.slider(ctrl, { label: '切点 x₀', min: -1.2, max: 1.2, step: 0.05, value: 0.8, fmt: v => v.toFixed(2), onInput: v => { state.x = v; render(); } });
    const yS = UI.slider(ctrl, { label: '切点 y₀', min: -1.2, max: 1.2, step: 0.05, value: 0.6, fmt: v => v.toFixed(2), onInput: v => { state.y = v; render(); } });
    function sync() {
      tS.input.parentElement.style.display = state.mode === 'curve' ? '' : 'none';
      xS.input.parentElement.style.display = state.mode === 'surface' ? '' : 'none';
      yS.input.parentElement.style.display = state.mode === 'surface' ? '' : 'none';
    }

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const panelW = Math.max(140, Math.min(230, p.w * 0.3));
        const B = { x: 16, y: 40, w: Math.max(150, p.w - panelW - 44), h: p.h - 66 };
        let PR = null;
        function fitView(points) {
          const th = 0.62, ct = Math.cos(th), st = Math.sin(th);
          let uMin = Infinity, uMax = -Infinity, vMin = Infinity, vMax = -Infinity;
          points.forEach(q => {
            const xr = q[0] * ct - q[1] * st, yr = q[0] * st + q[1] * ct;
            const u = xr, v = -q[2] * 0.95 + yr * 0.42;
            if (u < uMin) uMin = u; if (u > uMax) uMax = u;
            if (v < vMin) vMin = v; if (v > vMax) vMax = v;
          });
          const sc = Math.min((B.w - 26) / Math.max(1e-6, uMax - uMin), (B.h - 26) / Math.max(1e-6, vMax - vMin));
          const cu = (uMin + uMax) / 2, cv = (vMin + vMax) / 2;
          return (x, y, z) => {
            const xr = x * ct - y * st, yr = x * st + y * ct;
            return [B.x + B.w / 2 + (xr - cu) * sc, B.y + B.h / 2 + (-z * 0.95 + yr * 0.42 - cv) * sc];
          };
        }
        const path = (pts, color, width, dash) => {
          ctx.save();
          ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
          if (dash) ctx.setLineDash(dash);
          ctx.beginPath();
          pts.forEach((q, i) => { const s2 = PR(q[0], q[1], q[2]); i ? ctx.lineTo(s2[0], s2[1]) : ctx.moveTo(s2[0], s2[1]); });
          ctx.stroke(); ctx.restore();
        };
        D.G.label(ctx, 16, 18, state.mode === 'curve'
          ? '空间曲线 x = cos t，y = sin t，z = t/2：切向量 T = (x′₀, y′₀, z′₀)'
          : '曲面 z = 0.5(x² + y²)：切平面与法向量 n = (f_x, f_y, −1)', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });

        let rows, title;
        if (state.mode === 'curve') {
          const t0 = state.t0;
          const C0 = [Math.cos(t0), Math.sin(t0), t0 / 2];
          const Tv = [-Math.sin(t0), Math.cos(t0), 0.5];
          const pts = [];
          for (let i = 0; i <= 120; i++) { const t = -2.8 + 5.6 * i / 120; pts.push([Math.cos(t), Math.sin(t), t / 2]); }
          const L = 1.1;
          const P1 = C0.map((v, i) => v - Tv[i] * L), P2 = C0.map((v, i) => v + Tv[i] * L);
          PR = fitView(pts.concat([P1, P2]));
          path(pts, T['--brand'], 2.4);
          path([P1, P2], C('--red'), 2.2);
          const E = PR(P2[0], P2[1], P2[2]);
          D.G.arrow(ctx, [PR(C0[0], C0[1], C0[2]), E], { color: C('--red'), width: 2.2, head: 8 });
          D.G.dot(ctx, PR(C0[0], C0[1], C0[2])[0], PR(C0[0], C0[1], C0[2])[1], 4.5, C('--red'));
          D.G.label(ctx, E[0] + 8, E[1] - 6, 'T', { align: 'left', size: 12, weight: 800, color: C('--red') });
          rows = [
            ['切点 M₀', `(${C0.map(v => v.toFixed(3)).join(', ')})`],
            ['切向量 T', `(${Tv.map(v => v.toFixed(3)).join(', ')})`],
            ['切线方程', `(x−x₀)/${Tv[0].toFixed(3)} = (y−y₀)/${Tv[1].toFixed(3)} = (z−z₀)/0.5`],
            ['法平面方程', `${Tv[0].toFixed(3)}(x−x₀) + ${Tv[1].toFixed(3)}(y−y₀) + 0.5(z−z₀) = 0`]
          ];
          title = '切线的方向即切向量 T';
        } else {
          const x0 = state.x, y0 = state.y, z0 = 0.5 * (x0 * x0 + y0 * y0);
          const nx = x0, ny = y0, nz = -1;
          const S = 1.8;
          const wire = [];
          for (let x = -S; x <= S + 1e-9; x += 0.45) {
            const pts = [];
            for (let y = -S; y <= S + 1e-9; y += 0.15) pts.push([x, y, 0.5 * (x * x + y * y)]);
            wire.push(pts);
          }
          for (let y = -S; y <= S + 1e-9; y += 0.45) {
            const pts = [];
            for (let x = -S; x <= S + 1e-9; x += 0.15) pts.push([x, y, 0.5 * (x * x + y * y)]);
            wire.push(pts);
          }
          const pxs = [], pys = [];
          for (let x = -S; x <= S + 1e-9; x += 0.1) pxs.push([x, y0, 0.5 * (x * x + y0 * y0)]);
          for (let y = -S; y <= S + 1e-9; y += 0.1) pys.push([x0, y, 0.5 * (x0 * x0 + y * y)]);
          const d2 = 0.95;
          const planePts = [
            [x0 - d2, y0 - d2], [x0 + d2, y0 - d2], [x0 + d2, y0 + d2], [x0 - d2, y0 + d2]
          ].map(([x, y]) => [x, y, z0 + nx * (x - x0) + ny * (y - y0)]);
          const nlen = Math.hypot(nx, ny, nz) || 1;
          const NEraw = [x0 + nx / nlen * 1.2, y0 + ny / nlen * 1.2, z0 + nz / nlen * 1.2];
          const all = [];
          wire.forEach(L2 => all.push(...L2));
          all.push(...pxs, ...pys, ...planePts, NEraw, [x0, y0, z0]);
          PR = fitView(all);
          wire.forEach(pts => path(pts, D.withAlpha(C('--brand'), 0.45), 1.1));
          path(pxs, C('--teal'), 1.8);
          path(pys, C('--green'), 1.8);
          const corners = planePts.map(q => PR(q[0], q[1], q[2]));
          ctx.save();
          ctx.beginPath();
          corners.forEach((q, i) => { i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--red'), 0.16); ctx.fill();
          ctx.strokeStyle = D.withAlpha(C('--red'), 0.85); ctx.lineWidth = 1.6; ctx.stroke();
          ctx.restore();
          const M0 = PR(x0, y0, z0);
          const NE = PR(NEraw[0], NEraw[1], NEraw[2]);
          D.G.arrow(ctx, [M0, NE], { color: C('--red'), width: 2.4, head: 8 });
          D.G.label(ctx, NE[0] + 8, NE[1] - 6, 'n', { align: 'left', size: 12, weight: 800, color: C('--red') });
          D.G.dot(ctx, M0[0], M0[1], 4.5, C('--red'));
          rows = [
            ['切点 M₀', `(${x0.toFixed(2)}, ${y0.toFixed(2)}, ${z0.toFixed(3)})`],
            ['法向量 n = (f_x, f_y, −1)', `(${nx.toFixed(2)}, ${ny.toFixed(2)}, −1)`],
            ['切平面方程', `${nx.toFixed(2)}(x−x₀) + ${ny.toFixed(2)}(y−y₀) − (z−z₀) = 0`],
            ['法线方程', `(x−x₀)/${nx.toFixed(2)} = (y−y₀)/${ny.toFixed(2)} = (z−z₀)/(−1)`]
          ];
          title = '两条截线的切线张成切平面';
        }

        const px0 = p.w - panelW - 4;
        D.G.box(ctx, px0, 30, panelW, 30, { fill: D.withAlpha(C('--green'), 0.1), stroke: D.withAlpha(C('--green'), 0.5), radius: 7 });
        D.G.label(ctx, px0 + 8, 45, title, { align: 'left', size: 10.5, weight: 700, color: C('--green') });
        rows.forEach((r, i) => {
          const y2 = 66 + i * 50;
          D.G.box(ctx, px0, y2, panelW, 44, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 8, y2 + 12, r[0], { align: 'left', size: 9.5, color: T['--ink-3'] });
          D.G.fitted(ctx, px0 + 8, y2 + 30, r[1], panelW - 16, { size: 10.5, weight: 700, align: 'left', color: T['--brand'], mono: true });
        });
      });
      scene.render();
      if (state.mode === 'curve') {
        const t0 = state.t0, C0 = [Math.cos(t0), Math.sin(t0), t0 / 2], Tv = [-Math.sin(t0), Math.cos(t0), 0.5];
        UI.readout(out, [
          ['切点 M₀', `(${C0.map(v => v.toFixed(4)).join(', ')})`],
          ['切向量 T', `(${Tv.map(v => v.toFixed(4)).join(', ')})`],
          ['切线', '过 M₀ 且方向为 T 的直线（红色）'],
          ['法平面', '过 M₀ 且以 T 为法向量的平面']
        ]);
      } else {
        const x0 = state.x, y0 = state.y, z0 = 0.5 * (x0 * x0 + y0 * y0);
        UI.readout(out, [
          ['切点 M₀', `(${x0.toFixed(3)}, ${y0.toFixed(3)}, ${z0.toFixed(4)})`],
          ['法向量 n', `(${x0.toFixed(3)}, ${y0.toFixed(3)}, −1)`],
          ['切平面', `z = ${z0.toFixed(3)} + ${x0.toFixed(3)}(x − x₀) + ${y0.toFixed(3)}(y − y₀)`],
          ['要点', '显式曲面 z = f(x,y) 的法向量是 (f_x, f_y, −1)，不要漏掉 −1']
        ]);
      }
    }
    sync();
    render();
    return s;
  };

})(window);
