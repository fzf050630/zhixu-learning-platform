'use strict';

const { getDatabase, nowIso } = require('../db/database.cjs');

function replacePending(userId, knowledgeNodeId, schedule) {
  const db = getDatabase();
  const now = nowIso();
  db.prepare(
    `UPDATE zx_review_schedule SET status = 'EXPIRED'
      WHERE user_id = ? AND knowledge_node_id = ? AND status = 'PENDING'`
  ).run(userId, knowledgeNodeId);
  if (!schedule) return null;
  const info = db.prepare(
    `INSERT INTO zx_review_schedule
       (user_id, knowledge_node_id, scheduled_at, reason, status, source, created_at)
     VALUES (?, ?, ?, ?, 'PENDING', ?, ?)`
  ).run(userId, knowledgeNodeId, schedule.scheduledAt, schedule.reason || null, schedule.source || 'SYSTEM', now);
  return Number(info.lastInsertRowid);
}

function pendingFor(userId, knowledgeNodeId) {
  const db = getDatabase();
  return db.prepare(
    `SELECT * FROM zx_review_schedule
      WHERE user_id = ? AND knowledge_node_id = ? AND status = 'PENDING'
      ORDER BY scheduled_at ASC LIMIT 1`
  ).get(userId, knowledgeNodeId) || null;
}

function listPending(userId, options = {}) {
  const db = getDatabase();
  const limit = Math.min(Math.max(Number(options.limit) || 50, 1), 200);
  return db.prepare(
    `SELECT * FROM zx_review_schedule
      WHERE user_id = ? AND status = 'PENDING'
      ORDER BY scheduled_at ASC LIMIT ?`
  ).all(userId, limit);
}

function complete(userId, knowledgeNodeId, at = nowIso()) {
  const db = getDatabase();
  db.prepare(
    `UPDATE zx_review_schedule SET status = 'COMPLETED', completed_at = ?
      WHERE user_id = ? AND knowledge_node_id = ? AND status = 'PENDING'`
  ).run(at, userId, knowledgeNodeId);
}

module.exports = { replacePending, pendingFor, listPending, complete };
