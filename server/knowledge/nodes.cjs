'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ANSWER_TYPES = new Set(['QUESTION_SUBMIT', 'QUESTION_CORRECT', 'QUESTION_WRONG']);

const SUBJECT_TITLES = {
  'data-structures': '数据结构',
  'computer-organization': '计算机组成原理',
  'operating-systems': '操作系统',
  'computer-networks': '计算机网络',
  calculus: '高等数学',
  'linear-algebra': '线性代数',
  probability: '概率论与数理统计',
};

const NODES_JSON = path.join(__dirname, '..', 'data', 'knowledge-nodes.json');

let registry = null;

function nodeIdFor(subject, hash) {
  return subject + ':' + String(hash || '').replace(/^#\/?/, '');
}

function entryToNode(entry) {
  const id = nodeIdFor(entry.subject, entry.hash);
  return {
    id,
    subject: entry.subject,
    subjectTitle: SUBJECT_TITLES[entry.subject] || entry.subject,
    title: entry.title,
    chapter: entry.chapter,
    number: entry.number || null,
    kind: entry.kind,
    hash: entry.hash,
    weight: Number.isFinite(entry.weight) && entry.weight > 0 ? entry.weight : 1,
    hasVisualization: entry.kind === '算法实验' ? true : Number(entry.viz || 0) > 0,
  };
}

function buildFromCatalog() {
  // 延迟加载：部署时若已预生成 knowledge-nodes.json，则无需各科源码。
  const { createCatalog } = require('../../scripts/catalog.cjs');
  return createCatalog().entries.map(entryToNode);
}

function loadRegistry() {
  if (registry) return registry;
  let entries;
  if (fs.existsSync(NODES_JSON)) {
    try {
      entries = JSON.parse(fs.readFileSync(NODES_JSON, 'utf8'));
    } catch (_) {
      entries = null;
    }
  }
  if (!Array.isArray(entries) || !entries.length) entries = buildFromCatalog();
  const map = new Map(entries.map(node => [node.id, node]));
  registry = { map, entries };
  return registry;
}

function getNode(nodeId) {
  return loadRegistry().map.get(nodeId) || null;
}

function resolveNode(nodeId) {
  const known = getNode(nodeId);
  if (known) return known;
  const separator = nodeId.indexOf(':');
  return {
    id: nodeId,
    subject: separator >= 0 ? nodeId.slice(0, separator) : null,
    subjectTitle: SUBJECT_TITLES[nodeId.slice(0, separator)] || null,
    title: separator >= 0 ? nodeId.slice(separator + 1) : nodeId,
    chapter: null,
    number: null,
    kind: 'UNKNOWN',
    hash: null,
    weight: 1,
    hasVisualization: false,
  };
}

function allNodes() {
  return loadRegistry().entries;
}

module.exports = { nodeIdFor, getNode, resolveNode, allNodes, ANSWER_TYPES, SUBJECT_TITLES, entryToNode, NODES_JSON };
