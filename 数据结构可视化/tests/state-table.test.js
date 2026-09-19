const test = require('node:test');
const assert = require('node:assert/strict');
const { describeState, formatValue } = require('../assets/js/ui/state-table.js');
const graph = require('../assets/js/algorithms/graph.js');
const search = require('../assets/js/algorithms/search.js');
const queue = require('../assets/js/algorithms/stack-queue.js');

test('state values distinguish zero, missing, null and infinity', () => {
  assert.deepEqual([0, undefined, null, Infinity, -Infinity, false, []].map(formatValue), ['0', '—', '∅', '∞', '−∞', '否', '∅']);
  const state = search.binarySearch([0, 2], 0).at(-1).state;
  assert.match(describeState(state)[0].rows[0][2], /found/);
  assert.equal(describeState(state).at(-1).rows.find(([key]) => key.startsWith('找到'))[1], 0);
});

test('distance tables expose unreachable vertices without changing snapshots', () => {
  const state = graph.dijkstra({ nodes: [{id: 'A'}, {id: 'B'}], edges: [] }, 'A').at(-1).state;
  const before = structuredClone(state);
  const description = describeState(state)[0];
  assert.deepEqual(description.rows, [['A', 0, undefined, true], ['B', Infinity, undefined, false]]);
  assert.deepEqual(state, before);
});

test('queue table separates physical slots from logical order after wrapping', () => {
  const state = queue.circularQueueDemo(4, [1, 2], ['dequeue', 3, 4]).at(-1).state;
  const tables = describeState(state);
  assert.deepEqual(tables[0].rows.map(row => row[1]), [null, 2, 3, 4]);
  assert.deepEqual(tables[1].rows.find(([label]) => label.startsWith('逻辑'))[1], [2, 3, 4]);
  assert.equal(tables[1].rows.find(([label]) => label === 'rear')[1], 0);
});
