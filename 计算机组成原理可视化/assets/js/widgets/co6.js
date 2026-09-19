/* ============================================================
   co6.js — 第6章 总线 可视化组件
   busStructure：总线结构    busTiming：同步/异步定时时序图
   busArbitration：总线仲裁（链式查询 / 计数器定时 / 独立请求）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 总线结构 ---------- */
  W.busStructure = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { type: 'single' };

    UI.seg(ctrl, [
      { label: '单总线', value: 'single' },
      { label: '双总线', value: 'double' },
      { label: '三总线', value: 'triple' }
    ], v => { state.type = v; render(); }, 0);

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        const node = (x, y, ww, hh, label, color) => {
          G.box(ctx, x, y, ww, hh, { fill: D.withAlpha(color, 0.14), stroke: D.withAlpha(color, 0.6), radius: 8 });
          G.label(ctx, x + ww / 2, y + hh / 2, label, { size: 11.5, weight: 700, color });
        };
        const bus = (x, y, ww, label, color) => {
          G.box(ctx, x, y - 9, ww, 18, { fill: D.withAlpha(color, 0.16), stroke: D.withAlpha(color, 0.7), radius: 5 });
          G.label(ctx, x + ww / 2, y, label, { size: 10.5, weight: 700, color });
        };

        if (state.type === 'single') {
          node(40, 20, 90, 44, 'CPU', T['--brand']);
          node(w - 130, 20, 90, 44, '主存', T['--accent']);
          node(40, p.h - 64, 90, 44, 'I/O 接口', T['--purple']);
          node(w - 130, p.h - 64, 90, 44, '外设', T['--green']);
          bus(30, p.h / 2, w - 60, '系统总线', T['--teal']);
          [ [85, 64], [w - 85, 64], [85, p.h - 64], [w - 85, p.h - 64] ].forEach(pt => {
            G.arrow(ctx, [[pt[0], pt[1]], [pt[0], p.h / 2 - 9]], { color: D.withAlpha(T['--teal'], 0.7), width: 1.2 });
          });
        } else if (state.type === 'double') {
          node(40, 20, 90, 44, 'CPU', T['--brand']);
          node(w - 130, 20, 90, 44, '主存', T['--accent']);
          node(40, p.h - 64, 120, 44, 'I/O 接口', T['--purple']);
          node(w - 150, p.h - 64, 110, 44, '外设', T['--green']);
          bus(30, 96, w - 60, '存储总线', T['--brand']);
          bus(30, p.h - 120, w - 60, 'I/O 总线', T['--purple']);
          G.arrow(ctx, [[85, 64], [85, 87]], { color: T['--brand'], width: 1.2 });
          G.arrow(ctx, [[w - 85, 64], [w - 85, 87]], { color: T['--brand'], width: 1.2 });
          G.arrow(ctx, [[100, p.h - 64], [100, p.h - 111]], { color: T['--purple'], width: 1.2 });
          G.arrow(ctx, [[w - 95, p.h - 64], [w - 95, p.h - 111]], { color: T['--purple'], width: 1.2 });
          G.label(ctx, w / 2, 150, '存储总线专供高速的 CPU↔主存；I/O 总线连接慢速设备', { size: 11, color: T['--ink-3'] });
        } else {
          node(40, 20, 90, 44, 'CPU', T['--brand']);
          node(w - 130, 20, 90, 44, '主存', T['--accent']);
          node(40, p.h - 64, 120, 44, 'I/O 接口', T['--purple']);
          node(w - 150, p.h - 64, 110, 44, '外设', T['--green']);
          bus(30, 88, w - 60, '存储总线', T['--brand']);
          bus(30, 168, w - 60, 'I/O 总线', T['--purple']);
          bus(w / 2 - 70, 128, 140, 'DMA 总线', T['--teal']);
          G.arrow(ctx, [[85, 64], [85, 79]], { color: T['--brand'], width: 1.2 });
          G.arrow(ctx, [[100, p.h - 64], [100, 177]], { color: T['--purple'], width: 1.2 });
          G.arrow(ctx, [[w / 2, 97], [w / 2, 119]], { color: T['--teal'], width: 1.2 });
          G.label(ctx, w / 2, p.h - 14, 'DMA 总线让外设与主存直接交换数据，减轻 CPU 负担', { size: 11, color: T['--ink-3'] });
        }
      });
      scene.render();
      const names = { single: '单总线结构', double: '双总线结构', triple: '三总线结构' };
      const descs = {
        single: '所有部件挂在同一条总线上，结构简单、成本低，但总线争用严重、速度受限。',
        double: 'CPU 与主存间用高速存储总线，I/O 设备用 I/O 总线，互不干扰。',
        triple: '在双总线基础上增设 DMA 总线，支持主存与高速外设直接成块传送。'
      };
      UI.readout(out, [['结构', names[state.type]], ['特点', descs[state.type]]]);
    }
    render();
    return s;
  };

  /* ---------- 总线定时 ---------- */
  W.busTiming = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'sync' };

    UI.seg(ctrl, [{ label: '同步定时', value: 'sync' }, { label: '异步定时（不互锁）', value: 'async' }], v => { state.mode = v; render(); }, 0);

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const left = 96, top = 30;
        const lanes = state.mode === 'sync'
          ? ['时钟 T', '地址/数据', '读命令', '从设备响应']
          : ['主设备请求(REQ)', '从设备应答(ACK)', '数据有效'];
        const laneH = (p.h - top - 20) / lanes.length;
        lanes.forEach((l, i) => {
          G.label(ctx, left - 10, top + i * laneH + laneH / 2, l, { align: 'right', size: 10.5, weight: 600, color: T['--ink-2'] });
        });
        const drawLane = (i, segs) => {
          const y0 = top + i * laneH + laneH / 2;
          ctx.save(); ctx.strokeStyle = T['--line']; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(p.w - 12, y0); ctx.stroke(); ctx.restore();
          segs.forEach(sg => {
            const x1 = left + sg.a * (p.w - left - 12), x2 = left + sg.b * (p.w - left - 12);
            const hi = sg.hi;
            const yy = y0 - laneH / 3;
            ctx.save();
            ctx.strokeStyle = sg.c || T['--brand']; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, hi ? y0 : yy);
            ctx.lineTo(x1, hi ? yy : y0);
            ctx.lineTo(x2, hi ? yy : y0);
            ctx.lineTo(x2, y0);
            ctx.stroke();
            ctx.restore();
            if (sg.label) G.label(ctx, (x1 + x2) / 2, y0 - laneH / 3 - 4, sg.label, { size: 9.5, color: sg.c || T['--brand'] });
          });
        };

        if (state.mode === 'sync') {
          // 时钟
          const beats = [0, .12, .24, .36, .48, .6, .72, .84, .96];
          const segs = [];
          for (let i = 0; i < beats.length - 1; i += 2) { segs.push({ a: beats[i], b: beats[i + 1], hi: true, c: T['--brand'] }); segs.push({ a: beats[i + 1], b: beats[i + 2], hi: false, c: T['--brand'] }); }
          drawLane(0, segs);
          drawLane(1, [{ a: .12, b: .6, hi: true, c: T['--teal'], label: '地址 / 数据' }]);
          drawLane(2, [{ a: .18, b: .54, hi: true, c: T['--accent'], label: '读命令' }]);
          drawLane(3, [{ a: .3, b: .6, hi: true, c: T['--green'], label: '数据就绪' }]);
          G.label(ctx, p.w / 2, p.h - 6, '所有信号都在固定时钟节拍下动作，定时简单但需按最慢设备设计', { size: 11, color: T['--ink-3'] });
        } else {
          drawLane(0, [{ a: .06, b: .9, hi: true, c: T['--brand'], label: 'REQ' }]);
          drawLane(1, [{ a: .3, b: .9, hi: true, c: T['--purple'], label: 'ACK' }]);
          drawLane(2, [{ a: .36, b: .78, hi: true, c: T['--green'], label: '数据' }]);
          G.label(ctx, p.w / 2, p.h - 6, '请求/应答回答式：前一个信号到达才启动下一个，按设备实际速度工作', { size: 11, color: T['--ink-3'] });
        }
      });
      scene.render();
      UI.readout(out, [
        ['定时方式', state.mode === 'sync' ? '同步定时' : '异步定时'],
        ['特点', state.mode === 'sync' ? '统一时钟，速度快、设计简单；受最慢设备限制' : '应答式，适应不同速度设备；控制复杂、速度慢']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 总线仲裁 ---------- */
  W.busArbitration = function (host) {
    const s = UI.shell(host, 380);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'chain', k: 0 };

    const STEPS = {
      chain: [
        { desc: '总线空闲：各设备都不请求，BR = 0、BG = 0、BS = 0' },
        { br: [2], desc: '设备 2 需要占用总线，拉低 BR（总线请求，所有设备共用一根线）' },
        { br: [2], sendBg: true, desc: '中央仲裁器收到 BR，立即发出 BG（总线允许，串行穿过各设备）' },
        { br: [2], pass: [0], desc: 'BG 先到达设备 0：它没有请求，于是把 BG 继续向下传递' },
        { br: [2], pass: [0, 1], desc: 'BG 传到设备 1：同样未请求，继续传递' },
        { br: [2], pass: [0, 1], bs: 2, desc: 'BG 到达设备 2：它正在请求且收到允许 → 置 BS = 1，占用总线传送数据' },
        { desc: '传送结束释放总线：BS = 0、BR = 0、BG 撤销；下次仍从设备 0 开始查询，优先级固定' }
      ],
      counter: [
        { desc: '总线空闲：BR = 0、BS = 0，计数器停在某个值' },
        { br: [1, 2], desc: '设备 1 与设备 2 同时请求总线，BR 有效' },
        { br: [1, 2], cnt: 0, desc: '仲裁器启动计数器，把计数值 0 经设备地址线广播：设备 0 未请求 → 计数值加 1' },
        { br: [1, 2], cnt: 1, sel: 1, bs: 1, desc: '地址 1 与设备 1 匹配且它在请求 → 设备 1 获得总线（BS = 1）' },
        { br: [1, 2], cnt: 1, sel: 1, bs: 1, desc: '设备 1 传送数据期间，设备 2 的请求继续等待——优先级由计数值达到的先后决定' },
        { br: [2], desc: '传送结束 BS = 0；计数器可清零（固定优先级）或从上次位置继续（循环优先级，公平）' }
      ],
      indep: [
        { desc: '总线空闲：各设备的 BRᵢ = 0、BGᵢ = 0' },
        { br: [0, 2], desc: '设备 0 与设备 2 同时发出各自的请求线 BR0、BR2（每台设备一对独立线）' },
        { br: [0, 2], arb: true, desc: '仲裁器内部的排队器判优（本例设备 0 > 设备 1 > 设备 2），决定先响应谁' },
        { br: [0, 2], grant: 0, bs: 0, desc: '发出 BG0：设备 0 获得总线使用权，设备 2 的请求继续排队' },
        { br: [2], grant: 0, bs: 0, desc: '设备 0 占用总线传送；请求线与允许线各自独立，响应最快' },
        { br: [2], grant: 2, bs: 2, desc: '设备 0 释放后，仲裁器立即发出 BG2 响应设备 2，无需逐个查询' }
      ]
    };
    const DESC = {
      chain: ['优点：只需 BR、BG、BS 三根线，结构简单、成本低，扩充容易。', '缺点：BG 串行传递，离仲裁器越近优先级越高（固定）；某一设备故障会阻断后续设备的 BG，可靠性差。'],
      counter: ['优点：线数比独立请求少，优先级可通过计数起点改变（固定 / 循环）。', '缺点：计数器与地址译码增加了仲裁时间；设备多时计数值位数增加。'],
      indep: ['优点：响应速度最快，优先级灵活（可由程序设定），各设备相互独立、可靠性高。', '缺点：每台设备都需要一对 BRᵢ / BGᵢ 线，设备多时控制线数量大，成本高。']
    };
    UI.seg(ctrl, [
      { label: '链式查询', value: 'chain' },
      { label: '计数器定时查询', value: 'counter' },
      { label: '独立请求', value: 'indep' }
    ], v => { state.mode = v; state.k = 0; buildTransport(); render(); }, 0);

    function merged() {
      const list = STEPS[state.mode];
      const acc = { br: [], pass: [], bs: null, cnt: null, sel: null, grant: null, arb: false, sendBg: false };
      const arr = [];
      for (let i = 0; i <= state.k; i++) {
        const st = list[i];
        if (st.br) acc.br = st.br.slice();
        if (st.pass) acc.pass = st.pass.slice();
        if ('bs' in st) acc.bs = st.bs;
        if ('cnt' in st) acc.cnt = st.cnt;
        if ('sel' in st) acc.sel = st.sel;
        if ('grant' in st) acc.grant = st.grant;
        if (st.arb) acc.arb = true;
        if (st.sendBg) acc.sendBg = true;
        arr.push(Object.assign({}, acc, { desc: st.desc }));
      }
      return arr;
    }
    let chainSteps = merged();
    function buildTransport() {
      const old = ctrl.querySelector('.transport-viz');
      if (old) old.remove();
      state.k = 0;
      chainSteps = merged();
      UI.transport(ctrl, { total: STEPS[state.mode].length, onChange: i => { state.k = i; chainSteps = merged(); render(); } });
    }
    buildTransport();

    function render() {
      const list = STEPS[state.mode];
      const cur = chainSteps[Math.min(state.k, list.length - 1)];
      const mode = state.mode;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const arbX = 16, arbW = 118, arbH = 208, arbY = 34;
        const devX = p.w - 206, devW = 190, devH = 56, dy0 = 34, dGap = 76;
        // 仲裁器
        G.box(ctx, arbX, arbY, arbW, arbH, { fill: D.withAlpha(T['--purple'], 0.1), stroke: D.withAlpha(T['--purple'], 0.55), radius: 10 });
        G.label(ctx, arbX + arbW / 2, arbY + 18, '中央仲裁器', { size: 12, weight: 700, color: T['--purple'] });
        if (mode === 'chain') {
          G.lines(ctx, arbX + arbW / 2, arbY + 46, ['BR / BG / BS', '三根控制线'], { size: 10, lineHeight: 16, color: T['--ink-3'] });
        } else if (mode === 'counter') {
          G.lines(ctx, arbX + arbW / 2, arbY + 42, ['BR / BS', '计数器 + 地址译码'], { size: 10, lineHeight: 16, color: T['--ink-3'] });
          G.box(ctx, arbX + 12, arbY + 84, arbW - 24, 40, { fill: T['--card'], stroke: T['--line-2'], radius: 6 });
          G.label(ctx, arbX + arbW / 2, arbY + 96, '计数值', { size: 10, color: T['--ink-3'] });
          G.label(ctx, arbX + arbW / 2, arbY + 113, cur.cnt === null ? '—' : String(cur.cnt), { size: 14, weight: 800, color: cur.cnt === null ? T['--ink-3'] : T['--brand'], mono: true });
        } else {
          G.lines(ctx, arbX + arbW / 2, arbY + 42, ['排队器 +', '优先编码器'], { size: 10, lineHeight: 16, color: T['--ink-3'] });
          G.label(ctx, arbX + arbW / 2, arbY + 92, cur.arb ? '正在判优' : '待命', { size: 11, weight: 700, color: cur.arb ? T['--red'] : T['--ink-3'] });
        }
        G.label(ctx, arbX + arbW / 2, arbY + arbH - 18, '（总线控制器）', { size: 9.5, color: T['--ink-3'] });

        // 设备
        const devs = [0, 1, 2].map(i => ({ i, y: dy0 + i * dGap }));
        devs.forEach(d => {
          const requesting = cur.br.includes(d.i);
          const using = cur.bs === d.i;
          G.box(ctx, devX, d.y, devW, devH, {
            fill: using ? D.withAlpha(T['--green'], 0.2) : (requesting ? D.withAlpha(T['--red'], 0.12) : T['--card']),
            stroke: using ? T['--green'] : (requesting ? T['--red'] : T['--line-2']), width: using || requesting ? 1.8 : 1.2, radius: 9
          });
          G.label(ctx, devX + devW / 2, d.y + 18, `主设备 ${d.i}`, { size: 12, weight: 700, color: using ? T['--green'] : T['--ink'] });
          G.label(ctx, devX + devW / 2, d.y + 38, mode === 'chain' ? `优先级：第 ${d.i + 1}（离仲裁器越近越高）` : (mode === 'counter' ? `设备地址 = ${d.i}` : `优先级 ${d.i + 1}（可由程序设定）`), { size: 9.5, color: T['--ink-3'] });
          if (using) G.label(ctx, devX + devW / 2, d.y + 50, '占用总线（BS = 1）', { size: 9.5, weight: 700, color: T['--green'] });
        });

        // 线路
        const trunkX = [150, 172, 194][1];
        const topY = dy0 + 14, botY = dy0 + 2 * dGap + 14;
        const lineY = (d, off) => d.y + off;
        if (mode === 'chain') {
          // BR 干线
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--red'], 0.7); ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(trunkX, topY); ctx.lineTo(trunkX, botY); ctx.stroke();
          ctx.restore();
          G.label(ctx, trunkX, topY - 12, 'BR', { size: 10, weight: 700, color: T['--red'], mono: true });
          G.arrow(ctx, [[trunkX, lineY(devs[1], 14)], [arbX + arbW, lineY(devs[1], 14)]], { color: D.withAlpha(T['--red'], 0.85), width: 1.4, head: 5 });
          devs.forEach(d => G.arrow(ctx, [[devX, lineY(d, 14)], [trunkX, lineY(d, 14)]], { color: cur.br.includes(d.i) ? T['--red'] : D.withAlpha(T['--line-2'], 0.9), width: cur.br.includes(d.i) ? 1.8 : 1, head: 4 }));
          // BS 干线
          const bsX = trunkX + 30;
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--accent'], 0.7); ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(bsX, topY + 28); ctx.lineTo(bsX, botY + 28); ctx.stroke();
          ctx.restore();
          G.label(ctx, bsX, topY + 16, 'BS', { size: 10, weight: 700, color: T['--accent'], mono: true });
          G.arrow(ctx, [[bsX, lineY(devs[1], 42)], [arbX + arbW, lineY(devs[1], 42)]], { color: D.withAlpha(T['--accent'], 0.85), width: 1.4, head: 5 });
          devs.forEach(d => {
            const on = cur.bs === d.i;
            G.arrow(ctx, [[devX, lineY(d, 42)], [bsX, lineY(d, 42)]], { color: on ? T['--accent'] : D.withAlpha(T['--line-2'], 0.9), width: on ? 1.8 : 1, head: 4 });
          });
          // BG 串行链
          const bgX = trunkX + 16;
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--green'], 0.8); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(bgX, lineY(devs[0], 28)); ctx.lineTo(bgX, lineY(devs[2], 28)); ctx.stroke();
          ctx.restore();
          G.arrow(ctx, [[arbX + arbW, lineY(devs[0], 28)], [bgX, lineY(devs[0], 28)]], { color: T['--green'], width: 1.6, head: 5 });
          G.label(ctx, bgX + 26, lineY(devs[0], 28) - 10, 'BG', { size: 10, weight: 700, color: T['--green'], mono: true });
          devs.forEach(d => {
            const skip = (cur.pass || []).includes(d.i);
            const taken = cur.bs === d.i;
            G.arrow(ctx, [[bgX, lineY(d, 28)], [devX, lineY(d, 28)]], {
              color: taken ? T['--green'] : (skip ? D.withAlpha(T['--green'], 0.55) : D.withAlpha(T['--line-2'], 0.9)),
              width: taken ? 2 : 1.2, dash: skip ? [4, 3] : null, head: taken ? 6 : 4
            });
            if (skip) G.label(ctx, (bgX + devX) / 2, lineY(d, 28) - 8, '传递', { size: 9, color: T['--green'] });
          });
        } else if (mode === 'counter') {
          const busX = trunkX;
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--brand'], 0.75); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(busX, topY + 6); ctx.lineTo(busX, botY + 6); ctx.stroke();
          ctx.restore();
          G.label(ctx, busX, topY - 8, '设备地址线', { size: 10, weight: 700, color: T['--brand'] });
          devs.forEach(d => {
            const on = cur.sel === d.i;
            G.arrow(ctx, [[busX, lineY(d, 20)], [devX, lineY(d, 20)]], { color: on ? T['--brand'] : D.withAlpha(T['--line-2'], 0.9), width: on ? 2 : 1.2, head: on ? 6 : 4 });
            if (on) G.label(ctx, (busX + devX) / 2, lineY(d, 20) - 8, '地址匹配 → 获得总线', { size: 9, weight: 700, color: T['--brand'] });
          });
          // BR / BS 共用线
          const brX = busX + 26, bsX = busX + 46;
          ctx.save();
          ctx.strokeStyle = D.withAlpha(T['--red'], 0.7); ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.moveTo(brX, topY - 6); ctx.lineTo(brX, botY - 6); ctx.stroke();
          ctx.restore();
          G.label(ctx, brX, topY - 18, 'BR', { size: 10, weight: 700, color: T['--red'], mono: true });
          G.arrow(ctx, [[brX, lineY(devs[1], 40)], [arbX + arbW, lineY(devs[1], 40)]], { color: D.withAlpha(T['--red'], 0.85), width: 1.4, head: 5 });
          devs.forEach(d => G.arrow(ctx, [[devX, lineY(d, 40)], [brX, lineY(d, 40)]], { color: cur.br.includes(d.i) ? T['--red'] : D.withAlpha(T['--line-2'], 0.9), width: cur.br.includes(d.i) ? 1.8 : 1, head: 4 }));
          devs.forEach(d => {
            const on = cur.bs === d.i;
            if (!on) return;
            G.arrow(ctx, [[devX, lineY(d, 48)], [bsX, lineY(d, 48)]], { color: T['--accent'], width: 1.8, head: 5 });
            G.label(ctx, bsX + 4, lineY(d, 48) - 8, 'BS = 1', { size: 9, weight: 700, color: T['--accent'] });
          });
        } else {
          devs.forEach(d => {
            const req = cur.br.includes(d.i);
            const gr = cur.grant === d.i;
            const by = lineY(d, 20), gy = lineY(d, 38);
            G.arrow(ctx, [[devX, by], [arbX + arbW, by]], { color: req ? T['--red'] : D.withAlpha(T['--line-2'], 0.9), width: req ? 2 : 1, head: req ? 5 : 4 });
            G.label(ctx, devX - 8, by - 8, 'BR' + d.i, { align: 'right', size: 9, weight: 700, color: req ? T['--red'] : T['--ink-3'], mono: true });
            G.arrow(ctx, [[arbX + arbW, gy], [devX, gy]], { color: gr ? T['--green'] : D.withAlpha(T['--line-2'], 0.9), width: gr ? 2 : 1, head: gr ? 5 : 4 });
            G.label(ctx, devX - 8, gy - 8, 'BG' + d.i, { align: 'right', size: 9, weight: 700, color: gr ? T['--green'] : T['--ink-3'], mono: true });
          });
        }

        // 步骤说明
        const sy = 274;
        G.box(ctx, 16, sy, p.w - 32, 44, { fill: D.withAlpha(T['--brand'], 0.1), stroke: D.withAlpha(T['--brand'], 0.5), radius: 8 });
        G.label(ctx, 28, sy + 15, `第 ${state.k + 1} 步 / 共 ${list.length} 步`, { align: 'left', size: 10.5, weight: 700, color: T['--ink-3'] });
        G.fitted(ctx, 28, sy + 33, cur.desc, p.w - 56, { align: 'left', size: 11, weight: 600, color: T['--ink'] });
        G.box(ctx, 16, sy + 52, p.w - 32, 46, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.lines(ctx, 28, sy + 68, DESC[mode], { align: 'left', size: 10, lineHeight: 18, color: T['--ink-2'] });
      });
      scene.render();
      const names = { chain: '链式查询', counter: '计数器定时查询', indep: '独立请求' };
      UI.readout(out, [
        ['仲裁方式', names[mode]],
        ['当前步骤', cur.desc],
        ['控制线数量', mode === 'chain' ? '3 根（BR、BG、BS 共用）' : (mode === 'counter' ? 'log₂n 根设备地址线 + BR + BS' : '2n 根（每设备 BRᵢ、BGᵢ）')],
        ['优先级', mode === 'chain' ? '固定：离仲裁器越近越高' : (mode === 'counter' ? '可由计数起点决定（固定 / 循环）' : '灵活：由排队器或程序设定')]
      ]);
    }
    render();
    return s;
  };

})(window);
