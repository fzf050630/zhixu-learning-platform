/* ============================================================
   net5.js — 第5章 传输层 可视化组件
   tcpUdpHeader：UDP / TCP 首部格式
   portSocket：复用与分用（套接字端口复用/按端口分用）
   tcpHandshake：三次握手与四次挥手
   tcpWindow：滑动窗口与可靠传输
   congestion：TCP 拥塞控制
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- UDP / TCP 首部 ---------- */
  W.tcpUdpHeader = function (host) {
    const s = UI.shell(host, 280);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { proto: 'tcp' };
    UI.seg(ctrl, [{ label: 'TCP 首部', value: 'tcp' }, { label: 'UDP 首部', value: 'udp' }], v => { state.proto = v; render(); }, 0);

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w - 40;
        if (state.proto === 'udp') {
          G.label(ctx, w / 2 + 20, 24, 'UDP 首部（8 字节，固定）', { size: 12, weight: 700, color: T['--ink'] });
          const rows = [
            ['源端口 (16 bit)', 16, T['--brand']], ['目的端口 (16 bit)', 16, T['--brand']],
            ['长度 (16 bit)', 16, T['--purple']], ['校验和 (16 bit)', 16, T['--purple']]
          ];
          G.bits(ctx, 20, 44, w, 34, { groups: rows.slice(0, 2).map(r => ({ name: r[0], bits: r[1], color: r[2] })), alpha: 0.16, nameSize: 10 });
          G.bits(ctx, 20, 92, w, 34, { groups: rows.slice(2).map(r => ({ name: r[0], bits: r[1], color: r[2] })), alpha: 0.16, nameSize: 10 });
          G.label(ctx, w / 2 + 20, 150, '特点：无连接、尽最大努力交付、首部开销小、支持一对一/一对多/多对一', { size: 11, color: T['--ink-2'] });
          G.label(ctx, w / 2 + 20, 174, '适合实时性要求高、能容忍少量丢失的应用（DNS、视频、语音）', { size: 10.5, color: T['--ink-3'] });
        } else {
          G.label(ctx, w / 2 + 20, 24, 'TCP 首部（最小 20 字节，最大 60 字节）', { size: 12, weight: 700, color: T['--ink'] });
          G.bits(ctx, 20, 40, w, 30, { groups: [{ name: '源端口', bits: 16, color: T['--brand'] }, { name: '目的端口', bits: 16, color: T['--brand'] }], alpha: 0.16, nameSize: 10 });
          G.bits(ctx, 20, 76, w, 30, { groups: [{ name: '序号 seq', bits: 32, color: T['--purple'] }], alpha: 0.16, nameSize: 10 });
          G.bits(ctx, 20, 112, w, 30, { groups: [{ name: '确认号 ack', bits: 32, color: T['--green'] }], alpha: 0.16, nameSize: 10 });
          G.bits(ctx, 20, 148, w, 30, { groups: [{ name: '数据偏移', bits: 4, color: T['--ink-3'] }, { name: '保留', bits: 6, color: T['--ink-3'] }, { name: '标志位 URG/ACK/PSH/RST/SYN/FIN', bits: 6, color: T['--accent'] }, { name: '窗口', bits: 16, color: T['--brand'] }], alpha: 0.16, nameSize: 9 });
          G.bits(ctx, 20, 184, w, 30, { groups: [{ name: '校验和', bits: 16, color: T['--purple'] }, { name: '紧急指针', bits: 16, color: T['--purple'] }], alpha: 0.16, nameSize: 10 });
          G.label(ctx, w / 2 + 20, p.h - 14, '面向连接、可靠、全双工、面向字节流；序号与确认号以字节为单位', { size: 10.5, color: T['--ink-3'] });
        }
      });
      scene.render();
      UI.readout(out, [['协议', state.proto.toUpperCase()], ['首部长度', state.proto === 'udp' ? '8 字节固定' : '20~60 字节'], ['可靠性', state.proto === 'udp' ? '不可靠' : '可靠（确认+重传）']]);
    }
    render();
    return s;
  };

  /* ---------- 三次握手 / 四次挥手 ---------- */
  W.tcpHandshake = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'connect', i: 0 };
    const connect = [
      { from: 'C', to: 'S', flag: 'SYN=1, seq=x', d: '客户端发送连接请求，SYN=1，序号 x，进入 SYN_SENT', c: C('--brand') },
      { from: 'S', to: 'C', flag: 'SYN=1, ACK=1, seq=y, ack=x+1', d: '服务器同意连接，SYN=1、ACK=1，分配资源，进入 SYN_RCVD', c: C('--green') },
      { from: 'C', to: 'S', flag: 'ACK=1, seq=x+1, ack=y+1', d: '客户端确认，进入 ESTABLISHED；服务器收到后也进入 ESTABLISHED', c: C('--brand') }
    ];
    const close = [
      { from: 'C', to: 'S', flag: 'FIN=1, seq=u', d: '客户端请求关闭，进入 FIN_WAIT_1', c: C('--brand') },
      { from: 'S', to: 'C', flag: 'ACK=1, ack=u+1', d: '服务器确认，进入 CLOSE_WAIT；客户端进入 FIN_WAIT_2', c: C('--green') },
      { from: 'S', to: 'C', flag: 'FIN=1, ACK=1, seq=w, ack=u+1', d: '服务器数据发完，发送 FIN，进入 LAST_ACK', c: C('--green') },
      { from: 'C', to: 'S', flag: 'ACK=1, ack=w+1', d: '客户端确认，进入 TIME_WAIT，等待 2MSL 后关闭', c: C('--brand') }
    ];
    const seq = state.mode === 'connect' ? connect : close;
    UI.seg(ctrl, [{ label: '三次握手', value: 'connect' }, { label: '四次挥手', value: 'close' }], v => { state.mode = v; state.i = 0; render(); }, 0);
    UI.transport(ctrl, { total: seq.length, onChange: k => { state.i = k; render(); } });

    function render() {
      const list = state.mode === 'connect' ? connect : close;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const xC = 80, xS = p.w - 80;
        G.box(ctx, xC - 30, 20, 60, 30, { fill: D.withAlpha(T['--brand'], 0.14), stroke: T['--brand'], radius: 7, title: '客户端', titleColor: T['--brand'], titleSize: 11 });
        G.box(ctx, xS - 30, 20, 60, 30, { fill: D.withAlpha(T['--green'], 0.14), stroke: T['--green'], radius: 7, title: '服务器', titleColor: T['--green'], titleSize: 11 });
        ctx.save(); ctx.strokeStyle = T['--line']; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(xC, 56); ctx.lineTo(xC, p.h - 20); ctx.moveTo(xS, 56); ctx.lineTo(xS, p.h - 20); ctx.stroke(); ctx.restore();
        const stepY = (p.h - 90) / list.length;
        list.forEach((st, k) => {
          const y = 70 + k * stepY + stepY / 2;
          const on = k === state.i;
          const x1 = st.from === 'C' ? xC : xS, x2 = st.to === 'C' ? xC : xS;
          G.arrow(ctx, [[x1, y], [x2, y]], { color: on ? st.c : D.withAlpha(st.c, 0.45), width: on ? 3 : 1.8, head: 8 });
          G.label(ctx, (x1 + x2) / 2, y - 12, st.flag, { size: 10, weight: on ? 700 : 500, color: on ? st.c : T['--ink-3'], mono: true });
        });
        G.box(ctx, 16, p.h - 46, p.w - 32, 34, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 8 });
        G.label(ctx, 28, p.h - 29, list[state.i].d, { align: 'left', size: 11, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [['阶段', state.mode === 'connect' ? '三次握手' : '四次挥手'], ['报文', list[state.i].flag], ['序号', String(state.i + 1) + ' / ' + list.length]]);
    }
    render();
    return s;
  };

  /* ---------- 滑动窗口 ---------- */
  W.tcpWindow = function (host) {
    const s = UI.shell(host, 280);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { win: 8, acked: 3, sent: 5, total: 12 };
    UI.slider(ctrl, { label: '窗口大小', min: 2, max: 12, step: 1, value: 8, fmt: v => v, onInput: v => { state.win = v; state.sent = Math.min(state.sent, state.acked + v); render(); } });
    UI.slider(ctrl, { label: '已确认', min: 0, max: 10, step: 1, value: 3, fmt: v => v, onInput: v => { state.acked = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const n = Math.max(state.total, state.acked + state.win + 2);
        const cw = (p.w - 60) / n;
        const y = 60;
        G.label(ctx, 30, 30, `窗口 ${state.win} 字节，已确认到 ${state.acked}，可发送 [${state.acked}, ${state.acked + state.win})`, { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
        for (let k = 0; k < n; k++) {
          const x = 30 + k * cw;
          const acked = k < state.acked;
          const inWin = k >= state.acked && k < state.acked + state.win;
          const color = acked ? T['--green'] : (inWin ? T['--brand'] : T['--line-2']);
          G.box(ctx, x + 2, y, cw - 4, 44, {
            fill: acked ? D.withAlpha(T['--green'], 0.2) : (inWin ? D.withAlpha(T['--brand'], 0.16) : T['--card-2']),
            stroke: color, radius: 5
          });
          G.label(ctx, x + cw / 2, y + 22, String(k + 1), { size: 11, weight: 700, color: acked ? T['--green'] : (inWin ? T['--brand'] : T['--ink-3']), mono: true });
        }
        // 窗口框
        const wx = 30 + state.acked * cw, ww = state.win * cw;
        ctx.save(); ctx.strokeStyle = T['--brand']; ctx.lineWidth = 2.4; ctx.setLineDash([5, 4]);
        ctx.strokeRect(wx + 1, y - 6, ww - 2, 56); ctx.restore();
        G.label(ctx, wx + ww / 2, y - 16, '发送窗口', { size: 10.5, weight: 700, color: T['--brand'] });
        // 累计确认说明
        G.box(ctx, 30, y + 76, p.w - 60, 46, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 42, y + 94, '滑动：收到累计确认后，窗口前移；未确认数据保留以便超时重传', { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, 42, y + 112, `当前可发送序号范围：[${state.acked + 1}, ${state.acked + state.win}]（共 ${state.win} 个）`, { align: 'left', size: 10.5, color: T['--brand'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['窗口大小', String(state.win)],
        ['已确认', String(state.acked)],
        ['可发送范围', `[${state.acked + 1}, ${state.acked + state.win}]`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 拥塞控制 ---------- */
  W.congestion = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { ssthresh: 8, loseAt: 12 };
    UI.slider(ctrl, { label: '初始 ssthresh', min: 4, max: 16, step: 1, value: 8, fmt: v => v, onInput: v => { state.ssthresh = v; render(); } });
    UI.slider(ctrl, { label: '超时发生轮次', min: 6, max: 20, step: 1, value: 12, fmt: v => v + ' RTT', onInput: v => { state.loseAt = v; render(); } });

    function simulate() {
      const pts = [];
      let cwnd = 1, ssthresh = state.ssthresh, phase = 'slow';
      const events = [];
      for (let t = 1; t <= 20; t++) {
        pts.push({ t, cwnd, phase });
        if (t === state.loseAt) {
          events.push({ t, type: 'timeout', cwnd });
          ssthresh = Math.max(2, Math.floor(cwnd / 2));
          cwnd = 1; phase = 'slow';
          continue;
        }
        if (phase === 'slow') { cwnd *= 2; if (cwnd >= ssthresh) { cwnd = Math.min(cwnd, ssthresh); phase = 'avoid'; } }
        else { cwnd += 1; }
      }
      return { pts, events, ssthresh };
    }

    function render() {
      const { pts, events, ssthresh } = simulate();
      const maxC = Math.max(...pts.map(p => p.cwnd), 16);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 46, y0 = 30, w = p.w - 70, h = p.h - 100;
        const X = t => x0 + (t - 1) / 19 * w;
        const Y = c => y0 + h - c / maxC * h;
        ctx.save(); ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + h); ctx.lineTo(x0 + w, y0 + h); ctx.stroke(); ctx.restore();
        G.label(ctx, x0 + w, y0 + h + 14, 'RTT', { align: 'right', size: 10, color: T['--ink-3'] });
        G.label(ctx, x0 - 6, y0 + 4, 'cwnd', { align: 'right', size: 10, color: T['--ink-3'] });
        // ssthresh 线
        ctx.save(); ctx.strokeStyle = T['--accent']; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(x0, Y(ssthresh)); ctx.lineTo(x0 + w, Y(ssthresh)); ctx.stroke(); ctx.restore();
        G.label(ctx, x0 + 6, Y(ssthresh) - 6, 'ssthresh = ' + ssthresh, { align: 'left', size: 10, color: T['--accent'] });
        // cwnd 折线
        ctx.save(); ctx.lineWidth = 2.4;
        for (let k = 1; k < pts.length; k++) {
          ctx.strokeStyle = pts[k].phase === 'slow' ? T['--brand'] : T['--green'];
          ctx.beginPath(); ctx.moveTo(X(pts[k - 1].t), Y(pts[k - 1].cwnd)); ctx.lineTo(X(pts[k].t), Y(pts[k].cwnd)); ctx.stroke();
        }
        ctx.restore();
        pts.forEach(pt => G.dot(ctx, X(pt.t), Y(pt.cwnd), 3, pt.phase === 'slow' ? T['--brand'] : T['--green']));
        events.forEach(ev => {
          G.dot(ctx, X(ev.t), Y(ev.cwnd), 6, T['--red'], true);
          G.label(ctx, X(ev.t), Y(ev.cwnd) - 12, '超时', { size: 10, weight: 700, color: T['--red'] });
        });
        G.label(ctx, x0 + 12, y0 + 16, '慢开始（指数增长）', { align: 'left', size: 10.5, weight: 700, color: T['--brand'] });
        G.label(ctx, x0 + 12, y0 + 32, '拥塞避免（线性增长）', { align: 'left', size: 10.5, weight: 700, color: T['--green'] });
      });
      scene.render();
      UI.readout(out, [
        ['初始 ssthresh', String(state.ssthresh)],
        ['超时后 ssthresh', String(ssthresh)],
        ['超时后 cwnd', '1（重新慢开始）'],
        ['快恢复', '收到 3 个重复 ACK：ssthresh 减半，cwnd = ssthresh，直接进入拥塞避免']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 复用与分用：端口与套接字 ---------- */
  W.portSocket = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const srcIP = '10.0.0.5', dstIP = '10.0.0.1';
    const apps = [
      { name: '浏览器进程', sport: 50000, dport: 80, dname: 'Web 服务器', proto: 'TCP', c: C('--brand') },
      { name: '邮件进程', sport: 50001, dport: 25, dname: 'SMTP 服务器', proto: 'TCP', c: C('--purple') },
      { name: 'DNS 进程', sport: 50002, dport: 53, dname: 'DNS 服务器', proto: 'UDP', c: C('--teal') }
    ];
    let i = 0;
    UI.transport(ctrl, { total: apps.length, onChange: k => { i = k; scene.animate(650); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx, t) => {
        const T = D.Theme.cache;
        // 主机框
        const boxY = 36, boxH = 200;
        G.box(ctx, 20, boxY, 128, boxH, { fill: D.withAlpha(T['--brand'], 0.05), stroke: T['--line'], radius: 10 });
        G.label(ctx, 84, boxY + 16, '主机 A', { size: 11.5, weight: 800, color: T['--brand'] });
        G.label(ctx, 84, boxY + 32, srcIP, { size: 9.5, color: T['--ink-2'], mono: true });
        G.box(ctx, p.w - 148, boxY, 128, boxH, { fill: D.withAlpha(T['--green'], 0.05), stroke: T['--line'], radius: 10 });
        G.label(ctx, p.w - 84, boxY + 16, '主机 B', { size: 11.5, weight: 800, color: T['--green'] });
        G.label(ctx, p.w - 84, boxY + 32, dstIP, { size: 9.5, color: T['--ink-2'], mono: true });
        // 传输层带
        const tl = 176, tw = 44;
        G.box(ctx, tl, boxY + 44, tw, boxH - 44, { fill: D.withAlpha(T['--accent'], 0.1), stroke: D.withAlpha(T['--accent'], 0.5), radius: 6 });
        G.label(ctx, tl + tw / 2, boxY + 62, '传输层', { size: 9.5, weight: 700, color: T['--accent'] });
        G.label(ctx, tl + tw / 2, boxY + 78, '复用', { size: 9.5, weight: 700, color: T['--accent'] });
        const tr = p.w - 220;
        G.box(ctx, tr, boxY + 44, tw, boxH - 44, { fill: D.withAlpha(T['--accent'], 0.1), stroke: D.withAlpha(T['--accent'], 0.5), radius: 6 });
        G.label(ctx, tr + tw / 2, boxY + 62, '传输层', { size: 9.5, weight: 700, color: T['--accent'] });
        G.label(ctx, tr + tw / 2, boxY + 78, '分用', { size: 9.5, weight: 700, color: T['--accent'] });
        // 网络层带
        const nx0 = 250, nx1 = p.w - 250;
        G.box(ctx, nx0, boxY + 118, nx1 - nx0, 32, { fill: D.withAlpha(T['--ink-3'], 0.06), stroke: D.withAlpha(T['--line-2'], 0.9), radius: 6 });
        G.label(ctx, (nx0 + nx1) / 2, boxY + 134, '网络层（IP 数据报）', { size: 10, color: T['--ink-3'] });
        // 进程行
        apps.forEach((a, k) => {
          const y = boxY + 58 + k * 48;
          const col = a.c;
          const active = k === i;
          const done = k < i;
          G.box(ctx, 26, y - 13, 116, 30, { fill: D.withAlpha(col, active ? 0.22 : 0.08), stroke: active ? col : D.withAlpha(col, 0.5), width: active ? 2 : 1, radius: 7 });
          G.label(ctx, 84, y - 4, a.name, { size: 9.5, weight: 700, color: active ? col : T['--ink-2'] });
          G.label(ctx, 84, y + 9, srcIP + ':' + a.sport, { size: 8.5, color: T['--ink-3'], mono: true });
          G.box(ctx, p.w - 142, y - 13, 116, 30, { fill: D.withAlpha(T['--green'], active ? 0.22 : 0.08), stroke: active ? T['--green'] : D.withAlpha(T['--green'], 0.5), width: active ? 2 : 1, radius: 7 });
          G.label(ctx, p.w - 84, y - 4, a.dname, { size: 9.5, weight: 700, color: active ? T['--green'] : T['--ink-2'] });
          G.label(ctx, p.w - 84, y + 9, dstIP + ':' + a.dport, { size: 8.5, color: T['--ink-3'], mono: true });
          // 报文
          if (done) {
            G.label(ctx, p.w - 160, y + 2, '✓ 已交付', { align: 'right', size: 9, weight: 700, color: T['--green'] });
          } else if (active) {
            const x0 = 148, x1 = p.w - 152;
            const x = x0 + (x1 - x0) * Math.min(1, Math.max(0, t));
            G.box(ctx, x - 34, y - 11, 68, 22, { fill: D.withAlpha(col, 0.24), stroke: col, width: 1.8, radius: 6 });
            G.label(ctx, x, y, a.sport + '→' + a.dport, { size: 9.5, weight: 800, color: col, mono: true });
            G.dot(ctx, x, y + 26, 3, col);
          }
        });
        // 底部说明
        G.box(ctx, 16, p.h - 56, p.w - 32, 42, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 8 });
        const a = apps[i];
        G.label(ctx, 28, p.h - 39, `复用：多个进程的报文段共用传输层，靠源端口 ${a.sport} 区分`, { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, 28, p.h - 22, `分用：到达后按目的端口 ${a.dport} 交付给 ${a.dname}（${a.proto}）`, { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      const a = apps[i];
      UI.readout(out, [
        ['源套接字', srcIP + ':' + a.sport],
        ['目的套接字', dstIP + ':' + a.dport],
        ['协议', a.proto],
        ['复用/分用', '复用（发送）→ 分用（接收）']
      ]);
    }
    render();
    return s;
  };

})(window);
