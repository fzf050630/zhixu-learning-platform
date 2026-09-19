(function(root, factory) {
  const node = typeof module === 'object' && module.exports;
  const api = factory(node ? require('./graph.js') : root.DS.Algorithms.graph);
  if(node) module.exports = api;
  root.DS.Algorithms.graph = api;
})(globalThis, function(original) {
  'use strict';
  const snap=(id,line,message,state)=>({id,line,message,state:structuredClone(state)});
  function validateGraph(graph, options={}) {
    if(!graph || !Array.isArray(graph.nodes) || !graph.nodes.length || !Array.isArray(graph.edges))throw new Error('图需要非空节点和边清单');
    const ids=graph.nodes.map(n=>n.id),set=new Set(ids),edges=new Set();
    if(set.size!==ids.length || ids.some(id=>typeof id!=='string'||!/^[A-Z]$/.test(id)))throw new Error('节点 ID 须为不重复的 A–Z 字母');
    if(Object.prototype.hasOwnProperty.call(options,'start')&&!set.has(options.start))throw new Error('起点必须属于节点清单');
    if(options.directed!==undefined && Boolean(graph.directed)!==options.directed)throw new Error(options.directed?'此算法要求有向图':'此算法要求无向图');
    for(const edge of graph.edges){
      if(!Array.isArray(edge)||edge.length!==3)throw new Error('每条边需要起点、终点、权值');
      const [a,b,w]=edge;
      if(!set.has(a)||!set.has(b)||a===b)throw new Error('边端点必须存在且不能为自环');
      if(!Number.isFinite(w))throw new Error('权值必须是有限数');
      if(options.nonnegative&&w<0)throw new Error('此算法不接受负权');
      const key=graph.directed?a+b:[a,b].sort().join('');
      if(edges.has(key))throw new Error('不允许重复边');edges.add(key);
    }
    if(options.connected){const seen=new Set([ids[0]]);for(let i=0;i<ids.length;i++)for(const[a,b]of graph.edges){if(seen.has(a))seen.add(b);if(seen.has(b))seen.add(a);}if(seen.size!==ids.length)throw new Error('最小生成树要求连通图');}
    return ids;
  }
  function topological(graph){
    validateGraph(graph,{directed:true});const steps=original.topological(graph),last=steps.at(-1);
    last.state.hasCycle=last.state.output.length!==graph.nodes.length;
    last.state.indegrees=structuredClone(steps.at(-2).state.indegrees);
    if(last.state.hasCycle)last.message='检测到环，无法生成完整拓扑序';
    return steps;
  }
  function criticalPath(graph){
    const ids=validateGraph(graph,{directed:true,nonnegative:true}),topo=topological(graph).at(-1).state;
    if(topo.hasCycle)throw new Error('AOE 必须是无环有向图');
    const sources=ids.filter(id=>!graph.edges.some(e=>e[1]===id)),sinks=ids.filter(id=>!graph.edges.some(e=>e[0]===id));
    if(sources.length!==1||sinks.length!==1)throw new Error('AOE 当前要求单源、单汇');
    const output=topo.output,earliest=Object.fromEntries(ids.map(id=>[id,0])),activities=[],criticalEdges=[];
    let latest,duration;
    const state=()=>({kind:'graph',graph,output,earliest,...(latest?{latest}:{}),activities,criticalEdges,...(duration===undefined?{}:{duration})});
    const steps=[snap('critical-start',1,'验证单源单汇 DAG，按拓扑序计算 ve',state())];
    for(const v of output)for(const[a,b,w]of graph.edges.filter(e=>e[0]===v)){
      earliest[b]=Math.max(earliest[b],earliest[a]+w);
      steps.push(snap(`critical-${steps.length}`,4,`ve(${b}) = max(ve(${b}), ve(${a}) + ${w}) = ${earliest[b]}`,{...state(),activeEdge:[a,b]}));
    }
    duration=earliest[sinks[0]];latest=Object.fromEntries(ids.map(id=>[id,duration]));
    steps.push(snap(`critical-${steps.length}`,5,`以工期 ${duration} 初始化 vl`,state()));
    for(const v of output.slice().reverse())for(const[a,b,w]of graph.edges.filter(e=>e[0]===v)){
      latest[a]=Math.min(latest[a],latest[b]-w);
      steps.push(snap(`critical-${steps.length}`,6,`vl(${a}) = min(vl(${a}), vl(${b}) − ${w}) = ${latest[a]}`,{...state(),activeEdge:[a,b]}));
    }
    for(const[from,to,weight]of graph.edges){const e=earliest[from],l=latest[to]-weight,slack=l-e;activities.push({from,to,weight,e,l,slack});if(slack===0)criticalEdges.push([from,to]);steps.push(snap(`critical-${steps.length}`,7,`${from} → ${to}：e=${e}，l=${l}，时差=${slack}${slack===0?'，关键活动':''}`,{...state(),activeEdge:[from,to]}));}
    steps.push(snap('critical-done',8,`工期 ${duration}，标记所有零时差活动（允许多条关键路径）`,{...state(),done:true}));return steps;
  }
  function bellmanFord(graph,start){
    const ids=validateGraph(graph,{start,directed:true}),distances=Object.fromEntries(ids.map(id=>[id,Infinity])),previous={};distances[start]=0;let round=0;
    const state=()=>({kind:'graph',graph,distances,previous,round}),steps=[snap('bf-start',1,`初始化源点 ${start} 距离为 0`,state())];
    for(round=1;round<ids.length;round++){
      let changed=false;
      for(const[a,b,w]of graph.edges){const relax=distances[a]!==Infinity&&distances[a]+w<distances[b];if(relax){distances[b]=distances[a]+w;previous[b]=a;changed=true;}steps.push(snap(`bf-${steps.length}`,relax?4:3,`第 ${round} 轮 ${a} → ${b}：${relax?'松弛为 '+distances[b]:'无需更新'}`,{...state(),activeEdge:[a,b]}));}
      if(!changed){steps.push(snap(`bf-${steps.length}`,5,'本轮无更新，提前结束松弛',state()));break;}
    }
    let negativeCycle=false;
    for(const[a,b,w]of graph.edges){if(distances[a]!==Infinity&&distances[a]+w<distances[b])negativeCycle=true;steps.push(snap(`bf-check-${steps.length}`,6,`检查 ${a} → ${b} 是否仍可松弛`,{...state(),activeEdge:[a,b],negativeCycle}));}
    steps.push(snap('bf-done',7,negativeCycle?'发现源点可达的负环，最短路径不成立':'最短路径完成；不可达负环不影响源点结果',{...state(),negativeCycle,done:true}));return steps;
  }
  function representations(graph){
    const ids=validateGraph(graph),matrix=ids.map(()=>ids.map(()=>null)),lists=Object.fromEntries(ids.map(id=>[id,[]]));
    const state=()=>({kind:'adjacency',graph,ids,matrix,lists}),steps=[snap('repr-start',1,'∅ 表示无边，0 保留为零权边',state())];
    for(const[a,b,w]of graph.edges){const i=ids.indexOf(a),j=ids.indexOf(b);matrix[i][j]=w;if(!graph.directed)matrix[j][i]=w;steps.push(snap(`repr-${steps.length}`,2,`写入 ${a} → ${b} 权值 ${w}`,{...state(),active:[i,j]}));}
    for(let i=0;i<ids.length;i++)for(let j=0;j<ids.length;j++){if(matrix[i][j]!==null)lists[ids[i]].push([ids[j],matrix[i][j]]);steps.push(snap(`repr-${steps.length}`,matrix[i][j]===null?3:4,`扫描 [${ids[i]}, ${ids[j]}]：${matrix[i][j]===null?'无边':'追加邻接项'}`,{...state(),active:[i,j]}));}
    steps.push(snap('repr-done',5,'转换完成，保留方向、孤点和零权边',{...state(),done:true}));return steps;
  }
  const api={...original,validateGraph,topological,criticalPath,bellmanFord,representations};
  for(const name of ['bfs','dfs','dijkstra','prim','kruskal','floyd'])api[name]=function(graph,start){
    validateGraph(graph,{...(['bfs','dfs','dijkstra','prim'].includes(name)?{start}:{}),...(name==='dijkstra'?{nonnegative:true}:{}),...(['prim','kruskal'].includes(name)?{directed:false,connected:true}:{})});
    const steps=original[name](graph,start);
    if(name==='floyd'){const last=steps.at(-1);last.state.negativeCycle=last.state.matrix.some((row,i)=>row[i]<0);if(last.state.negativeCycle)last.message='存在负环，受影响路径没有有限最短距离';}
    return steps;
  };
  return api;
});
