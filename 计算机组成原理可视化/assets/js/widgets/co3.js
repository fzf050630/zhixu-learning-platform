/* ============================================================
   co3.js — 第3章 存储系统 可视化组件
   memHierarchy：存储器层次    mainMemExpand：位/字扩展
   cacheMapping：映射与地址划分 cacheSim：Cache 命中模拟
   virtualMem：页式地址转换
   memoryChip：存储芯片的位 / 字 / 字位同时扩展与容量计算
   diskAccess：磁盘存取时间（寻道 + 旋转延迟 + 传输）
   cacheReplace：FIFO / LRU / CLOCK 替换算法命中对比
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const B = global.Bits;
  const G = D.G, C = UI.C;

  /* ---------- 存储器层次结构 ---------- */
  W.memHierarchy = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const tiers = [
      { name: '寄存器', cap: '数百 B', t: '0.1~0.3 ns', cost: 1, speed: 1, color: '#BC3B34' },
      { name: 'Cache', cap: '几 MB', t: '1~10 ns', cost: 0.7, speed: 0.85, color: '#B65A17' },
      { name: '主存', cap: '几 GB', t: '50~100 ns', cost: 0.35, speed: 0.55, color: '#1F6F63' },
      { name: '外存 (SSD)', cap: '几百 GB', t: '几十 µs', cost: 0.15, speed: 0.3, color: '#5B4BB5' },
      { name: '外存 (磁盘)', cap: '几 TB', t: '几 ms', cost: 0.05, speed: 0.12, color: '#0E6C7A' }
    ];
    let idx = -1;

    function draw() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cx = p.w / 2, top = 16, bottom = p.h - 30, maxW = p.w - 60;
        const stepY = (bottom - top) / tiers.length;
        tiers.forEach((t, i) => {
          const y = top + i * stepY;
          const w = maxW * (1 - i * 0.13);
          const on = idx === i;
          G.box(ctx, cx - w / 2, y, w, stepY - 8, {
            fill: D.withAlpha(t.color, on ? 0.28 : 0.14),
            stroke: on ? t.color : D.withAlpha(t.color, 0.55), width: on ? 2 : 1.2, radius: 8
          });
          G.label(ctx, cx, y + (stepY - 8) / 2 - 8, t.name, { size: 13, weight: 700, color: t.color });
          G.label(ctx, cx, y + (stepY - 8) / 2 + 9, `容量 ${t.cap}　·　访问 ${t.t}`, { size: 11, color: T['--ink-2'] });
        });
        G.label(ctx, 16, p.h - 12, '↑ 越快、越小、越贵', { align: 'left', size: 11, color: T['--ink-3'] });
        G.label(ctx, p.w - 16, p.h - 12, '越大、越慢、越便宜 ↓', { align: 'right', size: 11, color: T['--ink-3'] });
      });
      scene.render();
    }
    const t = UI.transport(ctrl, { total: tiers.length, onChange: i => { idx = i; draw(); } });
    draw();
    UI.note(host, '层次结构的目标：用接近最快层的速度，获得接近最慢层的容量与价格。数据逐级调入，利用程序访问的局部性。');
    return s;
  };

  /* ---------- 主存容量扩展 ---------- */
  W.mainMemExpand = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { chipW: 1, chipB: 8, tarW: 4, tarB: 32, mode: 'all' };
    // chip: 1K×8；target: 4K×32

    const opts = [{ label: '集成示例', value: 'all' }, { label: '只看位扩展', value: 'bit' }, { label: '只看字扩展', value: 'word' }];
    UI.seg(ctrl, opts, v => { state.mode = v; render(); }, 0);
    UI.slider(ctrl, { label: '目标字数', min: 1, max: 8, step: 1, value: 4, fmt: v => v + 'K', onInput: v => { state.tarW = v; render(); }, value: 4 });
    UI.slider(ctrl, { label: '目标字长', min: 8, max: 64, step: 8, value: 32, fmt: v => v + ' 位', onInput: v => { state.tarB = v; render(); } });

    function render() {
      const wordExt = state.tarW / state.chipW;      // 字扩展倍数
      const bitExt = state.tarB / state.chipB;       // 位扩展倍数
      const total = wordExt * bitExt;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cols = Math.min(wordExt, 4), rows = Math.ceil(total / cols);
        const cw = Math.min(96, (p.w - 60) / cols), ch = 46;
        const startX = (p.w - cols * cw) / 2 + 6;
        for (let i = 0; i < total; i++) {
          const r = Math.floor(i / cols), c = i % cols;
          const x = startX + c * cw, y = 60 + r * (ch + 14);
          const grpColor = cols > 1 ? (c % 2 ? T['--purple'] : T['--brand']) : T['--brand'];
          G.box(ctx, x, y, cw - 10, ch, {
            fill: D.withAlpha(grpColor, 0.14), stroke: D.withAlpha(grpColor, 0.6), radius: 7
          });
          G.label(ctx, x + (cw - 10) / 2, y + ch / 2 - 7, `芯片 ${i + 1}`, { size: 11.5, weight: 700, color: grpColor });
          G.label(ctx, x + (cw - 10) / 2, y + ch / 2 + 9, `${state.chipW}K×${state.chipB}`, { size: 10, color: T['--ink-3'], mono: true });
          if (wordExt > 1) G.label(ctx, x + (cw - 10) / 2, y - 8, `第 ${c + 1} 字组`, { size: 9.5, color: T['--ink-3'] });
        }
        G.label(ctx, p.w / 2, 26, `目标：${state.tarW}K × ${state.tarB} 位　·　需要 ${wordExt}（字扩展）× ${bitExt}（位扩展）= ${total} 片 ${state.chipW}K×${state.chipB} 芯片`, { size: 12, weight: 700, color: T['--ink'] });
        const note = state.mode === 'bit'
          ? '位扩展：同一地址选中所有芯片，各芯片提供部分数据位，共用地址线，数据线拼接。'
          : state.mode === 'word'
            ? '字扩展：地址高位经译码器片选不同芯片组，同一时刻只有一组工作。'
            : `位扩展：${bitExt} 片并联，数据线拼接为 ${state.tarB} 位；字扩展：${wordExt} 个字组由高位地址片选。`;
        G.box(ctx, 16, p.h - 52, p.w - 32, 40, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, p.w / 2, p.h - 32, note, { size: 11, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['位扩展倍数', bitExt + ' 倍'],
        ['字扩展倍数', wordExt + ' 倍'],
        ['所需芯片', total + ' 片'],
        ['总容量', (state.tarW) + 'K × ' + state.tarB + ' 位 = ' + (state.tarW * state.tarB / 8) + ' KB']
      ]);
    }
    render();
    return s;
  };

  /* ---------- Cache 映射与地址划分 ---------- */
  W.cacheMapping = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'direct', cacheKB: 4, blockB: 16, ways: 4, addrBits: 32 };

    UI.seg(ctrl, [
      { label: '直接映射', value: 'direct' },
      { label: '全相联', value: 'fully' },
      { label: '组相联', value: 'set' }
    ], v => { state.mode = v; render(); }, 0);
    UI.slider(ctrl, { label: 'Cache 容量', min: 1, max: 32, step: 1, value: state.cacheKB, fmt: v => v + ' KB', onInput: v => { state.cacheKB = v; render(); } });
    UI.slider(ctrl, { label: '块大小', min: 4, max: 64, step: 4, value: state.blockB, fmt: v => v + ' B', onInput: v => { state.blockB = v; render(); } });
    UI.slider(ctrl, { label: '组相联路数', min: 2, max: 16, step: 2, value: state.ways, fmt: v => v + ' 路', onInput: v => { state.ways = v; render(); } });

    function model() {
      const cacheBytes = state.cacheKB * 1024;
      const blocks = cacheBytes / state.blockB;      // 总行数
      const offset = Math.log2(state.blockB);
      let index, tag, sets = blocks, ways = 1, lines = blocks;
      if (state.mode === 'direct') { index = Math.log2(blocks); }
      else if (state.mode === 'fully') { index = 0; }
      else { ways = state.ways; sets = Math.max(1, blocks / ways); index = Math.log2(sets); }
      tag = state.addrBits - index - offset;
      return { blocks, offset, index, tag, sets, ways, lines };
    }

    function render() {
      const m = model();
      const groups = [];
      if (m.tag > 0) groups.push({ name: '标记 tag', bits: m.tag, color: C('--red'), range: `${state.addrBits - 1} ─ ${m.index + m.offset}` });
      if (m.index > 0) groups.push({ name: state.mode === 'direct' ? '行号/索引' : '组号', bits: m.index, color: C('--brand'), range: `${m.index + m.offset - 1} ─ ${m.offset}` });
      groups.push({ name: '块内地址', bits: m.offset, color: C('--teal'), range: `${m.offset - 1} ─ 0` });

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, p.w / 2, 16, `主存地址 ${state.addrBits} 位划分（${state.blockB} B/块）`, { size: 12.5, weight: 700, color: T['--ink'] });
        G.bits(ctx, 16, 48, p.w - 32, 52, { groups, valueSize: 12, nameSize: 11, rangeSize: 10 });

        const info = [
          ['Cache 行数', `${m.lines} 行 = ${state.cacheKB} KB ÷ ${state.blockB} B`],
          ['映射结构', state.mode === 'direct' ? '每块只能放入唯一行：行号 = 主存块号 mod 行数' : state.mode === 'fully' ? '任意块可放入任意行，需比较整个 tag' : `${m.sets} 组 × ${m.ways} 路，组号 = 主存块号 mod 组数`],
          ['tag 位数', `${m.tag} 位（= ${state.addrBits} − ${m.index} − ${m.offset}）`],
          ['需要比较的位数', state.mode === 'direct' ? '1 个 tag（无需选择）' : state.mode === 'fully' ? `${m.lines} 个 tag 并行比较` : `${m.ways} 个 tag 并行比较`]
        ];
        info.forEach((r, i) => {
          const y = 132 + i * 30;
          G.box(ctx, 16, y, p.w - 32, 24, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
          G.label(ctx, 28, y + 12, r[0], { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
          ctx.save(); ctx.fillStyle = T['--ink-2']; ctx.font = `600 11px ${D.FONT_MONO}`;
          ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(r[1], p.w - 28, y + 12); ctx.restore();
        });
      });
      scene.render();
      UI.readout(out, [
        ['tag', m.tag + ' 位'], ['index/组号', m.index + ' 位'], ['块内地址', m.offset + ' 位'],
        ['总行数', m.lines + ' 行'], ['组数', m.sets]
      ]);
    }
    render();
    return s;
  };

  /* ---------- Cache 访问模拟 ---------- */
  W.cacheSim = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { seq: '0,4,16,4,32,4,16,64', blockWords: 4, lines: 4 };
    const blocks = [];  // 每个 cache 行当前保存的主存块号
    for (let i = 0; i < 4; i++) blocks.push(null);

    UI.note(host, '输入按字编址的主存地址序列（逗号分隔）。块大小 = 4 字，Cache 4 行，采用直接映射：行号 = 主存块号 mod 4。');
    const inp = UI.text(ctrl, { label: '访问序列', value: state.seq, width: 240 });
    inp.input.addEventListener('input', () => { state.seq = inp.value; run(); });

    function run() {
      const seq = state.seq.split(/[,，\s]+/).map(x => parseInt(x, 10)).filter(v => isFinite(v) && v >= 0);
      const lines = [], log = [];
      for (let i = 0; i < state.lines; i++) lines.push(null);
      let hit = 0;
      seq.forEach(addr => {
        const blk = Math.floor(addr / state.blockWords);
        const line = blk % state.lines;
        const isHit = lines[line] === blk;
        if (isHit) hit++;
        lines[line] = blk;
        log.push({ addr, blk, line, hit: isHit });
      });
      const rate = seq.length ? hit / seq.length : 0;
      const cur = log[log.length - 1];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 访问序列
        G.label(ctx, 16, 16, '访问序列', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const per = Math.min(34, (p.w - 40) / Math.max(1, log.length));
        log.forEach((l, i) => {
          const x = 16 + i * per;
          G.box(ctx, x, 28, per - 4, 26, {
            fill: D.withAlpha(l.hit ? T['--green'] : T['--red'], 0.16),
            stroke: D.withAlpha(l.hit ? T['--green'] : T['--red'], 0.6), radius: 5
          });
          G.label(ctx, x + (per - 4) / 2, 41, String(l.addr), { size: Math.min(12, per - 8), weight: 700, color: l.hit ? T['--green'] : T['--red'], mono: true });
        });
        // Cache 行
        G.label(ctx, 16, 74, 'Cache 行', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        for (let i = 0; i < state.lines; i++) {
          const y = 90 + i * 30;
          const act = cur && cur.line === i;
          G.box(ctx, 70, y, p.w - 70 - 90, 24, {
            fill: act ? D.withAlpha(T['--brand'], 0.14) : T['--card-2'],
            stroke: act ? T['--brand'] : T['--line'], radius: 6
          });
          G.label(ctx, 40, y + 12, `行 ${i}`, { size: 11.5, weight: 700, color: T['--ink-2'], mono: true });
          const last = log.filter(l => l.line === i).pop();
          G.label(ctx, 80, y + 12, last ? `主存块 ${last.blk}（地址 ${last.blk * state.blockWords}~${last.blk * state.blockWords + state.blockWords - 1}）` : '空', {
            align: 'left', size: 11, color: last ? T['--ink'] : T['--ink-3'], mono: false
          });
        }
      });
      scene.render();
      UI.readout(out, [
        ['访问次数', String(seq.length)],
        ['命中次数', String(hit)],
        ['命中率', UI.pct(rate)],
        ['最后行', cur ? '行 ' + cur.line : '—']
      ]);
    }
    run();
    return s;
  };

  /* ---------- 虚拟存储器地址转换 ---------- */
  W.virtualMem = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { va: 0x00501A2C, pageKB: 4, pt: [5, 9, 2, 12, 0, 3, 7, 1, 14, 6] };
    // 页表：虚页号 -> 物理页框号（部分）

    UI.note(host, '页式虚拟存储器：虚拟地址 = 虚页号 + 页内偏移；硬件用页表把虚页号翻译为物理页框号。TLB 缓存最近的页表项。');
    const inp = UI.number(ctrl, { label: '虚拟地址(十进制)', value: state.va, min: 0, max: 0xFFFFFF, step: 1, width: 130 });
    inp.onChange(v => { state.va = v; render(); });

    function render() {
      const pageBytes = state.pageKB * 1024;
      const offsetBits = Math.log2(pageBytes);
      const va = state.va >>> 0;
      const vpn = Math.floor(va / pageBytes);
      const offset = va % pageBytes;
      const pfn = state.pt[vpn % state.pt.length];
      const pa = pfn * pageBytes + offset;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const bits = B.toBits(va, 32);
        const vpnBits = bits.slice(0, 32 - offsetBits);
        const offBits = bits.slice(32 - offsetBits);
        G.label(ctx, p.w / 2, 16, '虚拟地址', { size: 12, weight: 700, color: T['--ink'] });
        G.bits(ctx, 16, 40, p.w - 32, 46, {
          groups: [
            { name: '虚页号 VPN', value: B.group(vpnBits, 4), bits: vpnBits.length, color: T['--brand'], range: '31 ─ ' + offsetBits },
            { name: '页内偏移', value: B.group(offBits, 4), bits: offBits.length, color: T['--teal'], range: (offsetBits - 1) + ' ─ 0' }
          ], valueSize: 11, alpha: 0.18
        });
        // 页表
        G.label(ctx, 16, 106, `页表（${state.pageKB} KB/页）`, { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const cols = 4, cw = (p.w - 40) / cols;
        state.pt.forEach((pfn2, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const x = 20 + c * cw, y = 120 + r * 30;
          const act = i === vpn % state.pt.length;
          G.box(ctx, x, y, cw - 10, 24, {
            fill: act ? D.withAlpha(T['--brand'], 0.16) : T['--card-2'],
            stroke: act ? T['--brand'] : T['--line'], radius: 6
          });
          G.label(ctx, x + 12, y + 12, `页 ${i}`, { align: 'left', size: 10.5, color: T['--ink-3'], mono: true });
          G.label(ctx, x + cw - 24, y + 12, `→ 框 ${pfn2}`, { align: 'right', size: 11, weight: act ? 800 : 600, color: act ? T['--brand'] : T['--ink-2'], mono: true });
        });
        // 物理地址
        const paBits = B.toBits(pa, 32);
        G.label(ctx, p.w / 2, p.h - 54, '物理地址', { size: 12, weight: 700, color: T['--ink'] });
        G.bits(ctx, 16, p.h - 42, p.w - 32, 30, {
          groups: [
            { name: '物理页框号', value: B.group(paBits.slice(0, 32 - offsetBits), 4), bits: 32 - offsetBits, color: T['--purple'] },
            { name: '页内偏移（不变）', value: B.group(offBits, 4), bits: offsetBits, color: T['--teal'] }
          ], valueSize: 10, alpha: 0.18
        });
      });
      scene.render();
      UI.readout(out, [
        ['虚页号 VPN', vpn + '（' + B.group(B.toBits(vpn, 32 - offsetBits), 4) + '₂）'],
        ['页内偏移', offset + '（' + B.group(B.toBits(offset, offsetBits), 4) + '₂）'],
        ['物理页框号', pfn],
        ['物理地址', '0x' + pa.toString(16).toUpperCase().padStart(8, '0')]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 存储芯片扩展 ---------- */
  W.memoryChip = function (host) {
    const s = UI.shell(host, 380);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const chip = { words: 16, bits: 4 };          // 单片 16K × 4 位
    const state = { b: 2, w: 1 };

    UI.note(host, '用 16K×4 位芯片组成更大容量：<b>位扩展</b>——多片并联，地址线与片选共用、数据线拼接；<b>字扩展</b>——地址高位经译码器产生片选、数据线共用；<b>字位同时扩展</b>——先位扩展成组，再多组字扩展。');
    const seg = UI.seg(ctrl, [
      { label: '单片', value: 0 }, { label: '位扩展', value: 1 },
      { label: '字扩展', value: 2 }, { label: '字位同时扩展', value: 3 }
    ], v => {
      if (v === 0) { state.b = 1; state.w = 1; }
      else if (v === 1) { state.b = 2; state.w = 1; }
      else if (v === 2) { state.b = 1; state.w = 2; }
      else { state.b = 2; state.w = 2; }
      bS.set(state.b); wS.set(state.w);
      render();
    }, 3);
    const bS = UI.slider(ctrl, { label: '位扩展倍数', min: 1, max: 4, step: 1, value: state.b, fmt: v => '×' + v, onInput: v => { state.b = v; sync(); render(); } });
    const wS = UI.slider(ctrl, { label: '字扩展倍数', min: 1, max: 4, step: 1, value: state.w, fmt: v => '×' + v, onInput: v => { state.w = v; sync(); render(); } });
    function sync() {
      seg.set(state.b > 1 ? (state.w > 1 ? 3 : 1) : (state.w > 1 ? 2 : 0));
    }

    function render() {
      const b = state.b, w = state.w;
      const totalW = chip.words * w, totalBits = chip.bits * b;
      const bytes = totalW * 1024 * totalBits / 8;
      const modeName = b > 1 && w > 1 ? '字位同时扩展' : (b > 1 ? '位扩展' : (w > 1 ? '字扩展' : '单片工作'));
      const addrBits = Math.log2(w);
      const wantH = 46 + w * 40 + 150;
      if (scene.o.height !== wantH) scene.setHeight(wantH);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const top = 42, rowH = 40, chipH = 32;
        const rowX = w > 1 ? 100 : 16;
        G.label(ctx, p.w / 2, 16, `单片 ${chip.words}K × ${chip.bits} 位　→　目标 ${totalW}K × ${totalBits} 位 = ${(bytes / 1024).toFixed(0)} KB（${b * w} 片）`, { size: 12.5, weight: 700, color: T['--ink'] });
        G.label(ctx, p.w - 16, 16, modeName, { align: 'right', size: 11.5, weight: 700, color: T['--brand'] });

        const gx0 = rowX + 96;
        const cw = (p.w - 16 - gx0) / b;
        for (let r = 0; r < w; r++) {
          const y = top + r * rowH;
          G.box(ctx, rowX, y - 2, p.w - rowX - 16, chipH + 6, { fill: T['--card'], stroke: T['--line'], radius: 7 });
          G.label(ctx, rowX + 10, y + chipH / 2, `字组 ${r}`, { align: 'left', size: 10.5, weight: 700, color: T['--ink-2'] });
          G.label(ctx, rowX + 66, y + chipH / 2, w > 1 ? 'CS' + r : 'CS', { align: 'left', size: 10, weight: 700, color: T['--accent'], mono: true });
          for (let c = 0; c < b; c++) {
            const x = gx0 + c * cw;
            G.box(ctx, x + 4, y, cw - 10, chipH, { fill: D.withAlpha(T['--brand'], 0.14), stroke: D.withAlpha(T['--brand'], 0.6), radius: 6 });
            G.fitted(ctx, x + cw / 2 - 1, y + 11, '16K×4', cw - 20, { size: 11, weight: 700, color: T['--brand'], mono: true });
            G.fitted(ctx, x + cw / 2 - 1, y + 24, 'D' + (c * 4) + '~D' + (c * 4 + 3), cw - 20, { size: 9.5, color: T['--ink-3'], mono: true });
          }
        }

        if (w > 1) {
          G.box(ctx, 14, top - 36, 74, 26, { fill: D.withAlpha(T['--purple'], 0.14), stroke: D.withAlpha(T['--purple'], 0.6), radius: 6 });
          G.label(ctx, 51, top - 23, '译码器', { size: 10.5, weight: 700, color: T['--purple'] });
          G.label(ctx, 51, top - 46, `A14~A${13 + addrBits}`, { size: 9.5, color: T['--purple'], mono: true });
          for (let r = 0; r < w; r++) {
            const y = top + r * rowH + chipH / 2;
            G.arrow(ctx, [[51, top - 9], [51, y], [rowX - 4, y]], { color: D.withAlpha(T['--purple'], 0.8), width: 1.3, head: 5 });
          }
        }

        const by = top + w * rowH + 14;
        G.box(ctx, 16, by, p.w - 32, 26, { fill: D.withAlpha(T['--teal'], 0.1), stroke: D.withAlpha(T['--teal'], 0.5), radius: 6 });
        G.label(ctx, 28, by + 13, `地址线 A0~A13（片内 14 位，各片共用）${w > 1 ? `；高 ${addrBits} 位 A14~A${13 + addrBits} 送译码器产生片选` : ''}`, { align: 'left', size: 10.5, color: T['--teal'] });
        G.box(ctx, 16, by + 32, p.w - 32, 26, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 6 });
        G.label(ctx, 28, by + 45, b > 1
          ? `数据线 D0~D${4 * b - 1}：${b} 片同时选中，各片贡献 4 位，拼接成 ${totalBits} 位`
          : `数据线 D0~D3：单片提供 4 位数据`, { align: 'left', size: 10.5, color: T['--green'] });
        G.box(ctx, 16, by + 64, p.w - 32, 62, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 28, by + 80, `目标容量 = 字数 × 字长 = ${totalW}K × ${totalBits} 位 = ${bytes / 1024} KB`, { align: 'left', size: 11, weight: 700, color: T['--ink'] });
        G.label(ctx, 28, by + 98, `所需芯片 = 位扩展 ${b} 片/组 × 字扩展 ${w} 组 = ${b * w} 片；每组容量 = ${chip.words}K × ${chip.bits * b} 位`, { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, 28, by + 116, `片选：${w > 1 ? '同一时刻只有一组 CS 有效，各组地址范围互不重叠' : '所有芯片片选同时有效（位扩展）'}`, { align: 'left', size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['扩展方式', modeName],
        ['位扩展倍数', '×' + b], ['字扩展倍数', '×' + w],
        ['所需芯片', (b * w) + ' 片'],
        ['总容量', `${totalW}K × ${totalBits} 位 = ${bytes / 1024} KB`]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 磁盘存取时间 ---------- */
  W.diskAccess = function (host) {
    const s = UI.shell(host, 372);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { rpm: 7200, seek: 8, spt: 64, tracks: 10000, kb: 4, k: 0 };

    UI.note(host, '磁盘存取时间 <b>= 寻道时间 + 旋转延迟 + 传输时间</b>；平均旋转延迟为转半圈的时间 1/(2r)，传输时间 = 读写字节数 ÷ 数据传输率，而传输率 = 每道字节数 × 每秒转数。');
    UI.slider(ctrl, { label: '转速', min: 3600, max: 15000, step: 300, value: state.rpm, fmt: v => v + ' rpm', onInput: v => { state.rpm = v; render(); } });
    UI.slider(ctrl, { label: '平均寻道时间', min: 2, max: 15, step: 0.5, value: state.seek, fmt: v => v.toFixed(1) + ' ms', onInput: v => { state.seek = v; render(); } });
    UI.slider(ctrl, { label: '每道扇区数', min: 8, max: 256, step: 8, value: state.spt, fmt: v => v + ' 个', onInput: v => { state.spt = v; render(); } });
    UI.slider(ctrl, { label: '每面磁道数', min: 1000, max: 20000, step: 1000, value: state.tracks, fmt: v => (v / 1000) + ' K', onInput: v => { state.tracks = v; render(); } });
    UI.slider(ctrl, { label: '读取数据量', min: 0.5, max: 64, step: 0.5, value: state.kb, fmt: v => v + ' KB', onInput: v => { state.kb = v; render(); } });
    const tr = UI.transport(ctrl, { total: 4, onChange: i => { state.k = i; render(); } });

    function render() {
      const r = state.rpm / 60;                       // 转/秒
      const TT = D.Theme.cache;
      const rot = 1000 / (2 * r);                     // 平均旋转延迟 ms
      const trackBytes = state.spt * 512;
      const rate = trackBytes * r;                     // B/s
      const bytes = state.kb * 1024;
      const trans = bytes / rate * 1000;
      const parts = [
        { name: '寻道时间', v: state.seek, c: TT['--brand'], note: '磁头移动到目标磁道' },
        { name: '旋转延迟', v: rot, c: TT['--purple'], note: '平均转半圈 1/(2r)' },
        { name: '传输时间', v: trans, c: TT['--green'], note: '数据量 ÷ 传输率' }
      ];
      const totalMs = parts.reduce((a, x) => a + x.v, 0);
      const cum = [0, parts[0].v, parts[0].v + parts[1].v, totalMs];
      const stage = Math.min(state.k, 3);

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 左侧磁盘示意
        const cx = 106, cyy = 168, R = 66;
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cyy, R, 0, D.TAU);
        ctx.fillStyle = T['--card-2']; ctx.fill();
        ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.4; ctx.stroke();
        [26, 40, 54, R].forEach((rr, i) => {
          const target = i === 2;
          ctx.beginPath(); ctx.arc(cx, cyy, rr, 0, D.TAU);
          ctx.strokeStyle = target ? D.withAlpha(T['--accent'], stage >= 1 ? 0.95 : 0.5) : D.withAlpha(T['--line-2'], 0.9);
          ctx.lineWidth = target ? 2.4 : 1;
          ctx.stroke();
        });
        ctx.beginPath(); ctx.arc(cx, cyy, 10, 0, D.TAU);
        ctx.fillStyle = D.withAlpha(T['--ink-3'], 0.5); ctx.fill();
        // 目标扇区
        const ang = stage >= 2 ? -Math.PI / 2 : -Math.PI / 2 + 1.15;
        ctx.beginPath(); ctx.arc(cx, cyy, 54, ang - 0.3, ang + 0.3);
        ctx.arc(cx, cyy, 40, ang + 0.3, ang - 0.3, true);
        ctx.closePath();
        ctx.fillStyle = D.withAlpha(T['--accent'], stage >= 2 ? 0.5 : 0.28); ctx.fill();
        ctx.restore();
        // 磁头臂
        const armY = stage === 0 ? 30 : 64;
        ctx.save();
        ctx.strokeStyle = T['--brand']; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(cx + R + 30, cyy + 46); ctx.lineTo(cx + 30, cyy + armY - 24); ctx.stroke();
        ctx.restore();
        G.dot(ctx, cx + 30, cyy + armY - 24, 5, T['--brand'], true);
        if (stage === 0) G.arrow(ctx, [[cx + R + 12, cyy - 30], [cx + 34, cyy + 8]], { color: D.withAlpha(T['--red'], 0.8), dash: [4, 3], width: 1.4, head: 6 });
        if (stage === 1) G.arrow(ctx, [[cx - 60, cyy - 60], [cx + 30, cyy - 62]], { color: T['--purple'], width: 1.6, head: 6 });
        G.label(ctx, cx, cyy + R + 26, '就绪后从目标扇区连续读出', { size: 9.5, color: T['--ink-3'] });

        // 右侧堆叠时间条
        const bx = 214, bwe = p.w - bx - 24;
        G.label(ctx, bx, 20, '存取时间堆叠（按当前参数）', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        let x = bx;
        parts.forEach((pt, i) => {
          const sw = bwe * pt.v / totalMs;
          const on = i <= stage;
          G.box(ctx, x, 32, sw - 1, 34, { fill: D.withAlpha(pt.c, on ? 0.6 : 0.16), stroke: D.withAlpha(pt.c, on ? 0.9 : 0.4), width: on ? 1.4 : 1, radius: 4 });
          if (sw > 56) G.label(ctx, x + sw / 2, 49, pt.name, { size: 10.5, weight: 700, color: on ? '#fff' : T['--ink-2'] });
          x += sw;
        });
        const mk = bx + bwe * cum[Math.min(stage + 1, 3)] / totalMs;
        ctx.save();
        ctx.strokeStyle = T['--red']; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(mk, 26); ctx.lineTo(mk, 72); ctx.stroke();
        ctx.restore();
        G.label(ctx, Math.min(mk, p.w - 40), 80, `累计 ${cum[Math.min(stage + 1, 3)].toFixed(2)} ms`, { size: 10, weight: 700, color: T['--red'], mono: true });

        parts.forEach((pt, i) => {
          const y = 98 + i * 30;
          G.box(ctx, bx, y, bwe, 24, { fill: i === stage ? D.withAlpha(pt.c, 0.14) : T['--card-2'], stroke: i === stage ? D.withAlpha(pt.c, 0.7) : T['--line'], radius: 6 });
          G.label(ctx, bx + 10, y + 12, pt.name, { align: 'left', size: 11, weight: 700, color: pt.c });
          G.label(ctx, bx + 150, y + 12, pt.v.toFixed(3) + ' ms', { align: 'left', size: 11, weight: 700, color: T['--ink'], mono: true });
          G.label(ctx, p.w - 36, y + 12, UI.pct(pt.v / totalMs), { align: 'right', size: 10.5, color: T['--ink-3'], mono: true });
        });

        G.box(ctx, bx, 196, bwe, 64, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.lines(ctx, bx + 12, 212, [
          `数据传输率 = ${state.spt} × 512 B × ${r.toFixed(0)} 转/s ≈ ${(rate / 1e6).toFixed(2)} MB/s`,
          `每道容量 = ${state.spt} × 512 B = ${(trackBytes / 1024).toFixed(1)} KB　·　每面磁道数 ${state.tracks / 1000} K`,
          `非格式化容量 ≈ 磁道数 × 每道字节数 × 2 面 ≈ ${(state.tracks * trackBytes * 2 / 1e6).toFixed(0)} MB`
        ], { align: 'left', size: 10.5, lineHeight: 19, color: T['--ink-2'] });

        G.box(ctx, bx, 272, bwe, 62, { fill: D.withAlpha(T['--accent'], 0.08), stroke: D.withAlpha(T['--accent'], 0.45), radius: 8 });
        G.lines(ctx, bx + 12, 288, [
          `${state.kb} KB：寻道 ${parts[0].v.toFixed(2)} + 旋转 ${parts[1].v.toFixed(2)} + 传输 ${parts[2].v.toFixed(3)}`,
          `= ${totalMs.toFixed(3)} ms　·　平均旋转延迟 = 1/(2r) = 1/(2 × ${r.toFixed(0)}) s = ${rot.toFixed(3)} ms`
        ], { align: 'left', size: 10.5, lineHeight: 20, color: T['--ink-2'] });
        G.label(ctx, bx, 352, '硬盘是直接存取设备（DAM）；SSD 无机械寻道与旋转延迟，随机访问快', { align: 'left', size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前阶段', ['① 寻道', '② 旋转等待', '③ 传输数据', '④ 完成'][stage]],
        ['寻道 / 旋转 / 传输', `${state.seek.toFixed(1)} / ${rot.toFixed(2)} / ${trans.toFixed(3)} ms`],
        ['总存取时间', totalMs.toFixed(3) + ' ms'],
        ['旋转延迟占比', UI.pct(rot / totalMs)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 替换算法：FIFO / LRU / CLOCK ---------- */
  W.cacheReplace = function (host) {
    const s = UI.shell(host, 384);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { seq: '1,2,3,4,1,2,5,1,2,3,4,5', algo: 'lru', lines: 3, k: 0 };

    UI.note(host, '同一访问串、全相联 Cache：FIFO 替换最早调入的行；LRU 替换最久未被使用的行；CLOCK（二次机会）用使用位 + 指针循环扫描，命中置 1、缺行时把 1 清 0 后移。');
    const inp = UI.text(ctrl, { label: '访问序列（块号）', value: state.seq, width: 250 });
    inp.input.addEventListener('input', () => { state.seq = inp.value; buildTransport(); render(); });
    UI.seg(ctrl, [{ label: 'FIFO', value: 'fifo' }, { label: 'LRU', value: 'lru' }, { label: 'CLOCK', value: 'clock' }], v => {
      state.algo = v; buildTransport(); render();
    }, 1);
    UI.slider(ctrl, {
      label: 'Cache 行数', min: 2, max: 5, step: 1, value: state.lines, fmt: v => v + ' 行',
      onInput: v => { state.lines = v; buildTransport(); render(); }
    });

    function parseSeq() {
      return state.seq.split(/[,，\s]+/).map(x => parseInt(x, 10)).filter(v => isFinite(v) && v >= 0);
    }
    function sim(algo, seq, lines) {
      const st = new Array(lines).fill(null);
      const use = new Array(lines).fill(0);
      const last = new Array(lines).fill(-1);
      const q = [];
      let ptr = 0;
      const hist = [];
      seq.forEach((blk, t) => {
        let hit = false, line = -1, evict = null;
        if (algo === 'fifo') {
          line = st.indexOf(blk);
          if (line >= 0) hit = true;
          else {
            const free = st.indexOf(null);
            if (free >= 0) { line = free; q.push(free); }
            else { line = q.shift(); evict = st[line]; q.push(line); }
            st[line] = blk;
          }
        } else if (algo === 'lru') {
          line = st.indexOf(blk);
          if (line >= 0) hit = true;
          else {
            line = st.indexOf(null);
            if (line >= 0) { st[line] = blk; }
            else {
              let old = 0;
              st.forEach((v, i) => { if (last[i] < last[old]) old = i; });
              line = old; evict = st[line]; st[line] = blk;
            }
          }
          last[line] = t;
        } else {
          line = st.indexOf(blk);
          if (line >= 0) { hit = true; use[line] = 1; }
          else {
            line = st.indexOf(null);
            if (line < 0) {
              let guard = 0;
              while (use[ptr] === 1 && guard < lines * 4) { use[ptr] = 0; ptr = (ptr + 1) % lines; guard++; }
              line = ptr; evict = st[line]; ptr = (ptr + 1) % lines;
            }
            st[line] = blk; use[line] = 1;
          }
        }
        hist.push({ blk, hit, line, evict, st: st.slice(), use: use.slice(), ptr });
      });
      return hist;
    }

    let total = 12;
    function buildTransport() {
      const old = ctrl.querySelector('.transport-viz');
      if (old) old.remove();
      const seq = parseSeq();
      total = Math.max(1, seq.length);
      state.k = 0;
      UI.transport(ctrl, { total: total, onChange: i => { state.k = i; render(); } });
    }
    buildTransport();

    function render() {
      const seq = parseSeq();
      const lines = state.lines;
      const all = { fifo: sim('fifo', seq, lines), lru: sim('lru', seq, lines), clock: sim('clock', seq, lines) };
      const cur = all[state.algo] || [];
      const idx = Math.min(state.k, cur.length - 1);
      const snap = cur[idx];
      const rate = a => {
        if (!seq.length) return 0;
        return a.filter(x => x.hit).length / seq.length;
      };
      const L = Math.max(1, cur.length);
      const x0 = 60;
      const wantH = lines * 26 + 258;
      if (scene.o.height !== wantH) scene.setHeight(wantH);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const cww = Math.min(32, (p.w - x0 - 20) / L);
        G.label(ctx, 14, 14, '访问序列（块号）', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        cur.forEach((h, i) => {
          const x = x0 + i * cww;
          const on = i === idx;
          const col = h.hit ? T['--green'] : T['--red'];
          G.box(ctx, x, 22, cww - 2, 24, {
            fill: on ? D.withAlpha(col, 0.32) : T['--card-2'],
            stroke: on ? col : D.withAlpha(col, 0.45), width: on ? 1.8 : 1, radius: 4
          });
          G.label(ctx, x + (cww - 2) / 2, 34, String(h.blk), { size: Math.min(11.5, cww - 6), weight: 700, color: on ? col : T['--ink-2'], mono: true });
        });
        G.label(ctx, x0 + L * cww + 4, 34, '　命中=绿，缺失=红', { align: 'left', size: 9.5, color: T['--ink-3'] });

        G.label(ctx, 14, 62, `Cache 各行动态（${['FIFO', 'LRU', 'CLOCK'][['fifo', 'lru', 'clock'].indexOf(state.algo)]}）`, { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        const ty = 74;
        for (let i = 0; i < lines; i++) {
          const y = ty + i * 26;
          G.label(ctx, 14, y + 12, '行' + i + (state.algo === 'clock' && snap && snap.ptr === i ? '←' : ''), { align: 'left', size: 10, weight: 700, color: T['--ink-3'], mono: true });
          for (let t2 = 0; t2 < L; t2++) {
            const v = cur[t2] ? cur[t2].st[i] : null;
            const x = x0 + t2 * cww;
            const isNow = t2 === idx;
            const changed = t2 === idx && snap && snap.line === i && !snap.hit;
            G.box(ctx, x, y, cww - 2, 22, {
              fill: changed ? D.withAlpha(T['--red'], 0.22) : (isNow ? D.withAlpha(T['--brand'], 0.12) : T['--card-2']),
              stroke: isNow ? D.withAlpha(T['--brand'], 0.6) : T['--line'], width: isNow ? 1.4 : 1, radius: 4
            });
            if (v !== null && v !== undefined) G.label(ctx, x + (cww - 2) / 2, y + 11, String(v), { size: Math.min(11, cww - 6), weight: 700, color: changed ? T['--red'] : T['--ink-2'], mono: true });
          }
        }

        G.label(ctx, 14, ty + lines * 26 + 12, '各算法命中率（同一访问串）', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        const by = ty + lines * 26 + 24;
        const names = [['fifo', 'FIFO', T['--brand']], ['lru', 'LRU', T['--purple']], ['clock', 'CLOCK', T['--teal']]];
        names.forEach((nm, i) => {
          const y = by + i * 28;
          const hb = rate(all[nm[0]]);
          const on = state.algo === nm[0];
          G.label(ctx, 14, y + 12, nm[1], { align: 'left', size: 11, weight: 700, color: nm[2] });
          G.box(ctx, 66, y, p.w - 66 - 96, 22, { fill: T['--bg-soft'], stroke: null, radius: 5 });
          G.box(ctx, 66, y, Math.max(3, (p.w - 66 - 96) * hb), 22, { fill: D.withAlpha(nm[2], on ? 0.85 : 0.45), stroke: null, radius: 5 });
          G.label(ctx, p.w - 24, y + 11, hb.toFixed(3) + '　' + (all[nm[0]].filter(x => x.hit).length) + ' 命中', { align: 'right', size: 10, weight: on ? 700 : 600, color: on ? nm[2] : T['--ink-3'], mono: true });
        });

        const descs = {
          fifo: 'FIFO：替换最早调入的行（队列顺序），实现简单，但可能换出常用块。',
          lru: 'LRU：替换最久未被访问的行（按最近使用时间），命中率高，需记录访问历史。',
          clock: 'CLOCK：环形指针 + 使用位，命中置 1；缺行时遇 1 清 0 后移，遇 0 则替换，是 LRU 的近似。'
        };
        G.box(ctx, 14, by + 90, p.w - 28, 46, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.fitted(ctx, 26, by + 113, descs[state.algo], p.w - 52, { align: 'left', size: 10.5, weight: 500, color: T['--ink-2'] });
        G.label(ctx, p.w / 2, p.h - 8, 'LRU 与 CLOCK 不会出现 FIFO 的 Belady 异常（增加行数命中率反而下降）', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      const hits = cur.filter(x => x.hit).length;
      UI.readout(out, [
        ['访问次数', String(seq.length)],
        ['命中 / 缺失', hits + ' / ' + (seq.length - hits)],
        ['命中率', UI.pct(seq.length ? hits / seq.length : 0)],
        ['FIFO / LRU / CLOCK', [rate(all.fifo), rate(all.lru), rate(all.clock)].map(v => v.toFixed(3)).join(' / ')],
        ['当前访问', snap ? `块 ${snap.blk} ${snap.hit ? '命中行 ' + snap.line : (snap.evict !== null ? '被替换块 ' + snap.evict : '装入空行')}` : '—']
      ]);
    }
    render();
    return s;
  };

})(window);
