/* 逐题知识与质量复核后的学习练习；由审计草稿合并。 */
(function(g){
  g.ZhixuQuestionBankVersion="question-quality-20261002-r2";
  Object.assign(g.ZhixuQuestions=g.ZhixuQuestions||{},{
  "computer-organization:ch1-s1": [
    {
      "id": "co-vn-1",
      "type": "judge",
      "stem": "冯·诺依曼结构的核心思想是“存储程序”，指令和数据以同等地位存放在存储器中。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "冯·诺依曼结构以存储程序、程序控制为核心，指令与数据同等地位存于同一存储器。"
    },
    {
      "id": "co-vn-2",
      "type": "single",
      "stem": "冯·诺依曼计算机的五大部件是？",
      "options": {
        "A": "运算器、控制器、存储器、输入设备、输出设备",
        "B": "CPU、内存、硬盘、键盘、显示器",
        "C": "寄存器、Cache、主存、辅存、总线",
        "D": "ALU、PC、IR、MAR、MDR"
      },
      "answer": "A",
      "explanation": "五大部件为运算器、控制器、存储器、输入设备和输出设备。"
    },
    {
      "id": "co-vn-4",
      "type": "single",
      "stem": "计算机系统的层次结构自下而上通常为？",
      "options": {
        "A": "硬件→系统软件→应用软件",
        "B": "应用软件→系统软件→硬件",
        "C": "系统软件→硬件→应用软件",
        "D": "硬件→应用软件→系统软件"
      },
      "answer": "A",
      "explanation": "最底层是硬件，其上为系统软件，最上层是应用软件。"
    },
    {
      "id": "co-vn-5",
      "type": "judge",
      "stem": "现代计算机已从以运算器为中心发展为以存储器为中心。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "早期冯·诺依曼机以运算器为中心，现代机器改为以存储器为中心。"
    },
    {
      "id": "exam-co-overview-2022-12-r2",
      "type": "single",
      "stem": "同一程序在两个处理器上运行，指令数相同。若时钟频率相同而处理器甲的平均 CPI 更低，甲的 CPU 执行时间怎样？",
      "options": {
        "A": "更短",
        "B": "更长",
        "C": "相同",
        "D": "无法比较"
      },
      "answer": "A",
      "explanation": "CPU 时间与指令数和平均 CPI 的乘积成正比；其余条件相同，CPI 更低则执行时间更短。"
    },
    {
      "id": "qa-20261002-computer-organization-ch1-s1-01",
      "type": "single",
      "stem": "同一主存地址内容为某二进制字，CPU先把它当数据读取，后跳转到该地址取指。这能否仅由内容自动区分指令与数据？",
      "options": {
        "A": "能，数据最低位一定0",
        "B": "能，所有指令只在ROM",
        "C": "不能，解释由取指或数据访问上下文决定",
        "D": "能，指令最高位一定1"
      },
      "answer": "C",
      "explanation": "统一存储不附带普遍的指令/数据标签；取指时按ISA解码该位模式，数据访问按数据解释。"
    }
  ],
  "computer-organization:ch1-s2": [
    {
      "id": "co-sw-1",
      "type": "single",
      "stem": "计算机软件通常分为？",
      "options": {
        "A": "系统软件与应用软件",
        "B": "编译软件与解释软件",
        "C": "输入软件与输出软件",
        "D": "硬件软件与固件"
      },
      "answer": "A",
      "explanation": "系统软件管理硬件并提供平台，应用软件解决具体问题。"
    },
    {
      "id": "co-sw-3",
      "type": "judge",
      "stem": "软件和硬件在逻辑功能上是等价的，某些功能既可用硬件也可用软件实现。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "软硬件在逻辑上可相互替代，如乘法可用硬件乘法器或软件循环实现。"
    },
    {
      "id": "co-sw-4",
      "type": "single",
      "stem": "计算机中的固件通常是指什么？",
      "options": {
        "A": "固化在 ROM 中的程序，介于软硬件之间",
        "B": "纯硬件电路",
        "C": "纯应用软件",
        "D": "操作系统内核"
      },
      "answer": "A",
      "explanation": "固件是写入 ROM/闪存的程序，具有软件的灵活性又像硬件一样固定。"
    },
    {
      "id": "co-sw-5",
      "type": "judge",
      "stem": "编译程序属于系统软件。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "编译程序、操作系统、数据库管理系统等属于系统软件。"
    },
    {
      "id": "qa-20261002-computer-organization-ch1-s2-01",
      "type": "single",
      "stem": "一处理器无硬件乘法指令，软件用移位加法算整数乘积。关于软硬件逻辑等价，最合理结论是？",
      "options": {
        "A": "软件实现后必须完全同速度",
        "B": "没有乘法器就绝不能算乘积",
        "C": "软件必定比硬件更快",
        "D": "结果功能可相同但速度和资源代价可不同"
      },
      "answer": "D",
      "explanation": "有限整数乘法可拆为位移与加法，实现相同逻辑功能不保证时间功耗面积代价相同。"
    }
  ],
  "computer-organization:ch1-s3": [
    {
      "id": "co-sp-2",
      "type": "single",
      "stem": "一条指令的执行过程通常包括？",
      "options": {
        "A": "取指、译码、执行",
        "B": "输入、处理、输出",
        "C": "编译、链接、运行",
        "D": "读、写、擦除"
      },
      "answer": "A",
      "explanation": "基本过程为取指、译码、执行，间址与中断周期可选。"
    },
    {
      "id": "co-sp-3",
      "type": "judge",
      "stem": "机器指令一般由操作码和地址码两部分组成。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "操作码指明做什么，地址码指明操作数或结果位置。"
    },
    {
      "id": "co-sp-4-r2",
      "type": "single",
      "stem": "程序计数器 PC 的作用是？",
      "options": {
        "A": "存放下一条待取指令地址，顺序执行时按指令长度和编址单位递增",
        "B": "存放当前指令内容",
        "C": "存放运算结果",
        "D": "存放操作数"
      },
      "answer": "A",
      "explanation": "PC保存待取指令地址。按字节编址的4字节定长指令通常PC+4；转移时加载目标地址，不能普遍说加1。"
    },
    {
      "id": "co-sp-5",
      "type": "judge",
      "stem": "指令一般按地址顺序执行，遇到转移指令时改变执行顺序。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "转移、调用、返回等指令会修改 PC，改变程序流程。"
    },
    {
      "id": "qa-20261002-computer-organization-ch1-s3-01",
      "type": "single",
      "stem": "按字节编址、定长4字节指令，顺序取指前PC=0x1000且无转移，取指后下一指令PC应为？",
      "options": {
        "A": "0x1004",
        "B": "0x1001",
        "C": "0x1010",
        "D": "0x1000"
      },
      "answer": "A",
      "explanation": "一条指令占4个字节地址，顺序PC加4；加1需要另行字编址约定。"
    }
  ],
  "computer-organization:ch1-s4": [
    {
      "id": "co-perf-1",
      "type": "single",
      "stem": "若 CPU 主频为 1GHz，则一个时钟周期为？",
      "options": {
        "A": "1ns",
        "B": "1ms",
        "C": "1μs",
        "D": "1s"
      },
      "answer": "A",
      "explanation": "1GHz = 10⁹ 个时钟周期/秒，故时钟周期 = 1/10⁹ s = 1ns。"
    },
    {
      "id": "co-perf-2",
      "type": "single",
      "stem": "性能指标 CPI 表示什么？",
      "options": {
        "A": "每条指令平均所需时钟周期数",
        "B": "每秒执行的指令数",
        "C": "主频的倒数",
        "D": "Cache 命中率"
      },
      "answer": "A",
      "explanation": "CPI（Cycles Per Instruction）是执行一条指令平均所需的时钟周期数。"
    },
    {
      "id": "co-perf-3",
      "type": "judge",
      "stem": "主频与时钟周期互为倒数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "时钟周期 = 1/主频，主频越高时钟周期越短。"
    },
    {
      "id": "co-perf-4",
      "type": "single",
      "stem": "CPU 执行时间等于？",
      "options": {
        "A": "指令数 × CPI × 时钟周期",
        "B": "指令数 × 主频",
        "C": "CPI × 主频",
        "D": "指令数 ÷ 主频"
      },
      "answer": "A",
      "explanation": "CPU 时间 = 指令条数 × CPI × 时钟周期长度（或 = 指令数×CPI/主频）。"
    },
    {
      "id": "co-perf-5-r2",
      "type": "judge",
      "stem": "同一程序在两个处理器上执行且动态指令数相同，测得的MIPS较大者CPU执行时间较短。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "MIPS=IC/(CPU时间×10^6)。IC固定时MIPS越大时间越短；不同程序/编译结果的IC可能不同，仅同ISA不能推断。"
    },
    {
      "id": "qa-20261002-computer-organization-ch1-s4-01",
      "type": "single",
      "stem": "程序动态指令数2×10^6、平均CPI=1.5、主频3GHz，CPU时间为？",
      "options": {
        "A": "0.5ms",
        "B": "1ms",
        "C": "1μs",
        "D": "3ms"
      },
      "answer": "B",
      "explanation": "总周期3×10^6，除3×10^9周期/秒=10^-3秒=1ms。"
    }
  ],
  "computer-organization:ch2-s1": [
    {
      "id": "co-base-1",
      "type": "single",
      "stem": "十进制数 43 用二进制表示是？",
      "options": {
        "A": "101011",
        "B": "110101",
        "C": "101101",
        "D": "100011"
      },
      "answer": "A",
      "explanation": "43 = 32+8+2+1 = 2⁵+2³+2¹+2⁰，即 101011。"
    },
    {
      "id": "co-base-2",
      "type": "single",
      "stem": "二进制数转换为八进制或十六进制时，常用的方法是？",
      "options": {
        "A": "按 3 位或 4 位分组转换",
        "B": "逐位取反",
        "C": "乘 2 取整",
        "D": "除以基数取余"
      },
      "answer": "A",
      "explanation": "二进制每 3 位对应 1 位八进制，每 4 位对应 1 位十六进制。"
    },
    {
      "id": "co-base-3",
      "type": "judge",
      "stem": "任意进制数转换为十进制，可按位权展开求和。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "按权展开：各位数字乘以基数的相应次幂后求和。"
    },
    {
      "id": "co-base-4",
      "type": "single",
      "stem": "把十进制小数转换为二进制小数，常用？",
      "options": {
        "A": "乘 2 取整法",
        "B": "除 2 取余法",
        "C": "按权展开",
        "D": "分组法"
      },
      "answer": "A",
      "explanation": "小数部分不断乘 2，取整数位作为二进制位，直到为 0 或达精度。"
    },
    {
      "id": "co-base-5",
      "type": "judge",
      "stem": "8421 BCD 码用 4 位二进制表示 1 位十进制数字。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "8421 码各位权为 8、4、2、1，直接对应十进制数字。"
    },
    {
      "id": "exam-co-data-2023-13-r2",
      "type": "single",
      "stem": "用 8 位二进制补码表示 −13，结果是哪一个？",
      "options": {
        "A": "11110011",
        "B": "11110101",
        "C": "00001101",
        "D": "10001101"
      },
      "answer": "A",
      "explanation": "13 的 8 位二进制为 00001101，按位取反并加 1 得 11110011。"
    },
    {
      "id": "qa-20261002-computer-organization-ch2-s1-01",
      "type": "single",
      "stem": "十六进制数2A.8转十进制为？",
      "options": {
        "A": "26.5",
        "B": "40.5",
        "C": "42.5",
        "D": "42.8"
      },
      "answer": "C",
      "explanation": "整数2×16+10=42，小数8/16=0.5。"
    }
  ],
  "computer-organization:ch2-s2": [
    {
      "id": "co-fixed-1-r2",
      "type": "single",
      "stem": "8位二进制补码整数1000 0000的真值是？",
      "options": {
        "A": "−128",
        "B": "−127",
        "C": "0",
        "D": "+128"
      },
      "answer": "A",
      "explanation": "补码整数各位权为−2^7,2^6,...,2^0，所以10000000=−128；范围[−128,127]，并非额外临时规定。",
      "hint": "补码的表示范围是 −2ⁿ⁻¹ 到 2ⁿ⁻¹−1。"
    },
    {
      "id": "co-fixed-3",
      "type": "judge",
      "stem": "补码中 0 的表示唯一，而原码有 +0 和 −0 两种表示。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "补码的 0 只有一种形式，这也是补码优于原码的原因之一。"
    },
    {
      "id": "co-fixed-4",
      "type": "single",
      "stem": "对于正数，其原码、反码、补码的关系是？",
      "options": {
        "A": "三者相同",
        "B": "原码=补码，反码不同",
        "C": "三者都不同",
        "D": "原码与反码相同，补码不同"
      },
      "answer": "A",
      "explanation": "正数的原码、反码、补码完全相同；负数需转换。"
    },
    {
      "id": "co-fixed-5",
      "type": "judge",
      "stem": "移码常用于表示浮点数的阶码。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "移码便于比较阶码大小，常用于 IEEE 754 的阶码表示。"
    },
    {
      "id": "qa-20261002-computer-organization-ch2-s2-01",
      "type": "single",
      "stem": "8位补码整数−5扩成16位后，机器码应为？",
      "options": {
        "A": "0000000011111011",
        "B": "1000000000000101",
        "C": "1111111100000101",
        "D": "1111111111111011"
      },
      "answer": "D",
      "explanation": "−5八位11111011，符号扩展补8个1，数值仍−5；补0会变正251。"
    }
  ],
  "computer-organization:ch2-s3": [
    {
      "id": "co-arith-1",
      "type": "single",
      "stem": "计算机中实现减法运算通常采用的方法是？",
      "options": {
        "A": "把减法转换为补码加法",
        "B": "直接做十进制减法",
        "C": "用原码直接相减",
        "D": "用反码直接相减"
      },
      "answer": "A",
      "explanation": "补码把加减法统一为加法，简化运算部件设计。"
    },
    {
      "id": "co-arith-2",
      "type": "single",
      "stem": "判断补码加法是否溢出，常用方法是？",
      "options": {
        "A": "看最高位进位与次高位进位是否相同",
        "B": "看结果是否为 0",
        "C": "看符号位",
        "D": "看是否进位"
      },
      "answer": "A",
      "explanation": "两进位异或为 1 则溢出；也可用双符号位判断。"
    },
    {
      "id": "co-arith-3",
      "type": "judge",
      "stem": "两个正数相加得到负数、或两个负数相加得到正数，说明发生了溢出。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "同号相加结果异号即溢出，这是溢出的直观表现。"
    },
    {
      "id": "co-arith-5-r2",
      "type": "judge",
      "stem": "对补码有符号整数，算术右移高位补原符号位；对无符号位串做逻辑右移则高位补0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "算术移位用于有符号数，逻辑移位用于无符号数。"
    },
    {
      "id": "qa-20261002-computer-organization-ch2-s3-01",
      "type": "single",
      "stem": "8位补码整数100+60，保留8位结果；有符号真值及溢出情况为？",
      "options": {
        "A": "−96，有溢出",
        "B": "160，无溢出",
        "C": "−96，无溢出",
        "D": "−128，有溢出"
      },
      "answer": "A",
      "explanation": "160模256机器码10100000解释为160−256=−96，两个正加数得到负结果说明有符号溢出。"
    }
  ],
  "computer-organization:ch2-s4": [
    {
      "id": "co-ieee-1",
      "type": "single",
      "stem": "IEEE 754 单精度浮点数由哪几部分组成（位数由高到低）？",
      "options": {
        "A": "1 位符号 + 8 位阶码 + 23 位尾数",
        "B": "1 位符号 + 23 位阶码 + 8 位尾数",
        "C": "8 位符号 + 1 位阶码 + 23 位尾数",
        "D": "1 位符号 + 11 位阶码 + 52 位尾数"
      },
      "answer": "A",
      "explanation": "单精度共 32 位：1 位符号、8 位移码阶码（偏置 127）、23 位尾数；11+52 是双精度。"
    },
    {
      "id": "co-ieee-2",
      "type": "single",
      "stem": "IEEE 754 单精度浮点数的阶码采用移码表示，其偏置值是？",
      "options": {
        "A": "127",
        "B": "128",
        "C": "255",
        "D": "1023"
      },
      "answer": "A",
      "explanation": "单精度阶码 8 位，偏置取 2⁸⁻¹−1 = 127；双精度阶码偏置为 1023。"
    },
    {
      "id": "co-ieee-3-r2",
      "type": "single",
      "stem": "IEEE 754 binary32格式的正规有限非零数，其有效数精度有多少位？",
      "options": {
        "A": "24 位（含隐含的 1）",
        "B": "23 位",
        "C": "8 位",
        "D": "32 位"
      },
      "answer": "A",
      "explanation": "规格化数的尾数最高位隐含为 1，实际有效位为 23+1=24 位。"
    },
    {
      "id": "co-ieee-4-r2",
      "type": "judge",
      "stem": "IEEE 754二进制格式的正规有限非零数，有效数开头的1不显式存入小数位字段。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "IEEE 754 采用隐含最高位 1 的方式，多获得一位精度。"
    },
    {
      "id": "exam-co-float-2024-14-r2",
      "type": "single",
      "stem": "需精确表示2^40至2^41−1之间的每一个整数，以下哪种IEEE二进制浮点格式足够？",
      "options": {
        "A": "半精度浮点数",
        "B": "单精度浮点数",
        "C": "双精度浮点数",
        "D": "8 位定点数"
      },
      "answer": "C",
      "explanation": "该区间整数需要至多41位有效二进制精度。binary64有53位，且阶码范围足够；binary32仅24位，不保证所有整数精确。特殊整数2^40本身也可由单精度精确表示，因此不能只说某一个该量级整数。"
    },
    {
      "id": "exam-computer-organization-ch2-s4-2021-14-b-r2",
      "type": "single",
      "stem": "下列数值中，不能用有限位二进制小数精确表示的是？",
      "options": {
        "A": "1.25",
        "B": "2.5",
        "C": "1.2",
        "D": "2.0"
      },
      "answer": "C",
      "explanation": "1.2 的二进制小数展开无限循环；1.25、2.5 和 2.0 都可由有限二进制位精确表示。"
    },
    {
      "id": "qa-20261002-computer-organization-ch2-s4-01",
      "type": "single",
      "stem": "IEEE binary32中s=0、阶字段127、fraction全0，表示哪个值？",
      "options": {
        "A": "最小非规格化数",
        "B": "1.0",
        "C": "0.0",
        "D": "2.0"
      },
      "answer": "B",
      "explanation": "正规数值(+1)×1.0×2^(127−127)=1，零须阶字段0及fraction0。"
    }
  ],
  "computer-organization:ch2-s5": [
    {
      "id": "co-fpadd-1-r2",
      "type": "single",
      "stem": "浮点数加减运算的第一步通常是对阶，其规则是？",
      "options": {
        "A": "小阶向大阶看齐，尾数右移",
        "B": "大阶向小阶看齐，尾数左移",
        "C": "直接相加尾数",
        "D": "先规格化再对阶"
      },
      "answer": "A",
      "explanation": "按较大阶统一尺度，小阶有效数右移相应位数，可能丢失低位；实际实现借助保护位、舍入位、粘滞位控制最终舍入误差。"
    },
    {
      "id": "co-fpadd-2",
      "type": "single",
      "stem": "浮点数加减运算的正确步骤是？",
      "options": {
        "A": "对阶→尾数运算→规格化→舍入→溢出判断",
        "B": "相乘→相加→输出",
        "C": "取反→加 1→输出",
        "D": "排序→对齐→输出"
      },
      "answer": "A",
      "explanation": "浮点加减依次进行对阶、尾数加减、规格化、舍入和溢出判断。"
    },
    {
      "id": "co-fpadd-4",
      "type": "single",
      "stem": "浮点数规格化分为左规和右规，其目的是？",
      "options": {
        "A": "使尾数满足规格化形式，保证精度与表示唯一",
        "B": "改变数值大小",
        "C": "加快运算",
        "D": "节省内存"
      },
      "answer": "A",
      "explanation": "规格化使尾数最高有效位为 1，保证浮点表示的规范与精度。"
    },
    {
      "id": "co-fpadd-5",
      "type": "judge",
      "stem": "浮点运算的舍入常采用“0 舍 1 入”或“就近舍入”等方法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "舍入用于处理对阶或规格化后超出尾数位数的部分。"
    },
    {
      "id": "qa-20261002-computer-organization-ch2-s5-01",
      "type": "single",
      "stem": "二进制正规浮点1.00×2³与1.10×2¹相加，对齐到阶3后，在无限精度下结果为？",
      "options": {
        "A": "1.10×2³",
        "B": "1.01×2²",
        "C": "1.011×2³",
        "D": "1.10×2⁴"
      },
      "answer": "C",
      "explanation": "第二数变0.011×2³，两尾相加1.011，即8+3=11；不是直接1.00+1.10。"
    }
  ],
  "computer-organization:ch2-s6": [
    {
      "id": "co-alu-1",
      "type": "single",
      "stem": "加法器通常由什么构成？",
      "options": {
        "A": "若干全加器级联",
        "B": "若干触发器",
        "C": "译码器",
        "D": "计数器"
      },
      "answer": "A",
      "explanation": "加法器由全加器串行或并行连接构成，实现多位加法。"
    },
    {
      "id": "co-alu-2",
      "type": "single",
      "stem": "串行进位加法器的主要缺点是？",
      "options": {
        "A": "进位逐级传递，速度慢",
        "B": "电路太复杂",
        "C": "不能进位",
        "D": "功耗太低"
      },
      "answer": "A",
      "explanation": "串行进位需等待低位进位逐级传到高位，延迟较大。"
    },
    {
      "id": "co-alu-3",
      "type": "judge",
      "stem": "ALU 既能执行算术运算，也能执行逻辑运算。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "算术逻辑单元（ALU）完成加减乘除与与、或、非、异或等运算。"
    },
    {
      "id": "co-alu-4",
      "type": "single",
      "stem": "先行进位（并行进位）加法器提高速度的原理是？",
      "options": {
        "A": "同时产生各位进位，减少进位传递延迟",
        "B": "减少加法器位数",
        "C": "降低主频",
        "D": "增加时钟周期"
      },
      "answer": "A",
      "explanation": "先行进位通过进位产生/传递函数直接算出各进位，避免逐级等待。"
    },
    {
      "id": "qa-20261002-computer-organization-ch2-s6-01",
      "type": "single",
      "stem": "一位全加器a=1,b=0,cin=1，sum、cout为？",
      "options": {
        "A": "1、0",
        "B": "1、1",
        "C": "0、0",
        "D": "0、1"
      },
      "answer": "D",
      "explanation": "1+0+1=2，二进制10，最低和0及进位1。"
    }
  ],
  "computer-organization:ch3-s1": [
    {
      "id": "co-mem-1",
      "type": "single",
      "stem": "存储器的层次结构自顶向下通常是？",
      "options": {
        "A": "寄存器→Cache→主存→辅存",
        "B": "辅存→主存→Cache→寄存器",
        "C": "主存→寄存器→Cache→辅存",
        "D": "Cache→寄存器→辅存→主存"
      },
      "answer": "A",
      "explanation": "越靠近 CPU 速度越快、容量越小、价格越高。"
    },
    {
      "id": "co-mem-2",
      "type": "single",
      "stem": "Cache—主存层次主要解决什么问题？",
      "options": {
        "A": "速度匹配问题",
        "B": "容量问题",
        "C": "成本问题",
        "D": "功耗问题"
      },
      "answer": "A",
      "explanation": "Cache 缓解 CPU 与主存的速度差异；主存—辅存层次解决容量问题。"
    },
    {
      "id": "co-mem-3",
      "type": "judge",
      "stem": "存储层次中，越靠近 CPU 的存储器速度越快、容量越小。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是存储层次的“速度—容量—价格”折中规律。"
    },
    {
      "id": "co-mem-5",
      "type": "judge",
      "stem": "按存取方式，存储器可分为随机存取、顺序存取、直接存取和相联存取。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "RAM 随机存取、磁带顺序存取、磁盘直接存取、相联存储器按内容存取。"
    },
    {
      "id": "exam-co-memory-2023-15-r2",
      "type": "single",
      "stem": "按字节编址的计算机若有 24 位地址总线，理论上可直接寻址多大的主存空间？",
      "options": {
        "A": "1 MiB",
        "B": "8 MiB",
        "C": "16 MiB",
        "D": "24 MiB"
      },
      "answer": "C",
      "explanation": "24 位地址可表示 2²⁴ 个字节地址，即 16 MiB。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s1-01",
      "type": "single",
      "stem": "CPU重复访问同一变量体现时间局部性，顺序扫描相邻数组元素体现哪类局部性？",
      "options": {
        "A": "空间局部性",
        "B": "必然时间局部性且无空间局部性",
        "C": "仅分支预测",
        "D": "无任何局部性"
      },
      "answer": "A",
      "explanation": "相邻地址紧接被访问是空间局部性；同一地址复用才直接体现时间局部性。"
    }
  ],
  "computer-organization:ch3-s2": [
    {
      "id": "co-main-1",
      "type": "single",
      "stem": "SRAM 与 DRAM 相比，其特点是？",
      "options": {
        "A": "速度快但集成度低、成本高",
        "B": "速度慢但密度高",
        "C": "需要刷新",
        "D": "不能随机访问"
      },
      "answer": "A",
      "explanation": "SRAM 用触发器存储，快且不需刷新，但集成度低、贵，多用作 Cache。"
    },
    {
      "id": "co-main-2",
      "type": "single",
      "stem": "DRAM 需要定期刷新的原因是？",
      "options": {
        "A": "用电容存储电荷，电荷会泄漏",
        "B": "温度过高",
        "C": "电压不稳",
        "D": "指令要求"
      },
      "answer": "A",
      "explanation": "DRAM 用电容保存信息，电容会漏电，故需周期性刷新。"
    },
    {
      "id": "co-main-3",
      "type": "judge",
      "stem": "ROM 断电后存储的信息不会丢失。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "ROM 是非易失性存储器，断电后内容保持。"
    },
    {
      "id": "co-main-4-r2",
      "type": "single",
      "stem": "按字组织的存储器含1024个可寻址单元，每单元16位，其总容量是？",
      "options": {
        "A": "1024bit",
        "B": "2048bit",
        "C": "8192bit",
        "D": "16384bit"
      },
      "answer": "D",
      "explanation": "总容量=1024×16=16384bit=2048B。"
    },
    {
      "id": "co-main-5",
      "type": "judge",
      "stem": "主存储器按地址随机访问，访问任意单元的时间基本相同。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "随机存取意味着访问时间与地址无关，这是主存的重要特性。"
    },
    {
      "id": "exam-computer-organization-ch3-s2-2011-15-b-r2",
      "type": "single",
      "stem": "按字节编址的64MiB主存，完整区分每个字节至少需要多少位地址？",
      "options": {
        "A": "16 位",
        "B": "26 位",
        "C": "24 位",
        "D": "32 位"
      },
      "answer": "B",
      "explanation": "64MB=2²⁶ 字节，按字节编址需要 26 位地址。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s2-01",
      "type": "single",
      "stem": "某DRAM有1024行，所有行须在64ms内各刷新一次。均匀分散刷新，每次刷新一行，平均两次刷新间隔为？",
      "options": {
        "A": "64ms",
        "B": "62.5μs",
        "C": "64μs",
        "D": "16μs"
      },
      "answer": "B",
      "explanation": "64ms/1024=0.0625ms=62.5μs；不是64ms每行一次连续完成。"
    }
  ],
  "computer-organization:ch3-s3": [
    {
      "id": "co-conn-1",
      "type": "single",
      "stem": "存储器芯片的地址线数量决定了？",
      "options": {
        "A": "可寻址的存储单元数",
        "B": "字长",
        "C": "数据线数量",
        "D": "读写速度"
      },
      "answer": "A",
      "explanation": "n 根地址线可寻址 2ⁿ 个单元；数据线数量决定字长。"
    },
    {
      "id": "co-conn-2",
      "type": "single",
      "stem": "位扩展与字扩展分别用于？",
      "options": {
        "A": "位扩展增加字长，字扩展增加存储单元数",
        "B": "位扩展增加单元数",
        "C": "字扩展增加字长",
        "D": "两者相同"
      },
      "answer": "A",
      "explanation": "位扩展把芯片并联增加数据位数；字扩展增加存储字数。"
    },
    {
      "id": "co-conn-3",
      "type": "judge",
      "stem": "多个存储芯片连接时，片选信号用于选择当前访问的芯片。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "片选（CS）有效时该芯片才响应读写，否则处于高阻。"
    },
    {
      "id": "co-conn-4",
      "type": "single",
      "stem": "存储器扩展中常用的地址译码方法有？",
      "options": {
        "A": "线选法与译码片选法",
        "B": "折半法与哈希法",
        "C": "同步法与异步法",
        "D": "串行法与并行法"
      },
      "answer": "A",
      "explanation": "线选法用高位地址直接选片，译码片选法用译码器产生片选。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s3-01",
      "type": "single",
      "stem": "用2K×8位芯片组成8K×16位存储器，共需多少片？",
      "options": {
        "A": "16",
        "B": "2",
        "C": "8",
        "D": "4"
      },
      "answer": "C",
      "explanation": "字扩8K/2K=4组，每组位扩16/8=2片，总4×2=8片。"
    }
  ],
  "computer-organization:ch3-s4": [
    {
      "id": "co-disk-1",
      "type": "single",
      "stem": "磁盘的存取时间由哪几部分组成？",
      "options": {
        "A": "寻道时间 + 旋转延迟 + 传输时间",
        "B": "仅寻道时间",
        "C": "仅传输时间",
        "D": "CPU 时间"
      },
      "answer": "A",
      "explanation": "磁盘存取时间由寻道、旋转延迟和传输时间构成。"
    },
    {
      "id": "co-disk-2",
      "type": "single",
      "stem": "磁盘容量的计算公式是？",
      "options": {
        "A": "磁头数 × 柱面数 × 每道扇区数 × 扇区容量",
        "B": "磁头数 × 转速",
        "C": "柱面数 × 扇区大小",
        "D": "容量 = 转速 × 传输率"
      },
      "answer": "A",
      "explanation": "总容量 = 记录面（磁头）数 × 柱面数 × 每磁道扇区数 × 扇区字节数。"
    },
    {
      "id": "co-disk-3",
      "type": "judge",
      "stem": "磁盘的平均旋转延迟约为旋转半圈所需的时间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "目标扇区平均需等半圈才转到磁头下，故平均旋转延迟 = 半圈时间。"
    },
    {
      "id": "co-disk-4",
      "type": "single",
      "stem": "固态硬盘（SSD）相比机械硬盘的优势是？",
      "options": {
        "A": "无机械部件，随机访问快、抗震",
        "B": "容量更大且更便宜",
        "C": "不需要接口",
        "D": "断电不丢失（机械盘会丢失）"
      },
      "answer": "A",
      "explanation": "SSD 基于闪存，无寻道与旋转，随机读写和抗震性能好，但成本较高。"
    },
    {
      "id": "co-disk-5",
      "type": "judge",
      "stem": "RAID 技术可以提升存储系统的可靠性和/或性能。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "RAID 通过镜像、校验、条带化等手段提高可靠性或吞吐量。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s4-01",
      "type": "single",
      "stem": "7200rpm机械盘，平均寻道8ms，目标块传输1ms，不计其他开销，平均访问时间约为？",
      "options": {
        "A": "9.00ms",
        "B": "17.33ms",
        "C": "5.17ms",
        "D": "13.17ms"
      },
      "answer": "D",
      "explanation": "一圈60000/7200=8.333ms，均匀平均等半圈4.167ms，加8+1=13.167ms。"
    }
  ],
  "computer-organization:ch3-s5": [
    {
      "id": "co-cacheb-1",
      "type": "single",
      "stem": "Cache 能提高访存速度的根本原因是？",
      "options": {
        "A": "利用了程序访问的局部性",
        "B": "容量比主存大",
        "C": "价格比主存低",
        "D": "不需要地址转换"
      },
      "answer": "A",
      "explanation": "局部性使少量常用块被频繁访问，Cache 命中率高。"
    },
    {
      "id": "co-cacheb-2",
      "type": "single",
      "stem": "Cache 命中率的定义是？",
      "options": {
        "A": "命中次数 ÷ 总访问次数",
        "B": "缺失次数 ÷ 总访问次数",
        "C": "Cache 容量 ÷ 主存容量",
        "D": "命中时间 ÷ 缺失时间"
      },
      "answer": "A",
      "explanation": "命中率 = 命中次数/总访问次数，缺失率 = 1 − 命中率。"
    },
    {
      "id": "co-cacheb-3",
      "type": "judge",
      "stem": "平均访问时间 = 命中时间 + 缺失率 × 缺失代价。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是 Cache 性能的基本公式，命中率越高平均访问时间越短。"
    },
    {
      "id": "co-cacheb-4",
      "type": "single",
      "stem": "Cache 与主存之间以什么为单位交换数据？",
      "options": {
        "A": "块（行）",
        "B": "字节",
        "C": "字",
        "D": "页"
      },
      "answer": "A",
      "explanation": "Cache 与主存按块交换，利用空间局部性一次装入相邻数据。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s5-01",
      "type": "single",
      "stem": "Cache命中时间2ns，缺失率5%，额外缺失惩罚80ns，平均访问时间为？",
      "options": {
        "A": "6ns",
        "B": "4ns",
        "C": "82ns",
        "D": "78ns"
      },
      "answer": "A",
      "explanation": "AMAT=2+0.05×80=6ns；额外惩罚无需再乘命中概率替代总成本。"
    }
  ],
  "computer-organization:ch3-s6": [
    {
      "id": "co-cache-1",
      "type": "single",
      "stem": "关于 Cache 与主存的映射方式，下列说法正确的是？",
      "options": {
        "A": "直接映射实现简单但冲突多，全相联冲突最少但比较电路复杂",
        "B": "全相联映射中主存块只能放入唯一 Cache 行",
        "C": "组相联映射等价于直接映射",
        "D": "直接映射的命中率总是高于组相联"
      },
      "answer": "A",
      "explanation": "直接映射一块只能对应一行、冲突多；全相联可放入任意行、冲突少但需并行比较所有标记；组相联是折中。"
    },
    {
      "id": "co-cache-2-r2",
      "type": "judge",
      "stem": "Cache命中时间与额外缺失惩罚保持不变且惩罚为正时，提高命中率会降低平均访问时间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "AMAT=命中时间+(1−命中率)×额外缺失惩罚。若更高命中率的设计同时增加命中时间，不能只看命中率判性能。"
    },
    {
      "id": "co-cache-3",
      "type": "single",
      "stem": "直接映射方式下，主存地址被划分为？",
      "options": {
        "A": "标记 + 行号（组号）+ 块内地址",
        "B": "仅标记",
        "C": "仅块内地址",
        "D": "标记 + 块内地址"
      },
      "answer": "A",
      "explanation": "直接映射按行号定位唯一 Cache 行，标记用于比较，块内地址选块内字节。"
    },
    {
      "id": "co-cache-4",
      "type": "judge",
      "stem": "组相联映射是直接映射与全相联映射的折中。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "组间直接映射、组内全相联，兼顾硬件成本与命中率。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s6-01",
      "type": "single",
      "stem": "32位按字节地址，直接映射Cache数据区4KiB，行64B，地址tag、index、offset位数分别为？",
      "options": {
        "A": "20、8、4",
        "B": "20、6、6",
        "C": "18、8、6",
        "D": "22、4、6"
      },
      "answer": "B",
      "explanation": "行数4096/64=64，index6位；offset log2(64)=6；tag=32−6−6=20。"
    }
  ],
  "computer-organization:ch3-s7": [
    {
      "id": "co-write-1-r2",
      "type": "single",
      "stem": "对普通Cache写命中与脏块逐出，写直达和写回的主要区别是？",
      "options": {
        "A": "写直达命中写同时更新下层；写回先更新Cache并置脏，脏块逐出才写下层",
        "B": "写直达只写Cache",
        "C": "写回每次写都同步更新主存",
        "D": "两者完全相同"
      },
      "answer": "A",
      "explanation": "写回的脏数据在逐出时更新下层，也可因显式flush或一致性事件提前回写；写直达会向下层传播每次命中写。"
    },
    {
      "id": "co-repl-1",
      "type": "single",
      "stem": "Cache 常用的替换算法不包括？",
      "options": {
        "A": "最短作业优先",
        "B": "随机算法",
        "C": "FIFO",
        "D": "LRU"
      },
      "answer": "A",
      "explanation": "Cache 替换算法有随机、FIFO、LRU、LFU 等；最短作业优先是进程调度算法。"
    },
    {
      "id": "co-repl-2",
      "type": "judge",
      "stem": "LRU 替换算法利用了程序的局部性，通常效果较好。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "LRU 淘汰最久未使用的块，符合时间局部性，命中率较高。"
    },
    {
      "id": "co-repl-4",
      "type": "judge",
      "stem": "写分配与非写分配是 Cache 写缺失时是否把块调入 Cache 的两种策略。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "写分配在写缺失时调块入 Cache，常与写回配合；非写分配常与写直达配合。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s7-01",
      "type": "single",
      "stem": "全相联Cache仅2行，初始空，访问块A,B,A,C；LRU最后淘汰哪个块？",
      "options": {
        "A": "C",
        "B": "不淘汰",
        "C": "B",
        "D": "A"
      },
      "answer": "C",
      "explanation": "访问第三次A使A最近使用，C到来时B最久未用；FIFO此时淘汰A，二者不同。"
    }
  ],
  "computer-organization:ch3-s8": [
    {
      "id": "co-vm-1",
      "type": "single",
      "stem": "页式虚拟存储器中，地址转换使用的页表通常存放在？",
      "options": {
        "A": "主存中，并用 TLB 缓存常用页表项",
        "B": "CPU 寄存器中",
        "C": "磁盘中且每次访问都查磁盘",
        "D": "Cache 中且不需要页表"
      },
      "answer": "A",
      "explanation": "页表规模大，一般放主存；用快表 TLB 缓存最近使用的页表项以减少访存次数。"
    },
    {
      "id": "co-vm-2",
      "type": "judge",
      "stem": "当 TLB 命中时，地址转换无需再访问主存中的页表。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "TLB 命中直接得到物理页号，省去一次访存查页表；但取数据仍可能访问主存/Cache。"
    },
    {
      "id": "co-vm-3",
      "type": "single",
      "stem": "页式虚拟存储器中，虚拟地址被划分为？",
      "options": {
        "A": "虚页号 + 页内偏移",
        "B": "段号 + 段内偏移",
        "C": "标记 + 行号",
        "D": "块号 + 块内地址"
      },
      "answer": "A",
      "explanation": "虚地址 = 虚页号（用于查页表）+ 页内偏移（直接映射到实地址）。"
    },
    {
      "id": "co-vm-5",
      "type": "single",
      "stem": "发生缺页时，由谁负责把所需页面从辅存调入主存？",
      "options": {
        "A": "操作系统的缺页处理程序",
        "B": "Cache 控制器",
        "C": "编译器",
        "D": "用户程序"
      },
      "answer": "A",
      "explanation": "缺页触发异常，由操作系统缺页处理程序从磁盘调入页面并更新页表。"
    },
    {
      "id": "exam-computer-organization-ch3-s8-2021-29-b-r2",
      "type": "single",
      "stem": "二级页表的页表基址寄存器通常指向？",
      "options": {
        "A": "二级页表的虚拟末地址",
        "B": "当前进程一级页表的物理起始地址",
        "C": "磁盘交换区起始地址",
        "D": "当前指令的操作码"
      },
      "answer": "B",
      "explanation": "页表基址寄存器保存一级页表的物理地址，用于开始地址转换。"
    },
    {
      "id": "qa-20261002-computer-organization-ch3-s8-01",
      "type": "single",
      "stem": "页大小4KiB，虚址0x1234的虚页1映到物理页框9，物理地址是？",
      "options": {
        "A": "0x9123",
        "B": "0x1239",
        "C": "0x9000",
        "D": "0x9234"
      },
      "answer": "D",
      "explanation": "低12位偏移0x234不变，物理基址9×0x1000=0x9000，加0x234。"
    }
  ],
  "computer-organization:ch4-s1": [
    {
      "id": "co-fmt-1",
      "type": "single",
      "stem": "若指令的操作码字段有 k 位，则最多可表示多少条不同的指令？",
      "options": {
        "A": "2ᵏ",
        "B": "k",
        "C": "2k",
        "D": "k²"
      },
      "answer": "A",
      "explanation": "k 位二进制可编码 2ᵏ 种组合，因此定长操作码最多表示 2ᵏ 条指令。"
    },
    {
      "id": "co-fmt-3",
      "type": "judge",
      "stem": "定长操作码译码简单，扩展操作码编码更灵活、更节省编码空间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "定长操作码规整易译码；扩展操作码在指令字长受限时更高效。"
    },
    {
      "id": "co-fmt-4",
      "type": "single",
      "stem": "按地址码个数，指令可分为？",
      "options": {
        "A": "零地址、一地址、二地址、三地址等",
        "B": "算术与逻辑指令",
        "C": "转移与调用指令",
        "D": "定长与变长指令"
      },
      "answer": "A",
      "explanation": "地址码个数决定指令格式，如二地址指令两个操作数。"
    },
    {
      "id": "co-fmt-5",
      "type": "judge",
      "stem": "指令字长可以是定长的，也可以是变长的。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "定长指令便于流水与译码，变长指令编码更紧凑。"
    },
    {
      "id": "qa-20261002-computer-organization-ch4-s1-01",
      "type": "single",
      "stem": "定长16位指令，两地址字段各5位，其余均操作码，最多可编码多少种两地址操作？",
      "options": {
        "A": "64",
        "B": "32",
        "C": "1024",
        "D": "16"
      },
      "answer": "A",
      "explanation": "操作码位16−2×5=6，2^6=64，忽略未用/保留编码时上限64。"
    }
  ],
  "computer-organization:ch4-s2": [
    {
      "id": "co-addr-1",
      "type": "single",
      "stem": "指令中直接给出操作数本身（而非其地址）的寻址方式是？",
      "options": {
        "A": "立即寻址",
        "B": "直接寻址",
        "C": "间接寻址",
        "D": "寄存器间接寻址"
      },
      "answer": "A",
      "explanation": "立即寻址的操作数就写在指令里；直接寻址给出有效地址；间接寻址给出存放地址的地址。"
    },
    {
      "id": "co-addr-2",
      "type": "single",
      "stem": "相对寻址方式下，操作数的有效地址等于？",
      "options": {
        "A": "程序计数器 PC 的值加位移量",
        "B": "基址寄存器内容加位移量",
        "C": "变址寄存器内容加位移量",
        "D": "指令中直接给出的地址"
      },
      "answer": "A",
      "explanation": "相对寻址以 PC 为基准加位移量，便于程序浮动。"
    },
    {
      "id": "co-addr-4",
      "type": "judge",
      "stem": "变址寻址特别适合处理数组等成批数据。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "变址寄存器可自动递增，遍历数组时地址连续变化。"
    },
    {
      "id": "co-addr-5",
      "type": "single",
      "stem": "基址寻址的主要用途是？",
      "options": {
        "A": "实现程序的浮动（重定位）",
        "B": "表示立即数",
        "C": "实现乘法",
        "D": "减少内存"
      },
      "answer": "A",
      "explanation": "基址寄存器给出程序段起始地址，使程序可在内存中浮动。"
    },
    {
      "id": "qa-20261002-computer-organization-ch4-s2-01",
      "type": "single",
      "stem": "按字节地址的相对分支，以取指更新后的PC=1008为基准，位移−12字节，分支目标为？",
      "options": {
        "A": "1008",
        "B": "996",
        "C": "1020",
        "D": "1005"
      },
      "answer": "B",
      "explanation": "EA=指定基准PC+有符号位移=1008−12=996；无需猜PC更新时机，题干已给。"
    }
  ],
  "computer-organization:ch4-s3": [
    {
      "id": "co-ext-1",
      "type": "single",
      "stem": "采用扩展操作码时，必须满足的基本约束是？",
      "options": {
        "A": "短操作码不能是长操作码的前缀",
        "B": "所有操作码长度必须相等",
        "C": "操作码越长指令越多",
        "D": "地址码位数必须为 0"
      },
      "answer": "A",
      "explanation": "扩展操作码通过缩短地址码位数来扩展操作码长度，必须保证任一操作码都不是另一操作码的前缀，避免译码歧义。"
    },
    {
      "id": "co-ext-2",
      "type": "single",
      "stem": "扩展操作码的基本思想是？",
      "options": {
        "A": "通过缩短地址码字段来扩展操作码长度",
        "B": "增加指令字长",
        "C": "减少指令种类",
        "D": "使用定长操作码"
      },
      "answer": "A",
      "explanation": "在指令字长固定时，地址码位数减少可为操作码腾出更多编码空间。"
    },
    {
      "id": "co-ext-4",
      "type": "single",
      "stem": "在指令字长固定时，操作码扩展与地址码位数之间是？",
      "options": {
        "A": "此消彼长的关系",
        "B": "相互独立",
        "C": "成正比",
        "D": "无关"
      },
      "answer": "A",
      "explanation": "地址码占位越多，可用于操作码的位数越少。"
    },
    {
      "id": "co-ext-5-r2",
      "type": "judge",
      "stem": "扩展操作码可以提高指令编码的效率。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "固定字长下，对操作数地址字段较少的指令使用更长操作码，可以增加可编码操作种类，提升字段空间利用率；不要求按高低频安排，也不自动压缩指令总字长。"
    },
    {
      "id": "qa-20261002-computer-organization-ch4-s3-01",
      "type": "single",
      "stem": "16位指令有两个4位地址字段，初始8位操作码；已分配250个两地址操作，剩余前缀扩展为12位一地址码，最多再编码多少个一地址操作？",
      "options": {
        "A": "256",
        "B": "4096",
        "C": "96",
        "D": "6"
      },
      "answer": "C",
      "explanation": "8位有256前缀，剩6，每前缀新增4位提供16一地址操作，6×16=96；短码不可作为长码前缀。"
    }
  ],
  "computer-organization:ch4-s4": [
    {
      "id": "co-asm-1",
      "type": "single",
      "stem": "汇编语言与机器指令的关系是？",
      "options": {
        "A": "一条汇编指令通常对应一条机器指令",
        "B": "完全无关",
        "C": "汇编比机器指令多",
        "D": "汇编不能转机器码"
      },
      "answer": "A",
      "explanation": "汇编是机器指令的符号化表示，经汇编器翻译为机器码。"
    },
    {
      "id": "co-asm-2",
      "type": "single",
      "stem": "机器级指令的操作数可以是？",
      "options": {
        "A": "寄存器、内存单元或立即数",
        "B": "只能是寄存器",
        "C": "只能是立即数",
        "D": "只能是文件"
      },
      "answer": "A",
      "explanation": "操作数来源包括寄存器、存储器与立即数，由寻址方式决定。"
    },
    {
      "id": "co-asm-4",
      "type": "single",
      "stem": "过程调用时通常用栈保存什么？",
      "options": {
        "A": "返回地址与调用现场",
        "B": "只保存数据",
        "C": "只保存指令",
        "D": "什么都不保存"
      },
      "answer": "A",
      "explanation": "栈保存返回地址、寄存器现场和局部变量，支持嵌套调用。"
    },
    {
      "id": "co-asm-5",
      "type": "judge",
      "stem": "机器级代码与具体的指令集体系结构相关，不可跨架构直接运行。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "不同 ISA 的机器码不兼容，需重新编译。"
    },
    {
      "id": "qa-20261002-computer-organization-ch4-s4-01",
      "type": "single",
      "stem": "伪汇编约定LOAD R1,[100]读内存，ADD R1,#3加立即数，STORE [104],R1写内存。初始M[100]=7，执行三句后M[104]为？",
      "options": {
        "A": "7",
        "B": "3",
        "C": "100",
        "D": "10"
      },
      "answer": "D",
      "explanation": "LOAD取7，ADD算7+3=10，STORE写10；[100]是地址而非立即数100。"
    }
  ],
  "computer-organization:ch4-s5": [
    {
      "id": "co-risc-1",
      "type": "judge",
      "stem": "RISC 通常采用定长指令、较少寻址方式，并大量使用寄存器。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "RISC 追求指令精简、定长、流水线友好，寻址方式少，load/store 访存，依赖大量通用寄存器。"
    },
    {
      "id": "co-cisc-1",
      "type": "single",
      "stem": "CISC 与 RISC 的主要区别是？",
      "options": {
        "A": "CISC 指令多而复杂，RISC 指令精简",
        "B": "CISC 指令少",
        "C": "RISC 指令复杂",
        "D": "两者完全相同"
      },
      "answer": "A",
      "explanation": "CISC 追求功能强、指令多；RISC 追求精简、规整、流水友好。"
    },
    {
      "id": "co-cisc-2",
      "type": "judge",
      "stem": "RISC 通常采用 load/store 架构，运算只在寄存器间进行。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "RISC 只有 load/store 访存，其余运算在寄存器间完成。"
    },
    {
      "id": "co-cisc-3",
      "type": "single",
      "stem": "RISC 更适合流水线的原因是？",
      "options": {
        "A": "指令定长、格式规整、寻址方式少",
        "B": "指令复杂",
        "C": "指令变长",
        "D": "寻址方式多"
      },
      "answer": "A",
      "explanation": "规整的指令便于流水线各阶段均衡划分与并行。"
    },
    {
      "id": "qa-20261002-computer-organization-ch4-s5-01",
      "type": "single",
      "stem": "典型load/store ISA要实现M[x]=M[x]+M[y]，已有地址可直接使用，且寄存器初始未含数据，最少访存指令数为？",
      "options": {
        "A": "3",
        "B": "1",
        "C": "2",
        "D": "4"
      },
      "answer": "A",
      "explanation": "LOAD x、LOAD y、寄存器ADD、STORE x，共两读一写三访存；ADD本身不访问内存。"
    }
  ],
  "computer-organization:ch5-s1": [
    {
      "id": "co-cpu-1",
      "type": "single",
      "stem": "CPU 主要由哪两部分组成？",
      "options": {
        "A": "运算器与控制器",
        "B": "寄存器与内存",
        "C": "Cache 与主存",
        "D": "输入与输出"
      },
      "answer": "A",
      "explanation": "CPU = 运算器（ALU 等）+ 控制器，另含寄存器组。"
    },
    {
      "id": "co-cpu-2",
      "type": "single",
      "stem": "CPU 的运算器通常包含哪些部件？",
      "options": {
        "A": "ALU、寄存器、暂存器",
        "B": "PC 与 IR",
        "C": "内存与磁盘",
        "D": "总线与接口"
      },
      "answer": "A",
      "explanation": "运算器核心是 ALU，另有通用寄存器与暂存寄存器。"
    },
    {
      "id": "co-cpu-3",
      "type": "judge",
      "stem": "控制器负责产生控制信号，协调各部件按序工作。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "控制器根据指令译码结果发出控制信号，指挥数据通路动作。"
    },
    {
      "id": "co-cpu-4",
      "type": "single",
      "stem": "下列哪个是专用寄存器？",
      "options": {
        "A": "PC（程序计数器）",
        "B": "通用寄存器 R0",
        "C": "累加器 ACC（通用用途时）",
        "D": "数据寄存器通用组"
      },
      "answer": "A",
      "explanation": "PC、IR、MAR、MDR 等是专用寄存器，用途固定。"
    },
    {
      "id": "exam-co-cpu-2023-19-r2",
      "type": "single",
      "stem": "各段等时的经典单发射五段流水线，从空开始无任何停顿连续执行10条指令，最少需多少时钟周期？",
      "options": {
        "A": "10",
        "B": "13",
        "C": "14",
        "D": "50"
      },
      "answer": "C",
      "explanation": "k 段流水线执行 n 条指令需要 k+n−1 个周期；此处为 5+10−1=14。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s1-01",
      "type": "single",
      "stem": "取指后IR已有指令内容，顺序执行下一指令的地址在PC。执行某ALU指令时需要保留当前操作码，应该从哪个寄存器读取？",
      "options": {
        "A": "MDR",
        "B": "IR",
        "C": "PC",
        "D": "MAR"
      },
      "answer": "B",
      "explanation": "IR保持当前指令，PC是后续地址；MAR/MDR参与地址/数据传输不承担当前指令保持。"
    }
  ],
  "computer-organization:ch5-s2": [
    {
      "id": "co-cycle-1",
      "type": "single",
      "stem": "一个完整的指令周期通常包含哪几个阶段？",
      "options": {
        "A": "取指周期、间址周期、执行周期、中断周期",
        "B": "仅取指与执行",
        "C": "取指、译码、写回",
        "D": "读、算、写"
      },
      "answer": "A",
      "explanation": "指令周期一般由取指、间址（可选）、执行、中断（可选）四部分组成。"
    },
    {
      "id": "co-cycle-3",
      "type": "judge",
      "stem": "不同指令的指令周期长度可能不同。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "简单指令周期短，复杂指令（含间址、多次访存）周期长。"
    },
    {
      "id": "co-cycle-4",
      "type": "single",
      "stem": "取指周期的主要操作是？",
      "options": {
        "A": "按 PC 从主存取指令送入 IR，并修改 PC",
        "B": "执行算术运算",
        "C": "写回结果",
        "D": "响应中断"
      },
      "answer": "A",
      "explanation": "取指周期取指令到 IR，同时 PC 指向下一条指令。"
    },
    {
      "id": "co-cycle-5",
      "type": "judge",
      "stem": "间址周期用于间接寻址，从主存取操作数的有效地址。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "间接寻址时先取形式地址再访存得到有效地址。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s2-01",
      "type": "single",
      "stem": "定长一字指令单级存储器：取指访存1次，存储器间接地址需读有效地址1次，再读操作数1次，无写回。总访存次数为？",
      "options": {
        "A": "2",
        "B": "4",
        "C": "3",
        "D": "1"
      },
      "answer": "C",
      "explanation": "取指、间址读取EA、执行读取操作数分别1次；不能忽略取指。"
    }
  ],
  "computer-organization:ch5-s3": [
    {
      "id": "co-dp-1",
      "type": "single",
      "stem": "CPU 中的数据通路是指什么？",
      "options": {
        "A": "数据在 CPU 各部件之间传输的路径",
        "B": "磁盘读写通道",
        "C": "网络链路",
        "D": "程序执行顺序"
      },
      "answer": "A",
      "explanation": "数据通路由 ALU、寄存器、总线及控制信号组成。"
    },
    {
      "id": "co-dp-2",
      "type": "single",
      "stem": "单总线结构的主要缺点是？",
      "options": {
        "A": "同一时刻只能传一个数据，易产生冲突",
        "B": "成本太高",
        "C": "速度太快",
        "D": "不能连接寄存器"
      },
      "answer": "A",
      "explanation": "单总线分时复用，一次一个数据，可能成为性能瓶颈。"
    },
    {
      "id": "co-dp-4",
      "type": "single",
      "stem": "多总线结构相比单总线的主要优势是？",
      "options": {
        "A": "提高数据传输的并行性与效率",
        "B": "降低成本",
        "C": "减少寄存器",
        "D": "简化电路"
      },
      "answer": "A",
      "explanation": "多总线可并行传输不同数据，提高吞吐率。"
    },
    {
      "id": "co-dp-5",
      "type": "judge",
      "stem": "数据通路由 ALU、寄存器组和总线等组成。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这些部件通过总线互连，在控制信号下完成数据传送与运算。"
    },
    {
      "id": "exam-computer-organization-ch5-s3-2011-19-b-r2",
      "type": "single",
      "stem": "数据通路中的寄存器属于？",
      "options": {
        "A": "组合逻辑部件",
        "B": "时序逻辑部件",
        "C": "只读外设",
        "D": "总线仲裁器"
      },
      "answer": "B",
      "explanation": "寄存器保存状态，属于时序逻辑；ALU 属于组合逻辑。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s3-01",
      "type": "single",
      "stem": "单内部总线运算R1←R2+R3，ALU一输入接暂存Y，输出接暂存Z，每拍一源驱动总线。常规最少数据拍序列是？",
      "options": {
        "A": "R2和R3同时驱动总线→R1",
        "B": "R2→R1后立即结束",
        "C": "只把R3→Y",
        "D": "R2→Y；R3经总线与Y相加→Z；Z→R1"
      },
      "answer": "D",
      "explanation": "三个不同源分拍：先存一操作数、次拍ALU形成Z、末拍Z写R1；两源同时驱动公共总线不合法。"
    }
  ],
  "computer-organization:ch5-s4": [
    {
      "id": "co-ctrl-1",
      "type": "single",
      "stem": "在微程序控制器中，一条机器指令对应？",
      "options": {
        "A": "一段微程序（若干条微指令）",
        "B": "一条微指令",
        "C": "一个微命令",
        "D": "一个节拍"
      },
      "answer": "A",
      "explanation": "微程序控制器把一条机器指令解释为一段微程序，由若干条微指令按序执行，产生相应的微命令。"
    },
    {
      "id": "co-ctrl-2",
      "type": "single",
      "stem": "控制器按实现方式可分为？",
      "options": {
        "A": "硬布线控制器与微程序控制器",
        "B": "同步与异步",
        "C": "串行与并行",
        "D": "单总线与多总线"
      },
      "answer": "A",
      "explanation": "硬布线用组合逻辑产生控制信号；微程序用微指令序列实现。"
    },
    {
      "id": "co-ctrl-4",
      "type": "single",
      "stem": "微指令格式通常分为？",
      "options": {
        "A": "水平型与垂直型",
        "B": "同步与异步",
        "C": "串行与并行",
        "D": "定长与变长"
      },
      "answer": "A",
      "explanation": "水平型微指令并行能力强、字长较长；垂直型类似机器指令、字长较短。"
    },
    {
      "id": "co-ctrl-5",
      "type": "judge",
      "stem": "硬布线控制器速度较快，但修改和扩展较困难。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "硬布线由固定逻辑电路实现，速度快但不易修改；微程序易修改但较慢。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s4-01",
      "type": "single",
      "stem": "水平微指令含4组互斥微操作，每组分别3、7、1、5个操作，字段编码且各组需保留不操作码，操作控制字段最少多少位？",
      "options": {
        "A": "9",
        "B": "8",
        "C": "16",
        "D": "4"
      },
      "answer": "A",
      "explanation": "各字段ceil(log2(3+1))=2,ceil(log2(7+1))=3,ceil(log2(1+1))=1,ceil(log2(5+1))=3，总9。"
    }
  ],
  "computer-organization:ch5-s5": [
    {
      "id": "co-intr-2",
      "type": "single",
      "stem": "中断与异常的区别是？",
      "options": {
        "A": "中断通常由外部事件引起，异常由 CPU 内部事件引起",
        "B": "两者完全相同",
        "C": "中断由程序产生",
        "D": "异常由时钟产生"
      },
      "answer": "A",
      "explanation": "中断是外部事件（如 I/O 完成），异常是内部事件（如缺页、除零）。"
    },
    {
      "id": "co-intr-3",
      "type": "single",
      "stem": "中断处理的一般过程是？",
      "options": {
        "A": "关中断→保存断点→识别中断源→服务→恢复",
        "B": "直接执行服务程序",
        "C": "先恢复再保存",
        "D": "不需要保存现场"
      },
      "answer": "A",
      "explanation": "进入中断服务前需关中断、保存现场，服务后恢复并返回。"
    },
    {
      "id": "co-intr-4-r2",
      "type": "judge",
      "stem": "中断优先级决定多个中断同时请求时的响应顺序。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "多个允许响应的中断同时请求时，响应优先级决定先响应谁。能否打断服务程序取决于处理优先级、屏蔽字及是否开中断，不能仅由响应顺序推断。"
    },
    {
      "id": "co-intr-5",
      "type": "single",
      "stem": "中断向量表中存放的是？",
      "options": {
        "A": "各中断服务程序的入口地址",
        "B": "中断优先级",
        "C": "中断次数",
        "D": "设备编号"
      },
      "answer": "A",
      "explanation": "CPU 按中断类型号查中断向量表得到服务程序入口地址。"
    },
    {
      "id": "co-intr-10-r2",
      "type": "single",
      "stem": "CPU 内部异常通常不包括？",
      "options": {
        "A": "键盘按键中断",
        "B": "缺页故障",
        "C": "整数除零异常",
        "D": "非法指令"
      },
      "answer": "A",
      "explanation": "异常由 CPU 内部事件引起（缺页、除零、非法指令等）；键盘中断属于外部中断。"
    },
    {
      "id": "exam-computer-organization-ch5-s5-2021-21-a-r2",
      "type": "single",
      "stem": "缺页异常处理完成后，通常需要重新执行？",
      "options": {
        "A": "程序中的第一条指令",
        "B": "下一次中断指令",
        "C": "上一条已经完成的指令",
        "D": "引发缺页的那条指令"
      },
      "answer": "D",
      "explanation": "页面调入后，CPU 要重新执行访问该页面的指令。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s5-01",
      "type": "single",
      "stem": "中断源A响应优先级高于B，但屏蔽规则让A服务期间可响应B、B服务期间屏蔽A。关于处理优先级，哪项正确？",
      "options": {
        "A": "屏蔽与嵌套无关",
        "B": "B处理优先级高于A",
        "C": "A处理优先级必高于B",
        "D": "两者优先级必相等"
      },
      "answer": "B",
      "explanation": "能打断谁由处理/屏蔽规则决定，B能打断A而反向不行，处理优先级B更高；响应排序不等于处理排序。"
    }
  ],
  "computer-organization:ch5-s6": [
    {
      "id": "co-pipe-1-r2",
      "type": "single",
      "stem": "k段时间相等、忽略段间锁存开销的单发射流水线，无冒险且指令数远大于k，理想加速比趋近？",
      "options": {
        "A": "k",
        "B": "k²",
        "C": "2k",
        "D": "log₂k"
      },
      "answer": "A",
      "explanation": "理想流水线每周期完成一条指令，吞吐率提高约 k 倍，加速比趋近流水段数 k。"
    },
    {
      "id": "co-pipe-2",
      "type": "single",
      "stem": "指令流水线的基本思想是？",
      "options": {
        "A": "把指令执行划分为若干阶段并重叠执行",
        "B": "一次执行多条相同指令",
        "C": "降低主频",
        "D": "增加指令数"
      },
      "answer": "A",
      "explanation": "流水线让不同指令的不同阶段在时间上重叠，提高吞吐率。"
    },
    {
      "id": "co-pipe-3",
      "type": "judge",
      "stem": "流水线提高的是吞吐率，而不是单条指令的执行时间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "单条指令延迟可能不变甚至略增，但单位时间完成的指令数增加。"
    },
    {
      "id": "co-pipe-4-r2",
      "type": "single",
      "stem": "流水线的时钟周期通常取决于？",
      "options": {
        "A": "最慢段的组合逻辑延迟加段间寄存器等时序开销",
        "B": "最快段逻辑延迟",
        "C": "指令条数",
        "D": "仅寄存器数量"
      },
      "answer": "A",
      "explanation": "周期必须满足各段逻辑最大延迟及段寄存器传播/建立等约束；均衡段能减少最慢段瓶颈。"
    },
    {
      "id": "co-pipe-5-r2",
      "type": "judge",
      "stem": "理想单发射、无结构/数据/控制冒险的流水线填满后，每时钟周期可完成一条指令。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "理想情况下流水线满负荷时每周期流出一条指令。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s6-01",
      "type": "single",
      "stem": "四段等时流水线，各段2ns，不计寄存开销，无停顿执行7条指令，总时间及相对非流水加速比为？",
      "options": {
        "A": "56ns与1",
        "B": "22ns与约2.55",
        "C": "20ns与2.8",
        "D": "14ns与4"
      },
      "answer": "C",
      "explanation": "周期4+7−1=10，总20ns；非流水7×4×2=56ns，加速56/20=2.8。"
    }
  ],
  "computer-organization:ch5-s7": [
    {
      "id": "co-hazard-1",
      "type": "single",
      "stem": "缓解流水线数据冒险最常用的硬件技术是？",
      "options": {
        "A": "转发（旁路）技术",
        "B": "增加时钟频率",
        "C": "扩大 Cache",
        "D": "使用 DMA"
      },
      "answer": "A",
      "explanation": "转发/旁路把尚未写回的结果直接送给后续指令，避免等待；无法转发时插入气泡（停顿）。"
    },
    {
      "id": "co-haz-1",
      "type": "single",
      "stem": "流水线的三类冒险是？",
      "options": {
        "A": "结构冒险、数据冒险、控制冒险",
        "B": "读冒险、写冒险、擦除冒险",
        "C": "硬件冒险、软件冒险、编译冒险",
        "D": "同步冒险、异步冒险、混合冒险"
      },
      "answer": "A",
      "explanation": "结构冒险源于资源冲突，数据冒险源于数据依赖，控制冒险源于转移。"
    },
    {
      "id": "co-haz-3",
      "type": "single",
      "stem": "控制冒险通常由什么引起，可用什么缓解？",
      "options": {
        "A": "转移指令；分支预测",
        "B": "数据依赖；转发",
        "C": "资源冲突；增加部件",
        "D": "中断；关中断"
      },
      "answer": "A",
      "explanation": "转移指令使取指不确定，可用分支预测、延迟槽等缓解。"
    },
    {
      "id": "co-haz-4",
      "type": "judge",
      "stem": "吞吐率、加速比和效率是衡量流水线性能的常用指标。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "三者从不同角度刻画流水线的性能。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s7-01",
      "type": "single",
      "stem": "5段IF,ID,EX,MEM,WB流水线有标准ALU旁路，但LOAD在MEM末才能取得数据。紧随LOAD的ADD在EX需该数据，通常至少插多少个气泡？",
      "options": {
        "A": "0",
        "B": "2",
        "C": "5",
        "D": "1"
      },
      "answer": "D",
      "explanation": "相邻ADD原EX与LOAD的MEM在同周期，数据到MEM末才就绪，ADD EX必须迟一拍；一次停顿后可从MEM结果旁路。"
    }
  ],
  "computer-organization:ch5-s8": [
    {
      "id": "co-mp-1-r2",
      "type": "single",
      "stem": "Flynn按指令流、数据流数量将计算机体系结构分为？",
      "options": {
        "A": "SISD、SIMD、MISD、MIMD",
        "B": "CISC 与 RISC",
        "C": "单核与多核",
        "D": "同步与异步"
      },
      "answer": "A",
      "explanation": "Flynn 按指令流与数据流的数量分为 SISD、SIMD、MISD、MIMD。"
    },
    {
      "id": "co-mp-2",
      "type": "single",
      "stem": "对称多处理器（SMP）的特点是？",
      "options": {
        "A": "所有处理器对等地共享主存与 I/O",
        "B": "有一个主处理器控制其余",
        "C": "处理器不共享内存",
        "D": "只用于嵌入式"
      },
      "answer": "A",
      "explanation": "SMP 中各处理器地位对等、共享统一主存。"
    },
    {
      "id": "co-mp-3",
      "type": "judge",
      "stem": "多核处理器共享主存时通常需要缓存一致性协议。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "各核私有 Cache 可能副本不一致，需一致性协议（如 MESI）维护。"
    },
    {
      "id": "co-mp-4",
      "type": "single",
      "stem": "硬件多线程技术的目的是？",
      "options": {
        "A": "提高处理器资源利用率，隐藏访存等延迟",
        "B": "降低功耗",
        "C": "减少寄存器",
        "D": "简化电路"
      },
      "answer": "A",
      "explanation": "硬件多线程在一个核上切换多个线程，填补流水线空档。"
    },
    {
      "id": "qa-20261002-computer-organization-ch5-s8-01",
      "type": "single",
      "stem": "程序20%时间不能并行，其余80%在4核上理想均分，不计开销，最大加速比为？",
      "options": {
        "A": "2.5",
        "B": "4",
        "C": "3.2",
        "D": "5"
      },
      "answer": "A",
      "explanation": "Amdahl时间比例0.2+0.8/4=0.4，加速1/0.4=2.5，核数不能消除串行部分。"
    }
  ],
  "computer-organization:ch6-s1": [
    {
      "id": "co-bus-1",
      "type": "single",
      "stem": "按功能划分，系统总线通常分为？",
      "options": {
        "A": "数据总线、地址总线、控制总线",
        "B": "同步总线、异步总线",
        "C": "内部总线、外部总线",
        "D": "串行总线、并行总线"
      },
      "answer": "A",
      "explanation": "按功能分为数据总线、地址总线和控制总线；同步/异步是定时方式，串行/并行是传输方式。"
    },
    {
      "id": "co-bus-3",
      "type": "judge",
      "stem": "总线是连接多个部件的一组公共信息传输线。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "总线是共享的传输介质，各部件通过总线交换信息。"
    },
    {
      "id": "co-bus-4",
      "type": "single",
      "stem": "总线按连接范围可分为？",
      "options": {
        "A": "片内总线、系统总线、通信总线",
        "B": "同步与异步",
        "C": "串行与并行",
        "D": "数据与控制"
      },
      "answer": "A",
      "explanation": "片内总线在芯片内，系统总线连接计算机各部件，通信总线用于设备间。"
    },
    {
      "id": "co-bus-5-r2",
      "type": "judge",
      "stem": "数据总线宽w位、频率fHz、每周期传输k次时，不计协议开销的理论带宽为(w/8)fk字节/秒。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "一次w位即w/8字节，每秒fk次传输。仅当k=1且单位一致时才能简写宽度乘频率。"
    },
    {
      "id": "exam-co-bus-2024-20-r2",
      "type": "single",
      "stem": "总线宽 64 位、时钟频率 420 MHz，每周期可传输两次。理论带宽约为多少？",
      "options": {
        "A": "3.36 GB/s",
        "B": "5.12 GB/s",
        "C": "6.72 GB/s",
        "D": "8.40 GB/s"
      },
      "answer": "C",
      "explanation": "每次传输 8 字节，故带宽为 420 MHz × 2 × 8 B = 6.72 GB/s。"
    },
    {
      "id": "qa-20261002-computer-organization-ch6-s1-01",
      "type": "single",
      "stem": "并行数据总线32位、100MHz，每周期2次传输，不计开销，理论带宽为？",
      "options": {
        "A": "200MB/s",
        "B": "800MB/s",
        "C": "400MB/s",
        "D": "3200MB/s"
      },
      "answer": "B",
      "explanation": "32bit=4B，每秒2×100M次，乘得800M字节/秒，MB十进制。"
    }
  ],
  "computer-organization:ch6-s2": [
    {
      "id": "co-busperf-1-r2",
      "type": "single",
      "stem": "总线带宽表示的是？",
      "options": {
        "A": "单位时间内总线上传输的数据量",
        "B": "总线的长度",
        "C": "总线上的设备数",
        "D": "总线的工作电压"
      },
      "answer": "A",
      "explanation": "带宽表示每秒传输的数据量；理论值=每次传输字节数×每秒传输次数，实际吞吐还受地址、仲裁、等待等开销影响。"
    },
    {
      "id": "co-busperf-2",
      "type": "single",
      "stem": "常见的总线结构有？",
      "options": {
        "A": "单总线、双总线、三总线结构",
        "B": "同步与异步结构",
        "C": "串行与并行结构",
        "D": "定长与变长结构"
      },
      "answer": "A",
      "explanation": "按层次可分为单总线、双总线、三总线等结构。"
    },
    {
      "id": "co-busperf-3",
      "type": "judge",
      "stem": "总线宽度即数据总线的位数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "总线宽度指一次能并行传输的数据位数，即数据线根数。"
    },
    {
      "id": "co-busperf-4",
      "type": "single",
      "stem": "总线复用技术的作用是？",
      "options": {
        "A": "用同一组线分时传输不同信息，提高利用率",
        "B": "增加总线数量",
        "C": "降低频率",
        "D": "减少设备"
      },
      "answer": "A",
      "explanation": "总线复用在时间上分用信号线，如地址/数据复用，减少引脚数。"
    },
    {
      "id": "co-busperf-5",
      "type": "judge",
      "stem": "总线仲裁用于解决多个设备争用总线的问题。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "总线仲裁按优先级或轮询决定哪个主设备获得总线控制权。"
    },
    {
      "id": "exam-computer-organization-ch6-s2-2021-19-b-r2",
      "type": "single",
      "stem": "64 位总线每周期传输一次，工作频率为 100MHz，理论带宽为？",
      "options": {
        "A": "100MB/s",
        "B": "400MB/s",
        "C": "6.4GB/s",
        "D": "800MB/s"
      },
      "answer": "D",
      "explanation": "64 位为 8 字节，8×100MHz=800MB/s。"
    },
    {
      "id": "qa-20261002-computer-organization-ch6-s2-01",
      "type": "single",
      "stem": "总线每个事务需2周期地址/控制开销，后每周期传1个8字节数据。频率100MHz，4字突发事务的有效吞吐为？",
      "options": {
        "A": "400MB/s",
        "B": "3200MB/s",
        "C": "约533.3MB/s",
        "D": "800MB/s"
      },
      "answer": "C",
      "explanation": "总数据32B，用6周期60ns，32/60ns=533.3M B/s；理论800MB/s未算2拍开销。"
    }
  ],
  "computer-organization:ch6-s3": [
    {
      "id": "co-timing-1",
      "type": "single",
      "stem": "异步定时方式相比同步定时的主要优点是？",
      "options": {
        "A": "各部件可按自身速度工作，灵活性高",
        "B": "控制电路更简单",
        "C": "传输速度恒定",
        "D": "无需握手信号"
      },
      "answer": "A",
      "explanation": "异步定时通过握手信号协调，允许速度不同的部件协同工作，灵活但控制更复杂。"
    },
    {
      "id": "co-timing-2",
      "type": "single",
      "stem": "一个总线事务通常包括？",
      "options": {
        "A": "请求、仲裁、寻址、传输、释放",
        "B": "取指、译码、执行",
        "C": "读、写、擦除",
        "D": "编译、链接、运行"
      },
      "answer": "A",
      "explanation": "总线事务从请求总线到释放总线，完成一次数据传送。"
    },
    {
      "id": "co-timing-3",
      "type": "judge",
      "stem": "同步定时使用统一时钟，异步定时使用握手信号。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "同步定时靠公共时钟；异步定时靠请求/应答握手协调。"
    },
    {
      "id": "co-timing-4-r2",
      "type": "single",
      "stem": "同步总线若采用无等待、固定长度传输周期，必须保证最慢参与设备也能按时完成，其主要限制是？",
      "options": {
        "A": "必须以最慢设备为准，效率受限",
        "B": "控制太复杂",
        "C": "不需要时钟",
        "D": "无法传输数据"
      },
      "answer": "A",
      "explanation": "同步定时所有设备按同一时钟工作，需迁就最慢设备。"
    },
    {
      "id": "exam-computer-organization-ch6-s3-2019-19-b-r2",
      "type": "single",
      "stem": "突发传输允许总线主设备在一次仲裁后？",
      "options": {
        "A": "连续传送多个地址连续的数据项",
        "B": "每传一个字节重新复位 CPU",
        "C": "仅发送中断向量",
        "D": "关闭数据线"
      },
      "answer": "A",
      "explanation": "突发事务连续传送多个数据，降低重复地址和仲裁开销。"
    },
    {
      "id": "qa-20261002-computer-organization-ch6-s3-01",
      "type": "single",
      "stem": "异步全互锁握手中，主设备拉起Request，从设备完成后拉起Ack。主设备下一步通常应怎样？",
      "options": {
        "A": "立即再次拉Request且不等",
        "B": "撤Ack而保持Request",
        "C": "复位所有设备",
        "D": "撤Request并等待Ack撤销"
      },
      "answer": "D",
      "explanation": "四相全互锁为Request↑、Ack↑、Request↓、Ack↓；双方确认撤信号后才能进入下一事务。"
    }
  ],
  "computer-organization:ch7-s1": [
    {
      "id": "co-ios-1",
      "type": "single",
      "stem": "I/O 系统通常包括？",
      "options": {
        "A": "I/O 设备、接口、总线与控制器",
        "B": "只有键盘和鼠标",
        "C": "只有硬盘",
        "D": "只有显示器"
      },
      "answer": "A",
      "explanation": "I/O 系统由设备、设备接口、I/O 总线和设备控制器组成。"
    },
    {
      "id": "co-ios-3",
      "type": "judge",
      "stem": "I/O 设备通过接口与主机连接。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "接口完成数据缓冲、格式转换、状态监视与控制。"
    },
    {
      "id": "co-ios-4",
      "type": "single",
      "stem": "I/O 接口中通常包含哪几类端口？",
      "options": {
        "A": "数据端口、状态端口、控制端口",
        "B": "只读端口",
        "C": "只写端口",
        "D": "网络端口"
      },
      "answer": "A",
      "explanation": "数据端口传数据，状态端口报告设备状态，控制端口接收控制命令。"
    },
    {
      "id": "co-ios-5",
      "type": "judge",
      "stem": "I/O 端口的编址方式有统一编址和独立编址两种。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "统一编址把端口当内存单元；独立编址用专门的 I/O 指令与地址空间。"
    },
    {
      "id": "qa-20261002-computer-organization-ch7-s1-01",
      "type": "single",
      "stem": "采用独立I/O编址，端口地址0x20与内存地址0x20能否同时存在不同对象？",
      "options": {
        "A": "能，使用不同地址空间和访问指令区分",
        "B": "不能，任何数字相同就冲突",
        "C": "能但只能读一个",
        "D": "只有DMA时能"
      },
      "answer": "A",
      "explanation": "独立编址使I/O端口和内存地址空间分离，相同数值地址可由IN/OUT及内存访存控制区别。"
    }
  ],
  "computer-organization:ch7-s2": [
    {
      "id": "co-if-1",
      "type": "single",
      "stem": "I/O 接口的主要功能不包括？",
      "options": {
        "A": "执行算术运算",
        "B": "数据缓冲",
        "C": "格式转换",
        "D": "状态监视"
      },
      "answer": "A",
      "explanation": "接口负责缓冲、格式转换、状态监视和控制；算术运算由 CPU 完成。"
    },
    {
      "id": "co-if-2",
      "type": "single",
      "stem": "I/O 接口中用于暂存数据的部件是？",
      "options": {
        "A": "数据缓冲寄存器",
        "B": "状态寄存器",
        "C": "控制寄存器",
        "D": "地址寄存器"
      },
      "answer": "A",
      "explanation": "数据缓冲寄存器协调 CPU 与设备的速度差异。"
    },
    {
      "id": "co-if-4",
      "type": "single",
      "stem": "端口地址的作用是？",
      "options": {
        "A": "供 CPU 选择并访问接口中的特定寄存器",
        "B": "标识设备编号",
        "C": "表示内存容量",
        "D": "表示中断优先级"
      },
      "answer": "A",
      "explanation": "CPU 通过端口地址读写接口中的数据、状态或控制寄存器。"
    },
    {
      "id": "co-if-5",
      "type": "judge",
      "stem": "接口可以向 CPU 报告设备的状态，供查询或中断使用。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "状态寄存器（如就绪、忙、错误）供 CPU 查询或触发中断。"
    },
    {
      "id": "qa-20261002-computer-organization-ch7-s2-01",
      "type": "single",
      "stem": "接口状态端口bit0=READY，控制端口同位写1表示启动。CPU需要判断是否可读数据，应执行？",
      "options": {
        "A": "读取PC的bit0",
        "B": "读取状态端口并测试bit0",
        "C": "写控制端口bit0后直接认为已就绪",
        "D": "把数据端口当状态端口"
      },
      "answer": "B",
      "explanation": "状态与控制可有同位号但语义不同，是否就绪必须看状态端口；启动并不等于立即完成。"
    }
  ],
  "computer-organization:ch7-s3": [
    {
      "id": "co-pq-1-r2",
      "type": "judge",
      "stem": "忙等式程序查询I/O中，CPU在循环内不断查询设备状态，会占用本可用于其他计算的处理机时间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "程序查询方式由 CPU 循环检测设备状态，期间不能做其他工作，CPU 利用率低。"
    },
    {
      "id": "co-pq-2",
      "type": "single",
      "stem": "程序查询方式的工作过程是？",
      "options": {
        "A": "CPU 反复读取设备状态端口，就绪后再传送数据",
        "B": "设备主动通知 CPU",
        "C": "由 DMA 控制器传送",
        "D": "由通道传送"
      },
      "answer": "A",
      "explanation": "CPU 在循环中轮询状态端口，直到设备就绪才进行数据传送。"
    },
    {
      "id": "co-pq-4",
      "type": "single",
      "stem": "程序查询方式的优点是？",
      "options": {
        "A": "硬件简单、控制容易",
        "B": "CPU 利用率高",
        "C": "传输速度最快",
        "D": "不需要接口"
      },
      "answer": "A",
      "explanation": "程序查询实现简单，不需要中断或 DMA 硬件。"
    },
    {
      "id": "co-pq-5",
      "type": "judge",
      "stem": "程序查询方式不需要中断机制即可完成 I/O。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "CPU 主动轮询状态，不依赖中断通知。"
    },
    {
      "id": "qa-20261002-computer-organization-ch7-s3-01",
      "type": "single",
      "stem": "CPU每次查询耗40周期，每秒查询50万次，主频2GHz，查询本身占CPU时间比例为？",
      "options": {
        "A": "0.1%",
        "B": "20%",
        "C": "1%",
        "D": "10%"
      },
      "answer": "C",
      "explanation": "每秒查询周期40×500000=20000000，除2×10^9=0.01；不含其他数据搬运成本。"
    }
  ],
  "computer-organization:ch7-s4": [
    {
      "id": "co-intr-1",
      "type": "single",
      "stem": "中断隐指令的功能（保存断点、关中断、引出中断服务程序）由谁完成？",
      "options": {
        "A": "硬件自动完成",
        "B": "操作系统软件完成",
        "C": "用户程序完成",
        "D": "DMA 控制器完成"
      },
      "answer": "A",
      "explanation": "中断隐指令并不是真正的指令，而是由硬件在响应中断时自动完成的一系列操作。"
    },
    {
      "id": "co-intr-6",
      "type": "single",
      "stem": "与程序查询相比，中断方式的主要优点是？",
      "options": {
        "A": "CPU 无需轮询，可并行处理其他任务",
        "B": "硬件更简单",
        "C": "不需要接口",
        "D": "传输速度更快（单次）"
      },
      "answer": "A",
      "explanation": "设备就绪时主动发中断，CPU 平时可执行其他程序，提高利用率。"
    },
    {
      "id": "co-intr-8",
      "type": "single",
      "stem": "中断服务程序的主要任务是？",
      "options": {
        "A": "保存/恢复现场并处理设备请求",
        "B": "编译程序",
        "C": "分配内存",
        "D": "调度进程"
      },
      "answer": "A",
      "explanation": "服务程序保存现场、完成 I/O 处理，返回前恢复现场。"
    },
    {
      "id": "co-intr-9",
      "type": "judge",
      "stem": "多重中断允许高优先级中断打断正在执行的低优先级中断服务。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "多重中断（中断嵌套）提高响应实时性，需按优先级管理。"
    },
    {
      "id": "qa-20261002-computer-organization-ch7-s4-01",
      "type": "single",
      "stem": "设备每秒产生1000个数据字，每字触发中断且每次服务20μs，不计嵌套，服务占CPU时间比例为？",
      "options": {
        "A": "20%",
        "B": "0.2%",
        "C": "50%",
        "D": "2%"
      },
      "answer": "D",
      "explanation": "1000×20μs=20000μs=0.02s每秒，2%；中断虽不忙等仍有服务开销。"
    }
  ],
  "computer-organization:ch7-s5": [
    {
      "id": "co-dma-1",
      "type": "judge",
      "stem": "DMA 方式下，数据在主存与 I/O 设备之间的传输不需要 CPU 逐字干预。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "DMA 由 DMA 控制器直接控制数据传送，CPU 只在开始前设置参数、结束后处理中断。"
    },
    {
      "id": "co-dma-2",
      "type": "single",
      "stem": "DMA 控制器与 CPU 争用主存的常用方法不包括？",
      "options": {
        "A": "程序查询",
        "B": "停止 CPU 访存",
        "C": "周期挪用",
        "D": "交替访问"
      },
      "answer": "A",
      "explanation": "DMA 与 CPU 争用主存的方式有停止 CPU 访存、周期挪用和交替访问；程序查询是 I/O 控制方式而非争用方法。"
    },
    {
      "id": "co-dma-3",
      "type": "single",
      "stem": "DMA 方式下，数据在主存与设备之间的传送由谁控制？",
      "options": {
        "A": "DMA 控制器",
        "B": "CPU 逐字搬运",
        "C": "操作系统内核",
        "D": "Cache"
      },
      "answer": "A",
      "explanation": "DMA 控制器直接控制数据传送，CPU 只在开始与结束时介入。"
    },
    {
      "id": "co-dma-4-r2",
      "type": "judge",
      "stem": "配置了完成中断的DMA控制器在整块传送完成后，可用中断通知CPU；DMA传输本身不要求逐字中断。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "传送结束由 DMA 控制器发出中断，CPU 再处理后续工作。"
    },
    {
      "id": "exam-computer-organization-ch7-s5-2021-20-b-r2",
      "type": "single",
      "stem": "DMA 传送一块数据时，CPU 通常在何时收到中断？",
      "options": {
        "A": "整块传送完成或发生异常时",
        "B": "每传一个字节都必然中断",
        "C": "每次执行加法时",
        "D": "主存刷新之前"
      },
      "answer": "A",
      "explanation": "DMA 常以块为单位传送，结束时通知 CPU，减少逐字节干预。"
    },
    {
      "id": "qa-20261002-computer-organization-ch7-s5-01",
      "type": "single",
      "stem": "DMA传4096字节，每次总线传4字节占1周期，100MHz，忽略仲裁和设置开销，传输至少占多少总线周期与时间？",
      "options": {
        "A": "1024周期、10.24μs",
        "B": "4096周期、40.96μs",
        "C": "1024周期、1.024μs",
        "D": "256周期、2.56μs"
      },
      "answer": "A",
      "explanation": "4096/4=1024次，周期10ns，合10240ns=10.24μs；CPU不逐字执行指令但总线仍被占用。"
    }
  ]
});
})(window);
