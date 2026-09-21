/* 知序 · 计算机组成原理自测题库（原创“真题风格”题，覆盖全部 7 章） */
(function (global) {
  'use strict';
  Object.assign(global.ZhixuQuestions = global.ZhixuQuestions || {}, {
    'computer-organization:ch1-s1': [
      { id: 'co-vn-1', type: 'judge', stem: '冯·诺依曼结构的核心思想是“存储程序”，指令和数据以同等地位存放在存储器中。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '冯·诺依曼结构以存储程序、程序控制为核心，指令与数据同等地位存于同一存储器。' },
    ],
    'computer-organization:ch1-s4': [
      { id: 'co-perf-1', type: 'single', stem: '若 CPU 主频为 1GHz，则一个时钟周期为？', options: { A: '1ns', B: '1ms', C: '1μs', D: '1s' }, answer: 'A', explanation: '1GHz = 10⁹ 个时钟周期/秒，故时钟周期 = 1/10⁹ s = 1ns。' },
    ],
    'computer-organization:ch2-s1': [
      { id: 'co-base-1', type: 'single', stem: '十进制数 43 用二进制表示是？', options: { A: '101011', B: '110101', C: '101101', D: '100011' }, answer: 'A', explanation: '43 = 32+8+2+1 = 2⁵+2³+2¹+2⁰，即 101011。' },
    ],
    'computer-organization:ch2-s2': [
      { id: 'co-fixed-1', type: 'single', stem: '8 位补码 1000 0000 表示的真值是？', options: { A: '−128', B: '−127', C: '0', D: '+128' }, answer: 'A', explanation: '8 位补码可表示 −128 到 +127，其中 1000 0000 是人为规定的 −128。', hint: '补码的表示范围是 −2ⁿ⁻¹ 到 2ⁿ⁻¹−1。' },
    ],
    'computer-organization:ch2-s4': [
      { id: 'co-ieee-1', type: 'single', stem: 'IEEE 754 单精度浮点数由哪几部分组成（位数由高到低）？', options: { A: '1 位符号 + 8 位阶码 + 23 位尾数', B: '1 位符号 + 23 位阶码 + 8 位尾数', C: '8 位符号 + 1 位阶码 + 23 位尾数', D: '1 位符号 + 11 位阶码 + 52 位尾数' }, answer: 'A', explanation: '单精度共 32 位：1 位符号、8 位移码阶码（偏置 127）、23 位尾数；11+52 是双精度。' },
      { id: 'co-ieee-2', type: 'single', stem: 'IEEE 754 单精度浮点数的阶码采用移码表示，其偏置值是？', options: { A: '127', B: '128', C: '255', D: '1023' }, answer: 'A', explanation: '单精度阶码 8 位，偏置取 2⁸⁻¹−1 = 127；双精度阶码偏置为 1023。' },
    ],
    'computer-organization:ch2-s5': [
      { id: 'co-fpadd-1', type: 'single', stem: '浮点数加减运算的第一步通常是对阶，其规则是？', options: { A: '小阶向大阶看齐，尾数右移', B: '大阶向小阶看齐，尾数左移', C: '直接相加尾数', D: '先规格化再对阶' }, answer: 'A', explanation: '为对齐小数点，令阶码小的数尾数右移（阶码增大）向大阶看齐，避免有效位丢失。' },
    ],
    'computer-organization:ch3-s6': [
      { id: 'co-cache-1', type: 'single', stem: '关于 Cache 与主存的映射方式，下列说法正确的是？', options: { A: '直接映射实现简单但冲突多，全相联冲突最少但比较电路复杂', B: '全相联映射中主存块只能放入唯一 Cache 行', C: '组相联映射等价于直接映射', D: '直接映射的命中率总是高于组相联' }, answer: 'A', explanation: '直接映射一块只能对应一行、冲突多；全相联可放入任意行、冲突少但需并行比较所有标记；组相联是折中。' },
      { id: 'co-cache-2', type: 'judge', stem: 'Cache 的命中率越高，平均访问时间一定越短。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '平均访问时间 = 命中率×命中时间 + 缺失率×缺失代价，命中率提高会降低平均访问时间（其它条件不变时）。' },
    ],
    'computer-organization:ch3-s7': [
      { id: 'co-write-1', type: 'single', stem: 'Cache 写策略中，写直达（Write Through）与写回（Write Back）的主要区别是？', options: { A: '写直达每次写都同步更新主存，写回只在块被替换时写回主存', B: '写直达只写 Cache 不写主存', C: '写回每次写都更新主存', D: '两者完全相同' }, answer: 'A', explanation: '写直达保持主存与 Cache 一致但写操作频繁；写回用脏位标记，仅在块替换时写回，减少主存写次数。' },
    ],
    'computer-organization:ch3-s8': [
      { id: 'co-vm-1', type: 'single', stem: '页式虚拟存储器中，地址转换使用的页表通常存放在？', options: { A: '主存中，并用 TLB 缓存常用页表项', B: 'CPU 寄存器中', C: '磁盘中且每次访问都查磁盘', D: 'Cache 中且不需要页表' }, answer: 'A', explanation: '页表规模大，一般放主存；用快表 TLB 缓存最近使用的页表项以减少访存次数。' },
      { id: 'co-vm-2', type: 'judge', stem: '当 TLB 命中时，地址转换无需再访问主存中的页表。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'TLB 命中直接得到物理页号，省去一次访存查页表；但取数据仍可能访问主存/Cache。' },
    ],
    'computer-organization:ch4-s1': [
      { id: 'co-fmt-1', type: 'single', stem: '若指令的操作码字段有 k 位，则最多可表示多少条不同的指令？', options: { A: '2ᵏ', B: 'k', C: '2k', D: 'k²' }, answer: 'A', explanation: 'k 位二进制可编码 2ᵏ 种组合，因此定长操作码最多表示 2ᵏ 条指令。' },
    ],
    'computer-organization:ch4-s2': [
      { id: 'co-addr-1', type: 'single', stem: '指令中直接给出操作数本身（而非其地址）的寻址方式是？', options: { A: '立即寻址', B: '直接寻址', C: '间接寻址', D: '寄存器间接寻址' }, answer: 'A', explanation: '立即寻址的操作数就写在指令里；直接寻址给出有效地址；间接寻址给出存放地址的地址。' },
      { id: 'co-addr-2', type: 'single', stem: '相对寻址方式下，操作数的有效地址等于？', options: { A: '程序计数器 PC 的值加位移量', B: '基址寄存器内容加位移量', C: '变址寄存器内容加位移量', D: '指令中直接给出的地址' }, answer: 'A', explanation: '相对寻址以 PC 为基准加位移量，便于程序浮动。' },
    ],
    'computer-organization:ch4-s3': [
      { id: 'co-ext-1', type: 'single', stem: '采用扩展操作码时，必须满足的基本约束是？', options: { A: '短操作码不能是长操作码的前缀', B: '所有操作码长度必须相等', C: '操作码越长指令越多', D: '地址码位数必须为 0' }, answer: 'A', explanation: '扩展操作码通过缩短地址码位数来扩展操作码长度，必须保证任一操作码都不是另一操作码的前缀，避免译码歧义。' },
    ],
    'computer-organization:ch4-s5': [
      { id: 'co-risc-1', type: 'judge', stem: 'RISC 通常采用定长指令、较少寻址方式，并大量使用寄存器。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'RISC 追求指令精简、定长、流水线友好，寻址方式少，load/store 访存，依赖大量通用寄存器。' },
    ],
    'computer-organization:ch5-s2': [
      { id: 'co-cycle-1', type: 'single', stem: '一个完整的指令周期通常包含哪几个阶段？', options: { A: '取指周期、间址周期、执行周期、中断周期', B: '仅取指与执行', C: '取指、译码、写回', D: '读、算、写' }, answer: 'A', explanation: '指令周期一般由取指、间址（可选）、执行、中断（可选）四部分组成。' },
    ],
    'computer-organization:ch5-s4': [
      { id: 'co-ctrl-1', type: 'single', stem: '在微程序控制器中，一条机器指令对应？', options: { A: '一段微程序（若干条微指令）', B: '一条微指令', C: '一个微命令', D: '一个节拍' }, answer: 'A', explanation: '微程序控制器把一条机器指令解释为一段微程序，由若干条微指令按序执行，产生相应的微命令。' },
    ],
    'computer-organization:ch5-s6': [
      { id: 'co-pipe-1', type: 'single', stem: '在理想情况下（无冒险、指令足够多），k 段流水线的加速比约为？', options: { A: 'k', B: 'k²', C: '2k', D: 'log₂k' }, answer: 'A', explanation: '理想流水线每周期完成一条指令，吞吐率提高约 k 倍，加速比趋近流水段数 k。' },
    ],
    'computer-organization:ch5-s7': [
      { id: 'co-hazard-1', type: 'single', stem: '缓解流水线数据冒险最常用的硬件技术是？', options: { A: '转发（旁路）技术', B: '增加时钟频率', C: '扩大 Cache', D: '使用 DMA' }, answer: 'A', explanation: '转发/旁路把尚未写回的结果直接送给后续指令，避免等待；无法转发时插入气泡（停顿）。' },
    ],
    'computer-organization:ch6-s1': [
      { id: 'co-bus-1', type: 'single', stem: '按功能划分，系统总线通常分为？', options: { A: '数据总线、地址总线、控制总线', B: '同步总线、异步总线', C: '内部总线、外部总线', D: '串行总线、并行总线' }, answer: 'A', explanation: '按功能分为数据总线、地址总线和控制总线；同步/异步是定时方式，串行/并行是传输方式。' },
    ],
    'computer-organization:ch6-s3': [
      { id: 'co-timing-1', type: 'single', stem: '异步定时方式相比同步定时的主要优点是？', options: { A: '各部件可按自身速度工作，灵活性高', B: '控制电路更简单', C: '传输速度恒定', D: '无需握手信号' }, answer: 'A', explanation: '异步定时通过握手信号协调，允许速度不同的部件协同工作，灵活但控制更复杂。' },
    ],
    'computer-organization:ch7-s3': [
      { id: 'co-pq-1', type: 'judge', stem: '程序查询方式下 CPU 需要不断轮询设备状态，效率较低。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '程序查询方式由 CPU 循环检测设备状态，期间不能做其他工作，CPU 利用率低。' },
    ],
    'computer-organization:ch7-s4': [
      { id: 'co-intr-1', type: 'single', stem: '中断隐指令的功能（保存断点、关中断、引出中断服务程序）由谁完成？', options: { A: '硬件自动完成', B: '操作系统软件完成', C: '用户程序完成', D: 'DMA 控制器完成' }, answer: 'A', explanation: '中断隐指令并不是真正的指令，而是由硬件在响应中断时自动完成的一系列操作。' },
    ],
    'computer-organization:ch7-s5': [
      { id: 'co-dma-1', type: 'judge', stem: 'DMA 方式下，数据在主存与 I/O 设备之间的传输不需要 CPU 逐字干预。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'DMA 由 DMA 控制器直接控制数据传送，CPU 只在开始前设置参数、结束后处理中断。' },
      { id: 'co-dma-2', type: 'single', stem: 'DMA 控制器与 CPU 争用主存的常用方法不包括？', options: { A: '程序查询', B: '停止 CPU 访存', C: '周期挪用', D: '交替访问' }, answer: 'A', explanation: 'DMA 与 CPU 争用主存的方式有停止 CPU 访存、周期挪用和交替访问；程序查询是 I/O 控制方式而非争用方法。' },
    ],
  });
})(window);
