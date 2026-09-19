/* ============================================================
   co5.js — 第5章 中央处理器 可视化组件
   datapath：单总线数据通路与微操作单步
   pipeline：指令流水线时空图与性能
   microProgram：微程序控制器
   cpuBlockDiagram：CPU 部件与寄存器数据流（取指→译码→执行）
   instrCycle：指令周期四段（取指/间址/执行/中断）微操作时序
   interruptPriority：中断优先级判优与屏蔽字
   cacheCoherence：多核 Cache 一致性（MSI 状态与总线事务）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 单总线数据通路 ---------- */
  W.datapath = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    // 微操作序列（取指 + 执行 ADD R1,(R2) 简化）
    const steps = [
      { ops: 'PC → MAR', bus: 'PC→MAR', desc: '取指令：PC 内容送地址寄存器 MAR' },
      { ops: 'M(MAR) → MDR', bus: 'M→MDR', desc: '存储器按 MAR 读出指令，送数据寄存器 MDR' },
      { ops: 'MDR → IR', bus: 'MDR→IR', desc: '指令送入指令寄存器 IR，供译码' },
      { ops: 'PC + 1 → PC', bus: 'PC+1', desc: 'PC 加 1，指向下一条指令' },
      { ops: '译码：IR 操作码 → CU', bus: 'IR→CU', desc: '控制器译码，产生后续控制信号' },
      { ops: 'R2 → MAR', bus: 'R2→MAR', desc: '取操作数：寄存器 R2 的内容作为访存地址送 MAR' },
      { ops: 'M(MAR) → MDR', bus: 'M→MDR', desc: '读出操作数到 MDR' },
      { ops: 'MDR, R1 → ALU', bus: 'MDR→ALU', desc: '两个操作数送入 ALU 做加法' },
      { ops: 'ALU → R1', bus: 'ALU→R1', desc: '运算结果写回寄存器 R1' }
    ];
    let step = 0;

    function draw() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w, h = p.h;
        const busY = h / 2 + 20;
        const blocks = [
          { id: 'PC', x: 30, y: 20, w: 70, h: 40, c: T['--teal'] },
          { id: 'MAR', x: 120, y: 20, w: 70, h: 40, c: T['--brand'] },
          { id: 'M', x: 220, y: 20, w: 80, h: 40, c: T['--accent'] },
          { id: 'MDR', x: 330, y: 20, w: 70, h: 40, c: T['--brand'] },
          { id: 'IR', x: 420, y: 20, w: 70, h: 40, c: T['--teal'] },
          { id: 'R1', x: 30, y: h - 70, w: 70, h: 40, c: T['--green'] },
          { id: 'R2', x: 120, y: h - 70, w: 70, h: 40, c: T['--green'] },
          { id: 'ALU', x: 230, y: h - 70, w: 80, h: 40, c: T['--purple'] },
          { id: 'CU', x: 340, y: h - 70, w: 70, h: 40, c: T['--purple'] }
        ];
        // 总线
        G.box(ctx, 20, busY, w - 40, 26, { fill: D.withAlpha(T['--teal'], 0.12), stroke: D.withAlpha(T['--teal'], 0.6), radius: 6 });
        G.label(ctx, w / 2, busY + 13, '单总线（Internal Bus）', { size: 11, weight: 700, color: T['--teal'] });

        const active = steps[step].bus;
        const mentions = id => new RegExp('(^|[^A-Za-z0-9])' + id + '([^A-Za-z0-9]|$)').test(active);
        blocks.forEach(b => {
          const on = mentions(b.id);
          G.box(ctx, b.x, b.y, b.w, b.h, {
            fill: on ? D.withAlpha(b.c, 0.22) : T['--card'],
            stroke: on ? b.c : T['--line-2'], width: on ? 2 : 1.2, radius: 8
          });
          G.label(ctx, b.x + b.w / 2, b.y + b.h / 2, b.id, { size: 13, weight: 700, color: on ? b.c : T['--ink'] });
          // 连接到总线
          const bx = b.x + b.w / 2;
          const by = b.y < busY ? b.y + b.h : b.y;
          G.arrow(ctx, [[bx, by], [bx, b.y < busY ? busY : busY + 26]], { color: D.withAlpha(T['--line-2'], 0.9), width: 1 });
        });

        // 高亮当前微操作文字
        G.box(ctx, 20, h - 24, w - 40, 20, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 5 });
        G.label(ctx, w / 2, h - 14, `微操作：${steps[step].ops}`, { size: 12, weight: 700, color: T['--brand'], mono: true });
      });
      scene.render();
    }
    const t = UI.transport(ctrl, { total: steps.length, onChange: i => { step = i; draw(); renderOut(); } });
    function renderOut() { UI.readout(out, [['步骤', steps[step].ops], ['说明', steps[step].desc]]); }
    renderOut(); draw();
    return s;
  };

  /* ---------- 指令流水线时空图 ---------- */
  W.pipeline = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out } = s;
    const state = { n: 6, data: true, control: false, ideal: false };
    const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];

    UI.seg(ctrl, [{ label: '理想流水', value: 'ideal' }, { label: '数据冒险', value: 'data' }, { label: '控制冒险', value: 'ctrl' }], (v) => {
      state.ideal = v === 'ideal'; state.data = v === 'data'; state.control = v === 'ctrl'; render();
    }, 0);
    UI.slider(ctrl, { label: '指令条数', min: 3, max: 10, step: 1, value: state.n, fmt: v => v + ' 条', onInput: v => { state.n = v; render(); } });

    /** 计算每条指令的停顿（示意：数据冒险在后一条 EX 前等 2 拍；控制冒险在分支后清空 2 拍） */
    function schedule() {
      const rows = [];
      const branch = Math.floor(state.n / 2);
      for (let i = 0; i < state.n; i++) {
        const stalls = [];
        if (state.data && i === 1) stalls.push({ len: 2 });
        if (state.control && i === branch + 1) stalls.push({ len: 2 });
        rows.push(stalls);
      }
      return rows;
    }

    function render() {
      const rows = schedule();
      // 为每条指令计算开始拍
      const starts = [];
      let prevEnd = 0;
      rows.forEach((stalls, i) => {
        let t = prevEnd;
        const st = stalls[0];
        if (st) t += st.len;      // 简化：停顿直接顺延
        starts.push(t);
        prevEnd = t + stages.length;
      });
      const cycles = Math.max(...starts.map((t, i) => t + stages.length));
      const idealCycles = state.n + stages.length - 1;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const left = 54, top = 34;
        const cell = Math.min(30, (p.w - left - 12) / cycles);
        const rh = 26;
        // 阶段表头
        G.label(ctx, left / 2 + 6, top - 12, '', {});
        for (let c = 0; c < cycles; c++) {
          G.label(ctx, left + c * cell + cell / 2, top - 12, 't' + (c + 1), { size: 9.5, color: T['--ink-3'], mono: true });
        }
        for (let i = 0; i < state.n; i++) {
          const y = top + i * (rh + 6);
          G.label(ctx, left - 8, y + rh / 2, 'I' + (i + 1), { align: 'right', size: 11, weight: 700, color: T['--ink-2'], mono: true });
          const start = starts[i];
          const stall = rows[i][0];
          for (let k = 0; k < stages.length; k++) {
            const c = start + k;
            const x = left + c * cell;
            const colors = [T['--brand'], T['--purple'], T['--accent'], T['--teal'], T['--green']];
            G.box(ctx, x + 1, y, cell - 2, rh, { fill: D.withAlpha(colors[k], 0.18), stroke: D.withAlpha(colors[k], 0.6), radius: 5 });
            G.label(ctx, x + cell / 2, y + rh / 2, stages[k], { size: Math.min(10.5, cell - 4), weight: 700, color: colors[k], mono: true });
          }
          if (stall) {
            const c = start - stall.len;
            for (let q = 0; q < stall.len; q++) {
              G.box(ctx, left + (c + q) * cell + 1, y, cell - 2, rh, { fill: D.withAlpha(T['--red'], 0.12), stroke: D.withAlpha(T['--red'], 0.55), radius: 5, dash: [3, 3] });
              G.label(ctx, left + (c + q) * cell + cell / 2, y + rh / 2, '停顿', { size: Math.min(9.5, cell - 6), weight: 700, color: T['--red'] });
            }
          }
        }
        G.label(ctx, p.w / 2, p.h - 10, `总拍数 ${cycles}　·　理想 ${idealCycles}　·　实际加速比 ≈ ${(idealCycles / cycles).toFixed(2)}（相对串行 ${state.n * stages.length} 拍）`, { size: 11.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['指令数', state.n],
        ['总拍数', cycles],
        ['理想流水拍数', idealCycles],
        ['吞吐率', (state.n / cycles).toFixed(2) + ' 条/拍']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 微程序控制器 ---------- */
  W.microProgram = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { i: 0 };
    const microAddr = 0;
    // 微指令序列（简化：取指微程序）
    const micros = [
      { addr: '00', ops: 'PC → MAR', next: '微地址 +1', flags: '' },
      { addr: '01', ops: 'M(MAR) → MDR, PC+1 → PC', next: '微地址 +1', flags: '' },
      { addr: '02', ops: 'MDR → IR', next: '按操作码转移', flags: 'OP(IR) → 微地址' },
      { addr: '03', ops: 'R2 → MAR', next: '微地址 +1', flags: '' },
      { addr: '04', ops: 'M(MAR) → MDR', next: '微地址 +1', flags: '' },
      { addr: '05', ops: 'MDR, R1 → ALU → R1', next: '取下条指令', flags: '' }
    ];

    UI.note(host, '微程序控制器把每条机器指令对应一段微程序，存放在控制存储器（CM）中；微指令执行时产生控制信号，并决定下一条微指令地址。');
    const t = UI.transport(ctrl, { total: micros.length, onChange: i => { state.i = i; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const rh = 30, top = 14;
        micros.forEach((m, i) => {
          const y = top + i * rh;
          const on = i === state.i;
          G.box(ctx, 16, y, p.w - 32, rh - 6, {
            fill: on ? D.withAlpha(T['--brand'], 0.15) : T['--card-2'],
            stroke: on ? T['--brand'] : T['--line'], width: on ? 1.6 : 1, radius: 6
          });
          G.label(ctx, 30, y + (rh - 6) / 2, 'μ' + m.addr, { align: 'left', size: 11, weight: 700, color: T['--brand'], mono: true });
          G.label(ctx, 90, y + (rh - 6) / 2, m.ops, { align: 'left', size: 11.5, weight: on ? 700 : 500, color: on ? T['--ink'] : T['--ink-2'], mono: true });
          if (m.flags) G.label(ctx, p.w - 24, y + (rh - 6) / 2, '⟵ ' + m.flags, { align: 'right', size: 10, color: T['--accent'] });
          else G.label(ctx, p.w - 24, y + (rh - 6) / 2, m.next, { align: 'right', size: 10, color: T['--ink-3'] });
        });
        G.label(ctx, p.w / 2, p.h - 8, '微命令 → 控制信号；微地址形成部件决定顺序 / 转移 / 操作码映射', { size: 11, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['当前微指令', 'μ' + micros[state.i].addr], ['微操作', micros[state.i].ops], ['下址方式', micros[state.i].flags || micros[state.i].next]]);
    }
    render();
    return s;
  };

  /* ---------- CPU 部件与寄存器数据流 ---------- */
  W.cpuBlockDiagram = function (host) {
    const s = UI.shell(host, 384);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { path: ['PC', 'MAR'], text: '取指①：PC → MAR，指令地址送地址寄存器', regs: { MAR: '0x1000' } },
      { path: ['MAR', 'M'], text: '取指②：地址经地址总线送主存，选中相应单元', regs: {} },
      { path: ['M', 'MDR'], text: '取指③：M(MAR) → MDR，指令经数据总线读入', regs: { MDR: '指令码' } },
      { path: ['MDR', 'IR'], text: '取指④：MDR → IR，指令送入指令寄存器', regs: { IR: 'ADD 20(R1)' } },
      { path: ['PC'], text: '取指⑤：PC + 1 → PC，指向下一条指令', regs: { PC: '0x1004' } },
      { path: ['IR', 'CU'], text: '译码：CU 对 IR 中的操作码译码，产生控制信号', regs: {} },
      { path: ['MAR', 'M', 'MDR'], ctrl: true, text: '取数：CU 发出控制信号，按有效地址读操作数到 MDR', regs: { MAR: '0x1020', MDR: '7' } },
      { path: ['MDR', 'ALU'], text: '运算：MDR 与 ACC 送 ALU，按操作码完成运算', regs: { ACC: '5' } },
      { path: ['ALU', 'ACC'], text: '写回：结果写回 ACC，并按要求修改 PSW 标志位', regs: { ACC: '12' } }
    ];
    let k = 0;

    function render() {
      const st = steps[k];
      const regs = {};
      for (let i = 0; i <= k; i++) Object.assign(regs, steps[i].regs);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cw = p.w * 0.66;
        const cx = 14, cy = 12, chh = p.h - 26;
        const rightX = cx + cw + 16;
        const innerX = cx + 16, innerW = cw - 32;
        const colW = (innerW - 24) / 3;
        const c0 = innerX, c1 = innerX + colW + 12, c2 = innerX + 2 * (colW + 12);
        const r0 = cy + 18, r1 = cy + 78, r2 = cy + 132;
        const busY = cy + chh - 46;
        const boxes = {
          CU: { x: c0, y: r0, w: colW, h: 48, t: '控制器 CU', s: '译码 / 发控制信号', c: '--purple' },
          ALU: { x: c1, y: r0, w: colW, h: 48, t: '运算器 ALU', s: '算术逻辑运算', c: '--brand' },
          MAR: { x: c2, y: r0, w: colW, h: 48, t: 'MAR', s: '地址寄存器', c: '--teal' },
          PC: { x: c0, y: r1, w: colW, h: 42, t: 'PC', s: '程序计数器', c: '--teal' },
          ACC: { x: c1, y: r1, w: colW, h: 42, t: 'ACC', s: '累加器', c: '--green' },
          MDR: { x: c2, y: r1, w: colW, h: 42, t: 'MDR', s: '数据寄存器', c: '--teal' },
          IR: { x: c0, y: r2, w: colW, h: 42, t: 'IR', s: '指令寄存器', c: '--teal' },
          PSW: { x: c1, y: r2, w: colW, h: 42, t: 'PSW', s: '状态标志', c: '--accent' },
          M: { x: rightX, y: cy + 46, w: p.w - rightX - 14, h: 128, t: '主存 M', s: '指令与数据', c: '--accent' }
        };
        const inPath = id => st.path.includes(id);
        const conn = (a, b, active, dash) => {
          const A = boxes[a], B = boxes[b];
          G.arrow(ctx, [[A.x + A.w / 2, A.y + A.h / 2], [B.x + B.w / 2, B.y + B.h / 2]], {
            color: active ? T['--red'] : D.withAlpha(T['--line-2'], 0.85),
            width: active ? 2.4 : 1, dash: dash ? [4, 3] : null, head: active ? 7 : 5
          });
        };
        // 静态连线（画在部件下层）
        Object.keys(boxes).forEach(id => {
          if (id === 'M') return;
          const b = boxes[id], x = b.x + b.w / 2;
          G.arrow(ctx, [[x, b.y + b.h], [x, busY + 4]], { color: D.withAlpha(T['--line-2'], 0.8), width: 1, head: 4 });
        });
        conn('MAR', 'M', inPath('MAR') && inPath('M'));
        conn('M', 'MDR', inPath('MDR') && inPath('M'));

        // 高亮路径（相邻节点）
        for (let i = 0; i + 1 < st.path.length; i++) {
          const a = st.path[i], b = st.path[i + 1];
          if (boxes[a] && boxes[b]) conn(a, b, true);
        }
        if (st.ctrl) {
          const CUb = boxes.CU, Mb = boxes.MAR;
          G.arrow(ctx, [[CUb.x + CUb.w, CUb.y + CUb.h / 2], [Mb.x, Mb.y + Mb.h / 2]], { color: T['--purple'], width: 1.6, dash: [4, 3], head: 5 });
          G.label(ctx, (CUb.x + CUb.w + Mb.x) / 2, CUb.y + 10, '控制信号', { size: 9.5, color: T['--purple'] });
        }

        // CPU 外框与内部总线
        G.box(ctx, cx, cy, cw, chh, { fill: 'transparent', stroke: D.withAlpha(T['--brand'], 0.45), width: 1.4, radius: 12, dash: [6, 4] });
        G.label(ctx, cx + 12, cy + 10, 'CPU', { align: 'left', size: 11, weight: 700, color: T['--brand'] });
        G.box(ctx, innerX, busY, innerW, 24, { fill: D.withAlpha(T['--teal'], 0.1), stroke: D.withAlpha(T['--teal'], 0.55), radius: 6 });
        G.label(ctx, innerX + innerW / 2, busY + 12, '内部总线（数据 / 地址）', { size: 10.5, weight: 700, color: T['--teal'] });

        Object.keys(boxes).forEach(id => {
          const b = boxes[id];
          const on = inPath(id);
          const val = regs[id];
          G.box(ctx, b.x, b.y, b.w, b.h, {
            fill: on ? D.withAlpha(T[b.c], 0.22) : T['--card'],
            stroke: on ? T[b.c] : T['--line-2'], width: on ? 2 : 1.2, radius: 8
          });
          G.fitted(ctx, b.x + b.w / 2, b.y + 15, b.t, b.w - 10, { size: 12.5, weight: 700, color: on ? T[b.c] : T['--ink'] });
          G.fitted(ctx, b.x + b.w / 2, b.y + b.h - 13, val || b.s, b.w - 10, {
            size: val ? 10.5 : 10, weight: 600, color: val ? T['--red'] : T['--ink-3'], mono: !!val
          });
          if (id === 'M') {
            G.label(ctx, b.x + b.w / 2, b.y + 42, '按地址存取', { size: 10, color: T['--ink-3'] });
            G.label(ctx, b.x + b.w / 2, b.y + 62, 'MAR 给地址 · MDR 送数据', { size: 9.5, color: T['--ink-3'] });
          }
        });
        G.label(ctx, p.w / 2, p.h - 10, st.text, { size: 12, weight: 700, color: T['--brand'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前步骤', st.text],
        ['PC', regs.PC || '0x1000'], ['IR', regs.IR || '—'],
        ['MAR / MDR', (regs.MAR || '—') + ' / ' + (regs.MDR || '—')],
        ['ACC', regs.ACC || '5']
      ]);
    }
    UI.transport(ctrl, { total: steps.length, onChange: i => { k = i; render(); } });
    render();
    return s;
  };

  /* ---------- 指令周期：取指 / 间址 / 执行 / 中断 ---------- */
  W.instrCycle = function (host) {
    const s = UI.shell(host, 384);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { kind: 0, k: 0 };

    const FE = [
      { op: 'PC → MAR', d: '取指周期：把下一条指令的地址送入 MAR' },
      { op: 'M(MAR) → MDR', d: '按地址读出指令，经数据总线送入 MDR' },
      { op: 'MDR → IR', d: '指令送入指令寄存器 IR，等待译码' },
      { op: 'PC + 1 → PC', d: 'PC 加 1（按指令字长与编址单位折算）指向下一条指令' },
      { op: 'OP(IR) → ID', d: '操作码送指令译码器，决定后续操作与寻址方式' }
    ];
    const IND = [
      { op: 'Ad(IR) → MAR', d: '间址周期：形式地址送 MAR' },
      { op: 'M(MAR) → MDR', d: '访存读出操作数的有效地址' },
      { op: 'MDR → Ad(IR)', d: '有效地址写回指令的地址字段，供执行周期使用' }
    ];
    const EX = [
      { op: 'Ad(IR) → MAR', d: '执行周期：有效地址送 MAR' },
      { op: 'M(MAR) → MDR', d: '按地址取出操作数' },
      { op: 'MDR, ACC → ALU', d: '操作数与累加器内容送 ALU' },
      { op: 'ALU → ACC', d: '运算结果写回 ACC，并按结果修改 PSW 标志' }
    ];
    const INT = [
      { op: '关中断', d: '中断周期（中断隐指令）：关闭中断，防止现场被破坏' },
      { op: '保存断点 (PC、PSW) → 栈', d: '把断点压栈保存，保证能正确返回' },
      { op: '中断服务程序入口 → PC', d: '按中断源取得服务程序入口地址送入 PC' }
    ];

    UI.note(host, '一个指令周期由若干工作周期组成：<b>取指</b>与<b>执行</b>必不可少，<b>间址</b>只在间接寻址时出现，<b>中断</b>只在响应中断时出现。CPU 用 FE / IND / EX / INT 触发器标识当前处于哪个周期。');
    UI.seg(ctrl, [
      { label: 'ADD X（直接寻址）', value: 0 },
      { label: 'ADD (X)（间接寻址）', value: 1 },
      { label: 'ADD X + 中断响应', value: 2 }
    ], v => { state.kind = v; state.k = 0; buildTransport(); render(); }, 0);

    function phases() {
      const list = [{ name: '取指周期 FE', c: '--brand', ops: FE, on: true }];
      list.push({ name: '间址周期 IND', c: '--purple', ops: IND, on: state.kind === 1 });
      list.push({ name: '执行周期 EX', c: '--green', ops: EX, on: true });
      list.push({ name: '中断周期 INT', c: '--red', ops: INT, on: state.kind === 2 });
      return list;
    }
    function seq() {
      const out2 = [];
      phases().forEach((ph, pi) => { ph.ops.forEach((op, oi) => { if (ph.on) out2.push({ pi, oi, ph, op }); }); });
      return out2;
    }
    let total = 9;
    function buildTransport() {
      const old = ctrl.querySelector('.transport-viz');
      if (old) old.remove();
      total = seq().length;
      state.k = 0;
      UI.transport(ctrl, { total: total, onChange: i => { state.k = i; render(); } });
    }
    buildTransport();

    function render() {
      const phs = phases();
      const chain = seq();
      const cur = chain[Math.min(state.k, chain.length - 1)];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const gap = 10;
        const colW = (p.w - 32 - gap * 3) / 4;
        G.label(ctx, 16, 14, `指令周期 = ${phs.filter(x => x.on).map(x => x.name.split(' ')[0]).join(' + ')}　（共 ${total} 个微操作）`, { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        phs.forEach((ph, i) => {
          const x = 16 + i * (colW + gap);
          const onCol = cur && cur.pi === i;
          G.box(ctx, x, 28, colW, 30, {
            fill: ph.on ? D.withAlpha(T[ph.c], onCol ? 0.28 : 0.14) : T['--card-2'],
            stroke: ph.on ? T[ph.c] : T['--line'], width: onCol ? 2 : 1.2, radius: 7
          });
          G.fitted(ctx, x + colW / 2, 43, ph.name, colW - 12, { size: 11.5, weight: 700, color: ph.on ? T[ph.c] : T['--ink-3'] });
          if (!ph.on) {
            G.box(ctx, x, 66, colW, 40, { fill: 'transparent', stroke: T['--line'], dash: [4, 4], radius: 7 });
            G.lines(ctx, x + colW / 2, 80, ['本指令不出现', '该工作周期'], { size: 10, lineHeight: 15, color: T['--ink-3'] });
            return;
          }
          ph.ops.forEach((op, oi) => {
            const y = 66 + oi * 34;
            const isCur = cur && cur.pi === i && cur.oi === oi;
            const done = cur && (cur.pi > i || (cur.pi === i && cur.oi > oi));
            G.box(ctx, x, y, colW, 28, {
              fill: isCur ? D.withAlpha(T[ph.c], 0.26) : (done ? D.withAlpha(T[ph.c], 0.08) : T['--card-2']),
              stroke: isCur ? T[ph.c] : T['--line'], width: isCur ? 1.8 : 1, radius: 6
            });
            G.fitted(ctx, x + 10, y + 14, op.op, colW - 20, { align: 'left', size: 10.5, weight: isCur ? 700 : 500, color: isCur ? T[ph.c] : T['--ink-2'], mono: true });
            if (oi < ph.ops.length - 1) G.arrow(ctx, [[x + colW / 2, y + 28], [x + colW / 2, y + 34]], { color: D.withAlpha(T[ph.c], 0.5), width: 1.2, head: 4 });
          });
        });

        // 周期触发器状态
        const fy = p.h - 96;
        G.label(ctx, 16, fy - 12, '工作周期触发器 / 节拍', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        ['FE', 'IND', 'EX', 'INT'].forEach((f, i) => {
          const on = cur && cur.pi === i;
          const c = [T['--brand'], T['--purple'], T['--green'], T['--red']][i];
          G.box(ctx, 16 + i * 74, fy, 64, 26, {
            fill: on ? D.withAlpha(c, 0.28) : T['--card-2'],
            stroke: on ? c : T['--line'], width: on ? 1.8 : 1, radius: 6
          });
          G.label(ctx, 16 + i * 74 + 32, fy + 13, f + (on ? ' = 1' : ' = 0'), { size: 10.5, weight: 700, color: on ? c : T['--ink-3'], mono: true });
        });
        G.label(ctx, p.w - 16, fy + 13, `第 ${state.k + 1} / ${total} 拍`, { align: 'right', size: 11, weight: 700, color: T['--ink-2'], mono: true });

        const dy = p.h - 56;
        G.box(ctx, 16, dy, p.w - 32, 46, { fill: D.withAlpha(T[cur.ph.c], 0.1), stroke: D.withAlpha(T[cur.ph.c], 0.5), radius: 8 });
        G.label(ctx, 28, dy + 15, `${cur.ph.name}　·　${cur.op.op}`, { align: 'left', size: 11.5, weight: 700, color: T[cur.ph.c], mono: true });
        G.label(ctx, 28, dy + 33, cur.op.d, { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前周期', cur.ph.name],
        ['当前微操作', cur.op.op],
        ['说明', cur.op.d],
        ['包含周期数', phs.filter(x => x.on).length + ' 个（取指、执行必有）']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 中断优先级与屏蔽字 ---------- */
  W.interruptPriority = function (host) {
    const s = UI.shell(host, 384);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const devs = [
      { id: 'A', pri: 4, c: '--red' },
      { id: 'B', pri: 3, c: '--accent' },
      { id: 'C', pri: 2, c: '--purple' },
      { id: 'D', pri: 1, c: '--teal' }
    ];
    const TMAX = 9, TEND = 15;
    const state = { req: { A: 3, B: 2, C: 1, D: 0 }, k: 0 };

    UI.note(host, '优先级 A &gt; B &gt; C &gt; D。服务程序用<b>屏蔽字</b>控制可响应哪些请求：屏蔽位为 1 表示禁止响应，因此每个服务程序屏蔽自己与所有更低优先级的设备，只允许更高优先级的中断嵌套进来。');
    devs.forEach(d => {
      UI.slider(ctrl, {
        label: '设备 ' + d.id + ' 请求', min: 0, max: TMAX + 1, step: 1, value: state.req[d.id],
        fmt: v => v > TMAX ? '不请求' : 't = ' + v,
        onInput: v => { state.req[d.id] = v; buildTransport(); render(); }
      });
    });

    function simulate() {
      const priOf = id => devs.find(d => d.id === id).pri;
      const pend = {};
      const stack = [];
      let cur = null, rem = 0;
      const occ = [], notes = [];
      for (let t = 0; t <= TEND; t++) {
        const arrived = devs.filter(d => state.req[d.id] === t).map(d => d.id);
        arrived.forEach(id => { pend[id] = t; });
        let pre = null;
        const curPri = cur ? priOf(cur) : 0;
        const cand = devs.filter(d => pend[d.id] !== undefined && d.pri > curPri).sort((a, b) => b.pri - a.pri)[0];
        if (cand) {
          if (cur) { stack.push({ id: cur, rem }); pre = cur; }
          cur = cand.id; rem = 3;
          delete pend[cur];
        }
        occ.push(cur);
        notes.push({ arrived, pre, run: cur, wait: Object.keys(pend) });
        if (cur) {
          rem--;
          if (rem <= 0) {
            cur = null;
            if (stack.length) { const r2 = stack.pop(); cur = r2.id; rem = r2.rem; }
          }
        }
      }
      return { occ, notes };
    }
    let sim = simulate();
    let total = TEND + 1;
    function buildTransport() {
      const old = ctrl.querySelector('.transport-viz');
      if (old) old.remove();
      sim = simulate();
      total = TEND + 1;
      state.k = 0;
      UI.transport(ctrl, { total: total, onChange: i => { state.k = i; render(); } });
    }
    buildTransport();

    function maskRow(id) {
      const pri = devs.find(d => d.id === id).pri;
      return devs.map(d => d.pri <= pri ? 1 : 0);
    }

    function render() {
      const k = Math.min(state.k, total - 1);
      const note = sim.notes[k];
      const run = sim.occ[k];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const axisX = 148, axisW = p.w - axisX - 30;
        const cell = axisW / (TEND + 1);
        G.label(ctx, 14, 14, '设备请求时刻与状态（时间轴 t = 0 ~ ' + TEND + '）', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        devs.forEach((d, i) => {
          const y = 28 + i * 28;
          const t = state.req[d.id];
          const running = run === d.id;
          G.label(ctx, 14, y + 12, `${d.id}（优先级 ${d.pri}）`, { align: 'left', size: 11, weight: 700, color: T[d.c] });
          G.box(ctx, axisX, y, axisW, 24, { fill: T['--card-2'], stroke: T['--line'], radius: 5 });
          if (t <= TMAX) {
            G.arrow(ctx, [[axisX + t * cell + cell / 2, y - 4], [axisX + t * cell + cell / 2, y + 12]], { color: T[d.c], width: 1.8, head: 5 });
            G.box(ctx, axisX + t * cell + cell / 2 - 12, y + 2, 24, 20, { fill: D.withAlpha(T[d.c], 0.3), stroke: T[d.c], radius: 4 });
          }
          const st = t > TMAX ? '未请求' : (note.wait.includes(d.id) ? '等待（被屏蔽 / 优先级低）' : (running ? '正在执行服务程序' : (sim.occ.slice(0, k + 1).includes(d.id) ? '已服务完成' : '请求已发出')));
          G.label(ctx, p.w - 16, y + 12, st, { align: 'right', size: 10.5, weight: running ? 700 : 500, color: running ? T[d.c] : T['--ink-3'] });
        });

        const ty = 28 + devs.length * 28 + 12;
        G.label(ctx, 14, ty + 12, 'CPU 占用', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        for (let t = 0; t <= TEND; t++) {
          const id = sim.occ[t];
          const d = id ? devs.find(x => x.id === id) : null;
          const on = t === k;
          G.box(ctx, axisX + t * cell + 1, ty, cell - 2, 26, {
            fill: d ? D.withAlpha(T[d.c], on ? 0.85 : 0.55) : (on ? D.withAlpha(T['--ink-3'], 0.25) : T['--card-2']),
            stroke: on ? T['--ink'] : T['--line'], width: on ? 1.6 : 1, radius: 4
          });
          G.label(ctx, axisX + t * cell + cell / 2, ty + 13, id || '主', { size: Math.min(10.5, cell - 6), weight: 700, color: d ? '#fff' : T['--ink-3'] });
        }
        G.label(ctx, p.w - 16, ty - 4, 't = ' + k, { align: 'right', size: 10, color: T['--red'], mono: true });

        // 屏蔽字表
        const my = ty + 46;
        G.label(ctx, 14, my, '屏蔽字（行 = 当前服务程序，列 = 中断源；1 = 屏蔽，0 = 允许）', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        const tx = 108, tw = Math.min(52, (p.w - tx - 200) / 4);
        devs.forEach((d, i) => G.label(ctx, tx + i * tw + tw / 2, my + 22, d.id, { size: 10.5, weight: 700, color: T[d.c], mono: true }));
        devs.forEach((row, r) => {
          const y = my + 34 + r * 24;
          const on = run === row.id;
          G.label(ctx, 14, y + 12, '服务 ' + row.id, { align: 'left', size: 10.5, weight: on ? 800 : 600, color: on ? T[row.c] : T['--ink-3'] });
          const bits = maskRow(row.id);
          bits.forEach((bv, i) => {
            G.box(ctx, tx + i * tw, y, tw - 6, 22, {
              fill: on ? D.withAlpha(T[row.c], bv ? 0.3 : 0.08) : T['--card-2'],
              stroke: on ? D.withAlpha(T[row.c], 0.7) : T['--line'], width: on ? 1.4 : 1, radius: 4
            });
            G.label(ctx, tx + i * tw + (tw - 6) / 2, y + 11, String(bv), { size: 10.5, weight: 700, color: on && bv ? T[row.c] : T['--ink-3'], mono: true });
          });
          G.label(ctx, tx + 4 * tw + 10, y + 11, bits.join(''), { align: 'left', size: 11, weight: on ? 800 : 600, color: on ? T[row.c] : T['--ink-3'], mono: true });
        });

        const by = my + 34 + devs.length * 24 + 6;
        G.box(ctx, 14, by, p.w - 28, 44, { fill: D.withAlpha(run ? T[devs.find(d => d.id === run).c] : T['--ink-3'], 0.1), stroke: D.withAlpha(run ? T[devs.find(d => d.id === run).c] : T['--ink-3'], 0.5), radius: 8 });
        const msg = run
          ? `t = ${k}：CPU 正在执行设备 ${run} 的服务程序，屏蔽字 ${maskRow(run).join('')}（只允许优先级高于 ${run} 的请求嵌套）`
          : `t = ${k}：CPU 执行主程序${note.wait.length ? '，' + note.wait.join('、') + ' 的请求在等待' : ''}`;
        G.label(ctx, 26, by + 14, msg, { align: 'left', size: 11, weight: 700, color: run ? T[devs.find(d => d.id === run).c] : T['--ink-2'] });
        G.label(ctx, 26, by + 32, note.pre ? `设备 ${note.pre} 的服务被更高优先级请求打断 → 中断嵌套（现场压栈，返回后继续）` : '优先级判优：未被屏蔽的请求中优先级最高者被响应', { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前时刻', 't = ' + k],
        ['正在服务', run || '主程序'],
        ['屏蔽字', run ? maskRow(run).join('') : '——'],
        ['等待中的请求', note.wait.length ? note.wait.join('、') : '无'],
        ['发生的嵌套', note.pre ? '设备 ' + note.pre + ' 被抢占' : '无']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 多核 Cache 一致性（MSI） ---------- */
  W.cacheCoherence = function (host) {
    const s = UI.shell(host, 404);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const other = c => (c === 1 ? 2 : 1);
    const state = { ops: [['P1', 'R'], ['P2', 'R'], ['P1', 'W'], ['P2', 'R'], ['P2', 'W'], ['P1', 'R']], k: 0 };

    UI.note(host, 'MSI 协议：<b>M 已修改</b>（独占，主存副本过时）、<b>S 共享</b>（干净，可多副本）、<b>I 无效</b>。写命中 S 或写缺失时要发 BusRdX 作废其它副本；其它核要读 M 状态的块时，由它提供数据并写回主存。');

    function apply(prev, core, op) {
      const st = { c1: prev.c1, c2: prev.c2, val: prev.val, mem: prev.mem };
      const me = core === 1 ? 'c1' : 'c2';
      const ot = core === 1 ? 'c2' : 'c1';
      const tx = [];
      let desc = '';
      if (op === 'R') {
        if (st[me] === 'M' || st[me] === 'S') {
          desc = `P${core} 读命中（${st[me]}），直接从私有 Cache 取数，无总线事务`;
        } else {
          tx.push('BusRd（读缺失，请求共享副本）');
          if (st[ot] === 'M') {
            tx.push(`P${other(core)} 监听命中：Flush 提供数据并写回主存，状态 M → S`);
            st.mem = st.val;
            st[ot] = 'S';
          } else if (st[ot] === 'S') {
            tx.push('主存提供数据（另一核副本干净）');
          } else {
            tx.push('主存提供数据（无其它副本）');
          }
          st[me] = 'S';
          desc = `P${core} 读缺失，取得共享副本后状态 I → S，主存与各副本一致`;
        }
      } else {
        if (st[me] === 'M') {
          desc = `P${core} 写命中（M），直接改写私有 Cache，无总线事务（主存副本仍然过时）`;
        } else if (st[me] === 'S') {
          tx.push('BusRdX（作废其它副本，升级为独占）');
          st[ot] = 'I';
          st[me] = 'M';
          desc = `P${core} 写命中 S：发 BusRdX 作废其它核副本，S → M，此后独占可自由改写`;
        } else {
          tx.push('BusRdX（写缺失，取独占并作废其它副本）');
          if (st[ot] === 'M') {
            tx.push(`P${other(core)} 监听命中：写回主存，状态 M → I`);
            st.mem = st.val;
          }
          st[ot] = 'I';
          st[me] = 'M';
          desc = `P${core} 写缺失：取回数据块并作废其它副本，I → M`;
        }
        st.val = st.val + 1;
      }
      return { next: st, tx, desc };
    }

    function history() {
      let st = { c1: 'I', c2: 'I', val: 0, mem: 0 };
      const list = [];
      state.ops.forEach(([core, op]) => {
        const c = core === 'P1' ? 1 : 2;
        const r = apply(st, c, op);
        list.push({ core, op, tx: r.tx, desc: r.desc, before: st, after: r.next });
        st = r.next;
      });
      return list;
    }
    let hist = history();
    let total = 6;
    let tr = null;
    function buildTransport() {
      const old = ctrl.querySelector('.transport-viz');
      if (old) old.remove();
      hist = history();
      total = Math.max(1, hist.length);
      state.k = 0;
      tr = UI.transport(ctrl, { total: total, onChange: i => { state.k = i; render(); } });
    }
    function addOp(core, op) { state.ops.push([core, op]); buildTransport(); tr.go(total - 1); }
    UI.button(ctrl, 'P1 读', () => addOp('P1', 'R'));
    UI.button(ctrl, 'P1 写', () => addOp('P1', 'W'));
    UI.button(ctrl, 'P2 读', () => addOp('P2', 'R'));
    UI.button(ctrl, 'P2 写', () => addOp('P2', 'W'));
    UI.button(ctrl, '重置', () => {
      state.ops = [['P1', 'R'], ['P2', 'R'], ['P1', 'W'], ['P2', 'R'], ['P2', 'W'], ['P1', 'R']];
      buildTransport(); render();
    });
    buildTransport();

    function stColor(s2) { return s2 === 'M' ? '--red' : (s2 === 'S' ? '--green' : '--ink-3'); }

    function render() {
      const k = Math.min(state.k, hist.length - 1);
      const hh = hist[k];
      const cur = hh.after, prev = hh.before;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 操作序列
        G.label(ctx, 14, 14, '操作序列', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        const cw2 = Math.min(54, (p.w - 110) / Math.max(1, hist.length));
        hist.forEach((h2, i) => {
          const x = 88 + i * cw2;
          const on = i === k;
          const col = h2.op === 'W' ? T['--red'] : T['--brand'];
          G.box(ctx, x, 6, cw2 - 4, 22, {
            fill: on ? D.withAlpha(col, 0.3) : T['--card-2'], stroke: on ? col : T['--line'], width: on ? 1.6 : 1, radius: 4
          });
          G.label(ctx, x + (cw2 - 4) / 2, 17, h2.core + (h2.op === 'R' ? '读' : '写'), { size: Math.min(10, cw2 - 8), weight: on ? 700 : 500, color: on ? col : T['--ink-3'] });
        });

        // 两核 Cache
        const bw2 = Math.min(230, (p.w - 60) / 2);
        const drawCache = (x, core, st2, val) => {
          const on = hh.core === 'P' + core;
          const col = T[stColor(st2)];
          G.box(ctx, x, 44, bw2, 78, {
            fill: on ? D.withAlpha(T['--brand'], 0.1) : T['--card'], stroke: on ? T['--brand'] : T['--line-2'], width: on ? 1.8 : 1.2, radius: 10
          });
          G.label(ctx, x + bw2 / 2, 60, `P${core} 私有 Cache`, { size: 12, weight: 700, color: on ? T['--brand'] : T['--ink'] });
          G.box(ctx, x + bw2 / 2 - 34, 72, 68, 26, { fill: D.withAlpha(col, 0.22), stroke: col, width: 1.6, radius: 6 });
          G.label(ctx, x + bw2 / 2, 85, st2, { size: 13, weight: 800, color: col, mono: true });
          G.label(ctx, x + bw2 / 2, 112, st2 === 'I' ? '（无效，需重新取回）' : `块 X = ${val}${st2 === 'M' ? '（已修改，主存过时）' : '（与主存一致）'}`, { size: 10.5, color: T['--ink-2'] });
        };
        drawCache(20, 1, cur.c1, cur.val);
        drawCache(p.w - bw2 - 20, 2, cur.c2, cur.val);

        // 总线
        const busY = 140;
        const busy = hh.tx.length > 0;
        G.box(ctx, 20, busY, p.w - 40, 24, {
          fill: busy ? D.withAlpha(T['--accent'], 0.2) : T['--card-2'],
          stroke: busy ? T['--accent'] : T['--line'], width: busy ? 1.8 : 1.2, radius: 6
        });
        G.label(ctx, p.w / 2, busY + 12, busy ? '总线：监听 / 事务进行中（' + hh.tx[0] + '）' : '总线空闲（命中且独占时无需总线事务）', { size: 10.5, weight: 700, color: busy ? T['--accent'] : T['--ink-3'] });
        if (busy) G.arrow(ctx, [[p.w / 2 - 60, busY + 24], [p.w / 2 + 60, busY + 24]], { color: D.withAlpha(T['--accent'], 0.7), width: 1.4, head: 6 });

        // 主存
        const mx = p.w / 2 - 110;
        G.box(ctx, mx, 180, 220, 54, { fill: T['--card'], stroke: T['--line-2'], radius: 10 });
        G.label(ctx, mx + 110, 198, '主存 X = ' + cur.mem, { size: 12.5, weight: 700, color: T['--ink'] });
        G.label(ctx, mx + 110, 218, cur.c1 === 'M' || cur.c2 === 'M' ? '注意：至少一个副本为 M，主存内容可能过时' : '与各 Cache 副本保持一致（S 状态）', { size: 10, color: T['--ink-3'] });
        G.arrow(ctx, [[p.w / 2, 156], [p.w / 2, 178]], { color: D.withAlpha(T['--line-2'], 0.9), width: 1.2, head: 5 });
        G.arrow(ctx, [[60, 122], [60, 138]], { color: D.withAlpha(T['--line-2'], 0.9), width: 1.2, head: 5 });
        G.arrow(ctx, [[p.w - 60, 122], [p.w - 60, 138]], { color: D.withAlpha(T['--line-2'], 0.9), width: 1.2, head: 5 });

        // 本次事务与状态迁移
        const iy = 246;
        G.box(ctx, 20, iy, p.w - 40, 62, { fill: D.withAlpha(hh.op === 'W' ? T['--red'] : T['--brand'], 0.08), stroke: D.withAlpha(hh.op === 'W' ? T['--red'] : T['--brand'], 0.45), radius: 8 });
        G.label(ctx, 32, iy + 16, `${k + 1}. ${hh.core} ${hh.op === 'R' ? '读' : '写'} X：Cache (${prev.c1},${prev.c2}) → (${cur.c1},${cur.c2})`, { align: 'left', size: 11.5, weight: 700, color: hh.op === 'W' ? T['--red'] : T['--brand'], mono: true });
        G.label(ctx, 32, iy + 36, hh.desc, { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, 32, iy + 52, '总线事务：' + (hh.tx.length ? hh.tx.join(' → ') : '无'), { align: 'left', size: 10.5, color: T['--ink-3'] });

        // MSI 说明
        const sy = 318;
        const msi = [
          ['M', 'Modified 已修改', '本核独占且已改写，主存副本过时；被其它核请求时负责提供数据并写回', '--red'],
          ['S', 'Shared 共享', '与主存及其它副本一致，可多核同时持有（只读）', '--green'],
          ['I', 'Invalid 无效', '副本无效，访问需发总线事务重新取得', '--ink-3']
        ];
        msi.forEach((m, i) => {
          const w = (p.w - 40 - 20) / 3;
          const x = 20 + i * (w + 10);
          const on = cur.c1 === m[0] || cur.c2 === m[0];
          G.box(ctx, x, sy, w, 56, {
            fill: on ? D.withAlpha(T[m[3]], 0.14) : T['--card-2'],
            stroke: on ? D.withAlpha(T[m[3]], 0.6) : T['--line'], width: on ? 1.6 : 1, radius: 8
          });
          G.label(ctx, x + 12, sy + 16, m[1], { align: 'left', size: 11, weight: 700, color: on ? T[m[3]] : T['--ink-3'] });
          G.fitted(ctx, x + 12, sy + 38, m[2], w - 24, { align: 'left', size: 10, weight: 500, color: T['--ink-2'] });
        });
      });
      scene.render();
      UI.readout(out, [
        ['当前操作', `${hh.core} ${hh.op === 'R' ? '读' : '写'} X`],
        ['P1 / P2 状态', `${cur.c1} / ${cur.c2}`],
        ['X 的值', String(cur.val)],
        ['总线事务', hh.tx.length ? hh.tx.join(' → ') : '无（本地命中）']
      ]);
    }
    render();
    return s;
  };

})(window);
