(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DS=root.DS||{};root.DS.Algorithms=root.DS.Algorithms||{};root.DS.Algorithms.extraSort=api;})(globalThis,function(){
  'use strict';
  function sort(input,mode){
    const values=input.slice(),out=[];
    const push=(line,message,extra={})=>out.push({id:mode+'-'+out.length,line,message,state:structuredClone({kind:'array',values,...extra})});
    push(1,mode==='shell'?'希尔增量：floor(n/2)，逐次减半直到 1；不稳定':mode==='bubble'?'严格大于时才交换，冒泡排序稳定':'选择最小值与首位交换，通常不稳定');
    if(mode==='bubble')for(let end=values.length-1;end>0;end--){let changed=false;for(let j=0;j<end;j++){push(2,`比较下标 ${j} 与 ${j+1}`,{active:[j,j+1]});if(values[j]>values[j+1]){[values[j],values[j+1]]=[values[j+1],values[j]];changed=true;push(3,'交换逆序相邻项',{active:[j,j+1]});}}push(4,`一趟完成，下标 ${end} 归位`,{fixed:values.map((_,i)=>i).filter(i=>i>=end)});if(!changed){push(5,'无交换，提前结束');break;}}
    if(mode==='selection')for(let i=0;i<values.length-1;i++){let minIndex=i;for(let j=i+1;j<values.length;j++){if(values[j]<values[minIndex])minIndex=j;push(2,`扫描下标 ${j}，当前最小值下标 ${minIndex}`,{active:[j,minIndex],minIndex});}[values[i],values[minIndex]]=[values[minIndex],values[i]];push(3,`最小值放入下标 ${i}`,{active:[i,minIndex],fixed:Array.from({length:i+1},(_,k)=>k)});}
    if(mode==='shell')for(let gap=Math.floor(values.length/2);gap>0;gap=Math.floor(gap/2)){push(2,`当前增量 gap=${gap}`,{gap});for(let i=gap;i<values.length;i++){const key=values[i];let j=i;push(3,`暂存 ${key}，对子序列插入`,{gap,key,active:[i]});while(j>=gap&&values[j-gap]>key){values[j]=values[j-gap];push(4,`同组元素右移 ${gap} 格`,{gap,key,active:[j-gap,j]});j-=gap;}values[j]=key;push(5,`写回下标 ${j}`,{gap,active:[j]});}}
    push(6,'排序完成',{done:true,fixed:values.map((_,i)=>i)});return out;
  }
  return {bubbleSort:values=>sort(values,'bubble'),selectionSort:values=>sort(values,'selection'),shellSort:values=>sort(values,'shell')};
});
