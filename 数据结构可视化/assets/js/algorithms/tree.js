(function (root, factory) {
  const api = factory(); if (typeof module === 'object' && module.exports) module.exports = api;
  root.DS = root.DS || {}; root.DS.Algorithms = root.DS.Algorithms || {}; root.DS.Algorithms.tree = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const snap = (id, line, message, state) => ({ id, line, message, state: structuredClone(state) });
  function sampleTree() { return { root: 'A', nodes: { A: ['B', 'C'], B: ['D', 'E'], C: [null, 'F'], D: [null, null], E: [null, null], F: [null, null] } }; }
  function traverse(tree, order) {
    const output = [], active = [], steps = [snap(`${order}-start`, 1, '从根结点开始递归', { kind: 'tree', tree, active, output, order })];
    let count = 0;
    function visit(id) {
      if (!id) return;
      const [left, right] = tree.nodes[id]; active.push(id);
      steps.push(snap(`${order}-enter-${count++}`, 2, `进入结点 ${id}`, { kind: 'tree', tree, active, output, order }));
      if (order === 'pre') record(id);
      visit(left);
      if (order === 'in') record(id);
      visit(right);
      if (order === 'post') record(id);
      active.pop();
    }
    function record(id) { output.push(id); steps.push(snap(`${order}-visit-${count++}`, order === 'pre' ? 3 : order === 'in' ? 5 : 7, `访问 ${id}，加入输出序列`, { kind: 'tree', tree, active, current: id, output, order })); }
    visit(tree.root);
    steps.push(snap(`${order}-done`, 8, '遍历完成', { kind: 'tree', tree, active: [], output, order, done: true }));
    return steps;
  }
  function levelOrder(tree) {
    const queue = [tree.root], output = [];
    const steps = [snap('level-start', 1, '根结点入队', { kind:'tree', tree, queue, output, active:[tree.root] })];
    let n = 0;
    while (queue.length) {
      const id = queue.shift(); output.push(id);
      steps.push(snap(`level-visit-${n++}`, 4, `${id} 出队并访问`, { kind:'tree', tree, queue, output, current:id, active:[id] }));
      for (const child of tree.nodes[id]) if (child) {
        queue.push(child);
        steps.push(snap(`level-add-${n++}`, 6, `孩子 ${child} 入队`, { kind:'tree', tree, queue, output, current:child, active:[id,child] }));
      }
    }
    steps.push(snap('level-done', 8, '队列为空，层序遍历完成', { kind:'tree', tree, queue:[], output, active:[], done:true }));
    return steps;
  }
  function huffman(weights) {
    let forest = weights.map((weight, i) => ({ id:`w${i}`, label:String(weight), weight, left:null, right:null }));
    const all = Object.fromEntries(forest.map(node => [node.id, node])); let n = 0;
    const makeTree = root => ({ root:root.id, nodes:Object.fromEntries(Object.values(all).map(node => [node.id,[node.left,node.right]])), labels:Object.fromEntries(Object.values(all).map(node => [node.id,node.label])) });
    const steps = [snap('huffman-start',1,'所有权值构成独立森林',{kind:'tree',tree:makeTree(forest[0]),forest:forest.map(x=>x.id),weights:forest.map(x=>x.weight)})];
    while (forest.length > 1) {
      forest.sort((a,b)=>a.weight-b.weight); const left=forest.shift(),right=forest.shift();
      steps.push(snap(`huffman-pick-${n}`,3,`选择最小权值 ${left.weight} 和 ${right.weight}`,{kind:'tree',tree:makeTree(left),forest:forest.map(x=>x.id),selected:[left.id,right.id],weights:[left.weight,right.weight]}));
      const parent={id:`h${n}`,label:String(left.weight+right.weight),weight:left.weight+right.weight,left:left.id,right:right.id}; all[parent.id]=parent; forest.push(parent);
      steps.push(snap(`huffman-merge-${n}`,5,`合并得到新结点 ${parent.weight}`,{kind:'tree',tree:makeTree(parent),forest:forest.map(x=>x.id),current:parent.id,active:[parent.id,left.id,right.id]})); n++;
    }
    const root=forest[0]; steps.push(snap('huffman-done',7,`根权值为全部权值之和 ${root.weight}`,{kind:'tree',tree:makeTree(root),rootWeight:root.weight,leafCount:weights.length,active:[],done:true})); return steps;
  }
  function unionFindDemo(items, operations) {
    const parent=Object.fromEntries(items.map(x=>[x,x]));
    const find=x=>{while(parent[x]!==x)x=parent[x];return x;};
    const state=()=>({kind:'tree',parents:{...parent},roots:Object.fromEntries(items.map(x=>[x,find(x)])),items:[...items]});
    const steps=[snap('uf-start',1,'每个元素各自构成一个集合',state())];
    operations.forEach(([a,b],i)=>{const ra=find(a),rb=find(b);steps.push(snap(`uf-find-${i}`,3,`查找 ${a} 与 ${b} 的根：${ra}、${rb}`,{...state(),active:[a,b]}));if(ra!==rb)parent[rb]=ra;steps.push(snap(`uf-union-${i}`,5,`将根 ${rb} 合并到根 ${ra}`,{...state(),active:[ra,rb]}));});
    steps.push(snap('uf-done',7,'所有指定关系合并完成',{...state(),done:true}));return steps;
  }
  return { sampleTree, traverse, levelOrder, huffman, unionFindDemo };
});
