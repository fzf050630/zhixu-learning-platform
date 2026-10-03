const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('自测题库挂在真实知识节点上且答案合法', () => {
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.Zhixu = { catalog: require(path.join(root, 'scripts/catalog.cjs')).createCatalog() };
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
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/question-audit/final-manifest.json'), 'utf8'));
    assert.equal(questions.length, manifest.nodes[nodeId].count, nodeId + ' 题数与已复核清单不符');
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

test('只有原卷对应已核验的题目可以作为真题提供', () => {
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.Zhixu = { catalog: require(path.join(root, 'scripts/catalog.cjs')).createCatalog() };
  const bankDir = path.join(root, 'platform/questions');
  for (const name of fs.readdirSync(bankDir).filter(name => name.endsWith('.js'))) {
    vm.runInNewContext(fs.readFileSync(path.join(bankDir, name), 'utf8'), sandbox, { filename: name, timeout: 5000 });
  }
  const exams = sandbox.ZhixuPastExamQuestions;
  assert.ok(exams && typeof exams === 'object');
  const valid = new Set(sandbox.Zhixu.catalog.entries.map(entry => entry.subject + ':' + entry.hash.replace(/^#\/?/, '')));
  let count = 0;
  for (const [nodeId, questions] of Object.entries(exams)) {
    assert.ok(valid.has(nodeId));
    for (const question of questions) {
      const source = question.source || {};
      assert.equal(source.kind, 'past-exam');
      assert.equal(source.verified, true, '未经核验的真题：' + question.id);
      assert.ok(source.evidence && source.nodeId === nodeId);
      assert.match(source.url, /^https:\/\//);
      assert.ok(question.options[question.answer] && question.explanation);
      count++;
    }
  }
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/question-audit/final-manifest.json'),'utf8'));
  assert.equal(count, manifest.summary.verifiedPastQuestions);
});

test('catalog joins all real curricula with valid distinct destinations', () => {
  const entry = path.join(root, 'scripts/catalog.cjs');
  assert.ok(fs.existsSync(entry), '需要课程目录生成器');
  const { createCatalog } = require(entry);
  const catalog = createCatalog();
  assert.equal(catalog.subjects['data-structures'].chapters, 8);
  assert.equal(catalog.subjects['data-structures'].items, 62);
  assert.equal(catalog.subjects['data-structures'].experiments, 54);
  assert.equal(catalog.subjects['data-structures'].experimentCategories, 6);
  assert.equal(catalog.subjects['data-structures'].knowledgeTopics, 93);
  assert.equal(catalog.subjects['data-structures'].visualizations, 58);
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
  assert.equal(catalog.entries.length, 248);
  assert.equal(new Set(catalog.entries.map(x => x.subject + x.hash)).size, 248);
  assert.ok(catalog.entries.every(entry => Number.isInteger(entry.viz) && entry.viz >= 0), '每个学习入口需要可视化数量');
  assert.ok(catalog.entries.some(x => /快速排序/.test(x.title) && x.hash === '#/lab/quick-sort'));
  assert.ok(catalog.entries.some(x => /样本空间/.test(x.title) && x.hash === '#ch1-s1'));
  assert.ok(catalog.entries.some(x => /冯·诺依曼/.test(x.title) && x.hash === '#ch1-s1'));
  assert.ok(catalog.entries.some(x => /DMA/.test(x.title) && x.hash === '#ch7-s5'));
  assert.ok(catalog.entries.some(x => x.subject === 'operating-systems' && /死锁/.test(x.title)));
  assert.ok(catalog.entries.some(x => x.subject === 'computer-networks' && /拥塞控制/.test(x.title)));
  assert.ok(catalog.entries.some(x => x.subject === 'calculus' && /洛必达/.test(x.title)));
  assert.ok(catalog.entries.some(x => x.subject === 'linear-algebra' && /特征值/.test(x.title)));
  const knowledge = catalog.entries.filter(x => x.subject === 'data-structures' && x.hash.startsWith('#/knowledge/'));
  assert.equal(knowledge.length, 8);
  assert.deepEqual(knowledge.map(x => x.hash), Array.from({ length: 8 }, (_, i) => '#/knowledge/ch' + (i + 1)));
  assert.equal(knowledge.reduce((n, x) => n + x.knowledgeTopics, 0), 93);
  assert.ok(knowledge.find(x => x.hash === '#/knowledge/ch8').keywords.includes('败者树'));
  assert.ok(catalog.entries.find(x => x.subject === 'operating-systems' && x.hash === '#ch3-s2').keywords.includes('页框回收'));
});

test('四科教材coverage逐项对应已加载正文、规则与可核验页码', () => {
  const { loadSubject } = require(path.join(root, 'scripts/catalog.cjs'));
  const subjects = [
    ['data-structures', '数据结构可视化', 404],
    ['computer-organization', '计算机组成原理可视化', 340],
    ['operating-systems', '操作系统可视化', 360],
    ['computer-networks', '计算机网络可视化', 316],
  ];
  const values = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(values)
    : value && typeof value === 'object' ? Object.values(value).flatMap(values) : [];
  const normalize = s => String(s).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, '');
  const inventory = JSON.parse(fs.readFileSync(path.join(root, 'docs/408-curricula/wangdao-source-topics.json'), 'utf8'));
  for (const [id, directory, pages] of subjects) {
    const record = JSON.parse(fs.readFileSync(path.join(root, 'docs/408-curricula', id + '-coverage.json'), 'utf8'));
    const source = inventory.subjects[id];
    assert.equal(source.pdfPages, pages);
    assert.match(source.sha256, /^[a-f0-9]{64}$/);
    const sourceDirectory = id === 'operating-systems' ? '操作系统' : id === 'computer-networks' ? '计算机网络' : directory;
    const pdf = path.join(root, sourceDirectory, source.book);
    if (fs.existsSync(pdf)) {
      const digest = require('node:crypto').createHash('sha256').update(fs.readFileSync(pdf)).digest('hex');
      assert.equal(digest, source.sha256, id + ' 本地教材已变更，需重新提取和人工核对覆盖清单');
    }
    assert.equal(record.book, source.book);
    const sourceTopics = [...source.theoryTopics, ...source.additionalTopics];
    assert.deepEqual(record.topics.map(t => t.id).sort(), sourceTopics.map(t => t.id).sort(), id + ' coverage必须与独立PDF理论目录及明确附加节点完全对应');
    assert.equal(record.subject, id);
    assert.ok(record.book.endsWith('.pdf'));
    assert.ok([2026, 2027].includes(record.version));
    assert.ok(record.topics.length > 50, id + ' coverage过少');
    assert.equal(new Set(record.topics.map(t => t.id)).size, record.topics.length, id + ' 重复主题');
    const sandbox = loadSubject(directory, src => id === 'data-structures'
      ? /^(content\/|assets\/js\/algorithms\/|assets\/js\/core\/(input-validation|graph-input)\.js)/.test(src)
      : /^content\//.test(src));
    const sections = id === 'data-structures' ? sandbox.DS.Wangdao.chapters :
      Object.keys(sandbox).filter(k => /^CH\d+$/.test(k)).flatMap(k => sandbox[k].sections);
    for (const topic of record.topics) {
      const original = sourceTopics.find(t => t.id === topic.id);
      assert.equal(topic.pdfPage, original.pdfPage, id + ':' + topic.id + ' 来源页码与PDF目录不符');
      assert.equal(normalize(topic.title), normalize(original.title), id + ':' + topic.id + ' 标题与教材原标题不符');
      assert.ok(topic.title && Number.isInteger(topic.pdfPage) && topic.pdfPage > 0 && topic.pdfPage <= pages, id + ':' + topic.id + ' 页码/标题失效');
      assert.ok(['covered', 'partial', 'missing', 'incorrect'].includes(topic.before));
      assert.ok(['verified', 'supplemented', 'corrected'].includes(topic.after));
      assert.ok(topic.changes?.length && topic.evidence?.length, id + ':' + topic.id + ' 缺修订和来源定位');
      const sectionId = topic.sectionId.replace(/^#?\/?knowledge\//, '');
      const section = sections.find(s => s.id === sectionId);
      assert.ok(section, id + ':' + topic.id + ' 失效节点 ' + topic.sectionId);
      const content = id === 'data-structures' ? section.topics.find(t => t.id === topic.id) : section;
      assert.ok(content, id + ':' + topic.id + ' 找不到独立知识正文');
      const body = normalize(values(content).join(' '));
      assert.ok(body.length > 120, id + ':' + topic.id + ' 正文过少');
      assert.ok(topic.contentAnchors?.length, id + ':' + topic.id + ' 缺锚点');
      for (const anchor of topic.contentAnchors) assert.ok(body.includes(normalize(anchor)), id + ':' + topic.id + ' 正文锚点未出现：' + anchor);
      if (id === 'data-structures') {
        assert.ok(content.paragraphs.length && content.rules.length && content.example, topic.id + ' 仅目录而无定义/规则/算例');
      }
    }
    if (id === 'data-structures') assert.equal(record.topics.length, sandbox.DS.Wangdao.topics.length);
  }
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
    assert.match(html, /platform\/questions\/past-exams\.js/);
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
