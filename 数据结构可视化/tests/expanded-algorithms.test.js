const test = require('node:test');
const assert = require('node:assert/strict');
const tree = require('../assets/js/algorithms/tree.js');
const graph = require('../assets/js/algorithms/graph.js');
const search = require('../assets/js/algorithms/search.js');
const sort = require('../assets/js/algorithms/sort.js');

test('level-order traversal uses queue order', () => {
  assert.deepEqual(tree.levelOrder(tree.sampleTree()).at(-1).state.output, ['A','B','C','D','E','F']);
});

test('Huffman construction combines to the total weight', () => {
  const final = tree.huffman([5,9,12,13,16,45]).at(-1).state;
  assert.equal(final.rootWeight, 100);
  assert.equal(final.leafCount, 6);
});

test('union-find joins connected items under one representative', () => {
  const final = tree.unionFindDemo(['A','B','C','D'], [['A','B'],['C','D'],['B','C']]).at(-1).state;
  assert.equal(new Set(Object.values(final.roots)).size, 1);
});

test('DFS visits every graph vertex once', () => {
  const output = graph.dfs(graph.sampleGraph(), 'A').at(-1).state.output;
  assert.equal(new Set(output).size, 6);
  assert.equal(output[0], 'A');
});

test('Prim and Kruskal produce the same minimum spanning tree weight', () => {
  const preset = graph.sampleGraph();
  assert.equal(graph.prim(preset, 'A').at(-1).state.totalWeight, 15);
  assert.equal(graph.kruskal(preset).at(-1).state.totalWeight, 15);
});

test('Floyd finds all-pairs shortest distances', () => {
  const final = graph.floyd(graph.sampleGraph()).at(-1).state;
  assert.equal(final.matrix[final.ids.indexOf('A')][final.ids.indexOf('D')], 9);
  assert.equal(final.matrix[final.ids.indexOf('A')][final.ids.indexOf('F')], 7);
});

test('topological sort and critical path finish on the DAG preset', () => {
  const dag = graph.sampleDag();
  const topo = graph.topological(dag).at(-1).state.output;
  assert.equal(topo.length, dag.nodes.length);
  const critical = graph.criticalPath(dag).at(-1).state;
  assert.ok(critical.criticalEdges.length >= 1);
  assert.equal(critical.duration, 9);
});

test('BST, AVL and hash presets preserve their invariants', () => {
  assert.deepEqual(search.bstInsert([45,24,53,12,37,93,30]).at(-1).state.inorder, [12,24,30,37,45,53,93]);
  const avl = search.avlTree([70,60,50,80,100,10,40,30,20,90], [], undefined).at(-1).state;
  assert.deepEqual(avl.cases, ['LL','RR','LR','RL']);
  assert.ok(Object.values(avl.tree.balanceFactors).every(bf => Math.abs(bf) <= 1));
  assert.equal(search.hashDemo([19,14,23,1,68,20], 7).at(-1).state.count, 6);
});

test('insertion and merge sort end in ascending order', () => {
  const input = [49,38,65,12,27,81,55];
  const expected = [12,27,38,49,55,65,81];
  assert.deepEqual(sort.insertionSort(input).at(-1).state.values, expected);
  assert.deepEqual(sort.mergeSort(input).at(-1).state.values, expected);
});
