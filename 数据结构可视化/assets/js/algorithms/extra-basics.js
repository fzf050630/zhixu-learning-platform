(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Algorithms = root.DS.Algorithms || {};
  root.DS.Algorithms.extraBasics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const snap = (id, line, message, state) => ({ id, line, message, state: structuredClone(state) });
  const chain = entries => entries.length ? entries.map(([to, weight]) => `${to}(${weight})`).join(' → ') : '∅';
  const inorderOf = tree => {
    const seq = [];
    (function walk(id) { if (!id) return; walk(tree.nodes[id][0]); seq.push(id); walk(tree.nodes[id][1]); })(tree.root);
    return seq;
  };
  const buildBst = values => {
    const nodes = {};
    let root = null;
    values.forEach((value, i) => {
      const id = 'n' + i;
      nodes[id] = { value, left: null, right: null };
      if (!root) { root = id; return; }
      let p = root;
      while (true) {
        const side = value < nodes[p].value ? 'left' : 'right';
        if (!nodes[p][side]) { nodes[p][side] = id; break; }
        p = nodes[p][side];
      }
    });
    return { root, nodes };
  };
  const shapeOf = bst => ({
    root: bst.root,
    nodes: Object.fromEntries(Object.entries(bst.nodes).map(([id, n]) => [id, [n.left, n.right]])),
    labels: Object.fromEntries(Object.entries(bst.nodes).map(([id, n]) => [id, String(n.value)])),
  });

  function sequenceReverse(values) {
    const a = values.slice(), n = a.length, out = [], fixed = [];
    let i = 0, j = n - 1;
    const push = (line, message, extra = {}) => out.push(snap('seqrev-' + out.length, line, message, { kind: 'array', values: a.slice(), low: i, high: j, fixed: fixed.slice(), ...extra }));
    push(1, `顺序表 n=${n}：i=0，j=${n - 1}，首尾交换后向中间推进`);
    while (i < j) {
      push(3, `a[${i}]=${a[i]} 与 a[${j}]=${a[j]} 交换`, { active: [i, j] });
      [a[i], a[j]] = [a[j], a[i]];
      fixed.push(i, j);
      i += 1; j -= 1;
      push(5, `交换后两端就位，i=${i}，j=${j}`, { active: [i - 1, j + 1] });
    }
    if (i === j) {
      fixed.push(i);
      push(6, `i=j=${i}，中间元素无需交换`, { active: [i] });
    }
    push(7, '就地逆置完成：不额外申请数组空间', { active: [], fixed: Array.from({ length: n }, (_, k) => k), done: true });
    return out;
  }

  function sequenceDeleteMin(values) {
    const a = values.slice(), n = a.length, out = [];
    let min = 0;
    const push = (line, message, extra = {}) => out.push(snap('seqmin-' + out.length, line, message, { kind: 'array', values: a.slice(), minIndex: min, ...extra }));
    push(1, `顺序表 n=${n}，先扫描全部元素找最小值`);
    for (let i = 1; i < n; i++) {
      push(4, `比较 a[${i}]=${a[i]} 与当前最小 a[${min}]=${a[min]}`, { active: [min, i] });
      if (a[i] < a[min]) {
        min = i;
        push(5, `${a[i]} 更小，最小值下标更新为 ${min}`, { active: [min], minIndex: min });
      }
    }
    const removed = a[min], last = a[n - 1];
    push(6, `最小值 e=${removed}，位于下标 ${min}`, { active: [min] });
    if (min === n - 1) {
      a[n - 1] = null;
      push(7, `最小值恰在表尾，直接删除 ${removed}`, { active: [min] });
    } else {
      a[min] = last;
      a[n - 1] = null;
      push(7, `用表尾元素 ${last} 填补下标 ${min}，避免整体前移`, { active: [min] });
    }
    push(8, `逻辑长度从 ${n} 减为 ${n - 1}（末位不再属于表）`, { active: [] });
    push(10, `删除最小元素完成：e=${removed}`, { active: [], done: true });
    return out;
  }

  function linkedHeadInsert(values) {
    const nodes = values.map((value, i) => ({ id: 'n' + i, value }));
    let remain = nodes.slice(), built = [], head = null;
    const out = [];
    const push = (line, message, extra = {}) => out.push(snap('headins-' + out.length, line, message, { kind: 'linked', nodes: remain, reversed: built, pointers: { head, p: null, next: head }, ...extra }));
    push(1, `共 ${nodes.length} 个元素，空表 head=NULL，逐个头插`);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      remain = nodes.slice(i + 1);
      push(4, `申请新结点 ${node.id}（值 ${node.value}）`, { floating: node, active: node.id, pointers: { head, p: node.id, next: head } });
      const oldHead = head;
      built = [node, ...built];
      push(5, `p->next=head：${node.id} 指向原表首 ${oldHead === null ? 'NULL' : oldHead}`, { active: node.id, pointers: { head: node.id, p: node.id, next: oldHead } });
      head = node.id;
    }
    push(8, `头插完成，head=${head}；最终序列与输入顺序相反`, { done: true, nodes: built, reversed: [], pointers: { head, tail: nodes.length ? nodes[0].id : null, p: null, next: null } });
    return out;
  }

  function linkedMerge(left, right) {
    const make = (list, prefix) => list.map((value, i) => ({ id: prefix + i, value }));
    const a = make(left, 'a'), b = make(right, 'b');
    let ia = 0, ib = 0;
    let merged = [];
    const out = [];
    const state = extra => {
      const aRem = a.slice(ia), bRem = b.slice(ib);
      return {
        kind: 'linked',
        nodes: [...aRem, ...bRem],
        reversed: merged.slice(),
        pointers: {
          head: merged.length ? merged[0].id : null,
          tail: merged.length ? merged[merged.length - 1].id : null,
          pa: aRem.length ? aRem[0].id : null,
          pb: bRem.length ? bRem[0].id : null
        },
        ...extra
      };
    };
    out.push(snap('merge-start', 2, `pa 指向 A 首 ${a.length ? a[0].value : '∅'}，pb 指向 B 首 ${b.length ? b[0].value : '∅'}；合并结果 C 为空表`, state()));
    while (ia < a.length && ib < b.length) {
      out.push(snap('merge-cmp-' + out.length, 5, `比较 ${a[ia].value} 与 ${b[ib].value}`, state()));
      if (a[ia].value <= b[ib].value) {
        const node = a[ia];
        ia += 1;
        merged.push(node);
        out.push(snap('merge-take-' + out.length, 6, `${node.value} ≤ ${b[ib].value}，摘 A 结点 ${node.id} 尾插入 C（保持稳定）`, state({ active: node.id })));
      } else {
        const node = b[ib];
        ib += 1;
        merged.push(node);
        out.push(snap('merge-take-' + out.length, 8, `${node.value} < ${a[ia].value}，摘 B 结点 ${node.id} 尾插入 C`, state({ active: node.id })));
      }
    }
    const rest = ia < a.length ? a.slice(ia) : b.slice(ib);
    const restName = ia < a.length ? 'A' : 'B';
    merged.push(...rest);
    out.push(snap('merge-rest', 12, rest.length ? `${restName} 表剩余 ${rest.map(node => node.value).join(', ')}，整段接到 C 尾部` : '其中一表已空，无需再接', state()));
    out.push(snap('merge-done', 13, `合并完成，C 仍非递减且有 ${merged.length} 个结点`, { kind: 'linked', nodes: merged.slice(), reversed: [], done: true, pointers: { head: merged.length ? merged[0].id : null, tail: merged.length ? merged[merged.length - 1].id : null, pa: null, pb: null } }));
    return out;
  }

  function josephus(values, m) {
    if (!Number.isInteger(m) || m < 1) throw new Error('报数 m 必须是正整数');
    const source = values.map((value, i) => ({ id: 'p' + i, value }));
    let ring = source.slice(), idx = 0, count = 0;
    const out = [], leaving = [];
    const state = extra => ({
      kind: 'linked',
      nodes: ring.length ? ring.slice(idx).concat(ring.slice(0, idx)) : [],
      reversed: leaving.slice(),
      pointers: { p: ring.length ? ring[idx].id : null, pre: ring.length ? ring[(idx - 1 + ring.length) % ring.length].id : null },
      ...extra
    });
    out.push(snap('jos-start', 2, `n=${ring.length} 个结点构成循环链表，从 ${ring[0].value} 开始报数，m=${m}`, state()));
    while (ring.length) {
      count += 1;
      if (count < m) {
        out.push(snap('jos-count-' + out.length, 5, `${ring[idx].value} 报 ${count}，指针后移`, state({ active: ring[idx].id })));
        idx = (idx + 1) % ring.length;
      } else {
        const node = ring[idx];
        out.push(snap('jos-out-' + out.length, 7, `${node.value} 报 ${count}，出列`, state({ floating: node, active: node.id })));
        ring.splice(idx, 1);
        if (idx >= ring.length) idx = 0;
        leaving.push(node);
        count = 0;
        out.push(snap('jos-next-' + out.length, 9, ring.length ? `pre->next 接上后继，从 ${ring[idx].value} 重新报数` : '环中已无人，报数结束', state({ active: ring.length ? ring[idx].id : null })));
      }
    }
    out.push(snap('jos-done', 10, `出列序列：${leaving.map(node => node.value).join(' → ')}`, { kind: 'linked', nodes: leaving.slice(), reversed: [], done: true, pointers: { head: leaving[0].id, tail: leaving[leaving.length - 1].id, p: null, pre: null } }));
    return out;
  }

  function sharedStack(capacity, operations) {
    if (!Number.isInteger(capacity) || capacity < 2) throw new Error('共享栈容量至少为 2');
    const a = Array(capacity).fill(null);
    let top0 = 0, top1 = capacity - 1;
    const out = [];
    const push = (line, message, extra = {}) => out.push(snap('shared-' + out.length, line, message, { kind: 'stack', values: a.slice(), capacity, top0, top1, ...extra }));
    push(1, `容量 ${capacity}：栈 0 栈底在下标 0（top0 为下一个写入位置），栈 1 栈底在下标 ${capacity - 1}（top1 为下一个写入位置）`);
    for (const raw of operations) {
      const parts = String(raw).trim().split(/\s+/), op = parts[0];
      const value = parts.length > 1 ? Number(parts[1]) : null;
      if (parts.length > 2 || (op.startsWith('push') && !Number.isFinite(value)) || (!op.startsWith('push') && !op.startsWith('pop'))) throw new Error('无法识别的操作：' + raw);
      if (op === 'push0' || op === 'push1') {
        if (top0 === top1 + 1) push(2, `栈满（top1+1==top0：${top1}+1==${top0}），${op} ${value} 被拒绝`);
        else if (op === 'push0') { a[top0] = value; top0 += 1; push(3, `${value} 压入栈 0：top0=${top0}，栈 1 的 top1=${top1}`, { active: top0 - 1 }); }
        else { a[top1] = value; top1 -= 1; push(4, `${value} 压入栈 1：top1=${top1}，栈 0 的 top0=${top0}`, { active: top1 + 1 }); }
      } else if (op === 'pop0') {
        if (top0 === 0) push(7, '栈 0 空（top0==0），拒绝出栈');
        else { top0 -= 1; const removed = a[top0]; a[top0] = null; push(7, `${removed} 出栈 0：top0=${top0}`, { active: top0 }); }
      } else if (op === 'pop1') {
        if (top1 === capacity - 1) push(8, '栈 1 空（top1==容量−1），拒绝出栈');
        else { top1 += 1; const removed = a[top1]; a[top1] = null; push(8, `${removed} 出栈 1：top1=${top1}`, { active: top1 }); }
      } else throw new Error('无法识别的操作：' + raw);
    }
    push(10, '演示结束：两栈共用一段数组，判满条件是 top1+1==top0', { active: undefined, done: true });
    return out;
  }

  function dequeDemo(capacity, initial, operations) {
    if (!Number.isInteger(capacity) || capacity < 2) throw new Error('双端队列容量至少为 2');
    if (initial.length > capacity) throw new Error('初始元素超过容量');
    const a = Array(capacity).fill(null);
    initial.forEach((value, i) => { a[i] = value; });
    let front = 0, rear = initial.length % capacity, size = initial.length;
    const out = [];
    const logical = () => { const list = []; for (let i = 0; i < size; i++) list.push(a[(front + i) % capacity]); return list; };
    const push = (line, message, extra = {}) => out.push(snap('deque-' + out.length, line, message, { kind: 'queue', values: a.slice(), capacity, front, rear, size, logical: logical(), ...extra }));
    push(1, `容量 ${capacity}（用 size 计数，可装满）：front=${front}，rear=${rear}，size=${size}`);
    for (const raw of operations) {
      const parts = String(raw).trim().split(/\s+/), op = parts[0];
      const value = parts.length > 1 ? Number(parts[1]) : null;
      if (op === 'pushFront' || op === 'pushBack') {
        if (!Number.isFinite(value)) throw new Error('入队操作需要数值：' + raw);
        if (size === capacity) push(op === 'pushFront' ? 2 : 4, `队满（size==capacity==${capacity}），${op} ${value} 被拒绝`);
        else if (op === 'pushFront') { front = (front - 1 + capacity) % capacity; a[front] = value; size += 1; push(3, `${value} 从队头入队：front=${front}，size=${size}`, { active: front }); }
        else { a[rear] = value; rear = (rear + 1) % capacity; size += 1; push(5, `${value} 从队尾入队：rear=${rear}，size=${size}`, { active: (rear - 1 + capacity) % capacity }); }
      } else if (op === 'popFront') {
        if (size === 0) push(6, '队空（size==0），拒绝队头出队');
        else { const removed = a[front]; a[front] = null; front = (front + 1) % capacity; size -= 1; if (!size) { front = 0; rear = 0; } push(7, `${removed} 从队头出队：front=${front}，size=${size}`, { active: front }); }
      } else if (op === 'popBack') {
        if (size === 0) push(8, '队空（size==0），拒绝队尾出队');
        else { rear = (rear - 1 + capacity) % capacity; const removed = a[rear]; a[rear] = null; size -= 1; if (!size) { front = 0; rear = 0; } push(9, `${removed} 从队尾出队：rear=${rear}，size=${size}`, { active: rear }); }
      } else throw new Error('无法识别的操作：' + raw);
    }
    push(10, '演示结束：两端都可入队出队，判空 size==0，判满 size==capacity', { active: undefined, done: true });
    return out;
  }

  function threadedTree(tree) {
    const nodes = {};
    Object.entries(tree.nodes).forEach(([id, kids]) => { nodes[id] = [kids[0] ?? null, kids[1] ?? null]; });
    const order = inorderOf({ root: tree.root, nodes });
    const labels = Object.fromEntries(order.map(id => [id, id]));
    const out = [];
    const state = extra => ({ kind: 'tree', tree: { root: tree.root, nodes: structuredClone(nodes), labels: { ...labels } }, ...extra });
    out.push(snap('thread-start', 1, `中序序列：${order.join(' ')}；线索化后空指针将指向前驱或后继`, state()));
    order.forEach((id, k) => {
      const pred = k > 0 ? order[k - 1] : null, succ = k < order.length - 1 ? order[k + 1] : null;
      const [left, right] = nodes[id];
      let marked = false;
      if (!left) {
        if (pred) { labels[id] = id + '*'; marked = true; }
        out.push(snap('thread-left-' + out.length, 5, pred ? `${id} 的左指针为空，改造成指向前驱 ${pred} 的左线索` : `${id} 没有前驱，左线索保持 NULL`, state({ active: pred ? [id, pred] : [id], current: id, pred, succ })));
      }
      if (!right) {
        if (succ) { labels[id] = id + '*'; marked = true; }
        out.push(snap('thread-right-' + out.length, 8, succ ? `${id} 的右指针为空，改造成指向后继 ${succ} 的右线索` : `${id} 没有后继，右线索保持 NULL`, state({ active: succ ? [id, succ] : [id], current: id, pred, succ })));
      }
      if (left && right && !marked) out.push(snap('thread-keep-' + out.length, 10, `${id} 左右孩子均非空，指针保持为真实孩子`, state({ current: id, pred, succ })));
    });
    out.push(snap('thread-done', 12, `中序线索化完成：带 * 的结点至少有一条线索；中序序列 ${order.join(' ')}`, state({ current: order.at(-1) ?? null, output: order, done: true })));
    return out;
  }

  function bstSearch(values, target) {
    const bst = buildBst(values);
    const path = [];
    const out = [];
    let p = bst.root, found = null;
    const push = (line, message, extra = {}) => out.push(snap('bstfind-' + out.length, line, message, { kind: 'tree', tree: shapeOf(bst), path: path.slice(), ...extra }));
    push(2, `从根结点开始查找 ${target}`, { current: bst.root, active: [] });
    while (p) {
      path.push(p);
      push(3, `比较目标 ${target} 与结点 ${bst.nodes[p].value}`, { current: p, active: path.slice() });
      if (bst.nodes[p].value === target) { found = p; break; }
      const side = target < bst.nodes[p].value ? 'left' : 'right';
      push(side === 'left' ? 6 : 8, `${target} ${side === 'left' ? '小于' : '大于'} ${bst.nodes[p].value}，进入${side === 'left' ? '左' : '右'}子树`, { current: bst.nodes[p][side], active: path.slice() });
      p = bst.nodes[p][side];
    }
    if (found) push(4, `查找成功：${target} 位于结点 ${found}，路径为 ${path.join(' → ')}`, { current: found, active: path.slice(), foundNode: found, done: true });
    else push(10, `查找失败：${target} 不在树中，比较路径为 ${path.join(' → ')}`, { current: null, active: path.slice(), foundNode: null, done: true });
    return out;
  }

  function bstDelete(values, targets) {
    const bst = buildBst(values);
    const out = [], deleted = [];
    const push = (line, message, extra = {}) => out.push(snap('bstdel-' + out.length, line, message, { kind: 'tree', tree: shapeOf(bst), output: deleted.slice(), ...extra }));
    push(1, `先按插入序列构造二叉排序树，再依次删除 ${targets.join(', ')}`, { current: bst.root, active: [] });
    for (const key of targets) {
      const path = [];
      let p = bst.root, parent = null;
      push(3, `查找待删除关键字 ${key}`, { current: bst.root, active: [] });
      while (p && bst.nodes[p].value !== key) {
        path.push(p);
        push(3, `比较 ${key} 与 ${bst.nodes[p].value}，继续下行`, { current: p, active: path.slice() });
        parent = p;
        p = key < bst.nodes[p].value ? bst.nodes[p].left : bst.nodes[p].right;
      }
      if (!p) { push(7, `${key} 不在树中，跳过本次删除`, { active: path.slice() }); continue; }
      path.push(p);
      push(3, `找到待删除结点 ${p}（${key}）`, { current: p, active: path.slice() });
      const left = bst.nodes[p].left, right = bst.nodes[p].right;
      if (!left && !right) {
        push(8, `情形一：${key} 是叶子结点，直接删除`, { current: p, active: [p] });
        if (parent === null) bst.root = null;
        else if (bst.nodes[parent].left === p) bst.nodes[parent].left = null;
        else bst.nodes[parent].right = null;
        delete bst.nodes[p];
        push(9, `叶子 ${key} 删除后，其余结点关系不变`, { active: [] });
      } else if (!left || !right) {
        const child = left || right;
        push(10, `情形二：${key} 只有一个孩子 ${bst.nodes[child].value}，用孩子顶替`, { current: child, active: [p, child] });
        if (parent === null) bst.root = child;
        else if (bst.nodes[parent].left === p) bst.nodes[parent].left = child;
        else bst.nodes[parent].right = child;
        delete bst.nodes[p];
        push(12, `结点 ${key} 删除，子树整体上移接替`, { current: child, active: [child] });
      } else {
        push(13, `情形三：${key} 有两个孩子，找右子树最小结点（中序后继）`, { current: p, active: [p] });
        let sp = right, sparent = p;
        while (bst.nodes[sp].left) { sparent = sp; sp = bst.nodes[sp].left; push(14, `后继候选 ${bst.nodes[sp].value}，继续向左`, { current: sp, active: [p, sp] }); }
        const successor = bst.nodes[sp].value;
        push(15, `后继是 ${successor}：用 ${successor} 覆盖待删结点 ${key}`, { current: sp, active: [p, sp] });
        bst.nodes[p].value = successor;
        const sr = bst.nodes[sp].right;
        if (sparent === p) bst.nodes[p].right = sr;
        else bst.nodes[sparent].left = sr;
        delete bst.nodes[sp];
        push(16, `删除后继结点 ${sp}（它至多有一个右孩子，易删除）`, { current: p, active: [p] });
      }
      deleted.push(key);
      push(17, `${key} 删除完成；中序序列仍有序：${inorderOf({ root: bst.root, nodes: bst.nodes })}`, { active: [] });
    }
    push(18, `全部删除完成，共删除 ${deleted.length} 个关键字：${deleted.join(', ')}`, { active: [], done: true });
    return out;
  }

  function heapInsert(heap, value) {
    const a = heap.slice(), out = [];
    const push = (line, message, extra = {}) => out.push(snap('heapins-' + out.length, line, message, { kind: 'array', values: a.slice(), heapEnd: a.length - 1, ...extra }));
    push(1, `大根堆：${a.join(' ')}；待插入 ${value}`);
    a.push(value);
    push(2, `${value} 追加到下标 ${a.length - 1}（表尾）`, { active: [a.length - 1] });
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      push(5, `比较 a[${i}]=${a[i]} 与双亲 a[${parent}]=${a[parent]}`, { active: [i, parent] });
      if (a[i] <= a[parent]) { push(5, `${a[i]} ≤ ${a[parent]}，已满足大根堆，停止上浮`, { active: [i, parent] }); break; }
      [a[i], a[parent]] = [a[parent], a[i]];
      push(6, `交换 ${a[parent]} 与 ${a[i]}：较大者上浮`, { active: [i, parent] });
      i = parent;
      push(7, i === 0 ? '已上浮到根结点' : `i=${i}，继续与新的双亲比较`, { active: [i] });
    }
    push(9, `插入完成，仍是大根堆：${a.join(' ')}`, { active: [], done: true });
    return out;
  }

  function radixSort(values) {
    if (values.some(value => !Number.isInteger(value) || value < 0 || value > 999)) throw new Error('基数排序要求 0–999 的整数');
    const a = values.slice(), out = [];
    const max = Math.max(...a, 0);
    const passes = Math.min(3, Math.max(1, String(max).length));
    const names = ['个位', '十位', '百位'];
    const push = (line, message, extra = {}) => out.push(snap('radix-' + out.length, line, message, { kind: 'array', values: a.slice(), ...extra }));
    push(1, `LSD 基数排序：${a.join(' ')}；共 ${passes} 趟（低位优先）`);
    for (let d = 0; d < passes; d++) {
      const place = 10 ** d, name = names[d];
      const buckets = Array.from({ length: 10 }, () => []);
      push(2, `第 ${d + 1} 趟：按${name}分配`, { pass: d + 1 });
      a.forEach(value => { buckets[Math.floor(value / place) % 10].push(value); });
      push(4, `${name}计数：${buckets.map((bucket, k) => `${k}:${bucket.length}`).join(' ')}`, {});
      for (let i = a.length - 1; i >= 0; i--) {
        const digit = Math.floor(a[i] / place) % 10;
        push(7, `从右向左处理 a[${i}]=${a[i]}：${name}=${digit}，定位到桶 ${digit}`, { active: [i] });
      }
      const collected = [];
      for (let k = 0; k < 10; k++) collected.push(...buckets[k]);
      a.splice(0, a.length, ...collected);
      push(8, `按${name}收集回原数组：${a.join(' ')}`, {});
    }
    push(10, `排序完成：${a.join(' ')}`, { done: true, fixed: a.map((_, i) => i) });
    return out;
  }

  function countingSort(values) {
    if (values.some(value => !Number.isInteger(value) || value < 0 || value > 9)) throw new Error('计数排序演示要求 0–9 的整数');
    const src = values.slice(), n = src.length, count = Array(10).fill(0), output = Array(n).fill(null), out = [];
    const push = (line, message, shown, extra = {}) => out.push(snap('count-' + out.length, line, message, { kind: 'array', values: shown.slice(), count: count.slice(), ...extra }));
    push(1, `计数排序：${src.join(' ')}（关键字范围 0–9）`, src);
    src.forEach((value, i) => {
      count[value] += 1;
      push(2, `统计 ${value}：count[${value}]=${count[value]}`, src, { active: [i] });
    });
    let sum = 0;
    for (let k = 0; k < 10; k++) { sum += count[k]; count[k] = sum; }
    push(3, `前缀和完成：count[k] 表示值 ≤ k 的元素个数 → [${count.join(',')}]`, src);
    push(4, `输出数组 B 初始化为空（长度 ${n}）`, output);
    for (let i = n - 1; i >= 0; i--) {
      const value = src[i];
      count[value] -= 1;
      output[count[value]] = value;
      push(5, `${value} 的最终位置是 ${count[value]}：从右向左放置保证稳定性`, output, { active: [count[value]] });
    }
    push(7, `B 已有序：${output.join(' ')}；写回 A 即完成`, output, { done: true, fixed: output.map((_, i) => i) });
    return out;
  }

  function binaryInsertionSort(values) {
    const a = values.slice(), n = a.length, out = [];
    let ordered = [0];
    const push = (line, message, extra = {}) => out.push(snap('binins-' + out.length, line, message, { kind: 'array', values: a.slice(), fixed: ordered.slice(), ...extra }));
    push(1, '第 0 个元素自身有序，从第 1 个元素开始插入');
    for (let i = 1; i < n; i++) {
      const key = a[i];
      let low = 0, high = i - 1;
      push(3, `暂存 key=${key}，在已有序区间 [0, ${i - 1}] 折半查找插入位置`, { active: [i], key, low, high });
      while (low <= high) {
        const mid = (low + high) >> 1;
        push(5, `mid=${mid}：比较 a[${mid}]=${a[mid]} 与 key=${key}`, { active: [mid], key, low, high, mid });
        if (a[mid] > key) { high = mid - 1; push(6, `${a[mid]} > ${key}，插入位置在左半区`, { key, low, high, mid }); }
        else { low = mid + 1; push(7, `${a[mid]} ≤ ${key}，插入位置在右半区（相等取右侧，稳定）`, { key, low, high, mid }); }
      }
      for (let j = i - 1; j >= high + 1; j--) {
        a[j + 1] = a[j];
        push(10, `${a[j]} 后移到下标 ${j + 1}`, { active: [j + 1], key, target: high + 1 });
      }
      a[high + 1] = key;
      ordered = Array.from({ length: i + 1 }, (_, k) => k);
      push(11, `${key} 写入下标 ${high + 1}，有序区扩大到 ${i + 1} 个元素`, { active: [high + 1] });
    }
    push(13, `排序完成：${a.join(' ')}`, { done: true, fixed: a.map((_, i) => i) });
    return out;
  }

  function hashLinear(keys, size) {
    if (!Number.isInteger(size) || size < 1) throw new Error('表长必须是正整数');
    const buckets = Array.from({ length: size }, () => []);
    const out = [];
    let count = 0;
    const slotOf = key => ((key % size) + size) % size;
    const push = (line, message, extra = {}) => out.push(snap('hashlin-' + out.length, line, message, { kind: 'hash', buckets: structuredClone(buckets), count, ...extra }));
    push(2, `表长 m=${size}，H(key)=key mod ${size}；冲突时用线性探测 H(k)+d（d=1,2,…）`);
    keys.forEach(key => {
      let pos = slotOf(key), inserted = false;
      const probes = [];
      push(2, `${key} 的散列地址 H(${key})=${pos}`, { index: pos, value: key, probes: [] });
      while (probes.length < size) {
        if (!buckets[pos].length) {
          buckets[pos].push(key);
          count += 1;
          inserted = true;
          const path = [...probes, pos];
          push(5, `位置 ${pos} 空闲，${key} 存入；探测序列 ${path.join(' → ')}（比较 ${probes.length} 次）`, { index: pos, value: key, probes: path });
          break;
        }
        probes.push(pos);
        push(4, `位置 ${pos} 已被 ${buckets[pos][0]} 占用，发生冲突`, { index: pos, value: key, probes: probes.slice() });
        if (probes.length === size) break;
        pos = (pos + 1) % size;
        push(8, `线性探测下一个位置 ${pos}`, { index: pos, value: key, probes: probes.slice() });
      }
      if (!inserted) push(10, `${key} 探测 ${size} 次仍无空位（表满），插入失败`, { index: pos, value: key, probes: probes.slice() });
    });
    push(11, `插入结束：共存入 ${count} 个关键字，仍可继续探测的位置均被占用`, { index: undefined, done: true });
    return out;
  }

  function hashDouble(keys, size, prime) {
    if (!Number.isInteger(size) || size < 2) throw new Error('表长至少为 2');
    if (!Number.isInteger(prime) || prime < 2 || prime >= size) throw new Error('第二散列的模需满足 2 ≤ prime < 表长');
    const buckets = Array.from({ length: size }, () => []);
    const out = [];
    let count = 0;
    const mod = (key, m) => ((key % m) + m) % m;
    const push = (line, message, extra = {}) => out.push(snap('hashdouble-' + out.length, line, message, { kind: 'hash', buckets: structuredClone(buckets), count, ...extra }));
    push(2, `表长 m=${size}，H1(key)=key mod ${size}；H2(key)=${prime} − (key mod ${prime}) 决定探测步长（双散列）`);
    keys.forEach(key => {
      const h1 = mod(key, size), step = prime - mod(key, prime);
      let inserted = false;
      push(2, `H1(${key})=${key} mod ${size}=${h1}`, { index: h1, value: key });
      push(3, `H2(${key})=${prime} − (${key} mod ${prime})=${step}，即探测步长`, { index: h1, value: key, step });
      for (let d = 0; d < size; d++) {
        const pos = (h1 + d * step) % size;
        if (!buckets[pos].length) {
          buckets[pos].push(key);
          count += 1;
          inserted = true;
          push(7, `第 ${d + 1} 次探测停在空位 ${pos}，${key} 存入`, { index: pos, value: key, step });
          break;
        }
        push(6, `第 ${d + 1} 次探测位置 ${pos} 已被 ${buckets[pos][0]} 占用`, { index: pos, value: key, step });
      }
      if (!inserted) push(10, `步长 ${step} 循环探测 ${size} 次仍无空位，${key} 插入失败`, { index: h1, value: key, step });
    });
    push(11, `插入结束：步长由关键字自身的第二散列决定，避免线性探测的堆积`, { index: undefined, done: true });
    return out;
  }

  function kmpNextval(text, pattern) {
    if (typeof text !== 'string' || typeof pattern !== 'string' || !pattern.length || !/^[\x20-\x7e]*$/.test(text) || !/^[\x20-\x7e]+$/.test(pattern)) throw new Error('使用可打印 ASCII 字符；模式串不能为空');
    if (text.length > 32 || pattern.length > 16) throw new Error('主串最多 32 个字符，模式串最多 16 个字符');
    const m = pattern.length, n = text.length;
    const pi = Array(m).fill(0), nv = Array(m).fill(0), shown = Array(m).fill(0);
    const out = [];
    let i = 0, j = 0, found = null, phase = 'prefix';
    const push = (line, message) => out.push(snap('kmpnv-' + out.length, line, message, { kind: 'string', text, pattern, pi: shown.slice(), nv: nv.slice(), i, j, phase, found }));
    push(2, 'pi[0]=0：先按 0-based 约定构造 pi 前缀表');
    for (i = 1; i < m; i++) {
      j = pi[i - 1];
      push(4, `计算 pi[${i}]，从 j=pi[${i - 1}]=${j} 开始`);
      while (j > 0 && pattern[i] !== pattern[j]) { j = pi[j - 1]; push(5, `p[${i}]≠p[${j}]，j 回退到 pi[j−1]=${j}`); }
      if (pattern[i] === pattern[j]) j += 1;
      pi[i] = j;
      push(7, `pi[${i}]=${j}`);
    }
    push(11, 'nextval[0]=0；下面合并「回退后仍失配」的连续回退');
    for (i = 1; i < m; i++) {
      j = pi[i - 1];
      nv[i] = pattern[i] === pattern[j] ? nv[j] : j;
      shown[i] = nv[i];
      push(14, pattern[i] === pattern[j]
        ? `nextval[${i}]=nextval[${j}]=${nv[i]}（p[${i}]=p[${j}]，回退到 ${j} 仍会失配，直接跳过）`
        : `nextval[${i}]=pi[${i - 1}]=${j}（p[${i}]≠p[${j}]，可安全回退）`);
    }
    i = 0; j = 0; phase = 'match'; found = null;
    push(18, '用 nextval 表开始匹配：主串指针 i 永不回退');
    for (i = 0; i < n; i++) {
      push(20, `比较 s[${i}]='${text[i]}' 与 p[${j}]='${pattern[j]}'`);
      while (j > 0 && text[i] !== pattern[j]) { j = nv[j]; push(21, `失配，j=nextval[${j}] → ${j}`); }
      if (text[i] === pattern[j]) j += 1;
      push(20, `已匹配前缀长度 j=${j}`);
      if (j === m) {
        found = i - m + 1;
        push(22, `匹配成功，首次出现下标 ${found}`);
        out.at(-1).state.done = true;
        return out;
      }
    }
    found = -1;
    push(24, '主串扫描完毕，未找到匹配');
    out.at(-1).state.done = true;
    return out;
  }

  function bfMatch(text, pattern) {
    if (typeof text !== 'string' || typeof pattern !== 'string' || !pattern.length || !/^[\x20-\x7e]*$/.test(text) || !/^[\x20-\x7e]+$/.test(pattern)) throw new Error('使用可打印 ASCII 字符；模式串不能为空');
    if (text.length > 32 || pattern.length > 16) throw new Error('主串最多 32 个字符，模式串最多 16 个字符');
    const m = pattern.length, pi = Array(m).fill(0);
    const out = [];
    let i = 0, j = 0, found = null;
    const push = (line, message) => out.push(snap('bf-' + out.length, line, message, { kind: 'string', text, pattern, pi: pi.slice(), i, j, phase: 'match', found }));
    push(1, 'BF 朴素匹配：i 指向主串、j 指向模式串，失配时 i 回退');
    while (i < text.length && j < m) {
      push(4, `比较 s[${i}]='${text[i]}' 与 p[${j}]='${pattern[j]}'`);
      if (text[i] === pattern[j]) { i += 1; j += 1; push(4, `相等，i=${i}，j=${j}，继续向后比较`); }
      else {
        const back = i - j + 1;
        push(6, `失配：i 回退到 ${back}（本趟起点后移一位），j 归零`);
        i = back;
        j = 0;
      }
    }
    if (j === m) {
      found = i - m;
      push(10, `匹配成功，首次出现下标 ${found}`);
      out.at(-1).state.done = true;
    } else {
      found = -1;
      push(11, '主串扫描完毕，匹配失败');
      out.at(-1).state.done = true;
    }
    return out;
  }

  function crossList(graph) {
    if (!graph || !Array.isArray(graph.nodes) || !graph.nodes.length || !Array.isArray(graph.edges)) throw new Error('图需要非空节点和边清单');
    if (!graph.directed) throw new Error('十字链表用于有向图');
    const ids = graph.nodes.map(node => node.id);
    if (new Set(ids).size !== ids.length || ids.some(id => typeof id !== 'string' || !/^[A-Z]$/.test(id))) throw new Error('节点 ID 须为不重复的 A–Z 字母');
    const seen = new Set();
    for (const edge of graph.edges) {
      if (!Array.isArray(edge) || edge.length !== 3) throw new Error('每条边需要起点、终点、权值');
      const [u, v, w] = edge;
      if (!ids.includes(u) || !ids.includes(v) || u === v) throw new Error('边端点必须存在且不能为自环');
      if (!Number.isFinite(w)) throw new Error('权值必须是有限数');
      if (seen.has(u + '→' + v)) throw new Error('不允许重复弧');
      seen.add(u + '→' + v);
    }
    const index = Object.fromEntries(ids.map((id, i) => [id, i]));
    const matrix = ids.map(() => ids.map(() => null));
    const lists = Object.fromEntries(ids.map(id => [id, []]));
    const inLists = Object.fromEntries(ids.map(id => [id, []]));
    const out = [];
    const push = (line, message, extra = {}) => out.push(snap('cross-' + out.length, line, message, { kind: 'adjacency', graph, ids: ids.slice(), matrix: structuredClone(matrix), lists: structuredClone(lists), inLists: structuredClone(inLists), ...extra }));
    push(1, '顶点表设有 firstout 与 firstin：出弧链、入弧链均用头插法建立');
    for (const [u, v, w] of graph.edges) {
      const a = index[u], b = index[v];
      matrix[a][b] = w;
      lists[u].unshift([v, w]);
      push(4, `处理弧 <${u}, ${v}, ${w}>：tail=${u}，head=${v}`, { active: [a, b] });
      push(5, `${u} 的出弧链头插：${chain(lists[u])}（即邻接表的一行）`, { active: [a, b] });
      inLists[v].unshift([u, w]);
      push(6, `${v} 的入弧链头插：${chain(inLists[v])}（即逆邻接表的一行）`, { active: [a, b] });
    }
    push(8, '十字链表构造完成：出弧链找到所有出边，入弧链找到所有入边，矩阵保留权值', { active: undefined, done: true });
    return out;
  }

  return {
    sequenceReverse,
    sequenceDeleteMin,
    linkedHeadInsert,
    linkedMerge,
    josephus,
    sharedStack,
    dequeDemo,
    threadedTree,
    bstSearch,
    bstDelete,
    heapInsert,
    radixSort,
    countingSort,
    binaryInsertionSort,
    hashLinear,
    hashDouble,
    kmpNextval,
    bfMatch,
    crossList
  };
});
