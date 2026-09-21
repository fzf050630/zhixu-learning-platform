const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('自测题库挂在真实知识节点上且答案合法', () => {
  const sandbox = { console };
  sandbox.window = sandbox;
  const bankDir = path.join(root, 'platform/questions');
  const files = fs.readdirSync(bankDir).filter(name => name.endsWith('.js'));
  assert.ok(files.length >= 7, `题库文件过少：${files.length}`);
  for (const name of files) {
    vm.runInNewContext(fs.readFileSync(path.join(bankDir, name), 'utf8'), sandbox, { filename: name, timeout: 5000 });
  }
  const bank = sandbox.ZhixuQuestions;
  assert.ok(bank && typeof bank === 'object', '需要题库');
  const { createCatalog } = require(path.join(root, 'scripts/catalog.cjs'));
  const catalog = createCatalog();
  const valid = new Set(catalog.entries.map(entry => entry.subject + ':' + entry.hash.replace(/^#\/?/, '')));
  const keys = Object.keys(bank);
  assert.ok(keys.length >= 120, `题库覆盖节点过少：${keys.length}`);
  for (const entry of catalog.entries) {
    const nodeId = entry.subject + ':' + entry.hash.replace(/^#\/?/, '');
    const questions = bank[nodeId];
    assert.ok(Array.isArray(questions), '缺少题目：' + nodeId);
    assert.equal(questions.length, 5, nodeId + ' 的题目数不是 5');
  }
  const chapters = new Map();
  for (const entry of catalog.entries) {
    if (!chapters.has(entry.subject)) chapters.set(entry.subject, new Set());
    chapters.get(entry.subject).add(entry.chapter);
  }
  const coveredChapters = new Map();
  for (const [nodeId, questions] of Object.entries(bank)) {
    assert.ok(valid.has(nodeId), '题库引用了未知节点：' + nodeId);
    const entry = catalog.entries.find(item => nodeId === item.subject + ':' + item.hash.replace(/^#\/?/, ''));
    if (!coveredChapters.has(entry.subject)) coveredChapters.set(entry.subject, new Set());
    coveredChapters.get(entry.subject).add(entry.chapter);
    assert.ok(Array.isArray(questions) && questions.length > 0, nodeId + ' 题目为空');
    const ids = new Set();
    for (const question of questions) {
      assert.ok(question.id && !ids.has(question.id), nodeId + ' 题目 ID 缺失或重复');
      ids.add(question.id);
      assert.ok(question.stem && question.stem.length > 5, nodeId + ' 题干过短');
      assert.ok(['single', 'judge'].includes(question.type), nodeId + ' 题型不合法');
      assert.ok(question.options && Object.keys(question.options).length >= 2, nodeId + ' 选项不足');
      assert.ok(Object.prototype.hasOwnProperty.call(question.options, question.answer), nodeId + ' 正确答案不在选项中');
      assert.ok(question.explanation, nodeId + ' 缺少解析');
    }
  }
  for (const [subject, set] of chapters) {
    const covered = coveredChapters.get(subject) || new Set();
    assert.equal(covered.size, set.size, subject + ' 仍有章节没有题目');
  }
});

test('catalog joins all real curricula with valid distinct destinations', () => {
  const entry = path.join(root, 'scripts/catalog.cjs');
  assert.ok(fs.existsSync(entry), '需要课程目录生成器');
  const { createCatalog } = require(entry);
  const catalog = createCatalog();
  assert.equal(catalog.subjects['data-structures'].chapters, 6);
  assert.equal(catalog.subjects['data-structures'].items, 54);
  assert.equal(catalog.subjects.probability.chapters, 8);
  assert.equal(catalog.subjects.probability.items, 44);
  assert.ok(catalog.subjects.probability.visualizations >= 92);
  assert.equal(catalog.subjects['computer-organization'].chapters, 7);
  assert.equal(catalog.subjects['computer-organization'].items, 39);
  assert.ok(catalog.subjects['computer-organization'].visualizations >= 45);
  assert.equal(catalog.subjects['operating-systems'].chapters, 5);
  assert.equal(catalog.subjects['operating-systems'].items, 16);
  assert.ok(catalog.subjects['operating-systems'].visualizations >= 23);
  assert.equal(catalog.subjects['computer-networks'].chapters, 6);
  assert.equal(catalog.subjects['computer-networks'].items, 21);
  assert.ok(catalog.subjects['computer-networks'].visualizations >= 30);
  assert.equal(catalog.subjects.calculus.chapters, 8);
  assert.equal(catalog.subjects.calculus.items, 46);
  assert.ok(catalog.subjects.calculus.visualizations >= 48);
  assert.equal(catalog.subjects['linear-algebra'].chapters, 6);
  assert.equal(catalog.subjects['linear-algebra'].items, 20);
  assert.ok(catalog.subjects['linear-algebra'].visualizations >= 30);
  assert.equal(catalog.entries.length, 240);
  assert.equal(new Set(catalog.entries.map(x => x.subject + x.hash)).size, 240);
  assert.ok(catalog.entries.every(entry => Number.isInteger(entry.viz) && entry.viz >= 0), '每个学习入口需要可视化数量');
  assert.ok(catalog.entries.some(x => /快速排序/.test(x.title) && x.hash === '#/lab/quick-sort'));
  assert.ok(catalog.entries.some(x => /样本空间/.test(x.title) && x.hash === '#ch1-s1'));
  assert.ok(catalog.entries.some(x => /冯·诺依曼/.test(x.title) && x.hash === '#ch1-s1'));
  assert.ok(catalog.entries.some(x => /DMA/.test(x.title) && x.hash === '#ch7-s5'));
  assert.ok(catalog.entries.some(x => x.subject === 'operating-systems' && /死锁/.test(x.title)));
  assert.ok(catalog.entries.some(x => x.subject === 'computer-networks' && /拥塞控制/.test(x.title)));
  assert.ok(catalog.entries.some(x => x.subject === 'calculus' && /洛必达/.test(x.title)));
  assert.ok(catalog.entries.some(x => x.subject === 'linear-algebra' && /特征值/.test(x.title)));
});

test('release contains runnable subjects but no private source artifacts', () => {
  const entry = path.join(root, 'scripts/build.cjs');
  assert.ok(fs.existsSync(entry), '需要白名单发布工具');
  const { build } = require(entry);
  build();
  const output = path.join(root, 'dist');
  assert.ok(fs.existsSync(path.join(output, 'index.html')));
  const masteryHtmlPath = path.join(output, 'mastery.html');
  assert.ok(fs.existsSync(masteryHtmlPath), '缺少掌握度页面 mastery.html');
  const masteryHtml = fs.readFileSync(masteryHtmlPath, 'utf8');
  for (const match of masteryHtml.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) {
    assert.ok(fs.existsSync(path.resolve(output, match[1])), '掌握度页面缺少资源：' + match[1]);
  }
  for (const subject of ['data-structures', 'probability', 'computer-organization', 'operating-systems', 'computer-networks', 'calculus', 'linear-algebra']) {
    const html = fs.readFileSync(path.join(output, 'subjects', subject, 'index.html'), 'utf8');
    assert.match(html, /\.\.\/\.\.\/platform\/theme\.js/);
    assert.match(html, /platform\/mastery\.js/);
    assert.match(html, /platform\/questions\/[a-z-]+\.js/);
    assert.match(html, /platform\/quiz\.js/);
    assert.match(html, /platform\/mastery-ui\.js/);
    for (const match of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g)) {
      assert.ok(fs.existsSync(path.resolve(output, 'subjects', subject, match[1])), match[1]);
    }
  }
  const files = fs.readdirSync(output, { recursive: true }).map(String);
  assert.ok(files.every(x => !/node_modules|backups|\.pdf$|\.md$|tests|_work/.test(x)));
  const subjects = fs.readFileSync(path.join(output, 'platform/subjects.js'), 'utf8');
  assert.match(subjects, /subjects\/data-structures/);
  assert.match(subjects, /subjects\/probability/);
  assert.match(subjects, /subjects\/computer-organization/);
  assert.match(subjects, /subjects\/operating-systems/);
  assert.match(subjects, /subjects\/computer-networks/);
  assert.match(subjects, /subjects\/calculus/);
  assert.match(subjects, /subjects\/linear-algebra/);
});
