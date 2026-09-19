/* ============================================================
   ch6.js (widgets) — 第六章 数理统计的基本概念 可视化组件
   组件：sampling / sampleStats / chi2Dist / tDist / fDist /
         quantile / normalSampling
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI, S = global.Stats;
  const { C, f2, f3, f4 } = UI;

  /* ================================================================
     6.1 从总体到样本：抽样直方图 vs 总体密度
     ================================================================ */
  W.sampling = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let key = 'normal', n = 200, seed = 20260910;

    const POPS = {
      normal: { label: '正态 N(2, 1)', xMin: -2.5, xMax: 6.5, pdf: x => S.normal.pdf(x, 2, 1), cdf: x => S.normal.cdf(x, 2, 1), gen: r => 2 + S.randn(r) },
      uniform: { label: '均匀 U(0, 4)', xMin: -0.8, xMax: 4.8, pdf: x => S.uniform.pdf(x, 0, 4), cdf: x => S.uniform.cdf(x, 0, 4), gen: r => 4 * r() },
      expon: { label: '指数 E(1)', xMin: -0.6, xMax: 8, pdf: x => S.expon.pdf(x, 1), cdf: x => S.expon.cdf(x, 1), gen: r => -Math.log(1 - Math.min(r(), 1 - 1e-12)) },
      mixed: {
        label: '混合正态（双峰）', xMin: -5, xMax: 7,
        pdf: x => 0.5 * S.normal.pdf(x, -1, 0.7) + 0.5 * S.normal.pdf(x, 3, 0.9),
        cdf: x => 0.5 * S.normal.cdf(x, -1, 0.7) + 0.5 * S.normal.cdf(x, 3, 0.9),
        gen: r => (r() < 0.5 ? -1 + 0.7 * S.randn(r) : 3 + 0.9 * S.randn(r))
      }
    };
    const keys = Object.keys(POPS);

    UI.seg(ctrl, keys.map(k => ({ label: POPS[k].label, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '样本量 n', min: 20, max: 2000, step: 10, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const pop = POPS[key];
      const rand = S.rng(seed * 6151 + 3);
      const xs = [];
      for (let i = 0; i < n; i++) xs.push(pop.gen(rand));
      const stat = S.meanVar(xs);

      const BINS = 34;
      const xMin = pop.xMin, xMax = pop.xMax;
      const counts = new Float64Array(BINS);
      xs.forEach(x => {
        const b = Math.floor((x - xMin) / (xMax - xMin) * BINS);
        if (b >= 0 && b < BINS) counts[b]++;
      });
      const binW = (xMax - xMin) / BINS;
      const dens = Array.from(counts, c => c / n / binW);
      const peak = Math.max(Math.max(...dens), Math.max(...Array.from({ length: 200 }, (_, i) => pop.pdf(xMin + (xMax - xMin) * i / 200))));

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 26, padT = 48, padB = 62;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - xMin) / (xMax - xMin) * pw;
        const yMax = peak * 1.2;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('样本直方图（面积＝1）与总体密度 f(x) 的对照', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 直方图
        for (let i = 0; i < BINS; i++) {
          const h = (padT + ph) - Y(dens[i]);
          if (h <= 0.3) continue;
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.42);
          ctx.fillRect(padL + pw * i / BINS + 0.4, Y(dens[i]), Math.max(1, pw / BINS - 0.8), h);
        }

        // 总体密度
        ctx.beginPath();
        for (let i = 0; i <= 320; i++) {
          const v = xMin + (xMax - xMin) * i / 320;
          const y = Y(pop.pdf(v));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.2; ctx.stroke();

        // 样本均值 / 总体均值
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(stat.mean), padT); ctx.lineTo(X(stat.mean), padT + ph); ctx.stroke();
        ctx.strokeStyle = D.withAlpha(C('--purple'), 0.9);
        ctx.beginPath(); ctx.moveTo(X(stat.mean - Math.sqrt(stat.varr)), padT); ctx.lineTo(X(stat.mean - Math.sqrt(stat.varr)), padT + ph); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(stat.mean + Math.sqrt(stat.varr)), padT); ctx.lineTo(X(stat.mean + Math.sqrt(stat.varr)), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('x̄', X(stat.mean), padT + 3);

        // 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = xMin + (xMax - xMin) * i / 6;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('红曲线＝总体密度；绿虚线＝x̄；紫虚线＝x̄ ± s', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['总体', pop.label],
        ['样本容量 n', n],
        ['样本均值 x̄', f4(stat.mean)],
        ['样本方差 s²（分母 n−1）', f4(stat.varr)],
        ['未修正二阶中心矩 b₂（分母 n）', f4(stat.varr * (n - 1) / n)],
        ['关系校验', 'b₂ = (n−1)/n · s²']
      ]);
    }
    draw();
  };

  /* ================================================================
     6.2 样本均值与样本方差：逐步计算
     ================================================================ */
  W.sampleStats = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let data = [4, 6, 5, 7, 8];
    let seed = 20260910;

    function regen(nn) {
      const rand = S.rng(seed++);
      const arr = [];
      for (let i = 0; i < nn; i++) arr.push(Math.round((5 + 2 * S.randn(rand)) * 10) / 10);
      return arr;
    }

    UI.seg(ctrl, [
      { label: '示例 5 个数据', value: 'demo' },
      { label: '随机 6 个', value: 'r6' },
      { label: '随机 10 个', value: 'r10' }
    ], v => {
      data = v === 'demo' ? [4, 6, 5, 7, 8] : regen(v === 'r6' ? 6 : 10);
      draw();
    }, 0);

    function draw() {
      const T = D.Theme.cache;
      const n = data.length;
      const mean = data.reduce((a, b) => a + b, 0) / n;
      const dev = data.map(x => x - mean);
      const ss = dev.reduce((a, b) => a + b * b, 0);
      const s2 = ss / (n - 1);
      const b2 = ss / n;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padR = 26, padT = 46, padB = 52;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('数据点、偏差 (xᵢ−x̄) 与平方和', padL, padT - 12);

        // 数轴
        const lo = Math.min(...data) - 1, hi = Math.max(...data) + 1;
        const X = v => padL + (v - lo) / (hi - lo) * pw;
        const axisY = padT + ph * 0.55;

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(padL, axisY); ctx.lineTo(padL + pw, axisY); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let v = Math.ceil(lo); v <= Math.floor(hi); v++) {
          const x = X(v);
          ctx.beginPath(); ctx.moveTo(x, axisY - 4); ctx.lineTo(x, axisY + 4);
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1; ctx.stroke();
          ctx.fillText(v, x, axisY + 7);
        }

        // 偏差竖线
        data.forEach((x, i) => {
          const cx = X(x);
          ctx.beginPath();
          ctx.moveTo(cx, axisY); ctx.lineTo(cx, axisY - 34 - Math.abs(dev[i]) * 6);
          ctx.strokeStyle = D.withAlpha(dev[i] >= 0 ? C('--accent') : C('--purple'), 0.75);
          ctx.lineWidth = 2; ctx.stroke();
          // 点
          ctx.beginPath(); ctx.arc(cx, axisY, 4.6, 0, D.TAU);
          ctx.fillStyle = C('--brand'); ctx.fill();
          // 偏差值
          ctx.fillStyle = T['--ink-3']; ctx.font = '600 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(dev[i].toFixed(1), cx, axisY - 38 - Math.abs(dev[i]) * 6);
        });

        // 均值线
        const mx = X(mean);
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(mx, padT + 4); ctx.lineTo(mx, padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('x̄ = ' + mean.toFixed(2), mx, padT + 2);

        // 底部公式链
        const cx0 = padL, cy0 = padT + ph + 14;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '600 11px ' + D.FONT_MONO;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('Σ(xᵢ−x̄)² = ' + ss.toFixed(3)
          + '    s² = Σ/(n−1) = ' + s2.toFixed(4)
          + '    b₂ = Σ/n = ' + b2.toFixed(4), cx0, cy0);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillText('校验：b₂ = (n−1)/n · s² = ' + (s2 * (n - 1) / n).toFixed(4)
          + '；Σ(xᵢ−x̄) = ' + dev.reduce((a, b) => a + b, 0).toFixed(6) + '（恒为 0）', cx0, cy0 + 16);
      });
      scene.static();

      UI.readout(out, [
        ['样本', '[' + data.join(', ') + ']'],
        ['n', n],
        ['x̄', f4(mean)],
        ['Σ(xᵢ−x̄)²', f4(ss)],
        ['s² = Σ/(n−1)', f4(s2)],
        ['b₂ = Σ/n', f4(b2)],
        ['s', f4(Math.sqrt(s2))]
      ]);
    }
    draw();
  };

  /* ================================================================
     6.3a χ² 分布
     ================================================================ */
  W.chi2Dist = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 310);
    let n = 8, alpha = 0.05;

    UI.slider(ctrl, { label: '自由度 n', min: 1, max: 30, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '上侧面积 α', min: 0.005, max: 0.25, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const q = S.chi2Upper(alpha, n);
      const xMax = Math.max(q * 1.35, n + 4 * Math.sqrt(2 * n), 10);
      const peak = Math.max(...Array.from({ length: 200 }, (_, i) => S.chi2.pdf(xMax * (i + 1) / 200, n)));
      const yMax = peak * 1.22;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 46, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + v / xMax * pw;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('χ² 分布 χ²(' + n + ')：E = n = ' + n + '，D = 2n = ' + (2 * n), padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 上侧 α 尾部
        ctx.beginPath();
        ctx.moveTo(X(q), padT + ph);
        for (let i = 0; i <= 160; i++) {
          const v = q + (xMax - q) * i / 160;
          ctx.lineTo(X(v), Y(S.chi2.pdf(v, n)));
        }
        ctx.lineTo(X(xMax), padT + ph);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.32);
        ctx.fill();

        // 曲线
        ctx.beginPath();
        for (let i = 0; i <= 320; i++) {
          const v = xMax * i / 320;
          const y = Y(S.chi2.pdf(v, n));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();

        // 分位数线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(X(q), padT); ctx.lineTo(X(q), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('χ²_' + alpha.toFixed(3) + '(' + n + ') = ' + q.toFixed(3), Math.min(X(q), padL + pw - 60), padT - 2);

        // 面积标注
        ctx.fillStyle = C('--red'); ctx.font = '600 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText('α = ' + alpha.toFixed(3), padL + pw - 4, padT + 4);

        // 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) ctx.fillText(D.niceNum(xMax * i / 6), X(xMax * i / 6), padT + ph + 6);

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('红色尾部面积 = α；n 越大曲线越对称（趋近正态）', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['χ² 分布', 'χ²(' + n + ')'],
        ['E(χ²) = n', n],
        ['D(χ²) = 2n', 2 * n],
        ['α', f3(alpha)],
        ['上侧分位数 χ²_α(n)', f4(q)],
        ['P{χ² > ' + q.toFixed(3) + '}', f4(1 - S.chi2.cdf(q, n))]
      ]);
    }
    draw();
  };

  /* ================================================================
     6.3b t 分布
     ================================================================ */
  W.tDist = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 310);
    let n = 5, alpha = 0.025;

    UI.slider(ctrl, { label: '自由度 n', min: 1, max: 40, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '上侧面积 α', min: 0.005, max: 0.25, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const q = S.tUpper(alpha, n);
      const uq = S.normUpper(alpha);
      const R = Math.max(4.2, Math.abs(q) * 1.35, Math.abs(uq) * 1.35);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 46, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v + R) / (2 * R) * pw;
        const peak = Math.max(S.tDist.pdf(0, n), S.normal.pdf(0, 0, 1));
        const yMax = peak * 1.2;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('t(' + n + ') 与 N(0,1)：尾部厚度对比', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // t 右侧尾部
        ctx.beginPath();
        ctx.moveTo(X(q), padT + ph);
        for (let i = 0; i <= 160; i++) {
          const v = q + (R - q) * i / 160;
          ctx.lineTo(X(v), Y(S.tDist.pdf(v, n)));
        }
        ctx.lineTo(X(R), padT + ph);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.30);
        ctx.fill();

        // 正态右侧尾部（对照）
        ctx.beginPath();
        ctx.moveTo(X(uq), padT + ph);
        for (let i = 0; i <= 160; i++) {
          const v = uq + (R - uq) * i / 160;
          ctx.lineTo(X(v), Y(S.normal.pdf(v, 0, 1)));
        }
        ctx.lineTo(X(R), padT + ph);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--purple'), 0.16);
        ctx.fill();

        // 曲线
        ctx.beginPath();
        for (let i = 0; i <= 340; i++) {
          const v = -R + 2 * R * i / 340;
          const y = Y(S.normal.pdf(v, 0, 1));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.8; ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        for (let i = 0; i <= 340; i++) {
          const v = -R + 2 * R * i / 340;
          const y = Y(S.tDist.pdf(v, n));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.3; ctx.stroke();

        // 分位数线
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(q), padT); ctx.lineTo(X(q), padT + ph); ctx.stroke();
        ctx.strokeStyle = D.withAlpha(C('--purple'), 0.9);
        ctx.beginPath(); ctx.moveTo(X(uq), padT + 18); ctx.lineTo(X(uq), padT + ph); ctx.stroke();
        ctx.restore();

        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('t_α=' + q.toFixed(3), X(q), padT + 3);
        ctx.fillStyle = C('--purple');
        ctx.fillText('u_α=' + uq.toFixed(3), X(uq), padT + 3);

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
        ctx.fillText('实线＝t(' + n + ')（尾部更厚）；虚线＝N(0,1)；n→∞ 时两者重合', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['t 分布', 't(' + n + ')'],
        ['D(T) = n/(n−2)', n > 2 ? f4(n / (n - 2)) : '不存在（n ≤ 2）'],
        ['α', f3(alpha)],
        ['t_α(n)', f4(q)],
        ['u_α（正态）', f4(uq)],
        ['t_α 与 u_α 之差', f4(q - uq)],
        ['说明', q > uq ? 't 分位数更大（更保守）✓' : '两者近似相等']
      ]);
    }
    draw();
  };

  /* ================================================================
     6.3c F 分布
     ================================================================ */
  W.fDist = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 310);
    let m = 6, n = 10, alpha = 0.05;

    UI.slider(ctrl, { label: '第一自由度 m', min: 1, max: 25, value: m, onInput: v => { m = v; draw(); } });
    UI.slider(ctrl, { label: '第二自由度 n', min: 1, max: 25, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '上侧面积 α', min: 0.005, max: 0.25, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const q = S.fUpper(alpha, m, n);
      const qRev = 1 / S.fUpper(alpha, n, m);
      const xMax = Math.max(q * 1.4, 4);
      const peak = Math.max(...Array.from({ length: 200 }, (_, i) => S.fDist.pdf(xMax * (i + 1) / 200, m, n)));
      const yMax = peak * 1.25;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 46, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + v / xMax * pw;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('F 分布 F(' + m + ', ' + n + ')：取值非负、右偏', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 右尾
        ctx.beginPath();
        ctx.moveTo(X(q), padT + ph);
        for (let i = 0; i <= 160; i++) {
          const v = q + (xMax - q) * i / 160;
          ctx.lineTo(X(v), Y(S.fDist.pdf(v, m, n)));
        }
        ctx.lineTo(X(xMax), padT + ph);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.30);
        ctx.fill();

        // 曲线
        ctx.beginPath();
        for (let i = 0; i <= 340; i++) {
          const v = xMax * i / 340;
          const y = Y(S.fDist.pdf(v, m, n));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();

        // F=1 参考
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = D.withAlpha(C('--green'), 0.9); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(X(1), padT); ctx.lineTo(X(1), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '600 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('F=1', X(1), padT + 3);

        // 分位数
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(X(q), padT); ctx.lineTo(X(q), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText('F_α(m,n) = ' + q.toFixed(3), X(q) - 4, padT + 16);

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) ctx.fillText(D.niceNum(xMax * i / 6), X(xMax * i / 6), padT + ph + 6);

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('分母自由度 n 越大，曲线峰越靠近 F=1；右侧 α 面积即上侧分位数', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['F 分布', 'F(' + m + ', ' + n + ')'],
        ['E(F) = n/(n−2)', n > 2 ? f4(n / (n - 2)) : '不存在'],
        ['F_α(m,n)', f4(q)],
        ['F_{1−α}(m,n) = 1/F_α(n,m)', f4(qRev)],
        ['F_{1−α}(n,m) = 1/F_α(m,n)', f4(1 / q)],
        ['倒数关系校验', 'F_{1−α}(m,n)·F_α(n,m) = ' + (qRev * S.fUpper(alpha, n, m)).toFixed(6)]
      ]);
    }
    draw();
  };

  /* ================================================================
     6.4 上侧 α 分位数
     ================================================================ */
  W.quantile = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let kind = 'normal', alpha = 0.05, n = 9;

    UI.seg(ctrl, [
      { label: '标准正态 u_α', value: 'normal' },
      { label: 'χ²_α(n)', value: 'chi2' },
      { label: 't_α(n)', value: 't' },
      { label: 'F_α(m,n)', value: 'f' }
    ], v => { kind = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'α（右侧面积）', min: 0.005, max: 0.4, step: 0.005, value: alpha, fmt: v => v.toFixed(3), onInput: v => { alpha = v; draw(); } });
    UI.slider(ctrl, { label: '自由度 n', min: 1, max: 30, value: n, onInput: v => { n = v; draw(); } });

    const SPEC = {
      normal: {
        name: '标准正态 N(0,1)', sym: true, pdf: x => S.normal.pdf(x, 0, 1),
        cdf: x => S.normal.cdf(x, 0, 1), upper: a => S.normUpper(a),
        range: q => Math.max(3.2, Math.abs(q) * 1.4), pdfPeak: 0.4
      },
      chi2: {
        name: 'χ²(n)', sym: false, pdf: x => S.chi2.pdf(x, n),
        cdf: x => S.chi2.cdf(x, n), upper: a => S.chi2Upper(a, n),
        range: q => Math.max(q * 1.35, n + 3 * Math.sqrt(2 * n)), pdfPeak: Math.max(0.02, S.chi2.pdf(Math.max(1, n - 2), n))
      },
      t: {
        name: 't(n)', sym: true, pdf: x => S.tDist.pdf(x, n),
        cdf: x => S.tDist.cdf(x, n), upper: a => S.tUpper(a, n),
        range: q => Math.max(4, Math.abs(q) * 1.4), pdfPeak: S.tDist.pdf(0, n)
      },
      f: {
        name: 'F(m,n)（取 m = n）', sym: false, pdf: x => S.fDist.pdf(n, n),
        cdf: x => S.fDist.cdf(x, n, n), upper: a => S.fUpper(a, n, n),
        range: q => Math.max(q * 1.4, 3.5), pdfPeak: Math.max(0.01, S.fDist.pdf(1, n, n))
      }
    };

    function draw() {
      const T = D.Theme.cache;
      const sp = SPEC[kind];
      const q = sp.upper(alpha);
      const R = sp.range(q);
      const xMin = sp.sym ? -R : 0, xMax = sp.sym ? R : R;
      const yMax = sp.pdfPeak * 1.25;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 46, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - xMin) / (xMax - xMin) * pw;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(sp.name + ' 的上侧 ' + alpha.toFixed(3) + ' 分位数', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 右侧 α 面积
        ctx.beginPath();
        ctx.moveTo(X(q), padT + ph);
        for (let i = 0; i <= 160; i++) {
          const v = q + (xMax - q) * i / 160;
          ctx.lineTo(X(v), Y(sp.pdf(v)));
        }
        ctx.lineTo(X(xMax), padT + ph);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.34);
        ctx.fill();

        // 曲线
        ctx.beginPath();
        for (let i = 0; i <= 340; i++) {
          const v = xMin + (xMax - xMin) * i / 340;
          const y = Y(sp.pdf(v));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();

        // 对称分布的另一尾（浅色，提示双侧用法）
        if (sp.sym) {
          const ql = -q;
          ctx.beginPath();
          ctx.moveTo(X(xMin), padT + ph);
          for (let i = 0; i <= 160; i++) {
            const v = ql - (ql - xMin) * i / 160;
            ctx.lineTo(X(v), Y(sp.pdf(v)));
          }
          ctx.lineTo(X(xMin), padT + ph);
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--purple'), 0.18);
          ctx.fill();
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(X(ql), padT); ctx.lineTo(X(ql), padT + ph); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = C('--purple'); ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText('−' + q.toFixed(3), X(ql), padT + 16);
        }

        // 分位数线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.9;
        ctx.beginPath(); ctx.moveTo(X(q), padT); ctx.lineTo(X(q), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(q.toFixed(4), X(q), padT - 2);
        ctx.font = '600 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText('α = ' + alpha.toFixed(3), padL + pw - 4, padT + 4);

        // 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = xMin + (xMax - xMin) * i / 6;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText(sp.sym ? '红色＝右侧 α 面积；紫色＝对称的左尾（双侧检验用 ±）' : '红尾在右侧：α 越小，分位数越靠右、数值越大', padL, H_ - 8);
      });
      scene.static();

      const verify = 1 - sp.cdf(q);
      const rows = [
        ['分布', sp.name],
        ['α', f3(alpha)],
        ['查表值 ' + (kind === 'normal' ? 'u_α' : (kind === 'chi2' ? 'χ²_α(n)' : (kind === 't' ? 't_α(n)' : 'F_α(n,n)'))), f4(q)],
        ['反查 P{X > 查表值}', f4(verify)],
        ['校验偏差', f4(Math.abs(verify - alpha))]
      ];
      if (kind === 'normal') rows.push(['常见 α：0.05 / 0.025 / 0.005', '1.645 / 1.96 / 2.576']);
      if (kind === 't') rows.push(['双侧 0.05 的临界值 t_{0.025}(n)', f4(S.tUpper(0.025, n))]);
      UI.readout(out, rows);
    }
    draw();
  };

  /* ================================================================
     6.5 正态总体的常用抽样分布（蒙特卡洛验证四个定理）
     ================================================================ */
  W.normalSampling = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 350);
    let mode = 'mean', n = 8, reps = 3000, sig = 2, mu = 1, seed = 20260910;

    UI.seg(ctrl, [
      { label: '定理1 X̄ 的分布', value: 'mean' },
      { label: '定理2 (n−1)S²/σ² ~ χ²', value: 'var' },
      { label: '定理4 T ~ t(n−1)', value: 't' },
      { label: '定理3 X̄ ⊥ S²', value: 'indep' }
    ], v => { mode = v; draw(); }, 0);
    UI.slider(ctrl, { label: '样本量 n', min: 3, max: 30, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '模拟次数', min: 500, max: 6000, step: 500, value: reps, onInput: v => { reps = v; draw(); } });
    UI.slider(ctrl, { label: 'σ', min: 0.5, max: 4, step: 0.1, value: sig, fmt: v => v.toFixed(1), onInput: v => { sig = v; draw(); } });

    function simulate() {
      const rand = S.rng(seed * 15485863 + n * 17 + Math.round(sig * 10));
      const meanZ = [], chi2v = [], tv = [], scat = [];
      for (let r = 0; r < reps; r++) {
        const xs = [];
        for (let i = 0; i < n; i++) xs.push(mu + sig * S.randn(rand));
        const st = S.meanVar(xs);
        const m = st.mean, s2 = st.varr;
        meanZ.push((m - mu) / (sig / Math.sqrt(n)));
        chi2v.push((n - 1) * s2 / (sig * sig));
        tv.push((m - mu) / Math.sqrt(s2 / n));
        if (r < 600) scat.push([m, s2]);
      }
      return { meanZ, chi2v, tv, scat };
    }

    function draw() {
      const T = D.Theme.cache;
      const sim = simulate();
      let outData = null;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 56, padR = 30, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';

        if (mode === 'indep') {
          /* ---- 散点：X̄ 与 S² 是否独立 ---- */
          ctx.fillText('X̄ 与 S² 的联合散点（正态总体下二者独立 → 无明显结构）', padL, padT - 12);
          const xLo = mu - 4 * sig / Math.sqrt(n), xHi = mu + 4 * sig / Math.sqrt(n);
          const yLo = 0, yHi = sig * sig * 2.4;
          const X = v => padL + (v - xLo) / (xHi - xLo) * pw;
          const Y = v => padT + ph - (v - yLo) / (yHi - yLo) * ph;

          ctx.fillStyle = T['--card-2'];
          ctx.beginPath(); D.roundRectPath(ctx, padL, padT, pw, ph, 8); ctx.fill();
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2; ctx.stroke();

          ctx.save();
          ctx.beginPath(); D.roundRectPath(ctx, padL, padT, pw, ph, 8); ctx.clip();
          sim.scat.forEach(([m, s2]) => {
            if (s2 > yHi) return;
            ctx.beginPath(); ctx.arc(X(m), Y(s2), 2.3, 0, D.TAU);
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.38); ctx.fill();
          });
          ctx.restore();

          // 理论边界：σ² 附近的带状
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
          const yv = Y(sig * sig);
          ctx.beginPath(); ctx.moveTo(padL, yv); ctx.lineTo(padL + pw, yv); ctx.stroke();
          ctx.strokeStyle = C('--accent');
          const xv = X(mu);
          ctx.beginPath(); ctx.moveTo(xv, padT); ctx.lineTo(xv, padT + ph); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText('σ² = ' + (sig * sig).toFixed(2), padL + 4, yv - 3);
          ctx.fillStyle = C('--accent');
          ctx.fillText('μ = ' + mu, xv + 4, padT + 12);

          // 相关系数（样本）
          const ms = sim.scat.map(a => a[0]), ss = sim.scat.map(a => a[1]);
          const mm = ms.reduce((a, b) => a + b, 0) / ms.length;
          const sm = ss.reduce((a, b) => a + b, 0) / ss.length;
          let cxy = 0, vx = 0, vy = 0;
          for (let i = 0; i < ms.length; i++) {
            cxy += (ms[i] - mm) * (ss[i] - sm);
            vx += (ms[i] - mm) ** 2; vy += (ss[i] - sm) ** 2;
          }
          const rho = cxy / Math.sqrt(vx * vy);
          ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
          ctx.fillText('样本相关系数 ρ(X̄, S²) = ' + rho.toFixed(4), padL + pw - 6, H_ - 8);
          ctx.textAlign = 'left';
          ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-3'];
          ctx.fillText('散点在水平/垂直方向都没有趋势 → 不相关（且正态下独立）', padL, H_ - 8);
          outData = {
            rho,
            rows: [
              ['模式', '定理 3：X̄ 与 S² 的独立性'],
              ['n', n], ['σ²', f4(sig * sig)], ['散点数', sim.scat.length],
              ['样本相关系数', f4(rho)],
              ['判定', Math.abs(rho) < 0.12 ? '接近 0 → 与「独立」相符 ✓' : '有轻微相关（随机波动）']
            ]
          };
          return;
        }

        let vals, label, pdf, lb, ub;
        if (mode === 'mean') {
          vals = sim.meanZ; label = '(X̄−μ)/(σ/√n) 的经验分布';
          pdf = z => S.normal.pdf(z, 0, 1); lb = -4; ub = 4;
        } else if (mode === 'var') {
          vals = sim.chi2v; label = '(n−1)S²/σ² 的经验分布';
          pdf = z => S.chi2.pdf(z, n - 1);
          lb = 0; ub = Math.max(n - 1 + 4 * Math.sqrt(2 * (n - 1)), 6);
        } else {
          vals = sim.tv; label = '(X̄−μ)/(S/√n) 的经验分布';
          pdf = z => S.tDist.pdf(z, n - 1); lb = -5; ub = 5;
        }

        const BINS = 55;
        const hist = new Float64Array(BINS);
        const w0 = (ub - lb) / BINS;
        vals.forEach(v => {
          const b = Math.floor((v - lb) / w0);
          if (b >= 0 && b < BINS) hist[b]++;
        });
        const dens = Array.from(hist, c => c / vals.length / w0);
        const yMax = Math.max(Math.max(...dens), Math.max(...Array.from({ length: 200 }, (_, i) => pdf(lb + (ub - lb) * (i + 1) / 200)))) * 1.18;
        const X = v => padL + (v - lb) / (ub - lb) * pw;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillText(label + ' vs 理论密度（n = ' + n + '，' + reps + ' 次模拟）', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        for (let i = 0; i < BINS; i++) {
          const h = (padT + ph) - Y(dens[i]);
          if (h <= 0.3) continue;
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.45);
          ctx.fillRect(padL + pw * i / BINS + 0.4, Y(dens[i]), Math.max(1, pw / BINS - 0.8), h);
        }

        ctx.beginPath();
        for (let i = 0; i <= 320; i++) {
          const v = lb + (ub - lb) * i / 320;
          const y0 = Y(pdf(v));
          if (!isFinite(y0)) continue;
          i ? ctx.lineTo(X(v), y0) : ctx.moveTo(X(v), y0);
        }
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.2; ctx.stroke();

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = lb + (ub - lb) * i / 6;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        const theory = mode === 'mean' ? 'N(0,1)' : (mode === 'var' ? 'χ²(' + (n - 1) + ')' : 't(' + (n - 1) + ')');
        ctx.fillText('红曲线＝理论密度 ' + theory + '；直方图＝模拟频率', padL, H_ - 8);

        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        const vr = vals.reduce((a, b) => a + (b - avg) ** 2, 0) / (vals.length - 1);
        const thMean = mode === 'mean' ? 0 : (mode === 'var' ? n - 1 : (n - 1 > 0 ? 0 : NaN));
        const thVar = mode === 'mean' ? 1 : (mode === 'var' ? 2 * (n - 1) : (n - 1 > 2 ? (n - 1) / (n - 3) : NaN));
        outData = {
          rows: [
            ['模式', label],
            ['n', n], ['σ', f2(sig)],
            ['模拟均值', f4(avg)],
            ['理论均值', isFinite(thMean) ? f4(thMean) : '—'],
            ['模拟方差', f4(vr)],
            ['理论方差', isFinite(thVar) ? f4(thVar) : '不存在']
          ]
        };
      });
      scene.static();
      if (outData) UI.readout(out, outData.rows);
    }
    draw();
  };

  /* ================================================================
     6.3b χ² 分布的构造：n 个标准正态平方和的模拟
     ================================================================ */
  W.chi2Sim = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 328);
    let n = 5, reps = 4000, seed = 20260910;

    UI.slider(ctrl, { label: '自由度 n', min: 1, max: 20, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '模拟次数', min: 1000, max: 8000, step: 500, value: reps, onInput: v => { reps = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 2654435761 % 2147483647 + n * 13);
      const xMax = Math.max(4, n + 4.5 * Math.sqrt(2 * n));
      const BINS = 60, binW = xMax / BINS;
      const hist = new Float64Array(BINS);
      let s1 = 0, s2 = 0;
      for (let t = 0; t < reps; t++) {
        let s = 0;
        for (let i = 0; i < n; i++) { const z = S.randn(rand); s += z * z; }
        s1 += s; s2 += s * s;
        const b = Math.floor(s / xMax * BINS);
        if (b >= 0 && b < BINS) hist[b]++;
      }
      const mean = s1 / reps, varr = s2 / reps - mean * mean;
      const dens = i => hist[i] / reps / binW;
      let maxD = 0, maxf = 1e-9;
      for (let i = 0; i < BINS; i++) {
        maxD = Math.max(maxD, dens(i));
        maxf = Math.max(maxf, S.chi2.pdf((i + 0.5) * binW, n));
      }
      const yMax = Math.max(maxD, maxf) * 1.18;
      const cUp = S.chi2.upper(0.05, n);
      let tail = 0;
      for (let i = 0; i < BINS; i++) if ((i + 1) * binW > cUp) tail += hist[i] / reps;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 30, padT = 58, padB = 54;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + v / xMax * pw;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('χ²(n) 的构造：n 个独立标准正态的平方和（n = ' + n + '）', padL, padT - 14);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10.5px ' + D.FONT_MONO;
        ctx.fillText('Z₁² + Z₂² + ⋯ + Zₙ²，每个 Zᵢ ~ N(0,1)', padL, padT - 32);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        for (let i = 0; i < BINS; i++) {
          const h = (padT + ph) - Y(dens(i));
          if (h <= 0.3) continue;
          const x0 = padL + pw * i / BINS;
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.5);
          ctx.fillRect(x0 + 0.4, Y(dens(i)), Math.max(1, pw / BINS - 0.8), h);
        }
        ctx.beginPath();
        for (let i = 0; i <= 300; i++) {
          const v = xMax * i / 300;
          const y = Y(S.chi2.pdf(v, n));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.2; ctx.stroke();

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(n), padT); ctx.lineTo(X(n), padT + ph); ctx.stroke();
        if (cUp < xMax) {
          ctx.strokeStyle = C('--purple');
          ctx.beginPath(); ctx.moveTo(X(cUp), padT); ctx.lineTo(X(cUp), padT + ph); ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('E = n = ' + n, X(n), padT + 3);
        if (cUp < xMax) {
          ctx.fillStyle = C('--purple');
          ctx.fillText('χ²₀.₀₅(' + n + ') = ' + cUp.toFixed(2), X(cUp), padT + 17);
        }

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 8; i++) {
          const v = xMax * i / 8;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }
        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('红曲线＝χ²(n) 理论密度；紫虚线＝上侧 0.05 分位数，其右侧面积应为 0.05', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['自由度 n', n],
        ['构造', 'Z₁² + ⋯ + Zₙ²（每个 Zᵢ 独立 N(0,1)）'],
        ['理论 E(χ²) = n', f4(n)],
        ['模拟均值', f4(mean)],
        ['理论 D(χ²) = 2n', f4(2 * n)],
        ['模拟方差', f4(varr)],
        ['P{χ² > χ²₀.₀₅(n)} 模拟 / 理论', f4(tail) + ' / 0.0500'],
        ['可加性', 'χ²(m) + χ²(n) = χ²(m+n)（相互独立时）']
      ]);
    }
    draw();
  };

})(window);
