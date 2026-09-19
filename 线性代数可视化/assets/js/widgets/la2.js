/* ============================================================
   la2.js — 第2章 矩阵 可视化组件
   matrixOps：矩阵运算（加、乘、转置、行列式、逆、秩、伴随）
   gaussJordan：初等行变换单步演示
   matrixMultiply：矩阵乘法（行乘列逐项累加）
   blockMatrix：分块矩阵乘法与分块求逆
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C } = UI;

  const det3 = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const fmt = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r); };

  function rankOf(m) {
    const a = m.map(r => r.slice());
    let rank = 0;
    const rows = a.length, cols = a[0].length;
    for (let c = 0; c < cols && rank < rows; c++) {
      let piv = -1;
      for (let r = rank; r < rows; r++) if (Math.abs(a[r][c]) > 1e-9) { piv = r; break; }
      if (piv < 0) continue;
      [a[rank], a[piv]] = [a[piv], a[rank]];
      const pv = a[rank][c];
      for (let r = rank + 1; r < rows; r++) { const f = a[r][c] / pv; for (let k = c; k < cols; k++) a[r][k] -= f * a[rank][k]; }
      rank++;
    }
    return rank;
  }
  function adjugate(m) {
    const c = (r, cc) => {
      const sub = [];
      for (let i = 0; i < 3; i++) if (i !== r) { const row = []; for (let j = 0; j < 3; j++) if (j !== cc) row.push(m[i][j]); sub.push(row); }
      return ((r + cc) % 2 ? -1 : 1) * (sub[0][0] * sub[1][1] - sub[0][1] * sub[1][0]);
    };
    const Cm = [0, 1, 2].map(i => [0, 1, 2].map(j => c(i, j)));
    return [0, 1, 2].map(i => [0, 1, 2].map(j => Cm[j][i]));
  }
  function grid(ctx, x, y, m, cell, T, color) {
    for (let i = 0; i < m.length; i++) for (let j = 0; j < m[0].length; j++) {
      D.G.box(ctx, x + j * cell, y + i * cell, cell - 4, cell - 4, { fill: T['--card-2'], stroke: color || T['--line'], radius: 5 });
      D.G.label(ctx, x + j * cell + (cell - 4) / 2, y + i * cell + (cell - 4) / 2, fmt(m[i][j]),
        { size: Math.min(14, cell - 10), weight: 700, color: T['--ink'], mono: true });
    }
    const w = m[0].length * cell - 4, h = m.length * cell - 4;
    ctx.save(); ctx.strokeStyle = color || T['--line-2']; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 7, y); ctx.lineTo(x - 3, y); ctx.lineTo(x - 3, y + h); ctx.lineTo(x - 7, y + h);
    ctx.moveTo(x + w + 3, y); ctx.lineTo(x + w + 7, y); ctx.lineTo(x + w + 7, y + h); ctx.lineTo(x + w + 3, y + h);
    ctx.stroke(); ctx.restore();
  }

  /* ---------- 矩阵运算 ---------- */
  W.matrixOps = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const A = [[1, 2, 0], [0, 1, 3], [2, 0, 1]];
    const B = [[2, 0, 1], [1, 1, 0], [0, 3, 1]];
    const state = { op: 'AB' };

    UI.seg(ctrl, [
      { label: 'A+B', value: 'A+B' }, { label: 'A−B', value: 'A-B' }, { label: 'AB', value: 'AB' },
      { label: 'Aᵀ', value: 'AT' }, { label: '|A|', value: 'det' }, { label: 'A⁻¹', value: 'inv' },
      { label: 'A*', value: 'adj' }, { label: 'r(A)', value: 'rank' }
    ], v => { state.op = v; render(); }, 2);

    function compute() {
      switch (state.op) {
        case 'A+B': return { title: 'A + B', m: A.map((r, i) => r.map((v, j) => v + B[i][j])), note: '对应元素相加' };
        case 'A-B': return { title: 'A − B', m: A.map((r, i) => r.map((v, j) => v - B[i][j])), note: '对应元素相减' };
        case 'AB': return { title: 'AB（行乘列）', m: A.map(r => [0, 1, 2].map(j => r.reduce((s1, v, k) => s1 + v * B[k][j], 0))), note: '一般 AB ≠ BA，且不满足消去律' };
        case 'AT': return { title: 'Aᵀ', m: [0, 1, 2].map(i => [0, 1, 2].map(j => A[j][i])), note: '(AB)ᵀ = BᵀAᵀ' };
        case 'det': return { title: '|A|', scalar: det3(A), note: '|AB| = |A||B|' };
        case 'inv': {
          const d = det3(A);
          if (Math.abs(d) < 1e-9) return { title: 'A⁻¹', singular: true, note: '|A| = 0，A 不可逆' };
          const adj = adjugate(A);
          return { title: 'A⁻¹ = A* / |A|', m: adj.map(r => r.map(v => v / d)), note: `|A| = ${fmt(d)}` };
        }
        case 'adj': return { title: 'A*（伴随矩阵）', m: adjugate(A), note: 'A* 的元素是代数余子式转置' };
        default: return { title: 'r(A)', scalar: rankOf(A), note: '秩 = 非零子式的最高阶数' };
      }
    }

    function render() {
      const r = compute();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 46;
        D.G.label(ctx, 90 + 1.5 * cell, 22, 'A', { size: 13, weight: 800, color: C('--brand') });
        grid(ctx, 90, 38, A, cell, T, C('--brand'));
        D.G.label(ctx, 90 + 1.5 * cell, 38 + 3 * cell + 16, `|A| = ${fmt(det3(A))}，r(A) = ${rankOf(A)}`, { size: 11, color: T['--ink-3'], mono: true });
        D.G.label(ctx, 300 + 1.5 * cell, 22, 'B', { size: 13, weight: 800, color: C('--purple') });
        grid(ctx, 300, 38, B, cell, T, C('--purple'));
        D.G.label(ctx, 300 + 1.5 * cell, 38 + 3 * cell + 16, `|B| = ${fmt(det3(B))}，r(B) = ${rankOf(B)}`, { size: 11, color: T['--ink-3'], mono: true });

        const rx = p.w - 70 - 3 * cell;
        D.G.label(ctx, rx + 1.5 * cell, 22, r.title, { size: 13, weight: 800, color: C('--green') });
        if (r.m) grid(ctx, rx, 38, r.m, cell, T, C('--green'));
        else {
          D.G.box(ctx, rx, 50, 150, 52, { fill: D.withAlpha(C('--green'), 0.1), stroke: D.withAlpha(C('--green'), 0.5), radius: 8 });
          D.G.label(ctx, rx + 75, 76, String(fmt(r.scalar)), { size: 22, weight: 800, color: C('--green'), mono: true });
        }
        if (r.singular) D.G.label(ctx, rx + 1.5 * cell, 110, '不可逆', { size: 12, weight: 700, color: C('--red') });
        D.G.label(ctx, p.w / 2, p.h - 28, r.note, { size: 11, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['运算', r.title],
        ['结果', r.m ? r.m.map(row => '[' + row.map(fmt).join(' ') + ']').join(' ') : fmt(r.scalar)],
        ['备注', r.note]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 高斯-约当消元 ---------- */
  W.gaussJordan = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const A0 = [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]];
    const steps = [];
    function build() {
      let m = A0.map(r => r.slice());
      const snap = (desc, pivot, rows, note) => steps.push({ m: m.map(r => r.slice()), desc, pivot, rows: rows || [], note: note || '' });
      snap('初始增广矩阵 [A|b]', null, []);
      const pivots = [];
      for (let c = 0; c < 3; c++) {
        let piv = -1;
        for (let r = c; r < 3; r++) if (Math.abs(m[r][c]) > 1e-9) { piv = r; break; }
        if (piv < 0) continue;
        if (piv !== c) { [m[c], m[piv]] = [m[piv], m[c]]; snap(`交换 r${c + 1} ↔ r${piv + 1}，把主元换到对角位置`, [c, c], [c, piv]); }
        const pv = m[c][c];
        if (Math.abs(pv - 1) > 1e-9) {
          m[c] = m[c].map(v => v / pv);
          snap(`r${c + 1} ← r${c + 1} ÷ (${fmt(pv)})，使主元为 1`, [c, c], [c]);
        }
        for (let r = 0; r < 3; r++) {
          if (r === c) continue;
          const f = m[r][c];
          if (Math.abs(f) < 1e-9) continue;
          for (let k = 0; k < 4; k++) m[r][k] -= f * m[c][k];
          snap(`r${r + 1} ← r${r + 1} − (${fmt(f)})·r${c + 1}`, [c, c], [r]);
        }
        pivots.push([c, c]);
      }
      snap('化为简化行阶梯形 [I | x]，右端即解', null, [], 'Ax=b 的唯一解');
    }
    build();
    let i = 0;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });

    function render() {
      const st = steps[i];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 52, x0 = 80, y0 = 44, rows = 3, cols = 4;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const isPivot = st.pivot && st.pivot[0] === r && st.pivot[1] === c;
          const isRow = st.rows.includes(r);
          const sep = c === 3;
          const x = x0 + c * cell + (sep ? 14 : 0);
          D.G.box(ctx, x, y0 + r * cell, cell - 4, cell - 4, {
            fill: isPivot ? D.withAlpha(C('--red'), 0.18) : (isRow ? D.withAlpha(C('--green'), 0.12) : T['--card-2']),
            stroke: isPivot ? C('--red') : (isRow ? C('--green') : T['--line']), width: isPivot ? 1.8 : 1.2, radius: 5
          });
          D.G.label(ctx, x + (cell - 4) / 2, y0 + r * cell + (cell - 4) / 2, fmt(st.m[r][c]),
            { size: 14, weight: 700, color: isPivot ? C('--red') : T['--ink'], mono: true });
        }
        ctx.save(); ctx.strokeStyle = D.withAlpha(T['--ink-3'], 0.6); ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(x0 + 3 * cell + 5, y0 - 6); ctx.lineTo(x0 + 3 * cell + 5, y0 + rows * cell + 2); ctx.stroke(); ctx.restore();
        D.G.label(ctx, x0 + 1.5 * cell, 26, '系数矩阵 A', { size: 11, weight: 700, color: T['--ink-3'] });
        D.G.label(ctx, x0 + 3.5 * cell + 14, 26, 'b', { size: 11, weight: 700, color: T['--ink-3'] });
        D.G.label(ctx, p.w / 2, p.h - 54, st.desc, { size: 12, weight: 700, color: T['--ink'] });
        if (st.note) D.G.label(ctx, p.w / 2, p.h - 32, st.note, { size: 11, color: C('--green') });
        D.G.label(ctx, p.w - 20, 26, `步骤 ${i + 1} / ${steps.length}`, { align: 'right', size: 10.5, color: T['--ink-3'], mono: true });
      });
      scene.render();
      const sol = steps[steps.length - 1].m.map(r => r[3]);
      UI.readout(out, [
        ['当前步骤', st.desc],
        ['r(A), r(A|b)', `${rankOf(A0.map(r => r.slice(0, 3)))}, ${rankOf(A0)}`],
        ['解', `x = ${fmt(sol[0])}, y = ${fmt(sol[1])}, z = ${fmt(sol[2])}`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 矩阵乘法：行乘列逐项累加 ---------- */
  W.matrixMultiply = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const presets = {
      p1: { A: [[1, 2, 3], [0, 1, 2]], B: [[2, 0], [1, 1], [0, 3]] },
      p2: { A: [[2, 0, 1], [1, 3, 2]], B: [[1, 2], [0, 1], [3, 0]] },
      p3: { A: [[1, 1, 0], [2, 1, 3]], B: [[1, 0], [2, 1], [1, 2]] }
    };
    const state = { i: 0, j: 0, t: 0, A: presets.p1.A, B: presets.p1.B };

    UI.seg(ctrl, [
      { label: '数据组 1', value: 'p1' }, { label: '数据组 2', value: 'p2' }, { label: '数据组 3', value: 'p3' }
    ], v => {
      state.A = presets[v].A; state.B = presets[v].B; state.i = 0; state.j = 0;
      iSl.set(0); jSl.set(0); tp.go(0);
    }, 0);
    const iSl = UI.slider(ctrl, { label: '行 i', min: 0, max: 1, step: 1, value: 0, fmt: v => `第 ${v + 1} 行`, onInput: v => { state.i = v; tp.go(0); } });
    const jSl = UI.slider(ctrl, { label: '列 j', min: 0, max: 1, step: 1, value: 0, fmt: v => `第 ${v + 1} 列`, onInput: v => { state.j = v; tp.go(0); } });
    const tp = UI.transport(ctrl, { total: 4, onChange: k => { state.t = k; render(); } });

    function partial(i, j, terms) {
      let sum = 0;
      for (let k = 0; k < terms; k++) sum += state.A[i][k] * state.B[k][j];
      return sum;
    }
    function fullC() {
      return [0, 1].map(i => [0, 1].map(j => partial(i, j, 3)));
    }
    const combo = (i, j, k) => `a${i + 1}${k + 1}·b${k + 1}${j + 1}`;
    const cName = (i, j) => `c${i + 1}${j + 1}`;

    function render() {
      const { i, j, t, A, B } = state;
      const Cm = fullC();
      const sum = partial(i, j, t);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 46;
        const xA = 36, yA = 62, xB = 244, yB = 39, xC = 404, yC = 62;
        // 行 / 列高亮带
        ctx.save();
        ctx.fillStyle = D.withAlpha(C('--brand'), 0.1);
        ctx.fillRect(xA - 6, yA + i * cell - 4, 3 * cell + 8, cell);
        ctx.fillStyle = D.withAlpha(C('--purple'), 0.1);
        ctx.fillRect(xB + j * cell - 4, yB - 6, cell, 3 * cell + 8);
        ctx.restore();
        // A、B、C 表格
        for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
          const on = r === i;
          const done = r === i && c < t;
          const cur = r === i && c === t && t < 3;
          const x = xA + c * cell, y = yA + r * cell;
          D.G.box(ctx, x, y, cell - 4, cell - 4, {
            fill: cur ? D.withAlpha(C('--accent'), 0.28) : done ? D.withAlpha(C('--brand'), 0.18) : on ? D.withAlpha(C('--brand'), 0.1) : T['--card-2'],
            stroke: cur ? C('--accent') : on ? C('--brand') : T['--line'], width: on ? 1.6 : 1.1, radius: 5
          });
          D.G.label(ctx, x + (cell - 4) / 2, y + (cell - 4) / 2, fmt(A[r][c]), { size: 13.5, weight: 700, color: T['--ink'], mono: true });
        }
        for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
          const on = c === j;
          const done = c === j && r < t;
          const cur = c === j && r === t && t < 3;
          const x = xB + c * cell, y = yB + r * cell;
          D.G.box(ctx, x, y, cell - 4, cell - 4, {
            fill: cur ? D.withAlpha(C('--accent'), 0.28) : done ? D.withAlpha(C('--purple'), 0.18) : on ? D.withAlpha(C('--purple'), 0.1) : T['--card-2'],
            stroke: cur ? C('--accent') : on ? C('--purple') : T['--line'], width: on ? 1.6 : 1.1, radius: 5
          });
          D.G.label(ctx, x + (cell - 4) / 2, y + (cell - 4) / 2, fmt(B[r][c]), { size: 13.5, weight: 700, color: T['--ink'], mono: true });
        }
        for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
          const target = r === i && c === j;
          const x = xC + c * cell, y = yC + r * cell;
          D.G.box(ctx, x, y, cell - 4, cell - 4, {
            fill: target ? D.withAlpha(C('--green'), 0.18) : T['--card-2'],
            stroke: target ? C('--green') : T['--line'], width: target ? 1.8 : 1.1, radius: 5
          });
          D.G.label(ctx, x + (cell - 4) / 2, y + (cell - 4) / 2 - 4, target ? fmt(sum) : fmt(Cm[r][c]),
            { size: 13.5, weight: 700, color: target ? C('--green') : T['--ink-3'], mono: true });
          if (target && t < 3) D.G.label(ctx, x + (cell - 4) / 2, y + (cell - 4) / 2 + 11, '累加中', { size: 8.5, color: C('--accent') });
        }
        D.G.label(ctx, xA + 1.5 * cell, 24, `A（2×3）第 ${i + 1} 行`, { size: 11, weight: 700, color: C('--brand') });
        D.G.label(ctx, xB + cell, 20, `B（3×2）第 ${j + 1} 列`, { size: 11, weight: 700, color: C('--purple') });
        D.G.label(ctx, xC + cell, 24, `C = AB（2×2）`, { size: 11, weight: 700, color: C('--green') });
        D.G.label(ctx, (xA + 3 * cell + xB) / 2 + 4, yA + cell - 4, '×', { size: 20, weight: 800, color: T['--ink-3'] });
        D.G.label(ctx, (xB + 2 * cell + xC) / 2 + 2, yC + cell - 4, '=', { size: 20, weight: 800, color: T['--ink-3'] });
        // 累加面板
        const lines = [`计算 ${cName(i, j)}：A 的第 ${i + 1} 行 × B 的第 ${j + 1} 列`];
        for (let k = 0; k < 3; k++) {
          const mark = k < t ? '✓' : (k === t && t < 3 ? '▶' : '·');
          lines.push(`${mark} ${combo(i, j, k)} = ${fmt(A[i][k])} × ${fmt(B[k][j])} = ${fmt(A[i][k] * B[k][j])}`);
        }
        lines.push(`${cName(i, j)} = ${fmt(sum)}${t < 3 ? '（点“下一步”继续累加）' : '（累加完成）'}`);
        D.G.box(ctx, 16, p.h - 136, p.w - 32, 124, { fill: D.withAlpha(C('--green'), 0.07), stroke: D.withAlpha(C('--green'), 0.35), radius: 9 });
        lines.forEach((line, k) => D.G.label(ctx, p.w / 2, p.h - 116 + k * 22, line, {
          size: k === 0 ? 12 : 11.5, weight: k === 0 ? 800 : 600,
          color: k === 0 ? C('--green') : (k === lines.length - 1 ? C('--accent') : T['--ink-2']), mono: k > 0
        }));
      });
      scene.render();
      UI.readout(out, [
        ['公式', `${cName(i, j)} = ${combo(i, j, 0)} + ${combo(i, j, 1)} + ${combo(i, j, 2)}`],
        ['当前累加值', `${fmt(sum)}（共 3 项，已累加 ${t} 项）`],
        ['C 的全部元素', Cm.map(row => '[' + row.map(fmt).join('  ') + ']').join('  ')],
        ['说明', 'AB 为 2×2 而 BA 为 3×3，形状不同 ⇒ 矩阵乘法一般不可交换']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 分块矩阵：分块乘法与分块求逆 ---------- */
  W.blockMatrix = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'mul', step: 0 };
    const A4 = [[1, 2, 3, 1], [0, 1, 1, 2], [2, 0, 1, 0], [1, 1, 0, 3]];
    const B4 = [[1, 0, 2, 1], [2, 1, 1, 0], [0, 1, 1, 2], [1, 2, 0, 1]];
    const T4 = [[2, 1, 1, 0], [1, 1, 1, 1], [0, 0, 1, 2], [0, 0, 0, 1]];

    function slice2(M, bi, bj) {
      return [[M[bi * 2][bj * 2], M[bi * 2][bj * 2 + 1]], [M[bi * 2 + 1][bj * 2], M[bi * 2 + 1][bj * 2 + 1]]];
    }
    function blocksOf(M) { return [[slice2(M, 0, 0), slice2(M, 0, 1)], [slice2(M, 1, 0), slice2(M, 1, 1)]]; }
    function mul2(X, Y) {
      return [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]],
      [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
    }
    function add2(X, Y) { return [[X[0][0] + Y[0][0], X[0][1] + Y[0][1]], [X[1][0] + Y[1][0], X[1][1] + Y[1][1]]]; }
    function neg2(X) { return [[-X[0][0], -X[0][1]], [-X[1][0], -X[1][1]]]; }
    function det2(X) { return X[0][0] * X[1][1] - X[0][1] * X[1][0]; }
    function inv2(X) {
      const d = det2(X);
      if (Math.abs(d) < 1e-9) return null;
      return [[X[1][1] / d, -X[0][1] / d], [-X[1][0] / d, X[0][0] / d]];
    }
    function mul4(X, Y) {
      return [0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => {
        let v = 0;
        for (let k = 0; k < 4; k++) v += X[i][k] * Y[k][j];
        return v;
      }));
    }
    function assemble(B) {
      const M = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
      for (let bi = 0; bi < 2; bi++) for (let bj = 0; bj < 2; bj++) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) M[bi * 2 + i][bj * 2 + j] = B[bi][bj][i][j];
      return M;
    }
    function grid4(ctx, T, x0, y0, cell, M, o) {
      o = o || {};
      const hilite = o.hilite || [];
      const inHl = (i, j) => hilite.find(h => h[0] === i && h[1] === j);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const x = x0 + j * cell + (j >= 2 ? 4 : 0);
        const y = y0 + i * cell + (i >= 2 ? 4 : 0);
        const val = M ? M[i][j] : null;
        const hl = inHl(i, j);
        const col = hl ? hl[2] : null;
        D.G.box(ctx, x, y, cell - 4, cell - 4, {
          fill: val === null ? D.withAlpha(T['--line'], 0.4) : (col ? D.withAlpha(col, 0.18) : T['--card-2']),
          stroke: col || T['--line'], width: col ? 1.6 : 1.1, radius: 4, dash: val === null ? [3, 3] : null
        });
        if (val !== null) D.G.label(ctx, x + (cell - 4) / 2, y + (cell - 4) / 2, fmt(val), { size: Math.min(12.5, cell - 9), weight: 700, color: T['--ink'], mono: true });
      }
      if (o.blocks !== false) {
        for (let bi = 0; bi < 2; bi++) for (let bj = 0; bj < 2; bj++) {
          const hb = (o.blockHl || []).find(h => h[0] === bi && h[1] === bj);
          const x = x0 + bj * (2 * cell + 4) - 3, y = y0 + bi * (2 * cell + 4) - 3;
          const w = 2 * cell + 2;
          D.G.box(ctx, x, y, w, w, {
            fill: hb ? D.withAlpha(hb[2], 0.1) : null,
            stroke: D.withAlpha(hb ? hb[2] : C('--teal'), hb ? 0.9 : 0.35), width: hb ? 1.8 : 1.2, radius: 6, dash: [5, 3]
          });
        }
      }
    }
    function blockTag(ctx, T, x0, y0, cell, bi, bj, label, color) {
      const x = x0 + bj * (2 * cell + 4) + cell + 1;
      const y = bi === 0 ? y0 - 9 : y0 + 2 * cell - 1;
      D.G.label(ctx, x, y, label, { size: 9.5, weight: 800, color, mono: true });
    }
    function miniGrid(ctx, T, x0, y0, cell, M, label, color) {
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
        D.G.box(ctx, x0 + j * cell, y0 + i * cell, cell - 3, cell - 3, {
          fill: D.withAlpha(color, 0.1), stroke: D.withAlpha(color, 0.75), width: 1.1, radius: 4
        });
        D.G.label(ctx, x0 + j * cell + (cell - 3) / 2, y0 + i * cell + (cell - 3) / 2, fmt(M[i][j]),
          { size: Math.min(10.5, cell - 6), weight: 700, color: T['--ink'], mono: true });
      }
      if (label) D.G.label(ctx, x0 + cell - 1, y0 + 2 * cell + 9, label, { size: 10, weight: 700, color, mono: true });
    }

    const mulSteps = [
      { desc: 'A、B 按 2×2 分块：A 的列分法与 B 的行分法一致，子块间可按矩阵乘法相乘', ta: [], tb: [], t: null },
      { desc: 'C₁₁ = A₁₁B₁₁ + A₁₂B₂₁', ta: [[0, 0], [0, 1]], tb: [[0, 0], [1, 0]], t: [0, 0] },
      { desc: 'C₁₂ = A₁₁B₁₂ + A₁₂B₂₂', ta: [[0, 0], [0, 1]], tb: [[0, 1], [1, 1]], t: [0, 1] },
      { desc: 'C₂₁ = A₂₁B₁₁ + A₂₂B₂₁', ta: [[1, 0], [1, 1]], tb: [[0, 0], [1, 0]], t: [1, 0] },
      { desc: 'C₂₂ = A₂₁B₁₂ + A₂₂B₂₂', ta: [[1, 0], [1, 1]], tb: [[0, 1], [1, 1]], t: [1, 1] },
      { desc: '四个子块全部算出，与 4×4 整体相乘的结果一致', ta: [], tb: [], t: null }
    ];
    const invSteps = [
      { title: '① 分块：A = [[P, Q], [O, S]]', body: '左下为零块 O ⇒ A 可逆 ⇔ P、S 均可逆，且 |A| = |P|·|S|', fill: [] },
      { title: '② 求左上块 P 的逆', body: '二阶口诀：主对角线对调、副对角线变号，再除以 |P|', fill: ['P'] },
      { title: '③ 求右下块 S 的逆', body: '同理 S⁻¹ = (1/|S|)·[[d, −b], [−c, a]]', fill: ['P', 'S'] },
      { title: '④ 求右上块', body: '右上块 = −P⁻¹QS⁻¹：先左乘 P⁻¹、再右乘 S⁻¹，顺序不能颠倒', fill: ['P', 'S', 'Q'] },
      { title: '⑤ 组装 A⁻¹', body: 'A⁻¹ = [[P⁻¹, −P⁻¹QS⁻¹], [O, S⁻¹]]，零块的逆仍是 O', fill: ['P', 'S', 'Q', 'O'] },
      { title: '⑥ 验证 A·A⁻¹ = E', body: '对角线全为 1、其余全为 0；分块求逆把 4×4 的逆化为两个 2×2 的逆', fill: ['P', 'S', 'Q', 'O'] }
    ];

    UI.seg(ctrl, [{ label: '分块乘法', value: 'mul' }, { label: '分块求逆', value: 'inv' }], v => { state.mode = v; state.step = 0; tp.go(0); }, 0);
    const tp = UI.transport(ctrl, { total: 6, onChange: k => { state.step = k; render(); } });
    UI.note(host, '分块的实质是把高阶矩阵降成低阶矩阵：子块当作“数”参与乘法，但顺序不可交换，且左矩阵列的分法要与右矩阵行的分法一致。');

    const AB = blocksOf(A4), BB = blocksOf(B4);
    const PB = blocksOf(T4);

    function render() {
      const isMul = state.mode === 'mul';
      const steps = isMul ? mulSteps : invSteps;
      const st = steps[Math.min(state.step, steps.length - 1)];
      const cell = 30;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const xL = 16, y0 = 52, xR = 176;
        const colorOf = (bi, bj) => [C('--teal'), C('--green'), C('--purple'), C('--accent')][bi * 2 + bj];
        if (isMul) {
          const t = st.t;
          const Ahl = [], Bhl = [], Chl = [], blockHlA = [], blockHlB = [], blockHlC = [];
          if (t) {
            st.ta.forEach(([bi, bj]) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) Ahl.push([bi * 2 + i, bj * 2 + j, C('--green')]); blockHlA.push([bi, bj, C('--green')]); });
            st.tb.forEach(([bi, bj]) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) Bhl.push([bi * 2 + i, bj * 2 + j, C('--purple')]); blockHlB.push([bi, bj, C('--purple')]); });
            for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) Chl.push([t[0] * 2 + i, t[1] * 2 + j, C('--red')]);
            blockHlC.push([t[0], t[1], C('--red')]);
          }
          const doneBlocks = state.step >= 1 ? state.step : 0;
          const Cpart = [0, 1, 2, 3].map(() => [null, null, null, null]);
          for (let bi = 0; bi < 2; bi++) for (let bj = 0; bj < 2; bj++) {
            const idx = bi * 2 + bj + 1;
            if (idx <= doneBlocks || state.step === 5) {
              const t1 = mul2(AB[bi][0], BB[0][bj]);
              const t2 = mul2(AB[bi][1], BB[1][bj]);
              const cij = add2(t1, t2);
              for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) Cpart[bi * 2 + i][bj * 2 + j] = cij[i][j];
            }
          }
          grid4(ctx, T, xL, y0, cell, A4, { hilite: Ahl, blockHl: blockHlA });
          grid4(ctx, T, xR, y0, cell, B4, { hilite: Bhl, blockHl: blockHlB });
          D.G.label(ctx, xL + 58, 18, 'A（4×4，按 2×2 分块）', { size: 11, weight: 700, color: T['--ink-2'] });
          D.G.label(ctx, xR + 58, 18, 'B', { size: 11, weight: 700, color: T['--ink-2'] });
          const pxl = p.w - 348;
          D.G.box(ctx, pxl - 10, 26, 348, 140, { fill: T['--card-2'], stroke: D.withAlpha(T['--line'], 0.9), radius: 9 });
          if (t) {
            const t1 = mul2(AB[st.ta[0][0]][st.ta[0][1]], BB[st.tb[0][0]][st.tb[0][1]]);
            const t2 = mul2(AB[st.ta[1][0]][st.ta[1][1]], BB[st.tb[1][0]][st.tb[1][1]]);
            const cij = add2(t1, t2);
            D.G.label(ctx, pxl + 4, 44, `${st.desc}`, { align: 'left', size: 12, weight: 800, color: C('--red') });
            miniGrid(ctx, T, pxl + 4, 58, 24, t1, 'A' + (st.ta[0][0] + 1) + (st.ta[0][1] + 1) + 'B' + (st.tb[0][0] + 1) + (st.tb[0][1] + 1), C('--green'));
            D.G.label(ctx, pxl + 61, 82, '+', { size: 16, weight: 800, color: T['--ink-3'] });
            miniGrid(ctx, T, pxl + 76, 58, 24, t2, 'A' + (st.ta[1][0] + 1) + (st.ta[1][1] + 1) + 'B' + (st.tb[1][0] + 1) + (st.tb[1][1] + 1), C('--purple'));
            D.G.label(ctx, pxl + 133, 82, '=', { size: 16, weight: 800, color: T['--ink-3'] });
            miniGrid(ctx, T, pxl + 148, 58, 24, cij, 'C' + (st.t[0] + 1) + (st.t[1] + 1), C('--red'));
            D.G.label(ctx, pxl + 210, 70, '子块相乘后再相加', { align: 'left', size: 10.5, color: T['--ink-2'] });
            D.G.label(ctx, pxl + 210, 92, '子块顺序不可交换', { align: 'left', size: 10.5, color: T['--ink-3'] });
            D.G.label(ctx, pxl + 210, 112, 'A 的列分法 = B 的行分法', { align: 'left', size: 10.5, color: T['--ink-3'] });
            D.G.label(ctx, pxl + 210, 132, '（对应分块才能直接相乘）', { align: 'left', size: 10, color: T['--ink-3'] });
          } else {
            const lines = state.step === 0 ? [
              'A、B 各按 2×2 分块，子块与子块同型',
              'A 的列分法 = B 的行分法（相容条件）',
              '子块当作“数”参与乘法，但顺序不可交换'
            ] : [
              '四个子块全部算出：C₁₁、C₁₂、C₂₁、C₂₂',
              '与 4×4 整体相乘的结果完全一致 ✓',
              '分块乘法一共只做 8 次 2×2 乘法'
            ];
            D.G.label(ctx, pxl + 12, 54, lines[0], { align: 'left', size: 11.5, weight: 800, color: C('--red') });
            D.G.label(ctx, pxl + 12, 82, lines[1], { align: 'left', size: 11, color: T['--ink-2'] });
            D.G.label(ctx, pxl + 12, 108, lines[2], { align: 'left', size: 11, color: T['--ink-2'] });
            D.G.label(ctx, pxl + 12, 136, 'C₁₁ = A₁₁B₁₁ + A₁₂B₂₁　C₂₂ = A₂₁B₁₂ + A₂₂B₂₂', { align: 'left', size: 10.5, color: C('--accent'), mono: true });
          }
          const Cy = 200;
          D.G.label(ctx, xL + 58, Cy - 12, state.step === 5 ? 'C = AB（分块结果，已与整体相乘核对）' : 'C 的分块结果（逐步填充）', { size: 10.5, weight: 700, color: C('--green') });
          grid4(ctx, T, xL, Cy, cell, Cpart, { hilite: Chl, blockHl: blockHlC, blocks: true });
          const direct = mul4(A4, B4);
          let maxDiff = 0;
          for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if (Cpart[i][j] !== null) maxDiff = Math.max(maxDiff, Math.abs(Cpart[i][j] - direct[i][j]));
          const rows = [];
          rows.push(state.step === 5 ? `核对：max|Cᵢⱼ − (AB)ᵢⱼ| = ${fmt(maxDiff)} ✓` : '继续点击“下一步”，逐个算出四个子块');
          if (state.step === 5) rows.push('分块乘法把 4×4 拆成 8 次 2×2 乘法');
          rows.forEach((line, k) => D.G.label(ctx, p.w - 20, Cy + 20 + k * 22, line, { align: 'right', size: 11.5, weight: k === 0 ? 800 : 600, color: k === 0 ? C('--green') : T['--ink-3'] }));
          D.G.label(ctx, p.w - 20, Cy + 84, '上三角块为 C₁₁、C₁₂；下三角块为 C₂₁、C₂₂', { align: 'right', size: 10, color: T['--ink-3'] });
        } else {
          const build = (step) => {
            const v = [0, 1, 2, 3].map(() => [null, null, null, null]);
            const put = (bi, bj, M) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) v[bi * 2 + i][bj * 2 + j] = M ? M[i][j] : null; };
            const P = PB[0][0], Q = PB[0][1], S = PB[1][1];
            if (step >= 1) put(0, 0, inv2(P));
            if (step >= 2) put(1, 1, inv2(S));
            if (step >= 3) put(0, 1, neg2(mul2(mul2(inv2(P), Q), inv2(S))));
            if (step >= 4) put(1, 0, [[0, 0], [0, 0]]);
            return { m: T4.map(r => r.slice()), inv: v };
          };
          const stM = build(state.step);
          const hlLeft = [[0, 0, C('--brand')], [0, 1, C('--purple')], [1, 0, C('--ink-3')], [1, 1, C('--green')]];
          grid4(ctx, T, xL, y0, cell, stM.m, { blockHl: hlLeft });
          D.G.label(ctx, xL + 58, 18, 'A = [[P, Q], [O, S]]（4×4）', { size: 11, weight: 700, color: T['--ink-2'] });
          blockTag(ctx, T, xL, y0, cell, 0, 0, 'P', C('--brand'));
          blockTag(ctx, T, xL, y0, cell, 0, 1, 'Q', C('--purple'));
          blockTag(ctx, T, xL, y0, cell, 1, 0, 'O', C('--ink-3'));
          blockTag(ctx, T, xL, y0, cell, 1, 1, 'S', C('--green'));
          grid4(ctx, T, xR, y0, cell, stM.inv, {});
          D.G.label(ctx, xR + 58, 18, 'A⁻¹ 的逐块组装', { size: 11, weight: 700, color: C('--red') });
          blockTag(ctx, T, xR, y0, cell, 0, 0, 'P⁻¹', C('--brand'));
          blockTag(ctx, T, xR, y0, cell, 0, 1, '−P⁻¹QS⁻¹', C('--purple'));
          blockTag(ctx, T, xR, y0, cell, 1, 0, 'O', C('--ink-3'));
          blockTag(ctx, T, xR, y0, cell, 1, 1, 'S⁻¹', C('--green'));
          const pxl = p.w - 348;
          D.G.box(ctx, pxl - 10, 26, 348, 140, { fill: T['--card-2'], stroke: D.withAlpha(T['--line'], 0.9), radius: 9 });
          D.G.label(ctx, pxl + 10, 44, st.title, { align: 'left', size: 11.5, weight: 800, color: C('--red') });
          D.G.label(ctx, pxl + 10, 64, st.body, { align: 'left', size: 10.5, color: T['--ink-2'] });
          const P = PB[0][0], Q = PB[0][1], S = PB[1][1];
          const Pi = inv2(P), Si = inv2(S), Up = neg2(mul2(mul2(Pi, Q), Si));
          if (state.step === 0) {
            D.G.label(ctx, pxl + 174, 110, `|P| = ${fmt(det2(P))}，|S| = ${fmt(det2(S))}，|A| = |P||S| = ${fmt(det2(P) * det2(S))}`, { size: 11.5, weight: 700, color: C('--accent'), mono: true });
          } else if (state.step === 1) {
            miniGrid(ctx, T, pxl + 10, 92, 22, P, 'P', C('--brand'));
            D.G.label(ctx, pxl + 58, 114, '→', { size: 14, weight: 800, color: T['--ink-3'] });
            miniGrid(ctx, T, pxl + 76, 92, 22, Pi, 'P⁻¹', C('--brand'));
            D.G.label(ctx, pxl + 190, 116, `|P| = ${fmt(det2(P))}`, { size: 13, weight: 800, color: C('--brand'), mono: true });
          } else if (state.step === 2) {
            miniGrid(ctx, T, pxl + 10, 92, 22, S, 'S', C('--green'));
            D.G.label(ctx, pxl + 58, 114, '→', { size: 14, weight: 800, color: T['--ink-3'] });
            miniGrid(ctx, T, pxl + 76, 92, 22, Si, 'S⁻¹', C('--green'));
            D.G.label(ctx, pxl + 190, 116, `|S| = ${fmt(det2(S))}`, { size: 13, weight: 800, color: C('--green'), mono: true });
          } else if (state.step === 3) {
            miniGrid(ctx, T, pxl + 10, 92, 22, mul2(Pi, Q), 'P⁻¹Q', C('--purple'));
            D.G.label(ctx, pxl + 60, 114, '·', { size: 14, weight: 800, color: T['--ink-3'] });
            miniGrid(ctx, T, pxl + 78, 92, 22, Si, 'S⁻¹', C('--green'));
            D.G.label(ctx, pxl + 128, 114, '=', { size: 14, weight: 800, color: T['--ink-3'] });
            miniGrid(ctx, T, pxl + 146, 92, 22, Up, '−P⁻¹QS⁻¹', C('--purple'));
          } else {
            const Ainv = assemble([[Pi, Up], [[[0, 0], [0, 0]], Si]]);
            const prod = mul4(T4, Ainv);
            for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
              const x = pxl + 128 + j * 23, y = 86 + i * 23;
              D.G.box(ctx, x, y, 20, 20, { fill: D.withAlpha(i === j ? C('--green') : T['--line'], i === j ? 0.25 : 0.35), stroke: D.withAlpha(i === j ? C('--green') : T['--line-2'], 0.8), width: 1, radius: 3 });
              D.G.label(ctx, x + 10, y + 10, fmt(prod[i][j]), { size: 9.5, weight: 700, color: i === j ? C('--green') : T['--ink-3'], mono: true });
            }
            D.G.label(ctx, pxl + 14, 150, '最大残差', { align: 'left', size: 10, color: T['--ink-3'] });
            D.G.label(ctx, pxl + 66, 150, `${fmt(Math.max(...prod.map((r, i) => Math.max(...r.map((v, j) => Math.abs(v - (i === j ? 1 : 0)))))))}`, { align: 'left', size: 11, weight: 800, color: C('--green'), mono: true });
          }
        }
      });
      scene.render();
      const isMul2 = state.mode === 'mul';
      if (isMul2) {
        const direct = mul4(A4, B4);
        UI.readout(out, [
          ['模式', '分块乘法：C = AB 的四个子块'],
          ['当前步骤', mulSteps[Math.min(state.step, 5)].desc],
          ['C（整体相乘）', direct.map(r => '[' + r.map(fmt).join(' ') + ']').join(' ')],
          ['要点', '左矩阵列的分法必须与右矩阵行的分法一致；子块相乘顺序不可交换']
        ]);
      } else {
        const P = PB[0][0], Q = PB[0][1], S = PB[1][1];
        const Pi = inv2(P), Si = inv2(S), Up = neg2(mul2(mul2(Pi, Q), Si));
        const Ainv = assemble([[Pi, Up], [[[0, 0], [0, 0]], Si]]);
        const prod = mul4(T4, Ainv);
        let bad = 0;
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) bad = Math.max(bad, Math.abs(prod[i][j] - (i === j ? 1 : 0)));
        UI.readout(out, [
          ['模式', '分块求逆：A = [[P, Q], [O, S]]'],
          ['当前步骤', invSteps[Math.min(state.step, 5)].title + '：' + invSteps[Math.min(state.step, 5)].body],
          ['|P|, |S|, |A|', `${fmt(det2(P))}, ${fmt(det2(S))}, ${fmt(det2(P) * det2(S))}`],
          ['A⁻¹（分块）', Ainv.map(r => '[' + r.map(fmt).join(' ') + ']').join(' ')],
          ['验证 max|AA⁻¹ − E|', `${fmt(bad)} ${bad < 1e-9 ? '✓' : '✗'}`]
        ]);
      }
    }
    render();
    return s;
  };

})(window);
