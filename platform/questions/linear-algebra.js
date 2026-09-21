/* 知序 · 线性代数自测题库（原创“真题风格”题，覆盖全部 6 章） */
(function (global) {
  'use strict';
  Object.assign(global.ZhixuQuestions = global.ZhixuQuestions || {}, {
    'linear-algebra:ch1-s1': [
      { id: 'la-det-1', type: 'single', stem: '交换行列式的两行，行列式的值会？', options: { A: '变号', B: '不变', C: '变为 0', D: '变为原来的 2 倍' }, answer: 'A', explanation: '行列式交换两行（列）要变号，这是行列式的基本性质之一。' },
    ],
    'linear-algebra:ch1-s2': [
      { id: 'la-det-2', type: 'single', stem: '上三角行列式的值等于？', options: { A: '主对角线元素的乘积', B: '副对角线元素之和', C: '所有元素之和', D: '1' }, answer: 'A', explanation: '三角行列式等于主对角线上元素的乘积，常用于化简计算。' },
    ],
    'linear-algebra:ch2-s1': [
      { id: 'la-trans-1', type: 'single', stem: '矩阵乘积的转置满足 (AB)ᵀ 等于？', options: { A: 'BᵀAᵀ', B: 'AᵀBᵀ', C: 'AB', D: '(BA)ᵀ 且一定等于 AᵀBᵀ' }, answer: 'A', explanation: '转置要反序：(AB)ᵀ = BᵀAᵀ。' },
    ],
    'linear-algebra:ch2-s2': [
      { id: 'la-inv-1', type: 'single', stem: '若 A、B 均为 n 阶可逆矩阵，则 (AB)⁻¹ 等于？', options: { A: 'B⁻¹A⁻¹', B: 'A⁻¹B⁻¹', C: 'AB', D: '(BA)⁻¹ 且一定等于 A⁻¹B⁻¹' }, answer: 'A', explanation: '矩阵乘积求逆要反序：(AB)⁻¹ = B⁻¹A⁻¹。' },
      { id: 'la-inv-2', type: 'judge', stem: 'n 阶方阵 A 可逆的充要条件是 |A| ≠ 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'A 可逆 ⇔ |A|≠0 ⇔ r(A)=n ⇔ 齐次方程组 Ax=0 只有零解。' },
    ],
    'linear-algebra:ch2-s3': [
      { id: 'la-rank-1', type: 'judge', stem: '对矩阵做初等行变换不改变矩阵的秩。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '初等变换对应左乘可逆矩阵，不改变行空间维数，因此秩不变。' },
      { id: 'la-rank-2', type: 'single', stem: '关于矩阵乘积的秩，下列关系正确的是？', options: { A: 'r(AB) ≤ min{r(A), r(B)}', B: 'r(AB) = r(A) + r(B)', C: 'r(AB) ≥ max{r(A), r(B)}', D: 'r(AB) 一定等于 r(A)' }, answer: 'A', explanation: '乘积的秩不超过任一因子的秩，即 r(AB) ≤ min{r(A),r(B)}。' },
    ],
    'linear-algebra:ch2-s4': [
      { id: 'la-block-1', type: 'single', stem: '分块对角矩阵 diag(A₁,A₂,…,Aₛ) 可逆的条件是？', options: { A: '每个对角块 Aᵢ 都可逆', B: '只有 A₁ 可逆', C: '所有块行列式之和不为 0', D: '矩阵为方阵即可' }, answer: 'A', explanation: '分块对角矩阵可逆当且仅当每个对角块可逆，其逆为 diag(A₁⁻¹,…,Aₛ⁻¹)。' },
    ],
    'linear-algebra:ch3-s1': [
      { id: 'la-combo-1', type: 'single', stem: '若向量 β 能由向量组 α₁,…,αₛ 线性表示，则？', options: { A: '方程组 x₁α₁+…+xₛαₛ=β 有解', B: 'β 一定为零向量', C: 'αᵢ 之间一定线性无关', D: 'β 与 αᵢ 一定正交' }, answer: 'A', explanation: '线性表示等价于相应的非齐次线性方程组有解。' },
    ],
    'linear-algebra:ch3-s2': [
      { id: 'la-indep-1', type: 'single', stem: '下列向量组一定线性相关的是？', options: { A: '含有零向量的向量组', B: '单位向量组', C: '任意两个不成比例的向量', D: 'n 个 n 维线性无关向量' }, answer: 'A', explanation: '含零向量时取零向量系数非零即可线性表出 0，故线性相关。' },
      { id: 'la-indep-2', type: 'judge', stem: 'n+1 个 n 维向量一定线性相关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '向量个数超过维数时必线性相关，因为矩阵的秩不超过 n。' },
    ],
    'linear-algebra:ch3-s3': [
      { id: 'la-maxindep-1', type: 'single', stem: '向量组的极大线性无关组所含向量的个数等于？', options: { A: '该向量组的秩', B: '向量总数', C: '向量维数', D: '1' }, answer: 'A', explanation: '极大无关组所含向量个数就是向量组的秩，且任一极大无关组含向量个数相同。' },
    ],
    'linear-algebra:ch3-s5': [
      { id: 'la-orth-1', type: 'single', stem: '把一组线性无关向量化为标准正交组的常用方法是？', options: { A: '施密特（Schmidt）正交化', B: '克拉默法则', C: '初等行变换', D: '洛必达法则' }, answer: 'A', explanation: '施密特正交化先逐次减去在已有正交向量上的投影，再单位化得到标准正交组。' },
    ],
    'linear-algebra:ch4-s1': [
      { id: 'la-cramer-1', type: 'single', stem: '克拉默法则适用于怎样的线性方程组？', options: { A: '方程个数等于未知数个数且系数行列式不为 0', B: '任意线性方程组', C: '只有齐次方程组', D: '方程个数少于未知数个数' }, answer: 'A', explanation: '克拉默法则要求系数矩阵为方阵且 |A|≠0，此时方程组有唯一解 xᵢ=|Aᵢ|/|A|。' },
    ],
    'linear-algebra:ch4-s2': [
      { id: 'la-homo-1', type: 'single', stem: 'n 元齐次线性方程组 Ax=0 有非零解的充要条件是？', options: { A: 'r(A) < n', B: 'r(A) = n', C: '|A| ≠ 0', D: 'r(A) > n' }, answer: 'A', explanation: '齐次方程组有非零解 ⇔ 系数矩阵的秩小于未知数个数 n（存在自由变量）。' },
    ],
    'linear-algebra:ch4-s3': [
      { id: 'la-nonhomo-1', type: 'single', stem: '非齐次线性方程组 Ax=b 有解的充要条件是？', options: { A: 'r(A) = r(A|b)', B: 'r(A) = n', C: '|A| ≠ 0', D: 'b = 0' }, answer: 'A', explanation: '有解 ⇔ 系数矩阵的秩等于增广矩阵的秩；当等于未知数个数时解唯一，否则有无穷多解。' },
    ],
    'linear-algebra:ch5-s1': [
      { id: 'la-eig-1', type: 'single', stem: '关于 n 阶矩阵 A 的特征值，下列说法正确的是？', options: { A: '全部特征值之和等于 A 的迹，之积等于 |A|', B: '特征值之和等于 |A|', C: '特征值一定都是实数', D: '特征值之积等于迹' }, answer: 'A', explanation: '由特征多项式，Σλᵢ = tr(A)，Πλᵢ = |A|；实矩阵的特征值可能是复数。' },
    ],
    'linear-algebra:ch5-s2': [
      { id: 'la-diag-1', type: 'single', stem: 'n 阶矩阵 A 可相似对角化的充要条件是？', options: { A: 'A 有 n 个线性无关的特征向量', B: 'A 有 n 个互不相同的特征值', C: 'A 是对称矩阵', D: '|A| ≠ 0' }, answer: 'A', explanation: '可对角化 ⇔ 存在 n 个线性无关特征向量；n 个互异特征值只是充分条件。' },
    ],
    'linear-algebra:ch5-s3': [
      { id: 'la-sym-1', type: 'judge', stem: '实对称矩阵属于不同特征值的特征向量一定相互正交。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '实对称矩阵必可正交对角化，不同特征值对应的特征向量相互正交。' },
    ],
    'linear-algebra:ch6-s1': [
      { id: 'la-quad-1', type: 'single', stem: '二次型 f(x)=xᵀAx 中，矩阵 A 通常取为？', options: { A: '对称矩阵', B: '对角矩阵', C: '上三角矩阵', D: '任意矩阵' }, answer: 'A', explanation: '二次型总可写成 xᵀAx 且取 A 为对称矩阵，此时 A 唯一确定。' },
    ],
    'linear-algebra:ch6-s3': [
      { id: 'la-pd-1', type: 'judge', stem: '实对称矩阵 A 正定的充要条件是 A 的各阶顺序主子式都大于 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是正定的顺序主子式判别法，适用于实对称矩阵。' },
      { id: 'la-pd-2', type: 'single', stem: '实对称矩阵 A 正定的另一个等价条件是？', options: { A: 'A 的特征值全为正', B: 'A 的特征值全为负', C: '|A| < 0', D: 'r(A) < n' }, answer: 'A', explanation: '实对称矩阵正定 ⇔ 特征值全正 ⇔ 正惯性指数为 n ⇔ 顺序主子式全正。' },
    ],
  });
})(window);
