/* 知序 · 概率论与数理统计补充题目（把每个小节补足到 5 题） */
(function (global) {
  'use strict';
  const bank = global.ZhixuQuestions = global.ZhixuQuestions || {};
  const add = (nodeId, questions) => { bank[nodeId] = (bank[nodeId] || []).concat(questions); };

  add('probability:ch1-s1', [
    { id: 'pr-ss-1', type: 'single', stem: '随机试验通常具有哪些特点？', options: { A: '可重复、结果已知、每次结果不确定', B: '不可重复', C: '结果未知', D: '必然发生' }, answer: 'A', explanation: '随机试验可重复进行，所有可能结果已知，但每次结果事先不确定。' },
    { id: 'pr-ss-2', type: 'judge', stem: '样本空间是随机试验所有可能结果组成的集合。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '样本空间 Ω 包含全部样本点，每个样本点是一个可能结果。' },
    { id: 'pr-ss-3', type: 'single', stem: '必然事件与不可能事件分别对应？', options: { A: 'Ω 与 ∅', B: '∅ 与 Ω', C: '都为 Ω', D: '都为 ∅' }, answer: 'A', explanation: '必然事件在每次试验中发生，即 Ω；不可能事件为 ∅。' },
    { id: 'pr-ss-4', type: 'judge', stem: '基本事件是由单个样本点构成的事件。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '基本事件不能再分解为更小的事件，对应一个样本点。' },
  ]);

  add('probability:ch1-s2', [
    { id: 'pr-op-1', type: 'single', stem: 'A ⊂ B 表示？', options: { A: 'A 发生必然导致 B 发生', B: 'B 发生必然导致 A 发生', C: 'A 与 B 互斥', D: 'A 与 B 独立' }, answer: 'A', explanation: 'A 包含于 B 意味着 A 的样本点都属于 B，A 发生则 B 必发生。' },
    { id: 'pr-op-2', type: 'single', stem: '德摩根律指出 (A∪B)ᶜ 等于？', options: { A: 'Aᶜ∩Bᶜ', B: 'Aᶜ∪Bᶜ', C: 'A∩B', D: 'A∪B' }, answer: 'A', explanation: '德摩根律：(A∪B)ᶜ=Aᶜ∩Bᶜ，(A∩B)ᶜ=Aᶜ∪Bᶜ。' },
    { id: 'pr-op-3', type: 'judge', stem: 'A − B = A ∩ Bᶜ。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'A 发生而 B 不发生，即 A 与 B 的补集之交。' },
    { id: 'pr-op-4', type: 'single', stem: '互斥与对立的区别是？', options: { A: '对立要求 A∪B=Ω 且 AB=∅，互斥只要求 AB=∅', B: '两者相同', C: '互斥要求并为全集', D: '对立只要求不相交' }, answer: 'A', explanation: '对立（互逆）是更强的条件，对立一定互斥，互斥不一定对立。' },
    { id: 'pr-op-5', type: 'judge', stem: '对立事件一定互斥，但互斥事件不一定对立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '互斥只保证不交，对立还要求两者覆盖整个样本空间。' },
  ]);

  add('probability:ch1-s3', [
    { id: 'pr-def-1', type: 'single', stem: '概率的公理化定义包含哪三条？', options: { A: '非负性、规范性、可列可加性', B: '连续性、可导性、单调性', C: '独立性、互斥性、对立性', D: '对称性、传递性、完备性' }, answer: 'A', explanation: '概率 P 满足非负性、P(Ω)=1 和可列可加性。' },
    { id: 'pr-def-2', type: 'single', stem: 'P(Aᶜ) 等于？', options: { A: '1 − P(A)', B: 'P(A)', C: '0', D: '1 + P(A)' }, answer: 'A', explanation: '由 A 与 Aᶜ 互斥且并为 Ω，得 P(Aᶜ)=1−P(A)。' },
    { id: 'pr-def-3', type: 'judge', stem: '不可能事件的概率为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由规范性 P(Ω)=1 与补事件关系可得 P(∅)=0。' },
    { id: 'pr-def-4', type: 'single', stem: '概率的加法公式是？', options: { A: 'P(A∪B)=P(A)+P(B)−P(AB)', B: 'P(A∪B)=P(A)+P(B)', C: 'P(A∪B)=P(A)P(B)', D: 'P(A∪B)=P(A)−P(B)' }, answer: 'A', explanation: '一般加法公式需减去交集，A、B 互斥时 P(AB)=0。' },
    { id: 'pr-def-5', type: 'judge', stem: '概率具有单调性：若 A ⊂ B，则 P(A) ≤ P(B)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由 B=A∪(B−A) 且互斥可得 P(B)=P(A)+P(B−A)≥P(A)。' },
  ]);

  add('probability:ch1-s4', [
    { id: 'pr-classic-2', type: 'single', stem: '古典概型中事件 A 的概率计算为？', options: { A: 'A 所含样本点数 ÷ 样本空间样本点总数', B: 'A 的面积 ÷ 总面积', C: 'A 的次数 ÷ 试验次数', D: 'P(A)P(B)' }, answer: 'A', explanation: '等可能条件下，概率等于有利样本点数与总样本点数之比。' },
    { id: 'pr-classic-3', type: 'judge', stem: '古典概型要求样本点有限且每个样本点等可能。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '有限性与等可能性是古典概型的两个前提。' },
    { id: 'pr-classic-4', type: 'single', stem: '计算古典概型概率时常用的计数工具是？', options: { A: '排列与组合', B: '导数与积分', C: '极限与连续', D: '矩阵与行列式' }, answer: 'A', explanation: '通过排列、组合等计数方法确定有利与总的样本点数。' },
    { id: 'pr-classic-5', type: 'judge', stem: '从 n 个不同元素中取 k 个的组合数为 C(n,k)=n!/[k!(n−k)!]。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '组合不计顺序，排列 A(n,k)=C(n,k)·k!。' },
  ]);

  add('probability:ch1-s5', [
    { id: 'pr-geo-1', type: 'single', stem: '几何概型中概率的计算方式是？', options: { A: '用区域测度（长度/面积/体积）之比', B: '用样本点个数之比', C: '用频率', D: '用条件概率' }, answer: 'A', explanation: '几何概型用有利区域的测度与总区域测度之比表示概率。' },
    { id: 'pr-geo-2', type: 'single', stem: '几何概型的样本空间具有什么特点？', options: { A: '样本点无限但等可能', B: '样本点有限', C: '样本点不等可能', D: '只有一个样本点' }, answer: 'A', explanation: '几何概型的样本空间是连续区域，样本点无限多但等可能。' },
    { id: 'pr-geo-3', type: 'judge', stem: '几何概型中单个样本点的概率为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '单点测度为 0，故概率为 0，但并非不可能事件。' },
    { id: 'pr-geo-4', type: 'single', stem: '下列哪个是几何概型的经典例子？', options: { A: '会面问题与蒲丰投针', B: '掷骰子', C: '抽签', D: '抛硬币' }, answer: 'A', explanation: '会面问题、蒲丰投针的样本空间是连续区域，属几何概型。' },
    { id: 'pr-geo-5', type: 'judge', stem: '几何概型中事件概率与区域的测度成正比。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是几何概型的等可能性假设的直接结果。' },
  ]);

  add('probability:ch1-s6', [
    { id: 'pr-cond-2', type: 'single', stem: '条件概率 P(·|B) 作为 A 的函数，是否满足概率的三条公理？', options: { A: '满足，是一个概率', B: '不满足', C: '只满足非负性', D: '只满足规范性' }, answer: 'A', explanation: '固定 B 后，P(A|B) 关于 A 满足非负性、规范性与可列可加性。' },
    { id: 'pr-cond-3', type: 'judge', stem: '乘法公式：P(AB)=P(A|B)P(B)=P(B|A)P(A)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由条件概率定义直接得到，用于计算积事件概率。' },
    { id: 'pr-cond-4', type: 'single', stem: '乘法公式推广到三个事件 P(ABC) 等于？', options: { A: 'P(A)P(B|A)P(C|AB)', B: 'P(A)P(B)P(C)', C: 'P(A)+P(B)+P(C)', D: 'P(A|B)P(B|C)P(C|A)' }, answer: 'A', explanation: '逐步使用条件概率：P(ABC)=P(A)P(B|A)P(C|AB)。' },
    { id: 'pr-cond-5', type: 'judge', stem: '条件概率相当于把样本空间缩小到事件 B 上。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '在已知 B 发生的条件下，讨论范围限制在 B 内。' },
  ]);

  add('probability:ch1-s7', [
    { id: 'pr-total-1', type: 'single', stem: '设 B₁,…,Bₙ 为样本空间的一个划分，全概率公式为？', options: { A: 'P(A)=Σ P(A|Bᵢ)P(Bᵢ)', B: 'P(A)=P(A|B₁)P(B₁)', C: 'P(A)=ΠP(A|Bᵢ)', D: 'P(A)=ΣP(Bᵢ)' }, answer: 'A', explanation: '全概率公式把复杂事件 A 按划分分解后加权求和。' },
    { id: 'pr-total-2', type: 'judge', stem: '全概率公式常用于由原因的概率推结果事件的概率。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '把各种“原因”Bᵢ 下 A 发生的条件概率加权求和，得到 P(A)。' },
    { id: 'pr-bayes-2', type: 'single', stem: '贝叶斯公式主要用于？', options: { A: '由结果反推原因的后验概率', B: '计算独立事件', C: '求期望', D: '判断收敛' }, answer: 'A', explanation: '已知 P(A|Bᵢ) 与先验 P(Bᵢ)，求后验 P(Bᵢ|A)。' },
    { id: 'pr-bayes-3', type: 'judge', stem: '划分 B₁,…,Bₙ 要求两两互斥且并为整个样本空间。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '划分必须互不相容且完备（覆盖 Ω）。' },
  ]);

  add('probability:ch1-s8', [
    { id: 'pr-indep-2', type: 'single', stem: '若 A 与 B 独立且 P(B)>0，则 P(A|B) 等于？', options: { A: 'P(A)', B: 'P(B)', C: 'P(AB)', D: '0' }, answer: 'A', explanation: '独立意味着 B 的发生不影响 A 的概率，故 P(A|B)=P(A)。' },
    { id: 'pr-indep-3', type: 'judge', stem: '两个事件既互斥又独立，只有当其中一个概率为 0 时才可能。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '互斥要求 P(AB)=0，独立要求 P(AB)=P(A)P(B)，故至少一个为 0。' },
    { id: 'pr-indep-4', type: 'single', stem: '三个事件两两独立与相互独立的关系是？', options: { A: '两两独立不一定相互独立', B: '相互独立不一定两两独立', C: '两者等价', D: '无关' }, answer: 'A', explanation: '相互独立要求所有组合的乘积关系都成立，强于两两独立。' },
    { id: 'pr-indep-5', type: 'judge', stem: '若 A 与 B 独立，则 A 与 Bᶜ 也独立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'P(A∩Bᶜ)=P(A)−P(AB)=P(A)(1−P(B))=P(A)P(Bᶜ)。' },
  ]);

  add('probability:ch1-s9', [
    { id: 'pr-bern-1', type: 'single', stem: 'n 重伯努利试验中成功 k 次的概率是？', options: { A: 'C(n,k)pᵏ(1−p)ⁿ⁻ᵏ', B: 'pᵏ', C: 'C(n,k)pⁿ', D: 'np' }, answer: 'A', explanation: '成功 k 次的组合数与对应概率的乘积，即二项分布。' },
    { id: 'pr-bern-2', type: 'single', stem: '伯努利试验的特点是？', options: { A: '每次试验只有两个可能结果', B: '结果有无数个', C: '各次试验不独立', D: '概率每次变化' }, answer: 'A', explanation: '伯努利试验只有“成功/失败”两个结果，且各次独立、概率相同。' },
    { id: 'pr-bern-3', type: 'judge', stem: 'n 重伯努利试验要求各次试验相互独立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '独立性是 n 重伯努利试验的基本要求。' },
    { id: 'pr-bern-4', type: 'single', stem: 'n 重伯努利试验中成功次数服从什么分布？', options: { A: '二项分布 B(n,p)', B: '泊松分布', C: '均匀分布', D: '指数分布' }, answer: 'A', explanation: '成功次数 X ~ B(n,p)，是二项分布的典型来源。' },
    { id: 'pr-bern-5', type: 'judge', stem: '伯努利概型要求每次试验成功的概率 p 相同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '各次试验条件相同，成功概率保持不变。' },
  ]);

  add('probability:ch2-s1', [
    { id: 'pr-rv-1', type: 'single', stem: '随机变量的分布函数 F(x)=P(X≤x) 具有哪些基本性质？', options: { A: '单调不减、右连续，F(−∞)=0、F(+∞)=1', B: '单调不增', C: '左连续', D: '一定可导' }, answer: 'A', explanation: '这是分布函数的三个基本性质。' },
    { id: 'pr-rv-2', type: 'judge', stem: 'P(a < X ≤ b) = F(b) − F(a)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由分布函数定义直接得到，注意区间端点开闭的差别。' },
    { id: 'pr-rv-3', type: 'single', stem: '描述随机变量分布的两类工具是？', options: { A: '离散型用分布律，连续型用概率密度', B: '都用分布函数以外的量', C: '都用期望', D: '都用方差' }, answer: 'A', explanation: '离散型用分布律，连续型用概率密度，二者都可由分布函数描述。' },
    { id: 'pr-rv-4', type: 'judge', stem: '分布函数可以完整描述一个随机变量的概率规律。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由 F(x) 可求出任意事件的概率，故完整刻画分布。' },
  ]);

  add('probability:ch2-s2', [
    { id: 'pr-disc-2', type: 'single', stem: '离散型随机变量的分布律 pₖ 必须满足？', options: { A: 'pₖ ≥ 0 且 Σpₖ = 1', B: 'pₖ > 1', C: 'Σpₖ = 0', D: 'pₖ 递减' }, answer: 'A', explanation: '非负性与归一性是分布律的两个条件。' },
    { id: 'pr-disc-3', type: 'judge', stem: '0-1 分布是离散型分布的一个特例。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '0-1 分布（伯努利分布）只取 0、1 两个值，是 B(1,p)。' },
    { id: 'pr-disc-4', type: 'single', stem: '离散型随机变量的分布函数是？', options: { A: '阶梯函数', B: '连续函数', C: '常数', D: '指数函数' }, answer: 'A', explanation: '离散型分布函数在每个取值点跳跃，呈阶梯状。' },
    { id: 'pr-disc-5', type: 'judge', stem: '分布律决定了离散型随机变量的全部概率信息。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '已知分布律即可计算任意事件的概率。' },
  ]);

  add('probability:ch2-s3', [
    { id: 'pr-dist-1', type: 'single', stem: '二项分布 B(n,p) 的记法表示？', options: { A: 'n 重伯努利试验中成功次数服从的分布', B: '泊松分布', C: '几何分布', D: '均匀分布' }, answer: 'A', explanation: 'B(n,p) 表示 n 次独立重复试验中成功次数的分布。' },
    { id: 'pr-dist-2', type: 'single', stem: '泊松分布 P(λ) 的期望和方差分别是？', options: { A: '都为 λ', B: 'λ 和 λ²', C: 'λ² 和 λ', D: '都为 1' }, answer: 'A', explanation: '泊松分布 E(X)=D(X)=λ，这是它的重要特点。' },
    { id: 'pr-dist-3', type: 'judge', stem: '当 n 很大、p 很小时，二项分布可用泊松分布近似。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '泊松定理：n→∞、np→λ 时二项分布趋于泊松分布。' },
    { id: 'pr-dist-4', type: 'single', stem: '几何分布描述的是？', options: { A: '首次成功所需试验次数', B: '成功总次数', C: '失败次数', D: '样本容量' }, answer: 'A', explanation: '几何分布描述独立重复试验中首次成功前所需试验次数。' },
    { id: 'pr-dist-5', type: 'judge', stem: '超几何分布对应不放回抽样模型。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '超几何分布描述有限总体不放回抽样中成功次数；放回时对应二项分布。' },
  ]);

  add('probability:ch2-s4', [
    { id: 'pr-pdf-1', type: 'single', stem: '概率密度函数 f(x) 必须满足？', options: { A: 'f(x) ≥ 0 且 ∫f(x)dx = 1', B: 'f(x) ≤ 1', C: '∫f(x)dx = 0', D: 'f(x) 单调' }, answer: 'A', explanation: '密度的非负性与积分为 1 是基本条件。' },
    { id: 'pr-pdf-2', type: 'single', stem: '连续型随机变量在区间 (a,b) 内的概率等于？', options: { A: '∫ₐᵇ f(x)dx', B: 'f(b) − f(a)', C: 'f(a)f(b)', D: 'F(a)F(b)' }, answer: 'A', explanation: '连续型概率由密度在该区间上的积分给出。' },
    { id: 'pr-pdf-3', type: 'judge', stem: '连续型随机变量取任一单点的概率为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '单点积分为 0，因此 P(X=a)=0，区间端点开闭不影响概率。' },
    { id: 'pr-pdf-4', type: 'single', stem: '在密度函数的连续点处，F′(x) 等于？', options: { A: 'f(x)', B: '0', C: 'F(x)', D: '1' }, answer: 'A', explanation: '分布函数是密度的变限积分，故在连续点处 F′(x)=f(x)。' },
    { id: 'pr-pdf-5', type: 'judge', stem: '连续型随机变量的密度函数不唯一，改变有限个点的取值不影响概率。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '积分不受有限点改动影响，故密度不唯一。' },
  ]);

  add('probability:ch2-s5', [
    { id: 'pr-cont-3', type: 'single', stem: '均匀分布 U(a,b) 的概率密度在 (a,b) 内为？', options: { A: '常数 1/(b−a)', B: '线性函数', C: '指数函数', D: '正态曲线' }, answer: 'A', explanation: '均匀分布在区间内密度为常数 1/(b−a)，区间外为 0。' },
    { id: 'pr-cont-4', type: 'judge', stem: '指数分布具有“无记忆性”。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'P(X>s+t|X>s)=P(X>t)，这是指数分布的重要特性。' },
    { id: 'pr-cont-5', type: 'single', stem: '正态分布 N(μ,σ²) 的密度函数图像关于哪条直线对称？', options: { A: 'x = μ', B: 'x = σ', C: 'x = 0', D: 'y 轴（仅 μ=0 时）' }, answer: 'A', explanation: '正态密度关于 x=μ 对称，μ 是位置参数。' },
  ]);

  add('probability:ch2-s6', [
    { id: 'pr-func-1', type: 'single', stem: '求离散型随机变量函数 Y=g(X) 的分布，关键是？', options: { A: '把相同取值的概率合并', B: '求导', C: '积分', D: '求极限' }, answer: 'A', explanation: 'g 可能把多个 x 映射到同一 y，需把对应概率相加。' },
    { id: 'pr-func-2', type: 'single', stem: '求连续型随机变量函数分布常用方法有？', options: { A: '分布函数法与公式法', B: '矩估计法', C: '最大似然法', D: '假设检验法' }, answer: 'A', explanation: '先求 F_Y(y)=P(g(X)≤y)，再求导得密度（分布函数法）。' },
    { id: 'pr-func-3', type: 'judge', stem: 'Y=g(X) 的分布可由 F_Y(y)=P(g(X)≤y) 求得。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '把事件 {g(X)≤y} 转化为关于 X 的不等式，再用 X 的分布计算。' },
    { id: 'pr-func-4', type: 'single', stem: '正态随机变量的线性变换 aX+b（a≠0）服从？', options: { A: '仍为正态分布', B: '均匀分布', C: '指数分布', D: 'χ² 分布' }, answer: 'A', explanation: '若 X~N(μ,σ²)，则 aX+b~N(aμ+b, a²σ²)。' },
    { id: 'pr-func-5', type: 'judge', stem: '用公式法求连续型函数分布时要注意 g 的单调性。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '单调时可直接用反函数求密度；非单调需分段处理。' },
  ]);

  add('probability:ch3-s1', [
    { id: 'pr-joint-2', type: 'single', stem: '二维随机变量 (X,Y) 的联合分布函数定义是？', options: { A: 'F(x,y)=P(X≤x, Y≤y)', B: 'F(x,y)=P(X≤x)+P(Y≤y)', C: 'F(x,y)=P(X=x)P(Y=y)', D: 'F(x,y)=P(X>x, Y>y)' }, answer: 'A', explanation: '联合分布函数描述落入左下方区域的概率。' },
    { id: 'pr-joint-3', type: 'judge', stem: '联合分布可以决定边缘分布，但边缘分布不能决定联合分布。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由联合分布可求边缘，但相同的边缘可对应不同的联合分布。' },
    { id: 'pr-joint-4', type: 'single', stem: '由联合分布求边缘分布 F_X(x) 的方法是？', options: { A: '令 y→+∞ 取极限', B: '令 x→−∞', C: '对 x 求导', D: '求乘积' }, answer: 'A', explanation: 'F_X(x)=F(x,+∞)，即对 y 取遍全体实数。' },
    { id: 'pr-joint-5', type: 'judge', stem: '联合分布函数对每个变量单调不减，且满足相应边界条件。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '二维分布函数具有单调性与边界极限等性质。' },
  ]);

  add('probability:ch3-s2', [
    { id: 'pr-2d-1', type: 'single', stem: '二维离散型随机变量的联合分布律记为？', options: { A: 'p_ij = P(X=xᵢ, Y=yⱼ)', B: 'p_i = P(X=xᵢ)', C: 'f(x,y)', D: 'F(x,y)' }, answer: 'A', explanation: '联合分布律列出所有可能取值组合的概率。' },
    { id: 'pr-2d-2', type: 'single', stem: '由联合分布律求边缘分布律的方法是？', options: { A: '按行或按列求和', B: '求导', C: '积分', D: '取最大' }, answer: 'A', explanation: 'p_i·=Σⱼp_ij（对 Y 求和得 X 的边缘分布律）。' },
    { id: 'pr-2d-3', type: 'judge', stem: '由联合分布律可以求出各自的边缘分布律。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '对另一个变量求和即可得到边缘分布律。' },
    { id: 'pr-2d-4', type: 'single', stem: '二维离散型随机变量 X 与 Y 独立的充要条件是？', options: { A: '对所有 i,j 有 p_ij = p_i·p_·j', B: '存在一组 i,j 满足', C: '协方差为 0', D: '边缘分布相同' }, answer: 'A', explanation: '独立性要求所有取值组合都满足乘积关系。' },
    { id: 'pr-2d-5', type: 'judge', stem: '判断二维离散型独立性必须对所有 (i,j) 验证乘积关系。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '只验证部分组合不足以说明独立。' },
  ]);

  add('probability:ch3-s3', [
    { id: 'pr-2dc-1', type: 'single', stem: '二维连续型随机变量的联合密度 f(x,y) 满足？', options: { A: 'f(x,y) ≥ 0 且二重积分 = 1', B: 'f(x,y) ≤ 1', C: '积分为 0', D: 'f 单调' }, answer: 'A', explanation: '联合密度非负且在全平面上的二重积分为 1。' },
    { id: 'pr-2dc-2', type: 'single', stem: '由联合密度求边缘密度 f_X(x) 的方法是？', options: { A: '对 y 积分：∫f(x,y)dy', B: '对 x 积分', C: '求导', D: '取极限' }, answer: 'A', explanation: '边缘密度是把联合密度对另一个变量积分得到的。' },
    { id: 'pr-2dc-3', type: 'judge', stem: '连续型随机变量 X 与 Y 独立 ⇔ f(x,y) = f_X(x)·f_Y(y)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '连续型独立当且仅当联合密度等于边缘密度之积。' },
    { id: 'pr-2dc-4', type: 'single', stem: '二维均匀分布在区域 D 上的概率与什么成正比？', options: { A: '区域的面积', B: '区域的周长', C: '区域的位置', D: '区域的形状' }, answer: 'A', explanation: '二维均匀分布下概率正比于子区域面积。' },
    { id: 'pr-2dc-5', type: 'judge', stem: '二维连续型随机变量落在区域 D 内的概率由联合密度在 D 上的二重积分给出。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'P((X,Y)∈D)=∬_D f(x,y)dxdy。' },
  ]);

  add('probability:ch3-s4', [
    { id: 'pr-indep2-2', type: 'single', stem: '随机变量 X 与 Y 独立的充要条件是？', options: { A: '联合分布等于边缘分布之积', B: '协方差为 0', C: '期望相等', D: '方差相等' }, answer: 'A', explanation: '独立 ⇔ F(x,y)=F_X(x)F_Y(y)（离散/连续对应乘积形式）。' },
    { id: 'pr-indep2-3', type: 'judge', stem: 'X 与 Y 独立一定推出它们不相关，但不相关不一定独立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '独立 ⇒ 协方差为 0；不相关只排除线性关系。' },
    { id: 'pr-indep2-4', type: 'single', stem: 'X 与 Y 不相关的等价条件是？', options: { A: 'Cov(X,Y)=0 即 E(XY)=E(X)E(Y)', B: 'E(X)=E(Y)', C: 'D(X)=D(Y)', D: '联合分布等于边缘乘积' }, answer: 'A', explanation: '不相关 ⇔ 协方差为 0 ⇔ E(XY)=E(X)E(Y)。' },
    { id: 'pr-indep2-5', type: 'judge', stem: '对于二维正态分布，不相关等价于独立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '二维正态是特例，ρ=0（不相关）即可推出独立。' },
  ]);

  add('probability:ch3-s5', [
    { id: 'pr-2dist-1', type: 'single', stem: '二维均匀分布的联合密度在区域 D 内为？', options: { A: '常数 1/S_D（S_D 为 D 的面积）', B: '随位置变化', C: '正态曲线', D: '指数函数' }, answer: 'A', explanation: '二维均匀分布在 D 内密度为 1/面积，D 外为 0。' },
    { id: 'pr-2dist-2', type: 'single', stem: '二维正态分布由几个参数完全确定？', options: { A: '5 个（μ₁,μ₂,σ₁²,σ₂²,ρ）', B: '2 个', C: '3 个', D: '4 个' }, answer: 'A', explanation: '两个均值、两个方差和一个相关系数共 5 个参数。' },
    { id: 'pr-2dist-3', type: 'judge', stem: '二维正态分布的边缘分布都是一维正态分布。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '二维正态的边缘仍为正态，这是其重要性质。' },
    { id: 'pr-2dist-4', type: 'single', stem: '二维正态分布中，X 与 Y 独立的充要条件是？', options: { A: '相关系数 ρ = 0', B: 'μ₁ = μ₂', C: 'σ₁ = σ₂', D: '方差为 1' }, answer: 'A', explanation: '二维正态下 ρ=0 既表示不相关也表示独立。' },
    { id: 'pr-2dist-5', type: 'judge', stem: '二维正态随机变量的线性组合仍服从正态分布。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '正态分布的线性组合保持正态性，这是正态分布的重要封闭性。' },
  ]);

  add('probability:ch3-s6', [
    { id: 'pr-sum-1', type: 'single', stem: '求两个独立连续型随机变量之和的分布，常用？', options: { A: '卷积公式', B: '洛必达法则', C: '克拉默法则', D: '夹逼准则' }, answer: 'A', explanation: 'Z=X+Y 的密度为 f_Z(z)=∫f_X(x)f_Y(z−x)dx（卷积）。' },
    { id: 'pr-sum-2', type: 'single', stem: 'n 个独立同分布随机变量最大值 M 的分布函数为？', options: { A: '[F(x)]ⁿ', B: '1−[1−F(x)]ⁿ', C: 'nF(x)', D: 'F(x)/n' }, answer: 'A', explanation: 'P(M≤x)=P(所有 Xᵢ≤x)=[F(x)]ⁿ。' },
    { id: 'pr-sum-3', type: 'judge', stem: '独立同分布随机变量最大值的分布函数等于各自分布函数的乘积。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '最大值不超过 x 等价于每个变量都不超过 x，故为乘积。' },
    { id: 'pr-sum-4', type: 'single', stem: 'n 个独立同分布随机变量最小值 N 的分布函数为？', options: { A: '1 − [1−F(x)]ⁿ', B: '[F(x)]ⁿ', C: 'nF(x)', D: 'F(x)' }, answer: 'A', explanation: 'P(N≤x)=1−P(所有 Xᵢ>x)=1−[1−F(x)]ⁿ。' },
    { id: 'pr-sum-5', type: 'judge', stem: '两个独立正态随机变量之和仍服从正态分布。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若 X~N(μ₁,σ₁²)、Y~N(μ₂,σ₂²) 且独立，则 X+Y~N(μ₁+μ₂, σ₁²+σ₂²)。' },
  ]);

  add('probability:ch4-s1', [
    { id: 'pr-exp-2', type: 'single', stem: '离散型随机变量的数学期望定义为？', options: { A: 'Σ xₖ pₖ', B: 'Σ pₖ', C: 'max xₖ', D: 'Σ xₖ' }, answer: 'A', explanation: '期望是各取值与其概率乘积之和（要求绝对收敛）。' },
    { id: 'pr-exp-3', type: 'judge', stem: '数学期望具有线性性：E(aX+bY)=aE(X)+bE(Y)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '期望的线性性无需 X、Y 独立。' },
    { id: 'pr-exp-4', type: 'single', stem: '连续型随机变量的数学期望定义为？', options: { A: '∫ x f(x)dx', B: '∫ f(x)dx', C: 'f(0)', D: '∫ x²f(x)dx' }, answer: 'A', explanation: '连续型期望是 x 与密度乘积的积分。' },
    { id: 'pr-exp-5', type: 'judge', stem: '数学期望存在要求相应的级数或积分绝对收敛。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '绝对收敛保证期望的定义无歧义，否则称期望不存在。' },
  ]);

  add('probability:ch4-s2', [
    { id: 'pr-var-2', type: 'single', stem: '方差的计算公式 D(X) 等于？', options: { A: 'E(X²) − [E(X)]²', B: 'E(X²) + [E(X)]²', C: '[E(X)]²', D: 'E(X) − E(X²)' }, answer: 'A', explanation: '这是方差最常用的计算公式，常比按定义计算更简便。' },
    { id: 'pr-var-3', type: 'judge', stem: 'D(X) = 0 的充要条件是 X 几乎处处等于一个常数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '方差衡量偏离均值的程度，为 0 表示没有波动。' },
    { id: 'pr-var-4', type: 'single', stem: 'D(X+Y) 等于？', options: { A: 'D(X)+D(Y)+2Cov(X,Y)', B: 'D(X)+D(Y)', C: 'D(X)·D(Y)', D: 'D(X)−D(Y)' }, answer: 'A', explanation: '一般地 D(X+Y)=D(X)+D(Y)+2Cov(X,Y)；独立时协方差为 0。' },
    { id: 'pr-var-5', type: 'judge', stem: '若 X 与 Y 相互独立，则 D(X+Y)=D(X)+D(Y)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '独立使 Cov(X,Y)=0，故方差可加。' },
  ]);

  add('probability:ch4-s3', [
    { id: 'pr-efunc-1', type: 'single', stem: '求 E(g(X)) 时，是否必须先求 g(X) 的分布？', options: { A: '不必，可直接用 X 的分布计算', B: '必须先求', C: '只能数值计算', D: '无法计算' }, answer: 'A', explanation: 'E(g(X))=Σg(xₖ)pₖ 或 ∫g(x)f(x)dx，无需先求 g(X) 的分布。' },
    { id: 'pr-efunc-2', type: 'single', stem: '离散型随机变量 E(g(X)) 的计算公式是？', options: { A: 'Σ g(xₖ)pₖ', B: 'Σ g(pₖ)', C: 'g(Σxₖpₖ)', D: 'Σ xₖ' }, answer: 'A', explanation: '把 g 作用于每个取值后按概率加权求和。' },
    { id: 'pr-efunc-3', type: 'judge', stem: '当 X 与 Y 独立时，E(XY)=E(X)E(Y)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '独立时乘积的期望等于期望的乘积。' },
    { id: 'pr-efunc-4', type: 'single', stem: '利用期望的线性性可以？', options: { A: '把复杂随机变量拆成简单变量之和再求期望', B: '避免求分布', C: '求方差', D: '判断独立' }, answer: 'A', explanation: '如 E(X₁+…+Xₙ)=ΣE(Xᵢ)，即使变量不独立也成立。' },
    { id: 'pr-efunc-5', type: 'judge', stem: '一般地 E(g(X)) ≠ g(E(X))。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '只有当 g 为线性函数时两者才相等。' },
  ]);

  add('probability:ch4-s4', [
    { id: 'pr-cov-1', type: 'single', stem: '协方差 Cov(X,Y) 等于？', options: { A: 'E(XY) − E(X)E(Y)', B: 'E(XY) + E(X)E(Y)', C: 'E(X)E(Y)', D: 'D(X)D(Y)' }, answer: 'A', explanation: '协方差衡量 X、Y 的线性相关程度。' },
    { id: 'pr-cov-2', type: 'judge', stem: 'Cov(X,X) = D(X)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '变量与自身的协方差就是其方差。' },
    { id: 'pr-cov-3', type: 'single', stem: '相关系数 ρ 的计算公式是？', options: { A: 'Cov(X,Y) / (σ_X σ_Y)', B: 'Cov(X,Y) / (σ_X + σ_Y)', C: 'σ_X σ_Y / Cov', D: 'E(XY)' }, answer: 'A', explanation: '相关系数是标准化后的协方差。' },
    { id: 'pr-cov-4', type: 'judge', stem: '相关系数满足 |ρ| ≤ 1，且 |ρ|=1 时 X 与 Y 以概率 1 存在线性关系。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '|ρ|=1 表示完全线性相关（正相关或负相关）。' },
  ]);

  add('probability:ch4-s5', [
    { id: 'pr-df-1', type: 'single', stem: '二项分布 B(n,p) 的期望和方差分别是？', options: { A: 'np 和 np(1−p)', B: 'p 和 p(1−p)', C: 'n 和 np', D: 'np 和 np' }, answer: 'A', explanation: '二项分布 E(X)=np，D(X)=np(1−p)。' },
    { id: 'pr-df-2', type: 'single', stem: '指数分布 Exp(λ) 的期望和方差分别是？', options: { A: '1/λ 和 1/λ²', B: 'λ 和 λ²', C: '1/λ 和 1/λ', D: 'λ 和 1/λ' }, answer: 'A', explanation: '指数分布 E(X)=1/λ，D(X)=1/λ²。' },
    { id: 'pr-df-3', type: 'judge', stem: '正态分布 N(μ,σ²) 的期望为 μ、方差为 σ²。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'μ 是位置参数即期望，σ² 是尺度参数即方差。' },
    { id: 'pr-df-4', type: 'single', stem: '利用对称性求期望，常用于哪类分布？', options: { A: '关于某点对称的分布（如正态、均匀）', B: '只有离散分布', C: '只有偏态分布', D: '任意分布' }, answer: 'A', explanation: '对称分布的期望等于对称中心，可避免复杂积分。' },
    { id: 'pr-df-5', type: 'judge', stem: '切比雪夫不等式把期望、方差与偏离概率联系起来。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'P{|X−μ|≥ε} ≤ σ²/ε²，无需知道具体分布。' },
  ]);

  add('probability:ch5-s1', [
    { id: 'pr-cheb-2', type: 'single', stem: '切比雪夫不等式的形式是？', options: { A: 'P{|X−μ| ≥ ε} ≤ σ²/ε²', B: 'P{|X−μ| ≥ ε} ≥ σ²/ε²', C: 'P{X ≥ ε} = σ²', D: 'P{|X| ≤ ε} = 1' }, answer: 'A', explanation: '切比雪夫不等式给出偏离均值概率的上界。' },
    { id: 'pr-cheb-3', type: 'judge', stem: '切比雪夫不等式对任意方差存在的分布都成立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不要求具体分布，只要期望和方差存在即可。' },
    { id: 'pr-cheb-4', type: 'single', stem: '切比雪夫不等式的主要用途是？', options: { A: '估计随机变量偏离均值的概率上界', B: '计算精确概率', C: '求导数', D: '判断独立' }, answer: 'A', explanation: '在分布未知时给出概率的粗略上界。' },
    { id: 'pr-cheb-5', type: 'judge', stem: '在切比雪夫不等式中，ε 越大上界越小。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'σ²/ε² 随 ε 增大而减小，偏离越远概率上界越小。' },
  ]);

  add('probability:ch5-s2', [
    { id: 'pr-lln-1', type: 'single', stem: '辛钦大数定律的条件是？', options: { A: '随机变量独立同分布且期望存在', B: '方差为 0', C: '变量互斥', D: '变量只有两个取值' }, answer: 'A', explanation: '辛钦大数定律要求独立同分布、数学期望存在，则样本均值依概率收敛于期望。' },
    { id: 'pr-lln-2', type: 'single', stem: '伯努利大数定律说明？', options: { A: '频率依概率收敛于概率', B: '期望等于方差', C: '变量相互独立', D: '分布为正态' }, answer: 'A', explanation: '伯努利大数定律表明事件发生的频率稳定于其概率。' },
    { id: 'pr-lln-3', type: 'judge', stem: '大数定律说明大量随机现象的平均结果具有稳定性。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '样本均值随样本量增大趋于总体期望，这是平均稳定性的体现。' },
    { id: 'pr-lln-4', type: 'single', stem: '切比雪夫大数定律的证明主要借助？', options: { A: '切比雪夫不等式', B: '中心极限定理', C: '洛必达法则', D: '全概率公式' }, answer: 'A', explanation: '用切比雪夫不等式估计样本均值偏离期望的概率趋于 0。' },
    { id: 'pr-lln-5', type: 'judge', stem: '大数定律是频率稳定性（概率的频率解释）的理论依据。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '伯努利大数定律为用频率估计概率提供了理论保证。' },
  ]);

  add('probability:ch5-s3', [
    { id: 'pr-clt-2', type: 'single', stem: '林德伯格–列维中心极限定理的条件是？', options: { A: '随机变量独立同分布且方差有限', B: '变量只有两个取值', C: '期望为 0', D: '变量相关' }, answer: 'A', explanation: '独立同分布、方差有限时，标准化样本和趋于标准正态。' },
    { id: 'pr-clt-3', type: 'judge', stem: '中心极限定理说明独立同分布随机变量之和标准化后依分布收敛于标准正态。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是中心极限定理的核心结论。' },
    { id: 'pr-clt-4', type: 'single', stem: '棣莫弗–拉普拉斯定理是关于什么的？', options: { A: '二项分布的正态近似', B: '泊松分布', C: '指数分布', D: '均匀分布' }, answer: 'A', explanation: '棣莫弗–拉普拉斯定理是中心极限定理在二项分布上的特例。' },
    { id: 'pr-clt-5', type: 'judge', stem: '样本量 n 越大，中心极限定理给出的正态近似越准确。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'CLT 是极限结果，n 越大近似误差越小。' },
  ]);

  add('probability:ch5-s4', [
    { id: 'pr-norm-1', type: 'single', stem: '用正态近似计算二项分布概率时，常需做？', options: { A: '连续性修正', B: '求导', C: '取对数', D: '正交化' }, answer: 'A', explanation: '离散分布用连续正态近似时，边界加减 0.5 进行连续性修正。' },
    { id: 'pr-norm-2', type: 'single', stem: '对二项分布 B(n,p) 做正态近似时的标准化变量是？', options: { A: '(X − np)/√(np(1−p))', B: '(X − p)/n', C: '(X − np)/n', D: 'X/n' }, answer: 'A', explanation: '按中心极限定理对二项分布标准化后近似 N(0,1)。' },
    { id: 'pr-norm-3', type: 'judge', stem: '连续性修正的做法是对边界值加减 0.5。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '把离散点 P(X=k) 近似为连续区间 [k−0.5, k+0.5] 上的概率。' },
    { id: 'pr-norm-4', type: 'single', stem: '正态近似要求 n 满足什么条件？', options: { A: 'n 足够大', B: 'n 很小', C: 'n = 1', D: 'n 为偶数' }, answer: 'A', explanation: '一般要求 n 较大（如 np≥5 且 n(1−p)≥5）。' },
    { id: 'pr-norm-5', type: 'judge', stem: '中心极限定理在抽样调查、近似计算等领域有广泛应用。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'CLT 使正态分布成为统计推断的核心工具。' },
  ]);

  add('probability:ch6-s1', [
    { id: 'pr-pop-1', type: 'single', stem: '总体与个体的关系是？', options: { A: '总体是研究对象的全体，个体是其中的单个对象', B: '总体是个体的一部分', C: '两者相同', D: '个体是总体的子集' }, answer: 'A', explanation: '总体是研究对象的全体，个体是组成总体的每个基本单位。' },
    { id: 'pr-pop-2', type: 'single', stem: '简单随机样本要求？', options: { A: '样本与总体同分布且相互独立', B: '样本必须有序', C: '样本量固定为 1', D: '样本不能重复' }, answer: 'A', explanation: '简单随机样本是独立同分布（i.i.d.）的随机变量。' },
    { id: 'pr-pop-3', type: 'judge', stem: '简单随机样本中每个样本与总体具有相同的分布。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '同分布是简单随机样本的基本特征。' },
    { id: 'pr-pop-4', type: 'single', stem: '样本中所含个体的数目称为？', options: { A: '样本容量', B: '总体容量', C: '统计量', D: '自由度' }, answer: 'A', explanation: '样本容量 n 表示样本中个体的个数。' },
    { id: 'pr-pop-5', type: 'judge', stem: '数理统计的基本任务是用样本信息推断总体的性质。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '统计推断包括参数估计与假设检验等。' },
  ]);

  add('probability:ch6-s2', [
    { id: 'pr-stat-1', type: 'single', stem: '样本均值 X̄ 与样本方差 S² 都是？', options: { A: '统计量', B: '参数', C: '总体矩', D: '分布函数' }, answer: 'A', explanation: '统计量是样本的函数且不含未知参数，X̄、S² 都是统计量。' },
    { id: 'pr-stat-2', type: 'judge', stem: '样本方差 S² 的分母取 n−1 时是总体方差的无偏估计。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '除以 n−1 使 E(S²)=σ²，保证无偏性。' },
    { id: 'pr-stat-3', type: 'single', stem: '样本 k 阶原点矩是指？', options: { A: '(1/n)ΣXᵢᵏ', B: 'ΣXᵢ', C: 'max Xᵢ', D: 'X̄ᵏ' }, answer: 'A', explanation: '样本 k 阶原点矩为 (1/n)ΣXᵢᵏ，用于矩估计。' },
    { id: 'pr-stat-4', type: 'judge', stem: '统计量中不能含有未知参数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '统计量必须是样本的、不含未知参数的函数。' },
  ]);

  add('probability:ch6-s3', [
    { id: 'pr-chi-2', type: 'single', stem: 'χ²(n) 分布的定义是？', options: { A: 'n 个独立标准正态变量的平方和', B: 'n 个正态变量之和', C: '两个 χ² 之比', D: '标准正态之比' }, answer: 'A', explanation: '若 X₁,…,Xₙ i.i.d.~N(0,1)，则 ΣXᵢ²~χ²(n)。' },
    { id: 'pr-chi-3', type: 'judge', stem: 't 分布关于 0 对称。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 't 分布是类似标准正态的对称分布，自由度越大越接近正态。' },
    { id: 'pr-chi-4', type: 'single', stem: 'F 分布的定义是？', options: { A: '两个独立 χ² 变量（各除以其自由度）之比', B: '两个正态变量之比', C: '一个 χ² 的平方', D: 't 分布的平方根' }, answer: 'A', explanation: '若 U~χ²(m)、V~χ²(n) 独立，则 (U/m)/(V/n)~F(m,n)。' },
    { id: 'pr-chi-5', type: 'judge', stem: '若 T~t(n)，则 T²~F(1,n)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 't 分布变量的平方服从第一自由度为 1 的 F 分布。' },
  ]);

  add('probability:ch6-s4', [
    { id: 'pr-quant-1', type: 'single', stem: '上侧 α 分位数 u_α 满足？', options: { A: 'P(X > u_α) = α', B: 'P(X < u_α) = α', C: 'P(X = u_α) = α', D: 'P(X > u_α) = 1−α' }, answer: 'A', explanation: '上侧 α 分位数右侧面积为 α。' },
    { id: 'pr-quant-2', type: 'single', stem: '标准正态分布的上侧 0.025 分位数约为？', options: { A: '1.96', B: '1.645', C: '2.58', D: '1.28' }, answer: 'A', explanation: 'u₀.₀₂₅=1.96，是 95% 置信区间的常用临界值。' },
    { id: 'pr-quant-3', type: 'judge', stem: '标准正态分布满足 u_α = −u_{1−α}。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由标准正态关于 0 对称可得。' },
    { id: 'pr-quant-4', type: 'single', stem: 'χ²、t、F 分布的分位数通常通过什么获得？', options: { A: '查表或统计软件', B: '手工求导', C: '积分公式直接计算', D: '不能获得' }, answer: 'A', explanation: '这些分布没有初等原函数，通常查表或软件计算。' },
    { id: 'pr-quant-5', type: 'judge', stem: '分位数在区间估计和假设检验中用于确定临界值。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '置信区间与拒绝域都由相应分布的分位数确定。' },
  ]);

  add('probability:ch6-s5', [
    { id: 'pr-samp-2', type: 'single', stem: '正态总体下，(n−1)S²/σ² 服从什么分布？', options: { A: 'χ²(n−1)', B: 'N(0,1)', C: 't(n)', D: 'F(n,n)' }, answer: 'A', explanation: '这是正态总体样本方差的抽样分布，自由度为 n−1。' },
    { id: 'pr-samp-3', type: 'judge', stem: '正态总体下样本均值 X̄ 与样本方差 S² 相互独立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '正态总体的一个重要性质：X̄ 与 S² 独立。' },
    { id: 'pr-samp-4', type: 'single', stem: '当 σ 已知时，(X̄−μ)/(σ/√n) 服从？', options: { A: 'N(0,1)', B: 't(n−1)', C: 'χ²(n)', D: 'F(1,n)' }, answer: 'A', explanation: 'σ 已知时样本均值标准化后服从标准正态分布。' },
    { id: 'pr-samp-5', type: 'judge', stem: 'σ 未知时用样本标准差 S 代替 σ，得到服从 t(n−1) 的统计量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是 t 分布的典型来源，也是 t 检验的基础。' },
  ]);

  add('probability:ch7-s1', [
    { id: 'pr-moment-1', type: 'single', stem: '矩估计法的基本思想是？', options: { A: '用样本矩等于总体矩来建立方程估计参数', B: '使似然函数最大', C: '使方差最小', D: '随机选取参数' }, answer: 'A', explanation: '令样本矩与总体矩相等，解出参数即得矩估计。' },
    { id: 'pr-moment-2', type: 'single', stem: '估计总体期望时，常用的一阶矩估计量是？', options: { A: '样本均值 X̄', B: '样本方差 S²', C: '样本中位数', D: '样本极差' }, answer: 'A', explanation: '总体一阶原点矩即期望，用样本一阶原点矩 X̄ 估计。' },
    { id: 'pr-moment-3', type: 'judge', stem: '矩估计的结果可能不唯一。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '可选择不同阶矩建立方程，可能得到不同估计量。' },
    { id: 'pr-moment-4', type: 'single', stem: '参数的点估计是指什么？', options: { A: '用样本算出一个数值作为参数的估计', B: '给出一个区间', C: '给出概率', D: '检验假设' }, answer: 'A', explanation: '点估计给出参数的单一估计值，区别于区间估计。' },
    { id: 'pr-moment-5', type: 'judge', stem: '矩估计思路简单直观，但有时不唯一且效率未必最高。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '矩估计易于实现，但可能不如最大似然估计有效。' },
  ]);

  add('probability:ch7-s2', [
    { id: 'pr-mle-2', type: 'single', stem: '似然函数 L(θ) 的定义是？', options: { A: '样本联合密度/分布律作为 θ 的函数', B: 'θ 的分布函数', C: '样本均值', D: 'θ 的期望' }, answer: 'A', explanation: 'L(θ)=Πf(xᵢ;θ)（或连乘分布律），表示样本出现的概率。' },
    { id: 'pr-mle-3', type: 'judge', stem: '求最大似然估计时，通常先取对数再求导，令导数为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '对数把连乘化为求和，便于求导求极值。' },
    { id: 'pr-mle-4', type: 'single', stem: '最大似然估计具有什么重要性质？', options: { A: '不变性（函数的最大似然估计等于估计的函数）', B: '一定无偏', C: '一定有效', D: '不需要样本' }, answer: 'A', explanation: '若 θ̂ 是 θ 的 MLE，则 g(θ̂) 是 g(θ) 的 MLE。' },
    { id: 'pr-mle-5', type: 'judge', stem: '最大似然估计是使观测样本出现概率最大的参数值。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是 MLE 的基本思想。' },
  ]);

  add('probability:ch7-s3', [
    { id: 'pr-unbiased-2', type: 'single', stem: '估计量的三条常用评选标准是？', options: { A: '无偏性、有效性、一致性', B: '连续性、可导性、单调性', C: '非负性、规范性、可加性', D: '对称性、传递性、完备性' }, answer: 'A', explanation: '无偏性看期望，有效性看方差，一致性看依概率收敛。' },
    { id: 'pr-unbiased-3', type: 'judge', stem: '有效性是指在无偏估计中方差最小。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '有效估计在无偏估计类中方差最小，更接近真值。' },
    { id: 'pr-unbiased-4', type: 'single', stem: '一致估计量的含义是？', options: { A: '样本量增大时依概率收敛于被估参数', B: '期望等于参数', C: '方差最小', D: '分布为正态' }, answer: 'A', explanation: '一致性（相合性）要求 n→∞ 时估计量收敛于真值。' },
    { id: 'pr-unbiased-5', type: 'judge', stem: '无偏估计量不一定有效。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '无偏只保证平均准确，方差大小由有效性衡量。' },
  ]);

  add('probability:ch7-s4', [
    { id: 'pr-ci-1', type: 'single', stem: '单个正态总体均值 μ 的区间估计中，若 σ 已知应使用？', options: { A: '标准正态分布 u', B: 't 分布', C: 'χ² 分布', D: 'F 分布' }, answer: 'A', explanation: 'σ 已知时用 u 统计量构造置信区间；σ 未知时改用 t。' },
    { id: 'pr-ci-2', type: 'single', stem: '置信水平 1−α 的含义是？', options: { A: '置信区间包含真值的概率为 1−α', B: '真值落入区间的次数', C: '区间的长度', D: '样本量' }, answer: 'A', explanation: '置信水平表示区间覆盖参数真值的概率（频率意义）。' },
    { id: 'pr-ci-3', type: 'judge', stem: '当 σ 未知时，单个正态总体均值的区间估计使用 t(n−1) 分布。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'σ 未知用样本标准差 S，统计量服从 t(n−1)。' },
    { id: 'pr-ci-4', type: 'single', stem: '正态总体方差的区间估计使用什么分布？', options: { A: 'χ² 分布', B: 't 分布', C: 'F 分布', D: '正态分布' }, answer: 'A', explanation: '由 (n−1)S²/σ²~χ²(n−1) 构造方差的置信区间。' },
    { id: 'pr-ci-5', type: 'judge', stem: '在样本量不变时，置信水平越高，置信区间越宽。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '提高置信水平需要更大的临界值，区间随之变宽。' },
  ]);

  add('probability:ch7-s5', [
    { id: 'pr-ci2-1', type: 'single', stem: '两个正态总体均值差的区间估计，当方差未知但相等时常用？', options: { A: '合并方差构造的 t 统计量', B: '标准正态', C: 'χ² 分布', D: 'F 分布' }, answer: 'A', explanation: '方差相等时用合并方差估计公共方差，得到 t 分布统计量。' },
    { id: 'pr-ci2-2', type: 'single', stem: '两个正态总体方差比的区间估计使用什么分布？', options: { A: 'F 分布', B: 't 分布', C: 'χ² 分布', D: '正态分布' }, answer: 'A', explanation: '由两样本方差之比构造 F 统计量估计方差比。' },
    { id: 'pr-ci2-3', type: 'judge', stem: '对配对数据做区间估计时，可转化为对差值的单样本问题。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '配对试验先求每对差值，再按单样本方法处理。' },
    { id: 'pr-ci2-4', type: 'single', stem: '两总体独立抽样时，通常要求？', options: { A: '两个样本相互独立', B: '两个样本量相等', C: '方差相等', D: '均值相等' }, answer: 'A', explanation: '独立两样本要求两组观测相互独立，方差相等与否影响所用统计量。' },
    { id: 'pr-ci2-5', type: 'judge', stem: '两正态总体均值差的置信区间可用于比较两组平均水平。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若区间不包含 0，说明两组均值存在显著差异。' },
  ]);

  add('probability:ch8-s1', [
    { id: 'pr-test-2', type: 'single', stem: '假设检验的第一步通常是？', options: { A: '提出原假设 H₀ 与备择假设 H₁', B: '计算统计量', C: '查表', D: '下结论' }, answer: 'A', explanation: '先明确要检验的原假设与备择假设。' },
    { id: 'pr-test-3', type: 'judge', stem: '假设检验基于小概率原理：小概率事件在一次试验中几乎不发生。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若在原假设下观测到小概率事件，就有理由拒绝原假设。' },
    { id: 'pr-test-4', type: 'single', stem: '假设检验的一般步骤是？', options: { A: '提假设→选统计量→定拒绝域→作判断', B: '先下结论再检验', C: '只计算均值', D: '只画图' }, answer: 'A', explanation: '完整流程为提出假设、构造统计量、确定拒绝域、根据样本判断。' },
    { id: 'pr-test-5', type: 'judge', stem: '假设检验的结论基于样本，因此可能犯错误。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '样本的随机性导致可能弃真或取伪，即两类错误。' },
  ]);

  add('probability:ch8-s2', [
    { id: 'pr-error-2', type: 'single', stem: '第一类错误的含义是？', options: { A: '原假设为真却拒绝它（弃真）', B: '原假设为假却接受它', C: '样本量过大', D: '计算错误' }, answer: 'A', explanation: '第一类错误是“弃真”，其概率为显著性水平 α。' },
    { id: 'pr-error-3', type: 'judge', stem: '第二类错误的含义是原假设为假却接受它（取伪），概率记为 β。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '第二类错误为“取伪”，概率 β。' },
    { id: 'pr-error-4', type: 'single', stem: '检验的功效（power）等于？', options: { A: '1 − β', B: 'α', C: '1 − α', D: 'β' }, answer: 'A', explanation: '功效表示正确拒绝错误原假设的概率，即 1−β。' },
    { id: 'pr-error-5', type: 'judge', stem: '在样本量固定时，减小 α 通常会使 β 增大。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '两类错误此消彼长；增大样本量才能同时减小二者。' },
  ]);

  add('probability:ch8-s3', [
    { id: 'pr-ht1-1', type: 'single', stem: '单个正态总体均值检验，当 σ 已知时应使用？', options: { A: 'u 检验', B: 't 检验', C: 'χ² 检验', D: 'F 检验' }, answer: 'A', explanation: 'σ 已知用标准正态 u 统计量进行 u 检验。' },
    { id: 'pr-ht1-2', type: 'single', stem: '单个正态总体均值检验，当 σ 未知时应使用？', options: { A: 't 检验', B: 'u 检验', C: 'χ² 检验', D: 'F 检验' }, answer: 'A', explanation: 'σ 未知用样本标准差，统计量服从 t(n−1)，进行 t 检验。' },
    { id: 'pr-ht1-3', type: 'judge', stem: '单个正态总体方差的假设检验使用 χ² 检验。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由 (n−1)S²/σ₀²~χ²(n−1) 构造检验统计量。' },
    { id: 'pr-ht1-4', type: 'single', stem: '双边检验的拒绝域位于？', options: { A: '分布两侧', B: '仅左侧', C: '仅右侧', D: '分布中心' }, answer: 'A', explanation: '备择假设为 μ≠μ₀ 时，拒绝域在分布两端。' },
    { id: 'pr-ht1-5', type: 'judge', stem: '单边检验的拒绝域位于分布的一侧。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '备择假设为 μ>μ₀ 或 μ<μ₀ 时，拒绝域在右尾或左尾。' },
  ]);

  add('probability:ch8-s4', [
    { id: 'pr-ht2-1', type: 'single', stem: '比较两个正态总体均值是否相等，常用？', options: { A: '两样本 t 检验', B: 'χ² 检验', C: 'F 检验', D: '符号检验' }, answer: 'A', explanation: '两均值差的检验在方差未知时用 t 检验（视方差是否齐性）。' },
    { id: 'pr-ht2-2', type: 'single', stem: '检验两个正态总体方差是否相等，使用？', options: { A: 'F 检验', B: 't 检验', C: 'u 检验', D: 'χ² 检验' }, answer: 'A', explanation: '两样本方差之比服从 F 分布，故用 F 检验比较方差。' },
    { id: 'pr-ht2-3', type: 'judge', stem: '方差齐性检验使用 F 分布。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'F 检验用于判断两总体方差是否相等（方差齐性）。' },
    { id: 'pr-ht2-4', type: 'single', stem: '配对试验的检验可转化为？', options: { A: '对差值的单样本 t 检验', B: '两独立样本 F 检验', C: 'χ² 检验', D: '方差分析' }, answer: 'A', explanation: '配对数据求差后按单个正态总体均值检验处理。' },
    { id: 'pr-ht2-5', type: 'judge', stem: '对两独立样本做均值检验前，常需先检验方差是否齐性。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '方差齐性决定采用合并方差 t 检验还是近似 t 检验。' },
  ]);

  /* == MORE == */
})(window);
