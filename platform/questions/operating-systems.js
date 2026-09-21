/* 知序 · 操作系统自测题库（原创“真题风格”题，覆盖全部 5 章） */
(function (global) {
  'use strict';
  Object.assign(global.ZhixuQuestions = global.ZhixuQuestions || {}, {
    'operating-systems:ch1-s1': [
      { id: 'os-intro-1', type: 'judge', stem: '操作系统是管理计算机硬件与软件资源、并为用户和应用程序提供服务的系统软件。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '操作系统的核心职责是资源管理（处理机、存储器、设备、文件）与提供用户接口。' },
    ],
    'operating-systems:ch1-s3': [
      { id: 'os-env-1', type: 'single', stem: '下列哪一项不会导致处理机从用户态切换到核心态？', options: { A: '普通算术运算', B: '系统调用', C: '外部中断', D: '缺页异常' }, answer: 'A', explanation: '用户态到核心态的切换由中断、异常（如缺页）和系统调用触发；普通算术运算在用户态完成。' },
    ],
    'operating-systems:ch2-s1': [
      { id: 'os-proc-1', type: 'single', stem: '关于进程与线程，下列说法正确的是？', options: { A: '线程是处理机调度的基本单位，进程是资源分配的基本单位', B: '线程拥有独立的地址空间', C: '同一进程内的线程不能共享数据', D: '进程切换比线程切换开销更小' }, answer: 'A', explanation: '引入线程后，进程作为资源分配单位，线程作为调度与执行单位；同进程内线程共享地址空间。' },
    ],
    'operating-systems:ch2-s2': [
      { id: 'os-sched-1', type: 'single', stem: '在非抢占式调度下，使平均等待时间最短的调度算法通常是？', options: { A: '短作业优先（SJF）', B: '先来先服务（FCFS）', C: '时间片轮转（RR）', D: '优先级调度（数值越大越先）' }, answer: 'A', explanation: '非抢占式下短作业优先可证明平均等待时间最短，但可能导致长作业饥饿。' },
      { id: 'os-sched-2', type: 'single', stem: '时间片轮转调度算法最适合下列哪类系统？', options: { A: '分时系统', B: '批处理系统', C: '实时硬实时系统', D: '单道批处理' }, answer: 'A', explanation: '时间片轮转让每个就绪进程轮流获得 CPU，响应及时，适合分时交互场景。' },
    ],
    'operating-systems:ch2-s3': [
      { id: 'os-sync-1', type: 'single', stem: '用信号量实现互斥时，临界区应放在哪两个操作之间？', options: { A: 'P（wait）与 V（signal）之间', B: '两个 P 之间', C: '两个 V 之间', D: 'V 与 P 之间' }, answer: 'A', explanation: '进入临界区前 P(mutex) 申请，退出后 V(mutex) 释放，保证同一时刻只有一个进程在临界区内。' },
      { id: 'os-sync-2', type: 'judge', stem: '临界区是指进程中访问临界资源的那段代码。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '临界资源是一次仅允许一个进程使用的资源，访问它的代码段称为临界区。' },
    ],
    'operating-systems:ch2-s4': [
      { id: 'os-dead-1', type: 'single', stem: '产生死锁的四个必要条件不包括下列哪一项？', options: { A: '资源可抢占', B: '互斥条件', C: '请求并保持', D: '循环等待' }, answer: 'A', explanation: '四个必要条件是互斥、请求并保持、不可剥夺和循环等待；「资源可抢占」恰好破坏不可剥夺条件。' },
      { id: 'os-dead-2', type: 'single', stem: '银行家算法属于死锁处理策略中的哪一种？', options: { A: '死锁避免', B: '死锁预防', C: '死锁检测', D: '死锁解除' }, answer: 'A', explanation: '银行家算法在分配前判断系统是否仍处于安全状态，属于死锁避免。' },
    ],
    'operating-systems:ch3-s1': [
      { id: 'os-mem-1', type: 'single', stem: '关于分页与分段，下列说法正确的是？', options: { A: '页是物理划分、大小固定，段是逻辑划分、长度可变', B: '页是逻辑划分、长度可变', C: '段的大小固定且与页相同', D: '两者都按物理等分' }, answer: 'A', explanation: '分页从物理角度等分、对用户透明；分段按逻辑单位划分、长度可变、便于共享与保护。' },
    ],
    'operating-systems:ch3-s2': [
      { id: 'os-page-1', type: 'single', stem: '关于页面置换算法，下列哪项说法正确？', options: { A: 'FIFO 可能出现 Belady 异常，LRU 不会', B: 'LRU 可能出现 Belady 异常', C: 'OPT 一定比 LRU 命中率低', D: 'FIFO 属于栈式算法' }, answer: 'A', explanation: 'FIFO 不满足栈式算法性质，增加物理块数命中率可能下降（Belady 异常）；LRU 是栈式算法，不会出现。' },
      { id: 'os-page-2', type: 'single', stem: '系统出现“抖动”（thrashing）的主要原因是？', options: { A: '多道程序度过高，进程频繁缺页', B: '磁盘容量不足', C: 'CPU 主频过低', D: '文件系统损坏' }, answer: 'A', explanation: '并发进程过多导致物理块不足，缺页率急剧上升、CPU 大量时间用于换页，即抖动；应降低多道程序度。' },
    ],
    'operating-systems:ch4-s1': [
      { id: 'os-file-1', type: 'single', stem: '文件的物理结构（外存分配方式）不包括下列哪一种？', options: { A: '索引顺序结构', B: '连续分配', C: '链接分配', D: '索引分配' }, answer: 'A', explanation: '常见的文件物理结构有连续、链接、索引分配；索引顺序是逻辑结构（查找方式）而非外存分配方式。' },
    ],
    'operating-systems:ch4-s2': [
      { id: 'os-dir-1', type: 'single', stem: '采用索引结点（inode）后，目录项通常只保存？', options: { A: '文件名与指向索引结点的指针', B: '文件的全部属性', C: '文件内容', D: '文件占用的所有磁盘块' }, answer: 'A', explanation: '把文件描述信息集中到索引结点，目录项只需保存文件名和 inode 号，可显著减少目录检索时的磁盘 I/O。' },
    ],
    'operating-systems:ch4-s3': [
      { id: 'os-fsimpl-1', type: 'single', stem: '链接分配方式的主要缺点是？', options: { A: '只能顺序访问，且指针占用额外空间', B: '不能动态增长', C: '外部碎片严重', D: '不支持随机访问但空间利用率最低' }, answer: 'A', explanation: '隐式链接只能从头顺序查找，不支持高效随机访问，指针也占空间；可用 FAT 把指针集中改善。' },
    ],
    'operating-systems:ch5-s1': [
      { id: 'os-io-1', type: 'single', stem: 'I/O 软件的层次结构中，直接与硬件打交道的是？', options: { A: '设备驱动程序', B: '设备独立性软件', C: '用户层 I/O 软件', D: '文件系统' }, answer: 'A', explanation: '设备驱动程序负责把上层请求转换为具体设备能识别的命令并操作硬件；上层为设备独立性软件与用户层。' },
    ],
    'operating-systems:ch5-s2': [
      { id: 'os-buf-1', type: 'single', stem: '引入缓冲技术的主要目的是？', options: { A: '缓和 CPU 与 I/O 设备速度不匹配的矛盾', B: '增大磁盘容量', C: '提高 CPU 主频', D: '减少文件数量' }, answer: 'A', explanation: '缓冲可缓解速度差异、减少中断频率、提高 CPU 与设备并行度。' },
    ],
    'operating-systems:ch5-s3': [
      { id: 'os-disk-1', type: 'single', stem: '磁盘调度中，SCAN（电梯）算法的主要特点是？', options: { A: '磁头沿一个方向移动到底再反向，沿途服务请求', B: '总是服务距当前磁头最近的请求', C: '按请求到达先后顺序服务', D: '随机选择请求服务' }, answer: 'A', explanation: 'SCAN 像电梯一样单向扫到底再折返，避免磁头频繁反向；总是找最近的是 SSTF，可能使远端请求饥饿。' },
      { id: 'os-disk-2', type: 'single', stem: '最短寻道时间优先（SSTF）算法可能导致的问题是？', options: { A: '远端磁道请求长期得不到服务（饥饿）', B: '磁头频繁反向导致性能极差', C: '无法处理读请求', D: '磁盘容量下降' }, answer: 'A', explanation: 'SSTF 总选最近的请求，新到达的近距离请求会不断插队，使远离磁头的请求饥饿。' },
    ],
  });
})(window);
