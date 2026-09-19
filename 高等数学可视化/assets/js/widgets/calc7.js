/* ============================================================
   calc7.js — 第7章 无穷级数 可视化组件
   seriesPartial：级数部分和与收敛性
   powerSeries：幂级数的收敛半径与和函数
   taylorApprox：泰勒/麦克劳林展开逼近
   fourierSeries：傅里叶级数逼近
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3, f4 } = UI;

  /* ---------- 级数部分和 ---------- */
  W.seriesPartial = function (host) {
    const s = UI.shellPlot(host, {
      xMin: 0, xMax: 60, yMin: -0.3, yMax: 2.4,
      height: 300, xLabel: 'n（项数）', yLabel: 'Sₙ', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { which: 'geo', n: 40 };
    UI.seg(ctrl, [
      { label: '几何级数 Σ(1/2)ⁿ', value: 'geo' },
      { label: '调和级数 Σ1/n', value: 'har' },
      { label: 'p 级数 Σ1/n²', value: 'p2' },
      { label: '交错级数 Σ(−1)ⁿ⁻¹/n', value: 'alt' }
    ], v => { state.which = v; render(); }, 0);
    UI.slider(ctrl, { label: '项数 n', min: 5, max: 200, step: 1, value: 40, fmt: v => v, onInput: v => { state.n = v; render(); } });

    function term(k) {
      switch (state.which) {
        case 'geo': return Math.pow(0.5, k);
        case 'har': return 1 / k;
        case 'p2': return 1 / (k * k);
        default: return Math.pow(-1, k - 1) / k;
      }
    }
    function limit() {
      switch (state.which) {
        case 'geo': return 1;
        case 'har': return Infinity;
        case 'p2': return Math.PI * Math.PI / 6;
        default: return Math.LN2;
      }
    }

    function render() {
      const T = D.Theme.cache;
      const N = Math.max(state.n, 60);
      const pts = [[0, 0]];
      let S = 0;
      for (let k = 1; k <= N; k++) { S += term(k); pts.push([k, S]); }
      plot.clearLayers();
      plot.o.xMax = N; plot.o.yMin = -0.2; plot.o.yMax = Math.min(3.2, Math.max(1.4, S + 0.5));
      const L = limit();
      if (isFinite(L)) {
        plot.hline(L, { color: T['--accent'], dash: [5, 4] });
        plot.note(N * 0.98, L + 0.06, `和 = ${L.toFixed(6)}`, { align: 'right', color: T['--accent'], size: 11 });
      } else {
        plot.note(N * 0.5, plot.o.yMax * 0.85, '部分和持续增长：级数发散', { align: 'center', color: T['--red'], size: 12 });
      }
      plot.polyline(pts, { color: T['--brand'], width: 2.2 });
      for (let k = 1; k <= Math.min(12, N); k++) plot.dot(k, pts[k][1], { color: T['--brand'], r: 2.6, ring: false });
      plot.render();
      UI.readout(out, [
        ['级数', { geo: 'Σ (1/2)ⁿ', har: 'Σ 1/n', p2: 'Σ 1/n²', alt: 'Σ (−1)ⁿ⁻¹/n' }[state.which]],
        ['敛散性', isFinite(L) ? '收敛' : '发散'],
        ['Sₙ（当前）', pts[state.n][1].toFixed(6)],
        ['极限和', isFinite(L) ? L.toFixed(6) : '∞']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 幂级数 ---------- */
  W.powerSeries = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -1.6, xMax: 1.6, yMin: -2.4, yMax: 4.4,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { n: 12 };
    UI.slider(ctrl, { label: '部分和项数 n', min: 1, max: 60, step: 1, value: 12, fmt: v => v, onInput: v => { state.n = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      const n = state.n;
      plot.clearLayers();
      // 收敛区间
      plot.custom((p, ctx) => {
        ctx.save();
        ctx.fillStyle = D.withAlpha(C('--accent'), 0.09);
        ctx.fillRect(p.X(-1), p.py, p.X(1) - p.X(-1), p.ph);
        ctx.restore();
      });
      plot.curve(x => 1 / (1 - x), { color: T['--accent'], width: 2.4, from: -1.55, to: 0.94, clipY: true });
      plot.curve(x => 1 / (1 - x), { color: D.withAlpha(T['--accent'], 0.4), width: 1.6, from: 1.06, to: 1.6, clipY: true });
      plot.curve(x => {
        let S = 0;
        for (let k = 0; k <= n; k++) S += Math.pow(x, k);
        return S;
      }, { color: T['--brand'], width: 2.2, from: -1.55, to: 1.55 });
      plot.vline(-1, { color: D.withAlpha(T['--red'], 0.6), dash: [4, 4] });
      plot.vline(1, { color: D.withAlpha(T['--red'], 0.6), dash: [4, 4] });
      plot.note(-1.05, plot.o.yMax - 0.4, 'x = −1', { align: 'right', color: T['--red'], size: 10.5 });
      plot.note(1.05, plot.o.yMax - 0.4, 'x = 1', { align: 'left', color: T['--red'], size: 10.5 });
      plot.note(0, plot.o.yMax - 0.4, '收敛区间 (−1, 1)', { align: 'center', color: T['--accent'], size: 11 });
      plot.render();
      UI.readout(out, [
        ['幂级数', 'Σₙ₌₀^∞ xⁿ = 1/(1−x)'],
        ['收敛半径 R', '1（|x| < 1 收敛）'],
        ['部分和项数', String(n)],
        ['端点', 'x = ±1 时通项不趋于 0，发散']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 泰勒展开 ---------- */
  W.taylorApprox = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -6.4, xMax: 6.4, yMin: -2.4, yMax: 2.4,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 8, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { which: 'sin', n: 3 };
    UI.seg(ctrl, [
      { label: 'sin x', value: 'sin' }, { label: 'eˣ', value: 'exp' }, { label: 'ln(1+x)', value: 'ln' }
    ], v => { state.which = v; render(); }, 0);
    UI.slider(ctrl, { label: '展开阶数 n', min: 0, max: 14, step: 1, value: 3, fmt: v => v, onInput: v => { state.n = v; render(); } });

    function taylor(x, n) {
      let S = 0;
      if (state.which === 'sin') {
        for (let k = 0; k <= n; k++) S += Math.pow(-1, k) * Math.pow(x, 2 * k + 1) / fact(2 * k + 1);
      } else if (state.which === 'exp') {
        for (let k = 0; k <= n; k++) S += Math.pow(x, k) / fact(k);
      } else {
        for (let k = 1; k <= n + 1; k++) S += Math.pow(-1, k - 1) * Math.pow(x, k) / k;
      }
      return S;
    }
    function fact(k) { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; }

    function render() {
      const T = D.Theme.cache;
      const n = state.n;
      plot.clearLayers();
      const f = state.which === 'sin' ? Math.sin : state.which === 'exp' ? Math.exp : (x => Math.log(1 + x));
      plot.curve(f, { color: T['--accent'], width: 2.6, from: state.which === 'ln' ? -0.94 : -6.4, to: 6.4, clipY: true });
      plot.curve(x => taylor(x, n), { color: T['--brand'], width: 2.2, from: -6.4, to: 6.4, clipY: true });
      plot.vline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
      plot.custom((p, ctx) => {
        ctx.save(); ctx.fillStyle = C('--brand'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.fillText('蓝色：n 阶泰勒多项式', p.px + 8, p.py + 14);
        ctx.fillStyle = C('--accent'); ctx.fillText('橙色：原函数', p.px + 8, p.py + 30);
        ctx.restore();
      });
      plot.render();
      const x0 = 2.5;
      const err = Math.abs(f(x0) - taylor(x0, n));
      UI.readout(out, [
        ['函数', state.which === 'sin' ? 'sin x' : state.which === 'exp' ? 'eˣ' : 'ln(1+x)'],
        ['展开阶数 n', String(n)],
        ['在 x = 2.5 处的误差', err.toExponential(3)],
        ['说明', '阶数越高、离展开点越近，逼近越好；收敛半径决定有效范围']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 傅里叶级数 ---------- */
  W.fourierSeries = function (host) {
    const s = UI.shellPlot(host, {
      xMin: -6.4, xMax: 6.4, yMin: -1.8, yMax: 1.8,
      height: 300, xLabel: 'x', yLabel: 'y', xTicks: 8, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { n: 1, wave: 'square' };
    UI.seg(ctrl, [{ label: '方波', value: 'square' }, { label: '锯齿波', value: 'saw' }], v => { state.wave = v; render(); }, 0);
    UI.slider(ctrl, { label: '谐波数 N', min: 1, max: 40, step: 1, value: 1, fmt: v => v, onInput: v => { state.n = v; render(); } });

    function target(x) {
      if (state.wave === 'square') {
        const t = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return t < Math.PI ? 1 : -1;
      }
      const t = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      return (t / Math.PI) - 1;
    }
    function approx(x, N) {
      let S = 0;
      if (state.wave === 'square') {
        for (let k = 1; k <= N; k++) { const m = 2 * k - 1; S += 4 / Math.PI * Math.sin(m * x) / m; }
      } else {
        for (let k = 1; k <= N; k++) S += 2 / Math.PI * Math.pow(-1, k + 1) * Math.sin(k * x) / k;
      }
      return S;
    }

    function render() {
      const T = D.Theme.cache;
      const N = state.n;
      plot.clearLayers();
      plot.curve(target, { color: T['--accent'], width: 2.6, from: -6.4, to: 6.4, samples: 800 });
      plot.curve(x => approx(x, N), { color: T['--brand'], width: 2.2, from: -6.4, to: 6.4, samples: 800 });
      plot.custom((p, ctx) => {
        ctx.save(); ctx.fillStyle = C('--brand'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.fillText(`N = ${N} 项傅里叶级数`, p.px + 8, p.py + 14);
        ctx.fillStyle = C('--accent'); ctx.fillText('原波形（分片连续）', p.px + 8, p.py + 30);
        ctx.restore();
      });
      plot.render();
      const err = N < 60 ? Math.abs(target(0.4) - approx(0.4, N)) : 0;
      UI.readout(out, [
        ['波形', state.wave === 'square' ? '方波' : '锯齿波'],
        ['谐波数 N', String(N)],
        ['收敛性', '均方收敛；间断点处收敛于左右极限的平均值（狄利克雷定理）'],
        ['吉布斯现象', '间断点附近始终有过冲，N 越大过冲越窄但幅度不消失']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 正项级数判别法 ---------- */
  W.seriesTests = function (host) {
    const s = UI.shellPlot(host, {
      xMin: 0.4, xMax: 31, yMin: 0, yMax: 3,
      height: 310, xLabel: 'n', yLabel: 'Sₙ', xTicks: 6, yTicks: 6
    });
    const { plot, ctrl, out } = s;
    const state = { key: 'fact', p: 1.5 };
    const N = 30;

    const CASES = {
      fact: {
        label: 'Σ 1 / n!', test: '比值判别法',
        note: 'ρ = lim uₙ₊₁/uₙ = 0 < 1，级数收敛（和 = e − 1 ≈ 1.71828）',
        conv: () => true
      },
      pow: {
        label: 'Σ n! / nⁿ', test: '比值判别法',
        note: 'ρ = lim uₙ₊₁/uₙ = 1/e < 1，级数收敛',
        conv: () => true
      },
      root: {
        label: 'Σ ( n / (2n+1) )ⁿ', test: '根值判别法',
        note: 'ρ = lim ⁿ√uₙ = 1/2 < 1，级数收敛',
        conv: () => true
      },
      one: {
        label: 'Σ 1 / n', test: '比值/根值均失效（ρ = 1）',
        note: '调和级数：ρ = 1 判别法失效，但部分和 → +∞，发散',
        conv: () => false
      },
      p: {
        label: 'Σ 1 / nᵖ', test: '比较判别法 / 积分判别法',
        note: 'p 级数：p > 1 收敛，p ≤ 1 发散（ρ = 1 时比值、根值均失效）',
        conv: () => state.p > 1
      }
    };

    function terms(key, count) {
      const arr = [];
      if (key === 'fact') { let t = 1; for (let n = 1; n <= count; n++) { t = t / n; arr.push(t); } }
      else if (key === 'pow') { for (let n = 1; n <= count; n++) arr.push(Math.exp(D.M.lfact(n) - n * Math.log(n))); }
      else if (key === 'root') { for (let n = 1; n <= count; n++) { const r = n / (2 * n + 1); arr.push(Math.pow(r, n)); } }
      else if (key === 'one') { for (let n = 1; n <= count; n++) arr.push(1 / n); }
      else { const p = state.p; for (let n = 1; n <= count; n++) arr.push(1 / Math.pow(n, p)); }
      return arr;
    }

    UI.seg(ctrl, [
      { label: 'Σ1/n!', value: 'fact' }, { label: 'Σn!/nⁿ', value: 'pow' },
      { label: 'Σ(n/(2n+1))ⁿ', value: 'root' }, { label: 'Σ1/n', value: 'one' },
      { label: 'p 级数', value: 'p' }
    ], v => { state.key = v; syncP(); render(true); }, 0);
    const pS = UI.slider(ctrl, {
      label: 'p', min: 0.2, max: 3, step: 0.1, value: 1.5,
      fmt: v => v.toFixed(1), onInput: v => { state.p = v; render(false); }
    });
    function syncP() { pS.input.parentElement.style.display = state.key === 'p' ? '' : 'none'; }

    function render(animate) {
      const T = D.Theme.cache;
      const key = state.key, C1 = CASES[key];
      const u = terms(key, N);
      const S = []; let acc = 0;
      u.forEach(t => { acc += t; S.push(acc); });
      const deep = terms(key, key === 'p' && state.p <= 1.05 ? 4000 : 600);
      let deepSum = 0; deep.forEach(t => { deepSum += t; });
      if (key === 'p' && state.p > 1) {
        const Nt = deep.length;
        deepSum += Math.pow(Nt, 1 - state.p) / (state.p - 1) + 0.5 * Math.pow(Nt, -state.p);
      }
      const rhoR = u[N - 2] > 0 ? u[N - 1] / u[N - 2] : 0;
      const rhoC = Math.pow(u[N - 1], 1 / N);
      const conv = C1.conv();
      plot.clearLayers();
      plot.o.yMax = key === 'p' ? Math.max(3.2, S[N - 1] * 1.5) : Math.max(2.9, S[N - 1] * 1.1);
      plot.custom((p, ctx) => {
        // 通项柱（下方小尺度）
        const u1 = u[0] || 1;
        const barScale = 0.13 * (p.o.yMax) / Math.max(u1, 1e-9);
        ctx.save();
        for (let i = 0; i < N; i++) {
          const x = p.X(i + 1), w = Math.max(1.5, p.pw / N * 0.55);
          const hgt = Math.min(0.14 * p.o.yMax, u[i] * barScale);
          ctx.fillStyle = D.withAlpha(T['--ink-3'], 0.35);
          ctx.fillRect(x - w / 2, p.Y(0) - hgt * (p.ph / (p.o.yMax - p.o.yMin)), w, hgt * (p.ph / (p.o.yMax - p.o.yMin)));
        }
        ctx.restore();
      });
      plot.custom((p, ctx) => {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2.2; ctx.strokeStyle = T['--brand'];
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        S.forEach((v, i) => i ? ctx.lineTo(p.X(i + 1), p.Y(v)) : ctx.moveTo(p.X(1), p.Y(v)));
        ctx.stroke(); ctx.restore();
      });
      plot.custom((p, ctx) => {
        S.forEach((v, i) => {
          ctx.save();
          ctx.fillStyle = i === S.length - 1 ? C('--red') : (i % 2 ? C('--purple') : C('--brand'));
          ctx.beginPath(); ctx.arc(p.X(i + 1), p.Y(v), i === S.length - 1 ? 4.4 : 2.6, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
      });
      plot.hline(0, { color: D.withAlpha(T['--line-2'], 0.9) });
      if (conv) {
        plot.hline(deepSum, { color: T['--green'], dash: [5, 4] });
        plot.note(30.6, deepSum + 0.05 * (plot.o.yMax / 3), `S ≈ ${deepSum.toFixed(5)}`, { align: 'right', color: T['--green'], size: 11 });
      } else {
        plot.note(15.5, plot.o.yMax * 0.9, '部分和持续上升，无上界 ⇒ 发散', { align: 'center', color: T['--red'], size: 11.5 });
      }
      plot.note(2, plot.o.yMax * (key === 'p' ? 0.64 : 0.86), `${C1.label}　（柱形为通项 uₙ）`, { align: 'left', color: T['--ink-2'], size: 11 });
      if (key === 'p') drawPAxis(plot, T);
      if (animate) plot.animate(430); else plot.render();
      UI.readout(out, [
        ['级数', C1.label],
        ['判别法', C1.test],
        ['ρ 估计（n = 30）', key === 'one' ? `比值 ${rhoR.toFixed(4)}，根值 ${rhoC.toFixed(4)}（极限为 1，失效）` : key === 'p' ? `比值 ${rhoR.toFixed(4)}，根值 ${rhoC.toFixed(4)}（p 级数极限恒为 1）` : `比值 ${rhoR.toFixed(4)}，根值 ${rhoC.toFixed(4)}`],
        ['部分和 S₃₀', S[N - 1].toFixed(5)],
        ['结论', key === 'p' ? (state.p > 1 ? `p = ${state.p.toFixed(1)} > 1：收敛` : `p = ${state.p.toFixed(1)} ≤ 1：发散`) : (conv ? `收敛（估计和 ${deepSum.toFixed(5)}）` : '发散（部分和无上界）')],
        ['要点', C1.note]
      ]);
    }

    function drawPAxis(plot2, T) {
      plot2.custom((p, ctx) => {
        const x0 = p.px + 12, x1 = p.px + p.pw - 12, yA = p.py + 20;
        const px = v => x0 + (v - 0) / 3 * (x1 - x0);
        ctx.save();
        ctx.strokeStyle = D.withAlpha(C('--green'), 0.9); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(px(1), yA); ctx.lineTo(px(3), yA); ctx.stroke();
        ctx.strokeStyle = D.withAlpha(C('--red'), 0.9);
        ctx.beginPath(); ctx.moveTo(px(0), yA); ctx.lineTo(px(1), yA); ctx.stroke();
        ctx.fillStyle = C('--ink-3'); ctx.font = '600 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        [0, 0.5, 1, 1.5, 2, 2.5, 3].forEach(v => {
          ctx.beginPath(); ctx.moveTo(px(v), yA - 3); ctx.lineTo(px(v), yA + 3); ctx.strokeStyle = C('--ink-3'); ctx.lineWidth = 1; ctx.stroke();
          ctx.fillText(v.toFixed(1), px(v), yA + 6);
        });
        const cur = state.p;
        ctx.beginPath();
        ctx.moveTo(px(cur), yA - 12); ctx.lineTo(px(cur) - 5, yA - 20); ctx.lineTo(px(cur) + 5, yA - 20);
        ctx.closePath(); ctx.fillStyle = C('--accent'); ctx.fill();
        ctx.font = '700 10.5px ' + D.FONT_SANS; ctx.fillStyle = C('--accent');
        ctx.textBaseline = 'bottom';
        ctx.fillText(`p = ${cur.toFixed(1)}`, px(cur), yA - 22);
        ctx.font = '700 10px ' + D.FONT_SANS;
        ctx.fillStyle = D.withAlpha(C('--red'), 0.95);
        ctx.fillText('发散', px(0.5), yA - 4);
        ctx.fillStyle = D.withAlpha(C('--green'), 0.95);
        ctx.fillText('收敛', px(2.2), yA - 4);
        ctx.restore();
      });
    }

    syncP();
    render(true);
    return s;
  };

  /* ---------- 交错级数与莱布尼茨判别法 ---------- */
  W.leibnizTest = function (host) {
    const s = UI.shellPlot(host, {
      xMin: 0.4, xMax: 40.6, yMin: 0.15, yMax: 1.12,
      height: 310, xLabel: 'n', yLabel: 'Sₙ', xTicks: 8, yTicks: 5
    });
    const { plot, ctrl, out } = s;
    const state = { key: 'harm', n: 12 };
    const CASES = {
      harm: { label: 'Σ (−1)ⁿ⁻¹ / n', u: n => 1 / n, L: Math.log(2), LText: 'ln 2' },
      sq: { label: 'Σ (−1)ⁿ⁻¹ / n²', u: n => 1 / (n * n), L: Math.PI * Math.PI / 12, LText: 'π²/12' },
      sqrt: { label: 'Σ (−1)ⁿ⁻¹ / √n', u: n => 1 / Math.sqrt(n), L: 0.6048986434216304, LText: '(1 − √2)ζ(1/2)' }
    };

    UI.seg(ctrl, [
      { label: '1/n', value: 'harm' }, { label: '1/n²', value: 'sq' }, { label: '1/√n', value: 'sqrt' }
    ], v => { state.key = v; render(true); }, 0);
    const nS = UI.slider(ctrl, {
      label: '项数 n', min: 1, max: 40, step: 1, value: 12,
      fmt: v => v, onInput: v => { tr.go(v - 1); }
    });
    const tr = UI.transport(ctrl, { total: 40, speed: 130, onChange: k => { state.n = k + 1; nS.set(state.n); render(false); } });
    tr.go(11);

    function render(animate) {
      const T = D.Theme.cache;
      const C1 = CASES[state.key];
      const n = state.n;
      const u = [], S = [];
      let acc = 0;
      for (let i = 1; i <= 40; i++) { u.push(C1.u(i)); acc += (i % 2 ? 1 : -1) * C1.u(i); S.push(acc); }
      const Sn = S[n - 1];
      const err = Math.abs(C1.L - Sn);
      const bound = C1.u(n + 1);
      plot.clearLayers();
      plot.custom((p, ctx) => {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1.8; ctx.strokeStyle = D.withAlpha(T['--brand'], 0.75);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        S.forEach((v, i) => i ? ctx.lineTo(p.X(i + 1), p.Y(v)) : ctx.moveTo(p.X(1), p.Y(v)));
        ctx.stroke(); ctx.restore();
      });
      plot.custom((p, ctx) => {
        S.forEach((v, i) => {
          ctx.save();
          ctx.fillStyle = (i + 1) % 2 ? C('--brand') : C('--purple');
          const r = (i + 1) === n ? 5 : 2.8;
          ctx.beginPath(); ctx.arc(p.X(i + 1), p.Y(v), r, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
        // 通项柱
        ctx.save();
        u.forEach((t, i) => {
          const x = p.X(i + 1), w = Math.max(1.5, p.pw / 40 * 0.5);
          const hgt = t * (p.ph / (p.o.yMax - p.o.yMin)) * (i + 1 === n ? 0.16 : 0.1);
          ctx.fillStyle = (i + 1) === n ? D.withAlpha(C('--red'), 0.6) : D.withAlpha(T['--ink-3'], 0.3);
          ctx.fillRect(x - w / 2, p.Y(p.o.yMin) - hgt, w, hgt);
        });
        ctx.restore();
      });
      plot.hline(C1.L, { color: T['--green'], dash: [5, 4] });
      plot.hline(1, { color: D.withAlpha(T['--accent'], 0.6), dash: [4, 4] });
      plot.vline(n, { color: D.withAlpha(T['--red'], 0.5) });
      plot.dot(n, Sn, { color: T['--red'] });
      plot.note(40.4, C1.L + 0.03, `S = ${C1.LText} ≈ ${C1.L.toFixed(6)}`, { align: 'right', color: T['--green'], size: 10.5 });
      plot.note(40.4, 1.03, 'S ≤ u₁ = 1', { align: 'right', color: T['--accent'], size: 10.5 });
      plot.note(n + 0.4, Sn + 0.05, `S${n} = ${Sn.toFixed(5)}`, { align: 'left', color: T['--red'], size: 10.5 });
      plot.note(1.2, 0.98, '蓝点（奇数项部分和）下降，紫点（偶数项部分和）上升，夹逼到同一极限 S', { align: 'left', color: T['--ink-2'], size: 10.5 });
      if (animate) plot.animate(430); else plot.render();
      let sOdd = 0, sEven = 0;
      for (let i = 1; i <= n; i++) { if (i % 2) sOdd = S[i - 1]; else sEven = S[i - 1]; }
      UI.readout(out, [
        ['级数', C1.label + '（uₙ = ' + (state.key === 'harm' ? '1/n' : state.key === 'sq' ? '1/n²' : '1/√n') + ' 单调减少且趋于 0）'],
        ['部分和 Sₙ', Sn.toFixed(6)],
        ['极限 S', `${C1.LText} ≈ ${C1.L.toFixed(6)}`],
        ['余项 |S − Sₙ|', `${err.toFixed(6)} ≤ u${n + 1} = ${bound.toFixed(6)}`],
        ['上下夹逼', `S_奇 = ${sOdd.toFixed(5)}（下界方向），S_偶 = ${sEven.toFixed(5)}（上界方向）`],
        ['结论', '莱布尼茨判别法：uₙ 单调减少且 uₙ → 0 ⇒ 交错级数收敛']
      ]);
    }
    render(true);
    return s;
  };

})(window);
