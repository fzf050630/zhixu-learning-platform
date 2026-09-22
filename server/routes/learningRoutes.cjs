'use strict';

const { sendJson, readJsonBody, resolveIdentity, resolveUserId } = require('../lib/http.cjs');
const { badRequest } = require('../lib/errors.cjs');
const rateLimit = require('../lib/rateLimit.cjs');
const { clientAddress } = require('../lib/client.cjs');
const learningEventService = require('../services/learningEventService.cjs');
const learningEventRepository = require('../repositories/learningEventRepository.cjs');
const reviewScheduleRepository = require('../repositories/reviewScheduleRepository.cjs');
const knowledgeStateRepository = require('../repositories/knowledgeStateRepository.cjs');
const learningRecommendationService = require('../services/learningRecommendationService.cjs');
const heatmapService = require('../services/heatmapService.cjs');
const { resolveNode, allNodes } = require('../knowledge/nodes.cjs');
const masteryEvaluationService = require('../services/masteryEvaluationService.cjs');

/* 一次最多上报的事件条数：限制单请求写入量，避免被脚本用一次请求灌满数据。 */
const MAX_BATCH_EVENTS = 200;

function guardRate(request) {
  rateLimit.guard(clientAddress(request).ip);
}

/* 把客户端 IP 传下去，交给 Jev 成本保险丝做单 IP 预算判断。 */
function jevOptions(request) {
  return { jevContext: { ip: clientAddress(request).ip } };
}

function register(router) {
  router.post('/api/learning/events', async (request, response) => {
    guardRate(request);
    const body = await readJsonBody(request);
    const { userId } = resolveIdentity(request, body);
    const options = jevOptions(request);
    if (Array.isArray(body.events)) {
      if (!body.events.length) throw badRequest('events 不能为空');
      if (body.events.length > MAX_BATCH_EVENTS) throw badRequest('一次最多上报 ' + MAX_BATCH_EVENTS + ' 条事件');
      const accepted = await learningEventService.recordMany(userId, body.events, options);
      sendJson(response, 202, { accepted: accepted.length, events: accepted.map(event => event.eventId) });
      return;
    }
    const { event, duplicate } = await learningEventService.record(userId, body, options);
    sendJson(response, duplicate ? 200 : 202, { accepted: duplicate ? 0 : 1, duplicate, eventId: event.eventId });
  });

  router.get('/api/learning/events', (request, response, params, url) => {
    const { userId } = resolveIdentity(request);
    const nodeId = url.searchParams.get('nodeId');
    const limit = Number(url.searchParams.get('limit')) || 100;
    const events = nodeId
      ? learningEventRepository.listByUserNode(userId, nodeId, { limit })
      : learningEventRepository.listByUser(userId, { limit });
    sendJson(response, 200, { count: events.length, events });
  });

  router.get('/api/learning/reviews', (request, response) => {
    const { userId } = resolveIdentity(request);
    const pending = reviewScheduleRepository.listPending(userId, { limit: 100 });
    sendJson(response, 200, {
      count: pending.length,
      reviews: pending.map(row => ({
        nodeId: row.knowledge_node_id,
        scheduledAt: row.scheduled_at,
        reason: row.reason,
        source: row.source,
      })),
    });
  });

  router.get('/api/learning/overview', (request, response) => {
    const { userId } = resolveIdentity(request);
    const states = knowledgeStateRepository.listByUser(userId);
    const evaluated = states.filter(state => state.status === 'EVALUATED');
    const average = evaluated.length
      ? Math.round(evaluated.reduce((sum, state) => sum + state.masteryScore, 0) / evaluated.length)
      : null;
    sendJson(response, 200, {
      userId,
      evaluatedNodes: evaluated.length,
      trackedNodes: states.length,
      averageMastery: average,
      states: evaluated.map(state => ({
        nodeId: state.knowledgeNodeId,
        subject: state.subject,
        status: state.status,
        mastery: Math.round(state.masteryScore),
        level: state.masteryLevel,
        stability: Math.round(state.stabilityScore),
        nextReviewAt: state.nextReviewAt,
      })),
    });
  });

  router.get('/api/learning/heatmap', (request, response) => {
    const { userId } = resolveIdentity(request);
    const states = knowledgeStateRepository.listByUser(userId);
    sendJson(response, 200, heatmapService.buildHeatmap(states, allNodes()));
  });

  function masteryResponse(userId, nodeId) {
    const node = resolveNode(nodeId);
    const { state, metrics, pendingReview } = masteryEvaluationService.getStoredState(userId, nodeId);
    return learningRecommendationService.buildMasteryResponse({ node, state, pendingReview, metrics });
  }

  // 查询参数形式：避免 nodeId 中的 “/” 经反向代理被解码而破坏路径。
  router.get('/api/knowledge/mastery', (request, response, params, url) => {
    const { userId } = resolveIdentity(request);
    const nodeId = url.searchParams.get('nodeId');
    if (!nodeId) throw badRequest('缺少 nodeId');
    sendJson(response, 200, masteryResponse(userId, nodeId));
  });

  // 路径形式（本地直连时使用，保留兼容）。
  router.get('/api/knowledge/:nodeId/mastery', (request, response, params) => {
    sendJson(response, 200, masteryResponse(resolveIdentity(request).userId, params.nodeId));
  });

  async function evaluateResponse(userId, nodeId, useJev) {
    const result = await masteryEvaluationService.evaluate(userId, nodeId, { useJev });
    const pendingReview = reviewScheduleRepository.pendingFor(userId, nodeId);
    return {
      ...learningRecommendationService.buildMasteryResponse({
        node: result.node,
        state: result.state,
        pendingReview,
        metrics: result.metrics,
      }),
      breakdown: result.state.status === 'EVALUATED'
        ? {
          ruleScore: result.state.ruleScore,
          jevScore: result.state.jevScore,
          finalScore: result.state.masteryScore,
          confidence: result.state.confidence,
          components: result.state.components,
          decay: result.state.decay,
        }
        : null,
    };
  }

  router.post('/internal/mastery/evaluate', async (request, response, params, url) => {
    const body = await readJsonBody(request);
    const userId = resolveUserId(request, body);
    const nodeId = url.searchParams.get('nodeId') || body.nodeId;
    if (!nodeId) throw badRequest('缺少 nodeId');
    sendJson(response, 200, await evaluateResponse(userId, nodeId, body.useJev !== false));
  });

  router.post('/internal/mastery/evaluate/:nodeId', async (request, response, params) => {
    const body = await readJsonBody(request);
    const userId = resolveUserId(request, body);
    sendJson(response, 200, await evaluateResponse(userId, params.nodeId, body.useJev !== false));
  });
}

module.exports = { register };
