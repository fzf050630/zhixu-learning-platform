'use strict';

const { WEAKNESS_LABELS, ACTION_LABELS, masteryLabel } = require('./ruleMasteryService.cjs');

function buildMasteryResponse({ node, state, pendingReview, metrics }) {
  const base = {
    nodeId: node.id,
    subject: node.subject,
    title: node.title,
    chapter: node.chapter,
  };

  if (!state || state.status === 'INSUFFICIENT_DATA') {
    return {
      ...base,
      status: 'INSUFFICIENT_DATA',
      mastery: null,
      stability: null,
      reviewUrgency: null,
      weakness: null,
      recommendation: { action: null, label: null, nextReviewAt: null },
      evidence: {
        attempts: metrics ? metrics.totalAttempts : 0,
        experimentCompleted: metrics ? metrics.experimentCompleted : false,
      },
      message: '完成一些练习后即可评估',
    };
  }

  const nextReviewAt = (pendingReview && (pendingReview.scheduled_at || pendingReview.scheduledAt)) || state.nextReviewAt || null;
  return {
    ...base,
    status: 'EVALUATED',
    mastery: {
      score: Math.round(state.masteryScore),
      level: state.masteryLevel,
      label: masteryLabel(state.masteryLevel),
    },
    stability: Math.round(state.stabilityScore),
    reviewUrgency: Math.round(state.reviewUrgency),
    weakness: state.weaknessType
      ? { type: state.weaknessType, label: WEAKNESS_LABELS[state.weaknessType] || state.weaknessType }
      : null,
    recommendation: {
      action: state.recommendedAction,
      label: ACTION_LABELS[state.recommendedAction] || null,
      nextReviewAt,
    },
    breakdown: {
      ruleScore: state.ruleScore,
      jevScore: state.jevScore,
      confidence: state.confidence,
    },
    attemptCount: state.attemptCount,
    reviewCount: state.reviewCount,
    lastLearnedAt: state.lastLearnedAt,
    lastEvaluatedAt: state.lastEvaluatedAt,
  };
}

module.exports = { buildMasteryResponse };
