'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../assets/js/algorithms/advanced-trees.js');
const { CODE_LINES, inOrder, inspect, inspectSteps } = require('./tree-invariants.cjs');

const unique = values => [...new Set(values)].sort((a, b) => a - b);

function shuffle(seed, length, offset = 0) {
  const list = Array.from({ length }, (_, i) => i + 1 + offset);
  let state = seed >>> 0;
  for (let i = list.length - 1; i > 0; i--) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const k = state % (i + 1);
    [list[i], list[k]] = [list[k], list[i]];
  }
  return list;
}

function run(name, values, deletes, target) {
  const steps = A[name](values, deletes, target);
  inspectSteps(name, steps);
  const anchors = steps.filter(st => st.state.phase === 'deleted');
  assert.equal(anchors.length, deletes.length, `${name} 每个删除请求都应产生 deleted 锚点`);
  anchors.forEach((st, index) => {
    inspect(st.state, { balanced: true });
    const expected = unique(values).filter(v => !deletes.slice(0, index + 1).includes(v));
    assert.deepEqual(inOrder(st.state), expected, `${name} 第 ${index + 1} 次删除后的关键字集合不正确`);
  });
  const last = steps.at(-1).state;
  assert.deepEqual(inOrder(last), unique(values).filter(v => !deletes.includes(v)), `${name} 最终关键字集合不正确`);
  return steps;
}

const BASE = [10, 20, 30, 15, 25, 5, 1, 8, 12, 18, 22, 28];

for (const name of Object.keys(A)) {
  test(name + ' 删除后仍满足全部不变量，且关键字集合等于原集合减去删除集合', () => {
    const cases = [
      [BASE, [1]],
      [BASE, [28]],
      [BASE, [10]],
      [BASE, [5, 28, 10]],
      [BASE, [...BASE].reverse()],
      [BASE, BASE.slice(0, 6)],
      [[5, 3, 8], [3]],
      [[5, 3, 8], [5]],
      [[5, 3, 8], [8]],
      [[1, 2], [1, 2]],
      [[2, 1], [2, 1]],
      [[7], [7]],
      [[7], [999]],
      [BASE, [999, -999]],
      [BASE, [10, 10, 10]],
      [BASE, [10, 999, 10, 28]],
      [Array.from({ length: 12 }, (_, i) => i), Array.from({ length: 12 }, (_, i) => i)],
      [Array.from({ length: 12 }, (_, i) => 11 - i), [0, 11, 5, 6]],
    ];
    for (const [values, deletes] of cases) run(name, values, deletes, undefined);
  });

  test(name + ' 大量随机插入与删除序列始终维持不变量', () => {
    for (let seed = 1; seed <= 24; seed++) {
      const values = shuffle(seed, 12, -6);
      const deletes = shuffle(seed + 500, 12, -6);
      run(name, values, deletes, undefined);
      run(name, values, deletes.slice(0, 5), values[0]);
    }
  });

  test(name + ' 删除全部关键字后得到空树', () => {
    for (const values of [[7], [5, 3, 8], BASE, Array.from({ length: 12 }, (_, i) => i * 2 - 11)]) {
      const steps = run(name, values, values, undefined);
      const last = steps.at(-1).state;
      assert.equal(last.tree.root, null, '删除全部关键字后根应为空');
      assert.equal(Object.keys(last.tree.nodes).length, 0, '删除全部关键字后不应残留结点');
      inspect(last, { balanced: true });
    }
  });

  test(name + ' 不存在的关键字被跳过，不改变树结构', () => {
    const before = run(name, BASE, [], undefined).at(-1).state;
    const after = run(name, BASE, [999, -999], undefined).at(-1).state;
    assert.deepEqual(inOrder(before), inOrder(after));
    inspect(after, { balanced: true });
    const steps = A[name](BASE, [999], undefined);
    assert.ok(steps.some(st => st.state.phase === 'delete-find' && /不在树中|不在叶结点中/.test(st.message)), '应提示关键字不存在');
  });

  test(name + ' 快照相互独立且输入不被修改', () => {
    const values = BASE.slice(), deletes = [1, 28];
    const first = A[name](values, deletes, undefined);
    const frozen = JSON.stringify(first[0].state);
    assert.deepEqual(values, BASE, '插入序列不应被修改');
    assert.deepEqual(deletes, [1, 28], '删除序列不应被修改');
    assert.notEqual(first[0].state.tree, first[1].state.tree, '快照之间不能共享对象');
    A[name](values, deletes, undefined);
    assert.equal(JSON.stringify(first[0].state), frozen, '重复运行必须得到相同快照');
    assert.ok(CODE_LINES[name] >= 17, '伪代码应包含删除分支');
  });
}

test('红黑树删除覆盖双黑修复的四种情形', () => {
  const found = new Set();
  for (let seed = 1; seed <= 60 && found.size < 4; seed++) {
    const values = shuffle(seed, 10, -5);
    const deletes = shuffle(seed + 300, 8, -5);
    for (const st of A.redBlack(values, deletes, undefined)) {
      const hit = /情形([①②③④])/.exec(st.message);
      if (hit) found.add(hit[1]);
    }
  }
  assert.deepEqual([...found].sort(), ['①', '②', '③', '④'], '应能演示双黑修复的四种情形');
});

for (const name of ['bTree', 'bPlus']) {
  test(name + ' 删除既会向兄弟借位，也会与兄弟合并，并可能降低树高', () => {
    const seen = new Set();
    for (let seed = 1; seed <= 40; seed++) {
      const values = shuffle(seed, 10, -5);
      const deletes = shuffle(seed + 700, 10, -5);
      for (const st of A[name](values, deletes, undefined)) seen.add(st.state.phase);
    }
    assert.ok(seen.has('borrow'), '应演示借位');
    assert.ok(seen.has('merge'), '应演示合并');
  });
}

test('删除后仍可继续查找，未命中的查找返回 NOT_FOUND', () => {
  for (const name of Object.keys(A)) {
    const values = [10, 20, 30, 15, 25, 5, 1, 8, 12, 18, 22, 28];
    const deletes = [1, 28, 5, 22, 30];
    const remain = values.filter(v => !deletes.includes(v));
    const hit = A[name](values, deletes, remain[2]).at(-1).state;
    assert.ok(hit.found, name + ' 应找到仍然存在的关键字');
    const miss = A[name](values, deletes, 999).at(-1).state;
    assert.equal(miss.found, false, name + ' 应报告未找到');
    const gone = A[name](values, deletes, 1).at(-1).state;
    assert.equal(gone.found, false, name + ' 已删除的关键字不应再被找到');
  }
});

test('删除序列的校验：上限与类型', () => {
  for (const name of Object.keys(A)) {
    assert.throws(() => A[name]([1, 2], Array(13).fill(1)), /删除序列/);
    assert.throws(() => A[name]([1, 2], [1.5]), /删除序列/);
    assert.throws(() => A[name]([1, 2], [1000]), /删除序列/);
    assert.doesNotThrow(() => A[name]([1, 2], []));
    assert.doesNotThrow(() => A[name]([1, 2]));
  }
});
