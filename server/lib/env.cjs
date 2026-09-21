'use strict';

const fs = require('node:fs');
const path = require('node:path');

// 极简 .env 读取（零依赖）：仅补齐尚未设置的环境变量，不覆盖已有值。
function loadEnv(file = path.resolve(__dirname, '..', '..', '.env')) {
  if (!fs.existsSync(file)) return false;
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (_) {
    return false;
  }
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
  return true;
}

module.exports = { loadEnv };
