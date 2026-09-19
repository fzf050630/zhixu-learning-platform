const { defineConfig } = require('./数据结构可视化/node_modules/@playwright/test');
require('./数据结构可视化/tests/browser/windows-cleanup.cjs');
module.exports = defineConfig({
  testDir: './tests/browser',
  outputDir: './test-results/platform',
  timeout: 45000,
  workers: 1,
  use: { channel: process.env.PW_CHANNEL || 'chrome', headless: true, baseURL: 'http://127.0.0.1:8766', viewport: { width: 1440, height: 1000 }, screenshot: 'only-on-failure' },
  webServer: { command: 'node scripts/serve.cjs --port 8766', url: 'http://127.0.0.1:8766', reuseExistingServer: false },
});
