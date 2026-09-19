/* ============================================================
   ch7.js (widgets) — 第七章 参数估计 可视化组件
   组件：momentEst / mle / estimatorEval / ciMean / ciTwoSample
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI, S = global.Stats;
  const { C, f2, f3, f4 } = UI;

  /* ================================================================
     7.1 矩估计：让样本矩与理论矩对齐
     ================================================================ */
  W.momentEst = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let key = 'normal', n = 30, seed = 20260910;

    const MODELS = {
      normal: {
        label: 'N(μ, σ²)', truth: { mu: 2, varr: 1.5 },
        gen: (r, th) => th.mu + Math.sqrt(th.varr) * S.randn(r),
        solve: (m, b2) => ({ 'μ̂ = X̄': m, 'σ̂² = B₂': b2, 'σ̂': Math.sqrt(Math.max(0, b2)) })
      },
      expon: {
        label: 'E(λ)', truth: { lam: 0.8 },
        gen: (r, th) => -Math.log(1 - Math.min(r(), 1 - 1e-12)) / th.lam,
        solve: (m, b2) => ({ 'λ̂ = 1/X̄': m > 0 ? 1 / m : NaN })
      },
      uniform: {
        label: 'U(a, b)', truth: { a: 0, b: 5 },
        gen: (r, th) => th.a + (th.b - th.a) * r(),
        solve: (m, b2) => {
          const half = Math.sqrt(3 * b2);
          return { 'â = X̄ − √(3B₂)': m - half, 'b̂ = X̄ + √(3B₂)': m + half };
        }
      },
      poisson: {
        label: 'P(λ)', truth: { lam: 3 },
        gen: (r, th) => {
          const L = Math.exp(-th.lam);
          let k = 0, pr = 1;
          do { k++; pr *= r(); } while (pr > L && k < 200);
          return k - 1;
        },
        solve: (m) => ({ 'λ̂ = X̄': m })
      }
    };
    const keys = Object.keys(MODELS);

    UI.seg(ctrl, keys.map(k => ({ label: MODELS[k].label, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '样本量 n', min: 5, max: 500, step: 5, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const md = MODELS[key];
      const rand = S.rng(seed * 2654435761 + n);
      const xs = [];
      for (let i = 0; i < n; i++) xs.push(md.gen(rand, md.truth));
      const st = S.meanVar(xs);
      const b2 = xs.reduce((a, b) => a + (b - st.mean) ** 2, 0) / n;
      const est = md.solve(st.mean, b2);
      const estKeys = Object.keys(est);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padR = 26, padT = 44, padB = 40;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('把样本矩「替身」到理论矩上，解方程得到参数的估计', padL, padT - 12);

        // 左：样本数据带状图
        const halfW = pw * 0.46;
        const xMin = Math.min(...xs), xMax = Math.max(...xs);
        const span = Math.max(xMax - xMin, 1e-6);
        const X1 = v => padL + (v - xMin) / span * halfW;
        const midY = padT + ph * 0.42;

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(padL + halfW, midY); ctx.stroke();
        ctx.save();
        ctx.beginPath(); ctx.rect(padL, padT, halfW, ph); ctx.clip();
        xs.forEach(x => {
          ctx.beginPath();
          ctx.arc(X1(x), midY, 2.6, 0, D.TAU);
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.5);
          ctx.fill();
        });
        ctx.restore();
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(X1(st.mean), padT); ctx.lineTo(X1(st.mean), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('X̄', X1(st.mean), padT + 3);

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('样本散点（n = ' + n + '）', padL, padT + ph + 6);

        // 右：方程与解
        const rx = padL + halfW + 26;
        let ry = padT + 4;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillStyle = C('--accent');
        ctx.fillText('矩估计方程与解', rx, ry); ry += 20;

        const rows = [
          ['样本一阶矩 X̄', st.mean],
          ['样本二阶中心矩 B₂', b2],
          ['总体 E(X)', md.truth.varr !== undefined ? '含参数' : '含参数']
        ];
        rows.forEach(([lab, v]) => {
          ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText(lab, rx, ry);
          ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'right';
          ctx.fillStyle = T['--ink'];
          ctx.fillText(f4(v), rx + halfW, ry);
          ctx.textAlign = 'left';
          ry += 19;
        });

        ry += 8;
        estKeys.forEach(k => {
          ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.fillStyle = C('--purple');
          ctx.fillText(k + ' =', rx, ry);
          ctx.textAlign = 'right';
          ctx.fillText(f4(est[k]), rx + halfW, ry);
          ctx.textAlign = 'left';
          ry += 19;
        });

        ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        ctx.fillText('注：B₂ 的分母是 n（不是 n−1），这是矩估计的特点。', rx, H_ - 10);
      });
      scene.static();

      const rows2 = [
        ['总体', md.label],
        ['n', n],
        ['X̄', f4(st.mean)],
        ['s²（分母 n−1）', f4(st.varr)],
        ['B₂（分母 n）', f4(b2)]
      ];
      estKeys.forEach(k => rows2.push([k, f4(est[k])]));
      UI.readout(out, rows2);
    }
    draw();
  };

  /* ================================================================
     7.2 最大似然：似然函数的峰值
     ================================================================ */
  W.mle = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let key = 'expon', n = 12, seed = 20260910;

    const MODELS = {
      expon: {
        label: 'E(λ)',
        gen: r => -Math.log(1 - Math.min(r(), 1 - 1e-12)),
        logL: (th, xs) => xs.length * Math.log(th) - th * xs.reduce((a, b) => a + b, 0),
        thetaMin: 0.05, thetaMax: 3, mle: xs => 1 / (xs.reduce((a, b) => a + b, 0) / xs.length)
      },
      bern: {
        label: 'B(1,p)',
        gen: r => r() < 0.4 ? 1 : 0,
        logL: (th, xs) => xs.reduce((a, b) => a + (b ? Math.log(th) : Math.log(1 - th)), 0),
        thetaMin: 0.02, thetaMax: 0.98, mle: xs => xs.reduce((a, b) => a + b, 0) / xs.length
      },
      poisson: {
        label: 'P(λ)',
        gen: r => { const L = Math.exp(-3); let k = 0, pr = 1; do { k++; pr *= r(); } while (pr > L && k < 200); return k - 1; },
        logL: (th, xs) => {
          const s = xs.reduce((a, b) => a + b, 0);
          const lg = xs.reduce((a, k) => a + Math.log(S.fact(k)), 0);
          return s * Math.log(th) - xs.length * th - lg;
        },
        thetaMin: 0.3, thetaMax: 8, mle: xs => xs.reduce((a, b) => a + b, 0) / xs.length
      }
    };
    const keys = Object.keys(MODELS);

    UI.seg(ctrl, keys.map(k => ({ label: MODELS[k].label, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '样本量 n', min: 3, max: 60, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const md = MODELS[key];
      const rand = S.rng(seed * 40503 + n * 7);
      const xs = [];
      for (let i = 0; i < n; i++) xs.push(md.gen(rand));
      const hat = md.mle(xs);

      const M = 220;
      const grid = [];
      let maxL = -Infinity;
      for (let i = 0; i <= M; i++) {
        const th = md.thetaMin + (md.thetaMax - md.thetaMin) * i / M;
        const v = md.logL(th, xs);
        grid.push([th, v]);
        if (isFinite(v)) maxL = Math.max(maxL, v);
      }

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 26, padT = 46, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - md.thetaMin) / (md.thetaMax - md.thetaMin) * pw;
        const lo = maxL - 14;
        const Y = v => padT + ph - (v - lo) / (maxL - lo) * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('对数似然 ln L(θ) 曲线：峰值所在即最大似然估计 θ̂', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 曲线
        ctx.beginPath();
        let started = false;
        grid.forEach(([th, v]) => {
          if (!isFinite(v)) return;
          const y = Math.max(padT - 20, Y(v));
          if (!started) { ctx.moveTo(X(th), y); started = true; } else ctx.lineTo(X(th), y);
        });
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.4; ctx.stroke();

        // θ̂ 竖线与峰值点
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(X(hat), padT); ctx.lineTo(X(hat), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.beginPath(); ctx.arc(X(hat), Y(md.logL(hat, xs)), 5.4, 0, D.TAU);
        ctx.fillStyle = C('--red'); ctx.fill();
        ctx.fillStyle = C('--red'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('θ̂ = ' + hat.toFixed(4), X(hat), padT + 3);

        // 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = md.thetaMin + (md.thetaMax - md.thetaMin) * i / 6;
          ctx.fillText(D.niceNum(v), X(v), padT + ph + 6);
        }
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.textAlign = 'right';
          ctx.fillText(D.niceNum(lo + (maxL - lo) * (1 - i / 4)), padL - 7, y);
          ctx.textAlign = 'left';
        }

        // 数据小条
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('样本：' + xs.slice(0, 12).map(v => (Math.round(v * 100) / 100)).join(', ')
          + (n > 12 ? ' …（共 ' + n + ' 个）' : ''), padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['分布', md.label],
        ['n', n],
        ['样本均值', f4(xs.reduce((a, b) => a + b, 0) / n)],
        ['最大似然估计 θ̂（解析解）', f4(hat)],
        ['ln L(θ̂)', f4(md.logL(hat, xs))],
        ['数值搜索最大值位置', f4(grid.reduce((a, b) => (isFinite(b[1]) && b[1] > a[1] ? b : a), [-Infinity, -Infinity])[0])]
      ]);
    }
    draw();
  };

  /* ================================================================
     7.3 无偏性与有效性：模拟抽样验证
     ================================================================ */
  W.estimatorEval = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let n = 6, reps = 3000, seed = 20260910;

    UI.slider(ctrl, { label: '样本量 n', min: 2, max: 30, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '重复次数', min: 500, max: 6000, step: 500, value: reps, onInput: v => { reps = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 15486071 + n);
      const mu = 3, sig = 2;
      const est = { 'X̄': [], 'X₁': [], 'S²': [], 'B₂': [] };
      for (let r = 0; r < reps; r++) {
        const xs = [];
        for (let i = 0; i < n; i++) xs.push(mu + sig * S.randn(rand));
        const st = S.meanVar(xs);
        const ss = xs.reduce((a, b) => a + (b - st.mean) ** 2, 0);
        est['X̄'].push(st.mean);
        est['X₁'].push(xs[0]);
        est['S²'].push(ss / (n - 1));
        est['B₂'].push(ss / n);
      }
      const stat = {};
      Object.keys(est).forEach(k => {
        const a = est[k];
        const m = a.reduce((x, y) => x + y, 0) / a.length;
        const v = a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1);
        stat[k] = { mean: m, varr: v, se: Math.sqrt(v) };
      });

      const names = Object.keys(est);
      const maxSE = Math.max(...names.map(k => stat[k].se)) * 1.35;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 50, padB = 62;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('四个估计量的抽样分布：中心位置＝无偏性，横向宽度＝有效性', padL, padT - 12);

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        const slotW = pw / names.length;
        const colors = ['--brand', '--orange', '--green', '--purple'];
        const colorOf = i => C(['--brand', '--accent', '--green', '--purple'][i]);

        names.forEach((k, i) => {
          const a = est[k];
          const lo = stat[k].mean - 4 * stat[k].se, hi = stat[k].mean + 4 * stat[k].se;
          const cx = padL + slotW * (i + 0.5);
          const scale = (slotW * 0.42) / maxSE;   // 横向放大：像素/单位标准误
          const topY = padT + ph;
          const BINS = 34;
          const hist = new Float64Array(BINS);
          a.forEach(v => {
            const b = Math.floor((v - lo) / (hi - lo) * BINS);
            if (b >= 0 && b < BINS) hist[b]++;
          });
          const dens = Array.from(hist, c => c / a.length);
          const peak = Math.max(...dens, 1e-9);

          // 密度（旋转成「垂直」的钟形）
          ctx.beginPath();
          ctx.moveTo(cx, topY);
          for (let b = 0; b < BINS; b++) {
            const v = lo + (b + 0.5) / BINS * (hi - lo);
            const x = cx + (v - stat[k].mean) * scale;
            const y = topY - dens[b] / peak * ph * 0.82;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(cx, topY);
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(colorOf(i), 0.26);
          ctx.fill();
          ctx.strokeStyle = colorOf(i); ctx.lineWidth = 1.8; ctx.stroke();

          // 竖直基线
          ctx.strokeStyle = D.withAlpha(C('--line-2'), 0.9); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cx, padT); ctx.lineTo(cx, topY); ctx.stroke();

          // 标签
          ctx.fillStyle = colorOf(i); ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(k, cx, topY + 8);
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.fillText('均值 ' + stat[k].mean.toFixed(3), cx, topY + 24);
          ctx.fillStyle = stat[k].mean > 0.001 || stat[k].mean < -0.001 ? T['--ink-3'] : T['--ink-3'];
          ctx.fillText('SE ' + stat[k].se.toFixed(3), cx, topY + 37);
        });

        // 参照真值线：μ=3（位置对齐到 X̄ 槽的中心）
        const cx0 = padL + slotW * 0.5;
        const scale0 = (slotW * 0.42) / maxSE;
        const xMu = cx0 + (mu - stat['X̄'].mean) * scale0;
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(xMu, padT); ctx.lineTo(xMu, padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('μ = 3', xMu, padT - 2);

        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('X̄ 与 X₁ 都以 μ 为中心（无偏）；X̄ 明显更窄（更有效）。S² 与 B₂ 估计的是 σ²', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['真值 μ / σ²', '3 / 4'],
        ['n', n], ['重复次数', reps],
        ['E(X̄) 模拟', f4(stat['X̄'].mean)],
        ['E(X₁) 模拟', f4(stat['X₁'].mean)],
        ['E(S²) 模拟（应≈4）', f4(stat['S²'].mean)],
        ['E(B₂) 模拟（应≈4·(n−1)/n）', f4(stat['B₂'].mean)],
        ['理论 E(B₂)', f4(4 * (n - 1) / n)],
        ['SE(X̄) = σ/√n', f4(sig / Math.sqrt(n))],
        ['SE(X₁) = σ', f4(sig)],
        ['有效性比值 SE(X₁)/SE(X̄)', f3(stat['X₁'].se / stat['X̄'].se)]
      ]);
    }
    draw();
  };

  /* ================================================================
     7.4 单个正态总体均值的置信区间：覆盖率的直观验证
     ================================================================ */
  W.ciMean = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 340);
    let n = 10, conf = 0.95, sigmaKnown = 0, reps = 25, seed = 20260910;

    UI.seg(ctrl, [
      { label: 'σ 已知（Z 区间）', value: 0 },
      { label: 'σ 未知（t 区间）', value: 1 }
    ], v => { sigmaKnown = v; draw(); }, 0);
    UI.slider(ctrl, { label: '置信度 1−α', min: 0.5, max: 0.99, step: 0.01, value: conf, fmt: v => v.toFixed(2), onInput: v => { conf = v; draw(); } });
    UI.slider(ctrl, { label: '样本量 n', min: 3, max: 40, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '区间条数', min: 5, max: 40, value: reps, onInput: v => { reps = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const mu = 5, sig = 2;
      const alpha = 1 - conf;
      const rand = S.rng(seed * 3571 + n * 13);
      const items = [];
      let cover = 0;
      const crit = sigmaKnown ? S.normUpper(alpha / 2) : S.tUpper(alpha / 2, n - 1);
      for (let r = 0; r < reps; r++) {
        const xs = [];
        for (let i = 0; i < n; i++) xs.push(mu + sig * S.randn(rand));
        const st = S.meanVar(xs);
        const se = sigmaKnown ? sig / Math.sqrt(n) : Math.sqrt(st.varr / n);
        const half = crit * se;
        const lo = st.mean - half, hi = st.mean + half;
        const ok = lo <= mu && mu <= hi;
        if (ok) cover++;
        items.push({ mean: st.mean, lo, hi, ok });
      }
      const lo0 = Math.min(...items.map(o => o.lo)), hi0 = Math.max(...items.map(o => o.hi));
      const span = (hi0 - lo0) || 1;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 30, padT = 46, padB = 46;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + (v - lo0) / span * pw;
        const rowH = ph / Math.max(items.length, 1);

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('每次抽样构造一个区间：绿色覆盖 μ，红色未覆盖', padL, padT - 12);

        // μ 竖线
        ctx.save();
        ctx.setLineDash([]);
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X(mu), padT); ctx.lineTo(X(mu), padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--brand'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('μ = ' + mu, X(mu), padT - 2);

        items.forEach((o, i) => {
          const y = padT + rowH * (i + 0.5);
          const col = o.ok ? C('--green') : C('--red');
          ctx.strokeStyle = D.withAlpha(col, 0.92);
          ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(X(o.lo), y); ctx.lineTo(X(o.hi), y); ctx.stroke();
          // 端点
          [o.lo, o.hi].forEach(v => {
            ctx.beginPath(); ctx.moveTo(X(v), y - 3.4); ctx.lineTo(X(v), y + 3.4); ctx.stroke();
          });
          // 样本均值
          ctx.beginPath(); ctx.arc(X(o.mean), y, 2.4, 0, D.TAU);
          ctx.fillStyle = D.withAlpha(col, 0.95); ctx.fill();
        });

        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('理论覆盖率＝' + (conf * 100).toFixed(1) + '%；本次模拟覆盖率＝'
          + (cover / items.length * 100).toFixed(1) + '%（' + cover + '/' + items.length + '）', padL, H_ - 8);
      });
      scene.static();

      const half = crit * (sigmaKnown ? sig / Math.sqrt(n) : sig / Math.sqrt(n));
      UI.readout(out, [
        ['方法', sigmaKnown ? 'σ 已知 → Z 区间' : 'σ 未知 → t 区间'],
        ['临界值', (sigmaKnown ? 'u_{α/2}' : 't_{α/2}(n−1)') + ' = ' + f4(crit)],
        ['α', f3(alpha)],
        ['n', n],
        ['σ/√n', f4(sig / Math.sqrt(n))],
        ['典型半宽（用真 σ）', f4(half)],
        ['模拟覆盖数', cover + ' / ' + items.length],
        ['模拟覆盖率', f3(cover / items.length)]
      ]);
    }
    draw();
  };

  /* ================================================================
     7.5 两个正态总体：均值差与方差比的区间
     ================================================================ */
  W.ciTwoSample = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let xbar = 82, ybar = 79, s1 = 2.4, s2 = 1.6, n1 = 10, n2 = 8, conf = 0.95;

    UI.slider(ctrl, { label: 'x̄', min: 60, max: 100, step: 0.5, value: xbar, fmt: v => v.toFixed(1), onInput: v => { xbar = v; draw(); } });
    UI.slider(ctrl, { label: 'ȳ', min: 60, max: 100, step: 0.5, value: ybar, fmt: v => v.toFixed(1), onInput: v => { ybar = v; draw(); } });
    UI.slider(ctrl, { label: 's₁²', min: 0.2, max: 8, step: 0.1, value: s1, fmt: v => v.toFixed(1), onInput: v => { s1 = v; draw(); } });
    UI.slider(ctrl, { label: 's₂²', min: 0.2, max: 8, step: 0.1, value: s2, fmt: v => v.toFixed(1), onInput: v => { s2 = v; draw(); } });
    UI.slider(ctrl, { label: 'n₁', min: 3, max: 30, value: n1, onInput: v => { n1 = v; draw(); } });
    UI.slider(ctrl, { label: 'n₂', min: 3, max: 30, value: n2, onInput: v => { n2 = v; draw(); } });
    UI.slider(ctrl, { label: '置信度', min: 0.5, max: 0.99, step: 0.01, value: conf, fmt: v => v.toFixed(2), onInput: v => { conf = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const alpha = 1 - conf;
      const df = n1 + n2 - 2;
      const sw2 = ((n1 - 1) * s1 + (n2 - 1) * s2) / df;
      const se = Math.sqrt(sw2 * (1 / n1 + 1 / n2));
      const t = S.tUpper(alpha / 2, df);
      const diff = xbar - ybar;
      const lo = diff - t * se, hi = diff + t * se;

      // 方差比区间
      const fUp = S.fUpper(alpha / 2, n1 - 1, n2 - 1);
      const fLo = S.fUpper(alpha / 2, n2 - 1, n1 - 1);
      const r = s1 / s2;
      const rLo = r / fUp, rHi = r * fLo;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 56, padR = 30, padT = 52, padB = 52;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('两正态总体（方差未知但相等）：均值差与方差比的置信区间', padL, padT - 12);

        /* ---- 上：均值差的区间（数轴） ---- */
        const midY = padT + ph * 0.32;
        const span = Math.max(4 * se, Math.abs(diff) * 1.6, 1);
        const lo0 = diff - span, hi0 = diff + span;
        const X = v => padL + (v - lo0) / (hi0 - lo0) * pw;

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(padL + pw, midY); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = lo0 + (hi0 - lo0) * i / 6;
          ctx.fillText(D.niceNum(v), X(v), midY + 6);
        }

        // 0 参考线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(0), padT + 6); ctx.lineTo(X(0), midY + 40); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--purple'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('0', X(0), padT + 4);

        // 区间条
        const barY = midY - 22;
        const contains = lo <= 0 && hi >= 0;
        ctx.strokeStyle = contains ? C('--accent') : C('--green');
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(X(lo), barY); ctx.lineTo(X(hi), barY); ctx.stroke();
        [lo, hi].forEach(v => {
          ctx.beginPath(); ctx.moveTo(X(v), barY - 6); ctx.lineTo(X(v), barY + 6); ctx.stroke();
        });
        ctx.beginPath(); ctx.arc(X(diff), barY, 4.6, 0, D.TAU);
        ctx.fillStyle = contains ? C('--accent') : C('--green'); ctx.fill();
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('x̄−ȳ = ' + diff.toFixed(3) + '   区间 [' + lo.toFixed(3) + ', ' + hi.toFixed(3) + ']', padL + pw / 2, barY - 26);

        /* ---- 下：方差比区间 ---- */
        const midY2 = padT + ph * 0.80;
        const rSpan = Math.max(rHi * 1.35, 2);
        const R = v => padL + v / rSpan * pw;

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(padL, midY2); ctx.lineTo(padL + pw, midY2); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = rSpan * i / 6;
          ctx.fillText(D.niceNum(v), R(v), midY2 + 6);
        }

        // 1 参考线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(R(1), padT + ph * 0.56); ctx.lineTo(R(1), midY2 + 40); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--purple'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('1', R(1), padT + ph * 0.56 - 2);

        const barY2 = midY2 - 22;
        const rContains = rLo <= 1 && rHi >= 1;
        ctx.strokeStyle = rContains ? C('--accent') : C('--green');
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(R(rLo), barY2); ctx.lineTo(R(rHi), barY2); ctx.stroke();
        [rLo, rHi].forEach(v => {
          ctx.beginPath(); ctx.moveTo(R(v), barY2 - 6); ctx.lineTo(R(v), barY2 + 6); ctx.stroke();
        });
        ctx.beginPath(); ctx.arc(R(r), barY2, 4.6, 0, D.TAU);
        ctx.fillStyle = rContains ? C('--accent') : C('--green'); ctx.fill();
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('s₁²/s₂² = ' + r.toFixed(3) + '   区间 [' + rLo.toFixed(3) + ', ' + rHi.toFixed(3) + ']', padL + pw / 2, barY2 - 26);

        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('上半：μ₁−μ₂ 的区间（含 0 → 不能断定均值不等）；下半：σ₁²/σ₂² 的区间（含 1 → 不能断定方差不齐）', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['合并方差 s_w²', f4(sw2)],
        ['标准误', f4(se)],
        ['自由度 n₁+n₂−2', df],
        ['t_{α/2}(df)', f4(t)],
        ['μ₁−μ₂ 的区间', '[' + lo.toFixed(3) + ', ' + hi.toFixed(3) + ']'],
        ['区间是否含 0', lo <= 0 && hi >= 0 ? '含 0 → 无显著差异' : '不含 0 → 有显著差异'],
        ['σ₁²/σ₂² 的区间', '[' + rLo.toFixed(3) + ', ' + rHi.toFixed(3) + ']'],
        ['区间是否含 1', rLo <= 1 && rHi >= 1 ? '含 1 → 方差可视为相等' : '不含 1 → 方差有显著差异']
      ]);
    }
    draw();
  };

  /* ================================================================
     7.2b 最大似然的完整链条：似然、对数似然与得分函数
     ================================================================ */
  W.mleLikelihood = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let key = 'expon', n = 12, seed = 20260910;

    const MODELS = {
      expon: {
        label: 'E(λ)，估计 θ = λ',
        gen: r => -Math.log(1 - Math.min(r(), 1 - 1e-12)),
        range: [0.05, 3.2], truth: 1, param: 'λ',
        logL: (th, xs) => xs.length * Math.log(th) - th * xs.reduce((a, b) => a + b, 0),
        mle: xs => 1 / (xs.reduce((a, b) => a + b, 0) / xs.length)
      },
      normmu: {
        label: 'N(μ, 1)，估计 θ = μ',
        gen: r => S.randn(r) + 1.5,
        range: [-1.4, 4.4], truth: 1.5, param: 'μ',
        logL: (th, xs) => -0.5 * xs.reduce((a, b) => a + (b - th) * (b - th), 0),
        mle: xs => xs.reduce((a, b) => a + b, 0) / xs.length
      },
      bern: {
        label: 'B(1, p)，估计 θ = p',
        gen: r => r() < 0.4 ? 1 : 0,
        range: [0.02, 0.98], truth: 0.4, param: 'p',
        logL: (th, xs) => xs.reduce((a, b) => a + (b ? Math.log(th) : Math.log(1 - th)), 0),
        mle: xs => xs.reduce((a, b) => a + b, 0) / xs.length
      }
    };

    UI.seg(ctrl, Object.keys(MODELS).map(k => ({ label: MODELS[k].label, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '样本量 n', min: 3, max: 60, value: n, onInput: v => { n = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache, md = MODELS[key];
      const rand = S.rng(seed * 40503 + n * 7);
      const xs = [];
      for (let i = 0; i < n; i++) xs.push(md.gen(rand));
      const hat = md.mle(xs);
      const M = 240;
      const grid = [];
      let maxL = -Infinity, minL = Infinity;
      for (let i = 0; i <= M; i++) {
        const th = md.range[0] + (md.range[1] - md.range[0]) * i / M;
        const v = md.logL(th, xs);
        grid.push([th, v]);
        if (isFinite(v)) { maxL = Math.max(maxL, v); minL = Math.min(minL, v); }
      }
      const floor = maxL - (maxL - minL) * 0.999;
      const score = grid.map(([th, v]) => {
        const h = 1e-4;
        return [th, (md.logL(th + h, xs) - md.logL(th - h, xs)) / (2 * h)];
      });
      let maxS = 1e-9;
      score.forEach(s => { maxS = Math.max(maxS, Math.abs(s[1])); });

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 28, padT = 48, padB = 62;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = th => padL + (th - md.range[0]) / (md.range[1] - md.range[0]) * pw;
        const Y = v => padT + ph - (v + 1) / 2 * ph;   // 归一化坐标 −1..1

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('似然 L(θ)（归一化）、对数似然 ln L(θ)（归一化）与得分函数 d ln L/dθ', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
        }
        // 0 基准
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, Y(0) + .5); ctx.lineTo(padL + pw, Y(0) + .5); ctx.stroke();
        ctx.strokeStyle = T['--line-2'];
        ctx.beginPath(); ctx.moveTo(padL + .5, padT); ctx.lineTo(padL + .5, padT + ph); ctx.stroke();

        // L(θ)：由对数似然平移后指数映射，再线性压到 [−1, 1]
        ctx.beginPath();
        let started = false;
        grid.forEach(([th, v]) => {
          if (!isFinite(v)) return;
          const Lv = Math.exp(D.clamp(v - floor, -40, 0));
          const y = Y(Lv * 0.92);
          if (!started) { ctx.moveTo(X(th), y); started = true; } else ctx.lineTo(X(th), y);
        });
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.4; ctx.stroke();

        // ln L 归一化
        ctx.beginPath();
        started = false;
        grid.forEach(([th, v]) => {
          if (!isFinite(v)) return;
          const lv = (v - minL) / Math.max(1e-9, maxL - minL);
          const y = Y(lv * 0.92 - 0.02);
          if (!started) { ctx.moveTo(X(th), y); started = true; } else ctx.lineTo(X(th), y);
        });
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);

        // 得分函数
        ctx.beginPath();
        started = false;
        score.forEach(([th, v]) => {
          if (!isFinite(v)) return;
          const y = Y(D.clamp(v / maxS, -1, 1) * 0.9);
          if (!started) { ctx.moveTo(X(th), y); started = true; } else ctx.lineTo(X(th), y);
        });
        ctx.strokeStyle = C('--teal'); ctx.lineWidth = 1.8; ctx.stroke();

        // θ̂
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(X(hat), padT); ctx.lineTo(X(hat), padT + ph); ctx.stroke();
        ctx.restore();
        const hatLv = Math.exp(D.clamp(md.logL(hat, xs) - floor, -40, 0));
        ctx.beginPath(); ctx.arc(X(hat), Y(hatLv * 0.92), 5, 0, D.TAU);
        ctx.fillStyle = C('--red'); ctx.fill();
        ctx.fillStyle = C('--red'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('θ̂ = ' + hat.toFixed(4), D.clamp(X(hat), padL + 44, padL + pw - 44), padT + 3);

        // 图例
        const lg = [['L(θ)', '--brand', []], ['ln L(θ)', '--purple', [5, 4]], ['d ln L/dθ', '--teal', []]];
        let lx = padL + 4;
        lg.forEach(item => {
          ctx.strokeStyle = C(item[1]); ctx.lineWidth = 2.2;
          if (item[2].length) ctx.setLineDash(item[2]);
          ctx.beginPath(); ctx.moveTo(lx, padT + ph + 22); ctx.lineTo(lx + 20, padT + ph + 22); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = T['--ink-2']; ctx.font = '600 10px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(item[0], lx + 25, padT + ph + 22);
          lx += 98;
        });
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const th = md.range[0] + (md.range[1] - md.range[0]) * i / 6;
          ctx.fillText(D.niceNum(th), X(th), padT + ph + 32);
        }
      });
      scene.static();

      const h = 1e-3;
      const dl = i => (md.logL(hat + h, xs) - md.logL(hat - h, xs)) / (2 * h);
      UI.readout(out, [
        ['分布', md.label],
        ['n', n],
        ['样本均值', f4(xs.reduce((a, b) => a + b, 0) / n)],
        ['最大似然估计 θ̂', f4(hat)],
        ['真值（生成数据所用）', f4(md.truth)],
        ['ln L(θ̂)', f4(md.logL(hat, xs))],
        ['得分函数在 θ̂ ± 0.001 处', f4(dl(-1)) + ' → ' + f4(dl(1)) + (dl(-1) > 0 && dl(1) < 0 ? '（由正变负 ✓ 极大值）' : '')],
        ['数值搜索峰值位置', f4(grid.reduce((a, b) => (isFinite(b[1]) && b[1] > a[1] ? b : a), [0, -Infinity])[0])],
        ['三条曲线的关系', 'L 与 ln L 峰值位置相同；得分函数在 θ̂ 处穿过 0，且在似然上升段为正、下降段为负']
      ]);
    }
    draw();
  };

})(window);
