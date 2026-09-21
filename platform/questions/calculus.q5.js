/* 知序 · 高等数学补充题目（把每个小节补足到 5 题） */
(function (global) {
  'use strict';
  const bank = global.ZhixuQuestions = global.ZhixuQuestions || {};
  const add = (nodeId, questions) => { bank[nodeId] = (bank[nodeId] || []).concat(questions); };

  add('calculus:ch1-s1', [
    { id: 'ca-fn-1', type: 'single', stem: '确定一个函数需要哪三个要素？', options: { A: '定义域、值域、对应法则', B: '自变量、因变量、常数', C: '导数、积分、极限', D: '单调、有界、周期' }, answer: 'A', explanation: '函数由定义域、值域和对应法则确定，其中对应法则和定义域是关键。' },
    { id: 'ca-fn-2', type: 'single', stem: '奇函数与偶函数的图像分别关于什么对称？', options: { A: '奇函数关于原点，偶函数关于 y 轴', B: '都关于原点', C: '都关于 y 轴', D: '奇函数关于 x 轴' }, answer: 'A', explanation: '奇函数满足 f(−x)=−f(x)，图像关于原点对称；偶函数满足 f(−x)=f(x)，关于 y 轴对称。' },
    { id: 'ca-fn-3', type: 'judge', stem: '有界性、单调性、周期性都是函数的重要性质。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这些性质在研究函数与后续极限、导数中经常用到。' },
    { id: 'ca-fn-4', type: 'single', stem: '复合函数 f[g(x)] 有意义的条件是？', options: { A: 'g 的值域与 f 的定义域有交集（落在 f 的定义域内）', B: 'f、g 都单调', C: 'f、g 都连续', D: 'f=g' }, answer: 'A', explanation: '内层函数的取值必须落在外层函数的定义域内，复合才有意义。' },
    { id: 'ca-fn-5', type: 'judge', stem: '单调函数一定存在反函数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '单调函数是一一对应的，因此存在反函数（反之不真）。' },
  ]);

  add('calculus:ch1-s2', [
    { id: 'ca-elem-1', type: 'single', stem: '基本初等函数包括哪几类？', options: { A: '幂、指数、对数、三角、反三角及常数函数', B: '只有幂函数与指数函数', C: '只有三角函数', D: '所有连续函数' }, answer: 'A', explanation: '基本初等函数共六类，是构造初等函数的基础。' },
    { id: 'ca-elem-2', type: 'single', stem: '指数函数 y=aˣ 的底数要求是？', options: { A: 'a > 0 且 a ≠ 1', B: 'a > 1', C: 'a < 0', D: 'a = 1' }, answer: 'A', explanation: '指数函数要求底数 a>0 且 a≠1，定义域为全体实数。' },
    { id: 'ca-elem-3', type: 'judge', stem: '对数函数与同底的指数函数互为反函数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'y=aˣ 与 y=log_a x 互为反函数，图像关于 y=x 对称。' },
    { id: 'ca-elem-4', type: 'single', stem: '初等函数是指哪一类函数？', options: { A: '由基本初等函数经有限次四则运算与复合得到并用一个式子表示的函数', B: '任意连续函数', C: '只有多项式', D: '只有三角函数' }, answer: 'A', explanation: '初等函数由基本初等函数经过有限次运算和复合构成。' },
    { id: 'ca-elem-5', type: 'judge', stem: '初等函数在其定义区间内是连续的。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是初等函数的重要性质，为求极限带来方便。' },
  ]);

  add('calculus:ch1-s3', [
    { id: 'ca-lim-3', type: 'single', stem: '函数极限的基本性质包括？', options: { A: '唯一性、局部有界性、局部保号性', B: '单调性、周期性', C: '可导性、连续性', D: '奇偶性、对称性' }, answer: 'A', explanation: '极限存在则唯一，且在局部有界、保号。' },
    { id: 'ca-lim-4', type: 'judge', stem: '若函数在某点的极限存在，则该极限是唯一的。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '极限的唯一性是极限的基本性质之一。' },
    { id: 'ca-lim-5', type: 'single', stem: '无穷小量与有界函数的乘积是？', options: { A: '无穷小量', B: '无穷大量', C: '常数', D: '不一定' }, answer: 'A', explanation: '无穷小乘以有界量仍是无穷小，这是求极限的常用结论。' },
    { id: 'ca-lim-6', type: 'judge', stem: '非零无穷小量的倒数是无穷大量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '无穷小与无穷大在一定条件下互为倒数关系。' },
  ]);

  add('calculus:ch1-s4', [
    { id: 'ca-limrule-1', type: 'single', stem: '微积分中的两个重要极限分别是？', options: { A: 'lim(sinx/x)=1 与 lim(1+1/x)ˣ=e', B: 'lim(x/sinx)=0 与 lim xˣ=0', C: 'lim sinx=∞ 与 lim eˣ=0', D: 'lim(1/x)=0 与 lim x=∞' }, answer: 'A', explanation: '两个重要极限常用于处理三角与幂指型未定式。' },
    { id: 'ca-limrule-2', type: 'judge', stem: '夹逼准则可用于求某些难以直接计算的极限。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若 g≤f≤h 且 g、h 极限相同，则 f 的极限也相同。' },
    { id: 'ca-limrule-3', type: 'single', stem: '单调有界准则说明？', options: { A: '单调有界数列必有极限', B: '有界数列必有极限', C: '单调数列必有极限', D: '任意数列都有极限' }, answer: 'A', explanation: '单调且有界的数列一定收敛，这是判断极限存在的重要准则。' },
    { id: 'ca-limrule-4', type: 'judge', stem: '在求极限时可用等价无穷小替换简化计算。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '如 sinx~x、1−cosx~x²/2，可在乘除因子中替换。' },
  ]);

  add('calculus:ch1-s5', [
    { id: 'ca-cont-2', type: 'single', stem: '函数 f(x) 在 x₀ 处连续的定义是？', options: { A: 'lim(x→x₀) f(x) = f(x₀)', B: 'f 在 x₀ 可导', C: 'f 在 x₀ 有定义即可', D: 'f 在 x₀ 单调' }, answer: 'A', explanation: '连续要求极限存在、函数有定义且二者相等。' },
    { id: 'ca-cont-3', type: 'judge', stem: '间断点可分为第一类（可去、跳跃）和第二类（无穷、振荡）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '按左右极限是否存在与相等来分类。' },
    { id: 'ca-cont-4', type: 'single', stem: '闭区间上连续函数具有哪些重要性质？', options: { A: '有界性、最值定理、介值定理', B: '可导性、可积性', C: '单调性、周期性', D: '奇偶性、对称性' }, answer: 'A', explanation: '闭区间连续函数必有界、能取到最值，并满足介值定理。' },
    { id: 'ca-cont-5', type: 'judge', stem: '初等函数在其定义区间内连续，因此可在定义域内直接代入求极限。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '连续性使 lim f(x)=f(x₀) 在定义点成立。' },
  ]);

  add('calculus:ch2-s1', [
    { id: 'ca-deriv-2', type: 'single', stem: '导数 f′(x₀) 的几何意义是？', options: { A: '曲线 y=f(x) 在点 (x₀,f(x₀)) 处切线的斜率', B: '曲线的面积', C: '函数的平均值', D: '曲线的长度' }, answer: 'A', explanation: '导数表示曲线在该点切线的斜率，即瞬时变化率。' },
    { id: 'ca-deriv-3', type: 'judge', stem: '函数在某点可导，则它在该点一定连续。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '可导必连续，但连续不一定可导（如 |x| 在 0 处）。' },
    { id: 'ca-deriv-4', type: 'single', stem: '函数 y=f(x) 的微分 dy 等于？', options: { A: 'f′(x)dx', B: 'f(x)dx', C: 'dx', D: 'f″(x)dx' }, answer: 'A', explanation: '微分 dy=f′(x)dx，是函数增量的线性主部。' },
    { id: 'ca-deriv-5', type: 'judge', stem: '函数在某点可导的充要条件是左右导数存在且相等。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '左右导数都存在且相等时，该点导数存在。' },
  ]);

  add('calculus:ch2-s2', [
    { id: 'ca-rule-1', type: 'single', stem: '求导的四则运算法则中，(uv)′ 等于？', options: { A: 'u′v + uv′', B: 'u′v′', C: 'u′v − uv′', D: 'u′/v′' }, answer: 'A', explanation: '乘积求导为“前导后不导加前不导后导”。' },
    { id: 'ca-rule-2', type: 'single', stem: '复合函数求导使用什么法则？', options: { A: '链式法则（外层导数乘以内层导数）', B: '乘积法则', C: '商法则', D: '洛必达法则' }, answer: 'A', explanation: 'dy/dx=dy/du·du/dx，逐层求导相乘。' },
    { id: 'ca-rule-3', type: 'judge', stem: '反函数的导数等于原函数导数的倒数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若 y=f(x) 单调可导且 f′(x)≠0，则反函数 x=f⁻¹(y) 的导数为 1/f′(x)。' },
    { id: 'ca-rule-4', type: 'single', stem: '求隐函数 y=y(x) 的导数，通常的做法是？', options: { A: '方程两边对 x 求导，把 y 看作 x 的函数', B: '直接解出 y', C: '用洛必达法则', D: '用夹逼准则' }, answer: 'A', explanation: '对含 y 的项用链式法则，再解出 y′。' },
    { id: 'ca-rule-5', type: 'judge', stem: '参数方程 x=x(t)、y=y(t) 确定的函数，dy/dx = (dy/dt)/(dx/dt)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '参数方程求导公式为两个导数之比（要求 dx/dt≠0）。' },
  ]);

  add('calculus:ch2-s3', [
    { id: 'ca-mvt-3', type: 'single', stem: '罗尔定理、拉格朗日中值定理、柯西中值定理之间的关系是？', options: { A: '罗尔是拉格朗日的特例，拉格朗日是柯西的特例', B: '三者无关', C: '柯西是罗尔的特例', D: '完全等价' }, answer: 'A', explanation: '柯西中值定理最一般，取 g(x)=x 得拉格朗日，再取端点相等得罗尔。' },
    { id: 'ca-mvt-4', type: 'judge', stem: '柯西中值定理可以看作拉格朗日中值定理的推广。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '柯西中值定理涉及两个函数，拉格朗日是其一元特例。' },
    { id: 'ca-mvt-5', type: 'single', stem: '微分中值定理的主要用途是？', options: { A: '证明等式、不等式以及研究函数性质', B: '计算面积', C: '求极限的唯一方法', D: '解微分方程' }, answer: 'A', explanation: '中值定理把函数值与导数值联系起来，是证明类题目的核心工具。' },
  ]);

  add('calculus:ch2-s4', [
    { id: 'ca-lhop-2', type: 'single', stem: '洛必达法则适用于哪两种未定式？', options: { A: '0/0 型与 ∞/∞ 型', B: '0·∞ 型与 ∞−∞ 型', C: '1^∞ 型', D: '任意极限' }, answer: 'A', explanation: '其他未定式通常先化为 0/0 或 ∞/∞ 再用洛必达。' },
    { id: 'ca-lhop-3', type: 'judge', stem: '使用洛必达法则前必须先验证是否为 0/0 或 ∞/∞ 型未定式。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不满足条件时使用洛必达会得到错误结果。' },
    { id: 'ca-lhop-4', type: 'single', stem: '对于 0·∞ 型未定式，常用的处理方法是？', options: { A: '化为 0/0 或 ∞/∞ 型', B: '直接代入', C: '求导数', D: '取对数' }, answer: 'A', explanation: '把乘积写成商的形式，转化为 0/0 或 ∞/∞。' },
    { id: 'ca-lhop-5', type: 'judge', stem: '若一次洛必达后仍是未定式，可继续使用洛必达法则。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '只要每次求导后仍满足条件，可以反复使用。' },
  ]);

  add('calculus:ch2-s5', [
    { id: 'ca-mono-1', type: 'single', stem: '利用导数判断函数单调性：当 f′(x)>0 时函数？', options: { A: '单调递增', B: '单调递减', C: '有极大值', D: '为常数' }, answer: 'A', explanation: '导数大于 0 说明函数随 x 增大而增大。' },
    { id: 'ca-mono-2', type: 'judge', stem: '函数的极值点可能出现在导数为 0 的点，也可能出现在导数不存在的点。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '如 |x| 在 0 处导数不存在但取极小值。' },
    { id: 'ca-mono-3', type: 'single', stem: '用二阶导数判断极值：若 f′(x₀)=0 且 f″(x₀)>0，则 x₀ 是？', options: { A: '极小值点', B: '极大值点', C: '拐点', D: '不可导点' }, answer: 'A', explanation: 'f″>0 说明曲线下凸，驻点处取极小值。' },
    { id: 'ca-mono-4', type: 'judge', stem: '求闭区间上连续函数的最值，需比较区间内驻点与端点的函数值。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '最值只可能在极值点或端点取得。' },
  ]);

  add('calculus:ch2-s6', [
    { id: 'ca-concave-1', type: 'single', stem: '利用二阶导数判断凹凸性：f″(x)>0 表示曲线？', options: { A: '凹（下凸）', B: '凸（上凸）', C: '为直线', D: '有拐点' }, answer: 'A', explanation: 'f″>0 曲线下凸（凹），f″<0 曲线上凸。' },
    { id: 'ca-concave-2', type: 'single', stem: '曲线的拐点是指什么样的点？', options: { A: '曲线凹凸性发生改变的点', B: '导数为 0 的点', C: '函数值为 0 的点', D: '函数的极值点' }, answer: 'A', explanation: '拐点是凹凸性改变的点，可能是 f″=0 或 f″ 不存在的点。' },
    { id: 'ca-concave-3', type: 'judge', stem: '拐点处二阶导数可能为 0，也可能不存在。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '拐点的必要条件与极值类似，需具体判断两侧凹凸性是否改变。' },
    { id: 'ca-concave-4', type: 'single', stem: '曲线的渐近线通常分为哪几类？', options: { A: '水平、垂直、斜渐近线', B: '只有水平渐近线', C: '只有垂直渐近线', D: '只有斜渐近线' }, answer: 'A', explanation: '按 x→∞ 或 x→x₀ 时曲线的趋势分为三类。' },
    { id: 'ca-concave-5', type: 'judge', stem: '斜渐近线 y=kx+b 中的 k、b 由相应的极限确定。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'k=lim f(x)/x，b=lim(f(x)−kx)。' },
  ]);

  add('calculus:ch2-s7', [
    { id: 'ca-arc-1', type: 'single', stem: '曲线 y=f(x) 的弧微分 ds 等于？', options: { A: '√(1+y′²) dx', B: 'y′ dx', C: 'dx', D: '√(1+y″²) dx' }, answer: 'A', explanation: '弧微分 ds=√(dx²+dy²)=√(1+y′²)dx。' },
    { id: 'ca-arc-2', type: 'single', stem: '曲线 y=f(x) 的曲率 K 等于？', options: { A: '|y″| / (1+y′²)^{3/2}', B: '|y′|', C: '|y″|', D: '1/|y′|' }, answer: 'A', explanation: '曲率刻画曲线弯曲程度，公式为 K=|y″|/(1+y′²)^{3/2}。' },
    { id: 'ca-arc-3', type: 'judge', stem: '曲率半径 R 等于曲率 K 的倒数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'R=1/K，曲率越大曲率半径越小。' },
    { id: 'ca-arc-4', type: 'single', stem: '曲率圆与曲线在该点有什么关系？', options: { A: '有相同的切线与相同的曲率', B: '完全相同', C: '无关系', D: '只有相同面积' }, answer: 'A', explanation: '曲率圆与曲线在该点相切且曲率相等，圆心在法线上。' },
    { id: 'ca-arc-5', type: 'judge', stem: '直线的曲率为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '直线不弯曲，曲率为 0，曲率半径无穷大。' },
  ]);

  add('calculus:ch3-s1', [
    { id: 'ca-antideriv-1', type: 'single', stem: '若 F(x) 是 f(x) 的一个原函数，则 f(x) 的所有原函数可表示为？', options: { A: 'F(x) + C（C 为任意常数）', B: 'F(x)', C: 'C·F(x)', D: 'F(x)²' }, answer: 'A', explanation: '同一函数的任意两个原函数相差一个常数。' },
    { id: 'ca-antideriv-2', type: 'single', stem: '不定积分 ∫f(x)dx 表示？', options: { A: 'f(x) 的全体原函数', B: 'f(x) 的导数', C: 'f(x) 本身', D: '一个确定的数' }, answer: 'A', explanation: '不定积分是原函数族，结果要加任意常数 C。' },
    { id: 'ca-antideriv-3', type: 'judge', stem: '连续函数一定有原函数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '连续函数必可积，因而存在原函数。' },
    { id: 'ca-antideriv-4', type: 'single', stem: '基本积分公式中 ∫xⁿdx（n≠−1）等于？', options: { A: 'xⁿ⁺¹/(n+1) + C', B: 'xⁿ/n + C', C: 'nxⁿ⁻¹ + C', D: 'ln|x| + C' }, answer: 'A', explanation: '幂函数积分公式，n=−1 时对应 ln|x|。' },
    { id: 'ca-antideriv-5', type: 'judge', stem: '求不定积分的结果必须加上任意常数 C。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不定积分表示原函数族，漏掉 C 是常见错误。' },
  ]);

  add('calculus:ch3-s2', [
    { id: 'ca-defint-2', type: 'single', stem: '定积分 ∫ₐᵇf(x)dx 的本质是？', options: { A: '黎曼和的极限', B: '导数的极限', C: '一个不定积分', D: '函数值' }, answer: 'A', explanation: '定积分定义为分割、求和、取极限的结果。' },
    { id: 'ca-defint-3', type: 'judge', stem: '定积分的值与积分变量用什么字母无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '∫ₐᵇf(x)dx=∫ₐᵇf(t)dt，积分变量只是记号。' },
    { id: 'ca-defint-4', type: 'single', stem: '定积分的几何意义是？', options: { A: '曲边梯形面积的代数和', B: '曲线长度', C: '切线斜率', D: '函数平均值' }, answer: 'A', explanation: 'x 轴上方面积取正、下方面积取负，故为代数和。' },
    { id: 'ca-defint-5', type: 'judge', stem: '交换定积分的上下限，积分值变号。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '∫ₐᵇf dx = −∫ᵦᵃf dx。' },
  ]);

  add('calculus:ch3-s3', [
    { id: 'ca-nl-1', type: 'single', stem: '牛顿–莱布尼茨公式为？', options: { A: '∫ₐᵇf(x)dx = F(b) − F(a)', B: '∫ₐᵇf = F(a) − F(b)', C: '∫ₐᵇf = F(b) + F(a)', D: '∫ₐᵇf = f(b) − f(a)' }, answer: 'A', explanation: '其中 F 是 f 的任一原函数，公式把定积分转化为原函数在端点的差。' },
    { id: 'ca-nl-2', type: 'judge', stem: '变限积分 ∫ₐˣf(t)dt 是 f(x) 的一个原函数（f 连续时）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '变限积分对 x 求导得 f(x)，故它是 f 的原函数。' },
    { id: 'ca-nl-3', type: 'single', stem: '若 F(x)=∫ₐˣf(t)dt，f 连续，则 F′(x) 等于？', options: { A: 'f(x)', B: 'f′(x)', C: 'F(x)', D: '0' }, answer: 'A', explanation: '变限积分求导定理：F′(x)=f(x)。' },
    { id: 'ca-nl-4', type: 'judge', stem: '牛顿–莱布尼茨公式把定积分的计算与不定积分（原函数）联系起来。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是计算定积分最基本、最重要的公式。' },
  ]);

  add('calculus:ch3-s4', [
    { id: 'ca-sub-1', type: 'single', stem: '计算积分时常用的两种基本方法是？', options: { A: '换元积分法与分部积分法', B: '求导法与极限法', C: '洛必达法与夹逼法', D: '配方法与公式法' }, answer: 'A', explanation: '换元用于复合结构，分部用于乘积结构。' },
    { id: 'ca-sub-2', type: 'judge', stem: '分部积分公式为 ∫u dv = uv − ∫v du。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '由乘积求导公式移项得到，常用于处理乘积型积分。' },
    { id: 'ca-sub-3', type: 'single', stem: '用换元法计算定积分时，除了换被积表达式，还必须？', options: { A: '同时更换积分上下限', B: '保持上下限不变', C: '把上下限取倒数', D: '去掉上下限' }, answer: 'A', explanation: '定积分换元时积分限要随新变量相应改变。' },
  ]);

  add('calculus:ch3-s5', [
    { id: 'ca-improp-2', type: 'single', stem: '无穷限反常积分 ∫ₐ^∞f(x)dx 的定义是？', options: { A: 'lim(b→∞)∫ₐᵇf(x)dx', B: '∫ₐᵇf(x)dx', C: 'f(∞)', D: '0' }, answer: 'A', explanation: '无穷限积分用极限定义，极限存在则收敛。' },
    { id: 'ca-improp-3', type: 'judge', stem: '反常积分是通过取极限来定义的。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '无论无穷限还是无界函数（瑕积分），都用极限定义。' },
    { id: 'ca-improp-4', type: 'single', stem: '被积函数在积分区间内无界（有瑕点）的反常积分称为？', options: { A: '瑕积分', B: '定积分', C: '不定积分', D: '曲线积分' }, answer: 'A', explanation: '有瑕点的反常积分称为瑕积分（无界函数的反常积分）。' },
    { id: 'ca-improp-5', type: 'judge', stem: '反常积分 ∫₁^∞ (1/xᵖ)dx 当 p > 1 时收敛。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'p>1 收敛、p≤1 发散，是常用的判敛结论。' },
  ]);

  add('calculus:ch3-s6', [
    { id: 'ca-app-1', type: 'single', stem: '定积分可用于求平面图形的？', options: { A: '面积', B: '周长', C: '斜率', D: '凹凸性' }, answer: 'A', explanation: '由曲线围成的平面图形面积可用定积分表示。' },
    { id: 'ca-app-2', type: 'single', stem: '旋转体体积可用什么方法计算？', options: { A: '定积分的微元法（圆盘/壳层法）', B: '求导', C: '洛必达法则', D: '中值定理' }, answer: 'A', explanation: '把旋转体切成薄圆盘或薄壳，积分求体积。' },
    { id: 'ca-app-3', type: 'judge', stem: '曲线弧长可以用定积分计算。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '弧长 s=∫√(1+y′²)dx（或参数形式）。' },
    { id: 'ca-app-4', type: 'single', stem: '下列哪一项是定积分的物理应用？', options: { A: '变力做功与水压力', B: '求导数', C: '判断单调性', D: '解方程' }, answer: 'A', explanation: '变力做功、液体压力、质心等都可用定积分求解。' },
    { id: 'ca-app-5', type: 'judge', stem: '微元法是应用定积分解决几何与物理问题的基本方法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '取微元、近似、积分求和是应用定积分的通用思路。' },
  ]);

  add('calculus:ch4-s1', [
    { id: 'ca-vec-2', type: 'single', stem: '向量的线性运算包括？', options: { A: '加法与数乘', B: '求导与积分', C: '极限与连续', D: '排列与组合' }, answer: 'A', explanation: '向量可进行加法、减法与数乘等线性运算。' },
    { id: 'ca-vec-3', type: 'single', stem: '两个非零向量共线（平行）的充要条件是？', options: { A: '存在常数 λ 使 a = λb', B: 'a·b = 0', C: '|a|=|b|', D: 'a×b ≠ 0' }, answer: 'A', explanation: '共线即方向相同或相反，可用一个数乘表示。' },
    { id: 'ca-vec-4', type: 'judge', stem: '单位向量是模等于 1 的向量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '把非零向量除以其模即得同方向的单位向量。' },
    { id: 'ca-vec-5', type: 'single', stem: '向量的方向余弦满足？', options: { A: 'cos²α + cos²β + cos²γ = 1', B: 'cosα + cosβ + cosγ = 1', C: '三者之积为 1', D: '都等于 1' }, answer: 'A', explanation: '方向余弦的平方和为 1，这是单位向量分量的性质。' },
    { id: 'ca-vec-6', type: 'judge', stem: '两向量平行的充要条件是其对应分量成比例。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '在坐标表示下，平行等价于各分量成比例（允许分母为 0 时单独处理）。' },
  ]);

  add('calculus:ch4-s2', [
    { id: 'ca-dot-1', type: 'single', stem: '两向量数量积 a·b 等于？', options: { A: '|a||b|cosθ', B: '|a||b|sinθ', C: '|a|+|b|', D: '|a||b|' }, answer: 'A', explanation: '数量积是一个数，等于两向量模与其夹角余弦之积。' },
    { id: 'ca-dot-2', type: 'judge', stem: '向量积 a×b 的模等于以 a、b 为邻边的平行四边形的面积。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '|a×b|=|a||b|sinθ，即平行四边形面积。' },
    { id: 'ca-dot-3', type: 'single', stem: '向量积 a×b 的方向由什么确定？', options: { A: '右手法则（同时垂直于 a、b）', B: 'a 的方向', C: 'b 的方向', D: '任意方向' }, answer: 'A', explanation: 'a×b 垂直于 a 和 b，方向由右手法则确定。' },
    { id: 'ca-dot-4', type: 'judge', stem: 'a·b = 0 表示两向量垂直；a×b = 0 表示两向量平行。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '数量积为零对应垂直，向量积为零对应平行。' },
  ]);

  add('calculus:ch4-s3', [
    { id: 'ca-plane-2', type: 'single', stem: '已知平面上一点和法向量，可写出平面的？', options: { A: '点法式方程', B: '参数方程', C: '极坐标方程', D: '隐函数' }, answer: 'A', explanation: '平面点法式由法向量与过点条件确定。' },
    { id: 'ca-plane-3', type: 'judge', stem: '空间直线可以用点向式（对称式）方程表示。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '已知一点和方向向量即可写出直线的点向式方程。' },
    { id: 'ca-plane-4', type: 'single', stem: '两个平面的夹角由什么确定？', options: { A: '两平面法向量的夹角', B: '两平面交线', C: '原点位置', D: '截距之和' }, answer: 'A', explanation: '两平面夹角等于其法向量夹角（或其补角）。' },
    { id: 'ca-plane-5', type: 'judge', stem: '直线与平面的位置关系可通过方向向量与法向量的关系判断。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '方向向量与法向量垂直则直线平行于平面，平行则直线垂直于平面。' },
  ]);

  add('calculus:ch4-s4', [
    { id: 'ca-surface-1', type: 'single', stem: '常见的二次曲面不包括？', options: { A: '正弦面', B: '柱面', C: '锥面', D: '旋转抛物面' }, answer: 'A', explanation: '柱面、锥面、球面、椭球面、旋转抛物面等是常见曲面。' },
    { id: 'ca-surface-2', type: 'single', stem: '球心在原点、半径为 R 的球面方程是？', options: { A: 'x²+y²+z²=R²', B: 'x²+y²=R²', C: 'x+y+z=R', D: 'xyz=R' }, answer: 'A', explanation: '球面是到原点距离等于 R 的点集。' },
    { id: 'ca-surface-3', type: 'judge', stem: '空间曲线可以用参数方程表示。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '空间曲线常用参数方程 x=x(t), y=y(t), z=z(t) 表示。' },
    { id: 'ca-surface-4', type: 'single', stem: '空间曲线在坐标面上的投影是通过消元得到的？', options: { A: '投影柱面与坐标面的交线', B: '曲线的切线', C: '曲线的法线', D: '曲面的法向量' }, answer: 'A', explanation: '先求投影柱面方程，再与坐标面联立得投影曲线。' },
    { id: 'ca-surface-5', type: 'judge', stem: '旋转曲面由一条母线绕定轴旋转生成。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '母线绕轴旋转扫出旋转曲面，如 yOz 面曲线绕 z 轴生成旋转曲面。' },
  ]);

  add('calculus:ch5-s1', [
    { id: 'ca-multivar-1', type: 'single', stem: '二元函数的定义域通常是？', options: { A: '平面上的一个区域', B: '数轴上的区间', C: '空间曲面', D: '一条曲线' }, answer: 'A', explanation: '二元函数的定义域是使表达式有意义的点 (x,y) 组成的平面区域。' },
    { id: 'ca-multivar-2', type: 'single', stem: '二元函数极限存在要求？', options: { A: '沿任意路径趋近该点时极限都相同', B: '沿某一条路径极限存在', C: '沿 x 轴极限存在', D: '函数在该点有定义' }, answer: 'A', explanation: '多元极限要求路径无关，若不同路径极限不同则极限不存在。' },
    { id: 'ca-multivar-3', type: 'judge', stem: '若沿不同路径趋近同一点得到不同的极限，则该点极限不存在。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是判断多元函数极限不存在的常用方法。' },
    { id: 'ca-multivar-4', type: 'single', stem: '多元函数在某点连续的定义是？', options: { A: '极限存在且等于该点函数值', B: '函数有定义即可', C: '偏导数存在', D: '函数有界' }, answer: 'A', explanation: '与一元函数类似，连续要求极限值等于函数值。' },
    { id: 'ca-multivar-5', type: 'judge', stem: '多元函数极限存在要求路径无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是多元极限区别于一元极限的重要特点。' },
  ]);

  add('calculus:ch5-s2', [
    { id: 'ca-partial-2', type: 'single', stem: '偏导数 ∂z/∂x 的求法是？', options: { A: '把 y 看作常数，对 x 求导', B: '把 x 看作常数', C: '对 x、y 同时求导', D: '求全导数' }, answer: 'A', explanation: '求偏导时固定其余变量，按一元函数求导。' },
    { id: 'ca-partial-3', type: 'judge', stem: '二元函数在某点可微则偏导数一定存在；反之不一定成立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '可微 ⇒ 偏导存在，但偏导存在不保证可微。' },
    { id: 'ca-partial-4', type: 'single', stem: '二元函数的全微分 dz 等于？', options: { A: 'z_x dx + z_y dy', B: 'z_x + z_y', C: 'z_x dx − z_y dy', D: 'z_x z_y' }, answer: 'A', explanation: '全微分是各偏导与相应自变量微分乘积之和。' },
    { id: 'ca-partial-5', type: 'judge', stem: '当二阶混合偏导数连续时，它们相等。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '混合偏导连续时求导次序可交换。' },
  ]);

  add('calculus:ch5-s3', [
    { id: 'ca-chain-1', type: 'single', stem: '多元复合函数求导使用的法则是？', options: { A: '链式法则', B: '乘积法则', C: '洛必达法则', D: '中值定理' }, answer: 'A', explanation: '按复合路径逐层求导相乘再求和。' },
    { id: 'ca-chain-2', type: 'single', stem: '由方程 F(x,y)=0 确定的隐函数 y=y(x)，其导数 dy/dx 等于？', options: { A: '−F_x / F_y', B: 'F_x / F_y', C: '−F_y / F_x', D: 'F_x F_y' }, answer: 'A', explanation: '隐函数求导公式，要求 F_y≠0。' },
    { id: 'ca-chain-3', type: 'judge', stem: '全导数与偏导数的区别在于：全导数考虑了所有中间变量的依赖关系。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '当所有中间变量都依赖于同一自变量时用全导数。' },
    { id: 'ca-chain-4', type: 'single', stem: '隐函数存在定理给出了隐函数存在的？', options: { A: '条件（如 F 连续可偏导且 F_y≠0）', B: '显式表达式', C: '积分公式', D: '级数展开' }, answer: 'A', explanation: '隐函数存在定理说明在什么条件下方程能确定一个可导隐函数。' },
    { id: 'ca-chain-5', type: 'judge', stem: '求多元复合函数偏导时要注意中间变量的依赖结构。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '需按变量依赖关系画“变量树”，逐路径求导相加。' },
  ]);

  add('calculus:ch5-s4', [
    { id: 'ca-grad-2', type: 'single', stem: '方向导数表示的是？', options: { A: '函数沿某一指定方向的变化率', B: '函数的最大值', C: '函数的积分', D: '函数的周期' }, answer: 'A', explanation: '方向导数刻画函数在某点沿给定方向的变化快慢。' },
    { id: 'ca-grad-3', type: 'judge', stem: '梯度方向是函数值增长最快的方向。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '沿梯度方向方向导数最大，等于梯度的模。' },
    { id: 'ca-grad-4', type: 'single', stem: '梯度的模等于什么？', options: { A: '该点最大的方向导数', B: '函数值', C: '偏导数之和', D: '0' }, answer: 'A', explanation: '梯度的模就是方向导数的最大值。' },
    { id: 'ca-grad-5', type: 'judge', stem: '方向导数等于梯度与方向单位向量的数量积。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '∂f/∂l = grad f · e_l，e_l 为方向的单位向量。' },
  ]);

  add('calculus:ch5-s5', [
    { id: 'ca-tangent-1', type: 'single', stem: '空间曲线的切线的方向向量是？', options: { A: '切向量（由参数方程对参数求导得到）', B: '法向量', C: '梯度', D: '零向量' }, answer: 'A', explanation: '曲线 x(t),y(t),z(t) 的切向量为 (x′,y′,z′)。' },
    { id: 'ca-tangent-2', type: 'single', stem: '曲面 F(x,y,z)=0 在一点的切平面的法向量是？', options: { A: '(F_x, F_y, F_z)', B: '(x,y,z)', C: '(1,1,1)', D: '切向量' }, answer: 'A', explanation: '曲面方程隐式给出时，梯度 (F_x,F_y,F_z) 即法向量。' },
    { id: 'ca-tangent-3', type: 'judge', stem: '曲面 F(x,y,z)=0 在一点的法向量为 (F_x, F_y, F_z)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是求切平面与法线方程的关键。' },
    { id: 'ca-tangent-4', type: 'single', stem: '曲面在一点的切平面与法线的关系是？', options: { A: '相互垂直', B: '相互平行', C: '重合', D: '无关系' }, answer: 'A', explanation: '法线方向即法向量方向，与切平面垂直。' },
    { id: 'ca-tangent-5', type: 'judge', stem: '求空间曲线的切线需要先求切向量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '切向量确定后即可写出切线方程。' },
  ]);

  add('calculus:ch5-s6', [
    { id: 'ca-extrema-2', type: 'single', stem: '求二元函数无条件极值的一般步骤是？', options: { A: '先求驻点，再用二阶偏导判别', B: '直接代入端点', C: '求导数一次即可', D: '用洛必达法则' }, answer: 'A', explanation: '令偏导为 0 求驻点，再用 AC−B² 判别式判断极值。' },
    { id: 'ca-extrema-3', type: 'judge', stem: '求条件极值常用拉格朗日乘数法。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '构造拉格朗日函数，把条件极值化为无条件极值。' },
    { id: 'ca-extrema-4', type: 'single', stem: '二元函数极值的充分条件用哪个量判别？', options: { A: 'AC − B²（A=f_xx, B=f_xy, C=f_yy）', B: 'A + B + C', C: 'A·B·C', D: 'A − C' }, answer: 'A', explanation: 'AC−B²>0 时 A>0 取极小、A<0 取极大；<0 为鞍点。' },
    { id: 'ca-extrema-5', type: 'judge', stem: '拉格朗日乘数法通过构造 L = f + λφ 来求条件极值。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '令 L 的各偏导为 0，解出驻点即可。' },
  ]);

  add('calculus:ch6-s1', [
    { id: 'ca-double-2', type: 'single', stem: '计算二重积分的基本思路通常是？', options: { A: '化为累次积分', B: '求原函数', C: '用洛必达法则', D: '用夹逼准则' }, answer: 'A', explanation: '按积分区域选择直角坐标或极坐标，化为两次定积分。' },
    { id: 'ca-double-3', type: 'judge', stem: '极坐标下二重积分的面积元素 dσ = ρ dρ dθ。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '极坐标变换的雅可比行列式为 ρ，故 dσ=ρdρdθ。' },
    { id: 'ca-double-4', type: 'single', stem: '三重积分可选用哪些坐标系？', options: { A: '直角、柱面、球面坐标', B: '只有直角坐标', C: '只有极坐标', D: '只有球坐标' }, answer: 'A', explanation: '根据积分区域形状选择直角、柱面或球面坐标。' },
    { id: 'ca-double-5', type: 'judge', stem: '二重积分可以表示曲顶柱体的体积。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '当被积函数非负时，二重积分等于曲顶柱体体积。' },
  ]);

  add('calculus:ch6-s2', [
    { id: 'ca-lineint-1', type: 'single', stem: '第一类曲线积分是？', options: { A: '对弧长的曲线积分', B: '对坐标的曲线积分', C: '对面积的曲面积分', D: '对体积的积分' }, answer: 'A', explanation: '第一类曲线积分 ∫f(x,y)ds 对弧长积分。' },
    { id: 'ca-lineint-2', type: 'single', stem: '第二类曲线积分是？', options: { A: '对坐标的曲线积分', B: '对弧长的曲线积分', C: '对面积的积分', D: '对体积的积分' }, answer: 'A', explanation: '第二类曲线积分 ∫Pdx+Qdy 对坐标积分。' },
    { id: 'ca-lineint-3', type: 'judge', stem: '第一类曲线积分与曲线的方向无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '对弧长积分只与曲线形状有关，与方向无关。' },
    { id: 'ca-lineint-4', type: 'single', stem: '第二类曲线积分与方向的关系是？', options: { A: '反向时积分值变号', B: '与方向无关', C: '方向改变积分值不变', D: '只能沿正向' }, answer: 'A', explanation: '第二类曲线积分有方向性，改变方向积分变号。' },
    { id: 'ca-lineint-5', type: 'judge', stem: '第一类曲线积分的几何/物理意义可以是曲线的质量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若 f 为线密度，∫f ds 即曲线质量。' },
  ]);

  add('calculus:ch6-s3', [
    { id: 'ca-green-2', type: 'single', stem: '格林公式建立了哪两者之间的联系？', options: { A: '平面闭区域上的二重积分与其边界上的第二类曲线积分', B: '曲面积分与三重积分', C: '第一类与第二类曲线积分', D: '定积分与不定积分' }, answer: 'A', explanation: '∮_L Pdx+Qdy = ∬_D (Q_x − P_y)dσ。' },
    { id: 'ca-green-3', type: 'judge', stem: '若 ∂Q/∂x = ∂P/∂y，则曲线积分 ∫Pdx+Qdy 与路径无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '在单连通区域上，该条件等价于曲线积分与路径无关。' },
    { id: 'ca-green-4', type: 'single', stem: '曲线积分与路径无关等价于？', options: { A: '存在势函数（原函数）', B: '被积函数为 0', C: '区域无界', D: '路径为直线' }, answer: 'A', explanation: '路径无关时可定义势函数 u，使 P=u_x、Q=u_y。' },
    { id: 'ca-green-5', type: 'judge', stem: '使用格林公式时，闭曲线通常取正向（逆时针）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '格林公式要求边界曲线取正方向，区域在行进方向左侧。' },
  ]);

  add('calculus:ch6-s4', [
    { id: 'ca-surfint-1', type: 'single', stem: '第一类曲面积分是？', options: { A: '对面积的曲面积分', B: '对坐标的曲面积分', C: '对弧长的积分', D: '对体积的积分' }, answer: 'A', explanation: '第一类曲面积分 ∬f dS 对面积积分。' },
    { id: 'ca-surfint-2', type: 'single', stem: '第二类曲面积分是？', options: { A: '对坐标的曲面积分', B: '对面积的曲面积分', C: '对弧长的积分', D: '对长度的积分' }, answer: 'A', explanation: '第二类曲面积分对坐标积分，与曲面的侧有关。' },
    { id: 'ca-surfint-3', type: 'judge', stem: '第一类曲面积分与曲面的侧（方向）无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '对面积积分只与曲面形状有关。' },
    { id: 'ca-surfint-4', type: 'single', stem: '第二类曲面积分与什么有关？', options: { A: '曲面的侧（方向）', B: '曲面面积', C: '曲线长度', D: '原点位置' }, answer: 'A', explanation: '改变曲面的侧，第二类曲面积分变号。' },
    { id: 'ca-surfint-5', type: 'judge', stem: '第一类曲面积分可表示曲面薄片的质量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '若 f 为面密度，∬f dS 即曲面质量。' },
  ]);

  add('calculus:ch6-s5', [
    { id: 'ca-gauss-1', type: 'single', stem: '高斯公式建立了哪两者之间的联系？', options: { A: '闭曲面上的曲面积分与所围区域上的三重积分', B: '曲线积分与二重积分', C: '第一类与第二类曲线积分', D: '定积分与不定积分' }, answer: 'A', explanation: '高斯公式把闭曲面上的通量与三重积分联系起来。' },
    { id: 'ca-gauss-2', type: 'single', stem: '斯托克斯公式建立了哪两者之间的联系？', options: { A: '空间闭曲线上的曲线积分与所张曲面上的曲面积分', B: '三重积分与二重积分', C: '定积分与不定积分', D: '级数与积分' }, answer: 'A', explanation: '斯托克斯公式是格林公式在空间中的推广。' },
    { id: 'ca-gauss-3', type: 'judge', stem: '使用高斯公式时，闭曲面通常取外侧。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '高斯公式要求闭曲面取外侧（法向量指向区域外部）。' },
    { id: 'ca-gauss-4', type: 'single', stem: '斯托克斯公式与格林公式的关系是？', options: { A: '斯托克斯是格林公式在空间中的推广', B: '两者无关', C: '格林是斯托克斯的特例的反面', D: '完全等价' }, answer: 'A', explanation: '格林公式处理平面情形，斯托克斯处理空间情形。' },
    { id: 'ca-gauss-5', type: 'judge', stem: '散度对应高斯公式，旋度对应斯托克斯公式。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '高斯公式的向量形式用散度，斯托克斯用旋度。' },
  ]);

  add('calculus:ch6-s6', [
    { id: 'ca-field-1', type: 'single', stem: '向量场的散度 div F 表示？', options: { A: '场中某点的源强度', B: '场的旋转程度', C: '场的模', D: '场的积分' }, answer: 'A', explanation: '散度刻画向量场在某点发散（源）或汇聚（汇）的程度。' },
    { id: 'ca-field-2', type: 'single', stem: '向量场的旋度 rot F 表示？', options: { A: '场中某点的旋转程度', B: '场的源强度', C: '场的模', D: '场的梯度' }, answer: 'A', explanation: '旋度刻画向量场在某点的旋转趋势。' },
    { id: 'ca-field-3', type: 'judge', stem: '无旋场（旋度为 0）一定是梯度场（保守场）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '在单连通区域上，旋度为 0 等价于存在势函数。' },
    { id: 'ca-field-4', type: 'single', stem: '向量场中的无源场是指什么？', options: { A: '散度处处为 0 的向量场', B: '旋度为 0 的场', C: '模为 0 的场', D: '梯度为 0 的场' }, answer: 'A', explanation: '无源场（管形场）散度为 0，如磁场。' },
    { id: 'ca-field-5', type: 'judge', stem: '保守场中的曲线积分与路径无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '保守场存在势函数，曲线积分只与起终点有关。' },
  ]);

  add('calculus:ch7-s1', [
    { id: 'ca-series-2', type: 'single', stem: '级数收敛的定义是？', options: { A: '部分和数列收敛', B: '通项趋于 0', C: '通项有界', D: '项数为有限' }, answer: 'A', explanation: '级数收敛当且仅当其部分和数列有有限极限。' },
    { id: 'ca-series-3', type: 'single', stem: '收敛级数的通项一定满足？', options: { A: '趋于 0', B: '趋于无穷', C: '为常数', D: '递增' }, answer: 'A', explanation: '收敛级数的通项必趋于 0（反之不成立）。' },
    { id: 'ca-series-4', type: 'judge', stem: '若级数的通项不趋于 0，则级数发散。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是级数发散的充分条件（通项判别法）。' },
    { id: 'ca-series-5', type: 'single', stem: '关于收敛级数的运算，下列正确的是？', options: { A: '两个收敛级数可逐项相加', B: '收敛级数任意重排都收敛', C: '收敛级数去掉括号仍收敛', D: '收敛级数通项可不为 0' }, answer: 'A', explanation: '收敛级数满足线性运算；重排只对绝对收敛级数保证。' },
    { id: 'ca-series-6', type: 'judge', stem: '收敛级数任意加括号后仍然收敛。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '加括号不改变部分和的极限，故收敛性保持。' },
  ]);

  add('calculus:ch7-s2', [
    { id: 'ca-posseries-2', type: 'single', stem: '判断正项级数收敛常用的判别法有？', options: { A: '比较判别法、比值判别法、根值判别法', B: '洛必达法则', C: '中值定理', D: '格林公式' }, answer: 'A', explanation: '正项级数有多种判别法，比值/根值法最为常用。' },
    { id: 'ca-posseries-3', type: 'judge', stem: '正项级数收敛的充要条件是其部分和数列有界。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '正项级数部分和单调递增，故收敛 ⇔ 有界。' },
    { id: 'ca-posseries-4', type: 'single', stem: '用比值判别法时，若极限 ρ < 1，则级数？', options: { A: '收敛', B: '发散', C: '不确定', D: '为 0' }, answer: 'A', explanation: 'ρ<1 收敛，ρ>1 发散，ρ=1 失效需另判。' },
    { id: 'ca-posseries-5', type: 'judge', stem: 'p 级数 Σ1/nᵖ 当 p>1 时收敛，p≤1 时发散。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是判断其他级数收敛性的重要参照。' },
  ]);

  add('calculus:ch7-s3', [
    { id: 'ca-alt-2', type: 'single', stem: '判断交错级数收敛常用？', options: { A: '莱布尼茨判别法', B: '比较判别法', C: '比值判别法', D: '根值判别法' }, answer: 'A', explanation: '若交错级数各项绝对值单调递减且趋于 0，则收敛。' },
    { id: 'ca-alt-3', type: 'judge', stem: '绝对收敛的级数一定收敛。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '绝对收敛 ⇒ 收敛，反之不成立。' },
    { id: 'ca-alt-4', type: 'single', stem: '级数的条件收敛是指什么？', options: { A: '级数收敛但取绝对值后发散', B: '级数发散', C: '级数绝对收敛', D: '级数为正项' }, answer: 'A', explanation: '条件收敛的级数本身收敛，但不绝对收敛。' },
    { id: 'ca-alt-5', type: 'judge', stem: '绝对收敛的级数可以任意重排而不改变其和。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '绝对收敛级数具有可交换性；条件收敛级数重排可能改变和。' },
  ]);

  add('calculus:ch7-s4', [
    { id: 'ca-series-7', type: 'single', stem: '幂级数 Σaₙxⁿ 的收敛半径 R 的求法之一是？', options: { A: 'R = lim|aₙ/aₙ₊₁|', B: 'R = lim|aₙ|', C: 'R = Σaₙ', D: 'R = 0' }, answer: 'A', explanation: '由比值判别法可得 R=lim|aₙ/aₙ₊₁|（或 R=1/lim ⁿ√|aₙ|）。' },
    { id: 'ca-series-8', type: 'judge', stem: '幂级数在其收敛区间内绝对收敛。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '收敛区间内部幂级数绝对收敛。' },
    { id: 'ca-series-9', type: 'single', stem: '求幂级数收敛域时，端点需要？', options: { A: '单独判断敛散性', B: '直接包含', C: '直接排除', D: '取平均值' }, answer: 'A', explanation: '收敛半径只确定开区间，端点要代入原级数单独判断。' },
    { id: 'ca-series-10', type: 'judge', stem: '幂级数逐项求导或逐项积分后，收敛半径不变。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '逐项求导/积分保持收敛半径，但端点敛散性可能改变。' },
  ]);

  add('calculus:ch7-s5', [
    { id: 'ca-taylor-1', type: 'single', stem: '函数的泰勒级数是？', options: { A: '以泰勒公式为基础的幂级数展开', B: '傅里叶展开', C: '洛朗展开', D: '数值近似' }, answer: 'A', explanation: '泰勒级数把函数在某点附近展开为幂级数。' },
    { id: 'ca-taylor-2', type: 'single', stem: '麦克劳林级数是泰勒级数在何处展开的特例？', options: { A: 'x₀ = 0', B: 'x₀ = 1', C: 'x₀ = ∞', D: 'x₀ = −1' }, answer: 'A', explanation: '麦克劳林级数是 x₀=0 处的泰勒级数。' },
    { id: 'ca-taylor-3', type: 'judge', stem: 'eˣ、sinx、1/(1−x) 等有常用的幂级数展开式。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这些展开式是解题与近似计算的基础。' },
    { id: 'ca-taylor-4', type: 'single', stem: '函数的幂级数展开在收敛区间内是？', options: { A: '唯一的', B: '不唯一', C: '不存在的', D: '随机变化的' }, answer: 'A', explanation: '同一函数在一点的幂级数展开唯一，其系数由各阶导数确定。' },
    { id: 'ca-taylor-5', type: 'judge', stem: '幂级数展开可用于函数的近似计算。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '取有限项即可近似函数值，如近似计算 sinx、eˣ。' },
  ]);

  add('calculus:ch7-s6', [
    { id: 'ca-fourier-1', type: 'single', stem: '傅里叶级数是把周期函数展开为？', options: { A: '三角函数（正弦、余弦）的级数', B: '幂级数', C: '指数级数', D: '对数级数' }, answer: 'A', explanation: '傅里叶级数用正弦、余弦函数表示周期函数。' },
    { id: 'ca-fourier-2', type: 'single', stem: '傅里叶系数 aₙ、bₙ 通过什么计算？', options: { A: '对函数与三角函数乘积在一个周期上积分', B: '求导', C: '求极限', D: '解方程' }, answer: 'A', explanation: '利用三角函数的正交性，通过积分求出各系数。' },
    { id: 'ca-fourier-3', type: 'judge', stem: '狄利克雷收敛定理给出了傅里叶级数收敛的条件。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '函数分段单调且只有有限个间断点时，傅里叶级数收敛。' },
    { id: 'ca-fourier-4', type: 'single', stem: '奇函数和偶函数的傅里叶展开分别是？', options: { A: '奇函数展开为正弦级数，偶函数展开为余弦级数', B: '都为正弦级数', C: '都为余弦级数', D: '都含正余弦项' }, answer: 'A', explanation: '利用奇偶性可使一部分傅里叶系数为 0。' },
    { id: 'ca-fourier-5', type: 'judge', stem: '在间断点处，傅里叶级数收敛于左右极限的平均值。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是狄利克雷定理的结论。' },
  ]);

  add('calculus:ch8-s1', [
    { id: 'ca-ode-2', type: 'single', stem: '微分方程是指什么样的方程？', options: { A: '含有未知函数及其导数的方程', B: '只含常数的方程', C: '线性方程组', D: '不等式' }, answer: 'A', explanation: '微分方程把未知函数与它的导数联系起来。' },
    { id: 'ca-ode-3', type: 'single', stem: '微分方程的阶数由什么决定？', options: { A: '方程中未知函数最高阶导数的阶数', B: '未知数的个数', C: '方程的项数', D: '系数的大小' }, answer: 'A', explanation: '阶数等于最高阶导数的阶数。' },
    { id: 'ca-ode-4', type: 'judge', stem: 'n 阶微分方程的通解中含有 n 个独立的任意常数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '通解含与阶数相同个数的独立任意常数。' },
    { id: 'ca-ode-5', type: 'single', stem: '由初始条件确定通解中的任意常数后得到的是？', options: { A: '特解', B: '通解', C: '齐次解', D: '隐式解' }, answer: 'A', explanation: '代入初始条件确定常数即得满足条件的特解。' },
    { id: 'ca-ode-6', type: 'judge', stem: '微分方程的解分为通解与特解。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '通解含任意常数，特解由初始/边界条件确定。' },
  ]);

  add('calculus:ch8-s2', [
    { id: 'ca-ode-7', type: 'single', stem: '可分离变量方程的形式是？', options: { A: 'dy/dx = f(x)g(y)，可把 x 与 y 分离到两边', B: 'dy/dx = f(x) + g(y)', C: 'dy/dx = f(x)/x', D: 'dy/dx = 0' }, answer: 'A', explanation: '把含 y 的项移到一边、含 x 的项移到另一边再积分。' },
    { id: 'ca-ode-8', type: 'judge', stem: '一阶线性微分方程可通过乘以积分因子求解。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '积分因子 e^∫Pdx 使左边成为全微分，再积分求通解。' },
    { id: 'ca-ode-9', type: 'single', stem: '对于齐次方程 dy/dx = φ(y/x)，常用什么代换？', options: { A: 'u = y/x', B: 'u = xy', C: 'u = x+y', D: 'u = x−y' }, answer: 'A', explanation: '令 u=y/x，可把齐次方程化为可分离变量方程。' },
    { id: 'ca-ode-10', type: 'judge', stem: '伯努利方程可以通过变量代换化为一阶线性方程。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '伯努利方程 y′+P(x)y=Q(x)yⁿ 令 z=y^{1−n} 后化为线性方程。' },
  ]);

  add('calculus:ch8-s3', [
    { id: 'ca-reduce-1', type: 'single', stem: '方程 y″ = f(x) 的解法是？', options: { A: '连续积分两次', B: '令 p=y′ 降阶', C: '用洛必达法则', D: '用格林公式' }, answer: 'A', explanation: '右端只含 x，直接对 x 积分两次即可。' },
    { id: 'ca-reduce-2', type: 'single', stem: '方程 y″ = f(x, y′) 的降阶方法是？', options: { A: '令 p = y′，则 y″ = p′，化为关于 p 的一阶方程', B: '令 p = y', C: '直接积分', D: '用特征方程' }, answer: 'A', explanation: '不显含 y 的方程令 p=y′ 降为一阶。' },
    { id: 'ca-reduce-3', type: 'judge', stem: '方程 y″ = f(y, y′) 可令 p = y′，并把 y″ 写成 p·dp/dy。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不显含 x 的方程用 p=y′、y″=p dp/dy 降阶。' },
    { id: 'ca-reduce-4', type: 'single', stem: '求解高阶微分方程时降阶法的目的是？', options: { A: '把高阶方程化为低阶方程求解', B: '增加阶数', C: '求导数', D: '判断收敛' }, answer: 'A', explanation: '通过代换降低方程阶数，便于求解。' },
    { id: 'ca-reduce-5', type: 'judge', stem: '不显含 x 或不显含 y 的二阶方程通常可以降阶。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这两类方程有标准的降阶代换方法。' },
  ]);

  add('calculus:ch8-s4', [
    { id: 'ca-linst-1', type: 'single', stem: '二阶线性齐次方程的通解是？', options: { A: '两个线性无关特解的线性组合', B: '任意两个特解之和', C: '一个特解', D: '常数解' }, answer: 'A', explanation: '通解为 C₁y₁+C₂y₂，其中 y₁、y₂ 线性无关。' },
    { id: 'ca-linst-2', type: 'single', stem: '非齐次线性方程的通解结构是？', options: { A: '特解 + 对应齐次方程的通解', B: '只有特解', C: '只有齐次通解', D: '两个特解之积' }, answer: 'A', explanation: '非齐次通解 = 一个特解 + 齐次通解。' },
    { id: 'ca-linst-3', type: 'judge', stem: '齐次线性方程的解构成一个向量空间。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '齐次解对加法与数乘封闭，构成解空间。' },
    { id: 'ca-linst-4', type: 'single', stem: '非齐次线性方程的叠加原理指出什么？', options: { A: '非齐次方程多个特解可相加（对应多个非齐次项）', B: '齐次解只有一个', C: '特解唯一', D: '通解不含常数' }, answer: 'A', explanation: '若 f=Σfᵢ，则可分别求各 fᵢ 的特解再相加。' },
    { id: 'ca-linst-5', type: 'judge', stem: '非齐次方程的特解可以叠加。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '对应不同非齐次项的特解之和是总方程的特解。' },
  ]);

  add('calculus:ch8-s5', [
    { id: 'ca-ode2-2', type: 'single', stem: '求解二阶常系数齐次方程的关键是？', options: { A: '写出并求解特征方程 r²+pr+q=0', B: '直接积分两次', C: '用洛必达法则', D: '用格林公式' }, answer: 'A', explanation: '由特征根的情况写出相应形式的通解。' },
    { id: 'ca-ode2-3', type: 'judge', stem: '特征根为两相异实根、重根、共轭复根时，通解形式不同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '三种情形分别对应不同的通解表达式。' },
    { id: 'ca-ode2-4', type: 'single', stem: '求二阶常系数非齐次方程特解常用？', options: { A: '待定系数法', B: '变量代换法', C: '降阶法', D: '分离变量法' }, answer: 'A', explanation: '根据非齐次项形式设特解，代入定系数。' },
    { id: 'ca-ode2-5', type: 'judge', stem: '当特征方程有重根 r 时，通解中含有 x·e^{rx} 形式的项。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '重根情形通解为 (C₁+C₂x)e^{rx}。' },
  ]);

  add('calculus:ch8-s6', [
    { id: 'ca-odeapp-1', type: 'single', stem: '用微分方程解决实际问题的第一步通常是？', options: { A: '根据变化率关系建立微分方程', B: '直接求导', C: '直接积分', D: '查表' }, answer: 'A', explanation: '把实际问题中的变化规律翻译成微分方程。' },
    { id: 'ca-odeapp-2', type: 'single', stem: '人口增长模型（Malthus 模型）的微分方程是？', options: { A: 'dP/dt = kP', B: 'dP/dt = k', C: 'dP/dt = k/P', D: 'dP/dt = 0' }, answer: 'A', explanation: '增长率与当前人口成正比，解得指数增长。' },
    { id: 'ca-odeapp-3', type: 'judge', stem: '牛顿冷却定律可用微分方程描述温度随时间的变化。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '冷却速率与物体和环境温差成正比。' },
    { id: 'ca-odeapp-4', type: 'single', stem: '一阶线性微分方程常用于哪类实际问题？', options: { A: '混合问题（如溶液浓度变化）', B: '求面积', C: '判断收敛', D: '求曲率' }, answer: 'A', explanation: '混合问题中物质变化率可建立一阶线性方程。' },
    { id: 'ca-odeapp-5', type: 'judge', stem: '微分方程应用通常需结合初始条件求出特解。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '初始条件确定通解中的常数，得到符合实际的特解。' },
  ]);

  /* == MORE == */
})(window);
