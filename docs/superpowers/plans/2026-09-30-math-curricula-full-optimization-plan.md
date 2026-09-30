# 数学三课全量优化实施计划

> **For agentic workers:** 执行本计划时沿用 `docs/superpowers/specs/2026-09-30-math-curricula-full-optimization-design.md`；本任务由当前会话内联执行，不派发子代理。

**Goal:** 按 2026 数学一大纲逐点纠正、补全并改进高等数学、线性代数、概率论与数理统计三课，然后安全发布数学课程静态文件。

**Architecture:** 保持现有原生 JavaScript、章节 schema、hash 锚点和浏览器进度键。`content/syllabus.js` 保存原大纲及课程覆盖，`content/ch*.js` 保存讲解，`assets/js/widgets/*.js` 保存 Canvas 实验。通过新增轻量大纲映射审计器核验 349 个官方条目都指向有效小节；发布只同步本次实际修改的三课文件。

**Tech Stack:** Node.js 22、原生 JavaScript、Canvas 2D、KaTeX、现有 Playwright/Chrome 检查器、SSH、tar、SHA-256。

---

## 文件范围

- Create: `docs/math-curricula/2026-math-knowledge-audit.md` — 记录每个发现的课程、章/节、问题等级、原文证据、修正与复核结果。
- Create: `docs/math-curricula/2026-math-coverage.md` — 列出 349 项官方内容/要求到课程小节的逐点覆盖映射。
- Create: `scripts/audit-math-coverage.cjs` — 用 Node 内置模块检查每项官方来源条目均被映射、映射引用有效且小节锚点存在。
- Modify: `高等数学可视化/content/syllabus.js`、`高等数学可视化/content/ch1.js` 至 `ch8.js`。
- Modify: `线性代数可视化/content/syllabus.js`、`线性代数可视化/content/ch1.js` 至 `ch6.js`。
- Modify: `概率论可视化/content/syllabus.js`、`概率论可视化/content/ch1.js` 至 `ch8.js`。
- Modify as needed: `高等数学可视化/assets/js/widgets/calc1.js` 至 `calc8.js`、`线性代数可视化/assets/js/widgets/la1.js` 至 `la6.js`、`概率论可视化/assets/js/widgets/ch1.js` 至 `ch8.js`；仅当复核发现视觉/交互确有教学问题时编辑。
- Do not modify for this task: root `README.md`、三课 `index.html` 和 `assets/js/app.js`、共享 `platform/`、后端及其他四科学习内容；这些位置有用户已有未提交工作。
- Build output: `dist/`。不将其完整复制到生产环境。

## Task 1：建立安全基线和大纲来源清单

- [ ] 记录当前 `git status --short`；保存只读快照，确认三课 syllabus/chapter/widget 源文件在任务开始时没有预存改动。
- [ ] 比较 `高等数学/26考研数学大纲(1).pdf`、`线性代数/26考研数学大纲(1).pdf`、`概率论可视化/26考研数学大纲(1).pdf` 的 SHA-256，确认它们来自同一版 2026 数学一大纲。
- [ ] 用 Poppler 将大纲页 6–24 渲染到 `tmp/pdfs/math-outline-20260930/`；逐页核对三份 `content/syllabus.js` 的 `official.content`、`official.requirements` 转录与章节名称。
- [ ] 读取三课章节和小节注册数据，建立 22 章、110 节和 172 个可视化的实际基线；不把 README 数字当作组件加载成功的证据。

## Task 2：让 349 项大纲覆盖可机械复核

- [ ] 在三份 `content/syllabus.js` 中为每一条 `coverage` 记录补充 `refs`，引用形如 `content:ch1:0` 或 `requirement:ch1:2`；索引对应同一文件 `official[chapter].content[]` 或 `official[chapter].requirements[]` 的从零开始位置。
- [ ] 编写 `scripts/audit-math-coverage.cjs`：加载三份 syllabus 与所有章节数据；拒绝未知课程/章节/索引、同一来源条目重复映射到同一小节、缺失大纲条目、无效 `sec` 锚点和错误 `secTitle`；同一要求可映射到多个小节。
- [ ] `scripts/audit-math-coverage.cjs` 使用以下完整实现；章节源码通过项目现有全局对象注册，`refs` 采用 `content:chN:index` 与 `requirement:chN:index` 格式：

```js
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const courses = [
  ['calculus', '高等数学可视化'],
  ['linear-algebra', '线性代数可视化'],
  ['probability', '概率论可视化'],
];
let failures = 0;

for (const [id, directory] of courses) {
  const sandbox = { console: { warn() {}, error() {} } };
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox);
  const contentDir = path.join(root, directory, 'content');
  const files = fs.readdirSync(contentDir)
    .filter(name => /^(syllabus|ch\d+)\.js$/.test(name))
    .sort((a, b) => a === 'syllabus.js' ? -1 : b === 'syllabus.js' ? 1 :
      Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  for (const file of files) {
    const full = path.join(contentDir, file);
    vm.runInContext(fs.readFileSync(full, 'utf8'), context, { filename: full, timeout: 5000 });
  }

  const syllabus = sandbox.SYL || sandbox.SYLLABUS;
  if (!syllabus) throw new Error(`${directory}: missing SYL/SYLLABUS`);
  const official = syllabus.official || {};
  const coverage = syllabus.coverage || [];
  const structure = syllabus.structure || syllabus.probStructure || [];
  const sections = new Map();
  for (const chapter of structure) {
    const data = sandbox[String(chapter.id).toUpperCase()];
    if (!data) continue;
    for (const section of data.sections || []) sections.set(section.id, section);
  }

  const expected = new Set();
  let contentCount = 0;
  let requirementCount = 0;
  for (const [chapter, source] of Object.entries(official)) {
    (source.content || []).forEach((_, index) => {
      expected.add(`content:${chapter}:${index}`);
      contentCount++;
    });
    (source.requirements || []).forEach((_, index) => {
      expected.add(`requirement:${chapter}:${index}`);
      requirementCount++;
    });
  }

  const seen = new Map();
  const errors = [];
  for (const row of coverage) {
    if (!structure.some(chapter => chapter.id === row.ch)) errors.push(`unknown chapter ${row.ch}`);
    const section = sections.get(row.sec);
    if (!section) errors.push(`invalid anchor ${row.sec}`);
    else {
      const actualTitle = `${section.num || ''} ${section.title || ''}`.trim().replace(/\s+/g, ' ');
      const mappedTitle = String(row.secTitle || '').trim().replace(/\s+/g, ' ');
      if (actualTitle !== mappedTitle) errors.push(`title mismatch ${row.sec}: ${mappedTitle} != ${actualTitle}`);
    }
    if (!Array.isArray(row.refs) || row.refs.length === 0) {
      errors.push(`coverage row without refs ${row.ch} ${row.item || ''}`);
      continue;
    }
    for (const ref of row.refs) {
      if (!expected.has(ref)) { errors.push(`unknown source ref ${ref}`); continue; }
      if (ref.split(':')[1] !== row.ch) errors.push(`chapter mismatch ${ref} -> ${row.ch}`);
      if (!seen.has(ref)) seen.set(ref, new Set());
      if (seen.get(ref).has(row.sec)) errors.push(`duplicate source ref ${ref} -> ${row.sec}`);
      seen.get(ref).add(row.sec);
    }
  }
  for (const ref of expected) if (!seen.has(ref)) errors.push(`unmapped source ref ${ref}`);

  if (errors.length) {
    failures++;
    console.error(`✗ ${id}: ${contentCount} content, ${requirementCount} requirements, ${coverage.length} rows, ${errors.length} issues`);
    errors.forEach(error => console.error(`  - ${error}`));
  } else {
    console.log(`✓ ${id}: ${contentCount} content, ${requirementCount} requirements, ${coverage.length} rows, ${sections.size} sections`);
  }
}

if (failures) process.exitCode = 1;
```
- [ ] 运行 `node scripts/audit-math-coverage.cjs`；要求高数 124+71、线代 48+26、概率论 54+26 均完整映射，合计 349 项，缺项/重复/坏锚点均为 0。
- [ ] 将通过检查的逐项映射以可读表格写入 `docs/math-curricula/2026-math-coverage.md`，保留“了解/理解/掌握/会用”原层级。

## Task 3：完成知识审计并记录问题

- [ ] 审核高等数学第 1–4 章：逐节核对定义、条件、求解步骤、例题和可视化语义，检查对应的 2026 大纲映射。
- [ ] 审核高等数学第 5–8 章：逐节核对偏导/积分/级数/微分方程的条件、符号、计算和边界情形，检查对应的大纲映射。
- [ ] 审核线性代数第 1–3 章：逐节核对行列式、矩阵、向量空间、秩、基变换与正交化的定义及计算。
- [ ] 审核线性代数第 4–6 章：逐节核对方程组结构、特征值/对角化、二次型与正定判别条件。
- [ ] 审核概率论第 1–4 章：逐节核对事件运算、分布、条件/独立、多维分布和数字特征的条件、公式及例题。
- [ ] 审核概率论第 5–8 章：逐节核对极限定理条件、抽样分布、估计和检验的定义、自由度、尾部方向及数值。
- [ ] 对数值结果用独立脚本或手算复核，对定理结论检查必要条件和充分条件；每个发现都按“确凿错误/遗漏条件/覆盖缺口/表达问题”分类并写入审计文档。
- [ ] 复核历史清单 `概率论可视化/wrong.md` 中的每一项当前状态；已修正项目仅标记为历史修复，不重复改写。

## Task 4：先修正已确认的知识问题

- [ ] 修正 `概率论可视化/content/ch3.js` 中把单点密度差异作为独立性反例的断言；写明密度需几乎处处相等，反例必须在正测度区域上成立。
- [ ] 修正 `线性代数可视化/content/ch2.js` 中 `A* 可逆 iff A 可逆` 缺少维数限制的问题；明确对 `n≥2` 成立，并用 `n=1` 的零矩阵检验例说明为什么不能漏条件。
- [ ] 按 Task 3 的审计记录修复三课剩余高优先级数学错误和条件缺漏；每个修复同时更新审计状态和覆盖说明。
- [ ] 对每个修正重新独立验算公式/例题，确认修正没有改变章节 ID、公开锚点或旧进度键。

## Task 5：丰富高等数学内容

- [ ] 按大纲层级逐节检查 `高等数学可视化/content/ch1.js` 至 `ch8.js`；对只有结论而缺少适用条件/推导理由/完整计算的节点补充解释。
- [ ] 对高频方法补足“为什么可用、何时不能用、关键步骤如何选择”，覆盖极限、求导/中值定理、积分、空间几何、多元微分、重积分、级数和微分方程。
- [ ] 为缺少可复算演示的小节补充原创例题的完整解法、结果校验和一个针对性辨析/自检；不添加重复段落，不把超纲材料混入核心路径。
- [ ] 将需要的少量延伸以现有内容卡片样式显式标为“拓展”，并保留大纲覆盖锚点与原有 `examples`、`pitfalls` 数据契约。

## Task 6：丰富线性代数内容

- [ ] 按大纲层级逐节检查 `线性代数可视化/content/ch1.js` 至 `ch6.js`，确保矩阵维数、行列方向、秩和解空间记号前后一致。
- [ ] 对行列式展开、矩阵运算、秩/等价、线性表示与相关性、方程组、特征/对角化、二次型提供条件说明和关键推导。
- [ ] 为抽象定理补充小规模数值例与反例，覆盖重根、奇异矩阵、非齐次无解/多解、正定判别等常见边界；例题步骤和答案可逐步核算。
- [ ] 将少量大纲外补充显式标记“拓展”，不更改已有题库/路由/进度接口。

## Task 7：丰富概率论与数理统计内容

- [ ] 按大纲层级逐节检查 `概率论可视化/content/ch1.js` 至 `ch8.js`，重点补清事件/随机变量区分、条件假设、参数化和分布记号。
- [ ] 对概率计算、随机变量函数、多维积分、数字特征、极限定理、抽样分布、区间估计和假设检验补足条件检查与完整步骤。
- [ ] 复核尾部方向、分位数记号、自由度、连续性修正、置信水平/显著性水平和 I/II 类错误；每个数值例至少独立算一次。
- [ ] 让 110 个小节均有适配大纲要求的讲解、例题与易错提醒；把仅供深入理解的内容标记为“拓展”。

## Task 8：优化高等数学动画

- [ ] 根据 Task 3 的映射复核 `calc1.js` 至 `calc8.js` 的每个注册组件，写入审计表：知识点、动画状态、输入含义、观察结论、边界条件、控制和修复状态。
- [ ] 修复会让极限/切线/积分/空间曲面/梯度/曲面积分/级数/微分方程结论失真的坐标尺度、符号、单位、初始/终止状态和参数边界。
- [ ] 对状态过程难以跟随的组件使用现有 `widgets/ui.js` 传输控件提供单步/暂停/重置/合理速度；无需播放的示意图不增加自动运动。
- [ ] 核实 Canvas 清晰度、深浅主题、窄屏布局与 `prefers-reduced-motion` 行为。

## Task 9：优化线性代数动画

- [ ] 逐一审阅 `la1.js` 至 `la6.js` 的注册组件并建立与 Task 8 相同的审计记录。
- [ ] 核对行变换对矩阵和方程组的同步效果、线性组合的几何关系、特征方向与伸缩、正交变换和二次型等高亮。
- [ ] 修正算法步骤与画面不同步、矩阵标签错位/裁切、向量方向/比例误导和极端参数下无法读图的问题。
- [ ] 核实键盘/按钮控制、主题联动、窄屏和减少动态效果。

## Task 10：优化概率论动画

- [ ] 逐一审阅 `ch1.js` 至 `ch8.js` 的注册组件并建立与 Task 8 相同的审计记录。
- [ ] 核对概率质量/密度面积、累积分布端点、条件概率样本空间、联合/边缘/条件分布、抽样波动、置信区间和拒绝域的画面含义。
- [ ] 修正概率面积与数值不同步、尾部/拒绝域方向错误、抽样随机波动被误读为定理结论、曲线/区间缺少参数说明等问题。
- [ ] 核实大样本/极限过程是否显示样本量与近似条件；核实键盘/按钮控制、主题、窄屏及减少动态效果。

## Task 11：构建与发布前核验

- [ ] 运行 `node scripts/audit-math-coverage.cjs`，确认 349/349 项有有效引用。
- [ ] 运行 `npm run audit`；确认三课无失效大纲锚点、缺例题/易错点或不存在的组件。
- [ ] 运行 `npm test`；若失败，区分本轮回归与开始前已有的未提交改动，不撤销用户工作。
- [ ] 运行 `npm run build`；用 `node scripts/serve.cjs --port 8767` 本地预览后，在 PowerShell 执行 `$env:PREVIEW_URL='http://127.0.0.1:8767'; node scripts/verify-all.cjs; Remove-Item Env:PREVIEW_URL`，确认三课 110 个入口无脚本/KaTeX/组件/布局错误。
- [ ] 手动核对每课至少一项过程动画、一个边界参数案例、深浅主题、手机视口与减少动态效果；检查审计报告、覆盖表、发布静态目录清单。
- [ ] 记录最终要发布的本轮文件清单；明确排除开始前已脏的课程 `index.html`、`assets/js/app.js`、`platform/` 和其他课程改动。

## Task 12：备份并发布三课静态资源

- [ ] 通过 `ssh my-server` 只读核对 `/www/wwwroot/recaord.top/math-modeling/` 和 `/www/backups/recaord/` 的真实路径、权限和现有课程目录；确认生产目录不是意外符号链接。
- [ ] 生成 `YYYYMMDD-HHMMSS-zhixu-math-optimization/` 备份目录，将线上 `/math-modeling/` 完整打包到该目录并核对归档非空和 SHA-256。
- [ ] 将 Task 11 的明确发布清单从 `dist/subjects/calculus/`、`dist/subjects/linear-algebra/`、`dist/subjects/probability/` 打包上传至该备份目录中的暂存区；绝不包含 `dist` 里的 408、门户、题库或现有用户未提交改动。
- [ ] 比较本地暂存文件与服务器暂存文件 SHA-256；全部相同后才逐文件复制到 `/www/wwwroot/recaord.top/math-modeling/`，不清空或删除目标目录的其他文件。
- [ ] 比较已发布文件 SHA-256；用 HTTPS 检查首页、三科各一个课程路由、修正后的独立性说明和线代伴随矩阵维数说明；若失败，使用该次完整备份恢复目标文件并保留审计证据。
- [ ] 保留线上备份与审计记录；删除暂存区前先解析并核对它位于本次带时间戳的备份目录之内。
