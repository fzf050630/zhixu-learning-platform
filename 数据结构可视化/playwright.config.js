const { defineConfig } = require("@playwright/test");
require("./tests/browser/windows-cleanup.cjs");
module.exports = defineConfig({
  testDir: "./tests/browser",
  timeout: 60000,
  workers: 2,
  use: {
    channel: process.env.PW_CHANNEL || "chrome",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
  },
});
