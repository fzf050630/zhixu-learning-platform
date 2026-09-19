/* ============================================================
   la4.js — 第4章 线性方程组 可视化组件
   gaussSolve：高斯消元解线性方程组
   solutionStructure：解的结构（齐次基础解系 / 非齐次通解）
   solutionSpace：齐次方程组解空间（维数 n − r 与张成几何体）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C } = UI;
  const f3 = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r); };

  function rowReduce(M) {
    const m = M.map(r => r.slice());
    const pivots = [];
    let rank = 0;
    const rows = m.length, cols = m[0].length;
    for (let c = 0; c < cols && rank < rows; c++) {
      let piv = -1;
      for (let r = rank; r < rows; r++) if (Math.abs(m[r][c]) > 1e-9) { piv = r; break; }
      if (piv < 0) continue;
      [m[rank], m[piv]] = [m[piv], m[rank]];
      const pv = m[rank][c];
      for (let k = c; k < cols; k++) m[rank][k] = m[rank][k] / pv;
      for (let r = 0; r < rows; r++) {
        if (r === rank) continue;
        const f = m[r][c];
        if (Math.abs(f) < 1e-9) continue;
        for (let k = c; k < cols; k++) m[r][k] -= f * m[rank][k];
      }
      pivots.push(c);
      rank++;
    }
    return { m, pivots, rank };
  }

  /* ---------- 高斯消元求解 ---------- */
  W.gaussSolve = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { aug: [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]] };

    UI.seg(ctrl, [
      { label: '预设：唯一解', value: 'uniq' },
      { label: '预设：无穷多解', value: 'inf' },
      { label: '预设：无解', value: 'none' }
    ], v => {
      if (v === 'uniq') state.aug = [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]];
      if (v === 'inf') state.aug = [[1, 1, -1, 1], [2, 2, -2, 2], [1, -1, 1, 3]];
      if (v === 'none') state.aug = [[1, 1, 1, 1], [1, 1, 1, 2], [2, 2, 2, 3]];
      render();
    }, 0);
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(4, auto)';
    grid.style.gap = '4px';
    ctrl.appendChild(grid);
    const inputs = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
      const inp = UI.number(grid, { label: '', value: state.aug[i][j], min: -9, max: 9, step: 1, width: 48 });
      inp.onChange(v => { state.aug[i][j] = Number.isFinite(v) ? v : 0; render(); });
      inputs.push(inp);
    }
    ['x', 'y', 'z', 'b'].forEach(t => {
      const l = document.createElement('div');
      l.textContent = t;
      l.style.textAlign = 'center';
      l.style.fontSize = '11px';
      l.style.color = 'var(--ink-3)';
      ctrl.appendChild(l);
    });

    function render() {
      const { m, pivots, rank } = rowReduce(state.aug);
      const rankA = rowReduce(state.aug.map(r => r.slice(0, 3))).rank;
      const rankAug = rank;
      let caseText, solution = [];
      if (rankA < rankAug) { caseText = 'r(A) < r(A|b)：无解'; }
      else if (rankA === 3) {
        caseText = 'r(A) = r(A|b) = 3 = n：唯一解';
        solution = pivots.slice(0, 3).map((c, i) => m[i][3]);
      } else {
        caseText = `r(A) = r(A|b) = ${rankA} < n = 3：无穷多解，自由变量 ${3 - rankA} 个`;
      }
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 48, x0 = 70, y0 = 46;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
          const on = pivots.includes(j) && i < rank;
          const x = x0 + j * cell + (j === 3 ? 14 : 0);
          D.G.box(ctx, x, y0 + i * cell, cell - 4, cell - 4, {
            fill: on ? D.withAlpha(C('--red'), 0.14) : T['--card-2'],
            stroke: on ? C('--red') : T['--line'], width: on ? 1.6 : 1.1, radius: 5
          });
          D.G.label(ctx, x + (cell - 4) / 2, y0 + i * cell + (cell - 4) / 2, f3(m[i][j]),
            { size: 13, weight: 700, color: on ? C('--red') : T['--ink'], mono: true });
        }
        ctx.save(); ctx.strokeStyle = D.withAlpha(T['--ink-3'], 0.6); ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(x0 + 3 * cell + 5, y0 - 6); ctx.lineTo(x0 + 3 * cell + 5, y0 + 3 * cell + 2); ctx.stroke(); ctx.restore();
        D.G.label(ctx, p.w / 2 + 80, 30, '行简化阶梯形', { size: 11, weight: 700, color: T['--ink-3'] });
        const lines = [
          `r(A) = ${rankA}`,
          `r(A|b) = ${rankAug}`,
          `n = 3（未知数个数）`,
          caseText
        ];
        lines.forEach((t, k) => D.G.label(ctx, x0 + 250, 60 + k * 26, t, { align: 'left', size: 12, weight: k === 3 ? 700 : 500, color: k === 3 ? C('--brand') : T['--ink-2'], mono: k < 3 }));
        if (solution.length) {
          D.G.box(ctx, 16, p.h - 52, p.w - 32, 38, { fill: D.withAlpha(C('--green'), 0.1), stroke: D.withAlpha(C('--green'), 0.5), radius: 8 });
          D.G.label(ctx, p.w / 2, p.h - 33, `x = ${f3(solution[0])},  y = ${f3(solution[1])},  z = ${f3(solution[2])}`, { size: 14, weight: 800, color: C('--green'), mono: true });
        }
      });
      scene.render();
      UI.readout(out, [
        ['r(A)', String(rankA)],
        ['r(A|b)', String(rankAug)],
        ['解的情况', caseText],
        ['解', solution.length ? solution.map(f3).join(', ') : '—']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 解的结构 ---------- */
  W.solutionStructure = function (host) {
    const s = UI.shell(host, 310);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'hom', A: [[1, 2, -1], [2, 4, -1], [1, 2, 1]], b: [1, 3, 0] };
    UI.seg(ctrl, [{ label: '齐次 Ax = 0', value: 'hom' }, { label: '非齐次 Ax = b', value: 'inhom' }], v => { state.mode = v; render(); }, 0);
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(4, auto)';
    grid.style.gap = '4px';
    ctrl.appendChild(grid);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
      const inp = UI.number(grid, { label: '', value: j < 3 ? state.A[i][j] : state.b[i], min: -9, max: 9, step: 1, width: 46 });
      inp.onChange(v => { if (j < 3) state.A[i][j] = Number.isFinite(v) ? v : 0; else state.b[i] = Number.isFinite(v) ? v : 0; render(); });
    }

    function solve() {
      const aug = state.A.map((r, i) => r.concat([state.mode === 'hom' ? 0 : state.b[i]]));
      const { m, pivots, rank } = rowReduce(aug);
      const rankA = rowReduce(state.A.map(r => r.slice())).rank;
      const free = [0, 1, 2].filter(c => !pivots.includes(c));
      // 齐次基础解系
      const basis = [];
      free.forEach(f => {
        const v = [0, 0, 0];
        v[f] = 1;
        pivots.forEach((c, i) => { v[c] = -m[i][f]; });
        basis.push(v);
      });
      // 特解
      const particular = pivots.length ? pivots.map((c, i) => m[i][3]) : [0, 0, 0];
      return { rankA, rankAug: rank, free, basis, particular };
    }

    function render() {
      const r = solve();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 44, x0 = 60, y0 = 52;
        // 矩阵展示
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          const on = r.free.includes(j);
          D.G.box(ctx, x0 + j * cell, y0 + i * cell, cell - 4, cell - 4, {
            fill: on ? D.withAlpha(C('--accent'), 0.12) : T['--card-2'],
            stroke: on ? C('--accent') : T['--line'], radius: 5
          });
          D.G.label(ctx, x0 + j * cell + (cell - 4) / 2, y0 + i * cell + (cell - 4) / 2, String(state.A[i][j]), { size: 12.5, weight: 700, color: T['--ink'], mono: true });
        }
        D.G.label(ctx, x0 + 1.5 * cell, 34, state.mode === 'hom' ? 'A（齐次）' : 'A（非齐次）', { size: 11.5, weight: 700, color: T['--ink-3'] });
        D.G.label(ctx, x0 + 3 * cell + 20, y0 + 1.5 * cell, state.mode === 'hom' ? '0' : `b = (${state.b.join(', ')})`, { align: 'left', size: 11.5, color: C('--brand'), mono: true });
        // 解空间示意
        const ox = p.w / 2 + 110, oy = p.h / 2 + 6, sc = 34;
        const P = v => [ox + v[0] * sc, oy - v[1] * sc];
        ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.8); ctx.beginPath();
        ctx.moveTo(ox - 110, oy); ctx.lineTo(ox + 110, oy); ctx.moveTo(ox, oy - 90); ctx.lineTo(ox, oy + 90); ctx.stroke(); ctx.restore();
        const O = P([0, 0]);
        // 基础解系
        r.basis.forEach((v, i) => {
          const q = P([v[0] * 1.4, v[1] * 1.4]);
          D.G.arrow(ctx, [O, q], { color: [C('--brand'), C('--purple')][i % 2], width: 2.4, head: 7 });
          D.G.label(ctx, q[0] + 6, q[1] - 6, 'ξ' + (i + 1), { align: 'left', size: 11.5, weight: 800, color: [C('--brand'), C('--purple')][i % 2] });
        });
        if (state.mode === 'inhom' && r.rankA === r.rankAug) {
          const q = P([r.particular[0], r.particular[1]]);
          D.G.dot(ctx, q[0], q[1], 5, C('--red'));
          D.G.label(ctx, q[0] + 8, q[1] + 12, 'η（特解）', { align: 'left', size: 11, weight: 800, color: C('--red') });
          r.basis.forEach((v, i) => {
            const q2 = P([r.particular[0] + v[0] * 1.4, r.particular[1] + v[1] * 1.4]);
            D.G.arrow(ctx, [q, q2], { color: D.withAlpha(C('--green'), 0.8), width: 1.6, dash: [4, 4] });
          });
          D.G.label(ctx, ox, oy + 96, '非齐次解集 = 特解 + 齐次通解（不经过原点的“平移”解集）', { size: 10, color: T['--ink-3'] });
        } else {
          D.G.label(ctx, ox, oy + 96, '齐次解集是过原点的子空间（解空间）', { size: 10, color: T['--ink-3'] });
        }
        const info = [
          `r(A) = ${r.rankA}`,
          `n = 3`,
          `dim N(A) = n − r(A) = ${3 - r.rankA}`,
          r.rankA < r.rankAug ? 'r(A) < r(A|b)：无解' : (state.mode === 'hom' ? '有非零解（r(A) < n）' : '有解（r(A) = r(A|b)）')
        ];
        info.forEach((t, k) => D.G.label(ctx, p.w - 20, 30 + k * 20, t, { align: 'right', size: 11, weight: k === 3 ? 700 : 500, color: k === 3 ? C('--brand') : T['--ink-3'], mono: true }));
      });
      scene.render();
      const basisText = r.basis.length ? r.basis.map(v => '(' + v.map(f3).join(', ') + ')').join('  ') : '无（仅零解）';
      UI.readout(out, [
        ['r(A), r(A|b)', `${r.rankA}, ${r.rankAug}`],
        ['基础解系', basisText],
        ['特解 η', state.mode === 'inhom' ? `(${r.particular.map(f3).join(', ')})` : '—'],
        ['通解', state.mode === 'hom'
          ? (r.basis.length ? 'x = ' + r.basis.map((v, i) => `c${i + 1}(${v.map(f3).join(', ')})`).join(' + ') : 'x = 0')
          : (r.rankA === r.rankAug ? `x = (${r.particular.map(f3).join(', ')}) + 齐次通解` : '无解')]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 齐次方程组的解空间 ---------- */
  W.solutionSpace = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const presets = {
      line: { A: [[1, 2, -1], [2, 4, -1], [1, 2, 1]], name: '直线' },
      plane: { A: [[1, 1, 1], [2, 2, 2], [1, 1, 1]], name: '平面' },
      zero: { A: [[1, 0, 0], [0, 2, 0], [0, 0, 3]], name: '仅零解' }
    };
    const state = { key: 'line', step: 0 };

    function solve(A) {
      const { m, pivots, rank } = rowReduce(A);
      const free = [0, 1, 2].filter(c => !pivots.includes(c));
      const basis = free.map(f => {
        const v = [0, 0, 0];
        v[f] = 1;
        pivots.forEach((c, i) => { v[c] = -m[i][f]; });
        return v;
      });
      return { m, pivots, rank, free, basis };
    }

    UI.seg(ctrl, [
      { label: '直线（dim 1）', value: 'line' },
      { label: '平面（dim 2）', value: 'plane' },
      { label: '仅零解（dim 0）', value: 'zero' }
    ], v => { state.key = v; tp.go(0); }, 0);
    const tp = UI.transport(ctrl, { total: 4, onChange: k => { state.step = k; render(); } });

    function render() {
      const A = presets[state.key].A;
      const r = solve(A);
      const dim = 3 - r.rank;
      const step = state.step;
      const name = ['', '直线', '平面'][dim];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 38;
        const drawM = (x, y, M, title, color, hl) => {
          D.G.label(ctx, x + 1.5 * cell, y - 12, title, { size: 10.5, weight: 700, color });
          for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
            const on = hl && hl.includes(j) && i < r.rank;
            D.G.box(ctx, x + j * cell, y + i * cell, cell - 4, cell - 4, {
              fill: on ? D.withAlpha(C('--red'), 0.14) : T['--card-2'],
              stroke: on ? C('--red') : T['--line'], width: on ? 1.5 : 1.1, radius: 4
            });
            D.G.label(ctx, x + j * cell + (cell - 4) / 2, y + i * cell + (cell - 4) / 2, f3(M[i][j]),
              { size: 11.5, weight: 700, color: on ? C('--red') : T['--ink'], mono: true });
          }
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--ink-3'], 0.5); ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(x + 3 * cell + 2, y - 6); ctx.lineTo(x + 3 * cell + 2, y + 3 * cell - 4);
          ctx.stroke(); ctx.restore();
        };
        drawM(16, 58, A, '系数矩阵 A', C('--brand'), null);
        D.G.label(ctx, 16 + 1.5 * cell, 58 + 3 * cell + 8, step >= 2 ? `r(A) = ${r.rank}，n = 3` : '下一步：化行最简形', { size: 10.5, color: step >= 2 ? C('--green') : T['--ink-3'], mono: step >= 2 });
        if (step >= 1) drawM(16 + 3 * cell + 34, 58, r.m, '行最简形', C('--green'), r.pivots);

        // 解空间示意（3 维投影：z 轴指向左上，保证平面不退化）
        const ox = p.w - 160, oy = 172, sc = 32;
        const P3 = v => [ox + (v[0] - 0.65 * v[2]) * sc, oy - (v[1] + 0.5 * v[2]) * sc];
        const O = [ox, oy];
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.8);
        ctx.beginPath();
        ctx.moveTo(ox - 105, oy); ctx.lineTo(ox + 105, oy);
        ctx.moveTo(ox, oy - 100); ctx.lineTo(ox, oy + 100);
        ctx.stroke();
        ctx.restore();
        const ax = [[1.7, 0, 0], [0, 1.7, 0], [0, 0, 1.7]];
        const axNames = ['x₁', 'x₂', 'x₃'];
        ax.forEach((v, i) => {
          const q = P3(v);
          D.G.arrow(ctx, [O, q], { color: D.withAlpha(T['--ink-3'], 0.75), width: 1.1, head: 5 });
          D.G.label(ctx, q[0] + 5, q[1] - 5 + (i === 2 ? 8 : 0), axNames[i], { align: 'left', size: 9.5, weight: 700, color: T['--ink-3'] });
        });
        if (step >= 3) {
          if (dim === 1) {
            const u = P3(r.basis[0]);
            const n = Math.hypot(u[0] - ox, u[1] - oy) || 1;
            const e = [(u[0] - ox) / n * 100, (u[1] - oy) / n * 100];
            ctx.save();
            ctx.strokeStyle = D.withAlpha(C('--brand'), 0.75); ctx.lineWidth = 2; ctx.setLineDash([7, 5]);
            ctx.beginPath(); ctx.moveTo(ox - e[0], oy - e[1]); ctx.lineTo(ox + e[0], oy + e[1]); ctx.stroke();
            ctx.restore();
            D.G.arrow(ctx, [O, P3(r.basis[0])], { color: C('--brand'), width: 2.8, head: 8 });
            D.G.label(ctx, P3(r.basis[0])[0] + 8, P3(r.basis[0])[1] + 4, 'ξ₁', { align: 'left', size: 11.5, weight: 800, color: C('--brand') });
          } else if (dim === 2) {
            const u = P3(r.basis[0]), w = P3(r.basis[1]);
            const du = [u[0] - ox, u[1] - oy], dw = [w[0] - ox, w[1] - oy];
            const k = 1.6;
            const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([a, b]) =>
              [ox + k * (a * du[0] + b * dw[0]), oy + k * (a * du[1] + b * dw[1])]);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(corners[0][0], corners[0][1]);
            for (let i = 1; i < 4; i++) ctx.lineTo(corners[i][0], corners[i][1]);
            ctx.closePath();
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.12); ctx.fill();
            ctx.strokeStyle = D.withAlpha(C('--brand'), 0.5); ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.stroke();
            ctx.restore();
            D.G.arrow(ctx, [O, u], { color: C('--brand'), width: 2.8, head: 8 });
            D.G.arrow(ctx, [O, w], { color: C('--purple'), width: 2.8, head: 8 });
            D.G.label(ctx, u[0] + 8, u[1] + 4, 'ξ₁', { align: 'left', size: 11.5, weight: 800, color: C('--brand') });
            D.G.label(ctx, w[0] + 8, w[1] + 4, 'ξ₂', { align: 'left', size: 11.5, weight: 800, color: C('--purple') });
            D.G.label(ctx, ox, oy + 112, '解空间 = 过原点的平面', { size: 10, color: T['--ink-3'] });
          } else {
            D.G.dot(ctx, ox, oy, 5, C('--red'));
            D.G.label(ctx, ox + 10, oy - 12, '解空间 = {0}（只有零解）', { align: 'left', size: 10.5, weight: 700, color: C('--red') });
          }
        }
        // 底部说明
        const lines = step === 0
          ? ['齐次方程组 Ax = 0：系数矩阵 A（未知量个数 n = 3）', '它必有零解；是否有非零解要看 r(A) 与 n 的关系']
          : step === 1
            ? [`化行最简形：主元在第 ${r.pivots.map(c => c + 1).join('、')} 列，r(A) = ${r.rank}`, r.rank === 3 ? 'r(A) = n：只有零解，解空间为 {0}' : `非主元列对应自由未知量：x${r.free.map(c => c + 1).join('、x')}（共 ${dim} 个）`]
            : step === 2
              ? [`解空间维数公式：dim N(A) = n − r(A) = 3 − ${r.rank} = ${dim}`, dim === 0 ? '维数为 0 ⇒ 解空间只含零向量' : `自由未知量有 ${dim} 个，基础解系恰含 ${dim} 个向量`]
              : [`基础解系：${r.basis.length ? r.basis.map((v, i) => `ξ${i + 1} = (${v.map(f3).join(', ')})`).join('，') : '无（只有零解）'}`,
              dim === 0 ? '解空间 = {0}：零解是唯一解' : `解空间是${name}：x = k₁ξ₁${dim === 2 ? ' + k₂ξ₂' : ''}（k 为任意常数）`];
        D.G.box(ctx, 16, p.h - 74, p.w - 32, 62, { fill: D.withAlpha(C('--green'), 0.07), stroke: D.withAlpha(C('--green'), 0.35), radius: 9 });
        lines.forEach((t, k) => D.G.label(ctx, p.w / 2, p.h - 54 + k * 24, t, {
          size: k === 0 ? 12 : 11, weight: k === 0 ? 800 : 600,
          color: k === 0 ? C('--green') : T['--ink-2'], mono: k === 0
        }));
      });
      scene.render();
      UI.readout(out, [
        ['n（未知量个数）', '3'],
        ['r(A)', String(r.rank)],
        ['dim N(A) = n − r(A)', String(dim)],
        ['基础解系', r.basis.length ? r.basis.map((v, i) => `ξ${i + 1} = (${v.map(f3).join(', ')})`).join('；') : '无（仅零解）'],
        ['解空间几何', dim === 0 ? '原点 {0}' : `过原点的${name}（维数 ${dim}）`]
      ]);
    }
    render();
    return s;
  };

})(window);
