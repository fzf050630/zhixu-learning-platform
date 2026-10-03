'use strict';

function renderDeployConfig(template,{apiKey,sessionSecret,adminToken}){
  const values=[['TYPESAFE_API_KEY','__API_KEY__',apiKey],['ZHIXU_SESSION_SECRET','__SESSION_SECRET__',sessionSecret],['ZHIXU_ADMIN_TOKEN','__ADMIN_TOKEN__',adminToken]];
  let result=template;
  for(const [name,placeholder,value] of values){
    if(typeof value!=='string'||!value||/[\r\n]/.test(value))throw new Error('部署凭据格式不合法：'+name);
    const expression=new RegExp('^'+name+'='+placeholder+'(\\r?)$','gm');
    if((result.match(expression)||[]).length!==1)throw new Error('部署模板配置行缺失或重复：'+name);
    result=result.replace(expression,(_match,ending)=>name+'='+value+ending);
  }
  return result;
}
module.exports={renderDeployConfig};
