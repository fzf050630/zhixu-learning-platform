/* ============================================================
   syllabus.js — 王道《计算机网络》章节结构与考点覆盖
   知识主线：王道《计算机网络》（2027 考研）
   章节结构：第 1~6 章
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
    { no: '1', title: '计算机网络体系结构', id: 'ch1', status: 'done' },
    { no: '2', title: '物理层', id: 'ch2', status: 'done' },
    { no: '3', title: '数据链路层', id: 'ch3', status: 'done' },
    { no: '4', title: '网络层', id: 'ch4', status: 'done' },
    { no: '5', title: '传输层', id: 'ch5', status: 'done' },
    { no: '6', title: '应用层', id: 'ch6', status: 'done' }
  ];

  const coverage = [
    { ch: 'ch1', item: '计算机网络的概念、组成、功能与分类', level: '了解', sec: 'ch1-s1', secTitle: '1.1 计算机网络概述' },
    { ch: 'ch1', item: '性能指标：速率、带宽、吞吐量、时延、时延带宽积', level: '掌握', sec: 'ch1-s1', secTitle: '1.1 计算机网络概述' },
    { ch: 'ch1', item: '电路交换、报文交换与分组交换', level: '掌握', sec: 'ch1-s1', secTitle: '1.1 计算机网络概述' },
    { ch: 'ch1', item: '分层结构、协议/服务/接口概念', level: '掌握', sec: 'ch1-s2', secTitle: '1.2 计算机网络体系结构与参考模型' },
    { ch: 'ch1', item: 'OSI 参考模型与 TCP/IP 模型', level: '掌握', sec: 'ch1-s2', secTitle: '1.2 计算机网络体系结构与参考模型' },

    { ch: 'ch2', item: '数据、信号、码元、速率、波特与带宽', level: '理解', sec: 'ch2-s1', secTitle: '2.1 通信基础与信道极限容量' },
    { ch: 'ch2', item: '奈奎斯特定理与香农定理', level: '掌握', sec: 'ch2-s1', secTitle: '2.1 通信基础与信道极限容量' },
    { ch: 'ch2', item: '编码与调制（NRZ / 曼彻斯特 / 差分曼彻斯特 / AMI）', level: '掌握', sec: 'ch2-s2', secTitle: '2.2 编码调制、传输介质与物理层设备' },
    { ch: 'ch2', item: '传输介质与物理层设备（中继器、集线器）', level: '了解', sec: 'ch2-s2', secTitle: '2.2 编码调制、传输介质与物理层设备' },

    { ch: 'ch3', item: '数据链路层功能、封装成帧与透明传输', level: '掌握', sec: 'ch3-s1', secTitle: '3.1 数据链路层功能与组帧' },
    { ch: 'ch3', item: '差错控制：奇偶校验、循环冗余码 CRC', level: '掌握', sec: 'ch3-s2', secTitle: '3.2 差错控制' },
    { ch: 'ch3', item: '滑动窗口、停止等待、GBN、SR 与信道利用率', level: '掌握', sec: 'ch3-s3', secTitle: '3.3 流量控制与可靠传输机制' },
    { ch: 'ch3', item: '介质访问控制：信道划分与随机访问（CSMA/CD）', level: '掌握', sec: 'ch3-s4', secTitle: '3.4 介质访问控制' },
    { ch: 'ch3', item: '以太网、MAC 地址、交换机与自学习', level: '掌握', sec: 'ch3-s5', secTitle: '3.5 局域网与数据链路层设备' },

    { ch: 'ch4', item: '网络层功能、虚电路与数据报、IPv4 分组与分片', level: '掌握', sec: 'ch4-s1', secTitle: '4.1 网络层功能与 IPv4 分组' },
    { ch: 'ch4', item: 'IPv4 地址、子网划分、CIDR 与路由聚合', level: '掌握', sec: 'ch4-s2', secTitle: '4.2 IPv4 地址与子网划分' },
    { ch: 'ch4', item: 'ARP、DHCP、ICMP 与 NAT', level: '掌握', sec: 'ch4-s3', secTitle: '4.3 ARP、DHCP、ICMP 与 NAT' },
    { ch: 'ch4', item: '路由算法（距离向量、链路状态）与 RIP/OSPF/BGP', level: '掌握', sec: 'ch4-s4', secTitle: '4.4 路由算法与路由协议' },
    { ch: 'ch4', item: '路由器结构、路由表与分组转发、冲突域与广播域', level: '理解', sec: 'ch4-s5', secTitle: '4.5 网络层设备与分组转发' },

    { ch: 'ch5', item: '传输层功能、端口与套接字、复用与分用', level: '掌握', sec: 'ch5-s1', secTitle: '5.1 传输层提供的服务' },
    { ch: 'ch5', item: 'UDP 与 TCP 首部格式', level: '掌握', sec: 'ch5-s2', secTitle: '5.2 UDP 与 TCP 报文段' },
    { ch: 'ch5', item: 'TCP 三次握手与四次挥手', level: '掌握', sec: 'ch5-s3', secTitle: '5.3 TCP 连接管理' },
    { ch: 'ch5', item: 'TCP 可靠传输、流量控制与拥塞控制', level: '掌握', sec: 'ch5-s4', secTitle: '5.4 TCP 可靠传输与拥塞控制' },

    { ch: 'ch6', item: 'C/S 与 P2P 模型、DNS 域名解析', level: '掌握', sec: 'ch6-s1', secTitle: '6.1 网络应用模型与域名系统' },
    { ch: 'ch6', item: 'FTP 与电子邮件（SMTP / POP3 / IMAP）', level: '理解', sec: 'ch6-s2', secTitle: '6.2 文件传输与电子邮件' },
    { ch: 'ch6', item: '万维网、HTTP 与持久连接', level: '掌握', sec: 'ch6-s3', secTitle: '6.3 万维网与 HTTP' }
  ];

  global.SYL = {
    structure,
    coverage,
    examStructure,
    heroTitle: '408 计算机网络<br><span class="grad">交互可视化学习系统</span>',
    heroText: '以王道《计算机网络》为知识主线，沿「体系结构 → 物理层 → 数据链路层 → 网络层 → 传输层 → 应用层」逐层展开：看得见 CRC 的除法、滑动窗口的时空图、子网划分的位、三次握手的报文与拥塞窗口的涨落。',
    outlineTitle: '教材结构（王道《计算机网络》）',
    source: '王道《计算机网络》（考研 408）',
    sourcePage: '第 1~6 章'
  };

})(window);
