(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./canvas-scene.js'):root.DS.CanvasScene);if(typeof module==='object'&&module.exports)module.exports=api;root.DS.Renderers=root.DS.Renderers||{};root.DS.Renderers.string=api;})(globalThis,function({P,setup,text,box}){
  return function(canvas,s){
    const {c,w,h}=setup(canvas),cell=Math.min(34,(w-40)/Math.min(16,Math.max(s.text.length,s.pattern.length,1))),cols=Math.max(1,Math.floor((w-40)/cell));
    text(c,s.phase==='prefix'?'构造 pi 前缀表':'主串与模式匹配',w/2,25,13,P.blue);
    function row(chars,y,active,label){text(c,label,20,y-24,11,P.muted,'left');[...chars].forEach((ch,i)=>{const x=20+(i%cols)*cell,yy=y+Math.floor(i/cols)*62;box(c,x,yy,cell-2,30,ch,i===active,s.found>=0&&s.found!==null&&label==='主串'&&i>=s.found&&i<s.found+s.pattern.length);text(c,i,x+(cell-2)/2,yy+43,9,P.muted);});return y+Math.ceil(chars.length/cols)*62;}
    const y=row(s.text,70,s.phase==='match'?s.i:-1,'主串');
    const end=row(s.pattern,y+35,s.phase==='prefix'?s.i:s.j,'模式串');
    text(c,'pi: '+s.pi.join('  '),20,Math.min(h-45,end+15),11,P.blue,'left');
    text(c,`i=${s.i}  j=${s.j}  ${s.found===null?'匹配尚未结束':s.found===-1?'未找到':'命中下标 '+s.found}`,w/2,h-20,11,P.muted);
  };
});
