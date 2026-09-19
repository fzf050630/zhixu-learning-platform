(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    root.DS.Algorithms,
    node ? require("../experiment.js") : root.DS.Experiments,
    node
      ? require("../../assets/js/core/input-validation.js")
      : root.DS.InputValidation,
  );
  if (node) module.exports = api;
  root.DS.ChapterModules = root.DS.ChapterModules || {};
  root.DS.ChapterModules["sort"] = api;
})(globalThis, function (A, helpers, inputValidation) {
  "use strict";
  const { defineExperiment } = helpers;
  const { parseIntegerArray } = inputValidation;
  const integerArrayInput = {
    type: "integer-array",
    label: "待排序数组",
    placeholder: "例如：49, 38, 65, 12",
    defaultValue: "49, 38, 65, 12, 27, 81, 55",
    parse: parseIntegerArray,
  };
  const integerArrayAdapter = (values) => [[...values]];
  const chapter = {
    id: "sort",
    no: "06",
    title: "排序",
    subtitle: "划分、堆化与归位",
  };
  const experiments = [
    defineExperiment({
      id: "quick-sort",
      chapter: chapter.id,
      title: "快速排序",
      visualizer: "array",
      tag: "枢轴划分",
      difficulty: "基础",
      input: integerArrayInput,
      inputAdapter: integerArrayAdapter,
      code: [
        "void QuickSort(int A[], int low, int high) {",
        "  if (low >= high) return;",
        "  int pivot = A[low], i = low, j = high;",
        "  while (i < j) {",
        "    while (i < j && A[j] >= pivot) j--;",
        "    A[i++] = A[j];",
        "    // 左侧空位已填充",
        "    while (i < j && A[i] <= pivot) i++;",
        "    A[j--] = A[i];",
        "  }",
        "  A[i] = pivot;",
        "  QuickSort(A, low, i-1); QuickSort(A, i+1, high);",
        "}",
      ],
      generator: A.sort.quickSort,
      preset: () => [[49, 38, 65, 12, 27, 81, 55]],
      explain: {
        goal: "把序列按枢轴划分成左小右大的两个子区间，再对子区间递归划分，最终使整体有序。",
        inputs: "待排序数组 A[0…n−1]；本演示取区间首元素为枢轴。",
        steps: [
          "若当前区间长度 ≤ 1，说明已有序，直接返回。",
          "取区间第一个元素作为<b>枢轴 pivot</b> 并暂存，空出左侧位置。",
          "右指针 j 从右向左扫描，找到第一个小于 pivot 的元素，填入左侧空位。",
          "左指针 i 从左向右扫描，找到第一个大于 pivot 的元素，填入右侧空位。",
          "重复上述“右找小、左找大”的过程，直到 i 与 j 相遇，把 pivot 放入相遇位置。",
          "此时枢轴已归位（左小右大），对左右两个子区间分别递归执行同样过程。",
        ],
        keys: [
          "每轮划分都会把枢轴放到最终位置，因此只需递归左右两侧，无需再动枢轴。",
          "平均时间 O(n log n)；当序列基本有序且固定取首元素为枢轴时退化为 O(n²)。",
          "快速排序<b>不稳定</b>，递归深度最坏为 O(n)，可用栈或尾递归优化。",
        ],
        cost: "平均 O(n log n) · 最坏 O(n²) · 空间 O(log n)",
      },
    }),
    defineExperiment({
      id: "heap-sort",
      chapter: chapter.id,
      title: "堆排序",
      visualizer: "array",
      tag: "建堆筛选",
      difficulty: "基础",
      input: integerArrayInput,
      inputAdapter: integerArrayAdapter,
      code: [
        "void HeapSort(int A[], int n) {",
        "  // 从最后一个非叶结点建堆",
        "  for (i=n/2-1; i>=0; i--) HeadAdjust(A,i,n);",
        "  // HeadAdjust 向下筛选",
        "  if (A[child] > A[root])",
        "    swap(A[root], A[child]);",
        "  // 大根堆完成",
        "  for (i=n-1; i>0; i--) {",
        "    swap(A[0], A[i]);",
        "    HeadAdjust(A, 0, i);",
        "  }",
        "}",
      ],
      generator: A.sort.heapSort,
      preset: () => [[49, 38, 65, 12, 27, 81, 55]],
      explain: {
        goal: "把序列看作完全二叉树建成大根堆，再反复把堆顶（最大值）换到末尾并重建堆，使整体有序。",
        inputs: "待排序数组 A[0…n−1]；本演示以 49, 38, 65, 12, 27, 81, 55 为例。",
        steps: [
          "把数组按层序看作完全二叉树，从最后一个非叶结点 ⌊n/2⌋−1 开始，依次向前对每个结点向下筛选。",
          "向下筛选：比较当前结点与其左右孩子中的较大者，若孩子更大则交换，并沿被交换的孩子继续下沉。",
          "重复筛选直到当前结点不小于其孩子或到达叶结点，建堆完成后堆顶 A[0] 为全局最大值。",
          "把堆顶 A[0] 与当前末尾元素 A[i] 交换，最大值归位到最终位置。",
          "把剩余的前 i 个元素视为新堆，对堆顶 A[0] 重新向下筛选，恢复<b>大根堆</b>性质。",
          "重复「交换堆顶与末尾、调整剩余堆」，每趟确定一个当前最大值。",
          "当 i 减到 1 时结束，数组按非递减有序。",
        ],
        keys: [
          "建堆必须从最后一个非叶结点 ⌊n/2⌋−1 向前进行，自底向上可在 O(n) 内完成；从根开始会退化。",
          "升序排序用大根堆：每次把堆顶（最大）换到末尾；降序排序用小根堆。",
          "堆排序<b>不稳定</b>；时间恒为 O(n log n)，空间 O(1)，适合 n 很大且要求最坏有保障的场景。",
        ],
        cost: "平均 O(n log n) · 最坏 O(n log n) · 空间 O(1)",
      },
    }),
    defineExperiment({
      id: "insertion-sort",
      chapter: chapter.id,
      title: "直接插入排序",
      visualizer: "array",
      tag: "有序区插入",
      difficulty: "基础",
      input: integerArrayInput,
      inputAdapter: integerArrayAdapter,
      code: [
        "void InsertSort(int A[], int n) {",
        "  for (int i=1; i<n; i++) {",
        "    int key = A[i];",
        "    int j = i-1;",
        "    while (j>=0 && A[j]>key) {",
        "      A[j+1] = A[j]; j--;",
        "    }",
        "    A[j+1] = key;",
        "  }",
      ],
      generator: A.sort.insertionSort,
      preset: () => [[49, 38, 65, 12, 27, 81, 55]],
      explain: {
        goal: "把数组分为有序区和无序区，依次把无序区首元素插入有序区的正确位置，最终使整个序列有序。",
        inputs: "待排序数组 A[0…n−1]；A[0] 初始视为只含一个元素的有序区。",
        steps: [
          "把 A[0] 视为初始有序区，令 i 从 1 开始，依次取出 A[i] 作为待插入元素。",
          "暂存 key=A[i]，令 j=i−1，从有序区末尾向前查找插入位置。",
          "若 A[j] 大于 key，则把 A[j] 后移一位到 A[j+1]，并令 j 自减继续向前比较。",
          "当 j 减到 0 以下或 A[j] 不大于 key 时停止，插入位置即为 j+1。",
          "把暂存的 key 写入 A[j+1]，有序区扩大一位。",
          "i 自增 1，重复取数、后移、插入，直到 i=n。",
          "全部元素处理完毕，数组非递减有序。",
        ],
        keys: [
          "比较条件写成 A[j] 大于 key 而非不小于，相等元素保持原有相对次序，排序稳定。",
          "最好情况（序列已有序）比较 n−1 次、不需移动，时间 O(n)；最坏（逆序）时间 O(n²)。",
          "平均比较与移动次数均约为 n²/4，适合 n 较小或基本有序的表；空间 O(1)。",
        ],
        cost: "平均 O(n²) · 最坏 O(n²) · 最好 O(n) · 空间 O(1)",
      },
    }),
    defineExperiment({
      id: "merge-sort",
      chapter: chapter.id,
      title: "归并排序",
      visualizer: "array",
      tag: "分治合并",
      difficulty: "基础",
      input: integerArrayInput,
      inputAdapter: integerArrayAdapter,
      code: [
        "void MergeSort(int A[], int low, int high) {",
        "  if (low >= high) return;",
        "  int mid = (low + high) / 2;",
        "  MergeSort(A, low, mid);",
        "  // 合并两个有序子区间",
        "  MergeSort(A, mid+1, high);",
        "  Merge(A, low, mid, high);",
        "  // 写回原数组",
        "}",
      ],
      generator: A.sort.mergeSort,
      preset: () => [[49, 38, 65, 12, 27, 81, 55]],
      explain: {
        goal: "采用分治法把序列不断二分，再自底向上两两合并有序子区间，最终得到整体有序序列。",
        inputs: "待排序数组 A[0…n−1] 及待归并区间 [low, high]；本演示从整个区间开始递归。",
        steps: [
          "若区间内只有一个元素（low 不小于 high），则该区间天然有序，直接返回。",
          "取中点 mid=⌊(low+high)/2⌋，把区间划分为左半 [low, mid] 与右半 [mid+1, high]。",
          "递归地对左半区间进行同样的二分与归并。",
          "递归地对右半区间进行同样的二分与归并。",
          "合并：用双指针分别指向左右两段首元素，反复取较小者写入辅助数组。",
          "当其中一段取完后，把另一段的剩余元素按序整体复制到辅助数组末尾。",
          "把辅助数组中的有序结果写回 A[low…high]，逐层返回后整个数组有序。",
        ],
        keys: [
          "合并两段时用「小于等于取左段」可保证归并排序<b>稳定</b>。",
          "递归深度为 ⌈log₂n⌉，每层归并总代价 O(n)，因此最好、最坏、平均均为 O(n log n)。",
          "需要 O(n) 辅助数组；二路归并的合并次数与初始序列无关。",
        ],
        cost: "平均 O(n log n) · 最坏 O(n log n) · 空间 O(n)",
      },
    }),
  ];
  return { chapter, experiments };
});
