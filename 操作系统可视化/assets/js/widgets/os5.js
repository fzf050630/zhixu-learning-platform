/* ============================================================
   os5.js — 第5章 输入/输出管理 可视化组件
   ioStack：I/O 软件层次与请求流程
   diskSchedule：磁盘调度算法（FCFS / SSTF / SCAN / CSCAN）
   buffer：单缓冲 / 双缓冲的时间计算
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- I/O 软件层次 ---------- */
  W.ioStack = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const layers = [
      { name: '用户层 I/O 软件', desc: '如 printf、库函数，把用户请求转换为系统调用', colorKey: '--green' },
      { name: '设备独立性软件', desc: '统一接口、设备命名、缓冲、分配、错误处理、逻辑设备名映射', colorKey: '--brand' },
      { name: '设备驱动程序', desc: '把抽象命令转换为设备能识别的具体控制命令，操作寄存器', colorKey: '--purple' },
      { name: '中断处理程序', desc: '处理设备完成/异常中断，唤醒等待进程', colorKey: '--accent' },
      { name: '硬件设备', desc: '设备控制器与外设，执行实际的 I/O 操作', colorKey: '--teal' }
    ];
    let i = 2;
    UI.seg(ctrl, layers.map((l, k) => ({ label: l.name.split(' ')[0], value: k })), (v, k) => { i = k; render(); }, 2);

    function render() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const lh = (p.h - 30) / layers.length - 6;
        layers.forEach((l, k) => {
          const y = 14 + k * (lh + 6);
          const on = k === i;
          const color = T[l.colorKey];
          G.box(ctx, 24, y, p.w - 48, lh, {
            fill: on ? D.withAlpha(color, 0.2) : D.withAlpha(color, 0.07),
            stroke: on ? color : D.withAlpha(color, 0.4), width: on ? 2 : 1, radius: 8
          });
          G.label(ctx, 38, y + lh / 2 - 7, l.name, { align: 'left', size: 12, weight: 700, color: on ? color : T['--ink-2'] });
          G.label(ctx, 38, y + lh / 2 + 9, l.desc, { align: 'left', size: 10, color: T['--ink-3'] });
          if (k < layers.length - 1) G.arrow(ctx, [[p.w - 40, y + lh], [p.w - 40, y + lh + 6]], { color: D.withAlpha(color, 0.6), width: 1.4, head: 5 });
        });
        G.label(ctx, p.w - 46, p.h - 8, '请求下行，完成上行', { align: 'right', size: 10, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['当前层', layers[i].name], ['职责', layers[i].desc]]);
    }
    render();
    return s;
  };

  /* ---------- 磁盘调度算法 ---------- */
  W.diskSchedule = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { algo: 'SSTF', head: 53, dir: 'up' };
    const reqs = [98, 183, 37, 122, 14, 124, 65, 67];
    const maxCyl = 200;
    UI.seg(ctrl, [
      { label: 'FCFS', value: 'FCFS' }, { label: 'SSTF', value: 'SSTF' },
      { label: 'SCAN', value: 'SCAN' }, { label: 'C-SCAN', value: 'CSCAN' }
    ], v => { state.algo = v; render(); }, 1);
    UI.slider(ctrl, { label: '磁头初始位置', min: 0, max: 199, step: 1, value: 53, fmt: v => v, onInput: v => { state.head = v; render(); } });

    function order() {
      const seq = [];
      let cur = state.head;
      const remaining = [...reqs];
      if (state.algo === 'FCFS') return remaining.slice();
      if (state.algo === 'SSTF') {
        while (remaining.length) {
          let bi = 0, bd = Infinity;
          remaining.forEach((r, k) => { const d = Math.abs(r - cur); if (d < bd) { bd = d; bi = k; } });
          cur = remaining[bi]; seq.push(cur); remaining.splice(bi, 1);
        }
        return seq;
      }
      if (state.algo === 'SCAN') {
        const up = remaining.filter(r => r >= cur).sort((a, b) => a - b);
        const down = remaining.filter(r => r < cur).sort((a, b) => b - a);
        return up.concat(down);
      }
      // CSCAN：回到 0 再继续
      const up = remaining.filter(r => r >= cur).sort((a, b) => a - b);
      const down = remaining.filter(r => r < cur).sort((a, b) => a - b);
      return up.concat([199, 0]).concat(down);
    }

    function render() {
      const seq = order();
      let cur = state.head, movement = 0;
      const path = [state.head];
      seq.forEach(t => { if (t === 0 || t === 199) { movement += Math.abs(t - cur); cur = t; path.push(t); } movement += Math.abs(t - cur); cur = t; path.push(t); });
      movement = 0; cur = state.head;
      seq.forEach(t => { movement += Math.abs(t - cur); cur = t; });
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const x0 = 40, w = p.w - 60, y = 44, h = 34;
        const X = v => x0 + v / maxCyl * w;
        G.box(ctx, x0, y, w, h, { fill: T['--card-2'], stroke: T['--line'], radius: 6 });
        // 请求点
        reqs.forEach(r => {
          G.dot(ctx, X(r), y + h / 2, 3.5, T['--purple'], true);
        });
        // 磁头
        G.dot(ctx, X(state.head), y + h / 2, 5, T['--red'], true);
        G.label(ctx, X(state.head), y - 8, '磁头 ' + state.head, { size: 10, weight: 700, color: T['--red'], mono: true });
        // 移动折线
        const lineY = 100;
        G.label(ctx, x0, lineY - 10, `${state.algo} 寻道顺序：${seq.join(' → ')}`, { align: 'left', size: 10.5, color: T['--ink-2'], mono: true });
        let prev = state.head;
        const total = seq.length;
        seq.forEach((t, k) => {
          const px = x0 + (k + 0.5) / total * w;
          const py = lineY + 30 - t / maxCyl * 70;
          const qx = x0 + (k - 0.5) / total * w;
          const qy = lineY + 30 - prev / maxCyl * 70;
          G.arrow(ctx, [[k === 0 ? x0 : qx, k === 0 ? lineY + 30 - prev / maxCyl * 70 : qy], [px, py]], { color: T['--brand'], width: 1.6, head: 5 });
          G.label(ctx, px, py - 10, String(t), { size: 9.5, color: T['--brand'], mono: true });
          prev = t;
        });
        G.box(ctx, 16, p.h - 44, p.w - 32, 32, { fill: D.withAlpha(T['--green'], 0.1), stroke: D.withAlpha(T['--green'], 0.5), radius: 8 });
        G.label(ctx, 28, p.h - 28, `总寻道长度 = ${movement} 个磁道　·　平均寻道长度 = ${(movement / seq.length).toFixed(1)}`, { align: 'left', size: 12, weight: 700, color: T['--green'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['算法', state.algo],
        ['总寻道长度', String(movement)],
        ['平均寻道长度', (movement / seq.length).toFixed(1)],
        ['请求队列', reqs.join(' ')]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 缓冲技术 ---------- */
  W.buffer = function (host) {
    const s = UI.shell(host, 260);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { T: 100, C: 50, M: 20, mode: 'double' };
    UI.seg(ctrl, [{ label: '单缓冲', value: 'single' }, { label: '双缓冲', value: 'double' }], v => { state.mode = v; render(); }, 1);
    [['T 设备→缓冲', 'T'], ['C 缓冲→用户', 'C'], ['M 处理时间', 'M']].forEach(([label, key]) => {
      UI.slider(ctrl, { label, min: 5, max: 200, step: 5, value: state[key], fmt: v => v + ' µs', onInput: v => { state[key] = v; render(); } });
    });

    function render() {
      const { T, C, M } = state;
      const single = T + M;                     // 每块处理时间 max(C,T)+M 的经典结果；这里展示 max(C,T)+M
      const singleTime = Math.max(C, T) + M;
      const doubleTime = Math.max(C, M) + T;    // 双缓冲每块
      const perBlock = state.mode === 'double' ? doubleTime : singleTime;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const TH = D.Theme.cache;
        const w = p.w;
        // 时间轴
        const scale = (w - 80) / (Math.max(T, C, M) * 3);
        const y0 = 50;
        const lanes = ['设备输入', '处理/传送'];
        const drawLane = (y, label, segs, color) => {
          G.label(ctx, 30, y, label, { align: 'right', size: 10.5, color: TH['--ink-2'] });
          ctx.save(); ctx.strokeStyle = TH['--line']; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w - 20, y); ctx.stroke(); ctx.restore();
          segs.forEach(([a, b, t]) => {
            const x1 = 40 + a * scale, x2 = 40 + b * scale;
            G.box(ctx, x1, y - 11, x2 - x1, 22, { fill: D.withAlpha(color, 0.2), stroke: color, radius: 4 });
            G.fitted(ctx, (x1 + x2) / 2, y, t, x2 - x1 - 6, { size: 10, weight: 700, color, mono: true });
          });
        };
        if (state.mode === 'single') {
          drawLane(y0, '设备输入', [[0, T, 'T 输入'], [T, T + C, 'C 传送']], TH['--brand']);
          drawLane(y0 + 40, 'CPU 处理', [[T, T + M, 'M 处理'], [T + C + Math.max(0, M - C), T + C + Math.max(0, M - C) + M, 'M']], TH['--green']);
          G.label(ctx, w / 2, 20, `单缓冲：每块耗时 = max(T, C) + M = max(${T},${C}) + ${M} = ${singleTime} µs`, { size: 12, weight: 700, color: TH['--ink'] });
        } else {
          drawLane(y0, '设备输入', [[0, T, 'T 输入'], [T, 2 * T, 'T 输入']], TH['--brand']);
          drawLane(y0 + 40, 'CPU 处理', [[T, T + M, 'M 处理'], [2 * T, 2 * T + M, 'M 处理']], TH['--green']);
          G.label(ctx, w / 2, 20, `双缓冲：每块耗时 = max(T, C + M)... 取 max(T, C+M) 与流水近似 = ${doubleTime} µs`, { size: 12, weight: 700, color: TH['--ink'] });
        }
        G.box(ctx, 16, p.h - 40, w - 32, 28, { fill: D.withAlpha(TH['--green'], 0.1), stroke: D.withAlpha(TH['--green'], 0.5), radius: 7 });
        G.label(ctx, 28, p.h - 26, `处理 1 块数据的时间 ≈ ${perBlock} µs`, { align: 'left', size: 12, weight: 700, color: TH['--green'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        ['方式', state.mode === 'double' ? '双缓冲' : '单缓冲'],
        ['每块时间', perBlock + ' µs'],
        ['T / C / M', `${T} / ${C} / ${M} µs`]
      ]);
    }
    render();
    return s;
  };


  /* ---------- SPOOLing 假脱机系统 ---------- */
  W.spooling = function (host) {
    const s = UI.shell(host, 380);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    let n = 5;
    const state = { flow: 'out', step: 0, trans: null };
    const holder = UI.el('div', 'ctrl-group');
    ctrl.appendChild(holder);
    UI.seg(ctrl, [{ label: '假脱机输出（打印机）', value: 'out' }, { label: '假脱机输入（输入机）', value: 'in' }], (v) => { state.flow = v; rebuild(); }, 0);
    UI.slider(ctrl, { label: '并发用户进程数', min: 2, max: 8, step: 1, value: n, fmt: v => v + ' 个', onInput: v => { n = v; rebuild(); } });
    UI.note(host, 'SPOOLing（Simultaneous Peripheral Operations On-Line）：用磁盘上的<b>输入井 / 输出井</b>配合<b>输入进程 / 输出进程</b>，把打印机等独占设备改造成可被多个用户共享的<b>虚拟设备</b>——用户只与“井”打交道，独占设备由专门的进程统一驱动。');
    rebuild();

    function rebuild() {
      if (state.trans) state.trans.stop();
      holder.innerHTML = '';
      state.step = 0;
      state.trans = UI.transport(holder, { total: 1 + 2 * n, speed: 900, onChange: k => { state.step = k; render(); } });
      render();
    }

    function model() {
      const out = state.flow === 'out';
      const step = state.step;
      const files = [];
      let busy = false, actor = '', action = '', activeUser = -1, activeWell = null;
      if (out) {
        if (step >= 1 && step <= n) {
          const i = step - 1;
          for (let k = 0; k <= i; k++) files.push('作业' + (k + 1));
          actor = '用户进程 ' + (i + 1); action = '把打印数据写入输出井（不必等待打印机）'; activeUser = i; activeWell = 'out';
        } else if (step > n) {
          const j = step - n - 1;
          for (let k = j + 1; k < n; k++) files.push('作业' + (k + 1));
          busy = true;
          actor = '输出进程'; action = '从输出井取出作业' + (j + 1) + '，送打印机打印完成'; activeWell = 'out';
        } else {
          actor = '初始'; action = '输出井为空，打印机空闲，等待用户进程提交打印请求';
        }
      } else {
        if (step >= 1 && step <= n) {
          const i = step - 1;
          for (let k = 0; k <= i; k++) files.push('数据' + (k + 1));
          busy = true;
          actor = '输入进程'; action = '把输入设备的数据预读入输入井（设备忙）'; activeWell = 'in';
        } else if (step > n) {
          const j = step - n - 1;
          for (let k = j + 1; k < n; k++) files.push('数据' + (k + 1));
          actor = '用户进程 ' + (j + 1); action = '从输入井读取数据（不必等待输入机）'; activeUser = j; activeWell = 'in';
        } else {
          actor = '初始'; action = '输入井为空，输入机空闲，等待输入进程预读数据';
        }
      }
      return { out, step, files, busy, actor, action, activeUser, activeWell };
    }

    function render() {
      const m = model();
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        const color = m.out ? T['--brand'] : T['--teal'];
        const devName = m.out ? '打印机' : '输入机';
        const procName = m.out ? '输出进程' : '输入进程';
        const xDev = 16, wDev = Math.max(96, w * 0.15);
        const xProc = xDev + wDev + 34, wProc = Math.max(104, w * 0.16);
        const xDisk = xProc + wProc + 34, wDisk = Math.max(150, w * 0.34);
        const xUser = w - 16 - Math.max(110, w * 0.17), wUser = Math.max(110, w * 0.17);
        const yBox = 78, hBox = 96;
        G.label(ctx, w / 2, 16, 'SPOOLing 假脱机系统：' + (m.out ? '输出流程（独占打印机 → 共享虚拟设备）' : '输入流程（独占输入机 → 共享虚拟设备）'), { size: 12, weight: 700, color: T['--ink'] });
        G.label(ctx, w - 20, 16, '步骤 ' + (m.step + 1) + ' / ' + (1 + 2 * n), { align: 'right', size: 10.5, color: T['--ink-3'], mono: true });
        // 设备
        G.box(ctx, xDev, yBox, wDev, hBox, {
          fill: m.busy ? D.withAlpha(T['--accent'], 0.16) : T['--card-2'],
          stroke: m.busy ? T['--accent'] : T['--line'], width: m.busy ? 2 : 1.2, radius: 9
        });
        G.label(ctx, xDev + wDev / 2, yBox + 16, devName, { size: 12, weight: 800, color: T['--ink'] });
        G.label(ctx, xDev + wDev / 2, yBox + 34, '独占设备', { size: 9.5, color: T['--ink-3'] });
        G.label(ctx, xDev + wDev / 2, yBox + 62, m.busy ? '忙（被独占使用）' : '空闲', { size: 10.5, weight: 700, color: m.busy ? T['--accent'] : T['--green'] });
        // 输入/输出进程
        G.box(ctx, xProc, yBox, wProc, hBox, {
          fill: (m.step > n) === m.out ? D.withAlpha(color, 0.15) : T['--card-2'],
          stroke: D.withAlpha(color, 0.6), radius: 9
        });
        G.label(ctx, xProc + wProc / 2, yBox + 16, procName, { size: 11.5, weight: 800, color: color });
        G.label(ctx, xProc + wProc / 2, yBox + 34, m.out ? '（缓输出）' : '（预输入）', { size: 9.5, color: T['--ink-3'] });
        G.label(ctx, xProc + wProc / 2, yBox + 62, '统一驱动设备', { size: 10, color: T['--ink-2'] });
        // 磁盘与两个井
        G.box(ctx, xDisk, yBox - 22, wDisk, hBox + 44, { fill: D.withAlpha(T['--purple'], 0.07), stroke: T['--purple'], radius: 10 });
        G.label(ctx, xDisk + wDisk / 2, yBox - 8, '磁盘（共享设备）', { size: 11, weight: 700, color: T['--purple'] });
        const wellW = (wDisk - 30) / 2, wellH = hBox - 10;
        const wells = [
          { name: '输入井', on: m.activeWell === 'in', x: xDisk + 10 },
          { name: '输出井', on: m.activeWell === 'out', x: xDisk + 20 + wellW }
        ];
        const cap = Math.max(n, 2);
        const wellCols = cap <= 4 ? cap : Math.ceil(cap / 2);
        const wellRows = Math.ceil(cap / wellCols);
        const padX = 8, padTop = 26, padBot = 14;
        const cellW = (wellW - padX * 2) / wellCols;
        const cellH = (wellH - padTop - padBot - (wellRows - 1) * 4) / wellRows;
        wells.forEach(wl => {
          G.box(ctx, wl.x, yBox, wellW, wellH, {
            fill: wl.on ? D.withAlpha(color, 0.14) : T['--card-2'],
            stroke: wl.on ? color : T['--line'], width: wl.on ? 2 : 1.2, radius: 7
          });
          G.label(ctx, wl.x + wellW / 2, yBox + 14, wl.name, { size: 11, weight: 700, color: wl.on ? color : T['--ink-3'] });
          for (let k = 0; k < cap; k++) {
            const r = Math.floor(k / wellCols), c = k % wellCols;
            const x = wl.x + padX + c * cellW;
            const y = yBox + padTop + r * (cellH + 4);
            const filled = k < m.files.length;
            G.box(ctx, x + 1, y, Math.max(4, cellW - 3), cellH, {
              fill: filled ? D.withAlpha(color, 0.22) : 'transparent',
              stroke: filled ? color : T['--line'], dash: filled ? null : [3, 3], radius: 4
            });
            if (filled) {
              const txt = cellW >= 30 ? m.files[k] : String(k + 1);
              G.fitted(ctx, x + cellW / 2, y + cellH / 2, txt, cellW - 6, { size: cellW >= 30 ? 9 : 10, weight: 700, color: color });
            }
          }
          const used = wl.name === (m.out ? '输出井' : '输入井') ? m.files.length : 0;
          G.label(ctx, wl.x + wellW / 2, yBox + wellH - 8, '容量 ' + cap + ' · 已用 ' + used + ' 项', { size: 9, color: T['--ink-3'], mono: true });
        });
        // 用户进程
        const uTop = yBox + 6, uBottom = p.h - 72;
        const uRowGap = Math.min(30, (uBottom - uTop) / n);
        const uRowH = Math.min(26, uRowGap - 4);
        const panelBottom = Math.min(uBottom, uTop + n * uRowGap + 8);
        G.box(ctx, xUser, yBox - 22, wUser, panelBottom - (yBox - 22), { fill: T['--card-2'], stroke: T['--line'], radius: 10 });
        G.label(ctx, xUser + wUser / 2, yBox - 8, '用户进程', { size: 11, weight: 700, color: T['--ink-2'] });
        for (let k = 0; k < n; k++) {
          const on = k === m.activeUser;
          const y = uTop + k * uRowGap;
          G.box(ctx, xUser + 10, y, wUser - 20, uRowH, {
            fill: on ? D.withAlpha(color, 0.2) : T['--card'],
            stroke: on ? color : T['--line'], width: on ? 2 : 1, radius: 6
          });
          G.fitted(ctx, xUser + wUser / 2, y + uRowH / 2, '用户 ' + (k + 1) + (on ? '（' + (m.out ? '提交输出' : '读取输入') + '）' : ''), wUser - 24, { size: 10, weight: on ? 700 : 500, color: on ? color : T['--ink-2'] });
        }
        // 路径箭头
        const arrow = (a, b, on, label) => {
          const p1 = [a[0], a[1]], p2 = [b[0], b[1]];
          G.arrow(ctx, [p1, p2], { color: on ? T['--red'] : D.withAlpha(T['--ink-3'], 0.45), width: on ? 2.4 : 1.2, head: 7 });
          G.label(ctx, (p1[0] + p2[0]) / 2, p1[1] - 9, label, { size: 9.5, weight: on ? 700 : 500, color: on ? T['--red'] : T['--ink-3'] });
          if (on) {
            const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2;
            G.dot(ctx, mx, my + 12, 4.5, T['--red'], true);
          }
        };
        const yTop = yBox + hBox + 26, yBot = yBox + hBox + 62;
        if (m.out) {
          arrow([xUser, yTop], [xDisk + wDisk - 12, yTop], m.step >= 1 && m.step <= n, '写输出井');
          arrow([xDisk + wDisk / 2 - 10, yBot], [xProc + wProc / 2, yBot], m.step > n, '取文件');
          arrow([xProc + wProc / 2 - 8, yBox - 12], [xDev + wDev - 10, yBox - 12], m.step > n, '打印');
        } else {
          arrow([xDev + wDev, yTop], [xDisk + 12, yTop], m.step >= 1 && m.step <= n, '预读入井');
          arrow([xDisk + 12, yBot], [xUser, yBot], m.step > n, '读输入井');
        }
        // 状态条
        G.box(ctx, 16, p.h - 62, w - 32, 26, { fill: D.withAlpha(color, 0.12), stroke: D.withAlpha(color, 0.5), radius: 7 });
        G.label(ctx, 28, p.h - 49, m.actor + '：' + m.action, { align: 'left', size: 11.5, weight: 700, color: color });
        G.label(ctx, 28, p.h - 24, m.out
          ? '多个用户可同时提交打印任务（写入输出井），打印机由输出进程按序独占使用 —— 独占设备被虚拟为共享设备。'
          : '输入进程先把数据预读入输入井（设备忙），用户进程随到随读 —— 独占输入机被虚拟为共享设备。', { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['流程', m.out ? '假脱机输出' : '假脱机输入'],
        [(m.out ? '输出井' : '输入井') + '内容', m.files.length ? m.files.join('、') : '（空）'],
        [m.out ? '打印机状态' : '输入机状态', m.busy ? '忙（独占）' : '空闲'],
        ['当前动作', m.actor]
      ]);
    }
    return s;
  };

})(window);
