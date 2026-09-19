/* ============================================================
   os1.js — 第1章 计算机系统概述 可视化组件
   kernelMode：用户态 / 内核态与系统调用切换
   osStructure：操作系统结构（分层 / 模块化 / 宏内核 / 微内核）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 用户态 / 内核态切换 ---------- */
  W.kernelMode = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const steps = [
      { mode: 'user', title: '用户态执行用户程序', desc: 'CPU 处于用户态，只能执行非特权指令，不能直接访问核心资源。' },
      { mode: 'trap', title: '发生系统调用 / 中断 / 异常', desc: '用户程序执行陷入指令（trap）请求服务，或时钟中断、缺页异常触发。' },
      { mode: 'kernel', title: '切换到内核态', desc: '硬件保存现场（PSW、PC 等），CPU 进入内核态，可执行特权指令。' },
      { mode: 'kernel', title: '内核执行服务程序', desc: '按系统调用号查表，执行相应的内核服务（如设备驱动、文件操作）。' },
      { mode: 'user', title: '返回用户态', desc: '恢复现场，CPU 回到用户态，继续执行用户程序的下一条指令。' }
    ];
    let i = 0;
    const events = ['系统调用 read()', '时钟中断', '缺页异常', '除零异常'];
    let ev = 0;

    UI.seg(ctrl, events.map(e => ({ label: e, value: e })), (v, k) => { ev = k; render(); }, 0);
    const t = UI.transport(ctrl, { total: steps.length, onChange: k => { i = k; render(); } });

    function render() {
      const st = steps[i];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const half = p.h / 2;
        // 两个世界
        G.box(ctx, 16, 14, p.w - 32, half - 24, {
          fill: st.mode === 'user' || st.mode === 'trap' ? D.withAlpha(T['--green'], 0.12) : T['--card-2'],
          stroke: st.mode === 'user' || st.mode === 'trap' ? T['--green'] : T['--line'], radius: 10, width: st.mode === 'user' ? 1.8 : 1
        });
        G.label(ctx, 30, 30, '用户态 (User Mode)', { align: 'left', size: 12.5, weight: 700, color: T['--green'] });
        G.label(ctx, 30, 50, '只能执行非特权指令 · 受限访问', { align: 'left', size: 10.5, color: T['--ink-3'] });
        G.label(ctx, p.w - 30, 36, '进程 / 应用程序', { align: 'right', size: 11, color: T['--ink-2'] });

        G.box(ctx, 16, half + 8, p.w - 32, half - 24, {
          fill: st.mode === 'kernel' ? D.withAlpha(T['--purple'], 0.12) : T['--card-2'],
          stroke: st.mode === 'kernel' ? T['--purple'] : T['--line'], radius: 10, width: st.mode === 'kernel' ? 1.8 : 1
        });
        G.label(ctx, 30, half + 24, '内核态 (Kernel Mode)', { align: 'left', size: 12.5, weight: 700, color: T['--purple'] });
        G.label(ctx, 30, half + 44, '可执行全部指令 · 访问所有资源', { align: 'left', size: 10.5, color: T['--ink-3'] });
        G.label(ctx, p.w - 30, half + 30, '内核 / 系统调用处理', { align: 'right', size: 11, color: T['--ink-2'] });

        // 切换箭头
        const activeUp = st.mode === 'trap' || st.mode === 'kernel';
        const cx = p.w - 60;
        G.arrow(ctx, [[cx, half - 24], [cx, half + 8]], {
          color: activeUp ? T['--red'] : D.withAlpha(T['--line-2'], 0.8), width: activeUp ? 2.4 : 1.2, head: 7
        });
        G.label(ctx, cx - 10, half - 8, st.mode === 'trap' ? '陷入 trap' : '', { align: 'right', size: 10, color: T['--red'] });
        const activeDown = st.mode === 'user' && i > 0;
        G.arrow(ctx, [[cx - 90, half + 8], [cx - 90, half - 24]], {
          color: activeDown ? T['--teal'] : D.withAlpha(T['--line-2'], 0.8), width: activeDown ? 2.4 : 1.2, head: 7
        });
        G.label(ctx, cx - 100, half - 8, activeDown ? '返回' : '', { align: 'right', size: 10, color: T['--teal'] });

        G.box(ctx, 16, p.h - 30, p.w - 32, 22, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 5 });
        G.label(ctx, p.w / 2, p.h - 19, `${st.title}　·　触发：${events[ev]}`, { size: 11.5, weight: 700, color: T['--brand'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前状态', st.mode === 'user' ? '用户态' : (st.mode === 'trap' ? '切换中' : '内核态')],
        ['触发事件', events[ev]],
        ['说明', st.desc]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 操作系统结构 ---------- */
  W.osStructure = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { type: 'monolithic' };
    const info = {
      monolithic: { name: '宏内核（单体内核）', desc: '所有系统服务（进程、内存、文件、设备）都在内核态同一个地址空间内实现，模块可直接调用。', pros: '性能高、调用开销小', cons: '内核庞大、耦合高、一处出错影响全局' },
      micro: { name: '微内核', desc: '内核只保留最基本的功能（进程调度、消息传递、基本内存管理），其余服务移到用户态以 C/S 方式运行。', pros: '可靠、可扩展、易移植', cons: '频繁的用户态/内核态切换与消息传递，性能较低' },
      layered: { name: '分层结构', desc: '内核分为若干层，每层只能调用相邻下层提供的接口。', pros: '结构清晰、便于调试与验证', cons: '层次划分困难、跨层调用效率低' },
      modular: { name: '模块化', desc: '内核由若干可独立加载/卸载的模块组成，模块间通过接口通信。', pros: '灵活、可动态扩展', cons: '模块接口设计复杂' }
    };

    UI.seg(ctrl, [
      { label: '宏内核', value: 'monolithic' },
      { label: '微内核', value: 'micro' },
      { label: '分层', value: 'layered' },
      { label: '模块化', value: 'modular' }
    ], v => { state.type = v; render(); }, 0);

    function render() {
      const it = info[state.type];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        if (state.type === 'monolithic') {
          G.box(ctx, 30, 20, w - 60, p.h - 40, { fill: D.withAlpha(T['--purple'], 0.1), stroke: T['--purple'], radius: 10 });
          G.label(ctx, w / 2, 40, '内核态（单一地址空间）', { size: 12.5, weight: 700, color: T['--purple'] });
          const mods = ['进程管理', '内存管理', '文件系统', '设备驱动', '网络协议'];
          const bw = (w - 90) / mods.length;
          mods.forEach((m, k) => {
            G.box(ctx, 45 + k * bw, 70, bw - 12, 60, { fill: D.withAlpha(T['--purple'], 0.12), stroke: D.withAlpha(T['--purple'], 0.5), radius: 6, fill2: null });
            G.fitted(ctx, 45 + k * bw + (bw - 12) / 2, 100, m, bw - 20, { size: 11, weight: 600, color: T['--ink'] });
          });
          G.box(ctx, 30, p.h - 60, w - 60, 32, { fill: D.withAlpha(T['--green'], 0.12), stroke: T['--green'], radius: 8 });
          G.label(ctx, w / 2, p.h - 44, '用户态：应用程序通过系统调用进入内核', { size: 11, color: T['--green'] });
        } else if (state.type === 'micro') {
          G.box(ctx, w / 2 - 100, 20, 200, 56, { fill: D.withAlpha(T['--purple'], 0.12), stroke: T['--purple'], radius: 10 });
          G.label(ctx, w / 2, 38, '微内核（最小核心）', { size: 12, weight: 700, color: T['--purple'] });
          G.label(ctx, w / 2, 58, '进程调度 · 消息传递 · 基本内存', { size: 10, color: T['--ink-3'] });
          const srv = ['文件服务', '设备服务', '网络服务', '内存服务'];
          const bw = (w - 80) / srv.length;
          srv.forEach((m, k) => {
            const x = 40 + k * bw;
            G.box(ctx, x, p.h - 80, bw - 16, 54, { fill: D.withAlpha(T['--teal'], 0.12), stroke: D.withAlpha(T['--teal'], 0.6), radius: 8 });
            G.fitted(ctx, x + (bw - 16) / 2, p.h - 53, m, bw - 24, { size: 11, weight: 600, color: T['--ink'] });
            G.arrow(ctx, [[w / 2, 76], [x + (bw - 16) / 2, p.h - 80]], { color: D.withAlpha(T['--teal'], 0.6), width: 1.2, head: 5 });
          });
          G.label(ctx, w / 2, p.h - 14, '用户态服务器之间通过微内核消息通信', { size: 10.5, color: T['--ink-3'] });
        } else if (state.type === 'layered') {
          const layers = ['用户接口层', '文件系统层', '内存管理层', '进程调度层', '硬件抽象层'];
          const lh = (p.h - 40) / layers.length - 6;
          layers.forEach((m, k) => {
            const y = 16 + k * (lh + 6);
            G.box(ctx, 40, y, w - 80, lh, { fill: D.withAlpha(T['--brand'], 0.09 + k * 0.02), stroke: D.withAlpha(T['--brand'], 0.5), radius: 6 });
            G.label(ctx, w / 2, y + lh / 2, `${k + 1}. ${m}`, { size: 11.5, weight: 600, color: T['--ink'] });
          });
          G.label(ctx, w - 20, p.h - 10, '每层只依赖下一层', { align: 'right', size: 10, color: T['--ink-3'] });
        } else {
          G.box(ctx, 40, 20, w - 80, 44, { fill: D.withAlpha(T['--purple'], 0.1), stroke: T['--purple'], radius: 8 });
          G.label(ctx, w / 2, 42, '核心内核（基础功能）', { size: 12, weight: 700, color: T['--purple'] });
          const mods = ['驱动模块 A', '驱动模块 B', '文件模块', '网络模块'];
          const bw = (w - 100) / mods.length;
          mods.forEach((m, k) => {
            const x = 50 + k * bw;
            G.box(ctx, x, 100, bw - 14, 56, { fill: D.withAlpha(T['--brand'], 0.12), stroke: D.withAlpha(T['--brand'], 0.55), radius: 8 });
            G.fitted(ctx, x + (bw - 14) / 2, 128, m, bw - 22, { size: 11, weight: 600, color: T['--ink'] });
            G.arrow(ctx, [[w / 2, 64], [x + (bw - 14) / 2, 100]], { color: D.withAlpha(T['--brand'], 0.55), width: 1.2, head: 5 });
          });
          G.label(ctx, w / 2, p.h - 16, '模块可动态加载 / 卸载，通过接口调用', { size: 10.5, color: T['--ink-3'] });
        }
      });
      scene.render();
      UI.readout(out, [
        ['结构', it.name],
        ['优点', it.pros],
        ['缺点', it.cons]
      ]);
      const note = host.querySelector('.viz-note') || UI.note(host, '');
      note.innerHTML = it.desc;
    }
    render();
    return s;
  };


  /* ---------- 操作系统的四大特征 ---------- */
  W.osFeatures = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const feats = [
      { name: '并发', sub: '宏观同时 · 微观交替', rel: '并发是最基本的特征，与共享互为存在条件。' },
      { name: '共享', sub: '资源被多个进程使用', rel: '共享以并发为条件：没有并发就无所谓共享。' },
      { name: '虚拟', sub: '一个物理实体 → 多个逻辑对应物', rel: '虚拟以并发为前提，是并发带来的效果。' },
      { name: '异步', sub: '推进速度不可预知', rel: '异步是并发环境下多道程序推进的必然结果。' }
    ];
    const ALT = [
      ['单处理机（并发）', '双处理机（并行）'],
      ['互斥共享（打印机）', '同时共享（磁盘文件）'],
      ['时分复用（CPU）', '空分复用（内存）'],
      ['速度不可预知', '速度完全一致（假设）']
    ];
    const TOTAL = 12;
    const state = { fi: 0, alt: false, step: 1 };
    UI.seg(ctrl, feats.map((f, k) => ({ label: f.name, value: k })), (v, k) => {
      state.fi = k; state.alt = false; syncAlt(); render();
    }, 0);
    const altBtn = UI.button(ctrl, '', () => { state.alt = !state.alt; syncAlt(); render(); });
    UI.transport(ctrl, { total: TOTAL, onChange: k => { state.step = k + 1; render(); } });
    syncAlt();

    function syncAlt() {
      altBtn.textContent = '切换为：' + ALT[state.fi][state.alt ? 0 : 1];
    }

    function lane(ctx, x, y, w, h, label, segs, mt, T) {
      G.box(ctx, x, y, w, h, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
      G.label(ctx, x - 8, y + h / 2, label, { align: 'right', size: 10.5, color: T['--ink-3'] });
      const X = v => x + v / TOTAL * w;
      segs.forEach(sg => {
        const a = Math.max(0, Math.min(sg.s, mt)), b = Math.min(sg.e, mt);
        if (b <= a) return;
        G.box(ctx, X(a), y + 2, Math.max(2, X(b) - X(a)), h - 4, {
          fill: D.withAlpha(sg.color, sg.alpha || 0.22), stroke: sg.color, radius: 4
        });
        if (X(b) - X(a) > 30) G.label(ctx, (X(a) + X(b)) / 2, y + h / 2, sg.text || '', { size: 10, weight: 700, color: sg.color, mono: true });
      });
    }

    function axis(ctx, x, y, w, T, mt) {
      G.arrow(ctx, [[x, y], [x + w, y]], { color: D.withAlpha(T['--ink-3'], 0.9), width: 1.2, head: 6 });
      for (let v = 0; v <= TOTAL; v += 2) G.label(ctx, x + v / TOTAL * w, y + 12, String(v), { size: 9, color: T['--ink-3'], mono: true });
      G.arrow(ctx, [[x + mt / TOTAL * w, y - 4], [x + mt / TOTAL * w, y + 4]], { color: T['--red'], width: 2.2, head: 6 });
    }

    function status(ctx, y, p, T, text) {
      G.box(ctx, 16, y, p.w - 32, 24, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 6 });
      G.label(ctx, 28, y + 12, text, { align: 'left', size: 11, color: T['--brand'] });
    }


    function render() {
      const t = state.step;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 104, w = p.w - x0 - 24, y0 = 98;
        const cw = (p.w - 32 - 30) / 4;
        feats.forEach((f, k) => {
          const on = k === state.fi;
          const x = 16 + k * (cw + 10);
          G.box(ctx, x, 12, cw, 60, {
            fill: on ? D.withAlpha(T['--brand'], 0.16) : T['--card-2'],
            stroke: on ? T['--brand'] : T['--line'], width: on ? 2 : 1.2, radius: 9
          });
          G.label(ctx, x + cw / 2, 33, f.name, { size: 13, weight: 800, color: on ? T['--brand'] : T['--ink'] });
          G.fitted(ctx, x + cw / 2, 54, f.sub, cw - 14, { size: 10, weight: 500, color: T['--ink-3'], mono: false });
        });
        if (state.fi === 0) {
          if (!state.alt) {
            lane(ctx, x0, y0, w, 30, '处理机', [
              { s: 0, e: 4, color: T['--brand'], text: 'P₁' },
              { s: 4, e: 7, color: T['--teal'], text: 'P₂' },
              { s: 7, e: 10, color: T['--brand'], text: 'P₁' },
              { s: 10, e: 12, color: T['--teal'], text: 'P₂' }
            ], t, T);
            lane(ctx, x0, y0 + 40, w, 26, 'P₁', [{ s: 0, e: 4, color: T['--brand'], text: '运行' }, { s: 7, e: 10, color: T['--brand'], text: '运行' }], t, T);
            lane(ctx, x0, y0 + 74, w, 26, 'P₂', [{ s: 4, e: 7, color: T['--teal'], text: '运行' }, { s: 10, e: 12, color: T['--teal'], text: '运行' }], t, T);
            axis(ctx, x0, y0 + 112, w, T, t);
            status(ctx, p.h - 66, p, T, '单处理机：同一时间间隔内 P₁、P₂ 交替占用 CPU —— 宏观同时、微观交替，单核也能并发。');
          } else {
            lane(ctx, x0, y0, w, 32, 'CPU₁', [{ s: 0, e: 12, color: T['--brand'], text: 'P₁ 连续执行' }], t, T);
            lane(ctx, x0, y0 + 42, w, 32, 'CPU₂', [{ s: 0, e: 12, color: T['--teal'], text: 'P₂ 连续执行' }], t, T);
            axis(ctx, x0, y0 + 88, w, T, t);
            status(ctx, p.h - 66, p, T, '双处理机：同一时刻两个进程真正同时执行 —— 这才是并行，需要多处理机/多流水线。');
          }
        } else if (state.fi === 1) {
          if (!state.alt) {
            lane(ctx, x0, y0, w, 30, '打印机', [
              { s: 0, e: 5, color: T['--brand'], text: 'P₁ 独占使用' },
              { s: 6, e: 12, color: T['--teal'], text: 'P₂ 独占使用' }
            ], t, T);
            lane(ctx, x0, y0 + 40, w, 26, 'P₁', [{ s: 0, e: 5, color: T['--brand'], text: '使用' }, { s: 6, e: 12, color: T['--line-2'], text: '等待' }], t, T);
            lane(ctx, x0, y0 + 74, w, 26, 'P₂', [{ s: 0, e: 5, color: T['--line-2'], text: '等待' }, { s: 6, e: 12, color: T['--teal'], text: '使用' }], t, T);
            axis(ctx, x0, y0 + 112, w, T, t);
            status(ctx, p.h - 66, p, T, '互斥共享：打印机在一段时间内只允许一个进程访问，另一个进程必须等待。');
          } else {
            lane(ctx, x0, y0, w, 30, '磁盘文件', [{ s: 0, e: 12, color: T['--ink-3'], alpha: 0.08, text: '' }], t, T);
            G.box(ctx, x0 + 2, y0 + 5, Math.max(2, (w - 4) * Math.min(1, t / TOTAL)), 10, { fill: D.withAlpha(T['--brand'], 0.45), stroke: null, radius: 3 });
            G.box(ctx, x0 + 2, y0 + 17, Math.max(2, (w - 4) * Math.min(1, t / TOTAL)), 10, { fill: D.withAlpha(T['--teal'], 0.45), stroke: null, radius: 3 });
            G.label(ctx, x0 - 8, y0 + 10, 'P₁ 读写', { align: 'right', size: 9.5, color: T['--brand'] });
            G.label(ctx, x0 - 8, y0 + 22, 'P₂ 读写', { align: 'right', size: 9.5, color: T['--teal'] });
            lane(ctx, x0, y0 + 44, w, 26, 'P₁', [{ s: 0, e: 12, color: T['--brand'], text: '读/写文件' }], t, T);
            lane(ctx, x0, y0 + 78, w, 26, 'P₂', [{ s: 0, e: 12, color: T['--teal'], text: '读/写文件' }], t, T);
            axis(ctx, x0, y0 + 116, w, T, t);
            status(ctx, p.h - 66, p, T, '同时共享：一段时间内多个进程可“同时”访问磁盘文件（宏观同时，微观上可交替读写）。');
          }
        } else if (state.fi === 2) {
          if (!state.alt) {
            lane(ctx, x0, y0, w, 30, '物理 CPU', [
              { s: 0, e: 4, color: T['--brand'], text: 'P₁' },
              { s: 4, e: 8, color: T['--teal'], text: 'P₂' },
              { s: 8, e: 12, color: T['--purple'], text: 'P₃' }
            ], t, T);
            lane(ctx, x0, y0 + 40, w, 24, '虚拟 CPU₁', [{ s: 0, e: 4, color: T['--brand'], text: '以为独占' }], t, T);
            lane(ctx, x0, y0 + 70, w, 24, '虚拟 CPU₂', [{ s: 4, e: 8, color: T['--teal'], text: '以为独占' }], t, T);
            lane(ctx, x0, y0 + 100, w, 24, '虚拟 CPU₃', [{ s: 8, e: 12, color: T['--purple'], text: '以为独占' }], t, T);
            axis(ctx, x0, y0 + 134, w, T, t);
            status(ctx, p.h - 66, p, T, '时分复用：一个物理 CPU 被多个进程轮流使用，每个进程都以为自己独占了一台 CPU。');
          } else {
            const bw = (w - 16) / 3;
            ['A', 'B', 'C'].forEach((nm, k) => {
              const col = [T['--brand'], T['--teal'], T['--purple']][k];
              const bx = x0 + k * (bw + 8);
              G.box(ctx, bx, y0 + 4, bw, 62, { fill: D.withAlpha(col, 0.14), stroke: col, radius: 7 });
              G.label(ctx, bx + bw / 2, y0 + 26, '虚拟内存 ' + nm, { size: 11.5, weight: 700, color: col });
              G.fitted(ctx, bx + bw / 2, y0 + 48, '进程 ' + nm + ' 的地址空间', bw - 12, { size: 10, color: T['--ink-3'] });
              G.arrow(ctx, [[bx + bw / 2, y0 + 70], [bx + bw / 2, y0 + 88]], { color: col, width: 1.4, head: 6 });
              G.box(ctx, bx + 8, y0 + 88, bw - 16, 24, { fill: T['--card-2'], stroke: D.withAlpha(col, 0.6), radius: 5 });
              G.label(ctx, bx + bw / 2, y0 + 100, '进程 ' + nm, { size: 10.5, weight: 600, color: col });
            });
            axis(ctx, x0, y0 + 132, w, T, t);
            status(ctx, p.h - 66, p, T, '空分复用：物理内存被划分为多个分区，每个进程看到独立的逻辑地址空间。');
          }
        } else {
          const speeds = state.alt ? [1, 1, 1] : [1.35, 0.7, 1.05];
          const prog = (k, tt) => {
            let sum = 0, total = 0;
            for (let u = 1; u <= TOTAL; u++) {
              let sp = speeds[k];
              if (!state.alt && u % (k + 2) === 0) sp *= 0.15;
              total += speeds[k];
              if (u <= tt) sum += sp;
            }
            return sum / total;
          };
          ['P₁', 'P₂', 'P₃'].forEach((nm, k) => {
            const col = [T['--brand'], T['--teal'], T['--purple']][k];
            const y = y0 + 2 + k * 40;
            G.box(ctx, x0, y, w, 30, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
            G.label(ctx, x0 - 8, y + 15, nm, { align: 'right', size: 11, weight: 700, color: col });
            const pr = prog(k, t);
            if (pr > 0.01) G.box(ctx, x0 + 2, y + 2, Math.max(3, (w - 4) * pr), 26, { fill: D.withAlpha(col, 0.24), stroke: col, radius: 5 });
            G.label(ctx, Math.min(x0 + w - 30, x0 + 8 + (w - 16) * pr), y + 15, (pr * 100).toFixed(0) + '%', { size: 10, weight: 700, color: col, mono: true });
          });
          axis(ctx, x0, y0 + 128, w, T, t);
          status(ctx, p.h - 66, p, T, state.alt
            ? '假设各进程速度完全一致、互不干扰 —— 这只存在于单道顺序执行中，真实并发环境下必须处理异步。'
            : '异步：进程以不可预知的速度推进，操作系统必须保证任意交替顺序下结果都一致（靠同步互斥）。');
        }
      });
      scene.render();
      UI.readout(out, [
        ['当前特征', feats[state.fi].name],
        ['示意图', ALT[state.fi][state.alt ? 1 : 0]],
        ['要点', feats[state.fi].rel]
      ]);
    }
    render();
    return s;
  };


  /* ---------- 操作系统发展：吞吐量 / 响应时间 / 交互性 ---------- */
  W.osEvolution = function (host) {
    const s = UI.shellPlot(host, {
      height: 340, xMin: 0, xMax: 500, yMin: 0, yMax: 12,
      xLabel: '平均周转 / 响应时间（← 越小越好）', yLabel: '吞吐量（作业 / 千时间单位）',
      xTicks: 5, yTicks: 6
    });
    const { plot, ctrl, out, body } = s;
    body.classList.add('pad0');
    const MODES = [
      { name: '单道批处理', color: '--ink-3', inter: '无', metric: '周转时间', desc: '内存中仅一道作业，CPU 与 I/O 串行：资源利用率低、吞吐量最低，用户要等作业全部完成。' },
      { name: '多道批处理', color: '--brand', inter: '无', metric: '周转时间', desc: '内存中多道作业，CPU 与 I/O 重叠：吞吐量最高，但没有交互能力，作业周转时间较长。' },
      { name: '分时系统', color: '--accent', inter: '强', metric: '响应时间', desc: '时间片轮转，多用户交互：响应及时、交互性强，切换开销使吞吐量略低于多道批处理。' },
      { name: '实时系统', color: '--green', inter: '弱', metric: '响应时间', desc: '以在截止时间内完成为首要目标：响应快且有界，但为保证确定性需预留资源，吞吐量较低。' }
    ];
    const state = { sel: 1, n: 4, p: 0.4, q: 20 };
    UI.seg(ctrl, MODES.map(m => ({ label: m.name, value: m.name })), (v, k) => { state.sel = k; render(); }, 1);
    const nSlider = UI.slider(ctrl, { label: '并发道数 n', min: 2, max: 8, step: 1, value: 4, fmt: v => v + ' 道', onInput: v => { state.n = v; render(); } });
    UI.slider(ctrl, { label: 'I/O 等待比例 p', min: 0.1, max: 0.7, step: 0.05, value: 0.4, fmt: v => (v * 100).toFixed(0) + '%', onInput: v => { state.p = v; render(); } });
    UI.slider(ctrl, { label: '时间片 q', min: 5, max: 40, step: 5, value: 20, fmt: v => v, onInput: v => { state.q = v; render(); } });
    UI.transport(ctrl, { total: 7, onChange: k => { state.n = k + 2; nSlider.set(state.n); render(); } });
    const noteEl = UI.note(host, '简化模型：每道作业 CPU 时间 c = 100，等待 I/O 占其运行时间的比例 p，CPU 利用率 U = 1 − pⁿ（n 道作业同时等待 I/O 的概率为 pⁿ）。坐标系比较四种系统的<b>趋势</b>：多道批处理吞吐最高但无交互，分时系统响应快、交互强，实时系统响应最快但需预留资源。');

    function calc(n, p, q) {
      const c = 100;
      const U = 1 - Math.pow(p, n);
      const io = c * p / (1 - p);
      return [
        { thr: 10 * (1 - p), resp: (n + 1) / 2 * (c + io) },
        { thr: 10 * U, resp: (n + 1) / 2 * c / U },
        { thr: 9 * U, resp: q * n / 2 },
        { thr: 6 * (1 - p), resp: 2 }
      ];
    }


    function render() {
      const ms = calc(state.n, state.p, state.q);
      const maxR = Math.max(1, Math.max.apply(null, ms.map(m => m.resp))) * 1.3;
      const maxT = Math.max(1, Math.max.apply(null, ms.map(m => m.thr))) * 1.35;
      plot.setDomain(0, maxR, 0, maxT);
      plot.clearLayers();
      plot.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.box(ctx, p.px + 8, p.py + 6, 176, 26, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 6 });
        G.label(ctx, p.px + 96, p.py + 19, '理想方向：吞吐高、响应快', { size: 10.5, color: T['--green'] });
        G.arrow(ctx, [[p.px + 26, p.py + 72], [p.px + 10, p.py + 40]], { color: D.withAlpha(T['--green'], 0.7), width: 1.4, head: 7 });
        MODES.forEach((m, k) => {
          const on = k === state.sel;
          const x = p.X(ms[k].resp), y = p.Y(ms[k].thr);
          const col = T[m.color];
          if (on) {
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2);
            ctx.strokeStyle = D.withAlpha(col, 0.55); ctx.setLineDash([4, 3]); ctx.lineWidth = 1.4; ctx.stroke();
            ctx.restore();
          }
          G.dot(ctx, x, y, on ? 6.5 : 4.5, col, true);
          G.label(ctx, x + 13, y - 11, m.name, { align: 'left', size: on ? 11.5 : 10, weight: on ? 800 : 600, color: col });
          G.label(ctx, x + 13, y + 4, '吞吐 ' + ms[k].thr.toFixed(1) + ' · ' + m.metric + ' ' + ms[k].resp.toFixed(0), { align: 'left', size: 9, color: T['--ink-3'], mono: true });
        });
      });
      plot.render();
      const m = ms[state.sel];
      noteEl.innerHTML = MODES[state.sel].desc + '（提示：拖动滑杆或点击播放，观察 n 增大时多道批处理吞吐趋于饱和、周转时间随之上升。）';
      UI.readout(out, [
        ['系统', MODES[state.sel].name],
        ['吞吐量', m.thr.toFixed(1) + ' 作业/千时间单位'],
        ['平均' + MODES[state.sel].metric, m.resp.toFixed(0) + ' 时间单位'],
        ['交互性', MODES[state.sel].inter]
      ]);
    }
    render();
    return s;
  };

})(window);
