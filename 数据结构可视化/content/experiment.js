(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.Experiments = api;
})(globalThis, function () {
  "use strict";
  function defineExperiment(config) {
    for (const field of [
      "id",
      "chapter",
      "title",
      "visualizer",
      "tag",
      "difficulty",
    ]) {
      if (typeof config[field] !== "string" || !config[field].trim())
        throw new Error(`实验缺少 ${field}`);
    }
    if (
      typeof config.generator !== "function" ||
      typeof config.preset !== "function"
    )
      throw new Error("实验需要 generator 和 preset");
    if (
      !Array.isArray(config.code) ||
      !config.code.length ||
      config.code.some((line) => typeof line !== "string")
    )
      throw new Error("实验需要伪代码");
    let input;
    let inputAdapter;
    if (config.input !== undefined) {
      if (
        !config.input ||
        typeof config.input !== "object" ||
        Array.isArray(config.input)
      )
        throw new Error("实验输入描述无效");
      for (const field of [
        "type",
        "label",
        "placeholder",
        "defaultValue",
      ]) {
        if (
          typeof config.input[field] !== "string" ||
          !config.input[field].trim()
        )
          throw new Error("实验输入缺少 " + field);
      }
      if (typeof config.input.parse !== "function")
        throw new Error("实验输入需要 parse");
      if (typeof config.inputAdapter !== "function")
        throw new Error("实验输入需要 inputAdapter");
      input = Object.freeze({ ...config.input });
      inputAdapter = function adaptInput(normalizedInput) {
        return config.inputAdapter(normalizedInput);
      };
      Object.freeze(inputAdapter);
    }
    return Object.freeze({
      ...config,
      code: Object.freeze([...config.code]),
      ...(input ? { input, inputAdapter } : {}),
      createSteps(normalizedInput) {
        const args =
          normalizedInput === undefined
            ? config.preset()
            : inputAdapter(normalizedInput);
        if (!Array.isArray(args))
          throw new Error("preset 必须返回算法参数数组");
        return config.generator(...args);
      },
    });
  }
  return { defineExperiment };
});
