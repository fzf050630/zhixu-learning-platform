/* 知序 · 学习行为采集
   把浏览器里的学习行为记录成 LearningEvent，批量发送到知序后端。
   离线（file://）或后端不可用时静默降级，绝不影响学习流程。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const SUBJECT = document.documentElement.dataset.subject || '';
  const API_BASE = global.ZHIXU_API_BASE
    ? String(global.ZHIXU_API_BASE).replace(/\/$/, '')
    : (P.root ? String(P.root).replace(/\/$/, '') : '');
  const UID_KEY = 'zhixu-uid-v1';
  const QUEUE_LIMIT = 20;
  const FLUSH_DELAY = 1500;
  const DWELL_MS = 20000;
  const canSync = location.protocol === 'http:' || location.protocol === 'https:';

  function randomId() {
    try {
      if (global.crypto && global.crypto.randomUUID) return global.crypto.randomUUID();
    } catch (_) { /* fall through */ }
    return 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function userId() {
    try {
      const stored = localStorage.getItem(UID_KEY);
      if (stored) return stored;
      const created = randomId();
      localStorage.setItem(UID_KEY, created);
      return created;
    } catch (_) {
      return 'anonymous';
    }
  }

  function nodeIdFor(subject, hash) {
    return subject + ':' + String(hash || '').replace(/^#\/?/, '');
  }

  function entryFor(subject, hash) {
    const catalog = P.catalog;
    if (!catalog || !Array.isArray(catalog.entries)) return null;
    return catalog.entries.find(item => item.subject === subject && item.hash === hash) || null;
  }

  const queue = [];
  let timer = null;
  let currentNode = null;
  let contentReadTimer = null;
  const announced = new Set();

  function flush(useBeacon) {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!queue.length) return;
    const batch = queue.splice(0, queue.length);
    if (!canSync) return;
    const url = API_BASE + '/api/learning/events';
    const body = JSON.stringify({ userId: userId(), events: batch });
    if (useBeacon && navigator.sendBeacon) {
      try {
        navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
        return;
      } catch (_) { /* fall back to fetch */ }
    }
    try {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Zhixu-User': userId() },
        body,
        keepalive: true,
      }).then(response => {
        if (response.ok) {
          try { document.dispatchEvent(new CustomEvent('zhixu:mastery-refresh')); } catch (_) { /* ignore */ }
        }
      }).catch(() => { /* 后端不可用时静默丢弃 */ });
    } catch (_) { /* ignore */ }
  }

  function schedule() {
    if (timer) return;
    timer = setTimeout(() => flush(false), FLUSH_DELAY);
  }

  function track(type, data) {
    if (!SUBJECT || !currentNode) return;
    queue.push({
      eventId: userId() + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      knowledgeNodeId: currentNode.id,
      subject: SUBJECT,
      type,
      data: data || {},
      occurredAt: new Date().toISOString(),
    });
    if (queue.length >= QUEUE_LIMIT) flush(false);
    else schedule();
  }

  function resolveCurrentNode() {
    const hash = location.hash || '';
    if (!hash || hash === '#/' || hash === '#') return null;
    const entry = entryFor(SUBJECT, hash);
    return {
      id: nodeIdFor(SUBJECT, hash),
      hash,
      title: entry ? entry.title : hash,
      hasVisualization: entry ? Number(entry.viz || 0) > 0 : false,
    };
  }

  function announceOnce(key, type, data) {
    if (announced.has(key)) return;
    announced.add(key);
    track(type, data);
  }

  function onRoute() {
    const node = resolveCurrentNode();
    if (!node) { currentNode = null; return; }
    if (currentNode && currentNode.id === node.id) return;
    currentNode = node;
    track('NODE_OPEN', { title: node.title, hasVisualization: node.hasVisualization });
    if (node.hasVisualization) {
      announceOnce('viz:' + node.id, 'VISUALIZATION_OPEN', { title: node.title });
    }
    if (contentReadTimer) clearTimeout(contentReadTimer);
    contentReadTimer = setTimeout(() => {
      if (document.hidden || !currentNode || currentNode.id !== node.id) return;
      announceOnce('read:' + node.id, 'CONTENT_READ', { title: node.title, dwellSeconds: Math.round(DWELL_MS / 1000) });
    }, DWELL_MS);
  }

  document.addEventListener('zhixu:experiment-start', event => {
    track('EXPERIMENT_START', { experimentId: (event.detail || {}).experimentId });
  });
  document.addEventListener('zhixu:experiment-complete', event => {
    track('EXPERIMENT_COMPLETE', { experimentId: (event.detail || {}).experimentId });
  });

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-hint], .hint-trigger, [data-role="hint"]');
    if (target) track('HINT_OPEN', { hintId: target.getAttribute('data-hint') || target.id || null });
  });

  document.addEventListener('toggle', event => {
    const details = event.target;
    if (!details || details.tagName !== 'DETAILS' || !details.open) return;
    const text = (details.querySelector('summary') || details).textContent || '';
    if (/答案|解析|例题|参考/.test(text)) track('ANSWER_VIEW', { label: text.trim().slice(0, 40) });
  }, true);

  global.addEventListener('hashchange', onRoute);
  global.addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(true); });

  P.mastery = { track, flush, nodeIdFor, userId, get currentNode() { return currentNode; } };
  global.ZhixuMastery = P.mastery;

  // 左下角连接状态：根据后端健康检查显示「在线 / 离线」。
  function updateConnectivity() {
    const el = document.querySelector('.offline');
    if (!el) return;
    if (!canSync) { el.innerHTML = '<i style="background:#b45309"></i>离线'; el.title = '以 file:// 打开，掌握度不同步'; return; }
    fetch(API_BASE + '/api/healthz', { headers: { 'X-Zhixu-User': userId() } })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('offline'))))
      .then(() => { el.innerHTML = '<i style="background:#1f7a4d"></i>在线'; el.title = '后端已连接，掌握度同步中'; })
      .catch(() => { el.innerHTML = '<i style="background:#b45309"></i>离线'; el.title = '后端未连接，掌握度不同步'; });
  }

  onRoute();
  updateConnectivity();
})(window);
