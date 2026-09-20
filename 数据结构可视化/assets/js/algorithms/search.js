(function (root, factory) {
  const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
  root.DS=root.DS||{};root.DS.Algorithms=root.DS.Algorithms||{};root.DS.Algorithms.search=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const snap=(id,line,message,state)=>({id,line,message,state:structuredClone(state)});
  function binarySearch(values,target){let low=0,high=values.length-1,n=0;const out=[snap('binary-start',1,`在有序表中查找 ${target}`,{kind:'array',values,low,high,target,found:null})];while(low<=high){const mid=Math.floor((low+high)/2);out.push(snap(`binary-mid-${n++}`,3,`取中点 ${mid}，值为 ${values[mid]}`,{kind:'array',values,low,high,mid,target,active:[mid],found:null}));if(values[mid]===target){out.push(snap('binary-found',5,`找到 ${target}，下标为 ${mid}`,{kind:'array',values,low,high,mid,target,active:[mid],found:mid,done:true}));return out;}if(values[mid]<target){low=mid+1;out.push(snap(`binary-right-${n++}`,7,'目标更大，舍弃左半区',{kind:'array',values,low,high,target,found:null}));}else{high=mid-1;out.push(snap(`binary-left-${n++}`,9,'目标更小，舍弃右半区',{kind:'array',values,low,high,target,found:null}));}}out.push(snap('binary-miss',11,'区间为空，查找失败',{kind:'array',values,low,high,target,found:-1,done:true}));return out;}
  function bstInsert(values){let root=null;const nodes={};const asTree=()=>({root,nodes:Object.fromEntries(Object.entries(nodes).map(([id,n])=>[id,[n.left,n.right]])),labels:Object.fromEntries(Object.entries(nodes).map(([id,n])=>[id,String(n.value)]))});const inorder=()=>{const out=[];(function walk(id){if(!id)return;walk(nodes[id].left);out.push(nodes[id].value);walk(nodes[id].right);})(root);return out;};const steps=[snap('bst-start',1,'从空树开始逐个插入关键字',{kind:'tree',tree:asTree(),inorder:[]})];values.forEach((value,i)=>{const id=`n${i}`;nodes[id]={value,left:null,right:null};if(!root){root=id;steps.push(snap(`bst-root-${i}`,3,`${value} 成为根结点`,{kind:'tree',tree:asTree(),current:id,inorder:inorder()}));return;}let p=root;while(true){steps.push(snap(`bst-compare-${i}-${p}`,5,`比较 ${value} 与 ${nodes[p].value}`,{kind:'tree',tree:asTree(),active:[p],current:p,inorder:inorder()}));const side=value<nodes[p].value?'left':'right';if(!nodes[p][side]){nodes[p][side]=id;steps.push(snap(`bst-add-${i}`,7,`${value} 插入到 ${nodes[p].value} 的${side==='left'?'左':'右'}侧`,{kind:'tree',tree:asTree(),active:[p,id],current:id,inorder:inorder()}));break;}p=nodes[p][side];}});steps.push(snap('bst-done',9,'中序序列有序，构造完成',{kind:'tree',tree:asTree(),inorder:inorder(),done:true}));return steps;}
  /* ---------- AVL 四类旋转：在完整 AVL 树上演示失衡判定与旋转 ---------- */
  function avlRotations() {
    const shape = (root, edges) => {
      const nodes = {};
      const ensure = id => { if (id !== null && id !== undefined && !nodes[String(id)]) nodes[String(id)] = [null, null]; };
      Object.entries(edges).forEach(([key, kids]) => {
        ensure(key);
        nodes[String(key)] = [kids[0] === null || kids[0] === undefined ? null : String(kids[0]), kids[1] === null || kids[1] === undefined ? null : String(kids[1])];
        ensure(kids[0]);
        ensure(kids[1]);
      });
      ensure(root);
      return { root: String(root), nodes };
    };
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
    const insertKey = (tree, key) => {
      const id = String(key);
      tree.nodes[id] = [null, null];
      if (!tree.root) { tree.root = id; return { path: [], id }; }
      const path = [];
      let node = tree.root;
      while (true) {
        path.push(node);
        const side = key < Number(node) ? 0 : 1;
        if (!tree.nodes[node][side]) { tree.nodes[node][side] = id; return { path, id }; }
        node = tree.nodes[node][side];
      }
    };
    const lowestUnbalanced = tree => Object.keys(tree.nodes)
      .filter(id => Math.abs(balance(tree, id)) >= 2)
      .sort((a, b) => height(tree, a) - height(tree, b))[0] || null;
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
    const cases = [
      { type: 'LL', base: shape(50, { 50: [30, 70], 30: [20, 40], 20: [10, 15], 70: [60, 80] }), key: 5 },
      { type: 'RR', base: shape(50, { 50: [30, 70], 70: [60, 80], 80: [75, 85], 30: [20, 40] }), key: 95 },
      { type: 'LR', base: shape(50, { 50: [30, 70], 30: [20, 40], 20: [10, 15], 40: [35, 45], 70: [60, 80] }), key: 38 },
      { type: 'RL', base: shape(50, { 50: [30, 70], 70: [60, 80], 60: [55, 65], 80: [75, 85], 30: [20, 40] }), key: 58 },
    ];
    const steps = [];
    const finished = [];
    cases.forEach((item, caseIndex) => {
      const tree = structuredClone(item.base);
      steps.push(snap(`avl-${item.type}-init`, 2, `${item.type} 型准备：这是一棵平衡的 AVL 树，结点上方标 h（子树高度）、下方标 bf（平衡因子）`, { kind: 'tree', tree: decorate(tree), rotation: item.type, cases: [...finished] }));
      const inserted = insertKey(tree, item.key);
      steps.push(snap(`avl-${item.type}-insert`, 4, `插入 ${item.key}：沿 ${inserted.path.concat(inserted.id).join(' → ')} 的比较路径落到叶子位置`, { kind: 'tree', tree: decorate(tree), active: inserted.path, current: inserted.id, rotation: item.type, cases: [...finished] }));
      const unbalanced = lowestUnbalanced(tree);
      const childIndex = balance(tree, unbalanced) > 0 ? 0 : 1;
      const child = tree.nodes[unbalanced][childIndex];
      steps.push(snap(`avl-${item.type}-detect`, 7, `自下而上更新高度与平衡因子：结点 ${unbalanced} 的 bf = ${signed(balance(tree, unbalanced))}，其${childIndex === 0 ? '左' : '右'}孩子 ${child} 的 bf = ${signed(balance(tree, child))}，判定为 ${item.type} 型失衡`, { kind: 'tree', tree: decorate(tree), unbalanced: [unbalanced], subtree: subtreeIds(tree, unbalanced), current: unbalanced, rotation: item.type, cases: [...finished] }));
      let root = unbalanced;
      if (item.type === 'LL') {
        root = rotateRight(tree, unbalanced);
        steps.push(snap('avl-LL-rotate', 9, `对失衡结点 ${unbalanced} 做一次右旋：${root} 上升为子树根，${unbalanced} 成为其右孩子`, { kind: 'tree', tree: decorate(tree), current: root, subtree: subtreeIds(tree, root), rotation: 'LL', cases: [...finished] }));
      } else if (item.type === 'RR') {
        root = rotateLeft(tree, unbalanced);
        steps.push(snap('avl-RR-rotate', 12, `对失衡结点 ${unbalanced} 做一次左旋：${root} 上升为子树根，${unbalanced} 成为其左孩子`, { kind: 'tree', tree: decorate(tree), current: root, subtree: subtreeIds(tree, root), rotation: 'RR', cases: [...finished] }));
      } else if (item.type === 'LR') {
        const middle = rotateLeft(tree, child);
        steps.push(snap('avl-LR-rotate1', 10, `LR 分两步：先对左孩子 ${child} 做左旋，${middle} 上升，失衡转化为 LL 型`, { kind: 'tree', tree: decorate(tree), current: middle, subtree: subtreeIds(tree, middle), rotation: 'LR', cases: [...finished] }));
        root = rotateRight(tree, unbalanced);
        steps.push(snap('avl-LR-rotate2', 10, `再对失衡结点 ${unbalanced} 做右旋：${root} 上升为子树根`, { kind: 'tree', tree: decorate(tree), current: root, subtree: subtreeIds(tree, root), rotation: 'LR', cases: [...finished] }));
      } else {
        const middle = rotateRight(tree, child);
        steps.push(snap('avl-RL-rotate1', 13, `RL 分两步：先对右孩子 ${child} 做右旋，${middle} 上升，失衡转化为 RR 型`, { kind: 'tree', tree: decorate(tree), current: middle, subtree: subtreeIds(tree, middle), rotation: 'RL', cases: [...finished] }));
        root = rotateLeft(tree, unbalanced);
        steps.push(snap('avl-RL-rotate2', 13, `再对失衡结点 ${unbalanced} 做左旋：${root} 上升为子树根`, { kind: 'tree', tree: decorate(tree), current: root, subtree: subtreeIds(tree, root), rotation: 'RL', cases: [...finished] }));
      }
      finished.push(item.type);
      const worst = Math.max(...Object.keys(tree.nodes).map(id => Math.abs(balance(tree, id))));
      steps.push(snap(`avl-${item.type}-ok`, 15, `${item.type} 调整完成：全部结点 |bf| ≤ ${worst}，子树高度恢复到 ${height(tree, root)}`, { kind: 'tree', tree: decorate(tree), current: root, rotation: item.type, cases: [...finished] }));
    });
    steps.push(snap('avl-done', 15, '四类旋转演示完成：LL、RR 各一次旋转；LR、RL 先转孩子再转失衡结点，旋转后整棵树重新平衡', { kind: 'tree', tree: steps[steps.length - 1].state.tree, cases: [...finished], done: true }));
    return steps;
  }
  function hashDemo(values,size){if(!Number.isInteger(size)||size<1)throw new Error('桶数必须是正整数');const buckets=Array.from({length:size},()=>[]),steps=[snap('hash-start',1,`建立长度为 ${size} 的散列表`,{kind:'hash',buckets,count:0})];values.forEach((value,i)=>{const index=((value%size)+size)%size;steps.push(snap(`hash-calc-${i}`,3,`${value} mod ${size} = ${index}`,{kind:'hash',buckets,index,value,count:i}));if(buckets[index].length)steps.push(snap(`hash-hit-${i}`,5,`地址 ${index} 已占用，使用链地址法`,{kind:'hash',buckets,index,value,collision:true,count:i}));buckets[index].push(value);steps.push(snap(`hash-add-${i}`,7,`${value} 加入桶 ${index}`,{kind:'hash',buckets,index,value,count:i+1}));});steps.push(snap('hash-done',9,'所有关键字插入完成',{kind:'hash',buckets,count:values.length,done:true}));return steps;}
  return{binarySearch,bstInsert,avlRotations,hashDemo};
});
