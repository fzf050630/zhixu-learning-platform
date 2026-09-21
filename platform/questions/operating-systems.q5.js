/* 知序 · 操作系统补充题目（把每个小节补足到 5 题） */
(function (global) {
  'use strict';
  const bank = global.ZhixuQuestions = global.ZhixuQuestions || {};
  const add = (nodeId, questions) => { bank[nodeId] = (bank[nodeId] || []).concat(questions); };

  add('operating-systems:ch1-s1', [
    { id: 'os-intro-2', type: 'single', stem: '操作系统的主要管理功能不包括下列哪一项？', options: { A: '编译高级语言程序', B: '处理机管理', C: '存储管理', D: '文件管理' }, answer: 'A', explanation: '操作系统负责处理机、存储器、设备和文件管理；编译程序属于语言处理软件。' },
    { id: 'os-intro-3', type: 'single', stem: '操作系统的基本特征通常包括？', options: { A: '并发、共享、虚拟、异步', B: '编译、链接、装载、运行', C: '读、写、执行、删除', D: '输入、输出、存储、显示' }, answer: 'A', explanation: '现代操作系统的基本特征是并发、共享、虚拟和异步。' },
    { id: 'os-intro-4', type: 'judge', stem: '并发与并行不同，单核处理器上多个进程也能并发执行。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '并发是宏观同时、微观交替；并行要求多个处理单元真正同时执行。' },
    { id: 'os-intro-5', type: 'single', stem: '操作系统向用户提供的接口主要包括？', options: { A: '命令接口与程序接口（系统调用）', B: '编译接口与调试接口', C: '网络接口与数据库接口', D: '图形接口与打印接口' }, answer: 'A', explanation: '命令接口供交互使用，程序接口即系统调用供程序请求内核服务。' },
  ]);

  add('operating-systems:ch1-s2', [
    { id: 'os-hist-1', type: 'single', stem: '单道批处理系统的主要缺点是？', options: { A: 'CPU 与 I/O 串行，资源利用率低', B: '不能成批处理', C: '交互性太强', D: '内存太大' }, answer: 'A', explanation: '单道批处理一次只运行一道作业，I/O 时 CPU 空闲，资源利用率低。' },
    { id: 'os-hist-2', type: 'single', stem: '多道批处理系统的主要优点是？', options: { A: '提高资源利用率与吞吐量', B: '交互性强', C: '响应及时', D: '保证实时' }, answer: 'A', explanation: '多道程序并发执行让 CPU 与 I/O 重叠，提高资源利用率和吞吐量，但缺乏交互性。' },
    { id: 'os-hist-3', type: 'single', stem: '分时系统的主要目标是？', options: { A: '及时响应用户请求，提供良好交互性', B: '保证硬实时', C: '最大化吞吐量', D: '支持批处理' }, answer: 'A', explanation: '分时系统把 CPU 时间切片轮流分给用户，强调及时响应与交互。' },
    { id: 'os-hist-4', type: 'single', stem: '实时操作系统最强调的两个特性是？', options: { A: '及时性与可靠性', B: '吞吐量与公平性', C: '交互性与虚拟性', D: '并发与共享' }, answer: 'A', explanation: '实时系统必须在规定时限内响应，且要求高可靠性；分硬实时与软实时。' },
    { id: 'os-hist-5', type: 'judge', stem: '网络操作系统与分布式操作系统是操作系统发展的后续形态。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '在分时、实时之后，出现了网络操作系统和分布式操作系统。' },
  ]);

  add('operating-systems:ch1-s3', [
    { id: 'os-env-2', type: 'single', stem: '下列哪类指令只能在核心态（管态）执行？', options: { A: '特权指令', B: '算术运算指令', C: '访存指令', D: '跳转指令' }, answer: 'A', explanation: '特权指令（如设置时钟、开中断、I/O）只能在核心态执行，用户态执行会陷入异常。' },
    { id: 'os-env-3', type: 'judge', stem: '特权指令不允许在用户态执行。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是保护系统安全的基本机制，特权指令只能由内核执行。' },
    { id: 'os-env-4', type: 'single', stem: '用户程序请求操作系统服务通常通过？', options: { A: '系统调用', B: '直接访问内核数据', C: '修改页表', D: '执行特权指令' }, answer: 'A', explanation: '系统调用是用户程序进入内核请求服务的唯一合法途径，会触发用户态到核心态切换。' },
    { id: 'os-env-5', type: 'judge', stem: '中断和异常都会使 CPU 从用户态切换到核心态。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '中断（外中断）和异常（内中断，如缺页、除零）都会触发态切换，进入内核处理。' },
  ]);

  add('operating-systems:ch1-s4', [
    { id: 'os-struct-1', type: 'single', stem: '微内核结构的主要特点是？', options: { A: '内核只保留最基本功能，其余以服务进程运行在用户态', B: '所有功能都在内核', C: '没有内核', D: '只支持单任务' }, answer: 'A', explanation: '微内核把文件系统、设备驱动等移出内核，提高可靠性与可扩展性，但通信开销大。' },
    { id: 'os-struct-2', type: 'single', stem: '宏内核（单体内核）结构的特点是？', options: { A: '大部分操作系统功能都在内核态实现', B: '功能以服务进程运行', C: '内核最小', D: '不管理硬件' }, answer: 'A', explanation: '宏内核把进程管理、内存管理、文件系统等集中在内核，效率高但耦合度高。' },
    { id: 'os-struct-3', type: 'judge', stem: '分层结构的操作系统便于调试和维护，但可能因层层调用而降低效率。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '分层结构每层只依赖下层，结构清晰易调试，但跨层调用带来额外开销。' },
    { id: 'os-struct-4', type: 'single', stem: '虚拟机技术的核心作用是？', options: { A: '在一台物理机上虚拟出多个可独立运行操作系统的环境', B: '加快 CPU 主频', C: '增大内存', D: '替代操作系统' }, answer: 'A', explanation: '通过虚拟化 CPU、内存、I/O，使多个客户操作系统相互隔离地运行。' },
    { id: 'os-struct-5', type: 'judge', stem: '模块化与微内核结构都旨在提高操作系统的可扩展性。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '两者都强调按需加载/替换模块，便于扩展和维护。' },
  ]);

  add('operating-systems:ch2-s1', [
    { id: 'os-proc-2', type: 'single', stem: '进程实体通常由哪几部分组成？', options: { A: 'PCB、程序段、数据段', B: '栈、堆、队列', C: '页表、段表、TLB', D: '输入、输出、存储' }, answer: 'A', explanation: '进程由进程控制块 PCB、程序段和数据段组成，PCB 是其存在的唯一标志。' },
    { id: 'os-proc-3', type: 'judge', stem: '进程控制块（PCB）是进程存在的唯一标志。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '系统通过 PCB 感知和管理进程，PCB 被回收则进程消亡。' },
    { id: 'os-proc-4', type: 'single', stem: '进程的三种基本状态是？', options: { A: '就绪、运行、阻塞', B: '创建、就绪、终止', C: '运行、挂起、唤醒', D: '新建、运行、撤销' }, answer: 'A', explanation: '三种基本状态为就绪、运行、阻塞；另有创建与终止等辅助状态。' },
    { id: 'os-proc-5', type: 'judge', stem: '同一进程内线程切换的开销小于进程之间的切换开销。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '线程共享地址空间，切换时无需切换页表等资源，开销更小。' },
  ]);

  add('operating-systems:ch2-s2', [
    { id: 'os-sched-3', type: 'single', stem: '衡量调度性能常用的指标不包括？', options: { A: '编译时间', B: '周转时间', C: '带权周转时间', D: '响应时间' }, answer: 'A', explanation: '常用指标有周转时间、带权周转时间、等待时间、响应时间等；编译时间与调度无关。' },
    { id: 'os-sched-4', type: 'judge', stem: '先来先服务（FCFS）调度对短作业不利。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '长作业先到会使后续短作业等待很久，平均周转时间变差。' },
    { id: 'os-sched-5', type: 'single', stem: '多级反馈队列调度的主要优点是？', options: { A: '兼顾短作业、I/O 型作业与长作业的需求', B: '实现最简单', C: '不需要时间片', D: '保证实时' }, answer: 'A', explanation: '多级反馈队列让短作业和交互型进程优先得到响应，长作业在低优先级队列继续运行。' },
  ]);

  add('operating-systems:ch2-s3', [
    { id: 'os-sync-3', type: 'single', stem: '信号量的 P（wait）操作与 V（signal）操作对信号量的影响是？', options: { A: 'P 使信号量减 1，V 使信号量加 1', B: 'P 加 1，V 减 1', C: '两者都加 1', D: '两者都减 1' }, answer: 'A', explanation: 'P 申请资源使信号量减 1，不足则阻塞；V 释放资源使信号量加 1 并唤醒等待者。' },
    { id: 'os-sync-4', type: 'judge', stem: '用于实现互斥的信号量初值通常设为 1。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '互斥信号量初值为 1，表示临界资源一次只允许一个进程进入。' },
    { id: 'os-sync-5', type: 'single', stem: '管程（Monitor）作为一种高级同步机制，其特点是？', options: { A: '把共享变量及操作封装在一起，同一时刻只允许一个进程在管程内', B: '只能用于进程间通信', C: '不需要互斥', D: '只能用于文件系统' }, answer: 'A', explanation: '管程封装共享数据与操作并自动保证互斥，简化了同步程序设计。' },
  ]);

  add('operating-systems:ch2-s4', [
    { id: 'os-dead-3', type: 'single', stem: '死锁预防的基本思路是？', options: { A: '破坏四个必要条件中的至少一个', B: '检测后解除', C: '允许死锁发生', D: '忽略死锁' }, answer: 'A', explanation: '死锁预防通过破坏互斥、请求并保持、不可剥夺或循环等待之一来避免死锁。' },
    { id: 'os-dead-4', type: 'judge', stem: '死锁检测与解除策略允许死锁发生，再通过检测算法发现并处理。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '检测与解除不预防死锁，而是定期检测并在发现后撤销进程或剥夺资源。' },
    { id: 'os-dead-5', type: 'single', stem: '若某时刻系统资源分配图可以完全化简，则说明？', options: { A: '系统无死锁', B: '系统一定死锁', C: '系统处于不安全状态', D: '资源不足' }, answer: 'A', explanation: '资源分配图可完全化简当且仅当系统无死锁。' },
  ]);

  add('operating-systems:ch3-s1', [
    { id: 'os-mem-2', type: 'single', stem: '动态分区分配会产生哪种碎片？', options: { A: '外部碎片', B: '内部碎片', C: '没有碎片', D: '逻辑碎片' }, answer: 'A', explanation: '动态分区在分配与回收后留下许多不连续的小空闲区，即外部碎片，可用紧凑技术缓解。' },
    { id: 'os-mem-3', type: 'judge', stem: '分页存储管理会产生内部碎片。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '作业最后一页通常填不满，页内剩余空间形成内部碎片；页间没有外部碎片。' },
    { id: 'os-mem-4', type: 'single', stem: '分段存储管理的特点是？', options: { A: '按逻辑单位划分，段长可变，便于共享与保护', B: '按固定大小划分', C: '对用户透明', D: '不产生碎片' }, answer: 'A', explanation: '分段按程序逻辑结构划分，段长可变，便于实现共享、保护和动态增长。' },
    { id: 'os-mem-5', type: 'single', stem: '地址重定位分为哪两种？', options: { A: '静态重定位与动态重定位', B: '逻辑重定位与物理重定位', C: '内重定位与外重定位', D: '页重定位与段重定位' }, answer: 'A', explanation: '静态重定位在装入时完成地址转换；动态重定位在运行时由硬件地址变换机构完成。' },
  ]);

  add('operating-systems:ch3-s2', [
    { id: 'os-page-3', type: 'single', stem: '请求分页的页表项通常需要包含哪些额外信息？', options: { A: '状态位、访问位、修改位、外存地址', B: '只有页框号', C: '只有进程号', D: '只有访问权限' }, answer: 'A', explanation: '为支持换入换出，页表项需记录是否在内存、是否被访问/修改以及外存地址。' },
    { id: 'os-page-4', type: 'judge', stem: '缺页中断属于内部异常，会转入核心态处理。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '缺页是执行指令过程中产生的内部异常，由操作系统缺页处理程序调入页面。' },
    { id: 'os-page-5', type: 'single', stem: '虚拟内存技术能够成立的理论基础是？', options: { A: '程序执行的局部性原理', B: '程序的顺序性', C: 'CPU 主频足够高', D: '磁盘容量足够大' }, answer: 'A', explanation: '时间局部性和空间局部性使只需装入部分程序即可高效运行。' },
  ]);

  add('operating-systems:ch4-s1', [
    { id: 'os-file-2', type: 'single', stem: '按逻辑结构，文件可分为？', options: { A: '无结构（流式）文件与有结构（记录式）文件', B: '连续文件与链接文件', C: '索引文件与散列文件', D: '系统文件与用户文件' }, answer: 'A', explanation: '逻辑结构从用户角度看分为流式文件和记录式文件；连续/链接/索引属于物理结构。' },
    { id: 'os-file-3', type: 'judge', stem: '文件的属性（如大小、创建时间、权限）保存在目录项或文件控制块中。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '文件元数据由目录项/FCB（或索引结点）保存，文件内容另行存放。' },
    { id: 'os-file-4', type: 'single', stem: '下列哪一项不是基本的文件操作？', options: { A: '编译文件', B: '创建文件', C: '读写文件', D: '关闭文件' }, answer: 'A', explanation: '基本操作有创建、删除、打开、关闭、读、写、定位；编译属于语言处理。' },
    { id: 'os-file-5', type: 'judge', stem: '文件被打开后，系统会在内存中维护打开文件表记录其状态。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '打开文件表保存文件描述符、读写位置等信息，避免每次操作都检索目录。' },
  ]);

  add('operating-systems:ch4-s2', [
    { id: 'os-dir-2', type: 'single', stem: '常见的目录结构不包括？', options: { A: '索引顺序目录', B: '单级目录', C: '两级目录', D: '树形目录' }, answer: 'A', explanation: '目录结构有单级、两级、树形和无环图目录；索引顺序是文件逻辑结构。' },
    { id: 'os-dir-3', type: 'judge', stem: '树形目录便于分类管理，但不利于文件共享。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '树形目录层次清晰，但不同用户共享同一文件不便，需借助无环图目录与链接。' },
    { id: 'os-dir-4', type: 'single', stem: '关于硬链接，下列说法正确的是？', options: { A: '多个目录项指向同一索引结点，链接计数减为 0 才真正删除', B: '保存的是目标路径', C: '原文件删除后链接立即失效', D: '不能跨文件系统但可跨目录' }, answer: 'A', explanation: '硬链接共享同一 inode，用引用计数管理；不能跨文件系统，一般不指向目录。' },
    { id: 'os-dir-5', type: 'judge', stem: '符号链接（软链接）保存的是目标文件路径，原文件删除后软链接失效。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '软链接是一个独立文件，内容为目标路径，目标不存在时成为悬空链接。' },
  ]);

  add('operating-systems:ch4-s3', [
    { id: 'os-fsimpl-2', type: 'single', stem: '文件控制块（FCB）或索引结点中保存的是？', options: { A: '文件的元数据（属性）', B: '文件内容', C: '磁盘分区表', D: '页表' }, answer: 'A', explanation: 'FCB/索引结点保存文件名、大小、权限、物理地址等元数据，不含文件内容本身。' },
    { id: 'os-fsimpl-3', type: 'judge', stem: '磁盘空闲空间管理方法包括位示图、空闲链表和成组链接法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '位示图用二进制位标记空闲块；空闲链表串联空闲块；成组链接法兼顾两者优点。' },
    { id: 'os-fsimpl-4', type: 'single', stem: '文件系统的层次结构自顶向下通常为？', options: { A: '用户接口→文件目录→物理文件→存取控制', B: '硬件→驱动→用户', C: '页表→段表→目录', D: 'CPU→内存→磁盘' }, answer: 'A', explanation: '文件系统自顶向下为用户接口、文件目录系统、物理文件系统与存取控制等层次。' },
    { id: 'os-fsimpl-5', type: 'judge', stem: '成组链接法适合大型文件系统管理大量空闲块。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '成组链接法把空闲块分组链接，兼顾分配回收效率与空间开销，适合大型系统。' },
  ]);

  add('operating-systems:ch5-s1', [
    { id: 'os-io-2', type: 'single', stem: '按传输特性，I/O 设备可分为？', options: { A: '块设备与字符设备', B: '输入设备与输出设备', C: '高速设备与低速设备', D: '独占设备与共享设备' }, answer: 'A', explanation: '块设备以数据块为单位（如磁盘），字符设备以字符流为单位（如键盘）。' },
    { id: 'os-io-3', type: 'judge', stem: '设备控制器是 CPU 与 I/O 设备之间的接口。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '设备控制器接收 CPU 命令、控制设备工作并反馈状态，是二者之间的桥梁。' },
    { id: 'os-io-4', type: 'single', stem: 'I/O 控制方式的发展顺序大致为？', options: { A: '程序查询→中断→DMA→通道', B: '中断→程序查询→DMA', C: 'DMA→通道→中断', D: '通道→DMA→中断' }, answer: 'A', explanation: '从 CPU 全程参与的程序查询，到中断、DMA，再到通道，CPU 介入越来越少。' },
    { id: 'os-io-5', type: 'judge', stem: '通道是一种专门负责 I/O 控制的处理器。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '通道执行通道程序控制 I/O，独立于 CPU，进一步减轻 CPU 负担。' },
  ]);

  add('operating-systems:ch5-s2', [
    { id: 'os-buf-2', type: 'single', stem: '设备独立性软件的主要作用是？', options: { A: '向用户提供统一接口，屏蔽各类设备的差异', B: '直接操作硬件', C: '编译设备驱动', D: '分配内存' }, answer: 'A', explanation: '设备独立性软件实现与设备无关的统一接口，如 read/write，屏蔽底层差异。' },
    { id: 'os-buf-3', type: 'judge', stem: '缓冲技术包括单缓冲、双缓冲、循环缓冲和缓冲池。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这些是常见的缓冲形式，缓冲池可被多进程共享，提高利用率。' },
    { id: 'os-buf-4', type: 'single', stem: '设备分配时通常需要考虑哪几类资源的分配？', options: { A: '设备、控制器、通道', B: '内存、CPU、磁盘', C: '页、段、块', D: '进程、线程、协程' }, answer: 'A', explanation: '使用一个设备需要依次获得设备、控制器和通道，任一不足都会阻塞。' },
    { id: 'os-buf-5', type: 'judge', stem: 'SPOOLing 技术用磁盘上的输入井/输出井模拟脱机输入输出。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'SPOOLing 通过预输入和缓输出，把独占设备改造为可共享的虚拟设备。' },
  ]);

  add('operating-systems:ch5-s3', [
    { id: 'os-disk-3', type: 'single', stem: '磁盘访问时间由哪几部分组成？', options: { A: '寻道时间 + 旋转延迟 + 传输时间', B: '只含寻道时间', C: '只含传输时间', D: 'CPU 时间 + 内存时间' }, answer: 'A', explanation: '磁盘访问时间 = 寻道时间 + 旋转延迟 + 传输时间，其中寻道时间通常最大。' },
    { id: 'os-disk-4', type: 'judge', stem: '固态硬盘没有机械寻道和旋转延迟，随机访问速度快。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'SSD 基于闪存，无需机械移动，随机读写性能远优于机械硬盘。' },
    { id: 'os-disk-5', type: 'single', stem: '先来先服务（FCFS）磁盘调度算法的特点是？', options: { A: '公平但平均寻道时间长', B: '寻道时间最短', C: '会导致饥饿', D: '只服务近距离请求' }, answer: 'A', explanation: 'FCFS 按请求到达顺序服务，公平但磁头来回移动，平均寻道时间较长。' },
  ]);

  /* == MORE == */
})(window);
