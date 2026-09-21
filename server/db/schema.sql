-- 知序 Knowledge Mastery System — 数据库结构
-- 只新增、不修改历史事件：算法变更后可基于原始事件重算。

CREATE TABLE IF NOT EXISTS zx_learning_event (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id          TEXT    NOT NULL UNIQUE,
  user_id           TEXT    NOT NULL,
  knowledge_node_id TEXT    NOT NULL,
  subject           TEXT,
  event_type        TEXT    NOT NULL,
  event_data_json   TEXT    NOT NULL DEFAULT '{}',
  occurred_at       TEXT    NOT NULL,
  created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_event_user_node_time
  ON zx_learning_event (user_id, knowledge_node_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_event_user_time
  ON zx_learning_event (user_id, occurred_at);

CREATE TABLE IF NOT EXISTS zx_user_knowledge_state (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id            TEXT    NOT NULL,
  knowledge_node_id  TEXT    NOT NULL,
  subject            TEXT,
  mastery_score      REAL    NOT NULL DEFAULT 0,
  mastery_level      TEXT    NOT NULL DEFAULT 'NOT_MASTERED',
  status             TEXT    NOT NULL DEFAULT 'INSUFFICIENT_DATA',
  rule_score         REAL    NOT NULL DEFAULT 0,
  jev_score          REAL,
  stability_score    REAL    NOT NULL DEFAULT 0,
  review_urgency     REAL    NOT NULL DEFAULT 0,
  weakness_type      TEXT,
  recommended_action TEXT,
  confidence         REAL    NOT NULL DEFAULT 0,
  attempt_count      INTEGER NOT NULL DEFAULT 0,
  review_count       INTEGER NOT NULL DEFAULT 0,
  last_learned_at    TEXT,
  last_evaluated_at  TEXT,
  next_review_at     TEXT,
  version            INTEGER NOT NULL DEFAULT 1,
  created_at         TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at         TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_state_user_node
  ON zx_user_knowledge_state (user_id, knowledge_node_id);

CREATE TABLE IF NOT EXISTS zx_mastery_evaluation (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id               TEXT    NOT NULL,
  knowledge_node_id     TEXT    NOT NULL,
  rule_score            REAL    NOT NULL,
  jev_score             REAL,
  final_score           REAL    NOT NULL,
  mastery_level         TEXT    NOT NULL,
  stability_score       REAL    NOT NULL DEFAULT 0,
  review_urgency        REAL    NOT NULL DEFAULT 0,
  weakness_type         TEXT,
  recommended_action    TEXT,
  jev_confidence        REAL,
  jev_used              INTEGER NOT NULL DEFAULT 0,
  input_snapshot_json   TEXT    NOT NULL DEFAULT '{}',
  jev_response_json     TEXT,
  algorithm_version     TEXT    NOT NULL,
  question_version      TEXT    NOT NULL,
  created_at            TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_eval_user_node_time
  ON zx_mastery_evaluation (user_id, knowledge_node_id, created_at);

CREATE TABLE IF NOT EXISTS zx_review_schedule (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id           TEXT    NOT NULL,
  knowledge_node_id TEXT    NOT NULL,
  scheduled_at      TEXT    NOT NULL,
  reason            TEXT,
  status            TEXT    NOT NULL DEFAULT 'PENDING',
  source            TEXT    NOT NULL DEFAULT 'SYSTEM',
  created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  completed_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_review_user_status_time
  ON zx_review_schedule (user_id, status, scheduled_at);

CREATE TABLE IF NOT EXISTS zx_jev_call_log (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id        TEXT    NOT NULL,
  user_id           TEXT,
  knowledge_node_id TEXT,
  model             TEXT,
  latency_ms        INTEGER,
  success           INTEGER NOT NULL DEFAULT 0,
  error_code        TEXT,
  confidence        REAL,
  result_json       TEXT,
  created_at        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
