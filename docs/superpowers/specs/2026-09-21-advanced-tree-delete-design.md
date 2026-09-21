# 高级树与 AVL 树的删除操作可视化 · 设计

日期：2026-09-21
范围：`数据结构可视化/`（算法、渲染、内容、测试）与 `platform/`（目录、题库）同步
状态：已确认，进入实施

## 1. 背景与目标

`数据结构可视化/docs/remaining-work.md` 记录的产品边界是「高级树不含删除，AVL 保留预制旋转」。
红黑树、B 树、B+ 树三个实验（`#/lab/red-black-tree`、`#/lab/b-tree`、`#/lab/b-plus-tree`）
目前只有插入与查找；AVL（`#/lab/avl-rotations`）是四类固定旋转的预设演示，没有通用引擎。

本次交付：

1. 三棵高级树在**现有实验内**获得删除能力；
2. AVL 从「四类预制旋转」升级为**通用插入 + 删除**引擎；
3. 渲染器显式呈现红黑树的 NIL 叶与「双黑」状态；
4. 同步内容说明、伪代码、状态表、项目文档、平台题库与全部测试。

**实验总数保持 54 个入口、全站 240 个学习入口不变**，不新增知识节点。

## 2. 验收标准

- 每一次删除完成后的快照都满足该树的全部结构不变量：
  - 红黑树：根黑、无红红、各路径黑高相等、BST 有序；
  - B 树（t=2）：所有叶等深、非根结点关键字数在 1–3、子结点数 = 关键字数 + 1；
  - B+ 树：叶等深、父分隔键等于右子树最小值、叶链 `next` 完整且有序、记录仅存于叶；
  - AVL：每个结点 |bf| ≤ 1、结点高度等于子树高度加一、BST 有序。
- 删除全部关键字后得到空树。
- 删除后的剩余关键字集合等于「原集合 − 删除集合」。
- `file://` 直接双击 `index.html` 仍可完整使用，无框架、无构建步骤、无网络请求。
- `npm test`（含树算法测试）、Chrome 浏览器测试、`scripts/verify-all.cjs`、`scripts/audit-content.cjs` 全部通过。

## 3. 输入与校验

三个输入字段，复用既有 `fields` 表单渲染，**不需要改动任何 UI 代码**：

| 字段 | 含义 | 约束 |
| --- | --- | --- |
| `values` | 插入序列 | 1–12 个整数，范围 ±999 |
| `deletes` | 删除序列（可留空） | 最多 12 个整数，逗号、中文逗号或空白分隔 |
| `target` | 查找值（可留空） | ±999 整数 |

约定：

- 高级树的 `values` 允许重复，用于演示既有的「拒绝重复键」教学点；AVL 要求 `values` 互不相同（无重复语义）。
- `deletes` 允许包含树中不存在的键，也允许重复；这两种情况**不报错**，而是在步骤中演示「查找失败，本次删除跳过」。
  这与既有 `bst-delete`（要求删除键必须存在，否则直接报错）不同，理由是高级树删除教学需要展示「未命中也是一种结果」。
- 上限 12 与错误提示文案沿用现有风格。

## 4. 算法层

### 4.1 三棵高级树（`数据结构可视化/assets/js/algorithms/advanced-trees.js`）

三个生成器签名统一为 `(values, deletes, target)`，`deletes` 与 `target` 均可省略。

- **红黑树删除**：按二叉排序树规则定位待删结点；至多一个孩子时用孩子顶替，两个孩子时用中序后继替换关键字；
  若摘除的是黑结点则引入「双黑」，按 CLRS 四情形修复：
  兄为红、兄为黑且两孩子皆黑、兄为黑且远侄红、兄为黑且近侄红；修复完成后根强制置黑。
- **B 树删除（t=2）**：先向左右兄弟**借位**（旋转关键字与孩子），兄弟都不够时**合并**，
  沿路径回溯修复；根结点的关键字数为 0 时删除根并**降高**。
- **B+ 树删除**：在叶结点删除记录；叶内关键字数低于下界时先借位后合并；
  合并后重算父结点分隔键，并修复 `next` 叶链；内部结点下溢时按同样规则处理，根空则降高。

### 4.2 AVL（`数据结构可视化/assets/js/algorithms/search.js`）

用 `avlTree(values, deletes, target)` 替换现有 `avlRotations`：

- 插入：沿比较路径下降，回溯时更新 h 与 bf，按 LL/RR/LR/RL 旋转；
- 删除：按 BST 规则删除（双孩子用中序后继替换），沿路径回溯再平衡，删除可能触发多次旋转；
- 保留现有 h（子树高度）与 bf（平衡因子）标注，以及旋转类型统计 `cases`；
- **默认预设仍依次触发 LL、RR、LR、RL 四类旋转**，不丢失原有教学价值。

### 4.3 快照约定

沿用现有铁律：算法一次性生成**完整不可变快照**，渲染器只负责绘制、绝不重演算法；
每个快照 `JSON` 深拷贝后 `Object.freeze`。渲染器不得修改历史快照。

## 5. 步骤语义

新增阶段标识：

| 阶段 | 含义 |
| --- | --- |
| `delete-find` | 定位待删关键字 |
| `delete-swap` | 用中序后继替换待删结点 |
| `delete-remove` | 摘除结点或记录 |
| `fixup` | 修复过程中的一步（变色、旋转、双黑转移） |
| `borrow` | 向兄弟借位 |
| `merge` | 结点或叶合并 |
| `shrink` | 树高降低 |
| `deleted` | 本次删除完成，且不变量成立 |

`deleted` 是测试锚点：每遇到一个 `deleted` 快照就执行一次全量不变量校验。

「双黑」在快照中的表示（数据模型里 NIL 仍然是 `null`）：

```
state.doubleBlack = null
                  | { id }            // 真实黑结点变双黑
                  | { parent, side }  // NIL 空位承担双黑
```

## 6. 渲染器

`数据结构可视化/assets/js/visualizers/multi-tree-renderer.js`：

- 红黑树的 `null` 孩子槽**显式绘制为 NIL 小方块**。只改渲染，数据模型中仍是 `null`，
  因此既有那份 79 组序列的全量不变量测试完全不受影响；
- 「双黑」用双环加「双黑」标签，与普通黑结点区分；
- 补充删除语义的图例文案。

`数据结构可视化/assets/js/visualizers/tree-renderer.js`（AVL 使用）：
复用现有 `active`、`current`、`unbalanced`、`subtree` 标记，为待删结点与回溯路径增加高亮，不新建渲染器。

`describeState` 状态表：红黑树增加「双黑」列；B+ 树强化 `next` 与分隔键一致性列。

## 7. 内容与文档

- `数据结构可视化/content/advanced-tree-experiments.js`：三个实验标题改为
  「红黑树插入、删除与查找」「B 树插入、删除与查找」「B+ 树插入、删除与查找」，
  并同步 `tag`、`input`（三字段）、`parse`、`inputAdapter`、`explain`（目标/输入/步骤/要点/复杂度均覆盖删除）与 `code` 伪代码。
- `数据结构可视化/content/chapters/search.js`：`avl-rotations` 标题改为「AVL 树插入与删除」，
  `code`、`explain`、`preset`、`input`、`inputAdapter` 全部改写。
  **实验 id 保持 `avl-rotations` 不变**：它是题库节点 ID（`data-structures:#/lab/avl-rotations`）与掌握度数据的键，
  改名会连带迁移题库与历史掌握度。id 自此是稳定标识符，不再是描述。
- `数据结构可视化/docs/remaining-work.md` 与 `docs/NEXT-AGENT-HANDOFF.md`：移除
  「高级树不含删除」「AVL 仍为预制旋转」两条边界描述，改为当前能力。
- 根 `README.md`：计数不变（54 实验 / 240 入口），仅同步涉及标题的表述。

## 8. 平台侧同步

- `npm run catalog` 重新生成 `platform/catalog.js`（标题发生变化）。
- `platform/questions/data-structures.js` 与 `data-structures.q5.js`：
  重写 `#/lab/avl-rotations` 的 5 道题（覆盖插入旋转与删除再平衡），
  并为红黑树、B 树、B+ 树各替换 1–2 道题以覆盖删除。**每个节点仍恰好 5 题**（`npm test` 的硬约束）。
- `npm test` 与 `npm run test:server` 必须全绿。

## 9. 测试与验收

- 更新 `数据结构可视化/tests/advanced-trees.test.js`：新签名、阶段白名单加入删除阶段、`line` 上界随伪代码增长调整、每次 `deleted` 后校验不变量。
- 新增 `数据结构可视化/tests/advanced-tree-delete.test.js`：对三种树运行边界与随机删除序列，
  每次 `deleted` 后全量不变量校验；删空得到空树；剩余键集合等于「原集合 − 删除集合」。
- 新增 `数据结构可视化/tests/avl-tree.test.js`：插入与删除后 |bf| ≤ 1、高度正确、四类旋转均被覆盖、抽样置换。
- 更新 `数据结构可视化/tests/expanded-algorithms.test.js`（`avlRotations` → `avlTree`）。
- 新增浏览器用例 `数据结构可视化/tests/browser/advanced-tree-delete.spec.js`：
  填写删除序列 → 应用 → 播放到底 → 校验末帧与无控制台错误，并回归整套浏览器测试。
- 回归 `node scripts/verify-all.cjs`、`npm run audit`、`node scripts/check-source.cjs 数据结构可视化`。
- 四个场景截图存入 `数据结构可视化/docs/verification/`：红黑双黑修复、B 树合并、B+ 合并、AVL 删除。

## 10. 风险与不做的事

**风险**

- 红黑树与 B 树删除是易错算法：以不变量穷举、随机序列与「删空」用例兜底。
- 删除会显著增加步骤数：以 12 键上限控制规模，并保持单步语义清晰。
- 渲染器改动可能触碰既有渲染断言：先跑该断言再改。

**明确不做**（YAGNI）

- 不新增实验入口，不改动平台目录的 54 / 240 计数断言。
- 不修改 `bst-delete` 的输入严格性。
- 不做树间对比页面。
- 不引入任何框架、构建步骤或网络依赖。
