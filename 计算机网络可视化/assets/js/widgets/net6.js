/* ============================================================
   net6.js — 第6章 应用层 可视化组件
   dnsFlow：域名解析（递归 / 迭代）
   httpFlow：HTTP 请求过程与持久连接
   emailFlow：电子邮件系统（SMTP / POP3）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- DNS 解析 ---------- */
  W.dnsFlow = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'iter', i: 0 };
    const iter = [
      { from: '主机', to: '本地DNS', label: '查询 www.example.com', d: '主机把查询发给本地域名服务器（递归查询）' },
      { from: '本地DNS', to: '根DNS', label: '查询 .com', d: '本地服务器向根域名服务器查询，根返回顶级域 .com 的地址' },
      { from: '本地DNS', to: '顶级DNS', label: '查询 example.com', d: '向顶级域名服务器查询，返回权威域名服务器地址' },
      { from: '本地DNS', to: '权威DNS', label: '查询 www.example.com', d: '向权威域名服务器查询，得到最终 IP 地址' },
      { from: '本地DNS', to: '主机', label: '返回 IP', d: '本地服务器把结果返回主机并缓存' }
    ];
    const rec = [
      { from: '主机', to: '本地DNS', label: '递归查询', d: '主机向本地域名服务器发出递归查询，等待最终结果' },
      { from: '本地DNS', to: '根/顶级/权威', label: '本地服务器逐级查询', d: '本地服务器代替主机逐级迭代查询' },
      { from: '本地DNS', to: '主机', label: '返回并缓存', d: '得到结果后返回主机，并按 TTL 缓存' }
    ];
    const list = state.mode === 'iter' ? iter : rec;
    UI.seg(ctrl, [{ label: '迭代查询', value: 'iter' }, { label: '递归与缓存', value: 'rec' }], v => { state.mode = v; state.i = 0; render(); }, 0);
    UI.transport(ctrl, { total: list.length, onChange: k => { state.i = k; render(); } });

    function render() {
      const seq = state.mode === 'iter' ? iter : rec;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const nodes = {
          '主机': [80, 60], '本地DNS': [80, 180], '根DNS': [p.w - 200, 60], '顶级DNS': [p.w - 200, 130], '权威DNS': [p.w - 200, 200], '根/顶级/权威': [p.w - 200, 130]
        };
        const colors = { '主机': T['--brand'], '本地DNS': T['--purple'], '根DNS': T['--accent'], '顶级DNS': T['--accent'], '权威DNS': T['--green'], '根/顶级/权威': T['--accent'] };
        Object.entries(nodes).forEach(([n, [x, y]]) => {
          G.box(ctx, x - 44, y - 16, 88, 32, { fill: D.withAlpha(colors[n], 0.14), stroke: colors[n], radius: 7 });
          G.label(ctx, x, y, n, { size: 11, weight: 700, color: colors[n] });
        });
        const st = seq[state.i];
        const a = nodes[st.from], b = nodes[st.to];
        G.arrow(ctx, [[a[0] + (a[0] < b[0] ? 44 : -44), a[1]], [b[0] + (a[0] < b[0] ? -44 : 44), b[1]]], { color: T['--red'], width: 3, head: 8 });
        G.label(ctx, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 8, st.label, { size: 10, weight: 700, color: T['--red'], mono: true });
        G.box(ctx, 16, p.h - 44, p.w - 32, 32, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 8 });
        G.label(ctx, 28, p.h - 28, st.d, { align: 'left', size: 10.5, color: T['--ink-2'] });
        // 层次树
        G.label(ctx, p.w - 200, p.h - 8, '根 → 顶级 → 权限 → 本地（层次域名空间）', { align: 'right', size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['步骤', String(state.i + 1) + ' / ' + seq.length], ['报文', seq[state.i].label]]);
    }
    render();
    return s;
  };

  /* ---------- HTTP 请求过程 ---------- */
  W.httpFlow = function (host) {
    const s = UI.shell(host, 290);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { persistent: true, i: 0, n: 3 };
    const steps = [
      { t: 'DNS 解析域名', d: '把 www.example.com 解析为服务器 IP 地址' },
      { t: '建立 TCP 连接', d: '三次握手，建立客户端与服务器的可靠连接' },
      { t: '发送 HTTP 请求', d: 'GET /index.html HTTP/1.1，含 Host、User-Agent 等首部' },
      { t: '服务器响应', d: 'HTTP/1.1 200 OK，返回 HTML 内容与首部' },
      { t: '请求内嵌对象', d: state.persistent ? '非持久连接：每个对象都要重新建立 TCP 连接' : '持久连接：同一连接上顺序请求多个对象（HTTP/1.1 默认）' },
      { t: '关闭连接', d: state.persistent ? '每个对象响应后即关闭连接（HTTP/1.0）' : '全部对象接收完毕后再关闭连接' }
    ];
    UI.seg(ctrl, [{ label: '非持久连接', value: 'no' }, { label: '持久连接', value: 'yes' }], v => { state.persistent = v === 'no'; render(); }, 1);
    UI.slider(ctrl, { label: '内嵌对象数', min: 1, max: 6, step: 1, value: 3, fmt: v => v, onInput: v => { state.n = v; render(); } });

    function calc() {
      const rtt = 1;
      const perConn = 2;         // 三次握手约 2 RTT
      const conns = state.persistent ? 1 : (1 + state.n);
      const rtts = state.persistent ? (perConn + state.n + 1) : (state.n + 2) * perConn + state.n;
      return { conns, rtts };
    }

    function render() {
      const { conns, rtts } = calc();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const xC = 80, xS = p.w - 80;
        G.box(ctx, xC - 30, 16, 60, 28, { fill: D.withAlpha(T['--brand'], 0.14), stroke: T['--brand'], radius: 7, title: '客户端', titleColor: T['--brand'], titleSize: 11 });
        G.box(ctx, xS - 30, 16, 60, 28, { fill: D.withAlpha(T['--green'], 0.14), stroke: T['--green'], radius: 7, title: '服务器', titleColor: T['--green'], titleSize: 11 });
        const list = state.persistent
          ? [['TCP 握手', 'red'], ['GET /index.html', 'brand'], ['200 OK + HTML', 'green'], ['GET /a.css', 'brand'], ['200 OK', 'green'], ['…更多对象', 'ink'], ['关闭连接', 'accent']]
          : [['TCP 握手 1', 'red'], ['GET /index.html', 'brand'], ['200 OK', 'green'], ['关闭', 'accent'], ['TCP 握手 2', 'red'], ['GET /a.css', 'brand'], ['200 OK', 'green'], ['关闭', 'accent']];
        const cmap = { red: T['--red'], brand: T['--brand'], green: T['--green'], accent: T['--accent'], ink: T['--ink-3'] };
        const stepY = (p.h - 70) / list.length;
        list.forEach(([label, ck], k) => {
          const y = 54 + k * stepY + stepY / 2;
          const toRight = k % 2 === 0;
          G.arrow(ctx, [[toRight ? xC : xS, y], [toRight ? xS : xC, y]], { color: cmap[ck], width: 2, head: 7 });
          G.label(ctx, p.w / 2, y - 10, label, { size: 9.5, color: cmap[ck], mono: true });
        });
        G.box(ctx, 16, p.h - 34, p.w - 32, 24, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 6 });
        G.label(ctx, 28, p.h - 22, `TCP 连接数 ≈ ${conns}　·　总时延约 ${rtts} × RTT（含 DNS 与握手）`, { align: 'left', size: 10.5, weight: 700, color: T['--brand'] });
      });
      scene.render();
      UI.readout(out, [
        ['连接方式', state.persistent ? '非持久连接' : '持久连接'],
        ['内嵌对象', String(state.n)],
        ['TCP 连接数', String(conns)],
        ['总时延约', rtts + ' × RTT']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 电子邮件 ---------- */
  W.emailFlow = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { t: '发送方用户代理', d: '用户编写邮件，用户代理使用 SMTP 把邮件推送到发送方邮件服务器' },
      { t: '发送方邮件服务器', d: '通过 SMTP 把邮件发送到接收方邮件服务器（可能是多次中转）' },
      { t: '接收方邮件服务器', d: '把邮件存入收件人的用户邮箱，等待收件人读取' },
      { t: '接收方用户代理', d: '使用 POP3 / IMAP 从服务器拉取邮件（POP3 取走后通常删除，IMAP 保留在服务器）' }
    ];
    let i = 0;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });
    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const y = 60;
        const boxes = [
          { n: '发送方\n用户代理', x: 60, c: T['--brand'] },
          { n: '发送方\n邮件服务器', x: p.w * 0.38, c: T['--purple'] },
          { n: '接收方\n邮件服务器', x: p.w * 0.68, c: T['--green'] },
          { n: '接收方\n用户代理', x: p.w - 60, c: T['--accent'] }
        ];
        boxes.forEach((b, k) => {
          const on = k === i || k === i + 1;
          G.box(ctx, b.x - 52, y - 22, 104, 44, { fill: D.withAlpha(b.c, on ? 0.2 : 0.1), stroke: on ? b.c : D.withAlpha(b.c, 0.45), width: on ? 2 : 1.2, radius: 8 });
          b.n.split('\n').forEach((line, li) => G.label(ctx, b.x, y - 6 + li * 14, line, { size: 10.5, weight: 700, color: b.c }));
        });
        const links = [['SMTP', 0], ['SMTP', 1], ['POP3/IMAP', 2]];
        links.forEach(([label, k]) => {
          const x1 = boxes[k].x + 52, x2 = boxes[k + 1].x - 52;
          const on = k === i - (k > 0 ? 0 : 1) || k === i;
          G.arrow(ctx, [[x1, y], [x2, y]], { color: on ? T['--red'] : D.withAlpha(T['--line-2'], 0.9), width: on ? 2.6 : 1.2, head: 6 });
          G.label(ctx, (x1 + x2) / 2, y - 12, label, { size: 9.5, weight: on ? 700 : 500, color: on ? T['--red'] : T['--ink-3'], mono: true });
        });
        G.box(ctx, 16, p.h - 56, p.w - 32, 44, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 8 });
        G.label(ctx, 28, p.h - 36, steps[i].t, { align: 'left', size: 12, weight: 700, color: T['--brand'] });
        G.label(ctx, 28, p.h - 20, steps[i].d, { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [['当前步骤', steps[i].t], ['协议', '发送用 SMTP，接收用 POP3 / IMAP']]);
    }
    render();
    return s;
  };

})(window);
