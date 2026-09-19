(function(root,factory){const node=typeof module==='object'&&module.exports;const api=factory(node?require('./canvas-scene.js'):root.DS.CanvasScene);if(node)module.exports=api;root.DS=root.DS||{};root.DS.Renderers=root.DS.Renderers||{};root.DS.Renderers.linked=api;})(globalThis,function({P,setup,text,arrow,box}){
 return function linked(canvas,s){
  const {c,w,h}=setup(canvas),nodes=s.nodes||[],rev=s.reversed||[];
  const rows=s.done?[{label:'新链表',items:nodes}]:[{label:'已逆置',items:rev},{label:'暂存 p',items:s.floating?[s.floating]:[]},{label:'待处理',items:nodes}];
  text(c,'蓝/红箭头为段首尾；实际指针见节点标签',w/2,22,10,P.ink);
  rows.forEach((row,k)=>{
   const y=s.done?h*.5:85+k*(h-115)/3;
   text(c,row.label,15,y-44,10,P.muted,'left');
   if(!row.items.length){text(c,'段首 / 段尾 = NULL',w/2,y,11,P.muted);return;}
   const cell=Math.min(82,(w-65)/row.items.length),start=(w-cell*row.items.length)/2;
   row.items.forEach((node,i)=>{
    const x=start+i*cell;
    box(c,x,y-18,cell-12,36,node.value,node.id===s.active);
    const names=Object.entries(s.pointers||{}).filter(([,id])=>id===node.id).map(([name])=>name);
    text(c,node.id,x+(cell-12)/2,y+28,8,P.muted);
    if(names.length) text(c,names.join('/'),x+(cell-12)/2,y+42,8,P.blue);
    if(i<row.items.length-1)arrow(c,x+cell-12,y,x+cell,y);
   });
   const first=start+(cell-12)/2,last=start+(row.items.length-1)*cell+(cell-12)/2;
   arrow(c,first,y-38,first,y-20,P.blue);
   text(c,row.items.length===1?'段首/尾':'段首',first,y-49,10,P.blue);
   if(row.items.length>1){arrow(c,last,y-38,last,y-20,P.red);text(c,'段尾',last,y-49,10,P.red);}
  });
  const nulls=Object.entries(s.pointers||{}).filter(([,id])=>id===null).map(([name])=>name);
  if(nulls.length)text(c,nulls.join(', ')+' → NULL',w/2,h-10,10,P.blue);
 };
});
