/* ============================================================
   la6.js — 第6章 二次型 可视化组件
   quadraticForm：二次型与标准形（正交变换 / 配方法）
   positiveDefinite：正定性判别
   quadricClassify：由特征值符号对二次型分类（椭圆 / 双曲 / 抛物型）
   sylvesterCriterion：顺序主子式判正定（逐步计算）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C } = UI;
  const f3 = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r); };

  /* ---------- 二次型 ---------- */
  W.quadraticForm = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { n: 2, A: [[2, 1], [1, 2]], mode: 'orth' };
    UI.seg(ctrl, [{ label: '2 元', value: 2 }, { label: '3 元', value: 3 }], v => {
      state.n = v;
      state.A = v === 2 ? [[2, 1], [1, 2]] : [[2, 1, 0], [1, 2, 1], [0, 1, 2]];
      render();
    }, 0);
    UI.seg(ctrl, [{ label: '正交变换', value: 'orth' }, { label: '配方法', value: 'complete' }], v => { state.mode = v; render(); }, 0);
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, auto)';
    grid.style.gap = '4px';
    ctrl.appendChild(grid);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const inp = UI.number(grid, { label: '', value: 0, min: -5, max: 5, step: 0.5, width: 44 });
      inp.input.dataset.i = i; inp.input.dataset.j = j;
      inp.onChange(v => {
        if (i >= state.n || j >= state.n) return;
        state.A[i][j] = Number.isFinite(v) ? v : 0;
        if (i !== j) state.A[j][i] = state.A[i][j];   // 保持对称
        render();
      });
    }

    function eigen2(A) {
      const tr = A[0][0] + A[1][1], dt = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      const disc = tr * tr - 4 * dt;
      const l1 = (tr + Math.sqrt(Math.max(0, disc))) / 2, l2 = (tr - Math.sqrt(Math.max(0, disc))) / 2;
      const vec = l => {
        const v = Math.abs(A[0][1]) > 1e-9 ? [A[0][1], l - A[0][0]] : [1, 0];
        const n = Math.hypot(...v) || 1;
        return [v[0] / n, v[1] / n];
      };
      const v1 = vec(l1), v2 = vec(l2);
      return { l1, l2, v1, v2, disc };
    }

    function render() {
      const n = state.n;
      // 同步输入框显示
      [...grid.querySelectorAll('input')].forEach(inp => {
        const i = +inp.dataset.i, j = +inp.dataset.j;
        inp.value = (i < n && j < n) ? state.A[i][j] : '';
        inp.disabled = !(i < n && j < n);
        inp.style.opacity = (i < n && j < n) ? '1' : '.3';
      });
      const A11 = state.A[0][0], A12 = state.A[0][1], A22 = state.A[1][1];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        if (n === 2) {
          const e = eigen2([A11, A12, A12, A22] && state.A);
          const l1 = e.l1, l2 = e.l2;
          // 等值线 f = 1（采样）
          const B = { x: 60, y: 34, w: p.w - 60 - 230, h: p.h - 70 };
          const R = Math.max(1.6, 2.2 / Math.sqrt(Math.max(0.2, Math.min(Math.abs(l1), Math.abs(l2)))));
          const X = v => B.x + (v + R) / (2 * R) * B.w;
          const Y = v => B.y + (R - v) / (2 * R) * B.h;
          ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.7);
          ctx.beginPath(); ctx.moveTo(B.x, Y(0)); ctx.lineTo(B.x + B.w, Y(0)); ctx.moveTo(X(0), B.y); ctx.lineTo(X(0), B.y + B.h); ctx.stroke(); ctx.restore();
          // 用隐式方程绘制 f = ±1
          ctx.save();
          ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2;
          const step = 3;
          const img = ctx.getImageData ? null : null;
          for (const level of [1, -1]) {
            ctx.beginPath();
            for (let py = B.y; py < B.y + B.h; py += 1.5) {
              let started = false;
              for (let px = B.x; px < B.x + B.w; px += 1.5) {
                const x = (px - B.x) / B.w * 2 * R - R;
                const y = R - (py - B.y) / B.h * 2 * R;
                const fv = A11 * x * x + 2 * A12 * x * y + A22 * y * y;
                const prevx = (px - step - B.x) / B.w * 2 * R - R;
                const fprev = A11 * prevx * prevx + 2 * A12 * prevx * y + A22 * y * y;
                if ((fv - level) * (fprev - level) < 0) {
                  if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
                }
              }
            }
            ctx.strokeStyle = level > 0 ? C('--brand') : D.withAlpha(C('--accent'), 0.7);
            ctx.stroke();
          }
          ctx.restore();
          const type = (l1 > 0 && l2 > 0) ? '椭圆（正定）' : (l1 < 0 && l2 < 0) ? '椭圆（负定）' : (l1 * l2 < 0) ? '双曲线（不定）' : '退化（含零特征值）';
          D.G.label(ctx, B.x + B.w / 2, 24, `f = 1 与 f = −1 的等值线　类型：${type}`, { size: 11.5, weight: 700, color: T['--ink'] });
          // 特征方向
          [[l1, e.v1, C('--red')], [l2, e.v2, C('--green')]].forEach(([l, v, col]) => {
            const a = [X(v[0] * R * 0.9), Y(v[1] * R * 0.9)], b = [X(-v[0] * R * 0.9), Y(-v[1] * R * 0.9)];
            ctx.save(); ctx.strokeStyle = D.withAlpha(col, 0.7); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
          });
          const px0 = p.w - 216;
          const rows = [
            ['矩阵 A', `[${f3(A11)} ${f3(A12)}; ${f3(A12)} ${f3(A22)}]`],
            ['特征值', `λ₁=${f3(l1)}, λ₂=${f3(l2)}`],
            ['标准形', `f = ${f3(l1)}y₁² + ${f3(l2)}y₂²`],
            ['正/负惯性指数', `${[l1, l2].filter(v => v > 1e-9).length} / ${[l1, l2].filter(v => v < -1e-9).length}`]
          ];
          rows.forEach((r, k) => {
            const y = 44 + k * 44;
            D.G.box(ctx, px0, y, 200, 36, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
            D.G.label(ctx, px0 + 10, y + 12, r[0], { align: 'left', size: 10.5, color: T['--ink-3'] });
            D.G.label(ctx, px0 + 190, y + 26, r[1], { align: 'right', size: 11, weight: 700, color: C('--brand'), mono: true });
          });
          D.G.label(ctx, p.w / 2, p.h - 14, state.mode === 'orth' ? '正交变换：用 A 的单位特征向量作正交矩阵 Q，f = λ₁y₁² + λ₂y₂²' : '配方法：f = a₁₁(x₁ + a₁₂/a₁₁ x₂)² + (剩余项)x₂²（a₁₁=0 时先交换变量）', { size: 10.5, color: T['--ink-3'] });
          UI.readout(out, [
            ['二次型矩阵 A', `[[${f3(A11)}, ${f3(A12)}], [${f3(A12)}, ${f3(A22)}]]`],
            ['特征值', `${f3(l1)}, ${f3(l2)}`],
            [state.mode === 'orth' ? '正交变换标准形' : '配方标准形', `f = ${f3(l1)}y₁² + ${f3(l2)}y₂²`],
            ['曲线类型', type]
          ]);
        } else {
          // 3 元：只做数值展示
          const A = state.A;
          const tr = A[0][0] + A[1][1] + A[2][2];
          const s2 = A[0][0] * A[1][1] - A[0][1] * A[1][0] + A[0][0] * A[2][2] - A[0][2] * A[2][0] + A[1][1] * A[2][2] - A[1][2] * A[2][1];
          const s3 = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
          // 数值求根（三实根情形用二分+扫描）
          const poly = l => l * l * l - tr * l * l + s2 * l - s3;
          const roots = [];
          for (let x = -20; x <= 20; x += 0.01) { if (Math.abs(poly(x)) < 1e-4 && !roots.some(r => Math.abs(r - x) < 1e-3)) roots.push(Math.round(x * 1000) / 1000); }
          D.G.label(ctx, p.w / 2, 30, '3 元二次型（数值面板）', { size: 12.5, weight: 700, color: T['--ink'] });
          const rows = [
            ['A', `[[${A[0].join(', ')}], [${A[1].join(', ')}], [${A[2].join(', ')}]]`],
            ['tr(A)', f3(tr)],
            ['特征值（数值）', roots.length >= 3 ? roots.slice(0, 3).map(f3).join(', ') : '（请用 2 元查看几何，或手动计算）'],
            ['标准形', roots.length >= 3 ? `f = ${roots.slice(0, 3).map((r, i) => f3(r) + 'y' + (i + 1) + '²').join(' + ')}` : '—']
          ];
          rows.forEach((r, k) => {
            const y = 60 + k * 46;
            D.G.box(ctx, 60, y, p.w - 120, 38, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
            D.G.label(ctx, 74, y + 12, r[0], { align: 'left', size: 10.5, color: T['--ink-3'] });
            D.G.label(ctx, p.w - 74, y + 26, r[1], { align: 'right', size: 11, weight: 700, color: C('--brand'), mono: true });
          });
          UI.readout(out, [
            ['矩阵 A', `[[${A[0].join(', ')}], [${A[1].join(', ')}], [${A[2].join(', ')}]]`],
            ['特征值', roots.length >= 3 ? roots.slice(0, 3).map(f3).join(', ') : '—'],
            ['惯性指数', roots.length >= 3 ? `${roots.filter(r => r > 1e-9).length} 正 / ${roots.filter(r => r < -1e-9).length} 负` : '—']
          ]);
        }
      });
      scene.render();
    }
    render();
    return s;
  };

  /* ---------- 正定性 ---------- */
  W.positiveDefinite = function (host) {
    const s = UI.shell(host, 310);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { n: 2, A: [[2, 1], [1, 2]] };
    UI.seg(ctrl, [{ label: '2 阶', value: 2 }, { label: '3 阶', value: 3 }], v => {
      state.n = v;
      state.A = v === 2 ? [[2, 1], [1, 2]] : [[2, 1, 0], [1, 2, 1], [0, 1, 2]];
      render();
    }, 0);
    UI.seg(ctrl, [
      { label: '正定', value: 'pos' }, { label: '半正定', value: 'semi' }, { label: '不定', value: 'indef' }, { label: '负定', value: 'neg' }
    ], v => {
      if (state.n === 2) {
        state.A = v === 'pos' ? [[2, 1], [1, 2]] : v === 'semi' ? [[1, 1], [1, 1]] : v === 'indef' ? [[1, 2], [2, 1]] : [[-2, 1], [1, -2]];
      } else {
        state.A = v === 'pos' ? [[2, 1, 0], [1, 2, 1], [0, 1, 2]] : v === 'semi' ? [[1, 1, 1], [1, 1, 1], [1, 1, 1]] : v === 'indef' ? [[1, 2, 0], [2, 1, 0], [0, 0, 1]] : [[-2, 1, 0], [1, -2, 1], [0, 1, -2]];
      }
      render();
    }, 0);
    const grid = document.createElement('div');
    grid.style.display = 'grid'; grid.style.gridTemplateColumns = 'repeat(3, auto)'; grid.style.gap = '4px';
    ctrl.appendChild(grid);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const inp = UI.number(grid, { label: '', value: 0, min: -5, max: 5, step: 0.5, width: 44 });
      inp.input.dataset.i = i; inp.input.dataset.j = j;
      inp.onChange(v => {
        if (i >= state.n || j >= state.n) return;
        state.A[i][j] = Number.isFinite(v) ? v : 0;
        if (i !== j) state.A[j][i] = state.A[i][j];
        render();
      });
    }

    function leadingMinors(A, n) {
      const out = [];
      out.push(A[0][0]);
      if (n >= 2) out.push(A[0][0] * A[1][1] - A[0][1] * A[1][0]);
      if (n >= 3) {
        out.push(A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]));
      }
      return out;
    }
    function eigenApprox(A, n) {
      if (n === 2) {
        const tr = A[0][0] + A[1][1], dt = A[0][0] * A[1][1] - A[0][1] * A[1][0];
        const disc = tr * tr - 4 * dt;
        if (disc < 0) return [tr / 2, tr / 2];
        return [(tr + Math.sqrt(disc)) / 2, (tr - Math.sqrt(disc)) / 2];
      }
      // 3 阶：幂法式数值估计（对称阵）
      const eig = [];
      const M = A.map(r => r.slice());
      for (let k = 0; k < 3; k++) {
        let v = [1, 0.5, 0.3];
        let l = 0;
        for (let it = 0; it < 200; it++) {
          const w = [0, 0, 0].map((_, i) => M[i][0] * v[0] + M[i][1] * v[1] + M[i][2] * v[2]);
          const nv = Math.hypot(...w) || 1;
          l = (v[0] * w[0] + v[1] * w[1] + v[2] * w[2]) / (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] || 1);
          v = w.map(x => x / nv);
        }
        eig.push(l);
        // 收缩
        const vv = v;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) M[i][j] -= l * vv[i] * vv[j];
      }
      return eig;
    }

    function render() {
      const n = state.n, A = state.A;
      [...grid.querySelectorAll('input')].forEach(inp => {
        const i = +inp.dataset.i, j = +inp.dataset.j;
        inp.value = (i < n && j < n) ? A[i][j] : '';
        inp.disabled = !(i < n && j < n);
        inp.style.opacity = (i < n && j < n) ? '1' : '.3';
      });
      const minors = leadingMinors(A, n);
      const eig = eigenApprox(A, n);
      const pos = eig.every(x => x > 1e-9), semi = eig.every(x => x >= -1e-9);
      const neg = eig.every(x => x < -1e-9), negSemi = eig.every(x => x <= 1e-9);
      const conclusion = pos ? '正定' : semi ? '半正定' : neg ? '负定' : negSemi ? '半负定' : '不定';
      const color = pos ? C('--green') : semi ? C('--brand') : '--red';
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 主子式柱形
        const maxAbs = Math.max(1, ...minors.map(v => Math.abs(v)));
        const bw = 110, gap = 40, x0 = 70;
        minors.forEach((v, k) => {
          const x = x0 + k * (bw + gap);
          const baseY = p.h - 70, h = Math.abs(v) / maxAbs * 130;
          const up = v >= 0;
          const col = up ? C('--green') : C('--red');
          D.G.box(ctx, x, up ? baseY - h : baseY, bw, Math.max(3, h), { fill: D.withAlpha(col, 0.2), stroke: col, radius: 4 });
          D.G.label(ctx, x + bw / 2, up ? baseY - h - 12 : baseY + h + 12, f3(v), { size: 12.5, weight: 800, color: col, mono: true });
          D.G.label(ctx, x + bw / 2, baseY + (up ? 14 : -1) + 10, `${['一阶', '二阶', '三阶'][k]}顺序主子式`, { size: 10.5, color: T['--ink-3'] });
        });
        ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.9); ctx.beginPath(); ctx.moveTo(40, p.h - 70); ctx.lineTo(p.w - 40, p.h - 70); ctx.stroke(); ctx.restore();
        // 结论
        D.G.box(ctx, p.w - 250, 40, 220, 110, {
          fill: D.withAlpha(color === '--red' ? C('--red') : color, 0.1),
          stroke: D.withAlpha(color === '--red' ? C('--red') : color, 0.5), radius: 10
        });
        D.G.label(ctx, p.w - 140, 66, `结论：${conclusion}`, { size: 15, weight: 800, color: color === '--red' ? C('--red') : color });
        D.G.label(ctx, p.w - 140, 92, `特征值：${eig.map(f3).join(', ')}`, { size: 10.5, color: T['--ink-2'], mono: true });
        D.G.label(ctx, p.w - 140, 112, '正定 ⇔ 各阶顺序主子式均 > 0', { size: 10, color: T['--ink-3'] });
        D.G.label(ctx, p.w - 140, 130, '等价：特征值全正 / 正惯性指数 = n', { size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['顺序主子式', minors.map(f3).join(', ')],
        ['特征值', eig.map(f3).join(', ')],
        ['结论', conclusion],
        ['判据', pos ? '所有顺序主子式 > 0' : '存在不满足正定判据的顺序主子式']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 二次型的分类（椭圆 / 双曲 / 抛物型） ---------- */
  W.quadricClassify = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { A: [[2, 0.5], [0.5, 1]] };
    const sl = (i, j, label) => UI.slider(ctrl, {
      label, min: -3, max: 3, step: 0.25, value: state.A[i][j], fmt: v => v.toFixed(2),
      onInput: v => { state.A[i][j] = v; if (i !== j) state.A[j][i] = v; render(); }
    });
    const s11 = sl(0, 0, 'a₁₁'), s12 = sl(0, 1, 'a₁₂ = a₂₁'), s22 = sl(1, 1, 'a₂₂');
    UI.seg(ctrl, [
      { label: '椭圆（正定）', value: 'pos' }, { label: '双曲（不定）', value: 'hyp' },
      { label: '抛物（退化）', value: 'par' }, { label: '圆', value: 'cir' }
    ], v => {
      const cfg = v === 'pos' ? [[2, 0.5], [0.5, 1]] : v === 'hyp' ? [[1, 2], [2, -1]] : v === 'par' ? [[1, 1], [1, 1]] : [[2, 0], [0, 2]];
      state.A = cfg.map(r => r.slice());
      s11.set(cfg[0][0]); s12.set(cfg[0][1]); s22.set(cfg[1][1]);
      render();
    }, 0);

    function eig2(A) {
      const tr = A[0][0] + A[1][1], dt = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      const disc = tr * tr - 4 * dt;
      const l1 = (tr + Math.sqrt(Math.max(0, disc))) / 2, l2 = (tr - Math.sqrt(Math.max(0, disc))) / 2;
      const vec = l => {
        if (Math.abs(A[0][1]) > 1e-9) { const v = [A[0][1], l - A[0][0]]; const n = Math.hypot(v[0], v[1]) || 1; return [v[0] / n, v[1] / n]; }
        return l >= A[0][0] + 1e-9 ? [1, 0] : [0, 1];
      };
      return { tr, dt, l1, l2, v1: vec(l1), v2: vec(l2) };
    }
    function contour(f, L, x0, x1, y0, y1, nx, ny) {
      const segs = [];
      for (let i = 0; i < nx; i++) {
        const xa = x0 + (x1 - x0) * i / nx, xb = x0 + (x1 - x0) * (i + 1) / nx;
        for (let j = 0; j < ny; j++) {
          const ya = y0 + (y1 - y0) * j / ny, yb = y0 + (y1 - y0) * (j + 1) / ny;
          const v00 = f(xa, ya) - L, v10 = f(xb, ya) - L, v11 = f(xb, yb) - L, v01 = f(xa, yb) - L;
          const pts = [];
          if ((v00 > 0) !== (v10 > 0)) pts.push([xa + (xb - xa) * (v00 / (v00 - v10)), ya]);
          if ((v10 > 0) !== (v11 > 0)) pts.push([xb, ya + (yb - ya) * (v10 / (v10 - v11))]);
          if ((v01 > 0) !== (v11 > 0)) pts.push([xa + (xb - xa) * (v01 / (v01 - v11)), yb]);
          if ((v00 > 0) !== (v01 > 0)) pts.push([xa, ya + (yb - ya) * (v00 / (v00 - v01))]);
          if (pts.length >= 2) { segs.push([pts[0], pts[1]]); if (pts.length === 4) segs.push([pts[2], pts[3]]); }
        }
      }
      return segs;
    }

    function render() {
      const [[a11, a12], [, a22]] = state.A;
      const e = eig2(state.A);
      const det = e.l1 * e.l2;
      const p = [e.l1, e.l2].filter(v => v > 1e-9).length;
      const q = [e.l1, e.l2].filter(v => v < -1e-9).length;
      const type = Math.abs(det) < 1e-7 ? '抛物型（退化）' : det > 0 ? (e.l1 > 0 ? '椭圆型（正定）' : '椭圆型（负定）') : '双曲型（不定）';
      const shape = Math.abs(det) < 1e-7 ? 'f = ±1 退化为平行直线' : det > 0 ? (e.l1 > 0 ? 'f = 1 为椭圆（实曲线）' : 'f = 1 无实轨迹，f = −1 为椭圆') : 'f = 1 为两支双曲线';
      const fval = (x, y) => a11 * x * x + 2 * a12 * x * y + a22 * y * y;
      scene.clearLayers();
      scene.layer((p2, ctx) => {
        const T = D.Theme.cache;
        const B = { x: 36, y: 34, w: p2.w - 36 - 276, h: p2.h - 90 };
        const R = 2.4;
        const X = v => B.x + (v + R) / (2 * R) * B.w;
        const Y = v => B.y + (R - v) / (2 * R) * B.h;
        // 坐标网格
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.7); ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(B.x, Y(0)); ctx.lineTo(B.x + B.w, Y(0));
        ctx.moveTo(X(0), B.y); ctx.lineTo(X(0), B.y + B.h);
        ctx.stroke();
        ctx.restore();
        // 等值线
        [[1, C('--brand'), null], [-1, C('--accent'), [6, 4]], [0, C('--red'), [4, 3]]].forEach(([L, col, dash]) => {
          const segs = contour(fval, L, -R, R, -R, R, 56, 56);
          ctx.save();
          ctx.strokeStyle = D.withAlpha(col, L === 0 ? 0.75 : 0.9);
          ctx.lineWidth = L === 0 ? 1.5 : 2;
          if (dash) ctx.setLineDash(dash);
          ctx.beginPath();
          segs.forEach(([p0, p1]) => { ctx.moveTo(X(p0[0]), Y(p0[1])); ctx.lineTo(X(p1[0]), Y(p1[1])); });
          ctx.stroke(); ctx.restore();
        });
        // 特征方向
        [[e.l1, e.v1, C('--red')], [e.l2, e.v2, C('--green')]].forEach(([l, v, col]) => {
          const a = [X(-v[0] * R), Y(-v[1] * R)], b = [X(v[0] * R), Y(v[1] * R)];
          ctx.save();
          ctx.strokeStyle = D.withAlpha(col, 0.6); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
          D.G.label(ctx, X(v[0] * R * 0.78) + (v[0] >= 0 ? 6 : -6), Y(v[1] * R * 0.78) - 8,
            `λ = ${f3(l)}`, { align: v[0] >= 0 ? 'left' : 'right', size: 10, weight: 800, color: col });
        });
        D.G.label(ctx, B.x + 4, B.y - 16, 'f = 1（实线）、f = −1（虚线）、f = 0（红虚线）的等值线', { align: 'left', size: 10, color: T['--ink-3'] });
        // 右侧结论
        const x0 = p2.w - 264, w0 = 248;
        D.G.box(ctx, x0, 30, w0, 254, { fill: T['--card-2'], stroke: D.withAlpha(T['--line'], 0.9), radius: 10 });
        D.G.label(ctx, x0 + w0 / 2, 52, type, { size: 15, weight: 800, color: det > 0 ? (e.l1 > 0 ? C('--green') : C('--purple')) : Math.abs(det) < 1e-7 ? C('--red') : C('--accent') });
        const rows = [
          ['矩阵 A', `[[${f3(a11)}, ${f3(a12)}], [${f3(a12)}, ${f3(a22)}]]`],
          ['特征值', `λ₁ = ${f3(e.l1)}, λ₂ = ${f3(e.l2)}`],
          ['行列式 / 迹', `|A| = λ₁λ₂ = ${f3(det)}，tr = ${f3(e.tr)}`],
          ['正 / 负惯性指数', `p = ${p}，q = ${q}，r(f) = ${p + q}`],
          ['标准形', `f = ${f3(e.l1)}y₁² + ${f3(e.l2)}y₂²`],
          ['规范形', `z₁²·(${e.l1 > 1e-9 ? 1 : e.l1 < -1e-9 ? -1 : 0}) + z₂²·(${e.l2 > 1e-9 ? 1 : e.l2 < -1e-9 ? -1 : 0})`]
        ];
        rows.forEach((r, k) => {
          const y = 76 + k * 34;
          D.G.label(ctx, x0 + 12, y, r[0], { align: 'left', size: 10.5, color: T['--ink-3'] });
          D.G.label(ctx, x0 + w0 - 12, y + 15, r[1], { align: 'right', size: 11, weight: 700, color: T['--ink'], mono: true });
        });
        D.G.label(ctx, x0 + w0 / 2, 272, shape, { size: 10.5, weight: 700, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['二次型矩阵 A', `[[${f3(a11)}, ${f3(a12)}], [${f3(a12)}, ${f3(a22)}]]`],
        ['特征值', `${f3(e.l1)}, ${f3(e.l2)}（λ₁λ₂ = ${f3(det)}）`],
        ['类型判定', type],
        ['几何', shape],
        ['惯性指数 / 秩', `p = ${p}, q = ${q}, r(f) = ${p + q}`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 顺序主子式判正定 ---------- */
  W.sylvesterCriterion = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { A: [[2, 1, 0], [1, 2, 1], [0, 1, 2]], step: 0 };

    function det3m(A) {
      return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1])
        - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0])
        + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    }
    function minorsOf(A) {
      return [
        A[0][0],
        A[0][0] * A[1][1] - A[0][1] * A[1][0],
        det3m(A)
      ];
    }
    function eigen3(A) {
      const tr = A[0][0] + A[1][1] + A[2][2];
      const s2 = A[0][0] * A[1][1] - A[0][1] * A[1][0] + A[0][0] * A[2][2] - A[0][2] * A[2][0] + A[1][1] * A[2][2] - A[1][2] * A[2][1];
      const s3 = det3m(A);
      const f = l => l * l * l - tr * l * l + s2 * l - s3;
      const roots = [];
      let prev = f(-20), px = -20;
      for (let x = -19.99; x <= 20; x += 0.01) {
        const cur = f(x);
        if (prev * cur < 0) {
          let a = px, b = x;
          for (let i = 0; i < 60; i++) {
            const mid = (a + b) / 2;
            if (f(a) * f(mid) <= 0) b = mid; else a = mid;
          }
          const r0 = (a + b) / 2;
          if (!roots.some(r => Math.abs(r - r0) < 1e-4)) roots.push(r0);
        }
        prev = cur; px = x;
      }
      return roots;
    }

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, auto)';
    grid.style.gap = '4px';
    ctrl.appendChild(grid);
    const inputs = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const inp = UI.number(grid, { label: '', value: state.A[i][j], min: -5, max: 5, step: 0.5, width: 44 });
      inp.input.dataset.i = i; inp.input.dataset.j = j;
      inp.onChange(v => {
        state.A[i][j] = Number.isFinite(v) ? v : 0;
        if (i !== j) state.A[j][i] = state.A[i][j];
        render();
      });
      inputs.push(inp);
    }
    UI.seg(ctrl, [
      { label: '正定', value: 'pos' }, { label: 'D₂ < 0', value: 'd2' },
      { label: '半正定（D₃ = 0）', value: 'semi' }, { label: '负定', value: 'neg' }
    ], v => {
      state.A = v === 'pos' ? [[2, 1, 0], [1, 2, 1], [0, 1, 2]]
        : v === 'd2' ? [[1, 2, 0], [2, 1, 0], [0, 0, 3]]
          : v === 'semi' ? [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
            : [[-2, 1, 0], [1, -2, 1], [0, 1, -2]];
      syncInputs();
      tp.go(0);
    }, 0);
    const tp = UI.transport(ctrl, { total: 4, onChange: k => { state.step = k; render(); } });
    UI.button(ctrl, '重置', () => {
      state.A = [[2, 1, 0], [1, 2, 1], [0, 1, 2]];
      syncInputs(); tp.go(0);
    });

    function syncInputs() {
      [...grid.querySelectorAll('input')].forEach(inp => {
        const i = +inp.dataset.i, j = +inp.dataset.j;
        inp.value = state.A[i][j];
      });
    }

    function render() {
      const A = state.A;
      const minors = minorsOf(A);
      const eig = eigen3(A);
      const failIdx = minors.findIndex((v, i) => state.step >= i && v <= 1e-9);
      const revealed = minors.filter((v, i) => state.step >= i);
      const allPos = revealed.length === 3 && revealed.every(v => v > 1e-9);
      const verdict = failIdx >= 0
        ? `不是正定：D${failIdx + 1} = ${f3(minors[failIdx])} ≤ 0`
        : state.step >= 2 ? '正定：D₁ > 0，D₂ > 0，D₃ > 0 全部满足' : '继续点击“下一步”逐阶计算';
      const vColor = failIdx >= 0 ? C('--red') : state.step >= 2 ? C('--green') : C('--brand');
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 46, x0 = 30, y0 = 62;
        // 前 k 阶顺序主子阵高亮
        if (state.step < 3) {
          const k = state.step + 1;
          D.G.box(ctx, x0 - 5, y0 - 5, k * cell + 1, k * cell + 1, {
            fill: D.withAlpha(vColor, 0.1), stroke: D.withAlpha(vColor, 0.9), width: 1.8, radius: 6, dash: [5, 3]
          });
        }
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          D.G.box(ctx, x0 + j * cell, y0 + i * cell, cell - 4, cell - 4, { fill: T['--card-2'], stroke: T['--line'], radius: 5 });
          D.G.label(ctx, x0 + j * cell + (cell - 4) / 2, y0 + i * cell + (cell - 4) / 2, f3(A[i][j]),
            { size: 13, weight: 700, color: T['--ink'], mono: true });
        }
        D.G.label(ctx, x0 + 1.5 * cell, y0 - 22, '实对称矩阵 A', { size: 11.5, weight: 700, color: T['--brand'] });
        D.G.label(ctx, x0 + 1.5 * cell, y0 + 3 * cell + 14, state.step < 3 ? `高亮：左上 ${state.step + 1}×${state.step + 1} 子块` : '全部顺序主子式已算完', { size: 10.5, color: vColor });
        // 主子式卡片
        const cx = 200, cw = p.w - 220;
        for (let k = 0; k < 3; k++) {
          const y = 34 + k * 62;
          const on = state.step >= k;
          const prevFail = minors.slice(0, k).some((v, i) => state.step >= i && v <= 1e-9);
          const ok = on && minors[k] > 1e-9;
          const bad = on && !prevFail && minors[k] <= 1e-9;
          D.G.box(ctx, cx, y, cw, 50, {
            fill: !on ? T['--card-2'] : ok ? D.withAlpha(C('--green'), 0.1) : bad ? D.withAlpha(C('--red'), 0.12) : T['--card-2'],
            stroke: !on ? D.withAlpha(T['--line'], 0.8) : ok ? D.withAlpha(C('--green'), 0.7) : bad ? D.withAlpha(C('--red'), 0.8) : D.withAlpha(T['--line'], 0.8),
            width: state.step === k ? 2 : 1.2, radius: 8
          });
          D.G.label(ctx, cx + 14, y + 16, `D${k + 1}（左上 ${k + 1}×${k + 1}）`, { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
          D.G.label(ctx, cx + 14, y + 36, !on ? '待计算（点“下一步”）' : prevFail ? '已否定，无需继续' : `D${k + 1} = ${f3(minors[k])}`, {
            align: 'left', size: 11.5, weight: 800, color: !on ? T['--ink-3'] : ok ? C('--green') : T['--red'], mono: on && !prevFail
          });
          D.G.label(ctx, cx + cw - 16, y + 25, !on ? '—' : prevFail ? '—' : ok ? '> 0 ✓' : '≤ 0 ✗', {
            align: 'right', size: 13, weight: 800, color: ok ? C('--green') : T['--red']
          });
        }
        // 结论
        D.G.box(ctx, cx, 226, cw, 78, { fill: D.withAlpha(vColor, 0.09), stroke: D.withAlpha(vColor, 0.5), radius: 9 });
        D.G.label(ctx, cx + cw / 2, 248, `结论：${verdict}`, { size: 12.5, weight: 800, color: vColor });
        if (eig.length >= 3) {
          D.G.label(ctx, cx + cw / 2, 272, `特征值核对：${eig.map(v => f3(v)).join(', ')}（全正 ⇔ 正定）`, { size: 10.5, color: T['--ink-2'], mono: true });
        } else {
          D.G.label(ctx, cx + cw / 2, 272, '赫尔维茨定理：A 正定 ⇔ 各阶顺序主子式全 > 0', { size: 10.5, color: T['--ink-3'] });
        }
        D.G.label(ctx, cx + cw / 2, 291, failIdx >= 0 ? '只要有一阶 ≤ 0 即可否定正定（必要时提前结束）' : '注意：必须全部 > 0 才能判定正定', { size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['顺序主子式', `D₁ = ${f3(minors[0])}，D₂ = ${f3(minors[1])}，D₃ = ${f3(minors[2])}`],
        ['已算阶数', `${state.step + 1} / 3`],
        ['特征值（核对）', eig.length >= 3 ? eig.map(v => f3(v)).join(', ') : '—'],
        ['结论', allPos ? '正定（D₁ > 0 且 D₂ > 0 且 D₃ > 0）' : failIdx >= 0 ? `不正定（D${failIdx + 1} ≤ 0）` : '待判定']
      ]);
    }
    render();
    return s;
  };

})(window);
