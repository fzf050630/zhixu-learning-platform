/* ============================================================
   ch8.js (widgets) — 第八章 假设检验 可视化组件
   组件：hypTestIdea / twoErrors / meanTest / varTest / twoSampleTest
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI, S = global.Stats;
  const { C, f2, f3, f4 } = UI;

  /* ================================================================
     8.1 显著性检验：拒绝域与统计量的落点
     ================================================================ */
  W.hypTestIdea = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let side = 'two', alpha = 0.05, z = 1.6;

    UI.seg(ctrl, [
      { label: '双侧 H₁: μ≠μ₀', value: 'two' },
      { label: '右侧 H₁: μ>μ₀', value: 'right' },
      { label: '左侧 H₁: μ<μ₀', value: 'left' }
    ], v => { side = v; draw(); }, 0);
    UI.slider(ctrl, { label: '显著性水平 α', min: 0.005, max: 0.2, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });
    UI.slider(ctrl, { label: '统计量观测值 Z', min: -4, max: 4, step: 0.05, value: z, fmt: v => v.toFixed(2), onInput: v => { z = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const R = 4.2;
      const critR = side === 'two' ? S.normUpper(alpha / 2) : S.normUpper(alpha);
      const critL = -critR;
      const reject = side === 'two' ? Math.abs(z) > critR : (side === 'right' ? z > critR : z < critL);
      const pval = side === 'two' ? 2 * (1 - S.normal.cdf(Math.abs(z), 0, 1))
        : (side === 'right' ? 1 - S.normal.cdf(z, 0, 1) : S.normal.cdf(z, 0, 1));

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v + R) / (2 * R) * pw;
        const yMax = S.normal.pdf(0, 0, 1) * 1.28;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('H₀ 成立时统计量 Z ~ N(0,1)：红色区域是拒绝域（面积 α）', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 拒绝域填充
        const fillTail = (a, b) => {
          ctx.beginPath();
          ctx.moveTo(X(a), padT + ph);
          for (let i = 0; i <= 120; i++) {
            const v = a + (b - a) * i / 120;
            ctx.lineTo(X(v), Y(S.normal.pdf(v, 0, 1)));
          }
          ctx.lineTo(X(b), padT + ph);
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--red'), 0.32);
          ctx.fill();
        };
        if (side === 'two') { fillTail(critR, R); fillTail(-R, critL); }
        else if (side === 'right') fillTail(critR, R);
        else fillTail(-R, critL);

        // 曲线
        ctx.beginPath();
        for (let i = 0; i <= 340; i++) {
          const v = -R + 2 * R * i / 340;
          const y = Y(S.normal.pdf(v, 0, 1));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();

        // 临界线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.7;
        const lines = side === 'two' ? [critR, critL] : (side === 'right' ? [critR] : [critL]);
        lines.forEach(v => {
          ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), padT + ph); ctx.stroke();
        });
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        lines.forEach(v => ctx.fillText(v.toFixed(3), X(v), padT + 3));

        // 观测值落点
        const zc = Math.max(-R + 0.05, Math.min(R - 0.05, z));
        ctx.beginPath(); ctx.arc(X(zc), Y(0), 6, 0, D.TAU);
        ctx.fillStyle = reject ? C('--red') : C('--green'); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = reject ? C('--red') : C('--green'); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(X(zc), Y(0)); ctx.lineTo(X(zc), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = reject ? C('--red') : C('--green');
        ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('z = ' + z.toFixed(2), X(zc), Y(0) - 10);

        // 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 8; i++) {
          const v = -R + 2 * R * i / 8;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText(side === 'two'
          ? '双侧检验：两侧各 α/2，临界值 ±u_{α/2}'
          : (side === 'right' ? '右侧检验：全部 α 放右尾，临界值 u_α' : '左侧检验：全部 α 放左尾，临界值 −u_α'), padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['备择假设', side === 'two' ? 'H₁: μ ≠ μ₀' : (side === 'right' ? 'H₁: μ > μ₀' : 'H₁: μ < μ₀')],
        ['α', f3(alpha)],
        ['临界值', side === 'two' ? '±' + f4(critR) : (side === 'right' ? f4(critR) : f4(critL))],
        ['统计量观测值 z', f2(z)],
        ['p 值', f4(pval)],
        ['判定', reject ? '拒绝 H₀（落入拒绝域）' : '不拒绝 H₀（证据不足）'],
        ['与 α 比较', pval < alpha ? 'p < α → 拒绝' : 'p ≥ α → 不拒绝']
      ]);
    }
    draw();
  };

  /* ================================================================
     8.2 两类错误：α、β 与样本量
     ================================================================ */
  W.twoErrors = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let n = 16, alpha = 0.05, delta = 0.6, sig = 1;

    UI.slider(ctrl, { label: '样本量 n', min: 2, max: 60, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '显著性水平 α', min: 0.005, max: 0.2, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });
    UI.slider(ctrl, { label: '真实偏移 δ = μ₁ − μ₀', min: 0, max: 2, step: 0.05, value: delta, fmt: v => v.toFixed(2), onInput: v => { delta = v; draw(); } });
    UI.slider(ctrl, { label: 'σ', min: 0.4, max: 3, step: 0.1, value: sig, fmt: v => v.toFixed(1), onInput: v => { sig = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      // 单侧右侧检验：H0: μ=μ0，H1: μ>μ0
      const se = sig / Math.sqrt(n);
      const crit = S.normUpper(alpha);           // z 临界值
      const xc = crit * se;                       // 在 X̄ 尺度上的临界点
      const beta = S.normal.cdf(xc, delta, se);   // 真实 μ=δ 时不拒绝的概率
      const power = 1 - beta;
      const R = Math.max(xc * 1.8, delta * 1.5, se * 4.2, 0.6);
      const xMin = -R, xMax = R;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 50, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - xMin) / (xMax - xMin) * pw;
        const peak = Math.max(S.normal.pdf(0, 0, se), S.normal.pdf(delta, delta, se));
        const yMax = peak * 1.3;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('右侧检验：H₀ 下的分布（蓝）与真实分布（绿），α 与 β 的面积', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // α 区域：H0 分布下 X̄ > xc
        ctx.beginPath();
        ctx.moveTo(X(xc), padT + ph);
        for (let i = 0; i <= 140; i++) {
          const v = xc + (xMax - xc) * i / 140;
          ctx.lineTo(X(v), Y(S.normal.pdf(v, 0, se)));
        }
        ctx.lineTo(X(xMax), padT + ph);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.36);
        ctx.fill();

        // β 区域：真实分布下 X̄ ≤ xc
        ctx.beginPath();
        ctx.moveTo(X(xMin), padT + ph);
        for (let i = 0; i <= 140; i++) {
          const v = xMin + (xc - xMin) * i / 140;
          ctx.lineTo(X(v), Y(S.normal.pdf(v, delta, se)));
        }
        ctx.lineTo(X(xc), padT + ph);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--accent'), 0.34);
        ctx.fill();

        // 两条曲线
        [[0, C('--brand')], [delta, C('--green')]].forEach(([m, col], idx) => {
          ctx.beginPath();
          for (let i = 0; i <= 300; i++) {
            const v = xMin + (xMax - xMin) * i / 300;
            const y = Y(S.normal.pdf(v, m, se));
            i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
          }
          ctx.strokeStyle = col; ctx.lineWidth = idx ? 2.3 : 2.0;
          if (idx) ctx.setLineDash([]); else ctx.setLineDash([5, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // 临界线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.7;
        ctx.beginPath(); ctx.moveTo(X(xc), padT); ctx.lineTo(X(xc), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('临界点 ' + xc.toFixed(3), X(xc), padT + 3);

        // 标注
        ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.fillStyle = C('--brand'); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('H₀: μ = 0', X(0), Y(peak) - 256 > padT ? Y(peak) - 4 : padT + 16);
        ctx.fillStyle = C('--green');
        ctx.fillText('真实 μ = ' + delta.toFixed(2), X(delta), padT + 20);

        ctx.fillStyle = C('--red'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText('α = ' + alpha.toFixed(3), padL + pw - 6, padT + 4);
        ctx.fillStyle = C('--accent');
        ctx.fillText('β = ' + beta.toFixed(3), padL + 6, padT + 4);

        // 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 8; i++) {
          const v = xMin + (xMax - xMin) * i / 8;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('α 与 β 此消彼长；n 增大时两条曲线同时变瘦，α、β 可同时减小', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['检验设置', 'H₀: μ=0，H₁: μ>0（右侧）'],
        ['n', n], ['σ', f2(sig)], ['标准误 σ/√n', f4(se)],
        ['α（第一类错误）', f4(alpha)],
        ['临界值 u_α', f4(crit)],
        ['X̄ 尺度上的临界点', f4(xc)],
        ['β（第二类错误）', f4(beta)],
        ['功效 1−β', f4(power)],
        ['真实 δ 下的功效评级', power > 0.9 ? '很高' : (power > 0.7 ? '较高' : (power > 0.5 ? '一般' : '偏低，建议增大 n'))]
      ]);
    }
    draw();
  };

  /* ================================================================
     8.3 单个正态总体均值的检验
     ================================================================ */
  W.meanTest = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let kind = 0, xbar = 12.4, mu0 = 12, sp = 0.3, n = 16, alpha = 0.05, side = 'two';
    let useSample = 0;

    UI.seg(ctrl, [
      { label: 'σ 已知 → Z 检验', value: 0 },
      { label: 'σ 未知 → t 检验', value: 1 }
    ], v => { kind = v; draw(); }, 0);
    UI.seg(ctrl, [
      { label: '双侧', value: 'two' },
      { label: '右侧 >', value: 'right' },
      { label: '左侧 <', value: 'left' }
    ], v => { side = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'x̄', min: 8, max: 16, step: 0.05, value: xbar, fmt: v => v.toFixed(2), onInput: v => { xbar = v; draw(); } });
    UI.slider(ctrl, { label: 'μ₀', min: 8, max: 16, step: 0.1, value: mu0, fmt: v => v.toFixed(1), onInput: v => { mu0 = v; draw(); } });
    UI.slider(ctrl, { label: 'σ 或 s', min: 0.05, max: 2, step: 0.05, value: sp, fmt: v => v.toFixed(2), onInput: v => { sp = v; draw(); } });
    UI.slider(ctrl, { label: 'n', min: 2, max: 60, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: 'α', min: 0.005, max: 0.2, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const se = sp / Math.sqrt(n);
      const tstat = (xbar - mu0) / se;
      const df = n - 1;
      const critTwo = kind ? S.tUpper(alpha / 2, df) : S.normUpper(alpha / 2);
      const critOne = kind ? S.tUpper(alpha, df) : S.normUpper(alpha);
      const pdf = kind ? (v => S.tDist.pdf(v, df)) : (v => S.normal.pdf(v, 0, 1));
      const cdf = kind ? (v => S.tDist.cdf(v, df)) : (v => S.normal.cdf(v, 0, 1));

      const reject = side === 'two' ? Math.abs(tstat) > critTwo
        : (side === 'right' ? tstat > critOne : tstat < -critOne);
      const pval = side === 'two' ? 2 * (1 - cdf(Math.abs(tstat)))
        : (side === 'right' ? 1 - cdf(tstat) : cdf(tstat));

      const R = Math.max(4, Math.abs(tstat) * 1.3, critOne * 1.5);
      const xMin = kind ? -R : -R, xMax = R;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - xMin) / (xMax - xMin) * pw;
        const yMax = Math.max(pdf(0)) * 1.3;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText((kind ? 't 检验' : 'Z 检验') + '：统计量 ' + (kind ? 'T ~ t(' + df + ')' : 'Z ~ N(0,1)')
          + '，观测值 ' + tstat.toFixed(3), padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        const fillTail = (a, b) => {
          ctx.beginPath();
          ctx.moveTo(X(a), padT + ph);
          for (let i = 0; i <= 120; i++) {
            const v = a + (b - a) * i / 120;
            ctx.lineTo(X(v), Y(pdf(v)));
          }
          ctx.lineTo(X(b), padT + ph);
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--red'), 0.30);
          ctx.fill();
        };
        const edges = [];
        if (side === 'two') { fillTail(critTwo, xMax); fillTail(xMin, -critTwo); edges.push(critTwo, -critTwo); }
        else if (side === 'right') { fillTail(critOne, xMax); edges.push(critOne); }
        else { fillTail(xMin, -critOne); edges.push(-critOne); }

        ctx.beginPath();
        for (let i = 0; i <= 340; i++) {
          const v = xMin + (xMax - xMin) * i / 340;
          const y = Y(pdf(v));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.7;
        edges.forEach(v => {
          ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), padT + ph); ctx.stroke();
        });
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        edges.forEach(v => ctx.fillText(D.niceNum(v), X(v), padT + 3));

        // 观测值落点
        const tc = Math.max(xMin + 0.05, Math.min(xMax - 0.05, tstat));
        ctx.beginPath(); ctx.arc(X(tc), Y(pdf(tc)), 6, 0, D.TAU);
        ctx.fillStyle = reject ? C('--red') : C('--green'); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.fillStyle = reject ? C('--red') : C('--green');
        ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(tstat.toFixed(3), X(tc), Y(pdf(tc)) - 9);

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 8; i++) {
          const v = xMin + (xMax - xMin) * i / 8;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText(kind ? 'σ 未知 → 用 S 代替，分布变为 t(n−1)，临界值更大（更谨慎）'
          : 'σ 已知 → 统计量服从标准正态，临界值取 u 分位数', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['检验', (kind ? 't 检验' : 'Z 检验') + '，' + (side === 'two' ? '双侧' : (side === 'right' ? '右侧' : '左侧'))],
        ['统计量', (kind ? 'T' : 'Z') + ' = (x̄ − μ₀)/(S/√n) = ' + f4(tstat)],
        ['标准误', f4(se)],
        ['自由度', kind ? df : '—'],
        ['临界值', side === 'two' ? '±' + f4(kind ? critTwo : critTwo) : f4(kind ? critOne : critOne)],
        ['p 值', f4(pval)],
        ['判定', reject ? '拒绝 H₀（差异显著）' : '不拒绝 H₀（差异不显著）'],
        ['实际含义', reject
          ? ('可以认为总体均值与 ' + mu0 + ' 有显著差异')
          : ('尚无充分证据认为总体均值不同于 ' + mu0)]
      ]);
    }
    draw();
  };

  /* ================================================================
     8.4 单个正态总体方差的检验
     ================================================================ */
  W.varTest = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let n = 10, s2 = 2.1, s02 = 1.5, alpha = 0.05, side = 'right', muKnown = 0;

    UI.seg(ctrl, [
      { label: 'μ 未知（df = n−1）', value: 0 },
      { label: 'μ 已知（df = n）', value: 1 }
    ], v => { muKnown = v; draw(); }, 0);
    UI.seg(ctrl, [
      { label: '双侧', value: 'two' },
      { label: '右侧 >', value: 'right' },
      { label: '左侧 <', value: 'left' }
    ], v => { side = v; draw(); }, 1);
    UI.slider(ctrl, { label: 'n', min: 2, max: 40, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: 's²', min: 0.1, max: 8, step: 0.1, value: s2, fmt: v => v.toFixed(1), onInput: v => { s2 = v; draw(); } });
    UI.slider(ctrl, { label: 'σ₀²', min: 0.1, max: 8, step: 0.1, value: s02, fmt: v => v.toFixed(1), onInput: v => { s02 = v; draw(); } });
    UI.slider(ctrl, { label: 'α', min: 0.005, max: 0.2, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const df = muKnown ? n : n - 1;
      const chi = df * s2 / s02;
      const upTwo = S.chi2Upper(alpha / 2, df), loTwo = S.chi2Upper(1 - alpha / 2, df);
      const upOne = S.chi2Upper(alpha, df), loOne = S.chi2Upper(1 - alpha, df);

      let reject, crits;
      if (side === 'two') { reject = chi > upTwo || chi < loTwo; crits = [loTwo, upTwo]; }
      else if (side === 'right') { reject = chi > upOne; crits = [upOne]; }
      else { reject = chi < loOne; crits = [loOne]; }

      const pval = side === 'two'
        ? 2 * Math.min(1 - S.chi2.cdf(chi, df), S.chi2.cdf(chi, df))
        : (side === 'right' ? 1 - S.chi2.cdf(chi, df) : S.chi2.cdf(chi, df));

      const xMax = Math.max(upOne * 1.25, chi * 1.2, df + 4 * Math.sqrt(2 * df), 8);
      const peak = Math.max(...Array.from({ length: 200 }, (_, i) => S.chi2.pdf(xMax * (i + 1) / 200, df)));
      const yMax = peak * 1.28;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + v / xMax * pw;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('χ² 检验：统计量 χ² = ' + (muKnown ? 'Σ(Xᵢ−μ₀)²/σ₀²' : '(n−1)S²/σ₀²')
          + ' = ' + chi.toFixed(3) + '，df = ' + df, padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        const fill = (a, b) => {
          ctx.beginPath();
          ctx.moveTo(X(a), padT + ph);
          for (let i = 0; i <= 120; i++) {
            const v = a + (b - a) * i / 120;
            ctx.lineTo(X(v), Y(S.chi2.pdf(v, df)));
          }
          ctx.lineTo(X(b), padT + ph);
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--red'), 0.30);
          ctx.fill();
        };
        if (side === 'two') { fill(upTwo, xMax); fill(0, loTwo); }
        else if (side === 'right') fill(upOne, xMax);
        else fill(0, loOne);

        ctx.beginPath();
        for (let i = 0; i <= 340; i++) {
          const v = xMax * i / 340;
          const y = Y(S.chi2.pdf(v, df));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.7;
        crits.forEach(v => {
          if (v < 0.01) return;
          ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), padT + ph); ctx.stroke();
        });
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        crits.forEach(v => { if (v > 0.01) ctx.fillText(v.toFixed(3), X(v), padT + 3); });

        const cc = Math.max(0.02, Math.min(xMax * 0.99, chi));
        ctx.beginPath(); ctx.arc(X(cc), Y(S.chi2.pdf(cc, df)), 6, 0, D.TAU);
        ctx.fillStyle = reject ? C('--red') : C('--green'); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.fillStyle = reject ? C('--red') : C('--green');
        ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('χ² = ' + chi.toFixed(3), X(cc), Y(S.chi2.pdf(cc, df)) - 9);

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) ctx.fillText(D.niceNum(xMax * i / 6), X(xMax * i / 6), padT + ph + 6);

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('χ² 分布不对称：双侧检验的两条临界线必须分别定位，不能写成中心 ± 若干', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['检验', 'χ² 检验（' + (side === 'two' ? '双侧' : (side === 'right' ? '右侧' : '左侧')) + '）'],
        ['条件', muKnown ? 'μ 已知 → df = n = ' + df : 'μ 未知 → df = n−1 = ' + df],
        ['统计量 χ²', f4(chi)],
        ['临界值', crits.filter(v => v > 0.01).map(v => f4(v)).join(' 或 ')],
        ['p 值', f4(pval)],
        ['判定', reject ? '拒绝 H₀（方差不等于 ' + s02 + '）' : '不拒绝 H₀'],
        ['含义', muKnown ? '（μ 已知情形）' : (s2 > s02 ? '样本方差偏大' : '样本方差偏小')]
      ]);
    }
    draw();
  };

  /* ================================================================
     8.5 两个正态总体的检验（F 检验 + T 检验）
     ================================================================ */
  W.twoSampleTest = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let xbar = 105, ybar = 100, s1 = 16, s2 = 9, n1 = 10, n2 = 9, alpha = 0.05;

    UI.slider(ctrl, { label: 'x̄', min: 80, max: 130, step: 0.5, value: xbar, fmt: v => v.toFixed(1), onInput: v => { xbar = v; draw(); } });
    UI.slider(ctrl, { label: 'ȳ', min: 80, max: 130, step: 0.5, value: ybar, fmt: v => v.toFixed(1), onInput: v => { ybar = v; draw(); } });
    UI.slider(ctrl, { label: 's₁²', min: 0.5, max: 40, step: 0.5, value: s1, fmt: v => v.toFixed(1), onInput: v => { s1 = v; draw(); } });
    UI.slider(ctrl, { label: 's₂²', min: 0.5, max: 40, step: 0.5, value: s2, fmt: v => v.toFixed(1), onInput: v => { s2 = v; draw(); } });
    UI.slider(ctrl, { label: 'n₁', min: 3, max: 30, value: n1, onInput: v => { n1 = v; draw(); } });
    UI.slider(ctrl, { label: 'n₂', min: 3, max: 30, value: n2, onInput: v => { n2 = v; draw(); } });
    UI.slider(ctrl, { label: 'α', min: 0.005, max: 0.2, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      /* --- 第一步：F 检验（方差齐性） --- */
      const big = Math.max(s1, s2), small = Math.min(s1, s2);
      const fStat = big / small;
      const df1 = s1 >= s2 ? n1 - 1 : n2 - 1;
      const df2 = s1 >= s2 ? n2 - 1 : n1 - 1;
      const fCrit = S.fUpper(alpha / 2, df1, df2);
      const fReject = fStat > fCrit;

      /* --- 第二步：t 检验（均值差） --- */
      const dfT = n1 + n2 - 2;
      const sw2 = ((n1 - 1) * s1 + (n2 - 1) * s2) / dfT;
      const seT = Math.sqrt(sw2 * (1 / n1 + 1 / n2));
      const tStat = (xbar - ybar) / seT;
      const tCrit = S.tUpper(alpha / 2, dfT);
      const tReject = Math.abs(tStat) > tCrit;
      const pT = 2 * (1 - S.tDist.cdf(Math.abs(tStat), dfT));

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 52, padB = 46;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const half = ph / 2 - 14;

        /* ---- 上：F 检验 ---- */
        const fMax = Math.max(fCrit * 1.4, fStat * 1.15, 3);
        const XF = v => padL + v / fMax * pw;
        const fPeak = Math.max(...Array.from({ length: 160 }, (_, i) => S.fDist.pdf(fMax * (i + 1) / 160, df1, df2)));
        const YF = v => padT + half - v / (fPeak * 1.3) * half;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('第一步：F 检验（H₀: σ₁² = σ₂²），F = ' + fStat.toFixed(3), padL, padT - 8);

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + half + .5); ctx.lineTo(padL + pw, padT + half + .5); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(XF(fCrit), padT + half);
        for (let i = 0; i <= 100; i++) {
          const v = fCrit + (fMax - fCrit) * i / 100;
          ctx.lineTo(XF(v), YF(S.fDist.pdf(v, df1, df2)));
        }
        ctx.lineTo(XF(fMax), padT + half);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.28);
        ctx.fill();

        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const v = fMax * (i + 1) / 200;
          const y = YF(S.fDist.pdf(v, df1, df2));
          i ? ctx.lineTo(XF(v), y) : ctx.moveTo(XF(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2; ctx.stroke();

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(XF(fCrit), padT + 4); ctx.lineTo(XF(fCrit), padT + half); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('F_α/2 = ' + fCrit.toFixed(3), XF(fCrit), padT + 4);

        const fc = Math.max(0.02, Math.min(fMax * 0.98, fStat));
        ctx.beginPath(); ctx.arc(XF(fc), YF(S.fDist.pdf(fc, df1, df2)), 5.4, 0, D.TAU);
        ctx.fillStyle = fReject ? C('--red') : C('--green'); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = fReject ? C('--red') : C('--green');
        ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('F = ' + fStat.toFixed(3), XF(fc), YF(S.fDist.pdf(fc, df1, df2)) - 8);

        /* ---- 下：t 检验 ---- */
        const tBase = padT + ph * 0.58;
        const tHalf = ph - ph * 0.58;
        const tMax = Math.max(tCrit * 1.6, Math.abs(tStat) * 1.15, 4);
        const XT = v => padL + (v + tMax) / (2 * tMax) * pw;
        const tPeak = S.tDist.pdf(0, dfT);
        const YT = v => tBase + tHalf - v / (tPeak * 1.3) * tHalf;

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillText('第二步：t 检验（H₀: μ₁ = μ₂），T = ' + tStat.toFixed(3), padL, tBase - 8);

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, tBase + tHalf + .5); ctx.lineTo(padL + pw, tBase + tHalf + .5); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(XT(tCrit), tBase + tHalf);
        for (let i = 0; i <= 100; i++) {
          const v = tCrit + (tMax - tCrit) * i / 100;
          ctx.lineTo(XT(v), YT(S.tDist.pdf(v, dfT)));
        }
        ctx.lineTo(XT(tMax), tBase + tHalf);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.28);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(XT(-tMax), tBase + tHalf);
        for (let i = 0; i <= 100; i++) {
          const v = -tMax + (-tCrit + tMax) * i / 100;
          ctx.lineTo(XT(v), YT(S.tDist.pdf(v, dfT)));
        }
        ctx.lineTo(XT(-tCrit), tBase + tHalf);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.28);
        ctx.fill();

        ctx.beginPath();
        for (let i = 0; i <= 260; i++) {
          const v = -tMax + 2 * tMax * i / 260;
          const y = YT(S.tDist.pdf(v, dfT));
          i ? ctx.lineTo(XT(v), y) : ctx.moveTo(XT(v), y);
        }
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2; ctx.stroke();

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.6;
        [tCrit, -tCrit].forEach(v => {
          ctx.beginPath(); ctx.moveTo(XT(v), tBase); ctx.lineTo(XT(v), tBase + tHalf); ctx.stroke();
        });
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('±' + tCrit.toFixed(3), XT(tCrit), tBase);

        const tc = Math.max(-tMax + 0.05, Math.min(tMax - 0.05, tStat));
        ctx.beginPath(); ctx.arc(XT(tc), YT(S.tDist.pdf(tc, dfT)), 5.4, 0, D.TAU);
        ctx.fillStyle = tReject ? C('--red') : C('--green'); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = tReject ? C('--red') : C('--green');
        ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('T = ' + tStat.toFixed(3), XT(tc), YT(S.tDist.pdf(tc, dfT)) - 8);
      });
      scene.static();

      UI.readout(out, [
        ['F 检验（方差齐性）', 'F = ' + f4(fStat) + '，df = (' + df1 + ', ' + df2 + ')，临界 ' + f4(fCrit)],
        ['F 检验结论', fReject ? '拒绝 H₀：方差有显著差异' : '不拒绝 H₀：可视为方差相等'],
        ['合并方差 s_w²', f4(sw2)],
        ['标准误', f4(seT)],
        ['T 检验（均值差）', 'T = ' + f4(tStat) + '，df = ' + dfT + '，临界 ±' + f4(tCrit)],
        ['T 检验 p 值', f4(pT)],
        ['T 检验结论', tReject ? '拒绝 H₀：两总体均值有显著差异' : '不拒绝 H₀：无足够证据认为均值不同'],
        ['完整结论', tReject
          ? '两种工艺的平均指标存在显著差异（先经 F 检验确认方差齐性）'
          : '两种工艺的平均指标无显著差异']
      ]);
    }
    draw();
  };

  /* ================================================================
     8.1b p 值原理：尾部面积 = 比观测更极端的小概率
     ================================================================ */
  W.pValue = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -4, xMax: 4, yMin: 0, yMax: 0.46,
      xTicks: 8, yTicks: 4, xLabel: 'z（检验统计量）', yLabel: 'φ(z)', height: 308
    });
    let z = 2.1, alpha = 0.05, side = 'right';

    UI.seg(ctrl, [
      { label: '右侧检验 H₁: μ>μ₀', value: 'right' },
      { label: '左侧检验 H₁: μ<μ₀', value: 'left' },
      { label: '双侧检验 H₁: μ≠μ₀', value: 'two' }
    ], v => { side = v; draw(); }, 0);
    UI.slider(ctrl, { label: '统计量观测值 z', min: -3.6, max: 3.6, step: 0.05, value: z, fmt: v => v.toFixed(2), onInput: v => { z = v; draw(); } });
    UI.slider(ctrl, { label: '显著性水平 α', min: 0.005, max: 0.2, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const Phi = v => S.normal.cdf(v, 0, 1);
      const p = side === 'right' ? 1 - Phi(z) : side === 'left' ? Phi(z) : 2 * (1 - Phi(Math.abs(z)));
      const u1 = S.normUpper(alpha), u2 = S.normUpper(alpha / 2);
      const crit = side === 'right' ? u1 : side === 'left' ? -u1 : u2;
      const reject = side === 'two' ? Math.abs(z) > u2 : (side === 'right' ? z > u1 : z < -u1);

      plot.setDomain(-4, 4, 0, 0.46);
      plot.clearLayers();
      const f = v => S.normal.pdf(v, 0, 1);
      if (side === 'right') {
        plot.area(f, z, 4, { color: C('--red'), alpha: 0.32 });
      } else if (side === 'left') {
        plot.area(f, -4, z, { color: C('--red'), alpha: 0.32 });
      } else {
        plot.area(f, Math.abs(z), 4, { color: C('--red'), alpha: 0.32 });
        plot.area(f, -4, -Math.abs(z), { color: C('--red'), alpha: 0.32 });
      }
      plot.curve(f, { color: C('--brand'), width: 2.4 });
      plot.custom((p2, ctx) => {
        const X = v => p2.X(v), Y = v => p2.Y(v);
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.7;
        [crit, side === 'two' ? -crit : crit].forEach(v => {
          if (v < -4 || v > 4) return;
          ctx.beginPath(); ctx.moveTo(X(v), p2.py); ctx.lineTo(X(v), p2.py + p2.ph); ctx.stroke();
        });
        ctx.restore();
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(z), p2.py); ctx.lineTo(X(z), p2.py + p2.ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--accent'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(side === 'two' ? '±u_{α/2}=' + u2.toFixed(3) : 'u_{1−α}=' + crit.toFixed(3),
          D.clamp(X(crit), p2.px + 40, p2.px + p2.pw - 40), p2.py + 3);
        ctx.fillStyle = C('--green');
        ctx.fillText('z=' + z.toFixed(2), D.clamp(X(z), p2.px + 30, p2.px + p2.pw - 30), p2.py + 17);
        ctx.fillStyle = C('--red'); ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('阴影面积 = p 值 = ' + p.toFixed(4), p2.px + 6, p2.py + p2.ph - 22);
      });
      plot.animate(300);

      UI.readout(out, [
        ['检验方向', side === 'right' ? '右侧（拒绝域在最右尾）' : side === 'left' ? '左侧（拒绝域在最左尾）' : '双侧（两端各 α/2）'],
        ['统计量 z', f3(z)],
        ['p 值', f4(p)],
        ['α', f3(alpha)],
        ['临界值', side === 'two' ? '±' + f4(u2) : f4(crit)],
        ['拒绝域', side === 'right' ? 'z > ' + f4(u1) : side === 'left' ? 'z < ' + f4(-u1) : '|z| > ' + f4(u2)],
        ['判定（p 值法）', p < alpha ? 'p < α → 拒绝 H₀' : 'p ≥ α → 不能拒绝 H₀'],
        ['判定（临界值法）', reject ? '统计量落入拒绝域 → 拒绝 H₀' : '统计量未落入拒绝域 → 不能拒绝 H₀'],
        ['等价性', 'p < α ⟺ 统计量落入拒绝域：两种判定方式完全等价']
      ]);
    }
    draw();
  };

  /* ================================================================
     8.2b 功效函数：随真实均值变化的 1−β 曲线
     ================================================================ */
  W.powerCurve = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -4, xMax: 4, yMin: -0.03, yMax: 1.05,
      xTicks: 8, yTicks: 5, xLabel: 'δ = (μ − μ₀)/(σ/√n)', yLabel: '功效 1 − β', height: 322
    });
    let n = 16, alpha = 0.05, delta0 = 2, side = 'right', sg = 1;

    UI.seg(ctrl, [
      { label: '右侧 H₁: μ>μ₀', value: 'right' },
      { label: '左侧 H₁: μ<μ₀', value: 'left' },
      { label: '双侧 H₁: μ≠μ₀', value: 'two' }
    ], v => { side = v; draw(); }, 0);
    UI.slider(ctrl, { label: '样本量 n', min: 2, max: 50, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '显著性水平 α', min: 0.005, max: 0.2, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });
    UI.slider(ctrl, { label: '真实偏移 δ₀（标准化）', min: -4, max: 4, step: 0.1, value: delta0, fmt: v => v.toFixed(2), onInput: v => { delta0 = v; draw(); } });
    UI.slider(ctrl, { label: 'σ（用于换算实际均值差）', min: 0.5, max: 3, step: 0.1, value: sg, fmt: v => v.toFixed(1), onInput: v => { sg = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const Phi = v => S.normal.cdf(v, 0, 1);
      const u1 = S.normUpper(alpha), u2 = S.normUpper(alpha / 2);
      const power = d => side === 'right' ? 1 - Phi(u1 - d)
        : side === 'left' ? Phi(-u1 - d)
          : (1 - Phi(u2 - d)) + Phi(-u2 - d);
      const p0 = power(delta0);
      const beta = 1 - p0;
      // 达到 0.8 功效所需的 δ
      let need = NaN;
      for (let d = 0; d <= 40; d += 0.01) {
        const dd = side === 'left' ? -d : d;
        if (power(dd) >= 0.8) { need = dd; break; }
      }

      plot.setDomain(-4, 4, -0.03, 1.05);
      plot.clearLayers();
      plot.curve(power, { color: C('--brand'), width: 2.6 });
      plot.hline(alpha, { color: C('--accent'), dash: [6, 4], width: 1.4 });
      plot.vline(0, { color: T['--line-2'], dash: [4, 4], width: 1.2 });
      plot.custom((p2, ctx) => {
        if (delta0 < -4 || delta0 > 4) return;
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(p2.X(delta0), p2.py); ctx.lineTo(p2.X(delta0), p2.py + p2.ph); ctx.stroke();
        ctx.restore();
        // β 与 1−β 的竖条
        const x = p2.X(delta0);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, p2.Y(1)); ctx.lineTo(x, p2.Y(p0)); ctx.stroke();
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, p2.Y(p0)); ctx.lineTo(x, p2.Y(0)); ctx.stroke();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = x > p2.px + p2.pw / 2 ? 'right' : 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('β = ' + beta.toFixed(4), x + (x > p2.px + p2.pw / 2 ? -8 : 8), (p2.Y(1) + p2.Y(p0)) / 2);
        ctx.fillStyle = C('--green');
        ctx.fillText('功效 1−β = ' + p0.toFixed(4), x + (x > p2.px + p2.pw / 2 ? -8 : 8), (p2.Y(p0) + p2.Y(0)) / 2);
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('曲线在 δ=0 处的高度 = α（弃真概率）；δ 离 0 越远，功效越高', p2.px + 6, p2.py + 4);
        ctx.fillStyle = C('--accent'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.fillText('α = ' + alpha.toFixed(3), p2.px + 6, p2.Y(alpha) - 14);
      });
      plot.animate(340);

      UI.readout(out, [
        ['检验', side === 'right' ? '右侧单边' : side === 'left' ? '左侧单边' : '双侧'],
        ['α / 临界值', f3(alpha) + ' / ' + (side === 'two' ? '±' + f4(u2) : f4(side === 'right' ? u1 : -u1))],
        ['样本量 n', n],
        ['真实偏移 δ₀', f3(delta0)],
        ['功效 1 − β = P{拒绝 H₀ | 真值偏移 δ₀}', f4(p0)],
        ['取伪概率 β', f4(beta)],
        ['达到 0.8 功效所需 δ', isFinite(need) ? f3(need) : '（超出 4）'],
        ['换算成实际均值差 μ − μ₀', isFinite(need) ? 'δ·σ/√n = ' + f4(need * sg / Math.sqrt(n)) + '（σ = ' + sg.toFixed(1) + '）' : '—'],
        ['提升功效的途径', '增大 n（δ 与 √n 成正比）、提高 α、或增大真实偏移 μ−μ₀']
      ]);
    }
    draw();
  };

})(window);
