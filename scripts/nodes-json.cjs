'use strict';

/* 知序 · 预生成知识节点注册表
   把 catalog 转成 server/data/knowledge-nodes.json，使后端部署时无需各科源码。
   由 npm run build 自动调用，也可单独运行：node scripts/nodes-json.cjs
*/

const fs = require('node:fs');
const path = require('node:path');
const { createCatalog } = require('./catalog.cjs');
const { entryToNode } = require('../server/knowledge/nodes.cjs');

function writeNodes() {
  const catalog = createCatalog();
  const nodes = catalog.entries.map(entryToNode);
  const out = path.join(__dirname, '..', 'server', 'data', 'knowledge-nodes.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(nodes));
  return { count: nodes.length, out };
}

module.exports = { writeNodes };

if (require.main === module) {
  const result = writeNodes();
  console.log('节点注册表已生成：' + result.count + ' 个 → ' + result.out);
}
