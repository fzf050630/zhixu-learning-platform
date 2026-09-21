(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./canvas-scene.js'):root.DS.CanvasScene);if(node)module.exports=api;root.DS=root.DS||{};root.DS.Renderers=root.DS.Renderers||{};root.DS.Renderers['multi-tree']=api;})(globalThis,function(scene){
  'use strict';
  /* 红黑树 / B 树 / B+ 树共用的多路树渲染器。
     红黑树会把空孩子槽显式画成黑色 NIL 小方块，并用双环 +「双黑」标出删除后承担黑高亏空的结点；
     数据模型里空孩子仍然是 null，渲染器只负责绘制，不推演算法。 */
  const NIL_WIDTH=46,NIL_HEIGHT=22;
  function render(canvas,s){
    const {c,w,h}=scene.setup(canvas),{P,text,arrow}=scene,tree=s.tree||{},nodes=tree.nodes||{},positions={},widths={},active=new Set(s.active||[]),doubleBlackId=s.doubleBlack&&s.doubleBlack.id?s.doubleBlack.id:null;
    if(!tree.root){text(c,'空树 · 红黑树的空孩子视为黑色 NIL',w/2,h/2,16);return;}
    let depth=0;
    // 与 canvas-scene.text 的 16px 关键字字体保持一致，才能正确预留宽度
    const boxes={};c.font='600 16px "JetBrains Mono",Consolas,monospace';
    Object.values(nodes).forEach(n=>{boxes[n.id]=n.nil?NIL_WIDTH:Math.max(58,c.measureText(n.keys.join(' | ')||'∅').width+28);});
    // 红黑树：只要有一个真实孩子，两个槽位都要占位，空槽画成 NIL；NIL 结点自身不再展开
    const slots=n=>n.nil?[]:(s.type==='red-black'?n.children:n.children.filter(Boolean));
    function measure(id,d){if(!id)return 58;const n=nodes[id];depth=Math.max(depth,d);const children=slots(n);widths[id]=Math.max(boxes[id],children.reduce((a,k)=>a+measure(k,d+1),0)+Math.max(0,children.length-1)*18);return widths[id];}
    measure(tree.root,0);const total=Math.max(widths[tree.root]+40,w),scale=Math.min(1,w/total);c.save();c.scale(scale,scale);const H=h/scale,W=w/scale;
    const nilSlots=[];
    function place(id,left,d){const n=nodes[id],children=slots(n),rowY=64+d*Math.min(100,(H-155)/Math.max(1,depth)),childY=64+(d+1)*Math.min(100,(H-155)/Math.max(1,depth));positions[id]={x:left+widths[id]/2,y:rowY};const sum=children.reduce((a,k)=>a+(k?widths[k]:58),0)+Math.max(0,children.length-1)*18;let at=left+(widths[id]-sum)/2;children.forEach(k=>{if(k)place(k,at,d+1);else nilSlots.push({x:at+29,y:childY,parent:id});at+=(k?widths[k]:58)+18;});}
    place(tree.root,(W-widths[tree.root])/2,0);
    Object.values(nodes).forEach(n=>{const p=positions[n.id];if(!p)return;n.children.filter(Boolean).forEach(k=>{const q=positions[k];if(!q)return;arrow(c,p.x,p.y+20,q.x,q.y-20,P.line);});});
    // NIL 空槽（先画，处于最底层）
    nilSlots.forEach(slot=>{c.fillStyle='#20252d';c.fillRect(slot.x-NIL_WIDTH/2,slot.y-NIL_HEIGHT/2,NIL_WIDTH,NIL_HEIGHT);c.strokeStyle=P.muted;c.lineWidth=1;c.strokeRect(slot.x-NIL_WIDTH/2,slot.y-NIL_HEIGHT/2,NIL_WIDTH,NIL_HEIGHT);text(c,'NIL',slot.x,slot.y,9,'#ffffff');});
    Object.values(nodes).forEach(n=>{const p=positions[n.id];if(!p)return;const bw=boxes[n.id],red=n.color==='red',black=n.color==='black',isDouble=doubleBlackId===n.id,cx=p.x-bw/2,cy=p.y-20;
      c.fillStyle=red?'#b72b38':black?'#20252d':P.surface;c.fillRect(cx,cy,bw,n.nil?NIL_HEIGHT:40);
      c.strokeStyle=active.has(n.id)?P.blue:P.ink;c.lineWidth=active.has(n.id)?4:1;c.strokeRect(cx,cy,bw,n.nil?NIL_HEIGHT:40);
      text(c,n.nil?'NIL':(n.keys.join(' | ')||'∅'),p.x,p.y,n.nil?9:14,red||black?'#ffffff':P.ink);
      text(c,n.id+(n.color?' · '+(red?'红':'黑'):n.leaf?' · 叶':' · 索引'),p.x,p.y-(n.nil?18:31),10,P.muted);
      if(isDouble){ // 双环 + 标签：这份额外的黑色必须先修复，二叉排序树性质仍然成立
        c.strokeStyle=P.red||'#b72b38';c.lineWidth=2.4;c.setLineDash([]);
        c.strokeRect(cx-4,cy-4,bw+8,(n.nil?NIL_HEIGHT:40)+8);
        text(c,'双黑',p.x,p.y+(n.nil?NIL_HEIGHT/2+13:33),10.5,P.red||'#b72b38');
      }
      if(n.next&&positions[n.next]){const q=positions[n.next],qw=boxes[n.next];arrow(c,p.x+bw/2,p.y+12,q.x-qw/2,q.y+12,P.green);text(c,'next',(p.x+bw/2+q.x-qw/2)/2,p.y+33,9,P.green);}
    });
    const legend=s.type==='b-plus'?'叶子保存记录 · 绿色箭头为 next · 删除后重算父索引并重接叶链':s.type==='red-black'?'红 / 黑标记颜色 · 空孩子为黑色 NIL 方块 · 双环「双黑」表示黑高亏空待修复':'t = 2 · 每结点最多 3 键 · 删除先借位、后合并';
    text(c,legend,W/2,H-24,11,P.muted);
    c.restore();
  }
  return render;
});
