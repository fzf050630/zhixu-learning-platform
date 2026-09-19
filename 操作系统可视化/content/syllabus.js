/* ============================================================
   syllabus.js — 王道《计算机操作系统》章节结构与考点覆盖
   知识主线：王道《计算机操作系统》（2026/2027 考研）
   章节结构：第 1~5 章
   ============================================================ */
(function (global) {
  'use strict';

  const examStructure = {
    parts: [
      { name: '数据结构', score: '45 分' },
      { name: '计算机组成原理', score: '45 分' },
      { name: '操作系统', score: '35 分' },
      { name: '计算机网络', score: '25 分' }
    ],
    types: [
      { name: '单项选择题', n: 40, score: '80 分（每题 2 分）' },
      { name: '综合应用题', n: 7, score: '70 分' }
    ]
  };

  const structure = [
    { no: '1', title: '计算机系统概述', id: 'ch1', status: 'done' },
    { no: '2', title: '进程与处理机调度', id: 'ch2', status: 'done' },
    { no: '3', title: '内存管理', id: 'ch3', status: 'done' },
    { no: '4', title: '文件管理', id: 'ch4', status: 'done' },
    { no: '5', title: '输入/输出管理', id: 'ch5', status: 'done' }
  ];

  const coverage = [
    { ch: 'ch1', item: '操作系统的概念、功能与目标', level: '了解', sec: 'ch1-s1', secTitle: '1.1 操作系统的基本概念' },
    { ch: 'ch1', item: '操作系统的基本特征（并发/共享/虚拟/异步）', level: '掌握', sec: 'ch1-s1', secTitle: '1.1 操作系统的基本概念' },
    { ch: 'ch1', item: '操作系统的发展历程', level: '了解', sec: 'ch1-s2', secTitle: '1.2 操作系统发展历程' },
    { ch: 'ch1', item: '内核态与用户态、中断与异常、系统调用', level: '掌握', sec: 'ch1-s3', secTitle: '1.3 操作系统的运行环境' },
    { ch: 'ch1', item: '操作系统结构（分层/模块化/宏内核/微内核）', level: '理解', sec: 'ch1-s4', secTitle: '1.4 操作系统结构与虚拟机' },
    { ch: 'ch1', item: '操作系统引导与虚拟机', level: '了解', sec: 'ch1-s4', secTitle: '1.4 操作系统结构与虚拟机' },

    { ch: 'ch2', item: '进程与线程的概念、组成、状态与转换', level: '掌握', sec: 'ch2-s1', secTitle: '2.1 进程与线程' },
    { ch: 'ch2', item: '进程通信、线程实现与多线程模型', level: '理解', sec: 'ch2-s1', secTitle: '2.1 进程与线程' },
    { ch: 'ch2', item: '处理机调度的层次与调度算法', level: '掌握', sec: 'ch2-s2', secTitle: '2.2 处理机调度' },
    { ch: 'ch2', item: '同步与互斥、信号量、经典同步问题、管程', level: '掌握', sec: 'ch2-s3', secTitle: '2.3 同步与互斥' },
    { ch: 'ch2', item: '死锁的概念、预防、避免（银行家算法）、检测与解除', level: '掌握', sec: 'ch2-s4', secTitle: '2.4 死锁' },

    { ch: 'ch3', item: '连续分配方式、分页、分段、段页式', level: '掌握', sec: 'ch3-s1', secTitle: '3.1 内存管理概念' },
    { ch: 'ch3', item: '虚拟内存、请求分页、页面置换算法、地址翻译', level: '掌握', sec: 'ch3-s2', secTitle: '3.2 虚拟内存管理' },

    { ch: 'ch4', item: '文件逻辑结构、物理结构与文件保护', level: '掌握', sec: 'ch4-s1', secTitle: '4.1 文件系统基础' },
    { ch: 'ch4', item: '目录结构、文件共享与链接', level: '理解', sec: 'ch4-s2', secTitle: '4.2 目录与文件共享' },
    { ch: 'ch4', item: '文件系统布局、磁盘空闲空间管理与虚拟文件系统', level: '掌握', sec: 'ch4-s3', secTitle: '4.3 文件系统实现' },

    { ch: 'ch5', item: 'I/O 设备分类、I/O 控制方式、I/O 软件层次', level: '掌握', sec: 'ch5-s1', secTitle: '5.1 I/O 管理概述' },
    { ch: 'ch5', item: '缓冲技术、设备分配与 SPOOLing', level: '掌握', sec: 'ch5-s2', secTitle: '5.2 设备独立性软件与缓冲' },
    { ch: 'ch5', item: '磁盘调度算法、磁盘管理与固态硬盘', level: '掌握', sec: 'ch5-s3', secTitle: '5.3 磁盘调度与固态硬盘' }
  ];

  global.SYL = {
    structure,
    coverage,
    examStructure,
    heroTitle: '408 操作系统<br><span class="grad">交互可视化学习系统</span>',
    heroText: '以王道《计算机操作系统》为知识主线，把「进程与调度 → 同步与死锁 → 内存管理 → 文件系统 → I/O 管理」做成可交互、可单步的图示：看得见进程状态的切换、调度甘特图、信号量 PV 的增减、页面置换的缺页与磁盘臂的移动。',
    outlineTitle: '教材结构（王道《计算机操作系统》）',
    source: '王道《计算机操作系统》（考研 408）',
    sourcePage: '第 1~5 章'
  };

})(window);
