/* ============================================================
   ch1.js — 第一章 函数、极限、连续
   覆盖 2026 大纲「一、函数、极限、连续」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH1 = {
    id: 'ch1', no: '一', title: '函数、极限、连续',
    subtitle: '函数是研究对象，极限是研究工具，连续是函数的“良好品性”——整个高等数学从这里出发。',
    tags: ['函数', '复合函数', '反函数', '初等函数', '极限', '左极限', '右极限', '无穷小', '等价无穷小', '夹逼准则', '两个重要极限', '连续', '间断点', '闭区间性质'],
    sections: [

      /* ---------------- 1.1 ---------------- */
      {
        id: 'ch1-s1', num: '1.1', title: '函数的概念与性质',
        lead: '大纲要求：理解函数的概念，掌握函数的表示法，会建立应用问题的函数关系；了解有界性、单调性、周期性和奇偶性。',
        blocks: [
          { t: 'h3', idx: '①', text: '函数的定义与表示' },
          { t: 'card', kind: 'def', tag: '定义', title: '函数', html:
            '<p class="tight">设数集 \\( D\\subset \\mathbb{R} \\)，若对每个 \\( x\\in D \\)，按对应法则 \\( f \\) 有唯一确定的 \\( y \\) 与之对应，则称 \\( f \\) 为定义在 \\( D \\) 上的函数，记作</p>' +
            '<div class="fml">\\( y=f(x),\\quad x\\in D \\)</div>' +
            '<p class="tight">\\( D \\) 为定义域，\\( f(D)=\\{y\\mid y=f(x),x\\in D\\} \\) 为值域。两个函数相同 ⇔ 定义域相同且对应法则相同。</p>'
          },
          { t: 'table', head: ['表示法', '说明'], rows: [
            ['解析法', '用公式表示，便于运算与讨论'],
            ['列表法', '用表格列出对应值'],
            ['图像法', '用平面曲线 \\( y=f(x) \\) 表示']
          ]},
          { t: 'h3', idx: '②', text: '函数的四种特性' },
          { t: 'table', head: ['特性', '定义'], rows: [
            ['有界性', '存在 \\( M>0 \\)，使 \\( |f(x)|\\leqslant M \\) 对一切 \\( x\\in X \\) 成立'],
            ['单调性', '\\( x_1<x_2 \\Rightarrow f(x_1)\\leqslant f(x_2) \\)（单调增），反之单调减'],
            ['周期性', '存在 \\( T>0 \\)，使 \\( f(x+T)=f(x) \\)；最小正周期未必存在'],
            ['奇偶性', '偶：\\( f(-x)=f(x) \\)；奇：\\( f(-x)=-f(x) \\)（定义域须对称）']
          ]},
          { t: 'viz', build: 'functionGallery', title: '函数性质画廊', sub: '切换奇偶 / 周期 / 单调 / 有界，拖动考察点观察性质验证' },
          { t: 'card', kind: 'key', tag: '必记', title: '奇偶性与周期性结论', html:
            '<ul class="none">' +
            '<li>奇函数 × 奇函数 = 偶函数；奇 × 偶 = 奇；偶 × 偶 = 偶；</li>' +
            '<li>奇函数在对称区间上的积分为 0：\\( \\int_{-a}^{a}f(x)\\,\\mathrm{d}x=0 \\)；</li>' +
            '<li>只有 \\( f(x)\\equiv 0 \\) 既是奇函数又是偶函数；</li>' +
            '<li>若 \\( f \\) 以 \\( T \\) 为周期，则 \\( f(ax+b) \\) 以 \\( T/|a| \\) 为周期。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '复合函数、反函数、分段函数与隐函数' },
          { t: 'list', items: [
            '<b>复合函数</b> \\( y=f[g(x)] \\)：要求内函数值域含于外函数定义域，复合顺序不可交换；',
            '<b>反函数</b> \\( y=f^{-1}(x) \\)：严格单调函数必有反函数，图像关于 \\( y=x \\) 对称；',
            '<b>分段函数</b>：不同区间用不同表达式，是一个函数而非多个函数；',
            '<b>隐函数</b>：由方程 \\( F(x,y)=0 \\) 确定的函数，不一定能显化。'
          ]},
          { t: 'card', kind: 'exam', tag: '真题视角', title: '函数关系的建立', html:
            '<p class="tight">应用题常要求“建立函数关系”：先设自变量，写出定义域，再用几何/物理关系列出目标量。定义域往往由实际意义确定，是易失分点。</p>'
          }
        ],
        examples: [
          {
            no: '例 1.1', meta: '基础 · 求定义域',
            q: '求函数 \\( f(x)=\\dfrac{\\ln(3-x)}{\\sqrt{x+1}}+\\arcsin\\dfrac{x-1}{2} \\) 的定义域。',
            sol: '<p>三个条件联立：\\( 3-x>0 \\Rightarrow x<3 \\)；\\( x+1>0 \\Rightarrow x>-1 \\)；\\( -1\\leqslant\\dfrac{x-1}{2}\\leqslant 1 \\Rightarrow -1\\leqslant x\\leqslant 3 \\)。</p><p>取交集得定义域 \\( (-1,\\,3) \\)。</p>'
          },
          {
            no: '例 1.2', meta: '综合 · 奇偶性',
            q: '判断 \\( f(x)=\\ln\\left(x+\\sqrt{1+x^2}\\right) \\) 的奇偶性。',
            sol: '<p>定义域为 \\( \\mathbb{R} \\)，关于原点对称。</p>' +
              '<p>\\( f(-x)+f(x)=\\ln\\left(-x+\\sqrt{1+x^2}\\right)+\\ln\\left(x+\\sqrt{1+x^2}\\right) \\)</p>' +
              '<p>\\( =\\ln\\left[(1+x^2)-x^2\\right]=\\ln 1=0 \\)，故 \\( f(-x)=-f(x) \\)，为<b>奇函数</b>。</p>'
          }
        ],
        pitfalls: [
          '定义域是函数的一部分：\\( f(x)=x \\) 与 \\( g(x)=\\dfrac{x^2}{x} \\) 不是同一函数。',
          '奇偶性判断前必须先看定义域是否关于原点对称。',
          '复合函数 \\( f[g(x)] \\) 与 \\( g[f(x)] \\) 一般不相等。'
        ]
      },

      /* ---------------- 1.2 ---------------- */
      {
        id: 'ch1-s2', num: '1.2', title: '基本初等函数与初等函数',
        lead: '大纲要求：掌握基本初等函数的性质及其图形，了解初等函数的概念。',
        blocks: [
          { t: 'h3', idx: '①', text: '五类基本初等函数' },
          { t: 'table', head: ['类别', '表达式', '要点'], rows: [
            ['幂函数', '\\( y=x^{\\mu} \\)', '定义域随 \\( \\mu \\) 变化；过 \\( (1,1) \\)'],
            ['指数函数', '\\( y=a^x\\ (a>0,a\\neq 1) \\)', '过 \\( (0,1) \\)，\\( a>1 \\) 增、\\( 0<a<1 \\) 减'],
            ['对数函数', '\\( y=\\log_a x \\)', '与指数函数互为反函数，过 \\( (1,0) \\)'],
            ['三角函数', '\\( \\sin x,\\ \\cos x,\\ \\tan x \\) 等', '有界、周期；\\( \\tan x \\) 有铅直渐近线'],
            ['反三角函数', '\\( \\arcsin x,\\ \\arccos x,\\ \\arctan x \\)', '主值区间分别为 \\( [-\\pi/2,\\pi/2] \\)、\\( [0,\\pi] \\)、\\( (-\\pi/2,\\pi/2) \\)']
          ]},
          { t: 'card', kind: 'def', tag: '定义', title: '初等函数', html:
            '<p class="tight">由常数和基本初等函数经过<b>有限次</b>四则运算与复合运算所构成、且能用<b>一个式子</b>表示的函数，称为初等函数。</p>'
          },
          { t: 'h3', idx: '②', text: '常用函数图像与性质速查' },
          { t: 'fml', html:
            '<div class="fml-row"><b>幂函数：</b>\\( y=x^{1/3} \\) 是奇函数且在 \\( \\mathbb{R} \\) 上单调增；\\( y=x^{-1} \\) 在 \\( (0,+\\infty) \\) 与 \\( (-\\infty,0) \\) 分别递减。</div>' +
            '<div class="fml-row"><b>反三角恒等式：</b>\\( \\arcsin x+\\arccos x=\\dfrac{\\pi}{2} \\)，\\( \\arctan x+\\operatorname{arccot} x=\\dfrac{\\pi}{2} \\)。</div>' +
            '<div class="fml-row"><b>三角恒等式：</b>\\( \\sin^2x+\\cos^2x=1 \\)，\\( 1+\\tan^2x=\\sec^2x \\)，\\( \\sin 2x=2\\sin x\\cos x \\)。</div>' +
            '<div class="fml-row"><b>对数换底：</b>\\( \\log_a x=\\dfrac{\\ln x}{\\ln a} \\)。</div>'
          },
          { t: 'viz', build: 'elemFunctions', title: '五类基本初等函数的图像族', sub: '切换幂 / 指数 / 对数 / 三角 / 反三角，拖动参数滑块观察图像族的变化' },
          { t: 'card', kind: 'tip', tag: '图像记忆', title: '三类“增长速度”', html:
            '<p class="tight">当 \\( x\\to+\\infty \\) 时：\\( \\ln x \\ll x^{\\alpha}\\ (\\alpha>0) \\ll a^{x}\\ (a>1) \\ll x! \\)。这一层级关系在比较无穷大量与级数敛散时反复使用。</p>'
          }
        ],
        examples: [
          {
            no: '例 1.3', meta: '基础 · 复合函数与定义域',
            q: '设 \\( f(x)=\\sqrt{1-x} \\)，\\( g(x)=\\ln x \\)。求 \\( f[g(x)] \\) 与 \\( g[f(x)] \\) 及其定义域。',
            sol: '<p>\\( f[g(x)]=\\sqrt{1-\\ln x} \\)：需内层 \\( x>0 \\) 且 \\( 1-\\ln x\\geqslant 0 \\)，即 \\( 0<x\\leqslant\\mathrm{e} \\)，定义域 \\( (0,\\mathrm{e}] \\)。</p>' +
              '<p>\\( g[f(x)]=\\ln\\sqrt{1-x}=\\dfrac12\\ln(1-x) \\)：需 \\( 1-x>0 \\)，定义域 \\( (-\\infty,1) \\)。</p>' +
              '<p>可见 \\( f[g(x)] \\) 与 \\( g[f(x)] \\) 一般不同，且定义域由内层值域含于外层定义域共同决定。</p>'
          },
          {
            no: '例 1.4', meta: '综合 · 奇偶性与周期性',
            q: '判断 \\( f(x)=\\sin x+\\cos 2x \\) 是否为周期函数；若 \\( g(x) \\) 以 2 为周期，判断 \\( g(3x+1) \\) 的周期。',
            sol: '<p>\\( \\sin x \\) 的周期为 \\( 2\\pi \\)，\\( \\cos 2x \\) 的周期为 \\( \\pi \\)，二者公共周期为 \\( 2\\pi \\)，故 \\( f \\) 以 \\( 2\\pi \\) 为周期。</p>' +
              '<p>若 \\( g \\) 以 \\( T=2 \\) 为周期，则 \\( g(ax+b) \\) 以 \\( T/|a| \\) 为周期，故 \\( g(3x+1) \\) 的周期为 \\( 2/3 \\)。</p>'
          }
        ],
        pitfalls: [
          '初等函数在其定义区间内连续，但“定义区间”不等于“定义域”（定义域可能是多个区间之并）。',
          '分段函数一般不是初等函数。',
          '\\( y=x^2 \\) 在 \\( \\mathbb{R} \\) 上不是单调函数，“单调性必须指明区间”。'
        ]
      },

      /* ---------------- 1.3 ---------------- */
      {
        id: 'ch1-s3', num: '1.3', title: '极限的概念与性质',
        lead: '大纲要求：理解极限的概念，理解左极限与右极限以及它们与极限存在的关系。',
        blocks: [
          { t: 'h3', idx: '①', text: '数列极限的 ε–N 定义' },
          { t: 'card', kind: 'def', tag: '定义', title: '数列极限', html:
            '<p class="tight">\\( \\lim\\limits_{n\\to\\infty}x_n=a \\)：\\( \\forall\\varepsilon>0,\\ \\exists N>0 \\)，当 \\( n>N \\) 时，\\( |x_n-a|<\\varepsilon \\)。</p>' +
            '<p class="tight">几何意义：任意给定的 \\( \\varepsilon \\) 邻域 \\( (a-\\varepsilon,a+\\varepsilon) \\) 之外，数列至多有有限项。</p>'
          },
          { t: 'h3', idx: '②', text: '函数极限与单侧极限' },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\lim\\limits_{x\\to x_0}f(x)=A \\iff \\lim\\limits_{x\\to x_0^-}f(x)=\\lim\\limits_{x\\to x_0^+}f(x)=A \\)</div>' +
            '<div class="fml-row">\\( \\lim\\limits_{x\\to\\infty}f(x)=A \\iff \\lim\\limits_{x\\to-\\infty}f(x)=\\lim\\limits_{x\\to+\\infty}f(x)=A \\)</div>'
          },
          { t: 'viz', build: 'limitExplorer', title: '极限过程可视化', sub: '拖动 x，观察函数值趋近与两个重要极限' },
          { t: 'h3', idx: '③', text: '极限的性质' },
          { t: 'table', head: ['性质', '内容'], rows: [
            ['唯一性', '极限存在则唯一'],
            ['局部有界性', '\\( \\lim\\limits_{x\\to x_0}f(x)=A \\) ⇒ \\( f \\) 在 \\( x_0 \\) 某去心邻域有界'],
            ['局部保号性', '\\( A>0 \\) ⇒ 某邻域内 \\( f(x)>0 \\)'],
            ['保序性', '\\( f(x)\\leqslant g(x) \\) 且极限均存在 ⇒ \\( A\\leqslant B \\)']
          ]},
          { t: 'card', kind: 'warn', tag: '易错', title: '极限存在的条件', html:
            '<p class="tight">\\( \\lim\\limits_{x\\to x_0}f(x) \\) 存在与 \\( f(x_0) \\) 是否有定义、等于多少<b>无关</b>。极限考察的是 \\( x\\to x_0 \\) 但 \\( x\\neq x_0 \\) 的过程。</p>'
          }
        ],
        examples: [
          {
            no: '例 1.3', meta: '单侧极限',
            q: '设 \\( f(x)=\\begin{cases}x-1,&x<0\\\\ x^2,&x\\geqslant 0\\end{cases} \\)，讨论 \\( \\lim\\limits_{x\\to 0}f(x) \\) 是否存在。',
            sol: '<p>\\( \\lim\\limits_{x\\to 0^-}f(x)=\\lim\\limits_{x\\to 0^-}(x-1)=-1 \\)，\\( \\lim\\limits_{x\\to 0^+}f(x)=\\lim\\limits_{x\\to 0^+}x^2=0 \\)。</p><p>左右极限不等，故 \\( \\lim\\limits_{x\\to 0}f(x) \\) <b>不存在</b>（为跳跃间断点）。</p>'
          }
        ],
        pitfalls: [
          '左右极限存在且相等是极限存在的充要条件，缺一不可。',
          '局部保号性要求极限存在：不能由 \\( f(x)>0 \\) 反推出极限存在。',
          '“极限存在”与“函数值存在”是两回事。'
        ]
      },

      /* ---------------- 1.4 ---------------- */
      {
        id: 'ch1-s4', num: '1.4', title: '极限的运算法则与存在准则',
        lead: '大纲要求：掌握极限的性质与四则运算、两个准则，掌握两个重要极限与等价无穷小求极限。',
        blocks: [
          { t: 'h3', idx: '①', text: '四则运算法则与常用方法' },
          { t: 'fml', html:
            '<div class="fml-row">若 \\( \\lim f=A,\\ \\lim g=B \\)，则 \\( \\lim(f\\pm g)=A\\pm B,\\ \\lim(fg)=AB,\\ \\lim\\dfrac{f}{g}=\\dfrac{A}{B}\\ (B\\neq 0) \\)。</div>' +
            '<div class="fml-row">\\( \\dfrac{0}{0} \\)、\\( \\dfrac{\\infty}{\\infty} \\) 等未定式需先变形：因式分解、有理化、通分、等价替换。</div>'
          },
          { t: 'h3', idx: '②', text: '两个准则与两个重要极限' },
          { t: 'card', kind: 'key', tag: '必记', title: '两个准则', html:
            '<ul class="none"><li><b>夹逼准则</b>：\\( g(x)\\leqslant f(x)\\leqslant h(x) \\) 且 \\( \\lim g=\\lim h=A \\) ⇒ \\( \\lim f=A \\)；</li>' +
            '<li><b>单调有界准则</b>：单调有界数列必有极限（用于递推数列）。</li></ul>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>第一个重要极限：</b>\\( \\lim\\limits_{x\\to 0}\\dfrac{\\sin x}{x}=1 \\)（\\( \\dfrac{0}{0} \\) 型）</div>' +
            '<div class="fml-row"><b>第二个重要极限：</b>\\( \\lim\\limits_{x\\to\\infty}\\left(1+\\dfrac{1}{x}\\right)^x=\\mathrm{e} \\)，或 \\( \\lim\\limits_{x\\to 0}(1+x)^{1/x}=\\mathrm{e} \\)</div>'
          },
          { t: 'viz', build: 'limitExplorer', title: '两个重要极限的数值逼近', sub: '切换函数，观察 x 变化时函数的趋近过程' },
          { t: 'h3', idx: '③', text: '无穷小与无穷大' },
          { t: 'table', head: ['关系', '说明'], rows: [
            ['无穷小', '\\( \\lim f(x)=0 \\)；0 是唯一的常数无穷小'],
            ['无穷大', '\\( \\forall M>0,\\ \\exists\\delta,\\ |f(x)|>M \\)；\\( \\infty \\) 不是数'],
            ['倒数关系', '在自变量的同一变化过程中，若 \\( f \\) 为无穷大，则 \\( 1/f \\) 为无穷小（反之需 \\( f\\neq 0 \\)）']
          ]},
          { t: 'h3', idx: '④', text: '无穷小的比较与等价无穷小' },
          { t: 'fml', html:
            '<div class="fml-row">设 \\( \\alpha,\\beta \\) 为同一过程的无穷小，\\( \\lim\\dfrac{\\beta}{\\alpha}=l \\)：\\( l=0 \\) 高阶；\\( l=\\infty \\) 低阶；\\( l=c\\neq 0 \\) 同阶；\\( l=1 \\) 等价 \\( (\\alpha\\sim\\beta) \\)。</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '常用等价无穷小（x → 0）', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( \\sin x\\sim x,\\quad \\tan x\\sim x,\\quad \\arcsin x\\sim x,\\quad \\arctan x\\sim x \\)</div>' +
            '<div class="fml-row">\\( 1-\\cos x\\sim \\dfrac{x^2}{2},\\quad \\ln(1+x)\\sim x,\\quad \\mathrm{e}^x-1\\sim x \\)</div>' +
            '<div class="fml-row">\\( (1+x)^{\\alpha}-1\\sim \\alpha x,\\quad x-\\sin x\\sim \\dfrac{x^3}{6},\\quad \\tan x-x\\sim \\dfrac{x^3}{3} \\)</div>' +
            '<div class="fml-row">\\( a^x-1\\sim x\\ln a,\\quad 1-\\cos^{\\alpha}x\\sim \\dfrac{\\alpha x^2}{2} \\)</div>' +
            '</div>'
          },
          { t: 'viz', build: 'infinityCompare', title: '无穷小的阶', sub: '观察不同无穷小与 x 的比值极限' },
          { t: 'card', kind: 'warn', tag: '注意', title: '等价替换的条件', html:
            '<p class="tight">等价无穷小代换一般只用于<b>乘除</b>；在加减中只有在“误差可忽略”时才可代换（通常需知道更高阶项）。例如 \\( \\dfrac{\\tan x-\\sin x}{x^3} \\) 中把二者都换成 \\( x \\) 会得到 0，正确答案是 \\( \\dfrac{1}{2} \\)。</p>'
          }
        ],
        examples: [
          {
            no: '例 1.4', meta: '重要极限',
            q: '求 \\( \\lim\\limits_{x\\to 0}\\dfrac{\\tan x-\\sin x}{x^3} \\)。',
            sol: '<p>通分：\\( \\tan x-\\sin x=\\sin x\\left(\\dfrac{1}{\\cos x}-1\\right)=\\sin x\\cdot\\dfrac{1-\\cos x}{\\cos x} \\)。</p>' +
              '<p>原式 \\( =\\lim\\limits_{x\\to 0}\\dfrac{\\sin x}{x}\\cdot\\dfrac{1-\\cos x}{x^2}\\cdot\\dfrac{1}{\\cos x}=1\\cdot\\dfrac12\\cdot 1=\\dfrac12 \\)。</p>'
          },
          {
            no: '例 1.5', meta: '幂指函数',
            q: '求 \\( \\lim\\limits_{x\\to\\infty}\\left(\\dfrac{x+1}{x-1}\\right)^{x} \\)。',
            sol: '<p>写成 \\( \\left(1+\\dfrac{2}{x-1}\\right)^{x} \\)。令 \\( t=\\dfrac{x-1}{2}\\to\\infty \\)，则 \\( x=2t+1 \\)。</p>' +
              '<p>原式 \\( =\\lim\\limits_{t\\to\\infty}\\left(1+\\dfrac1t\\right)^{2t+1}=\\mathrm{e}^2 \\)。</p>'
          }
        ],
        pitfalls: [
          '先判断类型再动手：\\( 1^{\\infty} \\) 型常用“\\( \\mathrm{e}^{\\ln} \\)”或第二个重要极限处理。',
          '等价无穷小在加减中慎用，最稳妥的做法是泰勒展开。',
          '无穷大与无穷小是“变量”不是“数”，不能参与常规四则运算。'
        ]
      },

      /* ---------------- 1.5 ---------------- */
      {
        id: 'ch1-s5', num: '1.5', title: '函数的连续性与间断点',
        lead: '大纲要求：理解连续性（含左右连续），会判别间断点类型；理解闭区间上连续函数的性质并会应用。',
        blocks: [
          { t: 'h3', idx: '①', text: '连续的定义' },
          { t: 'fml', html:
            '<div class="fml-row">\\( f \\) 在 \\( x_0 \\) 连续 \\( \\iff \\lim\\limits_{x\\to x_0}f(x)=f(x_0) \\iff \\lim\\limits_{\\Delta x\\to 0}\\Delta y=0 \\)</div>' +
            '<div class="fml-row">等价于：\\( \\lim\\limits_{x\\to x_0^-}f(x)=\\lim\\limits_{x\\to x_0^+}f(x)=f(x_0) \\)（左连续 + 右连续）</div>'
          },
          { t: 'viz', build: 'continuityTypes', title: '间断点的四种类型', sub: '切换类型观察图像特征' },
          { t: 'h3', idx: '②', text: '间断点的分类' },
          { t: 'table', head: ['类型', '特征', '例子'], rows: [
            ['可去间断点', '左右极限存在且相等，但不等于函数值或无定义', '\\( f(x)=\\dfrac{\\sin x}{x} \\) 在 \\( x=0 \\)'],
            ['跳跃间断点', '左右极限都存在但不相等', '分段函数在分界点'],
            ['无穷间断点', '至少一侧极限为无穷大', '\\( \\dfrac{1}{x} \\) 在 \\( x=0 \\)'],
            ['振荡间断点', '极限不存在且不趋于无穷', '\\( \\sin\\dfrac{1}{x} \\) 在 \\( x=0 \\)']
          ]},
          { t: 'card', kind: 'key', tag: '必记', title: '第一类与第二类', html:
            '<p class="tight"><b>第一类间断点</b>：左右极限都存在的间断点（可去、跳跃）；<b>第二类间断点</b>：至少一侧极限不存在（无穷、振荡）。</p>'
          },
          { t: 'h3', idx: '③', text: '闭区间上连续函数的性质' },
          { t: 'card', kind: 'def', tag: '定理', title: '三大性质', html:
            '<ul class="none">' +
            '<li><b>有界性定理</b>：\\( f\\in C[a,b] \\) ⇒ \\( f \\) 在 \\( [a,b] \\) 上有界；</li>' +
            '<li><b>最值定理</b>：\\( f\\in C[a,b] \\) ⇒ \\( f \\) 在 \\( [a,b] \\) 上必取到最大值与最小值；</li>' +
            '<li><b>介值定理</b>：\\( f\\in C[a,b] \\)，\\( \\mu \\) 介于 \\( f(a),f(b) \\) 之间 ⇒ \\( \\exists\\xi\\in[a,b],\\ f(\\xi)=\\mu \\)；</li>' +
            '<li><b>零点定理</b>（介值定理特例）：\\( f(a)f(b)<0 \\) ⇒ \\( \\exists\\xi\\in(a,b),\\ f(\\xi)=0 \\)。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '零点定理证明题', html:
            '<p class="tight">证明方程根的存在性，标准套路：构造函数 \\( F(x) \\) → 找两点使 \\( F \\) 异号 → 用零点定理。若需证明根的唯一性，再补一步“\\( F\'(x)>0 \\) 单调”。</p>'
          }
        ],
        examples: [
          {
            no: '例 1.6', meta: '间断点判别',
            q: '求 \\( f(x)=\\dfrac{x^2-1}{x^2-3x+2} \\) 的间断点并分类。',
            sol: '<p>分母零点：\\( x=1,2 \\)。\\( x=1 \\) 时约去公因子后极限存在（\\( \\lim\\limits_{x\\to 1}\\dfrac{x+1}{x-2}=-2 \\)），为<b>可去间断点</b>。</p>' +
              '<p>\\( x=2 \\) 时 \\( \\lim\\limits_{x\\to 2}\\dfrac{x+1}{x-2}=\\infty \\)，为<b>无穷间断点</b>（第二类）。</p>'
          },
          {
            no: '例 1.7', meta: '零点定理',
            q: '证明方程 \\( x=\\mathrm{e}^{x-2} \\) 在 \\( (0,2) \\) 内至少有一根。',
            sol: '<p>令 \\( F(x)=x-\\mathrm{e}^{x-2} \\)，\\( F \\) 在 \\( [0,2] \\) 上连续。</p>' +
              '<p>\\( F(0)=-\\mathrm{e}^{-2}<0 \\)，\\( F(2)=2-1=1>0 \\)，由零点定理，\\( \\exists\\xi\\in(0,2) \\) 使 \\( F(\\xi)=0 \\)，即方程在 \\( (0,2) \\) 内至少有一根。</p>'
          }
        ],
        pitfalls: [
          '“连续”要求三件事同时成立：有定义、极限存在、二者相等。',
          '可去间断点可以补充或修改定义使其连续；跳跃、无穷、振荡不行。',
          '闭区间上连续函数的性质依赖“闭区间”与“连续”两个条件，缺一不可。'
        ]
      }
    ]
  };
})(window);
