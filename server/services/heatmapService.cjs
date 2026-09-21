'use strict';

const { round } = require('../lib/time.cjs');
const { SUBJECT_TITLES } = require('../knowledge/nodes.cjs');

const SUBJECT_ORDER = [
  'data-structures',
  'computer-organization',
  'operating-systems',
  'computer-networks',
  'calculus',
  'linear-algebra',
  'probability',
];

function bucket() {
  return { weightSum: 0, masterySum: 0, evaluatedNodes: 0, trackedNodes: 0 };
}

function add(bucketItem, weight, mastery) {
  bucketItem.trackedNodes += 1;
  if (mastery === null || mastery === undefined) return;
  bucketItem.weightSum += weight;
  bucketItem.masterySum += mastery * weight;
  bucketItem.evaluatedNodes += 1;
}

function score(bucketItem) {
  return bucketItem.weightSum > 0 ? Math.round(bucketItem.masterySum / bucketItem.weightSum) : null;
}

// 父节点掌握度按「节点权重 × 掌握度」加权，而不是简单平均。
function buildHeatmap(states, nodes) {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const subjectMap = new Map();
  const overall = bucket();

  for (const state of states) {
    const node = nodeMap.get(state.knowledgeNodeId) || {};
    const subject = state.subject || node.subject || 'unknown';
    const chapter = node.chapter || '未分章';
    const weight = Number.isFinite(node.weight) && node.weight > 0 ? node.weight : 1;
    const mastery = state.status === 'EVALUATED' ? state.masteryScore : null;

    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, { subject, title: SUBJECT_TITLES[subject] || subject, ...bucket(), chapters: new Map() });
    }
    const subjectItem = subjectMap.get(subject);
    if (!subjectItem.chapters.has(chapter)) subjectItem.chapters.set(chapter, { chapter, ...bucket() });
    add(subjectItem, weight, mastery);
    add(subjectItem.chapters.get(chapter), weight, mastery);
    add(overall, weight, mastery);
  }

  const subjects = [...subjectMap.values()]
    .map(item => ({
      subject: item.subject,
      title: item.title,
      mastery: score(item),
      evaluatedNodes: item.evaluatedNodes,
      trackedNodes: item.trackedNodes,
      chapters: [...item.chapters.values()]
        .map(chapter => ({
          chapter: chapter.chapter,
          mastery: score(chapter),
          evaluatedNodes: chapter.evaluatedNodes,
          trackedNodes: chapter.trackedNodes,
        }))
        .sort((a, b) => a.chapter.localeCompare(b.chapter, 'zh-Hans-CN')),
    }))
    .sort((a, b) => {
      const indexA = SUBJECT_ORDER.indexOf(a.subject);
      const indexB = SUBJECT_ORDER.indexOf(b.subject);
      return (indexA < 0 ? 99 : indexA) - (indexB < 0 ? 99 : indexB);
    });

  return {
    overall: {
      mastery: score(overall),
      evaluatedNodes: overall.evaluatedNodes,
      trackedNodes: overall.trackedNodes,
    },
    subjects,
  };
}

module.exports = { buildHeatmap, SUBJECT_ORDER };
