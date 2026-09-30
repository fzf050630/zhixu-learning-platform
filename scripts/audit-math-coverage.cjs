'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const courses = [
  ['calculus', '高等数学可视化'],
  ['linear-algebra', '线性代数可视化'],
  ['probability', '概率论可视化'],
];
let failures = 0;
const reportData = [];

for (const [id, directory] of courses) {
  const sandbox = { console: { warn() {}, error() {} } };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  const contentDir = path.join(root, directory, 'content');
  const files = fs.readdirSync(contentDir)
    .filter(name => /^(syllabus|ch\d+)\.js$/.test(name))
    .sort((a, b) => a === 'syllabus.js' ? -1 : b === 'syllabus.js' ? 1 :
      Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  for (const file of files) {
    const full = path.join(contentDir, file);
    vm.runInContext(fs.readFileSync(full, 'utf8'), context, { filename: full, timeout: 5000 });
  }

  const syllabus = sandbox.SYL || sandbox.SYLLABUS;
  if (!syllabus) throw new Error(`${directory}: missing SYL/SYLLABUS`);
  const official = syllabus.official || {};
  const coverage = syllabus.coverage || [];
  const structure = syllabus.structure || syllabus.probStructure || [];
  const sections = new Map();
  for (const chapter of structure) {
    const data = sandbox[String(chapter.id).toUpperCase()];
    if (!data) continue;
    for (const section of data.sections || []) sections.set(section.id, section);
  }

  const expected = new Set();
  let contentCount = 0;
  let requirementCount = 0;
  for (const [chapter, source] of Object.entries(official)) {
    (source.content || []).forEach((_, index) => {
      expected.add(`content:${chapter}:${index}`);
      contentCount++;
    });
    (source.requirements || []).forEach((_, index) => {
      expected.add(`requirement:${chapter}:${index}`);
      requirementCount++;
    });
  }

  const seen = new Map();
  const errors = [];
  for (const row of coverage) {
    if (!structure.some(chapter => chapter.id === row.ch)) errors.push(`unknown chapter ${row.ch}`);
    const section = sections.get(row.sec);
    if (!section) errors.push(`invalid anchor ${row.sec}`);
    else {
      const actualTitle = String(section.title || '').trim().replace(/\s+/g, ' ');
      const numberedTitle = `${section.num || ''} ${section.title || ''}`.trim().replace(/\s+/g, ' ');
      const mappedTitle = String(row.secTitle || '').trim().replace(/\s+/g, ' ');
      if (actualTitle !== mappedTitle && numberedTitle !== mappedTitle) errors.push(`title mismatch ${row.sec}: ${mappedTitle} != ${actualTitle}`);
    }
    if (!Array.isArray(row.refs) || row.refs.length === 0) {
      errors.push(`coverage row without refs ${row.ch} ${row.item || ''}`);
      continue;
    }
    const rowRefs = new Set();
    for (const ref of row.refs) {
      if (!expected.has(ref)) { errors.push(`unknown source ref ${ref}`); continue; }
      if (ref.split(':')[1] !== row.ch) errors.push(`chapter mismatch ${ref} -> ${row.ch}`);
      if (rowRefs.has(ref)) errors.push(`duplicate source ref in one row ${ref} -> ${row.sec}`);
      rowRefs.add(ref);
      if (!seen.has(ref)) seen.set(ref, new Set());
      seen.get(ref).add(row.sec);
    }
  }
  for (const ref of expected) if (!seen.has(ref)) errors.push(`unmapped source ref ${ref}`);
  reportData.push({ id, directory, official, coverage, sections, seen });

  if (errors.length) {
    failures++;
    console.error(`✗ ${id}: ${contentCount} content, ${requirementCount} requirements, ${coverage.length} rows, ${errors.length} issues`);
    errors.forEach(error => console.error(`  - ${error}`));
  } else {
    console.log(`✓ ${id}: ${contentCount} content, ${requirementCount} requirements, ${coverage.length} rows, ${sections.size} sections`);
  }
}

if (process.argv.includes('--write-report') && failures === 0) {
  const lines = [
    '# 2026 数学一大纲逐点覆盖映射',
    '',
    '本表逐条列出官方大纲中的考试内容与考试要求，并链接到课程小节。映射由 `scripts/audit-math-coverage.cjs` 校验；同一要求可对应多个小节。',
    '',
  ];
  for (const course of reportData) {
    lines.push(`## ${course.directory}`, '');
    for (const [chapter, source] of Object.entries(course.official)) {
      lines.push(`### ${source.no || chapter}、${source.title}`, '');
      for (const [type, label] of [['content', '考试内容'], ['requirements', '考试要求']]) {
        lines.push(`#### ${label}`, '', '| 原文序号 | 官方原文 | 对应课程小节 |', '| ---: | --- | --- |');
        (source[type] || []).forEach((text, index) => {
          const ref = `${type === 'content' ? 'content' : 'requirement'}:${chapter}:${index}`;
          const targets = [...course.seen.get(ref)].map(sec => {
            const section = course.sections.get(sec);
            return `${sec} ${section.num} ${section.title}`;
          });
          lines.push(`| ${index + 1} | ${String(text).replace(/\|/g, '\\|')} | ${targets.join('<br>')} |`);
        });
        lines.push('');
      }
    }
  }
  const reportPath = path.join(root, 'docs', 'math-curricula', '2026-math-coverage.md');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
  console.log(`写入逐点覆盖表：${reportPath}`);
}

if (failures) process.exitCode = 1;
