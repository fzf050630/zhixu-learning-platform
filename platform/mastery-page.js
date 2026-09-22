/* 知序 · 掌握度热力图页面 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const canSync = location.protocol === 'http:' || location.protocol === 'https:';
  const API_BASE = global.ZHIXU_API_BASE
    ? String(global.ZHIXU_API_BASE).replace(/\/$/, '')
    : (P.root ? String(P.root).replace(/\/$/, '') : '');
  const UID_KEY = 'zhixu-uid-v1';
  const LEVEL_LABEL = { MASTERED: '稳定掌握', PROFICIENT: '熟练掌握', BASIC: '基本掌握', EMERGING: '初步理解', NOT_MASTERED: '未掌握' };

  const escape = P.escape || (text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])));

  function userId() {
    try { return localStorage.getItem(UID_KEY) || ''; } catch (_) { return ''; }
  }

  /* 掌握度接口需要设备令牌（服务端签发），未带令牌会 401。 */
  const apiFetch = (path, options) => (P.session && P.session.authedFetch)
    ? P.session.authedFetch(path, options)
    : fetch(API_BASE + path, options);

  function levelOf(score) {
    if (score === null || score === undefined) return 'NONE';
    if (score >= 90) return 'MASTERED';
    if (score >= 75) return 'PROFICIENT';
    if (score >= 60) return 'BASIC';
    if (score >= 40) return 'EMERGING';
    return 'NOT_MASTERED';
  }

  // 知识节点 ID → catalog 条目
  const nodeIndex = new Map();
  (P.catalog && P.catalog.entries ? P.catalog.entries : []).forEach(entry => {
    nodeIndex.set(entry.subject + ':' + entry.hash.replace(/^#\/?/, ''), entry);
  });

  function nodeUrl(nodeId) {
    const entry = nodeIndex.get(nodeId);
    return entry ? P.url(entry.subject, entry.hash) : null;
  }

  function setStatus(text) {
    const el = document.getElementById('mpStatus');
    if (el) el.textContent = text || '';
  }

  function showBanner(html) {
    const el = document.getElementById('mpBanner');
    if (!el) return;
    if (!html) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    el.innerHTML = html;
  }

  const LEGEND = [
    ['MASTERED', '稳定掌握 90+'],
    ['PROFICIENT', '熟练掌握 75–89'],
    ['BASIC', '基本掌握 60–74'],
    ['EMERGING', '初步理解 40–59'],
    ['NOT_MASTERED', '未掌握 0–39'],
    ['NONE', '未评估'],
  ];

  function renderLegend() {
    const el = document.getElementById('mpLegend');
    if (!el) return;
    el.innerHTML = LEGEND.map(([level, label]) =>
      '<span class="mp-legend-item"><i data-level="' + level + '"></i>' + escape(label) + '</span>').join('');
  }

  function renderOverall(heatmap) {
    const overall = heatmap.overall || {};
    const host = document.getElementById('mpOverall');
    const score = overall.mastery;
    const level = levelOf(score);
    host.hidden = false;
    host.innerHTML =
      '<strong data-level="' + level + '">' + (score === null || score === undefined ? '--' : score + '%') + '</strong>' +
      '<div class="mp-overall-meta">综合掌握度' +
      (score === null ? '' : ' · ' + escape(LEVEL_LABEL[level] || '')) +
      '<br>已评估 ' + (overall.evaluatedNodes || 0) + ' / 已学习 ' + (overall.trackedNodes || 0) + ' 个知识节点</div>';
  }

  function renderSubjects(heatmap, stateMap) {
    const host = document.getElementById('mpSubjects');
    const subjects = (heatmap.subjects || []).filter(item => item.trackedNodes > 0);
    if (!subjects.length) {
      host.innerHTML = '<p class="mp-empty">还没有学习记录。进入任意实验或知识点做几道自测，这里就会出现掌握度。</p>';
      return;
    }
    host.innerHTML = subjects.map(subject => {
      const level = levelOf(subject.mastery);
      const value = subject.mastery === null ? '--' : subject.mastery + '%';
      const width = subject.mastery === null ? 0 : Math.max(0, Math.min(100, subject.mastery));
      const chips = (subject.chapters || []).map(chapter => {
        const text = chapter.chapter + ' ' + (chapter.mastery === null ? '未评估' : chapter.mastery + '%');
        return '<span class="mp-chip" data-level="' + levelOf(chapter.mastery) + '">' + escape(text) + '</span>';
      }).join('');

      const entries = (P.catalog && P.catalog.entries ? P.catalog.entries : []).filter(entry => entry.subject === subject.subject);
      const cells = entries.map(entry => {
        const nodeId = entry.subject + ':' + entry.hash.replace(/^#\/?/, '');
        const state = stateMap.get(nodeId);
        const score = state && Number.isFinite(state.mastery) ? state.mastery : null;
        const cellLevel = levelOf(score);
        const tip = entry.title + ' · ' + (score === null ? '未评估' : score + '% ' + (LEVEL_LABEL[cellLevel] || ''));
        return '<a class="mp-cell" data-level="' + cellLevel + '" href="' + escape(P.url(entry.subject, entry.hash)) + '" title="' + escape(tip) + '"></a>';
      }).join('');

      return '<article class="mp-subject"><div class="mp-subject-head"><span>' + escape(subject.title || subject.subject) +
        '</span><b data-level="' + level + '">' + value + '</b></div>' +
        '<div class="mp-bar"><i style="width:' + width + '%"></i></div>' +
        '<div class="mp-chips">' + chips + '</div>' +
        '<div class="mp-grid" aria-label="逐小节热力">' + cells + '</div></article>';
    }).join('');
  }

  function renderReviews(reviews) {
    const block = document.getElementById('mpReviewBlock');
    const host = document.getElementById('mpReviews');
    if (!reviews.length) { block.hidden = true; return; }
    block.hidden = false;
    host.innerHTML = reviews.map(item => {
      const entry = nodeIndex.get(item.nodeId);
      const title = entry ? entry.title : item.nodeId;
      const url = nodeUrl(item.nodeId);
      const when = item.scheduledAt ? new Date(item.scheduledAt).toLocaleString('zh-CN') : '';
      return '<div class="mp-review"><span>' +
        (url ? '<a href="' + escape(url) + '">' + escape(title) + '</a>' : escape(title)) +
        '</span><small>' + escape(when) + (item.reason ? ' · ' + escape(item.reason) : '') + '</small></div>';
    }).join('');
  }

  function renderSections(stateMap) {
    const host = document.getElementById('mpSections');
    const total = document.getElementById('mpNodeTotal');
    const entries = (P.catalog && P.catalog.entries) ? P.catalog.entries : [];
    if (total) total.textContent = entries.length;

    const bySubject = new Map();
    for (const entry of entries) {
      if (!bySubject.has(entry.subject)) bySubject.set(entry.subject, new Map());
      const chapters = bySubject.get(entry.subject);
      if (!chapters.has(entry.chapter)) chapters.set(entry.chapter, []);
      chapters.get(entry.chapter).push(entry);
    }

    const order = (P.subjects || []).map(subject => subject.id).filter(id => bySubject.has(id));
    host.innerHTML = order.map(subjectId => {
      const subject = P.subject(subjectId) || { title: subjectId };
      const chapters = bySubject.get(subjectId);
      const chaptersHtml = [...chapters.entries()].map(([chapter, list]) => {
        const rows = list.map(entry => {
          const nodeId = entry.subject + ':' + entry.hash.replace(/^#\/?/, '');
          const state = stateMap.get(nodeId);
          const score = state && Number.isFinite(state.mastery) ? state.mastery : null;
          const scoreHtml = score === null
            ? '<span class="mp-none">未评估</span>'
            : '<span class="mp-score" data-level="' + levelOf(score) + '">' + score + '% · ' + escape(LEVEL_LABEL[levelOf(score)] || '') + '</span>';
          return '<li><a href="' + escape(P.url(entry.subject, entry.hash)) + '"><span>' + escape(entry.title) + '</span>' + scoreHtml + '</a></li>';
        }).join('');
        return '<div class="mp-chapter"><div class="mp-chapter-head"><h3>' + escape(chapter) + '</h3><span class="mp-muted">' + list.length + ' 节</span></div><ul class="mp-list">' + rows + '</ul></div>';
      }).join('');
      return '<section><div class="mp-block-head"><h2>' + escape(subject.title) + '</h2></div><div class="mp-sections">' + chaptersHtml + '</div></section>';
    }).join('');
  }

  function load() {
    renderLegend();
    if (!canSync) {
      setStatus('离线打开（file://）');
      showBanner('当前是 <b>file://</b> 离线打开，无法同步掌握度。请双击项目根目录的 <b>启动知序.cmd</b>，再从 <b>http://127.0.0.1:8787/</b> 进入。');
      renderSections(new Map());
      return;
    }
    setStatus('正在读取…');
    showBanner('');
    const headers = { 'X-Zhixu-User': userId() };
    Promise.all([
      apiFetch('/api/learning/heatmap', { headers }).then(r => r.ok ? r.json() : Promise.reject(new Error('heatmap'))),
      apiFetch('/api/learning/overview', { headers }).then(r => r.ok ? r.json() : Promise.reject(new Error('overview'))),
      apiFetch('/api/learning/reviews', { headers }).then(r => r.ok ? r.json() : Promise.reject(new Error('reviews'))),
    ]).then(([heatmap, overview, reviews]) => {
      const stateMap = new Map();
      (overview.states || []).forEach(state => stateMap.set(state.nodeId, state));
      renderOverall(heatmap);
      renderSubjects(heatmap, stateMap);
      renderReviews(reviews.reviews || []);
      renderSections(stateMap);
      setStatus('数据已更新 · ' + new Date().toLocaleTimeString('zh-CN'));
      if (!overview.evaluatedNodes) {
        showBanner('后端已连接，但还没有掌握度数据。进入任意实验/知识点，点右上角「<b>自测 · 5 题</b>」做完一组题，掌握度就会出现在这里。');
      }
    }).catch(() => {
      setStatus('后端未连接');
      showBanner('无法连接后端。请双击项目根目录的 <b>启动知序.cmd</b> 启动后端后重试（地址应为 <b>http://127.0.0.1:8787/</b>）。');
      renderSections(new Map());
    });
  }

  const refresh = document.getElementById('mpRefresh');
  if (refresh) refresh.addEventListener('click', load);
  load();
})(window);
