'use strict';

const { daysBetween, round } = require('../lib/time.cjs');
const { ANSWER_TYPES } = require('../knowledge/nodes.cjs');

const EXPERIMENT_TYPES = new Set(['EXPERIMENT_COMPLETE', 'VISUALIZATION_COMPLETE']);
const CONTENT_TYPES = new Set(['CONTENT_READ', 'VIDEO_COMPLETE', 'NODE_COMPLETE']);

function toAttempt(event, index) {
  const data = event.data || {};
  let correct = data.correct;
  if (correct === undefined) {
    if (event.type === 'QUESTION_CORRECT') correct = true;
    else if (event.type === 'QUESTION_WRONG') correct = false;
  }
  if (typeof correct !== 'boolean') return null;
  return {
    index,
    questionId: data.questionId || null,
    questionType: data.questionType || null,
    correct,
    hintUsed: Boolean(data.hintUsed),
    answerRevealed: Boolean(data.answerRevealed || data.answerViewed),
    durationSeconds: Number.isFinite(data.durationSeconds) ? Number(data.durationSeconds) : null,
    attempt: Number.isFinite(data.attempt) ? Number(data.attempt) : 1,
    at: event.occurredAt,
  };
}

function ratio(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function trailingStreak(attempts) {
  let correct = 0;
  let wrong = 0;
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    if (attempts[index].correct) {
      if (wrong > 0) break;
      correct += 1;
    } else {
      if (correct > 0) break;
      wrong += 1;
    }
  }
  return { consecutiveCorrect: correct, consecutiveWrong: wrong };
}

function computeMetrics(events, options = {}) {
  const now = options.now ? new Date(options.now) : new Date();
  const recentWindow = Math.max(1, Number(options.recentWindow) || 5);
  const attempts = [];
  let contentCompleted = false;
  let experimentCompleted = false;
  let practiceCompleted = false;
  let visualizationUsageCount = 0;
  let reviewCount = 0;
  let hintOpenCount = 0;
  let answerViewCount = 0;
  let lastStudiedAt = null;
  let firstStudiedAt = null;

  events.forEach((event, index) => {
    const at = event.occurredAt;
    if (at) {
      if (!lastStudiedAt || at > lastStudiedAt) lastStudiedAt = at;
      if (!firstStudiedAt || at < firstStudiedAt) firstStudiedAt = at;
    }
    if (ANSWER_TYPES.has(event.type)) {
      const attempt = toAttempt(event, index);
      if (attempt) attempts.push(attempt);
    }
    if (EXPERIMENT_TYPES.has(event.type)) experimentCompleted = true;
    if (event.type === 'QUIZ_COMPLETE') practiceCompleted = true;
    if (CONTENT_TYPES.has(event.type)) contentCompleted = true;
    if (event.type === 'VISUALIZATION_OPEN') visualizationUsageCount += 1;
    if (event.type === 'REVIEW_COMPLETE') reviewCount += 1;
    if (event.type === 'HINT_OPEN') hintOpenCount += 1;
    if (event.type === 'ANSWER_VIEW') answerViewCount += 1;
  });

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(attempt => attempt.correct).length;
  const recentAttempts = attempts.slice(-recentWindow);
  const recentCorrect = recentAttempts.filter(attempt => attempt.correct).length;
  const firstAttempts = attempts.filter(attempt => attempt.attempt <= 1);
  const firstCorrect = firstAttempts.filter(attempt => attempt.correct).length;
  const hintAttempts = attempts.filter(attempt => attempt.hintUsed).length;
  const revealedAttempts = attempts.filter(attempt => attempt.answerRevealed).length;
  const durations = attempts.map(attempt => attempt.durationSeconds).filter(value => value !== null);
  const lastCorrect = [...attempts].reverse().find(attempt => attempt.correct);
  const streak = trailingStreak(attempts);

  return {
    totalAttempts,
    correctAttempts,
    accuracy: round(ratio(correctAttempts, totalAttempts), 4),
    recentAccuracy: round(ratio(recentCorrect, recentAttempts.length), 4),
    firstAttemptAccuracy: round(ratio(firstCorrect, firstAttempts.length), 4),
    averageDuration: durations.length ? round(durations.reduce((sum, value) => sum + value, 0) / durations.length, 1) : null,
    medianDuration: median(durations),
    hintUsageRate: round(ratio(hintAttempts, totalAttempts), 4),
    answerRevealRate: round(ratio(revealedAttempts, totalAttempts), 4),
    hintOpenCount,
    answerViewCount,
    contentCompleted,
    experimentCompleted,
    practiceCompleted,
    visualizationUsageCount,
    reviewCount,
    daysSinceLastStudy: lastStudiedAt ? round(daysBetween(lastStudiedAt, now), 2) : null,
    daysSinceLastCorrectAnswer: lastCorrect ? round(daysBetween(lastCorrect.at, now), 2) : null,
    consecutiveCorrect: streak.consecutiveCorrect,
    consecutiveWrong: streak.consecutiveWrong,
    lastStudiedAt,
    firstStudiedAt,
    recentAttempts: recentAttempts.map(attempt => ({
      questionType: attempt.questionType,
      questionId: attempt.questionId,
      correct: attempt.correct,
      hintUsed: attempt.hintUsed,
    })),
  };
}

function hasEnoughEvidence(metrics, options = {}) {
  const minAttempts = Number(options.minAttempts) || 3;
  if (metrics.totalAttempts >= minAttempts) return true;
  // 完成一次实验或一整组自测，并至少有一道检测题，也视为有效证据。
  return Boolean((metrics.experimentCompleted || metrics.practiceCompleted) && metrics.totalAttempts >= 1);
}

module.exports = { computeMetrics, hasEnoughEvidence, median };
