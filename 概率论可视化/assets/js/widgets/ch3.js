/* ============================================================
   ch3.js (widgets) — 第三章 多维随机变量及其分布 可视化组件
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI;
  const { C, f2, f3, f4 } = UI;

  /* ---------- 二维正态密度 ---------- */
  function norm2pdf(x, y, m1, m2, s1, s2, r) {
    const z1 = (x - m1) / s1, z2 = (y - m2) / s2;
    const q = (z1 * z1 - 2 * r * z1 * z2 + z2 * z2) / (1 - r * r);
    return Math.exp(-q / 2) / (2 * Math.PI * s1 * s2 * Math.sqrt(1 - r * r));
  }

  /* ---------- 热力图绘制：把密度函数画成颜色深浅 ---------- */
  function heat(ctx, box, xMin, xMax, yMin, yMax, fn, color, opts) {
    opts = opts || {};
    const { x, y, w, h } = box;
    // 离屏渲染分辨率：上限提高到 512/360，避免放大时出现马赛克
    const iw = Math.max(60, Math.min(512, Math.round(w)));
    const ih = Math.max(50, Math.min(360, Math.round(h)));
    const off = document.createElement('canvas');
    off.width = iw; off.height = ih;
    const octx = off.getContext('2d');
    const img = octx.createImageData(iw, ih);

    const vals = new Float64Array(iw * ih);
    let maxV = 0;
    for (let j = 0; j < ih; j++) {
      const yy = yMax - (yMax - yMin) * (j + 0.5) / ih;
      for (let i = 0; i < iw; i++) {
        const xx = xMin + (xMax - xMin) * (i + 0.5) / iw;
        let v = fn(xx, yy);
        if (!isFinite(v) || v < 0) v = 0;
        vals[j * iw + i] = v;
        if (v > maxV) maxV = v;
      }
    }
    if (maxV <= 0) maxV = 1;
    const rgb = hex2rgb(color);
    for (let k = 0; k < vals.length; k++) {
      const t = vals[k] / maxV;
      const a = opts.gamma ? Math.pow(t, opts.gamma) : t;
      const p = k * 4;
      img.data[p] = rgb[0]; img.data[p + 1] = rgb[1]; img.data[p + 2] = rgb[2];
      img.data[p + 3] = Math.round(255 * (opts.alpha || 0.85) * Math.min(1, a));
    }
    // 用密度值染色 + 透明度
    octx.putImageData(img, 0, 0);
    ctx.save();
    ctx.beginPath();
    D.roundRectPath(ctx, x, y, w, h, 8);
    ctx.clip();
    // 底色
    ctx.fillStyle = C('--card-2');
    ctx.fillRect(x, y, w, h);
    ctx.drawImage(off, x, y, w, h);
    // 描网格
    if (opts.grid !== false) {
      ctx.strokeStyle = D.withAlpha(C('--line'), 0.55);
      ctx.lineWidth = 0.8;
      const g = opts.gridN || 8;
      for (let i = 1; i < g; i++) {
        const gx = x + w * i / g, gy = y + h * i / g;
        ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
    ctx.beginPath(); D.roundRectPath(ctx, x, y, w, h, 8); ctx.stroke();
    return { maxV, iw, ih };
  }

  function hex2rgb(hex) {
    let h = String(hex).trim();
    const m = h.match(/rgba?\(([^)]+)\)/);
    if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2]]; }
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  /* ---------- 坐标轴辅助 ---------- */
  function axes(ctx, box, xMin, xMax, yMin, yMax, xLabel, yLabel) {
    const T = D.Theme.cache;
    const { x, y, w, h } = box;
    ctx.save();
    ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
    ctx.beginPath();
    const Y0 = y + h - (0 - yMin) / (yMax - yMin) * h;
    const X0 = x + (0 - xMin) / (xMax - xMin) * w;
    if (Y0 >= y - 1 && Y0 <= y + h + 1) { ctx.moveTo(x, Y0 + .5); ctx.lineTo(x + w, Y0 + .5); }
    if (X0 >= x - 1 && X0 <= x + w + 1) { ctx.moveTo(X0 + .5, y); ctx.lineTo(X0 + .5, y + h); }
    ctx.stroke();
    // 刻度
    ctx.fillStyle = T['--ink-3'];
    ctx.font = '500 9.5px ' + D.FONT_MONO;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (let i = 0; i <= 4; i++) {
      const v = xMin + (xMax - xMin) * i / 4;
      ctx.fillText(D.niceNum(v), x + w * i / 4, y + h + 5);
    }
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const v = yMax - (yMax - yMin) * i / 4;
      ctx.fillText(D.niceNum(v), x - 5, y + h * i / 4);
    }
    if (xLabel) {
      ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      // 放在刻度行下方，避免与最后一个刻度标签重叠
      ctx.fillText(xLabel, x + w, y + h + 20);
    }
    if (yLabel) {
      ctx.save(); ctx.translate(x - 30, y);
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.font = '600 10.5px ' + D.FONT_SANS; ctx.fillText(yLabel, 0, 0); ctx.restore();
    }
    ctx.restore();
  }

  /* ================================================================
     3.1 联合分布函数与矩形概率
     ================================================================ */
  W.jointCdf = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let x1 = 0.6, x2 = 1.6, y1 = 0.5, y2 = 1.8;

    UI.slider(ctrl, { label: 'x₁', min: 0, max: 2.8, step: 0.05, value: x1, fmt: v => v.toFixed(2), onInput: v => { x1 = Math.min(v, x2 - 0.1); draw(); } });
    UI.slider(ctrl, { label: 'x₂', min: 0.2, max: 3, step: 0.05, value: x2, fmt: v => v.toFixed(2), onInput: v => { x2 = Math.max(v, x1 + 0.1); draw(); } });
    UI.slider(ctrl, { label: 'y₁', min: 0, max: 2.8, step: 0.05, value: y1, fmt: v => v.toFixed(2), onInput: v => { y1 = Math.min(v, y2 - 0.1); draw(); } });
    UI.slider(ctrl, { label: 'y₂', min: 0.2, max: 3, step: 0.05, value: y2, fmt: v => v.toFixed(2), onInput: v => { y2 = Math.max(v, y1 + 0.1); draw(); } });

    // 联合分布函数：F(x,y) = (1-e^{-x})(1-e^{-y})，x,y>0
    const F = (x, y) => (x > 0 ? 1 - Math.exp(-x) : 0) * (y > 0 ? 1 - Math.exp(-y) : 0);

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padR = 150, padT = 30, padB = 42;
        const plotW = W_ - padL - padR, plotH = H_ - padT - padB;
        const xMin = 0, xMax = 3, yMin = 0, yMax = 3;
        const X = v => padL + (v - xMin) / (xMax - xMin) * plotW;
        const Y = v => padT + plotH - (v - yMin) / (yMax - yMin) * plotH;

        const box = { x: padL, y: padT, w: plotW, h: plotH };
        // 底色 + F(x,y) 的热力渐变（越靠右上 F 越大）
        heat(ctx, box, xMin, xMax, yMin, yMax, F, C('--brand'),
          { gamma: 1, alpha: 0.46, grid: false });

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.55); ctx.lineWidth = 0.8;
        for (let i = 1; i < 6; i++) {
          const gx = padL + plotW * i / 6, gy = padT + plotH * i / 6;
          ctx.beginPath(); ctx.moveTo(gx, padT); ctx.lineTo(gx, padT + plotH); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + plotW, gy); ctx.stroke();
        }

        // 高亮矩形 [x1,x2]x[y1,y2]
        const rx = X(x1), ry = Y(y2), rw = X(x2) - X(x1), rh = Y(y1) - Y(y2);
        ctx.beginPath();
        D.roundRectPath(ctx, rx, ry, rw, rh, 4);
        ctx.fillStyle = D.withAlpha(C('--accent'), 0.28);
        ctx.fill();
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2; ctx.stroke();

        // 参考线（四条边界虚线）
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = D.withAlpha(C('--brand'), 0.65); ctx.lineWidth = 1.2;
        [x1, x2].forEach(v => { ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), padT + plotH); ctx.stroke(); });
        [y1, y2].forEach(v => { ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(padL + plotW, Y(v)); ctx.stroke(); });
        ctx.restore();

        // 四个顶点
        const corners = [
          [x2, y2, C('--green'), `F(x₂,y₂)`],
          [x1, y2, C('--red'), `F(x₁,y₂)`],
          [x2, y1, C('--red'), `F(x₂,y₁)`],
          [x1, y1, C('--green'), `F(x₁,y₁)`]
        ];
        corners.forEach(([cx, cy, col, lab]) => {
          ctx.beginPath(); ctx.arc(X(cx), Y(cy), 4.5, 0, D.TAU);
          ctx.fillStyle = col; ctx.fill();
          ctx.strokeStyle = T['--card']; ctx.lineWidth = 1.8; ctx.stroke();
        });

        // 轴标
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) ctx.fillText(D.niceNum(3 * i / 6), padL + plotW * i / 6, padT + plotH + 5);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        for (let i = 0; i <= 6; i++) ctx.fillText(D.niceNum(3 * (6 - i) / 6), padL - 5, padT + plotH * i / 6);
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillText('x', padL + plotW, padT + plotH + 20);
        ctx.save(); ctx.translate(padL - 30, padT); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText('y', 0, 0); ctx.restore();

        // 右侧公式分解
        const px = padL + plotW + 18;
        let py = padT + 8;
        const rows = [
          ['F(x₂,y₂)', F(x2, y2), C('--green'), '+'],
          ['F(x₁,y₂)', F(x1, y2), C('--red'), '−'],
          ['F(x₂,y₁)', F(x2, y1), C('--red'), '−'],
          ['F(x₁,y₁)', F(x1, y1), C('--green'), '+']
        ];
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        rows.forEach(([lab, v, col, sign]) => {
          ctx.font = '600 11px ' + D.FONT_MONO;
          ctx.fillStyle = col;
          ctx.fillText(sign, px, py);
          ctx.fillStyle = T['--ink-2'];
          ctx.font = '600 10.5px ' + D.FONT_MONO;
          ctx.fillText(lab, px + 12, py);
          ctx.fillStyle = col;
          ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.fillText(v.toFixed(4), px + 12, py + 15);
          py += 34;
        });
        py += 4;
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, py - 8); ctx.lineTo(W_ - 14, py - 8); ctx.stroke();
        const P = F(x2, y2) - F(x1, y2) - F(x2, y1) + F(x1, y1);
        ctx.fillStyle = T['--ink-2']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('P{x₁<X≤x₂,', px, py);
        ctx.fillText('  y₁<Y≤y₂}', px, py + 14);
        ctx.fillStyle = C('--accent'); ctx.font = '800 17px ' + D.FONT_MONO;
        ctx.fillText(P.toFixed(4), px, py + 34);

        // 左上角说明
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('联合分布函数 F(x,y) = (1−e^{−x})(1−e^{−y})', padL, 8);
      });
      scene.static();
      UI.readout(out, [
        ['F(x₂,y₂)', f4(F(x2, y2))],
        ['F(x₁,y₂)', f4(F(x1, y2))],
        ['F(x₂,y₁)', f4(F(x2, y1))],
        ['F(x₁,y₁)', f4(F(x1, y1))],
        ['P{矩形}', f4(F(x2, y2) - F(x1, y2) - F(x2, y1) + F(x1, y1))]
      ]);
    }
    draw();
  };

  /* ================================================================
     3.2 二维离散型
     ================================================================ */
  W.discrete2d = function (host) {
    const cases = {
      '独立（两枚骰子）': {
        name: '两枚独立骰子（各取 1–4 点）',
        xs: [1, 2, 3, 4], ys: [1, 2, 3, 4],
        p: (i, j) => 1 / 16,
        note: '每个格子概率相同，且 p_ij = p_i·p_·j，X 与 Y 独立'
      },
      '不放回摸球（不独立）': {
        name: '5 白 3 黑，无放回取 2 球',
        xs: [0, 1], ys: [0, 1],
        p: (i, j) => {
          // xs/ys 的 0/1 表示「该次是否取到白球」
          // 样本点总数 8×7 = 56：
          //   两次都黑 (3·2)/56 = 6/56；先黑后白 (3·5)/56 = 15/56
          //   先白后黑 (5·3)/56 = 15/56；两次都白 (5·4)/56 = 20/56
          const m = [[6, 15], [15, 20]][i][j];
          return m / 56;
        },
        note: 'X、Y 边缘分布相同（各 3/8、5/8），但联合 ≠ 边缘之积，故不独立'
      },
      '独立的两类缺陷': {
        name: '两台独立设备，各 1/4 故障率',
        xs: [0, 1], ys: [0, 1],
        p: (i, j) => (i === 1 ? 0.25 : 0.75) * (j === 1 ? 0.25 : 0.75),
        note: '由独立性构造：p_ij = p_i· · p_·j'
      }
    };
    let key = Object.keys(cases)[0];
    const { ctrl, out, scene } = UI.shell(host, 320);

    UI.seg(ctrl, Object.keys(cases).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 0);

    function draw() {
      const T = D.Theme.cache, cs = cases[key];
      const { xs, ys } = cs;
      const pij = xs.map((_, i) => ys.map((__, j) => cs.p(i, j)));
      const px = xs.map((_, i) => pij[i].reduce((a, b) => a + b, 0));
      const py = ys.map((_, j) => pij.reduce((a, r) => a + r[j], 0));
      const maxP = Math.max(...pij.flat());

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 58, padT = 46, padB = 40;
        const gridW = Math.min(W_ * 0.46, H_ * 0.72);
        const cellW = gridW / xs.length, cellH = Math.min(cellW, (H_ - padT - padB) / ys.length);

        // 标题
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('联合分布律热力图', padL, padT - 10);

        // 热力格
        xs.forEach((xv, i) => {
          ys.forEach((yv, j) => {
            const cx = padL + i * cellW, cy = padT + j * cellH;
            const t = pij[i][j] / maxP;
            ctx.beginPath();
            D.roundRectPath(ctx, cx + 1.5, cy + 1.5, cellW - 3, cellH - 3, 5);
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.1 + 0.72 * t);
            ctx.fill();
            ctx.strokeStyle = D.withAlpha(C('--brand'), 0.35 + 0.5 * t);
            ctx.lineWidth = 1; ctx.stroke();
            // 数值
            ctx.fillStyle = t > 0.55 ? '#fff' : T['--ink-2'];
            ctx.font = '700 11px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(f4(pij[i][j]), cx + cellW / 2, cy + cellH / 2 - 7);
            // p_i. * p_.j 对照
            ctx.font = '500 9.5px ' + D.FONT_MONO;
            ctx.fillStyle = t > 0.55 ? D.withAlpha('#ffffff', 0.85) : T['--ink-3'];
            ctx.fillText(f4(px[i] * py[j]), cx + cellW / 2, cy + cellH / 2 + 8);
          });
        });

        // 行列标签
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        xs.forEach((xv, i) => ctx.fillText(xv, padL + i * cellW + cellW / 2, padT - 24));
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_SANS;
        ctx.fillText('X 取值 →', padL + gridW / 2, padT - 40);
        ctx.save();
        ctx.translate(padL - 22, padT + ys.length * cellH / 2); ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillStyle = T['--ink-3']; ctx.fillText('Y 取值 →', 0, 0);
        ctx.restore();
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_MONO;
        ys.forEach((yv, j) => ctx.fillText(yv, padL - 8, padT + j * cellH + cellH / 2));

        // 右侧：边缘分布
        const rx0 = padL + gridW + Math.max(70, W_ * 0.08);
        const rw = W_ - rx0 - 22;
        let ry = padT;
        const maxEdge = Math.max(...px, ...py);

        function edgeBar(title, vals, labs, color) {
          ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText(title, rx0, ry);
          ry += 6;
          const bh = 16;
          vals.forEach((v, k) => {
            const bwid = Math.max(2, v / maxEdge * rw * 0.72);
            ctx.beginPath();
            D.roundRectPath(ctx, rx0, ry, bwid, bh, 4);
            ctx.fillStyle = D.withAlpha(C(color), 0.8);
            ctx.fill();
            ctx.fillStyle = T['--ink-2']; ctx.font = '700 10px ' + D.FONT_MONO;
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(f4(v), rx0 + bwid + 6, ry + bh / 2);
            ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_MONO;
            ctx.textAlign = 'right';
            ctx.fillText(labs[k], rx0 - 6, ry + bh / 2);
            ry += bh + 6;
          });
          ry += 14;
        }
        edgeBar('X 的边缘分布 pᵢ·', px, xs, '--brand');
        edgeBar('Y 的边缘分布 p·ⱼ', py, ys, '--green');

        // 独立性判定
        let indep = true;
        xs.forEach((_, i) => ys.forEach((__, j) => { if (Math.abs(pij[i][j] - px[i] * py[j]) > 1e-9) indep = false; }));
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '700 12px ' + D.FONT_SANS;
        ctx.fillStyle = indep ? C('--green') : C('--red');
        ctx.fillText(indep ? '✓ X 与 Y 相互独立' : '✗ X 与 Y 不独立', rx0, ry + 2);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10.5px ' + D.FONT_SANS;
        wrapText(ctx, cs.note, rx0, ry + 22, rw, 14);
      });
      scene.static();

      let indep = true;
      xs.forEach((_, i) => ys.forEach((__, j) => { if (Math.abs(pij[i][j] - px[i] * py[j]) > 1e-9) indep = false; }));
      UI.readout(out, [
        ['Σpᵢⱼ 检验', f4(pij.flat().reduce((a, b) => a + b, 0))],
        ['X 边缘和', f4(px.reduce((a, b) => a + b, 0))],
        ['Y 边缘和', f4(py.reduce((a, b) => a + b, 0))],
        ['独立性', indep ? '独立' : '不独立'],
        ['格子数', xs.length + '×' + ys.length]
      ]);
    }

    function wrapText(ctx, text, x, y, maxW, lh) {
      const chars = String(text).split('');
      let line = '', yy = y;
      chars.forEach(ch => {
        if (ctx.measureText(line + ch).width > maxW) { ctx.fillText(line, x, yy); line = ch; yy += lh; }
        else line += ch;
      });
      if (line) ctx.fillText(line, x, yy);
    }
    draw();
  };

  /* ================================================================
     3.3 二维连续型：联合密度与边缘密度
     ================================================================ */
  W.continuous2d = function (host) {
    const cases = {
      '矩形支撑集（独立）': {
        f: (x, y) => (x > 0 && x < 1 && y > 0 && y < 1) ? 4 * x * y : 0,
        fX: x => (x > 0 && x < 1) ? 2 * x : 0,
        fY: y => (y > 0 && y < 1) ? 2 * y : 0,
        dom: [-0.2, 1.3, -0.2, 1.3],
        rect: [0, 1, 0, 1],
        indep: true,
        desc: 'f(x,y)=4xy 在单位正方形上，可分离为 2x·2y，X⊥Y'
      },
      '三角形支撑集（不独立）': {
        // ∫₀¹∫₀ˣ 8xy dy dx = 4∫₀¹x³ dx = 1 ✓
        f: (x, y) => (x >= 0 && x <= 1 && y >= 0 && y <= x) ? 8 * x * y : 0,
        fX: x => (x >= 0 && x <= 1) ? 4 * x * x * x : 0,          // ∫₀ˣ 8xy dy = 4x³
        fY: y => (y >= 0 && y <= 1) ? 4 * y * (1 - y * y) : 0,    // ∫_y¹ 8xy dx = 4y(1−y²)
        dom: [-0.2, 1.3, -0.2, 1.3],
        tri: [[0, 0], [1, 0], [1, 1]],
        indep: false,
        desc: 'f(x,y)=8xy 在三角形 0≤y≤x≤1 上：密度可分离为 (8x)·y，但支撑集非矩形 ⟹ 仍不独立'
      },
      '指数型（独立）': {
        f: (x, y) => (x > 0 && y > 0) ? Math.exp(-(x + y)) : 0,
        fX: x => x > 0 ? Math.exp(-x) : 0,
        fY: y => y > 0 ? Math.exp(-y) : 0,
        dom: [-0.3, 3, -0.3, 3],
        quad: true,
        indep: true,
        desc: 'f(x,y)=e^{−(x+y)} 在第一象限，支撑集是「无限矩形」象限 ⟹ 独立'
      }
    };
    let key = Object.keys(cases)[0];
    const { ctrl, out, scene } = UI.shell(host, 380);

    UI.seg(ctrl, Object.keys(cases).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 0);

    function draw() {
      const T = D.Theme.cache, cs = cases[key];
      const [xMin, xMax, yMin, yMax] = cs.dom;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        // jointplot 式布局：主图正方形 + 右侧 f_Y（竖向）+ 下方 f_X（横向）
        const padL = 52, padT = 42, padB = 30, padR = 30;
        const rightW = 122, bottomH = 86, gap = 24;
        const availW = W_ - padL - rightW - padR - gap;
        const availH = H_ - padT - bottomH - padB - gap;
        const side = Math.max(96, Math.min(availW, availH));
        const box = { x: padL, y: padT, w: side, h: side };
        const X = v => box.x + (v - xMin) / (xMax - xMin) * box.w;
        const Y = v => box.y + box.h - (v - yMin) / (yMax - yMin) * box.h;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('联合密度 f(x,y)　—　右侧与下方为边缘密度', padL, padT - 12);

        heat(ctx, box, xMin, xMax, yMin, yMax, cs.f, C('--brand'), { gamma: 0.75 });

        // 支撑集轮廓
        if (cs.rect) {
          ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2;
          ctx.strokeRect(X(cs.rect[0]), Y(cs.rect[3]), X(cs.rect[1]) - X(cs.rect[0]), Y(cs.rect[2]) - Y(cs.rect[3]));
        }
        if (cs.tri) {
          ctx.beginPath();
          cs.tri.forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])));
          ctx.closePath();
          ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2.2; ctx.stroke();
        }
        if (cs.quad) {
          ctx.save();
          ctx.setLineDash([6, 4]);
          ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(X(0), Y(yMax)); ctx.lineTo(X(0), Y(0)); ctx.lineTo(X(xMax), Y(0)); ctx.stroke();
          ctx.restore();
        }

        axes(ctx, box, xMin, xMax, yMin, yMax, 'x', 'y');

        // 右侧：f_Y(y)，纵坐标与主图 y 轴对齐
        const ey = { x: padL + side + gap, y: padT, w: rightW, h: side };
        ctx.fillStyle = T['--card-2'];
        ctx.beginPath(); D.roundRectPath(ctx, ey.x, ey.y, ey.w, ey.h, 6); ctx.fill();
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1; ctx.stroke();
        let maxfY = 0;
        for (let i = 0; i <= 200; i++) maxfY = Math.max(maxfY, cs.fY(yMin + (yMax - yMin) * i / 200));
        maxfY = maxfY || 1;
        ctx.beginPath();
        ctx.moveTo(ey.x, Y(yMax));
        for (let i = 0; i <= 200; i++) {
          const v = yMin + (yMax - yMin) * i / 200;
          ctx.lineTo(ey.x + cs.fY(v) / maxfY * (ey.w - 8), Y(v));
        }
        ctx.lineTo(ey.x, Y(yMin));
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--purple'), 0.26); ctx.fill();
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = C('--purple'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('f_Y(y)', ey.x + 5, ey.y + 3);

        // 下方：f_X(x)，横坐标与主图 x 轴对齐
        const ex = { x: padL, y: padT + side + gap, w: side, h: bottomH };
        ctx.fillStyle = T['--card-2'];
        ctx.beginPath(); D.roundRectPath(ctx, ex.x, ex.y, ex.w, ex.h, 6); ctx.fill();
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1; ctx.stroke();
        let maxfX = 0;
        for (let i = 0; i <= 200; i++) maxfX = Math.max(maxfX, cs.fX(xMin + (xMax - xMin) * i / 200));
        maxfX = maxfX || 1;
        ctx.beginPath();
        ctx.moveTo(ex.x, ex.y + ex.h);
        for (let i = 0; i <= 200; i++) {
          const v = xMin + (xMax - xMin) * i / 200;
          ctx.lineTo(ex.x + ex.w * i / 200, ex.y + ex.h - cs.fX(v) / maxfX * (ex.h - 8));
        }
        ctx.lineTo(ex.x + ex.w, ex.y + ex.h);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--green'), 0.3); ctx.fill();
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('f_X(x) = ∫ f(x,y) dy', ex.x + 6, ex.y - 3);
        // x 刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 4; i++) ctx.fillText(D.niceNum(xMin + (xMax - xMin) * i / 4), ex.x + ex.w * i / 4, ex.y + ex.h + 4);

        // 结论（左下）
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '700 12px ' + D.FONT_SANS;
        ctx.fillStyle = cs.indep ? C('--green') : C('--red');
        ctx.fillText(cs.indep ? '✓ X 与 Y 独立' : '✗ X 与 Y 不独立（支撑集非矩形）', padL, H_ - 4);
        // 右侧空白处放一句提示
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        ctx.fillText('边缘密度 = 沿另一方向积分', ey.x, ex.y + ex.h);
      });
      scene.static();

      UI.readout(out, [
        ['独立性', cs.indep ? '独立' : '不独立'],
        ['情形', cs.desc],
        ['f_X 峰值', f3(Math.max(...Array.from({ length: 100 }, (_, i) => cs.fX(xMin + (xMax - xMin) * i / 99))))],
        ['f_Y 峰值', f3(Math.max(...Array.from({ length: 100 }, (_, i) => cs.fY(yMin + (yMax - yMin) * i / 99))))]
      ]);
    }
    draw();
  };

  /* ================================================================
     3.4 独立性：支撑集形状决定成败
     ================================================================ */
  W.independence2d = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    // 支撑集 = {0≤x≤1, 0≤y≤min(1, kx)}：k≤1 为三角形，k>1 为梯形；两者都含斜边 → 均不独立
    let t = 1;

    UI.slider(ctrl, {
      label: '支撑集上界 y ≤ k·x 的 k', min: 0.3, max: 3, step: 0.05, value: t,
      fmt: v => v.toFixed(2),
      onInput: v => { t = v; draw(); }
    });

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 40, padB = 48, padL = 44, padR = 20;
        const gap = 26;
        const w1 = (W_ - padL - padR - gap) / 2;
        const hAll = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('情形对比：支撑集形状 = 独立性的判据', padL, padT - 10);

        // 左：矩形支撑集
        const b1 = { x: padL, y: padT, w: w1, h: hAll };
        heat(ctx, b1, -0.15, 1.15, -0.15, 1.15, (x, y) => (x > 0 && x < 1 && y > 0 && y < 1) ? 4 * x * y : 0, C('--brand'), { gamma: 0.75, grid: true, gridN: 6 });
        ctx.save();
        const X1 = v => b1.x + (v + 0.15) / 1.3 * b1.w, Y1 = v => b1.y + b1.h - (v + 0.15) / 1.3 * b1.h;
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 2.4;
        ctx.strokeRect(X1(0), Y1(1), X1(1) - X1(0), Y1(0) - Y1(1));
        ctx.restore();
        ctx.fillStyle = C('--green'); ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('矩形支撑集 → 独立', b1.x + w1 / 2, padT - 12);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('f = 2x · 2y 可分离', b1.x + w1 / 2, padT + hAll + 6);

        // 右：参数化支撑集 0 ≤ y ≤ kx
        const b2 = { x: padL + w1 + gap, y: padT, w: w1, h: hAll };
        const k = t;
        heat(ctx, b2, -0.15, 1.15, -0.15, 1.15, (x, y) => {
          if (x < 0 || x > 1) return 0;
          const hi = Math.min(1, k * x);
          return (y >= 0 && y <= hi) ? 1 : 0;
        }, C('--accent'), { gamma: 1, grid: true, gridN: 6, alpha: 0.7 });
        ctx.save();
        const X2 = v => b2.x + (v + 0.15) / 1.3 * b2.w, Y2 = v => b2.y + b2.h - (v + 0.15) / 1.3 * b2.h;
        ctx.beginPath();
        ctx.moveTo(X2(0), Y2(0));
        ctx.lineTo(X2(1), Y2(0));
        ctx.lineTo(X2(1), Y2(Math.min(1, k * 1)));
        ctx.lineTo(X2(Math.min(1, 1 / k)), Y2(1));
        ctx.closePath();
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.4; ctx.stroke();
        ctx.restore();
        // 支撑集 = {0≤x≤1, 0≤y≤min(1, kx)}：k≤1 为三角形，k>1 为梯形
        // 只要上界随 x 变化（含斜边）就不是矩形 → 不独立
        const shapeName = k <= 1 ? '三角形' : '梯形';
        ctx.fillStyle = C('--red');
        ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('k = ' + k.toFixed(2) + '：支撑集为' + shapeName + ' → 不独立', b2.x + w1 / 2, padT - 12);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('f ∝ 1 在 0 ≤ y ≤ min(1, kx) 上（上界含斜边）', b2.x + w1 / 2, padT + hAll + 6);

        // 底部判据
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = T['--ink-2']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.fillText('判据：非零区域必须是「矩形/象限」型（边界为常数），且 f 可分解为 g(x)·h(y)', padL, H_ - 8);
      });
      scene.static();
      UI.readout(out, [
        ['左：支撑集', '矩形 [0,1]×[0,1]'],
        ['左：独立性', '独立'],
        ['右：k =', f2(t)],
        ['右：支撑集', t <= 1 ? '三角形' : '梯形'],
        ['右：独立性', '不独立（上界含斜边）']
      ]);
    }
    draw();
  };

  /* ================================================================
     3.5a 二维均匀分布
     ================================================================ */
  W.uniform2d = function (host) {
    const shapes = {
      '矩形 [0,3]×[0,2]': { kind: 'rect', area: 6, f: 1 / 6 },
      '三角形 0≤y≤x≤2': { kind: 'tri', area: 2, f: 1 / 2 },
      '圆 x²+y²≤4': { kind: 'circle', area: 4 * Math.PI, f: 1 / (4 * Math.PI) }
    };
    let key = Object.keys(shapes)[0];
    let a = 0.8, b = 1.6;   // 子区域 x ∈ [a,b]（矩形/三角形用），圆用半径比例

    const { ctrl, out, scene } = UI.shell(host, 320);
    UI.seg(ctrl, Object.keys(shapes).map(k => ({ label: k, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '子区域下界', min: 0, max: 2.6, step: 0.05, value: a, fmt: v => v.toFixed(2), onInput: v => { a = Math.min(v, b - 0.1); draw(); } });
    UI.slider(ctrl, { label: '子区域上界', min: 0.2, max: 2.8, step: 0.05, value: b, fmt: v => v.toFixed(2), onInput: v => { b = Math.max(v, a + 0.1); draw(); } });

    /** 子区域 G（统一取竖直条带 x∈[a,b] 与 D 的交）的面积 */
    function subArea(kind) {
      if (kind === 'rect') return (b - a) * 2;      // 子矩形 x∈[a,b], y∈[0,2]
      if (kind === 'tri') {
        // 求 0≤y≤x≤2 且 a≤x≤b 的梯形面积
        const area = x => 0.5 * x * x;
        return area(Math.min(b, 2)) - area(Math.min(a, 2));
      }
      if (kind === 'circle') {
        // x∈[a,b] 的竖直条带与圆 x²+y²≤4 的交面积
        // ∫2√(R²−x²)dx = x√(R²−x²) + R²·asin(x/R)，其中 R=2
        const circSeg = (x0, x1) => {
          const F = x => x * Math.sqrt(Math.max(0, 4 - x * x)) + 4 * Math.asin(Math.min(1, Math.max(-1, x / 2)));
          return F(Math.min(x1, 2)) - F(Math.max(x0, -2));
        };
        return Math.max(0, circSeg(a, b));
      }
      return 0;
    }

    function draw() {
      const T = D.Theme.cache, sh = shapes[key];
      const xMin = -2.6, xMax = 3.2, yMin = -2.4, yMax = 2.6;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 44, padR = Math.max(150, Math.round(W_ * 0.17)), padT = 34, padB = 40;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const box = { x: padL, y: padT, w: pw, h: ph };
        const X = v => padL + (v - xMin) / (xMax - xMin) * pw;
        const Y = v => padT + ph - (v - yMin) / (yMax - yMin) * ph;

        // 背景网格
        ctx.fillStyle = T['--card-2'];
        ctx.beginPath(); D.roundRectPath(ctx, box.x, box.y, box.w, box.h, 8); ctx.fill();
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.8); ctx.lineWidth = 0.8;
        for (let i = 1; i < 8; i++) {
          const gx = padL + pw * i / 8, gy = padT + ph * i / 8;
          ctx.beginPath(); ctx.moveTo(gx, padT); ctx.lineTo(gx, padT + ph); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + pw, gy); ctx.stroke();
        }

        // 区域 D
        ctx.beginPath();
        if (sh.kind === 'rect') {
          ctx.rect(X(0), Y(2), X(3) - X(0), Y(0) - Y(2));
        } else if (sh.kind === 'tri') {
          ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(2), Y(0)); ctx.lineTo(X(2), Y(2)); ctx.closePath();
        } else {
          ctx.arc(X(0), Y(0), X(2) - X(0), 0, D.TAU);
        }
        ctx.fillStyle = D.withAlpha(C('--brand'), 0.2);
        ctx.fill();
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2; ctx.stroke();

        // 子区域 G：x ∈ [a,b] 与 D 的交
        ctx.save();
        ctx.beginPath();
        if (sh.kind === 'rect') ctx.rect(X(0), Y(2), X(3) - X(0), Y(0) - Y(2));
        else if (sh.kind === 'tri') { ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(2), Y(0)); ctx.lineTo(X(2), Y(2)); ctx.closePath(); }
        else ctx.arc(X(0), Y(0), X(2) - X(0), 0, D.TAU);
        ctx.clip();
        ctx.fillStyle = D.withAlpha(C('--accent'), 0.42);
        ctx.fillRect(X(a), Y(yMax), X(b) - X(a), Y(yMin) - Y(yMax));
        ctx.restore();
        // 竖直边界
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(X(a), Y(yMax)); ctx.lineTo(X(a), Y(yMin)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(b), Y(yMax)); ctx.lineTo(X(b), Y(yMin)); ctx.stroke();
        ctx.restore();

        axes(ctx, box, xMin, xMax, yMin, yMax, 'x', 'y');

        // 右侧说明
        const rx = padL + pw + 20;
        let ry = padT + 6;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillText('二维均匀分布 U(D)', rx, ry); ry += 22;
        const sg = subArea(sh.kind);
        const rows = [
          ['D 的面积 S_D', f3(sh.area)],
          ['密度 1/S_D', f4(sh.f)],
          ['G 的面积 S_G', f3(sg)],
          ['P{(X,Y)∈G}', f4(sg / sh.area)]
        ];
        rows.forEach(([k, v], i) => {
          ctx.font = '600 11px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-3'];
          ctx.fillText(k, rx, ry);
          ctx.font = i === 3 ? '800 20px ' + D.FONT_MONO : '700 13px ' + D.FONT_MONO;
          ctx.fillStyle = i === 3 ? C('--accent') : T['--ink'];
          ctx.fillText(v, rx, ry + 15);
          ry += i === 3 ? 30 : 40;
        });
        ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        wrap(ctx, '概率 = 面积比 S_G / S_D', rx, ry + 6, padR - 26);
      });
      scene.static();
      const sg = subArea(sh.kind);
      UI.readout(out, [
        ['区域', key],
        ['S_D', f3(sh.area)],
        ['S_G', f3(sg)],
        ['P = S_G/S_D', f4(sg / sh.area)]
      ]);
    }

    function wrap(ctx, text, x, y, maxW) {
      let line = '', yy = y;
      String(text).split('').forEach(ch => {
        if (ctx.measureText(line + ch).width > maxW) { ctx.fillText(line, x, yy); line = ch; yy += 13; }
        else line += ch;
      });
      if (line) ctx.fillText(line, x, yy);
    }
    draw();
  };

  /* ================================================================
     3.5b 二维正态分布
     ================================================================ */
  W.normal2d = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 340);
    let rho = 0.6, s1 = 1, s2 = 1.4;

    UI.slider(ctrl, { label: '相关系数 ρ', min: -0.95, max: 0.95, step: 0.05, value: rho, fmt: v => v.toFixed(2), onInput: v => { rho = v; draw(); } });
    UI.slider(ctrl, { label: 'σ₁', min: 0.5, max: 2.5, step: 0.1, value: s1, fmt: v => v.toFixed(1), onInput: v => { s1 = v; draw(); } });
    UI.slider(ctrl, { label: 'σ₂', min: 0.5, max: 2.5, step: 0.1, value: s2, fmt: v => v.toFixed(1), onInput: v => { s2 = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const m1 = 0, m2 = 0;
      const R = 3.2;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padR = 168, padT = 36, padB = 40;
        const w1 = W_ - padL - padR, hAll = H_ - padT - padB;
        const box = { x: padL, y: padT, w: w1, h: hAll };

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('二维正态密度 f(x,y) 的等高线（热力）', padL, padT - 10);

        heat(ctx, box, -R, R, -R, R, (x, y) => norm2pdf(x, y, m1, m2, s1, s2, rho), C('--purple'), { gamma: 0.85, gridN: 6 });

        const X = v => box.x + (v + R) / (2 * R) * box.w;
        const Y = v => box.y + box.h - (v + R) / (2 * R) * box.h;

        // 1σ / 2σ 等高线椭圆（解析）：二次型 (z1² − 2ρz1z2 + z2²)/(1−ρ²) = c
        // 取 z1 = √c·a，z2 = √c·(ρa + √(1−ρ²)·b)，代入后二次型 = c(1−ρ²) ✓
        ctx.save();
        [1, 2].forEach((lv, idx) => {
          const c = lv * lv;
          const K = Math.sqrt(c);
          ctx.beginPath();
          let started = false;
          for (let th = 0; th <= 360; th += 2) {
            const t2 = th * Math.PI / 180;
            const a = Math.cos(t2), b = Math.sin(t2);
            const z1 = K * a;
            const z2 = K * (rho * a + Math.sqrt(1 - rho * rho) * b);
            const xx = m1 + s1 * z1, yy = m2 + s2 * z2;
            if (!started) { ctx.moveTo(X(xx), Y(yy)); started = true; } else ctx.lineTo(X(xx), Y(yy));
          }
          ctx.closePath();
          ctx.setLineDash(idx === 0 ? [] : [6, 4]);
          ctx.strokeStyle = idx === 0 ? C('--accent') : D.withAlpha(C('--accent'), 0.7);
          ctx.lineWidth = idx === 0 ? 2 : 1.5;
          ctx.stroke();
        });
        ctx.restore();

        // 主轴方向线
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = D.withAlpha(C('--brand'), 0.8); ctx.lineWidth = 1.4;
        // 主轴方向由协方差矩阵特征向量给出
        const vxx = s1 * s1, vyy = s2 * s2, vxy = rho * s1 * s2;
        const tr = vxx + vyy, det = vxx * vyy - vxy * vxy;
        const lam1 = tr / 2 + Math.sqrt(Math.max(0, tr * tr / 4 - det));
        // 特征向量 (vxy, lam1 - vxx)
        let ex = vxy, ey = lam1 - vxx;
        if (Math.abs(vxy) < 1e-6) { ex = 1; ey = 0; }
        const nrm = Math.hypot(ex, ey); ex /= nrm; ey /= nrm;
        const L = 2.6;
        ctx.beginPath(); ctx.moveTo(X(-ex * L), Y(-ey * L)); ctx.lineTo(X(ex * L), Y(ey * L)); ctx.stroke();
        ctx.restore();

        axes(ctx, box, -R, R, -R, R, 'x', 'y');

        // 右侧参数说明
        const rx = padL + w1 + 18;
        let ry = padT + 4;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillText('参数概率意义', rx, ry); ry += 20;
        const rows = [
          ['μ₁ = 0', 'E(X)'],
          ['μ₂ = 0', 'E(Y)'],
          ['σ₁ = ' + s1.toFixed(1), '√D(X)'],
          ['σ₂ = ' + s2.toFixed(1), '√D(Y)'],
          ['ρ = ' + rho.toFixed(2), '相关系数']
        ];
        rows.forEach(([a, b]) => {
          ctx.font = '700 11.5px ' + D.FONT_MONO;
          ctx.fillStyle = T['--ink'];
          ctx.fillText(a, rx, ry);
          ctx.font = '500 10px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-3'];
          ctx.fillText(b, rx + 78, ry + 1);
          ry += 21;
        });
        ry += 8;
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillStyle = Math.abs(rho) < 0.02 ? C('--green') : C('--accent');
        ctx.fillText(Math.abs(rho) < 0.02 ? 'ρ = 0 ⟹ X ⊥ Y（独立）' : 'ρ ≠ 0 ⟹ X 与 Y 相关', rx, ry);
        ry += 20;
        ctx.font = '500 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        ctx.fillText('椭圆倾斜方向 = 相关性方向', rx, ry); ry += 14;
        ctx.fillText('椭圆越扁 = |ρ| 越大', rx, ry);
      });
      scene.static();
      UI.readout(out, [
        ['ρ', f2(rho)],
        ['σ₁², σ₂²', f2(s1 * s1) + ', ' + f2(s2 * s2)],
        ['独立性', Math.abs(rho) < 0.02 ? '独立（ρ=0）' : '不独立'],
        ['D(X+Y)', f3(s1 * s1 + s2 * s2 + 2 * rho * s1 * s2)],
        ['E(X+Y)', '0']
      ]);
    }
    draw();
  };

  /* ================================================================
     3.6a 卷积：两个均匀分布之和
     ================================================================ */
  W.convSum = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 330);
    let z = 1.0;

    UI.slider(ctrl, { label: 'z 值', min: 0, max: 2, step: 0.02, value: z, fmt: v => v.toFixed(2), onInput: v => { z = v; draw(); } });

    // Z = X + Y 的密度（两个 U(0,1) 之和 → 三角形分布）
    function fZ(zz) {
      if (zz < 0 || zz > 2) return 0;
      return zz < 1 ? zz : 2 - zz;
    }

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 44, padR = 24, padT = 30;
        const hTop = 96, hBot = 120, gap = 30, padB = 40;
        const pw = W_ - padL - padR;

        // 上方：fX 与 fY（两个矩形，展开在 x 与 z-x）
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('两个 U(0,1) 的密度（f_X 与 f_Y）', padL, padT - 8);
        const topY = padT + hTop;
        const cand = 2.4;
        const XT = v => padL + (v + 0.2) / (cand + 0.2) * pw;
        // f_X 矩形（0..1 高 1）
        ctx.beginPath();
        ctx.rect(XT(0), topY - (hTop - 20), XT(1) - XT(0), hTop - 20);
        ctx.fillStyle = D.withAlpha(C('--brand'), 0.35); ctx.fill();
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = C('--brand'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('f_X(x)', (XT(0) + XT(1)) / 2, topY - (hTop - 20) - 4);

        // f_Y(z-x) 关于 x 的镜像矩形：x ∈ [z-1, z]
        const a2 = Math.max(0, z - 1), b2 = Math.min(1, z);
        if (b2 > a2) {
          ctx.beginPath();
          ctx.rect(XT(a2), topY - (hTop - 20), XT(b2) - XT(a2), hTop - 20);
          ctx.fillStyle = D.withAlpha(C('--green'), 0.4); ctx.fill();
          ctx.strokeStyle = C('--green'); ctx.lineWidth = 2; ctx.stroke();
          // 重叠区域
          ctx.beginPath();
          ctx.rect(XT(a2), topY - (hTop - 20), XT(b2) - XT(a2), hTop - 20);
          ctx.fillStyle = D.withAlpha(C('--accent'), 0.28); ctx.fill();
        }
        ctx.fillStyle = C('--green'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('f_Y(z−x)', XT(Math.min(2.2, z)) + 6, topY - (hTop - 20) + 4);

        // x 轴
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, topY + .5); ctx.lineTo(padL + pw, topY + .5); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = -0.2 + (cand + 0.2) * i / 6;
          ctx.fillText(D.niceNum(v), padL + pw * i / 6, topY + 5);
        }

        // 下方：fZ
        const botY0 = topY + gap + 12;
        const botY1 = H_ - padB;
        const bh = botY1 - botY0;
        const XB = v => padL + (v + 0.2) / (cand + 0.2) * pw;
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('卷积结果 f_Z(z) —— 三角形分布', padL, botY0 - 14);

        // 曲线
        ctx.beginPath();
        ctx.moveTo(XB(-0.2), botY1);
        for (let i = 0; i <= 260; i++) {
          const v = -0.2 + (cand + 0.2) * i / 260;
          ctx.lineTo(XB(v), botY1 - fZ(v) / 1.0 * (bh - 14));
        }
        ctx.lineTo(XB(cand), botY1);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--purple'), 0.28); ctx.fill();
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 2.2; ctx.stroke();

        // z 竖线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(XB(z), botY0 - 8); ctx.lineTo(XB(z), botY1); ctx.stroke();
        ctx.restore();
        ctx.beginPath(); ctx.arc(XB(z), botY1 - fZ(z) / 1.0 * (bh - 14), 4.5, 0, D.TAU);
        ctx.fillStyle = C('--accent'); ctx.fill();
        ctx.strokeStyle = T['--card']; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.fillStyle = C('--accent'); ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('f_Z=' + fZ(z).toFixed(2), XB(z), botY1 - fZ(z) / 1.0 * (bh - 14) - 8);

        // z 轴
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, botY1 + .5); ctx.lineTo(padL + pw, botY1 + .5); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 6; i++) {
          const v = -0.2 + (cand + 0.2) * i / 6;
          ctx.fillText(D.niceNum(v), padL + pw * i / 6, botY1 + 5);
        }
      });
      scene.static();
      UI.readout(out, [
        ['z', f2(z)],
        ['f_Z(z)', f3(fZ(z))],
        ['重叠区间', (Math.max(0, z - 1)).toFixed(2) + ' ≤ x ≤ ' + (Math.min(1, z)).toFixed(2)],
        ['公式', z < 1 ? 'f_Z(z) = z' : (z <= 2 ? 'f_Z(z) = 2 − z' : 'f_Z(z) = 0')]
      ]);
    }
    draw();
  };

  /* ================================================================
     3.6b max / min 分布
     ================================================================ */
  W.maxMin = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let n = 4, mode = 'uniform';

    UI.slider(ctrl, { label: '个数 n', min: 1, max: 10, value: n, onInput: v => { n = v; draw(); } });
    UI.seg(ctrl, [
      { label: 'U(0,1)', value: 'uniform' },
      { label: 'E(1)', value: 'expo' }
    ], v => { mode = v; draw(); }, 0);

    // 依赖 mode 的定义必须在 draw() 内取，否则切换分布时曲线不更新
    function getDist() {
      if (mode === 'uniform') {
        return {
          name: 'U(0,1)',
          F: x => x <= 0 ? 0 : (x >= 1 ? 1 : x),
          xMax: 1.0,
          // E(max) = n/(n+1)，E(min) = 1/(n+1)
          eMax: nn => nn / (nn + 1),
          eMin: nn => 1 / (nn + 1)
        };
      }
      return {
        name: 'E(1)',
        F: x => x <= 0 ? 0 : 1 - Math.exp(-x),
        xMax: 4.0,
        // E(max) = H_n（调和数），E(min) = 1/n
        eMax: nn => { let s = 0; for (let k = 1; k <= nn; k++) s += 1 / k; return s; },
        eMin: nn => 1 / nn
      };
    }

    function draw() {
      const T = D.Theme.cache;
      const dist = getDist();
      const F = dist.F, xMax = dist.xMax;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 48, padR = 24, padT = 40, padB = 44;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = v => padL + v / xMax * pw;
        const Y = v => padT + ph - v * ph;

        // 网格
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const y = padT + ph * i / 5;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + pw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((1 - i / 5).toFixed(1), padL - 6, y);
        }
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(padL + pw, padT + ph + .5); ctx.stroke();

        // 三条曲线：原始 F、最大值分布、最小值分布
        const curve = (fn, color, width, dash) => {
          ctx.beginPath();
          for (let i = 0; i <= 300; i++) {
            const x = xMax * i / 300;
            const y = fn(x);
            i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y));
          }
          ctx.strokeStyle = color; ctx.lineWidth = width;
          if (dash) ctx.setLineDash(dash);
          ctx.stroke(); ctx.setLineDash([]);
        };

        curve(F, D.withAlpha(C('--line-2'), 1), 2, [6, 4]);
        curve(x => Math.pow(F(x), n), C('--accent'), 2.6);
        curve(x => 1 - Math.pow(1 - F(x), n), C('--green'), 2.6);

        // x 轴刻度
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) ctx.fillText(D.niceNum(xMax * i / 5), padL + pw * i / 5, padT + ph + 5);

        // 图例
        const legend = [
          ['原始分布 F(x)', D.withAlpha(C('--line-2'), 1), [6, 4]],
          ['F_max(x) = [F(x)]ⁿ', C('--accent'), null],
          ['F_min(x) = 1−[1−F(x)]ⁿ', C('--green'), null]
        ];
        let lx = padL, ly = padT - 16;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        legend.forEach(([lab, col, dash]) => {
          ctx.strokeStyle = col; ctx.lineWidth = 2.4;
          ctx.setLineDash(dash || []);
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 20, ly); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.fillText(lab, lx + 25, ly);
          lx += 25 + ctx.measureText(lab).width + 26;
        });

        // 底部结论
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.fillText('性质：F_max 在 F 下方（右偏），F_min 在 F 上方（左偏）；n 越大越极端', padL, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['n', n],
        ['分布', dist.name],
        ['E(max)', f3(dist.eMax(n))],
        ['E(min)', f3(dist.eMin(n))],
        ['串联寿命', '= min(X₁,…,Xₙ)'],
        ['并联寿命', '= max(X₁,…,Xₙ)']
      ]);
    }
    draw();
  };

  /* ================================================================
     3.1b 联合分布：矩形区域上的概率 P((X,Y)∈D)
     ================================================================ */
  W.jointRegion = function (host) {
    const St = global.Stats;
    const { ctrl, out, scene } = UI.shell(host, 308);
    let key = 'square', x1 = 0.2, x2 = 0.7, y1 = 0.1, y2 = 0.6;

    const MODELS = {
      square: {
        name: '正方形均匀 f = 1（0≤x,y≤1）', dom: [0, 1],
        pdf: (x, y) => (x >= 0 && x <= 1 && y >= 0 && y <= 1) ? 1 : 0,
        exact: (a, b, c, d) => Math.max(0, Math.min(b, 1) - Math.max(a, 0)) * Math.max(0, Math.min(d, 1) - Math.max(c, 0)),
        note: '二维均匀分布：概率 = 区域面积之比'
      },
      tri: {
        name: '三角形支撑 f = 2（x+y≤1）', dom: [0, 1],
        pdf: (x, y) => (x >= 0 && y >= 0 && x + y <= 1) ? 2 : 0,
        exact: null,
        note: '支撑集是三角形，密度在支撑集外为 0——区域只能取到三角形内的部分'
      },
      expon: {
        name: '独立指数 f = e^(−x−y)（x,y>0）', dom: [0, 4],
        pdf: (x, y) => (x >= 0 && y >= 0) ? Math.exp(-(x + y)) : 0,
        exact: (a, b, c, d) => (Math.exp(-Math.max(a, 0)) - Math.exp(-b)) * (Math.exp(-Math.max(c, 0)) - Math.exp(-d)),
        note: '密度可分离为 e^(−x)·e^(−y) ⟹ 独立，概率可拆成两个边缘概率之积'
      },
      normal: {
        name: '独立正态 φ(x)φ(y)', dom: [-3, 3],
        pdf: (x, y) => St.normal.pdf(x, 0, 1) * St.normal.pdf(y, 0, 1),
        exact: (a, b, c, d) => (St.normal.cdf(b, 0, 1) - St.normal.cdf(a, 0, 1)) * (St.normal.cdf(d, 0, 1) - St.normal.cdf(c, 0, 1)),
        note: '二维正态且 ρ = 0 ⟹ 独立，概率为两个边缘概率之积'
      }
    };

    const sX1 = UI.slider(ctrl, { label: 'x₁', min: 0, max: 1, step: 0.01, value: x1, fmt: v => v.toFixed(2), onInput: v => { x1 = v; draw(); } });
    const sX2 = UI.slider(ctrl, { label: 'x₂', min: 0, max: 1, step: 0.01, value: x2, fmt: v => v.toFixed(2), onInput: v => { x2 = v; draw(); } });
    const sY1 = UI.slider(ctrl, { label: 'y₁', min: 0, max: 1, step: 0.01, value: y1, fmt: v => v.toFixed(2), onInput: v => { y1 = v; draw(); } });
    const sY2 = UI.slider(ctrl, { label: 'y₂', min: 0, max: 1, step: 0.01, value: y2, fmt: v => v.toFixed(2), onInput: v => { y2 = v; draw(); } });

    UI.seg(ctrl, Object.keys(MODELS).map(k => ({ label: MODELS[k].name, value: k })), v => {
      key = v;
      const d = MODELS[key].dom;
      [[sX1, x1, 'x1'], [sX2, x2, 'x2'], [sY1, y1, 'y1'], [sY2, y2, 'y2']].forEach(([sl, val], i) => {
        sl.input.min = d[0]; sl.input.max = d[1];
      });
      const span = d[1] - d[0];
      x1 = d[0] + span * 0.2; x2 = d[0] + span * 0.7;
      y1 = d[0] + span * 0.1; y2 = d[0] + span * 0.6;
      sX1.set(x1); sX2.set(x2); sY1.set(y1); sY2.set(y2);
      draw();
    }, 0);

    function draw() {
      const T = D.Theme.cache, md = MODELS[key];
      const dom = md.dom;
      const a = Math.min(x1, x2), b = Math.max(x1, x2);
      const c = Math.min(y1, y2), d = Math.max(y1, y2);
      let num = 0;
      const G = 180;
      for (let i = 0; i < G; i++) {
        const xm = a + (b - a) * (i + 0.5) / G;
        for (let j = 0; j < G; j++) num += md.pdf(xm, c + (d - c) * (j + 0.5) / G);
      }
      num *= (b - a) * (d - c) / (G * G);
      const ex = md.exact ? md.exact(a, b, c, d) : NaN;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 56, padR = 26, padT = 40, padB = 46;
        const size = Math.min(W_ - padL - padR - 190, H_ - padT - padB);
        const ox = padL, oy = padT;
        const dom = md.dom;
        const X = v => ox + (v - dom[0]) / (dom[1] - dom[0]) * size;
        const Y = v => oy + size - (v - dom[0]) / (dom[1] - dom[0]) * size;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('联合密度热力图 + 区域 D = {' + a.toFixed(2) + ' ≤ x ≤ ' + b.toFixed(2) + ', ' + c.toFixed(2) + ' ≤ y ≤ ' + d.toFixed(2) + '}', padL, padT - 12);

        // 热力图
        const NG = 54;
        let maxf = 1e-9;
        const vals = [];
        for (let i = 0; i < NG; i++) {
          for (let j = 0; j < NG; j++) {
            const xv = dom[0] + (dom[1] - dom[0]) * (i + 0.5) / NG;
            const yv = dom[0] + (dom[1] - dom[0]) * (j + 0.5) / NG;
            const v = md.pdf(xv, yv);
            vals.push(v);
            if (v > maxf) maxf = v;
          }
        }
        const cw = size / NG;
        for (let i = 0; i < NG; i++) {
          for (let j = 0; j < NG; j++) {
            const v = vals[i * NG + j];
            if (v <= 1e-12) continue;
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.10 + 0.72 * v / maxf);
            ctx.fillRect(ox + cw * i, oy + size - cw * (j + 1), cw + 0.6, cw + 0.6);
          }
        }

        // 区域高亮
        ctx.fillStyle = D.withAlpha(C('--accent'), 0.24);
        ctx.fillRect(X(a), Y(d), X(b) - X(a), Y(c) - Y(d));
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2;
        ctx.strokeRect(X(a), Y(d), X(b) - X(a), Y(c) - Y(d));

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.strokeRect(ox, oy, size, size);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 5; i++) {
          const v = dom[0] + (dom[1] - dom[0]) * i / 5;
          ctx.fillText(D.niceNum(v), X(v), oy + size + 6);
        }
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
          const v = dom[0] + (dom[1] - dom[0]) * i / 5;
          ctx.fillText(D.niceNum(v), ox - 6, Y(v));
        }
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('x', ox + size / 2, oy + size + 40);
        ctx.save();
        ctx.translate(16, oy + size / 2); ctx.rotate(-Math.PI / 2);
        ctx.textBaseline = 'top';
        ctx.fillText('y', 0, 0);
        ctx.restore();

        // 右侧说明
        const rx = ox + size + 22;
        let ry = oy + 6;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillStyle = C('--accent');
        ctx.fillText('P((X,Y) ∈ D)', rx, ry); ry += 20;
        ctx.font = '700 13px ' + D.FONT_MONO;
        ctx.fillStyle = T['--ink'];
        ctx.fillText(num.toFixed(4), rx, ry); ry += 24;
        if (isFinite(ex)) {
          ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText('解析值 ' + ex.toFixed(4), rx, ry); ry += 16;
          ctx.fillText('误差 ' + Math.abs(num - ex).toExponential(1), rx, ry); ry += 22;
        } else {
          ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText('（支撑集非矩形，仅数值积分）', rx, ry); ry += 22;
        }
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_SANS;
        const words = md.note;
        let line = '';
        for (const ch of words) {
          if (ctx.measureText(line + ch).width > W_ - rx - 16) { ctx.fillText(line, rx, ry); ry += 15; line = ch; }
          else line += ch;
        }
        ctx.fillText(line, rx, ry);
      });
      scene.static();

      UI.readout(out, [
        ['模型', md.name],
        ['区域 D', '[' + a.toFixed(2) + ', ' + b.toFixed(2) + '] × [' + c.toFixed(2) + ', ' + d.toFixed(2) + ']'],
        ['P((X,Y) ∈ D) 数值积分', f4(num)],
        ['解析值', isFinite(ex) ? f4(ex) : '（仅数值）'],
        ['边缘概率 P(x₁<X≤x₂) / P(y₁<Y≤y₂)',
          f4(md.exact ? (md.exact(a, b, dom[0], dom[1])) : NaN) + ' / ' + f4(md.exact ? (md.exact(dom[0], dom[1], c, d)) : NaN)],
        ['要点', md.note]
      ]);
    }
    draw();
  };

  /* ================================================================
     3.2b 边缘分布与条件分布：沿行 / 列求和
     ================================================================ */
  W.marginalTable = function (host) {
    const St = global.Stats;
    const { ctrl, out, scene } = UI.shell(host, 306);
    let key = 'A', ii = 1, jj = 1;

    const TABLES = {
      A: {
        name: '联合分布律 A',
        xs: [0, 1, 2], ys: [0, 1, 2],
        p: [[0.10, 0.10, 0.05], [0.15, 0.20, 0.10], [0.05, 0.15, 0.10]],
        note: '行和 = P(X=xᵢ)，列和 = P(Y=yⱼ)，总和应为 1'
      },
      B: {
        name: '摸球：3 白 2 黑任取 2 个',
        xs: [0, 1, 2], ys: [0, 1, 2],
        p: [[0, 0, 0.1], [0, 0.6, 0], [0.3, 0, 0]],
        note: 'X = 白球数，Y = 黑球数，恒有 X+Y = 2，因此非对角元全为 0'
      }
    };

    UI.seg(ctrl, Object.keys(TABLES).map(k => ({ label: TABLES[k].name, value: k })), v => { key = v; draw(); }, 0);
    UI.slider(ctrl, { label: '选中行 i（X = xᵢ）', min: 0, max: 2, value: ii, onInput: v => { ii = v; draw(); } });
    UI.slider(ctrl, { label: '选中列 j（Y = yⱼ）', min: 0, max: 2, value: jj, onInput: v => { jj = v; draw(); } });

    function draw() {
      const T = D.Theme.cache, tb = TABLES[key];
      const rowSum = tb.p.map(r => r.reduce((a, b) => a + b, 0));
      const colSum = tb.xs.map((_, k) => tb.p.reduce((a, r) => a + r[k], 0));
      const total = rowSum.reduce((a, b) => a + b, 0);
      const condX = colSum[jj] > 0 ? tb.p.map(r => r[jj] / colSum[jj]) : tb.p.map(() => 0);
      const condY = rowSum[ii] > 0 ? tb.p[ii].map(v => v / rowSum[ii]) : tb.p[ii].map(() => 0);
      const condEX = tb.xs.reduce((a, x, k) => a + x * condX[k], 0);
      const condEY = tb.ys.reduce((a, y, k) => a + y * condY[k], 0);
      const indep = Math.abs(tb.p[ii][jj] - rowSum[ii] * colSum[jj]) < 1e-9;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 58, padT = 44;
        const cellW = Math.min(64, (W_ * 0.5 - padL - 60) / tb.xs.length);
        const cellH = Math.min(40, (H_ - padT - 66) / tb.ys.length);
        const maxP = Math.max(...tb.p.flat(), 1e-9);

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(tb.name + '：联合分布律表（高亮 = 当前行/列，右侧 = 边缘概率）', padL, padT - 12);

        // 表头
        ctx.fillStyle = T['--ink-3']; ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('X\\Y', padL + cellW / 2, padT + cellH / 2);
        tb.xs.forEach((x, k) => ctx.fillText('x=' + x, padL + cellW * (k + 1) + cellW / 2, padT + cellH / 2));
        ctx.fillText('行和', padL + cellW * (tb.xs.length + 1) + cellW * 0.7, padT + cellH / 2);

        tb.ys.forEach((y, r) => {
          const cy = padT + cellH * (r + 1);
          ctx.fillStyle = T['--ink-3']; ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.fillText('y=' + y, padL + cellW / 2, cy + cellH / 2);
          tb.xs.forEach((x, k) => {
            const v = tb.p[r][k];
            const cx = padL + cellW * (k + 1);
            const hl = (r === ii || k === jj);
            ctx.fillStyle = D.withAlpha(C(hl ? '--accent' : '--brand'), 0.10 + 0.75 * v / maxP);
            ctx.fillRect(cx, cy, cellW - 2, cellH - 2);
            ctx.strokeStyle = hl ? C('--accent') : D.withAlpha(T['--line-2'], 0.9);
            ctx.lineWidth = hl ? 1.8 : 1;
            ctx.strokeRect(cx + .5, cy + .5, cellW - 2, cellH - 2);
            ctx.fillStyle = v > maxP * 0.55 ? '#fff' : T['--ink'];
            ctx.font = '700 11.5px ' + D.FONT_MONO;
            ctx.fillText(v.toFixed(2), cx + cellW / 2, cy + cellH / 2);
          });
          // 行和
          const rx = padL + cellW * (tb.xs.length + 1);
          ctx.fillStyle = D.withAlpha(C('--green'), 0.16);
          ctx.fillRect(rx, cy, cellW * 1.4 - 2, cellH - 2);
          ctx.strokeStyle = D.withAlpha(C('--green'), 0.9); ctx.lineWidth = 1;
          ctx.strokeRect(rx + .5, cy + .5, cellW * 1.4 - 2, cellH - 2);
          ctx.fillStyle = C('--green'); ctx.font = '700 11.5px ' + D.FONT_MONO;
          ctx.fillText(rowSum[r].toFixed(3), rx + cellW * 0.7, cy + cellH / 2);
        });

        // 列和
        const cy2 = padT + cellH * (tb.ys.length + 1);
        ctx.fillStyle = T['--ink-3']; ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.fillText('列和', padL + cellW / 2, cy2 + cellH / 2);
        tb.xs.forEach((x, k) => {
          const cx = padL + cellW * (k + 1);
          ctx.fillStyle = D.withAlpha(C('--teal'), 0.16);
          ctx.fillRect(cx, cy2, cellW - 2, cellH - 2);
          ctx.strokeStyle = D.withAlpha(C('--teal'), 0.9); ctx.lineWidth = 1;
          ctx.strokeRect(cx + .5, cy2 + .5, cellW - 2, cellH - 2);
          ctx.fillStyle = C('--teal'); ctx.font = '700 11.5px ' + D.FONT_MONO;
          ctx.fillText(colSum[k].toFixed(3), cx + cellW / 2, cy2 + cellH / 2);
        });
        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11px ' + D.FONT_MONO;
        ctx.fillText('Σ=' + total.toFixed(3), padL + cellW * (tb.xs.length + 1) + cellW * 0.7, cy2 + cellH / 2);

        // 右侧：条件分布
        const gx = padL + cellW * (tb.xs.length + 2.4);
        const gw = W_ - gx - 26;
        const bars = [
          { t: 'P(X=xᵢ | Y=' + tb.ys[jj] + ')', vals: condX, labels: tb.xs, c: '--accent' },
          { t: 'P(Y=yⱼ | X=' + tb.xs[ii] + ')', vals: condY, labels: tb.ys, c: '--purple' }
        ];
        bars.forEach((b, bi) => {
          const by = padT + 6 + bi * ((H_ - padT - 30) / 2);
          const bh = (H_ - padT - 40) / 2 - 26;
          ctx.fillStyle = C(b.c); ctx.font = '700 11px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText(b.t, gx, by + 10);
          const slot = gw / b.vals.length;
          b.vals.forEach((v, k) => {
            const cx = gx + slot * (k + 0.5);
            const h = v * bh;
            ctx.fillStyle = D.withAlpha(C(b.c), 0.7);
            ctx.fillRect(cx - Math.min(16, slot * 0.3), by + 14 + bh - h, Math.min(32, slot * 0.6), Math.max(1, h));
            ctx.fillStyle = T['--ink-3']; ctx.font = '600 9.5px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText(v.toFixed(3), cx, by + 16 + bh - h - 12);
            ctx.fillText(b.labels[k], cx, by + 16 + bh + 2);
          });
        });
      });
      scene.static();

      UI.readout(out, [
        ['联合表', tb.name],
        ['边缘分布 P(X=xᵢ)', tb.xs.map((x, k) => x + ':' + rowSum[k].toFixed(3)).join('　')],
        ['边缘分布 P(Y=yⱼ)', tb.ys.map((y, k) => y + ':' + colSum[k].toFixed(3)).join('　')],
        ['条件分布 P(X|Y=' + tb.ys[jj] + ')', condX.map((v, k) => tb.xs[k] + ':' + v.toFixed(3)).join('　')],
        ['条件期望 E(X | Y=' + tb.ys[jj] + ')', f4(condEX)],
        ['条件期望 E(Y | X=' + tb.xs[ii] + ')', f4(condEY)],
        ['独立性与否（当前格）', 'P(X=' + tb.xs[ii] + ',Y=' + tb.ys[jj] + ') = ' + tb.p[ii][jj].toFixed(3) + '，P(X)P(Y) = ' + (rowSum[ii] * colSum[jj]).toFixed(3) + (indep ? ' → 该格满足独立条件' : ' → 该格不满足独立条件（整体不独立）')],
        ['注', tb.note]
      ]);
    }
    draw();
  };

  /* ================================================================
     3.3b 二维连续型：联合密度在可调区域上的积分
     ================================================================ */
  W.jointIntegral = function (host) {
    const St = global.Stats;
    const { ctrl, out, scene } = UI.shell(host, 310);
    let key = 'expon', mode = 'rect', a = 0.5, b = 2, c = 0.5, d = 2, t = 1.2;

    const MODELS = {
      expon: {
        name: 'f(x,y) = e^(−x−y)（x,y > 0）', dom: [0, 4], top: 1,
        f: (x, y) => (x >= 0 && y >= 0) ? Math.exp(-(x + y)) : 0,
        rect: (a2, b2, c2, d2) => (Math.exp(-Math.max(a2, 0)) - Math.exp(-b2)) * (Math.exp(-Math.max(c2, 0)) - Math.exp(-d2)),
        tri: t2 => t2 <= 0 ? 0 : (t2 >= 1 ? 1 - Math.exp(-t2) * (1 + t2) : 1 - Math.exp(-t2) * (1 + t2)),
        note: 'X、Y 独立同分布于 E(1)：P(x₁<X≤x₂)P(y₁<Y≤y₂) 可以相乘；X+Y 服从 Gamma(2,1)'
      },
      uniform: {
        name: 'f(x,y) = 1（0 < x,y < 1）', dom: [0, 1], top: 1,
        f: (x, y) => (x >= 0 && x <= 1 && y >= 0 && y <= 1) ? 1 : 0,
        rect: (a2, b2, c2, d2) => Math.max(0, Math.min(b2, 1) - Math.max(a2, 0)) * Math.max(0, Math.min(d2, 1) - Math.max(c2, 0)),
        tri: t2 => t2 <= 0 ? 0 : (t2 <= 1 ? t2 * t2 / 2 : 1 - (2 - t2) * (2 - t2) / 2),
        note: '单位正方形上的均匀分布：概率就是区域面积'
      }
    };

    UI.seg(ctrl, Object.keys(MODELS).map(k => ({ label: MODELS[k].name, value: k })), v => { key = v; draw(); }, 0);
    UI.seg(ctrl, [{ label: '矩形区域', value: 'rect' }, { label: '三角形 x+y ≤ t', value: 'tri' }], v => { mode = v; draw(); }, 0);
    UI.slider(ctrl, { label: 'x₁ / a', min: 0, max: 4, step: 0.05, value: a, fmt: v => v.toFixed(2), onInput: v => { a = v; draw(); } });
    UI.slider(ctrl, { label: 'x₂ / b', min: 0, max: 4, step: 0.05, value: b, fmt: v => v.toFixed(2), onInput: v => { b = v; draw(); } });
    UI.slider(ctrl, { label: 'y₁ / c', min: 0, max: 4, step: 0.05, value: c, fmt: v => v.toFixed(2), onInput: v => { c = v; draw(); } });
    UI.slider(ctrl, { label: 'y₂ / d', min: 0, max: 4, step: 0.05, value: d, fmt: v => v.toFixed(2), onInput: v => { d = v; draw(); } });
    UI.slider(ctrl, { label: 't（三角形区域）', min: 0.1, max: 4, step: 0.05, value: t, fmt: v => v.toFixed(2), onInput: v => { t = v; draw(); } });

    function inRegion(x, y) {
      if (mode === 'rect') return x >= Math.min(a, b) && x <= Math.max(a, b) && y >= Math.min(c, d) && y <= Math.max(c, d);
      return x >= 0 && y >= 0 && x + y <= t;
    }

    function draw() {
      const T = D.Theme.cache, md = MODELS[key];
      const dom = md.dom;
      let num = 0;
      const G = 190;
      for (let i = 0; i < G; i++) {
        for (let j = 0; j < G; j++) {
          const x = dom[0] + (dom[1] - dom[0]) * (i + 0.5) / G;
          const y = dom[0] + (dom[1] - dom[0]) * (j + 0.5) / G;
          if (inRegion(x, y)) num += md.f(x, y);
        }
      }
      num *= Math.pow((dom[1] - dom[0]) / G, 2);
      const ex = mode === 'rect' ? md.rect(Math.min(a, b), Math.max(a, b), Math.min(c, d), Math.max(c, d)) : md.tri(t);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 56, padR = 26, padT = 40, padB = 46;
        const size = Math.min(W_ - padL - padR - 210, H_ - padT - padB);
        const ox = padL, oy = padT;
        const X = v => ox + (v - dom[0]) / (dom[1] - dom[0]) * size;
        const Y = v => oy + size - (v - dom[0]) / (dom[1] - dom[0]) * size;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('联合密度的二重积分：P((X,Y) ∈ D) = ∬_D f(x,y) dxdy', padL, padT - 12);

        const NG = 50;
        let maxf = 1e-9;
        const vals = [];
        for (let i = 0; i < NG; i++) {
          for (let j = 0; j < NG; j++) {
            const xv = dom[0] + (dom[1] - dom[0]) * (i + 0.5) / NG;
            const yv = dom[0] + (dom[1] - dom[0]) * (j + 0.5) / NG;
            const v = md.f(xv, yv);
            vals.push(v);
            if (v > maxf) maxf = v;
          }
        }
        const cw = size / NG;
        for (let i = 0; i < NG; i++) {
          for (let j = 0; j < NG; j++) {
            const v = vals[i * NG + j];
            if (v <= 1e-12) continue;
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.10 + 0.7 * v / maxf);
            ctx.fillRect(ox + cw * i, oy + size - cw * (j + 1), cw + 0.6, cw + 0.6);
          }
        }

        // 区域 D 高亮
        ctx.beginPath();
        if (mode === 'rect') {
          const a2 = Math.min(a, b), b2 = Math.max(a, b), c2 = Math.min(c, d), d2 = Math.max(c, d);
          ctx.rect(X(a2), Y(d2), X(b2) - X(a2), Y(c2) - Y(d2));
        } else {
          ctx.moveTo(X(0), Y(0));
          ctx.lineTo(X(t), Y(0));
          ctx.lineTo(X(0), Y(t));
          ctx.closePath();
        }
        ctx.fillStyle = D.withAlpha(C('--accent'), 0.30);
        ctx.fill();
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 2; ctx.stroke();

        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.strokeRect(ox, oy, size, size);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 4; i++) {
          const v = dom[0] + (dom[1] - dom[0]) * i / 4;
          ctx.fillText(D.niceNum(v), X(v), oy + size + 6);
        }
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        for (let i = 0; i <= 4; i++) {
          const v = dom[0] + (dom[1] - dom[0]) * i / 4;
          ctx.fillText(D.niceNum(v), ox - 6, Y(v));
        }
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('x', ox + size / 2, oy + size + 40);
        ctx.save();
        ctx.translate(16, oy + size / 2); ctx.rotate(-Math.PI / 2);
        ctx.textBaseline = 'top';
        ctx.fillText('y', 0, 0);
        ctx.restore();

        const rx = ox + size + 22;
        let ry = oy + 6;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillStyle = C('--accent');
        ctx.fillText('数值积分 ∬_D f dxdy', rx, ry); ry += 20;
        ctx.font = '700 13px ' + D.FONT_MONO;
        ctx.fillStyle = T['--ink'];
        ctx.fillText(num.toFixed(4), rx, ry); ry += 24;
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-2'];
        ctx.fillText('解析值 ' + (isFinite(ex) ? ex.toFixed(4) : '—'), rx, ry); ry += 16;
        ctx.fillText('误差 ' + (isFinite(ex) ? Math.abs(num - ex).toExponential(1) : '—'), rx, ry); ry += 24;
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_SANS;
        let line = '';
        for (const ch of md.note) {
          if (ctx.measureText(line + ch).width > W_ - rx - 14) { ctx.fillText(line, rx, ry); ry += 15; line = ch; }
          else line += ch;
        }
        ctx.fillText(line, rx, ry);
      });
      scene.static();

      UI.readout(out, [
        ['密度', md.name],
        ['积分区域', mode === 'rect'
          ? '[' + f3(Math.min(a, b)) + ', ' + f3(Math.max(a, b)) + '] × [' + f3(Math.min(c, d)) + ', ' + f3(Math.max(c, d)) + ']'
          : 'x ≥ 0, y ≥ 0, x + y ≤ ' + f3(t)],
        ['数值积分结果', f4(num)],
        ['解析结果', isFinite(ex) ? f4(ex) : '—'],
        ['误差', isFinite(ex) ? Math.abs(num - ex).toExponential(2) : '—'],
        ['要点', md.note]
      ]);
    }
    draw();
  };

  /* ================================================================
     3.4b 不相关 ≠ 独立：Y = X² 的反例
     ================================================================ */
  W.uncorrelatedNotIndep = function (host) {
    const St = global.Stats;
    const { ctrl, out, scene } = UI.shell(host, 300);
    let key = 'cont', y0 = 0.49;
    const c0 = 0.5;

    UI.seg(ctrl, [
      { label: '连续型 X~U(−1,1)', value: 'cont' },
      { label: '离散型 X∈{−1,0,1}', value: 'disc' }
    ], v => { key = v; draw(); }, 0);
    const sY0 = UI.slider(ctrl, { label: '条件阈值 y₀（Y > y₀）', min: 0, max: 0.96, step: 0.02, value: y0, fmt: v => v.toFixed(2), onInput: v => { y0 = v; draw(); } });

    /** 连续型：给定 Y > y₀ 时 P(X > c₀ | Y > y₀) 的解析值 */
    function condProb(g) {
      if (g >= 1) return NaN;
      return (1 - Math.max(c0, g)) / (2 * (1 - g));
    }

    function draw() {
      const T = D.Theme.cache;
      const g = Math.sqrt(y0);
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padT = 42, padB = 42;
        const leftW = Math.min((W_ - padL - 60) * 0.46, H_ - padT - padB);

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(key === 'cont' ? 'X ~ U(−1,1)，Y = X²（散点严格落在抛物线上）' : 'X 等可能取 −1, 0, 1，Y = X²', padL, padT - 12);

        if (key === 'cont') {
          const X = v => padL + (v + 1.15) / 2.3 * leftW;
          const Y = v => padT + leftW - v * leftW;
          ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1;
          for (let i = 0; i <= 4; i++) {
            const x = padL + leftW * i / 4;
            ctx.beginPath(); ctx.moveTo(x + .5, padT); ctx.lineTo(x + .5, padT + leftW); ctx.stroke();
            const y = padT + leftW * i / 4;
            ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(padL + leftW, y + .5); ctx.stroke();
          }
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(padL, padT + leftW + .5); ctx.lineTo(padL + leftW, padT + leftW + .5); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(padL + .5, padT); ctx.lineTo(padL + .5, padT + leftW); ctx.stroke();
          ctx.beginPath();
          for (let i = 0; i <= 200; i++) {
            const v = -1.12 + 2.24 * i / 200;
            const yy = v * v;
            if (yy > 1.12) continue;
            i ? ctx.lineTo(X(v), Y(yy)) : ctx.moveTo(X(v), Y(yy));
          }
          ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2; ctx.stroke();
          // Y > y0 的横向区域
          ctx.fillStyle = D.withAlpha(C('--accent'), 0.16);
          ctx.fillRect(padL, Y(1.12), leftW, Y(g * g) - Y(1.12));
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(padL, Y(y0)); ctx.lineTo(padL + leftW, Y(y0)); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = C('--accent'); ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'top';
          ctx.fillText('Y > ' + y0.toFixed(2) + ' ⟺ |X| > ' + g.toFixed(3), padL + 4, padT + 4);
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          [-1, 0, 1].forEach(v => ctx.fillText(v, X(v), padT + leftW + 5));
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          [0, 0.5, 1].forEach(v => ctx.fillText(v, padL - 5, Y(v)));

          // 条件概率曲线
          const gx = padL + leftW + 52, gw = W_ - gx - 34;
          const gy = padT, gh = leftW;
          ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
          for (let i = 0; i <= 4; i++) {
            const y = gy + gh * i / 4;
            ctx.beginPath(); ctx.moveTo(gx, y + .5); ctx.lineTo(gx + gw, y + .5); ctx.stroke();
          }
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(gx, gy + gh + .5); ctx.lineTo(gx + gw, gy + gh + .5); ctx.stroke();
          const Yc = v => gy + gh - v * gh;
          ctx.beginPath();
          let started = false;
          for (let i = 0; i <= 240; i++) {
            const gg = i / 240 * 0.98;
            const v = (1 - Math.max(c0, gg)) / (2 * (1 - gg));
            if (!isFinite(v)) continue;
            if (!started) { ctx.moveTo(gx + gg * gw, Yc(v)); started = true; } else ctx.lineTo(gx + gg * gw, Yc(v));
          }
          ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.2; ctx.stroke();
          ctx.save();
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(gx, Yc(0.25)); ctx.lineTo(gx + gw, Yc(0.25)); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = C('--green'); ctx.font = '700 10px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText('P(X>0.5) = 0.25（无条件）', gx + 4, Yc(0.25) - 3);
          ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'top';
          ctx.fillText('P(X>0.5 | Y>y₀)', gx + gw - 2, gy + 2);
          const nowV = condProb(g);
          ctx.beginPath(); ctx.arc(gx + g * gw, Yc(nowV), 4.5, 0, D.TAU);
          ctx.fillStyle = C('--red'); ctx.fill();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          for (let i = 0; i <= 4; i++) ctx.fillText((0.98 * i / 4).toFixed(2), gx + gw * i / 4, gy + gh + 6);
          ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText('√y₀（条件 |X| > √y₀）', gx + gw / 2, H_ - 8);
        } else {
          const cx = padL + leftW / 2 + 10, cy = padT + leftW / 2;
          const X = v => padL + (v + 1.4) / 2.8 * leftW;
          const Y = v => padT + leftW - v / 1.25 * leftW;
          ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(padL, Y(0) + .5); ctx.lineTo(padL + leftW, Y(0) + .5); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(X(0) + .5, padT); ctx.lineTo(X(0) + .5, padT + leftW); ctx.stroke();
          [[-1, 1, 1 / 3], [0, 0, 1 / 3], [1, 1, 1 / 3]].forEach(pt => {
            ctx.beginPath(); ctx.arc(X(pt[0]), Y(pt[1]), 6 + pt[2] * 26, 0, D.TAU);
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.5); ctx.fill();
            ctx.strokeStyle = C('--brand'); ctx.lineWidth = 1.6; ctx.stroke();
            ctx.fillStyle = T['--ink']; ctx.font = '700 11px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('(' + pt[0] + ', ' + pt[1] + ')', X(pt[0]), Y(pt[1]) - 2);
          });
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          [-1, 0, 1].forEach(v => ctx.fillText(v, X(v), Y(0) + 6));
          ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText('X', X(0), padT + leftW + 30);

          const gx = padL + leftW + 44;
          let ry = padT + 8;
          ctx.textAlign = 'left'; ctx.textBaseline = 'top';
          ctx.font = '700 11.5px ' + D.FONT_SANS;
          ctx.fillStyle = C('--accent');
          ctx.fillText('联合分布律', gx, ry); ry += 22;
          const rows = [
            ['P(X=−1, Y=1)', '1/3'],
            ['P(X=0, Y=0)', '1/3'],
            ['P(X=1, Y=1)', '1/3'],
            ['边缘 P(X=1)', '1/3'],
            ['边缘 P(Y=1)', '2/3'],
            ['P(X=1)·P(Y=1)', '2/9'],
            ['P(X=1 | Y=1)', '1/2']
          ];
          rows.forEach(r => {
            ctx.font = '600 10.5px ' + D.FONT_SANS;
            ctx.fillStyle = T['--ink-2'];
            ctx.fillText(r[0], gx, ry);
            ctx.font = '700 11px ' + D.FONT_MONO;
            ctx.textAlign = 'right';
            ctx.fillStyle = T['--ink'];
            ctx.fillText(r[1], W_ - 30, ry);
            ctx.textAlign = 'left';
            ry += 20;
          });
        }
      });
      scene.static();

      if (key === 'cont') {
        UI.readout(out, [
          ['模型', 'X ~ U(−1,1)，Y = X²'],
          ['E(X) / E(Y) / E(XY)', '0 / 1/3 / 0（E(X³) = 0，奇函数积分）'],
          ['Cov(X,Y)', '0（精确为 0）'],
          ['相关系数 ρ', '0'],
          ['P(X > 0.5)', f4(0.25)],
          ['P(X > 0.5 | Y > ' + y0.toFixed(2) + ')', f4(condProb(g)) + '（随 y₀ 改变）'],
          ['结论', 'Cov = 0 说明「不相关」，但条件概率随 Y 变化 ⇒ 不独立']
        ]);
      } else {
        UI.readout(out, [
          ['模型', 'X 等可能取 −1, 0, 1，Y = X²'],
          ['E(X) / E(Y) / E(XY)', '0 / 2/3 / 0'],
          ['Cov(X,Y)', '0'],
          ['相关系数 ρ', '0'],
          ['P(X=1) 与 P(X=1 | Y=1)', '1/3 与 1/2 —— 不相等'],
          ['P(X=1,Y=1) 与 P(X=1)P(Y=1)', '1/3 与 2/9 —— 不相等'],
          ['结论', '不相关（Cov=0）但不独立；只有二维正态才是「不相关 ⟺ 独立」']
        ]);
      }
    }
    draw();
  };

  /* ================================================================
     3.5b 二维正态：ρ 与 σ 如何决定等高线椭圆
     ================================================================ */
  W.normal2dParams = function (host) {
    const St = global.Stats;
    const { ctrl, out, scene } = UI.shell(host, 306);
    let rho = 0.6, s1 = 1.2, s2 = 0.8;

    UI.slider(ctrl, { label: '相关系数 ρ', min: -0.95, max: 0.95, step: 0.01, value: rho, fmt: v => v.toFixed(2), onInput: v => { rho = v; draw(); } });
    UI.slider(ctrl, { label: 'σ₁', min: 0.4, max: 2, step: 0.05, value: s1, fmt: v => v.toFixed(2), onInput: v => { s1 = v; draw(); } });
    UI.slider(ctrl, { label: 'σ₂', min: 0.4, max: 2, step: 0.05, value: s2, fmt: v => v.toFixed(2), onInput: v => { s2 = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const v1 = s1 * s1, v2 = s2 * s2;
      const cov = rho * s1 * s2;
      const disc = Math.sqrt((v1 - v2) * (v1 - v2) / 4 + cov * cov);
      const l1 = (v1 + v2) / 2 + disc, l2 = Math.max(1e-9, (v1 + v2) / 2 - disc);
      const theta = 0.5 * Math.atan2(2 * cov, v1 - v2);

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 226, padT = 38, padB = 42;
        const size = Math.min(W_ - padL - padR, H_ - padT - padB);
        const ox = padL, oy = padT;
        const halfW = 3.5 * s1, halfH = 3.5 * s2;
        const sca = Math.min(size / 2 / halfW, size / 2 / halfH);
        const X = v => ox + size / 2 + v * sca;
        const Y = v => oy + size / 2 - v * sca;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('二维正态的等高线椭圆（r = 1, 2, 3 倍标准差椭圆）', padL, padT - 12);

        ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath(); ctx.moveTo(X(i), oy); ctx.lineTo(X(i), oy + size); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ox, Y(i)); ctx.lineTo(ox + size, Y(i)); ctx.stroke();
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(ox, Y(0) + .5); ctx.lineTo(ox + size, Y(0) + .5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(0) + .5, oy); ctx.lineTo(X(0) + .5, oy + size); ctx.stroke();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = -3; i <= 3; i++) if (i) ctx.fillText(i, X(i), oy + size + 5);
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        for (let i = -3; i <= 3; i++) if (i) ctx.fillText(i, ox - 5, Y(i));

        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          for (let k = 0; k <= 240; k++) {
            const th = 2 * Math.PI * k / 240;
            const x = s1 * r * Math.cos(th);
            const y = s2 * r * (rho * Math.cos(th) + Math.sqrt(1 - rho * rho) * Math.sin(th));
            k ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y));
          }
          ctx.closePath();
          ctx.strokeStyle = D.withAlpha(C('--brand'), r === 1 ? 0.95 : 0.55);
          ctx.lineWidth = r === 1 ? 2.2 : 1.4;
          if (r > 1) ctx.setLineDash([5, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 主轴
        ctx.beginPath();
        ctx.moveTo(X(-Math.sqrt(l1) * Math.cos(theta)), Y(-Math.sqrt(l1) * Math.sin(theta)));
        ctx.lineTo(X(Math.sqrt(l1) * Math.cos(theta)), Y(Math.sqrt(l1) * Math.sin(theta)));
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.8; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(X(-Math.sqrt(l2) * Math.cos(theta + Math.PI / 2)), Y(-Math.sqrt(l2) * Math.sin(theta + Math.PI / 2)));
        ctx.lineTo(X(Math.sqrt(l2) * Math.cos(theta + Math.PI / 2)), Y(Math.sqrt(l2) * Math.sin(theta + Math.PI / 2)));
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.8; ctx.stroke();
        ctx.fillStyle = C('--red'); ctx.font = '700 10px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('长轴 √λ₁ = ' + Math.sqrt(l1).toFixed(3), ox + 6, oy + 14);
        ctx.fillStyle = C('--purple');
        ctx.fillText('短轴 √λ₂ = ' + Math.sqrt(l2).toFixed(3), ox + 6, oy + 27);

        const rx = ox + size + 20;
        let ry = oy + 6;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillStyle = C('--brand');
        ctx.fillText('参数与结论', rx, ry); ry += 22;
        const rows = [
          ['ρ', rho.toFixed(2)],
          ['σ₁ / σ₂', s1.toFixed(2) + ' / ' + s2.toFixed(2)],
          ['D(X) / D(Y)', v1.toFixed(3) + ' / ' + v2.toFixed(3)],
          ['Cov(X,Y) = ρσ₁σ₂', cov.toFixed(4)],
          ['椭圆半轴 r√λ₁', (Math.sqrt(l1)).toFixed(3) + '（r=1）'],
          ['椭圆半轴 r√λ₂', (Math.sqrt(l2)).toFixed(3) + '（r=1）'],
          ['主轴倾角 θ', (theta * 180 / Math.PI).toFixed(1) + '°'],
          ['ρ = 0 时', '椭圆轴与坐标轴平行 ⟺ X、Y 独立']
        ];
        rows.forEach(r => {
          ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText(r[0], rx, ry);
          ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.fillStyle = T['--ink'];
          ctx.textAlign = 'right';
          ctx.fillText(r[1], W_ - 24, ry);
          ctx.textAlign = 'left';
          ry += 21;
        });
        ctx.font = '500 10px ' + D.FONT_SANS;
        ctx.fillStyle = Math.abs(rho) < 1e-9 ? C('--green') : C('--accent');
        ctx.fillText(Math.abs(rho) < 1e-9 ? '当前 ρ = 0：X 与 Y 独立' : '当前 ρ ≠ 0：椭圆倾斜，X 与 Y 相关且不独立', rx, ry + 6);
      });
      scene.static();

      UI.readout(out, [
        ['ρ', f2(rho)],
        ['σ₁ / σ₂', f2(s1) + ' / ' + f2(s2)],
        ['Cov(X,Y) = ρσ₁σ₂', f4(cov)],
        ['特征值 λ₁ / λ₂', f4(l1) + ' / ' + f4(l2)],
        ['半轴长（r 倍标准差）', f3(Math.sqrt(l1)) + ' 与 ' + f3(Math.sqrt(l2))],
        ['独立性', Math.abs(rho) < 1e-9 ? 'ρ = 0 ⟹ 独立（二维正态特有结论）' : 'ρ ≠ 0 ⟹ 不独立'],
        ['要点', 'σ 决定椭圆的胖瘦（各自方向的伸缩），|ρ| 决定椭圆被「压扁」并倾斜的程度']
      ]);
    }
    draw();
  };

  /* ================================================================
     3.6b 最值分布：F_max = F^n 与 F_min = 1 − (1 − F)^n
     ================================================================ */
  W.maxMinDerive = function (host) {
    const St = global.Stats;
    const { ctrl, out, plot } = UI.shellPlot(host, {
      xMin: -4, xMax: 4, yMin: -0.05, yMax: 1.08,
      xTicks: 8, yTicks: 6, xLabel: 'x', yLabel: 'F(x)', height: 306
    });
    let key = 'normal', n = 3, x0 = 1.2;

    const DISTS = {
      normal: { name: 'N(0,1)', lo: -4, hi: 4, F: x => St.normal.cdf(x, 0, 1) },
      expon: { name: 'E(1)', lo: -0.4, hi: 5, F: x => St.expon.cdf(x, 1) },
      uniform: { name: 'U(0,1)', lo: -0.3, hi: 1.3, F: x => St.uniform.cdf(x, 0, 1) }
    };

    UI.seg(ctrl, Object.keys(DISTS).map(k => ({ label: DISTS[k].name, value: k })), v => {
      key = v;
      const d = DISTS[key];
      sX.input.min = d.lo; sX.input.max = d.hi;
      x0 = D.clamp(x0, d.lo, d.hi); sX.set(x0);
      draw();
    }, 0);
    UI.slider(ctrl, { label: '样本个数 n', min: 1, max: 25, value: n, onInput: v => { n = v; draw(); } });
    const sX = UI.slider(ctrl, { label: '观察点 x₀', min: -4, max: 4, step: 0.05, value: x0, fmt: v => v.toFixed(2), onInput: v => { x0 = v; draw(); } });

    function draw() {
      const T = D.Theme.cache, d = DISTS[key];
      const F = d.F(x0);
      const Fmax = Math.pow(F, n), Fmin = 1 - Math.pow(1 - F, n);

      plot.setDomain(d.lo, d.hi, -0.05, 1.08);
      plot.clearLayers();
      plot.custom((p, ctx) => {
        ctx.save();
        ctx.beginPath(); ctx.lineWidth = 3.4; ctx.strokeStyle = C('--brand'); ctx.lineCap = 'round';
        for (let i = 0; i <= 400; i++) {
          const x = d.lo + (d.hi - d.lo) * i / 400;
          const y = d.F(x);
          i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y));
        }
        ctx.stroke();
        ctx.beginPath(); ctx.lineWidth = 2.4; ctx.strokeStyle = C('--red');
        for (let i = 0; i <= 400; i++) {
          const x = d.lo + (d.hi - d.lo) * i / 400;
          const y = Math.pow(d.F(x), n);
          i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y));
        }
        ctx.stroke();
        ctx.beginPath(); ctx.lineWidth = 2.4; ctx.strokeStyle = C('--green');
        for (let i = 0; i <= 400; i++) {
          const x = d.lo + (d.hi - d.lo) * i / 400;
          const y = 1 - Math.pow(1 - d.F(x), n);
          i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y));
        }
        ctx.stroke();
        ctx.restore();

        // x₀ 竖线与三个取值
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.X(x0), p.py); ctx.lineTo(p.X(x0), p.py + p.ph); ctx.stroke();
        ctx.restore();
        [[F, '--brand', 'F(x₀) = ' + F.toFixed(3)],
         [Fmax, '--red', 'F^n = ' + Fmax.toFixed(3)],
         [Fmin, '--green', '1−(1−F)^n = ' + Fmin.toFixed(3)]].forEach((row, i) => {
          ctx.beginPath(); ctx.arc(p.X(x0), p.Y(row[0]), 4.4, 0, D.TAU);
          ctx.fillStyle = C(row[1]); ctx.fill();
          ctx.fillStyle = C(row[1]); ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(row[2], p.X(x0) + 8, p.Y(row[0]) + (i - 1) * 13);
        });
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('蓝＝F(x)；红＝F_max = F^n（n 越大越靠下）；绿＝F_min = 1−(1−F)^n（n 越大越靠上）', p.px + 4, p.py + 4);
      });
      plot.animate(380);

      UI.readout(out, [
        ['总体分布', d.name + '，n = ' + n],
        ['F(x₀)', f4(F)],
        ['F_max(x₀) = [F(x₀)]^n', f4(Fmax)],
        ['F_min(x₀) = 1 − [1−F(x₀)]^n', f4(Fmin)],
        ['P{max > x₀}', f4(1 - Fmax)],
        ['P{min > x₀}', f4(1 - Fmin)],
        ['推导要点', 'F_max(x) = P{所有 Xᵢ ≤ x} = [F(x)]^n；F_min(x) = 1 − P{所有 Xᵢ > x} = 1 − [1−F(x)]^n'],
        ['单调性', 'n 增大时 F_max 减小、F_min 增大（极值随样本量变得更极端）']
      ]);
    }
    draw();
  };

})(window);
