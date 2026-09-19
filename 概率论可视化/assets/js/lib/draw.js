/* ============================================================
   draw.js — 轻量 Canvas 绘图引擎（无第三方依赖）
   提供：HiDPI 自适应 / 坐标系 / 网格 / 曲线 / 柱形 / 区域填充 /
        直方图 / 动画 / 鼠标交互 / 主题联动
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
    color = color.trim();
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
      let h = c.replace('#', '');
      if (h.length === 3) h = h.split('').map(x => x + x).join('');
      const n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const a = p(c1), b = p(c2);
    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
  }

  const clamp = (v, a, b) => v < a ? a : (v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- 数学辅助 ---------- */
  const M = {
    fact(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
    lgamma(n) {
      // Lanczos 近似，用于大 n 的阶乘对数
      const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7];
      if (n < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * n)) - M.lgamma(1 - n);
      n -= 1;
      let x = 0.99999999999980993;
      for (let i = 0; i < g.length; i++) x += g[i] / (n + i + 1);
      const t = n + g.length - 0.5;
      return 0.5 * Math.log(TAU) + (n + 0.5) * Math.log(t) - t + Math.log(x);
    },
    lfact(n) { return M.lgamma(n + 1); },
    C(n, k) {
      if (k < 0 || k > n) return 0;
      if (k === 0 || k === n) return 1;
      k = Math.min(k, n - k);
      let r = 1;
      for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
      return r;
    },
    lC(n, k) {
      if (k < 0 || k > n) return -Infinity;
      return M.lfact(n) - M.lfact(k) - M.lfact(n - k);
    },
    erf(x) {
      const s = Math.sign(x); x = Math.abs(x);
      const t = 1 / (1 + 0.3275911 * x);
      const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
      return s * y;
    },
    normCdf(x, mu = 0, sg = 1) { return 0.5 * (1 + M.erf((x - mu) / (sg * Math.SQRT2))); },
    normPdf(x, mu = 0, sg = 1) { const z = (x - mu) / sg; return Math.exp(-0.5 * z * z) / (sg * Math.sqrt(TAU)); },
    normInv(p) {
      // Acklam 逆正态
      if (p <= 0) return -Infinity; if (p >= 1) return Infinity;
      const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
      const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
      const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
      const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
      const pl = 0.02425;
      let q, r;
      if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
      if (p <= 1 - pl) { q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
      q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
  };

  /* ============================================================
     Plot —— 一个画布上的直角坐标系
     ============================================================ */
  class Plot {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} o  { xMin,xMax,yMin,yMax, pad:{l,r,t,b}, xTicks,yTicks,
     *                      xLabel,yLabel, xFmt,yFmt, aspect }
     */
    constructor(canvas, o) {
      o = o || {};
      this.cv = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({
        xMin: 0, xMax: 1, yMin: 0, yMax: 1,
        pad: { l: 46, r: 16, t: 14, b: 34 },
        xTicks: 5, yTicks: 5,
        xLabel: '', yLabel: '',
        xFmt: null, yFmt: null,
        grid: true, axes: true,
        height: 300
      }, o);
      this.hover = null;
      this._layers = [];
      this._anim = null;
      this._raf = null;
      this._t = 1;             // 动画进度 0→1
      this.resize();
      this._bindEvents();
    }

    /* ---------- 尺寸 / HiDPI ---------- */
    resize() {
      const cv = this.cv;
      const rect = cv.getBoundingClientRect();
      const w = Math.max(240, rect.width || cv.parentElement.clientWidth || 560);
      const h = this.o.height;
      const dpr = Math.min(global.devicePixelRatio || 1, 2);
      if (cv._w === w && cv._h === h && cv._dpr === dpr) return;
      cv._w = w; cv._h = h; cv._dpr = dpr;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w; this.h = h;
      const p = this.o.pad;
      this.px = p.l; this.py = p.t;
      this.pw = w - p.l - p.r;
      this.ph = h - p.t - p.b;
      this.render();
    }

    /* ---------- 坐标映射 ---------- */
    X(x) { const o = this.o; return this.px + (x - o.xMin) / (o.xMax - o.xMin) * this.pw; }
    Y(y) { const o = this.o; return this.py + this.ph - (y - o.yMin) / (o.yMax - o.yMin) * this.ph; }
    invX(px) { const o = this.o; return o.xMin + (px - this.px) / this.pw * (o.xMax - o.xMin); }
    invY(py) { const o = this.o; return o.yMin + (this.py + this.ph - py) / this.ph * (o.yMax - o.yMin); }

    setDomain(xMin, xMax, yMin, yMax) {
      const o = this.o;
      if (xMin !== undefined) o.xMin = xMin;
      if (xMax !== undefined) o.xMax = xMax;
      if (yMin !== undefined) o.yMin = yMin;
      if (yMax !== undefined) o.yMax = yMax;
      return this;
    }

    /* ---------- 绘制层 ---------- */
    layer(fn) { this._layers.push(fn); return this; }
    clearLayers() { this._layers = []; return this; }

    render() {
      const ctx = this.ctx, o = this.o;
      ctx.clearRect(0, 0, this.w, this.h);
      if (o.grid) this.drawGrid();
      if (o.axes) this.drawAxes();
      this._layers.forEach(fn => { try { fn(this, ctx, this._t); } catch (e) { console.warn('layer error', e); } });
    }

    /* ---------- 网格 ---------- */
    drawGrid() {
      const ctx = this.ctx, o = this.o, T = Theme.cache;
      const n = o.xTicks, m = o.yTicks;
      ctx.save();
      ctx.strokeStyle = withAlpha(T['--line'], 0.85);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const x = this.px + this.pw * i / n;
        ctx.moveTo(Math.round(x) + .5, this.py);
        ctx.lineTo(Math.round(x) + .5, this.py + this.ph);
      }
      for (let i = 0; i <= m; i++) {
        const y = this.py + this.ph * i / m;
        ctx.moveTo(this.px, Math.round(y) + .5);
        ctx.lineTo(this.px + this.pw, Math.round(y) + .5);
      }
      ctx.stroke();
      ctx.restore();
    }

    /* ---------- 坐标轴 ---------- */
    drawAxes() {
      const ctx = this.ctx, o = this.o, T = Theme.cache;
      const fmtX = o.xFmt || (v => niceNum(v));
      const fmtY = o.yFmt || (v => niceNum(v));
      ctx.save();
      ctx.strokeStyle = T['--line-2']; ctx.lineWidth = 1.2;
      ctx.beginPath();
      // x 轴
      const y0 = clamp(this.Y(0), this.py, this.py + this.ph);
      ctx.moveTo(this.px, y0 + .5); ctx.lineTo(this.px + this.pw, y0 + .5);
      // y 轴
      const x0 = clamp(this.X(0), this.px, this.px + this.pw);
      ctx.moveTo(x0 + .5, this.py); ctx.lineTo(x0 + .5, this.py + this.ph);
      ctx.stroke();

      // 刻度文字
      ctx.fillStyle = T['--ink-3'];
      ctx.font = '500 10.5px ' + FONT_MONO;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let i = 0; i <= o.xTicks; i++) {
        const v = o.xMin + (o.xMax - o.xMin) * i / o.xTicks;
        const x = this.px + this.pw * i / o.xTicks;
        ctx.fillText(fmtX(v), x, this.py + this.ph + 7);
      }
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      for (let i = 0; i <= o.yTicks; i++) {
        const v = o.yMax - (o.yMax - o.yMin) * i / o.yTicks;
        const y = this.py + this.ph * i / o.yTicks;
        ctx.fillText(fmtY(v), this.px - 8, y);
      }
      // 轴标题
      ctx.fillStyle = T['--ink-3']; ctx.font = '600 11px ' + FONT_SANS;
      if (o.xLabel) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(o.xLabel, this.px + this.pw, this.py + this.ph + 24); }
      if (o.yLabel) { ctx.save(); ctx.translate(11, this.py + 2); ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(o.yLabel, 0, 0); ctx.restore(); }
      ctx.restore();
    }

    /* ============ 绘制基元 ============ */

    /** 折线 */
    polyline(pts, { color, width = 2, dash = null, alpha = 1, cap = 'round', close = false } = {}) {
      this.layer((p, ctx) => {
        if (!pts || pts.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = width; ctx.strokeStyle = withAlpha(color, alpha);
        ctx.lineJoin = 'round'; ctx.lineCap = cap;
        if (dash) ctx.setLineDash(dash);
        pts.forEach(([x, y], i) => i ? ctx.lineTo(p.X(x), p.Y(y)) : ctx.moveTo(p.X(x), p.Y(y)));
        if (close) ctx.closePath();
        ctx.stroke(); ctx.restore();
      });
      return this;
    }

    /** 函数曲线（自动采样） */
    curve(fn, { color, width = 2.2, dash = null, alpha = 1, samples = 480, from, to, clipY = true } = {}) {
      this.layer((p, ctx) => {
        const o = p.o;
        const x0 = from !== undefined ? from : o.xMin;
        const x1 = to !== undefined ? to : o.xMax;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = width; ctx.strokeStyle = withAlpha(color, alpha);
        ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        if (dash) ctx.setLineDash(dash);
        let started = false;
        for (let i = 0; i <= samples; i++) {
          const x = x0 + (x1 - x0) * i / samples;
          const y = fn(x);
          if (!isFinite(y)) { started = false; continue; }
          const Y = clipY ? clamp(p.Y(y), p.py - 4000, p.py + p.ph + 4000) : p.Y(y);
          if (!started) { ctx.moveTo(p.X(x), Y); started = true; }
          else ctx.lineTo(p.X(x), Y);
        }
        ctx.stroke(); ctx.restore();
      });
      return this;
    }

    /** 填充曲线下方区域（x∈[a,b]） */
    area(fn, a, b, { color, alpha = 0.18, samples = 260, baseline = null, stroke = true } = {}) {
      this.layer((p, ctx) => {
        ctx.save();
        ctx.beginPath();
        const yb = baseline === null ? p.Y(Math.max(p.o.yMin, 0)) : p.Y(baseline);
        ctx.moveTo(p.X(a), yb);
        for (let i = 0; i <= samples; i++) {
          const x = a + (b - a) * i / samples;
          const y = fn(x);
          if (!isFinite(y)) continue;
          ctx.lineTo(p.X(x), p.Y(y));
        }
        ctx.lineTo(p.X(b), yb);
        ctx.closePath();
        ctx.fillStyle = withAlpha(color, alpha);
        ctx.fill();
        if (stroke) {
          ctx.strokeStyle = withAlpha(color, Math.min(1, alpha + 0.45));
          ctx.lineWidth = 1.4; ctx.stroke();
        }
        ctx.restore();
      });
      return this;
    }

    /** 柱形（离散分布） */
    bars(data, { color, widthRatio = 0.62, alpha = 1, radius = 3, baseline = null, labelAbove = false, labelFmt = null } = {}) {
      this.layer((p, ctx, t) => {
        const o = p.o;
        const unit = p.pw / (o.xMax - o.xMin);
        const bw = Math.max(2, unit * widthRatio);
        const yb = baseline === null ? p.Y(clamp(0, o.yMin, o.yMax)) : p.Y(baseline);
        ctx.save();
        data.forEach(([x, y], i) => {
          const k = clamp(t * 1.18 - i * 0.028, 0, 1);   // 依次升起
          const e = 1 - Math.pow(1 - k, 3);
          const cx = p.X(x);
          const top = yb + (p.Y(y) - yb) * e;
          const h = yb - top;
          if (h <= 0.4) return;
          const r = Math.min(radius, bw / 2.6, h / 2.2);
          ctx.beginPath();
          roundRectPath(ctx, cx - bw / 2, top, bw, h, r);
          const g = ctx.createLinearGradient(0, top, 0, yb);
          g.addColorStop(0, withAlpha(color, alpha));
          g.addColorStop(1, withAlpha(color, alpha * 0.62));
          ctx.fillStyle = g; ctx.fill();
          if (labelAbove && labelFmt) {
            ctx.fillStyle = Theme.cache['--ink-3'];
            ctx.font = '500 10px ' + FONT_MONO;
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(labelFmt(y), cx, top - 3);
          }
        });
        ctx.restore();
      });
      return this;
    }

    /** 垂直线 */
    vline(x, { color, width = 1, dash = [4, 4], alpha = 1, label = null, labelPos = 'top' } = {}) {
      this.layer((p, ctx) => {
        const X = p.X(x);
        if (X < p.px - 1 || X > p.px + p.pw + 1) return;
        ctx.save();
        ctx.beginPath(); ctx.setLineDash(dash);
        ctx.strokeStyle = withAlpha(color, alpha); ctx.lineWidth = width;
        ctx.moveTo(X, p.py); ctx.lineTo(X, p.py + p.ph);
        ctx.stroke();
        if (label) {
          ctx.setLineDash([]);
          ctx.fillStyle = withAlpha(color, 1);
          ctx.font = '600 10.5px ' + FONT_MONO;
          ctx.textAlign = 'center';
          ctx.textBaseline = labelPos === 'top' ? 'top' : 'bottom';
          ctx.fillText(label, X, labelPos === 'top' ? p.py + 3 : p.py + p.ph - 3);
        }
        ctx.restore();
      });
      return this;
    }

    /** 水平线 */
    hline(y, { color, width = 1, dash = [4, 4], alpha = 1 } = {}) {
      this.layer((p, ctx) => {
        const Y = p.Y(y);
        if (Y < p.py - 1 || Y > p.py + p.ph + 1) return;
        ctx.save();
        ctx.beginPath(); ctx.setLineDash(dash);
        ctx.strokeStyle = withAlpha(color, alpha); ctx.lineWidth = width;
        ctx.moveTo(p.px, Y); ctx.lineTo(p.px + p.pw, Y);
        ctx.stroke(); ctx.restore();
      });
      return this;
    }

    /** 点 */
    dot(x, y, { color, r = 4.2, ring = true } = {}) {
      this.layer((p, ctx) => {
        ctx.save();
        if (ring) {
          ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r + 2.5, 0, TAU);
          ctx.fillStyle = withAlpha(color, 0.2); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.X(x), p.Y(y), r, 0, TAU);
        ctx.fillStyle = color; ctx.fill();
        ctx.restore();
      });
      return this;
    }

    /** 标注文字 */
    note(x, y, text, { color, align = 'left', baseline = 'middle', size = 11.5, weight = 600, dx = 0, dy = 0, bg = null } = {}) {
      this.layer((p, ctx) => {
        ctx.save();
        let px = size;
        ctx.font = `${weight} ${px}px ${FONT_SANS}`;
        ctx.textAlign = align; ctx.textBaseline = baseline;
        let X = p.X(x) + dx, Y = p.Y(y) + dy;
        const right = p.px + p.pw, left = p.px;
        let textW = ctx.measureText(text).width;
        const available = align === 'center' ? 2 * Math.min(X - left, right - X)
          : align === 'right' ? X - left : right - X;
        if (available > 0 && textW > available && px > 8) {
          px = Math.max(8, Math.floor(px * available / textW * 10) / 10);
          ctx.font = `${weight} ${px}px ${FONT_SANS}`;
          textW = ctx.measureText(text).width;
        }
        if (align === 'center') X = Math.max(left + textW / 2, Math.min(right - textW / 2, X));
        else if (align === 'right') X = Math.max(left + textW, X);
        else X = Math.min(X, right - textW);
        ctx.font = `${weight} ${px}px ${FONT_SANS}`;
        if (bg) {
          const w = ctx.measureText(text).width;
          ctx.fillStyle = bg;
          ctx.beginPath();
          const bx = align === 'center' ? X - w / 2 - 4 : (align === 'right' ? X - w - 4 : X - 4);
          roundRectPath(ctx, bx, Y - px * 0.78, w + 8, px * 1.5, 4);
          ctx.fill();
        }
        ctx.fillStyle = color;
        ctx.fillText(text, X, Y);
        ctx.restore();
      });
      return this;
    }

    /** 箭头 */
    arrow(x1, y1, x2, y2, { color, width = 1.6, head = 6, dash = null } = {}) {
      this.layer((p, ctx) => {
        const X1 = p.X(x1), Y1 = p.Y(y1), X2 = p.X(x2), Y2 = p.Y(y2);
        const a = Math.atan2(Y2 - Y1, X2 - X1);
        ctx.save();
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
        if (dash) ctx.setLineDash(dash);
        ctx.beginPath(); ctx.moveTo(X1, Y1); ctx.lineTo(X2, Y2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(X2, Y2);
        ctx.lineTo(X2 - head * Math.cos(a - 0.42), Y2 - head * Math.sin(a - 0.42));
        ctx.lineTo(X2 - head * Math.cos(a + 0.42), Y2 - head * Math.sin(a + 0.42));
        ctx.closePath(); ctx.fillStyle = color; ctx.fill();
        ctx.restore();
      });
      return this;
    }

    /** 任意自定义绘制 */
    custom(fn) { this.layer((p, ctx, t) => fn(p, ctx, t)); return this; }

    /* ---------- 动画 ---------- */
    animate(dur = 620, onDone) {
      if (this._raf) cancelAnimationFrame(this._raf);
      const t0 = performance.now();
      const step = (now) => {
        const k = clamp((now - t0) / dur, 0, 1);
        this._t = 1 - Math.pow(1 - k, 3);
        this.render();
        if (k < 1) this._raf = requestAnimationFrame(step);
        else { this._raf = null; this._t = 1; if (onDone) onDone(); }
      };
      this._raf = requestAnimationFrame(step);
      return this;
    }
    static() { if (this._raf) cancelAnimationFrame(this._raf); this._raf = null; this._t = 1; this.render(); return this; }

    /* ---------- 交互 ---------- */
    _bindEvents() {
      const cv = this.cv;
      this._onMove = (e) => {
        const r = cv.getBoundingClientRect();
        const mx = e.clientX - r.left, my = e.clientY - r.top;
        if (mx < this.px - 8 || mx > this.px + this.pw + 8) { if (this.hover !== null) { this.hover = null; this.render(); } return; }
        this.hover = this.invX(mx);
        this.render();
      };
      this._onLeave = () => { if (this.hover !== null) { this.hover = null; this.render(); } };
      cv.addEventListener('mousemove', this._onMove);
      cv.addEventListener('mouseleave', this._onLeave);
    }

    destroy() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this.cv.removeEventListener('mousemove', this._onMove);
      this.cv.removeEventListener('mouseleave', this._onLeave);
    }
  }

  /* ---------- 通用 Canvas 场景（非坐标系） ---------- */
  class Scene {
    constructor(canvas, height) {
      this.cv = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = { height: height || 280 };
      this._layers = [];
      this._anim = null; this._raf = null; this._t = 1;
      this.resize();
    }
    resize() {
      const cv = this.cv;
      const rect = cv.getBoundingClientRect();
      const w = Math.max(240, rect.width || cv.parentElement.clientWidth || 560);
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
    layer(fn) { this._layers.push(fn); return this; }
    clearLayers() { this._layers = []; return this; }
    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.w, this.h);
      this._layers.forEach(fn => { try { fn(this, ctx, this._t); } catch (e) { console.warn(e); } });
    }
    animate(dur = 620) {
      if (this._raf) cancelAnimationFrame(this._raf);
      const t0 = performance.now();
      const step = (now) => {
        const k = clamp((now - t0) / dur, 0, 1);
        this._t = 1 - Math.pow(1 - k, 3);
        this.render();
        if (k < 1) this._raf = requestAnimationFrame(step); else { this._raf = null; this._t = 1; }
      };
      this._raf = requestAnimationFrame(step);
      return this;
    }
    static() { if (this._raf) cancelAnimationFrame(this._raf); this._raf = null; this._t = 1; this.render(); return this; }
    destroy() { if (this._raf) cancelAnimationFrame(this._raf); }
  }

  /* ---------- 工具 ---------- */
  function roundRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
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
    if (Math.abs(v) >= 1e5 || Math.abs(v) < 1e-4) return v.toExponential(1).replace('e', 'e');
    const s = v.toFixed(Math.abs(v) >= 10 ? 0 : (Math.abs(v) >= 1 ? 1 : 2));
    return s.replace(/\.?0+$/, '');
  }

  const FONT_SANS = '"MiSans","思源黑体 CN","PingFang SC","Microsoft YaHei UI","Segoe UI",system-ui,sans-serif';
  const FONT_MONO = '"JetBrains Mono","SF Mono",Consolas,monospace';

  /* ---------- 主题变化时重绘 ---------- */
  const registry = new Set();
  function register(p) { registry.add(p); return p; }
  function unregister(p) {
    registry.delete(p);
    if (p && typeof p.destroy === 'function') { try { p.destroy(); } catch (e) { } }
  }
  /** 注销已从 DOM 中移除的实例，避免内存泄漏与无效重绘 */
  function prune() {
    registry.forEach(p => {
      if (!p.cv || !p.cv.isConnected) unregister(p);
    });
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

  /* ---------- 通用图元助手（与 408 系列组件统一 API） ---------- */
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

    /** 居中 / 对齐标签 */
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

    /** 折线箭头 */
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
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
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
          ctx.fillStyle = color;
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

    /** 自适应字号文本 */
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

  /* ---------- 导出 ---------- */
  global.Draw = {
    Plot, Scene, Theme, register, unregister, prune, refreshTheme,
    withAlpha, mix, clamp, lerp, roundRectPath, niceNum,
    FONT_SANS, FONT_MONO, M, TAU, G
  };

  global.MathX = M;

})(window);
