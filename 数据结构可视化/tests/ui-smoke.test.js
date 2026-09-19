const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('application shell contains required synchronized panels', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const id of ['sidebar', 'homeView', 'labView', 'stageCanvas', 'codeList', 'stepMessage', 'prevBtn', 'nextBtn', 'playBtn', 'resetBtn', 'speedRange', 'themeBtn', 'statsGrid']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /id=["']experimentInput["']/);
  assert.match(html, /assets\/js\/core\/input-validation\.js/);
  assert.match(html, /assets\/js\/ui\/experiment-input\.js/);
  assert.ok(
    html.indexOf("assets/js/core/input-validation.js") <
      html.indexOf("assets/js/algorithms/sort.js"),
  );
  const inputUi = fs.readFileSync(
    path.join(root, "assets/js/ui/experiment-input.js"),
    "utf8",
  );
  for (const id of ["applyInputBtn", "presetInputBtn"]) {
    assert.match(inputUi, new RegExp(id));
  }
  assert.match(html, /content\/chapters\.js/);
  assert.match(html, /assets\/js\/app\.js/);
});

test('visual language uses the probability-site learning-system tokens', () => {
  const css = fs.readFileSync(path.join(root, 'assets/css/main.css'), 'utf8');
  const typography = fs.readFileSync(path.join(root, 'assets/css/typography.css'), 'utf8');
  assert.match(css, /--bg:\s*#f7f6f2/i);
  assert.match(css, /--brand:\s*#315bea/i);
  assert.match(css, /\.stat-card/);
  assert.match(css, /html\[data-theme=["']dark["']\]/);
  assert.match(css, /--sans:[^;]*Microsoft YaHei/);
  assert.match(css, /--mono:[^;]*JetBrains Mono/);
  assert.match(typography, /@font-face[^}]*JetBrains Mono/s);
  assert.ok(fs.existsSync(path.join(root, 'assets/fonts/JetBrainsMono.ttf')));
});

test('canvas selects Microsoft YaHei for Chinese and JetBrains Mono for numbers', () => {
  const source = fs.readFileSync(path.join(root, 'assets/js/visualizers/canvas-scene.js'), 'utf8');
  assert.match(source, /Microsoft YaHei/);
  assert.match(source, /JetBrains Mono/);
});

test('visualizer registry supports every declared structure family', () => {
  global.DS = {};
  const renderers = require('../assets/js/visualizers/renderers.js');
  for (const name of ['array', 'linked', 'tree', 'graph', 'stack', 'queue', 'matrix', 'hash']) {
    assert.equal(typeof renderers[name], 'function', name);
  }
});
