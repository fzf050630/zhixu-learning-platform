/* ============================================================
   net3.js — 第3章 数据链路层 可视化组件
   framing：组帧与透明传输（零比特填充 / 字节填充）
   crc：循环冗余校验 CRC
   slidingWindow：停止等待 / GBN / SR 与信道利用率
   csmaCd：CSMA/CD 与二进制指数退避
   switchLearn：交换机自学习与转发
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 组帧 ---------- */
  W.framing = function (host) {
    const s = UI.shell(host, 250);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { payload: '0111111011111100', mode: 'bit' };
    const inp = UI.text(ctrl, { label: '数据', value: state.payload, width: 200 });
    inp.input.addEventListener('input', () => { state.payload = inp.value.replace(/[^01]/g, ''); render(); });
    UI.seg(ctrl, [{ label: '零比特填充', value: 'bit' }, { label: '字节填充(示意)', value: 'byte' }], v => { state.mode = v; render(); }, 0);

    function stuff(bits) {
      let out = '', count = 0;
      for (const b of bits) {
        out += b;
        if (b === '1') { count++; if (count === 5) { out += '0'; count = 0; } }
        else count = 0;
      }
      return out;
    }

    function render() {
      const flag = '01111110';
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        if (state.mode === 'bit') {
          const stuffed = stuff(state.payload);
          G.label(ctx, 20, 20, '零比特填充：发送方每遇到连续 5 个 1 就插入一个 0', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
          G.bits(ctx, 20, 44, p.w - 40, 40, {
            groups: [{ name: '首标志 F', value: flag, bits: 8, color: T['--brand'] }, { name: '数据（填充后）', value: stuffed, bits: stuffed.length, color: T['--green'] }, { name: '尾标志 F', value: flag, bits: 8, color: T['--brand'] }],
            valueSize: 11, alpha: 0.16
          });
          G.box(ctx, 20, 116, p.w - 40, 34, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
          G.label(ctx, 32, 133, `原始数据：${state.payload}`, { align: 'left', size: 11, color: T['--ink-2'], mono: true });
          G.label(ctx, 32, 178, `填充后：${stuffed}（多出 ${stuffed.length - state.payload.length} 位）`, { align: 'left', size: 11, color: T['--green'], mono: true });
          G.label(ctx, 32, 200, '接收方见到连续 5 个 1 后的 0 就删除，从而还原数据；标志位不会出现在数据中', { align: 'left', size: 10.5, color: T['--ink-3'] });
        } else {
          G.label(ctx, 20, 20, '字节填充：数据中出现与标志字节相同的字节时，插入转义字节 ESC', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
          const rows = [
            ['标志 FLAG', '01111110', T['--brand']],
            ['数据中的 FLAG', '01111110', T['--accent']],
            ['填充后', 'ESC + 01111110', T['--green']],
            ['数据中的 ESC', 'ESC + ESC', T['--green']]
          ];
          rows.forEach((r, k) => {
            const y = 50 + k * 34;
            G.box(ctx, 20, y, p.w - 40, 28, { fill: D.withAlpha(r[2], 0.1), stroke: D.withAlpha(r[2], 0.5), radius: 6 });
            G.label(ctx, 32, y + 14, r[0], { align: 'left', size: 11, weight: 700, color: r[2], mono: false });
            G.label(ctx, p.w - 32, y + 14, r[1], { align: 'right', size: 11, color: T['--ink-2'], mono: true });
          });
        }
      });
      scene.render();
      UI.readout(out, [['方式', state.mode === 'bit' ? '零比特填充' : '字节填充'], ['原始长度', String(state.payload.length)], ['填充后长度', state.mode === 'bit' ? String(stuff(state.payload).length) : '—']]);
    }
    render();
    return s;
  };

  /* ---------- CRC ---------- */
  W.crc = function (host) {
    const s = UI.shell(host, 270);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { data: '101001', gen: '1001' };
    const d = UI.text(ctrl, { label: '数据位', value: state.data, width: 150 });
    d.input.addEventListener('input', () => { state.data = d.input.value.replace(/[^01]/g, ''); render(); });
    const g = UI.text(ctrl, { label: '生成多项式', value: state.gen, width: 120 });
    g.input.addEventListener('input', () => { state.gen = g.input.value.replace(/[^01]/g, ''); render(); });

    function xor(a, b) { return a.split('').map((x, i) => x === b[i] ? '0' : '1').join(''); }
    function divide(dividend, gen) {
      let cur = dividend.slice(0, gen.length);
      const steps = [];
      for (let i = 0; i + gen.length <= dividend.length; i++) {
        const used = cur[0] === '1';
        if (used) { steps.push({ i, cur, gen }); cur = xor(cur, gen); }
        cur = cur.slice(1) + (dividend[i + gen.length] || '0');
      }
      return { rem: cur, steps };
    }

    function render() {
      const gen = state.gen || '1';
      const k = gen.length - 1;
      const appended = state.data + '0'.repeat(k);
      const { rem, steps } = divide(appended, gen);
      const frame = state.data + rem;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, 20, 20, `生成多项式 G(x) = ${gen}（r = ${k} 位余数）`, { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
        G.label(ctx, 20, 42, `被除数 = 数据 + r 个 0 = ${appended}`, { align: 'left', size: 11, color: T['--ink-2'], mono: true });
        // 除法过程（最多显示 8 步）
        const shown = steps.slice(0, 8);
        shown.forEach((st, idx) => {
          const y = 70 + idx * 22;
          G.label(ctx, 20, y, '  ' + appended.slice(0, st.i) + st.cur, { align: 'left', size: 10.5, color: T['--ink'], mono: true });
          G.label(ctx, 20, y + 10, '^ ' + ' '.repeat(st.i) + st.gen, { align: 'left', size: 10.5, color: T['--accent'], mono: true });
        });
        const yEnd = 70 + shown.length * 22;
        G.box(ctx, 16, yEnd + 4, p.w - 32, 30, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 7 });
        G.label(ctx, 28, yEnd + 19, `余数 FCS = ${rem}`, { align: 'left', size: 12, weight: 700, color: T['--green'], mono: true });
        G.label(ctx, p.w - 28, yEnd + 19, `发送帧 = ${frame}`, { align: 'right', size: 11.5, weight: 700, color: T['--brand'], mono: true });
      });
      scene.render();
      UI.readout(out, [['生成多项式', gen], ['余数 FCS', rem], ['发送帧', frame], ['校验', '接收方用同一 G(x) 除，余数为 0 则正确']]);
    }
    render();
    return s;
  };

  /* ---------- 滑动窗口与可靠传输 ---------- */
  W.slidingWindow = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { proto: 'GBN', n: 4, err: 2, td: 1, ta: 0.5, tp: 0.5 };
    UI.seg(ctrl, [{ label: '停止等待', value: 'SW' }, { label: '后退N帧 GBN', value: 'GBN' }, { label: '选择重传 SR', value: 'SR' }], v => { state.proto = v; render(); }, 1);
    UI.slider(ctrl, { label: '发送窗口 W', min: 1, max: 8, step: 1, value: 4, fmt: v => v, onInput: v => { state.n = v; render(); } });
    UI.slider(ctrl, { label: '第几帧出错', min: 0, max: 7, step: 1, value: 2, fmt: v => v, onInput: v => { state.err = v; render(); } });

    function render() {
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const n = state.proto === 'SW' ? 1 : state.n;
        const total = Math.max(n + 3, 8);
        const left = 90, w = p.w - left - 30, unit = w / total;
        const yA = 60, yB = yA + 80;
        const cu = unit;
        // 时间向下，发送方/接收方两条竖线
        G.box(ctx, left, 20, w, p.h - 50, { fill: 'transparent', stroke: T['--line'], radius: 8 });
        G.label(ctx, left + w / 2, 34, `${state.proto === 'SW' ? '停止等待协议' : state.proto}　窗口 W=${n}　第 ${state.err} 帧出错`, { size: 11.5, weight: 700, color: T['--ink'] });
        G.label(ctx, 60, yA, '发送方', { align: 'right', size: 11, color: T['--brand'] });
        G.label(ctx, 60, yB, '接收方', { align: 'right', size: 11, color: T['--teal'] });
        const maxT = total;
        const timeY = t => 50 + (t / maxT) * (p.h - 90);
        const frameX = i => left + (i % total) * cu + cu / 2;
        // 简化时空图
        const colors = [T['--brand'], T['--purple'], T['--accent'], T['--teal'], T['--green']];
        let t = 0;
        const events = [];
        for (let i = 0; i < total; i++) {
          events.push({ type: 'data', idx: i, t: t });
          t += 1;
          if (state.proto === 'SW') events.push({ type: 'ack', idx: i, t: t });
          if (state.proto !== 'SW' && (i === state.err + (state.proto === 'GBN' ? 0 : 0))) {
            // 标记出错帧不发送 ack
          }
        }
        events.forEach(ev => {
          const y = timeY(ev.t);
          if (ev.type === 'data') {
            const x = frameX(ev.idx);
            const isErr = ev.idx === state.err && state.proto !== 'SW';
            const color = isErr ? T['--red'] : colors[ev.idx % colors.length];
            G.arrow(ctx, [[x, y], [x, y + 22]], { color, width: 2 });
            G.label(ctx, x + 12, y + 12, 'F' + ev.idx, { align: 'left', size: 9.5, color, mono: true });
            if (isErr) G.label(ctx, x - 4, y + 12, '×', { align: 'right', size: 14, weight: 800, color: T['--red'] });
          } else {
            const x = frameX(ev.idx);
            G.arrow(ctx, [[x, y + 20], [x, y]], { color: T['--teal'], width: 1.6 });
            G.label(ctx, x - 10, y + 10, 'ACK' + ev.idx, { align: 'right', size: 9, color: T['--teal'], mono: true });
          }
        });
        // 窗口与公式
        const util = state.proto === 'SW' ? (state.td / (state.td + 2 * state.tp)) : (n * state.td / (state.td + 2 * state.tp));
        G.box(ctx, 16, p.h - 34, p.w - 32, 24, { fill: D.withAlpha(T['--green'], 0.08), stroke: D.withAlpha(T['--green'], 0.45), radius: 6 });
        G.label(ctx, 28, p.h - 22, `信道利用率 ≈ ${(Math.min(1, util) * 100).toFixed(1)}%　（W×Td /(Td+2Tp)）　GBN 出错后重传后续所有帧，SR 只重传出错帧`, { align: 'left', size: 10.5, color: T['--green'] });
      });
      scene.render();
      UI.readout(out, [['协议', state.proto === 'SW' ? '停止等待' : state.proto], ['窗口', String(state.proto === 'SW' ? 1 : state.n)], ['出错帧', String(state.err)]]);
    }
    render();
    return s;
  };

  /* ---------- CSMA/CD ---------- */
  W.csmaCd = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { t: '侦听信道', d: '先听后发：检测信道是否空闲' },
      { t: '信道忙', d: '若忙则持续侦听，直到空闲' },
      { t: '发送并检测', d: '边发边听：发送过程中继续检测冲突' },
      { t: '检测到冲突', d: '立即停止发送，发出干扰信号' },
      { t: '退避', d: '按二进制指数退避算法等待随机时间' },
      { t: '重发', d: '退避结束后重新尝试，超过 16 次则丢弃' }
    ];
    let i = 0;
    let backoff = 2;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; backoff = Math.pow(2, Math.min(k, 4)); render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 冲突域示意
        const y = 60;
        G.box(ctx, 30, y - 4, p.w - 60, 8, { fill: D.withAlpha(T['--teal'], 0.4), stroke: null, radius: 4 });
        G.dot(ctx, 60, y, 7, T['--brand'], true);
        G.dot(ctx, p.w - 60, y, 7, T['--accent'], true);
        G.label(ctx, 60, y - 18, '站 A', { size: 10.5, color: T['--brand'] });
        G.label(ctx, p.w - 60, y - 18, '站 B', { size: 10.5, color: T['--accent'] });
        if (i === 3) {
          G.label(ctx, p.w / 2, y - 30, '⚡ 冲突', { size: 14, weight: 800, color: T['--red'] });
          G.dot(ctx, p.w / 2, y, 9, T['--red'], true);
        }
        // 流程
        steps.forEach((st, k) => {
          const yy = 110 + k * 22;
          const on = k === i;
          G.box(ctx, 30, yy, p.w - 60, 20, {
            fill: on ? D.withAlpha(T['--brand'], 0.16) : T['--card-2'],
            stroke: on ? T['--brand'] : T['--line'], width: on ? 1.6 : 1, radius: 5
          });
          G.label(ctx, 42, yy + 10, `${k + 1}. ${st.t}`, { align: 'left', size: 10.5, weight: on ? 700 : 500, color: on ? T['--ink'] : T['--ink-2'] });
          if (on) G.label(ctx, p.w - 42, yy + 10, st.d, { align: 'right', size: 10, color: T['--ink-3'] });
        });
        G.label(ctx, 30, p.h - 8, `退避时间 = 争用期 × 随机数 k，k ∈ [0, 2^min(重传次数,10) − 1]（当前示例上限 ${backoff}）`, { align: 'left', size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['步骤', steps[i].t], ['说明', steps[i].d]]);
    }
    render();
    return s;
  };

  /* ---------- 交换机自学习 ---------- */
  W.switchLearn = function (host) {
    const s = UI.shell(host, 270);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    // 端口-主机
    const ports = [
      { port: 1, mac: 'AA', name: 'A' }, { port: 2, mac: 'BB', name: 'B' },
      { port: 3, mac: 'CC', name: 'C' }, { port: 4, mac: 'DD', name: 'D' }
    ];
    const frames = [
      { src: 'AA', dst: 'BB', desc: 'A → B：交换机学习源 AA→端口1，查表命中 B→端口2，定向转发' },
      { src: 'BB', dst: 'CC', desc: 'B → C：学习源 BB→端口2，查表命中 C→端口3，定向转发' },
      { src: 'CC', dst: 'EE', desc: 'C → EE：学习源 CC→端口3，表中无 EE，向其他所有端口泛洪' },
      { src: 'EE', dst: 'DD', desc: 'EE → D：交换机收到 EE 后学习其端口，再定向转发给 D' }
    ];
    let i = 0;
    let table = [];
    function apply(k) {
      table = [];
      for (let t = 0; t <= k; t++) {
        const f = frames[t];
        const existing = table.find(row => row.mac === f.src);
        if (existing) existing.port = portOf(f.src); else table.push({ mac: f.src, port: portOf(f.src) });
      }
    }
    function portOf(mac) { return mac === 'EE' ? 1 : (ports.find(p => p.mac === mac) || { port: 1 }).port; }
    UI.transport(ctrl, { total: frames.length, onChange: k => { i = k; apply(k); render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 交换机
        const cx = p.w / 2, cy = 70;
        G.box(ctx, cx - 60, cy - 24, 120, 48, { fill: D.withAlpha(T['--brand'], 0.14), stroke: T['--brand'], radius: 9 });
        G.label(ctx, cx, cy, '交换机', { size: 12.5, weight: 700, color: T['--brand'] });
        // 端口主机
        const hosts = [...ports, { port: 1, mac: 'EE', name: 'E' }];
        hosts.forEach((h, k) => {
          const ang = Math.PI * (0.15 + 0.7 * (k / (hosts.length - 1)));
          const hx = cx + Math.cos(ang) * (p.w * 0.34);
          const hy = 150 + Math.sin(ang) * 30;
          const on = frames[i].src === h.mac || frames[i].dst === h.mac;
          G.box(ctx, hx - 26, hy - 16, 52, 32, { fill: on ? D.withAlpha(T['--green'], 0.16) : T['--card-2'], stroke: on ? T['--green'] : T['--line'], radius: 7 });
          G.label(ctx, hx, hy, h.name, { size: 11.5, weight: 700, color: on ? T['--green'] : T['--ink-2'] });
          G.label(ctx, hx, hy + 24, 'MAC ' + h.mac + ' · 端口 ' + h.port, { size: 9, color: T['--ink-3'], mono: true });
          G.arrow(ctx, [[cx + (hx > cx ? 60 : -60), cy], [hx + (hx > cx ? -30 : 30), hy - (hy > cy ? 16 : -16)]], { color: D.withAlpha(T['--line-2'], 0.9), width: 1.2 });
        });
        // 转发表
        const tx = p.w - 170, ty = 20;
        G.box(ctx, tx, ty, 156, 24 + Math.max(1, table.length) * 20, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
        G.label(ctx, tx + 78, ty + 12, 'MAC 地址表', { size: 11, weight: 700, color: T['--ink-2'] });
        table.forEach((row, k) => G.label(ctx, tx + 16, ty + 32 + k * 20, `MAC ${row.mac} → 端口 ${row.port}`, { align: 'left', size: 10, color: T['--ink'], mono: true }));
        G.box(ctx, 16, p.h - 30, p.w - 32, 22, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 5 });
        G.label(ctx, p.w / 2, p.h - 19, frames[i].desc, { size: 10.5, color: T['--brand'] });
      });
      scene.render();
      UI.readout(out, [['帧', frames[i].src + ' → ' + frames[i].dst], ['表项数', String(table.length)], ['动作', /泛洪/.test(frames[i].desc) ? '泛洪' : '定向转发']]);
    }
    apply(0);
    render();
    return s;
  };

  /* ---------- 海明码编码与纠错 ---------- */
  W.hammingCode = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { data: '1011', parity: 'even', flip: 0 };
    const inp = UI.text(ctrl, { label: '数据位', value: state.data, width: 140, placeholder: '如 1011' });
    inp.input.addEventListener('input', () => {
      state.data = inp.value.replace(/[^01]/g, '').slice(0, 8);
      render();
    });
    UI.seg(ctrl, [{ label: '偶校验（配偶）', value: 'even' }, { label: '奇校验（配奇）', value: 'odd' }], v => { state.parity = v; render(); }, 0);
    const flip = UI.slider(ctrl, { label: '翻转位', min: 0, max: 15, step: 1, value: 0, fmt: v => v === 0 ? '不翻转' : '第 ' + v + ' 位', onInput: v => { state.flip = v; render(); } });

    function build(data, parity) {
      const n = data.length;
      let k = 0;
      while ((1 << k) < n + k + 1) k++;
      const total = n + k;
      const bits = new Array(total + 1).fill(0);
      let di = 0;
      for (let pos = 1; pos <= total; pos++) {
        if ((pos & (pos - 1)) !== 0) bits[pos] = Number(data[di++]);
      }
      for (let i = 0; i < k; i++) {
        const pi = 1 << i;
        let x = 0;
        for (let pos = 1; pos <= total; pos++) if (pos & pi) x ^= bits[pos];
        bits[pi] = parity === 'even' ? x : (x ^ 1);
      }
      return { n: n, k: k, total: total, bits: bits };
    }
    function nameOf(pos) {
      if ((pos & (pos - 1)) === 0) return 'P' + pos;
      let d = 0;
      for (let q = 1; q <= pos; q++) if ((q & (q - 1)) !== 0) d++;
      return 'D' + d;
    }
    function render() {
      const data = state.data || '0';
      const enc = build(data, state.parity);
      const { n, k, total } = enc;
      const bits = enc.bits;
      flip.input.max = total;
      if (state.flip > total) { state.flip = total; flip.set(total); }
      const e = Math.min(state.flip, total);
      const word = bits.slice();
      if (e > 0) word[e] ^= 1;
      const syn = [];
      for (let i = 0; i < k; i++) {
        const pi = 1 << i;
        let x = 0;
        for (let pos = 1; pos <= total; pos++) if (pos & pi) x ^= word[pos];
        syn[i] = x;
      }
      const neg = state.parity === 'odd';
      let errPos = 0;
      for (let i = 0; i < k; i++) errPos += (neg ? (syn[i] ^ 1) : syn[i]) * (1 << i);
      if (errPos > total) errPos = 0;
      const fixed = word.slice();
      if (errPos > 0) fixed[errPos] ^= 1;
      let dataOut = '';
      for (let pos = 1; pos <= total; pos++) if ((pos & (pos - 1)) !== 0) dataOut += fixed[pos];
      let sent = '', recv = '';
      for (let pos = 1; pos <= total; pos++) { sent += bits[pos]; recv += word[pos]; }
      let synStr = '';
      for (let i = k - 1; i >= 0; i--) synStr += syn[i];
      const T = D.Theme.cache;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const Th = D.Theme.cache;
        G.label(ctx, 20, 16, '数据 ' + n + ' 位、校验位 ' + k + ' 位：2^' + k + ' = ' + (1 << k) + ' ≥ n+k+1 = ' + (n + k + 1) + '，海明码共 ' + total + ' 位', { align: 'left', size: 11.5, weight: 700, color: Th['--ink'] });
        const bw = Math.min(56, (p.w - 60) / total);
        const bx0 = Math.max(30, (p.w - total * bw) / 2);
        const by = 66, bh = 38;
        for (let pos = 1; pos <= total; pos++) {
          const x = bx0 + (pos - 1) * bw;
          const isParity = (pos & (pos - 1)) === 0;
          const color = isParity ? Th['--brand'] : Th['--teal'];
          const isErr = e === pos;
          G.box(ctx, x + 2, by, bw - 4, bh, {
            fill: D.withAlpha(color, isParity ? 0.2 : 0.12),
            stroke: isErr ? Th['--red'] : D.withAlpha(color, 0.75),
            width: isErr ? 2.6 : 1.2, radius: 6
          });
          G.label(ctx, x + bw / 2, by + bh / 2, String(word[pos]), { size: bw > 30 ? 15 : 11, weight: 700, color: isErr ? Th['--red'] : Th['--ink'], mono: true });
          G.label(ctx, x + bw / 2, by - 14, nameOf(pos), { size: 9.5, weight: 700, color, mono: true });
          G.label(ctx, x + bw / 2, by + bh + 12, '#' + pos, { size: 8.5, color: Th['--ink-3'], mono: true });
          if (isErr) G.label(ctx, x + bw / 2, by - 32, '✗ 翻转', { size: 9.5, weight: 700, color: Th['--red'] });
        }
        const ly0 = by + bh + 36;
        for (let i = 0; i < k; i++) {
          const pi = 1 << i;
          const grp = [];
          for (let pos = 1; pos <= total; pos++) if (pos & pi) grp.push(pos);
          const dataGrp = grp.filter(q => q !== pi);
          const gx = dataGrp.reduce((a, q) => a ^ bits[q], 0);
          const gen = state.parity === 'odd' ? '(' + dataGrp.join('⊕') + ')⊕1 = ' + (gx ^ 1) : dataGrp.join('⊕') + ' = ' + gx;
          const sx = grp.reduce((a, q) => a ^ word[q], 0);
          G.label(ctx, 30, ly0 + i * 20, 'P' + pi + ' = ' + gen + '　｜　S' + pi + ' = ' + grp.join('⊕') + ' = ' + sx, { align: 'left', size: 10, color: Th['--ink-2'], mono: true });
        }
        const ry = ly0 + k * 20 + 8;
        G.box(ctx, 16, ry, p.w - 32, 52, { fill: D.withAlpha(errPos ? Th['--red'] : Th['--green'], 0.09), stroke: D.withAlpha(errPos ? Th['--red'] : Th['--green'], 0.5), radius: 8 });
        G.label(ctx, 28, ry + 17, '伴随式 S = S' + (1 << (k - 1)) + '…S1 = ' + synStr + '（二进制）= ' + errPos + (neg && errPos === 0 ? '（配奇以全 1 为无错）' : ''), { align: 'left', size: 11, color: errPos ? Th['--red'] : Th['--green'], mono: true });
        G.label(ctx, 28, ry + 37, errPos ? '第 ' + errPos + ' 位出错 → 取反纠正，纠正后数据位 = ' + dataOut + '（与发送一致）' : '未检出错误，接收数据位 = ' + dataOut, { align: 'left', size: 11, color: Th['--ink-2'], mono: true });
        G.label(ctx, p.w - 28, ry + 37, '发送码字 ' + sent, { align: 'right', size: 10, color: Th['--ink-3'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['校验位 k', String(k)],
        ['发送码字', sent],
        ['接收码字', recv],
        ['错误位置', errPos ? '第 ' + errPos + ' 位' : '无'],
        ['纠错后数据', dataOut]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 信道利用率 ---------- */
  W.protocolEfficiency = function (host) {
    const s = UI.shellPlot(host, {
      height: 320, xMin: 0, xMax: 16, yMin: 0, yMax: 120,
      xLabel: '', yLabel: '',
      xTicks: 8, yTicks: 6, yFmt: v => v.toFixed(0),
      pad: { l: 56, r: 22, t: 22, b: 40 }
    });
    const { plot, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { proto: 'GBN', W: 4, Td: 1, Tp: 3, n: 3 };
    UI.seg(ctrl, [{ label: '停止等待', value: 'SW' }, { label: '后退N帧', value: 'GBN' }, { label: '选择重传', value: 'SR' }], v => { state.proto = v; render(); }, 1);
    UI.slider(ctrl, { label: '发送窗口 W', min: 1, max: 16, step: 1, value: 4, fmt: v => v, onInput: v => { state.W = v; render(); } });
    UI.slider(ctrl, { label: '发送时延 Td', min: 0.5, max: 10, step: 0.5, value: 1, fmt: v => v.toFixed(1) + ' ms', onInput: v => { state.Td = v; render(); } });
    UI.slider(ctrl, { label: '单程传播 Tp', min: 0.5, max: 10, step: 0.5, value: 3, fmt: v => v.toFixed(1) + ' ms', onInput: v => { state.Tp = v; render(); } });
    UI.slider(ctrl, { label: '序号位数 n', min: 2, max: 5, step: 1, value: 3, fmt: v => v + ' bit', onInput: v => { state.n = v; render(); } });

    function limits() {
      if (state.proto === 'SW') return { max: 1, expr: 'W = 1' };
      if (state.proto === 'GBN') return { max: (1 << state.n) - 1, expr: 'W ≤ 2ⁿ−1 = ' + ((1 << state.n) - 1) };
      return { max: 1 << (state.n - 1), expr: 'W ≤ 2ⁿ⁻¹ = ' + (1 << (state.n - 1)) };
    }
    function util(w) {
      const raw = w * state.Td / (state.Td + 2 * state.Tp);
      return Math.min(1, raw);
    }
    function render() {
      const lim = limits();
      const Weff = Math.min(state.W, lim.max);
      const U = util(Weff);
      const Wstar = (state.Td + 2 * state.Tp) / state.Td;
      const protoName = state.proto === 'SW' ? '停止等待' : (state.proto === 'GBN' ? '后退 N 帧' : '选择重传');
      plot.clearLayers();
      plot.custom((p, ctx) => {
        const T = D.Theme.cache;
        if (lim.max < 16) {
          const xa = p.X(lim.max), xb = p.X(16);
          ctx.save();
          ctx.fillStyle = D.withAlpha(T['--red'], 0.06);
          ctx.fillRect(xa, p.py, xb - xa, p.ph);
          ctx.restore();
          G.label(ctx, p.X(lim.max) + 6, p.py + 13, '超出窗口上限 ' + lim.max, { align: 'left', size: 9.5, weight: 700, color: T['--red'] });
        }
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--green'], 0.75);
        ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(p.px, p.Y(100)); ctx.lineTo(p.px + p.pw, p.Y(100)); ctx.stroke();
        ctx.restore();
        if (lim.max <= 16) {
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--red'], 0.8);
          ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]);
          ctx.beginPath(); ctx.moveTo(p.X(lim.max), p.py); ctx.lineTo(p.X(lim.max), p.py + p.ph); ctx.stroke();
          ctx.restore();
        }
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = T['--brand']; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
        for (let w = 1; w <= 16.001; w += 0.25) {
          const x = p.X(w), y = p.Y(util(w) * 100);
          w === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
        G.dot(ctx, p.X(Weff), p.Y(U * 100), 5, T['--brand'], true);
        G.label(ctx, p.X(Weff) + 9, p.Y(U * 100) - 11, 'U = ' + (U * 100).toFixed(1) + '%', { align: 'left', size: 10.5, weight: 700, color: T['--brand'], mono: true });
        G.label(ctx, p.px + 6, p.Y(113), 'U（信道利用率）= min(1, W×Td / (Td + 2Tp))×100%', { align: 'left', size: 10.5, weight: 700, color: T['--ink-2'], mono: true });
        G.label(ctx, p.px + 6, p.Y(106), '填满链路所需窗口 W* = (Td+2Tp)/Td = ' + Wstar.toFixed(1) + '　（横轴为发送窗口 W）', { align: 'left', size: 10, color: T['--ink-3'], mono: true });
        G.label(ctx, p.px + p.pw - 4, p.Y(113), protoName + '：' + lim.expr, { align: 'right', size: 10.5, weight: 700, color: T['--purple'] });
      });
      plot.render();
      UI.readout(out, [
        ['协议', protoName],
        ['窗口上限', lim.expr],
        ['当前有效窗口', String(Weff)],
        ['信道利用率', (U * 100).toFixed(1) + '%'],
        ['Td + 2Tp', (state.Td + 2 * state.Tp).toFixed(1) + ' ms']
      ]);
    }
    render();
    UI.note(host, '利用率 <b>U = W·Td / (Td + 2Tp)</b>：窗口足够大（W ≥ (Td+2Tp)/Td）时链路被填满，U 趋近 100%。序号 n 位时 GBN 要求 W ≤ 2ⁿ−1，SR 要求 W ≤ 2ⁿ⁻¹，否则接收方无法区分新帧与重传帧。');
    return s;
  };

  /* ---------- 二进制指数退避模拟 ---------- */
  W.binaryBackoff = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { tau: 51.2, k: 0 };
    function pick(maxK) { return Math.floor(Math.random() * (maxK + 1)); }
    function simulate() {
      const rounds = [];
      for (let i = 1; i <= 16; i++) {
        const cap = Math.min(i, 10);
        const maxK = Math.pow(2, cap) - 1;
        const kA = pick(maxK), kB = pick(maxK);
        rounds.push({ i: i, cap: cap, maxK: maxK, kA: kA, kB: kB, tie: kA === kB });
        if (kA !== kB) return { rounds: rounds, winner: kA < kB ? 'A' : 'B', giveUp: false };
      }
      return { rounds: rounds, winner: null, giveUp: true };
    }
    let sim = simulate();
    UI.transport(ctrl, { total: sim.rounds.length + 1, onChange: k => { state.k = k; render(); } });
    UI.slider(ctrl, { label: '争用期 2τ', min: 5, max: 100, step: 0.2, value: 51.2, fmt: v => v.toFixed(1) + ' µs', onInput: v => { state.tau = v; render(); } });
    UI.button(ctrl, '重新模拟', () => { D.unregister(s.scene); W.binaryBackoff(host); });

    function render() {
      const rounds = sim.rounds;
      const isFinal = state.k >= rounds.length;
      const ri = Math.min(state.k, rounds.length - 1);
      const cur = rounds[ri];
      const tau = state.tau;
      const done = rounds.slice(0, ri + 1);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, 20, 16, '截断二进制指数退避：第 i 次冲突后 k ∈ [0, 2^min(i,10) − 1]，退避 k × 2τ 后重试', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
        G.box(ctx, 16, 30, p.w - 32, 152, { fill: D.withAlpha(T['--brand'], 0.05), stroke: T['--line'], radius: 8 });
        G.label(ctx, 30, 48, '第 ' + cur.i + ' 次冲突后：k 取值范围 [0, 2^' + cur.cap + ' − 1] = [0, ' + cur.maxK + ']', { align: 'left', size: 11, weight: 700, color: T['--purple'] });
        const x0 = 96, x1 = p.w - 44;
        const X = k => x0 + (cur.maxK > 0 ? k / cur.maxK : 0) * (x1 - x0);
        const drawAxis = (y, label, k, color, isWinner) => {
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.9);
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
          ctx.restore();
          G.label(ctx, x0 - 12, y, label, { align: 'right', size: 10.5, weight: 700, color: color });
          G.label(ctx, x0, y + 14, '槽 0', { size: 8.5, color: T['--ink-3'], mono: true });
          G.label(ctx, x1, y + 14, '槽 ' + cur.maxK, { size: 8.5, color: T['--ink-3'], mono: true });
          G.dot(ctx, X(k), y, 5.5, isWinner ? T['--green'] : color, true);
          const lx = X(k), toLeft = lx > x0 + (x1 - x0) * 0.55;
          G.label(ctx, toLeft ? lx - 10 : lx + 10, y - 12, 'k=' + k + '，等待 ' + (k * tau).toFixed(1) + ' µs', { align: toLeft ? 'right' : 'left', size: 10, color: isWinner ? T['--green'] : color, mono: true });
        };
        const winner = cur.tie ? null : (cur.kA < cur.kB ? 'A' : 'B');
        drawAxis(86, '站 A', cur.kA, T['--brand'], winner === 'A');
        drawAxis(124, '站 B', cur.kB, T['--accent'], winner === 'B');
        const status = cur.tie
          ? '两站退避到同一槽 → 再次冲突，进入第 ' + (cur.i + 1) + ' 次退避'
          : '较小 k 先退避到 0：站 ' + winner + ' 发送成功（' + (Math.min(cur.kA, cur.kB) * tau).toFixed(1) + ' µs 后）';
        G.label(ctx, 30, 162, status, { align: 'left', size: 11, weight: 700, color: cur.tie ? T['--red'] : T['--green'] });
        G.label(ctx, 20, 196, '各轮退避记录（最多显示最近 8 次）', { align: 'left', size: 10, color: T['--ink-3'] });
        const shown = done.slice(-8);
        const cols = Math.max(2, Math.floor((p.w - 32) / 152));
        const chipW = (p.w - 32) / cols - 6;
        shown.forEach((r, idx) => {
          const col = idx % cols, row = Math.floor(idx / cols);
          const cx = 16 + col * (chipW + 6), cy = 206 + row * 27;
          const isCur = r === cur;
          const text = r.i + '. A: k=' + r.kA + '　B: k=' + r.kB + ' → ' + (r.tie ? '冲突' : (r.kA < r.kB ? 'A' : 'B') + ' 发送');
          G.box(ctx, cx, cy, chipW, 22, {
            fill: isCur ? D.withAlpha(T['--brand'], 0.16) : T['--card-2'],
            stroke: isCur ? T['--brand'] : D.withAlpha(T['--line'], 0.9), radius: 5
          });
          G.fitted(ctx, cx + chipW / 2, cy + 11, text, chipW - 10, { size: 9.5, weight: isCur ? 700 : 500, color: isCur ? T['--ink'] : T['--ink-2'], mono: true });
        });
        const by = p.h - 38;
        G.box(ctx, 16, by, p.w - 32, 26, { fill: D.withAlpha(sim.giveUp ? T['--red'] : T['--green'], 0.09), stroke: D.withAlpha(sim.giveUp ? T['--red'] : T['--green'], 0.5), radius: 7 });
        const res = !isFinal ? '进行中：点击「下一步」观察本轮退避结果'
          : sim.giveUp ? '连续 16 次冲突仍未成功，达到上限，放弃发送该帧'
            : '站 ' + sim.winner + ' 成功发送：共冲突 ' + rounds.length + ' 次，最终退避 ' + (Math.min(cur.kA, cur.kB) * tau).toFixed(1) + ' µs';
        G.label(ctx, 28, by + 13, res, { align: 'left', size: 10.5, weight: 700, color: sim.giveUp && isFinal ? T['--red'] : T['--green'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前轮次', (ri + 1) + ' / ' + rounds.length + (isFinal ? '（已完成）' : '')],
        ['站 A 退避', 'k=' + cur.kA + '，' + (cur.kA * tau).toFixed(1) + ' µs'],
        ['站 B 退避', 'k=' + cur.kB + '，' + (cur.kB * tau).toFixed(1) + ' µs'],
        ['结果', cur.tie ? '冲突' : (cur.kA < cur.kB ? 'A' : 'B') + ' 发送成功']
      ]);
    }
    render();
    return s;
  };

})(window);
