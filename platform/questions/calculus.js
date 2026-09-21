/* 知序 · 高等数学自测题库（原创“真题风格”题，覆盖全部 8 章） */
(function (global) {
  'use strict';
  Object.assign(global.ZhixuQuestions = global.ZhixuQuestions || {}, {
    'calculus:ch1-s3': [
      { id: 'ca-lim-1', type: 'judge', stem: '函数 f(x) 在 x₀ 处极限存在的充要条件是左右极限都存在且相等。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是极限存在的充要条件：lim f(x)=A ⇔ 左极限 = 右极限 = A。' },
    ],
    'calculus:ch1-s4': [
      { id: 'ca-lim-2', type: 'single', stem: '极限 lim(x→0) (sin x)/x 的值是？', options: { A: '1', B: '0', C: '∞', D: '不存在' }, answer: 'A', explanation: '这是第一个重要极限 lim(x→0) sinx/x = 1，可用夹逼准则或等价无穷小证明。' },
    ],
    'calculus:ch1-s5': [
      { id: 'ca-cont-1', type: 'judge', stem: '函数在某点可导，则它在该点一定连续；但连续不一定可导。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '可导 ⇒ 连续，反之不成立，例如 y=|x| 在 x=0 处连续但不可导。' },
    ],
    'calculus:ch2-s1': [
      { id: 'ca-deriv-1', type: 'single', stem: '函数 f(x) 在 x₀ 处导数的定义是？', options: { A: 'lim(Δx→0) [f(x₀+Δx)−f(x₀)]/Δx', B: 'f(x₀)', C: 'lim(Δx→0) [f(x₀+Δx)+f(x₀)]', D: 'f(x₀+Δx)−f(x₀)' }, answer: 'A', explanation: '导数是函数增量与自变量增量之比的极限，即平均变化率的极限。' },
    ],
    'calculus:ch2-s3': [
      { id: 'ca-mvt-1', type: 'single', stem: '拉格朗日中值定理成立需要函数 f(x) 在闭区间 [a,b] 上满足什么条件？', options: { A: '连续且在开区间 (a,b) 内可导', B: '仅在 (a,b) 内连续', C: '仅在端点连续', D: '二阶可导' }, answer: 'A', explanation: '拉格朗日中值定理要求 f 在 [a,b] 连续、在 (a,b) 可导，则存在 ξ 使 f′(ξ)=(f(b)−f(a))/(b−a)。' },
      { id: 'ca-mvt-2', type: 'single', stem: '罗尔定理比拉格朗日中值定理多出的条件是？', options: { A: 'f(a) = f(b)', B: 'f′(x) > 0', C: 'f 二阶可导', D: '区间长度为 1' }, answer: 'A', explanation: '罗尔定理要求端点函数值相等 f(a)=f(b)，结论是存在 ξ 使 f′(ξ)=0。' },
    ],
    'calculus:ch2-s4': [
      { id: 'ca-lhop-1', type: 'judge', stem: '洛必达法则只能用于 0/0 型或 ∞/∞ 型未定式，且若求导后的极限不存在（也非无穷），不能据此断定原极限不存在。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '洛必达法则有适用条件；当 lim f′/g′ 不存在时法则失效，不能说明原极限不存在。' },
    ],
    'calculus:ch2-s5': [
      { id: 'ca-extrema-1', type: 'single', stem: '关于函数极值，下列说法正确的是？', options: { A: '可导极值点一定是驻点，但极值点也可能出现在不可导点', B: '驻点一定是极值点', C: '极值点一定是可导点', D: '极大值一定大于极小值' }, answer: 'A', explanation: '费马引理给出可导极值点处导数为 0；但驻点不一定是极值点，极值也可能在不可导点取到。' },
    ],
    'calculus:ch3-s2': [
      { id: 'ca-defint-1', type: 'single', stem: '定积分 ∫ₐᵃ f(x)dx 的值是？', options: { A: '0', B: 'f(a)', C: '2f(a)', D: '不存在' }, answer: 'A', explanation: '积分上限等于下限时定积分为 0。' },
    ],
    'calculus:ch3-s3': [
      { id: 'ca-varlim-1', type: 'single', stem: '设 F(x)=∫ₐˣ f(t)dt，其中 f 连续，则 F′(x) 等于？', options: { A: 'f(x)', B: 'f′(x)', C: 'F(x)', D: '0' }, answer: 'A', explanation: '变限积分求导定理：对连续函数 f，F′(x)=f(x)。' },
    ],
    'calculus:ch3-s4': [
      { id: 'ca-int-1', type: 'single', stem: '∫ x·eˣ dx 的结果是？', options: { A: '(x−1)eˣ + C', B: '(x+1)eˣ + C', C: 'x²eˣ/2 + C', D: 'x eˣ + C' }, answer: 'A', explanation: '分部积分：∫x eˣdx = x eˣ − ∫eˣdx = x eˣ − eˣ + C = (x−1)eˣ + C。' },
      { id: 'ca-int-2', type: 'single', stem: '定积分 ∫₀¹ x² dx 的值是？', options: { A: '1/3', B: '1/2', C: '1', D: '2/3' }, answer: 'A', explanation: '原函数为 x³/3，代入上下限得 1/3 − 0 = 1/3。' },
    ],
    'calculus:ch3-s5': [
      { id: 'ca-improp-1', type: 'single', stem: '反常积分 ∫₁^∞ (1/xᵖ) dx 收敛的充要条件是？', options: { A: 'p > 1', B: 'p ≥ 1', C: 'p < 1', D: 'p ≤ 1' }, answer: 'A', explanation: 'p 积分在无穷区间上 p>1 时收敛、p≤1 时发散。' },
    ],
    'calculus:ch4-s2': [
      { id: 'ca-vector-1', type: 'single', stem: '两个非零向量垂直的充要条件是？', options: { A: '数量积为 0', B: '向量积为零向量', C: '模相等', D: '方向相同' }, answer: 'A', explanation: 'a·b = |a||b|cosθ，垂直时 cosθ=0 故数量积为 0；向量积为零向量表示两向量平行。' },
    ],
    'calculus:ch4-s3': [
      { id: 'ca-plane-1', type: 'single', stem: '过点 M₀ 且以非零向量 n 为法向量的平面方程是？', options: { A: 'n·(r − r₀) = 0（点法式）', B: 'n × (r − r₀) = 0', C: 'n·r = 0', D: 'r − r₀ = 0' }, answer: 'A', explanation: '平面点法式：法向量与平面上任一点到 M₀ 的向量垂直，即 n·(r−r₀)=0。' },
    ],
    'calculus:ch5-s2': [
      { id: 'ca-partial-1', type: 'judge', stem: '函数在某点可微，则它在该点的偏导数一定存在；反之不一定成立。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '可微 ⇒ 偏导存在，但偏导存在不保证可微；偏导数连续是可微的充分条件。' },
    ],
    'calculus:ch5-s4': [
      { id: 'ca-grad-1', type: 'single', stem: '函数在某点的梯度方向是？', options: { A: '方向导数最大的方向', B: '方向导数最小的方向', C: '函数值为 0 的方向', D: '任意方向' }, answer: 'A', explanation: '梯度方向是函数增长最快的方向，其模等于最大方向导数。' },
    ],
    'calculus:ch5-s6': [
      { id: 'ca-lagrange-1', type: 'single', stem: '求多元函数在约束条件下的极值，常用方法是？', options: { A: '拉格朗日乘数法', B: '洛必达法则', C: '分部积分法', D: '夹逼准则' }, answer: 'A', explanation: '构造拉格朗日函数 L = f + λφ，令各偏导为 0，解出驻点再判断。' },
    ],
    'calculus:ch6-s1': [
      { id: 'ca-double-1', type: 'single', stem: '计算二重积分的基本思路通常是？', options: { A: '化为累次积分（先对一个变量积分）', B: '直接求原函数', C: '用洛必达法则', D: '用夹逼准则' }, answer: 'A', explanation: '根据积分区域选择直角坐标或极坐标，把二重积分化为两次定积分（累次积分）计算。' },
    ],
    'calculus:ch6-s3': [
      { id: 'ca-green-1', type: 'single', stem: '格林公式建立了哪两者之间的联系？', options: { A: '平面闭区域上的二重积分与其边界上的第二类曲线积分', B: '曲面积分与三重积分', C: '第一类与第二类曲线积分', D: '定积分与不定积分' }, answer: 'A', explanation: '格林公式 ∮_L Pdx+Qdy = ∬_D (∂Q/∂x−∂P/∂y)dσ；当 ∂Q/∂x=∂P/∂y 时曲线积分与路径无关。' },
    ],
    'calculus:ch7-s2': [
      { id: 'ca-posseries-1', type: 'single', stem: 'p 级数 Σ 1/nᵖ 收敛的充要条件是？', options: { A: 'p > 1', B: 'p < 1', C: 'p ≥ 1', D: 'p = 1' }, answer: 'A', explanation: 'p 级数 p>1 收敛、p≤1 发散；p=1 时是发散的调和级数。' },
    ],
    'calculus:ch7-s3': [
      { id: 'ca-alt-1', type: 'single', stem: '判断交错级数收敛常用的判别法是？', options: { A: '莱布尼茨判别法', B: '比较判别法', C: '比值判别法', D: '根值判别法' }, answer: 'A', explanation: '若交错级数各项绝对值单调递减且趋于 0，则收敛（莱布尼茨判别法）。' },
    ],
    'calculus:ch7-s4': [
      { id: 'ca-series-1', type: 'single', stem: '幂级数 Σ aₙxⁿ 的收敛半径 R 可由下列哪个极限求得（当极限存在时）？', options: { A: 'R = lim |aₙ / aₙ₊₁|', B: 'R = lim |aₙ₊₁ / aₙ|', C: 'R = lim |aₙ|', D: 'R = lim n·aₙ' }, answer: 'A', explanation: '由比值判别法，R = lim |aₙ/aₙ₊₁|（或 R = 1/lim ⁿ√|aₙ|），收敛区间内级数绝对收敛。' },
    ],
    'calculus:ch8-s2': [
      { id: 'ca-ode-1', type: 'single', stem: '形如 y′ + P(x)y = Q(x) 的一阶线性微分方程，其通解公式中的积分因子是？', options: { A: 'e^∫P(x)dx', B: 'e^∫Q(x)dx', C: 'P(x)Q(x)', D: '1/P(x)' }, answer: 'A', explanation: '两边同乘积分因子 e^∫P(x)dx 后，左边可写成 (y·e^∫Pdx)′，再积分即得通解。' },
    ],
    'calculus:ch8-s5': [
      { id: 'ca-ode2-1', type: 'single', stem: '求解二阶常系数齐次线性方程 y″+py′+qy=0 时，关键是解？', options: { A: '特征方程 r²+pr+q=0', B: '一次方程 y′+py=0', C: '不等式 r²>0', D: '方程组 y″=0' }, answer: 'A', explanation: '设 y=e^{rx} 得特征方程 r²+pr+q=0，按两相异实根、重根、共轭复根三种情况写通解。' },
    ],
  });
})(window);
