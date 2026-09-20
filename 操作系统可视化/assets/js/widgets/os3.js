/* ============================================================
   os3.js — 第3章 内存管理 可视化组件
   memAlloc：连续分配（首次/最佳/最坏适应）
   paging：分页 / 分段地址转换
   pageReplace：页面置换算法（FIFO / LRU / OPT）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 连续分配 ---------- */
  W.memAlloc = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const jobs = [
      { n: 'A', size: 120 }, { n: 'B', size: 200 }, { n: 'C', size: 90 }, { n: 'D', size: 160 }
    ];
    const state = { algo: 'first', step: jobs.length, total: 1000 };
    UI.seg(ctrl, [{ label: '首次适应', value: 'first' }, { label: '最佳适应', value: 'best' }, { label: '最坏适应', value: 'worst' }], v => { state.algo = v; render(); }, 0);
    const t = UI.transport(ctrl, { total: jobs.length + 1, onChange: k => { state.step = k; render(); } });

    function allocate() {
      const free = [{ start: 0, size: state.total }];
      const occupied = [];
      const applied = jobs.slice(0, state.step);
      applied.forEach(j => {
        let idx = -1;
        if (state.algo === 'first') idx = free.findIndex(f => f.size >= j.size);
        else if (state.algo === 'best') { let best = Infinity; free.forEach((f, k) => { if (f.size >= j.size && f.size < best) { best = f.size; idx = k; } }); }
        else { let worst = -1; free.forEach((f, k) => { if (f.size >= j.size && f.size > worst) { worst = f.size; idx = k; } }); }
        if (idx < 0) return;
        const f = free[idx];
        occupied.push({ name: j.n, start: f.start, size: j.size });
        if (f.size === j.size) free.splice(idx, 1);
        else free.splice(idx, 1, { start: f.start + j.size, size: f.size - j.size });
      });
      const internal = occupied.reduce((a, o, k) => {
        const j = jobs.find(x => x.n === o.name);
        return a;
      }, 0);
      return { free, occupied };
    }

    function render() {
      const { free, occupied } = allocate();
      const totalFree = free.reduce((a, f) => a + f.size, 0);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w - 40, x0 = 20, y = 40, h = 54;
        let cx = x0;
        // 按地址排序绘制
        const blocks = [];
        free.forEach(f => blocks.push({ start: f.start, size: f.size, name: '空闲', free: true }));
        occupied.forEach(o => blocks.push({ start: o.start, size: o.size, name: o.name, free: false }));
        blocks.sort((a, b) => a.start - b.start);
        blocks.forEach(b => {
          const bw = b.size / state.total * w;
          const color = b.free ? T['--ink-3'] : ([T['--brand'], T['--purple'], T['--accent'], T['--teal']][b.name.charCodeAt(0) - 65] || T['--brand']);
          G.box(ctx, cx, y, bw, h, {
            fill: b.free ? T['--card-2'] : D.withAlpha(color, 0.22),
            stroke: b.free ? T['--line'] : color, width: b.free ? 1 : 1.6, radius: 3
          });
          if (bw > 26) G.fitted(ctx, cx + bw / 2, y + h / 2, `${b.name}${b.free ? '' : '(' + b.size + ')'}`, bw - 6, { size: 12, weight: 700, color: b.free ? T['--ink-3'] : color, mono: true });
          G.label(ctx, cx, y + h + 12, String(b.start), { size: 9, color: T['--ink-3'], mono: true });
          cx += bw;
        });
        G.label(ctx, x0, 24, '内存空间（0 ~ ' + state.total + '）', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        // 结果
        const failed = state.step >= jobs.length ? '全部装完' : '等待装填 ' + jobs[state.step].n;
        G.box(ctx, 20, p.h - 84, p.w - 40, 30, { fill: T['--card-2'], stroke: T['--line'], radius: 7 });
        G.label(ctx, 32, p.h - 69, `已分配：${occupied.map(o => o.name).join('、') || '无'}　·　空闲区 ${free.length} 个，总空闲 ${totalFree}`, { align: 'left', size: 11, color: T['--ink-2'] });
        G.box(ctx, 20, p.h - 48, p.w - 40, 30, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 7 });
        G.label(ctx, 32, p.h - 33, `下一步：${failed}`, { align: 'left', size: 11.5, weight: 700, color: T['--brand'] });
      });
      scene.render();
      UI.readout(out, [
        ['算法', state.algo === 'first' ? '首次适应' : state.algo === 'best' ? '最佳适应' : '最坏适应'],
        ['已装入', occupied.map(o => o.n).join(' ') || '无'],
        ['空闲分区数', String(free.length)],
        ['最大空闲', String(Math.max(...free.map(f => f.size), 0))]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 分页 / 分段地址转换 ---------- */
  W.paging = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { va: 0x2A3C, pageKB: 4, mode: 'paging', seg: [0, 1, 2] };
    const pageTable = [5, 2, 8, 1, 7, 3, 0, 9];   // 页号 -> 页框
    const segTable = [{ base: 0x1000, len: 0x2000 }, { base: 0x5000, len: 0x1000 }, { base: 0x8000, len: 0x3000 }];

    UI.seg(ctrl, [{ label: '基本分页', value: 'paging' }, { label: '基本分段', value: 'seg' }], v => { state.mode = v; render(); }, 0);
    const inp = UI.number(ctrl, { label: '逻辑地址(十进制)', value: state.va, min: 0, max: 0xFFFFFF, step: 1, width: 120 });
    inp.onChange(v => { state.va = v; render(); });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        if (state.mode === 'paging') {
          const pageBytes = state.pageKB * 1024;
          const offBits = Math.log2(pageBytes);
          const va = state.va >>> 0;
          const pn = Math.floor(va / pageBytes), off = va % pageBytes;
          const frame = pageTable[pn % pageTable.length];
          const pa = frame * pageBytes + off;
          G.label(ctx, w / 2, 18, `逻辑地址 → 物理地址（页大小 ${state.pageKB} KB）`, { size: 12, weight: 700, color: T['--ink'] });
          G.bits(ctx, 20, 40, w - 40, 46, {
            groups: [
              { name: '页号 P', value: pn, bits: 16 - offBits, color: T['--brand'], range: '15 ─ ' + offBits },
              { name: '页内偏移 W', value: off, bits: offBits, color: T['--teal'], range: (offBits - 1) + ' ─ 0' }
            ], valueSize: 12
          });
          // 页表
          G.label(ctx, 20, 106, '页表', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
          const cw = (w - 40) / pageTable.length;
          pageTable.forEach((f, k) => {
            const on = k === pn % pageTable.length;
            G.box(ctx, 20 + k * cw, 118, cw - 6, 40, { fill: on ? D.withAlpha(T['--brand'], 0.16) : T['--card-2'], stroke: on ? T['--brand'] : T['--line'], radius: 6 });
            G.label(ctx, 20 + k * cw + (cw - 6) / 2, 131, '页 ' + k, { size: 10, color: T['--ink-3'], mono: true });
            G.label(ctx, 20 + k * cw + (cw - 6) / 2, 147, '→ 框 ' + f, { size: 11, weight: on ? 800 : 600, color: on ? T['--brand'] : T['--ink-2'], mono: true });
          });
          G.box(ctx, 20, p.h - 40, w - 40, 28, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 7 });
          G.label(ctx, 32, p.h - 26, `物理地址 = ${frame} × ${pageBytes} + ${off} = 0x${pa.toString(16).toUpperCase()}`, { align: 'left', size: 12, weight: 700, color: T['--green'], mono: true });
        } else {
          const sd = Math.floor(state.va / 0x1000);
          const off = state.va % 0x1000;
          const seg = sd % segTable.length;
          const t = segTable[seg];
          const pa = t.base + off;
          const ok = off < t.len;
          G.label(ctx, w / 2, 18, '逻辑地址 → 物理地址（段号 + 段内偏移）', { size: 12, weight: 700, color: T['--ink'] });
          G.bits(ctx, 20, 40, w - 40, 46, {
            groups: [
              { name: '段号 S', value: seg, bits: 4, color: T['--purple'] },
              { name: '段内偏移 W', value: off, bits: 12, color: T['--teal'] }
            ], valueSize: 12
          });
          G.label(ctx, 20, 106, '段表', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
          const cw = (w - 40) / segTable.length;
          segTable.forEach((sg, k) => {
            const on = k === seg;
            G.box(ctx, 20 + k * cw, 118, cw - 6, 40, { fill: on ? D.withAlpha(T['--purple'], 0.16) : T['--card-2'], stroke: on ? T['--purple'] : T['--line'], radius: 6 });
            G.label(ctx, 20 + k * cw + (cw - 6) / 2, 131, '段 ' + k, { size: 10, color: T['--ink-3'], mono: true });
            G.label(ctx, 20 + k * cw + (cw - 6) / 2, 147, `基址 0x${sg.base.toString(16).toUpperCase()} 长 0x${sg.len.toString(16).toUpperCase()}`, { size: 9.5, weight: on ? 700 : 500, color: on ? T['--purple'] : T['--ink-2'], mono: true });
          });
          G.box(ctx, 20, p.h - 40, w - 40, 28, {
            fill: D.withAlpha(ok ? T['--green'] : T['--red'], 0.1),
            stroke: D.withAlpha(ok ? T['--green'] : T['--red'], 0.5), radius: 7
          });
          G.label(ctx, 32, p.h - 26, ok ? `物理地址 = 段基址 0x${t.base.toString(16).toUpperCase()} + 偏移 0x${off.toString(16).toUpperCase()} = 0x${pa.toString(16).toUpperCase()}` : '段内偏移越界 → 越界中断', { align: 'left', size: 12, weight: 700, color: ok ? T['--green'] : T['--red'], mono: true });
        }
      });
      scene.render();
      if (state.mode === 'paging') {
        const pageBytes = state.pageKB * 1024;
        const pn = Math.floor(state.va / pageBytes), off = state.va % pageBytes;
        UI.readout(out, [['页号', String(pn)], ['页内偏移', String(off)], ['页框号', String(pageTable[pn % pageTable.length])]]);
      } else {
        const sd = Math.floor(state.va / 0x1000), off = state.va % 0x1000;
        UI.readout(out, [['段号', String(sd % segTable.length)], ['段内偏移', '0x' + off.toString(16).toUpperCase()], ['段长', '0x' + segTable[sd % segTable.length].len.toString(16).toUpperCase()]]);
      }
    }
    render();
    return s;
  };

  /* ---------- 页面置换算法 ---------- */
  W.pageReplace = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { algo: 'FIFO', frames: 4, ref: '7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1' };
    const inp = UI.text(ctrl, { label: '引用串', value: state.ref, width: 320 });
    inp.input.addEventListener('input', () => { state.ref = inp.value; render(); });
    UI.seg(ctrl, [{ label: 'FIFO', value: 'FIFO' }, { label: 'LRU', value: 'LRU' }, { label: 'OPT', value: 'OPT' }], v => { state.algo = v; render(); }, 0);
    UI.slider(ctrl, { label: '物理块数', min: 2, max: 8, step: 1, value: 4, fmt: v => v, onInput: v => { state.frames = v; render(); } });

    function simulate(ref, n, algo) {
      const frames = [];
      const loaded = [];
      const lastUse = {};
      const history = [];
      let faults = 0;
      ref.forEach((pg, idx) => {
        const pos = frames.indexOf(pg);
        if (pos >= 0) {
          lastUse[pg] = idx;
          history.push({ pg, frames: frames.slice(), hit: true, slot: pos });
          return;
        }
        faults++;
        let slot;
        if (frames.length < n) { slot = frames.length; frames.push(pg); loaded.push(idx); }
        else {
          if (algo === 'FIFO') { let best = Infinity; frames.forEach((f, k) => { if (loaded[k] < best) { best = loaded[k]; slot = k; } }); }
          else if (algo === 'LRU') { let best = Infinity; frames.forEach((f, k) => { const lu = lastUse[f] === undefined ? -1 : lastUse[f]; if (lu < best) { best = lu; slot = k; } }); }
          else { let far = -1; frames.forEach((f, k) => { const nx = ref.indexOf(f, idx + 1); if (nx === -1) { slot = k; far = Infinity; } else if (nx > far) { far = nx; slot = k; } }); }
          frames[slot] = pg; loaded[slot] = idx;
        }
        lastUse[pg] = idx;
        history.push({ pg, frames: frames.slice(), hit: false, slot });
      });
      return { history, faults };
    }

    function render() {
      const ref = state.ref.split(/[,，\s]+/).map(x => parseInt(x, 10)).filter(v => isFinite(v));
      const { history, faults } = simulate(ref, state.frames, state.algo);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const left = 54, top = 42;
        const cw = Math.min(30, (p.w - left - 12) / Math.max(1, ref.length));
        const rh = 26;
        G.label(ctx, left, 20, `${state.algo}　物理块 ${state.frames} 个　缺页 ${faults} 次　缺页率 ${(faults / Math.max(1, ref.length) * 100).toFixed(1)}%`, { align: 'left', size: 12, weight: 700, color: T['--ink'] });
        ref.forEach((pg, c) => {
          G.label(ctx, left + c * cw + cw / 2, top - 12, String(pg), { size: 10, color: T['--ink-3'], mono: true });
        });
        const colors = [T['--brand'], T['--purple'], T['--accent'], T['--teal'], T['--green']];
        for (let r = 0; r < state.frames; r++) {
          const y = top + r * rh;
          G.label(ctx, left - 10, y + rh / 2, '块' + (r + 1), { align: 'right', size: 10, color: T['--ink-3'] });
          history.forEach((h, c) => {
            const val = h.frames[r];
            const x = left + c * cw;
            const isNew = !h.hit && h.slot === r;
            if (val === undefined) {
              G.box(ctx, x + 1, y, cw - 2, rh - 4, { fill: T['--card-2'], stroke: T['--line'], radius: 4 });
            } else {
              const ci = val % colors.length;
              G.box(ctx, x + 1, y, cw - 2, rh - 4, {
                fill: D.withAlpha(isNew ? T['--red'] : colors[ci], isNew ? 0.22 : 0.2),
                stroke: isNew ? T['--red'] : colors[ci], width: isNew ? 1.6 : 1, radius: 4
              });
              G.label(ctx, x + cw / 2, y + rh / 2 - 2, String(val), { size: 11, weight: 700, color: isNew ? T['--red'] : colors[ci], mono: true });
            }
          });
        }
        history.forEach((h, c) => {
          if (!h.hit) G.label(ctx, left + c * cw + cw / 2, top + state.frames * rh + 8, '×', { size: 12, weight: 800, color: T['--red'] });
        });
        G.label(ctx, left, top + state.frames * rh + 24, '红色为本次装入的页；× 表示发生缺页中断', { align: 'left', size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['算法', state.algo],
        ['缺页次数', String(faults)],
        ['缺页率', (faults / Math.max(1, ref.length) * 100).toFixed(1) + '%'],
        ['命中率', (100 - faults / Math.max(1, ref.length) * 100).toFixed(1) + '%']
      ]);
    }
    render();
    return s;
  };


  /* ---------- 分页地址变换 ---------- */
  W.addressTranslate = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const PAGES = 8;
    const table = [5, 2, 6, 1, 7, 3, 0, 4];
    const state = { size: 4, va: 0x2A3C };
    const addr = UI.slider(ctrl, {
      label: '逻辑地址', min: 0, max: PAGES * 4096 - 1, step: 1, value: state.va,
      fmt: v => v + ' (0x' + v.toString(16).toUpperCase() + ')',
      onInput: v => { state.va = v; render(); }
    });
    UI.seg(ctrl, [1, 2, 4, 8].map(kb => ({ label: kb + ' KB', value: kb })), (v) => {
      state.size = v;
      const max = PAGES * v * 1024 - 1;
      addr.input.max = max;
      if (state.va > max) { state.va = max; addr.set(state.va); }
      render();
    }, 2);
    const frameInput = UI.number(ctrl, { label: '页框号（当前页）', min: 0, max: 15, step: 1, value: table[2], width: 80 });
    frameInput.onChange(v => {
      const frames = 64 / state.size;
      table[pageOf(state.va)] = D.clamp(Math.round(v), 0, frames - 1);
      render();
    });
    UI.note(host, '页表初始化为 <b>[5, 2, 6, 1, 7, 3, 0, 4]</b>，可修改“当前页”对应的页框号；物理内存 64 KB。注意：页表项下标是<b>页号</b>，查表得到的是<b>页框号</b>，二者不能混用。');

    function pageOf(va) { return Math.floor(va / (state.size * 1024)); }
    function offOf(va) { return va % (state.size * 1024); }
    function hex(v) { return '0x' + v.toString(16).toUpperCase(); }

    function render() {
      const ps = state.size * 1024;
      const frames = 64 / state.size;
      const pn = pageOf(state.va), off = offOf(state.va);
      const fr = table[pn];
      const pa = fr * ps + off;
      frameInput.input.max = frames - 1;
      frameInput.set(fr);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        const offBits = Math.log2(ps), pageBits = Math.log2(PAGES);
        G.label(ctx, w / 2, 16, '分页地址变换：逻辑地址 → 页号 / 页内偏移 → 页表 → 物理地址', { size: 12, weight: 700, color: T['--ink'] });
        G.label(ctx, w - 20, 16, '逻辑地址 ' + hex(state.va) + ' = ' + state.va + '，页大小 ' + state.size + ' KB', { align: 'right', size: 10.5, color: T['--ink-3'], mono: true });
        G.bits(ctx, 20, 48, w - 40, 42, {
          groups: [
            { name: '页号 P（' + pageBits + ' 位）', value: pn, bits: pageBits, color: T['--brand'], range: '页表项下标' },
            { name: '页内偏移 W（' + offBits + ' 位）', value: off, bits: offBits, color: T['--teal'], range: '0 ~ ' + (ps - 1) }
          ], valueSize: 12
        });
        // 页表
        G.label(ctx, 20, 112, '页表（' + PAGES + ' 项）', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        const cw = (w - 40) / PAGES;
        table.forEach((f, k) => {
          const on = k === pn;
          const x = 20 + k * cw;
          G.box(ctx, x, 122, cw - 6, 44, {
            fill: on ? D.withAlpha(T['--brand'], 0.18) : T['--card-2'],
            stroke: on ? T['--brand'] : T['--line'], width: on ? 2 : 1.2, radius: 6
          });
          G.label(ctx, x + (cw - 6) / 2, 135, '页 ' + k, { size: 10, color: T['--ink-3'], mono: true });
          G.label(ctx, x + (cw - 6) / 2, 153, '框 ' + f, { size: 11.5, weight: on ? 800 : 600, color: on ? T['--brand'] : T['--ink-2'], mono: true });
        });
        // 计算式
        G.box(ctx, 20, 178, w - 40, 52, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 32, 194, '页号 = 逻辑地址 ÷ 页大小 = ' + state.va + ' ÷ ' + ps + ' = ' + pn + '　（取商）', { align: 'left', size: 11, color: T['--ink-2'], mono: true });
        G.label(ctx, 32, 210, '页内偏移 = 逻辑地址 mod 页大小 = ' + state.va + ' mod ' + ps + ' = ' + off + '　（取余）', { align: 'left', size: 11, color: T['--ink-2'], mono: true });
        G.label(ctx, 32, 226, '物理地址 = 页框号 × 页大小 + 页内偏移 = ' + fr + ' × ' + ps + ' + ' + off + ' = ' + hex(pa) + '（' + pa + '）', { align: 'left', size: 11.5, weight: 700, color: T['--green'], mono: true });
        // 物理内存
        const my = 250, mh = 34, cell = (w - 40) / frames;
        G.label(ctx, 20, my - 8, '物理内存 64 KB（' + frames + ' 个页框）', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        for (let k = 0; k < frames; k++) {
          const x = 20 + k * cell, on = k === fr;
          G.box(ctx, x + 1, my, Math.max(2, cell - 2), mh, {
            fill: on ? D.withAlpha(T['--green'], 0.3) : T['--card-2'],
            stroke: on ? T['--green'] : T['--line'], width: on ? 2 : 1, radius: 3
          });
          if (frames <= 16) G.label(ctx, x + cell / 2, my + mh / 2, String(k), { size: 9.5, color: on ? T['--green'] : T['--ink-3'], mono: true });
        }
        if (frames > 16) {
          for (let k = 0; k < frames; k += 8) G.label(ctx, 20 + k * cell + 1, my + mh + 10, String(k), { align: 'left', size: 9, color: T['--ink-3'], mono: true });
        }
        // 偏移在页框内位置
        const fx = 20 + fr * cell + 1;
        const ratio = off / ps;
        const lx = fx + Math.max(2, (cell - 2) * ratio);
        G.arrow(ctx, [[lx, my - 6], [lx, my + mh + 4]], { color: T['--red'], width: 2, head: 6 });
        if (lx < 300) G.label(ctx, lx + 6, my + mh + 14, '偏移 ' + off, { align: 'left', size: 9.5, weight: 700, color: T['--red'], mono: true });
        else G.label(ctx, lx + 6, my - 14, '偏移 ' + off, { align: 'left', size: 9.5, weight: 700, color: T['--red'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['页号 P', String(pn)],
        ['页内偏移 W', String(off)],
        ['页框号', String(fr)],
        ['物理地址', hex(pa) + '（' + pa + '）']
      ]);
    }
    render();
    return s;
  };


  /* ---------- 工作集与抖动 ---------- */
  W.workingSet = function (host) {
    const s = UI.shell(host, 360);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const DEFAULT = '7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1';
    const state = { refs: parse(DEFAULT), d: 8, cur: 0, trans: null };
    const holder = UI.el('div', 'ctrl-group');
    ctrl.appendChild(holder);
    const inp = UI.text(ctrl, { label: '页面引用串', value: DEFAULT, width: 330 });
    inp.input.addEventListener('input', () => { state.refs = parse(inp.value); state.cur = 0; rebuild(); });
    UI.slider(ctrl, { label: '工作集窗口 Δ', min: 2, max: 16, step: 1, value: state.d, fmt: v => v + ' 次访问', onInput: v => { state.d = v; render(); } });
    rebuild();

    function parse(str) {
      const arr = String(str).split(/[,，\s]+/).map(x => parseInt(x, 10)).filter(v => isFinite(v) && v >= 0 && v <= 9);
      return arr.length ? arr.slice(0, 24) : parse(DEFAULT);
    }
    function rebuild() {
      if (state.trans) state.trans.stop();
      holder.innerHTML = '';
      state.cur = Math.min(state.cur, state.refs.length - 1);
      state.trans = UI.transport(holder, { total: state.refs.length, speed: 700, onChange: k => { state.cur = k; render(); } });
      render();
    }
    function win(idx, d) {
      const from = Math.max(0, idx - (d || state.d) + 1);
      const set = [];
      for (let k = from; k <= idx; k++) if (set.indexOf(state.refs[k]) < 0) set.push(state.refs[k]);
      return set;
    }
    function marksOf(d) {
      const arr = state.refs;
      const marks = arr.map((pg, i) => {
        const from = Math.max(0, i - d);
        for (let k = from; k < i; k++) if (arr[k] === pg) return false;
        return true;
      });
      return marks;
    }
    function faultRate(d) {
      const marks = marksOf(d);
      return marks.filter(Boolean).length / Math.max(1, marks.length);
    }


    function render() {
      const arr = state.refs, len = arr.length, d = state.d;
      const marks = marksOf(d);
      const faults = marks.filter(Boolean).length;
      const W = win(state.cur);
      const sizes = arr.map((pg, i) => win(i).length);
      const maxW = Math.max(2, Math.max.apply(null, sizes));
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        const x0 = 74, cw = (w - x0 - 24) / len;
        const colors = [T['--brand'], T['--purple'], T['--accent'], T['--teal'], T['--green'], T['--red']];
        G.label(ctx, w / 2, 16, '工作集：滑动窗口内的页面集合（Δ = ' + d + ' 次访问）　·　窗口滑动 → 工作集大小变化 → 缺页率变化', { size: 11.5, weight: 700, color: T['--ink'] });
        // 窗口背景
        const wa = Math.max(0, state.cur - d + 1) * cw + x0;
        const wb = (state.cur + 1) * cw + x0;
        G.box(ctx, wa, 30, wb - wa, 44, { fill: D.withAlpha(T['--brand'], 0.12), stroke: D.withAlpha(T['--brand'], 0.7), radius: 6 });
        arr.forEach((pg, i) => {
          const x = x0 + i * cw;
          const on = i === state.cur, inWin = i >= state.cur - d + 1 && i <= state.cur;
          G.box(ctx, x + 1, 34, Math.max(2, cw - 2), 36, {
            fill: D.withAlpha(colors[pg % colors.length], on ? 0.34 : (inWin ? 0.18 : 0.07)),
            stroke: on ? T['--red'] : D.withAlpha(colors[pg % colors.length], 0.55), width: on ? 2 : 1, radius: 4
          });
          G.label(ctx, x + cw / 2, 52, String(pg), { size: 11, weight: on ? 800 : 600, color: on ? T['--red'] : T['--ink'], mono: true });
          if (marks[i]) G.label(ctx, x + cw / 2, 80, '×', { size: 12, weight: 800, color: T['--red'] });
          else G.label(ctx, x + cw / 2, 80, '·', { size: 12, weight: 800, color: T['--green'] });
        });
        G.label(ctx, 20, 52, '访问序列', { align: 'right', size: 10.5, color: T['--ink-3'] });
        G.label(ctx, 20, 80, '缺页', { align: 'right', size: 10.5, color: T['--ink-3'] });
        // 工作集大小曲线
        const ty = 104, th = 84, tw = w - x0 - 24;
        G.label(ctx, x0, ty - 6, '工作集大小 W(t)', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        G.box(ctx, x0, ty, tw, th, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
        for (let g = 1; g <= maxW; g++) {
          const y = ty + th - g / maxW * (th - 12) - 6;
          if (g % Math.max(1, Math.round(maxW / 4)) === 0 || g === maxW) {
            G.label(ctx, x0 - 6, y, String(g), { align: 'right', size: 9, color: T['--ink-3'], mono: true });
            ctx.save(); ctx.strokeStyle = D.withAlpha(T['--line-2'], 0.5); ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + tw, y); ctx.stroke(); ctx.restore();
          }
        }
        const X = i => x0 + (i + 0.5) * cw;
        const Y = v => ty + th - v / maxW * (th - 12) - 6;
        ctx.save();
        ctx.strokeStyle = T['--purple']; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
        sizes.forEach((v, i) => { if (i === 0) ctx.moveTo(X(i), Y(v)); else { ctx.lineTo(X(i), Y(sizes[i - 1])); ctx.lineTo(X(i), Y(v)); } });
        ctx.stroke(); ctx.restore();
        G.dot(ctx, X(state.cur), Y(sizes[state.cur]), 4.5, T['--red'], true);
        G.label(ctx, Math.min(w - 40, X(state.cur) + 8), Y(sizes[state.cur]) - 10, 'W=' + sizes[state.cur], { size: 9.5, weight: 700, color: T['--red'], mono: true });
        // 缺页率随 Δ 变化
        const by = 218, bh = 92, bw2 = w - x0 - 24;
        G.label(ctx, x0, by - 6, '缺页率随窗口 Δ 的变化（工作集模型）', { align: 'left', size: 11, weight: 700, color: T['--ink-2'] });
        const rates = [];
        for (let k = 1; k <= 16; k++) rates.push(faultRate(k));
        const maxR = Math.max.apply(null, rates) || 1;
        G.box(ctx, x0, by, bw2, bh, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
        const BX = k => x0 + (k - 0.5) / 16 * bw2;
        const BY = v => by + bh - 10 - v / maxR * (bh - 26);
        ctx.save();
        ctx.strokeStyle = T['--green']; ctx.lineWidth = 2; ctx.beginPath();
        rates.forEach((v, k) => { if (k === 0) ctx.moveTo(BX(k + 1), BY(v)); else ctx.lineTo(BX(k + 1), BY(v)); });
        ctx.stroke(); ctx.restore();
        rates.forEach((v, k) => {
          const on = k + 1 === d;
          G.dot(ctx, BX(k + 1), BY(v), on ? 4.5 : 3, on ? T['--red'] : T['--green'], on);
          G.label(ctx, BX(k + 1), by + bh - 6, String(k + 1), { size: 9, color: on ? T['--red'] : T['--ink-3'], mono: true });
        });
        G.arrow(ctx, [[BX(d), BY(rates[d - 1])], [BX(d), by + 8]], { color: D.withAlpha(T['--red'], 0.7), width: 1.4, dash: [4, 3], head: 6 });
        G.label(ctx, x0 + bw2 - 6, by + 14, '当前 Δ = ' + d + '：缺页率 ' + (rates[d - 1] * 100).toFixed(0) + '%', { align: 'right', size: 10.5, weight: 700, color: T['--red'], mono: true });
        // 结论
        G.box(ctx, 16, p.h - 34, w - 32, 24, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 6 });
        G.label(ctx, 28, p.h - 22, '当前窗口：{' + (W.join(', ') || '—') + '}　工作集大小 ' + W.length + '　·　若分配的物理块数小于工作集大小，缺页率急剧上升，即发生“抖动”。', { align: 'left', size: 10.5, color: T['--brand'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前窗口', '第 ' + Math.max(1, state.cur - d + 2) + ' ~ ' + (state.cur + 1) + ' 次访问'],
        ['工作集', '{' + W.join(', ') + '}'],
        ['工作集大小', String(W.length)],
        ['缺页次数 / 缺页率', faults + ' / ' + (faults / len * 100).toFixed(0) + '%']
      ]);
    }
    return s;
  };

})(window);
