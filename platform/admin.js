/* 知序 · 数据观察台（只读）
   用管理员令牌访问后端只读接口：概览 / 分页浏览数据表 / 只读 SELECT。
   令牌存 sessionStorage，不写 localStorage、不进 URL。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const API_BASE = global.ZHIXU_API_BASE
    ? String(global.ZHIXU_API_BASE).replace(/\/$/, '')
    : (P.root ? String(P.root).replace(/\/$/, '') : '');
  const KEY = 'zhixu-admin-token';
  const el = id => document.getElementById(id);
  const escape = P.escape || (text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])));
  const state = { offset: 0, limit: 50, table: '', total: 0 };

  function token() {
    try { return sessionStorage.getItem(KEY) || ''; } catch (_) { return ''; }
  }
  function setToken(value) {
    try { sessionStorage.setItem(KEY, value); } catch (_) { /* ignore */ }
  }

  async function api(path, options) {
    const opts = options || {};
    const response = await fetch(API_BASE + path, Object.assign({}, opts, {
      headers: Object.assign({ 'Content-Type': 'application/json', 'X-Zhixu-Admin': token() }, opts.headers || {}),
    }));
    let data = {};
    try { data = await response.json(); } catch (_) { /* 空响应 */ }
    if (!response.ok) {
      const error = new Error((data.error && data.error.message) || ('HTTP ' + response.status));
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function cell(value) {
    if (value === null || value === undefined) return '<span class="zx-admin-null">—</span>';
    const text = String(value);
    const shown = text.length > 180 ? text.slice(0, 180) + '…' : text;
    return '<span title="' + escape(text.slice(0, 2000)) + '">' + escape(shown) + '</span>';
  }

  function renderRows(target, columns, rows) {
    if (!rows.length) { target.innerHTML = '<p class="zx-admin-muted">没有数据</p>'; return; }
    target.innerHTML = '<table><thead><tr>' + columns.map(column => '<th>' + escape(column) + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map(row => '<tr>' + columns.map(column => '<td>' + cell(row[column]) + '</td>').join('') + '</tr>').join('') +
      '</tbody></table>';
  }

  function card(title, body) {
    return '<section class="zx-admin-card"><h2>' + escape(title) + '</h2>' + body + '</section>';
  }

  async function loadOverview() {
    const data = await api('/api/admin/overview');
    const tableRows = data.tables.map(item => '<tr><td><code>' + escape(item.name) + '</code></td><td class="zx-admin-num">' + item.rows + '</td></tr>').join('');
    const dayRows = (data.visitsByDay || []).map(item =>
      '<tr><td>' + escape(item.day) + '</td><td class="zx-admin-num">' + item.visitors + '</td><td class="zx-admin-num">' + item.hits + '</td><td class="zx-admin-num">' + item.onboarded + '</td></tr>').join('');
    const jev = data.jev || {};
    el('adminOverview').innerHTML =
      card('访问汇总', '<p class="zx-admin-big">' + data.visits.visitors + ' <span>独立访客</span></p>' +
        '<p class="zx-admin-muted">累计访问 ' + data.visits.hits + ' 次 · 已确认说明 ' + data.visits.onboarded + ' 次</p>' +
        (dayRows ? '<table class="zx-admin-mini"><thead><tr><th>日期</th><th>访客</th><th>访问</th><th>确认</th></tr></thead><tbody>' + dayRows + '</tbody></table>' : '')) +
      card('数据表行数', '<table class="zx-admin-mini"><thead><tr><th>表</th><th>行数</th></tr></thead><tbody>' + tableRows + '</tbody></table>') +
      card('Jev 预算', '<p>今日已用 <b>' + (jev.globalUsed ?? '—') + '</b> / 上限 ' + (jev.globalLimit || '不限') + '</p>' +
        '<p class="zx-admin-muted">单 IP 上限 ' + (jev.perIpLimit || '不限') + ' · 跟踪 IP ' + (jev.trackedIps ?? 0) + ' 个 · 模型 ' + escape(jev.model || '—') + ' · ' + (jev.enabled ? '已启用' : '未启用') + '</p>') +
      card('运行配置', '<p class="zx-admin-muted">算法 ' + escape(data.runtime.algorithmVersion) + ' · 题库 ' + escape(data.runtime.questionVersion) + '</p>' +
        '<p class="zx-admin-muted">数据库 ' + escape(data.runtime.dbPath) + '</p>' +
        '<p class="zx-admin-muted">设备令牌强制 ' + (data.runtime.requireSession ? '开' : '关') + ' · 限流 ' + data.runtime.rateLimit.perMinute + '/分、' + data.runtime.rateLimit.perDay + '/天</p>');
  }

  async function loadTables() {
    const data = await api('/api/admin/tables');
    const select = el('adminTable');
    select.innerHTML = data.tables.map(item => '<option value="' + escape(item.name) + '">' + escape(item.name) + '（' + item.rows + '）</option>').join('');
    if (!select.value && data.tables.length) select.value = data.tables[0].name;
    state.table = select.value;
  }

  async function loadBrowse(reset) {
    if (!state.table) return;
    if (reset) state.offset = 0;
    state.limit = Math.max(1, Math.min(500, Number(el('adminLimit').value) || 50));
    const mask = el('adminMask').checked ? '' : '&mask=0';
    const data = await api('/api/admin/table/' + encodeURIComponent(state.table) + '?limit=' + state.limit + '&offset=' + state.offset + mask);
    state.total = data.total;
    renderRows(el('adminTableWrap'), data.columns, data.rows);
    const from = data.total ? state.offset + 1 : 0;
    el('adminRange').textContent = '第 ' + from + '–' + Math.min(state.offset + state.limit, data.total) + ' 行 / 共 ' + data.total + ' 行 · 排序 ' + data.orderBy;
    el('adminPrev').disabled = state.offset <= 0;
    el('adminNext').disabled = state.offset + state.limit >= data.total;
  }

  async function runSql() {
    const sql = el('adminSql').value.trim();
    if (!sql) return;
    el('adminSqlInfo').textContent = '执行中…';
    try {
      const data = await api('/api/admin/query', { method: 'POST', body: JSON.stringify({ sql }) });
      renderRows(el('adminSqlWrap'), data.columns, data.rows);
      el('adminSqlInfo').textContent = '返回 ' + data.rowCount + ' 行' + (data.truncated ? '（已截断到上限）' : '') + ' · 耗时 ' + data.elapsedMs + ' ms';
    } catch (error) {
      el('adminSqlWrap').innerHTML = '<p class="zx-admin-error">' + escape(error.message) + '</p>';
      el('adminSqlInfo').textContent = '执行失败';
    }
  }

  function showGate(message) {
    el('adminMain').hidden = true;
    el('adminGate').hidden = false;
    el('adminLogout').hidden = true;
    el('adminStatus').textContent = '未连接';
    if (message) {
      const error = el('adminError');
      error.textContent = message;
      error.hidden = false;
    }
  }

  async function showMain() {
    el('adminGate').hidden = true;
    el('adminMain').hidden = false;
    el('adminLogout').hidden = false;
    el('adminStatus').textContent = '已连接';
    el('adminError').hidden = true;
    await Promise.all([loadOverview(), loadTables()]);
    await loadBrowse(true);
  }

  function bindTabs() {
    document.querySelectorAll('.zx-admin-tabs button').forEach(button => {
      button.addEventListener('click', () => {
        const name = button.dataset.tab;
        document.querySelectorAll('.zx-admin-tabs button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        document.querySelectorAll('main section[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
      });
    });
  }

  el('adminForm').addEventListener('submit', async event => {
    event.preventDefault();
    const value = el('adminToken').value.trim();
    if (!value) return;
    setToken(value);
    try {
      await showMain();
    } catch (error) {
      try { sessionStorage.removeItem(KEY); } catch (_) { /* ignore */ }
      showGate(error.status === 403 ? '服务器未配置管理令牌（ZHIXU_ADMIN_TOKEN）' : '令牌无效或接口不可用：' + error.message);
    }
  });
  el('adminLogout').addEventListener('click', () => {
    try { sessionStorage.removeItem(KEY); } catch (_) { /* ignore */ }
    el('adminToken').value = '';
    showGate('');
  });
  el('adminTable').addEventListener('change', () => { state.table = el('adminTable').value; loadBrowse(true); });
  el('adminLimit').addEventListener('change', () => loadBrowse(true));
  el('adminMask').addEventListener('change', () => loadBrowse(false));
  el('adminPrev').addEventListener('click', () => { state.offset = Math.max(0, state.offset - state.limit); loadBrowse(false); });
  el('adminNext').addEventListener('click', () => { state.offset += state.limit; loadBrowse(false); });
  el('adminRun').addEventListener('click', runSql);
  el('adminSql').addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') runSql(); });
  bindTabs();

  if (token()) showMain().catch(() => showGate('令牌已失效，请重新输入'));
  else showGate('');
})(window);
