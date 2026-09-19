/* ============================================================
   calc3.js — 第3章 一元函数积分学 可视化组件
   riemannSum：定积分的定义（黎曼和逼近）
   ftcArea：变限积分与牛顿-莱布尼茨公式
   improperIntegral：反常积分的敛散性
   solidVolume：定积分的几何与物理应用
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3, f4 } = UI;

  /* ---------- 定积分定义 ---------- */
  W.riemannSum = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -0.2, xMax: 3.4, yMin: -0.3, yMax: 3.6,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { n: 8, mode: 'left' };
    const f = x => 0.5 * x * x + 0.4;

    UI.slider(ctrl, { label: '分割份数 n', min: 1, max: 200, step: 1, value: 8, fmt: v => v, onInput: v => { state.n = v; render(); } });
    UI.seg(ctrl, [
      { label: '左端点', value: 'left' }, { label: '右端点', value: 'right' }, { label: '中点', value: 'mid' }
    ], v => { state.mode = v; render(); }, 0);

    function exact() {
      // ∫0^3 (0.5x²+0.4) dx = x³/6 + 0.4x
      return Math.pow(3, 3) / 6 + 0.4 * 3;
    }

    function render() {
      const T = D.Theme.cache;
      const a = 0, b = 3, n = state.n, dx = (b - a) / n;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const x = state.mode === 'left' ? a + i * dx : state.mode === 'right' ? a + (i + 1) * dx : a + (i + 0.5) * dx;
        sum += f(x) * dx;
      }
      const E = f(3) * 3; // 上界估计（单调递增时左端点和最小）
      plot.clearLayers();
      plot.custom((p, ctx) => {
        // 柱形
        for (let i = 0; i < n; i++) {
          const x = state.mode === 'left' ? a + i * dx : state.mode === 'right' ? a + (i + 1) * dx : a + (i + 0.5) * dx;
          const h = f(x);
          const x1 = p.X(a + i * dx), x2 = p.X(a + (i + 1) * dx);
          const y0 = p.Y(0), y1 = p.Y(h);
          ctx.save();
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.16);
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.55);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(x1, y1, x2 - x1, y0 - y1);
          ctx.fill(); ctx.stroke();
          ctx.restore();
        }
      });
      plot.curve(f, { color: T['--accent'], width: 2.6, from: a, to: b });
      plot.vline(a, { color: D.withAlpha(T['--ink-3'], 0.5) });
      plot.vline(b, { color: D.withAlpha(T['--ink-3'], 0.5) });
      plot.render();
      const ex = exact();
      UI.readout(out, [
        ['分割 n', String(n)], ['黎曼和 Sₙ', sum.toFixed(6)],
        ['精确值 ∫₀³ f dx', ex.toFixed(6)],
        ['误差', Math.abs(sum - ex).toExponential(3)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 变限积分与 N-L 公式 ---------- */
  W.ftcArea = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -2.4, xMax: 2.6, yMin: -1.6, yMax: 2.6,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const state = { x: 1.2, a: -1.4 };
    const f = x => Math.sin(x) + 0.15;
    const F = x => -Math.cos(x) + 0.15 * x;

    UI.slider(ctrl, { label: '上限 x', min: -2.2, max: 2.4, step: 0.05, value: 1.2, fmt: v => v.toFixed(2), onInput: v => { state.x = v; render(); } });
    UI.slider(ctrl, { label: '下限 a', min: -2.2, max: 1.4, step: 0.05, value: -1.4, fmt: v => v.toFixed(2), onInput: v => { state.a = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      const { x, a } = state;
      const V = F(x) - F(a);
      plot.clearLayers();
      plot.area(f, Math.min(a, x), Math.max(a, x), { color: T['--brand'], alpha: 0.2 });
      plot.curve(f, { color: T['--accent'], width: 2.6, from: -2.4, to: 2.6 });
      plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
      plot.vline(a, { color: D.withAlpha(T['--ink-3'], 0.7), dash: [4, 4] });
      plot.vline(x, { color: T['--brand'], dash: [4, 4] });
      plot.dot(x, f(x), { color: T['--brand'] });
      plot.note(x + 0.1, f(x) + 0.2, '上限 x', { align: 'left', color: T['--brand'], size: 11 });
      plot.note(a - 0.1, f(a) + 0.2, '下限 a', { align: 'right', color: T['--ink-3'], size: 11 });
      plot.render();
      UI.readout(out, [
        ['阴影面积 ∫ₐˣ f(t) dt', V.toFixed(6)],
        ['变限积分 Φ(x)', V.toFixed(6)],
        ['Φ′(x) = f(x)', f(x).toFixed(6)],
        ['N-L 公式', '∫ₐᵇ f(x) dx = F(b) − F(a)']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 反常积分 ---------- */
  W.improperIntegral = function (host) {
    const s = UI.shellPlot(host, {
      xMin: 0, xMax: 10, yMin: 0, yMax: 3.2,
      height: 280, xLabel: 't', yLabel: 'f(t)', xTicks: 5, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const state = { p: 1.5 };
    UI.slider(ctrl, { label: '指数 p', min: 0.4, max: 3, step: 0.1, value: 1.5, fmt: v => v.toFixed(1), onInput: v => { state.p = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      const p = state.p;
      const f = t => 1 / Math.pow(t, p);
      const conv = p > 1;
      // 部分积分 ∫1^T t^{-p} dt
      const part = T0 => p === 1 ? Math.log(T0) : (1 - Math.pow(T0, 1 - p)) / (p - 1);
      plot.clearLayers();
      plot.o.yMax = 3.2;
      plot.curve(f, { color: conv ? T['--green'] : T['--red'], width: 2.6, from: 0.34, to: 10, clipY: true });
      plot.area(f, 1, 10, { color: conv ? T['--green'] : T['--red'], alpha: 0.14 });
      plot.vline(1, { color: D.withAlpha(T['--line-2'], 0.9) });
      plot.note(5, conv ? 1.9 : 2.4, conv ? 'p > 1：阴影面积有限（收敛）' : 'p ≤ 1：面积趋于无穷（发散）', { align: 'center', color: conv ? T['--green'] : T['--red'], size: 12 });
      plot.render();
      UI.readout(out, [
        ['∫₁^∞ dt / tᵖ', conv ? '收敛' : '发散'],
        ['判据', 'p > 1 收敛；p ≤ 1 发散'],
        ['部分积分 ∫₁^T', p === 1 ? `ln T（T → ∞ 发散）` : `(1 − T^(1−p)) / (p − 1)` + (conv ? ' → 有限值' : ' → +∞')],
        ['当前 p', p.toFixed(2)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 定积分的应用 ---------- */
  W.solidVolume = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -0.2, xMax: 3.4, yMin: -0.3, yMax: 3.2,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'volume' };
    const f = x => Math.sqrt(x) + 0.3;
    UI.seg(ctrl, [
      { label: '旋转体体积', value: 'volume' },
      { label: '平面面积', value: 'area' },
      { label: '曲线弧长', value: 'arc' }
    ], v => { state.mode = v; render(); }, 0);

    function render() {
      const T = D.Theme.cache;
      const a = 0, b = 3;
      plot.clearLayers();
      if (state.mode === 'volume') {
        // 旋转体：画薄片示意（椭圆当旋转截面）
        plot.custom((p, ctx) => {
          const n = 26;
          for (let i = 0; i < n; i++) {
            const x1 = a + (b - a) * i / n, x2 = a + (b - a) * (i + 1) / n;
            const r = f((x1 + x2) / 2);
            const cx = p.X((x1 + x2) / 2);
            const rx = Math.abs(p.X(x1) - p.X(x2)) / 2;
            const ry = Math.abs(p.Y(r) - p.Y(0));
            ctx.save();
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.13);
            ctx.strokeStyle = D.withAlpha(C('--brand'), 0.5);
            ctx.beginPath();
            ctx.ellipse(cx, p.Y(0), Math.max(1, rx), ry, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke(); ctx.restore();
          }
        });
        plot.curve(f, { color: T['--accent'], width: 2.4, from: a, to: b });
        plot.curve(x => -f(x), { color: D.withAlpha(T['--accent'], 0.5), width: 1.6, from: a, to: b });
        plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
        const V = Math.PI * (b * b / 2 + 2 * 0.3 * (2 / 3) * Math.pow(b, 1.5) + 0.09 * b);
        UI.readout(out, [
          ['绕 x 轴旋转', 'V = π∫ₐᵇ f²(x) dx'],
          ['体积（数值）', V.toFixed(5)],
          ['薄片法', '取 [x, x+dx]，截面圆面积 πf²(x)']
        ]);
      } else if (state.mode === 'area') {
        plot.area(f, a, b, { color: T['--brand'], alpha: 0.2 });
        plot.curve(f, { color: T['--accent'], width: 2.4, from: a, to: b });
        plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
        const A = (2 / 3) * Math.pow(3, 1.5) + 0.3 * 3;
        UI.readout(out, [['面积', 'A = ∫ₐᵇ |f(x)| dx'], ['数值', A.toFixed(5)], ['元素法', 'dA = f(x) dx']]);
      } else {
        plot.curve(f, { color: T['--accent'], width: 2.6, from: a, to: b });
        let total = 0;
        const n = 24;
        for (let i = 0; i < n; i++) {
          const x1 = a + (b - a) * i / n, x2 = a + (b - a) * (i + 1) / n;
          total += Math.hypot(x2 - x1, f(x2) - f(x1));
        }
        plot.custom((p, ctx) => {
          ctx.save();
          ctx.fillStyle = C('--ink-3');
          ctx.font = '600 11px ' + D.FONT_SANS;
          ctx.textAlign = 'left';
          ctx.fillText('折线逼近弧长：' + total.toFixed(4), p.px + 8, p.py + 14);
          ctx.restore();
        });
        UI.readout(out, [['弧长', 's = ∫ₐᵇ √(1 + f′²(x)) dx'], ['微元', 'ds = √(dx² + dy²)'], ['折线近似值', total.toFixed(5)]]);
      }
      plot.render();
    }
    render();
    return s;
  };

  /* ---------- 原函数族 ---------- */
  W.antiderivativeFamily = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -3.6, xMax: 3.6, yMin: -3.4, yMax: 3.4,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { C: 0.4, x0: 1 };
    const f = x => Math.cos(x);
    const F = (x, c) => Math.sin(x) + c;
    const P = { x: 1.2, y: 1.6 };
    const Cstar = Math.round((P.y - Math.sin(P.x)) * 100) / 100;

    const cS = UI.slider(ctrl, {
      label: '积分常数 C', min: -2.6, max: 2.6, step: 0.1, value: 0.4,
      fmt: v => v.toFixed(1), onInput: v => { state.C = v; render(false); }
    });
    UI.slider(ctrl, {
      label: '切点 x₀', min: -3.2, max: 3.2, step: 0.1, value: 1,
      fmt: v => v.toFixed(1), onInput: v => { state.x0 = v; render(false); }
    });
    UI.button(ctrl, '取过定点 P 的曲线', () => {
      state.C = Cstar; cS.set(Cstar); render(true);
    });

    function render(animate) {
      const T = D.Theme.cache;
      const C0 = state.C, x0 = state.x0;
      plot.clearLayers();
      // 曲线族 F(x) + C
      for (let cc = -2.4; cc <= 2.41; cc += 0.8) {
        if (Math.abs(cc - C0) < 0.06) continue;
        plot.curve(x => F(x, cc), { color: D.withAlpha(T['--brand'], 0.3), width: 1.4 });
      }
      plot.curve(x => F(x, C0), { color: T['--brand'], width: 2.6 });
      plot.curve(x => F(x, C0 - 1.2), { color: D.withAlpha(T['--purple'], 0.8), width: 1.6, dash: [5, 4] });
      // 过定点 P 的曲线
      plot.curve(x => F(x, Cstar), { color: D.withAlpha(T['--red'], 0.85), width: 1.8, dash: [7, 4] });
      plot.dot(P.x, P.y, { color: T['--red'] });
      plot.note(P.x + 0.12, P.y + 0.16, `定点 P(${P.x}, ${P.y})，对应 C* = ${Cstar.toFixed(2)}`, { align: 'left', color: T['--red'], size: 11 });
      // 同一 x₀ 处所有曲线切线平行
      const k = f(x0);
      const seg = (c, color) => {
        const y0v = F(x0, c);
        const xa = x0 - 0.55, xb = x0 + 0.55;
        plot.polyline([[xa, y0v - 0.55 * k], [xb, y0v + 0.55 * k]], { color, width: 2 });
      };
      seg(C0, T['--brand']);
      seg(C0 - 1.2, D.withAlpha(T['--purple'], 0.85));
      plot.dot(x0, F(x0, C0), { color: T['--red'] });
      plot.vline(x0, { color: D.withAlpha(T['--ink-3'], 0.45) });
      plot.note(x0 + 0.1, F(x0, C0) - 0.3, `F′(x₀) = cos x₀ = ${k.toFixed(3)}（各曲线切线斜率相同）`, { align: 'left', color: T['--red'], size: 10.5 });
      plot.note(3.5, 2.95, 'C 不同 ⇒ 曲线沿 y 轴平移，形状完全一致', { align: 'right', color: T['--ink-2'], size: 11 });
      if (animate) plot.animate(430); else plot.render();
      UI.readout(out, [
        ['被积函数 f(x)', 'cos x（所有曲线的导数相同）'],
        ['当前 C', C0.toFixed(2)],
        ['F(x₀) = sin x₀ + C', F(x0, C0).toFixed(4)],
        ['切线斜率 F′(x₀) = f(x₀)', k.toFixed(4)],
        ['过定点 P 的曲线', `C* = ${Cstar.toFixed(2)}（F(x) = sin x + ${Cstar.toFixed(2)}）`]
      ]);
    }
    render(true);
    return s;
  };

  /* ---------- 换元积分法 ---------- */
  W.substitution = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { t0: 0.9, n: 10 };
    UI.slider(ctrl, { label: '参数 t₀', min: 0.08, max: 1.5, step: 0.02, value: 0.9, fmt: v => v.toFixed(2), onInput: v => { state.t0 = v; render(); } });
    UI.slider(ctrl, { label: '分割份数 n', min: 4, max: 24, step: 1, value: 10, fmt: v => v, onInput: v => { state.n = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const gap = 40;
        const B1 = { x: 26, y: 50, w: (p.w - 52 - gap) / 2, h: p.h - 86 };
        const B2 = { x: B1.x + B1.w + gap, y: B1.y, w: B1.w, h: B1.h };
        const TAU2 = Math.PI / 2;
        const n = state.n, t0 = state.t0;

        function panelX(B, xMin, xMax, yMin, yMax) {
          const X = v => B.x + (v - xMin) / (xMax - xMin) * B.w;
          const Y = v => B.y + B.h - (v - yMin) / (yMax - yMin) * B.h;
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.95);
          ctx.lineWidth = 1; ctx.beginPath();
          ctx.moveTo(B.x, Y(yMin)); ctx.lineTo(B.x + B.w, Y(yMin));
          ctx.moveTo(X(xMin), B.y); ctx.lineTo(X(xMin), B.y + B.h);
          ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          for (let i = 0; i <= 4; i++) {
            const v = xMin + (xMax - xMin) * i / 4;
            ctx.fillText(v.toFixed(2), B.x + B.w * i / 4, Y(yMin) + 4);
          }
          ctx.restore();
          return { X, Y };
        }

        // 左：x 平面，f(x) = √(1 − x²)
        const fx = x => Math.sqrt(Math.max(0, 1 - x * x));
        const a1 = panelX(B1, -0.05, 1.18, -0.05, 1.18);
        ctx.save(); ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 140; i++) { const x = i / 140; const px = a1.X(x), py = a1.Y(fx(x)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.stroke(); ctx.restore();
        const x0v = Math.sin(t0);
        let k = Math.floor(x0v / (1 / n));
        k = Math.max(0, Math.min(n - 1, k));
        for (let i = 0; i < n; i++) {
          const xa = i / n, xb = (i + 1) / n, mid = (xa + xb) / 2, hv = fx(mid);
          const px = a1.X(xa), pw = a1.X(xb) - px;
          const lit = i === k;
          ctx.save();
          ctx.fillStyle = lit ? D.withAlpha(C('--red'), 0.42) : D.withAlpha(C('--brand'), 0.12);
          ctx.fillRect(px, a1.Y(hv), pw, a1.Y(0) - a1.Y(hv));
          ctx.restore();
        }
        D.G.dot(ctx, a1.X(x0v), a1.Y(fx(x0v)), 4, C('--red'));
        D.G.label(ctx, B1.x, B1.y - 26, 'x 平面：∫₀¹ √(1 − x²) dx（四分之一圆）', { align: 'left', size: 11, weight: 700, color: T['--brand'] });
        D.G.label(ctx, B1.x + B1.w / 2, B1.y - 8, 'x', { align: 'center', size: 11, color: T['--ink-3'] });

        // 右：t 平面，f(φ(t))·φ′(t) = cos²t
        const gt = t => Math.cos(t) * Math.cos(t);
        const a2 = panelX(B2, -0.05, 1.78, -0.05, 1.18);
        ctx.save(); ctx.strokeStyle = C('--teal'); ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 160; i++) { const t = TAU2 * i / 160; const px = a2.X(t), py = a2.Y(gt(t)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
        ctx.stroke(); ctx.restore();
        const dt = TAU2 / n;
        for (let i = 0; i < n; i++) {
          const ta = i * dt, tb = (i + 1) * dt, mid = (ta + tb) / 2, hv = gt(mid);
          const px = a2.X(ta), pw = a2.X(tb) - px;
          const lit = i === k;
          ctx.save();
          ctx.fillStyle = lit ? D.withAlpha(C('--red'), 0.42) : D.withAlpha(C('--teal'), 0.12);
          ctx.fillRect(px, a2.Y(hv), pw, a2.Y(0) - a2.Y(hv));
          ctx.restore();
        }
        D.G.dot(ctx, a2.X(t0), a2.Y(gt(t0)), 4, C('--red'));
        D.G.label(ctx, B2.x, B2.y - 26, 't 平面：∫₀^{π/2} cos²t dt（同一面积换了形状）', { align: 'left', size: 11, weight: 700, color: T['--teal'] });
        D.G.label(ctx, B2.x + B2.w / 2, B2.y - 8, 't', { align: 'center', size: 11, color: T['--ink-3'] });

        // 映射箭头与微元对应
        const yMid = B1.y + B1.h * 0.42;
        D.G.arrow(ctx, [[B1.x + B1.w + 3, yMid], [B2.x - 3, yMid]], { color: C('--red'), width: 2, head: 8 });
        D.G.label(ctx, (B1.x + B1.w + B2.x) / 2, yMid - 14, 'x = sin t', { align: 'center', size: 10.5, weight: 700, color: C('--red') });
        const stripL = { x: a1.X((k + 0.5) / n), y: a1.Y(fx((k + 0.5) / n)) };
        const stripR = { x: a2.X((k + 0.5) * dt), y: a2.Y(gt((k + 0.5) * dt)) };
        D.G.arrow(ctx, [[stripL.x, stripL.y - 6], [stripR.x, stripR.y - 6]], { color: D.withAlpha(C('--red'), 0.55), width: 1.2, dash: [4, 4], head: 6 });

        let sum1 = 0, sum2 = 0;
        for (let i = 0; i < n; i++) {
          sum1 += fx((i + 0.5) / n) * (1 / n);
          sum2 += gt((i + 0.5) * dt) * dt;
        }
        D.G.label(ctx, B1.x + 6, B1.y + B1.h - 14, `黎曼和 ≈ ${sum1.toFixed(5)}`, { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
        D.G.label(ctx, B2.x + 6, B2.y + B2.h - 14, `黎曼和 ≈ ${sum2.toFixed(5)}`, { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
        D.G.label(ctx, p.w / 2, p.h - 12, 'φ′(t) dt 把 t 的微元“拉伸”成 x 的微元：dx = cos t dt，面积在换元下保持不变', { align: 'center', size: 11, weight: 700, color: C('--purple') });

        UI.readout(out, [
          ['换元', 'x = sin t，t 从 0 到 π/2（x 从 0 到 1）'],
          ['x₀ = sin t₀', x0v.toFixed(5)],
          ['dx/dt = cos t₀', Math.cos(t0).toFixed(5)],
          ['微元', `dt = ${dt.toFixed(4)}，dx ≈ cos t₀·dt = ${(Math.cos(t0) * dt).toFixed(4)}`],
          ['两个积分', '∫₀¹√(1−x²)dx = ∫₀^{π/2}cos²t dt = π/4 ≈ 0.78540']
        ]);
      });
      scene.render();
    }
    render();
    return s;
  };

})(window);
