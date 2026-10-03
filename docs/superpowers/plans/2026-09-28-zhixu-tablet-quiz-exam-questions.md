# 知序平板布局、自测选项与章节真题 Implementation Plan

> **For agentic workers:** 本计划在当前会话内按任务顺序执行；每个行为变更先写失败测试，再实现并复测。

**Goal:** 修复知序章节页在平板宽度下的页眉挤压，避免自测正确选项总落在 A，并将历年真题题意整理扩展到全部 240 个学习小节各 2 道、总计 480 道。

**Architecture:** 平板页眉在 721–1120 CSS 像素内隐藏重复的品牌副标题与总览文字入口，压缩科目选择器，并让掌握度徽标与自测控件保持单行、不可收缩；桌面和现有手机断点保持各自布局。题目显示层为单选题创建每轮平衡且随机的正确答案位置，并同步映射选项键和判分键。真题按每个 `subject:hash` 小节节点独立存放，每节加入两道带年份、试卷、题号、章节主题、来源链接和改写标记的题；`quiz.js` 继续只读取当前节点的题库，不做章节共享。

**Tech Stack:** 原生 JavaScript、CSS、Node.js 内置 `node:test`、项目已有 Playwright/Chrome、静态 HTML。

---

## 文件责任图

| 文件 | 责任 |
|---|---|
| `platform/components.css` | 平台页眉网格及断点布局 |
| `platform/mastery-ui.css` | 掌握度徽标自身的最小宽度与禁止折行 |
| `platform/quiz.js` | 为本轮自测构建显示选项，正确判分并展示来源 |
| `platform/quiz.css` | 题型和真题来源标记样式 |
| `platform/questions/past-exams.js` | 240 个小节的 480 道真题题意整理及逐题来源元数据 |
| 七科 `index.html` | 在自测运行时前加载真题题库 |
| `tests/browser/tablet-layout.spec.cjs` | 页眉几何、按钮与学习面板平板回归 |
| `tests/browser/quiz-options.spec.cjs` | 答案位置平衡、选项改序后的正确判分、真题来源呈现 |
| `tests/platform.test.cjs` | 题目结构、章节覆盖、来源字段和发布产物校验 |
| `README.md` | 记录题库范围、真题来源和题意整理口径 |

## 真题来源与标注规则

- 408 来源覆盖 2009–2024 年试题：2009–2021 年题号可从公开 Markdown 试卷索引核对，2022 年参考按科目分题号索引，2023、2024 年保留原卷 PDF 链接。2021 年题库入口：`https://408.foreverlink.love/raw/2021`；2022 年数据结构分科索引：`https://www.codebrick.tech/exam-408/ds/year/2022.html`；2024 年逐题解析：`https://www.zehaowang.xin/408_choice.html`。
- 考研数学一来源使用 2000、2005、2014–2024 年原卷或可核对分章索引；每题保留试卷年份、题号和 HTTPS 来源。2024 数学一来源注明为回忆版。数学一章节题号索引：`https://www.zehaowang.xin/math_chapter_lookup.html`；2000、2005 年统计学来源另保留原卷入口。
- 每个学习小节放入两道与该节考点相符的题意整理或改编题，不把同章题复制给其他小节。题干与选项以自有表述重写；不得整段照录商业教材或试题解析。界面按改写程度标注“真题题意整理”或“真题改编”，并提供年份、考试科目、题号和原卷链接。
- 来源元数据结构：

```js
{
  id: 'exam-prob-event-2014-7',
  type: 'single',
  stem: '事件 A、B 相互独立，P(B)=0.5，P(A−B)=0.3，则 P(B−A) 等于多少？',
  options: { A: '0.1', B: '0.2', C: '0.3', D: '0.4' },
  answer: 'B',
  explanation: '由 P(A−B)=P(A)(1−P(B)) 得 P(A)=0.6，再由 P(AB)=0.3 得 P(B−A)=0.2。',
  source: {
    kind: 'past-exam',
    paper: '数学一',
    year: 2014,
    questionNo: 7,
    chapter: '随机事件和概率',
    fidelity: 'adapted',
    url: 'https://www.zehaowang.xin/zhenti/shuxue1/shuxue1_2021.pdf',
    referenceUrl: 'https://www.zehaowang.xin/math_chapter_lookup.html',
    referenceLabel: '分章索引'
  }
}
```

## Task 1：补上平板页眉与自测行为的失败测试

**Files:**
- Modify: `tests/browser/tablet-layout.spec.cjs`
- Create: `tests/browser/quiz-options.spec.cjs`

- [x] 在 1024×768 与 850×900 viewport 下加载真实章节页，解除 `.zx-mastery` 的隐藏状态并写入“掌握度 66% · 基本掌握”测试数据；断言徽标宽度至少 120px、高度不超过 44px、完全位于页眉内，且页眉各可见顶层控件之间无矩形交叠。
- [x] 运行 tablet 用例，当前实现应因徽标折行、超出 52px 页眉或控件交叠而失败。
- [x] 打开堆插入节点自测，针对原题库中每道单选题找出正确选项文本，读取它在界面上的新标签；断言正确答案分布至少包含 3 个标签，且逐题选中后判分全部正确。
- [x] 运行 quiz 用例，当前实现应因正确标签仍全部为 A 而失败。

## Task 2：修复 721–1120 CSS 像素页眉

**Files:**
- Modify: `platform/components.css`
- Modify: `platform/mastery-ui.css`
- Test: `tests/browser/tablet-layout.spec.cjs`

- [x] 在 `min-width:721px`、`max-width:1120px` 中将页眉左右 padding 收至 16px、主 gap 收至 10px，隐藏重复的 `.zx-product` 和 `#platformHome` 文字链接；站点下拉、平台总览科目选项、掌握度链接、自测、科目选择、主题切换均保留。
- [x] 设置页眉动作组与按钮 `flex: none`，让掌握度徽标 `white-space: nowrap` 且不参与收缩；平板科目选择器使用 `clamp(108px, 12vw, 148px)` 宽度、动作间距 8px、徽标字号 12px 和较窄水平内边距。
- [x] 运行 Task 1 的两个平板宽度断言，预期 PASS；运行原有 1400×920、1024×1366 与 1600×1000 平板/桌面回归。

## Task 3：平衡自测答案位置并保留判分一致性

**Files:**
- Modify: `platform/quiz.js`
- Modify: `tests/browser/quiz-options.spec.cjs`

- [x] 在 `open(nodeId, title)` 内只为单选题建立显示选项副本，不修改原题库；按可用选项键分组创建一轮随机排列的标签序列，循环使用该序列，保证一个完整周期内每个标签恰好一次。
- [x] 将原正确选项文本移动到该题分配的显示标签，打乱干扰项后填入其他标签，并将重映射后的答案存在状态对象中；提交、正确项高亮、重试均只引用该状态答案。判断题保留“正确/错误”的 T/F 键语义。
- [x] 运行 quiz 用例，预期一轮 3 道堆插入单选题覆盖 3 个不同标签，逐题选中正确文本后全部判对。

## Task 4：逐小节扩充到 480 道带来源的真题题意整理

**Files:**
- Create: `platform/questions/past-exams.js`
- Modify: 七科 `index.html`，在对应基础题、补足题之后且 `platform/quiz.js` 之前加载新题库
- Modify: `platform/quiz.js`
- Modify: `platform/quiz.css`
- Modify: `tests/platform.test.cjs`
- Modify: `README.md`

- [x] 按 `scripts/catalog.cjs` 生成的 240 个小节 ID 建立独立索引，覆盖数据结构 54、计算机组成原理 39、操作系统 16、计算机网络 21、高等数学 46、线性代数 20、概率论 44 个节点；每个节点登记两道带来源的真题整理题。
- [x] 新题目保存在 `window.ZhixuPastExamQuestions`，按精确 nodeId 组织。运行时 `questionsFor` 返回当前节点的 5 道原创练习题和该节点的 2 道真题，全部 240 个入口显示 7 题。
- [x] 解析年份、题号和来源 URL；检查 408 题号落在计算机学科题段，数学一题号落在对应分章真题索引或保留的 2000、2005、2018 原卷来源中。所有来源 URL 使用 HTTPS。
- [x] 自测弹窗在真题题干上方按 `fidelity` 显示 `真题题意整理` 或 `真题改编`，并展示 `{年份} {试卷} 第{题号}题`；原卷链接以新标签打开，改写题不描述成逐字原题。
- [x] 将题库测试改为检查原练习题每节点 5 道、真题索引覆盖 240 个小节且总数恰好 480 道、每节恰好两道真题、题目答案与解析齐全、来源字段合法且题目绑定精确小节 ID。
- [x] 更新 README：原有 1200 道原创风格练习题保持不变，另加 480 道逐小节真题题意整理，总自测题量 1680 道。

## Task 5：全量验证并记录结果

**Files:**
- Test: `tests/browser/tablet-layout.spec.cjs`
- Test: `tests/browser/quiz-options.spec.cjs`
- Test: `tests/platform.test.cjs`
- Test: `tests/server/*.test.cjs`
- Test: `scripts/audit-content.cjs`

- [x] 在 240 节题库更新后重新运行 `npm test`（4/4）、`npm run test:server`（33/33）、`npm run audit`。
- [x] 运行 `npm run test:browser`（21/21），覆盖平板/桌面断点，并逐科核实 240 个自测入口全部显示 7 题；该命令使用项目现有 `PW_CHANNEL=chrome` 配置。
- [x] 运行 `npm run build`，核实七科发布 HTML 均有 `past-exams.js`，所有链接资源存在，发布产物不包含 PDF 或其它私有原卷副本。

## Task 6：部署静态站点

**Files:**
- Deploy: `dist/` contents to `/www/wwwroot/recaord.top/math-modeling/`
- Backup: `/www/backups/recaord/zhixu-frontend-<timestamp>/`

- [x] 完成 Task 5 的全部验证后，把线上静态目录完整复制到带时间戳的回滚备份目录 `/www/backups/recaord/zhixu-frontend-20260928022926-dac35f/`。
- [x] 上传构建后的 `dist/` 压缩包，确认解包目录含 `index.html`、`platform/questions/past-exams.js` 和七科页面，再以 `rsync --delete` 同步到 `/www/wwwroot/recaord.top/math-modeling/`。
- [x] 线上抽查门户、题库脚本、科目页、quiz 脚本和 API `healthz` 均返回 200；在线脚本核对到 46 个章节节点和 92 道题。

### 480 道逐小节真题版本的后续发布

- [x] 全部验证通过后，为线上静态目录创建新的时间戳备份 `/www/backups/recaord/zhixu-frontend-20260928034310-480persection/`，不覆盖 92 题版本的回滚备份。
- [x] 仅发布 `dist/` 静态前端，保留后端配置和数据库；线上核对 240 个节点、480 道真题以及每节 7 题，API `healthz` 返回 200。

---

## 自检

- 用户提出的三项需求均有对应任务：平板页眉、答案位置偏斜、逐小节真题扩充。
- 原创题库保持原样、节点答案不做写入变更；动态显示副本解决答案位置集中问题。
- 逐小节两道真题按来源和改写标记组织；回归测试覆盖 240 节全覆盖、480 题总量与来源元数据。
- 480 题静态前端版本已发布并保留独立备份；后端配置与数据库未被替换。
- 部署时备份并替换静态 `dist/`，保留现有掌握度后端配置和数据库。
- 文件路径与命令均对应现有目录和 `package.json` 脚本。
