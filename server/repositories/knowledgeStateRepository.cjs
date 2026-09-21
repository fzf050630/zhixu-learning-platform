'use strict';

const { getDatabase, nowIso } = require('../db/database.cjs');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    knowledgeNodeId: row.knowledge_node_id,
    subject: row.subject,
    masteryScore: row.mastery_score,
    masteryLevel: row.mastery_level,
    status: row.status,
    ruleScore: row.rule_score,
    jevScore: row.jev_score,
    stabilityScore: row.stability_score,
    reviewUrgency: row.review_urgency,
    weaknessType: row.weakness_type,
    recommendedAction: row.recommended_action,
    confidence: row.confidence,
    attemptCount: row.attempt_count,
    reviewCount: row.review_count,
    lastLearnedAt: row.last_learned_at,
    lastEvaluatedAt: row.last_evaluated_at,
    nextReviewAt: row.next_review_at,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function find(userId, knowledgeNodeId) {
  const db = getDatabase();
  return mapRow(db.prepare(
    'SELECT * FROM zx_user_knowledge_state WHERE user_id = ? AND knowledge_node_id = ?'
  ).get(userId, knowledgeNodeId));
}

function listByUser(userId, options = {}) {
  const db = getDatabase();
  const rows = db.prepare(
    'SELECT * FROM zx_user_knowledge_state WHERE user_id = ? ORDER BY last_evaluated_at DESC'
  ).all(userId);
  if (options.subject) return rows.map(mapRow).filter(state => state.subject === options.subject);
  return rows.map(mapRow);
}

function upsert(state) {
  const db = getDatabase();
  const now = nowIso();
  db.prepare(
    `INSERT INTO zx_user_knowledge_state
       (user_id, knowledge_node_id, subject, mastery_score, mastery_level, status,
        rule_score, jev_score, stability_score, review_urgency, weakness_type,
        recommended_action, confidence, attempt_count, review_count,
        last_learned_at, last_evaluated_at, next_review_at, version, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
     ON CONFLICT(user_id, knowledge_node_id) DO UPDATE SET
       subject = excluded.subject,
       mastery_score = excluded.mastery_score,
       mastery_level = excluded.mastery_level,
       status = excluded.status,
       rule_score = excluded.rule_score,
       jev_score = excluded.jev_score,
       stability_score = excluded.stability_score,
       review_urgency = excluded.review_urgency,
       weakness_type = excluded.weakness_type,
       recommended_action = excluded.recommended_action,
       confidence = excluded.confidence,
       attempt_count = excluded.attempt_count,
       review_count = excluded.review_count,
       last_learned_at = excluded.last_learned_at,
       last_evaluated_at = excluded.last_evaluated_at,
       next_review_at = excluded.next_review_at,
       version = zx_user_knowledge_state.version + 1,
       updated_at = excluded.updated_at`
  ).run(
    state.userId,
    state.knowledgeNodeId,
    state.subject || null,
    state.masteryScore,
    state.masteryLevel,
    state.status,
    state.ruleScore,
    state.jevScore,
    state.stabilityScore,
    state.reviewUrgency,
    state.weaknessType || null,
    state.recommendedAction || null,
    state.confidence,
    state.attemptCount,
    state.reviewCount,
    state.lastLearnedAt || null,
    state.lastEvaluatedAt || now,
    state.nextReviewAt || null,
    now,
    now
  );
  return find(state.userId, state.knowledgeNodeId);
}

module.exports = { find, listByUser, upsert, mapRow };
