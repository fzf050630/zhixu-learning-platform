/* 知序 · 概率论与数理统计自测题库（原创“真题风格”题，覆盖全部 8 章） */
(function (global) {
  'use strict';
  Object.assign(global.ZhixuQuestions = global.ZhixuQuestions || {}, {
    'probability:ch1-s1': [
      { id: 'pr-event-1', type: 'single', stem: '若事件 A 与 B 互斥（互不相容），则？', options: { A: 'P(A∪B) = P(A) + P(B)', B: 'P(AB) = P(A)P(B)', C: 'A 与 B 相互独立', D: 'P(A) = P(B)' }, answer: 'A', explanation: '互斥即 AB=∅，由可加性得 P(A∪B)=P(A)+P(B)；独立性是 P(AB)=P(A)P(B)，与互斥不同。' },
    ],
    'probability:ch1-s4': [
      { id: 'pr-classic-1', type: 'single', stem: '古典概型要求样本空间满足什么条件？', options: { A: '样本点有限且每个样本点等可能', B: '样本点无限但等可能', C: '样本点有限但概率可不等', D: '样本空间连续' }, answer: 'A', explanation: '古典概型的两个前提：样本点总数有限、每个基本事件发生的可能性相同。' },
    ],
    'probability:ch1-s6': [
      { id: 'pr-cond-1', type: 'single', stem: '当 P(B) > 0 时，条件概率 P(A|B) 的定义是？', options: { A: 'P(AB) / P(B)', B: 'P(B) / P(AB)', C: 'P(A) / P(B)', D: 'P(A) + P(B) − P(AB)' }, answer: 'A', explanation: '条件概率定义为 P(A|B) = P(AB)/P(B)（P(B)>0），把样本空间限制到事件 B 上。' },
    ],
    'probability:ch1-s7': [
      { id: 'pr-bayes-1', type: 'single', stem: '设 B₁,B₂ 是样本空间的一个划分，已知先验 P(Bᵢ) 与条件概率 P(A|Bᵢ)，求 P(Bᵢ|A) 应使用？', options: { A: '贝叶斯公式', B: '全概率公式', C: '伯努利概型', D: '切比雪夫不等式' }, answer: 'A', explanation: 'P(Bᵢ|A)=P(A|Bᵢ)P(Bᵢ)/ΣP(A|Bⱼ)P(Bⱼ)，即贝叶斯公式；分母用全概率公式计算。' },
    ],
    'probability:ch1-s8': [
      { id: 'pr-indep-1', type: 'single', stem: '事件 A 与 B 相互独立的充要条件是？', options: { A: 'P(AB) = P(A)P(B)', B: 'P(A∪B) = P(A) + P(B)', C: 'AB = ∅', D: 'P(A) = P(B)' }, answer: 'A', explanation: '独立的定义就是 P(AB)=P(A)P(B)；互斥是 AB=∅，两者不能混淆。' },
    ],
    'probability:ch2-s1': [
      { id: 'pr-cdf-1', type: 'single', stem: '随机变量的分布函数 F(x)=P(X≤x) 一定满足？', options: { A: '单调不减、右连续，且 F(−∞)=0、F(+∞)=1', B: '单调不增', C: '左连续', D: '处处可导' }, answer: 'A', explanation: '分布函数的基本性质：单调不减、右连续，两端极限为 0 和 1。' },
    ],
    'probability:ch2-s2': [
      { id: 'pr-discrete-1', type: 'judge', stem: '离散型随机变量的所有可能取值对应的概率之和等于 1。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '概率分布律满足非负性与归一性 Σpᵢ=1。' },
    ],
    'probability:ch2-s5': [
      { id: 'pr-cont-1', type: 'single', stem: '关于常见连续型分布，下列说法正确的是？', options: { A: '正态分布由均值 μ 与方差 σ² 完全确定', B: '指数分布是连续型的对称分布', C: '均匀分布的期望与方差均为 1/2', D: '标准正态分布的方差为 1、期望为 1' }, answer: 'A', explanation: '正态分布 N(μ,σ²) 由 μ 和 σ² 唯一确定；标准正态分布期望 0、方差 1。' },
      { id: 'pr-cont-2', type: 'single', stem: '若 X~N(μ,σ²)，则 (X−μ)/σ 服从？', options: { A: '标准正态分布 N(0,1)', B: 'N(μ,σ²)', C: '均匀分布', D: '指数分布' }, answer: 'A', explanation: '正态分布的标准化：(X−μ)/σ ~ N(0,1)。' },
    ],
    'probability:ch3-s1': [
      { id: 'pr-joint-1', type: 'single', stem: '二维随机变量 (X,Y) 的联合分布函数定义为？', options: { A: 'F(x,y)=P(X≤x, Y≤y)', B: 'F(x,y)=P(X≤x)+P(Y≤y)', C: 'F(x,y)=P(X=x, Y=y)', D: 'F(x,y)=P(X>x, Y>y)' }, answer: 'A', explanation: '联合分布函数 F(x,y)=P(X≤x, Y≤y)，描述落入左下方区域的概率。' },
    ],
    'probability:ch3-s4': [
      { id: 'pr-indep2-1', type: 'judge', stem: '随机变量 X 与 Y 相互独立一定推出它们不相关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '独立 ⇒ 不相关（协方差为 0）；反之不成立，不相关只说明无线性关系。' },
    ],
    'probability:ch4-s1': [
      { id: 'pr-exp-1', type: 'judge', stem: '对任意常数 a、b，都有 E(aX + b) = aE(X) + b。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '数学期望具有线性性，无需 X、Y 独立。' },
    ],
    'probability:ch4-s2': [
      { id: 'pr-var-1', type: 'single', stem: '对常数 a，方差 D(aX) 等于？', options: { A: 'a²D(X)', B: 'aD(X)', C: 'D(X)', D: 'a²D(X) + a' }, answer: 'A', explanation: 'D(aX)=a²D(X)，常数倍使方差按平方缩放；D(X+b)=D(X)。' },
    ],
    'probability:ch4-s4': [
      { id: 'pr-corr-1', type: 'single', stem: '随机变量 X 与 Y 的相关系数 ρ 的取值范围是？', options: { A: '[−1, 1]', B: '[0, 1]', C: '(−∞, +∞)', D: '[0, +∞)' }, answer: 'A', explanation: '相关系数 |ρ|≤1；|ρ|=1 表示 X 与 Y 以概率 1 存在线性关系。' },
    ],
    'probability:ch5-s1': [
      { id: 'pr-cheb-1', type: 'single', stem: '切比雪夫不等式给出的是？', options: { A: 'P{|X−E(X)| ≥ ε} ≤ D(X)/ε²', B: 'P{|X−E(X)| ≥ ε} ≥ D(X)/ε²', C: 'P{X ≥ ε} = D(X)/ε²', D: 'P{|X| ≤ ε} = 1' }, answer: 'A', explanation: '切比雪夫不等式用方差给出偏离均值概率的上界：P{|X−μ|≥ε} ≤ σ²/ε²。' },
    ],
    'probability:ch5-s3': [
      { id: 'pr-clt-1', type: 'single', stem: '独立同分布的中心极限定理表明，当 n 充分大时，样本和 ΣXᵢ 的标准化变量近似服从？', options: { A: '标准正态分布 N(0,1)', B: '均匀分布', C: '指数分布', D: 'χ² 分布' }, answer: 'A', explanation: '林德伯格–列维定理：独立同分布且方差有限的变量，其和标准化后依分布收敛于 N(0,1)。' },
    ],
    'probability:ch6-s2': [
      { id: 'pr-sample-1', type: 'single', stem: '设 X₁,…,Xₙ 是来自总体 N(μ,σ²) 的简单随机样本，则样本均值 X̄ 满足？', options: { A: 'E(X̄)=μ，D(X̄)=σ²/n', B: 'E(X̄)=μ，D(X̄)=σ²', C: 'E(X̄)=μ/n，D(X̄)=σ²', D: 'E(X̄)=0，D(X̄)=1' }, answer: 'A', explanation: '样本均值是总体均值的无偏估计，其方差为总体方差的 1/n，n 越大越集中。' },
    ],
    'probability:ch6-s3': [
      { id: 'pr-chi-1', type: 'single', stem: '设 X₁,…,Xₙ 独立同服从 N(0,1)，则 ΣXᵢ² 服从？', options: { A: '自由度为 n 的 χ² 分布', B: 't 分布', C: 'F 分布', D: '标准正态分布' }, answer: 'A', explanation: 'n 个独立标准正态变量的平方和服从 χ²(n)，这是 χ² 分布的定义。' },
    ],
    'probability:ch6-s5': [
      { id: 'pr-t-1', type: 'single', stem: '设 X₁,…,Xₙ 来自正态总体 N(μ,σ²)，σ² 未知，则 (X̄−μ)/(S/√n) 服从？', options: { A: '自由度为 n−1 的 t 分布', B: '标准正态分布', C: '自由度为 n 的 χ² 分布', D: 'F 分布' }, answer: 'A', explanation: 'σ² 未知时用样本标准差 S 代替 σ，得到服从 t(n−1) 的统计量。' },
    ],
    'probability:ch7-s2': [
      { id: 'pr-mle-1', type: 'single', stem: '最大似然估计的基本思想是？', options: { A: '选取使样本出现概率（似然函数）最大的参数值', B: '令样本均值等于总体均值', C: '使方差最小', D: '随机选取参数' }, answer: 'A', explanation: '最大似然估计在参数空间中找使观测样本出现概率最大的 θ，通常对对数似然求导并令其为 0。' },
    ],
    'probability:ch7-s3': [
      { id: 'pr-unbiased-1', type: 'single', stem: '若 E(θ̂) = θ，则称 θ̂ 是 θ 的？', options: { A: '无偏估计量', B: '有效估计量', C: '一致估计量', D: '最大似然估计量' }, answer: 'A', explanation: '无偏性指估计量的数学期望等于被估参数；有效性比较方差，一致性指依概率收敛于 θ。' },
    ],
    'probability:ch8-s1': [
      { id: 'pr-test-1', type: 'single', stem: '假设检验的基本思想是？', options: { A: '基于小概率原理，用样本信息判断是否拒绝原假设', B: '直接证明原假设成立', C: '随机接受所有假设', D: '只计算点估计' }, answer: 'A', explanation: '在“原假设成立”的前提下，若观测到的小概率事件发生了，就有理由拒绝原假设。' },
    ],
    'probability:ch8-s2': [
      { id: 'pr-error-1', type: 'single', stem: '在假设检验中，第一类错误（弃真）的概率通常记为？', options: { A: 'α', B: 'β', C: '1−α', D: '1−β' }, answer: 'A', explanation: '第一类错误是原假设为真却拒绝它，概率为显著性水平 α；第二类错误是原假设为假却接受它，概率为 β。' },
    ],
  });
})(window);
