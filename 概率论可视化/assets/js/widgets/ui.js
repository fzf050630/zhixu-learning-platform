/* ============================================================
   ui.js — 可视化组件通用 UI 辅助（滑块 / 分段按钮 / 图例 / 读数）
   ============================================================ */
(function (global) {
  'use strict';
  const D = global.Draw;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /** 创建标准可视化外壳，返回 { cv, ctrl, out, scene } */
  function shell(host, height) {
    host.innerHTML = '';
    const body = el('div', 'viz-body');
    const cv = document.createElement('canvas');
    body.appendChild(cv);
    host.appendChild(body);

    const ctrl = el('div', 'ctrl');
    ctrl.style.padding = '0 16px';
    host.appendChild(ctrl);

    const out = el('div', 'readout');
    out.style.margin = '12px 16px 16px';
    host.appendChild(out);

    const scene = new D.Scene(cv, height);
    D.register(scene);
    return { cv, ctrl, out, scene, host };
  }

  /** 带直角坐标系的版本 */
  function shellPlot(host, opts) {
    host.innerHTML = '';
    const body = el('div', 'viz-body');
    const cv = document.createElement('canvas');
    body.appendChild(cv);
    host.appendChild(body);

    const ctrl = el('div', 'ctrl');
    ctrl.style.padding = '0 16px';
    host.appendChild(ctrl);

    const out = el('div', 'readout');
    out.style.margin = '12px 16px 16px';
    host.appendChild(out);

    const plot = new D.Plot(cv, opts);
    D.register(plot);
    return { cv, ctrl, out, plot, host };
  }

  /** 滑块 */
  function slider(parent, o) {
    const g = el('div', 'ctrl-group');
    const lab = el('span', 'ctrl-label');
    const name = el('span', null, o.label);
    const val = el('b', null, o.fmt ? o.fmt(o.value) : o.value);
    lab.appendChild(name);
    lab.appendChild(document.createTextNode(' '));
    lab.appendChild(val);

    const inp = document.createElement('input');
    inp.type = 'range';
    inp.min = o.min; inp.max = o.max; inp.step = o.step || 1;
    inp.value = o.value;
    inp.addEventListener('input', () => {
      const v = parseFloat(inp.value);
      val.textContent = o.fmt ? o.fmt(v) : v;
      o.onInput(v);
    });
    g.appendChild(lab); g.appendChild(inp);
    parent.appendChild(g);
    return { input: inp, set(v) { inp.value = v; val.textContent = o.fmt ? o.fmt(v) : v; } };
  }

  /** 分段按钮 */
  function seg(parent, options, onPick, active) {
    const wrap = el('div', 'seg');
    const btns = [];
    options.forEach((o, i) => {
      const b = el('button', i === (active || 0) ? 'on' : null, o.label);
      b.type = 'button';
      b.addEventListener('click', () => {
        btns.forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        onPick(o.value, i);
      });
      btns.push(b);
      wrap.appendChild(b);
    });
    parent.appendChild(wrap);
    return { buttons: btns, set(i) { btns.forEach((b, k) => b.classList.toggle('on', k === i)); } };
  }

  /** 图例 */
  function legend(parent, items) {
    const wrap = el('div', 'legend');
    items.forEach(it => {
      const s = el('span');
      const i = el('i');
      i.style.background = it.color;
      if (it.dash) { i.style.background = 'transparent'; i.style.borderTop = '2px dashed ' + it.color; i.style.height = '0'; i.style.borderRadius = '0'; }
      s.appendChild(i);
      s.appendChild(document.createTextNode(it.label));
      wrap.appendChild(s);
    });
    parent.appendChild(wrap);
    return wrap;
  }

  /** 读数行 */
  function readout(parent, pairs) {
    parent.innerHTML = '';
    const kv = el('div', 'kv');
    pairs.forEach(([k, v]) => {
      const s = el('span');
      s.appendChild(el('em', null, k));
      s.appendChild(el('b', null, v));
      kv.appendChild(s);
    });
    parent.appendChild(kv);
    return parent;
  }

  /** 数字格式化 */
  const f2 = v => (Math.round(v * 100) / 100).toString();
  const f3 = v => (Math.round(v * 1000) / 1000).toString();
  const f4 = v => (Math.round(v * 10000) / 10000).toString();
  const pct = v => (Math.round(v * 1000) / 10).toFixed(1) + '%';

  /** 主题色快捷访问 */
  function C(k) { return D.Theme.get(k); }

  global.UI = { el, shell, shellPlot, slider, seg, legend, readout, f2, f3, f4, pct, C };
  global.WIDGETS = global.WIDGETS || {};

})(window);
