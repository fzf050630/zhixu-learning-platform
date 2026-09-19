/* ============================================================
   co1.js — 第1章 计算机系统概述 可视化组件
   vonNeumann：冯·诺依曼结构五大部件与指令/数据流（可单步）
   perfCalc：性能指标计算器（主频 / CPI / 指令数 / MIPS / CPU 时间）
   hwSwLayers：系统层次结构与高级语言→汇编→机器语言→微指令翻译链
   amdahl：阿姆达尔定律（可并行比例 p 与部件加速比 k 的加速比曲线）
   ============================================================ */
(function (global) {
  'use strict';
  const W = global.WIDGETS, D = global.Draw, UI = global.UI;
  const G = D.G, C = UI.C;

  /* ------------------------------------------------------------
     冯·诺依曼结构：五大部件 + 指令/数据流
     ------------------------------------------------------------ */
  W.vonNeumann = function (host) {
    const s = UI.shell(host, 320);
    const { scene, ctrl, out } = s;

    const stages = [
      { name: '取指', desc: 'PC → MAR，经地址总线到存储器取指令，再经数据总线送入 IR', parts: ['PC', 'MAR', 'M', 'IR'] },
      { name: '译码', desc: '控制器对 IR 中的操作码译码，产生控制信号', parts: ['IR', 'CU'] },
      { name: '取数', desc: '按寻址方式算出操作数地址，取操作数送入 ALU/寄存器', parts: ['CU', 'MAR', 'M', 'ACC'] },
      { name: '执行', desc: '运算器在控制器控制下完成运算，结果写回累加器', parts: ['ALU', 'ACC'] },
      { name: '写回/更新', desc: '结果写回主存或寄存器，PC 更新指向下一条指令', parts: ['ACC', 'M', 'PC'] }
    ];
    let step = 0;

    function draw() {
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const w = p.w, h = p.h;
        const T = D.Theme.cache;
        const active = stages[step].parts;

        const mkBox = (x, y, bw, bh, id, title, sub, color) => {
          const on = active.includes(id) || (id === 'CU' && active.includes('CU'));
          G.box(ctx, x, y, bw, bh, {
            fill: on ? D.withAlpha(color, 0.2) : T['--card'],
            stroke: on ? color : T['--line-2'],
            width: on ? 2 : 1.2,
            radius: 9
          });
          G.label(ctx, x + bw / 2, y + bh / 2 - (sub ? 8 : 0), title, { size: 13, weight: 700, color: on ? color : T['--ink'] });
          if (sub) G.label(ctx, x + bw / 2, y + bh / 2 + 11, sub, { size: 10.5, color: T['--ink-3'] });
        };

        const busY = h - 34;
        const colW = (w - 48) / 3;
        const b1x = 24, b2x = 24 + colW + 12, b3x = 24 + (colW + 12) * 2;
        const bw = colW - 12;

        // 运算器（ALU+ACC） 控制器（IR+PC+CU+MAR）
        G.label(ctx, 24, 18, 'CPU', { align: 'left', size: 11, weight: 700, color: T['--ink-3'] });
        mkBox(b1x, 28, bw, 78, 'ALU', '算术逻辑单元', 'ALU', T['--brand']);
        mkBox(b2x, 28, bw, 78, 'ACC', '累加器', 'ACC', T['--brand']);
        mkBox(b3x, 28, bw, 78, 'CU', '控制器', 'CU', T['--purple']);
        mkBox(b1x, 120, bw, 66, 'PC', '程序计数器', 'PC', T['--teal']);
        mkBox(b2x, 120, bw, 66, 'IR', '指令寄存器', 'IR', T['--teal']);
        mkBox(b3x, 120, bw, 66, 'MAR', '地址寄存器', 'MAR', T['--teal']);

        // 主存储器
        G.box(ctx, b1x, 200, w - 48, 54, {
          fill: active.includes('M') ? D.withAlpha(T['--accent'], 0.2) : T['--card'],
          stroke: active.includes('M') ? T['--accent'] : T['--line-2'],
          width: active.includes('M') ? 2 : 1.2, radius: 10
        });
        G.label(ctx, w / 2, 220, '主存储器 M', { size: 13, weight: 700, color: active.includes('M') ? T['--accent'] : T['--ink'] });
        G.label(ctx, w / 2, 238, '存储指令与数据 · 按地址访问', { size: 10.5, color: T['--ink-3'] });

        // 总线
        G.box(ctx, 24, busY - 14, w - 48, 22, { fill: D.withAlpha(T['--teal'], 0.12), stroke: D.withAlpha(T['--teal'], 0.7), radius: 6 });
        G.label(ctx, w / 2, busY - 3, '系统总线（地址 / 数据 / 控制）', { size: 11, weight: 700, color: T['--teal'] });

        // 流动箭头：按阶段高亮
        const flow = {
          0: [[b3x + bw / 2, 186], [b3x + bw / 2, busY - 14]],      // MAR -> 总线
          2: [[b3x + bw / 2, busY - 14], [b3x + bw / 2, 186]],
          1: [[b2x + bw / 2, 120], [b3x + bw / 2, 120]],
          3: [[b1x + bw / 2, 106], [b2x + bw / 2, 106]]
        };
        if (flow[step]) G.arrow(ctx, flow[step], { color: T['--brand'], width: 2.4 });

        // PC 更新
        if (step === 4) G.arrow(ctx, [[b1x + bw / 2, 120], [b1x + bw / 2, 106]], { color: T['--accent'], width: 2.4 });
      });
    }

    const t = UI.transport(ctrl, {
      total: stages.length,
      onChange(i) { step = i; renderOut(); draw(); }
    });
    renderOut();

    function renderOut() {
      UI.readout(out, [
        ['当前阶段', stages[step].name],
        ['说明', stages[step].desc]
      ]);
    }

    draw();
    return s;
  };

  /* ------------------------------------------------------------
     性能指标计算器
     ------------------------------------------------------------ */
  W.perfCalc = function (host) {
    const s = UI.shell(host, 300);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');

    const state = { freq: 2.0, cpi: 2, count: 100, mipsBase: false };

    UI.note(host, '调节主频、CPI 与指令条数，实时观察 CPU 执行时间与 MIPS 的变化。CPU 时间 = 指令数 × CPI ÷ 主频。');

    UI.slider(ctrl, {
      label: '主频', min: 0.5, max: 5, step: 0.1, value: state.freq,
      fmt: v => v.toFixed(1) + ' GHz', onInput: v => { state.freq = v; render(); }
    });
    UI.slider(ctrl, {
      label: 'CPI', min: 1, max: 10, step: 0.1, value: state.cpi,
      fmt: v => v.toFixed(1), onInput: v => { state.cpi = v; render(); }
    });
    UI.slider(ctrl, {
      label: '指令数', min: 10, max: 2000, step: 10, value: state.count,
      fmt: v => v + '（万条）', onInput: v => { state.count = v; render(); }
    });

    function render() {
      const n = state.count * 1e4;
      const cycles = n * state.cpi;
      const tCPU = cycles / (state.freq * 1e9);       // 秒
      const mips = state.freq * 1e3 / state.cpi;
      const IPC = 1 / state.cpi;

      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        const items = [
          { k: 'CPI', v: state.cpi.toFixed(2), u: '周期/条', c: T['--purple'], r: Math.min(1, state.cpi / 10) },
          { k: 'IPC', v: IPC.toFixed(3), u: '条/周期', c: T['--green'], r: Math.min(1, IPC) },
          { k: 'MIPS', v: mips.toFixed(0), u: '百万条/s', c: T['--teal'], r: Math.min(1, mips / 5000) },
          { k: '时钟周期', v: (1 / state.freq).toFixed(3), u: 'ns', c: T['--accent'], r: 1 - 1 / state.freq / 2 }
        ];
        const gap = (p.w - 32) / items.length;
        items.forEach((it, i) => {
          const x = 16 + i * gap;
          const bw = gap - 14;
          G.label(ctx, x + bw / 2, 34, it.k, { size: 12.5, weight: 700, color: T['--ink-2'] });
          G.label(ctx, x + bw / 2, 62, it.v, { size: 22, weight: 760, color: it.c, mono: true });
          G.label(ctx, x + bw / 2, 84, it.u, { size: 10.5, color: T['--ink-3'] });
          G.box(ctx, x, 104, bw, 8, { fill: T['--bg-soft'], stroke: null, radius: 4 });
          G.box(ctx, x, 104, Math.max(3, bw * it.r), 8, { fill: it.c, stroke: null, radius: 4 });
        });

        // CPU 时间大字
        G.box(ctx, 16, 140, p.w - 32, 86, { fill: D.withAlpha(T['--brand'], 0.08), stroke: D.withAlpha(T['--brand'], 0.5), radius: 12 });
        G.label(ctx, 34, 166, 'CPU 执行时间', { align: 'left', size: 12.5, weight: 700, color: T['--brand-ink'] });
        G.label(ctx, 34, 198, tCPU * 1e6 >= 1e3 ? (tCPU * 1e3).toFixed(3) + ' ms' : (tCPU * 1e6).toFixed(2) + ' µs',
          { align: 'left', size: 30, weight: 780, color: T['--brand'], mono: true });
        G.label(ctx, p.w - 34, 166, `时钟周期数 = ${D.niceNum(cycles)}`, { align: 'right', size: 11.5, color: T['--ink-2'], mono: true });
        G.label(ctx, p.w - 34, 190, `${state.count} 万条 × CPI ${state.cpi.toFixed(2)}`, { align: 'right', size: 11.5, color: T['--ink-3'], mono: true });
        G.label(ctx, p.w - 34, 212, `÷ ${state.freq.toFixed(1)} GHz`, { align: 'right', size: 11.5, color: T['--ink-3'], mono: true });
      });
      UI.readout(out, [
        ['时钟周期', (1 / state.freq * 1000).toFixed(2) + ' ns'],
        ['总时钟周期数', D.niceNum(cycles)],
        ['MIPS', mips.toFixed(1)],
        ['CPU 时间', (tCPU * 1e6).toFixed(2) + ' µs']
      ]);
    }
    render();
    return s;
  };

  /* ------------------------------------------------------------
     计算机系统层次结构与语言翻译链
     ------------------------------------------------------------ */
  W.hwSwLayers = function (host) {
    const s = UI.shell(host, 360);
    const { scene, ctrl, out, body } = s;
    body.classList.add('pad0');

    const layers = [
      { name: '应用软件', eg: 'C / Java 程序、办公与游戏软件', c: '--purple' },
      { name: '系统软件', eg: '操作系统、编译 / 汇编程序、数据库管理系统', c: '--brand' },
      { name: '硬件（裸机）', eg: 'CPU、主存、I/O 设备、数字逻辑电路', c: '--teal' }
    ];
    const chain = ['高级语言程序', '汇编语言程序', '机器语言程序', '微指令序列'];
    const trans = ['编译程序', '汇编程序', '微程序解释'];
    const steps = [
      { box: 0, arrow: -1, layer: 0, d1: '高级语言程序（如 C）面向问题描述算法，属于应用软件；', d2: '对高级语言程序员，寄存器、指令格式与机器语言都是透明的。' },
      { box: 1, arrow: 0, layer: 1, d1: '编译程序把高级语言程序翻译成汇编语言程序，属于系统软件；', d2: '翻译结果与具体机器的汇编指令相关。' },
      { box: 2, arrow: 1, layer: 1, d1: '汇编程序把汇编指令翻译成机器语言（二进制指令）；', d2: '对汇编程序员，微程序、微指令是透明的。' },
      { box: 3, arrow: 2, layer: 2, d1: '机器指令由硬件（微程序）解释为微指令序列，存于控制存储器；', d2: '微程序机器是第 1 级，已属于硬件层。' },
      { box: 3, arrow: 3, layer: 2, d1: '微指令控制门电路完成微操作，最终由硬连逻辑执行；', d2: '越往底层越接近硬件，上层对其实现细节透明。' }
    ];
    let k = 0;

    function draw() {
      const st = steps[k];
      scene.clearLayers();
      scene.layer((p, ctx) => {
        const T = D.Theme.cache;
        G.label(ctx, 16, 14, '计算机系统层次结构（自顶向下）', { align: 'left', size: 12, weight: 700, color: T['--ink-2'] });
        layers.forEach((l, i) => {
          const col = T[l.c];
          const on = i === st.layer;
          const y = 26 + i * 34;
          G.box(ctx, 16, y, p.w - 32, 28, {
            fill: on ? D.withAlpha(col, 0.18) : T['--card-2'],
            stroke: on ? col : T['--line'], width: on ? 1.8 : 1, radius: 8
          });
          G.label(ctx, 28, y + 14, l.name, { align: 'left', size: 12, weight: 700, color: on ? col : T['--ink-2'] });
          G.label(ctx, p.w - 28, y + 14, l.eg, { align: 'right', size: 10.5, color: T['--ink-3'] });
        });

        G.label(ctx, 16, 150, '语言翻译链（高级语言 → 汇编 → 机器语言 → 微指令）', { align: 'left', size: 11.5, weight: 700, color: T['--ink-2'] });
        const gap = 62, bw = (p.w - 32 - gap * 3) / 4, cy = 166, ch = 40;
        chain.forEach((c, i) => {
          const x = 16 + i * (bw + gap);
          const on = i === st.box;
          G.box(ctx, x, cy, bw, ch, {
            fill: on ? D.withAlpha(T['--brand'], 0.16) : T['--card-2'],
            stroke: on ? T['--brand'] : T['--line'], width: on ? 1.8 : 1, radius: 8
          });
          G.fitted(ctx, x + bw / 2, cy + ch / 2, c, bw - 12, { size: 11.5, weight: 700, color: on ? T['--brand'] : T['--ink-2'] });
          if (i < 3) {
            const onA = st.arrow === i;
            G.arrow(ctx, [[x + bw + 8, cy + ch / 2], [x + bw + gap - 8, cy + ch / 2]], {
              color: onA ? T['--accent'] : D.withAlpha(T['--line-2'], 0.9), width: onA ? 2.2 : 1.2, head: 6
            });
            ctx.save();
            ctx.fillStyle = onA ? T['--accent'] : T['--ink-3'];
            ctx.font = `700 9.5px ${D.FONT_SANS}`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(trans[i], x + bw + gap / 2, cy + ch / 2 - 9);
            ctx.restore();
          }
        });

        const lastX = 16 + 3 * (bw + gap);
        const onEnd = st.arrow === 3;
        G.arrow(ctx, [[lastX + bw / 2, cy + ch + 2], [lastX + bw / 2, cy + ch + 20]], {
          color: onEnd ? T['--accent'] : D.withAlpha(T['--line-2'], 0.9), width: onEnd ? 2.2 : 1.2, head: 6
        });
        G.box(ctx, lastX, cy + ch + 22, bw, 30, {
          fill: onEnd ? D.withAlpha(T['--teal'], 0.18) : T['--card-2'],
          stroke: onEnd ? T['--teal'] : T['--line'], width: onEnd ? 1.8 : 1, radius: 8
        });
        G.fitted(ctx, lastX + bw / 2, cy + ch + 37, '硬连逻辑执行', bw - 10, { size: 11, weight: 700, color: onEnd ? T['--teal'] : T['--ink-2'] });

        G.box(ctx, 16, 276, p.w - 32, 54, { fill: T['--card-2'], stroke: T['--line'], radius: 9 });
        G.lines(ctx, 30, 293, [st.d1, st.d2], { align: 'left', size: 11, lineHeight: 20, color: T['--ink-2'] });
        G.label(ctx, p.w / 2, 346, '硬件是软件的物理基础，二者逻辑等价；软件硬化 = 把常用功能固化为硬件', { size: 10.5, color: T['--ink-3'] });
      });
      scene.render();
      UI.readout(out, [
        ['当前对象', chain[st.box]],
        ['所属层次', layers[st.layer].name],
        ['翻译/执行者', st.arrow >= 0 ? (trans[st.arrow] || '硬连逻辑') : '——'],
        ['透明性', st.layer === 0 ? '寄存器、指令格式对高级语言程序员透明' : st.layer === 1 ? '微程序对汇编程序员透明' : '硬连逻辑是最终执行者']
      ]);
    }

    UI.transport(ctrl, { total: steps.length, onChange: i => { k = i; draw(); } });
    draw();
    return s;
  };

  /* ------------------------------------------------------------
     阿姆达尔定律
     ------------------------------------------------------------ */
  W.amdahl = function (host) {
    const s = UI.shellPlot(host, {
      height: 330, xMin: 0, xMax: 1, yMin: 0, yMax: 6,
      xLabel: '可并行（可被加速）比例 p', yLabel: '总加速比 S', xTicks: 5, yTicks: 6
    });
    const { plot, ctrl, out, body } = s;
    body.classList.add('pad0');
    const state = { p: 0.6, k: 10 };

    UI.note(host, '阿姆达尔定律：设程序中可并行部分占 p、该部分被加速 k 倍，则总加速比 <b>S = 1 / ((1 − p) + p / k)</b>；当 k → ∞ 时 S 的上限为 <b>1 / (1 − p)</b>。串行部分 1 − p 决定了加速的天花板。');
    UI.slider(ctrl, {
      label: '可并行比例 p', min: 0.05, max: 0.99, step: 0.01, value: state.p,
      fmt: v => (v * 100).toFixed(0) + '%', onInput: v => { state.p = v; render(); }
    });
    UI.slider(ctrl, {
      label: '部件加速比 k', min: 1, max: 100, step: 1, value: state.k,
      fmt: v => '×' + v, onInput: v => { state.k = v; render(); }
    });
    UI.legend(host, [
      { color: C('--brand'), label: 'S(p) 当前 k' },
      { color: C('--purple'), label: '上限 1/(1−p)（k → ∞）', dash: true },
      { color: C('--red'), label: '当前工作点' }
    ]);

    function render() {
      const p = state.p, k = state.k;
      const S = 1 / ((1 - p) + p / k);
      const lim = 1 / (1 - p);
      const yTop = D.clamp(Math.ceil(Math.max(2.4, S * 1.35, Math.min(k, S * 1.6))), 2.4, 48);
      plot.setDomain(0, 1, 0, yTop);
      plot.clearLayers();
      plot.custom((pl, ctx) => {
        ctx.save();
        ctx.beginPath(); ctx.rect(pl.px, pl.py, pl.pw, pl.ph); ctx.clip();
        ctx.beginPath();
        for (let i = 0; i <= 240; i++) {
          const x = i / 240 * 0.998;
          const y = 1 / ((1 - x) + x / k);
          const X = pl.X(x), Y = pl.Y(y);
          if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
        }
        ctx.strokeStyle = C('--brand'); ctx.lineWidth = 2.4;
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        ctx.stroke();
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        for (let i = 0; i <= 240; i++) {
          const x = i / 240 * 0.985;
          const X = pl.X(x), Y = pl.Y(1 / (1 - x));
          if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
        }
        ctx.strokeStyle = C('--purple'); ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
        G.dot(ctx, pl.X(p), pl.Y(S), 5, C('--red'), true);
      });
      plot.vline(p, { color: D.withAlpha(C('--red'), 0.55), dash: [4, 4] });
      plot.render();
      UI.readout(out, [
        ['可并行比例 p', (p * 100).toFixed(0) + '%'],
        ['串行比例 1 − p', ((1 - p) * 100).toFixed(0) + '%'],
        ['部件加速比 k', '×' + k],
        ['总加速比 S', S.toFixed(3)],
        ['理论上限 1/(1−p)', lim.toFixed(2) + (lim > yTop ? '（超出当前坐标范围）' : '')]
      ]);
    }
    render();
    requestAnimationFrame(() => plot.animate(430));
    return s;
  };

})(window);
