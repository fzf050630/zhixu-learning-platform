/* ============================================================
   calc4.js — 第4章 向量代数和空间解析几何 可视化组件
   vectorOps3d：向量的线性运算、数量积、向量积
   planeLine：平面与直线的方程、夹角与距离
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const { C, f2, f3 } = UI;

  const A = {
    add: (u, v) => u.map((x, i) => x + v[i]),
    sub: (u, v) => u.map((x, i) => x - v[i]),
    dot: (u, v) => u.reduce((s, x, i) => s + x * v[i], 0),
    cross: (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]],
    len: u => Math.sqrt(A.dot(u, u)),
    scale: (u, k) => u.map(x => x * k)
  };
  const fmt = u => `(${u.map(x => (Math.round(x * 100) / 100)).join(', ')})`;

  function makeScene(host, height) {
    return UI.shell(host, height || 320);
  }

  /* 等轴投影 */
  function projector(w, h, scale) {
    const cx = w / 2 - 20, cy = h / 2 + 30;
    const s = scale || 42;
    return p => [cx + (p[0] - p[2] * 0.62) * s, cy - (p[1] + p[2] * 0.42) * s];
  }

  /* ---------- 向量运算 ---------- */
  W.vectorOps3d = function (host) {
    const s = makeScene(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'add' };
    const a = [2.4, 1.4, 0.8], b = [0.6, 2.0, 1.6], c = [0.4, 0.6, 1.8];
    UI.seg(ctrl, [
      { label: 'a + b', value: 'add' }, { label: 'a − b', value: 'sub' },
      { label: 'a · b', value: 'dot' }, { label: 'a × b', value: 'cross' }, { label: '混合积 [a,b,c]', value: 'mix' }
    ], v => { state.mode = v; render(); }, 0);

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const P = projector(p.w, p.h, 40);
        const O = P([0, 0, 0]);
        // 坐标轴
        [[[3.6, 0, 0], 'x'], [[0, 3.0, 0], 'y'], [[0, 0, 3.0], 'z']].forEach(([v, name]) => {
          const E = P(v);
          G_arrow(ctx, O, E, D.withAlpha(T['--ink-3'], 0.6), 1.2);
          G_text(ctx, E[0], E[1] - 6, name, T['--ink-3'], 11);
        });
        const va = P(a), vb = P(b), vc = P(c);
        const colors = { a: C('--brand'), b: C('--purple'), c: C('--teal') };
        G_arrow(ctx, O, va, colors.a, 2.6, 'a');
        G_arrow(ctx, O, vb, colors.b, 2.6, 'b');
        if (state.mode === 'mix') G_arrow(ctx, O, vc, colors.c, 1.8, 'c');

        if (state.mode === 'add' || state.mode === 'sub') {
          const r = state.mode === 'add' ? A.add(a, b) : A.sub(a, b);
          const vr = P(r);
          // 平行四边形辅助线
          G_arrow(ctx, va, vr, D.withAlpha(colors.b, 0.5), 1.4);
          G_arrow(ctx, vb, vr, D.withAlpha(colors.a, 0.5), 1.4);
          G_arrow(ctx, O, vr, C('--red'), 2.8, state.mode === 'add' ? 'a+b' : 'a−b');
        } else if (state.mode === 'dot') {
          const d = A.dot(a, b);
          const cos = d / (A.len(a) * A.len(b));
          G_text(ctx, p.w / 2, 22, `a · b = ${d.toFixed(3)}　|a| = ${A.len(a).toFixed(3)}　|b| = ${A.len(b).toFixed(3)}　cosθ = ${cos.toFixed(4)}`, T['--ink'], 12, true);
          G_text(ctx, p.w / 2, 44, `θ ≈ ${(Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI).toFixed(2)}°　夹角为锐角 ⇔ a·b > 0`, T['--ink-3'], 11, false, true);
        } else if (state.mode === 'cross') {
          const r = A.cross(a, b), vr = P(r);
          G_arrow(ctx, O, vr, C('--red'), 2.8, 'a×b');
          G_text(ctx, p.w / 2, p.h - 16, `a × b = ${fmt(r)}　|a×b| = ${A.len(r).toFixed(3)} = |a||b|sinθ（平行四边形面积）`, T['--ink'], 12, true);
        } else {
          const r = A.cross(b, c), mix = A.dot(a, r);
          G_arrow(ctx, O, P(r), D.withAlpha(C('--red'), 0.6), 1.6, 'b×c');
          G_text(ctx, p.w / 2, p.h - 16, `[a,b,c] = a·(b×c) = ${mix.toFixed(3)}　|混合积| = 平行六面体体积`, T['--ink'], 12, true);
        }
      });
      scene.render();
      const msgs = {
        add: ['a + b', fmt(A.add(a, b)), '平行四边形法则：首尾相接'],
        sub: ['a − b', fmt(A.sub(a, b)), '指向被减向量'],
        dot: ['a · b', A.dot(a, b).toFixed(3), '数量积是数，不是向量'],
        cross: ['a × b', fmt(A.cross(a, b)), '向量积是向量，垂直于 a、b'],
        mix: ['[a,b,c]', A.dot(a, A.cross(b, c)).toFixed(3), '三个向量共面 ⇔ 混合积为 0']
      }[state.mode];
      UI.readout(out, [['运算', msgs[0]], ['结果', msgs[1]], ['几何意义', msgs[2]],
        ['|a|,|b|', `${A.len(a).toFixed(3)}, ${A.len(b).toFixed(3)}`]]);
    }
    render();
    return s;
  };

  function G_arrow(ctx, p1, p2, color, width, label) {
    const ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
    ctx.beginPath();
    const h = 9;
    ctx.moveTo(p2[0], p2[1]);
    ctx.lineTo(p2[0] - h * Math.cos(ang - 0.4), p2[1] - h * Math.sin(ang - 0.4));
    ctx.lineTo(p2[0] - h * Math.cos(ang + 0.4), p2[1] - h * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    ctx.restore();
    if (label) G_text(ctx, p2[0] + 12, p2[1] - 8, label, color, 12, true);
  }
  function G_text(ctx, x, y, text, color, size, mono, align) {
    ctx.save();
    ctx.fillStyle = color || '#333';
    ctx.font = `700 ${size || 12}px ${mono ? D.FONT_MONO : D.FONT_SANS}`;
    ctx.textAlign = align ? 'left' : 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* ---------- 平面与直线 ---------- */
  W.planeLine = function (host) {
    const s = makeScene(host, 310);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'plane' };
    UI.seg(ctrl, [
      { label: '平面与法向量', value: 'plane' },
      { label: '直线与方向向量', value: 'line' },
      { label: '直线与平面的夹角', value: 'angle' },
      { label: '点到平面的距离', value: 'dist' }
    ], v => { state.mode = v; render(); }, 0);
    const n = [1, 1.4, 0.9], d0 = -2.4;

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const P = (q) => {
          const w = p.w, h = p.h;
          return [w / 2 + (q[0] - q[2] * 0.62) * 40, h / 2 + 30 - (q[1] + q[2] * 0.42) * 40];
        };
        if (state.mode === 'plane' || state.mode === 'dist' || state.mode === 'angle') {
          // 平面：在平面上取一点与两个方向向量
          const nn = n;
          const pt = A.scale(nn, -d0 / A.dot(nn, nn));
          let u = A.cross(nn, [0, 0, 1]);
          if (A.len(u) < 1e-6) u = A.cross(nn, [0, 1, 0]);
          u = A.scale(u, 1 / A.len(u));
          const v = A.scale(A.cross(nn, u), 1 / A.len(u));
          const corners = [[-1.6, -1.6], [1.6, -1.6], [1.6, 1.6], [-1.6, 1.6]].map(([s1, t1]) => A.add(pt, A.add(A.scale(u, s1), A.scale(v, t1))));
          ctx.save();
          ctx.beginPath();
          corners.forEach((c2, i) => { const q = P(c2); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
          ctx.closePath();
          ctx.fillStyle = D.withAlpha(C('--brand'), 0.1); ctx.fill();
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.5); ctx.lineWidth = 1.2; ctx.stroke();
          ctx.restore();
          // 法向量
          G_arrow(ctx, P(pt), P(A.add(pt, A.scale(nn, 1.3))), C('--red'), 2.4, 'n');
          G_text(ctx, p.w / 2, 20, `平面：${nn.map((x, i) => `${x.toFixed(1)}${['x', 'y', 'z'][i]}`).join(' + ')} = ${(-d0).toFixed(1)}　（点法式 n·(r − r₀) = 0）`, T['--ink'], 12, true);
          if (state.mode === 'dist') {
            const q = [0.4, -1.2, 1.8];
            const dist = Math.abs(A.dot(nn, q) + d0) / A.len(nn);
            const foot = A.sub(q, A.scale(nn, (A.dot(nn, q) + d0) / A.dot(nn, nn)));
            G_arrow(ctx, P(q), P(foot), C('--accent'), 2, '');
            G_text(ctx, p.w / 2, p.h - 18, `点 P${fmt(q)} 到平面距离 d = |n·P + D| / |n| = ${dist.toFixed(4)}`, T['--ink'], 12, true);
          }
          if (state.mode === 'angle') {
            const dir = [1.1, -0.5, 0.9];
            const start = A.add(pt, A.scale(dir, -1.2));
            G_arrow(ctx, P(start), P(A.add(pt, A.scale(dir, 1.6))), C('--teal'), 2.2, 's');
            const sinphi = Math.abs(A.dot(nn, dir)) / (A.len(nn) * A.len(dir));
            G_text(ctx, p.w / 2, p.h - 18, `直线方向 s 与平面夹角 φ：sin φ = |n·s| / (|n||s|) = ${sinphi.toFixed(4)} → φ ≈ ${(Math.asin(Math.min(1, sinphi)) * 180 / Math.PI).toFixed(2)}°`, T['--ink'], 12, true);
          }
        } else {
          // 直线
          const pt = [0.4, 0.6, 0.4], dir = [1.2, 1.0, 0.7];
          ctx.save();
          ctx.strokeStyle = C('--teal'); ctx.lineWidth = 2.6;
          ctx.beginPath();
          const q1 = P(A.add(pt, A.scale(dir, -2.4))), q2 = P(A.add(pt, A.scale(dir, 2.4)));
          ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
          ctx.restore();
          G_arrow(ctx, P(pt), P(A.add(pt, dir)), C('--red'), 2.4, 's（方向向量）');
          G_text(ctx, p.w / 2, 20, `直线：参数式 (x, y, z) = (x₀, y₀, z₀) + t·s　对称式 (x − x₀)/m = (y − y₀)/n = (z − z₀)/p`, T['--ink'], 12, true);
          const q = [1.8, -0.4, 1.6];
          const cross1 = A.cross(A.sub(q, pt), dir), dist = A.len(cross1) / A.len(dir);
          G_text(ctx, p.w / 2, p.h - 18, `点 Q${fmt(q)} 到直线距离 = |s × (Q − P)| / |s| = ${dist.toFixed(4)}`, T['--ink'], 12, true);
        }
      });
      scene.render();
      const msgs = {
        plane: ['平面方程', '点法式 n·(r − r₀) = 0；一般式 Ax + By + Cz + D = 0'],
        line: ['直线方程', '点向式 r = r₀ + t·s；两点式'],
        angle: ['夹角', '直线与平面：sin φ = |n·s|/(|n||s|)'],
        dist: ['点到平面距离', 'd = |Ax₀+By₀+Cz₀+D| / √(A²+B²+C²)']
      }[state.mode];
      UI.readout(out, [['当前', msgs[0]], ['公式', msgs[1]], ['法向量 n', fmt(n)]]);
    }
    render();
    return s;
  };

  /* ---------- 二次曲面（三维投影 + 截痕） ---------- */
  W.quadricSurfaces = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { kind: 'ellip', theta: 35, z0: 0.8 };
    const TAU = Math.PI * 2;

    UI.seg(ctrl, [
      { label: '椭球面', value: 'ellip' }, { label: '椭圆抛物面', value: 'para' },
      { label: '圆锥面', value: 'cone' }, { label: '圆柱面', value: 'cyl' }
    ], v => { state.kind = v; render(); }, 0);
    const thS = UI.slider(ctrl, {
      label: '旋转角 θ', min: 0, max: 350, step: 5, value: 35,
      fmt: v => v + '°', onInput: v => { state.theta = v; render(); }
    });
    UI.slider(ctrl, {
      label: '截平面高度 z₀', min: -1.6, max: 1.6, step: 0.05, value: 0.8,
      fmt: v => v.toFixed(2), onInput: v => { state.z0 = v; render(); }
    });
    UI.transport(ctrl, { total: 36, speed: 110, onChange: k => { state.theta = k * 10; thS.set(state.theta); render(); } });

    const META = {
      ellip: { name: '椭球面', eq: 'x²/a² + y²/b² + z²/c² = 1（a = 1.7, b = 1.25, c = 1.45）', key: '有界封闭曲面，关于三个坐标面均对称' },
      para: { name: '椭圆抛物面', eq: 'z = (x² + y²) / 3（a = b，旋转抛物面）', key: '顶点在原点，开口向上的“碗”形，z ≥ 0' },
      cone: { name: '圆锥面', eq: 'x² + y² = (z / 1.4)²（顶点在原点，z 轴为对称轴）', key: '由过原点的直线绕 z 轴旋转而成，上下两叶' },
      cyl: { name: '圆柱面', eq: 'x² + y² = 1.35²（母线平行于 z 轴）', key: '方程缺 z：准线为圆，母线平行于 z 轴' }
    };

    function surfaceLines(kind) {
      const lines = [];
      if (kind === 'ellip') {
        const a = 1.7, b = 1.25, c = 1.45;
        for (let i = 0; i < 16; i++) {
          const u = i / 16 * TAU, pts = [];
          for (let j = 0; j <= 16; j++) {
            const v = -Math.PI / 2 + Math.PI * j / 16;
            pts.push([a * Math.cos(v) * Math.cos(u), b * Math.cos(v) * Math.sin(u), c * Math.sin(v)]);
          }
          lines.push(pts);
        }
        for (let j = 1; j < 16; j++) {
          const v = -Math.PI / 2 + Math.PI * j / 16, pts = [];
          for (let i = 0; i <= 24; i++) {
            const u = i / 24 * TAU;
            pts.push([a * Math.cos(v) * Math.cos(u), b * Math.cos(v) * Math.sin(u), c * Math.sin(v)]);
          }
          lines.push(pts);
        }
      } else if (kind === 'para') {
        for (let x = -2; x <= 2.01; x += 0.4) {
          const pts = [];
          for (let y = -2; y <= 2.01; y += 0.2) pts.push([x, y, (x * x + y * y) / 3]);
          lines.push(pts);
        }
        for (let y = -2; y <= 2.01; y += 0.4) {
          const pts = [];
          for (let x = -2; x <= 2.01; x += 0.2) pts.push([x, y, (x * x + y * y) / 3]);
          lines.push(pts);
        }
      } else if (kind === 'cone') {
        for (let i = 0; i < 12; i++) {
          const u = i / 12 * TAU, pts = [];
          for (let z = -2; z <= 2.01; z += 0.25) {
            const r = Math.abs(z) / 1.4;
            pts.push([r * Math.cos(u), r * Math.sin(u), z]);
          }
          lines.push(pts);
        }
        [-1.6, -1.2, -0.8, -0.4, 0.4, 0.8, 1.2, 1.6].forEach(z => {
          const r = Math.abs(z) / 1.4, pts = [];
          for (let i = 0; i <= 24; i++) { const u = i / 24 * TAU; pts.push([r * Math.cos(u), r * Math.sin(u), z]); }
          lines.push(pts);
        });
      } else {
        for (let i = 0; i < 12; i++) {
          const u = i / 12 * TAU, pts = [];
          for (let z = -2; z <= 2.01; z += 0.25) pts.push([1.35 * Math.cos(u), 1.35 * Math.sin(u), z]);
          lines.push(pts);
        }
        [-2, -1.2, -0.4, 0.4, 1.2, 2].forEach(z => {
          const pts = [];
          for (let i = 0; i <= 24; i++) { const u = i / 24 * TAU; pts.push([1.35 * Math.cos(u), 1.35 * Math.sin(u), z]); }
          lines.push(pts);
        });
      }
      return lines;
    }

    function sectionCurve(kind, z0) {
      if (kind === 'ellip') {
        const a = 1.7, b = 1.25, c = 1.45;
        if (Math.abs(z0) >= c - 0.02) return null;
        const k = Math.sqrt(1 - (z0 / c) * (z0 / c)), pts = [];
        for (let i = 0; i <= 48; i++) { const u = i / 48 * TAU; pts.push([a * k * Math.cos(u), b * k * Math.sin(u), z0]); }
        return pts;
      }
      if (kind === 'para') {
        if (z0 <= 0.03) return null;
        const r = Math.sqrt(3 * z0), pts = [];
        for (let i = 0; i <= 48; i++) { const u = i / 48 * TAU; pts.push([r * Math.cos(u), r * Math.sin(u), z0]); }
        return pts;
      }
      if (kind === 'cone') {
        if (Math.abs(z0) <= 0.1) return null;
        const r = Math.abs(z0) / 1.4, pts = [];
        for (let i = 0; i <= 48; i++) { const u = i / 48 * TAU; pts.push([r * Math.cos(u), r * Math.sin(u), z0]); }
        return pts;
      }
      const pts = [];
      for (let i = 0; i <= 48; i++) { const u = i / 48 * TAU; pts.push([1.35 * Math.cos(u), 1.35 * Math.sin(u), Math.max(-1.6, Math.min(1.6, z0))]); }
      return pts;
    }

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const panelW = Math.max(122, Math.min(216, p.w * 0.3));
        const B = { x: 18, y: 42, w: Math.max(130, p.w - panelW - 46), h: p.h - 74 };
        const th = state.theta * Math.PI / 180;
        const ct = Math.cos(th), st = Math.sin(th);
        const scale = Math.min(B.w, B.h) / 6.8;
        const cx = B.x + B.w / 2, cy = B.y + B.h / 2;
        const PR = (x, y, z) => {
          const xr = x * ct - y * st, yr = x * st + y * ct;
          return [cx + xr * scale, cy - z * scale * 0.95 + yr * scale * 0.42];
        };
        const depth = (x, y) => x * st + y * ct;
        const kind = state.kind, z0 = state.z0;

        // 截平面方块
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--ink-3'], 0.45);
        ctx.setLineDash([5, 4]); ctx.lineWidth = 1;
        ctx.beginPath();
        [[-2.4, -2.4], [2.4, -2.4], [2.4, 2.4], [-2.4, 2.4]].forEach(([x, y], i) => {
          const q = PR(x, y, z0); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]);
        });
        ctx.closePath(); ctx.stroke(); ctx.restore();

        // 线框（按深度排序，先远后近）
        const lines = surfaceLines(kind).map(pts => {
          let dsum = 0;
          pts.forEach(q => { dsum += depth(q[0], q[1]); });
          return { pts, d: dsum / pts.length };
        }).sort((l1, l2) => l1.d - l2.d);
        const dMin = lines[0].d, dMax = lines[lines.length - 1].d || 1;
        lines.forEach(L => {
          const t = (L.d - dMin) / Math.max(1e-6, dMax - dMin);
          ctx.save();
          ctx.strokeStyle = D.withAlpha(C('--brand'), 0.18 + 0.5 * t);
          ctx.lineWidth = 1 + 0.6 * t;
          ctx.beginPath();
          L.pts.forEach((q, i) => { const s2 = PR(q[0], q[1], q[2]); i ? ctx.lineTo(s2[0], s2[1]) : ctx.moveTo(s2[0], s2[1]); });
          ctx.stroke(); ctx.restore();
        });

        // 坐标轴
        const O = PR(0, 0, -2.3), Zt = PR(0, 0, 2.45);
        G_arrow(ctx, O, Zt, D.withAlpha(T['--ink-3'], 0.85), 1.3);
        G_text(ctx, Zt[0] + 10, Zt[1] - 6, 'z', T['--ink-3'], 11, true);
        const Xt = PR(2.9, 0, 0), Yt = PR(0, 2.9, 0);
        G_arrow(ctx, PR(0, 0, 0), Xt, D.withAlpha(T['--ink-3'], 0.7), 1.2);
        G_arrow(ctx, PR(0, 0, 0), Yt, D.withAlpha(T['--ink-3'], 0.7), 1.2);
        G_text(ctx, Xt[0], Xt[1] + 12, 'x', T['--ink-3'], 11, true);
        G_text(ctx, Yt[0], Yt[1] + 12, 'y', T['--ink-3'], 11, true);

        // 截痕与投影
        const sec = sectionCurve(kind, z0);
        let secText;
        if (kind === 'ellip') secText = sec ? '椭圆（x² / (a cos v₀)² + y² / (b cos v₀)² = 1）' : 'z₀ 接近 ±c，截痕退化为点';
        else if (kind === 'para') secText = sec ? `圆 x² + y² = ${(3 * z0).toFixed(2)}（a = b）` : '抛物面只有 z ≥ 0，z₀ < 0 时无交线';
        else if (kind === 'cone') secText = sec ? `圆 x² + y² = ${(z0 / 1.4 * z0 / 1.4).toFixed(2)}（|z₀| > 0）` : 'z₀ = 0 时截痕退化为顶点';
        else secText = '圆 x² + y² = 1.35²（与 z₀ 无关，任一水平截面都是等圆）';
        if (sec) {
          // 投影到 z = −2.3 平面
          ctx.save();
          ctx.setLineDash([5, 4]); ctx.strokeStyle = D.withAlpha(C('--red'), 0.6); ctx.lineWidth = 1.2;
          ctx.beginPath();
          sec.forEach((q, i) => { const s2 = PR(q[0], q[1], -2.3); i ? ctx.lineTo(s2[0], s2[1]) : ctx.moveTo(s2[0], s2[1]); });
          ctx.stroke(); ctx.restore();
          ctx.save();
          ctx.strokeStyle = C('--red'); ctx.lineWidth = 2.4;
          ctx.beginPath();
          sec.forEach((q, i) => { const s2 = PR(q[0], q[1], q[2]); i ? ctx.lineTo(s2[0], s2[1]) : ctx.moveTo(s2[0], s2[1]); });
          ctx.stroke(); ctx.restore();
        }
        if (kind === 'cone' && Math.abs(z0) <= 0.1) D.G.dot(ctx, PR(0, 0, 0)[0], PR(0, 0, 0)[1], 4, C('--red'));

        D.G.label(ctx, 16, 18, '二次曲面：拖动 θ 旋转三维投影，拖动 z₀ 移动截平面观察截痕（红线）', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });

        // 右侧信息面板
        const px0 = p.w - panelW - 4;
        const M = META[kind];
        const rows = [
          ['曲面', M.name], ['截痕 z = z₀', secText], ['截平面', `z = ${z0.toFixed(2)}`],
          ['旋转角 θ', state.theta + '°']
        ];
        rows.forEach((r, i) => {
          const y = 26 + i * 46;
          D.G.box(ctx, px0, y, panelW, 40, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          D.G.label(ctx, px0 + 8, y + 12, r[0], { align: 'left', size: 10, color: T['--ink-3'] });
          D.G.fitted(ctx, px0 + 8, y + 28, r[1], panelW - 16, { size: 10.5, weight: 700, align: 'left', color: T['--brand'], mono: true });
        });
        const ny = 26 + rows.length * 46;
        D.G.box(ctx, px0, ny, panelW, Math.max(70, p.h - ny - 10), { fill: D.withAlpha(C('--teal'), 0.08), stroke: D.withAlpha(C('--teal'), 0.4), radius: 7 });
        D.G.label(ctx, px0 + 8, ny + 14, '标准方程', { align: 'left', size: 10.5, weight: 700, color: C('--teal') });
        wrapText(D, ctx, px0 + 8, ny + 28, panelW - 16, M.eq, 9.5, T['--ink-2']);
        D.G.label(ctx, px0 + 8, ny + 72, '特征', { align: 'left', size: 10.5, weight: 700, color: C('--teal') });
        wrapText(D, ctx, px0 + 8, ny + 86, panelW - 16, M.key, 9.5, T['--ink-2']);
      });
      scene.render();
      const M = META[state.kind];
      UI.readout(out, [
        ['曲面', M.name],
        ['标准方程', M.eq],
        ['截痕（z = z₀）', state.kind === 'para' && state.z0 <= 0.03 ? '无（z₀ ≤ 0）' : state.kind === 'cone' && Math.abs(state.z0) <= 0.1 ? '退化为顶点' : state.kind === 'ellip' ? '椭圆（截痕法：平面截曲面）' : '圆'],
        ['要点', M.key]
      ]);
    }
    render();
    return s;
  };

  /* 简易多行文本（按空格断行，优先整词换行） */
  function wrapText(D2, ctx, x, y, maxW, text, size, color) {
    ctx.save();
    ctx.font = `600 ${size}px ${D2.FONT_SANS}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    let line = '', ly = y;
    String(text).split(' ').forEach(tok => {
      if (!line) { line = tok; return; }
      if (ctx.measureText(line + ' ' + tok).width > maxW) { ctx.fillText(line, x, ly); ly += size + 4; line = tok; }
      else line += ' ' + tok;
    });
    if (line) {
      while (ctx.measureText(line).width > maxW && line.length > 4) line = line.slice(0, -2) + '…';
      ctx.fillText(line, x, ly);
    }
    ctx.restore();
  }

})(window);
