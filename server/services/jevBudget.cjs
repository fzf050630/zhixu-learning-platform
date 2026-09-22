'use strict';

/* Jev 成本保险丝。
   全局：当日 Jev 调用数用 zx_jev_call_log 的当日记录估算（重启后依然有效），
         超过 ZHIXU_JEV_DAILY_LIMIT 就不再调用，交给上层回退规则引擎。
   单 IP：进程内按天计数，超过 ZHIXU_JEV_DAILY_LIMIT_PER_IP 同样回退。
   目的只有一个：别人刷接口时不会烧掉你的 TypeSafe 额度，正常学习完全不受影响。 */
const config = require('../config.cjs');
const { getDatabase } = require('../db/database.cjs');

let globalCache = { day: null, used: 0 };
const perIp = new Map();

function today() {
  return new Date().toISOString().slice(0, 10);
}

function globalUsed() {
  const day = today();
  if (globalCache.day === day) return globalCache.used;
  let used = 0;
  try {
    const row = getDatabase()
      .prepare('SELECT COUNT(*) AS n FROM zx_jev_call_log WHERE substr(created_at, 1, 10) = ?')
      .get(day);
    used = Number(row && row.n) || 0;
  } catch (_) {
    used = 0;
  }
  globalCache = { day, used };
  return used;
}

function ipBudget(ip) {
  const day = today();
  for (const [key, entry] of perIp) if (entry.day !== day) perIp.delete(key);
  if (!ip) return { used: 0, day };
  const entry = perIp.get(ip);
  if (!entry || entry.day !== day) {
    const created = { day, used: 0 };
    perIp.set(ip, created);
    return created;
  }
  return entry;
}

/* 返回 { allowed, scope }；allowed=false 时调用方应回退规则引擎。 */
function tryConsume(ip) {
  const limit = Number(config.jev.dailyLimit) || 0;
  if (limit > 0 && globalUsed() >= limit) return { allowed: false, scope: 'global', limit };
  const perIpLimit = Number(config.jev.dailyLimitPerIp) || 0;
  const entry = ipBudget(ip);
  if (perIpLimit > 0 && entry.used >= perIpLimit) return { allowed: false, scope: 'ip', limit: perIpLimit };
  entry.used += 1;
  globalCache.used = globalUsed() + 1;
  return { allowed: true, scope: null };
}

function snapshot() {
  return {
    globalUsed: globalUsed(),
    globalLimit: Number(config.jev.dailyLimit) || 0,
    perIpLimit: Number(config.jev.dailyLimitPerIp) || 0,
    trackedIps: perIp.size,
  };
}

/* 测试与运维用：清空进程内计数（全局计数会在下次查询时从数据库重新估算）。 */
function reset() {
  globalCache = { day: null, used: 0 };
  perIp.clear();
}

module.exports = { tryConsume, snapshot, reset, today };
