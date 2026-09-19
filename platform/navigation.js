(function (global) {
  'use strict';
  const P = global.Zhixu;
  const subjectId = document.documentElement.dataset.subject;
  const storageKey = 'zhixu-recent-v1';
  const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  P.escape = escape;
  P.validEntry = entry => entry && P.catalog.entries.find(item => item.subject === entry.subject && item.hash === entry.hash);
  P.recent = () => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(value) ? value.map(P.validEntry).filter(Boolean).slice(0, 4) : [];
    } catch (_) { return []; }
  };
  function recordVisit() {
    const entry = P.validEntry({ subject: subjectId, hash: location.hash });
    if (!entry) return;
    const entries = [entry, ...P.recent().filter(item => item.subject !== subjectId || item.hash !== entry.hash)].slice(0, 4);
    try { localStorage.setItem(storageKey, JSON.stringify(entries.map(({ subject, hash }) => ({ subject, hash })))); } catch (_) { /* Optional browsing history. */ }
  }
  const header = document.createElement('header');
  header.className = 'zx-header';
  header.id = 'platformHeader';
  const homeURL = new URL('index.html', P.root).href;
  header.innerHTML = `<a class="zx-wordmark" href="${escape(homeURL)}" aria-label="知序，返回平台总览"><span class="zx-logo" aria-hidden="true">知</span><strong>${escape(P.name)}</strong></a><span class="zx-product">408 × 考研数学 · 交互学习</span><div class="zx-header-actions">${subjectId ? `<a class="zx-home" id="platformHome" href="${escape(homeURL)}">← 平台总览</a><label class="zx-sr" for="platformSubject">切换科目</label><select class="zx-select" id="platformSubject"><option value="home">平台总览</option>${['408', 'math'].map(group => `<optgroup label="${group === '408' ? '408 计算机基础' : '考研数学'}">${P.subjects.filter(subject => subject.group === group).map(subject => `<option value="${subject.id}" ${subject.id === subjectId ? 'selected' : ''} ${subject.status !== 'ready' ? 'disabled' : ''}>${escape(subject.title)}${subject.status !== 'ready' ? ' · 待建设' : ''}</option>`).join('')}</optgroup>`).join('')}</select>` : '<span class="zx-product">把抽象知识变得直观</span>'}<button class="zx-theme" id="platformTheme" type="button"></button></div>`;
  document.body.prepend(header);
  const skip = document.createElement('a');
  skip.className = 'zx-skip';
  skip.href = '#zx-content';
  skip.textContent = '跳到学习内容';
  skip.addEventListener('click', event => { event.preventDefault(); const main = document.querySelector('main'); main?.focus(); });
  document.body.prepend(skip);
  const main = document.querySelector('main');
  if (main) { main.id = 'zx-content'; main.tabIndex = -1; }
  const themeButton = document.getElementById('platformTheme');
  function renderTheme() {
    const dark = P.Theme.get() === 'dark';
    themeButton.textContent = dark ? '☀' : '☾';
    themeButton.title = dark ? '切换浅色模式' : '切换深色模式';
    themeButton.setAttribute('aria-label', themeButton.title);
    themeButton.setAttribute('aria-pressed', String(dark));
  }
  themeButton.addEventListener('click', () => P.Theme.toggle());
  global.addEventListener('zhixu:theme', renderTheme);
  renderTheme();
  document.getElementById('platformSubject')?.addEventListener('change', event => {
    const target = event.target.value === 'home' ? homeURL : P.url(event.target.value);
    if (target) location.href = target;
  });
  global.addEventListener('hashchange', recordVisit);
  recordVisit();
})(window);
