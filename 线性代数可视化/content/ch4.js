/* ============================================================
   ch4.js — 第四章 线性方程组
   考研数学（一）· 线性代数 · 可视化学习内容数据
   约定：块对象由 assets/js/app.js 的 renderBlock 渲染；
         公式用 \( \)（行内）与 \[ \]（行间）；
         viz 的 build 字段取自 window.WIDGETS 中已注册的组件名。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH4 = {
    id: 'ch4',
    no: '四',
    title: '线性方程组',
    subtitle: '克拉默法则给出行列式解法，秩给出有无解的判据，基础解系给出通解的结构',
    tags: ['克拉默法则', '齐次方程组', '基础解系', '解空间', '通解结构', '增广矩阵'],
    sections: [

      /* ================================================================
         4.1 克拉默法则
         ================================================================ */
      {
        id: 'ch4-s1',
        num: '4.1',
        title: '克拉默法则',
        lead: '大纲要求：会用克拉默法则。它用行列式给出了“方程个数 = 未知数个数”时方程组的唯一解公式，是行列式理论在方程组上的直接应用，也是判断唯一解的一把快刀。',
        blocks: [
          { t: 'h3', idx: '①', text: '克拉默（Cramer）法则' },
          { t: 'card', kind: 'thm', tag: '定理', title: '克拉默法则', html: String.raw`<p class="tight">设 n 个方程、n 个未知数的线性方程组</p><div class="fml-row">\( \begin{cases} a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1, \\ a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2, \\ \qquad \cdots\cdots \\ a_{n1}x_1 + a_{n2}x_2 + \cdots + a_{nn}x_n = b_n \end{cases} \)</div><p class="tight">的系数行列式 \( D = |A| \neq 0 \)，则方程组有<b>唯一解</b></p><div class="fml-row">\( x_1 = \dfrac{D_1}{D},\quad x_2 = \dfrac{D_2}{D},\quad \cdots,\quad x_n = \dfrac{D_n}{D}, \)</div><p class="tight">其中 \( D_j \) 是把 \( D \) 的第 \( j \) 列换成常数列 \( (b_1,b_2,\cdots,b_n)^{T} \) 后得到的 n 阶行列式。</p>` },
          { t: 'card', kind: 'key', tag: '推论', title: '齐次方程组的克拉默判别', html: String.raw`<p class="tight">对 n 个方程 n 个未知数的齐次方程组 \( Ax = 0 \)：</p><ul class="none"><li>\( D \neq 0 \Rightarrow \) 只有零解（此时零解就是唯一解）；</li><li>有非零解 \( \Rightarrow D = 0 \)（即 \( |A| = 0 \)）。</li></ul><p class="tight">注意后一条只给出“必要条件”：\( D = 0 \) 时还要看秩才能确定非零解是否存在（见 4.2）。</p>` },
          { t: 'card', kind: 'warn', tag: '注意', title: '使用克拉默法则的三个前提', html: String.raw`<ul class="none"><li><b>方程个数必须等于未知数个数</b>（否则根本没有 \( D \)）；</li><li><b>系数行列式必须非零</b>，此时才保证唯一解；</li><li>\( D = 0 \) 时克拉默法则<b>失效</b>：既可能无解，也可能有无穷多解，必须改用秩判别（4.3 节）。</li></ul>` },
          { t: 'h3', idx: '②', text: '克拉默法则的用途' },
          { t: 'list', items: [
            String.raw`<b>求唯一解：</b>只需计算 \( n+1 \) 个 n 阶行列式，适合低阶（2、3 阶）方程组的精确求解。`,
            String.raw`<b>判断唯一解：</b>只要 \( D \neq 0 \) 就可直接断言“有唯一解”，无需真正解出。`,
            String.raw`<b>反求系数或参数：</b>把已知的解代入解公式，或利用“有非零解 \( \Rightarrow D = 0 \)”反求参数。`,
            String.raw`<b>理论推导：</b>证明与唯一解、齐次方程组有关的抽象命题。`
          ] },
          { t: 'viz', build: 'gaussSolve', title: '方程组求解可视化', sub: '观察系数行列式非零 / 为零时解集的变化：一点、无穷多点或空集' },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 用克拉默法则解 2 阶或 3 阶方程组；② 由“方程组有非零解”求参数；③ 与行列式的计算结合（如一整道填空题的流程为：写出 \( D \)、\( D_j \)，再作商）；④ 证明题中说明“唯一解”。</p>` }
        ],
        examples: [
          {
            no: '例 4.1',
            meta: '基础 · 克拉默法则求解',
            q: String.raw`用克拉默法则解线性方程组 \( \begin{cases} x_1 + x_2 + x_3 = 6, \\ 2x_1 - x_2 + x_3 = 3, \\ x_1 + x_2 - x_3 = 0. \end{cases} \)`,
            sol: String.raw`<p>先算系数行列式：</p><div class="fml"><div class="fml-row">\( D = \begin{vmatrix} 1 & 1 & 1 \\ 2 & -1 & 1 \\ 1 & 1 & -1 \end{vmatrix} = 1\times(1-1) - 1\times(-2-1) + 1\times(2+1) = 0 + 3 + 3 = 6 \neq 0. \)</div></div><p>系数行列式非零，方程组有唯一解，且可用克拉默法则。逐个把常数列替换相应列：</p><div class="fml"><div class="fml-row">\( D_1 = \begin{vmatrix} 6 & 1 & 1 \\ 3 & -1 & 1 \\ 0 & 1 & -1 \end{vmatrix} = 6, \qquad D_2 = \begin{vmatrix} 1 & 6 & 1 \\ 2 & 3 & 1 \\ 1 & 0 & -1 \end{vmatrix} = 12, \qquad D_3 = \begin{vmatrix} 1 & 1 & 6 \\ 2 & -1 & 3 \\ 1 & 1 & 0 \end{vmatrix} = 18. \)</div></div><p>计算示例（以 \( D_2 \) 为例，按第 3 行展开）：\( D_2 = 1\times\begin{vmatrix} 6 & 1 \\ 3 & 1 \end{vmatrix} - 0 + (-1)\times\begin{vmatrix} 1 & 6 \\ 2 & 3 \end{vmatrix} = (6-3) - (3-12) = 3 + 9 = 12 \)。</p><p>于是</p><div class="fml"><div class="fml-row">\( x_1 = \frac{D_1}{D} = 1,\qquad x_2 = \frac{D_2}{D} = 2,\qquad x_3 = \frac{D_3}{D} = 3. \)</div></div><p><b>核验：</b>把 \( (1,2,3) \) 代入：\( 1+2+3 = 6 \) ✓；\( 2-2+3 = 3 \) ✓；\( 1+2-3 = 0 \) ✓。</p>`
          },
          {
            no: '例 4.2',
            meta: '提高 · 用克拉默法则反求参数',
            q: String.raw`问 \( \lambda \) 取何值时，齐次线性方程组 \( \begin{cases} (1-\lambda)x_1 + x_2 + x_3 = 0, \\ x_1 + (1-\lambda)x_2 + x_3 = 0, \\ x_1 + x_2 + (1-\lambda)x_3 = 0 \end{cases} \) 有非零解？`,
            sol: String.raw`<p>n 个方程 n 个未知数的齐次方程组有非零解的必要条件是系数行列式为零。计算</p><div class="fml"><div class="fml-row">\( D = \begin{vmatrix} 1-\lambda & 1 & 1 \\ 1 & 1-\lambda & 1 \\ 1 & 1 & 1-\lambda \end{vmatrix}. \)</div></div><p>这是第一章的“主对角线为 \( x \) 的 a 型行列式”（\( x = 1-\lambda,\ a = 1,\ n = 3 \)），于是</p><div class="fml"><div class="fml-row">\( D = \left[(1-\lambda) + 2\times1\right]\left[(1-\lambda)-1\right]^{2} = (3-\lambda)(-\lambda)^{2} = \lambda^{2}(3-\lambda). \)</div></div><p>令 \( D = 0 \) 得 \( \lambda = 0 \) 或 \( \lambda = 3 \)。</p><p><b>还要确认此时确有非零解：</b>当 \( \lambda = 0 \) 时系数矩阵为 \( \begin{pmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{pmatrix} \)，秩为 1，远小于 3，必有非零解；当 \( \lambda = 3 \) 时系数矩阵为 \( \begin{pmatrix} -2 & 1 & 1 \\ 1 & -2 & 1 \\ 1 & 1 & -2 \end{pmatrix} \)，其秩为 2（三行之和为零向量），也有非零解。</p><p><b>结论：</b>\( \lambda = 0 \) 或 \( \lambda = 3 \) 时方程组有非零解。</p><p><b>点评：</b>由“有非零解”只能推出 \( D = 0 \)；反之 \( D = 0 \) 时是否真有非零解，需要再验证秩（本题两种情况都验证了）。这与“\( |A| = 0 \) 与相关性的关系”完全一致的思路。</p>`
          }
        ],
        pitfalls: [
          String.raw`克拉默法则只适用于“方程个数 = 未知数个数”的方程组；3 个方程 4 个未知数之类的题目必须改用秩判别。`,
          String.raw`只有 \( D \neq 0 \) 才能用克拉默法则；\( D = 0 \) 时不能断言“无解”也不能断言“有无穷多解”，必须用秩判断。`,
          String.raw`\( D_j \) 是用常数列替换 \( D \) 的第 \( j \) 列（不是第 j 行）；列的编号与未知量的编号对应。`,
          String.raw`齐次方程组的方向性：由“有非零解”推 \( D = 0 \) 成立，但由 \( D = 0 \) 推“有非零解”还需验证秩，不能想当然。`
        ]
      },

      /* ================================================================
         4.2 齐次线性方程组
         ================================================================ */
      {
        id: 'ch4-s2',
        num: '4.2',
        title: '齐次线性方程组',
        lead: '大纲要求：理解齐次线性方程组有非零解的充分必要条件；理解基础解系、通解及解空间的概念，掌握基础解系和通解的求法。齐次方程组的解集是一个向量空间，其维数等于自由未知量的个数，这是本节的核心结论。',
        blocks: [
          { t: 'h3', idx: '①', text: '齐次方程组与有非零解的判据' },
          { t: 'card', kind: 'def', tag: '定义', title: '齐次线性方程组', html: String.raw`<p class="tight">常数项全为零的方程组 \( Ax = 0 \)（\( A \) 为 \( m\times n \) 矩阵，\( x \) 为 n 维未知向量）称为<b>齐次线性方程组</b>。它<b>必有零解</b> \( x = 0 \)（称为平凡解）；非零解（若有）称为非平凡解。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '有非零解的充分必要条件', html: String.raw`<p class="tight">设 \( A \) 为 \( m\times n \) 矩阵，则</p><div class="fml-row">\( Ax = 0 \text{ 有非零解} \iff r(A) \lt n; \qquad Ax = 0 \text{ 只有零解} \iff r(A) = n. \)</div><p class="tight">当 \( m \lt n \)（方程个数少于未知数个数）时，必有 \( r(A) \le m \lt n \)，因此<b>必有非零解</b>——这是选择题的常客。</p>` },
          { t: 'table', head: ['等价说法', '内容'], rows: [
            [String.raw`用秩`, String.raw`\( r(A) \lt n \iff Ax = 0 \) 有非零解`],
            [String.raw`用列向量`, String.raw`\( A \) 的列向量组线性相关 \( \iff Ax = 0 \) 有非零解`],
            [String.raw`用行列式（m = n）`, String.raw`\( |A| = 0 \iff Ax = 0 \) 有非零解`],
            [String.raw`用秩（A 为 n 阶）`, String.raw`\( r(A) \lt n \iff A \) 不可逆 \( \iff Ax = 0 \) 有非零解`],
            ['特例', String.raw`\( m \lt n \) 时必有非零解；含零列或成比例列时必有非零解`]
          ] },
          { t: 'h3', idx: '②', text: '基础解系与解空间' },
          { t: 'card', kind: 'def', tag: '定义', title: '基础解系', html: String.raw`<p class="tight">设 \( \xi_1,\xi_2,\cdots,\xi_{t} \) 是齐次方程组 \( Ax = 0 \) 的一组解向量，若：① 它们线性无关；② 方程组的任一解都可由它们线性表示。则称 \( \xi_1,\cdots,\xi_{t} \) 为该方程组的一个<b>基础解系</b>。</p><p class="tight">基础解系不唯一，但所含向量的个数唯一确定，等于 \( n - r(A) \)。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '基础解系的个数与通解', html: String.raw`<p class="tight">设 \( r(A) = r \lt n \)，则 \( Ax = 0 \) 的基础解系恰含 \( n - r \) 个解向量 \( \xi_1,\cdots,\xi_{n-r} \)，且方程组的<b>通解</b>为</p><div class="fml-row">\( x = k_1\xi_1 + k_2\xi_2 + \cdots + k_{n-r}\xi_{n-r},\qquad k_1,\cdots,k_{n-r} \in \mathbb{R}. \)</div><p class="tight">可以证明这 \( n-r \) 个向量线性无关（自由未知量取单位向量赋值），并且任意解都可由它们表示，因此“含 \( n-r \) 个向量的解组”就是基础解系。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: '解空间', html: String.raw`<p class="tight">齐次方程组 \( Ax = 0 \) 的全部解向量构成的集合</p><div class="fml-row">\( N(A) = \{\, x \in \mathbb{R}^{n} \mid Ax = 0 \,\} \)</div><p class="tight">是 \( \mathbb{R}^{n} \) 的一个<b>子空间</b>（对加法与数乘封闭），称为<b>解空间</b>（或零空间）。并且</p><div class="fml-row">\( \dim N(A) = n - r(A). \)</div><p class="tight">基础解系就是解空间的一组基；\( n - r(A) \) 就是自由未知量的个数。</p>` },
          { t: 'h3', idx: '③', text: '求基础解系与通解的标准流程' },
          { t: 'list', ordered: true, items: [
            String.raw`写出系数矩阵 \( A \)，只用初等<b>行</b>变换把它化为<b>行最简形</b>。`,
            String.raw`由非零行数得 \( r(A) = r \)，若 \( r = n \) 则只有零解，结束；否则继续。`,
            String.raw`确定主元列（对应“约束未知量”）与自由未知量（非主元列），自由未知量共 \( n - r \) 个。`,
            String.raw`依次令自由未知量取标准单位向量 \( (1,0,\cdots,0),(0,1,\cdots,0),\cdots \)，解出约束未知量，得到基础解系 \( \xi_1,\cdots,\xi_{n-r} \)。`,
            String.raw`写出通解 \( x = k_1\xi_1 + \cdots + k_{n-r}\xi_{n-r} \)，并注明 \( k_i \) 为任意常数。`
          ] },
          { t: 'viz', build: 'solutionStructure', title: '解空间结构演示', sub: '观察基础解系如何张成解空间：直线、平面或整个空间' },
          { t: 'viz', build: 'solutionSpace', title: '解空间的维数 n − r(A)', sub: '逐步化简系数矩阵，数出主元与自由未知量，观察解空间是直线、平面还是仅含零向量' },
          { t: 'card', kind: 'key', tag: '性质', title: '齐次方程组解的三条基本性质', html: String.raw`<ul class="none"><li>若 \( \xi,\eta \) 是 \( Ax = 0 \) 的解，则 \( \xi+\eta \) 也是解（线性组合仍是解）。</li><li>若 \( \xi \) 是解，\( k \) 为数，则 \( k\xi \) 也是解；因此解集对一切线性组合封闭。</li><li>基础解系与原方程组的秩互补：解空间维数 \( + r(A) = n \)。</li></ul>` },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 求基础解系与通解（大题必考）；② 判断“有无非零解”并说明理由；③ 已知基础解系反求矩阵或参数；④ 与向量组线性相关性、矩阵的秩综合考查。</p>` }
        ],
        examples: [
          {
            no: '例 4.3',
            meta: '基础 · 求基础解系与通解',
            q: String.raw`求齐次线性方程组 \( \begin{cases} x_1 + x_2 + 2x_3 + 3x_4 = 0, \\ 2x_1 + 2x_2 + 5x_3 + 8x_4 = 0, \\ 3x_1 + 3x_2 + 7x_3 + 11x_4 = 0 \end{cases} \) 的基础解系与通解。`,
            sol: String.raw`<p>对系数矩阵作初等行变换：</p><div class="fml"><div class="fml-row">\( A = \begin{pmatrix} 1 & 1 & 2 & 3 \\ 2 & 2 & 5 & 8 \\ 3 & 3 & 7 & 11 \end{pmatrix} \xrightarrow{\ r_2-2r_1,\ r_3-3r_1\ } \begin{pmatrix} 1 & 1 & 2 & 3 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 1 & 2 \end{pmatrix} \xrightarrow{\ r_3-r_2,\ r_1-2r_2\ } \begin{pmatrix} 1 & 1 & 0 & -1 \\ 0 & 0 & 1 & 2 \\ 0 & 0 & 0 & 0 \end{pmatrix}. \)</div></div><p>已是行最简形，\( r(A) = 2 \)，未知量个数 \( n = 4 \)，故基础解系含 \( n - r = 2 \) 个向量。主元在第 1、3 列，自由未知量为 \( x_2,x_4 \)，对应的方程为</p><div class="fml"><div class="fml-row">\( \begin{cases} x_1 = -x_2 + x_4, \\ x_3 = -2x_4. \end{cases} \)</div></div><p>取 \( (x_2,x_4) = (1,0) \)：\( \xi_1 = (-1,1,0,0)^{T} \)；取 \( (x_2,x_4) = (0,1) \)：\( \xi_2 = (1,0,-2,1)^{T} \)。</p><p>基础解系为</p><div class="fml"><div class="fml-row">\( \mathbf{\xi_1 = (-1,1,0,0)^{T},\qquad \xi_2 = (1,0,-2,1)^{T}}, \)</div></div><p>通解为</p><div class="fml"><div class="fml-row">\( \mathbf{x = k_1\xi_1 + k_2\xi_2 = k_1(-1,1,0,0)^{T} + k_2(1,0,-2,1)^{T}},\qquad k_1,k_2 \in \mathbb{R}. \)</div></div><p><b>核验：</b>把 \( \xi_2 \) 代入第一式：\( 1 + 0 + 2\times(-2) + 3\times1 = 0 \) ✓；代入第二式：\( 2 + 0 - 10 + 8 = 0 \) ✓；第三式：\( 3 + 0 - 14 + 11 = 0 \) ✓。</p>`
          },
          {
            no: '例 4.4',
            meta: '提高 · 由解反推矩阵的性质',
            q: String.raw`设 3 阶矩阵 \( A = (\alpha_1,\alpha_2,\alpha_3) \)（\( \alpha_i \) 为 A 的列向量），已知 \( \xi = (1,-2,1)^{T} \) 是齐次方程组 \( Ax = 0 \) 的非零解。求 \( r(A) \) 的最大可能值，并说明 \( \alpha_1,\alpha_2,\alpha_3 \) 之间的线性关系；再写出一个满足条件的矩阵 \( A \)。`,
            sol: String.raw`<p><b>第一步：把解代入。</b>由 \( A\xi = 0 \) 得</p><div class="fml"><div class="fml-row">\( \alpha_1\times1 + \alpha_2\times(-2) + \alpha_3\times1 = 0,\qquad \text{即}\quad \alpha_1 - 2\alpha_2 + \alpha_3 = 0. \)</div></div><p>所以 \( \alpha_1,\alpha_2,\alpha_3 \) 线性相关，\( |A| = 0 \)，从而 \( r(A) \le 2 \)。</p><p><b>第二步：定出上界。</b>又因为 \( \xi \neq 0 \) 说明零空间维数 \( n - r(A) \ge 1 \)，同样得到 \( r(A) \le 2 \)。空出 1 个自由度，故 \( r(A) \) 的最大值为</p><div class="fml"><div class="fml-row">\( \mathbf{r(A) = 2\quad(\text{当 } \xi \text{ 恰好张成整个解空间，即 } \dim N(A) = 1 \text{ 时取得})}. \)</div></div><p><b>第三步：举例。</b>取 \( \alpha_1 = (1,0,0)^{T} \)，\( \alpha_2 = (0,1,0)^{T} \)，则由 \( \alpha_3 = 2\alpha_2 - \alpha_1 = (-1,2,0)^{T} \)，得</p><div class="fml"><div class="fml-row">\( A = \begin{pmatrix} 1 & 0 & -1 \\ 0 & 1 & 2 \\ 0 & 0 & 0 \end{pmatrix}. \)</div></div><p><b>核验：</b>\( A\xi = (1-1,\ -2+2,\ 0)^{T} = (0,0,0)^{T} \) ✓，且 \( r(A) = 2 \)（前两行线性无关），此时 \( \dim N(A) = 3 - 2 = 1 \)，\( \xi \) 恰好构成基础解系。</p><p><b>点评：</b>“\( A\xi = 0 \)”等价于“\( \xi \) 与 A 的每一行正交”，也等价于“\( \xi \) 是 A 的列向量的一个线性关系”。三个视角之间要能自由切换。</p>`
          }
        ],
        pitfalls: [
          String.raw`把 \( r(A) \) 与 \( n \) 比较，而不是与方程个数 \( m \) 比较：有非零解的判据是 \( r(A) \lt n \)（n 为未知量个数）。`,
          String.raw`基础解系含 \( n - r(A) \) 个向量，别少写或多写；若求得 \( r = n \) 应回答“只有零解”。`,
          String.raw`自由未知量的赋值方式：必须取标准单位向量（每次只令一个为 1、其余为 0），这样求出的解向量自动线性无关；不能随意取值。`,
          String.raw`通解中要写出任意常数 \( k_1,k_2,\cdots \)，“\( k \) 为任意常数”的说明不能漏；基础解系本身不是通解。`
        ]
      },
      /* ================================================================
         4.3 非齐次线性方程组
         ================================================================ */
      {
        id: 'ch4-s3',
        num: '4.3',
        title: '非齐次线性方程组',
        lead: '大纲要求：理解非齐次线性方程组有解的充分必要条件；理解解的结构及通解的概念；掌握用初等行变换求解线性方程组的方法。非齐次方程组的解集是“一个特解平移后的齐次解空间”，这一结构是本节的灵魂。',
        blocks: [
          { t: 'h3', idx: '①', text: '有解的充分必要条件' },
          { t: 'card', kind: 'def', tag: '记号', title: '增广矩阵', html: String.raw`<p class="tight">对非齐次方程组 \( Ax = b \)（\( A \) 为 \( m\times n \)，\( b \neq 0 \)），把 \( b \) 添在 \( A \) 的右边得到 \( m\times(n+1) \) 矩阵</p><div class="fml-row">\( (A \mid b) = \begin{pmatrix} a_{11} & \cdots & a_{1n} & b_1 \\ \vdots & & \vdots & \vdots \\ a_{m1} & \cdots & a_{mn} & b_m \end{pmatrix}, \)</div><p class="tight">称为<b>增广矩阵</b>。对方程组作初等行变换等价于对增广矩阵作初等行变换。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '有解判据与解的个数', html: String.raw`<p class="tight">设 \( r(A) = r,\ r(A \mid b) = \bar{r} \)，则</p><ul class="none"><li>\( Ax = b \) 有解 \( \iff r(A) = r(A \mid b) \)；无解 \( \iff r(A) \lt r(A \mid b) \)（此时 \( \bar{r} = r+1 \)）。</li><li>有解时：\( r = n \Rightarrow \) 唯一解；\( r \lt n \Rightarrow \) 无穷多解，且通解含 \( n - r \) 个任意常数。</li></ul>` },
          { t: 'table', head: ['秩的关系', '解的情形', '几何直观（以 3 元为例）'], rows: [
            [String.raw`\( r(A) = r(A \mid b) = n \)`, '唯一解', '三个平面交于一点'],
            [String.raw`\( r(A) = r(A \mid b) \lt n \)`, String.raw`无穷多解（含 \( n-r \) 个自由参数）`, '三个平面交于一条直线或重合于一个面'],
            [String.raw`\( r(A) \lt r(A \mid b) \)`, '无解', '平面两两相交但无公共点（如三棱柱面）']
          ] },
          { t: 'h3', idx: '②', text: '解的性质' },
          { t: 'card', kind: 'key', tag: '性质', title: '五个必须掌握的结论', html: String.raw`<ul class="none"><li>若 \( \eta_1,\eta_2 \) 都是 \( Ax = b \) 的解，则 \( \eta_1 - \eta_2 \) 是导出组 \( Ax = 0 \) 的解。</li><li>若 \( \eta^{*} \) 是 \( Ax = b \) 的解、\( \xi \) 是 \( Ax = 0 \) 的解，则 \( \eta^{*} + \xi \) 仍是 \( Ax = b \) 的解。</li><li>若 \( \eta_1,\cdots,\eta_s \) 是 \( Ax = b \) 的解，则 \( k_1\eta_1 + \cdots + k_s\eta_s \) 是 \( Ax = b \) 的解 \( \iff \sum k_i = 1 \)；是 \( Ax = 0 \) 的解 \( \iff \sum k_i = 0 \)。</li><li>非齐次方程组的解集<b>不是向量空间</b>（不含零向量，对加法与数乘不封闭）。</li><li>若 \( Ax = b \) 有无穷多解，则其任意两个不同解的差是 \( Ax = 0 \) 的非零解。</li></ul>` },
          { t: 'h3', idx: '③', text: '通解的结构' },
          { t: 'card', kind: 'thm', tag: '定理', title: '非齐次通解 = 特解 + 导出组通解', html: String.raw`<p class="tight">设 \( r(A) = r \lt n \)，\( \eta^{*} \) 是 \( Ax = b \) 的任一解（称为<b>特解</b>），\( \xi_1,\cdots,\xi_{n-r} \) 是导出组 \( Ax = 0 \) 的基础解系，则 \( Ax = b \) 的<b>通解</b>为</p><div class="fml-row">\( x = \eta^{*} + k_1\xi_1 + k_2\xi_2 + \cdots + k_{n-r}\xi_{n-r},\qquad k_i \in \mathbb{R}. \)</div><p class="tight">要点：特解可以任取（只要满足方程）；齐次部分必须写完整（\( n-r \) 个向量）；常数 \( k_i \) 的个数与自由未知量个数相同。</p>` },
          { t: 'h3', idx: '④', text: '求解标准流程' },
          { t: 'list', ordered: true, items: [
            String.raw`写出增广矩阵 \( (A \mid b) \)，只用初等行变换化为行最简形。`,
            String.raw`比较 \( r(A) \) 与 \( r(A \mid b) \)：若 \( r(A) \lt r(A \mid b) \)，说明出现“\( 0 = \text{非零常数} \)”的矛盾行，方程组无解，结束。`,
            String.raw`若 \( r(A) = r(A \mid b) = r \)：当 \( r = n \) 时直接回代得唯一解；当 \( r \lt n \) 时继续。`,
            String.raw`确定自由未知量（非主元列），令所有自由未知量取 0，解出主元未知量，得到特解 \( \eta^{*} \)。`,
            String.raw`再按 4.2 节的办法求导出组的基础解系 \( \xi_1,\cdots,\xi_{n-r} \)。`,
            String.raw`写出通解 \( x = \eta^{*} + k_1\xi_1 + \cdots + k_{n-r}\xi_{n-r} \)，注明 \( k_i \) 为任意常数。`
          ] },
          { t: 'viz', build: 'gaussSolve', title: '增广矩阵行变换求解', sub: '从阶梯形读出秩与解的情况' },
          { t: 'viz', build: 'solutionStructure', title: '特解 + 齐次通解的结构', sub: '观察解集是过特解的一“仿射”集合：点、直线或平面' },
          { t: 'h3', idx: '⑤', text: '矩阵方程 AX = B' },
          { t: 'card', kind: 'key', tag: '推广', title: '从方程组到矩阵方程', html: String.raw`<ul class="none"><li>\( AX = B \) 有解 \( \iff r(A) = r(A \mid B) \)；其中 \( B \) 的每一列都要单独满足判据，合起来就是同一个条件。</li><li>若 \( X_0 \) 是 \( AX = B \) 的一个解，则通解为 \( X = X_0 + Y \)，其中 \( Y \) 取遍 \( AY = O \) 的全部解。</li><li>当 \( A \) 可逆时，\( AX = B \) 有唯一解 \( X = A^{-1}B \)。</li></ul>` },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 含参数讨论：无解、唯一解、无穷多解（解答题高频，必须分类完整）；② 已知两个特解求通解；③ 由解的结构反求 \( r(A) \) 或矩阵 \( A \)；④ 用解的性质证明抽象命题（如 \( \eta_1-\eta_2 \) 是齐次解）。</p>` }
        ],
        examples: [
          {
            no: '例 4.5',
            meta: '重点 · 含参数三分类讨论',
            q: String.raw`讨论 \( \lambda \) 取何值时，非齐次线性方程组 \( \begin{cases} \lambda x_1 + x_2 + x_3 = 1, \\ x_1 + \lambda x_2 + x_3 = \lambda, \\ x_1 + x_2 + \lambda x_3 = \lambda^{2} \end{cases} \) 有唯一解、无解、无穷多解？有无穷多解时求出通解。`,
            sol: String.raw`<p>系数行列式（第一章 a 型结论）：</p><div class="fml"><div class="fml-row">\( D = \begin{vmatrix} \lambda & 1 & 1 \\ 1 & \lambda & 1 \\ 1 & 1 & \lambda \end{vmatrix} = (\lambda + 2)(\lambda - 1)^{2}. \)</div></div><p><b>情形一：\( \lambda \neq 1 \) 且 \( \lambda \neq -2 \)。</b>\( D \neq 0 \)，由克拉默法则，方程组有<b>唯一解</b>。</p><p><b>情形二：\( \lambda = -2 \)。</b>此时增广矩阵为</p><div class="fml"><div class="fml-row">\( (A \mid b) = \begin{pmatrix} -2 & 1 & 1 & 1 \\ 1 & -2 & 1 & -2 \\ 1 & 1 & -2 & 4 \end{pmatrix} \xrightarrow{\ r_1 \leftrightarrow r_2\ } \begin{pmatrix} 1 & -2 & 1 & -2 \\ -2 & 1 & 1 & 1 \\ 1 & 1 & -2 & 4 \end{pmatrix} \xrightarrow{\ r_2+2r_1,\ r_3-r_1\ } \begin{pmatrix} 1 & -2 & 1 & -2 \\ 0 & -3 & 3 & -3 \\ 0 & 3 & -3 & 6 \end{pmatrix} \)</div><div class="fml-row">\( \xrightarrow{\ r_3+r_2\ } \begin{pmatrix} 1 & -2 & 1 & -2 \\ 0 & -3 & 3 & -3 \\ 0 & 0 & 0 & 3 \end{pmatrix}. \)</div></div><p>最后一行表示 \( 0\cdot x_1 + 0\cdot x_2 + 0\cdot x_3 = 3 \)，矛盾。故 \( r(A) = 2 \lt r(A \mid b) = 3 \)，方程组<b>无解</b>。</p><p><b>情形三：\( \lambda = 1 \)。</b>此时三个方程都化为 \( x_1 + x_2 + x_3 = 1 \)，</p><div class="fml"><div class="fml-row">\( (A \mid b) \longrightarrow \begin{pmatrix} 1 & 1 & 1 & 1 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix},\qquad r(A) = r(A \mid b) = 1 \lt n = 3. \)</div></div><p>方程组<b>有无穷多解</b>，自由未知量为 \( x_2,x_3 \)，一个特解 \( \eta^{*} = (1,0,0)^{T} \)，导出组基础解系 \( \xi_1 = (-1,1,0)^{T},\ \xi_2 = (-1,0,1)^{T} \)。通解为</p><div class="fml"><div class="fml-row">\( \mathbf{x = (1,0,0)^{T} + k_1(-1,1,0)^{T} + k_2(-1,0,1)^{T}},\qquad k_1,k_2 \in \mathbb{R}. \)</div></div><p><b>点评：</b>当 \( D = 0 \) 时要回到增广矩阵逐一验证，区分“无解”与“无穷多解”；讨论时必须三种情形齐全。</p>`
          },
          {
            no: '例 4.6',
            meta: '提高 · 由特解求通解',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 1 & 0 \\ 0 & 1 & -1 \\ 0 & 0 & 0 \end{pmatrix} \)，\( b = \begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix} \)。已知 \( \eta_1 = (1,0,0)^{T} \) 与 \( \eta_2 = (0,1,1)^{T} \) 都是方程组 \( Ax = b \) 的解，求其通解。`,
            sol: String.raw`<p><b>第一步：核验与定秩。</b>\( A \) 的前两行线性无关、第三行为零，故 \( r(A) = 2 \)，且 \( n = 3 \)，导出组 \( Ax = 0 \) 的基础解系恰含 \( n - r = 1 \) 个向量。</p><p><b>第二步：求齐次解。</b>由解的性质，两个解之差是导出组的解：</p><div class="fml"><div class="fml-row">\( \xi = \eta_1 - \eta_2 = (1,0,0)^{T} - (0,1,1)^{T} = (1,-1,-1)^{T}. \)</div></div><p>核验 \( A\xi = 0 \)：第一行 \( 1-1+0 = 0 \) ✓；第二行 \( 0-1+1 = 0 \) ✓。\( \xi \neq 0 \) 且解空间是 1 维的，故 \( \xi \) 就是基础解系。</p><p><b>第三步：写通解。</b>取特解 \( \eta^{*} = \eta_1 = (1,0,0)^{T} \)（也可取 \( \eta_2 \)），于是</p><div class="fml"><div class="fml-row">\( \mathbf{x = \eta^{*} + k\xi = (1,0,0)^{T} + k(1,-1,-1)^{T}},\qquad k \in \mathbb{R}. \)</div></div><p><b>核验：</b>\( A x = A\eta^{*} + kA\xi = b + 0 = b \) ✓。当 \( k = -1 \) 时 \( x = (0,1,1)^{T} = \eta_2 \)；当 \( k = 0 \) 时 \( x = \eta_1 \)，与已知两个解吻合。</p><p><b>点评：</b>“任意两个解之差是齐次解”是构造基础解系的常用手段；当题目只给两个特解、而 \( n - r = 2 \) 时，就还需要第三个特解来凑出第二个无关的齐次解，此时应结合 \( r(A) \) 判断是否信息不足。</p>`
          }
        ],
        pitfalls: [
          String.raw`有解的判据是 \( r(A) = r(A \mid b) \)，两者必须<b>分别</b>算清楚；只算系数矩阵的秩就下结论是常见错误。`,
          String.raw`当 \( r(A) = r(A \mid b) = r \lt n \) 时才有无穷多解；若 \( r = n \) 是唯一解，若 \( r(A) \lt r(A \mid b) \) 则无解，三种情形的边界要分清。`,
          String.raw`通解中“特解 + 齐次通解”两项都不能少；把特解写成齐次通解的一部分，或漏掉任意常数，都会失分。`,
          String.raw`非齐次解作线性组合时要注意系数和：\( \sum k_i = 1 \) 的解仍是 \( Ax = b \) 的解，\( \sum k_i = 0 \) 才是 \( Ax = 0 \) 的解，其余情况什么都不是。`,
          String.raw`非齐次方程组的解集不是子空间（不含零向量），不要套用“解空间维数”的说法；维数公式 \( n - r(A) \) 描述的是导出组的解空间。`
        ]
      }
    ]
  };
})(window);
