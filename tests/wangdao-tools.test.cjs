const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({ DS: {} });
vm.runInContext(fs.readFileSync(path.join(__dirname, '../数据结构可视化/assets/js/ui/wangdao-knowledge.js'), 'utf8'), context);
const compute = context.DS.WangdaoView.compute;
const offset = result => Number(result.match(/k=(\d+)/)[1]);

test('compressed matrix address formulas agree with enumerated storage, including edges', () => {
  for (let n = 1; n <= 12; n++) {
    for (const kind of ['symmetric', 'lower', 'upper', 'tridiagonal']) {
      const slots = [];
      for (let row = 1; row <= n; row++) for (let col = 1; col <= n; col++) {
        if (kind === 'upper' ? row <= col : kind === 'tridiagonal' ? Math.abs(row - col) <= 1 : row >= col) slots.push([row, col]);
      }
      for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) {
        const result = compute('compressed-matrix', {n,i,j,kind});
        if (kind === 'tridiagonal' && Math.abs(i - j) > 1) { assert.match(result, /固定零/); continue; }
        const row = kind === 'symmetric' ? Math.max(i,j) : i;
        const col = kind === 'symmetric' ? Math.min(i,j) : j;
        const found = slots.findIndex(([r,c]) => r === row && c === col);
        assert.equal(offset(result), found < 0 ? slots.length : found, `${kind} n=${n} (${i},${j})`);
      }
    }
  }
});

test('array layouts agree with explicitly flattened row and column order', () => {
  for (let m = 1; m <= 7; m++) for (let n = 1; n <= 7; n++) {
    const rows = [], cols = [];
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) rows.push(`${i},${j}`);
    for (let j = 0; j < n; j++) for (let i = 0; i < m; i++) cols.push(`${i},${j}`);
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) for (const kind of ['row','column']) {
      assert.match(compute('matrix',{m,n,i,j,kind}), new RegExp('元素偏移 ' + (kind === 'row' ? rows : cols).indexOf(`${i},${j}`) + '；'));
    }
  }
});

test('merge pass and I/O calculations include a single initial run and insufficient buffers', () => {
  assert.match(compute('external-merge',{n:100,r:10,k:3,buffers:4}), /归并 3 趟.*归并 I\/O 600 块.*800 块/);
  assert.match(compute('external-merge',{n:5,r:1,k:2,buffers:3}), /归并 0 趟.*归并 I\/O 0 块.*10 块/);
  assert.throws(() => compute('external-merge',{n:100,r:10,k:3,buffers:3}), /至少 k\+1/);
  assert.throws(() => compute('matrix',{m:3,n:4,i:3,j:0,kind:'row'}), /整数/);
  assert.throws(() => compute('matrix',{m:3,n:4,i:'',j:0,kind:'row'}), /整数/);
  assert.throws(() => compute('compressed-matrix',{n:4,i:0,j:1,kind:'symmetric'}), /整数/);
});
