// Public registry. Shared fonts: Microsoft YaHei and JetBrains Mono live in canvas-scene.js.
(function (root) {
  root.DS = root.DS || {};
  if (typeof module === "object" && module.exports) {
    module.exports = {
      array: require("./array-renderer.js"),
      linked: require("./linked-renderer.js"),
      stack: require("./stack-renderer.js"),
      queue: require("./queue-renderer.js"),
      tree: require("./tree-renderer.js"),
      graph: require("./graph-renderer.js"),
      matrix: require("./matrix-renderer.js"),
      hash: require("./hash-renderer.js"),
      string: require('./string-renderer.js'),
      adjacency: require('./adjacency-renderer.js'),
      'multi-tree': require('./multi-tree-renderer.js'),
    };
    root.DS.Renderers = module.exports;
  } else {
    const registry = root.DS.Renderers || {};
    for (const name of [
      "array",
      "linked",
      "stack",
      "queue",
      "tree",
      "graph",
      "matrix",
      "hash",
    ]) {
      if (typeof registry[name] !== "function")
        throw new Error("缺少渲染器：" + name);
    }
    root.DS.Renderers = registry;
  }
})(globalThis);
