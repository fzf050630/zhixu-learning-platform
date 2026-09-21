(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    root.DS.Algorithms,
    node ? require("../experiment.js") : root.DS.Experiments,
  );
  if (node) module.exports = api;
  root.DS.ChapterModules = root.DS.ChapterModules || {};
  root.DS.ChapterModules["search"] = api;
})(globalThis, function (A, helpers) {
  "use strict";
  const { defineExperiment } = helpers;
  const chapter = {
    id: "search",
    no: "05",
    title: "查找",
    subtitle: "有序区间逐步收缩",
  };
  const experiments = [
    defineExperiment({
      id: "binary-search",
      chapter: chapter.id,
      title: "折半查找",
      visualizer: "array",
      tag: "区间收缩",
      difficulty: "基础",
      code: [
        "int BinarySearch(int A[], int n, int key) {",
        "  int low = 0, high = n - 1;",
        "  while (low <= high) {",
        "    int mid = (low + high) / 2;",
        "    if (A[mid] == key) return mid;",
        "    if (A[mid] < key)",
        "      low = mid + 1;",
        "    else",
        "      high = mid - 1;",
        "  }",
        "  return -1;",
        "}",
      ],
      generator: A.search.binarySearch,
      preset: () => [[7, 13, 19, 28, 36, 45, 57, 68], 45],
      explain: {
        goal: "在有序顺序表中反复折半缩小查找区间，定位与 key 相等的元素或判定查找失败。",
        inputs: "含 n 个元素、按关键字递增有序的顺序表 A 与目标关键字 key。",
        steps: [
          "初始化查找区间：low = 0、high = n − 1。",
          "若 low > high，则区间为空，查找失败，返回 −1。",
          "取中点 mid = ⌊(low + high) / 2⌋，比较 A[mid] 与 key。",
          "若 A[mid] == key，查找成功，返回下标 mid。",
          "若 A[mid] < key，说明目标只可能在右半区，令 low = mid + 1。",
          "若 A[mid] > key，说明目标只可能在左半区，令 high = mid − 1。",
          "重复第 2～6 步，每次比较都把查找区间缩小一半。",
        ],
        keys: [
          "仅适用于<b>有序且顺序存储</b>的表；链表不能随机访问，无法折半查找。",
          "比较次数不超过 ⌈log₂(n+1)⌉，时间 O(log n)、空间 O(1)。",
          "区间端点更新为 mid ± 1（mid 已比较过），写成 mid 会陷入死循环。",
        ],
        cost: "时间 O(log n) · 空间 O(1)",
      },
    }),
    defineExperiment({
      id: "bst-insert",
      chapter: chapter.id,
      title: "BST 插入",
      visualizer: "tree",
      tag: "有序树",
      difficulty: "基础",
      code: [
        "void InsertBST(BiTree &T, Key key) {",
        "  if (T == NULL) createNode(T,key);",
        "  else {",
        "    // 比较当前结点",
        "    if (key < T->key)",
        "      InsertBST(T->lchild,key);",
        "    else InsertBST(T->rchild,key);",
        "  }",
        "}",
      ],
      generator: A.search.bstInsert,
      preset: () => [[45, 24, 53, 12, 37, 93, 30]],
      explain: {
        goal: "把关键字按二叉排序树的有序性插入到合适位置，使中序序列保持递增。",
        inputs: "一棵二叉排序树（可为空树）与待插入关键字 key；重复关键字按约定跳过或归入右子树。",
        steps: [
          "从根结点开始：若当前树为空（T = NULL），生成含 key 的新结点并作为根返回。",
          "若 key < T->key，说明应插入左子树，递归处理左孩子。",
          "若 key > T->key，说明应插入右子树，递归处理右孩子。",
          "若 key 与当前结点相等，按约定不再重复插入（本演示把相等关键字归入右侧）。",
          "递归到空位置时创建新结点，挂到父结点对应的孩子指针上。",
          "依次插入全部关键字后，中序遍历该树得到的序列必然<b>递增有序</b>。",
          "插入次序不同会得到不同形态的 BST；按有序序列插入会退化成单支树。",
        ],
        keys: [
          "插入的新结点总是成为<b>叶子</b>，不需要移动已有结点。",
          "平均查找长度 O(log n)，最坏（有序插入）退化为 O(n)。",
          "只有中序序列递增的二叉树才是二叉排序树；左子树所有关键字均小于根。",
        ],
        cost: "平均 O(log n) · 最坏 O(n) · 空间 O(h)",
      },
    }),
    defineExperiment({
      id: "avl-rotations",
      chapter: chapter.id,
      title: "AVL 树插入与删除",
      visualizer: "tree",
      tag: "平衡调整",
      difficulty: "进阶",
      code: [
        "// 空树开始：AVL 要求每个结点 |bf| ≤ 1",
        "插入：按二叉排序树比较，新关键字挂为新叶子",
        "沿路径自下而上更新 h 与 bf",
        "if (|bf| == 2) 定位最低失衡结点并判定类型",
        "  LL：对失衡结点右旋一次",
        "  LR：先左旋左孩子，再右旋失衡结点",
        "  RR：对失衡结点左旋一次",
        "  RL：先右旋右孩子，再左旋失衡结点",
        "插入只需修复一次；子树高度恢复，插入结束",
        "删除：从根比较，定位待删结点",
        "  关键字不存在：跳过本次删除",
        "  至多一个孩子：用孩子接替它的位置",
        "  两个孩子：用中序后继顶替，再摘除后继结点",
        "  （后继至多只有右孩子，摘除很简单）",
        "从被摘除位置的双亲开始，自下而上重算 h 与 bf",
        "  出现 |bf| == 2 就按 LL / LR / RR / RL 旋转，继续向上",
        "  与插入不同：删除可能沿路径连续旋转多次",
        "删除结束：全部结点 |bf| ≤ 1",
        "查找：从根逐层比较下降",
        "命中返回该结点，否则返回 NOT_FOUND",
      ],
      generator: A.search.avlTree,
      preset: () => [[70, 60, 50, 80, 100, 10, 40, 30, 20, 90], [60, 70, 90, 50], undefined],
      input: {
        type: "multi",
        label: "实验参数",
        defaultValue: "custom",
        placeholder: "输入参数",
        fields: [
          { name: "values", label: "插入序列（1–12 个互不相同的整数）", defaultValue: "70, 60, 50, 80, 100, 10, 40, 30, 20, 90" },
          { name: "deletes", label: "删除序列（可留空）", defaultValue: "60, 70, 90, 50" },
          { name: "target", label: "查找值（可留空）", defaultValue: "90" },
        ],
        hint: "插入序列中的关键字必须互不相同；删除序列最多 12 个整数，可以包含树中不存在的键（会演示跳过）；查找值可留空。",
        parse(raw) {
          const text = value => String(value === undefined || value === null ? "" : value).trim();
          const tokens = source => text(source).split(/[\s,，]+/).filter(Boolean);
          const whole = token => /^[-+]?\d+$/.test(token) && Math.abs(Number(token)) <= 999;
          const values = tokens(raw && raw.values);
          if (!values.length || values.length > 12 || values.some(token => !whole(token)))
            return { ok: false, message: "请输入 1–12 个 [-999,999] 整数作为插入序列。" };
          const list = values.map(Number);
          if (new Set(list).size !== list.length)
            return { ok: false, message: "AVL 树要求插入序列中的关键字互不相同。" };
          const deletes = tokens(raw && raw.deletes);
          if (deletes.length > 12 || deletes.some(token => !whole(token)))
            return { ok: false, message: "删除序列最多 12 个 [-999,999] 整数，也可以留空。" };
          const query = text(raw && raw.target);
          if (query && !whole(query))
            return { ok: false, message: "查找值必须是 [-999,999] 整数，也可以留空。" };
          return { ok: true, value: { values: list, deletes: deletes.map(Number), target: query ? Number(query) : undefined } };
        },
      },
      inputAdapter: input => [input.values, input.deletes, input.target],
      explain: {
        goal: "在 AVL 树上完成通用插入与删除：插入后修复最低失衡结点，删除后沿路径回溯、可能连续多次旋转，始终让每个结点满足 |bf| ≤ 1。",
        inputs: "插入序列（1–12 个互不相同的整数）、删除序列（可留空）与可选的查找值；结点上方标 h（子树高度）、下方标 bf（平衡因子）。",
        steps: [
          "从空树开始，按插入序列逐个把新关键字作为叶子挂到二叉排序树的位置上，整条比较路径高亮显示。",
          "沿插入路径<b>自下而上</b>更新高度与平衡因子，找出<b>最低失衡结点</b>（|bf| = 2）并框出需要旋转的子树。",
          "判定类型：bf = +2 且左孩子 bf ≥ 0 为 <b>LL</b>；bf = +2 且左孩子 bf < 0 为 <b>LR</b>；bf = −2 且右孩子 bf ≤ 0 为 <b>RR</b>；bf = −2 且右孩子 bf > 0 为 <b>RL</b>。",
          "<b>LL</b> 对失衡结点右旋一次；<b>RR</b> 对失衡结点左旋一次；<b>LR</b> 先对左孩子左旋、再对失衡结点右旋；<b>RL</b> 先对右孩子右旋、再对失衡结点左旋。",
          "插入只需修复<b>最低</b>失衡结点：旋转后该子树高度回到插入前的水平，上层结点自动恢复平衡，因此一次插入最多旋转两次。",
          "删除时先按二叉排序树定位待删结点：至多一个孩子就用孩子接替；有两个孩子则在右子树中一路向左找到<b>中序后继</b>，把后继结点整体提到被删位置，再摘除原后继结点。",
          "从被摘除位置的双亲开始自下而上重算 h 与 bf，遇到 |bf| = 2 就按同样的四类规则旋转，然后继续向上检查。",
          "与插入不同，删除<b>可能沿路径连续多次旋转</b>：默认案例中删除 60（双孩子）一次就触发两次旋转，删除 90（单孩子）触发一次，而删除叶子 50 无需旋转。",
        ],
        keys: [
          "插入与删除共用同一套「自下而上回溯 + 四类旋转」修复；区别在于插入只需修复一次，删除可能沿路径修复多次。",
          "按「较高子树相对失衡结点的位置」判定类型：LL / RR 单旋，LR / RL 双旋（先旋孩子，再旋失衡结点）。",
          "旋转只调整局部指针，不改变中序遍历序列，因此旋转后仍然是一棵有序的二叉排序树。",
          "删除用中序后继（右子树最小结点）顶替：后继至多只有右孩子，摘除它不会产生新的双孩子问题。",
          "结点高度与平衡因子是旋转后重新标注的，不是预先写死的：每一步都可以从 h 与 bf 验证旋转结果。",
        ],
        cost: "查找 O(log n) · 插入 O(log n) · 删除 O(log n)（每次旋转 O(1)，删除最坏 O(log n) 次旋转） · 空间 O(1)",
      },
    }),
    defineExperiment({
      id: "hash-chaining",
      chapter: chapter.id,
      title: "散列表冲突处理",
      visualizer: "hash",
      tag: "链地址法",
      difficulty: "基础",
      code: [
        "void InsertHash(HashTable &H, Key key) {",
        "  int index = key % H.size;",
        "  // 计算散列地址",
        "  if (H.bucket[index] != NULL)",
        "    // 发生冲突，使用链地址法",
        "    append(H.bucket[index], key);",
        "  else H.bucket[index] = new Node(key);",
        "  H.count++;",
        "}",
      ],
      generator: A.search.hashDemo,
      preset: () => [[19, 14, 23, 1, 68, 20, 56, 33, 12], 7],
      explain: {
        goal: "用散列函数定位桶，并把散列地址相同的冲突关键字串成链表，完成插入与查找。",
        inputs: "表长（桶数）m 与一组关键字；散列函数取 H(key) = key mod m，冲突用链地址法处理。示例为 9 个关键字、7 个桶，其中 5 个关键字发生冲突。",
        steps: [
          "建立长度为 m 的散列表：每个地址对应一个桶，初始均为空链表。",
          "对每个待插入关键字 key，计算散列地址 index = key mod m。",
          "若该桶为空，直接以 key 生成结点放入桶中。",
          "若该桶非空，说明发生<b>冲突</b>，把 key 追加到该桶的冲突链表中。",
          "每插入一个关键字，元素个数 count 加 1，装填因子 α = count / m 随之增大。",
          "查找关键字时先算散列地址，再沿该桶的链表逐个比较；插入前也应先查重。",
          "全部关键字插入完毕后，各桶的链表长度反映该地址下的冲突规模；本示例桶 5 形成较长同义词链。",
        ],
        keys: [
          "装填因子 α = n / m（元素数 / 表长），α 越大冲突越多、平均查找长度越长。",
          "链地址法查找成功比较次数约 1 + α/2，失败约 α；最坏全部同义词同桶，退化为 O(n)。",
          "同义词按插入次序挂在链表上，新结点可头插也可尾插；链地址法删除方便、无需探测。",
        ],
        cost: "平均 O(1+α) · 最坏 O(n) · 空间 O(n+m)",
      },
    }),
  ];
  return { chapter, experiments };
});
