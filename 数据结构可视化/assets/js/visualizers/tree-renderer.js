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

  function roundRect(c, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath();
    c.moveTo(x + radius, y);
    c.arcTo(x + w, y, x + w, y + h, radius);
    c.arcTo(x + w, y + h, x, y + h, radius);
    c.arcTo(x, y + h, x, y, radius);
    c.arcTo(x, y, x + w, y, radius);
    c.closePath();
  }

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
      order = [],
      unbalanced = new Set(s.unbalanced || []);
    let maxDepth = 0;
    (function walk(id, d) {
      if (!id || !nodes[id]) return;
      walk(nodes[id][0], d + 1);
      order.push([id, d]);
      maxDepth = Math.max(maxDepth, d);
      walk(nodes[id][1], d + 1);
    })(tree.root, 0);
    const gap = w / (order.length + 1);
    const radius = Math.max(12, Math.min(25, gap * 0.42));
    const labelSize = Math.max(9, Math.round(Math.min(14, radius * 0.6)));
    const badgeSize = Math.max(8.5, Math.round(Math.min(11, radius * 0.48)));
    order.forEach(([id, d], i) => {
      pos[id] = [
        (i + 1) / (order.length + 1),
        0.16 + d * (0.62 / Math.max(maxDepth, 1)),
      ];
    });
    // 需要旋转的子树用虚线框高亮（画在最底层）
    const subtree = (s.subtree || []).filter((id) => pos[id]);
    if (subtree.length > 1) {
      const xs = subtree.map((id) => pos[id][0] * w),
        ys = subtree.map((id) => pos[id][1] * h),
        pad = radius + 15;
      const x0 = Math.min(...xs) - pad,
        x1 = Math.max(...xs) + pad,
        y0 = Math.min(...ys) - pad,
        y1 = Math.max(...ys) + pad;
      c.save();
      c.globalAlpha = 0.1;
      c.fillStyle = P.blue;
      roundRect(c, x0, y0, x1 - x0, y1 - y0, 14);
      c.fill();
      c.globalAlpha = 0.5;
      c.setLineDash([7, 6]);
      c.strokeStyle = P.blue;
      c.lineWidth = 1.4;
      roundRect(c, x0, y0, x1 - x0, y1 - y0, 14);
      c.stroke();
      c.restore();
    }
    Object.entries(nodes).forEach(([id, kids]) =>
      kids.forEach((k) => {
        if (k && pos[id] && pos[k])
          arrow(
            c,
            pos[id][0] * w,
            pos[id][1] * h + radius,
            pos[k][0] * w,
            pos[k][1] * h - radius,
            P.line,
          );
      }),
    );
    Object.keys(pos).forEach((id) => {
      const [x, y] = pos[id];
      const isUnbalanced = unbalanced.has(id);
      const isCurrent = s.current === id;
      const isActive = active.has(id);
      c.beginPath();
      c.arc(x * w, y * h, radius, 0, Math.PI * 2);
      c.fillStyle = isUnbalanced
        ? P.red
        : isCurrent
          ? P.green
          : isActive
            ? P.blue
            : P.surface;
      c.fill();
      c.strokeStyle = isUnbalanced ? P.red : isActive ? P.blue : P.ink;
      c.lineWidth = isUnbalanced || isCurrent ? 2.6 : 2;
      c.stroke();
      text(
        c,
        tree.labels?.[id] ?? id,
        x * w,
        y * h,
        labelSize,
        isUnbalanced || isCurrent || isActive ? P.onAccent : P.ink,
        "center",
        800,
      );
      if (tree.heights && tree.heights[id] !== undefined)
        text(
          c,
          "h" + tree.heights[id],
          x * w,
          y * h - radius - badgeSize * 0.95,
          badgeSize,
          P.muted,
          "center",
          700,
        );
      if (tree.balanceFactors && tree.balanceFactors[id] !== undefined) {
        const bf = tree.balanceFactors[id];
        const color = Math.abs(bf) >= 2 ? P.red : bf === 0 ? P.green : P.muted;
        text(
          c,
          "bf" + (bf > 0 ? "+" : "") + bf,
          x * w,
          y * h + radius + badgeSize * 0.95,
          badgeSize,
          color,
          "center",
          800,
        );
      }
    });
    if (tree.heights)
      text(
        c,
        "h = 子树高度    bf = 平衡因子（左高为正，|bf| ≥ 2 失衡）",
        14,
        18,
        11.5,
        P.muted,
        "left",
        600,
      );
    const progress =
      s.cases && s.cases.length ? `　已完成：${s.cases.join(" · ")}` : "";
    const info = s.queue?.length
      ? "队列：" + s.queue.join("  →  ")
      : s.output?.length
        ? "输出：" + s.output.join("  ")
        : s.rotation
          ? `当前处理：${s.rotation} 型` + progress
          : s.weights?.length
            ? "权值：" + s.weights.join(" + ")
            : progress;
    text(c, info, w / 2, h - 27, 12.5, P.blue);
  }
  return tree;
});
