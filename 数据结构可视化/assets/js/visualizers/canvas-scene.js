(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.CanvasScene = api;
})(globalThis, function () {
  "use strict";
  const P = {
    ink: "#171813",
    muted: "#787b72",
    line: "#d5d3ca",
    paper: "#faf9f4",
    blue: "#2657ff",
    acid: "#1a9c72",
    green: "#1a9c72",
    brandSoft: "#e8edff",
    red: "#ff5a43",
  };
  function setup(canvas) {
    const css = getComputedStyle(document.documentElement);
    P.ink = css.getPropertyValue("--ink").trim() || P.ink;
    P.muted = css.getPropertyValue("--muted").trim() || P.muted;
    P.line = css.getPropertyValue("--line").trim() || P.line;
    P.paper = css.getPropertyValue("--canvas-bg").trim() || P.paper;
    P.blue = css.getPropertyValue("--brand").trim() || P.blue;
    P.green = css.getPropertyValue("--green").trim() || P.green;
    P.acid = P.green;
    P.brandSoft = css.getPropertyValue("--brand-soft").trim() || P.brandSoft;
    P.surface = css.getPropertyValue("--surface").trim() || "#fff";
    P.onAccent = css.getPropertyValue("--on-accent").trim() || "#fff";
    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2),
      r = canvas.getBoundingClientRect(),
      w = Math.max(1, r.width),
      h = Math.max(1, r.height);
    const pixelWidth = Math.round(w * dpr),
      pixelHeight = Math.round(h * dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    const c = canvas.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    c.fillStyle = P.paper;
    c.fillRect(0, 0, w, h);
    const scale = Math.min(1, w / 420);
    c.scale(scale, scale);
    return { c, w: w / scale, h: h / scale };
  }
  function text(
    c,
    s,
    x,
    y,
    size = 12,
    color = P.muted,
    align = "center",
    weight = 600,
  ) {
    const value = String(s),
      family = /[\u4e00-\u9fff]/.test(value)
        ? '"MiSans","思源黑体 CN","Microsoft YaHei","微软雅黑",sans-serif'
        : '"JetBrains Mono",Consolas,monospace';
    c.font = `${weight} ${size + 2}px ${family}`;
    c.fillStyle = color;
    c.textAlign = align;
    c.textBaseline = "middle";
    c.fillText(value, x, y);
  }
  function arrow(c, x1, y1, x2, y2, color = P.ink, width = 1.6) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(x2, y2);
    c.lineTo(x2 - 8 * Math.cos(a - 0.45), y2 - 8 * Math.sin(a - 0.45));
    c.lineTo(x2 - 8 * Math.cos(a + 0.45), y2 - 8 * Math.sin(a + 0.45));
    c.fill();
  }
  function box(c, x, y, w, h, label, active = false, fixed = false) {
    c.fillStyle = fixed ? P.acid : active ? P.blue : P.surface;
    c.strokeStyle = active ? P.blue : P.ink;
    c.lineWidth = active ? 2 : 1;
    c.fillRect(x, y, w, h);
    c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    text(
      c,
      label,
      x + w / 2,
      y + h / 2,
      15,
      active || fixed ? P.onAccent : P.ink,
      "center",
      800,
    );
  }
  return { P, setup, text, arrow, box };
});
