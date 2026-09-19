/* ============================================================
   ch2.js — 第二章 一元函数微分学
   覆盖 2026 大纲「二、一元函数微分学」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH2 = {
    id: 'ch2', no: '二', title: '一元函数微分学',
    subtitle: '导数刻画瞬时变化率与切线斜率，中值定理架起函数与导数的桥梁——微分学是研究函数性态最锋利的工具。',
    tags: ['导数', '微分', '可导与连续', '切线法线', '复合求导', '隐函数求导', '参数方程求导', '高阶导数', '中值定理', '泰勒公式', '洛必达', '极值', '凹凸性', '渐近线', '曲率'],
    sections: [

      /* ---------------- 2.1 ---------------- */
      {
        id: 'ch2-s1', num: '2.1', title: '导数与微分的概念',
        lead: '大纲要求：理解导数和微分的概念及导数与微分的关系，理解导数的几何意义，会求平面曲线的切线方程和法线方程，了解导数的物理意义，理解函数的可导性与连续性之间的关系。',
        blocks: [
          { t: 'h3', idx: '①', text: '导数的定义' },
          { t: 'card', kind: 'def', tag: '定义', title: '导数（瞬时变化率）', html:
            '<p class="tight">设 \\( y=f(x) \\) 在点 \\( x_0 \\) 的某邻域内有定义，给自变量增量 \\( \\Delta x\\neq 0 \\)，记函数增量 \\( \\Delta y=f(x_0+\\Delta x)-f(x_0) \\)。若极限</p>' +
            '<div class="fml">\\( f^{\\prime}(x_0)=\\lim\\limits_{\\Delta x\\to 0}\\dfrac{\\Delta y}{\\Delta x}=\\lim\\limits_{x\\to x_0}\\dfrac{f(x)-f(x_0)}{x-x_0} \\)</div>' +
            '<p class="tight">存在，则称 \\( f \\) 在 \\( x_0 \\) 处<b>可导</b>，称该极限为 \\( f \\) 在 \\( x_0 \\) 处的<b>导数</b>，也记作 \\( y^{\\prime}\\Big|_{x=x_0} \\)、\\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}\\Big|_{x=x_0} \\)。</p>' +
            '<p class="tight">若极限不存在则称 \\( f \\) 在 \\( x_0 \\) 不可导；若极限为无穷大，也说“导数为无穷大”，此时曲线在该点有铅直切线。导函数 \\( f^{\\prime}(x) \\) 是 \\( x \\) 的函数。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>左导数：</b>\\( f^{\\prime}_{-}(x_0)=\\lim\\limits_{x\\to x_0^{-}}\\dfrac{f(x)-f(x_0)}{x-x_0} \\)，<b>右导数：</b>\\( f^{\\prime}_{+}(x_0)=\\lim\\limits_{x\\to x_0^{+}}\\dfrac{f(x)-f(x_0)}{x-x_0} \\)</div>' +
            '<div class="fml-row"><b>可导的充要条件：</b>\\( f^{\\prime}(x_0) \\) 存在 \\( \\iff f^{\\prime}_{-}(x_0)=f^{\\prime}_{+}(x_0) \\)</div>' +
            '<div class="fml-row"><b>等价形式：</b>\\( f^{\\prime}(x_0)=\\lim\\limits_{h\\to 0}\\dfrac{f(x_0+h)-f(x_0)}{h}=\\lim\\limits_{\\Delta x\\to 0}\\dfrac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x} \\)</div>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '什么时候必须用定义求导', html:
            '<p class="tight">以下三种情形<b>必须</b>用导数定义：① 分段函数在分界点；② 抽象函数 \\( f \\) 只给出函数值或不等式；③ 判断 \\( f^{\\prime}(x_0) \\) 是否存在（左右导数）。</p>'
          },
          { t: 'h3', idx: '②', text: '导数的几何意义与物理意义' },
          { t: 'card', kind: 'key', tag: '必记', title: '切线与法线方程', html:
            '<p class="tight">曲线 \\( y=f(x) \\) 在点 \\( (x_0,f(x_0)) \\) 处的切线斜率为 \\( k=f^{\\prime}(x_0) \\)：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>切线：</b>\\( y-f(x_0)=f^{\\prime}(x_0)(x-x_0) \\)</div>' +
            '<div class="fml-row"><b>法线：</b>\\( y-f(x_0)=-\\dfrac{1}{f^{\\prime}(x_0)}\\,(x-x_0)\\quad\\big(f^{\\prime}(x_0)\\neq 0\\big) \\)</div>' +
            '</div>' +
            '<p class="tight">若 \\( f^{\\prime}(x_0)=0 \\)：切线水平 \\( y=f(x_0) \\)，法线铅直 \\( x=x_0 \\)；若 \\( f^{\\prime}(x_0)=\\infty \\)：切线铅直。</p>'
          },
          { t: 'viz', build: 'tangentDerivative', title: '割线趋近切线', sub: '拖动 Δx 与切点，观察平均变化率趋于瞬时变化率' },
          { t: 'list', items: [
            '<b>几何意义</b>：\\( f^{\\prime}(x_0) \\) 是曲线 \\( y=f(x) \\) 在 \\( (x_0,f(x_0)) \\) 处切线的斜率，反映曲线在该点的倾斜程度；',
            '<b>物理意义</b>：位移 \\( s(t) \\) 对时间的导数是瞬时速度，速度的导数是加速度；电流是电荷量对时间的导数；物体温度对位置的导数是温度梯度；',
            '<b>用导数描述物理量</b>：凡“单位自变量的改变所引起的因变量改变”都可以用导数刻画，如线密度、比热、人口增长率等。'
          ]},
          { t: 'h3', idx: '③', text: '可导性与连续性的关系' },
          { t: 'card', kind: 'thm', tag: '定理', title: '可导必连续', html:
            '<p class="tight">若 \\( f \\) 在 \\( x_0 \\) 处可导，则 \\( f \\) 在 \\( x_0 \\) 处必连续；反之，连续不一定可导。</p>' +
            '<p class="tight"><b>证明思路：</b>\\( \\Delta y=\\dfrac{\\Delta y}{\\Delta x}\\cdot\\Delta x\\to f^{\\prime}(x_0)\\cdot 0=0 \\)，即 \\( \\lim\\limits_{\\Delta x\\to 0}\\Delta y=0 \\)。</p>'
          },
          { t: 'table', head: ['关系', '结论', '典型反例'], rows: [
            ['可导 \\( \\Rightarrow \\) 连续', '成立', '——'],
            ['连续 \\( \\Rightarrow \\) 可导', '不成立', '\\( y=|x| \\) 在 \\( x=0 \\)（尖点）'],
            ['不连续 \\( \\Rightarrow \\) 不可导', '成立（逆否命题）', '——'],
            ['连续但切线铅直', '不可导（导数为 \\( \\infty \\)）', '\\( y=\\sqrt[3]{x} \\) 在 \\( x=0 \\)']
          ]},
          { t: 'h3', idx: '④', text: '微分的概念与一阶微分形式不变性' },
          { t: 'card', kind: 'def', tag: '定义', title: '微分（线性主部）', html:
            '<p class="tight">若 \\( \\Delta y=A\\,\\Delta x+o(\\Delta x)\\ (\\Delta x\\to 0) \\)，其中 \\( A \\) 与 \\( \\Delta x \\) 无关，则称 \\( f \\) 在 \\( x_0 \\) 处<b>可微</b>，\\( A\\,\\Delta x \\) 称为 \\( f \\) 在 \\( x_0 \\) 处的<b>微分</b>，记作 \\( \\mathrm{d}y \\)。</p>' +
            '<div class="fml">\\( \\mathrm{d}y=f^{\\prime}(x_0)\\,\\Delta x=f^{\\prime}(x_0)\\,\\mathrm{d}x,\\qquad \\Delta y=\\mathrm{d}y+o(\\Delta x) \\)</div>' +
            '<p class="tight"><b>可微 \\( \\iff \\) 可导</b>，且 \\( A=f^{\\prime}(x_0) \\)。函数在 \\( x_0 \\) 的微分是函数增量的线性主部。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '一阶微分形式不变性', html:
            '<p class="tight">设 \\( y=f(u) \\) 可微：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( u \\) 为自变量时：\\( \\mathrm{d}y=f^{\\prime}(u)\\,\\mathrm{d}u \\)</div>' +
            '<div class="fml-row">\\( u=\\varphi(x) \\) 为中间变量时：\\( \\mathrm{d}y=f^{\\prime}(u)\\,\\varphi^{\\prime}(x)\\,\\mathrm{d}x=f^{\\prime}(u)\\,\\mathrm{d}u \\)</div>' +
            '</div>' +
            '<p class="tight">即无论 \\( u \\) 是自变量还是中间变量，微分形式 \\( \\mathrm{d}y=f^{\\prime}(u)\\,\\mathrm{d}u \\) 都不变。这一性质是凑微分法（第一类换元法）的理论基础。</p>'
          },
          { t: 'table', head: ['对比项', '导数', '微分'], rows: [
            ['记号', '\\( f^{\\prime}(x_0) \\)、\\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x} \\)', '\\( \\mathrm{d}y=f^{\\prime}(x_0)\\,\\mathrm{d}x \\)'],
            ['本质', '函数在一点的瞬时变化率（一个数）', '函数增量的线性主部（\\( \\mathrm{d}x \\) 的线性函数）'],
            ['关系', '可导 \\( \\iff \\) 可微', '\\( f^{\\prime}(x_0)=\\dfrac{\\mathrm{d}y}{\\mathrm{d}x} \\)'],
            ['误差', '——', '\\( \\Delta y-\\mathrm{d}y=o(\\Delta x) \\)，当 \\( |\\Delta x| \\) 很小时 \\( \\Delta y\\approx\\mathrm{d}y \\)']
          ]}
        ],
        examples: [
          {
            no: '例 2.1', meta: '基础 · 用定义求导',
            q: '设 \\( f(x)=\\begin{cases} x^{2}\\sin\\dfrac{1}{x}, & x\\neq 0 \\\\ 0, & x=0 \\end{cases} \\)，求 \\( f^{\\prime}(0) \\)。',
            sol: '<p>在 \\( x=0 \\) 处只能用定义：</p>' +
              '<p>\\( f^{\\prime}(0)=\\lim\\limits_{x\\to 0}\\dfrac{f(x)-f(0)}{x-0}=\\lim\\limits_{x\\to 0}\\dfrac{x^{2}\\sin\\frac{1}{x}}{x}=\\lim\\limits_{x\\to 0}x\\sin\\dfrac{1}{x} \\)。</p>' +
              '<p>由于 \\( \\left|x\\sin\\frac{1}{x}\\right|\\leqslant |x|\\to 0 \\)，由夹逼准则得 \\( f^{\\prime}(0)=0 \\)。</p>' +
              '<p>注：当 \\( x\\neq 0 \\) 时 \\( f^{\\prime}(x)=2x\\sin\\dfrac{1}{x}-\\cos\\dfrac{1}{x} \\)，它在 \\( x\\to 0 \\) 时无极限，故 \\( f^{\\prime}(x) \\) 在 \\( 0 \\) 处不连续，但 \\( f^{\\prime}(0) \\) 仍存在。</p>'
          },
          {
            no: '例 2.2', meta: '基础 · 分段点的连续性与可导性',
            q: '设 \\( f(x)=\\begin{cases} x^{2}, & x\\geqslant 0 \\\\ \\sin x, & x\\lt 0 \\end{cases} \\)，讨论 \\( f \\) 在 \\( x=0 \\) 处的连续性与可导性。',
            sol: '<p><b>连续性：</b>\\( f(0)=0 \\)，\\( \\lim\\limits_{x\\to 0^{-}}f(x)=\\lim\\limits_{x\\to 0^{-}}\\sin x=0 \\)，\\( \\lim\\limits_{x\\to 0^{+}}f(x)=\\lim\\limits_{x\\to 0^{+}}x^{2}=0 \\)，故 \\( \\lim\\limits_{x\\to 0}f(x)=f(0)=0 \\)，\\( f \\) 在 \\( 0 \\) 处连续。</p>' +
              '<p><b>可导性：</b>\\( f^{\\prime}_{-}(0)=\\lim\\limits_{x\\to 0^{-}}\\dfrac{\\sin x-0}{x}=1 \\)，\\( f^{\\prime}_{+}(0)=\\lim\\limits_{x\\to 0^{+}}\\dfrac{x^{2}-0}{x}=0 \\)。</p>' +
              '<p>左右导数存在但不相等，故 \\( f^{\\prime}(0) \\) 不存在，即 \\( f \\) 在 \\( 0 \\) 处连续但不可导。</p>'
          },
          {
            no: '例 2.3', meta: '基础 · 切线与法线',
            q: '求曲线 \\( y=x\\ln x \\) 在 \\( x=1 \\) 处的切线方程与法线方程。',
            sol: '<p>切点：\\( y(1)=1\\cdot\\ln 1=0 \\)，即 \\( (1,0) \\)。</p>' +
              '<p>求导：\\( y^{\\prime}=\\ln x+x\\cdot\\dfrac{1}{x}=\\ln x+1 \\)，故切线斜率 \\( k=y^{\\prime}(1)=1 \\)。</p>' +
              '<p><b>切线：</b>\\( y-0=1\\cdot(x-1) \\)，即 \\( y=x-1 \\)。</p>' +
              '<p><b>法线：</b>\\( y-0=-1\\cdot(x-1) \\)，即 \\( y=1-x \\)。</p>'
          }
        ],
        pitfalls: [
          '分段函数在分界点的可导性必须用定义（左、右导数）判断，不能对两段分别求导后代入分界点。',
          '\\( f^{\\prime}(x_0) \\) 存在要求左右导数都存在且相等；区间端点处只有单侧导数，不能要求双侧可导。',
          '\\( \\Delta y \\) 与 \\( \\mathrm{d}y \\) 不同：\\( \\Delta y=\\mathrm{d}y+o(\\Delta x) \\)，\\( \\mathrm{d}y \\) 是 \\( \\Delta x \\) 的线性函数，只能用 \\( \\mathrm{d}y\\approx\\Delta y \\) 近似。',
          '连续是可导的必要条件而非充分条件：\\( y=|x| \\)、\\( y=\\sqrt[3]{x} \\) 在 \\( 0 \\) 处都连续但不可导。',
          '切线斜率为 0 时法线为铅直线 \\( x=x_0 \\)，不能套用法线公式 \\( -\\dfrac{1}{f^{\\prime}(x_0)} \\)。'
        ]
      },

      /* ---------------- 2.2 ---------------- */
      {
        id: 'ch2-s2', num: '2.2', title: '求导法则与高阶导数',
        lead: '大纲要求：掌握导数的四则运算法则和复合函数的求导法则，掌握基本初等函数的导数公式；会求分段函数、隐函数、参数方程所确定的函数以及反函数的导数；了解高阶导数的概念，会求简单函数的高阶导数。',
        blocks: [
          { t: 'h3', idx: '①', text: '四则运算法则与基本初等函数的导数公式' },
          { t: 'fml', html:
            '<div class="fml-row">\\( (u\\pm v)^{\\prime}=u^{\\prime}\\pm v^{\\prime},\\qquad (uv)^{\\prime}=u^{\\prime}v+uv^{\\prime} \\)</div>' +
            '<div class="fml-row">\\( \\left(\\dfrac{u}{v}\\right)^{\\prime}=\\dfrac{u^{\\prime}v-uv^{\\prime}}{v^{2}}\\quad (v\\neq 0),\\qquad (Cu)^{\\prime}=Cu^{\\prime} \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '基本导数公式表', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( (C)^{\\prime}=0,\\qquad (x^{\\mu})^{\\prime}=\\mu x^{\\mu-1} \\)</div>' +
            '<div class="fml-row">\\( (a^{x})^{\\prime}=a^{x}\\ln a,\\qquad (\\mathrm{e}^{x})^{\\prime}=\\mathrm{e}^{x} \\)</div>' +
            '<div class="fml-row">\\( (\\log_a x)^{\\prime}=\\dfrac{1}{x\\ln a},\\qquad (\\ln x)^{\\prime}=\\dfrac{1}{x} \\)</div>' +
            '<div class="fml-row">\\( (\\sin x)^{\\prime}=\\cos x,\\qquad (\\cos x)^{\\prime}=-\\sin x \\)</div>' +
            '<div class="fml-row">\\( (\\tan x)^{\\prime}=\\sec^{2}x,\\qquad (\\cot x)^{\\prime}=-\\csc^{2}x \\)</div>' +
            '<div class="fml-row">\\( (\\sec x)^{\\prime}=\\sec x\\tan x,\\qquad (\\csc x)^{\\prime}=-\\csc x\\cot x \\)</div>' +
            '<div class="fml-row">\\( (\\arcsin x)^{\\prime}=\\dfrac{1}{\\sqrt{1-x^{2}}},\\qquad (\\arccos x)^{\\prime}=-\\dfrac{1}{\\sqrt{1-x^{2}}} \\)</div>' +
            '<div class="fml-row">\\( (\\arctan x)^{\\prime}=\\dfrac{1}{1+x^{2}},\\qquad (\\operatorname{arccot} x)^{\\prime}=-\\dfrac{1}{1+x^{2}} \\)</div>' +
            '<div class="fml-row">\\( (\\sinh x)^{\\prime}=\\cosh x,\\qquad (\\cosh x)^{\\prime}=\\sinh x \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '②', text: '复合函数与反函数的求导法则' },
          { t: 'card', kind: 'thm', tag: '定理', title: '复合函数求导（链式法则）', html:
            '<p class="tight">设 \\( y=f(u) \\) 在 \\( u \\) 处可导，\\( u=\\varphi(x) \\) 在 \\( x \\) 处可导，则复合函数 \\( y=f[\\varphi(x)] \\) 在 \\( x \\) 处可导，且</p>' +
            '<div class="fml">\\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\dfrac{\\mathrm{d}y}{\\mathrm{d}u}\\cdot\\dfrac{\\mathrm{d}u}{\\mathrm{d}x}=f^{\\prime}[\\varphi(x)]\\,\\varphi^{\\prime}(x) \\)</div>' +
            '<p class="tight">多层复合“层层剥皮”，逐层相乘，注意不要遗漏内层函数的导数。</p>'
          },
          { t: 'viz', build: 'derivativeRules', title: '求导法则：链式法则分层与乘积法则', sub: '逐步播放链式法则的“外层 → 内层”求导链，并用矩形面积增量验证 (uv)′ = u′v + uv′' },
          { t: 'fml', html:
            '<div class="fml-row"><b>反函数求导：</b>若 \\( y=f(x) \\) 与 \\( x=f^{-1}(y) \\) 互为反函数且 \\( f^{\\prime}(x)\\neq 0 \\)，则 \\( [f^{-1}(y)]^{\\prime}=\\dfrac{1}{f^{\\prime}(x)} \\)，即 \\( \\dfrac{\\mathrm{d}x}{\\mathrm{d}y}=\\dfrac{1}{\\dfrac{\\mathrm{d}y}{\\mathrm{d}x}} \\)</div>' +
            '<div class="fml-row"><b>推广：</b>\\( \\left(\\arcsin x\\right)^{\\prime}=\\dfrac{1}{\\left(\\sin y\\right)^{\\prime}}=\\dfrac{1}{\\cos y}=\\dfrac{1}{\\sqrt{1-x^{2}}} \\)</div>'
          },
          { t: 'card', kind: 'tip', tag: '技巧', title: '对数求导法', html:
            '<p class="tight">对幂指函数 \\( y=u(x)^{v(x)}\\ (u(x)\\gt 0) \\) 或多个因子连乘、连除、乘方的函数，先取对数再求导：</p>' +
            '<div class="fml">\\( \\ln y=v(x)\\ln u(x)\\ \\Rightarrow\\ \\dfrac{y^{\\prime}}{y}=v^{\\prime}\\ln u+v\\cdot\\dfrac{u^{\\prime}}{u} \\)</div>' +
            '<p class="tight">从而 \\( y^{\\prime}=u^{v}\\left(v^{\\prime}\\ln u+\\dfrac{v u^{\\prime}}{u}\\right) \\)。该方法把乘除化为加减，把幂化为乘积，可大幅简化运算。</p>'
          },
          { t: 'h3', idx: '③', text: '隐函数与参数方程所确定函数的导数' },
          { t: 'card', kind: 'key', tag: '必记', title: '隐函数求导法', html:
            '<p class="tight">设 \\( y=y(x) \\) 由方程 \\( F(x,y)=0 \\) 确定，求导时把 \\( y \\) 看作 \\( x \\) 的函数，方程两边对 \\( x \\) 求导，再解出 \\( y^{\\prime} \\)。</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>一阶：</b>例 \\( x^{2}+y^{2}=1 \\Rightarrow 2x+2y\\,y^{\\prime}=0 \\Rightarrow y^{\\prime}=-\\dfrac{x}{y} \\)</div>' +
            '<div class="fml-row"><b>二阶：</b>把 \\( y^{\\prime} \\) 的表达式再对 \\( x \\) 求导，并把 \\( y^{\\prime} \\) 代入，结果含 \\( x,y \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '参数方程求导公式', html:
            '<p class="tight">设 \\( x=\\varphi(t),\\ y=\\psi(t) \\)（\\( \\varphi^{\\prime}(t)\\neq 0 \\)）：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\dfrac{\\psi^{\\prime}(t)}{\\varphi^{\\prime}(t)} \\)</div>' +
            '<div class="fml-row">\\( \\dfrac{\\mathrm{d}^{2}y}{\\mathrm{d}x^{2}}=\\dfrac{\\mathrm{d}}{\\mathrm{d}t}\\left(\\dfrac{\\psi^{\\prime}(t)}{\\varphi^{\\prime}(t)}\\right)\\Big/\\varphi^{\\prime}(t)=\\dfrac{\\psi^{\\prime\\prime}(t)\\varphi^{\\prime}(t)-\\psi^{\\prime}(t)\\varphi^{\\prime\\prime}(t)}{[\\varphi^{\\prime}(t)]^{3}} \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '④', text: '高阶导数' },
          { t: 'card', kind: 'def', tag: '定义', title: '高阶导数', html:
            '<p class="tight">若 \\( f^{\\prime}(x) \\) 仍可导，则其导数 \\( [f^{\\prime}(x)]^{\\prime}=f^{\\prime\\prime}(x) \\) 称为二阶导数；一般地，\\( n-1 \\) 阶导数的导数称为 \\( n \\) 阶导数，记作 \\( y^{(n)} \\)、\\( f^{(n)}(x) \\) 或 \\( \\dfrac{\\mathrm{d}^{n}y}{\\mathrm{d}x^{n}} \\)。</p>' +
            '<p class="tight"><b>物理意义：</b>位移的二阶导数是加速度；二阶导数也刻画函数的凹凸性（见 2.6 节）。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '常用 n 阶导数公式', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( (x^{\\mu})^{(n)}=\\mu(\\mu-1)\\cdots(\\mu-n+1)\\,x^{\\mu-n} \\)</div>' +
            '<div class="fml-row">\\( (\\mathrm{e}^{x})^{(n)}=\\mathrm{e}^{x},\\qquad (a^{x})^{(n)}=a^{x}(\\ln a)^{n} \\)</div>' +
            '<div class="fml-row">\\( (\\sin x)^{(n)}=\\sin\\left(x+\\dfrac{n\\pi}{2}\\right),\\qquad (\\cos x)^{(n)}=\\cos\\left(x+\\dfrac{n\\pi}{2}\\right) \\)</div>' +
            '<div class="fml-row">\\( (\\ln x)^{(n)}=\\dfrac{(-1)^{n-1}(n-1)!}{x^{n}},\\qquad \\left(\\dfrac{1}{ax+b}\\right)^{(n)}=\\dfrac{(-1)^{n}a^{n}n!}{(ax+b)^{n+1}} \\)</div>' +
            '</div>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>莱布尼茨（Leibniz）公式：</b>\\( (uv)^{(n)}=\\sum\\limits_{k=0}^{n}\\mathrm{C}_{n}^{k}\\,u^{(k)}\\,v^{(n-k)} \\)（其中 \\( u^{(0)}=u,\\ v^{(0)}=v \\)）</div>' +
            '<div class="fml-row">当其中一个因子为多项式时，从高阶项开始必然为 0，只需计算前几项。</div>'
          },
          { t: 'h3', idx: '⑤', text: '分段函数的导函数与不可导点' },
          { t: 'list', items: [
            '在每段内部直接用求导法则求导；在分界点用定义求左右导数；',
            '分界点左右导数都存在且相等时，\\( f^{\\prime}(x_0) \\) 存在；若一侧导数不存在或两侧不等，则不可导；',
            '导函数 \\( f^{\\prime}(x) \\) 仍可用分段函数形式表示，并注明分界点的取值。'
          ]}
        ],
        examples: [
          {
            no: '例 2.4', meta: '基础 · 复合函数求导',
            q: '设 \\( y=\\ln\\left(x+\\sqrt{1+x^{2}}\\right) \\)，求 \\( y^{\\prime} \\)。',
            sol: '<p>\\( y^{\\prime}=\\dfrac{1}{x+\\sqrt{1+x^{2}}}\\cdot\\left(1+\\dfrac{x}{\\sqrt{1+x^{2}}}\\right)=\\dfrac{1}{x+\\sqrt{1+x^{2}}}\\cdot\\dfrac{\\sqrt{1+x^{2}}+x}{\\sqrt{1+x^{2}}}=\\dfrac{1}{\\sqrt{1+x^{2}}} \\)。</p>'
          },
          {
            no: '例 2.5', meta: '综合 · 隐函数求二阶导数',
            q: '设 \\( y=y(x) \\) 由方程 \\( \\mathrm{e}^{y}+xy=\\mathrm{e} \\) 确定，求 \\( y^{\\prime}(0) \\) 与 \\( y^{\\prime\\prime}(0) \\)。',
            sol: '<p>令 \\( x=0 \\)：\\( \\mathrm{e}^{y(0)}=\\mathrm{e} \\)，故 \\( y(0)=1 \\)。</p>' +
              '<p>方程两边对 \\( x \\) 求导：\\( \\mathrm{e}^{y}y^{\\prime}+y+xy^{\\prime}=0 \\)。代入 \\( x=0,y=1 \\)：\\( \\mathrm{e}\\,y^{\\prime}(0)+1=0 \\)，得 \\( y^{\\prime}(0)=-\\dfrac{1}{\\mathrm{e}} \\)。</p>' +
              '<p>再对 \\( x \\) 求导：\\( \\mathrm{e}^{y}(y^{\\prime})^{2}+\\mathrm{e}^{y}y^{\\prime\\prime}+2y^{\\prime}+xy^{\\prime\\prime}=0 \\)。</p>' +
              '<p>代入 \\( x=0,y=1,y^{\\prime}=-\\dfrac1{\\mathrm{e}} \\)：\\( \\mathrm{e}\\cdot\\dfrac{1}{\\mathrm{e}^{2}}+\\mathrm{e}\\,y^{\\prime\\prime}(0)-\\dfrac{2}{\\mathrm{e}}=0 \\)，解得 \\( y^{\\prime\\prime}(0)=\\dfrac{1}{\\mathrm{e}^{2}} \\)。</p>'
          },
          {
            no: '例 2.6', meta: '综合 · 参数方程求导',
            q: '设 \\( x=a(t-\\sin t),\\ y=a(1-\\cos t)\\ (a\\gt 0) \\)，求 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x} \\) 与 \\( \\dfrac{\\mathrm{d}^{2}y}{\\mathrm{d}x^{2}} \\)。',
            sol: '<p>\\( \\dfrac{\\mathrm{d}x}{\\mathrm{d}t}=a(1-\\cos t),\\ \\dfrac{\\mathrm{d}y}{\\mathrm{d}t}=a\\sin t \\)，故 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\dfrac{a\\sin t}{a(1-\\cos t)}=\\dfrac{\\sin t}{1-\\cos t} \\)。</p>' +
              '<p>再对 \\( t \\) 求导：\\( \\dfrac{\\mathrm{d}}{\\mathrm{d}t}\\left(\\dfrac{\\sin t}{1-\\cos t}\\right)=\\dfrac{\\cos t(1-\\cos t)-\\sin^{2}t}{(1-\\cos t)^{2}}=\\dfrac{\\cos t-1}{(1-\\cos t)^{2}}=-\\dfrac{1}{1-\\cos t} \\)。</p>' +
              '<p>故 \\( \\dfrac{\\mathrm{d}^{2}y}{\\mathrm{d}x^{2}}=\\dfrac{-\\dfrac{1}{1-\\cos t}}{a(1-\\cos t)}=-\\dfrac{1}{a(1-\\cos t)^{2}} \\)。</p>'
          },
          {
            no: '例 2.7', meta: '提高 · 莱布尼茨公式',
            q: '设 \\( y=x^{2}\\mathrm{e}^{2x} \\)，求 \\( y^{(10)}(0) \\)。',
            sol: '<p>取 \\( u=x^{2},\\ v=\\mathrm{e}^{2x} \\)，则 \\( u^{(k)}=0\\ (k\\geqslant 3) \\)，\\( v^{(m)}=2^{m}\\mathrm{e}^{2x} \\)。</p>' +
              '<p>由莱布尼茨公式：\\( y^{(10)}=\\mathrm{C}_{10}^{0}x^{2}\\cdot 2^{10}\\mathrm{e}^{2x}+\\mathrm{C}_{10}^{1}(2x)\\cdot 2^{9}\\mathrm{e}^{2x}+\\mathrm{C}_{10}^{2}\\cdot 2\\cdot 2^{8}\\mathrm{e}^{2x} \\)。</p>' +
              '<p>令 \\( x=0 \\)，前两项均为 0，故 \\( y^{(10)}(0)=\\mathrm{C}_{10}^{2}\\cdot 2\\cdot 2^{8}=45\\cdot 2\\cdot 256=23040 \\)。</p>'
          }
        ],
        pitfalls: [
          '复合函数求导要“层层剥皮”，每层都要乘内层导数，漏乘是最常见的失分点，如 \\( (\\sin 2x)^{\\prime}=2\\cos 2x \\) 而非 \\( \\cos 2x \\)。',
          '幂指函数 \\( u(x)^{v(x)} \\) 既不是幂函数也不是指数函数，不能套用 \\( \\mu x^{\\mu-1} \\) 或 \\( a^{x}\\ln a \\)，应化为 \\( \\mathrm{e}^{v\\ln u} \\) 或用对数求导法。',
          '隐函数求导时 \\( y \\) 是 \\( x \\) 的函数：对 \\( y^{2} \\) 求导得 \\( 2y y^{\\prime} \\)；求二阶导时要把已求出的一阶导表达式代入。',
          '参数方程的二阶导数不能写成 \\( \\dfrac{\\mathrm{d}^{2}y}{\\mathrm{d}x^{2}}=\\dfrac{\\psi^{\\prime\\prime}(t)}{\\varphi^{\\prime\\prime}(t)} \\)，必须对 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x} \\) 再对 \\( t \\) 求导后除以 \\( \\varphi^{\\prime}(t) \\)。',
          '分段函数求导后，导函数在分界点处要单独验证并用等号连接，不能想当然地认为分界点可导。'
        ]
      },

      /* ---------------- 2.3 ---------------- */
      {
        id: 'ch2-s3', num: '2.3', title: '微分中值定理',
        lead: '大纲要求：理解并会用罗尔定理、拉格朗日中值定理和泰勒定理，了解并会用柯西中值定理；能利用中值定理证明等式与不等式。',
        blocks: [
          { t: 'h3', idx: '①', text: '罗尔（Rolle）定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '罗尔定理', html:
            '<p class="tight">设 \\( f \\) 满足：① 在 \\( [a,b] \\) 上连续；② 在 \\( (a,b) \\) 内可导；③ \\( f(a)=f(b) \\)，则至少存在一点 \\( \\xi\\in(a,b) \\)，使</p>' +
            '<div class="fml">\\( f^{\\prime}(\\xi)=0 \\)</div>' +
            '<p class="tight"><b>几何意义：</b>两端点等高的连续光滑曲线，必有水平切线。<b>证明要点：</b>由最值定理，\\( f \\) 在 \\( [a,b] \\) 上取到最大、最小值；若最值等于端点值则 \\( f \\) 为常数，否则最值点在内部且为极值点，由费马引理 \\( f^{\\prime}(\\xi)=0 \\)。</p>'
          },
          { t: 'h3', idx: '②', text: '拉格朗日（Lagrange）中值定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '拉格朗日中值定理', html:
            '<p class="tight">设 \\( f \\) 满足：① 在 \\( [a,b] \\) 上连续；② 在 \\( (a,b) \\) 内可导，则至少存在一点 \\( \\xi\\in(a,b) \\)，使</p>' +
            '<div class="fml">\\( f(b)-f(a)=f^{\\prime}(\\xi)(b-a)\\quad\\text{或}\\quad \\dfrac{f(b)-f(a)}{b-a}=f^{\\prime}(\\xi) \\)</div>' +
            '<p class="tight"><b>几何意义：</b>曲线弧上至少存在一点，其切线平行于连接两端点的弦。它是罗尔定理的推广（当 \\( f(a)=f(b) \\) 时退化为罗尔定理）。</p>'
          },
          { t: 'viz', build: 'tangentDerivative', title: '中值定理的几何直观', sub: '观察弦与平行切线：切点位置随曲线形状移动' },
          { t: 'card', kind: 'key', tag: '必记', title: '有限增量公式与推论', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>有限增量公式：</b>\\( f(x+\\Delta x)-f(x)=f^{\\prime}(\\xi)\\,\\Delta x \\)，其中 \\( \\xi \\) 在 \\( x \\) 与 \\( x+\\Delta x \\) 之间</div>' +
            '<div class="fml-row"><b>推论 1：</b>若在区间 \\( I \\) 上恒有 \\( f^{\\prime}(x)\\equiv 0 \\)，则 \\( f \\) 在 \\( I \\) 上为常数</div>' +
            '<div class="fml-row"><b>推论 2：</b>若在 \\( I \\) 上 \\( f^{\\prime}(x)\\equiv g^{\\prime}(x) \\)，则 \\( f(x)=g(x)+C \\)</div>' +
            '<div class="fml-row"><b>推论 3：</b>若在 \\( I \\) 上 \\( |f^{\\prime}(x)|\\leqslant M \\)，则 \\( |f(x_1)-f(x_2)|\\leqslant M|x_1-x_2| \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '③', text: '柯西（Cauchy）中值定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '柯西中值定理', html:
            '<p class="tight">设 \\( f,g \\) 满足：① 在 \\( [a,b] \\) 上连续；② 在 \\( (a,b) \\) 内可导；③ \\( g^{\\prime}(x)\\neq 0\\ (a\\lt x\\lt b) \\)，则至少存在一点 \\( \\xi\\in(a,b) \\)，使</p>' +
            '<div class="fml">\\( \\dfrac{f(b)-f(a)}{g(b)-g(a)}=\\dfrac{f^{\\prime}(\\xi)}{g^{\\prime}(\\xi)} \\)</div>' +
            '<p class="tight">条件 ③ 保证 \\( g(b)\\neq g(a) \\)，分母不为零。取 \\( g(x)=x \\) 即得拉格朗日中值定理。</p>'
          },
          { t: 'h3', idx: '④', text: '泰勒（Taylor）中值定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '带拉格朗日余项的泰勒公式', html:
            '<p class="tight">设 \\( f \\) 在包含 \\( x_0 \\) 的区间内具有 \\( n+1 \\) 阶导数，则对区间内任一点 \\( x \\)，有</p>' +
            '<div class="fml">\\( f(x)=\\sum\\limits_{k=0}^{n}\\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^{k}+\\dfrac{f^{(n+1)}(\\xi)}{(n+1)!}(x-x_0)^{n+1} \\)</div>' +
            '<p class="tight">其中 \\( \\xi \\) 介于 \\( x_0 \\) 与 \\( x \\) 之间，最后一项称为<b>拉格朗日余项</b> \\( R_n(x) \\)。当 \\( x_0=0 \\) 时称为麦克劳林（Maclaurin）公式。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>带佩亚诺余项：</b>\\( f(x)=\\sum\\limits_{k=0}^{n}\\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^{k}+o\\big((x-x_0)^{n}\\big)\\ (x\\to x_0) \\)</div>' +
            '<div class="fml-row">证明不等式、估计误差用拉格朗日余项；求极限、研究局部性态用佩亚诺余项。</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '常用麦克劳林公式（x → 0）', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( \\mathrm{e}^{x}=1+x+\\dfrac{x^{2}}{2!}+\\cdots+\\dfrac{x^{n}}{n!}+o(x^{n}) \\)</div>' +
            '<div class="fml-row">\\( \\sin x=x-\\dfrac{x^{3}}{3!}+\\dfrac{x^{5}}{5!}-\\cdots+(-1)^{k}\\dfrac{x^{2k+1}}{(2k+1)!}+o(x^{2k+1}) \\)</div>' +
            '<div class="fml-row">\\( \\cos x=1-\\dfrac{x^{2}}{2!}+\\dfrac{x^{4}}{4!}-\\cdots+(-1)^{k}\\dfrac{x^{2k}}{(2k)!}+o(x^{2k}) \\)</div>' +
            '<div class="fml-row">\\( \\ln(1+x)=x-\\dfrac{x^{2}}{2}+\\dfrac{x^{3}}{3}-\\cdots+(-1)^{n-1}\\dfrac{x^{n}}{n}+o(x^{n}) \\)</div>' +
            '<div class="fml-row">\\( (1+x)^{\\alpha}=1+\\alpha x+\\dfrac{\\alpha(\\alpha-1)}{2!}x^{2}+\\cdots+\\dfrac{\\alpha(\\alpha-1)\\cdots(\\alpha-n+1)}{n!}x^{n}+o(x^{n}) \\)</div>' +
            '<div class="fml-row">\\( \\dfrac{1}{1-x}=1+x+x^{2}+\\cdots+x^{n}+o(x^{n}) \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '⑤', text: '四大中值定理的联系与辅助函数法' },
          { t: 'table', head: ['定理', '条件', '结论', '备注'], rows: [
            ['罗尔', '连续、可导、端点值相等', '\\( f^{\\prime}(\\xi)=0 \\)', '最值定理 + 费马引理'],
            ['拉格朗日', '连续、可导', '\\( f(b)-f(a)=f^{\\prime}(\\xi)(b-a) \\)', '罗尔定理的推广'],
            ['柯西', '连续、可导、\\( g^{\\prime}\\neq 0 \\)', '\\( \\dfrac{f(b)-f(a)}{g(b)-g(a)}=\\dfrac{f^{\\prime}(\\xi)}{g^{\\prime}(\\xi)} \\)', '拉格朗日的参数推广'],
            ['泰勒', '\\( n+1 \\) 阶可导', '多项式 + 余项', '柯西定理的推广（高阶）']
          ]},
          { t: 'card', kind: 'exam', tag: '真题视角', title: '中值定理证明题的辅助函数构造', html:
            '<p class="tight">欲证含 \\( f^{\\prime}(\\xi) \\) 的等式，常把待证式“积分还原”成某个函数 \\( F \\) 的导数：</p>' +
            '<ul class="none">' +
            '<li>证 \\( f^{\\prime}(\\xi)+g^{\\prime}(\\xi)f(\\xi)=0 \\)：构造 \\( F(x)=f(x)\\mathrm{e}^{g(x)} \\)；</li>' +
            '<li>证 \\( f^{\\prime}(\\xi)=\\dfrac{f(\\xi)}{\\xi} \\)：构造 \\( F(x)=\\dfrac{f(x)}{x} \\)；</li>' +
            '<li>证 \\( \\xi f^{\\prime}(\\xi)+k f(\\xi)=0 \\)：构造 \\( F(x)=x^{k}f(x) \\)；</li>' +
            '<li>先用罗尔定理确定 \\( F \\) 的两点等值（常在端点或内部零点处取得），再用罗尔定理。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 2.8', meta: '基础 · 拉格朗日不等式',
            q: '证明：对任意实数 \\( a,b \\)，有 \\( |\\sin b-\\sin a|\\leqslant |b-a| \\)。',
            sol: '<p>当 \\( a=b \\) 时显然成立。设 \\( a\\lt b \\)，令 \\( f(x)=\\sin x \\)，\\( f \\) 在 \\( [a,b] \\) 上连续、在 \\( (a,b) \\) 内可导。</p>' +
              '<p>由拉格朗日中值定理，存在 \\( \\xi\\in(a,b) \\)，使 \\( \\sin b-\\sin a=\\cos\\xi\\,(b-a) \\)。</p>' +
              '<p>两边取绝对值：\\( |\\sin b-\\sin a|=|\\cos\\xi|\\,|b-a|\\leqslant |b-a| \\)，命题得证。</p>'
          },
          {
            no: '例 2.9', meta: '综合 · 构造辅助函数用罗尔定理',
            q: '设 \\( f(x) \\) 在 \\( [0,1] \\) 上连续、在 \\( (0,1) \\) 内可导，且 \\( f(0)=f(1)=0 \\)。证明：存在 \\( \\xi\\in(0,1) \\)，使 \\( 2\\xi f(\\xi)+\\xi^{2}f^{\\prime}(\\xi)=0 \\)。',
            sol: '<p>观察待证式可写成 \\( [x^{2}f(x)]^{\\prime}\\big|_{x=\\xi}=0 \\)，故构造辅助函数 \\( F(x)=x^{2}f(x) \\)。</p>' +
              '<p>\\( F \\) 在 \\( [0,1] \\) 上连续、在 \\( (0,1) \\) 内可导，且 \\( F(0)=0,\\ F(1)=1^{2}f(1)=0 \\)。</p>' +
              '<p>由罗尔定理，存在 \\( \\xi\\in(0,1) \\)，使 \\( F^{\\prime}(\\xi)=2\\xi f(\\xi)+\\xi^{2}f^{\\prime}(\\xi)=0 \\)，得证。</p>'
          },
          {
            no: '例 2.10', meta: '提高 · 泰勒公式证不等式',
            q: '证明：当 \\( x\\gt 0 \\) 时，\\( \\mathrm{e}^{x}\\gt 1+x+\\dfrac{x^{2}}{2} \\)。',
            sol: '<p>把 \\( \\mathrm{e}^{x} \\) 在 \\( x_0=0 \\) 处展开到二阶，带拉格朗日余项：</p>' +
              '<p>\\( \\mathrm{e}^{x}=1+x+\\dfrac{x^{2}}{2}+\\dfrac{\\mathrm{e}^{\\xi}}{6}x^{3} \\)，其中 \\( \\xi \\) 介于 \\( 0 \\) 与 \\( x \\) 之间。</p>' +
              '<p>当 \\( x\\gt 0 \\) 时 \\( \\xi\\gt 0 \\)，故 \\( \\dfrac{\\mathrm{e}^{\\xi}}{6}x^{3}\\gt 0 \\)，从而 \\( \\mathrm{e}^{x}\\gt 1+x+\\dfrac{x^{2}}{2} \\)。</p>'
          }
        ],
        pitfalls: [
          '罗尔定理的三个条件缺一不可：闭区间连续、开区间可导、端点值相等；漏掉“端点值相等”是最常见错误。',
          '中值定理只保证 \\( \\xi \\) 存在，不保证唯一；\\( \\xi \\) 一定在开区间 \\( (a,b) \\) 内，不能取在端点。',
          '柯西中值定理必须验证 \\( g^{\\prime}(x)\\neq 0 \\)，否则分母可能为零；两个函数用的是同一个 \\( \\xi \\)。',
          '泰勒公式的余项要选对：证明不等式、估计误差用拉格朗日余项并说明 \\( \\xi \\) 的范围；求极限用佩亚诺余项。',
          '用中值定理证明等式或不等式前，必须先验证函数满足定理的全部条件，并写出所构造的辅助函数。'
        ]
      },

      /* ---------------- 2.4 ---------------- */
      {
        id: 'ch2-s4', num: '2.4', title: '洛必达法则',
        lead: '大纲要求：掌握用洛必达（L’Hospital）法则求未定式极限的方法。',
        blocks: [
          { t: 'h3', idx: '①', text: '两种基本未定式' },
          { t: 'card', kind: 'thm', tag: '定理', title: '洛必达法则（0/0 型与 ∞/∞ 型）', html:
            '<p class="tight">设 \\( f,g \\) 满足：① \\( \\lim\\limits_{x\\to x_0}\\dfrac{f(x)}{g(x)} \\) 为 \\( \\dfrac{0}{0} \\) 型或 \\( \\dfrac{\\infty}{\\infty} \\) 型；② 在 \\( x_0 \\) 的某去心邻域内 \\( f^{\\prime},g^{\\prime} \\) 存在且 \\( g^{\\prime}(x)\\neq 0 \\)；③ \\( \\lim\\limits_{x\\to x_0}\\dfrac{f^{\\prime}(x)}{g^{\\prime}(x)}=A \\)（\\( A \\) 为有限数或 \\( \\infty \\)），则</p>' +
            '<div class="fml">\\( \\lim\\limits_{x\\to x_0}\\dfrac{f(x)}{g(x)}=\\lim\\limits_{x\\to x_0}\\dfrac{f^{\\prime}(x)}{g^{\\prime}(x)}=A \\)</div>' +
            '<p class="tight">对 \\( x\\to\\infty \\)、单侧极限等情形结论同样成立。条件③是<b>充分条件</b>：若 \\( \\lim\\dfrac{f^{\\prime}}{g^{\\prime}} \\) 不存在且非无穷大，不能断言原极限不存在。</p>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '洛必达失效的反例', html:
            '<p class="tight">极限 \\( \\lim\\limits_{x\\to\\infty}\\dfrac{x+\\sin x}{x} \\) 是 \\( \\dfrac{\\infty}{\\infty} \\) 型，用洛必达得 \\( \\lim\\limits_{x\\to\\infty}(1+\\cos x) \\) 不存在（振荡），但这<b>不能</b>说明原极限不存在——原极限等于 1。</p>'
          },
          { t: 'viz', build: 'lhopitalCompare', title: '洛必达法则：f/g 与 f′/g′ 同趋于同一极限', sub: '切换三组 0/0 型未定式，拖动 x₀ 向 0 靠近，对比原比值与导数比的走向' },
          { t: 'h3', idx: '②', text: '其他未定式的转化' },
          { t: 'table', head: ['未定式', '转化方法', '例子'], rows: [
            ['\\( 0\\cdot\\infty \\)', '化为 \\( \\dfrac{0}{1/\\infty} \\) 或 \\( \\dfrac{\\infty}{1/0} \\)，选择导数简单的一方', '\\( \\lim\\limits_{x\\to 0^{+}}x\\ln x=\\lim\\limits_{x\\to 0^{+}}\\dfrac{\\ln x}{1/x} \\)'],
            ['\\( \\infty-\\infty \\)', '通分、有理化或提取公因子化为 \\( \\dfrac{0}{0} \\)', '\\( \\lim\\limits_{x\\to 0}\\left(\\dfrac{1}{x}-\\dfrac{1}{\\sin x}\\right) \\)'],
            ['\\( 0^{0},\\ 1^{\\infty},\\ \\infty^{0} \\)', '取对数：\\( y=f^{g}\\Rightarrow \\ln y=g\\ln f \\)，先求 \\( \\lim g\\ln f \\)（\\( 0\\cdot\\infty \\) 型）', '\\( \\lim\\limits_{x\\to 0^{+}}x^{x}=\\mathrm{e}^{\\lim x\\ln x} \\)']
          ]},
          { t: 'h3', idx: '③', text: '使用技巧与注意事项' },
          { t: 'list', items: [
            '先化简再求导：能约分、能提出非零因子、能用等价无穷小替换时先处理，可减少求导次数；',
            '每用一次洛必达都要重新检验是否仍为 \\( \\dfrac{0}{0} \\) 或 \\( \\dfrac{\\infty}{\\infty} \\) 型；',
            '洛必达与等价无穷小、泰勒展开配合使用效果最好；分子分母中含加减的项慎用等价替换；',
            '数列极限 \\( n\\to\\infty \\) 不能直接洛必达，应先化为连续变量 \\( x\\to+\\infty \\) 的函数极限；',
            '当 \\( \\lim\\dfrac{f^{\\prime}}{g^{\\prime}} \\) 越来越复杂时，应改用其他方法（泰勒、夹逼等）。'
          ]},
          { t: 'card', kind: 'exam', tag: '真题视角', title: '未定式极限的优先策略', html:
            '<p class="tight">拿到极限题先“定型”：</p>' +
            '<ol class="clean">' +
            '<li>代入判断类型，是非未定式直接得结果；</li>' +
            '<li>是等价无穷小可处理的乘除结构，优先等价替换；</li>' +
            '<li>是 \\( \\dfrac{0}{0} \\) 或 \\( \\dfrac{\\infty}{\\infty} \\) 型，洛必达或泰勒展开；</li>' +
            '<li>含根式差的 \\( \\infty-\\infty \\) 型先有理化；幂指函数取对数。</li>' +
            '</ol>'
          }
        ],
        examples: [
          {
            no: '例 2.11', meta: '基础 · 0/0 型',
            q: '求 \\( \\lim\\limits_{x\\to 0}\\dfrac{\\tan x-x}{x^{3}} \\)。',
            sol: '<p>这是 \\( \\dfrac{0}{0} \\) 型，用洛必达法则：</p>' +
              '<p>\\( \\lim\\limits_{x\\to 0}\\dfrac{\\tan x-x}{x^{3}}=\\lim\\limits_{x\\to 0}\\dfrac{\\sec^{2}x-1}{3x^{2}}=\\lim\\limits_{x\\to 0}\\dfrac{\\tan^{2}x}{3x^{2}}=\\dfrac{1}{3}\\lim\\limits_{x\\to 0}\\left(\\dfrac{\\tan x}{x}\\right)^{2}=\\dfrac{1}{3} \\)。</p>' +
              '<p>注：第二步后也可直接用等价无穷小 \\( \\tan x\\sim x \\) 简化运算。</p>'
          },
          {
            no: '例 2.12', meta: '综合 · 幂指函数（0^0 型）',
            q: '求 \\( \\lim\\limits_{x\\to 0^{+}}x^{x} \\)。',
            sol: '<p>这是 \\( 0^{0} \\) 型。令 \\( y=x^{x} \\)，取对数：\\( \\ln y=x\\ln x \\)。</p>' +
              '<p>先求 \\( \\lim\\limits_{x\\to 0^{+}}x\\ln x=\\lim\\limits_{x\\to 0^{+}}\\dfrac{\\ln x}{1/x} \\)（\\( \\dfrac{\\infty}{\\infty} \\) 型），洛必达得 \\( \\lim\\limits_{x\\to 0^{+}}\\dfrac{1/x}{-1/x^{2}}=\\lim\\limits_{x\\to 0^{+}}(-x)=0 \\)。</p>' +
              '<p>故 \\( \\lim\\limits_{x\\to 0^{+}}x^{x}=\\mathrm{e}^{0}=1 \\)。</p>'
          },
          {
            no: '例 2.13', meta: '综合 · ∞/∞ 型',
            q: '求 \\( \\lim\\limits_{x\\to+\\infty}\\dfrac{x^{2}}{\\mathrm{e}^{x}} \\)。',
            sol: '<p>这是 \\( \\dfrac{\\infty}{\\infty} \\) 型，连续两次使用洛必达法则：</p>' +
              '<p>\\( \\lim\\limits_{x\\to+\\infty}\\dfrac{x^{2}}{\\mathrm{e}^{x}}=\\lim\\limits_{x\\to+\\infty}\\dfrac{2x}{\\mathrm{e}^{x}}=\\lim\\limits_{x\\to+\\infty}\\dfrac{2}{\\mathrm{e}^{x}}=0 \\)。</p>' +
              '<p>这体现了当 \\( x\\to+\\infty \\) 时指数函数比任何幂函数增长得快。</p>'
          },
          {
            no: '例 2.14', meta: '提高 · 洛必达失效的情形',
            q: '求 \\( \\lim\\limits_{x\\to\\infty}\\dfrac{x+\\sin x}{x} \\)。',
            sol: '<p>这是 \\( \\dfrac{\\infty}{\\infty} \\) 型，但用洛必达得 \\( \\lim\\limits_{x\\to\\infty}(1+\\cos x) \\)，该极限不存在（振荡）。洛必达失效，应改用其他方法：</p>' +
              '<p>\\( \\dfrac{x+\\sin x}{x}=1+\\dfrac{\\sin x}{x} \\)，而 \\( \\left|\\dfrac{\\sin x}{x}\\right|\\leqslant\\dfrac{1}{|x|}\\to 0 \\)，故原极限为 1。</p>'
          }
        ],
        pitfalls: [
          '洛必达法则只适用于 \\( \\dfrac{0}{0} \\) 与 \\( \\dfrac{\\infty}{\\infty} \\) 型，其他类型的未定式必须先转化为这两种类型。',
          '使用后若极限仍然存在且为未定式，可继续使用，但每次都要重新验证类型。',
          '\\( \\lim\\dfrac{f^{\\prime}}{g^{\\prime}} \\) 不存在（且非无穷）时，不能得出原极限不存在的结论，应改用其他方法。',
          '洛必达法则是充分条件而不是必要条件：极限存在未必需要用它；有时越洛必达越复杂。',
          '数列极限不能直接洛必达（\\( n \\) 是离散变量），应改写为函数极限；含参变量的极限要讨论参数。'
        ]
      },

      /* ---------------- 2.5 ---------------- */
      {
        id: 'ch2-s5', num: '2.5', title: '单调性、极值与最值',
        lead: '大纲要求：理解函数的极值概念，掌握用导数判断函数单调性和求函数极值的方法，掌握函数最大值和最小值的求法及其应用。',
        blocks: [
          { t: 'h3', idx: '①', text: '函数单调性的判别法' },
          { t: 'card', kind: 'thm', tag: '定理', title: '单调性判别', html:
            '<p class="tight">设 \\( f \\) 在区间 \\( I \\) 上可导：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( f^{\\prime}(x)\\gt 0\\ (x\\in I) \\Rightarrow f \\) 在 \\( I \\) 上单调增加；\\( f^{\\prime}(x)\\lt 0 \\Rightarrow f \\) 在 \\( I \\) 上单调减少</div>' +
            '<div class="fml-row">若 \\( f \\) 在 \\( I \\) 上单调增加（可导），则 \\( f^{\\prime}(x)\\geqslant 0 \\)；严格单调增加的充要条件是 \\( f^{\\prime}(x)\\geqslant 0 \\) 且在 \\( I \\) 的任意子区间上 \\( f^{\\prime} \\) 不恒为 0</div>' +
            '</div>' +
            '<p class="tight"><b>求单调区间的步骤：</b>确定定义域 → 求 \\( f^{\\prime}(x) \\) → 求 \\( f^{\\prime}(x)=0 \\) 的根及 \\( f^{\\prime} \\) 不存在的点 → 以这些点划分定义域 → 判断各区间上 \\( f^{\\prime} \\) 的符号。</p>'
          },
          { t: 'viz', build: 'monotonicExtrema', title: '导数符号与单调性', sub: '拖动切点，观察 f′(x) 的符号与函数升降的对应' },
          { t: 'h3', idx: '②', text: '极值的概念与必要条件' },
          { t: 'card', kind: 'def', tag: '定义', title: '极值', html:
            '<p class="tight">设 \\( f \\) 在 \\( x_0 \\) 的某邻域内有定义，若对该邻域内一切 \\( x \\) 有 \\( f(x)\\leqslant f(x_0) \\)，则称 \\( f(x_0) \\) 为<b>极大值</b>，\\( x_0 \\) 为极大值点；若 \\( f(x)\\geqslant f(x_0) \\)，则为<b>极小值</b>。极大值与极小值统称极值。</p>' +
            '<p class="tight">极值是<b>局部概念</b>，只在某邻域内比较大小；一个函数可能有多个极值，且极大值可能小于极小值。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '极值的必要条件（费马引理）', html:
            '<p class="tight">若 \\( f \\) 在 \\( x_0 \\) 处可导且取极值，则 \\( f^{\\prime}(x_0)=0 \\)。使 \\( f^{\\prime}(x)=0 \\) 的点称为<b>驻点</b>。</p>' +
            '<p class="tight">注意：极值点还可能是<b>不可导点</b>（如 \\( y=|x| \\) 的 \\( x=0 \\)）；驻点不一定是极值点（如 \\( y=x^{3} \\) 的 \\( x=0 \\)）。可能取极值的点 = 驻点 + 不可导点。</p>'
          },
          { t: 'h3', idx: '③', text: '极值的充分条件' },
          { t: 'card', kind: 'key', tag: '第一充分条件', title: '由 f′ 的符号变化判断', html:
            '<p class="tight">设 \\( f \\) 在 \\( x_0 \\) 处连续，在 \\( x_0 \\) 的去心邻域内可导：</p>' +
            '<ul class="none">' +
            '<li>\\( f^{\\prime} \\) 在 \\( x_0 \\) 左侧为正、右侧为负 \\( \\Rightarrow f(x_0) \\) 为<b>极大值</b>；</li>' +
            '<li>\\( f^{\\prime} \\) 在 \\( x_0 \\) 左侧为负、右侧为正 \\( \\Rightarrow f(x_0) \\) 为<b>极小值</b>；</li>' +
            '<li>\\( f^{\\prime} \\) 两侧符号相同 \\( \\Rightarrow x_0 \\) 不是极值点。</li>' +
            '</ul>' +
            '<p class="tight">该条件对驻点和不可导点都适用，是最常用的判别方法。</p>'
          },
          { t: 'card', kind: 'key', tag: '第二充分条件', title: '由二阶导数判断', html:
            '<p class="tight">设 \\( f^{\\prime}(x_0)=0,\\ f^{\\prime\\prime}(x_0) \\) 存在且不为 0：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( f^{\\prime\\prime}(x_0)\\lt 0 \\Rightarrow f(x_0) \\) 为极大值；\\( f^{\\prime\\prime}(x_0)\\gt 0 \\Rightarrow f(x_0) \\) 为极小值</div>' +
            '</div>' +
            '<p class="tight">当 \\( f^{\\prime\\prime}(x_0)=0 \\) 时第二充分条件失效（可能取极值也可能不取），应回到第一充分条件或泰勒展开判断。</p>'
          },
          { t: 'h3', idx: '④', text: '最大值与最小值' },
          { t: 'card', kind: 'key', tag: '必记', title: '闭区间上连续函数的最值', html:
            '<p class="tight">求 \\( f \\) 在 \\( [a,b] \\) 上最值的步骤：</p>' +
            '<ol class="clean">' +
            '<li>求出 \\( (a,b) \\) 内所有驻点与不可导点；</li>' +
            '<li>计算这些点及端点处的函数值；</li>' +
            '<li>比较所有函数值，最大者为最大值，最小者为最小值。</li>' +
            '</ol>' +
            '<p class="tight"><b>实际问题：</b>若目标函数在区间内部只有一个驻点，且由实际问题本身可断定最值存在（不在端点取到），则该驻点就是最值点，无需再比较端点。</p>'
          },
          { t: 'table', head: ['对比项', '极值', '最值'], rows: [
            ['范围', '局部（某邻域内）', '整体（整个区间上）'],
            ['是否唯一', '可能多个，极大值未必大于极小值', '若存在则最大（小）值唯一'],
            ['可能位置', '驻点、不可导点（不能在端点）', '驻点、不可导点、区间端点'],
            ['判定', '第一/第二充分条件', '比较所有候选点的函数值']
          ]},
          { t: 'card', kind: 'exam', tag: '真题视角', title: '用单调性证明不等式', html:
            '<p class="tight">证明 \\( f(x)\\gt g(x)\\ (x\\gt a) \\) 的标准套路：令 \\( F(x)=f(x)-g(x) \\)，验证 \\( F(a)\\geqslant 0 \\)（或取极限），再证 \\( F^{\\prime}(x)\\gt 0\\ (x\\gt a) \\)。若一阶导符号不易判断，可再求二阶导，逐层分析。</p>'
          }
        ],
        examples: [
          {
            no: '例 2.15', meta: '基础 · 单调区间与极值',
            q: '求 \\( f(x)=x^{3}-3x^{2}+1 \\) 的单调区间与极值。',
            sol: '<p>\\( f^{\\prime}(x)=3x^{2}-6x=3x(x-2) \\)，驻点为 \\( x=0,\\ x=2 \\)。</p>' +
              '<p>当 \\( x\\lt 0 \\) 或 \\( x\\gt 2 \\) 时 \\( f^{\\prime}\\gt 0 \\)；当 \\( 0\\lt x\\lt 2 \\) 时 \\( f^{\\prime}\\lt 0 \\)。</p>' +
              '<p>故单调增区间为 \\( (-\\infty,0) \\) 与 \\( (2,+\\infty) \\)，单调减区间为 \\( (0,2) \\)。</p>' +
              '<p>极大值 \\( f(0)=1 \\)，极小值 \\( f(2)=8-12+1=-3 \\)。</p>'
          },
          {
            no: '例 2.16', meta: '综合 · 用单调性证不等式',
            q: '证明：当 \\( x\\gt 0 \\) 时，\\( x-\\dfrac{x^{2}}{2}\\lt \\ln(1+x)\\lt x \\)。',
            sol: '<p><b>右半部分：</b>令 \\( F(x)=x-\\ln(1+x) \\)，\\( F(0)=0 \\)，\\( F^{\\prime}(x)=1-\\dfrac{1}{1+x}=\\dfrac{x}{1+x}\\gt 0\\ (x\\gt 0) \\)，故 \\( F \\) 单调增，\\( F(x)\\gt F(0)=0 \\)，即 \\( \\ln(1+x)\\lt x \\)。</p>' +
              '<p><b>左半部分：</b>令 \\( G(x)=\\ln(1+x)-x+\\dfrac{x^{2}}{2} \\)，\\( G(0)=0 \\)，\\( G^{\\prime}(x)=\\dfrac{1}{1+x}-1+x=\\dfrac{x^{2}}{1+x}\\gt 0\\ (x\\gt 0) \\)，故 \\( G(x)\\gt 0 \\)，即 \\( \\ln(1+x)\\gt x-\\dfrac{x^{2}}{2} \\)。</p>'
          },
          {
            no: '例 2.17', meta: '提高 · 数列的最大项',
            q: '求数列 \\( \\{\\sqrt[n]{n}\\} \\) 的最大项。',
            sol: '<p>考察函数 \\( f(x)=x^{1/x}=\\mathrm{e}^{\\frac{\\ln x}{x}}\\ (x\\gt 0) \\)，与数列比较大小只需比较 \\( \\dfrac{\\ln x}{x} \\)。</p>' +
              '<p>令 \\( g(x)=\\dfrac{\\ln x}{x} \\)，\\( g^{\\prime}(x)=\\dfrac{1-\\ln x}{x^{2}} \\)：当 \\( 0\\lt x\\lt \\mathrm{e} \\) 时 \\( g^{\\prime}\\gt 0 \\)，当 \\( x\\gt \\mathrm{e} \\) 时 \\( g^{\\prime}\\lt 0 \\)，故 \\( g \\) 在 \\( x=\\mathrm{e} \\) 处取得最大值。</p>' +
              '<p>比较整数点：\\( \\sqrt{2}=2^{1/2}\\approx 1.414 \\)，\\( \\sqrt[3]{3}=3^{1/3}\\approx 1.442 \\)，且当 \\( n\\geqslant 3 \\) 时数列递减。</p>' +
              '<p>所以最大项为 \\( \\sqrt[3]{3} \\)。</p>'
          }
        ],
        pitfalls: [
          '求单调区间必须先确定定义域，再以驻点和不可导点划分区间；多个单调区间之间用逗号分隔或写“和”，不能写成并集。',
          '\\( f^{\\prime}(x_0)=0 \\) 只是极值的必要条件：\\( y=x^{3} \\) 在 \\( x=0 \\) 处导数为 0 但无极值。',
          '极值点也可出现在不可导点处（如 \\( y=|x| \\) 的 \\( x=0 \\)），求极值时不能只找驻点。',
          '第二充分条件在 \\( f^{\\prime\\prime}(x_0)=0 \\) 时失效，必须改用第一充分条件或泰勒展开。',
          '实际问题求最值时不要遗漏“问题本身保证最值存在”的说明，并注意变量的实际取值范围。'
        ]
      },

      /* ---------------- 2.6 ---------------- */
      {
        id: 'ch2-s6', num: '2.6', title: '凹凸性、拐点与渐近线',
        lead: '大纲要求：会用导数判断函数图形的凹凸性，会求函数图形的拐点以及水平、铅直和斜渐近线，会描绘函数的图形。',
        blocks: [
          { t: 'h3', idx: '①', text: '凹凸性及其判别' },
          { t: 'card', kind: 'key', tag: '必记', title: '凹凸性的判别（以大纲约定为准）', html:
            '<p class="tight">设 \\( f \\) 在区间 \\( I \\) 上二阶可导：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( f^{\\prime\\prime}(x)\\gt 0\\ (x\\in I) \\Rightarrow \\) 曲线 \\( y=f(x) \\) 在 \\( I \\) 上是<b>凹的</b>（凹向上）</div>' +
            '<div class="fml-row">\\( f^{\\prime\\prime}(x)\\lt 0\\ (x\\in I) \\Rightarrow \\) 曲线 \\( y=f(x) \\) 在 \\( I \\) 上是<b>凸的</b>（凸向上）</div>' +
            '</div>' +
            '<p class="tight"><b>几何直观：</b>凹的曲线上任意两点连线位于曲线弧上方；凸的曲线上任意两点连线位于曲线弧下方。\\( \\mathrm{e}^{x} \\) 是凹的典型代表，\\( \\ln x \\) 是凸的典型代表。</p>'
          },
          { t: 'viz', build: 'concavityInflection', title: '二阶导数与凹凸性', sub: '拖动 x，观察切线在曲线下方（凹）或上方（凸）以及拐点处变号' },
          { t: 'h3', idx: '②', text: '拐点及其求法' },
          { t: 'card', kind: 'def', tag: '定义', title: '拐点', html:
            '<p class="tight">连续曲线 \\( y=f(x) \\) 上凹与凸的分界点称为曲线的<b>拐点</b>。</p>' +
            '<p class="tight">拐点处二阶导数可能为 0（如 \\( y=x^{3} \\) 在 \\( x=0 \\)）或不存在（如 \\( y=\\sqrt[3]{x} \\) 在 \\( x=0 \\)）。</p>'
          },
          { t: 'list', ordered: true, items: [
            '求定义域并求出 \\( f^{\\prime\\prime}(x) \\)；',
            '令 \\( f^{\\prime\\prime}(x)=0 \\) 求根，并找出 \\( f^{\\prime\\prime}(x) \\) 不存在的点；',
            '用这些点把定义域分成若干小区间，考察 \\( f^{\\prime\\prime}(x) \\) 的符号；',
            '若 \\( f^{\\prime\\prime}(x) \\) 在某点两侧符号相反，该点为拐点；两侧符号相同则不是拐点。'
          ]},
          { t: 'card', kind: 'warn', tag: '易错', title: 'f″(x₀)=0 不等于拐点', html:
            '<p class="tight">\\( f^{\\prime\\prime}(x_0)=0 \\) 只是拐点的必要条件：\\( y=x^{4} \\) 在 \\( x=0 \\) 处 \\( y^{\\prime\\prime}=12x^{2}\\geqslant 0 \\) 不变号，故 \\( (0,0) \\) 不是拐点；而 \\( y=x^{1/3} \\) 在 \\( x=0 \\) 处二阶导数不存在，但 \\( (0,0) \\) 是拐点。判断拐点必须验证两侧二阶导数变号。</p>'
          },
          { t: 'h3', idx: '③', text: '渐近线' },
          { t: 'table', head: ['类型', '定义', '求法'], rows: [
            ['铅直渐近线', '\\( \\lim\\limits_{x\\to x_0}f(x)=\\infty \\)', '在函数的间断点（尤其分母零点、对数奇点）处考察单侧或双侧极限，得 \\( x=x_0 \\)'],
            ['水平渐近线', '\\( \\lim\\limits_{x\\to\\infty}f(x)=A \\)', '分别考察 \\( x\\to+\\infty \\) 与 \\( x\\to-\\infty \\)，得 \\( y=A \\)'],
            ['斜渐近线', '\\( y=kx+b \\)，\\( \\lim\\limits_{x\\to\\infty}[f(x)-kx-b]=0 \\)', '\\( k=\\lim\\limits_{x\\to\\infty}\\dfrac{f(x)}{x},\\quad b=\\lim\\limits_{x\\to\\infty}[f(x)-kx] \\)']
          ]},
          { t: 'card', kind: 'tip', tag: '技巧', title: '斜渐近线的计算顺序', html:
            '<p class="tight">先算 \\( k \\)（若 \\( k=0 \\) 则退化为水平渐近线），再算 \\( b \\)；\\( x\\to+\\infty \\) 与 \\( x\\to-\\infty \\) 要分别讨论，两侧的 \\( k,b \\) 可能不同。同一侧若存在斜渐近线，就不会再有水平渐近线。</p>'
          },
          { t: 'h3', idx: '④', text: '函数图形的描绘' },
          { t: 'list', ordered: true, items: [
            '确定定义域，讨论奇偶性、周期性；',
            '求 \\( f^{\\prime}(x) \\)，确定单调区间与极值点；',
            '求 \\( f^{\\prime\\prime}(x) \\)，确定凹凸区间与拐点；',
            '求所有渐近线（铅直、水平、斜）；',
            '计算一些关键点（与坐标轴交点、极值点、拐点）的函数值；',
            '用光滑曲线连接各点，注意渐近线用虚线画出。'
          ]},
          { t: 'card', kind: 'exam', tag: '真题视角', title: '图形描绘题的评分点', html:
            '<p class="tight">评分重点：单调性与极值表、凹凸性与拐点表、渐近线方程、图形走向（是否穿越渐近线）。作图前先列表汇总 \\( f^{\\prime},f^{\\prime\\prime} \\) 的符号与 \\( f \\) 的性态，可显著减少错误。</p>'
          }
        ],
        examples: [
          {
            no: '例 2.18', meta: '基础 · 凹凸区间与拐点',
            q: '求曲线 \\( f(x)=x^{4}-2x^{3}+1 \\) 的凹凸区间与拐点。',
            sol: '<p>\\( f^{\\prime}(x)=4x^{3}-6x^{2},\\ f^{\\prime\\prime}(x)=12x^{2}-12x=12x(x-1) \\)。</p>' +
              '<p>令 \\( f^{\\prime\\prime}(x)=0 \\) 得 \\( x=0,\\ x=1 \\)。当 \\( x\\lt 0 \\) 或 \\( x\\gt 1 \\) 时 \\( f^{\\prime\\prime}\\gt 0 \\)（凹）；当 \\( 0\\lt x\\lt 1 \\) 时 \\( f^{\\prime\\prime}\\lt 0 \\)（凸）。</p>' +
              '<p>凹区间为 \\( (-\\infty,0) \\)、\\( (1,+\\infty) \\)，凸区间为 \\( (0,1) \\)。</p>' +
              '<p>拐点为 \\( (0,1) \\) 与 \\( (1,0) \\)。</p>'
          },
          {
            no: '例 2.19', meta: '基础 · 求渐近线',
            q: '求曲线 \\( y=\\dfrac{x^{2}}{x-1} \\) 的所有渐近线。',
            sol: '<p><b>铅直渐近线：</b>当 \\( x\\to 1 \\) 时 \\( y\\to\\infty \\)，故 \\( x=1 \\) 为铅直渐近线。</p>' +
              '<p><b>斜渐近线：</b>作带余除法 \\( y=\\dfrac{x^{2}}{x-1}=x+1+\\dfrac{1}{x-1} \\)。</p>' +
              '<p>\\( k=\\lim\\limits_{x\\to\\infty}\\dfrac{y}{x}=1 \\)，\\( b=\\lim\\limits_{x\\to\\infty}(y-x)=\\lim\\limits_{x\\to\\infty}\\left(1+\\dfrac{1}{x-1}\\right)=1 \\)，故 \\( y=x+1 \\) 为斜渐近线（双侧相同）。</p>'
          },
          {
            no: '例 2.20', meta: '综合 · 两侧不同的斜渐近线',
            q: '求曲线 \\( f(x)=x+\\arctan x \\) 的渐近线。',
            sol: '<p>函数在 \\( \\mathbb{R} \\) 上连续，无铅直渐近线。</p>' +
              '<p>\\( k=\\lim\\limits_{x\\to\\infty}\\dfrac{f(x)}{x}=\\lim\\limits_{x\\to\\infty}\\left(1+\\dfrac{\\arctan x}{x}\\right)=1 \\)。</p>' +
              '<p>当 \\( x\\to+\\infty \\)：\\( b=\\lim\\limits_{x\\to+\\infty}(f(x)-x)=\\lim\\limits_{x\\to+\\infty}\\arctan x=\\dfrac{\\pi}{2} \\)，得 \\( y=x+\\dfrac{\\pi}{2} \\)；</p>' +
              '<p>当 \\( x\\to-\\infty \\)：\\( b=\\lim\\limits_{x\\to-\\infty}\\arctan x=-\\dfrac{\\pi}{2} \\)，得 \\( y=x-\\dfrac{\\pi}{2} \\)。</p>' +
              '<p>故两侧各有一条不同的斜渐近线。</p>'
          },
          {
            no: '例 2.21', meta: '提高 · 描绘函数图形',
            q: '描绘函数 \\( y=x\\mathrm{e}^{-x} \\) 的图形。',
            sol: '<p><b>定义域：</b>\\( \\mathbb{R} \\)；无奇偶性。</p>' +
              '<p><b>单调性与极值：</b>\\( y^{\\prime}=\\mathrm{e}^{-x}(1-x) \\)，\\( x\\lt 1 \\) 时增，\\( x\\gt 1 \\) 时减；极大值 \\( y(1)=\\dfrac{1}{\\mathrm{e}} \\)。</p>' +
              '<p><b>凹凸与拐点：</b>\\( y^{\\prime\\prime}=\\mathrm{e}^{-x}(x-2) \\)，\\( x\\lt 2 \\) 时凸，\\( x\\gt 2 \\) 时凹；拐点 \\( \\left(2,\\dfrac{2}{\\mathrm{e}^{2}}\\right) \\)。</p>' +
              '<p><b>渐近线：</b>\\( \\lim\\limits_{x\\to+\\infty}x\\mathrm{e}^{-x}=0 \\)，故有水平渐近线 \\( y=0\\ (x\\to+\\infty) \\)；无铅直渐近线；无斜渐近线。</p>' +
              '<p><b>关键点：</b>过原点 \\( (0,0) \\)，当 \\( x\\lt 0 \\) 时 \\( y\\lt 0 \\)。图形从 \\( x\\to-\\infty \\) 处的 \\( -\\infty \\) 上升，过原点，在 \\( x=1 \\) 处达到最高点 \\( 1/\\mathrm{e} \\)，然后在 \\( x=2 \\) 处由凸转凹，最后以 \\( y=0 \\) 为水平渐近线趋于 0。</p>'
          }
        ],
        pitfalls: [
          '\\( f^{\\prime\\prime}(x_0)=0 \\) 不一定是拐点，必须验证 \\( f^{\\prime\\prime} \\) 在 \\( x_0 \\) 两侧是否变号，如 \\( y=x^{4} \\) 在 \\( x=0 \\)。',
          '\\( f^{\\prime\\prime}(x) \\) 不存在的点也可能是拐点，如 \\( y=\\sqrt[3]{x} \\) 在 \\( x=0 \\) 处。',
          '凹凸性的说法要与大纲约定一致：本系统按大纲取 \\( f^{\\prime\\prime}\\gt 0 \\) 为凹、\\( f^{\\prime\\prime}\\lt 0 \\) 为凸（部分教材恰好相反）。',
          '斜渐近线必须分别讨论 \\( x\\to+\\infty \\) 与 \\( x\\to-\\infty \\)，两侧可能不同（如 \\( x+\\arctan x \\)）；先求 \\( k \\) 再求 \\( b \\)，顺序不能颠倒。',
          '描绘图形时不要遗漏函数在间断点附近的行为（无穷间断点对应铅直渐近线），渐近线要画成虚线。'
        ]
      },

      /* ---------------- 2.7 ---------------- */
      {
        id: 'ch2-s7', num: '2.7', title: '弧微分、曲率与曲率圆',
        lead: '大纲要求：了解曲率、曲率圆与曲率半径的概念，会计算曲率和曲率半径。',
        blocks: [
          { t: 'h3', idx: '①', text: '弧微分' },
          { t: 'card', kind: 'key', tag: '必记', title: '三种形式下的弧微分', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>直角坐标：</b>\\( \\mathrm{d}s=\\sqrt{1+y^{\\prime 2}}\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row"><b>参数方程 \\( x=\\varphi(t),y=\\psi(t) \\)：</b>\\( \\mathrm{d}s=\\sqrt{\\varphi^{\\prime 2}(t)+\\psi^{\\prime 2}(t)}\\,\\mathrm{d}t \\)</div>' +
            '<div class="fml-row"><b>极坐标 \\( r=r(\\theta) \\)：</b>\\( \\mathrm{d}s=\\sqrt{r^{2}+r^{\\prime 2}}\\,\\mathrm{d}\\theta \\)</div>' +
            '</div>' +
            '<p class="tight">弧微分是“以直代曲”的基本微元：在小区间上用切线段近似弧长，再积分得总弧长。注意弧长参数 \\( s \\) 总取增加方向。</p>'
          },
          { t: 'h3', idx: '②', text: '曲率的概念与计算公式' },
          { t: 'card', kind: 'def', tag: '定义', title: '曲率', html:
            '<p class="tight">曲率刻画曲线弯曲的程度。设曲线在点 \\( M \\) 处切线的倾角为 \\( \\alpha \\)，当点沿曲线移动弧长 \\( |\\Delta s| \\) 时切线倾角改变 \\( |\\Delta\\alpha| \\)，则</p>' +
            '<div class="fml">\\( K=\\lim\\limits_{\\Delta s\\to 0}\\left|\\dfrac{\\Delta\\alpha}{\\Delta s}\\right|=\\left|\\dfrac{\\mathrm{d}\\alpha}{\\mathrm{d}s}\\right|\\geqslant 0 \\)</div>' +
            '<p class="tight">曲率越大，曲线弯曲得越厉害；直线不弯曲，曲率为 0。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '曲率计算公式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>直角坐标 \\( y=f(x) \\)：</b>\\( K=\\dfrac{|y^{\\prime\\prime}|}{\\left(1+y^{\\prime 2}\\right)^{3/2}} \\)</div>' +
            '<div class="fml-row"><b>参数方程：</b>\\( K=\\dfrac{|\\varphi^{\\prime}(t)\\psi^{\\prime\\prime}(t)-\\varphi^{\\prime\\prime}(t)\\psi^{\\prime}(t)|}{\\left(\\varphi^{\\prime 2}(t)+\\psi^{\\prime 2}(t)\\right)^{3/2}} \\)</div>' +
            '</div>'
          },
          { t: 'viz', build: 'curvatureCircle', title: '曲率与曲率圆', sub: '拖动点观察不同位置处曲率半径的变化与密切圆' },
          { t: 'h3', idx: '③', text: '曲率圆与曲率半径' },
          { t: 'card', kind: 'def', tag: '定义', title: '曲率圆（密切圆）', html:
            '<p class="tight">在曲线凹侧，沿法线取一点 \\( C \\)，使 \\( |CM|=\\rho=\\dfrac{1}{K} \\)，以 \\( C \\) 为圆心、\\( \\rho \\) 为半径作圆，该圆在点 \\( M \\) 处与曲线有相同的切线和相同的曲率，称为曲线在 \\( M \\) 处的<b>曲率圆</b>，\\( C \\) 为<b>曲率中心</b>，\\( \\rho \\) 为<b>曲率半径</b>。</p>' +
            '<div class="fml">\\( \\rho=\\dfrac{1}{K},\\qquad K=\\dfrac{1}{\\rho} \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '曲率中心坐标公式', html:
            '<p class="tight">设曲线 \\( y=f(x) \\) 二阶可导且 \\( y^{\\prime\\prime}\\neq 0 \\)，则在点 \\( (x,y) \\) 处曲率中心 \\( (\\alpha,\\beta) \\) 满足：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( \\alpha=x-\\dfrac{y^{\\prime}\\left(1+y^{\\prime 2}\\right)}{y^{\\prime\\prime}},\\qquad \\beta=y+\\dfrac{1+y^{\\prime 2}}{y^{\\prime\\prime}} \\)</div>' +
            '</div>' +
            '<p class="tight">曲率圆与曲线在该点有相同的切线、相同的曲率（二阶接触），是曲线在该点附近“最贴近”的圆。</p>'
          },
          { t: 'card', kind: 'tip', tag: '补充', title: '常见曲线的曲率', html:
            '<div class="fml">' +
            '<div class="fml-row">直线：\\( K=0 \\)（曲率半径为无穷大）</div>' +
            '<div class="fml-row">半径 \\( R \\) 的圆：\\( K=\\dfrac{1}{R} \\)（处处相等）</div>' +
            '<div class="fml-row">抛物线 \\( y=x^{2} \\) 顶点：\\( K=2,\\ \\rho=\\dfrac{1}{2} \\)</div>' +
            '</div>'
          }
        ],
        examples: [
          {
            no: '例 2.22', meta: '基础 · 抛物线曲率',
            q: '求曲线 \\( y=x^{2} \\) 上的最大曲率点及该点的曲率半径。',
            sol: '<p>\\( y^{\\prime}=2x,\\ y^{\\prime\\prime}=2 \\)，故 \\( K=\\dfrac{2}{\\left(1+4x^{2}\\right)^{3/2}} \\)。</p>' +
              '<p>分母当 \\( x=0 \\) 时最小，曲率最大：\\( K_{\\max}=2 \\)，曲率半径 \\( \\rho=\\dfrac{1}{2} \\)。</p>' +
              '<p>即顶点 \\( (0,0) \\) 处弯曲最厉害，越远离顶点曲率越小、越平缓。</p>'
          },
          {
            no: '例 2.23', meta: '综合 · 求最大曲率',
            q: '求曲线 \\( y=\\ln x\\ (x\\gt 0) \\) 上曲率最大的点及最大曲率。',
            sol: '<p>\\( y^{\\prime}=\\dfrac{1}{x},\\ y^{\\prime\\prime}=-\\dfrac{1}{x^{2}} \\)，故</p>' +
              '<p>\\( K=\\dfrac{\\frac{1}{x^{2}}}{\\left(1+\\frac{1}{x^{2}}\\right)^{3/2}}=\\dfrac{x}{\\left(x^{2}+1\\right)^{3/2}} \\)。</p>' +
              '<p>\\( K^{\\prime}(x)=\\dfrac{1-2x^{2}}{\\left(x^{2}+1\\right)^{5/2}} \\)，令为 0 得 \\( x=\\dfrac{\\sqrt{2}}{2} \\)（负值舍去）。</p>' +
              '<p>当 \\( 0\\lt x\\lt \\dfrac{\\sqrt{2}}{2} \\) 时 \\( K^{\\prime}\\gt 0 \\)，当 \\( x\\gt \\dfrac{\\sqrt{2}}{2} \\) 时 \\( K^{\\prime}\\lt 0 \\)，故该点为最大曲率点。</p>' +
              '<p>\\( K_{\\max}=\\dfrac{\\sqrt{2}/2}{\\left(\\frac{3}{2}\\right)^{3/2}}=\\dfrac{2\\sqrt{3}}{9} \\)，曲率半径 \\( \\rho=\\dfrac{3\\sqrt{3}}{2} \\)。</p>'
          },
          {
            no: '例 2.24', meta: '基础 · 曲率圆方程',
            q: '求曲线 \\( y=x^{2} \\) 在原点处的曲率圆方程。',
            sol: '<p>在 \\( (0,0) \\) 处：\\( y^{\\prime}=0,\\ y^{\\prime\\prime}=2 \\)，\\( K=2,\\ \\rho=\\dfrac{1}{2} \\)。</p>' +
              '<p>由曲率中心公式：\\( \\alpha=0-\\dfrac{0\\cdot(1+0)}{2}=0 \\)，\\( \\beta=0+\\dfrac{1+0}{2}=\\dfrac{1}{2} \\)。</p>' +
              '<p>故曲率圆方程为 \\( x^{2}+\\left(y-\\dfrac{1}{2}\\right)^{2}=\\dfrac{1}{4} \\)。</p>'
          },
          {
            no: '例 2.25', meta: '提高 · 椭圆顶点的曲率',
            q: '求椭圆 \\( x=a\\cos t,\\ y=b\\sin t\\ (a\\gt b\\gt 0) \\) 在点 \\( (a,0) \\) 与 \\( (0,b) \\) 处的曲率。',
            sol: '<p>由参数方程求导：\\( \\varphi^{\\prime}=-a\\sin t,\\ \\varphi^{\\prime\\prime}=-a\\cos t \\)；\\( \\psi^{\\prime}=b\\cos t,\\ \\psi^{\\prime\\prime}=-b\\sin t \\)。</p>' +
              '<p>在 \\( t=0 \\) 即点 \\( (a,0) \\) 处：\\( \\varphi^{\\prime}=0,\\ \\varphi^{\\prime\\prime}=-a,\\ \\psi^{\\prime}=b,\\ \\psi^{\\prime\\prime}=0 \\)，</p>' +
              '<p>\\( K=\\dfrac{|(-a)\\cdot 0-b\\cdot(-a)|}{\\left(0+b^{2}\\right)^{3/2}}=\\dfrac{ab}{b^{3}}=\\dfrac{a}{b^{2}} \\)。</p>' +
              '<p>在 \\( t=\\dfrac{\\pi}{2} \\) 即点 \\( (0,b) \\) 处，同理可得 \\( K=\\dfrac{b}{a^{2}} \\)。</p>' +
              '<p>当 \\( a\\gt b \\) 时 \\( \\dfrac{b}{a^{2}}\\lt \\dfrac{a}{b^{2}} \\)，说明椭圆在长轴端点处弯曲程度更大。</p>'
          }
        ],
        pitfalls: [
          '曲率公式的分母是 \\( \\left(1+y^{\\prime 2}\\right)^{3/2} \\)，指数是 \\( 3/2 \\)，不要漏掉或写错。',
          '曲率 \\( K\\geqslant 0 \\)（公式中取绝对值）；曲率半径 \\( \\rho=\\dfrac{1}{K} \\)，直线曲率为 0、曲率半径为无穷大。',
          '参数方程求曲率要直接用参数公式，不要先消参（很多时候消不掉）；分子是 \\( |\\varphi^{\\prime}\\psi^{\\prime\\prime}-\\varphi^{\\prime\\prime}\\psi^{\\prime}| \\)，顺序不能颠倒。',
          '曲率圆的圆心在曲线的凹侧（沿法线方向），由公式计算时注意 \\( y^{\\prime\\prime} \\) 的符号：\\( y^{\\prime\\prime}\\gt 0 \\) 时曲线凹向上，圆心在曲线上方。',
          '曲率最大的点一般通过解 \\( K^{\\prime}(x)=0 \\) 得到，要注意检验端点和定义域，并说明“最大”。'
        ]
      }
    ]
  };
})(window);
