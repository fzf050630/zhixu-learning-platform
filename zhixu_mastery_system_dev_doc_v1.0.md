# 知序平台｜知识掌握度与自适应学习决策系统开发文档

版本：v1.0  
项目：知序（ZhiXu）  
模块：Knowledge Mastery System / Adaptive Learning Engine  
目标状态：MVP → 可持续扩展  
外部决策模型：TypeSafe AI System One / Jev

---

# 1. 项目背景

知序目前已经具备知识内容、知识节点、实验与交互可视化等学习资源。

现阶段需要进一步解决的问题是：

> 用户完成学习行为后，系统如何判断“他到底学会了没有”，并进一步决定“下一步应该做什么”。

传统学习平台通常仅记录：

- 是否浏览；
- 做题数量；
- 正确率；
- 学习时长；
- 是否完成任务。

这些指标只能反映“做过什么”，不能直接描述：

- 当前真实掌握程度；
- 掌握是否稳定；
- 为什么做错；
- 当前最大的知识薄弱点；
- 是否需要重新学习；
- 是否应该进入交互实验；
- 是否可以进入下一知识节点；
- 什么时间应该再次复习。

因此，知序新增“知识掌握度与自适应学习决策系统”。

整体原则：

> 确定性数据由传统算法计算，模糊学习判断由 Jev 决策。

即：

```text
用户学习行为
     ↓
行为数据采集
     ↓
确定性指标计算
     ↓
学习状态聚合
     ↓
Jev 学习状态判断
     ↓
掌握度模型
     ↓
下一步学习策略
     ↓
知序执行
```

---

# 2. 功能目标

第一阶段系统需要实现五个核心能力。

## 2.1 知识掌握度

针对每一个知识节点，计算用户当前掌握程度。

例如：

```text
AVL 树
掌握度：76%
状态：基本掌握
稳定度：62%
```

掌握度不是简单等同于正确率。

例如：

```text
用户 A
10 道题正确 8 道
正确率：80%

但：
最近 3 道连续错误
提示使用率较高
距离学习已经 20 天

最终掌握度可能只有：
61%
```

---

# 3. 掌握状态体系

每个知识节点拥有以下五级状态。

| 状态 | masteryScore | 含义 |
|---|---:|---|
| 未掌握 | 0–39 | 尚未建立有效知识理解 |
| 初步理解 | 40–59 | 理解部分知识，但独立运用能力不足 |
| 基本掌握 | 60–74 | 能完成多数常规任务，但存在不稳定部分 |
| 熟练掌握 | 75–89 | 能稳定正确解决大多数相关问题 |
| 稳定掌握 | 90–100 | 多次验证后仍能稳定、独立完成任务 |

前端建议不要直接显示“Jev 判断 3.62”。

统一转换成：

```text
掌握度 76%
熟练掌握
```

---

# 4. 核心数据模型

建议每个：

```text
User × KnowledgeNode
```

对应一个独立知识状态。

核心对象：

```json
{
  "userId": 10001,
  "knowledgeNodeId": "ds_tree_avl",

  "masteryScore": 76.4,
  "masteryLevel": "PROFICIENT",

  "stabilityScore": 62.1,
  "reviewUrgency": 71.3,

  "weaknessType": "PROCEDURE_ERROR",

  "recommendedAction": "DELAYED_REVIEW",

  "confidence": 0.81,

  "lastLearnedAt": "2026-09-21T10:32:00",
  "lastEvaluatedAt": "2026-09-21T10:35:12",
  "nextReviewAt": "2026-09-24T09:00:00"
}
```

其中：

### masteryScore

当前综合掌握程度。

范围：

```text
0–100
```

### stabilityScore

知识保持稳定性。

解决：

> 今天会了，是不是真的已经会了？

### reviewUrgency

复习紧迫程度：

```text
0 = 暂时无需复习
100 = 应立即复习
```

### weaknessType

主要错误来源。

### recommendedAction

系统建议用户下一步采取的行为。

### confidence

本次智能判断置信程度。

---

# 5. 数据采集

必须先建立统一的 Learning Event 系统。

用户的任何有效学习行为都记录成 LearningEvent。

建议事件类型：

```text
NODE_OPEN
CONTENT_READ
VIDEO_COMPLETE

QUESTION_START
QUESTION_SUBMIT
QUESTION_CORRECT
QUESTION_WRONG

HINT_OPEN
ANSWER_VIEW

VISUALIZATION_OPEN
VISUALIZATION_COMPLETE

EXPERIMENT_START
EXPERIMENT_COMPLETE

REVIEW_START
REVIEW_COMPLETE

NODE_COMPLETE
```

事件数据结构：

```json
{
  "eventId": "evt_xxx",

  "userId": 10001,

  "knowledgeNodeId": "ds_tree_avl",

  "type": "QUESTION_SUBMIT",

  "timestamp": "2026-09-21T10:24:31",

  "data": {
    "questionId": "q_782",
    "correct": false,
    "durationSeconds": 94,
    "hintUsed": true,
    "attempt": 2
  }
}
```

---

# 6. 第一阶段需要统计的指标

针对一个知识节点计算：

```text
totalAttempts
correctAttempts
accuracy

recentAccuracy
firstAttemptAccuracy

averageDuration
medianDuration

hintUsageRate
answerRevealRate

experimentCompleted
visualizationUsageCount

reviewCount

daysSinceLastStudy
daysSinceLastCorrectAnswer

consecutiveCorrect
consecutiveWrong
```

例如：

```json
{
  "totalAttempts": 18,
  "accuracy": 0.72,
  "recentAccuracy": 0.85,
  "firstAttemptAccuracy": 0.61,

  "averageDuration": 71,

  "hintUsageRate": 0.22,

  "experimentCompleted": true,

  "reviewCount": 2,

  "daysSinceLastStudy": 3,

  "consecutiveCorrect": 4,
  "consecutiveWrong": 0
}
```

这些数据全部由知序自己的程序计算。

不要交给 AI。

---

# 7. 掌握度算法

推荐采用：

```text
规则模型
+
Jev 学习状态模型
```

而不是完全依赖 Jev。

最终：

```text
MasteryScore =
RuleScore × 0.70
+
JevScore × 0.30
```

MVP 可先使用该比例。

后续根据真实学习数据重新校准。

---

# 8. RuleScore

第一版：

```text
RuleScore =
accuracyScore × 0.30
+
recentScore × 0.25
+
independenceScore × 0.15
+
stabilityScore × 0.15
+
completionScore × 0.10
+
efficiencyScore × 0.05
```

其中：

## accuracyScore

```text
总体正确率 × 100
```

## recentScore

最近 N 次表现。

推荐：

```text
最近 5 次
```

权重高于历史数据。

## independenceScore

独立完成能力：

```text
100
-
hintUsageRate × 50
-
answerRevealRate × 80
```

最低限制为：

```text
0
```

## stabilityScore

根据：

```text
复习后表现
距离上次学习时间
跨时间重复测试
```

进行计算。

## completionScore

依据：

```text
知识内容完成
实验完成
练习完成
复习完成
```

## efficiencyScore

只作为非常低权重参考。

避免出现：

> 做得慢 = 掌握差

这种错误推断。

---

# 9. 时间衰减

掌握度不能永久保持。

推荐实现时间衰减。

例如：

```text
effectiveMastery =
masteryScore × decayFactor
```

初版可以：

```text
decayFactor = e ^ (-days / retentionDays)
```

其中 retentionDays 根据稳定度变化。

例如：

```text
稳定度低：
retentionDays = 7

稳定度中：
retentionDays = 21

稳定度高：
retentionDays = 60
```

因此：

```text
刚学会但不稳定
→ 很快需要复习

经过多轮验证
→ 衰减速度越来越慢
```

这会形成类似间隔重复的机制。

---

# 10. Jev 的职责

Jev 不承担：

```text
正确率计算
日期计算
做题数量统计
连续正确统计
复习时间计算
```

Jev负责：

```text
是否真正表现出掌握状态

当前掌握属于什么水平

主要错误原因

下一步应该采取什么学习行为

是否需要交互可视化辅助

当前掌握是否稳定
```

TypeSafe 当前 API 接受字符串、对象或数组作为 `state`，并支持一次请求同时提交多个 typed questions。其三个核心问题类型为 Noul、Choice 和 Score。

---

# 11. Jev 请求设计

知序后端向：

```text
POST https://api.typesafe.ai/v1/systemone
```

发送请求。

API Key 必须只存在服务器端。

严禁：

```text
Vue / React / 浏览器
        ↓
直接调用 TypeSafe
```

正确架构：

```text
Browser
   ↓
知序 Backend
   ↓
Mastery Service
   ↓
TypeSafe API
```

官方 API 当前使用 Bearer API Key，并要求显式指定模型，例如 `jev-latest`。

---

# 12. Jev State

推荐不要发一长段自然语言。

直接发送结构化 JSON。

例如：

```json
{
  "knowledge": {
    "subject": "408数据结构",
    "node": "AVL树",
    "description": "平衡二叉搜索树及其旋转操作"
  },

  "performance": {
    "totalAttempts": 18,
    "accuracy": 0.72,
    "recentAccuracy": 0.85,
    "firstAttemptAccuracy": 0.61,
    "averageDurationSeconds": 71,
    "hintUsageRate": 0.22,
    "answerRevealRate": 0.05,
    "consecutiveCorrect": 4
  },

  "learning": {
    "contentCompleted": true,
    "visualizationUsed": true,
    "experimentCompleted": true,
    "reviewCount": 2,
    "daysSinceLastStudy": 3
  },

  "recentAttempts": [
    {
      "questionType": "AVL rotation",
      "correct": false,
      "hintUsed": true
    },
    {
      "questionType": "AVL rotation",
      "correct": true,
      "hintUsed": false
    },
    {
      "questionType": "AVL insertion",
      "correct": true,
      "hintUsed": false
    }
  ]
}
```

---

# 13. Jev Questions

一次请求建议同时询问多个问题。

## 13.1 Mastery Score

类型：

```text
Score
```

请求：

```json
{
  "mastery_level": {
    "type": "score",

    "instructions":
      "Evaluate the learner's demonstrated mastery of this knowledge node. Consider accuracy, recent performance, independence, repeated verification and stability. Do not treat simple content completion as mastery.",

    "criteria": [
      "No demonstrated mastery",
      "Partial understanding with major gaps",
      "Basic mastery but still unstable",
      "Strong and mostly independent mastery",
      "Stable mastery demonstrated repeatedly"
    ]
  }
}
```

Score 支持用户自定义有序等级，并返回概率加权后的连续值以及各等级概率。

返回例如：

```json
{
  "type": "score",

  "score": 3.21,

  "probabilities": {
    "0": 0.01,
    "1": 0.05,
    "2": 0.18,
    "3": 0.52,
    "4": 0.24
  },

  "confidence": 0.68
}
```

转换：

```text
JevMastery =
score / 4 × 100
```

即：

```text
3.21 / 4 × 100
= 80.25
```

---

# 14. 掌握稳定性

```json
{
  "stable_mastery": {
    "type": "noul",

    "instructions":
      "Does the available learning evidence indicate that this knowledge has been retained and can be used independently rather than being a temporary short-term success?",

    "criteria": {
      "true":
        "Performance is stable across repeated attempts or reviews and does not rely heavily on hints.",

      "false":
        "Success appears temporary, inconsistent, insufficiently verified, or highly dependent on assistance."
    }
  }
}
```

Noul 返回：

```text
0–1
```

表示“是”的概率。

于是：

```text
stabilityScore =
stable_mastery × 100
```

---

# 15. 错误类型判断

推荐：

```json
{
  "weakness_type": {

    "type": "choice",

    "instructions":
      "Identify the learner's primary current weakness for this knowledge node.",

    "criteria": {

      "CONCEPT_GAP":
        "The core concept or definition is not understood.",

      "PROCEDURE_ERROR":
        "The concept is understood but the execution steps or algorithm are incorrect.",

      "MEMORY_GAP":
        "Previously learned knowledge appears to have been forgotten.",

      "READING_ERROR":
        "Errors mainly come from misunderstanding the question.",

      "CALCULATION_ERROR":
        "Errors are primarily arithmetic or mechanical calculation mistakes.",

      "CARELESS_ERROR":
        "The learner appears capable but makes avoidable execution mistakes.",

      "INSUFFICIENT_EVIDENCE":
        "There is not enough evidence to identify a meaningful weakness.",

      "NO_SIGNIFICANT_WEAKNESS":
        "No significant current weakness is demonstrated."
    }
  }
}
```

Choice 返回：

```text
choice
probabilities
confidence
```

且概率分布覆盖全部候选选项。

---

# 16. 下一步学习行为

核心 Choice：

```json
{
  "recommended_action": {

    "type": "choice",

    "instructions":
      "Choose the most appropriate next learning action for this learner based on current mastery, stability, recent performance and independence.",

    "criteria": {

      "CONTINUE_NEXT_NODE":
        "Mastery is sufficient and stable enough to continue.",

      "REVIEW_CONCEPT":
        "Return to the knowledge explanation because conceptual understanding is weak.",

      "RETRY_QUESTIONS":
        "Perform additional practice to consolidate the knowledge.",

      "OPEN_VISUALIZATION":
        "Use interactive visualization to rebuild intuitive understanding.",

      "RUN_EXPERIMENT":
        "Complete an interactive experiment or simulation.",

      "IMMEDIATE_REVIEW":
        "Review this node again now.",

      "DELAYED_REVIEW":
        "Current mastery is acceptable but should be verified again after an interval."
    }
  }
}
```

---

# 17. 是否推荐可视化

单独增加：

```json
{
  "needs_visualization": {

    "type": "noul",

    "instructions":
      "Would an interactive visualization likely be more useful than ordinary repetition for resolving the learner's current difficulty?"
  }
}
```

例如：

```text
needs_visualization = 0.87
```

且：

```text
weakness_type = PROCEDURE_ERROR
```

前端可以显示：

> 你对 AVL 旋转步骤仍不稳定。  
> 建议先通过交互动画重新观察 LR / RL 旋转。

按钮：

```text
进入可视化实验 →
```

---

# 18. 完整 Jev 请求

示例：

```json
{
  "model": "jev-latest",

  "state": {
    "knowledge": {
      "subject": "408数据结构",
      "node": "AVL树"
    },

    "performance": {
      "totalAttempts": 18,
      "accuracy": 0.72,
      "recentAccuracy": 0.85,
      "firstAttemptAccuracy": 0.61,
      "hintUsageRate": 0.22,
      "consecutiveCorrect": 4
    },

    "learning": {
      "experimentCompleted": true,
      "reviewCount": 2,
      "daysSinceLastStudy": 3
    }
  },

  "questions": {

    "mastery_level": {
      "type": "score",
      "instructions":
        "Evaluate demonstrated mastery.",
      "criteria": [
        "No demonstrated mastery",
        "Partial understanding",
        "Basic but unstable mastery",
        "Strong independent mastery",
        "Stable repeated mastery"
      ]
    },

    "stable_mastery": {
      "type": "noul",
      "instructions":
        "Is the learner's mastery currently stable?"
    },

    "weakness_type": {
      "type": "choice",
      "instructions":
        "Identify the primary weakness.",
      "criteria": {
        "CONCEPT_GAP": "Core concept misunderstanding",
        "PROCEDURE_ERROR": "Execution or algorithm steps",
        "MEMORY_GAP": "Forgotten previously learned material",
        "READING_ERROR": "Question interpretation",
        "CALCULATION_ERROR": "Calculation mistake",
        "CARELESS_ERROR": "Avoidable careless mistake",
        "INSUFFICIENT_EVIDENCE": "Insufficient evidence",
        "NO_SIGNIFICANT_WEAKNESS": "No major weakness"
      }
    },

    "recommended_action": {
      "type": "choice",
      "instructions":
        "Select the best next learning action.",
      "criteria": {
        "CONTINUE_NEXT_NODE": null,
        "REVIEW_CONCEPT": null,
        "RETRY_QUESTIONS": null,
        "OPEN_VISUALIZATION": null,
        "RUN_EXPERIMENT": null,
        "IMMEDIATE_REVIEW": null,
        "DELAYED_REVIEW": null
      }
    }
  }
}
```

TypeSafe 当前支持在一次请求中组合多个 Noul、Choice 和 Score，这非常适合知序一次完成一整个知识状态评估。

---

# 19. 最终 MasteryScore

例如：

```text
RuleScore = 72.8

Jev:
score = 3.21 / 4

JevScore =
80.25
```

计算：

```text
FinalMastery
=
72.8 × 0.70
+
80.25 × 0.30

=
75.04
```

显示：

```text
掌握度
75%

熟练掌握
```

注意：

系统数据库应同时保存：

```text
ruleScore
jevScore
finalMasteryScore
```

不要只保存最终值。

这样以后修改算法时能够重新计算。

---

# 20. Jev Confidence 机制

Jev 的 Choice 和 Score 均返回 confidence。

建议：

```text
confidence >= 0.70
正常使用 AI 结果

0.45 <= confidence < 0.70
弱化使用

confidence < 0.45
使用规则系统兜底
```

例如：

```text
Jev:
recommendedAction = REVIEW_CONCEPT
confidence = 0.31
```

不要执行 AI 决策。

改用：

```text
Rule Engine
```

---

# 21. 数据不足保护

必须增加：

```text
MIN_EVIDENCE
```

建议至少满足任一条件：

```text
>= 3 道题
```

或者：

```text
完成一次实验
+
至少一道检测题
```

否则：

```text
masteryStatus =
INSUFFICIENT_DATA
```

前端：

```text
掌握度
--

完成一些练习后即可评估
```

绝对不要：

```text
用户刚打开页面
→ 掌握度 47%
```

这会严重损害功能可信度。

---

# 22. 推荐动作执行规则

Jev 只给建议。

最终行为由知序决定。

例如：

```text
Jev
↓
recommendedAction

+
Rule Engine
+
业务约束

↓
Final Action
```

示例：

```text
if mastery >= 90
and stability >= 80:

    CONTINUE_NEXT_NODE
```

```text
if mastery < 40:

    REVIEW_CONCEPT
```

```text
if weakness == PROCEDURE_ERROR
and visualizationExists:

    OPEN_VISUALIZATION
```

```text
if mastery >= 75
and stability < 65:

    DELAYED_REVIEW
```

即：

> Jev 是决策输入，不是系统最高权限。

---

# 23. 数据库设计

推荐新增四张核心表。

## zx_learning_event

保存原始学习事件。

```sql
id
user_id
knowledge_node_id

event_type

event_data_json

created_at
```

建议：

```text
只新增
原则上不修改历史事件
```

方便以后重新计算算法。

---

# 24. zx_user_knowledge_state

用户当前知识状态。

```sql
id

user_id
knowledge_node_id

mastery_score
mastery_level

rule_score
jev_score

stability_score
review_urgency

weakness_type
recommended_action

confidence

attempt_count
review_count

last_learned_at
last_evaluated_at
next_review_at

version

created_at
updated_at
```

唯一索引：

```text
(user_id, knowledge_node_id)
```

---

# 25. zx_mastery_evaluation

每一次掌握度计算历史。

```sql
id

user_id
knowledge_node_id

rule_score
jev_score
final_score

mastery_level

stability_score

weakness_type
recommended_action

jev_confidence

input_snapshot_json
jev_response_json

algorithm_version

created_at
```

非常重要：

```text
algorithm_version
```

例如：

```text
mastery-v1
mastery-v1.1
mastery-v2
```

以后才能比较算法效果。

---

# 26. zx_review_schedule

复习计划。

```sql
id

user_id
knowledge_node_id

scheduled_at

reason

status

source

created_at
completed_at
```

status：

```text
PENDING
COMPLETED
SKIPPED
EXPIRED
```

source：

```text
SYSTEM
JEV
USER
```

---

# 27. 后端服务设计

建议：

```text
LearningEventService

MasteryMetricService

MasteryEvaluationService

JevDecisionService

ReviewSchedulerService

LearningRecommendationService
```

职责：

```text
LearningEventService
→ 收集学习行为

MasteryMetricService
→ 计算传统指标

JevDecisionService
→ 调用 TypeSafe

MasteryEvaluationService
→ 综合 Rule + Jev

ReviewSchedulerService
→ 创建复习计划

LearningRecommendationService
→ 返回下一步动作
```

---

# 28. API 设计

## 获取节点掌握状态

```http
GET /api/knowledge/{nodeId}/mastery
```

返回：

```json
{
  "nodeId": "ds_tree_avl",

  "mastery": {
    "score": 76,
    "level": "PROFICIENT",
    "label": "熟练掌握"
  },

  "stability": 62,

  "weakness": {
    "type": "PROCEDURE_ERROR",
    "label": "操作步骤仍不稳定"
  },

  "recommendation": {
    "action": "DELAYED_REVIEW",
    "nextReviewAt": "2026-09-24T09:00:00"
  }
}
```

---

# 29. 记录学习行为

```http
POST /api/learning/events
```

请求：

```json
{
  "knowledgeNodeId": "ds_tree_avl",

  "type": "QUESTION_SUBMIT",

  "data": {
    "questionId": "q_782",
    "correct": true,
    "durationSeconds": 62,
    "hintUsed": false
  }
}
```

---

# 30. 重新评估

内部接口：

```http
POST /internal/mastery/evaluate/{nodeId}
```

不要让普通前端无限调用。

触发条件推荐：

```text
完成一道检测题

完成一组练习

完成实验

完成复习

连续错误达到阈值
```

不要：

```text
每次打开页面
→ 调 Jev
```

---

# 31. 评估节流

同一：

```text
User + Node
```

推荐至少间隔：

```text
30–60 秒
```

如果短时间连续做题：

先累计。

例如：

```text
题1
题2
题3
题4
题5
↓
一次 Evaluate
```

而不是调用五次 Jev。

---

# 32. 前端组件

新增：

```text
MasteryBadge

MasteryProgress

KnowledgeStateCard

WeaknessCard

NextActionCard

ReviewReminder

KnowledgeHeatmap
```

---

# 33. KnowledgeStateCard

示例：

```text
┌────────────────────────────┐
│ AVL 树                     │
│                            │
│ 掌握度              76%    │
│ ███████████████░░░░        │
│                            │
│ 熟练掌握                   │
│                            │
│ 稳定度              62%    │
│                            │
│ 当前薄弱：                 │
│ LR / RL 旋转步骤           │
│                            │
│ 建议：                     │
│ 3 天后进行一次巩固测试      │
└────────────────────────────┘
```

---

# 34. 知识目录展示

知识节点旁加入掌握状态。

```text
树

✓ 二叉树            94%
✓ 二叉搜索树        88%
◐ AVL 树            76%
△ 红黑树            52%
○ B 树              未学习
```

颜色只能作为辅助。

必须同时使用：

```text
数字
图标
文字
```

避免只依赖颜色。

---

# 35. 学科掌握热力图

未来可形成：

```text
数据结构

线性表      92%
栈与队列    87%
树          71%
图          66%
查找        78%
排序        84%
```

进一步向上聚合：

```text
408

数据结构      78%
计算机组成    61%
操作系统      72%
计算机网络    69%
```

父节点掌握度不要简单平均。

建议按照：

```text
节点重要程度
×
考试权重
×
掌握度
```

进行加权。

---

# 36. 自适应入口

首页可以新增：

```text
继续学习
```

而不是单纯：

```text
最近访问
```

例如：

```text
今天建议你完成

① AVL 树复习       预计 8 min
   掌握度开始下降

② 页面置换算法     预计 15 min
   当前掌握度 58%

③ TCP 拥塞控制     预计 10 min
   昨日学习尚未验证
```

这会成为知序非常重要的一项产品能力。

---

# 37. 复习策略

MVP 推荐：

第一次掌握后：

```text
+1 day
```

通过：

```text
+3 days
```

再次通过：

```text
+7 days
```

再次通过：

```text
+14 days
```

随后：

```text
+30 days
```

根据：

```text
mastery
stability
错误情况
```

动态调整。

后续可以升级 FSRS 等成熟间隔重复算法。

---

# 38. Jev 故障处理

TypeSafe API 当前文档列出的典型错误包括：

```text
401
422
429
529
```

其中 429 与 529 应使用指数退避重试。官方 SDK 默认包含相应重试机制。

建议后端：

```text
第一次失败
↓
retry

再次失败
↓
Rule Engine fallback
```

绝不能出现：

```text
Jev 挂了
↓
用户不能学习
```

掌握度功能永远不能成为核心学习流程的单点故障。

---

# 39. Cache

如果：

```text
学习状态没有变化
```

不要重新调用 Jev。

计算：

```text
stateHash
```

例如：

```text
SHA256(
knowledgeNode
+
performance
+
recentAttempts
+
learningState
)
```

如果：

```text
stateHash == previousHash
```

直接使用缓存结果。

---

# 40. 隐私

禁止向 Jev 传：

```text
真实姓名
邮箱
手机号
密码
Token
IP
账号标识
```

只传：

```text
匿名 userId（甚至无需发送）
学习行为
知识状态
题目类型
作答情况
```

事实上绝大多数掌握度判断甚至不需要发送：

```text
userId
```

---

# 41. 成本控制

Jev 调用必须发生在“状态变化”而非“页面访问”。

推荐：

```text
用户浏览知识点
❌ 不调用

用户做一道简单题
❌ 不立即调用

完成练习组
✅ 调用

连续错误
✅ 调用

完成复习
✅ 调用

完成实验
✅ 调用

跨天首次访问节点
视情况调用
```

---

# 42. 日志

记录：

```text
requestId

knowledgeNode

inputTokens

latency

model

success

errorCode

masteryResult

confidence
```

TypeSafe API 响应本身包含 token usage，可用于后续统计成本。

---

# 43. Prompt / Question 版本管理

不要把 Jev Instructions 散落在代码里。

建立：

```text
MasteryPromptConfig
```

例如：

```text
jev-mastery-v1
```

后续：

```text
jev-mastery-v2
```

每次 Evaluation 保存：

```text
questionVersion
```

否则以后修改指令后将无法解释历史掌握度变化。

---

# 44. MVP 范围

第一版不要一次做太多。

MVP 只实现：

### 数据层

```text
LearningEvent
UserKnowledgeState
MasteryEvaluation
```

### 指标

```text
正确率
近期正确率
连续正确
提示率
学习次数
复习次数
距离上次学习时间
```

### Jev

只问：

```text
mastery_level
stable_mastery
weakness_type
recommended_action
```

### 前端

只展示：

```text
掌握度
掌握等级
当前薄弱点
下一步建议
```

这已经足够形成第一版完整闭环。

---

# 45. 第二阶段

加入：

```text
Knowledge Heatmap

自动复习

首页今日学习任务

交互可视化自动推荐

知识节点依赖
```

例如：

```text
AVL 树
依赖：
BST
树高度
递归

如果 BST 只有 42%

即使 AVL 做题暂时不错

也应该降低：
masteryConfidence
```

---

# 46. 第三阶段：知识图谱

最终知序可以形成：

```text
           数据结构
               │
        ┌──────┴──────┐
        树             图
        │
       BST
        │
       AVL
        │
      红黑树
```

用户则拥有自己的：

```text
Personal Knowledge State Graph
```

例如：

```text
BST       91%
 │
AVL       74%
 │
红黑树    43%
```

系统即可判断：

> 红黑树学习困难可能来自当前节点本身，而不是 BST 基础不足。

---

# 47. 第四阶段：知序 Adaptive Engine

最终架构：

```text
                   知识内容
                      ↓
                Knowledge Graph
                      ↓

学习行为 → Learning Event Store
                      ↓
               Metric Engine
                      ↓
                Mastery Engine
                 ↙        ↘
           Rule Engine     Jev
                 ↘        ↙
                User State
                      ↓
             Recommendation
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
     学习             做题          可视化
       ↓              ↓              ↓
     复习            实验           下一节点
       └──────────────┬──────────────┘
                      ↓
                 新学习行为
                      ↓
                   再评估
```

最终形成闭环：

```text
Learn
↓
Practice
↓
Evaluate
↓
Diagnose
↓
Recommend
↓
Review
↓
Verify
↓
Master
```

---

# 48. 后端伪代码

```text
onLearningEvent(event):

    save(event)

    updateMetrics(
        event.userId,
        event.knowledgeNodeId
    )

    if !shouldEvaluate(event):
        return

    metrics =
        calculateMetrics(
            event.userId,
            event.knowledgeNodeId
        )

    if !hasEnoughEvidence(metrics):
        saveState(
            status = INSUFFICIENT_DATA
        )
        return

    ruleScore =
        calculateRuleMastery(metrics)

    try:

        jevResult =
            jev.evaluate(
                buildState(metrics)
            )

        if jevResult.confidence >= threshold:

            jevScore =
                normalizeJevScore(
                    jevResult.mastery
                )

            finalScore =
                ruleScore * 0.70
                +
                jevScore * 0.30

        else:

            finalScore = ruleScore

    catch:

        finalScore = ruleScore

    level =
        resolveMasteryLevel(finalScore)

    saveEvaluation(...)

    updateKnowledgeState(...)

    scheduleReview(...)

    publishMasteryUpdatedEvent(...)
```

---

# 49. 验收标准

MVP 完成需要满足：

### 数据正确性

用户：

```text
做题
使用提示
进入实验
复习
```

均能生成正确 LearningEvent。

### 掌握度

至少有：

```text
RuleScore
JevScore
FinalScore
```

三个独立值。

### Jev 故障

断开 TypeSafe API：

```text
学习功能继续正常运行。
```

### 数据不足

无足够学习证据：

```text
不得生成伪精确掌握度。
```

### 可解释性

用户至少知道：

```text
我的掌握程度是多少

为什么系统认为我还需要学

下一步应该做什么
```

### 成本

普通浏览页面：

```text
不得触发 Jev API。
```

---

# 50. 推荐开发顺序

建议严格按以下顺序实施：

```text
Phase 1
Learning Event
        ↓
Phase 2
Metric Engine
        ↓
Phase 3
Rule Mastery
        ↓
Phase 4
Mastery UI
        ↓
Phase 5
Jev Integration
        ↓
Phase 6
Recommendation Engine
        ↓
Phase 7
Review Scheduler
        ↓
Phase 8
Knowledge Heatmap
```

不要第一步就开始调用 Jev。

最重要的是先把：

```text
学习行为数据层
```

设计正确。

因为以后无论：

```text
修改算法
更换模型
使用自己的模型
引入 FSRS
做知识图谱
训练个性化模型
```

底层 Learning Event 数据都仍然可以继续使用。

---

# 51. 最终产品定义

这一功能对用户不应包装成：

> AI 掌握度分析

更加合适的产品名称是：

```text
知识掌握度
```

或者：

```text
学习状态
```

AI 应该隐藏在背后。

用户真正需要看到的是：

```text
我会了多少？
       ↓
我哪里不会？
       ↓
我现在应该做什么？
       ↓
我什么时候应该回来复习？
```

因此知序掌握度系统最终应遵循一句产品原则：

> 不评价用户学了多少，而判断知识是否真正留下来了。
