(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DS.GraphLayout=api;})(globalThis,function(){
  'use strict';
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  function attach(canvas,container,graph,layout,pause,redraw){
    const document=canvas.ownerDocument,detach=[];let dragging=null,pointer=null;
    const listen=(el,event,fn)=>{el.addEventListener(event,fn);detach.push(()=>el.removeEventListener(event,fn));};
    const oldTouch=canvas.style.touchAction;canvas.style.touchAction='none';
    container.replaceChildren();container.hidden=false;
    const select=document.createElement('select');select.setAttribute('aria-label','选择要移动的顶点');
    graph.nodes.forEach(node=>{layout[node.id]={x:node.x,y:node.y};const option=document.createElement('option');option.value=node.id;option.textContent=node.id;select.append(option);});
    const label=document.createElement('label');label.textContent='移动顶点 ';label.append(select);container.append(label);
    function move(id,x,y){const rect=canvas.getBoundingClientRect(),scale=Math.min(1,rect.width/420),mx=30*scale/rect.width,my=50*scale/rect.height;layout[id]={x:clamp(x,mx,1-mx),y:clamp(y,my,1-my)};redraw();}
    for(const[label,dx,dy]of[['←',-.035,0],['→',.035,0],['↑',0,-.035],['↓',0,.035]]){const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-label','移动所选节点 '+label);listen(button,'click',()=>{pause();const p=layout[select.value];move(select.value,p.x+dx,p.y+dy);});container.append(button);}
    const reset=document.createElement('button');reset.type='button';reset.textContent='恢复布局';listen(reset,'click',()=>{pause();graph.nodes.forEach(n=>{layout[n.id]={x:n.x,y:n.y};});redraw();});container.append(reset);
    const hint=document.createElement('p');hint.textContent='拖动节点调整布局，或选择顶点后用按钮移动；移动会暂停播放，不改变算法步骤。';container.append(hint);
    function end(event){if(pointer!==null&&(!event||event.pointerId===pointer)){const id=pointer;pointer=null;dragging=null;if(canvas.hasPointerCapture?.(id))canvas.releasePointerCapture(id);}}
    listen(canvas,'pointerdown',event=>{
      if(event.button!==0||pointer!==null)return;const r=canvas.getBoundingClientRect(),scale=Math.min(1,r.width/420),x=event.clientX-r.left,y=event.clientY-r.top;
      const hit=graph.nodes.find(n=>Math.hypot(x-layout[n.id].x*r.width,y-layout[n.id].y*r.height)<=27*scale);
      if(!hit)return;event.preventDefault();pause();dragging=hit.id;select.value=hit.id;pointer=event.pointerId;canvas.setPointerCapture(pointer);
    });
    listen(canvas,'pointermove',event=>{if(event.pointerId!==pointer||!dragging)return;const r=canvas.getBoundingClientRect();move(dragging,(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])listen(canvas,type,end);
    return()=>{end();detach.forEach(fn=>fn());canvas.style.touchAction=oldTouch;container.replaceChildren();container.hidden=true;};
  }
  return {attach};
});
