(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Player = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function createPlayer({ steps, interval = 800 }) {
    if (!Array.isArray(steps) || steps.length === 0)
      throw new Error("steps must not be empty");
    let cursor = 0;
    let delay = interval;
    let timer = null;
    const listeners = new Set();
    const emit = () =>
      listeners.forEach((fn) => fn(steps[cursor], cursor, steps.length));
    const pause = () => {
      if (timer !== null) clearInterval(timer);
      timer = null;
    };
    const next = () => {
      if (cursor < steps.length - 1) cursor += 1;
      if (cursor === steps.length - 1) pause();
      emit();
      return steps[cursor];
    };
    const play = () => {
      if (timer !== null || cursor === steps.length - 1) return;
      timer = setInterval(next, delay);
      emit();
    };
    return {
      current: () => steps[cursor],
      index: () => cursor,
      isPlaying: () => timer !== null,
      next,
      prev() {
        pause();
        if (cursor > 0) cursor -= 1;
        emit();
        return steps[cursor];
      },
      play,
      pause() {
        pause();
        emit();
      },
      reset() {
        pause();
        cursor = 0;
        emit();
        return steps[cursor];
      },
      setInterval(ms) {
        delay = Math.max(80, Number(ms) || 800);
        if (timer !== null) {
          pause();
          play();
        }
      },
      subscribe(fn) {
        listeners.add(fn);
        fn(steps[cursor], cursor, steps.length);
        return () => listeners.delete(fn);
      },
      destroy() {
        pause();
        listeners.clear();
      },
    };
  }

  return { createPlayer };
});
