const test = require('node:test');
const assert = require('node:assert/strict');
const {createPlayer} = require('../assets/js/core/player.js');
test('last snapshot notification reports stopped playback', t => {
  t.mock.timers.enable({apis: ['setInterval']});
  const player = createPlayer({steps: [{}, {}], interval: 80});
  const states = [];
  player.subscribe(() => states.push(player.isPlaying()));
  player.play();
  t.mock.timers.tick(80);
  assert.equal(states.at(-1), false);
  player.destroy();
});
test('previous at first snapshot pauses and notifies', t => {
  t.mock.timers.enable({apis: ['setInterval']});
  const player = createPlayer({steps: [{}, {}], interval: 80});
  const states = [];
  player.subscribe(() => states.push(player.isPlaying()));
  player.play();
  player.prev();
  assert.equal(states.at(-1), false);
  player.destroy();
});
