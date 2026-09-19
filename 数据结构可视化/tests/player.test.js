const test = require('node:test');
const assert = require('node:assert/strict');
const { createPlayer } = require('../assets/js/core/player.js');

const steps = [
  { id: 's0', line: 1, message: '开始', state: {} },
  { id: 's1', line: 2, message: '处理中', state: {} },
  { id: 's2', line: 3, message: '完成', state: {} }
];

test('player moves within snapshot boundaries and resets', () => {
  const player = createPlayer({ steps, interval: 20 });
  assert.equal(player.index(), 0);
  player.prev();
  assert.equal(player.index(), 0);
  player.next();
  player.next();
  player.next();
  assert.equal(player.index(), 2);
  player.reset();
  assert.equal(player.index(), 0);
  player.destroy();
});

test('player notifies subscribers with the selected complete snapshot', () => {
  const player = createPlayer({ steps, interval: 20 });
  const seen = [];
  const unsubscribe = player.subscribe((step, index) => seen.push([step.id, index]));
  player.next();
  unsubscribe();
  player.next();
  assert.deepEqual(seen, [['s0', 0], ['s1', 1]]);
  player.destroy();
});

test('player autoplay stops at the last snapshot', async () => {
  const player = createPlayer({ steps, interval: 10 });
  player.play();
  await new Promise(resolve => setTimeout(resolve, 45));
  assert.equal(player.index(), 2);
  assert.equal(player.isPlaying(), false);
  player.destroy();
});
