/* 知序 · 门户知识热力图
   汇总各学科与章节的加权掌握度；后端不可用或无数据时隐藏。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const canSync = location.protocol === 'http:' || location.protocol === 'https:';
  const section = document.getElementById('masterySection');
  const host = document.getElementById('masteryHeatmap');
  if (!canSync || !section || !host) return;

  const API_BASE = global.ZHIXU_API_BASE
    ? String(global.ZHIXU_API_BASE).replace(/\/$/, '')
    : (P.root ? String(P.root).replace(/\/$/, '') : '');
  const UID_KEY = 'zhixu-uid-v1';

  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('heatmap.css', document.currentScript.src).href;
    document.head.appendChild(link);
  } catch (_) { /* ignore */ }

  const escape = P.escape || (text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])));

  function userId() {
    try { return localStorage.getItem(UID_KEY) || ''; } catch (_) { return ''; }
  }

  function levelOf(score) {
    if (score === null || score === undefined) return 'NONE';
    if (score >= 90) return 'MASTERED';
    if (score >= 75) return 'PROFICIENT';
    if (score >= 60) return 'BASIC';
    if (score >= 40) return 'EMERGING';
    return 'NOT_MASTERED';
  }

  function render(data) {
    const subjects = (data.subjects || []).filter(item => item.trackedNodes > 0);
    if (!subjects.length) return;
    const overall = data.overall || {};
    host.innerHTML =
      '<div class="zx-heatmap-overall"><strong data-level="' + levelOf(overall.mastery) + '">' +
      (overall.mastery === null || overall.mastery === undefined ? '--' : overall.mastery + '%') +
      '</strong><div class="zx-heatmap-meta">综合掌握度 · 已评估 ' + (overall.evaluatedNodes || 0) + ' / 已学习 ' + (overall.trackedNodes || 0) + ' 个知识节点<br>父节点按节点权重加权，而非简单平均</div></div>' +
      '<ul class="zx-heatmap-subjects">' + subjects.map(subject => {
        const level = levelOf(subject.mastery);
        const value = subject.mastery === null ? '--' : subject.mastery + '%';
        const width = subject.mastery === null ? 0 : Math.max(0, Math.min(100, subject.mastery));
        const chapters = (subject.chapters || []).map(chapter => {
          const chapterLevel = levelOf(chapter.mastery);
          const text = chapter.chapter + ' ' + (chapter.mastery === null ? '未评估' : chapter.mastery + '%');
          return '<span class="zx-heatmap-chip" data-level="' + chapterLevel + '">' + escape(text) + '</span>';
        }).join('');
        return '<li><div class="zx-heatmap-head"><span>' + escape(subject.title || subject.subject) +
          '</span><b data-level="' + level + '">' + value + '</b></div>' +
          '<div class="zx-heatmap-bar"><i style="width:' + width + '%"></i></div>' +
          '<div class="zx-heatmap-chapters">' + chapters + '</div></li>';
      }).join('') + '</ul>';
    section.hidden = false;
  }

  fetch(API_BASE + '/api/learning/heatmap', { headers: { 'X-Zhixu-User': userId() } })
    .then(response => (response.ok ? response.json() : Promise.reject(new Error('HTTP ' + response.status))))
    .then(render)
    .catch(() => { /* 热力图是增强功能 */ });
})(window);
