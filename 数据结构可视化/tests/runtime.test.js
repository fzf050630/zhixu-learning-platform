const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validateExperiment,
  validateSteps,
} = require("../assets/js/core/lab-runtime.js");
const { defineExperiment } = require("../content/experiment.js");

function createRuntimeFixture() {
  class Target {
    constructor(ownerDocument) {
      this.ownerDocument = ownerDocument;
      this.listeners = new Map();
      this.classList = { add() {}, remove() {} };
      this.children = [];
      this.scrollTop = 0;
      this.clientHeight = 400;
      this.offsetHeight = 20;
      this.disabled = false;
      this.value = "760";
      this.textContent = "";
    }
    addEventListener(type, handler) {
      this.listeners.set(type, handler);
    }
    removeEventListener(type) {
      this.listeners.delete(type);
    }
    dispatch(type, event = {}) {
      this.listeners.get(type)?.({ target: this, ...event });
    }
    replaceChildren(...children) {
      this.children = children;
    }
    append(...children) {
      this.children.push(...children);
    }
    querySelectorAll() {
      return [];
    }
    getBoundingClientRect() {
      return { top: 0, width: 600, height: 450 };
    }
    setAttribute() {}
  }

  const window = new Target();
  const document = new Target();
  document.defaultView = window;
  document.hidden = false;
  document.createElement = () => new Target(document);
  document.createTextNode = (text) => ({ textContent: text });
  window.ResizeObserver = null;
  const elements = {
    canvas: new Target(document),
    code: new Target(document),
    message: new Target(document),
    counter: new Target(document),
    prev: new Target(document),
    next: new Target(document),
    play: new Target(document),
    reset: new Target(document),
    speed: new Target(document),
    speedText: new Target(document),
  };
  return { elements, document, window };
}

test("runtime rejects invalid configurations and malformed snapshot positions", () => {
  const config = {
    id: "demo",
    code: ["line"],
    createSteps() {},
    visualizer: "array",
  };
  const renderers = { array() {} };
  assert.doesNotThrow(() => validateExperiment(config, renderers));
  for (const broken of [
    null,
    { ...config, id: "" },
    { ...config, code: [] },
    { ...config, code: [1] },
    { ...config, createSteps: null },
    { ...config, visualizer: "missing" },
  ]) {
    assert.throws(() => validateExperiment(broken, renderers));
  }
  const step = { line: 1, state: { values: [] }, message: "就绪" };
  assert.doesNotThrow(() => validateSteps([step], 1));
  for (const steps of [
    [],
    null,
    [null],
    [{ ...step, line: 0 }],
    [{ ...step, line: 2 }],
    [{ ...step, line: 1.5 }],
    [{ ...step, state: null }],
    [{ ...step, message: "" }],
  ]) {
    assert.throws(() => validateSteps(steps, 1));
  }
});

test("experiment interface creates fresh preset arguments on every run", () => {
  const config = {
    id: "demo",
    chapter: "sort",
    title: "示例",
    visualizer: "array",
    tag: "排序",
    difficulty: "基础",
    code: ["sort();"],
    preset: () => [[3, 1, 2]],
    generator: (values) => {
      values.sort();
      return values;
    },
  };
  const experiment = defineExperiment(config);
  const first = experiment.createSteps();
  first.push(99);
  assert.deepEqual(experiment.createSteps(), [1, 2, 3]);
  assert.equal(Object.isFrozen(experiment), true);
  assert.throws(() => defineExperiment({ ...config, generator: null }));
  assert.throws(() => defineExperiment({ ...config, chapter: "" }));
  assert.throws(() => defineExperiment({ ...config, code: [] }));
  assert.throws(() =>
    defineExperiment({ ...config, preset: () => null }).createSteps(),
  );
});

test("experiment adapts normalized input without mutating its declaration", () => {
  const input = {
    type: "integer-array",
    label: "待排序数组",
    placeholder: "例如：3, 1",
    defaultValue: "9, 8",
    parse: (raw) => ({ ok: true, value: raw }),
  };
  const experiment = defineExperiment({
    id: "input-demo",
    chapter: "sort",
    title: "输入示例",
    visualizer: "array",
    tag: "排序",
    difficulty: "基础",
    code: ["sort();"],
    input,
    inputAdapter: (values) => [values],
    preset: () => [[9, 8]],
    generator: (values) => [
      { line: 1, state: { values: [...values] }, message: "完成" },
    ],
  });
  assert.deepEqual(experiment.createSteps([3, 1])[0].state.values, [3, 1]);
  assert.deepEqual(experiment.createSteps()[0].state.values, [9, 8]);
  assert.equal(Object.isFrozen(experiment.input), true);
  assert.equal(Object.isFrozen(experiment.inputAdapter), true);
  assert.equal(input.defaultValue, "9, 8");
});

test("runtime preserves the current player when candidate input fails", () => {
  const { createRuntime } = require("../assets/js/core/lab-runtime.js");
  const fixture = createRuntimeFixture();
  const realPlayer = require("../assets/js/core/player.js");
  let destroyCount = 0;
  let currentPlayer;
  const runtime = createRuntime(fixture.elements, {
    Renderers: { array() {} },
    Player: {
      createPlayer(options) {
        const player = realPlayer.createPlayer(options);
        const destroy = player.destroy;
        player.destroy = () => {
          destroyCount += 1;
          destroy();
        };
        currentPlayer = player;
        return player;
      },
    },
  });
  const experiment = {
    id: "input-runtime",
    visualizer: "array",
    code: ["sort();"],
    createSteps(input) {
      if (input === "invalid") throw new Error("输入无效");
      return [
        { line: 1, state: { values: [1] }, message: "首帧" },
        { line: 1, state: { values: [2] }, message: "末帧" },
      ];
    },
  };
  assert.equal(runtime.mount(experiment), true);
  fixture.elements.next.dispatch("click");
  assert.equal(currentPlayer.index(), 1);
  const errors = [];
  assert.equal(
    runtime.mount(experiment, {
      input: "invalid",
      onInputError: (error) => errors.push(error.message),
    }),
    false,
  );
  assert.deepEqual(errors, ["输入无效"]);
  assert.equal(destroyCount, 0);
  assert.equal(currentPlayer.index(), 1);
  runtime.destroy();
});

test("graph renders numeric distances and textual graph metrics distinctly", () => {
  const scene = require("../assets/js/visualizers/canvas-scene.js");
  const graph = require("../assets/js/visualizers/graph-renderer.js");
  const labels = [];
  const context = new Proxy(
    {
      fillText(value) {
        labels.push(value);
      },
    },
    {
      get(target, key) {
        return target[key] || (() => {});
      },
    },
  );
  const oldDocument = global.document;
  const oldStyle = global.getComputedStyle;
  global.document = { documentElement: {} };
  global.getComputedStyle = () => ({ getPropertyValue: () => "" });
  try {
    const canvas = {
      width: 0,
      height: 0,
      getBoundingClientRect: () => ({ width: 600, height: 450 }),
      getContext: () => context,
    };
    const state = {
      graph: { nodes: [{ id: "A", x: 0.5, y: 0.5 }], edges: [] },
    };
    graph(canvas, { ...state, indegrees: { A: 2 } });
    graph(canvas, { ...state, earliest: { A: 7 } });
    graph(canvas, { ...state, distances: { A: Infinity } });
    assert.ok(labels.includes("in=2"));
    assert.ok(labels.includes("ve=7"));
    assert.ok(labels.includes("∞"));
    assert.equal(canvas.width, 600);
    assert.equal(typeof scene.setup, "function");
  } finally {
    global.document = oldDocument;
    global.getComputedStyle = oldStyle;
  }
});
