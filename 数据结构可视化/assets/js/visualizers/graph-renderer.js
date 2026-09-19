(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    node ? require("./canvas-scene.js") : root.DS.CanvasScene,
  );
  if (node) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Renderers = root.DS.Renderers || {};
  root.DS.Renderers.graph = api;
})(globalThis, function (scene) {
  "use strict";
  const { P, setup, text, arrow } = scene;
  function graph(canvas, s, options = {}) {
    const { c, w, h } = setup(canvas),
      g = s.graph || { nodes: [], edges: [] },
      by = Object.fromEntries(g.nodes.map((n) => [n.id, { ...n, ...options.layout?.[n.id] }])),
      visited = new Set(s.visited || s.fixed || []),
      frontier = new Set(s.frontier || []),
      selected = s.selectedEdges || [],
      critical = s.criticalEdges || [];
    const includes = (list, a, b) =>
      list.some(
        (e) =>
          (e[0] === a && e[1] === b) ||
          (!g.directed && e[0] === b && e[1] === a),
      );
    g.edges.forEach(([a, b, wt]) => {
      const p = by[a],
        q = by[b],
        active =
          s.activeEdge &&
          ((s.activeEdge[0] === a && s.activeEdge[1] === b) ||
            (!g.directed && s.activeEdge[0] === b && s.activeEdge[1] === a)),
        chosen = includes(selected, a, b) || includes(critical, a, b),
        color = active ? P.blue : chosen ? P.green : P.line;
      c.strokeStyle = color;
      c.lineWidth = active || chosen ? 3 : 1.5;
      if (g.directed) {
        const dx = (q.x - p.x) * w,
          dy = (q.y - p.y) * h,
          length = Math.hypot(dx, dy) || 1;
        const reciprocal = g.edges.some(e => e[0] === b && e[1] === a);
        const ox = reciprocal ? -dy / length * 9 : 0;
        const oy = reciprocal ? dx / length * 9 : 0;
        arrow(
          c,
          p.x * w + (dx / length) * 25 + ox,
          p.y * h + (dy / length) * 25 + oy,
          q.x * w - (dx / length) * 26 + ox,
          q.y * h - (dy / length) * 26 + oy,
          color,
          active || chosen ? 3 : 1.5,
        );
      } else {
        c.beginPath();
        c.moveTo(p.x * w, p.y * h);
        c.lineTo(q.x * w, q.y * h);
        c.stroke();
      }
      const reciprocal = g.directed && g.edges.some(e => e[0] === b && e[1] === a);
      const dx = (q.x-p.x)*w, dy = (q.y-p.y)*h, len = Math.hypot(dx,dy)||1;
      text(
        c,
        wt,
        ((p.x + q.x) * w) / 2 + (reciprocal ? -dy/len*23 : 0),
        ((p.y + q.y) * h) / 2 + (reciprocal ? dx/len*23 : -10),
        10,
        active ? P.blue : chosen ? P.green : P.muted,
      );
    });
    g.nodes.forEach((original) => {
      const n = by[original.id];
      c.beginPath();
      c.arc(n.x * w, n.y * h, 23, 0, Math.PI * 2);
      c.fillStyle =
        s.current === n.id
          ? P.green
          : frontier.has(n.id)
            ? P.blue
            : visited.has(n.id)
              ? P.brandSoft || "#e8edff"
              : P.surface;
      c.fill();
      c.strokeStyle = P.ink;
      c.stroke();
      text(
        c,
        n.id,
        n.x * w,
        n.y * h,
        13,
        frontier.has(n.id) || s.current === n.id ? P.onAccent : P.ink,
        "center",
        800,
      );
      let metric = s.distances?.[n.id];
      if (metric == null && s.indegrees) metric = `in=${s.indegrees[n.id]}`;
      if (metric == null && s.earliest) metric = `ve=${s.earliest[n.id]}`;
      if (metric != null)
        text(
          c,
          typeof metric === "number" && !Number.isFinite(metric) ? "∞" : metric,
          n.x * w,
          n.y * h + 38,
          10,
          P.blue,
        );
    });
    const info =
      s.totalWeight != null
        ? `当前权值：${s.totalWeight}`
        : s.duration != null
          ? `工期：${s.duration}`
          : s.frontier?.length
            ? "队列：" + s.frontier.join("  →  ")
            : s.output?.length
              ? "序列：" + s.output.join("  →  ")
              : "";
    text(c, info, w / 2, h - 24, 11, P.muted);
  }
  return graph;
});
