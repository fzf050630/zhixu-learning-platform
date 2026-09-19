/* ============================================================
   ch3.js — 第三章 向量
   考研数学（一）· 线性代数 · 可视化学习内容数据
   约定：块对象由 assets/js/app.js 的 renderBlock 渲染；
         公式用 \( \)（行内）与 \[ \]（行间）；
         viz 的 build 字段取自 window.WIDGETS 中已注册的组件名。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH3 = {
    id: 'ch3',
    no: '三',
    title: '向量',
    subtitle: '向量组的相关性、秩与空间结构：把方程组的解、矩阵的列张成与几何直觉统一为同一件事',
    tags: ['n 维向量', '线性组合', '线性相关', '极大无关组', '向量组的秩', '过渡矩阵', '施密特正交化', '正交矩阵'],
    sections: [

      /* ================================================================
         3.1 向量与线性组合
         ================================================================ */
      {
        id: 'ch3-s1',
        num: '3.1',
        title: '向量与线性组合',
        lead: '大纲要求：理解 n 维向量、向量的线性组合与线性表示的概念。本节把“能否用已知的向量拼出目标向量”翻译成方程组的解，并给出向量组等价的判定，为线性相关与秩铺路。',
        blocks: [
          { t: 'h3', idx: '①', text: 'n 维向量及其线性运算' },
          { t: 'card', kind: 'def', tag: '定义', title: 'n 维向量', html: String.raw`<p class="tight">n 个实数组成的有序数组 \( (\alpha_1,\alpha_2,\cdots,\alpha_n) \) 称为一个 <b>n 维向量</b>，其中 \( \alpha_i \) 称为第 i 个分量。写成一行的 \( (\alpha_1,\alpha_2,\cdots,\alpha_n) \) 称为<b>行向量</b>，写成一列的 \( \begin{pmatrix} \alpha_1 \\ \alpha_2 \\ \vdots \\ \alpha_n \end{pmatrix} \) 称为<b>列向量</b>，本书默认向量为列向量。</p><p class="tight">两个向量相等指维数相同且对应分量全相等；分量全为 0 的向量称为<b>零向量</b>，记作 \( 0 \)。向量的加法与数乘按分量进行，统称<b>线性运算</b>，全体 n 维实向量记作 \( \mathbb{R}^{n} \)。</p>` },
          { t: 'h3', idx: '②', text: '线性组合与线性表示' },
          { t: 'card', kind: 'def', tag: '定义', title: '线性组合与线性表示', html: String.raw`<p class="tight">设 \( \alpha_1,\alpha_2,\cdots,\alpha_m \) 是一组 n 维向量，\( k_1,k_2,\cdots,k_m \) 是数，则称</p><div class="fml-row">\( k_1\alpha_1 + k_2\alpha_2 + \cdots + k_m\alpha_m \)</div><p class="tight">为这组向量的一个<b>线性组合</b>。若向量 \( \beta \) 能写成该形式，则称 \( \beta \) 可由 \( \alpha_1,\cdots,\alpha_m \) <b>线性表示</b>，\( k_1,\cdots,k_m \) 称为<b>表示系数</b>。</p><p class="tight">规定：零向量可由任何向量组线性表示（系数全取 0）；向量组中每个向量都可由该组表示（第 i 个系数取 1、其余取 0）。</p>` },
          { t: 'card', kind: 'key', tag: '矩阵语言', title: '线性表示的矩阵形式', html: String.raw`<p class="tight">把 \( \alpha_1,\cdots,\alpha_m \) 按列排成矩阵 \( A = (\alpha_1,\alpha_2,\cdots,\alpha_m) \)，则</p><div class="fml-row">\( \beta = k_1\alpha_1 + \cdots + k_m\alpha_m \iff Ax = \beta,\qquad x = (k_1,\cdots,k_m)^{T}. \)</div><p class="tight">于是“向量能否被线性表示”与“方程组是否有解”是同一个问题：<b>\( \beta \) 可由 \( \alpha_1,\cdots,\alpha_m \) 线性表示 \( \iff r(A) = r(A,\beta) \)（增广矩阵与系数矩阵同秩）。</b></p>` },
          { t: 'table', head: ['秩的关系', '方程组 \( Ax = \beta \)', '向量语言'], rows: [
            [String.raw`\( r(A) \neq r(A,\beta) \)`, '无解', String.raw`\( \beta \) 不能由 \( \alpha_1,\cdots,\alpha_m \) 线性表示`],
            [String.raw`\( r(A) = r(A,\beta) = m \)`, '有唯一解', String.raw`\( \beta \) 可由该组唯一表示，且此时 \( \alpha_1,\cdots,\alpha_m \) 线性无关`],
            [String.raw`\( r(A) = r(A,\beta) \lt m \)`, '有无穷多解', String.raw`\( \beta \) 可由该组表示，但表示系数不唯一`]
          ] },
          { t: 'viz', build: 'linearCombo', title: '线性组合的几何意义', sub: '拖动系数 k1、k2，观察 k1α1 + k2α2 扫过的集合（直线 / 平面 / 整个空间）' },
          { t: 'card', kind: 'tip', tag: '技巧', title: '表示系数的求法', html: String.raw`<p class="tight">把 \( \alpha_1,\cdots,\alpha_m \) 按列排成 \( A \)，对增广矩阵 \( (A \mid \beta) \) 作初等<b>行</b>变换化为行最简形即可同时判断“能否表示”与“如何表示”：主元列对应自由度的取舍，非主元列给出系数。</p>` },
          { t: 'h3', idx: '③', text: '向量组的线性表示与等价' },
          { t: 'card', kind: 'def', tag: '定义', title: '向量组等价', html: String.raw`<p class="tight">设两个同维数的向量组（I）\( \alpha_1,\cdots,\alpha_m \) 与（II）\( \beta_1,\cdots,\beta_s \)。若（I）中每个向量都可由（II）线性表示，且（II）中每个向量都可由（I）线性表示，则称这两个向量组<b>等价</b>，记作（I）\( \cong \)（II）。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '等价的判定与秩的关系', html: String.raw`<ul class="none"><li>若向量组（II）可由（I）线性表示，则 \( r(\text{II}) \le r(\text{I}) \)——被表示的一组“不会更自由”。</li><li>（I）\( \cong \)（II）\( \iff r(\text{I}) = r(\text{II}) = r(\text{I},\text{II}) \)，其中 \( (\text{I},\text{II}) \) 表示把两组向量并在一起构成的向量组。</li><li>等价向量组的秩必定相等；<b>但秩相等的向量组不一定等价</b>，还要求能互相表示。</li></ul>` },
          { t: 'card', kind: 'warn', tag: '辨析', title: '秩相等不等于等价', html: String.raw`<p class="tight">例如 \( \alpha_1 = (1,0)^{T},\ \alpha_2 = (2,0)^{T} \) 的秩为 1，\( \beta_1 = (0,1)^{T} \) 的秩也是 1，但 \( \beta_1 \) 不能由 \( \alpha_1,\alpha_2 \) 表示（第一个分量恒为 0），两组不等价。判等价必须验证“互相表示”，或者用 \( r(\text{I}) = r(\text{II}) = r(\text{I},\text{II}) \) 一次判定。</p>` },
          { t: 'card', kind: 'key', tag: '常用结论', title: '必须记牢的三条', html: String.raw`<ul class="none"><li>零向量可由任意向量组线性表示；任一向量可由包含自己的向量组线性表示。</li><li>\( \beta \) 可由 \( \alpha_1,\cdots,\alpha_m \) 线性表示，且 \( \alpha_1,\cdots,\alpha_m \) 线性无关时，表示系数唯一。</li><li>若 \( \beta \) 可由（I）表示、（I）可由（II）表示，则 \( \beta \) 可由（II）表示——表示关系具有传递性。</li></ul>` }
        ],
        examples: [
          {
            no: '例 3.1',
            meta: '基础 · 判断能否表示并求表达式',
            q: String.raw`设 \( \alpha_1 = \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} \)，\( \alpha_2 = \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix} \)，\( \alpha_3 = \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix} \)，\( \beta = \begin{pmatrix} 2 \\ 3 \\ 1 \end{pmatrix} \)。判断 \( \beta \) 能否由 \( \alpha_1,\alpha_2,\alpha_3 \) 线性表示，若能，求出表示式。`,
            sol: String.raw`<p>设 \( k_1\alpha_1 + k_2\alpha_2 + k_3\alpha_3 = \beta \)，对增广矩阵作初等行变换：</p><div class="fml"><div class="fml-row">\( (A \mid \beta) = \begin{pmatrix} 1 & 0 & 1 & 2 \\ 0 & 1 & 1 & 3 \\ 1 & 1 & 0 & 1 \end{pmatrix} \xrightarrow{\ r_3-r_1\ } \begin{pmatrix} 1 & 0 & 1 & 2 \\ 0 & 1 & 1 & 3 \\ 0 & 1 & -1 & -1 \end{pmatrix} \xrightarrow{\ r_3-r_2\ } \begin{pmatrix} 1 & 0 & 1 & 2 \\ 0 & 1 & 1 & 3 \\ 0 & 0 & -2 & -4 \end{pmatrix}. \)</div></div><p>系数矩阵与增广矩阵的秩都是 3（等于未知数个数），方程组有唯一解。由最后一行 \( -2k_3 = -4 \) 得 \( k_3 = 2 \)；回代得 \( k_2 + 2 = 3 \Rightarrow k_2 = 1 \)；再由 \( k_1 + 2 = 2 \Rightarrow k_1 = 0 \)。于是</p><div class="fml"><div class="fml-row">\( \mathbf{\beta = 0\cdot\alpha_1 + 1\cdot\alpha_2 + 2\cdot\alpha_3 = \alpha_2 + 2\alpha_3}. \)</div></div><p><b>验证：</b>\( \alpha_2 + 2\alpha_3 = (0,1,1)^{T} + (2,2,0)^{T} = (2,3,1)^{T} = \beta \) ✓。</p>`
          },
          {
            no: '例 3.2',
            meta: '提高 · 含参数的线性表示',
            q: String.raw`设 \( \alpha_1 = (1,2,1)^{T},\ \alpha_2 = (2,3,a)^{T},\ \alpha_3 = (1,a+1,0)^{T},\ \beta = (1,3,2)^{T} \)。问 \( a \) 取何值时，\( \beta \) 不能由 \( \alpha_1,\alpha_2,\alpha_3 \) 线性表示？`,
            sol: String.raw`<p>“不能表示”等价于 \( r(A) \neq r(A,\beta) \)。作行变换：</p><div class="fml"><div class="fml-row">\( (A \mid \beta) = \begin{pmatrix} 1 & 2 & 1 & 1 \\ 2 & 3 & a+1 & 3 \\ 1 & a & 0 & 2 \end{pmatrix} \xrightarrow{\ r_2-2r_1,\ r_3-r_1\ } \begin{pmatrix} 1 & 2 & 1 & 1 \\ 0 & -1 & a-1 & 1 \\ 0 & a-2 & -1 & 1 \end{pmatrix}. \)</div></div><p>继续 \( r_3 + (a-2)r_2 \)：</p><div class="fml"><div class="fml-row">\( \begin{pmatrix} 1 & 2 & 1 & 1 \\ 0 & -1 & a-1 & 1 \\ 0 & 0 & (a-2)(a-1)-1 & 1+(a-2) \end{pmatrix} = \begin{pmatrix} 1 & 2 & 1 & 1 \\ 0 & -1 & a-1 & 1 \\ 0 & 0 & a^{2}-3a+1 & a-1 \end{pmatrix}. \)</div></div><p>当 \( a^{2}-3a+1 = 0 \) 而 \( a-1 \neq 0 \) 时，系数矩阵秩为 2、增广矩阵秩为 3，方程组无解，即 \( \beta \) 不能由 \( \alpha_1,\alpha_2,\alpha_3 \) 线性表示。</p><p>由 \( a^{2}-3a+1 = 0 \) 得 \( a = \dfrac{3 \pm \sqrt{5}}{2} \)，此时 \( a \neq 1 \)（因为 \( 1-3+1 = -1 \neq 0 \)，1 不是根）。</p><p>即 \( \mathbf{a = \dfrac{3+\sqrt{5}}{2} \textbf{ 或 } a = \dfrac{3-\sqrt{5}}{2}} \) 时 \( \beta \) 不能被线性表示。</p><p><b>点评：</b>含参数问题要“先化简、后讨论”，把参数留在最后一行，再分别考察系数矩阵与增广矩阵的秩，避免一开始就分类讨论。</p>`
          }
        ],
        pitfalls: [
          String.raw`把“线性表示”与“线性无关”混为一谈：表示只要求存在系数，系数是否唯一由 \( \alpha_1,\cdots,\alpha_m \) 是否无关决定。`,
          String.raw`增广矩阵的秩与系数矩阵的秩要分别计算：只有当 \( r(A) = r(A,\beta) \) 时才能“表示”，否则方程组无解。`,
          String.raw`向量组的等价必须“互相表示”，仅凭秩相等不能下结论；两组向量个数不同也可能等价（只要秩相同且能互相表示）。`,
          String.raw`把行向量与列向量混用：本书默认列向量，写 \( \alpha = (1,2,3) \) 时应理解为列向量 \( (1,2,3)^{T} \)，转置记号不可省。`
        ]
      },

      /* ================================================================
         3.2 线性相关与线性无关
         ================================================================ */
      {
        id: 'ch3-s2',
        num: '3.2',
        title: '线性相关与线性无关',
        lead: '大纲要求：理解向量组线性相关、线性无关的概念，掌握向量组线性相关、线性无关的有关性质及判别法。这是线性代数中最核心的“概念辨析”考点，贯穿方程组、特征值与二次型。',
        blocks: [
          { t: 'h3', idx: '①', text: '定义与几何直观' },
          { t: 'card', kind: 'def', tag: '定义', title: '线性相关与线性无关', html: String.raw`<p class="tight">设 \( \alpha_1,\alpha_2,\cdots,\alpha_s \) 是一组 n 维向量（\( s \ge 1 \)），若存在<b>不全为零</b>的数 \( k_1,k_2,\cdots,k_s \)，使得</p><div class="fml-row">\( k_1\alpha_1 + k_2\alpha_2 + \cdots + k_s\alpha_s = 0, \)</div><p class="tight">则称这组向量<b>线性相关</b>；若上式成立的唯一情形是 \( k_1 = k_2 = \cdots = k_s = 0 \)，则称这组向量<b>线性无关</b>。</p><p class="tight">特例：单个向量 \( \alpha \) 线性相关 \( \iff \alpha = 0 \)；两个向量线性相关 \( \iff \) 对应分量成比例（几何上共线）。</p>` },
          { t: 'card', kind: 'key', tag: '直观', title: '几何直观要建立起来', html: String.raw`<ul class="none"><li>在 \( \mathbb{R}^{2} \) 中：两个向量相关 = 共线（同向或反向）；两个向量无关 = 不共线，可张成整个平面。</li><li>在 \( \mathbb{R}^{3} \) 中：三个向量相关 = 共面（或共线）；三个向量无关 = 不共面，可张成整个空间。</li><li>相关意味着“有冗余”：至少有一个向量落在其余向量张成的低维集合中，去掉它不损失任何方向。</li></ul>` },
          { t: 'h3', idx: '②', text: '线性相关性的判别法' },
          { t: 'card', kind: 'thm', tag: '判别', title: '三大判别工具', html: String.raw`<p class="tight">记 \( A = (\alpha_1,\alpha_2,\cdots,\alpha_s) \)（按列排）。</p><ul class="none"><li><b>定义法：</b>设 \( k_1\alpha_1 + \cdots + k_s\alpha_s = 0 \)，若能推出所有 \( k_i = 0 \) 则无关，反之相关。</li><li><b>秩法：</b>\( \alpha_1,\cdots,\alpha_s \) 线性相关 \( \iff r(A) \lt s \)；线性无关 \( \iff r(A) = s \)。等价地，\( s \) 个 n 维列向量无关 \( \iff \) 齐次方程组 \( Ax = 0 \) 只有零解。</li><li><b>行列式法（仅当 s = n）：</b>n 个 n 维向量线性无关 \( \iff |A| \neq 0 \)；线性相关 \( \iff |A| = 0 \)。</li></ul>` },
          { t: 'table', head: ['判定条件', '线性相关', '线性无关'], rows: [
            ['定义', String.raw`存在不全为零的 \( k_i \) 使 \( \sum k_i\alpha_i = 0 \)`, String.raw`只有全为零的 \( k_i \) 才使 \( \sum k_i\alpha_i = 0 \)`],
            ['相互表示', '至少有一个向量可由其余向量线性表示', '任一向量都不能由其余向量线性表示'],
            ['秩', String.raw`\( r(\alpha_1,\cdots,\alpha_s) \lt s \)`, String.raw`\( r(\alpha_1,\cdots,\alpha_s) = s \)`],
            ['齐次方程组', String.raw`\( Ax = 0 \) 有非零解`, String.raw`\( Ax = 0 \) 只有零解`],
            ['行列式（s = n）', String.raw`\( |A| = 0 \)`, String.raw`\( |A| \neq 0 \)`],
            ['几何（3 维）', '向量共面或共线', '向量不共面']
          ] },
          { t: 'card', kind: 'key', tag: '必须记住', title: '性质清单（选择题直接考）', html: String.raw`<ul class="none"><li><b>个数超过维数必相关：</b>\( s \gt n \) 时任意 \( s \) 个 n 维向量必线性相关（因为 \( r(A) \le n \lt s \)）。</li><li><b>含零向量必相关：</b>向量组中只要有零向量，整组线性相关。</li><li><b>部分与整体：</b>部分相关 \( \Rightarrow \) 整体相关；整体无关 \( \Rightarrow \) 部分无关。</li><li><b>加长与截短：</b>无关的向量组“加长”（每个向量都增加相同的分量）后仍无关；相关的向量组“截短”后仍相关。</li><li><b>唯一表示：</b>\( \alpha_1,\cdots,\alpha_s \) 线性无关，而 \( \alpha_1,\cdots,\alpha_s,\beta \) 线性相关，则 \( \beta \) 可由 \( \alpha_1,\cdots,\alpha_s \) <b>唯一</b>线性表示。</li><li><b>乘可逆矩阵：</b>对矩阵作初等行变换不改变列向量组的线性相关性。</li></ul>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '“相关必有可表示项”的严格表述', html: String.raw`<p class="tight">\( \alpha_1,\cdots,\alpha_s \)（\( s \ge 2 \)）线性相关 \( \iff \) 至少存在一个 \( \alpha_i \) 能由其余 \( s-1 \) 个向量线性表示。<b>注意</b>是“至少一个”，不是“每一个”。反例：\( \alpha_1 = (1,0)^{T} \)，\( \alpha_2 = (2,0)^{T} \)，\( \alpha_3 = (0,0)^{T} \) 相关，但 \( \alpha_3 \) 是不可被表示的那一个？实际上 \( \alpha_1 = \frac{1}{2}\alpha_2 + 0\cdot\alpha_3 \) 可表示、\( \alpha_2 = 2\alpha_1 + 0\cdot\alpha_3 \) 可表示，而 \( \alpha_3 \) 不能被 \( \alpha_1,\alpha_2 \) 表示。</p>` },
          { t: 'viz', build: 'linearCombo', title: '相关与无关的动态判别', sub: '调整向量方向，观察何时系数组合能“回到原点”' },
          { t: 'h3', idx: '③', text: '证明相关性的三大套路' },
          { t: 'list', ordered: true, items: [
            String.raw`<b>定义法（最通用）：</b>设 \( k_1\alpha_1 + \cdots + k_s\alpha_s = 0 \)，利用已知向量组的无关性把系数逐一“逼”成零；若逼不出来，就构造出一组不全为零的解。`,
            String.raw`<b>秩法：</b>把向量组拼成矩阵，用初等行变换求秩，与向量个数比较。`,
            String.raw`<b>方程组法：</b>把问题转化为齐次方程组解的存在性；涉及“求参数”时常用此法并分类讨论。`,
            String.raw`<b>配凑技巧：</b>对形如 \( \alpha_1+\alpha_2,\ \alpha_2+\alpha_3,\ \alpha_3+\alpha_1 \) 的组合，可用矩阵乘法改写为“原组右乘一个矩阵”，再讨论该矩阵是否可逆，可大幅简化推理。`
          ] }
        ],
        examples: [
          {
            no: '例 3.3',
            meta: '基础 · 含参数的相关性判定',
            q: String.raw`判断向量组 \( \alpha_1 = (1,1,1)^{T},\ \alpha_2 = (1,2,3)^{T},\ \alpha_3 = (1,4,t)^{T} \) 的线性相关性（\( t \) 为参数）。`,
            sol: String.raw`<p>三个三维向量，用行列式法。计算</p><div class="fml"><div class="fml-row">\( |A| = \begin{vmatrix} 1 & 1 & 1 \\ 1 & 2 & 4 \\ 1 & 3 & t \end{vmatrix} = 1\times(2t-12) - 1\times(t-4) + 1\times(3-2) = 2t-12-t+4+1 = t-7. \)</div></div><p><b>情形一：</b>\( t \neq 7 \) 时 \( |A| \neq 0 \)，向量组线性无关。</p><p><b>情形二：</b>\( t = 7 \) 时 \( |A| = 0 \)，向量组线性相关。此时存在不全为零的 \( k_i \) 使 \( \sum k_i\alpha_i = 0 \)，可由初等行变换求出：</p><div class="fml"><div class="fml-row">\( \begin{pmatrix} 1 & 1 & 1 \\ 1 & 2 & 4 \\ 1 & 3 & 7 \end{pmatrix} \xrightarrow{\ r_2-r_1,\ r_3-r_1\ } \begin{pmatrix} 1 & 1 & 1 \\ 0 & 1 & 3 \\ 0 & 2 & 6 \end{pmatrix} \xrightarrow{\ r_3-2r_2\ } \begin{pmatrix} 1 & 1 & 1 \\ 0 & 1 & 3 \\ 0 & 0 & 0 \end{pmatrix}, \)</div></div><p>得 \( k_2 = -3k_3,\ k_1 = 2k_3 \)，取 \( k_3 = 1 \) 得 \( 2\alpha_1 - 3\alpha_2 + \alpha_3 = 0 \)，即 \( \alpha_3 = 3\alpha_2 - 2\alpha_1 \)，验证：\( 3(1,2,3)^{T} - 2(1,1,1)^{T} = (1,4,7)^{T} \) ✓。</p><p><b>结论：</b>\( t \neq 7 \) 时无关，\( t = 7 \) 时相关（且 \( \alpha_3 = 3\alpha_2 - 2\alpha_1 \)）。</p>`
          },
          {
            no: '例 3.4',
            meta: '提高 · 抽象向量组的无关性',
            q: String.raw`已知 \( \alpha_1,\alpha_2,\alpha_3 \) 线性无关，判断 \( \beta_1 = \alpha_1+\alpha_2,\ \beta_2 = \alpha_2+\alpha_3,\ \beta_3 = \alpha_3+\alpha_1 \) 的线性相关性。`,
            sol: String.raw`<p><b>定义法：</b>设 \( k_1\beta_1 + k_2\beta_2 + k_3\beta_3 = 0 \)，代入并整理：</p><div class="fml"><div class="fml-row">\( k_1(\alpha_1+\alpha_2) + k_2(\alpha_2+\alpha_3) + k_3(\alpha_3+\alpha_1) = (k_1+k_3)\alpha_1 + (k_1+k_2)\alpha_2 + (k_2+k_3)\alpha_3 = 0. \)</div></div><p>由 \( \alpha_1,\alpha_2,\alpha_3 \) 线性无关，得</p><div class="fml"><div class="fml-row">\( \begin{cases} k_1 + k_3 = 0, \\ k_1 + k_2 = 0, \\ k_2 + k_3 = 0. \end{cases} \)</div></div><p>系数行列式为 \( \begin{vmatrix} 1 & 0 & 1 \\ 1 & 1 & 0 \\ 0 & 1 & 1 \end{vmatrix} = 1\times1 - 0 + 1\times1 = 2 \neq 0 \)，方程组只有零解 \( k_1 = k_2 = k_3 = 0 \)。</p><p>故 \( \beta_1,\beta_2,\beta_3 \) <b>线性无关</b>。</p><p><b>另解（矩阵视角）：</b>\( (\beta_1,\beta_2,\beta_3) = (\alpha_1,\alpha_2,\alpha_3)\begin{pmatrix} 1 & 0 & 1 \\ 1 & 1 & 0 \\ 0 & 1 & 1 \end{pmatrix} \)。由 \( \alpha \) 组无关知 \( (\alpha_1,\alpha_2,\alpha_3) \) 的列向量组无关，而右乘可逆矩阵不改变列向量组的线性相关性（可逆矩阵可拆成初等矩阵，右乘即初等列变换），故 \( \beta \) 组无关。</p><p><b>一般结论：</b>若 \( C \) 可逆，则 \( (\alpha_1,\cdots,\alpha_s)C \) 与 \( (\alpha_1,\cdots,\alpha_s) \) 的线性相关性相同——原因是 \( (\alpha)Cx = 0 \iff Ax = 0 \)（\( C \) 可逆时可两边乘 \( C^{-1} \)）。</p>`
          }
        ],
        pitfalls: [
          String.raw`“至少有一个向量可由其余表示”不等于“每一个向量都可由其余表示”；相关组中可能存在“不可被表示”的向量（如含零向量的情形）。`,
          String.raw`个数不超过维数也可能相关：\( s \le n \) 时仍可能相关，只有 \( s \gt n \) 才是“必相关”的充分条件。`,
          String.raw`行列式法只适用于“向量个数 = 向量维数”的方阵情形；向量个数与维数不等时必须用秩法或定义法。`,
          String.raw`加长与截短的方向易记反：无关组加长后仍无关（而非相关）；相关组截短后仍相关（而非无关）。`,
          String.raw`用定义法证明无关时，必须“从 \( \sum k_i\alpha_i = 0 \) 推出 \( k_i = 0 \)”；只写出等式而忘记论证 \( k_i \) 全为零，会被判为证明不完整。`
        ]
      },
      /* ================================================================
         3.3 极大无关组与秩
         ================================================================ */
      {
        id: 'ch3-s3',
        num: '3.3',
        title: '极大无关组与秩',
        lead: '大纲要求：理解向量组的极大线性无关组和向量组的秩的概念，会求向量组的极大线性无关组及秩；理解向量组等价的概念，理解矩阵的秩与其行（列）向量组的秩之间的关系。本节把“向量组有多大”量化成一个数，并把它与矩阵的秩完全打通。',
        blocks: [
          { t: 'h3', idx: '①', text: '极大线性无关组与向量组的秩' },
          { t: 'card', kind: 'def', tag: '定义', title: '极大线性无关组', html: String.raw`<p class="tight">设向量组（I）\( \alpha_1,\alpha_2,\cdots,\alpha_s \) 的一个部分组（II）\( \alpha_{i_1},\cdots,\alpha_{i_r} \) 满足：①（II）线性无关；② 从（I）中任取一个向量添入（II）后，所得向量组都线性相关。则称（II）是（I）的一个<b>极大线性无关组</b>（简称极大无关组）。</p><p class="tight">等价说法：（II）线性无关，且（I）中每个向量都可由（II）线性表示。直观地说，它就是“能撑起整个向量组的、项数最少的无关组”。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: '向量组的秩', html: String.raw`<p class="tight">向量组的极大无关组所含向量的个数，称为该向量组的<b>秩</b>，记作 \( r(\alpha_1,\alpha_2,\cdots,\alpha_s) \) 或 \( r(\text{I}) \)。只含零向量的向量组没有极大无关组，规定其秩为 0。</p>` },
          { t: 'h3', idx: '②', text: '三条基本定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '与极大无关组的等价性', html: String.raw`<p class="tight">向量组（I）与它的任一极大无关组（II）<b>等价</b>：一方面（II）中向量可由（I）表示（自身），另一方面（I）中每个向量可由（II）表示。因此</p><div class="fml-row">\( \beta \text{ 可由（I）表示} \iff \beta \text{ 可由（II）表示}. \)</div><p class="tight">这说明极大无关组“不损失任何表示能力”，同时把表示系数化为唯一（因为（II）线性无关）。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '秩的唯一性与等价向量组', html: String.raw`<ul class="none"><li>一个向量组的任意两个极大无关组所含向量个数相等，因此向量组的秩是唯一确定的（<b>极大无关组不唯一，但秩唯一</b>）。</li><li>等价的向量组秩相等（由“被表示一方的秩不超过表示一方的秩”双向夹逼得到）。</li><li>若（II）可由（I）线性表示，则 \( r(\text{II}) \le r(\text{I}) \)。</li></ul>` },
          { t: 'h3', idx: '③', text: '矩阵的秩与行（列）向量组的秩' },
          { t: 'card', kind: 'thm', tag: '定理', title: '三秩相等', html: String.raw`<p class="tight">对任意 \( m\times n \) 矩阵 \( A \)：</p><div class="fml-row">\( r(A) = r(A \text{ 的行向量组}) = r(A \text{ 的列向量组}). \)</div><p class="tight">即矩阵的秩、行秩、列秩三者相等。推论：把向量组按列排成矩阵后，<b>向量组的秩就等于该矩阵的秩</b>。</p>` },
          { t: 'card', kind: 'key', tag: '关键', title: '初等行变换保持“列的线性关系”', html: String.raw`<ul class="none"><li>初等<b>行</b>变换把 \( A \) 化为 \( B \) 时，\( A \) 与 \( B \) 的列向量组具有<b>完全相同的线性关系</b>：若 \( B \) 的第 \( j \) 列是主元列的组合 \( \sum k_i c_i \)，则 \( A \) 的第 \( j \) 列就是对应主元列以同样系数的组合。</li><li>因此求极大无关组的正确流程是：把向量<b>按列</b>排成矩阵 → 只用<b>行</b>变换化到行阶梯形（或行最简形）→ 主元所在的列对应的<b>原始</b>向量构成一个极大无关组。</li><li>若混用列变换，列向量本身被改换，主元列就不再对应原向量组中的向量了。</li></ul>` },
          { t: 'h3', idx: '④', text: '求极大无关组与秩的操作流程' },
          { t: 'list', ordered: true, items: [
            String.raw`把向量组按<b>列</b>排成矩阵 \( A = (\alpha_1,\cdots,\alpha_s) \)。`,
            String.raw`只用初等<b>行</b>变换把 \( A \) 化为行阶梯形，数出非零行数，即 \( r(A) = r(\alpha_1,\cdots,\alpha_s) \)。`,
            String.raw`继续化为行最简形，找出主元所在的列号 \( j_1 \lt j_2 \lt \cdots \lt j_r \)。`,
            String.raw`原向量组中对应的 \( \alpha_{j_1},\cdots,\alpha_{j_r} \) 就是一个极大无关组。`,
            String.raw`把非主元列写成主元列的线性组合（行最简形中的系数直接可用），即可把其余向量用极大无关组表示。`
          ] },
          { t: 'viz', build: 'maxIndependent', title: '极大线性无关组的动态构造', sub: '逐个加入向量，观察秩何时增加、何时不变，并标出最终的极大无关组与秩' },
          { t: 'h3', idx: '⑤', text: '向量组等价的判定' },
          { t: 'card', kind: 'key', tag: '判定', title: '三秩相等的判据', html: String.raw`<p class="tight">设（I）\( A = (\alpha_1,\cdots,\alpha_m) \)，（II）\( B = (\beta_1,\cdots,\beta_s) \)，把两组向量并排组成 \( (A,B) \)（同维数的行向量或列向量拼接）。则</p><div class="fml-row">\( (\text{I}) \cong (\text{II}) \iff r(A) = r(B) = r(A,B). \)</div><p class="tight">其中：\( r(A) = r(A,B) \) 表示（II）可由（I）线性表示；\( r(B) = r(A,B) \) 表示（I）可由（II）线性表示。</p>` },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 求向量组的秩与极大无关组（解答题常考，注意写清“用哪些向量表示”）；② 含参数向量组的秩与相关性讨论；③ 判断两个向量组是否等价；④ 用秩证明与向量组相关性的命题（如 \( r(AB) \le r(A) \) 的向量解释）。</p>` }
        ],
        examples: [
          {
            no: '例 3.5',
            meta: '基础 · 求秩与极大无关组',
            q: String.raw`设 \( \alpha_1 = \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix} \)，\( \alpha_2 = \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix} \)，\( \alpha_3 = \begin{pmatrix} 1 \\ 2 \\ 1 \end{pmatrix} \)，\( \alpha_4 = \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} \)。求该向量组的秩和一个极大无关组，并把其余向量用此极大无关组线性表示。`,
            sol: String.raw`<p>把向量按列排成矩阵并只用行变换：</p><div class="fml"><div class="fml-row">\( A = \begin{pmatrix} 1 & 0 & 1 & 1 \\ 1 & 1 & 2 & 0 \\ 0 & 1 & 1 & 1 \end{pmatrix} \xrightarrow{\ r_2-r_1\ } \begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & 1 & -1 \\ 0 & 1 & 1 & 1 \end{pmatrix} \xrightarrow{\ r_3-r_2\ } \begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & 1 & -1 \\ 0 & 0 & 0 & 2 \end{pmatrix}. \)</div></div><p>已是行阶梯形，非零行有 3 行，故</p><div class="fml"><div class="fml-row">\( \mathbf{r(\alpha_1,\alpha_2,\alpha_3,\alpha_4) = 3}. \)</div></div><p>主元位于第 1、2、4 列，因此对应的原向量 \( \alpha_1,\alpha_2,\alpha_4 \) 构成一个极大无关组（注意：并不是“前面几个”）。</p><p>把 \( A \) 继续化为行最简形以表示 \( \alpha_3 \)：</p><div class="fml"><div class="fml-row">\( \begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & 1 & -1 \\ 0 & 0 & 0 & 1 \end{pmatrix} \xrightarrow{\ r_1-r_3,\ r_2+r_3\ } \begin{pmatrix} 1 & 0 & 1 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix}. \)</div></div><p>第 3 列（非主元列）为 \( (1,1,0)^{T} \)，即 \( \alpha_3 = 1\cdot\alpha_1 + 1\cdot\alpha_2 + 0\cdot\alpha_4 \)：</p><div class="fml"><div class="fml-row">\( \mathbf{\alpha_3 = \alpha_1 + \alpha_2},\qquad \text{验证：}(1,1,0)^{T}+(0,1,1)^{T} = (1,2,1)^{T}\ \checkmark \)</div></div><p><b>点评：</b>极大无关组不唯一（如 \( \{\alpha_1,\alpha_2,\alpha_4\} \)、\( \{\alpha_1,\alpha_3,\alpha_4\} \) 都可以），但秩 3 是唯一的；答案中必须写清所选的是哪一组向量。</p>`
          },
          {
            no: '例 3.6',
            meta: '提高 · 含参数的秩',
            q: String.raw`设 \( \alpha_1 = (1,1,a)^{T},\ \alpha_2 = (1,a,1)^{T},\ \alpha_3 = (a,1,1)^{T} \)。讨论 \( a \) 的取值与向量组秩 \( r(\alpha_1,\alpha_2,\alpha_3) \) 的关系。`,
            sol: String.raw`<p>三个三维向量，先算行列式：</p><div class="fml"><div class="fml-row">\( |A| = \begin{vmatrix} 1 & 1 & a \\ 1 & a & 1 \\ a & 1 & 1 \end{vmatrix} = 1\times(a-1) - 1\times(1-a) + a\times(1-a^{2}) = 2(a-1) + a(1-a)(1+a). \)</div></div><p>提取公因子 \( (a-1) \)：</p><div class="fml"><div class="fml-row">\( |A| = (a-1)\left[2 - a(1+a)\right] = (a-1)(2-a-a^{2}) = -(a-1)^{2}(a+2). \)</div></div><p><b>情形一：</b>\( a \neq 1 \) 且 \( a \neq -2 \)，则 \( |A| \neq 0 \)，\( r = 3 \)。</p><p><b>情形二：</b>\( a = -2 \)。此时</p><div class="fml"><div class="fml-row">\( A = \begin{pmatrix} 1 & 1 & -2 \\ 1 & -2 & 1 \\ -2 & 1 & 1 \end{pmatrix},\qquad \alpha_3 = -\alpha_1 - \alpha_2. \)</div></div><p>因为 \( \alpha_1 + \alpha_2 = (2,-1,-1)^{T} \)，而 \( -(2,-1,-1)^{T} = (-2,1,1)^{T} = \alpha_3 \)。\( \alpha_1,\alpha_2 \) 不成比例，故 \( r = 2 \)。</p><p><b>情形三：</b>\( a = 1 \)。此时 \( \alpha_1 = \alpha_2 = \alpha_3 = (1,1,1)^{T} \)，\( r = 1 \)。</p><p><b>结论：</b>\( a \neq 1,-2 \) 时 \( r = 3 \)；\( a = -2 \) 时 \( r = 2 \)；\( a = 1 \) 时 \( r = 1 \)。</p><p><b>点评：</b>参数讨论的完整性至关重要：\( |A| = 0 \) 只是“秩小于 3”，还需分别代入验证究竟降到 2 还是 1，不能止步于“此时相关”。</p>`
          },
          {
            no: '例 3.7',
            meta: '提高 · 向量组等价的判定',
            q: String.raw`设向量组（I）：\( \alpha_1 = (1,1,0)^{T},\ \alpha_2 = (0,1,1)^{T} \)；向量组（II）：\( \beta_1 = (1,0,-1)^{T},\ \beta_2 = (1,2,1)^{T} \)。证明（I）与（II）等价。`,
            sol: String.raw`<p><b>先看表示关系。</b>注意到</p><div class="fml"><div class="fml-row">\( \beta_1 = \alpha_1 - \alpha_2,\qquad \beta_2 = \alpha_1 + \alpha_2, \)</div></div><p>说明（II）可由（I）线性表示。反过来解方程组 \( \alpha_1 = x_1\beta_1 + x_2\beta_2 \)、\( \alpha_2 = y_1\beta_1 + y_2\beta_2 \)，由上面两式相加、相减可得</p><div class="fml"><div class="fml-row">\( \beta_1 + \beta_2 = 2\alpha_1 \Rightarrow \alpha_1 = \frac{1}{2}\beta_1 + \frac{1}{2}\beta_2,\qquad \beta_2 - \beta_1 = 2\alpha_2 \Rightarrow \alpha_2 = -\frac{1}{2}\beta_1 + \frac{1}{2}\beta_2, \)</div></div><p>故（I）也可由（II）线性表示，两组等价。</p><p><b>用三秩判据核验：</b>\( A = (\alpha_1,\alpha_2) \) 的两列不成比例，\( r(A) = 2 \)；同理 \( r(B) = 2 \)；把四列拼成 \( (A,B) \) 后用行变换可得 \( r(A,B) = 2 \)。于是 \( r(A) = r(B) = r(A,B) = 2 \)，两组等价。</p><p><b>点评：</b>“秩相等”只是必要条件，必须加上“能互相表示”（等价于 \( r(A,B) \) 也等于该秩）。本题两组向量的秩都是 2，且在同一个二维子空间内，因此等价。</p>`
          }
        ],
        pitfalls: [
          String.raw`极大无关组不唯一：同一向量组可以有不同的极大无关组，但所含向量个数（秩）一定相同；答题时必须明确指出选取了哪一组。`,
          String.raw`求极大无关组时不能使用列变换：列变换会改变列向量本身，导致主元列与原向量组不再对应；只用行变换才能保证“主元列 = 原组的极大无关组”。`,
          String.raw`向量按行排还是按列排必须与结论口径一致：若把向量按行排成矩阵，行变换后得到的是“行向量组的行关系”，据此判断列向量组的相关性会出错。`,
          String.raw`只有零向量的向量组没有极大无关组，其秩规定为 0，不要写成“秩为 1”。`,
          String.raw`秩相等不能推出向量组等价；判等价要用 \( r(A) = r(B) = r(A,B) \) 或直接验证互相表示。`
        ]
      },

      /* ================================================================
         3.4 向量空间与坐标变换
         ================================================================ */
      {
        id: 'ch3-s4',
        num: '3.4',
        title: '向量空间与坐标变换',
        lead: '大纲要求：了解 n 维向量空间、子空间、基底、维数、坐标等概念；了解基变换和坐标变换公式，会求过渡矩阵。本节把向量组放到“空间”的框架下，回答“同一向量在不同基下坐标如何换算”这一结构化问题。',
        blocks: [
          { t: 'h3', idx: '①', text: '向量空间与子空间' },
          { t: 'card', kind: 'def', tag: '定义', title: '向量空间与子空间', html: String.raw`<p class="tight">设 \( V \) 是 n 维向量的非空集合，若 \( V \) 对加法与数乘封闭（即 \( \alpha,\beta \in V \Rightarrow \alpha+\beta \in V \)，\( k\alpha \in V \)），则称 \( V \) 为一个<b>向量空间</b>。</p><p class="tight">若 \( W \) 是 \( V \) 的非空子集且对两种运算也封闭，则称 \( W \) 是 \( V \) 的<b>子空间</b>。判定的简化形式：\( W \neq \varnothing \) 且 \( \forall \alpha,\beta \in W,\ \forall k \in \mathbb{R} \)，都有 \( k\alpha + \beta \in W \)。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: '由向量组生成的子空间', html: String.raw`<p class="tight">设 \( \alpha_1,\cdots,\alpha_s \) 是 n 维向量，称集合</p><div class="fml-row">\( L(\alpha_1,\cdots,\alpha_s) = \{\, k_1\alpha_1 + \cdots + k_s\alpha_s \mid k_i \in \mathbb{R} \,\} \)</div><p class="tight">为这组向量<b>生成的（张成的）子空间</b>。它是包含所有这些向量的最小子空间。齐次方程组 \( Ax = 0 \) 的全部解向量组成的集合称为<b>解空间</b>，它是 \( \mathbb{R}^{n} \) 的子空间（见 4.2）。</p>` },
          { t: 'h3', idx: '②', text: '基、维数与坐标' },
          { t: 'card', kind: 'def', tag: '定义', title: '基底、维数与坐标', html: String.raw`<p class="tight">设 \( V \) 是向量空间，若 \( V \) 中一组向量 \( \alpha_1,\cdots,\alpha_n \) 线性无关，且 \( V \) 中任一向量都可由它们线性表示，则称 \( \alpha_1,\cdots,\alpha_n \) 是 \( V \) 的一组<b>基底（基）</b>；基所含向量的个数称为 \( V \) 的<b>维数</b>，记 \( \dim V \)。</p><p class="tight">若 \( \xi = x_1\alpha_1 + \cdots + x_n\alpha_n \)，则称数组 \( (x_1,\cdots,x_n)^{T} \) 为 \( \xi \) 在基 \( \alpha_1,\cdots,\alpha_n \) 下的<b>坐标</b>。基给定后，坐标是唯一的。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '维数与秩的关系', html: String.raw`<ul class="none"><li>\( \dim L(\alpha_1,\cdots,\alpha_s) = r(\alpha_1,\cdots,\alpha_s) \)：生成子空间的维数等于向量组的秩；该向量组的任一极大无关组就是 \( L \) 的一组基。</li><li>\( \mathbb{R}^{n} \) 的标准基为 \( e_1 = (1,0,\cdots,0)^{T},\ \cdots,\ e_n = (0,\cdots,0,1)^{T} \)，\( \dim \mathbb{R}^{n} = n \)。</li><li>齐次方程组 \( Ax = 0 \) 的解空间维数 \( \dim N(A) = n - r(A) \)（\( A \) 为 \( m\times n \) 矩阵）。</li></ul>` },
          { t: 'h3', idx: '③', text: '基变换与坐标变换' },
          { t: 'card', kind: 'thm', tag: '定理', title: '过渡矩阵与坐标变换公式', html: String.raw`<p class="tight">设 \( \alpha_1,\cdots,\alpha_n \) 与 \( \beta_1,\cdots,\beta_n \) 是同一向量空间 \( V \) 的两组基。把两组基分别按列排成矩阵 \( A = (\alpha_1,\cdots,\alpha_n) \)、\( B = (\beta_1,\cdots,\beta_n) \)，则存在唯一可逆矩阵 \( P \) 使得</p><div class="fml-row">\( (\beta_1,\beta_2,\cdots,\beta_n) = (\alpha_1,\alpha_2,\cdots,\alpha_n)\,P,\qquad \text{即}\quad B = A P. \)</div><p class="tight">矩阵 \( P = A^{-1}B \) 称为从基 \( \alpha_1,\cdots,\alpha_n \) 到基 \( \beta_1,\cdots,\beta_n \) 的<b>过渡矩阵</b>，它一定可逆。</p><p class="tight">若向量 \( \xi \) 在旧基 \( \alpha \) 下的坐标为 \( x \)，在新基 \( \beta \) 下的坐标为 \( y \)，则</p><div class="fml-row">\( A x = B y = A P y \Longrightarrow \mathbf{x = P y}. \)</div>` },
          { t: 'card', kind: 'tip', tag: '记忆', title: '方向与顺序的记法', html: String.raw`<p class="tight">约定为“<b>新基 = 旧基 × 过渡矩阵</b>”时，坐标满足“<b>旧坐标 = 过渡矩阵 × 新坐标</b>”，即 \( x = Py \)，等价地 \( y = P^{-1}x \)。<br>初学时最容易把方向写反，检验办法：代入一个具体向量，用两种基分别算一遍坐标即可核对。</p>` },
          { t: 'h3', idx: '④', text: '过渡矩阵与坐标的求法' },
          { t: 'list', ordered: true, items: [
            String.raw`把旧基、新基都<b>按列</b>排成矩阵 \( A \) 与 \( B \)。`,
            String.raw`解矩阵方程 \( A P = B \)：作 \( (A \mid B) \xrightarrow{\ \text{行变换}\ } (E \mid A^{-1}B) \)，右半部即为过渡矩阵 \( P \)。`,
            String.raw`求某向量在新基下的坐标：先写出它在旧基下的坐标 \( x \)，再算 \( y = P^{-1}x \)；或直接解线性组合等式。`,
            String.raw`若旧基是标准基 \( e_1,\cdots,e_n \)，则 \( A = E \)，过渡矩阵就等于 \( B \) 本身，计算最简。`
          ] },
          { t: 'viz', build: 'basisTransform', title: '同一向量在两组基下的坐标', sub: '播放网格变形动画（标准基网格 → 新基 β 的网格），观察 ξ 的坐标从 (x₁, x₂) 变为 (y₁, y₂)' },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 求两组基之间的过渡矩阵（解答题常见）；② 已知某向量在一组基下的坐标，求它在另一组基下的坐标；③ 求齐次方程组解空间的基与维数；④ 判断某集合是否为子空间（封闭性验证）。</p>` }
        ],
        examples: [
          {
            no: '例 3.8',
            meta: '基础 · 过渡矩阵与坐标变换',
            q: String.raw`在 \( \mathbb{R}^{3} \) 中，取基（I）\( \alpha_1 = e_1,\ \alpha_2 = e_2,\ \alpha_3 = e_3 \)（标准基）与基（II）\( \beta_1 = (1,1,0)^{T},\ \beta_2 = (1,0,1)^{T},\ \beta_3 = (0,1,1)^{T} \)。求从基（I）到基（II）的过渡矩阵 \( P \)，并求向量 \( \xi = (2,3,1)^{T} \) 在基（II）下的坐标。`,
            sol: String.raw`<p>按列排：\( A = (\alpha_1,\alpha_2,\alpha_3) = E \)，\( B = (\beta_1,\beta_2,\beta_3) = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 0 & 1 \\ 0 & 1 & 1 \end{pmatrix} \)。</p><p>由 \( B = AP \) 得过渡矩阵</p><div class="fml"><div class="fml-row">\( P = A^{-1}B = B = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 0 & 1 \\ 0 & 1 & 1 \end{pmatrix}. \)</div></div><p>（先验证 \( \beta \) 组确实是基：\( |B| = -2 \neq 0 \)，故可逆。）</p><p>由坐标变换公式 \( x = Py \) 得 \( y = P^{-1}x \)。计算 \( P^{-1} \)（或用伴随矩阵法）：</p><div class="fml"><div class="fml-row">\( P^{-1} = -\frac{1}{2}\begin{pmatrix} -1 & -1 & 1 \\ -1 & 1 & -1 \\ 1 & -1 & -1 \end{pmatrix} = \frac{1}{2}\begin{pmatrix} 1 & 1 & -1 \\ 1 & -1 & 1 \\ -1 & 1 & 1 \end{pmatrix}. \)</div></div><p>于是</p><div class="fml"><div class="fml-row">\( y = \frac{1}{2}\begin{pmatrix} 1 & 1 & -1 \\ 1 & -1 & 1 \\ -1 & 1 & 1 \end{pmatrix}\begin{pmatrix} 2 \\ 3 \\ 1 \end{pmatrix} = \frac{1}{2}\begin{pmatrix} 2+3-1 \\ 2-3+1 \\ -2+3+1 \end{pmatrix} = \begin{pmatrix} 2 \\ 0 \\ 1 \end{pmatrix}. \)</div></div><p><b>核验：</b>\( 2\beta_1 + 0\beta_2 + 1\beta_3 = (2,2,0)^{T} + (0,1,1)^{T} = (2,3,1)^{T} = \xi \) ✓。</p><p>即 \( \xi \) 在基（II）下的坐标为 \( \mathbf{(2,0,1)^{T}} \)。</p>`
          },
          {
            no: '例 3.9',
            meta: '提高 · 解空间的基与维数',
            q: String.raw`求齐次线性方程组 \( \begin{cases} x_1 + x_2 + x_3 + x_4 = 0, \\ x_1 - x_2 + x_3 - x_4 = 0 \end{cases} \) 的解空间的一组基与维数。`,
            sol: String.raw`<p>系数矩阵 \( A = \begin{pmatrix} 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \end{pmatrix} \)。两行不成比例，故 \( r(A) = 2 \)。</p><p>对系数矩阵作行变换化简：</p><div class="fml"><div class="fml-row">\( \begin{pmatrix} 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \end{pmatrix} \xrightarrow{\ r_2-r_1\ } \begin{pmatrix} 1 & 1 & 1 & 1 \\ 0 & -2 & 0 & -2 \end{pmatrix} \xrightarrow{\ \text{化简}\ } \begin{pmatrix} 1 & 0 & 1 & 0 \\ 0 & 1 & 0 & 1 \end{pmatrix}. \)</div></div><p>即 \( x_1 + x_3 = 0 \)、\( x_2 + x_4 = 0 \)，也就是 \( x_1 = -x_3,\ x_2 = -x_4 \)，其中 \( x_3,x_4 \) 为自由未知量。取 \( (x_3,x_4) = (1,0) \) 与 \( (0,1) \)：</p><div class="fml"><div class="fml-row">\( \eta_1 = \begin{pmatrix} -1 \\ 0 \\ 1 \\ 0 \end{pmatrix},\qquad \eta_2 = \begin{pmatrix} 0 \\ -1 \\ 0 \\ 1 \end{pmatrix}. \)</div></div><p>\( \eta_1,\eta_2 \) 线性无关（对应分量不成比例），且任一解可写成 \( x_3\eta_1 + x_4\eta_2 \)，故它们构成解空间的一组基，解空间维数</p><div class="fml"><div class="fml-row">\( \mathbf{\dim N(A) = n - r(A) = 4 - 2 = 2}. \)</div></div><p><b>点评：</b>解空间的维数公式 \( n - r(A) \) 就是第四章基础解系理论的雏形；自由未知量的个数恰等于维数，取单位向量赋值得到的解向量自动线性无关。</p>`
          }
        ],
        pitfalls: [
          String.raw`过渡矩阵的方向必须与坐标变换公式配套：若约定 \( (\beta) = (\alpha)P \)，则 \( x = Py \)（旧坐标 = P × 新坐标），写反是最常见的失分点。`,
          String.raw`两组基都必须按列排成矩阵；若一组按行排，得到的 \( P \) 不能直接用于坐标变换。`,
          String.raw`过渡矩阵一定可逆（因为两组都是基），求完后应检验 \( |P| \neq 0 \)，否则说明计算出错或题设两组向量不构成基。`,
          String.raw`子空间判定要验证“非空”以及对加法与数乘封闭；只验证“对加法封闭”是不够的。`,
          String.raw`把生成子空间的维数与向量个数混淆：\( \dim L(\alpha_1,\cdots,\alpha_s) = r(\alpha_1,\cdots,\alpha_s) \le s \)，只有向量组无关时等号才成立。`
        ]
      },
      /* ================================================================
         3.5 内积与正交化
         ================================================================ */
      {
        id: 'ch3-s5',
        num: '3.5',
        title: '内积与正交化',
        lead: '大纲要求：了解内积的概念，掌握线性无关向量组正交规范化的施密特（Schmidt）方法；了解规范正交基、正交矩阵的概念以及它们的性质。本节把“夹角”“垂直”“长度”引入线性代数，是第五章实对称矩阵与第六章正交变换的基础。',
        blocks: [
          { t: 'h3', idx: '①', text: '内积、长度与夹角' },
          { t: 'card', kind: 'def', tag: '定义', title: '内积（数量积）', html: String.raw`<p class="tight">设 \( \alpha = (a_1,\cdots,a_n)^{T},\ \beta = (b_1,\cdots,b_n)^{T} \in \mathbb{R}^{n} \)，规定</p><div class="fml-row">\( (\alpha,\beta) = \alpha^{T}\beta = a_1b_1 + a_2b_2 + \cdots + a_nb_n. \)</div><p class="tight">它把一对向量映射成一个实数。三条基本性质：① 对称性 \( (\alpha,\beta) = (\beta,\alpha) \)；② 线性 \( (k\alpha + l\beta,\gamma) = k(\alpha,\gamma) + l(\beta,\gamma) \)；③ 正定性 \( (\alpha,\alpha) \ge 0 \)，且 \( (\alpha,\alpha) = 0 \iff \alpha = 0 \)。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: '长度与夹角', html: String.raw`<p class="tight">称 \( \|\alpha\| = \sqrt{(\alpha,\alpha)} = \sqrt{a_1^{2}+\cdots+a_n^{2}} \) 为向量 \( \alpha \) 的<b>长度（范数）</b>。长度为 1 的向量称为<b>单位向量</b>；把非零向量 \( \alpha \) 化为 \( \dfrac{\alpha}{\|\alpha\|} \) 称为<b>单位化</b>。非零向量 \( \alpha,\beta \) 的<b>夹角</b>由</p><div class="fml-row">\( \cos\theta = \dfrac{(\alpha,\beta)}{\|\alpha\|\,\|\beta\|},\qquad \theta \in [0,\pi] \)</div><p class="tight">确定。长度的基本性质：\( \|k\alpha\| = |k|\,\|\alpha\| \)；三角不等式 \( \|\alpha+\beta\| \le \|\alpha\|+\|\beta\| \)。</p>` },
          { t: 'h3', idx: '②', text: '正交与正交向量组' },
          { t: 'card', kind: 'def', tag: '定义', title: '正交与正交向量组', html: String.raw`<p class="tight">若 \( (\alpha,\beta) = 0 \)，称 \( \alpha \) 与 \( \beta \) <b>正交</b>，记 \( \alpha \perp \beta \)。零向量与任何向量正交。一组两两正交的<b>非零</b>向量称为<b>正交向量组</b>；若该组每个向量的长度都是 1，则称为<b>规范（标准）正交向量组</b>。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '正交向量组必线性无关', html: String.raw`<p class="tight">若非零向量组 \( \alpha_1,\cdots,\alpha_s \) 两两正交，则它线性无关。</p><p class="tight"><b>证明：</b>设 \( k_1\alpha_1 + \cdots + k_s\alpha_s = 0 \)，用 \( \alpha_i \) 作内积（利用正交性 \( (\alpha_j,\alpha_i) = 0,\ j \neq i \)）得 \( k_i(\alpha_i,\alpha_i) = 0 \)。因 \( \alpha_i \neq 0 \)，\( (\alpha_i,\alpha_i) \gt 0 \)，故 \( k_i = 0 \)，对每个 i 都成立，因此线性无关。</p><p class="tight"><b>注意：</b>反之不成立——线性无关的向量组未必两两正交（例如 \( (1,0)^{T} \) 与 \( (1,1)^{T} \)）。正交化正是把“无关”升级为“正交”的手术。</p>` },
          { t: 'h3', idx: '③', text: '施密特（Schmidt）正交化方法' },
          { t: 'card', kind: 'key', tag: '核心', title: '正交化 + 单位化', html: String.raw`<p class="tight">设 \( \alpha_1,\cdots,\alpha_s \) 线性无关，按下述步骤构造正交向量组：</p><div class="fml-row">\( \beta_1 = \alpha_1; \)</div><div class="fml-row">\( \beta_2 = \alpha_2 - \dfrac{(\alpha_2,\beta_1)}{(\beta_1,\beta_1)}\beta_1; \)</div><div class="fml-row">\( \beta_3 = \alpha_3 - \dfrac{(\alpha_3,\beta_1)}{(\beta_1,\beta_1)}\beta_1 - \dfrac{(\alpha_3,\beta_2)}{(\beta_2,\beta_2)}\beta_2; \)</div><div class="fml-row">\( \cdots\cdots\qquad \beta_s = \alpha_s - \sum_{i=1}^{s-1}\dfrac{(\alpha_s,\beta_i)}{(\beta_i,\beta_i)}\beta_i. \)</div><p class="tight">再把每个 \( \beta_i \) 单位化：\( \gamma_i = \dfrac{\beta_i}{\|\beta_i\|} \)，则 \( \gamma_1,\cdots,\gamma_s \) 为规范正交向量组，且</p><div class="fml-row">\( L(\alpha_1,\cdots,\alpha_s) = L(\beta_1,\cdots,\beta_s) = L(\gamma_1,\cdots,\gamma_s). \)</div>` },
          { t: 'card', kind: 'tip', tag: '原理', title: '为什么要“减去投影”', html: String.raw`<p class="tight">\( \dfrac{(\alpha_2,\beta_1)}{(\beta_1,\beta_1)}\beta_1 \) 是 \( \alpha_2 \) 在 \( \beta_1 \) 方向上的<b>投影向量</b>。减掉它，剩下的 \( \beta_2 \) 自然与 \( \beta_1 \) 正交；每一步都减去“在新方向上的全部分量”，即可逐个逼出正交方向。分母始终是 \( (\beta_i,\beta_i) \)（已正交化向量的长度平方），而不是 \( (\alpha_i,\alpha_i) \)。</p>` },
          { t: 'viz', build: 'gramSchmidt', title: '施密特正交化演示', sub: '逐步观察投影被减去、正交方向逐步生成的过程' },
          { t: 'h3', idx: '④', text: '规范正交基与正交矩阵' },
          { t: 'card', kind: 'def', tag: '定义', title: '规范正交基', html: String.raw`<p class="tight">向量空间 \( V \) 的一组基若满足两两正交且每个向量都是单位向量，则称为 \( V \) 的一组<b>规范正交基（标准正交基）</b>。例如 \( \mathbb{R}^{n} \) 的标准基 \( e_1,\cdots,e_n \) 就是一组规范正交基。</p><p class="tight">在规范正交基下计算内积特别方便：若 \( \xi = \sum x_i\gamma_i \)，则 \( x_i = (\xi,\gamma_i) \)——坐标就是投影。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: '正交矩阵', html: String.raw`<p class="tight">若 n 阶实方阵 \( A \) 满足</p><div class="fml-row">\( A^{T}A = E\qquad (\iff A^{-1} = A^{T}), \)</div><p class="tight">则称 \( A \) 为<b>正交矩阵</b>。等价刻画：\( A \) 的列向量组是 \( \mathbb{R}^{n} \) 的一组规范正交基（由 \( A^{T}A = E \) 直接读出）；行向量组也是。</p>` },
          { t: 'table', head: ['性质', '内容'], rows: [
            ['行列式', String.raw`\( |A| = \pm 1 \)`],
            ['逆与转置', String.raw`\( A^{-1} = A^{T} \) 仍是正交矩阵`],
            ['乘积', String.raw`\( A,B \) 正交 \( \Rightarrow AB \) 正交；\( A^{-1} \) 正交`],
            ['列（行）向量', '两两正交且长度均为 1'],
            ['特征值', String.raw`实特征值只能是 \( \pm 1 \)，复特征值的模为 1`],
            ['正交变换', String.raw`\( y = Ax \) 保持内积与长度：\( (A\alpha,A\beta) = (\alpha,\beta) \)，\( \|A\alpha\| = \|\alpha\| \)`]
          ] },
          { t: 'card', kind: 'warn', tag: '辨析', title: '两个常见反向错误', html: String.raw`<ul class="none"><li>\( |A| = \pm 1 \) <b>不能</b>推出 \( A \) 正交（如 \( \begin{pmatrix} 2 & 0 \\ 0 & \frac{1}{2} \end{pmatrix} \) 行列式为 1 但列向量不是单位向量）。</li><li>“两两正交”与“线性无关”不等价：正交（对非零向量组）是更强的条件；正交化操作的目的是把无关组变成正交组。</li></ul>` },
          { t: 'h3', idx: '⑤', text: '正交变换' },
          { t: 'card', kind: 'def', tag: '定义', title: '正交变换', html: String.raw`<p class="tight">若 \( A \) 为正交矩阵，则线性变换 \( y = Ax \) 称为<b>正交变换</b>。它保持内积、长度与夹角不变，几何上是旋转（\( |A| = 1 \)）或反射（\( |A| = -1 \)）。<br>在第六章中，用正交变换化二次型为标准形，就是要求变换矩阵 \( Q \) 为正交矩阵：这样既简化了二次型，又不改变图形的形状（长度）。</p>` },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 用施密特方法把线性无关组化为规范正交基（大题高频）；② 验证或求正交矩阵（含求参数）；③ 求与给定向量组正交的单位向量；④ 用正交变换化二次型为标准形（第 6 章）。</p>` }
        ],
        examples: [
          {
            no: '例 3.10',
            meta: '基础 · 施密特正交化',
            q: String.raw`把线性无关组 \( \alpha_1 = (1,1,0)^{T},\ \alpha_2 = (1,0,1)^{T},\ \alpha_3 = (0,1,1)^{T} \) 化为规范正交组。`,
            sol: String.raw`<p><b>第一步（正交化）：</b></p><div class="fml"><div class="fml-row">\( \beta_1 = \alpha_1 = (1,1,0)^{T},\qquad (\beta_1,\beta_1) = 2. \)</div></div><div class="fml"><div class="fml-row">\( \beta_2 = \alpha_2 - \frac{(\alpha_2,\beta_1)}{(\beta_1,\beta_1)}\beta_1 = (1,0,1)^{T} - \frac{1}{2}(1,1,0)^{T} = \left(\frac{1}{2},-\frac{1}{2},1\right)^{T},\qquad (\beta_2,\beta_2) = \frac{3}{2}. \)</div></div><p>其中 \( (\alpha_2,\beta_1) = 1\times1 + 0\times1 + 1\times0 = 1 \)。再算</p><div class="fml"><div class="fml-row">\( (\alpha_3,\beta_1) = 0\times1+1\times1+1\times0 = 1,\qquad (\alpha_3,\beta_2) = 0\times\frac{1}{2}+1\times\left(-\frac{1}{2}\right)+1\times1 = \frac{1}{2}, \)</div><div class="fml-row">\( \beta_3 = \alpha_3 - \frac{1}{2}\beta_1 - \frac{1/2}{3/2}\beta_2 = (0,1,1)^{T} - \left(\frac{1}{2},\frac{1}{2},0\right)^{T} - \frac{1}{3}\left(\frac{1}{2},-\frac{1}{2},1\right)^{T} = \left(-\frac{2}{3},\frac{2}{3},\frac{2}{3}\right)^{T}. \)</div></div><p><b>第二步（单位化）：</b></p><div class="fml"><div class="fml-row">\( \gamma_1 = \frac{\beta_1}{\|\beta_1\|} = \left(\frac{1}{\sqrt{2}},\frac{1}{\sqrt{2}},0\right)^{T},\quad \gamma_2 = \frac{\beta_2}{\|\beta_2\|} = \frac{1}{\sqrt{6}}(1,-1,2)^{T},\quad \gamma_3 = \frac{\beta_3}{\|\beta_3\|} = \frac{1}{\sqrt{3}}(-1,1,1)^{T}. \)</div></div><p><b>核验：</b>\( (\gamma_1,\gamma_2) = \frac{1}{\sqrt{12}}(1-1+0) = 0 \)，\( (\gamma_1,\gamma_3) = \frac{1}{\sqrt{6}}(-1+1+0) = 0 \)，\( (\gamma_2,\gamma_3) = \frac{1}{\sqrt{18}}(-1-1+2) = 0 \)，且三个向量的长度都为 1。故 \( \gamma_1,\gamma_2,\gamma_3 \) 是一组规范正交基。</p>`
          },
          {
            no: '例 3.11',
            meta: '提高 · 正交矩阵的验证',
            q: String.raw`设 \( A = \dfrac{1}{3}\begin{pmatrix} 1 & 2 & 2 \\ 2 & 1 & -2 \\ 2 & -2 & 1 \end{pmatrix} \)。验证 \( A \) 是正交矩阵，并求 \( A^{-1} \) 与 \( |A| \)。`,
            sol: String.raw`<p>先看列向量组是否规范正交。记三列为 \( c_1 = \frac{1}{3}(1,2,2)^{T},\ c_2 = \frac{1}{3}(2,1,-2)^{T},\ c_3 = \frac{1}{3}(2,-2,1)^{T} \)。</p><div class="fml"><div class="fml-row">\( (c_1,c_1) = \frac{1}{9}(1+4+4) = 1,\quad (c_2,c_2) = \frac{1}{9}(4+1+4) = 1,\quad (c_3,c_3) = \frac{1}{9}(4+4+1) = 1, \)</div><div class="fml-row">\( (c_1,c_2) = \frac{1}{9}(2+2-4) = 0,\quad (c_1,c_3) = \frac{1}{9}(2-4+2) = 0,\quad (c_2,c_3) = \frac{1}{9}(4-2-2) = 0. \)</div></div><p>三个列向量两两正交且长度都是 1，故 \( A^{T}A = E \)，\( A \) 是正交矩阵。</p><p>于是</p><div class="fml"><div class="fml-row">\( A^{-1} = A^{T} = \frac{1}{3}\begin{pmatrix} 1 & 2 & 2 \\ 2 & 1 & -2 \\ 2 & -2 & 1 \end{pmatrix} \)</div></div><p>（本题中 \( A \) 恰好是对称的正交矩阵，故 \( A^{-1} = A^{T} = A \)）。</p><p>再算行列式：对 \( \dfrac{1}{3}M \) 有 \( |A| = \left(\dfrac{1}{3}\right)^{3}|M| \)，而</p><div class="fml"><div class="fml-row">\( |M| = 1\times(1-4) - 2\times(2+4) + 2\times(-4-2) = -3-12-12 = -27,\qquad |A| = \frac{-27}{27} = -1. \)</div></div><p><b>核验：</b>\( |A| = -1 \) 与正交矩阵 \( |A| = \pm1 \) 相符；且 \( |A| = -1 \) 说明对应的正交变换是反射型。</p>`
          },
          {
            no: '例 3.12',
            meta: '基础 · 求正交单位向量',
            q: String.raw`求与 \( \alpha_1 = (1,1,0)^{T} \) 和 \( \alpha_2 = (0,1,1)^{T} \) 都正交的单位向量。`,
            sol: String.raw`<p>设 \( x = (x_1,x_2,x_3)^{T} \) 满足正交条件：</p><div class="fml"><div class="fml-row">\( \begin{cases} (x,\alpha_1) = x_1 + x_2 = 0, \\ (x,\alpha_2) = x_2 + x_3 = 0. \end{cases} \)</div></div><p>由第一式 \( x_2 = -x_1 \)，由第二式 \( x_3 = -x_2 = x_1 \)，即</p><div class="fml"><div class="fml-row">\( x = x_1(1,-1,1)^{T},\qquad x_1 \in \mathbb{R}. \)</div></div><p>取 \( x_1 = 1 \) 得 \( x = (1,-1,1)^{T} \)，其长度为 \( \|x\| = \sqrt{1+1+1} = \sqrt{3} \)，单位化得</p><div class="fml"><div class="fml-row">\( \mathbf{\gamma = \pm\frac{1}{\sqrt{3}}(1,-1,1)^{T}}. \)</div></div><p><b>核验：</b>\( (1,-1,1)\cdot(1,1,0) = 1-1+0 = 0 \)，\( (1,-1,1)\cdot(0,1,1) = 0+(-1)+1 = 0 \) ✓；两个方向（±）都满足题目要求，通常答出一个（或注明 ±）即可。</p><p><b>点评：</b>“与一组向量正交”等价于解齐次方程组 \( A^{T}x = 0 \)（\( A \) 的列是给定向量），解空间维数为 \( n - r(A) \)，正交化的第一步本质上也是求这样的解。</p>`
          }
        ],
        pitfalls: [
          String.raw`施密特公式的分母是最新正交化向量 \( \beta_i \) 的自内积 \( (\beta_i,\beta_i) \)，不是 \( (\alpha_i,\alpha_i) \)，也不是 \( \|\beta_i\| \)；少乘除一次是最常见错误。`,
          String.raw`忘记单位化：题目要求“规范（标准）正交基”时必须把每个 \( \beta_i \) 除以自身长度。`,
          String.raw`正交向量组（非零）一定线性无关，但线性无关组不一定正交；“两两正交”是更强的要求。`,
          String.raw`\( |A| = \pm 1 \) 推不出 \( A \) 正交；反过来正交矩阵行列式必为 \( \pm 1 \)，方向不同。`,
          String.raw`内积为零只能推出“正交”，不能推出某个向量为零向量；长度与夹角只对非零向量才有定义。`
        ]
      }
    ]
  };
})(window);
