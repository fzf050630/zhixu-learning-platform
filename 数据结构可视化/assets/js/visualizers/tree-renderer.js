(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    node ? require("./canvas-scene.js") : root.DS.CanvasScene,
  );
  if (node) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Renderers = root.DS.Renderers || {};
  root.DS.Renderers.tree = api;
})(globalThis, function (scene) {
  "use strict";
  const { P, setup, text, arrow } = scene;
  function tree(canvas, s) {
    const { c, w, h } = setup(canvas),
      active = new Set(s.active || []);
    if (s.parents) {
      const items = s.items || Object.keys(s.parents),
        gap = Math.min(120, (w - 80) / items.length),
        start = (w - gap * (items.length - 1)) / 2;
      items.forEach((id, i) => {
        const x = start + i * gap,
          y = h * 0.36;
        c.beginPath();
        c.arc(x, y, 27, 0, Math.PI * 2);
        c.fillStyle = active.has(id) ? P.blue : P.surface;
        c.fill();
        c.strokeStyle = P.ink;
        c.stroke();
        text(
          c,
          id,
          x,
          y,
          14,
          active.has(id) ? P.onAccent : P.ink,
          "center",
          800,
        );
        const root = s.roots[id];
        text(
          c,
          `root=${root}`,
          x,
          h * 0.68,
          11,
          root === id ? P.green : P.muted,
        );
        if (s.parents[id] !== id)
          arrow(
            c,
            x,
            y + 29,
            start + items.indexOf(s.parents[id]) * gap,
            h * 0.36 + 29,
            P.blue,
          );
      });
      return;
    }
    const tree = s.tree || {},
      nodes = tree.nodes || {},
      pos = {},
      order = [];
    let maxDepth = 0;
    (function walk(id, d) {
      if (!id || !nodes[id]) return;
      walk(nodes[id][0], d + 1);
      order.push([id, d]);
      maxDepth = Math.max(maxDepth, d);
      walk(nodes[id][1], d + 1);
    })(tree.root, 0);
    order.forEach(([id, d], i) => {
      pos[id] = [
        (i + 1) / (order.length + 1),
        0.16 + d * (0.62 / Math.max(maxDepth, 1)),
      ];
    });
    Object.entries(nodes).forEach(([id, kids]) =>
      kids.forEach((k) => {
        if (k && pos[id] && pos[k])
          arrow(
            c,
            pos[id][0] * w,
            pos[id][1] * h + 25,
            pos[k][0] * w,
            pos[k][1] * h - 25,
            P.line,
          );
      }),
    );
    Object.keys(pos).forEach((id) => {
      const [x, y] = pos[id];
      c.beginPath();
      c.arc(x * w, y * h, 25, 0, Math.PI * 2);
      c.fillStyle =
        s.current === id ? P.green : active.has(id) ? P.blue : P.surface;
      c.fill();
      c.strokeStyle = active.has(id) ? P.blue : P.ink;
      c.lineWidth = 2;
      c.stroke();
      text(
        c,
        tree.labels?.[id] ?? id,
        x * w,
        y * h,
        14,
        active.has(id) || s.current === id ? P.onAccent : P.ink,
        "center",
        800,
      );
    });
    const info = s.queue?.length
      ? "队列：" + s.queue.join("  →  ")
      : s.output?.length
        ? "输出：" + s.output.join("  ")
        : s.rotation
          ? `当前旋转：${s.rotation}`
          : s.weights?.length
            ? "权值：" + s.weights.join(" + ")
            : "";
    text(c, info, w / 2, h - 27, 12, P.blue);
  }
  return tree;
});
