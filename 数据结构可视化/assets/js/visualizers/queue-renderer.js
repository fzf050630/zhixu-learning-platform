(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    node ? require("./canvas-scene.js") : root.DS.CanvasScene,
  );
  if (node) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Renderers = root.DS.Renderers || {};
  root.DS.Renderers.queue = api;
})(globalThis, function (scene) {
  "use strict";
  const { P, setup, text, arrow } = scene;
  function queue(canvas, s) {
    const { c, w, h } = setup(canvas),
      n = s.capacity || 5,
      cx = w / 2,
      cy = h / 2,
      r = Math.min(w, h) * 0.29;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / n,
        x = cx + Math.cos(a) * r,
        y = cy + Math.sin(a) * r;
      c.beginPath();
      c.arc(x, y, 28, 0, Math.PI * 2);
      c.fillStyle = s.values[i] == null ? P.surface : P.acid;
      c.fill();
      c.strokeStyle = P.ink;
      c.stroke();
      text(
        c,
        s.values[i] ?? "∅",
        x,
        y,
        14,
        s.values[i] == null ? P.ink : P.onAccent,
        "center",
        800,
      );
      text(c, i, x + Math.cos(a) * 43, y + Math.sin(a) * 43, 9, P.muted);
    }
    const point = (idx, label, color) => {
      const a = -Math.PI / 2 + (idx * Math.PI * 2) / n,
        x = cx + Math.cos(a) * (r - 55),
        y = cy + Math.sin(a) * (r - 55);
      arrow(c, x, y, cx + Math.cos(a)*(r-30), cy + Math.sin(a)*(r-30), color);
      text(c, label, x, y + (label === 'rear' ? 13 : -13), 10, color);
    };
    const tail = s.logical.length ? (s.rear - 1 + n) % n : null;
    point(s.front, tail === s.front ? 'front/tail' : 'front', P.blue);
    point(s.rear, "rear", P.red);
    if (tail !== null && tail !== s.front) point(tail, 'tail', P.green);
    text(c, 'front=' + s.front + '（队头）  rear=' + s.rear + '（下一写入）', cx, 25, 10, P.ink);
    text(c, s.logical.length ? '队尾元素下标=' + ((s.rear-1+n)%n) : '队空：front=rear；没有队头/队尾元素', cx, 49, 10, P.muted);
    text(
      c,
      "逻辑队列：" + (s.logical || []).join(" → "),
      cx,
      h - 35,
      11,
      P.muted,
    );
  }
  return queue;
});
