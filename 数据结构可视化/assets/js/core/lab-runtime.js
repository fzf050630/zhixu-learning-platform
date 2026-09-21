(function (root, factory) {
  const api = factory(root.DS);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.LabRuntime = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (DS) {
  "use strict";

  function validateExperiment(experiment, renderers) {
    if (!experiment || typeof experiment.id !== "string" || !experiment.id)
      throw new Error("实验 ID 缺失");
    if (
      !Array.isArray(experiment.code) ||
      !experiment.code.length ||
      experiment.code.some((line) => typeof line !== "string")
    )
      throw new Error("伪代码必须是非空文本行数组");
    if (typeof experiment.createSteps !== "function")
      throw new Error("缺少算法步骤生成器");
    if (typeof renderers[experiment.visualizer] !== "function")
      throw new Error("未知渲染类型：" + experiment.visualizer);
  }

  function validateSteps(steps, codeLength) {
    if (!Array.isArray(steps) || !steps.length)
      throw new Error("算法没有生成快照");
    steps.forEach((step, index) => {
      if (
        !step ||
        !Number.isInteger(step.line) ||
        step.line < 1 ||
        step.line > codeLength ||
        !step.state ||
        typeof step.state !== "object" ||
        typeof step.message !== "string" ||
        !step.message.trim()
      ) {
        throw new Error(`第 ${index + 1} 步快照无效（状态、说明或伪代码行号）`);
      }
    });
  }

  // Safe lexical highlighting: every source fragment is assigned through textContent.
  function renderCode(list, lines) {
    const document = list.ownerDocument;
    list.replaceChildren(
      ...lines.map((line) => {
        const li = document.createElement("li");
        const code = document.createElement("code");
        const tokens =
          /\/\/.*$|"(?:\\.|[^"\\])*"|\b(?:void|int|bool|return|if|else|for|while|true|false|NULL|new|const)\b|\b\d+\b/g;
        let cursor = 0;
        for (const match of line.matchAll(tokens)) {
          code.append(document.createTextNode(line.slice(cursor, match.index)));
          const token = document.createElement("span");
          token.className = match[0].startsWith("//")
            ? "syntax-comment"
            : /^\d/.test(match[0])
              ? "syntax-number"
              : match[0].startsWith('"')
                ? "syntax-string"
                : "syntax-keyword";
          token.textContent = match[0];
          code.append(token);
          cursor = match.index + match[0].length;
        }
        code.append(document.createTextNode(line.slice(cursor)));
        li.append(code);
        return li;
      }),
    );
  }

  function createRuntime(elements, dependencies = DS) {
    const document = elements.canvas.ownerDocument;
    const window = document.defaultView;
    let player = null;
    let current = null;
    let unsubscribe = null;
    let detach = [];
    let highlighted = -1;
    let layout = {};
    let completed = false;

    // 掌握度系统：把实验生命周期广播为 DOM 事件，由 platform/mastery.js 采集。
    // 采集失败绝不能影响实验本身。
    function announce(type, detail) {
      try {
        if (!document || typeof document.dispatchEvent !== 'function' || !window || typeof window.CustomEvent !== 'function') return;
        document.dispatchEvent(new window.CustomEvent(type, { detail }));
      } catch (_) { /* ignore */ }
    }
    const controls = [
      elements.prev,
      elements.next,
      elements.play,
      elements.reset,
      elements.speed,
    ];

    function listen(target, event, handler) {
      target.addEventListener(event, handler);
      detach.push(() => target.removeEventListener(event, handler));
    }

    function destroy() {
      if (unsubscribe) unsubscribe();
      if (player) player.destroy();
      detach.forEach((remove) => remove());
      detach = [];
      unsubscribe = null;
      player = null;
      current = null;
      layout = {};
      highlighted = -1;
      completed = false;
      if (elements.stateTables) dependencies.StateTable.clear(elements.stateTables);
      controls.forEach((control) => {
        control.disabled = true;
      });
    }

    function fail(error) {
      destroy();
      // Reset the bitmap as well as any transform/clip left by the failed renderer.
      elements.canvas.width = elements.canvas.width;
      elements.code
        .querySelectorAll(".active")
        .forEach((line) => line.classList.remove("active"));
      elements.counter.textContent = "— / —";
      elements.play.textContent = "暂不可用";
      elements.play.setAttribute("aria-pressed", "false");
      elements.message.textContent = `实验运行失败：${error?.message || String(error)}。可切换实验后重试。`;
      elements.message.setAttribute("role", "alert");
      elements.canvas.setAttribute("aria-label", elements.message.textContent);
    }

    function guard(action) {
      try {
        action();
      } catch (error) {
        fail(error);
      }
    }

    function redraw() {
      if (player && current)
        guard(() =>
          dependencies.Renderers[current.visualizer](
            elements.canvas,
            player.current().state,
            { layout },
          ),
        );
    }

    function sync(step, index, total) {
      guard(() => {
        dependencies.Renderers[current.visualizer](elements.canvas, step.state, { layout });
        if (elements.stateTables)
          dependencies.StateTable.render(elements.stateTables, step.state, current.describeState);
        elements.canvas.setAttribute(
          "aria-label",
          `第 ${index + 1} 步，共 ${total} 步。${step.message}`,
        );
        if (highlighted !== step.line - 1) {
          elements.code.children[highlighted]?.classList.remove("active");
          const line = elements.code.children[step.line - 1];
          line.classList.add("active");
          // Scroll only the code pane, never the page or the mobile controls.
          const top =
            line.getBoundingClientRect().top -
            elements.code.getBoundingClientRect().top +
            elements.code.scrollTop;
          if (
            top < elements.code.scrollTop ||
            top + line.offsetHeight >
              elements.code.scrollTop + elements.code.clientHeight
          ) {
            elements.code.scrollTop = Math.max(
              0,
              top - elements.code.clientHeight / 2,
            );
          }
          highlighted = step.line - 1;
        }
        elements.message.textContent = step.message;
        elements.counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
        elements.prev.disabled = index === 0;
        elements.next.disabled = index === total - 1;
        elements.play.disabled = index === total - 1;
        elements.play.textContent = player.isPlaying()
          ? "暂停"
          : index === total - 1
            ? "已完成"
            : "播放";
        elements.play.setAttribute("aria-pressed", String(player.isPlaying()));
      });
      if (total > 1 && index === total - 1 && !completed) {
        completed = true;
        announce("zhixu:experiment-complete", { experimentId: current && current.id });
      }
    }

    function mount(experiment, options = {}) {
      const hasInput = Object.prototype.hasOwnProperty.call(options, "input");
      let steps;
      try {
        validateExperiment(experiment, dependencies.Renderers);
        steps = hasInput
          ? experiment.createSteps(options.input)
          : experiment.createSteps();
        validateSteps(steps, experiment.code.length);
      } catch (error) {
        if (hasInput && typeof options.onInputError === "function") {
          options.onInputError(error);
          return false;
        }
        fail(error);
        return false;
      }

      destroy();
      elements.code.replaceChildren();
      guard(() => {
        renderCode(elements.code, experiment.code);
        elements.message.setAttribute("role", "status");
        elements.code.scrollTop = 0;
        current = experiment;
        player = dependencies.Player.createPlayer({
          steps,
          interval: Number(elements.speed.value),
        });
        controls.forEach((control) => {
          control.disabled = false;
        });
        const activePlayer = player;
        const release = player.subscribe(sync);
        // subscribe emits synchronously; rendering might already have failed.
        if (player !== activePlayer) {
          release();
          return;
        }
        unsubscribe = release;
        if (elements.layoutControls && dependencies.GraphLayout && experiment.visualizer === 'graph' && steps[0].state.graph) {
          detach.push(dependencies.GraphLayout.attach(elements.canvas, elements.layoutControls, steps[0].state.graph, layout, () => player?.pause(), redraw));
        }
        const toggle = () => {
          if (player.isPlaying()) {
            player.pause();
          } else {
            announce("zhixu:experiment-start", { experimentId: current && current.id });
            player.play();
          }
        };
        listen(elements.prev, "click", () => guard(() => player.prev()));
        listen(elements.next, "click", () => guard(() => player.next()));
        listen(elements.reset, "click", () => guard(() => player.reset()));
        listen(elements.play, "click", () => guard(toggle));
        const speed = () => {
          player.setInterval(Number(elements.speed.value));
          elements.speedText.value = `${(760 / Number(elements.speed.value)).toFixed(1)}×`;
        };
        listen(elements.speed, "input", () => guard(speed));
        speed();
        listen(window, "resize", redraw);
        listen(document, "visibilitychange", () => {
          if (document.hidden && player) player.pause();
        });
        listen(document, "keydown", (event) => {
          if (
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.target.closest(
              "input, textarea, select, button, a, [contenteditable]",
            )
          )
            return;
          const action = {
            ArrowRight: () => player.next(),
            ArrowLeft: () => player.prev(),
            " ": toggle,
            Home: () => player.reset(),
          }[event.key];
          if (action) {
            event.preventDefault();
            guard(action);
          }
        });
        if (window.ResizeObserver) {
          const observer = new window.ResizeObserver(redraw);
          observer.observe(elements.canvas);
          detach.push(() => observer.disconnect());
        }
      });
      return player !== null;
    }
    return { mount, destroy, redraw };
  }
  return { createRuntime, validateExperiment, validateSteps };
});
