# 任务 5A：排序实验自定义输入 Implementation Plan

> For agentic workers: implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 为四种排序实验接入 1–12 个整数的自定义数组输入，并保持错误保留当前案例、成功替换后首步暂停和统一生命周期行为。

**Architecture:** input-validation.js 提供无 DOM 的整数数组解析；defineExperiment 让实验声明输入字段并把标准输入适配为算法参数；LabRuntime 先生成并校验候选快照再替换旧播放器；experiment-input.js 管理参数表单和销毁，app.js 只连接路由、UI 和运行器。

**Tech Stack:** 原生 JavaScript、HTML、CSS、Canvas 2D、Node node:test、Playwright file:// 浏览器测试。

---

## 文件与职责

- Create: assets/js/core/input-validation.js — 解析和校验整数数组，UMD/CommonJS。
- Create: assets/js/ui/experiment-input.js — 创建输入表单、错误消息、应用/恢复预设按钮和销毁函数。
- Create: tests/input-validation.test.js — 输入格式、范围、长度和隔离测试。
- Modify: content/experiment.js — 可选 input 声明、输入参数适配、createSteps(normalizedInput)。
- Modify: content/chapters/sort.js — 四个排序实验声明 integer-array 输入。
- Modify: assets/js/core/lab-runtime.js — 候选步骤生成、成功后替换、输入错误回调和旧 API 兼容。
- Modify: assets/js/app.js — 参数容器、输入 UI 生命周期、应用/恢复回调。
- Modify: index.html — 参数区域和脚本依赖顺序。
- Modify: assets/css/main.css — 参数区域、错误状态和窄屏布局。
- Modify: tests/runtime.test.js — 输入实验接口和运行器失败保留行为。
- Modify: tests/ui-smoke.test.js — 输入区域和脚本存在性断言。
- Modify: tests/browser/lab.spec.js — 四排序自定义输入和生命周期场景。
- Modify: README.md — 更新已实现能力和输入约束。
- Modify: docs/NEXT-AGENT-HANDOFF.md — 仅更新任务 5A 的已实现范围和验收记录。

## Task 1: 添加纯整数数组校验器

**Files:** tests/input-validation.test.js, assets/js/core/input-validation.js

- [ ] Step 1: 写失败测试。覆盖英文逗号、中文逗号、空白、负数、重复值、边界值；拒绝空内容、连续分隔符、非整数、小数、NaN、Infinity、超长和越界输入；验证结果数组与下一次解析互不共享。
- [ ] Step 2: 运行 node --test tests/input-validation.test.js，确认因模块或导出函数不存在而失败。
- [ ] Step 3: 实现 UMD/CommonJS 模块。导出 DEFAULT_INTEGER_ARRAY_LIMITS 和 parseIntegerArray(raw, options)。默认限制为 minLength 1、maxLength 12、min -999、max 999。解析时先检查字符串、trim，再以英文逗号、中文逗号或空白分隔；空 token 或非 /^[+-]?[0-9]+$/ token 返回带中文 message 的 ok:false；Number 转换后再次检查整数、有限值和范围；成功返回全新数组。
- [ ] Step 4: 重新运行 node --test tests/input-validation.test.js，确认新增测试全部通过。
- [ ] Step 5: 运行 npm test，确认现有 Node 测试没有回归。

## Task 2: 扩展实验输入接口

**Files:** content/experiment.js, tests/runtime.test.js

- [ ] Step 1: 写失败测试。构造带 input 描述和 inputAdapter 的实验，断言 createSteps([3, 1]) 使用标准输入，createSteps() 仍使用全新 preset 参数，且实验 input 和 inputAdapter 被冻结。
- [ ] Step 2: 运行 node --test tests/runtime.test.js，确认 createSteps 的输入路径尚未存在而失败。
- [ ] Step 3: 修改 defineExperiment。无 input 时保留旧校验和旧行为；有 input 时要求 input 为对象、type/label/placeholder/defaultValue 为非空字符串，input.parse 为函数，inputAdapter 为函数。复制并冻结 input 描述，冻结 inputAdapter 引用；createSteps(normalizedInput) 有参数时调用 inputAdapter(normalizedInput)，无参数时调用新的 preset()，两条路径都要求返回参数数组后调用 generator。
- [ ] Step 4: 重新运行 node --test tests/runtime.test.js，确认接口测试通过。
- [ ] Step 5: 运行 npm test，确认 26 个旧实验仍能无参生成快照。

## Task 3: 让四个排序实验声明输入

**Files:** content/chapters/sort.js, tests/registry.test.js

- [ ] Step 1: 写失败测试。查找 quick-sort、heap-sort、insertion-sort、merge-sort，断言 input.type 为 integer-array，input.parse 和 inputAdapter 均为函数；解析 3, -1, 3, 0 后通过 createSteps 生成末帧 [-1, 0, 3, 3]。
- [ ] Step 2: 运行 node --test tests/registry.test.js，确认四个实验缺少输入声明而失败。
- [ ] Step 3: 在 sort.js 取得 DS.InputValidation.parseIntegerArray，建立共享 input 描述：label 为 待排序数组，placeholder 为 例如：49, 38, 65, 12，defaultValue 为当前预设文本，parse 指向共享解析器；四个实验加入 input 和 inputAdapter，适配器返回 [[...values]]。保留各 preset 作为恢复默认案例的来源。
- [ ] Step 4: 重新运行 node --test tests/registry.test.js，确认新增测试通过。
- [ ] Step 5: 运行 npm test，确认总注册表和全部算法测试通过。

## Task 4: 接入运行器的候选步骤替换

**Files:** assets/js/core/lab-runtime.js, tests/runtime.test.js

- [ ] Step 1: 写失败测试。使用最小 DOM 和播放器替身，调用 mount(experiment, { input, onInputError })；合法输入应安装新播放器并返回 true；候选输入失败应调用 onInputError、保留原播放器和游标、不调用旧播放器 destroy。
- [ ] Step 2: 运行 node --test tests/runtime.test.js，确认 mount 尚不接受输入选项或错误仍会销毁旧实验而失败。
- [ ] Step 3: 将 mount 拆成候选准备与正式替换两段。候选段执行 validateExperiment、experiment.createSteps(options.input)、validateSteps；失败时有 onInputError 就回调并返回 false，没有回调才使用现有 fail(error)。候选成功后再执行 destroy、代码渲染、播放器创建和监听器安装。保持 mount(experiment) 兼容；成功返回 true，初始化/输入失败返回 false。
- [ ] Step 4: 重新运行 node --test tests/runtime.test.js，确认失败保留和成功替换测试通过。
- [ ] Step 5: 运行 npm test，确认既有初始化失败、首帧失败、播放和销毁测试全部通过。

## Task 5: 创建参数 UI 和页面路由接入

**Files:** assets/js/ui/experiment-input.js, index.html, assets/js/app.js, assets/css/main.css, tests/ui-smoke.test.js

- [ ] Step 1: 写失败测试。断言 HTML 含 experimentInput、applyInputBtn、presetInputBtn；脚本加载 input-validation.js 和 experiment-input.js；UI 模块声明输入时创建文本 input、错误区域和两个按钮，合法提交回调标准数组，非法提交只显示错误，恢复预设回调默认数组。
- [ ] Step 2: 运行 node --test tests/ui-smoke.test.js，确认页面结构和模块尚未存在而失败。
- [ ] Step 3: 实现 createExperimentInput(container, experiment, callbacks)。它清空容器；无 input 时返回空销毁函数；有 input 时使用安全 DOM API 创建 section、label、文本输入框、限制说明、role=alert 错误段落、应用按钮和恢复预设按钮。草稿初始为 defaultValue；应用时调用 experiment.input.parse(field.value)，失败显示 message 且不调用 onApply，成功清错并调用 onApply(value)；恢复预设设置 defaultValue、解析并调用 onPreset(value)。返回函数移除监听器并清空容器。
- [ ] Step 4: 在 index.html 加入 experimentInput，按依赖顺序加载 input-validation.js、算法/渲染器、experiment.js、章节、experiment-input.js、lab-runtime.js、app.js。
- [ ] Step 5: 在 app.js 保存 input UI 的销毁函数。进入实验时销毁旧 UI，先准备并安装实验输入 UI；onApply/onPreset 调用 runtime.mount(e, { input: values, onInputError: showFieldError })。路由离开实验销毁 UI。全局键盘监听继续跳过 input、textarea、select、button、a 和 contenteditable。
- [ ] Step 6: 在 main.css 增加输入 panel、字段、说明、错误和按钮样式；720px 以下控件换行且不产生横向溢出。
- [ ] Step 7: 运行 node --test tests/ui-smoke.test.js 和 npm test，确认 UI 静态断言及全部 Node 测试通过。

## Task 6: 添加浏览器验收场景

**Files:** tests/browser/lab.spec.js

- [ ] Step 1: 写失败测试。新增 custom sort input 场景，依次访问四个排序路由，填写 3, -1, 3, 0 并点击应用；断言首步暂停，播放至末帧后通过页面暴露的当前快照读取 values 为 [-1, 0, 3, 3]。继续断言非法输入不会改变计数器/画布、重置重播当前自定义案例、播放中应用新数组后旧定时器不再推进。
- [ ] Step 2: 运行 npx playwright test tests/browser/lab.spec.js -g "custom sort input"，确认参数控件或自定义末帧行为尚不存在而失败。
- [ ] Step 3: 根据失败信息修正路由和运行器连接；不放宽断言，不删除旧场景；确保输入控件事件不会触发全局方向键快捷键。
- [ ] Step 4: 重新运行同一过滤测试，确认新增场景通过且 pageerror 和控制台 error 为空。
- [ ] Step 5: 运行 npm run test:browser，确认旧场景与新场景全部通过；记录退出码和已知 Chrome 临时目录 EPERM 清理告警。

## Task 7: 更新文档和最终验证

**Files:** README.md, docs/NEXT-AGENT-HANDOFF.md

- [ ] Step 1: README 增加四种排序支持自定义数组、1–12 个整数、[-999, 999]、逗号/中文逗号/空白分隔、非法输入保留当前案例、重置重播当前已应用案例和恢复预设语义。交接文档把 5A 更新为排序数组输入已实现、折半查找输入待实施，并记录实际测试命令和结果。
- [ ] Step 2: 运行 rg -n "TODO|TBD|createSteps\\(|experimentInput|parseIntegerArray" assets content tests README.md docs/NEXT-AGENT-HANDOFF.md，确认没有未完成占位词，接口名在实现、测试和文档中一致。
- [ ] Step 3: 运行 npm test，读取完整输出并记录通过数、失败数和退出码。
- [ ] Step 4: 运行 npm run test:browser，读取完整输出并记录通过数、失败数和退出码；确认无页面错误和远程请求。
- [ ] Step 5: 运行 git status --short；若当前目录仍不是 Git 仓库，在交付说明中明确无法提供 diff/commit，不执行破坏性回滚。
