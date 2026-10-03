(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const key = 'zhixu-theme-v1';
  const sharedKey = 'RECAORD_THEME';
  const valid = value => value === 'dark' || value === 'light';
  const read = name => { try { return localStorage.getItem(name); } catch (_) { return null; } };
  const sharedTheme = () => {
    const value = read(sharedKey);
    if (valid(value)) return value;
    if (value === 'system') return global.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return null;
  };
  const legacy = document.documentElement.dataset.subject === 'probability' ? 'kaoyan-prob-theme' : 'ds-theme';
  const saved = [sharedTheme(), read(key), read(legacy), read('kaoyan-prob-theme')].find(valid);
  document.documentElement.dataset.theme = saved || 'light';
  const syncThemeColor = theme => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.append(meta);
    }
    meta.content = theme === 'dark' ? '#141922' : '#f6f7f9';
  };
  syncThemeColor(document.documentElement.dataset.theme);
  P.Theme = {
    get: () => document.documentElement.dataset.theme,
    set(theme, persist = true) {
      if (!valid(theme)) return;
      document.documentElement.dataset.theme = theme;
      syncThemeColor(theme);
      if (persist) {
        try { [sharedKey, key, 'ds-theme', 'kaoyan-prob-theme'].forEach(name => localStorage.setItem(name, theme)); } catch (_) { /* Storage is optional. */ }
      }
      global.dispatchEvent(new CustomEvent('zhixu:theme', { detail: theme }));
    },
    toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
  };
  global.addEventListener('storage', event => {
    if ((event.key === key || event.key === sharedKey) && event.newValue !== null) {
      const current = sharedTheme() || read(key);
      if (valid(current)) P.Theme.set(current, false);
    }
  });
  global.addEventListener('pageshow', () => {
    const current = sharedTheme() || read(key);
    if (valid(current) && current !== P.Theme.get()) P.Theme.set(current, false);
  });
  global.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (read(sharedKey) === 'system') P.Theme.set(sharedTheme(), false);
  });
})(window);
