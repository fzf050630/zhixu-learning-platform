/* ============================================================
   syllabus.js — 王道《计算机组成原理》章节结构与考点覆盖映射
   知识主线：王道《计算机组成原理》（2027 考研）
   章节结构：第 1~7 章
   ============================================================ */
(function (global) {
  'use strict';

  /* 408 试卷结构 */
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

  /* 章节框架 */
  const structure = [
    { no: '1', title: '计算机系统概述', id: 'ch1', status: 'done' },
    { no: '2', title: '数据的表示和运算', id: 'ch2', status: 'done' },
    { no: '3', title: '存储系统', id: 'ch3', status: 'done' },
    { no: '4', title: '指令系统', id: 'ch4', status: 'done' },
    { no: '5', title: '中央处理器', id: 'ch5', status: 'done' },
    { no: '6', title: '总线', id: 'ch6', status: 'done' },
    { no: '7', title: '输入/输出系统', id: 'ch7', status: 'done' }
  ];

  /* 考点覆盖（章节 → 小节锚点） */
  const coverage = [
    { ch: 'ch1', item: '冯·诺依曼机与存储程序思想', level: '了解', sec: 'ch1-s1', secTitle: '1.1 冯·诺依曼结构与计算机系统层次' },
    { ch: 'ch1', item: '计算机硬件五大部件与工作过程', level: '理解', sec: 'ch1-s2', secTitle: '1.2 计算机硬件与软件' },
    { ch: 'ch1', item: '指令与数据的流动、存储程序工作方式', level: '掌握', sec: 'ch1-s3', secTitle: '1.3 指令执行与存储程序' },
    { ch: 'ch1', item: '主频、CPI、MIPS、CPU 执行时间、FLOPS', level: '掌握', sec: 'ch1-s4', secTitle: '1.4 计算机的主要性能指标' },

    { ch: 'ch2', item: '进位计数制及其相互转换、真值与机器数', level: '掌握', sec: 'ch2-s1', secTitle: '2.1 进位计数制与转换' },
    { ch: 'ch2', item: '原码、反码、补码、移码及相互转换', level: '掌握', sec: 'ch2-s2', secTitle: '2.2 定点数的编码表示' },
    { ch: 'ch2', item: '补码加减、溢出判断、移位运算', level: '掌握', sec: 'ch2-s3', secTitle: '2.3 定点数的运算与溢出' },
    { ch: 'ch2', item: 'IEEE 754 浮点数的表示与范围', level: '掌握', sec: 'ch2-s4', secTitle: '2.4 浮点数的表示（IEEE 754）' },
    { ch: 'ch2', item: '浮点数加减运算、舍入与规格化', level: '理解', sec: 'ch2-s5', secTitle: '2.5 浮点数的加减运算' },
    { ch: 'ch2', item: '加法器、ALU 与并行进位', level: '理解', sec: 'ch2-s6', secTitle: '2.6 基本运算部件' },

    { ch: 'ch3', item: '存储器分类、层次结构与性能指标', level: '掌握', sec: 'ch3-s1', secTitle: '3.1 存储器概述与层次结构' },
    { ch: 'ch3', item: 'SRAM/DRAM/ROM、刷新、多模块存储器', level: '掌握', sec: 'ch3-s2', secTitle: '3.2 主存储器' },
    { ch: 'ch3', item: '主存容量扩展与 CPU 连接（位/字扩展）', level: '掌握', sec: 'ch3-s3', secTitle: '3.3 主存与 CPU 的连接' },
    { ch: 'ch3', item: '磁盘存取时间、SSD 原理', level: '理解', sec: 'ch3-s4', secTitle: '3.4 外部存储器' },
    { ch: 'ch3', item: 'Cache 原理、命中率与平均访问时间', level: '掌握', sec: 'ch3-s5', secTitle: '3.5 Cache 基本工作原理' },
    { ch: 'ch3', item: '直接/全相联/组相联映射与地址划分', level: '掌握', sec: 'ch3-s6', secTitle: '3.6 Cache 与主存的映射方式' },
    { ch: 'ch3', item: '替换算法、写策略与 Cache 容量计算', level: '掌握', sec: 'ch3-s7', secTitle: '3.7 替换算法与写策略' },
    { ch: 'ch3', item: '页式虚拟存储器、页表、TLB、地址转换', level: '掌握', sec: 'ch3-s8', secTitle: '3.8 虚拟存储器' },

    { ch: 'ch4', item: '指令格式、定长操作码、扩展操作码', level: '掌握', sec: 'ch4-s1', secTitle: '4.1 指令格式与操作码' },
    { ch: 'ch4', item: '常见数据寻址方式与有效地址计算', level: '掌握', sec: 'ch4-s2', secTitle: '4.2 寻址方式' },
    { ch: 'ch4', item: '指令类型与扩展操作码编码', level: '理解', sec: 'ch4-s3', secTitle: '4.3 指令类型与扩展操作码' },
    { ch: 'ch4', item: '选择/循环/过程调用的机器级表示', level: '理解', sec: 'ch4-s4', secTitle: '4.4 程序的机器级代码表示' },
    { ch: 'ch4', item: 'CISC 与 RISC 的比较', level: '了解', sec: 'ch4-s5', secTitle: '4.5 CISC 与 RISC' },

    { ch: 'ch5', item: 'CPU 功能、寄存器组与基本结构', level: '掌握', sec: 'ch5-s1', secTitle: '5.1 CPU 的功能与基本结构' },
    { ch: 'ch5', item: '指令周期、机器周期、时钟周期、时序', level: '掌握', sec: 'ch5-s2', secTitle: '5.2 指令执行过程与指令周期' },
    { ch: 'ch5', item: '数据通路、单总线结构与微操作', level: '掌握', sec: 'ch5-s3', secTitle: '5.3 数据通路与单总线结构' },
    { ch: 'ch5', item: '硬布线控制器与微程序控制器', level: '理解', sec: 'ch5-s4', secTitle: '5.4 控制器' },
    { ch: 'ch5', item: '异常与中断的分类及响应过程', level: '理解', sec: 'ch5-s5', secTitle: '5.5 异常与中断机制' },
    { ch: 'ch5', item: '指令流水线原理、性能与冒险', level: '掌握', sec: 'ch5-s6', secTitle: '5.6 指令流水线' },
    { ch: 'ch5', item: '流水线冒险处理与高级流水线技术', level: '掌握', sec: 'ch5-s7', secTitle: '5.7 流水线冒险与性能计算' },
    { ch: 'ch5', item: 'SISD/SIMD/MIMD、多核与多线程', level: '了解', sec: 'ch5-s8', secTitle: '5.8 多处理器的基本概念' },

    { ch: 'ch6', item: '总线的分类、结构与总线标准', level: '掌握', sec: 'ch6-s1', secTitle: '6.1 总线概述与分类' },
    { ch: 'ch6', item: '总线带宽与性能指标', level: '掌握', sec: 'ch6-s2', secTitle: '6.2 总线性能与结构' },
    { ch: 'ch6', item: '总线事务、同步定时与异步定时', level: '掌握', sec: 'ch6-s3', secTitle: '6.3 总线事务与定时' },

    { ch: 'ch7', item: 'I/O 系统组成、外部设备与 I/O 方式概览', level: '了解', sec: 'ch7-s1', secTitle: '7.1 I/O 系统基本概念' },
    { ch: 'ch7', item: 'I/O 接口功能、结构与端口编址', level: '掌握', sec: 'ch7-s2', secTitle: '7.2 I/O 接口' },
    { ch: 'ch7', item: '程序查询方式的工作流程与开销', level: '掌握', sec: 'ch7-s3', secTitle: '7.3 程序查询方式' },
    { ch: 'ch7', item: '程序中断方式、中断处理与多重中断', level: '掌握', sec: 'ch7-s4', secTitle: '7.4 程序中断方式' },
    { ch: 'ch7', item: 'DMA 方式、DMA 与中断/查询的比较', level: '掌握', sec: 'ch7-s5', secTitle: '7.5 DMA 方式' }
  ];

  global.SYL = {
    structure,
    coverage,
    examStructure,
    source: '王道《计算机组成原理》（考研 408）',
    sourcePage: '第 1~7 章'
  };

})(window);
