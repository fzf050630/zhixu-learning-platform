// Windows Chrome can create AppContainer-only directories in its temporary
// profile. Recursive retries compound at every directory level and hang teardown.
// See https://github.com/microsoft/playwright/issues/42109.
// Bound only Playwright's own temporary-profile cleanup; do not change ACLs,
// browser sandboxing, unrelated file operations, or test failure reporting.
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

if (process.platform === "win32") {
  const original = fs.promises.rm;
  const tempRoot = path.resolve(os.tmpdir()).toLowerCase();
  fs.promises.rm = function (target, options) {
    const resolved = typeof target === "string" ? path.resolve(target) : "";
    const profile =
      resolved &&
      path.dirname(resolved).toLowerCase() === tempRoot &&
      /^playwright_chromiumdev_profile-[\w-]+$/.test(path.basename(resolved));
    if (!profile || !options?.recursive || options.maxRetries !== 10) {
      return original.call(this, target, options);
    }
    return original
      .call(this, target, { ...options, maxRetries: 0 })
      .catch((error) => {
        console.warn(`Chrome 临时目录清理未完成 (${error.code})：${resolved}`);
        throw error;
      });
  };
}
