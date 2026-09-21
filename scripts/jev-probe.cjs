'use strict';

/* 知序 · Jev(TypeSafe) 连通性探测
   用一组样例学习状态调用一次 TypeSafe，打印原始响应与解析结果。
   只读取服务器端环境变量 / .env 中的 Key，绝不打印 Key 本身。
   用法：先配置 .env（TYPESAFE_API_KEY、ZHIXU_JEV_ENABLED=true），再运行
         npm run jev:probe
*/

const config = require('../server/config.cjs');
const { computeMetrics } = require('../server/services/masteryMetricService.cjs');
const jevDecisionService = require('../server/services/jevDecisionService.cjs');

const sampleEvents = [
  { type: 'QUESTION_SUBMIT', occurredAt: '2026-09-18T10:00:00Z', data: { questionId: 'q1', correct: false, hintUsed: true, attempt: 1, durationSeconds: 90 } },
  { type: 'QUESTION_SUBMIT', occurredAt: '2026-09-18T10:02:00Z', data: { questionId: 'q1', correct: true, attempt: 2, durationSeconds: 70 } },
  { type: 'QUESTION_SUBMIT', occurredAt: '2026-09-20T09:00:00Z', data: { questionId: 'q2', correct: true, attempt: 1, durationSeconds: 65 } },
  { type: 'QUESTION_SUBMIT', occurredAt: '2026-09-21T09:00:00Z', data: { questionId: 'q3', correct: true, attempt: 1, durationSeconds: 60 } },
  { type: 'EXPERIMENT_COMPLETE', occurredAt: '2026-09-20T08:30:00Z', data: {} },
  { type: 'REVIEW_COMPLETE', occurredAt: '2026-09-21T08:00:00Z', data: {} },
];

const node = {
  id: 'data-structures:lab/avl-rotations',
  subject: 'data-structures',
  title: 'AVL 四类旋转',
  chapter: '查找',
  kind: '算法实验',
};

(async () => {
  if (!config.jev.apiKey) {
    console.error('未检测到 TYPESAFE_API_KEY。请在项目根目录创建 .env 并写入：');
    console.error('  TYPESAFE_API_KEY=你的Key');
    console.error('  ZHIXU_JEV_ENABLED=true');
    process.exit(2);
  }

  const metrics = computeMetrics(sampleEvents, { recentWindow: 5 });
  // 探测时强制启用，避免因 ZHIXU_JEV_ENABLED 未设而直接跳过。
  config.jev.enabled = true;

  console.log('发送一次 TypeSafe 请求，模型：' + config.jev.model + '，地址：' + config.jev.baseUrl);
  try {
    const result = await jevDecisionService.evaluate(node, metrics, { userId: 'probe' });
    console.log('\n=== 解析结果 ===');
    console.log(JSON.stringify({
      masteryScore: result.masteryScore,
      masteryConfidence: result.masteryConfidence,
      stabilityScore: result.stabilityScore,
      weaknessType: result.weaknessType,
      recommendedAction: result.recommendedAction,
    }, null, 2));
    console.log('\n=== 原始响应（可贴回，不含 Key） ===');
    console.log(JSON.stringify(result.raw, null, 2));
  } catch (error) {
    console.error('\n调用失败：' + (error.code ? '[' + error.code + '] ' : '') + error.message);
    if (String(error.code) === '401') console.error('→ 401：Key 无效或未授权。');
    if (String(error.code) === '404') console.error('→ 404：接口路径可能不同，请核对 TYPESAFE_BASE_URL。');
    if (String(error.code) === '422') console.error('→ 422：请求体结构可能不符合 TypeSafe 要求。');
    process.exit(1);
  }
})();
