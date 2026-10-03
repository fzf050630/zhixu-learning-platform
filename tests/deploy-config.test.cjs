const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function render(template,credentials){
  const helper=path.join(root,'scripts/render-deploy-config.cjs');
  if(fs.existsSync(helper))return require(helper).renderDeployConfig(template,credentials);
  // Evaluate the existing renderer without executing its deployment side effects.
  const source=fs.readFileSync(path.join(root,'scripts/deploy.cjs'),'utf8');
  const expression=source.match(/fs\.writeFileSync\(scriptPath,\s*(template[\s\S]*?)\);/)[1];
  return vm.runInNewContext(expression,{template,...credentials});
}
test('deployment places the API key in the real environment assignment even when comments mention the placeholder first',()=>{
  const template=fs.readFileSync(path.join(root,'deploy/zhixu-remote.sh'),'utf8');
  const result=render(template,{apiKey:'unit-api-not-a-real-secret',sessionSecret:'unit-session',adminToken:'unit-admin'});
  assert.equal(result.match(/^TYPESAFE_API_KEY=(.*)$/m)[1],'unit-api-not-a-real-secret');
  assert.equal(result.match(/^ZHIXU_SESSION_SECRET=(.*)$/m)[1],'unit-session');
  assert.equal(result.match(/^ZHIXU_ADMIN_TOKEN=(.*)$/m)[1],'unit-admin');
});
test('credential replacement preserves literal dollar substitution characters',()=>{
  const template='TYPESAFE_API_KEY=__API_KEY__\nZHIXU_SESSION_SECRET=__SESSION_SECRET__\nZHIXU_ADMIN_TOKEN=__ADMIN_TOKEN__';
  const apiKey='unit-$&-$`-literal';
  assert.equal(render(template,{apiKey,sessionSecret:'session',adminToken:'admin'}).split('\n')[0],'TYPESAFE_API_KEY='+apiKey);
});
