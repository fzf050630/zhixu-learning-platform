(function(root,factory){const node=typeof module==='object'&&module.exports;const api=factory(node?require('../algorithms/graph-safe.js'):root.DS.Algorithms.graph);if(node)module.exports=api;root.DS.GraphInput=api;})(globalThis,function(graphAlgorithms){
  'use strict';
  function parse(raw,policy={}){
    try{
      const ids=raw.nodes.trim().split(/[\s,，]+/);
      if(ids.length<1||ids.length>10)throw new Error('支持 1–10 个节点');
      const edges=raw.edges.trim()?raw.edges.trim().split(/[;；\n]+/).filter(line=>line.trim()).map(line=>{
        const parts=line.trim().split(/[\s,，]+/);
        if(parts.length!==3||!/^[-+]?\d+$/.test(parts[2]))throw new Error('边格式：A B 4，每行一条');
        const weight=Number(parts[2]);if(weight < -99||weight>99)throw new Error('边权值范围 −99 到 99');
        return [parts[0],parts[1],weight];
      }):[];
      if(edges.length>20)throw new Error('最多 20 条边');
      const graph={directed:raw.direction==='directed',nodes:ids.map((id,i)=>({id,x:.5+.35*Math.cos(2*Math.PI*i/ids.length-Math.PI/2),y:.47+.32*Math.sin(2*Math.PI*i/ids.length-Math.PI/2)})),edges};
      const start=raw.start?.trim();
      graphAlgorithms.validateGraph(graph,{...policy,...(policy.needsStart?{start}: {})});
      if(policy.needsStart&&!start)throw new Error('请填写起点');
      if(policy.aoe)graphAlgorithms.criticalPath(graph);
      return {ok:true,value:{graph,start}};
    }catch(error){return {ok:false,message:error.message};}
  }
  function config(graph,start,policy={}){
    return {type:'graph',label:'图参数',placeholder:'A B 4',defaultValue:'graph',
      hint:'1–10 个 A–Z 节点；每行一条边：起点 终点 权值（−99…99）；不允许自环/重边。修改节点清单并离开输入框后自动清理关联边；删除起点后需重新填写。点击应用案例才更新演示。'+(policy.connected?'要求无向连通图。':'')+(policy.nonnegative?'权值须非负。':'')+(policy.aoe?'AOE 要求单源单汇 DAG。':''),
      fields:[{name:'nodes',label:'节点清单',defaultValue:graph.nodes.map(n=>n.id).join(' ')},{name:'edges',label:'边清单（每行：A B 4）',type:'textarea',defaultValue:graph.edges.map(e=>e.join(' ')).join('\n')},{name:'direction',label:'方向',type:'select',options:policy.directed===undefined?[{value:'undirected',label:'无向图'},{value:'directed',label:'有向图'}]:[{value:policy.directed?'directed':'undirected',label:policy.directed?'有向图':'无向图'}],defaultValue:graph.directed?'directed':'undirected'},...(policy.needsStart?[{name:'start',label:'起点',defaultValue:start}]:[])],parse:raw=>parse(raw,policy)};
  }
  return {parse,config};
});
