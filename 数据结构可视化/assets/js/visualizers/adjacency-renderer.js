(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./canvas-scene.js'):root.DS.CanvasScene);if(typeof module==='object'&&module.exports)module.exports=api;root.DS.Renderers=root.DS.Renderers||{};root.DS.Renderers.adjacency=api;})(globalThis,function({P,setup,text}){
  return function(canvas,s){
    const {c,w,h}=setup(canvas),cell=Math.min(30,(w-45)/(s.ids.length+1),(h*.48)/(s.ids.length+1)),ox=(w-cell*(s.ids.length+1))/2,oy=40;
    text(c,'邻接矩阵 → 邻接表（∅ 为无边）',w/2,20,12,P.blue);
    for(let i=0;i<=s.ids.length;i++)for(let j=0;j<=s.ids.length;j++){
      c.fillStyle=s.active?.[0]===i-1&&s.active?.[1]===j-1?P.brandSoft:P.surface;c.fillRect(ox+j*cell,oy+i*cell,cell,cell);c.strokeStyle=P.line;c.strokeRect(ox+j*cell,oy+i*cell,cell,cell);
      text(c,!i?!j?'':s.ids[j-1]:!j?s.ids[i-1]:s.matrix[i-1][j-1]===null?'∅':s.matrix[i-1][j-1],ox+(j+.5)*cell,oy+(i+.5)*cell,Math.max(7,cell*.3),P.ink);
    }
    const top=oy+cell*(s.ids.length+1)+20,gap=Math.min(25,(h-top-15)/s.ids.length);
    s.ids.forEach((id,i)=>text(c,id+' → '+(s.lists[id].map(([to,weight])=>`${to}(${weight})`).join(' → ')||'∅'),20,top+i*gap,10,P.ink,'left'));
  };
});
