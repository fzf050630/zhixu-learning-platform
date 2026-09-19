/* ============================================================
   ch8.js — 第八章 常微分方程
   覆盖 2026 大纲「八、常微分方程」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH8 = {
    id: 'ch8', no: '八', title: '常微分方程',
    subtitle: '已知函数与它的导数满足的关系，反求函数——微分方程是“变化率语言”写成的方程，也是微分学与积分学的汇流处。',
    tags: ['微分方程', '通解', '特解', '可分离变量', '齐次方程', '一阶线性', '伯努利方程', '全微分方程', '降阶', '特征方程', '非齐次', '欧拉方程', '应用'],
    sections: [

      /* ---------------- 8.1 ---------------- */
      {
        id: 'ch8-s1', num: '8.1', title: '微分方程的基本概念',
        lead: '大纲要求：了解微分方程及其阶、解、通解、初始条件和特解等概念。',
        blocks: [
          { t: 'h3', idx: '①', text: '微分方程、阶与解的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '微分方程与阶', html:
            '<p class="tight">含有未知函数及其导数（或微分）的方程称为<b>微分方程</b>；未知函数是一元函数的微分方程称为<b>常微分方程</b>。</p>' +
            '<p class="tight">微分方程中出现的未知函数最高阶导数的阶数，称为该微分方程的<b>阶</b>。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row">\\( y\'=2x \\) 是一阶微分方程；\\( y\'\'+y=0 \\)、\\( x^2y\'\'+xy\'-y=x \\) 是二阶微分方程。</div>' +
            '<div class="fml-row">若方程关于未知函数 \\( y \\) 及其各阶导数都是<b>一次</b>的、且不出现它们之间的乘积，则称为<b>线性</b>微分方程，否则为非线性方程。</div>'
          },
          { t: 'card', kind: 'def', tag: '定义', title: '解、通解、初始条件与特解', html:
            '<ul class="none">' +
            '<li><b>解</b>：代入方程后能使方程成为恒等式的函数 \\( y=y(x) \\)；</li>' +
            '<li><b>通解</b>：含有的独立任意常数个数恰好等于方程阶数的解；</li>' +
            '<li><b>初始条件</b>：\\( n \\) 阶方程给出 \\( y(x_0)=y_0,\\ y\'(x_0)=y_0\',\\ \\cdots,\\ y^{(n-1)}(x_0)=y_0^{(n-1)} \\)；</li>' +
            '<li><b>特解</b>：由初始条件确定通解中任意常数后得到的解。</li>' +
            '</ul>'
          },
          { t: 'fml', html:
            '<div class="fml-row">\\( n \\) 阶方程的通解一般形如 \\( y=\\varphi(x,C_1,C_2,\\cdots,C_n) \\)，其中 \\( C_1,C_2,\\cdots,C_n \\) 相互独立。</div>' +
            '<div class="fml-row">几何意义：通解是平面上的<b>积分曲线族</b>；满足初始条件的特解是过点 \\( (x_0,y_0) \\) 的那一条积分曲线。</div>'
          },
          { t: 'h3', idx: '②', text: '建立微分方程' },
          { t: 'list', items: [
            '<b>几何问题</b>：切线斜率为 \\( y\' \\)；法线斜率为 \\( -\\dfrac{1}{y\'} \\)；曲线所围面积用定积分表示；',
            '<b>物理问题</b>：牛顿第二定律 \\( F=ma \\) 中的加速度是位移的二阶导数；冷却定律、变化率问题等；',
            '<b>关键词翻译</b>：“速率”“增长率”“变化率”“与⋯成正比”都要翻译成导数语言；',
            '<b>初值条件</b>：题目中“初始时⋯”“过点 \\( (x_0,y_0) \\)”等条件用于确定任意常数。'
          ]},
          { t: 'card', kind: 'exam', tag: '真题视角', title: '列方程的标准动作', html:
            '<ul class="none">' +
            '<li>设未知函数并明确自变量（通常时间用 \\( t \\)，几何问题用 \\( x \\)）；</li>' +
            '<li>用“变化率 = ⋯”的形式写出微分方程，注意正负号的实际含义；</li>' +
            '<li>写出初始条件（有几个任意常数就要有几个条件）；</li>' +
            '<li>解方程、定常数，最后回到实际问题作答。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '微分方程的分类' },
          { t: 'table', head: ['分类标准', '类型', '举例'], rows: [
            ['阶数', '一阶 / 高阶', '\\( y\'=x+y \\) / \\( y\'\'+y=0 \\)'],
            ['是否线性', '线性（\\( y,y\',y\'\' \\) 均为一次且不相互乘除）', '\\( y\'\'+xy\'=\\mathrm{e}^x \\)'],
            ['', '非线性', '\\( y\'=y^2 \\)，\\( yy\'\'=1 \\)'],
            ['系数', '常系数 / 变系数', '\\( y\'\'-3y\'+2y=0 \\) / \\( x^2y\'\'+y=0 \\)'],
            ['自由项', '齐次 / 非齐次', '\\( y\'\'+y=0 \\) / \\( y\'\'+y=x \\)']
          ]},
          { t: 'viz', build: 'slopeField', title: '斜率场与积分曲线', sub: '一阶方程 y′=f(x,y) 的积分曲线处处与斜率场中的短线段相切，切换方程观察解族形态' }
        ],
        examples: [
          {
            no: '例 8.1', meta: '基础 · 验证通解',
            q: '验证 \\( y=C_1\\cos x+C_2\\sin x \\) 是方程 \\( y\'\'+y=0 \\) 的通解。',
            sol: '<p>求导：\\( y\'=-C_1\\sin x+C_2\\cos x \\)，\\( y\'\'=-C_1\\cos x-C_2\\sin x \\)。</p>' +
              '<p>代入：\\( y\'\'+y=-C_1\\cos x-C_2\\sin x+C_1\\cos x+C_2\\sin x=0 \\)，恒成立，故是解。</p>' +
              '<p>又 \\( C_1,C_2 \\) 是两个相互独立的任意常数，方程是二阶的，故 \\( y=C_1\\cos x+C_2\\sin x \\) 是<b>通解</b>。</p>'
          },
          {
            no: '例 8.2', meta: '综合 · 由通解反求方程',
            q: '求以 \\( y=Cx+C^2 \\)（\\( C \\) 为任意常数）为通解的微分方程。',
            sol: '<p>对 \\( x \\) 求导：\\( y\'=C \\)，故 \\( C=y\' \\)。</p>' +
              '<p>代回原式消去 \\( C \\)：\\( y=xy\'+(y\')^2 \\)。</p>' +
              '<p>这是一阶微分方程，通解含一个任意常数 \\( C \\)，与题设一致。</p>'
          },
          {
            no: '例 8.3', meta: '应用 · 几何建模',
            q: '已知曲线过点 \\( (1,2) \\)，且曲线上任一点 \\( (x,y) \\) 处的切线斜率为 \\( 2x \\)，求该曲线的方程。',
            sol: '<p>由题意建立方程与初始条件：\\( y\'=2x,\\quad y(1)=2 \\)。</p>' +
              '<p>积分得 \\( y=x^2+C \\)；代入初值：\\( 2=1+C\\Rightarrow C=1 \\)。</p>' +
              '<p>故所求曲线为 \\( y=x^2+1 \\)。</p>'
          }
        ],
        pitfalls: [
          '通解中任意常数的个数必须等于方程的阶数，且彼此独立：\\( y=(C_1+C_2)\\mathrm{e}^x \\) 本质上只含一个独立常数，不能作为二阶方程的通解。',
          '验证一个函数是否为解时，要注意方程的成立区间：如 \\( y=\\dfrac1x \\) 是 \\( y\'+y^2=0 \\) 在 \\( x\\neq 0 \\) 上的解。',
          '微分方程的解是<b>函数</b>，“求特解”的答案必须是函数表达式，并要用初始条件确定常数，不能只算出常数就结束。'
        ]
      },

      /* ---------------- 8.2 ---------------- */
      {
        id: 'ch8-s2', num: '8.2', title: '一阶微分方程',
        lead: '大纲要求：掌握变量可分离的微分方程及一阶线性微分方程的解法；会解齐次微分方程、伯努利方程和全微分方程，会用简单的变量代换解某些微分方程。',
        blocks: [
          { t: 'h3', idx: '①', text: '变量可分离方程' },
          { t: 'card', kind: 'def', tag: '定义', title: '变量可分离方程', html:
            '<p class="tight">能写成 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=f(x)g(y) \\)，或 \\( M_1(x)M_2(y)\\,\\mathrm{d}x+N_1(x)N_2(y)\\,\\mathrm{d}y=0 \\) 的方程称为<b>变量可分离方程</b>。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=f(x)g(y)\\ \\Longrightarrow\\ \\int\\dfrac{\\mathrm{d}y}{g(y)}=\\int f(x)\\,\\mathrm{d}x\\quad(g(y)\\neq 0) \\)</div>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '不要丢掉常数解', html:
            '<p class="tight">分离变量时用 \\( g(y) \\) 作除数，可能丢掉 \\( g(y)=0 \\) 对应的<b>常数解</b>（如 \\( y\'=y \\) 分离时丢掉 \\( y\\equiv 0 \\)）。正确的做法是分离前先检查 \\( g(y)=0 \\)，把这些解单独列出。</p>'
          },
          { t: 'h3', idx: '②', text: '齐次方程' },
          { t: 'card', kind: 'def', tag: '定义', title: '齐次方程', html:
            '<p class="tight">形如 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\varphi\\left(\\dfrac yx\\right) \\) 的方程称为（一阶）齐次方程——右端只依赖于比值 \\( \\dfrac yx \\)。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row">令 \\( u=\\dfrac yx \\)，即 \\( y=ux \\)，则 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=u+x\\dfrac{\\mathrm{d}u}{\\mathrm{d}x} \\)，方程化为</div>' +
            '<div class="fml-row">\\( x\\dfrac{\\mathrm{d}u}{\\mathrm{d}x}=\\varphi(u)-u \\)（变量可分离），解出后回代 \\( u=\\dfrac yx \\)。</div>'
          },
          { t: 'h3', idx: '③', text: '一阶线性微分方程' },
          { t: 'card', kind: 'def', tag: '定义', title: '一阶线性方程', html:
            '<p class="tight">形如 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}+P(x)y=Q(x) \\) 的方程称为一阶线性微分方程；\\( Q(x)\\equiv 0 \\) 时称为<b>齐次</b>线性方程，\\( Q(x)\\not\\equiv 0 \\) 时称为<b>非齐次</b>线性方程。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>通解公式：</b>\\( y=\\mathrm{e}^{-\\int P(x)\\,\\mathrm{d}x}\\left(\\int Q(x)\\,\\mathrm{e}^{\\int P(x)\\,\\mathrm{d}x}\\,\\mathrm{d}x+C\\right) \\)</div>' +
            '<div class="fml-row">齐次线性方程 \\( y\'+P(x)y=0 \\) 的通解为 \\( y=C\\mathrm{e}^{-\\int P(x)\\,\\mathrm{d}x} \\)。</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '常数变易法', html:
            '<p class="tight">先解对应的齐次方程得 \\( y=C\\mathrm{e}^{-\\int P\\mathrm{d}x} \\)；把常数 \\( C \\) 换成待定函数 \\( C(x) \\)，即设 \\( y=C(x)\\mathrm{e}^{-\\int P\\mathrm{d}x} \\)，代回原方程得</p>' +
            '<div class="fml">\\( C\'(x)=Q(x)\\mathrm{e}^{\\int P(x)\\mathrm{d}x} \\)</div>' +
            '<p class="tight">再积分即得通解公式。这个思路也是后面高阶线性方程的通用方法。</p>'
          },
          { t: 'h3', idx: '④', text: '伯努利方程' },
          { t: 'fml', html:
            '<div class="fml-row"><b>标准形：</b>\\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}+P(x)y=Q(x)y^{n}\\quad(n\\neq 0,1) \\)</div>' +
            '<div class="fml-row"><b>换元：</b>令 \\( z=y^{1-n} \\)，则 \\( \\dfrac{\\mathrm{d}z}{\\mathrm{d}x}+(1-n)P(x)z=(1-n)Q(x) \\)，化为关于 \\( z \\) 的一阶线性方程。</div>'
          },
          { t: 'card', kind: 'tip', tag: '注意', title: 'n 的特殊值', html:
            '<p class="tight">\\( n=0 \\) 时方程本身就是线性方程；\\( n=1 \\) 时是可分离变量方程。因此伯努利方程的定义中要求 \\( n\\neq 0,1 \\)。另外 \\( y=0 \\) 可能是解，换元前应单独检查。</p>'
          },
          { t: 'h3', idx: '⑤', text: '全微分方程' },
          { t: 'card', kind: 'def', tag: '定义', title: '全微分方程', html:
            '<p class="tight">若存在可微函数 \\( u(x,y) \\)，使 \\( \\mathrm{d}u(x,y)=M(x,y)\\,\\mathrm{d}x+N(x,y)\\,\\mathrm{d}y \\)，则称方程 \\( M\\,\\mathrm{d}x+N\\,\\mathrm{d}y=0 \\) 为<b>全微分方程</b>（恰当方程），其通解为 \\( u(x,y)=C \\)。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '判定与求解', html:
            '<p class="tight">设 \\( M,N \\) 在单连通区域上具有连续的一阶偏导数，则方程是全微分方程 \\( \\iff \\dfrac{\\partial M}{\\partial y}=\\dfrac{\\partial N}{\\partial x} \\)。</p>' +
            '<div class="fml">\\( u(x,y)=\\int_{x_0}^{x}M(t,y_0)\\,\\mathrm{d}t+\\int_{y_0}^{y}N(x,s)\\,\\mathrm{d}s \\)</div>' +
            '<p class="tight">实际计算常用<b>偏积分法</b>：由 \\( \\dfrac{\\partial u}{\\partial x}=M \\) 积分得 \\( u=\\int M\\,\\mathrm{d}x+\\psi(y) \\)，再由 \\( \\dfrac{\\partial u}{\\partial y}=N \\) 确定 \\( \\psi(y) \\)。</p>'
          },
          { t: 'card', kind: 'tip', tag: '了解', title: '积分因子', html:
            '<p class="tight">若 \\( \\dfrac{M_y-N_x}{N} \\) 只与 \\( x \\) 有关，则 \\( \\mu(x)=\\mathrm{e}^{\\int\\frac{M_y-N_x}{N}\\mathrm{d}x} \\) 是积分因子；若 \\( \\dfrac{N_x-M_y}{M} \\) 只与 \\( y \\) 有关，则 \\( \\mu(y)=\\mathrm{e}^{\\int\\frac{N_x-M_y}{M}\\mathrm{d}y} \\) 是积分因子。乘上积分因子后方程化为全微分方程。</p>'
          },
          { t: 'h3', idx: '⑥', text: '可用简单变量代换求解的方程' },
          { t: 'list', items: [
            '形如 \\( y\'=f(ax+by+c) \\)：令 \\( u=ax+by+c \\)，化为一阶可分离方程；',
            '形如 \\( y\'=f\\left(\\dfrac{a_1x+b_1y+c_1}{a_2x+b_2y+c_2}\\right) \\)：通过平移消去常数项后化为齐次方程（了解）；',
            '含根式或分式但能整理出 \\( \\dfrac yx \\) 的结构：按齐次方程处理；',
            '对称形式 \\( M\\,\\mathrm{d}x+N\\,\\mathrm{d}y=0 \\) 有时可通过“凑全微分”直接分组积分。'
          ]},
          { t: 'table', head: ['识别特征', '方程类型', '求解方法'], rows: [
            ['\\( y\'=f(x)g(y) \\)', '可分离变量', '分离变量后两边积分'],
            ['\\( y\'=\\varphi\\left(\\dfrac yx\\right) \\)', '齐次方程', '令 \\( u=\\dfrac yx \\)'],
            ['\\( y\'+P(x)y=Q(x) \\)', '一阶线性', '套通解公式（常数变易法）'],
            ['\\( y\'+P(x)y=Q(x)y^n \\)', '伯努利方程', '令 \\( z=y^{1-n} \\)'],
            ['\\( M\\mathrm{d}x+N\\mathrm{d}y=0,\\ M_y=N_x \\)', '全微分方程', '求原函数 \\( u(x,y)=C \\)']
          ]},
          { t: 'viz', build: 'slopeField', title: '一阶方程的斜率场与解曲线', sub: '切换可分离、一阶线性、齐次、逻辑斯蒂方程，拖动初值观察过该点的积分曲线' }
        ],
        examples: [
          {
            no: '例 8.4', meta: '基础 · 可分离变量',
            q: '解方程 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\mathrm{e}^{x+y} \\)，并求满足 \\( y(0)=0 \\) 的特解。',
            sol: '<p>方程化为 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\mathrm{e}^{x}\\mathrm{e}^{y} \\)，分离变量：\\( \\mathrm{e}^{-y}\\,\\mathrm{d}y=\\mathrm{e}^{x}\\,\\mathrm{d}x \\)。</p>' +
              '<p>两边积分：\\( -\\mathrm{e}^{-y}=\\mathrm{e}^{x}+C \\)，即 \\( \\mathrm{e}^{-y}=C_1-\\mathrm{e}^{x} \\)。</p>' +
              '<p>代入 \\( y(0)=0 \\)：\\( 1=C_1-1\\Rightarrow C_1=2 \\)。故特解为 \\( \\mathrm{e}^{-y}=2-\\mathrm{e}^{x} \\)，即 \\( y=-\\ln\\left(2-\\mathrm{e}^{x}\\right)\\ (x<\\ln 2) \\)。</p>'
          },
          {
            no: '例 8.5', meta: '基础 · 齐次方程',
            q: '解方程 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\dfrac yx+\\tan\\dfrac yx \\)。',
            sol: '<p>令 \\( u=\\dfrac yx \\)，则 \\( y=ux,\\ y\'=u+xu\' \\)，代入得 \\( xu\'=\\tan u \\)。</p>' +
              '<p>分离变量：\\( \\dfrac{\\cos u}{\\sin u}\\,\\mathrm{d}u=\\dfrac{\\mathrm{d}x}{x} \\)，积分得 \\( \\ln|\\sin u|=\\ln|x|+C_1 \\)。</p>' +
              '<p>即 \\( \\sin u=Cx \\)，回代得通解 \\( \\sin\\dfrac yx=Cx \\)（另有 \\( \\sin\\dfrac yx=0 \\) 对应的解）。</p>'
          },
          {
            no: '例 8.6', meta: '综合 · 一阶线性方程',
            q: '解方程 \\( y\'+\\dfrac1x y=\\dfrac{\\sin x}{x}\\quad(x>0) \\)。',
            sol: '<p>这里 \\( P(x)=\\dfrac1x,\\ Q(x)=\\dfrac{\\sin x}{x} \\)，\\( \\int P\\,\\mathrm{d}x=\\ln x \\)。</p>' +
              '<p>由通解公式：\\( y=\\mathrm{e}^{-\\ln x}\\left(\\int\\dfrac{\\sin x}{x}\\cdot\\mathrm{e}^{\\ln x}\\,\\mathrm{d}x+C\\right)=\\dfrac1x\\left(\\int\\sin x\\,\\mathrm{d}x+C\\right) \\)。</p>' +
              '<p>所以通解为 \\( y=\\dfrac{C-\\cos x}{x} \\)。</p>'
          },
          {
            no: '例 8.7', meta: '综合 · 伯努利方程',
            q: '解方程 \\( y\'+\\dfrac{1}{x}y=\\dfrac{1}{x}\\sqrt y\\quad(x>0) \\)。',
            sol: '<p>这是 \\( n=\\dfrac12 \\) 的伯努利方程，令 \\( z=\\sqrt y \\)，则 \\( z\'=\\dfrac{y\'}{2\\sqrt y} \\)。</p>' +
              '<p>方程两边除以 \\( 2\\sqrt y \\)：\\( z\'+\\dfrac{1}{2x}z=\\dfrac{1}{2x} \\)，这是关于 \\( z \\) 的一阶线性方程。</p>' +
              '<p>由通解公式（\\( P=\\dfrac{1}{2x} \\)）：\\( z=x^{-1/2}\\left(\\int\\dfrac{1}{2}x^{-1/2}\\,\\mathrm{d}x+C\\right)=1+Cx^{-1/2} \\)。</p>' +
              '<p>回代 \\( z=\\sqrt y \\)：\\( \\sqrt y=1+\\dfrac{C}{\\sqrt x} \\)，即 \\( y=\\left(1+\\dfrac{C}{\\sqrt x}\\right)^2 \\)（另有解 \\( y\\equiv 0 \\)）。</p>'
          },
          {
            no: '例 8.8', meta: '综合 · 全微分方程',
            q: '解方程 \\( (2x+y)\\,\\mathrm{d}x+(x+2y)\\,\\mathrm{d}y=0 \\)。',
            sol: '<p>\\( M=2x+y,\\ N=x+2y \\)，\\( \\dfrac{\\partial M}{\\partial y}=1=\\dfrac{\\partial N}{\\partial x} \\)，故为全微分方程。</p>' +
              '<p>由 \\( \\dfrac{\\partial u}{\\partial x}=2x+y \\) 积分得 \\( u=x^2+xy+\\psi(y) \\)。</p>' +
              '<p>再由 \\( \\dfrac{\\partial u}{\\partial y}=x+\\psi\'(y)=x+2y \\)，得 \\( \\psi\'(y)=2y,\\ \\psi(y)=y^2 \\)。</p>' +
              '<p>故通解为 \\( x^2+xy+y^2=C \\)。</p>'
          },
          {
            no: '例 8.9', meta: '拔高 · 简单变量代换',
            q: '用变量代换解方程 \\( y\'=x+y \\)。',
            sol: '<p>令 \\( u=x+y \\)，则 \\( u\'=1+y\'=1+u \\)，化为可分离方程 \\( \\dfrac{\\mathrm{d}u}{1+u}=\\mathrm{d}x \\)。</p>' +
              '<p>积分得 \\( \\ln|1+u|=x+C_1 \\)，即 \\( 1+u=C\\mathrm{e}^{x} \\)。</p>' +
              '<p>回代 \\( u=x+y \\)：\\( y=C\\mathrm{e}^{x}-x-1 \\)。</p>'
          }
        ],
        pitfalls: [
          '分离变量时若除以含 \\( y \\) 的因式，必须单独检查对应的常数解是否遗漏（如 \\( y\'=y \\) 的常数解 \\( y\\equiv 0 \\)）。',
          '一阶线性方程必须先化为标准形 \\( y\'+P(x)y=Q(x) \\) 再套公式：符号、系数位置对应错是最常见的失分点。',
          '伯努利方程换元后要把 \\( z \\) 换回 \\( y \\)，并且换元前先检查 \\( y=0 \\) 是否为解。',
          '全微分方程要求 \\( \\dfrac{\\partial M}{\\partial y}=\\dfrac{\\partial N}{\\partial x} \\) 在单连通区域上恒成立；条件不满足时不能使用，可尝试积分因子或其他方法。'
        ]
      },

      /* ---------------- 8.3 ---------------- */
      {
        id: 'ch8-s3', num: '8.3', title: '可降阶的高阶方程',
        lead: '大纲要求：会用降阶法解下列形式的微分方程：y⁽ⁿ⁾ = f(x)，y″ = f(x, y′) 和 y″ = f(y, y′)。',
        blocks: [
          { t: 'h3', idx: '①', text: 'y⁽ⁿ⁾ = f(x) 型' },
          { t: 'card', kind: 'key', tag: '解法', title: '逐次积分', html:
            '<p class="tight">方程右端只含自变量 \\( x \\)，连续积分 \\( n \\) 次即得通解，每次积分都要加上一个任意常数，共得 \\( n \\) 个独立常数。</p>' +
            '<div class="fml">\\( y^{(n)}=f(x)\\ \\Longrightarrow\\ y^{(n-1)}=\\int f(x)\\,\\mathrm{d}x+C_1\\ \\Longrightarrow\\ \\cdots\\ \\Longrightarrow\\ y=\\underbrace{\\int\\cdots\\int}_{n\\ \\text{次}}f(x)\\,\\mathrm{d}x^n+C_1x^{n-1}+\\cdots+C_n \\)</div>'
          },
          { t: 'h3', idx: '②', text: 'y″ = f(x, y′) 型（方程中不显含 y）' },
          { t: 'card', kind: 'key', tag: '解法', title: '令 p = y′(x)', html:
            '<p class="tight">令 \\( p=y\' \\)，则 \\( y\'\'=p\' \\)，方程化为关于 \\( p \\) 与 \\( x \\) 的一阶方程</p>' +
            '<div class="fml">\\( p\'=f(x,p) \\)</div>' +
            '<p class="tight">解出 \\( p=\\varphi(x,C_1) \\) 后，再积分一次：\\( y=\\int\\varphi(x,C_1)\\,\\mathrm{d}x+C_2 \\)。</p>'
          },
          { t: 'h3', idx: '③', text: 'y″ = f(y, y′) 型（方程中不显含 x）' },
          { t: 'card', kind: 'key', tag: '解法', title: '令 p = y′，并视 p 为 y 的函数', html:
            '<p class="tight">令 \\( p=y\'(x) \\)，由复合函数求导法则</p>' +
            '<div class="fml">\\( y\'\'=\\dfrac{\\mathrm{d}p}{\\mathrm{d}x}=\\dfrac{\\mathrm{d}p}{\\mathrm{d}y}\\cdot\\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=p\\dfrac{\\mathrm{d}p}{\\mathrm{d}y} \\)</div>' +
            '<p class="tight">方程化为 \\( p\\dfrac{\\mathrm{d}p}{\\mathrm{d}y}=f(y,p) \\)，这是关于 \\( y \\) 与 \\( p \\) 的一阶方程；解出 \\( p=\\varphi(y,C_1) \\) 后，再由 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=\\varphi(y,C_1) \\) 分离变量积分。</p>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '两种降阶不能混用', html:
            '<p class="tight"><b>缺 y 用 \\( p=y\'(x) \\)</b>（对 \\( x \\) 求导，\\( y\'\'=p\' \\)）；<b>缺 x 用 \\( p=p(y) \\)</b>（\\( y\'\'=p\\dfrac{\\mathrm{d}p}{\\mathrm{d}y} \\)）。判断口诀：<b>看方程里缺谁</b>——不显含 \\( y \\) 对 \\( x \\) 降阶，不显含 \\( x \\) 把 \\( p \\) 看成 \\( y \\) 的函数。</p>'
          },
          { t: 'viz', build: 'reducibleODE', title: '可降阶高阶方程的积分与降阶', sub: '切换两类方程：y″ = f(x) 播放逐次积分生成曲线族；缺 x 型观察 p = p(y) 降阶后的曲线族' },
          { t: 'h3', idx: '④', text: '选择降阶方式' },
          { t: 'list', items: [
            '只含 \\( x \\) 与 \\( y \\) 的最高阶导数 → 逐次积分；',
            '方程中出现 \\( y\' \\) 但不出现 \\( y \\) → 令 \\( p=y\'(x) \\)；',
            '方程中出现 \\( y \\) 但不出现 \\( x \\) → 令 \\( p=p(y) \\)；',
            '含 \\( y \\) 与 \\( y\' \\) 且可整理为 \\( (yy\')\'=0 \\) 等全导数形式时，可直接积分（见例 8.12 的技巧）。'
          ]}
        ],
        examples: [
          {
            no: '例 8.10', meta: '基础 · 逐次积分',
            q: '求方程 \\( y\'\'\'=\\mathrm{e}^{2x} \\) 的通解，并求满足 \\( y(0)=0,\\ y\'(0)=0,\\ y\'\'(0)=0 \\) 的特解。',
            sol: '<p>连续积分三次：\\( y\'\'=\\dfrac12\\mathrm{e}^{2x}+C_1 \\)，\\( y\'=\\dfrac14\\mathrm{e}^{2x}+C_1x+C_2 \\)，\\( y=\\dfrac18\\mathrm{e}^{2x}+\\dfrac{C_1}{2}x^2+C_2x+C_3 \\)。</p>' +
              '<p>代入初值：由 \\( y\'\'(0)=0 \\) 得 \\( C_1=-\\dfrac12 \\)；由 \\( y\'(0)=0 \\) 得 \\( C_2=-\\dfrac14 \\)；由 \\( y(0)=0 \\) 得 \\( C_3=-\\dfrac18 \\)。</p>' +
              '<p>故特解为 \\( y=\\dfrac18\\mathrm{e}^{2x}-\\dfrac{x^2}{4}-\\dfrac{x}{4}-\\dfrac18 \\)。</p>'
          },
          {
            no: '例 8.11', meta: '综合 · y″ = f(x, y′) 型',
            q: '求方程 \\( y\'\'=1+(y\')^{2} \\) 的通解。',
            sol: '<p>方程不显含 \\( y \\)，令 \\( p=y\' \\)，则 \\( p\'=1+p^{2} \\)，分离变量：\\( \\dfrac{\\mathrm{d}p}{1+p^{2}}=\\mathrm{d}x \\)。</p>' +
              '<p>积分得 \\( \\arctan p=x+C_1 \\)，即 \\( p=\\tan(x+C_1) \\)。</p>' +
              '<p>再积分：\\( y=\\displaystyle\\int\\tan(x+C_1)\\,\\mathrm{d}x=-\\ln|\\cos(x+C_1)|+C_2 \\)，即通解 \\( y=-\\ln|\\cos(x+C_1)|+C_2 \\)。</p>'
          },
          {
            no: '例 8.12', meta: '拔高 · y″ = f(y, y′) 型',
            q: '求方程 \\( yy\'\'+(y\')^{2}=0 \\) 满足 \\( y(0)=1,\\ y\'(0)=\\dfrac12 \\) 的特解。',
            sol: '<p>方程不显含 \\( x \\)，令 \\( p=y\' \\)，则 \\( y\'\'=p\\dfrac{\\mathrm{d}p}{\\mathrm{d}y} \\)，代入得 \\( yp\\dfrac{\\mathrm{d}p}{\\mathrm{d}y}+p^{2}=0 \\)，即 \\( p\\left(y\\dfrac{\\mathrm{d}p}{\\mathrm{d}y}+p\\right)=0 \\)。</p>' +
              '<p>\\( p=0 \\) 对应常数解，不满足 \\( y\'(0)=\\dfrac12 \\)，舍去；于是 \\( y\\dfrac{\\mathrm{d}p}{\\mathrm{d}y}=-p \\)，即 \\( \\dfrac{\\mathrm{d}p}{p}=-\\dfrac{\\mathrm{d}y}{y} \\)，积分得 \\( p=\\dfrac{C_1}{y} \\)。</p>' +
              '<p>即 \\( y\\dfrac{\\mathrm{d}y}{\\mathrm{d}x}=C_1 \\)，积分得 \\( \\dfrac{y^2}{2}=C_1x+C_2 \\)。</p>' +
              '<p>代入初值：\\( y(0)=1\\Rightarrow C_2=\\dfrac12 \\)；又 \\( y\'=\\dfrac{C_1}{y} \\)，故 \\( C_1=1\\cdot\\dfrac12=\\dfrac12 \\)。</p>' +
              '<p>所以 \\( y^2=x+1 \\)，取正值分支得特解 \\( y=\\sqrt{1+x} \\)。</p>' +
              '<p><b>另解（全导数技巧）</b>：\\( yy\'\'+(y\')^{2}=\\left(yy\'\\right)\'=0 \\Rightarrow yy\'=C_1 \\)，同上。</p>'
          }
        ],
        pitfalls: [
          '降阶时两类代换不能混用：缺 \\( y \\) 用 \\( y\'\'=p\' \\)（\\( p=p(x) \\)），缺 \\( x \\) 用 \\( y\'\'=p\\dfrac{\\mathrm{d}p}{\\mathrm{d}y} \\)（\\( p=p(y) \\)）。',
          '逐次积分时每积分一次都要加一个常数，常数漏加会直接导致通解不完整。',
          '用初始条件定常数要“尽早使用”：在求出 \\( p \\) 后即可先定一部分常数，可简化后续积分（如例 8.12 中 \\( p=\\dfrac{C_1}{y} \\) 结合初值）。'
        ]
      },

      /* ---------------- 8.4 ---------------- */
      {
        id: 'ch8-s4', num: '8.4', title: '线性微分方程解的结构',
        lead: '大纲要求：理解线性微分方程解的性质及解的结构。',
        blocks: [
          { t: 'h3', idx: '①', text: '二阶线性齐次方程解的结构' },
          { t: 'fml', html:
            '<div class="fml-row"><b>二阶线性齐次方程：</b>\\( y\'\'+P(x)y\'+Q(x)y=0 \\)</div>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '叠加原理', html:
            '<p class="tight">若 \\( y_1(x),\\ y_2(x) \\) 都是齐次方程的解，则对任意常数 \\( C_1,C_2 \\)，\\( C_1y_1+C_2y_2 \\) 也是该齐次方程的解。</p>'
          },
          { t: 'card', kind: 'def', tag: '定义', title: '线性相关与线性无关', html:
            '<p class="tight">设 \\( y_1(x),y_2(x) \\) 是区间 \\( I \\) 上的两个函数，若存在<b>不全为零</b>的常数 \\( k_1,k_2 \\)，使 \\( k_1y_1+k_2y_2\\equiv 0\\ (x\\in I) \\)，则称它们<b>线性相关</b>；否则称<b>线性无关</b>。</p>' +
            '<p class="tight"><b>实用判据：</b>两个函数线性无关 \\( \\iff \\) 它们的比值 \\( \\dfrac{y_2}{y_1} \\) 不是常数。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '齐次方程通解的结构', html:
            '<p class="tight">若 \\( y_1,y_2 \\) 是齐次方程的两个<b>线性无关</b>的解（称为基本解组），则方程的通解为</p>' +
            '<div class="fml">\\( y=C_1y_1(x)+C_2y_2(x) \\)</div>'
          },
          { t: 'card', kind: 'tip', tag: '了解', title: '朗斯基行列式', html:
            '<p class="tight">\\( W(x)=\\begin{vmatrix}y_1&y_2\\\\ y_1\'&y_2\'\\end{vmatrix}=y_1y_2\'-y_1\'y_2 \\)。两个解线性无关 \\( \\iff W(x)\\neq 0 \\)，且此时 \\( W(x) \\) 在区间上恒不为零。</p>'
          },
          { t: 'h3', idx: '②', text: '二阶线性非齐次方程解的结构' },
          { t: 'fml', html:
            '<div class="fml-row"><b>二阶线性非齐次方程：</b>\\( y\'\'+P(x)y\'+Q(x)y=f(x) \\)</div>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '非齐次方程通解的结构', html:
            '<ul class="none">' +
            '<li>若 \\( y^* \\) 是非齐次方程的某个特解，\\( Y \\) 是对应齐次方程的通解，则非齐次方程的通解为 \\( y=Y+y^* \\)；</li>' +
            '<li>若 \\( y_1^*,y_2^* \\) 都是非齐次方程的解，则 \\( y_1^*-y_2^* \\) 是对应<b>齐次</b>方程的解；</li>' +
            '<li>（叠加原理）若 \\( y_1^*,y_2^* \\) 分别是自由项为 \\( f_1,f_2 \\) 的非齐次方程的解，则 \\( y_1^*+y_2^* \\) 是自由项为 \\( f_1+f_2 \\) 的非齐次方程的解。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'odeStructure', title: '线性方程解的结构：Y + y* = 通解', sub: '切换齐次叠加与非齐次结构，播放“齐次通解 + 特解 = 通解”的叠加过程，并做数值验证' },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '“结构定理”的常考题型', html:
            '<ul class="none">' +
            '<li>给三个非齐次解，求通解：任取两个作差得齐次解，选线性无关的两个作 \\( Y \\)，再任取一个作 \\( y^* \\)；</li>' +
            '<li>给齐次基本解组加一个特解，写出通解并反求方程；</li>' +
            '<li>对 \\( f=f_1+f_2 \\) 分块求特解再相加（见 8.5 节待定系数法）。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '解的结构定理的适用范围' },
          { t: 'list', items: [
            '叠加原理与“通解 = 齐次通解 + 特解”只对<b>线性</b>方程成立；',
            '对非线性方程（如伯努利方程）不能套用；',
            '判断两个解是否构成基本解组时，务必验证线性无关（比值为常数则相关）。'
          ]}
        ],
        examples: [
          {
            no: '例 8.13', meta: '基础 · 验证基本解组',
            q: '验证 \\( y_1=\\mathrm{e}^{x},\\ y_2=\\mathrm{e}^{-x} \\) 是方程 \\( y\'\'-y=0 \\) 的两个线性无关解，并写出通解。',
            sol: '<p>代入验证：\\( (\\mathrm{e}^{x})\'\'-\\mathrm{e}^{x}=\\mathrm{e}^{x}-\\mathrm{e}^{x}=0 \\)；同理 \\( (\\mathrm{e}^{-x})\'\'-\\mathrm{e}^{-x}=0 \\)。</p>' +
              '<p>线性无关性：\\( \\dfrac{y_2}{y_1}=\\mathrm{e}^{-2x} \\) 不是常数，故线性无关。</p>' +
              '<p>所以通解为 \\( y=C_1\\mathrm{e}^{x}+C_2\\mathrm{e}^{-x} \\)。</p>'
          },
          {
            no: '例 8.14', meta: '综合 · 由三个特解求通解',
            q: '设 \\( y_1=x,\\ y_2=x+\\mathrm{e}^{x},\\ y_3=x+1 \\) 都是某二阶非齐次线性微分方程的解，写出该方程的通解。',
            sol: '<p>由结构定理，非齐次方程两解之差是对应齐次方程的解：</p>' +
              '<p>\\( y_2-y_1=\\mathrm{e}^{x},\\qquad y_3-y_1=1 \\)，均为齐次方程的解。</p>' +
              '<p>二者比值 \\( \\dfrac{\\mathrm{e}^{x}}{1}=\\mathrm{e}^{x} \\) 不是常数，线性无关，故齐次方程通解为 \\( Y=C_1\\mathrm{e}^{x}+C_2 \\)。</p>' +
              '<p>取非齐次特解 \\( y^*=y_1=x \\)，得原方程通解 \\( y=C_1\\mathrm{e}^{x}+C_2+x \\)。</p>'
          },
          {
            no: '例 8.15', meta: '拔高 · 验证变系数方程的解',
            q: '验证 \\( y_1=x,\\ y_2=\\dfrac1x\\ (x>0) \\) 是方程 \\( x^2y\'\'+xy\'-y=0 \\) 的两个线性无关解，并写出通解。',
            sol: '<p>对 \\( y_1=x \\)：\\( y_1\'=1,\\ y_1\'\'=0 \\)，代入得 \\( x^2\\cdot 0+x\\cdot 1-x=0 \\)，成立。</p>' +
              '<p>对 \\( y_2=\\dfrac1x \\)：\\( y_2\'=-\\dfrac{1}{x^2},\\ y_2\'\'=\\dfrac{2}{x^3} \\)，代入得 \\( x^2\\cdot\\dfrac{2}{x^3}+x\\cdot\\left(-\\dfrac{1}{x^2}\\right)-\\dfrac1x=\\dfrac{2}{x}-\\dfrac1x-\\dfrac1x=0 \\)，成立。</p>' +
              '<p>比值 \\( \\dfrac{y_2}{y_1}=\\dfrac{1}{x^2} \\) 不是常数，线性无关。故通解为 \\( y=C_1x+\\dfrac{C_2}{x} \\)（这正是 8.5 节的欧拉方程）。</p>'
          }
        ],
        pitfalls: [
          '“线性无关”不等于“两个函数不相同”：只要比值是常数就线性相关，如 \\( y \\) 与 \\( 2y \\)、\\( \\mathrm{e}^x \\) 与 \\( 3\\mathrm{e}^x \\)。',
          '非齐次方程两解之差是齐次解，而不是非齐次解；非齐次方程两解之和一般也不再是原方程的解（其自由项会变成 \\( 2f \\)）。',
          '解的结构定理只属于线性方程：伯努利方程、\\( y\'=y^2 \\) 等非线性方程不能写成“齐次通解 + 特解”。'
        ]
      },

      /* ---------------- 8.5 ---------------- */
      {
        id: 'ch8-s5', num: '8.5', title: '常系数线性微分方程',
        lead: '大纲要求：掌握二阶常系数齐次线性微分方程的解法，并会解某些高于二阶的常系数齐次线性微分方程；会解自由项为多项式、指数函数、正弦函数、余弦函数以及它们的和与积的二阶常系数非齐次线性微分方程；会解欧拉方程。',
        blocks: [
          { t: 'h3', idx: '①', text: '二阶常系数齐次线性微分方程' },
          { t: 'fml', html:
            '<div class="fml-row"><b>方程：</b>\\( y\'\'+py\'+qy=0 \\)（\\( p,q \\) 为常数）；<b>特征方程：</b>\\( r^{2}+pr+q=0 \\)。</div>' +
            '<div class="fml-row">解法：写出特征方程并求根，再按根的类型直接写出通解。</div>'
          },
          { t: 'table', head: ['判别式 \\( \\Delta=p^2-4q \\)', '特征根', '通解'], rows: [
            ['\\( \\Delta>0 \\)', '两个不等实根 \\( r_1,r_2 \\)', '\\( y=C_1\\mathrm{e}^{r_1x}+C_2\\mathrm{e}^{r_2x} \\)'],
            ['\\( \\Delta=0 \\)', '二重实根 \\( r=-\\dfrac p2 \\)', '\\( y=(C_1+C_2x)\\mathrm{e}^{rx} \\)'],
            ['\\( \\Delta<0 \\)', '共轭复根 \\( \\alpha\\pm\\beta\\mathrm{i} \\)', '\\( y=\\mathrm{e}^{\\alpha x}\\left(C_1\\cos\\beta x+C_2\\sin\\beta x\\right) \\)']
          ]},
          { t: 'viz', build: 'secondOrderODE', title: '特征根类型与解的形态', sub: '拖动 p、q 改变特征方程，观察两个不等实根、二重根、共轭复根对应的解曲线' },
          { t: 'h3', idx: '②', text: '高于二阶的常系数齐次方程' },
          { t: 'p', html: '方法与二阶完全类似：写出特征方程并求出全部特征根，按根的重数写出对应的线性无关解（复数根成对出现）。' },
          { t: 'list', items: [
            '<b>单实根 \\( r \\)</b>：给出一个解 \\( \\mathrm{e}^{rx} \\)；',
            '<b>k 重实根 \\( r \\)</b>：给出 k 个解 \\( \\mathrm{e}^{rx},\\ x\\mathrm{e}^{rx},\\ \\cdots,\\ x^{k-1}\\mathrm{e}^{rx} \\)，即 \\( \\mathrm{e}^{rx}(C_1+C_2x+\\cdots+C_kx^{k-1}) \\)；',
            '<b>单复根 \\( \\alpha\\pm\\beta\\mathrm{i} \\)</b>：给出 \\( \\mathrm{e}^{\\alpha x}\\cos\\beta x,\\ \\mathrm{e}^{\\alpha x}\\sin\\beta x \\)；',
            '<b>k 重复根 \\( \\alpha\\pm\\beta\\mathrm{i} \\)</b>：给出 \\( \\mathrm{e}^{\\alpha x}\\left[(C_1+\\cdots+C_kx^{k-1})\\cos\\beta x+(D_1+\\cdots+D_kx^{k-1})\\sin\\beta x\\right] \\)。'
          ]},
          { t: 'h3', idx: '③', text: '二阶常系数非齐次方程与待定系数法' },
          { t: 'fml', html:
            '<div class="fml-row"><b>方程：</b>\\( y\'\'+py\'+qy=f(x) \\)；<b>通解结构：</b>\\( y=Y+y^* \\)，其中 \\( Y \\) 是齐次通解，\\( y^* \\) 是一个特解。</div>'
          },
          { t: 'table', head: ['自由项 f(x)', '特解 \\( y^* \\) 的形式', 'k 的取法'], rows: [
            ['\\( P_m(x) \\)（m 次多项式）', '\\( y^*=x^{k}Q_m(x) \\)', 'k = \\( \\lambda=0 \\) 作为特征根的重数（0 或 1）'],
            ['\\( P_m(x)\\mathrm{e}^{\\lambda x} \\)', '\\( y^*=x^{k}Q_m(x)\\mathrm{e}^{\\lambda x} \\)', 'k = \\( \\lambda \\) 作为特征根的重数（0、1、2）'],
            ['\\( \\mathrm{e}^{\\alpha x}\\left[P_l(x)\\cos\\beta x+P_m(x)\\sin\\beta x\\right] \\)', '\\( y^*=x^{k}\\mathrm{e}^{\\alpha x}\\left[R_n(x)\\cos\\beta x+S_n(x)\\sin\\beta x\\right] \\)', '\\( n=\\max(l,m) \\)；k = \\( \\alpha+\\beta\\mathrm{i} \\) 是否为特征根（0 或 1）']
          ]},
          { t: 'p', html: '表中 \\( Q_m,R_n,S_n \\) 是与 \\( P_m \\) 同次的待定多项式；把设好的 \\( y^* \\) 代入原方程，比较同类项系数即得。' },
          { t: 'card', kind: 'warn', tag: '易错', title: '重根要乘 xᵏ', html:
            '<p class="tight">当自由项中的 \\( \\lambda \\)（或 \\( \\alpha+\\beta\\mathrm{i} \\)）恰好是特征根时，必须乘 \\( x^k \\)（k 为重数）。例如 \\( y\'\'-y\'=\\mathrm{e}^{x} \\) 中 \\( \\lambda=1 \\) 是单根，应设 \\( y^*=ax\\mathrm{e}^{x} \\) 而不是 \\( a\\mathrm{e}^{x} \\)；\\( y\'\'-2y\'+y=\\mathrm{e}^{x} \\) 中 \\( \\lambda=1 \\) 是二重根，应设 \\( y^*=ax^{2}\\mathrm{e}^{x} \\)。</p>'
          },
          { t: 'card', kind: 'tip', tag: '技巧', title: '自由项为和或积', html:
            '<ul class="none">' +
            '<li><b>和</b>：由叠加原理，对 \\( f=f_1+f_2 \\) 分别求 \\( y_1^*,y_2^* \\)，则 \\( y^*=y_1^*+y_2^* \\)；</li>' +
            '<li><b>积</b>：如 \\( x\\mathrm{e}^{x} \\)、\\( \\mathrm{e}^{x}\\cos x \\) 本身就是表中第二、三行的形式，直接查表；</li>' +
            '<li>多项式与三角函数相乘（如 \\( x\\sin x \\)）也属于第三行（\\( P_l \\) 或 \\( P_m \\) 取多项式、另一个取零）。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '④', text: '欧拉方程' },
          { t: 'fml', html:
            '<div class="fml-row"><b>欧拉方程：</b>\\( x^{2}y\'\'+pxy\'+qy=f(x)\\quad(x>0) \\)</div>' +
            '<div class="fml-row"><b>换元：</b>令 \\( x=\\mathrm{e}^{t} \\)（即 \\( t=\\ln x \\)），则 \\( xy\'=\\dfrac{\\mathrm{d}y}{\\mathrm{d}t},\\qquad x^{2}y\'\'=\\dfrac{\\mathrm{d}^{2}y}{\\mathrm{d}t^{2}}-\\dfrac{\\mathrm{d}y}{\\mathrm{d}t} \\)。</div>'
          },
          { t: 'p', html: '换元后方程化为关于 \\( t \\) 的常系数线性方程，求出 \\( y(t) \\) 后把 \\( t=\\ln x \\) 代回即可。齐次欧拉方程也可直接令 \\( y=x^{r} \\)，代入得代数方程 \\( r(r-1)+pr+q=0 \\)，按根的类型写解。' },
          { t: 'card', kind: 'warn', tag: '注意', title: '欧拉方程的适用前提', html:
            '<p class="tight">换元 \\( x=\\mathrm{e}^{t} \\) 要求 \\( x>0 \\)，此时 \\( t=\\ln x \\) 为实值；若 \\( x<0 \\) 可令 \\( x=-\\mathrm{e}^{t} \\)（了解）。另外求出通解后必须换回 \\( x \\)，不能把 \\( t \\) 留在答案里。</p>'
          },
          { t: 'h3', idx: '⑤', text: '求解流程' },
          { t: 'list', items: [
            '判断方程类型：齐次/非齐次、常系数/变系数（欧拉）；',
            '齐次：写特征方程 → 求特征根 → 按三种情形写通解；',
            '非齐次：先求齐次通解 \\( Y \\)，再按自由项类型设特解 \\( y^* \\)（注意重根乘 \\( x^k \\)），代回定系数；',
            '欧拉方程：换元 \\( x=\\mathrm{e}^{t} \\) 或令 \\( y=x^{r} \\)；',
            '写出 \\( y=Y+y^* \\)，若是欧拉方程记得把 \\( t \\) 换回 \\( x \\)。'
          ]}
        ],
        examples: [
          {
            no: '例 8.16', meta: '基础 · 共轭复根',
            q: '求方程 \\( y\'\'-2y\'+5y=0 \\) 的通解。',
            sol: '<p>特征方程 \\( r^{2}-2r+5=0 \\)，判别式 \\( \\Delta=4-20=-16<0 \\)，根为 \\( r=1\\pm 2\\mathrm{i} \\)。</p>' +
              '<p>由共轭复根情形（\\( \\alpha=1,\\ \\beta=2 \\)），通解为 \\( y=\\mathrm{e}^{x}\\left(C_1\\cos 2x+C_2\\sin 2x\\right) \\)。</p>'
          },
          {
            no: '例 8.17', meta: '综合 · 指数与多项式之积（单重根）',
            q: '求方程 \\( y\'\'-3y\'+2y=x\\mathrm{e}^{x} \\) 的通解。',
            sol: '<p>齐次方程 \\( y\'\'-3y\'+2y=0 \\)：特征方程 \\( r^{2}-3r+2=0 \\) 的根为 \\( r_1=1,\\ r_2=2 \\)，故 \\( Y=C_1\\mathrm{e}^{x}+C_2\\mathrm{e}^{2x} \\)。</p>' +
              '<p>自由项 \\( x\\mathrm{e}^{x} \\) 中 \\( \\lambda=1 \\) 是单重特征根，故设 \\( y^*=x(ax+b)\\mathrm{e}^{x}=\\left(ax^{2}+bx\\right)\\mathrm{e}^{x} \\)。</p>' +
              '<p>代入原方程化简得 \\( \\mathrm{e}^{x}\\left[-2ax+(2a-b)\\right]=x\\mathrm{e}^{x} \\)，比较系数：\\( -2a=1,\\ 2a-b=0 \\)，解得 \\( a=-\\dfrac12,\\ b=-1 \\)。</p>' +
              '<p>于是 \\( y^*=-\\left(\\dfrac{x^{2}}{2}+x\\right)\\mathrm{e}^{x} \\)，通解为 \\( y=C_1\\mathrm{e}^{x}+C_2\\mathrm{e}^{2x}-\\left(\\dfrac{x^{2}}{2}+x\\right)\\mathrm{e}^{x} \\)。</p>'
          },
          {
            no: '例 8.18', meta: '拔高 · 自由项为和（叠加原理）',
            q: '求方程 \\( y\'\'+y=x+\\cos x \\) 的通解。',
            sol: '<p>齐次方程 \\( y\'\'+y=0 \\)：\\( r=\\pm\\mathrm{i} \\)，故 \\( Y=C_1\\cos x+C_2\\sin x \\)。</p>' +
              '<p><b>（1）\\( f_1=x \\)</b>：\\( \\lambda=0 \\) 不是特征根，设 \\( y_1^*=ax+b \\)，代入得 \\( ax+b=x \\)，故 \\( a=1,b=0 \\)，即 \\( y_1^*=x \\)。</p>' +
              '<p><b>（2）\\( f_2=\\cos x \\)</b>：\\( \\alpha+\\beta\\mathrm{i}=\\mathrm{i} \\) 是特征根（单重），设 \\( y_2^*=x(a\\cos x+b\\sin x) \\)。代入得 \\( -2a\\sin x+2b\\cos x=\\cos x \\)，故 \\( a=0,\\ b=\\dfrac12 \\)，即 \\( y_2^*=\\dfrac x2\\sin x \\)。</p>' +
              '<p>由叠加原理，通解为 \\( y=C_1\\cos x+C_2\\sin x+x+\\dfrac x2\\sin x \\)。</p>'
          },
          {
            no: '例 8.19', meta: '拔高 · 欧拉方程',
            q: '求方程 \\( x^{2}y\'\'-xy\'+y=x\\quad(x>0) \\) 的通解。',
            sol: '<p>令 \\( x=\\mathrm{e}^{t} \\)，则 \\( xy\'=\\dfrac{\\mathrm{d}y}{\\mathrm{d}t},\\ x^{2}y\'\'=\\dfrac{\\mathrm{d}^{2}y}{\\mathrm{d}t^{2}}-\\dfrac{\\mathrm{d}y}{\\mathrm{d}t} \\)，代入得</p>' +
              '<p>\\( \\dfrac{\\mathrm{d}^{2}y}{\\mathrm{d}t^{2}}-2\\dfrac{\\mathrm{d}y}{\\mathrm{d}t}+y=\\mathrm{e}^{t} \\)。</p>' +
              '<p>特征方程 \\( r^{2}-2r+1=(r-1)^{2}=0 \\)，二重根 \\( r=1 \\)，故齐次通解 \\( Y=(C_1+C_2t)\\mathrm{e}^{t} \\)。</p>' +
              '<p>自由项 \\( \\mathrm{e}^{t} \\) 中 \\( \\lambda=1 \\) 是二重特征根，设 \\( y^*=At^{2}\\mathrm{e}^{t} \\)，代入得 \\( 2A\\mathrm{e}^{t}=\\mathrm{e}^{t} \\)，即 \\( A=\\dfrac12 \\)。</p>' +
              '<p>故 \\( y(t)=\\left(C_1+C_2t\\right)\\mathrm{e}^{t}+\\dfrac12t^{2}\\mathrm{e}^{t} \\)，回代 \\( t=\\ln x,\\ \\mathrm{e}^{t}=x \\)：</p>' +
              '<p>\\( y=(C_1+C_2\\ln x)x+\\dfrac x2\\ln^{2}x \\)。</p>'
          }
        ],
        pitfalls: [
          '设特解的关键是看自由项中的 \\( \\lambda \\)（或 \\( \\alpha+\\beta\\mathrm{i} \\)）是否为特征根、是几重根；重根漏乘 \\( x^{k} \\) 是本节最高频的错误。',
          '非齐次特解用待定系数法求出后不需要再加任意常数：常数信息已全部包含在齐次通解 \\( Y \\) 中。',
          '自由项为“和”时要分别求特解再相加（叠加原理），不要整体设成一个混合形式导致待定系数无法匹配。',
          '欧拉方程换元后解出的是 \\( y(t) \\)，必须换回 \\( x \\)；同时注意 \\( x>0 \\) 的前提，别把 \\( \\ln x \\) 写成 \\( \\ln|x| \\) 的随意形式。'
        ]
      },

      /* ---------------- 8.6 ---------------- */
      {
        id: 'ch8-s6', num: '8.6', title: '微分方程的应用',
        lead: '大纲要求：会用微分方程解决一些简单的应用问题（几何、物理、增长衰减等）。',
        blocks: [
          { t: 'h3', idx: '①', text: '几何应用' },
          { t: 'list', items: [
            '切线斜率：\\( k=y\' \\)；法线斜率：\\( -\\dfrac{1}{y\'} \\)；',
            '曲线所围面积、弧长、旋转体体积：先用定积分写出几何量，再对参数求导建立方程；',
            '“截距”类条件：切线在 \\( x \\) 轴上的截距为 \\( x-\\dfrac{y}{y\'} \\)，在 \\( y \\) 轴上的截距为 \\( y-xy\' \\)。'
          ]},
          { t: 'card', kind: 'key', tag: '必记', title: '切线截距公式', html:
            '<p class="tight">过点 \\( (x,y) \\) 的切线方程为 \\( Y-y=y\'(X-x) \\)：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">令 \\( Y=0 \\)：\\( x \\) 轴截距 \\( =x-\\dfrac{y}{y\'} \\)；</div>' +
            '<div class="fml-row">令 \\( X=0 \\)：\\( y \\) 轴截距 \\( =y-xy\' \\)。</div>' +
            '</div>'
          },
          { t: 'h3', idx: '②', text: '物理、生物与经济中的应用模型' },
          { t: 'table', head: ['模型', '微分方程', '解'], rows: [
            ['指数增长 / 衰减', '\\( \\dfrac{\\mathrm{d}N}{\\mathrm{d}t}=rN \\)', '\\( N=N_0\\mathrm{e}^{rt} \\)（\\( r>0 \\) 增长，\\( r<0 \\) 衰减）'],
            ['冷却（牛顿）定律', '\\( \\dfrac{\\mathrm{d}T}{\\mathrm{d}t}=-k(T-T_m) \\)', '\\( T=T_m+(T_0-T_m)\\mathrm{e}^{-kt} \\)'],
            ['逻辑斯蒂人口模型', '\\( \\dfrac{\\mathrm{d}N}{\\mathrm{d}t}=rN\\left(1-\\dfrac NK\\right) \\)', '\\( N=\\dfrac{K}{1+\\left(\\frac{K}{N_0}-1\\right)\\mathrm{e}^{-rt}} \\)'],
            ['阻力下的落体运动', '\\( m\\dfrac{\\mathrm{d}v}{\\mathrm{d}t}=mg-kv \\)', '\\( v=\\dfrac{mg}{k}\\left(1-\\mathrm{e}^{-kt/m}\\right) \\)']
          ]},
          { t: 'h3', idx: '③', text: '用微分方程建模的一般步骤' },
          { t: 'list', items: [
            '设未知函数并明确自变量（时间常记作 \\( t \\)，几何量常记作 \\( x \\)）；',
            '把“变化率 = ⋯”翻译成微分方程，注意正负号的物理含义；',
            '由题设写出初始条件；',
            '判断方程类型并求解（可分离、线性、一阶或高阶）；',
            '用初始条件确定常数，回答实际问题（必要时取极限、求最值或讨论单调性）。'
          ]},
          { t: 'h3', idx: '④', text: '解析解困难时的数值方法（了解）' },
          { t: 'card', kind: 'tip', tag: '欧拉法', title: '最简单的数值解法', html:
            '<p class="tight">对初值问题 \\( y\'=f(x,y),\\ y(x_0)=y_0 \\)，取步长 \\( h \\)，以折线逼近积分曲线：</p>' +
            '<div class="fml">\\( y_{n+1}=y_n+h\\,f(x_n,y_n),\\qquad x_{n+1}=x_n+h \\)</div>' +
            '<p class="tight">步长 \\( h \\) 越小精度越高，但计算量增大；实际计算可用改进欧拉法或龙格-库塔法。</p>'
          },
          { t: 'viz', build: 'eulerMethod', title: '欧拉法数值解与步长', sub: '以 y′=y−x, y(0)=1 为例，观察折线解随步长 h 变化的精度' }
        ],
        examples: [
          {
            no: '例 8.20', meta: '应用 · 冷却定律',
            q: '物体在空气中冷却，其温度下降速率与温度 \\( T \\) 和室温 20°C 之差成正比。已知物体初始温度为 100°C，10 分钟后为 60°C，求温度随时间的变化规律，并求 20 分钟后的温度。',
            sol: '<p>设 \\( T=T(t) \\)，由题意 \\( \\dfrac{\\mathrm{d}T}{\\mathrm{d}t}=-k(T-20) \\)，即 \\( T\'=-k(T-20) \\)（可分离方程）。</p>' +
              '<p>解得 \\( T=20+C\\mathrm{e}^{-kt} \\)，由 \\( T(0)=100 \\) 得 \\( C=80 \\)，即 \\( T=20+80\\mathrm{e}^{-kt} \\)。</p>' +
              '<p>由 \\( T(10)=60 \\)：\\( 40=80\\mathrm{e}^{-10k}\\Rightarrow \\mathrm{e}^{-10k}=\\dfrac12 \\)。</p>' +
              '<p>于是 \\( T(20)=20+80\\mathrm{e}^{-20k}=20+80\\times\\dfrac14=40 \\)，即 20 分钟后温度为 <b>40°C</b>。</p>'
          },
          {
            no: '例 8.21', meta: '应用 · 切线截距的几何条件',
            q: '设曲线 \\( y=f(x) \\) 过点 \\( (1,1) \\)，且曲线上任一点处的切线在 \\( x \\) 轴上的截距等于该点横坐标的 2 倍，求该曲线方程。',
            sol: '<p>由切线截距公式，条件为 \\( x-\\dfrac{y}{y\'}=2x \\)，即 \\( -\\dfrac{y}{y\'}=x \\)，整理得 \\( y\'=-\\dfrac yx \\)。</p>' +
              '<p>分离变量：\\( \\dfrac{\\mathrm{d}y}{y}=-\\dfrac{\\mathrm{d}x}{x} \\)，积分得 \\( \\ln|y|=-\\ln|x|+C_1 \\)，即 \\( y=\\dfrac Cx \\)。</p>' +
              '<p>代入 \\( y(1)=1 \\)：\\( C=1 \\)。故所求曲线为 \\( y=\\dfrac1x\\ (x>0) \\)。</p>'
          },
          {
            no: '例 8.22', meta: '应用 · 逻辑斯蒂模型',
            q: '某生物种群数量 \\( N(t) \\) 满足 \\( \\dfrac{\\mathrm{d}N}{\\mathrm{d}t}=N\\left(1-\\dfrac{N}{100}\\right) \\)，初始数量 \\( N(0)=10 \\)。求 \\( N(t) \\)，并求时间趋于无穷时种群数量的趋势。',
            sol: '<p>方程可分离：\\( \\dfrac{\\mathrm{d}N}{N\\left(1-\\frac{N}{100}\\right)}=\\mathrm{d}t \\)，左边部分分式分解为 \\( \\left(\\dfrac1N+\\dfrac{1/100}{1-\\frac{N}{100}}\\right)\\mathrm{d}N \\)。</p>' +
              '<p>积分得 \\( \\ln\\dfrac{N}{100-N}=t+C_1 \\)，即 \\( N=\\dfrac{100}{1+C\\mathrm{e}^{-t}} \\)。</p>' +
              '<p>由 \\( N(0)=10 \\) 得 \\( C=9 \\)，所以 \\( N(t)=\\dfrac{100}{1+9\\mathrm{e}^{-t}} \\)。</p>' +
              '<p>当 \\( t\\to+\\infty \\) 时 \\( \\mathrm{e}^{-t}\\to 0 \\)，故 \\( N(t)\\to 100 \\)：种群数量逐渐趋于环境容量 100。</p>'
          }
        ],
        pitfalls: [
          '初值条件是应用题的“灵魂”：解出含任意常数的通解后，必须用初始条件确定常数，否则无法回答具体问题。',
          '列方程时物理量的正负号要结合方向判断：冷却中温度高于室温时 \\( T-T_m>0 \\)，阻力方向总与速度方向相反，写错符号会得到荒谬的解。',
          '“速率”“增长率”等文字必须翻译成 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}t} \\) 或 \\( \\dfrac{\\mathrm{d}y}{\\mathrm{d}x} \\)；漏掉导数关系是建模失败的首要原因。',
          '求出解析解后要回到实际背景检验：定义域限制（如 \\( 2-\\mathrm{e}^x>0 \\)）、物理解量取正分支、极限趋势是否符合常识。'
        ]
      }
    ]
  };
})(window);
