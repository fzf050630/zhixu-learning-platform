'use strict';

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(from, to = new Date()) {
  const start = toDate(from);
  const end = toDate(to);
  if (!start || !end) return null;
  return (end.getTime() - start.getTime()) / DAY_MS;
}

function addDays(from, days) {
  const date = toDate(from) || new Date();
  return new Date(date.getTime() + days * DAY_MS);
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return value < min ? min : value > max ? max : value;
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

module.exports = { DAY_MS, toDate, daysBetween, addDays, clamp, round };
