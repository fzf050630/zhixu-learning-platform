/* ============================================================
   ch2.js — 第二章 矩阵
   考研数学（一）· 线性代数 · 可视化学习内容数据
   约定：块对象由 assets/js/app.js 的 renderBlock 渲染；
         公式用 \( \)（行内）与 \[ \]（行间）；
         viz 的 build 字段取自 window.WIDGETS 中已注册的组件名。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH2 = {
    id: 'ch2',
    no: '二',
    title: '矩阵',
    subtitle: '矩阵是线性代数的运算主体：乘法不交换、逆与伴随刻画可逆性、初等变换与秩统一描述结构',
    tags: ['矩阵运算', '乘法', '转置', '逆矩阵', '伴随矩阵', '初等变换', '矩阵的秩', '分块矩阵'],
    sections: [

      /* ================================================================
         2.1 矩阵的概念与运算
         ================================================================ */
      {
        id: 'ch2-s1',
        num: '2.1',
        title: '矩阵的概念与运算',
        lead: '大纲要求：理解矩阵的概念，了解单位矩阵、数量矩阵、对角矩阵、三角矩阵、对称矩阵和反对称矩阵以及它们的性质；掌握矩阵的线性运算、乘法、转置以及它们的运算规律，了解方阵的幂与方阵乘积的行列式的性质。',
        blocks: [
          { t: 'h3', idx: '①', text: '矩阵的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: 'm×n 矩阵', html: String.raw`<p class="tight">由 \( m\times n \) 个数 \( a_{ij} \) 排成的 \( m \) 行 \( n \) 列的数表</p><div class="fml-row">\( A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix} \)</div><p class="tight">称为一个 <b>m×n 矩阵</b>，简记为 \( A = (a_{ij})_{m\times n} \)。当 \( m = n \) 时称为 <b>n 阶方阵</b>；只有一行的矩阵称为行矩阵（行向量），只有一列的矩阵称为列矩阵（列向量）。两个矩阵<b>同型且对应元素全相等</b>时才相等。</p>` },
          { t: 'table', head: ['对比项', '矩阵', '行列式'], rows: [
            ['记号', String.raw`圆括号或方括号 \( (\ ) \)、\( [\ ] \)`, String.raw`竖线 \( |\ | \)`],
            ['形状', String.raw`矩形数表，\( m\times n \)`, String.raw`方形数表，\( n\times n \)`],
            ['本质', '是一张“表”，本身不是数', '按法则算出的一个数'],
            ['相等', '同型且对应元素全相等', '两个数相等即可'],
            ['数乘', String.raw`每个元素都乘 \( k \)`, String.raw`只有一行（列）乘 \( k \) 即整体乘 \( k \)`]
          ] },
          { t: 'h3', idx: '②', text: '几类特殊矩阵' },
          { t: 'table', head: ['名称', '记号', '特征', '常用结论'], rows: [
            ['零矩阵', String.raw`\( O \)`, '所有元素全为 0', String.raw`\( AO = O,\ OA = O \)；零矩阵不唯一，与矩阵同型才有意义`],
            ['单位矩阵', String.raw`\( E \)（或 \( I \)）`, '主对角线为 1，其余为 0', String.raw`\( AE = EA = A \)；\( E^{k} = E \)；\( |E| = 1 \)`],
            ['数量矩阵', String.raw`\( kE \)`, '主对角线全为 \( k \)', String.raw`与任意同阶方阵可交换：\( (kE)A = A(kE) = kA \)`],
            ['对角矩阵', String.raw`\( \Lambda = \mathrm{diag}(\lambda_1,\cdots,\lambda_n) \)`, '非主对角线元素全为 0', String.raw`\( \Lambda_1\Lambda_2 \) 对应元素相乘；\( |\Lambda| = \prod\lambda_i \)；\( \Lambda^{k} = \mathrm{diag}(\lambda_1^{k},\cdots,\lambda_n^{k}) \)`],
            ['三角矩阵', String.raw`上（下）三角`, '主对角线一侧全为 0', String.raw`和、差、积仍为三角矩阵；\( |A| = a_{11}a_{22}\cdots a_{nn} \)`],
            ['对称矩阵', String.raw`\( A^{T} = A \)`, String.raw`\( a_{ij} = a_{ji} \)`, '元素关于主对角线对称；实对称矩阵必可正交对角化（见 5.3）'],
            ['反对称矩阵', String.raw`\( A^{T} = -A \)`, String.raw`\( a_{ij} = -a_{ji} \)，故 \( a_{ii} = 0 \)`, String.raw`奇数阶反对称矩阵的行列式为 0；任意方阵可唯一分解为对称与反对称之和`]
          ] },
          { t: 'card', kind: 'key', tag: '结论', title: '反对称矩阵与“对称 + 反对称”分解', html: String.raw`<ul class="none"><li>反对称矩阵的主对角线元素全为 0，且奇数阶反对称矩阵不可逆（\( |A| = 0 \)）。</li><li>任意方阵都可唯一分解为 \( A = \dfrac{A+A^{T}}{2} + \dfrac{A-A^{T}}{2} \)，前一项对称、后一项反对称。</li><li>对任意 \( m\times n \) 矩阵 \( A \)，\( A^{T}A \) 与 \( AA^{T} \) 都是对称矩阵；特别地，实矩阵中 \( A^{T}A = O \iff A = O \)。</li></ul>` },
          { t: 'h3', idx: '③', text: '矩阵的线性运算' },
          { t: 'card', kind: 'def', tag: '定义', title: '矩阵的加法与数乘', html: String.raw`<p class="tight"><b>加法</b>（要求同型）：\( (A+B)_{ij} = a_{ij} + b_{ij} \)。<b>数乘</b>：\( (kA)_{ij} = k\,a_{ij} \)，即用 \( k \) 乘矩阵的<b>每一个</b>元素。矩阵的加法与数乘统称<b>线性运算</b>。</p><p class="tight">运算律：\( A+B = B+A \)；\( (A+B)+C = A+(B+C) \)；\( A+O = A \)；\( A+(-A) = O \)；\( k(A+B) = kA+kB \)；\( (k+l)A = kA+lA \)；\( k(lA) = (kl)A \)；\( 1\cdot A = A \)。</p>` },
          { t: 'card', kind: 'warn', tag: '辨析', title: '数乘与行列式的数乘完全不同', html: String.raw`<p class="tight">矩阵数乘要乘到每个元素上：\( kA = (k\,a_{ij}) \)；而行列式的“某行乘 \( k \)”只涉及一行，\( k|A| \) 对应的是 \( |kA| = k^{n}|A| \)。这是填空题最常见的失分点。</p>` },
          { t: 'h3', idx: '④', text: '矩阵的乘法' },
          { t: 'card', kind: 'def', tag: '定义', title: '矩阵乘法的定义', html: String.raw`<p class="tight">设 \( A = (a_{ij})_{m\times s} \)，\( B = (b_{ij})_{s\times n} \)，规定 \( C = AB = (c_{ij})_{m\times n} \)，其中</p><div class="fml-row">\( c_{ij} = \sum_{k=1}^{s} a_{ik}b_{kj} = a_{i1}b_{1j} + a_{i2}b_{2j} + \cdots + a_{is}b_{sj}. \)</div><p class="tight">即 \( c_{ij} \) 等于 \( A \) 的<b>第 i 行</b>与 \( B \) 的<b>第 j 列</b>对应元素乘积之和。可乘条件：<b>左矩阵的列数 = 右矩阵的行数</b>；乘积的形状为“左行数 × 右列数”。</p>` },
          { t: 'viz', build: 'matrixOps', title: '矩阵乘法交互演示', sub: '拖动元素，观察 AB 与 BA 的差别以及行列积的对应关系' },
          { t: 'viz', build: 'matrixMultiply', title: '矩阵乘法：行乘列逐项累加', sub: '选择行 i 与列 j，逐步累加 aᵢₖbₖⱼ，观察 C[i][j] 的生成过程' },
          { t: 'card', kind: 'key', tag: '运算律', title: '矩阵乘法满足与不满足的规律', html: String.raw`<ul class="none"><li><b>满足</b>：结合律 \( (AB)C = A(BC) \)；左、右分配律 \( A(B+C) = AB+AC \)、\( (B+C)A = BA+CA \)；与数乘相容 \( k(AB) = (kA)B = A(kB) \)；\( AE = EA = A \)。</li><li><b>不满足</b>：交换律 \( AB \neq BA \)（一般情形）；消去律 \( AB = AC \Rightarrow B = C \) 不成立；\( AB = O \Rightarrow A = O \) 或 \( B = O \) 不成立；\( (AB)^{k} \neq A^{k}B^{k} \)（一般情形）。</li><li>但若 \( A,B \) 可交换（\( AB = BA \)），则二项式定理成立：\( (A+B)^{m} = \sum_{i=0}^{m}C_m^{i}A^{i}B^{m-i} \)。</li></ul>` },
          { t: 'table', head: ['运算', '数的运算', '矩阵运算'], rows: [
            ['交换律', String.raw`\( ab = ba \) 恒成立`, String.raw`\( AB \neq BA \)（一般情形），只有特殊矩阵才可换`],
            ['消去律', String.raw`\( ab = ac,\ a \neq 0 \Rightarrow b = c \)`, String.raw`\( AB = AC \) 推不出 \( B = C \)`],
            ['零因子', String.raw`\( ab = 0 \Rightarrow a = 0 \) 或 \( b = 0 \)`, String.raw`\( AB = O \) 推不出 \( A = O \) 或 \( B = O \)`],
            ['幂运算', String.raw`\( (ab)^{k} = a^{k}b^{k} \)`, String.raw`\( (AB)^{k} = ABAB\cdots AB \neq A^{k}B^{k} \)`]
          ] },
          { t: 'h3', idx: '⑤', text: '矩阵的转置' },
          { t: 'card', kind: 'key', tag: '性质', title: '转置的运算规律', html: String.raw`<ul class="none"><li>\( (A^{T})^{T} = A \)；\( (A+B)^{T} = A^{T}+B^{T} \)；\( (kA)^{T} = kA^{T} \)。</li><li>\( (AB)^{T} = B^{T}A^{T} \)——<b>顺序颠倒</b>，可推广为 \( (A_1A_2\cdots A_s)^{T} = A_s^{T}\cdots A_2^{T}A_1^{T} \)。</li><li>反例意识：\( (AB)^{T} \neq A^{T}B^{T} \)，两者一般连形状都不同（除非 \( A,B \) 可换且同阶）。</li></ul>` },
          { t: 'h3', idx: '⑥', text: '方阵的幂与方阵乘积的行列式' },
          { t: 'card', kind: 'key', tag: '公式', title: '行列式与矩阵运算的结合', html: String.raw`<ul class="none"><li>\( |AB| = |A|\,|B| \)（要求同阶方阵）；可推广到有限个：\( |A_1A_2\cdots A_s| = |A_1||A_2|\cdots|A_s| \)。</li><li>\( |A^{k}| = |A|^{k} \)；\( |A^{T}| = |A| \)。</li><li>由此可得：\( A \) 可逆 \( \iff |A| \neq 0 \)；且 \( AB = O \) 而 \( A \) 可逆时必有 \( B = O \)。</li><li>方阵的幂：\( A^{k}A^{l} = A^{k+l} \)，\( (A^{k})^{l} = A^{kl} \)。</li></ul>` },
          { t: 'card', kind: 'tip', tag: '技巧', title: '求 A^k 的四条常用路线', html: String.raw`<ul class="none"><li><b>归纳法：</b>算 \( A^{2},A^{3} \) 找规律，再用数学归纳法证明。</li><li><b>二项式拆解：</b>把 \( A \) 拆成 \( cE + B \)，其中 \( B \) 幂零（如 \( B^{2} = O \)），则 \( A^{n} = c^{n}E + nc^{n-1}B + \cdots \) 只剩少数项。</li><li><b>秩 1 矩阵：</b>若 \( A = \alpha\beta^{T} \neq O \)，则 \( A^{k} = (\beta^{T}\alpha)^{k-1}A \)。</li><li><b>相似对角化：</b>\( A = P\Lambda P^{-1} \Rightarrow A^{k} = P\Lambda^{k}P^{-1} \)（见 5.2）。</li></ul>` },
          { t: 'card', kind: 'exam', tag: '考法', title: '本节在真题中的呈现', html: String.raw`<p class="tight">选择题多考“乘法性质辨析”（能否交换、能否消去、\( AB = O \) 的推论）；填空题常考 \( A^{n} \) 的数值计算与 \( |kA| \)、\( |AB| \) 的计算；解答题中矩阵乘法是方程组、特征值等一切内容的运算基础。</p>` }
        ],
        examples: [
          {
            no: '例 2.1',
            meta: '基础 · 乘法不可交换',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \)，\( B = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \)。计算 \( AB \) 与 \( BA \)，并说明矩阵乘法不满足交换律。`,
            sol: String.raw`<p>按“行乘列求和”计算：</p><div class="fml"><div class="fml-row">\( AB = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} = \begin{pmatrix} 1\times1+1\times3 & 1\times2+1\times4 \\ 0\times1+1\times3 & 0\times2+1\times4 \end{pmatrix} = \begin{pmatrix} 4 & 6 \\ 3 & 4 \end{pmatrix}, \)</div><div class="fml-row">\( BA = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} = \begin{pmatrix} 1 & 3 \\ 3 & 7 \end{pmatrix}. \)</div></div><p>显然 \( AB \neq BA \)，矩阵乘法不符合交换律。<b>进一步计算可得</b> \( AB - BA = \begin{pmatrix} 3 & 3 \\ 0 & -3 \end{pmatrix} \neq O \)，这类“求 \( AB-BA \)”的题目必须先左乘后右乘，不能颠倒顺序。</p>`
          },
          {
            no: '例 2.2',
            meta: '提高 · 二项式拆解求幂',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \)，求 \( A^{n} \)（\( n \) 为正整数）。`,
            sol: String.raw`<p>把 \( A \) 拆成数量矩阵与幂零矩阵之和：\( A = E + N \)，其中 \( N = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix} \) 满足 \( N^{2} = O \)，且 \( E N = N E \)，故二项式定理可用：</p><div class="fml"><div class="fml-row">\( A^{n} = (E+N)^{n} = E^{n} + nE^{n-1}N + \frac{n(n-1)}{2}E^{n-2}N^{2} + \cdots = E + nN = \begin{pmatrix} 1 & n \\ 0 & 1 \end{pmatrix}. \)</div></div><p><b>点评：</b>凡 \( A = cE + B \) 且 \( B^{2} = O \)（或 \( B \) 为幂零矩阵）的题目，都可以用这种方式把幂运算化为有限项求和，避免了逐次相乘。</p>`
          },
          {
            no: '例 2.3',
            meta: '提高 · 秩 1 矩阵的幂',
            q: String.raw`设 \( \alpha = \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix} \)，\( \beta = \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix} \)，\( A = \alpha\beta^{T} \)，求 \( A^{n} \)。`,
            sol: String.raw`<p>先算 \( \beta^{T}\alpha \)（一个数）与 \( A \)：</p><div class="fml"><div class="fml-row">\( \beta^{T}\alpha = (1,1,1)\begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix} = 1+2+3 = 6,\qquad A = \begin{pmatrix} 1 & 1 & 1 \\ 2 & 2 & 2 \\ 3 & 3 & 3 \end{pmatrix}. \)</div></div><p>于是</p><div class="fml"><div class="fml-row">\( A^{2} = (\alpha\beta^{T})(\alpha\beta^{T}) = \alpha(\beta^{T}\alpha)\beta^{T} = 6\alpha\beta^{T} = 6A, \)</div></div><p>归纳即得</p><div class="fml"><div class="fml-row">\( A^{n} = (\beta^{T}\alpha)^{n-1}A = 6^{\,n-1}A = \begin{pmatrix} 6^{n-1} & 6^{n-1} & 6^{n-1} \\ 2\cdot6^{n-1} & 2\cdot6^{n-1} & 2\cdot6^{n-1} \\ 3\cdot6^{n-1} & 3\cdot6^{n-1} & 3\cdot6^{n-1} \end{pmatrix}. \)</div></div><p><b>点评：</b>秩 1 矩阵必可写成 \( \alpha\beta^{T} \)（\( \alpha,\beta \) 为非零列向量），此时 \( r(A) = 1 \)，且 \( A^{n} = (\beta^{T}\alpha)^{n-1}A \)。请特别注意 \( \beta^{T}\alpha \) 是数、\( \alpha\beta^{T} \) 是矩阵。</p>`
          },
          {
            no: '例 2.4',
            meta: '概念 · 零因子与消去律',
            q: String.raw`已知 \( A = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix} \)，\( B = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix} \)。验证 \( A \neq O \)，\( B \neq O \)，但 \( AB = O \)，并说明由此能否推出“消去律”成立。`,
            sol: String.raw`<div class="fml"><div class="fml-row">\( AB = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}\begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix} = \begin{pmatrix} 1\times0+0\times1 & 1\times0+0\times0 \\ 0\times0+0\times1 & 0\times0+0\times0 \end{pmatrix} = \begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix} = O. \)</div></div><p>虽然 \( A \neq O \)、\( B \neq O \)，乘积却为零矩阵，说明矩阵中存在“零因子”，因此 \( AB = O \) 不能推出 \( A = O \) 或 \( B = O \)。</p><p>进一步：取 \( A \) 同上，令 \( B = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix} \)，\( C = \begin{pmatrix} 0 & 0 \\ 1 & 1 \end{pmatrix} \)，则 \( AB = AC = O \) 而 \( B \neq C \)，消去律不成立。</p><p><b>结论：</b>只有当 \( A \) 可逆时，才能由 \( AB = AC \) 得 \( B = C \)（两边左乘 \( A^{-1} \)），或由 \( AB = O \) 得 \( B = O \)。</p>`
          }
        ],
        pitfalls: [
          String.raw`矩阵乘法顺序不可交换：\( (AB)^{T} = B^{T}A^{T} \)、\( (AB)^{-1} = B^{-1}A^{-1} \) 都要颠倒顺序；\( (AB)^{k} = A^{k}B^{k} \) 只在 \( AB = BA \) 时成立。`,
          String.raw`由 \( AB = O \) 不能断言 \( A = O \) 或 \( B = O \)；由 \( AB = AC \) 不能消去 \( A \)（除非 \( A \) 可逆）。`,
          String.raw`把 \( |A+B| \) 与 \( |A|+|B| \) 混为一谈；把 \( |kA| \) 当成 \( k|A| \)（正确结论是 \( |kA| = k^{n}|A| \)）。`,
          String.raw`忽略可乘条件：\( AB \) 有意义要求 \( A \) 的列数等于 \( B \) 的行数，写答案时不能凭“感觉”交换顺序。`,
          String.raw`误以为 \( A^{2} = E \) 或 \( A^{2} = A \) 能推出 \( A = \pm E \) 或 \( A = O,E \)：矩阵没有除法，只能配方或两边同乘某矩阵再讨论。`
        ]
      },
      /* ================================================================
         2.2 逆矩阵与伴随矩阵
         ================================================================ */
      {
        id: 'ch2-s2',
        num: '2.2',
        title: '逆矩阵与伴随矩阵',
        lead: '大纲要求：理解逆矩阵的概念，掌握逆矩阵的性质以及矩阵可逆的充分必要条件，理解伴随矩阵的概念，会用伴随矩阵求逆矩阵。可逆性是方阵“能否被除”的分水岭，也是后续方程组、特征值、二次型问题的开关。',
        blocks: [
          { t: 'h3', idx: '①', text: '逆矩阵的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '逆矩阵', html: String.raw`<p class="tight">设 \( A \) 为 n 阶方阵，若存在 n 阶方阵 \( B \) 使得</p><div class="fml-row">\( AB = BA = E, \)</div><p class="tight">则称 \( A \) 是<b>可逆矩阵</b>，\( B \) 是 \( A \) 的<b>逆矩阵</b>，记作 \( A^{-1} \)。若 \( A \) 可逆，则逆矩阵<b>唯一</b>；且 \( \left(A^{-1}\right)^{-1} = A \)。</p><p class="tight">对 n 阶方阵而言，条件 \( AB = E \)（或 \( BA = E \)）单独一个即可推出 \( BA = E \)，即“一侧成立即两侧成立”。</p>` },
          { t: 'h3', idx: '②', text: '矩阵可逆的充分必要条件' },
          { t: 'card', kind: 'thm', tag: '定理', title: '可逆的判定（核心定理）', html: String.raw`<p class="tight">n 阶方阵 \( A \) 可逆 \( \iff |A| \neq 0 \)；此时</p><div class="fml-row">\( A^{-1} = \dfrac{1}{|A|}A^{*}. \)</div><p class="tight">等价地，\( A \) 不可逆 \( \iff |A| = 0 \iff r(A) \lt n \)。</p>` },
          { t: 'table', head: ['等价刻画', '内容', '常用场景'], rows: [
            ['行列式', String.raw`\( |A| \neq 0 \)`, '数值矩阵、抽象矩阵的直接判定'],
            ['秩', String.raw`\( r(A) = n \)（满秩）`, '含参数矩阵、抽象矩阵'],
            ['向量组', String.raw`\( A \) 的 n 个行（列）向量线性无关`, '与第三章衔接'],
            ['齐次方程组', String.raw`\( Ax = 0 \) 只有零解`, '与第四章衔接'],
            ['非齐次方程组', String.raw`对任意 \( b \)，\( Ax = b \) 有唯一解`, '解的存在唯一性'],
            ['特征值', String.raw`\( A \) 的特征值全不为 0`, '与第五章衔接'],
            ['初等变换', String.raw`\( A \) 与 \( E \) 行等价，即 \( A \) 可表示为若干初等矩阵之积`, '提供求逆算法']
          ] },
          { t: 'h3', idx: '③', text: '逆矩阵的性质' },
          { t: 'card', kind: 'key', tag: '性质', title: '逆矩阵的运算规律', html: String.raw`<ul class="none"><li>\( (A^{-1})^{-1} = A \)；\( (A^{T})^{-1} = (A^{-1})^{T} \)。</li><li>\( (kA)^{-1} = \dfrac{1}{k}A^{-1} \)（要求 \( k \neq 0 \)）。</li><li>\( (AB)^{-1} = B^{-1}A^{-1} \)——顺序颠倒；可推广为 \( (A_1A_2\cdots A_s)^{-1} = A_s^{-1}\cdots A_2^{-1}A_1^{-1} \)。</li><li>\( |A^{-1}| = |A|^{-1} \)；\( |A^{*}| = |A|^{n-1} \)。</li><li>若 \( A \) 可逆，则 \( A^{T}A \)、\( AA^{T} \) 均可逆，且 \( AB = O \Rightarrow B = O \)。</li></ul>` },
          { t: 'h3', idx: '④', text: '伴随矩阵' },
          { t: 'card', kind: 'def', tag: '定义', title: '伴随矩阵 A*', html: String.raw`<p class="tight">设 \( A = (a_{ij})_{n\times n} \)，\( A_{ij} \) 为元素 \( a_{ij} \) 的<b>代数余子式</b>，则称</p><div class="fml-row">\( A^{*} = \begin{pmatrix} A_{11} & A_{21} & \cdots & A_{n1} \\ A_{12} & A_{22} & \cdots & A_{n2} \\ \vdots & \vdots & & \vdots \\ A_{1n} & A_{2n} & \cdots & A_{nn} \end{pmatrix} \)</div><p class="tight">为 \( A \) 的<b>伴随矩阵</b>。注意两个要点：① 元素是代数余子式（带符号）；② 排布时<b>转置</b>——第 i 行放原矩阵第 i 列的代数余子式。</p>` },
          { t: 'card', kind: 'key', tag: '核心恒等式', title: 'AA* = A*A = |A|E 与由此得到的公式', html: String.raw`<div class="fml-row">\( AA^{*} = A^{*}A = |A|E \)（对任意 n 阶方阵成立）；\( A \) 可逆时 \( A^{*} = |A|A^{-1},\quad A^{-1} = \dfrac{A^{*}}{|A|}. \)</div><ul class="none"><li>\( |A^{*}| = |A|^{n-1} \)；\( (A^{*})^{*} = |A|^{n-2}A \)（\( n \geq 2 \)）。</li><li>\( (kA)^{*} = k^{n-1}A^{*} \)；\( (AB)^{*} = B^{*}A^{*} \)；\( (A^{T})^{*} = (A^{*})^{T} \)。</li><li>\( A^{*} \) 可逆 \( \iff A \) 可逆，且 \( (A^{-1})^{*} = (A^{*})^{-1} \)。</li></ul>` },
          { t: 'table', head: ['A 的秩', 'A* 的秩', '理由'], rows: [
            [String.raw`\( r(A) = n \)`, String.raw`\( r(A^{*}) = n \)`, String.raw`\( A \) 可逆，由 \( A^{*} = |A|A^{-1} \) 可逆`],
            [String.raw`\( r(A) = n-1 \)`, String.raw`\( r(A^{*}) = 1 \)`, String.raw`至少有一个 \( n-1 \) 阶子式非零，而 \( A^{*}A = O \) 使 \( A^{*} \) 的每列都是 \( Ax = 0 \) 的解`],
            [String.raw`\( r(A) \le n-2 \)`, String.raw`\( r(A^{*}) = 0 \)`, '所有 \( n-1 \) 阶子式全为 0，故 \( A^{*} = O \)']
          ] },
          { t: 'h3', idx: '⑤', text: '求逆矩阵的两条路线' },
          { t: 'list', ordered: true, items: [
            String.raw`<b>伴随法：</b>先求 \( |A| \)（必须非零），再逐个算出 \( A_{ij} \)，按转置排成 \( A^{*} \)，最后 \( A^{-1} = A^{*}/|A| \)。二阶矩阵有口诀：<b>主对角线对调，副对角线变号，再除以行列式</b>，即 \( \begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \dfrac{1}{ad-bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix} \)。`,
            String.raw`<b>初等行变换法：</b>把 \( A \) 与 \( E \) 拼成 \( (A \mid E) \)，只用初等行变换把左半部化为 \( E \)，此时右半部就是 \( A^{-1} \)：\( (A \mid E) \xrightarrow{\ \text{行变换}\ } (E \mid A^{-1}) \)。`,
            String.raw`<b>抽象矩阵：</b>由已知等式（如 \( A^{2}-3A+2E = O \)）<b>配凑出</b>形如 \( A\cdot B = E \) 的因式分解，即可断言可逆并读出 \( A^{-1} = B \)。`
          ] },
          { t: 'viz', build: 'matrixOps', title: '伴随矩阵与逆矩阵的关系', sub: '观察 AA* 的对角线元与非对角线元的来源' },
          { t: 'viz', build: 'gaussJordan', title: '(A | E) 行变换求逆', sub: '对增广矩阵做行变换，实时观察左半部化为单位矩阵的过程' },
          { t: 'card', kind: 'exam', tag: '考法', title: '本节的典型设问', html: String.raw`<p class="tight">① 数值矩阵求逆（填空题，2 阶或 3 阶）；② 由 \( A^{2}+aA+bE = O \) 证明 \( A \)、\( A+kE \) 可逆并求逆；③ 用 \( AA^{*} = |A|E \) 求 \( |A^{*}| \)、\( |(A^{*})^{*}| \) 或反求 \( A \)；④ 由 \( AB = O \)、\( A \) 可逆推出 \( B = O \)；⑤ 讨论伴随矩阵的秩。</p>` }
        ],
        examples: [
          {
            no: '例 2.5',
            meta: '基础 · 初等行变换求逆',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 2 & 3 \\ 2 & 2 & 1 \\ 3 & 4 & 3 \end{pmatrix} \)，判断 \( A \) 是否可逆，若可逆求 \( A^{-1} \)。`,
            sol: String.raw`<p>先算行列式：\( |A| = 1\times(6-4) - 2\times(6-3) + 3\times(8-6) = 2 - 6 + 6 = 2 \neq 0 \)，故 \( A \) 可逆。</p><p>作增广矩阵 \( (A \mid E) \) 并只用初等行变换：</p><div class="fml"><div class="fml-row">\( (A \mid E) = \begin{pmatrix} 1 & 2 & 3 & 1 & 0 & 0 \\ 2 & 2 & 1 & 0 & 1 & 0 \\ 3 & 4 & 3 & 0 & 0 & 1 \end{pmatrix} \xrightarrow{\ r_2-2r_1,\ r_3-3r_1\ } \begin{pmatrix} 1 & 2 & 3 & 1 & 0 & 0 \\ 0 & -2 & -5 & -2 & 1 & 0 \\ 0 & -2 & -6 & -3 & 0 & 1 \end{pmatrix} \)</div><div class="fml-row">\( \xrightarrow{\ r_3-r_2\ } \begin{pmatrix} 1 & 2 & 3 & 1 & 0 & 0 \\ 0 & -2 & -5 & -2 & 1 & 0 \\ 0 & 0 & -1 & -1 & -1 & 1 \end{pmatrix} \xrightarrow{\ \text{回代化简}\ } \begin{pmatrix} 1 & 0 & 0 & 1 & 3 & -2 \\ 0 & 1 & 0 & -\frac{3}{2} & -3 & \frac{5}{2} \\ 0 & 0 & 1 & 1 & 1 & -1 \end{pmatrix}. \)</div></div><p>所以</p><div class="fml"><div class="fml-row">\( A^{-1} = \begin{pmatrix} 1 & 3 & -2 \\ -\frac{3}{2} & -3 & \frac{5}{2} \\ 1 & 1 & -1 \end{pmatrix}. \)</div></div><p><b>验证：</b>\( AA^{-1} \) 的第 1 行第 1 列元素为 \( 1\times1+2\times(-\frac{3}{2})+3\times1 = 1 \)；第 1 行第 2 列元素为 \( 1\times3+2\times(-3)+3\times1 = 0 \)，与 \( E \) 相符。</p>`
          },
          {
            no: '例 2.6',
            meta: '提高 · 抽象矩阵求逆（配凑因式）',
            q: String.raw`设 n 阶方阵 \( A \) 满足 \( A^{2} - 3A + 2E = O \)。证明 \( A \) 可逆，并求 \( A^{-1} \)。`,
            sol: String.raw`<p>把等式中的 \( A^{2}-3A \) 分解出因子 \( A \)：</p><div class="fml"><div class="fml-row">\( A^{2}-3A+2E = O \Longrightarrow A(A-3E) = -2E \Longrightarrow A\cdot\left[-\frac{1}{2}(A-3E)\right] = E. \)</div></div><p>由定义即知 \( A \) 可逆，且</p><div class="fml"><div class="fml-row">\( \mathbf{A^{-1} = -\frac{1}{2}(A-3E) = \frac{3E-A}{2}}. \)</div></div><p><b>点评：</b>抽象矩阵求逆的标准动作是“把已知等式整理成 \( A\cdot(\text{某矩阵}) = kE \)”，再把系数归一。若题目改为求 \( A+E \) 的逆，常用手段是把等式写成 \( (A+E)(A-4E) = kE \) 之类的形式（可通过待定因式或长除法配凑）。</p>`
          },
          {
            no: '例 2.7',
            meta: '提高 · 伴随矩阵公式',
            q: String.raw`设 \( A \) 为 3 阶矩阵，\( |A| = 2 \)。求 ① \( |A^{*}| \)；② \( |(A^{*})^{*}| \)；③ 若 \( r(A) = 1 \)，求 \( r(A^{*}) \) 与 \( |A^{*}| \)。`,
            sol: String.raw`<p>① 由 \( AA^{*} = |A|E \) 两边取行列式：\( |A|\cdot|A^{*}| = \left||A|E\right| = |A|^{3} \)，故</p><div class="fml"><div class="fml-row">\( |A^{*}| = |A|^{n-1} = |A|^{2} = 2^{2} = \mathbf{4}. \)</div></div><p>② 由公式 \( (A^{*})^{*} = |A|^{n-2}A = |A|A = 2A \)，再取行列式：</p><div class="fml"><div class="fml-row">\( |(A^{*})^{*}| = |2A| = 2^{3}|A| = 8\times2 = \mathbf{16}. \)</div></div><p>③ 由 \( r(A) = 1 = n-2 \)，得 \( r(A^{*}) = \mathbf{0} \)，即 \( A^{*} = O \)，于是 \( |A^{*}| = \mathbf{0} \)。这与 \( r(A^{*}) \le 1 \) 时 \( A^{*} \) 的行列式必为 0 一致。</p><p><b>点评：</b>“\( r(A) = n-1 \Rightarrow r(A^{*}) = 1 \)；\( r(A) \le n-2 \Rightarrow A^{*} = O \)”是选择题高频结论，其根据是 \( A^{*}A = |A|E = O \) 说明 \( A^{*} \) 的每一列都是 \( Ax = 0 \) 的解，再由 \( Ax = 0 \) 解空间维数 \( n - r(A) \) 控制 \( r(A^{*}) \)。</p>`
          }
        ],
        pitfalls: [
          String.raw`伴随矩阵的定义里最易漏掉“转置”：\( A^{*} \) 的第 i 行是 \( A \) 的第 i 列元素的代数余子式，即 \( A^{*} = (A_{ji})_{n\times n} \)。`,
          String.raw`只有 \( A \) 可逆时才有 \( A^{*} = |A|A^{-1} \) 与 \( A^{-1} = A^{*}/|A| \)；但 \( AA^{*} = A^{*}A = |A|E \) 对<b>任意</b> n 阶方阵成立，可用于 \( |A| = 0 \) 的讨论。`,
          String.raw`逆矩阵运算的顺序：\( (AB)^{-1} = B^{-1}A^{-1} \)，不能写成 \( A^{-1}B^{-1} \)；同理 \( (AB)^{T} = B^{T}A^{T} \)。`,
          String.raw`可逆的判定只适用于<b>方阵</b>：非方阵不谈逆矩阵；\( |A| \neq 0 \) 与 \( r(A) = n \) 是同一件事的两种说法。`,
          String.raw`数字陷阱：\( |A^{*}| = |A|^{n-1} \) 中的指数是阶数减 1；\( |kA^{-1}| = k^{n}|A|^{-1} \)；\( (kA)^{-1} = \frac{1}{k}A^{-1} \) 要求 \( k \neq 0 \)。`
        ]
      },
      /* ================================================================
         2.3 初等变换与矩阵的秩
         ================================================================ */
      {
        id: 'ch2-s3',
        num: '2.3',
        title: '初等变换与矩阵的秩',
        lead: '大纲要求：理解矩阵初等变换的概念，了解初等矩阵的性质和矩阵等价的概念，理解矩阵的秩的概念，掌握用初等变换求矩阵的秩和逆矩阵的方法。秩是刻画“矩阵携带多少独立信息”的数字，初等变换则是把矩阵化繁为简的通用手术刀。',
        blocks: [
          { t: 'h3', idx: '①', text: '矩阵的初等变换' },
          { t: 'card', kind: 'def', tag: '定义', title: '三类初等行（列）变换', html: String.raw`<p class="tight">对矩阵的行（列）作如下三种变换，称为<b>初等行（列）变换</b>：</p><ul class="none"><li><b>对换：</b>交换两行（列），记 \( r_i \leftrightarrow r_j \)；</li><li><b>倍乘：</b>用非零数 \( k \) 乘某一行（列）的所有元素，记 \( r_i \times k \)（\( k \neq 0 \)）；</li><li><b>倍加：</b>把某一行（列）的 \( k \) 倍加到另一行（列）上，记 \( r_j + k\,r_i \)。</li></ul><p class="tight">行变换与列变换统称<b>初等变换</b>。求秩、解方程组时通常只用行变换（消元法），它保持行向量组的相互表示关系。</p>` },
          { t: 'card', kind: 'def', tag: '定义', title: '行阶梯形与行最简形', html: String.raw`<p class="tight"><b>行阶梯形：</b>每个非零行的第一个非零元素（主元）所在列，其下方全为 0；即非零行呈“台阶”状排列，且零行（若有）都在最下方。<b>行最简形：</b>在行阶梯形基础上，每个主元都是 1，且主元所在列的其余元素全为 0。行最简形是唯一的。</p>` },
          { t: 'h3', idx: '②', text: '初等矩阵' },
          { t: 'card', kind: 'def', tag: '定义', title: '初等矩阵', html: String.raw`<p class="tight">对单位矩阵 \( E \) 施行一次初等变换所得到的矩阵称为<b>初等矩阵</b>，分别记作</p><div class="fml-row">\( E(i,j) \)（对换 i, j 两行）、\( E(i(k)) \)（第 i 行乘 \( k \)，\( k \neq 0 \)）、\( E(i,j(k)) \)（第 j 行加第 i 行的 k 倍）。</div>` },
          { t: 'table', head: ['初等矩阵', '逆矩阵', '行列式'], rows: [
            [String.raw`\( E(i,j) \)`, String.raw`\( E(i,j)^{-1} = E(i,j) \)`, String.raw`\( |E(i,j)| = -1 \)`],
            [String.raw`\( E(i(k)) \)`, String.raw`\( E(i(k))^{-1} = E(i(1/k)) \)`, String.raw`\( |E(i(k))| = k \)`],
            [String.raw`\( E(i,j(k)) \)`, String.raw`\( E(i,j(k))^{-1} = E(i,j(-k)) \)`, String.raw`\( |E(i,j(k))| = 1 \)`]
          ] },
          { t: 'card', kind: 'key', tag: '左行右列', title: '初等矩阵与初等变换的对应', html: String.raw`<ul class="none"><li>用初等矩阵<b>左乘</b> \( A \)，相当于对 \( A \) 作一次同类型的<b>行变换</b>；</li><li>用初等矩阵<b>右乘</b> \( A \)，相当于对 \( A \) 作一次同类型的<b>列变换</b>。</li><li>初等矩阵都可逆，且逆矩阵仍是同类型的初等矩阵；任意可逆矩阵都可表示为有限个初等矩阵之积。</li></ul>` },
          { t: 'h3', idx: '③', text: '矩阵的等价' },
          { t: 'card', kind: 'def', tag: '定义', title: '矩阵等价与标准形', html: String.raw`<p class="tight">若存在可逆矩阵 \( P,Q \) 使 \( PAQ = B \)，则称 \( A \) 与 \( B \) <b>等价</b>，记作 \( A \cong B \)。等价关系满足反身、对称、传递。</p><p class="tight">等价的核心判定：<b>同型矩阵 \( A \cong B \iff r(A) = r(B) \)</b>。任一 \( m\times n \) 矩阵 \( A \) 都等价于唯一的标准形</p><div class="fml-row">\( \begin{pmatrix} E_r & O \\ O & O \end{pmatrix}_{m\times n},\qquad r = r(A). \)</div>` },
          { t: 'card', kind: 'warn', tag: '辨析', title: '等价、相似、合同不要混淆', html: String.raw`<p class="tight"><b>等价</b>（\( PAQ = B \)）只要求 \( P,Q \) 可逆，保持的是<b>秩</b>；<b>相似</b>（\( P^{-1}AP = B \)）保持的是特征值、行列式、迹；<b>合同</b>（\( C^{T}AC = B \)）保持的是二次型的正负惯性指数。三者条件与不变量各不相同，考试中常在选择题里互相干扰。</p>` },
          { t: 'h3', idx: '④', text: '矩阵的秩' },
          { t: 'card', kind: 'def', tag: '定义', title: '秩的定义（三种等价说法）', html: String.raw`<p class="tight">矩阵 \( A \) 中<b>非零子式的最高阶数</b>称为 \( A \) 的秩，记作 \( r(A) \)。等价地：</p><ul class="none"><li>\( r(A) = r \)：存在 \( r \) 阶子式不为 0，且所有 \( r+1 \) 阶子式（若存在）全为 0；</li><li>把 \( A \) 化为行阶梯形后，<b>非零行的行数</b>就是 \( r(A) \)；</li><li>\( r(A) \) 等于 \( A \) 的行向量组的秩，也等于列向量组的秩（第三章详述）。</li></ul>` },
          { t: 'table', head: ['性质', '结论'], rows: [
            ['取值范围', String.raw`\( 0 \le r(A) \le \min\{m,n\} \)；\( r(A) = 0 \iff A = O \)；\( r(A) = m \)（或 n）时称 \( A \) 为行（列）满秩`],
            ['转置不变', String.raw`\( r(A^{T}) = r(A) \)`],
            ['数乘不变', String.raw`\( r(kA) = r(A)\ (k \neq 0) \)`],
            ['和的秩', String.raw`\( r(A+B) \le r(A) + r(B) \)`],
            ['积的秩', String.raw`\( r(AB) \le \min\{r(A),\ r(B)\} \)`],
            ['可逆乘不变', String.raw`\( P,Q \) 可逆 \( \Rightarrow r(PAQ) = r(A) \)；特别 \( r(PA) = r(A) \)，\( r(AQ) = r(A) \)`],
            ['零积不等式', String.raw`\( A_{m\times n}B_{n\times s} = O \Rightarrow r(A) + r(B) \le n \)`],
            ['拼接与分块', String.raw`\( r(A,B) \le r(A) + r(B) \)；\( r\begin{pmatrix} A & O \\ O & B \end{pmatrix} = r(A) + r(B) \)；\( r\begin{pmatrix} A & C \\ O & B \end{pmatrix} \ge r(A) + r(B) \)`],
            ['实矩阵特例', String.raw`\( r(A^{T}A) = r(AA^{T}) = r(A) \)（\( A \) 为实矩阵）`]
          ] },
          { t: 'h3', idx: '⑤', text: '求秩的标准流程' },
          { t: 'list', ordered: true, items: [
            String.raw`选主元：取第一个非零元素（尽量取 1 或 −1），用倍加把它所在列下方元素全部化为 0。`,
            String.raw`递归处理：对剩余子块重复第一步，自上而下形成台阶。`,
            String.raw`必要时交换行或列（列交换不改变秩），保证主元列单调右移。`,
            String.raw`数非零行的行数即为 \( r(A) \)；若题目还要求极大无关组或通解，须继续化到行最简形，并全程只用行变换。`
          ] },
          { t: 'viz', build: 'gaussJordan', title: '行变换与阶梯形', sub: '逐步观察行阶梯形、行最简形的形成与秩的读数' },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 求数值矩阵的秩（填空）；② 含参数 \( \lambda \) 的矩阵讨论秩（分类讨论：满秩、降秩）；③ 由秩反求参数或证明可逆；④ 已知 \( AB = O \) 求 \( r(A)+r(B) \) 的上界；⑤ 判断两个矩阵是否等价（比秩）。</p>` }
        ],
        examples: [
          {
            no: '例 2.8',
            meta: '基础 · 用行变换求秩',
            q: String.raw`求矩阵 \( A = \begin{pmatrix} 2 & 1 & -1 & 1 \\ 3 & 2 & 1 & -2 \\ 1 & 1 & 3 & -3 \end{pmatrix} \) 的秩，并写出它的行阶梯形。`,
            sol: String.raw`<p>只用初等行变换。为便于计算，先把第 1、3 行对换（不改变秩）：</p><div class="fml"><div class="fml-row">\( A \xrightarrow{\ r_1 \leftrightarrow r_3\ } \begin{pmatrix} 1 & 1 & 3 & -3 \\ 3 & 2 & 1 & -2 \\ 2 & 1 & -1 & 1 \end{pmatrix} \xrightarrow{\ r_2-3r_1,\ r_3-2r_1\ } \begin{pmatrix} 1 & 1 & 3 & -3 \\ 0 & -1 & -8 & 7 \\ 0 & -1 & -7 & 7 \end{pmatrix} \)</div><div class="fml-row">\( \xrightarrow{\ r_3-r_2\ } \begin{pmatrix} 1 & 1 & 3 & -3 \\ 0 & -1 & -8 & 7 \\ 0 & 0 & 1 & 0 \end{pmatrix}. \)</div></div><p>最后一个矩阵已是行阶梯形，有三个非零行（主元分别在第 1、2、3 列），故</p><div class="fml"><div class="fml-row">\( \mathbf{r(A) = 3}. \)</div></div><p><b>点评：</b>求秩只需要化到行阶梯形，不必再化行最简形；但若要写“最大无关组”或“通解”，则必须继续化到行最简形，而全过程只能做行变换。</p>`
          },
          {
            no: '例 2.9',
            meta: '提高 · 含参数的秩',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & \lambda \end{pmatrix} \)，讨论 \( \lambda \) 取何值时 \( r(A) \lt 3 \)，并给出相应的秩。`,
            sol: String.raw`<p>先算行列式（3 阶方阵的秩由行列式是否为零决定）：</p><div class="fml"><div class="fml-row">\( |A| = 1\times(2\lambda-1) - 1\times(\lambda - 0) + 0 = \lambda - 1. \)</div></div><p><b>情形一：</b>\( \lambda \neq 1 \)。此时 \( |A| \neq 0 \)，\( A \) 满秩，\( r(A) = 3 \)。</p><p><b>情形二：</b>\( \lambda = 1 \)。此时</p><div class="fml"><div class="fml-row">\( A = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 1 \end{pmatrix} \xrightarrow{\ r_2-r_1\ } \begin{pmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 0 & 1 & 1 \end{pmatrix} \xrightarrow{\ r_3-r_2\ } \begin{pmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{pmatrix}, \)</div></div><p>非零行只有 2 行，故 \( r(A) = 2 \)。存在 2 阶非零子式（如左上角 \( \begin{vmatrix} 1 & 1 \\ 1 & 2 \end{vmatrix} = 1 \neq 0 \)）。</p><p><b>结论：</b>\( \lambda = 1 \) 时 \( r(A) = 2 \)；\( \lambda \neq 1 \) 时 \( r(A) = 3 \)。</p>`
          },
          {
            no: '例 2.10',
            meta: '提高 · 可逆变换不改变秩',
            q: String.raw`设 \( A \) 为 \( m\times n \) 矩阵，\( P \) 为 m 阶可逆矩阵，\( Q \) 为 n 阶可逆矩阵。证明 \( r(PAQ) = r(A) \)。`,
            sol: String.raw`<p><b>证法一（初等变换观点）：</b>可逆矩阵可表示为有限个初等矩阵的乘积，设 \( P = P_1P_2\cdots P_s \)，则 \( PA \) 相当于对 \( A \) 连续作 s 次初等行变换；同理 \( AQ \) 相当于连续的初等列变换。初等变换不改变矩阵的秩，故 \( r(PAQ) = r(A) \)。</p><p><b>证法二（秩不等式夹逼）：</b>由 \( r(XY) \le \min\{r(X),r(Y)\} \) 得</p><div class="fml"><div class="fml-row">\( r(PAQ) \le r(A). \)</div></div><p>又由 \( A = P^{-1}(PAQ)Q^{-1} \) 得 \( r(A) \le r(PAQ) \)，两式合起来即 \( r(PAQ) = r(A) \)。</p><p><b>推论：</b>\( r(PA) = r(A) \)、\( r(AQ) = r(A) \)；且 \( AB = O \) 时若 \( A \) 可逆则 \( B = O \)（把 \( B \) 的列视为 \( Ax = 0 \) 的解）。</p>`
          }
        ],
        pitfalls: [
          String.raw`左乘、右乘的方向不能记反：左乘初等矩阵对应行变换，右乘对应列变换。`,
          String.raw`求秩、求逆、解方程组、求极大无关组时混用行变换与列变换：求秩允许行、列变换混用；但解方程组与求极大无关组必须只用行变换，否则解集/主元列会改变。`,
          String.raw`把“等价”“相似”“合同”混为一谈：\( A \cong B \) 只要求同型同秩，而相似、合同都有额外要求。`,
          String.raw`忽略 \( E(i(k)) \) 中 \( k \neq 0 \) 的条件；忘记 \( E(i,j(k)) \) 的逆是 \( E(i,j(-k)) \) 而不是 \( E(i,j(k))^{-1} \) 形式上的“取倒数”。`,
          String.raw`秩不等式的方向：\( r(AB) \le \min\{r(A),r(B)\} \) 是“变小”，而 \( r(A+B) \le r(A)+r(B) \) 是“不超过和”，两式的来源不同，不能互推。`
        ]
      },
      /* ================================================================
         2.4 分块矩阵
         ================================================================ */
      {
        id: 'ch2-s4',
        num: '2.4',
        title: '分块矩阵',
        lead: '大纲要求：了解分块矩阵及其运算。分块的实质是把高阶矩阵“降维”成低阶矩阵来看，从而把大问题拆成若干可独立处理的小问题，也是证明秩不等式的重要工具。',
        blocks: [
          { t: 'h3', idx: '①', text: '分块矩阵的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '分块矩阵', html: String.raw`<p class="tight">用若干条横线与竖线把矩阵 \( A \) 分成若干小块，每一个小块称为 \( A \) 的<b>子块</b>，以子块为元素的矩阵称为<b>分块矩阵</b>。常见形式：按行分块、按列分块、\( 2\times 2 \) 分块、分块对角形、分块三角形。</p><p class="tight">分块是<b>手段</b>不是运算：分法可以任意，但要让运算方便或把特殊结构暴露出来。</p>` },
          { t: 'h3', idx: '②', text: '分块矩阵的运算' },
          { t: 'list', items: [
            String.raw`<b>加法：</b>要求两个矩阵同型且采用<b>相同的分法</b>，对应子块相加。`,
            String.raw`<b>数乘：</b>用数乘每一个子块。`,
            String.raw`<b>乘法：</b>把子块当作“数”按矩阵乘法规则相乘再相加，但要求<b>左矩阵列的分法与右矩阵行的分法一致</b>；相乘时子块作为矩阵，顺序不能交换。`,
            String.raw`<b>转置：</b>先按子块为单位整体转置，再把每个子块自身转置，即“<b>内转外加转</b>”。`
          ] },
          { t: 'card', kind: 'key', tag: '公式', title: '分块转置与乘法条件', html: String.raw`<p class="tight">设 \( A = \begin{pmatrix} A_{11} & A_{12} \\ A_{21} & A_{22} \end{pmatrix} \)，则</p><div class="fml-row">\( A^{T} = \begin{pmatrix} A_{11}^{T} & A_{21}^{T} \\ A_{12}^{T} & A_{22}^{T} \end{pmatrix}. \)</div><p class="tight">即子块位置转置，同时每个子块再取转置，两个动作缺一不可。</p>` },
          { t: 'h3', idx: '③', text: '分块对角矩阵与分块三角矩阵' },
          { t: 'card', kind: 'key', tag: '核心', title: '四大常用结论', html: String.raw`<ul class="none"><li><b>行列式：</b>\( \begin{vmatrix} A & O \\ O & B \end{vmatrix} = |A||B| \)，\( \begin{vmatrix} A & C \\ O & B \end{vmatrix} = |A||B| \)；\( \begin{vmatrix} O & A \\ B & O \end{vmatrix} = (-1)^{mn}|A||B| \)（\( A \) 为 m 阶、\( B \) 为 n 阶）。</li><li><b>逆矩阵：</b>\( \begin{pmatrix} A & O \\ O & B \end{pmatrix}^{-1} = \begin{pmatrix} A^{-1} & O \\ O & B^{-1} \end{pmatrix} \)（要求 \( A,B \) 均可逆）。</li><li><b>分块三角求逆：</b>\( \begin{pmatrix} A & C \\ O & B \end{pmatrix}^{-1} = \begin{pmatrix} A^{-1} & -A^{-1}CB^{-1} \\ O & B^{-1} \end{pmatrix} \)，\( \begin{pmatrix} A & O \\ C & B \end{pmatrix}^{-1} = \begin{pmatrix} A^{-1} & O \\ -B^{-1}CA^{-1} & B^{-1} \end{pmatrix} \)。</li><li><b>幂与秩：</b>\( \begin{pmatrix} A & O \\ O & B \end{pmatrix}^{k} = \begin{pmatrix} A^{k} & O \\ O & B^{k} \end{pmatrix} \)；\( r\begin{pmatrix} A & O \\ O & B \end{pmatrix} = r(A) + r(B) \)。</li></ul>` },
          { t: 'h3', idx: '④', text: '分块技巧在秩不等式中的应用' },
          { t: 'card', kind: 'tip', tag: '技巧', title: '三类常用手法', html: String.raw`<ul class="none"><li><b>列向量观点：</b>\( AB = O \) 时 \( B \) 的每一列都是 \( Ax = 0 \) 的解，于是 \( r(B) \le n - r(A) \)，即 \( r(A)+r(B) \le n \)。</li><li><b>可逆分块消元：</b>用形如 \( \begin{pmatrix} E & -A^{-1}C \\ O & E \end{pmatrix} \) 的可逆矩阵左乘分块矩阵，可在不改变秩的前提下把块消成零（相当于“分块版的初等行变换”）。</li><li><b>夹逼不等式：</b>由 \( r(AB) \le \min\{r(A),r(B)\} \) 与 \( A = P^{-1}(PAQ)Q^{-1} \) 互推，证明秩相等。</li></ul>` },
          { t: 'viz', build: 'blockMatrix', title: '分块矩阵的乘法与求逆', sub: '逐步观看 2×2 分块乘法 Cᵢⱼ = Aᵢ₁B₁ⱼ + Aᵢ₂B₂ⱼ，以及分块三角矩阵 A = [[P, Q], [O, S]] 的逆的逐块组装' },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 计算分块对角（三角）矩阵的逆与幂；② 用拉普拉斯展开计算特殊分块行列式；③ 证明 \( AB = O \Rightarrow r(A)+r(B) \le n \)；④ 判断分块矩阵的可逆性（各块行列式之积是否为零）。</p>` }
        ],
        examples: [
          {
            no: '例 2.11',
            meta: '基础 · 分块对角的逆与幂',
            q: String.raw`设 \( A = \begin{pmatrix} 1 & 1 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 3 \end{pmatrix} \)，求 \( A^{n} \) 与 \( A^{-1} \)。`,
            sol: String.raw`<p>把 \( A \) 按 \( 2+2 \) 分块：\( A = \begin{pmatrix} B & O \\ O & \Lambda \end{pmatrix} \)，其中 \( B = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \)，\( \Lambda = \begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix} \)。</p><p>对分块对角矩阵，幂与逆都按块处理：</p><div class="fml"><div class="fml-row">\( B^{n} = \begin{pmatrix} 1 & n \\ 0 & 1 \end{pmatrix},\qquad \Lambda^{n} = \begin{pmatrix} 2^{n} & 0 \\ 0 & 3^{n} \end{pmatrix}. \)</div></div><p>故</p><div class="fml"><div class="fml-row">\( A^{n} = \begin{pmatrix} 1 & n & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 2^{n} & 0 \\ 0 & 0 & 0 & 3^{n} \end{pmatrix},\qquad A^{-1} = \begin{pmatrix} B^{-1} & O \\ O & \Lambda^{-1} \end{pmatrix} = \begin{pmatrix} 1 & -1 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & \frac{1}{2} & 0 \\ 0 & 0 & 0 & \frac{1}{3} \end{pmatrix}. \)</div></div><p><b>点评：</b>分块对角的幂、逆、行列式、秩都可以“逐块计算”，这是把高阶问题拆小的典型操作。</p>`
          },
          {
            no: '例 2.12',
            meta: '提高 · 分块行列式',
            q: String.raw`计算 ① \( D_1 = \begin{vmatrix} 0 & 0 & 1 & 2 \\ 0 & 0 & 3 & 4 \\ 1 & 0 & 5 & 6 \\ 0 & 1 & 7 & 8 \end{vmatrix} \)；② \( D_2 = \begin{vmatrix} 1 & 2 & 5 & 6 \\ 3 & 4 & 7 & 8 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{vmatrix} \)。`,
            sol: String.raw`<p>记 \( A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \)（\( |A| = 4-6 = -2 \)），\( B = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \)（\( |B| = 1 \)）。</p><p>① \( D_1 \) 形如 \( \begin{pmatrix} O & A \\ B & C \end{pmatrix} \)（\( C = \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix} \) 不影响结果），由分块副三角公式（\( m = n = 2 \)）：</p><div class="fml"><div class="fml-row">\( D_1 = (-1)^{mn}|A||B| = (-1)^{4}\times(-2)\times1 = \mathbf{-2}. \)</div></div><p>② \( D_2 \) 形如 \( \begin{pmatrix} A & C \\ O & B \end{pmatrix} \)，由分块上三角公式：</p><div class="fml"><div class="fml-row">\( D_2 = |A||B| = (-2)\times1 = \mathbf{-2}. \)</div></div><p><b>点评：</b>两个公式的记忆要点：常规的分块三角直接相乘；出现“左下或右上为零块并且另一对块交叉”时分块副三角要补 \( (-1)^{mn} \)，其中 \( m,n \) 是两块各自阶数。用初等变换（交换行、列各 m 次或 n 次）也能现场推出符号。</p>`
          },
          {
            no: '例 2.13',
            meta: '提高 · 秩不等式的证明',
            q: String.raw`设 \( A \) 为 \( m\times n \) 矩阵，\( B \) 为 \( n\times s \) 矩阵，且 \( AB = O \)。证明 \( r(A) + r(B) \le n \)。`,
            sol: String.raw`<p>把 \( B \) 按列分块：\( B = (\beta_1,\beta_2,\cdots,\beta_s) \)，其中 \( \beta_j \) 是 n 维列向量。</p><p>由 \( AB = O \) 得 \( A\beta_j = 0 \)，即 \( \beta_j \) 是齐次线性方程组 \( Ax = 0 \) 的解（\( j = 1,2,\cdots,s \)）。</p><p>由第四章结论，\( Ax = 0 \) 的解空间维数为 \( n - r(A) \)，所以 \( B \) 的每一列都落在维数不超过 \( n - r(A) \) 的子空间中，于是</p><div class="fml"><div class="fml-row">\( r(B) \le n - r(A),\qquad \text{即}\quad \mathbf{r(A) + r(B) \le n}. \)</div></div><p><b>另一证法（分块初等变换）：</b>对分块矩阵 \( \begin{pmatrix} E_n & B \\ A & O \end{pmatrix} \) 作行变换 \( r_2 - Ar_1 \)，得 \( \begin{pmatrix} E_n & B \\ O & -AB \end{pmatrix} = \begin{pmatrix} E_n & B \\ O & O \end{pmatrix} \)，秩为 n；而分块 \( \begin{pmatrix} E_n & B \\ A & O \end{pmatrix} \) 的秩不小于 \( r(E_n) + r(O) \) 之外的块信息，结合消元前后秩不变可推出同一结论。</p><p><b>应用：</b>若 \( A \) 为 n 阶矩阵且 \( A^{2} = A \)，则 \( A(E-A) = O \)，于是 \( r(A)+r(E-A) \le n \)；又 \( A + (E-A) = E \) 保证 \( r(A)+r(E-A) \ge r(E) = n \)，故 \( r(A)+r(E-A) = n \)。</p>`
          }
        ],
        pitfalls: [
          String.raw`分块乘法有“相容”条件：左矩阵按列的分法必须与右矩阵按行的分法一致，否则各子块不能相乘。`,
          String.raw`分块转置要同时做两件事：子块位置整体转置 + 每个子块自身转置，只做一半是常见错误。`,
          String.raw`分块对角矩阵可逆要求<b>每个对角块都可逆</b>；只要有一块不可逆，整体就不可逆。`,
          String.raw`分块三角矩阵求逆公式中副块的符号与顺序容易记错：\( \begin{pmatrix} A & C \\ O & B \end{pmatrix}^{-1} \) 的右上块是 \( -A^{-1}CB^{-1} \)（先左乘 \( A^{-1} \) 再右乘 \( B^{-1} \)），不是 \( -C A^{-1}B^{-1} \)。`,
          String.raw`分块只是组织运算的方式，块与块之间仍是矩阵乘法，顺序不可交换；分块后不能把子块当作普通的数来“约分”。`
        ]
      }
    ]
  };
})(window);
