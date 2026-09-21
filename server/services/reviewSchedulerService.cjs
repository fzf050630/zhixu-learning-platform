'use strict';

const { addDays, clamp } = require('../lib/time.cjs');

const INTERVALS_DAYS = [1, 3, 7, 14, 30];

function nextIntervalDays({ masteryScore, stabilityScore, reviewCount, consecutiveWrong }) {
  let days = INTERVALS_DAYS[Math.min(Math.max(reviewCount, 0), INTERVALS_DAYS.length - 1)];
  if (stabilityScore < 40) days = Math.min(days, 3);
  if (masteryScore >= 90 && stabilityScore >= 80) days = Math.max(days, 14);
  if (consecutiveWrong > 0) days = 1;
  return days;
}

function scheduledMoment(from, days) {
  const date = addDays(from, days);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
}

function buildSchedule({ metrics, masteryScore, stabilityScore, reviewCount, now = new Date() }) {
  const days = nextIntervalDays({
    masteryScore,
    stabilityScore,
    reviewCount,
    consecutiveWrong: metrics.consecutiveWrong,
  });
  return {
    scheduledAt: scheduledMoment(now, days),
    reason: `掌握度 ${Math.round(clamp(masteryScore, 0, 100))}，稳定度 ${Math.round(clamp(stabilityScore, 0, 100))}，第 ${reviewCount + 1} 次复习安排在 ${days} 天后`,
    source: 'SYSTEM',
    intervalDays: days,
  };
}

module.exports = { INTERVALS_DAYS, nextIntervalDays, buildSchedule };
