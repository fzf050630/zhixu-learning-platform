/* ============================================================
   la1.js — 第1章 行列式 可视化组件
   detCompute：行列式计算与几何意义
   detProperties：行列式性质演示
   detGeometry：行列式的几何意义（平行四边形面积 / 平行六面体体积）
   detRowOps：初等行变换对行列式值的影响
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C } = UI;

  function det3(m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
      - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
      + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }
  function fmtNum(v) {
    const r = Math.round(v * 1000) / 1000;
    return Object.is(r, -0) ? '0' : String(r);
  }
  function matrixGrid(ctx, x, y, m, cell, T, opts) {
    opts = opts || {};
    const rows = m.length, cols = m[0].length;
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const on = opts.highlight && opts.highlight.some(([r, c]) => r === i && c === j);
      D.G.box(ctx, x + j * cell, y + i * cell, cell - 4, cell - 4, {
        fill: on ? D.withAlpha(C('--red'), 0.18) : T['--card-2'],
        stroke: on ? C('--red') : T['--line'], radius: 5
      });
      D.G.label(ctx, x + j * cell + (cell - 4) / 2, y + i * cell + (cell - 4) / 2, fmtNum(m[i][j]),
        { size: Math.min(15, cell - 10), weight: 700, color: on ? C('--red') : T['--ink'], mono: true });
    }
    if (opts.rowColor) {
      opts.rowColor.forEach(([r, color]) => {
        ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.strokeRect(x - 4, y + r * cell - 2, cols * cell - 2, cell - 1); ctx.restore();
      });
    }
  }

  /* ---------- 行列式计算与几何意义 ---------- */
  W.detCompute = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { n: 2, m2: [[2, 1], [1, 3]], m3: [[2, 0, 1], [1, 3, 2], [1, 1, 1]] };

    UI.seg(ctrl, [{ label: '2 阶', value: 2 }, { label: '3 阶', value: 3 }], v => { state.n = v; render(); }, 0);
    const group2 = document.createElement('div');
    group2.style.display = 'flex'; group2.style.gap = '10px'; group2.style.flexWrap = 'wrap';
    ctrl.appendChild(group2);
    const inputs2 = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const inp = UI.number(group2, {
        label: `a${i + 1}${j + 1}`, value: state.m2[i][j], min: -9, max: 9, step: 0.5, width: 58,
        onChange: v => { state.m2[i][j] = Number.isFinite(v) ? v : 0; render(); }
      });
      inputs2.push(inp);
    }
    const group3 = document.createElement('div');
    group3.style.display = 'flex'; group3.style.gap = '8px'; group3.style.flexWrap = 'wrap';
    ctrl.appendChild(group3);
    const inputs3 = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const inp = UI.number(group3, {
        label: `${i + 1}${j + 1}`, value: state.m3[i][j], min: -9, max: 9, step: 0.5, width: 52,
        onChange: v => { state.m3[i][j] = Number.isFinite(v) ? v : 0; render(); }
      });
      inputs3.push(inp);
    }

    function rankOf(m) {
      const a = m.map(r => r.slice());
      const rows = a.length, cols = a[0].length;
      let rank = 0;
      for (let c = 0; c < cols && rank < rows; c++) {
        let piv = -1;
        for (let r = rank; r < rows; r++) if (Math.abs(a[r][c]) > 1e-9) { piv = r; break; }
        if (piv < 0) continue;
        [a[rank], a[piv]] = [a[piv], a[rank]];
        const pv = a[rank][c];
        for (let r = rank + 1; r < rows; r++) {
          const f = a[r][c] / pv;
          if (!f) continue;
          for (let k = c; k < cols; k++) a[r][k] -= f * a[rank][k];
        }
        rank++;
      }
      return rank;
    }

    function render() {
      group2.style.display = state.n === 2 ? 'flex' : 'none';
      group3.style.display = state.n === 3 ? 'flex' : 'none';
      const m = state.n === 2 ? state.m2 : state.m3;
      const det = state.n === 2 ? m[0][0] * m[1][1] - m[0][1] * m[1][0] : det3(m);
      const rank = rankOf(m);
      const full = rank === state.n;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const left = 100, cell = state.n === 2 ? 62 : 54;
        matrixGrid(ctx, left, 40, m, cell, T);
        D.G.label(ctx, left + state.n * cell / 2, 24, `|A| = ${fmtNum(det)}`, { size: 13, weight: 800, color: C('--brand'), mono: true });
        // 2 阶：几何示意（列向量张成的平行四边形）
        if (state.n === 2) {
          const c1 = [m[0][0], m[1][0]], c2 = [m[0][1], m[1][1]];
          const maxAbs = Math.max(1, Math.abs(c1[0]), Math.abs(c1[1]), Math.abs(c2[0]), Math.abs(c2[1]), Math.hypot(c1[0] + c2[0], c1[1] + c2[1]));
          const s1 = Math.min(120, (p.h - 120) / (2 * maxAbs * 1.15));
          const ox = p.w - 220, oy = p.h / 2 + 40;
          const P = v => [ox + v[0] * s1, oy - v[1] * s1];
          const O = P([0, 0]), A1 = P(c1), A2 = P(c2), S2 = P([c1[0] + c2[0], c1[1] + c2[1]]);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(O[0], O[1]); ctx.lineTo(A1[0], A1[1]); ctx.lineTo(S2[0], S2[1]); ctx.lineTo(A2[0], A2[1]); ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.1); ctx.fill();
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.5); ctx.setLineDash([5, 4]); ctx.stroke(); ctx.restore();
          D.G.arrow(ctx, [O, A1], { color: C('--brand'), width: 2.4, head: 8 });
          D.G.arrow(ctx, [O, A2], { color: C('--purple'), width: 2.4, head: 8 });
          D.G.label(ctx, A1[0] + 8, A1[1] - 6, '列 1', { align: 'left', size: 10.5, weight: 700, color: C('--brand') });
          D.G.label(ctx, A2[0] + 8, A2[1] - 6, '列 2', { align: 'left', size: 10.5, weight: 700, color: C('--purple') });
          D.G.label(ctx, ox, oy + 46, `平行四边形面积 = |det| = ${fmtNum(Math.abs(det))}`, { size: 11, color: T['--ink-2'] });
          D.G.label(ctx, ox, oy + 64, det < 0 ? 'det < 0：列向量构成左手系（带符号面积为负）' : 'det > 0：列向量构成右手系', { size: 10, color: T['--ink-3'] });
        } else {
          // 3 阶：按第一行展开的三项
          const c00 = m[1][1] * m[2][2] - m[1][2] * m[2][1];
          const c01 = m[1][0] * m[2][2] - m[1][2] * m[2][0];
          const c02 = m[1][0] * m[2][1] - m[1][1] * m[2][0];
          const lines = [
            `a11·M11 = ${fmtNum(m[0][0])} × ${fmtNum(c00)} = ${fmtNum(m[0][0] * c00)}`,
            `a12·M12 = ${fmtNum(m[0][1])} × ${fmtNum(c01)} = ${fmtNum(m[0][1] * c01)}（取负）`,
            `a13·M13 = ${fmtNum(m[0][2])} × ${fmtNum(c02)} = ${fmtNum(m[0][2] * c02)}`,
            `|A| = ${fmtNum(m[0][0] * c00)} − ${fmtNum(m[0][1] * c01)} + ${fmtNum(m[0][2] * c02)} = ${fmtNum(det)}`
          ];
          lines.forEach((t, k) => D.G.label(ctx, left + 190, 50 + k * 24, t, { align: 'left', size: 11, color: k === 3 ? C('--brand') : T['--ink-2'], mono: true }));
          D.G.label(ctx, left, p.h - 16, '几何意义：以三列为棱的平行六面体体积 = |det|；det = 0 表示三向量共面', { align: 'left', size: 10.5, color: T['--ink-3'] });
        }
        // 秩结论
        D.G.box(ctx, 16, p.h - 46, p.w - 32, 26, {
          fill: full ? D.withAlpha(C('--green'), 0.1) : D.withAlpha(C('--red'), 0.1),
          stroke: full ? D.withAlpha(C('--green'), 0.5) : D.withAlpha(C('--red'), 0.5), radius: 6
        });
        D.G.label(ctx, p.w / 2, p.h - 33, full ? 'det ≠ 0：A 满秩，列向量线性无关，A 可逆' : 'det = 0：A 不满秩，列向量线性相关，A 不可逆', { size: 11.5, weight: 700, color: full ? C('--green') : C('--red') });
      });
      scene.render();
      UI.readout(out, [
        ['行列式 |A|', fmtNum(det)],
        ['秩 r(A)', String(rank)],
        [state.n === 2 ? '几何量（面积）' : '几何量（体积）', fmtNum(Math.abs(det))],
        ['结论', full ? '满秩、可逆' : '降秩、不可逆']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 行列式性质 ---------- */
  W.detProperties = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const base = [[2, 1, 3], [1, 4, 2], [3, 2, 5]];
    const state = { op: 'swap', k: 2, m: base.map(r => r.slice()) };

    UI.seg(ctrl, [
      { label: '交换 r1 ↔ r2', value: 'swap' },
      { label: 'r2 ← k·r2', value: 'scale' },
      { label: 'r3 ← r3 + k·r1', value: 'add' },
      { label: '转置 Aᵀ', value: 'transpose' },
      { label: 'r2 ← r1（成比例）', value: 'proportional' },
      { label: '上三角化', value: 'triangular' }
    ], v => { state.op = v; render(); }, 0);
    UI.slider(ctrl, { label: '倍数 k', min: -3, max: 3, step: 0.5, value: 2, fmt: v => v.toFixed(1), onInput: v => { state.k = v; render(); } });

    function transform() {
      const A = base.map(r => r.slice());
      const k = state.k;
      switch (state.op) {
        case 'swap': return { B: [A[1].slice(), A[0].slice(), A[2].slice()], desc: '交换两行，行列式变号：|B| = −|A|', rule: '倍号', rows: [0, 1] };
        case 'scale': { const B = A.map(r => r.slice()); B[1] = B[1].map(x => x * k); return { B, desc: `某行乘 k=${fmtNum(k)}，行列式变为 k 倍：|B| = k|A|`, rule: `×${fmtNum(k)}`, rows: [1] }; }
        case 'add': { const B = A.map(r => r.slice()); for (let j = 0; j < 3; j++) B[2][j] += k * A[0][j]; return { B, desc: `某行加另一行的 k=${fmtNum(k)} 倍，行列式不变：|B| = |A|`, rule: '不变', rows: [2] }; }
        case 'transpose': return { B: [0, 1, 2].map(i => [0, 1, 2].map(j => A[j][i])), desc: '转置不改变行列式：|Aᵀ| = |A|', rule: '不变', rows: [] };
        case 'proportional': { const B = A.map(r => r.slice()); B[1] = A[0].slice(); return { B, desc: '两行相同（成比例），行列式为 0', rule: '= 0', rows: [1] }; }
        default: {
          const B = A.map(r => r.slice());
          for (let c = 0; c < 3; c++) {
            let piv = -1;
            for (let r = c; r < 3; r++) if (Math.abs(B[r][c]) > 1e-9) { piv = r; break; }
            if (piv < 0) continue;
            [B[c], B[piv]] = [B[piv], B[c]];
            const pv = B[c][c];
            for (let r = c + 1; r < 3; r++) {
              const f = B[r][c] / pv;
              for (let j = c; j < 3; j++) B[r][j] -= f * B[c][j];
            }
          }
          return { B: B.map(r => r.map(v => Math.round(v * 1e6) / 1e6)), desc: '化为上三角：行列式 = 主对角线元素之积', rule: '= ∏aᵢᵢ', rows: [] };
        }
      }
    }

    function render() {
      const t = transform();
      const dA = det3(base), dB = det3(t.B);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 52;
        D.G.label(ctx, 70 + 1.5 * cell, 24, '原矩阵 A', { size: 12, weight: 700, color: T['--ink'] });
        matrixGrid(ctx, 70, 40, base, cell, T);
        D.G.label(ctx, 70 + 1.5 * cell, 40 + 3 * cell + 16, `|A| = ${fmtNum(dA)}`, { size: 12.5, weight: 800, color: C('--brand'), mono: true });
        const x2 = p.w - 70 - 3 * cell;
        D.G.label(ctx, x2 + 1.5 * cell, 24, '变换后 B', { size: 12, weight: 700, color: T['--ink'] });
        matrixGrid(ctx, x2, 40, t.B, cell, T, { rowColor: t.rows.map(r => [r, C('--red')]) });
        D.G.label(ctx, x2 + 1.5 * cell, 40 + 3 * cell + 16, `|B| = ${fmtNum(dB)}`, { size: 12.5, weight: 800, color: dB === 0 ? C('--red') : C('--green'), mono: true });
        D.G.label(ctx, p.w / 2, p.h - 48, t.desc, { size: 11.5, weight: 700, color: T['--ink-2'] });
        D.G.label(ctx, p.w / 2, p.h - 26, `变化规律：${t.rule}`, { size: 11, color: t.rule === '不变' ? C('--green') : C('--accent'), mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['原行列式 |A|', fmtNum(dA)],
        ['变换后 |B|', fmtNum(dB)],
        ['规律', t.rule === '不变' ? '行列式不变' : t.rule === '倍号' ? '行列式变号' : t.rule === '= 0' ? '行列式为 0' : `|B| = ${t.rule} · |A|`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 行列式的几何意义（面积 / 体积） ---------- */
  W.detGeometry = function (host) {
    const s = UI.shellPlot(host, {
      height: 330, xMin: -5, xMax: 5, yMin: -5, yMax: 5,
      xTicks: 10, yTicks: 10
    });
    const { plot, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { n: 2, v1: [2, 1], v2: [1, 3], v3: [0.5, 1.5, 1.5] };
    const sl = (parent, label, get, set) => UI.slider(parent, {
      label, min: -3, max: 3, step: 0.25, value: get(), fmt: v => v.toFixed(2),
      onInput: v => { set(v); render(); }
    });

    UI.seg(ctrl, [{ label: '2 阶（面积）', value: 2 }, { label: '3 阶（体积）', value: 3 }], v => { state.n = v; render(); }, 0);
    const c1x = sl(ctrl, 'c₁.x', () => state.v1[0], v => { state.v1[0] = v; });
    const c1y = sl(ctrl, 'c₁.y', () => state.v1[1], v => { state.v1[1] = v; });
    const c2x = sl(ctrl, 'c₂.x', () => state.v2[0], v => { state.v2[0] = v; });
    const c2y = sl(ctrl, 'c₂.y', () => state.v2[1], v => { state.v2[1] = v; });
    const g3 = document.createElement('div');
    g3.style.display = 'flex'; g3.style.gap = '16px'; g3.style.flexWrap = 'wrap';
    ctrl.appendChild(g3);
    const c3x = sl(g3, 'c₃.x', () => state.v3[0], v => { state.v3[0] = v; });
    const c3y = sl(g3, 'c₃.y', () => state.v3[1], v => { state.v3[1] = v; });
    const c3z = sl(g3, 'c₃.z', () => state.v3[2], v => { state.v3[2] = v; });
    UI.button(ctrl, '重置', () => {
      state.v1 = [2, 1]; state.v2 = [1, 3]; state.v3 = [0.5, 1.5, 1.5];
      c1x.set(2); c1y.set(1); c2x.set(1); c2y.set(3); c3x.set(0.5); c3y.set(1.5); c3z.set(1.5);
      render();
    });

    function render() {
      g3.style.display = state.n === 3 ? 'flex' : 'none';
      const v1 = state.v1, v2 = state.v2, v3 = state.v3;
      const d2 = v1[0] * v2[1] - v1[1] * v2[0];
      const is3 = state.n === 3;
      const det = is3 ? v3[2] * d2 : d2;
      const S = Math.abs(d2), V = Math.abs(det), h3 = Math.abs(v3[2]);
      const proj = (x, y, z) => is3 ? [x + 0.5 * z, y + 0.45 * z] : [x, y];
      const p1 = proj(v1[0], v1[1], 0), p2 = proj(v2[0], v2[1], 0), p3 = proj(v3[0], v3[1], v3[2]);
      plot.clearLayers();
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        const O = [p.X(0), p.Y(0)];
        const q1 = [p.X(p1[0]), p.Y(p1[1])];
        const q2 = [p.X(p2[0]), p.Y(p2[1])];
        const q3 = [p.X(p3[0]), p.Y(p3[1])];
        // 底面平行四边形
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(O[0], O[1]);
        ctx.lineTo(q1[0], q1[1]);
        ctx.lineTo(p.X(p1[0] + p2[0]), p.Y(p1[1] + p2[1]));
        ctx.lineTo(q2[0], q2[1]);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(d2 < 0 ? C('--red') : C('--brand'), 0.13);
        ctx.fill();
        ctx.strokeStyle = D.withAlpha(T['--ink-3'], 0.55);
        ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.restore();
        // 3 阶：平行六面体棱
        if (is3) {
          const vert = (a, b, c) => [p1[0] * a + p2[0] * b + p3[0] * c, p1[1] * a + p2[1] * b + p3[1] * c];
          ctx.save();
          ctx.strokeStyle = D.withAlpha(C('--teal'), 0.55); ctx.lineWidth = 1.3;
          for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) {
            const from = vert(a, b, c);
            [[a + 1, b, c], [a, b + 1, c], [a, b, c + 1]].forEach(([A2, B2, C2]) => {
              if (A2 > 1 || B2 > 1 || C2 > 1) return;
              const to = vert(A2, B2, C2);
              ctx.beginPath();
              ctx.moveTo(p.X(from[0]), p.Y(from[1]));
              ctx.lineTo(p.X(to[0]), p.Y(to[1]));
              ctx.stroke();
            });
          }
          ctx.restore();
          const foot = [p.X(v3[0]), p.Y(v3[1])];
          D.G.arrow(ctx, [foot, q3], { color: C('--red'), width: 1.5, dash: [5, 4], head: 7 });
          D.G.label(ctx, (foot[0] + q3[0]) / 2 + 8, (foot[1] + q3[1]) / 2 + 12, `高 h = |z₃| = ${fmtNum(h3)}`, { align: 'left', size: 10, weight: 700, color: C('--red') });
        }
        // 列向量
        D.G.arrow(ctx, [O, q1], { color: C('--brand'), width: 2.6, head: 9 });
        D.G.arrow(ctx, [O, q2], { color: C('--purple'), width: 2.6, head: 9 });
        if (is3) D.G.arrow(ctx, [O, q3], { color: C('--teal'), width: 2.6, head: 9 });
        D.G.label(ctx, q1[0] + 8, q1[1] - 8, 'c₁', { align: 'left', size: 11.5, weight: 800, color: C('--brand') });
        D.G.label(ctx, q2[0] + 8, q2[1] - 8, 'c₂', { align: 'left', size: 11.5, weight: 800, color: C('--purple') });
        if (is3) D.G.label(ctx, q3[0] + 8, q3[1] - 8, 'c₃', { align: 'left', size: 11.5, weight: 800, color: C('--teal') });
        const lines = is3 ? [
          `|A| = z₃·(x₁y₂ − y₁x₂) = ${fmtNum(v3[2])} × ${fmtNum(d2)} = ${fmtNum(det)}`,
          `底面积 S = |x₁y₂ − y₁x₂| = ${fmtNum(S)}`,
          `体积 V = S·h = ${fmtNum(S)} × ${fmtNum(h3)} = ${fmtNum(V)}`,
          d2 === 0 ? 'c₁、c₂ 共线 ⇒ 底面退化，三向量共面，体积为 0' :
            det < 0 ? 'det < 0：c₃ 在底面法向的反侧，体积取负值（有向体积）' : 'det > 0：三向量构成右手系（有向体积为正）'
        ] : [
          `|A| = x₁y₂ − y₁x₂ = ${fmtNum(det)}`,
          `面积 S = |det| = ${fmtNum(V)}`,
          `det ≠ 0 ⇔ c₁、c₂ 线性无关 ⇔ A 可逆`,
          d2 === 0 ? 'c₁、c₂ 共线：平行四边形退化为线段，面积为 0' :
            det < 0 ? 'det < 0：c₁ → c₂ 为顺时针（左手系，有向面积为负）' : 'det > 0：c₁ → c₂ 为逆时针（右手系，有向面积为正）'
        ];
        ctx.save();
        ctx.font = `700 11px ${D.FONT_SANS}`;
        let tw = 0;
        lines.forEach(t => { tw = Math.max(tw, ctx.measureText(t).width); });
        ctx.restore();
        const panelW = Math.min(p.w - 24, tw + 28), panelH = 16 + lines.length * 17;
        D.G.box(ctx, 12, 10, panelW, panelH, { fill: D.withAlpha(T['--card'], 0.94), stroke: D.withAlpha(T['--line-2'], 0.8), radius: 8 });
        lines.forEach((t, k) => D.G.label(ctx, 22, 27 + k * 17, t, {
          align: 'left', size: 11, weight: k === 0 ? 800 : 600,
          color: k === 0 ? C('--brand') : (k === lines.length - 1 ? T['--ink-3'] : T['--ink-2']), mono: k < 3
        }));
      });
      plot.render();
      UI.readout(out, is3 ? [
        ['|A| = z₃ · S', fmtNum(det)],
        ['底面积 S', fmtNum(S)],
        ['高 h = |z₃|', fmtNum(h3)],
        ['体积 |det|', fmtNum(V)],
        ['结论', det === 0 ? '三向量共面，体积为 0，A 不可逆' : '不共面，体积 = 底面积 × 高']
      ] : [
        ['|A| = x₁y₂ − y₁x₂', fmtNum(det)],
        ['面积 |det|', fmtNum(V)],
        ['列向量关系', d2 === 0 ? '共线（线性相关）' : '不共线（线性无关）'],
        ['有向面积符号', det > 0 ? '正（c₁ → c₂ 逆时针）' : det < 0 ? '负（c₁ → c₂ 顺时针）' : '0']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 初等行变换对行列式值的影响 ---------- */
  W.detRowOps = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { op: 'swap12', k: 2, step: 0 };
    let A = [[2, 1, 3], [1, 4, 2], [3, 2, 5]];

    function randomA() {
      for (let t = 0; t < 300; t++) {
        const m = [0, 1, 2].map(() => [0, 1, 2].map(() => Math.floor(Math.random() * 7) - 3));
        const d = det3(m);
        if (Math.abs(d) >= 1 && Math.abs(d) <= 12) return m;
      }
      return [[2, 1, 3], [1, 4, 2], [3, 2, 5]];
    }
    function transform() {
      const B = A.map(r => r.slice());
      const k = state.k;
      switch (state.op) {
        case 'swap12':
          return { B: [B[1], B[0], B[2]], rows: [0, 1], kind: 'swap', opText: '交换 r₁ ↔ r₂', desc: '互换两行，行列式变号：|B| = −|A|' };
        case 'swap23':
          return { B: [B[0], B[2], B[1]], rows: [1, 2], kind: 'swap', opText: '交换 r₂ ↔ r₃', desc: '互换两行，行列式变号：|B| = −|A|' };
        case 'scale':
          return { B: B.map((r, i) => i === 1 ? r.map(x => x * k) : r), rows: [1], kind: 'scale', opText: `r₂ ← ${fmtNum(k)}·r₂`, desc: `某一行乘非零数 k，行列式变为 k 倍：|B| = k|A|` };
        case 'add31':
          return { B: B.map((r, i) => i === 2 ? r.map((x, j) => x + k * A[0][j]) : r), rows: [2], kind: 'add', opText: `r₃ ← r₃ + (${fmtNum(k)})·r₁`, desc: '把某行的 k 倍加到另一行，行列式不变：|B| = |A|' };
        default:
          return { B: B.map((r, i) => i === 0 ? r.map((x, j) => x + k * A[2][j]) : r), rows: [0], kind: 'add', opText: `r₁ ← r₁ + (${fmtNum(k)})·r₃`, desc: '把某行的 k 倍加到另一行，行列式不变：|B| = |A|' };
      }
    }

    UI.seg(ctrl, [
      { label: '交换 r₁↔r₂', value: 'swap12' },
      { label: '交换 r₂↔r₃', value: 'swap23' },
      { label: 'r₂ ← k·r₂', value: 'scale' },
      { label: 'r₃ ← r₃ + k·r₁', value: 'add31' },
      { label: 'r₁ ← r₁ + k·r₃', value: 'add13' }
    ], v => { state.op = v; tp.go(0); }, 0);
    UI.slider(ctrl, { label: '倍数 k', min: -3, max: 3, step: 0.5, value: 2, fmt: v => v.toFixed(1), onInput: v => { state.k = v; render(); } });
    const tp = UI.transport(ctrl, { total: 4, onChange: k => { state.step = k; render(); } });
    UI.button(ctrl, '换一组数据', () => { A = randomA(); tp.go(0); });

    function render() {
      const t = transform();
      const dA = det3(A), dB = det3(t.B);
      const expect = t.kind === 'swap' ? -dA : t.kind === 'scale' ? state.k * dA : dA;
      const consistent = Math.abs(dB - expect) < 1e-9;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cell = 50, xA = 56, xB = p.w - 56 - 3 * cell;
        D.G.label(ctx, xA + 1.5 * cell, 22, '原矩阵 A', { size: 12, weight: 700, color: T['--ink'] });
        matrixGrid(ctx, xA, 38, A, cell, T);
        D.G.label(ctx, xA + 1.5 * cell, 38 + 3 * cell + 14, `|A| = ${fmtNum(dA)}`, { size: 12.5, weight: 800, color: C('--brand'), mono: true });
        const midX = xA + 3 * cell + 12, midY = 38 + 1.5 * cell;
        D.G.arrow(ctx, [[midX, midY], [xB - 12, midY]], { color: C('--accent'), width: 2, head: 9 });
        D.G.label(ctx, (midX + xB) / 2, midY - 16, t.opText, { size: 11, weight: 800, color: C('--accent'), mono: true });
        if (state.step === 0) D.G.label(ctx, (midX + xB) / 2, midY + 18, '点“下一步”施加变换', { size: 10, color: T['--ink-3'] });
        if (state.step >= 1) {
          D.G.label(ctx, xB + 1.5 * cell, 22, '变换后 B', { size: 12, weight: 700, color: T['--ink'] });
          matrixGrid(ctx, xB, 38, t.B, cell, T, { rowColor: t.rows.map(r => [r, C('--red')]) });
          D.G.label(ctx, xB + 1.5 * cell, 38 + 3 * cell + 14, `|B| = ${fmtNum(dB)}`, { size: 12.5, weight: 800, color: dB === 0 ? C('--red') : C('--green'), mono: true });
        }
        const b = t.B;
        const m11 = b[1][1] * b[2][2] - b[1][2] * b[2][1];
        const m12 = b[1][0] * b[2][2] - b[1][2] * b[2][0];
        const m13 = b[1][0] * b[2][1] - b[1][1] * b[2][0];
        const expand = [
          '对 B 按第 1 行展开：|B| = b₁₁M₁₁ − b₁₂M₁₂ + b₁₃M₁₃',
          `= ${fmtNum(b[0][0])} × ${fmtNum(m11)} − ${fmtNum(b[0][1])} × ${fmtNum(m12)} + ${fmtNum(b[0][2])} × ${fmtNum(m13)}`,
          `= ${fmtNum(b[0][0] * m11)} − ${fmtNum(b[0][1] * m12)} + ${fmtNum(b[0][2] * m13)} = ${fmtNum(dB)}`
        ];
        const check = t.kind === 'swap'
          ? `−|A| = −(${fmtNum(dA)}) = ${fmtNum(-dA)} = |B| ✓`
          : t.kind === 'scale'
            ? `k|A| = ${fmtNum(state.k)} × ${fmtNum(dA)} = ${fmtNum(state.k * dA)} = |B| ✓`
            : `|A| = ${fmtNum(dA)} = |B|，值没有改变 ✓`;
        const panel = state.step === 0
          ? ['先计算原行列式 |A|，再施加行变换', `|A| = ${fmtNum(dA)}`, '下一步：执行 ' + t.opText]
          : state.step === 1
            ? ['已执行：' + t.opText, `|B| = ${fmtNum(dB)}`, '下一步：按第 1 行展开验证 |B| 的值']
            : state.step === 2
              ? expand
              : [t.desc, check, '交换变号、倍乘乘 k、倍加不变——这就是化三角形法的记账规则'];
        D.G.box(ctx, 16, p.h - 104, p.w - 32, 92, {
          fill: D.withAlpha(state.step === 3 && !consistent ? C('--red') : C('--green'), 0.07),
          stroke: D.withAlpha(state.step === 3 && !consistent ? C('--red') : C('--green'), 0.35), radius: 9
        });
        panel.forEach((line, k) => D.G.label(ctx, p.w / 2, p.h - 86 + k * 24, line, {
          size: k === 1 ? 12 : 11, weight: k === 0 ? 800 : 600,
          color: k === 0 ? (state.step === 3 ? (consistent ? C('--green') : C('--red')) : C('--accent')) : T['--ink-2'],
          mono: state.step >= 1
        }));
        D.G.label(ctx, p.w - 20, 22, `步骤 ${state.step + 1} / 4`, { align: 'right', size: 10.5, color: T['--ink-3'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['原行列式 |A|', fmtNum(dA)],
        ['变换后 |B|', fmtNum(dB)],
        ['变换', t.opText],
        ['规律', t.kind === 'swap' ? '交换两行：|B| = −|A|' : t.kind === 'scale' ? `某行乘 k：|B| = k|A|（k = ${fmtNum(state.k)}）` : '倍加：|B| = |A|（不变）'],
        ['数值核对', consistent ? '与规律完全一致 ✓' : '不一致 ✗']
      ]);
    }
    render();
    return s;
  };

})(window);
