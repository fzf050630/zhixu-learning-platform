/* 知序 · 线性代数补充题目（把每个小节补足到 5 题） */
(function (global) {
  'use strict';
  const bank = global.ZhixuQuestions = global.ZhixuQuestions || {};
  const add = (nodeId, questions) => { bank[nodeId] = (bank[nodeId] || []).concat(questions); };

  add('linear-algebra:ch1-s1', [
    { id: 'la-det-3', type: 'single', stem: '若行列式某一行全为 0，则该行列式的值为？', options: { A: '0', B: '1', C: '该行元素之和', D: '不确定' }, answer: 'A', explanation: '按该行展开，各项都含因子 0，故行列式为 0。' },
    { id: 'la-det-4', type: 'judge', stem: '把行列式某一行的 k 倍加到另一行上，行列式的值不变。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是行列式的倍加性质，是化简计算的基础。' },
    { id: 'la-det-5', type: 'single', stem: '行列式与它的转置行列式的关系是？', options: { A: '相等', B: '互为相反数', C: '互为倒数', D: '无关' }, answer: 'A', explanation: '|Aᵀ| = |A|，行列式对行与列的性质对称。' },
    { id: 'la-det-6', type: 'judge', stem: '若行列式中有两行对应成比例，则行列式为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '两行成比例（含相等）时行列式为 0，可用于快速判断。' },
  ]);

  add('linear-algebra:ch1-s2', [
    { id: 'la-det-7', type: 'single', stem: '计算行列式最常用的化简方法是？', options: { A: '利用初等变换化为三角行列式', B: '直接按定义展开所有项', C: '求逆矩阵', D: '解线性方程组' }, answer: 'A', explanation: '用倍加、换行等变换把行列式化为三角形式，再取对角线乘积，最省力。' },
    { id: 'la-det-8', type: 'judge', stem: '利用初等行变换把行列式化为上三角后，其值等于主对角线元素之积。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '注意换行要变号，倍加不变号，最后取对角线乘积。' },
    { id: 'la-det-9', type: 'single', stem: 'n 阶矩阵 A 的数乘行列式 |kA| 等于？', options: { A: 'kⁿ|A|', B: 'k|A|', C: 'kⁿ⁻¹|A|', D: '|A|' }, answer: 'A', explanation: '每一行都提出一个 k，共 n 行，故 |kA| = kⁿ|A|。' },
    { id: 'la-det-10', type: 'judge', stem: '范德蒙德行列式的值等于所有形如 (xⱼ − xᵢ)（i<j）的因子之积。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是范德蒙德行列式的标准结果，常用于证明插值唯一性。' },
  ]);

  add('linear-algebra:ch2-s1', [
    { id: 'la-mat-1', type: 'single', stem: '矩阵乘法一般不满足下列哪条运算律？', options: { A: '交换律', B: '结合律', C: '左分配律', D: '右分配律' }, answer: 'A', explanation: '一般 AB ≠ BA；结合律与分配律成立。' },
    { id: 'la-mat-2', type: 'judge', stem: '矩阵乘法满足结合律 (AB)C = A(BC)。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '在维度相容时矩阵乘法满足结合律，这使分块与幂运算可行。' },
    { id: 'la-mat-3', type: 'single', stem: '关于转置，下列等式正确的是？', options: { A: '(A+B)ᵀ = Aᵀ+Bᵀ', B: '(AB)ᵀ = AᵀBᵀ', C: '(kA)ᵀ = k⁻¹Aᵀ', D: '(A²)ᵀ = (Aᵀ)² 不成立' }, answer: 'A', explanation: '转置对加法分配；(AB)ᵀ=BᵀAᵀ，且 (A²)ᵀ=(Aᵀ)² 成立。' },
    { id: 'la-mat-4', type: 'judge', stem: '由 AB = O 不能推出 A = O 或 B = O。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '存在非零矩阵乘积为零，例如两个非零矩阵相乘得零矩阵。' },
  ]);

  add('linear-algebra:ch2-s2', [
    { id: 'la-inv-3', type: 'single', stem: '当 |A| ≠ 0 时，A 的逆矩阵可用伴随矩阵表示为？', options: { A: 'A⁻¹ = A*/|A|', B: 'A⁻¹ = |A|·A*', C: 'A⁻¹ = A*', D: 'A⁻¹ = |A|/A*' }, answer: 'A', explanation: 'A·A* = |A|E，故 A⁻¹ = A*/|A|。' },
    { id: 'la-inv-4', type: 'judge', stem: '(Aᵀ)⁻¹ = (A⁻¹)ᵀ。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '转置与求逆可交换次序。' },
    { id: 'la-inv-5', type: 'single', stem: '若 A 可逆，则 |A⁻¹| 等于？', options: { A: '1/|A|', B: '|A|', C: '|A|²', D: '−|A|' }, answer: 'A', explanation: '由 |A·A⁻¹|=|E|=1 得 |A⁻¹|=1/|A|。' },
  ]);

  add('linear-algebra:ch2-s3', [
    { id: 'la-rank-3', type: 'single', stem: '用初等矩阵左乘矩阵 A，相当于对 A 做？', options: { A: '相应的初等行变换', B: '相应的初等列变换', C: '转置', D: '求逆' }, answer: 'A', explanation: '左乘初等矩阵对应行变换，右乘对应列变换。' },
    { id: 'la-rank-4', type: 'judge', stem: '初等矩阵都是可逆矩阵。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '初等变换可逆，故初等矩阵可逆，其逆仍是同类型初等矩阵。' },
    { id: 'la-rank-5', type: 'single', stem: '用初等行变换求逆矩阵的做法是？', options: { A: '对 (A|E) 做行变换化为 (E|A⁻¹)', B: '对 (A|E) 做列变换', C: '直接转置', D: '求伴随矩阵即可' }, answer: 'A', explanation: '对增广矩阵 (A|E) 实施初等行变换，A 化为 E 时右侧即为 A⁻¹。' },
  ]);

  add('linear-algebra:ch2-s4', [
    { id: 'la-block-2', type: 'single', stem: '分块矩阵相乘时，要求？', options: { A: '对应分块的维度相容（可乘）', B: '所有分块都是方阵', C: '分块大小相同', D: '分块都是对角阵' }, answer: 'A', explanation: '分块乘法按块进行，需保证对应块的列数与行数匹配。' },
    { id: 'la-block-3', type: 'judge', stem: '分块对角矩阵的行列式等于各对角块行列式之积。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '分块对角（或三角）矩阵的行列式等于各对角块行列式的乘积。' },
    { id: 'la-block-4', type: 'single', stem: '分块上三角矩阵 [[A,C],[O,B]]（A、B 为方阵）的行列式等于？', options: { A: '|A|·|B|', B: '|A|+|B|', C: '|C|', D: '|A·B|·|C|' }, answer: 'A', explanation: '分块三角矩阵行列式等于对角块行列式之积 |A||B|。' },
    { id: 'la-block-5', type: 'judge', stem: '分块矩阵转置时，既要转置每个子块，又要转置子块的位置。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '[[A,B],[C,D]]ᵀ = [[Aᵀ,Cᵀ],[Bᵀ,Dᵀ]]，块位置与块内都要转置。' },
  ]);

  add('linear-algebra:ch3-s1', [
    { id: 'la-combo-2', type: 'single', stem: '两个向量组等价是指？', options: { A: '可以相互线性表示', B: '长度相等', C: '秩相等', D: '包含相同向量' }, answer: 'A', explanation: '向量组等价定义为可互相线性表示，等价组秩相等（反之不成立）。' },
    { id: 'la-combo-3', type: 'judge', stem: '零向量可以由任意向量组线性表示（取系数全为 0）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '系数全取 0 即可表示零向量，这是平凡的线性组合。' },
    { id: 'la-combo-4', type: 'single', stem: '若向量组 B 可由向量组 A 线性表示，则？', options: { A: 'r(B) ≤ r(A)', B: 'r(B) ≥ r(A)', C: 'r(B) = r(A)', D: 'r(B) = 0' }, answer: 'A', explanation: '能被表示的向量组的秩不超过表示它的向量组的秩。' },
    { id: 'la-combo-5', type: 'judge', stem: '两个向量组等价则秩一定相等，但秩相等不一定等价。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '等价 ⇒ 秩相等；秩相等的两个向量组未必能互相表示。' },
  ]);

  add('linear-algebra:ch3-s2', [
    { id: 'la-indep-3', type: 'single', stem: '向量组 α₁,…,αₛ 线性相关的充要条件是？', options: { A: '存在不全为零的系数使 Σkᵢαᵢ = 0', B: '所有系数都为 0', C: '秩等于 s', D: '向量两两正交' }, answer: 'A', explanation: '线性相关即存在非平凡线性组合为零向量。' },
    { id: 'la-indep-4', type: 'judge', stem: '若向量组的一部分线性相关，则整体也线性相关；若整体线性无关，则任一部分也线性无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '相关性可向上传递，无关性可向下传递。' },
    { id: 'la-indep-5', type: 'single', stem: '向量组线性无关等价于？', options: { A: '其秩等于向量个数', B: '其秩小于向量个数', C: '含有零向量', D: '向量个数大于维数' }, answer: 'A', explanation: '线性无关 ⇔ 秩 = 向量个数；秩小于个数则线性相关。' },
  ]);

  add('linear-algebra:ch3-s3', [
    { id: 'la-maxindep-2', type: 'single', stem: '关于向量组的极大线性无关组，下列说法正确的是？', options: { A: '一般不唯一，但所含向量个数（秩）唯一', B: '一定唯一', C: '所含向量个数可以不同', D: '一定是整个向量组' }, answer: 'A', explanation: '极大无关组可能有多个，但向量个数都等于向量组的秩。' },
    { id: 'la-maxindep-3', type: 'judge', stem: '向量组的秩等于其构成矩阵的秩。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '把向量按列（或行）排成矩阵，向量组的秩即矩阵的秩。' },
    { id: 'la-maxindep-4', type: 'single', stem: '求极大线性无关组的常用方法是？', options: { A: '初等行变换化为行阶梯形，取主元列', B: '求逆矩阵', C: '求特征值', D: '正交化' }, answer: 'A', explanation: '化行阶梯形后，主元所在列对应的原向量构成一个极大无关组。' },
    { id: 'la-maxindep-5', type: 'judge', stem: '矩阵的行秩等于列秩。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '矩阵的行秩与列秩相等，统称为矩阵的秩。' },
  ]);

  add('linear-algebra:ch3-s4', [
    { id: 'la-vspace-1', type: 'single', stem: '向量空间（线性空间）对哪两种运算封闭？', options: { A: '加法与数乘', B: '乘法与除法', C: '内积与叉积', D: '转置与求逆' }, answer: 'A', explanation: '向量空间对加法与数乘封闭，并满足八条公理。' },
    { id: 'la-vspace-2', type: 'single', stem: '向量空间的一组基是指？', options: { A: '一个极大线性无关组', B: '任意一组向量', C: '所有向量的集合', D: '零向量的集合' }, answer: 'A', explanation: '基是线性无关且能生成整个空间的向量组，即极大无关组。' },
    { id: 'la-vspace-3', type: 'judge', stem: '向量空间的维数等于其任意一组基所含向量的个数。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不同基含向量个数相同，这个数就是空间的维数。' },
    { id: 'la-vspace-4', type: 'single', stem: '过渡矩阵的作用是？', options: { A: '描述两组基之间的坐标变换关系', B: '求行列式', C: '判断正定', D: '计算内积' }, answer: 'A', explanation: '若 (β₁,…,βₙ)=(α₁,…,αₙ)P，则 P 为从旧基到新基的过渡矩阵，用于坐标变换。' },
    { id: 'la-vspace-5', type: 'judge', stem: 'n 维向量空间中任意 n 个线性无关的向量都构成一组基。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: 'n 个线性无关向量已是极大无关组，故构成基。' },
  ]);

  add('linear-algebra:ch3-s5', [
    { id: 'la-orth-2', type: 'single', stem: '关于正交向量组，下列说法正确的是？', options: { A: '非零正交向量组一定线性无关', B: '正交向量组一定相关', C: '正交向量组含零向量', D: '正交即平行' }, answer: 'A', explanation: '两两正交的非零向量组线性无关，可作为正交基。' },
    { id: 'la-orth-3', type: 'judge', stem: '两向量正交的充要条件是它们的内积为 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '内积为 0 表示夹角为 90°（零向量与任意向量正交）。' },
    { id: 'la-orth-4', type: 'single', stem: '施密特正交化的作用是？', options: { A: '把线性无关组化为正交组', B: '求矩阵的秩', C: '求特征值', D: '求逆矩阵' }, answer: 'A', explanation: '逐次减去在已有正交向量上的投影，得到两两正交的向量组。' },
    { id: 'la-orth-5', type: 'judge', stem: '标准正交组中的向量两两正交且每个向量的模都为 1。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '标准正交（规范正交）组满足正交且单位化两个条件。' },
  ]);

  add('linear-algebra:ch4-s1', [
    { id: 'la-cramer-2', type: 'single', stem: '克拉默法则成立的前提是系数矩阵 A 满足？', options: { A: '|A| ≠ 0（A 可逆）', B: '|A| = 0', C: 'A 对称', D: 'A 为正定矩阵' }, answer: 'A', explanation: '只有系数行列式非零时，方程组才有唯一解，克拉默法则才适用。' },
    { id: 'la-cramer-3', type: 'judge', stem: '当 |A| ≠ 0 时，齐次线性方程组 Ax=0 只有零解。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '系数行列式非零说明 A 可逆，Ax=0 两边左乘 A⁻¹ 得 x=0。' },
    { id: 'la-cramer-4', type: 'single', stem: '克拉默法则给出的解为？', options: { A: 'xᵢ = |Aᵢ| / |A|', B: 'xᵢ = |A| / |Aᵢ|', C: 'xᵢ = |Aᵢ|', D: 'xᵢ = |A|·|Aᵢ|' }, answer: 'A', explanation: '把 A 的第 i 列换成常数列 b 得 Aᵢ，则 xᵢ=|Aᵢ|/|A|。' },
    { id: 'la-cramer-5', type: 'judge', stem: '克拉默法则计算量大，主要用于理论推导而非大规模数值求解。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '需要计算 n+1 个 n 阶行列式，代价高，实际求解多用消元法。' },
  ]);

  add('linear-algebra:ch4-s2', [
    { id: 'la-homo-2', type: 'single', stem: 'n 元齐次方程组 Ax=0 解空间的维数等于？', options: { A: 'n − r(A)', B: 'n', C: 'r(A)', D: 'n + r(A)' }, answer: 'A', explanation: '解空间维数 = 未知数个数 − 系数矩阵的秩，即自由变量个数。' },
    { id: 'la-homo-3', type: 'judge', stem: '齐次线性方程组的全体解构成一个向量空间（解空间）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '齐次解对加法与数乘封闭，构成解空间。' },
    { id: 'la-homo-4', type: 'single', stem: '齐次方程组的基础解系含有多少个解向量？', options: { A: 'n − r(A)', B: 'r(A)', C: 'n', D: '1' }, answer: 'A', explanation: '基础解系所含向量个数等于解空间维数 n−r(A)。' },
    { id: 'la-homo-5', type: 'judge', stem: '齐次线性方程组一定有解（至少有零解）。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '零向量总是解，故齐次方程组必有解。' },
  ]);

  add('linear-algebra:ch4-s3', [
    { id: 'la-nonhomo-2', type: 'single', stem: '非齐次方程组 Ax=b 有解的充要条件是？', options: { A: 'r(A) = r(A|b)', B: 'r(A) = n', C: '|A| ≠ 0', D: 'b = 0' }, answer: 'A', explanation: '系数矩阵与增广矩阵秩相等时方程组相容（有解）。' },
    { id: 'la-nonhomo-3', type: 'judge', stem: '非齐次方程组的通解等于一个特解加上对应齐次方程组的通解。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这是非齐次方程组解的结构定理。' },
    { id: 'la-nonhomo-4', type: 'single', stem: '若 r(A) = r(A|b) = n（n 为未知数个数），则方程组？', options: { A: '有唯一解', B: '有无穷多解', C: '无解', D: '只有零解' }, answer: 'A', explanation: '秩等于未知数个数说明无自由变量，解唯一。' },
    { id: 'la-nonhomo-5', type: 'judge', stem: '若 r(A) = r(A|b) < n，则方程组有无穷多解。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '相容且存在自由变量（n−r>0），故有无穷多解。' },
  ]);

  add('linear-algebra:ch5-s1', [
    { id: 'la-eig-2', type: 'single', stem: '求矩阵 A 的特征值需要解哪个方程？', options: { A: '|λE − A| = 0', B: '|A| = 0', C: 'Ax = 0', D: 'A² = A' }, answer: 'A', explanation: '由 (λE−A)x=0 有非零解，得特征方程 |λE−A|=0。' },
    { id: 'la-eig-3', type: 'judge', stem: '特征向量必须是非零向量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '零向量对任何 λ 都满足，无意义，故特征向量非零。' },
    { id: 'la-eig-4', type: 'single', stem: '矩阵的迹与特征值的关系是？', options: { A: '迹等于全部特征值之和', B: '迹等于特征值之积', C: '迹等于最大特征值', D: '无关' }, answer: 'A', explanation: 'Σλᵢ = tr(A)，Πλᵢ = |A|。' },
    { id: 'la-eig-5', type: 'judge', stem: '矩阵属于不同特征值的特征向量线性无关。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不同特征值对应的特征向量必线性无关。' },
  ]);

  add('linear-algebra:ch5-s2', [
    { id: 'la-diag-2', type: 'single', stem: '相似矩阵具有相同的？', options: { A: '特征值', B: '元素', C: '转置', D: '逆矩阵' }, answer: 'A', explanation: '相似矩阵有相同的特征多项式，故特征值相同。' },
    { id: 'la-diag-3', type: 'judge', stem: '相似矩阵的行列式、迹和秩都相同。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '这些都是相似不变量，可用于判断是否相似。' },
    { id: 'la-diag-4', type: 'single', stem: 'n 阶矩阵可相似对角化的充要条件是？', options: { A: '每个特征值的几何重数等于其代数重数', B: '特征值互不相同', C: '|A| ≠ 0', D: 'A 对称' }, answer: 'A', explanation: '等价于存在 n 个线性无关特征向量；特征值互异只是充分条件。' },
    { id: 'la-diag-5', type: 'judge', stem: '实对称矩阵一定可以相似对角化。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '实对称矩阵甚至可正交对角化，必有 n 个线性无关特征向量。' },
  ]);

  add('linear-algebra:ch5-s3', [
    { id: 'la-sym-2', type: 'single', stem: '实对称矩阵的特征值具有什么性质？', options: { A: '全为实数', B: '全为虚数', C: '必有负数', D: '全为零' }, answer: 'A', explanation: '实对称矩阵的特征值必为实数，且特征向量可取为实向量。' },
    { id: 'la-sym-3', type: 'judge', stem: '实对称矩阵一定可以正交对角化。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '存在正交矩阵 Q 使 QᵀAQ 为对角矩阵。' },
    { id: 'la-sym-4', type: 'single', stem: 'n 阶实对称矩阵一定有多少个线性无关的特征向量？', options: { A: 'n 个', B: '1 个', C: 'n−1 个', D: '不确定' }, answer: 'A', explanation: '实对称矩阵可对角化，必有 n 个线性无关特征向量。' },
    { id: 'la-sym-5', type: 'judge', stem: '实对称矩阵的 k 重特征值一定对应 k 个线性无关的特征向量。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '实对称矩阵每个特征值的几何重数等于代数重数，故成立。' },
  ]);

  add('linear-algebra:ch6-s1', [
    { id: 'la-quad-2', type: 'single', stem: '二次型对应的矩阵是什么？', options: { A: '对称矩阵且唯一确定', B: '任意矩阵', C: '上三角矩阵', D: '对角矩阵' }, answer: 'A', explanation: '二次型总可唯一表示为 xᵀAx（A 对称）。' },
    { id: 'la-quad-3', type: 'judge', stem: '二次型的秩等于其矩阵的秩。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '二次型的秩定义为其矩阵的秩，反映平方项个数（标准形中非零系数个数）。' },
    { id: 'la-quad-4', type: 'single', stem: '作可逆线性变换 x = Cy 化简二次型，属于？', options: { A: '合同变换', B: '相似变换', C: '正交变换（特例）', D: '初等变换' }, answer: 'A', explanation: 'x=Cy（C 可逆）使 A 与 CᵀAC 合同，二次型化为新二次型。' },
    { id: 'la-quad-5', type: 'judge', stem: '二次型经可逆线性变换后，其秩保持不变。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '合同变换不改变矩阵的秩，故二次型的秩不变。' },
  ]);

  add('linear-algebra:ch6-s2', [
    { id: 'la-std-1', type: 'single', stem: '二次型的标准形是指？', options: { A: '只含平方项、不含交叉项的二次型', B: '系数全为 1 的二次型', C: '矩阵为对角阵且系数为 ±1', D: '秩为 n 的二次型' }, answer: 'A', explanation: '标准形形如 d₁y₁²+…+dᵣyᵣ²，只含平方项。' },
    { id: 'la-std-2', type: 'single', stem: '二次型的规范形中，平方项系数只能是？', options: { A: '1、−1 或 0', B: '任意实数', C: '正整数', D: '0 或 1' }, answer: 'A', explanation: '规范形把标准形进一步归一，系数为 +1、−1、0。' },
    { id: 'la-std-3', type: 'judge', stem: '惯性定理说明二次型的正、负惯性指数在可逆线性变换下不变。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '正平方项个数 p 与负平方项个数 q 是合同不变量。' },
    { id: 'la-std-4', type: 'single', stem: '化二次型为标准形的常用方法有？', options: { A: '配方法与正交变换法', B: '求逆与转置', C: '克拉默法则', D: '洛必达法则' }, answer: 'A', explanation: '配方法（合同变换）和正交变换法都可化二次型为标准形。' },
    { id: 'la-std-5', type: 'judge', stem: '二次型的规范形由其正、负惯性指数唯一确定。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '不同方法得到的规范形相同，只由 p、q（及秩）决定。' },
  ]);

  add('linear-algebra:ch6-s3', [
    { id: 'la-pd-3', type: 'single', stem: '实二次型正定的等价条件是？', options: { A: '正惯性指数为 n', B: '负惯性指数为 n', C: '秩小于 n', D: '存在零特征值' }, answer: 'A', explanation: '正定 ⇔ 正惯性指数 p=n ⇔ 特征值全正 ⇔ 顺序主子式全正。' },
    { id: 'la-pd-4', type: 'judge', stem: '正定矩阵的行列式一定大于 0。', options: { T: '正确', F: '错误' }, answer: 'T', explanation: '正定矩阵特征值全正，行列式等于特征值之积，故 > 0。' },
    { id: 'la-pd-5', type: 'single', stem: '正定矩阵的主对角元素一定？', options: { A: '都大于 0', B: '都小于 0', C: '都等于 0', D: '无限制' }, answer: 'A', explanation: '取标准基向量 eᵢ，有 aᵢᵢ = eᵢᵀAeᵢ > 0。' },
  ]);

  /* == MORE == */
})(window);
