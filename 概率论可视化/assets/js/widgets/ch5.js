/* ============================================================
   ch5.js (widgets) — 第五章 大数定律和中心极限定理 可视化组件
   组件：chebyshev / lln / clt / normalApproxBinom
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI, S = global.Stats;
  const { C, f2, f3, f4 } = UI;

  /** 各分布的 pdf/cdf/参数说明（供本章多个组件共用） */
  const DISTS = {
    normal: { label: '正态 N(0,1)', pdf: x => S.normal.pdf(x, 0, 1), cdf: x => S.normal.cdf(x, 0, 1), mu: 0, varr: 1, xMin: -4.6, xMax: 4.6 },
    uniform: { label: '均匀 U(-√3,√3)', pdf: x => S.uniform.pdf(x, -Math.sqrt(3), Math.sqrt(3)), cdf: x => S.uniform.cdf(x, -Math.sqrt(3), Math.sqrt(3)), mu: 0, varr: 1, xMin: -2.2, xMax: 2.2 },
    expon: { label: '指数 E(1)−1', pdf: x => S.expon.pdf(x + 1, 1), cdf: x => x + 1 <= 0 ? 0 : S.expon.cdf(x + 1, 1), mu: 0, varr: 1, xMin: -1.05, xMax: 5.2 },
    bernoulli: { label: '0–1 B(1,0.5)', pdf: null, mu: 0.5, varr: 0.25, xMin: -0.7, xMax: 1.7, disc: true }
  };

  /* ================================================================
     5.1 切比雪夫不等式：界 vs 真实概率
     ================================================================ */
  W.chebyshev = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let key = 'normal', eps = 2;
    const keys = Object.keys(DISTS);

    UI.seg(ctrl, keys.map(k => ({ label: DISTS[k].label, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'ε（偏离阈值）', min: 0.3, max: 4, step: 0.1, value: eps, fmt: v => v.toFixed(1), onInput: v => { eps = v; draw(); } });

    /** 真实尾部概率 P{|X−μ| ≥ ε} */
    function tailProb(d, e) {
      if (d.disc) {
        // 0–1 分布：|X−0.5| ≥ ε
        let s = 0;
        [0, 1].forEach(x => { if (Math.abs(x - d.mu) >= e) s += 0.5; });
        return s;
      }
      return (1 - d.cdf(d.mu + e)) + d.cdf(d.mu - e);
    }

    function draw() {
      const T = D.Theme.cache;
      const d = DISTS[key];
      const bound = Math.min(1, d.varr / (eps * eps));
      const real = tailProb(d, eps);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 52, padB = 74;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const xMin = d.xMin, xMax = d.xMax;
        const X = v => padL + (v - xMin) / (xMax - xMin) * pw;
        const yMax = d.disc ? 0.62 : Math.max(0.2, d.pdf(d.mu) * 1.25);
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('阴影＝真实尾部概率 P{|X−μ| ≥ ε}；虚线框＝切比雪夫上界 σ²/ε²', padL, padT - 12);

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(D.niceNum(yMax * (1 - i / 4)), padL - 7, y);
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        if (d.disc) {
          // 两个柱
          [[0, 0.5], [1, 0.5]].forEach(([v, pv]) => {
            const cx = X(v), bw = Math.min(56, pw * 0.22);
            const inTail = Math.abs(v - d.mu) >= eps;
            ctx.beginPath();
            D.roundRectPath(ctx, cx - bw / 2, Y(pv), bw, padT + ph - Y(pv), 4);
            ctx.fillStyle = D.withAlpha(inTail ? C('--red') : C('--brand'), 0.55);
            ctx.fill();
            ctx.fillStyle = T['--ink-2']; ctx.font = '600 10px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText('0.5', cx, Y(pv) - 3);
            ctx.fillStyle = T['--ink-3']; ctx.textBaseline = 'top';
            ctx.fillText(String(v), cx, padT + ph + 6);
          });
        } else {
          // 密度曲线 + 尾部填充
          const samp = 400;
          // 尾部填充
          if (real > 1e-9) {
            [1, -1].forEach(sgn => {
              ctx.beginPath();
              const a = d.mu + sgn * eps;
              ctx.moveTo(X(a), padT + ph);
              for (let i = 0; i <= 120; i++) {
                const x = a + sgn * (xMax - xMin) * i / 120;
                if (x < xMin - 0.2 || x > xMax + 0.2) break;
                ctx.lineTo(X(x), Y(d.pdf(x)));
              }
              const far = sgn > 0 ? xMax : xMin;
              ctx.lineTo(X(far), padT + ph);
              ctx.closePath();
              ctx.fillStyle = D.withAlpha(C('--red'), 0.30);
              ctx.fill();
            });
          }
          // 曲线
          ctx.beginPath();
          for (let i = 0; i <= samp; i++) {
            const x = xMin + (xMax - xMin) * i / samp;
            const y = Y(d.pdf(x));
            i ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y);
          }
          ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();

          // μ 与 μ±ε
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(X(d.mu), padT); ctx.lineTo(X(d.mu), padT + ph); ctx.stroke();
          ctx.strokeStyle = D.withAlpha(C('--red'), 0.85);
          [d.mu - eps, d.mu + eps].forEach(v => {
            if (v < xMin - 0.3 || v > xMax + 0.3) return;
            ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), padT + ph); ctx.stroke();
          });
          ctx.restore();

          ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText('μ', X(d.mu), padT + 3);
          ctx.fillStyle = C('--red');
          ctx.fillText('μ+ε', X(d.mu + eps), padT + 3);

          ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          for (let i = 0; i <= 6; i++) {
            const v = xMin + (xMax - xMin) * i / 6;
            ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
          }
        }

        // 上界条形（可视化 σ²/ε²）
        const barY = padT + ph + 30;
        const barW = pw * 0.46;
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('上界 σ²/ε²', padL, barY);
        ctx.fillStyle = D.withAlpha(C('--line'), 0.9);
        ctx.beginPath(); D.roundRectPath(ctx, padL + 74, barY - 7, barW, 14, 7); ctx.fill();
        ctx.fillStyle = D.withAlpha(C('--purple'), 0.85);
        ctx.beginPath(); D.roundRectPath(ctx, padL + 74, barY - 7, Math.max(2, barW * bound), 14, 7); ctx.fill();

        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left';
        ctx.fillText('真实概率', padL + 74 + barW + 26, barY);
        ctx.fillStyle = D.withAlpha(C('--line'), 0.9);
        ctx.beginPath(); D.roundRectPath(ctx, padL + 74 + barW + 86, barY - 7, barW, 14, 7); ctx.fill();
        ctx.fillStyle = D.withAlpha(C('--red'), 0.8);
        ctx.beginPath(); D.roundRectPath(ctx, padL + 74 + barW + 86, barY - 7, Math.max(2, barW * Math.min(1, real)), 14, 7); ctx.fill();

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText('σ²/ε² = ' + bound.toFixed(4), padL + 74 + barW - 6, barY - 16);
      });
      scene.static();

      UI.readout(out, [
        ['分布', d.label],
        ['ε', f2(eps)],
        ['σ² = D(X)', f4(d.varr)],
        ['上界 σ²/ε²', f4(bound)],
        ['真实尾部概率', f4(real)],
        ['不等式是否成立', real <= bound + 1e-12 ? '成立 ✓（真实 ≤ 上界）' : '不成立 ✗']
      ]);
    }
    draw();
  };

  /* ================================================================
     5.2 大数定律：样本均值的收敛轨道
     ================================================================ */
  W.lln = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let key = 'uniform', runs = 12, N = 400, seed = 20260910;

    const SOURCES = {
      uniform: { label: '均匀 U(0,1)', mu: 0.5, varr: 1 / 12 },
      bernoulli: { label: '0–1 B(1,0.5)', mu: 0.5, varr: 0.25 },
      expon: { label: '指数 E(1)', mu: 1, varr: 1 },
      binom: { label: '二项 B(10,0.5)', mu: 5, varr: 2.5 }
    };
    const srcKeys = Object.keys(SOURCES);

    UI.seg(ctrl, srcKeys.map(k => ({ label: SOURCES[k].label, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '模拟轮数', min: 1, max: 30, value: runs, onInput: v => { runs = v; draw(); } });
    UI.slider(ctrl, { label: '最大 n', min: 50, max: 1500, step: 50, value: N, onInput: v => { N = v; draw(); } });
    const seedSlider = UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function oneSample(rand) {
      switch (key) {
        case 'uniform': return rand();
        case 'bernoulli': return rand() < 0.5 ? 1 : 0;
        case 'expon': return -Math.log(1 - Math.min(rand(), 1 - 1e-12));
        default: { let k = 0; for (let i = 0; i < 10; i++) if (rand() < 0.5) k++; return k; }
      }
    }

    function draw() {
      const T = D.Theme.cache;
      const src = SOURCES[key];
      const rand = S.rng(seed * 7919 + 13);
      const PALETTE = ['--brand', '--purple', '--teal', '--accent', '--green', '--red'];
      const colorAt = i => D.withAlpha(C(PALETTE[i % PALETTE.length]), Math.max(0.3, 0.78 - 0.14 * Math.floor(i / PALETTE.length)));

      // 生成 runs 条轨道
      const tracks = [];
      let allMin = Infinity, allMax = -Infinity;
      for (let r = 0; r < runs; r++) {
        const arr = new Float64Array(N);
        let sum = 0;
        for (let i = 0; i < N; i++) { sum += oneSample(rand); arr[i] = sum / (i + 1); }
        tracks.push(arr);
        for (let i = 0; i < N; i++) {
          if (arr[i] < allMin) allMin = arr[i];
          if (arr[i] > allMax) allMax = arr[i];
        }
      }
      const pad = Math.max(0.1 * (allMax - allMin), 0.02);
      const yLo = Math.min(allMin - pad, src.mu - pad), yHi = Math.max(allMax + pad, src.mu + pad);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 58, padR = 26, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = i => padL + i / (N - 1) * pw;
        const Y = v => padT + ph - (v - yLo) / (yHi - yLo) * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('每一条线＝一次独立模拟中 Ᾱₙ 随 n 的变化；绿线＝理论期望 μ', padL, padT - 12);

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((yHi - (yHi - yLo) * i / 4).toFixed(3), padL - 7, y);
        }

        // μ 参考线
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(padL, Y(src.mu)); ctx.lineTo(padL + pw, Y(src.mu)); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillText('μ = ' + src.mu, padL + pw - 2, Y(src.mu) - 4);

        // ±ε 带（ε = 3σ/√n）：展示收敛速度
        ctx.beginPath();
        const epsAt = n => 3 * Math.sqrt(src.varr / n);
        for (let i = 1; i < N; i += 2) ctx.lineTo(X(i), Y(src.mu + epsAt(i + 1)));
        for (let i = N - 1; i >= 1; i -= 2) ctx.lineTo(X(i), Y(src.mu - epsAt(i + 1)));
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--green'), 0.10);
        ctx.fill();

        // 轨道（轨道多时按步长抽样，保证绘制流畅）
        const stride = Math.max(1, Math.ceil(N / 700));
        tracks.forEach((arr, r) => {
          ctx.beginPath();
          for (let i = 0; i < N; i += stride) {
            const x = X(i), y = Y(arr[i]);
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.lineTo(X(N - 1), Y(arr[N - 1]));
          ctx.strokeStyle = colorAt(r);
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });

        // 轴
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const n = 1 + Math.round((N - 1) * i / 5);
          ctx.fillText('n=' + n, X(n - 1), padT + ph + 6);
        }

        // 图注
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('浅绿带＝μ ± 3σ/√n（理论波动范围，随 n 收缩）', padL, H_ - 8);
      });
      scene.static();

      // 统计：最后一轮的均值
      const last = tracks.map(a => a[N - 1]);
      const avgLast = last.reduce((a, b) => a + b, 0) / last.length;
      const sdLast = Math.sqrt(last.reduce((a, b) => a + (b - avgLast) * (b - avgLast), 0) / Math.max(1, last.length - 1));
      UI.readout(out, [
        ['总体分布', src.label],
        ['理论 μ', f4(src.mu)],
        ['理论 D(X)', f4(src.varr)],
        ['n = ' + N + ' 时的理论标准差 σ/√n', f4(Math.sqrt(src.varr / N))],
        ['模拟：各轮末 Ᾱₙ 平均', f4(avgLast)],
        ['模拟：各轮末 Ᾱₙ 标准差', f4(sdLast)],
        ['与 μ 的偏离', f4(avgLast - src.mu)]
      ]);
    }
    draw();
  };

  /* ================================================================
     5.3 中心极限定理：从任意总体到正态
     ================================================================ */
  W.clt = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let key = 'uniform', n = 2, reps = 4000, seed = 20260910;

    const POPS = {
      uniform: { label: '均匀 U(0,1)', mu: 0.5, varr: 1 / 12, gen: r => r() },
      bernoulli: { label: '0–1 B(1,0.3)', mu: 0.3, varr: 0.21, gen: r => r() < 0.3 ? 1 : 0 },
      expon: { label: '指数 E(1)', mu: 1, varr: 1, gen: r => -Math.log(1 - Math.min(r(), 1 - 1e-12)) },
      bimodal: {
        label: '双峰（两正态混合）', mu: 0, varr: 1 + 4,
        gen: r => S.randn(r) + (r() < 0.5 ? -2 : 2)
      },
      cauchyTrim: {
        label: '截断柯西（|X|≤10）', mu: 0, varr: NaN,
        gen: r => { const t = Math.tan(Math.PI * (r() - 0.5)); return Math.max(-10, Math.min(10, t)); }
      }
    };
    const popKeys = ['uniform', 'bernoulli', 'expon', 'bimodal'];

    UI.seg(ctrl, popKeys.map(k => ({ label: POPS[k].label, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '样本量 n', min: 1, max: 50, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '模拟次数', min: 500, max: 8000, step: 500, value: reps, onInput: v => { reps = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const pop = POPS[key];
      const rand = S.rng(seed * 104729 + n * 31 + 7);

      // 直接由总体参数标准化（避免有限样本的均值/方差偏差）
      const sdSum = Math.sqrt(pop.varr * n);
      const BINS = 61, R = 4.2;
      const hist = new Float64Array(BINS);
      for (let t = 0; t < reps; t++) {
        let s = 0;
        for (let i = 0; i < n; i++) s += pop.gen(rand);
        const z = (s - n * pop.mu) / sdSum;
        const b = Math.floor((z + R) / (2 * R) * BINS);
        if (b >= 0 && b < BINS) hist[b]++;
      }
      let maxH = 0;
      for (let i = 0; i < BINS; i++) maxH = Math.max(maxH, hist[i]);
      const binW = 2 * R / BINS;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 26, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v + R) / (2 * R) * pw;
        // 密度刻度：直方图面积 = 1 → 高度 = 频率/组距
        const density = i => hist[i] / reps / binW;
        const pdfPeak = S.normal.pdf(0, 0, 1);
        const yMax = Math.max(pdfPeak, Math.max(...Array.from(hist, (_, i) => density(i)))) * 1.18;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('标准化和 (Sₙ−nμ)/(σ√n) 的经验分布 vs 标准正态', padL, padT - 12);

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 直方图
        for (let i = 0; i < BINS; i++) {
          const x0 = padL + pw * i / BINS;
          const w = pw / BINS;
          const h = (padT + ph) - Y(density(i));
          if (h <= 0.3) continue;
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.45);
          ctx.fillRect(x0 + 0.4, Y(density(i)), Math.max(1, w - 0.8), h);
        }

        // 标准正态曲线
        ctx.beginPath();
        for (let i = 0; i <= 300; i++) {
          const v = -R + 2 * R * i / 300;
          const y = Y(S.normal.pdf(v, 0, 1));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.2; ctx.stroke();

        // x 轴刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 8; i++) {
          const v = -R + 2 * R * i / 8;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }

        // 图注
        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('红曲线＝N(0,1)；n 越大，直方图越贴合曲线', padL, H_ - 8);
      });
      scene.static();

      // KS 型偏差：max |经验CDF − Φ|
      let cum = 0, maxDev = 0;
      for (let i = 0; i < BINS; i++) {
        cum += hist[i] / reps;
        const x = -R + (i + 1) * binW;
        maxDev = Math.max(maxDev, Math.abs(cum - S.normal.cdf(x, 0, 1)));
      }

      UI.readout(out, [
        ['总体分布', pop.label],
        ['总体 μ / σ²', f3(pop.mu) + ' / ' + f3(pop.varr)],
        ['样本量 n', n],
        ['模拟次数', reps],
        ['标准化统计量', '(Sₙ − nμ)/(σ√n)'],
        ['经验分布与 N(0,1) 的最大偏差', f4(maxDev)],
        ['判定', maxDev < 0.05 ? '已非常接近正态 ✓' : (maxDev < 0.12 ? '接近正态（n 可再增大）' : '差距明显，n 偏小')]
      ]);
    }
    draw();
  };

  /* ================================================================
     5.4 二项分布的正态近似与连续性修正
     ================================================================ */
  W.normalApproxBinom = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let n = 60, p = 0.35, k = 24;

    UI.slider(ctrl, { label: 'n', min: 10, max: 300, step: 5, value: n, onInput: v => { n = v; k = Math.min(k, n); syncK(); draw(); } });
    UI.slider(ctrl, { label: 'p', min: 0.05, max: 0.95, step: 0.01, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; draw(); } });
    const kSlider = UI.slider(ctrl, { label: '分界点 k', min: 0, max: n, value: k, onInput: v => { k = v; draw(); } });

    function syncK() { kSlider.input.max = n; kSlider.set(k); }

    function draw() {
      const T = D.Theme.cache;
      const mu = n * p, varr = n * p * (1 - p), sd = Math.sqrt(varr);
      const exact = S.binom.cdf(k, n, p);
      const corrected = S.normal.cdf(k + 0.5, mu, sd);
      const plain = S.normal.cdf(k, mu, sd);

      // 显示范围：μ ± 4.2σ，并保证包含 k
      const lo = Math.max(0, Math.floor(mu - 4.2 * sd));
      const hi = Math.min(n, Math.ceil(mu + 4.2 * sd));
      const span = Math.max(hi - lo, 4);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - lo + 0.5) / (span + 1) * pw;
        const maxP = Math.max(...Array.from({ length: hi - lo + 1 }, (_, i) => S.binom.pmf(lo + i, n, p)), 1e-6);
        const yP = Math.max(maxP * 1.15, S.normal.pdf(mu, mu, sd) * 1.15);
        const Y = v => padT + ph - v / yP * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('B(' + n + ', ' + p.toFixed(2) + ') 的分布律与正态近似 N(np, np(1−p))', padL, padT - 12);

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 柱：k 左侧（含）为红（P{X≤k}），右侧为蓝
        const bw = Math.max(1.4, pw / (span + 1) * 0.74);
        for (let v = lo; v <= hi; v++) {
          const pv = S.binom.pmf(v, n, p);
          const h = (padT + ph) - Y(pv);
          if (h <= 0.3) continue;
          const cx = X(v);
          ctx.fillStyle = D.withAlpha(v <= k ? C('--red') : C('--brand'), v <= k ? 0.62 : 0.30);
          ctx.fillRect(cx - bw / 2, Y(pv), bw, h);
        }

        // 正态曲线
        ctx.beginPath();
        for (let i = 0; i <= 300; i++) {
          const v = lo - 0.5 + (span + 1) * i / 300;
          const y = Y(S.normal.pdf(v, mu, sd));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.2; ctx.stroke();

        // k 与 k+0.5 分界线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(k), padT); ctx.lineTo(X(k), padT + ph); ctx.stroke();
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(k + 0.5), padT); ctx.lineTo(X(k + 0.5), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('k=' + k, X(k), padT + 3);
        ctx.fillStyle = C('--green');
        ctx.fillText('k+0.5', X(k + 0.5), padT + 16);

        // 横轴刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        const step = Math.max(1, Math.round((span + 1) / 10));
        for (let v = lo; v <= hi; v += step) ctx.fillText(v, X(v), padT + ph + 6);

        // 图注
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('红色柱＝P{X ≤ k} 的精确贡献；紫曲线＝正态近似', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['np', f2(mu)],
        ['np(1−p)', f2(varr)],
        ['精确值 P{X ≤ ' + k + '}', f4(exact)],
        ['正态近似（未修正，用 k）', f4(plain)],
        ['正态近似（连续性修正，用 k+0.5）', f4(corrected)],
        ['修正带来的误差缩减', f4(Math.abs(plain - exact) - Math.abs(corrected - exact))],
        ['精度判据 np≥5 且 n(1−p)≥5', (mu >= 5 && n * (1 - p) >= 5) ? '满足 ✓' : '不满足，近似可能较差']
      ]);
    }
    draw();
  };

  /* ================================================================
     5.2b 伯努利大数定律：频率稳定到 p
     ================================================================ */
  W.llnFrequency = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 326);
    let p = 0.35, runs = 10, N = 500, seed = 20260910;

    UI.slider(ctrl, { label: '成功概率 p', min: 0.05, max: 0.95, step: 0.05, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; draw(); } });
    UI.slider(ctrl, { label: '模拟轮数', min: 1, max: 30, value: runs, onInput: v => { runs = v; draw(); } });
    UI.slider(ctrl, { label: '最大试验次数 n', min: 100, max: 2000, step: 50, value: N, onInput: v => { N = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 6151 + 29);
      const PALETTE = ['--brand', '--purple', '--teal', '--accent', '--green', '--red'];
      const colorAt = i => D.withAlpha(C(PALETTE[i % PALETTE.length]), Math.max(0.3, 0.78 - 0.14 * Math.floor(i / PALETTE.length)));
      const tracks = [];
      let yLo = 1, yHi = 0;
      for (let r = 0; r < runs; r++) {
        const arr = new Float64Array(N);
        let hit = 0;
        for (let i = 0; i < N; i++) {
          if (rand() < p) hit++;
          arr[i] = hit / (i + 1);
        }
        tracks.push(arr);
        for (let i = 0; i < N; i++) {
          if (arr[i] < yLo) yLo = arr[i];
          if (arr[i] > yHi) yHi = arr[i];
        }
      }
      yLo = Math.max(0, Math.min(yLo, p) - 0.12);
      yHi = Math.min(1, Math.max(yHi, p) + 0.12);
      const seq = S.bernoulliSeq(p, 64, S.rng(seed * 97 + 1));

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 46, padB = 52;
        const seqH = 34;
        const pw = W_ - padL - padR;
        const gh = H_ - padT - seqH - padB - 14;
        const gy = padT + seqH + 16;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('一次伯努利序列（绿＝成功）与多轮频率 ṅ_A/n 的收敛轨迹', padL, padT - 12);

        const cx0 = Math.min(16, pw / 64);
        seq.forEach((v, i) => {
          ctx.beginPath();
          D.roundRectPath(ctx, padL + i * cx0, padT - 6, Math.max(2, cx0 - 2.2), 16, 3);
          ctx.fillStyle = v ? D.withAlpha(C('--green'), 0.9) : D.withAlpha(T['--line-2'], 0.9);
          ctx.fill();
        });
        ctx.fillStyle = C('--green'); ctx.font = '600 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('前 64 次中成功 ' + seq.filter(v => v).length + ' 次，频率 ' + (seq.filter(v => v).length / 64).toFixed(3), padL, padT + 12);

        const Y = v => gy + gh - (v - yLo) / (yHi - yLo) * gh;
        const X = i => padL + i / (N - 1) * pw;
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = gy + gh * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((yHi - (yHi - yLo) * i / 4).toFixed(3), padL - 6, y);
        }
        // ±3σ/√n 带
        ctx.beginPath();
        for (let i = 1; i < N; i += 2) ctx.lineTo(X(i), Y(D.clamp(p + 3 * Math.sqrt(p * (1 - p) / (i + 1)), 0, 1)));
        for (let i = N - 1; i >= 1; i -= 2) ctx.lineTo(X(i), Y(D.clamp(p - 3 * Math.sqrt(p * (1 - p) / (i + 1)), 0, 1)));
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--green'), 0.10); ctx.fill();
        const stride = Math.max(1, Math.ceil(N / 700));
        tracks.forEach((arr, r) => {
          ctx.beginPath();
          for (let i = 0; i < N; i += stride) i ? ctx.lineTo(X(i), Y(arr[i])) : ctx.moveTo(X(i), Y(arr[i]));
          ctx.lineTo(X(N - 1), Y(arr[N - 1]));
          ctx.strokeStyle = colorAt(r);
          ctx.lineWidth = 1.5; ctx.stroke();
        });
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(padL, Y(p)); ctx.lineTo(padL + pw, Y(p)); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillText('p = ' + p.toFixed(2), padL + pw - 2, Y(p) - 4);
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, gy + gh + .5); ctx.lineTo(padL + pw, gy + gh + .5); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const nn = 1 + Math.round((N - 1) * i / 5);
          ctx.fillText('n=' + nn, X(nn - 1), gy + gh + 6);
        }
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('浅绿带＝p ± 3√(p(1−p)/n)：由切比雪夫不等式，n 越大频率越集中在 p 附近', padL, H_ - 8);
      });
      scene.static();

      const last = tracks.map(a => a[N - 1]);
      const avg = last.reduce((a, b) => a + b, 0) / last.length;
      const sd = Math.sqrt(last.reduce((a, b) => a + (b - avg) * (b - avg), 0) / Math.max(1, last.length - 1));
      UI.readout(out, [
        ['p', f3(p)],
        ['最大 n', N],
        ['理论标准差 √(p(1−p)/n)', f4(Math.sqrt(p * (1 - p) / N))],
        ['各轮末频率平均', f4(avg)],
        ['各轮末频率标准差', f4(sd)],
        ['与 p 的偏差', f4(avg - p)],
        ['结论', '伯努利大数定律：n → ∞ 时频率 n_A/n 依概率收敛到 p']
      ]);
    }
    draw();
  };

  /* ================================================================
     5.3b 中心极限定理：掷骰子点数和逼近正态
     ================================================================ */
  W.cltDice = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 326);
    let n = 6, reps = 4000, seed = 20260910;

    UI.slider(ctrl, { label: '骰子个数 n', min: 1, max: 30, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '模拟次数', min: 1000, max: 8000, step: 500, value: reps, onInput: v => { reps = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 104729 + n * 31 + 7);
      const mu = 3.5 * n, varr = 35 / 12 * n, sd = Math.sqrt(varr);
      const BINS = 61, R = 4.2;
      const hist = new Float64Array(BINS);
      for (let t = 0; t < reps; t++) {
        let s = 0;
        for (let i = 0; i < n; i++) s += 1 + Math.floor(rand() * 6);
        const z = (s - mu) / sd;
        const b = Math.floor((z + R) / (2 * R) * BINS);
        if (b >= 0 && b < BINS) hist[b]++;
      }
      const binW = 2 * R / BINS;
      const dens = i => hist[i] / reps / binW;
      let maxD = 0;
      for (let i = 0; i < BINS; i++) maxD = Math.max(maxD, dens(i));
      const yMax = Math.max(S.normal.pdf(0, 0, 1), maxD) * 1.18;
      let cum = 0, dev = 0;
      for (let i = 0; i < BINS; i++) {
        cum += hist[i] / reps;
        dev = Math.max(dev, Math.abs(cum - S.normal.cdf(-R + (i + 1) * binW, 0, 1)));
      }

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 28, padT = 62, padB = 54;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v + R) / (2 * R) * pw;
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('n 个骰子点数和的标准化 (Sₙ − 3.5n)/√(35n/12) 的经验分布 vs N(0,1)', padL, padT - 14);

        // 单骰 pmf 小示意
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('单个骰子：均匀分布（每个点 1/6）', padL, padT - 34);
        for (let i = 1; i <= 6; i++) {
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.45);
          ctx.fillRect(padL + 150 + (i - 1) * 11, padT - 34, 9, 9);
        }

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
          const v = -R + 2 * R * i / 300;
          const y = Y(S.normal.pdf(v, 0, 1));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.2; ctx.stroke();

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 8; i++) {
          const v = -R + 2 * R * i / 8;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }
        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('红曲线＝标准正态 N(0,1)；n 越大，直方图越贴合曲线', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['骰子个数 n', n],
        ['个体分布', '均匀：μ=3.5，σ²=35/12'],
        ['Sₙ 的 μ / σ²', f3(mu) + ' / ' + f3(varr)],
        ['标准化变量', '(Sₙ − 3.5n)/√(35n/12)'],
        ['经验分布与 N(0,1) 最大偏差', f4(dev)],
        ['拟合判定', dev < 0.05 ? 'n 已足够大，非常接近正态 ✓' : dev < 0.12 ? '接近正态（可继续增大 n）' : 'n 偏小，直方图仍明显偏离'],
        ['结论', '独立同分布、方差有限的总体，其和的标准化变量依分布收敛于 N(0,1)（列维-林德伯格）']
      ]);
    }
    draw();
  };

  /* ================================================================
     5.4b 连续性修正：±0.5 到底修正了什么
     ================================================================ */
  W.continuityCorrection = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 328);
    let n = 60, p = 0.35, k = 24, kind = 'le';

    UI.seg(ctrl, [
      { label: 'P{X ≤ k}', value: 'le' },
      { label: 'P{X ≥ k}', value: 'ge' },
      { label: 'P{X = k}', value: 'eq' }
    ], v => { kind = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'n', min: 10, max: 200, step: 5, value: n, onInput: v => { n = v; sK.input.max = n; if (k > n) { k = n; sK.set(k); } draw(); } });
    UI.slider(ctrl, { label: 'p', min: 0.05, max: 0.95, step: 0.05, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; draw(); } });
    const sK = UI.slider(ctrl, { label: 'k', min: 0, max: n, value: k, onInput: v => { k = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const mu = n * p, sd = Math.sqrt(n * p * (1 - p));
      const exact = kind === 'le' ? S.binom.cdf(k, n, p)
        : kind === 'ge' ? (k <= 0 ? 1 : 1 - S.binom.cdf(k - 1, n, p))
          : S.binom.pmf(k, n, p);
      const corr = kind === 'le' ? S.normal.cdf(k + 0.5, mu, sd)
        : kind === 'ge' ? 1 - S.normal.cdf(k - 0.5, mu, sd)
          : S.normal.cdf(k + 0.5, mu, sd) - S.normal.cdf(k - 0.5, mu, sd);
      const plain = kind === 'le' ? S.normal.cdf(k, mu, sd)
        : kind === 'ge' ? 1 - S.normal.cdf(k, mu, sd)
          : 0;
      const lo = Math.max(0, Math.min(k, Math.floor(mu - 4.2 * sd)));
      const hi = Math.min(n, Math.max(k, Math.ceil(mu + 4.2 * sd)));
      const span = Math.max(hi - lo, 4);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 28, padT = 56, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - lo + 0.5) / (span + 1) * pw;
        let maxP = 1e-6;
        for (let v = lo; v <= hi; v++) maxP = Math.max(maxP, S.binom.pmf(v, n, p));
        const yMax = Math.max(maxP * 1.15, S.normal.pdf(mu, mu, sd) * 1.15);
        const Y = v => padT + ph - v / yMax * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('B(' + n + ', ' + p.toFixed(2) + ') 的正态近似与连续性修正（±0.5 的来由）', padL, padT - 14);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        const bw = Math.max(1.4, pw / (span + 1) * 0.74);
        for (let v = lo; v <= hi; v++) {
          const pv = S.binom.pmf(v, n, p);
          const h = (padT + ph) - Y(pv);
          if (h <= 0.3) continue;
          const inEv = kind === 'le' ? v <= k : kind === 'ge' ? v >= k : v === k;
          ctx.fillStyle = D.withAlpha(C(inEv ? '--red' : '--brand'), inEv ? 0.62 : 0.26);
          ctx.fillRect(X(v) - bw / 2, Y(pv), bw, h);
        }

        ctx.beginPath();
        for (let i = 0; i <= 300; i++) {
          const v = lo - 0.5 + (span + 1) * i / 300;
          const y = Y(S.normal.pdf(v, mu, sd));
          i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
        }
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.2; ctx.stroke();

        ctx.save();
        ctx.setLineDash([5, 4]);
        [k, k + 0.5, k - 0.5].forEach((v, i) => {
          if (v < lo - 0.5 || v > hi + 0.5) return;
          ctx.strokeStyle = i === 0 ? C('--red') : C('--green');
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), padT + ph); ctx.stroke();
        });
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('k=' + k, X(k), padT + 3);
        ctx.fillStyle = C('--green');
        ctx.fillText('k−0.5', X(k - 0.5), padT + 16);
        ctx.fillText('k+0.5', X(k + 0.5), padT + 29);

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        const step = Math.max(1, Math.round((span + 1) / 12));
        for (let v = lo; v <= hi; v += step) ctx.fillText(v, X(v), padT + ph + 6);

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText(kind === 'eq'
          ? 'P{X = k} 对应的是「一根柱」，正态近似要用区间 (k−0.5, k+0.5] 的面积'
          : '红色柱＝精确概率的组成部分；紫曲线＝正态密度；绿线＝修正后的积分边界', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['事件', kind === 'le' ? 'P{X ≤ ' + k + '}' : kind === 'ge' ? 'P{X ≥ ' + k + '}' : 'P{X = ' + k + '}'],
        ['精确值', f4(exact)],
        ['修正近似', f4(corr) + '（' + (kind === 'le' ? '用 k+0.5' : kind === 'ge' ? '用 k−0.5' : '用 (k−0.5, k+0.5]') + '）'],
        ['未修正近似', kind === 'eq' ? '0（正态在单点的概率为 0）' : f4(plain) + '（用 k）'],
        ['修正后误差', kind === 'eq' ? f4(Math.abs(corr - exact)) : f4(Math.abs(corr - exact))],
        ['未修正误差', kind === 'eq' ? '—' : f4(Math.abs(plain - exact))],
        ['误差缩减量', kind === 'eq' ? '—' : f4(Math.abs(plain - exact) - Math.abs(corr - exact))],
        ['近似条件', 'np = ' + f3(mu) + '，n(1−p) = ' + f3(n * (1 - p)) + (mu >= 5 && n * (1 - p) >= 5 ? ' → 满足 np≥5 且 n(1−p)≥5 ✓' : ' → 暂不满足，近似可能偏差较大')]
      ]);
    }
    draw();
  };

})(window);
