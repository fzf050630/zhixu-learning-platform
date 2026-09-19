/* ============================================================
   ch2.js (widgets) — 第二章可视化组件
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI, S = global.Stats;
  const { el, C, f2, f3, f4, pct } = UI;

  /* ================================================================
     2.1 随机变量：样本点 → 实数轴
     ================================================================ */
  W.randomVar = function (host) {
    const cases = [
      {
        name: '抛硬币 3 次',
        map: [['HHH', 3], ['HHT', 2], ['HTH', 2], ['THH', 2], ['HTT', 1], ['THT', 1], ['TTH', 1], ['TTT', 0]],
        label: '正面次数 X'
      },
      {
        name: '掷骰子',
        map: [['1', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6]],
        label: '点数 X'
      },
      {
        name: '射击直到命中',
        map: [['中', 1], ['不中→中', 2], ['不中→不中→中', 3], ['不中→不中→不中→中', 4]],
        label: '射击次数 X'
      }
    ];
    let ci = 0;
    const { ctrl, out, scene } = UI.shell(host, 296);

    UI.seg(ctrl, cases.map((c, i) => ({ label: c.name, value: i })), v => { ci = +v; draw(); }, 0);

    function draw() {
      const T = D.Theme.cache, cs = cases[ci];
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 30, padR = 40, padT = 34, padB = 34;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        // 左：样本点
        const sx = padL + 8;
        const n = cs.map.length;
        const step = ph / n;
        const vals = [...new Set(cs.map.map(m => m[1]))].sort((a, b) => a - b);
        const minV = vals[0], maxV = vals[vals.length - 1];
        const axisX = W_ - padR - 6;
        const ry = v => padT + ph - (maxV === minV ? 0.5 : (v - minV) / (maxV - minV)) * ph;

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('样本空间 Ω', sx, padT - 10);
        ctx.textAlign = 'right';
        ctx.fillText('实数轴', axisX, padT - 10);

        // 实数轴
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(axisX + .5, padT - 4); ctx.lineTo(axisX + .5, padT + ph + 4); ctx.stroke();
        // 刻度
        vals.forEach(v => {
          ctx.beginPath(); ctx.moveTo(axisX - 4, ry(v)); ctx.lineTo(axisX + 4, ry(v)); ctx.stroke();
          ctx.fillStyle = T['--ink-2'];
          ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(v, axisX + 9, ry(v));
        });

        // 样本点与连线
        cs.map.forEach(([sym, v], i) => {
          const cy = padT + step * (i + 0.5);
          const p = 1 / n;
          const k = anim;
          const ex = sx + (axisX - 26 - sx) * k;
          const ey = cy + (ry(v) - cy) * k;

          // 连线
          ctx.beginPath();
          ctx.moveTo(sx + 12, cy);
          ctx.bezierCurveTo(sx + 60, cy, axisX - 90, ry(v), axisX - 8, ry(v));
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.34);
          ctx.lineWidth = 1.2; ctx.stroke();

          // 样本点
          ctx.beginPath();
          D.roundRectPath(ctx, sx, cy - 11, Math.min(96, ctx.measureText(sym).width + 96), 22, 5);
          ctx.fillStyle = T['--card-2'];
          ctx.fill();
          ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = T['--ink'];
          ctx.font = '600 11.5px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(sym, sx + 8, cy);
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.fillText('p=' + p.toFixed(3), sx + 8 + Math.min(60, ctx.measureText(sym).width + 8), cy);

          // 移动的点
          ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, D.TAU);
          ctx.fillStyle = C('--accent'); ctx.fill();
        });

        // 值轴上的点
        if (anim > 0.92) {
          vals.forEach(v => {
            const cnt = cs.map.filter(m => m[1] === v).length;
            ctx.beginPath(); ctx.arc(axisX, ry(v), 6, 0, D.TAU);
            ctx.fillStyle = C('--accent'); ctx.fill();
            ctx.strokeStyle = T['--card']; ctx.lineWidth = 2; ctx.stroke();
            if (cnt > 1) {
              ctx.fillStyle = C('--accent');
              ctx.font = '700 10px ' + D.FONT_MONO;
              ctx.textAlign = 'right'; ctx.textBaseline = 'top';
              ctx.fillText(cnt + ' 点', axisX - 8, ry(v) + 6);
            }
          });
        }

        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 12px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(cs.label + ' = X(ω)', (sx + axisX) / 2, H_ - 8);
      });
      scene.animate(760);
      UI.readout(out, [
        ['样本点数', cs.map.length],
        ['X 的可能取值', [...new Set(cs.map.map(m => m[1]))].sort((a, b) => a - b).join(', ')],
        ['取值个数', new Set(cs.map.map(m => m[1])).size]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.1b 分布函数与区间概率
     ================================================================ */
  W.cdf = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -1, xMax: 5, yMin: -0.05, yMax: 1.05,
      xTicks: 6, yTicks: 5, xLabel: 'x', yLabel: 'F(x)', height: 300
    });
    let a = 1, b = 3;
    let kind = 'normal';

    const dists = {
      normal: {
        name: 'N(2,1)', F: x => S.normal.cdf(x, 2, 1), f: x => S.normal.pdf(x, 2, 1)
      },
      expo: {
        name: 'E(0.8)', F: x => S.expon.cdf(x, 0.8), f: x => S.expon.pdf(x, 0.8)
      },
      disc: {
        name: '离散型', F: x => {
          const ps = [0.15, 0.25, 0.35, 0.25];
          let s = 0;
          for (let k = 0; k < 4; k++) if (k <= x) s += ps[k];
          return s;
        },
        f: null
      }
    };

    UI.seg(ctrl, Object.keys(dists).map(k => ({ label: dists[k].name, value: k })), v => {
      kind = v; draw();
    }, 0);
    UI.slider(ctrl, { label: 'a', min: -1, max: 4.8, step: 0.05, value: a, fmt: v => v.toFixed(2), onInput: v => { a = v; draw(); } });
    UI.slider(ctrl, { label: 'b', min: -1, max: 5, step: 0.05, value: b, fmt: v => v.toFixed(2), onInput: v => { b = v; draw(); } });

    function draw() {
      const d = dists[kind];
      plot.clearLayers();
      plot.curve(d.F, { color: C('--brand'), width: 2.4 });

      // 区间概率
      const lo = Math.min(a, b), hi = Math.max(a, b);
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        // 竖直虚线
        [lo, hi].forEach((v, i) => {
          const X = p.X(v);
          ctx.save();
          ctx.beginPath(); ctx.setLineDash([4, 4]);
          ctx.strokeStyle = D.withAlpha(C('--accent'), 0.7); ctx.lineWidth = 1.3;
          ctx.moveTo(X, p.py); ctx.lineTo(X, p.py + p.ph); ctx.stroke();
          ctx.restore();
        });
        // 高亮 [lo,hi] 上的曲线段
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3.4; ctx.strokeStyle = D.withAlpha(C('--accent'), 0.9);
        ctx.lineCap = 'round';
        let started = false;
        for (let i = 0; i <= 200; i++) {
          const x = lo + (hi - lo) * i / 200;
          const y = d.F(x);
          if (!isFinite(y)) continue;
          if (!started) { ctx.moveTo(p.X(x), p.Y(y)); started = true; }
          else ctx.lineTo(p.X(x), p.Y(y));
        }
        ctx.stroke();
        ctx.restore();

        // 水平虚线到 y 轴
        [lo, hi].forEach((v, i) => {
          const y = d.F(v);
          ctx.save();
          ctx.beginPath(); ctx.setLineDash([3, 3]);
          ctx.strokeStyle = D.withAlpha(C('--accent'), 0.5); ctx.lineWidth = 1;
          ctx.moveTo(p.px, p.Y(y)); ctx.lineTo(p.X(v), p.Y(y)); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = C('--accent');
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText(d.F(v).toFixed(3), p.px + 4, p.Y(y) - 3);
        });

        // 跳跃点（离散）
        if (kind === 'disc') {
          for (let k = 0; k < 4; k++) {
            const x = k;
            const y1 = d.F(x - 0.0001), y2 = d.F(x);
            ctx.beginPath(); ctx.arc(p.X(x), p.Y(y1), 3.2, 0, D.TAU);
            ctx.fillStyle = T['--card']; ctx.fill();
            ctx.strokeStyle = C('--brand'); ctx.lineWidth = 1.6; ctx.stroke();
            ctx.beginPath(); ctx.arc(p.X(x), p.Y(y2), 3.2, 0, D.TAU);
            ctx.fillStyle = C('--brand'); ctx.fill();
          }
        }
      });
      plot.static();

      const pv = d.F(hi) - d.F(lo);
      UI.readout(out, [
        ['F(a)', f4(d.F(lo))],
        ['F(b)', f4(d.F(hi))],
        ['P{a < X ≤ b}', f4(pv)],
        ['F(+∞) 检验', f4(d.F(20))]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.2 分布律 ⇄ 分布函数
     ================================================================ */
  W.discretePmf = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    const presets = {
      'X: 摸球白球数': { xs: [0, 1, 2], ps: [0.1, 0.6, 0.3] },
      'X: 骰子点数': { xs: [1, 2, 3, 4, 5, 6], ps: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6] },
      'X: 二项 B(4,0.5)': { xs: [0, 1, 2, 3, 4], ps: [0.0625, 0.25, 0.375, 0.25, 0.0625] },
      'X: 几何 G(0.3)': { xs: [1, 2, 3, 4, 5, 6], ps: [0.3, 0.21, 0.147, 0.1029, 0.072, 0.0504] }
    };
    let key = 'X: 摸球白球数';

    UI.seg(ctrl, Object.keys(presets).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 0);

    function draw() {
      const T = D.Theme.cache, pr = presets[key];
      const { xs, ps } = pr;
      const cum = [];
      let s = 0;
      ps.forEach(p => { s += p; cum.push(s); });

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 48, padR = 24, padT = 40, padB = 44;
        const pw = (W_ - padL - padR) / 2 - 16;
        const ph = H_ - padT - padB;

        // ---- 左：分布律条形图 ----
        const x0 = padL;
        const maxP = Math.max(...ps);
        const bw = pw / xs.length * 0.56;
        const Yp = p => padT + ph - p / maxP * ph;

        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(x0, y + .5); ctx.lineTo(x0 + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), x0 - 6, y);
        }
        xs.forEach((x, i) => {
          const cx = x0 + pw * (i + 0.5) / xs.length;
          const h = ps[i] / maxP * ph;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - h, bw, h, 3);
          const g = ctx.createLinearGradient(0, padT + ph - h, 0, padT + ph);
          g.addColorStop(0, D.withAlpha(C('--brand'), 0.9));
          g.addColorStop(1, D.withAlpha(C('--brand'), 0.45));
          ctx.fillStyle = g; ctx.fill();

          ctx.fillStyle = T['--ink-2'];
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(ps[i].toFixed(3), cx, padT + ph - h - 4);
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '600 11px ' + D.FONT_MONO;
          ctx.textBaseline = 'top';
          ctx.fillText(x, cx, padT + ph + 7);
        });
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x0, padT + ph + .5); ctx.lineTo(x0 + pw, padT + ph + .5); ctx.stroke();

        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('分布律 P{X = xₖ}', x0, padT - 12);

        // ---- 右：分布函数阶梯 ----
        const x1 = padL + pw + 32;
        const xMin = xs[0] - 1, xMax = xs[xs.length - 1] + 1;
        const XF = v => x1 + (v - xMin) / (xMax - xMin) * pw;
        const YF = v => padT + ph - v * ph;

        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(x1, y + .5); ctx.lineTo(x1 + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((1 - i / 4).toFixed(2), x1 - 6, y);
        }

        // 阶梯
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(XF(xMin), YF(0));
        xs.forEach((x, i) => {
          ctx.lineTo(XF(x), YF(i === 0 ? 0 : cum[i - 1]));
          ctx.lineTo(XF(x), YF(cum[i]));
        });
        ctx.lineTo(XF(xMax), YF(1));
        ctx.stroke();

        // 跳跃点
        xs.forEach((x, i) => {
          const yPrev = i === 0 ? 0 : cum[i - 1];
          ctx.beginPath(); ctx.arc(XF(x), YF(yPrev), 3.4, 0, D.TAU);
          ctx.fillStyle = T['--card']; ctx.fill();
          ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.7; ctx.stroke();
          ctx.beginPath(); ctx.arc(XF(x), YF(cum[i]), 3.4, 0, D.TAU);
          ctx.fillStyle = C('--purple'); ctx.fill();

          // 跳跃高度标注
          ctx.strokeStyle = D.withAlpha(C('--accent'), 0.6);
          ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(XF(x), YF(yPrev)); ctx.lineTo(XF(x), YF(cum[i])); ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = T['--ink-3'];
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(x, XF(x), padT + ph + 7);
        });

        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x1, padT + ph + .5); ctx.lineTo(x1 + pw, padT + ph + .5); ctx.stroke();

        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('分布函数 F(x)（阶梯，跳跃高度 = pₖ）', x1, padT - 12);
      });
      scene.static();
      UI.readout(out, [
        ['Σpₖ 检验', f4(s)],
        ['E(X)', f3(xs.reduce((a, x, i) => a + x * ps[i], 0))],
        ['P{X ≤ 中位取值}', f3(cum[Math.floor(cum.length / 2)])],
        ['F 的跳跃点数', xs.length]
      ]);
    }
    draw();
  };

  /* ================================================================
     通用离散分布绘图（二项 / 泊松 / 几何 / 超几何）
     ================================================================ */
  function discretePlot(host, cfg) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    const st = Object.assign({}, cfg.init);
    const sliders = {};

    cfg.controls.forEach(c => {
      sliders[c.key] = UI.slider(ctrl, {
        label: c.label, min: c.min, max: c.max, step: c.step, value: st[c.key],
        fmt: c.fmt || (v => v),
        onInput: v => { st[c.key] = v; run(); }
      });
    });

    function run() {
      const T = D.Theme.cache;
      const { xs, ps, extra } = cfg.compute(st);

      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 30, padB = 48;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const n = xs.length;
        const maxP = Math.max(...ps, 0.001);
        const bw = Math.min(46, pw / n * 0.66);
        const Y = p => padT + ph - p / maxP * ph;
        const modeIdx = ps.indexOf(Math.max(...ps));

        // 网格
        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(W_ - padR, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 7, y);
        }
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(W_ - padR, padT + ph + .5); ctx.stroke();

        // 柱
        xs.forEach((x, i) => {
          const cx = padL + pw * (i + 0.5) / n;
          const p = ps[i];
          const k = D.clamp(anim * 1.2 - i * 0.02, 0, 1);
          const e = 1 - Math.pow(1 - k, 3);
          const h = p / maxP * ph * e;
          if (h < 0.3) return;
          const isMode = i === modeIdx;
          const col = isMode ? C('--accent') : C('--brand');

          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - h, bw, h, 3);
          const g = ctx.createLinearGradient(0, padT + ph - h, 0, padT + ph);
          g.addColorStop(0, D.withAlpha(col, 0.92));
          g.addColorStop(1, D.withAlpha(col, 0.4));
          ctx.fillStyle = g; ctx.fill();

          if (n <= 22 || i % 2 === 0) {
            ctx.fillStyle = T['--ink-3'];
            ctx.font = '500 10px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText(x, cx, padT + ph + 7);
          }
          // 概率标注：柱高足够时画在柱内（白字），否则画在柱顶上方，避免与顶部标注重叠
          if (n <= 14 && p > maxP * 0.06) {
            ctx.textAlign = 'center';
            if (h > 22) {
              ctx.fillStyle = '#fff';
              ctx.font = '700 9.5px ' + D.FONT_MONO;
              ctx.textBaseline = 'top';
              ctx.fillText(p.toFixed(3), cx, padT + ph - h + 4);
            } else {
              ctx.fillStyle = T['--ink-2'];
              ctx.font = '600 9.5px ' + D.FONT_MONO;
              ctx.textBaseline = 'bottom';
              ctx.fillText(p.toFixed(3), cx, padT + ph - h - 3);
            }
          }
        });

        // 均值线（标签置于底部，避开柱顶数值）
        if (extra.mean !== undefined) {
          const idx = extra.mean - xs[0] + 0.5;
          const X = padL + pw * idx / n;
          ctx.save();
          ctx.beginPath(); ctx.setLineDash([5, 4]);
          ctx.strokeStyle = D.withAlpha(C('--green'), 0.9); ctx.lineWidth = 1.6;
          ctx.moveTo(X, padT); ctx.lineTo(X, padT + ph); ctx.stroke();
          ctx.restore();
          // 底部标签带底色
          const lab = 'E(X)=' + extra.mean.toFixed(2);
          ctx.font = '700 10.5px ' + D.FONT_MONO;
          const tw = ctx.measureText(lab).width;
          const lx = D.clamp(X, padL + tw / 2 + 2, W_ - padR - tw / 2 - 2);
          const ly = padT + ph - 16;
          ctx.fillStyle = D.withAlpha(T['--card'], 0.94);
          ctx.beginPath();
          D.roundRectPath(ctx, lx - tw / 2 - 4, ly - 8, tw + 8, 15, 4);
          ctx.fill();
          ctx.fillStyle = C('--green');
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(lab, lx, ly);
        }

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(cfg.xLabel, padL + pw / 2, H_ - 8);

        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('P{X = k}', 10, 12);
      });
      scene.animate(560);
      UI.readout(out, extra.readout);
    }
    run();
    return { run };
  }

  /* ================================================================
     2.3a 二项分布
     ================================================================ */
  W.binomial = function (host) {
    discretePlot(host, {
      init: { n: 10, p: 0.5 },
      xLabel: '成功次数 k',
      controls: [
        { key: 'n', label: 'n', min: 1, max: 30, step: 1 },
        { key: 'p', label: 'p', min: 0.01, max: 0.99, step: 0.01, fmt: v => v.toFixed(2) }
      ],
      compute: st => {
        const { n, p } = st;
        const xs = [], ps = [];
        for (let k = 0; k <= n; k++) { xs.push(k); ps.push(S.binom.pmf(k, n, p)); }
        const mean = S.binom.mean(n, p);
        const sd = Math.sqrt(S.binom.varr(n, p));
        // 最可能值
        const mode = Math.floor((n + 1) * p);
        const modeVal = (mode > 0 && S.binom.pmf(mode, n, p) < S.binom.pmf(mode - 1, n, p)) ? mode - 1 : mode;
        return {
          xs, ps,
          extra: {
            mean,
            readout: [
              ['E(X) = np', f3(mean)],
              ['D(X) = np(1−p)', f3(S.binom.varr(n, p))],
              ['σ', f3(sd)],
              ['最可能值 k₀', Math.min(Math.max(modeVal, 0), n)],
              ['P{X = k₀}', f4(S.binom.pmf(Math.min(Math.max(modeVal, 0), n), n, p))]
            ]
          }
        };
      }
    });
  };

  /* ================================================================
     2.3b 泊松分布
     ================================================================ */
  W.poisson = function (host) {
    discretePlot(host, {
      init: { lam: 3 },
      xLabel: '计数 k',
      controls: [
        { key: 'lam', label: 'λ', min: 0.3, max: 15, step: 0.1, fmt: v => v.toFixed(1) }
      ],
      compute: st => {
        const lam = st.lam;
        const kmax = Math.ceil(lam + 4 * Math.sqrt(lam) + 4);
        const xs = [], ps = [];
        for (let k = 0; k <= kmax; k++) { xs.push(k); ps.push(S.poisson.pmf(k, lam)); }
        return {
          xs, ps,
          extra: {
            mean: lam,
            readout: [
              ['E(X) = λ', f3(lam)],
              ['D(X) = λ', f3(lam)],
              ['σ = √λ', f3(Math.sqrt(lam))],
              ['P{X = 0}', f4(Math.exp(-lam))],
              ['P{X ≥ 1}', f4(1 - Math.exp(-lam))]
            ]
          }
        };
      }
    });
  };

  /* ================================================================
     2.3c 几何分布
     ================================================================ */
  W.geometric = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let p = 0.3, trials = 3000, seq = null, data = null;

    UI.slider(ctrl, { label: '成功概率 p', min: 0.05, max: 0.9, step: 0.01, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; run(); } });
    UI.slider(ctrl, { label: '模拟次数', min: 500, max: 8000, step: 500, value: trials, onInput: v => { trials = v; run(); } });

    function run() {
      const kmax = Math.max(6, Math.ceil(3 / p) + 2);
      const ps = [];
      for (let k = 1; k <= kmax; k++) ps.push(S.geom.pmf(k, p));
      const rand = S.rng(2026);
      const cnt = new Array(kmax + 2).fill(0);
      for (let t = 0; t < trials; t++) {
        let k = 1;
        while (k <= kmax && rand() >= p) k++;
        cnt[Math.min(k, kmax + 1)]++;
      }
      data = cnt.map(c => c / trials);
      seq = S.bernoulliSeq(p, 60, S.rng(11));
      draw(ps, kmax);
      UI.readout(out, [
        ['E(X) = 1/p', f3(1 / p)],
        ['D(X) = (1−p)/p²', f3((1 - p) / (p * p))],
        ['P{X ≤ 3}', f3(S.geom.cdf(3, p))],
        ['无记忆性验证 P{X>5|X>2}', f4(S.geom.cdf(3, p) === 0 ? 0 : (1 - S.geom.cdf(5, p)) / (1 - S.geom.cdf(2, p)))],
        ['P{X > 3}', f4(1 - S.geom.cdf(3, p))]
      ]);
    }

    function draw(ps, kmax) {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padB = 48;
        const padT = 44;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        // 顶部序列
        const cell = Math.min(13, pw / 60);
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('伯努利序列（绿 = 成功）：', padL, 10);
        seq.forEach((v, i) => {
          ctx.beginPath();
          D.roundRectPath(ctx, padL + i * cell, 26, cell - 2, 10, 2);
          ctx.fillStyle = v ? C('--green') : D.withAlpha(T['--line-2'], 0.85);
          ctx.fill();
        });

        const n = ps.length;
        const maxP = Math.max(...ps, ...data);
        const bw = Math.min(48, pw / n * 0.62);
        const Y = v => padT + ph - v / maxP * ph;

        // 网格
        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(W_ - padR, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 7, y);
        }
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(W_ - padR, padT + ph + .5); ctx.stroke();

        ps.forEach((pv, i) => {
          const k = i + 1;
          const cx = padL + pw * (i + 0.5) / n;
          const h = pv / maxP * ph;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - h, bw, h, 3);
          const g = ctx.createLinearGradient(0, padT + ph - h, 0, padT + ph);
          g.addColorStop(0, D.withAlpha(C('--brand'), 0.9));
          g.addColorStop(1, D.withAlpha(C('--brand'), 0.4));
          ctx.fillStyle = g; ctx.fill();

          // 模拟点
          const sh = (data[i] || 0) / maxP * ph;
          ctx.beginPath(); ctx.arc(cx, padT + ph - sh, 3.4, 0, D.TAU);
          ctx.fillStyle = C('--accent'); ctx.fill();
          ctx.strokeStyle = T['--card']; ctx.lineWidth = 1.5; ctx.stroke();

          ctx.fillStyle = T['--ink-3'];
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(k, cx, padT + ph + 7);
        });

        // E(X) 线
        const Xm = padL + pw * (1 / p - 1 + 0.5) / n;
        ctx.save();
        ctx.beginPath(); ctx.setLineDash([5, 4]);
        ctx.strokeStyle = D.withAlpha(C('--green'), 0.9); ctx.lineWidth = 1.6;
        ctx.moveTo(Xm, padT); ctx.lineTo(Xm, padT + ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green');
        ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('E(X)=1/p=' + (1 / p).toFixed(2), Xm, padT + 2);

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('首次成功所需试验次数 k', padL + pw / 2, H_ - 8);
      });
      scene.static();
    }
    run();
  };

  /* ================================================================
     2.3d 超几何分布
     ================================================================ */
  W.hypergeom = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let N = 100, M = 10, n = 10, cmpBinom = true;

    UI.slider(ctrl, { label: '总数 N', min: 20, max: 300, step: 10, value: N, onInput: v => { N = v; if (M > N) M = N; run(); } });
    UI.slider(ctrl, { label: '次品数 M', min: 1, max: 60, value: M, onInput: v => { M = v; run(); } });
    UI.slider(ctrl, { label: '抽取 n', min: 1, max: 40, value: n, onInput: v => { n = v; run(); } });

    function run() {
      const lo = Math.max(0, n - (N - M)), hi = Math.min(n, M);
      const xs = [], ps = [], bs = [];
      for (let k = lo; k <= hi; k++) {
        xs.push(k);
        ps.push(S.hyper.pmf(k, N, M, n));
        bs.push(S.binom.pmf(k, n, M / N));
      }
      draw(xs, ps, bs, lo, hi);
      UI.readout(out, [
        ['E(X) = nM/N', f3(S.hyper.mean(N, M, n))],
        ['D(X)', f3(S.hyper.varr(N, M, n))],
        ['p = M/N', f3(M / N)],
        ['抽取比例 n/N', f3(n / N)],
        ['二项近似 B(n, M/N) 的 E(X)', f3(S.binom.mean(n, M / N))]
      ]);
    }

    function draw(xs, ps, bs, lo, hi) {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 30, padB = 48;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const n = xs.length;
        const maxP = Math.max(...ps, ...bs, 0.001);
        const bw = Math.min(44, pw / n * 0.6);
        const Y = v => padT + ph - v / maxP * ph;

        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(W_ - padR, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 7, y);
        }
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(W_ - padR, padT + ph + .5); ctx.stroke();

        xs.forEach((x, i) => {
          const cx = padL + pw * (i + 0.5) / n;
          const h = ps[i] / maxP * ph;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - h, bw, h, 3);
          const g = ctx.createLinearGradient(0, padT + ph - h, 0, padT + ph);
          g.addColorStop(0, D.withAlpha(C('--brand'), 0.9));
          g.addColorStop(1, D.withAlpha(C('--brand'), 0.4));
          ctx.fillStyle = g; ctx.fill();

          // 二项近似轮廓
          const bh = bs[i] / maxP * ph;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - bh, bw, bh, 3);
          ctx.strokeStyle = D.withAlpha(C('--accent'), 0.9);
          ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]);
          ctx.stroke(); ctx.setLineDash([]);

          ctx.fillStyle = T['--ink-3'];
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(x, cx, padT + ph + 7);
        });

        // 图例
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        let lx = padL;
        const ly = H_ - 12;
        ctx.fillStyle = C('--brand');
        ctx.beginPath(); D.roundRectPath(ctx, lx, ly - 5, 11, 11, 3); ctx.fill();
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('超几何 H(' + N + ',' + M + ',' + n + ')', lx + 16, ly);
        lx += ctx.measureText('超几何 H(' + N + ',' + M + ',' + n + ')').width + 44;
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]);
        ctx.strokeRect(lx, ly - 5, 11, 11); ctx.setLineDash([]);
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('二项近似 B(' + n + ',' + (M / N).toFixed(2) + ')', lx + 16, ly);

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('抽到的次品数 k', padL + pw / 2, padT - 12);
      });
      scene.animate(500);
    }
    run();
  };

  /* ================================================================
     2.3e 泊松定理验证
     ================================================================ */
  W.poissonApprox = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let lam = 3, n = 10;

    UI.slider(ctrl, { label: '固定 λ = np', min: 0.5, max: 8, step: 0.1, value: lam, fmt: v => v.toFixed(1), onInput: v => { lam = v; draw(); } });
    UI.slider(ctrl, { label: 'n', min: 5, max: 400, step: 5, value: n, onInput: v => { n = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const p = lam / n;
      if (p >= 1) { /* n 太小时跳过 */ }
      const kmax = Math.ceil(lam + 4 * Math.sqrt(lam) + 3);
      const xs = [], bino = [], pois = [];
      for (let k = 0; k <= kmax; k++) {
        xs.push(k);
        bino.push(p < 1 ? S.binom.pmf(k, n, p) : 0);
        pois.push(S.poisson.pmf(k, lam));
      }
      // 最大绝对误差
      let maxErr = 0;
      xs.forEach((k, i) => { maxErr = Math.max(maxErr, Math.abs(bino[i] - pois[i])); });

      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 32, padB = 48;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const cnt = xs.length;
        const maxP = Math.max(...bino, ...pois, 0.001);
        const bw = Math.min(40, pw / cnt * 0.58);

        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(W_ - padR, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 7, y);
        }
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(W_ - padR, padT + ph + .5); ctx.stroke();

        // 二项柱
        xs.forEach((x, i) => {
          const cx = padL + pw * (i + 0.5) / cnt;
          const h = bino[i] / maxP * ph;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - h, bw, h, 3);
          const g = ctx.createLinearGradient(0, padT + ph - h, 0, padT + ph);
          g.addColorStop(0, D.withAlpha(C('--brand'), 0.85));
          g.addColorStop(1, D.withAlpha(C('--brand'), 0.35));
          ctx.fillStyle = g; ctx.fill();

          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(x, cx, padT + ph + 7);
        });

        // 泊松折线
        ctx.beginPath();
        pois.forEach((pv, i) => {
          const cx = padL + pw * (i + 0.5) / cnt;
          const cy = padT + ph - pv / maxP * ph;
          i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
        });
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2.2; ctx.stroke();
        pois.forEach((pv, i) => {
          const cx = padL + pw * (i + 0.5) / cnt;
          const cy = padT + ph - pv / maxP * ph;
          ctx.beginPath(); ctx.arc(cx, cy, 3.6, 0, D.TAU);
          ctx.fillStyle = C('--accent'); ctx.fill();
          ctx.strokeStyle = T['--card']; ctx.lineWidth = 1.6; ctx.stroke();
        });

        // 图例
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        let lx = padL;
        const ly = padT - 12;
        ctx.fillStyle = C('--brand');
        ctx.beginPath(); D.roundRectPath(ctx, lx, ly - 5, 11, 11, 3); ctx.fill();
        ctx.fillStyle = T['--ink-2'];
        const t1 = '二项 B(' + n + ', ' + p.toFixed(4) + ')';
        ctx.fillText(t1, lx + 16, ly);
        lx += ctx.measureText(t1).width + 40;
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 13, ly); ctx.stroke();
        ctx.beginPath(); ctx.arc(lx + 6.5, ly, 3.4, 0, D.TAU); ctx.fillStyle = C('--accent'); ctx.fill();
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('泊松 P(' + lam.toFixed(1) + ')', lx + 20, ly);

        // 误差标注
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText('最大误差 = ' + maxErr.toExponential(2), W_ - padR, padT - 12);
      });
      scene.animate(480);
      UI.readout(out, [
        ['n', n], ['p = λ/n', f4(lam / n)],
        ['最大绝对误差', maxErr.toExponential(3)],
        ['近似条件 n≥100 且 p≤0.1', (n >= 100 && p <= 0.1) ? '满足 ✓' : '不满足 ✗']
      ]);
    }
    draw();
  };

  /* ================================================================
     2.4 概率密度与面积
     ================================================================ */
  W.density = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -0.5, xMax: 4.5, yMin: 0, yMax: 0.75,
      xTicks: 5, yTicks: 5, xLabel: 'x', yLabel: 'f(x)', height: 300
    });
    const funcs = {
      'N(2,1)': { f: x => S.normal.pdf(x, 2, 1), name: '正态' },
      'E(1)': { f: x => S.expon.pdf(x, 1), name: '指数' },
      'U(0.5,3.5)': { f: x => S.uniform.pdf(x, 0.5, 3.5), name: '均匀' },
      '三角形': { f: x => (x >= 0 && x <= 2) ? x / 2 : ((x > 2 && x <= 4) ? (4 - x) / 2 : 0), name: '三角形' }
    };
    let key = 'N(2,1)', a = 1, b = 3;

    UI.seg(ctrl, Object.keys(funcs).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'a', min: -0.5, max: 4.4, step: 0.05, value: a, fmt: v => v.toFixed(2), onInput: v => { a = v; draw(); } });
    UI.slider(ctrl, { label: 'b', min: -0.5, max: 4.5, step: 0.05, value: b, fmt: v => v.toFixed(2), onInput: v => { b = v; draw(); } });

    function draw() {
      const fn = funcs[key].f;
      const lo = Math.min(a, b), hi = Math.max(a, b);
      plot.clearLayers();
      plot.area(fn, lo, hi, { color: C('--brand'), alpha: 0.26 });
      plot.curve(fn, { color: C('--brand'), width: 2.4 });
      plot.vline(lo, { color: C('--accent'), label: 'a' });
      plot.vline(hi, { color: C('--accent'), label: 'b' });
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        // 标注面积数值
        const mid = (lo + hi) / 2;
        const yv = fn(mid);
        ctx.save();
        ctx.font = '700 12px ' + D.FONT_MONO;
        ctx.fillStyle = C('--accent');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        let area = 0;
        const N = 400;
        for (let i = 0; i < N; i++) {
          const x1 = lo + (hi - lo) * i / N, x2 = lo + (hi - lo) * (i + 1) / N;
          area += (fn(x1) + fn(x2)) / 2 * (x2 - x1);
        }
        ctx.fillText('面积 = ' + area.toFixed(4), p.X(mid), p.Y(yv) - 6);
        ctx.restore();
      });
      plot.static();

      let area = 0;
      const N = 2000;
      for (let i = 0; i < N; i++) {
        const x1 = lo + (hi - lo) * i / N, x2 = lo + (hi - lo) * (i + 1) / N;
        area += (fn(x1) + fn(x2)) / 2 * (x2 - x1);
      }
      let total = 0;
      for (let i = 0; i < N; i++) {
        const x1 = -0.5 + 5 * i / N, x2 = -0.5 + 5 * (i + 1) / N;
        total += (fn(x1) + fn(x2)) / 2 * (x2 - x1);
      }
      UI.readout(out, [
        ['P{a < X < b} = 面积', f4(area)],
        ['∫f(x)dx（可视范围内）', f4(total)],
        ['f 的最大值', f3(Math.max(...Array.from({ length: 200 }, (_, i) => fn(-0.5 + 5 * i / 199))))],
        ['提示', 'f(x) 不是概率，可大于 1']
      ]);
    }
    draw();
  };

  /* ================================================================
     2.5a 均匀分布
     ================================================================ */
  W.uniform = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -1, xMax: 7, yMin: 0, yMax: 1.1,
      xTicks: 8, yTicks: 5, xLabel: 'x', yLabel: 'f(x) / F(x)', height: 300
    });
    let a = 1, b = 5;

    UI.slider(ctrl, { label: 'a', min: -1, max: 5, step: 0.1, value: a, fmt: v => v.toFixed(1), onInput: v => { a = v; if (b <= a + 0.3) b = a + 0.5; draw(); } });
    UI.slider(ctrl, { label: 'b', min: -0.5, max: 7, step: 0.1, value: b, fmt: v => v.toFixed(1), onInput: v => { b = v; if (b <= a + 0.3) a = b - 0.5; draw(); } });

    function draw() {
      plot.clearLayers();
      plot.area(x => S.uniform.pdf(x, a, b), a, b, { color: C('--brand'), alpha: 0.22 });
      plot.curve(x => S.uniform.pdf(x, a, b), { color: C('--brand'), width: 2.4, samples: 600 });
      plot.curve(x => S.uniform.cdf(x, a, b), { color: C('--purple'), width: 2, dash: [6, 4], samples: 600 });
      plot.vline(a, { color: C('--accent'), label: 'a' });
      plot.vline(b, { color: C('--accent'), label: 'b' });
      plot.custom((p, ctx) => {
        ctx.save();
        ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.fillStyle = C('--brand');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('1/(b−a)=' + (1 / (b - a)).toFixed(3), p.X((a + b) / 2), p.Y(1 / (b - a)) - 5);
        ctx.restore();
      });
      plot.static();
      UI.readout(out, [
        ['b − a', f3(b - a)],
        ['密度值 1/(b−a)', f4(1 / (b - a))],
        ['P{X 在中间一半}', '0.500'],
        ['E(X)', f3((a + b) / 2)],
        ['D(X)', f3((b - a) * (b - a) / 12)]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.5b 指数分布
     ================================================================ */
  W.exponential = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -0.5, xMax: 6, yMin: 0, yMax: 1.05,
      xTicks: 6, yTicks: 5, xLabel: 'x', yLabel: 'f(x) / F(x)', height: 300
    });
    let lam = 1, s = 1.5, t = 1;

    UI.slider(ctrl, { label: 'λ', min: 0.2, max: 3, step: 0.1, value: lam, fmt: v => v.toFixed(1), onInput: v => { lam = v; draw(); } });
    UI.slider(ctrl, { label: '已工作 s', min: 0, max: 4, step: 0.1, value: s, fmt: v => v.toFixed(1), onInput: v => { s = v; draw(); } });
    UI.slider(ctrl, { label: '再工作 t', min: 0.1, max: 4, step: 0.1, value: t, fmt: v => v.toFixed(1), onInput: v => { t = v; draw(); } });

    function draw() {
      plot.clearLayers();
      plot.area(x => S.expon.pdf(x, lam), 0, 1 / lam, { color: C('--brand'), alpha: 0.2 });
      plot.curve(x => S.expon.pdf(x, lam), { color: C('--brand'), width: 2.4, samples: 500 });
      plot.curve(x => S.expon.cdf(x, lam), { color: C('--purple'), width: 2, dash: [6, 4], samples: 500 });
      plot.vline(1 / lam, { color: C('--green'), label: '1/λ', labelPos: 'top' });
      plot.vline(s, { color: C('--accent'), label: 's' });
      plot.vline(s + t, { color: C('--accent'), label: 's+t' });
      plot.static();

      const P1 = Math.exp(-lam * t);
      const P2 = (1 - S.expon.cdf(s + t, lam)) / (1 - S.expon.cdf(s, lam));
      UI.readout(out, [
        ['E(X) = 1/λ', f3(1 / lam)],
        ['P{X > t}', f4(P1)],
        ['P{X > s+t | X > s}', f4(P2)],
        ['无记忆性', Math.abs(P1 - P2) < 1e-9 ? '成立 ✓' : '—']
      ]);
    }
    draw();
  };

  /* ================================================================
     2.5c 正态分布
     ================================================================ */
  W.normal = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -5, xMax: 9, yMin: 0, yMax: 0.95,
      xTicks: 7, yTicks: 5, xLabel: 'x', yLabel: 'f(x)', height: 320
    });
    let mu = 1, sg = 1.5, a = -0.5, b = 2.5;

    UI.slider(ctrl, { label: 'μ', min: -2, max: 6, step: 0.1, value: mu, fmt: v => v.toFixed(1), onInput: v => { mu = v; draw(); } });
    UI.slider(ctrl, { label: 'σ', min: 0.3, max: 3, step: 0.1, value: sg, fmt: v => v.toFixed(1), onInput: v => { sg = v; draw(); } });
    UI.slider(ctrl, { label: 'a', min: -5, max: 8, step: 0.1, value: a, fmt: v => v.toFixed(1), onInput: v => { a = v; draw(); } });
    UI.slider(ctrl, { label: 'b', min: -5, max: 9, step: 0.1, value: b, fmt: v => v.toFixed(1), onInput: v => { b = v; draw(); } });

    function draw() {
      const lo = Math.min(a, b), hi = Math.max(a, b);
      plot.clearLayers();
      // 3σ 区域
      plot.area(x => S.normal.pdf(x, mu, sg), mu - 3 * sg, mu + 3 * sg, { color: C('--teal'), alpha: 0.09, stroke: false });
      plot.area(x => S.normal.pdf(x, mu, sg), lo, hi, { color: C('--brand'), alpha: 0.3 });
      plot.curve(x => S.normal.pdf(x, mu, sg), { color: C('--brand'), width: 2.4 });
      // 对照标准正态
      plot.curve(x => S.normal.pdf(x, 0, 1), { color: C('--line-2'), width: 1.5, dash: [5, 4] });
      plot.vline(mu, { color: C('--green'), label: 'μ' });
      plot.vline(mu - sg, { color: C('--green'), dash: [3, 3] });
      plot.vline(mu + sg, { color: C('--green'), dash: [3, 3] });
      plot.vline(lo, { color: C('--accent'), label: 'a' });
      plot.vline(hi, { color: C('--accent'), label: 'b' });

      const p = S.normal.cdf(hi, mu, sg) - S.normal.cdf(lo, mu, sg);
      plot.custom((pp, ctx) => {
        ctx.save();
        ctx.font = '700 12px ' + D.FONT_MONO;
        ctx.fillStyle = C('--accent');
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        const mid = (lo + hi) / 2;
        ctx.fillText('P=' + p.toFixed(4), pp.X(mid), pp.Y(S.normal.pdf(mid, mu, sg)) - 8);
        ctx.restore();
      });
      plot.static();

      UI.readout(out, [
        ['P{a<X<b}', f4(p)],
        ['Φ((b−μ)/σ)', f4(S.normal.cdf(hi, mu, sg))],
        ['Φ((a−μ)/σ)', f4(S.normal.cdf(lo, mu, sg))],
        ['P{|X−μ|<σ}', f4(S.normal.cdf(mu + sg, mu, sg) - S.normal.cdf(mu - sg, mu, sg))],
        ['P{|X−μ|<2σ}', f4(S.normal.cdf(mu + 2 * sg, mu, sg) - S.normal.cdf(mu - 2 * sg, mu, sg))],
        ['P{|X−μ|<3σ}', f4(S.normal.cdf(mu + 3 * sg, mu, sg) - S.normal.cdf(mu - 3 * sg, mu, sg))]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.5d 标准正态分布表
     ================================================================ */
  W.stdNormal = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -4, xMax: 4, yMin: 0, yMax: 0.45,
      xTicks: 8, yTicks: 5, xLabel: 'x', yLabel: 'φ(x)', height: 300
    });
    let x0 = 1.0;
    const { el } = UI;

    UI.slider(ctrl, { label: 'x', min: -3.9, max: 3.9, step: 0.01, value: x0, fmt: v => v.toFixed(2), onInput: v => { x0 = v; draw(); } });

    function draw() {
      plot.clearLayers();
      // 左侧尾部
      plot.area(x => S.normal.phi(x), -4, x0, { color: C('--brand'), alpha: 0.3 });
      plot.curve(x => S.normal.phi(x), { color: C('--brand'), width: 2.4 });
      plot.vline(x0, { color: C('--accent'), label: 'x' });
      plot.vline(0, { color: C('--line-2'), dash: [3, 3] });

      const Phi = S.normal.Phi(x0);
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        ctx.save();
        // 阴影标注
        ctx.font = '700 12px ' + D.FONT_MONO;
        ctx.fillStyle = C('--brand');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const mx = p.X((Math.min(x0, 0) + x0) / 2);
        const my = p.Y(S.normal.phi(x0) * 0.5);
        if (Math.abs(p.X(x0) - p.X(0)) > 42) ctx.fillText('Φ(x)=' + Phi.toFixed(4), mx, my);

        // 右侧尾部高亮
        ctx.beginPath();
        ctx.moveTo(p.X(x0), p.Y(0));
        for (let i = 0; i <= 160; i++) {
          const x = x0 + (4 - x0) * i / 160;
          ctx.lineTo(p.X(x), p.Y(S.normal.phi(x)));
        }
        ctx.lineTo(p.X(4), p.Y(0));
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--accent'), 0.2); ctx.fill();
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.3; ctx.stroke();

        ctx.fillStyle = C('--accent');
        ctx.font = '600 11px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('1−Φ(x)=' + (1 - Phi).toFixed(4), p.X(x0) + 8, p.Y(0.08));
        ctx.restore();
      });
      plot.static();

      UI.readout(out, [
        ['φ(x)', f4(S.normal.phi(x0))],
        ['Φ(x) = P{X ≤ x}', f4(Phi)],
        ['1 − Φ(x) = P{X > x}', f4(1 - Phi)],
        ['Φ(−x) = 1−Φ(x)', f4(S.normal.Phi(-x0))],
        ['若 Φ(x)=1−α，则 x 是上 α 分位点', (1 - Phi).toFixed(4) + ' = α']
      ]);
    }
    draw();
  };

  /* ================================================================
     2.6a 离散型函数分布
     ================================================================ */
  W.transformDiscrete = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    const cases = {
      'Y = X²': { g: x => x * x, label: 'Y = X²' },
      'Y = 2X+1': { g: x => 2 * x + 1, label: 'Y = 2X + 1' },
      'Y = |X|': { g: x => Math.abs(x), label: 'Y = |X|' },
      'Y = X mod 2': { g: x => ((x % 2) + 2) % 2, label: 'Y = X mod 2' }
    };
    const Xs = [-2, -1, 0, 1, 2];
    const Ps = [0.1, 0.2, 0.4, 0.2, 0.1];
    let key = 'Y = X²';

    UI.seg(ctrl, Object.keys(cases).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 0);

    function draw() {
      const T = D.Theme.cache;
      const g = cases[key].g;
      const res = S.transformDiscrete(Xs, Ps, g);
      const maxP = Math.max(...Ps, ...res.map(r => r.p));

      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padR = 24, padT = 44, padB = 46;
        const pw = (W_ - padL - padR) / 2 - 22;
        const ph = H_ - padT - padB;

        // ---- 左：X 的分布 ----
        const x0 = padL;
        const bw = Math.min(40, pw / Xs.length * 0.6);
        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(x0, y + .5); ctx.lineTo(x0 + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), x0 - 6, y);
        }
        Xs.forEach((x, i) => {
          const cx = x0 + pw * (i + 0.5) / Xs.length;
          const h = Ps[i] / maxP * ph;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - h, bw, h, 3);
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.8); ctx.fill();
          ctx.fillStyle = T['--ink-2'];
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(Ps[i].toFixed(2), cx, padT + ph - h - 3);
          ctx.fillStyle = T['--ink-3'];
          ctx.textBaseline = 'top';
          ctx.fillText(x, cx, padT + ph + 7);
          // 箭头到右侧
          ctx.save();
          ctx.strokeStyle = D.withAlpha(C('--accent'), 0.5 * anim);
          ctx.lineWidth = 1.3;
          const jx = x0 + pw + 22, jy = padT + ph * 0.5;
          ctx.beginPath();
          ctx.moveTo(cx, padT + ph - h * 0.5);
          ctx.bezierCurveTo(cx + 30, padT + ph - h * 0.5, jx - 20, jy, jx, jy);
          ctx.stroke();
          ctx.restore();
        });
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x0, padT + ph + .5); ctx.lineTo(x0 + pw, padT + ph + .5); ctx.stroke();
        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('X 的分布律', x0, padT - 12);

        // ---- 右：Y 的分布 ----
        const x1 = padL + pw + 44;
        const bw2 = Math.min(42, pw / res.length * 0.6);
        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(x1, y + .5); ctx.lineTo(x1 + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), x1 - 6, y);
        }
        res.forEach((r, i) => {
          const cx = x1 + pw * (i + 0.5) / res.length;
          const k = D.clamp(anim * 1.3 - i * 0.1, 0, 1);
          const e = 1 - Math.pow(1 - k, 3);
          const h = r.p / maxP * ph * e;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw2 / 2, padT + ph - h, bw2, h, 3);
          const gr = ctx.createLinearGradient(0, padT + ph - h, 0, padT + ph);
          gr.addColorStop(0, D.withAlpha(C('--accent'), 0.9));
          gr.addColorStop(1, D.withAlpha(C('--accent'), 0.4));
          ctx.fillStyle = gr; ctx.fill();
          ctx.fillStyle = T['--ink-2'];
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(r.p.toFixed(2), cx, padT + ph - h - 3);
          ctx.fillStyle = T['--ink-3'];
          ctx.textBaseline = 'top';
          ctx.fillText(r.y, cx, padT + ph + 7);
        });
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(x1, padT + ph + .5); ctx.lineTo(x1 + pw, padT + ph + .5); ctx.stroke();
        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('Y = g(X) 的分布律（合并同值）', x1, padT - 12);
      });
      scene.animate(620);
      UI.readout(out, [
        ['映射 g', cases[key].label],
        ['X 取值数', Xs.length],
        ['Y 取值数', res.length],
        ['Σp 检验', f4(res.reduce((s, r) => s + r.p, 0))],
        ['Y 的取值', res.map(r => r.y).join(', ')]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.6b 连续型函数分布
     ================================================================ */
  W.transformContinuous = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -3.5, xMax: 3.5, yMin: 0, yMax: 1.2,
      xTicks: 7, yTicks: 4, xLabel: 'x / y', yLabel: '密度', height: 320
    });
    let mode = 'square';
    UI.seg(ctrl, [
      { label: 'Y = X²', value: 'square' },
      { label: 'Y = |X|', value: 'abs' },
      { label: 'Y = 2X+1', value: 'lin' }
    ], v => { mode = v; draw(); }, 0);

    function draw() {
      plot.clearLayers();
      const phi = x => S.normal.phi(x);
      const cPhi = x => S.normal.Phi(x);

      if (mode === 'square') {
        // X ~ N(0,1)，Y=X²
        plot.curve(phi, { color: C('--line-2'), width: 1.6, dash: [5, 4] });
        plot.note(-2.6, 0.35, 'X ~ N(0,1)', { color: C('--ink-3'), size: 11 });
        // Y 的密度 f_Y(y)=1/sqrt(2πy) e^{-y/2}
        plot.curve(y => (y > 0.01) ? Math.exp(-y / 2) / Math.sqrt(2 * Math.PI * y) : 0,
          { color: C('--accent'), width: 2.6, from: 0.01, to: 3.5 });
        plot.note(1.5, 0.72, 'f_Y(y) = e^{−y/2}/√(2πy)', { color: C('--accent'), size: 11.5 });
        // 映射示意
        plot.vline(1, { color: C('--brand'), dash: [4, 4], label: 'x=1' });
        plot.vline(-1, { color: C('--brand'), dash: [4, 4], label: 'x=−1' });
        plot.arrow(1, 0.24, 1, 0.55, { color: C('--brand') });
        plot.arrow(-1, 0.24, 1, 0.55, { color: C('--brand'), dash: [4, 3] });
        plot.note(1.02, 0.6, '两支合并到 y=1', { color: C('--brand'), size: 11, dx: 4 });
      } else if (mode === 'abs') {
        plot.curve(phi, { color: C('--line-2'), width: 1.6, dash: [5, 4] });
        // f_Y(y) = 2φ(y), y>0
        plot.curve(y => y > 0 ? 2 * phi(y) : 0, { color: C('--accent'), width: 2.6, from: 0, to: 3.5 });
        plot.note(1.4, 0.6, 'f_Y(y) = 2φ(y), y > 0', { color: C('--accent'), size: 11.5 });
        plot.note(-2.6, 0.35, 'X ~ N(0,1)', { color: C('--ink-3'), size: 11 });
      } else {
        plot.curve(phi, { color: C('--line-2'), width: 1.6, dash: [5, 4] });
        // Y=2X+1 ~ N(1,4)，密度 (1/2)φ((y-1)/2)
        plot.curve(y => 0.5 * phi((y - 1) / 2), { color: C('--accent'), width: 2.6 });
        plot.note(1.6, 0.42, 'Y ~ N(1, 4)', { color: C('--accent'), size: 11.5 });
        plot.note(-2.6, 0.35, 'X ~ N(0,1)', { color: C('--ink-3'), size: 11 });
      }
      plot.static();

      const rows = mode === 'square'
        ? [['变换', 'Y = X²'], ['值域', 'y > 0'], ['密度', 'e^{−y/2}/√(2πy)'], ['分布', 'χ²(1)'], ['关键', '两支 ±√y 合并求和']]
        : mode === 'abs'
          ? [['变换', 'Y = |X|'], ['值域', 'y > 0'], ['密度', '2φ(y)'], ['分布', '半正态分布'], ['关键', 'P{|X|≤y}=2Φ(y)−1']]
          : [['变换', 'Y = 2X+1'], ['值域', '全体实数'], ['密度', '(1/2)φ((y−1)/2)'], ['分布', 'N(1,4)'], ['关键', '线性变换：N(aμ+b, a²σ²)']];
      UI.readout(out, rows.map(r => [r[0], r[1]]));
    }
    draw();
  };

  /* ================================================================
     2.1c 分布函数四条性质的逐项验证
     ================================================================ */
  W.cdfProperties = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -4.5, xMax: 4.5, yMin: -0.06, yMax: 1.12,
      xTicks: 9, yTicks: 6, xLabel: 'x', yLabel: 'F(x)', height: 300
    });
    let kind = 'normal', xa = -0.8, xb = 1.4;

    const DISTS = {
      normal: { name: 'N(0,1)', disc: false, F: x => S.normal.cdf(x, 0, 1) },
      expon: { name: 'E(1)', disc: false, F: x => S.expon.cdf(x, 1) },
      uniform: { name: 'U(−2,2)', disc: false, F: x => S.uniform.cdf(x, -2, 2) },
      disc: {
        name: '离散型（−1,0,1）', disc: true,
        jump: [[-1, 0.3], [0, 0.7], [1, 1]],
        F: x => (x < -1 ? 0 : x < 0 ? 0.3 : x < 1 ? 0.7 : 1)
      }
    };

    UI.seg(ctrl, Object.keys(DISTS).map(k => ({ label: DISTS[k].name, value: k })), v => { kind = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'x₁', min: -4, max: 4, step: 0.05, value: xa, fmt: v => v.toFixed(2), onInput: v => { xa = v; draw(); } });
    UI.slider(ctrl, { label: 'x₂', min: -4, max: 4, step: 0.05, value: xb, fmt: v => v.toFixed(2), onInput: v => { xb = v; draw(); } });

    function draw() {
      const T = D.Theme.cache, d = DISTS[kind];
      const lo = Math.min(xa, xb), hi = Math.max(xa, xb);
      let monoViolation = 0, rightGap = 0, prev = -Infinity;
      for (let i = 0; i <= 400; i++) {
        const x = -4.5 + 9 * i / 400;
        const v = d.F(x);
        if (v < prev - 1e-12) monoViolation = Math.max(monoViolation, prev - v);
        prev = v;
        rightGap = Math.max(rightGap, Math.abs(d.F(x + 1e-3) - v));
      }

      plot.setDomain(-4.5, 4.5, -0.06, 1.12);
      plot.clearLayers();
      plot.curve(d.F, { color: C('--brand'), width: 2.4, samples: 700 });
      plot.custom((p, ctx) => {
        const X = v => p.X(v), Y = v => p.Y(v);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3.8; ctx.strokeStyle = D.withAlpha(C('--accent'), 0.9);
        let started = false;
        for (let i = 0; i <= 260; i++) {
          const x = lo + (hi - lo) * i / 260;
          const y = d.F(x);
          if (!isFinite(y)) continue;
          if (!started) { ctx.moveTo(X(x), Y(y)); started = true; } else ctx.lineTo(X(x), Y(y));
        }
        ctx.stroke(); ctx.restore();

        [xa, xb].forEach((v, i) => {
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = i ? D.withAlpha(C('--green'), 0.9) : D.withAlpha(C('--red'), 0.9);
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(X(v), p.py); ctx.lineTo(X(v), p.py + p.ph); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = i ? C('--green') : C('--red');
          ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText('x' + (i + 1) + '=' + v.toFixed(2), D.clamp(X(v), p.px + 26, p.px + p.pw - 26), p.py + 13 + i * 15);
        });

        if (d.disc) {
          d.jump.forEach(jp => {
            ctx.beginPath(); ctx.arc(X(jp[0]), Y(jp[1]), 4, 0, D.TAU);
            ctx.fillStyle = C('--purple'); ctx.fill();
            ctx.beginPath(); ctx.arc(X(jp[0]), Y(jp[1] - (d.F(jp[0]) - d.F(jp[0] - 1e-4))), 4, 0, D.TAU);
            ctx.fillStyle = T['--card']; ctx.fill();
            ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.6; ctx.stroke();
          });
        }
      });
      plot.static();

      UI.readout(out, [
        ['分布', d.name],
        ['F(x₁) / F(x₂)', f4(d.F(xa)) + ' / ' + f4(d.F(xb))],
        ['P{x₁ < X ≤ x₂} = F(x₂) − F(x₁)', f4(d.F(hi) - d.F(lo))],
        ['① 单调不减（最大倒挂量）', monoViolation.toExponential(2) + (monoViolation < 1e-9 ? ' ✓' : ' ✗')],
        ['② 右连续（max|F(x+0.001)−F(x)|）', rightGap.toExponential(2) + (rightGap < 5e-3 ? ' ✓' : ' ✗')],
        ['③ F(−∞) ≈ F(−10)', f4(d.F(-10))],
        ['④ F(+∞) ≈ F(10)', f4(d.F(10))]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.2b 频率逼近概率：离散分布的模拟
     ================================================================ */
  W.pmfSimulate = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let key = 'dice', trials = 4000, seed = 20260910;

    const DISTS = {
      dice: { name: '骰子（均匀）', ks: [1, 2, 3, 4, 5, 6], pmf: () => 1 / 6, mean: 3.5, varr: 35 / 12, tail: '' },
      binom: { name: '二项 B(10,0.4)', ks: Array.from({ length: 11 }, (_, i) => i), pmf: k => S.binom.pmf(k, 10, 0.4), mean: 4, varr: 2.4, tail: '' },
      poisson: { name: '泊松 P(3)', ks: Array.from({ length: 13 }, (_, i) => i), pmf: k => S.poisson.pmf(k, 3), mean: 3, varr: 3, tail: '（k≥12 的概率已并入末列）' },
      geom: { name: '几何 G(0.3)', ks: Array.from({ length: 14 }, (_, i) => i + 1), pmf: k => S.geom.pmf(k, 0.3), mean: 1 / 0.3, varr: 0.7 / 0.09, tail: '（k≥14 的概率已并入末列）' }
    };

    UI.seg(ctrl, Object.keys(DISTS).map(k => ({ label: DISTS[k].name, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '模拟试验次数', min: 100, max: 20000, step: 100, value: trials, onInput: v => { trials = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache, d = DISTS[key];
      const rand = S.rng(seed * 2654435761 % 2147483647 + 11);
      const cum = [];
      let s = 0;
      d.ks.forEach(k => { const p = d.pmf(k); cum.push(s + p); s += p; });
      const lastP = Math.max(0, 1 - s);
      const cnt = new Array(d.ks.length).fill(0);
      for (let t = 0; t < trials; t++) {
        const u = rand();
        let idx = cum.findIndex(c => u <= c);
        if (idx < 0) idx = d.ks.length - 1;
        cnt[idx]++;
      }
      const freq = cnt.map(c => c / trials);
      const theory = d.ks.map((k, i) => d.pmf(k) + (i === d.ks.length - 1 ? lastP : 0));
      const maxP = Math.max(...freq, ...theory, 0.05);
      const errs = theory.map((p, i) => Math.abs(freq[i] - p));
      const tv = theory.reduce((a, p, i) => a + Math.abs(freq[i] - p), 0) / 2;
      const simMean = d.ks.reduce((a, k, i) => a + k * freq[i], 0);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 28, padT = 48, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const n = d.ks.length;
        const slot = pw / n;
        const bw = Math.min(36, slot * 0.68);
        const Y = v => padT + ph - v / maxP * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('频率柱（实心）逼近概率柱（虚线框）：' + d.name + '，n = ' + trials, padL, padT - 14);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 7, y);
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        d.ks.forEach((k, i) => {
          const cx = padL + slot * (i + 0.5);
          const h = (padT + ph) - Y(theory[i]);
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, Y(theory[i]), bw, h, 3);
          ctx.setLineDash([4, 3]);
          ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.5; ctx.stroke();
          ctx.setLineDash([]);
          const fh = (padT + ph) - Y(freq[i]);
          if (fh > 0.4) {
            ctx.beginPath();
            D.roundRectPath(ctx, cx - bw / 2, Y(freq[i]), bw, fh, 3);
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.55); ctx.fill();
          }
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(k, cx, padT + ph + 6);
        });

        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('最大绝对偏差 = ' + Math.max(...errs).toFixed(4) + '　总变差 = ' + tv.toFixed(4) + '（n 越大越接近 0）', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['分布', d.name],
        ['理论 E(X)', f3(d.mean)],
        ['模拟样本均值', f3(simMean)],
        ['理论 D(X)', f3(d.varr)],
        ['最大频率误差', f4(Math.max(...errs))],
        ['总变差 ½Σ|频率−概率|', f4(tv)],
        ['说明', '频率依概率收敛到概率（伯努利大数定律）' + d.tail]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.3b 泊松流：到达间隔服从指数分布
     ================================================================ */
  W.poissonProcess = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 322);
    let lam = 2, Tend = 10, seed = 20260910;

    UI.slider(ctrl, { label: '强度 λ（次 / 单位时间）', min: 0.2, max: 6, step: 0.1, value: lam, fmt: v => v.toFixed(1), onInput: v => { lam = v; draw(); } });
    UI.slider(ctrl, { label: '观测时长 T', min: 4, max: 20, value: Tend, onInput: v => { Tend = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 8191 + 17);
      const arrivals = [];
      let t = 0, guard = 0;
      while (guard++ < 8000) {
        t += -Math.log(1 - Math.min(rand(), 1 - 1e-12)) / lam;
        if (t > Tend) break;
        arrivals.push(t);
      }
      const gaps = arrivals.map((v, i) => v - (i ? arrivals[i - 1] : 0));
      const meanGap = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
      const sdGap = gaps.length > 1 ? Math.sqrt(gaps.reduce((a, g) => a + (g - meanGap) * (g - meanGap), 0) / (gaps.length - 1)) : NaN;
      const bins = 18;
      const maxGap = gaps.length ? Math.max(...gaps) : 1 / lam;
      const hiGap = Math.max(1e-6, Math.min(maxGap, 3.2 / lam));
      const hist = new Array(bins).fill(0);
      gaps.forEach(g => { const b = Math.min(bins - 1, Math.floor(g / hiGap * bins)); hist[b]++; });
      const dens = hist.map(c => gaps.length ? c / gaps.length / (hiGap / bins) : 0);
      const maxD = Math.max(...dens, S.expon.pdf(0, lam), 1e-6);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26;
        const tlY = 40, tlH = 62;
        const X = v => padL + v / Tend * (W_ - padL - padR);
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('泊松流事件时刻（λ = ' + lam.toFixed(1) + '，T = ' + Tend + '）：间隔独立且同服从 E(λ)', padL, tlY - 12);

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(padL, tlY + tlH); ctx.lineTo(W_ - padR, tlY + tlH); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const v = Tend * i / 5;
          ctx.beginPath(); ctx.moveTo(X(v), tlY + tlH - 4); ctx.lineTo(X(v), tlY + tlH + 4);
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1; ctx.stroke();
          ctx.fillText(D.niceNum(v), X(v), tlY + tlH + 6);
        }
        arrivals.forEach(a => {
          ctx.beginPath();
          ctx.moveTo(X(a), tlY + tlH);
          ctx.lineTo(X(a), tlY + 16);
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.85); ctx.lineWidth = 1.4; ctx.stroke();
          ctx.beginPath(); ctx.arc(X(a), tlY + 16, 3, 0, D.TAU);
          ctx.fillStyle = C('--brand'); ctx.fill();
        });
        ctx.fillStyle = C('--brand'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText('到达 ' + arrivals.length + ' 次', W_ - padR, tlY + 8);

        const gx = padL, gw = W_ - padL - padR;
        const gy = 136, gh = H_ - gy - 46;
        const Yg = v => gy + gh - v / (maxD * 1.15) * gh;
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = gy + gh * i / 4;
          ctx.beginPath(); ctx.moveTo(gx, y + .5); ctx.lineTo(gx + gw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxD * 1.15 * (1 - i / 4)).toFixed(2), gx - 6, y);
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(gx, gy + gh + .5); ctx.lineTo(gx + gw, gy + gh + .5); ctx.stroke();

        const bx = v => gx + v / (hiGap * 1.06) * gw;
        dens.forEach((v, i) => {
          const x0 = bx(hiGap * i / bins), x1 = bx(hiGap * (i + 1) / bins);
          if (v <= 0) return;
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.5);
          ctx.fillRect(x0 + 0.5, Yg(v), Math.max(1, x1 - x0 - 1), (gy + gh) - Yg(v));
        });
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 240; i++) {
          const v = hiGap * 1.06 * i / 240;
          const y = S.expon.pdf(v, lam);
          if (!isFinite(y)) continue;
          if (!started) { ctx.moveTo(bx(v), Yg(y)); started = true; } else ctx.lineTo(bx(v), Yg(y));
        }
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.2; ctx.stroke();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('红线＝理论密度 λe^(−λx)，绿线＝平均间隔 1/λ', gx + 6, gy + 4);

        const mx = bx(1 / lam);
        if (mx <= gx + gw) {
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(mx, gy); ctx.lineTo(mx, gy + gh); ctx.stroke();
          ctx.restore();
        }

        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const v = hiGap * 1.06 * i / 5;
          ctx.fillText(v.toFixed(2), bx(v), gy + gh + 6);
        }
        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('到达间隔的分布（理论 E(λ) vs 模拟直方图）', gx + gw / 2, H_ - 8);
      });
      scene.static();

      const overMean = gaps.filter(g => g > 1 / lam).length / Math.max(1, gaps.length);
      UI.readout(out, [
        ['观测时长 T', Tend],
        ['到达次数 N', arrivals.length + '（理论 λT = ' + f3(lam * Tend) + '）'],
        ['平均间隔', f4(meanGap) + '（理论 1/λ = ' + f4(1 / lam) + '）'],
        ['间隔标准差', f4(sdGap) + '（理论 1/λ = ' + f4(1 / lam) + '）'],
        ['P{间隔 > 1/λ} 模拟 / 理论', f4(overMean) + ' / ' + f4(Math.exp(-1))],
        ['计数分布', 'N(T) ~ P(λT)，E = D = λT = ' + f3(lam * Tend)],
        ['要点', '间隔独立同分布于 E(λ) ⟺ 事件流是泊松流']
      ]);
    }
    draw();
  };

  /* ================================================================
     2.4b 密度与概率：面积 = F(x) 的联动
     ================================================================ */
  W.pdfArea = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -3.5, xMax: 3.5, yMin: 0, yMax: 0.48,
      xTicks: 7, yTicks: 4, xLabel: 'x', yLabel: 'f(x)', height: 302
    });
    let kind = 'normal', x = 0.6;

    const DISTS = {
      normal: { name: 'N(0,1)', lo: -3.5, hi: 3.5, top: 0.46, f: v => S.normal.pdf(v, 0, 1), F: v => S.normal.cdf(v, 0, 1) },
      expon: { name: 'E(1)', lo: -0.4, hi: 5, top: 1.1, f: v => S.expon.pdf(v, 1), F: v => S.expon.cdf(v, 1) },
      uniform: { name: 'U(0,1)', lo: -0.5, hi: 1.5, top: 1.2, f: v => S.uniform.pdf(v, 0, 1), F: v => S.uniform.cdf(v, 0, 1) }
    };
    const sX = UI.slider(ctrl, { label: 'x（拖动改变积分上界）', min: -3.5, max: 3.5, step: 0.02, value: x, fmt: v => v.toFixed(2), onInput: v => { x = v; draw(); } });
    UI.seg(ctrl, Object.keys(DISTS).map(k => ({ label: DISTS[k].name, value: k })), v => {
      kind = v;
      const d = DISTS[kind];
      sX.input.min = d.lo; sX.input.max = d.hi;
      x = D.clamp(x, d.lo, d.hi); sX.set(x);
      draw();
    }, 0);

    function draw() {
      const d = DISTS[kind];
      const a = Math.max(d.lo, x);
      plot.setDomain(d.lo, d.hi, 0, d.top);
      plot.clearLayers();
      plot.area(d.f, kind === 'expon' ? 0 : d.lo, a, { color: C('--brand'), alpha: 0.3 });
      plot.curve(d.f, { color: C('--brand'), width: 2.4 });
      plot.custom((p, ctx) => {
        const X = v => p.X(v), Y = v => p.Y(v);
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(x), p.py); ctx.lineTo(X(x), p.py + p.ph); ctx.stroke();
        ctx.restore();

        const fx = d.F(x);
        const ax = D.clamp(X(x) + 26, p.px + 8, p.px + p.pw - 16);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(ax, Y(0)); ctx.lineTo(ax, Y(fx * d.top)); ctx.stroke();
        [Y(0), Y(fx * d.top)].forEach(y => {
          ctx.beginPath(); ctx.moveTo(ax - 5, y); ctx.lineTo(ax + 5, y); ctx.stroke();
        });
        ctx.fillStyle = C('--green'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = ax > p.px + p.pw - 130 ? 'right' : 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('F(x) = ' + fx.toFixed(4), ax > p.px + p.pw - 130 ? ax - 8 : ax + 8, (Y(0) + Y(fx * d.top)) / 2);
        ctx.fillStyle = C('--accent'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('x = ' + x.toFixed(2), D.clamp(X(x), p.px + 30, p.px + p.pw - 30), p.py + 12);
      });
      plot.animate(320);

      const N = 800, a0 = kind === 'expon' ? 0 : d.lo;
      let num = 0;
      for (let i = 0; i < N; i++) num += d.f(a0 + (a - a0) * (i + 0.5) / N) * (a - a0) / N;

      UI.readout(out, [
        ['分布', d.name],
        ['f(x)', f4(d.f(x))],
        ['F(x)（理论）', f4(d.F(x))],
        ['左侧面积（数值积分）', f4(num)],
        ['面积与 F(x) 之差', f4(num - d.F(x))],
        ['结论', 'P{X ≤ x} = F(x) = 密度曲线下 x 左侧的面积']
      ]);
    }
    draw();
  };

  /* ================================================================
     2.5b 正态分布的 3σ 规则
     ================================================================ */
  W.normalThreeSigma = function (host) {
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -4.5, xMax: 4.5, yMin: 0, yMax: 0.46,
      xTicks: 9, yTicks: 4, xLabel: 'x', yLabel: 'f(x)', height: 306
    });
    let mu = 0, sg = 1, k = 3, trials = 20000;
    const sK = UI.slider(ctrl, { label: '倍数 k（区间 μ±kσ）', min: 0.5, max: 4, step: 0.5, value: k, fmt: v => v.toFixed(1), onInput: v => { k = v; draw(); } });

    UI.slider(ctrl, { label: 'μ', min: -2, max: 2, step: 0.1, value: mu, fmt: v => v.toFixed(1), onInput: v => { mu = v; draw(); } });
    UI.slider(ctrl, { label: 'σ', min: 0.4, max: 2.5, step: 0.05, value: sg, fmt: v => v.toFixed(2), onInput: v => { sg = v; draw(); } });
    UI.seg(ctrl, [{ label: '1σ', value: 1 }, { label: '2σ', value: 2 }, { label: '3σ', value: 3 }], v => { k = +v; sK.set(k); draw(); }, 2);

    function draw() {
      const T = D.Theme.cache;
      const lo = mu - k * sg, hi = mu + k * sg;
      const prob = S.normal.cdf(k, 0, 1) - S.normal.cdf(-k, 0, 1);
      const rand = S.rng(20260910 + Math.round(k * 10) + Math.round(sg * 100) + Math.round(mu * 10));
      let inside = 0;
      for (let i = 0; i < trials; i++) if (Math.abs(S.randn(rand)) <= k) inside++;
      const emp = inside / trials;
      const top = S.normal.pdf(mu, mu, sg) * 1.18;

      plot.setDomain(mu - 4.5 * sg, mu + 4.5 * sg, 0, top);
      plot.clearLayers();
      plot.area(v => S.normal.pdf(v, mu, sg), lo, hi, { color: C('--brand'), alpha: 0.34 });
      plot.curve(v => S.normal.pdf(v, mu, sg), { color: C('--brand'), width: 2.4 });
      plot.custom((p, ctx) => {
        const X = v => p.X(v), Y = v => p.Y(v);
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
        [lo, hi].forEach(v => { ctx.beginPath(); ctx.moveTo(X(v), p.py); ctx.lineTo(X(v), p.py + p.ph); ctx.stroke(); });
        ctx.strokeStyle = C('--accent');
        ctx.beginPath(); ctx.moveTo(X(mu), p.py); ctx.lineTo(X(mu), p.py + p.ph); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('μ−kσ', X(lo), p.py + 4);
        ctx.fillText('μ+kσ', X(hi), p.py + 17);
        ctx.fillStyle = C('--accent');
        ctx.fillText('μ', X(mu), p.py + 30);
        const yb = p.py + p.ph - 12;
        ctx.beginPath(); ctx.moveTo(X(mu - sg), yb); ctx.lineTo(X(mu + sg), yb);
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2; ctx.stroke();
        [mu - sg, mu, mu + sg].forEach(v => {
          ctx.beginPath(); ctx.moveTo(X(v), yb - 4); ctx.lineTo(X(v), yb + 4); ctx.stroke();
        });
        ctx.fillStyle = C('--purple'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('σ', X(mu + sg / 2), yb - 3);
      });
      plot.animate(360);

      UI.readout(out, [
        ['分布', 'N(' + mu.toFixed(1) + ', ' + (sg * sg).toFixed(3) + ')'],
        ['区间 μ ± kσ', '[' + f3(lo) + ', ' + f3(hi) + ']'],
        ['理论概率 2Φ(k)−1', f4(prob)],
        ['查表值 Φ(k)', f4(S.normal.cdf(k, 0, 1))],
        ['区间外概率', f4(1 - prob)],
        [trials + ' 次模拟落区间内比例', f4(emp)],
        ['经典对照', 'k=1 → 0.6827；k=2 → 0.9545；k=3 → 0.9973'],
        ['当前 k', k.toFixed(1) + 'σ' + (Math.abs(prob - 0.6827) < 5e-4 ? '（1σ ✓）' : Math.abs(prob - 0.9545) < 5e-4 ? '（2σ ✓）' : Math.abs(prob - 0.9973) < 5e-4 ? '（3σ ✓）' : '')]
      ]);
    }
    draw();
  };

  /* ================================================================
     2.6b 随机变量函数的分布：分布函数法 vs 公式法
     ================================================================ */
  W.transformMethod = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 322);
    let key = 'sq', y0 = 1.5;

    const MODELS = {
      sq: {
        name: 'Y = X²，X ~ N(0,1)',
        yRange: [0.1, 9], top: 1.35, yStart: 0.4,
        fX: x => S.normal.pdf(x, 0, 1),
        fY: y => y > 1e-9 ? S.normal.pdf(Math.sqrt(y), 0, 1) / Math.sqrt(y) : 0,
        FY: y => y <= 0 ? 0 : S.normal.cdf(Math.sqrt(y), 0, 1) - S.normal.cdf(-Math.sqrt(y), 0, 1),
        pre: y => y <= 0 ? null : [-Math.sqrt(y), Math.sqrt(y)],
        route: '分布函数法：F_Y(y) = P{X² ≤ y} = F_X(√y) − F_X(−√y)；公式法：f_Y(y) = f_X(√y)·|d√y/dy| + f_X(−√y)·|d(−√y)/dy| = f_X(√y)/√y'
      },
      exp: {
        name: 'Y = e^X（对数正态），X ~ N(0,1)',
        yRange: [0.08, 9], top: 1.05, yStart: 1,
        fX: x => S.normal.pdf(x, 0, 1),
        fY: y => y > 1e-9 ? S.normal.pdf(Math.log(y), 0, 1) / y : 0,
        FY: y => y <= 0 ? 0 : S.normal.cdf(Math.log(y), 0, 1),
        pre: y => y <= 0 ? null : [-4, Math.log(y)],
        route: '分布函数法：F_Y(y) = P{e^X ≤ y} = F_X(ln y)；公式法：f_Y(y) = f_X(ln y)·|d ln y/dy| = f_X(ln y)/y'
      },
      lin: {
        name: 'Y = 2X + 1，X ~ N(0,1)',
        yRange: [-4, 8], top: 0.24, yStart: 1,
        fX: x => S.normal.pdf(x, 0, 1),
        fY: y => S.normal.pdf((y - 1) / 2, 0, 1) / 2,
        FY: y => S.normal.cdf((y - 1) / 2, 0, 1),
        pre: y => [-4, (y - 1) / 2],
        route: '分布函数法：F_Y(y) = P{2X+1 ≤ y} = F_X((y−1)/2)；公式法：f_Y(y) = f_X((y−1)/2)·|1/2|'
      }
    };
    const sY = UI.slider(ctrl, { label: 'y₀（观察 P{Y ≤ y₀}）', min: 0.4, max: 9, step: 0.05, value: y0, fmt: v => v.toFixed(2), onInput: v => { y0 = v; draw(); } });
    UI.seg(ctrl, Object.keys(MODELS).map(k => ({ label: MODELS[k].name, value: k })), v => {
      key = v;
      const md = MODELS[key];
      sY.input.min = md.yRange[0]; sY.input.max = md.yRange[1];
      sY.input.step = (md.yRange[1] - md.yRange[0]) / 180;
      y0 = md.yStart; sY.set(y0);
      draw();
    }, 0);

    function draw() {
      const T = D.Theme.cache, md = MODELS[key];
      const yl = md.yRange[0], yh = md.yRange[1];
      const yc = D.clamp(y0, yl, yh);
      const pre = md.pre(yc);
      const fy = md.FY(yc);
      const base = md.FY(yl);
      let num = base;
      const N = 700;
      for (let i = 0; i < N; i++) num += md.fY(yl + (yc - yl) * (i + 0.5) / N) * (yc - yl) / N;
      const h = 1e-4;
      const deriv = (md.FY(yc + h) - md.FY(yc - h)) / (2 * h);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 44, padB = 40;
        const leftX = 40, panelGap = 54;
        const leftW = (W_ - leftX - panelGap - 40) * 0.46;
        const rightX = leftX + leftW + panelGap;
        const rightW = W_ - rightX - 36;
        const curveTop = padT + 16, curveBottom = H_ - padB - 16;
        const curveH = curveBottom - curveTop;
        const maxfX = 0.45;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('左：X 的密度与「映射回原像」的区间　　右：Y = g(X) 的密度与 F_Y 的面积', leftX, padT - 12);

        // ---- 左面板 ----
        const X1 = v => leftX + (v + 4) / 8 * leftW;
        const Y1 = v => curveBottom - v / maxfX * curveH;
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = curveTop + curveH * i / 4;
          ctx.beginPath(); ctx.moveTo(leftX, y + .5); ctx.lineTo(leftX + leftW, y + .5); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(leftX, curveBottom + .5); ctx.lineTo(leftX + leftW, curveBottom + .5); ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i <= 300; i++) {
          const v = -4 + 8 * i / 300;
          const y = Y1(md.fX(v));
          i ? ctx.lineTo(X1(v), y) : ctx.moveTo(X1(v), y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.2; ctx.stroke();
        if (pre && pre[0] < pre[1]) {
          const a = D.clamp(pre[0], -4, 4), b = D.clamp(pre[1], -4, 4);
          if (b > a) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(X1(a), curveTop, Math.max(0.6, X1(b) - X1(a)), curveH);
            ctx.clip();
            ctx.beginPath();
            for (let i = 0; i <= 200; i++) {
              const v = a + (b - a) * i / 200;
              const y = Y1(md.fX(v));
              i ? ctx.lineTo(X1(v), y) : ctx.moveTo(X1(v), y);
            }
            ctx.lineTo(X1(b), curveBottom); ctx.lineTo(X1(a), curveBottom); ctx.closePath();
            ctx.fillStyle = D.withAlpha(C('--accent'), 0.28); ctx.fill();
            ctx.restore();
          }
          ctx.fillStyle = C('--accent'); ctx.font = '700 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(pre[0] === -4 ? 'x ≤ ' + (pre[1] === Math.log(yc) ? 'ln y₀ = ' + pre[1].toFixed(3) : pre[1].toFixed(3))
            : 'x ∈ [' + pre[0].toFixed(3) + ', ' + pre[1].toFixed(3) + ']', leftX + leftW / 2, curveBottom + 22);
        }
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 4; i++) {
          const v = -4 + 8 * i / 4;
          ctx.fillText(D.niceNum(v), X1(v), curveBottom + 6);
        }
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('f_X(x)', leftX + 2, curveTop + 2);

        // ---- 右面板 ----
        const X2 = v => rightX + (v - yl) / (yh - yl) * rightW;
        const Y2 = v => curveBottom - D.clamp(v, 0, md.top) / md.top * curveH;
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = curveTop + curveH * i / 4;
          ctx.beginPath(); ctx.moveTo(rightX, y + .5); ctx.lineTo(rightX + rightW, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((md.top * (1 - i / 4)).toFixed(2), rightX - 6, y);
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(rightX, curveBottom + .5); ctx.lineTo(rightX + rightW, curveBottom + .5); ctx.stroke();

        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 400; i++) {
          const v = yl + (yh - yl) * i / 400;
          const y = md.fY(v);
          if (!isFinite(y)) continue;
          if (!started) { ctx.moveTo(X2(v), Y2(y)); started = true; } else ctx.lineTo(X2(v), Y2(y));
        }
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.2; ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.rect(X2(yl), curveTop, Math.max(0.6, X2(yc) - X2(yl)), curveH);
        ctx.clip();
        ctx.beginPath();
        ctx.moveTo(X2(yl), curveBottom);
        for (let i = 0; i <= 240; i++) {
          const v = yl + (yc - yl) * i / 240;
          const y = md.fY(v);
          if (!isFinite(y)) continue;
          ctx.lineTo(X2(v), Y2(y));
        }
        ctx.lineTo(X2(yc), curveBottom); ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--purple'), 0.28); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(X2(yc), curveTop); ctx.lineTo(X2(yc), curveBottom + 4); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--purple'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('y₀ = ' + yc.toFixed(2), D.clamp(X2(yc), rightX + 34, rightX + rightW - 34), curveBottom + 22);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        for (let i = 0; i <= 4; i++) {
          const v = yl + (yh - yl) * i / 4;
          ctx.fillText(D.niceNum(v), X2(v), curveBottom + 6);
        }
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('f_Y(y)', rightX + 2, curveTop + 2);

        ctx.fillStyle = C('--red'); ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        D.G.fitted(ctx, rightX, H_ - 8, '分布函数法 F_Y(y₀) = ' + fy.toFixed(4) + '　　公式法 ∫f_Y dy = ' + num.toFixed(4) + '　　两者之差 = ' + (num - fy).toExponential(1), rightX + rightW - 2, { size: 10.5, weight: 600, align: 'left', color: C('--red'), baseline: 'bottom' });
      });
      scene.animate(420);

      UI.readout(out, [
        ['函数', md.name],
        ['y₀', f4(y0)],
        ['分布函数法 F_Y(y₀)', f4(fy)],
        ['公式法（对 f_Y 数值积分）', f4(num)],
        ['两法之差', (num - fy).toExponential(2)],
        ['f_Y(y₀) 公式值 / 数值求导 dF_Y/dy', f4(md.fY(y0)) + ' / ' + f4(deriv)],
        ['路线', md.route]
      ]);
    }
    draw();
  };

})(window);
