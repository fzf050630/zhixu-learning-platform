/* ============================================================
   net4.js — 第4章 网络层 可视化组件
   ipv4：IPv4 首部与分片计算
   ipFragment：IPv4 分片计算器（逐片数据长度 / 片偏移 / MF）
   subnet：IPv4 地址 / 子网划分 / CIDR 计算
   cidrAggregate：CIDR 路由聚合（逐位合并公共前缀）
   arpFlow：ARP 地址解析流程
   dhcpFlow：DHCP 四步交互（DISCOVER/OFFER/REQUEST/ACK）
   routingDv：距离向量算法迭代
   forwardingTable：最长前缀匹配
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  const ip2int = ip => ip.split('.').reduce((a, o) => (a << 8 >>> 0) + (Number(o) >>> 0), 0) >>> 0;
  const int2ip = n => [24, 16, 8, 0].map(s => (n >>> s) & 255).join('.');
  const bits = n => (n >>> 0).toString(2).padStart(32, '0');

  /* ---------- IPv4 首部与分片 ---------- */
  W.ipv4 = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { len: 1400, mtu: 620, id: 0x1A2B, df: false };
    UI.slider(ctrl, { label: '数据报总长', min: 400, max: 4000, step: 20, value: 1400, fmt: v => v + ' B', onInput: v => { state.len = v; render(); } });
    UI.slider(ctrl, { label: 'MTU', min: 300, max: 1500, step: 20, value: 620, fmt: v => v + ' B', onInput: v => { state.mtu = v; render(); } });
    UI.seg(ctrl, [{ label: '允许分片', value: 'yes' }, { label: 'DF=1 禁止分片', value: 'no' }], (v) => { state.df = v === 'no'; render(); }, 0);

    function frag() {
      const payload = state.len - 20;
      const maxPayload = Math.floor((state.mtu - 20) / 8) * 8;   // 8 字节对齐
      if (maxPayload <= 0) return { ok: false, frags: [] };
      if (state.df && payload > maxPayload) return { ok: false, frags: [], df: true };
      const frags = [];
      let off = 0;
      while (off < payload) {
        const size = Math.min(maxPayload, payload - off);
        frags.push({ off: off / 8, size, mf: off + size < payload ? 1 : 0, total: size + 20 });
        off += size;
      }
      return { ok: true, frags };
    }

    function render() {
      const r = frag();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 首部字段
        const fields = [
          ['版本', 4, T['--brand']], ['首部长度', 4, T['--brand']], ['服务类型', 8, T['--ink-3']], ['总长度', 16, T['--brand']],
          ['标识', 16, T['--purple']], ['标志', 3, T['--accent']], ['片偏移', 13, T['--accent']],
          ['生存时间TTL', 8, T['--teal']], ['协议', 8, T['--teal']], ['首部校验和', 16, T['--ink-3']],
          ['源IP地址', 32, T['--green']], ['目的IP地址', 32, T['--green']],
          ['可选字段+填充', 32, T['--ink-3']], ['数据', 32, T['--brand']]
        ];
        G.bits(ctx, 20, 36, p.w - 40, 24, { groups: fields.slice(0, 4).map(f => ({ name: f[0], bits: f[1], color: f[2] })), nameSize: 9, alpha: 0.14 });
        G.bits(ctx, 20, 68, p.w - 40, 24, { groups: fields.slice(4, 7).map(f => ({ name: f[0], bits: f[1], color: f[2] })), nameSize: 9, alpha: 0.14 });
        G.bits(ctx, 20, 100, p.w - 40, 24, { groups: fields.slice(7, 10).map(f => ({ name: f[0], bits: f[1], color: f[2] })), nameSize: 9, alpha: 0.14 });
        G.bits(ctx, 20, 132, p.w - 40, 24, { groups: fields.slice(10, 12).map(f => ({ name: f[0], bits: f[1], color: f[2] })), nameSize: 9, alpha: 0.14 });
        // 分片结果
        const y0 = 176;
        G.label(ctx, 20, y0, `分片结果（MTU ${state.mtu}，每组数据 8 字节对齐）`, { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        if (!r.ok) {
          G.box(ctx, 16, y0 + 12, p.w - 32, 34, { fill: D.withAlpha(T['--red'], 0.1), stroke: D.withAlpha(T['--red'], 0.5), radius: 7 });
          G.label(ctx, p.w / 2, y0 + 29, r.df ? 'DF=1 且数据报超过 MTU → 无法分片，丢弃并返回 ICMP 差错' : 'MTU 太小', { size: 11, color: T['--red'] });
        } else {
          const n = r.frags.length;
          const bw = Math.min(150, (p.w - 40) / n) - 8;
          r.frags.slice(0, 6).forEach((f, k) => {
            const x = 20 + k * (bw + 8);
            G.box(ctx, x, y0 + 12, bw, 40, { fill: D.withAlpha(T['--purple'], 0.12), stroke: D.withAlpha(T['--purple'], 0.6), radius: 6 });
            G.label(ctx, x + bw / 2, y0 + 26, `片 ${k + 1}`, { size: 10.5, weight: 700, color: T['--purple'] });
            G.label(ctx, x + bw / 2, y0 + 42, `偏移 ${f.off}·MF=${f.mf}·${f.total}B`, { size: 9, color: T['--ink-3'], mono: true });
          });
          if (n > 6) G.label(ctx, 20 + 6 * (bw + 8), y0 + 32, `…共 ${n} 片`, { size: 10, color: T['--ink-3'] });
        }
        G.label(ctx, 20, p.h - 8, '片偏移以 8 字节为单位；同一数据报各分片标识相同，目的主机据此重组', { align: 'left', size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['数据报总长', state.len + ' B'],
        ['最大分片数据', String(Math.floor((state.mtu - 20) / 8) * 8) + ' B'],
        ['分片数', r.ok ? String(r.frags.length) : '不可分片'],
        ['MF', r.ok ? r.frags.map(f => f.mf).join('') : '—']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 子网划分 / CIDR ---------- */
  W.subnet = function (host) {
    const s = UI.shell(host, 290);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { ip: '192.168.10.130', prefix: 26 };
    const ipInp = UI.text(ctrl, { label: 'IP 地址', value: state.ip, width: 150 });
    ipInp.input.addEventListener('input', () => { state.ip = ipInp.input.value; render(); });
    UI.slider(ctrl, { label: '前缀长度', min: 8, max: 30, step: 1, value: 26, fmt: v => '/' + v, onInput: v => { state.prefix = v; render(); } });

    function render() {
      const parts = state.ip.split('.').map(Number);
      const valid = parts.length === 4 && parts.every(x => Number.isInteger(x) && x >= 0 && x <= 255);
      const ipn = valid ? ip2int(state.ip) : 0;
      const p = state.prefix;
      const mask = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;
      const net = (ipn & mask) >>> 0;
      const bcast = (net | (~mask >>> 0)) >>> 0;
      const hosts = Math.max(0, Math.pow(2, 32 - p) - 2);
      scene.clearLayers();
      scene.layer((p2, ctx) => {
        const T = D.Theme.cache;
        // 32 位地址划分
        G.bits(ctx, 20, 34, p2.w - 40, 40, {
          groups: [
            { name: '网络前缀', value: valid ? bits(net).slice(0, p) : '', bits: p, color: T['--brand'] },
            { name: '主机号', value: valid ? bits(net).slice(p) : '', bits: 32 - p, color: T['--teal'] }
          ], valueSize: 10, alpha: 0.16
        });
        const rows = [
          ['掩码', valid ? int2ip(mask) + ' （/' + p + '）' : '—'],
          ['网络地址', valid ? int2ip(net) : '—'],
          ['广播地址', valid ? int2ip(bcast) : '—'],
          ['可用主机范围', valid && hosts > 0 ? int2ip(net + 1) + ' ~ ' + int2ip(bcast - 1) : '—'],
          ['可用主机数', valid ? String(hosts) : '—']
        ];
        rows.forEach((r, k) => {
          const y = 90 + k * 28;
          G.box(ctx, 20, y, p2.w - 40, 22, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
          G.label(ctx, 32, y + 11, r[0], { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
          G.label(ctx, p2.w - 32, y + 11, r[1], { align: 'right', size: 11.5, weight: 700, color: T['--brand'], mono: true });
        });
        G.label(ctx, p2.w / 2, p2.h - 12, '子网数 = 2^(新前缀 − 原前缀)，每个子网主机数由主机位数决定', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['网络地址', valid ? int2ip(net) + '/' + p : '—'],
        ['广播地址', valid ? int2ip(bcast) : '—'],
        ['主机数', valid ? String(hosts) : '—']
      ]);
    }
    render();
    return s;
  };

  /* ---------- ARP 流程 ---------- */
  W.arpFlow = function (host) {
    const s = UI.shell(host, 250);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { t: '查 ARP 缓存', d: '主机 A 想发给同网段主机 B，先查本机 ARP 高速缓存是否有 B 的 MAC' },
      { t: '广播 ARP 请求', d: '缓存无记录 → 广播 ARP 请求：“谁是 192.168.1.2？请告诉 192.168.1.1”' },
      { t: '目标单播应答', d: '只有 B 回应，单播 ARP 响应：“192.168.1.2 的 MAC 是 BB-BB…”' },
      { t: '写入缓存', d: 'A 把 B 的 IP-MAC 映射写入 ARP 缓存，并发送数据帧' },
      { t: '若跨网段', d: '目的 IP 不在本网段 → A 解析的是默认网关的 MAC，由路由器逐跳转发' }
    ];
    let i = 0;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });
    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const y = 56;
        G.box(ctx, 30, y - 3, p.w - 60, 6, { fill: D.withAlpha(T['--teal'], 0.4), stroke: null, radius: 3 });
        G.dot(ctx, 70, y, 8, T['--brand'], true);
        G.dot(ctx, p.w - 70, y, 8, T['--green'], true);
        G.label(ctx, 70, y - 20, 'A · 192.168.1.1 · AA', { size: 10.5, color: T['--brand'], mono: true });
        G.label(ctx, p.w - 70, y - 20, 'B · 192.168.1.2 · BB', { size: 10.5, color: T['--green'], mono: true });
        if (i === 1) G.arrow(ctx, [[80, y - 30], [p.w - 80, y - 30]], { color: T['--red'], width: 2.4, head: 7 });
        if (i >= 1) G.label(ctx, p.w / 2, y - 40, i === 1 ? 'ARP 广播请求' : '', { size: 10, color: T['--red'] });
        if (i >= 2) G.arrow(ctx, [[p.w - 80, y + 24], [80, y + 24]], { color: T['--green'], width: 2.4, head: 7 });
        if (i === 2) G.label(ctx, p.w / 2, y + 34, 'ARP 单播应答', { size: 10, color: T['--green'] });
        G.box(ctx, 16, p.h - 56, p.w - 32, 40, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 8 });
        G.label(ctx, 28, p.h - 36, steps[i].t, { align: 'left', size: 12, weight: 700, color: T['--brand'] });
        G.label(ctx, 28, p.h - 20, steps[i].d, { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [['当前步骤', steps[i].t]]);
    }
    render();
    return s;
  };

  /* ---------- 距离向量算法 ---------- */
  W.routingDv = function (host) {
    const s = UI.shell(host, 280);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    // 拓扑 A-B(1), A-C(3), B-C(1), B-D(4), C-D(2)
    const edges = { 'A-B': 1, 'A-C': 3, 'B-C': 1, 'B-D': 4, 'C-D': 2 };
    const nodes = ['A', 'B', 'C', 'D'];
    const neighbors = { A: ['B', 'C'], B: ['A', 'C', 'D'], C: ['A', 'B', 'D'], D: ['B', 'C'] };
    let iter = 0, table = null, prev = null;
    function init() {
      table = {};
      nodes.forEach(u => { table[u] = {}; nodes.forEach(v => { table[u][v] = u === v ? 0 : (edges[u + '-' + v] !== undefined || edges[v + '-' + u] !== undefined ? cost(u, v) : Infinity); }); });
    }
    function cost(u, v) { return edges[u + '-' + v] !== undefined ? edges[u + '-' + v] : edges[v + '-' + u]; }
    function step() {
      const next = JSON.parse(JSON.stringify(table));
      nodes.forEach(u => { nodes.forEach(v => {
        if (u === v) return;
        let best = table[u][v];
        neighbors[u].forEach(w => { if (table[u][w] + table[w][v] < best) best = table[u][w] + table[w][v]; });
        next[u][v] = best;
      }); });
      prev = table; table = next;
    }
    init();
    UI.transport(ctrl, { total: 5, onChange: k => { iter = k; init(); for (let t = 0; t < k; t++) step(); render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 拓扑
        const pos = { A: [0.15, 0.3], B: [0.5, 0.2], C: [0.5, 0.75], D: [0.85, 0.5] };
        const P = n => [40 + pos[n][0] * (p.w - 90), 40 + pos[n][1] * (p.h - 110)];
        Object.keys(edges).forEach(k => {
          const [u, v] = k.split('-');
          G.arrow(ctx, [P(u), P(v)], { color: D.withAlpha(T['--line-2'], 0.9), width: 1.4 });
          const mx = (P(u)[0] + P(v)[0]) / 2, my = (P(u)[1] + P(v)[1]) / 2;
          G.label(ctx, mx, my, String(edges[k]), { size: 9.5, color: T['--ink-3'], mono: true });
        });
        nodes.forEach(n => {
          const [x, y] = P(n);
          G.dot(ctx, x, y, 12, T['--brand'], true);
          G.label(ctx, x, y, n, { size: 13, weight: 800, color: '#fff' });
        });
        // 距离表
        const tx = 16, ty = p.h - 92;
        G.label(ctx, tx, ty - 4, `第 ${iter} 轮后的距离向量（行=各节点到列的最短距离）`, { align: 'left', size: 10.5, weight: 700, color: T['--ink-2'] });
        const cw = (p.w - 32) / 5;
        G.label(ctx, tx + cw / 2, ty + 12, '节点', { size: 10, weight: 700, color: T['--ink-3'] });
        nodes.forEach((n, k) => G.label(ctx, tx + cw * (k + 1.5), ty + 12, n, { size: 10.5, weight: 700, color: T['--brand'], mono: true }));
        nodes.forEach((u, r) => {
          G.label(ctx, tx + cw / 2, ty + 32 + r * 16, u, { size: 10.5, weight: 700, color: T['--ink-2'], mono: true });
          nodes.forEach((v, c) => {
            const val = table[u][v];
            const changed = prev && prev[u][v] !== table[u][v];
            G.label(ctx, tx + cw * (c + 1.5), ty + 32 + r * 16, val === Infinity ? '∞' : String(val), { size: 10.5, weight: changed ? 800 : 500, color: changed ? T['--green'] : T['--ink'], mono: true });
          });
        });
      });
      scene.render();
      UI.readout(out, [['迭代轮数', String(iter)], ['说明', iter === 0 ? '初始：直连开销，非邻居为 ∞' : '每轮与邻居交换向量并更新：D(u,v)=min{w(u,x)+D(x,v)}']]);
    }
    init(); render();
    return s;
  };

  /* ---------- 32 位二进制位单元条 ---------- */
  function bitCells(ctx, x, y, w, str, marks) {
    const T = D.Theme.cache;
    const cell = w / 32;
    for (let i = 0; i < 32; i++) {
      const cx = x + i * cell;
      let col = T['--ink-3'], fill = T['--card-2'];
      for (const mk of marks) {
        if (i >= mk.from && i < mk.to) { col = mk.col; fill = mk.fill; }
      }
      G.box(ctx, cx, y, cell - 1, 22, { fill, stroke: null, radius: 2 });
      if (cell >= 14) G.label(ctx, cx + cell / 2, y + 11, str[i], { size: 9, weight: 600, color: col, mono: true });
    }
  }

  /* ---------- IPv4 分片计算器 ---------- */
  W.ipFragment = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const st = { len: 1400, mtu: 620 };
    UI.slider(ctrl, { label: '数据报总长', min: 400, max: 4000, step: 20, value: 1400, fmt: v => v + ' B', onInput: v => { st.len = v; render(); } });
    UI.slider(ctrl, { label: 'MTU', min: 300, max: 1500, step: 20, value: 620, fmt: v => v + ' B', onInput: v => { st.mtu = v; render(); } });

    function frags() {
      const payload = st.len - 20;
      const maxPay = Math.floor((st.mtu - 20) / 8) * 8;
      if (maxPay <= 0) return { ok: false, frags: [] };
      const frags = [];
      let off = 0;
      while (off < payload) {
        const size = Math.min(maxPay, payload - off);
        frags.push({ off: off / 8, size, mf: off + size < payload ? 1 : 0, total: size + 20 });
        off += size;
      }
      return { ok: true, frags };
    }

    function render() {
      const r = frags();
      const payload = st.len - 20;
      const maxPay = Math.floor((st.mtu - 20) / 8) * 8;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const bw = p.w - 40;
        G.label(ctx, 20, 18, `数据报总长 ${st.len} B = 首部 20 B + 数据 ${payload} B`, { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
        const hw = Math.max(40, bw * 20 / Math.max(st.len, 1));
        G.box(ctx, 20, 30, hw, 26, { fill: D.withAlpha(T['--brand'], 0.18), stroke: T['--brand'], radius: 5 });
        G.fitted(ctx, 20 + hw / 2, 43, '首部20', hw - 8, { size: 9, weight: 700, color: T['--brand'], mono: true });
        G.box(ctx, 20 + hw, 30, bw - hw, 26, { fill: D.withAlpha(T['--teal'], 0.16), stroke: T['--teal'], radius: 5 });
        G.label(ctx, 20 + hw + (bw - hw) / 2, 43, `数据 ${payload} B`, { size: 10, weight: 700, color: T['--teal'] });
        if (!r.ok) {
          G.box(ctx, 16, 76, p.w - 32, 34, { fill: D.withAlpha(T['--red'], 0.1), stroke: D.withAlpha(T['--red'], 0.5), radius: 7 });
          G.label(ctx, p.w / 2, 93, 'MTU 太小（MTU−20 不足 8 字节），无法分片', { size: 11, weight: 700, color: T['--red'] });
          return;
        }
        G.label(ctx, 20, 74, `MTU ${st.mtu} B：每片数据 ≤ ${maxPay} B 且为 8 的整数倍（最后一片除外）`, { align: 'left', size: 11, color: T['--ink-2'] });
        const n = r.frags.length;
        const shown = r.frags.slice(0, 5);
        shown.forEach((f, k) => {
          const y = 86 + k * 44;
          const hw2 = Math.max(34, bw * 20 / f.total);
          const avail = bw - 66 - 200;
          const dw = Math.max(30, avail * Math.max(f.size / maxPay, 0.12));
          G.box(ctx, 20, y, hw2, 24, { fill: D.withAlpha(T['--brand'], 0.18), stroke: T['--brand'], radius: 5 });
          G.fitted(ctx, 20 + hw2 / 2, y + 12, '首部20', hw2 - 8, { size: 8.5, weight: 700, color: T['--brand'], mono: true });
          G.box(ctx, 20 + hw2, y, dw, 24, { fill: D.withAlpha(T['--purple'], 0.16), stroke: T['--purple'], radius: 5 });
          G.fitted(ctx, 20 + hw2 + dw / 2, y + 12, `数据 ${f.size} B`, dw - 8, { size: 9, weight: 700, color: T['--purple'] });
          const last = k === n - 1;
          const align = f.size % 8 === 0;
          const alignTxt = last ? (align ? '8B 对齐 ✓' : '末片可不齐') : (align ? '8B 对齐 ✓' : '✗');
          const alignCol = align ? T['--green'] : (last ? T['--accent'] : T['--red']);
          G.label(ctx, 20 + hw2 + dw + 10, y + 4, `片 ${k + 1}`, { align: 'left', size: 10.5, weight: 700, color: T['--purple'] });
          G.label(ctx, 20 + hw2 + dw + 10, y + 18, `偏移 ${f.off}×8B　MF=${f.mf}　总长 ${f.total} B`, { align: 'left', size: 9, color: T['--ink-2'], mono: true });
          G.label(ctx, 20 + hw2 + dw + 10, y + 31, alignTxt, { align: 'left', size: 9, weight: 700, color: alignCol, mono: true });
        });
        if (n > 5) G.label(ctx, 20, 86 + 5 * 44, `…共 ${n} 片`, { align: 'left', size: 10.5, weight: 700, color: T['--ink-2'] });
        G.label(ctx, 20, p.h - 8, '片偏移以 8 字节为单位；除最后一片外每片数据长度为 8 的整数倍；同一数据报各分片标识相同，目的主机按偏移重组', { align: 'left', size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['数据报总长', st.len + ' B'],
        ['分片数', r.ok ? String(r.frags.length) : '—'],
        ['每片数据上限', String(Math.max(0, maxPay)) + ' B'],
        ['片偏移(×8B)', r.ok ? r.frags.map(f => f.off).join('，') : '—'],
        ['MF 序列', r.ok ? r.frags.map(f => f.mf).join('') : '—']
      ]);
    }
    render();
    return s;
  };

  /* ---------- CIDR 路由聚合 ---------- */
  W.cidrAggregate = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const st = { a: '192.168.0.0/24', b: '192.168.1.0/24', c: '192.168.2.0/24', k: 0 };
    const ia = UI.text(ctrl, { label: '前缀 1', value: st.a, width: 150 });
    const ib = UI.text(ctrl, { label: '前缀 2', value: st.b, width: 150 });
    const ic = UI.text(ctrl, { label: '前缀 3', value: st.c, width: 150 });
    const trWrap = document.createElement('div');
    ctrl.appendChild(trWrap);
    let tr = null;

    function parseCidr(str) {
      const m = String(str).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
      if (!m) return null;
      const p = m.slice(1, 5).map(Number);
      const n = Number(m[5]);
      if (p.some(x => x > 255) || n < 0 || n > 32) return null;
      return { ip: ip2int(p.join('.')), n };
    }

    function compute() {
      const nets = [st.a, st.b, st.c].map(parseCidr).filter(Boolean);
      if (nets.length < 2) return { ok: false, nets };
      const minN = Math.min(...nets.map(x => x.n));
      const ref = nets[0].ip;
      let L = 0;
      for (let b = 0; b < 32; b++) {
        const mask = (0x80000000 >>> b);
        const v = ref & mask;
        if (!nets.every(x => (x.ip & mask) === v)) break;
        L++;
      }
      L = Math.min(L, minN);
      const agg = L === 0 ? 0 : (ref & (0xFFFFFFFF << (32 - L))) >>> 0;
      const covers = Math.pow(2, 32 - L);
      const sum = nets.reduce((a, x) => a + Math.pow(2, 32 - x.n), 0);
      return { ok: true, nets, L, agg, covers, extra: covers > sum };
    }

    function rebuild() {
      const m = compute();
      if (tr) { try { tr.destroy(); } catch (e) { } }
      trWrap.innerHTML = '';
      tr = null;
      st.k = 0;
      if (m.ok) {
        tr = UI.transport(trWrap, { total: m.L + 1, onChange: k => { st.k = k; render(); } });
      }
      render();
    }
    [ia, ib, ic].forEach(x => x.input.addEventListener('input', rebuild));

    function render() {
      const m = compute();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, 20, 16, '逐位比较各前缀的 32 位二进制，求最长公共前缀（路由聚合）', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
        if (!m.ok) {
          G.box(ctx, 16, 70, p.w - 32, 70, { fill: D.withAlpha(T['--accent'], 0.1), stroke: D.withAlpha(T['--accent'], 0.5), radius: 8 });
          G.label(ctx, p.w / 2, 96, '请输入至少 2 个合法的 CIDR 前缀', { size: 12.5, weight: 700, color: T['--accent'] });
          G.label(ctx, p.w / 2, 118, '格式：a.b.c.d/n，如 192.168.0.0/24', { size: 10.5, color: T['--ink-2'], mono: true });
          return;
        }
        const cx0 = 150, cw = p.w - 170;
        m.nets.forEach((net, k) => {
          const y = 42 + k * 34;
          G.label(ctx, 20, y + 11, int2ip(net.ip) + '/' + net.n, { align: 'left', size: 10.5, weight: 700, color: T['--brand'], mono: true });
          bitCells(ctx, cx0, y, cw, bits(net.ip), [{ from: 0, to: net.n, col: T['--teal'], fill: D.withAlpha(T['--teal'], 0.2) }]);
        });
        const ay = 42 + m.nets.length * 34 + 8;
        const k = Math.min(st.k, m.L);
        G.label(ctx, 20, ay + 11, '聚合', { align: 'left', size: 11, weight: 800, color: T['--green'] });
        bitCells(ctx, cx0, ay, cw, bits(m.agg), [{ from: 0, to: k, col: T['--green'], fill: D.withAlpha(T['--green'], 0.26) }]);
        const my = ay + 42;
        if (k < m.L) {
          G.label(ctx, 20, my, `第 ${k + 1} 位：所有前缀相同 ✓ → 并入公共前缀（点击下一步继续）`, { align: 'left', size: 11, weight: 700, color: T['--accent'] });
        } else {
          G.label(ctx, 20, my, '公共前缀合并完成', { align: 'left', size: 11, weight: 700, color: T['--green'] });
        }
        const ry = my + 24;
        G.box(ctx, 16, ry, p.w - 32, 52, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 8 });
        G.label(ctx, 28, ry + 18, `聚合结果：${int2ip(m.agg)}/${m.L}`, { align: 'left', size: 13, weight: 800, color: T['--green'], mono: true });
        G.label(ctx, p.w - 28, ry + 18, `覆盖地址数 = 2^${32 - m.L} = ${m.covers.toLocaleString()}`, { align: 'right', size: 10.5, color: T['--ink-2'], mono: true });
        G.label(ctx, 28, ry + 38, m.extra ? '提示：聚合覆盖了未列出的网络（如相邻但未输入的网段），实际路由聚合要求被聚合网络地址连续' : '被聚合的网络地址连续，聚合无损', { align: 'left', size: 9.5, color: m.extra ? T['--accent'] : T['--green'] });
        G.label(ctx, 20, p.h - 8, '路由聚合（构成超网）：把多个连续网络合并为更大的前缀；聚合长度不超过最短输入前缀', { align: 'left', size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, m.ok ? [
        ['有效前缀', String(m.nets.length) + ' 个'],
        ['公共前缀', String(m.L) + ' 位'],
        ['聚合结果', int2ip(m.agg) + '/' + m.L],
        ['覆盖地址数', '2^' + (32 - m.L)]
      ] : [['状态', '输入不足'], ['提示', '至少 2 个合法前缀']]);
    }
    rebuild();
    return s;
  };

  /* ---------- DHCP 四步交互 ---------- */
  W.dhcpFlow = function (host) {
    const s = UI.shell(host, 280);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { t: 'DISCOVER', dir: 'C→S', src: '0.0.0.0:68', dst: '255.255.255.255:67', cip: '0.0.0.0', d: '客户端尚无 IP（0.0.0.0），以广播发现报文寻找可用的 DHCP 服务器' },
      { t: 'OFFER', dir: 'S→C', src: '192.168.1.1:67', dst: '255.255.255.255:68', cip: '0.0.0.0', d: '服务器从地址池取出 192.168.1.100，连同掩码、网关、DNS、租期一起提供（广播或单播）' },
      { t: 'REQUEST', dir: 'C→S', src: '0.0.0.0:68', dst: '255.255.255.255:67', cip: '0.0.0.0', d: '客户端广播请求使用该 IP（若存在多个服务器，未被选中的服务器收回提供）' },
      { t: 'ACK', dir: 'S→C', src: '192.168.1.1:67', dst: '192.168.1.100:68', cip: '192.168.1.100', d: '服务器确认并交付租期，客户端正式获得 IP 192.168.1.100' }
    ];
    let i = 0;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });

    function render() {
      const stp = steps[i];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const xC = 90, xS = p.w - 90;
        G.box(ctx, xC - 52, 30, 104, 48, { fill: D.withAlpha(T['--brand'], 0.14), stroke: T['--brand'], radius: 8, title: '客户端', titleColor: T['--brand'], titleSize: 11 });
        G.label(ctx, xC, 62, 'IP：' + stp.cip, { size: 10, color: T['--ink-2'], mono: true });
        G.box(ctx, xS - 62, 30, 124, 48, { fill: D.withAlpha(T['--green'], 0.14), stroke: T['--green'], radius: 8, title: 'DHCP 服务器', titleColor: T['--green'], titleSize: 11 });
        G.label(ctx, xS, 62, '192.168.1.1（端口 67）', { size: 10, color: T['--ink-2'], mono: true });
        const y = 126;
        const toRight = stp.dir === 'C→S';
        const x1 = toRight ? xC : xS, x2 = toRight ? xS : xC;
        G.arrow(ctx, [[x1, y], [x2, y]], { color: T['--red'], width: 2.6, head: 8 });
        G.label(ctx, (x1 + x2) / 2, y - 16, stp.t, { size: 12, weight: 800, color: T['--red'] });
        G.label(ctx, (x1 + x2) / 2, y + 16, `${stp.src}  →  ${stp.dst}`, { size: 9.5, color: T['--ink-2'], mono: true });
        G.box(ctx, 16, p.h - 62, p.w - 32, 44, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.4), radius: 8 });
        G.label(ctx, 28, p.h - 42, `${i + 1}/4　DHCP ${stp.t}`, { align: 'left', size: 11.5, weight: 700, color: T['--brand'] });
        G.label(ctx, 28, p.h - 24, stp.d, { align: 'left', size: 10, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['步骤', steps[i].t],
        ['源地址', steps[i].src],
        ['目的地址', steps[i].dst],
        ['客户端 IP', steps[i].cip]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 最长前缀匹配 ---------- */
  W.forwardingTable = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const rows = [
      { pre: '192.168.0.0', n: 22, hop: 'R1' },
      { pre: '192.168.0.0', n: 24, hop: 'R2' },
      { pre: '192.168.1.0', n: 25, hop: 'R3' },
      { pre: '0.0.0.0', n: 0, hop: 'R4（默认路由）' }
    ];
    const st = { dst: '192.168.1.100' };
    const inp = UI.text(ctrl, { label: '目的 IP', value: st.dst, width: 150 });
    inp.input.addEventListener('input', () => { st.dst = inp.input.value; render(); });

    function match() {
      const parts = st.dst.split('.').map(Number);
      const valid = parts.length === 4 && parts.every(x => Number.isInteger(x) && x >= 0 && x <= 255);
      const dstInt = valid ? ip2int(st.dst) : 0;
      const matches = rows.map(r => {
        const mask = r.n === 0 ? 0 : (0xFFFFFFFF << (32 - r.n)) >>> 0;
        const net = (ip2int(r.pre) & mask) >>> 0;
        const hit = valid && ((dstInt & mask) >>> 0) === net;
        return Object.assign({}, r, { hit });
      });
      const longest = matches.filter(x => x.hit).sort((a, b) => b.n - a.n)[0] || null;
      return { valid, dstInt, matches, longest };
    }

    function render() {
      const m = match();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, 20, 16, '转发表：目的网络/前缀 → 下一跳（按最长前缀匹配转发）', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
        m.matches.forEach((r, k) => {
          const y = 38 + k * 36;
          const isLong = m.longest && m.longest === r;
          G.box(ctx, 16, y, p.w - 32, 30, {
            fill: isLong ? D.withAlpha(T['--brand'], 0.18) : (r.hit ? D.withAlpha(T['--green'], 0.1) : T['--card-2']),
            stroke: isLong ? T['--brand'] : (r.hit ? T['--green'] : T['--line']),
            width: isLong ? 2 : 1, radius: 7
          });
          G.label(ctx, 34, y + 15, r.pre + '/' + r.n, { align: 'left', size: 11.5, weight: 700, color: r.hit ? T['--ink'] : T['--ink-3'], mono: true });
          G.label(ctx, p.w * 0.42, y + 15, '→ 下一跳 ' + r.hop, { align: 'left', size: 10.5, color: T['--ink-2'] });
          if (isLong) {
            G.label(ctx, p.w - 32, y + 10, '★ 最长匹配', { align: 'right', size: 10.5, weight: 800, color: T['--brand'] });
            G.label(ctx, p.w - 32, y + 23, '前缀 ' + r.n + ' 位', { align: 'right', size: 9, color: T['--brand'] });
          } else {
            G.label(ctx, p.w - 32, y + 15, r.hit ? '✓ 匹配' : '—', { align: 'right', size: 10, weight: 700, color: r.hit ? T['--green'] : T['--ink-3'] });
          }
        });
        const by = 38 + rows.length * 36 + 12;
        G.label(ctx, 20, by, m.valid ? `目的地址 ${st.dst} 的 32 位二进制（高亮 = 与最长匹配前缀相同的位）` : '请输入合法 IPv4 地址', { align: 'left', size: 10.5, color: m.valid ? T['--ink-2'] : T['--red'] });
        if (m.valid) {
          const ln = m.longest ? m.longest.n : 0;
          bitCells(ctx, 20, by + 12, p.w - 40, bits(m.dstInt), [{ from: 0, to: ln, col: T['--brand'], fill: D.withAlpha(T['--brand'], 0.22) }]);
          const ry = by + 56;
          G.box(ctx, 16, ry, p.w - 32, 32, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 8 });
          G.label(ctx, 28, ry + 16, `最长前缀匹配：${m.longest.pre}/${m.longest.n} → 下一跳 ${m.longest.hop}`, { align: 'left', size: 12, weight: 800, color: T['--green'], mono: true });
        }
        G.label(ctx, 20, p.h - 8, '0.0.0.0/0 为默认路由，任何目的地址都匹配；多条命中时取前缀最长（最具体）的一条', { align: 'left', size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['目的地址', st.dst],
        ['匹配条数', m.valid ? String(m.matches.filter(x => x.hit).length) : '—'],
        ['最长匹配', m.valid && m.longest ? m.longest.pre + '/' + m.longest.n : '—'],
        ['下一跳', m.valid && m.longest ? m.longest.hop : '—']
      ]);
    }
    render();
    return s;
  };

})(window);
