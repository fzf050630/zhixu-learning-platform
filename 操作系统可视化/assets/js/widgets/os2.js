/* ============================================================
   os2.js — 第2章 进程与处理机调度 可视化组件
   processState：进程状态转换     scheduler：处理机调度算法
   syncPV：信号量 PV 与生产者消费者  banker：银行家算法
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ---------- 进程状态转换 ---------- */
  W.processState = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const states = [
      { id: 'new', name: '创建', x: 0.13, y: 0.14, color: C('--ink-3') },
      { id: 'ready', name: '就绪', x: 0.5, y: 0.2, color: C('--brand') },
      { id: 'run', name: '运行', x: 0.5, y: 0.55, color: C('--green') },
      { id: 'block', name: '阻塞', x: 0.85, y: 0.55, color: C('--accent') },
      { id: 'end', name: '终止', x: 0.85, y: 0.14, color: C('--ink-3') }
    ];
    const trans = [
      { from: 'new', to: 'ready', label: '创建完成/许可', desc: '进程被创建后进入就绪队列，等待处理机。' },
      { from: 'ready', to: 'run', label: '调度', desc: '调度程序选择一个就绪进程占用 CPU，状态变为运行。' },
      { from: 'run', to: 'ready', label: '时间片到/被抢占', desc: '时间片用完或有更高优先级进程就绪，运行进程回到就绪。' },
      { from: 'run', to: 'block', label: '请求 I/O / 申请资源', desc: '进程因等待某事件（I/O 完成、信号量）主动放弃 CPU，进入阻塞。' },
      { from: 'block', to: 'ready', label: '事件完成', desc: '等待的事件发生后，阻塞进程被唤醒，进入就绪。' },
      { from: 'run', to: 'end', label: '结束', desc: '进程执行完毕或异常终止，释放资源。' }
    ];
    let ti = 0;
    UI.seg(ctrl, trans.map(t => ({ label: t.label, value: t.label })), (v, k) => { ti = k; render(); }, 0);

    function render() {
      const tr = trans[ti];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const pos = id => {
          const st = states.find(x => x.id === id);
          return [40 + st.x * (p.w - 80), 26 + st.y * (p.h - 60)];
        };
        // 箭头（非高亮）
        trans.forEach((t, k) => {
          if (k === ti) return;
          drawArrow(ctx, pos(t.from), pos(t.to), D.withAlpha(T['--line-2'], 0.9), 1.3, t.from, t.to);
        });
        // 高亮箭头
        drawArrow(ctx, pos(tr.from), pos(tr.to), T['--red'], 2.6, tr.from, tr.to);
        states.forEach(st => {
          const [x, y] = pos(st.id);
          const on = st.id === tr.from || st.id === tr.to;
          G.box(ctx, x - 46, y - 22, 92, 44, {
            fill: on ? D.withAlpha(st.color, 0.2) : T['--card'],
            stroke: on ? st.color : T['--line-2'], width: on ? 2 : 1.2, radius: 10
          });
          G.label(ctx, x, y, st.name, { size: 13, weight: 700, color: on ? st.color : T['--ink'] });
        });
        G.box(ctx, 16, p.h - 30, p.w - 32, 22, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 5 });
        G.label(ctx, p.w / 2, p.h - 19, `${states.find(s2 => s2.id === tr.from).name} → ${states.find(s2 => s2.id === tr.to).name}`, { size: 11.5, weight: 700, color: T['--brand'] });
      });
      scene.render();
      UI.readout(out, [['当前转换', tr.label], ['说明', tr.desc]]);
    }

    function drawArrow(ctx, a, b, color, width, from, to) {
      // 根据方向做简单偏移，避免箭头重叠
      const off = 0.5;
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const sx = a[0] + Math.cos(ang) * 46, sy = a[1] + Math.sin(ang) * 22;
      const ex = b[0] - Math.cos(ang) * 46, ey = b[1] - Math.sin(ang) * 22;
      const bend = 0.14;
      const mx = (sx + ex) / 2 - Math.sin(ang) * 70 * bend;
      const my = (sy + ey) / 2 + Math.cos(ang) * 70 * bend;
      if ((from === 'run' && to === 'ready') || (from === 'block' && to === 'ready') || (from === 'run' && to === 'block')) {
        G.arrow(ctx, [[sx, sy], [mx, my], [ex, ey]], { color, width, head: 7 });
      } else {
        G.arrow(ctx, [[sx, sy], [ex, ey]], { color, width, head: 7 });
      }
    }
    render();
    return s;
  };

  /* ---------- 处理机调度算法 ---------- */
  W.scheduler = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const procs = [
      { name: 'P1', arr: 0, burst: 7 },
      { name: 'P2', arr: 2, burst: 4 },
      { name: 'P3', arr: 4, burst: 1 },
      { name: 'P4', arr: 5, burst: 4 }
    ];
    const state = { algo: 'FCFS', q: 3 };
    UI.seg(ctrl, [
      { label: 'FCFS', value: 'FCFS' }, { label: 'SJF', value: 'SJF' },
      { label: 'RR', value: 'RR' }, { label: '优先级', value: 'PRIO' }
    ], v => { state.algo = v; render(); }, 0);
    UI.slider(ctrl, { label: '时间片 q', min: 1, max: 8, step: 1, value: 3, fmt: v => v, onInput: v => { state.q = v; render(); } });

    function schedule() {
      const P = procs.map(p => ({ ...p, remain: p.burst, start: null, finish: 0 }));
      const gantt = [];
      if (state.algo === 'FCFS') {
        const order = [...P].sort((a, b) => a.arr - b.arr);
        let t = 0;
        order.forEach(pr => { t = Math.max(t, pr.arr); pr.start = t; gantt.push({ name: pr.name, s: t, e: t + pr.burst }); t += pr.burst; pr.finish = t; });
      } else if (state.algo === 'SJF') {
        let t = 0, done = 0;
        while (done < P.length) {
          const ready = P.filter(pr => pr.remain > 0 && pr.arr <= t);
          if (!ready.length) { t++; continue; }
          ready.sort((a, b) => a.remain - b.remain || a.arr - b.arr);
          const pr = ready[0]; pr.start = t; gantt.push({ name: pr.name, s: t, e: t + pr.remain }); t += pr.remain; pr.finish = t; pr.remain = 0; done++;
        }
      } else if (state.algo === 'RR') {
        const qq = [...P].sort((a, b) => a.arr - b.arr);
        const queue = []; let t = 0, idx = 0;
        const push = () => { while (idx < qq.length && qq[idx].arr <= t) queue.push(qq[idx++]); };
        push();
        while (queue.length) {
          const pr = queue.shift();
          const run = Math.min(state.q, pr.remain);
          if (pr.start === null) pr.start = t;
          gantt.push({ name: pr.name, s: t, e: t + run });
          t += run; pr.remain -= run;
          push();
          if (pr.remain > 0) queue.push(pr); else pr.finish = t;
        }
      } else {
        let t = 0, done = 0;
        const prio = { P1: 3, P2: 1, P3: 4, P4: 2 };
        while (done < P.length) {
          const ready = P.filter(pr => pr.remain > 0 && pr.arr <= t);
          if (!ready.length) { t++; continue; }
          ready.sort((a, b) => prio[a.name] - prio[b.name]);
          const pr = ready[0]; pr.start = t; gantt.push({ name: pr.name, s: t, e: t + pr.remain }); t += pr.remain; pr.finish = t; pr.remain = 0; done++;
        }
      }
      return { gantt, P };
    }

    function render() {
      const { gantt, P } = schedule();
      const end = Math.max(...gantt.map(g => g.e), 1);
      const avgTurn = P.reduce((a, p) => a + (p.finish - p.arr), 0) / P.length;
      const avgWait = P.reduce((a, p) => a + (p.finish - p.arr - p.burst), 0) / P.length;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const left = 46, top = 44, w = p.w - left - 20, h = 54;
        G.label(ctx, left, 22, `${state.algo === 'RR' ? 'RR(q=' + state.q + ')' : state.algo} 调度甘特图`, { align: 'left', size: 12, weight: 700, color: T['--ink'] });
        const colors = { P1: T['--brand'], P2: T['--purple'], P3: T['--accent'], P4: T['--teal'] };
        gantt.forEach(g => {
          const x = left + g.s / end * w, bw = (g.e - g.s) / end * w;
          G.box(ctx, x, top, bw, h, { fill: D.withAlpha(colors[g.name], 0.22), stroke: colors[g.name], radius: 5 });
          G.label(ctx, x + bw / 2, top + h / 2, g.name, { size: 12, weight: 700, color: colors[g.name], mono: true });
          G.label(ctx, x, top - 10, String(g.s), { size: 9.5, color: T['--ink-3'], mono: true });
        });
        G.label(ctx, left + w, top - 10, String(end), { size: 9.5, color: T['--ink-3'], mono: true });
        // 就绪队列示意
        const row = P.map(pr => `${pr.name}(a=${pr.arr},b=${pr.burst})`).join('  ');
        G.label(ctx, left, top + h + 26, `进程：${row}`, { align: 'left', size: 11, color: T['--ink-2'], mono: true });
        const rows = P.map(pr => `${pr.name}: 完成 ${pr.finish}　周转 ${pr.finish - pr.arr}　带权 ${((pr.finish - pr.arr) / pr.burst).toFixed(2)}`);
        rows.forEach((r, k) => G.label(ctx, left + k * (w / P.length), top + h + 48, r, { align: 'left', size: 10.5, color: T['--ink-3'], mono: true }));
      });
      scene.render();
      UI.readout(out, [
        ['平均周转时间', avgTurn.toFixed(2)],
        ['平均等待时间', avgWait.toFixed(2)],
        ['算法', state.algo === 'RR' ? '时间片轮转 q=' + state.q : state.algo]
      ]);
    }
    render();
    return s;
  };

  /* ---------- 信号量 PV：生产者-消费者 ---------- */
  W.syncPV = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const N = 4;
    // 脚本化演示
    const script = [
      { who: '生产者', op: 'P(empty)', empty: 2, full: 0, mutex: 1, buf: [1], msg: 'empty=2>0，通过；准备写入缓冲区' },
      { who: '生产者', op: 'P(mutex)', empty: 2, full: 0, mutex: 0, buf: [1], msg: 'mutex=1>0，获得临界区访问权' },
      { who: '生产者', op: '放入缓冲区', empty: 2, full: 0, mutex: 0, buf: [1], msg: '产品写入缓冲区' },
      { who: '生产者', op: 'V(mutex) V(full)', empty: 2, full: 1, mutex: 1, buf: [1], msg: '退出临界区，full+1 通知消费者' },
      { who: '消费者', op: 'P(full)', empty: 2, full: 0, mutex: 1, buf: [1], msg: 'full=1>0，通过；准备读取' },
      { who: '消费者', op: 'P(mutex)', empty: 2, full: 0, mutex: 0, buf: [1], msg: '进入临界区' },
      { who: '消费者', op: '取出产品', empty: 2, full: 0, mutex: 0, buf: [], msg: '从缓冲区取走产品' },
      { who: '消费者', op: 'V(mutex) V(empty)', empty: 3, full: 0, mutex: 1, buf: [], msg: '退出临界区，empty+1 唤醒生产者' }
    ];
    let i = 0;
    const t = UI.transport(ctrl, { total: script.length, onChange: k => { i = k; render(); } });

    function render() {
      const st = script[i];
      const total = 4;
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 生产者/消费者
        G.box(ctx, 20, 30, 90, 54, { fill: D.withAlpha(st.who === '生产者' ? T['--brand'] : T['--line-2'], st.who === '生产者' ? 0.2 : 0.1), stroke: T['--brand'], radius: 8 });
        G.label(ctx, 65, 57, '生产者', { size: 12, weight: 700, color: T['--brand'] });
        G.box(ctx, p.w - 110, 30, 90, 54, { fill: D.withAlpha(st.who === '消费者' ? T['--teal'] : T['--line-2'], st.who === '消费者' ? 0.2 : 0.1), stroke: T['--teal'], radius: 8 });
        G.label(ctx, p.w - 65, 57, '消费者', { size: 12, weight: 700, color: T['--teal'] });
        // 缓冲区
        const bx = 150, bw = p.w - 300, cell = bw / N;
        G.label(ctx, 150 + bw / 2, 20, `缓冲区（容量 ${N}）`, { size: 11.5, weight: 700, color: T['--ink-2'] });
        for (let k = 0; k < N; k++) {
          const x = bx + k * cell, filled = k < st.buf.length;
          G.box(ctx, x + 4, 34, cell - 8, 46, {
            fill: filled ? D.withAlpha(T['--green'], 0.2) : T['--card-2'],
            stroke: filled ? T['--green'] : T['--line'], radius: 6
          });
          G.label(ctx, x + cell / 2, 57, filled ? '数据' : '空', { size: 11, weight: filled ? 700 : 500, color: filled ? T['--green'] : T['--ink-3'] });
        }
        // 信号量
        const sig = [['empty', st.empty, T['--accent']], ['full', st.full, T['--green']], ['mutex', st.mutex, T['--purple']]];
        sig.forEach((sg, k) => {
          const x = 30 + k * ((p.w - 60) / 3);
          G.box(ctx, x, 108, (p.w - 60) / 3 - 14, 44, { fill: D.withAlpha(sg[2], 0.12), stroke: D.withAlpha(sg[2], 0.6), radius: 8 });
          G.label(ctx, x + ((p.w - 60) / 3 - 14) / 2, 124, sg[0], { size: 11, weight: 700, color: sg[2], mono: true });
          G.label(ctx, x + ((p.w - 60) / 3 - 14) / 2, 140, '= ' + sg[1], { size: 14, weight: 800, color: sg[2], mono: true });
        });
        G.box(ctx, 16, p.h - 44, p.w - 32, 32, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, 28, p.h - 28, `${st.who}：${st.op}`, { align: 'left', size: 12, weight: 700, color: T['--ink'] });
        G.label(ctx, p.w - 28, p.h - 28, st.msg, { align: 'right', size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [['当前操作', `${st.who} ${st.op}`], ['empty/full/mutex', `${st.empty} / ${st.full} / ${st.mutex}`]]);
    }
    render();
    return s;
  };

  /* ---------- 银行家算法 ---------- */
  W.banker = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const A = 3;
    const available = [3, 3, 2];
    const max = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
    const alloc = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]];
    const names = ['P0', 'P1', 'P2', 'P3', 'P4'];
    const state = { proc: 1, req: [1, 0, 0] };

    UI.seg(ctrl, names.map(n => ({ label: n, value: n })), (v, k) => { state.proc = k; render(); }, 1);
    UI.note(host, '银行家算法：请求向量 Request ≤ Need 且 ≤ Available 时试探分配，再检查系统能否找到安全序列；找不到则拒绝，恢复原状。');
    ['A', 'B', 'C'].forEach((r, ri) => {
      UI.slider(ctrl, {
        label: '请求 ' + r, min: 0, max: 9, step: 1, value: state.req[ri],
        fmt: v => v, onInput: v => { state.req[ri] = v; render(); }
      });
    });

    function need(i) { return max[i].map((m, k) => m - alloc[i][k]); }
    function tryAllocate(i, req) {
      const n = need(i);
      if (req.some((r, k) => r > n[k])) return { ok: false, why: 'Request 超过 ' + names[i] + ' 的 Need' };
      if (req.some((r, k) => r > available[k])) return { ok: false, why: 'Request 超过系统 Available，需等待' };
      const av = available.map((a, k) => a - req[k]);
      const al = alloc.map((row, k) => k === i ? row.map((x, q) => x + req[q]) : row.slice());
      const nd = max.map((row, k) => row.map((m, q) => m - al[k][q]));
      // 安全性检查
      const finish = names.map(() => false);
      const seq = [];
      while (seq.length < names.length) {
        let progressed = false;
        for (let k = 0; k < names.length; k++) {
          if (finish[k]) continue;
          if (nd[k].every((x, q) => x <= av[q])) {
            for (let q = 0; q < A; q++) av[q] += al[k][q];
            finish[k] = true; seq.push(names[k]); progressed = true;
          }
        }
        if (!progressed) return { ok: false, why: '找不到安全序列，分配后系统不安全', need: nd, seq };
      }
      return { ok: true, why: '系统安全', seq, need: nd };
    }

    function render() {
      const nd = need(state.proc);
      const res = tryAllocate(state.proc, state.req);
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        // 矩阵
        const cols = ['进程', 'Max', 'Allocation', 'Need', 'Available'];
        const colW = (p.w - 40) / cols.length;
        G.label(ctx, 20, 22, 'Max / Allocation / Need', { align: 'left', size: 11, weight: 700, color: T['--ink-3'] });
        cols.forEach((c, k) => G.label(ctx, 20 + k * colW + colW / 2, 38, c, { size: 10.5, weight: 700, color: T['--ink-2'] }));
        names.forEach((n, i) => {
          const y = 52 + i * 24;
          const on = i === state.proc;
          if (on) G.box(ctx, 16, y - 11, p.w - 196, 22, { fill: D.withAlpha(T['--brand'], 0.1), stroke: 'transparent', radius: 4 });
          G.label(ctx, 20 + colW / 2, y, n, { size: 11, weight: 700, color: on ? T['--brand'] : T['--ink'], mono: true });
          G.label(ctx, 20 + colW * 1.5, y, max[i].join(' '), { size: 10.5, color: T['--ink-2'], mono: true });
          G.label(ctx, 20 + colW * 2.5, y, alloc[i].join(' '), { size: 10.5, color: T['--ink-2'], mono: true });
          G.label(ctx, 20 + colW * 3.5, y, need(i).join(' '), { size: 10.5, color: T['--accent'], mono: true });
        });
        G.box(ctx, p.w - 170, 44, 150, 30, { fill: D.withAlpha(T['--green'], 0.12), stroke: D.withAlpha(T['--green'], 0.5), radius: 6 });
        G.label(ctx, p.w - 95, 59, `Available ${available.join(' ')}`, { size: 11, weight: 700, color: T['--green'], mono: true });

        // 判定结果
        const ok = res.ok;
        G.box(ctx, 16, p.h - 66, p.w - 32, 52, {
          fill: D.withAlpha(ok ? T['--green'] : T['--red'], 0.1),
          stroke: D.withAlpha(ok ? T['--green'] : T['--red'], 0.6), radius: 9
        });
        G.label(ctx, 28, p.h - 48, `${names[state.proc]} 请求 [${state.req.join(' ')}] → ${ok ? '可分配' : '拒绝'}`, { align: 'left', size: 12.5, weight: 700, color: ok ? T['--green'] : T['--red'] });
        G.label(ctx, 28, p.h - 28, res.why, { align: 'left', size: 10.5, color: T['--ink-2'] });
        if (ok) G.label(ctx, p.w - 28, p.h - 40, '安全序列：' + res.seq.join(' → '), { align: 'right', size: 11, weight: 700, color: T['--green'], mono: true });
      });
      scene.render();
      UI.readout(out, [
        [names[state.proc] + ' Need', '[' + nd.join(' ') + ']'],
        ['请求', '[' + state.req.join(' ') + ']'],
        ['结论', res.ok ? '安全，可分配' : '不安全 / 需等待']
      ]);
    }
    render();
    return s;
  };


  /* ---------- 生产者-消费者：PV 操作逐步执行 ---------- */
  W.producerConsumer = function (host) {
    const s = UI.shell(host, 360);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    let N = 5;
    const state = { step: 0, trans: null };
    const holder = UI.el('div', 'ctrl-group');
    ctrl.appendChild(holder);
    UI.slider(ctrl, { label: '缓冲区容量 N', min: 2, max: 8, step: 1, value: N, fmt: v => v + ' 格', onInput: v => { N = v; rebuild(); } });
    let script = [], history = [];
    rebuild();

    function rebuild() {
      script = buildScript(N);
      history = run(script, N);
      state.step = 0;
      if (state.trans) state.trans.stop();
      holder.innerHTML = '';
      state.trans = UI.transport(holder, { total: script.length, speed: 780, onChange: k => { state.step = k; render(); } });
      render();
    }

    function buildScript(n) {
      const L = [];
      const C1 = '消费者 C₁', C2 = '消费者 C₂', PN = '生产者 P' + (n + 1);
      L.push({ who: C1, kind: 'p', sem: 'full', note: 'full = 0，P(full) 后 full = −1，消费者被阻塞并进入 full 等待队列' });
      for (let k = 1; k <= n; k++) {
        const who = '生产者 P' + k;
        L.push({ who, kind: 'p', sem: 'empty', note: '申请一个空缓冲区（同步信号量）' });
        L.push({ who, kind: 'p', sem: 'mutex', note: '申请进入临界区（互斥信号量）' });
        L.push({ who, kind: 'put', note: '产品放入缓冲区' });
        L.push({ who, kind: 'v', sem: 'mutex', note: '退出临界区' });
        L.push({ who, kind: 'v', sem: 'full', note: 'full + 1，通知消费者已有产品' });
      }
      L.push({ who: PN, kind: 'p', sem: 'empty', note: '缓冲区已满，P(empty) 后 empty = −1，生产者被阻塞' });
      L.push({ who: C1, kind: 'p', sem: 'mutex', note: '被唤醒后继续执行：进入临界区' });
      L.push({ who: C1, kind: 'get', note: '从缓冲区取走一个产品' });
      L.push({ who: C1, kind: 'v', sem: 'mutex', note: '退出临界区' });
      L.push({ who: C1, kind: 'v', sem: 'empty', note: 'empty 由 −1 变 0，唤醒被阻塞的生产者' });
      L.push({ who: PN, kind: 'p', sem: 'mutex', note: '被唤醒后继续执行：进入临界区' });
      L.push({ who: PN, kind: 'put', note: '产品放入缓冲区' });
      L.push({ who: PN, kind: 'v', sem: 'mutex', note: '退出临界区' });
      L.push({ who: PN, kind: 'v', sem: 'full', note: 'full + 1，通知消费者' });
      for (let k = 0; k < n; k++) {
        L.push({ who: C2, kind: 'p', sem: 'full', note: '取产品前先申请 full（同步）' });
        L.push({ who: C2, kind: 'p', sem: 'mutex', note: '进入临界区（互斥）' });
        L.push({ who: C2, kind: 'get', note: '取出产品' });
        L.push({ who: C2, kind: 'v', sem: 'mutex', note: '退出临界区' });
        L.push({ who: C2, kind: 'v', sem: 'empty', note: 'empty + 1，唤醒可能等待的生产者' });
      }
      return L;
    }

    function snap(st) {
      return {
        empty: st.empty, full: st.full, mutex: st.mutex, buf: st.buf.slice(),
        wait: { empty: st.wait.empty.slice(), full: st.wait.full.slice(), mutex: st.wait.mutex.slice() },
        ready: st.ready.slice()
      };
    }

    function run(list, n) {
      const st = { empty: n, full: 0, mutex: 1, buf: [], wait: { empty: [], full: [], mutex: [] }, ready: [] };
      const hist = [];
      list.forEach(op => {
        const before = snap(st);
        const ri = st.ready.indexOf(op.who);
        if (ri >= 0) st.ready.splice(ri, 1);
        let effect = '';
        if (op.kind === 'p') {
          st[op.sem] -= 1;
          if (st[op.sem] < 0) { st.wait[op.sem].push(op.who); effect = '阻塞'; }
          else effect = '通过';
        } else if (op.kind === 'v') {
          st[op.sem] += 1;
          const w = st[op.sem] <= 0 ? st.wait[op.sem].shift() : null;
          if (w) { st.ready.push(w); effect = '唤醒 ' + w; }
          else effect = '释放';
        } else if (op.kind === 'put') { st.buf.push(1); effect = '写入'; }
        else { st.buf.pop(); effect = '取出'; }
        hist.push({ op, before, after: snap(st), effect });
      });
      return hist;
    }

    function opLabel(op) {
      if (op.kind === 'p') return 'P(' + op.sem + ')';
      if (op.kind === 'v') return 'V(' + op.sem + ')';
      return op.kind === 'put' ? '放入缓冲区' : '取出产品';
    }


    function procBox(ctx, x, y, w, h, name, hl, T) {
      const blocked = hl.blocked, ready = hl.ready, busy = hl.busy;
      const col = busy ? T['--brand'] : (blocked ? T['--red'] : (ready ? T['--accent'] : T['--line-2']));
      G.box(ctx, x, y, w, h, {
        fill: busy ? D.withAlpha(T['--brand'], 0.18) : (blocked ? D.withAlpha(T['--red'], 0.12) : (ready ? D.withAlpha(T['--accent'], 0.12) : T['--card-2'])),
        stroke: col, width: busy || blocked ? 2 : 1.2, radius: 7
      });
      G.fitted(ctx, x + w / 2, y + h / 2 - (blocked || ready ? 5 : 0), name, w - 10, { size: 11, weight: 700, color: busy ? T['--brand'] : T['--ink'] });
      if (blocked) G.label(ctx, x + w / 2, y + h / 2 + 9, '阻塞', { size: 9.5, weight: 700, color: T['--red'] });
      else if (ready) G.label(ctx, x + w / 2, y + h / 2 + 9, '就绪', { size: 9.5, weight: 700, color: T['--accent'] });
    }

    function render() {
      const rec = history[Math.min(state.step, history.length - 1)];
      const op = rec.op, st = rec.after, T = D.Theme.cache;
      const producers = [];
      for (let k = 1; k <= N + 1; k++) producers.push('生产者 P' + k);
      const consumers = ['消费者 C₁', '消费者 C₂'];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const w = p.w;
        G.label(ctx, w / 2, 16, '生产者—消费者：缓冲池 N = ' + N + '，empty / full 同步，mutex 互斥', { size: 12, weight: 700, color: T['--ink'] });
        const inWait = nm => st.wait.empty.indexOf(nm) >= 0 || st.wait.full.indexOf(nm) >= 0 || st.wait.mutex.indexOf(nm) >= 0;
        const pRows = N + 1;
        const rowTop = 34, rowBottom = p.h - 70;
        const rowGap = Math.min(34, (rowBottom - rowTop) / pRows);
        const rowH = Math.min(28, rowGap - 6);
        producers.forEach((nm, k) => {
          procBox(ctx, 16, rowTop + k * rowGap, 112, rowH, nm, { busy: nm === op.who, blocked: op.who !== nm && inWait(nm), ready: op.who !== nm && st.ready.indexOf(nm) >= 0 }, T);
        });
        consumers.forEach((nm, k) => {
          procBox(ctx, w - 128, rowTop + k * rowGap, 112, rowH, nm, { busy: nm === op.who, blocked: op.who !== nm && inWait(nm), ready: op.who !== nm && st.ready.indexOf(nm) >= 0 }, T);
        });
        // 缓冲区
        const bx = 146, bw = w - bx - 146, cell = bw / N;
        G.label(ctx, bx + bw / 2, 40, '缓冲区（临界资源）', { size: 11, weight: 700, color: T['--ink-2'] });
        for (let k = 0; k < N; k++) {
          const x = bx + k * cell, filled = k < st.buf.length;
          const isNew = op.kind === 'put' && k === st.buf.length - 1;
          const isOut = op.kind === 'get' && k === st.buf.length;
          G.box(ctx, x + 5, 52, cell - 10, 46, {
            fill: filled ? D.withAlpha(T['--green'], 0.18) : T['--card-2'],
            stroke: isNew || isOut ? T['--red'] : (filled ? T['--green'] : T['--line']),
            width: isNew || isOut ? 2 : 1.2, radius: 6
          });
          G.fitted(ctx, x + cell / 2, 70, filled ? '产品' : '空', cell - 8, { size: 10.5, weight: filled ? 700 : 500, color: filled ? T['--green'] : T['--ink-3'] });
          G.label(ctx, x + cell / 2, 88, '#' + (k + 1), { size: 9, color: T['--ink-3'], mono: true });
        }
        // 信号量
        const sig = [['empty', st.empty, T['--accent']], ['full', st.full, T['--green']], ['mutex', st.mutex, T['--purple']]];
        const sw = (bw - 16) / 3;
        sig.forEach((sg, k) => {
          const x = bx + k * (sw + 8);
          const on = op.sem === sg[0];
          G.box(ctx, x, 116, sw, 48, {
            fill: on ? D.withAlpha(sg[2], 0.2) : D.withAlpha(sg[2], 0.09),
            stroke: on ? sg[2] : D.withAlpha(sg[2], 0.5), width: on ? 2 : 1, radius: 8
          });
          G.label(ctx, x + sw / 2, 132, sg[0], { size: 10.5, weight: 700, color: sg[2], mono: true });
          G.label(ctx, x + sw / 2, 151, '= ' + sg[1] + (sg[1] < 0 ? '（|S|=' + (-sg[1]) + ' 个等待）' : ''), { size: 11, weight: 800, color: sg[2], mono: true });
        });
        // 等待 / 就绪队列
        G.box(ctx, bx, 176, bw, 52, { fill: T['--card-2'], stroke: T['--line'], radius: 8 });
        G.label(ctx, bx + 12, 190, 'empty 等待队列：' + (st.wait.empty.join('、') || '—'), { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, bx + 12, 204, 'full 等待队列：' + (st.wait.full.join('、') || '—'), { align: 'left', size: 10.5, color: T['--ink-2'] });
        G.label(ctx, bx + 12, 218, '就绪队列：' + (st.ready.join('、') || '—'), { align: 'left', size: 10.5, color: T['--accent'] });
        // 当前操作
        G.box(ctx, 16, p.h - 62, w - 32, 26, { fill: D.withAlpha(T['--brand'], 0.12), stroke: D.withAlpha(T['--brand'], 0.5), radius: 7 });
        G.label(ctx, 28, p.h - 49, op.who + ' 执行 ' + opLabel(op) + ' → ' + rec.effect, { align: 'left', size: 12, weight: 700, color: T['--brand'] });
        G.label(ctx, 28, p.h - 24, op.note, { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前操作', op.who + ' ' + opLabel(op)],
        ['empty / full / mutex', st.empty + ' / ' + st.full + ' / ' + st.mutex],
        ['队列', 'empty:' + (st.wait.empty.length || 0) + '　full:' + (st.wait.full.length || 0) + '　就绪:' + st.ready.length]
      ]);
    }
    return s;
  };


  /* ---------- 资源分配图与死锁检测 ---------- */
  W.resourceGraph = function (host) {
    const s = UI.shell(host, 340);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');
    const cases = [
      {
        short: '单实例 · 环路 → 死锁',
        title: 'R₁、R₂ 各 1 个实例：P₁ 占有 R₁ 请求 R₂，P₂ 占有 R₂ 请求 R₁',
        res: [['R₁', 1], ['R₂', 1]],
        procs: [
          { name: 'P₁', alloc: { 'R₁': 1 }, req: { 'R₂': 1 } },
          { name: 'P₂', alloc: { 'R₂': 1 }, req: { 'R₁': 1 } }
        ]
      },
      {
        short: '多实例 · 环路 → 无死锁',
        title: 'R₂ 有 2 个实例（还剩 1 个空闲）：图中虽有环路，但可化简，系统不会死锁',
        res: [['R₁', 1], ['R₂', 2]],
        procs: [
          { name: 'P₁', alloc: { 'R₁': 1 }, req: { 'R₂': 1 } },
          { name: 'P₂', alloc: { 'R₂': 1 }, req: { 'R₁': 1 } }
        ]
      },
      {
        short: '可化简 → 无死锁',
        title: 'P₃ 不再申请资源：P₃ → P₂ → P₁ 依次完成，资源分配图可完全化简',
        res: [['R₁', 1], ['R₂', 1], ['R₃', 1]],
        procs: [
          { name: 'P₁', alloc: { 'R₁': 1 }, req: { 'R₂': 1 } },
          { name: 'P₂', alloc: { 'R₂': 1 }, req: { 'R₃': 1 } },
          { name: 'P₃', alloc: { 'R₃': 1 }, req: {} }
        ]
      }
    ];
    const state = { ci: 0, step: 0, trans: null };
    const holder = UI.el('div', 'ctrl-group');
    ctrl.appendChild(holder);
    UI.seg(ctrl, cases.map((c, k) => ({ label: c.short, value: k })), (v, k) => { state.ci = k; rebuild(); }, 0);
    let history = [];
    rebuild();

    function rebuild() {
      history = stepsOf(cases[state.ci]);
      state.step = 0;
      if (state.trans) state.trans.stop();
      holder.innerHTML = '';
      state.trans = UI.transport(holder, { total: history.length, speed: 1100, onChange: k => { state.step = k; render(); } });
      render();
    }

    function stepsOf(c) {
      const steps = [];
      const done = [];
      const avail = () => {
        const av = {};
        c.res.forEach(r => { av[r[0]] = r[1]; });
        c.procs.forEach((pr, k) => { if (done.indexOf(k) < 0) Object.keys(pr.alloc).forEach(r => { av[r] -= pr.alloc[r]; }); });
        return av;
      };
      steps.push({ label: '初始状态：求当前可用资源 = 资源总数 − 各进程已占有量，逐个检查进程的请求', done: [], deadlock: false, cycle: [], active: null, av: avail() });
      for (;;) {
        const av = avail();
        const alive = c.procs.map((pr, k) => k).filter(k => done.indexOf(k) < 0);
        const can = alive.find(k => Object.keys(c.procs[k].req).every(r => c.procs[k].req[r] <= (av[r] || 0)));
        if (can !== undefined) {
          done.push(can);
          steps.push({
            label: c.procs[can].name + ' 的请求均不超过可用资源 → 可运行完成，释放其占有的全部资源',
            done: done.slice(), deadlock: false, cycle: [], active: can, av: avail()
          });
        } else {
          const dead = done.length < c.procs.length;
          steps.push({
            label: dead ? '已找不到可满足的进程 → 剩余进程相互等待，构成环路，系统死锁' : '所有进程依次完成 → 资源分配图可完全化简，系统无死锁',
            done: done.slice(), deadlock: dead, cycle: dead ? findCycle(c, done) : [], active: null, av: avail()
          });
          break;
        }
      }
      return steps;
    }

    function findCycle(c, done) {
      const alive = c.procs.map((pr, k) => k).filter(k => done.indexOf(k) < 0);
      const adj = {};
      alive.forEach(i => Object.keys(c.procs[i].req).forEach(r => alive.forEach(j => {
        if (j !== i && (c.procs[j].alloc[r] || 0) > 0) (adj[i] = adj[i] || []).push(j);
      })));
      const color = {}, path = [];
      let found = [];
      const dfs = u => {
        color[u] = 1; path.push(u);
        for (const v of (adj[u] || [])) {
          if (found.length) return;
          if (color[v] === 1) { found = path.slice(path.indexOf(v)).concat([v]); return; }
          if (!color[v]) dfs(v);
        }
        path.pop(); color[u] = 2;
      };
      alive.forEach(u => { if (!color[u] && !found.length) dfs(u); });
      return found;
    }


    function isCycleReq(cycle, c, i, r) {
      for (let k = 0; k + 1 < cycle.length; k++) {
        if (cycle[k] === i) {
          const j = cycle[k + 1];
          if ((c.procs[j].alloc[r] || 0) > 0) return true;
        }
      }
      return false;
    }

    function render() {
      const c = cases[state.ci];
      const rec = history[Math.min(state.step, history.length - 1)];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const w = p.w;
        const m = c.res.length, n = c.procs.length;
        const rY = 108, pY = p.h - 128;
        const rX = k => 86 + (k + 0.5) * (w - 172) / m;
        const pX = k => 86 + (k + 0.5) * (w - 172) / n;
        const RW = 68, RH = 48, PR = 27;
        const rectPt = (a, b) => {
          const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
          const tx = (RW / 2) / Math.max(1e-6, Math.abs(dx) / len);
          const ty = (RH / 2) / Math.max(1e-6, Math.abs(dy) / len);
          const t = Math.min(tx, ty);
          return [a[0] + dx / len * t, a[1] + dy / len * t];
        };
        const circPt = (a, b) => {
          const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
          return [a[0] + dx / len * PR, a[1] + dy / len * PR];
        };
        const shift = (a, b, d) => {
          const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
          return [-dy / len * d, dx / len * d];
        };
        G.label(ctx, w / 2, 16, c.title, { size: 11.5, weight: 700, color: T['--ink'] });
        G.label(ctx, w - 20, 16, '步骤 ' + (state.step + 1) + ' / ' + history.length, { align: 'right', size: 10.5, color: T['--ink-3'], mono: true });
        G.label(ctx, 20, 40, '—— 分配边（资源 → 进程）', { align: 'left', size: 10, color: T['--purple'] });
        G.label(ctx, 190, 40, '—— 请求边（进程 → 资源）', { align: 'left', size: 10, color: T['--accent'] });
        G.label(ctx, 360, 40, '—— 环路（死锁）', { align: 'left', size: 10, color: T['--red'] });
        // 分配边
        c.procs.forEach((pr, i) => {
          if (rec.done.indexOf(i) >= 0) return;
          Object.keys(pr.alloc).forEach(r => {
            const ri = c.res.findIndex(x => x[0] === r);
            if (ri < 0) return;
            const a = [rX(ri), rY], b = [pX(i), pY];
            const o = shift(a, b, -7);
            const p1 = rectPt(a, b), p2 = circPt(b, a);
            G.arrow(ctx, [[p1[0] + o[0], p1[1] + o[1]], [p2[0] + o[0], p2[1] + o[1]]], { color: D.withAlpha(T['--purple'], 0.9), width: 1.8, head: 7 });
          });
        });
        // 请求边
        c.procs.forEach((pr, i) => {
          if (rec.done.indexOf(i) >= 0) return;
          Object.keys(pr.req).forEach(r => {
            const ri = c.res.findIndex(x => x[0] === r);
            if (ri < 0) return;
            const a = [pX(i), pY], b = [rX(ri), rY];
            const o = shift(a, b, 7);
            const p1 = circPt(a, b), p2 = rectPt(b, a);
            const onCycle = rec.cycle.length > 0 && isCycleReq(rec.cycle, c, i, r);
            G.arrow(ctx, [[p1[0] + o[0], p1[1] + o[1]], [p2[0] + o[0], p2[1] + o[1]]], {
              color: onCycle ? T['--red'] : D.withAlpha(T['--accent'], 0.9),
              width: onCycle ? 3 : 1.8, head: onCycle ? 9 : 7
            });
          });
        });
        // 资源节点
        c.res.forEach((r, k) => {
          const x = rX(k), y = rY;
          G.box(ctx, x - RW / 2, y - RH / 2, RW, RH, { fill: D.withAlpha(T['--teal'], 0.13), stroke: T['--teal'], radius: 8 });
          G.label(ctx, x, y - 12, r[0], { size: 12.5, weight: 800, color: T['--teal'], mono: true });
          const cnt = r[1], dots = Math.min(cnt, 6), dw = 10;
          for (let d = 0; d < dots; d++) G.dot(ctx, x - (dots - 1) * dw / 2 + d * dw, y + 6, 3.4, T['--teal'], false);
          G.label(ctx, x, y + 17, '共 ' + cnt + ' 个实例', { size: 9, color: T['--ink-3'] });
        });
        // 进程节点
        c.procs.forEach((pr, k) => {
          const x = pX(k), y = pY;
          const done = rec.done.indexOf(k) >= 0;
          const active = rec.active === k;
          const col = done ? T['--green'] : (active ? T['--brand'] : T['--ink-2']);
          ctx.save();
          ctx.beginPath(); ctx.arc(x, y, PR, 0, Math.PI * 2);
          ctx.fillStyle = done ? D.withAlpha(T['--green'], 0.16) : (active ? D.withAlpha(T['--brand'], 0.18) : T['--card']);
          ctx.fill();
          ctx.strokeStyle = col; ctx.lineWidth = done || active ? 2.2 : 1.4; ctx.stroke();
          ctx.restore();
          G.label(ctx, x, y - 4, pr.name, { size: 12.5, weight: 800, color: col, mono: true });
          G.label(ctx, x, y + 12, done ? '已完成' : (Object.keys(pr.req).length ? '申请中' : '无申请'), { size: 9, color: done ? T['--green'] : T['--ink-3'] });
        });
        // 底部结论
        const av = rec.av;
        const avTxt = Object.keys(av).map(r => r + '=' + av[r]).join('　');
        G.box(ctx, 16, p.h - 62, w - 32, 26, {
          fill: D.withAlpha(rec.deadlock ? T['--red'] : T['--brand'], 0.12),
          stroke: D.withAlpha(rec.deadlock ? T['--red'] : T['--brand'], 0.5), radius: 7
        });
        G.label(ctx, 28, p.h - 49, rec.label + '　·　可用资源 ' + avTxt, { align: 'left', size: 11.5, weight: 700, color: rec.deadlock ? T['--red'] : T['--brand'] });
        G.label(ctx, 28, p.h - 24, '化简规则：请求量 ≤ 可用资源的进程可完成，并释放其占有的全部资源；若最终仍有进程无法完成，则系统死锁。', { align: 'left', size: 10.5, color: T['--ink-2'] });
      });
      scene.render();
      UI.readout(out, [
        ['示例', c.short],
        ['当前步骤', rec.label.slice(0, 22) + (rec.label.length > 22 ? '…' : '')],
        ['判定', rec.deadlock ? '死锁（存在不可化简的环路）' : (rec.done.length === c.procs.length ? '安全（可完全化简）' : '化简中')]
      ]);
    }
    return s;
  };

})(window);
