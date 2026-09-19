/* ============================================================
   co4.js — 第4章 指令系统 可视化组件
   instrFormat：指令格式    addressingMode：寻址方式
   expOpcode：扩展操作码
   stackFrame：过程调用的栈帧（call / ret 时的压栈与退栈）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const B = global.Bits;
  const G = D.G, C = UI.C;

  /* ---------- 指令格式 ---------- */
  W.instrFormat = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { len: 16, opcode: 4, addr: 4, addrCount: 2 };

    UI.slider(ctrl, { label: '指令长度', min: 8, max: 32, step: 8, value: state.len, fmt: v => v + ' 位', onInput: v => { state.len = v; render(); } });
    UI.slider(ctrl, { label: '操作码位数', min: 2, max: 12, step: 1, value: state.opcode, fmt: v => v + ' 位', onInput: v => { state.opcode = v; render(); } });
    UI.seg(ctrl, [{ label: '二地址', value: 2 }, { label: '一地址', value: 1 }, { label: '零地址', value: 0 }], v => { state.addrCount = v; render(); }, 0);

    function render() {
      const addrBitsEach = state.addrCount > 0 ? Math.floor((state.len - state.opcode) / state.addrCount) : 0;
      const groups = [{ name: '操作码 OP', bits: state.opcode, color: C('--brand'), range: `${state.len - 1} ─ ${state.len - state.opcode}` }];
      for (let i = 0; i < state.addrCount; i++) {
        groups.push({ name: `地址码 A${i + 1}`, bits: addrBitsEach, color: i ? C('--purple') : C('--teal'), range: '' });
      }
      const used = state.opcode + addrBitsEach * state.addrCount;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, p.w / 2, 16, `指令字长 ${state.len} 位 · ${['零', '一', '二'][state.addrCount] || ''}地址指令`, { size: 12.5, weight: 700, color: T['--ink'] });
        G.bits(ctx, 16, 44, p.w - 32, 50, { groups, valueSize: 12, nameSize: 11 });
        const rows = [
          ['操作码可表示', `${Math.pow(2, state.opcode)} 种（${state.opcode} 位）`],
          ['每地址码位数', state.addrCount ? `${addrBitsEach} 位 → 可寻址 ${Math.pow(2, addrBitsEach)} 个单元` : '无地址码'],
          ['已用位数', `${used} 位${used < state.len ? `（剩余 ${state.len - used} 位）` : ''}`],
          ['指令数 × 地址空间', `2^${state.opcode} × 2^${addrBitsEach} 的编码空间`]
        ];
        rows.forEach((r, i) => {
          const y = 118 + i * 30;
          G.box(ctx, 16, y, p.w - 32, 24, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
          G.label(ctx, 28, y + 12, r[0], { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
          ctx.save(); ctx.fillStyle = T['--ink-2']; ctx.font = `600 11px ${D.FONT_MONO}`;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(r[1], p.w - 28, y + 12); ctx.restore();
        });
        if (used < state.len) G.label(ctx, p.w / 2, p.h - 10, `注意：地址码位数不能整除时会浪费 ${state.len - used} 位，需按 instruction 字长边界对齐`, { size: 10.5, color: T['--accent'] });
      });
      scene.render();
      UI.readout(out, [
        ['指令字长', state.len + ' 位'], ['操作码', state.opcode + ' 位'],
        ['地址码', state.addrCount ? state.addrCount + ' × ' + addrBitsEach + ' 位' : '无'],
        ['可寻址空间', state.addrCount ? Math.pow(2, addrBitsEach) + ' 个单元/地址' : '—']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 寻址方式 ---------- */
  W.addressingMode = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const regs = { R1: 0x2000, R2: 0x30, PC: 0x1000, XR: 0x08 }; // 寄存器内容
    const mem = { 0x30: 0x1234, 0x2000: 0x5678, 0x1234: 0x9ABC, 0x1008: 0x2004, 0x2008: 0x00FF, 0x9ABC: 0x0001 };
    const state = { mode: 0, imm: 0x30 };

    const modes = [
      { name: '立即寻址', ea: () => '——', val: () => state.imm, desc: '形式地址 A 本身就是操作数，取指即得，无需访存。' },
      { name: '直接寻址', ea: () => '0x' + state.imm.toString(16).toUpperCase(), val: () => mem[state.imm] ?? 0, desc: 'EA = A，操作数在主存地址 A 处。' },
      { name: '间接寻址', ea: () => '(A) = 0x' + (mem[state.imm] ?? 0).toString(16).toUpperCase(), val: () => mem[mem[state.imm]] ?? 0, desc: 'EA = (A)，先访存取地址，再访存取数（两次访存）。' },
      { name: '寄存器寻址', ea: () => 'R1', val: () => regs.R1, desc: 'EA = R，操作数在寄存器中，无需访存。' },
      { name: '寄存器间接', ea: () => '(R1) = 0x' + regs.R1.toString(16).toUpperCase(), val: () => mem[regs.R1] ?? 0, desc: 'EA = (R)，操作数地址在寄存器中，需一次访存。' },
      { name: '相对寻址', ea: () => 'PC+A = 0x' + (regs.PC + state.imm).toString(16).toUpperCase(), val: () => mem[regs.PC + state.imm] ?? 0, desc: 'EA = PC + A，常用于转移指令，便于程序浮动。' },
      { name: '基址寻址', ea: () => 'R2+A = 0x' + (regs.R2 + state.imm).toString(16).toUpperCase(), val: () => mem[regs.R2 + state.imm] ?? 0, desc: 'EA = 基址寄存器 + A，基址由系统给定，利于重定位。' },
      { name: '变址寻址', ea: () => 'XR+A = 0x' + (regs.XR + state.imm).toString(16).toUpperCase(), val: () => mem[regs.XR + state.imm] ?? 0, desc: 'EA = 变址寄存器 + A，变址由用户改变，适合数组遍历。' }
    ];

    UI.seg(ctrl, modes.map(m => ({ label: m.name, value: m.name })), (v, i) => { state.mode = i; render(); }, 0);
    const aInp = UI.number(ctrl, { label: '形式地址 A (hex)', value: state.imm.toString(16), min: 0, max: 0xFFFF, step: 1, width: 90 });
    aInp.onChange(v => { state.imm = Math.max(0, v); render(); });

    function render() {
      const m = modes[state.mode];
      const eaStr = m.ea(), val = m.val();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.box(ctx, 16, 14, p.w - 32, 44, { fill: D.withAlpha(T['--brand'], 0.1), stroke: D.withAlpha(T['--brand'], 0.55), radius: 9 });
        G.label(ctx, 30, 30, m.name, { align: 'left', size: 13, weight: 700, color: T['--brand'] });
        G.label(ctx, 30, 48, m.desc, { align: 'left', size: 11, color: T['--ink-2'] });

        // 寄存器与存储器
        G.label(ctx, 16, 74, '通用寄存器 / PC', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const rks = Object.keys(regs);
        const rcw = (p.w - 40) / rks.length;
        rks.forEach((r, i) => {
          const x = 20 + i * rcw;
          G.box(ctx, x, 86, rcw - 8, 40, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
          G.label(ctx, x + (rcw - 8) / 2, 99, r, { size: 10.5, weight: 700, color: T['--ink-3'], mono: true });
          G.label(ctx, x + (rcw - 8) / 2, 115, '0x' + regs[r].toString(16).toUpperCase(), { size: 12, weight: 700, color: T['--ink'], mono: true });
        });

        G.label(ctx, 16, 142, '有效地址 EA 与操作数', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        G.box(ctx, 16, 154, p.w - 32, 30, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
        G.label(ctx, 28, 169, 'EA =', { align: 'left', size: 11.5, color: T['--ink-3'] });
        G.label(ctx, 64, 169, eaStr, { align: 'left', size: 13, weight: 700, color: T['--brand'], mono: true });
        G.box(ctx, 16, 190, p.w - 32, 30, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 6 });
        G.label(ctx, 28, 205, '操作数 =', { align: 'left', size: 11.5, color: T['--ink-3'] });
        G.label(ctx, 92, 205, '0x' + (val >>> 0).toString(16).toUpperCase().padStart(4, '0'), { align: 'left', size: 14, weight: 800, color: T['--green'], mono: true });

        const costs = ['0 次访存（取指除外）', '1 次访存', '2 次访存', '0 次访存', '1 次访存', '1 次访存', '1 次访存', '1 次访存'];
        G.label(ctx, p.w / 2, p.h - 12, '取操作数访存次数：' + costs[state.mode], { size: 11.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['寻址方式', m.name], ['有效地址 EA', eaStr], ['操作数', '0x' + (val >>> 0).toString(16).toUpperCase()]]);
    }
    render();
    return s;
  };

  /* ---------- 扩展操作码 ---------- */
  W.expOpcode = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { base: 4, addr1: 4, n1: 15 };

    UI.note(host, '扩展操作码：短操作码指令的地址码位数多，用「保留编码」扩展出长操作码指令，使各类指令编码不重叠、前缀唯一。');
    UI.slider(ctrl, { label: '短码指令数（4 位操作码）', min: 0, max: 16, step: 1, value: state.n1, fmt: v => v + ' 条', onInput: v => { state.n1 = v; render(); } });
    UI.slider(ctrl, { label: '地址码位数/个', min: 2, max: 6, step: 1, value: state.addr1, fmt: v => v + ' 位', onInput: v => { state.addr1 = v; render(); } });

    function render() {
      const n1 = state.n1, a = state.addr1, base = state.base;
      const free = Math.pow(2, base) - n1;               // 未使用的短码前缀
      const extCodes = free * Math.pow(2, a);            // 每个保留前缀 × A2 位可扩展出的编码数
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const y0 = 20;
        // 操作码树
        const levels = [
          { label: `短码：${base} 位操作码 × ${a}位 A1 × ${a}位 A2`, used: n1, total: Math.pow(2, base), color: T['--brand'] },
          { label: `保留码扩展：${free} 个前缀 × ${a}位 A3`, used: free * Math.pow(2, a), total: free * Math.pow(2, a), color: T['--purple'] }
        ];
        G.box(ctx, 16, y0, p.w - 32, 44, { fill: D.withAlpha(T['--brand'], 0.1), stroke: D.withAlpha(T['--brand'], 0.5), radius: 9 });
        G.label(ctx, 28, y0 + 16, `短操作码 ${base} 位可编码 ${Math.pow(2, base)} 种`, { align: 'left', size: 12, weight: 700, color: T['--brand'] });
        G.label(ctx, 28, y0 + 32, `其中 ${n1} 种用于「4 位操作码」的指令，剩 ${free} 种作为扩展标志`, { align: 'left', size: 11, color: T['--ink-2'] });

        G.bits(ctx, 16, 84, p.w - 32, 46, {
          groups: [
            { name: '操作码', value: B.group('0000', 4), bits: base, color: T['--brand'] },
            { name: 'A1', value: '', bits: state.addr1, color: T['--teal'] },
            { name: 'A2', value: '', bits: state.addr1, color: T['--teal'] }
          ], valueSize: 11
        });

        G.box(ctx, 16, 150, p.w - 32, 44, { fill: D.withAlpha(T['--purple'], 0.1), stroke: D.withAlpha(T['--purple'], 0.5), radius: 9 });
        G.label(ctx, 28, 166, `长操作码：用保留前缀扩展出 ${free} × 2^${a} = ${extCodes} 种编码`, { align: 'left', size: 12, weight: 700, color: T['--purple'] });
        G.label(ctx, 28, 182, `即前缀共有 ${free} 个，每个前缀用后 ${a} 位继续编码，可再分出 ${extCodes} 条指令；还可留出部分作为更长码的前缀`, { align: 'left', size: 11, color: T['--ink-2'] });

        G.box(ctx, 16, 206, p.w - 32, 40, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 28, 220, '编码原则', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        G.label(ctx, 28, 236, `短码不能是长码的前缀：${n1} 条 4 位码占用 ${n1}/${Math.pow(2, base)} 个前缀，其余才可作扩展`, { align: 'left', size: 11, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['短码可用编码', Math.pow(2, base) + ' 种'],
        ['短码已用', n1 + ' 条'],
        ['保留前缀', free + ' 个'],
        ['可扩展三地址码', free * Math.pow(2, a) + ' 条']
      ]);
    }
    render();
    return s;
  };

  /* ---------- 过程调用的栈帧 ---------- */
  W.stackFrame = function (host) {
    const s = UI.shell(host, 392);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');

    const code = [
      '/* 调用者 */',
      'push $2           // 实参 b（从右向左压栈）',
      'push $1           // 实参 a',
      'call foo          // 压入返回地址并跳转',
      'add $16, %rsp     // 调用者清理参数',
      '/* foo：被调函数 */',
      'push %rbp         // 保存调用者帧指针',
      'mov %rsp, %rbp    // 建立新栈帧',
      'sub $16, %rsp     // 分配局部变量空间',
      '...               // 函数体执行',
      'leave             // mov %rsp,%rbp; pop %rbp',
      'ret               // 弹出返回地址，返回调用点'
    ];
    const steps = [
      { line: 0, ops: [], act: '调用前', desc: '调用者的栈帧：rbp 指向帧基址，rsp 指向栈顶（低地址）' },
      { line: 1, ops: [{ push: '实参 b = 2', c: '--accent' }, { push: '实参 a = 1', c: '--accent' }], act: 'push 2 / push 1', desc: '参数从右向左入栈（cdecl 约定），rsp 下移 16 B' },
      { line: 3, ops: [{ push: '返回地址（call 的下一条）', c: '--red' }], act: 'call foo', desc: 'call 把下一条指令地址压栈作为返回地址，再跳到 foo 入口' },
      { line: 6, ops: [{ push: '旧 rbp（调用者帧指针）', c: '--purple' }], act: 'push %rbp', desc: '保存调用者的帧指针，函数返回时用它恢复调用者的栈帧' },
      { line: 7, ops: [{ mark: 'rbp' }], act: 'mov %rsp,%rbp', desc: '新 rbp = 当前 rsp，作为访问参数与局部变量的基准（帧基址）' },
      { line: 8, ops: [{ push: '局部变量 x', c: '--green' }, { push: '局部变量 y', c: '--green' }], act: 'sub $16,%rsp', desc: '为局部变量分配空间，rsp 继续向低地址移动' },
      { line: 9, ops: [], act: '执行函数体', desc: '参数用 [rbp+16]、[rbp+24] 访问（高地址侧），局部变量用 [rbp−4]、[rbp−8] 访问' },
      { line: 10, ops: [{ toRbp: true }, { pop: '恢复旧 rbp', c: '--purple' }], act: 'leave', desc: 'mov %rbp,%rsp 先释放局部变量区，pop %rbp 恢复调用者帧指针' },
      { line: 11, ops: [{ pop: '返回地址 → PC', c: '--red' }], act: 'ret', desc: 'ret 弹出返回地址送 PC，回到调用点的下一条指令继续执行' },
      { line: 4, ops: [{ popArgs: 2 }], act: 'add $16,%rsp', desc: '调用者清理参数（栈平衡），rsp 回到调用前的位置' }
    ];

    function snapshots() {
      const list = [];
      let cells = [
        { label: '调用者局部变量 v1', c: '--ink-3' },
        { label: '调用者局部变量 v2', c: '--ink-3' }
      ];
      let rbp = 0, rsp = 1;
      const apply = op => {
        if (op.push !== undefined) { cells.push({ label: op.push, c: op.c }); rsp = cells.length - 1; }
        else if (op.mark === 'rbp') rbp = rsp;
        else if (op.toRbp) { cells = cells.slice(0, rbp + 1); rsp = rbp; }
        else if (op.pop !== undefined) { cells.pop(); rsp = cells.length - 1; }
        else if (op.popArgs) { cells = cells.slice(0, Math.max(0, cells.length - op.popArgs)); rsp = cells.length - 1; }
      };
      steps.forEach(st => {
        st.ops.forEach(apply);
        list.push({ cells: cells.map(c => ({ label: c.label, c: c.c })), rbp, rsp });
      });
      return list;
    }
    const snaps = snapshots();
    let k = 0;

    function render() {
      const snap = snaps[k];
      const st = steps[k];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const lw = Math.min(360, p.w * 0.46);
        G.label(ctx, 14, 16, 'x86 风格汇编', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        code.forEach((ln, i) => {
          const y = 30 + i * 22;
          const on = i === st.line;
          G.box(ctx, 14, y, lw, 19, {
            fill: on ? D.withAlpha(T['--brand'], 0.16) : (i === 5 ? T['--card-2'] : 'transparent'),
            stroke: on ? T['--brand'] : null, width: on ? 1.4 : 1, radius: 4
          });
          G.fitted(ctx, 22, y + 9.5, ln, lw - 16, { align: 'left', size: 10, weight: on ? 700 : 500, color: on ? T['--brand'] : T['--ink-3'], mono: true });
        });

        const sx0 = 14 + lw + 26;
        const sw = p.w - 16 - sx0 - 92;
        G.label(ctx, sx0, 16, '栈（高地址在上，向低地址生长）', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const sy = 30, sh = 30;
        for (let i = 0; i < 9; i++) {
          const y = sy + i * sh;
          const cell = snap.cells[i];
          const isRsp = i === snap.rsp, isRbp = i === snap.rbp;
          G.box(ctx, sx0, y, sw, sh - 4, {
            fill: cell ? D.withAlpha(T[cell.c], isRsp || isRbp ? 0.28 : 0.14) : T['--card-2'],
            stroke: isRsp ? T['--red'] : (isRbp ? T['--purple'] : T['--line']),
            width: isRsp || isRbp ? 1.8 : 1, radius: 5
          });
          G.label(ctx, sx0 + sw - 8, y + (sh - 4) / 2, '0x' + (0x8000 - 8 * i).toString(16).toUpperCase(), { align: 'right', size: 9.5, color: T['--ink-3'], mono: true });
          if (cell) G.fitted(ctx, sx0 + 10, y + (sh - 4) / 2, cell.label, sw - 80, { align: 'left', size: 10.5, weight: 600, color: T[cell.c] });
          if (!cell) G.label(ctx, sx0 + 10, y + (sh - 4) / 2, '（空）', { align: 'left', size: 10, color: T['--ink-3'] });
          if (isRsp) G.label(ctx, sx0 + sw + 8, y + (sh - 4) / 2, 'rsp →', { align: 'left', size: 10, weight: 800, color: T['--red'], mono: true });
          else if (isRbp) G.label(ctx, sx0 + sw + 8, y + (sh - 4) / 2, 'rbp →', { align: 'left', size: 10, weight: 800, color: T['--purple'], mono: true });
        }
        G.label(ctx, sx0 + sw + 8, sy + 9 * sh + 4, `rsp = 0x${(0x8000 - 8 * snap.rsp).toString(16).toUpperCase()}　rbp = 0x${(0x8000 - 8 * snap.rbp).toString(16).toUpperCase()}`, { align: 'left', size: 10, color: T['--ink-2'], mono: true });

        G.box(ctx, 14, 318, p.w - 28, 52, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.45), radius: 8 });
        G.label(ctx, 26, 335, `${k + 1}. ${st.act}`, { align: 'left', size: 11.5, weight: 700, color: T['--brand'], mono: true });
        G.label(ctx, 26, 355, st.desc, { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, p.w / 2, p.h - 8, '栈向低地址生长：压栈 rsp 减，退栈 rsp 加；rbp 固定为帧基址，局部变量在低地址侧、参数在高地址侧', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前操作', st.act],
        ['rsp（栈顶）', '0x' + (0x8000 - 8 * snap.rsp).toString(16).toUpperCase()],
        ['rbp（帧基址）', '0x' + (0x8000 - 8 * snap.rbp).toString(16).toUpperCase()],
        ['栈中单元数', String(snap.cells.length)]
      ]);
    }
    UI.transport(ctrl, { total: steps.length, onChange: i => { k = i; render(); } });
    render();
    return s;
  };

})(window);
