(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.ExperimentInput = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function createExperimentInput(container, experiment, callbacks = {}) {
    if (!container) throw new Error("输入容器缺失");
    const document = container.ownerDocument;
    const inputConfig = experiment && experiment.input;
    container.replaceChildren();
    container.hidden = !inputConfig;
    if (!inputConfig) {
      const dispose = () => {};
      dispose.setError = () => {};
      return dispose;
    }

    const form = document.createElement("form");
    form.className = "input-form";
    form.noValidate = true;

    const label = document.createElement("label");
    label.className = "input-label";
    label.htmlFor = "arrayInput";
    label.textContent = inputConfig.label;

    const field = document.createElement("input");
    field.id = "arrayInput";
    field.name = "arrayInput";
    field.type = "text";
    field.value = inputConfig.defaultValue;
    field.placeholder = inputConfig.placeholder;
    field.autocomplete = "off";
    field.spellcheck = false;
    field.setAttribute("aria-describedby", "inputHint inputError");

    const hint = document.createElement("p");
    hint.id = "inputHint";
    hint.className = "input-hint";
    hint.textContent = inputConfig.hint ||
      "输入 1–12 个整数，范围 −999 到 999；可用逗号、中文逗号或空格分隔。";

    const error = document.createElement("p");
    error.id = "inputError";
    error.className = "input-error";
    error.setAttribute("role", "alert");
    error.hidden = true;

    const actions = document.createElement("div");
    actions.className = "input-actions";
    const apply = document.createElement("button");
    apply.id = "applyInputBtn";
    apply.type = "submit";
    apply.textContent = inputConfig.fields ? "应用案例" : "应用数组";
    const preset = document.createElement("button");
    preset.id = "presetInputBtn";
    preset.type = "button";
    preset.textContent = "恢复预设";
    actions.append(apply, preset);
    form.append(label, field, hint, error, actions);
    const fields = {};
    if (inputConfig.fields) {
      form.classList.add('multi-input-form');
      label.remove(); field.remove();
      inputConfig.fields.forEach(spec => {
        const wrapper = document.createElement('label');
        wrapper.className = 'input-field';
        const title = document.createElement('span'); title.textContent = spec.label;
        const input = document.createElement(spec.type === 'textarea' ? 'textarea' : spec.type === 'select' ? 'select' : 'input');
        input.id = 'input-' + spec.name;
        input.name = spec.name;
        if (spec.options) for (const option of spec.options) {
          const el = document.createElement('option');
          el.value = typeof option === 'string' ? option : option.value;
          el.textContent = typeof option === 'string' ? option : option.label;
          input.append(el);
        }
        input.value = spec.defaultValue ?? '';
        input.setAttribute('aria-describedby', 'inputHint inputError');
        input.autocomplete = 'off'; input.spellcheck = false;
        wrapper.append(title, input); form.insertBefore(wrapper, hint);
        fields[spec.name] = input;
      });
    }
    container.append(form);
    container.hidden = false;

    // Reconcile only committed node edits; typing a partial ID must not erase edges.
    let previousNodes = fields.nodes?.value.trim().split(/[\s,，]+/) || [];
    const reconcileNodes = () => {
      const ids = fields.nodes.value.trim().split(/[\s,，]+/).filter(Boolean);
      if (ids.some(id => !/^[A-Z]$/.test(id)) || new Set(ids).size !== ids.length) return;
      const removed = previousNodes.filter(id => !ids.includes(id));
      previousNodes = ids;
      if (!removed.length) return;
      let count = 0;
      const selectedAll = fields.edges.selectionStart === 0 && fields.edges.selectionEnd === fields.edges.value.length;
      fields.edges.value = fields.edges.value.split(/[;；\n]+/).filter(line => {
        const parts = line.trim().split(/[\s,，]+/);
        const drop = removed.includes(parts[0]) || removed.includes(parts[1]);
        if (drop) count++;
        return !drop;
      }).join('\n');
      if (selectedAll) fields.edges.setSelectionRange(0, fields.edges.value.length);
      const lostStart = fields.start && removed.includes(fields.start.value.trim());
      if (lostStart) fields.start.value = '';
      setError('已删除 ' + count + ' 条关联边。' + (lostStart ? '起点已删除，请重新填写起点。' : '点击应用案例后更新图。'));
    };
    if (inputConfig.type === 'graph') fields.nodes.addEventListener('change', reconcileNodes);

    function setError(message) {
      const text = message ? String(message) : "";
      error.textContent = text;
      error.hidden = !text;
      field.setAttribute("aria-invalid", String(Boolean(text)));
      Object.values(fields).forEach(input => input.setAttribute('aria-invalid', String(Boolean(text))));
    }

    function submit(callbackName) {
      let result;
      try {
        result = inputConfig.parse(inputConfig.fields ? Object.fromEntries(Object.entries(fields).map(([name, input]) => [name, input.value])) : field.value);
      } catch (caught) {
        setError(caught && caught.message ? caught.message : "输入无效");
        return false;
      }
      if (!result || result.ok !== true || result.value === undefined) {
        setError(result && result.message ? result.message : "输入无效");
        return false;
      }
      setError("");
      const callback = callbacks[callbackName];
      if (typeof callback === "function") callback(structuredClone(result.value));
      return true;
    }

    const onSubmit = (event) => {
      event.preventDefault();
      submit("onApply");
    };
    const onPreset = () => {
      field.value = inputConfig.defaultValue;
      inputConfig.fields?.forEach(spec => { fields[spec.name].value = spec.defaultValue ?? ''; });
      previousNodes = fields.nodes?.value.trim().split(/[\s,，]+/) || [];
      submit("onPreset");
    };
    form.addEventListener("submit", onSubmit);
    preset.addEventListener("click", onPreset);

    const dispose = () => {
      if (inputConfig.type === 'graph') fields.nodes.removeEventListener('change', reconcileNodes);
      form.removeEventListener("submit", onSubmit);
      preset.removeEventListener("click", onPreset);
      container.replaceChildren();
      container.hidden = true;
    };
    dispose.setError = setError;
    dispose.field = field;
    return dispose;
  }

  return { createExperimentInput };
});
