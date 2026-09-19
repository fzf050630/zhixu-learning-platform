const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../assets/js/algorithms/graph-safe.js');
const graph = (edges, directed = true) => ({directed, nodes: ['A','B','C'].map(id => ({id})), edges});
test('directed traversal and zero-weight shortest paths preserve unreachable nodes', () => {
  const g = graph([['A','B',0],['B','C',2]]);
  for (const name of ['bfs','dfs']) assert.deepEqual(G[name](g,'C').at(-1).state.output,['C']);
  assert.deepEqual(G.dijkstra(g,'A').at(-1).state.distances,{A:0,B:0,C:2});
  assert.equal(G.floyd(g).at(-1).state.matrix[2][0],Infinity);
});
test('graph algorithms reject missing and invalid start vertices', () => {
  for (const name of ['bfs','dfs','dijkstra','prim','bellmanFord']) {
    const g = graph([['A','B',1],['B','C',2]],name !== 'prim');
    for (const start of [undefined,'Z']) assert.throws(() => G[name](g,start), /起点/);
  }
});
test('MST, negative weights and cycles enforce algorithm constraints', () => {
  for (const name of ['prim','kruskal']) assert.throws(()=>G[name](graph([],false),'A'),/连通/);
  assert.throws(()=>G.dijkstra(graph([['A','B',-1]]),'A'),/负权/);
  const cycle=graph([['A','B',1],['B','A',1]]);
  assert.equal(G.topological(cycle).at(-1).state.hasCycle,true);
  assert.throws(()=>G.criticalPath(cycle),/无环/);
});
test('Bellman Ford distinguishes reachable negative cycles and AOE computes activity slack', () => {
  const cycle=graph([['B','C',-2],['C','B',1]]);
  assert.equal(G.bellmanFord(cycle,'A').at(-1).state.negativeCycle,false);
  assert.equal(G.bellmanFord(cycle,'B').at(-1).state.negativeCycle,true);
  const state=G.criticalPath(G.sampleDag()).at(-1).state;
  assert.equal(state.duration,9);
  assert.equal(state.criticalEdges.length,6);
  assert.ok(state.activities.find(a=>a.from==='C'&&a.to==='D').slack>0);
});
