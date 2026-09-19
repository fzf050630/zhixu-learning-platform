/* ============================================================
   calc6.js — 第6章 多元函数积分学 可视化组件
   doubleIntegral：二重积分的定义与极坐标
   greenTheorem：格林公式
   tripleIntegral：三重积分与坐标变换
   fluxDivergence：通量、散度与高斯公式
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3 } = UI;

  function axes(ctx, B, T, xMin, xMax, yMin, yMax) {
    const X = v => B.x + (v - xMin) / (xMax - xMin) * B.w;
    const Y = v => B.y + (yMax - v) / (yMax - yMin) * B.h;
    ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.9); ctx.lineWidth = 1;
    const y0 = Y(0), x0 = X(0);
    ctx.beginPath();
    if (yMin < 0 && yMax > 0) { ctx.moveTo(B.x, y0); ctx.lineTo(B.x + B.w, y0); }
    if (xMin < 0 && xMax > 0) { ctx.moveTo(x0, B.y); ctx.lineTo(x0, B.y + B.h); }
    ctx.stroke(); ctx.restore();
    return { X, Y };
  }

  /* ---------- 二重积分 ---------- */
  W.doubleIntegral = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { n: 10, polar: false };
    const f = (x, y) => 1 + 0.35 * x * x + 0.25 * y * y;
    UI.slider(ctrl, { label: '分割 n × n', min: 2, max: 40, step: 1, value: 10, fmt: v => v, onInput: v => { state.n = v; render(); } });
    UI.seg(ctrl, [{ label: '直角坐标', value: false }, { label: '极坐标', value: true }], v => { state.polar = v; render(); }, 0);

    function render() {
      scene.clearLayers();
      let sum = 0, exact = 0;
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const B = { x: 60, y: 22, w: p.w - 60 - 200, h: p.h - 46 };
        const R = 1.8;
        const { X, Y } = axes(ctx, B, T, -R - 0.2, R + 0.2, -R - 0.2, R + 0.2);
        // 区域：单位圆 x²+y² ≤ R²
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; i ? ctx.lineTo(X(R * Math.cos(a)), Y(R * Math.sin(a))) : ctx.moveTo(X(R * Math.cos(a)), Y(R * Math.sin(a))); }
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--brand'), 0.07); ctx.fill();
        ctx.restore();
        // 分割
        const n = state.n;
        if (!state.polar) {
          const step = 2 * R / n;
          ctx.save(); ctx.strokeStyle = D.withAlpha(C('--brand'), 0.4); ctx.lineWidth = 0.8;
          for (let i = 0; i <= n; i++) {
            const x = -R + i * step;
            ctx.beginPath(); ctx.moveTo(X(x), Y(-R)); ctx.lineTo(X(x), Y(R)); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(X(-R), Y(x)); ctx.lineTo(X(R), Y(x)); ctx.stroke();
          }
          ctx.restore();
          // 采样：落在圆内的格心
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
            const x = -R + (i + 0.5) * step, y = -R + (j + 0.5) * step;
            if (x * x + y * y <= R * R) { sum += f(x, y) * step * step; ctx.fillStyle = D.withAlpha(C('--accent'), 0.28); ctx.fillRect(X(x) - 2, Y(y) - 2, 4, 4); }
          }
        } else {
          const nr = n / 2, nth = n;
          ctx.save(); ctx.strokeStyle = D.withAlpha(C('--teal'), 0.5); ctx.lineWidth = 0.8;
          for (let i = 0; i <= nr; i++) { const r = R * i / nr; ctx.beginPath(); for (let k = 0; k <= 60; k++) { const a = k / 60 * Math.PI * 2; k ? ctx.lineTo(X(r * Math.cos(a)), Y(r * Math.sin(a))) : ctx.moveTo(X(r * Math.cos(a)), Y(r * Math.sin(a))); } ctx.stroke(); }
          for (let j = 0; j < nth; j++) { const a = j / nth * Math.PI * 2; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(R * Math.cos(a)), Y(R * Math.sin(a))); ctx.stroke(); }
          ctx.restore();
          // 极坐标格心
          for (let i = 0; i < nr; i++) for (let j = 0; j < nth; j++) {
            const r = R * (i + 0.5) / nr, a = (j + 0.5) / nth * Math.PI * 2;
            const x = r * Math.cos(a), y = r * Math.sin(a);
            sum += f(x, y) * (R / nr) * (2 * Math.PI / nth) * r;
            ctx.fillStyle = D.withAlpha(C('--teal'), 0.3); ctx.fillRect(X(x) - 2, Y(y) - 2, 4, 4);
          }
        }
        // 精值（数值积分）
        let ex = 0, M = 400;
        const stepE = 2 * R / M;
        for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) {
          const x = -R + (i + 0.5) * stepE, y = -R + (j + 0.5) * stepE;
          if (x * x + y * y <= R * R) ex += f(x, y) * stepE * stepE;
        }
        exact = ex;
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 1.6; ctx.beginPath();
        for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; i ? ctx.lineTo(X(R * Math.cos(a)), Y(R * Math.sin(a))) : ctx.moveTo(X(R * Math.cos(a)), Y(R * Math.sin(a))); }
        ctx.closePath(); ctx.stroke();

        const px0 = p.w - 188;
        const rows = [
          ['积分区域', 'x² + y² ≤ R²（R = 1.8）'],
          ['被积函数', 'f = 1 + 0.35x² + 0.25y²'],
          ['黎曼和', sum.toFixed(5)],
          ['数值精值', ex.toFixed(5)]
        ];
        rows.forEach((r, i) => {
          const y = 26 + i * 40;
          D.G.box(ctx, px0, y, 176, 32, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 9, y + 10, r[0], { align: 'left', size: 10, color: T['--ink-3'] });
          D.G.label(ctx, px0 + 167, y + 22, r[1], { align: 'right', size: 10.5, weight: 700, color: T['--brand'], mono: true });
        });
        D.G.box(ctx, px0, 26 + 4 * 40, 176, 62, { fill: D.withAlpha(C('--teal'), 0.08), stroke: D.withAlpha(C('--teal'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 16, state.polar ? '极坐标' : '直角坐标', { align: 'left', size: 11, weight: 700, color: C('--teal') });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 34, state.polar ? '∬ f(r cosθ, r sinθ) r dr dθ' : '∬ f(x, y) dx dy', { align: 'left', size: 10, color: T['--ink-2'] });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 50, state.polar ? 'r 是雅可比因子，不可漏' : '化为累次积分：先 y 后 x', { align: 'left', size: 10, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['分割', `${state.n} × ${state.n}`],
        ['黎曼和', sum.toFixed(6)],
        ['数值精值', exact.toFixed(6)],
        ['误差', Math.abs(sum - exact).toExponential(3)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 格林公式 ---------- */
  W.greenTheorem = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { P: -0.5, Q: 0.9, R: 1.5 };
    UI.slider(ctrl, { label: 'P 系数（∮ P dx）', min: -1.5, max: 1.5, step: 0.1, value: -0.5, fmt: v => v.toFixed(1), onInput: v => { state.P = v; render(); } });
    UI.slider(ctrl, { label: 'Q 系数（∮ Q dy）', min: -1.5, max: 1.5, step: 0.1, value: 0.9, fmt: v => v.toFixed(1), onInput: v => { state.Q = v; render(); } });
    UI.slider(ctrl, { label: '区域半径 R', min: 0.6, max: 2, step: 0.05, value: 1.5, fmt: v => v.toFixed(2), onInput: v => { state.R = v; render(); } });

    function render() {
      scene.clearLayers();
      let lineInt = 0, areaInt = 0;
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const B = { x: 60, y: 22, w: p.w - 60 - 210, h: p.h - 46 };
        const Rr = 2.4;
        const { X, Y } = axes(ctx, B, T, -Rr, Rr, -Rr, Rr);
        // 区域与边界方向
        const R = state.R;
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i <= 160; i++) { const a = -i / 160 * Math.PI * 2; i ? ctx.lineTo(X(R * Math.cos(a)), Y(R * Math.sin(a))) : ctx.moveTo(X(R * Math.cos(a)), Y(R * Math.sin(a))); }
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--brand'), 0.08); ctx.fill();
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.4; ctx.stroke();
        ctx.restore();
        // 切向箭头（逆时针）
        const marks = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
        marks.forEach(a => {
          const x = R * Math.cos(a), y = R * Math.sin(a);
          const tx = -Math.sin(a), ty = Math.cos(a);
          D.G.arrow(ctx, [[X(x - tx * 0.16), Y(y - ty * 0.16)], [X(x + tx * 0.16), Y(y + ty * 0.16)]], { color: C('--purple'), width: 2.2, head: 7 });
        });
        // 向量场
        for (let gx = -2; gx <= 2; gx += 0.5) for (let gy = -2; gy <= 2; gy += 0.5) {
          const u = state.P * gy, v2 = state.Q * gx;   // 取 P = 0.9y 型示例（∮Pdx+Qdy）
          const len = Math.hypot(u, v2);
          if (len < 1e-6) continue;
          const sc = 0.16;
          D.G.arrow(ctx, [[X(gx - u * sc), Y(gy - v2 * sc)], [X(gx + u * sc), Y(gy + v2 * sc)]], { color: D.withAlpha(T['--ink-3'], 0.55), width: 1, head: 4 });
        }
        // 数值：∮ P dx + Q dy = ∬ (∂Q/∂x − ∂P/∂y) dA
        // 取 P = a·y，Q = b·x，则 ∂Q/∂x = b，∂P/∂y = a
        const a = state.P, b2 = state.Q;
        const dQdx = b2, dPdy = a;
        areaInt = (dQdx - dPdy) * Math.PI * R * R;
        let li = 0;
        const N = 720;
        for (let i = 0; i < N; i++) {
          const t = i / N * Math.PI * 2;
          const x = R * Math.cos(t), y = R * Math.sin(t);
          const dx = -R * Math.sin(t) * (Math.PI * 2 / N);
          const dy = R * Math.cos(t) * (Math.PI * 2 / N);
          li += (a * y) * dx + (b2 * x) * dy;
        }
        lineInt = li;
        ctx.save();
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left';
        ctx.fillText('逆时针方向为正向边界', B.x + 8, B.y + B.h - 8);
        ctx.restore();
        const px0 = p.w - 198;
        const rows = [
          ['∂Q/∂x', dQdx.toFixed(3)],
          ['∂P/∂y', dPdy.toFixed(3)],
          ['∂Q/∂x − ∂P/∂y', (dQdx - dPdy).toFixed(3)],
          ['∬ 面积积分', areaInt.toFixed(4)]
        ];
        rows.forEach((r, i) => {
          const y = 26 + i * 40;
          D.G.box(ctx, px0, y, 186, 32, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 9, y + 10, r[0], { align: 'left', size: 10, color: T['--ink-3'] });
          D.G.label(ctx, px0 + 177, y + 22, r[1], { align: 'right', size: 11.5, weight: 700, color: T['--brand'], mono: true });
        });
        D.G.box(ctx, px0, 26 + 4 * 40, 186, 66, { fill: D.withAlpha(C('--green'), 0.08), stroke: D.withAlpha(C('--green'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 16, '格林公式', { align: 'left', size: 11, weight: 700, color: C('--green') });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 34, '∮L Pdx + Qdy', { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
        D.G.label(ctx, px0 + 9, 26 + 4 * 40 + 50, '= ∬D (∂Q/∂x − ∂P/∂y) dA', { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['边界曲线积分 ∮', lineInt.toFixed(4)],
        ['二重积分 ∬', areaInt.toFixed(4)],
        ['区域面积', (Math.PI * state.R * state.R).toFixed(4)],
        ['结论', '正向边界（逆时针）时两者相等']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 三重积分与坐标变换 ---------- */
  W.tripleIntegral = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'cart' };
    UI.seg(ctrl, [
      { label: '直角坐标', value: 'cart' },
      { label: '柱面坐标', value: 'cyl' },
      { label: '球面坐标', value: 'sph' }
    ], v => { state.mode = v; render(); }, 0);

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cx = p.w / 2, cy = p.h / 2 + 20;
        const proj = (x, y, z) => [cx + (x - z * 0.6) * 46, cy - (y + z * 0.42) * 46];
        const R = 2;
        if (state.mode === 'cart') {
          // 立方体网格
          for (let i = 0; i <= 4; i++) {
            const t = -R + 2 * R * i / 4;
            [[[t, -R, -R], [t, R, -R]], [[t, R, -R], [t, R, R]], [[t, R, R], [t, -R, R]], [[t, -R, R], [t, -R, -R]]].forEach(([q1, q2]) => {
              const a = proj(...q1), b = proj(...q2);
              ctx.save(); ctx.strokeStyle = D.withAlpha(C('--brand'), 0.35); ctx.lineWidth = 0.9;
              ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
            });
          }
          D.G.label(ctx, p.w / 2, 24, 'dV = dx dy dz：以长方体微元分割空间', { size: 12, weight: 700, color: T['--ink'], mono: true });
          UI.readout(out, [['坐标', '直角坐标 (x, y, z)'], ['体积元', 'dV = dx dy dz'], ['适用', '长方体/可分离的区域']]);
        } else if (state.mode === 'cyl') {
          // 圆柱
          const rings = [0.7, 1.3, 2];
          rings.forEach(r => {
            ctx.save(); ctx.strokeStyle = D.withAlpha(C('--teal'), 0.6); ctx.lineWidth = 1.2; ctx.beginPath();
            for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2; const q = proj(r * Math.cos(a), -R, r * Math.sin(a)); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
            ctx.stroke(); ctx.restore();
          });
          for (let i = 0; i < 8; i++) {
            const a = i / 8 * Math.PI * 2;
            const q1 = proj(R * Math.cos(a), -R, R * Math.sin(a)), q2 = proj(R * Math.cos(a), R, R * Math.sin(a));
            ctx.save(); ctx.strokeStyle = D.withAlpha(C('--teal'), 0.4); ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke(); ctx.restore();
          }
          D.G.label(ctx, p.w / 2, 24, 'dV = r dr dθ dz（雅可比因子 r）', { size: 12, weight: 700, color: T['--ink'], mono: true });
          UI.readout(out, [['坐标', '(r, θ, z)，x = r cosθ, y = r sinθ'], ['体积元', 'dV = r dr dθ dz'], ['适用', '圆柱形区域、旋转体']]);
        } else {
          // 球
          const lat = 5, lon = 10;
          for (let i = 1; i <= lat; i++) {
            const phi = Math.PI * i / (lat + 1);
            ctx.save(); ctx.strokeStyle = D.withAlpha(C('--purple'), 0.5); ctx.lineWidth = 1; ctx.beginPath();
            for (let k = 0; k <= 60; k++) { const th = k / 60 * Math.PI * 2; const q = proj(R * Math.sin(phi) * Math.cos(th), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(th)); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
            ctx.stroke(); ctx.restore();
          }
          for (let j = 0; j < lon; j++) {
            const th = j / lon * Math.PI * 2;
            ctx.save(); ctx.strokeStyle = D.withAlpha(C('--purple'), 0.35); ctx.beginPath();
            for (let k = 0; k <= 40; k++) { const phi = Math.PI * k / 40; const q = proj(R * Math.sin(phi) * Math.cos(th), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(th)); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
            ctx.stroke(); ctx.restore();
          }
          D.G.label(ctx, p.w / 2, 24, 'dV = ρ² sinφ dρ dφ dθ（雅可比因子 ρ² sinφ）', { size: 12, weight: 700, color: T['--ink'], mono: true });
          UI.readout(out, [['坐标', '(ρ, φ, θ)，x = ρ sinφ cosθ'], ['体积元', 'dV = ρ² sinφ dρ dφ dθ'], ['适用', '球形区域、球对称被积函数']]);
        }
      });
      scene.render();
    }
    render();
    return s;
  };

  /* ---------- 通量、散度与高斯公式 ---------- */
  W.fluxDivergence = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { k: 1.2 };
    UI.slider(ctrl, { label: '场强度系数 k', min: -2, max: 2, step: 0.1, value: 1.2, fmt: v => v.toFixed(1), onInput: v => { state.k = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cx = p.w / 2, cy = p.h / 2 + 14;
        const s1 = 40;
        const X = v => cx + v * s1, Y = v => cy - v * s1;
        // 闭合曲面（圆）
        ctx.save(); ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.4; ctx.beginPath();
        for (let i = 0; i <= 100; i++) { const a = i / 100 * Math.PI * 2; i ? ctx.lineTo(X(1.6 * Math.cos(a)), Y(1.6 * Math.sin(a))) : ctx.moveTo(X(1.6 * Math.cos(a)), Y(1.6 * Math.sin(a))); }
        ctx.closePath(); ctx.stroke(); ctx.restore();
        // 向量场 F = k(x, y)
        const k = state.k;
        for (let x = -2.6; x <= 2.6; x += 0.45) for (let y = -2.6; y <= 2.6; y += 0.45) {
          const u = k * x, v2 = k * y;
          const len = Math.hypot(u, v2);
          if (len < 1e-6) continue;
          const sc = 0.12;
          D.G.arrow(ctx, [[X(x - u * sc), Y(y - v2 * sc)], [X(x + u * sc), Y(y + v2 * sc)]], { color: D.withAlpha(T['--ink-3'], 0.5), width: 1, head: 4 });
        }
        // 法向箭头示意
        [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
          const x = 1.6 * Math.cos(a), y = 1.6 * Math.sin(a);
          D.G.arrow(ctx, [[X(x), Y(y)], [X(x * 1.25), Y(y * 1.25)]], { color: C('--purple'), width: 2, head: 6 });
        });
        const div = 2 * k;           // div(kx, ky) = 2k
        const flux = div * Math.PI * 1.6 * 1.6;
        D.G.label(ctx, p.w / 2, 22, `场 F = k(x, y)，div F = ∂Fx/∂x + ∂Fy/∂y = ${div.toFixed(2)}`, { size: 12, weight: 700, color: T['--ink'], mono: true });
        D.G.box(ctx, 16, p.h - 60, p.w - 32, 46, { fill: D.withAlpha(div > 0 ? C('--red') : C('--green'), 0.08), stroke: D.withAlpha(div > 0 ? C('--red') : C('--green'), 0.4), radius: 8 });
        D.G.label(ctx, 28, p.h - 42, `高斯公式：∯S F·dS = ∭V div F dV = ${flux.toFixed(4)}`, { align: 'left', size: 11.5, weight: 700, color: T['--brand'], mono: true });
        D.G.label(ctx, 28, p.h - 24, div > 0 ? 'div F > 0：有源，净流出（通量为正）' : div < 0 ? 'div F < 0：有汇，净流入（通量为负）' : 'div F = 0：无源无汇，净通量为 0', { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['散度 div F', (2 * state.k).toFixed(3)],
        ['通量 ∯ F·dS', (2 * state.k * Math.PI * 2.56).toFixed(4)],
        ['关系', '通量 = 散度的体积分（高斯公式）'],
        ['物理意义', '散度是单位体积的通量（源的强度）']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 两类曲线积分 ---------- */
  W.lineIntegral = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -0.18, xMax: 1.3, yMin: -0.18, yMax: 1.3,
      height: 310, xLabel: 'x', yLabel: 'y', xTicks: 5, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'ds', n: 12, h: 4 };
    const exactDS = (() => {
      let S = 0;
      const N = 4000;
      for (let i = 0; i < N; i++) {
        const x = (i + 0.5) / N;
        S += (x + x * x) * Math.hypot(1, 2 * x) / N;
      }
      return S;
    })();

    UI.seg(ctrl, [
      { label: '第一类（弧长 ds）', value: 'ds' },
      { label: '第二类（坐标 dx, dy）', value: 'xy' }
    ], v => { state.mode = v; render(true); }, 0);
    UI.slider(ctrl, { label: '分割段数 n', min: 4, max: 40, step: 1, value: 12, fmt: v => v, onInput: v => { state.n = v; render(false); } });
    UI.slider(ctrl, { label: '高亮微元序号', min: 0, max: 39, step: 1, value: 4, fmt: v => v + 1, onInput: v => { state.h = v; render(false); } });
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

    function render(animate) {
      const T = D.Theme.cache;
      const n = state.n, h = Math.max(0, Math.min(n - 1, state.h));
      const pts = [];
      for (let i = 0; i <= n; i++) { const x = i / n; pts.push([x, x * x]); }
      let S1 = 0, S2 = 0, cross = 0;
      for (let i = 0; i < n; i++) {
        const x1 = i / n, x2 = (i + 1) / n;
        const y1 = x1 * x1, y2 = x2 * x2;
        const dx = x2 - x1, dy = y2 - y1;
        const ds = Math.hypot(dx, dy);
        S1 += (x1 + dx / 2 + y1 + dy / 2) * ds;
        S2 += y1 * dx + x1 * dy;
        cross += dx * dy;
      }
      plot.clearLayers();
      plot.curve(x => x * x, { color: D.withAlpha(T['--brand'], 0.35), width: 1.4, from: 0, to: 1 });
      poly(pts, T['--brand'], 2);
      poly([pts[h], pts[h + 1]], T['--red'], 3.6);
      plot.dot(pts[h][0], pts[h][1], { color: T['--red'], r: 3.4 });
      plot.dot(pts[h + 1][0], pts[h + 1][1], { color: T['--red'], r: 3.4 });
      const x1 = h / n, x2 = (h + 1) / n, y1 = x1 * x1, y2 = x2 * x2;
      const dx = x2 - x1, dy = y2 - y1, ds = Math.hypot(dx, dy);
      const xm = (x1 + x2) / 2, ym = (y1 + y2) / 2;
      if (state.mode === 'ds') {
        plot.note(xm + 0.03, ym + 0.06, `Δs = ${ds.toFixed(4)}`, { align: 'left', color: T['--red'], size: 11 });
        plot.note(xm + 0.03, ym - 0.08, `f = x + y = ${(xm + ym).toFixed(3)}（取中点）`, { align: 'left', color: T['--brand'], size: 10.5 });
        plot.note(0.02, 1.24, '第一类：微元是弧长 Δs > 0，与曲线方向无关；被积函数 f = x + y', { align: 'left', color: T['--ink-2'], size: 11 });
      } else {
        plot.arrow(x1, y1, x2, y1, { color: T['--accent'], width: 2, dash: [4, 3] });
        plot.arrow(x2, y1, x2, y2, { color: T['--purple'], width: 2 });
        plot.note(x1 + dx / 2, y1 - 0.09, `Δx = ${dx.toFixed(4)}`, { align: 'center', color: T['--accent'], size: 10.5 });
        plot.note(x2 + 0.03, y1 + dy / 2, `Δy = ${dy.toFixed(4)}`, { align: 'left', color: T['--purple'], size: 10.5 });
        plot.note(0.02, 1.24, '第二类：微元 Δx、Δy 可正可负，反向积分变号；P = y，Q = x（取起点）', { align: 'left', color: T['--ink-2'], size: 11 });
      }
      plot.note(1.28, 0.06, `x 从 0 到 1，y = x²`, { align: 'right', color: T['--ink-3'], size: 10.5 });
      if (animate) plot.animate(430); else plot.render();
      if (state.mode === 'ds') {
        UI.readout(out, [
          ['路径 L', 'y = x²，(0,0) → (1,1)'],
          ['分割段数 n / 高亮微元', `${n} / 第 ${h + 1} 段`],
          ['当前微元 Δs', ds.toFixed(4)],
          ['黎曼和 Σ f·Δs', S1.toFixed(5)],
          ['精确值 ∫L (x+y) ds（数值）', exactDS.toFixed(5)],
          ['误差', Math.abs(S1 - exactDS).toExponential(3)]
        ]);
      } else {
        UI.readout(out, [
          ['路径 L', 'y = x²，(0,0) → (1,1)'],
          ['分割段数 n / 高亮微元', `${n} / 第 ${h + 1} 段`],
          ['当前微元 (Δx, Δy)', `(${dx.toFixed(4)}, ${dy.toFixed(4)})`],
          ['黎曼和 Σ (yΔx + xΔy)', S2.toFixed(5)],
          ['精确值 ∫L x dy + y dx', '1（= xy |₀¹）'],
          ['误差来源', `ΣΔxΔy = ${cross.toFixed(5)}（n→∞ 时 → 0）`]
        ]);
      }
    }
    render(true);
    return s;
  };

  /* ---------- 两类曲面积分 ---------- */
  W.surfaceIntegral = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'area', x: 0.45, y: 0.25, d: 0.24 };
    const f = (x, y) => 0.55 * (x * x + y * y);

    UI.seg(ctrl, [
      { label: '面积微元 dS', value: 'area' },
      { label: '通量微元 v·n dS', value: 'flux' }
    ], v => { state.mode = v; render(); }, 0);
    UI.slider(ctrl, { label: '微元位置 x₀', min: -1.1, max: 1.1, step: 0.05, value: 0.45, fmt: v => v.toFixed(2), onInput: v => { state.x = v; render(); } });
    UI.slider(ctrl, { label: '微元位置 y₀', min: -1.1, max: 1.1, step: 0.05, value: 0.25, fmt: v => v.toFixed(2), onInput: v => { state.y = v; render(); } });
    UI.slider(ctrl, { label: '微元边长 d（dx = dy）', min: 0.08, max: 0.4, step: 0.01, value: 0.24, fmt: v => v.toFixed(2), onInput: v => { state.d = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const panelW = Math.max(140, Math.min(220, p.w * 0.29));
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
        const line = (pts, color, width, dash) => {
          ctx.save();
          ctx.strokeStyle = color; ctx.lineWidth = width;
          if (dash) ctx.setLineDash(dash);
          ctx.beginPath();
          pts.forEach((q, i) => { const s2 = PR(q[0], q[1], q[2]); i ? ctx.lineTo(s2[0], s2[1]) : ctx.moveTo(s2[0], s2[1]); });
          ctx.stroke(); ctx.restore();
        };
        const S = 1.5;
        const x0 = state.x, y0 = state.y, d = state.d;
        const zx = 1.1 * x0, zy = 1.1 * y0;
        const k = Math.sqrt(1 + zx * zx + zy * zy);
        const base = [[x0, y0], [x0 + d, y0], [x0 + d, y0 + d], [x0, y0 + d]];
        const wire = [];
        for (let x = -S; x <= S + 1e-9; x += 0.3) {
          const pts = [];
          for (let y = -S; y <= S + 1e-9; y += 0.15) pts.push([x, y, f(x, y)]);
          wire.push(pts);
        }
        for (let y = -S; y <= S + 1e-9; y += 0.3) {
          const pts = [];
          for (let x = -S; x <= S + 1e-9; x += 0.15) pts.push([x, y, f(x, y)]);
          wire.push(pts);
        }
        const all = [];
        wire.forEach(L2 => all.push(...L2));
        base.forEach(([x, y]) => all.push([x, y, 0], [x, y, f(x, y)]));
        PR = fitView(all);
        wire.forEach(pts => line(pts, D.withAlpha(C('--brand'), 0.38), 1));
        D.G.label(ctx, 16, 18, `曲面 z = 0.55(x² + y²)：对比投影微元与曲面微元`, { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });

        // 投影微元（z = 0 平面）
        const proj = base.map(([x, y]) => PR(x, y, 0));
        ctx.save();
        ctx.beginPath();
        proj.forEach((q, i) => { i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--accent'), state.mode === 'flux' ? 0.3 : 0.12);
        ctx.fill();
        ctx.strokeStyle = D.withAlpha(C('--accent'), 0.85); ctx.setLineDash([4, 3]); ctx.lineWidth = 1.4; ctx.stroke();
        ctx.restore();
        // 曲面微元
        const quad = base.map(([x, y]) => PR(x, y, f(x, y)));
        ctx.save();
        ctx.beginPath();
        quad.forEach((q, i) => { i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), state.mode === 'area' ? 0.34 : 0.14);
        ctx.fill();
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.8; ctx.stroke();
        ctx.restore();
        // 竖直连线与法向量
        base.forEach(([x, y]) => {
          const q1 = PR(x, y, 0), q2 = PR(x, y, f(x, y));
          ctx.save();
          ctx.strokeStyle = D.withAlpha(C('--purple'), 0.75); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
          ctx.restore();
        });
        const mc = PR(x0 + d / 2, y0 + d / 2, f(x0 + d / 2, y0 + d / 2));
        const nl = Math.hypot(zx, zy, 1) || 1;
        const NE = PR(x0 + d / 2 - zx / nl * 0.9, y0 + d / 2 - zy / nl * 0.9, f(x0 + d / 2, y0 + d / 2) + 0.9 / nl);
        D.G.arrow(ctx, [mc, NE], { color: C('--purple'), width: 2.2, head: 7 });
        D.G.label(ctx, NE[0] + 8, NE[1] - 6, 'n', { align: 'left', size: 12, weight: 800, color: C('--purple') });
        D.G.label(ctx, quad[2][0] + 8, quad[2][1] + 10, state.mode === 'area' ? 'dS（曲面面积微元）' : 'v·n dS（通量微元）', { align: 'left', size: 10.5, weight: 700, color: C('--red') });
        D.G.label(ctx, proj[3][0] - 8, proj[3][1] + 12, 'dxdy（投影微元）', { align: 'right', size: 10.5, weight: 700, color: C('--accent') });

        // 右侧面板
        const px0 = p.w - panelW - 4;
        const rows = [
          ['微元位置 (x₀, y₀)', `(${x0.toFixed(2)}, ${y0.toFixed(2)})`],
          ['z_x, z_y', `(${zx.toFixed(3)}, ${zy.toFixed(3)})`],
          ['伸缩因子 √(1+z_x²+z_y²)', k.toFixed(4)],
          ['面积微元 dS', `≈ ${(k * d * d).toFixed(5)}`],
          ['投影/通量微元', `dxdy = ${(d * d).toFixed(5)}`]
        ];
        rows.forEach((r, i) => {
          const y2 = 32 + i * 42;
          D.G.box(ctx, px0, y2, panelW, 36, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 8, y2 + 12, r[0], { align: 'left', size: 9.5, color: T['--ink-3'] });
          D.G.label(ctx, px0 + panelW - 8, y2 + 26, r[1], { align: 'right', size: 11, weight: 700, color: T['--brand'], mono: true });
        });
        const ny = 32 + rows.length * 42;
        D.G.box(ctx, px0, ny, panelW, 92, { fill: D.withAlpha(C('--green'), 0.08), stroke: D.withAlpha(C('--green'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 8, ny + 15, '关系', { align: 'left', size: 10.5, weight: 700, color: C('--green') });
        D.G.lines(ctx, px0 + 8, ny + 33, ['dS = √(1+z_x²+z_y²) dxdy', '第一类与侧无关；', '第二类换侧变号（通量）'], { size: 9.5, lineHeight: 15, align: 'left', color: T['--ink-2'] });
      });
      scene.render();
      const x0 = state.x, y0 = state.y, d = state.d;
      const zx = 1.1 * x0, zy = 1.1 * y0, k = Math.sqrt(1 + zx * zx + zy * zy);
      UI.readout(out, [
        ['曲面', 'z = 0.55(x² + y²)，显式曲面 z = f(x,y)'],
        ['微元 dS / dxdy', `${(k * d * d).toFixed(5)} / ${(d * d).toFixed(5)}`],
        ['伸缩因子', `√(1 + ${zx.toFixed(3)}² + ${zy.toFixed(3)}²) = ${k.toFixed(4)}`],
        ['两类关系', '∬ P dydz + Q dzdx + R dxdy = ∬ (P cosα + Q cosβ + R cosγ) dS'],
        ['垂直场 v = (0,0,1)', 'v·n dS = n_z dS = dxdy（上侧），正是投影微元']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 场论初步：流线、散度与旋度 ---------- */
  W.fieldFlow = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -3.2, xMax: 3.2, yMin: -3.2, yMax: 3.2,
      height: 320, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { mode: 'source', x: 1.2, y: 0.8, k: 0 };
    const FIELDS = {
      source: { label: '源：A = (x, y)', f: () => [1, 1], div: 2, rot: 0, desc: '箭头向外发散，div A = 2 > 0（有源）' },
      sink: { label: '汇：A = (−x, −y)', f: () => [-1, -1], div: -2, rot: 0, desc: '箭头指向原点，div A = −2 < 0（有汇）' },
      rotate: { label: '旋转：A = (−y, x)', f: () => [1, -1], div: 0, rot: 2, desc: '环绕流动，rot A = 2（逆时针旋转，无散）' },
      shear: { label: '剪切：A = (y, 0)', f: () => [0, 1], div: 0, rot: -1, desc: '剪切流动，div A = 0，rot A = −1（无旋但有旋度）' }
    };
    function fieldAt(x, y) {
      if (state.mode === 'source') return [x, y];
      if (state.mode === 'sink') return [-x, -y];
      if (state.mode === 'rotate') return [-y, x];
      return [y, 0];
    }
    UI.seg(ctrl, [
      { label: '源', value: 'source' }, { label: '汇', value: 'sink' },
      { label: '旋转', value: 'rotate' }, { label: '剪切', value: 'shear' }
    ], v => { state.mode = v; state.k = 0; render(true); }, 0);
    UI.slider(ctrl, { label: '探针起点 x₀', min: -2.6, max: 2.6, step: 0.1, value: 1.2, fmt: v => v.toFixed(1), onInput: v => { state.x = v; state.k = 0; render(false); } });
    UI.slider(ctrl, { label: '探针起点 y₀', min: -2.6, max: 2.6, step: 0.1, value: 0.8, fmt: v => v.toFixed(1), onInput: v => { state.y = v; state.k = 0; render(false); } });
    UI.transport(ctrl, { total: 25, speed: 110, onChange: k => { state.k = k; render(false); } });

    function probePath() {
      const pts = [[state.x, state.y]];
      let x = state.x, y = state.y;
      for (let i = 0; i < state.k; i++) {
        const f = fieldAt(x, y);
        x += 0.13 * f[0]; y += 0.13 * f[1];
        if (Math.abs(x) > 3.4 || Math.abs(y) > 3.4) break;
        pts.push([x, y]);
      }
      return pts;
    }

    function render(animate) {
      const T = D.Theme.cache;
      const FE = FIELDS[state.mode];
      plot.clearLayers();
      plot.custom((p, ctx) => {
        const len = 0.34;
        for (let x = -2.7; x <= 2.7; x += 0.45) {
          for (let y = -2.7; y <= 2.7; y += 0.45) {
            const v = fieldAt(x, y);
            const nl = Math.hypot(v[0], v[1]) || 1;
            const ux = v[0] / nl, uy = v[1] / nl;
            D.G.arrow(ctx, [[p.X(x - ux * len / 2), p.Y(y - uy * len / 2)], [p.X(x + ux * len / 2), p.Y(y + uy * len / 2)]],
              { color: D.withAlpha(T['--line-2'], 0.75), width: 1, head: 4 });
          }
        }
        // 流线
        if (state.mode === 'source' || state.mode === 'sink') {
          for (let i = 0; i < 12; i++) {
            const a = i / 12 * Math.PI * 2;
            const r1 = 0.5, r2 = 2.95;
            const q1 = [r1 * Math.cos(a), r1 * Math.sin(a)], q2 = [r2 * Math.cos(a), r2 * Math.sin(a)];
            ctx.save(); ctx.strokeStyle = D.withAlpha(C('--brand'), 0.45); ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(p.X(q1[0]), p.Y(q1[1])); ctx.lineTo(p.X(q2[0]), p.Y(q2[1])); ctx.stroke(); ctx.restore();
            if (state.mode === 'source') D.G.arrow(ctx, [[p.X(q2[0] * 0.86), p.Y(q2[1] * 0.86)], [p.X(q2[0]), p.Y(q2[1])]], { color: C('--brand'), width: 1.6, head: 6 });
            else D.G.arrow(ctx, [[p.X(q1[0] * 1.5), p.Y(q1[1] * 1.5)], [p.X(q1[0]), p.Y(q1[1])]], { color: C('--brand'), width: 1.6, head: 6 });
          }
        } else if (state.mode === 'rotate') {
          [1.1, 2.0, 2.85].forEach(r => {
            ctx.save(); ctx.strokeStyle = D.withAlpha(C('--brand'), 0.45); ctx.lineWidth = 1.3;
            ctx.beginPath();
            for (let i = 0; i <= 90; i++) { const a = i / 90 * Math.PI * 2; const px = p.X(r * Math.cos(a)), py = p.Y(r * Math.sin(a)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
            ctx.stroke(); ctx.restore();
            const a = 0.8;
            D.G.arrow(ctx, [[p.X(r * Math.cos(a) * 1), p.Y(r * Math.sin(a) * 1)], [p.X(r * Math.cos(a + 0.18)), p.Y(r * Math.sin(a + 0.18))]], { color: C('--brand'), width: 1.8, head: 7 });
          });
        } else {
          [-1.8, -0.6, 0.6, 1.8].forEach(y => {
            ctx.save(); ctx.strokeStyle = D.withAlpha(C('--brand'), 0.45); ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(p.X(-2.95), p.Y(y)); ctx.lineTo(p.X(2.95), p.Y(y)); ctx.stroke(); ctx.restore();
            D.G.arrow(ctx, [[p.X(1.2), p.Y(y)], [p.X(1.7), p.Y(y)]], { color: C('--brand'), width: 1.8, head: 7 });
          });
        }
      });
      // 探针路径（用 custom 绘制折线，避免动画截断）
      const path = probePath();
      if (path.length > 1) plot.custom((p, ctx) => {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2.4; ctx.strokeStyle = T['--red'];
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        path.forEach(([x, y], i) => i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y)));
        ctx.stroke(); ctx.restore();
      });
      const last = path[path.length - 1];
      plot.dot(last[0], last[1], { color: T['--red'], r: 4.6 });
      plot.custom((p, ctx) => {
        const v = fieldAt(last[0], last[1]);
        D.G.arrow(ctx, [[p.X(last[0]), p.Y(last[1])], [p.X(last[0] + v[0] * 0.22), p.Y(last[1] + v[1] * 0.22)]], { color: C('--accent'), width: 2.2, head: 7 });
        ctx.save();
        ctx.strokeStyle = D.withAlpha(C('--red'), 0.5); ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(p.X(state.x), p.Y(state.y), Math.abs(p.X(0.32) - p.X(0)), 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
        D.G.label(ctx, p.px + 8, p.py + 14, FE.desc, { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        D.G.label(ctx, p.px + 8, p.py + 30, '虚线箭网为向量场，实线为流线；红色为探针沿场积分得到的路径', { align: 'left', size: 10.5, color: T['--ink-3'] });
      });
      if (animate) plot.animate(430); else plot.render();
      UI.readout(out, [
        ['向量场', FE.label],
        ['探针位置', `(${last[0].toFixed(3)}, ${last[1].toFixed(3)})`],
        ['场在该点的值', `(${fieldAt(last[0], last[1])[0].toFixed(3)}, ${fieldAt(last[0], last[1])[1].toFixed(3)})`],
        ['散度 div A', FE.div.toFixed(2)],
        ['旋度 rot A（z 分量）', FE.rot.toFixed(2)]
      ]);
    }
    render(true);
    return s;
  };

})(window);
