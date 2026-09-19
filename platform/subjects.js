(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  P.root = new URL('../', document.currentScript.src);
  P.name = '知序';
  P.subjects = [
    { id: 'data-structures', title: '数据结构', short: '数据结构', group: '408', code: 'DS', status: 'ready', path: '数据结构可视化/index.html', home: '#/', description: '让算法的每一步，都看得见。', detail: '从线性表到图与排序，观察状态、播放步骤，对照 C 语言伪代码。' },
    { id: 'computer-organization', title: '计算机组成原理', short: '组成原理', group: '408', code: 'CO', status: 'ready', path: '计算机组成原理可视化/index.html', home: '#overview', description: '理解计算机如何执行一条指令。', detail: '从数据表示到存储系统，从指令系统到数据通路与流水线，观察每一步的位与信号。' },
    { id: 'operating-systems', title: '操作系统', short: '操作系统', group: '408', code: 'OS', status: 'ready', path: '操作系统可视化/index.html', home: '#overview', description: '从进程到内存，看见资源的调度。', detail: '进程与调度、同步与死锁、内存管理与页面置换、文件系统与 I/O 管理。' },
    { id: 'computer-networks', title: '计算机网络', short: '计算机网络', group: '408', code: 'CN', status: 'ready', path: '计算机网络可视化/index.html', home: '#overview', description: '跟随数据，理解网络中的每次传递。', detail: '从体系结构到应用层，看分组如何被封装、编址、转发与可靠送达。' },
    { id: 'calculus', title: '高等数学', short: '高等数学', group: 'math', code: 'CA', status: 'ready', path: '高等数学可视化/index.html', home: '#overview', description: '用图形理解变化、极限与累积。', detail: '函数极限、一元微积分、空间几何、多元微积分、级数与微分方程，八章全覆盖。' },
    { id: 'linear-algebra', title: '线性代数', short: '线性代数', group: 'math', code: 'LA', status: 'ready', path: '线性代数可视化/index.html', home: '#overview', description: '在空间中理解向量与线性变换。', detail: '行列式、矩阵、向量、方程组、特征值与二次型，用可交互矩阵看懂线性结构。' },
    { id: 'probability', title: '概率论与数理统计', short: '概率统计', group: 'math', code: 'PR', status: 'ready', path: '概率论可视化/index.html', home: '#overview', description: '在不确定之中，发现规律。', detail: '从随机事件到假设检验，连接概念、公式、交互图示与例题。' },
  ];
  P.subject = id => P.subjects.find(subject => subject.id === id);
  P.url = (id, hash) => {
    const subject = P.subject(id);
    if (!subject || subject.status !== 'ready') return null;
    const url = new URL(subject.path, P.root);
    url.hash = hash || subject.home;
    return url.href;
  };
})(window);
