(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    node ? require("./canvas-scene.js") : root.DS.CanvasScene,
  );
  if (node) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Renderers = root.DS.Renderers || {};
  root.DS.Renderers.matrix = api;
})(globalThis, function (scene) {
  "use strict";
  const { P, setup, text } = scene;
  function matrix(canvas, s) {
    const { c, w, h } = setup(canvas),
      ids = s.ids || [],
      m = s.matrix || [],
      n = ids.length,
      cell = Math.min(58, (w - 100) / (n + 1), (h - 80) / (n + 1)),
      ox = (w - cell * (n + 1)) / 2,
      oy = (h - cell * (n + 1)) / 2;
    for (let i = 0; i <= n; i++)
      for (let j = 0; j <= n; j++) {
        const active =
            s.active && s.active[0] === i - 1 && s.active[1] === j - 1,
          via = s.k != null && (i - 1 === s.k || j - 1 === s.k);
        c.fillStyle = active
          ? P.green
          : via
            ? P.brandSoft || "#e8edff"
            : i === 0 || j === 0
              ? P.brandSoft
              : P.surface;
        c.fillRect(ox + j * cell, oy + i * cell, cell, cell);
        c.strokeStyle = P.line;
        c.strokeRect(
          ox + j * cell + 0.5,
          oy + i * cell + 0.5,
          cell - 1,
          cell - 1,
        );
        const value =
          i === 0 && j === 0
            ? ""
            : i === 0
              ? ids[j - 1]
              : j === 0
                ? ids[i - 1]
                : Number.isFinite(m[i - 1][j - 1])
                  ? m[i - 1][j - 1]
                  : "∞";
        text(
          c,
          value,
          ox + (j + 0.5) * cell,
          oy + (i + 0.5) * cell,
          12,
          active ? P.onAccent : P.ink,
          "center",
          i === 0 || j === 0 ? 800 : 600,
        );
      }
    if (s.k != null)
      text(c, `当前中间顶点：${ids[s.k]}`, w / 2, 32, 12, P.blue);
  }
  return matrix;
});
