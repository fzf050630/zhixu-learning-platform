(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    node ? require("./canvas-scene.js") : root.DS.CanvasScene,
  );
  if (node) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Renderers = root.DS.Renderers || {};
  root.DS.Renderers.array = api;
})(globalThis, function (scene) {
  "use strict";
  const { P, setup, text, box } = scene;
  function array(canvas, s) {
    const { c, w, h } = setup(canvas),
      v = s.values || [],
      n = v.length,
      cell = Math.min(72, (w - 70) / Math.max(n, 1)),
      x = (w - cell * n) / 2,
      y = h * 0.43;
    const fixed = new Set(s.fixed || []),
      active = new Set(s.active || []);
    v.forEach((value, i) => {
      box(
        c,
        x + i * cell,
        y,
        cell,
        cell,
        value === null ? "∅" : value,
        active.has(i),
        fixed.has(i),
      );
      text(c, i, x + (i + 0.5) * cell, y + cell + 20, 10, P.muted);
      if (s.low === i) text(c, "low", x + (i + 0.5) * cell, y - 24, 10, P.blue);
      if (s.high === i)
        text(c, "high", x + (i + 0.5) * cell, y - 24, 10, P.red);
      if (s.mid === i) text(c, "mid", x + (i + 0.5) * cell, y - 43, 10, P.ink);
    });
    if (s.pivotIndex != null)
      text(c, "PIVOT", x + (s.pivotIndex + 0.5) * cell, y - 27, 10, P.blue);
    if (s.range)
      text(
        c,
        `当前区间 [${s.range[0]}, ${s.range[1]}]`,
        w / 2,
        56,
        11,
        P.muted,
      );
    if (s.heapEnd != null && s.heapEnd >= 0)
      text(c, `堆区间 0…${s.heapEnd}`, w / 2, 56, 11, P.muted);
  }
  return array;
});
