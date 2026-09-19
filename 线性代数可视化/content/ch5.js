/* ============================================================
   ch5.js — 第五章 矩阵的特征值和特征向量
   考研数学（一）· 线性代数 · 可视化学习内容数据
   约定：块对象由 assets/js/app.js 的 renderBlock 渲染；
         公式用 \( \)（行内）与 \[ \]（行间）；
         viz 的 build 字段取自 window.WIDGETS 中已注册的组件名。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH5 = {
    id: 'ch5',
    no: '五',
    title: '矩阵的特征值和特征向量',
    subtitle: '特征向量是变换下方向不变的特殊方向，相似对角化把矩阵化为最简的对角形',
    tags: ['特征值', '特征向量', '特征多项式', '相似矩阵', '相似对角化', '实对称矩阵', '正交对角化'],
    sections: [

      /* ================================================================
         5.1 特征值与特征向量
         ================================================================ */
      {
        id: 'ch5-s1',
        num: '5.1',
        title: '特征值与特征向量',
        lead: '大纲要求：理解矩阵的特征值和特征向量的概念及性质，会求矩阵的特征值和特征向量。特征值把“矩阵乘向量”变成“数乘向量”，是矩阵最本质的数值信息。',
        blocks: [
          { t: 'h3', idx: '①', text: '概念与几何意义' },
          { t: 'card', kind: 'def', tag: '定义', title: '特征值与特征向量', html: String.raw`<p class="tight">设 \( A \) 是 n 阶方阵，若存在数 \( \lambda \) 与非零向量 \( \alpha \)（\( \alpha \neq 0 \)），使得</p><div class="fml-row">\( A\alpha = \lambda\alpha, \)</div><p class="tight">则称 \( \lambda \) 为 \( A \) 的<b>特征值</b>，\( \alpha \) 为 \( A \) 的属于（对应于）\( \lambda \) 的<b>特征向量</b>。</p><ul class="none"><li>特征向量必须<b>非零</b>；零向量不是特征向量（但它满足方程）。</li><li>特征值可以是 0，也可以出现重根；特征值 0 对应“\( A \) 不可逆”。</li><li>若 \( \alpha \) 是 \( \lambda \) 的特征向量，则 \( k\alpha \)（\( k \neq 0 \)）也是；因此特征向量是“方向”，常数倍视为同一个。</li></ul>` },
          { t: 'card', kind: 'key', tag: '几何', title: '几何意义：方向不变的向量', html: String.raw`<p class="tight">把 \( A \) 看成线性变换 \( x \mapsto Ax \)，特征向量就是<b>变换后方向不变</b>（只被伸缩 \( \lambda \) 倍）的方向：\( \lambda \gt 1 \) 拉伸，\( 0 \lt \lambda \lt 1 \) 压缩，\( \lambda \lt 0 \) 反向，\( \lambda = 0 \) 压扁到原点。\( \lambda \) 就是该方向上的伸缩比。</p>` },
          { t: 'viz', build: 'eigen2d', title: '特征向量的几何演示', sub: '拖动矩阵元素，观察哪些方向在变换后保持方向不变' },
          { t: 'viz', build: 'eigenInvariant', title: '特征方向的不变性', sub: '播放 θ 扫描动画：一般向量被“转动”出夹角，只有特征方向上的 Ax 与 x 共线（φ = 0），并标注对应的 λ' },
          { t: 'h3', idx: '②', text: '特征多项式与求法' },
          { t: 'card', kind: 'def', tag: '定义', title: '特征多项式与特征方程', html: String.raw`<p class="tight">\( A\alpha = \lambda\alpha \iff (\lambda E - A)\alpha = 0 \)，即 \( \alpha \) 是齐次方程组 \( (\lambda E - A)x = 0 \) 的<b>非零解</b>。这要求</p><div class="fml-row">\( |\lambda E - A| = 0. \)</div><p class="tight">上式左端是关于 \( \lambda \) 的 n 次多项式，记作 \( f(\lambda) = |\lambda E - A| \)，称为 \( A \) 的<b>特征多项式</b>；方程 \( f(\lambda) = 0 \) 称为<b>特征方程</b>，其根即为特征值。</p>` },
          { t: 'list', ordered: true, items: [
            String.raw`解特征方程 \( |\lambda E - A| = 0 \)，求出全部特征值 \( \lambda_1,\cdots,\lambda_n \)（重根按重数计）。`,
            String.raw`对每个特征值 \( \lambda_i \)，解齐次方程组 \( (\lambda_i E - A)x = 0 \)，求出它的一个基础解系 \( \xi_1,\cdots,\xi_{t} \)。`,
            String.raw`则该特征值的全部特征向量为 \( k_1\xi_1 + \cdots + k_t\xi_t \)，其中 \( k_1,\cdots,k_t \) 为<b>不全为零</b>的任意常数。`,
            String.raw`各特征值的特征向量集合互不重叠（一个非零向量只属于一个特征值）。`
          ] },
          { t: 'card', kind: 'key', tag: '常用', title: '两个必须记住的公式', html: String.raw`<div class="fml-row">\( \sum_{i=1}^{n}\lambda_i = \lambda_1+\cdots+\lambda_n = a_{11}+a_{22}+\cdots+a_{nn} = \mathrm{tr}(A), \)</div><div class="fml-row">\( \prod_{i=1}^{n}\lambda_i = \lambda_1\lambda_2\cdots\lambda_n = |A|. \)</div><p class="tight">（第二个式子说明：\( A \) 可逆 \( \iff \) 所有特征值都不为 0。）</p>` },
          { t: 'h3', idx: '③', text: '特征值与特征向量的性质' },
          { t: 'table', head: ['性质', '内容'], rows: [
            ['无关性', '属于<b>不同</b>特征值的特征向量线性无关'],
            ['重数控制', String.raw`k 重特征值至多有 k 个线性无关的特征向量（几何重数 ≤ 代数重数）`],
            ['特征子空间', String.raw`属于 \( \lambda_0 \) 的全部特征向量加上零向量构成 \( (\lambda_0E - A)x = 0 \) 的解空间，维数为 \( n - r(\lambda_0E - A) \)`],
            [String.raw`A 与 \( A^{T} \)`, '具有相同的特征值（但特征向量一般不同）'],
            [String.raw`逆矩阵`, String.raw`\( A \) 可逆时，\( \dfrac{1}{\lambda} \) 是 \( A^{-1} \) 的特征值，特征向量不变`],
            ['伴随矩阵', String.raw`\( A \) 可逆时，\( \dfrac{|A|}{\lambda} \) 是 \( A^{*} \) 的特征值，特征向量不变`],
            ['幂', String.raw`\( \lambda^{k} \) 是 \( A^{k} \) 的特征值，特征向量不变`],
            ['多项式', String.raw`\( f(\lambda) \) 是 \( f(A) \) 的特征值（\( f \) 为任意多项式），特征向量不变`]
          ] },
          { t: 'card', kind: 'warn', tag: '辨析', title: '三个常见错误认识', html: String.raw`<ul class="none"><li>“属于不同特征值的特征向量之和仍是特征向量”——<b>错</b>。\( \alpha_1+\alpha_2 \) 一般不是特征向量。</li><li>“k 重特征值一定有 k 个无关特征向量”——<b>错</b>。这正是 5.2 节判断能否对角化的关键。</li><li>“特征值是矩阵的元素或可由元素直接读出”——只有三角矩阵、对角矩阵才有 \( \lambda_i = a_{ii} \)；一般矩阵必须解特征方程。若 \( A \) 不可逆，则 \( |A| = 0 \)，必有特征值 0。</li></ul>` },
          { t: 'h3', idx: '④', text: '常见题型与解题套路' },
          { t: 'card', kind: 'tip', tag: '套路', title: '三类高频题', html: String.raw`<ul class="none"><li><b>求特征值/特征向量：</b>按“特征方程 → 基础解系”两步走；二阶矩阵可用 \( \lambda^{2} - \mathrm{tr}(A)\lambda + |A| = 0 \) 快速求根。</li><li><b>已知特征向量反求参数：</b>把 \( A\alpha = \lambda\alpha \) 写成方程组，逐分量比较，往往能一次定出多个参数；也可用 \( (\lambda E - A)\alpha = 0 \)。</li><li><b>用和与积反求参数：</b>利用 \( \sum\lambda_i = \mathrm{tr}(A) \)、\( \prod\lambda_i = |A| \) 建立方程。</li></ul>` },
          { t: 'card', kind: 'exam', tag: '考法', title: '真题呈现', html: String.raw`<p class="tight">选择题常考“特征值性质辨析”（如 \( A^{2} = A \)、\( A^{2} = E \) 时特征值的取值）；填空题常考“已知特征值求 \( |f(A)| \)”；解答题中特征值是相似对角化、实对称矩阵与二次型的前置步骤。</p>` }
        ],
        examples: [
          {
            no: '例 5.1',
            meta: '基础 · 求特征值与特征向量',
            q: String.raw`求矩阵 \( A = \begin{pmatrix} 2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2 \end{pmatrix} \) 的特征值与特征向量。`,
            sol: String.raw`<p>写出特征多项式并计算（\( A = J + E \)，其中 \( J \) 为全 1 矩阵，故 \( \lambda E - A = (\lambda-1)E - J \)）：</p><div class="fml"><div class="fml-row">\( |\lambda E - A| = \begin{vmatrix} \lambda-2 & -1 & -1 \\ -1 & \lambda-2 & -1 \\ -1 & -1 & \lambda-2 \end{vmatrix} = \left[(\lambda-2)+2\times(-1)\right]\left[(\lambda-2)-(-1)\right]^{2} = (\lambda-4)(\lambda-1)^{2}. \)</div></div><p>特征值为 \( \lambda_1 = 4,\ \lambda_2 = \lambda_3 = 1 \)（重根按重数计，和 \( 4+1+1 = 6 = \mathrm{tr}(A) \) ✓，积 \( 4\times1\times1 = 4 = |A| \) ✓）。</p><p><b>对 \( \lambda = 4 \)：</b>解 \( (4E - A)x = 0 \)，即 \( 3E - J \) 作用为零，得 \( x_1 = x_2 = x_3 \)，基础解系为 \( \xi_1 = (1,1,1)^{T} \)，全部特征向量为 \( k_1(1,1,1)^{T}\ (k_1 \neq 0) \)。</p><p><b>对 \( \lambda = 1 \)：</b>解 \( (E - A)x = 0 \)，即 \( Jx = 0 \)，得 \( x_1 + x_2 + x_3 = 0 \)，基础解系</p><div class="fml"><div class="fml-row">\( \xi_2 = (-1,1,0)^{T},\qquad \xi_3 = (-1,0,1)^{T}, \)</div></div><p>全部特征向量为 \( k_2(-1,1,0)^{T} + k_3(-1,0,1)^{T} \)，其中 \( k_2,k_3 \) <b>不全为零</b>。</p><p><b>点评：</b>\( \lambda = 1 \) 是二重特征值，恰好有 2 个线性无关的特征向量（\( n - r(E-A) = 3 - 1 = 2 \)），说明这个重根“够用”，\( A \) 可以对角化。</p>`
          },
          {
            no: '例 5.2',
            meta: '提高 · 用特征值性质计算行列式',
            q: String.raw`设 3 阶矩阵 \( A \) 的特征值为 \( \lambda_1 = 1,\ \lambda_2 = -1,\ \lambda_3 = 2 \)。求 ① \( \mathrm{tr}(A) \) 与 \( |A| \)；② \( A^{-1} \)、\( A^{*} \)、\( A^{2} \) 的特征值；③ \( |A^{2}+A+E| \)。`,
            sol: String.raw`<p><b>①</b> 由和与积公式：</p><div class="fml"><div class="fml-row">\( \mathrm{tr}(A) = 1+(-1)+2 = 2,\qquad |A| = 1\times(-1)\times2 = -2. \)</div></div><p><b>②</b> 由 \( A^{-1} \) 的特征值为 \( 1/\lambda \)、\( A^{*} \) 的特征值为 \( |A|/\lambda \)、\( A^{2} \) 的特征值为 \( \lambda^{2} \)（特征向量都不变），得</p><div class="fml"><div class="fml-row">\( A^{-1}: \quad 1,\ -1,\ \tfrac{1}{2};\qquad A^{*}: \quad \frac{-2}{1} = -2,\ \frac{-2}{-1} = 2,\ \frac{-2}{2} = -1;\qquad A^{2}: \quad 1,\ 1,\ 4. \)</div></div><p><b>③</b> 设 \( f(x) = x^{2}+x+1 \)，则 \( f(A) = A^{2}+A+E \) 的特征值为</p><div class="fml"><div class="fml-row">\( f(1) = 3,\qquad f(-1) = 1-1+1 = 1,\qquad f(2) = 4+2+1 = 7. \)</div></div><p>故</p><div class="fml"><div class="fml-row">\( \mathbf{|A^{2}+A+E| = 3\times1\times7 = 21}. \)</div></div><p><b>点评：</b>抽象矩阵的行列式往往不需要知道矩阵本身，只要知道特征值，用“\( f(A) \) 的特征值是 \( f(\lambda) \)，行列式是特征值之积”即可直接算出答案。</p>`
          },
          {
            no: '例 5.3',
            meta: '提高 · 已知特征向量反求参数',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 2 & a \\ 0 & -1 & 1 \\ 2 & 1 & b \end{pmatrix} \)，已知 \( \xi = (1,1,-1)^{T} \) 是 \( A \) 的特征向量，求 \( a,b \) 以及对应的特征值。`,
            sol: String.raw`<p>设 \( A\xi = \lambda\xi \)。先算 \( A\xi \)：</p><div class="fml"><div class="fml-row">\( A\xi = \begin{pmatrix} 1 & 2 & a \\ 0 & -1 & 1 \\ 2 & 1 & b \end{pmatrix}\begin{pmatrix} 1 \\ 1 \\ -1 \end{pmatrix} = \begin{pmatrix} 1+2-a \\ 0-1-1 \\ 2+1-b \end{pmatrix} = \begin{pmatrix} 3-a \\ -2 \\ 3-b \end{pmatrix}. \)</div></div><p>而 \( \lambda\xi = (\lambda,\lambda,-\lambda)^{T} \)，逐分量比较：由第二个分量得 \( \lambda = -2 \)；再由第一、三个分量得</p><div class="fml"><div class="fml-row">\( 3-a = -2 \Rightarrow a = 5,\qquad 3-b = 2 \Rightarrow b = 1. \)</div></div><p>故</p><div class="fml"><div class="fml-row">\( \mathbf{a = 5,\quad b = 1,\quad \lambda = -2}. \)</div></div><p><b>核验：</b>此时 \( A = \begin{pmatrix} 1 & 2 & 5 \\ 0 & -1 & 1 \\ 2 & 1 & 1 \end{pmatrix} \)，\( A\xi = (1+2-5,\ -1-1,\ 2+1-1)^{T} = (-2,-2,2)^{T} = -2(1,1,-1)^{T} \) ✓。</p><p><b>点评：</b>“已知特征向量”等价于“已知一个向量被 \( A \) 变成它自己的常数倍”，逐分量比较即可解出参数；注意特征值可能为负。另外还要检查解出的参数不会使 \( \xi \) 变成零向量（这里 \( \xi \) 是题给的，无需检查）。</p>`
          }
        ],
        pitfalls: [
          String.raw`特征向量必须非零：写“全部特征向量为 \( k\xi\ (k \neq 0) \)”时不能漏掉 \( k \neq 0 \)；重根情形写 \( k_1\xi_1 + k_2\xi_2 \) 时要注明 \( k_1,k_2 \) 不全为零。`,
          String.raw`特征多项式用 \( |\lambda E - A| \) 还是 \( |A - \lambda E| \) 要统一：两者相差 \( (-1)^{n} \)，根相同但多项式不同；求特征值时混用容易漏掉符号。`,
          String.raw`“k 重特征值最多有 k 个无关特征向量”是上界，不是等式；能否取等决定可对角化与否。`,
          String.raw`不要用“主对角线元素就是特征值”去处理一般矩阵：只有（上/下）三角矩阵、对角矩阵才成立。`,
          String.raw`属于不同特征值的特征向量的和不再是特征向量；两组特征向量的线性组合也未必是特征向量。`
        ]
      },

      /* ================================================================
         5.2 相似矩阵与相似对角化
         ================================================================ */
      {
        id: 'ch5-s2',
        num: '5.2',
        title: '相似矩阵与相似对角化',
        lead: '大纲要求：理解相似矩阵的概念、性质及矩阵可相似对角化的充分必要条件，掌握将矩阵化为相似对角矩阵的方法。对角化让矩阵的幂、行列式与多项式运算都退化为“数的运算”。',
        blocks: [
          { t: 'h3', idx: '①', text: '相似矩阵的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '相似矩阵', html: String.raw`<p class="tight">设 \( A,B \) 都是 n 阶方阵，若存在<b>可逆</b>矩阵 \( P \) 使得</p><div class="fml-row">\( P^{-1}AP = B, \)</div><p class="tight">则称 \( A \) 与 \( B \) <b>相似</b>，记作 \( A \sim B \)，\( P \) 称为把 \( A \) 化为 \( B \) 的<b>相似变换矩阵</b>。相似关系满足反身、对称、传递。</p>` },
          { t: 'card', kind: 'key', tag: '性质', title: '相似矩阵的共同“指纹”', html: String.raw`<p class="tight">若 \( A \sim B \)，则下列量完全相同（相似不变量）：</p><ul class="none"><li>特征多项式、特征值（含重数）；</li><li>行列式 \( |A| = |B| \)；迹 \( \mathrm{tr}(A) = \mathrm{tr}(B) \)；秩 \( r(A) = r(B) \)；</li><li>可逆性（同时可逆或不可逆）；</li><li>进一步：\( A^{k} \sim B^{k} \)，\( A^{-1} \sim B^{-1} \)（可逆时），\( A^{T} \sim B^{T} \)，\( f(A) \sim f(B) \)（\( f \) 为任意多项式）。</li></ul>` },
          { t: 'card', kind: 'warn', tag: '辨析', title: '特征值相同不代表相似', html: String.raw`<p class="tight">反例：\( A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \) 与 \( E = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \) 的特征值都是 \( 1,1 \)，但 \( A \) 不可对角化。若 \( A \sim E \)，则 \( A = P^{-1}EP = E \)，矛盾，故二者不相似。</p><p class="tight">结论：特征多项式相同是<b>必要</b>条件；判相似要看是否“同秩 + 同可对角化结构”，最常用的正面判据是“都能对角化且特征值相同”。</p>` },
          { t: 'h3', idx: '②', text: '可相似对角化的充分必要条件' },
          { t: 'card', kind: 'thm', tag: '定理', title: '可对角化的判据', html: String.raw`<p class="tight">n 阶矩阵 \( A \) 可对角化（即存在可逆 \( P \) 使 \( P^{-1}AP = \Lambda \) 为对角矩阵）的充要条件是下列任一条：</p><ul class="none"><li>\( A \) 有 <b>n 个线性无关</b>的特征向量；</li><li>对每个特征值，其<b>几何重数 = 代数重数</b>，即 \( n - r(\lambda_iE - A) = k_i \)（\( k_i \) 为 \( \lambda_i \) 的重数）；</li><li>属于每个特征值的特征向量个数之和为 n。</li></ul><p class="tight"><b>充分条件：</b>若 \( A \) 的 n 个特征值互不相同（无重根），则 \( A \) 必可对角化。</p>` },
          { t: 'card', kind: 'def', tag: '名词', title: '几何重数与代数重数', html: String.raw`<p class="tight">特征值 \( \lambda_0 \) 的<b>代数重数</b>：它作为特征方程根的重数 \( k \)；<b>几何重数</b>：属于它的线性无关特征向量的个数，等于 \( n - r(\lambda_0E - A) \)。总有</p><div class="fml-row">\( 1 \le \text{几何重数} \le \text{代数重数}. \)</div><p class="tight">只有当每个特征值的几何重数都取到上界（等于代数重数）时，才能凑足 n 个无关特征向量。</p>` },
          { t: 'h3', idx: '③', text: '化对角矩阵的方法' },
          { t: 'list', ordered: true, items: [
            String.raw`求出 \( A \) 的全部特征值 \( \lambda_1,\cdots,\lambda_n \)（含重数）。`,
            String.raw`对每个特征值求 \( (\lambda E - A)x = 0 \) 的基础解系，得到属于它的线性无关特征向量。`,
            String.raw`检查线性无关特征向量的总个数是否等于 n：等于则能对角化，小于则不能。`,
            String.raw`把这 n 个特征向量按列排成矩阵 \( P = (p_1,p_2,\cdots,p_n) \)，则 \( P^{-1}AP = \Lambda = \mathrm{diag}(\lambda_1,\cdots,\lambda_n) \)。`,
            String.raw`<b>顺序对应原则：</b>\( P \) 的第 i 列必须是 \( \Lambda \) 中第 i 个对角元所对应的特征向量——列序与特征值顺序必须一一对应。`
          ] },
          { t: 'viz', build: 'diagonalize', title: '相似对角化交互演示', sub: '选择特征向量构造 P，观察 P⁻¹AP 如何化为对角形' },
          { t: 'card', kind: 'key', tag: '应用', title: '对角化的价值：幂与多项式', html: String.raw`<p class="tight">若 \( A = P\Lambda P^{-1} \)，则</p><div class="fml-row">\( A^{k} = P\Lambda^{k}P^{-1},\qquad f(A) = P f(\Lambda) P^{-1}, \)</div><p class="tight">其中 \( \Lambda^{k} = \mathrm{diag}(\lambda_1^{k},\cdots,\lambda_n^{k}) \)，\( f(\Lambda) = \mathrm{diag}(f(\lambda_1),\cdots,f(\lambda_n)) \)。由此可求高次幂、判断 \( A^{k} = O \) 以及证明矩阵恒等式。</p>` },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 判断能否对角化并求 \( P,\Lambda \)；② 含参数：讨论参数使 A 可对角化，或由“可对角化”反求参数；③ 由相似关系求参数（用迹、行列式、特征值相同建立方程）；④ 求 \( A^{n} \)。</p>` }
        ],
        examples: [
          {
            no: '例 5.4',
            meta: '基础 · 判断并实现对角化',
            q: String.raw`设 \( A = \begin{pmatrix} -2 & 1 & 1 \\ 0 & 2 & 0 \\ -4 & 1 & 3 \end{pmatrix} \)，判断 \( A \) 能否相似对角化，若能，求可逆矩阵 \( P \) 与对角矩阵 \( \Lambda \)。`,
            sol: String.raw`<p><b>第一步：求特征值。</b></p><div class="fml"><div class="fml-row">\( |\lambda E - A| = \begin{vmatrix} \lambda+2 & -1 & -1 \\ 0 & \lambda-2 & 0 \\ 4 & -1 & \lambda-3 \end{vmatrix} = (\lambda-2)\left[(\lambda+2)(\lambda-3)+4\right] = (\lambda-2)(\lambda^{2}-\lambda-2) = (\lambda-2)^{2}(\lambda+1). \)</div></div><p>特征值为 \( \lambda_1 = \lambda_2 = 2,\ \lambda_3 = -1 \)。</p><p><b>第二步：看二重根 \( \lambda = 2 \) 的几何重数。</b></p><div class="fml"><div class="fml-row">\( 2E - A = \begin{pmatrix} 4 & -1 & -1 \\ 0 & 0 & 0 \\ 4 & -1 & -1 \end{pmatrix} \longrightarrow \begin{pmatrix} 4 & -1 & -1 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix},\qquad r(2E-A) = 1. \)</div></div><p>几何重数 \( = 3 - 1 = 2 \) = 代数重数 2，可以凑足 2 个无关特征向量。由 \( 4x_1 - x_2 - x_3 = 0 \) 取基础解系</p><div class="fml"><div class="fml-row">\( p_1 = (1,4,0)^{T},\qquad p_2 = (1,0,4)^{T}. \)</div></div><p><b>第三步：对 \( \lambda = -1 \)。</b></p><div class="fml"><div class="fml-row">\( -E - A = \begin{pmatrix} 1 & -1 & -1 \\ 0 & -3 & 0 \\ 4 & -1 & -4 \end{pmatrix} \longrightarrow \begin{pmatrix} 1 & 0 & -1 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{pmatrix}, \)</div></div><p>得 \( x_2 = 0,\ x_1 = x_3 \)，取 \( p_3 = (1,0,1)^{T} \)。</p><p>三个特征向量 \( p_1,p_2,p_3 \) 线性无关（\( p_3 \) 与 \( p_1,p_2 \) 不成比例且 \( p_1,p_2 \) 不成比例），故 \( A \) 可对角化，且</p><div class="fml"><div class="fml-row">\( \mathbf{P = \begin{pmatrix} 1 & 1 & 1 \\ 4 & 0 & 0 \\ 0 & 4 & 1 \end{pmatrix},\qquad \Lambda = \begin{pmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & -1 \end{pmatrix},\qquad P^{-1}AP = \Lambda.} \)</div></div><p><b>核验：</b>\( \mathrm{tr}(\Lambda) = 2+2-1 = 3 = \mathrm{tr}(A) = -2+2+3 \) ✓；\( |\Lambda| = -4 = |A| \) ✓。</p>`
          },
          {
            no: '例 5.5',
            meta: '提高 · 含参数的可对角化条件',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 1 & 0 \\ 0 & 2 & 0 \\ 0 & a & 2 \end{pmatrix} \)。问 \( a \) 取何值时 \( A \) 可相似对角化？此时求出可逆矩阵 \( P \) 与 \( \Lambda \)。`,
            sol: String.raw`<p>\( A \) 是上三角矩阵，故特征值为 \( \lambda_1 = 1,\ \lambda_2 = \lambda_3 = 2 \)，与 \( a \) 无关（因为 a 不在主对角线上）。</p><p>关键是二重根 \( \lambda = 2 \) 的几何重数：</p><div class="fml"><div class="fml-row">\( 2E - A = \begin{pmatrix} 1 & -1 & 0 \\ 0 & 0 & 0 \\ 0 & -a & 0 \end{pmatrix}. \)</div></div><p>要凑够 2 个线性无关的特征向量，需 \( r(2E - A) = 3 - 2 = 1 \)，即第二、三行必须成比例或为零。于是必须 \( a = 0 \)。</p><p><b>当 \( a = 0 \) 时：</b>\( A = \begin{pmatrix} 1 & 1 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 2 \end{pmatrix} \)。</p><p>对 \( \lambda = 2 \)：\( (2E-A) \to \begin{pmatrix} 1 & -1 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix} \)，即 \( x_1 = x_2 \)，基础解系 \( p_1 = (1,1,0)^{T},\ p_2 = (0,0,1)^{T} \)。</p><p>对 \( \lambda = 1 \)：\( (E-A) = \begin{pmatrix} 0 & -1 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{pmatrix} \to \begin{pmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix} \)，得 \( x_2 = x_3 = 0 \)，基础解系 \( p_3 = (1,0,0)^{T} \)。</p><p>故</p><div class="fml"><div class="fml-row">\( \mathbf{P = \begin{pmatrix} 1 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{pmatrix},\qquad \Lambda = \begin{pmatrix} 2 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 1 \end{pmatrix}}. \)</div></div><p><b>核验：</b>\( A p_1 = (2,2,0)^{T} = 2p_1 \) ✓；\( Ap_2 = (0,0,2)^{T} = 2p_2 \) ✓；\( Ap_3 = (1,0,0)^{T} = p_3 \) ✓。</p><p><b>结论：</b>\( a = 0 \) 时 \( A \) 可对角化；\( a \neq 0 \) 时 \( \lambda = 2 \) 的几何重数为 1 小于代数重数 2，不能对角化。</p>`
          },
          {
            no: '例 5.6',
            meta: '提高 · 用对角化求矩阵的幂',
            q: String.raw`设 \( A = \begin{pmatrix} 3 & -2 \\ 1 & 0 \end{pmatrix} \)，求 \( A^{n} \)（n 为正整数）。`,
            sol: String.raw`<p><b>第一步：求特征值与特征向量。</b>\( |\lambda E - A| = \begin{vmatrix} \lambda-3 & 2 \\ -1 & \lambda \end{vmatrix} = \lambda(\lambda-3)+2 = \lambda^{2}-3\lambda+2 = (\lambda-1)(\lambda-2) \)，故 \( \lambda_1 = 1,\ \lambda_2 = 2 \)。</p><p>对 \( \lambda = 1 \)：\( (E-A) = \begin{pmatrix} -2 & 2 \\ -1 & 1 \end{pmatrix} \to \begin{pmatrix} 1 & -1 \\ 0 & 0 \end{pmatrix} \)，取 \( p_1 = (1,1)^{T} \)。</p><p>对 \( \lambda = 2 \)：\( (2E-A) = \begin{pmatrix} -1 & 2 \\ -1 & 2 \end{pmatrix} \to \begin{pmatrix} 1 & -2 \\ 0 & 0 \end{pmatrix} \)，取 \( p_2 = (2,1)^{T} \)。</p><p>特征值互异，可对角化。取</p><div class="fml"><div class="fml-row">\( P = \begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix},\qquad P^{-1} = \begin{pmatrix} -1 & 2 \\ 1 & -1 \end{pmatrix},\qquad \Lambda = \begin{pmatrix} 1 & 0 \\ 0 & 2 \end{pmatrix}. \)</div></div><p><b>第二步：用 \( A^{n} = P\Lambda^{n}P^{-1} \)。</b></p><div class="fml"><div class="fml-row">\( A^{n} = \begin{pmatrix} 1 & 2 \\ 1 & 1 \end{pmatrix}\begin{pmatrix} 1 & 0 \\ 0 & 2^{n} \end{pmatrix}\begin{pmatrix} -1 & 2 \\ 1 & -1 \end{pmatrix} = \begin{pmatrix} 1 & 2^{n+1} \\ 1 & 2^{n} \end{pmatrix}\begin{pmatrix} -1 & 2 \\ 1 & -1 \end{pmatrix} = \begin{pmatrix} 2^{n+1}-1 & 2-2^{n+1} \\ 2^{n}-1 & 2-2^{n} \end{pmatrix}. \)</div></div><p><b>核验（n = 1）：</b>\( \begin{pmatrix} 3 & -2 \\ 1 & 0 \end{pmatrix} = A \) ✓；<b>（n = 2）：</b>\( \begin{pmatrix} 7 & -6 \\ 3 & -2 \end{pmatrix} \)，而 \( A^{2} = \begin{pmatrix} 3 & -2 \\ 1 & 0 \end{pmatrix}^{2} = \begin{pmatrix} 7 & -6 \\ 3 & -2 \end{pmatrix} \) ✓。</p><p><b>点评：</b>求 \( A^{n} \) 的对角化路线为“求特征值 → 求 P → 算 \( P\Lambda^{n}P^{-1} \)”，比逐次相乘或归纳法更系统，尤其适用于高阶矩阵。</p>`
          }
        ],
        pitfalls: [
          String.raw`\( P \) 的列顺序与 \( \Lambda \) 的对角元顺序必须一一对应；调换了特征向量的位置就必须同步调换特征值的位置。`,
          String.raw`相似要求 \( P \) <b>可逆</b>：若取出的特征向量线性相关（个数够但相关），\( P \) 不可逆，此时根本谈不上相似。`,
          String.raw`“特征值相同”不能推出相似；而“都可对角化 + 特征值相同”才可以。`,
          String.raw`重根情形必须单独检查几何重数是否等于代数重数，不能因为“特征值算对了”就直接说可对角化。`,
          String.raw`不要把“等价”“合同”“相似”混用：相似保持特征值，合同与等价都不保持；三者条件互不相同。`
        ]
      },
      /* ================================================================
         5.3 实对称矩阵
         ================================================================ */
      {
        id: 'ch5-s3',
        num: '5.3',
        title: '实对称矩阵',
        lead: '大纲要求：掌握实对称矩阵的特征值和特征向量的性质。实对称矩阵是线性代数中“最完美”的一类矩阵：特征值全为实数，属于不同特征值的特征向量自动正交，且一定可以用正交矩阵对角化。',
        blocks: [
          { t: 'h3', idx: '①', text: '实对称矩阵的三条基本性质' },
          { t: 'card', kind: 'thm', tag: '定理', title: '实对称矩阵的核心性质', html: String.raw`<p class="tight">设 \( A \) 为 n 阶<b>实对称</b>矩阵（\( A^{T} = A \)）：</p><ul class="none"><li><b>性质 1：</b>\( A \) 的特征值全是<b>实数</b>（相应的特征向量可取实向量）。</li><li><b>性质 2：</b>属于<b>不同</b>特征值的特征向量相互<b>正交</b>。</li><li><b>性质 3：</b>\( A \) 的每个特征值的几何重数都等于代数重数；特别地，k 重特征值恰有 k 个线性无关的特征向量。因此 \( A \) 必可对角化。</li></ul>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '必可正交相似对角化', html: String.raw`<p class="tight">设 \( A \) 为 n 阶实对称矩阵，则必存在<b>正交矩阵</b> \( Q \)（即 \( Q^{T}Q = E \)），使得</p><div class="fml-row">\( Q^{T}AQ = Q^{-1}AQ = \Lambda = \mathrm{diag}(\lambda_1,\lambda_2,\cdots,\lambda_n), \)</div><p class="tight">其中 \( \lambda_1,\cdots,\lambda_n \) 是 \( A \) 的全部特征值。此结论称为<b>正交相似对角化</b>，其变换矩阵 \( Q \) 的列向量是一组规范正交基。</p>` },
          { t: 'card', kind: 'key', tag: '推论', title: '由此得到的常用结论', html: String.raw`<ul class="none"><li>实对称矩阵必可对角化，所以“判断实对称矩阵能否对角化”永远答“能”。</li><li>实对称矩阵与对角矩阵既<b>相似</b>（保持特征值）又<b>合同</b>（保持惯性指数），这是第六章二次型的理论基础。</li><li>若 \( A \) 实对称且可逆，则 \( A^{-1} \) 与 \( A^{*} \) 也是实对称矩阵。</li><li>实对称矩阵的秩等于其非零特征值的个数（按重数计）。</li></ul>` },
          { t: 'card', kind: 'warn', tag: '辨析', title: '“属于不同特征值的特征向量正交”的适用范围', html: String.raw`<p class="tight">这条性质<b>只对实对称矩阵</b>成立。一般矩阵的不同特征值的特征向量只保证线性无关，不一定正交。例如 \( A = \begin{pmatrix} 3 & -2 \\ 1 & 0 \end{pmatrix} \) 的特征向量 \( (1,1)^{T} \) 与 \( (2,1)^{T} \) 并不正交。</p><p class="tight">另外，<b>同一</b>特征值的不同特征向量之间不一定正交，需要自己用施密特方法正交化——这正是实对称矩阵“正交对角化必须做条件正交化”的原因。</p>` },
          { t: 'h3', idx: '②', text: '正交相似对角化的步骤' },
          { t: 'list', ordered: true, items: [
            String.raw`求 \( A \) 的全部特征值 \( \lambda_1,\cdots,\lambda_n \)（重根按重数计）。`,
            String.raw`对每个特征值求基础解系，得到属于它的线性无关特征向量。`,
            String.raw`若某特征值重数大于 1，把该特征值对应的特征向量用<b>施密特方法正交化</b>（不同特征值的向量已自动正交，不必处理）。`,
            String.raw`把所有这些向量<b>单位化</b>。`,
            String.raw`按与 \( \Lambda \) 的列对应的顺序拼成正交矩阵 \( Q \)，则 \( Q^{T}AQ = \Lambda \)。`
          ] },
          { t: 'viz', build: 'diagonalize', title: '实对称矩阵的正交对角化', sub: '正交化与单位化后，观察 Q 的列向量如何构成规范正交基' },
          { t: 'h3', idx: '③', text: '与一般矩阵的对比' },
          { t: 'table', head: ['对比项', '一般矩阵', '实对称矩阵'], rows: [
            ['特征值', '可能为复数', '必为实数'],
            ['不同特征值的特征向量', '线性无关', '线性无关且相互正交'],
            ['重根的无关特征向量个数', '可能小于重数（不可对角化）', '恰等于重数（必可对角化）'],
            ['对角化方式', String.raw`\( P^{-1}AP = \Lambda \)，\( P \) 一般不可逆为正交矩阵`, String.raw`\( Q^{T}AQ = \Lambda \)，可取 \( Q \) 为正交矩阵`],
            ['与二次型的关系', '一般不能直接刻画二次型', '二次型必可由正交变换化为标准形（第 6 章）']
          ] },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 求正交矩阵 \( Q \) 使 \( Q^{T}AQ = \Lambda \)（解答题高频，注意重根内的正交化与全部向量的单位化）；② 由特征值、特征向量反求实对称矩阵 \( A \)；③ 判断关于实对称矩阵性质的命题；④ 二次型化标准形（第 6 章）。</p>` }
        ],
        examples: [
          {
            no: '例 5.7',
            meta: '重点 · 求正交矩阵 Q',
            q: String.raw`设 \( A = \begin{pmatrix} 2 & 2 & -2 \\ 2 & 5 & -4 \\ -2 & -4 & 5 \end{pmatrix} \)，求正交矩阵 \( Q \) 使 \( Q^{T}AQ = \Lambda \)。`,
            sol: String.raw`<p><b>第一步：求特征值。</b>\( A \) 是实对称矩阵，其特征值必为实数。</p><div class="fml"><div class="fml-row">\( |\lambda E - A| = \begin{vmatrix} \lambda-2 & -2 & 2 \\ -2 & \lambda-5 & 4 \\ 2 & 4 & \lambda-5 \end{vmatrix} = (\lambda-1)^{2}(\lambda-10). \)</div></div><p>特征值为 \( \lambda_1 = \lambda_2 = 1,\ \lambda_3 = 10 \)。</p><p><b>第二步：求 \( \lambda = 1 \) 的特征向量并正交化。</b>解 \( (E-A)x = 0 \)：</p><div class="fml"><div class="fml-row">\( E - A = \begin{pmatrix} -1 & -2 & 2 \\ -2 & -4 & 4 \\ 2 & 4 & -4 \end{pmatrix} \longrightarrow \begin{pmatrix} 1 & 2 & -2 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix} \Rightarrow x_1 = -2x_2+2x_3. \)</div></div><p>取 \( \alpha_1 = (-2,1,0)^{T},\ \alpha_2 = (2,0,1)^{T} \)，二者不正交，需施密特正交化：</p><div class="fml"><div class="fml-row">\( \beta_1 = (-2,1,0)^{T},\qquad \beta_2 = \alpha_2 - \frac{(\alpha_2,\beta_1)}{(\beta_1,\beta_1)}\beta_1 = (2,0,1)^{T} + \frac{4}{5}(-2,1,0)^{T} = \left(\frac{2}{5},\frac{4}{5},1\right)^{T} \sim (2,4,5)^{T}. \)</div></div><p><b>第三步：求 \( \lambda = 10 \) 的特征向量。</b>解 \( (10E-A)x = 0 \)，可得 \( x_1 : x_2 : x_3 = 1 : 2 : -2 \)，取 \( \beta_3 = (1,2,-2)^{T} \)（它与 \( \beta_1,\beta_2 \) 自动正交，可核验）。</p><p><b>第四步：单位化。</b>\( \|\beta_1\| = \sqrt{5} \)，\( \|(2,4,5)\| = \sqrt{45} = 3\sqrt{5} \)，\( \|\beta_3\| = 3 \)。于是</p><div class="fml"><div class="fml-row">\( Q = \begin{pmatrix} -\frac{2}{\sqrt{5}} & \frac{2}{3\sqrt{5}} & \frac{1}{3} \\[2pt] \frac{1}{\sqrt{5}} & \frac{4}{3\sqrt{5}} & \frac{2}{3} \\[2pt] 0 & \frac{5}{3\sqrt{5}} & -\frac{2}{3} \end{pmatrix},\qquad \mathbf{Q^{T}AQ = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 10 \end{pmatrix}}. \)</div></div><p><b>点评：</b>① 只有同一特征值的特征向量之间需要正交化，不同特征值的向量已自动正交；② 单位化后按“特征值顺序”排列成 Q；③ 若把 λ=1 的两个向量顺序互换，Λ 中两个 1 的位置不变，答案仍然正确。</p>`
          },
          {
            no: '例 5.8',
            meta: '提高 · 由特征值、特征向量反求 A',
            q: String.raw`设 \( A \) 为 3 阶实对称矩阵，其特征值为 \( 1,2,2 \)。已知属于 \( \lambda = 1 \) 的特征向量为 \( \alpha_1 = (1,1,0)^{T} \)，属于 \( \lambda = 2 \) 的特征向量为 \( \alpha_2 = (1,-1,0)^{T} \) 与 \( \alpha_3 = (0,0,1)^{T} \)。求 \( A \)。`,
            sol: String.raw`<p><b>思路：</b>实对称矩阵可正交对角化：\( A = Q\Lambda Q^{T} \)；等价地可用“谱分解”形式</p><div class="fml"><div class="fml-row">\( A = \lambda_1\frac{\alpha_1\alpha_1^{T}}{\|\alpha_1\|^{2}} + \lambda_2\frac{\alpha_2\alpha_2^{T}}{\|\alpha_2\|^{2}} + \lambda_2\frac{\alpha_3\alpha_3^{T}}{\|\alpha_3\|^{2}}. \)</div></div><p>已核验 \( \alpha_1,\alpha_2,\alpha_3 \) 两两正交（\( \alpha_1\cdot\alpha_2 = 1-1+0 = 0 \)，二者与 \( \alpha_3 \) 的内积均为 0），且 \( \|\alpha_1\|^{2} = 2,\ \|\alpha_2\|^{2} = 2,\ \|\alpha_3\|^{2} = 1 \)。逐项计算：</p><div class="fml"><div class="fml-row">\( \alpha_1\alpha_1^{T} = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 1 & 0 \\ 0 & 0 & 0 \end{pmatrix},\qquad \alpha_2\alpha_2^{T} = \begin{pmatrix} 1 & -1 & 0 \\ -1 & 1 & 0 \\ 0 & 0 & 0 \end{pmatrix},\qquad \alpha_3\alpha_3^{T} = \begin{pmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix}. \)</div></div><p>于是</p><div class="fml"><div class="fml-row">\( A = 1\cdot\frac{1}{2}\begin{pmatrix} 1 & 1 & 0 \\ 1 & 1 & 0 \\ 0 & 0 & 0 \end{pmatrix} + 2\cdot\frac{1}{2}\begin{pmatrix} 1 & -1 & 0 \\ -1 & 1 & 0 \\ 0 & 0 & 0 \end{pmatrix} + 2\cdot\begin{pmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix} = \begin{pmatrix} \frac{3}{2} & -\frac{1}{2} & 0 \\ -\frac{1}{2} & \frac{3}{2} & 0 \\ 0 & 0 & 2 \end{pmatrix}. \)</div></div><p><b>核验：</b>\( A\alpha_1 = (\frac{3}{2}-\frac{1}{2},\ -\frac{1}{2}+\frac{3}{2},\ 0)^{T} = (1,1,0)^{T} = 1\cdot\alpha_1 \) ✓；\( A\alpha_2 = (\frac{3}{2}+\frac{1}{2},\ -\frac{1}{2}-\frac{1}{2},\ 0)^{T} = (2,-2,0)^{T} = 2\alpha_2 \) ✓；\( A\alpha_3 = (0,0,2)^{T} = 2\alpha_3 \) ✓。</p><p><b>点评：</b>谱分解公式的含义是“把 A 拆成在各规范正交方向上的伸缩之和”；只要给出的特征向量已经两两正交（题目给全了重根的全部向量），就可以直接套用，无需再算逆矩阵。</p>`
          }
        ],
        pitfalls: [
          String.raw`把正交化用错对象：只有同一特征值的多个特征向量之间需要施密特正交化；不同特征值的向量已自动正交。`,
          String.raw`忘记单位化：题目要求“正交矩阵”时，Q 的每一列长度必须为 1；只正交化不单位化得到的是正交矩阵的“倍数”。`,
          String.raw`\( Q \) 的列顺序与 \( \Lambda \) 的对角元顺序必须一致；重根时同特征值的列可以互换，但不同特征值的列不能错位。`,
          String.raw`“实对称矩阵必可对角化”是结论，但用于“求 Q”时仍必须把特征向量算对（尤其是重根的基础解系），不能只凭对称性就省步骤。`,
          String.raw`把“属于不同特征值的特征向量正交”误用到一般矩阵上；该性质以“实对称”为前提。`
        ]
      }
    ]
  };
})(window);
