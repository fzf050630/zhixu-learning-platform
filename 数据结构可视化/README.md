# 数据结构 · 算法可视化

最新交付（2026-09-19）：第二轮扩展新增 19 个实验（顺序表逆置/删除最小、头插法建链表、合并有序链表、约瑟夫环、共享栈、双端队列、中序线索树、BST 查找/删除、大根堆插入、基数/计数/折半插入排序、线性探测/双散列、KMP nextval、BF 匹配、十字链表），实验总数 35 → 54；新增算法模块 `assets/js/algorithms/extra-basics.js`。Node 64/64、Chrome 24/24（含全部 54 个实验自动播放）通过。

平台接入（2026-09-17）：已加入上级目录的“知序”七科学习平台，统一导航、视觉和主题。请从上级目录运行 `npm run dev`；部署使用上级目录 `npm run build` 生成的完整 `dist/`。本目录现在引用 `../platform/` 共享资源，不宜单独复制发布。算法与课程内容保持原实现。

最新交付（2026-09-17）：本轮剩余交互与验收已完成，Node 61/61、Chrome 23/23 通过。图表单删点自动清理关联边并提示失效起点；手机目录恢复焦点并隔离隐藏控件。桌面/手机/深色截图见 docs/verification/。下方较早的“仍需专项验收”和测试数字为历史记录，完整当前状态见 docs/NEXT-AGENT-HANDOFF.md 顶部。

当前集成状态（2026-09-17）：6 章、35 个实验、11 类渲染器。已接入折半查找等基础输入、图表单和布局按钮，以及冒泡/选择/希尔排序、Bellman–Ford、AOE 活动时差、KMP、图表示转换和三种高级树。下文旧的 26 实验验收数字属于历史记录。

本次恢复验证：Node 52/52 通过；原有 Chrome 全套 11/11 通过，新增图输入/布局按钮和折半查找场景 2/2 通过，命令退出码均为 0。覆盖全部 35 个默认实验自动播放；触屏拖动、多 DPI 命中及新增算法的更多边界仍需专项验收，不能仅凭默认案例全部通过视为所有扩展验收完成。

面向 2027 考研数据结构复习的离线算法实验室。内容范围参考同目录的王道数据结构复习指导，但页面中的步骤说明与预设案例均为独立编写。

## 打开方式

直接双击 `index.html`，或在上级目录运行：

```powershell
python -m http.server 8765 --directory 数据结构可视化
```

随后访问 `http://127.0.0.1:8765/`。

## 可视化内容

- 线性表：顺序表插入、顺序表就地逆置、删除最小元素、单链表逆置、头插法建表、合并有序链表、约瑟夫环
- 栈与队列：顺序栈操作、共享栈、循环队列、双端队列
- 树：先序、中序、后序、层序遍历，哈夫曼树，并查集，中序线索二叉树
- 图：BFS、DFS、Prim、Kruskal、Dijkstra、Floyd、拓扑排序、关键路径、十字链表
- 查找：折半查找、BST 插入、BST 查找、BST 删除、AVL 四类旋转、散列表冲突处理、线性探测、双散列、KMP、KMP nextval、BF 匹配
- 排序：快速排序、堆排序、直接插入排序、折半插入排序、归并排序、基数排序、计数排序；多种排序支持自定义数组输入

每个实验支持上一步、下一步、自动播放、暂停、重置、速度调节，并同步高亮 C 语言伪代码。

四种排序实验支持输入 1–12 个整数，范围为 [-999, 999]，可用英文逗号、中文逗号或空白分隔。非法输入会保留当前案例和播放进度；成功应用后从第一步暂停，重置会重播当前已应用案例，恢复预设会回到默认数组。

键盘操作：方向键切换步骤，空格播放或暂停。

在页面空白处使用方向键切换步骤、空格播放/暂停、Home 重置；输入框和按钮保留原生键盘操作。按 `/` 搜索，手机端会同时打开目录；Esc 关闭目录。

代码区使用随项目附带的 JetBrains Mono，中文回退到微软雅黑。显式保留缩进、关闭运算符连字，并提供关键字/数值/注释配色。超长语句自动换行，不再被面板右侧裁切。

## 工程结构

```text
assets/js/
  app.js                     路由、导航、搜索、主题与页面外壳
  core/player.js             游标、计时和播放状态
  core/input-validation.js   自定义整数数组的解析与校验
  core/lab-runtime.js        校验、挂载/销毁、错误恢复、同步视图与控制
  ui/experiment-input.js     实验参数表单、错误提示和预设恢复
  algorithms/                六类算法的完整快照生成器
  visualizers/
    canvas-scene.js           DPI、主题、字体、缩放、基础图元
    *-renderer.js             array/linked/stack/queue/tree/graph/matrix/hash
    renderers.js              稳定的渲染器注册入口
content/
  experiment.js              defineExperiment 统一实验约定
  chapters/*.js              六个章节，各实验的配置集中声明
  chapters.js                合并清单、检查重复 ID 与章节归属
```

`LabRuntime.createRuntime(elements)` 返回 `mount(experiment, options)`、`destroy()`、`redraw()`。带输入的挂载会先生成并校验候选快照，成功后才替换前一播放器；销毁会释放订阅、定时器、DOM 事件和 ResizeObserver。初始化、自动播放、重绘出错时，画布清空、播放控制禁用并显示错误说明；输入错误只反馈在参数区域并保留当前案例。

所有页面脚本仍按顺序通过普通 `<script>` 加载，没有运行时 npm 包、ES Module、网络字体或构建步骤。`node_modules` 只用于开发测试，分发离线页面无需附带它。

## 新增实验

1. 在对应 `assets/js/algorithms/` 文件实现算法生成器，返回完整快照数组。每个快照必须包含 `state`、非空 `message`、从 1 开始且不超过伪代码行数的 `line`；不要让不同快照共享会继续变动的状态引用。
2. 在对应 `content/chapters/` 清单加入 `defineExperiment(...)`。例如在排序章节使用已有归并生成器添加另一个案例：

   ```js
   defineExperiment({
     id: 'merge-small',
     chapter: chapter.id,
     title: '归并排序：小数组',
     visualizer: 'array',
     tag: '分治合并',
     difficulty: '基础',
     code: [
       'void MergeSort(int A[], int low, int high) {',
       '  if (low >= high) return;',
       '  int mid = (low + high) / 2;',
       '  MergeSort(A, low, mid);',
       '  // 合并两个有序子区间',
       '  MergeSort(A, mid+1, high);',
       '  Merge(A, low, mid, high);',
       '  // 写回原数组',
       '}',
     ],
     generator: A.sort.mergeSort,
     preset: () => [[8, 3, 5, 1]],
   });
   ```

   `preset()` 每次返回新参数数组，参数顺序对应 `generator`；运行器通过统一 `createSteps()` 调用。章节导航会自动包含新实验。
3. 复用现有渲染类型无需修改页面控制。只有新增结构类型时，才添加独立 `*-renderer.js`，在 `index.html` 的注册入口之前加载，并更新 `renderers.js` 的类型清单。
4. 为算法结果补 Node 测试，运行两组测试。若正式增加实验数量，更新测试中的预期数量；首页统计和章节目录会自动跟随注册表。

## 自动测试

```powershell
node --test tests/*.test.js
```

在本目录安装开发依赖后运行 Chrome 测试（需安装 Google Chrome）：

```powershell
npm ci
npm test
npm run test:browser
```

浏览器测试直接加载 `file://`，覆盖 26 个实验完整自动播放、同步高亮、播放边界、路由释放、异常恢复、主题、禁用存储、离线请求、实际字体加载、320–1440px 布局和 2× DPI。截图保存在 `test-results/`。也可用 `$env:PW_CHANNEL='msedge'` 选择本地 Edge。

Windows 上 Chrome 有时创建当前用户无法删除的临时缓存目录，导致 Playwright 的递归重试长时间挂起，见 [Playwright 问题 #42109](https://github.com/microsoft/playwright/issues/42109)。测试配置仅限制 `%TEMP%/playwright_chromiumdev_profile-*` 的清理重试；遇到 EPERM 会明确输出残留路径，测试仍正常结束。不修改系统权限，不绕过测试断言，也不改变浏览器安全选项。

## 本轮范围

已完成前四项优先级的架构与自动化工作，并补充语法配色、移动控制栏、减弱动画和无障碍步骤说明。任务 5A 的首个交付已完成：四种排序支持自定义整数数组输入和恢复预设。任务 5B 已完成：八类结构的快照状态表随播放、后退、重置和案例切换同步，异常或离开实验后清空。折半查找输入、任意图/树编辑、拖动节点及新算法仍待后续逐项扩展。

状态表使用 `assets/js/ui/state-table.js`，只读取当前快照。缺失字段显示 `—`，空值显示 `∅`，不可达距离显示 `∞`，数值 0 原样保留。队列分别显示物理槽位与逻辑顺序；数组展示访问/有序标记和适用指针；图展示距离、前驱、入度、ve/vl 等已存在字段。快照未记录的字段不推算、不沿用上一步。实验可通过 `describeState(state)` 返回 `{ title, columns, rows }` 数组覆盖默认展示，单元格只接受文本输出。窄屏表格独立滚动，不逐格进行实时播报。

任务 5B 验证：40/40 Node 测试、11/11 Chrome 场景通过；所有 26 个实验的快照均可生成表格。下一阶段为 5C：先验证图算法输入边界，再接图编辑表单。

后续任务的实施顺序、修改入口、接口约定、算法边界与验收案例见 [Agent 交接操作文档](docs/NEXT-AGENT-HANDOFF.md)。文档末尾附可直接转发给下一个 Agent 的任务指令。
