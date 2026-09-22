/* 知序 · 小节导航
   在每个知识小节 / 算法实验页面底部显示「下一节」按钮，
   顺序取自平台目录（platform/catalog.js），因此七科通用。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const catalog = P.catalog;
  if (!catalog || !Array.isArray(catalog.entries)) return;
  const SUBJECT = document.documentElement.dataset.subject || '';
  if (!SUBJECT) return;
  const entries = catalog.entries.filter(entry => entry.subject === SUBJECT && entry.hash);
  if (entries.length < 2) return;

  const escape = P.escape || (text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])));

  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('section-nav.css', document.currentScript.src).href;
    document.head.appendChild(link);
  } catch (_) { /* 样式失败不影响功能 */ }

  let nav = null;
  let timer = null;
  let lastKey = null;

  function host() {
    return document.querySelector('#view') || document.querySelector('#labView') || document.querySelector('#scroll');
  }

  function currentEntry() {
    const hash = location.hash || '#/';
    return entries.find(entry => entry.hash === hash) || null;
  }

  function render() {
    const entry = currentEntry();
    if (!entry || !nav) { if (nav) nav.hidden = true; lastKey = null; return; }
    const next = entries[entries.indexOf(entry) + 1] || null;
    /* 重建会再次触发 MutationObserver，这里用签名做幂等保护，避免自我循环。 */
    const key = entry.hash + '>' + (next ? next.hash : '');
    if (key === lastKey) { nav.hidden = false; return; }
    lastKey = key;
    nav.replaceChildren();
    const label = document.createElement('span');
    label.className = 'zx-section-nav-label';
    label.textContent = next ? '本节完成，继续下一节' : '已是本科最后一节';
    nav.appendChild(label);
    if (next) {
      const link = document.createElement('a');
      link.className = 'zx-section-nav-link';
      link.href = next.hash;
      link.setAttribute('aria-label', '下一节：' + (next.number ? next.number + ' ' : '') + next.title);
      const title = document.createElement('span');
      title.textContent = (next.number ? next.number + ' ' : '') + next.title;
      const arrow = document.createElement('b');
      arrow.textContent = '→';
      link.append(title, arrow);
      nav.appendChild(link);
      const meta = document.createElement('span');
      meta.className = 'zx-section-nav-meta';
      meta.textContent = [next.chapter, next.kind === '算法实验' ? '算法实验' : ''].filter(Boolean).join(' · ');
      nav.appendChild(meta);
      nav.title = '下一节：' + escape((next.number ? next.number + ' ' : '') + next.title);
    }
    nav.hidden = false;
  }

  function mount() {
    const target = host();
    if (!target) return;
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'zx-section-nav';
      nav.setAttribute('aria-label', '小节导航');
      nav.hidden = true;
    }
    /* 内容区在切换路由时会整体重渲染，这里把按钮重新挂回内容区末尾。 */
    if (nav.parentElement !== target) target.appendChild(nav);
    render();
  }

  global.addEventListener('hashchange', () => { setTimeout(mount, 0); });
  try {
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(mount, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (_) { /* ignore */ }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  mount();
})(window);
