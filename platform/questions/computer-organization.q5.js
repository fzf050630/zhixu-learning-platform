/* 知序 · 计算机组成原理补充题目（把每个小节补足到 5 题） */
(function (global) {
  'use strict';
  const bank = global.ZhixuQuestions = global.ZhixuQuestions || {};
  const add = (nodeId, questions) => { bank[nodeId] = (bank[nodeId] || []).concat(questions); };

  add('computer-organization:ch1-s1', [
    { id: 'co-vn-2', type: 'single', stem: '冯·诺依曼计算机的五大部件是？', options: { A: '运算器、控制器、存储器、输入设备、输出设备', B: 'CPU、内存、硬盘、键盘、显示器', C: '寄存器、Cache、主存、辅存、总线', D: 'ALU、PC、IR、MAR、MDR' }, answer: 'A', explanation: '五大部件为运算器、控制器、存储器、输入设备和输出设备。' },
    { id: 'co-vn-3', type: 'judge', stem: '冯·诺依曼计算机中指令和数据都以二进制形式存放在存储器中。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '指令与数据同等地位存储，这是存储程序思想的基础。' },
    { id: 'co-vn-4', type: 'single', stem: '计算机系统的层次结构自下而上通常为？', options: { A: '硬件→系统软件→应用软件', B: '应用软件→系统软件→硬件', C: '系统软件→硬件→应用软件', D: '硬件→应用软件→系统软件' }, answer: 'A', explanation: '最底层是硬件，其上为系统软件，最上层是应用软件。' },
    { id: 'co-vn-5', type: 'judge', stem: '现代计算机已从以运算器为中心发展为以存储器为中心。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '早期冯·诺依曼机以运算器为中心，现代机器改为以存储器为中心。' },
  ]);

  add('computer-organization:ch1-s2', [
    { id: 'co-sw-1', type: 'single', stem: '计算机软件通常分为？', options: { A: '系统软件与应用软件', B: '编译软件与解释软件', C: '输入软件与输出软件', D: '硬件软件与固件' }, answer: 'A', explanation: '系统软件管理硬件并提供平台，应用软件解决具体问题。' },
    { id: 'co-sw-2', type: 'single', stem: '计算机硬件由哪五大部件组成？', options: { A: '运算器、控制器、存储器、输入、输出', B: 'CPU、GPU、内存、磁盘、网卡', C: '寄存器、Cache、主存、辅存、总线', D: '主板、电源、显卡、声卡、网卡' }, answer: 'A', explanation: '硬件五大部件与冯·诺依曼结构一致。' },
    { id: 'co-sw-3', type: 'judge', stem: '软件和硬件在逻辑功能上是等价的，某些功能既可用硬件也可用软件实现。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '软硬件在逻辑上可相互替代，如乘法可用硬件乘法器或软件循环实现。' },
    { id: 'co-sw-4', type: 'single', stem: '计算机中的固件通常是指什么？', options: { A: '固化在 ROM 中的程序，介于软硬件之间', B: '纯硬件电路', C: '纯应用软件', D: '操作系统内核' }, answer: 'A', explanation: '固件是写入 ROM/闪存的程序，具有软件的灵活性又像硬件一样固定。' },
    { id: 'co-sw-5', type: 'judge', stem: '编译程序属于系统软件。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '编译程序、操作系统、数据库管理系统等属于系统软件。' },
  ]);

  add('computer-organization:ch1-s3', [
    { id: 'co-sp-1', type: 'single', stem: '“存储程序”思想的核心是？', options: { A: '程序和数据预先存入存储器，机器自动逐条取出执行', B: '程序存放在磁盘中', C: '指令用十进制表示', D: '数据不参与运算' }, answer: 'A', explanation: '存储程序使计算机能自动、连续地执行程序。' },
    { id: 'co-sp-2', type: 'single', stem: '一条指令的执行过程通常包括？', options: { A: '取指、译码、执行', B: '输入、处理、输出', C: '编译、链接、运行', D: '读、写、擦除' }, answer: 'A', explanation: '基本过程为取指、译码、执行，间址与中断周期可选。' },
    { id: 'co-sp-3', type: 'judge', stem: '机器指令一般由操作码和地址码两部分组成。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '操作码指明做什么，地址码指明操作数或结果位置。' },
    { id: 'co-sp-4', type: 'single', stem: '程序计数器 PC 的作用是？', options: { A: '存放将要执行指令的地址，取指后自动加 1', B: '存放当前指令', C: '存放运算结果', D: '存放操作数' }, answer: 'A', explanation: 'PC 指向下一条待取指令地址，顺序执行时自动递增。' },
    { id: 'co-sp-5', type: 'judge', stem: '指令一般按地址顺序执行，遇到转移指令时改变执行顺序。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '转移、调用、返回等指令会修改 PC，改变程序流程。' },
  ]);

  add('computer-organization:ch1-s4', [
    { id: 'co-perf-2', type: 'single', stem: '性能指标 CPI 表示什么？', options: { A: '每条指令平均所需时钟周期数', B: '每秒执行的指令数', C: '主频的倒数', D: 'Cache 命中率' }, answer: 'A', explanation: 'CPI（Cycles Per Instruction）是执行一条指令平均所需的时钟周期数。' },
    { id: 'co-perf-3', type: 'judge', stem: '主频与时钟周期互为倒数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '时钟周期 = 1/主频，主频越高时钟周期越短。' },
    { id: 'co-perf-4', type: 'single', stem: 'CPU 执行时间等于？', options: { A: '指令数 × CPI × 时钟周期', B: '指令数 × 主频', C: 'CPI × 主频', D: '指令数 ÷ 主频' }, answer: 'A', explanation: 'CPU 时间 = 指令条数 × CPI × 时钟周期长度（或 = 指令数×CPI/主频）。' },
    { id: 'co-perf-5', type: 'judge', stem: '在指令集相同时，MIPS 越大通常表示性能越好。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'MIPS 表示每秒百万条指令，同指令集下越大性能越高，但不同指令集间不可直接比较。' },
  ]);

  add('computer-organization:ch2-s1', [
    { id: 'co-base-2', type: 'single', stem: '二进制数转换为八进制或十六进制时，常用的方法是？', options: { A: '按 3 位或 4 位分组转换', B: '逐位取反', C: '乘 2 取整', D: '除以基数取余' }, answer: 'A', explanation: '二进制每 3 位对应 1 位八进制，每 4 位对应 1 位十六进制。' },
    { id: 'co-base-3', type: 'judge', stem: '任意进制数转换为十进制，可按位权展开求和。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '按权展开：各位数字乘以基数的相应次幂后求和。' },
    { id: 'co-base-4', type: 'single', stem: '把十进制小数转换为二进制小数，常用？', options: { A: '乘 2 取整法', B: '除 2 取余法', C: '按权展开', D: '分组法' }, answer: 'A', explanation: '小数部分不断乘 2，取整数位作为二进制位，直到为 0 或达精度。' },
    { id: 'co-base-5', type: 'judge', stem: '8421 BCD 码用 4 位二进制表示 1 位十进制数字。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '8421 码各位权为 8、4、2、1，直接对应十进制数字。' },
  ]);

  add('computer-organization:ch2-s2', [
    { id: 'co-fixed-2', type: 'single', stem: '定点数的常用机器数表示法不包括？', options: { A: '浮点码', B: '原码', C: '反码', D: '补码' }, answer: 'A', explanation: '定点数有原码、反码、补码、移码等；浮点码不是定点编码。' },
    { id: 'co-fixed-3', type: 'judge', stem: '补码中 0 的表示唯一，而原码有 +0 和 −0 两种表示。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '补码的 0 只有一种形式，这也是补码优于原码的原因之一。' },
    { id: 'co-fixed-4', type: 'single', stem: '对于正数，其原码、反码、补码的关系是？', options: { A: '三者相同', B: '原码=补码，反码不同', C: '三者都不同', D: '原码与反码相同，补码不同' }, answer: 'A', explanation: '正数的原码、反码、补码完全相同；负数需转换。' },
    { id: 'co-fixed-5', type: 'judge', stem: '移码常用于表示浮点数的阶码。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '移码便于比较阶码大小，常用于 IEEE 754 的阶码表示。' },
  ]);

  add('computer-organization:ch2-s3', [
    { id: 'co-arith-1', type: 'single', stem: '计算机中实现减法运算通常采用的方法是？', options: { A: '把减法转换为补码加法', B: '直接做十进制减法', C: '用原码直接相减', D: '用反码直接相减' }, answer: 'A', explanation: '补码把加减法统一为加法，简化运算部件设计。' },
    { id: 'co-arith-2', type: 'single', stem: '判断补码加法是否溢出，常用方法是？', options: { A: '看最高位进位与次高位进位是否相同', B: '看结果是否为 0', C: '看符号位', D: '看是否进位' }, answer: 'A', explanation: '两进位异或为 1 则溢出；也可用双符号位判断。' },
    { id: 'co-arith-3', type: 'judge', stem: '两个正数相加得到负数、或两个负数相加得到正数，说明发生了溢出。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '同号相加结果异号即溢出，这是溢出的直观表现。' },
    { id: 'co-arith-4', type: 'single', stem: '定点乘法可以用哪种方法实现？', options: { A: '原码一位乘或补码一位乘（Booth）', B: '折半查找', C: '哈希', D: '快速排序' }, answer: 'A', explanation: '原码一位乘取绝对值相乘，Booth 算法适合补码乘法。' },
    { id: 'co-arith-5', type: 'judge', stem: '算术右移保持符号位不变，逻辑右移高位补 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '算术移位用于有符号数，逻辑移位用于无符号数。' },
  ]);

  add('computer-organization:ch2-s4', [
    { id: 'co-ieee-3', type: 'single', stem: 'IEEE 754 单精度浮点数中，尾数部分实际有几位有效位？', options: { A: '24 位（含隐含的 1）', B: '23 位', C: '8 位', D: '32 位' }, answer: 'A', explanation: '规格化数的尾数最高位隐含为 1，实际有效位为 23+1=24 位。' },
    { id: 'co-ieee-4', type: 'judge', stem: '规格化浮点数的尾数最高位隐含为 1，不显式存储。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'IEEE 754 采用隐含最高位 1 的方式，多获得一位精度。' },
    { id: 'co-ieee-5', type: 'single', stem: 'IEEE 754 浮点数中，阶码采用什么编码？', options: { A: '移码', B: '原码', C: '反码', D: '补码' }, answer: 'A', explanation: '阶码用移码表示，便于比较大小；尾数用原码（符号+绝对值）。' },
  ]);

  add('computer-organization:ch2-s5', [
    { id: 'co-fpadd-2', type: 'single', stem: '浮点数加减运算的正确步骤是？', options: { A: '对阶→尾数运算→规格化→舍入→溢出判断', B: '相乘→相加→输出', C: '取反→加 1→输出', D: '排序→对齐→输出' }, answer: 'A', explanation: '浮点加减依次进行对阶、尾数加减、规格化、舍入和溢出判断。' },
    { id: 'co-fpadd-3', type: 'judge', stem: '对阶时采用“小阶向大阶看齐”，小阶数的尾数右移。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '尾数右移会丢失低位，故让小阶向大阶看齐以减少精度损失。' },
    { id: 'co-fpadd-4', type: 'single', stem: '浮点数规格化分为左规和右规，其目的是？', options: { A: '使尾数满足规格化形式，保证精度与表示唯一', B: '改变数值大小', C: '加快运算', D: '节省内存' }, answer: 'A', explanation: '规格化使尾数最高有效位为 1，保证浮点表示的规范与精度。' },
    { id: 'co-fpadd-5', type: 'judge', stem: '浮点运算的舍入常采用“0 舍 1 入”或“就近舍入”等方法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '舍入用于处理对阶或规格化后超出尾数位数的部分。' },
  ]);

  add('computer-organization:ch2-s6', [
    { id: 'co-alu-1', type: 'single', stem: '加法器通常由什么构成？', options: { A: '若干全加器级联', B: '若干触发器', C: '译码器', D: '计数器' }, answer: 'A', explanation: '加法器由全加器串行或并行连接构成，实现多位加法。' },
    { id: 'co-alu-2', type: 'single', stem: '串行进位加法器的主要缺点是？', options: { A: '进位逐级传递，速度慢', B: '电路太复杂', C: '不能进位', D: '功耗太低' }, answer: 'A', explanation: '串行进位需等待低位进位逐级传到高位，延迟较大。' },
    { id: 'co-alu-3', type: 'judge', stem: 'ALU 既能执行算术运算，也能执行逻辑运算。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '算术逻辑单元（ALU）完成加减乘除与与、或、非、异或等运算。' },
    { id: 'co-alu-4', type: 'single', stem: '先行进位（并行进位）加法器提高速度的原理是？', options: { A: '同时产生各位进位，减少进位传递延迟', B: '减少加法器位数', C: '降低主频', D: '增加时钟周期' }, answer: 'A', explanation: '先行进位通过进位产生/传递函数直接算出各进位，避免逐级等待。' },
    { id: 'co-alu-5', type: 'judge', stem: '减法运算在计算机中通常用补码加法实现。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'A−B = A + (−B)补，统一用加法器实现。' },
  ]);

  add('computer-organization:ch3-s1', [
    { id: 'co-mem-1', type: 'single', stem: '存储器的层次结构自顶向下通常是？', options: { A: '寄存器→Cache→主存→辅存', B: '辅存→主存→Cache→寄存器', C: '主存→寄存器→Cache→辅存', D: 'Cache→寄存器→辅存→主存' }, answer: 'A', explanation: '越靠近 CPU 速度越快、容量越小、价格越高。' },
    { id: 'co-mem-2', type: 'single', stem: 'Cache—主存层次主要解决什么问题？', options: { A: '速度匹配问题', B: '容量问题', C: '成本问题', D: '功耗问题' }, answer: 'A', explanation: 'Cache 缓解 CPU 与主存的速度差异；主存—辅存层次解决容量问题。' },
    { id: 'co-mem-3', type: 'judge', stem: '存储层次中，越靠近 CPU 的存储器速度越快、容量越小。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是存储层次的“速度—容量—价格”折中规律。' },
    { id: 'co-mem-4', type: 'single', stem: 'Cache 能够有效工作的理论基础是？', options: { A: '程序访问的局部性原理', B: '程序的顺序性', C: '大数定律', D: '香农定理' }, answer: 'A', explanation: '时间局部性与空间局部性使常用数据集中在少量块中。' },
    { id: 'co-mem-5', type: 'judge', stem: '按存取方式，存储器可分为随机存取、顺序存取、直接存取和相联存取。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'RAM 随机存取、磁带顺序存取、磁盘直接存取、相联存储器按内容存取。' },
  ]);

  add('computer-organization:ch3-s2', [
    { id: 'co-main-1', type: 'single', stem: 'SRAM 与 DRAM 相比，其特点是？', options: { A: '速度快但集成度低、成本高', B: '速度慢但密度高', C: '需要刷新', D: '不能随机访问' }, answer: 'A', explanation: 'SRAM 用触发器存储，快且不需刷新，但集成度低、贵，多用作 Cache。' },
    { id: 'co-main-2', type: 'single', stem: 'DRAM 需要定期刷新的原因是？', options: { A: '用电容存储电荷，电荷会泄漏', B: '温度过高', C: '电压不稳', D: '指令要求' }, answer: 'A', explanation: 'DRAM 用电容保存信息，电容会漏电，故需周期性刷新。' },
    { id: 'co-main-3', type: 'judge', stem: 'ROM 断电后存储的信息不会丢失。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'ROM 是非易失性存储器，断电后内容保持。' },
    { id: 'co-main-4', type: 'single', stem: '存储器的容量等于什么？', options: { A: '存储单元数 × 每单元位数', B: '地址线数 × 数据线数', C: '字数 × 字长', D: 'A 与 C 都对' }, answer: 'D', explanation: '容量 = 单元数 × 字长，也就是字数 × 字长。' },
    { id: 'co-main-5', type: 'judge', stem: '主存储器按地址随机访问，访问任意单元的时间基本相同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '随机存取意味着访问时间与地址无关，这是主存的重要特性。' },
  ]);

  add('computer-organization:ch3-s3', [
    { id: 'co-conn-1', type: 'single', stem: '存储器芯片的地址线数量决定了？', options: { A: '可寻址的存储单元数', B: '字长', C: '数据线数量', D: '读写速度' }, answer: 'A', explanation: 'n 根地址线可寻址 2ⁿ 个单元；数据线数量决定字长。' },
    { id: 'co-conn-2', type: 'single', stem: '位扩展与字扩展分别用于？', options: { A: '位扩展增加字长，字扩展增加存储单元数', B: '位扩展增加单元数', C: '字扩展增加字长', D: '两者相同' }, answer: 'A', explanation: '位扩展把芯片并联增加数据位数；字扩展增加存储字数。' },
    { id: 'co-conn-3', type: 'judge', stem: '多个存储芯片连接时，片选信号用于选择当前访问的芯片。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '片选（CS）有效时该芯片才响应读写，否则处于高阻。' },
    { id: 'co-conn-4', type: 'single', stem: '存储器扩展中常用的地址译码方法有？', options: { A: '线选法与译码片选法', B: '折半法与哈希法', C: '同步法与异步法', D: '串行法与并行法' }, answer: 'A', explanation: '线选法用高位地址直接选片，译码片选法用译码器产生片选。' },
    { id: 'co-conn-5', type: 'judge', stem: '存储器扩展时需要正确连接地址线、数据线和控制线。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '地址线决定寻址、数据线决定字长、控制线控制读写，三者都要接好。' },
  ]);

  add('computer-organization:ch3-s4', [
    { id: 'co-disk-1', type: 'single', stem: '磁盘的存取时间由哪几部分组成？', options: { A: '寻道时间 + 旋转延迟 + 传输时间', B: '仅寻道时间', C: '仅传输时间', D: 'CPU 时间' }, answer: 'A', explanation: '磁盘存取时间由寻道、旋转延迟和传输时间构成。' },
    { id: 'co-disk-2', type: 'single', stem: '磁盘容量的计算公式是？', options: { A: '磁头数 × 柱面数 × 每道扇区数 × 扇区容量', B: '磁头数 × 转速', C: '柱面数 × 扇区大小', D: '容量 = 转速 × 传输率' }, answer: 'A', explanation: '总容量 = 记录面（磁头）数 × 柱面数 × 每磁道扇区数 × 扇区字节数。' },
    { id: 'co-disk-3', type: 'judge', stem: '磁盘的平均旋转延迟约为旋转半圈所需的时间。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '目标扇区平均需等半圈才转到磁头下，故平均旋转延迟 = 半圈时间。' },
    { id: 'co-disk-4', type: 'single', stem: '固态硬盘（SSD）相比机械硬盘的优势是？', options: { A: '无机械部件，随机访问快、抗震', B: '容量更大且更便宜', C: '不需要接口', D: '断电不丢失（机械盘会丢失）' }, answer: 'A', explanation: 'SSD 基于闪存，无寻道与旋转，随机读写和抗震性能好，但成本较高。' },
    { id: 'co-disk-5', type: 'judge', stem: 'RAID 技术可以提升存储系统的可靠性和/或性能。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'RAID 通过镜像、校验、条带化等手段提高可靠性或吞吐量。' },
  ]);

  add('computer-organization:ch3-s5', [
    { id: 'co-cacheb-1', type: 'single', stem: 'Cache 能提高访存速度的根本原因是？', options: { A: '利用了程序访问的局部性', B: '容量比主存大', C: '价格比主存低', D: '不需要地址转换' }, answer: 'A', explanation: '局部性使少量常用块被频繁访问，Cache 命中率高。' },
    { id: 'co-cacheb-2', type: 'single', stem: 'Cache 命中率的定义是？', options: { A: '命中次数 ÷ 总访问次数', B: '缺失次数 ÷ 总访问次数', C: 'Cache 容量 ÷ 主存容量', D: '命中时间 ÷ 缺失时间' }, answer: 'A', explanation: '命中率 = 命中次数/总访问次数，缺失率 = 1 − 命中率。' },
    { id: 'co-cacheb-3', type: 'judge', stem: '平均访问时间 = 命中时间 + 缺失率 × 缺失代价。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是 Cache 性能的基本公式，命中率越高平均访问时间越短。' },
    { id: 'co-cacheb-4', type: 'single', stem: 'Cache 与主存之间以什么为单位交换数据？', options: { A: '块（行）', B: '字节', C: '字', D: '页' }, answer: 'A', explanation: 'Cache 与主存按块交换，利用空间局部性一次装入相邻数据。' },
    { id: 'co-cacheb-5', type: 'judge', stem: 'Cache 的存在对程序员是透明的，程序员无需显式管理。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'Cache 由硬件自动管理，程序看到的仍是统一的存储空间。' },
  ]);

  add('computer-organization:ch3-s6', [
    { id: 'co-cache-3', type: 'single', stem: '直接映射方式下，主存地址被划分为？', options: { A: '标记 + 行号（组号）+ 块内地址', B: '仅标记', C: '仅块内地址', D: '标记 + 块内地址' }, answer: 'A', explanation: '直接映射按行号定位唯一 Cache 行，标记用于比较，块内地址选块内字节。' },
    { id: 'co-cache-4', type: 'judge', stem: '组相联映射是直接映射与全相联映射的折中。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '组间直接映射、组内全相联，兼顾硬件成本与命中率。' },
    { id: 'co-cache-5', type: 'single', stem: '全相联映射的特点是？', options: { A: '主存块可放入任意 Cache 行，冲突最少但比较电路最复杂', B: '只能放入唯一行', C: '不需要标记', D: '命中率最低' }, answer: 'A', explanation: '全相联灵活、冲突少，但需并行比较所有标记，硬件开销大。' },
  ]);

  add('computer-organization:ch3-s7', [
    { id: 'co-repl-1', type: 'single', stem: 'Cache 常用的替换算法不包括？', options: { A: '最短作业优先', B: '随机算法', C: 'FIFO', D: 'LRU' }, answer: 'A', explanation: 'Cache 替换算法有随机、FIFO、LRU、LFU 等；最短作业优先是进程调度算法。' },
    { id: 'co-repl-2', type: 'judge', stem: 'LRU 替换算法利用了程序的局部性，通常效果较好。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'LRU 淘汰最久未使用的块，符合时间局部性，命中率较高。' },
    { id: 'co-repl-3', type: 'single', stem: '写回法（Write Back）与写直达（Write Through）的区别是？', options: { A: '写回用脏位，仅在块替换时写主存；写直达每次写都更新主存', B: '写回每次都写主存', C: '写直达不写主存', D: '两者相同' }, answer: 'A', explanation: '写回减少主存写次数但需脏位与一致性处理；写直达简单但写操作频繁。' },
    { id: 'co-repl-4', type: 'judge', stem: '写分配与非写分配是 Cache 写缺失时是否把块调入 Cache 的两种策略。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '写分配在写缺失时调块入 Cache，常与写回配合；非写分配常与写直达配合。' },
  ]);

  add('computer-organization:ch3-s8', [
    { id: 'co-vm-3', type: 'single', stem: '页式虚拟存储器中，虚拟地址被划分为？', options: { A: '虚页号 + 页内偏移', B: '段号 + 段内偏移', C: '标记 + 行号', D: '块号 + 块内地址' }, answer: 'A', explanation: '虚地址 = 虚页号（用于查页表）+ 页内偏移（直接映射到实地址）。' },
    { id: 'co-vm-4', type: 'judge', stem: '页表实现虚页号到实页号（页框号）的映射。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '页表项记录虚页对应的实页号及有效位、修改位等。' },
    { id: 'co-vm-5', type: 'single', stem: '发生缺页时，由谁负责把所需页面从辅存调入主存？', options: { A: '操作系统的缺页处理程序', B: 'Cache 控制器', C: '编译器', D: '用户程序' }, answer: 'A', explanation: '缺页触发异常，由操作系统缺页处理程序从磁盘调入页面并更新页表。' },
  ]);

  add('computer-organization:ch4-s1', [
    { id: 'co-fmt-2', type: 'single', stem: '机器指令通常由哪两部分组成？', options: { A: '操作码 + 地址码', B: '序号 + 数据', C: '标记 + 行号', D: '源 + 目的' }, answer: 'A', explanation: '操作码指明操作类型，地址码指明操作数地址或立即数。' },
    { id: 'co-fmt-3', type: 'judge', stem: '定长操作码译码简单，扩展操作码编码更灵活、更节省编码空间。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '定长操作码规整易译码；扩展操作码在指令字长受限时更高效。' },
    { id: 'co-fmt-4', type: 'single', stem: '按地址码个数，指令可分为？', options: { A: '零地址、一地址、二地址、三地址等', B: '算术与逻辑指令', C: '转移与调用指令', D: '定长与变长指令' }, answer: 'A', explanation: '地址码个数决定指令格式，如二地址指令两个操作数。' },
    { id: 'co-fmt-5', type: 'judge', stem: '指令字长可以是定长的，也可以是变长的。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '定长指令便于流水与译码，变长指令编码更紧凑。' },
  ]);

  add('computer-organization:ch4-s2', [
    { id: 'co-addr-3', type: 'single', stem: '下列哪一项不属于常见的寻址方式？', options: { A: '编译寻址', B: '立即寻址', C: '间接寻址', D: '变址寻址' }, answer: 'A', explanation: '常见寻址方式有立即、直接、间接、寄存器、寄存器间接、相对、基址、变址等。' },
    { id: 'co-addr-4', type: 'judge', stem: '变址寻址特别适合处理数组等成批数据。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '变址寄存器可自动递增，遍历数组时地址连续变化。' },
    { id: 'co-addr-5', type: 'single', stem: '基址寻址的主要用途是？', options: { A: '实现程序的浮动（重定位）', B: '表示立即数', C: '实现乘法', D: '减少内存' }, answer: 'A', explanation: '基址寄存器给出程序段起始地址，使程序可在内存中浮动。' },
  ]);

  add('computer-organization:ch4-s3', [
    { id: 'co-ext-2', type: 'single', stem: '扩展操作码的基本思想是？', options: { A: '通过缩短地址码字段来扩展操作码长度', B: '增加指令字长', C: '减少指令种类', D: '使用定长操作码' }, answer: 'A', explanation: '在指令字长固定时，地址码位数减少可为操作码腾出更多编码空间。' },
    { id: 'co-ext-3', type: 'judge', stem: '采用扩展操作码时，短操作码不能是长操作码的前缀。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '否则译码会产生歧义，无法区分不同指令。' },
    { id: 'co-ext-4', type: 'single', stem: '在指令字长固定时，操作码扩展与地址码位数之间是？', options: { A: '此消彼长的关系', B: '相互独立', C: '成正比', D: '无关' }, answer: 'A', explanation: '地址码占位越多，可用于操作码的位数越少。' },
    { id: 'co-ext-5', type: 'judge', stem: '扩展操作码可以提高指令编码的效率。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '高频指令用短操作码，低频指令用长操作码，整体编码更高效。' },
  ]);

  add('computer-organization:ch4-s4', [
    { id: 'co-asm-1', type: 'single', stem: '汇编语言与机器指令的关系是？', options: { A: '一条汇编指令通常对应一条机器指令', B: '完全无关', C: '汇编比机器指令多', D: '汇编不能转机器码' }, answer: 'A', explanation: '汇编是机器指令的符号化表示，经汇编器翻译为机器码。' },
    { id: 'co-asm-2', type: 'single', stem: '机器级指令的操作数可以是？', options: { A: '寄存器、内存单元或立即数', B: '只能是寄存器', C: '只能是立即数', D: '只能是文件' }, answer: 'A', explanation: '操作数来源包括寄存器、存储器与立即数，由寻址方式决定。' },
    { id: 'co-asm-3', type: 'judge', stem: '汇编语言程序需要经过汇编器翻译成机器码才能执行。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '汇编器把助记符与符号地址转换为二进制机器码。' },
    { id: 'co-asm-4', type: 'single', stem: '过程调用时通常用栈保存什么？', options: { A: '返回地址与调用现场', B: '只保存数据', C: '只保存指令', D: '什么都不保存' }, answer: 'A', explanation: '栈保存返回地址、寄存器现场和局部变量，支持嵌套调用。' },
    { id: 'co-asm-5', type: 'judge', stem: '机器级代码与具体的指令集体系结构相关，不可跨架构直接运行。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不同 ISA 的机器码不兼容，需重新编译。' },
  ]);

  add('computer-organization:ch4-s5', [
    { id: 'co-cisc-1', type: 'single', stem: 'CISC 与 RISC 的主要区别是？', options: { A: 'CISC 指令多而复杂，RISC 指令精简', B: 'CISC 指令少', C: 'RISC 指令复杂', D: '两者完全相同' }, answer: 'A', explanation: 'CISC 追求功能强、指令多；RISC 追求精简、规整、流水友好。' },
    { id: 'co-cisc-2', type: 'judge', stem: 'RISC 通常采用 load/store 架构，运算只在寄存器间进行。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'RISC 只有 load/store 访存，其余运算在寄存器间完成。' },
    { id: 'co-cisc-3', type: 'single', stem: 'RISC 更适合流水线的原因是？', options: { A: '指令定长、格式规整、寻址方式少', B: '指令复杂', C: '指令变长', D: '寻址方式多' }, answer: 'A', explanation: '规整的指令便于流水线各阶段均衡划分与并行。' },
    { id: 'co-cisc-4', type: 'judge', stem: 'CISC 的指令长度多为可变，RISC 的指令多为定长。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'RISC 定长指令简化取指与译码，利于流水。' },
  ]);

  add('computer-organization:ch5-s1', [
    { id: 'co-cpu-1', type: 'single', stem: 'CPU 主要由哪两部分组成？', options: { A: '运算器与控制器', B: '寄存器与内存', C: 'Cache 与主存', D: '输入与输出' }, answer: 'A', explanation: 'CPU = 运算器（ALU 等）+ 控制器，另含寄存器组。' },
    { id: 'co-cpu-2', type: 'single', stem: 'CPU 的运算器通常包含哪些部件？', options: { A: 'ALU、寄存器、暂存器', B: 'PC 与 IR', C: '内存与磁盘', D: '总线与接口' }, answer: 'A', explanation: '运算器核心是 ALU，另有通用寄存器与暂存寄存器。' },
    { id: 'co-cpu-3', type: 'judge', stem: '控制器负责产生控制信号，协调各部件按序工作。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '控制器根据指令译码结果发出控制信号，指挥数据通路动作。' },
    { id: 'co-cpu-4', type: 'single', stem: '下列哪个是专用寄存器？', options: { A: 'PC（程序计数器）', B: '通用寄存器 R0', C: '累加器 ACC（通用用途时）', D: '数据寄存器通用组' }, answer: 'A', explanation: 'PC、IR、MAR、MDR 等是专用寄存器，用途固定。' },
    { id: 'co-cpu-5', type: 'judge', stem: 'CPU 从主存取指令并执行，指令与数据都经总线传输。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'CPU 通过地址、数据、控制总线与主存交互，完成取指与执行。' },
  ]);

  add('computer-organization:ch5-s2', [
    { id: 'co-cycle-2', type: 'single', stem: '一个完整的指令周期通常包含？', options: { A: '取指周期、间址周期、执行周期、中断周期', B: '仅取指与执行', C: '编译、链接、运行', D: '读、算、写' }, answer: 'A', explanation: '指令周期由取指、间址（可选）、执行、中断（可选）组成。' },
    { id: 'co-cycle-3', type: 'judge', stem: '不同指令的指令周期长度可能不同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '简单指令周期短，复杂指令（含间址、多次访存）周期长。' },
    { id: 'co-cycle-4', type: 'single', stem: '取指周期的主要操作是？', options: { A: '按 PC 从主存取指令送入 IR，并修改 PC', B: '执行算术运算', C: '写回结果', D: '响应中断' }, answer: 'A', explanation: '取指周期取指令到 IR，同时 PC 指向下一条指令。' },
    { id: 'co-cycle-5', type: 'judge', stem: '间址周期用于间接寻址，从主存取操作数的有效地址。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '间接寻址时先取形式地址再访存得到有效地址。' },
  ]);

  add('computer-organization:ch5-s3', [
    { id: 'co-dp-1', type: 'single', stem: 'CPU 中的数据通路是指什么？', options: { A: '数据在 CPU 各部件之间传输的路径', B: '磁盘读写通道', C: '网络链路', D: '程序执行顺序' }, answer: 'A', explanation: '数据通路由 ALU、寄存器、总线及控制信号组成。' },
    { id: 'co-dp-2', type: 'single', stem: '单总线结构的主要缺点是？', options: { A: '同一时刻只能传一个数据，易产生冲突', B: '成本太高', C: '速度太快', D: '不能连接寄存器' }, answer: 'A', explanation: '单总线分时复用，一次一个数据，可能成为性能瓶颈。' },
    { id: 'co-dp-3', type: 'judge', stem: '单总线结构在同一时刻只能传输一个数据。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '总线是共享介质，需分时使用。' },
    { id: 'co-dp-4', type: 'single', stem: '多总线结构相比单总线的主要优势是？', options: { A: '提高数据传输的并行性与效率', B: '降低成本', C: '减少寄存器', D: '简化电路' }, answer: 'A', explanation: '多总线可并行传输不同数据，提高吞吐率。' },
    { id: 'co-dp-5', type: 'judge', stem: '数据通路由 ALU、寄存器组和总线等组成。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这些部件通过总线互连，在控制信号下完成数据传送与运算。' },
  ]);

  add('computer-organization:ch5-s4', [
    { id: 'co-ctrl-2', type: 'single', stem: '控制器按实现方式可分为？', options: { A: '硬布线控制器与微程序控制器', B: '同步与异步', C: '串行与并行', D: '单总线与多总线' }, answer: 'A', explanation: '硬布线用组合逻辑产生控制信号；微程序用微指令序列实现。' },
    { id: 'co-ctrl-3', type: 'judge', stem: '微程序控制器用一段微程序来实现一条机器指令。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '每条机器指令对应一段微程序，由若干微指令组成。' },
    { id: 'co-ctrl-4', type: 'single', stem: '微指令格式通常分为？', options: { A: '水平型与垂直型', B: '同步与异步', C: '串行与并行', D: '定长与变长' }, answer: 'A', explanation: '水平型微指令并行能力强、字长较长；垂直型类似机器指令、字长较短。' },
    { id: 'co-ctrl-5', type: 'judge', stem: '硬布线控制器速度较快，但修改和扩展较困难。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '硬布线由固定逻辑电路实现，速度快但不易修改；微程序易修改但较慢。' },
  ]);

  add('computer-organization:ch5-s5', [
    { id: 'co-intr-2', type: 'single', stem: '中断与异常的区别是？', options: { A: '中断通常由外部事件引起，异常由 CPU 内部事件引起', B: '两者完全相同', C: '中断由程序产生', D: '异常由时钟产生' }, answer: 'A', explanation: '中断是外部事件（如 I/O 完成），异常是内部事件（如缺页、除零）。' },
    { id: 'co-intr-3', type: 'single', stem: '中断处理的一般过程是？', options: { A: '关中断→保存断点→识别中断源→服务→恢复', B: '直接执行服务程序', C: '先恢复再保存', D: '不需要保存现场' }, answer: 'A', explanation: '进入中断服务前需关中断、保存现场，服务后恢复并返回。' },
    { id: 'co-intr-4', type: 'judge', stem: '中断优先级决定多个中断同时请求时的响应顺序。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '优先级高的中断先被响应，高优先级可打断低优先级服务（多重中断）。' },
    { id: 'co-intr-5', type: 'single', stem: '中断向量表中存放的是？', options: { A: '各中断服务程序的入口地址', B: '中断优先级', C: '中断次数', D: '设备编号' }, answer: 'A', explanation: 'CPU 按中断类型号查中断向量表得到服务程序入口地址。' },
    { id: 'co-intr-10', type: 'single', stem: 'CPU 内部异常通常不包括？', options: { A: '键盘按键中断', B: '缺页故障', C: '除零自陷', D: '非法指令', }, answer: 'A', explanation: '异常由 CPU 内部事件引起（缺页、除零、非法指令等）；键盘中断属于外部中断。' },
  ]);

  add('computer-organization:ch5-s6', [
    { id: 'co-pipe-2', type: 'single', stem: '指令流水线的基本思想是？', options: { A: '把指令执行划分为若干阶段并重叠执行', B: '一次执行多条相同指令', C: '降低主频', D: '增加指令数' }, answer: 'A', explanation: '流水线让不同指令的不同阶段在时间上重叠，提高吞吐率。' },
    { id: 'co-pipe-3', type: 'judge', stem: '流水线提高的是吞吐率，而不是单条指令的执行时间。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '单条指令延迟可能不变甚至略增，但单位时间完成的指令数增加。' },
    { id: 'co-pipe-4', type: 'single', stem: '流水线的时钟周期通常取决于？', options: { A: '最慢流水段的时间', B: '最快流水段', C: '指令条数', D: '寄存器数量' }, answer: 'A', explanation: '流水线周期由最慢阶段决定，需各段尽量均衡。' },
    { id: 'co-pipe-5', type: 'judge', stem: '流水线填满后，每个时钟周期可完成一条指令。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '理想情况下流水线满负荷时每周期流出一条指令。' },
  ]);

  add('computer-organization:ch5-s7', [
    { id: 'co-haz-1', type: 'single', stem: '流水线的三类冒险是？', options: { A: '结构冒险、数据冒险、控制冒险', B: '读冒险、写冒险、擦除冒险', C: '硬件冒险、软件冒险、编译冒险', D: '同步冒险、异步冒险、混合冒险' }, answer: 'A', explanation: '结构冒险源于资源冲突，数据冒险源于数据依赖，控制冒险源于转移。' },
    { id: 'co-haz-2', type: 'judge', stem: '数据冒险可以用转发（旁路）技术或插入停顿来解决。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '转发把结果直接送给后续指令；无法转发时插入气泡停顿。' },
    { id: 'co-haz-3', type: 'single', stem: '控制冒险通常由什么引起，可用什么缓解？', options: { A: '转移指令；分支预测', B: '数据依赖；转发', C: '资源冲突；增加部件', D: '中断；关中断' }, answer: 'A', explanation: '转移指令使取指不确定，可用分支预测、延迟槽等缓解。' },
    { id: 'co-haz-4', type: 'judge', stem: '吞吐率、加速比和效率是衡量流水线性能的常用指标。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '三者从不同角度刻画流水线的性能。' },
  ]);

  add('computer-organization:ch5-s8', [
    { id: 'co-mp-1', type: 'single', stem: '按 Flynn 分类，多处理器体系结构可分为？', options: { A: 'SISD、SIMD、MISD、MIMD', B: 'CISC 与 RISC', C: '单核与多核', D: '同步与异步' }, answer: 'A', explanation: 'Flynn 按指令流与数据流的数量分为 SISD、SIMD、MISD、MIMD。' },
    { id: 'co-mp-2', type: 'single', stem: '对称多处理器（SMP）的特点是？', options: { A: '所有处理器对等地共享主存与 I/O', B: '有一个主处理器控制其余', C: '处理器不共享内存', D: '只用于嵌入式' }, answer: 'A', explanation: 'SMP 中各处理器地位对等、共享统一主存。' },
    { id: 'co-mp-3', type: 'judge', stem: '多核处理器共享主存时通常需要缓存一致性协议。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '各核私有 Cache 可能副本不一致，需一致性协议（如 MESI）维护。' },
    { id: 'co-mp-4', type: 'single', stem: '硬件多线程技术的目的是？', options: { A: '提高处理器资源利用率，隐藏访存等延迟', B: '降低功耗', C: '减少寄存器', D: '简化电路' }, answer: 'A', explanation: '硬件多线程在一个核上切换多个线程，填补流水线空档。' },
    { id: 'co-mp-5', type: 'judge', stem: '集群系统通过高速网络把多台计算机连接起来协同工作。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '集群用网络互联多台独立计算机，提供高可用与可扩展性。' },
  ]);

  add('computer-organization:ch6-s1', [
    { id: 'co-bus-2', type: 'single', stem: '按功能划分，系统总线通常包括？', options: { A: '数据总线、地址总线、控制总线', B: '同步总线、异步总线', C: '串行总线、并行总线', D: '内部总线、外部总线' }, answer: 'A', explanation: '数据总线传数据，地址总线传地址，控制总线传控制信号。' },
    { id: 'co-bus-3', type: 'judge', stem: '总线是连接多个部件的一组公共信息传输线。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '总线是共享的传输介质，各部件通过总线交换信息。' },
    { id: 'co-bus-4', type: 'single', stem: '总线按连接范围可分为？', options: { A: '片内总线、系统总线、通信总线', B: '同步与异步', C: '串行与并行', D: '数据与控制' }, answer: 'A', explanation: '片内总线在芯片内，系统总线连接计算机各部件，通信总线用于设备间。' },
    { id: 'co-bus-5', type: 'judge', stem: '总线带宽 = 总线宽度 × 总线工作频率。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '带宽反映单位时间传输的数据量，由宽度与频率决定。' },
  ]);

  add('computer-organization:ch6-s2', [
    { id: 'co-busperf-1', type: 'single', stem: '总线带宽表示的是？', options: { A: '单位时间内总线上传输的数据量', B: '总线的长度', C: '总线上的设备数', D: '总线的工作电压' }, answer: 'A', explanation: '总线带宽 = 总线宽度 × 频率，单位为字节/秒。' },
    { id: 'co-busperf-2', type: 'single', stem: '常见的总线结构有？', options: { A: '单总线、双总线、三总线结构', B: '同步与异步结构', C: '串行与并行结构', D: '定长与变长结构' }, answer: 'A', explanation: '按层次可分为单总线、双总线、三总线等结构。' },
    { id: 'co-busperf-3', type: 'judge', stem: '总线宽度即数据总线的位数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '总线宽度指一次能并行传输的数据位数，即数据线根数。' },
    { id: 'co-busperf-4', type: 'single', stem: '总线复用技术的作用是？', options: { A: '用同一组线分时传输不同信息，提高利用率', B: '增加总线数量', C: '降低频率', D: '减少设备' }, answer: 'A', explanation: '总线复用在时间上分用信号线，如地址/数据复用，减少引脚数。' },
    { id: 'co-busperf-5', type: 'judge', stem: '总线仲裁用于解决多个设备争用总线的问题。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '总线仲裁按优先级或轮询决定哪个主设备获得总线控制权。' },
  ]);

  add('computer-organization:ch6-s3', [
    { id: 'co-timing-2', type: 'single', stem: '一个总线事务通常包括？', options: { A: '请求、仲裁、寻址、传输、释放', B: '取指、译码、执行', C: '读、写、擦除', D: '编译、链接、运行' }, answer: 'A', explanation: '总线事务从请求总线到释放总线，完成一次数据传送。' },
    { id: 'co-timing-3', type: 'judge', stem: '同步定时使用统一时钟，异步定时使用握手信号。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '同步定时靠公共时钟；异步定时靠请求/应答握手协调。' },
    { id: 'co-timing-4', type: 'single', stem: '同步定时的主要缺点是？', options: { A: '必须以最慢设备为准，效率受限', B: '控制太复杂', C: '不需要时钟', D: '无法传输数据' }, answer: 'A', explanation: '同步定时所有设备按同一时钟工作，需迁就最慢设备。' },
    { id: 'co-timing-5', type: 'judge', stem: '异步定时灵活但控制较复杂。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '异步定时允许不同速度设备协同，但握手控制逻辑更复杂。' },
  ]);

  add('computer-organization:ch7-s1', [
    { id: 'co-ios-1', type: 'single', stem: 'I/O 系统通常包括？', options: { A: 'I/O 设备、接口、总线与控制器', B: '只有键盘和鼠标', C: '只有硬盘', D: '只有显示器' }, answer: 'A', explanation: 'I/O 系统由设备、设备接口、I/O 总线和设备控制器组成。' },
    { id: 'co-ios-2', type: 'single', stem: '常见的 I/O 控制方式不包括？', options: { A: '编译方式', B: '程序查询方式', C: '中断方式', D: 'DMA 方式' }, answer: 'A', explanation: 'I/O 控制方式有程序查询、程序中断、DMA 和通道方式。' },
    { id: 'co-ios-3', type: 'judge', stem: 'I/O 设备通过接口与主机连接。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '接口完成数据缓冲、格式转换、状态监视与控制。' },
    { id: 'co-ios-4', type: 'single', stem: 'I/O 接口中通常包含哪几类端口？', options: { A: '数据端口、状态端口、控制端口', B: '只读端口', C: '只写端口', D: '网络端口' }, answer: 'A', explanation: '数据端口传数据，状态端口报告设备状态，控制端口接收控制命令。' },
    { id: 'co-ios-5', type: 'judge', stem: 'I/O 端口的编址方式有统一编址和独立编址两种。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '统一编址把端口当内存单元；独立编址用专门的 I/O 指令与地址空间。' },
  ]);

  add('computer-organization:ch7-s2', [
    { id: 'co-if-1', type: 'single', stem: 'I/O 接口的主要功能不包括？', options: { A: '执行算术运算', B: '数据缓冲', C: '格式转换', D: '状态监视' }, answer: 'A', explanation: '接口负责缓冲、格式转换、状态监视和控制；算术运算由 CPU 完成。' },
    { id: 'co-if-2', type: 'single', stem: 'I/O 接口中用于暂存数据的部件是？', options: { A: '数据缓冲寄存器', B: '状态寄存器', C: '控制寄存器', D: '地址寄存器' }, answer: 'A', explanation: '数据缓冲寄存器协调 CPU 与设备的速度差异。' },
    { id: 'co-if-3', type: 'judge', stem: 'I/O 接口可以屏蔽不同设备之间的差异。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '接口把设备的具体特性封装起来，向上提供统一的操作方式。' },
    { id: 'co-if-4', type: 'single', stem: '端口地址的作用是？', options: { A: '供 CPU 选择并访问接口中的特定寄存器', B: '标识设备编号', C: '表示内存容量', D: '表示中断优先级' }, answer: 'A', explanation: 'CPU 通过端口地址读写接口中的数据、状态或控制寄存器。' },
    { id: 'co-if-5', type: 'judge', stem: '接口可以向 CPU 报告设备的状态，供查询或中断使用。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '状态寄存器（如就绪、忙、错误）供 CPU 查询或触发中断。' },
  ]);

  add('computer-organization:ch7-s3', [
    { id: 'co-pq-2', type: 'single', stem: '程序查询方式的工作过程是？', options: { A: 'CPU 反复读取设备状态端口，就绪后再传送数据', B: '设备主动通知 CPU', C: '由 DMA 控制器传送', D: '由通道传送' }, answer: 'A', explanation: 'CPU 在循环中轮询状态端口，直到设备就绪才进行数据传送。' },
    { id: 'co-pq-3', type: 'judge', stem: '程序查询方式下 CPU 利用率低，因为要不断轮询。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '轮询期间 CPU 不能做其他工作，效率低。' },
    { id: 'co-pq-4', type: 'single', stem: '程序查询方式的优点是？', options: { A: '硬件简单、控制容易', B: 'CPU 利用率高', C: '传输速度最快', D: '不需要接口' }, answer: 'A', explanation: '程序查询实现简单，不需要中断或 DMA 硬件。' },
    { id: 'co-pq-5', type: 'judge', stem: '程序查询方式不需要中断机制即可完成 I/O。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'CPU 主动轮询状态，不依赖中断通知。' },
  ]);

  add('computer-organization:ch7-s4', [
    { id: 'co-intr-6', type: 'single', stem: '与程序查询相比，中断方式的主要优点是？', options: { A: 'CPU 无需轮询，可并行处理其他任务', B: '硬件更简单', C: '不需要接口', D: '传输速度更快（单次）' }, answer: 'A', explanation: '设备就绪时主动发中断，CPU 平时可执行其他程序，提高利用率。' },
    { id: 'co-intr-7', type: 'judge', stem: '中断隐指令的功能由硬件自动完成。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '保存断点、关中断、引出服务程序等由硬件在响应中断时自动完成。' },
    { id: 'co-intr-8', type: 'single', stem: '中断服务程序的主要任务是？', options: { A: '保存/恢复现场并处理设备请求', B: '编译程序', C: '分配内存', D: '调度进程' }, answer: 'A', explanation: '服务程序保存现场、完成 I/O 处理，返回前恢复现场。' },
    { id: 'co-intr-9', type: 'judge', stem: '多重中断允许高优先级中断打断正在执行的低优先级中断服务。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '多重中断（中断嵌套）提高响应实时性，需按优先级管理。' },
  ]);

  add('computer-organization:ch7-s5', [
    { id: 'co-dma-3', type: 'single', stem: 'DMA 方式下，数据在主存与设备之间的传送由谁控制？', options: { A: 'DMA 控制器', B: 'CPU 逐字搬运', C: '操作系统内核', D: 'Cache' }, answer: 'A', explanation: 'DMA 控制器直接控制数据传送，CPU 只在开始与结束时介入。' },
    { id: 'co-dma-4', type: 'judge', stem: 'DMA 传送完成后，DMA 控制器通过中断通知 CPU。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '传送结束由 DMA 控制器发出中断，CPU 再处理后续工作。' },
    { id: 'co-dma-5', type: 'single', stem: 'DMA 与 CPU 争用主存的常用方法不包括？', options: { A: '程序查询', B: '停止 CPU 访存', C: '周期挪用', D: '交替访问' }, answer: 'A', explanation: 'DMA 争用主存有停止 CPU 访存、周期挪用和交替访问三种方式。' },
  ]);

  /* == MORE == */
})(window);
