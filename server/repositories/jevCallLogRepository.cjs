'use strict';

const { getDatabase } = require('../db/database.cjs');

function insert(entry) {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO zx_jev_call_log
       (request_id, user_id, knowledge_node_id, model, latency_ms, success, error_code, confidence, result_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    entry.requestId,
    entry.userId || null,
    entry.knowledgeNodeId || null,
    entry.model || null,
    entry.latencyMs || null,
    entry.success ? 1 : 0,
    entry.errorCode || null,
    entry.confidence === undefined ? null : entry.confidence,
    entry.result ? JSON.stringify(entry.result) : null
  );
}

module.exports = { insert };
