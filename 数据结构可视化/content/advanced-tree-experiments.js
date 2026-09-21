(function(root,factory){const node=typeof module==='object'&&module.exports;const api=factory(node?require('../assets/js/algorithms/advanced-trees.js'):root.DS.Algorithms.advancedTrees,node?require('./experiment.js'):root.DS.Experiments);if(node)module.exports=api;root.DS=root.DS||{};root.DS.AdvancedTreeExperiments=api;})(globalThis,function(A,{defineExperiment}){
  const defaultValue='10, 20, 30, 15, 25, 5, 1, 8, 12, 18, 22, 28';
  const deleteDefault='1, 28, 15';
  function parse(raw){
    const source=value=>String(value===undefined||value===null?'':value).trim();
    const tokens=value=>source(value).split(/[\s,，]+/).filter(Boolean);
    const whole=token=>/^[-+]?\d+$/.test(token)&&Math.abs(Number(token))<=999;
    const values=tokens(raw&&raw.values);
    if(!values.length||values.length>12||values.some(token=>!whole(token)))return {ok:false,message:'请输入 1–12 个 [-999,999] 整数作为插入序列。'};
    const deletes=tokens(raw&&raw.deletes);
    if(deletes.length>12||deletes.some(token=>!whole(token)))return {ok:false,message:'删除序列最多 12 个 [-999,999] 整数，也可以留空。'};
    const query=source(raw&&raw.target);
    if(query&&!whole(query))return {ok:false,message:'查找值必须是 [-999,999] 整数，也可以留空。'};
    return {ok:true,value:{values:values.map(Number),deletes:deletes.map(Number),target:query?Number(query):undefined}};
  }
  function describeState(s){
    const rows=Object.values(s.tree.nodes).map(n=>{
      const doubleBlack=s.doubleBlack&&s.doubleBlack.id===n.id;
      const kind=n.nil?'黑色 NIL（双黑）':n.color?(n.color==='red'?'红':doubleBlack?'黑 · 双黑':'黑'):n.leaf?'叶子':'索引';
      return [n.id,n.keys.join(', '),kind,n.parent||'—',n.children.map(x=>x||'NIL').join(', ')||'—',n.next||'—'];
    });
    return [
      {title:'结构与链接（重复键拒绝；修复中的临时状态由阶段标识）',columns:['结点','关键字','颜色 / 类型','父结点','孩子','next'],rows},
      {title:'当前阶段',columns:['阶段','正在删除','查找结果'],rows:[[s.phase,s.deleting??'—',s.found===false?'不存在':s.found||'—']]},
    ];
  }
  function fields(valuesDefault,deletesDefault,targetDefault){
    return [
      {name:'values',label:'插入序列（1–12 个整数；重复键拒绝）',defaultValue:valuesDefault},
      {name:'deletes',label:'删除序列（可留空；不存在的键会演示跳过）',defaultValue:deletesDefault},
      {name:'target',label:'查找值（可留空）',defaultValue:targetDefault},
    ];
  }
  const shared={visualizer:'multi-tree',difficulty:'进阶',input:{type:'multi',label:'实验参数',defaultValue:'custom',placeholder:'输入参数',parse},inputAdapter:input=>[input.values,input.deletes,input.target],describeState};

  const redBlack=defineExperiment({...shared,id:'red-black-tree',chapter:'search',title:'红黑树插入、删除与查找',tag:'旋转与双黑修复',generator:A.redBlack,preset:()=>[[10,20,30,15,25,5,1,8,12,18,22,28],[20,22,25,28],18],input:{...shared.input,fields:fields(defaultValue,'20, 22, 25, 28','18'),hint:'重复键会被明确拒绝；删除序列可以包含树中不存在的键（会演示「未找到，跳过」）；默认案例的删除会依次触发双黑修复的四种情形。'},
    explain:{goal:'在二叉排序树规则下插入红结点并修复颜色不变量，删除时按 CLRS 方式处理「双黑」，始终维持红黑树的五条性质。',inputs:'插入序列（1–12 个整数，重复键会被拒绝）、删除序列（可留空，可以包含不存在的键）与可选的查找值；空指针视为黑色 NIL。',steps:['初始化红黑树：空树，所有 NIL 叶结点约定为黑色。','插入前先在树中查重：沿排序树比较关键字，若已存在则拒绝该重复键。','从根开始按关键字大小下降到插入位置，把新结点作为<b>红色</b>结点挂在父结点下。','若父结点为红色：叔结点为红时把父、叔涂黑、祖父涂红并继续向上；叔结点为黑时旋转，旋转后新子树的根涂黑、两个孩子涂红。','修复逐层上移，最后强制根结点为黑色，本次插入完成。','删除时先按二叉排序树定位待删结点：至多一个孩子就用孩子顶替；有两个孩子则把<b>中序后继</b>整体提到被删位置，再摘除后继结点。','若被摘除的是<b>黑色</b>结点，就会留下一个「双黑」结点（画面上用双环标记，空孩子处显示黑色 NIL 方块），必须修复这份黑高亏空。','按四种情形修复：① 兄弟为红 → 旋转父结点并变色，转化为后三种情形；② 兄弟的两个孩子皆黑 → 兄弟变红、双黑上移到父结点；③ 远侄为红 → 旋转父结点并变色，双黑被吸收；④ 近侄为红 → 先反向旋转兄弟，转成情形③。','修复结束后把根重新涂黑；每一步都可以用「根为黑、无红红、各路径黑高相等」来验证。','建树与删除完成后执行查找：在访问到的每个结点内比较目标键，命中返回该结点，走到 NIL 则返回 NOT_FOUND。'],keys:['新插入结点一律为红色；只有父结点也为红时才需要修复，修复终止于父结点为黑或到达根。','叔红变色、叔黑旋转：旋转后必须把新子树的根涂黑、两个孩子涂红，否则黑高会被破坏。','删除黑结点会产生<b>双黑</b>：双黑可以落在真实结点上，也可以落在黑色 NIL 上；修复的本质是把这份额外的黑色向上或向兄弟转移，直到被红结点吸收或到达根。','四种情形的判定顺序不能颠倒：兄弟为红要先旋转转化；兄弟为黑时才看两个侄子，近侄为红要先反向旋转兄弟。','根始终重新涂黑，任意结点到 NIL 的黑结点数相等；查找、插入、删除均为 O(log n)。'],cost:'时间 O(log n) · 空间 O(1)（旋转与变色）'},
    code:['initialize RB tree; NIL is BLACK;','for key in values: reject duplicate keys;','  compare keys and descend to insertion position;','  attach a RED node;','  while parent is RED: recolor parent/uncle/grandparent;','  rotate when uncle is BLACK; reconnect parents;','  root.color = BLACK; invariants restored;','for key in deletes: locate z by comparing keys;','  if key absent: report MISS and skip this delete;','  if z has at most one child: replace z with its child;','  else: move the in-order successor into z\'s place;','  (the successor has at most one right child);','  x = replacement of the unlinked node; it carries an extra BLACK;','  while x is not the root and x is BLACK:','    if the sibling is RED: rotate parent, recolor, continue;','    if both children of the sibling are BLACK: recolor sibling; x = parent;','    else: rotate at the sibling; the extra BLACK is absorbed;','  drop the temporary NIL sentinel;','  deletion finished: root is BLACK, black heights equal;','search(target): compare keys in each visited node;','return the located node, or NOT_FOUND;']});

  const bTree=defineExperiment({...shared,id:'b-tree',chapter:'search',title:'B 树插入、删除与查找',tag:'t=2 借位与合并',generator:A.bTree,preset:()=>[[10,20,30,15,25,5,1,8,12,18,22,28],[30,25,28],22],input:{...shared.input,fields:fields(defaultValue,'30, 25, 28','22'),hint:'重复键会被明确拒绝；删除序列可以包含树中不存在的键（会演示「未找到，跳过」）；B 树 t=2，每结点最多 3 个关键字，默认案例的删除会同时演示借位与合并。'},
    explain:{goal:'在 t=2 的 B 树中插入关键字并分裂满结点，删除时先借位后合并，始终保持所有叶结点等深。',inputs:'插入序列（1–12 个整数，重复键拒绝）、删除序列（可留空）与可选的查找值；t=2，每结点最多 3 键、非根至少 1 键。',steps:['初始化 t=2 的 B 树：每个结点最多 2t−1=3 个关键字，根以外至少 t−1=1 个，所有叶结点同层。','插入前先查重：若关键字已存在则拒绝，不插入重复键。','从根开始按关键字大小比较，选择对应子树逐层下降，定位叶结点插入位置。','下降途中若即将进入的孩子已满（已有 3 个关键字），先分裂它：中间关键字提升到父结点，左右两半各成新结点。','若根结点已满，先分裂根，中间关键字成为新根，树高增加一层。','到达叶结点后把关键字插入合适位置，保持结点内有序；插入后必要时继续向上分裂。','删除时先定位关键字：若它在<b>内部结点</b>中，用它左子树的最大关键字（前驱）替换，再删除那个前驱。','删除记录后若结点关键字数低于下界（t−1=1），先向兄弟<b>借位</b>：兄弟有富余关键字时，经父结点分隔键旋转一个过来。','兄弟也只有 1 个关键字时改为<b>合并</b>：把父结点的分隔键下沉，与兄弟合并成一个结点，然后继续向上检查。','若根结点的关键字数变成 0，删除根、让它的唯一孩子成为新根，树高减一；删除后所有叶仍在同一层。','全部操作结束后执行查找：在结点内比较，命中返回结点，否则沿相应子树下降，到叶仍未命中则返回 NOT_FOUND。'],keys:['B 树的绝对平衡：所有叶结点等深；除根外每个结点关键字数为 t−1 到 2t−1。','分裂先把中间关键字提升到父结点，再以它为界把剩余键分成左右两半；根分裂是树长高的唯一途径。','删除有两个阶段：先「借位」（向有富余的兄弟经父结点借一个关键字），借不到才「合并」（连同父结点分隔键一起合并）。','删除内部结点的关键字时必须先用中序前驱（左子树最大）或后继替换，再删除叶层的那个替身关键字。','根结点的关键字数变为 0 是树高减一的唯一时机；时间 O(log n)，与树高同阶。'],cost:'时间 O(log n) · 空间 O(n)'},
    code:['initialize B tree; minimum degree t = 2;','for key in values: reject duplicates;','  compare keys and descend; split full children on the way;','  insert into the leaf; keep node keys sorted;','  detect full or overflowing node;','  split 3-key child; promote the middle key;','  finish insertion; verify balanced leaf depth;','for key in deletes: locate the node holding the key;','  if key absent: report MISS and skip this delete;','  if the key sits in an internal node: replace it by its predecessor;','  remove the key (or that predecessor) from its leaf;','  while a node has fewer than t-1 keys:','    if a sibling has spare keys: borrow via the parent;','    else: merge with a sibling and pull down the parent key;','  if the root has 0 keys: drop it; tree height decreases;','  deletion finished; all leaves still at equal depth;','search(target): compare in each visited node;','return the located node, or NOT_FOUND;']});

  const bPlus=defineExperiment({...shared,id:'b-plus-tree',chapter:'search',title:'B+ 树插入、删除与查找',tag:'叶链与分隔键',generator:A.bPlus,preset:()=>[[10,20,30,15,25,5,1,8,12,18,22,28],[15,18,12],22],input:{...shared.input,fields:fields(defaultValue,'15, 18, 12','22'),hint:'重复键会被明确拒绝；删除序列可以包含树中不存在的键（会演示「未找到，跳过」）；B+ 树每结点最多 3 键 / 4 孩子，记录只存放在叶结点，默认案例的删除会同时演示借位与合并。'},
    explain:{goal:'在 B+ 树中插入记录并分裂溢出结点，删除时借位或合并，始终保持叶链有序、父索引等于右子树最小值。',inputs:'插入序列（1–12 个整数，重复键拒绝）、删除序列（可留空）与可选的查找值；每结点最多 3 键 / 4 孩子。',steps:['初始化 B+ 树：每结点最多 3 个关键字、4 棵子树；记录只存放在叶结点，非叶结点仅作索引。','插入前先查重：若关键字已存在则拒绝，不插入重复键。','从根开始按非叶结点中的分隔键比较，选择目标键所属子树一路下降到叶结点。','把关键字插入目标叶并保持叶内有序；若叶中最小值变化，同步刷新祖先结点的分隔键。','若叶结点关键字数超过上限 3 发生溢出，把叶分裂为左右两半。','取右叶的最小键复制到父结点作为新分隔键（记录本身仍留在叶中），并用 next 指针把新右叶链到原叶之后。','非叶结点若也超出上限则同样分裂并向上提升分隔键，最坏裂到根使树高增加一层。','删除时先沿分隔键下降到叶，删除其中的记录；若父索引因此变化，重新计算「父索引 = 右子树最小值」。','若叶结点关键字数低于下界（t−1=1），先向兄弟<b>借位</b>（借一条记录，父索引随之重算），兄弟没有富余时才<b>合并</b>。','合并后必须重接叶链 <b>next</b> 指针并重算父索引；内部结点下溢按同样规则处理，根结点关键字数变成 0 时删除根、树高减一。','全部操作结束后执行查找：沿分隔键下降到叶，在叶内比较目标，命中返回，否则返回 NOT_FOUND。'],keys:['B+ 树分裂时提升的是右叶最小键的<b>副本</b>，仅作分隔键；B 树提升的是真实关键字。','记录只存放在叶结点：内部结点中的键都是索引副本，任何查找都必须走到叶结点。','叶结点用 next 指针串成有序链表，适合范围查询与顺序扫描；合并叶结点时必须重接 next。','父索引必须恒等于右子树最小值；删除、借位、合并之后都要重算，否则会破坏查找路径。','手写实现时最易错的两处：合并后忘记重接 next、以及只改了记录却忘了重算父索引。'],cost:'时间 O(log n) · 空间 O(n)'},
    code:['initialize B+ tree; maximum keys = 3;','for key in values: reject duplicates;','  compare separators and descend to the leaf;','  insert record in leaf; refresh separator minima;','  detect overflow; split when keys exceed 3;','  split overflow; link leaves; copy right minimum;','  finish insertion; verify balanced leaf depth;','for key in deletes: follow separators down to a LEAF;','  if key absent in the leaf: report MISS and skip;','  remove the record from the leaf; recompute separators;','  while a node has fewer than t-1 keys:','    if a sibling has spare keys: borrow via the parent;','    else: merge with a sibling and pull down the parent key;','  relink the leaf chain (next); recompute separators;','  if the root has 0 keys: drop it; tree height decreases;','  deletion finished; leaves linked, ordered and equal depth;','search(target): follow separators to a LEAF;','return the located record, or NOT_FOUND;']});

  return [redBlack,bTree,bPlus];
});
