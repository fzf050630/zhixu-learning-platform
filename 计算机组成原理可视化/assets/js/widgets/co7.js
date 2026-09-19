/* ============================================================
   co7.js — 第7章 输入/输出系统 可视化组件
   ioInterface：I/O 接口结构      ioQuery：程序查询流程
   interruptFlow：中断处理流程     dmaFlow：DMA 传送流程
   ioCompare：三种 I/O 方式对比
   ioPortAddressing：统一编址 / 独立编址与指令对照
   ioPolling：程序查询方式的轮询过程与 CPU 开销占比
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- I/O 接口结构 ---------- */
  W.ioInterface = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    UI.seg(ctrl, [{ label: '统一编址', value: 'mem' }, { label: '独立编址', value: 'io' }], v => { state.mode = v; render(); }, 0);
    const state = { mode: 'mem' };

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        // 主机侧
        G.box(ctx, 16, 30, 130, p.h - 60, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.5), radius: 10 });
        G.label(ctx, 81, 50, '主机', { size: 12.5, weight: 700, color: T['--brand'] });
        G.label(ctx, 81, 72, 'CPU', { size: 11, color: T['--ink-2'], mono: true });
        G.label(ctx, 81, 92, '数据总线 / 地址总线 / 控制总线', { size: 9.5, color: T['--ink-3'] });
        // 接口
        const ix = 190, iw = w - ix - 150;
        G.box(ctx, ix, 30, iw, p.h - 60, { fill: T['--card'], stroke: T['--line-2'], width: 1.4, radius: 10 });
        G.label(ctx, ix + iw / 2, 50, 'I/O 接口', { size: 12.5, weight: 700, color: T['--ink'] });
        const regs = [['数据缓冲寄存器', T['--brand']], ['状态寄存器', T['--accent']], ['控制寄存器', T['--purple']]];
        regs.forEach((r, i) => {
          G.box(ctx, ix + 12, 66 + i * 38, iw - 24, 30, { fill: D.withAlpha(r[1], 0.14), stroke: D.withAlpha(r[1], 0.55), radius: 6 });
          G.label(ctx, ix + iw / 2, 81 + i * 38, r[0], { size: 11, weight: 600, color: r[1] });
        });
        // 设备侧
        G.box(ctx, w - 122, 60, 106, 80, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 10 });
        G.label(ctx, w - 69, 100, '外部设备', { size: 11.5, weight: 700, color: T['--green'] });
        G.arrow(ctx, [[146, p.h / 2], [ix, p.h / 2]], { color: T['--brand'], width: 2 });
        G.arrow(ctx, [[ix + iw, 100], [w - 122, 100]], { color: T['--green'], width: 2 });
        // 端口编址
        G.box(ctx, 16, p.h - 62, w - 32, 46, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 28, p.h - 48, '端口编址', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        G.label(ctx, 28, p.h - 32, state.mode === 'mem'
          ? '统一编址：I/O 端口与主存共用地址空间，用普通访存指令访问，无需专用 I/O 指令，但占用主存地址。'
          : '独立编址：I/O 端口有独立地址空间，需专用 IN/OUT 指令，不占主存地址，但指令集更复杂。',
          { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['接口组成', '数据/状态/控制寄存器 + 地址译码 + 控制逻辑'],
        ['数据缓冲', '主机与设备速度不匹配，起缓冲与锁存作用'],
        ['端口编址', state.mode === 'mem' ? '统一编址（内存映射 I/O）' : '独立编址']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 程序查询流程 ---------- */
  W.ioQuery = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = ['CPU 发启动命令给设备', '读状态寄存器', '设备就绪？否 → 循环等待（CPU 空转）', '就绪 → 读数据寄存器', '传送完成，继续下一条'];
    let i = 0;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });
    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const rh = 34;
        steps.forEach((t, k) => {
          const y = 16 + k * rh;
          const on = k === i;
          const color = k === 2 ? T['--red'] : T['--brand'];
          G.box(ctx, 16, y, p.w - 32, rh - 8, {
            fill: on ? D.withAlpha(color, 0.16) : T['--card-2'],
            stroke: on ? color : T['--line'], width: on ? 1.6 : 1, radius: 7
          });
          G.label(ctx, 30, y + (rh - 8) / 2, t, { align: 'left', size: 11.5, weight: on ? 700 : 500, color: on ? T['--ink'] : T['--ink-2'] });
          if (k === 2) G.label(ctx, p.w - 28, y + (rh - 8) / 2, '⟲ 循环', { align: 'right', size: 10, color: T['--red'], mono: true });
        });
        G.label(ctx, p.w / 2, p.h - 10, '程序查询方式：CPU 全程参与，效率低，接口简单，适合简单外设', { size: 11, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['当前步骤', steps[i]]]);
    }
    render();
    return s;
  };

  /* ---------- 中断处理流程 ---------- */
  W.interruptFlow = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { t: '中断请求', d: '外设通过中断请求线 INTR 向 CPU 发中断' },
      { t: '中断响应', d: 'CPU 执行完当前指令后，检测到请求，关中断、保存断点（PC、PSW）' },
      { t: '中断判优', d: '识别中断源与优先级，取得中断服务程序入口地址' },
      { t: '保护现场', d: '保存通用寄存器等现场信息（可硬件隐式或软件显式）' },
      { t: '中断服务', d: '执行设备服务程序，完成数据传送' },
      { t: '恢复现场', d: '恢复寄存器，打开中断' },
      { t: '中断返回', d: '执行 IRET，恢复 PC/PSW，返回被中断的程序' }
    ];
    let i = 0;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });
    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cx = p.w / 2;
        const hh = (p.h - 24) / steps.length - 6;
        steps.forEach((st, k) => {
          const y = 12 + k * (hh + 6);
          const on = k === i;
          const done = k < i;
          const color = k <= 1 ? T['--accent'] : (k <= 3 ? T['--brand'] : T['--green']);
          G.box(ctx, 90, y, p.w - 180, hh, {
            fill: on ? D.withAlpha(color, 0.18) : (done ? D.withAlpha(color, 0.08) : T['--card-2']),
            stroke: on ? color : D.withAlpha(color, done ? 0.4 : 0.25), width: on ? 1.8 : 1, radius: 8
          });
          G.label(ctx, p.w / 2 - 60, y + hh / 2, st.t, { size: 11.5, weight: 700, color: on ? color : T['--ink-2'] });
          G.fitted(ctx, p.w / 2 - 10, y + hh / 2, st.d, p.w / 2 - 26, { size: 10.5, weight: 500, align: 'left', color: T['--ink-3'] });
          if (k < steps.length - 1) G.arrow(ctx, [[cx - 70, y + hh], [cx - 70, y + hh + 6]], { color: D.withAlpha(color, 0.6), width: 1.4, head: 5 });
        });
      });
      scene.render();
      UI.readout(out, [['当前阶段', steps[i].t], ['说明', steps[i].d]]);
    }
    render();
    return s;
  };

  /* ---------- DMA 传送流程 ---------- */
  W.dmaFlow = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { t: 'CPU 预处理', d: 'CPU 设置 DMA 控制器的源/目的地址与传送长度，启动 DMA' },
      { t: 'DMA 请求', d: '外设准备好一个数据，向 DMA 控制器发 DMA 请求' },
      { t: '总线请求', d: 'DMA 控制器向 CPU 发总线请求 HRQ，申请总线使用权' },
      { t: '总线响应', d: 'CPU 在当前总线周期结束后让出总线，回送 HLDA' },
      { t: '直接传送', d: 'DMA 控制器控制总线，在主存与外设间直接传送数据（CPU 不介入）' },
      { t: '修改地址/计数', d: '自动修改地址并递减计数器，判断是否传完' },
      { t: '结束处理', d: '传送完毕，DMA 控制器发中断通知 CPU 做后处理' }
    ];
    let i = 0;
    UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });
    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        // 三方图
        G.box(ctx, 16, 14, 96, 40, { fill: D.withAlpha(T['--brand'], 0.14), stroke: D.withAlpha(T['--brand'], 0.6), radius: 8, title: 'CPU', titleColor: T['--brand'] });
        G.box(ctx, w - 112, 14, 96, 40, { fill: D.withAlpha(T['--accent'], 0.14), stroke: D.withAlpha(T['--accent'], 0.6), radius: 8, title: '主存', titleColor: T['--accent'] });
        G.box(ctx, w / 2 - 60, 14, 120, 40, { fill: D.withAlpha(T['--purple'], 0.14), stroke: D.withAlpha(T['--purple'], 0.6), radius: 8, title: 'DMA 控制器', titleColor: T['--purple'] });
        G.box(ctx, w / 2 - 50, 96, 100, 36, { fill: D.withAlpha(T['--green'], 0.14), stroke: D.withAlpha(T['--green'], 0.6), radius: 8, title: '外设', titleColor: T['--green'] });

        const link = (on, color) => ({ on, color });
        // CPU - DMA 总线请求
        G.arrow(ctx, [[112, 34], [w / 2 - 60, 34]], { color: i >= 2 && i <= 3 ? T['--red'] : D.withAlpha(T['--line-2'], 0.9), width: i >= 2 && i <= 3 ? 2.2 : 1.2 });
        G.label(ctx, (112 + w / 2 - 60) / 2, 24, 'HRQ / HLDA', { size: 9.5, color: T['--red'] });
        // DMA - 主存
        G.arrow(ctx, [[w / 2 + 60, 34], [w - 112, 34]], { color: i >= 4 ? T['--green'] : D.withAlpha(T['--line-2'], 0.9), width: i >= 4 ? 2.2 : 1.2 });
        G.label(ctx, (w / 2 + 60 + w - 112) / 2, 24, '数据总线', { size: 9.5, color: T['--green'] });
        // 外设 - DMA
        G.arrow(ctx, [[w / 2, 96], [w / 2, 54]], { color: i >= 1 ? T['--brand'] : D.withAlpha(T['--line-2'], 0.9), width: i >= 1 ? 2.2 : 1.2 });
        G.label(ctx, w / 2 + 46, 76, 'DREQ / DACK', { align: 'left', size: 9.5, color: T['--brand'] });

        const y = 150;
        const st = steps[i];
        G.box(ctx, 16, y, w - 32, 40, { fill: D.withAlpha(T['--purple'], 0.1), stroke: D.withAlpha(T['--purple'], 0.5), radius: 9 });
        G.label(ctx, 30, y + 20, `${i + 1}. ${st.t}`, { align: 'left', size: 12, weight: 700, color: T['--purple'] });
        G.label(ctx, p.w / 2, y + 58, st.d, { size: 11, color: T['--ink-2'] });
        G.label(ctx, p.w / 2, p.h - 12, 'DMA 传送期间由 DMA 控制器占用总线，CPU 可继续执行不访存的指令', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['当前步骤', steps[i].t], ['说明', steps[i].d]]);
    }
    render();
    return s;
  };

  /* ---------- 三种 I/O 方式对比 ---------- */
  W.ioCompare = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { dataKB: 64, rateMB: 5, blockB: 512 };
    UI.note(host, '以「传送 64 KB 数据、设备速率 5 MB/s、每次中断/查询传送 1 个字（4 B）」为例，比较三种方式的 CPU 介入情况（示意）。');
    UI.slider(ctrl, { label: '传送数据量', min: 4, max: 512, step: 4, value: state.dataKB, fmt: v => v + ' KB', onInput: v => { state.dataKB = v; render(); } });
    UI.slider(ctrl, { label: '设备速率', min: 1, max: 50, step: 1, value: state.rateMB, fmt: v => v + ' MB/s', onInput: v => { state.rateMB = v; render(); } });

    function render() {
      const bytes = state.dataKB * 1024;
      const words = bytes / 4;
      const transferTime = bytes / (state.rateMB * 1024 * 1024); // 秒
      const perInterrupt = 200;   // 中断处理开销（时钟周期，示意）
      const perQueryLoop = 60;    // 每次查询循环开销
      const cpuQuery = 1;          // 查询方式 CPU 占用 ~100%
      const interruptCycles = words * perInterrupt;
      const dmaCycles = 1500;      // DMA 初始化与结束开销
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const bars = [
          { name: '程序查询', v: 100, c: T['--red'], desc: 'CPU 空转等待，几乎全程占用' },
          { name: '程序中断', v: Math.min(100, interruptCycles / (transferTime * 1e9) * 100 * 0.9 + 2), c: T['--accent'], desc: `每次 ${perInterrupt} 周期 × ${D.niceNum(words)} 次` },
          { name: 'DMA', v: Math.min(100, dmaCycles / (transferTime * 1e9) * 100 * 0.9 + 1), c: T['--green'], desc: '仅初始化/结束需 CPU，传送期间几乎不占用' }
        ];
        const x0 = 130, bw = p.w - x0 - 60, bh = 34, gap = 20;
        bars.forEach((b, i) => {
          const y = 30 + i * (bh + gap);
          G.label(ctx, x0 - 12, y + bh / 2, b.name, { align: 'right', size: 12, weight: 700, color: b.c });
          G.box(ctx, x0, y, bw, bh, { fill: T['--bg-soft'], stroke: null, radius: 6 });
          G.box(ctx, x0, y, Math.max(6, bw * b.v / 100), bh, { fill: D.withAlpha(b.c, 0.75), stroke: null, radius: 6 });
          G.label(ctx, x0 + 10, y + bh / 2, b.v.toFixed(b.v < 10 ? 1 : 0) + '% CPU 占用', { align: 'left', size: 11.5, weight: 700, color: '#fff' });
          G.label(ctx, x0, y + bh + 12, b.desc, { align: 'left', size: 10.5, color: T['--ink-3'] });
        });
        G.label(ctx, p.w / 2, p.h - 8, `传输 ${state.dataKB} KB 理论耗时 ≈ ${(transferTime * 1e3).toFixed(2)} ms　·　共 ${D.niceNum(words)} 个字`, { size: 11, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['传送字数', D.niceNum(words)],
        ['理论传输时间', (transferTime * 1e3).toFixed(2) + ' ms'],
        ['中断次数（中断方式）', D.niceNum(words)],
        ['DMA 块大小', state.blockB + ' B/块']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 统一编址 / 独立编址 ---------- */
  W.ioPortAddressing = function (host) {
    const s = UI.shell(host, 384);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'unified', bits: 20, kb: 4 };

    UI.note(host, '端口编址决定 CPU 如何访问接口中的寄存器：<b>统一编址</b>把端口当作主存单元，用普通访存指令访问；<b>独立编址</b>给端口单独的地址空间，用专用 IN / OUT 指令访问，并用 M/IO# 之类的信号区分。');
    UI.seg(ctrl, [{ label: '统一编址', value: 'unified' }, { label: '独立编址', value: 'separate' }], v => { state.mode = v; render(); }, 0);
    UI.slider(ctrl, { label: '主存地址线', min: 16, max: 32, step: 4, value: state.bits, fmt: v => v + ' 位', onInput: v => { state.bits = v; render(); } });
    UI.slider(ctrl, { label: 'I/O 端口区大小', min: 1, max: 64, step: 1, value: state.kb, fmt: v => v + ' KB', onInput: v => { state.kb = v; render(); } });

    function render() {
      const memB = Math.pow(2, state.bits);
      const ioB = state.kb * 1024;
      const ioBits = Math.max(8, Math.ceil(Math.log2(ioB)));
      const ratio = ioB / memB;
      const unified = state.mode === 'unified';
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, 16, 14, unified ? '统一编址：端口与主存共用同一地址空间' : '独立编址：主存空间与 I/O 空间相互独立', { align: 'left', size: 12, weight: 700, color: T['--ink'] });

        if (unified) {
          const y = 30, h = 52, W = p.w - 32;
          const ioW = Math.max(96, W * ratio);
          G.box(ctx, 16, y, W - ioW, h, { fill: D.withAlpha(T['--brand'], 0.16), stroke: D.withAlpha(T['--brand'], 0.6), radius: 7 });
          G.box(ctx, 16 + W - ioW, y, ioW, h, { fill: D.withAlpha(T['--accent'], 0.24), stroke: D.withAlpha(T['--accent'], 0.8), width: 1.6, radius: 7 });
          G.label(ctx, 16 + (W - ioW) / 2, y + 20, '主存空间（可用 ' + ((memB - ioB) / 1048576).toFixed(2) + ' MB）', { size: 12, weight: 700, color: T['--brand'] });
          G.label(ctx, 16 + (W - ioW) / 2, y + 39, '0 ─── 2^' + state.bits + ' − ' + ioB, { size: 9.5, color: T['--ink-3'], mono: true });
          G.label(ctx, 16 + W - ioW / 2, y + 20, 'I/O 端口区', { size: 11, weight: 700, color: T['--accent'] });
          G.label(ctx, 16 + W - ioW / 2, y + 39, state.kb + ' KB', { size: 10, color: T['--ink-2'], mono: true });
          G.label(ctx, 16, y + h + 14, `端口占用主存地址空间：${state.kb} KB / ${(memB / 1048576).toFixed(2)} MB ≈ ${(ratio * 100).toFixed(3)}%（图中端口区按最小可见宽度放大绘制）`, { align: 'left', size: 10, color: T['--ink-3'] });
        } else {
          const h = 40;
          G.box(ctx, 16, 30, p.w - 32, h, { fill: D.withAlpha(T['--brand'], 0.16), stroke: D.withAlpha(T['--brand'], 0.6), radius: 7 });
          G.label(ctx, p.w / 2, 44, `主存空间：2^${state.bits} = ${(memB / 1048576).toFixed(2)} MB（地址线 ${state.bits} 位）`, { size: 11.5, weight: 700, color: T['--brand'] });
          G.label(ctx, p.w / 2, 62, '端口不占用这里的任何地址', { size: 10, color: T['--ink-3'] });
          G.box(ctx, 16, 84, p.w - 32, h, { fill: D.withAlpha(T['--accent'], 0.18), stroke: D.withAlpha(T['--accent'], 0.7), width: 1.6, radius: 7 });
          G.label(ctx, p.w / 2, 98, `I/O 空间：${ioBits} 位 I/O 地址 → ${Math.pow(2, ioBits) / 1024} KB（独立编址）`, { size: 11.5, weight: 700, color: T['--accent'] });
          G.label(ctx, p.w / 2, 116, `本例端口区 ${state.kb} KB，占 I/O 空间的 ${(ioB / Math.pow(2, ioBits) * 100).toFixed(1)}%`, { size: 10, color: T['--ink-3'] });
        }

        const by = 146;
        G.box(ctx, 16, by, p.w - 32, 84, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 28, by + 18, '访问指令对照', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const ins = unified
          ? [
            '统一编址：用普通访存指令访问端口，例如  MOV AL, [0xF000]   /   MOV [0xF004], AL',
            '指令系统不需要专门的 I/O 指令，寻址方式与访存完全一样，编程灵活',
            '读/写控制仍用 MEMR / MEMW（或读 / 写命令），地址译码器统一译码'
          ]
          : [
            '独立编址：用专用 I/O 指令访问端口，例如  IN AL, 40H   /   OUT 43H, AL',
            '端口地址只有 16 位（64 KB），指令短、译码快，不占主存地址空间',
            'CPU 用 M/IO# 信号区分访存与 I/O，再由 IOR# / IOW# 控制端口读写'
          ];
        G.lines(ctx, 28, by + 40, ins, { align: 'left', size: 10.5, lineHeight: 19, color: T['--ink-2'] });

        const cy = by + 94;
        G.box(ctx, 16, cy, p.w - 32, 84, { fill: D.withAlpha(T['--brand'], 0.07), stroke: D.withAlpha(T['--brand'], 0.45), radius: 8 });
        G.label(ctx, 28, cy + 18, '优缺点', { align: 'left', size: 11.5, weight: 700, color: T['--brand'] });
        const pros = unified
          ? [
            '优点：可用全部访存指令（含算术、逻辑、移位）直接处理端口数据，寻址方式丰富；',
            '缺点：端口占用了主存地址空间，减小了可用主存容量；难以在指令层区分访存与 I/O。'
          ]
          : [
            '优点：I/O 端口有独立地址空间，不影响主存容量；专用指令短、执行快、易与访存区分；',
            '缺点：需要额外的控制信号与专用指令，指令集更复杂，编程灵活性略差（x86 采用这种方式）。'
          ];
        G.lines(ctx, 28, cy + 42, pros, { align: 'left', size: 10.5, lineHeight: 20, color: T['--ink-2'] });

        G.label(ctx, p.w / 2, p.h - 10, '两种方式都要把端口地址译码为片选信号，选择接口中的某个寄存器（数据 / 状态 / 控制）', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['编址方式', unified ? '统一编址（内存映射 I/O）' : '独立编址'],
        ['地址空间', unified ? `与主存共用 2^${state.bits}` : `主存 2^${state.bits} + I/O 2^${ioBits}`],
        ['端口区大小', state.kb + ' KB'],
        ['访问指令', unified ? 'MOV 等普通访存指令' : 'IN / OUT 专用指令'],
        ['区分信号', unified ? '无需区分（按地址译码）' : 'M/IO# + IOR# / IOW#']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 程序查询方式与 CPU 等待时间 ---------- */
  W.ioPolling = function (host) {
    const s = UI.shell(host, 372);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'busy', tq: 200, tdev: 10, n: 8, k: 0 };

    UI.note(host, '程序查询方式：CPU 不断读<b>状态寄存器</b>的就绪位，直到设备就绪才读写<b>数据寄存器</b>。忙等待时 CPU 与设备串行工作、全程空转；改为定时查询则 CPU 开销占比 ≈ 查询耗时 ÷ 设备就绪间隔。');
    UI.seg(ctrl, [{ label: '忙等待（循环查询）', value: 'busy' }, { label: '定时查询（间隔轮询）', value: 'interval' }], v => {
      state.mode = v; state.k = 0; render();
    }, 0);
    UI.slider(ctrl, { label: '查询一次耗时 t_q', min: 50, max: 600, step: 10, value: state.tq, fmt: v => v + ' ns', onInput: v => { state.tq = v; render(); } });
    UI.slider(ctrl, { label: '设备就绪间隔 t_dev', min: 1, max: 30, step: 0.5, value: state.tdev, fmt: v => v + ' µs', onInput: v => { state.tdev = v; render(); } });
    UI.slider(ctrl, { label: '传送字节数', min: 1, max: 64, step: 1, value: state.n, fmt: v => v + ' B', onInput: v => { state.n = v; render(); } });
    const tr = UI.transport(ctrl, { total: 4, onChange: i => { state.k = i; render(); } });

    function render() {
      const tdevNs = state.tdev * 1000;
      const busy = state.mode === 'busy';
      const q = Math.max(1, Math.floor(tdevNs / state.tq));
      const perByte = busy ? q * state.tq : state.tq;
      const ratio = Math.min(1, perByte / tdevNs);
      const totalT = state.n * tdevNs;
      const cpuT = state.n * perByte;
      const stage = state.k;
      const fmtT = ns => ns >= 1e6 ? (ns / 1e6).toFixed(3) + ' ms' : (ns / 1e3).toFixed(2) + ' µs';

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 16, W = p.w - 32;
        G.label(ctx, x0, 14, `一个数据单元的传送周期（t_dev = ${state.tdev} µs）`, { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const y = 26, h = 46;
        G.box(ctx, x0, y, W, h, { fill: T['--bg-soft'], stroke: T['--line'], radius: 6 });
        if (busy) {
          const qw = W - 78;
          G.box(ctx, x0 + 1, y + 1, qw, h - 2, { fill: D.withAlpha(T['--red'], stage === 1 ? 0.5 : 0.34), stroke: D.withAlpha(T['--red'], 0.8), radius: 5 });
          ctx.save(); ctx.strokeStyle = D.withAlpha(T['--red'], 0.55); ctx.lineWidth = 1;
          for (let sx = x0 + 8; sx < x0 + qw; sx += 9) {
            ctx.beginPath(); ctx.moveTo(sx, y + 6); ctx.lineTo(sx, y + h - 6); ctx.stroke();
          }
          ctx.restore();
          G.fitted(ctx, x0 + qw / 2, y + 17, `循环读状态寄存器 × ${q} 次（CPU 空转等待）`, qw - 16, { size: 10.5, weight: 700, color: '#fff' });
          G.fitted(ctx, x0 + qw / 2, y + 34, `每次 ${state.tq} ns，共约 ${(q * state.tq / 1000).toFixed(2)} µs`, qw - 16, { size: 9.5, color: '#fff' });
        } else {
          const qw = Math.max(6, W * state.tq / tdevNs);
          G.box(ctx, x0 + 1, y + 1, qw, h - 2, { fill: D.withAlpha(T['--red'], stage === 1 ? 0.6 : 0.42), stroke: D.withAlpha(T['--red'], 0.85), radius: 5 });
          G.label(ctx, x0 + qw / 2, y + h / 2, '查询', { size: 9.5, weight: 700, color: '#fff' });
          G.box(ctx, x0 + qw + 2, y + 1, W - qw - 80, h - 2, { fill: D.withAlpha(T['--ink-3'], 0.12), stroke: D.withAlpha(T['--line-2'], 0.8), radius: 5 });
          G.label(ctx, x0 + qw + (W - qw - 80) / 2 + 1, y + h / 2, '设备准备数据 · CPU 可执行其他程序', { size: 10.5, weight: 600, color: T['--ink-2'] });
        }
        G.box(ctx, x0 + W - 76, y + 1, 75, h - 2, { fill: D.withAlpha(T['--green'], stage === 2 ? 0.5 : 0.34), stroke: D.withAlpha(T['--green'], 0.8), radius: 5 });
        G.label(ctx, x0 + W - 76 + 37, y + h / 2, '就绪 → 读数据', { size: 9.5, weight: 700, color: '#fff' });
        G.label(ctx, x0 + W, y + h + 13, '→ t', { align: 'right', size: 9.5, color: T['--ink-3'], mono: true });

        const oy = y + h + 26;
        G.label(ctx, x0, oy, `累计 ${state.n} 个字节的总时间 ${fmtT(totalT)} 中，CPU 用于查询的时间占比`, { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const by = oy + 12, bh = 30;
        G.box(ctx, x0, by, W, bh, { fill: T['--bg-soft'], stroke: null, radius: 5 });
        G.box(ctx, x0, by, Math.max(3, W * ratio), bh, { fill: D.withAlpha(T['--red'], 0.75), stroke: null, radius: 5 });
        G.label(ctx, x0 + W - 8, by + bh / 2, UI.pct(ratio) + ' 用于查询', { align: 'right', size: 10.5, weight: 700, color: ratio > 0.12 ? '#fff' : T['--red'] });

        const iy = by + bh + 16;
        G.box(ctx, x0, iy, W, 76, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.lines(ctx, x0 + 12, iy + 18, [
          `每个字节查询次数 = ⌊t_dev / t_q⌋ = ⌊${tdevNs} ns / ${state.tq} ns⌋ = ${busy ? q : 1} 次　·　总查询次数 = ${busy ? state.n * q : state.n} 次`,
          `总查询耗时 = ${fmtT(cpuT)}　·　数据传送总时间 = ${fmtT(totalT)}　·　CPU 开销占比 = ${UI.pct(ratio)}`,
          `CPU 占用情况：${busy ? '全程参与（查询空转 + 传送），无法并行处理其他任务' : '仅在查询瞬间参与，其余时间可执行其他程序'}`
        ], { align: 'left', size: 10.5, lineHeight: 20, color: T['--ink-2'] });

        const py = iy + 86;
        const pl = ['① 启动设备', '② 查询状态寄存器', '③ 就绪后读数据', '④ 继续下一个字节'];
        const pw = (W - 30) / 4;
        pl.forEach((t, i) => {
          const x = x0 + i * (pw + 10);
          const on = i === stage;
          G.box(ctx, x, py, pw, 32, {
            fill: on ? D.withAlpha(T['--brand'], 0.2) : T['--card-2'],
            stroke: on ? T['--brand'] : T['--line'], width: on ? 1.8 : 1, radius: 7
          });
          G.fitted(ctx, x + pw / 2, py + 16, t, pw - 14, { size: 10.5, weight: on ? 700 : 500, color: on ? T['--brand'] : T['--ink-2'] });
          if (i < 3) G.arrow(ctx, [[x + pw + 2, py + 16], [x + pw + 9, py + 16]], { color: D.withAlpha(T['--line-2'], 0.95), width: 1.2, head: 4 });
        });
        G.label(ctx, p.w / 2, p.h - 10, busy
          ? '结论：忙等待时 CPU 有效利用率极低，设备越慢浪费越大——改用中断方式让设备主动通知 CPU'
          : '结论：定时查询的前提是 t_q < t_dev（否则会漏掉数据），适合 CPU 还有其他任务可做的场合', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['查询方式', busy ? '忙等待（循环查询）' : '定时查询（间隔轮询）'],
        ['每字节查询次数', busy ? q + ' 次' : '1 次'],
        ['总查询耗时', fmtT(cpuT)],
        ['总时间', fmtT(totalT)],
        ['CPU 开销占比', UI.pct(ratio)],
        ['当前步骤', ['① 启动设备', '② 查询状态寄存器', '③ 就绪后读数据', '④ 继续下一个字节'][stage]]
      ]);
    }
    render();
    return s;
  };

})(window);
