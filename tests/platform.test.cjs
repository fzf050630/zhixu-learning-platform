const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

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
  for (const subject of ['data-structures', 'probability', 'computer-organization', 'operating-systems', 'computer-networks', 'calculus', 'linear-algebra']) {
    const html = fs.readFileSync(path.join(output, 'subjects', subject, 'index.html'), 'utf8');
    assert.match(html, /\.\.\/\.\.\/platform\/theme\.js/);
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
