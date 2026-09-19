(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    node ? require("./canvas-scene.js") : root.DS.CanvasScene,
  );
  if (node) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Renderers = root.DS.Renderers || {};
  root.DS.Renderers.hash = api;
})(globalThis, function (scene) {
  "use strict";
  const { P, setup, text, arrow, box } = scene;
  function hash(canvas, s) {
    const { c, w, h } = setup(canvas),
      b = s.buckets || [],
      row = Math.min(48, (h - 70) / Math.max(b.length, 1)),
      left = Math.max(55, w * 0.2),
      top = (h - row * b.length) / 2;
    b.forEach((bucket, i) => {
      const y = top + i * row;
      text(c, i, left - 25, y + row / 2, 12, i === s.index ? P.blue : P.muted);
      box(c, left, y + 5, 52, row - 10, "H", i === s.index);
      bucket.forEach((value, j) => {
        const x = left + 82 + j * 76;
        arrow(
          c,
          j === 0 ? left + 52 : x - 26,
          y + row / 2,
          x - 5,
          y + row / 2,
          i === s.index ? P.blue : P.line,
        );
        box(
          c,
          x,
          y + 5,
          54,
          row - 10,
          value,
          i === s.index && j === bucket.length - 1,
        );
      });
    });
    text(
      c,
      s.collision ? "发生冲突 → 链地址法" : `散列地址 = key mod ${b.length}`,
      w / 2,
      28,
      12,
      s.collision ? P.red : P.muted,
    );
  }
  return hash;
});
