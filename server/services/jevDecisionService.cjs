'use strict';

const crypto = require('node:crypto');
const config = require('../config.cjs');
const logger = require('../lib/logger.cjs');
const jevCallLogRepository = require('../repositories/jevCallLogRepository.cjs');

const CACHE_LIMIT = 500;
const cache = new Map();

const WEAKNESS_CRITERIA = {
  CONCEPT_GAP: 'The core concept or definition is not understood.',
  PROCEDURE_ERROR: 'The concept is understood but the execution steps or algorithm are incorrect.',
  MEMORY_GAP: 'Previously learned knowledge appears to have been forgotten.',
  READING_ERROR: 'Errors mainly come from misunderstanding the question.',
  CALCULATION_ERROR: 'Errors are primarily arithmetic or mechanical calculation mistakes.',
  CARELESS_ERROR: 'The learner appears capable but makes avoidable execution mistakes.',
  INSUFFICIENT_EVIDENCE: 'There is not enough evidence to identify a meaningful weakness.',
  NO_SIGNIFICANT_WEAKNESS: 'No significant current weakness is demonstrated.',
};

const ACTION_CRITERIA = {
  CONTINUE_NEXT_NODE: 'Mastery is sufficient and stable enough to continue.',
  REVIEW_CONCEPT: 'Return to the knowledge explanation because conceptual understanding is weak.',
  RETRY_QUESTIONS: 'Perform additional practice to consolidate the knowledge.',
  OPEN_VISUALIZATION: 'Use interactive visualization to rebuild intuitive understanding.',
  RUN_EXPERIMENT: 'Complete an interactive experiment or simulation.',
  IMMEDIATE_REVIEW: 'Review this node again now.',
  DELAYED_REVIEW: 'Current mastery is acceptable but should be verified again after an interval.',
};

function buildState(node, metrics) {
  return {
    knowledge: {
      subject: node.subject || 'unknown',
      node: node.title,
      description: [node.chapter, node.kind].filter(Boolean).join(' · ') || undefined,
    },
    performance: {
      totalAttempts: metrics.totalAttempts,
      accuracy: metrics.accuracy,
      recentAccuracy: metrics.recentAccuracy,
      firstAttemptAccuracy: metrics.firstAttemptAccuracy,
      averageDurationSeconds: metrics.averageDuration,
      hintUsageRate: metrics.hintUsageRate,
      answerRevealRate: metrics.answerRevealRate,
      consecutiveCorrect: metrics.consecutiveCorrect,
      consecutiveWrong: metrics.consecutiveWrong,
    },
    learning: {
      contentCompleted: metrics.contentCompleted,
      visualizationUsed: metrics.visualizationUsageCount > 0,
      experimentCompleted: metrics.experimentCompleted,
      practiceCompleted: metrics.practiceCompleted,
      reviewCount: metrics.reviewCount,
      daysSinceLastStudy: metrics.daysSinceLastStudy,
    },
    recentAttempts: metrics.recentAttempts,
  };
}

function buildQuestions() {
  return {
    mastery_level: {
      type: 'score',
      instructions:
        'Evaluate the learner\'s demonstrated mastery of this knowledge node. Consider accuracy, recent performance, independence, repeated verification and stability. Do not treat simple content completion as mastery.',
      criteria: [
        'No demonstrated mastery',
        'Partial understanding with major gaps',
        'Basic mastery but still unstable',
        'Strong and mostly independent mastery',
        'Stable mastery demonstrated repeatedly',
      ],
    },
    stable_mastery: {
      type: 'noul',
      instructions:
        'Does the available learning evidence indicate that this knowledge has been retained and can be used independently rather than being a temporary short-term success?',
      criteria: {
        true: 'Performance is stable across repeated attempts or reviews and does not rely heavily on hints.',
        false: 'Success appears temporary, inconsistent, insufficiently verified, or highly dependent on assistance.',
      },
    },
    weakness_type: {
      type: 'choice',
      instructions: 'Identify the learner\'s primary current weakness for this knowledge node.',
      criteria: WEAKNESS_CRITERIA,
    },
    recommended_action: {
      type: 'choice',
      instructions:
        'Choose the most appropriate next learning action for this learner based on current mastery, stability, recent performance and independence.',
      criteria: ACTION_CRITERIA,
    },
  };
}

function stateHash(node, metrics) {
  return crypto.createHash('sha256').update(JSON.stringify({ node: node.id, state: buildState(node, metrics) })).digest('hex');
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function findAnswer(payload, name) {
  if (!payload || typeof payload !== 'object') return null;
  if (payload[name] && typeof payload[name] === 'object') return payload[name];
  for (const key of ['results', 'answers', 'outputs', 'data', 'result']) {
    const found = findAnswer(payload[key], name);
    if (found) return found;
  }
  return null;
}

function parseChoice(answer) {
  if (!answer) return null;
  const value = answer.choice || answer.value || answer.label || null;
  if (typeof value !== 'string') return null;
  return { value: value.trim().toUpperCase(), confidence: numberOrNull(answer.confidence) };
}

function parseResponse(payload) {
  const mastery = findAnswer(payload, 'mastery_level');
  const stable = findAnswer(payload, 'stable_mastery');
  const weakness = parseChoice(findAnswer(payload, 'weakness_type'));
  const action = parseChoice(findAnswer(payload, 'recommended_action'));

  let masteryScore = null;
  let masteryConfidence = null;
  if (mastery) {
    const raw = numberOrNull(mastery.score ?? mastery.value ?? mastery.probability);
    if (raw !== null) {
      masteryScore = raw <= 4.001 ? (raw / 4) * 100 : raw;
    }
    masteryConfidence = numberOrNull(mastery.confidence);
  }

  let stabilityScore = null;
  if (stable) {
    const raw = numberOrNull(stable.noul ?? stable.score ?? stable.value ?? stable.probability);
    if (raw !== null) stabilityScore = raw <= 1.001 ? raw * 100 : raw;
  }

  return {
    masteryScore,
    masteryConfidence,
    stabilityScore,
    weaknessType: weakness ? weakness.value : null,
    weaknessConfidence: weakness ? weakness.confidence : null,
    recommendedAction: action ? action.value : null,
    actionConfidence: action ? action.confidence : null,
  };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function requestJev(body) {
  const url = config.jev.baseUrl.replace(/\/$/, '') + '/systemone';
  let attempt = 0;
  let lastError = null;
  while (attempt <= config.jev.maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + config.jev.apiKey,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(config.jev.timeoutMs),
      });
      if (response.status === 429 || response.status === 529) {
        lastError = new Error('TypeSafe 限流：' + response.status);
        lastError.code = String(response.status);
      } else if (!response.ok) {
        const text = await response.text().catch(() => '');
        const error = new Error('TypeSafe 请求失败：' + response.status + ' ' + text.slice(0, 200));
        error.code = String(response.status);
        throw error;
      } else {
        return await response.json();
      }
    } catch (error) {
      lastError = error;
      if (error.code && !['429', '529'].includes(error.code)) throw error;
    }
    attempt += 1;
    if (attempt <= config.jev.maxRetries) await sleep(500 * 2 ** (attempt - 1));
  }
  throw lastError || new Error('TypeSafe 请求失败');
}

async function evaluate(node, metrics, context = {}) {
  if (!config.jev.enabled) {
    const error = new Error('Jev 未启用');
    error.code = 'JEV_DISABLED';
    throw error;
  }
  if (!config.jev.apiKey) {
    const error = new Error('缺少 TYPESAFE_API_KEY');
    error.code = 'JEV_NO_KEY';
    throw error;
  }

  const hash = stateHash(node, metrics);
  if (cache.has(hash)) return { ...cache.get(hash), cached: true };

  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  try {
    const payload = await requestJev({
      model: config.jev.model,
      state: buildState(node, metrics),
      questions: buildQuestions(),
    });
    const parsed = parseResponse(payload);
    const result = { ...parsed, requestId, raw: payload, usage: payload && payload.usage ? payload.usage : null, cached: false };
    if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value);
    cache.set(hash, result);
    jevCallLogRepository.insert({
      requestId,
      userId: context.userId,
      knowledgeNodeId: node.id,
      model: config.jev.model,
      latencyMs: Date.now() - startedAt,
      success: true,
      confidence: parsed.masteryConfidence,
      result: { ...parsed, usage: result.usage },
    });
    return result;
  } catch (error) {
    logger.warn('Jev 调用失败，将回退规则引擎', { requestId, node: node.id, error: error.message });
    jevCallLogRepository.insert({
      requestId,
      userId: context.userId,
      knowledgeNodeId: node.id,
      model: config.jev.model,
      latencyMs: Date.now() - startedAt,
      success: false,
      errorCode: error.code || 'JEV_ERROR',
    });
    throw error;
  }
}

module.exports = { buildState, buildQuestions, parseResponse, evaluate, stateHash };
