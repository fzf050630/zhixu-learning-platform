(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DS = root.DS || {}; root.DS.Algorithms = root.DS.Algorithms || {}; root.DS.Algorithms.linear = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const step = (id, line, message, state) => ({ id, line, message, state: structuredClone(state) });

  function sequenceInsert(input, index, value) {
    const values = input.slice();
    const out = [step('seq-start', 1, `准备在下标 ${index} 插入 ${value}`, { kind: 'array', values, active: [index], phase: 'start' })];
    for (let i = values.length - 1; i > index; i -= 1) {
      values[i] = values[i - 1];
      out.push(step(`seq-shift-${i}`, 3, `将 a[${i - 1}] 后移到 a[${i}]`, { kind: 'array', values, active: [i - 1, i], moved: i, phase: 'shift' }));
    }
    values[index] = value;
    out.push(step('seq-insert', 5, `写入 ${value}，插入完成`, { kind: 'array', values, active: [index], insertIndex: index, phase: 'done' }));
    return out;
  }

  function linkedReverse(values) {
    let remaining=values.map((value,i)=>({id:'n'+i,value})), reversed=[];
    const head=remaining[0]?.id??null, tail=remaining.at(-1)?.id??null;
    let pre=null,p=head,next=null;
    const state=(extra={})=>({kind:'linked',nodes:remaining,reversed,pointers:{head,tail,pre,p,next},...extra});
    const out=[step('list-start',2,'head 指向原首节点，tail 指向原尾节点；pre=NULL，p=head',state())];
    let n=0;
    while(remaining.length){
      const node=remaining.shift();next=remaining[0]?.id??null;
      out.push(step('list-save-'+n,4,'保存 next=p->next，p 暂存于中间行',state({floating:node,active:node.id})));
      reversed.unshift(node);
      out.push(step('list-link-'+n,5,'p->next=pre：当前节点接到已逆置段前面',state({active:node.id})));
      pre=node.id;p=next;
      out.push(step('list-advance-'+n,6,'pre=p；p=next：工作指针向前移动',state({active:node.id})));
      n++;
    }
    out.push(step('list-done',8,'head=pre，tail=原 head；逆置完成', {kind:'linked',nodes:reversed,reversed:[],pointers:{head:pre,tail:head,pre,p:null,next:null},done:true}));
    return out;
  }

  return { sequenceInsert, linkedReverse };
});
