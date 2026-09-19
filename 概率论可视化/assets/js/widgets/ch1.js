/* ============================================================
   ch1.js (widgets) — 第一章可视化组件
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS;
  const D = global.Draw, UI = global.UI, S = global.Stats;
  const { el, C, f2, f3, f4, pct } = UI;

  /* ------------------------------------------------------------
     韦恩图离屏合成：严格几何区域着色（替代易出错的 evenodd 组合）
     rect: { x, y, w, h, r } 全集圆角矩形
     circles: [{x, y, r}, {x, y, r}] 两个圆
     mode: 'union' | 'inter' | 'diff' | 'notA' | 'notUnion' | 'sym'
     用离屏 canvas + composite（source-over / source-in / destination-out）
     得到精确的集合运算区域，圆弧按物理像素抗锯齿，无隐式连线。
     ------------------------------------------------------------ */
  function vennShade(ctx, rect, circles, mode, color) {
    // 解析目标颜色：拆出实色 RGB 与 alpha。
    // 关键：离屏合成必须用 alpha=1 的实色，否则 destination-out / source-in
    // 的擦除与裁剪强度会被 fillStyle 的 alpha 削弱，导致阴影残留进圆内部。
    let rgb = 'rgb(0,0,0)', alpha = 1;
    const mc = String(color).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/);
    if (mc) {
      rgb = `rgb(${Math.round(+mc[1])},${Math.round(+mc[2])},${Math.round(+mc[3])})`;
      alpha = mc[4] === undefined ? 1 : parseFloat(mc[4]);
    }

    const cv = ctx.canvas;
    const off = document.createElement('canvas');
    off.width = cv.width;
    off.height = cv.height;
    const octx = off.getContext('2d');
    // 复制主 ctx 的 transform（含 dpr），使离屏坐标与主画布一致
    const m = ctx.getTransform();
    octx.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

    const A = circles[0], B = circles[1];
    // 每个圆都用 moveTo 显式定位弧起点，杜绝 arc 的隐式 lineTo
    const circle = (o, c) => {
      c.beginPath();
      c.moveTo(o.x + o.r, o.y);
      c.arc(o.x, o.y, o.r, 0, D.TAU);
      c.closePath();
    };
    const rectPath = (c) => {
      c.beginPath();
      D.roundRectPath(c, rect.x, rect.y, rect.w, rect.h, rect.r);
      c.closePath();
    };

    octx.fillStyle = rgb;   // 实色：alpha 恒为 1，保证集合运算精确

    if (mode === 'union') {
      circle(A, octx); octx.fill();
      circle(B, octx); octx.fill();
    } else if (mode === 'inter') {
      circle(A, octx); octx.fill();
      octx.globalCompositeOperation = 'source-in';
      circle(B, octx); octx.fill();
    } else if (mode === 'diff') {
      circle(A, octx); octx.fill();
      octx.globalCompositeOperation = 'destination-out';
      circle(B, octx); octx.fill();
    } else if (mode === 'sym') {
      circle(A, octx); octx.fill();
      circle(B, octx); octx.fill();
      // 再擦掉 A∩B：clip A 后用 destination-out 擦 B
      octx.save();
      circle(A, octx); octx.clip();
      octx.globalCompositeOperation = 'destination-out';
      circle(B, octx); octx.fill();
      octx.restore();
    } else if (mode === 'notA' || mode === 'notUnion') {
      rectPath(octx); octx.fill();
      octx.globalCompositeOperation = 'destination-out';
      circle(A, octx); octx.fill();
      if (mode === 'notUnion') { circle(B, octx); octx.fill(); }
    } else if (mode === 'notInter') {
      // 全集 − (A∩B)
      rectPath(octx); octx.fill();
      octx.save();
      circle(A, octx); octx.clip();
      octx.globalCompositeOperation = 'destination-out';
      circle(B, octx); octx.fill();
      octx.restore();
    }

    // 1:1 贴回主画布（物理像素坐标），透明度在此一次性施加
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = alpha;
    ctx.drawImage(off, 0, 0);
    ctx.restore();
  }

  /* ================================================================
     1.1 样本空间与事件
     ================================================================ */
  W.sampleSpace = function (host) {
    const trials = {
      coin2: {
        name: '抛硬币 2 次',
        points: ['HH', 'HT', 'TH', 'TT'],
        events: [
          { label: '全部结果 Ω', set: [0, 1, 2, 3], color: '--line-2' },
          { label: '两次相同', set: [0, 3], color: '--brand' },
          { label: '至少一次正面', set: [0, 1, 2], color: '--green' },
          { label: '恰好一次正面', set: [1, 2], color: '--accent' },
          { label: '两次都是正面', set: [0], color: '--purple' }
        ]
      },
      dice: {
        name: '掷骰子 1 次',
        points: ['1', '2', '3', '4', '5', '6'],
        events: [
          { label: '全部结果 Ω', set: [0, 1, 2, 3, 4, 5], color: '--line-2' },
          { label: '点数为偶数', set: [1, 3, 5], color: '--brand' },
          { label: '点数大于 4', set: [4, 5], color: '--green' },
          { label: '点数不超过 2', set: [0, 1], color: '--accent' },
          { label: '点数为 3', set: [2], color: '--purple' }
        ]
      },
      balls: {
        name: '摸球：5 白 3 黑取 2 球',
        points: ['2白', '1白1黑', '2黑'],
        events: [
          { label: '全部结果 Ω', set: [0, 1, 2], color: '--line-2' },
          { label: '至少 1 白球', set: [0, 1], color: '--brand' },
          { label: '恰好 1 白球', set: [1], color: '--green' },
          { label: '没有白球', set: [2], color: '--accent' }
        ]
      }
    };

    const { cv, ctrl, out, scene } = UI.shell(host, 268);
    let key = 'coin2', evIdx = 0;

    UI.seg(ctrl, Object.keys(trials).map(k => ({ label: trials[k].name, value: k })), v => {
      key = v; evIdx = 0; rebuild();
    }, 0);

    let segEv = null;
    function rebuild() {
      const t = trials[key];
      // 事件按钮
      const old = ctrl.querySelector('.seg.ev');
      if (old) old.remove();
      const wrap = el('div', 'seg ev');
      t.events.forEach((e, i) => {
        const b = el('button', i === evIdx ? 'on' : null, e.label);
        b.type = 'button';
        b.addEventListener('click', () => {
          evIdx = i;
          wrap.querySelectorAll('button').forEach((x, k) => x.classList.toggle('on', k === i));
          draw();
        });
        wrap.appendChild(b);
      });
      ctrl.appendChild(wrap);
      draw();
    }

    function draw() {
      const t = trials[key], ev = t.events[evIdx];
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const n = t.points.length;
        const cols = n <= 4 ? n : (n <= 6 ? 3 : 4);
        const rows = Math.ceil(n / cols);
        const padX = 40, padY = 46;
        const cellW = (W_ - padX * 2) / cols;
        const cellH = (H_ - padY * 2 - 10) / rows;
        const r = Math.min(cellW, cellH) * 0.3;

        // 标题
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 12px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('样本空间 Ω —— ' + t.name, padX, 12);

        t.points.forEach((p, i) => {
          const cx = padX + cellW * ((i % cols) + 0.5);
          const cy = padY + cellH * (Math.floor(i / cols) + 0.5);
          const on = ev.set.includes(i);
          const k = on ? 1 : 0.28;

          // 光晕
          if (on) {
            ctx.beginPath();
            ctx.arc(cx, cy, r * 2.05, 0, D.TAU);
            ctx.fillStyle = D.withAlpha(C(ev.color), 0.13);
            ctx.fill();
          }
          // 圆
          ctx.beginPath();
          ctx.arc(cx, cy, r * 1.28, 0, D.TAU);
          ctx.fillStyle = on ? D.withAlpha(C(ev.color), 0.9) : T['--card-2'];
          ctx.fill();
          ctx.strokeStyle = on ? C(ev.color) : T['--line-2'];
          ctx.lineWidth = on ? 2 : 1.2;
          ctx.stroke();

          // 标签
          ctx.fillStyle = on ? '#fff' : T['--ink-3'];
          ctx.font = `700 ${Math.min(13, r * 0.72)}px ${D.FONT_MONO}`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(p, cx, cy);

          // 序号
          ctx.fillStyle = on ? C(ev.color) : D.withAlpha(T['--ink-3'], 0.55);
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.fillText('ω' + (i + 1), cx, cy + r * 1.28 + 12);
        });
      });
      scene.static();
      UI.readout(out, [
        ['事件', ev.label],
        ['包含样本点数', ev.set.length + ' / ' + t.points.length],
        ['古典型概率（若等可能）', f4(ev.set.length / t.points.length)]
      ]);
    }

    rebuild();
  };

  /* ================================================================
     1.2 事件运算韦恩图
     ================================================================ */
  W.eventAlgebra = function (host) {
    const { cv, ctrl, out, scene } = UI.shell(host, 300);
    const ops = [
      { label: 'A ∪ B', value: 'union', desc: 'A 或 B 至少一个发生' },
      { label: 'A ∩ B', value: 'inter', desc: 'A 与 B 同时发生' },
      { label: 'A − B', value: 'diff', desc: 'A 发生而 B 不发生' },
      { label: 'Ā', value: 'notA', desc: 'A 不发生' },
      { label: 'A ∪ B 的对立', value: 'notUnion', desc: 'Ā ∩ B̄' },
      { label: '对称差 A△B', value: 'sym', desc: '恰有一个发生' }
    ];
    let op = 'union';

    UI.seg(ctrl, ops, v => { op = v; draw(); }, 0);

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const cx = W_ / 2, cy = H_ / 2;
        const R = Math.min(W_ * 0.19, H_ * 0.32);
        const dx = R * 0.72;
        const A = { x: cx - dx, y: cy }, B = { x: cx + dx, y: cy };
        const cA = C('--brand'), cB = C('--green');

        // 全集圆角矩形背景
        const bw = R * 4.1, bh = R * 2.9;
        const rect = { x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh, r: 12 };
        ctx.beginPath();
        D.roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
        ctx.fillStyle = T['--card-2']; ctx.fill();
        ctx.strokeStyle = T['--line-2']; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.setLineDash([]);

        // 阴影：严格几何区域着色
        const shadeColors = {
          inter: D.withAlpha(C('--purple'), 0.5),
          diff: D.withAlpha(cA, 0.42),
          notA: D.withAlpha(cA, 0.28),
          notUnion: D.withAlpha(C('--accent'), 0.3),
          sym: D.withAlpha(C('--teal'), 0.42)
        };
        if (op === 'union') {
          // 两圆分别着色（union 无需集合合成）
          const fillCircle = (p, color) => {
            ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, D.TAU);
            ctx.fillStyle = color; ctx.fill();
          };
          fillCircle(A, D.withAlpha(cA, 0.34));
          fillCircle(B, D.withAlpha(cB, 0.34));
        } else {
          vennShade(ctx, rect, [A, B], op, shadeColors[op]);
        }

        // 圆描边（位于阴影上方，清晰连续）
        const strokeCircle = (p, color) => {
          ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, D.TAU);
          ctx.strokeStyle = color; ctx.lineWidth = 1.8; ctx.stroke();
        };
        strokeCircle(A, cA);
        strokeCircle(B, cB);

        // 标签
        ctx.font = '700 15px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = cA;
        ctx.fillText('A', A.x - R * 0.55, A.y - R * 0.62);
        ctx.fillStyle = cB;
        ctx.fillText('B', B.x + R * 0.55, B.y - R * 0.62);

        // 左上角小标题（不干扰主体）
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('全集 Ω（圆角矩形）与事件 A、B', 14, 10);
      });
      scene.static();

      // 公式说明移到 readout（HTML），与图形彻底分离，避免遮挡
      const d = ops.find(o => o.value === op);
      const shadeDesc = {
        union: 'A ∪ B（两圆分别着色）',
        inter: 'A ∩ B',
        diff: 'A − B',
        notA: 'Ā（全集去掉 A）',
        notUnion: 'Ā ∩ B̄ = (A ∪ B)ᶜ（全集去掉 A、B）',
        sym: 'A △ B = (A−B) ∪ (B−A)'
      };
      UI.readout(out, [
        ['当前运算', d.label],
        ['含义', d.desc],
        ['阴影区域', shadeDesc[op]]
      ]);
    }
    draw();
  };

  /* ================================================================
     1.2b 德摩根律验证
     ================================================================ */
  W.deMorgan = function (host) {
    const { ctrl, out, scene, cv } = UI.shell(host, 250);
    let t = 0.5;

    UI.slider(ctrl, {
      label: '重叠程度', min: 0.2, max: 1.4, step: 0.01, value: t,
      fmt: v => v.toFixed(2),
      onInput: v => { t = v; draw(); }
    });

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const cA = C('--brand'), cB = C('--green');
        const R = Math.min(W_ * 0.115, H_ * 0.28);
        const cy = H_ / 2 - 4;
        const gap = W_ / 4;

        // 左：A∪B 的补
        const cx1 = W_ * 0.25, cx2 = W_ * 0.75;
        const dx = R * (1.5 - t * 0.8);

        function box(cx, label) {
          const bw = R * 3.6, bh = R * 2.5;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 10);
          ctx.fillStyle = T['--card-2']; ctx.fill();
          ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
          ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '700 11.5px ' + D.FONT_SANS;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(label, cx, cy + bh / 2 + 8);
          return { bw, bh };
        }

        const A1 = { x: cx1 - dx, y: cy }, B1 = { x: cx1 + dx, y: cy };
        const A2 = { x: cx2 - dx, y: cy }, B2 = { x: cx2 + dx, y: cy };

        // 左图：(A∪B)ᶜ —— 着色 Ω 中不属于 A 也不属于 B 的部分
        let bb = box(cx1, 'Ā B̄  =  (A∪B)ᶜ');
        vennShade(ctx, { x: cx1 - bb.bw / 2, y: cy - bb.bh / 2, w: bb.bw, h: bb.bh, r: 10 },
          [A1, B1], 'notUnion', D.withAlpha(C('--purple'), 0.34));

        // 右图：(AB)ᶜ —— 着色 Ω 中不在 A∩B 的部分
        bb = box(cx2, '(AB)ᶜ  =  Ā ∪ B̄');
        vennShade(ctx, { x: cx2 - bb.bw / 2, y: cy - bb.bh / 2, w: bb.bw, h: bb.bh, r: 10 },
          [A2, B2], 'notInter', D.withAlpha(C('--purple'), 0.34));

        // 圆
        [[A1, B1], [A2, B2]].forEach(([a, b]) => {
          ctx.beginPath(); ctx.arc(a.x, a.y, R, 0, D.TAU);
          ctx.strokeStyle = cA; ctx.lineWidth = 1.6; ctx.stroke();
          ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, D.TAU);
          ctx.strokeStyle = cB; ctx.lineWidth = 1.6; ctx.stroke();
        });

        ctx.font = '700 13px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = cA; ctx.fillText('A', A1.x - R * 0.5, A1.y - R * 0.6);
        ctx.fillStyle = cB; ctx.fillText('B', B1.x + R * 0.5, B1.y - R * 0.6);
        ctx.fillStyle = cA; ctx.fillText('A', A2.x - R * 0.5, A2.y - R * 0.6);
        ctx.fillStyle = cB; ctx.fillText('B', B2.x + R * 0.5, B2.y - R * 0.6);
      });
      scene.static();
    }
    draw();
  };

  /* ================================================================
     1.3 加法公式的面积分解
     ================================================================ */
  W.additiveFormula = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 290);
    let pa = 0.45, pb = 0.4, pab = 0.15;

    const sA = UI.slider(ctrl, {
      label: 'P(A)', min: 0.05, max: 0.9, step: 0.01, value: pa, fmt: v => v.toFixed(2),
      onInput: v => { pa = v; clampPab(); draw(); }
    });
    const sB = UI.slider(ctrl, {
      label: 'P(B)', min: 0.05, max: 0.9, step: 0.01, value: pb, fmt: v => v.toFixed(2),
      onInput: v => { pb = v; clampPab(); draw(); }
    });
    const sAB = UI.slider(ctrl, {
      label: 'P(AB)', min: 0, max: 0.6, step: 0.01, value: pab, fmt: v => v.toFixed(2),
      onInput: v => { pab = v; clampPab(); draw(); }
    });

    function clampPab() {
      const hi = Math.min(pa, pb);
      if (pab > hi) { pab = hi; sAB.set(pab); }
    }

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const cA = C('--brand'), cB = C('--green'), cAB = C('--purple');
        const R = Math.min(W_ * 0.14, H_ * 0.32);
        const cx = W_ * 0.36, cy = H_ / 2 - 6;
        // 由面积反推重叠距离：交集面积比例
        const area = pab;
        // 两圆半径按概率平方根缩放
        const ra = R * Math.sqrt(pa / 0.9) * 1.25;
        const rb = R * Math.sqrt(pb / 0.9) * 1.25;
        // 圆心距
        const dxMax = ra + rb;
        const inter = Math.max(0, area / 0.9);
        const dist = dxMax - inter * dxMax * 0.92;
        const A = { x: cx - dist / 2, y: cy }, B = { x: cx + dist / 2, y: cy };

        // Ω 框
        const bw = R * 4.4, bh = R * 2.6;
        ctx.beginPath();
        D.roundRectPath(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 12);
        ctx.fillStyle = T['--card-2']; ctx.fill();
        ctx.strokeStyle = T['--line-2']; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.setLineDash([]);

        // 填充 A∪B
        ctx.save();
        ctx.beginPath(); ctx.arc(A.x, A.y, ra, 0, D.TAU);
        ctx.fillStyle = D.withAlpha(cA, 0.3); ctx.fill();
        ctx.beginPath(); ctx.arc(B.x, B.y, rb, 0, D.TAU);
        ctx.fillStyle = D.withAlpha(cB, 0.3); ctx.fill();
        ctx.restore();

        // 交集高亮
        ctx.save();
        ctx.beginPath(); ctx.arc(A.x, A.y, ra, 0, D.TAU); ctx.clip();
        ctx.beginPath(); ctx.arc(B.x, B.y, rb, 0, D.TAU);
        ctx.fillStyle = D.withAlpha(cAB, 0.55); ctx.fill();
        ctx.restore();

        // 描边
        ctx.beginPath(); ctx.arc(A.x, A.y, ra, 0, D.TAU); ctx.strokeStyle = cA; ctx.lineWidth = 1.7; ctx.stroke();
        ctx.beginPath(); ctx.arc(B.x, B.y, rb, 0, D.TAU); ctx.strokeStyle = cB; ctx.lineWidth = 1.7; ctx.stroke();

        ctx.font = '700 14px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = cA; ctx.fillText('A', A.x - ra * 0.5, A.y - ra * 0.55);
        ctx.fillStyle = cB; ctx.fillText('B', B.x + rb * 0.5, B.y - rb * 0.55);

        // 右侧公式分解
        const rx = W_ * 0.72;
        let ry = cy - 58;
        const lines = [
          ['P(A)', pa, cA],
          ['P(B)', pb, cB],
          ['P(AB)', pab, cAB],
          ['P(A∪B)', pa + pb - pab, '--accent']
        ];
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        lines.forEach(([lab, v, col], i) => {
          const sign = i === 0 || i === 1 ? '+' : (i === 2 ? '−' : '=');
          ctx.font = '700 12.5px ' + D.FONT_MONO;
          ctx.fillStyle = i === 3 ? T['--ink'] : T['--ink-2'];
          ctx.fillText(`${sign} ${lab}`, rx, ry);
          ctx.textAlign = 'right';
          ctx.fillStyle = C(col);
          ctx.fillText(v.toFixed(2), W_ - 26, ry);
          ctx.textAlign = 'left';
          // 色块
          ctx.fillStyle = C(col);
          ctx.fillRect(rx - 12, ry - 5, 5, 10);
          ry += 26;
        });
        // 分隔线
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(rx - 12, ry - 13); ctx.lineTo(W_ - 26, ry - 13); ctx.stroke();
      });
      scene.static();
      UI.readout(out, [
        ['P(A∪B)', f2(pa + pb - pab)],
        ['P(A)+P(B)', f2(pa + pb)],
        ['P(AB)', f2(pab)]
      ]);
    }
    draw();
  };

  /* ================================================================
     1.4 古典概型：摸球模拟
     ================================================================ */
  W.classicalProb = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 280);
    let nW = 5, nB = 3, k = 3, target = 2;
    let simData = null;

    UI.slider(ctrl, { label: '白球数', min: 1, max: 10, value: nW, onInput: v => { nW = v; run(); } });
    UI.slider(ctrl, { label: '黑球数', min: 1, max: 10, value: nB, onInput: v => { nB = v; run(); } });
    UI.slider(ctrl, { label: '抽取个数', min: 1, max: 6, value: k, onInput: v => { k = v; run(); } });
    UI.slider(ctrl, { label: '关注：恰有白球数', min: 0, max: 6, value: target, onInput: v => { target = v; run(); } });

    function theoryProb() {
      const N = nW + nB;
      if (target > k || target > nW || k - target > nB) return 0;
      return S.C(nW, target) * S.C(nB, k - target) / S.C(N, k);
    }

    function run() {
      // 理论分布
      const dist = [];
      for (let i = 0; i <= k; i++) {
        const p = (i <= nW && k - i <= nB) ? S.C(nW, i) * S.C(nB, k - i) / S.C(nW + nB, k) : 0;
        dist.push(p);
      }
      // 模拟
      const trials = 6000, cnt = new Array(k + 1).fill(0);
      const rand = S.rng(20260826);
      for (let t = 0; t < trials; t++) {
        const idx = Array.from({ length: nW + nB }, (_, i) => i);
        for (let i = 0; i < k; i++) {
          const j = i + Math.floor(rand() * (nW + nB - i));
          [idx[i], idx[j]] = [idx[j], idx[i]];
        }
        let c = 0;
        for (let i = 0; i < k; i++) if (idx[i] < nW) c++;
        cnt[c]++;
      }
      simData = cnt.map(c => c / trials);

      draw(dist);
      UI.readout(out, [
        ['理论概率 P{X=' + target + '}', f4(theoryProb())],
        ['模拟频率（6000 次）', f4(simData[target] || 0)],
        ['E(X) 理论值', f3(k * nW / (nW + nB))],
        ['样本点总数 C(' + (nW + nB) + ',' + k + ')', S.C(nW + nB, k).toLocaleString()]
      ]);
    }

    function draw(dist) {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 24, padT = 34, padB = 44;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const n = dist.length;
        const bw = pw / n * 0.52;
        const maxP = Math.max(0.25, ...dist, ...(simData || [0]));
        const Y = p => padT + ph - p / maxP * ph;

        // 网格
        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9);
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padT + ph * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(W_ - padR, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 8, y);
        }
        // 轴
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(W_ - padR, padT + ph + .5); ctx.stroke();

        // 柱
        dist.forEach((p, i) => {
          const cx = padL + pw * (i + 0.5) / n;
          const h = p / maxP * ph;
          const isT = i === target;
          const col = isT ? C('--accent') : C('--brand');

          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, padT + ph - h, bw, h, 4);
          const g = ctx.createLinearGradient(0, padT + ph - h, 0, padT + ph);
          g.addColorStop(0, D.withAlpha(col, isT ? 0.95 : 0.8));
          g.addColorStop(1, D.withAlpha(col, 0.5));
          ctx.fillStyle = g; ctx.fill();

          // 模拟频率点
          if (simData) {
            const fy = padT + ph - (simData[i] || 0) / maxP * ph;
            ctx.beginPath();
            ctx.arc(cx, fy, 4, 0, D.TAU);
            ctx.fillStyle = C('--red'); ctx.fill();
            ctx.strokeStyle = T['--card']; ctx.lineWidth = 1.8; ctx.stroke();
          }

          // 数值
          if (p > 0.004) {
            ctx.fillStyle = T['--ink-2'];
            ctx.font = '600 10px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(p.toFixed(3), cx, padT + ph - h - 4);
          }
          // x 标签
          ctx.fillStyle = isT ? C('--accent') : T['--ink-3'];
          ctx.font = (isT ? '700 ' : '500 ') + '11px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(i, cx, padT + ph + 8);
        });

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('取到的白球数 k', padL + pw / 2, H_ - 8);

        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('概率', 8, 12);
      });
      scene.static();
    }
    run();
  };

  /* ================================================================
     1.5 几何概型：会面问题
     ================================================================ */
  W.geometricProb = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let T0 = 60, wait = 20;

    UI.slider(ctrl, { label: '约定时间 T', min: 20, max: 120, step: 5, value: T0, onInput: v => { T0 = v; draw(); } });
    UI.slider(ctrl, { label: '等待时间 t', min: 1, max: 60, step: 1, value: wait, onInput: v => { wait = v; draw(); } });

    function prob() {
      if (wait >= T0) return 1;
      return (T0 * T0 - (T0 - wait) * (T0 - wait)) / (T0 * T0);
    }

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 52, padR = 26, padT = 26, padB = 44;
        const size = Math.min(W_ - padL - padR, H_ - padT - padB);
        const x0 = padL, y0 = padT + (H_ - padT - padB - size);
        const X = v => x0 + v / T0 * size;
        const Y = v => y0 + size - v / T0 * size;

        // Ω 正方形
        ctx.fillStyle = T['--card-2'];
        ctx.fillRect(x0, y0, size, size);

        // 会面区域 |x-y|<=wait
        ctx.save();
        ctx.beginPath();
        ctx.rect(x0, y0, size, size);
        ctx.clip();
        ctx.beginPath();
        ctx.moveTo(X(0), Y(wait));
        ctx.lineTo(X(T0 - wait), Y(T0));
        ctx.lineTo(X(T0), Y(T0));
        ctx.lineTo(X(T0), Y(T0 - wait));
        ctx.lineTo(X(wait), Y(0));
        ctx.lineTo(X(0), Y(0));
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(C('--brand'), 0.3);
        ctx.fill();
        ctx.restore();

        // 两条边界线
        ctx.save();
        ctx.beginPath(); ctx.rect(x0, y0, size, size); ctx.clip();
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(X(0), Y(wait)); ctx.lineTo(X(T0 - wait), Y(T0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(wait), Y(0)); ctx.lineTo(X(T0), Y(T0 - wait)); ctx.stroke();

        // 不满足区域（阴影斜线）
        ctx.strokeStyle = D.withAlpha(C('--red'), 0.5);
        ctx.lineWidth = 1;
        const s = 9;
        // 左上三角
        ctx.beginPath();
        ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0), Y(wait)); ctx.lineTo(X(wait), Y(0)); ctx.closePath();
        ctx.clip();
        for (let d = -size; d < size * 2; d += s) {
          ctx.beginPath(); ctx.moveTo(x0 + d, y0); ctx.lineTo(x0 + d - size, y0 + size); ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        ctx.beginPath(); ctx.rect(x0, y0, size, size); ctx.clip();
        ctx.beginPath();
        ctx.moveTo(X(T0), Y(T0)); ctx.lineTo(X(T0), Y(T0 - wait)); ctx.lineTo(X(T0 - wait), Y(T0)); ctx.closePath();
        ctx.clip();
        ctx.strokeStyle = D.withAlpha(C('--red'), 0.5);
        for (let d = -size; d < size * 2; d += s) {
          ctx.beginPath(); ctx.moveTo(x0 + d, y0); ctx.lineTo(x0 + d - size, y0 + size); ctx.stroke();
        }
        ctx.restore();

        // 框
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.3;
        ctx.strokeRect(x0, y0, size, size);

        // 轴标签
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '500 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        [0, T0 / 2, T0].forEach(v => ctx.fillText(v, X(v), y0 + size + 7));
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        [0, T0 / 2, T0].forEach(v => ctx.fillText(v, x0 - 7, Y(v)));

        ctx.fillStyle = T['--ink-2'];
        ctx.font = '600 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('甲到达时刻 x', x0 + size / 2, H_ - 6);
        ctx.save();
        ctx.translate(14, y0 + size / 2); ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('乙到达时刻 y', 0, 0);
        ctx.restore();

        // 公式
        ctx.fillStyle = C('--brand');
        ctx.font = '700 12px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('|x − y| ≤ ' + wait, x0 + 6, y0 + 6);
      });
      scene.static();
      UI.readout(out, [
        ['能会面概率', f4(prob())],
        ['会面区域面积', f2(T0 * T0 - (T0 - wait) * (T0 - wait))],
        ['样本空间面积', f2(T0 * T0)]
      ]);
    }
    draw();
  };

  /* ================================================================
     1.6 条件概率：样本空间收缩
     ================================================================ */
  W.conditionalProb = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 290);
    const cases = [
      { name: '两个孩子的家庭', points: ['GG', 'GB', 'BG', 'BB'], cond: '至少一个女孩', condSet: [0, 1, 2], event: '两个都是女孩', evSet: [0] },
      { name: '掷骰子', points: ['1', '2', '3', '4', '5', '6'], cond: '点数为偶数', condSet: [1, 3, 5], event: '点数大于 4', evSet: [4, 5] },
      { name: '一副扑克（简化）', points: ['红A', '红K', '黑A', '黑K'], cond: '抽到红色', condSet: [0, 1], event: '抽到 A', evSet: [0, 2] }
    ];
    let ci = 0;

    UI.seg(ctrl, cases.map((c, i) => ({ label: c.name, value: i })), v => { ci = +v; draw(); }, 0);

    function draw() {
      const T = D.Theme.cache;
      const cs = cases[ci];
      const condSet = cs.condSet, evSet = cs.evSet;
      const inter = evSet.filter(i => condSet.includes(i));
      const Pcond = condSet.length / cs.points.length;
      const Pinter = inter.length / cs.points.length;
      const Pcond_prob = Pcond > 0 ? Pinter / Pcond : 0;

      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const n = cs.points.length;
        const cols = n <= 4 ? 2 : 3;
        const rows = Math.ceil(n / cols);
        const padX = 46, padY = 46;
        const cellW = (W_ - padX * 2) / cols;
        const cellH = (H_ - padY * 2 - 16) / rows;
        const r = Math.min(cellW, cellH) * 0.29;

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 12px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('Ω —— ' + cs.name, padX, 12);

        cs.points.forEach((p, i) => {
          const cx = padX + cellW * ((i % cols) + 0.5);
          const cy = padY + cellH * (Math.floor(i / cols) + 0.5);
          const inC = condSet.includes(i), inE = evSet.includes(i);
          let col = T['--card-2'], txt = T['--ink-3'], alpha = 1, rad = r * 1.3;

          if (inC && inE) { col = D.withAlpha(C('--accent'), 0.92); txt = '#fff'; }
          else if (inC) { col = D.withAlpha(C('--brand'), 0.75); txt = '#fff'; }
          else if (inE) { col = D.withAlpha(C('--accent'), 0.22); txt = C('--accent'); }
          else { alpha = 0.35; }

          if (inC) {
            ctx.beginPath(); ctx.arc(cx, cy, rad * 1.75, 0, D.TAU);
            ctx.fillStyle = D.withAlpha(C('--brand'), 0.09); ctx.fill();
          }
          ctx.beginPath(); ctx.arc(cx, cy, rad, 0, D.TAU);
          ctx.fillStyle = col; ctx.fill();
          ctx.strokeStyle = inC ? (inC && inE ? C('--accent') : C('--brand')) : T['--line-2'];
          ctx.lineWidth = inC ? 2 : 1.1; ctx.stroke();

          ctx.globalAlpha = alpha;
          ctx.fillStyle = txt;
          ctx.font = `700 ${Math.min(13, r * 0.75)}px ${D.FONT_MONO}`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(p, cx, cy);
          ctx.globalAlpha = 1;
        });

        // 图例
        const lg = [
          ['条件事件 ' + cs.cond, C('--brand')],
          ['事件 ' + cs.event, C('--accent')],
          ['两者交集', C('--accent')]
        ];
        let ly = H_ - 30;
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        let lx = padX;
        [['条件 ' + cs.cond, C('--brand')], ['事件 ' + cs.event, C('--accent')]].forEach(([lab, col]) => {
          ctx.fillStyle = col;
          ctx.beginPath(); D.roundRectPath(ctx, lx, ly - 5, 10, 10, 3); ctx.fill();
          ctx.fillStyle = T['--ink-2'];
          ctx.fillText(lab, lx + 15, ly);
          lx += ctx.measureText(lab).width + 40;
        });
      });
      scene.static();
      UI.readout(out, [
        ['P(' + cs.cond + ')', f3(Pcond)],
        ['P(' + cs.cond + ' ∩ ' + cs.event + ')', f3(Pinter)],
        ['P(' + cs.event + ' | ' + cs.cond + ')', f3(Pcond_prob)]
      ]);
    }
    draw();
  };

  /* ================================================================
     1.7 全概率公式
     ================================================================ */
  W.totalProb = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let p1 = 0.25, p2 = 0.35, p3 = 0.40;
    let c1 = 0.05, c2 = 0.04, c3 = 0.02;

    UI.slider(ctrl, { label: 'P(A₁) 甲产量', min: 0.05, max: 0.8, step: 0.01, value: p1, fmt: v => v.toFixed(2), onInput: v => { p1 = v; norm(); draw(); } });
    UI.slider(ctrl, { label: 'P(A₂) 乙产量', min: 0.05, max: 0.8, step: 0.01, value: p2, fmt: v => v.toFixed(2), onInput: v => { p2 = v; norm(); draw(); } });
    UI.slider(ctrl, { label: 'P(B|A₁) 甲次品率', min: 0, max: 0.2, step: 0.005, value: c1, fmt: v => (v * 100).toFixed(1) + '%', onInput: v => { c1 = v; draw(); } });
    UI.slider(ctrl, { label: 'P(B|A₂) 乙次品率', min: 0, max: 0.2, step: 0.005, value: c2, fmt: v => (v * 100).toFixed(1) + '%', onInput: v => { c2 = v; draw(); } });
    UI.slider(ctrl, { label: 'P(B|A₃) 丙次品率', min: 0, max: 0.2, step: 0.005, value: c3, fmt: v => (v * 100).toFixed(1) + '%', onInput: v => { c3 = v; draw(); } });

    function norm() {
      const s = p1 + p2;
      if (s > 0.95) { p1 = p1 / s * 0.95; p2 = p2 / s * 0.95; }
      p3 = 1 - p1 - p2;
      if (p3 < 0.02) p3 = 0.02;
    }

    function draw() {
      const T = D.Theme.cache;
      const ps = [p1, p2, p3], cs = [c1, c2, c3];
      const cols = [C('--brand'), C('--green'), C('--accent')];
      const total = ps[0] * cs[0] + ps[1] * cs[1] + ps[2] * cs[2];

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 40, padR = 30, padT = 30, padB = 40;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        // 左侧：树枝图
        const treeW = pw * 0.52;
        const rootX = padL + 16, rootY = padT + ph / 2;
        const nodeX = padL + treeW * 0.52;
        const leafX = padL + treeW;

        // 根节点
        ctx.beginPath();
        D.roundRectPath(ctx, rootX - 14, rootY - 14, 28, 28, 7);
        ctx.fillStyle = T['--ink-3']; ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '700 12px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('Ω', rootX, rootY);

        let y = padT + 6;
        const gap = ph / 3;
        ps.forEach((p, i) => {
          const cy = y + gap * (i + 0.5);
          const cyLeaf = cy;

          // 分支线
          ctx.beginPath();
          ctx.moveTo(rootX + 14, rootY);
          ctx.bezierCurveTo(rootX + 40, rootY, nodeX - 40, cy, nodeX - 6, cy);
          ctx.strokeStyle = D.withAlpha(cols[i], 0.55);
          ctx.lineWidth = 1.6 + p * 3;
          ctx.stroke();

          // 分支标签
          ctx.fillStyle = cols[i];
          ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText('P(A' + (i + 1) + ')=' + p.toFixed(2), (rootX + nodeX) / 2, cy - 5);

          // 节点
          ctx.beginPath();
          D.roundRectPath(ctx, nodeX - 5, cy - 5, 10, 10, 3);
          ctx.fillStyle = cols[i]; ctx.fill();

          // 第二段分支：B 与 B̄
          const bw = leafX - nodeX - 20;
          // B
          ctx.beginPath();
          ctx.moveTo(nodeX + 5, cy);
          ctx.bezierCurveTo(nodeX + 30, cy, leafX - 50, cy - 18, leafX - 6, cy - 18);
          ctx.strokeStyle = D.withAlpha(cols[i], 0.85);
          ctx.lineWidth = 1.6; ctx.stroke();
          // B̄
          ctx.beginPath();
          ctx.moveTo(nodeX + 5, cy);
          ctx.bezierCurveTo(nodeX + 30, cy, leafX - 50, cy + 18, leafX - 6, cy + 18);
          ctx.strokeStyle = D.withAlpha(cols[i], 0.3);
          ctx.lineWidth = 1.4; ctx.stroke();

          ctx.fillStyle = cols[i];
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText('B ' + cs[i].toFixed(3), leafX + 2, cy - 18);
          ctx.fillStyle = D.withAlpha(T['--ink-3'], 1);
          ctx.fillText('B̄ ' + (1 - cs[i]).toFixed(3), leafX + 2, cy + 18);
        });

        // 右侧：加权求和条形
        const rx = padL + treeW + 26;
        const rw = W_ - rx - padR;
        const barH = 22;
        let by = padT + 18;

        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('P(B) = Σ P(Aᵢ)P(B|Aᵢ)', rx, by - 6);
        by += 6;

        ps.forEach((p, i) => {
          const w = p * cs[i] / Math.max(total, 1e-6) * rw;
          ctx.beginPath();
          D.roundRectPath(ctx, rx, by, Math.max(w, 1), barH, 4);
          ctx.fillStyle = D.withAlpha(cols[i], 0.85); ctx.fill();

          ctx.fillStyle = w > 60 ? '#fff' : T['--ink-2'];
          ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          const lab = (p * cs[i]).toFixed(4);
          if (w > 60) ctx.fillText(lab, rx + 7, by + barH / 2);
          else {
            ctx.fillStyle = T['--ink-2'];
            ctx.fillText(lab, rx + w + 5, by + barH / 2);
          }
          by += barH + 7;
        });

        // 总计
        by += 4;
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(rx, by); ctx.lineTo(rx + rw, by); ctx.stroke();
        by += 8;
        ctx.fillStyle = T['--ink-2'];
        ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('P(B) =', rx, by);
        ctx.fillStyle = C('--accent');
        ctx.font = '800 20px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText(total.toFixed(4), rx + rw, by - 4);
      });
      scene.static();
      UI.readout(out, [
        ['P(B) 总概率', f4(total)],
        ['P(A₁)P(B|A₁)', f4(ps[0] * cs[0])],
        ['P(A₂)P(B|A₂)', f4(ps[1] * cs[1])],
        ['P(A₃)P(B|A₃)', f4(ps[2] * cs[2])]
      ]);
    }
    draw();
  };

  /* ================================================================
     1.7b 贝叶斯公式
     ================================================================ */
  W.bayes = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let prior = 0.001, sens = 0.99, fpr = 0.01;

    UI.slider(ctrl, { label: '先验 P(A) 患病率', min: 0.0005, max: 0.3, step: 0.0005, value: prior, fmt: v => (v * 100).toFixed(2) + '%', onInput: v => { prior = v; draw(); } });
    UI.slider(ctrl, { label: '灵敏度 P(B|A)', min: 0.5, max: 1, step: 0.01, value: sens, fmt: v => (v * 100).toFixed(0) + '%', onInput: v => { sens = v; draw(); } });
    UI.slider(ctrl, { label: '假阳性 P(B|Ā)', min: 0.001, max: 0.3, step: 0.001, value: fpr, fmt: v => (v * 100).toFixed(1) + '%', onInput: v => { fpr = v; draw(); } });

    function calc() {
      const tp = prior * sens, fp = (1 - prior) * fpr;
      const ev = tp + fp;
      return { tp, fp, ev, post: ev > 0 ? tp / ev : 0 };
    }

    function draw() {
      const T = D.Theme.cache;
      const { tp, fp, ev, post } = calc();
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 46, padR = 26, padT = 32, padB = 46;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        // 上：人群构成条形（按真实比例，真阳性/假阳性/真阴性）
        const tn = (1 - prior) * (1 - fpr);
        const segs = [
          { v: tp, c: C('--green'), lab: '真阳性' },
          { v: fp, c: C('--red'), lab: '假阳性' },
          { v: tn, c: T['--line-2'], lab: '真阴性' }
        ];
        const barY = padT + 4, barH = 26;
        let x = padL;
        segs.forEach(s => {
          const w = s.v * pw;
          if (w <= 0) return;
          ctx.beginPath();
          D.roundRectPath(ctx, x, barY, Math.max(w, 0.5), barH, 0);
          ctx.fillStyle = s.c; ctx.fill();
          x += w;
        });
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1;
        ctx.strokeRect(padL, barY, pw, barH);

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('全体人群（按真实比例）', padL, barY - 5);

        // 图例
        let ly = barY + barH + 8, lx = padL;
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textBaseline = 'middle';
        segs.forEach(s => {
          ctx.fillStyle = s.c;
          ctx.beginPath(); D.roundRectPath(ctx, lx, ly - 4.5, 9, 9, 2); ctx.fill();
          ctx.fillStyle = T['--ink-2'];
          const t = s.lab + ' ' + (s.v * 100).toFixed(3) + '%';
          ctx.fillText(t, lx + 13, ly);
          lx += ctx.measureText(t).width + 26;
        });

        // 下：阳性者构成（放大）
        const y2 = ly + 28;
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('检测阳性者中：真阳性 vs 假阳性', padL, y2 - 6);

        const barH2 = 30, barY2 = y2;
        const w1 = ev > 0 ? tp / ev * pw : 0;
        ctx.beginPath(); D.roundRectPath(ctx, padL, barY2, Math.max(w1, 1), barH2, 5);
        ctx.fillStyle = C('--green'); ctx.fill();
        ctx.beginPath(); D.roundRectPath(ctx, padL + w1, barY2, Math.max(pw - w1, 1), barH2, 5);
        ctx.fillStyle = C('--red'); ctx.fill();
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1;
        ctx.strokeRect(padL, barY2, pw, barH2);

        // 标注后验
        ctx.fillStyle = '#fff';
        ctx.font = '800 13px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (w1 > 44) ctx.fillText((post * 100).toFixed(1) + '%', padL + w1 / 2, barY2 + barH2 / 2);

        ctx.fillStyle = T['--ink-2'];
        ctx.font = '600 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('后验 P(A|B) = ' + (post * 100).toFixed(2) + '%', padL, barY2 + barH2 + 10);
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '500 11px ' + D.FONT_MONO;
        ctx.textAlign = 'right';
        ctx.fillText('P(B) = ' + ev.toExponential(3), padL + pw, barY2 + barH2 + 10);
      });
      scene.static();
      UI.readout(out, [
        ['先验 P(A)', (prior * 100).toFixed(2) + '%'],
        ['真阳性 P(A)P(B|A)', tp.toExponential(3)],
        ['假阳性 P(Ā)P(B|Ā)', fp.toExponential(3)],
        ['后验 P(A|B)', (post * 100).toFixed(2) + '%']
      ]);
    }
    draw();
  };

  /* ================================================================
     1.8 独立性验证
     ================================================================ */
  W.independence = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 286);
    let pa = 0.5, pb = 0.5, pab = 0.25;

    UI.slider(ctrl, { label: 'P(A)', min: 0.05, max: 0.95, step: 0.01, value: pa, fmt: v => v.toFixed(2), onInput: v => { pa = v; draw(); } });
    UI.slider(ctrl, { label: 'P(B)', min: 0.05, max: 0.95, step: 0.01, value: pb, fmt: v => v.toFixed(2), onInput: v => { pb = v; draw(); } });
    const sAB = UI.slider(ctrl, { label: 'P(AB)', min: 0, max: 0.9, step: 0.01, value: pab, fmt: v => v.toFixed(2), onInput: v => { pab = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      const prod = pa * pb;
      const diff = Math.abs(pab - prod);
      const isInd = diff < 0.005;

      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 56, padR = 28, padT = 34, padB = 52;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        // 坐标轴
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, padT + ph + .5); ctx.lineTo(W_ - padR, padT + ph + .5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padL + .5, padT); ctx.lineTo(padL + .5, padT + ph); ctx.stroke();

        // 网格
        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9);
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const y = padT + ph * i / 5;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(W_ - padR, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((1 - i / 5).toFixed(1), padL - 7, y);
        }
        for (let i = 0; i <= 5; i++) {
          const x = padL + pw * i / 5;
          ctx.beginPath(); ctx.moveTo(x + .5, padT); ctx.lineTo(x + .5, padT + ph); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText((i / 5).toFixed(1), x, padT + ph + 7);
        }

        // 独立线 P(AB)=P(A)P(B)，即 y = pa*pb 的水平线
        const Y = v => padT + ph - v * ph;
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(padL, Y(prod)); ctx.lineTo(W_ - padR, Y(prod)); ctx.stroke();
        ctx.setLineDash([]);

        // 当前点
        const cx = padL + pw * ((pa + pb) / 2);
        const cy = Y(pab);
        ctx.beginPath(); ctx.arc(cx, cy, 8, 0, D.TAU);
        ctx.fillStyle = D.withAlpha(isInd ? C('--green') : C('--red'), 0.2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, 5.5, 0, D.TAU);
        ctx.fillStyle = isInd ? C('--green') : C('--red'); ctx.fill();

        // 标注
        ctx.fillStyle = C('--green');
        ctx.font = '600 11px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('P(A)P(B) = ' + prod.toFixed(3), padL + 6, Y(prod) - 4);

        // 结论
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.font = '800 13px ' + D.FONT_SANS;
        ctx.fillStyle = isInd ? C('--green') : C('--red');
        ctx.fillText(isInd ? '✓ 相互独立（P(AB)=P(A)P(B)）' : '✗ 不独立（P(AB) ≠ P(A)P(B)）', W_ / 2, H_ - 12);

        // 轴标题
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('P(AB)', padL + pw / 2, padT + ph + 24);
      });
      scene.static();
      UI.readout(out, [
        ['P(A)·P(B)', f3(prod)],
        ['P(AB)', f3(pab)],
        ['差值', f3(diff)],
        ['判断', isInd ? '独立' : '不独立']
      ]);
    }
    draw();
  };

  /* ================================================================
     1.9 伯努利试验模拟
     ================================================================ */
  W.bernoulli = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let n = 10, p = 0.5, trials = 4000;
    let data = null, seq = null;

    UI.slider(ctrl, { label: '试验次数 n', min: 2, max: 30, value: n, onInput: v => { n = v; run(); } });
    UI.slider(ctrl, { label: '成功概率 p', min: 0.05, max: 0.95, step: 0.01, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; run(); } });
    UI.slider(ctrl, { label: '模拟轮数', min: 500, max: 10000, step: 500, value: trials, onInput: v => { trials = v; run(); } });

    function run() {
      data = S.binomSim(n, p, trials, S.rng(42 + n));
      seq = S.bernoulliSeq(p, 46, S.rng(7));
      draw();
      const th = S.binom.mean(n, p);
      const va = S.binom.varr(n, p);
      UI.readout(out, [
        ['理论 E(X)', f3(th)],
        ['理论 D(X)', f3(va)],
        ['模拟均值', f3(data.reduce((s, v, i) => s + v * i, 0))],
        ['P{X=0}', f4(S.binom.pmf(0, n, p))]
      ]);
    }

    function draw() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((sc, ctx, anim) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 50, padR = 24, padT = 30, padB = 50;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;

        // 顶部：一次试验序列
        const seqY = 14, cell = Math.min(16, pw / 46);
        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('一次伯努利序列：', padL, seqY);
        const sx = padL + 100;
        seq.forEach((v, i) => {
          ctx.beginPath();
          D.roundRectPath(ctx, sx + i * cell, seqY - 1, cell - 2.5, 14, 3);
          ctx.fillStyle = v ? D.withAlpha(C('--green'), 0.9) : D.withAlpha(T['--line-2'], 0.9);
          ctx.fill();
        });
        ctx.fillStyle = C('--green');
        ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('成功 ' + seq.filter(v => v).length + '/' + seq.length, sx, seqY + 18);

        const top = padT + 34;
        const ph2 = H_ - top - padB;

        // 理论分布 vs 模拟
        const maxP = Math.max(...data, ...Array.from({ length: n + 1 }, (_, i) => S.binom.pmf(i, n, p)));
        const bw = pw / (n + 1) * 0.72;
        const Y = v => top + ph2 - v / maxP * ph2;

        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = top + ph2 * i / 4;
          ctx.beginPath(); ctx.moveTo(padL, y + .5); ctx.lineTo(W_ - padR, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3'];
          ctx.font = '500 10px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((maxP * (1 - i / 4)).toFixed(2), padL - 7, y);
        }

        for (let i = 0; i <= n; i++) {
          const cx = padL + pw * (i + 0.5) / (n + 1);
          const th = S.binom.pmf(i, n, p);
          const h = th / maxP * ph2;
          // 理论柱
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, top + ph2 - h, bw, h, 3);
          const g = ctx.createLinearGradient(0, top + ph2 - h, 0, top + ph2);
          g.addColorStop(0, D.withAlpha(C('--brand'), 0.75));
          g.addColorStop(1, D.withAlpha(C('--brand'), 0.35));
          ctx.fillStyle = g; ctx.fill();
          // 模拟柱（描边）
          const sh = (data[i] || 0) / maxP * ph2;
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, top + ph2 - sh, bw, sh, 3);
          ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 2]); ctx.stroke(); ctx.setLineDash([]);

          if (n <= 15 || i % 2 === 0) {
            ctx.fillStyle = T['--ink-3'];
            ctx.font = '500 9.5px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText(i, cx, top + ph2 + 6);
          }
        }

        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(padL, top + ph2 + .5); ctx.lineTo(W_ - padR, top + ph2 + .5); ctx.stroke();

        ctx.fillStyle = T['--ink-3'];
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('成功次数 k', padL + pw / 2, H_ - 8);
      });
      scene.static();
    }
    run();
  };

  /* ================================================================
     1.1b 样本空间枚举树：分步试验的树形枚举与样本点计数
     ================================================================ */
  W.sampleTree = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 316);
    const EXPS = {
      coin2: { name: '抛硬币 2 次', steps: [['H', 'T'], ['H', 'T']], expr: '2 × 2 = 4' },
      coin3: { name: '抛硬币 3 次', steps: [['H', 'T'], ['H', 'T'], ['H', 'T']], expr: '2 × 2 × 2 = 8' },
      diceCoin: { name: '掷骰子再抛硬币', steps: [['1', '2', '3', '4', '5', '6'], ['H', 'T']], expr: '6 × 2 = 12' }
    };
    let key = 'coin2', depth = 2, pick = 0;

    UI.seg(ctrl, Object.keys(EXPS).map(k => ({ label: EXPS[k].name, value: k })), v => { key = v; reset(); }, 0);
    const sDepth = UI.slider(ctrl, { label: '展开步数', min: 1, max: 2, value: 2, onInput: v => { depth = v; draw(); } });
    const sPick = UI.slider(ctrl, { label: '高亮样本点', min: 0, max: 3, value: 0, onInput: v => { pick = v; draw(); } });

    function total() { return EXPS[key].steps.reduce((s, b) => s * b.length, 1); }
    function reset() {
      const dn = EXPS[key].steps.length;
      sDepth.input.max = dn; sDepth.set(dn);
      sPick.input.max = total() - 1; sPick.set(0);
      depth = dn; pick = 0; draw();
    }
    function makeTree() {
      const st = EXPS[key].steps, dn = st.length, nodes = [];
      (function build(prefix, level, lo, hi, parent) {
        const id = nodes.length;
        nodes.push({
          level, y: (lo + hi) / 2, parent,
          path: prefix.join(''), label: prefix.length ? prefix[prefix.length - 1] : '起', kids: []
        });
        if (level < dn) {
          const bs = st[level], span = (hi - lo) / bs.length;
          bs.forEach((b, i) => nodes[id].kids.push(build(prefix.concat(b), level + 1, lo + span * i, lo + span * (i + 1), id)));
        }
        return id;
      })([], 0, 0, total(), -1);
      return nodes;
    }

    function draw() {
      const T = D.Theme.cache, st = EXPS[key].steps, dn = st.length;
      const nodes = makeTree();
      const leaves = nodes.filter(n => n.level === dn);
      const leaf = leaves[Math.min(pick, leaves.length - 1)];
      const hot = new Set();
      let hi = nodes.indexOf(leaf);
      while (hi >= 0) { hot.add(hi); hi = nodes[hi].parent; }

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 42, padR = 96, padT = 46, padB = 28;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const X = lv => padL + pw * (dn ? lv / dn : 0);
        const Y = v => padT + v / total() * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('分步试验的树形枚举 —— ' + EXPS[key].name, padL, padT - 16);

        for (let lv = 1; lv <= dn; lv++) {
          if (lv > depth) continue;
          ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText('第 ' + lv + ' 步：' + st[lv - 1].length + ' 种', X(lv - 0.5) + (X(1) - X(0)) / 2, 10);
        }

        nodes.forEach((nd, i) => {
          if (nd.level > depth) return;
          nd.kids.forEach(k => {
            if (nodes[k].level > depth) return;
            const on = hot.has(i) && hot.has(k);
            const x1 = X(nd.level), y1 = Y(nd.y), x2 = X(nodes[k].level), y2 = Y(nodes[k].y);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo((x1 + x2) / 2, y1, (x1 + x2) / 2, y2, x2, y2);
            ctx.strokeStyle = on ? C('--accent') : D.withAlpha(T['--line-2'], 0.9);
            ctx.lineWidth = on ? 2.6 : 1.2;
            ctx.stroke();
          });
        });

        const fs = Math.min(10.5, Math.max(7, ph / total() * 0.5));
        nodes.forEach((nd, i) => {
          if (nd.level > depth) return;
          const x = X(nd.level), y = Y(nd.y), on = hot.has(i);
          if (nd.level === dn) {
            ctx.beginPath();
            D.roundRectPath(ctx, x - 12.5, y - 8, 25, 16, 4);
            ctx.fillStyle = on ? D.withAlpha(C('--accent'), 0.92) : T['--card-2'];
            ctx.fill();
            ctx.strokeStyle = on ? C('--accent') : D.withAlpha(T['--line-2'], 0.9);
            ctx.lineWidth = on ? 1.6 : 1;
            ctx.stroke();
            ctx.fillStyle = on ? '#fff' : T['--ink-2'];
            ctx.font = '700 ' + fs + 'px ' + D.FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(nd.path, x, y);
          } else {
            ctx.beginPath(); ctx.arc(x, y, on ? 4.8 : 3.2, 0, D.TAU);
            ctx.fillStyle = on ? C('--accent') : (nd.level === 0 ? C('--ink-2') : T['--line-2']);
            ctx.fill();
          }
        });

        if (depth < dn) {
          ctx.fillStyle = C('--red'); ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText('还有 ' + (dn - depth) + ' 步未展开：每完成一步，样本点数都应再乘以该步的结果数 ' + st[depth].length, padL, H_ - 8);
        }
        if (leaf) {
          ctx.fillStyle = C('--accent'); ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
          ctx.fillText('高亮路径：' + leaf.path, W_ - 12, H_ - 8);
        }
      });
      scene.static();
      UI.readout(out, [
        ['试验', EXPS[key].name],
        ['每步结果数', st.map(b => b.length).join(' × ')],
        ['样本点总数（乘法计数原理）', total() + '（' + EXPS[key].expr + '）'],
        ['已展开步数', depth + ' / ' + dn],
        ['当前高亮样本点', leaf ? leaf.path : '—']
      ]);
    }
    reset();
  };

  /* ================================================================
     1.2b 三事件文氏图：并 / 交 / 差 / 对偶律
     ================================================================ */
  W.vennThree = function (host) {
    const OPS = [
      { label: 'A∪B∪C', value: 'union', say: 'A、B、C 至少有一个发生', area: '三圆覆盖的全部区域' },
      { label: 'ABC', value: 'inter', say: 'A、B、C 都发生', area: '三圆公共部分' },
      { label: 'A(B∪C)ᶜ', value: 'onlyA', say: 'A 发生而 B、C 都不发生', area: 'A 中挖去 B 与 C' },
      { label: '恰有一个', value: 'exact1', say: 'A B̄ C̄ ∪ Ā B C̄ ∪ Ā B̄ C', area: '只被一个圆覆盖的部分' },
      { label: '至少两个', value: 'atLeast2', say: 'AB ∪ AC ∪ BC', area: '两两重叠部分之并' },
      { label: 'Ā B̄ C̄', value: 'none', say: '三个都不发生（对偶律）', area: 'Ω 挖去 A、B、C' }
    ];
    const { ctrl, out, scene } = UI.shell(host, 300);
    let op = 'union', overlap = 0.55;

    UI.seg(ctrl, OPS.map(o => ({ label: o.label, value: o.value })), v => { op = v; draw(); }, 0);
    UI.slider(ctrl, { label: '两两重叠程度', min: 0.3, max: 0.85, step: 0.01, value: overlap, fmt: v => v.toFixed(2), onInput: v => { overlap = v; draw(); } });

    function shade(ctx, rect, cs, mode, color) {
      const m = String(color).match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/);
      const rgb = m ? 'rgb(' + [1, 2, 3].map(i => Math.round(+m[i])).join(',') + ')' : String(color);
      const alpha = m && m[4] !== undefined ? parseFloat(m[4]) : 1;
      const off = document.createElement('canvas');
      off.width = ctx.canvas.width; off.height = ctx.canvas.height;
      const o = off.getContext('2d');
      const tf = ctx.getTransform();
      o.setTransform(tf.a, tf.b, tf.c, tf.d, tf.e, tf.f);
      const circle = (c, cc) => { cc.beginPath(); cc.moveTo(c.x + c.r, c.y); cc.arc(c.x, c.y, c.r, 0, D.TAU); cc.closePath(); };
      const rectPath = cc => { cc.beginPath(); D.roundRectPath(cc, rect.x, rect.y, rect.w, rect.h, rect.r); cc.closePath(); };
      o.fillStyle = rgb;
      const [A, B, Cc] = cs;
      if (mode === 'union') {
        [A, B, Cc].forEach(c => { circle(c, o); o.fill(); });
      } else if (mode === 'inter') {
        circle(A, o); o.fill();
        o.globalCompositeOperation = 'source-in';
        circle(B, o); o.fill(); circle(Cc, o); o.fill();
      } else if (mode === 'onlyA') {
        circle(A, o); o.fill();
        o.globalCompositeOperation = 'destination-out';
        circle(B, o); o.fill(); circle(Cc, o); o.fill();
      } else if (mode === 'exact1') {
        [A, B, Cc].forEach(c => { circle(c, o); o.fill(); });
        [[A, B], [A, Cc], [B, Cc]].forEach(pair => {
          o.save(); circle(pair[0], o); o.clip();
          o.globalCompositeOperation = 'destination-out';
          circle(pair[1], o); o.fill(); o.restore();
        });
      } else if (mode === 'atLeast2') {
        [[A, B], [A, Cc], [B, Cc]].forEach(pair => {
          o.save(); circle(pair[0], o); o.clip();
          circle(pair[1], o); o.fill(); o.restore();
        });
      } else {
        rectPath(o); o.fill();
        o.globalCompositeOperation = 'destination-out';
        [A, B, Cc].forEach(c => { circle(c, o); o.fill(); });
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = alpha;
      ctx.drawImage(off, 0, 0);
      ctx.restore();
    }

    function draw() {
      const T = D.Theme.cache;
      const meta = OPS.find(o => o.value === op);
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const cA = C('--brand'), cB = C('--green'), cC = C('--purple');
        const R = Math.min(W_ * 0.085, H_ * 0.20);
        const cx = W_ / 2, cy = H_ / 2 + 12;
        const dist = R * (1.35 - overlap * 0.85);
        const cs = [
          { x: cx, y: cy - dist * 0.86, r: R },
          { x: cx - dist * 0.95, y: cy + dist * 0.52, r: R },
          { x: cx + dist * 0.95, y: cy + dist * 0.52, r: R }
        ];
        const bw = R * 4.4, bh = R * 3.0;
        const rect = { x: cx - bw / 2, y: cy - bh / 2, w: bw, h: bh, r: 12 };

        ctx.beginPath();
        D.roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, rect.r);
        ctx.fillStyle = T['--card-2']; ctx.fill();
        ctx.strokeStyle = T['--line-2']; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2; ctx.stroke();
        ctx.setLineDash([]);

        shade(ctx, rect, cs, op, D.withAlpha(C('--accent'), 0.5));

        cs.forEach((c, i) => {
          ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, D.TAU);
          ctx.strokeStyle = [cA, cB, cC][i]; ctx.lineWidth = 1.8; ctx.stroke();
        });

        ctx.font = '700 15px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = cA; ctx.fillText('A', cs[0].x, cs[0].y - R * 0.62);
        ctx.fillStyle = cB; ctx.fillText('B', cs[1].x - R * 0.62, cs[1].y + R * 0.34);
        ctx.fillStyle = cC; ctx.fillText('C', cs[2].x + R * 0.62, cs[2].y + R * 0.34);

        ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('Ω（圆角矩形）与三个事件；阴影＝当前运算的区域', 14, 10);
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = C('--accent'); ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.fillText(meta.label, W_ - 14, H_ - 8);
      });
      scene.static();
      UI.readout(out, [
        ['当前运算', meta.label],
        ['含义', meta.say],
        ['阴影区域', meta.area],
        ['对偶律', op === 'none' ? 'ĀB̄C̄ = (A∪B∪C)ᶜ —— 全集挖去三圆，与「至少一个发生」互补' : 'Ā B̄ C̄ = (A∪B∪C)ᶜ；Ā∪B̄∪C̄ = (ABC)ᶜ']
      ]);
    }
    draw();
  };

  /* ================================================================
     1.3b 概率性质推演：单调性、减法公式、加法公式
     ================================================================ */
  W.probMonotone = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 292);
    let pa = 0.5, pb = 0.62, pab = 0.3, focus = 'add';

    const sA = UI.slider(ctrl, { label: 'P(A)', min: 0.05, max: 0.95, step: 0.01, value: pa, fmt: v => v.toFixed(2), onInput: v => { pa = v; clampAB(); draw(); } });
    const sB = UI.slider(ctrl, { label: 'P(B)', min: 0.05, max: 0.95, step: 0.01, value: pb, fmt: v => v.toFixed(2), onInput: v => { pb = v; clampAB(); draw(); } });
    const sAB = UI.slider(ctrl, { label: 'P(AB)', min: 0, max: 0.9, step: 0.01, value: pab, fmt: v => v.toFixed(2), onInput: v => { pab = v; clampAB(); draw(); } });
    UI.seg(ctrl, [
      { label: '单调性', value: 'mono' },
      { label: '减法公式', value: 'diff' },
      { label: '加法公式', value: 'add' }
    ], v => { focus = v; draw(); }, 2);

    function bounds() {
      return { lo: Math.max(0, pa + pb - 1), hi: Math.min(pa, pb) };
    }
    function clampAB() {
      const b = bounds();
      if (pab > b.hi) { pab = b.hi; sAB.set(pab); }
      if (pab < b.lo) { pab = b.lo; sAB.set(pab); }
    }

    function draw() {
      const T = D.Theme.cache;
      const b = bounds();
      const pu = pa + pb - pab;
      const rows = [
        { k: 'P(B−A)', v: pb - pab, c: '--teal' },
        { k: 'P(AB)', v: pab, c: '--purple', marks: b },
        { k: 'P(A)', v: pa, c: '--brand' },
        { k: 'P(B)', v: pb, c: '--green' },
        { k: 'P(A∪B)', v: pu, c: '--accent' },
        { k: 'P(Ā)', v: 1 - pa, c: '--ink-3' }
      ];
      const verdict = [];
      if (pab <= Math.min(pa, pb) + 1e-9) verdict.push('P(AB) ≤ min{P(A),P(B)} ✓ 单调性');
      if (pu >= Math.max(pa, pb) - 1e-9) verdict.push('P(A∪B) ≥ max{P(A),P(B)} ✓ 单调性');
      if (Math.abs(pu - (pa + pb - pab)) < 1e-9) verdict.push('P(A∪B) = P(A)+P(B)−P(AB) ✓ 加法公式');

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 92, padR = 78, padT = 42, padB = 34;
        const pw = W_ - padL - padR;
        const rowH = (H_ - padT - padB) / rows.length;
        const X = v => padL + D.clamp(v, 0, 1) * pw;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('概率的基本性质验证（所有条形的刻度都是 0 → 1）', padL, padT - 12);

        for (let i = 0; i <= 4; i++) {
          const x = padL + pw * i / 4;
          ctx.beginPath(); ctx.moveTo(x + .5, padT - 4); ctx.lineTo(x + .5, padT + rowH * rows.length);
          ctx.strokeStyle = D.withAlpha(C('--line'), 0.9); ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText((i / 4).toFixed(2), x, padT + rowH * rows.length + 6);
        }

        rows.forEach((r, i) => {
          const y = padT + rowH * (i + 0.5);
          const barH = Math.min(18, rowH * 0.56);
          ctx.fillStyle = D.withAlpha(T['--line'], 0.55);
          ctx.beginPath(); D.roundRectPath(ctx, padL, y - barH / 2, pw, barH, 4); ctx.fill();
          ctx.beginPath(); D.roundRectPath(ctx, padL, y - barH / 2, Math.max(2, (r.v > 0 ? r.v : 0) * pw), barH, 4);
          ctx.fillStyle = D.withAlpha(C(r.c), 0.85); ctx.fill();

          ctx.fillStyle = C(r.c); ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(r.k, padL - 10, y);
          ctx.textAlign = 'left';
          ctx.fillText(r.v.toFixed(3), padL + pw + 8, y);

          if (r.marks) {
            [b.lo, b.hi].forEach((v, j) => {
              const x = X(v);
              ctx.beginPath();
              ctx.moveTo(x, y + barH / 2 + 2);
              ctx.lineTo(x - 4, y + barH / 2 + 8);
              ctx.lineTo(x + 4, y + barH / 2 + 8);
              ctx.closePath();
              ctx.fillStyle = j ? C('--green') : C('--red');
              ctx.fill();
            });
            ctx.fillStyle = T['--ink-3']; ctx.font = '500 9px ' + D.FONT_SANS;
            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            ctx.fillText('可达下限 max{0, P(A)+P(B)−1} = ' + b.lo.toFixed(2), X(b.lo), y + barH / 2 + 10);
            ctx.fillText('上限 min{P(A),P(B)} = ' + b.hi.toFixed(2), X(b.hi), y + barH / 2 + 22);
          }
        });

        const noteMap = {
          mono: '单调性：AB ⊂ A ⊂ A∪B，所以 P(AB) ≤ P(A) ≤ P(A∪B)；把 A 换成 B 同理。',
          diff: '减法公式：P(B−A) = P(B) − P(AB)（图中青色条）。注意不能写成 P(B) − P(A)。',
          add: '加法公式：P(A∪B) = P(A) + P(B) − P(AB)，因为 A∩B 被前后各算了一次。'
        };
        ctx.fillStyle = C('--accent'); ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(noteMap[focus], padL, H_ - 8);

        const tight = (pab <= b.lo + 1e-9 || pab >= b.hi - 1e-9);
        if (tight) {
          ctx.fillStyle = C('--red'); ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
          ctx.fillText('P(AB) 已触及可行边界', W_ - 12, H_ - 8);
        }
      });
      scene.static();
      UI.readout(out, [
        ['P(A∪B)', f3(pu)],
        ['P(A)+P(B)−P(AB)', f3(pa + pb - pab)],
        ['两者之差', f3(pu - (pa + pb - pab))],
        ['P(AB) 的可行范围', '[' + f4(b.lo) + ', ' + f4(b.hi) + ']'],
        ['P(B−A)', f3(pb - pab)],
        ['性质自检', verdict.join('；')]
      ]);
    }
    clampAB();
    draw();
  };

  /* ================================================================
     1.4b 放回 / 不放回抽样模型对比
     ================================================================ */
  W.samplingModel = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 292);
    let N = 12, M = 5, n = 4, k = 2, mode = 'with';

    UI.seg(ctrl, [{ label: '有放回', value: 'with' }, { label: '不放回', value: 'without' }], v => { mode = v; draw(); }, 0);
    const sN = UI.slider(ctrl, { label: '球总数 N', min: 4, max: 20, value: N, onInput: v => { N = v; sM.input.max = N - 1; if (M > N - 1) { M = N - 1; sM.set(M); } draw(); } });
    const sM = UI.slider(ctrl, { label: '白球数 M', min: 1, max: N - 1, value: M, onInput: v => { M = v; draw(); } });
    UI.slider(ctrl, { label: '抽取个数 n', min: 1, max: 8, value: n, onInput: v => { n = v; if (k > n) { k = n; sK.set(k); } sK.input.max = n; draw(); } });
    const sK = UI.slider(ctrl, { label: '关注白球数 k', min: 0, max: n, value: k, onInput: v => { k = v; draw(); } });

    function pWith(i) {
      const p = M / N;
      return S.C(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
    }
    function pWithout(i) {
      if (i > M || n - i > N - M || i < 0) return 0;
      return S.C(M, i) * S.C(N - M, n - i) / S.C(N, n);
    }
    function orderedWithout() {
      let v = 1;
      for (let i = 0; i < n; i++) v *= (N - i);
      return v;
    }

    function draw() {
      const T = D.Theme.cache;
      const th = new Array(n + 1).fill(0).map((_, i) => mode === 'with' ? pWith(i) : pWithout(i));
      const other = new Array(n + 1).fill(0).map((_, i) => mode === 'with' ? pWithout(i) : pWith(i));
      const maxP = Math.max(0.08, ...th, ...other);
      const eW = n * M / N;
      const vW = n * (M / N) * (1 - M / N);
      const vH = N > 1 ? n * (M / N) * (1 - M / N) * (N - n) / (N - 1) : 0;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 26, padT = 46, padB = 56;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const slot = pw / (n + 1);
        const bw = Math.min(30, slot * 0.36);
        const Y = v => padT + ph - v / maxP * ph;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('同一模型的两种抽样方式：N=' + N + '，M=' + M + '，取 n=' + n + '（有放回 / 不放回）', padL, padT - 12);

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

        for (let i = 0; i <= n; i++) {
          const cx = padL + slot * (i + 0.5);
          [[other[i], '--line-2', 0.45, i !== k], [th[i], mode === 'with' ? '--brand' : '--green', 0.9, i !== k]].forEach(([v, c, a, dim]) => {
            const off = c === (mode === 'with' ? '--brand' : '--green') ? bw * 0.52 : -bw * 0.52;
            const h = (padT + ph) - Y(v);
            if (h <= 0.4) return;
            ctx.beginPath();
            D.roundRectPath(ctx, cx + off - bw / 2, Y(v), bw, h, 3);
            ctx.fillStyle = D.withAlpha(C(c), dim ? a * 0.42 : a);
            ctx.fill();
          });
          ctx.fillStyle = i === k ? C('--accent') : T['--ink-3'];
          ctx.font = (i === k ? '700 ' : '500 ') + '11px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(i, cx, padT + ph + 7);
          ctx.fillStyle = T['--ink-2']; ctx.font = '600 9.5px ' + D.FONT_MONO;
          ctx.textBaseline = 'bottom';
          ctx.fillText(th[i].toFixed(3), cx, Y(th[i]) - 3);
        }

        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.fillStyle = T['--ink-3'];
        ctx.fillText('白球数 k', padL + pw / 2, H_ - 26);
        let lx = padL;
        [['实心＝当前方式', mode === 'with' ? '--brand' : '--green'], ['空心＝对照方式', '--line-2']].forEach(([t, c]) => {
          ctx.beginPath(); D.roundRectPath(ctx, lx, H_ - 17, 10, 10, 2);
          ctx.fillStyle = D.withAlpha(C(c), c === '--line-2' ? 0.45 : 0.9); ctx.fill();
          ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(t, lx + 14, H_ - 11.5);
          lx += ctx.measureText(t).width + 40;
        });
      });
      scene.static();

      UI.readout(out, [
        ['当前方式', mode === 'with' ? '有放回（二项模型，各次独立）' : '不放回（超几何模型，各次不独立）'],
        ['P{X=' + k + '} 有放回', f4(pWith(k))],
        ['P{X=' + k + '} 不放回', f4(pWithout(k))],
        ['两种概率之差', f4(pWith(k) - pWithout(k))],
        ['样本点总数', mode === 'with' ? 'Nⁿ = ' + Math.pow(N, n).toLocaleString() : 'N(N−1)…(N−n+1) = ' + orderedWithout().toLocaleString()],
        ['E(X)', '有放回 ' + f3(eW) + '；不放回 ' + f3(n * M / N) + '（相同）'],
        ['D(X)', '有放回 ' + f3(vW) + '；不放回 ' + f3(vH) + '（不放回更小）']
      ]);
    }
    draw();
  };

  /* ================================================================
     1.5b 蒲丰投针：用蒙特卡洛频率估计 π
     ================================================================ */
  W.buffonNeedle = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 320);
    let l = 0.8, a = 1.2, trials = 4000, seed = 20260910;

    const sL = UI.slider(ctrl, { label: '针长 l', min: 0.2, max: 2.6, step: 0.05, value: l, fmt: v => v.toFixed(2), onInput: v => { l = v; if (l > a - 0.05) { a = Math.min(3, l + 0.05); sA.set(a); } draw(); } });
    const sA = UI.slider(ctrl, { label: '平行线间距 a（要求 l < a）', min: 0.3, max: 3, step: 0.05, value: a, fmt: v => v.toFixed(2), onInput: v => { a = v; if (l > a - 0.05) { l = Math.max(0.2, a - 0.05); sL.set(l); } draw(); } });
    UI.slider(ctrl, { label: '投针次数 n', min: 200, max: 20000, step: 100, value: trials, onInput: v => { trials = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 1000003 + 7);
      const SHOW = 40;
      let hits = 0;
      const shown = [];
      const series = [];
      const mark = Math.max(1, Math.floor(trials / 150));
      for (let t = 0; t < trials; t++) {
        const x = rand() * a / 2;
        const th = rand() * Math.PI / 2;
        const u = rand();
        const hit = x <= l / 2 * Math.sin(th);
        if (hit) hits++;
        if (t < SHOW) shown.push({ x, th, hit, u });
        if ((t + 1) % mark === 0 || t + 1 === trials) {
          const est = hits > 0 ? 2 * l * (t + 1) / (a * hits) : NaN;
          series.push([t + 1, est]);
        }
      }
      const freq = hits / trials;
      const est = hits > 0 ? 2 * l * trials / (a * hits) : NaN;
      const pTh = 2 * l / (Math.PI * a);
      const err = isFinite(est) ? Math.abs(est - Math.PI) / Math.PI : NaN;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 34, padB = 26;
        const leftW = W_ * 0.44;
        const ph = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('随机投针示意与 π 估计的收敛', 16, padT - 12);

        // 左：平行线 + 针
        const strips = 5;
        const gap = ph / strips;
        ctx.save();
        ctx.beginPath(); ctx.rect(16, padT - 4, leftW - 24, ph + 8); ctx.clip();
        ctx.strokeStyle = D.withAlpha(C('--line-2'), 0.95); ctx.lineWidth = 1.4;
        for (let i = 0; i <= strips; i++) {
          const y = padT + gap * i;
          ctx.beginPath(); ctx.moveTo(16, y + .5); ctx.lineTo(leftW - 8, y + .5); ctx.stroke();
        }
        const scale = gap / a;
        shown.forEach(nd => {
          const si = Math.min(strips - 1, Math.floor(nd.u * strips));
          const cx = 24 + (leftW - 44) * nd.u;
          const cy = padT + si * gap + nd.x * scale;
          const dx = l / 2 * Math.cos(nd.th) * scale;
          const dy = l / 2 * Math.sin(nd.th) * scale;
          ctx.beginPath();
          ctx.moveTo(cx - dx, cy - dy); ctx.lineTo(cx + dx, cy + dy);
          ctx.strokeStyle = nd.hit ? C('--red') : D.withAlpha(T['--ink-3'], 0.75);
          ctx.lineWidth = nd.hit ? 1.8 : 1.2;
          ctx.stroke();
        });
        ctx.restore();
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('示意 ' + SHOW + ' 根：红＝与线相交', 16, H_ - 8);

        // 右：π 估计收敛曲线
        const gx = leftW + 6, gw = W_ - gx - 30, gy = padT, gh = ph;
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = gy + gh * i / 4;
          ctx.beginPath(); ctx.moveTo(gx, y + .5); ctx.lineTo(gx + gw, y + .5); ctx.stroke();
        }
        const yLo = 2.5, yHi = 4.3;
        const Y = v => gy + gh - (D.clamp(v, yLo, yHi) - yLo) / (yHi - yLo) * gh;
        const X = n => gx + Math.log(n) / Math.log(trials) * gw;
        ctx.beginPath();
        let started = false;
        series.forEach(([nn, v]) => {
          if (!isFinite(v)) return;
          if (!started) { ctx.moveTo(X(nn), Y(v)); started = true; } else ctx.lineTo(X(nn), Y(v));
        });
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2; ctx.stroke();

        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = C('--red'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(gx, Y(Math.PI)); ctx.lineTo(gx + gw, Y(Math.PI)); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = C('--red'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillText('π = 3.14159', gx + gw - 2, Y(Math.PI) - 4);
        ctx.fillStyle = C('--brand'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('π̂ = ' + (isFinite(est) ? est.toFixed(4) : '—'), gx + 4, gy + 2);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let i = 0; i <= 4; i++) {
          const nn = Math.max(1, Math.round(Math.exp(Math.log(trials) * i / 4)));
          ctx.fillText('n=' + nn, X(nn), gy + gh + 6);
        }
      });
      scene.static();

      UI.readout(out, [
        ['针长 l / 间距 a', f2(l) + ' / ' + f2(a)],
        ['理论相交概率 2l/(πa)', f4(pTh)],
        ['模拟相交频率', f4(freq) + '（' + hits + ' / ' + trials + '）'],
        ['π 的估计 2ln/(ah)', isFinite(est) ? f4(est) : '—'],
        ['相对误差', isFinite(err) ? f4(err) : '—'],
        ['提升精度的方法', '增大投针次数 n（频率依概率收敛于 2l/(πa)）']
      ]);
    }
    draw();
  };

  /* ================================================================
     1.6b 条件概率树：P(AB) = P(A)P(B|A)
     ================================================================ */
  W.conditionalTree = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 292);
    let pA = 0.4, pBA = 0.7, pBnA = 0.2;

    UI.slider(ctrl, { label: 'P(A)', min: 0.05, max: 0.95, step: 0.01, value: pA, fmt: v => v.toFixed(2), onInput: v => { pA = v; draw(); } });
    UI.slider(ctrl, { label: 'P(B|A)', min: 0.02, max: 0.98, step: 0.01, value: pBA, fmt: v => v.toFixed(2), onInput: v => { pBA = v; draw(); } });
    UI.slider(ctrl, { label: 'P(B|Ā)', min: 0.02, max: 0.98, step: 0.01, value: pBnA, fmt: v => v.toFixed(2), onInput: v => { pBnA = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const pAB = pA * pBA, pAnB = (1 - pA) * pBnA;
      const pB = pAB + pAnB;
      const aGivenB = pB > 0 ? pAB / pB : 0;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 40, padB = 30, padX = 30;
        const rootX = W_ / 2, rootY = padT;
        const xA = padX + (W_ - padX * 2) * 0.22, xNA = padX + (W_ - padX * 2) * 0.78;
        const y1 = padT + 76;
        const y2 = H_ - padB - 30;
        const L = [xNA - (W_ - padX * 2) * 0.30, xNA - (W_ - padX * 2) * 0.10, xA + (W_ - padX * 2) * 0.10, xA + (W_ - padX * 2) * 0.30];
        const leaves = [
          { x: L[0], v: pAnB, tag: 'P(ĀB)', c: '--green' },
          { x: L[1], v: (1 - pA) * (1 - pBnA), tag: 'P(ĀB̄)', c: '--teal' },
          { x: L[2], v: pA * (1 - pBA), tag: 'P(AB̄)', c: '--purple' },
          { x: L[3], v: pAB, tag: 'P(AB)', c: '--accent' }
        ];
        const edges = [
          [rootX, rootY, xA, y1, pA, 'P(A)=' + pA.toFixed(2), '--brand'],
          [rootX, rootY, xNA, y1, 1 - pA, 'P(Ā)=' + (1 - pA).toFixed(2), '--ink-3'],
          [xA, y1, L[2], y2, pA * (1 - pBA), 'P(B̄|A)=' + (1 - pBA).toFixed(2), '--purple'],
          [xA, y1, L[3], y2, pAB, 'P(B|A)=' + pBA.toFixed(2), '--green'],
          [xNA, y1, L[0], y2, pAnB, 'P(B|Ā)=' + pBnA.toFixed(2), '--accent'],
          [xNA, y1, L[1], y2, (1 - pA) * (1 - pBnA), 'P(B̄|Ā)=' + (1 - pBnA).toFixed(2), '--teal']
        ];

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('条件概率树：边上的数＝走过这条边（在前一步已发生）的概率', padX, 18);

        edges.forEach(e => {
          const [x1, y1_, x2, y2_, pr, lab, c] = e;
          ctx.beginPath();
          ctx.moveTo(x1, y1_);
          ctx.bezierCurveTo((x1 + x2) / 2, y1_ + 22, (x1 + x2) / 2, y2_ - 22, x2, y2_);
          ctx.strokeStyle = D.withAlpha(C(c), 0.85);
          ctx.lineWidth = Math.max(1, pr * 9);
          ctx.stroke();
          ctx.fillStyle = C(c); ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(lab, (x1 + x2) / 2 + (x1 < x2 ? 6 : -6), (y1_ + y2_) / 2);
        });

        ctx.beginPath(); ctx.arc(rootX, rootY, 6, 0, D.TAU);
        ctx.fillStyle = C('--ink-2'); ctx.fill();
        ctx.fillStyle = T['--ink-3']; ctx.font = '700 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('试验起点', rootX, rootY + 8);

        [['A', xA, '--brand', pA], ['Ā', xNA, '--ink-3', 1 - pA]].forEach(([t, x, c, pr]) => {
          ctx.beginPath(); ctx.arc(x, y1, 5, 0, D.TAU);
          ctx.fillStyle = C(c); ctx.fill();
          ctx.font = '700 13px ' + D.FONT_SANS;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(t, x, y1 - 16);
          ctx.font = '600 10px ' + D.FONT_MONO;
          ctx.fillText(pr.toFixed(2), x, y1 + 17);
        });

        leaves.forEach(lf => {
          ctx.beginPath();
          D.roundRectPath(ctx, lf.x - 46, y2 - 14, 92, 30, 6);
          ctx.fillStyle = D.withAlpha(C(lf.c), 0.16);
          ctx.fill();
          ctx.strokeStyle = D.withAlpha(C(lf.c), 0.9);
          ctx.lineWidth = 1.4; ctx.stroke();
          ctx.fillStyle = C(lf.c); ctx.font = '700 10.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(lf.tag, lf.x, y2 - 3);
          ctx.fillStyle = T['--ink']; ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.fillText(lf.v.toFixed(3), lf.x, y2 + 10);
        });

        ctx.fillStyle = T['--ink-2']; ctx.font = '600 11px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('P(AB) = P(A)P(B|A) = ' + pA.toFixed(2) + ' × ' + pBA.toFixed(2) + ' = ' + pAB.toFixed(3)
          + '　；　P(B) = ' + pB.toFixed(3) + '　；　P(A|B) = ' + aGivenB.toFixed(3), W_ / 2, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['P(A)', f3(pA)],
        ['P(B|A) / P(B|Ā)', f3(pBA) + ' / ' + f3(pBnA)],
        ['乘法公式 P(AB)', f4(pAB)],
        ['P(ĀB)', f4(pAnB)],
        ['全概率 P(B)', f4(pB)],
        ['贝叶斯 P(A|B)', f4(aGivenB)],
        ['事件独立？', Math.abs(pA * pB - pAB) < 5e-3 ? 'P(AB)=P(A)P(B)，近似独立' : 'P(AB) ≠ P(A)P(B)，不独立']
      ]);
    }
    draw();
  };

  /* ================================================================
     1.7b 序贯贝叶斯：证据一次次到来，后验如何更新
     ================================================================ */
  W.bayesSequential = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let prior = 0.02, sens = 0.95, fpr = 0.08, m = 3;

    UI.slider(ctrl, { label: '先验 P(H)', min: 0.001, max: 0.4, step: 0.001, value: prior, fmt: v => (v * 100).toFixed(1) + '%', onInput: v => { prior = v; draw(); } });
    UI.slider(ctrl, { label: '灵敏度 P(+|H)', min: 0.5, max: 0.99, step: 0.01, value: sens, fmt: v => (v * 100).toFixed(0) + '%', onInput: v => { sens = v; draw(); } });
    UI.slider(ctrl, { label: '假阳性 P(+|H̄)', min: 0.01, max: 0.4, step: 0.01, value: fpr, fmt: v => (v * 100).toFixed(0) + '%', onInput: v => { fpr = v; draw(); } });
    UI.slider(ctrl, { label: '连续阳性次数 m', min: 0, max: 8, value: m, onInput: v => { m = v; draw(); } });

    function postAfter(lr, k) {
      let odds = prior / (1 - prior);
      odds *= Math.pow(lr, k);
      return odds / (1 + odds);
    }
    function minK(target) {
      for (let k = 0; k <= 40; k++) if (postAfter(sens / fpr, k) >= target) return k;
      return 40;
    }

    function draw() {
      const T = D.Theme.cache;
      const lrP = sens / fpr, lrN = (1 - sens) / (1 - fpr);
      const pos = [];
      for (let k = 0; k <= 8; k++) pos.push(postAfter(lrP, k));
      const neg = [];
      for (let k = 0; k <= 8; k++) neg.push(postAfter(lrN, k));

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 44, padB = 44, padL = 44, padR = 28;
        const leftW = W_ * 0.30;
        const gx = padL + leftW + 42, gw = W_ - gx - padR, gy = padT, gh = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('序贯贝叶斯：每来一次证据，就把它更新成下一次的先验', padL, padT - 14);

        // 左：先验 vs 后验
        const bars = [
          { t: '先验 P(H)', v: prior, c: '--brand' },
          { t: 'm 次阳性后', v: pos[m], c: '--red' },
          { t: 'm 次阴性后', v: neg[m], c: '--green' }
        ];
        const bw = leftW * 0.34;
        bars.forEach((b, i) => {
          const x = padL + leftW * (i + 0.5) / bars.length;
          const h = b.v * gh;
          ctx.fillStyle = D.withAlpha(T['--line'], 0.5);
          ctx.beginPath(); D.roundRectPath(ctx, x - bw / 2, gy, bw, gh, 4); ctx.fill();
          ctx.beginPath(); D.roundRectPath(ctx, x - bw / 2, gy + gh - h, bw, Math.max(2, h), 4);
          ctx.fillStyle = D.withAlpha(C(b.c), 0.85); ctx.fill();
          ctx.fillStyle = C(b.c); ctx.font = '700 11px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText((b.v * 100).toFixed(2) + '%', x, gy + gh - h - 4);
          ctx.fillStyle = T['--ink-2']; ctx.font = '600 10px ' + D.FONT_SANS;
          ctx.textBaseline = 'top';
          ctx.fillText(b.t, x, gy + gh + 6);
        });

        // 右：后验随连续证据数变化
        ctx.strokeStyle = D.withAlpha(C('--line'), 0.85); ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = gy + gh * i / 4;
          ctx.beginPath(); ctx.moveTo(gx, y + .5); ctx.lineTo(gx + gw, y + .5); ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText((1 - i / 4).toFixed(2), gx - 6, y);
        }
        ctx.strokeStyle = C('--line-2'); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(gx, gy + gh + .5); ctx.lineTo(gx + gw, gy + gh + .5); ctx.stroke();

        const X = k => gx + gw * k / 8, Y = v => gy + gh - v * gh;
        [[pos, '--red', '连续阳性'], [neg, '--green', '连续阴性']].forEach(([arr, c, lab]) => {
          ctx.beginPath();
          arr.forEach((v, k) => k ? ctx.lineTo(X(k), Y(v)) : ctx.moveTo(X(k), Y(v)));
          ctx.strokeStyle = C(c); ctx.lineWidth = 2.2; ctx.stroke();
          arr.forEach((v, k) => {
            ctx.beginPath(); ctx.arc(X(k), Y(v), k === m ? 5 : 3, 0, D.TAU);
            ctx.fillStyle = k === m ? C(c) : T['--card-2'];
            ctx.fill();
            ctx.strokeStyle = C(c); ctx.lineWidth = 1.5; ctx.stroke();
          });
          ctx.fillStyle = C(c); ctx.font = '700 10.5px ' + D.FONT_SANS;
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(lab, X(8) - 46, Y(arr[8]) + (c === '--red' ? -14 : 14));
        });

        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = D.withAlpha(C('--accent'), 0.9); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(X(m), gy); ctx.lineTo(X(m), gy + gh); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        for (let k = 0; k <= 8; k++) ctx.fillText(k, X(k), gy + gh + 6);
        ctx.fillStyle = T['--ink-3']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('连续证据次数 k', gx + gw / 2, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['先验 P(H)', (prior * 100).toFixed(2) + '%'],
        ['阳性似然比 LR₊ = P(+|H)/P(+|H̄)', f4(lrP)],
        ['阴性似然比 LR₋ = P(−|H)/P(−|H̄)', f4(lrN)],
        [m + ' 次阳性后 P(H|+)', (pos[m] * 100).toFixed(2) + '%'],
        [m + ' 次阴性后 P(H|−)', (neg[m] * 100).toFixed(2) + '%'],
        ['后验要达到 95% 所需阳性次数', minK(0.95) + ' 次'],
        ['要点', '先验很低时，单次阳性远不足以“确诊”——序贯累积才能提升把握']
      ]);
    }
    draw();
  };

  /* ================================================================
     1.8b 独立系统可靠性：串联 / 并联 / 混合 / 表决
     ================================================================ */
  W.reliabilitySystem = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 290);
    let mode = 'series', r = 0.9, n = 3;

    UI.seg(ctrl, [
      { label: '串联', value: 'series' },
      { label: '并联', value: 'parallel' },
      { label: '混合', value: 'mixed' },
      { label: '2/3 表决', value: 'vote' }
    ], v => { mode = v; draw(); }, 0);
    UI.slider(ctrl, { label: '单个部件可靠度 r', min: 0.5, max: 0.99, step: 0.01, value: r, fmt: v => v.toFixed(2), onInput: v => { r = v; draw(); } });
    UI.slider(ctrl, { label: '部件个数 n', min: 2, max: 5, value: n, onInput: v => { n = v; draw(); } });

    function rel() {
      if (mode === 'series') return Math.pow(r, n);
      if (mode === 'parallel') return 1 - Math.pow(1 - r, n);
      if (mode === 'mixed') {
        const n1 = Math.ceil(n / 2), n2 = n - n1;
        return 1 - (1 - Math.pow(r, n1)) * (1 - Math.pow(r, n2));
      }
      return 3 * r * r - 2 * r * r * r;
    }
    function formula() {
      if (mode === 'series') return 'R = rⁿ = ' + r.toFixed(2) + '^' + n;
      if (mode === 'parallel') return 'R = 1 − (1 − r)ⁿ = 1 − ' + (1 - r).toFixed(2) + '^' + n;
      if (mode === 'mixed') return 'R = 1 − (1 − r^' + Math.ceil(n / 2) + ')(1 − r^' + Math.floor(n / 2) + ')';
      return 'R = C(3,2)r²(1−r) + r³ = 3r² − 2r³';
    }
    function scheme() {
      if (mode === 'series') return '全部部件都必须工作，系统才工作';
      if (mode === 'parallel') return '只要有一个部件工作，系统就工作';
      if (mode === 'mixed') return '两条串联支路并联：每条内部全通、两条支路至少通一条';
      return '三个部件中至少两个工作，系统才工作（多数表决）';
    }

    function draw() {
      const T = D.Theme.cache, R = rel();
      const cnt = mode === 'vote' ? 3 : n;
      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padT = 46, padB = 76;
        const boxW = 52, boxH = 36;
        const areaH = H_ - padT - padB;

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('独立系统可靠性：每个部件独立地以概率 r 正常工作', 22, padT - 14);

        const drawBox = (x, y, lab) => {
          ctx.beginPath();
          D.roundRectPath(ctx, x - boxW / 2, y - boxH / 2, boxW, boxH, 7);
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.16);
          ctx.fill();
          ctx.strokeStyle = C('--brand'); ctx.lineWidth = 1.6; ctx.stroke();
          ctx.fillStyle = C('--brand'); ctx.font = '700 11px ' + D.FONT_SANS;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(lab, x, y);
        };
        const wire = (x1, y1, x2, y2) => {
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = C('--ink-3'); ctx.lineWidth = 1.6; ctx.stroke();
        };

        const cx = W_ / 2, cy = padT + areaH * 0.45;
        if (mode === 'series') {
          const gap = Math.min(120, (W_ - 160) / cnt);
          const x0 = cx - gap * (cnt - 1) / 2;
          wire(x0 - gap * 0.6, cy, x0 - boxW / 2, cy);
          wire(x0 + gap * (cnt - 1) + boxW / 2, cy, x0 + gap * (cnt - 1) + gap * 0.6, cy);
          for (let i = 0; i < cnt; i++) {
            const x = x0 + gap * i;
            if (i) wire(x - gap + boxW / 2, cy, x - boxW / 2, cy);
            drawBox(x, cy, 'r' + (i + 1));
          }
        } else if (mode === 'parallel') {
          const gap = Math.min(56, areaH / (cnt + 1));
          const y0 = cy - gap * (cnt - 1) / 2;
          const railL = cx - 150, railR = cx + 150;
          wire(railL, cy, railL, cy);
          for (let i = 0; i < cnt; i++) {
            const y = y0 + gap * i;
            wire(railL, y, cx - boxW / 2 - 16, y);
            wire(cx + boxW / 2 + 16, y, railR, y);
            drawBox(cx, y, 'r' + (i + 1));
          }
          wire(railL, y0, railL, y0 + gap * (cnt - 1));
          wire(railR, y0, railR, y0 + gap * (cnt - 1));
          wire(cx - 200, cy, railL, cy);
          wire(railR, cy, cx + 200, cy);
        } else if (mode === 'mixed') {
          const n1 = Math.ceil(cnt / 2), n2 = cnt - n1;
          const branch = (y, k) => {
            const gap = Math.min(104, (W_ - 260) / Math.max(1, k));
            const x0 = cx - gap * (k - 1) / 2;
            for (let i = 0; i < k; i++) {
              const x = x0 + gap * i;
              if (i) wire(x - gap + boxW / 2, y, x - boxW / 2, y);
              drawBox(x, y, 'r');
            }
            return [x0 - gap / 2, x0 + gap * (k - 1) + gap / 2];
          };
          const yTop = cy - 44, yBot = cy + 44;
          const a = branch(yTop, n1), b = branch(yBot, n2);
          wire(cx - 190, cy, cx - 190, yTop); wire(cx - 190, yTop, a[0], yTop);
          wire(cx - 190, cy, cx - 190, yBot); wire(cx - 190, yBot, b[0], yBot);
          wire(a[1], yTop, cx + 190, yTop); wire(b[1], yBot, cx + 190, yBot);
          wire(cx + 190, yTop, cx + 190, cy); wire(cx + 190, yBot, cx + 190, cy);
          wire(cx - 230, cy, cx - 190, cy); wire(cx + 190, cy, cx + 230, cy);
          ctx.fillStyle = T['--ink-3']; ctx.font = '600 10px ' + D.FONT_SANS;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText('支路1：' + n1 + ' 个串联', cx, yTop - 52);
          ctx.fillText('支路2：' + n2 + ' 个串联', cx, yBot + 30);
        } else {
          const x0 = cx - 130;
          [0, 1, 2].forEach(i => {
            const x = x0 + i * 130;
            drawBox(x, cy, 'r' + (i + 1));
            if (i) wire(x - 130 + boxW / 2, cy, x - boxW / 2, cy);
          });
          wire(x0 - 60, cy, x0 - boxW / 2, cy);
          wire(x0 + 260 + boxW / 2, cy, x0 + 320, cy);
          ctx.beginPath();
          D.roundRectPath(ctx, x0 + 130 - 52, cy + 54, 104, 32, 7);
          ctx.fillStyle = D.withAlpha(C('--accent'), 0.18); ctx.fill();
          ctx.strokeStyle = C('--accent'); ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = C('--accent'); ctx.font = '700 11.5px ' + D.FONT_SANS;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('≥ 2 个正常', x0 + 130, cy + 70);
          wire(x0 + 130, cy + boxH / 2, x0 + 130, cy + 54);
        }

        // 可靠度标尺
        const barY = H_ - 40, barX = 40, barW = W_ - 80, barH = 16;
        ctx.fillStyle = D.withAlpha(T['--line'], 0.6);
        ctx.beginPath(); D.roundRectPath(ctx, barX, barY, barW, barH, 8); ctx.fill();
        ctx.beginPath(); D.roundRectPath(ctx, barX, barY, Math.max(2, barW * R), barH, 8);
        ctx.fillStyle = D.withAlpha(C('--green'), 0.85); ctx.fill();
        ctx.beginPath(); D.roundRectPath(ctx, barX, barY - 10, Math.max(2, barW * r), barH + 20, 8);
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 1.4; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = C('--brand'); ctx.font = '600 10px ' + D.FONT_MONO;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('单部件 r = ' + r.toFixed(2), barX, barY - 12);
        ctx.fillStyle = C('--green'); ctx.textAlign = 'right';
        ctx.fillText('系统 R = ' + R.toFixed(4), barX + barW, barY - 12);
        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(formula() + '　→　R = ' + R.toFixed(4), barX, barY + barH + 6);
      });
      scene.static();

      UI.readout(out, [
        ['结构', mode === 'series' ? '串联（n=' + n + '）' : mode === 'parallel' ? '并联（n=' + n + '）' : mode === 'mixed' ? '混合（n=' + n + '）' : '2/3 表决'],
        ['含义', scheme()],
        ['单个部件可靠度 r', f3(r)],
        ['系统可靠度 R', f4(rel())],
        ['与单部件之差', f4(rel() - r)],
        ['公式', formula()]
      ]);
    }
    draw();
  };

  /* ================================================================
     1.9b 首次成功模型：几何等待次数的分布与期望
     ================================================================ */
  W.firstSuccess = function (host) {
    const { ctrl, out, scene } = UI.shell(host, 300);
    let p = 0.3, K = 10, m = 3, trials = 3000, seed = 20260910;

    UI.slider(ctrl, { label: '成功概率 p', min: 0.05, max: 0.9, step: 0.01, value: p, fmt: v => v.toFixed(2), onInput: v => { p = v; draw(); } });
    UI.slider(ctrl, { label: '显示最大次数 K', min: 6, max: 16, value: K, onInput: v => { K = v; draw(); } });
    UI.slider(ctrl, { label: '已失败次数 m（无记忆性）', min: 1, max: 6, value: m, onInput: v => { m = v; draw(); } });
    UI.slider(ctrl, { label: '模拟轮数', min: 500, max: 8000, step: 500, value: trials, onInput: v => { trials = v; draw(); } });
    UI.slider(ctrl, { label: '随机种子', min: 1, max: 999, value: seed % 1000, onInput: v => { seed = v; draw(); } });

    function draw() {
      const T = D.Theme.cache;
      const rand = S.rng(seed * 7919 + 13);
      const xs = new Array(trials);
      const cnt = new Array(K + 2).fill(0);
      let aboveM = 0, aboveMN = 0;
      for (let t = 0; t < trials; t++) {
        let k = 1;
        while (k <= 400 && rand() >= p) k++;
        xs[t] = k;
        if (k <= K) cnt[k]++; else cnt[K + 1]++;
        if (k > m) { aboveM++; if (k > m + 3) aboveMN++; }
      }
      const freq = cnt.map(c => c / trials);
      const theory = k => k >= 1 && k <= K ? S.geom.pmf(k, p) : Math.pow(1 - p, K);
      const maxP = Math.max(...freq, ...Array.from({ length: K + 1 }, (_, i) => theory(i + 1)), 0.05);
      const EX = 1 / p, DX = (1 - p) / (p * p);
      const memTheory = Math.pow(1 - p, 3);
      const memSim = aboveM > 0 ? aboveMN / aboveM : NaN;

      scene.clearLayers();
      scene.layer((sc, ctx) => {
        const W_ = sc.w, H_ = sc.h;
        const padL = 54, padR = 30, padT = 48, padB = 58;
        const pw = W_ - padL - padR, ph = H_ - padT - padB;
        const slot = pw / (K + 1);
        const bw = Math.min(34, slot * 0.6);
        const Y = v => padT + ph - v / maxP * ph;
        const X = k => padL + slot * (k - 0.5);

        ctx.fillStyle = T['--ink-2']; ctx.font = '700 11.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('首次成功所需试验次数 X 的分布：P{X=k} = (1−p)^(k−1) p，p = ' + p.toFixed(2), padL, padT - 14);

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

        for (let k = 1; k <= K + 1; k++) {
          const cx = X(k);
          const th = theory(k);
          const h = (padT + ph) - Y(th);
          ctx.beginPath();
          D.roundRectPath(ctx, cx - bw / 2, Y(th), bw, h, 3);
          ctx.fillStyle = D.withAlpha(k === K + 1 ? C('--ink-3') : C('--brand'), 0.5);
          ctx.fill();
          const fy = Y(freq[k] || 0);
          ctx.beginPath(); ctx.arc(cx, fy, 4, 0, D.TAU);
          ctx.fillStyle = C('--red'); ctx.fill();
          ctx.strokeStyle = T['--card']; ctx.lineWidth = 1.6; ctx.stroke();
          ctx.fillStyle = T['--ink-3']; ctx.font = '500 9.5px ' + D.FONT_MONO;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(k === K + 1 ? '>' + K : k, cx, padT + ph + 6);
        }

        // 期望竖线
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = C('--green'); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(padL + Math.min(pw, Math.max(0, (EX - 0.5) / (K + 1) * pw)), padT);
        ctx.lineTo(padL + Math.min(pw, Math.max(0, (EX - 0.5) / (K + 1) * pw)), padT + ph + 14);
        ctx.stroke();
        ctx.restore();
        const exPx = padL + D.clamp((EX - 0.5) / (K + 1), 0, 1) * pw;
        ctx.fillStyle = C('--green'); ctx.font = '700 10.5px ' + D.FONT_MONO;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('E(X) = 1/p = ' + EX.toFixed(2), D.clamp(exPx, 90, W_ - 90), padT + 2);

        ctx.fillStyle = T['--ink-2']; ctx.font = '600 10.5px ' + D.FONT_SANS;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText('柱＝理论概率；红点＝' + trials + ' 轮模拟频率；绿色虚线＝期望 1/p', padL, H_ - 8);
        ctx.fillStyle = T['--ink-3']; ctx.font = '500 10px ' + D.FONT_MONO;
        ctx.textAlign = 'right';
        ctx.fillText('无记忆性：P{X>' + (m + 3) + ' | X>' + m + '} 理论 ' + memTheory.toFixed(3) + '，模拟 ' + (isFinite(memSim) ? memSim.toFixed(3) : '—'), W_ - 12, H_ - 8);
      });
      scene.static();

      UI.readout(out, [
        ['p', f2(p)],
        ['P{X=1}', f4(S.geom.pmf(1, p))],
        ['P{X=' + K + '}', f4(S.geom.pmf(K, p))],
        ['P{X>' + K + '}', f4(Math.pow(1 - p, K))],
        ['E(X) = 1/p', f4(EX)],
        ['D(X) = (1−p)/p²', f4(DX)],
        ['无记忆性：P{X>m+3|X>m}', '理论 ' + f4(memTheory) + '；模拟 ' + (isFinite(memSim) ? f4(memSim) : '—')],
        ['模拟均值', f4(xs.reduce((a, b) => a + b, 0) / trials)]
      ]);
    }
    draw();
  };

})(window);
