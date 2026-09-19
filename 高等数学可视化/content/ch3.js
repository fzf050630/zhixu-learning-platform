/* ============================================================
   ch3.js — 第三章 一元函数积分学
   覆盖 2026 大纲「三、一元函数积分学」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH3 = {
    id: 'ch3', no: '三', title: '一元函数积分学',
    subtitle: '积分是微分的逆运算，也是“无限求和”的极限——定积分把面积、体积、功统一成黎曼和的极限。',
    tags: ['原函数', '不定积分', '基本积分公式', '定积分', '黎曼和', '中值定理', '变限积分', '牛顿-莱布尼茨', '换元积分', '分部积分', '有理函数积分', '反常积分', '面积', '弧长', '旋转体体积', '形心'],
    sections: [

      /* ---------------- 3.1 ---------------- */
      {
        id: 'ch3-s1', num: '3.1', title: '原函数与不定积分',
        lead: '大纲要求：理解原函数与不定积分的概念，掌握不定积分的基本性质与基本积分公式。',
        blocks: [
          { t: 'h3', idx: '①', text: '原函数的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '原函数', html:
            '<p class="tight">设函数 \\( f \\) 在区间 \\( I \\) 上有定义。若存在可导函数 \\( F \\)，使得对一切 \\( x\\in I \\) 有</p>' +
            '<div class="fml">\\( F^{\\prime}(x)=f(x) \\)</div>' +
            '<p class="tight">则称 \\( F(x) \\) 为 \\( f(x) \\) 在 \\( I \\) 上的一个<b>原函数</b>。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '原函数存在定理与结构', html:
            '<ul class="none">' +
            '<li><b>存在性：</b>若 \\( f \\) 在区间 \\( I \\) 上连续，则 \\( f \\) 在 \\( I \\) 上必有原函数；</li>' +
            '<li><b>不存在的判定：</b>若 \\( f \\) 在区间 \\( I \\) 上有第一类间断点（可去或跳跃），则 \\( f \\) 在 \\( I \\) 上无原函数（导函数不存在第一类间断点）；</li>' +
            '<li><b>结构：</b>若 \\( F \\) 是 \\( f \\) 的一个原函数，则 \\( f \\) 的全部原函数为 \\( F(x)+C \\)（\\( C \\) 为任意常数）。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'antiderivativeFamily', title: '原函数族的平移', sub: '拖动 C 让曲线族上下平移，观察同一横坐标处切线互相平行，并找出过定点的曲线' },
          { t: 'h3', idx: '②', text: '不定积分的定义与性质' },
          { t: 'card', kind: 'def', tag: '定义', title: '不定积分', html:
            '<p class="tight">称 \\( f \\) 的全体原函数为 \\( f \\) 的<b>不定积分</b>，记作</p>' +
            '<div class="fml">\\( \\int f(x)\\,\\mathrm{d}x=F(x)+C \\)</div>' +
            '<p class="tight">其中 \\( \\int \\) 为积分号，\\( f(x) \\) 为被积函数，\\( f(x)\\mathrm{d}x \\) 为被积表达式，\\( x \\) 为积分变量，\\( C \\) 为积分常数。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>互逆运算：</b>\\( \\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\int f(x)\\,\\mathrm{d}x=f(x),\\qquad \\int F^{\\prime}(x)\\,\\mathrm{d}x=F(x)+C \\)</div>' +
            '<div class="fml-row"><b>微分形式：</b>\\( \\mathrm{d}\\int f(x)\\,\\mathrm{d}x=f(x)\\,\\mathrm{d}x,\\qquad \\int \\mathrm{d}F(x)=F(x)+C \\)</div>' +
            '<div class="fml-row"><b>线性性质：</b>\\( \\int\\big[\\alpha f(x)+\\beta g(x)\\big]\\mathrm{d}x=\\alpha\\int f(x)\\,\\mathrm{d}x+\\beta\\int g(x)\\,\\mathrm{d}x \\)（\\( \\alpha,\\beta \\) 为常数）</div>'
          },
          { t: 'h3', idx: '③', text: '基本积分公式' },
          { t: 'card', kind: 'key', tag: '必记', title: '基本积分表（一）', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( \\int x^{\\mu}\\,\\mathrm{d}x=\\dfrac{x^{\\mu+1}}{\\mu+1}+C\\ (\\mu\\neq -1),\\qquad \\int \\dfrac{\\mathrm{d}x}{x}=\\ln|x|+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\mathrm{e}^{x}\\,\\mathrm{d}x=\\mathrm{e}^{x}+C,\\qquad \\int a^{x}\\,\\mathrm{d}x=\\dfrac{a^{x}}{\\ln a}+C\\ (a\\gt 0,a\\neq 1) \\)</div>' +
            '<div class="fml-row">\\( \\int \\sin x\\,\\mathrm{d}x=-\\cos x+C,\\qquad \\int \\cos x\\,\\mathrm{d}x=\\sin x+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\sec^{2}x\\,\\mathrm{d}x=\\tan x+C,\\qquad \\int \\csc^{2}x\\,\\mathrm{d}x=-\\cot x+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\sec x\\tan x\\,\\mathrm{d}x=\\sec x+C,\\qquad \\int \\csc x\\cot x\\,\\mathrm{d}x=-\\csc x+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\dfrac{\\mathrm{d}x}{1+x^{2}}=\\arctan x+C,\\qquad \\int \\dfrac{\\mathrm{d}x}{\\sqrt{1-x^{2}}}=\\arcsin x+C \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '基本积分表（二）', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( \\int \\tan x\\,\\mathrm{d}x=-\\ln|\\cos x|+C,\\qquad \\int \\cot x\\,\\mathrm{d}x=\\ln|\\sin x|+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\sec x\\,\\mathrm{d}x=\\ln|\\sec x+\\tan x|+C,\\qquad \\int \\csc x\\,\\mathrm{d}x=\\ln|\\csc x-\\cot x|+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\dfrac{\\mathrm{d}x}{a^{2}+x^{2}}=\\dfrac{1}{a}\\arctan\\dfrac{x}{a}+C,\\qquad \\int \\dfrac{\\mathrm{d}x}{x^{2}-a^{2}}=\\dfrac{1}{2a}\\ln\\left|\\dfrac{x-a}{x+a}\\right|+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\dfrac{\\mathrm{d}x}{\\sqrt{a^{2}-x^{2}}}=\\arcsin\\dfrac{x}{a}+C,\\qquad \\int \\dfrac{\\mathrm{d}x}{\\sqrt{x^{2}+a^{2}}}=\\ln\\left(x+\\sqrt{x^{2}+a^{2}}\\right)+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\dfrac{\\mathrm{d}x}{\\sqrt{x^{2}-a^{2}}}=\\ln\\left|x+\\sqrt{x^{2}-a^{2}}\\right|+C \\)</div>' +
            '<div class="fml-row">\\( \\int \\sinh x\\,\\mathrm{d}x=\\cosh x+C,\\qquad \\int \\cosh x\\,\\mathrm{d}x=\\sinh x+C \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '④', text: '求不定积分的基本思路' },
          { t: 'list', ordered: true, items: [
            '能直接套基本积分公式的，先恒等变形（拆项、配方、三角恒等变形）后逐项积分；',
            '能凑成 \\( \\int f[\\varphi(x)]\\varphi^{\\prime}(x)\\,\\mathrm{d}x \\) 形式的，用第一类换元法（凑微分）；',
            '含根式或二次式的，用第二类换元法（三角代换、根式代换）；',
            '乘积形式（反三角、对数、多项式与指数/三角函数的乘积）用分部积分法；',
            '有理函数先用部分分式分解，再逐项积分；三角有理式考虑万能代换或恒等变形。'
          ]}
        ],
        examples: [
          {
            no: '例 3.1', meta: '基础 · 原函数的应用',
            q: '已知 \\( \\ln x \\) 是 \\( f(x) \\) 的一个原函数，求 \\( \\displaystyle\\int x f^{\\prime}(x)\\,\\mathrm{d}x \\)。',
            sol: '<p>由题意 \\( f(x)=(\\ln x)^{\\prime}=\\dfrac{1}{x} \\)。</p>' +
              '<p>用分部积分：\\( \\displaystyle\\int x f^{\\prime}(x)\\,\\mathrm{d}x=\\int x\\,\\mathrm{d}f(x)=xf(x)-\\int f(x)\\,\\mathrm{d}x \\)。</p>' +
              '<p>代入 \\( f(x)=\\dfrac{1}{x} \\)：原式 \\( =x\\cdot\\dfrac{1}{x}-\\ln x+C=1-\\ln x+C \\)。</p>'
          },
          {
            no: '例 3.2', meta: '基础 · 直接积分',
            q: '求 \\( \\displaystyle\\int\\left(2x+3^{x}-\\dfrac{1}{1+x^{2}}\\right)\\mathrm{d}x \\)。',
            sol: '<p>逐项使用基本积分公式：</p>' +
              '<p>原式 \\( =x^{2}+\\dfrac{3^{x}}{\\ln 3}-\\arctan x+C \\)。</p>'
          },
          {
            no: '例 3.3', meta: '综合 · 分段函数的原函数',
            q: '求 \\( \\displaystyle\\int |x|\\,\\mathrm{d}x \\)。',
            sol: '<p>当 \\( x\\geqslant 0 \\) 时 \\( \\displaystyle\\int x\\,\\mathrm{d}x=\\dfrac{x^{2}}{2}+C_1 \\)；当 \\( x\\lt 0 \\) 时 \\( \\displaystyle\\int(-x)\\,\\mathrm{d}x=-\\dfrac{x^{2}}{2}+C_2 \\)。</p>' +
              '<p>原函数在 \\( x=0 \\) 处必须连续（原函数可导必连续）：\\( C_1=C_2 \\)。</p>' +
              '<p>故 \\( \\displaystyle\\int |x|\\,\\mathrm{d}x=\\begin{cases}\\dfrac{x^{2}}{2}+C, & x\\geqslant 0 \\\\ -\\dfrac{x^{2}}{2}+C, & x\\lt 0\\end{cases}=\\dfrac{1}{2}x|x|+C \\)。</p>'
          }
        ],
        pitfalls: [
          '不定积分的结果必须加任意常数 \\( C \\)，漏写 \\( C \\) 要扣分；\\( C \\) 可以写成任意常数记号但含义是全体常数。',
          '\\( \\displaystyle\\int\\dfrac{\\mathrm{d}x}{x}=\\ln|x|+C \\)，不要写成 \\( \\ln x+C \\)（在 \\( x\\lt 0 \\) 的部分也成立）。',
          '原函数存在是“区间上”的概念：连续函数必有原函数；含第一类间断点的函数在包含该点的区间上无原函数。',
          '分段函数的原函数要在分界点保持连续（甚至可导），不能简单地把两段的常数都写成 \\( C \\) 而不验证衔接。',
          '基本积分表中 \\( \\mu\\neq -1 \\)、\\( a\\neq 1 \\) 等条件不能忽略。'
        ]
      },

      /* ---------------- 3.2 ---------------- */
      {
        id: 'ch3-s2', num: '3.2', title: '定积分的概念与性质',
        lead: '大纲要求：理解定积分的概念，掌握定积分的基本性质与定积分中值定理；理解可积的条件。',
        blocks: [
          { t: 'h3', idx: '①', text: '定积分的定义' },
          { t: 'card', kind: 'def', tag: '定义', title: '定积分（黎曼和的极限）', html:
            '<p class="tight">设 \\( f \\) 在 \\( [a,b] \\) 上有界。用分点 \\( a=x_0\\lt x_1\\lt\\cdots\\lt x_n=b \\) 把 \\( [a,b] \\) 分成 \\( n \\) 个小区间 \\( [x_{i-1},x_i] \\)，任取 \\( \\xi_i\\in[x_{i-1},x_i] \\)，作黎曼和 \\( \\sum\\limits_{i=1}^{n}f(\\xi_i)\\Delta x_i \\)（\\( \\Delta x_i=x_i-x_{i-1} \\)）。令 \\( \\lambda=\\max\\{\\Delta x_i\\} \\)，若极限</p>' +
            '<div class="fml">\\( \\int_a^b f(x)\\,\\mathrm{d}x=\\lim\\limits_{\\lambda\\to 0}\\sum\\limits_{i=1}^{n}f(\\xi_i)\\Delta x_i \\)</div>' +
            '<p class="tight">存在且与分法、\\( \\xi_i \\) 的取法都无关，则称 \\( f \\) 在 \\( [a,b] \\) 上<b>可积</b>，该极限称为 \\( f \\) 在 \\( [a,b] \\) 上的<b>定积分</b>。</p>'
          },
          { t: 'viz', build: 'riemannSum', title: '黎曼和逼近定积分', sub: '调节分割份数与取点方式，观察矩形面积和趋于曲边梯形面积' },
          { t: 'list', items: [
            '<b>几何意义：</b>当 \\( f(x)\\geqslant 0 \\) 时，定积分是曲边梯形的面积；一般情形是 \\( x \\) 轴上方图形面积减去下方图形面积（面积的代数和）；',
            '<b>物理意义：</b>变速直线运动的路程 \\( s=\\displaystyle\\int_a^b v(t)\\,\\mathrm{d}t \\)；变力做功 \\( W=\\displaystyle\\int_a^b F(x)\\,\\mathrm{d}x \\)；非均匀细棒的质量等；',
            '<b>记号约定：</b>\\( \\displaystyle\\int_a^a f(x)\\,\\mathrm{d}x=0 \\)，\\( \\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x=-\\int_b^a f(x)\\,\\mathrm{d}x \\)。'
          ]},
          { t: 'h3', idx: '②', text: '可积的条件' },
          { t: 'card', kind: 'key', tag: '必记', title: '可积的必要条件与充分条件', html:
            '<ul class="none">' +
            '<li><b>必要条件：</b>若 \\( f \\) 在 \\( [a,b] \\) 上可积，则 \\( f \\) 在 \\( [a,b] \\) 上有界；无界函数必不可积；</li>' +
            '<li><b>充分条件 1：</b>\\( f \\) 在 \\( [a,b] \\) 上连续 \\( \\Rightarrow \\) 可积；</li>' +
            '<li><b>充分条件 2：</b>\\( f \\) 在 \\( [a,b] \\) 上有界且只有有限个间断点 \\( \\Rightarrow \\) 可积；</li>' +
            '<li><b>单调有界函数</b>在闭区间上也可积。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '定积分的基本性质' },
          { t: 'fml', html:
            '<div class="fml-row"><b>线性：</b>\\( \\displaystyle\\int_a^b\\big[\\alpha f(x)+\\beta g(x)\\big]\\mathrm{d}x=\\alpha\\int_a^b f(x)\\,\\mathrm{d}x+\\beta\\int_a^b g(x)\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row"><b>区间可加：</b>\\( \\displaystyle\\int_a^b f\\,\\mathrm{d}x=\\int_a^c f\\,\\mathrm{d}x+\\int_c^b f\\,\\mathrm{d}x \\)（\\( c \\) 的位置任意，不论在 \\( [a,b] \\) 内外）</div>' +
            '<div class="fml-row"><b>保号性：</b>\\( a\\lt b \\)，\\( f(x)\\geqslant 0 \\Rightarrow \\displaystyle\\int_a^b f\\,\\mathrm{d}x\\geqslant 0 \\)；若 \\( f,g \\) 可积且 \\( f\\leqslant g \\)，则 \\( \\displaystyle\\int_a^b f\\,\\mathrm{d}x\\leqslant\\int_a^b g\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row"><b>估值定理：</b>\\( m\\leqslant f(x)\\leqslant M\\ (x\\in[a,b]) \\Rightarrow m(b-a)\\leqslant\\displaystyle\\int_a^b f\\,\\mathrm{d}x\\leqslant M(b-a) \\)</div>' +
            '<div class="fml-row"><b>绝对值不等式：</b>\\( \\left|\\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x\\right|\\leqslant\\int_a^b|f(x)|\\,\\mathrm{d}x \\)</div>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '定积分中值定理', html:
            '<p class="tight">若 \\( f \\) 在 \\( [a,b] \\) 上连续，则至少存在一点 \\( \\xi\\in[a,b] \\)，使</p>' +
            '<div class="fml">\\( \\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x=f(\\xi)(b-a) \\)</div>' +
            '<p class="tight">即 \\( f(\\xi)=\\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x \\) 是函数 \\( f \\) 在 \\( [a,b] \\) 上的<b>平均值</b>。几何上，“曲边梯形”与同底等高的矩形面积相等。</p>'
          },
          { t: 'h3', idx: '④', text: '定积分与不定积分的区别与联系' },
          { t: 'table', head: ['对比项', '不定积分', '定积分'], rows: [
            ['本质', '原函数族（函数集合）', '一个确定的数（与积分变量无关）'],
            ['记号', '\\( \\displaystyle\\int f(x)\\,\\mathrm{d}x \\)', '\\( \\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x \\)'],
            ['变量', '结果含有积分变量 \\( x \\)', '结果与积分变量记号无关'],
            ['联系', '牛顿-莱布尼茨公式：\\( \\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x=F(b)-F(a) \\)，其中 \\( F^{\\prime}=f \\)', '同一“\\( \\int \\)”符号的两层含义']
          ]}
        ],
        examples: [
          {
            no: '例 3.4', meta: '基础 · 用定义计算定积分',
            q: '用定积分定义计算 \\( \\displaystyle\\int_0^1 x^{2}\\,\\mathrm{d}x \\)。',
            sol: '<p>把 \\( [0,1] \\) 等分成 \\( n \\) 份，取 \\( \\xi_i=\\dfrac{i}{n} \\)：</p>' +
              '<p>\\( \\sum\\limits_{i=1}^{n}f(\\xi_i)\\Delta x_i=\\sum\\limits_{i=1}^{n}\\left(\\dfrac{i}{n}\\right)^{2}\\cdot\\dfrac{1}{n}=\\dfrac{1}{n^{3}}\\sum\\limits_{i=1}^{n}i^{2}=\\dfrac{1}{n^{3}}\\cdot\\dfrac{n(n+1)(2n+1)}{6} \\)。</p>' +
              '<p>令 \\( n\\to\\infty \\)：\\( \\displaystyle\\int_0^1 x^{2}\\,\\mathrm{d}x=\\lim\\limits_{n\\to\\infty}\\dfrac{(n+1)(2n+1)}{6n^{2}}=\\dfrac{1}{3} \\)。</p>'
          },
          {
            no: '例 3.5', meta: '综合 · 用定积分定义求极限',
            q: '求 \\( \\lim\\limits_{n\\to\\infty}\\dfrac{1}{n}\\left(\\sqrt{1+\\dfrac{1}{n}}+\\sqrt{1+\\dfrac{2}{n}}+\\cdots+\\sqrt{1+\\dfrac{n}{n}}\\right) \\)。',
            sol: '<p>把和式写成 \\( \\dfrac{1}{n}\\sum\\limits_{i=1}^{n}\\sqrt{1+\\dfrac{i}{n}} \\)，这是 \\( f(x)=\\sqrt{1+x} \\) 在 \\( [0,1] \\) 上的黎曼和。</p>' +
              '<p>故原极限 \\( =\\displaystyle\\int_0^1\\sqrt{1+x}\\,\\mathrm{d}x=\\dfrac{2}{3}(1+x)^{3/2}\\Big|_0^1=\\dfrac{2}{3}\\left(2\\sqrt{2}-1\\right) \\)。</p>'
          },
          {
            no: '例 3.6', meta: '综合 · 估值定理',
            q: '估计 \\( \\displaystyle\\int_0^1 \\mathrm{e}^{x^{2}}\\,\\mathrm{d}x \\) 的取值范围。',
            sol: '<p>\\( f(x)=\\mathrm{e}^{x^{2}} \\) 在 \\( [0,1] \\) 上单调增加，故最小值 \\( m=f(0)=1 \\)，最大值 \\( M=f(1)=\\mathrm{e} \\)。</p>' +
              '<p>由估值定理：\\( 1\\cdot(1-0)\\leqslant\\displaystyle\\int_0^1 \\mathrm{e}^{x^{2}}\\,\\mathrm{d}x\\leqslant\\mathrm{e}\\cdot(1-0) \\)，</p>' +
              '<p>即 \\( 1\\leqslant\\displaystyle\\int_0^1 \\mathrm{e}^{x^{2}}\\,\\mathrm{d}x\\leqslant\\mathrm{e} \\)。</p>'
          }
        ],
        pitfalls: [
          '定积分是数，与积分变量记号无关：\\( \\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x=\\int_a^b f(t)\\,\\mathrm{d}t \\)；计算定积分时不要加常数 \\( C \\)。',
          '可积不一定连续（如分段函数），连续一定可积；无界函数不可积（反常积分另行定义）。',
          '使用保号性与比较性质时必须注意积分上下限：\\( a\\lt b \\) 且 \\( f\\geqslant 0 \\) 才有 \\( \\displaystyle\\int_a^b f\\geqslant 0 \\)；若上下限反号则结论相反。',
          '估值定理与中值定理都要求 \\( f \\) 连续或可积，中值定理的 \\( \\xi \\) 在 \\( [a,b] \\) 上（不要求开区间）。',
          '用定义求极限时要准确识别“\\( \\dfrac{1}{n}\\sum f\\left(\\dfrac{i}{n}\\right) \\)”的标准形式，缺系数时先变形。'
        ]
      },

      /* ---------------- 3.3 ---------------- */
      {
        id: 'ch3-s3', num: '3.3', title: '变限积分与牛顿-莱布尼茨公式',
        lead: '大纲要求：理解积分上限的函数，会求它的导数，掌握牛顿-莱布尼茨公式。',
        blocks: [
          { t: 'h3', idx: '①', text: '积分上限的函数及其导数' },
          { t: 'card', kind: 'thm', tag: '定理', title: '变上限积分函数', html:
            '<p class="tight">设 \\( f \\) 在 \\( [a,b] \\) 上可积，令 \\( \\Phi(x)=\\displaystyle\\int_a^x f(t)\\,\\mathrm{d}t\\ (x\\in[a,b]) \\)，则：</p>' +
            '<ul class="none">' +
            '<li>\\( \\Phi(x) \\) 在 \\( [a,b] \\) 上连续；</li>' +
            '<li>若 \\( f \\) 在 \\( [a,b] \\) 上连续，则 \\( \\Phi(x) \\) 在 \\( [a,b] \\) 上可导，且 \\( \\Phi^{\\prime}(x)=f(x) \\)，即连续函数必有原函数 \\( \\Phi(x) \\)。</li>' +
            '</ul>' +
            '<p class="tight">若 \\( f \\) 有跳跃间断点，则 \\( \\Phi \\) 在该点不可导，但仍连续。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '一般变限积分的求导公式', html:
            '<p class="tight">设 \\( f \\) 连续，\\( u(x),v(x) \\) 可导：</p>' +
            '<div class="fml">\\( \\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\int_{v(x)}^{u(x)}f(t)\\,\\mathrm{d}t=f\\big(u(x)\\big)u^{\\prime}(x)-f\\big(v(x)\\big)v^{\\prime}(x) \\)</div>' +
            '<p class="tight"><b>要点：</b>上限代入乘上限导数，减去下限代入乘下限导数。</p>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '被积函数含 x 时怎么办', html:
            '<p class="tight">被积函数中含有积分变量之外的 \\( x \\) 时，<b>不能</b>直接套公式，必须先用换元或恒等变形把 \\( x \\) 从被积函数中分离出来：</p>' +
            '<div class="fml">\\( \\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\int_0^x (x-t)f(t)\\,\\mathrm{d}t=\\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\left[x\\int_0^x f(t)\\,\\mathrm{d}t-\\int_0^x t f(t)\\,\\mathrm{d}t\\right]=\\int_0^x f(t)\\,\\mathrm{d}t \\)</div>'
          },
          { t: 'h3', idx: '②', text: '牛顿-莱布尼茨公式' },
          { t: 'card', kind: 'thm', tag: '定理', title: '微积分基本定理（牛顿-莱布尼茨公式）', html:
            '<p class="tight">设 \\( f \\) 在 \\( [a,b] \\) 上连续，\\( F \\) 是 \\( f \\) 在 \\( [a,b] \\) 上的任意一个原函数，则</p>' +
            '<div class="fml">\\( \\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x=F(b)-F(a)=F(x)\\Big|_a^b \\)</div>' +
            '<p class="tight">该公式把定积分的计算归结为求原函数，是微积分学的核心纽带。</p>'
          },
          { t: 'viz', build: 'ftcArea', title: '变上限积分函数', sub: '拖动上限 b，观察面积函数 Φ(x) 的增量率等于被积函数值 f(x)' },
          { t: 'h3', idx: '③', text: '变限积分的综合应用' },
          { t: 'list', items: [
            '对含变限积分的函数求导，分析其单调性、极值、凹凸性；',
            '结合洛必达法则求 \\( \\dfrac{0}{0} \\) 型极限（分子或分母含变限积分）；',
            '证明积分等式或不等式：构造变限积分函数，用求导与零点定理；',
            '解含变限积分的函数方程：两边求导化为微分方程，注意初始条件由原方程给出；',
            '判断含变限积分函数的奇偶性：\\( f \\) 为奇函数时 \\( \\displaystyle\\int_0^x f(t)\\,\\mathrm{d}t \\) 为偶函数，\\( f \\) 为偶函数时为奇函数。'
          ]},
          { t: 'card', kind: 'exam', tag: '真题视角', title: '变限积分与洛必达的结合', html:
            '<p class="tight">求 \\( \\lim\\limits_{x\\to 0}\\dfrac{\\int_0^{x}f(t)\\,\\mathrm{d}t}{x} \\) 型极限时，若 \\( f \\) 连续，可直接用洛必达法则分子求导得 \\( f(x) \\)，结果等于 \\( f(0) \\)——这本质上是导数定义与积分中值定理的又一体现。</p>'
          }
        ],
        examples: [
          {
            no: '例 3.7', meta: '基础 · 变限积分求导',
            q: '设 \\( F(x)=\\displaystyle\\int_{x^{2}}^{\\sin x}\\mathrm{e}^{t}\\,\\mathrm{d}t \\)，求 \\( F^{\\prime}(x) \\)。',
            sol: '<p>由一般变限积分求导公式：</p>' +
              '<p>\\( F^{\\prime}(x)=\\mathrm{e}^{\\sin x}\\cdot(\\sin x)^{\\prime}-\\mathrm{e}^{x^{2}}\\cdot(x^{2})^{\\prime}=\\mathrm{e}^{\\sin x}\\cos x-2x\\,\\mathrm{e}^{x^{2}} \\)。</p>'
          },
          {
            no: '例 3.8', meta: '综合 · 被积函数含 x 的情形',
            q: '求 \\( \\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\displaystyle\\int_0^{x}(x-t)f(t)\\,\\mathrm{d}t \\)，其中 \\( f \\) 连续。',
            sol: '<p>先把 \\( x \\) 提出积分号：\\( \\displaystyle\\int_0^{x}(x-t)f(t)\\,\\mathrm{d}t=x\\int_0^{x}f(t)\\,\\mathrm{d}t-\\int_0^{x}t f(t)\\,\\mathrm{d}t \\)。</p>' +
              '<p>再求导：\\( \\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\left[x\\int_0^{x}f(t)\\,\\mathrm{d}t\\right]=\\int_0^{x}f(t)\\,\\mathrm{d}t+xf(x) \\)，\\( \\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\left[\\int_0^{x}t f(t)\\,\\mathrm{d}t\\right]=xf(x) \\)。</p>' +
              '<p>两式相减得原式 \\( =\\displaystyle\\int_0^{x}f(t)\\,\\mathrm{d}t \\)。</p>'
          },
          {
            no: '例 3.9', meta: '综合 · 变限积分与洛必达',
            q: '求 \\( \\lim\\limits_{x\\to 0}\\dfrac{\\displaystyle\\int_0^{x^{2}}\\sin t\\,\\mathrm{d}t}{x^{4}} \\)。',
            sol: '<p>这是 \\( \\dfrac{0}{0} \\) 型，用洛必达法则并对分子用变限积分求导：</p>' +
              '<p>分子导数 \\( =\\sin(x^{2})\\cdot 2x \\)，分母导数 \\( =4x^{3} \\)。</p>' +
              '<p>原式 \\( =\\lim\\limits_{x\\to 0}\\dfrac{2x\\sin(x^{2})}{4x^{3}}=\\lim\\limits_{x\\to 0}\\dfrac{\\sin(x^{2})}{2x^{2}}=\\dfrac{1}{2} \\)。</p>'
          },
          {
            no: '例 3.10', meta: '提高 · 牛顿-莱布尼茨公式与奇偶性',
            q: '计算 \\( \\displaystyle\\int_{-1}^{1}\\left(x+\\sqrt{1-x^{2}}\\right)\\mathrm{d}x \\)。',
            sol: '<p>由线性性质拆成两项：\\( \\displaystyle\\int_{-1}^{1}x\\,\\mathrm{d}x+\\int_{-1}^{1}\\sqrt{1-x^{2}}\\,\\mathrm{d}x \\)。</p>' +
              '<p>第一项被积函数为奇函数，对称区间积分为 0；第二项表示半径为 1 的上半圆的面积，等于 \\( \\dfrac{\\pi}{2} \\)。</p>' +
              '<p>故原式 \\( =0+\\dfrac{\\pi}{2}=\\dfrac{\\pi}{2} \\)。</p>'
          }
        ],
        pitfalls: [
          '变限积分求导时，上下限为复合函数要乘链式导数：\\( \\dfrac{\\mathrm{d}}{\\mathrm{d}x}\\int_a^{u(x)}f(t)\\,\\mathrm{d}t=f(u(x))u^{\\prime}(x) \\)。',
          '被积函数中含 \\( x \\) 时不能直接求导，必须先换元或把 \\( x \\) 提到积分号外。',
          '牛顿-莱布尼茨公式要求 \\( f \\) 连续（或被积函数的原函数存在且连续）；对有间断点的函数要分区间使用或按反常积分处理。',
          '\\( \\Phi(x)=\\displaystyle\\int_a^x f(t)\\,\\mathrm{d}t \\) 连续但未必可导：当 \\( f \\) 有跳跃间断点时，\\( \\Phi \\) 在该点不可导。',
          '解含变限积分的方程时，求导会“丢失”信息（常数），需要由原方程补充初始条件确定常数。'
        ]
      },

      /* ---------------- 3.4 ---------------- */
      {
        id: 'ch3-s4', num: '3.4', title: '换元积分法与分部积分法',
        lead: '大纲要求：掌握不定积分和定积分的换元积分法与分部积分法；会求有理函数、三角函数有理式和简单无理函数的积分。',
        blocks: [
          { t: 'h3', idx: '①', text: '第一类换元法（凑微分）' },
          { t: 'card', kind: 'thm', tag: '方法', title: '第一类换元法', html:
            '<p class="tight">若 \\( \\displaystyle\\int f(u)\\,\\mathrm{d}u=F(u)+C \\)，则</p>' +
            '<div class="fml">\\( \\displaystyle\\int f[\\varphi(x)]\\,\\varphi^{\\prime}(x)\\,\\mathrm{d}x=\\int f[\\varphi(x)]\\,\\mathrm{d}\\varphi(x)=F[\\varphi(x)]+C \\)</div>' +
            '<p class="tight">关键是识别 \\( \\varphi^{\\prime}(x)\\,\\mathrm{d}x=\\mathrm{d}\\varphi(x) \\)，即“凑微分”。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '常用凑微分公式', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( x\\,\\mathrm{d}x=\\dfrac{1}{2}\\mathrm{d}(x^{2}),\\qquad \\dfrac{\\mathrm{d}x}{x}=\\mathrm{d}(\\ln|x|),\\qquad \\dfrac{\\mathrm{d}x}{\\sqrt{x}}=2\\,\\mathrm{d}(\\sqrt{x}) \\)</div>' +
            '<div class="fml-row">\\( \\mathrm{e}^{x}\\,\\mathrm{d}x=\\mathrm{d}(\\mathrm{e}^{x}),\\qquad \\dfrac{\\mathrm{d}x}{1+x^{2}}=\\mathrm{d}(\\arctan x) \\)</div>' +
            '<div class="fml-row">\\( \\cos x\\,\\mathrm{d}x=\\mathrm{d}(\\sin x),\\qquad \\sin x\\,\\mathrm{d}x=-\\mathrm{d}(\\cos x) \\)</div>' +
            '<div class="fml-row">\\( \\sec^{2}x\\,\\mathrm{d}x=\\mathrm{d}(\\tan x),\\qquad \\dfrac{\\mathrm{d}x}{\\sqrt{1-x^{2}}}=\\mathrm{d}(\\arcsin x) \\)</div>' +
            '<div class="fml-row">\\( \\dfrac{x\\,\\mathrm{d}x}{\\sqrt{1+x^{2}}}=\\mathrm{d}\\left(\\sqrt{1+x^{2}}\\right),\\qquad \\dfrac{\\mathrm{d}x}{x^{2}}=-\\mathrm{d}\\left(\\dfrac{1}{x}\\right) \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '②', text: '第二类换元法' },
          { t: 'card', kind: 'thm', tag: '方法', title: '第二类换元法', html:
            '<p class="tight">设 \\( x=\\varphi(t) \\) 单调可导且 \\( \\varphi^{\\prime}(t)\\neq 0 \\)，则</p>' +
            '<div class="fml">\\( \\displaystyle\\int f(x)\\,\\mathrm{d}x=\\int f[\\varphi(t)]\\,\\varphi^{\\prime}(t)\\,\\mathrm{d}t \\)</div>' +
            '<p class="tight">求出关于 \\( t \\) 的原函数后必须回代 \\( t=\\varphi^{-1}(x) \\)。定积分换元时同步换上下限，不必回代。</p>'
          },
          { t: 'table', head: ['被积函数含', '代换', '结果化简'], rows: [
            ['\\( \\sqrt{a^{2}-x^{2}} \\)', '\\( x=a\\sin t,\\ t\\in\\left[-\\dfrac{\\pi}{2},\\dfrac{\\pi}{2}\\right] \\)', '\\( \\sqrt{a^{2}-x^{2}}=a\\cos t \\)'],
            ['\\( \\sqrt{a^{2}+x^{2}} \\)', '\\( x=a\\tan t,\\ t\\in\\left(-\\dfrac{\\pi}{2},\\dfrac{\\pi}{2}\\right) \\)', '\\( \\sqrt{a^{2}+x^{2}}=a\\sec t \\)'],
            ['\\( \\sqrt{x^{2}-a^{2}} \\)', '\\( x=a\\sec t \\)', '\\( \\sqrt{x^{2}-a^{2}}=a\\tan t \\)'],
            ['\\( \\sqrt[n]{ax+b} \\)', '\\( t=\\sqrt[n]{ax+b} \\)', '化为 \\( t \\) 的有理函数'],
            ['分母次数高', '倒代换 \\( x=\\dfrac{1}{t} \\)', '降低分母次数']
          ]},
          { t: 'viz', build: 'substitution', title: '换元积分法：区间与微元的变形', sub: '以 x = sin t 为例，拖动 t₀ 与分割数，观察 dx = cos t dt 如何把面积“拉伸”到 t 平面' },
          { t: 'h3', idx: '③', text: '分部积分法' },
          { t: 'card', kind: 'thm', tag: '方法', title: '分部积分公式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>不定积分：</b>\\( \\displaystyle\\int u\\,\\mathrm{d}v=uv-\\int v\\,\\mathrm{d}u \\)</div>' +
            '<div class="fml-row"><b>定积分：</b>\\( \\displaystyle\\int_a^b u\\,\\mathrm{d}v=uv\\Big|_a^b-\\int_a^b v\\,\\mathrm{d}u \\)</div>' +
            '</div>' +
            '<p class="tight"><b>选 \\( u \\) 的口诀：</b>“反、对、幂、指、三”——按反三角函数、对数函数、幂函数、指数函数、三角函数的顺序，谁在前谁取作 \\( u \\)，剩下的与 \\( \\mathrm{d}x \\) 一起凑成 \\( \\mathrm{d}v \\)。</p>'
          },
          { t: 'h3', idx: '④', text: '三类特殊函数的积分' },
          { t: 'list', items: [
            '<b>有理函数 \\( \\dfrac{P(x)}{Q(x)} \\)：</b>若为假分式先做多项式除法；再把分母因式分解为一次、二次因式之积，用待定系数法拆成部分分式，逐项积分；',
            '<b>三角函数有理式 \\( R(\\sin x,\\cos x) \\)：</b>可用万能代换 \\( t=\\tan\\dfrac{x}{2} \\)，此时 \\( \\sin x=\\dfrac{2t}{1+t^{2}},\\ \\cos x=\\dfrac{1-t^{2}}{1+t^{2}},\\ \\mathrm{d}x=\\dfrac{2\\,\\mathrm{d}t}{1+t^{2}} \\)；但能用凑微分、倍角公式简化时应优先用简单方法；',
            '<b>简单无理函数：</b>用根式代换去掉根号（如 \\( t=\\sqrt{x+1} \\)），或配方后用三角代换；',
            '<b>三角有理式的常用简化：</b>\\( R(-\\sin x,\\cos x)=-R(\\sin x,\\cos x) \\) 时令 \\( u=\\cos x \\)；\\( R(\\sin x,-\\cos x)=-R(\\sin x,\\cos x) \\) 时令 \\( u=\\sin x \\)。'
          ]}
        ],
        examples: [
          {
            no: '例 3.11', meta: '基础 · 凑微分（配方）',
            q: '求 \\( \\displaystyle\\int\\dfrac{\\mathrm{d}x}{x^{2}+2x+5} \\)。',
            sol: '<p>配方：\\( x^{2}+2x+5=(x+1)^{2}+4 \\)。</p>' +
              '<p>原式 \\( =\\displaystyle\\int\\dfrac{\\mathrm{d}(x+1)}{(x+1)^{2}+2^{2}}=\\dfrac{1}{2}\\arctan\\dfrac{x+1}{2}+C \\)。</p>'
          },
          {
            no: '例 3.12', meta: '综合 · 三角代换',
            q: '求 \\( \\displaystyle\\int\\dfrac{\\mathrm{d}x}{x^{2}\\sqrt{x^{2}+1}} \\)。',
            sol: '<p>令 \\( x=\\tan t\\ \\left(-\\dfrac{\\pi}{2}\\lt t\\lt\\dfrac{\\pi}{2}\\right) \\)，则 \\( \\mathrm{d}x=\\sec^{2}t\\,\\mathrm{d}t \\)，\\( \\sqrt{x^{2}+1}=\\sec t \\)。</p>' +
              '<p>原式 \\( =\\displaystyle\\int\\dfrac{\\sec^{2}t}{\\tan^{2}t\\cdot\\sec t}\\,\\mathrm{d}t=\\int\\dfrac{\\sec t}{\\tan^{2}t}\\,\\mathrm{d}t=\\int\\dfrac{\\cos t}{\\sin^{2}t}\\,\\mathrm{d}t \\)。</p>' +
              '<p>再令 \\( u=\\sin t \\)：原式 \\( =\\displaystyle\\int\\dfrac{\\mathrm{d}u}{u^{2}}=-\\dfrac{1}{u}+C=-\\dfrac{1}{\\sin t}+C \\)。</p>' +
              '<p>回代 \\( \\sin t=\\dfrac{x}{\\sqrt{x^{2}+1}} \\)，得原式 \\( =-\\dfrac{\\sqrt{x^{2}+1}}{x}+C \\)。</p>'
          },
          {
            no: '例 3.13', meta: '综合 · 分部积分',
            q: '求 \\( \\displaystyle\\int x\\arctan x\\,\\mathrm{d}x \\)。',
            sol: '<p>取 \\( u=\\arctan x,\\ \\mathrm{d}v=x\\,\\mathrm{d}x \\)，则 \\( \\mathrm{d}u=\\dfrac{\\mathrm{d}x}{1+x^{2}},\\ v=\\dfrac{x^{2}}{2} \\)。</p>' +
              '<p>原式 \\( =\\dfrac{x^{2}}{2}\\arctan x-\\dfrac{1}{2}\\displaystyle\\int\\dfrac{x^{2}}{1+x^{2}}\\,\\mathrm{d}x=\\dfrac{x^{2}}{2}\\arctan x-\\dfrac{1}{2}\\int\\left(1-\\dfrac{1}{1+x^{2}}\\right)\\mathrm{d}x \\)。</p>' +
              '<p>\\( =\\dfrac{x^{2}}{2}\\arctan x-\\dfrac{x}{2}+\\dfrac{1}{2}\\arctan x+C=\\dfrac{x^{2}+1}{2}\\arctan x-\\dfrac{x}{2}+C \\)。</p>'
          },
          {
            no: '例 3.14', meta: '综合 · 有理函数积分',
            q: '求 \\( \\displaystyle\\int\\dfrac{2x+3}{x^{2}+3x+2}\\,\\mathrm{d}x \\)。',
            sol: '<p>分母分解：\\( x^{2}+3x+2=(x+1)(x+2) \\)。设 \\( \\dfrac{2x+3}{(x+1)(x+2)}=\\dfrac{A}{x+1}+\\dfrac{B}{x+2} \\)。</p>' +
              '<p>则 \\( 2x+3=A(x+2)+B(x+1) \\)，比较系数：\\( A+B=2,\\ 2A+B=3 \\)，解得 \\( A=1,\\ B=1 \\)。</p>' +
              '<p>原式 \\( =\\displaystyle\\int\\left(\\dfrac{1}{x+1}+\\dfrac{1}{x+2}\\right)\\mathrm{d}x=\\ln|x+1|+\\ln|x+2|+C \\)。</p>'
          },
          {
            no: '例 3.15', meta: '提高 · 定积分的换元',
            q: '计算 \\( \\displaystyle\\int_0^1\\sqrt{1-x^{2}}\\,\\mathrm{d}x \\)。',
            sol: '<p>令 \\( x=\\sin t \\)，当 \\( x=0 \\) 时 \\( t=0 \\)，当 \\( x=1 \\) 时 \\( t=\\dfrac{\\pi}{2} \\)，\\( \\mathrm{d}x=\\cos t\\,\\mathrm{d}t \\)。</p>' +
              '<p>原式 \\( =\\displaystyle\\int_0^{\\pi/2}\\cos^{2}t\\,\\mathrm{d}t=\\int_0^{\\pi/2}\\dfrac{1+\\cos 2t}{2}\\,\\mathrm{d}t=\\left[\\dfrac{t}{2}+\\dfrac{\\sin 2t}{4}\\right]_0^{\\pi/2}=\\dfrac{\\pi}{4} \\)。</p>' +
              '<p>几何意义：单位圆在第一象限部分的面积。</p>'
          }
        ],
        pitfalls: [
          '不定积分换元后必须回代原变量；定积分换元必须同步更换上下限，且换限后不再回代。',
          '凑微分要注意系数：\\( \\displaystyle\\int \\mathrm{e}^{2x}\\,\\mathrm{d}x=\\dfrac{1}{2}\\mathrm{e}^{2x}+C \\)，系数 1/2 容易漏。',
          '三角代换要写清 \\( t \\) 的范围，以便正确去掉根号中的绝对值符号。',
          '分部积分选取 \\( u \\) 要按“反对幂指三”的顺序；若选取不当可能越积越繁（如把指数函数取作 \\( u \\)）。',
          '有理函数分解部分分式时，重因式要写成 \\( \\dfrac{A_1}{x-a}+\\dfrac{A_2}{(x-a)^{2}}+\\cdots \\)；不可约二次因式对应一次分式 \\( \\dfrac{Bx+C}{x^{2}+px+q} \\)。'
        ]
      },

      /* ---------------- 3.5 ---------------- */
      {
        id: 'ch3-s5', num: '3.5', title: '反常积分',
        lead: '大纲要求：理解反常积分的概念，了解反常积分收敛的比较判别法，会计算反常积分。',
        blocks: [
          { t: 'h3', idx: '①', text: '无穷限的反常积分' },
          { t: 'card', kind: 'def', tag: '定义', title: '无穷限反常积分', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( \\displaystyle\\int_a^{+\\infty}f(x)\\,\\mathrm{d}x=\\lim\\limits_{t\\to+\\infty}\\int_a^{t}f(x)\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row">\\( \\displaystyle\\int_{-\\infty}^{b}f(x)\\,\\mathrm{d}x=\\lim\\limits_{t\\to-\\infty}\\int_t^{b}f(x)\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row">\\( \\displaystyle\\int_{-\\infty}^{+\\infty}f(x)\\,\\mathrm{d}x=\\int_{-\\infty}^{c}f(x)\\,\\mathrm{d}x+\\int_c^{+\\infty}f(x)\\,\\mathrm{d}x \\)</div>' +
            '</div>' +
            '<p class="tight">极限存在称积分<b>收敛</b>，极限不存在称<b>发散</b>。第三式要求右端两个积分都收敛（与 \\( c \\) 的选取无关）。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: 'p 积分（无穷限）', html:
            '<div class="fml">\\( \\displaystyle\\int_1^{+\\infty}\\dfrac{\\mathrm{d}x}{x^{p}}\\ \\begin{cases}\\text{收敛}\\ (p\\gt 1) \\\\ \\text{发散}\\ (p\\leqslant 1)\\end{cases} \\)</div>' +
            '<p class="tight">这是比较判别法的基本“标尺”：无穷远处只要比 \\( \\dfrac{1}{x^{p}}\\ (p\\gt 1) \\) 衰减得快，就可能收敛。</p>'
          },
          { t: 'h3', idx: '②', text: '无界函数的反常积分（瑕积分）' },
          { t: 'card', kind: 'def', tag: '定义', title: '瑕积分', html:
            '<p class="tight">若 \\( f \\) 在 \\( x_0 \\) 的任一邻域内无界，则称 \\( x_0 \\) 为 \\( f \\) 的<b>瑕点</b>。设 \\( a \\) 为瑕点：</p>' +
            '<div class="fml">\\( \\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x=\\lim\\limits_{t\\to a^{+}}\\int_t^{b}f(x)\\,\\mathrm{d}x \\)</div>' +
            '<p class="tight">若瑕点在区间内部，必须在瑕点处拆成两个积分分别讨论，都收敛才称收敛。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: 'p 积分（瑕点处）', html:
            '<div class="fml">\\( \\displaystyle\\int_a^b\\dfrac{\\mathrm{d}x}{(x-a)^{p}}\\ \\begin{cases}\\text{收敛}\\ (p\\lt 1) \\\\ \\text{发散}\\ (p\\geqslant 1)\\end{cases}\\quad\\text{（}\\,a\\,\\text{为瑕点）} \\)</div>' +
            '<p class="tight">注意与无穷限情形“大小关系相反”：瑕点处要求 \\( p\\lt 1 \\)（发散得比 \\( \\dfrac{1}{x-a} \\) 慢）。</p>'
          },
          { t: 'viz', build: 'improperIntegral', title: '反常积分的收敛与发散', sub: '调整指数 p，观察积分值是否趋于有限数' },
          { t: 'h3', idx: '③', text: '收敛判别法' },
          { t: 'card', kind: 'key', tag: '必记', title: '比较判别法（非负函数）', html:
            '<p class="tight">设 \\( 0\\leqslant f(x)\\leqslant g(x) \\) 在 \\( [a,+\\infty) \\) 上成立：</p>' +
            '<ul class="none">' +
            '<li>\\( \\displaystyle\\int_a^{+\\infty}g(x)\\,\\mathrm{d}x \\) 收敛 \\( \\Rightarrow \\displaystyle\\int_a^{+\\infty}f(x)\\,\\mathrm{d}x \\) 收敛；</li>' +
            '<li>\\( \\displaystyle\\int_a^{+\\infty}f(x)\\,\\mathrm{d}x \\) 发散 \\( \\Rightarrow \\displaystyle\\int_a^{+\\infty}g(x)\\,\\mathrm{d}x \\) 发散。</li>' +
            '</ul>' +
            '<p class="tight"><b>极限形式：</b>若 \\( \\lim\\limits_{x\\to+\\infty}\\dfrac{f(x)}{g(x)}=c\\ (0\\lt c\\lt+\\infty) \\)，则两积分同敛散；\\( f \\) 比 \\( g \\) 高阶小量时收敛性更好判断。</p>'
          },
          { t: 'table', head: ['被积函数在无穷远处的形态', '比较对象', '结论'], rows: [
            ['\\( f(x)\\sim\\dfrac{1}{x^{p}} \\)', '\\( \\dfrac{1}{x^{p}} \\)', '\\( p\\gt 1 \\) 收敛，\\( p\\leqslant 1 \\) 发散'],
            ['\\( f(x)\\sim\\dfrac{1}{x^{p}\\ln^{q}x} \\)', '\\( \\dfrac{1}{x^{p}} \\)', '\\( p\\gt 1 \\) 收敛；\\( p\\lt 1 \\) 发散；\\( p=1 \\) 时 \\( q\\gt 1 \\) 收敛'],
            ['含指数衰减 \\( \\mathrm{e}^{-ax}\\ (a\\gt 0) \\)', '\\( \\mathrm{e}^{-ax} \\)', '收敛']
          ]},
          { t: 'card', kind: 'warn', tag: '易错', title: '先找瑕点再套公式', html:
            '<p class="tight">计算前先检查：① 积分区间是否无穷；② 被积函数在积分区间内是否有无界点（分母零点、对数真数零点、根号内零点等）。例如 \\( \\displaystyle\\int_{-1}^{1}\\dfrac{\\mathrm{d}x}{x^{2}} \\) 在 \\( x=0 \\) 处是瑕点，属于瑕积分且发散，不能按普通定积分计算得 \\( -2 \\)。</p>'
          }
        ],
        examples: [
          {
            no: '例 3.16', meta: '基础 · 无穷限积分计算',
            q: '计算 \\( \\displaystyle\\int_0^{+\\infty}x\\mathrm{e}^{-x}\\,\\mathrm{d}x \\)。',
            sol: '<p>用分部积分：\\( \\displaystyle\\int_0^{t}x\\mathrm{e}^{-x}\\,\\mathrm{d}x=\\left[-x\\mathrm{e}^{-x}\\right]_0^{t}+\\int_0^{t}\\mathrm{e}^{-x}\\,\\mathrm{d}x=-t\\mathrm{e}^{-t}+1-\\mathrm{e}^{-t} \\)。</p>' +
              '<p>令 \\( t\\to+\\infty \\)：\\( \\lim\\limits_{t\\to+\\infty}\\left(1-\\dfrac{t+1}{\\mathrm{e}^{t}}\\right)=1 \\)（指数增长快于幂函数）。</p>' +
              '<p>故积分收敛，值为 1。</p>'
          },
          {
            no: '例 3.17', meta: '基础 · 瑕积分',
            q: '计算 \\( \\displaystyle\\int_0^1\\dfrac{\\mathrm{d}x}{\\sqrt{1-x^{2}}} \\)。',
            sol: '<p>\\( x=1 \\) 为瑕点。取 \\( t\\in(0,1) \\)：\\( \\displaystyle\\int_0^{t}\\dfrac{\\mathrm{d}x}{\\sqrt{1-x^{2}}}=\\arcsin x\\Big|_0^{t}=\\arcsin t \\)。</p>' +
              '<p>令 \\( t\\to 1^{-} \\)：\\( \\lim\\limits_{t\\to 1^{-}}\\arcsin t=\\dfrac{\\pi}{2} \\)，故积分收敛，值为 \\( \\dfrac{\\pi}{2} \\)。</p>'
          },
          {
            no: '例 3.18', meta: '综合 · 比较判别法',
            q: '判别反常积分 \\( \\displaystyle\\int_1^{+\\infty}\\dfrac{x+1}{x^{3}+1}\\,\\mathrm{d}x \\) 的敛散性。',
            sol: '<p>当 \\( x\\geqslant 1 \\) 时，\\( \\dfrac{x+1}{x^{3}+1}\\leqslant\\dfrac{x+1}{x^{3}}\\leqslant\\dfrac{2x}{x^{3}}=\\dfrac{2}{x^{2}} \\)，且被积函数非负。</p>' +
              '<p>而 \\( \\displaystyle\\int_1^{+\\infty}\\dfrac{2}{x^{2}}\\,\\mathrm{d}x \\) 收敛（\\( p=2\\gt 1 \\)）。</p>' +
              '<p>由比较判别法，原反常积分收敛。</p>'
          },
          {
            no: '例 3.19', meta: '提高 · 含二次式的无穷限积分',
            q: '计算 \\( \\displaystyle\\int_{-\\infty}^{+\\infty}\\dfrac{\\mathrm{d}x}{x^{2}+2x+2} \\)。',
            sol: '<p>配方：\\( x^{2}+2x+2=(x+1)^{2}+1 \\)。</p>' +
              '<p>\\( \\displaystyle\\int_{-\\infty}^{+\\infty}\\dfrac{\\mathrm{d}(x+1)}{(x+1)^{2}+1}=\\lim\\limits_{t\\to+\\infty}\\arctan t-\\lim\\limits_{s\\to-\\infty}\\arctan s=\\dfrac{\\pi}{2}-\\left(-\\dfrac{\\pi}{2}\\right)=\\pi \\)。</p>'
          }
        ],
        pitfalls: [
          '反常积分是极限，不能直接套牛顿-莱布尼茨公式：必须先确认收敛，再求极限值。',
          '\\( \\displaystyle\\int_{-\\infty}^{+\\infty}f(x)\\,\\mathrm{d}x \\) 要求 \\( \\displaystyle\\int_{-\\infty}^{0} \\) 与 \\( \\displaystyle\\int_0^{+\\infty} \\) 都收敛，一个发散则原积分发散。',
          '瑕点不一定在端点，可能在区间内部；有多个瑕点时要逐段拆分，分别判别。',
          '比较判别法只适用于非负函数；对一般函数应先考察绝对收敛，绝对收敛必收敛，条件收敛需单独论证。',
          '无穷限收敛与瑕积分收敛的 p 判据方向相反：无穷远处要 \\( p\\gt 1 \\)，瑕点附近要 \\( p\\lt 1 \\)。'
        ]
      },

      /* ---------------- 3.6 ---------------- */
      {
        id: 'ch3-s6', num: '3.6', title: '定积分的几何与物理应用',
        lead: '大纲要求：掌握用定积分表达和计算平面图形的面积、平面曲线的弧长、旋转体的体积及侧面积、平行截面面积为已知的立体体积、功、引力、压力、质心、形心及函数的平均值。',
        blocks: [
          { t: 'h3', idx: '①', text: '微元法（元素法）' },
          { t: 'card', kind: 'def', tag: '方法', title: '微元法', html:
            '<p class="tight">若所求量 \\( Q \\) 具有<b>可加性</b>，且在小区间 \\( [x,x+\\mathrm{d}x] \\) 上可用线性近似 \\( \\Delta Q\\approx \\mathrm{d}Q=q(x)\\,\\mathrm{d}x \\)（\\( \\mathrm{d}Q \\) 与 \\( \\Delta Q \\) 之差是 \\( \\mathrm{d}x \\) 的高阶无穷小），则</p>' +
            '<div class="fml">\\( Q=\\displaystyle\\int_a^b q(x)\\,\\mathrm{d}x \\)</div>' +
            '<p class="tight"><b>步骤：</b>① 选取积分变量并确定区间；② 取小区间写出微元 \\( \\mathrm{d}Q=q(x)\\mathrm{d}x \\)；③ 积分得总量。</p>'
          },
          { t: 'h3', idx: '②', text: '几何应用' },
          { t: 'card', kind: 'key', tag: '必记', title: '面积、弧长与体积公式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>直角坐标面积：</b>\\( A=\\displaystyle\\int_a^b|f(x)-g(x)|\\,\\mathrm{d}x \\)（上曲线减下曲线）</div>' +
            '<div class="fml-row"><b>极坐标面积：</b>\\( A=\\dfrac{1}{2}\\displaystyle\\int_{\\alpha}^{\\beta}r^{2}(\\theta)\\,\\mathrm{d}\\theta \\)</div>' +
            '<div class="fml-row"><b>弧长（直角坐标）：</b>\\( s=\\displaystyle\\int_a^b\\sqrt{1+y^{\\prime 2}}\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row"><b>弧长（参数方程）：</b>\\( s=\\displaystyle\\int_{\\alpha}^{\\beta}\\sqrt{\\varphi^{\\prime 2}(t)+\\psi^{\\prime 2}(t)}\\,\\mathrm{d}t \\)</div>' +
            '<div class="fml-row"><b>弧长（极坐标）：</b>\\( s=\\displaystyle\\int_{\\alpha}^{\\beta}\\sqrt{r^{2}+r^{\\prime 2}}\\,\\mathrm{d}\\theta \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '旋转体体积与侧面积', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>绕 x 轴体积（圆盘法）：</b>\\( V_x=\\pi\\displaystyle\\int_a^b y^{2}\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row"><b>绕 y 轴体积（柱壳法）：</b>\\( V_y=2\\pi\\displaystyle\\int_a^b x\\,|y|\\,\\mathrm{d}x \\)（\\( 0\\leqslant a\\leqslant x\\leqslant b \\)）</div>' +
            '<div class="fml-row"><b>参数方程绕 x 轴：</b>\\( V_x=\\pi\\displaystyle\\int_{\\alpha}^{\\beta}y^{2}(t)\\,x^{\\prime}(t)\\,\\mathrm{d}t \\)</div>' +
            '<div class="fml-row"><b>旋转体侧面积：</b>\\( S=2\\pi\\displaystyle\\int_a^b|y|\\sqrt{1+y^{\\prime 2}}\\,\\mathrm{d}x=2\\pi\\int|y|\\,\\mathrm{d}s \\)</div>' +
            '<div class="fml-row"><b>平行截面面积为已知的立体：</b>\\( V=\\displaystyle\\int_a^b A(x)\\,\\mathrm{d}x \\)</div>' +
            '</div>'
          },
          { t: 'viz', build: 'solidVolume', title: '旋转体与截面法', sub: '切换曲线与旋转轴，观察圆盘微元累积成旋转体' },
          { t: 'h3', idx: '③', text: '物理应用' },
          { t: 'table', head: ['物理量', '微元', '积分表达式'], rows: [
            ['变力做功', '\\( \\mathrm{d}W=F(x)\\,\\mathrm{d}x \\)', '\\( W=\\displaystyle\\int_a^b F(x)\\,\\mathrm{d}x \\)'],
            ['液体压力', '深 \\( x \\) 处宽 \\( L(x) \\) 的窄条上 \\( \\mathrm{d}P=\\rho g x L(x)\\,\\mathrm{d}x \\)', '\\( P=\\displaystyle\\int_a^b\\rho g x L(x)\\,\\mathrm{d}x \\)'],
            ['细棒对质点的引力', '\\( \\mathrm{d}F=\\dfrac{Gm\\mu\\,\\mathrm{d}x}{r^{2}(x)} \\)', '按方向分解后积分'],
            ['平面薄片质心（形心）', '静矩微元 \\( \\mathrm{d}M_y=x\\,f(x)\\,\\mathrm{d}x \\)', '\\( \\bar{x}=\\dfrac{1}{A}\\displaystyle\\int_a^b x f(x)\\,\\mathrm{d}x,\\ \\bar{y}=\\dfrac{1}{2A}\\int_a^b f^{2}(x)\\,\\mathrm{d}x \\)'],
            ['函数的平均值', '\\( \\mathrm{d}\\bar{f}=\\dfrac{f(x)\\,\\mathrm{d}x}{b-a} \\)', '\\( \\bar{f}=\\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,\\mathrm{d}x \\)']
          ]},
          { t: 'h3', idx: '④', text: '建模要点' },
          { t: 'list', items: [
            '选择合适的积分变量与坐标系：极坐标适合圆、心形线、双纽线；面积对 \\( y \\) 积分可避免分段；',
            '体积问题：圆盘法适合绕坐标轴且截面简单；柱壳法适合绕 \\( y \\) 轴且 \\( y=f(x) \\) 单值；',
            '压力、引力问题要画出示意图，写清力的方向与力臂；',
            '旋转体的侧面积不能对 \\( \\pi y^{2} \\) 求导得到，必须用弧微分 \\( \\mathrm{d}s \\)；',
            '所有结果都应检查量纲与几何直观（正负、大小是否合理）。'
          ]}
        ],
        examples: [
          {
            no: '例 3.20', meta: '基础 · 平面图形面积',
            q: '求由曲线 \\( y=x^{2} \\) 与直线 \\( y=x \\) 所围平面图形的面积。',
            sol: '<p>先求交点：\\( x^{2}=x \\Rightarrow x=0,1 \\)。在 \\( (0,1) \\) 内 \\( x\\gt x^{2} \\)，故 \\( x \\) 在上方。</p>' +
              '<p>\\( A=\\displaystyle\\int_0^1\\left(x-x^{2}\\right)\\mathrm{d}x=\\left[\\dfrac{x^{2}}{2}-\\dfrac{x^{3}}{3}\\right]_0^1=\\dfrac{1}{2}-\\dfrac{1}{3}=\\dfrac{1}{6} \\)。</p>'
          },
          {
            no: '例 3.21', meta: '基础 · 旋转体体积',
            q: '求曲线 \\( y=\\sin x\\ (0\\leqslant x\\leqslant\\pi) \\) 与 \\( x \\) 轴所围图形绕 \\( x \\) 轴旋转所成旋转体的体积。',
            sol: '<p>由圆盘法：\\( V=\\pi\\displaystyle\\int_0^{\\pi}\\sin^{2}x\\,\\mathrm{d}x \\)。</p>' +
              '<p>用倍角公式：\\( \\sin^{2}x=\\dfrac{1-\\cos 2x}{2} \\)，</p>' +
              '<p>\\( V=\\dfrac{\\pi}{2}\\displaystyle\\int_0^{\\pi}(1-\\cos 2x)\\,\\mathrm{d}x=\\dfrac{\\pi}{2}\\left[x-\\dfrac{\\sin 2x}{2}\\right]_0^{\\pi}=\\dfrac{\\pi^{2}}{2} \\)。</p>'
          },
          {
            no: '例 3.22', meta: '综合 · 弧长',
            q: '求曲线 \\( y=\\dfrac{2}{3}x^{3/2} \\) 在 \\( 0\\leqslant x\\leqslant 3 \\) 上的一段弧长。',
            sol: '<p>\\( y^{\\prime}=\\sqrt{x} \\)，故 \\( \\mathrm{d}s=\\sqrt{1+y^{\\prime 2}}\\,\\mathrm{d}x=\\sqrt{1+x}\\,\\mathrm{d}x \\)。</p>' +
              '<p>\\( s=\\displaystyle\\int_0^3\\sqrt{1+x}\\,\\mathrm{d}x=\\left[\\dfrac{2}{3}(1+x)^{3/2}\\right]_0^3=\\dfrac{2}{3}\\left(8-1\\right)=\\dfrac{14}{3} \\)。</p>'
          },
          {
            no: '例 3.23', meta: '综合 · 液体压力',
            q: '设有一竖直放置的矩形闸门，宽为 \\( a \\)、高为 \\( h \\)，上沿与水面相齐。求闸门所受的水压力（水的密度为 \\( \\rho \\)，重力加速度为 \\( g \\)）。',
            sol: '<p>取水面为原点，\\( x \\) 轴竖直向下，积分区间为 \\( [0,h] \\)。</p>' +
              '<p>深度 \\( x \\) 处宽度为 \\( a \\)，压强为 \\( \\rho g x \\)，微元压力 \\( \\mathrm{d}P=\\rho g x\\cdot a\\,\\mathrm{d}x \\)。</p>' +
              '<p>\\( P=\\displaystyle\\int_0^h \\rho g a x\\,\\mathrm{d}x=\\dfrac{1}{2}\\rho g a h^{2} \\)。</p>'
          },
          {
            no: '例 3.24', meta: '基础 · 函数的平均值',
            q: '求函数 \\( f(x)=\\sqrt{x} \\) 在 \\( [0,1] \\) 上的平均值。',
            sol: '<p>由平均值公式：\\( \\bar{f}=\\dfrac{1}{1-0}\\displaystyle\\int_0^1\\sqrt{x}\\,\\mathrm{d}x=\\left[\\dfrac{2}{3}x^{3/2}\\right]_0^1=\\dfrac{2}{3} \\)。</p>'
          }
        ],
        pitfalls: [
          '求面积时要判断两条曲线在区间内谁在上谁在下，交点可能不止一个，需要分段积分。',
          '绕 \\( y \\) 轴旋转的体积用柱壳法 \\( 2\\pi\\displaystyle\\int x|y|\\,\\mathrm{d}x \\)，注意半径是 \\( x \\) 而不是 \\( y \\)。',
          '弧长与旋转体侧面积的公式中根号内是 \\( 1+y^{\\prime 2} \\)（即 \\( \\mathrm{d}s \\) 因子），不要漏掉。',
          '物理应用要选好坐标系并统一单位；压力问题中压强随深度变化，深度是积分变量而不是常数。',
          '平均值公式的分母是区间长度 \\( b-a \\)，不是 \\( b \\)；面积、体积的积分上下限要由实际图形确定。'
        ]
      }
    ]
  };
})(window);
