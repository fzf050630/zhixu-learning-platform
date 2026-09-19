(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DS = root.DS || {};
  root.DS.InputValidation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DEFAULT_INTEGER_ARRAY_LIMITS = Object.freeze({
    minLength: 1,
    maxLength: 12,
    min: -999,
    max: 999,
  });

  function failure(message) {
    return { ok: false, message };
  }

  function parseIntegerArray(raw, options = {}) {
    if (typeof raw !== "string") return failure("输入必须是文本");
    const limits = { ...DEFAULT_INTEGER_ARRAY_LIMITS, ...options };
    const source = raw.trim().replaceAll("，", ",");
    if (!source) return failure("请输入至少一个整数");

    const tokens = [];
    let token = "";
    let awaitingCommaValue = false;
    for (const character of source) {
      if (character === ",") {
        if (token.trim()) {
          tokens.push(token.trim());
          token = "";
        }
        if (awaitingCommaValue || tokens.length === 0)
          return failure("数组分隔符附近缺少整数");
        awaitingCommaValue = true;
      } else if (/\s/.test(character)) {
        if (token.trim()) {
          tokens.push(token.trim());
          token = "";
          awaitingCommaValue = false;
        }
      } else {
        token += character;
        awaitingCommaValue = false;
      }
    }
    if (token.trim()) tokens.push(token.trim());
    if (awaitingCommaValue) return failure("数组末尾缺少整数");

    if (tokens.length < limits.minLength)
      return failure("数组至少需要 " + limits.minLength + " 个整数");
    if (tokens.length > limits.maxLength)
      return failure("数组最多支持 " + limits.maxLength + " 个整数");

    const values = [];
    for (const item of tokens) {
      if (!/^[+-]?[0-9]+$/.test(item))
        return failure("“" + item + "”不是有效整数");
      const value = Number(item);
      if (!Number.isSafeInteger(value) || !Number.isFinite(value))
        return failure("“" + item + "”不是有效整数");
      if (value < limits.min || value > limits.max)
        return failure(
          "每个整数须在 " + limits.min + " 到 " + limits.max + " 之间",
        );
      values.push(value);
    }
    return { ok: true, value: values };
  }

  return { DEFAULT_INTEGER_ARRAY_LIMITS, parseIntegerArray };
});
