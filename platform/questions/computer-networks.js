/* 逐题知识与质量复核后的学习练习；由审计草稿合并。 */
(function(g){
  g.ZhixuQuestionBankVersion="question-quality-20261002-r2";
  Object.assign(g.ZhixuQuestions=g.ZhixuQuestions||{},{
  "computer-networks:ch1-s1": [
    {
      "id": "cn-intro-1",
      "type": "single",
      "stem": "与电路交换相比，分组交换的主要优点是？",
      "options": {
        "A": "线路利用率高、可灵活共享带宽",
        "B": "时延抖动更小且严格保证带宽",
        "C": "不需要存储转发",
        "D": "必须建立专用通路"
      },
      "answer": "A",
      "explanation": "分组交换采用存储转发、按需占用链路，线路利用率高、灵活；电路交换需建立专用通路，时延稳定但利用率低。"
    },
    {
      "id": "cn-intro-2-r2",
      "type": "single",
      "stem": "按承担的功能，将计算机网络划分为数据处理与资源共享部分、数据传输部分时，这两部分分别称为？",
      "options": {
        "A": "资源子网与通信子网",
        "B": "局域网与广域网",
        "C": "有线网与无线网",
        "D": "电路交换与分组交换"
      },
      "answer": "A",
      "explanation": "资源子网负责数据处理与资源共享，通信子网负责数据传输。"
    },
    {
      "id": "cn-intro-3",
      "type": "judge",
      "stem": "互联网的核心技术是分组交换。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "互联网采用分组交换，把数据切成分组存储转发。"
    },
    {
      "id": "cn-intro-4",
      "type": "single",
      "stem": "下列哪一项不是衡量网络性能的常用指标？",
      "options": {
        "A": "编译速度",
        "B": "带宽",
        "C": "时延",
        "D": "吞吐量"
      },
      "answer": "A",
      "explanation": "常见指标有速率（带宽）、时延、时延带宽积、往返时延、吞吐量等。"
    },
    {
      "id": "cn-intro-5",
      "type": "judge",
      "stem": "时延通常由发送时延、传播时延、处理时延和排队时延组成。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "总时延 = 发送 + 传播 + 处理 + 排队时延。"
    },
    {
      "id": "exam-cn-architecture-2024-33-r2",
      "type": "single",
      "stem": "串联路径各链路只服务本次持续传输，端系统、协议窗口、误码均不额外限制速率时，吞吐量上限主要由什么决定？",
      "options": {
        "A": "路径中带宽最小的瓶颈链路",
        "B": "路径中带宽最大的链路",
        "C": "经过的路由器数量",
        "D": "源主机的磁盘容量"
      },
      "answer": "A",
      "explanation": "串联路径的持续吞吐率无法超过最窄的瓶颈链路。"
    },
    {
      "id": "qa-20261002-computer-networks-ch1-s1-01",
      "type": "single",
      "stem": "1Mbit分组经过两条10Mbit/s存储转发链路，每段传播5ms，无排队和处理。末比特到达目的需要？",
      "options": {
        "A": "105ms",
        "B": "110ms",
        "C": "205ms",
        "D": "210ms"
      },
      "answer": "D",
      "explanation": "每段发送100ms，两段合200ms，传播合10ms，共210ms。"
    }
  ],
  "computer-networks:ch1-s2": [
    {
      "id": "cn-arch-1",
      "type": "single",
      "stem": "在 TCP/IP 体系结构中，负责端到端（进程到进程）通信的是哪一层？",
      "options": {
        "A": "传输层",
        "B": "网络层",
        "C": "数据链路层",
        "D": "应用层"
      },
      "answer": "A",
      "explanation": "传输层为两台主机中的进程提供端到端通信；网络层负责主机到主机的分组交付。"
    },
    {
      "id": "cn-arch-2-r2",
      "type": "single",
      "stem": "OSI七层与物理、链路、网络、传输、应用这五层教学模型相比，哪两层的功能在后者合入应用层？",
      "options": {
        "A": "表示层与会话层",
        "B": "物理层与数据链路层",
        "C": "网络层与传输层",
        "D": "应用层"
      },
      "answer": "A",
      "explanation": "OSI 七层中的应用、表示、会话三层在 TCP/IP 中合并为应用层，因此 OSI 多出表示层与会话层。"
    },
    {
      "id": "cn-arch-3",
      "type": "single",
      "stem": "OSI 参考模型自下而上的七层顺序是？",
      "options": {
        "A": "物理、数据链路、网络、传输、会话、表示、应用",
        "B": "应用、表示、会话、传输、网络、链路、物理",
        "C": "物理、网络、链路、传输、会话、表示、应用",
        "D": "物理、链路、传输、网络、会话、表示、应用"
      },
      "answer": "A",
      "explanation": "OSI 自下而上为物理层、数据链路层、网络层、传输层、会话层、表示层、应用层。"
    },
    {
      "id": "cn-arch-4",
      "type": "judge",
      "stem": "网络协议的三要素是语法、语义和同步。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "语法定义格式，语义定义含义，同步定义时序关系。"
    },
    {
      "id": "cn-arch-5",
      "type": "single",
      "stem": "服务访问点（SAP）的作用是？",
      "options": {
        "A": "相邻层之间交互的接口",
        "B": "标识主机",
        "C": "表示网络地址",
        "D": "定义帧格式"
      },
      "answer": "A",
      "explanation": "SAP 是同一系统中相邻两层实体交换信息的地方，如传输层的端口。"
    },
    {
      "id": "qa-20261002-computer-networks-ch1-s2-01",
      "type": "single",
      "stem": "应用写入TCP的两个100B数据块，接收应用一次读取200B。这说明？",
      "options": {
        "A": "TCP违反报文边界",
        "B": "TCP提供字节流而不保存应用写入边界",
        "C": "传输层不能分用",
        "D": "一定发生IP分片"
      },
      "answer": "B",
      "explanation": "TCP按字节流交付，写与读调用边界不是协议边界。"
    }
  ],
  "computer-networks:ch2-s1": [
    {
      "id": "cn-nyq-1",
      "type": "single",
      "stem": "信道带宽为 3kHz、信噪比为 30dB，按香农公式其极限数据率约为？",
      "options": {
        "A": "30 kb/s",
        "B": "3 kb/s",
        "C": "300 kb/s",
        "D": "6 kb/s"
      },
      "answer": "A",
      "explanation": "30dB 对应信噪比 1000，C = 3000×log₂(1+1000) ≈ 3000×9.97 ≈ 30 kb/s。",
      "hint": "先把 dB 换成比值：S/N = 10^(30/10)。"
    },
    {
      "id": "cn-nyq-2",
      "type": "single",
      "stem": "奈奎斯特准则给出无噪声信道的极限数据率是？",
      "options": {
        "A": "C = 2W·log₂V",
        "B": "C = W·log₂(1+S/N)",
        "C": "C = W·V",
        "D": "C = 2W + V"
      },
      "answer": "A",
      "explanation": "奈奎斯特准则：C=2W·log₂V，W 为带宽、V 为码元离散级数。"
    },
    {
      "id": "cn-nyq-3",
      "type": "judge",
      "stem": "香农公式 C = W·log₂(1+S/N) 给出有噪声信道的极限传输速率。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "香农公式给出在给定带宽和信噪比下的信道容量上限。"
    },
    {
      "id": "cn-nyq-4",
      "type": "single",
      "stem": "波特率与比特率的关系是？",
      "options": {
        "A": "比特率 = 波特率 × 每码元携带的比特数",
        "B": "两者恒相等",
        "C": "比特率 = 波特率 ÷ 2",
        "D": "无关系"
      },
      "answer": "A",
      "explanation": "每个码元可携带 log₂V 个比特，故比特率 = 波特率 × log₂V。"
    },
    {
      "id": "cn-nyq-5",
      "type": "judge",
      "stem": "信噪比以 dB 表示时，S/N = 10^(dB/10)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "dB = 10·log₁₀(S/N)，故 30dB 对应 S/N=1000。"
    },
    {
      "id": "exam-cn-physical-2022-34-r2",
      "type": "single",
      "stem": "带宽 200 kHz 的无噪声信道采用 4 种 ASK 信号幅值，奈奎斯特上限约为多少？",
      "options": {
        "A": "200 kb/s",
        "B": "400 kb/s",
        "C": "800 kb/s",
        "D": "1600 kb/s"
      },
      "answer": "C",
      "explanation": "最高码元率为 2W=400 kbaud，每个码元承载 log₂4=2 bit，故速率为 800 kb/s。"
    },
    {
      "id": "qa-20261002-computer-networks-ch2-s1-01",
      "type": "single",
      "stem": "理想低通信道W=4kHz，采用16种等概率码元，另有噪声使香农上限24kb/s，两个约束下数据率不得超过？",
      "options": {
        "A": "16kb/s",
        "B": "24kb/s",
        "C": "32kb/s",
        "D": "48kb/s"
      },
      "answer": "B",
      "explanation": "奈奎斯特2*4000*4=32kb/s，香农24kb/s，需取两上限最小24kb/s。"
    }
  ],
  "computer-networks:ch2-s2": [
    {
      "id": "cn-enc-1",
      "type": "single",
      "stem": "曼彻斯特编码的特点是？",
      "options": {
        "A": "每个码元中间都有电平跳变，可自同步",
        "B": "不含时钟信息",
        "C": "只能表示 0",
        "D": "与不归零编码相同"
      },
      "answer": "A",
      "explanation": "曼彻斯特编码在每个比特中间跳变，兼具数据与同步信息，但所需带宽是不归零编码的两倍。"
    },
    {
      "id": "cn-enc-2",
      "type": "single",
      "stem": "基带传输与频带传输的区别是？",
      "options": {
        "A": "基带直接传数字信号，频带将数字信号调制到载波上",
        "B": "基带只能传模拟信号",
        "C": "频带不需要调制",
        "D": "两者完全相同"
      },
      "answer": "A",
      "explanation": "基带传输直接发送数字信号；频带传输先调制到载波再传输。"
    },
    {
      "id": "cn-enc-4",
      "type": "single",
      "stem": "中继器工作在 OSI 的哪一层，其作用是？",
      "options": {
        "A": "物理层，放大并再生信号",
        "B": "数据链路层，转发帧",
        "C": "网络层，选路",
        "D": "传输层，分段"
      },
      "answer": "A",
      "explanation": "中继器在物理层对信号整形放大再生，延长传输距离。"
    },
    {
      "id": "cn-enc-5",
      "type": "judge",
      "stem": "集线器工作在物理层，所有端口共享同一带宽。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "集线器是多端口中继器，所有端口处于同一冲突域、共享带宽。"
    },
    {
      "id": "exam-computer-networks-ch2-s2-2021-34-a-r2",
      "type": "single",
      "stem": "差分曼彻斯特编码中，位值通常由什么决定？",
      "options": {
        "A": "信号绝对幅度大小",
        "B": "IP 首部校验和",
        "C": "帧尾 CRC 长度",
        "D": "每个位开始处是否发生电平跳变"
      },
      "answer": "D",
      "explanation": "差分曼彻斯特用位边界的跳变与否表示数据，位中间仍有跳变。"
    },
    {
      "id": "exam-computer-networks-ch2-s2-2009-34-b-r2",
      "type": "single",
      "stem": "带宽为 3kHz、4×4 QAM 的无噪声信道，奈奎斯特上限为？",
      "options": {
        "A": "3kb/s",
        "B": "24kb/s",
        "C": "12kb/s",
        "D": "48kb/s"
      },
      "answer": "B",
      "explanation": "奈奎斯特速率为 2B log₂V；V=16，故 2×3000×4=24kb/s。"
    },
    {
      "id": "qa-20261002-computer-networks-ch2-s2-01",
      "type": "single",
      "stem": "差分曼彻斯特约定位开始跳变表示0、不跳变表示1。连续两位0、1中，第一位开始和第二位开始分别？",
      "options": {
        "A": "都跳变",
        "B": "都不跳变",
        "C": "跳变、不跳变",
        "D": "不跳变、跳变"
      },
      "answer": "C",
      "explanation": "位中点始终跳变用于同步，数据由每位开始是否跳变决定；题目显式给出位值约定。"
    }
  ],
  "computer-networks:ch3-s1": [
    {
      "id": "cn-dll-1-r2",
      "type": "single",
      "stem": "下列哪组属于数据链路层常见的功能范畴？",
      "options": {
        "A": "封装成帧、差错控制、流量控制",
        "B": "路由选择、分组转发、拥塞控制",
        "C": "加密、解密、认证",
        "D": "调制、解调、放大"
      },
      "answer": "A",
      "explanation": "组帧、差错控制、链路级流控属于链路层功能范畴，但具体链路协议可仅提供其中部分，例如以太网不普遍提供逐帧ARQ可靠交付。"
    },
    {
      "id": "cn-dll-2",
      "type": "single",
      "stem": "常用的组帧方法不包括？",
      "options": {
        "A": "加密组帧",
        "B": "字符计数法",
        "C": "零比特填充法",
        "D": "违规编码法"
      },
      "answer": "A",
      "explanation": "组帧方法有字符计数、字符填充、零比特填充和违规编码。"
    },
    {
      "id": "cn-dll-3",
      "type": "judge",
      "stem": "帧定界的作用是确定每一帧的开始与结束。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "通过帧定界符划分帧边界，接收方才能正确切分。"
    },
    {
      "id": "cn-dll-4",
      "type": "single",
      "stem": "“透明传输”要求？",
      "options": {
        "A": "数据中即使出现与定界符相同的比特串也不产生歧义",
        "B": "传输过程加密",
        "C": "不使用定界符",
        "D": "数据必须为 ASCII"
      },
      "answer": "A",
      "explanation": "透明传输保证任意比特组合的数据都能正确传输，不受定界符影响。"
    },
    {
      "id": "cn-dll-5-r2",
      "type": "judge",
      "stem": "PPP采用异步字节定向链路时，一律通过连续5个1后插入0来实现透明传输。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "异步/字节填充形式使用转义字节（如0x7D）；比特同步形式才在连续5个1后填充0。依据RFC1662第4、5节及王道网络OCR第126、129页。"
    },
    {
      "id": "qa-20261002-computer-networks-ch3-s1-01",
      "type": "single",
      "stem": "零比特填充用于数据串01111110（不含帧标志）。填充结果为？",
      "options": {
        "A": "011111010",
        "B": "011111100",
        "C": "001111110",
        "D": "01111110"
      },
      "answer": "A",
      "explanation": "连续第5个1后插0：0+11111+0+1+0=011111010，避免伪装标志01111110。"
    }
  ],
  "computer-networks:ch3-s2": [
    {
      "id": "cn-crc-1-r2",
      "type": "judge",
      "stem": "在常规数据链路协议中，CRC作为检错手段；检测失败后通常依靠丢弃或重传，而不是由CRC直接恢复原始数据。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "此处限定常规协议用途。CRC余数用于发现错误；不能将其表述为任意编码理论与任意受限错误模型下都绝不可能用于纠错。"
    },
    {
      "id": "cn-crc-2",
      "type": "single",
      "stem": "简单奇偶校验的检错能力是？",
      "options": {
        "A": "只能检测奇数个比特错误",
        "B": "能检测并纠正所有错误",
        "C": "只能检测偶数个错误",
        "D": "无检错能力"
      },
      "answer": "A",
      "explanation": "奇偶校验改变一个比特会改变奇偶性，但偶数个错误会相互抵消而漏检。"
    },
    {
      "id": "cn-crc-3",
      "type": "judge",
      "stem": "海明码既能检测错误，也能纠正一位错误。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "海明码通过多位校验位的组合定位并纠正单比特错误。"
    },
    {
      "id": "cn-crc-4",
      "type": "single",
      "stem": "设数据位 k 位、校验位 r 位，海明码需满足？",
      "options": {
        "A": "2ʳ ≥ k + r + 1",
        "B": "2ʳ ≤ k + r",
        "C": "r = k",
        "D": "2ᵏ ≥ r"
      },
      "answer": "A",
      "explanation": "r 位校验可表示 2ʳ 种状态，需覆盖 k+r 个位置的错误与无错情况。"
    },
    {
      "id": "cn-crc-5-r2",
      "type": "judge",
      "stem": "生成多项式次数为r时，基本CRC构造先在数据后附r个0，再做模2除法取r位余数并替换这r个0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "对x^rM(x)除G(x)得R(x)，发送x^rM(x)+R(x)。模2加法是异或，发送码字可被G整除。"
    },
    {
      "id": "exam-computer-networks-ch3-s2-2023-34-b-r2",
      "type": "single",
      "stem": "CRC 校验中，若接收码字除以生成多项式的余数为 0，通常说明？",
      "options": {
        "A": "必定发生了差错",
        "B": "未检测到差错，但不能保证绝无差错",
        "C": "接收端窗口为 0",
        "D": "IP 分组已经分片"
      },
      "answer": "B",
      "explanation": "CRC 能检出多类差错，但余数为 0 并非数学上保证绝无差错。"
    },
    {
      "id": "qa-20261002-computer-networks-ch3-s2-01",
      "type": "single",
      "stem": "基本CRC数据1101，生成多项式比特串1011，校验余数是？",
      "options": {
        "A": "001",
        "B": "010",
        "C": "100",
        "D": "111"
      },
      "answer": "A",
      "explanation": "1101000模2除1011：异或消首项依次得到0110000、0011100、0001010、0000001，余数001；发送1101001可整除。"
    }
  ],
  "computer-networks:ch3-s3": [
    {
      "id": "cn-flow-1",
      "type": "single",
      "stem": "在后退 N 帧（GBN）协议中，接收窗口的大小通常为？",
      "options": {
        "A": "1",
        "B": "等于发送窗口",
        "C": "大于发送窗口",
        "D": "任意值"
      },
      "answer": "A",
      "explanation": "GBN 采用累积确认，接收方只按序接收，接收窗口为 1；某帧出错后其后所有帧都要重传。"
    },
    {
      "id": "cn-flow-2-r2",
      "type": "single",
      "stem": "在传播时延远大于一帧发送时间、忽略ACK发送和处理时间的无差错链路上，停止等待利用率低的主要原因是？",
      "options": {
        "A": "发送方每发一帧必须等待确认，信道大部分时间空闲",
        "B": "帧太长",
        "C": "没有校验",
        "D": "接收方窗口过大"
      },
      "answer": "A",
      "explanation": "停止-等待的发送窗口为 1，等待确认期间信道空闲，在长时延链路上利用率很低。"
    },
    {
      "id": "cn-flow-3",
      "type": "single",
      "stem": "滑动窗口协议包括哪几种？",
      "options": {
        "A": "停止-等待、后退 N 帧、选择重传",
        "B": "FCFS、SJF、RR",
        "C": "频分、时分、码分",
        "D": "CSMA、CSMA/CD、CSMA/CA"
      },
      "answer": "A",
      "explanation": "滑动窗口协议有停止-等待、后退 N 帧（GBN）和选择重传（SR）。"
    },
    {
      "id": "cn-flow-4-r2",
      "type": "judge",
      "stem": "选择重传协议可缓存接收窗口内的乱序帧；发送端可能因确认丢失而重传接收方已正确收到的帧。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "SR不需像GBN一样整体重发后续帧，但发送方依未确认/超时状态决定重传，ACK丢失时同样可能重传已正确到达的数据。"
    },
    {
      "id": "cn-flow-5",
      "type": "single",
      "stem": "若序号用 n 位表示，后退 N 帧协议的发送窗口最大为？",
      "options": {
        "A": "2ⁿ − 1",
        "B": "2ⁿ",
        "C": "2ⁿ⁻¹",
        "D": "n"
      },
      "answer": "A",
      "explanation": "GBN 发送窗口最大 2ⁿ−1，避免新旧帧序号混淆；SR 为 2ⁿ⁻¹。"
    },
    {
      "id": "exam-computer-networks-ch3-s3-2011-35-a-r2",
      "type": "single",
      "stem": "选择重传ARQ收到位于当前接收窗口内且校验正确的乱序帧时，接收方可以？",
      "options": {
        "A": "缓存该帧并单独确认",
        "B": "丢弃所有后续帧",
        "C": "确认一个从未收到的帧",
        "D": "关闭物理链路"
      },
      "answer": "A",
      "explanation": "选择重传允许缓存窗口内乱序帧并分别确认。"
    },
    {
      "id": "exam-computer-networks-ch3-s3-2019-35-b-r2",
      "type": "single",
      "stem": "n比特序号的选择重传协议，发送窗口和接收窗口取相同大小时，该大小最大不超过？",
      "options": {
        "A": "2ⁿ",
        "B": "2ⁿ+1",
        "C": "2ⁿ⁻¹",
        "D": "n²"
      },
      "answer": "C",
      "explanation": "一般需Ws+Wr≤2^n；两窗相等时各最大2^(n-1)。不限定等窗时不能单独断言接收窗绝不可超过一半。"
    },
    {
      "id": "qa-20261002-computer-networks-ch3-s3-01",
      "type": "single",
      "stem": "无差错停止等待，一帧发送1ms，单程传播9ms，ACK发送和处理忽略。发送链路利用率？",
      "options": {
        "A": "1/10",
        "B": "1/19",
        "C": "1/9",
        "D": "1/18"
      },
      "answer": "B",
      "explanation": "一个循环发送1+来回传播18=19ms，有效发送占1ms，利用率1/19。"
    }
  ],
  "computer-networks:ch3-s4": [
    {
      "id": "cn-mac-1",
      "type": "single",
      "stem": "CSMA/CD 协议主要用于下列哪种网络？",
      "options": {
        "A": "有线以太网（共享信道）",
        "B": "无线局域网",
        "C": "卫星链路",
        "D": "光纤骨干网"
      },
      "answer": "A",
      "explanation": "CSMA/CD 依靠边发边听检测冲突，用于有线共享以太网；无线因难以边发边听，采用 CSMA/CA 避免冲突。"
    },
    {
      "id": "cn-mac-2",
      "type": "single",
      "stem": "信道划分介质访问控制不包括？",
      "options": {
        "A": "随机访问",
        "B": "频分多路复用",
        "C": "时分多路复用",
        "D": "码分多路复用"
      },
      "answer": "A",
      "explanation": "信道划分有频分、时分、码分；随机访问与轮询是另外两类。"
    },
    {
      "id": "cn-mac-3",
      "type": "judge",
      "stem": "随机访问控制包括 CSMA、CSMA/CD 和 CSMA/CA 等。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "随机访问让用户随机竞争信道，包括各类 CSMA 协议。"
    },
    {
      "id": "cn-mac-4",
      "type": "single",
      "stem": "CSMA/CD 的最小帧长取决于？",
      "options": {
        "A": "往返传播时延与数据率",
        "B": "帧的个数",
        "C": "网卡型号",
        "D": "路由器数量"
      },
      "answer": "A",
      "explanation": "最小帧长 = 2×传播时延×数据率，保证发送方能检测到最远端冲突。"
    },
    {
      "id": "cn-mac-5",
      "type": "judge",
      "stem": "令牌环属于轮询访问控制协议。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "令牌环通过令牌轮流授予发送权，属于轮询（受控）访问。"
    },
    {
      "id": "qa-20261002-computer-networks-ch3-s4-01",
      "type": "single",
      "stem": "共享半双工链路100Mbit/s，最大单程传播2.5微秒，忽略其他延迟。为检测最远冲突，帧至少多少比特？",
      "options": {
        "A": "250",
        "B": "500",
        "C": "1000",
        "D": "64"
      },
      "answer": "B",
      "explanation": "发送时长至少5微秒，100*10^6*5*10^-6=500bit；这是物理约束下限，不替代以太网标准最小帧512bit。"
    }
  ],
  "computer-networks:ch3-s5": [
    {
      "id": "cn-switch-1",
      "type": "single",
      "stem": "以太网交换机通过什么方式建立转发表？",
      "options": {
        "A": "自学习源 MAC 地址与入端口的对应关系",
        "B": "运行 OSPF",
        "C": "由管理员手动配置所有表项",
        "D": "使用 ARP 广播"
      },
      "answer": "A",
      "explanation": "交换机根据收到的帧的源 MAC 与入端口动态学习，建立 MAC 地址表；未知目的地址时泛洪。"
    },
    {
      "id": "cn-lan-2-r2",
      "type": "single",
      "stem": "以太网 MAC 地址的长度是？",
      "options": {
        "A": "48 位",
        "B": "32 位",
        "C": "64 位",
        "D": "16 位"
      },
      "answer": "A",
      "explanation": "通常以太网MAC地址为48位（6字节）。全球管理单播地址设计上唯一；本地管理、虚拟化、随机化地址不保证全球唯一。"
    },
    {
      "id": "cn-lan-3",
      "type": "judge",
      "stem": "交换机（网桥）根据 MAC 地址转发帧，能隔离冲突域。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "交换机每个端口是独立冲突域，按 MAC 表转发，减少冲突。"
    },
    {
      "id": "cn-lan-4",
      "type": "single",
      "stem": "VLAN 的主要作用是？",
      "options": {
        "A": "隔离广播域",
        "B": "提高 CPU 主频",
        "C": "加密数据",
        "D": "分配 IP 地址"
      },
      "answer": "A",
      "explanation": "VLAN 把交换机端口逻辑划分为多个广播域，减少广播风暴。"
    },
    {
      "id": "exam-computer-networks-ch3-s5-2009-36-b-r2",
      "type": "single",
      "stem": "普通二层交换机在同一VLAN内收到未知目的MAC的单播帧，且无过滤规则时通常会？",
      "options": {
        "A": "立即丢弃并清空交换表",
        "B": "只发送给默认网关",
        "C": "改写目的MAC为广播地址",
        "D": "向该VLAN内除入端口外的其他可转发端口泛洪"
      },
      "answer": "D",
      "explanation": "目的地址未学习到时，交换机会在同一 VLAN 内泛洪该帧。"
    },
    {
      "id": "qa-20261002-computer-networks-ch3-s5-01",
      "type": "single",
      "stem": "交换机表空，A从端口1向B发送，B从端口2回复A，随后A再向B发送，均同VLAN。第三帧通常怎样？",
      "options": {
        "A": "泛洪所有端口",
        "B": "仅发端口2",
        "C": "仅发端口1",
        "D": "丢弃"
      },
      "answer": "B",
      "explanation": "第一帧学A→1并未知B泛洪，第二帧学B→2并定向A，第三帧B已知定向2。"
    }
  ],
  "computer-networks:ch4-s1": [
    {
      "id": "cn-ip-1",
      "type": "single",
      "stem": "IPv4 分组首部的最小长度（不含选项）是？",
      "options": {
        "A": "20 字节",
        "B": "8 字节",
        "C": "40 字节",
        "D": "60 字节"
      },
      "answer": "A",
      "explanation": "IPv4 固定首部 20 字节，加上可变的选项字段后最长 60 字节。"
    },
    {
      "id": "cn-ip-2",
      "type": "single",
      "stem": "IP 网络层向上层提供的是？",
      "options": {
        "A": "尽力而为的不可靠服务",
        "B": "可靠的有连接服务",
        "C": "加密服务",
        "D": "实时保证"
      },
      "answer": "A",
      "explanation": "IP 只尽力交付，不保证可靠与有序，可靠性由传输层负责。"
    },
    {
      "id": "cn-ip-4-r2",
      "type": "single",
      "stem": "IPv4 中 TTL 字段的作用是？",
      "options": {
        "A": "限制分组可继续转发的寿命，避免路由环路中无限循环",
        "B": "表示整个分组的字节长度",
        "C": "标识上层协议类型",
        "D": "强制消除所有路由环路"
      },
      "answer": "A",
      "explanation": "转发路由器递减TTL，耗尽则丢弃，符合条件时发送ICMP超时；TTL限制环路后果，不能防止路由表形成环路。"
    },
    {
      "id": "cn-ip-5",
      "type": "judge",
      "stem": "IP 分片的重组在目的主机完成，而不是在中间路由器。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "中间路由器只负责分片，重组统一在目的主机进行。"
    },
    {
      "id": "exam-cn-network-2023-35-r2",
      "type": "single",
      "stem": "IPv4 分片首部中的片偏移字段以多少字节为计量单位？",
      "options": {
        "A": "8 字节",
        "B": "16 字节",
        "C": "1 字节",
        "D": "4 字节"
      },
      "answer": "A",
      "explanation": "片偏移按 8 字节为单位编码，因此除最后一片外，分片数据长度通常须为 8 的倍数。"
    },
    {
      "id": "exam-cn-network-2022-35-r2",
      "type": "single",
      "stem": "主机 IP 为 183.80.72.48，子网掩码为 255.255.192.0。该主机所在网络地址是哪一个？",
      "options": {
        "A": "183.80.0.0",
        "B": "183.80.64.0",
        "C": "183.80.72.0",
        "D": "183.80.192.0"
      },
      "answer": "B",
      "explanation": "将 IP 地址与子网掩码逐位相与，第三字节 72 落在 64–127 网段，因此网络地址为 183.80.64.0。"
    },
    {
      "id": "qa-20261002-computer-networks-ch4-s1-01",
      "type": "single",
      "stem": "IPv4无选项总长4020B，下一链路MTU1500B，允许分片。三片的数据长度和片偏移为？",
      "options": {
        "A": "1480,1480,1040；0,185,370",
        "B": "1500,1500,1020；0,187,374",
        "C": "1480,1480,1060；0,1480,2960",
        "D": "1500,1500,1000；0,1500,3000"
      },
      "answer": "A",
      "explanation": "数据4000B，每片20B首部，最大1480且8整倍数；剩1040，偏移按8B单位0、1480/8=185、2960/8=370。"
    }
  ],
  "computer-networks:ch4-s2": [
    {
      "id": "cn-subnet-1",
      "type": "single",
      "stem": "一个 IPv4 子网的前缀为 /26，该子网可分配给主机的地址数最多为？",
      "options": {
        "A": "62",
        "B": "64",
        "C": "30",
        "D": "126"
      },
      "answer": "A",
      "explanation": "主机位 32−26=6 位，共 2⁶=64 个地址，去掉网络地址与广播地址，可用 62 个。"
    },
    {
      "id": "cn-subnet-2",
      "type": "single",
      "stem": "子网掩码的作用是？",
      "options": {
        "A": "区分 IP 地址中的网络号与主机号",
        "B": "加密 IP 地址",
        "C": "把 IP 地址转换为 MAC 地址",
        "D": "分配端口号"
      },
      "answer": "A",
      "explanation": "子网掩码与 IP 地址按位与运算，得到网络地址，从而区分网络号与主机号。"
    },
    {
      "id": "cn-subnet-3",
      "type": "single",
      "stem": "子网划分的做法是？",
      "options": {
        "A": "从主机号中借用若干位作为子网号",
        "B": "增加网络前缀长度之外的位数",
        "C": "把网络号借给主机",
        "D": "改变 IP 版本"
      },
      "answer": "A",
      "explanation": "子网划分向主机号借位作子网号，配合子网掩码使用。"
    },
    {
      "id": "cn-subnet-4-r2",
      "type": "judge",
      "stem": "CIDR 使用变长网络前缀，并支持路由聚合（构成超网）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "CIDR允许可变前缀并聚合连续且满足二进制前缀对齐的网络。任意相邻网络不能随意聚合为无额外覆盖的一条路由。"
    },
    {
      "id": "exam-computer-networks-ch4-s2-2011-38-b-r2",
      "type": "single",
      "stem": "一个 /30 IPv4 子网通常可分配给主机的地址数是？",
      "options": {
        "A": "2 个",
        "B": "1 个",
        "C": "4 个",
        "D": "6 个"
      },
      "answer": "A",
      "explanation": "4 个地址中通常扣除网络地址和定向广播地址，可用 2 个。"
    },
    {
      "id": "qa-20261002-computer-networks-ch4-s2-01",
      "type": "single",
      "stem": "把192.0.2.0/24均分为4个子网，第三个子网（按网络地址升序从1计）的网络地址与广播地址？",
      "options": {
        "A": "192.0.2.64与192.0.2.127",
        "B": "192.0.2.128与192.0.2.191",
        "C": "192.0.2.128与192.0.2.255",
        "D": "192.0.2.192与192.0.2.255"
      },
      "answer": "B",
      "explanation": "借2位为/26，网络起点0、64、128、192，第三个范围128..191。"
    }
  ],
  "computer-networks:ch4-s3": [
    {
      "id": "cn-arp-1",
      "type": "judge",
      "stem": "ARP 的作用是把同一局域网内的 IP 地址解析为对应的 MAC 地址。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "ARP 在本地链路广播询问「谁拥有该 IP」，目标主机单播回复自己的 MAC。"
    },
    {
      "id": "cn-dhcp-1-r2",
      "type": "single",
      "stem": "主机通过 DHCP 可以自动获得的是？",
      "options": {
        "A": "IP 地址、子网掩码、默认网关等配置",
        "B": "MAC 地址",
        "C": "域名对应的 IP",
        "D": "TCP 端口号"
      },
      "answer": "A",
      "explanation": "DHCP可提供地址、掩码、网关、DNS等参数，不负责MAC分配或域名查询。MAC也可本地配置、虚拟生成或随机化，并非必然固化于网卡。"
    },
    {
      "id": "cn-icmp-1",
      "type": "single",
      "stem": "ICMP 协议的主要用途是？",
      "options": {
        "A": "差错报告与网络探测（如 ping、traceroute）",
        "B": "分配 IP 地址",
        "C": "解析域名",
        "D": "加密传输"
      },
      "answer": "A",
      "explanation": "ICMP 报告差错（如目的不可达、超时）并提供 ping、traceroute 等探测。"
    },
    {
      "id": "cn-nat-1",
      "type": "judge",
      "stem": "NAT 技术实现私有地址与公网地址之间的转换。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "NAT 在边界路由器上把内部私有地址映射为公网地址，缓解地址枯竭。"
    },
    {
      "id": "cn-arp-2-r2",
      "type": "single",
      "stem": "在以太网中，主机首次解析同一链路邻居IPv4地址、ARP缓存无记录且采用常规请求/响应过程时，发送方式分别是？",
      "options": {
        "A": "请求广播、应答单播",
        "B": "请求单播、应答广播",
        "C": "都广播",
        "D": "都单播"
      },
      "answer": "A",
      "explanation": "ARP 请求以广播发送询问目标 IP 的 MAC，目标主机以单播回复。"
    },
    {
      "id": "exam-computer-networks-ch4-s3-2019-37-b-r2",
      "type": "single",
      "stem": "DHCP 客户端首次获取租约时常见的报文交互顺序是？",
      "options": {
        "A": "SYN、SYN-ACK、ACK、FIN",
        "B": "Discover、Offer、Request、ACK",
        "C": "查询、响应、关闭、重置",
        "D": "Hello、Update、Commit、Done"
      },
      "answer": "B",
      "explanation": "DORA 流程依次发现服务器、提供地址、请求地址并确认租约。"
    },
    {
      "id": "qa-20261002-computer-networks-ch4-s3-01",
      "type": "single",
      "stem": "A欲发往远端网络B，已知默认网关G同本链路，ARP缓存空。常规发送前A应解析谁的MAC？",
      "options": {
        "A": "远端B",
        "B": "本链路网关G",
        "C": "根DNS服务器",
        "D": "任意同网段主机"
      },
      "answer": "B",
      "explanation": "IP目的仍为B，第一跳以太帧目的为G，需要ARP网关本链路IPv4地址。"
    }
  ],
  "computer-networks:ch4-s4": [
    {
      "id": "cn-routing-1",
      "type": "single",
      "stem": "RIP 与 OSPF 分别属于哪类路由协议？",
      "options": {
        "A": "距离向量 / 链路状态",
        "B": "链路状态 / 距离向量",
        "C": "都是链路状态",
        "D": "都是距离向量"
      },
      "answer": "A",
      "explanation": "RIP 基于距离向量、以跳数为度量；OSPF 基于链路状态、用 Dijkstra 计算最短路径。"
    },
    {
      "id": "cn-routing-2",
      "type": "single",
      "stem": "RIP 协议基于哪种算法？",
      "options": {
        "A": "距离向量算法（Bellman–Ford）",
        "B": "链路状态算法（Dijkstra）",
        "C": "哈希算法",
        "D": "快速排序"
      },
      "answer": "A",
      "explanation": "RIP 通过邻居交换距离向量表，基于 Bellman–Ford 迭代更新。"
    },
    {
      "id": "cn-routing-4-r2",
      "type": "single",
      "stem": "按自治系统内外的路由交换范围分类，BGP属于哪类协议？",
      "options": {
        "A": "外部网关协议，交换自治系统间可达性信息",
        "B": "内部网关协议，限定单个自治系统内部",
        "C": "物理层线路编码协议",
        "D": "链路层介质访问协议"
      },
      "answer": "A",
      "explanation": "BGP按路由范围属于外部网关协议；按协议承载层次又运行于TCP之上。原题把外部网关与应用层混为互斥选项，导致A和D均可成立。RFC4271。"
    },
    {
      "id": "cn-routing-5",
      "type": "judge",
      "stem": "RIP 规定最大跳数为 15，16 表示不可达。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "RIP 用跳数作度量，超过 15 跳视为不可达，因此只适合小型网络。"
    },
    {
      "id": "exam-computer-networks-ch4-s4-2021-37-a-r2",
      "type": "single",
      "stem": "距离向量路由器更新到目的网络的距离时，核心计算是？",
      "options": {
        "A": "经邻居的链路代价加邻居通告距离取最小值",
        "B": "只取所有链路代价的最大值",
        "C": "使用 DNS 查询目的地址",
        "D": "按 MAC 地址排序"
      },
      "answer": "A",
      "explanation": "Bellman-Ford 形式的距离向量更新对所有邻居计算代价并取最小。"
    },
    {
      "id": "qa-20261002-computer-networks-ch4-s4-01",
      "type": "single",
      "stem": "路由器R经邻居X的链路代价2，X通告到N代价5；经Y代价4，Y通告到N代价2。距离向量应选择？",
      "options": {
        "A": "X，总代价5",
        "B": "X，总代价7",
        "C": "Y，总代价6",
        "D": "Y，总代价2"
      },
      "answer": "C",
      "explanation": "候选2+5=7与4+2=6，选Y6，不能忽略本地到邻居代价。"
    }
  ],
  "computer-networks:ch4-s5": [
    {
      "id": "cn-fwd-1",
      "type": "single",
      "stem": "路由器工作在网络层，其主要作用是？",
      "options": {
        "A": "根据路由表转发分组并隔离广播域",
        "B": "放大信号",
        "C": "转发 MAC 帧",
        "D": "提供端口"
      },
      "answer": "A",
      "explanation": "路由器连接不同网络，按路由表转发 IP 分组，并隔离广播域。"
    },
    {
      "id": "cn-fwd-2",
      "type": "single",
      "stem": "路由器转发分组时依据的原则是？",
      "options": {
        "A": "最长前缀匹配",
        "B": "最短前缀匹配",
        "C": "随机选择",
        "D": "按端口顺序"
      },
      "answer": "A",
      "explanation": "在路由表中选取与目的地址前缀匹配最长的那条路由。"
    },
    {
      "id": "cn-fwd-3",
      "type": "judge",
      "stem": "路由器可以连接采用不同链路层协议的异构网络。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "网络层屏蔽底层差异，使异构网络可以互联。"
    },
    {
      "id": "cn-fwd-4",
      "type": "single",
      "stem": "三层交换机相比普通交换机多出的能力是？",
      "options": {
        "A": "基于 IP 的路由转发",
        "B": "物理层中继",
        "C": "无线接入",
        "D": "域名解析"
      },
      "answer": "A",
      "explanation": "三层交换机在二层交换基础上支持 IP 路由，兼具交换与路由功能。"
    },
    {
      "id": "cn-fwd-5",
      "type": "judge",
      "stem": "路由器默认不转发广播分组。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "路由器隔离广播域，默认不转发广播，避免广播风暴扩散。"
    },
    {
      "id": "exam-computer-networks-ch4-s5-2011-37-b-r2",
      "type": "single",
      "stem": "路由器收到目的网络不可达的分组时，可以通过什么协议报告差错？",
      "options": {
        "A": "ARP",
        "B": "DHCP",
        "C": "ICMP",
        "D": "FTP"
      },
      "answer": "C",
      "explanation": "ICMP 用于传送网络层差错报告和诊断信息。"
    },
    {
      "id": "qa-20261002-computer-networks-ch4-s5-01",
      "type": "single",
      "stem": "转发表10.0.0.0/8→A、10.1.0.0/16→B、10.1.2.0/24→C、默认→D。目的10.1.2.129选？",
      "options": {
        "A": "A",
        "B": "B",
        "C": "C",
        "D": "D"
      },
      "answer": "C",
      "explanation": "同时匹配/8 /16 /24，最长/24最具体，选C。"
    }
  ],
  "computer-networks:ch5-s1": [
    {
      "id": "cn-tport-1",
      "type": "single",
      "stem": "传输层提供的通信是？",
      "options": {
        "A": "端到端（进程到进程）通信",
        "B": "主机到主机通信",
        "C": "链路到链路通信",
        "D": "物理到物理通信"
      },
      "answer": "A",
      "explanation": "传输层通过端口把通信定位到进程，实现端到端通信。"
    },
    {
      "id": "cn-tport-2",
      "type": "single",
      "stem": "传输层用端口号标识进程，端口号的范围是？",
      "options": {
        "A": "0–65535",
        "B": "0–255",
        "C": "0–1023",
        "D": "0–1024"
      },
      "answer": "A",
      "explanation": "端口号 16 位，范围 0–65535；0–1023 为熟知端口。"
    },
    {
      "id": "cn-tport-3",
      "type": "judge",
      "stem": "TCP 面向连接且可靠，UDP 无连接且不保证可靠。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "TCP 提供可靠有序的字节流；UDP 尽力交付、开销小。"
    },
    {
      "id": "cn-tport-4",
      "type": "single",
      "stem": "传输层的“复用”与“分用”是指？",
      "options": {
        "A": "发送方多个进程共用传输层，接收方按端口把数据交给对应进程",
        "B": "把多个网络合并",
        "C": "加密与解密",
        "D": "分段与重组"
      },
      "answer": "A",
      "explanation": "复用指多进程共用传输层发送；分用指接收方按端口交付给正确进程。"
    },
    {
      "id": "cn-tport-5",
      "type": "judge",
      "stem": "TCP 的协议数据单元称为报文段，UDP 的称为用户数据报。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "TCP 数据单元是报文段（segment），UDP 是用户数据报（datagram）。"
    },
    {
      "id": "qa-20261002-computer-networks-ch5-s1-01",
      "type": "single",
      "stem": "同一服务器同时使用TCP端口53和UDP端口53提供DNS，这两个端点如何区分？",
      "options": {
        "A": "无法区分，端口不能复用",
        "B": "根据传输协议与端口共同区分",
        "C": "仅看MAC地址区分",
        "D": "必须改成不同IP"
      },
      "answer": "B",
      "explanation": "TCP和UDP有独立端口空间，网络层协议字段先区分TCP与UDP再按端口分用。"
    }
  ],
  "computer-networks:ch5-s2": [
    {
      "id": "cn-udp-1",
      "type": "single",
      "stem": "关于 UDP，下列说法正确的是？",
      "options": {
        "A": "无连接、不可靠，首部仅 8 字节",
        "B": "面向连接、可靠，首部 20 字节",
        "C": "提供流量控制",
        "D": "保证数据按序到达"
      },
      "answer": "A",
      "explanation": "UDP 无连接、不保证可靠与有序，首部固定 8 字节，开销小、时延低。"
    },
    {
      "id": "cn-udp-2",
      "type": "single",
      "stem": "UDP 首部包含哪些字段（共 8 字节）？",
      "options": {
        "A": "源端口、目的端口、长度、校验和",
        "B": "序号、确认号、窗口",
        "C": "版本、首部长度、TTL",
        "D": "类型、代码、校验和"
      },
      "answer": "A",
      "explanation": "UDP 首部仅 4 个字段，各 2 字节，共 8 字节。"
    },
    {
      "id": "cn-udp-3-r2",
      "type": "judge",
      "stem": "在 IPv4 中，UDP 的校验和字段是可选的（可以置 0 表示不校验）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "IPv4中UDP校验和0表示未计算校验和；计算结果为0时应编码为全1。IPv6中一般必须校验，但规范允许少数专门配置的UDP隧道例外，不能扩大为绝无例外。"
    },
    {
      "id": "cn-tcpseg-1",
      "type": "single",
      "stem": "TCP 首部的最小长度是？",
      "options": {
        "A": "20 字节",
        "B": "8 字节",
        "C": "40 字节",
        "D": "60 字节"
      },
      "answer": "A",
      "explanation": "TCP 固定首部 20 字节，含选项时最长 60 字节。"
    },
    {
      "id": "cn-tcpseg-2-r2",
      "type": "judge",
      "stem": "ACK标志有效时，TCP确认号表示下一期望收到的序号，SYN/FIN也各占一个序号。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "ACK有效时，确认号是期望收到对方下一个序号，确认其前面已连续收到的序号。序号以随机初始序号为基准，SYN/FIN也各占一个序号，不能简单写成累计数据字节数加1。"
    },
    {
      "id": "qa-20261002-computer-networks-ch5-s2-01",
      "type": "single",
      "stem": "已建立TCP连接，接收方期望序号1000，连续收到序号1000起的300B与序号1400起的100B，尚未收到1300..1399。累计ACK确认号？",
      "options": {
        "A": "1300",
        "B": "1400",
        "C": "1500",
        "D": "1000"
      },
      "answer": "A",
      "explanation": "累计确认只推进连续前缀，已收1000..1299，下一个缺1300；乱序1400..1499不能使ACK越过空洞。"
    }
  ],
  "computer-networks:ch5-s3": [
    {
      "id": "cn-tcp-1",
      "type": "single",
      "stem": "TCP 建立连接采用三次握手的根本原因是？",
      "options": {
        "A": "防止已失效的连接请求报文段突然传到服务器造成错误连接",
        "B": "为了协商窗口大小",
        "C": "为了加密密钥",
        "D": "为了确定路由"
      },
      "answer": "A",
      "explanation": "三次握手让双方都确认对方的收发能力，并避免旧连接请求导致服务器建立无效连接。"
    },
    {
      "id": "cn-tcp-2",
      "type": "single",
      "stem": "TCP 三次握手的报文顺序是？",
      "options": {
        "A": "SYN → SYN+ACK → ACK",
        "B": "ACK → SYN → FIN",
        "C": "SYN → ACK → SYN",
        "D": "FIN → ACK → FIN"
      },
      "answer": "A",
      "explanation": "客户端发 SYN，服务器回 SYN+ACK，客户端再回 ACK，连接建立。"
    },
    {
      "id": "cn-tcp-3-r2",
      "type": "judge",
      "stem": "TCP是全双工的，两个方向可分别关闭；正常关闭一定必须使用四个独立报文段，不能合并ACK和FIN。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "两个方向需要各自FIN并获确认，但确认一个方向的ACK可与另一方向FIN在同一段发送，正常关闭可有三个报文段。"
    },
    {
      "id": "cn-tcp-4",
      "type": "single",
      "stem": "主动关闭方进入 TIME_WAIT 状态并等待 2MSL 的主要目的是？",
      "options": {
        "A": "确保最后的 ACK 到达，并让旧报文段在网络中消失",
        "B": "加快连接建立",
        "C": "节省端口",
        "D": "加密数据"
      },
      "answer": "A",
      "explanation": "等待 2MSL 保证最后 ACK 可重传，且旧连接的迟到报文段失效。"
    },
    {
      "id": "cn-tcp-5",
      "type": "judge",
      "stem": "SYN 洪泛攻击利用了 TCP 三次握手中服务器维护半连接的特性。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "攻击者大量发送 SYN 不完成握手，耗尽服务器半连接队列。"
    },
    {
      "id": "qa-20261002-computer-networks-ch5-s3-01",
      "type": "single",
      "stem": "客户端SYN序号100，服务端SYN+ACK序号500且确认101。普通第三次握手无数据ACK的序号、确认号分别为？",
      "options": {
        "A": "100、500",
        "B": "101、501",
        "C": "101、500",
        "D": "102、501"
      },
      "answer": "B",
      "explanation": "SYN各占一个序号；客户端下一个101，期望服务器501。纯ACK不占新序号。"
    }
  ],
  "computer-networks:ch5-s4": [
    {
      "id": "cn-cc-1-r2",
      "type": "single",
      "stem": "经典TCP慢开始中，每段分别确认、发送方持续有数据且无接收窗口限制时，cwnd在未到阈值期间按RTT近似如何增长？",
      "options": {
        "A": "每经过一个往返时延按指数增长（翻倍）",
        "B": "每个往返时延加 1",
        "C": "保持恒定",
        "D": "线性递减"
      },
      "answer": "A",
      "explanation": "每个新数据ACK增长约1MSS，充分发送且逐段确认时，一个RTT约翻倍。延迟确认、应用受限和接收窗口可能改变增长；初始窗口不必恒为1MSS。"
    },
    {
      "id": "cn-cc-2",
      "type": "single",
      "stem": "TCP 快重传算法中，发送方连续收到几个对同一报文段的重复确认就立即重传？",
      "options": {
        "A": "3 个",
        "B": "1 个",
        "C": "5 个",
        "D": "10 个"
      },
      "answer": "A",
      "explanation": "连续收到 3 个重复 ACK 说明后续报文段已到达而该段丢失，立即重传而不等超时。"
    },
    {
      "id": "cn-rel-1",
      "type": "single",
      "stem": "TCP 实现可靠传输所依赖的机制不包括？",
      "options": {
        "A": "路由选择",
        "B": "序号与确认",
        "C": "超时重传",
        "D": "滑动窗口"
      },
      "answer": "A",
      "explanation": "TCP 用序号、确认、重传和滑动窗口保证可靠；路由选择是网络层职责。"
    },
    {
      "id": "cn-rel-2",
      "type": "judge",
      "stem": "TCP 的超时重传时间 RTO 基于对往返时延 RTT 的加权估计。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "RTO 由平滑 RTT 与偏差估计动态计算，适应网络变化。"
    },
    {
      "id": "cn-cc-3",
      "type": "single",
      "stem": "TCP 拥塞控制包含哪四个部分？",
      "options": {
        "A": "慢开始、拥塞避免、快重传、快恢复",
        "B": "建连、传输、断开、重传",
        "C": "复用、分用、封装、解封装",
        "D": "寻址、路由、转发、分片"
      },
      "answer": "A",
      "explanation": "TCP 拥塞控制由慢开始、拥塞避免、快重传和快恢复组成。"
    },
    {
      "id": "qa-20261002-computer-networks-ch5-s4-01",
      "type": "single",
      "stem": "经典Reno中发生重传超时，FlightSize=12MSS，按RFC5681取ssthresh=max(FlightSize/2,2MSS)，cwnd置1MSS，得到？",
      "options": {
        "A": "ssthresh6、cwnd1",
        "B": "ssthresh12、cwnd6",
        "C": "ssthresh1、cwnd6",
        "D": "ssthresh6、cwnd6"
      },
      "answer": "A",
      "explanation": "在途量半数6MSS超过最小2MSS，阈值6；超时窗口1。三重复ACK后的快速恢复处理不同。"
    }
  ],
  "computer-networks:ch6-s1": [
    {
      "id": "cn-dns-1",
      "type": "single",
      "stem": "关于 DNS 查询，下列说法正确的是？",
      "options": {
        "A": "递归查询由被请求服务器代为继续查询，迭代查询由请求方自行继续查询",
        "B": "DNS 只能使用 TCP",
        "C": "DNS 默认端口是 80",
        "D": "DNS 用于分配 IP 地址"
      },
      "answer": "A",
      "explanation": "递归查询中服务器替客户完成解析，迭代查询中服务器只返回下一步应询问的服务器；DNS 主要用 UDP 53 端口。"
    },
    {
      "id": "cn-dns-2",
      "type": "single",
      "stem": "网络应用主要有哪两种模型？",
      "options": {
        "A": "客户/服务器（C/S）与对等（P2P）",
        "B": "同步与异步",
        "C": "串行与并行",
        "D": "单播与组播"
      },
      "answer": "A",
      "explanation": "C/S 模型有中心服务器；P2P 模型各结点地位对等、直接通信。"
    },
    {
      "id": "cn-dns-3",
      "type": "judge",
      "stem": "DNS 服务器按层次分为根域名服务器、顶级域名服务器和权威域名服务器。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "DNS 采用层次化结构，自顶向下逐级解析。"
    },
    {
      "id": "cn-dns-4",
      "type": "single",
      "stem": "DNS 查询主要使用哪个传输层协议和端口？",
      "options": {
        "A": "UDP，53 端口",
        "B": "TCP，80 端口",
        "C": "UDP，21 端口",
        "D": "TCP，53 端口（仅）"
      },
      "answer": "A",
      "explanation": "DNS 常规查询用 UDP 53；区域传送等用 TCP 53。"
    },
    {
      "id": "qa-20261002-computer-networks-ch6-s1-01",
      "type": "single",
      "stem": "DNS递归解析器收到请求，缓存无记录，根服务器返回相应顶级服务器地址。接下来通常谁询问顶级服务器？",
      "options": {
        "A": "原用户必须逐级询问",
        "B": "递归解析器继续询问",
        "C": "根服务器必须自己代查到底",
        "D": "客户端TCP强制关闭"
      },
      "answer": "B",
      "explanation": "解析器对用户提供递归服务，同时通常以迭代方式向根、顶级、权威逐级查询。"
    }
  ],
  "computer-networks:ch6-s2": [
    {
      "id": "cn-ftp-1-r2",
      "type": "single",
      "stem": "FTP采用经典主动模式且使用默认端口时，控制连接的服务器端口与数据连接的服务器端口通常分别是？",
      "options": {
        "A": "控制连接（21）与数据连接（20）",
        "B": "只有数据连接",
        "C": "只有控制连接",
        "D": "加密连接与明文连接"
      },
      "answer": "A",
      "explanation": "经典主动模式控制服务器端口21，数据连接服务器端口20；被动模式由服务器告知另一个监听端口，数据端口不是固定20。RFC959及王道网络OCR第290页。"
    },
    {
      "id": "cn-ftp-2",
      "type": "judge",
      "stem": "FTP 的控制连接在整个会话期间保持，数据连接按需建立和关闭。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "控制连接保持到会话结束，数据连接每传一次文件建立一次。"
    },
    {
      "id": "cn-mail-1",
      "type": "single",
      "stem": "电子邮件的发送和读取分别常用什么协议？",
      "options": {
        "A": "发送用 SMTP，读取常用 POP3/IMAP",
        "B": "发送用 POP3，读取用 SMTP",
        "C": "都用 FTP",
        "D": "都用 DNS"
      },
      "answer": "A",
      "explanation": "SMTP 负责发送与服务器间投递，POP3/IMAP 供用户读取邮箱。"
    },
    {
      "id": "cn-mail-2",
      "type": "judge",
      "stem": "MIME 扩展了电子邮件对非 ASCII 文本与附件的支持。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "MIME 定义了编码与内容类型，使邮件可传多媒体和附件。"
    },
    {
      "id": "cn-mail-3-r2",
      "type": "single",
      "stem": "邮件服务器之间以SMTP进行邮件投递，标准熟知TCP端口是？",
      "options": {
        "A": "25",
        "B": "80",
        "C": "53",
        "D": "110"
      },
      "answer": "A",
      "explanation": "SMTP 默认端口 25（提交常用 587，加密用 465）。"
    },
    {
      "id": "qa-20261002-computer-networks-ch6-s2-01",
      "type": "single",
      "stem": "FTP被动模式中服务器告知监听端口50000，客户端随后传文件。数据TCP连接通常由谁发起、连接哪个服务器端口？",
      "options": {
        "A": "服务器发起，服务器固定20",
        "B": "客户端发起，服务器50000",
        "C": "客户端发起，服务器21",
        "D": "服务器发起，服务器25"
      },
      "answer": "B",
      "explanation": "PASV让服务器监听并通告数据端口，客户端主动连接；21承载控制而20仅经典主动数据默认端口。"
    }
  ],
  "computer-networks:ch6-s3": [
    {
      "id": "cn-http-1-r2",
      "type": "single",
      "stem": "关于传统HTTP/1.1及http URI，下列说法正确的是？",
      "options": {
        "A": "HTTP 是无状态协议，默认端口 80",
        "B": "HTTP 是面向连接的传输层协议",
        "C": "HTTP 默认端口是 443",
        "D": "HTTP 保证可靠传输"
      },
      "answer": "A",
      "explanation": "HTTP 是应用层无状态协议，默认端口 80（HTTPS 为 443），可靠传输由下层的 TCP 保证。"
    },
    {
      "id": "cn-http-2",
      "type": "single",
      "stem": "URL 通常由哪些部分组成？",
      "options": {
        "A": "协议、主机、端口（可选）、路径等",
        "B": "只有 IP 地址",
        "C": "只有域名",
        "D": "MAC 地址与端口"
      },
      "answer": "A",
      "explanation": "URL 形如 协议://主机[:端口]/路径，用于定位资源。"
    },
    {
      "id": "cn-http-4",
      "type": "single",
      "stem": "Cookie 的主要作用是？",
      "options": {
        "A": "在无状态的 HTTP 上维持会话状态",
        "B": "加密传输",
        "C": "加速路由",
        "D": "解析域名"
      },
      "answer": "A",
      "explanation": "服务器通过 Cookie 在客户端保存标识，弥补 HTTP 无状态的不足。"
    },
    {
      "id": "cn-http-5",
      "type": "judge",
      "stem": "HTTP/1.1 默认使用持久连接，可在一个 TCP 连接上传输多个请求响应。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "HTTP/1.1 默认 keep-alive，减少连接建立开销。"
    },
    {
      "id": "qa-20261002-computer-networks-ch6-s3-01",
      "type": "single",
      "stem": "HTTP/1.1无流水线，已无缓存，先取HTML再顺序取2个图片，三对象同服务器且用同一持久TCP连接。忽略传输、DNS、关闭时间，一个TCP建立需1RTT，每对象请求响应需1RTT，共多少RTT？",
      "options": {
        "A": "3",
        "B": "4",
        "C": "6",
        "D": "9"
      },
      "answer": "B",
      "explanation": "建连1加HTML1加两个图片各1，合4；若非持久且每对象各建连接则6。"
    }
  ]
});
})(window);
