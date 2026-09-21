/* 知序 · 计算机网络自测题库（原创“真题风格”题，覆盖全部 6 章） */
(function (global) {
  'use strict';
  Object.assign(global.ZhixuQuestions = global.ZhixuQuestions || {}, {
    'computer-networks:ch1-s1': [
      { id: 'cn-intro-1', type: 'single', stem: '与电路交换相比，分组交换的主要优点是？', options: { A: '线路利用率高、可灵活共享带宽', B: '时延抖动更小且严格保证带宽', C: '不需要存储转发', D: '必须建立专用通路' }, answer: 'A', explanation: '分组交换采用存储转发、按需占用链路，线路利用率高、灵活；电路交换需建立专用通路，时延稳定但利用率低。' },
    ],
    'computer-networks:ch1-s2': [
      { id: 'cn-arch-1', type: 'single', stem: '在 TCP/IP 体系结构中，负责端到端（进程到进程）通信的是哪一层？', options: { A: '传输层', B: '网络层', C: '数据链路层', D: '应用层' }, answer: 'A', explanation: '传输层为两台主机中的进程提供端到端通信；网络层负责主机到主机的分组交付。' },
      { id: 'cn-arch-2', type: 'single', stem: 'OSI 参考模型与 TCP/IP 模型相比，多出的是哪一部分？', options: { A: '表示层与会话层', B: '物理层与数据链路层', C: '网络层与传输层', D: '应用层' }, answer: 'A', explanation: 'OSI 七层中的应用、表示、会话三层在 TCP/IP 中合并为应用层，因此 OSI 多出表示层与会话层。' },
    ],
    'computer-networks:ch2-s1': [
      { id: 'cn-nyq-1', type: 'single', stem: '信道带宽为 3kHz、信噪比为 30dB，按香农公式其极限数据率约为？', options: { A: '30 kb/s', B: '3 kb/s', C: '300 kb/s', D: '6 kb/s' }, answer: 'A', explanation: '30dB 对应信噪比 1000，C = 3000×log₂(1+1000) ≈ 3000×9.97 ≈ 30 kb/s。', hint: '先把 dB 换成比值：S/N = 10^(30/10)。' },
    ],
    'computer-networks:ch2-s2': [
      { id: 'cn-enc-1', type: 'single', stem: '曼彻斯特编码的特点是？', options: { A: '每个码元中间都有电平跳变，可自同步', B: '不含时钟信息', C: '只能表示 0', D: '与不归零编码相同' }, answer: 'A', explanation: '曼彻斯特编码在每个比特中间跳变，兼具数据与同步信息，但所需带宽是不归零编码的两倍。' },
    ],
    'computer-networks:ch3-s2': [
      { id: 'cn-crc-1', type: 'judge', stem: '循环冗余校验（CRC）只能检测差错，不能纠正差错。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'CRC 是一种检错编码，检测出错误后通常依靠重传恢复；纠错需要海明码等纠错编码。' },
    ],
    'computer-networks:ch3-s3': [
      { id: 'cn-flow-1', type: 'single', stem: '在后退 N 帧（GBN）协议中，接收窗口的大小通常为？', options: { A: '1', B: '等于发送窗口', C: '大于发送窗口', D: '任意值' }, answer: 'A', explanation: 'GBN 采用累积确认，接收方只按序接收，接收窗口为 1；某帧出错后其后所有帧都要重传。' },
      { id: 'cn-flow-2', type: 'single', stem: '停止-等待协议的信道利用率低，主要原因是？', options: { A: '发送方每发一帧必须等待确认，信道大部分时间空闲', B: '帧太长', C: '没有校验', D: '接收方窗口过大' }, answer: 'A', explanation: '停止-等待的发送窗口为 1，等待确认期间信道空闲，在长时延链路上利用率很低。' },
    ],
    'computer-networks:ch3-s4': [
      { id: 'cn-mac-1', type: 'single', stem: 'CSMA/CD 协议主要用于下列哪种网络？', options: { A: '有线以太网（共享信道）', B: '无线局域网', C: '卫星链路', D: '光纤骨干网' }, answer: 'A', explanation: 'CSMA/CD 依靠边发边听检测冲突，用于有线共享以太网；无线因难以边发边听，采用 CSMA/CA 避免冲突。' },
    ],
    'computer-networks:ch3-s5': [
      { id: 'cn-switch-1', type: 'single', stem: '以太网交换机通过什么方式建立转发表？', options: { A: '自学习源 MAC 地址与入端口的对应关系', B: '运行 OSPF', C: '由管理员手动配置所有表项', D: '使用 ARP 广播' }, answer: 'A', explanation: '交换机根据收到的帧的源 MAC 与入端口动态学习，建立 MAC 地址表；未知目的地址时泛洪。' },
    ],
    'computer-networks:ch4-s1': [
      { id: 'cn-ip-1', type: 'single', stem: 'IPv4 分组首部的最小长度（不含选项）是？', options: { A: '20 字节', B: '8 字节', C: '40 字节', D: '60 字节' }, answer: 'A', explanation: 'IPv4 固定首部 20 字节，加上可变的选项字段后最长 60 字节。' },
    ],
    'computer-networks:ch4-s2': [
      { id: 'cn-subnet-1', type: 'single', stem: '一个 IPv4 子网的前缀为 /26，该子网可分配给主机的地址数最多为？', options: { A: '62', B: '64', C: '30', D: '126' }, answer: 'A', explanation: '主机位 32−26=6 位，共 2⁶=64 个地址，去掉网络地址与广播地址，可用 62 个。' },
      { id: 'cn-subnet-2', type: 'single', stem: '子网掩码的作用是？', options: { A: '区分 IP 地址中的网络号与主机号', B: '加密 IP 地址', C: '把 IP 地址转换为 MAC 地址', D: '分配端口号' }, answer: 'A', explanation: '子网掩码与 IP 地址按位与运算，得到网络地址，从而区分网络号与主机号。' },
    ],
    'computer-networks:ch4-s3': [
      { id: 'cn-arp-1', type: 'judge', stem: 'ARP 的作用是把同一局域网内的 IP 地址解析为对应的 MAC 地址。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'ARP 在本地链路广播询问「谁拥有该 IP」，目标主机单播回复自己的 MAC。' },
      { id: 'cn-dhcp-1', type: 'single', stem: '主机通过 DHCP 可以自动获得的是？', options: { A: 'IP 地址、子网掩码、默认网关等配置', B: 'MAC 地址', C: '域名对应的 IP', D: 'TCP 端口号' }, answer: 'A', explanation: 'DHCP 动态分配 IP 地址及子网掩码、网关、DNS 等参数；MAC 由网卡固化，域名解析由 DNS 完成。' },
    ],
    'computer-networks:ch4-s4': [
      { id: 'cn-routing-1', type: 'single', stem: 'RIP 与 OSPF 分别属于哪类路由协议？', options: { A: '距离向量 / 链路状态', B: '链路状态 / 距离向量', C: '都是链路状态', D: '都是距离向量' }, answer: 'A', explanation: 'RIP 基于距离向量、以跳数为度量；OSPF 基于链路状态、用 Dijkstra 计算最短路径。' },
    ],
    'computer-networks:ch5-s2': [
      { id: 'cn-udp-1', type: 'single', stem: '关于 UDP，下列说法正确的是？', options: { A: '无连接、不可靠，首部仅 8 字节', B: '面向连接、可靠，首部 20 字节', C: '提供流量控制', D: '保证数据按序到达' }, answer: 'A', explanation: 'UDP 无连接、不保证可靠与有序，首部固定 8 字节，开销小、时延低。' },
    ],
    'computer-networks:ch5-s3': [
      { id: 'cn-tcp-1', type: 'single', stem: 'TCP 建立连接采用三次握手的根本原因是？', options: { A: '防止已失效的连接请求报文段突然传到服务器造成错误连接', B: '为了协商窗口大小', C: '为了加密密钥', D: '为了确定路由' }, answer: 'A', explanation: '三次握手让双方都确认对方的收发能力，并避免旧连接请求导致服务器建立无效连接。' },
    ],
    'computer-networks:ch5-s4': [
      { id: 'cn-cc-1', type: 'single', stem: 'TCP 拥塞控制中，慢开始阶段拥塞窗口 cwnd 的增长方式是？', options: { A: '每经过一个往返时延按指数增长（翻倍）', B: '每个往返时延加 1', C: '保持恒定', D: '线性递减' }, answer: 'A', explanation: '慢开始阶段 cwnd 从 1 开始，每收到一个确认加 1，实际每经过一个 RTT 近似翻倍。' },
      { id: 'cn-cc-2', type: 'single', stem: 'TCP 快重传算法中，发送方连续收到几个对同一报文段的重复确认就立即重传？', options: { A: '3 个', B: '1 个', C: '5 个', D: '10 个' }, answer: 'A', explanation: '连续收到 3 个重复 ACK 说明后续报文段已到达而该段丢失，立即重传而不等超时。' },
    ],
    'computer-networks:ch6-s1': [
      { id: 'cn-dns-1', type: 'single', stem: '关于 DNS 查询，下列说法正确的是？', options: { A: '递归查询由被请求服务器代为继续查询，迭代查询由请求方自行继续查询', B: 'DNS 只能使用 TCP', C: 'DNS 默认端口是 80', D: 'DNS 用于分配 IP 地址' }, answer: 'A', explanation: '递归查询中服务器替客户完成解析，迭代查询中服务器只返回下一步应询问的服务器；DNS 主要用 UDP 53 端口。' },
    ],
    'computer-networks:ch6-s3': [
      { id: 'cn-http-1', type: 'single', stem: '关于 HTTP，下列说法正确的是？', options: { A: 'HTTP 是无状态协议，默认端口 80', B: 'HTTP 是面向连接的传输层协议', C: 'HTTP 默认端口是 443', D: 'HTTP 保证可靠传输' }, answer: 'A', explanation: 'HTTP 是应用层无状态协议，默认端口 80（HTTPS 为 443），可靠传输由下层的 TCP 保证。' },
    ],
  });
})(window);
