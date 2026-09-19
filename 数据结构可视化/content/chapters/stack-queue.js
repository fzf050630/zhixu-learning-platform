(function (root, factory) {
  const node = typeof module === "object" && module.exports;
  const api = factory(
    root.DS.Algorithms,
    node ? require("../experiment.js") : root.DS.Experiments,
  );
  if (node) module.exports = api;
  root.DS.ChapterModules = root.DS.ChapterModules || {};
  root.DS.ChapterModules["stack-queue"] = api;
})(globalThis, function (A, helpers) {
  "use strict";
  const { defineExperiment } = helpers;
  const chapter = {
    id: "stack-queue",
    no: "02",
    title: "栈与队列",
    subtitle: "受限操作与循环空间",
  };
  const experiments = [
    defineExperiment({
      id: "stack-demo",
      chapter: chapter.id,
      title: "栈：入栈与出栈",
      visualizer: "stack",
      tag: "LIFO",
      difficulty: "基础",
      code: [
        "void Demo(SqStack &S) {",
        "  Peek: if (top >= 0) read(data[top]);",
        "  Push(x): if (top < capacity-1) data[++top] = x;",
        "  // top++，写入元素",
        "  Pop: if (top >= 0) x = data[top--];",
        "  // 读出元素，top--",
        "  // 空栈 top=-1；满栈 top=capacity-1",
        "}",
      ],
      generator: A.stackQueue.stackDemo,
      preset: () => [
        [14, 27],
        [39, 'peek', 52, 65, 78, 90, 'pop', 'pop', 'pop', 'pop', 'pop', 'pop', 'pop', 21],
      ],
      explain: {
        goal: "演示顺序栈的入栈、出栈与读栈顶，说明后进先出规则以及上溢、下溢的处理。",
        inputs: "容量为 capacity 的顺序栈（data 数组与栈顶指针 top），以及一串 push / pop / peek 操作；初始元素数不能超过容量。",
        steps: [
          "初始化空栈：top = −1，栈底下标为 0，top 始终指向栈顶元素。",
          "处理读栈顶操作：若 top ≥ 0 直接读取 data[top]，栈顶指针保持不变；空栈则无栈顶可读。",
          "处理入栈操作时先判满：若 top = capacity−1，拒绝入栈，发生<b>上溢</b>。",
          "未满则先把 top 加 1，再令 data[top] = x，完成入栈。",
          "处理出栈操作时先判空：若 top = −1，拒绝出栈，发生<b>下溢</b>。",
          "非空则先读出 data[top]，再把 top 减 1，完成出栈。",
          "重复执行各操作，栈内元素始终保持后进先出的次序。",
        ],
        keys: [
          "栈是后进先出（LIFO）的受限线性表，只允许在<b>栈顶</b>插入和删除。",
          "入栈是「先移指针再写元素」，出栈是「先取元素再移指针」，顺序不能颠倒。",
          "上溢是栈满仍入栈、下溢是栈空仍出栈，操作前必须先判满、判空。",
        ],
        cost: "单次操作 O(1) · 空间 O(capacity)",
      },
    }),
    defineExperiment({
      id: "circular-queue",
      chapter: chapter.id,
      title: "循环队列",
      visualizer: "queue",
      tag: "指针取模",
      difficulty: "基础",
      code: [
        "void Demo(SqQueue &Q) {",
        "  // front 指向队头；rear 指向下一写入槽",
        "  if ((rear+1)%capacity != front) enqueue(x);",
        "  Q.rear = (Q.rear + 1) % MaxSize;",
        "  Peek: if (front != rear) read(data[front]);",
        "  if (front != rear) dequeue(x);",
        "  Q.front = (Q.front + 1) % MaxSize;",
        "}",
      ],
      generator: A.stackQueue.circularQueueDemo,
      preset: () => [5, [11, 22, 33], ['peek', 44, 55, 'dequeue', 55, 'dequeue', 66, 'dequeue', 'dequeue', 'dequeue', 'dequeue', 'dequeue', 77]],
      explain: {
        goal: "用取模运算让队尾与队头首尾相接，在固定容量内循环复用空间，并按约定区分队空与队满。",
        inputs: "容量为 capacity 的循环队列（data 数组、front 与 rear 指针），capacity ≥ 2 且保留一个空槽；以及一串入队、出队、读队头操作。",
        steps: [
          "初始化 front = rear = 0：front 指向队头元素，rear 指向下一个可写入的空槽。",
          "入队前判满：若 (rear+1) % capacity == front，说明只剩一个空槽，拒绝入队。",
          "未满则把 x 写入 data[rear]，再令 rear = (rear+1) % capacity。",
          "读队头时判空：若 front == rear，则队列为空，没有队头元素。",
          "非空则读取 data[front]，front 指针保持不动。",
          "出队前同样以 front == rear 判空；非空时取出 data[front]，再令 front = (front+1) % capacity。",
          "重复入队与出队，front、rear 在 0…capacity−1 之间循环移动，空出的槽位可被再次使用。",
        ],
        keys: [
          "牺牲一个存储单元区分空满：队空 front == rear，队满 (rear+1)%capacity == front。",
          "元素个数 = (rear − front + capacity) % capacity；capacity = 5 时最多存放 4 个元素。",
          "指针每次移动都要<b>对容量取模</b>，不能在 0…capacity 之间线性自增。",
        ],
        cost: "单次操作 O(1) · 空间 O(capacity)",
      },
    }),
  ];
  return { chapter, experiments };
});
