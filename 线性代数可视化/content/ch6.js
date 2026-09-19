/* ============================================================
   ch6.js — 第六章 二次型
   考研数学（一）· 线性代数 · 可视化学习内容数据
   约定：块对象由 assets/js/app.js 的 renderBlock 渲染；
         公式用 \( \)（行内）与 \[ \]（行间）；
         viz 的 build 字段取自 window.WIDGETS 中已注册的组件名。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH6 = {
    id: 'ch6',
    no: '六',
    title: '二次型',
    subtitle: '二次型是实对称矩阵的另一种面孔：合同变换化简、惯性指数刻画形状、正定性判定符号',
    tags: ['二次型', '对称矩阵', '合同', '惯性定理', '标准形', '规范形', '配方法', '正定'],
    sections: [

      /* ================================================================
         6.1 二次型与矩阵表示
         ================================================================ */
      {
        id: 'ch6-s1',
        num: '6.1',
        title: '二次型与矩阵表示',
        lead: '大纲要求：掌握二次型及其矩阵表示，了解二次型秩的概念，了解合同变换与合同矩阵的概念。本节的中心是把“二次齐次多项式”改写为 \( x^{T}Ax \)，从而把二次型问题转化为对称矩阵问题。',
        blocks: [
          { t: 'h3', idx: '①', text: '二次型及其矩阵表示' },
          { t: 'card', kind: 'def', tag: '定义', title: '二次型', html: String.raw`<p class="tight">含有 n 个变量 \( x_1,\cdots,x_n \) 的二次齐次多项式</p><div class="fml-row">\( f(x_1,\cdots,x_n) = \sum_{i=1}^{n}\sum_{j=1}^{n} a_{ij}x_ix_j\qquad (a_{ij} = a_{ji}) \)</div><p class="tight">称为 <b>n 元二次型</b>。令 \( x = (x_1,\cdots,x_n)^{T} \)，\( A = (a_{ij})_{n\times n} \)（<b>对称矩阵</b>），则</p><div class="fml-row">\( f(x) = x^{T}Ax. \)</div><p class="tight">\( A \) 称为二次型 \( f \) 的<b>矩阵</b>，\( A \) 的秩称为<b>二次型的秩</b>，记作 \( r(f) = r(A) \)。二次型与对称矩阵一一对应。</p>` },
          { t: 'card', kind: 'key', tag: '关键', title: '如何写出二次型的矩阵', html: String.raw`<ul class="none"><li><b>平方项：</b>\( x_i^{2} \) 的系数直接放在主对角线上：\( a_{ii} \) 等于 \( x_i^{2} \) 的系数。</li><li><b>交叉项：</b>\( x_ix_j\ (i \neq j) \) 的系数<b>平分为两份</b>：\( a_{ij} = a_{ji} = \dfrac{\text{系数}}{2} \)。</li><li>矩阵必须<b>对称</b>；若写出的矩阵不对称，一定错在交叉项。</li><li>矩阵不唯一的前提是不要求对称——我们<b>总取对称矩阵</b>，此时表示唯一。</li></ul>` },
          { t: 'card', kind: 'exam', tag: '例示', title: '对照练习', html: String.raw`<p class="tight">二次型 \( f = 2x_1x_2 + x_3^{2} \) 的矩阵为 \( A = \begin{pmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{pmatrix} \)（注意 \( 2x_1x_2 \) 拆成 \( 1\cdot x_1x_2 + 1\cdot x_2x_1 \)）。<br>二次型 \( f = x_1^{2} + 4x_1x_2 - 6x_2x_3 \) 的矩阵为 \( A = \begin{pmatrix} 1 & 2 & 0 \\ 2 & 0 & -3 \\ 0 & -3 & 0 \end{pmatrix} \)。</p>` },
          { t: 'h3', idx: '②', text: '可逆线性变换与合同' },
          { t: 'card', kind: 'def', tag: '定义', title: '可逆线性变换与合同矩阵', html: String.raw`<p class="tight">称 \( x = Cy \)（\( C \) 为可逆矩阵）为<b>可逆线性变换</b>。把 \( f = x^{T}Ax \) 代入得</p><div class="fml-row">\( f = (Cy)^{T}A(Cy) = y^{T}\left(C^{T}AC\right)y = y^{T}By,\qquad B = C^{T}AC. \)</div><p class="tight">此时 \( B \) 仍是对称矩阵，且 \( r(B) = r(A) \)。若存在可逆矩阵 \( C \) 使 \( B = C^{T}AC \)，则称 \( A \) 与 \( B \) <b>合同</b>，记作 \( A \simeq B \)。</p>` },
          { t: 'card', kind: 'key', tag: '性质', title: '合同关系的性质', html: String.raw`<ul class="none"><li>反身性、对称性、传递性（与等价、相似一样是等价关系）。</li><li><b>保持对称性：</b>\( A \) 对称 \( \Rightarrow C^{T}AC \) 对称。</li><li><b>保持秩：</b>\( r(C^{T}AC) = r(A) \)（因为 \( C \) 可逆时左右乘可逆矩阵不改变秩）。</li><li><b>行列式同号：</b>\( |C^{T}AC| = |C|^{2}|A| \)，故 \( |A| \) 与 \( |B| \) 同号（同为正、同为负或同为零）。</li></ul>` },
          { t: 'table', head: ['关系', '定义', '保持的不变量'], rows: [
            [String.raw`等价 \( A \cong B \)`, String.raw`存在可逆 \( P,Q \) 使 \( PAQ = B \)`, '秩、同型'],
            [String.raw`相似 \( A \sim B \)`, String.raw`存在可逆 \( P \) 使 \( P^{-1}AP = B \)`, '特征值、行列式、迹、秩'],
            [String.raw`合同 \( A \simeq B \)`, String.raw`存在可逆 \( C \) 使 \( C^{T}AC = B \)`, '秩、对称性、惯性指数（正负特征值个数）']
          ] },
          { t: 'h3', idx: '③', text: '二次型的标准形与规范形' },
          { t: 'card', kind: 'def', tag: '定义', title: '标准形与规范形', html: String.raw`<p class="tight">只含平方项、不含交叉项的二次型</p><div class="fml-row">\( d_1y_1^{2} + d_2y_2^{2} + \cdots + d_ny_n^{2} \)</div><p class="tight">称为二次型的<b>标准形</b>（对应的矩阵是对角矩阵）。若标准形中的系数只能是 \( 1,-1,0 \)，则称为<b>规范形</b>。</p>` },
          { t: 'card', kind: 'thm', tag: '定理', title: '惯性定理', html: String.raw`<p class="tight">二次型的标准形中，<b>正平方项的个数 \( p \)、负平方项的个数 \( q \)</b> 由二次型本身唯一确定，与所用的可逆线性变换无关。于是规范形唯一（不计平方项的排列顺序）：</p><div class="fml-row">\( f \simeq \mathrm{diag}(\underbrace{1,\cdots,1}_{p},\underbrace{-1,\cdots,-1}_{q},\underbrace{0,\cdots,0}_{n-p-q}). \)</div><p class="tight">\( p \) 称<b>正惯性指数</b>，\( q \) 称<b>负惯性指数</b>，且 \( p + q = r(f) = r(A) \)。</p>` },
          { t: 'viz', build: 'quadraticForm', title: '二次型的几何形状', sub: '改变矩阵参数，观察等高线在椭圆、双曲线、抛物型之间的切换' },
          { t: 'viz', build: 'quadricClassify', title: '二次型的分类：椭圆 / 双曲 / 抛物型', sub: '由特征值的符号判定类型：λ₁λ₂ > 0 椭圆型、λ₁λ₂ < 0 双曲型、出现零特征值则退化为抛物型' },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 写出二次型的矩阵并求秩；② 用可逆变换 \( x = Cy \) 求新二次型的矩阵（\( C^{T}AC \)）；③ 由标准形/规范形反求惯性指数或参数；④ 判断两个二次型是否合同（比较正负惯性指数）。</p>` }
        ],
        examples: [
          {
            no: '例 6.1',
            meta: '基础 · 写矩阵并求秩',
            q: String.raw`写出二次型 \( f(x_1,x_2,x_3) = 2x_1^{2} + 5x_2^{2} + 5x_3^{2} + 4x_1x_2 - 4x_1x_3 - 8x_2x_3 \) 的矩阵 \( A \)，并求二次型的秩。`,
            sol: String.raw`<p>按“平方项进对角线、交叉项系数平分”的规则：</p><ul class="none"><li>主对角线：\( a_{11} = 2,\ a_{22} = 5,\ a_{33} = 5 \)；</li><li>交叉项：\( a_{12} = a_{21} = 4/2 = 2 \)，\( a_{13} = a_{31} = -4/2 = -2 \)，\( a_{23} = a_{32} = -8/2 = -4 \)。</li></ul><div class="fml"><div class="fml-row">\( A = \begin{pmatrix} 2 & 2 & -2 \\ 2 & 5 & -4 \\ -2 & -4 & 5 \end{pmatrix}. \)</div></div><p><b>求秩：</b></p><div class="fml"><div class="fml-row">\( |A| = 2\times(25-16) - 2\times(10-8) + (-2)\times(-8+10) = 18 - 4 - 4 = 10 \neq 0, \)</div></div><p>故 \( A \) 满秩，二次型的秩</p><div class="fml"><div class="fml-row">\( \mathbf{r(f) = r(A) = 3}. \)</div></div><p><b>核验：</b>把矩阵展开一遍——\( x^{T}Ax = 2x_1^{2} + 5x_2^{2} + 5x_3^{2} + 2\times2x_1x_2 + 2\times(-2)x_1x_3 + 2\times(-4)x_2x_3 \)，恰好还原题给二次型 ✓。（这个矩阵在 5.3 节出现过，其特征值为 \( 1,1,10 \)。）</p>`
          },
          {
            no: '例 6.2',
            meta: '提高 · 可逆变换下的合同',
            q: String.raw`设二次型 \( f(x_1,x_2) = 2x_1x_2 \)，作可逆线性变换 \( x_1 = y_1+y_2,\ x_2 = y_1-y_2 \)，求变换后的二次型，并写出变换矩阵 \( C \)，验证 \( B = C^{T}AC \)。`,
            sol: String.raw`<p><b>直接代入：</b></p><div class="fml"><div class="fml-row">\( f = 2(y_1+y_2)(y_1-y_2) = 2(y_1^{2}-y_2^{2}) = 2y_1^{2}-2y_2^{2}. \)</div></div><p><b>矩阵方法核验：</b>原二次型的矩阵为 \( A = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix} \)（注意 \( 2x_1x_2 \) 对应的矩阵元素是 1）。变换矩阵</p><div class="fml"><div class="fml-row">\( C = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix},\qquad |C| = -2 \neq 0. \)</div></div><p>于是</p><div class="fml"><div class="fml-row">\( C^{T}AC = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}\begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix} = \begin{pmatrix} 2 & 0 \\ 0 & -2 \end{pmatrix}, \)</div></div><p>与直接代入的结果 \( 2y_1^{2}-2y_2^{2} \) 一致 ✓。</p><p><b>点评：</b>该例说明<br>① 合同变换可以把交叉项消掉；<br>② 标准形不唯一（同一个二次型可对应多种标准形），但<b>正负项的个数（惯性指数）唯一</b>：本题 \( p = 1,\ q = 1 \)，规范形为 \( z_1^{2}-z_2^{2} \)；<br>③ 判断两个二次型是否合同，只需比较 \( (p,q) \)。</p>`
          }
        ],
        pitfalls: [
          String.raw`交叉项系数忘记除以 2：\( x_ix_j \) 的系数应平分给 \( a_{ij} \) 与 \( a_{ji} \)，矩阵必须对称。`,
          String.raw`二次型的矩阵默认取对称矩阵；若题目不给对称条件，矩阵不唯一，但只有对称的那个才是标准答案。`,
          String.raw`可逆线性变换必须保证 \( C \) 可逆（\( |C| \neq 0 \)）；用不可逆变换“化简”会改变二次型的秩与惯性指数。`,
          String.raw`合同与相似、等价不能混淆：合同保持惯性指数（正负特征值个数），相似保持特征值本身，等价只保持秩。`
        ]
      },

      /* ================================================================
         6.2 标准形与规范形
         ================================================================ */
      {
        id: 'ch6-s2',
        num: '6.2',
        title: '标准形与规范形',
        lead: '大纲要求：掌握用正交变换化二次型为标准形的方法，会用配方法化二次型为标准形；了解标准形、规范形的概念以及惯性定理。化简的两条路线——正交变换法与配方法——各有适用场景。',
        blocks: [
          { t: 'h3', idx: '①', text: '正交变换法（特征值法）' },
          { t: 'list', ordered: true, items: [
            String.raw`写出二次型的矩阵 \( A \)（对称）。`,
            String.raw`求 \( A \) 的全部特征值 \( \lambda_1,\cdots,\lambda_n \) 与相应的线性无关特征向量。`,
            String.raw`若某特征值的重数大于 1，把该特征值的特征向量用施密特方法正交化；再把所有向量单位化。`,
            String.raw`以这些单位特征向量为列，构造正交矩阵 \( Q \)。`,
            String.raw`作正交变换 \( x = Qy \)，则 \( f = \lambda_1y_1^{2} + \lambda_2y_2^{2} + \cdots + \lambda_ny_n^{2} \)——<b>标准形的系数恰为特征值</b>（顺序与 Q 的列对应）。`
          ] },
          { t: 'card', kind: 'key', tag: '要点', title: '正交变换法的三条特征', html: String.raw`<ul class="none"><li><b>系数即特征值：</b>无需另外计算，标准形可直接读出。</li><li><b>唯一性：</b>不计平方项的排列顺序，标准形唯一（因为特征值唯一）。</li><li><b>保形性：</b>正交变换保持向量的长度与内积，因而不改变几何图形的形状（只作旋转或反射），故又称“保形变换”。</li></ul>` },
          { t: 'viz', build: 'quadraticForm', title: '正交变换化标准形', sub: '观察主轴旋转后，等高线从斜置椭圆变为标准椭圆' },
          { t: 'h3', idx: '②', text: '配方法' },
          { t: 'list', ordered: true, items: [
            String.raw`<b>含平方项：</b>把含 \( x_1 \) 的全部项并入一个完全平方，即 \( f = a_1(x_1 + \cdots)^{2} + g(x_2,\cdots,x_n) \)，再对 \( g \) 重复此过程。`,
            String.raw`<b>不含任何平方项：</b>先用可逆变换“造”出平方项，如令 \( x_1 = y_1+y_2,\ x_2 = y_1-y_2 \)（此时 \( 2x_1x_2 = 2y_1^{2} - 2y_2^{2} \)），再按情形一配方。`,
            String.raw`<b>写回变换：</b>把每一步的换元累积，最终写成 \( x = Cz \)，并核验 \( C \) 可逆；此时 \( f = z^{T}(C^{T}AC)z \) 为标准形。`,
            String.raw`配方所得标准形的系数<b>一般不等于特征值</b>（但正负项个数与特征值的正负个数相同，即惯性指数一致）。`
          ] },
          { t: 'card', kind: 'thm', tag: '定理', title: '惯性定理（规范形唯一）', html: String.raw`<p class="tight">二次型的规范形中 \( 1 \) 的个数 \( p \)、\( -1 \) 的个数 \( q \) 由二次型唯一确定：</p><div class="fml-row">\( f \simeq \mathrm{diag}(\underbrace{1,\cdots,1}_{p},\underbrace{-1,\cdots,-1}_{q},\underbrace{0,\cdots,0}_{n-p-q}),\qquad p+q = r(A). \)</div><p class="tight">因此两个 n 元二次型<b>合同</b> \( \iff \) 它们的正、负惯性指数分别相等 \( \iff \) 它们的规范形相同。</p>` },
          { t: 'card', kind: 'key', tag: '求惯性指数', title: '两条捷径', html: String.raw`<ul class="none"><li><b>特征值法：</b>\( p \) = 正特征值的个数，\( q \) = 负特征值的个数（重数计入）。</li><li><b>配方法：</b>数出配方结果中正、负平方项的个数（配方不改变惯性指数）。</li><li>附加结论：\( |A| \) 的符号 = \( (-1)^{q} \) 乘上正数；若 \( |A| \lt 0 \)，则正负惯性指数不可能同奇偶（这条可用于快速排除选项）。</li></ul>` },
          { t: 'h3', idx: '③', text: '两种方法的对比' },
          { t: 'table', head: ['对比项', '正交变换法', '配方法'], rows: [
            ['变换矩阵', String.raw`正交矩阵 \( Q \)（\( Q^{T}Q = E \)）`, String.raw`可逆矩阵 \( C \)（一般不正交）`],
            ['标准形系数', '恰为特征值', '由配方决定，一般不是特征值'],
            ['标准形唯一性', '不计顺序时唯一', '不唯一（不同配方得到不同标准形）'],
            ['计算量', "需求特征值与特征向量（高阶时较大）", '逐步配方，计算量较小'],
            ['几何意义', '保持长度与形状（旋转、反射）', '可能发生拉伸变形'],
            ['适用场景', '需要特征值、正定性、惯性指数等结论', '只求标准形 / 规范形 / 惯性指数']
          ] },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 求正交变换化二次型为标准形（并写出 Q 与标准形）；② 用配方法化标准形并求所用的可逆变换；③ 求正、负惯性指数或规范形；④ 判断两个二次型是否合同、含参数求合同条件。</p>` }
        ],
        examples: [
          {
            no: '例 6.3',
            meta: '重点 · 正交变换化标准形',
            q: String.raw`用正交变换化二次型 \( f = 2x_1^{2} + 5x_2^{2} + 5x_3^{2} + 4x_1x_2 - 4x_1x_3 - 8x_2x_3 \) 为标准形，并写出所用的正交变换。`,
            sol: String.raw`<p><b>第一步：写出矩阵。</b>由例 6.1，\( A = \begin{pmatrix} 2 & 2 & -2 \\ 2 & 5 & -4 \\ -2 & -4 & 5 \end{pmatrix} \)。</p><p><b>第二步：求特征值。</b>（计算见 5.3 例 5.7）</p><div class="fml"><div class="fml-row">\( |\lambda E - A| = (\lambda-1)^{2}(\lambda-10),\qquad \lambda_1 = \lambda_2 = 1,\quad \lambda_3 = 10. \)</div></div><p><b>第三步：求正交矩阵 Q。</b>由 5.3 例 5.7 的正交化、单位化过程得</p><div class="fml"><div class="fml-row">\( Q = \begin{pmatrix} -\frac{2}{\sqrt{5}} & \frac{2}{3\sqrt{5}} & \frac{1}{3} \\[2pt] \frac{1}{\sqrt{5}} & \frac{4}{3\sqrt{5}} & \frac{2}{3} \\[2pt] 0 & \frac{5}{3\sqrt{5}} & -\frac{2}{3} \end{pmatrix},\qquad Q^{T}AQ = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 10 \end{pmatrix}. \)</div></div><p><b>第四步：写出结论。</b>作正交变换 \( x = Qy \)，则</p><div class="fml"><div class="fml-row">\( \mathbf{f = y_1^{2} + y_2^{2} + 10y_3^{2}}. \)</div></div><p><b>惯性指数：</b>\( p = 3,\ q = 0,\ r(f) = 3 \)，说明该二次型正定（见 6.3 节）；规范形为 \( z_1^{2}+z_2^{2}+z_3^{2} \)。</p><p><b>点评：</b>正交变换法的标准形系数就是特征值；重根对应的特征向量必须先在同一特征值内部正交化，再全部单位化。</p>`
          },
          {
            no: '例 6.4',
            meta: '重点 · 配方法化标准形',
            q: String.raw`用配方法化二次型 \( f = x_1x_2 + x_2x_3 + x_3x_1 \) 为标准形，并写出所用的可逆线性变换。`,
            sol: String.raw`<p><b>第一步：制造平方项。</b>原式没有任何平方项，先作变换</p><div class="fml"><div class="fml-row">\( x_1 = y_1+y_2,\qquad x_2 = y_1-y_2,\qquad x_3 = y_3 \)</div></div><p>（该变换可逆，逆变换为 \( y_1 = \frac{x_1+x_2}{2},\ y_2 = \frac{x_1-x_2}{2},\ y_3 = x_3 \)）。代入得</p><div class="fml"><div class="fml-row">\( f = (y_1+y_2)(y_1-y_2) + (y_1-y_2)y_3 + y_3(y_1+y_2) = y_1^{2} - y_2^{2} + 2y_1y_3. \)</div></div><p><b>第二步：对 \( y_1 \) 配方。</b></p><div class="fml"><div class="fml-row">\( f = \left(y_1^{2}+2y_1y_3\right) - y_2^{2} = (y_1+y_3)^{2} - y_3^{2} - y_2^{2}. \)</div></div><p><b>第三步：整理变换。</b>令 \( z_1 = y_1+y_3,\ z_2 = y_2,\ z_3 = y_3 \)，即 \( y_1 = z_1-z_3,\ y_2 = z_2,\ y_3 = z_3 \)。累加两次换元得</p><div class="fml"><div class="fml-row">\( \begin{cases} x_1 = z_1+z_2-z_3, \\ x_2 = z_1-z_2-z_3, \\ x_3 = z_3, \end{cases}\qquad C = \begin{pmatrix} 1 & 1 & -1 \\ 1 & -1 & -1 \\ 0 & 0 & 1 \end{pmatrix},\qquad |C| = -2 \neq 0. \)</div></div><p>于是</p><div class="fml"><div class="fml-row">\( \mathbf{f = z_1^{2} - z_2^{2} - z_3^{2}}. \)</div></div><p><b>核验：</b>取 \( z = (1,0,0) \)，则 \( x = (1,1,0) \)，\( f = 1\times1 + 0 + 0 = 1 = z_1^{2} \) ✓；取 \( z = (0,1,0) \)，则 \( x = (1,-1,0) \)，\( f = -1 = -z_2^{2} \) ✓；取 \( z = (0,0,1) \)，则 \( x = (-1,-1,1) \)，\( f = 1-1-1 = -1 = -z_3^{2} \) ✓。</p><p><b>惯性指数：</b>\( p = 1,\ q = 2 \)，与 \( A = \begin{pmatrix} 0 & \frac{1}{2} & \frac{1}{2} \\ \frac{1}{2} & 0 & \frac{1}{2} \\ \frac{1}{2} & \frac{1}{2} & 0 \end{pmatrix} \) 的特征值 \( 1,\ -\frac{1}{2},\ -\frac{1}{2} \) 的正负个数一致（1 正 2 负）✓。</p>`
          },
          {
            no: '例 6.5',
            meta: '提高 · 惯性指数与合同判定',
            q: String.raw`设二次型 \( f = x_1^{2} + 2x_1x_2 + x_2^{2} - x_3^{2} \)，求它的矩阵、正负惯性指数与规范形；并判断 \( f \) 与 \( g = 2y_1^{2} - 3y_2^{2} \) 所对应的矩阵是否合同。`,
            sol: String.raw`<p>配平方：\( f = (x_1+x_2)^{2} - x_3^{2} \)。作可逆变换</p><div class="fml"><div class="fml-row">\( z_1 = x_1+x_2,\quad z_2 = x_3,\quad z_3 = x_2 \)（\( z_3 \) 为补齐的变量，保证变换可逆），即 \( f = z_1^{2} - z_2^{2} + 0\cdot z_3^{2}. \)</div></div><p>于是正惯性指数 \( p = 1 \)，负惯性指数 \( q = 1 \)，秩 \( r(f) = 2 \)，规范形为</p><div class="fml"><div class="fml-row">\( \mathbf{z_1^{2} - z_2^{2}}\qquad (\text{第三个变量系数为 }0). \)</div></div><p>其矩阵为 \( A = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 1 & 0 \\ 0 & 0 & -1 \end{pmatrix} \)。</p><p>而 \( g \) 的矩阵 \( B = \mathrm{diag}(2,-3) \)，作为 3 元二次型可补零得 \( \mathrm{diag}(2,-3,0) \)，其 \( p = 1,\ q = 1 \)。</p><p>两个二次型的正、负惯性指数分别相同（\( p = 1,\ q = 1 \)），由惯性定理，它们的规范形都是 \( y_1^{2}-y_2^{2} \)，故<b>它们对应的矩阵合同</b>。</p><p><b>注意：</b>若题目问的是“矩阵 \( A \) 与 \( B \)”是否合同（\( A \) 为 3 阶、\( B \) 为 2 阶），则因不同型而不谈合同；通常题目会把两个二次型都视为同元数（缺失变量补零）再比较惯性指数。</p>`
          }
        ],
        pitfalls: [
          String.raw`把配方法得到的标准形系数当作特征值：两者一般不相等，只有“正负项的个数”（惯性指数）才一定相同。`,
          String.raw`配方法必须给出最终的可逆线性变换 \( x = Cz \) 并检验 \( |C| \neq 0 \)；忘记回代或漏写变换是常见失分点。`,
          String.raw`正交变换法中共有重根时，必须先在重根内部施密特正交化，再全部单位化；只正交化不单位化得到的不是正交矩阵。`,
          String.raw`标准形不唯一但规范形唯一：答题时若题目要求“规范形”，必须把系数化成 \( \pm1 \) 或 0；若要求“标准形”，系数可以是任意非零数。`,
          String.raw`判断合同只看惯性指数，不能只看秩：秩相等的两个二次型未必合同（如 \( y_1^{2}+y_2^{2} \) 与 \( y_1^{2}-y_2^{2} \) 秩都是 2 但不合同）。`
        ]
      },

      /* ================================================================
         6.3 正定二次型
         ================================================================ */
      {
        id: 'ch6-s3',
        num: '6.3',
        title: '正定二次型',
        lead: '大纲要求：理解正定二次型、正定矩阵的概念，并掌握其判别法。正定是二次型“恒取正值”的定性刻画，其判别法与二次型的秩、特征值、顺序主子式全面挂钩。',
        blocks: [
          { t: 'h3', idx: '①', text: '正定二次型与正定矩阵' },
          { t: 'card', kind: 'def', tag: '定义', title: '正定与半正定', html: String.raw`<p class="tight">设 \( f(x) = x^{T}Ax \) 为 n 元二次型（\( A \) 为实对称矩阵）。若对任意 \( x \neq 0 \) 都有</p><div class="fml-row">\( f(x) \gt 0, \)</div><p class="tight">则称 \( f \) 为<b>正定二次型</b>，并称 \( A \) 为<b>正定矩阵</b>。若对任意 x 都有 \( f(x) \geq 0 \)，且存在 \( x \neq 0 \) 使 \( f(x) = 0 \)，则称 \( f \) 为<b>半正定</b>。类似地可定义负定（\( f(x) \lt 0 \)）与不定。</p>` },
          { t: 'h3', idx: '②', text: '正定的充分必要条件' },
          { t: 'card', kind: 'thm', tag: '定理', title: '五个等价判据', html: String.raw`<p class="tight">设 \( A \) 为 n 阶实对称矩阵，则下列条件等价：</p><ul class="none"><li><b>特征值法：</b>\( A \) 的特征值全为正数；</li><li><b>惯性指数法：</b>正惯性指数 \( p = n \)（即规范形为 \( E \)）；</li><li><b>合同法：</b>\( A \) 与单位矩阵 \( E \) 合同，即存在可逆矩阵 \( C \) 使 \( A = C^{T}C \)；</li><li><b>主子式法（赫尔维茨定理）：</b>\( A \) 的各阶<b>顺序主子式</b>全为正：\( D_1 = a_{11} \gt 0,\ D_2 \gt 0,\ \cdots,\ D_n = |A| \gt 0 \)；</li><li><b>分解法：</b>存在可逆矩阵 \( C \) 使 \( A = C^{T}C \)（与第三条等价）。</li></ul>` },
          { t: 'table', head: ['判别法', '适用条件', '优点与局限'], rows: [
            ['顺序主子式全正', String.raw`任意实对称矩阵 \( A \)（低阶尤佳）`, '计算直接，是最常用的操作性判据'],
            ['特征值全正', '能求出（或已知）特征值', '概念清晰，与相似对角化衔接'],
            [String.raw`正惯性指数 \( p = n \)`, '需要标准形或规范形', '与配方法、正交变换法结合使用'],
            [String.raw`\( A = C^{T}C \)（\( C \) 可逆）`, '结构明显的矩阵（如 \( A^{T}A+E \)）', '适合证明题'],
            [String.raw`\( A \simeq E \)`, '已知合同关系', '理论判断，便于抽象推理']
          ] },
          { t: 'card', kind: 'key', tag: '必要性', title: '正定的必要条件（只能用来否定）', html: String.raw`<ul class="none"><li>主对角线元素全为正：\( a_{ii} \gt 0 \)；</li><li>行列式为正：\( |A| \gt 0 \)；</li><li>\( A \) 可逆，且 \( A^{-1} \)、\( A^{*} \)、\( A^{k} \) 都正定；</li><li>\( A \) 的任意 k 阶主子阵正定（特别地，各阶顺序主子式为正）。</li></ul><p class="tight">反过来：\( a_{ii} \gt 0 \) 与 \( |A| \gt 0 \) 同时成立<b>不能</b>保证正定（例如 \( A = \begin{pmatrix} 1 & 2 \\ 2 & 1 \end{pmatrix} \)：主对角元都正、\( |A| = -3 \lt 0 \)，不是正定；而 \( \begin{pmatrix} 1 & -3 \\ -3 & 10 \end{pmatrix} \) 主对角元正、\( |A| = 1 \gt 0 \) 且正定）。</p>` },
          { t: 'h3', idx: '③', text: '正定矩阵的性质' },
          { t: 'card', kind: 'key', tag: '性质', title: '常用结论', html: String.raw`<ul class="none"><li>若 \( A \) 正定、\( B \) 正定，则 \( A+B \) 正定（\( x^{T}(A+B)x = x^{T}Ax + x^{T}Bx \gt 0 \)）。</li><li>若 \( A \) 正定、\( k \gt 0 \)，则 \( kA \) 正定。</li><li>若 \( A \) 正定且 \( A \simeq B \)，则 \( B \) 正定（合同保持惯性指数）。</li><li>若 \( A \) 正定，\( A \) 可逆，则 \( A^{-1} \)、\( A^{*} \) 均正定。</li><li>若 \( A \) 正定、\( B \) 实对称且 \( AB \) 为对称矩阵，则 \( AB \) 正定 \( \iff B \) 正定。</li><li>若 \( A \) 正定，则 \( A \) 可分解为 \( A = R^{T}R \)（例如取 \( R \) 为 \( A \) 的 Cholesky 分解因子或 \( A^{1/2} \)）。</li></ul>` },
          { t: 'card', kind: 'warn', tag: '辨析', title: '三个易错点', html: String.raw`<ul class="none"><li>谈“正定”必须先有<b>对称</b>矩阵：非对称矩阵不定义正定性。</li><li>用顺序主子式判断“不正定”时，只要有一个顺序主子式 \( \leq 0 \) 即可否定；但判断“正定”必须<b>全部</b>顺序主子式都大于 0。</li><li>“所有主子式全为正”也是正定的充要条件，比“顺序主子式”更强；考试中判正定<b>只需</b>顺序主子式即可。</li></ul>` },
          { t: 'viz', build: 'positiveDefinite', title: '正定性的几何图像', sub: '正定时二次曲面为开口向上的椭圆抛物面；改参数即可观察不定与半正定的形状变化' },
          { t: 'viz', build: 'sylvesterCriterion', title: '顺序主子式判正定', sub: '逐步计算 D₁、D₂、D₃，用赫尔维茨定理核对：全部大于 0 ⇔ 正定；任有一阶 ≤ 0 即可否定' },
          { t: 'card', kind: 'exam', tag: '考法', title: '典型设问', html: String.raw`<p class="tight">① 判断二次型（含参数）是否正定并求参数范围（顺序主子式法最常用）；② 证明抽象矩阵正定（构造 \( x^{T}Ax \gt 0 \) 或 \( A = C^{T}C \)）；③ 由正定性推特征值、行列式、秩的性质；④ 与实对称矩阵的特征值理论综合考查。</p>` }
        ],
        examples: [
          {
            no: '例 6.6',
            meta: '基础 · 含参数的正定判定',
            q: String.raw`问 \( a \) 取何值时，二次型 \( f = x_1^{2} + 2x_2^{2} + ax_3^{2} + 2x_1x_2 + 2x_2x_3 \) 为正定二次型？`,
            sol: String.raw`<p><b>第一步：写矩阵。</b>平方项系数进对角线，交叉项平分：</p><div class="fml"><div class="fml-row">\( A = \begin{pmatrix} 1 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & a \end{pmatrix}. \)</div></div><p><b>第二步：算各阶顺序主子式。</b></p><div class="fml"><div class="fml-row">\( D_1 = 1 \gt 0,\qquad D_2 = \begin{vmatrix} 1 & 1 \\ 1 & 2 \end{vmatrix} = 2-1 = 1 \gt 0, \)</div><div class="fml-row">\( D_3 = |A| = 1\times(2a-1) - 1\times(a-0) + 0 = 2a-1-a = a-1. \)</div></div><p><b>第三步：令所有顺序主子式为正。</b>要求 \( D_3 = a-1 \gt 0 \)，即</p><div class="fml"><div class="fml-row">\( \mathbf{a \gt 1}. \)</div></div><p>故 \( a \gt 1 \) 时 \( f \) 正定；\( a \leq 1 \) 时 \( f \) 不正定（\( a = 1 \) 时 \( |A| = 0 \)，\( f \) 半正定；\( a \lt 1 \) 时 \( |A| \lt 0 \)，\( f \) 不定）。</p><p><b>点评：</b>顺序主子式法的流程是“低阶先判、逐阶向上”；若低阶已经失败（如 \( D_1 \leq 0 \) 或 \( D_2 \leq 0 \)），可以直接否定，无需算到最后。</p>`
          },
          {
            no: '例 6.7',
            meta: '提高 · 抽象正定的证明',
            q: String.raw`设 \( A \) 为 n 阶正定矩阵。证明 ① \( A^{-1} \) 正定；② \( A^{*} \) 正定。`,
            sol: String.raw`<p><b>① 证 \( A^{-1} \) 正定。</b></p><p>由 \( A^{T} = A \) 且 \( A \) 可逆，得 \( (A^{-1})^{T} = (A^{T})^{-1} = A^{-1} \)，故 \( A^{-1} \) 对称。</p><p>设 \( A \) 的正特征值为 \( \lambda_1,\cdots,\lambda_n \)，则 \( A^{-1} \) 的特征值为 \( 1/\lambda_1,\cdots,1/\lambda_n \)，全部为正，由特征值判别法知 \( A^{-1} \) 正定。</p><p><b>另证（二次型观点）：</b>对任意 \( x \neq 0 \)，令 \( y = A^{-1}x \neq 0 \)，则</p><div class="fml"><div class="fml-row">\( x^{T}A^{-1}x = (Ay)^{T}y = y^{T}A^{T}y = y^{T}Ay \gt 0, \)</div></div><p>故 \( A^{-1} \) 正定。</p><p><b>② 证 \( A^{*} \) 正定。</b></p><p>\( A^{*} = |A|A^{-1} \)。由正定性 \( |A| = \lambda_1\lambda_2\cdots\lambda_n \gt 0 \)，且 \( A^{*} \) 对称（\( A \) 对称时伴随矩阵也对称）。\( A^{*} \) 的特征值为</p><div class="fml"><div class="fml-row">\( \frac{|A|}{\lambda_i} = \lambda_1\cdots\lambda_{i-1}\lambda_{i+1}\cdots\lambda_n \gt 0 \)</div></div><p>（每个因子都为正），故 \( A^{*} \) 正定。</p><p><b>点评：</b>证明正定的两条主线：① 特征值全正；② 对任意 \( x \neq 0 \) 验证 \( x^{T}Ax \gt 0 \)。本题两条都用到了，可根据题目信息量灵活选择。</p>`
          },
          {
            no: '例 6.8',
            meta: '提高 · 半正定与特征值',
            q: String.raw`设 3 阶实对称矩阵 \( A \) 的特征值为 \( \lambda_1 = -1,\ \lambda_2 = 2,\ \lambda_3 = 3 \)。判断矩阵 \( B = A^{2}-2A \) 的正定性（或半正定性），并说明理由。`,
            sol: String.raw`<p>由 \( f(\lambda) = \lambda^{2}-2\lambda \)，多项式矩阵 \( f(A) = A^{2}-2A \) 仍是对称矩阵，其特征值为</p><div class="fml"><div class="fml-row">\( f(-1) = 1+2 = 3,\qquad f(2) = 4-4 = 0,\qquad f(3) = 9-6 = 3. \)</div></div><p>三个特征值为 \( 3,0,3 \)：<b>全部非负</b>，其中有一个为 0，因此 \( B \) <b>不是正定矩阵，而是半正定矩阵</b>（\( |B| = 3\times0\times3 = 0 \)，这也说明它不可逆，不可能是正定矩阵）。</p><p><b>补充：</b>事实上</p><div class="fml"><div class="fml-row">\( A^{2}-2A = (A-E)^{2}-E, \)</div></div><p>它不是正定；但 \( A^{2}+E \) 的特征值为 \( 2,5,10 \) 全为正，是正定矩阵。</p><p><b>点评：</b>“\( f(A) \) 的特征值是 \( f(\lambda) \)”这条性质是把正定性问题转化为数的问题的关键；判断正定要求<b>严格大于 0</b>，出现 0 只到半正定为止。</p>`
          }
        ],
        pitfalls: [
          String.raw`判正定必须验证<b>全部</b>顺序主子式大于零；只验证 \( D_1 \gt 0 \) 与 \( |A| \gt 0 \) 是不够的（这两个只是必要条件）。`,
          String.raw`“不正定”的快速否定方式：某阶顺序主子式 \( \leq 0 \)，或存在特征值 \( \leq 0 \)，或正惯性指数 \( \lt n \)。`,
          String.raw`特征值出现 0 时最多只能得到半正定，不能称为正定；同理 \( |A| = 0 \) 时一定不正定。`,
          String.raw`非对称矩阵不讨论正定性；题目给出二次型时务必先把矩阵写成对称形式。`,
          String.raw`正定的判定对象是“矩阵”，但问题的表述可能是“二次型正定”，两者是同一件事；要看清题目问的是参数范围、证明还是判断。`
        ]
      }
    ]
  };
})(window);
