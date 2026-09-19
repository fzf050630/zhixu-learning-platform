/* ============================================================
   net2.js — 第2章 物理层 可视化组件
   nyquistShannon：奈氏准则 / 香农定理极限速率
   encoding：数字数据编码（NRZ / 曼彻斯特 / 差分曼彻斯特 / AMI）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 奈氏 / 香农 ---------- */
  W.nyquistShannon = function (host) {
    const s = UI.shell(host, 290);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { w: 3, m: 4, snr: 30 };
    UI.slider(ctrl, { label: '带宽 W', min: 1, max: 20, step: 1, value: 3, fmt: v => v + ' kHz', onInput: v => { state.w = v; render(); } });
    UI.slider(ctrl, { label: '码元种类 M', min: 2, max: 16, step: 2, value: 4, fmt: v => v, onInput: v => { state.m = v; render(); } });
    UI.slider(ctrl, { label: '信噪比', min: 0, max: 60, step: 1, value: 30, fmt: v => v + ' dB', onInput: v => { state.snr = v; render(); } });

    function render() {
      const Wk = state.w * 1000;
      const nyq = 2 * Wk * Math.log2(state.m);
      const snr = Math.pow(10, state.snr / 10);
      const shannon = Wk * Math.log2(1 + snr);
      const limit = Math.min(nyq, shannon);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 两条曲线：固定 W，变化 M / SNR
        const boxW = p.w - 60, boxH = p.h - 120, x0 = 40, y0 = 40;
        const maxRate = Math.max(2 * Wk * Math.log2(16), Wk * Math.log2(1 + Math.pow(10, 6)));
        const X = m => x0 + (Math.log2(m) / Math.log2(16)) * boxW;
        const Y = r => y0 + boxH - Math.min(1, r / maxRate) * boxH;
        // 坐标
        ctx.save(); ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + boxH); ctx.lineTo(x0 + boxW, y0 + boxH); ctx.stroke(); ctx.restore();
        G.label(ctx, x0 + boxW, y0 + boxH + 14, 'M（码元种类，对数）', { align: 'right', size: 10, color: T['--ink-3'] });
        G.label(ctx, x0 - 6, y0 + 4, '速率', { align: 'right', size: 10, color: T['--ink-3'] });
        // 奈氏曲线
        ctx.save(); ctx.strokeStyle = T['--brand']; ctx.lineWidth = 2; ctx.beginPath();
        for (let m = 2; m <= 16; m++) { const x = X(m), y = Y(2 * Wk * Math.log2(m)); m === 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.restore();
        // 香农水平线
        ctx.save(); ctx.strokeStyle = T['--purple']; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
        ctx.moveTo(X(2), Y(shannon)); ctx.lineTo(X(16), Y(shannon)); ctx.stroke(); ctx.restore();
        // 当前点
        G.dot(ctx, X(state.m), Y(nyq), 5, T['--brand'], true);
        G.dot(ctx, X(state.m), Y(shannon), 4, T['--purple'], true);
        // 图例
        G.label(ctx, x0 + 12, y0 + 14, '奈氏准则（无噪声）', { align: 'left', size: 10.5, weight: 700, color: T['--brand'] });
        G.label(ctx, x0 + 12, y0 + 30, '香农定理（有噪声）', { align: 'left', size: 10.5, weight: 700, color: T['--purple'] });
        // 结果
        G.box(ctx, 16, p.h - 66, p.w - 32, 52, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 28, p.h - 48, `奈氏：2W·log₂M = 2×${state.w}kHz×log₂${state.m} = ${(nyq / 1000).toFixed(1)} kbps`, { align: 'left', size: 11, color: T['--brand'], mono: true });
        G.label(ctx, 28, p.h - 28, `香农：W·log₂(1+S/N) = ${state.w}kHz×log₂(1+${snr.toFixed(1)}) = ${(shannon / 1000).toFixed(1)} kbps`, { align: 'left', size: 11, color: T['--purple'], mono: true });
        G.label(ctx, p.w - 28, p.h - 38, `实际极限 ≈ ${(limit / 1000).toFixed(1)} kbps`, { align: 'right', size: 12, weight: 700, color: T['--green'] });
      });
      scene.render();
      UI.readout(out, [
        ['奈氏速率', (nyq / 1000).toFixed(1) + ' kbps'],
        ['香农速率', (shannon / 1000).toFixed(1) + ' kbps'],
        ['实际极限', (limit / 1000).toFixed(1) + ' kbps'],
        ['S/N', snr.toFixed(1)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 数字数据编码 ---------- */
  W.encoding = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { bits: '1011001', scheme: 'manchester' };
    const inp = UI.text(ctrl, { label: '比特串', value: state.bits, width: 160 });
    inp.input.addEventListener('input', () => { state.bits = inp.value.replace(/[^01]/g, ''); render(); });
    UI.seg(ctrl, [
      { label: 'NRZ', value: 'nrz' }, { label: '曼彻斯特', value: 'manchester' },
      { label: '差分曼彻斯特', value: 'diff' }, { label: 'AMI', value: 'ami' }
    ], v => { state.scheme = v; render(); }, 1);

    function render() {
      const bits = state.bits || '0';
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 50, w = p.w - 80, unit = w / bits.length;
        const hi = 50, lo = 110;   // y for level 1 / 0
        G.label(ctx, 30, (hi + lo) / 2, '电平', { align: 'right', size: 10, color: T['--ink-3'] });
        // 基线
        ctx.save(); ctx.strokeStyle = T['--line']; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(x0, hi); ctx.lineTo(x0 + w, hi); ctx.moveTo(x0, lo); ctx.lineTo(x0 + w, lo); ctx.stroke(); ctx.restore();
        G.label(ctx, x0 - 8, hi, '+', { align: 'right', size: 10, color: T['--ink-3'] });
        G.label(ctx, x0 - 8, lo, '0', { align: 'right', size: 10, color: T['--ink-3'] });

        let lastLevel = 0;
        const drawLevel = (xa, xb, y, color) => {
          ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath();
          ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.stroke(); ctx.restore();
        };
        const drawVert = (x, y1, y2, color) => {
          ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.beginPath();
          ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke(); ctx.restore();
        };
        bits.split('').forEach((b, k) => {
          const xa = x0 + k * unit, xb = xa + unit;
          G.label(ctx, xa + unit / 2, lo + 40, b, { size: 12, weight: 700, color: T['--ink-2'], mono: true });
          if (state.scheme === 'nrz') {
            const y = b === '1' ? hi : lo;
            if (lastLevel !== y) drawVert(xa, lastLevel, y, T['--brand']);
            drawLevel(xa, xb, y, T['--brand']); lastLevel = y;
          } else if (state.scheme === 'manchester') {
            const y1 = b === '1' ? hi : lo, y2 = b === '1' ? lo : hi;
            drawVert(xa, lastLevel, y1, T['--brand']); drawLevel(xa, xa + unit / 2, y1, T['--brand']);
            drawVert(xa + unit / 2, y1, y2, T['--accent']); drawLevel(xa + unit / 2, xb, y2, T['--accent']);
            lastLevel = y2;
          } else if (state.scheme === 'diff') {
            // 每比特中间跳变；比特开始处跳变表示0，不跳变表示1
            const mid1 = hi, mid2 = lo;
            const startY = lastLevel;
            const shouldToggle = b === '0';
            const baseY = shouldToggle ? (startY === hi ? lo : hi) : startY;
            drawVert(xa, startY, baseY, T['--brand']);
            const a1 = baseY, a2 = baseY === hi ? lo : hi;
            drawLevel(xa, xa + unit / 2, a1, T['--brand']);
            drawVert(xa + unit / 2, a1, a2, T['--accent']);
            drawLevel(xa + unit / 2, xb, a2, T['--accent']);
            lastLevel = a2;
          } else {
            // AMI：0 无电平，1 交替正负
            if (b === '0') { drawLevel(xa, xb, (hi + lo) / 2, T['--ink-3']); lastLevel = (hi + lo) / 2; }
            else { const y = lastLevel === hi ? lo : hi; drawVert(xa, lastLevel, y, T['--teal']); drawLevel(xa, xb, y, T['--teal']); lastLevel = y; }
          }
        });
        G.box(ctx, 16, p.h - 42, p.w - 32, 30, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
        const desc = {
          nrz: 'NRZ：高电平表示 1、低电平表示 0，简单但缺乏同步信息',
          manchester: '曼彻斯特：每比特中间必有跳变，自带同步；用高→低表示 1，低→高表示 0',
          diff: '差分曼彻斯特：比特开始处有跳变表示 0，无跳变表示 1；中间必跳变',
          ami: 'AMI：0 为中间电平，1 交替取正负电平，无直流分量'
        };
        G.label(ctx, p.w / 2, p.h - 27, desc[state.scheme], { size: 11, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [['编码方案', { nrz: 'NRZ', manchester: '曼彻斯特', diff: '差分曼彻斯特', ami: 'AMI' }[state.scheme]], ['比特数', String(bits.length)]]);
    }
    render();
    return s;
  };

})(window);
