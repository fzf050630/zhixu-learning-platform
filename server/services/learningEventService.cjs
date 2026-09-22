'use strict';

const crypto = require('node:crypto');
const config = require('../config.cjs');
const logger = require('../lib/logger.cjs');
const { badRequest } = require('../lib/errors.cjs');
const { resolveNode } = require('../knowledge/nodes.cjs');
const learningEventRepository = require('../repositories/learningEventRepository.cjs');
const knowledgeStateRepository = require('../repositories/knowledgeStateRepository.cjs');
const masteryEvaluationService = require('./masteryEvaluationService.cjs');

const EVENT_TYPES = new Set([
  'NODE_OPEN',
  'CONTENT_READ',
  'VIDEO_COMPLETE',
  'QUESTION_START',
  'QUESTION_SUBMIT',
  'QUESTION_CORRECT',
  'QUESTION_WRONG',
  'HINT_OPEN',
  'ANSWER_VIEW',
  'VISUALIZATION_OPEN',
  'VISUALIZATION_COMPLETE',
  'EXPERIMENT_START',
  'EXPERIMENT_COMPLETE',
  'REVIEW_START',
  'REVIEW_COMPLETE',
  'QUIZ_COMPLETE',
  'NODE_COMPLETE',
]);

const TRIGGER_TYPES = new Set([
  'QUESTION_SUBMIT',
  'QUESTION_CORRECT',
  'QUESTION_WRONG',
  'REVIEW_COMPLETE',
  'EXPERIMENT_COMPLETE',
  'VISUALIZATION_COMPLETE',
  'QUIZ_COMPLETE',
  'NODE_COMPLETE',
]);

function plainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function validIso(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalize(userId, payload) {
  const knowledgeNodeId = String(payload.knowledgeNodeId || '').trim();
  if (!knowledgeNodeId || knowledgeNodeId.length > 160) throw badRequest('knowledgeNodeId 不能为空且长度需合法');
  const type = String(payload.type || '').trim().toUpperCase();
  if (!EVENT_TYPES.has(type)) throw badRequest('未知事件类型：' + type);
  const node = resolveNode(knowledgeNodeId);
  return {
    eventId: typeof payload.eventId === 'string' && payload.eventId ? payload.eventId.slice(0, 80) : crypto.randomUUID(),
    userId,
    knowledgeNodeId,
    subject: payload.subject || node.subject,
    type,
    data: plainObject(payload.data),
    occurredAt: validIso(payload.occurredAt) || new Date().toISOString(),
  };
}

function maybeEvaluate(userId, event, options = {}) {
  if (!TRIGGER_TYPES.has(event.type)) return Promise.resolve(null);
  const stored = knowledgeStateRepository.find(userId, event.knowledgeNodeId);
  if (stored && stored.lastEvaluatedAt) {
    const elapsed = Date.now() - new Date(stored.lastEvaluatedAt).getTime();
    if (elapsed < config.mastery.evaluationMinIntervalMs) return Promise.resolve(null);
  }
  return masteryEvaluationService.evaluate(userId, event.knowledgeNodeId, options).catch(error => {
    logger.warn('事件触发的掌握度评估失败', { node: event.knowledgeNodeId, reason: error.code || error.message });
    return null;
  });
}

function insertEvent(userId, payload) {
  const event = normalize(userId, payload);
  try {
    learningEventRepository.insert(event);
  } catch (error) {
    if (!/UNIQUE|constraint/i.test(error.message)) throw error;
    return { event, duplicate: true };
  }
  return { event, duplicate: false };
}

async function record(userId, payload, options = {}) {
  const { event, duplicate } = insertEvent(userId, payload);
  if (!duplicate) await maybeEvaluate(userId, event, options);
  return { event, duplicate };
}

async function recordMany(userId, payloads, options = {}) {
  const accepted = [];
  for (const payload of payloads) {
    const { event, duplicate } = insertEvent(userId, payload);
    if (!duplicate) accepted.push(event);
  }
  // 一批事件（如一次完整自测）结束后强制评估一次，避免被节流跳过。
  const nodes = [...new Set(
    accepted.filter(event => TRIGGER_TYPES.has(event.type)).map(event => event.knowledgeNodeId)
  )];
  for (const nodeId of nodes) {
    await masteryEvaluationService.evaluate(userId, nodeId, options).catch(error => {
      logger.warn('批量事件后的掌握度评估失败', { node: nodeId, reason: error.code || error.message });
      return null;
    });
  }
  return accepted;
}

module.exports = { EVENT_TYPES, TRIGGER_TYPES, record, recordMany, normalize };
