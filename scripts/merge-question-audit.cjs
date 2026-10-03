'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const version='question-quality-20261002-r2';
const subjects={'data-structures':'数据结构可视化','computer-organization':'计算机组成原理可视化','operating-systems':'操作系统可视化','computer-networks':'计算机网络可视化',calculus:'高等数学可视化','linear-algebra':'线性代数可视化',probability:'概率论可视化'};
const json=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8').replace(/^\uFEFF/,''));
const hash=q=>crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex');
const key=(nodeId,bank,id)=>[nodeId,bank,id].join('|');
const records=['ds-org','os-net','la-probability','calculus'].map(name=>json('docs/question-audit/'+name+'-review.json'));
const rows=records.flatMap(r=>r.reviewed||r.original);
const additions=records.flatMap(r=>r.additions);
const decisions=new Map(rows.map(r=>[key(r.nodeId,r.bank,r.id),r]));
assert.equal(rows.length,1736);
assert.equal(decisions.size,1736,'重复原题审阅条目');
assert.equal(additions.length,248);
const manifest={version,summary:{originalQuestions:1736,retained:0,revised:0,removed:0,added:248,finalQuestions:0,verifiedPastQuestions:0},nodes:{},subjects:{}};
const originalIndex={version:'original-before-quality-20261002',questions:[]};
const finalBanks={},past={};
const seenOriginal=new Set();
const validate=q=>{
  assert.ok(q.id&&q.stem&&q.explanation);
  assert.ok(['single','judge'].includes(q.type));
  assert.ok(q.options&&Object.hasOwn(q.options,q.answer),'答案不在选项中：'+q.id);
  assert.equal(new Set(Object.values(q.options)).size,Object.keys(q.options).length,'重复选项：'+q.id);
  assert.equal(Object.keys(q.options).length,q.type==='single'?4:2,'选项数量：'+q.id);
  if(q.source) assert.ok(q.source.kind==='past-exam'&&q.source.verified===true&&typeof q.source.evidence==='string'&&q.source.evidence.trim()&&/^https:\/\//.test(q.source.url||''),'未经核验的真题来源：'+q.id);
};
for(const subject of Object.keys(subjects)){
  const snapshot=json('tmp/question-audit-20261002/'+subject+'.json');
  const bank={};
  const stats={nodes:snapshot.nodes.length,original:0,retained:0,revised:0,removed:0,added:0,final:0};
  for(const node of snapshot.nodes){
    const final=[];
    const nodeRecord={count:0,retained:0,revised:0,removed:0,added:0,questions:[]};
    const push=(q,origin,oldId)=>{
      validate(q);
      assert.ok(!final.some(x=>x.id===q.id),'新题ID重复：'+q.id);
      assert.ok(!final.some(x=>x.stem.replace(/\s+/g,'')===q.stem.replace(/\s+/g,'')),'相同题干重复：'+node.nodeId+' '+q.id);
      final.push(q);
      nodeRecord.questions.push({id:q.id,origin,...(oldId?{oldId}:{}),sha256:hash(q)});
    };
    for(const kind of ['practice','past'])for(const q of node[kind]){
      const lookup=key(node.nodeId,kind,q.id);
      seenOriginal.add(lookup);
      originalIndex.questions.push({nodeId:node.nodeId,bank:kind,id:q.id,sha256:hash(q)});
      const row=decisions.get(lookup);
      assert.ok(row&&row.reason&&row.verification,'缺独立判据：'+lookup);
      assert.ok(['retain','revise','remove'].includes(row.action));
      stats.original++;
      const label={retain:'retained',revise:'revised',remove:'removed'}[row.action];
      stats[label]++;nodeRecord[label]++;manifest.summary[label]++;
      if(row.action==='remove')continue;
      const revised=row.action==='revise'?row.replacement:q;
      if(row.action==='revise')assert.equal(revised.id,q.id+'-r2','修订须隔离旧ID：'+q.id);
      if(kind==='past'&&row.action==='retain')assert.ok(revised.source?.verified===true,'未认证原卷却保留真题：'+q.id);
      push(revised,row.action==='retain'?'retained':'revised',row.action==='revise'?q.id:null);
    }
    const newQuestions=additions.filter(a=>a.nodeId===node.nodeId);
    assert.ok(newQuestions.length>0,'节点没有新增应用题：'+node.nodeId);
    for(const item of newQuestions){assert.ok(item.verification);push(item.question,'added');nodeRecord.added++;stats.added++;}
    assert.ok(final.length>0);
    bank[node.nodeId]=final.filter(q=>!q.source);
    const exams=final.filter(q=>q.source);
    if(exams.length)past[node.nodeId]=exams;
    nodeRecord.count=final.length;stats.final+=final.length;
    manifest.nodes[node.nodeId]=nodeRecord;
    manifest.summary.finalQuestions+=final.length;
    manifest.summary.verifiedPastQuestions+=exams.length;
  }
  finalBanks[subject]=bank;manifest.subjects[subject]=stats;
}
assert.deepEqual([...seenOriginal].sort(),[...decisions.keys()].sort(),'有错位/遗漏原题记录');
assert.equal(Object.keys(manifest.nodes).length,248);
assert.equal(manifest.summary.finalQuestions,1736-manifest.summary.removed+248);
// All validation above completes before any runtime mutation.
const questionRoot=path.join(root,'platform/questions');
for(const [subject,bank]of Object.entries(finalBanks)){
  fs.writeFileSync(path.join(questionRoot,subject+'.js'),'/* 逐题知识与质量复核后的学习练习；由审计草稿合并。 */\n(function(g){\n  g.ZhixuQuestionBankVersion='+JSON.stringify(version)+';\n  Object.assign(g.ZhixuQuestions=g.ZhixuQuestions||{},'+JSON.stringify(bank,null,2)+');\n})(window);\n');
}
fs.writeFileSync(path.join(questionRoot,'past-exams.js'),'/* 仅收纳已核验原卷对应的题目；未经认证的旧来源已撤销。 */\nwindow.ZhixuPastExamQuestions='+JSON.stringify(past,null,2)+';\n');
for(const [subject,directory]of Object.entries(subjects)){
  const htmlPath=path.join(root,directory,'index.html');
  let html=fs.readFileSync(htmlPath,'utf8').replace(/\r\n?/g,'\n');
  html=html.replace(/^[ \t]*<script src="\.\.\/platform\/questions\/[^"]+\.q5\.js"><\/script>\n/gm,'');
  html=html.replace(/^[ \t]*<script src="\.\.\/platform\/questions\/data-structures\.knowledge\.js"><\/script>\n/gm,'');
  fs.writeFileSync(htmlPath,html);
  const legacy=path.join(questionRoot,subject+'.q5.js');
  if(fs.existsSync(legacy))fs.unlinkSync(legacy);
}
const legacyKnowledge=path.join(questionRoot,'data-structures.knowledge.js');
if(fs.existsSync(legacyKnowledge))fs.unlinkSync(legacyKnowledge);
fs.writeFileSync(path.join(root,'docs/question-audit/original-index.json'),JSON.stringify(originalIndex,null,2));
fs.writeFileSync(path.join(root,'docs/question-audit/final-manifest.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest.summary,null,2));
