(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(root.DS.Algorithms,node?require('./experiment.js'):root.DS.Experiments,node?require('../assets/js/core/input-validation.js'):root.DS.InputValidation,node?require('../assets/js/core/graph-input.js'):root.DS.GraphInput,node?require('../assets/js/algorithms/graph-safe.js'):root.DS.Algorithms.graph,node?require('../assets/js/algorithms/extra-sort.js'):root.DS.Algorithms.extraSort,node?require('../assets/js/algorithms/string.js'):root.DS.Algorithms.string,node?require('./advanced-tree-experiments.js'):root.DS.AdvancedTreeExperiments,node?require('../assets/js/algorithms/extra-basics.js'):root.DS.Algorithms.extraBasics);
  if(node)module.exports=api;root.DS.Extensions=api;
})(globalThis,function(A,helpers,validation,graphInput,G,sort,string,advanced,extra){
  'use strict';
  const {defineExperiment}=helpers;
  const array=raw=>{const result=validation.parseIntegerArray(raw);if(!result.ok)throw new Error(result.message);return result.value;};
  const integer=(raw,min=-999,max=999)=>{if(!/^[+-]?\d+$/.test(String(raw).trim()))throw new Error('请输入整数');const n=Number(raw);if(n<min||n>max)throw new Error(`整数范围 ${min} 到 ${max}`);return n;};
  const parse=fn=>raw=>{try{return{ok:true,value:fn(raw)};}catch(error){return{ok:false,message:error.message};}};
  const fields=(items,hint,fn)=>({type:'multi',label:'实验参数',defaultValue:'custom',placeholder:'输入参数',fields:items.map(([name,label,defaultValue,type])=>({name,label,defaultValue,type})),hint,parse:parse(fn)});
  const arrayInput=(defaultValue,hint='1–12 个整数，范围 −999 到 999；逗号或空白分隔。',check=x=>x)=>({type:'integer-array',label:'输入序列',placeholder:defaultValue,defaultValue,hint,parse:parse(raw=>check(array(raw)))});
  function treeParse(raw){
    const nodes={};for(const line of raw.nodes.trim().split(/[;；\n]+/)){
      const parts=line.trim().split(/[\s,，]+/);if(parts.length!==3||!parts.every(x=>/^[A-Z]$/.test(x)||x==='-')||parts[0]==='-')throw new Error('每行：节点 左孩子 右孩子；空孩子用 -');
      if(nodes[parts[0]])throw new Error('节点不能重复');nodes[parts[0]]=parts.slice(1).map(x=>x==='-'?null:x);
    }
    if(Object.keys(nodes).length>10)throw new Error('最多 10 个节点');
    const root=raw.root.trim();if(!nodes[root])throw new Error('根节点不存在');const seen=new Set(),visiting=new Set();
    function walk(id){if(id===null)return;if(!nodes[id])throw new Error('孩子节点未定义');if(visiting.has(id))throw new Error('树不能有环');if(seen.has(id))throw new Error('节点不能有多个父节点');visiting.add(id);seen.add(id);nodes[id].forEach(walk);visiting.delete(id);}walk(root);
    if(seen.size!==Object.keys(nodes).length)throw new Error('存在与根不连通的节点');return{root,nodes};
  }
  function enhance(e){
    let change={};
    if(['stack-demo','circular-queue'].includes(e.id)){
      const queue=e.id==='circular-queue',capacity=queue?6:6;
      const operations=raw=>raw.trim()?raw.trim().split(/[\s,，]+/).map(token=>{
        if(token==='peek'||token===(queue?'dequeue':'pop'))return token;
        return integer(token);
      }):[];
      change={input:fields([
        ['initial','初始元素（可留空）',queue?'11,22,33':'14,27'],
        ['capacity',queue?'物理容量（保留一个空槽）':'栈容量',String(capacity)],
        ['operations',queue?'操作：整数入队，dequeue 出队，peek 读队头':'操作：整数入栈，pop 出栈，peek 读栈顶',queue?'44,55,66,dequeue,66,77,dequeue,peek,dequeue,dequeue,dequeue,dequeue,dequeue,88':'39,peek,pop,52','textarea']
      ],'支持空满边界演示；操作最多 30 项。错误操作拒绝执行并保留结构。',raw=>{
        const initial=raw.initial.trim()?array(raw.initial):[],cap=integer(raw.capacity,queue?2:1,8),ops=operations(raw.operations);
        if(initial.length>(queue?cap-1:cap))throw new Error('初始元素超过可用容量');
        if(ops.length>30)throw new Error('操作最多 30 项');
        return{initial,capacity:cap,operations:ops};
      }),inputAdapter:x=>queue?[x.capacity,x.initial,x.operations]:[x.initial,x.operations,x.capacity]};
    }
    const graphNames={bfs:{needsStart:true},dfs:{needsStart:true},prim:{needsStart:true,directed:false,connected:true},kruskal:{directed:false,connected:true},dijkstra:{needsStart:true,nonnegative:true},floyd:{},topological:{directed:true},'critical-path':{directed:true,nonnegative:true,aoe:true}};
    if(graphNames[e.id]){const policy=graphNames[e.id],method=e.id==='critical-path'?'criticalPath':e.id;const [graph,start]=e.preset();change={generator:G[method],input:graphInput.config(graph,start,policy),inputAdapter:input=>policy.needsStart?[input.graph,input.start]:[input.graph]};}
    if(e.id==='binary-search')change={input:fields([['values','非递减数组','7,13,19,28,36,45,57,68'],['target','查找目标','45']],'非递减数组；不会自动排序。重复目标允许返回任一匹配下标。',raw=>{const values=array(raw.values);if(values.some((v,i)=>i&&v<values[i-1]))throw new Error('请按非递减顺序输入');return{values,target:integer(raw.target)};}),inputAdapter:input=>[input.values,input.target]};
    if(e.id==='sequence-insert')change={input:fields([['values','原数组（无需填空槽）','12,28,41,56,65,73,89,97'],['index','插入下标（从 0 开始）','3'],['value','插入值','50']],'原数组最多 11 个整数；下标 0 到数组长度。示例：8 个元素，在下标 3 处插入需后移 5 个元素。',raw=>{const values=array(raw.values);if(values.length>11)throw new Error('原数组最多 11 项');return{values,index:integer(raw.index,0,values.length),value:integer(raw.value)};}),inputAdapter:input=>[[...input.values,null],input.index,input.value]};
    if(e.id==='linked-reverse'||e.id==='bst-insert'||e.id==='huffman'){
      const values=e.preset()[0];change={input:arrayInput(values.join(', '),e.id==='huffman'?'2–8 个正整数权值，最大 999。':e.id==='bst-insert'?'1–12 个整数；重复值插入右子树。':'1–12 个整数；相同值仍是独立节点。',values=>{if(e.id==='huffman'&&(values.length<2||values.length>8||values.some(x=>x<=0)))throw new Error('请输入 2–8 个正整数权值');return values;}),inputAdapter:values=>[[...values]]};
    }
    if(e.id==='hash-chaining')change={input:fields([['values','关键字','19,14,23,1,68,20,56,33,12'],['size','桶数（1–12）','7']],'支持负数，地址采用 ((key % size) + size) % size；示例 9 个关键字、7 个桶，桶 5 出现同义词链。',raw=>({values:array(raw.values),size:integer(raw.size,1,12)})),inputAdapter:input=>[input.values,input.size],code:e.code.map(line=>line.replace('key % H.size','((key % H.size) + H.size) % H.size'))};
    if(['preorder','inorder','postorder','level-order'].includes(e.id))change={input:fields([['root','根节点','A'],['nodes','节点关系（节点 左孩子 右孩子）','A B C\nB D E\nC - F\nD - -\nE - -\nF - -','textarea']],'最多 10 个 A–Z 节点；空孩子写 -；拒绝环、多父节点与孤点。',treeParse),inputAdapter:tree=>e.id==='level-order'?[tree]:[tree,{preorder:'pre',inorder:'in',postorder:'post'}[e.id]]};
    return Object.keys(change).length?defineExperiment({...e,...change}):e;
  }
  const newExperiments=[];
  for(const[id,title,method,code]of[
    ['bubble-sort','冒泡排序','bubbleSort',['// 稳定：只交换严格逆序项','compare(A[j], A[j+1]);','if (A[j]>A[j+1]) swap(A[j],A[j+1]);','// 一趟结束，末项归位','if (!changed) break;','// 排序完成']],
    ['selection-sort','简单选择排序','selectionSort',['// 选择排序通常不稳定','if (A[j]<A[min]) min=j;','swap(A[i], A[min]);','// 继续扫描后缀','// 重复直到有序','// 排序完成']],
    ['shell-sort','希尔排序','shellSort',['// gap=floor(n/2)，逐次减半；不稳定','for (gap=n/2; gap>0; gap/=2)','  key=A[i]; j=i;','  while (j>=gap && A[j-gap]>key) A[j]=A[j-gap],j-=gap;','  A[j]=key;','// 排序完成']]
  ])newExperiments.push(defineExperiment({id,title,chapter:'sort',tag:'比较排序',difficulty:'基础',visualizer:'array',code,generator:sort[method],preset:()=>[[49,38,65,12,27,81,55]],input:arrayInput('49,38,65,12,27,81,55'),inputAdapter:values=>[[...values]],explain:id==='bubble-sort'?{goal:'依次比较相邻元素，使较大者逐趟“冒泡”到区间末尾，最终使序列非递减有序。',inputs:'待排序数组 A[0…n−1]；每趟比较区间逐步缩短。',steps:['从表头开始依次比较相邻两个元素 A[j] 与 A[j+1]。','若 A[j] 大于 A[j+1]（严格逆序），交换两者；相等时不交换以保持稳定。','继续比较下一对相邻元素，一趟结束后本趟最大值沉到区间末尾并归位。','下一趟比较区间缩小一位，已归位的末尾元素不再参与。','若某一趟没有发生任何交换，说明序列已有序，立即提前结束。','重复比较与交换，最坏进行 n−1 趟后序列整体有序。'],keys:['只有严格逆序才交换，冒泡排序<b>稳定</b>。','设置发生交换的标志可在序列已有序时提前结束，最好时间 O(n)。','最坏（逆序）交换次数为 n(n−1)/2，比较次数最坏也是 n(n−1)/2。'],cost:'平均 O(n²) · 最坏 O(n²) · 最好 O(n) · 空间 O(1)'}:id==='selection-sort'?{goal:'每趟从无序区选出最小元素，交换到有序区末尾，最终使整个序列有序。',inputs:'待排序数组 A[0…n−1]；前部为有序区，后部为待排序区。',steps:['把序列分为前部有序区（初始为空）与后部无序区，令 i 从 0 开始。','在 A[i…n−1] 中扫描，用 min 记录最小元素的下标（初值 min=i）。','每遇到 A[j] 小于 A[min] 就更新 min=j；扫描完整个后缀后 min 指向最小值。','交换 A[i] 与 A[min]，把选出的最小元素放到有序区末尾。','有序区扩大一位，i 自增 1，对剩余后缀重复选择与交换。','当 i 到达 n−1 时只剩最后一个元素，必为最大，排序结束。'],keys:['比较次数固定为 n(n−1)/2，与初始序列无关；交换次数最多 n−1 次。','简单选择排序<b>不稳定</b>：例如 5, 5′, 2 交换后两个 5 的相对次序会改变。','时间恒为 O(n²)，空间 O(1)，移动次数少是它的优点。'],cost:'平均 O(n²) · 最坏 O(n²) · 空间 O(1)'}:{goal:'按逐步减小的增量把序列分组，组内做直接插入排序，最后 gap 为 1 时整体基本有序。',inputs:'待排序数组 A[0…n−1]；初始增量 gap=⌊n/2⌋ 并逐次减半。',steps:['取增量 gap=⌊n/2⌋，把相距 gap 的元素划为同一组。','对每个组内元素执行直接插入排序：暂存 key=A[i]，与同组前驱 A[i−gap] 比较。','若 A[j−gap] 大于 key，把前驱后移 gap 位，并令 j 减 gap 继续比较。','当 j 不足 gap 或 A[j−gap] 不大于 key 时停止，把 key 写入 A[j]。','缩小增量 gap=⌊gap/2⌋，对更小的增量重复分组与组内插入。','当 gap=1 时对整个序列做最后一趟直接插入，此时序列已接近有序。','gap 减为 0 后结束，序列整体非递减有序。'],keys:['增量序列决定性能：常用 n/2 逐次减半，最后一步 gap 必须为 1。','分组插入会跨组移动相等元素，希尔排序<b>不稳定</b>。','时间约 O(n^1.3)（依赖增量），最坏 O(n²)，空间 O(1)。'],cost:'平均约 O(n^1.3) · 最坏 O(n²) · 空间 O(1)'}}));
  const bfPreset=()=>({directed:true,nodes:[{id:'A',x:.1,y:.5},{id:'B',x:.38,y:.2},{id:'C',x:.38,y:.8},{id:'D',x:.64,y:.62},{id:'E',x:.64,y:.2},{id:'F',x:.9,y:.5}],edges:[['D','F',4],['E','F',2],['C','D',3],['B','C',-2],['B','D',6],['A','E',6],['A','C',5],['A','B',4],['A','F',20]]});
  newExperiments.push(defineExperiment({id:'bellman-ford',title:'Bellman–Ford 最短路径',chapter:'graph',tag:'负权松弛',difficulty:'进阶',visualizer:'graph',generator:G.bellmanFord,preset:()=>[bfPreset(),'A'],input:graphInput.config(bfPreset(),'A',{directed:true,needsStart:true}),inputAdapter:x=>[x.graph,x.start],explain:{goal:'在含负权边的有向图中求单源最短路径，并检测源点可达的负权环。',inputs:'带权有向图 G 与源点 s；允许负权边，要求边集可枚举。示例为 6 个顶点、9 条弧（含一条负权弧 B→C=−2），按边序需要 3 轮松弛后收敛。',steps:['初始化：源点 dist[s]=0，其余顶点 dist 置为 INF，前驱数组 prev 清空。','进行至多 n−1 轮松弛，每轮按固定次序遍历图中所有边。','对每条边 (u, v, w)，若 dist[u]+w 比 dist[v] 更小，则更新 dist[v] 并令 prev[v]=u。','若某一轮没有发生任何松弛，说明最短路径已收敛，提前退出循环。','n−1 轮结束后，再遍历一次所有边，检查是否仍有边可以松弛。','若存在可松弛的边，说明存在源点<b>可达的负权环</b>，报告 REACHABLE_NEGATIVE_CYCLE。','否则按 prev 数组回溯，输出源点到各顶点的最短路径长度。'],keys:['最短路径最多含 n−1 条边，因此 n−1 轮松弛足够；提前退出可减少无谓遍历。','Bellman–Ford 能处理负权边，而 Dijkstra 不能；负权环会使最短路无下界。','负权环检测必须在 n−1 轮之后额外做一轮松弛判定，只有源点可达的环才能被检出。'],cost:'平均 O(n·m) · 最坏 O(n·m) · 空间 O(n)'},code:['dist[s]=0; others=INF;','for (round=1; round<n; round++)','  for (u,v,w : edges) compare(dist[u]+w,dist[v]);','    if (smaller) dist[v]=dist[u]+w,prev[v]=u;','  if (!changed) break;','check reachable edges for further relaxation;','return distances or REACHABLE_NEGATIVE_CYCLE;']}));
  newExperiments.push(defineExperiment({id:'graph-representations',title:'邻接矩阵与邻接表转换',chapter:'graph',tag:'存储表示',difficulty:'基础',visualizer:'adjacency',generator:G.representations,preset:()=>[G.sampleGraph()],input:graphInput.config(G.sampleGraph(),undefined,{}),inputAdapter:x=>[x.graph],explain:{goal:'把图的邻接矩阵表示转换为邻接表表示，并保持顶点、方向与权值一致。',inputs:'含 n 个顶点、m 条边的图（有向或无向），顶点编号 0 到 n−1。',steps:['初始化 n×n 的邻接矩阵 matrix，所有元素置为 EMPTY 标记。','遍历每条边 (u, v, w)，令 matrix[u][v]=w；无向图同时令 matrix[v][u]=w。','初始化 n 个顶点的邻接表 lists，每个表头指向空链表。','按行号 i 从小到大、列号 j 从小到大扫描邻接矩阵。','若 matrix[i][j] 不为 EMPTY，则在 lists[i] 末尾追加表结点 (j, matrix[i][j])。','扫描完所有元素后得到等价邻接表；孤点保留空表，零权边与方向信息一并保留。'],keys:['邻接矩阵空间 O(n²) 适合稠密图；邻接表空间 O(n+m) 适合稀疏图，表示不唯一。','矩阵中必须区分「零权边」与「无边」，否则转换时会丢失零权边。','有向图 matrix[i][j] 表示弧 i→j；无向图矩阵对称，可只存上三角。'],cost:'时间 O(n²+m) · 空间 O(n²)（矩阵）/ O(n+m)（邻接表）'},code:['matrix=EMPTY; lists=empty;','for (u,v,w : edges) matrix[u][v]=w;','for (i=0;i<n;i++) for(j=0;j<n;j++)','  if (matrix[i][j]!=EMPTY) append(list[i],j,matrix[i][j]);','// 保留孤点、方向和零权边']}));
  newExperiments.push(defineExperiment({id:'kmp',title:'KMP 字符串匹配',chapter:'search',tag:'前缀回退',difficulty:'进阶',visualizer:'string',generator:string.kmp,preset:()=>['abababacaba','ababaca'],input:fields([['text','主串','abababacaba'],['pattern','模式串','ababaca']],'可打印 ASCII；主串最多 32 字符，模式 1–16 字符；下标从 0 开始，返回首次匹配。',raw=>{if(raw.text.length>32||!raw.pattern.length||raw.pattern.length>16||!/^[\x20-\x7e]*$/.test(raw.text)||!/^[\x20-\x7e]+$/.test(raw.pattern))throw new Error('主串需 0–32 个 ASCII 字符，模式需 1–16 个');return{...raw};}),inputAdapter:x=>[x.text,x.pattern],explain:{goal:'利用模式串自身的部分匹配信息，在主串中快速定位模式串首次出现的位置。',inputs:'主串 text（长 n）与模式串 pattern（长 m），下标从 0 开始。',steps:['构造 pi 表：pi[0]=0，令 i 从 1 到 m−1 逐个计算 pi[i]。','计算 pi[i] 时先令 j=pi[i−1]，若 p[i] 与 p[j] 不等则反复令 j=pi[j−1] 回退，直到 j=0 或字符相等。','若 p[i] 与 p[j] 相等则 j 自增，令 pi[i]=j，pi[i] 表示子串 p[0…i] 的最长相等真前后缀长度。','匹配开始：主串指针 i=0、模式串指针 j=0，两串都从首位比较。','逐位比较 text[i] 与 p[j]；若失配且 j 大于 0，则令 j=pi[j−1] 回退，主串指针不动。','若字符相等则 i、j 同时后移；当 j 达到 m 时匹配成功，返回起始下标 i−m+1。','若主串扫描完毕仍有 j 小于 m，返回 −1 表示匹配失败。'],keys:['失配时主串指针不回溯，模式串沿 pi 表跳到下一个可能匹配的位置，这是 KMP 的核心。','pi[i] 取最长相等真前后缀长度，不能取整个子串本身；回退必须用 while 反复进行。','匹配阶段通常写成 j 等于 0 或字符相等则前进，否则 j=pi[j−1]、i 不动。','时间 O(n+m)，空间 O(m)。'],cost:'平均 O(n+m) · 最坏 O(n+m) · 空间 O(m)'},code:['pi[0]=0;','for (i=1;i<m;i++) j=pi[i-1];','  while (j>0 && p[i]!=p[j]) j=pi[j-1];','  if(p[i]==p[j]) j++; pi[i]=j;','j=0; // 开始匹配','for(i=0;i<n;i++) compare(text[i],p[j]);','  while(j>0 && text[i]!=p[j]) j=pi[j-1];','  if(text[i]==p[j]) j++;','  if(j==m) return i-m+1;','return -1;']}));
  const crossPreset=()=>({directed:true,nodes:[{id:'A',x:.1,y:.5},{id:'B',x:.34,y:.2},{id:'C',x:.34,y:.8},{id:'D',x:.62,y:.3},{id:'E',x:.62,y:.75},{id:'F',x:.9,y:.5}],edges:[['A','B',4],['A','C',5],['B','C',-2],['B','D',6],['C','D',3],['C','E',2],['D','F',4],['E','F',1]]});
  const maxHeapCheck=values=>values.every((x,i)=>{const l=2*i+1,r=2*i+2;return(l>=values.length||x>=values[l])&&(r>=values.length||x>=values[r]);});
  const asciiInput=()=>fields([['text','主串','ababcabcacbab'],['pattern','模式串','abcac']],'可打印 ASCII；主串最多 32 字符，模式 1–16 字符；下标从 0 开始。',raw=>{if(raw.text.length>32||!raw.pattern.length||raw.pattern.length>16||!/^[\x20-\x7e]*$/.test(raw.text)||!/^[\x20-\x7e]+$/.test(raw.pattern))throw new Error('主串需 0–32 个 ASCII 字符，模式需 1–16 个');return{...raw};});
  const parseOperationList=(raw,max)=>{
    const tokens=raw.split(/[;；\n,，]+/).map(token=>token.trim()).filter(Boolean);
    if(!tokens.length||tokens.length>max)throw new Error(`请输入 1–${max} 项操作`);
    return tokens;
  };
  newExperiments.push(defineExperiment({id:'sequence-reverse',title:'顺序表就地逆置',chapter:'linear',tag:'双指针交换',difficulty:'基础',visualizer:'array',generator:extra.sequenceReverse,preset:()=>[[49,38,65,12,27,81,55,73]],input:arrayInput('49, 38, 65, 12, 27, 81, 55, 73'),inputAdapter:values=>[[...values]],explain:{goal:'把顺序表就地逆置，使元素次序完全反转且不使用额外的顺序表。',inputs:'顺序表 L（长度 n），支持按下标随机存取。示例为 8 个元素，需进行 4 对首尾交换。',steps:['令左指针 i=0 指向表头，右指针 j=n−1 指向表尾。','判断 i 是否小于 j；若不成立说明两端已相遇或交错，逆置完成。','把左端元素 L.data[i] 暂存到临时变量 temp。','把右端元素 L.data[j] 写入左端位置 L.data[i]。','把暂存的 temp 写回右端位置 L.data[j]，完成一对交换。','令 i 自增 1、j 自减 1，向中间收缩，重复判断与交换。','当 i 不小于 j 时停止，顺序表就地逆置完毕。'],keys:['循环条件必须是 i 小于 j；若允许两端相等，中间元素会与自己交换。','只需遍历前一半元素，时间 O(n)，额外空间 O(1)。','必须就地完成，选用额外数组尽管简单但空间不再是 O(1)。'],cost:'时间 O(n) · 空间 O(1)'},code:[
    'void Reverse(SqList &L) {',
    '  for (int i = 0, j = L.length - 1; i < j; i++, j--) {',
    '    ElemType temp = L.data[i];       // 暂存左端元素',
    '    L.data[i] = L.data[j];           // 右端元素移到左端',
    '    L.data[j] = temp;                // 左端元素移到右端',
    '  }                                  // i≥j 时全部就位',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'sequence-delete-min',title:'顺序表删除最小元素',chapter:'linear',tag:'末位填补',difficulty:'基础',visualizer:'array',generator:extra.sequenceDeleteMin,preset:()=>[[49,38,65,12,27,81,55,73]],input:arrayInput('49, 38, 65, 12, 27, 81, 55, 73'),inputAdapter:values=>[[...values]],explain:{goal:'删除顺序表中最小的元素，并用引用参数带回它的值。',inputs:'顺序表 L 及引用参数 e；元素可比较大小。示例为 8 个元素，需扫描 7 次比较才能确定最小值。',steps:['若表长 n=0，说明是空表，无法删除，直接返回 false。','令 min=0，把第一个元素暂定为最小值。','从 i=1 开始逐个比较 L.data[i] 与 L.data[min]。','若 L.data[i] 更小则更新 min=i，遍历结束后 min 指向最小元素。','把 L.data[min] 赋给引用参数 e，带回被删元素的值。','用表尾元素 L.data[n−1] 填补 min 位置，再把表长减 1。','返回 true；填补后剩余元素的相对次序可能改变。'],keys:['空表必须单独判断并返回失败，否则访问 L.data[0] 会越界。','用末位元素填补被删位置，删除本身只需 O(1)；若要求保持相对次序则需搬移元素，时间 O(n)。','比较用严格小于，多个相同最小值时删除的是最先出现的一个。'],cost:'时间 O(n) · 空间 O(1)'},code:[
    'bool DelMin(SqList &L, ElemType &e) {',
    '  if (L.length == 0) return false;',
    '  int min = 0;',
    '  for (int i = 1; i < L.length; i++)',
    '    if (L.data[i] < L.data[min]) min = i;',
    '  e = L.data[min];',
    '  L.data[min] = L.data[L.length - 1];',
    '  L.length--;',
    '  return true;',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'linked-head-insert',title:'头插法建立单链表',chapter:'linear',tag:'头插法',difficulty:'基础',visualizer:'linked',generator:extra.linkedHeadInsert,preset:()=>[[8,17,26,39,52,67]],input:arrayInput('8, 17, 26, 39, 52, 67','1–12 个整数；依次头插后新链表与输入顺序相反。示例为 6 个结点。'),inputAdapter:values=>[[...values]],explain:{goal:'用头插法把数组元素依次插入链表头部，建立一个单链表。',inputs:'元素数组 a[0…n−1]；结果链表可不带头结点。示例为 6 个元素，头插后链表恰为输入的逆序。',steps:['初始化空链表头指针 head=NULL。','取数组第 i 个元素，申请新结点 p，置 p->data=a[i]。','令新结点 p->next 指向当前表首 head。','令 head=p，新结点成为新的表首。','令 i 自增 1，重复申请结点与头插，直到 n 个元素全部处理完。','返回 head；链表中结点次序与输入顺序相反。'],keys:['头插逆序、尾插保序；两种建表方法的时间都是 O(n)。','每次头插只需修改两个指针，单次 O(1)，无需遍历链表。','head 始终指向最新插入的结点，循环结束后它就是最终表首。'],cost:'时间 O(n) · 空间 O(n)'},code:[
    'LinkList HeadInsert(ElemType a[], int n) {',
    '  LinkList head = NULL;                // 空表',
    '  for (int i = 0; i < n; i++) {',
    '    LNode *p = new LNode(a[i]);        // 申请新结点',
    '    p->next = head;                    // 新结点指向原表首',
    '    head = p;                          // head 移到新结点',
    '  }',
    '  return head;                         // 结果为输入序列的逆序',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'linked-merge',title:'合并两个有序单链表',chapter:'linear',tag:'双指针摘链',difficulty:'进阶',visualizer:'linked',generator:extra.linkedMerge,preset:()=>[[1,4,9,16],[2,3,7,11]],input:fields([['left','链表 A（非递减）','1, 4, 9, 16'],['right','链表 B（非递减）','2, 3, 7, 11']],'两条链表均须非递减；每表最多 12 项；合并后仍非递减且保持稳定。',raw=>{const left=array(raw.left),right=array(raw.right);const sorted=x=>x.every((v,i)=>!i||v>=x[i-1]);if(!sorted(left)||!sorted(right))throw new Error('请按非递减顺序输入两条链表');return{left,right};}),inputAdapter:input=>[input.left,input.right],explain:{goal:'把两条非递减有序单链表合并为一条非递减有序单链表。',inputs:'两条带头结点的非递减单链表 A、B；元素可比较大小。',steps:['令 pa、pb 分别指向 A、B 的第一个数据结点，复用 A 的头结点作为结果链表 C，尾指针 r=C。','当 pa 与 pb 都非空时，比较 pa->data 与 pb->data。','若 pa->data 不大于 pb->data，把 pa 结点摘接到 r 之后，pa 后移一位。','否则把 pb 结点摘接到 r 之后，pb 后移一位。','令 r 后移到新接入的结点，保持 r 是结果链表的尾结点。','当一条链表先遍历完，把另一条的剩余结点整体挂到 r->next。','返回结果链表 C，全部结点按非递减有序。'],keys:['相等时取 A 的结点（用不大于判断），合并保持<b>稳定</b>。','合并只改指针不复制结点，空间 O(1)；注意摘链、接链顺序，防止断链。','剩余段必须整体接入，不能逐个结点重新遍历，否则时间变差。'],cost:'时间 O(n+m) · 空间 O(1)'},code:[
    'LinkList Merge(LinkList A, LinkList B) {',
    '  LNode *pa = A->next, *pb = B->next, *r;',
    '  LinkList C = A;  r = C;              // 复用 A 的头结点',
    '  while (pa && pb) {',
    '    if (pa->data <= pb->data) {',
    '      r->next = pa; pa = pa->next;     // 摘 A 结点尾插',
    '    } else {',
    '      r->next = pb; pb = pb->next;     // 摘 B 结点尾插',
    '    }',
    '    r = r->next;',
    '  }',
    '  r->next = pa ? pa : pb;              // 剩余段整体接入',
    '  return C;',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'josephus',title:'约瑟夫环',chapter:'linear',tag:'循环链表',difficulty:'进阶',visualizer:'linked',generator:extra.josephus,preset:()=>[[1,2,3,4,5,6,7],3],input:fields([['values','人员编号（围成环）','1, 2, 3, 4, 5, 6, 7'],['m','报数 m','3']],'编号最多 12 个；m 为 1–99 的正整数；最后给出完整出列序列。',raw=>({values:array(raw.values),m:integer(raw.m,1,99)})),inputAdapter:input=>[input.values,input.m],explain:{goal:'用循环链表模拟约瑟夫环，按固定步长 m 逐个出列并得到出列序列。',inputs:'n 个按序排列的编号构成循环链表；报数步长 m 为正整数。',steps:['把 n 个结点建成循环链表，令 p 指向当前报数结点，pre 指向其前驱。','令报数计数器 count=0，从当前结点开始报数。','每轮令 count 自增 1；若 count 小于 m，则 p 沿环后移到下一个结点继续报数。','当 count 达到 m 时，p 所指结点出列：令 pre->next=p->next 摘除 p，访问并释放 p。','出列后令 count=0、剩余人数 n 减 1。','令 p=pre->next，从出列者的后继继续报数。','重复报数与出列，直到 n=0，输出完整的出列序列。'],keys:['循环链表让报数到尾后可自然绕回表头，无需对下标取模。','摘除 p 后必须从 p 的后继继续报数，计数器清零，否则会错位或漏数。','只剩一个结点时 pre 与 p 可能指向同一结点，需保证摘除逻辑仍正确。','时间 O(n·m)，空间 O(n)。'],cost:'时间 O(n·m) · 空间 O(n)'},code:[
    'void Josephus(LinkList L, int n, int m) {',
    '  LNode *p = L, *pre = L->prior;   // 循环链表：pre 是 p 的前驱',
    '  int count = 0;',
    '  while (n > 0) {',
    '    if (++count < m) { p = p->next; continue; }  // 报数并前移',
    '    // 报数到 m，p 出列',
    '    pre->next = p->next;           // 摘除 p 并接上后继',
    '    visit(p); free(p); count = 0; n--;',
    '    p = pre->next;                 // 从后继继续报数',
    '  }                                // 环空即结束',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'shared-stack',title:'共享栈',chapter:'stack-queue',tag:'两端增长',difficulty:'基础',visualizer:'stack',generator:extra.sharedStack,preset:()=>[8,['push0 12','push1 41','push0 25','push1 58','push0 36','push1 67','push0 74','push1 82','push0 91','pop1','pop0','push1 95','push0 66','push1 77','pop0','pop1']],input:fields([['capacity','容量（2–8）','8'],['operations','操作序列','push0 12, push1 41, push0 25, push1 58, push0 36, push1 67, push0 74, push1 82, push0 91, pop1, pop0, push1 95, push0 66, push1 77, pop0, pop1','textarea']],'操作：push0 x / push1 x 入栈，pop0 / pop1 出栈；逗号或换行分隔，最多 30 项。判满条件 top1+1==top0。',raw=>{const capacity=integer(raw.capacity,2,8);const operations=parseOperationList(raw.operations,30);operations.forEach(token=>{const match=/^(push0|push1|pop0|pop1)(?:\s+([-+]?\d+))?$/.exec(token);if(!match)throw new Error('无法识别的操作：'+token);if(match[1].startsWith('push')&&match[2]===undefined)throw new Error('入栈操作需要数值：'+token);if(match[1].startsWith('pop')&&match[2]!==undefined)throw new Error('出栈操作不需要数值：'+token);if(match[2]!==undefined)integer(match[2],-999,999);});return{capacity,operations};}),inputAdapter:input=>[input.capacity,input.operations],explain:{goal:'用一段数组实现两个共享栈，栈 0 从低端向右增长、栈 1 从高端向左增长，最大化空间利用率。',inputs:'容量为 MAXSIZE 的数组；约定空栈 0 为 top0=0，空栈 1 为 top1=MAXSIZE−1。示例 MAXSIZE=8，两栈各入栈到接近相遇后判满。',steps:['入栈前判满：仅当 top0 等于 top1+1（两栈顶相邻）时栈满，拒绝入栈。','栈 0 入栈：把 x 写入 S.data[top0]，再令 top0 自增 1；栈 0 逐步逼近数组中部。','栈 1 入栈：先令 top1 自减 1，再把 x 写入 S.data[top1]；栈 1 从高端向左逼近。','栈 0 出栈：若 top0=0 则栈空拒绝；否则先令 top0 自减再取出 S.data[top0]。','栈 1 出栈：若 top1=MAXSIZE−1 则栈空拒绝；否则先令 top1 自增再取出 S.data[top1]。','重复执行操作序列；只有两栈顶相邻（top0=top1+1）时才真正“撞满”，其余情况都可继续入栈。'],keys:['判满条件是 top0 等于 top1+1（相邻），不能写成 top0 等于 top1。','入栈与出栈对栈顶指针的更新顺序相反：栈 0 先写入后移指针，栈 1 先移指针后写入。','共享栈适合两栈需求此消彼长的场景，任一栈的入栈都可能加剧整体空间的紧张。'],cost:'单次操作 O(1) · 空间 O(MAXSIZE)'},code:[
    'void Push(SqStack &S, int i, ElemType x) {',
    '  if (S.top0 == S.top1 + 1) return FULL;  // 判满：top1+1==top0',
    '  if (i == 0) S.data[S.top0++] = x;       // 栈 0 向右增长',
    '  else S.data[S.top1--] = x;              // 栈 1 向左增长',
    '}',
    'void Pop(SqStack &S, int i) {',
    '  if (i == 0) { if (S.top0 == 0) return; S.data[--S.top0] = EMPTY; }',
    '  else { if (S.top1 == MAXSIZE - 1) return; S.data[++S.top1] = EMPTY; }',
    '}',
    '// 空栈 0：top0==0；空栈 1：top1==MAXSIZE-1'
  ]}));
  newExperiments.push(defineExperiment({id:'deque',title:'双端队列',chapter:'stack-queue',tag:'受限操作',difficulty:'基础',visualizer:'queue',generator:extra.dequeDemo,preset:()=>[7,[11,22,33],['pushFront 44','pushBack 55','pushFront 66','pushBack 77','pushBack 88','popFront','popBack','pushFront 88','popBack','popFront','pushBack 99','popFront','popBack']],input:fields([['capacity','容量（2–8）','7'],['initial','初始元素（可留空）','11, 22, 33'],['operations','操作序列','pushFront 44, pushBack 55, pushFront 66, pushBack 77, pushBack 88, popFront, popBack, pushFront 88, popBack, popFront, pushBack 99, popFront, popBack','textarea']],'操作：pushFront x / pushBack x / popFront / popBack；最多 30 项；用 size 计数可装满。示例容量 7，两端入队/出队各 3 次并演示队满。',raw=>{const capacity=integer(raw.capacity,2,8);const initial=raw.initial.trim()?array(raw.initial):[];if(initial.length>capacity)throw new Error('初始元素超过容量');const operations=parseOperationList(raw.operations,30);operations.forEach(token=>{const match=/^(pushFront|pushBack|popFront|popBack)(?:\s+([-+]?\d+))?$/.exec(token);if(!match)throw new Error('无法识别的操作：'+token);if(match[1].startsWith('push')&&match[2]===undefined)throw new Error('入队操作需要数值：'+token);if(match[1].startsWith('pop')&&match[2]!==undefined)throw new Error('出队操作不需要数值：'+token);if(match[2]!==undefined)integer(match[2],-999,999);});return{capacity,initial,operations};}),inputAdapter:input=>[input.capacity,input.initial,input.operations],explain:{goal:'用循环数组实现双端队列，两端都可插入与删除，并正确处理队空队满。',inputs:'容量为 capacity 的数组与 size 计数器；front 指向队头，rear 指向队尾的下一次写入位置。示例 capacity=7，两端入队、两端出队各演示 3 次并触发一次队满。',steps:['所有插入操作先判满：仅当 size 等于 capacity 时返回 FULL，拒绝操作。','前插 pushFront：先令 front 环移到前一格 (front−1+capacity) mod capacity，再写入 x，最后 size 加 1。','后插 pushBack：先把 x 写入 data[rear]，再令 rear 环移到 (rear+1) mod capacity，最后 size 加 1。','所有删除操作先判空：仅当 size 等于 0 时返回 EMPTY，拒绝操作。','前删 popFront：先读出 data[front]，再令 front 环移到 (front+1) mod capacity，最后 size 减 1。','后删 popBack：先令 rear 环移到 (rear−1+capacity) mod capacity，再读出 data[rear]，最后 size 减 1。','重复执行操作；size 计数器同时区分队空与队满，capacity 个位置可全部用满。'],keys:['前插与后删都需要先把指针环移再读写；后插与前删则先读写再环移，顺序不能颠倒。','用 size 计数即可装满整个数组，无需像循环队列那样保留一个空槽。','环移公式为 (i−1+capacity) mod capacity 与 (i+1) mod capacity，负号情况要加 capacity 修正。'],cost:'单次操作 O(1) · 空间 O(capacity)'},code:[
    'void DequeDemo(Deque &D) {        // 数组实现，用 size 计数',
    '  PushFront: if (size == capacity) return FULL;',
    '    front = (front - 1 + capacity) % capacity; data[front] = x; size++;',
    '  PushBack: if (size == capacity) return FULL;',
    '    data[rear] = x; rear = (rear + 1) % capacity; size++;',
    '  PopFront: if (size == 0) return EMPTY;',
    '    x = data[front]; front = (front + 1) % capacity; size--;',
    '  PopBack: if (size == 0) return EMPTY;',
    '    rear = (rear - 1 + capacity) % capacity; x = data[rear]; size--;',
    '  // 判空 size==0；判满 size==capacity',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'threaded-tree',title:'中序线索二叉树',chapter:'tree',tag:'线索化',difficulty:'进阶',visualizer:'tree',generator:extra.threadedTree,preset:()=>[{root:'A',nodes:{A:['B','C'],B:['D','E'],C:['F','G'],D:['H',null],E:[null,'I'],F:[null,null],G:[null,null],H:[null,null],I:[null,null]}}],input:fields([['root','根节点','A'],['nodes','节点关系（节点 左孩子 右孩子）','A B C\nB D E\nC F G\nD H -\nE - I\nF - -\nG - -\nH - -\nI - -','textarea']],'最多 10 个 A–Z 节点；空孩子写 -；带 * 的结点表示空指针已改造成线索。',treeParse),inputAdapter:tree=>[tree],explain:{goal:'按中序遍历把二叉树中的空指针改造为指向前驱或后继的线索，得到中序线索二叉树。',inputs:'二叉树根结点 root；空指针用 NULL 表示，线索标记为 ltag/rtag。示例为 9 个结点，中序序列首结点 H 无前驱、末结点 G 无后继，首尾线索保持 NULL。',steps:['从根出发按中序顺序线索化，先递归处理当前结点 p 的左子树。','回到 p 后，若 p 的左指针为空，则令它指向<b>中序前驱</b> pre，并置 ltag=1。','若前驱 pre 非空且其右指针为空，则令 pre 的右指针指向 p（后继），并置 rtag=1。','令 pre=p，使 pre 始终记录刚访问过的结点，即下一个结点的前驱。','递归线索化 p 的右子树，重复上述空指针改造。','遍历结束时所有空指针都变成线索，非空孩子指针保持原样（tag 为 0）。'],keys:['只改造空指针：左空指针指前驱、右空指针指后继，非空孩子指针绝不能被覆盖。','线索化必须按中序顺序进行，pre 初值必须为 NULL，否则第一条左线索会写错。','判断真孩子与线索要看 ltag/rtag，不能直接沿指针继续遍历，否则会沿线索绕成环。'],cost:'时间 O(n) · 空间 O(h)（递归栈）'},code:[
    'void InThread(ThreadTree &p, ThreadTree &pre) {',
    '  if (p != NULL) {',
    '    InThread(p->lchild, pre);           // 先线索化左子树',
    '    if (p->lchild == NULL) {            // 左空指针改指前驱',
    '      p->lchild = pre; p->ltag = 1;',
    '    }',
    '    if (pre != NULL && pre->rchild == NULL) {',
    '      pre->rchild = p; pre->rtag = 1;   // 前驱的右空指针改指 p',
    '    }',
    '    pre = p;                            // pre 后移',
    '    InThread(p->rchild, pre);',
    '  }',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'bst-search',title:'二叉排序树查找',chapter:'search',tag:'逐层比较',difficulty:'基础',visualizer:'tree',generator:extra.bstSearch,preset:()=>[[45,24,53,12,37,93,30],30],input:fields([['values','关键字序列','45, 24, 53, 12, 37, 93, 30'],['target','查找目标','30']],'1–12 个互不相同的整数；先按插入顺序建 BST，再演示查找路径。',raw=>{const values=array(raw.values);if(new Set(values).size!==values.length)throw new Error('关键字需互不相同');return{values,target:integer(raw.target)};}),inputAdapter:input=>[input.values,input.target],explain:{goal:'在二叉排序树中按关键字大小逐层下降，查找目标关键字。',inputs:'二叉排序树 T 与目标关键字 key；树中关键字互不相同。',steps:['令当前结点指向树根 T。','若 T 为空，说明查找失败，返回 NULL。','比较 key 与当前结点关键字 T->key。','若相等则查找成功，返回该结点。','若 key 更小，则进入左子树继续查找。','若 key 更大，则进入右子树继续查找。','沿树逐层下降，直到命中或到达空指针，比较次数不超过树高。'],keys:['查找路径唯一：每比较一次排除一棵子树，非递归实现可用 while 循环，空间 O(1)。','平均查找长度 O(log n)；当插入有序序列退化为单支树时最坏为 O(n)。','二叉排序树的中序遍历序列递增，因此按中序即可验证树结构。'],cost:'平均 O(log n) · 最坏 O(n) · 空间 O(1)'},code:[
    'BSTNode *Search(BSTree T, Key key) {',
    '  while (T != NULL) {',
    '    if (key == T->key) return T;        // 查找成功',
    '    if (key < T->key)',
    '      T = T->lchild;                    // 进入左子树',
    '    else',
    '      T = T->rchild;                    // 进入右子树',
    '  }',
    '  return NULL;                          // 查找失败',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'bst-delete',title:'二叉排序树删除',chapter:'search',tag:'三种情形',difficulty:'进阶',visualizer:'tree',generator:extra.bstDelete,preset:()=>[[45,24,53,12,37,93,30],[30,53,24]],input:fields([['values','关键字序列','45, 24, 53, 12, 37, 93, 30'],['targets','删除关键字（逗号分隔）','30, 53, 24']],'1–12 个互不相同的整数；依次删除，依次演示叶子、单孩子、双孩子（中序后继替换）三种情形。',raw=>{const values=array(raw.values);if(new Set(values).size!==values.length)throw new Error('关键字需互不相同');const targets=array(raw.targets);if(new Set(targets).size!==targets.length)throw new Error('删除关键字不能重复');if(targets.some(t=>!values.includes(t)))throw new Error('删除关键字必须都存在于序列中');return{values,targets};}),inputAdapter:input=>[input.values,input.targets],explain:{goal:'在二叉排序树中删除指定关键字，用中序后继替换并保持有序性。',inputs:'二叉排序树 T 与待删关键字 key；若关键字不存在则不做修改。',steps:['从根开始查找 key，用 parent 记录父结点；若走到空指针说明不存在，直接返回。','情形一：被删结点 p 是叶子，直接摘除 p，并把父结点的相应孩子指针置空。','情形二：p 只有一个孩子，让该孩子直接顶替 p 的位置，再释放 p。','情形三：p 同时有左右孩子，在 p 的右子树中一路向左找到中序后继 s（右子树最小结点）。','用 s 的关键字覆盖 p 的关键字，保持二叉排序树的中序有序性。','删除替身结点 s：s 至多只有右孩子，按情形一或情形二摘除。','若被删结点是根，更新整棵树的根指针；删除后仍满足二叉排序树性质。'],keys:['双孩子结点不能直接删除，必须先用中序前驱或中序后继替换其关键字。','中序后继是右子树最左结点，至多有一个右孩子，因此替换后的删除必然简单。','删除根结点要单独维护根指针，否则整棵树会失去引用。'],cost:'平均 O(log n) · 最坏 O(n) · 空间 O(1)'},code:[
    'void DeleteBST(BSTree &T, Key key) {',
    '  BSTNode *p = T, *parent = NULL;',
    '  while (p != NULL && p->key != key) {',
    '    parent = p;',
    '    p = key < p->key ? p->lchild : p->rchild;',
    '  }',
    '  if (p == NULL) return;                 // 树中不存在该关键字',
    '  if (p->lchild == NULL && p->rchild == NULL) {',
    '    replace(p, NULL);                    // 情形一：叶子直接删除',
    '  } else if (p->lchild == NULL || p->rchild == NULL) {',
    '    child = p->lchild ? p->lchild : p->rchild;',
    '    replace(p, child);                   // 情形二：孩子顶替',
    '  } else {',
    '    s = p->rchild; while (s->lchild) s = s->lchild;',
    '    p->key = s->key;                     // 情形三：中序后继覆盖',
    '    deleteNode(s);                       // 后继至多一个右孩子',
    '  }',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'heap-insert',title:'大根堆插入与上调',chapter:'sort',tag:'向上调整',difficulty:'基础',visualizer:'array',generator:extra.heapInsertMany,preset:()=>[[95,53,78,17,45,65,12],[82,50]],input:fields([['values','初始大根堆（层序）','95, 53, 78, 17, 45, 65, 12'],['inserts','插入值序列（依次插入）','82, 50']],'层序输入且必须已是大根堆（父结点不小于孩子）；插入值 −999 到 999，逗号分隔，按顺序依次插入。示例先插入 82（连续上浮），再插入 50（无需上浮）。',raw=>{const values=array(raw.values);if(!maxHeapCheck(values))throw new Error('输入序列不是合法的大根堆（父结点须不小于孩子）');return{values,inserts:array(raw.inserts)};}),inputAdapter:input=>[input.values,input.inserts],explain:{goal:'向大根堆中依次插入新关键字，通过向上调整恢复大根堆性质。',inputs:'已满足大根堆性质的层序数组 A[0…n−1]，以及待插入值序列。示例初始 7 个元素，连续插入 82、50 后得到 9 个元素的大根堆。',steps:['把新关键字追加到数组末尾 A[n]，令 i=n 并令 n 自增 1，保持完全二叉树形态。','若 i 大于 0，计算双亲下标 parent=⌊(i−1)/2⌋。','比较 A[i] 与 A[parent]：若不大于双亲，说明已满足大根堆，立即停止。','若大于双亲，则交换 A[i] 与 A[parent]，并令 i=parent 继续向上比较。','重复比较与交换，新元素沿祖先路径逐层上浮；示例中 82 连续上浮两层。','第二个插入值 50 不大于其双亲，一次比较即停止，说明插入不一定都会上浮。','两个元素依次插入完毕，堆元素个数从 7 增到 9，仍满足大根堆性质。'],keys:['插入只能在表尾追加，保证堆仍是一棵完全二叉树，不会破坏结构性质。','新元素只可能向上移动，调整代价与树高同阶，即 O(log n)。','判定停止用「不大于双亲」而非「小于」，相等时不交换可减少移动次数。','连续插入时每次插入都要独立执行一次「追加 + 上浮」过程。'],cost:'单次插入 O(log n) · 空间 O(1)'},code:[
    'void HeapInsert(int A[], int &n, Key key) {',
    '  A[n] = key;  int i = n++;             // 追加到表尾',
    '  while (i > 0) {',
    '    int parent = (i - 1) / 2;',
    '    if (A[i] <= A[parent]) break;       // 已满足大根堆',
    '    swap(A[i], A[parent]);              // 与双亲交换并上浮',
    '    i = parent;',
    '  }',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'radix-sort',title:'基数排序',chapter:'sort',tag:'分配收集',difficulty:'进阶',visualizer:'array',generator:extra.radixSort,preset:()=>[[49,38,65,12,27,81,55]],input:arrayInput('49, 38, 65, 12, 27, 81, 55','0–999 的整数，最多 12 个；按个位→十位→百位从低到高分配收集。',values=>{if(values.some(x=>x<0||x>999))throw new Error('基数排序要求 0–999 的整数');return values;}),inputAdapter:values=>[[...values]],explain:{goal:'按最低位优先（LSD）逐位分配与收集，把整数序列排成非递减有序。',inputs:'0–999 的非负整数数组 A；每位取值范围 0–9，共 d 位。',steps:['从最低位（个位）开始，依次对每一位做一趟分配与收集。','每趟先清空 10 个桶的计数器 count[0…9]。','顺序扫描数组，统计当前位上数字为 k 的元素个数，存入 count[k]。','对 count 做前缀和 count[k]+=count[k−1]，count[k] 变成该位数字不大于 k 的元素总数。','逆序扫描数组，对每个元素计算当前位数字 k，令 temp[--count[k]]=A[i]，把元素放入对应桶的尾部。','把辅助数组 temp 中整趟的结果复制回原数组 A。','继续处理更高位并重复分配收集；所有位处理完后数组有序。'],keys:['必须从低位到高位；每趟分配从后向前扫描，才能保证同桶元素相对次序不变、排序稳定。','前缀和把计数值变成桶尾下标，再自减即得元素落点，是分配式排序的常用技巧。','时间 O(d(n+r))、空间 O(n+r)，d 为位数、r 为基数（本实验 r=10），适合位数少、范围小的整数。'],cost:'时间 O(d(n+r)) · 空间 O(n+r)'},code:[
    'void RadixSort(int A[], int n) {',
    '  for (int d = 0; d < digits; d++) {     // LSD：从低位到高位',
    '    int count[10] = {0};',
    '    for (i = 0; i < n; i++) count[digit(A[i], d)]++;',
    '    for (k = 1; k < 10; k++) count[k] += count[k - 1];',
    '    for (i = n - 1; i >= 0; i--)         // 逆序遍历保证稳定',
    '      temp[--count[digit(A[i], d)]] = A[i];',
    '    for (i = 0; i < n; i++) A[i] = temp[i];  // 收集回原数组',
    '  }',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'counting-sort',title:'计数排序',chapter:'sort',tag:'计数定位',difficulty:'基础',visualizer:'array',generator:extra.countingSort,preset:()=>[[4,7,2,4,1,7,4,0]],input:arrayInput('4, 7, 2, 4, 1, 7, 4, 0','关键字取 0–9 的整数，最多 12 个；重复值用于演示稳定性。',values=>{if(values.some(x=>x<0||x>9))throw new Error('计数排序演示要求 0–9 的整数');return values;}),inputAdapter:values=>[[...values]],explain:{goal:'统计每个关键字出现的次数并计算前缀和，直接确定每个元素的最终位置。',inputs:'关键字取值 0–9 的数组 A（长 n）；允许重复值。',steps:['清空计数数组 count[0…9]。','顺序扫描数组，统计每个关键字出现的次数，令 count[A[i]] 自增 1。','对 count 做前缀和 count[k]+=count[k−1]，count[k] 表示关键字不大于 k 的元素总数。','逆序扫描数组，对元素 A[i] 令 B[--count[A[i]]]=A[i]，把元素放入辅助数组的对应位置。','逆序放置使相同关键字中原本靠后的仍靠后，排序保持稳定。','把辅助数组 B 复制回 A，排序结束。'],keys:['计数排序不属于比较排序，比较次数为 0，适合关键字范围小的场景。','必须逆序扫描才能保持稳定性；正序扫描会把相等元素的次序反转。','时间 O(n+k)、空间 O(n+k)，k 为关键字取值范围；k 过大时会浪费大量桶空间。'],cost:'时间 O(n+k) · 空间 O(n+k)'},code:[
    'void CountSort(int A[], int n) {       // 关键字取 0–9',
    '  for (i = 0; i < n; i++) count[A[i]]++;',
    '  for (k = 1; k < 10; k++) count[k] += count[k - 1];',
    '  for (i = n - 1; i >= 0; i--) {',
    '    B[--count[A[i]]] = A[i];            // 逆序放置保证稳定',
    '  }',
    '  copy(B, A);',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'binary-insert-sort',title:'折半插入排序',chapter:'sort',tag:'折半定位',difficulty:'基础',visualizer:'array',generator:extra.binaryInsertionSort,preset:()=>[[49,38,65,12,27,81,55]],input:arrayInput('49, 38, 65, 12, 27, 81, 55'),inputAdapter:values=>[[...values]],explain:{goal:'用折半查找确定直接插入排序的插入位置，减少关键字比较次数。',inputs:'待排序数组 A[0…n−1]；A[0…i−1] 为当前有序区。',steps:['把 A[0] 视为初始有序区，令 i 从 1 开始逐个取出待插入元素 key=A[i]。','在有序区 A[0…i−1] 内折半：令 low=0、high=i−1。','取 mid=⌊(low+high)/2⌋，比较 A[mid] 与 key。','若 A[mid] 大于 key，说明插入点在左半区，令 high=mid−1。','否则令 low=mid+1（相等时走右半区，保证稳定）。','当 low 大于 high 时折半结束，插入位置为 high+1，把 A[high+1…i−1] 整体后移一位。','把 key 写入 A[high+1]，有序区扩大一位；i 自增并重复，直到 i=n。'],keys:['折半插入只减少比较次数（约 O(n log n)），元素移动次数与直接插入相同，平均时间仍为 O(n²)。','相等时必须走右半区（A[mid] 不大于 key 取 low=mid+1），才能保持<b>稳定</b>。','折半结束时插入位置是 high+1 而不是 mid，移动范围是 A[high+1…i−1]。'],cost:'平均 O(n²) · 最坏 O(n²) · 空间 O(1)'},code:[
    'void BinInsertSort(int A[], int n) {',
    '  for (i = 1; i < n; i++) {',
    '    key = A[i];  low = 0;  high = i - 1;',
    '    while (low <= high) {               // 折半查找插入位置',
    '      mid = (low + high) / 2;',
    '      if (A[mid] > key) high = mid - 1;',
    '      else low = mid + 1;               // 相等时取右侧，保持稳定',
    '    }                                   // 插入位置为 high + 1',
    '    for (j = i - 1; j >= high + 1; j--)',
    '      A[j + 1] = A[j];',
    '    A[high + 1] = key;',
    '  }',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'hash-linear',title:'线性探测法散列表',chapter:'search',tag:'线性探测',difficulty:'基础',visualizer:'hash',generator:extra.hashLinear,preset:()=>[[19,14,23,1,68,20,56,33,12],11],input:fields([['keys','关键字','19, 14, 23, 1, 68, 20, 56, 33, 12'],['size','表长（1–12）','11']],'负数按 ((key mod m) + m) mod m 取地址；示例 9 个关键字、表长 11，含 4 次冲突与绕回探测。',raw=>({keys:array(raw.keys),size:integer(raw.size,1,12)})),inputAdapter:input=>[input.keys,input.size],explain:{goal:'用线性探测法解决冲突，把关键字插入散列表并保持可查找。',inputs:'表长 m（1–12）与关键字序列；散列函数 H(key)=key mod m，负数取非负余数。示例表长 11、9 个关键字，多个关键字散列到同一地址后逐格后移。',steps:['计算初始散列地址 pos=key mod m，并把 pos 规整到 0 到 m−1 之间。','从 d=0 开始探测，最多探测 m 次。','若 table[pos] 为空位，把 key 存入该位置、元素个数加 1，插入成功返回。','若位置已被占用，说明发生冲突，令 pos=(pos+1) mod m 探测下一个位置。','重复「判断空位、后移一格」的探测过程。','若探测 m 次仍未找到空位，说明表已满，插入失败。'],keys:['线性探测公式为 H_i=(H(key)+i) mod m，冲突后逐格向后找空位，容易产生一次堆积。','删除元素不能直接把位置置空，需使用删除标记，否则会截断后续元素的探测链。','装载因子 α 越大平均查找长度越长；探测序列会绕回表头，需对 m 取模。'],cost:'平均 O(1) · 最坏 O(n) · 空间 O(m)'},code:[
    'bool Insert(HashTable &H, Key key) {',
    '  int pos = key % H.size;               // 初始散列地址 H(key)',
    '  for (int d = 0; d < H.size; d++) {',
    '    if (H.table[pos] == EMPTY) {        // 位置被占用则冲突',
    '      H.table[pos] = key; H.count++; return true;',
    '    }',
    '    // 冲突：探测下一个位置',
    '    pos = (pos + 1) % H.size;           // 线性探测',
    '  }',
    '  return false;                         // 探测一圈无空位：表满',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'hash-double',title:'双散列探测',chapter:'search',tag:'双散列',difficulty:'进阶',visualizer:'hash',generator:extra.hashDouble,preset:()=>[[19,14,23,1,68,20,56,33,12],11,5],input:fields([['keys','关键字','19, 14, 23, 1, 68, 20, 56, 33, 12'],['size','表长（3–12）','11'],['prime','第二散列模 prime（2 ≤ prime < 表长）','5']],'H1=key mod 表长；H2=prime − key mod prime 决定探测步长；对比线性探测的堆积。示例 9 个关键字、表长 11、prime=5。',raw=>{const size=integer(raw.size,3,12);const prime=integer(raw.prime,2,12);if(prime>=size)throw new Error('prime 必须小于表长');return{keys:array(raw.keys),size,prime};}),inputAdapter:input=>[input.keys,input.size,input.prime],explain:{goal:'用双散列探测解决冲突，使探测序列随关键字变化，减少堆积。',inputs:'表长 m（3–12）、第二散列模数 prime（不小于 2 且小于表长）与关键字序列。示例表长 11、9 个关键字，多个关键字的探测步长各不相同。',steps:['计算第一散列地址 h1=key mod m。','计算第二散列值 h2=prime−(key mod prime)，它作为探测步长，恒大于 0。','从 d=0 开始，按公式 pos=(h1+d·h2) mod m 计算第 d 次探测地址。','若 table[pos] 为空位，存入 key、元素个数加 1，插入成功返回。','若位置已被占用，令 d 增 1，按同一公式跳到下一个探测位置。','若探测 m 次仍未找到空位，说明表已满，插入失败。'],keys:['双散列探测公式为 H_i=(H1(key)+i·H2(key)) mod m，步长随关键字变化，可缓解堆积。','第二散列必须保证非零且与表长互质；prime 取素数、表长取素数时探测序列更易遍历全表。','当步长与 m 不互质时探测序列可能提前循环，导致有空洞却插不进去。','删除同样需要删除标记，否则探测链断裂会影响后续查找。'],cost:'平均 O(1) · 最坏 O(n) · 空间 O(m)'},code:[
    'bool Insert(HashTable &H, Key key) {',
    '  int h1 = key % H.size;',
    '  int h2 = H.prime - (key % H.prime);   // 第二散列：探测步长',
    '  for (int d = 0; d < H.size; d++) {',
    '    int pos = (h1 + d * h2) % H.size;',
    '    if (H.table[pos] == EMPTY) {        // 位置被占用则继续探测',
    '      H.table[pos] = key; H.count++; return true;',
    '    }',
    '  }',
    '  return false;                         // 探测一圈仍无空位',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'kmp-nextval',title:'KMP 改进 nextval',chapter:'search',tag:'nextval 优化',difficulty:'进阶',visualizer:'string',generator:extra.kmpNextval,preset:()=>['abababacaba','ababaca'],input:asciiInput(),inputAdapter:x=>[x.text,x.pattern],explain:{goal:'在 pi 表基础上构造 nextval，合并连续回退，加速 KMP 匹配。',inputs:'主串 s（长 n）与模式串 p（长 m）；下标从 0 开始。',steps:['先构造 pi 表：pi[0]=0，对 i=1 到 m−1 依次计算。','计算 pi[i] 时令 j=pi[i−1]，若 p[i] 与 p[j] 不等则反复令 j=pi[j−1]，直到 j=0 或字符相等。','若 p[i] 等于 p[j] 则 j 自增，令 pi[i]=j，得到最长相等真前后缀长度。','构造 nextval：nextval[0]=0，对 i=1 到 m−1 令 j=pi[i−1]。','若 p[i] 等于 p[j]，说明回退后仍会遇到相同失配字符，令 nextval[i]=nextval[j] 跳过无效回退；否则令 nextval[i]=j。','匹配时 i、j 从 0 开始：若 j=0 或 s[i] 等于 p[j]，则 i、j 同时后移。','若失配且 j 大于 0，则令 j=nextval[j]，用 nextval 一步跳过连续回退。','当 j 达到 m 时返回首次匹配下标 i−m；主串扫描完仍不匹配则返回 −1。'],keys:['nextval 的核心是合并回退：当 p[i] 等于 pi[i−1] 处的字符时直接继承对应的 nextval，省去一轮注定失配的比较。','求 nextval 必须依赖已求出的 pi 表；二者混用递推会把 pi 与 nextval 的语义搞混。','失配时主串指针 i 永不回溯，时间 O(n+m)；约定不同教材 nextval[0] 可能取 0 或 −1。'],cost:'时间 O(n+m) · 空间 O(m)'},code:[
    'void GetPi(char p[], int pi[]) {          // 先构造 pi 表',
    '  pi[0] = 0;',
    '  for (i = 1; i < m; i++) {',
    '    j = pi[i - 1];',
    '    while (j > 0 && p[i] != p[j]) j = pi[j - 1];',
    '    if (p[i] == p[j]) j++;',
    '    pi[i] = j;',
    '  }',
    '}',
    'void GetNextVal(char p[], int nv[]) {     // 合并连续回退',
    '  nv[0] = 0;',
    '  for (i = 1; i < m; i++) {',
    '    j = pi[i - 1];',
    '    nv[i] = (p[i] == p[j]) ? nv[j] : j;',
    '  }',
    '}',
    'int KMP(char s[], char p[]) {',
    '  i = 0; j = 0;',
    '  while (i < n && j < m) {',
    '    if (j == 0 || s[i] == p[j]) { i++; j++; }',
    '    else j = nv[j];                       // 失配时用 nextval 回退',
    '    if (j == m) return i - m;             // 首次匹配下标',
    '  }',
    '  return -1;',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'bf-match',title:'BF 朴素模式匹配',chapter:'search',tag:'暴力回溯',difficulty:'基础',visualizer:'string',generator:extra.bfMatch,preset:()=>['ababcabcacbab','abcac'],input:asciiInput(),inputAdapter:x=>[x.text,x.pattern],explain:{goal:'逐位比较主串与模式串，失配时回溯主串指针，求模式串首次出现位置。',inputs:'主串 s（长 n）与模式串 p（长 m）；下标从 0 开始。',steps:['令主串指针 i=0、模式串指针 j=0，两串都从首个字符开始比较。','若 s[i] 等于 p[j]，则 i、j 同时后移一位，继续比较后继字符。','若字符不等，则本趟匹配失败：主串指针回退到本趟起点下一位 i=i−j+1。','令 j=0，模式串从头开始，准备下一趟匹配。','重复逐位比较与失配回退，直到 j 达到 m 或主串扫描完毕。','若 j 达到 m，说明模式串整体匹配成功，返回起始下标 i−m。','若主串扫描完仍未匹配，返回 −1 表示失败。'],keys:['失配时主串指针必须回退到 i−j+1、j 归零，这一步是 BF 与 KMP 的本质差别。','最坏时间 O(n·m)，例如主串 aaaa…ab、模式串 aaab；平均接近 O(n+m)。','空间 O(1)，实现简单，适合 n、m 较小的场景。'],cost:'平均 O(n+m) · 最坏 O(n·m) · 空间 O(1)'},code:[
    'int BF(char s[], char p[]) {',
    '  int i = 0, j = 0;',
    '  while (i < n && j < m) {',
    '    if (s[i] == p[j]) { i++; j++; }',
    '    else {                              // 失配',
    '      i = i - j + 1;                    // 主串回退到本趟起点下一位',
    '      j = 0;                            // 模式串从头开始',
    '    }',
    '  }',
    '  if (j >= m) return i - m;             // 匹配成功',
    '  return -1;                            // 匹配失败',
    '}'
  ]}));
  newExperiments.push(defineExperiment({id:'graph-cross',title:'十字链表',chapter:'graph',tag:'正交链表',difficulty:'进阶',visualizer:'adjacency',generator:extra.crossList,preset:()=>[crossPreset()],input:graphInput.config(crossPreset(),undefined,{directed:true}),inputAdapter:x=>[x.graph],explain:{goal:'用十字链表存储有向图，使每个弧结点同时挂在出弧链与入弧链上。',inputs:'含 n 个顶点、e 条弧的有向图；(u, v, w) 表示从 u 到 v、权为 w 的弧。示例为 6 个顶点、8 条弧，A 的出弧链与 F 的入弧链都较完整。',steps:['建立顶点表：每个顶点含 data、firstout（出弧链头指针）与 firstin（入弧链头指针）。','建立弧结点：每条弧含 tail（弧尾 u）、head（弧头 v）、hlink（同尾弧指针）与 tlink（同头弧指针）。','遍历每条弧 (u, v, w)：先令 arc->hlink=firstout[u]，再令 firstout[u]=arc，把弧结点头插到出弧链。','再令 arc->tlink=firstin[v]，并令 firstin[v]=arc，把同一弧结点头插到入弧链。','对全部弧重复上述两步链接，每个弧结点同时属于一条出弧链和一条入弧链。','沿 firstout[u] 可枚举 u 的全部出弧，沿 firstin[v] 可枚举 v 的全部入弧，空间 O(n+e)。'],keys:['十字链表是有向图的链式存储：一条弧只有一个结点，出弧链与入弧链共用它，便于同时求出度和入度。','采用头插法时链中弧的次序与输入次序相反；需要保序时应改用尾插。','hlink 只串同尾弧、tlink 只串同头弧，两条链互不干扰，指针设置不能弄反。'],cost:'时间 O(n+e) · 空间 O(n+e)'},code:[
    'void BuildOrthList(OLGraph &G) {        // 十字链表（有向图）',
    '  // 顶点表：data / firstout / firstin',
    '  // 弧结点：tail / head / hlink / tlink',
    '  for (each arc <u, v, w>) {',
    '    arc->hlink = firstout[u]; firstout[u] = arc;  // 出弧链头插',
    '    arc->tlink = firstin[v];  firstin[v] = arc;   // 入弧链头插',
    '  }',
    '}'
  ]}));
  newExperiments.push(...advanced);
  function extend(modules){return modules.map(entry=>({...entry,experiments:[...entry.experiments.map(enhance),...newExperiments.filter(e=>e.chapter===entry.chapter.id)]}));}
  return {extend,treeParse};
});
