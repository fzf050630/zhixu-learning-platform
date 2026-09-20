(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    root.DS.Algorithms,
    node ? require("../experiment.js") : root.DS.Experiments,
  );
  if (node) module.exports = api;
  root.DS.ChapterModules = root.DS.ChapterModules || {};
  root.DS.ChapterModules["linear"] = api;
})(globalThis, function (A, helpers) {
  "use strict";
  const { defineExperiment } = helpers;
  const chapter = {
    id: "linear",
    no: "01",
    title: "线性表",
    subtitle: "位移与指针",
  };
  const experiments = [
    defineExperiment({
      id: "sequence-insert",
      chapter: chapter.id,
      title: "顺序表插入",
      visualizer: "array",
      tag: "元素后移",
      difficulty: "基础",
      code: [
        "bool ListInsert(SqList &L, int i, ElemType e) {",
        "  if (i < 1 || i > L.length + 1) return false;",
        "  for (int j = L.length; j >= i; j--)",
        "    L.data[j] = L.data[j - 1];",
        "  L.data[i - 1] = e;",
        "  L.length++;",
        "  return true;",
        "}",
      ],
      generator: A.linear.sequenceInsert,
      preset: () => [[12, 28, 41, 56, 65, 73, 89, 97, null], 3, 50],
      explain: {
        goal: "在顺序表第 i 个位置插入新元素，保持其余元素的相对次序并使表长加 1。",
        inputs: "顺序表 L（data 数组与 length）、插入位置 i（1 ≤ i ≤ length+1）和待插入元素 e；表中需留有空位。示例为 8 个元素、在第 4 个位置插入，需要后移 5 个元素。",
        steps: [
          "先判断位置合法性：若 i < 1 或 i > length+1，则插入越界，返回 false；本例 i=4、length=8，位置合法。",
          "令 j 从表长 length 递减到 i，把 L.data[j−1] 依次后移到 L.data[j]，从后向前腾出第 i 个位置。",
          "本示例共后移 5 个元素（a[7]…a[3]），越靠表头的插入移动次数越多。",
          "把新元素 e 写入 L.data[i−1]，即第 i 个位置。",
          "将表长 L.length 加 1，新元素正式纳入表中。",
          "返回 true，插入完成；空表时只允许 i = 1（插在表尾）。",
          "核对特例：插入表尾（i = length+1）不发生移动，插入表头要后移全部 n 个元素。",
        ],
        keys: [
          "位置按 1 开始计数；后移必须从表尾向前处理，否则会覆盖尚未移动的元素。",
          "平均后移约 n/2 个元素，表头插入最坏移动 n 个：时间 O(n)、空间 O(1)。",
          "顺序表插入靠<b>后移</b>保持逻辑次序，不能用交换元素代替。",
        ],
        cost: "平均 O(n) · 最坏 O(n) · 空间 O(1)",
      },
    }),
    defineExperiment({
      id: "linked-reverse",
      chapter: chapter.id,
      title: "单链表逆置",
      visualizer: "linked",
      tag: "指针翻转",
      difficulty: "基础",
      code: [
        "LNode *Reverse(LNode *head) {",
        "  LNode *pre = NULL, *p = head;",
        "  while (p != NULL) {",
        "    LNode *next = p->next;",
        "    p->next = pre;",
        "    pre = p; p = next;",
        "  }",
        "  return pre;",
        "}",
      ],
      generator: A.linear.linkedReverse,
      preset: () => [[8, 17, 26, 39, 52, 67]],
      explain: {
        goal: "就地翻转单链表所有结点的指针方向，使原尾结点成为新首结点。",
        inputs: "带首指针 head 的单链表（可不带头结点）；示例为 6 个结点，空表与单元素表也要能正确返回。",
        steps: [
          "初始化 pre = NULL、p = head，pre 指向已逆置段的头结点。",
          "若 p = NULL（空表），循环体不执行，直接返回 NULL（或原头指针）。",
          "保存 next = p->next，先把后继结点的地址记下来。",
          "令 p->next = pre，把当前结点接到已逆置段的最前面。",
          "令 pre = p、p = next，两个工作指针整体后移一步。",
          "重复第 3～5 步，直到 p = NULL，此时 pre 指向原链表尾结点，即新首结点。",
          "返回 pre 作为新头指针；原首结点的 next 已置为 NULL，成为新表尾。",
        ],
        keys: [
          "必须先用 next 保存后继，再改写 p->next，否则会断链丢失后半部分。",
          "全程只改指针不搬数据：时间 O(n)、空间 O(1)；用头插法重建链表同样 O(n)。",
          "空表返回 NULL；只有一个结点时逆置后仍指向该结点。",
        ],
        cost: "时间 O(n) · 空间 O(1)",
      },
    }),
  ];
  return { chapter, experiments };
});
