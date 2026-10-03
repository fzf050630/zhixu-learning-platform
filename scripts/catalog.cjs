const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function loadSubject(directory, filter) {
  const sandbox = { console };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  const html = fs.readFileSync(path.join(root, directory, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<script\s+src="([^"]+)"/g)) {
    if (!filter(match[1])) continue;
    vm.runInContext(fs.readFileSync(path.join(root, directory, match[1]), 'utf8'), context, { filename: match[1], timeout: 5000 });
  }
  return sandbox;
}
function createCatalog() {
  const data = loadSubject('数据结构可视化', src => /^(content\/|assets\/js\/algorithms\/|assets\/js\/core\/(input-validation|graph-input)\.js)/.test(src));
  const probability = loadSubject('概率论可视化', src => /^content\/ch\d\.js$/.test(src));
  const organization = loadSubject('计算机组成原理可视化', src => /^content\/(ch[1-7]|syllabus|wangdao-completion)\.js$/.test(src));
  const operatingSystems = loadSubject('操作系统可视化', src => /^content\/(ch[1-5]|syllabus|wangdao-completion)\.js$/.test(src));
  const networks = loadSubject('计算机网络可视化', src => /^content\/(ch[1-6]|syllabus|wangdao-completion)\.js$/.test(src));
  const calculus = loadSubject('高等数学可视化', src => /^content\/(ch[1-8]|syllabus)\.js$/.test(src));
  const algebra = loadSubject('线性代数可视化', src => /^content\/(ch[1-6]|syllabus)\.js$/.test(src));
  const ds = data.DS.Content;
  const knowledge = data.DS.Wangdao;
  if (!knowledge || !knowledge.chapters.length) throw new Error('数据结构教材知识未加载');
  const chapters = Array.from({ length: 8 }, (_, index) => probability['CH' + (index + 1)]);
  const orgChapters = Array.from({ length: 7 }, (_, index) => organization['CH' + (index + 1)]).filter(Boolean);
  const osChapters = Array.from({ length: 5 }, (_, index) => operatingSystems['CH' + (index + 1)]).filter(Boolean);
  const netChapters = Array.from({ length: 6 }, (_, index) => networks['CH' + (index + 1)]).filter(Boolean);
  const calcChapters = Array.from({ length: 8 }, (_, index) => calculus['CH' + (index + 1)]).filter(Boolean);
  const laChapters = Array.from({ length: 6 }, (_, index) => algebra['CH' + (index + 1)]).filter(Boolean);
  const entries = Array.from(ds.experiments, item => ({ subject: 'data-structures', title: item.title, chapter: ds.chapters.find(ch => ch.id === item.chapter).title, hash: '#/lab/' + item.id, kind: '算法实验', viz: 1 }));
  for (const chapter of knowledge.chapters) {
    entries.push({ subject: 'data-structures', title: chapter.title, chapter: chapter.title,
      number: String(chapter.no), hash: '#/knowledge/' + chapter.id, kind: '教材知识',
      viz: new Set(chapter.topics.filter(t => t.tool).map(t => t.tool)).size,
      knowledgeTopics: chapter.topics.length,
      keywords: chapter.topics.map(t => [t.id, t.title, ...t.rules].join(' ')).join(' ') });
  }
  for (const chapter of chapters) {
    for (const section of chapter.sections) entries.push({ subject: 'probability', title: section.title, chapter: chapter.title, number: section.num, hash: '#' + section.id, kind: '知识小节', viz: section.blocks.filter(block => block.t === 'viz').length });
  }
  for (const chapter of orgChapters) {
    for (const section of chapter.sections) entries.push({ subject: 'computer-organization', title: section.title, chapter: chapter.title, number: section.num, hash: '#' + section.id, kind: '知识小节', viz: section.blocks.filter(block => block.t === 'viz').length });
  }
  for (const chapter of osChapters) {
    for (const section of chapter.sections) entries.push({ subject: 'operating-systems', title: section.title, chapter: chapter.title, number: section.num, hash: '#' + section.id, kind: '知识小节', viz: section.blocks.filter(block => block.t === 'viz').length });
  }
  for (const chapter of netChapters) {
    for (const section of chapter.sections) entries.push({ subject: 'computer-networks', title: section.title, chapter: chapter.title, number: section.num, hash: '#' + section.id, kind: '知识小节', viz: section.blocks.filter(block => block.t === 'viz').length });
  }
  for (const chapter of calcChapters) {
    for (const section of chapter.sections) entries.push({ subject: 'calculus', title: section.title, chapter: chapter.title, number: section.num, hash: '#' + section.id, kind: '知识小节', viz: section.blocks.filter(block => block.t === 'viz').length });
  }
  for (const chapter of laChapters) {
    for (const section of chapter.sections) entries.push({ subject: 'linear-algebra', title: section.title, chapter: chapter.title, number: section.num, hash: '#' + section.id, kind: '知识小节', viz: section.blocks.filter(block => block.t === 'viz').length });
  }
  const stat = chs => ({ chapters: chs.length, items: chs.reduce((sum, ch) => sum + ch.sections.length, 0), visualizations: chs.reduce((sum, ch) => sum + ch.sections.reduce((count, sec) => count + sec.blocks.filter(block => block.t === 'viz').length, 0), 0), unit: '知识小节' });
  for (const [subject, syllabus, chs] of [
    ['computer-organization', organization.SYL, orgChapters],
    ['operating-systems', operatingSystems.SYL, osChapters],
    ['computer-networks', networks.SYL, netChapters],
  ]) {
    for (const chapter of chs) for (const section of chapter.sections) {
      const entry = entries.find(e => e.subject === subject && e.hash === '#' + section.id);
      entry.keywords = [...(syllabus.coverage || []).filter(row => row.sec === section.id).map(row => row.item),
        ...section.blocks.flatMap(block => [block.text, block.title, block.name].filter(Boolean))].join(' ');
    }
  }
  return {
    subjects: {
      'data-structures': { chapters: knowledge.chapters.length, experimentCategories: ds.chapters.length,
        experiments: ds.experiments.length, knowledgeChapters: knowledge.chapters.length,
        knowledgeTopics: knowledge.topics.length, items: ds.experiments.length + knowledge.chapters.length,
        visualizations: ds.experiments.length + new Set(knowledge.topics.filter(t => t.tool).map(t => t.tool)).size,
        unit: '学习入口' },
      probability: stat(chapters),
      'computer-organization': stat(orgChapters),
      'operating-systems': stat(osChapters),
      'computer-networks': stat(netChapters),
      calculus: stat(calcChapters),
      'linear-algebra': stat(laChapters),
    }, entries,
  };
}
function writeCatalog(destination = path.join(root, 'platform/catalog.js')) {
  const catalog = createCatalog();
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, '// Generated from subject registries. Run npm run catalog to refresh.\nwindow.Zhixu.catalog = ' + JSON.stringify(catalog, null, 2) + ';\n');
  return catalog;
}
module.exports = { createCatalog, writeCatalog, loadSubject };
if (require.main === module) {
  const catalog = writeCatalog();
  console.log(`目录已生成：${catalog.entries.length} 个学习入口`);
}
