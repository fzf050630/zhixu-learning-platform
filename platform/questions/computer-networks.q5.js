/* 知序 · 计算机网络补充题目（把每个小节补足到 5 题） */
(function (global) {
  'use strict';
  const bank = global.ZhixuQuestions = global.ZhixuQuestions || {};
  const add = (nodeId, questions) => { bank[nodeId] = (bank[nodeId] || []).concat(questions); };

  add('computer-networks:ch1-s1', [
    { id: 'cn-intro-2', type: 'single', stem: '从组成上看，计算机网络可分为？', options: { A: '资源子网与通信子网', B: '局域网与广域网', C: '有线网与无线网', D: '电路交换与分组交换' }, answer: 'A', explanation: '资源子网负责数据处理与资源共享，通信子网负责数据传输。' },
    { id: 'cn-intro-3', type: 'judge', stem: '互联网的核心技术是分组交换。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '互联网采用分组交换，把数据切成分组存储转发。' },
    { id: 'cn-intro-4', type: 'single', stem: '下列哪一项不是衡量网络性能的常用指标？', options: { A: '编译速度', B: '带宽', C: '时延', D: '吞吐量' }, answer: 'A', explanation: '常见指标有速率（带宽）、时延、时延带宽积、往返时延、吞吐量等。' },
    { id: 'cn-intro-5', type: 'judge', stem: '时延通常由发送时延、传播时延、处理时延和排队时延组成。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '总时延 = 发送 + 传播 + 处理 + 排队时延。' },
  ]);

  add('computer-networks:ch1-s2', [
    { id: 'cn-arch-3', type: 'single', stem: 'OSI 参考模型自下而上的七层顺序是？', options: { A: '物理、数据链路、网络、传输、会话、表示、应用', B: '应用、表示、会话、传输、网络、链路、物理', C: '物理、网络、链路、传输、会话、表示、应用', D: '物理、链路、传输、网络、会话、表示、应用' }, answer: 'A', explanation: 'OSI 自下而上为物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。' },
    { id: 'cn-arch-4', type: 'judge', stem: '网络协议的三要素是语法、语义和同步。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '语法定义格式，语义定义含义，同步定义时序关系。' },
    { id: 'cn-arch-5', type: 'single', stem: '服务访问点（SAP）的作用是？', options: { A: '相邻层之间交互的接口', B: '标识主机', C: '表示网络地址', D: '定义帧格式' }, answer: 'A', explanation: 'SAP 是同一系统中相邻两层实体交换信息的地方，如传输层的端口。' },
  ]);

  add('computer-networks:ch2-s1', [
    { id: 'cn-nyq-2', type: 'single', stem: '奈奎斯特准则给出无噪声信道的极限数据率是？', options: { A: 'C = 2W·log₂V', B: 'C = W·log₂(1+S/N)', C: 'C = W·V', D: 'C = 2W + V' }, answer: 'A', explanation: '奈奎斯特准则：C=2W·log₂V，W 为带宽、V 为码元离散级数。' },
    { id: 'cn-nyq-3', type: 'judge', stem: '香农公式 C = W·log₂(1+S/N) 给出有噪声信道的极限传输速率。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '香农公式给出在给定带宽和信噪比下的信道容量上限。' },
    { id: 'cn-nyq-4', type: 'single', stem: '波特率与比特率的关系是？', options: { A: '比特率 = 波特率 × 每码元携带的比特数', B: '两者恒相等', C: '比特率 = 波特率 ÷ 2', D: '无关系' }, answer: 'A', explanation: '每个码元可携带 log₂V 个比特，故比特率 = 波特率 × log₂V。' },
    { id: 'cn-nyq-5', type: 'judge', stem: '信噪比以 dB 表示时，S/N = 10^(dB/10)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'dB = 10·log₁₀(S/N)，故 30dB 对应 S/N=1000。' },
  ]);

  add('computer-networks:ch2-s2', [
    { id: 'cn-enc-2', type: 'single', stem: '基带传输与频带传输的区别是？', options: { A: '基带直接传数字信号，频带将数字信号调制到载波上', B: '基带只能传模拟信号', C: '频带不需要调制', D: '两者完全相同' }, answer: 'A', explanation: '基带传输直接发送数字信号；频带传输先调制到载波再传输。' },
    { id: 'cn-enc-3', type: 'judge', stem: '双绞线、同轴电缆和光纤都是常见的传输介质。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '双绞线、同轴电缆为有线电介质，光纤利用光信号传输。' },
    { id: 'cn-enc-4', type: 'single', stem: '中继器工作在 OSI 的哪一层，其作用是？', options: { A: '物理层，放大并再生信号', B: '数据链路层，转发帧', C: '网络层，选路', D: '传输层，分段' }, answer: 'A', explanation: '中继器在物理层对信号整形放大再生，延长传输距离。' },
    { id: 'cn-enc-5', type: 'judge', stem: '集线器工作在物理层，所有端口共享同一带宽。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '集线器是多端口中继器，所有端口处于同一冲突域、共享带宽。' },
  ]);

  add('computer-networks:ch3-s1', [
    { id: 'cn-dll-1', type: 'single', stem: '数据链路层的三个基本功能是？', options: { A: '封装成帧、差错控制、流量控制', B: '路由选择、分组转发、拥塞控制', C: '加密、解密、认证', D: '调制、解调、放大' }, answer: 'A', explanation: '数据链路层负责把网络层分组封装成帧，并进行差错与流量控制。' },
    { id: 'cn-dll-2', type: 'single', stem: '常用的组帧方法不包括？', options: { A: '加密组帧', B: '字符计数法', C: '零比特填充法', D: '违规编码法' }, answer: 'A', explanation: '组帧方法有字符计数、字符填充、零比特填充和违规编码。' },
    { id: 'cn-dll-3', type: 'judge', stem: '帧定界的作用是确定每一帧的开始与结束。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '通过帧定界符划分帧边界，接收方才能正确切分。' },
    { id: 'cn-dll-4', type: 'single', stem: '“透明传输”要求？', options: { A: '数据中即使出现与定界符相同的比特串也不产生歧义', B: '传输过程加密', C: '不使用定界符', D: '数据必须为 ASCII' }, answer: 'A', explanation: '透明传输保证任意比特组合的数据都能正确传输，不受定界符影响。' },
    { id: 'cn-dll-5', type: 'judge', stem: 'PPP 协议使用零比特填充法实现透明传输。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'PPP 在标志字段 01111110 之间对连续 5 个 1 后插入 0，实现透明传输。' },
  ]);

  add('computer-networks:ch3-s2', [
    { id: 'cn-crc-2', type: 'single', stem: '简单奇偶校验的检错能力是？', options: { A: '只能检测奇数个比特错误', B: '能检测并纠正所有错误', C: '只能检测偶数个错误', D: '无检错能力' }, answer: 'A', explanation: '奇偶校验改变一个比特会改变奇偶性，但偶数个错误会相互抵消而漏检。' },
    { id: 'cn-crc-3', type: 'judge', stem: '海明码既能检测错误，也能纠正一位错误。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '海明码通过多位校验位的组合定位并纠正单比特错误。' },
    { id: 'cn-crc-4', type: 'single', stem: '设数据位 k 位、校验位 r 位，海明码需满足？', options: { A: '2ʳ ≥ k + r + 1', B: '2ʳ ≤ k + r', C: 'r = k', D: '2ᵏ ≥ r' }, answer: 'A', explanation: 'r 位校验可表示 2ʳ 种状态，需覆盖 k+r 个位置的错误与无错情况。' },
    { id: 'cn-crc-5', type: 'judge', stem: 'CRC 通过生成多项式对数据做模 2 除法得到校验码。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '发送方用生成多项式 G(x) 做模 2 除法取余数作为 FCS 附加在数据后。' },
  ]);

  add('computer-networks:ch3-s3', [
    { id: 'cn-flow-3', type: 'single', stem: '滑动窗口协议包括哪几种？', options: { A: '停止-等待、后退 N 帧、选择重传', B: 'FCFS、SJF、RR', C: '频分、时分、码分', D: 'CSMA、CSMA/CD、CSMA/CA' }, answer: 'A', explanation: '滑动窗口协议有停止-等待、后退 N 帧（GBN）和选择重传（SR）。' },
    { id: 'cn-flow-4', type: 'judge', stem: '选择重传只重传真正出错或丢失的帧，其接收窗口大于 1。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'SR 接收方缓存乱序到达的帧，只重传出错帧，接收窗口与发送窗口都可大于 1。' },
    { id: 'cn-flow-5', type: 'single', stem: '若序号用 n 位表示，后退 N 帧协议的发送窗口最大为？', options: { A: '2ⁿ − 1', B: '2ⁿ', C: '2ⁿ⁻¹', D: 'n' }, answer: 'A', explanation: 'GBN 发送窗口最大 2ⁿ−1，避免新旧帧序号混淆；SR 为 2ⁿ⁻¹。' },
  ]);

  add('computer-networks:ch3-s4', [
    { id: 'cn-mac-2', type: 'single', stem: '信道划分介质访问控制不包括？', options: { A: '随机访问', B: '频分多路复用', C: '时分多路复用', D: '码分多路复用' }, answer: 'A', explanation: '信道划分有频分、时分、码分；随机访问与轮询是另外两类。' },
    { id: 'cn-mac-3', type: 'judge', stem: '随机访问控制包括 CSMA、CSMA/CD 和 CSMA/CA 等。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '随机访问让用户随机竞争信道，包括各类 CSMA 协议。' },
    { id: 'cn-mac-4', type: 'single', stem: 'CSMA/CD 的最小帧长取决于？', options: { A: '往返传播时延与数据率', B: '帧的个数', C: '网卡型号', D: '路由器数量' }, answer: 'A', explanation: '最小帧长 = 2×传播时延×数据率，保证发送方能检测到最远端冲突。' },
    { id: 'cn-mac-5', type: 'judge', stem: '令牌环属于轮询访问控制协议。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '令牌环通过令牌轮流授予发送权，属于轮询（受控）访问。' },
  ]);

  add('computer-networks:ch3-s5', [
    { id: 'cn-lan-2', type: 'single', stem: '以太网 MAC 地址的长度是？', options: { A: '48 位', B: '32 位', C: '64 位', D: '16 位' }, answer: 'A', explanation: 'MAC 地址 48 位，通常写作 6 组十六进制数，全球唯一。' },
    { id: 'cn-lan-3', type: 'judge', stem: '交换机（网桥）根据 MAC 地址转发帧，能隔离冲突域。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '交换机每个端口是独立冲突域，按 MAC 表转发，减少冲突。' },
    { id: 'cn-lan-4', type: 'single', stem: 'VLAN 的主要作用是？', options: { A: '隔离广播域', B: '提高 CPU 主频', C: '加密数据', D: '分配 IP 地址' }, answer: 'A', explanation: 'VLAN 把交换机端口逻辑划分为多个广播域，减少广播风暴。' },
    { id: 'cn-lan-5', type: 'judge', stem: '交换机的每个端口都是一个独立的冲突域。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '交换机端口间转发不共享介质，各端口是独立冲突域，但仍可能同处一个广播域。' },
  ]);

  add('computer-networks:ch4-s1', [
    { id: 'cn-ip-2', type: 'single', stem: 'IP 网络层向上层提供的是？', options: { A: '尽力而为的不可靠服务', B: '可靠的有连接服务', C: '加密服务', D: '实时保证' }, answer: 'A', explanation: 'IP 只尽力交付，不保证可靠与有序，可靠性由传输层负责。' },
    { id: 'cn-ip-3', type: 'judge', stem: 'IPv4 首部包含版本、首部长度、总长度、TTL、协议等字段。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这些是 IPv4 首部的关键字段，用于分片、转发与差错处理。' },
    { id: 'cn-ip-4', type: 'single', stem: 'IPv4 中 TTL 字段的作用是？', options: { A: '限制分组在网络中的存活跳数，防止环路', B: '表示分组长度', C: '标识协议类型', D: '表示优先级' }, answer: 'A', explanation: 'TTL 每经一个路由器减 1，减到 0 则丢弃并发送 ICMP 超时。' },
    { id: 'cn-ip-5', type: 'judge', stem: 'IP 分片的重组在目的主机完成，而不是在中间路由器。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '中间路由器只负责分片，重组统一在目的主机进行。' },
  ]);

  add('computer-networks:ch4-s2', [
    { id: 'cn-subnet-3', type: 'single', stem: '子网划分的做法是？', options: { A: '从主机号中借用若干位作为子网号', B: '增加网络前缀长度之外的位数', C: '把网络号借给主机', D: '改变 IP 版本' }, answer: 'A', explanation: '子网划分向主机号借位作子网号，配合子网掩码使用。' },
    { id: 'cn-subnet-4', type: 'judge', stem: 'CIDR 使用变长网络前缀，并支持路由聚合（构成超网）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'CIDR 用“/前缀”表示网络，可把多个连续网络聚合成一条路由。' },
    { id: 'cn-subnet-5', type: 'single', stem: '一个 /24 的子网最多可分配多少个主机地址？', options: { A: '254', B: '256', C: '255', D: '128' }, answer: 'A', explanation: '主机位 8 位共 256 个地址，去掉网络地址与广播地址，可用 254 个。' },
  ]);

  add('computer-networks:ch4-s3', [
    { id: 'cn-icmp-1', type: 'single', stem: 'ICMP 协议的主要用途是？', options: { A: '差错报告与网络探测（如 ping、traceroute）', B: '分配 IP 地址', C: '解析域名', D: '加密传输' }, answer: 'A', explanation: 'ICMP 报告差错（如目的不可达、超时）并提供 ping、traceroute 等探测。' },
    { id: 'cn-nat-1', type: 'judge', stem: 'NAT 技术实现私有地址与公网地址之间的转换。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'NAT 在边界路由器上把内部私有地址映射为公网地址，缓解地址枯竭。' },
    { id: 'cn-arp-2', type: 'single', stem: 'ARP 的请求与应答方式分别是？', options: { A: '请求广播、应答单播', B: '请求单播、应答广播', C: '都广播', D: '都单播' }, answer: 'A', explanation: 'ARP 请求以广播发送询问目标 IP 的 MAC，目标主机以单播回复。' },
  ]);

  add('computer-networks:ch4-s4', [
    { id: 'cn-routing-2', type: 'single', stem: 'RIP 协议基于哪种算法？', options: { A: '距离向量算法（Bellman–Ford）', B: '链路状态算法（Dijkstra）', C: '哈希算法', D: '快速排序' }, answer: 'A', explanation: 'RIP 通过邻居交换距离向量表，基于 Bellman–Ford 迭代更新。' },
    { id: 'cn-routing-3', type: 'judge', stem: 'OSPF 使用链路状态算法和 Dijkstra 计算最短路径。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'OSPF 每台路由器泛洪链路状态，再各自用 Dijkstra 计算最短路径树。' },
    { id: 'cn-routing-4', type: 'single', stem: 'BGP 是一种什么类型的协议？', options: { A: '外部网关协议，用于自治系统之间', B: '内部网关协议', C: '物理层协议', D: '应用层协议' }, answer: 'A', explanation: 'BGP 是自治系统之间的外部网关协议，交换可达性信息。' },
    { id: 'cn-routing-5', type: 'judge', stem: 'RIP 规定最大跳数为 15，16 表示不可达。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'RIP 用跳数作度量，超过 15 跳视为不可达，因此只适合小型网络。' },
  ]);

  add('computer-networks:ch4-s5', [
    { id: 'cn-fwd-1', type: 'single', stem: '路由器工作在网络层，其主要作用是？', options: { A: '根据路由表转发分组并隔离广播域', B: '放大信号', C: '转发 MAC 帧', D: '提供端口' }, answer: 'A', explanation: '路由器连接不同网络，按路由表转发 IP 分组，并隔离广播域。' },
    { id: 'cn-fwd-2', type: 'single', stem: '路由器转发分组时依据的原则是？', options: { A: '最长前缀匹配', B: '最短前缀匹配', C: '随机选择', D: '按端口顺序' }, answer: 'A', explanation: '在路由表中选取与目的地址前缀匹配最长的那条路由。' },
    { id: 'cn-fwd-3', type: 'judge', stem: '路由器可以连接采用不同链路层协议的异构网络。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '网络层屏蔽底层差异，使异构网络可以互联。' },
    { id: 'cn-fwd-4', type: 'single', stem: '三层交换机相比普通交换机多出的能力是？', options: { A: '基于 IP 的路由转发', B: '物理层中继', C: '无线接入', D: '域名解析' }, answer: 'A', explanation: '三层交换机在二层交换基础上支持 IP 路由，兼具交换与路由功能。' },
    { id: 'cn-fwd-5', type: 'judge', stem: '路由器默认不转发广播分组。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '路由器隔离广播域，默认不转发广播，避免广播风暴扩散。' },
  ]);

  add('computer-networks:ch5-s1', [
    { id: 'cn-tport-1', type: 'single', stem: '传输层提供的通信是？', options: { A: '端到端（进程到进程）通信', B: '主机到主机通信', C: '链路到链路通信', D: '物理到物理通信' }, answer: 'A', explanation: '传输层通过端口把通信定位到进程，实现端到端通信。' },
    { id: 'cn-tport-2', type: 'single', stem: '传输层用端口号标识进程，端口号的范围是？', options: { A: '0–65535', B: '0–255', C: '0–1023', D: '0–1024' }, answer: 'A', explanation: '端口号 16 位，范围 0–65535；0–1023 为熟知端口。' },
    { id: 'cn-tport-3', type: 'judge', stem: 'TCP 面向连接且可靠，UDP 无连接且不保证可靠。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'TCP 提供可靠有序的字节流；UDP 尽力交付、开销小。' },
    { id: 'cn-tport-4', type: 'single', stem: '传输层的“复用”与“分用”是指？', options: { A: '发送方多个进程共用传输层，接收方按端口把数据交给对应进程', B: '把多个网络合并', C: '加密与解密', D: '分段与重组' }, answer: 'A', explanation: '复用指多进程共用传输层发送；分用指接收方按端口交付给正确进程。' },
    { id: 'cn-tport-5', type: 'judge', stem: 'TCP 的协议数据单元称为报文段，UDP 的称为用户数据报。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'TCP 数据单元是报文段（segment），UDP 是用户数据报（datagram）。' },
  ]);

  add('computer-networks:ch5-s2', [
    { id: 'cn-udp-2', type: 'single', stem: 'UDP 首部包含哪些字段（共 8 字节）？', options: { A: '源端口、目的端口、长度、校验和', B: '序号、确认号、窗口', C: '版本、首部长度、TTL', D: '类型、代码、校验和' }, answer: 'A', explanation: 'UDP 首部仅 4 个字段，各 2 字节，共 8 字节。' },
    { id: 'cn-udp-3', type: 'judge', stem: '在 IPv4 中，UDP 的校验和字段是可选的（可以置 0 表示不校验）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'IPv4 下 UDP 校验和可选；IPv6 下则必须计算。' },
    { id: 'cn-tcpseg-1', type: 'single', stem: 'TCP 首部的最小长度是？', options: { A: '20 字节', B: '8 字节', C: '40 字节', D: '60 字节' }, answer: 'A', explanation: 'TCP 固定首部 20 字节，含选项时最长 60 字节。' },
    { id: 'cn-tcpseg-2', type: 'judge', stem: 'TCP 的确认号表示期望收到的下一个字节的序号。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'TCP 采用累积确认，确认号 ack = 已正确收到字节数 + 1。' },
  ]);

  add('computer-networks:ch5-s3', [
    { id: 'cn-tcp-2', type: 'single', stem: 'TCP 三次握手的报文顺序是？', options: { A: 'SYN → SYN+ACK → ACK', B: 'ACK → SYN → FIN', C: 'SYN → ACK → SYN', D: 'FIN → ACK → FIN' }, answer: 'A', explanation: '客户端发 SYN，服务器回 SYN+ACK，客户端再回 ACK，连接建立。' },
    { id: 'cn-tcp-3', type: 'judge', stem: 'TCP 释放连接需要四次挥手，是因为 TCP 是全双工的。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '两个方向需分别关闭，故通常需要四次报文交互。' },
    { id: 'cn-tcp-4', type: 'single', stem: '主动关闭方进入 TIME_WAIT 状态并等待 2MSL 的主要目的是？', options: { A: '确保最后的 ACK 到达，并让旧报文段在网络中消失', B: '加快连接建立', C: '节省端口', D: '加密数据' }, answer: 'A', explanation: '等待 2MSL 保证最后 ACK 可重传，且旧连接的迟到报文段失效。' },
    { id: 'cn-tcp-5', type: 'judge', stem: 'SYN 洪泛攻击利用了 TCP 三次握手中服务器维护半连接的特性。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '攻击者大量发送 SYN 不完成握手，耗尽服务器半连接队列。' },
  ]);

  add('computer-networks:ch5-s4', [
    { id: 'cn-rel-1', type: 'single', stem: 'TCP 实现可靠传输所依赖的机制不包括？', options: { A: '路由选择', B: '序号与确认', C: '超时重传', D: '滑动窗口' }, answer: 'A', explanation: 'TCP 用序号、确认、重传和滑动窗口保证可靠；路由选择是网络层职责。' },
    { id: 'cn-rel-2', type: 'judge', stem: 'TCP 的超时重传时间 RTO 基于对往返时延 RTT 的加权估计。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'RTO 由平滑 RTT 与偏差估计动态计算，适应网络变化。' },
    { id: 'cn-cc-3', type: 'single', stem: 'TCP 拥塞控制包含哪四个部分？', options: { A: '慢开始、拥塞避免、快重传、快恢复', B: '建连、传输、断开、重传', C: '复用、分用、封装、解封装', D: '寻址、路由、转发、分片' }, answer: 'A', explanation: 'TCP 拥塞控制由慢开始、拥塞避免、快重传和快恢复组成。' },
  ]);

  add('computer-networks:ch6-s1', [
    { id: 'cn-dns-2', type: 'single', stem: '网络应用主要有哪两种模型？', options: { A: '客户/服务器（C/S）与对等（P2P）', B: '同步与异步', C: '串行与并行', D: '单播与组播' }, answer: 'A', explanation: 'C/S 模型有中心服务器；P2P 模型各结点地位对等、直接通信。' },
    { id: 'cn-dns-3', type: 'judge', stem: 'DNS 服务器按层次分为根域名服务器、顶级域名服务器和权威域名服务器。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'DNS 采用层次化结构，自顶向下逐级解析。' },
    { id: 'cn-dns-4', type: 'single', stem: 'DNS 查询主要使用哪个传输层协议和端口？', options: { A: 'UDP，53 端口', B: 'TCP，80 端口', C: 'UDP，21 端口', D: 'TCP，53 端口（仅）' }, answer: 'A', explanation: 'DNS 常规查询用 UDP 53；区域传送等用 TCP 53。' },
    { id: 'cn-dns-5', type: 'judge', stem: '域名解析可分为递归查询与迭代查询两种方式。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '递归由服务器代查到底，迭代由请求方按返回指引逐级查询。' },
  ]);

  add('computer-networks:ch6-s2', [
    { id: 'cn-ftp-1', type: 'single', stem: 'FTP 使用了哪两个连接？', options: { A: '控制连接（21）与数据连接（20）', B: '只有数据连接', C: '只有控制连接', D: '加密连接与明文连接' }, answer: 'A', explanation: 'FTP 用控制连接传命令、数据连接传文件内容。' },
    { id: 'cn-ftp-2', type: 'judge', stem: 'FTP 的控制连接在整个会话期间保持，数据连接按需建立和关闭。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '控制连接保持到会话结束，数据连接每传一次文件建立一次。' },
    { id: 'cn-mail-1', type: 'single', stem: '电子邮件的发送和读取分别常用什么协议？', options: { A: '发送用 SMTP，读取常用 POP3/IMAP', B: '发送用 POP3，读取用 SMTP', C: '都用 FTP', D: '都用 DNS' }, answer: 'A', explanation: 'SMTP 负责发送与服务器间投递，POP3/IMAP 供用户读取邮箱。' },
    { id: 'cn-mail-2', type: 'judge', stem: 'MIME 扩展了电子邮件对非 ASCII 文本与附件的支持。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'MIME 定义了编码与内容类型，使邮件可传多媒体和附件。' },
    { id: 'cn-mail-3', type: 'single', stem: 'SMTP 默认使用的端口是？', options: { A: '25', B: '80', C: '53', D: '110' }, answer: 'A', explanation: 'SMTP 默认端口 25（提交常用 587，加密用 465）。' },
  ]);

  add('computer-networks:ch6-s3', [
    { id: 'cn-http-2', type: 'single', stem: 'URL 通常由哪些部分组成？', options: { A: '协议、主机、端口（可选）、路径等', B: '只有 IP 地址', C: '只有域名', D: 'MAC 地址与端口' }, answer: 'A', explanation: 'URL 形如 协议://主机[:端口]/路径，用于定位资源。' },
    { id: 'cn-http-3', type: 'judge', stem: 'HTTP 定义了 GET、POST、PUT、DELETE 等请求方法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不同方法表示对资源的不同操作，如获取、提交、更新、删除。' },
    { id: 'cn-http-4', type: 'single', stem: 'Cookie 的主要作用是？', options: { A: '在无状态的 HTTP 上维持会话状态', B: '加密传输', C: '加速路由', D: '解析域名' }, answer: 'A', explanation: '服务器通过 Cookie 在客户端保存标识，弥补 HTTP 无状态的不足。' },
    { id: 'cn-http-5', type: 'judge', stem: 'HTTP/1.1 默认使用持久连接，可在一个 TCP 连接上传输多个请求响应。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'HTTP/1.1 默认 keep-alive，减少连接建立开销。' },
  ]);

  /* == MORE == */
})(window);
