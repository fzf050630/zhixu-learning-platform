/* ============================================================
   net1.js — 第1章 计算机网络体系结构 可视化组件
   netPerformance：时延与带宽性能指标计算
   osiModel：OSI / TCP-IP 分层与数据封装
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 性能指标计算 ---------- */
  W.netPerformance = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { bw: 100, size: 1500, dist: 1000, speed: 2, hops: 1 };
    UI.slider(ctrl, { label: '带宽', min: 1, max: 1000, step: 1, value: 100, fmt: v => v + ' Mbps', onInput: v => { state.bw = v; render(); } });
    UI.slider(ctrl, { label: '分组大小', min: 100, max: 4000, step: 100, value: 1500, fmt: v => v + ' B', onInput: v => { state.size = v; render(); } });
    UI.slider(ctrl, { label: '距离', min: 10, max: 5000, step: 10, value: 1000, fmt: v => v + ' km', onInput: v => { state.dist = v; render(); } });
    UI.slider(ctrl, { label: '传播速率', min: 1, max: 3, step: 0.5, value: 2, fmt: v => v + '×10⁸ m/s', onInput: v => { state.speed = v; render(); } });

    function calc() {
      const bits = state.size * 8;
      const send = bits / (state.bw * 1e6) * 1000;              // ms
      const prop = (state.dist * 1000) / (state.speed * 1e8) * 1000;
      const total = send + prop * state.hops;
      const delayBw = state.bw * 1e6 * (prop / 1000);           // bit
      return { send, prop, total, delayBw };
    }

    function render() {
      const { send, prop, total, delayBw } = calc();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const items = [
          { k: '发送时延', v: send.toFixed(3), u: 'ms', c: T['--brand'] },
          { k: '传播时延', v: prop.toFixed(3), u: 'ms', c: T['--purple'] },
          { k: '总时延', v: total.toFixed(3), u: 'ms', c: T['--green'] },
          { k: '时延带宽积', v: (delayBw / 1000).toFixed(2), u: 'kbit', c: T['--accent'] }
        ];
        const gap = (p.w - 32) / items.length;
        items.forEach((it, i) => {
          const x = 16 + i * gap, bw = gap - 14;
          G.label(ctx, x + bw / 2, 34, it.k, { size: 12, weight: 700, color: T['--ink-2'] });
          G.label(ctx, x + bw / 2, 62, it.v, { size: 21, weight: 760, color: it.c, mono: true });
          G.label(ctx, x + bw / 2, 84, it.u, { size: 10.5, color: T['--ink-3'] });
        });
        // 链路示意
        const y = 120;
        G.dot(ctx, 40, y, 6, T['--brand'], true);
        G.dot(ctx, p.w - 40, y, 6, T['--teal'], true);
        G.label(ctx, 40, y - 16, '主机 A', { size: 10.5, color: T['--brand'] });
        G.label(ctx, p.w - 40, y - 16, '主机 B', { size: 10.5, color: T['--teal'] });
        G.box(ctx, 46, y - 3, p.w - 92, 6, { fill: D.withAlpha(T['--line-2'], 0.6), stroke: null, radius: 3 });
        // 传播中的比特示意
        const frac = Math.min(1, prop / Math.max(send + prop, 0.001));
        G.box(ctx, 46, y - 3, (p.w - 92) * frac, 6, { fill: D.withAlpha(T['--purple'], 0.7), stroke: null, radius: 3 });
        G.box(ctx, 40, y + 24, p.w - 80, 46, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 9 });
        G.label(ctx, 52, y + 40, `发送时延 = 分组位数 ÷ 带宽 = ${state.size * 8} bit ÷ ${state.bw} Mbps`, { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
        G.label(ctx, 52, y + 58, `传播时延 = 距离 ÷ 传播速率 = ${state.dist} km ÷ ${state.speed}×10⁸ m/s`, { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
        G.label(ctx, p.w - 44, y + 58, `时延带宽积 = ${(delayBw / 1000).toFixed(2)} kbit（链路“容纳”的比特数）`, { align: 'right', size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['发送时延', send.toFixed(3) + ' ms'],
        ['传播时延', prop.toFixed(3) + ' ms'],
        ['总时延', total.toFixed(3) + ' ms'],
        ['时延带宽积', (delayBw).toFixed(0) + ' bit']
      ]);
    }
    render();
    return s;
  };

  /* ---------- OSI / TCP-IP 分层与封装 ---------- */
  W.osiModel = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const osi = [
      { n: '应用层', pdu: '报文', dev: '—', proto: 'HTTP、FTP、SMTP、DNS', tcpip: '应用层' },
      { n: '表示层', pdu: '报文', dev: '—', proto: '数据格式、加密、压缩', tcpip: '应用层' },
      { n: '会话层', pdu: '报文', dev: '—', proto: '会话建立与管理', tcpip: '应用层' },
      { n: '传输层', pdu: '报文段', dev: '—', proto: 'TCP、UDP', tcpip: '传输层' },
      { n: '网络层', pdu: '分组/数据报', dev: '路由器', proto: 'IP、ICMP、ARP、OSPF', tcpip: '网际层' },
      { n: '数据链路层', pdu: '帧', dev: '交换机、网桥', proto: 'Ethernet、PPP、HDLC', tcpip: '网络接口层' },
      { n: '物理层', pdu: '比特', dev: '中继器、集线器', proto: '接口标准、编码', tcpip: '网络接口层' }
    ];
    let i = 0;
    UI.seg(ctrl, osi.map((l, k) => ({ label: l.n, value: k })), (v, k) => { i = k; render(); }, 3);

    function render() {
      const l = osi[i];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const top = 16, lh = (p.h - 32) / osi.length - 4;
        const colors = [T['--purple'], T['--purple'], T['--purple'], T['--brand'], T['--teal'], T['--green'], T['--accent']];
        osi.forEach((row, k) => {
          const y = top + k * (lh + 4);
          const on = k === i;
          G.box(ctx, 20, y, p.w - 150, lh, {
            fill: on ? D.withAlpha(colors[k], 0.2) : D.withAlpha(colors[k], 0.07),
            stroke: on ? colors[k] : D.withAlpha(colors[k], 0.35), width: on ? 2 : 1, radius: 6
          });
          G.label(ctx, 32, y + lh / 2, row.n, { align: 'left', size: 11.5, weight: on ? 700 : 600, color: on ? colors[k] : T['--ink-2'] });
          G.label(ctx, p.w - 140, y + lh / 2, row.pdu, { align: 'left', size: 10, color: T['--ink-3'], mono: true });
        });
        // TCP/IP 标注
        const groups = [
          { label: '应用层', from: 0, to: 2, color: T['--purple'] },
          { label: '传输层', from: 3, to: 3, color: T['--brand'] },
          { label: '网际层', from: 4, to: 4, color: T['--teal'] },
          { label: '网络接口层', from: 5, to: 6, color: T['--green'] }
        ];
        groups.forEach(g => {
          const y1 = top + g.from * (lh + 4), y2 = top + g.to * (lh + 4) + lh;
          G.box(ctx, p.w - 126, y1, 108, y2 - y1, { fill: D.withAlpha(g.color, 0.08), stroke: D.withAlpha(g.color, 0.5), radius: 6 });
          G.label(ctx, p.w - 72, (y1 + y2) / 2, g.label, { size: 10.5, weight: 700, color: g.color });
        });
        // 封装示意
        G.box(ctx, 20, p.h - 4, p.w - 40, 2, { fill: 'transparent', stroke: 'transparent' });
      });
      scene.render();
      UI.readout(out, [
        ['当前层', l.n],
        ['数据单位 PDU', l.pdu],
        ['典型协议', l.proto],
        ['典型设备', l.dev]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 三种交换方式时延对比 ---------- */
  W.switchingCompare = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { M: 8, n: 6, R: 1, tp: 1, setup: 2 };
    UI.slider(ctrl, { label: '数据量', min: 1, max: 16, step: 1, value: 8, fmt: v => v + ' kbit', onInput: v => { state.M = v; render(); } });
    UI.slider(ctrl, { label: '分组数', min: 1, max: 12, step: 1, value: 6, fmt: v => v + ' 个', onInput: v => { state.n = v; render(); } });
    UI.slider(ctrl, { label: '链路速率', min: 0.5, max: 2, step: 0.5, value: 1, fmt: v => v + ' Mb/s', onInput: v => { state.R = v; render(); } });
    UI.slider(ctrl, { label: '单跳传播', min: 0.2, max: 3, step: 0.2, value: 1, fmt: v => v.toFixed(1) + ' ms', onInput: v => { state.tp = v; render(); } });
    UI.slider(ctrl, { label: '建立时间', min: 0, max: 4, step: 0.5, value: 2, fmt: v => v.toFixed(1) + ' ms', onInput: v => { state.setup = v; render(); } });
    const HOPS = 3;
    function calc() {
      const Tm = state.M / state.R;
      return {
        Tm: Tm,
        circuit: state.setup + Tm + HOPS * state.tp,
        message: HOPS * Tm + HOPS * state.tp,
        packet: (state.n + HOPS - 1) * (Tm / state.n) + HOPS * state.tp
      };
    }
    function render() {
      const c = calc();
      const tMax = Math.max(c.circuit, c.message, c.packet) * 1.04;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 104, x1 = p.w - 26, tw = x1 - x0;
        const X = t => x0 + Math.min(1, t / tMax) * tw;
        const rowA = { y: 42, h: 38 }, rowB = { y: 94, h: 42 }, rowC = { y: 150, h: 78 };
        const axisY = 246;
        ctx.save();
        ctx.strokeStyle = D.withAlpha(T['--line'], 0.9);
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const x = Math.round(x0 + tw * i / 4) + 0.5;
          ctx.beginPath(); ctx.moveTo(x, 34); ctx.lineTo(x, axisY - 8); ctx.stroke();
        }
        ctx.restore();
        for (let i = 0; i <= 4; i++) {
          G.label(ctx, x0 + tw * i / 4, axisY, (tMax * i / 4).toFixed(1) + ' ms', { size: 9, color: T['--ink-3'], mono: true });
        }
        G.label(ctx, 88, rowA.y + 14, '电路交换', { align: 'right', size: 11, weight: 700, color: T['--accent'] });
        G.label(ctx, 88, rowA.y + 30, c.circuit.toFixed(1) + ' ms', { align: 'right', size: 9.5, color: T['--ink-3'], mono: true });
        G.label(ctx, 88, rowB.y + 15, '报文交换', { align: 'right', size: 11, weight: 700, color: T['--purple'] });
        G.label(ctx, 88, rowB.y + 31, c.message.toFixed(1) + ' ms', { align: 'right', size: 9.5, color: T['--ink-3'], mono: true });
        G.label(ctx, 88, rowC.y + 14, '分组交换', { align: 'right', size: 11, weight: 700, color: T['--brand'] });
        G.label(ctx, 88, rowC.y + 30, c.packet.toFixed(1) + ' ms', { align: 'right', size: 9.5, color: T['--ink-3'], mono: true });
        G.label(ctx, 88, rowC.y + 48, '跳1/跳2/跳3', { align: 'right', size: 8.5, color: T['--ink-3'] });
        const seg = (xa, xb, y, h, color, text, alpha) => {
          const w = Math.max(0, xb - xa);
          if (w < 1) return;
          G.box(ctx, xa, y, w, h, { fill: D.withAlpha(color, alpha || 0.2), stroke: D.withAlpha(color, 0.85), radius: 4 });
          if (text && w > 44) G.label(ctx, xa + w / 2, y + h / 2, text, { size: w > 110 ? 10 : 8.5, color: T['--ink'] });
        };
        // 电路交换：建立 → 连续传输 → 尾部传播
        const byA = rowA.y + 8;
        seg(X(0), X(state.setup), byA, rowA.h - 16, T['--accent'], '建立', 0.26);
        seg(X(state.setup), X(state.setup + c.Tm), byA, rowA.h - 16, T['--brand'], '数据连续传输');
        seg(X(state.setup + c.Tm), X(c.circuit), byA, rowA.h - 16, T['--purple'], '', 0.12);
        // 报文交换：每跳完整存储转发整份报文
        const byB = rowB.y + 9;
        const hopColors = [T['--brand'], T['--purple'], T['--teal']];
        for (let h = 0; h < HOPS; h++) {
          const st = h * (c.Tm + state.tp);
          seg(X(st), X(st + c.Tm), byB, rowB.h - 18, hopColors[h], '第' + (h + 1) + '跳');
        }
        // 分组交换：三跳流水线
        const laneH = (rowC.h - 8) / HOPS;
        const Tp = c.Tm / state.n;
        const pColors = [T['--brand'], T['--teal'], T['--accent'], T['--purple']];
        for (let h = 0; h < HOPS; h++) {
          const ly = rowC.y + 4 + h * laneH;
          for (let j = 0; j < state.n; j++) {
            const st = j * Tp + h * (Tp + state.tp);
            const xa = X(st), xb = X(st + Tp);
            if (xb - xa < 1.2) continue;
            G.box(ctx, xa, ly + 2, Math.max(1.2, xb - xa), laneH - 5, { fill: D.withAlpha(pColors[j % 4], 0.75), stroke: null, radius: 2 });
            if (xb - xa > 16) G.label(ctx, (xa + xb) / 2, ly + laneH / 2, 'P' + (j + 1), { size: xb - xa > 30 ? 8 : 7, color: T['--ink'], mono: true });
          }
        }
        G.box(ctx, 16, p.h - 48, p.w - 32, 34, { fill: D.withAlpha(T['--green'], 0.08), stroke: D.withAlpha(T['--green'], 0.4), radius: 7 });
        G.label(ctx, 28, p.h - 31, '电路 ' + c.circuit.toFixed(1) + ' ms｜报文 ' + c.message.toFixed(1) + ' ms｜分组 ' + c.packet.toFixed(1) + ' ms（3 跳链路）', { align: 'left', size: 10.5, weight: 700, color: T['--green'], mono: true });
        G.label(ctx, p.w - 28, p.h - 31, '报文交换逐跳存储转发整份报文，时延最大；分组交换按流水线逐跳转发，分组数越大越接近 M/R', { align: 'right', size: 9.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['电路交换', c.circuit.toFixed(1) + ' ms'],
        ['报文交换', c.message.toFixed(1) + ' ms'],
        ['分组交换', c.packet.toFixed(1) + ' ms'],
        ['单个分组发送时延', (c.Tm / state.n).toFixed(2) + ' ms']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 逐层封装与首部开销 ---------- */
  W.encapsulation = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const DATA = 1500;
    const steps = [
      { layer: '应用层', pdu: '报文', heads: [], tail: false, note: '应用层产生数据（报文 1500 B），还没有任何首部' },
      { layer: '传输层', pdu: '报文段', heads: [['TCP', 20, '--brand']], tail: false, note: '＋ TCP 首部 20 B（端口、序号、确认号）→ 报文段' },
      { layer: '网络层', pdu: '分组', heads: [['IP', 20, '--purple'], ['TCP', 20, '--brand']], tail: false, note: '＋ IP 首部 20 B（源/目的 IP、TTL）→ 分组（数据报）' },
      { layer: '数据链路层', pdu: '帧', heads: [['帧首', 14, '--green'], ['IP', 20, '--purple'], ['TCP', 20, '--brand']], tail: true, note: '＋ 帧首部 14 B 与帧尾部 4 B（MAC 地址、FCS）→ 帧' },
      { layer: '物理层', pdu: '比特流', heads: [['帧首', 14, '--green'], ['IP', 20, '--purple'], ['TCP', 20, '--brand']], tail: true, note: '不再加首部：1558 B × 8 = 12464 bit，逐位发送到物理介质' }
    ];
    const sizes = [1500, 1520, 1540, 1558, 1558];
    const state = { step: 0 };
    UI.transport(ctrl, { total: steps.length, onChange: k => { state.step = k; render(); } });
    function render() {
      const k = state.step;
      const ratio = (DATA / sizes[k] * 100).toFixed(1);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 92, x1 = p.w - 26, top = 40;
        const rowH = 44, gap = 9;
        steps.forEach((st, i) => {
          const y = top + i * (rowH + gap);
          const on = i === k, dim = i > k;
          ctx.save();
          if (dim) ctx.globalAlpha = 0.22;
          const cy = y + rowH / 2;
          G.label(ctx, 80, cy - 6, st.layer, { align: 'right', size: 10.5, weight: on ? 700 : 600, color: on ? T['--brand'] : T['--ink-2'] });
          G.label(ctx, 80, cy + 9, st.pdu, { align: 'right', size: 8.5, color: T['--ink-3'] });
          const barH = 28, by = y + (rowH - barH) / 2;
          const headW = 52, tailW = 44;
          const dataW = (x1 - x0) - st.heads.length * headW - (st.tail ? tailW : 0);
          let x = x0;
          st.heads.forEach((hd, hi) => {
            const isNew = on && i >= 1 && i <= 3 && hi === 0;
            G.box(ctx, x, by, headW, barH, {
              fill: D.withAlpha(hd[2], isNew ? 0.3 : 0.16),
              stroke: D.withAlpha(hd[2], isNew ? 1 : 0.7),
              width: isNew ? 2.4 : 1.2, radius: 5
            });
            G.lines(ctx, x + headW / 2, by + barH / 2 - 5, [hd[0], hd[1] + ' B'], { size: 8.5, lineHeight: 10, mono: true, color: hd[2] });
            if (isNew) G.label(ctx, x + headW / 2, by - 6, '＋新增', { size: 8.5, weight: 700, color: hd[2] });
            x += headW;
          });
          G.box(ctx, x, by, dataW, barH, { fill: D.withAlpha(T['--teal'], 0.14), stroke: D.withAlpha(T['--teal'], 0.6), radius: 5 });
          if (i === 4) {
            ctx.save();
            ctx.beginPath(); ctx.rect(x + 2, by + 2, dataW - 4, barH - 4); ctx.clip();
            ctx.font = '700 9px ' + D.FONT_MONO;
            ctx.fillStyle = T['--ink-3'];
            ctx.textBaseline = 'middle';
            const pat = '10110100101101001011010010110100101101001011010010110100';
            const gapL = x + dataW / 2 - 54, gapR = x + dataW / 2 + 54;
            let bx = x + 4;
            while (bx < x + dataW) {
              const pw2 = ctx.measureText(pat).width + 6;
              if (bx + pw2 > gapL && bx < gapR) { bx = gapR + 4; continue; }
              ctx.fillText(pat, bx, by + barH / 2);
              bx += pw2;
            }
            ctx.restore();
            G.box(ctx, x + dataW / 2 - 44, by + barH / 2 - 10, 88, 20, { fill: T['--card'], stroke: D.withAlpha(T['--teal'], 0.55), radius: 5 });
            G.label(ctx, x + dataW / 2, by + barH / 2, '12464 bit', { size: 10.5, weight: 700, color: T['--ink'], mono: true, baseline: 'middle' });
          } else {
            G.label(ctx, x + dataW / 2, by + barH / 2, '数据 ' + DATA + ' B', { size: 10.5, weight: 700, color: T['--ink'], mono: true });
          }
          x += dataW;
          if (st.tail) {
            const isNew = on && i === 3;
            G.box(ctx, x, by, tailW, barH, {
              fill: D.withAlpha(T['--green'], isNew ? 0.3 : 0.16),
              stroke: D.withAlpha(T['--green'], isNew ? 1 : 0.7),
              width: isNew ? 2.4 : 1.2, radius: 5
            });
            G.lines(ctx, x + tailW / 2, by + barH / 2 - 5, ['帧尾', '4 B'], { size: 8.5, lineHeight: 10, mono: true, color: T['--green'] });
            if (isNew) G.label(ctx, x + tailW / 2, by - 6, '＋新增', { size: 8.5, weight: 700, color: T['--green'] });
          }
          ctx.restore();
        });
        G.box(ctx, 16, p.h - 42, p.w - 32, 30, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 7 });
        G.label(ctx, 28, p.h - 27, st0(k), { align: 'left', size: 10.5, color: T['--brand'] });
        G.label(ctx, p.w - 28, p.h - 27, '当前 ' + sizes[k] + ' B　首部开销 ' + (sizes[k] - DATA) + ' B　效率 ' + ratio + '%', { align: 'right', size: 10.5, weight: 700, color: T['--ink-2'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['当前层', steps[k].layer],
        ['PDU', steps[k].pdu],
        ['封装后长度', sizes[k] + ' B'],
        ['首部开销', (sizes[k] - DATA) + ' B'],
        ['传输效率', ratio + '%']
      ]);
      function st0(i) { return steps[i].note; }
    }
    render();
    return s;
  };

})(window);
