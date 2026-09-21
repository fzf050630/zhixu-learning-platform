(function (root, factory) {
  const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
  root.DS=root.DS||{};root.DS.Algorithms=root.DS.Algorithms||{};root.DS.Algorithms.search=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const snap=(id,line,message,state)=>({id,line,message,state:structuredClone(state)});
  function binarySearch(values,target){let low=0,high=values.length-1,n=0;const out=[snap('binary-start',1,`在有序表中查找 ${target}`,{kind:'array',values,low,high,target,found:null})];while(low<=high){const mid=Math.floor((low+high)/2);out.push(snap(`binary-mid-${n++}`,3,`取中点 ${mid}，值为 ${values[mid]}`,{kind:'array',values,low,high,mid,target,active:[mid],found:null}));if(values[mid]===target){out.push(snap('binary-found',5,`找到 ${target}，下标为 ${mid}`,{kind:'array',values,low,high,mid,target,active:[mid],found:mid,done:true}));return out;}if(values[mid]<target){low=mid+1;out.push(snap(`binary-right-${n++}`,7,'目标更大，舍弃左半区',{kind:'array',values,low,high,target,found:null}));}else{high=mid-1;out.push(snap(`binary-left-${n++}`,9,'目标更小，舍弃右半区',{kind:'array',values,low,high,target,found:null}));}}out.push(snap('binary-miss',11,'区间为空，查找失败',{kind:'array',values,low,high,target,found:-1,done:true}));return out;}
  function bstInsert(values){let root=null;const nodes={};const asTree=()=>({root,nodes:Object.fromEntries(Object.entries(nodes).map(([id,n])=>[id,[n.left,n.right]])),labels:Object.fromEntries(Object.entries(nodes).map(([id,n])=>[id,String(n.value)]))});const inorder=()=>{const out=[];(function walk(id){if(!id)return;walk(nodes[id].left);out.push(nodes[id].value);walk(nodes[id].right);})(root);return out;};const steps=[snap('bst-start',1,'从空树开始逐个插入关键字',{kind:'tree',tree:asTree(),inorder:[]})];values.forEach((value,i)=>{const id=`n${i}`;nodes[id]={value,left:null,right:null};if(!root){root=id;steps.push(snap(`bst-root-${i}`,3,`${value} 成为根结点`,{kind:'tree',tree:asTree(),current:id,inorder:inorder()}));return;}let p=root;while(true){steps.push(snap(`bst-compare-${i}-${p}`,5,`比较 ${value} 与 ${nodes[p].value}`,{kind:'tree',tree:asTree(),active:[p],current:p,inorder:inorder()}));const side=value<nodes[p].value?'left':'right';if(!nodes[p][side]){nodes[p][side]=id;steps.push(snap(`bst-add-${i}`,7,`${value} 插入到 ${nodes[p].value} 的${side==='left'?'左':'右'}侧`,{kind:'tree',tree:asTree(),active:[p,id],current:id,inorder:inorder()}));break;}p=nodes[p][side];}});steps.push(snap('bst-done',9,'中序序列有序，构造完成',{kind:'tree',tree:asTree(),inorder:inorder(),done:true}));return steps;}
  /* ---------- AVL 树：通用插入、删除与查找 ----------
     树用 { root, nodes: { id: [左, 右] } } 表示，id 就是关键字；
     因此删除双孩子结点时按 CLRS 方式把中序后继结点整体提到被删位置（不改写关键字）。 */
  function avlTree(values, deletes, target) {
    if (!Array.isArray(values) || values.length < 1 || values.length > 12 || values.some(v => !Number.isInteger(v) || Math.abs(v) > 999)) throw new Error('请输入 1–12 个 [-999,999] 整数');
    if (new Set(values).size !== values.length) throw new Error('AVL 树要求关键字互不相同');
    const list = Array.isArray(deletes) ? deletes : [];
    if (list.length > 12 || list.some(v => !Number.isInteger(v) || Math.abs(v) > 999)) throw new Error('删除序列最多 12 个 [-999,999] 整数');
    if (target !== undefined && target !== null && (!Number.isInteger(target) || Math.abs(target) > 999)) throw new Error('查找值须为 [-999,999] 整数');

    const height = (tree, id) => (id && tree.nodes[id] ? 1 + Math.max(height(tree, tree.nodes[id][0]), height(tree, tree.nodes[id][1])) : 0);
    const balance = (tree, id) => (id && tree.nodes[id] ? height(tree, tree.nodes[id][0]) - height(tree, tree.nodes[id][1]) : 0);
    const decorate = tree => {
      const heights = {}, balanceFactors = {};
      Object.keys(tree.nodes).forEach(id => { heights[id] = height(tree, id); balanceFactors[id] = balance(tree, id); });
      return { root: tree.root, nodes: tree.nodes, heights, balanceFactors };
    };
    const parentOf = (tree, id) => Object.keys(tree.nodes).find(key => tree.nodes[key][0] === id || tree.nodes[key][1] === id) || null;
    const attach = (tree, parent, previous, next) => {
      if (!parent) { tree.root = next; return; }
      const kids = tree.nodes[parent];
      tree.nodes[parent] = [kids[0] === previous ? next : kids[0], kids[1] === previous ? next : kids[1]];
    };
    const rotateRight = (tree, id) => {
      const pivot = tree.nodes[id][0], moved = tree.nodes[pivot][1], parent = parentOf(tree, id);
      tree.nodes[pivot] = [tree.nodes[pivot][0], id];
      tree.nodes[id] = [moved, tree.nodes[id][1]];
      attach(tree, parent, id, pivot);
      return pivot;
    };
    const rotateLeft = (tree, id) => {
      const pivot = tree.nodes[id][1], moved = tree.nodes[pivot][0], parent = parentOf(tree, id);
      tree.nodes[pivot] = [id, tree.nodes[pivot][1]];
      tree.nodes[id] = [tree.nodes[id][0], moved];
      attach(tree, parent, id, pivot);
      return pivot;
    };
    const subtreeIds = (tree, id) => {
      const ids = [];
      (function walk(current) {
        if (!current || !tree.nodes[current]) return;
        ids.push(current);
        walk(tree.nodes[current][0]);
        walk(tree.nodes[current][1]);
      })(id);
      return ids;
    };
    const signed = value => (value > 0 ? '+' : '') + value;

    const tree = { root: null, nodes: {} };
    const steps = [];
    const seen = [];
    const push = (line, message, extra) => steps.push(snap('avl-' + steps.length, line, message, { kind: 'tree', tree: decorate(tree), cases: [...seen], ...extra }));

    function fixNode(id, reason) {
      const bf = balance(tree, id), side = bf > 0 ? 0 : 1, child = tree.nodes[id][side], childBf = balance(tree, child);
      const type = bf > 0 ? (childBf >= 0 ? 'LL' : 'LR') : (childBf <= 0 ? 'RR' : 'RL');
      push(4, `${reason}：结点 ${id} 的 bf = ${signed(bf)}，其${side === 0 ? '左' : '右'}孩子 ${child} 的 bf = ${signed(childBf)}，判定为 ${type} 型失衡`, { unbalanced: [id], current: id, subtree: subtreeIds(tree, id), rotation: type });
      let root = id;
      if (type === 'LL') {
        root = rotateRight(tree, id);
        push(5, `LL：对失衡结点 ${id} 做一次右旋，${root} 上升为子树根`, { current: root, subtree: subtreeIds(tree, root), rotation: 'LL' });
      } else if (type === 'RR') {
        root = rotateLeft(tree, id);
        push(7, `RR：对失衡结点 ${id} 做一次左旋，${root} 上升为子树根`, { current: root, subtree: subtreeIds(tree, root), rotation: 'RR' });
      } else if (type === 'LR') {
        const middle = rotateLeft(tree, child);
        push(6, `LR：先对左孩子 ${child} 做左旋，${middle} 上升，失衡转化为 LL 型`, { current: middle, subtree: subtreeIds(tree, middle), rotation: 'LR' });
        root = rotateRight(tree, id);
        push(6, `LR：再对失衡结点 ${id} 做右旋，${root} 上升为子树根`, { current: root, subtree: subtreeIds(tree, root), rotation: 'LR' });
      } else {
        const middle = rotateRight(tree, child);
        push(8, `RL：先对右孩子 ${child} 做右旋，${middle} 上升，失衡转化为 RR 型`, { current: middle, subtree: subtreeIds(tree, middle), rotation: 'RL' });
        root = rotateLeft(tree, id);
        push(8, `RL：再对失衡结点 ${id} 做左旋，${root} 上升为子树根`, { current: root, subtree: subtreeIds(tree, root), rotation: 'RL' });
      }
      if (!seen.includes(type)) seen.push(type);
      return { root, spins: type === 'LR' || type === 'RL' ? 2 : 1 };
    }

    /* ---------- 插入 ---------- */
    push(1, '从空树开始：AVL 树要求每个结点的平衡因子 |bf| ≤ 1', {});
    for (const key of values) {
      const id = String(key), path = [];
      if (!tree.root) {
        tree.nodes[id] = [null, null];
        tree.root = id;
      } else {
        let node = tree.root;
        while (true) {
          path.push(node);
          push(2, `比较 ${key} 与结点 ${node}，向${key < Number(node) ? '左' : '右'}下降`, { active: path.slice(), current: node });
          const side = key < Number(node) ? 0 : 1;
          if (!tree.nodes[node][side]) { tree.nodes[id] = [null, null]; tree.nodes[node][side] = id; break; }
          node = tree.nodes[node][side];
        }
      }
      push(2, `把 ${key} 作为叶子插入，随后沿路径自下而上更新高度与平衡因子`, { active: path.slice(), current: id });
      const climb = [];
      let node = parentOf(tree, id), unbalanced = null;
      while (node) {
        climb.push(node);
        if (Math.abs(balance(tree, node)) >= 2) { unbalanced = node; break; }
        node = parentOf(tree, node);
      }
      push(3, unbalanced
        ? `自下而上回溯：${climb.join(' → ')}；结点 ${unbalanced} 的 bf = ${signed(balance(tree, unbalanced))}，出现失衡`
        : `自下而上回溯：${climb.join(' → ') || '根结点'}；高度与平衡因子已更新，全部 |bf| ≤ 1`, { active: climb });
      if (unbalanced) fixNode(unbalanced, '插入后从最低失衡结点开始修复');
      push(9, `本次插入完成：全部结点 |bf| ≤ 1，树高恢复到 ${height(tree, tree.root)}`, { current: tree.root });
    }

    /* ---------- 删除 ---------- */
    for (const key of list) {
      push(10, `删除 ${key}：从根开始按关键字比较`, { deleting: key });
      const path = [];
      let node = tree.root, found = true;
      while (node && Number(node) !== key) {
        path.push(node);
        push(10, `比较 ${key} 与结点 ${node}，向${key < Number(node) ? '左' : '右'}下降`, { active: path.slice(), current: node, deleting: key });
        node = tree.nodes[node][key < Number(node) ? 0 : 1];
      }
      if (!node) {
        push(11, `关键字 ${key} 不在树中，本次删除跳过`, { deleting: key });
        push(18, `${key} 删除操作结束：树结构不变，全部结点 |bf| ≤ 1`, { current: tree.root });
        continue;
      }
      push(10, `找到待删结点 ${node}（${key}）`, { active: path.concat(node), current: node, deleting: key });
      const parent = parentOf(tree, node), kids = tree.nodes[node], left = kids[0], right = kids[1];
      let start;
      if (!left || !right) {
        const child = left || right;
        if (!parent) tree.root = child;
        else { const pk = tree.nodes[parent]; tree.nodes[parent] = [pk[0] === node ? child : pk[0], pk[1] === node ? child : pk[1]]; }
        delete tree.nodes[node];
        push(12, `${key} 至多有一个孩子：直接用${child ? '孩子 ' + child : '空指针'}接替它的位置`, { active: [node].concat(child ? [child] : []), current: node, deleting: key });
        start = parent;
      } else {
        let succ = right;
        while (tree.nodes[succ][0]) succ = tree.nodes[succ][0];
        push(13, `${key} 有两个孩子：在右子树中一路向左找到中序后继 ${succ}`, { active: [node, succ], current: succ, deleting: key });
        const succParent = parentOf(tree, succ), succRight = tree.nodes[succ][1];
        if (succParent !== node) {
          const sk = tree.nodes[succParent];
          tree.nodes[succParent] = [sk[0] === succ ? succRight : sk[0], sk[1] === succ ? succRight : sk[1]];
          tree.nodes[succ] = [left, right];
        } else {
          tree.nodes[succ] = [left, succRight];
        }
        if (!parent) tree.root = succ;
        else { const pk = tree.nodes[parent]; tree.nodes[parent] = [pk[0] === node ? succ : pk[0], pk[1] === node ? succ : pk[1]]; }
        delete tree.nodes[node];
        push(13, `把后继 ${succ} 整体提到 ${key} 的位置：中序序列不变，原后继结点位置被摘除`, { active: [succ], current: succ, deleting: key });
        start = succParent === node ? succ : succParent;
      }
      let cursor = start, rotations = 0, guard = 0;
      while (cursor && guard++ < 64) {
        const bf = balance(tree, cursor);
        if (Math.abs(bf) >= 2) {
          const fixed = fixNode(cursor, '删除后自下而上回溯发现失衡');
          rotations += fixed.spins;
          cursor = parentOf(tree, fixed.root);
          if (cursor) push(16, `继续向上回溯：从 ${fixed.root} 的双亲 ${cursor} 接着检查（删除可能触发多次旋转）`, { current: cursor });
        } else {
          push(15, `结点 ${cursor} 的 h = ${height(tree, cursor)}，bf = ${signed(bf)}，仍然平衡`, { current: cursor });
          cursor = parentOf(tree, cursor);
        }
      }
      push(18, `${key} 删除完成：${rotations ? `沿路径共旋转 ${rotations} 次` : '无需旋转'}，全部结点 |bf| ≤ 1`, { current: tree.root });
    }

    /* ---------- 查找 ---------- */
    if (target === undefined || target === null) {
      push(18, list.length ? '全部删除完成；未设置查找值' : '构造完成；未设置查找值', { done: true, found: null });
    } else {
      let node = tree.root, hit = false;
      while (node) {
        push(19, `比较 ${target} 与结点 ${node}`, { current: node });
        if (Number(node) === target) { push(20, `找到关键字 ${target}`, { current: node, done: true, found: true }); hit = true; break; }
        node = tree.nodes[node][target < Number(node) ? 0 : 1];
      }
      if (!hit) push(20, `关键字 ${target} 不在树中，查找失败`, { done: true, found: false });
    }
    return steps;
  }
  function hashDemo(values,size){if(!Number.isInteger(size)||size<1)throw new Error('桶数必须是正整数');const buckets=Array.from({length:size},()=>[]),steps=[snap('hash-start',1,`建立长度为 ${size} 的散列表`,{kind:'hash',buckets,count:0})];values.forEach((value,i)=>{const index=((value%size)+size)%size;steps.push(snap(`hash-calc-${i}`,3,`${value} mod ${size} = ${index}`,{kind:'hash',buckets,index,value,count:i}));if(buckets[index].length)steps.push(snap(`hash-hit-${i}`,5,`地址 ${index} 已占用，使用链地址法`,{kind:'hash',buckets,index,value,collision:true,count:i}));buckets[index].push(value);steps.push(snap(`hash-add-${i}`,7,`${value} 加入桶 ${index}`,{kind:'hash',buckets,index,value,count:i+1}));});steps.push(snap('hash-done',9,'所有关键字插入完成',{kind:'hash',buckets,count:values.length,done:true}));return steps;}
  return{binarySearch,bstInsert,avlTree,hashDemo};
});
