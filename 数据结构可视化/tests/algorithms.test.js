const test = require('node:test');
const assert = require('node:assert/strict');

const linear = require('../assets/js/algorithms/linear.js');
const stackQueue = require('../assets/js/algorithms/stack-queue.js');
const tree = require('../assets/js/algorithms/tree.js');
const graph = require('../assets/js/algorithms/graph.js');
const search = require('../assets/js/algorithms/search.js');
const sort = require('../assets/js/algorithms/sort.js');

function validSteps(steps) {
  assert.ok(steps.length >= 2);
  for (const step of steps) {
    assert.equal(typeof step.id, 'string');
    assert.ok(step.id.length > 0);
    assert.ok(Number.isInteger(step.line) && step.line > 0);
    assert.equal(typeof step.message, 'string');
    assert.equal(typeof step.state, 'object');
  }
}

test('sequence insertion shifts suffix and inserts the value', () => {
  const steps = linear.sequenceInsert([12, 28, 41, 56, null], 2, 35);
  validSteps(steps);
  assert.deepEqual(steps.at(-1).state.values, [12, 28, 35, 41, 56]);
});

test('linked-list reversal flips every link', () => {
  const steps = linear.linkedReverse([8, 17, 26, 39]);
  validSteps(steps);
  assert.deepEqual(steps.at(-1).state.nodes.map(node => node.value), [39, 26, 17, 8]);
});

test('stack and circular queue presets finish at expected states', () => {
  const stackSteps = stackQueue.stackDemo([14, 27], [39, 'pop', 52]);
  const queueSteps = stackQueue.circularQueueDemo(5, [11, 22, 33], ['dequeue', 44, 55]);
  validSteps(stackSteps);
  validSteps(queueSteps);
  assert.deepEqual(stackSteps.at(-1).state.values, [14, 27, 52]);
  assert.deepEqual(queueSteps.at(-1).state.logical, [22, 33, 44, 55]);
});

test('tree traversal returns preorder, inorder and postorder sequences', () => {
  const preset = tree.sampleTree();
  assert.deepEqual(tree.traverse(preset, 'pre').at(-1).state.output, ['A', 'B', 'D', 'E', 'C', 'F']);
  assert.deepEqual(tree.traverse(preset, 'in').at(-1).state.output, ['D', 'B', 'E', 'A', 'C', 'F']);
  assert.deepEqual(tree.traverse(preset, 'post').at(-1).state.output, ['D', 'E', 'B', 'F', 'C', 'A']);
});

test('BFS and Dijkstra expose correct final results', () => {
  const preset = graph.sampleGraph();
  assert.deepEqual(graph.bfs(preset, 'A').at(-1).state.output, ['A', 'B', 'C', 'D', 'E', 'F']);
  assert.deepEqual(graph.dijkstra(preset, 'A').at(-1).state.distances, { A: 0, B: 4, C: 2, D: 9, E: 5, F: 7 });
});

test('binary search narrows to the target', () => {
  const steps = search.binarySearch([7, 13, 19, 28, 36, 45, 57, 68], 45);
  validSteps(steps);
  assert.equal(steps.at(-1).state.found, 5);
});

test('quick sort and heap sort produce ascending output', () => {
  const input = [49, 38, 65, 12, 27, 81, 55];
  const expected = [12, 27, 38, 49, 55, 65, 81];
  const quick = sort.quickSort(input);
  const heap = sort.heapSort(input);
  validSteps(quick);
  validSteps(heap);
  assert.deepEqual(quick.at(-1).state.values, expected);
  assert.deepEqual(heap.at(-1).state.values, expected);
});
