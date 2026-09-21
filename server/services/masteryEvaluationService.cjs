'use strict';

const config = require('../config.cjs');
const logger = require('../lib/logger.cjs');
const { round } = require('../lib/time.cjs');
const { resolveNode } = require('../knowledge/nodes.cjs');
const learningEventRepository = require('../repositories/learningEventRepository.cjs');
const knowledgeStateRepository = require('../repositories/knowledgeStateRepository.cjs');
const masteryEvaluationRepository = require('../repositories/masteryEvaluationRepository.cjs');
const reviewScheduleRepository = require('../repositories/reviewScheduleRepository.cjs');
const { computeMetrics, hasEnoughEvidence } = require('./masteryMetricService.cjs');
const ruleMastery = require('./ruleMasteryService.cjs');
const reviewSchedulerService = require('./reviewSchedulerService.cjs');
const jevDecisionService = require('./jevDecisionService.cjs');

function applyBusinessConstraints({ masteryScore, stabilityScore, weaknessType, recommendedAction, hasVisualization, metrics }) {
  if (masteryScore >= 90 && stabilityScore >= 80) return 'CONTINUE_NEXT_NODE';
  if (masteryScore < 40) return 'REVIEW_CONCEPT';
  if (weaknessType === 'PROCEDURE_ERROR' && hasVisualization) return 'OPEN_VISUALIZATION';
  if (masteryScore >= 75 && stabilityScore < 65) return 'DELAYED_REVIEW';
  if (metrics.consecutiveWrong >= 2) return 'RETRY_QUESTIONS';
  return recommendedAction;
}

function jevWeightFor(confidence) {
  const { full } = config.mastery.confidence;
  return confidence >= full ? config.mastery.jevWeight : config.mastery.jevWeight / 2;
}

function insufficientState(userId, node, metrics) {
  return {
    userId,
    knowledgeNodeId: node.id,
    subject: node.subject,
    status: 'INSUFFICIENT_DATA',
    masteryScore: 0,
    masteryLevel: 'NOT_MASTERED',
    ruleScore: 0,
    jevScore: null,
    stabilityScore: 0,
    reviewUrgency: 0,
    weaknessType: 'INSUFFICIENT_EVIDENCE',
    recommendedAction: null,
    confidence: 0,
    attemptCount: metrics.totalAttempts,
    reviewCount: metrics.reviewCount,
    lastLearnedAt: metrics.lastStudiedAt,
    lastEvaluatedAt: new Date().toISOString(),
    nextReviewAt: null,
    metrics,
  };
}

async function assemble(userId, nodeId, options = {}) {
  const node = resolveNode(nodeId);
  const now = options.now ? new Date(options.now) : new Date();
  const events = learningEventRepository.listByUserNode(userId, nodeId, { limit: 2000 });
  const metrics = computeMetrics(events, { now, recentWindow: config.mastery.recentWindow });

  if (!hasEnoughEvidence(metrics, { minAttempts: config.mastery.minAttempts })) {
    return { node, metrics, state: insufficientState(userId, node, metrics), jev: null, components: null };
  }

  const rule = ruleMastery.computeRuleMastery(metrics, {
    minAttempts: config.mastery.minAttempts,
    hasVisualization: node.hasVisualization,
    now,
  });

  let jev = null;
  let jevScore = null;
  let jevUsed = false;
  let stabilityScore = rule.stabilityScore;
  let weaknessType = rule.weaknessType;
  let recommendedAction = rule.recommendedAction;

  if (options.useJev !== false && config.jev.enabled) {
    try {
      jev = await jevDecisionService.evaluate(node, metrics, { userId });
      const masteryConfidence = jev.masteryConfidence === null ? 0 : jev.masteryConfidence;
      if (jev.masteryScore !== null && masteryConfidence >= config.mastery.confidence.weak) {
        jevScore = jev.masteryScore;
        jevUsed = true;
      }
      if (jev.stabilityScore !== null && masteryConfidence >= config.mastery.confidence.weak) {
        stabilityScore = round(rule.stabilityScore * 0.5 + jev.stabilityScore * 0.5, 1);
      }
      if (jev.weaknessType && (jev.weaknessConfidence === null || jev.weaknessConfidence >= config.mastery.confidence.weak)) {
        weaknessType = jev.weaknessType;
      }
      if (jev.recommendedAction && (jev.actionConfidence === null || jev.actionConfidence >= config.mastery.confidence.weak)) {
        recommendedAction = jev.recommendedAction;
      }
    } catch (error) {
      logger.info('掌握度评估使用规则兜底', { node: node.id, reason: error.code || error.message });
      jev = null;
    }
  }

  let masteryScore = rule.ruleScore;
  if (jevUsed) {
    const weight = jevWeightFor(jev.masteryConfidence);
    masteryScore = round(rule.ruleScore * (1 - weight) + jevScore * weight, 1);
  }

  const masteryLevel = ruleMastery.resolveMasteryLevel(masteryScore);
  const decay = ruleMastery.computeDecay({ metrics, stabilityScore, masteryScore, now });
  const reviewUrgency = ruleMastery.computeReviewUrgency({ metrics, stabilityScore, masteryScore, decayFactor: decay.decayFactor });
  const finalAction = applyBusinessConstraints({
    masteryScore,
    stabilityScore,
    weaknessType,
    recommendedAction,
    hasVisualization: node.hasVisualization,
    metrics,
  });

  const confidence = jevUsed
    ? round(jev.masteryConfidence === null ? 0 : jev.masteryConfidence, 2)
    : round(Math.min(1, metrics.totalAttempts / (config.mastery.minAttempts * 3)), 2);

  const schedule = reviewSchedulerService.buildSchedule({
    metrics,
    masteryScore,
    stabilityScore,
    reviewCount: metrics.reviewCount,
    now,
  });

  const state = {
    userId,
    knowledgeNodeId: node.id,
    subject: node.subject,
    status: 'EVALUATED',
    masteryScore,
    masteryLevel,
    ruleScore: rule.ruleScore,
    jevScore: jevScore === null ? null : round(jevScore, 1),
    stabilityScore,
    reviewUrgency,
    weaknessType,
    recommendedAction: finalAction,
    confidence,
    attemptCount: metrics.totalAttempts,
    reviewCount: metrics.reviewCount,
    lastLearnedAt: metrics.lastStudiedAt,
    lastEvaluatedAt: now.toISOString(),
    nextReviewAt: schedule.scheduledAt,
    metrics,
    decay,
    components: rule.components,
    schedule,
  };

  return { node, metrics, state, jev, components: rule.components, rule };
}

async function evaluate(userId, nodeId, options = {}) {
  const result = await assemble(userId, nodeId, options);
  const { node, state, jev } = result;

  if (state.status === 'INSUFFICIENT_DATA') {
    knowledgeStateRepository.upsert(state);
    return result;
  }

  masteryEvaluationRepository.insert({
    userId,
    knowledgeNodeId: node.id,
    ruleScore: state.ruleScore,
    jevScore: state.jevScore,
    finalScore: state.masteryScore,
    masteryLevel: state.masteryLevel,
    stabilityScore: state.stabilityScore,
    reviewUrgency: state.reviewUrgency,
    weaknessType: state.weaknessType,
    recommendedAction: state.recommendedAction,
    jevConfidence: jev ? jev.masteryConfidence : null,
    jevUsed: state.jevScore !== null,
    inputSnapshot: {
      node: { id: node.id, title: node.title, subject: node.subject },
      metrics: result.metrics,
      components: state.components,
    },
    jevResponse: jev ? { ...jev, raw: undefined } : null,
    algorithmVersion: config.algorithmVersion,
    questionVersion: config.questionVersion,
  });

  knowledgeStateRepository.upsert(state);
  reviewScheduleRepository.replacePending(userId, node.id, {
    scheduledAt: state.nextReviewAt,
    reason: state.schedule.reason,
    source: 'SYSTEM',
  });

  return result;
}

function getStoredState(userId, nodeId) {
  const node = resolveNode(nodeId);
  const events = learningEventRepository.listByUserNode(userId, nodeId, { limit: 2000 });
  const metrics = computeMetrics(events, { recentWindow: config.mastery.recentWindow });
  const stored = knowledgeStateRepository.find(userId, nodeId);
  const pendingReview = reviewScheduleRepository.pendingFor(userId, nodeId);
  return { node, metrics, state: stored, pendingReview };
}

module.exports = { assemble, evaluate, getStoredState, applyBusinessConstraints };
