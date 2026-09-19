(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    node ? require("./canvas-scene.js") : root.DS.CanvasScene,
  );
  if (node) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Renderers = root.DS.Renderers || {};
  root.DS.Renderers.stack = api;
})(globalThis, function (scene) {
  "use strict";
  const { P, setup, text, arrow, box } = scene;
  function stack(canvas, s) {
    const { c, w, h } = setup(canvas),
      v = s.values || [],
      bw = 110,
      bh = Math.min(54, (h - 120) / Math.max(v.length, 1)),
      x = (w - bw) / 2,
      base = h - 55;
    v.forEach((value, i) =>
      box(c, x, base - (i + 1) * bh, bw, bh, value, i === s.active),
    );
    text(c, "栈底", x - 20, base - 8, 10, P.muted, "right");
    text(c, 'bottom = 0；top = ' + (v.length - 1), w / 2, 30, 11, P.ink);
    if (!v.length) text(c, '空栈：top = -1（不指向元素）', w / 2, h / 2, 12, P.blue);
    if (v.length) {
      arrow(
        c,
        x + bw + 65,
        base - v.length * bh + bh / 2,
        x + bw + 8,
        base - v.length * bh + bh / 2,
        P.blue,
      );
      text(
        c,
        'top=' + (v.length - 1),
        x + bw + 72,
        base - v.length * bh + bh / 2,
        11,
        P.blue,
        "left",
      );
    }
  }
  return stack;
});
