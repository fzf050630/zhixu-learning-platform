'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { computeMetrics, hasEnoughEvidence } = require('../../server/services/masteryMetricService.cjs');
const ruleMastery = require('../../server/services/ruleMasteryService.cjs');
const reviewSchedulerService = require('../../server/services/reviewSchedulerService.cjs');
const { buildHeatmap } = require('../../server/services/heatmapService.cjs');

function questionEvent(correct, options = {}) {
  return {
    type: options.type || 'QUESTION_SUBMIT',
    occurredAt: options.at || new Date().toISOString(),
    data: {
      questionId: options.questionId || 'q',
      correct,
      hintUsed: Boolean(options.hintUsed),
      answerRevealed: Boolean(options.answerRevealed),
      durationSeconds: options.durationSeconds,
      attempt: options.attempt || 1,
      questionType: 'AVL rotation',
    },
  };
}

test('computeMetrics 汇总正确率、近期表现与连续正确', () => {
  const now = new Date('2026-09-21T10:00:00Z');
  const events = [
    questionEvent(false, { at: '2026-09-18T10:00:00Z', hintUsed: true, attempt: 1 }),
    questionEvent(true, { at: '2026-09-18T10:01:00Z', attempt: 2 }),
    questionEvent(true, { at: '2026-09-20T10:00:00Z', durationSeconds: 60 }),
    questionEvent(true, { at: '2026-09-21T09:00:00Z', durationSeconds: 80 }),
    { type: 'EXPERIMENT_COMPLETE', occurredAt: '2026-09-20T09:00:00Z', data: {} },
    { type: 'REVIEW_COMPLETE', occurredAt: '2026-09-21T08:00:00Z', data: {} },
  ];
  const metrics = computeMetrics(events, { now, recentWindow: 3 });
  assert.equal(metrics.totalAttempts, 4);
  assert.equal(metrics.correctAttempts, 3);
  assert.equal(metrics.accuracy, 0.75);
  assert.equal(metrics.recentAccuracy, 1);
  assert.equal(metrics.consecutiveCorrect, 3);
  assert.equal(metrics.consecutiveWrong, 0);
  assert.equal(metrics.hintUsageRate, 0.25);
  assert.equal(metrics.experimentCompleted, true);
  assert.equal(metrics.reviewCount, 1);
  assert.ok(metrics.daysSinceLastStudy > 0 && metrics.daysSinceLastStudy < 1);
  assert.ok(metrics.daysSinceLastCorrectAnswer > 0 && metrics.daysSinceLastCorrectAnswer < 1);
  assert.equal(hasEnoughEvidence(metrics), true);
});

test('computeMetrics 对无证据事件返回零指标', () => {
  const metrics = computeMetrics([{ type: 'NODE_OPEN', occurredAt: '2026-09-21T10:00:00Z', data: {} }]);
  assert.equal(metrics.totalAttempts, 0);
  assert.equal(metrics.accuracy, 0);
  assert.equal(hasEnoughEvidence(metrics), false);
});

test('RuleScore 权重与等级划分符合文档', () => {
  const metrics = computeMetrics([
    questionEvent(true), questionEvent(true), questionEvent(true), questionEvent(true), questionEvent(true),
  ], { recentWindow: 5 });
  const rule = ruleMastery.computeRuleMastery(metrics, { minAttempts: 3, hasVisualization: true });
  assert.ok(rule.ruleScore > 80, `ruleScore 应较高，实际 ${rule.ruleScore}`);
  assert.equal(ruleMastery.resolveMasteryLevel(rule.ruleScore), 'PROFICIENT');
  assert.equal(ruleMastery.masteryLabel('PROFICIENT'), '熟练掌握');
  assert.equal(ruleMastery.resolveMasteryLevel(20), 'NOT_MASTERED');
  assert.equal(ruleMastery.resolveMasteryLevel(95), 'MASTERED');
});

test('低正确率触发复习概念，连续错误触发追加练习', () => {
  const weak = computeMetrics([
    questionEvent(false), questionEvent(false), questionEvent(false),
  ], { recentWindow: 5 });
  const weakRule = ruleMastery.computeRuleMastery(weak, { minAttempts: 3 });
  assert.equal(weakRule.recommendedAction, 'REVIEW_CONCEPT');

  const streak = computeMetrics([
    questionEvent(true), questionEvent(true), questionEvent(false), questionEvent(false), questionEvent(false),
  ], { recentWindow: 5 });
  const streakRule = ruleMastery.computeRuleMastery(streak, { minAttempts: 3, hasVisualization: false });
  assert.ok(['RETRY_QUESTIONS', 'REVIEW_CONCEPT'].includes(streakRule.recommendedAction));
});

test('时间衰减随稳定度降低而加快', () => {
  const stable = ruleMastery.computeDecay({ metrics: { daysSinceLastStudy: 10 }, stabilityScore: 90, masteryScore: 90 });
  const unstable = ruleMastery.computeDecay({ metrics: { daysSinceLastStudy: 10 }, stabilityScore: 20, masteryScore: 90 });
  assert.equal(stable.retentionDays, 60);
  assert.equal(unstable.retentionDays, 7);
  assert.ok(unstable.decayFactor < stable.decayFactor);
});

test('复习间隔按 1/3/7/14/30 天递增并可被低稳定度压缩', () => {
  assert.equal(reviewSchedulerService.nextIntervalDays({ masteryScore: 80, stabilityScore: 80, reviewCount: 0, consecutiveWrong: 0 }), 1);
  assert.equal(reviewSchedulerService.nextIntervalDays({ masteryScore: 80, stabilityScore: 80, reviewCount: 2, consecutiveWrong: 0 }), 7);
  assert.equal(reviewSchedulerService.nextIntervalDays({ masteryScore: 80, stabilityScore: 20, reviewCount: 3, consecutiveWrong: 0 }), 3);
  assert.equal(reviewSchedulerService.nextIntervalDays({ masteryScore: 80, stabilityScore: 80, reviewCount: 4, consecutiveWrong: 1 }), 1);
});

test('热力图按节点权重加权，未评估节点不参与均值', () => {
  const nodes = [
    { id: 'a', subject: 'data-structures', chapter: '树', weight: 3 },
    { id: 'b', subject: 'data-structures', chapter: '树', weight: 1 },
    { id: 'c', subject: 'probability', chapter: '随机事件和概率', weight: 1 },
  ];
  const states = [
    { knowledgeNodeId: 'a', subject: 'data-structures', status: 'EVALUATED', masteryScore: 100 },
    { knowledgeNodeId: 'b', subject: 'data-structures', status: 'EVALUATED', masteryScore: 0 },
    { knowledgeNodeId: 'c', subject: 'probability', status: 'INSUFFICIENT_DATA', masteryScore: 0 },
  ];
  const heatmap = buildHeatmap(states, nodes);
  assert.equal(heatmap.subjects.length, 2);
  const ds = heatmap.subjects.find(item => item.subject === 'data-structures');
  assert.equal(ds.mastery, 75);
  assert.equal(ds.chapters[0].chapter, '树');
  assert.equal(ds.chapters[0].mastery, 75);
  const probability = heatmap.subjects.find(item => item.subject === 'probability');
  assert.equal(probability.mastery, null);
  assert.equal(probability.evaluatedNodes, 0);
  assert.equal(probability.trackedNodes, 1);
  assert.equal(heatmap.overall.evaluatedNodes, 2);
});
