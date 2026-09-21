'use strict';

const { clamp, round, daysBetween } = require('../lib/time.cjs');

const WEIGHTS = {
  accuracy: 0.30,
  recent: 0.25,
  independence: 0.15,
  stability: 0.15,
  completion: 0.10,
  efficiency: 0.05,
};

const MASTERY_LEVELS = [
  { level: 'NOT_MASTERED', min: 0, max: 39.999, label: '未掌握' },
  { level: 'EMERGING', min: 40, max: 59.999, label: '初步理解' },
  { level: 'BASIC', min: 60, max: 74.999, label: '基本掌握' },
  { level: 'PROFICIENT', min: 75, max: 89.999, label: '熟练掌握' },
  { level: 'MASTERED', min: 90, max: 100, label: '稳定掌握' },
];

const WEAKNESS_LABELS = {
  CONCEPT_GAP: '概念理解不足',
  PROCEDURE_ERROR: '操作步骤仍不稳定',
  MEMORY_GAP: '已学内容出现遗忘',
  READING_ERROR: '题意理解偏差',
  CALCULATION_ERROR: '计算失误',
  CARELESS_ERROR: '粗心导致的可避免错误',
  INSUFFICIENT_EVIDENCE: '证据不足',
  NO_SIGNIFICANT_WEAKNESS: '暂无明显薄弱点',
};

const ACTION_LABELS = {
  CONTINUE_NEXT_NODE: '进入下一知识节点',
  REVIEW_CONCEPT: '重看知识讲解',
  RETRY_QUESTIONS: '追加练习巩固',
  OPEN_VISUALIZATION: '打开交互可视化',
  RUN_EXPERIMENT: '完成一次交互实验',
  IMMEDIATE_REVIEW: '立即复习',
  DELAYED_REVIEW: '间隔后复习',
};

function resolveMasteryLevel(score) {
  const value = clamp(Number(score) || 0, 0, 100);
  const found = MASTERY_LEVELS.find(item => value >= item.min && value <= item.max);
  return found ? found.level : 'NOT_MASTERED';
}

function masteryLabel(level) {
  const found = MASTERY_LEVELS.find(item => item.level === level);
  return found ? found.label : '未掌握';
}

function retentionDaysFor(stabilityScore) {
  if (stabilityScore < 40) return 7;
  if (stabilityScore < 75) return 21;
  return 60;
}

function computeStability(metrics) {
  if (metrics.totalAttempts === 0 && !metrics.experimentCompleted) return 0;
  let score = metrics.totalAttempts > 0 ? 38 : 20;
  score += Math.min(metrics.consecutiveCorrect, 5) * 6;
  score += Math.min(metrics.reviewCount, 3) * 8;
  score += (metrics.firstAttemptAccuracy - 0.5) * 20;
  if (metrics.consecutiveWrong > 0) score -= Math.min(metrics.consecutiveWrong, 3) * 10;
  const days = metrics.daysSinceLastStudy;
  if (Number.isFinite(days)) score -= clamp((days - 3) * 2, 0, 40);
  return round(clamp(score, 0, 100), 1);
}

function computeRuleStabilityScore(metrics, stability) {
  return round(clamp(stability, 0, 100), 1);
}

function computeIndependence(metrics) {
  const raw = 100 - metrics.hintUsageRate * 50 - metrics.answerRevealRate * 80;
  return round(clamp(raw, 0, 100), 1);
}

function computeCompletion(metrics, minAttempts) {
  let score = 0;
  if (metrics.contentCompleted) score += 35;
  if (metrics.experimentCompleted) score += 25;
  score += Math.min(metrics.totalAttempts / Math.max(1, minAttempts), 1) * 20;
  if (metrics.reviewCount > 0) score += 20;
  return round(clamp(score, 0, 100), 1);
}

function computeEfficiency(metrics) {
  const median = metrics.medianDuration;
  if (median === null) return 75;
  const penalty = clamp((median - 240) / 10, 0, 30);
  return round(100 - penalty, 1);
}

function inferWeakness(metrics, context = {}) {
  if (metrics.totalAttempts === 0 && !metrics.experimentCompleted) return 'INSUFFICIENT_EVIDENCE';
  if (metrics.totalAttempts < 3) return 'INSUFFICIENT_EVIDENCE';
  if (metrics.correctAttempts === 0) return 'CONCEPT_GAP';
  if (metrics.answerRevealRate >= 0.3 || metrics.hintUsageRate >= 0.5) return 'CONCEPT_GAP';
  if (metrics.recentAccuracy + 0.15 < metrics.accuracy) return 'MEMORY_GAP';
  const days = metrics.daysSinceLastStudy;
  if (Number.isFinite(days) && days > 14 && metrics.accuracy >= 0.7) return 'MEMORY_GAP';
  if (metrics.accuracy >= 0.9 && metrics.consecutiveWrong > 0) return 'CARELESS_ERROR';
  if (metrics.consecutiveWrong >= 2) return 'PROCEDURE_ERROR';
  if (metrics.accuracy >= 0.95) return 'NO_SIGNIFICANT_WEAKNESS';
  return 'PROCEDURE_ERROR';
}

function recommendAction({ metrics, masteryScore, stabilityScore, weaknessType, hasVisualization }) {
  if (masteryScore >= 90 && stabilityScore >= 80) return 'CONTINUE_NEXT_NODE';
  if (masteryScore < 40) return 'REVIEW_CONCEPT';
  if (weaknessType === 'PROCEDURE_ERROR' && hasVisualization) return 'OPEN_VISUALIZATION';
  if (masteryScore >= 75 && stabilityScore < 65) return 'DELAYED_REVIEW';
  if (metrics.consecutiveWrong >= 2) return 'RETRY_QUESTIONS';
  if (metrics.totalAttempts > 0 && metrics.accuracy < 0.6) return 'RETRY_QUESTIONS';
  if (!metrics.experimentCompleted && hasVisualization && masteryScore < 70) return 'RUN_EXPERIMENT';
  if (weaknessType === 'CONCEPT_GAP') return 'REVIEW_CONCEPT';
  if (metrics.reviewCount === 0 && masteryScore >= 60) return 'DELAYED_REVIEW';
  return 'RETRY_QUESTIONS';
}

function computeReviewUrgency({ metrics, stabilityScore, masteryScore, decayFactor }) {
  const retention = retentionDaysFor(stabilityScore);
  let urgency = (1 - decayFactor) * 100;
  urgency += (1 - clamp(stabilityScore, 0, 100) / 100) * 15;
  if (metrics.consecutiveWrong > 0) urgency += Math.min(metrics.consecutiveWrong, 3) * 8;
  if (metrics.daysSinceLastCorrectAnswer !== null && metrics.daysSinceLastCorrectAnswer > retention) urgency += 15;
  if (masteryScore >= 90 && stabilityScore >= 80) urgency *= 0.5;
  return round(clamp(urgency, 0, 100), 1);
}

function computeDecay({ metrics, stabilityScore, masteryScore, now }) {
  const retentionDays = retentionDaysFor(stabilityScore);
  const days = Number.isFinite(metrics.daysSinceLastStudy)
    ? metrics.daysSinceLastStudy
    : daysBetween(metrics.lastStudiedAt || now, now) || 0;
  const decayFactor = Math.exp(-Math.max(0, days) / retentionDays);
  return { retentionDays, decayFactor, effectiveMastery: round(masteryScore * decayFactor, 1) };
}

function computeRuleMastery(metrics, options = {}) {
  const minAttempts = Number(options.minAttempts) || 3;
  const now = options.now ? new Date(options.now) : new Date();
  const accuracyScore = round(metrics.accuracy * 100, 1);
  const recentScore = round(metrics.recentAccuracy * 100, 1);
  const independenceScore = computeIndependence(metrics);
  const stabilityScore = computeStability(metrics);
  const completionScore = computeCompletion(metrics, minAttempts);
  const efficiencyScore = computeEfficiency(metrics);

  const ruleScore = round(clamp(
    accuracyScore * WEIGHTS.accuracy +
    recentScore * WEIGHTS.recent +
    independenceScore * WEIGHTS.independence +
    stabilityScore * WEIGHTS.stability +
    completionScore * WEIGHTS.completion +
    efficiencyScore * WEIGHTS.efficiency,
    0, 100
  ), 1);

  const weaknessType = inferWeakness(metrics, options);
  const recommendedAction = recommendAction({
    metrics,
    masteryScore: ruleScore,
    stabilityScore,
    weaknessType,
    hasVisualization: Boolean(options.hasVisualization),
  });

  return {
    ruleScore,
    stabilityScore: computeRuleStabilityScore(metrics, stabilityScore),
    weaknessType,
    recommendedAction,
    components: {
      accuracyScore,
      recentScore,
      independenceScore,
      stabilityScore,
      completionScore,
      efficiencyScore,
    },
  };
}

module.exports = {
  WEIGHTS,
  MASTERY_LEVELS,
  WEAKNESS_LABELS,
  ACTION_LABELS,
  resolveMasteryLevel,
  masteryLabel,
  retentionDaysFor,
  computeStability,
  computeDecay,
  computeReviewUrgency,
  inferWeakness,
  recommendAction,
  computeRuleMastery,
};
