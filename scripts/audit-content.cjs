const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

const subjects = [
  ['data-structures', '数据结构可视化'],
  ['computer-organization', '计算机组成原理可视化'],
  ['operating-systems', '操作系统可视化'],
  ['computer-networks', '计算机网络可视化'],
  ['calculus', '高等数学可视化'],
  ['linear-algebra', '线性代数可视化'],
  ['probability', '概率论可视化'],
];

function loadSubject(directory) {
  const sandbox = { console: { warn() { }, error() { } } };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  const html = fs.readFileSync(path.join(root, directory, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<script\s+src="([^"]+)"/g)) {
    const src = match[1];
    const wanted = directory === '数据结构可视化'
      ? /^(content\/|assets\/js\/algorithms\/|assets\/js\/core\/(input-validation|graph-input)\.js)/.test(src)
      : /^(content\/ch\d+\.js|content\/syllabus\.js)$/.test(src);
    if (!wanted) continue;
    try {
      vm.runInContext(fs.readFileSync(path.join(root, directory, src), 'utf8'), context, { filename: src, timeout: 5000 });
    } catch (error) { /* 条目按缺失处理 */ }
  }
  return sandbox;
}

function auditDataStructures(sandbox) {
  const content = sandbox.DS && sandbox.DS.Content;
  if (!content) return { problems: ['数据结构内容未加载'] };
  const problems = [];
  if (!content.chapters.length) problems.push('缺少章节');
  if (!content.experiments.length) problems.push('缺少实验');
  const chapterIds = new Set(content.chapters.map(c => c.id));
  const orphan = content.experiments.filter(e => !chapterIds.has(e.chapter));
  if (orphan.length) problems.push(`实验章节归属失效 ${orphan.length} 个`);
  return { problems, sections: content.experiments.length, chapters: content.chapters.length };
}

function collectWidgets(directory) {
  const dir = path.join(root, directory, 'assets/js/widgets');
  const names = new Set();
  if (!fs.existsSync(dir)) return names;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.js')) continue;
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    for (const match of text.matchAll(/W\.([A-Za-z_$][\w$]*)\s*=/g)) names.add(match[1]);
  }
  return names;
}

function auditStructured(sandbox, directory) {
  const SYL = sandbox.SYL || sandbox.SYLLABUS;
  if (!SYL) return { problems: ['缺少大纲对象 SYL/SYLLABUS'] };
  const structure = SYL.structure || SYL.probStructure;
  const coverage = SYL.coverage || [];
  const problems = [];
  const widgets = collectWidgets(directory);
  const sections = [];
  for (const chapter of structure.filter(c => c.status === 'done')) {
    const data = sandbox[chapter.id.toUpperCase()];
    if (!data) { problems.push(`缺少章节内容 ${chapter.id}`); continue; }
    data.sections.forEach(section => sections.push({ chapter: chapter.id, section }));
  }
  const ids = new Set(sections.map(x => x.section.id));
  const broken = coverage.filter(row => !ids.has(row.sec));
  if (broken.length) problems.push(`覆盖表锚点失效 ${broken.length} 条：${broken.slice(0, 5).map(r => r.sec).join(', ')}`);
  const weakExamples = sections.filter(x => !(x.section.examples && x.section.examples.length)).map(x => x.section.id);
  if (weakExamples.length) problems.push(`缺例题的小节 ${weakExamples.length} 个：${weakExamples.slice(0, 8).join(', ')}`);
  const weakPitfalls = sections.filter(x => !(x.section.pitfalls && x.section.pitfalls.length)).map(x => x.section.id);
  if (weakPitfalls.length) problems.push(`缺易错点的小节 ${weakPitfalls.length} 个`);
  const missingWidgets = [...new Set(sections.flatMap(x => x.section.blocks)
    .filter(b => b.t === 'viz' && b.build && !widgets.has(b.build))
    .map(b => b.build))];
  if (missingWidgets.length) problems.push(`引用了不存在的组件：${missingWidgets.join(', ')}`);
  return { problems, sections: sections.length, chapters: structure.length, coverage: coverage.length, widgets: widgets.size };
}

let failures = 0;
for (const [id, directory] of subjects) {
  const sandbox = loadSubject(directory);
  const result = id === 'data-structures' ? auditDataStructures(sandbox) : auditStructured(sandbox, directory);
  const status = result.problems.length ? '✗' : '✓';
  if (result.problems.length) failures++;
  const extra = result.widgets ? `，组件 ${result.widgets}` : '';
  console.log(`${status} ${id}：小节 ${result.sections}${extra}，问题 ${result.problems.length}`);
  result.problems.forEach(p => console.log(`    - ${p}`));
}
console.log(failures ? `\n内容审查发现 ${failures} 个科目存在问题` : '\n内容审查通过：七个科目结构完整');
process.exitCode = failures ? 1 : 0;
