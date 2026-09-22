'use strict';

/* 进程内滑动窗口限流：按 key（客户端 IP）限制写接口频率。
   零依赖、无第三方；计数分段按窗口过期清理，长时间运行也不会无限占内存。 */
const config = require('../config.cjs');
const { tooMany } = require('./errors.cjs');

function createCounter({ windowMs, max }) {
  const buckets = new Map();
  return {
    hit(key, cost = 1) {
      const now = Date.now();
      const bucket = buckets.get(key);
      if (!bucket || now - bucket.start >= windowMs) {
        buckets.set(key, { start: now, count: cost });
        return { allowed: true, retryAfterMs: 0 };
      }
      if (bucket.count + cost > max) {
        return { allowed: false, retryAfterMs: windowMs - (now - bucket.start) };
      }
      bucket.count += cost;
      return { allowed: true, retryAfterMs: 0 };
    },
    sweep(now = Date.now()) {
      for (const [key, bucket] of buckets) if (now - bucket.start >= windowMs) buckets.delete(key);
    },
    size() { return buckets.size; },
  };
}

const MINUTE_MS = 60000;
const DAY_MS = 86400000;

function createRateLimiter({ perMinute = 60, perDay = 2000 } = {}) {
  const minute = createCounter({ windowMs: MINUTE_MS, max: Math.max(1, perMinute) });
  const day = createCounter({ windowMs: DAY_MS, max: Math.max(1, perDay) });
  let lastSweep = 0;
  function check(key, cost = 1) {
    const now = Date.now();
    if (now - lastSweep > MINUTE_MS) { minute.sweep(now); day.sweep(now); lastSweep = now; }
    const short = minute.hit(key, cost);
    if (!short.allowed) return { allowed: false, scope: 'minute', retryAfterMs: short.retryAfterMs };
    const long = day.hit(key, cost);
    if (!long.allowed) return { allowed: false, scope: 'day', retryAfterMs: long.retryAfterMs };
    return { allowed: true, scope: null, retryAfterMs: 0 };
  }
  return { check, perMinute, perDay, size: () => ({ minute: minute.size(), day: day.size() }) };
}

/* 全站共用的写接口限流器：阈值来自配置（ZHIXU_RATE_PER_MIN / ZHIXU_RATE_PER_DAY）。 */
const limiter = createRateLimiter(config.rateLimit);

/* 在路由开头调用：超限直接抛出 429，并带上重试建议。 */
function guard(key) {
  const result = limiter.check(key || 'unknown');
  if (result.allowed) return;
  const error = tooMany(result.scope === 'day'
    ? '今日请求次数已达上限，请明天再试'
    : '请求过于频繁，请稍后再试');
  error.details = { scope: result.scope, retryAfterMs: Math.round(result.retryAfterMs) };
  throw error;
}

module.exports = { createRateLimiter, createCounter, limiter, guard };
