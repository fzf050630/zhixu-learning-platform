'use strict';

const { getDatabase } = require('../db/database.cjs');

function insert(event) {
  const db = getDatabase();
  const statement = db.prepare(
    `INSERT INTO zx_learning_event
       (event_id, user_id, knowledge_node_id, subject, event_type, event_data_json, occurred_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  statement.run(
    event.eventId,
    event.userId,
    event.knowledgeNodeId,
    event.subject || null,
    event.type,
    JSON.stringify(event.data || {}),
    event.occurredAt
  );
  return event.eventId;
}

function mapRow(row) {
  let data = {};
  try { data = JSON.parse(row.event_data_json || '{}'); } catch (_) { data = {}; }
  return {
    eventId: row.event_id,
    userId: row.user_id,
    knowledgeNodeId: row.knowledge_node_id,
    subject: row.subject,
    type: row.event_type,
    data,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
  };
}

function listByUserNode(userId, knowledgeNodeId, options = {}) {
  const db = getDatabase();
  const limit = Math.min(Math.max(Number(options.limit) || 500, 1), 5000);
  const rows = db.prepare(
    `SELECT * FROM zx_learning_event
      WHERE user_id = ? AND knowledge_node_id = ?
      ORDER BY occurred_at ASC, id ASC
      LIMIT ?`
  ).all(userId, knowledgeNodeId, limit);
  return rows.map(mapRow);
}

function listByUser(userId, options = {}) {
  const db = getDatabase();
  const limit = Math.min(Math.max(Number(options.limit) || 100, 1), 1000);
  const rows = db.prepare(
    `SELECT * FROM zx_learning_event
      WHERE user_id = ?
      ORDER BY occurred_at DESC, id DESC
      LIMIT ?`
  ).all(userId, limit);
  return rows.map(mapRow);
}

function countByUserNode(userId, knowledgeNodeId) {
  const db = getDatabase();
  const row = db.prepare(
    'SELECT COUNT(*) AS total FROM zx_learning_event WHERE user_id = ? AND knowledge_node_id = ?'
  ).get(userId, knowledgeNodeId);
  return row ? row.total : 0;
}

function lastEventAt(userId, knowledgeNodeId) {
  const db = getDatabase();
  const row = db.prepare(
    `SELECT occurred_at FROM zx_learning_event
      WHERE user_id = ? AND knowledge_node_id = ?
      ORDER BY occurred_at DESC, id DESC LIMIT 1`
  ).get(userId, knowledgeNodeId);
  return row ? row.occurred_at : null;
}

module.exports = { insert, listByUserNode, listByUser, countByUserNode, lastEventAt, mapRow };
