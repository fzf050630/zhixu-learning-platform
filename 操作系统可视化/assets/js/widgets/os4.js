/* ============================================================
   os4.js — 第4章 文件管理 可视化组件
   fileAlloc：文件物理结构与混合索引寻址
   dirTree：目录树与路径解析
   freeSpace：磁盘空闲空间管理（位示图 / 成组链接）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 文件物理结构与索引寻址 ---------- */
  W.fileAlloc = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'inode', block: 15 };
    UI.seg(ctrl, [
      { label: '连续分配', value: 'seq' },
      { label: '链接分配', value: 'link' },
      { label: '索引分配', value: 'index' },
      { label: '混合索引', value: 'inode' }
    ], v => { state.mode = v; render(); }, 3);
    UI.slider(ctrl, { label: '逻辑块号', min: 0, max: 120, step: 1, value: 15, fmt: v => v, onInput: v => { state.block = v; render(); } });

    function inodeLookup(b) {
      if (b < 10) return { path: `直接地址项 i.addr[${b}]`, accesses: 1, note: '一级直接寻址' };
      if (b < 10 + 256) return { path: `一级间接 i.addr[10] → 索引块[${b - 10}]`, accesses: 2, note: '一级间接索引（256 项）' };
      if (b < 10 + 256 + 256 * 256) {
        const j = b - 10 - 256;
        return { path: `二级间接 i.addr[11] → 一级[${Math.floor(j / 256)}] → 二级[${j % 256}]`, accesses: 3, note: '二级间接索引' };
      }
      const j = b - 10 - 256 - 256 * 256;
      return { path: `三级间接 i.addr[12] → 一级[${Math.floor(j / 65536)}] → 二级[${Math.floor(j / 256) % 256}] → 三级[${j % 256}]`, accesses: 4, note: '三级间接索引' };
    }

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        G.label(ctx, w / 2, 18, ['连续分配', '链接分配', '索引分配', '混合索引（UNIX 风格）'][['seq', 'link', 'index', 'inode'].indexOf(state.mode)], { size: 12.5, weight: 700, color: T['--ink'] });
        if (state.mode === 'seq') {
          const blocks = [];
          const start = 20;
          for (let k = 0; k < 12; k++) blocks.push({ l: k, ph: start + k });
          drawBlockRow(ctx, p, blocks, T, '文件逻辑块 → 物理块（连续）');
          G.label(ctx, w / 2, p.h - 30, '逻辑块号 = 物理块号 − 起始块号：随机访问快，但要求连续空间、易产生外部碎片', { size: 11, color: T['--ink-3'] });
        } else if (state.mode === 'link') {
          // 链式：每块含下一块指针
          const chain = [20, 35, 22, 41, 28, 50];
          const bw = (w - 60) / chain.length;
          chain.forEach((ph, k) => {
            const x = 30 + k * bw;
            G.box(ctx, x, 60, bw - 22, 56, { fill: D.withAlpha(T['--brand'], 0.12), stroke: T['--brand'], radius: 7 });
            G.label(ctx, x + (bw - 22) / 2, 78, '块 ' + ph, { size: 11, weight: 700, color: T['--brand'], mono: true });
            G.label(ctx, x + (bw - 22) / 2, 98, '逻辑 ' + k, { size: 10, color: T['--ink-3'], mono: true });
            if (k < chain.length - 1) G.arrow(ctx, [[x + bw - 22, 88], [x + bw - 2, 88]], { color: T['--teal'], width: 1.6, head: 6 });
          });
          G.label(ctx, w / 2, p.h - 30, '每个物理块末尾存放下一块指针：无外部碎片，但只能顺序访问，指针占用空间', { size: 11, color: T['--ink-3'] });
        } else if (state.mode === 'index') {
          G.box(ctx, 30, 50, 120, 140, { fill: D.withAlpha(T['--purple'], 0.12), stroke: T['--purple'], radius: 8 });
          G.label(ctx, 90, 66, '索引块', { size: 12, weight: 700, color: T['--purple'] });
          for (let k = 0; k < 6; k++) {
            G.label(ctx, 90, 88 + k * 16, `[${k}] → 块 ${100 + k * 7}`, { size: 10, color: T['--ink-2'], mono: true });
          }
          G.label(ctx, 90, 176, '…', { size: 12, color: T['--ink-3'] });
          G.label(ctx, 230, 120, '索引表给出每个逻辑块对应的物理块号，支持随机访问；索引块本身占空间', { align: 'left', size: 11, color: T['--ink-3'] });
        } else {
          const info = inodeLookup(state.block);
          // i-node 框
          G.box(ctx, 24, 44, 118, 176, { fill: D.withAlpha(T['--brand'], 0.1), stroke: T['--brand'], radius: 9 });
          G.label(ctx, 83, 60, 'i-node', { size: 12, weight: 700, color: T['--brand'] });
          for (let k = 0; k < 10; k++) G.label(ctx, 83, 82 + k * 13, `直接 addr[${k}]`, { size: 9, color: k === state.block ? T['--red'] : T['--ink-3'], mono: true });
          ['一级间接', '二级间接', '三级间接'].forEach((t, k) => {
            const idx = 10 + k;
            G.label(ctx, 83, 82 + idx * 13, t, { size: 9, weight: state.block >= [0, 10, 266][k] ? 700 : 500, color: state.block >= [0, 10, 266][k] ? T['--accent'] : T['--ink-3'], mono: true });
          });
          G.box(ctx, 158, 44, w - 182, 176, { fill: T['--card-2'], stroke: T['--line'], radius: 9 });
          G.label(ctx, 172, 62, `逻辑块号 ${state.block} 的寻址`, { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
          G.label(ctx, 172, 88, info.note, { align: 'left', size: 11, color: T['--ink-2'] });
          G.label(ctx, 172, 112, info.path, { align: 'left', size: 11, color: T['--brand'], mono: true });
          G.label(ctx, 172, 140, `需要访问磁盘 ${info.accesses} 次`, { align: 'left', size: 12, weight: 700, color: T['--green'] });
          G.label(ctx, 172, 164, '（直接 addr 访问 1 次；每级间接多访问 1 次索引块）', { align: 'left', size: 9.5, color: T['--ink-3'] });
        }
      });
      scene.render();
      if (state.mode === 'inode') {
        const info = inodeLookup(state.block);
        UI.readout(out, [['逻辑块号', String(state.block)], ['寻址方式', info.note], ['访盘次数', String(info.accesses)]]);
      } else {
        UI.readout(out, [['结构', state.mode === 'seq' ? '连续' : state.mode === 'link' ? '链接' : '索引']]);
      }
    }

    function drawBlockRow(ctx, p, blocks, T, title) {
      const bw = (p.w - 60) / blocks.length;
      blocks.forEach((b, k) => {
        const x = 30 + k * bw;
        G.box(ctx, x, 70, bw - 12, 50, { fill: D.withAlpha(T['--brand'], 0.12), stroke: T['--brand'], radius: 6 });
        G.label(ctx, x + (bw - 12) / 2, 88, '逻辑 ' + b.l, { size: 10, color: T['--ink-3'], mono: true });
        G.label(ctx, x + (bw - 12) / 2, 106, '块 ' + b.ph, { size: 12, weight: 700, color: T['--brand'], mono: true });
      });
    }
    render();
    return s;
  };

  /* ---------- 目录树与路径解析 ---------- */
  W.dirTree = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const tree = {
      name: 'root', type: 'd', children: [
        { name: 'bin', type: 'd', children: [{ name: 'ls', type: 'f' }, { name: 'cat', type: 'f' }] },
        { name: 'home', type: 'd', children: [
          { name: 'alice', type: 'd', children: [{ name: 'a.txt', type: 'f' }, { name: 'doc', type: 'd', children: [{ name: 'b.txt', type: 'f' }] }] },
          { name: 'bob', type: 'd', children: [{ name: 'c.txt', type: 'f' }] }
        ] },
        { name: 'etc', type: 'd', children: [{ name: 'passwd', type: 'f' }] }
      ]
    };
    const state = { path: '/home/alice/doc/b.txt', cwd: '/home/alice' };
    const inp = UI.text(ctrl, { label: '路径', value: state.path, width: 260 });
    inp.input.addEventListener('input', () => { state.path = inp.value; render(); });

    function resolve(pathStr) {
      let parts, base;
      if (pathStr.startsWith('/')) { parts = pathStr.split('/').filter(Boolean); base = tree; }
      else { parts = state.cwd.split('/').filter(Boolean).concat(pathStr.split('/').filter(Boolean)); base = tree; }
      const trail = [base];
      let cur = base, ok = true;
      for (const seg of parts) {
        if (seg === '.') continue;
        if (seg === '..') { cur = trail.length > 1 ? trail[trail.length - 2] : tree; trail.pop(); continue; }
        const next = (cur.children || []).find(c => c.name === seg);
        if (!next) { ok = false; break; }
        cur = next; trail.push(cur);
      }
      return { ok, node: cur, parts, chain: trail };
    }

    function render() {
      const res = resolve(state.path);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 树布局
        const chain = res.chain;
        const names = chain.map((n, k) => n === tree ? 'root' : n.name);
        const segs = names;
        const totalW = p.w - 60;
        const bw = Math.min(110, totalW / Math.max(segs.length, 1));
        segs.forEach((nm, k) => {
          const x = 30 + k * ((totalW - bw) / Math.max(1, segs.length - 1));
          const isTarget = k === segs.length - 1;
          const color = chain[k] && chain[k].type === 'f' ? T['--accent'] : T['--brand'];
          G.box(ctx, x, 70, bw, 48, {
            fill: D.withAlpha(color, isTarget ? 0.24 : 0.1),
            stroke: isTarget ? color : D.withAlpha(color, 0.5), width: isTarget ? 2 : 1.2, radius: 8
          });
          G.label(ctx, x + bw / 2, 86, chain[k] && chain[k].type === 'f' ? '📄' : '📁', { size: 12 });
          G.fitted(ctx, x + bw / 2, 106, nm, bw - 10, { size: 11.5, weight: isTarget ? 800 : 600, color: isTarget ? color : T['--ink'], mono: true });
          if (k > 0) G.arrow(ctx, [[x - (totalW - bw) / Math.max(1, segs.length - 1) + bw, 94], [x - 2, 94]], { color: D.withAlpha(color, 0.6), width: 1.4, head: 6 });
        });
        G.label(ctx, 30, 40, `当前工作目录：${state.cwd}`, { align: 'left', size: 11, color: T['--ink-3'] });
        G.box(ctx, 16, p.h - 70, p.w - 32, 56, {
          fill: D.withAlpha(res.ok ? T['--green'] : T['--red'], 0.1),
          stroke: D.withAlpha(res.ok ? T['--green'] : T['--red'], 0.5), radius: 9
        });
        G.label(ctx, 28, p.h - 50, res.ok ? '解析成功' : '路径不存在', { align: 'left', size: 12.5, weight: 700, color: res.ok ? T['--green'] : T['--red'] });
        G.label(ctx, 28, p.h - 30, '逐级目录项查找：' + (res.ok ? names.join(' → ') : '在某级未找到目录项'), { align: 'left', size: 11, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['路径类型', state.path.startsWith('/') ? '绝对路径' : '相对路径'],
        ['结果', res.ok ? (res.node.type === 'f' ? '文件' : '目录') : '不存在'],
        ['层级数', String(res.chain.length)]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 磁盘空闲空间管理 ---------- */
  W.freeSpace = function (host) {
    const s = UI.shell(host, 280);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { mode: 'bitmap', alloc: 20 };
    const words = 32, bits = 32;
    UI.seg(ctrl, [{ label: '位示图', value: 'bitmap' }, { label: '成组链接', value: 'group' }], v => { state.mode = v; render(); }, 0);
    UI.slider(ctrl, { label: '已分配块数', min: 0, max: 200, step: 1, value: 20, fmt: v => v, onInput: v => { state.alloc = v; render(); } });

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        if (state.mode === 'bitmap') {
          const cols = 32, rows = 6, cell = (p.w - 80) / cols;
          G.label(ctx, 40, 20, `位示图（字号 0~${words - 1}，位号 0~${bits - 1}）　0 空闲 / 1 占用`, { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
          for (let r = 0; r < rows; r++) {
            const y = 34 + r * (cell + 2);
            G.label(ctx, 34, y + cell / 2, String(r), { align: 'right', size: 9, color: T['--ink-3'], mono: true });
            for (let c = 0; c < cols; c++) {
              const blk = r * cols + c;
              const used = blk < state.alloc;
              const x = 42 + c * cell;
              G.box(ctx, x, y, cell - 2, cell, {
                fill: used ? D.withAlpha(T['--red'], 0.22) : T['--card-2'],
                stroke: used ? T['--red'] : T['--line'], radius: 3
              });
            }
          }
          G.label(ctx, 40, p.h - 26, '分配：行列扫描找 0 → 置 1；回收：由块号反算 字号 = 块号 div 32，位号 = 块号 mod 32', { align: 'left', size: 10.5, color: T['--ink-3'] });
        } else {
          // 成组链接
          G.label(ctx, 40, 20, '成组链接法：超级块记录第一组空闲块，每组最后一块记录下一组块号与数量', { align: 'left', size: 11.5, weight: 700, color: T['--ink'] });
          const groups = [[100, 99, 98], [97, 96, 95], [94, 93, 92]];
          const gw = (p.w - 120) / groups.length;
          groups.forEach((g, k) => {
            const x = 60 + k * gw;
            G.box(ctx, x, 60, gw - 40, 120, { fill: D.withAlpha(T['--brand'], 0.1), stroke: D.withAlpha(T['--brand'], 0.6), radius: 9 });
            G.label(ctx, x + (gw - 40) / 2, 78, `第 ${k + 1} 组（${g.length} 块）`, { size: 11, weight: 700, color: T['--brand'] });
            g.forEach((b, j) => G.label(ctx, x + (gw - 40) / 2, 100 + j * 18, '块 ' + b, { size: 10, color: T['--ink-2'], mono: true }));
            G.label(ctx, x + (gw - 40) / 2, 168, k < groups.length - 1 ? '末块记录下一组' : '末块为 0', { size: 9.5, color: T['--ink-3'] });
            if (k < groups.length - 1) G.arrow(ctx, [[x + gw - 40, 120], [x + gw - 10, 120]], { color: T['--teal'], width: 1.6, head: 6 });
          });
          G.label(ctx, 40, p.h - 26, '分配时从超级块栈顶弹出，栈空则从下一组读入；适合大容量磁盘，减少访盘', { align: 'left', size: 10.5, color: T['--ink-3'] });
        }
      });
      scene.render();
      UI.readout(out, [
        ['方式', state.mode === 'bitmap' ? '位示图' : '成组链接'],
        ['已用块', state.mode === 'bitmap' ? String(state.alloc) : '—'],
        ['空闲块', state.mode === 'bitmap' ? String(words * bits - state.alloc) : '分组管理']
      ]);
    }
    render();
    return s;
  };


  /* ---------- 索引结点与多级索引 ---------- */
  W.inodeIndex = function (host) {
    const s = UI.shell(host, 330);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { block: 1024, addr: 4, direct: 10, blk: 15 };
    const blkSlider = UI.slider(ctrl, { label: '逻辑块号（对数轴）', min: 0, max: 9, step: 0.005, value: 1, fmt: v => String(blockOf(v)), onInput: v => { state.blk = blockOf(v); render(); } });
    UI.seg(ctrl, [512, 1024, 2048, 4096].map(v => ({ label: v >= 1024 ? (v / 1024) + ' KB' : v + ' B', value: v })), (v) => { state.block = v; clampBlk(); render(); }, 1);
    UI.seg(ctrl, [2, 4, 8].map(v => ({ label: '地址项 ' + v + ' B', value: v })), (v) => { state.addr = v; render(); }, 1);
    UI.slider(ctrl, { label: '直接地址项数 d', min: 6, max: 12, step: 1, value: 10, fmt: v => v + ' 项', onInput: v => { state.direct = v; render(); } });
    UI.note(host, 'UNIX 风格混合索引：i-node 中 d 个直接地址项 + 1 个一级间接 + 1 个二级间接 + 1 个三级间接。每块可存 K = 块大小 ÷ 地址项长度 个地址项，最大文件大小 = (d + K + K² + K³) × 块大小。');

    function blockOf(v) { return Math.max(0, Math.round(Math.pow(10, v)) - 1); }
    function calc() {
      const K = Math.floor(state.block / state.addr);
      const c1 = K, c2 = K * K, c3 = K * K * K;
      return { K, c1, c2, c3, total: state.direct + c1 + c2 + c3, maxBytes: (state.direct + c1 + c2 + c3) * state.block };
    }
    function clampBlk() {
      const c = calc();
      if (state.blk > c.total - 1) { state.blk = c.total - 1; blkSlider.set(Math.log10(Math.max(1, state.blk + 1))); }
    }
    function fInt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function fBytes(bytes) {
      const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      let v = bytes, k = 0;
      while (v >= 1024 && k < u.length - 1) { v /= 1024; k++; }
      return (v >= 100 ? v.toFixed(0) : v.toFixed(2)) + ' ' + u[k];
    }
    function levelOf(blk) {
      const c = calc();
      if (blk < state.direct) return 0;
      if (blk < state.direct + c.c1) return 1;
      if (blk < state.direct + c.c1 + c.c2) return 2;
      if (blk < c.total) return 3;
      return -1;
    }
    function pathOf(blk) {
      const c = calc(), d = state.direct;
      const lv = levelOf(blk);
      if (lv === 0) return { lv, path: 'i.addr[' + blk + ']（直接地址项）', acc: 1 };
      if (lv === 1) return { lv, path: 'i.addr[' + d + '] → 索引块[' + (blk - d) + ']', acc: 2 };
      if (lv === 2) {
        const j = blk - d - c.c1;
        return { lv, path: 'i.addr[' + (d + 1) + '] → 一级[' + Math.floor(j / c.K) + '] → 二级[' + (j % c.K) + ']', acc: 3 };
      }
      const j = blk - d - c.c1 - c.c2;
      return { lv, path: 'i.addr[' + (d + 2) + '] → 一级[' + Math.floor(j / (c.K * c.K)) + '] → 二级[' + (Math.floor(j / c.K) % c.K) + '] → 三级[' + (j % c.K) + ']', acc: 4 };
    }

    function render() {
      const c = calc();
      const d = state.direct;
      const blk = D.clamp(state.blk, 0, c.total - 1);
      const info = pathOf(blk);
      const segs = [
        { name: '直接', n: d, from: 0, to: d - 1, color: T0('--brand') },
        { name: '一级间接', n: c.c1, from: d, to: d + c.c1 - 1, color: T0('--purple') },
        { name: '二级间接', n: c.c2, from: d + c.c1, to: d + c.c1 + c.c2 - 1, color: T0('--accent') },
        { name: '三级间接', n: c.c3, from: d + c.c1 + c.c2, to: c.total - 1, color: T0('--teal') }
      ];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        G.label(ctx, w / 2, 16, '索引结点与多级索引：块大小 ' + state.block + ' B，地址项 ' + state.addr + ' B，K = ' + c.K + ' 项/块', { size: 12, weight: 700, color: T['--ink'] });
        // 容量条（对数刻度）
        const x0 = 74, barW = w - x0 - 30, by = 52, bh = 40;
        const L = v => Math.log10(Math.max(1, v) + 1);
        const totalL = L(c.total);
        let cx = x0;
        const bounds = [];
        segs.forEach(sg => {
          const ww = (L(sg.to + 1) - L(sg.from)) / totalL * barW;
          bounds.push([cx, ww]);
          G.box(ctx, cx, by, Math.max(2, ww - 2), bh, { fill: D.withAlpha(sg.color, 0.18), stroke: sg.color, radius: 5 });
          if (ww > 30) G.fitted(ctx, cx + ww / 2, by + 15, sg.name, ww - 8, { size: 10, weight: 700, color: sg.color });
          if (ww > 44) G.fitted(ctx, cx + ww / 2, by + 30, fInt(sg.n) + ' 块', ww - 8, { size: 9, color: T['--ink-3'], mono: true });
          if (sg.from <= sg.to) G.label(ctx, cx, by + bh + 10, sg.from === 0 && sg.to === 0 ? '0' : fInt(sg.from) + '~' + fInt(sg.to), { align: 'left', size: 8.5, color: T['--ink-3'], mono: true });
          cx += ww;
        });
        G.label(ctx, x0 - 8, by + bh / 2, '逻辑块号（对数刻度）', { align: 'right', size: 10, color: T['--ink-3'] });
        // 当前块标记
        const mx = x0 + L(blk + 1) / totalL * barW;
        G.arrow(ctx, [[mx, by - 8], [mx, by + bh + 4]], { color: T['--red'], width: 2.2, head: 7 });
        G.label(ctx, mx, by - 16, '块 ' + fInt(blk), { size: 10.5, weight: 800, color: T['--red'], mono: true });
        // 公式
        G.box(ctx, 20, 132, w - 40, 80, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 34, 150, '每块可存地址项数 K = 块大小 ÷ 地址项 = ' + state.block + ' ÷ ' + state.addr + ' = ' + c.K, { align: 'left', size: 11, color: T['--ink-2'], mono: true });
        G.label(ctx, 34, 168, '最大块数 = d + K + K² + K³ = ' + d + ' + ' + fInt(c.c1) + ' + ' + fInt(c.c2) + ' + ' + fInt(c.c3) + ' = ' + fInt(c.total), { align: 'left', size: 11, color: T['--ink-2'], mono: true });
        G.label(ctx, 34, 186, '最大文件大小 = 最大块数 × 块大小 = ' + fInt(c.total) + ' × ' + state.block + ' B = ' + fBytes(c.maxBytes), { align: 'left', size: 11.5, weight: 700, color: T['--green'], mono: true });
        G.label(ctx, 34, 203, '三级间接索引使文件大小呈立方级增长——这是索引结点支撑大文件的关键', { align: 'left', size: 10, color: T['--ink-3'] });
        // 当前块寻址
        G.box(ctx, 20, 222, w - 40, 62, {
          fill: D.withAlpha(T['--brand'], 0.1), stroke: D.withAlpha(T['--brand'], 0.5), radius: 8
        });
        const lvName = ['直接地址', '一级间接', '二级间接', '三级间接'][info.lv];
        G.label(ctx, 34, 240, '逻辑块号 ' + fInt(blk) + ' 属于【' + lvName + '】', { align: 'left', size: 12, weight: 700, color: T['--brand'] });
        G.label(ctx, 34, 258, info.path, { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
        G.label(ctx, 34, 276, '访问磁盘次数 = 索引级数 + 1 = ' + info.acc + ' 次（最后 1 次读取数据块）', { align: 'left', size: 11, weight: 700, color: T['--accent'] });
      });
      scene.render();
      UI.readout(out, [
        ['K（项/块）', String(c.K)],
        ['最大块数', fInt(c.total)],
        ['最大文件大小', fBytes(c.maxBytes)],
        ['当前块寻址', ['直接', '一级间接', '二级间接', '三级间接'][info.lv] + '，访盘 ' + info.acc + ' 次']
      ]);
      blkSlider.set(Math.log10(Math.max(1, blk + 1)));
    }
    function T0(k) { return D.Theme.get(k); }
    render();
    return s;
  };

})(window);
