'use strict';

const { getDatabase, nowIso } = require('../db/database.cjs');

const UPSERT = `
  INSERT INTO zx_site_visit
    (visit_id, user_id, ip, forwarded_for, user_agent, referer, accept_language,
     path, screen, timezone, language, onboarded, visit_count, created_at, last_seen_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  ON CONFLICT(visit_id) DO UPDATE SET
    user_id         = COALESCE(excluded.user_id, zx_site_visit.user_id),
    ip              = COALESCE(excluded.ip, zx_site_visit.ip),
    forwarded_for   = COALESCE(excluded.forwarded_for, zx_site_visit.forwarded_for),
    user_agent      = COALESCE(excluded.user_agent, zx_site_visit.user_agent),
    referer         = COALESCE(excluded.referer, zx_site_visit.referer),
    accept_language = COALESCE(excluded.accept_language, zx_site_visit.accept_language),
    path            = COALESCE(excluded.path, zx_site_visit.path),
    screen          = COALESCE(excluded.screen, zx_site_visit.screen),
    timezone        = COALESCE(excluded.timezone, zx_site_visit.timezone),
    language        = COALESCE(excluded.language, zx_site_visit.language),
    onboarded       = MAX(excluded.onboarded, zx_site_visit.onboarded),
    visit_count     = zx_site_visit.visit_count + 1,
    last_seen_at    = excluded.last_seen_at
`;

function findById(visitId) {
  return getDatabase().prepare('SELECT * FROM zx_site_visit WHERE visit_id = ?').get(visitId) || null;
}

function upsert(row) {
  const existing = findById(row.visitId);
  const now = nowIso();
  getDatabase().prepare(UPSERT).run(
    row.visitId,
    row.userId || null,
    row.ip || null,
    row.forwardedFor || null,
    row.userAgent || null,
    row.referer || null,
    row.acceptLanguage || null,
    row.path || null,
    row.screen || null,
    row.timezone || null,
    row.language || null,
    row.onboarded ? 1 : 0,
    existing ? existing.created_at : now,
    now,
  );
  return { visitId: row.visitId, firstVisit: !existing, row: findById(row.visitId) };
}

function count() {
  const row = getDatabase().prepare('SELECT COUNT(*) AS total, SUM(visit_count) AS hits, SUM(onboarded) AS onboarded FROM zx_site_visit').get();
  return { visitors: Number(row.total || 0), hits: Number(row.hits || 0), onboarded: Number(row.onboarded || 0) };
}

function listRecent(limit = 20) {
  const size = Math.max(1, Math.min(200, Number(limit) || 20));
  return getDatabase().prepare('SELECT * FROM zx_site_visit ORDER BY last_seen_at DESC LIMIT ?').all(size);
}

function listByDay(days = 14) {
  const size = Math.max(1, Math.min(180, Number(days) || 14));
  return getDatabase().prepare(`
    SELECT substr(created_at, 1, 10) AS day,
           COUNT(*) AS visitors,
           SUM(visit_count) AS hits,
           SUM(onboarded) AS onboarded
      FROM zx_site_visit
     GROUP BY day
     ORDER BY day DESC
     LIMIT ?
  `).all(size);
}

module.exports = { upsert, findById, count, listRecent, listByDay };
