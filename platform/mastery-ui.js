/* 知序 · 知识掌握度 UI
   在平台头部显示当前知识节点的掌握度徽标与状态卡片，
   并在目录中标注各节点的掌握百分比。后端不可用时整体隐藏。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const M = P.mastery;
  const SUBJECT = document.documentElement.dataset.subject || '';
  const canSync = location.protocol === 'http:' || location.protocol === 'https:';
  if (!canSync || !SUBJECT || !M) return;

  const API_BASE = global.ZHIXU_API_BASE
    ? String(global.ZHIXU_API_BASE).replace(/\/$/, '')
    : (P.root ? String(P.root).replace(/\/$/, '') : '');
  const CACHE_MS = 60000;
  /* 统一走带设备令牌的请求：身份由服务端签发，未带令牌会被后端 401。 */
  const apiFetch = (path, options) => (P.session && P.session.authedFetch)
    ? P.session.authedFetch(path, options)
    : fetch(API_BASE + path, options);

  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('mastery-ui.css', document.currentScript.src).href;
    document.head.appendChild(link);
  } catch (_) { /* 样式失败不影响功能 */ }

  const escape = P.escape || (text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])));

  let wrap = null;
  let badge = null;
  let panel = null;
  let currentId = null;
  let cache = { nodeId: null, data: null, at: 0 };
  let overview = { map: null, at: 0 };

  function ensureDom() {
    if (wrap) return;
    wrap = document.createElement('div');
    wrap.className = 'zx-mastery';
    badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'zx-mastery-badge';
    badge.hidden = true;
    badge.addEventListener('click', event => { event.stopPropagation(); toggle(); });
    panel = document.createElement('section');
    panel.className = 'zx-mastery-panel';
    panel.hidden = true;
    panel.setAttribute('aria-label', '知识掌握度');
    wrap.append(badge, panel);
    const host = document.querySelector('#platformHeader .zx-header-actions') || document.querySelector('.zx-header-actions');
    (host || document.body).appendChild(wrap);
    document.addEventListener('click', event => { if (wrap && !wrap.contains(event.target)) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }

  function toggle() {
    panel.hidden = !panel.hidden;
    if (!panel.hidden && currentId) fetchState(currentId, true);
  }

  function close() {
    if (panel) panel.hidden = true;
  }

  function hide() {
    if (wrap) wrap.hidden = true;
  }

  function formatReview(iso) {
    if (!iso) return '';
    const target = new Date(iso);
    if (Number.isNaN(target.getTime())) return '';
    const days = Math.round((target.getTime() - Date.now()) / 86400000);
    if (days <= 0) return '今天复习';
    if (days === 1) return '明天复习';
    if (days <= 30) return days + ' 天后复习';
    return target.toLocaleDateString('zh-CN') + ' 复习';
  }

  function wireQuiz(nodeId, host) {
    const quiz = global.ZhixuQuiz;
    if (!quiz || typeof quiz.has !== 'function' || !quiz.has(nodeId)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'zx-mastery-quiz';
    button.textContent = '开始自测（' + quiz.countFor(nodeId) + ' 题）';
    button.addEventListener('click', () => {
      close();
      quiz.open(nodeId, (cache.data && cache.data.title) || '');
    });
    host.appendChild(button);
  }

  function renderInsufficient(data) {
    const attempts = data.evidence ? data.evidence.attempts : 0;
    badge.hidden = false;
    badge.dataset.level = '';
    badge.innerHTML = '掌握度 <strong>--</strong>';
    panel.innerHTML =
      '<h3>' + escape(data.title || '当前节点') + '</h3>' +
      '<p class="zx-mastery-chapter">' + escape(data.chapter || '') + '</p>' +
      '<p class="zx-mastery-empty">掌握度 --<br>完成一些练习后即可评估' +
      (attempts ? '（已记录 ' + attempts + ' 次作答）' : '') + '。</p>';
    wireQuiz(data.nodeId, panel);
  }

  function renderEvaluated(data) {
    const mastery = data.mastery;
    const weakness = data.weakness ? data.weakness.label : '暂无明显薄弱点';
    const action = data.recommendation && data.recommendation.label ? data.recommendation.label : '继续保持';
    const review = formatReview(data.recommendation && data.recommendation.nextReviewAt);
    badge.hidden = false;
    badge.dataset.level = mastery.level;
    badge.innerHTML = '掌握度 <strong>' + mastery.score + '%</strong> · ' + escape(mastery.label);
    panel.innerHTML =
      '<h3>' + escape(data.title || '当前节点') + '</h3>' +
      '<p class="zx-mastery-chapter">' + escape(data.chapter || '') + '</p>' +
      '<div class="zx-mastery-score"><strong>' + mastery.score + '</strong><span>%</span>' +
      '<span class="zx-mastery-level">' + escape(mastery.label) + '</span></div>' +
      '<div class="zx-mastery-bar"><i style="width:' + Math.max(0, Math.min(100, mastery.score)) + '%"></i></div>' +
      '<div class="zx-mastery-facts">' +
      '<div>稳定度<b>' + Math.round(data.stability || 0) + '%</b></div>' +
      '<div>复习紧迫度<b>' + Math.round(data.reviewUrgency || 0) + '%</b></div>' +
      '<div>作答次数<b>' + (data.attemptCount || 0) + '</b></div>' +
      '<div>复习次数<b>' + (data.reviewCount || 0) + '</b></div>' +
      '</div>' +
      '<div class="zx-mastery-block"><b>当前薄弱</b>' + escape(weakness) + '</div>' +
      '<div class="zx-mastery-block"><b>下一步建议</b>' + escape(action) + (review ? ' · ' + escape(review) : '') + '</div>';
    wireQuiz(data.nodeId, panel);
  }

  function fetchState(nodeId, force) {
    ensureDom();
    wrap.hidden = false;
    if (!force && cache.nodeId === nodeId && Date.now() - cache.at < CACHE_MS) {
      render(cache.data);
      return;
    }
    badge.hidden = false;
    badge.dataset.level = '';
    badge.textContent = '掌握度 …';
    panel.innerHTML = '<p class="zx-mastery-loading">正在读取掌握度…</p>';
    apiFetch('/api/knowledge/mastery?nodeId=' + encodeURIComponent(nodeId), {
      headers: { 'X-Zhixu-User': M.userId() },
    })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('HTTP ' + response.status))))
      .then(data => {
        if (currentId !== nodeId) return;
        cache = { nodeId, data, at: Date.now() };
        render(data);
      })
      .catch(() => hide());
  }

  function render(data) {
    if (!data || data.status === 'INSUFFICIENT_DATA') renderInsufficient(data || {});
    else renderEvaluated(data);
  }

  function clearNav() {
    document.querySelectorAll('.zx-mastery-tag').forEach(tag => tag.remove());
    document.querySelectorAll('[data-zx-mastery]').forEach(element => { delete element.dataset.zxMastery; });
  }

  let knownNodes = null;
  /* 目录节点集合：只有真实的学习入口才标注掌握度。
     章节链接、平台头部跳转等同样带 # 的元素不属于目录节点，
     标注它们只会在侧栏多出一个无意义的「—」。 */
  function catalogNodeIds() {
    if (knownNodes) return knownNodes;
    knownNodes = new Set();
    const catalog = P.catalog;
    if (catalog && Array.isArray(catalog.entries)) {
      catalog.entries.forEach(entry => {
        if (entry.subject === SUBJECT && entry.hash) knownNodes.add(M.nodeIdFor(SUBJECT, entry.hash));
      });
    }
    return knownNodes;
  }

  function annotateNav() {
    if (!overview.map) return;
    const known = catalogNodeIds();
    const targets = [];
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
      // 小节导航按钮自身也是目录内的链接，不需要再叠一个掌握度标签
      if (anchor.closest('.zx-section-nav')) return;
      const href = anchor.getAttribute('href') || '';
      const index = href.indexOf('#');
      if (index >= 0) targets.push([anchor, href.slice(index)]);
    });
    document.querySelectorAll('[data-sec]').forEach(element => {
      targets.push([element, '#' + element.getAttribute('data-sec')]);
    });
    targets.forEach(([element, hash]) => {
      if (element.dataset.zxMastery) return;
      if (!hash || hash === '#' || hash === '#/') return;
      const nodeId = M.nodeIdFor(SUBJECT, hash);
      if (known.size && !known.has(nodeId)) return;
      element.dataset.zxMastery = '1';
      const state = overview.map.get(nodeId);
      const tag = document.createElement('span');
      tag.className = 'zx-mastery-tag';
      if (!state) {
        tag.classList.add('zx-mastery-tag--none');
        tag.textContent = '—';
      } else {
        tag.dataset.level = state.level;
        tag.textContent = state.mastery + '%';
      }
      element.appendChild(tag);
    });
  }

  function loadOverview(force) {
    if (!force && overview.map && Date.now() - overview.at < CACHE_MS) return;
    apiFetch('/api/learning/overview', { headers: { 'X-Zhixu-User': M.userId() } })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('HTTP ' + response.status))))
      .then(data => {
        const map = new Map();
        (data.states || []).forEach(state => map.set(state.nodeId, state));
        overview = { map, at: Date.now() };
        annotateNav();
      })
      .catch(() => { /* 目录标注是增强功能 */ });
  }

  function onRoute() {
    const node = M.currentNode;
    if (!node) { currentId = null; hide(); return; }
    if (node.id === currentId) return;
    currentId = node.id;
    close();
    fetchState(node.id, false);
    loadOverview(false);
  }

  let navTimer = null;
  try {
    const observer = new MutationObserver(() => {
      clearTimeout(navTimer);
      navTimer = setTimeout(annotateNav, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (_) { /* ignore */ }

  global.addEventListener('hashchange', onRoute);
  document.addEventListener('zhixu:mastery-refresh', () => {
    if (currentId) { cache.at = 0; fetchState(currentId, true); }
    clearNav();
    loadOverview(true);
  });
  loadOverview(true);
  onRoute();
})(window);
