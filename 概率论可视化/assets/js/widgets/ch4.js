/* ============================================================
   ch4.js (widgets) — 第四章 随机变量的数字特征 可视化组件
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI, S = global.Stats;
  const { C, f2, f3, f4 } = UI;

  /* ================================================================
     4.1 期望＝分布的「重心」
     ================================================================ */
  W.expectation = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    // 三个取值点，概率可调（自动归一化）
    let xs = [-2, 0, 3];
    let w = [0.25, 0.35, 0.40];

    function norm() {
      const s = w[0] + w[1] + w[2];
      if (s <= 0) { w = [1 / 3, 1 / 3, 1 / 3]; return; }
      w = w.map(v => v / s);
    }
    function EX() { return xs[0] * w[0] + xs[1] * w[1] + xs[2] * w[2]; }

    const s0 = UI.slider(ctrl, { label: 'P(X=−2)', min: 0, max: 1, step: 0.01, value: w[0], fmt: v => v.toFixed(2), onInput: v => { w[0] = v; norm(); sync(); draw(); } });
    const s1 = UI.slider(ctrl, { label: 'P(X=0)', min: 0, max: 1, step: 0.01, value: w[1], fmt: v => v.toFixed(2), onInput: v => { w[1] = v; norm(); sync(); draw(); } });
    const s2 = UI.slider(ctrl, { label: 'P(X=3)', min: 0, max: 1, step: 0.01, value: w[2], fmt: v => v.toFixed(2), onInput: v => { w[2] = v; norm(); sync(); draw(); } });

    function sync() { s0.set(w[0]); s1.set(w[1]); s2.set(w[2]); }

    function draw() {
      const T = D.Theme.cache;
      const mu = EX();
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 60, padR = 40, padT = 60, padB = 90;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const xMin = -3.2, xMax = 4.2;
        const X = v => padL + (v - xMin) / (xMax - xMin) * pw;
        const midY = padT + ph * 0.45;

        // 数轴
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(padL + pw, midY); ctx.stroke();
        // 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let v = -3; v <= 4; v++) {
          const x = X(v);
          ctx.beginPath(); ctx.moveTo(x, midY - 4); ctx.lineTo(x, midY + 4);
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1; ctx.stroke();
          ctx.fillText(v, x, midY + 8);
        }

        // 质点：半径按概率开方
        const maxW = Math.max(...w, 0.01);
        xs.forEach((xv, i) => {
          const x = X(xv);
          const r = 10 + 26 * Math.sqrt(w[i] / Math.max(maxW, 1e-9));
          const col = [C('--brand'), C('--green'), C('--accent')][i];
          ctx.beginPath(); ctx.arc(x, midY, r, 0, D.TAU);
          ctx.fillStyle = D.withAlpha(col, 0.55);
          ctx.fill();
          ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(f2(w[i]), x, midY);
          // 取值标签
          ctx.fillStyle = col; ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textBaseline = 'bottom';
          ctx.fillText('x=' + xv, x, midY - r - 5);
        });

        // 期望支点（三角）
        const mx = X(mu);
        ctx.beginPath();
        ctx.moveTo(mx, midY + 2);
        ctx.lineTo(mx - 9, midY + 34);
        ctx.lineTo(mx + 9, midY + 34);
        ctx.closePath();
        ctx.fillStyle = C('--purple'); ctx.fill();
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.5; ctx.stroke();
        // 竖直参考线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = D.withAlpha(C('--purple'), 0.7); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(mx, padT - 6); ctx.lineTo(mx, midY + 34); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--purple'); ctx.font = '800 13px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('E(X) = ' + mu.toFixed(3), mx, padT - 10);

        // 标题
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('数轴上的「质点系」：概率＝质量，期望＝重心（支点）', padL, 10);

        // 底部：加权求和展开
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '600 11px ' + D.FONT_MONO;
        const terms = xs.map((v, i) => '(' + v + ')×' + w[i].toFixed(2));
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('E(X) = ' + terms.join(' + ') + ' = ' + mu.toFixed(4), padL, H_ - 34);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillText('拖动概率滑块（自动归一化），观察支点位置的变化', padL, H_ - 16);
      });
      scene.static();

      const mu2 = EX();
      const ex2 = xs[0] * xs[0] * w[0] + xs[1] * xs[1] * w[1] + xs[2] * xs[2] * w[2];
      UI.readout(out, [
        ['Σp 检验', f4(w[0] + w[1] + w[2])],
        ['E(X)', f4(mu2)],
        ['E(X²)', f4(ex2)],
        ['D(X)', f4(ex2 - mu2 * mu2)]
      ]);
    }
    draw();
  };

  /* ================================================================
     4.2 方差＝离散程度
     ================================================================ */
  W.variance = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let mode = 'binom', n = 8, p = 0.5, spread = 1;

    UI.seg(ctrl, [
      { label: '二项 B(n,p)', value: 'binom' },
      { label: '正态 N(0,σ²)', value: 'normal' }
    ], v => { mode = v; draw(); }, 0);

    const sN = UI.slider(ctrl, { label: 'n', min: 2, max: 20, value: n, onInput: v => { n = v; draw(); } });
    const sP = UI.slider(ctrl, { label: 'p', min: 0.05, max: 0.95, step: 0.01, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; draw(); } });
    const sS = UI.slider(ctrl, { label: 'σ', min: 0.3, max: 3, step: 0.1, value: spread, fmt: v => v.toFixed(1), onInput: v => { spread = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 40, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        let mu, vr, pts = null;

        if (mode === 'binom') {
          mu = S.binom.mean(n, p);
          vr = S.binom.varr(n, p);
          pts = [];
          for (let k = 0; k <= n; k++) pts.push([k, S.binom.pmf(k, n, p)]);
        } else {
          mu = 0; vr = spread * spread;
          pts = [];
        }

        const X0 = padL, X1 = padL + pw;
        const maxP = mode === 'binom' ? Math.max(...pts.map(q => q[1]), 1e-6) : D.M.normPdf(0, 0, spread);

        const X = v => mode === 'binom'
          ? X0 + (v + 0.5) / (n + 1) * pw
          : X0 + (v + 4 * spread) / (8 * spread) * pw;
        const Y = pv => padT + ph - pv / maxP * ph * 0.92;

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(X1, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 7, y);
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(X1, padT + ph + .5); ctx.stroke();

        // 分布形态
        if (mode === 'binom') {
          const bw = Math.min(40, pw / (n + 1) * 0.6);
          pts.forEach(([k, pv]) => {
            const cx = X(k), h = (padT + ph) - Y(pv);
            if (h < 0.3) return;
            ctx.beginPath();
            D.roundRectPath(ctx, cx - bw / 2, Y(pv), bw, h, 3);
            const g = ctx.createLinearGradient(0, Y(pv), 0, padT + ph);
            g.addColorStop(0, D.withAlpha(C('--brand'), 0.9));
            g.addColorStop(1, D.withAlpha(C('--brand'), 0.4));
            ctx.fillStyle = g; ctx.fill();
          });
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          for (let k = 0; k <= n; k++) if (n <= 12 || k % 2 === 0) ctx.fillText(k, X(k), padT + ph + 6);
        } else {
          ctx.beginPath();
          ctx.moveTo(X(-4 * spread), padT + ph);
          for (let i = 0; i <= 300; i++) {
            const v = -4 * spread + 8 * spread * i / 300;
            ctx.lineTo(X(v), Y(D.M.normPdf(v, 0, spread)));
          }
          ctx.lineTo(X(4 * spread), padT + ph);
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.3); ctx.fill();
          ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          for (let i = 0; i <= 6; i++) {
            const v = -4 * spread + 8 * spread * i / 6;
            ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
          }
        }

        // 期望竖线 + ±σ 区间
        const mx = X(mu);
        const sg = Math.sqrt(vr);
        ctx.save();
        // ±σ 阴影带
        ctx.beginPath();
        ctx.rect(X(mu - sg), padT, X(mu + sg) - X(mu - sg), ph);
        ctx.fillStyle = D.withAlpha(C('--green'), 0.12);
        ctx.fill();
        // 竖线
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(mx, padT); ctx.lineTo(mx, padT + ph); ctx.stroke();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = D.withAlpha(C('--green'), 0.6); ctx.lineWidth = 1.2;
        [mu - sg, mu + sg].forEach(v => {
          ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), padT + ph); ctx.stroke();
        });
        ctx.restore();

        ctx.fillStyle = C('--green'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('E(X)=' + mu.toFixed(2), mx, padT - 6);
        ctx.fillStyle = D.withAlpha(C('--green'), 0.9);
        ctx.font = '600 10px ' + D.FONT_MONO;
        ctx.fillText('±σ 带（σ=' + sg.toFixed(2) + '）', mx, padT + ph + 22);

        // 标题
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(mode === 'binom' ? '二项分布：p 越接近 0.5、n 越大，分布越「胖」' : '正态分布：σ 就是「胖瘦」的直接度量', padL, 10);

        // 底部公式
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + D.FONT_MONO;
        ctx.fillText(mode === 'binom'
          ? 'D(X) = np(1−p) = ' + vr.toFixed(4)
          : 'D(X) = σ² = ' + vr.toFixed(4), padL, H_ - 8);
      });
      scene.static();

      const muA = mode === 'binom' ? S.binom.mean(n, p) : 0;
      const vrA = mode === 'binom' ? S.binom.varr(n, p) : spread * spread;
      UI.readout(out, [
        ['分布', mode === 'binom' ? 'B(' + n + ', ' + p.toFixed(2) + ')' : 'N(0, ' + (spread * spread).toFixed(2) + ')'],
        ['E(X)', f4(muA)],
        ['D(X)', f4(vrA)],
        ['标准差 σ', f4(Math.sqrt(vrA))],
        ['±σ 范围', '[' + (muA - Math.sqrt(vrA)).toFixed(2) + ', ' + (muA + Math.sqrt(vrA)).toFixed(2) + ']']
      ]);
    }
    draw();
  };

  /* ================================================================
     4.3 E[g(X)]：直接法 vs 分布法
     ================================================================ */
  W.functionExpectation = function (host) {
    const gs = {
      'g(x) = x²': { g: x => x * x, label: 'x²' },
      'g(x) = 2ˣ': { g: x => Math.pow(2, x), label: '2^x' },
      'g(x) = |x|': { g: x => Math.abs(x), label: '|x|' },
      'g(x) = 1/(1+x²)': { g: x => 1 / (1 + x * x), label: '1/(1+x²)' }
    };
    let key = 'g(x) = x²';
    const { ctrl, out, scene } = UI.shell(host, 320);

    UI.seg(ctrl, Object.keys(gs).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 0);

    // X 的分布（离散，取值 -2..2）
    const XS = [-2, -1, 0, 1, 2];
    const PS = [0.1, 0.2, 0.4, 0.2, 0.1];

    function direct() {
      const g = gs[key].g;
      let s = 0;
      XS.forEach((x, i) => { s += g(x) * PS[i]; });
      return s;
    }
    /** 分布法：先求 Y=g(X) 的分布律，再按定义求期望 */
    function byDist() {
      const g = gs[key].g;
      const map = new Map();
      XS.forEach((x, i) => {
        const y = g(x);
        const kk = y.toFixed(10);
        map.set(kk, { y, p: (map.get(kk) ? map.get(kk).p : 0) + PS[i] });
      });
      const arr = [...map.values()].sort((a, b) => a.y - b.y);
      const E = arr.reduce((s, o) => s + o.y * o.p, 0);
      return { arr, E };
    }

    function draw() {
      const T = D.Theme.cache;
      const g = gs[key].g;
      const bd = byDist();

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 44, padB = 46, padL = 52, padR = 24;
        const gap = 34;
        const w1 = (W_ - padL - padR - gap) / 2;
        const hAll = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('左：X 的分布律    右：Y = g(X) 的分布律（合并同值）', padL, padT - 10);

        const maxP = Math.max(...PS, ...bd.arr.map(o => o.p));

        function panel(bx, items, title, color, showX) {
          const bw = Math.min(46, w1 / items.length * 0.62);
          const colW = w1 / items.length;
          // 网格
          ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1;
          for (let i = 0; i <= 4; i++) {
            const y = padT + hAll * i / 4;
            ctx.beginPath(); ctx.moveTo(bx, y + .5); ctx.lineTo(bx + w1, y + .5); ctx.stroke();
          }
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(bx, padT + hAll + .5); ctx.lineTo(bx + w1, padT + hAll + .5); ctx.stroke();

          items.forEach((it, i) => {
            const cx = bx + colW * (i + 0.5);
            const h = it.p / maxP * hAll * 0.9;
            if (h < 0.3) return;
            ctx.beginPath();
            D.roundRectPath(ctx, cx - bw / 2, padT + hAll - h, bw, h, 3);
            const gr = ctx.createLinearGradient(0, padT + hAll - h, 0, padT + hAll);
            gr.addColorStop(0, D.withAlpha(C(color), 0.9));
            gr.addColorStop(1, D.withAlpha(C(color), 0.4));
            ctx.fillStyle = gr; ctx.fill();
            // 概率值
            ctx.fillStyle = T['--ink-2']; ctx.font = '600 9.5px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(it.p.toFixed(2), cx, padT + hAll - h - 3);
            // 横轴标签
            ctx.fillStyle = T['--ink-3']; font10(ctx);
            ctx.textBaseline = 'top';
            ctx.fillText(D.niceNum(it.v), cx, padT + hAll + 6);
          });

          ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText(title, bx, padT + hAll + 26);
        }
        function font10(ctx) { ctx.font = '500 10px ' + D.FONT_MONO; }

        panel(padL, XS.map((v, i) => ({ v, p: PS[i] })), 'X 的分布律', '--brand');
        // 右侧面板：y 可能不是整数，用下标
        const rx = padL + w1 + gap;
        const items2 = bd.arr.map(o => ({ v: o.y, p: o.p, lab: f3(o.y) }));
        const colW2 = w1 / Math.max(items2.length, 1);
        const bw2 = Math.min(46, colW2 * 0.62);
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + hAll * i / 4;
          ctx.beginPath(); ctx.moveTo(rx, y + .5); ctx.lineTo(rx + w1, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(rx, padT + hAll + .5); ctx.lineTo(rx + w1, padT + hAll + .5); ctx.stroke();
        items2.forEach((it, i) => {
          const cx = rx + colW2 * (i + 0.5);
          const h = it.p / maxP * hAll * 0.9;
          if (h < 0.3) return;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw2 / 2, padT + hAll - h, bw2, h, 3);
          const gr = ctx.createLinearGradient(0, padT + hAll - h, 0, padT + hAll);
          gr.addColorStop(0, D.withAlpha(C('--accent'), 0.9));
          gr.addColorStop(1, D.withAlpha(C('--accent'), 0.4));
          ctx.fillStyle = gr; ctx.fill();
          ctx.fillStyle = T['--ink-2']; ctx.font = '600 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(it.p.toFixed(2), cx, padT + hAll - h - 3);
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textBaseline = 'top';
          ctx.fillText(it.lab, cx, padT + hAll + 6);
        });
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('Y = ' + gs[key].label + ' 的分布律', rx, padT + hAll + 26);

        // 底部对照结论
        const dE = direct();
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '700 11.5px ' + D.FONT_MONO;
        ctx.fillStyle = C('--green');
        ctx.fillText('直接法 E[g(X)] = Σg(xₖ)pₖ = ' + dE.toFixed(4), padL, H_ - 10);
        ctx.textAlign = 'right';
        ctx.fillStyle = dE.toFixed(6) === bd.E.toFixed(6) ? C('--green') : C('--red');
        ctx.fillText('分布法 = ' + bd.E.toFixed(4) + '  ' + (dE.toFixed(6) === bd.E.toFixed(6) ? '✓ 相等' : '✗'), padL + 2 * w1 + gap, H_ - 10);
      });
      scene.static();

      const dE = direct();
      UI.readout(out, [
        ['函数 g', gs[key].label],
        ['直接法 E[g(X)]', f4(dE)],
        ['分布法 E(Y)', f4(bd.E)],
        ['两种方法一致', Math.abs(dE - bd.E) < 1e-9 ? '是 ✓' : '否'],
        ['Y 的取值个数', bd.arr.length + '（由 5 个 X 取值合并而来）']
      ]);
    }
    draw();
  };

  /* ================================================================
     4.4 相关系数 ρ 的几何意义
     ================================================================ */
  W.correlation = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let rho = 0.8, sg1 = 1, sg2 = 1;

    UI.slider(ctrl, { label: '相关系数 ρ', min: -0.99, max: 0.99, step: 0.01, value: rho, fmt: v => v.toFixed(2), onInput: v => { rho = v; draw(); } });
    UI.slider(ctrl, { label: 'σ₁', min: 0.4, max: 2.2, step: 0.1, value: sg1, fmt: v => v.toFixed(1), onInput: v => { sg1 = v; draw(); } });
    UI.slider(ctrl, { label: 'σ₂', min: 0.4, max: 2.2, step: 0.1, value: sg2, fmt: v => v.toFixed(1), onInput: v => { sg2 = v; draw(); } });

    // 固定种子生成二元正态样本
    function samples(n) {
      const rand = S.rng(20260910);
      const out = [];
      for (let i = 0; i < n; i++) {
        // Box-Muller
        let u1 = rand(), u2 = rand();
        if (u1 < 1e-12) u1 = 1e-12;
        const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
        const x = sg1 * z1;
        const y = sg2 * (rho * z1 + Math.sqrt(1 - rho * rho) * z2);
        out.push([x, y]);
      }
      return out;
    }

    function draw() {
      const T = D.Theme.cache;
      const pts = samples(600);
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padR = 168, padT = 38, padB = 42;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const R = 4.2;
        const X = v => padL + (v + R) / (2 * R) * pw;
        const Y = v => padT + ph - (v + R) / (2 * R) * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('散点云：ρ 决定「线性程度」', padL, padT - 10);

        // 底板
        ctx.fillStyle = T['--card-2'];
        ctx.beginPath(); D.roundRectPath(ctx, padL, padT, pw, ph, 8); ctx.fill();
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2; ctx.stroke();

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.7); ctx.lineWidth = 0.8;
        for (let i = 1; i < 8; i++) {
          const gx = padL + pw * i / 8, gy = padT + ph * i / 8;
          ctx.beginPath(); ctx.moveTo(gx, padT); ctx.lineTo(gx, padT + ph); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + pw, gy); ctx.stroke();
        }
        // 坐标轴
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, Y(0) + .5); ctx.lineTo(padL + pw, Y(0) + .5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(0) + .5, padT); ctx.lineTo(X(0) + .5, padT + ph); ctx.stroke();

        // 散点
        ctx.save();
        ctx.beginPath(); D.roundRectPath(ctx, padL, padT, pw, ph, 8); ctx.clip();
        pts.forEach(([x, y]) => {
          if (Math.abs(x) > R || Math.abs(y) > R) return;
          ctx.beginPath();
          ctx.arc(X(x), Y(y), 2.4, 0, D.TAU);
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.4);
          ctx.fill();
        });
        ctx.restore();

        // 回归直线 y = (ρσ₂/σ₁) x
        const slope = rho * sg2 / sg1;
        if (Math.abs(slope) < 50) {
          ctx.save();
          ctx.beginPath(); D.roundRectPath(ctx, padL, padT, pw, ph, 8); ctx.clip();
          ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(X(-R), Y(-slope * R));
          ctx.lineTo(X(R), Y(slope * R));
          ctx.stroke();
          ctx.restore();
        }

        // 右侧信息
        const rx = padL + pw + 18;
        let ry = padT + 4;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillText('参数与结论', rx, ry); ry += 20;
        const rows = [
          ['ρ = ' + rho.toFixed(2), ''],
          ['σ₁ = ' + sg1.toFixed(1), ''],
          ['σ₂ = ' + sg2.toFixed(1), ''],
          ['回归斜率', (rho * sg2 / sg1).toFixed(3)]
        ];
        rows.forEach(([a, b]) => {
          ctx.font = '700 11.5px ' + D.FONT_MONO;
          ctx.fillStyle = T['--ink'];
          ctx.fillText(a, rx, ry);
          if (b) { ctx.font = '500 10px ' + D.FONT_SANS; ctx.fillStyle = T['--ink-3']; ctx.fillText(b, rx + 80, ry + 1); }
          ry += 21;
        });
        ry += 10;
        // 判定
        const absr = Math.abs(rho);
        const verdict = absr < 0.02 ? '≈ 无线性关系' : (absr < 0.4 ? '弱线性相关' : (absr < 0.75 ? '中等线性相关' : (absr < 0.98 ? '强线性相关' : '几乎严格线性')));
        ctx.font = '700 12px ' + D.FONT_SANS;
        ctx.fillStyle = absr < 0.02 ? C('--green') : C('--accent');
        ctx.fillText(verdict, rx, ry); ry += 22;
        ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        ctx.fillText('散点越贴近一条直线，', rx, ry); ry += 14;
        ctx.fillText('|ρ| 越接近 1', rx, ry); ry += 14;
        ctx.fillText('ρ = ±1 ⟺ 严格线性关系', rx, ry);
      });
      scene.static();

      UI.readout(out, [
        ['ρ', f2(rho)],
        ['Cov(X,Y) = ρσ₁σ₂', f4(rho * sg1 * sg2)],
        ['回归斜率 ρσ₂/σ₁', f4(rho * sg2 / sg1)],
        ['|ρ| 与 1 的关系', Math.abs(rho) >= 0.99 ? '= 1（严格线性）' : '< 1'],
        ['样本量', 600]
      ]);
    }
    draw();
  };

  /* ================================================================
     4.5 常用分布的数字特征
     ================================================================ */
  W.distMoments = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let p = 0.3, n = 10, lam = 3, N = 100, M = 10, nH = 5, a = 1, b = 5, mu = 1, sg = 2;

    const specs = {
      'B(1,p)': { mean: () => S.bern.mean(p), varr: () => S.bern.varr(p), expr: ['p', 'p(1−p)'] },
      'B(n,p)': { mean: () => S.binom.mean(n, p), varr: () => S.binom.varr(n, p), expr: ['np', 'np(1−p)'] },
      'P(λ)': { mean: () => S.poisson.mean(lam), varr: () => S.poisson.varr(lam), expr: ['λ', 'λ'] },
      'G(p)': { mean: () => S.geom.mean(p), varr: () => S.geom.varr(p), expr: ['1/p', '(1−p)/p²'] },
      'H(N,M,n)': { mean: () => S.hyper.mean(N, M, nH), varr: () => S.hyper.varr(N, M, nH), expr: ['nM/N', 'n(M/N)(1−M/N)(N−n)/(N−1)'] },
      'U(a,b)': { mean: () => S.uniform.mean(a, b), varr: () => S.uniform.varr(a, b), expr: ['(a+b)/2', '(b−a)²/12'] },
      'E(λ)': { mean: () => S.expon.mean(lam), varr: () => S.expon.varr(lam), expr: ['1/λ', '1/λ²'] },
      'N(μ,σ²)': { mean: () => mu, varr: () => sg * sg, expr: ['μ', 'σ²'] }
    };
    let key = 'B(n,p)';

    UI.seg(ctrl, Object.keys(specs).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 1);
    // 参数滑块（全部展示，未用到的参数不影响结果）
    UI.slider(ctrl, { label: 'p', min: 0.05, max: 0.95, step: 0.01, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; draw(); } });
    UI.slider(ctrl, { label: 'n', min: 1, max: 30, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: 'λ', min: 0.2, max: 10, step: 0.1, value: lam, fmt: v => v.toFixed(1), onInput: v => { lam = v; draw(); } });
    UI.slider(ctrl, { label: 'N', min: 20, max: 300, step: 10, value: N, onInput: v => { N = v; draw(); } });
    UI.slider(ctrl, { label: 'M', min: 1, max: 60, value: M, onInput: v => { M = v; draw(); } });
    UI.slider(ctrl, { label: 'n_H', min: 1, max: 20, value: nH, onInput: v => { nH = v; draw(); } });
    UI.slider(ctrl, { label: 'a', min: -2, max: 3, step: 0.1, value: a, fmt: v => v.toFixed(1), onInput: v => { a = v; draw(); } });
    UI.slider(ctrl, { label: 'b', min: 1, max: 8, step: 0.1, value: b, fmt: v => v.toFixed(1), onInput: v => { b = v; draw(); } });
    UI.slider(ctrl, { label: 'μ', min: -3, max: 3, step: 0.1, value: mu, fmt: v => v.toFixed(1), onInput: v => { mu = v; draw(); } });
    UI.slider(ctrl, { label: 'σ', min: 0.3, max: 3, step: 0.1, value: sg, fmt: v => v.toFixed(1), onInput: v => { sg = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 40, padR = 30, padT = 46, padB = 40;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('常用分布的数字特征对照表（大纲要求「掌握」）', padL, padT - 12);

        // 表格
        const rows = Object.keys(specs);
        const rowH = Math.min(28, ph / rows.length);
        const colX = [padL, padL + pw * 0.26, padL + pw * 0.50, padL + pw * 0.72];
        // 表头
        const heads = ['分布', 'E(X) 表达式', 'D(X) 表达式', '当前取值 E(X) / D(X)'];
        ctx.font = '700 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        ctx.textBaseline = 'bottom';
        heads.forEach((h, i) => ctx.fillText(h, colX[i], padT + 12));
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT + 16); ctx.lineTo(padL + pw, padT + 16); ctx.stroke();

        rows.forEach((k, i) => {
          const y = padT + 20 + rowH * i;
          const on = k === key;
          if (on) {
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.14);
            ctx.beginPath(); D.roundRectPath(ctx, padL - 4, y, pw + 8, rowH - 2, 5); ctx.fill();
          }
          ctx.font = (on ? '700 ' : '600 ') + '11px ' + D.FONT_MONO;
          ctx.fillStyle = on ? C('--brand') : T['--ink'];
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(k, colX[0], y + rowH / 2);

          const sp = specs[k];
          ctx.font = '600 11px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText(sp.expr[0], colX[1], y + rowH / 2);
          ctx.fillText(sp.expr[1], colX[2], y + rowH / 2);

          const m = sp.mean(), v = sp.varr();
          ctx.font = (on ? '700 ' : '500 ') + '11px ' + D.FONT_MONO;
          ctx.fillStyle = on ? C('--accent') : T['--ink-3'];
          ctx.fillText(f3(m) + ' / ' + f3(v), colX[3], y + rowH / 2);

          ctx.strokeStyle = D.withAlpha(C('--line'), on ? 0.9 : 0.5);
          ctx.beginPath(); ctx.moveTo(padL, y + rowH - 2); ctx.lineTo(padL + pw, y + rowH - 2); ctx.stroke();
        });
      });
      scene.static();

      const sp = specs[key];
      const m = sp.mean(), v = sp.varr();
      UI.readout(out, [
        ['选中分布', key],
        ['E(X) 表达式', sp.expr[0]],
        ['D(X) 表达式', sp.expr[1]],
        ['E(X)', f4(m)],
        ['D(X)', f4(v)],
        ['σ', f4(Math.sqrt(v))]
      ]);
    }
    draw();
  };

  /* ================================================================
     4.6 数字特征性质验证器
     ================================================================ */
  W.properties = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let EX = 1, EY = 2, DX = 3, DY = 4, rho = 0.5, a = 2, b = -1;

    UI.slider(ctrl, { label: 'E(X)', min: -3, max: 3, step: 0.1, value: EX, fmt: v => v.toFixed(1), onInput: v => { EX = v; draw(); } });
    UI.slider(ctrl, { label: 'E(Y)', min: -3, max: 3, step: 0.1, value: EY, fmt: v => v.toFixed(1), onInput: v => { EY = v; draw(); } });
    UI.slider(ctrl, { label: 'D(X)', min: 0.1, max: 6, step: 0.1, value: DX, fmt: v => v.toFixed(1), onInput: v => { DX = v; draw(); } });
    UI.slider(ctrl, { label: 'D(Y)', min: 0.1, max: 6, step: 0.1, value: DY, fmt: v => v.toFixed(1), onInput: v => { DY = v; draw(); } });
    UI.slider(ctrl, { label: 'ρ(X,Y)', min: -0.99, max: 0.99, step: 0.01, value: rho, fmt: v => v.toFixed(2), onInput: v => { rho = v; draw(); } });
    UI.slider(ctrl, { label: '系数 a', min: -3, max: 3, step: 0.5, value: a, fmt: v => v.toFixed(1), onInput: v => { a = v; draw(); } });
    UI.slider(ctrl, { label: '系数 b', min: -3, max: 3, step: 0.5, value: b, fmt: v => v.toFixed(1), onInput: v => { b = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const cov = rho * Math.sqrt(DX * DY);
      const Eab = a * EX + b * EY;
      const Dab = a * a * DX + b * b * DY + 2 * a * b * cov;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 42, padR = 26, padT = 44, padB = 40;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('性质验证：把参数代入各项公式，逐条核对', padL, padT - 12);

        // 分三列展示
        const cols = [
          { title: '已知量', items: [
            ['E(X)', EX], ['E(Y)', EY], ['D(X)', DX], ['D(Y)', DY],
            ['ρ(X,Y)', rho], ['Cov(X,Y) = ρσ₁σ₂', cov]
          ] },
          { title: '线性组合 aX + bY', items: [
            ['a', a], ['b', b],
            ['E(aX+bY) = aE(X)+bE(Y)', Eab],
            ['D(aX+bY)', Dab],
            ['  其中 a²D(X)', a * a * DX],
            ['  其中 b²D(Y)', b * b * DY],
            ['  交叉项 2ab·Cov', 2 * a * b * cov]
          ] },
          { title: '独立 / 不相关对照', items: [
            ['若独立：D = a²D(X)+b²D(Y)', a * a * DX + b * b * DY],
            ['实际 D(aX+bY)', Dab],
            ['两者之差', Dab - (a * a * DX + b * b * DY)],
            ['是否独立（ρ=0?）', 0],
            ['E(X+Y) 恒等式', EX + EY],
            ['D(X+Y) 一般式', DX + DY + 2 * cov],
            ['D(X−Y) 一般式', DX + DY - 2 * cov]
          ] }
        ];

        const colW = pw / 3;
        cols.forEach((col, ci) => {
          const bx = padL + colW * ci;
          ctx.font = '700 11.5px ' + D.FONT_SANS;
          ctx.fillStyle = ci === 0 ? C('--brand') : (ci === 1 ? C('--accent') : C('--green'));
          ctx.textAlign = 'left'; ctx.textBaseline = 'top';
          ctx.fillText(col.title, bx, padT);
          ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(bx, padT + 18); ctx.lineTo(bx + colW - 16, padT + 18); ctx.stroke();

          let y = padT + 26;
          col.items.forEach(([lab, val]) => {
            ctx.font = '600 10.5px ' + D.FONT_SANS;
            ctx.fillStyle = T['--ink-2'];
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText(lab, bx, y);
            ctx.font = '700 11px ' + D.FONT_MONO;
            ctx.textAlign = 'right';
            // 布尔型显示为文字
            const isFlag = (lab.indexOf('是否独立') >= 0);
            if (isFlag) {
              const indep = Math.abs(rho) < 0.02;
              ctx.fillStyle = indep ? C('--green') : C('--red');
              ctx.fillText(indep ? '是（ρ=0）' : '否（ρ≠0）', bx + colW - 16, y);
            } else {
              ctx.fillStyle = T['--ink'];
              ctx.fillText(f3(val), bx + colW - 16, y);
            }
            y += 22;
          });
        });

        // 底部提示
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        ctx.fillText('要点：E 的线性性恒成立；D 的交叉项 2ab·Cov 只在独立或不相关（ρ=0）时才消失', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['Cov(X,Y)', f4(cov)],
        ['E(aX+bY)', f2(Eab)],
        ['D(aX+bY)', f4(Dab)],
        ['独立时 D = a²D(X)+b²D(Y)', f4(a * a * DX + b * b * DY)],
        ['D(X+Y) 一般式', f4(DX + DY + 2 * cov)],
        ['D(X−Y) 一般式', f4(DX + DY - 2 * cov)]
      ]);
    }
    draw();
  };

  /* ================================================================
     4.1b 期望的频率模拟：样本均值收敛到 E(X)
     ================================================================ */
  W.expectationSim = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 316);
    let key = 'dice', N = 600, runs = 5, seed = 20260910;

    const SOURCES = {
      dice: {
        name: '掷骰子（均匀）', discrete: true,
        ks: [1, 2, 3, 4, 5, 6], pmf: () => 1 / 6,
        gen: r => 1 + Math.floor(r() * 6), mean: 3.5, varr: 35 / 12
      },
      uniform: {
        name: 'U(0,1)', discrete: false, lo: 0, hi: 1,
        f: v => S.uniform.pdf(v, 0, 1), gen: r => r(), mean: 0.5, varr: 1 / 12
      },
      expon: {
        name: 'E(1)', discrete: false, lo: 0, hi: 5,
        f: v => S.expon.pdf(v, 1), gen: r => -Math.log(1 - Math.min(r(), 1 - 1e-12)), mean: 1, varr: 1
      },
      binom: {
        name: '二项 B(10,0.5)', discrete: true,
        ks: Array.from({ length: 11 }, (_, i) => i), pmf: k => S.binom.pmf(k, 10, 0.5),
        gen: r => { let c = 0; for (let i = 0; i < 10; i++) if (r() < 0.5) c++; return c; }, mean: 5, varr: 2.5
      }
    };

    UI.seg(ctrl, Object.keys(SOURCES).map(k => ({ label: SOURCES[k].name, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '最大样本量 n', min: 100, max: 2000, step: 50, value: N, onInput: v => { N = v; draw(); } });
    UI.slider(ctrl, { label: '模拟轮数', min: 2, max: 8, value: runs, onInput: v => { runs = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache, src = SOURCES[key];
      const rand = S.rng(seed * 2246822519 % 2147483647 + 7);
      const colors = ['--brand', '--accent', '--green', '--purple', '--teal', '--red', '--brand', '--accent'];
      const tracks = [];
      let yLo = Infinity, yHi = -Infinity;
      for (let r = 0; r < runs; r++) {
        const arr = new Float64Array(N);
        let sum = 0;
        for (let i = 0; i < N; i++) { sum += src.gen(rand); arr[i] = sum / (i + 1); }
        tracks.push(arr);
        for (let i = 0; i < N; i++) {
          if (arr[i] < yLo) yLo = arr[i];
          if (arr[i] > yHi) yHi = arr[i];
        }
      }
      const pad = Math.max(0.12 * (yHi - yLo), 0.05);
      yLo = Math.min(yLo - pad, src.mean - pad);
      yHi = Math.max(yHi + pad, src.mean + pad);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 28, padT = 40, padB = 52;
        const distH = 58;
        const pw = W_ - padL - padR;
        const ph = H_ - padT - distH - padB - 18;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('总体分布与它的「重心」E(X)，以及样本均值 Ᾱₙ 的收敛轨迹', padL, padT - 12);

        // 上方：分布
        const dy = padT + 6, dh = distH;
        const Xd = v => padL + (v - (src.discrete ? Math.min(...src.ks) - 0.6 : src.lo)) /
          ((src.discrete ? Math.max(...src.ks) + 0.6 : src.hi) - (src.discrete ? Math.min(...src.ks) - 0.6 : src.lo)) * pw;
        const maxP0 = 0.12;
        let maxP = maxP0;
        if (src.discrete) src.ks.forEach(k => { maxP = Math.max(maxP, src.pmf(k)); });
        else for (let i = 0; i <= 200; i++) maxP = Math.max(maxP, src.f(src.lo + (src.hi - src.lo) * i / 200));
        const Yd = v => dy + dh - v / maxP * dh;
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, dy + dh + .5); ctx.lineTo(padL + pw, dy + dh + .5); ctx.stroke();
        if (src.discrete) {
          const bw = Math.min(26, pw / src.ks.length * 0.5);
          src.ks.forEach(k => {
            const h = (dy + dh) - Yd(src.pmf(k));
            ctx.beginPath();
            D.roundRectPath(ctx, Xd(k) - bw / 2, Yd(src.pmf(k)), bw, h, 3);
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.45); ctx.fill();
          });
        } else {
          ctx.beginPath();
          for (let i = 0; i <= 220; i++) {
            const v = src.lo + (src.hi - src.lo) * i / 220;
            const y = Yd(src.f(v));
            i ? ctx.lineTo(Xd(v), y) : ctx.moveTo(Xd(v), y);
          }
          ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2; ctx.stroke();
        }
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(Xd(src.mean), dy); ctx.lineTo(Xd(src.mean), dy + dh + 6); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('E(X) = ' + src.mean, Xd(src.mean), dy - 14);

        // 下方：收敛轨道
        const gy = dy + dh + 34, gh = ph;
        const X = i => padL + i / (N - 1) * pw;
        const Y = v => gy + gh - (v - yLo) / (yHi - yLo) * gh;
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = gy + gh * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((yHi - (yHi - yLo) * i / 4).toFixed(3), padL - 6, y);
        }
        tracks.forEach((arr, r) => {
          ctx.beginPath();
          for (let i = 0; i < N; i++) i ? ctx.lineTo(X(i), Y(arr[i])) : ctx.moveTo(X(i), Y(arr[i]));
          ctx.strokeStyle = D.withAlpha(C(colors[r % colors.length]), 0.72);
          ctx.lineWidth = 1.6; ctx.stroke();
        });
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(padL, Y(src.mean)); ctx.lineTo(padL + pw, Y(src.mean)); ctx.stroke();
        ctx.restore();
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, gy + gh + .5); ctx.lineTo(padL + pw, gy + gh + .5); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const nn = 1 + Math.round((N - 1) * i / 5);
          ctx.fillText('n=' + nn, X(nn - 1), gy + gh + 6);
        }
      });
      scene.static();

      const last = tracks.map(a => a[N - 1]);
      const avg = last.reduce((a, b) => a + b, 0) / last.length;
      const sd = Math.sqrt(last.reduce((a, b) => a + (b - avg) * (b - avg), 0) / Math.max(1, last.length - 1));
      UI.readout(out, [
        ['总体分布', src.name],
        ['理论 E(X)', f4(src.mean)],
        ['理论 D(X)', f4(src.varr)],
        ['n = ' + N + ' 时理论标准差 σ/√n', f4(Math.sqrt(src.varr / N))],
        ['各轮末 Ᾱₙ 的平均', f4(avg)],
        ['各轮末 Ᾱₙ 的标准差', f4(sd)],
        ['与 E(X) 的偏差', f4(avg - src.mean)],
        ['结论', '样本均值依概率收敛于 E(X)：ΣXᵢ/n → μ（辛钦大数定律）']
      ]);
    }
    draw();
  };

  /* ================================================================
     4.2b 方差性质：D(aX+b) = a²D(X) 的平移与缩放
     ================================================================ */
  W.varianceShift = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -5, xMax: 5, yMin: 0, yMax: 1,
      xTicks: 8, yTicks: 5, xLabel: 'x', yLabel: 'f(x)', height: 306
    });
    let key = 'normal', a = 1.6, b = 0.5;

    const BASE = {
      normal: { name: 'N(0,1)', f: v => S.normal.pdf(v, 0, 1), mean: 0, varr: 1, span: 4.2 },
      uniform: { name: 'U(0,1)', f: v => S.uniform.pdf(v, 0, 1), mean: 0.5, varr: 1 / 12, span: 2.4 },
      expon: { name: 'E(1)', f: v => S.expon.pdf(v, 1), mean: 1, varr: 1, span: 5.5 }
    };

    UI.seg(ctrl, Object.keys(BASE).map(k => ({ label: BASE[k].name, value: k })), v => { key = v; draw(); }, 0);
    const sA = UI.slider(ctrl, {
      label: '系数 a（D 放大 a² 倍）', min: -3, max: 3, step: 0.1, value: a,
      fmt: v => v.toFixed(1),
      onInput: v => { a = Math.abs(v) < 0.2 ? (v < 0 ? -0.2 : 0.2) : v; if (a !== v) sA.set(a); draw(); }
    });
    UI.slider(ctrl, {
      label: '常数 b（平移，不影响 D）', min: -3, max: 3, step: 0.1, value: b,
      fmt: v => v.toFixed(1), onInput: v => { b = v; draw(); }
    });

    function draw() {
      const T = D.Theme.cache, d = BASE[key];
      const mean2 = a * d.mean + b;
      const varr2 = a * a * d.varr;
      const sd2 = Math.sqrt(varr2);
      const f2 = y => d.f((y - b) / a) / Math.abs(a);
      const lo = Math.min(-d.span, b - d.span * Math.abs(a), mean2 - 4 * sd2) - 0.4;
      const hi = Math.max(d.span, b + d.span * Math.abs(a), mean2 + 4 * sd2) + 0.4;
      let peak = 1e-6;
      for (let i = 0; i <= 400; i++) {
        const v = lo + (hi - lo) * i / 400;
        peak = Math.max(peak, d.f(v), f2(v));
      }

      plot.setDomain(lo, hi, 0, peak * 1.2);
      plot.clearLayers();
      plot.curve(d.f, { color: C('--brand'), width: 2.2, dash: [6, 4], from: lo, to: hi });
      plot.curve(f2, { color: C('--accent'), width: 2.6, from: lo, to: hi });
      plot.custom((p, ctx) => {
        const X = v => p.X(v), Y = v => p.Y(v);
        const sd1 = Math.sqrt(d.varr);
        const bars = [
          { mu: d.mean, sd: sd1, c: '--brand', y: 0.42 },
          { mu: mean2, sd: sd2, c: '--accent', y: 0.34 }
        ];
        bars.forEach(bar => {
          const yb = Y(peak * 1.2 * bar.y);
          ctx.strokeStyle = C(bar.c); ctx.lineWidth = 2.6;
          ctx.beginPath(); ctx.moveTo(X(bar.mu - bar.sd), yb); ctx.lineTo(X(bar.mu + bar.sd), yb); ctx.stroke();
          [bar.mu - bar.sd, bar.mu, bar.mu + bar.sd].forEach(v => {
            ctx.beginPath(); ctx.moveTo(X(v), yb - 5); ctx.lineTo(X(v), yb + 5); ctx.stroke();
          });
          ctx.fillStyle = C(bar.c); ctx.font = '700 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText('μ±σ', X(bar.mu), yb - 7);
        });
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('虚线＝f_X；实线＝f_(aX+b)；两端的短横杠标出 μ±σ：平移不改变宽度，乘 a 把宽度拉伸 |a| 倍', p.px + 4, p.py + 4);
      });
      plot.animate(360);

      UI.readout(out, [
        ['原分布 X', d.name],
        ['E(X) / D(X)', f4(d.mean) + ' / ' + f4(d.varr)],
        ['变换 Y = ' + a.toFixed(1) + 'X + ' + b.toFixed(1), ''],
        ['E(Y) = aE(X)+b', f4(mean2) + '（理论 ' + f4(mean2) + '）'],
        ['D(Y) = a²D(X)', f4(varr2)],
        ['a² · D(X)', f4(a * a * d.varr)],
        ['校验：D(Y) 与 a²D(X) 之差', (varr2 - a * a * d.varr).toExponential(1)],
        ['要点', 'b（平移）只移动位置；a（缩放）把离散程度放大 |a| 倍，方差放大 a² 倍']
      ]);
    }
    draw();
  };

  /* ================================================================
     4.3b 函数期望公式：直接加权 vs 先求分布
     ================================================================ */
  W.lotus = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 308);
    let n = 4, p = 0.5, key = 'sq';

    const G = {
      sq: { name: 'g(x) = x²', g: x => x * x, fmt: v => v.toFixed(0) },
      lin: { name: 'g(x) = 2x + 1', g: x => 2 * x + 1, fmt: v => v.toFixed(0) },
      abs: { name: 'g(x) = |2x − n|', g: x => Math.abs(2 * x - n), fmt: v => v.toFixed(0) }
    };

    UI.seg(ctrl, Object.keys(G).map(k => ({ label: G[k].name, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'n（二项 B(n,p)）', min: 2, max: 8, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: 'p', min: 0.2, max: 0.8, step: 0.05, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; draw(); } });

    function draw() {
      const T = D.Theme.cache, g = G[key];
      const xs = Array.from({ length: n + 1 }, (_, i) => i);
      const ps = xs.map(k => S.binom.pmf(k, n, p));
      const gv = xs.map(g.g);
      const direct = xs.reduce((s, x, i) => s + g.g(x) * ps[i], 0);
      const map = new Map();
      xs.forEach((x, i) => map.set(gv[i], (map.get(gv[i]) || 0) + ps[i]));
      const ys = [...map.keys()].sort((a, b) => a - b);
      const merged = ys.reduce((s, y) => s + y * map.get(y), 0);
      const EX = n * p;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 42, padB = 30;
        const zone1 = W_ * 0.30, zone2 = W_ * 0.30;
        const x1 = 22, x2 = x1 + zone1 + 34, x3 = x2 + zone2 + 34;
        const w1 = zone1 - 12, w2 = zone2 - 12, w3 = W_ - x3 - 26;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('E[g(X)] 的两条路线：左边「对 X 加权」，右边「先求 Y 的分布再加权」', x1, padT - 12);

        // 左：X 的分布
        const maxP = Math.max(...ps, 0.1);
        const bh = H_ - padT - padB - 40;
        const Yp = v => padT + bh - v / maxP * bh;
        const slot1 = w1 / (n + 1);
        xs.forEach((k, i) => {
          const cx = x1 + slot1 * (i + 0.5);
          const bw = Math.min(30, slot1 * 0.6);
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, Yp(ps[i]), bw, padT + bh - Yp(ps[i]), 3);
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.45); ctx.fill();
          ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(k, cx, padT + bh + 5);
          ctx.fillStyle = T['--ink-2']; ctx.textBaseline = 'bottom';
          ctx.fillText(ps[i].toFixed(3), cx, Yp(ps[i]) - 3);
        });
        ctx.fillStyle = C('--brand'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('X ~ B(' + n + ', ' + p.toFixed(2) + ')，E(X) = ' + EX.toFixed(3), x1 + w1 / 2, H_ - 20);

        // 中：逐项加权表
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = C('--accent'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.fillText('逐项加权：', x2, padT - 6);
        const rowH = Math.min(19, (H_ - padT - padB - 34) / (n + 2));
        ctx.font = '600 10.5px ' + D.FONT_MONO;
        xs.forEach((k, i) => {
          const ry = padT + 14 + rowH * i;
          ctx.textAlign = 'left';
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText('x=' + k, x2, ry);
          ctx.fillText('p=' + ps[i].toFixed(3), x2 + 42, ry);
          ctx.fillText('g=' + g.fmt(gv[i]), x2 + 92, ry);
          ctx.textAlign = 'right';
          ctx.fillStyle = C('--accent');
          ctx.fillText((gv[i] * ps[i]).toFixed(4), x2 + w2 - 6, ry);
        });
        const ty = padT + 14 + rowH * (n + 1);
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x2, ty - 5); ctx.lineTo(x2 + w2 - 6, ty - 5); ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = T['--ink']; ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.fillText('Σ g(x)p(x)', x2, ty + 1);
        ctx.textAlign = 'right';
        ctx.fillStyle = C('--accent');
        ctx.fillText(direct.toFixed(4), x2 + w2 - 6, ty + 1);
        ctx.textAlign = 'left';
        ctx.fillStyle = C('--accent'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.fillText('直接法 E[g(X)] = Σ g(xₖ)pₖ', x2, ty + 22);

        // 右：Y 的分布
        const maxQ = Math.max(...ys.map(y => map.get(y)), 0.1);
        const Yq = v => padT + bh - v / maxQ * bh;
        const slot3 = w3 / Math.max(1, ys.length);
        ys.forEach((y, i) => {
          const cx = x3 + slot3 * (i + 0.5);
          const bw = Math.min(34, slot3 * 0.6);
          const q = map.get(y);
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, Yq(q), bw, padT + bh - Yq(q), 3);
          ctx.fillStyle = D.withAlpha(C('--purple'), 0.5); ctx.fill();
          ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(y, cx, padT + bh + 5);
          ctx.fillStyle = T['--ink-2']; ctx.textBaseline = 'bottom';
          ctx.fillText(q.toFixed(3), cx, Yq(q) - 3);
        });
        ctx.fillStyle = C('--purple'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('Y = g(X) 的分布律', x3 + w3 / 2, padT + bh + 22);
        ctx.textBaseline = 'top';
        ctx.fillText('分布法 E(Y) = Σ y·P(Y=y) = ' + merged.toFixed(4), x3 + w3 / 2, H_ - 22);
      });
      scene.static();

      UI.readout(out, [
        ['分布 / 函数', 'X ~ B(' + n + ', ' + p.toFixed(2) + ')，' + g.name],
        ['直接法 E[g(X)] = Σ g(xₖ)pₖ', f4(direct)],
        ['分布法 Σ y·P(Y=y)', f4(merged)],
        ['两法之差', (direct - merged).toExponential(2)],
        ['E(X) = np', f4(EX)],
        ['g(E(X))', f4(g.g(EX))],
        ['辨析', Math.abs(g.g(EX) - direct) < 1e-9 ? '本例 g 恰为线性，E[g(X)] = g(E(X)) 成立' : 'E[g(X)] ≠ g(E(X))：不能把期望直接代进函数']
      ]);
    }
    draw();
  };

  /* ================================================================
     4.4b 相关系数：ρ 从 −1 到 1 的散点云
     ================================================================ */
  W.corrEllipse = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let rho = 0.7, N = 320, seed = 20260910;

    UI.slider(ctrl, { label: '相关系数 ρ', min: -1, max: 1, step: 0.05, value: rho, fmt: v => v.toFixed(2), onInput: v => { rho = v; draw(); } });
    UI.slider(ctrl, { label: '散点个数', min: 80, max: 800, step: 20, value: N, onInput: v => { N = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 15485863 % 2147483647 + 3);
      const pts = [];
      let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
      for (let i = 0; i < N; i++) {
        const x = S.randn(rand);
        const z = S.randn(rand);
        const y = rho * x + Math.sqrt(Math.max(0, 1 - rho * rho)) * z;
        pts.push([x, y]);
        sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y;
      }
      const vx = sxx / N - (sx / N) * (sx / N);
      const vy = syy / N - (sy / N) * (sy / N);
      const cov = sxy / N - (sx / N) * (sy / N);
      const r = cov / Math.sqrt(Math.max(1e-12, vx * vy));
      const slope = cov / Math.max(1e-12, vx);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 50, padR = 216, padT = 38, padB = 40;
        const size = Math.min(W_ - padL - padR, H_ - padT - padB);
        const ox = padL, oy = padT;
        const R = 3.3;
        const X = v => ox + size / 2 + v / R * size / 2;
        const Y = v => oy + size / 2 - v / R * size / 2;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('散点云的「线性程度」：ρ 决定云团的倾斜与扁窄', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath(); ctx.moveTo(X(i), oy); ctx.lineTo(X(i), oy + size); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ox, Y(i)); ctx.lineTo(ox + size, Y(i)); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(ox, Y(0) + .5); ctx.lineTo(ox + size, Y(0) + .5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(0) + .5, oy); ctx.lineTo(X(0) + .5, oy + size); ctx.stroke();

        // 1σ 椭圆（理论：σ₁=σ₂=1）
        ctx.beginPath();
        for (let k = 0; k <= 200; k++) {
          const th = 2 * Math.PI * k / 200;
          const ex = Math.cos(th);
          const ey = rho * Math.cos(th) + Math.sqrt(Math.max(0, 1 - rho * rho)) * Math.sin(th);
          k ? ctx.lineTo(X(ex), Y(ey)) : ctx.moveTo(X(ex), Y(ey));
        }
        ctx.closePath();
        ctx.strokeStyle = D.withAlpha(C('--purple'), 0.9);
        ctx.lineWidth = 1.8; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);

        pts.forEach(pt => {
          ctx.beginPath(); ctx.arc(X(pt[0]), Y(pt[1]), 2.7, 0, D.TAU);
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.5); ctx.fill();
        });

        // 最小二乘直线 y = slope · x
        ctx.beginPath();
        ctx.moveTo(X(-R), Y(-R * slope));
        ctx.lineTo(X(R), Y(R * slope));
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('最小二乘直线 y = ' + slope.toFixed(3) + ' x', ox + 6, oy + 13);

        const rx = ox + size + 20;
        let ry = oy + 6;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillStyle = C('--brand');
        ctx.fillText('相关系数读数', rx, ry); ry += 22;
        const rows = [
          ['理论 ρ', rho.toFixed(2)],
          ['样本相关系数 r', r.toFixed(4)],
          ['样本 Cov(X,Y)', cov.toFixed(4)],
          ['样本 D(X) / D(Y)', (sxx / N - (sx / N) * (sx / N)).toFixed(3) + ' / ' + (syy / N - (sy / N) * (sy / N)).toFixed(3)],
          ['判定', Math.abs(rho) < 1e-9 ? '不相关' : rho > 0 ? '正相关' : '负相关'],
          ['|ρ| → 1', '散点向一条直线聚集（ρ=±1 时严格共线）'],
          ['ρ = 0', '散点云不倾斜，但未必独立']
        ];
        rows.forEach(row => {
          ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText(row[0], rx, ry);
          ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.fillStyle = T['--ink'];
          ctx.textAlign = 'right';
          ctx.fillText(row[1], W_ - 22, ry);
          ctx.textAlign = 'left';
          ry += 22;
        });
      });
      scene.static();

      UI.readout(out, [
        ['理论 ρ', f2(rho)],
        ['样本相关系数 r', f4(r)],
        ['样本 Cov(X,Y)', f4(cov)],
        ['自由度说明', 'N = ' + N + '，样本量越大 r 越接近 ρ'],
        ['|ρ| = 1 的含义', 'X 与 Y 以概率 1 满足线性关系 Y = aX + b（a ≠ 0）'],
        ['ρ = 0 的含义', '只能说明「不线性相关」，不代表独立'],
        ['结论', Math.abs(rho) < 1e-9 ? '不相关：云团无明显方向' : (rho > 0 ? '正相关：X 增大时 Y 有增大趋势' : '负相关：X 增大时 Y 有减小趋势')]
      ]);
    }
    draw();
  };

  /* ================================================================
     4.5b 协方差的双线性：Cov(aX+bY, cZ+dW) 逐项展开
     ================================================================ */
  W.covBilinear = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 308);
    let mode = 'double', a = 1, b = 0.5, c = 1, d = 0.3;

    // 由因子模型精确导出的协方差（保证矩阵半正定）：
    // X = U1，Y = 0.5U1+√0.75U2，Z = 0.2U1+0.3U2+√0.87U3，W = 0.1U1−0.4U3+√0.83U4
    // Cov(Y,W) = 0.5×0.1 + √0.75×0 + 0×(−0.4) = 0.05（Y 不含 U3，W 不含 U2）
    const CV = {
      XZ: 0.2,
      XW: 0.1,
      YZ: 0.5 * 0.2 + Math.sqrt(0.75) * 0.3,
      YW: 0.5 * 0.1
    };

    UI.seg(ctrl, [
      { label: 'Cov(aX+bY, cZ)', value: 'single' },
      { label: 'Cov(aX+bY, cZ+dW)', value: 'double' }
    ], v => { mode = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'a', min: -2, max: 2, step: 0.1, value: a, fmt: v => v.toFixed(1), onInput: v => { a = v; draw(); } });
    UI.slider(ctrl, { label: 'b', min: -2, max: 2, step: 0.1, value: b, fmt: v => v.toFixed(1), onInput: v => { b = v; draw(); } });
    UI.slider(ctrl, { label: 'c', min: -2, max: 2, step: 0.1, value: c, fmt: v => v.toFixed(1), onInput: v => { c = v; draw(); } });
    UI.slider(ctrl, { label: 'd', min: -2, max: 2, step: 0.1, value: d, fmt: v => v.toFixed(1), onInput: v => { d = v; draw(); } });

    function terms() {
      const list = [{ t: 'a·c·Cov(X,Z)', v: a * c * CV.XZ }];
      if (mode === 'double') {
        list.push({ t: 'a·d·Cov(X,W)', v: a * d * CV.XW });
        list.push({ t: 'b·c·Cov(Y,Z)', v: b * c * CV.YZ });
        list.push({ t: 'b·d·Cov(Y,W)', v: b * d * CV.YW });
      } else {
        list.push({ t: 'b·c·Cov(Y,Z)', v: b * c * CV.YZ });
      }
      return list;
    }

    function draw() {
      const T = D.Theme.cache;
      const list = terms();
      const sum = list.reduce((s, x) => s + x.v, 0);
      // 蒙特卡洛校验
      const rand = S.rng(20260910);
      const M = 30000;
      let sx = 0, sy = 0, sxy = 0;
      for (let i = 0; i < M; i++) {
        const u1 = S.randn(rand), u2 = S.randn(rand), u3 = S.randn(rand), u4 = S.randn(rand);
        const X = u1;
        const Y = 0.5 * u1 + Math.sqrt(0.75) * u2;
        const Z = 0.2 * u1 + 0.3 * u2 + Math.sqrt(0.87) * u3;
        const W = 0.1 * u1 - 0.4 * u3 + Math.sqrt(0.83) * u4;
        const L = a * X + b * Y;
        const R = mode === 'double' ? c * Z + d * W : c * Z;
        sx += L; sy += R; sxy += L * R;
      }
      const mcCov = sxy / M - (sx / M) * (sy / M);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 44, padT = 52, padB = 36;
        const padR = 30;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('协方差的双线性：每一项「系数相乘 × 对应协方差」，再全部相加', padL, padT - 14);

        // 公式行
        ctx.font = '700 12px ' + D.FONT_MONO;
        ctx.fillStyle = C('--accent');
        ctx.textBaseline = 'top';
        ctx.fillText(mode === 'double'
          ? 'Cov(' + a.toFixed(1) + 'X+' + b.toFixed(1) + 'Y, ' + c.toFixed(1) + 'Z+' + d.toFixed(1) + 'W)'
          : 'Cov(' + a.toFixed(1) + 'X+' + b.toFixed(1) + 'Y, ' + c.toFixed(1) + 'Z)', padL, padT - 4);

        // 各项条形
        const gx = padL, gw = W_ - padL - padR;
        const maxAbs = Math.max(0.2, ...list.map(x => Math.abs(x.v)), Math.abs(sum));
        const zeroX = gx + gw * 0.42;
        const scale = gw * 0.5 / maxAbs;
        const rowH = 34;
        list.forEach((row, i) => {
          const y = padT + 34 + i * rowH;
          ctx.font = '600 10.5px ' + D.FONT_MONO;
          ctx.fillStyle = T['--ink-2'];
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(row.t, zeroX - 8, y);
          const w = row.v * scale;
          ctx.fillStyle = D.withAlpha(C(row.v >= 0 ? '--green' : '--red'), 0.75);
          ctx.fillRect(Math.min(zeroX, zeroX + w), y - 8, Math.max(1.5, Math.abs(w)), 16);
          ctx.fillStyle = C(row.v >= 0 ? '--green' : '--red');
          ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'left';
          ctx.fillText(row.v.toFixed(4), Math.max(zeroX, zeroX + w) + 8, y);
        });
        // 零线与合计
        const yEnd = padT + 34 + list.length * rowH;
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(zeroX + .5, padT + 26); ctx.lineTo(zeroX + .5, yEnd + 4); ctx.stroke();
        ctx.strokeStyle = C('--line'); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gx, yEnd + 4); ctx.lineTo(gx + gw, yEnd + 4); ctx.stroke();
        ctx.fillStyle = C('--accent'); ctx.font = '700 11.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText('合计 =', zeroX - 8, yEnd + 22);
        ctx.textAlign = 'left';
        ctx.fillText(sum.toFixed(4), zeroX + 8, yEnd + 22);
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('蒙特卡洛校验（30000 组样本）= ' + mcCov.toFixed(4) + '　误差 ' + Math.abs(mcCov - sum).toExponential(1), gx, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['公式', mode === 'double' ? 'Cov(aX+bY, cZ+dW) = ac·Cov(X,Z) + ad·Cov(X,W) + bc·Cov(Y,Z) + bd·Cov(Y,W)' : 'Cov(aX+bY, cZ) = ac·Cov(X,Z) + bc·Cov(Y,Z)'],
        ['已知协方差', 'Cov(X,Z)=' + f3(CV.XZ) + '，Cov(X,W)=' + f3(CV.XW) + '，Cov(Y,Z)=' + f3(CV.YZ) + '，Cov(Y,W)=' + f3(CV.YW)],
        ['各项', list.map(r => r.t + ' = ' + f4(r.v)).join('；')],
        ['理论合计', f4(sum)],
        ['蒙特卡洛校验', f4(mcCov)],
        ['误差', Math.abs(mcCov - sum).toExponential(2)],
        ['性质', 'Cov 对每个变元都是线性的：可把常数系数提出，加法可逐项拆分（无需独立）']
      ]);
    }
    draw();
  };

})(window);
