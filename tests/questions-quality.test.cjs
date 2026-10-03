const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function load() {
  const g = {console, Zhixu:{catalog:require('../scripts/catalog.cjs').createCatalog()}};
  g.window = g;
  for (const file of fs.readdirSync(path.join(root,'platform/questions')).filter(x=>x.endsWith('.js'))) {
    vm.runInNewContext(fs.readFileSync(path.join(root,'platform/questions',file),'utf8'),g,{filename:file});
  }
  return g;
}

test('known ambiguous, incorrect and under-specified old questions are retired',()=>{
  const g=load();
  const ids=new Set(Object.values(g.ZhixuQuestions).flat().concat(Object.values(g.ZhixuPastExamQuestions||{}).flat()).map(q=>q.id));
  for (const id of ['os-dir-4','os-env-5','la-det-8','ca-fn-5','ca-mono-4','ca-app-1','ca-field-3','ca-taylor-1','ca-ode-4']) {
    assert.ok(!ids.has(id),'旧错误/歧义题仍在运行题库中：'+id);
  }
});

test('every served question has an independently reviewed disposition and original questions are fully accounted for',()=>{
  const g=load();
  const index=JSON.parse(fs.readFileSync(path.join(root,'docs/question-audit/original-index.json'),'utf8'));
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/question-audit/final-manifest.json'),'utf8'));
  assert.equal(index.questions.length,1736);
  const drafts=['ds-org','os-net','la-probability','calculus'].map(name=>JSON.parse(fs.readFileSync(path.join(root,'docs/question-audit',name+'-review.json'),'utf8')));
  const rows=drafts.flatMap(data=>data.reviewed||data.original);
  const key=q=>[q.nodeId,q.bank,q.id].join('|');
  const originalByKey=new Map(index.questions.map(row=>[key(row),row]));
  for(const subject of Object.keys(manifest.subjects)) {
    const archive=path.join(root,'tmp/question-audit-20261002',subject+'.json');
    if(!fs.existsSync(archive)) continue;
    const snapshot=JSON.parse(fs.readFileSync(archive,'utf8'));
    for(const node of snapshot.nodes) for(const bank of ['practice','past']) for(const q of node[bank]) {
      const digest=require('node:crypto').createHash('sha256').update(JSON.stringify(q)).digest('hex');
      assert.equal(digest,originalByKey.get(key({nodeId:node.nodeId,bank,id:q.id}))?.sha256,'原题归档与索引不符：'+q.id);
    }
  }
  const expected=new Map();
  for(const row of rows.filter(row=>row.action!=='remove')) {
    const old=originalByKey.get(key(row));
    expected.set(row.nodeId+'|'+(row.replacement?.id||row.id),row.action==='retain'?{sha256:old.sha256}:{question:row.replacement});
  }
  for(const item of drafts.flatMap(d=>d.additions)) expected.set(item.nodeId+'|'+item.question.id,{question:item.question});
  assert.deepEqual(rows.map(key).sort(),index.questions.map(key).sort());
  assert.equal(new Set(rows.map(key)).size,1736);
  for(const row of rows) assert.ok(row.reason&&row.verification,'缺逐题判据：'+row.id);
  const retired=new Set(rows.filter(r=>r.action!=='retain').map(r=>r.nodeId+'|'+r.id));
  let total=0;
  for(const entry of g.Zhixu.catalog.entries){
    const nodeId=entry.subject+':'+entry.hash.replace(/^#\/?/,'');
    const questions=[...(g.ZhixuQuestions[nodeId]||[]),...(g.ZhixuPastExamQuestions[nodeId]||[])];
    assert.ok(questions.length>0,'小节无可答题：'+nodeId);
    assert.equal(questions.length,manifest.nodes[nodeId].count);
    assert.ok(questions.some(q=>q.id.startsWith('qa-20261002-')),'无新增应用题：'+nodeId);
    assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
    for(const q of questions){
      assert.ok(!retired.has(nodeId+'|'+q.id),'旧被修订/删除题仍被提供');
      assert.ok(q.options[q.answer]);
      assert.equal(new Set(Object.values(q.options)).size,Object.keys(q.options).length,'重复选项：'+q.id);
      const digest=require('node:crypto').createHash('sha256').update(JSON.stringify(q)).digest('hex');
      assert.equal(digest,manifest.nodes[nodeId].questions.find(row=>row.id===q.id)?.sha256,'正文与已审稿不一致：'+q.id);
      const approved=expected.get(nodeId+'|'+q.id);
      assert.ok(approved,'运行题未出现在审阅草稿：'+q.id);
      const draftDigest=approved.question?require('node:crypto').createHash('sha256').update(JSON.stringify(approved.question)).digest('hex'):approved.sha256;
      assert.equal(digest,draftDigest,'已审草稿变更后尚未合并：'+q.id);
      if(q.source) assert.ok(q.source.verified===true&&q.source.evidence,'未核验题被标真题：'+q.id);
    }
    total+=questions.length;
  }
  assert.equal(total,manifest.summary.finalQuestions);
  assert.equal(g.ZhixuQuestionBankVersion,manifest.version);
});
