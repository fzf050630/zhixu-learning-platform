'use strict';
/* 高级树共用的结构校验工具：红黑树 / B 树 / B+ 树。
   删除修复过程中的瞬时状态会合法地出现「下溢」或「未定义分隔键」，
   此时只放宽这两类断言；父子指针、孩子计数、叶等深、结点内有序、
   红黑性质与黑高等仍然强制成立。终态（deleted / balanced / done / search / found / missing）
   一律用 balanced=true 做全量校验。 */
const assert = require('node:assert/strict');

const CODE_LINES = { redBlack: 21, bTree: 18, bPlus: 18 };
const AVL_CODE_LINES = 20;
const TERMINAL_PHASES = new Set(['balanced', 'done', 'search', 'found', 'missing', 'deleted']);
const PHASES = new Set([
  'start', 'duplicate', 'compare', 'insert', 'recolor', 'rotate', 'balanced', 'split',
  'delete-find', 'delete-swap', 'delete-remove', 'fixup', 'borrow', 'merge', 'shrink', 'deleted',
  'search', 'found', 'missing', 'done',
]);

/* 中序遍历：红黑树与 B 树包含内部关键字；B+ 树只收集叶结点中的记录。 */
function inOrder(s) {
  const { root, nodes } = s.tree;
  const out = [];
  if (!root) return out;
  (function walk(id) {
    const n = nodes[id];
    if (s.type === 'b-plus') {
      if (n.leaf) { out.push(...n.keys); return; }
      n.children.forEach(walk);
      return;
    }
    if (n.leaf) { out.push(...n.keys); return; }
    n.children.forEach((kid, i) => { if (kid) walk(kid); if (i < n.keys.length) out.push(n.keys[i]); });
  })(root);
  return out;
}

function inspect(s, { balanced = false } = {}) {
  const { root, nodes } = s.tree;
  const all = Object.values(nodes);
  /* 删除修复途中会合法地出现下溢：非根结点关键字数低于下界，
     B+ 树的空子树还会让父索引暂时缺失。此时只放宽「下溢相关」的断言；
     终态（balanced=true）一律全量校验。 */
  const underflow = all.some(n =>
    (n.parent && n.keys.length < 1) ||
    n.keys.some(k => k === undefined || k === null) ||
    (s.type !== 'red-black' && !n.leaf && n.children.filter(Boolean).length !== n.keys.length + 1));
  const strict = balanced || !underflow;
  const seen = new Set(), depths = [];
  if (!root) { assert.equal(Object.keys(nodes).length, 0, '空树不应残留结点'); return; }
  (function walk(id, parent, lo, hi, depth) {
    assert.ok(nodes[id], '结点必须存在');
    assert.ok(!seen.has(id), '结点不能被重复引用');
    seen.add(id);
    const n = nodes[id];
    assert.equal(n.parent, parent, '父指针必须正确');
    const keys = underflow ? n.keys.filter(k => k !== undefined && k !== null) : n.keys;
    assert.deepEqual(keys, [...keys].sort((a, b) => a - b), '结点内关键字必须有序');
    assert.equal(new Set(keys).size, keys.length, '结点内关键字不能重复');
    if (strict) keys.forEach(x => assert.ok(x >= lo && x < hi, '关键字必须落在所属区间内'));
    const kids = n.children.filter(Boolean);
    if (s.type === 'red-black') {
      assert.equal(n.children.length, 2, '红黑树结点必须有两个孩子槽');
      const left = n.children[0] ? walk(n.children[0], id, lo, n.keys[0], depth + 1) : 1;
      const right = n.children[1] ? walk(n.children[1], id, n.keys[0] + 1, hi, depth + 1) : 1;
      if (balanced) {
        assert.equal(left, right, '黑高必须相等');
        if (n.color === 'red') kids.forEach(k => assert.equal(nodes[k].color, 'black', '红结点的孩子必须为黑'));
      }
      return left + (n.color === 'black' ? 1 : 0);
    }
    if (balanced) {
      assert.ok(n.keys.length <= 3, '每个结点最多 3 个关键字');
      if (parent) assert.ok(n.keys.length >= 1, '非根结点至少要有 1 个关键字');
    }
    if (n.leaf) { assert.equal(kids.length, 0, '叶结点不能有孩子'); depths.push(depth); return keys[0]; }
    if (strict) assert.equal(kids.length, n.keys.length + 1, '孩子数必须等于关键字数加一');
    let minimum;
    kids.forEach((kid, i) => {
      const min = walk(kid, id, i ? n.keys[i - 1] + (s.type === 'b-tree' ? 1 : 0) : lo, i < n.keys.length ? n.keys[i] : hi, depth + 1);
      if (i === 0) minimum = min;
      else if (s.type === 'b-plus' && strict) assert.equal(min, n.keys[i - 1], '父索引必须等于右子树最小值');
    });
    return minimum;
  })(root, null, -Infinity, Infinity, 0);
  assert.equal(seen.size, Object.keys(nodes).length, '不能有孤立结点');
  if (balanced && s.type === 'red-black') assert.equal(nodes[root].color, 'black', '根结点必须为黑');
  if (s.type !== 'red-black') assert.equal(new Set(depths).size, 1, '所有叶结点必须同深度');
}

/* 校验一组步骤：冻结、行号、阶段白名单，并在每个终态校验不变量。 */
function inspectSteps(name, steps) {
  for (const st of steps) {
    assert.ok(Object.isFrozen(st.state), '快照必须冻结');
    assert.ok(Number.isInteger(st.line) && st.line >= 1 && st.line <= CODE_LINES[name], `${name} 行号越界：${st.line}`);
    assert.ok(typeof st.message === 'string' && st.message.length > 0, '每步都需要说明');
    assert.ok(PHASES.has(st.state.phase), '未知阶段：' + st.state.phase);
    if (TERMINAL_PHASES.has(st.state.phase)) inspect(st.state, { balanced: true });
    else inspect(st.state);
  }
}

module.exports = { CODE_LINES, TERMINAL_PHASES, PHASES, inOrder, inspect, inspectSteps, inspectAvl, inspectAvlSteps };

/* ---------------- AVL 树（tree 渲染器：结点用 [左, 右]，id 即关键字） ---------------- */
const AVL_TERMINAL = /^-?\d+ 删除(完成|操作结束)|全部删除完成|构造完成/;

function inspectAvl(state, { balanced = false } = {}) {
  const t = state.tree;
  const nodes = t.nodes;
  const seen = new Set(), order = [];
  (function walk(id, lo, hi) {
    if (!id) return;
    assert.ok(nodes[id], '结点必须存在：' + id);
    assert.ok(!seen.has(id), '结点不能被重复引用：' + id);
    seen.add(id);
    const [l, r] = nodes[id];
    walk(l, lo, Number(id));
    order.push(Number(id));
    walk(r, Number(id) + 1, hi);
  })(t.root, -Infinity, Infinity);
  assert.equal(seen.size, Object.keys(nodes).length, '不能有孤立结点');
  assert.deepEqual(order, [...order].sort((a, b) => a - b), '中序序列必须递增且无重复');
  const height = id => (id && nodes[id] ? 1 + Math.max(height(nodes[id][0]), height(nodes[id][1])) : 0);
  const balance = id => (id && nodes[id] ? height(nodes[id][0]) - height(nodes[id][1]) : 0);
  for (const id of Object.keys(nodes)) {
    assert.equal(t.heights[id], height(id), `${id} 的高度标注必须等于实际高度`);
    assert.equal(t.balanceFactors[id], balance(id), `${id} 的平衡因子标注必须等于实际值`);
    if (balanced) assert.ok(Math.abs(balance(id)) <= 1, `${id} 的 |bf| 必须 ≤ 1`);
  }
}

function inspectAvlSteps(steps) {
  steps.forEach((st, i) => {
    assert.ok(Number.isInteger(st.line) && st.line >= 1 && st.line <= AVL_CODE_LINES, 'AVL 行号越界：' + st.line);
    assert.ok(typeof st.message === 'string' && st.message.length > 0, '每步都需要说明');
    const last = i === steps.length - 1;
    inspectAvl(st.state, { balanced: AVL_TERMINAL.test(st.message) || last });
  });
}

