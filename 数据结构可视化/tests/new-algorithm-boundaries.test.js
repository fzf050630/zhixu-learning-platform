const test = require('node:test');
const assert = require('node:assert/strict');
const sort = require('../assets/js/algorithms/extra-sort.js');
const {kmp} = require('../assets/js/algorithms/string.js');
const {representations} = require('../assets/js/algorithms/graph-safe.js');

function validate(steps, lines) {
  assert.ok(steps.length);
  assert.equal(new Set(steps.map(s=>s.id)).size,steps.length);
  for(const step of steps) {
    assert.ok(Number.isInteger(step.line)&&step.line>=1&&step.line<=lines);
    assert.ok(step.message.trim());
  }
  assert.equal(steps.at(-1).state.done,true);
}
function sequences(alphabet, maxLength) {
  const result=[[]]; let level=[[]];
  for(let n=1;n<=maxLength;n++) {
    level=level.flatMap(prefix=>alphabet.map(value=>[...prefix,value]));
    result.push(...level);
  }
  return result;
}
for(const name of ['bubbleSort','selectionSort','shellSort']) {
  test(name+' matches numeric sort across exhaustive small arrays and boundary cases',()=>{
    for(const values of [...sequences([-1,0,1],5),[-999,999,0,-999],[5,4,3,2,1],Array(12).fill(7)]) {
      const before=[...values],steps=sort[name](values);
      validate(steps,6);
      assert.deepEqual(values,before);
      assert.deepEqual(steps.at(-1).state.values,[...values].sort((a,b)=>a-b));
      const first=structuredClone(steps[0]);
      steps.at(-1).state.values.push(999);
      assert.deepEqual(steps[0],first);
    }
  });
}
test('bubble exits early and shell uses floor(n/2) halving increments',()=>{
  const bubble=sort.bubbleSort([1,2,3,4]);
  assert.ok(bubble.some(s=>s.line===5));
  assert.equal(bubble.filter(s=>s.line===3).length,0);
  assert.deepEqual(sort.shellSort([12,11,10,9,8,7,6,5,4,3,2,1]).filter(s=>s.line===2).map(s=>s.state.gap),[6,3,1]);
});

test('KMP builds the expected pi table and handles first, last, missing and empty text',()=>{
  for(const [text,pattern] of [['abababacaba','ababaca'],['abc','a'],['abc','c'],['aaaaaa','aaa'],['','a'],['ab','abc'],['abc','z']]) {
    const steps=kmp(text,pattern);
    validate(steps,10);
    assert.equal(steps.at(-1).state.found,text.indexOf(pattern));
  }
  const steps=kmp('abababacaba','ababaca');
  assert.deepEqual(steps.find(s=>s.state.phase==='match').state.pi,[0,0,1,2,3,0,1]);
  const initial=structuredClone(steps[0]);
  steps.at(-1).state.pi[0]=99;
  assert.deepEqual(steps[0],initial);
  for(const args of [['abc',''],['中文','a'],['abc','中'],['abc','\n'],[null,'a']])
    assert.throws(()=>kmp(...args),/ASCII|不能为空/);
});
test('KMP matches independent search and prefix oracle for exhaustive binary strings',()=>{
  const texts=sequences(['a','b'],6).map(x=>x.join(''));
  const patterns=sequences(['a','b'],4).slice(1).map(x=>x.join(''));
  for(const pattern of patterns) {
    const expectedPi=[...pattern].map((_,i)=>{
      const prefix=pattern.slice(0,i+1);
      for(let n=i;n>0;n--)if(prefix.slice(0,n)===prefix.slice(-n))return n;
      return 0;
    });
    for(const text of texts) {
      const state=kmp(text,pattern).at(-1).state;
      assert.equal(state.found,text.indexOf(pattern));
      assert.deepEqual(state.pi,expectedPi);
    }
  }
});

for(const directed of [false,true])test('graph representation round trip directed='+directed,()=>{
  const graph={directed,nodes:['C','A','B','D'].map(id=>({id})),edges:[['A','B',0],['B','C',-3],...(directed?[['B','A',7]]:[])]};
  const before=structuredClone(graph),steps=representations(graph);
  validate(steps,5);
  assert.deepEqual(graph,before);
  const state=steps.at(-1).state;
  assert.deepEqual(state.ids,['C','A','B','D']);
  assert.deepEqual(state.lists.D,[]);
  assert.equal(state.matrix[1][2],0);
  assert.equal(state.matrix[3][0],null);
  const normalize=edges=>[...new Set(edges.map(([a,b,w])=>JSON.stringify([...(directed?[a,b]:[a,b].sort()),w])))].sort();
  const reconstructed=Object.entries(state.lists).flatMap(([from,edges])=>edges.map(([to,w])=>[from,to,w]));
  assert.deepEqual(normalize(reconstructed),normalize(graph.edges));
  const first=structuredClone(steps[0]);
  state.matrix[0][0]=99;state.lists.A.push(['D',9]);graph.edges[0][2]=99;
  assert.deepEqual(steps[0],first);
});
test('graph representation preserves singleton and rejects invalid edges',()=>{
  const g={nodes:[{id:'A'}],edges:[]};
  assert.deepEqual(representations(g).at(-1).state.matrix,[[null]]);
  for(const edges of [[['A','A',0]],[['A','B',0]],[['A','B',Infinity]]])
    assert.throws(()=>representations({...g,edges}));
});

