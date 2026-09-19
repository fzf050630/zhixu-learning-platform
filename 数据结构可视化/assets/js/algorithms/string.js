(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DS=root.DS||{};root.DS.Algorithms=root.DS.Algorithms||{};root.DS.Algorithms.string=api;})(globalThis,function(){
  'use strict';
  function kmp(text,pattern){
    if(typeof text!=='string'||typeof pattern!=='string'||!pattern.length||!/^[\x20-\x7e]*$/.test(text)||!/^[\x20-\x7e]+$/.test(pattern))throw new Error('使用可打印 ASCII 字符；模式串不能为空');
    const pi=Array(pattern.length).fill(0),steps=[];let i=0,j=0,phase='prefix',found=null;
    const push=(line,message)=>steps.push({id:'kmp-'+steps.length,line,message,state:structuredClone({kind:'string',text,pattern,pi,i,j,phase,found})});
    push(1,'使用 0-based pi：最长相等真前后缀长度');
    for(i=1;i<pattern.length;i++){
      j=pi[i-1];push(2,`构造 pi[${i}]，从 j=${j} 开始`);
      while(j>0&&pattern[i]!==pattern[j]){j=pi[j-1];push(3,`失配，按 pi[j−1] 回退到 ${j}`);}
      if(pattern[i]===pattern[j])j++;pi[i]=j;push(4,`pi[${i}]=${j}`);
    }
    phase='match';j=0;i=0;push(5,'前缀表完成，开始匹配主串');
    for(i=0;i<text.length;i++){
      push(6,`比较主串 ${i} 与模式串 ${j}`);
      while(j>0&&text[i]!==pattern[j]){j=pi[j-1];push(7,`主串指针不回退，j=pi[j−1]=${j}`);}
      if(text[i]===pattern[j])j++;push(8,`已匹配前缀长度 ${j}`);
      if(j===pattern.length){found=i-pattern.length+1;push(9,`首次匹配起始下标 ${found}`);steps.at(-1).state.done=true;return steps;}
    }
    found=-1;push(10,'未找到匹配');steps.at(-1).state.done=true;return steps;
  }
  return {kmp};
});
