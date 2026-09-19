/* ============================================================
   la5.js — 第5章 矩阵的特征值和特征向量 可视化组件
   eigen2d：2×2 矩阵的特征值与特征向量（几何）
   diagonalize：相似对角化
   eigenInvariant：特征向量的不变方向（旋转扫描与夹角曲线）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C } = UI;
  const f3 = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r); };

  /* ---------- 2×2 特征值 ---------- */
  W.eigen2d = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { a: 2, b: 1, c: 1, d: 2, theta: 30 };
    const sl = (k) => UI.slider(ctrl, { label: k, min: -3, max: 3, step: 0.5, value: state[k], fmt: v => v.toFixed(1), onInput: v => { state[k] = v; render(); } });
    sl('a'); sl('b'); sl('c'); sl('d');
    UI.slider(ctrl, { label: '方向角 θ', min: 0, max: 360, step: 5, value: 30, fmt: v => v + '°', onInput: v => { state.theta = v; render(); } });
    UI.seg(ctrl, [
      { label: '对称矩阵', value: 'sym' }, { label: '旋转矩阵', value: 'rot' }, { label: '对角矩阵', value: 'diag' }, { label: '重根矩阵', value: 'rep' }
    ], v => {
      if (v === 'sym') { state.a = 2; state.b = 1; state.c = 1; state.d = 2; }
      if (v === 'rot') { state.a = 0; state.b = -1; state.c = 1; state.d = 0; }
      if (v === 'diag') { state.a = 3; state.b = 0; state.c = 0; state.d = 1; }
      if (v === 'rep') { state.a = 2; state.b = 1; state.c = 0; state.d = 2; }
      render();
    }, 0);

    function calc() {
      const tr = state.a + state.d, dt = state.a * state.d - state.b * state.c;
      const disc = tr * tr - 4 * dt;
      if (disc >= -1e-9) {
        const l1 = (tr + Math.sqrt(Math.max(0, disc))) / 2, l2 = (tr - Math.sqrt(Math.max(0, disc))) / 2;
        const vec = l => {
          if (Math.abs(state.b) > 1e-9) return [state.b, l - state.a];
          if (Math.abs(state.c) > 1e-9) return [l - state.d, state.c];
          return [1, 0];
        };
        const v1 = vec(l1), v2 = vec(l2);
        const n1 = Math.hypot(...v1) || 1, n2 = Math.hypot(...v2) || 1;
        return { tr, dt, disc, real: true, l1, l2, v1: [v1[0] / n1, v1[1] / n1], v2: [v2[0] / n2, v2[1] / n2] };
      }
      return { tr, dt, disc, real: false, alpha: tr / 2, beta: Math.sqrt(-disc) / 2 };
    }

    function render() {
      const r = calc();
      const A = [[state.a, state.b], [state.c, state.d]];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const ox = p.w / 2, oy = p.h / 2 + 10, sc = Math.min(58, (p.h - 90) / 6.4);
        const P = v => [ox + v[0] * sc, oy - v[1] * sc];
        ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.8); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(p.w - 30, oy); ctx.moveTo(ox, 20); ctx.lineTo(ox, p.h - 20); ctx.stroke(); ctx.restore();
        // 单位圆与像
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--ink-3'], 0.55); ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) { const t = i / 120 * Math.PI * 2; const q = P([Math.cos(t), Math.sin(t)]); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
        ctx.stroke();
        ctx.strokeStyle = D.withAlpha(C('--brand'), 0.75); ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 160; i++) {
          const t = i / 160 * Math.PI * 2;
          const x = Math.cos(t), y = Math.sin(t);
          const q = P([A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y]);
          i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
        }
        ctx.stroke(); ctx.restore();
        // 特征方向
        if (r.real) {
          [[r.l1, r.v1, C('--red')], [r.l2, r.v2, C('--green')]].forEach(([l, v, col]) => {
            const a = P([v[0] * 2.4, v[1] * 2.4]), b = P([-v[0] * 2.4, -v[1] * 2.4]);
            ctx.save(); ctx.strokeStyle = D.withAlpha(col, 0.75); ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
            D.G.arrow(ctx, [P([0, 0]), P([v[0] * 1.6, v[1] * 1.6])], { color: col, width: 2.6, head: 8 });
            D.G.label(ctx, P([v[0] * 1.6, v[1] * 1.6])[0] + 8, P([v[0] * 1.6, v[1] * 1.6])[1] - 8, `λ=${f3(l)}`, { align: 'left', size: 11, weight: 800, color: col });
          });
        }
        // 当前方向向量
        const th = state.theta * Math.PI / 180;
        const x = [Math.cos(th), Math.sin(th)];
        const Ax = [A[0][0] * x[0] + A[0][1] * x[1], A[1][0] * x[0] + A[1][1] * x[1]];
        D.G.arrow(ctx, [P([0, 0]), P(x)], { color: C('--purple'), width: 2.2, head: 7 });
        D.G.arrow(ctx, [P([0, 0]), P(Ax)], { color: C('--accent'), width: 2.2, head: 7 });
        const cosang = (x[0] * Ax[0] + x[1] * Ax[1]) / ((Math.hypot(...x) * Math.hypot(...Ax)) || 1);
        D.G.label(ctx, 20, 22, `x（紫）与 Ax（橙）夹角 ${(Math.acos(Math.max(-1, Math.min(1, cosang))) * 180 / Math.PI).toFixed(1)}°`, { align: 'left', size: 11, color: T['--ink-2'] });
        D.G.label(ctx, 20, 40, '特征方向上：Ax 与 x 共线（夹角 0° 或 180°）', { align: 'left', size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, r.real ? [
        ['tr(A), det(A)', `${f3(r.tr)}, ${f3(r.dt)}`],
        ['特征方程', `λ² − ${f3(r.tr)}λ + ${f3(r.dt)} = 0`],
        ['特征值', `λ₁ = ${f3(r.l1)}, λ₂ = ${f3(r.l2)}`],
        ['特征向量', `(${f3(r.v1[0])}, ${f3(r.v1[1])}), (${f3(r.v2[0])}, ${f3(r.v2[1])})`]
      ] : [
        ['tr(A), det(A)', `${f3(r.tr)}, ${f3(r.dt)}`],
        ['判别式 Δ', f3(r.disc)],
        ['特征值', `λ = ${f3(r.alpha)} ± ${f3(r.beta)}i（复特征值）`],
        ['说明', '无实特征向量（含旋转成分）']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 相似对角化 ---------- */
  W.diagonalize = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const cases = [
      { label: '三不同实根', A: [[2, 1, 0], [0, 3, 1], [0, 0, 1]], note: '三个互异特征值 ⇒ 一定可对角化' },
      { label: '重根可对角化', A: [[2, 0, 0], [0, 2, 0], [0, 0, 3]], note: 'λ=2 是二重根，几何重数也是 2，可对角化' },
      { label: '重根不可对角化', A: [[2, 1, 0], [0, 2, 0], [0, 0, 3]], note: 'λ=2 是二重根，但只有一个线性无关特征向量，不可对角化' }
    ];
    const state = { idx: 0 };
    UI.seg(ctrl, cases.map(c => ({ label: c.label, value: c.label })), (v, k) => { state.idx = k; render(); }, 0);

    function det3(M) {
      return M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    }
    function charPoly(A) {
      // det(λI − A) = λ³ − c1λ² + c2λ − c3
      const tr = A[0][0] + A[1][1] + A[2][2];
      const s2 = A[0][0] * A[1][1] - A[0][1] * A[1][0] + A[0][0] * A[2][2] - A[0][2] * A[2][0] + A[1][1] * A[2][2] - A[1][2] * A[2][1];
      const s3 = det3(A);
      return { c1: tr, c2: s2, c3: s3 };
    }
    function rootsOf(c1, c2, c3) {
      // 解 λ³ − c1λ² + c2λ − c3 = 0：先找有理根，再因式分解
      const cands = [];
      for (let p = 1; p <= 6; p++) for (const sg of [1, -1]) cands.push(sg * p);
      const roots = [];
      for (const r of cands) {
        const v = r * r * r - c1 * r * r + c2 * r - c3;
        if (Math.abs(v) < 1e-6) { roots.push(r); break; }
      }
      if (roots.length) {
        const r0 = roots[0];
        // λ² + bλ + c
        const b = r0 - c1, cc = r0 * r0 - c1 * r0 + c2;
        const disc = b * b - 4 * cc;
        if (disc >= -1e-9) { roots.push((-b + Math.sqrt(Math.max(0, disc))) / 2); roots.push((-b - Math.sqrt(Math.max(0, disc))) / 2); }
        else { roots.push(NaN, NaN); }
      }
      return roots;
    }
    function nullspaceDim(A, lambda) {
      const M = [[A[0][0] - lambda, A[0][1], A[0][2]], [A[1][0], A[1][1] - lambda, A[1][2]], [A[2][0], A[2][1], A[2][2] - lambda]];
      // 秩
      let rank = 0;
      const a = M.map(r => r.slice());
      for (let c = 0; c < 3 && rank < 3; c++) {
        let piv = -1;
        for (let r = rank; r < 3; r++) if (Math.abs(a[r][c]) > 1e-9) { piv = r; break; }
        if (piv < 0) continue;
        [a[rank], a[piv]] = [a[piv], a[rank]];
        const pv = a[rank][c];
        for (let r = rank + 1; r < 3; r++) { const f = a[r][c] / pv; for (let k = c; k < 3; k++) a[r][k] -= f * a[rank][k]; }
        rank++;
      }
      return 3 - rank;
    }
    function eigenvector(A, lambda) {
      const M = [[A[0][0] - lambda, A[0][1], A[0][2]], [A[1][0], A[1][1] - lambda, A[1][2]], [A[2][0], A[2][1], A[2][2] - lambda]];
      // 用叉积法：任取两个行向量叉积作为近似特征向量
      const rows = M.map(r => r.slice());
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
        const u = rows[i], v = rows[j];
        const cr = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        const n = Math.hypot(...cr);
        if (n > 1e-6) return cr.map(x => x / n);
      }
      return [1, 0, 0];
    }

    function render() {
      const C0 = cases[state.idx];
      const A = C0.A;
      const { c1, c2, c3 } = charPoly(A);
      const roots = rootsOf(c1, c2, c3);
      const uniq = [];
      roots.forEach(r => { if (Number.isFinite(r) && !uniq.some(u => Math.abs(u - r) < 1e-6)) uniq.push(r); });
      const mult = uniq.map(u => roots.filter(r => Number.isFinite(r) && Math.abs(r - u) < 1e-6).length);
      const geos = uniq.map((u, i) => nullspaceDim(A, u));
      const diagonalizable = uniq.length > 0 && geos.reduce((s1, g) => s1 + g, 0) === 3;
      const P = [], L = [];
      uniq.forEach((u, i) => {
        const vec = eigenvector(A, u);
        for (let k = 0; k < geos[i]; k++) { P.push(vec.map(x => x * (k === 0 ? 1 : 1))); L.push(u); }
      });

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 44;
        const drawMat = (x, y, M, color, title) => {
          D.G.label(ctx, x + M[0].length * cell / 2, y - 10, title, { size: 11.5, weight: 700, color });
          for (let i = 0; i < M.length; i++) for (let j = 0; j < M[0].length; j++) {
            D.G.box(ctx, x + j * cell, y + i * cell, cell - 4, cell - 4, { fill: T['--card-2'], stroke: D.withAlpha(color, 0.5), radius: 5 });
            D.G.label(ctx, x + j * cell + (cell - 4) / 2, y + i * cell + (cell - 4) / 2, f3(M[i][j]), { size: 12, weight: 700, color: T['--ink'], mono: true });
          }
        };
        drawMat(30, 40, A, C('--brand'), 'A');
        if (P.length === 3) {
          const Pmat = [0, 1, 2].map(i => [P[0][i], P[1][i], P[2][i]]);
          drawMat(p.w / 2 - 60, 40, Pmat, C('--purple'), 'P = [p₁ p₂ p₃]');
          const Lm = [0, 1, 2].map(i => [0, 1, 2].map(j => i === j ? L[i] : 0));
          drawMat(p.w - 160, 40, Lm, C('--green'), 'Λ');
        } else {
          D.G.box(ctx, p.w / 2 - 60, 50, 200, 90, { fill: D.withAlpha(C('--red'), 0.08), stroke: D.withAlpha(C('--red'), 0.5), radius: 8 });
          D.G.label(ctx, p.w / 2 + 40, 82, '线性无关特征向量不足 3 个', { size: 12, weight: 700, color: C('--red') });
          D.G.label(ctx, p.w / 2 + 40, 104, '⇒ A 不可相似对角化', { size: 12, weight: 700, color: C('--red') });
        }
        const info = uniq.map((u, i) => `λ${i + 1} = ${f3(u)}（代数重数 ${mult[i]}，几何重数 ${geos[i]}）`);
        info.forEach((t, i) => D.G.label(ctx, 30, p.h - 60 + i * 18, t, { align: 'left', size: 11, color: T['--ink-2'], mono: true }));
        D.G.label(ctx, p.w / 2, p.h - 8, C0.note, { size: 11, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['特征值', roots.map(r => Number.isFinite(r) ? f3(r) : '复').join(', ')],
        ['代数重数 vs 几何重数', uniq.map((u, i) => `${mult[i]} vs ${geos[i]}`).join('；')],
        ['可对角化', diagonalizable ? '是（P⁻¹AP = Λ）' : '否'],
        ['结论', C0.note]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 特征向量的不变方向 ---------- */
  W.eigenInvariant = function (host) {
    const s = UI.shellPlot(host, { height: 330, xMin: -4.2, xMax: 4.2, yMin: -4.2, yMax: 4.2, xTicks: 8, yTicks: 8 });
    const { plot, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { a: 2, b: 1, c: 1, d: 2, theta: 30 };
    const sl = (key, label) => UI.slider(ctrl, {
      label, min: -3, max: 3, step: 0.5, value: state[key], fmt: v => v.toFixed(1),
      onInput: v => { state[key] = v; render(); }
    });
    const sa = sl('a', 'a₁₁'), sb = sl('b', 'a₁₂'), sc = sl('c', 'a₂₁'), sd = sl('d', 'a₂₂');
    UI.seg(ctrl, [
      { label: '对称矩阵', value: 'sym' }, { label: '剪切矩阵', value: 'shear' },
      { label: '对角矩阵', value: 'diag' }, { label: '旋转矩阵', value: 'rot' }
    ], v => {
      const cfg = v === 'sym' ? [2, 1, 1, 2] : v === 'shear' ? [1, 1, 0, 1] : v === 'diag' ? [3, 0, 0, 0.5] : [0, -1, 1, 0];
      state.a = cfg[0]; state.b = cfg[1]; state.c = cfg[2]; state.d = cfg[3];
      sa.set(cfg[0]); sb.set(cfg[1]); sc.set(cfg[2]); sd.set(cfg[3]);
      render();
    }, 0);
    const thSl = UI.slider(ctrl, { label: '方向角 θ', min: 0, max: 360, step: 5, value: 30, fmt: v => v + '°', onInput: v => { state.theta = v; render(); } });
    UI.transport(ctrl, { total: 24, onChange: k => { state.theta = Math.round(k * 15) % 360; thSl.set(state.theta); render(); } });

    function calc() {
      const { a, b, c, d } = state;
      const tr = a + d, dt = a * d - b * c, disc = tr * tr - 4 * dt;
      if (disc < -1e-9) return { real: false, tr, dt, disc };
      const l1 = (tr + Math.sqrt(Math.max(0, disc))) / 2, l2 = (tr - Math.sqrt(Math.max(0, disc))) / 2;
      const vec = l => {
        if (Math.abs(b) > 1e-9) return [b, l - a];
        if (Math.abs(c) > 1e-9) return [l - d, c];
        return l >= a + 1e-9 ? [1, 0] : [0, 1];
      };
      const norm = v => { const n = Math.hypot(v[0], v[1]) || 1; return [v[0] / n, v[1] / n]; };
      const v1 = norm(vec(l1)), v2 = norm(vec(l2));
      const same = Math.abs(v1[0] * v2[0] + v1[1] * v2[1]) > 1 - 1e-6;
      return { real: true, tr, dt, disc, l1, l2, v1, v2, same };
    }

    function angleOf(x, Ax) {
      const cth = (x[0] * Ax[0] + x[1] * Ax[1]) / ((Math.hypot(x[0], x[1]) * Math.hypot(Ax[0], Ax[1])) || 1);
      return Math.acos(Math.max(-1, Math.min(1, cth))) * 180 / Math.PI;
    }

    function render() {
      const { a, b, c, d } = state;
      const r = calc();
      const th = state.theta * Math.PI / 180;
      const xv = [Math.cos(th), Math.sin(th)];
      const Ax = [a * xv[0] + b * xv[1], c * xv[0] + d * xv[1]];
      const AxZero = Math.hypot(Ax[0], Ax[1]) < 1e-9;
      const phi = AxZero ? 0 : angleOf(xv, Ax);
      const sweep = [];
      for (let i = 0; i <= 120; i++) {
        const t = i / 120 * Math.PI * 2;
        const x = [Math.cos(t), Math.sin(t)];
        const Ax2 = [a * x[0] + b * x[1], c * x[0] + d * x[1]];
        sweep.push({ th: i / 120 * 360, phi: Math.hypot(Ax2[0], Ax2[1]) < 1e-9 ? 0 : angleOf(x, Ax2) });
      }
      const onEigen = r.real && Math.min(phi, 180 - phi) < 0.6;
      plot.clearLayers();
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        const O = [p.X(0), p.Y(0)];
        // 单位圆及其像
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--ink-3'], 0.5); ctx.lineWidth = 1.1;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const t = i / 120 * Math.PI * 2;
          const q = [p.X(Math.cos(t)), p.Y(Math.sin(t))];
          i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
        }
        ctx.stroke();
        ctx.strokeStyle = D.withAlpha(C('--brand'), 0.5); ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i <= 160; i++) {
          const t = i / 160 * Math.PI * 2;
          const x = Math.cos(t), y = Math.sin(t);
          const q = [p.X(a * x + b * y), p.Y(c * x + d * y)];
          i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
        }
        ctx.stroke();
        ctx.restore();
        // 特征方向
        if (r.real) {
          const dirs = r.same ? [[r.l1, r.v1, C('--red')]] : [[r.l1, r.v1, C('--red')], [r.l2, r.v2, C('--green')]];
          dirs.forEach(([l, v, col]) => {
            const e = [v[0] * 3.4, v[1] * 3.4];
            ctx.save();
            ctx.strokeStyle = D.withAlpha(col, 0.65); ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(p.X(-e[0]), p.Y(-e[1]));
            ctx.lineTo(p.X(e[0]), p.Y(e[1]));
            ctx.stroke(); ctx.restore();
            D.G.arrow(ctx, [O, [p.X(v[0] * 2.4), p.Y(v[1] * 2.4)]], { color: col, width: 2.6, head: 8 });
            D.G.label(ctx, p.X(v[0] * 2.4) + 8, p.Y(v[1] * 2.4) - 8, `λ = ${f3(l)}`, { align: 'left', size: 11, weight: 800, color: col });
          });
          if (r.same) D.G.label(ctx, p.X(0) + 14, p.py + p.ph - 14, '二重特征值：只有一个特征方向（不可对角化）', { align: 'left', size: 10, color: C('--red') });
        }
        // 当前向量 x 与像 Ax
        D.G.arrow(ctx, [O, [p.X(xv[0]), p.Y(xv[1])]], { color: C('--purple'), width: 2.4, head: 8 });
        D.G.arrow(ctx, [O, [p.X(Ax[0]), p.Y(Ax[1])]], { color: C('--accent'), width: 2.4, head: 8 });
        D.G.label(ctx, p.X(xv[0]) + 8, p.Y(xv[1]) + 10, 'x', { align: 'left', size: 11.5, weight: 800, color: C('--purple') });
        D.G.label(ctx, p.X(Ax[0]) + 8, p.Y(Ax[1]) - 8, 'Ax', { align: 'left', size: 11.5, weight: 800, color: C('--accent') });
        // 夹角弧
        const oxp = p.X(0), oyp = p.Y(0);
        const cross = xv[0] * Ax[1] - xv[1] * Ax[0];
        const dot2 = xv[0] * Ax[0] + xv[1] * Ax[1];
        const dphi = Math.atan2(cross, dot2);
        ctx.save();
        ctx.strokeStyle = D.withAlpha(C('--accent'), 0.85); ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i <= 24; i++) {
          const t = th + dphi * i / 24;
          const q = [oxp + Math.cos(t) * 38, oyp - Math.sin(t) * 38];
          i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
        }
        ctx.stroke(); ctx.restore();
        // 左上信息
        const lines = [
          `A = [[${f3(a)}, ${f3(b)}], [${f3(c)}, ${f3(d)}]]，tr = ${f3(r.tr)}，det = ${f3(r.dt)}`,
          r.real ? `特征值 λ₁ = ${f3(r.l1)}，λ₂ = ${f3(r.l2)}${r.same ? '（二重根）' : ''}` : `判别式 Δ = ${f3(r.disc)} < 0：复特征值，无实特征方向`,
          onEigen ? (AxZero ? 'x 沿 λ = 0 的特征方向：Ax = 0，向量被压到原点（φ 记为 0）' : '当前 x 恰好沿特征方向：Ax 与 x 共线，只被伸缩 λ 倍') : `x 与 Ax 的夹角 φ = ${phi.toFixed(1)}°：一般方向在变换后被“转动”了`,
          'θ = ' + state.theta + '°'
        ];
        ctx.save();
        ctx.font = `700 11px ${D.FONT_SANS}`;
        let tw = 0;
        lines.forEach(t => { tw = Math.max(tw, ctx.measureText(t).width); });
        ctx.restore();
        const panelW = Math.min(p.w - 220, tw + 26), panelH = 14 + lines.length * 16;
        D.G.box(ctx, 10, 10, panelW, panelH, { fill: D.withAlpha(T['--card'], 0.94), stroke: D.withAlpha(T['--line-2'], 0.8), radius: 8 });
        lines.forEach((t, k) => D.G.label(ctx, 19, 26 + k * 16, t, {
          align: 'left', size: 11, weight: k === 0 || (k === 2 && onEigen) ? 800 : 600,
          color: k === 0 ? T['--ink'] : k === 2 ? (onEigen ? C('--green') : C('--accent')) : T['--ink-2'], mono: k < 3
        }));
        // 夹角曲线插图
        const bx = p.px + p.pw - 198, by = p.py + 8, bw = 190, bh = 92;
        D.G.box(ctx, bx, by, bw, bh, { fill: D.withAlpha(T['--card'], 0.94), stroke: D.withAlpha(T['--line'], 0.9), radius: 7 });
        ctx.save();
        ctx.beginPath();
        sweep.forEach((pt, i) => {
          const qx = bx + 8 + pt.th / 360 * (bw - 16);
          const qy = by + bh - 15 - pt.phi / 180 * (bh - 32);
          i ? ctx.lineTo(qx, qy) : ctx.moveTo(qx, qy);
        });
        ctx.strokeStyle = C('--teal'); ctx.lineWidth = 1.6; ctx.stroke();
        ctx.restore();
        sweep.forEach(pt => {
          if (pt.phi < 0.4) {
            const qx = bx + 8 + pt.th / 360 * (bw - 16);
            D.G.dot(ctx, qx, by + bh - 15, 2.6, C('--green'));
          }
        });
        const cx = bx + 8 + (state.theta % 360) / 360 * (bw - 16);
        const cy = by + bh - 15 - phi / 180 * (bh - 32);
        ctx.save();
        ctx.strokeStyle = D.withAlpha(C('--purple'), 0.75); ctx.setLineDash([3, 3]); ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(cx, by + 14); ctx.lineTo(cx, by + bh - 8); ctx.stroke();
        ctx.restore();
        D.G.dot(ctx, cx, cy, 3.6, C('--purple'), true);
        D.G.label(ctx, bx + 6, by + 10, 'x 与 Ax 的夹角 φ(θ)', { align: 'left', size: 9, weight: 700, color: T['--ink-3'] });
        D.G.label(ctx, bx + bw - 6, by + 10, 'φ = 0 处为特征方向', { align: 'right', size: 9, color: C('--green') });
      });
      plot.render();
      UI.readout(out, r.real ? [
        ['tr(A), det(A)', `${f3(r.tr)}, ${f3(r.dt)}`],
        ['特征方程', `λ² − ${f3(r.tr)}λ + ${f3(r.dt)} = 0`],
        ['特征值', `λ₁ = ${f3(r.l1)}，λ₂ = ${f3(r.l2)}${r.same ? '（二重）' : ''}`],
        ['当前 θ 与夹角 φ', `θ = ${state.theta}°，φ = ${phi.toFixed(1)}°${onEigen ? '（沿特征方向）' : ''}`],
        ['结论', r.same ? '仅一个特征方向：一般向量无法只靠伸缩得到' : `特征方向上 Ax = ${f3(r.l1)}x 或 ${f3(r.l2)}x，方向不变`]
      ] : [
        ['tr(A), det(A)', `${f3(r.tr)}, ${f3(r.dt)}`],
        ['判别式 Δ', f3(r.disc)],
        ['特征值', `λ = ${f3(r.tr / 2)} ± ${f3(Math.sqrt(-r.disc) / 2)}i（复特征值）`],
        ['当前 θ 与夹角 φ', `θ = ${state.theta}°，φ = ${phi.toFixed(1)}°`],
        ['结论', '含旋转成分：任何方向都会被转动，没有不变方向']
      ]);
    }
    render();
    return s;
  };

})(window);
