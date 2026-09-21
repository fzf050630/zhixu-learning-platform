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
  jev: {
    enabled: flag('ZHIXU_JEV_ENABLED', false),
    baseUrl: process.env.TYPESAFE_BASE_URL || 'https://api.typesafe.ai/v1',
    apiKey: process.env.TYPESAFE_API_KEY || '',
    model: process.env.TYPESAFE_MODEL || 'jev-latest',
    timeoutMs: number('TYPESAFE_TIMEOUT_MS', 20000),
    maxRetries: number('TYPESAFE_MAX_RETRIES', 2),
  },
};

module.exports = config;
