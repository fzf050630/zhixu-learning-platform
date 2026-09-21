'use strict';

const { getDatabase } = require('../db/database.cjs');

function insert(record) {
  const db = getDatabase();
  const info = db.prepare(
    `INSERT INTO zx_mastery_evaluation
       (user_id, knowledge_node_id, rule_score, jev_score, final_score, mastery_level,
        stability_score, review_urgency, weakness_type, recommended_action, jev_confidence,
        jev_used, input_snapshot_json, jev_response_json, algorithm_version, question_version)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    record.userId,
    record.knowledgeNodeId,
    record.ruleScore,
    record.jevScore,
    record.finalScore,
    record.masteryLevel,
    record.stabilityScore,
    record.reviewUrgency,
    record.weaknessType || null,
    record.recommendedAction || null,
    record.jevConfidence,
    record.jevUsed ? 1 : 0,
    JSON.stringify(record.inputSnapshot || {}),
    record.jevResponse ? JSON.stringify(record.jevResponse) : null,
    record.algorithmVersion,
    record.questionVersion
  );
  return Number(info.lastInsertRowid);
}

function listByUserNode(userId, knowledgeNodeId, limit = 20) {
  const db = getDatabase();
  return db.prepare(
    `SELECT * FROM zx_mastery_evaluation
      WHERE user_id = ? AND knowledge_node_id = ?
      ORDER BY created_at DESC, id DESC LIMIT ?`
  ).all(userId, knowledgeNodeId, limit);
}

function latest(userId, knowledgeNodeId) {
  const db = getDatabase();
  return db.prepare(
    `SELECT * FROM zx_mastery_evaluation
      WHERE user_id = ? AND knowledge_node_id = ?
      ORDER BY created_at DESC, id DESC LIMIT 1`
  ).get(userId, knowledgeNodeId) || null;
}

module.exports = { insert, listByUserNode, latest };
