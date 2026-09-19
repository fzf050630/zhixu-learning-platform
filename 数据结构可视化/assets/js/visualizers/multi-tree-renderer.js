(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./canvas-scene.js'):root.DS.CanvasScene);if(node)module.exports=api;root.DS=root.DS||{};root.DS.Renderers=root.DS.Renderers||{};root.DS.Renderers['multi-tree']=api;})(globalThis,function(scene){
  'use strict';
  function render(canvas,s){const {c,w,h}=scene.setup(canvas),{P,text,arrow}=scene,tree=s.tree||{},nodes=tree.nodes||{},positions={},widths={},active=new Set(s.active||[]);if(!tree.root){text(c,'空树 · NIL 为黑色',w/2,h/2,16);return;}let depth=0;
    // Match canvas-scene.text's actual 16px key font, including separators.
    const boxes={};c.font='600 16px "JetBrains Mono",Consolas,monospace';Object.values(nodes).forEach(n=>{boxes[n.id]=Math.max(58,c.measureText(n.keys.join(' | ')||'∅').width+28);});
    const slots=n=>s.type==='red-black'&&n.children.some(Boolean)?n.children:n.children.filter(Boolean);
    function measure(id,d){if(!id)return 58;const n=nodes[id];depth=Math.max(depth,d);const children=slots(n);widths[id]=Math.max(boxes[id],children.reduce((a,k)=>a+measure(k,d+1),0)+Math.max(0,children.length-1)*18);return widths[id];}measure(tree.root,0);const total=Math.max(widths[tree.root]+40,w),scale=Math.min(1,w/total);c.save();c.scale(scale,scale);const H=h/scale,W=w/scale;
    function place(id,left,d){const n=nodes[id],children=slots(n);positions[id]={x:left+widths[id]/2,y:64+d*Math.min(100,(H-155)/Math.max(1,depth))};const sum=children.reduce((a,k)=>a+(k?widths[k]:58),0)+Math.max(0,children.length-1)*18;let at=left+(widths[id]-sum)/2;children.forEach(k=>{if(k)place(k,at,d+1);at+=(k?widths[k]:58)+18;});}place(tree.root,(W-widths[tree.root])/2,0);
    Object.values(nodes).forEach(n=>{const p=positions[n.id];if(!p)return;n.children.filter(Boolean).forEach(k=>{const q=positions[k];arrow(c,p.x,p.y+20,q.x,q.y-20,P.line);});});
    Object.values(nodes).forEach(n=>{const p=positions[n.id];if(!p)return;const bw=boxes[n.id],red=n.color==='red',black=n.color==='black';c.fillStyle=red?'#b72b38':black?'#20252d':P.surface;c.fillRect(p.x-bw/2,p.y-20,bw,40);c.strokeStyle=active.has(n.id)?P.blue:P.ink;c.lineWidth=active.has(n.id)?4:1;c.strokeRect(p.x-bw/2,p.y-20,bw,40);text(c,n.keys.join(' | ')||'∅',p.x,p.y,14,red||black?'#ffffff':P.ink);text(c,n.id+(n.color?' · '+(red?'红':'黑'):n.leaf?' · 叶':' · 索引'),p.x,p.y-31,10,P.muted);if(n.next&&positions[n.next]){const q=positions[n.next],qw=boxes[n.next];arrow(c,p.x+bw/2,p.y+12,q.x-qw/2,q.y+12,P.green);text(c,'next',(p.x+bw/2+q.x-qw/2)/2,p.y+33,9,P.green);}});
    text(c,s.type==='b-plus'?'叶子保存记录 · 绿色箭头为 next':s.type==='red-black'?'红 / 黑标记颜色 · 空孩子为黑色 NIL':'t = 2 · 每结点最多 3 键',W/2,H-24,11,P.muted);c.restore();
  }
  return render;
});
