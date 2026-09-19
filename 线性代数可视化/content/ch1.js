/* ============================================================
   ch1.js — 第一章 行列式
   考研数学（一）· 线性代数 · 可视化学习内容数据
   约定：块对象由 assets/js/app.js 的 renderBlock 渲染；
         公式用 \( \)（行内）与 \[ \]（行间）；
         viz 的 build 字段取自 window.WIDGETS 中已注册的组件名。
   注：含 LaTeX 反斜杠的字符串统一使用 String.raw，保证 \( \)、\\
         等控制序列原样进入运行时字符串。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH1 = {
    id: 'ch1',
    no: '一',
    title: '行列式',
    subtitle: '用排列与逆序数给出 n 阶行列式的定义，用七条性质与展开定理把任意行列式化归为三角形',
    tags: ['行列式', '逆序数', '余子式', '代数余子式', '展开定理', '范德蒙德行列式'],
    sections: [

      /* ================================================================
         1.1 行列式的概念与性质
         ================================================================ */
      {
        id: 'ch1-s1',
        num: '1.1',
        title: '行列式的概念与性质',
        lead: '大纲要求：了解行列式的概念，掌握行列式的性质；会应用行列式的性质和按行（列）展开定理计算行列式。本节从二阶、三阶行列式出发给出 n 阶行列式的排列定义，逐条落实七条基本性质，并建立余子式、代数余子式与按行（列）展开定理。',
        blocks: [
          { t: 'h3', idx: '①', text: '从二阶、三阶行列式说起' },
          { t: 'card', kind: 'def', tag: '定义', title: '二阶行列式', html: String.raw`<p class="tight">由 4 个数排成两行两列，按固定法则确定一个数：</p><div class="fml-row">\( \begin{vmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{vmatrix} = a_{11}a_{22} - a_{12}a_{21}. \)</div><p class="tight">其中 \( a_{ij} \) 的第一个下标 \( i \) 表示所在的行，第二个下标 \( j \) 表示所在的列。口诀：主对角线之积减去副对角线之积。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: '三阶行列式（对角线法则）', html: String.raw`<p class="tight">三阶行列式按 Sarrus 法则展开：</p><div class="fml-row">\( \begin{vmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{vmatrix} = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33}. \)</div><p class="tight">三条<span class="fml-note">主对角线方向的连线</span>上三数之积取正号，三条副对角线方向的连线上三数之积取负号，共 6 项。</p>` },
          { t: 'card', kind: 'warn', tag: '注意', title: '对角线法则的适用边界', html: String.raw`<p class="tight">对角线法则<b>只对 \( n = 1,2,3 \) 成立</b>。\( n \geq 4 \) 时不存在类似的“对角线公式”，必须回到定义、性质或展开定理。这是选择题中常见的陷阱。</p>` },
          { t: 'h3', idx: '②', text: '排列、逆序数与 n 阶行列式的定义' },
          { t: 'card', kind: 'def', tag: '定义', title: '排列与逆序数', html: String.raw`<p class="tight">由 \( 1,2,\cdots,n \) 组成的有序数组 \( j_1j_2\cdots j_n \) 称为一个 <b>n 级排列</b>，共有 \( n! \) 个。若 \( s \lt t \) 而 \( j_s \gt j_t \)，则称 \( j_s \) 与 \( j_t \) 构成一个<b>逆序</b>；排列中逆序的总数称为该排列的<b>逆序数</b>，记作 \( \tau(j_1j_2\cdots j_n) \)。逆序数为偶数（奇数）的排列叫偶排列（奇排列）。对换任意两个数的位置，排列奇偶性改变。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: 'n 阶行列式', html: String.raw`<p class="tight">用 \( n^2 \) 个数排成 n 行 n 列，规定</p><div class="fml-row">\( D = \begin{vmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & & \vdots \\ a_{n1} & a_{n2} & \cdots & a_{nn} \end{vmatrix} = \sum_{j_1j_2\cdots j_n} (-1)^{\tau(j_1j_2\cdots j_n)}\,a_{1j_1}a_{2j_2}\cdots a_{nj_n}, \)</div><p class="tight">其中求和跑遍全部 \( n! \) 个 n 级排列。要点：每一项由<b>取自不同行、不同列</b>的 n 个元素相乘而成，共 \( n! \) 项，正项与负项各占一半。</p>` },
          { t: 'card', kind: 'key', tag: '结论', title: '由定义可直接得到的结果', html: String.raw`<ul class="none"><li>一阶行列式 \( |a_{11}| = a_{11} \)（注意与绝对值记号的区别）。</li><li>上（下）三角行列式等于主对角线上 n 个元素之积：\( \begin{vmatrix} a_{11} & & \\ & \ddots & \\ * & & a_{nn} \end{vmatrix} = a_{11}a_{22}\cdots a_{nn} \)。</li><li>副对角行列式 \( \begin{vmatrix} & & a_{1n} \\ & \cdot\cdot\cdot & \\ a_{n1} & & \end{vmatrix} = (-1)^{\frac{n(n-1)}{2}} a_{1n}a_{2,n-1}\cdots a_{n1} \)。</li><li>若行列式中有一行（列）元素全为 0，则行列式为 0。</li></ul>` },
          { t: 'h3', idx: '③', text: '行列式的七条基本性质' },
          { t: 'table', head: ['序号', '性质', '说明与推论'], rows: [
            ['1', '转置不变', String.raw`\( |A^{T}| = |A| \)：行列互换（转置）不改变行列式的值，因此对行成立的性质对列同样成立。`],
            ['2', '互换变号', String.raw`互换两行（列），行列式改变符号；若两行（列）完全相同，则行列式为 0。`],
            ['3', '倍乘', String.raw`某一行（列）各元素同乘 \( k \)，等于用 \( k \) 乘整个行列式；反向即该行（列）的公因子可提到行列式外。`],
            ['4', '倍加不变', String.raw`把某一行（列）的 \( k \) 倍加到另一行（列）上，行列式的值不变——这是化三角形的主力工具。`],
            ['5', '按行拆分', String.raw`若某一行（列）的元素都是两组数之和，则行列式可拆成两个行列式之和（其余各行不变）。`],
            ['6', '两行相同为零', '有两行（列）完全相同，行列式为 0。'],
            ['7', '两行成比例为零', String.raw`有两行（列）对应元素成比例，行列式为 0；特例是某行（列）全为 0。`]
          ] },
          { t: 'card', kind: 'key', tag: '核心', title: '三条最常用的推论', html: String.raw`<ul class="none"><li>倍乘推论：\( \begin{vmatrix} \vdots & & \vdots \\ ka_{i1} & \cdots & ka_{in} \\ \vdots & & \vdots \end{vmatrix} = k\begin{vmatrix} \vdots & & \vdots \\ a_{i1} & \cdots & a_{in} \\ \vdots & & \vdots \end{vmatrix} \)；<b>只有一整行同时乘 k 才可外提</b>。</li><li>拆分推论：只拆一行（列），其余行（列）必须原样保留。</li><li>化三角：反复使用性质 4（并记录性质 2 引起的符号变化），可把行列式化为上三角，其值等于主对角线之积。</li></ul>` },
          { t: 'viz', build: 'detProperties', title: '行列式的性质演示', sub: '逐步施加行变换，观察行列式值如何变化' },
          { t: 'h3', idx: '④', text: '余子式与代数余子式' },
          { t: 'card', kind: 'def', tag: '定义', title: '余子式与代数余子式', html: String.raw`<p class="tight">在 n 阶行列式 \( D = |a_{ij}| \) 中划去元素 \( a_{ij} \) 所在的第 \( i \) 行与第 \( j \) 列，剩下的 \( n-1 \) 阶行列式称为 \( a_{ij} \) 的<b>余子式</b>，记作 \( M_{ij} \)；再乘上符号因子得<b>代数余子式</b></p><div class="fml-row">\( A_{ij} = (-1)^{i+j} M_{ij}. \)</div><p class="tight">符号 \( (-1)^{i+j} \) 呈棋盘格分布：\( \begin{pmatrix} + & - & + & \cdots \\ - & + & - & \cdots \\ + & - & + & \cdots \\ \vdots & & & \ddots \end{pmatrix} \)，左上角为 \( + \)。</p>` },
          { t: 'card', kind: 'warn', tag: '辨析', title: 'A_ij 与 a_ij 无关', html: String.raw`<p class="tight">代数余子式 \( A_{ij} \) 由划去第 \( i \) 行第 \( j \) 列后剩下的元素完全决定，<b>与元素 \( a_{ij} \) 本身的数值无关</b>。改变 \( a_{ij} \) 时（其余元素不动）\( A_{ij} \) 保持不变，这正是展开定理与“异行乘积为零”结论的基础。</p>` },
          { t: 'viz', build: 'detCompute', title: '按行展开的交互计算', sub: '选定一行，逐项累加 aij·Aij，观察行列式的值' },
          { t: 'viz', build: 'detGeometry', title: '行列式的几何意义', sub: '拖动列向量，观察平行四边形面积（3 阶为平行六面体体积）与 |det| 的对应关系' },
          { t: 'h3', idx: '⑤', text: '行列式按行（列）展开定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '展开定理（拉普拉斯展开的简单情形）', html: String.raw`<p class="tight">n 阶行列式 \( D \) 等于它的任意一行（列）的各元素与其对应的代数余子式乘积之和：</p><div class="fml-row">\( D = \sum_{j=1}^{n} a_{ij}A_{ij}\quad (i = 1,2,\cdots,n),\qquad D = \sum_{i=1}^{n} a_{ij}A_{ij}\quad (j = 1,2,\cdots,n). \)</div><p class="tight">而对“错位”的乘积有<b>零定理</b>：</p><div class="fml-row">\( \sum_{j=1}^{n} a_{ij}A_{kj} = 0 \ (i \neq k),\qquad \sum_{i=1}^{n} a_{ij}A_{ik} = 0 \ (j \neq k). \)</div><p class="tight">即：某行元素与另一行对应元素的代数余子式相乘再求和，结果必为 0。</p>` },
          { t: 'card', kind: 'tip', tag: '技巧', title: '降阶：先造零，再展开', html: String.raw`<p class="tight">展开定理的价值在于“降阶”。实用顺序是：先用倍加把某一行（列）化成只剩一个非零元素，再按这一行（列）展开，把 n 阶化为 n-1 阶。注意：<b>只能对同一行（列）的元素乘代数余子式</b>。</p>` },
          { t: 'h3', idx: '⑥', text: '范德蒙德行列式' },
          { t: 'card', kind: 'key', tag: '结论', title: '范德蒙德（Vandermonde）行列式', html: String.raw`<div class="fml-row">\( V_n = \begin{vmatrix} 1 & 1 & \cdots & 1 \\ x_1 & x_2 & \cdots & x_n \\ x_1^2 & x_2^2 & \cdots & x_n^2 \\ \vdots & \vdots & & \vdots \\ x_1^{n-1} & x_2^{n-1} & \cdots & x_n^{n-1} \end{vmatrix} = \prod_{1 \le i \lt j \le n} (x_j - x_i). \)</div><p class="tight">记忆：所有“下标大的减下标小的”之积。由公式立即得到：\( V_n \neq 0 \iff x_1,x_2,\cdots,x_n \) 两两不等。转置形式 \( \begin{vmatrix} 1 & x_1 & \cdots & x_1^{n-1} \\ \vdots & & & \vdots \\ 1 & x_n & \cdots & x_n^{n-1} \end{vmatrix} \) 的值相同。</p>` },
          { t: 'h3', idx: '⑦', text: '几类特殊行列式速查' },
          { t: 'table', head: ['类型', '形式', '结果'], rows: [
            ['对角行列式', String.raw`\( \begin{vmatrix} a_{11} & & \\ & \ddots & \\ & & a_{nn} \end{vmatrix} \)`, String.raw`\( a_{11}a_{22}\cdots a_{nn} \)`],
            ['上/下三角', String.raw`\( \begin{vmatrix} a_{11} & * & * \\ 0 & a_{22} & * \\ 0 & 0 & a_{33} \end{vmatrix} \)`, String.raw`\( a_{11}a_{22}a_{33} \)`],
            ['副对角', String.raw`\( \begin{vmatrix} 0 & 0 & a_{13} \\ 0 & a_{22} & 0 \\ a_{31} & 0 & 0 \end{vmatrix} \)`, String.raw`\( (-1)^{\frac{3\times2}{2}}a_{13}a_{22}a_{31} = -a_{13}a_{22}a_{31} \)`],
            ['分块三角', String.raw`\( \begin{vmatrix} A & C \\ O & B \end{vmatrix} \)，\( A,B \) 为方阵`, String.raw`\( |A|\,|B| \)`],
            ['分块副三角', String.raw`\( \begin{vmatrix} O & A_{m\times m} \\ B_{n\times n} & C \end{vmatrix} \)`, String.raw`\( (-1)^{mn}|A|\,|B| \)`]
          ] }
        ],
        examples: [
          {
            no: '例 1.1',
            meta: '基础 · 行变换 + 降阶',
            q: String.raw`计算四阶行列式 \( D = \begin{vmatrix} 1 & 2 & 3 & 4 \\ 2 & 3 & 4 & 1 \\ 3 & 4 & 1 & 2 \\ 4 & 1 & 2 & 3 \end{vmatrix} \)。`,
            sol: String.raw`<p><b>思路：</b>各行元素之和都是 \( 10 \)，属于“行和相等”型，先把第 2、3、4 列加到第 1 列，再提公因子。</p><p>把第 2、3、4 列加到第 1 列：</p><div class="fml"><div class="fml-row">\( D = \begin{vmatrix} 10 & 2 & 3 & 4 \\ 10 & 3 & 4 & 1 \\ 10 & 4 & 1 & 2 \\ 10 & 1 & 2 & 3 \end{vmatrix} = 10\begin{vmatrix} 1 & 2 & 3 & 4 \\ 1 & 3 & 4 & 1 \\ 1 & 4 & 1 & 2 \\ 1 & 1 & 2 & 3 \end{vmatrix}. \)</div><div class="fml-row">\( \xrightarrow{\ r_2-r_1,\ r_3-r_1,\ r_4-r_1\ }\ 10\begin{vmatrix} 1 & 2 & 3 & 4 \\ 0 & 1 & 1 & -3 \\ 0 & 2 & -2 & -2 \\ 0 & -1 & -1 & -1 \end{vmatrix} = 10\begin{vmatrix} 1 & 1 & -3 \\ 2 & -2 & -2 \\ -1 & -1 & -1 \end{vmatrix}. \)</div></div><p>最后一个三阶行列式用 Sarrus 法则或按第一行展开：</p><div class="fml"><div class="fml-row">\( \begin{vmatrix} 1 & 1 & -3 \\ 2 & -2 & -2 \\ -1 & -1 & -1 \end{vmatrix} = 1\cdot(2-2) - 1\cdot(-2-2) + (-3)\cdot(-2-2) = 0 + 4 + 12 = 16. \)</div></div><p>故 \( \mathbf{D = 160} \)。</p>`
          },
          {
            no: '例 1.2',
            meta: '基础 · 性质辨识',
            q: String.raw`已知三阶行列式 \( |A| = \begin{vmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{vmatrix} = 2 \)，求 \( D' = \begin{vmatrix} a_{11} & a_{12} & a_{13} \\ 2a_{31} & 2a_{32} & 2a_{33} \\ 3a_{21} & 3a_{22} & 3a_{23} \end{vmatrix} \)。`,
            sol: String.raw`<p><b>思路：</b>逐条对号入座——倍乘（提出常数）与互换（变号）。</p><p>第 2 行是 \( A \) 的第 3 行的 2 倍，提出因子 \( 2 \)；第 3 行是 \( A \) 的第 2 行的 3 倍，提出因子 \( 3 \)：</p><div class="fml"><div class="fml-row">\( D' = 2\times 3 \begin{vmatrix} a_{11} & a_{12} & a_{13} \\ a_{31} & a_{32} & a_{33} \\ a_{21} & a_{22} & a_{23} \end{vmatrix}. \)</div></div><p>此时括号内的行列式是 \( |A| \) 交换第 2、3 行的结果，故它等于 \( -|A| = -2 \)。所以</p><div class="fml"><div class="fml-row">\( \mathbf{D' = 6\times(-2) = -12}. \)</div></div><p><b>点评：</b>先把所有常数因子提干净、再看“剩下的行列式与原行列式差几次互换”，可以避免漏符号。</p>`
          },
          {
            no: '例 1.3',
            meta: '基础 · 范德蒙德',
            q: String.raw`计算 \( D = \begin{vmatrix} 1 & 1 & 1 & 1 \\ 1 & 2 & 3 & 4 \\ 1 & 4 & 9 & 16 \\ 1 & 8 & 27 & 64 \end{vmatrix} \)。`,
            sol: String.raw`<p>逐行观察：第 2、3、4 行分别是 \( x_i \) 的 1、2、3 次幂，其中 \( x_1 = 1,\ x_2 = 2,\ x_3 = 3,\ x_4 = 4 \)，这是一个转置形式的 <b>4 阶范德蒙德行列式</b>。</p><div class="fml"><div class="fml-row">\( D = \prod_{1 \le i \lt j \le 4}(x_j - x_i) = (2-1)(3-1)(4-1)(3-2)(4-2)(4-3). \)</div></div><p>共 \( C_4^2 = 6 \) 个因子，逐个计算：</p><div class="fml"><div class="fml-row">\( D = 1\times 2 \times 3 \times 1 \times 2 \times 1 = \mathbf{12}. \)</div></div><p><b>易错提醒：</b>公式中的因子一律是“下标大的减下标小的”，顺序写反会整体差一个 \( (-1)^{\frac{n(n-1)}{2}} \) 的符号。</p>`
          },
          {
            no: '例 1.4',
            meta: '概念 · 展开定理的两个方向',
            q: String.raw`设 4 阶矩阵 \( A = (a_{ij}) \) 满足 \( |A| = -1 \)。分别求 \( S_1 = a_{12}A_{12} + a_{22}A_{22} + a_{32}A_{32} + a_{42}A_{42} \) 与 \( S_2 = a_{12}A_{13} + a_{22}A_{23} + a_{32}A_{33} + a_{42}A_{43} \)。`,
            sol: String.raw`<p>把 4 阶行列式 \( |A| \) 按<b>第 2 列</b>展开，恰好得到第 2 列各元素与其自身代数余子式之积的和，于是</p><div class="fml"><div class="fml-row">\( S_1 = |A| = \mathbf{-1}. \)</div></div><p>而 \( S_2 \) 用的是第 2 列的元素、第 3 列的代数余子式，属“异列错位”求和，由零定理</p><div class="fml"><div class="fml-row">\( S_2 = 0. \)</div></div><p>一般结论：\( \sum_{i} a_{ij}A_{ik} = \begin{cases} |A|, & k = j, \\ 0, & k \neq j. \end{cases} \) 这一组恒等式（行、列各一组）是抽象行列式计算的常用工具。</p>`
          }
        ],
        pitfalls: [
          String.raw`余子式与代数余子式混淆：\( M_{ij} \) 是划去第 \( i \) 行第 \( j \) 列后的 \( n-1 \) 阶行列式，\( A_{ij} = (-1)^{i+j}M_{ij} \) 还带符号，棋盘格左上角是 \( + \)。`,
          String.raw`误以为代数余子式与元素本身有关：\( A_{ij} \) 与 \( a_{ij} \) 的取值无关；因此“求 \( \sum a_{ij}A_{ij} \)” 时要先看角标是否对齐，错位的结果是 0。`,
          String.raw`把倍加性质用错对象：只有“某行的 \( k \) 倍加到另一行”才不变值；“某行乘 \( k \)”会使整个行列式变为 \( k \) 倍，不能既乘又不记倍率。`,
          String.raw`两行成比例（含相同）时行列式为 0，是“充分条件”而非“充要条件”：行列式为 0 的矩阵还可能因为其他原因（如行向量线性相关但不成比例）而退化。`,
          String.raw`误用对角线法则：\( n \geq 4 \) 时三阶的“六项对角线”公式完全不成立，四阶行列式有 \( 4! = 24 \) 项。`
        ]
      },
      /* ================================================================
         1.2 行列式的计算
         ================================================================ */
      {
        id: 'ch1-s2',
        num: '1.2',
        title: '行列式的计算',
        lead: '大纲要求：会应用行列式的性质和行列式按行（列）展开定理计算行列式。本节把“计算”拆成可操作的流程：先辨结构，再选主元，最后化三角形或降阶，并给出数字型、行和相等型、箭型、递推型、范德蒙德型与抽象型的处理套路。',
        blocks: [
          { t: 'h3', idx: '①', text: '计算总纲：化三角形法' },
          { t: 'card', kind: 'key', tag: '总纲', title: '把行列式化归为三角形', html: String.raw`<p class="tight">上（下）三角行列式的值等于主对角线元素之积，因此计算的中心任务是：<b>用“倍加”把主对角线一侧的元素全部化为 0</b>。两条铁律：</p><ul class="none"><li>交换两行（列）一次，要给结果添一个负号，务必记账；</li><li>某行乘 \( k \) 提到行列式外后，该行必须同时乘 \( k \)（不能只改一个元素）。</li></ul>` },
          { t: 'list', ordered: true, items: [
            String.raw`<b>辨结构：</b>观察行和（列和）是否相等、是否有公因子、零元素是否集中、是否呈等差/等比/三对角等规律。`,
            String.raw`<b>选主元：</b>优先把元素 \( 1 \) 或 \( -1 \) 所在位置作为主元，用它消去同列的其他元素可以避免分数。`,
            String.raw`<b>消元：</b>自上而下依次把主对角线下方元素化为 0，得到行阶梯形（三角行列式）。`,
            String.raw`<b>取值：</b>对角线相乘，并乘上所有“提出过的因子”与“交换带来的符号”。`,
            String.raw`<b>降阶替代：</b>若某行（列）已只剩一个非零元，直接用展开定理降阶，往往比硬化三角更快。`
          ] },
          { t: 'h3', idx: '②', text: '六类常考结构' },
          { t: 'table', head: ['类型', '识别特征', '首选方法'], rows: [
            ['数字行列式', '元素为具体数字，阶数 3 至 5', '选小主元化上三角；或先造零再按行展开'],
            ['行（列）和相等', '每一行（列）元素之和相同', '把其余各列加到第 1 列，提公因子后继续造零'],
            ['箭型（爪型）', '只有第一行、第一列与主对角线非零', '用对角线元素消去第一行（列）的非零元'],
            ['递推型（三对角）', '除三条对角线外全为 0，结构整齐', '按第一行（列）展开得递推式 \( D_n = aD_{n-1} - bcD_{n-2} \)，再求通项'],
            ['范德蒙德型', '行（列）元素成等比数列、幂次递增', '化为标准范德蒙德形式后套公式 \( \prod_{i \lt j}(x_j - x_i) \)'],
            ['ab 型（秩 1 扰动）', String.raw`形如 \( A = aE + \alpha\beta^{T} \)`, String.raw`用公式 \( |\lambda E + \alpha\beta^{T}| = \lambda^{n}\left(1 + \frac{\beta^{T}\alpha}{\lambda}\right) \)，或升阶加边法`]
          ] },
          { t: 'h3', idx: '③', text: '通用技巧清单' },
          { t: 'list', items: [
            String.raw`<b>提公因子：</b>某行（列）有公共因子立即提出，能大幅降低数字规模。`,
            String.raw`<b>制造零元素：</b>看到 \( 1 \) 或 \( -1 \) 就优先用来消元；没有 1 时可通过“一行减去另一行”造出。`,
            String.raw`<b>逐行相减：</b>等差结构的行列式，相邻行相减后常出现相同行或大量零。`,
            String.raw`<b>按行（列）展开：</b>降低阶数，配合“造零”使用；也可同时按多行展开（分块降阶）。`,
            String.raw`<b>递推与归纳：</b>n 阶整齐结构先算 \( D_1,D_2 \)，再找 \( D_n \) 与低阶的递推关系。`,
            String.raw`<b>加边（升阶）法：</b>对缺少统一形式的行列式，补上一行一列（保证新行列式值不变）后反而便于化零。`,
            String.raw`<b>分块降阶：</b>\( \begin{vmatrix} A & C \\ O & B \end{vmatrix} = |A||B| \)，把高阶拆成两个低阶。`
          ] },
          { t: 'h3', idx: '④', text: '抽象行列式常用公式' },
          { t: 'card', kind: 'key', tag: '公式', title: '与矩阵运算结合的行列式公式', html: String.raw`<ul class="none"><li>\( |A^{T}| = |A| \)；\( |AB| = |A|\,|B| \)（要求 \( A,B \) 同阶方阵）；\( |A^{k}| = |A|^{k} \)。</li><li>\( |kA| = k^{n}|A| \)（\( n \) 为阶数）；\( |A^{-1}| = |A|^{-1} \)（\( A \) 可逆）。</li><li>\( |A^{*}| = |A|^{n-1} \)（\( A \) 为 n 阶方阵，对任意 \( A \) 成立）。</li><li>\( \begin{vmatrix} A & O \\ O & B \end{vmatrix} = \begin{vmatrix} A & C \\ O & B \end{vmatrix} = |A|\,|B|,\qquad \begin{vmatrix} O & A \\ B & O \end{vmatrix} = (-1)^{mn}|A|\,|B| \)。</li><li>\( |A| = \prod_{i=1}^{n}\lambda_i \)（特征值之积，见第五章）。</li></ul>` },
          { t: 'viz', build: 'detProperties', title: '结构 → 方法对照实验', sub: '改变参数观察不同结构下行列式值的变化规律' },
          { t: 'viz', build: 'detRowOps', title: '初等行变换对行列式的影响', sub: '逐步施加交换、倍乘、倍加，核对 |B| 与 |A| 的变化规律（交换变号 / 倍乘乘 k / 倍加不变）' },
          { t: 'card', kind: 'exam', tag: '考法', title: '真题常见设问', html: String.raw`<p class="tight">① 直接计算 4 阶数值行列式（填空题）；② 含参数 \( \lambda \) 的行列式求根（与特征值、方程组联考）；③ 已知 \( |A| \) 求 \( |f(A)| \)（用公式 \( |kA| = k^{n}|A| \)、\( |A^{*}| = |A|^{n-1} \)）；④ 用行列式证 \( A \) 可逆或求 \( x \)。</p>` }
        ],
        examples: [
          {
            no: '例 1.5',
            meta: '提高 · 行和相等型（n 阶）',
            q: String.raw`计算 n 阶行列式 \( D_n = \begin{vmatrix} x & a & \cdots & a \\ a & x & \cdots & a \\ \vdots & \vdots & \ddots & \vdots \\ a & a & \cdots & x \end{vmatrix} \)（主对角线全为 \( x \)，其余元素全为 \( a \)）。`,
            sol: String.raw`<p>每一行元素之和都等于 \( x + (n-1)a \)。把第 \( 2,3,\cdots,n \) 列统统加到第 1 列：</p><div class="fml"><div class="fml-row">\( D_n = \begin{vmatrix} x+(n-1)a & a & \cdots & a \\ x+(n-1)a & x & \cdots & a \\ \vdots & \vdots & \ddots & \vdots \\ x+(n-1)a & a & \cdots & x \end{vmatrix} = \left[x + (n-1)a\right]\begin{vmatrix} 1 & a & \cdots & a \\ 1 & x & \cdots & a \\ \vdots & \vdots & \ddots & \vdots \\ 1 & a & \cdots & x \end{vmatrix}. \)</div></div><p>把第 1 行的 \( -1 \) 倍加到其余各行，得到分块上三角（第 1 列只剩一个 1）：</p><div class="fml"><div class="fml-row">\( D_n = \left[x+(n-1)a\right]\begin{vmatrix} 1 & a & a & \cdots & a \\ 0 & x-a & 0 & \cdots & 0 \\ 0 & 0 & x-a & \cdots & 0 \\ \vdots & \vdots & & \ddots & \vdots \\ 0 & 0 & 0 & \cdots & x-a \end{vmatrix} = \mathbf{\left[x+(n-1)a\right](x-a)^{n-1}}. \)</div></div><p><b>验证：</b>\( n = 2 \) 时 \( \begin{vmatrix} x & a \\ a & x \end{vmatrix} = x^{2}-a^{2} = (x+a)(x-a) \)，与公式一致。</p><p><b>点评：</b>这是“行和相等”型最基本的一例，其结论（特征值为 \( x-a \) 与 \( x+(n-1)a \)）在第五章、第六章会反复出现。</p>`
          },
          {
            no: '例 1.6',
            meta: '提高 · 三对角递推',
            q: String.raw`计算 n 阶行列式 \( D_n = \begin{vmatrix} 2 & 1 & & \\ 1 & 2 & 1 & \\ & \ddots & \ddots & \ddots \\ & & 1 & 2 \end{vmatrix} \)（主对角线为 2，紧邻的两条次对角线为 1，其余为 0）。`,
            sol: String.raw`<p>先算低阶：\( D_1 = 2,\ D_2 = \begin{vmatrix} 2 & 1 \\ 1 & 2 \end{vmatrix} = 3 \)。</p><p>对 \( n \geq 3 \)，按第 1 行展开：第 1 行只有 \( a_{11} = 2 \) 与 \( a_{12} = 1 \) 非零。</p><div class="fml"><div class="fml-row">\( D_n = 2D_{n-1} + 1\cdot(-1)^{1+2}\begin{vmatrix} 1 & 1 & 0 & \cdots \\ 0 & 2 & 1 & \cdots \\ 0 & 1 & 2 & \cdots \\ \vdots & & & \ddots \end{vmatrix} = 2D_{n-1} - D_{n-2}. \)</div></div><p>即得递推式 \( D_n - D_{n-1} = D_{n-1} - D_{n-2} \)，说明 \( \{D_n\} \) 为等差数列。首项 \( D_1 = 2 \)，公差 \( D_2 - D_1 = 1 \)，于是</p><div class="fml"><div class="fml-row">\( \mathbf{D_n = n+1}. \)</div></div><p><b>点评：</b>三对角行列式的标准套路是“按第一行（列）展开得二阶线性递推”，再由 \( D_1,D_2 \) 定出通项；若递推式为 \( D_n = pD_{n-1} + qD_{n-2} \)，可解特征方程 \( r^{2} = pr + q \)。</p>`
          },
          {
            no: '例 1.7',
            meta: '提高 · 范德蒙德型',
            q: String.raw`计算 \( D = \begin{vmatrix} a & b & c \\ a^{2} & b^{2} & c^{2} \\ a^{3} & b^{3} & c^{3} \end{vmatrix} \)（\( a,b,c \) 为任意实数）。`,
            sol: String.raw`<p>各行（列）有公因子，先把 \( a,b,c \) 分别从三列中提出：</p><div class="fml"><div class="fml-row">\( D = abc\begin{vmatrix} 1 & 1 & 1 \\ a & b & c \\ a^{2} & b^{2} & c^{2} \end{vmatrix}. \)</div></div><p>括号内是 \( x_1 = a,\ x_2 = b,\ x_3 = c \) 的三阶范德蒙德行列式，于是</p><div class="fml"><div class="fml-row">\( \mathbf{D = abc\,(b-a)(c-a)(c-b)}. \)</div></div><p>若某个参数为 0，例如 \( a = 0 \)，则原行列式第 1 列与第 2、3 列成比例关系退化为第一列为零，仍有 \( D = 0 \)，与公式一致。</p><p><b>点评：</b>范德蒙德型的关键是“幂次齐全”：先把第一行（列）化成全 1，再看指数是否为 \( 0,1,2,\cdots,n-1 \)。指数不是从 0 开始时，往往需要用行变换或提取公因子补齐。</p>`
          }
        ],
        pitfalls: [
          String.raw`化三角形时漏记符号与倍率：交换两行要变号；某行乘过 \( k \) 后必须乘回去，否则结果整体差 \( k \) 倍。`,
          String.raw`范德蒙德公式的指数要求是从 0 到 \( n-1 \) 连续齐全，缺项时不能直接套公式；顺序颠倒（如本题从 \( a \) 到 \( a^{3} \)）要先提公因子。`,
          String.raw`递推行列式只对 \( n \geq 3 \) 成立，且必须单独算出 \( D_1,D_2 \) 作为初始条件，不能凭空假设 \( D_0 \)。`,
          String.raw`抽象行列式的三个常见错误：\( |A+B| \neq |A|+|B| \)；\( |kA| = k^{n}|A| \) 而非 \( k|A| \)；\( |A^{*}| = |A|^{n-1} \) 中的 \( n \) 是矩阵阶数而不是 \( n-1 \) 阶。`
        ]
      }
    ]
  };
})(window);
