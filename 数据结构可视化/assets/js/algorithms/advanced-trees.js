(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DS=root.DS||{};root.DS.Algorithms=root.DS.Algorithms||{};root.DS.Algorithms.advancedTrees=api;})(globalThis,function(){
  'use strict';
  /* 高级树：红黑树 / B 树 / B+ 树的插入、删除与查找。
     签名统一为 (values, deletes, target)：deletes 为删除序列（可省略），target 为可选查找值。
     每个快照都是深拷贝后冻结的完整状态，渲染器只负责绘制。 */
  const MAX_VALUES=12,MAX_DELETES=12,MIN_NODE_KEYS=1,MAX_NODE_KEYS=3;
  function validate(values,deletes,target){
    if(!Array.isArray(values)||values.length<1||values.length>MAX_VALUES||values.some(x=>!Number.isInteger(x)||Math.abs(x)>999))throw new Error('请输入 1–12 个 [-999,999] 整数');
    if(deletes!==undefined&&deletes!==null&&(!Array.isArray(deletes)||deletes.length>MAX_DELETES||deletes.some(x=>!Number.isInteger(x)||Math.abs(x)>999)))throw new Error('删除序列最多 12 个 [-999,999] 整数');
    if(target!==undefined&&target!==null&&(!Number.isInteger(target)||Math.abs(target)>999))throw new Error('查找值须为 [-999,999] 整数');
  }
  function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
  function context(type,values,deletes,target){validate(values,deletes,target);const tree={root:null,nodes:{}},steps=[];let serial=0;return {tree,steps,deletes:Array.isArray(deletes)?deletes.slice():[],node(keys,leaf=true,color){const id='n'+serial++;tree.nodes[id]={id,keys:[...keys],children:[],parent:null,leaf,next:null,...(color?{color}:{})};return tree.nodes[id];},emit(phase,line,message,active=[],extra={}){if(type==='red-black')Object.values(tree.nodes).forEach(n=>{n.leaf=n.children.every(x=>x===null);});steps.push(freeze({id:type+'-'+steps.length,line,message,state:JSON.parse(JSON.stringify({kind:'multi-tree',type,tree,phase,active,target:target??null,found:null,doubleBlack:null,deleting:null,...extra}))}));}};}
  function search(c,target,plus,foundLine){if(target===undefined||target===null){c.emit('done',foundLine-1,c.deletes.length?'全部删除完成；未设置查找值':'构造完成；未设置查找值',[],{done:true});return;}let id=c.tree.root;while(id){const n=c.tree.nodes[id];c.emit('search',foundLine-1,`在结点 [${n.keys.join(', ')}] 查找 ${target}`,[id]);if((!plus||n.leaf)&&n.keys.includes(target)){c.emit('found',foundLine,`找到关键字 ${target}`,[id],{found:id,done:true});return;}let i=0;while(i<n.keys.length&&(plus?target>=n.keys[i]:target>n.keys[i]))i++;id=n.children[i];}c.emit('missing',foundLine,`关键字 ${target} 不存在`,[],{found:false,done:true});}

  /* ============================ 红黑树 ============================ */
  function redBlack(values,deletes,target){
    const c=context('red-black',values,deletes,target),tree=c.tree,N=tree.nodes;
    const color=id=>id?N[id].color:'black';
    function rotate(id,left,phase,line,message){const x=N[id],side=left?1:0,other=1-side,y=N[x.children[side]],p=x.parent;x.children[side]=y.children[other];if(x.children[side])N[x.children[side]].parent=id;y.parent=p;if(!p)tree.root=y.id;else N[p].children[N[p].children[1]===id?1:0]=y.id;y.children[other]=id;x.parent=y.id;c.emit(phase||'rotate',line||6,message||`${left?'左':'右'}旋 ${x.keys[0]}，更新父子链接`,[id,y.id]);}
    function transplant(u,v){const p=N[u].parent;if(!p)tree.root=v;else N[p].children[N[p].children[1]===u?1:0]=v;if(v)N[v].parent=p;}
    // 双黑若落在空孩子上，临时物化一个黑色 NIL 哨兵结点；删除结束后必须移除。
    function newNil(){const s=c.node([],true,'black');s.children=[null,null];s.nil=true;return s.id;}
    function dropNil(id){const n=id?N[id]:null;if(!n||!n.nil)return;const p=n.parent;if(tree.root===id)tree.root=null;else if(p){const i=N[p].children.indexOf(id);if(i>=0)N[p].children[i]=null;}delete N[id];}
    c.emit('start',1,'红黑树：空孩子视为黑色 NIL');const seen=new Set();
    for(const value of values){if(seen.has(value)){c.emit('duplicate',2,`拒绝重复关键字 ${value}：集合不保存重复项`);continue;}seen.add(value);let p=null,id=tree.root;while(id){p=id;c.emit('compare',3,`比较 ${value} 与 ${N[id].keys[0]}`,[id]);id=N[id].children[value<N[id].keys[0]?0:1];}const z=c.node([value],true,'red');z.children=[null,null];z.parent=p;if(p)N[p].children[value<N[p].keys[0]?0:1]=z.id;else tree.root=z.id;c.emit('insert',4,`插入红色结点 ${value}；接下来修复颜色不变量`,[z.id]);let cur=z.id;
      while(color(N[cur].parent)==='red'){const parent=N[cur].parent,g=N[parent].parent,left=N[g].children[0]===parent,uncle=N[g].children[left?1:0];if(color(uncle)==='red'){N[parent].color='black';N[uncle].color='black';N[g].color='red';c.emit('recolor',5,'父与叔变黑，祖父变红，继续向上修复',[parent,uncle,g]);cur=g;}else{if(N[parent].children[left?1:0]===cur){cur=parent;rotate(cur,left);}const pp=N[cur].parent,gg=N[pp].parent;N[pp].color='black';N[gg].color='red';c.emit('recolor',5,'父变黑、祖父变红，为外侧旋转准备',[pp,gg]);rotate(gg,!left);}}
      N[tree.root].color='black';Object.values(N).forEach(n=>{n.leaf=n.children.every(x=>x===null);});c.emit('balanced',7,'根置黑；本次插入完成，红黑性质恢复',[tree.root]);
    }
    for(const key of c.deletes)deleteOne(key);
    search(c,target,false,21);return c.steps;

    function deleteOne(key){
      let id=tree.root,path=[];
      c.emit('delete-find',8,`删除 ${key}：从根开始按关键字比较`,[],{deleting:key});
      while(id){path.push(id);c.emit('delete-find',8,`比较 ${key} 与结点 [${N[id].keys.join(', ')}]`,path.slice(),{deleting:key});if(N[id].keys[0]===key)break;id=N[id].children[key<N[id].keys[0]?0:1];}
      if(!id){c.emit('delete-find',9,`关键字 ${key} 不在树中，本次删除跳过`,path.slice(),{deleting:key});c.emit('deleted',19,`${key} 删除操作结束：关键字不存在，树结构不变`,tree.root?[tree.root]:[],{deleting:null});return;}
      const zid=id,z=N[zid];
      c.emit('delete-find',8,`找到待删结点 ${zid}（${key}）`,path.slice(),{deleting:key});
      let yColor=z.color,x=null;
      if(!z.children[0]||!z.children[1]){
        x=z.children[0]||z.children[1];
        if(!x&&yColor==='black')x=newNil();
        transplant(zid,x);
        delete N[zid];
        c.emit('delete-remove',10,`${key} 至多一个孩子：用${x&&N[x].nil?'黑色 NIL':'孩子'}顶替该位置`,[],{deleting:key});
      }else{
        let sid=z.children[1];
        while(N[sid].children[0])sid=N[sid].children[0];
        yColor=N[sid].color;x=N[sid].children[1];
        if(!x&&yColor==='black')x=newNil();
        if(N[sid].parent===zid){if(x){N[x].parent=sid;if(N[x].nil)N[sid].children[1]=x;}}
        else{transplant(sid,x);N[sid].children[1]=z.children[1];N[z.children[1]].parent=sid;}
        transplant(zid,sid);
        N[sid].children[0]=z.children[0];N[z.children[0]].parent=sid;
        N[sid].color=z.color;
        delete N[zid];
        c.emit('delete-swap',11,`${key} 有两个孩子：用中序后继 ${N[sid].keys[0]} 替换其关键字，再摘除后继结点`,[sid],{deleting:key});
      }
      if(yColor==='black'){
        const sentinel=x&&N[x]&&N[x].nil?x:null;
        let cur=x;
        c.emit('fixup',13,`摘除的是黑结点，${sentinel?'黑色 NIL':'结点 '+(cur||'')} 承担双黑，开始修复`,[cur].filter(Boolean),{deleting:key,doubleBlack:cur?{id:cur}:null});
        while(cur&&cur!==tree.root&&color(cur)==='black'){
          const p=N[cur].parent;
          const isLeft=N[p].children[0]===cur;
          let w=N[p].children[isLeft?1:0];
          if(w&&color(w)==='red'){
            N[w].color='black';N[p].color='red';
            c.emit('fixup',15,'情形①：兄弟为红 → 旋转父结点并变色，转化为兄弟为黑的情形',[p,w],{deleting:key,doubleBlack:{id:cur}});
            rotate(p,isLeft,'fixup',15);
            w=N[p].children[isLeft?1:0];
          }
          if(!w||(color(N[w].children[0])==='black'&&color(N[w].children[1])==='black')){
            if(w)N[w].color='red';
            c.emit('fixup',16,'情形②：兄弟的两个孩子皆为黑 → 兄弟变红，双黑上移到父结点',w?[w]:[p],{deleting:key,doubleBlack:{id:cur}});
            cur=p;
            if(cur&&cur!==tree.root&&color(cur)==='black')c.emit('fixup',16,`双黑现在位于结点 ${cur}，继续向上修复`,[cur],{deleting:key,doubleBlack:{id:cur}});
          }else{
            const far=N[w].children[isLeft?1:0],near=N[w].children[isLeft?0:1];
            if(color(far)==='black'){
              if(near)N[near].color='black';
              N[w].color='red';
              c.emit('fixup',17,'情形④：近侄为红 → 先反向旋转兄弟，转化为远侄为红的情形',[w,near].filter(Boolean),{deleting:key,doubleBlack:{id:cur}});
              rotate(w,!isLeft,'fixup',17);
              w=N[p].children[isLeft?1:0];
            }
            N[w].color=N[p].color;N[p].color='black';
            if(N[w].children[isLeft?1:0])N[N[w].children[isLeft?1:0]].color='black';
            c.emit('fixup',17,'情形③：远侄为红 → 旋转父结点并变色，双黑被吸收，修复结束',[p,w],{deleting:key,doubleBlack:{id:cur}});
            rotate(p,isLeft,'fixup',17);
            cur=tree.root;
          }
        }
        if(cur)N[cur].color='black';
        dropNil(sentinel);
      }
      c.emit('deleted',19,`${key} 删除完成：根保持黑色，各路径黑高相等`,tree.root?[tree.root]:[],{deleting:null});
    }
  }

  /* ============================ B 树 ============================ */
  function bTree(values,deletes,target){
    const c=context('b-tree',values,deletes,target),tree=c.tree,N=tree.nodes;tree.root=c.node([]).id;c.emit('start',1,'B 树最小度数 t=2：每结点最多 3 个关键字');
    function split(p,i){const a=N[p.children[i]],b=c.node(a.keys.slice(2),a.leaf),middle=a.keys[1];a.keys=a.keys.slice(0,1);b.parent=p.id;if(!a.leaf){b.children=a.children.splice(2);b.children.forEach(id=>N[id].parent=b.id);}p.keys.splice(i,0,middle);p.children.splice(i+1,0,b.id);c.emit('split',6,`分裂满结点：${middle} 提升到父结点`,[p.id,a.id,b.id]);}
    const seen=new Set();for(const value of values){if(seen.has(value)){c.emit('duplicate',2,`拒绝重复关键字 ${value}`);continue;}seen.add(value);if(N[tree.root].keys.length===3){const old=tree.root,r=c.node([],false);r.children=[old];N[old].parent=r.id;tree.root=r.id;split(r,0);}let n=N[tree.root];while(!n.leaf){let i=0;while(i<n.keys.length&&value>n.keys[i])i++;c.emit('compare',3,`为 ${value} 选择第 ${i+1} 个孩子`,[n.id,n.children[i]]);if(N[n.children[i]].keys.length===3){split(n,i);if(value>n.keys[i])i++;}n=N[n.children[i]];}n.keys.push(value);n.keys.sort((a,b)=>a-b);c.emit('insert',4,`在叶结点插入 ${value}`,[n.id]);c.emit('balanced',7,'本次插入完成：所有叶子保持同深度',[n.id]);}
    function locate(key){let id=tree.root;while(id){const n=N[id];let i=0;while(i<n.keys.length&&key>n.keys[i])i++;if(i<n.keys.length&&n.keys[i]===key)return{id,i,found:true};if(n.leaf)return{id,i,found:false};id=n.children[i];}return null;}
    function maxNode(id){let n=N[id];while(!n.leaf)n=N[n.children[n.children.length-1]];return n.id;}
    function borrowLeft(p,idx,left,n,key){const sep=p.keys[idx-1],moved=left.keys.pop();n.keys.unshift(sep);if(!left.leaf){const ch=left.children.pop();if(ch){N[ch].parent=n.id;n.children.unshift(ch);}}p.keys[idx-1]=moved;c.emit('borrow',13,`向兄弟借位：${moved} 上升到父结点，分隔键 ${sep} 下沉到当前结点`,[p.id,left.id,n.id],{deleting:key});}
    function borrowRight(p,idx,right,n,key){const sep=p.keys[idx],moved=right.keys.shift();n.keys.push(sep);if(!right.leaf){const ch=right.children.shift();if(ch){N[ch].parent=n.id;n.children.push(ch);}}p.keys[idx]=moved;c.emit('borrow',13,`向兄弟借位：${moved} 上升到父结点，分隔键 ${sep} 下沉到当前结点`,[p.id,right.id,n.id],{deleting:key});}
    function mergeNodes(p,i,left,right,key){left.keys.push(p.keys[i]);left.keys=left.keys.concat(right.keys);if(!left.leaf){left.children=left.children.concat(right.children);left.children.forEach(id=>N[id].parent=left.id);}p.keys.splice(i,1);p.children.splice(i+1,1);delete N[right.id];c.emit('merge',14,`与兄弟合并：父结点分隔键下沉，两个结点合并为一个`,[p.id,left.id],{deleting:key});}
    function fix(id,key){let cur=id;while(cur&&cur!==tree.root){const n=N[cur];if(n.keys.length>=MIN_NODE_KEYS)return;const p=N[n.parent],idx=p.children.indexOf(cur);const left=idx>0?N[p.children[idx-1]]:null,right=idx<p.children.length-1?N[p.children[idx+1]]:null;if(left&&left.keys.length>MIN_NODE_KEYS){borrowLeft(p,idx,left,n,key);return;}if(right&&right.keys.length>MIN_NODE_KEYS){borrowRight(p,idx,right,n,key);return;}if(left){mergeNodes(p,idx-1,left,n,key);cur=p.id;}else{mergeNodes(p,idx,n,right,key);cur=p.id;}}
      const r=tree.root?N[tree.root]:null;if(r&&r.keys.length===0){if(r.leaf){delete N[r.id];tree.root=null;c.emit('shrink',15,'根结点已无关键字：整棵树变为空树',[],{deleting:key});}else{const only=r.children[0];N[only].parent=null;tree.root=only;delete N[r.id];c.emit('shrink',15,'根结点关键字数为 0：删除根，树高减一',[only],{deleting:key});}}}
    for(const key of c.deletes){c.emit('delete-find',8,`删除 ${key}：从根开始下降到可能含该关键字的结点`,[],{deleting:key});const spot=locate(key);if(!spot||!spot.found){c.emit('delete-find',9,`关键字 ${key} 不在树中，本次删除跳过`,[],{deleting:key});c.emit('deleted',16,`${key} 删除操作结束：关键字不存在，树结构不变`,tree.root?[tree.root]:[],{deleting:null});continue;}const n=N[spot.id];let start=spot.id;if(n.leaf){n.keys.splice(spot.i,1);c.emit('delete-remove',11,`从叶结点删除关键字 ${key}`,[spot.id],{deleting:key});}else{const leafId=maxNode(n.children[spot.i]),leaf=N[leafId],pred=leaf.keys[leaf.keys.length-1];n.keys[spot.i]=pred;leaf.keys.splice(leaf.keys.length-1,1);c.emit('delete-swap',10,`${key} 位于内部结点：用左子树最大关键字（前驱）${pred} 替换它，并从前驱所在叶结点删除 ${pred}`,[spot.id,leafId],{deleting:key});start=leafId;}fix(start,key);c.emit('deleted',16,`${key} 删除完成：所有叶结点仍在同一层，关键字数满足下界`,tree.root?[tree.root]:[],{deleting:null});}
    search(c,target,false,18);return c.steps;
  }

  /* ============================ B+ 树 ============================ */
  function bPlus(values,deletes,target){
    const c=context('b-plus',values,deletes,target),tree=c.tree,N=tree.nodes;tree.root=c.node([]).id;c.emit('start',1,'B+ 树：每结点最多 3 键；记录仅在叶子，索引为右子树最小值');
    function minimum(id){let n=N[id];while(!n.leaf)n=N[n.children[0]];return n.keys[0];}
    /* 重算全部内部索引：父索引恒等于右子树最小值。
       下溢修复途中可能出现空子树，此时该分隔键暂时缺失，直接省略，
       避免快照里出现 null（JSON 深拷贝会把 undefined 变成 null）。 */
    function refresh(id){if(!id)return;const n=N[id];if(!n.leaf){n.children.forEach(refresh);n.keys=n.children.slice(1).map(minimum).filter(k=>k!==undefined);}}
    const seen=new Set();for(const value of values){if(seen.has(value)){c.emit('duplicate',2,`拒绝重复关键字 ${value}`);continue;}seen.add(value);let n=N[tree.root];while(!n.leaf){let i=0;while(i<n.keys.length&&value>=n.keys[i])i++;c.emit('compare',3,`${value} 沿分隔键进入第 ${i+1} 个孩子`,[n.id,n.children[i]]);n=N[n.children[i]];}n.keys.push(value);n.keys.sort((a,b)=>a-b);refresh(tree.root);c.emit('insert',4,`叶子插入记录 ${value}${n.keys.length>MAX_NODE_KEYS?'，暂时溢出，立即分裂':''}`,[n.id]);
      while(n.keys.length>MAX_NODE_KEYS){const right=c.node([],n.leaf);if(n.leaf){right.keys=n.keys.splice(2);right.next=n.next;n.next=right.id;}else{right.children=n.children.splice(3);right.children.forEach(id=>N[id].parent=right.id);}let p;if(n.parent){p=N[n.parent];p.children.splice(p.children.indexOf(n.id)+1,0,right.id);}else{p=c.node([],false);p.children=[n.id,right.id];tree.root=p.id;n.parent=p.id;}right.parent=p.id;refresh(tree.root);c.emit('split',6,`${n.leaf?'叶子分裂并串接 next；复制':'内部结点分裂；更新'}右子树最小值 ${minimum(right.id)} 到父索引`,[n.id,right.id,p.id]);n=p;}
      refresh(tree.root);c.emit('balanced',7,'本次插入完成：叶链有序，父索引等于右子树最小值',[n.id]);}
    function locateLeaf(key){let id=tree.root;while(id){const n=N[id];let i=0;while(i<n.keys.length&&key>=n.keys[i])i++;c.emit('delete-find',8,`${key} 沿分隔键下降到第 ${i+1} 个孩子`,[n.id],{deleting:key});if(n.leaf)return n.id;id=n.children[i];}return null;}
    function mergeNodes(p,i,left,right,key){if(left.leaf){left.keys=left.keys.concat(right.keys);left.next=right.next;}else{left.children=left.children.concat(right.children);left.children.forEach(id=>N[id].parent=left.id);}p.keys.splice(i,1);p.children.splice(i+1,1);delete N[right.id];refresh(tree.root);c.emit('merge',13,`与兄弟合并：${left.leaf?'两个叶结点合并并重接 next 链':'两个内部结点合并'}，父结点移去一个分隔键`,[p.id,left.id],{deleting:key});}
    function fix(id,key){let cur=id;while(cur&&cur!==tree.root){const n=N[cur];if(n.keys.length>=MIN_NODE_KEYS)return;const p=N[n.parent],idx=p.children.indexOf(cur);const left=idx>0?N[p.children[idx-1]]:null,right=idx<p.children.length-1?N[p.children[idx+1]]:null;if(left&&left.keys.length>MIN_NODE_KEYS){if(n.leaf){n.keys.unshift(left.keys.pop());}else{const ch=left.children.pop();if(ch){N[ch].parent=n.id;n.children.unshift(ch);}}refresh(tree.root);c.emit('borrow',12,`向兄弟借位：${n.leaf?'从兄弟叶结点借一条记录，父索引随之重算':'从兄弟结点借一棵子树，父索引随之重算'}`,[p.id,left.id,n.id],{deleting:key});return;}if(right&&right.keys.length>MIN_NODE_KEYS){if(n.leaf){n.keys.push(right.keys.shift());}else{const ch=right.children.shift();if(ch){N[ch].parent=n.id;n.children.push(ch);}}refresh(tree.root);c.emit('borrow',12,`向兄弟借位：${n.leaf?'从兄弟叶结点借一条记录，父索引随之重算':'从兄弟结点借一棵子树，父索引随之重算'}`,[p.id,right.id,n.id],{deleting:key});return;}if(left){mergeNodes(p,idx-1,left,n,key);}else{mergeNodes(p,idx,n,right,key);}refresh(tree.root);cur=p.id;}
      const r=tree.root?N[tree.root]:null;if(r&&r.keys.length===0){if(r.leaf){delete N[r.id];tree.root=null;c.emit('shrink',15,'根结点已无关键字：整棵树变为空树',[],{deleting:key});}else{const only=r.children[0];N[only].parent=null;tree.root=only;delete N[r.id];refresh(tree.root);c.emit('shrink',15,'根结点关键字数为 0：删除根，树高减一',[only],{deleting:key});}}}
    for(const key of c.deletes){c.emit('delete-find',8,`删除 ${key}：沿分隔键找到记录所在的叶结点`,[],{deleting:key});const leafId=locateLeaf(key);const skip=msg=>{c.emit('delete-find',9,msg,[],{deleting:key});c.emit('deleted',16,`${key} 删除操作结束：关键字不存在，树结构不变`,tree.root?[tree.root]:[],{deleting:null});};if(leafId===null){skip(`关键字 ${key} 不在树中，本次删除跳过`);continue;}const leaf=N[leafId],pos=leaf.keys.indexOf(key);if(pos<0){skip(`关键字 ${key} 不在叶结点中，本次删除跳过`);continue;}leaf.keys.splice(pos,1);refresh(tree.root);c.emit('delete-remove',10,`从叶结点删除记录 ${key}；父索引重算为右子树最小值`,[leafId],{deleting:key});fix(leafId,key);refresh(tree.root);c.emit('deleted',16,`${key} 删除完成：叶链有序，父索引仍等于右子树最小值`,tree.root?[tree.root]:[],{deleting:null});}
    search(c,target,true,18);return c.steps;
  }

  return {redBlack,bTree,bPlus};
});
