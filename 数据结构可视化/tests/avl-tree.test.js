'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const search = require('../assets/js/algorithms/search.js');
const experiments = require('../content/chapters/search.js').experiments;
const { inspectAvl, inspectAvlSteps } = require('./tree-invariants.cjs');

const avlExperiment = () => {
  const found = experiments.find(e => e.id === 'avl-rotations');
  assert.ok(found, '应存在 avl-rotations 实验');
  return found;
};
const keysOf = state => Object.keys(state.tree.nodes).map(Number).sort((a, b) => a - b);
const rotationsOf = steps => [...new Set(steps.map(s => s.state.rotation).filter(Boolean))];
function shuffle(seed, pool) {
  const list = pool.slice();
  let state = seed >>> 0;
  for (let i = list.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const k = state % (i + 1);
    [list[i], list[k]] = [list[k], list[i]];
  }
  return list;
}
function rnd(s) { s.v = (s.v * 1664525 + 1013904223) >>> 0; return s.v; }

test('AVL 通用插入维持 |bf| ≤ 1 与正确的高度标注', () => {
  let state = { v: 11 };
  for (let round = 0; round < 200; round++) {
    const size = 1 + rnd(state) % 12;
    const pool = [];
    while (pool.length < size) { const v = (rnd(state) % 201) - 100; if (!pool.includes(v)) pool.push(v); }
    const steps = search.avlTree(pool, [], undefined);
    inspectAvlSteps(steps);
    const last = steps.at(-1);
    inspectAvl(last.state, { balanced: true });
    assert.deepEqual(keysOf(last.state), [...pool].sort((a, b) => a - b), '插入后关键字集合应一致');
  }
});

test('AVL 删除后关键字集合正确，且每一次删除完成时重新满足 AVL 条件', () => {
  let state = { v: 29 };
  for (let round = 0; round < 400; round++) {
    const size = 1 + rnd(state) % 12;
    const pool = [];
    while (pool.length < size) { const v = (rnd(state) % 201) - 100; if (!pool.includes(v)) pool.push(v); }
    const dcount = rnd(state) % 13;
    const deletes = [];
    for (let i = 0; i < dcount; i++) {
      const v = rnd(state) % 3 === 0 ? (rnd(state) % 201) - 100 : pool[rnd(state) % pool.length];
      if (rnd(state) % 2 || !deletes.includes(v)) deletes.push(v);
    }
    const target = rnd(state) % 2 ? pool[rnd(state) % pool.length] : undefined;
    const steps = search.avlTree(pool, deletes, target);
    inspectAvlSteps(steps);
    const anchors = steps.filter(s => /^-?\d+ 删除(完成|操作结束)/.test(s.message));
    assert.equal(anchors.length, deletes.length, '每个删除请求都应有完成锚点');
    anchors.forEach((st, index) => {
      inspectAvl(st.state, { balanced: true });
      const expect = [...new Set(pool)].filter(v => !deletes.slice(0, index + 1).includes(v)).sort((a, b) => a - b);
      assert.deepEqual(keysOf(st.state), expect, `第 ${index + 1} 次删除后的关键字集合不正确`);
    });
    const expectFinal = [...new Set(pool)].filter(v => !deletes.includes(v)).sort((a, b) => a - b);
    assert.deepEqual(keysOf(steps.at(-1).state), expectFinal, '最终关键字集合不正确');
  }
});

test('AVL 删除全部关键字后得到空树', () => {
  for (const pool of [[7], [5, 3, 8], [70, 60, 50, 80, 100, 10, 40, 30, 20, 90]]) {
    const steps = search.avlTree(pool, pool, undefined);
    const last = steps.at(-1).state;
    assert.equal(last.tree.root, null, '删除全部关键字后根应为空');
    assert.equal(Object.keys(last.tree.nodes).length, 0, '不应残留结点');
    inspectAvl(last, { balanced: true });
  }
});

test('AVL 删除会覆盖叶子、单孩子、双孩子三种情形，并可能一次删除触发多次旋转', () => {
  const preset = avlExperiment().preset();
  const [values, deletes] = preset;
  const steps = search.avlTree(values, deletes, undefined);
  const messages = steps.map(s => s.message).join('\n');
  assert.match(messages, /直接用空指针接替它的位置/, '应演示删除叶子');
  assert.match(messages, /直接用孩子 -?\d+接替它的位置/, '应演示删除单孩子结点');
  assert.match(messages, /有两个孩子：在右子树中一路向左找到中序后继/, '应演示删除双孩子结点（中序后继替换）');
  assert.match(messages, /沿路径共旋转 2 次/, '应演示一次删除触发两次旋转');
  const rotations = steps.filter(s => /^(LL|RR|LR|RL)：/.test(s.message));
  assert.ok(rotations.length >= 6, '删除阶段应出现多次旋转');
});

test('默认预设的插入阶段仍依次演示 LL / RR / LR / RL 四类旋转', () => {
  const [values] = avlExperiment().preset();
  const steps = search.avlTree(values, [], undefined);
  assert.deepEqual(rotationsOf(steps), ['LL', 'RR', 'LR', 'RL'], '四类旋转都应出现且顺序稳定');
  const last = steps.at(-1);
  inspectAvl(last.state, { balanced: true });
  assert.deepEqual(rotationsOf(last.id ? steps : steps), ['LL', 'RR', 'LR', 'RL']);
});

test('AVL 输入校验与快照隔离', () => {
  assert.throws(() => search.avlTree([]), /1–12/);
  assert.throws(() => search.avlTree([1, 1]), /互不相同/);
  assert.throws(() => search.avlTree([1.5]), /1–12/);
  assert.throws(() => search.avlTree([1], Array(13).fill(1)), /删除序列/);
  assert.throws(() => search.avlTree([1], [], 1000), /查找值/);
  const values = [70, 60, 50, 80, 100, 10, 40, 30, 20, 90];
  const deletes = [60, 100, 50];
  const first = search.avlTree(values, deletes, 30);
  const frozen = JSON.stringify(first[0].state);
  assert.deepEqual(values, [70, 60, 50, 80, 100, 10, 40, 30, 20, 90], '插入序列不应被修改');
  assert.deepEqual(deletes, [60, 100, 50], '删除序列不应被修改');
  assert.notEqual(first[0].state.tree, first[1].state.tree, '快照之间不能共享对象');
  search.avlTree(values, deletes, 30);
  assert.equal(JSON.stringify(first[0].state), frozen, '重复运行必须得到相同快照');
  assert.equal(search.avlTree(values, deletes, 30).at(-1).state.found, true, '应能查到仍然存在的关键字');
  assert.equal(search.avlTree(values, deletes, 60).at(-1).state.found, false, '已删除的关键字不应被找到');
  assert.equal(search.avlTree(values, deletes, undefined).at(-1).state.found, null, '未设置查找值时 found 为 null');
});

test('AVL 实验配置：三字段输入、伪代码行号与生成器一致', () => {
  const experiment = avlExperiment();
  assert.equal(experiment.visualizer, 'tree');
  assert.equal(experiment.input.type, 'multi');
  assert.deepEqual(experiment.input.fields.map(f => f.name), ['values', 'deletes', 'target']);
  assert.equal(experiment.input.parse({ values: '70, 60, 50', deletes: '60', target: '50' }).ok, true);
  assert.equal(experiment.input.parse({ values: '70, 70', deletes: '', target: '' }).ok, false, '重复关键字应被拒绝');
  assert.equal(experiment.input.parse({ values: '70, 60', deletes: 'x', target: '' }).ok, false);
  assert.equal(experiment.input.parse({ values: '70, 60', deletes: '', target: 'x' }).ok, false);
  const steps = experiment.createSteps();
  inspectAvlSteps(steps);
  for (const st of steps) assert.ok(st.line <= experiment.code.length, '行号必须落在伪代码范围内');
  const last = steps.at(-1);
  assert.ok(last.state.cases.length === 4, '预设应演示四类旋转');
});
