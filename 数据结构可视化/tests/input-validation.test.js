const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_INTEGER_ARRAY_LIMITS,
  parseIntegerArray,
} = require("../assets/js/core/input-validation.js");

test("parses comma, Chinese comma, and whitespace separated integers", () => {
  assert.deepEqual(parseIntegerArray(" 3, -1，3 0 "), {
    ok: true,
    value: [3, -1, 3, 0],
  });
});

test("accepts duplicate and boundary integers", () => {
  const { min, max, maxLength } = DEFAULT_INTEGER_ARRAY_LIMITS;
  const values = Array(maxLength).fill(min);
  values[0] = max;
  assert.deepEqual(parseIntegerArray(values.join(",")), {
    ok: true,
    value: values,
  });
  assert.deepEqual(parseIntegerArray(String(min)), {
    ok: true,
    value: [min],
  });
});

test("rejects empty, malformed, decimal, non-finite, overlong, and out-of-range input", () => {
  for (const raw of [
    "",
    "   ",
    "3,,1",
    "3, nope",
    "1.5,2",
    "NaN,2",
    "Infinity,2",
    "-1000,2",
    "3,1000",
    Array(DEFAULT_INTEGER_ARRAY_LIMITS.maxLength + 1).fill("1").join(","),
  ]) {
    const result = parseIntegerArray(raw);
    assert.equal(result.ok, false, raw);
    assert.match(result.message, /数组|整数|输入/);
  }
});

test("returns a detached array and supports per-call limits", () => {
  const result = parseIntegerArray("3,1", { maxLength: 2 });
  assert.equal(result.ok, true);
  result.value[0] = 99;
  assert.deepEqual(parseIntegerArray("3,1", { maxLength: 2 }).value, [3, 1]);
  assert.equal(parseIntegerArray("1,2,3", { maxLength: 2 }).ok, false);
});
