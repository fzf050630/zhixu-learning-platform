const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../assets/js/algorithms/stack-queue.js');
const L=require('../assets/js/algorithms/linear.js');
test('stack rejects overflow and underflow and peek preserves top',()=>{
 const s=A.stackDemo([],[ 'pop',1,2,3,'peek','pop','pop','pop'],2);
 assert.equal(s[1].state.top,-1);
 assert.deepEqual(s[4].state.values,[1,2]);
 assert.deepEqual(s[5].state.values,[1,2]);
 assert.equal(s.at(-1).state.top,-1);
 assert.match(s[4].message,/栈满/);
});
test('queue preserves reserved slot and pointers through wrap, full and empty',()=>{
 const s=A.circularQueueDemo(3,[],['dequeue',1,2,3,'peek','dequeue',4,'dequeue','dequeue','dequeue']);
 assert.match(s[1].message,/队空/);
 assert.match(s[4].message,/队满/);
 assert.deepEqual(s[7].state.logical,[2,4]);
 assert.equal(s[7].state.rear,0);
 assert.equal(s[7].state.tail,2);
 assert.equal(s.at(-1).state.front,s.at(-1).state.rear);
 assert.equal(s.at(-1).state.tail,null);
 assert.throws(()=>A.circularQueueDemo(2,[1,2],[]));
});
test('reversal exposes exact node identities for head tail and working pointers',()=>{
 for(const values of [[],[1],[2,2,3]]){
  const steps=L.linkedReverse(values),last=steps.at(-1).state;
  assert.equal(last.pointers.head,values.length?'n'+(values.length-1):null);
  assert.equal(last.pointers.tail,values.length?'n0':null);
  for(const {state:s} of steps){
   const ids=[...s.nodes,...s.reversed,...(s.floating?[s.floating]:[])].map(n=>n.id);
   for(const id of Object.values(s.pointers))assert.ok(id===null||ids.includes(id));
  }
 }
});

