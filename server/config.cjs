'use strict';

const path = require('node:path');
const { loadEnv } = require('./lib/env.cjs');

loadEnv();

const root = path.resolve(__dirname, '..');

function flag(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  return /^(1|true|yes|on)$/i.test(value);
}

function number(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

const config = {
  root,
  port: number('ZHIXU_PORT', 8787),
  host: process.env.ZHIXU_HOST || '127.0.0.1',
  open: flag('ZHIXU_OPEN', false),
  dbPath: process.env.ZHIXU_DB || path.join(root, 'server', 'data', 'zhixu.db'),
  staticDir: process.env.ZHIXU_STATIC || path.join(root, 'dist'),
  algorithmVersion: 'mastery-v1',
  questionVersion: 'jev-mastery-v1',
  mastery: {
    ruleWeight: 0.7,
    jevWeight: 0.3,
    minAttempts: 3,
    recentWindow: 5,
    evaluationMinIntervalMs: number('ZHIXU_EVAL_MIN_INTERVAL_MS', 30000),
    confidence: {
      full: 0.7,
      weak: 0.45,
    },
  },
  rateLimit: {
    // 写接口按客户端 IP 限流，防止脚本批量注入
    perMinute: number('ZHIXU_RATE_PER_MIN', 60),
    perDay: number('ZHIXU_RATE_PER_DAY', 2000),
  },
  session: {
    // 设备令牌签名密钥；未配置时启动随机生成（重启后老令牌失效，前端会自动重新申请）
    secret: process.env.ZHIXU_SESSION_SECRET || '',
    ttlMs: number('ZHIXU_SESSION_TTL_MS', 30 * 24 * 3600 * 1000),
    require: flag('ZHIXU_REQUIRE_SESSION', true),
  },
  jev: {
    enabled: flag('ZHIXU_JEV_ENABLED', false),
    baseUrl: process.env.TYPESAFE_BASE_URL || 'https://api.typesafe.ai/v1',
    apiKey: process.env.TYPESAFE_API_KEY || '',
    model: process.env.TYPESAFE_MODEL || 'jev-latest',
    timeoutMs: number('TYPESAFE_TIMEOUT_MS', 20000),
    maxRetries: number('TYPESAFE_MAX_RETRIES', 2),
    // 成本保险丝：当日 Jev 调用上限（0 表示不限制）
    dailyLimit: number('ZHIXU_JEV_DAILY_LIMIT', 300),
    dailyLimitPerIp: number('ZHIXU_JEV_DAILY_LIMIT_PER_IP', 30),
  },
};

if (!config.session.secret) config.session.secret = require('./lib/session.cjs').randomSecret();

module.exports = config;
