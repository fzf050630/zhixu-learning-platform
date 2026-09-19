(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const key = 'zhixu-theme-v1';
  const valid = value => value === 'dark' || value === 'light';
  const read = name => { try { return localStorage.getItem(name); } catch (_) { return null; } };
  const legacy = document.documentElement.dataset.subject === 'probability' ? 'kaoyan-prob-theme' : 'ds-theme';
  const saved = [read(key), read(legacy), read('kaoyan-prob-theme')].find(valid);
  document.documentElement.dataset.theme = saved || 'light';
  P.Theme = {
    get: () => document.documentElement.dataset.theme,
    set(theme, persist = true) {
      if (!valid(theme)) return;
      document.documentElement.dataset.theme = theme;
      if (persist) {
        try { [key, 'ds-theme', 'kaoyan-prob-theme'].forEach(name => localStorage.setItem(name, theme)); } catch (_) { /* Storage is optional. */ }
      }
      global.dispatchEvent(new CustomEvent('zhixu:theme', { detail: theme }));
    },
    toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
  };
  global.addEventListener('storage', event => {
    if (event.key === key && valid(event.newValue)) P.Theme.set(event.newValue, false);
  });
  global.addEventListener('pageshow', () => {
    const current = read(key);
    if (valid(current) && current !== P.Theme.get()) P.Theme.set(current, false);
  });
})(window);
