/* ============================================================
   calc8.js — 第8章 常微分方程 可视化组件
   slopeField：一阶微分方程的斜率场与解曲线
   secondOrderODE：二阶常系数齐次方程的特征根类型
   eulerMethod：欧拉法数值解与步长影响
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3 } = UI;

  /* ---------- 斜率场 ---------- */
  W.slopeField = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -3, xMax: 3, yMin: -3, yMax: 3,
      height: 320, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { eq: 'sep', y0: 1, x0: 0 };
    const eqs = {
      sep: { label: "y′ = −x/y（可分离）", f: (x, y) => -x / (y || 1e-6), sol: (x, x0, y0) => { const c2 = x0 * x0 + y0 * y0; return x => Math.sqrt(Math.max(0, c2 - x * x)); }, desc: '通解 x² + y² = C（圆族）' },
      lin: { label: "y′ = y − x（一阶线性）", f: (x, y) => y - x, sol: (x0, y0) => x => (y0 - x0 + 1) * Math.exp(x - x0) + x - 1, desc: '通解 y = Ceˣ + x + 1' },
      logi: { label: "y′ = y(1 − y)（逻辑斯蒂）", f: (x, y) => y * (1 - y), sol: (x0, y0) => x => { const A = (1 - y0) / y0 * Math.exp(-(x - x0)); return 1 / (1 + A); }, desc: '通解 y = 1/(1 + Ce^(−x))' },
      homo: { label: "y′ = y / x（齐次）", f: (x, y) => x === 0 ? 0 : y / x, sol: (x0, y0) => x => (x0 === 0 ? y0 : y0 / x0) * x, desc: '通解 y = Cx（过原点直线族）' }
    };
    UI.seg(ctrl, Object.keys(eqs).map(k => ({ label: k === 'sep' ? '可分离' : k === 'lin' ? '一阶线性' : k === 'logi' ? '逻辑斯蒂' : '齐次', value: k })), (v) => { state.eq = v; render(); }, 0);
    UI.slider(ctrl, { label: '初值 y(0)', min: -2, max: 2, step: 0.1, value: 1, fmt: v => v.toFixed(1), onInput: v => { state.y0 = v; render(); } });
    UI.slider(ctrl, { label: '初值 x₀', min: -2, max: 2, step: 0.1, value: 0, fmt: v => v.toFixed(1), onInput: v => { state.x0 = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      const E = eqs[state.eq];
      plot.clearLayers();
      // 斜率场
      plot.custom((p, ctx) => {
        for (let x = -2.8; x <= 2.8; x += 0.36) for (let y = -2.8; y <= 2.8; y += 0.36) {
          const k = E.f(x, y);
          if (!isFinite(k)) continue;
          const ang = Math.atan(k);
          const len = 8;
          const X = p.X(x), Y = p.Y(y);
          // 按画布纵横比修正方向
          const sx = Math.cos(ang), sy = Math.sin(ang) * (p.pw / p.ph) * ((p.o.yMax - p.o.yMin) / (p.o.xMax - p.o.xMin));
          const nrm = Math.hypot(sx, sy) || 1;
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.9); ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(X - sx / nrm * len, Y + sy / nrm * len);
          ctx.lineTo(X + sx / nrm * len, Y - sy / nrm * len);
          ctx.stroke(); ctx.restore();
        }
      });
      // 解曲线
      const sol = E.sol(state.x0, state.y0);
      const pts = [];
      for (let x = -3; x <= 3; x += 0.03) { const y = sol(x); if (isFinite(y)) pts.push([x, y]); }
      plot.polyline(pts, { color: T['--red'], width: 2.6 });
      plot.dot(state.x0, state.y0, { color: T['--brand'] });
      plot.custom((p, ctx) => {
        ctx.save(); ctx.fillStyle = C('--ink-3'); ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left';
        ctx.fillText('灰色短线段为斜率场，红色为过初值的解曲线', p.px + 8, p.py + 14);
        ctx.restore();
      });
      plot.render();
      UI.readout(out, [
        ['方程', E.label],
        ['通解', E.desc],
        ['初值', `y(${state.x0.toFixed(1)}) = ${state.y0.toFixed(1)}`],
        ['斜率', E.f(state.x0, state.y0).toFixed(4)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 二阶常系数齐次方程 ---------- */
  W.secondOrderODE = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -0.4, xMax: 8, yMin: -3.2, yMax: 3.2,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 8, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { p: -3, q: 2 };
    UI.slider(ctrl, { label: 'p（y″ + p y′ + q y = 0）', min: -5, max: 5, step: 0.5, value: -3, fmt: v => v.toFixed(1), onInput: v => { state.p = v; render(); } });
    UI.slider(ctrl, { label: 'q', min: -5, max: 5, step: 0.5, value: 2, fmt: v => v.toFixed(1), onInput: v => { state.q = v; render(); } });

    function solution(x) {
      const p = state.p, q = state.q;
      const Dd = p * p - 4 * q;
      const c1 = 1, c2 = 0.5;
      if (Dd > 1e-9) {
        const r1 = (-p + Math.sqrt(Dd)) / 2, r2 = (-p - Math.sqrt(Dd)) / 2;
        return c1 * Math.exp(r1 * x) + c2 * Math.exp(r2 * x);
      }
      if (Dd > -1e-9) {
        const r = -p / 2;
        return (c1 + c2 * x) * Math.exp(r * x);
      }
      const alpha = -p / 2, beta = Math.sqrt(-Dd) / 2;
      return Math.exp(alpha * x) * (c1 * Math.cos(beta * x) + c2 * Math.sin(beta * x));
    }

    function render() {
      const T = D.Theme.cache;
      const p = state.p, q = state.q;
      const Dd = p * p - 4 * q;
      let type, roots;
      if (Dd > 1e-9) {
        const r1 = (-p + Math.sqrt(Dd)) / 2, r2 = (-p - Math.sqrt(Dd)) / 2;
        type = '两个不等实根'; roots = `r₁ = ${r1.toFixed(3)}, r₂ = ${r2.toFixed(3)}`;
      } else if (Dd > -1e-9) {
        type = '二重实根'; roots = `r₁ = r₂ = ${(-p / 2).toFixed(3)}`;
      } else {
        type = '共轭复根'; roots = `α ± βi = ${(-p / 2).toFixed(3)} ± ${(Math.sqrt(-Dd) / 2).toFixed(3)}i`;
      }
      plot.clearLayers();
      plot.curve(solution, { color: T['--brand'], width: 2.4, from: -0.4, to: 8, clipY: true });
      plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
      plot.vline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
      plot.render();
      const form = Dd > 1e-9 ? 'y = C₁e^(r₁x) + C₂e^(r₂x)'
        : Dd > -1e-9 ? 'y = (C₁ + C₂x)e^(rx)'
          : 'y = e^(αx)(C₁cos βx + C₂sin βx)';
      UI.readout(out, [
        ['特征方程', `r² ${p >= 0 ? '+' : '−'} ${Math.abs(p).toFixed(1)}r ${q >= 0 ? '+' : '−'} ${Math.abs(q).toFixed(1)} = 0`],
        ['判别式 Δ = p² − 4q', Dd.toFixed(3)],
        ['根的类型', type],
        ['通解形式', form]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 欧拉法 ---------- */
  W.eulerMethod = function (host) {
    const s = UI.shellPlot(host, {
      xMin: 0, xMax: 2.4, yMin: 0, yMax: 3.4,
      height: 280, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { h: 0.4 };
    const f = (x, y) => y - x;
    const exact = x => 1 + x;   // y(0)=1 时 y = 2e^x - x - 1? 用 y'=y-x, y(0)=1 => y = 2e^x - x - 1
    const exact2 = x => 2 * Math.exp(x) - x - 1;
    UI.slider(ctrl, { label: '步长 h', min: 0.05, max: 0.6, step: 0.05, value: 0.4, fmt: v => v.toFixed(2), onInput: v => { state.h = v; render(); } });

    function euler() {
      const pts = [[0, 1]];
      let x = 0, y = 1;
      const h = state.h;
      while (x < 2.4 - 1e-9) {
        y = y + h * f(x, y);
        x += h;
        pts.push([x, y]);
      }
      return pts;
    }

    function render() {
      const T = D.Theme.cache;
      const pts = euler();
      plot.clearLayers();
      plot.curve(exact2, { color: T['--accent'], width: 2.4, from: 0, to: 2.4, clipY: true });
      plot.polyline(pts, { color: T['--brand'], width: 2.2 });
      plot.custom((p, ctx) => {
        ctx.save();
        pts.forEach(([x, y]) => { if (y > -50) { ctx.fillStyle = C('--brand'); ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), 3, 0, Math.PI * 2); ctx.fill(); } });
        ctx.restore();
      });
      plot.note(2.35, exact2(2.4) + 0.2, '橙色：精确解 y = 2eˣ − x − 1', { align: 'right', color: T['--accent'], size: 10.5 });
      plot.render();
      const last = pts[pts.length - 1];
      const err = Math.abs(last[1] - exact2(last[0]));
      UI.readout(out, [
        ['方程', "y′ = y − x，y(0) = 1"],
        ['步长 h', state.h.toFixed(2)],
        ['步数', String(pts.length - 1)],
        ['终点误差', err.toExponential(3)],
        ['结论', 'h 越小精度越高，但计算量增大；改进可用梯形法/龙格-库塔']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 可降阶的高阶方程 ---------- */
  W.reducibleODE = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -1.3, xMax: 1.3, yMin: -3.4, yMax: 3.4,
      height: 310, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'int', C1: 0, C2: 0, step: 2 };

    UI.seg(ctrl, [
      { label: 'y″ = cos x（逐次积分）', value: 'int' },
      { label: 'y y″ + (y′)² = 0（缺 x）', value: 'reduce' }
    ], v => { state.mode = v; sync(); render(true); }, 0);
    const c1S = UI.slider(ctrl, { label: 'C₁', min: -1.5, max: 1.5, step: 0.1, value: 0, fmt: v => v.toFixed(1), onInput: v => { state.C1 = v; render(false); } });
    const c2S = UI.slider(ctrl, { label: 'C₂', min: -1.5, max: 1.5, step: 0.1, value: 0, fmt: v => v.toFixed(1), onInput: v => { state.C2 = v; render(false); } });
    const tr = UI.transport(ctrl, { total: 3, speed: 800, onChange: k => { state.step = k; render(false); } });
    const trEl = ctrl.lastElementChild;
    tr.go(2);

    function sync() {
      trEl.style.display = state.mode === 'int' ? '' : 'none';
    }

    function render(animate) {
      const T = D.Theme.cache;
      const C1 = state.C1, C2 = state.C2;
      plot.clearLayers();
      if (state.mode === 'int') {
        const step = state.step;
        // 第一步：y″ = cos x
        plot.curve(x => Math.cos(x), { color: T['--teal'], width: 2.4, dash: [6, 4] });
        plot.note(1.28, 1.1, 'y″ = cos x', { align: 'right', color: T['--teal'], size: 11 });
        if (step >= 1) {
          [-1.2, -0.6, 0.6, 1.2].forEach(cc => {
            if (Math.abs(cc - C1) < 0.06) return;
            plot.curve(x => Math.sin(x) + cc, { color: D.withAlpha(T['--purple'], 0.32), width: 1.4 });
          });
          plot.curve(x => Math.sin(x) + C1, { color: T['--purple'], width: 2.4 });
          plot.note(1.28, 2.2, `y′ = sin x + C₁，C₁ = ${C1.toFixed(2)}`, { align: 'right', color: T['--purple'], size: 11 });
        }
        if (step >= 2) {
          [-1.2, -0.6, 0.6, 1.2].forEach(cc => {
            if (Math.abs(cc - C2) < 0.06) return;
            plot.curve(x => -Math.cos(x) + C1 * x + cc, { color: D.withAlpha(T['--brand'], 0.3), width: 1.4 });
          });
          plot.curve(x => -Math.cos(x) + C1 * x + C2, { color: T['--brand'], width: 2.6 });
          plot.dot(0, 1, { color: T['--red'] });
          plot.curve(x => 1 - Math.cos(x), { color: T['--red'], width: 1.8, dash: [6, 4] });
          plot.note(0.1, 1.18, '特解 y = 1 − cos x（y(0)=0, y′(0)=0）', { align: 'left', color: T['--red'], size: 10.5 });
        }
        plot.note(-1.28, -3.05, `y = −cos x + C₁x + C₂，C₁ = ${C1.toFixed(2)}，C₂ = ${C2.toFixed(2)}`, { align: 'left', color: T['--brand'], size: 11 });
        plot.note(-1.28, 3.05, step === 0 ? '第一步：先积 y″ 得 y′ 的曲线族' : step === 1 ? '第二步：再积 y′ 得 y 的曲线族' : '两次积分 ⇒ 两个独立常数 C₁、C₂', { align: 'left', color: T['--ink-2'], size: 11 });
        if (animate) plot.animate(430); else plot.render();
        UI.readout(out, [
          ['方程', "y″ = cos x（右端只含 x，逐次积分）"],
          ['第 1 次积分', `y′ = sin x + C₁ = sin x + ${C1.toFixed(2)}`],
          ['第 2 次积分', `y = −cos x + C₁x + C₂`],
          ['初值特解', 'y(0) = 0, y′(0) = 0 ⇒ C₁ = 0, C₂ = 1，y = 1 − cos x'],
          ['要点', '每积分一次加一个任意常数，n 阶方程通解含 n 个独立常数']
        ]);
      } else {
        const c1 = C1 === 0 ? 0.001 : C1;
        plot.note(-1.28, 3.05, '缺 x：令 p = y′(x)，并视 p 为 y 的函数，y″ = p·dp/dy', { align: 'left', color: T['--ink-2'], size: 10.5 });
        plot.note(-1.28, 2.75, 'y y″ + (y′)² = (y y′)′ = 0 ⇒ y y′ = C₁ ⇒ y² = 2C₁x + 2C₂', { align: 'left', color: T['--purple'], size: 10.5 });
        // 曲线族：y² = 2C₁x + 2C₂
        [-1.5, -0.75, 0.75, 1.5].forEach((k1, idx) => {
          const k2 = (idx % 2 ? -0.75 : 0.75);
          drawBranches(plot, k1, k2, D.withAlpha(T['--brand'], 0.28), 1.3);
        });
        drawBranches(plot, c1, C2, T['--brand'], 2.4);
        // 特解 y = √(1+x)（custom 绘制避免动画截断）
        plot.custom((p, ctx) => {
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = T['--red']; ctx.lineWidth = 2.2;
          ctx.lineJoin = 'round'; ctx.setLineDash([7, 4]);
          for (let x = -1; x <= 1.3; x += 0.03) {
            const y = Math.sqrt(1 + x);
            x === -1 ? ctx.moveTo(p.X(x), p.Y(y)) : ctx.lineTo(p.X(x), p.Y(y));
          }
          ctx.stroke(); ctx.restore();
        });
        plot.dot(0, 1, { color: T['--red'] });
        plot.note(0.1, 1.15, '特解 y = √(1+x)（y(0) = 1, y′(0) = 1/2）', { align: 'left', color: T['--red'], size: 10.5 });
        plot.note(-1.28, -3.05, `通解 y² = 2C₁x + 2C₂，当前 C₁ = ${C1.toFixed(2)}，C₂ = ${C2.toFixed(2)}`, { align: 'left', color: T['--brand'], size: 11 });
        if (animate) plot.animate(430); else plot.render();
        UI.readout(out, [
          ['方程', 'y y″ + (y′)² = 0（不显含 x）'],
          ['降阶', 'p = y′(x) 视为 y 的函数：y″ = dp/dx = p·dp/dy'],
          ['积分结果', 'p(y dp/dy + p) = 0 ⇒ y y′ = C₁ ⇒ y² = 2C₁x + 2C₂'],
          ['初值特解', 'y(0) = 1, y′(0) = 1/2 ⇒ C₁ = C₂ = 1/2，y = √(1+x)'],
          ['技巧', 'yy″ + (y′)² 恰是 (y y′)′，直接积分更快']
        ]);
      }
    }

    function drawBranches(plot2, k1, k2, color, width) {
      const rad = x => 2 * k1 * x + 2 * k2;
      const ptsUp = [], ptsDn = [];
      for (let x = -1.3; x <= 1.301; x += 0.02) {
        const r = rad(x);
        if (r < 0) continue;
        const y = Math.sqrt(r);
        ptsUp.push([x, y]); ptsDn.push([x, -y]);
      }
      if (ptsUp.length <= 1) return;
      plot2.custom((p, ctx) => {
        const seg = (pts, dash) => {
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = dash ? width * 0.75 : width;
          if (dash) ctx.setLineDash([4, 4]);
          ctx.lineJoin = 'round';
          pts.forEach(([x, y], i) => i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y)));
          ctx.stroke(); ctx.restore();
        };
        seg(ptsUp, false);
        seg(ptsDn, true);
      });
    }

    sync();
    render(true);
    return s;
  };

  /* ---------- 线性微分方程解的结构 ---------- */
  W.odeStructure = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -1.4, xMax: 1.4, yMin: -6, yMax: 6,
      height: 310, xLabel: 'x', yLabel: 'y', xTicks: 7, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'homo', C1: 1, C2: 0.5, x0: 0.6, step: 2 };

    UI.seg(ctrl, [
      { label: '齐次：叠加原理', value: 'homo' },
      { label: '非齐次：Y + y*', value: 'nonhomo' }
    ], v => { state.mode = v; sync(); render(true); }, 0);
    UI.slider(ctrl, { label: 'C₁', min: -1.5, max: 1.5, step: 0.1, value: 1, fmt: v => v.toFixed(1), onInput: v => { state.C1 = v; render(false); } });
    UI.slider(ctrl, { label: 'C₂', min: -1.5, max: 1.5, step: 0.1, value: 0.5, fmt: v => v.toFixed(1), onInput: v => { state.C2 = v; render(false); } });
    UI.slider(ctrl, { label: '探针 x₀', min: -1.2, max: 1.2, step: 0.1, value: 0.6, fmt: v => v.toFixed(1), onInput: v => { state.x0 = v; render(false); } });
    const tr = UI.transport(ctrl, { total: 3, speed: 850, onChange: k => { state.step = k; render(false); } });
    const trEl = ctrl.lastElementChild;

    function sync() { trEl.style.display = state.mode === 'nonhomo' ? '' : 'none'; }

    const Y = x => state.C1 * Math.exp(x) + state.C2 * Math.exp(-x);
    const yS = x => -2 * x;
    tr.go(2);

    function render(animate) {
      const T = D.Theme.cache;
      const x0 = state.x0;
      plot.clearLayers();
      plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.85) });
      plot.curve(x => Math.exp(x), { color: D.withAlpha(T['--brand'], 0.3), width: 1.4, clipY: true });
      plot.curve(x => Math.exp(-x), { color: D.withAlpha(T['--purple'], 0.3), width: 1.4, clipY: true });
      plot.note(-1.38, 5.4, 'y₁ = eˣ', { align: 'left', color: D.withAlpha(T['--brand'], 0.8), size: 10.5 });
      plot.note(1.38, 5.4, 'y₂ = e⁻ˣ', { align: 'right', color: D.withAlpha(T['--purple'], 0.8), size: 10.5 });
      if (state.mode === 'homo') {
        plot.curve(Y, { color: T['--red'], width: 2.6, clipY: true });
        plot.dot(x0, Y(x0), { color: T['--red'] });
        plot.vline(x0, { color: D.withAlpha(T['--ink-3'], 0.45) });
        plot.note(-1.38, 4.6, `齐次方程 y″ − y = 0 的通解：Y = C₁eˣ + C₂e⁻ˣ`, { align: 'left', color: T['--ink-2'], size: 11 });
        plot.note(-1.38, 3.95, `当前 C₁ = ${state.C1.toFixed(1)}，C₂ = ${state.C2.toFixed(1)}；不同的 (C₁, C₂) 覆盖全部解`, { align: 'left', color: T['--ink-3'], size: 10 });
        if (animate) plot.animate(430); else plot.render();
        UI.readout(out, [
          ['齐次方程', 'y″ − y = 0，基本解组 y₁ = eˣ，y₂ = e⁻ˣ'],
          ['线性无关', 'y₁ / y₂ = e²ˣ 不是常数，Wronski 行列式 W = −2 ≠ 0'],
          ['叠加原理', 'Y = C₁y₁ + C₂y₂ 仍是齐次方程的解'],
          ['Y(x₀)', Y(x0).toFixed(5)],
          ['数值验证', `Y″(x₀) − Y(x₀) ≈ ${residual(h => Y(h), x0, 0).toExponential(3)}`]
        ]);
      } else {
        const step = state.step;
        if (step >= 1) {
          plot.curve(yS, { color: T['--teal'], width: 2.2, clipY: true });
          plot.note(1.38, -1.4, '特解 y* = −2x（y*″ − y* = 2x）', { align: 'right', color: T['--teal'], size: 10.5 });
        }
        plot.curve(Y, { color: T['--brand'], width: 1.8, dash: [5, 4], clipY: true });
        plot.note(-1.38, 5.4, 'Y：齐次通解（虚线）', { align: 'left', color: T['--brand'], size: 10.5 });
        if (step >= 2) {
          const yG = x => Y(x) + yS(x);
          plot.curve(yG, { color: T['--red'], width: 2.8, clipY: true });
          plot.dot(x0, yG(x0), { color: T['--red'] });
          plot.note(-1.38, 4.6, 'y = Y + y*：非齐次方程的通解', { align: 'left', color: T['--red'], size: 11 });
          plot.note(-1.38, 3.95, `y(x₀) = Y(x₀) + y*(x₀) = ${Y(x0).toFixed(3)} + ${yS(x0).toFixed(3)} = ${(Y(x0) + yS(x0)).toFixed(3)}`, { align: 'left', color: T['--ink-3'], size: 10 });
        }
        plot.vline(x0, { color: D.withAlpha(T['--ink-3'], 0.45) });
        if (animate) plot.animate(430); else plot.render();
        UI.readout(out, [
          ['非齐次方程', 'y″ − y = 2x'],
          ['齐次通解 Y', `Y = C₁eˣ + C₂e⁻ˣ（C₁ = ${state.C1.toFixed(1)}, C₂ = ${state.C2.toFixed(1)}）`],
          ['非齐次特解 y*', 'y* = −2x（直接验证：y*″ − y* = 0 + 2x = 2x）'],
          ['通解', 'y = Y + y*（结构定理：齐次通解 + 非齐次特解）'],
          ['数值验证', `y″(x₀) − y(x₀) − 2x₀ ≈ ${residual(h => Y(h) + yS(h), x0, 2 * x0).toExponential(3)}`]
        ]);
      }
    }

    function residual(f, x, rhs) {
      const h = 1e-4;
      return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h) - f(x) - rhs;
    }

    sync();
    render(true);
    return s;
  };

})(window);
