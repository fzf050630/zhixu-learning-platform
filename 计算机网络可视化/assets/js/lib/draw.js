/* ============================================================
   draw.js — 计算机组成原理可视化 · 轻量 Canvas 绘图引擎
   无第三方依赖：HiDPI 自适应 / 主题联动 / 动画 / 图元（方框、箭头、
   位域、总线、分组） / 实例注册与释放
   ============================================================ */
(function (global) {
  'use strict';

  const TAU = Math.PI * 2;

  /* ---------- 主题色读取 ---------- */
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  const THEME_KEYS = [
    '--bg', '--bg-soft', '--card', '--card-2', '--ink', '--ink-2', '--ink-3',
    '--line', '--line-2', '--brand', '--brand-soft', '--brand-ink',
    '--accent', '--accent-soft', '--green', '--green-soft',
    '--red', '--red-soft', '--purple', '--purple-soft', '--teal', '--teal-soft'
  ];

  const Theme = {
    cache: {},
    read() {
      const o = {};
      THEME_KEYS.forEach(k => { o[k] = cssVar(k, '#888'); });
      this.cache = o;
      return o;
    },
    get(k) { return this.cache[k] || (this.cache[k] = cssVar(k, '#888')); }
  };
  Theme.read();

  /* ---------- 颜色工具 ---------- */
  function withAlpha(color, a) {
    if (!color) return 'rgba(0,0,0,' + a + ')';
    color = String(color).trim();
    if (color.startsWith('#')) {
      let h = color.slice(1);
      if (h.length === 3) h = h.split('').map(c => c + c).join('');
      const n = parseInt(h, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }
    const m = color.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(',').map(s => parseFloat(s));
      return `rgba(${p[0]},${p[1]},${p[2]},${a})`;
    }
    return color;
  }

  function mix(c1, c2, t) {
    const p = c => {
      let h = String(c).replace('#', '');
      if (h.length === 3) h = h.split('').map(x => x + x).join('');
      const n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const a = p(c1), b = p(c2);
    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
  }

  const clamp = (v, a, b) => v < a ? a : (v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  const FONT_SANS = '"MiSans","思源黑体 CN","PingFang SC","Microsoft YaHei UI","Segoe UI",system-ui,sans-serif';
  const FONT_MONO = '"JetBrains Mono","SF Mono","Cascadia Code",Consolas,monospace';

  /* ---------- 通用路径 ---------- */
  function roundRectPath(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function niceNum(v) {
    if (Math.abs(v) < 1e-10) return '0';
    if (Math.abs(v) >= 1e5 || Math.abs(v) < 1e-4) return v.toExponential(1);
    const s = v.toFixed(Math.abs(v) >= 10 ? 0 : (Math.abs(v) >= 1 ? 1 : 2));
    return s.replace(/\.?0+$/, '');
  }

  /* ============================================================
     图元助手（直接作用于 ctx，坐标使用画布像素）
     ============================================================ */
  const G = {
    /** 圆角方框 + 可选标题 */
    box(ctx, x, y, w, h, o) {
      o = o || {};
      ctx.save();
      ctx.beginPath();
      roundRectPath(ctx, x, y, w, h, o.radius ?? 8);
      if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
      if (o.stroke !== null) {
        ctx.strokeStyle = o.stroke || Theme.get('--line-2');
        ctx.lineWidth = o.width || 1.2;
        if (o.dash) ctx.setLineDash(o.dash);
        ctx.stroke();
      }
      ctx.restore();
      if (o.title) {
        ctx.save();
        ctx.fillStyle = o.titleColor || Theme.get('--ink');
        ctx.font = `${o.titleWeight || 700} ${o.titleSize || 12.5}px ${FONT_SANS}`;
        ctx.textAlign = o.titleAlign || 'center';
        ctx.textBaseline = 'middle';
        const tx = o.titleAlign === 'left' ? x + 9 : (o.titleAlign === 'right' ? x + w - 9 : x + w / 2);
        ctx.fillText(o.title, tx, o.titleY ?? (y + (o.titleSize || 12.5) * 0.85));
        ctx.restore();
      }
      return G;
    },

    /** 居中的主/副标签 */
    label(ctx, x, y, text, o) {
      o = o || {};
      const str = String(text == null ? '' : text);
      ctx.save();
      let size = o.size || 12.5;
      const fontOf = s => `${o.weight || 600} ${s}px ${o.mono ? FONT_MONO : FONT_SANS}`;
      ctx.font = fontOf(size);
      // 画布边界自适应：仅在可能被裁切时缩小并夹紧
      const tf = ctx.getTransform ? ctx.getTransform() : null;
      const upright = !tf || (Math.abs(tf.b) < 1e-6 && Math.abs(tf.c) < 1e-6);
      if (upright && ctx.canvas) {
        const cw = ctx.canvas.width / (Math.abs(tf.a) || 1);
        if (cw > 0 && isFinite(cw)) {
          const align = o.align || 'center';
          let tw = ctx.measureText(str).width;
          const available = align === 'center' ? 2 * Math.min(x, cw - x)
            : (align === 'right' || align === 'end') ? x : cw - x;
          if (available > 0 && tw > available && size > 8) {
            size = Math.max(8, Math.floor(size * available / tw * 10) / 10);
            ctx.font = fontOf(size);
            tw = ctx.measureText(str).width;
          }
          if (align === 'center') x = Math.max(tw / 2, Math.min(cw - tw / 2, x));
          else if (align === 'right' || align === 'end') x = Math.max(tw, Math.min(cw, x));
          else x = Math.max(0, Math.min(cw - tw, x));
        }
      }
      ctx.fillStyle = o.color || Theme.get('--ink');
      ctx.textAlign = o.align || 'center';
      ctx.textBaseline = o.baseline || 'middle';
      ctx.fillText(str, x, y);
      ctx.restore();
      return G;
    },

    /** 多行文字 */
    lines(ctx, x, y, arr, o) {
      o = o || {};
      const lh = o.lineHeight || 16;
      arr.forEach((t, i) => G.label(ctx, x, y + i * lh, t, o));
      return G;
    },

    /** 箭头，支持圆角折线路径（points: [[x,y],...]） */
    arrow(ctx, points, o) {
      o = o || {};
      if (!points || points.length < 2) return G;
      ctx.save();
      ctx.strokeStyle = o.color || Theme.get('--ink-2');
      ctx.lineWidth = o.width || 1.6;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (o.dash) ctx.setLineDash(o.dash);
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        if (o.curve && i < points.length - 1) {
          const p = points[i], n = points[i + 1];
          ctx.quadraticCurveTo(p[0], p[1], (p[0] + n[0]) / 2, (p[1] + n[1]) / 2);
          if (i + 1 < points.length - 1) ctx.lineTo(n[0], n[1]);
          i++;
        } else {
          ctx.lineTo(points[i][0], points[i][1]);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
      const a = points[points.length - 1], b = points[points.length - 2];
      const ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
      const head = o.head || 7;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(a[0] - head * Math.cos(ang - 0.42), a[1] - head * Math.sin(ang - 0.42));
      ctx.lineTo(a[0] - head * Math.cos(ang + 0.42), a[1] - head * Math.sin(ang + 0.42));
      ctx.closePath();
      ctx.fillStyle = o.color || Theme.get('--ink-2');
      ctx.fill();
      ctx.restore();
      return G;
    },

    /** 位域条：把二进制串按字段分组显示 */
    bits(ctx, x, y, w, h, o) {
      o = o || {};
      const groups = o.groups || [];
      const total = groups.reduce((s, g) => s + (g.bits || 1), 0) || 1;
      let cx = x;
      const defaultColors = [Theme.get('--brand'), Theme.get('--purple'), Theme.get('--teal'), Theme.get('--accent')];
      groups.forEach((g, i) => {
        const gw = w * (g.bits || 1) / total;
        const color = g.color || defaultColors[i % defaultColors.length];
        ctx.save();
        ctx.beginPath();
        roundRectPath(ctx, cx + 1, y, gw - 2, h, o.radius ?? 6);
        ctx.fillStyle = withAlpha(color, o.alpha ?? 0.16);
        ctx.fill();
        ctx.strokeStyle = withAlpha(color, 0.85);
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
        if (g.value !== undefined && g.value !== null) {
          ctx.save();
          ctx.fillStyle = Theme.get('--ink');
          ctx.font = `${o.valueWeight || 700} ${o.valueSize || 14}px ${FONT_MONO}`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(String(g.value), cx + gw / 2, y + h / 2);
          ctx.restore();
        }
        if (g.name) {
          ctx.save();
          ctx.fillStyle = withAlpha(color, 1);
          ctx.font = `700 ${o.nameSize || 11}px ${FONT_SANS}`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillText(g.name, cx + gw / 2, y - 4);
          ctx.restore();
        }
        if (g.range) {
          ctx.save();
          ctx.fillStyle = Theme.get('--ink-3');
          ctx.font = `500 ${o.rangeSize || 10}px ${FONT_MONO}`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          ctx.fillText(g.range, cx + gw / 2, y + h + 4);
          ctx.restore();
        }
        cx += gw;
      });
      return G;
    },

    /** 圆点 */
    dot(ctx, x, y, r, color, ring) {
      ctx.save();
      if (ring) {
        ctx.beginPath(); ctx.arc(x, y, r + 3, 0, TAU);
        ctx.fillStyle = withAlpha(color, 0.2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = color; ctx.fill();
      ctx.restore();
      return G;
    },

    /** 自适应字号文本（在给定宽度内） */
    fitted(ctx, x, y, text, maxW, o) {
      o = o || {};
      let size = o.size || 13;
      ctx.save();
      const font = w => `${o.weight || 700} ${w}px ${o.mono ? FONT_MONO : FONT_SANS}`;
      ctx.font = font(size);
      while (ctx.measureText(text).width > maxW && size > 8) {
        size -= 0.5;
        ctx.font = font(size);
      }
      ctx.restore();
      return G.label(ctx, x, y, text, Object.assign({}, o, { size }));
    }
  };

  /* ============================================================
     Scene —— 无坐标系画布场景
     ============================================================ */
  class Scene {
    constructor(canvas, height) {
      this.cv = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = { height: height || 300 };
      this._layers = [];
      this._raf = null;
      this._t = 1;
      this._resizeObserver = null;
      this.resize();
      this._bindResize();
    }

    _bindResize() {
      if (!global.ResizeObserver) return;
      try {
        this._resizeObserver = new ResizeObserver(() => this.resize());
        this._resizeObserver.observe(this.cv.parentElement || this.cv);
      } catch (e) { /* ignore */ }
    }

    resize() {
      const cv = this.cv;
      const rect = cv.getBoundingClientRect();
      const w = Math.max(240, Math.round(rect.width || cv.parentElement?.clientWidth || 560));
      const h = this.o.height;
      const dpr = Math.min(global.devicePixelRatio || 1, 2);
      if (cv._w === w && cv._h === h && cv._dpr === dpr) return;
      cv._w = w; cv._h = h; cv._dpr = dpr;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w; this.h = h;
      this.render();
    }

    setHeight(h) {
      if (this.o.height === h) return;
      this.o.height = h;
      this.cv._h = -1;
      this.resize();
    }

    layer(fn) { this._layers.push(fn); return this; }
    clearLayers() { this._layers = []; return this; }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      const revealAlpha = this._t < 0.999 ? this._t : 1;
      if (revealAlpha < 1) ctx.globalAlpha = revealAlpha;
      this._layers.forEach(fn => { try { fn(this, ctx, this._t); } catch (e) { console.warn('scene layer', e); } });
      ctx.globalAlpha = 1;
    }

    animate(dur = 620, onDone) {
      if (this._raf) cancelAnimationFrame(this._raf);
      const t0 = performance.now();
      const step = now => {
        const k = clamp((now - t0) / dur, 0, 1);
        this._t = 1 - Math.pow(1 - k, 3);
        this.render();
        if (k < 1) this._raf = requestAnimationFrame(step);
        else { this._raf = null; this._t = 1; this.render(); if (onDone) onDone(); }
      };
      this._raf = requestAnimationFrame(step);
      return this;
    }

    static() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null; this._t = 1; this.render();
      return this;
    }

    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._resizeObserver) { try { this._resizeObserver.disconnect(); } catch (e) { } this._resizeObserver = null; }
    }
  }

  /* ============================================================
     Plot —— 直角坐标系（时间图、曲线、柱形）
     ============================================================ */
  class Plot {
    constructor(canvas, o) {
      o = o || {};
      this.cv = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({
        xMin: 0, xMax: 1, yMin: 0, yMax: 1,
        pad: { l: 48, r: 18, t: 16, b: 36 },
        xTicks: 5, yTicks: 5,
        xLabel: '', yLabel: '',
        xFmt: null, yFmt: null,
        grid: true, axes: true,
        height: 300
      }, o);
      this._layers = [];
      this._raf = null;
      this._t = 1;
      this._resizeObserver = null;
      this.resize();
      this._bindResize();
    }

    _bindResize() {
      if (!global.ResizeObserver) return;
      try {
        this._resizeObserver = new ResizeObserver(() => this.resize());
        this._resizeObserver.observe(this.cv.parentElement || this.cv);
      } catch (e) { /* ignore */ }
    }

    resize() {
      const cv = this.cv;
      const rect = cv.getBoundingClientRect();
      const w = Math.max(240, Math.round(rect.width || cv.parentElement?.clientWidth || 560));
      const h = this.o.height;
      const dpr = Math.min(global.devicePixelRatio || 1, 2);
      if (cv._w === w && cv._h === h && cv._dpr === dpr) return;
      cv._w = w; cv._h = h; cv._dpr = dpr;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w; this.h = h;
      const p = this.o.pad;
      this.px = p.l; this.py = p.t;
      this.pw = w - p.l - p.r;
      this.ph = h - p.t - p.b;
      this.render();
    }

    X(x) { const o = this.o; return this.px + (x - o.xMin) / (o.xMax - o.xMin) * this.pw; }
    Y(y) { const o = this.o; return this.py + this.ph - (y - o.yMin) / (o.yMax - o.yMin) * this.ph; }

    setDomain(xMin, xMax, yMin, yMax) {
      const o = this.o;
      if (xMin !== undefined) o.xMin = xMin;
      if (xMax !== undefined) o.xMax = xMax;
      if (yMin !== undefined) o.yMin = yMin;
      if (yMax !== undefined) o.yMax = yMax;
      return this;
    }

    layer(fn) { this._layers.push(fn); return this; }
    clearLayers() { this._layers = []; return this; }

    render() {
      const ctx = this.ctx, o = this.o;
      ctx.clearRect(0, 0, this.w, this.h);
      if (o.grid) this.drawGrid();
      if (o.axes) this.drawAxes();
      this._layers.forEach(fn => { try { fn(this, ctx, this._t); } catch (e) { console.warn('plot layer', e); } });
    }

    drawGrid() {
      const ctx = this.ctx, o = this.o;
      ctx.save();
      ctx.strokeStyle = withAlpha(Theme.get('--line'), 0.85);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= o.xTicks; i++) {
        const x = Math.round(this.px + this.pw * i / o.xTicks) + .5;
        ctx.moveTo(x, this.py); ctx.lineTo(x, this.py + this.ph);
      }
      for (let i = 0; i <= o.yTicks; i++) {
        const y = Math.round(this.py + this.ph * i / o.yTicks) + .5;
        ctx.moveTo(this.px, y); ctx.lineTo(this.px + this.pw, y);
      }
      ctx.stroke(); ctx.restore();
    }

    drawAxes() {
      const ctx = this.ctx, o = this.o;
      const fmtX = o.xFmt || niceNum, fmtY = o.yFmt || niceNum;
      ctx.save();
      ctx.strokeStyle = Theme.get('--line-2'); ctx.lineWidth = 1.2;
      const y0 = clamp(this.Y(0), this.py, this.py + this.ph);
      const x0 = clamp(this.X(0), this.px, this.px + this.pw);
      ctx.beginPath();
      ctx.moveTo(this.px, y0 + .5); ctx.lineTo(this.px + this.pw, y0 + .5);
      ctx.moveTo(x0 + .5, this.py); ctx.lineTo(x0 + .5, this.py + this.ph);
      ctx.stroke();
      ctx.fillStyle = Theme.get('--ink-3');
      ctx.font = '500 10.5px ' + FONT_MONO;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= o.xTicks; i++) {
        const v = o.xMin + (o.xMax - o.xMin) * i / o.xTicks;
        ctx.fillText(fmtX(v), this.px + this.pw * i / o.xTicks, this.py + this.ph + 7);
      }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= o.yTicks; i++) {
        const v = o.yMax - (o.yMax - o.yMin) * i / o.yTicks;
        ctx.fillText(fmtY(v), this.px - 8, this.py + this.ph * i / o.yTicks);
      }
      ctx.fillStyle = Theme.get('--ink-3'); ctx.font = '600 11px ' + FONT_SANS;
      if (o.xLabel) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(o.xLabel, this.px + this.pw, this.py + this.ph + 26); }
      if (o.yLabel) { ctx.save(); ctx.translate(12, this.py + 2); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(o.yLabel, 0, 0); ctx.restore(); }
      ctx.restore();
    }

    polyline(pts, opt = {}) {
      this.layer((p, ctx) => {
        if (!pts || pts.length < 2) return;
        ctx.save(); ctx.beginPath();
        ctx.lineWidth = opt.width || 2;
        ctx.strokeStyle = withAlpha(opt.color, opt.alpha ?? 1);
        ctx.lineJoin = 'round'; ctx.lineCap = opt.cap || 'round';
        if (opt.dash) ctx.setLineDash(opt.dash);
        pts.forEach(([x, y], i) => i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y)));
        if (opt.close) ctx.closePath();
        ctx.stroke(); ctx.restore();
      });
      return this;
    }

    bars(data, opt = {}) {
      this.layer((p, ctx, t) => {
        const o = p.o;
        const unit = p.pw / (o.xMax - o.xMin);
        const bw = Math.max(2, unit * (opt.widthRatio ?? 0.6));
        const yb = p.Y(clamp(0, o.yMin, o.yMax));
        data.forEach(([x, y], i) => {
          const cx = p.X(x), top = p.Y(y), h = yb - top;
          if (h <= 0.4) return;
          const r = Math.min(opt.radius ?? 3, bw / 2.6, h / 2.2);
          ctx.beginPath();
          roundRectPath(ctx, cx - bw / 2, top, bw, h, r);
          ctx.fillStyle = withAlpha(opt.color, opt.alpha ?? 0.9);
          ctx.fill();
        });
      });
      return this;
    }

    vline(x, opt = {}) {
      this.layer((p, ctx) => {
        const X = p.X(x);
        if (X < p.px - 1 || X > p.px + p.pw + 1) return;
        ctx.save(); ctx.beginPath(); ctx.setLineDash(opt.dash || [4, 4]);
        ctx.strokeStyle = withAlpha(opt.color, opt.alpha ?? 1); ctx.lineWidth = opt.width || 1;
        ctx.moveTo(X, p.py); ctx.lineTo(X, p.py + p.ph);
        ctx.stroke(); ctx.restore();
      });
      return this;
    }

    hline(y, opt = {}) {
      this.layer((p, ctx) => {
        const Y = p.Y(y);
        if (Y < p.py - 1 || Y > p.py + p.ph + 1) return;
        ctx.save(); ctx.beginPath(); ctx.setLineDash(opt.dash || [4, 4]);
        ctx.strokeStyle = withAlpha(opt.color, opt.alpha ?? 1); ctx.lineWidth = opt.width || 1;
        ctx.moveTo(p.px, Y); ctx.lineTo(p.px + p.pw, Y);
        ctx.stroke(); ctx.restore();
      });
      return this;
    }

    custom(fn) { this.layer((p, ctx, t) => fn(p, ctx, t)); return this; }

    animate(dur = 620, onDone) {
      if (this._raf) cancelAnimationFrame(this._raf);
      const t0 = performance.now();
      const step = now => {
        const k = clamp((now - t0) / dur, 0, 1);
        this._t = 1 - Math.pow(1 - k, 3);
        this.render();
        if (k < 1) this._raf = requestAnimationFrame(step);
        else { this._raf = null; this._t = 1; this.render(); if (onDone) onDone(); }
      };
      this._raf = requestAnimationFrame(step);
      return this;
    }

    static() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = null; this._t = 1; this.render();
      return this;
    }

    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._resizeObserver) { try { this._resizeObserver.disconnect(); } catch (e) { } this._resizeObserver = null; }
    }
  }

  /* ---------- 实例注册 / 主题联动 ---------- */
  const registry = new Set();
  function register(p) { registry.add(p); return p; }
  function unregister(p) {
    registry.delete(p);
    if (p && typeof p.destroy === 'function') { try { p.destroy(); } catch (e) { } }
  }
  function prune() {
    registry.forEach(p => { if (!p.cv || !p.cv.isConnected) unregister(p); });
  }
  function refreshTheme() {
    prune();
    Theme.read();
    registry.forEach(p => { try { p.resize(); p.render(); } catch (e) { } });
  }
  global.addEventListener('resize', () => {
    prune();
    registry.forEach(p => { try { p.resize(); } catch (e) { } });
  });

  global.Draw = {
    Scene, Plot, Theme, G,
    register, unregister, prune, refreshTheme,
    withAlpha, mix, clamp, lerp, roundRectPath, niceNum,
    FONT_SANS, FONT_MONO, TAU
  };

})(window);
