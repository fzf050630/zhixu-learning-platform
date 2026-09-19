/* ============================================================
   calc1.js — 第1章 函数、极限、连续 可视化组件
   limitExplorer：极限过程与两个重要极限
   infinityCompare：无穷小的阶与等价无穷小
   continuityTypes：间断点的四种类型
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3, f4 } = UI;

  /* ---------- 极限过程 ---------- */
  W.limitExplorer = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -0.4, xMax: 12, yMin: -0.3, yMax: 3.2,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 4
    });
    const { plot, ctrl, out } = s;
    const state = { which: 'sinx', n: 10 };

    UI.seg(ctrl, [
      { label: 'sin x / x → 1', value: 'sinx' },
      { label: '(1+1/x)^x → e', value: 'e' },
      { label: 'x sin(1/x) → 0', value: 'osc' }
    ], v => { state.which = v; render(); }, 0);
    UI.slider(ctrl, {
      label: 'x', min: 1, max: 12, step: 0.25, value: 4,
      fmt: v => v.toFixed(2), onInput: v => { state.n = v; render(); }
    });

    function render() {
      plot.clearLayers();
      plot.o.xMin = 0; plot.o.xMax = 12; plot.o.yMin = -0.6; plot.o.yMax = 3.4;
      const T = D.Theme.cache;
      const x0 = state.n;
      if (state.which === 'sinx') {
        const f = x => x === 0 ? 1 : Math.sin(x) / x;
        plot.curve(f, { color: T['--brand'], width: 2.4, from: 0.001, to: 12 });
        plot.hline(1, { color: T['--accent'], dash: [5, 4] });
        plot.dot(x0, f(x0), { color: T['--red'] });
        plot.vline(x0, { color: D.withAlpha(T['--red'], 0.5) });
        plot.note(11.6, 1.12, 'y = 1', { align: 'right', color: T['--accent'], size: 11 });
        plot.note(x0 + 0.2, f(x0) + 0.18, `f(${x0.toFixed(2)}) = ${f(x0).toFixed(5)}`, { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [
          ['当前 x', x0.toFixed(2)], ['sin x / x', f(x0).toFixed(6)],
          ['与 1 的差', Math.abs(1 - f(x0)).toExponential(3)],
          ['结论', 'x → 0 时 sin x / x → 1']
        ]);
      } else if (state.which === 'e') {
        const f = x => Math.pow(1 + 1 / x, x);
        plot.curve(f, { color: T['--purple'], width: 2.4, from: 0.35, to: 12 });
        plot.hline(Math.E, { color: T['--accent'], dash: [5, 4] });
        plot.dot(x0, f(x0), { color: T['--red'] });
        plot.vline(x0, { color: D.withAlpha(T['--red'], 0.5) });
        plot.note(11.6, Math.E + 0.16, 'y = e ≈ 2.71828', { align: 'right', color: T['--accent'], size: 11 });
        plot.note(x0 + 0.2, f(x0) + 0.2, `f(${x0.toFixed(2)}) = ${f(x0).toFixed(6)}`, { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [
          ['当前 x', x0.toFixed(2)], ['(1+1/x)^x', f(x0).toFixed(6)],
          ['与 e 的差', Math.abs(Math.E - f(x0)).toExponential(3)],
          ['结论', 'x → ∞ 时 (1+1/x)^x → e']
        ]);
      } else {
        const f = x => x === 0 ? 0 : x * Math.sin(1 / x);
        plot.curve(f, { color: T['--teal'], width: 2, from: 0.02, to: 12, samples: 1200 });
        plot.hline(0, { color: T['--accent'], dash: [5, 4] });
        plot.dot(x0, f(x0), { color: T['--red'] });
        plot.vline(x0, { color: D.withAlpha(T['--red'], 0.5) });
        plot.note(x0 + 0.2, f(x0) + 0.14, `x sin(1/x) = ${f(x0).toFixed(6)}`, { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [
          ['当前 x', x0.toFixed(2)], ['x sin(1/x)', f(x0).toFixed(6)],
          ['上界 |f(x)| ≤ |x|', Math.abs(x0).toFixed(3)],
          ['结论', '有界量 × 无穷小 → 无穷小']
        ]);
      }
      plot.render();
    }
    render();
    return s;
  };

  /* ---------- 无穷小的比较 ---------- */
  W.infinityCompare = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -0.05, xMax: 1, yMin: -0.05, yMax: 1.05,
      height: 280, xLabel: 'x', yLabel: '比值的阶', xTicks: 5, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const funcs = [
      { label: 'sin x ~ x', value: 'sinx', f: x => Math.sin(x), color: '--brand' },
      { label: '1−cos x ~ x²/2', value: 'cos', f: x => 1 - Math.cos(x), color: '--purple' },
      { label: 'tan x − x ~ x³/3', value: 'tanx', f: x => Math.tan(x) - x, color: '--teal' },
      { label: 'ln(1+x) − x ~ −x²/2', value: 'ln', f: x => Math.log(1 + x) - x, color: '--accent' },
      { label: 'e^x − 1 ~ x', value: 'exp', f: x => Math.exp(x) - 1, color: '--green' }
    ];
    const state = { pick: 0 };
    UI.seg(ctrl, funcs.map(f => ({ label: f.label.split(' ')[0], value: f.value })), (v, i) => { state.pick = i; render(); }, 0);

    function render() {
      const F = funcs[state.pick];
      const T = D.Theme.cache;
      plot.clearLayers();
      plot.o.yMin = 0; plot.o.yMax = 1.15;
      plot.curve(x => Math.abs(F.f(x)) / Math.abs(x), { color: T[F.color], width: 2.4, from: 0.004, to: 1 });
      plot.dot(0.28, Math.abs(F.f(0.28)) / 0.28, { color: T['--red'] });
      plot.note(0.32, Math.abs(F.f(0.28)) / 0.28 + 0.06, `x=0.28 时比值 ${(Math.abs(F.f(0.28)) / 0.28).toFixed(5)}`, { align: 'left', color: T['--red'], size: 11 });
      const ratio = F.value === 'cos' || F.value === 'ln' ? 0 : 1;
      plot.hline(ratio, { color: T['--accent'], dash: [5, 4] });
      plot.note(0.98, ratio + 0.05, ratio === 1 ? '比值 → 1（等价）' : '比值 → 0（高阶）', { align: 'right', color: T['--accent'], size: 11 });
      plot.render();
      UI.readout(out, [
        ['无穷小', F.label],
        ['与 x 的比值极限', ratio === 1 ? '1（同阶，等价）' : '0（比 x 高阶）'],
        ['常用结论', F.value === 'cos' ? '1 − cos x ~ x²/2（二阶）' : F.value === 'tanx' ? 'tan x − x ~ x³/3（三阶）' : F.value === 'ln' ? 'ln(1+x) − x ~ −x²/2（二阶）' : '比值 → 1，可整体替换']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 间断点类型 ---------- */
  W.continuityTypes = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -3, xMax: 3, yMin: -3, yMax: 3,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { type: 0 };
    const types = [
      { name: '可去间断点', desc: '左右极限存在且相等，但不等于函数值或函数无定义', x0: 1 },
      { name: '跳跃间断点', desc: '左右极限都存在但不相等', x0: 1 },
      { name: '无穷间断点', desc: '至少一侧极限为无穷大', x0: 1 },
      { name: '振荡间断点', desc: '极限不存在且不趋向无穷（如 sin(1/x)）', x0: 0 }
    ];
    UI.seg(ctrl, types.map(t => ({ label: t.name, value: t.name })), (v, i) => { state.type = i; render(); }, 0);

    function render() {
      const t = types[state.type];
      const T = D.Theme.cache;
      plot.clearLayers();
      if (state.type === 0) {
        plot.curve(x => x + 1, { color: T['--brand'], width: 2.4, from: -3, to: 3 });
        plot.custom((p, ctx) => {
          ctx.beginPath(); const X = p.X(1), Y = p.Y(2);
          ctx.arc(X, Y, 5, 0, Math.PI * 2);
          ctx.fillStyle = C('--card'); ctx.fill();
          ctx.strokeStyle = C('--red'); ctx.lineWidth = 2; ctx.stroke();
        });
        plot.dot(1, 3, { color: T['--red'] });
        plot.note(1.15, 3, '函数值被抬高', { align: 'left', color: T['--red'], size: 11 });
      } else if (state.type === 1) {
        plot.curve(x => x < 1 ? x : x + 1.4, { color: T['--brand'], width: 2.6, from: -2.6, to: 1 - 1e-6 });
        plot.curve(x => x >= 1 ? x + 1.4 : x, { color: T['--purple'], width: 2.6, from: 1, to: 2.4 });
        plot.dot(1, 1, { color: T['--brand'] });
        plot.dot(1, 2.4, { color: T['--purple'] });
        plot.vline(1, { color: D.withAlpha(T['--red'], 0.6) });
        plot.note(1.1, 1.1, '左极限 1', { align: 'left', color: T['--brand'], size: 11 });
        plot.note(1.1, 2.5, '右极限 2.4', { align: 'left', color: T['--purple'], size: 11 });
      } else if (state.type === 2) {
        plot.curve(x => 1 / (x - 1), { color: T['--accent'], width: 2.4, from: -2.6, to: 1 - 0.02, clipY: true });
        plot.curve(x => 1 / (x - 1), { color: T['--accent'], width: 2.4, from: 1 + 0.02, to: 3.6, clipY: true });
        plot.vline(1, { color: T['--red'], dash: [5, 4] });
        plot.note(1.06, 2.4, 'x → 1⁺ 时 → +∞', { align: 'left', color: T['--red'], size: 11 });
        plot.note(0.94, -2.4, 'x → 1⁻ 时 → −∞', { align: 'right', color: T['--red'], size: 11 });
      } else {
        plot.curve(x => x === 0 ? 0 : Math.sin(1 / x), { color: T['--teal'], width: 1.8, from: -1, to: 1, samples: 2400 });
        plot.dot(0, 0, { color: T['--red'] });
        plot.note(0.06, 0.9, '在 x = 0 附近无限振荡', { align: 'left', color: T['--red'], size: 11 });
      }
      plot.render();
      UI.readout(out, [['类型', t.name], ['特征', t.desc]]);
    }
    render();
    return s;
  };

  /* ---------- 函数性质画廊 ---------- */
  W.functionGallery = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -3, xMax: 3, yMin: -3.4, yMax: 3.4,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'odd', x0: 1.3 };

    UI.seg(ctrl, [
      { label: '奇函数', value: 'odd' }, { label: '偶函数', value: 'even' },
      { label: '周期函数', value: 'per' }, { label: '单调函数', value: 'mono' },
      { label: '有界函数', value: 'bnd' }
    ], v => { state.mode = v; render(true); }, 0);
    UI.slider(ctrl, {
      label: '考察点 x₀', min: 0.2, max: 2.6, step: 0.05, value: 1.3,
      fmt: v => v.toFixed(2), onInput: v => { state.x0 = v; render(false); }
    });

    function render(animate) {
      const T = D.Theme.cache;
      const x0 = state.x0;
      plot.clearLayers();
      /* 折线用 custom 绘制：避免动画时 polyline 数据被截断 */
      const poly = (pts, color, width, dash) => plot.custom((p, ctx) => {
        if (!pts || pts.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = width; ctx.strokeStyle = color;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        if (dash) ctx.setLineDash(dash);
        pts.forEach(([x, y], i) => i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y)));
        ctx.stroke(); ctx.restore();
      });
      if (state.mode === 'odd') {
        const f = x => x * x * x / 12;
        plot.curve(f, { color: T['--brand'], width: 2.4 });
        plot.dot(x0, f(x0), { color: T['--red'] });
        plot.dot(-x0, f(-x0), { color: T['--purple'] });
        poly([[x0, f(x0)], [0, 0], [-x0, f(-x0)]], D.withAlpha(C('--red'), 0.5), 1.4, [4, 4]);
        plot.note(x0 + 0.12, f(x0) + 0.3, `f(x₀) = ${f(x0).toFixed(3)}`, { align: 'left', color: T['--red'], size: 11 });
        plot.note(-x0 - 0.12, f(-x0) - 0.3, `f(−x₀) = ${f(-x0).toFixed(3)}`, { align: 'right', color: T['--purple'], size: 11 });
        plot.note(-2.9, 3.0, '奇函数：f(−x) = −f(x)，图像关于原点对称', { align: 'left', color: T['--red'], size: 11 });
        plot.note(2.9, -3.05, '以 f(x) = x³ / 12 为例', { align: 'right', color: T['--ink-3'], size: 11 });
        UI.readout(out, [
          ['性质', '奇函数（定义域必须关于原点对称）'],
          ['f(x₀)', f(x0).toFixed(4)], ['f(−x₀)', f(-x0).toFixed(4)],
          ['验证', `f(x₀) + f(−x₀) = ${(f(x0) + f(-x0)).toFixed(6)}`]
        ]);
      } else if (state.mode === 'even') {
        const f = x => x * x / 3;
        plot.curve(f, { color: T['--brand'], width: 2.4 });
        plot.dot(x0, f(x0), { color: T['--red'] });
        plot.dot(-x0, f(-x0), { color: T['--purple'] });
        poly([[-x0, f(x0)], [x0, f(x0)]], D.withAlpha(C('--red'), 0.5), 1.4, [4, 4]);
        plot.vline(x0, { color: D.withAlpha(T['--red'], 0.35) });
        plot.vline(-x0, { color: D.withAlpha(T['--purple'], 0.35) });
        plot.note(x0 + 0.12, f(x0) + 0.28, `f(x₀) = ${f(x0).toFixed(3)}`, { align: 'left', color: T['--red'], size: 11 });
        plot.note(-x0 - 0.12, f(-x0) + 0.28, `f(−x₀) = ${f(-x0).toFixed(3)}`, { align: 'right', color: T['--purple'], size: 11 });
        plot.note(-2.9, 3.0, '偶函数：f(−x) = f(x)，图像关于 y 轴对称', { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [
          ['性质', '偶函数（定义域关于原点对称）'],
          ['f(x₀)', f(x0).toFixed(4)], ['f(−x₀)', f(-x0).toFixed(4)],
          ['验证', `f(−x₀) − f(x₀) = ${(f(-x0) - f(x0)).toFixed(6)}`]
        ]);
      } else if (state.mode === 'per') {
        const f = x => 1.6 * Math.sin(2 * x);
        const Tp = Math.PI;
        let p1 = x0, p2 = x0 + Tp;
        if (p2 > 3.05) { p1 = x0 - Tp; p2 = x0; }
        plot.curve(f, { color: T['--brand'], width: 2.4 });
        plot.dot(p1, f(p1), { color: T['--red'] });
        plot.dot(p2, f(p2), { color: T['--purple'] });
        poly([[p1, f(p1)], [p2, f(p2)]], D.withAlpha(C('--red'), 0.5), 1.4, [4, 4]);
        plot.arrow(p1, 2.75, p2, 2.75, { color: T['--accent'], width: 1.6, head: 6 });
        plot.note((p1 + p2) / 2, 2.45, 'T = π', { align: 'center', color: T['--accent'], size: 11 });
        plot.vline(p1, { color: D.withAlpha(T['--red'], 0.35) });
        plot.vline(p2, { color: D.withAlpha(T['--purple'], 0.35) });
        plot.note(-2.9, 3.0, '周期函数：f(x + T) = f(x)，最小正周期 T = π', { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [
          ['性质', `周期函数，T = π（ω = 2 时 T = 2π/ω）`],
          ['f(x₀) 与 f(x₀+T)', `${f(p1).toFixed(4)} / ${f(p2).toFixed(4)}`],
          ['验证', `f(x₀+T) − f(x₀) = ${(f(p2) - f(p1)).toFixed(6)}`],
          ['图像', '相邻一个周期内图像完全重复']
        ]);
      } else if (state.mode === 'mono') {
        const f = x => x * x * x / 14 + 0.35 * x;
        plot.curve(f, { color: T['--brand'], width: 2.4 });
        plot.dot(x0, f(x0), { color: T['--red'] });
        plot.dot(x0 + 0.8, f(x0 + 0.8), { color: T['--purple'] });
        plot.arrow(x0, f(x0), x0 + 0.8, f(x0 + 0.8), { color: D.withAlpha(C('--red'), 0.7), width: 1.8 });
        plot.vline(x0, { color: D.withAlpha(T['--red'], 0.35) });
        plot.vline(x0 + 0.8, { color: D.withAlpha(T['--purple'], 0.35) });
        plot.note(x0 + 0.1, f(x0) - 0.35, `f(x₀) = ${f(x0).toFixed(3)}`, { align: 'left', color: T['--red'], size: 11 });
        plot.note(x0 + 0.9, f(x0 + 0.8) + 0.3, `f(x₀+0.8) = ${f(x0 + 0.8).toFixed(3)}`, { align: 'left', color: T['--purple'], size: 11 });
        plot.note(-2.9, 3.0, '单调增：x₁ < x₂ ⇒ f(x₁) < f(x₂)', { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [
          ['性质', '单调增加（f′(x) = 3x²/14 + 0.35 > 0）'],
          ['f(x₀)', f(x0).toFixed(4)], ['f(x₀ + 0.8)', f(x0 + 0.8).toFixed(4)],
          ['验证', `f(x₀+0.8) − f(x₀) = ${(f(x0 + 0.8) - f(x0)).toFixed(6)} > 0`]
        ]);
      } else {
        const M = 1.4, f = x => M * Math.sin(1.6 * x);
        plot.curve(f, { color: T['--brand'], width: 2.4 });
        plot.hline(M, { color: T['--accent'], dash: [5, 4] });
        plot.hline(-M, { color: T['--accent'], dash: [5, 4] });
        plot.dot(x0, f(x0), { color: T['--red'] });
        plot.vline(x0, { color: D.withAlpha(T['--red'], 0.35) });
        plot.note(2.9, M + 0.18, '上界 y = M = 1.4', { align: 'right', color: T['--accent'], size: 11 });
        plot.note(2.9, -M - 0.18, '下界 y = −M', { align: 'right', color: T['--accent'], size: 11 });
        plot.note(-2.9, 3.0, '有界：存在 M > 0，使 |f(x)| ≤ M 对一切 x 成立', { align: 'left', color: T['--red'], size: 11 });
        UI.readout(out, [
          ['性质', '有界函数（既有上界又有下界）'],
          ['f(x₀)', f(x0).toFixed(4)],
          ['界 M', M.toFixed(2)],
          ['验证', `|f(x₀)| = ${Math.abs(f(x0)).toFixed(4)} ≤ ${M.toFixed(2)}`]
        ]);
      }
      if (animate) plot.animate(430); else plot.render();
    }
    render(true);
    return s;
  };

  /* ---------- 五类基本初等函数 ---------- */
  W.elemFunctions = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -3, xMax: 3, yMin: -3, yMax: 3,
      height: 310, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'pow', mu: 0.5, a: 2, w: 2, k: 1 };

    const sMu = UI.slider(ctrl, {
      label: '幂指数 μ', min: -2, max: 4, step: 0.25, value: 0.5,
      fmt: v => v.toFixed(2), onInput: v => { state.mu = v; render(false); }
    });
    const sA = UI.slider(ctrl, {
      label: '底数 a', min: 0.3, max: 3, step: 0.1, value: 2,
      fmt: v => v.toFixed(1), onInput: v => { state.a = v; render(false); }
    });
    const sW = UI.slider(ctrl, {
      label: '角频率 ω', min: 0.5, max: 3, step: 0.1, value: 2,
      fmt: v => v.toFixed(1), onInput: v => { state.w = v; render(false); }
    });
    const sK = UI.slider(ctrl, {
      label: '拉伸系数 k', min: 0.4, max: 2, step: 0.1, value: 1,
      fmt: v => v.toFixed(1), onInput: v => { state.k = v; render(false); }
    });
    const owner = { pow: sMu, exp: sA, log: sA, tri: sW, inv: sK };

    UI.seg(ctrl, [
      { label: '幂函数', value: 'pow' }, { label: '指数函数', value: 'exp' },
      { label: '对数函数', value: 'log' }, { label: '三角函数', value: 'tri' },
      { label: '反三角函数', value: 'inv' }
    ], v => { state.mode = v; sync(); render(true); }, 0);

    function sync() {
      [sMu, sA, sW, sK].forEach(sl => { sl.input.parentElement.style.display = 'none'; });
      owner[state.mode].input.parentElement.style.display = '';
    }

    function render(animate) {
      const T = D.Theme.cache;
      plot.clearLayers();
      if (state.mode === 'pow') {
        const mu = state.mu;
        plot.setDomain(-3, 3, -3.4, 3.4);
        plot.curve(x => x <= 0 ? NaN : Math.pow(x, mu), { color: T['--brand'], width: 2.6, from: 0.02, to: 3.4, clipY: true });
        plot.curve(x => Math.pow(x, mu), { color: T['--brand'], width: 2.6, from: -3.4, to: -0.02, clipY: true });
        plot.dot(1, 1, { color: T['--red'] });
        plot.note(1.12, 1.14, '公共点 (1, 1)', { align: 'left', color: T['--red'], size: 11 });
        plot.note(-2.9, 3.05, `幂函数 y = x^μ，当前 μ = ${mu.toFixed(2)}`, { align: 'left', color: T['--brand'], size: 11.5 });
        const isInt = Math.abs(mu - Math.round(mu)) < 1e-9;
        const oddInt = isInt && Math.abs(Math.round(mu)) % 2 === 1;
        plot.note(2.9, -3.05, isInt ? (oddInt ? 'μ 为奇数：奇函数，负半轴有图像' : 'μ 为偶数：偶函数，负半轴有图像') : 'μ 非整数：定义域限于 x > 0', { align: 'right', color: T['--ink-3'], size: 11 });
        UI.readout(out, [
          ['函数', `y = x^${mu.toFixed(2)}`],
          ['定义域', isInt ? (Math.round(mu) >= 0 ? 'ℝ' : 'x ≠ 0') : 'x > 0（本图只画正半轴）'],
          ['单调性', mu > 0 ? '在 (0, +∞) 上单调增' : mu < 0 ? '在 (0, +∞) 上单调减' : '常函数 y ≡ 1'],
          ['要点', '图像恒过 (1, 1)，定义域与奇偶性随 μ 变化']
        ]);
      } else if (state.mode === 'exp') {
        const a = state.a;
        plot.setDomain(-3, 3, -1.2, 3.6);
        plot.curve(x => Math.pow(a, x), { color: T['--purple'], width: 2.6, clipY: true });
        plot.hline(1, { color: T['--accent'], dash: [5, 4] });
        plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
        plot.dot(0, 1, { color: T['--red'] });
        plot.note(0.14, 1.18, '定点 (0, 1)', { align: 'left', color: T['--red'], size: 11 });
        plot.note(-2.9, 3.0, `指数函数 y = aˣ，当前 a = ${a.toFixed(1)}`, { align: 'left', color: T['--purple'], size: 11.5 });
        plot.note(2.9, 1.18, a > 1 ? 'a > 1：单调增' : '0 < a < 1：单调减', { align: 'right', color: a > 1 ? T['--green'] : T['--accent'], size: 11 });
        UI.readout(out, [
          ['函数', `y = ${a.toFixed(1)}ˣ`],
          ['定义域 / 值域', 'ℝ / (0, +∞)'],
          ['单调性', a > 1 ? '单调增加（a > 1）' : '单调减少（0 < a < 1）'],
          ['渐近线', a > 1 ? 'x → −∞ 时 y → 0，有水平渐近线 y = 0' : 'x → +∞ 时 y → 0，有水平渐近线 y = 0']
        ]);
      } else if (state.mode === 'log') {
        let a = state.a, warn = '';
        if (Math.abs(a - 1) < 0.05) { a = 1.05; warn = '（a = 1 不是对数函数的底，图中按 1.05 近似显示）'; }
        const f = x => Math.log(x) / Math.log(a);
        plot.setDomain(-1, 8, -3.4, 3.4);
        plot.curve(f, { color: T['--teal'], width: 2.6, from: 0.02, to: 8, clipY: true });
        plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
        plot.dot(1, 0, { color: T['--red'] });
        plot.note(1.12, 0.28, '定点 (1, 0)', { align: 'left', color: T['--red'], size: 11 });
        plot.note(0.06, 3.0, `对数函数 y = log_a x，当前 a = ${a.toFixed(1)}`, { align: 'left', color: T['--teal'], size: 11.5 });
        plot.note(7.9, a > 1 ? -3.05 : 3.0, a > 1 ? 'a > 1：单调增' : '0 < a < 1：单调减', { align: 'right', color: a > 1 ? T['--green'] : T['--accent'], size: 11 });
        UI.readout(out, [
          ['函数', `y = log_${a.toFixed(1)} x${warn}`],
          ['定义域 / 值域', '(0, +∞) / ℝ'],
          ['单调性', a > 1 ? '单调增加' : '单调减少'],
          ['与指数函数', `互为反函数，图像关于 y = x 对称（a 相同时）`]
        ]);
      } else if (state.mode === 'tri') {
        const w = state.w;
        plot.setDomain(-6.6, 6.6, -2.3, 2.3);
        plot.curve(x => 1.5 * Math.sin(w * x), { color: T['--brand'], width: 2.6 });
        plot.curve(x => 1.5 * Math.cos(w * x), { color: T['--purple'], width: 2, dash: [5, 4] });
        plot.hline(1.5, { color: D.withAlpha(T['--accent'], 0.7), dash: [4, 4] });
        plot.hline(-1.5, { color: D.withAlpha(T['--accent'], 0.7), dash: [4, 4] });
        plot.dot(0, 1.5, { color: T['--red'] });
        plot.note(0.14, 1.68, '最大值 1.5', { align: 'left', color: T['--red'], size: 11 });
        plot.note(-6.5, 2.05, `三角函数的周期性与有界性：y = 1.5 sin(ωx)，ω = ${w.toFixed(1)}`, { align: 'left', color: T['--brand'], size: 11 });
        plot.note(6.5, -2.05, `T = 2π/ω ≈ ${(2 * Math.PI / w).toFixed(3)}`, { align: 'right', color: T['--accent'], size: 11 });
        UI.readout(out, [
          ['函数', `y = 1.5 sin(${w.toFixed(1)}x)，虚线为 y = 1.5 cos(${w.toFixed(1)}x)`],
          ['定义域 / 值域', 'ℝ / [−1.5, 1.5]（有界）'],
          ['周期', `T = 2π/ω ≈ ${(2 * Math.PI / w).toFixed(4)}`],
          ['两曲线关系', '相位相差 π/2：sin(ωx + π/2) = cos(ωx)']
        ]);
      } else {
        const k = state.k;
        plot.setDomain(-4, 4, -2.3, 3.7);
        const lim = 1 / k;
        plot.curve(x => Math.asin(Math.max(-1, Math.min(1, k * x))), { color: T['--brand'], width: 2.4, from: -lim, to: lim });
        plot.curve(x => Math.acos(Math.max(-1, Math.min(1, k * x))), { color: T['--purple'], width: 2.4, from: -lim, to: lim });
        plot.curve(x => Math.atan(k * x), { color: T['--teal'], width: 2.4 });
        plot.vline(-lim, { color: D.withAlpha(T['--brand'], 0.45) });
        plot.vline(lim, { color: D.withAlpha(T['--brand'], 0.45) });
        plot.note(-3.9, 1.72, 'y = arcsin(kx)（主值 [−π/2, π/2]）', { align: 'left', color: T['--brand'], size: 11 });
        plot.note(3.9, 3.42, 'y = arccos(kx)（主值 [0, π]）', { align: 'right', color: T['--purple'], size: 11 });
        plot.note(3.9, -1.62, 'y = arctan(kx)（主值 (−π/2, π/2)）', { align: 'right', color: T['--teal'], size: 11 });
        UI.readout(out, [
          ['函数', `y = arcsin(${k.toFixed(1)}x)、arccos(${k.toFixed(1)}x)、arctan(${k.toFixed(1)}x)`],
          ['定义域', `arcsin / arccos：|x| ≤ ${(1 / k).toFixed(3)}；arctan：ℝ`],
          ['主值区间', '[−π/2, π/2]、[0, π]、(−π/2, π/2)'],
          ['常用恒等式', 'arcsin x + arccos x = π/2（|x| ≤ 1）']
        ]);
      }
      if (animate) plot.animate(430); else plot.render();
    }
    sync();
    render(true);
    return s;
  };

})(window);
