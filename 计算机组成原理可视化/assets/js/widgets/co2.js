/* ============================================================
   co2.js — 第2章 数据的表示和运算 可视化组件
   baseConvert：进制转换    fixedCode：原/反/补/移码
   twosAdd：补码加减与溢出  ieeeFloat：IEEE 754 编码
   floatAdd：浮点加减步骤   adder：串行/先行进位单元
   overflowDetect：溢出判定（Cf 异或 C(n−1) 与双符号位）
   adderCompare：串行 / 分组先行 / 全先行的进位延时对比
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const B = global.Bits;
  const G = D.G, C = UI.C;

  /* ---------- 进制转换 ---------- */
  W.baseConvert = function (host) {
    const s = UI.shell(host, 250);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { text: '2026', base: 10 };

    const bases = [{ label: '十进制', value: 10 }, { label: '二进制', value: 2 }, { label: '八进制', value: 8 }, { label: '十六进制', value: 16 }];
    const seg = UI.seg(ctrl, bases, v => { state.base = v; read(); }, 0);
    const inp = UI.text(ctrl, { label: '输入值', value: state.text, width: 160 });
    inp.input.addEventListener('input', () => { state.text = inp.value; read(); });

    function read() {
      let v = B.parseBase(state.text, state.base);
      if (!isFinite(v)) { scene.clearLayers(); scene.render(); UI.readout(out, [['输入无效', state.text]]); return; }
      const signed = v < 0;
      const abs = Math.abs(v);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const rows = [
          ['十进制 (DEC)', String(v), T['--brand']],
          ['二进制 (BIN)', (signed ? '-' : '') + B.toBase(abs, 2), T['--purple']],
          ['八进制 (OCT)', (signed ? '-' : '') + B.toBase(abs, 8), T['--teal']],
          ['十六进制 (HEX)', (signed ? '-' : '') + B.toBase(abs, 16), T['--accent']]
        ];
        const rh = 40, y0 = 20;
        rows.forEach((r, i) => {
          const y = y0 + i * rh;
          G.box(ctx, 16, y, p.w - 32, rh - 8, {
            fill: i === 0 ? D.withAlpha(r[2], 0.12) : T['--card-2'],
            stroke: D.withAlpha(r[2], 0.5), radius: 8
          });
          G.label(ctx, 30, y + (rh - 8) / 2, r[0], { align: 'left', size: 12, weight: 700, color: r[2] });
          ctx.save();
          ctx.fillStyle = T['--ink'];
          ctx.font = `700 ${r[1].length > 26 ? 13 : 17}px ${D.FONT_MONO}`;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(B.group(r[1], 4), p.w - 30, y + (rh - 8) / 2);
          ctx.restore();
        });
        const k = B.group(B.toBase(abs, 2), 4).split(' ').length;
        G.label(ctx, p.w / 2, p.h - 12, `二进制共 ${(abs === 0 ? 1 : B.toBase(abs, 2).length)} 位 · 按 4 位分组对应 1 位十六进制`, { size: 11, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['十进制', B.int(v)],
        ['二进制', B.group(B.toBase(abs, 2), 4)],
        ['十六进制', '0x' + B.toBase(abs, 16)],
        ['位数', String(abs === 0 ? 1 : B.toBase(abs, 2).length)]
      ]);
    }
    read();
    return s;
  };

  /* ---------- 原码 / 反码 / 补码 / 移码 ---------- */
  W.fixedCode = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { value: -45, bits: 8 };

    UI.slider(ctrl, {
      label: '真值 x', min: -128, max: 127, step: 1, value: state.value,
      fmt: v => v, onInput: v => { state.value = v; render(); }
    });
    UI.seg(ctrl, [{ label: '8 位', value: 8 }, { label: '16 位', value: 16 }], v => {
      state.bits = v;
      const lim = v === 8 ? 127 : 32767;
      state.value = Math.max(-lim - 1, Math.min(lim, state.value));
      render();
    }, 0);

    function codes() {
      const n = state.bits;
      const x = state.value;
      const abs = Math.abs(x);
      const sign = x < 0 ? '1' : '0';
      const mag = B.toBits(abs, n - 1);
      const trueMag = B.toBits(abs, n);
      const ones = x < 0 ? trueMag.split('').map(c => c === '0' ? '1' : '0').join('') : B.toBits(x, n);
      const twos = B.toTwosBits(x, n);
      const bias = Math.pow(2, n - 1);
      const shift = B.toBits(((x + bias) % Math.pow(2, n) + Math.pow(2, n)) % Math.pow(2, n), n);
      return {
        n,
        yuan: x >= 0 ? B.toBits(x, n) : sign + mag,
        fan: x >= 0 ? B.toBits(x, n) : sign + ones.slice(1),
        bu: twos,
        yi: shift
      };
    }

    function render() {
      const c = codes();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const rows = [
          ['原码', c.yuan, c.n, T['--brand']],
          ['反码', c.fan, c.n, T['--purple']],
          ['补码', c.bu, c.n, T['--green']],
          ['移码', c.yi, c.n, T['--accent']]
        ];
        const rh = 44, y0 = 16;
        rows.forEach((r, i) => {
          const y = y0 + i * rh;
          const isBu = r[0] === '补码';
          G.box(ctx, 16, y, 62, rh - 8, { fill: D.withAlpha(r[3], 0.14), stroke: D.withAlpha(r[3], 0.55), radius: 8, title: r[0], titleColor: r[3], titleSize: 12.5 });
          const bx = 88, bwid = p.w - 88 - 16;
          const cell = Math.min(30, bwid / r[2]);
          const gx = bx + (bwid - cell * r[2]) / 2;
          r[1].split('').forEach((ch, k) => {
            const cx = gx + k * cell;
            const isSign = k === 0;
            const col = isSign ? T['--red'] : (ch === '1' ? r[3] : T['--ink-3']);
            G.box(ctx, cx, y + 2, cell - 3, rh - 12, {
              fill: ch === '1' ? D.withAlpha(col, 0.16) : T['--card-2'],
              stroke: D.withAlpha(col, isSign ? 0.9 : 0.55), radius: 5
            });
            G.label(ctx, cx + (cell - 3) / 2, y + 2 + (rh - 12) / 2, ch, {
              size: Math.min(15, cell - 8), weight: ch === '1' ? 800 : 600,
              color: ch === '1' ? col : T['--ink-3'], mono: true
            });
            if (isSign) G.label(ctx, cx + (cell - 3) / 2, y + rh - 3, '符号', { size: 9, color: T['--red'] });
          });
          if (isBu && state.value < 0) {
            G.label(ctx, 16 + 31, y + rh - 2, '自低位到高位、符号位不变', { size: 9.5, color: T['--ink-3'] });
          }
        });
        G.label(ctx, p.w / 2, p.h - 8, `真值 x = ${state.value}　·　${c.n} 位机器数`, { size: 11.5, color: T['--ink-2'], mono: false });
      });
      scene.render();
      const desc = state.value >= 0 ? '正数的原、反、补码完全相同' : '负数：反码 = 原码数值位取反；补码 = 反码 + 1';
      UI.readout(out, [
        ['真值', state.value],
        ['补码十进制', String(B.fromBits(c.bu) - (c.bu[0] === '1' ? Math.pow(2, c.n) : 0))],
        ['补码无符号值', String(B.fromBits(c.bu))],
        ['规则', desc]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 补码加减与溢出 ---------- */
  W.twosAdd = function (host) {
    const s = UI.shell(host, 270);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { a: 100, b: 50, bits: 8, sub: false };

    UI.slider(ctrl, { label: 'A', min: -128, max: 127, step: 1, value: state.a, fmt: v => v, onInput: v => { state.a = v; render(); } });
    UI.slider(ctrl, { label: 'B', min: -128, max: 127, step: 1, value: state.b, fmt: v => v, onInput: v => { state.b = v; render(); } });
    UI.seg(ctrl, [{ label: 'A + B', value: false }, { label: 'A − B', value: true }], v => { state.sub = v; render(); }, 0);
    UI.seg(ctrl, [{ label: '8 位', value: 8 }, { label: '16 位', value: 16 }], v => { state.bits = v; render(); }, 0);

    function render() {
      const n = state.bits;
      const lim = Math.pow(2, n - 1);
      const A = Math.max(-lim, Math.min(lim - 1, state.a));
      const Bv = Math.max(-lim, Math.min(lim - 1, state.b));
      const operand = state.sub ? -Bv : Bv;
      const aBits = B.toTwosBits(A, n);
      const bBits = B.toTwosBits(operand, n);
      const sum = A + operand;
      const sBits = B.toTwosBits(sum, n);
      const carryOut = (B.fromBits(aBits) + B.fromBits(bBits)) >= Math.pow(2, n);
      const overflow = (A >= 0 && operand >= 0 && sum >= lim) || (A < 0 && operand < 0 && sum < -lim);

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const drawRow = (y, label, bits, color, mark) => {
          G.label(ctx, 14, y + 12, label, { align: 'left', size: 12.5, weight: 700, color });
          const bwid = p.w - 150;
          const cell = Math.min(26, bwid / n);
          const gx = 90;
          bits.split('').forEach((ch, k) => {
            G.box(ctx, gx + k * cell, y, cell - 3, 24, {
              fill: ch === '1' ? D.withAlpha(color, 0.16) : T['--card-2'],
              stroke: D.withAlpha(color, 0.5), radius: 4
            });
            G.label(ctx, gx + k * cell + (cell - 3) / 2, y + 12, ch, { size: Math.min(14, cell - 8), weight: 700, color: ch === '1' ? color : T['--ink-3'], mono: true });
          });
          if (mark) G.label(ctx, p.w - 12, y + 12, mark, { align: 'right', size: 11, color: T['--ink-3'], mono: true });
        };
        drawRow(16, state.sub ? 'A 的补码' : 'A 的补码', aBits, T['--brand']);
        drawRow(52, (state.sub ? '−B（B 求补）' : 'B 的补码'), bBits, T['--purple'], carryOut ? '+1 进位' : '');
        // 分隔线
        ctx.save(); ctx.strokeStyle = T['--line-2']; ctx.setLineDash([4, 4]); ctx.beginPath();
        ctx.moveTo(90, 84); ctx.lineTo(p.w - 20, 84); ctx.stroke(); ctx.restore();
        drawRow(92, '[A ± B]', sBits, overflow ? T['--red'] : T['--green'], overflow ? '溢出' : '无溢出');

        const badge = overflow ? '溢出：结果超出 ' + n + ' 位补码范围' : '结果正确';
        G.box(ctx, 14, 136, p.w - 28, 44, {
          fill: D.withAlpha(overflow ? T['--red'] : T['--green'], 0.1),
          stroke: D.withAlpha(overflow ? T['--red'] : T['--green'], 0.6), radius: 10
        });
        G.label(ctx, p.w / 2, 150, badge, { size: 13, weight: 700, color: overflow ? T['--red'] : T['--green'] });
        G.label(ctx, p.w / 2, 170, `真值 ${A} ${state.sub ? '−' : '+'} ${Bv} = ${sum}　·　机器数按 ${n} 位截断后为 ${B.toSigned(sBits)}`, { size: 11, color: T['--ink-2'], mono: true });
        G.label(ctx, p.w / 2, 196, overflow ? '判断：最高位进位 Cf 与次高位进位 C(n-1) 不同 → 溢出' : '判断：Cf 与 C(n-1) 相同 → 无溢出', { size: 11, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['A', A], ['B', Bv], ['A ± B (真值)', sum],
        ['补码结果', B.toSigned(sBits)],
        ['溢出', overflow ? '是' : '否']
      ]);
      out.querySelectorAll('.kv b')[4].className = overflow ? 'bad' : 'ok';
    }
    render();
    return s;
  };

  /* ---------- IEEE 754 ---------- */
  W.ieeeFloat = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { value: 12.375 };

    UI.note(host, 'IEEE 754 单精度：1 位符号 S、8 位阶码 E（移码，偏置 127）、23 位尾数 M（隐含最高位 1）。值 = (−1)^S × 1.M × 2^(E−127)。');
    UI.slider(ctrl, {
      label: '十进制数', min: -100, max: 100, step: 0.125, value: state.value,
      fmt: v => v.toFixed(3).replace(/\.?0+$/, ''), onInput: v => { state.value = v; render(); }
    });
    const inp = UI.number(ctrl, { label: '精确值', value: state.value, step: 0.125, min: -1e6, max: 1e6, width: 110 });
    inp.onChange(v => { if (isFinite(v)) { state.value = v; render(); } });

    function render() {
      const x = state.value;
      const bits = B.f32.encode(x);
      const pp = B.f32.parts(bits);
      const expReal = pp.eRaw - 127;
      const sign = pp.sign === '1' ? -1 : 1;
      const mant = 1 + pp.fVal;
      const val = sign * mant * Math.pow(2, expReal);

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.bits(ctx, 16, 40, p.w - 32, 52, {
          groups: [
            { bits: 1, name: 'S 符号', value: pp.sign, color: T['--red'], range: '31' },
            { bits: 8, name: 'E 阶码 (移码)', value: pp.exp, color: T['--brand'], range: '30 ─ 23' },
            { bits: 23, name: 'M 尾数（隐含 1）', value: pp.frac, color: T['--purple'], range: '22 ─ 0' }
          ],
          valueSize: 13, alpha: 0.18
        });
        const rows = [
          ['符号 S', pp.sign === '1' ? '1 → 负数' : '0 → 正数', T['--red']],
          ['阶码 E', `${pp.exp}₂ = ${pp.eRaw} → 真实阶 = ${pp.eRaw} − 127 = ${expReal}`, T['--brand']],
          ['尾数 M', `1.${pp.frac || '0'}₂ = ${mant.toFixed(8)}`, T['--purple']],
          ['还原值', `(${sign < 0 ? '−' : '+'}) × 1.${pp.frac || '0'} × 2^${expReal} = ${B.dec(val, 8)}`, T['--green']]
        ];
        rows.forEach((r, i) => {
          const y = 132 + i * 34;
          G.box(ctx, 16, y, p.w - 32, 28, { fill: D.withAlpha(r[2], 0.08), stroke: D.withAlpha(r[2], 0.4), radius: 7 });
          G.label(ctx, 28, y + 14, r[0], { align: 'left', size: 11.5, weight: 700, color: r[2] });
          ctx.save();
          ctx.fillStyle = T['--ink'];
          ctx.font = `600 11.5px ${D.FONT_MONO}`;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(r[1], p.w - 28, y + 14);
          ctx.restore();
        });
      });
      scene.render();
      const bitstr = B.group(bits, 4);
      UI.readout(out, [
        ['机器数', bitstr],
        ['十六进制', '0x' + parseInt(bits, 2).toString(16).toUpperCase().padStart(8, '0')],
        ['还原值', B.dec(val, 8)],
        ['误差', B.dec(val - x, 10)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 浮点数加减运算步骤 ---------- */
  W.floatAdd = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { a: 1.25, b: 0.0625, step: 0 };
    const steps = ['对阶（小阶向大阶看齐）', '尾数加减', '规格化', '舍入', '溢出判断'];

    UI.slider(ctrl, { label: 'X', min: -8, max: 8, step: 0.0625, value: state.a, fmt: v => v.toFixed(4).replace(/\.?0+$/, ''), onInput: v => { state.a = v; render(); } });
    UI.slider(ctrl, { label: 'Y', min: -8, max: 8, step: 0.0625, value: state.b, fmt: v => v.toFixed(4).replace(/\.?0+$/, ''), onInput: v => { state.b = v; render(); } });
    const t = UI.transport(ctrl, { total: steps.length, onChange: i => { state.step = i; render(); } });

    function decompose(x) {
      if (x === 0) return { s: 0, e: 0, m: 0 };
      const sg = x < 0 ? 1 : 0;
      let e = Math.floor(Math.log2(Math.abs(x)));
      let m = Math.abs(x) / Math.pow(2, e);
      return { s: sg, e, m };
    }

    function render() {
      const A = decompose(state.a), Bv = decompose(state.b);
      const big = A.e >= Bv.e ? A : Bv;
      const small = A.e >= Bv.e ? Bv : A;
      const d = big.e - small.e;
      const shift = small.m / Math.pow(2, d);
      const sumM = big.m + shift;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const rows = [
          ['① 对阶', `X: 2^${A.e}×${A.m.toFixed(4)}　Y: 2^${Bv.e}×${Bv.m.toFixed(4)}　→ 阶差 ${d}，小阶尾数右移 ${d} 位`, T['--brand']],
          ['② 尾数相加', `${big.m.toFixed(6)} + ${shift.toFixed(6)} = ${sumM.toFixed(6)}`, T['--purple']],
          ['③ 规格化', sumM >= 2 || sumM < 1 ? `调整 → 2^${big.e + (sumM >= 2 ? 1 : 0)}×${(sumM >= 2 ? sumM / 2 : sumM * 2).toFixed(6)}` : `已规格化 2^${big.e}×${sumM.toFixed(6)}`, T['--teal']],
          ['④ 舍入', '尾数超出机器位宽时按就近/0舍1入处理，此处保留 6 位', T['--accent']],
          ['⑤ 溢出判断', '阶码超出表示范围 → 上溢/下溢；尾数溢出可通过右规消除', T['--green']]
        ];
        rows.forEach((r, i) => {
          const y = 14 + i * 34;
          const on = i === state.step;
          G.box(ctx, 16, y, p.w - 32, 28, {
            fill: on ? D.withAlpha(r[2], 0.14) : T['--card-2'],
            stroke: on ? D.withAlpha(r[2], 0.85) : T['--line'], width: on ? 1.6 : 1, radius: 7
          });
          G.label(ctx, 28, y + 14, r[0], { align: 'left', size: 11.5, weight: 700, color: r[2] });
          ctx.save(); ctx.fillStyle = T['--ink'];
          ctx.font = `600 11px ${D.FONT_MONO}`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
          ctx.fillText(r[1], p.w - 28, y + 14); ctx.restore();
        });
      });
      scene.render();
      UI.readout(out, [['X + Y', B.dec(state.a + state.b, 8)], ['当前步骤', steps[state.step]]]);
    }
    render();
    return s;
  };

  /* ---------- 加法器：串行进位 vs 先行进位 ---------- */
  W.adder = function (host) {
    const s = UI.shell(host, 290);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { a: 11, b: 6, cla: false, bit: 0 };

    UI.slider(ctrl, { label: 'A', min: 0, max: 15, step: 1, value: state.a, fmt: v => v + ' (' + B.toBits(v, 4) + ')', onInput: v => { state.a = v; render(); } });
    UI.slider(ctrl, { label: 'B', min: 0, max: 15, step: 1, value: state.b, fmt: v => v + ' (' + B.toBits(v, 4) + ')', onInput: v => { state.b = v; render(); } });
    UI.seg(ctrl, [{ label: '串行进位', value: false }, { label: '并行进位 CLA', value: true }], v => { state.cla = v; render(); }, 0);
    const t = UI.transport(ctrl, { total: 5, onChange: i => { state.bit = i; render(); } });

    function render() {
      const a = B.toBits(state.a, 4), b = B.toBits(state.b, 4);
      const carries = [0];
      let sum = '';
      for (let i = 0; i < 4; i++) {
        const ai = +a[3 - i], bi = +b[3 - i], ci = carries[i];
        const si = ai ^ bi ^ ci;
        carries.push((ai && bi) || (ci && (ai ^ bi)) ? 1 : 0);
        sum = si + sum;
      }
      const result = B.fromBits(sum) + (carries[4] ? 16 : 0);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const n = 4, gap = (p.w - 60) / n, y = 66, bh = 56;
        for (let i = 0; i < n; i++) {
          const x = 30 + (n - 1 - i) * gap;
          const idx = i; // 从低位到高位
          const active = state.cla ? true : idx <= state.bit;
          const c = carries[idx] === 1 ? T['--red'] : T['--line-2'];
          G.box(ctx, x, y, gap - 18, bh, {
            fill: active ? D.withAlpha(T['--brand'], 0.14) : T['--card-2'],
            stroke: active ? T['--brand'] : T['--line'], radius: 8
          });
          G.label(ctx, x + (gap - 18) / 2, y - 26, `A${idx}=${a[3 - idx]}　B${idx}=${b[3 - idx]}`, { size: 10, color: T['--ink-3'], mono: true });
          G.label(ctx, x + (gap - 18) / 2, y + 16, '全加器', { size: 11, weight: 700, color: T['--brand'] });
          G.label(ctx, x + (gap - 18) / 2, y + 36, 'S' + idx + '=' + (sum[3 - idx] ?? '0'), { size: 12, weight: 800, color: T['--green'], mono: true });
          G.label(ctx, x + (gap - 18) / 2, y + bh + 12, 'C' + (idx + 1) + '=' + carries[idx + 1], { size: 10.5, weight: 700, color: c, mono: true });
          if (idx < n - 1) {
            const arrowActive = state.cla || idx < state.bit;
            G.arrow(ctx, [[x + 4, y + bh / 2], [x - (gap - 18) + 14, y + bh / 2]], {
              color: arrowActive ? T['--red'] : D.withAlpha(T['--line-2'], 0.8), width: arrowActive ? 2 : 1.2, head: 5
            });
          }
        }
        G.label(ctx, p.w / 2, 22, state.cla ? '先行进位：各位进位同时产生，延迟与位数无关' : `串行进位：进位逐级传递，已传播到第 ${Math.min(state.bit, 3)} 位`, { size: 12, weight: 700, color: state.cla ? T['--purple'] : T['--brand'] });
        G.box(ctx, 16, p.h - 46, p.w - 32, 36, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 28, p.h - 28, `A + B = ${state.a} + ${state.b} = ${result}`, { align: 'left', size: 13, weight: 700, color: T['--ink'], mono: true });
        G.label(ctx, p.w - 28, p.h - 28, state.cla ? '进位延迟 O(1)' : `进位延迟 ∝ ${state.bit + 1} 级`, { align: 'right', size: 11, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['和', String(result)],
        ['进位输出 Cf', String(carries[4])],
        ['延迟', state.cla ? '与位数无关（并行）' : (state.bit + 1) + ' 级门延迟']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 补码溢出的两种判定 ---------- */
  W.overflowDetect = function (host) {
    const s = UI.shell(host, 372);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { a: 100, b: 50, n: 8 };

    UI.note(host, '补码的符号位参与运算：<b>单符号位法</b>——最高位进位 Cf 与次高位进位 C(n−1) 不同则溢出；<b>双符号位法</b>——变形补码结果的两个符号位 01 为正溢出、10 为负溢出。注意溢出 ≠ 进位。');
    const aS = UI.slider(ctrl, { label: 'A', min: -128, max: 127, step: 1, value: state.a, fmt: v => v, onInput: v => { state.a = v; render(); } });
    const bS = UI.slider(ctrl, { label: 'B', min: -128, max: 127, step: 1, value: state.b, fmt: v => v, onInput: v => { state.b = v; render(); } });
    UI.seg(ctrl, [{ label: '8 位', value: 8 }, { label: '4 位', value: 4 }], v => {
      state.n = v;
      const lim = Math.pow(2, v - 1);
      aS.input.min = -lim; aS.input.max = lim - 1;
      bS.input.min = -lim; bS.input.max = lim - 1;
      state.a = D.clamp(state.a, -lim, lim - 1);
      state.b = D.clamp(state.b, -lim, lim - 1);
      aS.set(state.a); bS.set(state.b);
      render();
    }, 0);

    function render() {
      const n = state.n, lim = Math.pow(2, n - 1);
      const A = D.clamp(state.a, -lim, lim - 1);
      const Bv = D.clamp(state.b, -lim, lim - 1);
      const aBits = B.toTwosBits(A, n), bBits = B.toTwosBits(Bv, n);
      const into = new Array(n).fill(0);
      let cf = 0;
      for (let i = n - 1; i >= 0; i--) {
        into[i] = cf;
        cf = ((+aBits[i]) + (+bBits[i]) + cf) >> 1;
      }
      const cHigh = into[0];               // 进入符号位（最高位）的进位，即次高位进位
      const ovf = cf !== cHigh;
      const sum = A + Bv;
      const sBits = B.toTwosBits(sum, n);
      const dA = B.toTwosBits(A, n + 1), dB = B.toTwosBits(Bv, n + 1), dS = B.toTwosBits(sum, n + 1);
      const dsign = dS.slice(0, 2);
      const kind = dsign === '01' ? '正溢出' : (dsign === '10' ? '负溢出' : '正常');

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 104;
        const cell = Math.min(26, (p.w - x0 - 30) / (n + 1));
        const drawRow = (y, label, bits, color, signBits) => {
          G.label(ctx, 14, y + 12, label, { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
          bits.split('').forEach((ch, i) => {
            const isSign = signBits && i < signBits;
            const col = isSign ? T['--red'] : color;
            G.box(ctx, x0 + i * cell, y, cell - 3, 24, {
              fill: ch === '1' ? D.withAlpha(col, 0.16) : T['--card-2'],
              stroke: D.withAlpha(col, isSign ? 0.9 : 0.5), width: isSign ? 1.4 : 1.2, radius: 4
            });
            G.label(ctx, x0 + i * cell + (cell - 3) / 2, y + 12, ch, {
              size: Math.min(14, cell - 8), weight: 700,
              color: ch === '1' ? col : T['--ink-3'], mono: true
            });
          });
        };

        G.label(ctx, 14, 14, '① 单符号位法：Cf ⊕ C(n−1) = 1 → 溢出', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        drawRow(28, 'A 的补码', aBits, T['--brand'], 1);
        drawRow(58, 'B 的补码', bBits, T['--purple'], 1);
        ctx.save(); ctx.strokeStyle = T['--line-2']; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(x0, 90); ctx.lineTo(p.w - 20, 90); ctx.stroke(); ctx.restore();
        drawRow(94, '[A ± B]补', sBits, ovf ? T['--red'] : T['--green'], 1);

        const bx = x0 + cell, ex = x0;
        G.arrow(ctx, [[bx, 119], [bx, 127]], { color: T['--purple'], width: 1.5, head: 5 });
        G.label(ctx, bx + 4, 136, 'C(n−1)=' + cHigh, { align: 'left', size: 9.5, weight: 700, color: T['--purple'], mono: true });
        G.arrow(ctx, [[ex, 119], [ex, 127]], { color: T['--red'], width: 1.5, head: 5 });
        G.label(ctx, ex - 4, 136, 'Cf=' + cf, { align: 'right', size: 9.5, weight: 700, color: T['--red'], mono: true });

        const okc = ovf ? T['--red'] : T['--green'];
        G.box(ctx, 14, 150, p.w - 28, 34, { fill: D.withAlpha(okc, 0.1), stroke: D.withAlpha(okc, 0.55), radius: 8 });
        G.label(ctx, 28, 167, `Cf ⊕ C(n−1) = ${cf} ⊕ ${cHigh} = ${cf !== cHigh ? 1 : 0} → ${ovf ? '溢出' : '无溢出'}`, { align: 'left', size: 12, weight: 700, color: okc, mono: true });
        G.label(ctx, p.w - 28, 167, `符号位进位与最高位进位方向相反才有溢出`, { align: 'right', size: 10.5, color: T['--ink-3'] });

        G.label(ctx, 14, 200, '② 双符号位法（变形补码：符号位扩展为两位）', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        drawRow(212, '变形 A', dA, T['--brand'], 2);
        drawRow(238, '变形 B', dB, T['--purple'], 2);
        drawRow(264, '变形和', dS, ovf ? T['--red'] : T['--green'], 2);
        G.label(ctx, x0 + cell * (n + 1) + 6, 276, `高位符号位 = ${dsign[0]}，低位符号位 = ${dsign[1]}`, { align: 'left', size: 9.5, color: T['--ink-3'] });

        G.box(ctx, 14, 296, p.w - 28, 48, {
          fill: D.withAlpha(ovf ? T['--red'] : T['--green'], 0.12),
          stroke: D.withAlpha(ovf ? T['--red'] : T['--green'], 0.65), width: 1.6, radius: 10
        });
        G.label(ctx, 28, 313, ovf ? `溢出（${kind}）：真值 ${sum} 超出 ${n} 位补码范围` : `无溢出：真值 ${sum} 在 ${n} 位补码范围内`, { align: 'left', size: 12.5, weight: 800, color: ovf ? T['--red'] : T['--green'] });
        G.label(ctx, 28, 332, `可表示范围 [−${lim}, ${lim - 1}]；机器数截断后 [A+B]补 = ${sBits}（按补码读作 ${B.toSigned(sBits)}）`, { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, p.w / 2, 360, '双符号位只用于运算过程，最终仍保存单符号位的结果；01/10 表示溢出，00/11 表示结果正常', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['A', String(A)], ['B', String(Bv)], ['真值 A + B', String(sum)],
        ['Cf / C(n−1)', cf + ' / ' + cHigh],
        ['变形补码符号位', dsign + '（' + kind + '）'],
        ['是否溢出', ovf ? '是（' + kind + '）' : '否']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 串行 / 分组先行 / 全先行 进位延时对比 ---------- */
  W.adderCompare = function (host) {
    const s = UI.shell(host, 360);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { n: 8, cla: false, k: 0 };
    let total = 8;

    UI.note(host, '串行进位加法器进位逐级传递，n 位约需 n 级门延迟；先行进位用 Gᵢ = AᵢBᵢ、Pᵢ = Aᵢ⊕Bᵢ 同时算出各位进位，延时几乎与位数无关；位数大时用 4 位一组的<b>分组先行进位</b>折中。');
    UI.seg(ctrl, [{ label: '串行进位', value: false }, { label: '先行进位 CLA', value: true }], v => {
      state.cla = v; state.k = 0; buildTransport(); render();
    }, 0);
    UI.slider(ctrl, {
      label: '位数 n', min: 4, max: 32, step: 4, value: 8, fmt: v => v + ' 位',
      onInput: v => { state.n = v; state.k = 0; buildTransport(); render(); }
    });

    function buildTransport() {
      const old = ctrl.querySelector('.transport-viz');
      if (old) old.remove();
      total = state.cla ? 4 : state.n;
      state.k = 0;
      UI.transport(ctrl, { total: total, onChange: i => { state.k = i; render(); } });
    }
    buildTransport();

    function render() {
      const n = state.n, cla = state.cla;
      const TT = D.Theme.cache;
      const groups = Math.ceil(n / 4);
      const bars = [
        { name: '串行进位', tot: n, seg: [1, n - 2, 1], c: TT['--red'] },
        { name: '分组先行', tot: groups + 3, seg: [1, groups + 1, 1], c: TT['--purple'] },
        { name: '全先行 CLA', tot: 4, seg: [1, 2, 1], c: TT['--green'] }
      ];
      const cur = cla ? bars[2] : bars[0];
      const tick = state.k + 1;
      const phase = cla
        ? (tick <= 1 ? '第 1 拍：各位同时产生 Gᵢ、Pᵢ'
          : tick <= 3 ? '第 2~3 拍：由 G、P 展开，所有进位同时产生'
            : '第 4 拍：各位求和完成，输出结果')
        : (tick <= 1 ? '第 1 拍：产生 Gᵢ、Pᵢ，最低位求和' : `第 ${tick} 拍：进位 C${Math.min(tick - 1, n)} 传到第 ${Math.min(tick - 1, n - 1)} 位`);
      const pass = cla ? (state.k >= 1 ? n : 0) : Math.min(state.k, n - 1);

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, p.w / 2, 16, phase, { size: 12.5, weight: 700, color: cla ? T['--purple'] : T['--brand'] });
        G.label(ctx, p.w / 2, 34, 'Gᵢ = AᵢBᵢ（进位产生）　Pᵢ = Aᵢ⊕Bᵢ（进位传递）　Cᵢ₊₁ = Gᵢ + PᵢCᵢ', { size: 10.5, color: T['--ink-3'], mono: true });

        const bwid = Math.min(56, (p.w - 64) / n), sx = (p.w - bwid * n) / 2, cy = 62, chh = 40;
        for (let i = 0; i < n; i++) {
          const x = sx + i * bwid;
          const reached = i <= pass;
          const fs = bwid >= 30 ? 10.5 : (bwid >= 20 ? 9 : 8);
          G.box(ctx, x + 1, cy, bwid - 2, chh, {
            fill: reached ? D.withAlpha(T['--brand'], 0.2) : T['--card-2'],
            stroke: reached ? T['--brand'] : T['--line'], width: reached ? 1.4 : 1, radius: 5
          });
          G.label(ctx, x + bwid / 2, cy + 13, bwid >= 24 ? 'FA' + i : String(i), { size: fs, weight: 700, color: reached ? T['--brand'] : T['--ink-3'], mono: bwid < 24 });
          G.label(ctx, x + bwid / 2, cy + 29, 'S' + i, { size: fs, weight: 700, color: reached ? T['--green'] : T['--ink-3'], mono: true });
          if (i < n - 1) {
            const on = pass > i;
            G.arrow(ctx, [[x + bwid - 4, cy + chh / 2], [x + bwid + 3, cy + chh / 2]], {
              color: on ? T['--red'] : D.withAlpha(T['--line-2'], 0.9), width: on ? 2 : 1, head: 4
            });
            if (bwid >= 22) G.label(ctx, x + bwid, cy + chh + 11, 'C' + (i + 1), { size: 9, weight: 700, color: on ? T['--red'] : T['--ink-3'], mono: true });
          }
        }
        G.label(ctx, 16, cy + chh + 11, '低位', { align: 'left', size: 9.5, color: T['--ink-3'] });
        G.label(ctx, p.w - 16, cy + chh + 11, '高位', { align: 'right', size: 9.5, color: T['--ink-3'] });

        G.label(ctx, 16, 138, '总延时对比（单位：门延迟 τ，长度按串行延时归一）', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const bx0 = 118, bw = p.w - bx0 - 78;
        bars.forEach((b, bi) => {
          const y = 156 + bi * 42;
          const isCur = cla ? bi === 2 : bi === 0;
          const at = (tick / total) * b.tot;
          G.label(ctx, bx0 - 12, y + 13, b.name, { align: 'right', size: 11.5, weight: 700, color: b.c });
          let cx = bx0, cum = 0;
          b.seg.forEach((sg, si) => {
            const sw = bw * sg / n;
            const a0 = cum, a1 = cum + sg;
            const active = at > a0 - 0.001 && at <= a1 + 0.001;
            cum = a1;
            G.box(ctx, cx, y, sw - 1, 26, {
              fill: D.withAlpha(b.c, active ? 0.5 : (isCur ? 0.26 : 0.12)),
              stroke: active ? b.c : D.withAlpha(b.c, isCur ? 0.7 : 0.35), width: active ? 1.6 : 1, radius: 4
            });
            if (sw > 34) G.label(ctx, cx + sw / 2, y + 13, sg + 'τ', { size: 9.5, weight: 700, color: active ? T['--ink'] : T['--ink-2'], mono: true });
            cx += sw;
          });
          G.label(ctx, p.w - 20, y + 13, b.tot + 'τ', { align: 'right', size: 12, weight: 800, color: b.c, mono: true });
        });

        const sp = cur.tot ? bars[0].tot / cur.tot : 1;
        G.box(ctx, 16, 288, p.w - 32, 56, { fill: D.withAlpha(cur.c, 0.1), stroke: D.withAlpha(cur.c, 0.5), radius: 9 });
        G.label(ctx, 28, 306, `${cla ? '先行进位（全并行）' : '串行进位'}：总延时约 ${cur.tot} τ，相对串行加速约 ${sp.toFixed(2)} ×`, { align: 'left', size: 12, weight: 700, color: cur.c });
        G.label(ctx, 28, 326, cla ? '进位同时产生，延时与位数无关；位数多时扇入过大，工程上用分组先行进位。' : '进位逐级传递，延时随位数线性增长，是并行加法器的速度瓶颈。', { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, p.w / 2, 352, '并行（各位同时算）≠ 并行进位：串行进位加法器各位并行求和，但进位仍需串行传递', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['位数 n', String(n)],
        ['当前方式', cla ? '先行进位 CLA' : '串行进位'],
        ['总延时', cur.tot + ' τ'],
        ['串行延时', bars[0].tot + ' τ'],
        ['加速比', (bars[0].tot / cur.tot).toFixed(2) + ' ×']
      ]);
    }
    render();
    return s;
  };

})(window);
