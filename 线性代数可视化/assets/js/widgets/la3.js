/* ============================================================
   la3.js — 第3章 向量 可视化组件
   linearCombo：线性组合与线性相关性（2D）
   gramSchmidt：施密特正交化
   maxIndependent：极大线性无关组的动态构造
   basisTransform：向量空间与坐标变换
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C } = UI;
  const f3 = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r); };

  function vec2(parent, label, x0, y0, onInput) {
    let [x, y] = [x0, y0];
    const a = UI.slider(parent, { label: label + '.x', min: -4, max: 4, step: 0.2, value: x, fmt: v => v.toFixed(1), onInput: v => { x = v; onInput(x, y); } });
    const b = UI.slider(parent, { label: label + '.y', min: -4, max: 4, step: 0.2, value: y, fmt: v => v.toFixed(1), onInput: v => { y = v; onInput(x, y); } });
    return { get x() { return x; }, get y() { return y; } };
  }

  /* ---------- 线性组合与相关性 ---------- */
  W.linearCombo = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    let a1 = [2.4, 0.8], a2 = [0.6, 2.2], b = [3, 3];
    UI.seg(ctrl, [
      { label: '一般位置', value: 'gen' }, { label: '共线', value: 'line' }, { label: '零向量', value: 'zero' }
    ], v => {
      if (v === 'gen') { a1 = [2.4, 0.8]; a2 = [0.6, 2.2]; b = [3, 3]; }
      if (v === 'line') { a1 = [2.4, 0.8]; a2 = [1.2, 0.4]; b = [2, 2]; }
      if (v === 'zero') { a1 = [0, 0]; a2 = [0.6, 2.2]; b = [1, 2]; }
      vx.set(a1[0]); vy.set(a1[1]); wx.set(a2[0]); wy.set(a2[1]); bx.set(b[0]); by.set(b[1]);
      render();
    }, 0);
    const vx = UI.slider(ctrl, { label: 'α₁.x', min: -4, max: 4, step: 0.2, value: a1[0], fmt: v => v.toFixed(1), onInput: v => { a1[0] = v; render(); } });
    const vy = UI.slider(ctrl, { label: 'α₁.y', min: -4, max: 4, step: 0.2, value: a1[1], fmt: v => v.toFixed(1), onInput: v => { a1[1] = v; render(); } });
    const wx = UI.slider(ctrl, { label: 'α₂.x', min: -4, max: 4, step: 0.2, value: a2[0], fmt: v => v.toFixed(1), onInput: v => { a2[0] = v; render(); } });
    const wy = UI.slider(ctrl, { label: 'α₂.y', min: -4, max: 4, step: 0.2, value: a2[1], fmt: v => v.toFixed(1), onInput: v => { a2[1] = v; render(); } });
    const bx = UI.slider(ctrl, { label: 'β.x', min: -4, max: 4, step: 0.2, value: b[0], fmt: v => v.toFixed(1), onInput: v => { b[0] = v; render(); } });
    const by = UI.slider(ctrl, { label: 'β.y', min: -4, max: 4, step: 0.2, value: b[1], fmt: v => v.toFixed(1), onInput: v => { b[1] = v; render(); } });

    function render() {
      const d = a1[0] * a2[1] - a1[1] * a2[0];
      let c1 = NaN, c2 = NaN, caseText;
      if (Math.abs(d) > 1e-9) {
        c1 = (b[0] * a2[1] - b[1] * a2[0]) / d;
        c2 = (a1[0] * b[1] - a1[1] * b[0]) / d;
        caseText = 'α₁、α₂ 线性无关，β 可唯一表示';
      } else {
        const crossB = a1[0] * b[1] - a1[1] * b[0];
        if (Math.abs(a1[0]) + Math.abs(a1[1]) < 1e-9 || Math.abs(a2[0]) + Math.abs(a2[1]) < 1e-9) {
          caseText = '含有零向量，向量组线性相关';
          if (Math.abs(a2[0]) + Math.abs(a2[1]) < 1e-9) { c1 = 0; c2 = 0; }
        } else if (Math.abs(crossB) < 1e-9) {
          caseText = 'α₁、α₂ 共线（线性相关），β 与它们共线 → 无穷多表示';
        } else {
          caseText = 'α₁、α₂ 线性相关，β 不在其张成直线上 → 不能表示';
        }
      }
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const ox = p.w / 2, oy = p.h / 2 + 10, sc = Math.min(52, (p.h - 80) / 9);
        const P = v => [ox + v[0] * sc, oy - v[1] * sc];
        ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.8); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(p.w - 30, oy); ctx.moveTo(ox, 24); ctx.lineTo(ox, p.h - 24); ctx.stroke(); ctx.restore();
        // 张成空间
        if (Math.abs(d) > 1e-9) {
          const O = P([0, 0]), A = P(a1), B2 = P(a2), S = P([a1[0] + a2[0], a1[1] + a2[1]]);
          ctx.save(); ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(A[0], A[1]); ctx.lineTo(S[0], S[1]); ctx.lineTo(B2[0], B2[1]); ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.08); ctx.fill();
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.35); ctx.setLineDash([4, 4]); ctx.stroke(); ctx.restore();
        } else {
          ctx.save(); ctx.strokeStyle = D.withAlpha(C('--brand'), 0.3); ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
          const dir = Math.hypot(a1[0], a1[1]) > 1e-9 ? a1 : a2;
          const n = Math.hypot(dir[0], dir[1]) || 1;
          const e = [dir[0] / n, dir[1] / n];
          const P1 = P([e[0] * 9, e[1] * 9]), P2 = P([-e[0] * 9, -e[1] * 9]);
          ctx.beginPath(); ctx.moveTo(P1[0], P1[1]); ctx.lineTo(P2[0], P2[1]); ctx.stroke(); ctx.restore();
        }
        const O = P([0, 0]);
        D.G.arrow(ctx, [O, P(a1)], { color: C('--brand'), width: 2.6, head: 8 });
        D.G.arrow(ctx, [O, P(a2)], { color: C('--purple'), width: 2.6, head: 8 });
        D.G.arrow(ctx, [O, P(b)], { color: C('--red'), width: 3, head: 9 });
        D.G.label(ctx, P(a1)[0] + 8, P(a1)[1] - 8, 'α₁', { align: 'left', size: 12, weight: 800, color: C('--brand') });
        D.G.label(ctx, P(a2)[0] + 8, P(a2)[1] - 8, 'α₂', { align: 'left', size: 12, weight: 800, color: C('--purple') });
        D.G.label(ctx, P(b)[0] + 8, P(b)[1] - 8, 'β', { align: 'left', size: 12, weight: 800, color: C('--red') });
        // 组合示意
        if (isFinite(c1) && isFinite(c2)) {
          const mid = P([a1[0] * c1, a1[1] * c1]);
          D.G.label(ctx, mid[0] - 6, mid[1] - 10, `c₁α₁ (c₁=${f3(c1)})`, { align: 'right', size: 10, color: C('--ink-3') });
        }
        D.G.box(ctx, 16, p.h - 44, p.w - 32, 30, {
          fill: D.withAlpha(C('--green'), 0.08), stroke: D.withAlpha(C('--green'), 0.4), radius: 7
        });
        D.G.label(ctx, p.w / 2, p.h - 29, caseText, { size: 11.5, weight: 700, color: C('--green') });
      });
      scene.render();
      UI.readout(out, [
        ['行列式 |α₁ α₂|', f3(d)],
        ['相关性', Math.abs(d) < 1e-9 ? '线性相关' : '线性无关'],
        ['c₁, c₂', isFinite(c1) && isFinite(c2) ? `${f3(c1)}, ${f3(c2)}` : (Math.abs(d) < 1e-9 && Math.abs(a1[0] * b[1] - a1[1] * b[0]) < 1e-9 ? '无穷多组解' : '无解')],
        ['结论', caseText]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 施密特正交化 ---------- */
  W.gramSchmidt = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { a1: [2.6, 0.6], a2: [0.8, 2.4], step: 3 };
    UI.slider(ctrl, { label: 'α₁.x', min: -4, max: 4, step: 0.2, value: state.a1[0], fmt: v => v.toFixed(1), onInput: v => { state.a1[0] = v; render(); } });
    UI.slider(ctrl, { label: 'α₁.y', min: -4, max: 4, step: 0.2, value: state.a1[1], fmt: v => v.toFixed(1), onInput: v => { state.a1[1] = v; render(); } });
    UI.slider(ctrl, { label: 'α₂.x', min: -4, max: 4, step: 0.2, value: state.a2[0], fmt: v => v.toFixed(1), onInput: v => { state.a2[0] = v; render(); } });
    UI.slider(ctrl, { label: 'α₂.y', min: -4, max: 4, step: 0.2, value: state.a2[1], fmt: v => v.toFixed(1), onInput: v => { state.a2[1] = v; render(); } });
    UI.transport(ctrl, { total: 4, onChange: k => { state.step = k; render(); } });

    function render() {
      const [x1, y1] = state.a1, [x2, y2] = state.a2;
      const n1 = Math.hypot(x1, y1) || 1e-9;
      const beta1 = [x1, y1];
      const proj = (x1 * x2 + y1 * y2) / (x1 * x1 + y1 * y1 || 1e-9);
      const projV = [proj * x1, proj * y1];
      const beta2 = [x2 - projV[0], y2 - projV[1]];
      const n2 = Math.hypot(beta2[0], beta2[1]) || 1e-9;
      const e1 = [beta1[0] / n1, beta1[1] / n1], e2 = [beta2[0] / n2, beta2[1] / n2];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const ox = p.w / 2 - 60, oy = p.h / 2 + 20, sc = Math.min(48, (p.h - 90) / 9);
        const P = v => [ox + v[0] * sc, oy - v[1] * sc];
        ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.8); ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(p.w - 30, oy); ctx.moveTo(ox, 22); ctx.lineTo(ox, p.h - 24); ctx.stroke(); ctx.restore();
        const O = P([0, 0]);
        // 投影虚线
        if (state.step >= 2) {
          D.G.arrow(ctx, [O, P(projV)], { color: D.withAlpha(C('--red'), 0.8), width: 1.6, dash: [4, 4] });
          D.G.arrow(ctx, [P([x2, y2]), P(projV)], { color: D.withAlpha(C('--red'), 0.5), width: 1.4, dash: [4, 4] });
          D.G.label(ctx, P(projV)[0], P(projV)[1] + 14, `投影 (α₂,β₁)/(β₁,β₁)·β₁ = ${f3(proj)}·β₁`, { size: 10, color: C('--red') });
        }
        D.G.arrow(ctx, [O, P(state.a1)], { color: C('--brand'), width: 2.6, head: 8 });
        D.G.arrow(ctx, [O, P(state.a2)], { color: C('--purple'), width: 2.6, head: 8 });
        D.G.label(ctx, P(state.a1)[0] + 8, P(state.a1)[1] - 8, 'α₁', { align: 'left', size: 12, weight: 800, color: C('--brand') });
        D.G.label(ctx, P(state.a2)[0] + 8, P(state.a2)[1] - 8, 'α₂', { align: 'left', size: 12, weight: 800, color: C('--purple') });
        if (state.step >= 2) {
          D.G.arrow(ctx, [O, P(beta2)], { color: C('--green'), width: 2.4, head: 8 });
          D.G.label(ctx, P(beta2)[0] + 8, P(beta2)[1] + 14, 'β₂ = α₂ − 投影', { align: 'left', size: 11, weight: 700, color: C('--green') });
        }
        if (state.step >= 3) {
          D.G.arrow(ctx, [O, P(e1)], { color: C('--teal'), width: 2, head: 7 });
          D.G.label(ctx, P(e1)[0] - 6, P(e1)[1] - 10, 'e₁', { align: 'right', size: 11, weight: 800, color: C('--teal') });
        }
        if (state.step >= 4) {
          D.G.arrow(ctx, [O, P(e2)], { color: C('--accent'), width: 2, head: 7 });
          D.G.label(ctx, P(e2)[0] + 8, P(e2)[1] - 10, 'e₂', { align: 'left', size: 11, weight: 800, color: C('--accent') });
        }
        const stepText = [
          '① β₁ = α₁',
          `② β₂ = α₂ − (α₂,β₁)/(β₁,β₁)·β₁ = (${f3(beta2[0])}, ${f3(beta2[1])})`,
          `③ e₁ = β₁/|β₁| = (${f3(e1[0])}, ${f3(e1[1])})`,
          `④ e₂ = β₂/|β₂| = (${f3(e2[0])}, ${f3(e2[1])})`
        ][state.step];
        D.G.box(ctx, 16, p.h - 44, p.w - 32, 30, { fill: D.withAlpha(C('--green'), 0.08), stroke: D.withAlpha(C('--green'), 0.4), radius: 7 });
        D.G.label(ctx, p.w / 2, p.h - 29, stepText, { size: 11.5, weight: 700, color: C('--green'), mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['内积 (α₂,β₁)', f3(x1 * x2 + y1 * y2)],
        ['β₂', `(${f3(beta2[0])}, ${f3(beta2[1])})`],
        ['e₁, e₂', `(${f3(e1[0])},${f3(e1[1])}), (${f3(e2[0])},${f3(e2[1])})`],
        ['验证', `(e₁,e₂) = ${f3(e1[0] * e2[0] + e1[1] * e2[1])}，|e₁| = ${f3(Math.hypot(e1[0], e1[1]))}`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 极大线性无关组 ---------- */
  W.maxIndependent = function (host) {
    const s = UI.shellPlot(host, { height: 330, xMin: -4.6, xMax: 4.6, yMin: -4.6, yMax: 4.6, xTicks: 9, yTicks: 9 });
    const { plot, ctrl, out, body } = s;
    body.classList.add('pad0');
    const presets = {
      r3: [[1, 1, 0], [0, 1, 1], [1, 2, 1], [1, 0, 1]],
      r2: [[1, 1, 0], [0, 1, 1], [1, 2, 1], [2, 3, 1]],
      r1: [[1, 2, 3], [2, 4, 6], [0, 0, 0], [-1, -2, -3]]
    };
    const state = { vs: presets.r3, step: 0 };
    const colors = () => [C('--brand'), C('--purple'), C('--accent'), C('--teal')];
    const names = ['α₁', 'α₂', 'α₃', 'α₄'];
    const P = v => [v[0] - 0.65 * v[2], v[1] + 0.5 * v[2]];

    UI.seg(ctrl, [
      { label: '标准例（秩 3）', value: 'r3' },
      { label: '秩 2（含相关）', value: 'r2' },
      { label: '秩 1（成比例）', value: 'r1' }
    ], v => { state.vs = presets[v]; tp.go(0); }, 0);
    const tp = UI.transport(ctrl, { total: 6, onChange: k => { state.step = k; render(); } });

    function rankInfo(cols) {
      const m = [0, 1, 2].map(r => cols.map(v => v[r]));
      const pivots = [];
      let rank = 0;
      const ncols = cols.length;
      for (let c = 0; c < ncols && rank < 3; c++) {
        let piv = -1;
        for (let r = rank; r < 3; r++) if (Math.abs(m[r][c]) > 1e-9) { piv = r; break; }
        if (piv < 0) continue;
        [m[rank], m[piv]] = [m[piv], m[rank]];
        const pv = m[rank][c];
        for (let r = rank + 1; r < 3; r++) {
          const f = m[r][c] / pv;
          for (let k2 = c; k2 < ncols; k2++) m[r][k2] -= f * m[rank][k2];
        }
        pivots.push(c);
        rank++;
      }
      return { rank, pivots };
    }

    function render() {
      const step = state.step;
      const added = Math.min(step, 4);
      const info = rankInfo(state.vs.slice(0, added));
      const prev = rankInfo(state.vs.slice(0, Math.max(0, added - 1)));
      const grew = added > 0 && info.rank > prev.rank;
      const allInfo = rankInfo(state.vs);
      plot.clearLayers();
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        // 投影坐标轴
        const O = [p.X(0), p.Y(0)];
        const ax = (v, label) => {
          const q = [p.X(v[0] * 1.6), p.Y(v[1] * 1.6)];
          D.G.arrow(ctx, [O, q], { color: D.withAlpha(T['--ink-3'], 0.8), width: 1.2, head: 6 });
          D.G.label(ctx, q[0] + 5, q[1] - 5, label, { align: 'left', size: 10.5, weight: 700, color: T['--ink-3'] });
        };
        ax([1, 0], 'x');
        ax([0, 1], 'y');
        ax([-0.9, 0.7], 'z');
        // 张成空间
        if (info.rank === 1) {
          const u = state.vs[info.pivots[0]];
          const pu = P(u), n = Math.hypot(pu[0], pu[1]) || 1;
          const e = [pu[0] / n * 4, pu[1] / n * 4];
          ctx.save();
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.4); ctx.lineWidth = 2; ctx.setLineDash([7, 5]);
          ctx.beginPath();
          ctx.moveTo(p.X(-e[0]), p.Y(-e[1]));
          ctx.lineTo(p.X(e[0]), p.Y(e[1]));
          ctx.stroke(); ctx.restore();
        } else if (info.rank === 2) {
          const u = P(state.vs[info.pivots[0]]), w = P(state.vs[info.pivots[1]]);
          const k = 2.1;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p.X((u[0] + w[0]) * k), p.Y((u[1] + w[1]) * k));
          ctx.lineTo(p.X((u[0] - w[0]) * k), p.Y((u[1] - w[1]) * k));
          ctx.lineTo(p.X(-(u[0] + w[0]) * k), p.Y(-(u[1] + w[1]) * k));
          ctx.lineTo(p.X(-(u[0] - w[0]) * k), p.Y(-(u[1] - w[1]) * k));
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.1); ctx.fill();
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.4); ctx.lineWidth = 1.4; ctx.setLineDash([6, 5]); ctx.stroke();
          ctx.restore();
        } else if (info.rank === 3) {
          D.G.label(ctx, 16, p.py + 18, '三个线性无关的向量张成整个 R³', { align: 'left', size: 11, weight: 700, color: C('--green') });
        }
        // 向量
        for (let idx = 0; idx < 4; idx++) {
          const on = idx < added;
          const isPivot = info.pivots.includes(idx);
          const dependent = on && !isPivot;
          const q = P(state.vs[idx]);
          const col = !on ? D.withAlpha(T['--ink-3'], 0.25) : dependent ? C('--red') : colors()[idx];
          D.G.arrow(ctx, [O, [p.X(q[0]), p.Y(q[1])]], { color: col, width: on ? 2.6 : 1.6, head: on ? 8 : 6, dash: dependent ? [5, 4] : null });
          D.G.label(ctx, p.X(q[0]) + 8, p.Y(q[1]) - 8, names[idx] + (dependent ? '（相关）' : ''), {
            align: 'left', size: 11, weight: 800, color: col
          });
          if (dependent) {
            const pi = info.pivots[0] !== undefined ? P(state.vs[info.pivots[0]]) : null;
            const pj = info.pivots[1] !== undefined ? P(state.vs[info.pivots[1]]) : null;
            if (pi && pj && info.rank === 2) {
              D.G.label(ctx, p.X(q[0]) + 8, p.Y(q[1]) + 8, '可由前面的无关向量线性表示', { align: 'left', size: 9.5, color: C('--red') });
            }
          }
        }
        // 信息面板
        const lines = [];
        if (step === 0) {
          lines.push('依次点击“下一步”，把 α₁、α₂、α₃、α₄ 逐个加入向量组');
          lines.push('判定规则：加入后秩增加 ⇒ 无关；秩不变 ⇒ 相关');
        } else if (step >= 1 && step <= 4) {
          lines.push(`加入 ${names[added - 1]} 后：向量组 ${names.slice(0, added).join('、')} 的秩 r = ${info.rank}`);
          lines.push(grew
            ? `${names[added - 1]} 与前面的向量线性无关（秩由 ${prev.rank} 增到 ${info.rank}）`
            : `${names[added - 1]} 可由前面的向量线性表示 ⇒ 线性相关（秩保持 ${info.rank}）`);
          if (step === 4) lines.push(`最终 r = ${info.rank}，极大无关组：{ ${info.pivots.map(j => names[j]).join(', ')} }`);
        } else {
          lines.push(`向量组 {α₁, α₂, α₃, α₄} 的秩 r = ${allInfo.rank}`);
          lines.push(`极大无关组：{ ${allInfo.pivots.map(j => names[j]).join(', ')} }（不唯一，但所含个数 = 秩）`);
          lines.push('其余向量都可由该极大无关组线性表示，秩 = 非零行数 = 主元列数');
        }
        ctx.save();
        ctx.font = `700 11px ${D.FONT_SANS}`;
        let tw = 0;
        lines.forEach(t => { tw = Math.max(tw, ctx.measureText(t).width); });
        ctx.restore();
        const panelW = Math.min(p.w - 24, tw + 28), panelH = 14 + lines.length * 17;
        const panelY = p.py + p.ph - panelH - 6;
        D.G.box(ctx, 12, panelY, panelW, panelH, { fill: D.withAlpha(T['--card'], 0.94), stroke: D.withAlpha(T['--line-2'], 0.8), radius: 8 });
        lines.forEach((t, k) => D.G.label(ctx, 22, panelY + 17 + k * 17, t, {
          align: 'left', size: 11, weight: k === 0 ? 800 : 600,
          color: k === 0 ? (step >= 1 && step <= 4 ? (grew ? C('--green') : C('--red')) : C('--brand')) : T['--ink-2'], mono: true
        }));
        if (step === 5) {
          D.G.label(ctx, p.w - 14, 20, `秩 r = ${allInfo.rank}`, { align: 'right', size: 13, weight: 800, color: C('--brand'), mono: true });
        }
      });
      plot.render();
      UI.readout(out, step === 0 ? [
        ['向量组', state.vs.map((v, i2) => `${names[i2]} = (${v.join(', ')})`).join(', ')],
        ['当前秩', '0（尚未加入向量）'],
        ['操作', '点击“下一步”逐个加入向量，观察秩是否增加']
      ] : [
        ['已加入', names.slice(0, added).join('、') + `（共 ${added} 个）`],
        ['当前秩 r', String(info.rank)],
        ['本次加入', grew ? `${names[added - 1]}：线性无关（秩 +1）` : `${names[added - 1]}：线性相关（可由前面向量表示）`],
        ['极大无关组（全部向量）', `{ ${allInfo.pivots.map(j => names[j]).join(', ')} }，r = ${allInfo.rank}`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 向量空间与坐标变换 ---------- */
  W.basisTransform = function (host) {
    const s = UI.shellPlot(host, { height: 330, xMin: -4.6, xMax: 4.6, yMin: -4.6, yMax: 4.6, xTicks: 9, yTicks: 9 });
    const { plot, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { b1: [1.8, 0.6], b2: [-0.4, 1.6], xi: [1.4, 1.2], stage: 0 };
    const sl = (label, get, set) => UI.slider(ctrl, {
      label, min: -3, max: 3, step: 0.2, value: get(), fmt: v => v.toFixed(1),
      onInput: v => { set(v); render(); }
    });
    const b1x = sl('β₁.x', () => state.b1[0], v => { state.b1[0] = v; });
    const b1y = sl('β₁.y', () => state.b1[1], v => { state.b1[1] = v; });
    const b2x = sl('β₂.x', () => state.b2[0], v => { state.b2[0] = v; });
    const b2y = sl('β₂.y', () => state.b2[1], v => { state.b2[1] = v; });
    const xxx = sl('ξ.x', () => state.xi[0], v => { state.xi[0] = v; });
    const xxy = sl('ξ.y', () => state.xi[1], v => { state.xi[1] = v; });
    const tp = UI.transport(ctrl, { total: 3, onChange: k => { state.stage = k; render(); } });
    UI.button(ctrl, '重置', () => {
      state.b1 = [1.8, 0.6]; state.b2 = [-0.4, 1.6]; state.xi = [1.4, 1.2];
      b1x.set(1.8); b1y.set(0.6); b2x.set(-0.4); b2y.set(1.6); xxx.set(1.4); xxy.set(1.2);
      tp.go(0);
    });

    function render() {
      const [b1, b2, xi] = [state.b1, state.b2, state.xi];
      const m = state.stage / 2;
      const g1 = [1 + (b1[0] - 1) * m, 0 + (b1[1] - 0) * m];
      const g2 = [0 + (b2[0] - 0) * m, 1 + (b2[1] - 1) * m];
      const det = b1[0] * b2[1] - b1[1] * b2[0];
      const ok = Math.abs(det) > 1e-6;
      const y1 = ok ? (xi[0] * b2[1] - xi[1] * b2[0]) / det : NaN;
      const y2 = ok ? (b1[0] * xi[1] - b1[1] * xi[0]) / det : NaN;
      plot.clearLayers();
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        // 变形网格
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.8);
        ctx.lineWidth = 1;
        for (let i = -6; i <= 6; i++) {
          const a = [g1[0] * i - g2[0] * 7, g1[1] * i - g2[1] * 7];
          const b = [g1[0] * i + g2[0] * 7, g1[1] * i + g2[1] * 7];
          ctx.beginPath(); ctx.moveTo(p.X(a[0]), p.Y(a[1])); ctx.lineTo(p.X(b[0]), p.Y(b[1])); ctx.stroke();
          const c = [g2[0] * i - g1[0] * 7, g2[1] * i - g1[1] * 7];
          const d = [g2[0] * i + g1[0] * 7, g2[1] * i + g1[1] * 7];
          ctx.beginPath(); ctx.moveTo(p.X(c[0]), p.Y(c[1])); ctx.lineTo(p.X(d[0]), p.Y(d[1])); ctx.stroke();
        }
        ctx.restore();
        const O = [p.X(0), p.Y(0)];
        // 基向量
        if (state.stage >= 1) {
          D.G.arrow(ctx, [O, [p.X(b1[0]), p.Y(b1[1])]], { color: C('--brand'), width: 2.6, head: 8 });
          D.G.arrow(ctx, [O, [p.X(b2[0]), p.Y(b2[1])]], { color: C('--purple'), width: 2.6, head: 8 });
          D.G.label(ctx, p.X(b1[0]) + 8, p.Y(b1[1]) - 8, 'β₁', { align: 'left', size: 11.5, weight: 800, color: C('--brand') });
          D.G.label(ctx, p.X(b2[0]) + 8, p.Y(b2[1]) - 8, 'β₂', { align: 'left', size: 11.5, weight: 800, color: C('--purple') });
        }
        // ξ 及其分解
        D.G.arrow(ctx, [O, [p.X(xi[0]), p.Y(xi[1])]], { color: C('--red'), width: 3.2, head: 10 });
        D.G.label(ctx, p.X(xi[0]) + 8, p.Y(xi[1]) - 12, 'ξ', { align: 'left', size: 12, weight: 800, color: C('--red') });
        if (state.stage >= 2 && ok) {
          const c1 = [y1 * b1[0], y1 * b1[1]];
          D.G.arrow(ctx, [O, [p.X(c1[0]), p.Y(c1[1])]], { color: D.withAlpha(C('--brand'), 0.85), width: 2, head: 7, dash: [5, 4] });
          D.G.arrow(ctx, [[p.X(c1[0]), p.Y(c1[1])], [p.X(xi[0]), p.Y(xi[1])]], { color: D.withAlpha(C('--purple'), 0.85), width: 2, head: 7, dash: [5, 4] });
          D.G.label(ctx, p.X(c1[0] / 2) - 6, p.Y(c1[1] / 2) + 12, `y₁β₁（y₁=${f3(y1)}）`, { align: 'right', size: 10, color: C('--brand') });
          D.G.label(ctx, (p.X(c1[0]) + p.X(xi[0])) / 2 + 8, (p.Y(c1[1]) + p.Y(xi[1])) / 2 + 12, `y₂β₂（y₂=${f3(y2)}）`, { align: 'left', size: 10, color: C('--purple') });
        }
        // 信息面板
        const lines = [
          `旧基（标准基 e）：ξ = (x₁, x₂) = (${f3(xi[0])}, ${f3(xi[1])})`,
          `新基 β：P = [β₁ β₂] = [[${f3(b1[0])}, ${f3(b2[0])}], [${f3(b1[1])}, ${f3(b2[1])}]]，|P| = ${f3(det)}`,
          ok ? `坐标变换 x = P·y ⇒ y = P⁻¹x = (${f3(y1)}, ${f3(y2)})` : 'β₁、β₂ 共线，不构成基：坐标变换无意义',
          state.stage === 0 ? '网格 = 标准基网格（基向量未显示）' : state.stage === 1 ? '网格正在向新基方向变形…' : '网格 = 新基 β 的坐标网格：ξ 的坐标变为 (y₁, y₂)'
        ];
        ctx.save();
        ctx.font = `700 11px ${D.FONT_SANS}`;
        let tw = 0;
        lines.forEach(t => { tw = Math.max(tw, ctx.measureText(t).width); });
        ctx.restore();
        const panelW = Math.min(p.w - 24, tw + 28), panelH = 14 + lines.length * 17;
        D.G.box(ctx, 12, 10, panelW, panelH, { fill: D.withAlpha(T['--card'], 0.94), stroke: D.withAlpha(T['--line-2'], 0.8), radius: 8 });
        lines.forEach((t, k) => D.G.label(ctx, 22, 27 + k * 17, t, {
          align: 'left', size: 11, weight: k === 0 ? 800 : 600,
          color: k === 0 ? C('--red') : (k === 2 ? C('--accent') : T['--ink-2']), mono: k === 1 || k === 2
        }));
      });
      plot.render();
      UI.readout(out, [
        ['过渡矩阵 P（列 = 新基）', `[[${f3(b1[0])}, ${f3(b2[0])}], [${f3(b1[1])}, ${f3(b2[1])}]]`],
        ['|P|', f3(det)],
        ['旧坐标 x', `(${f3(xi[0])}, ${f3(xi[1])})`],
        ['新坐标 y = P⁻¹x', ok ? `(${f3(y1)}, ${f3(y2)})` : '—（两组向量不构成基）'],
        ['核验', ok ? `P·y = (${f3(b1[0] * y1 + b2[0] * y2)}, ${f3(b1[1] * y1 + b2[1] * y2)}) = x ✓` : '—']
      ]);
    }
    render();
    return s;
  };

})(window);
