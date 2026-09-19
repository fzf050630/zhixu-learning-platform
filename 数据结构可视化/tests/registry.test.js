const test = require('node:test');
const assert = require('node:assert/strict');

global.DS = { Algorithms: {
  linear: require('../assets/js/algorithms/linear.js'),
  stackQueue: require('../assets/js/algorithms/stack-queue.js'),
  tree: require('../assets/js/algorithms/tree.js'),
  graph: require('../assets/js/algorithms/graph.js'),
  search: require('../assets/js/algorithms/search.js'),
  sort: require('../assets/js/algorithms/sort.js')
} };

const { chapters, experiments } = require('../content/chapters.js');

test('registry exposes six focused chapters and unique experiments', () => {
  assert.equal(chapters.length, 6);
  assert.equal(experiments.length, 54);
  const originalIds = 'sequence-insert linked-reverse stack-demo circular-queue preorder inorder postorder level-order huffman union-find bfs dfs prim kruskal dijkstra floyd topological critical-path binary-search bst-insert avl-rotations hash-chaining quick-sort heap-sort insertion-sort merge-sort'.split(' ');
  const addedIds = 'bubble-sort selection-sort shell-sort bellman-ford graph-representations kmp red-black-tree b-tree b-plus-tree'.split(' ');
  const extraIds = 'sequence-reverse sequence-delete-min linked-head-insert linked-merge josephus shared-stack deque threaded-tree bst-search bst-delete heap-insert radix-sort counting-sort binary-insert-sort hash-linear hash-double kmp-nextval bf-match graph-cross'.split(' ');
  assert.deepEqual(experiments.map(e => e.id).sort(), [...originalIds, ...addedIds, ...extraIds].sort());
  assert.equal(new Set(experiments.map(item => item.id)).size, experiments.length);
  for (const chapter of chapters) {
    assert.ok(chapter.experiments.length >= 1);
    chapter.experiments.forEach(id => assert.ok(experiments.some(item => item.id === id)));
  }
});

test('every experiment produces snapshots aligned with pseudocode', () => {
  for (const experiment of experiments) {
    const steps = experiment.createSteps();
    assert.ok(steps.length >= 2, experiment.id);
    assert.ok(['array', 'linked', 'tree', 'graph', 'stack', 'queue', 'matrix', 'hash', 'string', 'adjacency', 'multi-tree'].includes(experiment.visualizer));
    for (const step of steps) {
      assert.ok(step.line >= 1 && step.line <= experiment.code.length, `${experiment.id}: line ${step.line}`);
      assert.ok(step.message.length > 0);
    }
  }
});

test("four sorting experiments expose the shared integer-array input", () => {
  const ids = ["quick-sort", "heap-sort", "insertion-sort", "merge-sort"];
  for (const id of ids) {
    const experiment = experiments.find((item) => item.id === id);
    assert.equal(experiment.input.type, "integer-array", id);
    assert.equal(typeof experiment.input.parse, "function", id);
    assert.equal(typeof experiment.inputAdapter, "function", id);
    const result = experiment.input.parse("3, -1, 3, 0");
    assert.deepEqual(result.value, [3, -1, 3, 0], id);
    const steps = experiment.createSteps(result.value);
    assert.deepEqual(steps.at(-1).state.values, [-1, 0, 3, 3], id);
  }
});
