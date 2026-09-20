/* ============================================================
   ch4.js — 第四章 随机变量的数字特征
   覆盖 2026 大纲「四、随机变量的数字特征」全部考试内容与考试要求
   大纲原文（OCR 自大纲 p.22）：
     考试内容：随机变量的数学期望（均值）、方差、标准差及其性质　随机变量
               函数的数学期望　矩、协方差、相关系数及其性质
     考试要求：1. 理解随机变量数字特征（数学期望、方差、标准差、矩、协方差、
                 相关系数）的概念，会运用数字特征的基本性质，并掌握常用分布的
                 数字特征；
               2. 会求随机变量函数的数学期望。
   注：切比雪夫不等式属第五章「大数定律和中心极限定理」，不在本章。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH4 = {
    id: 'ch4',
    no: '四',
    title: '随机变量的数字特征',
    subtitle: '用几个「数」浓缩随机变量的全部信息：期望刻画位置，方差刻画离散，协方差与相关系数刻画关联',
    tags: ['数学期望', '方差', '标准差', '随机变量函数的期望', '矩', '协方差', '相关系数', '不相关', '常用分布数字特征'],
    sections: [

      /* ================================================================
         4.1 数学期望
         ================================================================ */
      {
        id: 'ch4-s1',
        num: '4.1',
        title: '数学期望',
        lead: '数学期望是随机变量取值的「加权平均」，也是分布的「重心」—— 它是数字特征中最基本的一个。',
        blocks: [
          { t: 'h3', idx: '①', text: '离散型随机变量的数学期望' },
          { t: 'card', kind: 'def', tag: '定义', title: '数学期望（离散型）', html:
            '<p class="tight">设离散型随机变量 \\( X \\) 的分布律为 \\( P\\{X=x_k\\}=p_k\\ (k=1,2,\\cdots) \\)。若级数 \\( \\displaystyle\\sum_{k=1}^{\\infty}x_kp_k \\) <b>绝对收敛</b>，则称其和为 \\( X \\) 的<b>数学期望</b>（均值）：</p>' +
            '<div class="fml">\\( E(X)=\\sum_{k=1}^{\\infty}x_k\\,p_k \\)</div>' +
            '<p class="tight">若级数不绝对收敛，则称 \\( X \\) 的数学期望<b>不存在</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '直观', title: '为什么是「加权平均」？', html:
            '<p class="tight">把 \\( x_k \\) 看作可能取值、\\( p_k \\) 看作权重，则 \\( E(X) \\) 就是这些取值以概率为权的<b>加权算术平均</b>。</p>' +
            '<p class="tight">物理意义：若在数轴 \\( x_k \\) 处放置质量为 \\( p_k \\) 的质点，则 \\( E(X) \\) 恰是这套质点系的<b>重心</b>。</p>'
          },
          { t: 'viz', build: 'expectation', title: '期望＝分布的「重心」', sub: '拖动各点概率，观察期望（支点）如何移动' },
          { t: 'viz', build: 'expectationSim', title: '期望的频率模拟', sub: '切换总体分布，调节模拟轮数（最多 12），观察样本均值轨道收敛到 E(X)' },
          { t: 'h3', idx: '②', text: '连续型随机变量的数学期望' },
          { t: 'card', kind: 'def', tag: '定义', title: '数学期望（连续型）', html:
            '<p class="tight">设连续型随机变量 \\( X \\) 的概率密度为 \\( f(x) \\)。若积分 \\( \\displaystyle\\int_{-\\infty}^{+\\infty}x f(x)\\,\\mathrm{d}x \\) <b>绝对收敛</b>，则称其为 \\( X \\) 的<b>数学期望</b>：</p>' +
            '<div class="fml">\\( E(X)=\\int_{-\\infty}^{+\\infty}x\\,f(x)\\,\\mathrm{d}x \\)</div>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '「绝对收敛」不可省略', html:
            '<p class="tight">存在这样的随机变量：\\( \\int_{-\\infty}^{+\\infty} xf(x)\\mathrm{d}x \\) 作为<b>反常积分的柯西主值</b>存在，但 \\( \\int_{-\\infty}^{+\\infty}|x|f(x)\\mathrm{d}x=+\\infty \\)。此时按定义期望<b>不存在</b>。</p>' +
            '<p class="tight"><b>典型例子：</b>柯西分布 \\( f(x)=\\dfrac{1}{\\pi(1+x^2)} \\)，其 \\( E(X) \\) 不存在（这正是「期望不存在」的经典反例）。</p>'
          },
          { t: 'h3', idx: '③', text: '数学期望的性质' },
          { t: 'card', kind: 'thm', tag: '性质', title: '期望的四条基本性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 常数：</b>\\( E(C)=C \\)（\\( C \\) 为常数）</div>' +
            '<div class="fml-row"><b>2. 齐次性：</b>\\( E(CX)=C\\,E(X) \\)</div>' +
            '<div class="fml-row"><b>3. 可加性（无需独立）：</b>\\( E(X\\pm Y)=E(X)\\pm E(Y) \\)</div>' +
            '<div class="fml-row"><b>4. 乘积（需独立）：</b>若 \\( X,Y \\) 相互独立，则 \\( E(XY)=E(X)E(Y) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>推广（线性性，对任意 \\( X_1,\\cdots,X_n \\) 成立，无需独立）：</b></p>' +
            '<div class="fml">\\( E\\!\\left(\\sum_{i=1}^{n}C_iX_i\\right)=\\sum_{i=1}^{n}C_i\\,E(X_i) \\)</div>'
          },
          { t: 'card', kind: 'tip', tag: '辨析', title: '「可加性」与「乘积」的不对称', html:
            '<p class="tight">这是最容易记混的一对性质：</p>' +
            '<ul class="none">' +
            '<li><b>加减法永远可以拆</b>：\\( E(X\\pm Y)=E(X)\\pm E(Y) \\) —— <b>不要求独立</b>。</li>' +
            '<li><b>乘法拆开需要独立</b>：\\( E(XY)=E(X)E(Y) \\) —— <b>必须独立</b>（或至少不相关）。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>由分布律/密度求期望</b>：直接套定义式，注意求和/积分的范围。</li>' +
            '<li><b>利用性质化简</b>：把复杂随机变量拆成简单随机变量的线性组合。</li>' +
            '<li><b>期望不存在</b>：判断级数或积分是否绝对收敛。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 4.1', meta: '基础 · 离散型求期望',
            q: '设 \\( X \\) 的分布律为 \\( P\\{X=-1\\}=0.2,\\ P\\{X=0\\}=0.3,\\ P\\{X=1\\}=0.5 \\)。求 \\( E(X) \\) 与 \\( E(3X+2) \\)。',
            sol:
              '<div class="fml">\\( E(X)=(-1)\\times0.2+0\\times0.3+1\\times0.5=-0.2+0.5=\\mathbf{0.3} \\)</div>' +
              '<p>由线性性质：</p>' +
              '<div class="fml">\\( E(3X+2)=3E(X)+2=3\\times0.3+2=\\mathbf{2.9} \\)</div>' +
              '<p class="fml-note">也可直接按定义算：\\( (3(-1)+2)\\times0.2+(3\\cdot0+2)\\times0.3+(3\\cdot1+2)\\times0.5=-0.2+0.6+2.5=2.9 \\) ✓</p>'
          },
          {
            no: '例 4.2', meta: '真题改编 · 连续型求期望',
            q: '设 \\( X \\) 的概率密度为 \\( f(x)=\\begin{cases}2x, & 0\\leqslant x\\leqslant 1\\\\ 0, & \\text{其他}\\end{cases} \\)。求 \\( E(X) \\)。',
            sol:
              '<div class="fml">\\( E(X)=\\int_0^1 x\\cdot 2x\\,\\mathrm{d}x=2\\int_0^1 x^2\\mathrm{d}x=2\\cdot\\frac13=\\mathbf{\\dfrac23} \\)</div>' +
              '<p class="fml-note">自检：期望落在支撑集 \\( [0,1] \\) 内，且偏右（因密度随 \\( x \\) 增大），\\( 2/3>1/2 \\) 合理。</p>'
          },
          {
            no: '例 4.3', meta: '提高 · 期望不存在',
            q: '设 \\( X \\) 服从柯西分布，密度为 \\( f(x)=\\dfrac{1}{\\pi(1+x^2)},\\ -\\infty<x<+\\infty \\)。判断 \\( E(X) \\) 是否存在。',
            sol:
              '<p>考察绝对收敛性：</p>' +
              '<div class="fml">\\( \\int_{-\\infty}^{+\\infty}|x|\\cdot\\dfrac{1}{\\pi(1+x^2)}\\,\\mathrm{d}x=\\dfrac{2}{\\pi}\\int_0^{+\\infty}\\dfrac{x}{1+x^2}\\,\\mathrm{d}x=\\dfrac{1}{\\pi}\\ln(1+x^2)\\Big|_0^{+\\infty}=+\\infty \\)</div>' +
              '<p>积分发散，故 \\( E(X) \\) <b>不存在</b>。</p>' +
              '<p class="fml-note">注意：由于密度关于原点对称，若形式地写成 \\( \\int_{-\\infty}^{+\\infty}xf(x)\\mathrm{d}x \\)，它会以「\\( \\infty-\\infty \\)」的形式出现——这正是必须要求绝对收敛的原因。</p>'
          },
          {
            no: '例 4.4', meta: '提高 · 用可加性巧算',
            q: '将 \\( n \\) 个球随机放入 \\( N \\) 个盒子中（每个盒子容纳球数不限）。令 \\( X \\) 为空盒子的个数，求 \\( E(X) \\)。',
            sol:
              '<p><b>关键技巧：引入示性变量。</b>令</p>' +
              '<div class="fml">\\( X_i=\\begin{cases}1, & \\text{第 }i\\text{ 个盒子为空}\\\\ 0, & \\text{否则}\\end{cases}\\qquad i=1,2,\\cdots,N \\)</div>' +
              '<p>则 \\( X=\\sum_{i=1}^{N}X_i \\)。每个球都不落入第 \\( i \\) 个盒子的概率为 \\( \\dfrac{N-1}{N} \\)，故</p>' +
              '<div class="fml">\\( P\\{X_i=1\\}=\\left(\\dfrac{N-1}{N}\\right)^n \\)</div>' +
              '<p>由期望的可加性（<b>无需独立性</b>）：</p>' +
              '<div class="fml">\\( E(X)=\\sum_{i=1}^{N}E(X_i)=N\\left(\\dfrac{N-1}{N}\\right)^n \\)</div>' +
              '<p class="fml-note">示性变量法是考研最常用的期望计算技巧，务必掌握——它把「求和的期望」变成「期望的求和」。</p>'
          }
        ],
        pitfalls: [
          '\\( E(X) \\) 存在的前提是<b>绝对收敛</b>，不是普通收敛。',
          '\\( E(X\\pm Y)=E(X)\\pm E(Y) \\) <b>不要求独立</b>；\\( E(XY)=E(X)E(Y) \\) <b>必须独立</b>。',
          '\\( E(g(X))\\neq g(E(X)) \\)（除非 \\( g \\) 是线性函数）——这是高频陷阱。',
          '求期望时注意积分/求和的范围，密度在支撑集外为 0。'
        ]
      },

      /* ================================================================
         4.2 方差与标准差
         ================================================================ */
      {
        id: 'ch4-s2',
        num: '4.2',
        title: '方差与标准差',
        lead: '方差刻画随机变量偏离期望的程度——它是「离散程度」的度量，也是分布对称性与宽窄的量化。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '方差与标准差', html:
            '<p class="tight">设 \\( X \\) 的数学期望 \\( E(X) \\) 存在。若 \\( E\\{[X-E(X)]^2\\} \\) 存在，则称其为 \\( X \\) 的<b>方差</b>：</p>' +
            '<div class="fml">\\( D(X)=\\mathrm{Var}(X)=E\\{[X-E(X)]^2\\} \\)</div>' +
            '<p class="tight">称 \\( \\sqrt{D(X)} \\) 为 \\( X \\) 的<b>标准差</b>（均方差），记作 \\( \\sigma_X \\)。</p>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '方差的计算公式（必背）', html:
            '<div class="fml">\\( \\boxed{\\,D(X)=E(X^2)-[E(X)]^2\\,} \\)</div>' +
            '<p class="tight">这是方差计算最常用的公式，俗称「平方的期望减期望的平方」。</p>' +
            '<p class="tight"><b>离散型：</b>\\( D(X)=\\displaystyle\\sum_k x_k^2p_k-\\left(\\sum_k x_kp_k\\right)^2 \\)</p>' +
            '<p class="tight"><b>连续型：</b>\\( D(X)=\\displaystyle\\int_{-\\infty}^{+\\infty}x^2f(x)\\,\\mathrm{d}x-\\left(\\int_{-\\infty}^{+\\infty}xf(x)\\,\\mathrm{d}x\\right)^2 \\)</p>'
          },
          { t: 'viz', build: 'variance', title: '方差＝离散程度', sub: '拖动概率，观察分布「胖瘦」如何改变方差' },
          { t: 'viz', build: 'varianceShift', title: 'D(aX+b) = a²D(X) 的平移与缩放', sub: '拖动 a、b，观察密度曲线的位置与宽度如何变化' },
          { t: 'card', kind: 'thm', tag: '性质', title: '方差的六条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 非负性：</b>\\( D(X)\\geqslant 0 \\)，且 \\( D(X)=0\\Longleftrightarrow P\\{X=E(X)\\}=1 \\)（几乎必然为常数）</div>' +
            '<div class="fml-row"><b>2. 常数：</b>\\( D(C)=0 \\)</div>' +
            '<div class="fml-row"><b>3. 齐次性（平方）：</b>\\( D(CX)=C^2D(X) \\)，一般地 \\( D(aX+b)=a^2D(X) \\)</div>' +
            '<div class="fml-row"><b>4. 可加性（需不相关）：</b>\\( D(X\\pm Y)=D(X)+D(Y)\\pm2\\,\\mathrm{Cov}(X,Y) \\)</div>' +
            '<div class="fml-row"><b>5. 独立（或不相关）时：</b>\\( D(X\\pm Y)=D(X)+D(Y) \\)</div>' +
            '<div class="fml-row"><b>6. \\( n \\) 个独立变量：</b>\\( D\\!\\left(\\sum_{i=1}^{n}X_i\\right)=\\sum_{i=1}^{n}D(X_i) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>注意：</b>性质 3 中常数 \\( b \\) <b>不影响方差</b>——平移不改变离散程度。</p>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '两个高频错误', html:
            '<ul class="none">' +
            '<li>\\( D(X+Y)=D(X)+D(Y) \\) <b>不是恒等式</b>！一般要加 \\( 2\\mathrm{Cov}(X,Y) \\)；只有独立/不相关时才化简。</li>' +
            '<li>\\( D(X-Y)=D(X)+D(Y) \\)（<b>不是</b> \\( D(X)-D(Y) \\)）——当 \\( X,Y \\) 独立或<b>不相关</b>时，减号同样变成加号。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'tip', tag: '结论', title: '常用分布的数字特征（大纲要求「掌握」）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>0–1 分布 \\( B(1,p) \\)：</b>\\( E(X)=p,\\quad D(X)=p(1-p) \\)</div>' +
            '<div class="fml-row"><b>二项分布 \\( B(n,p) \\)：</b>\\( E(X)=np,\\quad D(X)=np(1-p) \\)</div>' +
            '<div class="fml-row"><b>泊松分布 \\( P(\\lambda) \\)：</b>\\( E(X)=\\lambda,\\quad D(X)=\\lambda \\)</div>' +
            '<div class="fml-row"><b>几何分布 \\( G(p) \\)：</b>\\( E(X)=\\dfrac1p,\\quad D(X)=\\dfrac{1-p}{p^2} \\)</div>' +
            '<div class="fml-row"><b>超几何分布 \\( H(N,M,n) \\)：</b>\\( E(X)=n\\dfrac MN,\\quad D(X)=n\\dfrac MN\\left(1-\\dfrac MN\\right)\\dfrac{N-n}{N-1} \\)</div>' +
            '<div class="fml-row"><b>均匀分布 \\( U(a,b) \\)：</b>\\( E(X)=\\dfrac{a+b}2,\\quad D(X)=\\dfrac{(b-a)^2}{12} \\)</div>' +
            '<div class="fml-row"><b>指数分布 \\( E(\\lambda) \\)：</b>\\( E(X)=\\dfrac1\\lambda,\\quad D(X)=\\dfrac1{\\lambda^2} \\)</div>' +
            '<div class="fml-row"><b>正态分布 \\( N(\\mu,\\sigma^2) \\)：</b>\\( E(X)=\\mu,\\quad D(X)=\\sigma^2 \\)</div>' +
            '</div>'
          },
          { t: 'viz', build: 'distMoments', title: '常用分布的数字特征一览', sub: '切换分布与参数，对照理论值' }
        ],
        examples: [
          {
            no: '例 4.5', meta: '基础 · 用公式求方差',
            q: '设 \\( X \\) 的分布律为 \\( P\\{X=0\\}=0.4,\\ P\\{X=1\\}=0.1,\\ P\\{X=2\\}=0.5 \\)。求 \\( E(X) \\)、\\( E(X^2) \\) 与 \\( D(X) \\)。',
            sol:
              '<div class="fml">\\( E(X)=0\\times0.4+1\\times0.1+2\\times0.5=1.1 \\)</div>' +
              '<div class="fml">\\( E(X^2)=0^2\\times0.4+1^2\\times0.1+2^2\\times0.5=0+0.1+2=2.1 \\)</div>' +
              '<div class="fml">\\( D(X)=E(X^2)-[E(X)]^2=2.1-1.1^2=2.1-1.21=\\mathbf{0.89} \\)</div>'
          },
          {
            no: '例 4.6', meta: '真题改编 · 线性变换的方差',
            q: '设 \\( E(X)=2 \\)，\\( D(X)=3 \\)。求 \\( E(2X-1) \\) 与 \\( D(2X-1) \\)。',
            sol:
              '<div class="fml">\\( E(2X-1)=2E(X)-1=2\\times2-1=\\mathbf{3} \\)</div>' +
              '<div class="fml">\\( D(2X-1)=2^2D(X)=4\\times3=\\mathbf{12} \\)</div>' +
              '<p class="fml-note">关键：常数项 \\( -1 \\) 被方差「消掉」，只有系数 \\( 2 \\) 被平方。</p>'
          },
          {
            no: '例 4.7', meta: '提高 · 独立与不相关的差异',
            q: '设 \\( D(X)=1,\\ D(Y)=4 \\)。<br>(1) 若 \\( X,Y \\) 相互独立，求 \\( D(X-Y) \\)；<br>(2) 若 \\( \\mathrm{Cov}(X,Y)=1 \\)，求 \\( D(X-Y) \\) 与 \\( D(X+Y) \\)。',
            sol:
              '<p><b>(1)</b> 独立 \\( \\Rightarrow \\) 不相关 \\( \\Rightarrow \\mathrm{Cov}=0 \\)：</p>' +
              '<div class="fml">\\( D(X-Y)=D(X)+D(Y)=1+4=\\mathbf{5} \\)</div>' +
              '<p><b>(2)</b> 用一般公式：</p>' +
              '<div class="fml">\\( D(X-Y)=D(X)+D(Y)-2\\mathrm{Cov}(X,Y)=1+4-2\\times1=\\mathbf{3} \\)</div>' +
              '<div class="fml">\\( D(X+Y)=D(X)+D(Y)+2\\mathrm{Cov}(X,Y)=1+4+2\\times1=\\mathbf{7} \\)</div>'
          }
        ],
        pitfalls: [
          '\\( D(X-Y)=D(X)-D(Y) \\) 是<b>错误</b>的；独立或不相关时是 \\( D(X)+D(Y) \\)。',
          '\\( D(2X)=4D(X) \\) 而不是 \\( 2D(X) \\)，系数要平方。',
          '\\( D(X)=E(X^2)-[E(X)]^2 \\) 中 \\( E(X^2)\\neq[E(X)]^2 \\)。',
          '方差存在要求 \\( E(X^2) \\) 存在，从而 \\( E(X) \\) 必然存在（反之不真）。'
        ]
      },

      /* ================================================================
         4.3 随机变量函数的数学期望
         ================================================================ */
      {
        id: 'ch4-s3',
        num: '4.3',
        title: '随机变量函数的数学期望',
        lead: '大纲要求「会求随机变量函数的数学期望」—— 核心结论是：不必先求 \\( g(X) \\) 的分布，直接对 \\( X \\) 的分布加权即可。',
        blocks: [
          { t: 'card', kind: 'thm', tag: '定理', title: '一维：\\( E[g(X)] \\) 的直接公式', html:
            '<p class="tight"><b>离散型：</b>设 \\( P\\{X=x_k\\}=p_k \\)，则</p>' +
            '<div class="fml">\\( E[g(X)]=\\sum_{k=1}^{\\infty}g(x_k)\\,p_k \\)</div>' +
            '<p class="tight"><b>连续型：</b>设密度为 \\( f(x) \\)，则</p>' +
            '<div class="fml">\\( E[g(X)]=\\int_{-\\infty}^{+\\infty}g(x)f(x)\\,\\mathrm{d}x \\)</div>' +
            '<p class="tight"><b>要点：</b>右端的求和/积分是对 \\( X \\) 的分布做的，<b>不需要</b>先求 \\( Y=g(X) \\) 的分布。这被称为「无意识统计学家公式」。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '二维：\\( E[g(X,Y)] \\) 的公式', html:
            '<p class="tight"><b>离散型：</b>\\( E[g(X,Y)]=\\displaystyle\\sum_i\\sum_j g(x_i,y_j)\\,p_{ij} \\)</p>' +
            '<p class="tight"><b>连续型：</b>\\( E[g(X,Y)]=\\displaystyle\\int_{-\\infty}^{+\\infty}\\!\\!\\int_{-\\infty}^{+\\infty}g(x,y)f(x,y)\\,\\mathrm{d}x\\,\\mathrm{d}y \\)</p>'
          },
          { t: 'viz', build: 'functionExpectation', title: 'E[g(X)]：直接法与分布法的等价性', sub: '对比「对 X 加权」与「先求 Y 分布再加权」的结果' },
          { t: 'viz', build: 'lotus', title: '函数期望公式：逐项加权表', sub: '切换 g(x) 与二项参数 n（2–10），对照直接法 Σg(x)p 与分布法 Σy·P(Y=y)' },
          { t: 'card', kind: 'key', tag: '必记', title: '由 \\( E(X) \\) 推 \\( E(X^2) \\) 的常用套路', html:
            '<p class="tight">由于 \\( D(X)=E(X^2)-[E(X)]^2 \\)，只要已知 \\( E(X) \\) 与 \\( D(X) \\)（常用分布的结论可直接用），就能反求：</p>' +
            '<div class="fml">\\( E(X^2)=D(X)+[E(X)]^2 \\)</div>' +
            '<p class="tight"><b>例：</b>\\( X\\sim N(\\mu,\\sigma^2) \\) \\( \\Rightarrow \\) \\( E(X^2)=\\sigma^2+\\mu^2 \\)。</p>'
          },
          { t: 'card', kind: 'tip', tag: '技巧', title: '三类高频函数', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>函数类型</th><th>处理要点</th></tr></thead><tbody>' +
            '<tr><td><b>线性</b> \\( aX+b \\)</td><td>直接套 \\( E \\) 的线性性：\\( aE(X)+b \\)</td></tr>' +
            '<tr><td><b>幂函数</b> \\( X^k \\)</td><td>按定义积分/求和，常用 \\( E(X^2)=D(X)+[E(X)]^2 \\)</td></tr>' +
            '<tr><td><b>示性函数 / 分段</b></td><td>拆成互斥事件的示性变量之和，用期望可加性</td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '\\( E[g(X)]\\neq g[E(X)] \\)', html:
            '<p class="tight">这是概率论中最常见的错误之一。例如取 \\( g(x)=x^2 \\)：</p>' +
            '<div class="fml">\\( E(X^2)\\geqslant [E(X)]^2 \\)</div>' +
            '<p class="tight">两者之差恰为方差 \\( D(X) \\)（由 Jensen 不等式，等号成立当且仅当 \\( X \\) 几乎必然为常数）。</p>'
          }
        ],
        examples: [
          {
            no: '例 4.8', meta: '基础 · 离散型函数的期望',
            q: '设 \\( X \\) 的分布律为 \\( P\\{X=-1\\}=0.3,\\ P\\{X=0\\}=0.2,\\ P\\{X=1\\}=0.5 \\)。求 \\( E(X^2) \\) 与 \\( E(2^X) \\)。',
            sol:
              '<p>直接对 \\( X \\) 的分布加权（不必求 \\( Y \\) 的分布）：</p>' +
              '<div class="fml">\\( E(X^2)=(-1)^2\\times0.3+0^2\\times0.2+1^2\\times0.5=0.3+0.5=\\mathbf{0.8} \\)</div>' +
              '<div class="fml">\\( E(2^X)=2^{-1}\\times0.3+2^{0}\\times0.2+2^{1}\\times0.5=0.15+0.2+1=\\mathbf{1.35} \\)</div>'
          },
          {
            no: '例 4.9', meta: '真题改编 · 连续型函数的期望',
            q: '设 \\( X\\sim U(0,1) \\)。求 \\( E(e^X) \\) 与 \\( E(\\ln X) \\)。',
            sol:
              '<p>密度 \\( f(x)=1\\ (0<x<1) \\)，故</p>' +
              '<div class="fml">\\( E(e^X)=\\int_0^1 e^x\\cdot1\\,\\mathrm{d}x=e-1\\approx\\mathbf{1.7183} \\)</div>' +
              '<div class="fml">\\( E(\\ln X)=\\int_0^1 \\ln x\\,\\mathrm{d}x=\\big[x\\ln x-x\\big]_0^1=(0-1)-0=\\mathbf{-1} \\)</div>' +
              '<p class="fml-note">第二个积分中 \\( x\\ln x\\to0 \\)（当 \\( x\\to0^+ \\)），这是反常积分的常见极限。</p>'
          },
          {
            no: '例 4.10', meta: '提高 · 二维函数的期望',
            q: '设 \\( (X,Y) \\) 在区域 \\( D=\\{(x,y):0\\leqslant x\\leqslant 1,\\ 0\\leqslant y\\leqslant x\\} \\) 上服从均匀分布。求 \\( E(XY) \\)。',
            sol:
              '<p>\\( D \\) 是面积为 \\( 1/2 \\) 的三角形，故联合密度 \\( f(x,y)=2 \\) 在 \\( D \\) 上。</p>' +
              '<div class="fml">\\( E(XY)=\\iint_D xy\\cdot 2\\,\\mathrm{d}x\\,\\mathrm{d}y=2\\int_0^1\\!\\!\\int_0^{x}xy\\,\\mathrm{d}y\\,\\mathrm{d}x \\)</div>' +
              '<div class="fml">\\( =2\\int_0^1 x\\cdot\\frac{x^2}{2}\\,\\mathrm{d}x=\\int_0^1 x^3\\mathrm{d}x=\\mathbf{\\dfrac14} \\)</div>' +
              '<p class="fml-note">独立时 \\( E(XY)=E(X)E(Y) \\)；此处不独立（支撑集是三角形），必须用二重积分。</p>'
          },
          {
            no: '例 4.11', meta: '提高 · 用 E(X²) 求方差',
            q: '设 \\( X\\sim P(\\lambda) \\)（泊松分布）。用 \\( E[X(X-1)] \\) 求 \\( D(X) \\)。',
            sol:
              '<p>对泊松分布 \\( P\\{X=k\\}=\\dfrac{\\lambda^k}{k!}e^{-\\lambda} \\)：</p>' +
              '<div class="fml">\\( E[X(X-1)]=\\sum_{k=0}^{\\infty}k(k-1)\\dfrac{\\lambda^k}{k!}e^{-\\lambda}=\\lambda^2e^{-\\lambda}\\sum_{k=2}^{\\infty}\\dfrac{\\lambda^{k-2}}{(k-2)!}=\\lambda^2 \\)</div>' +
              '<p>故 \\( E(X^2)=E[X(X-1)]+E(X)=\\lambda^2+\\lambda \\)。又 \\( E(X)=\\lambda \\)，于是</p>' +
              '<div class="fml">\\( D(X)=E(X^2)-[E(X)]^2=(\\lambda^2+\\lambda)-\\lambda^2=\\mathbf{\\lambda} \\)</div>' +
              '<p class="fml-note">泊松分布的特征：\\( E(X)=D(X)=\\lambda \\)，这是它最显著的标志。</p>'
          }
        ],
        pitfalls: [
          '算 \\( E[g(X)] \\) 时<b>不要</b>先求 \\( g(X) \\) 的分布，直接对 \\( X \\) 加权即可（除非题目要求）。',
          '二维情形必须用<b>联合分布</b>加权，不能拆成两个边缘分布之积（除非独立）。',
          '分段函数的分界点要与积分/求和的区间对齐，不可漏段。',
          '\\( E(X^2)\\neq[E(X)]^2 \\)，两者相差一个方差。'
        ]
      },

      /* ================================================================
         4.4 矩、协方差与相关系数
         ================================================================ */
      {
        id: 'ch4-s4',
        num: '4.4',
        title: '矩、协方差与相关系数',
        lead: '期望与方差描述单个变量，协方差与相关系数则刻画两个变量之间的关联 —— 这是大纲要求「理解」的最后一组数字特征。',
        blocks: [
          { t: 'h3', idx: '①', text: '矩' },
          { t: 'card', kind: 'def', tag: '定义', title: '原点矩与中心矩', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>k 阶原点矩：</b>\\( E(X^k),\\quad k=1,2,\\cdots \\)（一阶原点矩即 \\( E(X) \\)）</div>' +
            '<div class="fml-row"><b>k 阶中心矩：</b>\\( E\\{[X-E(X)]^k\\},\\quad k=1,2,\\cdots \\)（二阶中心矩即 \\( D(X) \\)）</div>' +
            '<div class="fml-row"><b>k+l 阶混合矩：</b>\\( E(X^kY^l) \\)</div>' +
            '<div class="fml-row"><b>k+l 阶混合中心矩：</b>\\( E\\{[X-E(X)]^k[Y-E(Y)]^l\\} \\)（<b>1+1 阶</b>即协方差）</div>' +
            '</div>'
          },
          { t: 'h3', idx: '②', text: '协方差' },
          { t: 'card', kind: 'def', tag: '定义', title: '协方差', html:
            '<p class="tight">设 \\( D(X),D(Y) \\) 存在，称</p>' +
            '<div class="fml">\\( \\mathrm{Cov}(X,Y)=E\\{[X-E(X)][Y-E(Y)]\\} \\)</div>' +
            '<p class="tight">为 \\( X \\) 与 \\( Y \\) 的<b>协方差</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '协方差的计算公式与性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>计算公式（必背）：</b>\\( \\mathrm{Cov}(X,Y)=E(XY)-E(X)E(Y) \\)</div>' +
            '<div class="fml-row"><b>对称性：</b>\\( \\mathrm{Cov}(X,Y)=\\mathrm{Cov}(Y,X) \\)</div>' +
            '<div class="fml-row"><b>与方差的关系：</b>\\( \\mathrm{Cov}(X,X)=D(X) \\)</div>' +
            '<div class="fml-row"><b>双线性：</b>\\( \\mathrm{Cov}(aX+b,\\ cY+d)=ac\\,\\mathrm{Cov}(X,Y) \\)</div>' +
            '<div class="fml-row"><b>和的协方差：</b>\\( \\mathrm{Cov}(X_1+X_2,\\,Y)=\\mathrm{Cov}(X_1,Y)+\\mathrm{Cov}(X_2,Y) \\)</div>' +
            '<div class="fml-row"><b>方差展开式：</b>\\( D(X\\pm Y)=D(X)+D(Y)\\pm2\\mathrm{Cov}(X,Y) \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '③', text: '相关系数' },
          { t: 'card', kind: 'def', tag: '定义', title: '相关系数', html:
            '<p class="tight">设 \\( D(X)>0,\\ D(Y)>0 \\)，称</p>' +
            '<div class="fml">\\( \\rho_{XY}=\\dfrac{\\mathrm{Cov}(X,Y)}{\\sqrt{D(X)}\\sqrt{D(Y)}} \\)</div>' +
            '<p class="tight">为 \\( X \\) 与 \\( Y \\) 的<b>相关系数</b>（线性相关系数）。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '相关系数的三条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 有界性：</b>\\( |\\rho_{XY}|\\leqslant 1 \\)</div>' +
            '<div class="fml-row"><b>2. 线性关系的刻画：</b>\\( |\\rho_{XY}|=1 \\) \\( \\Longleftrightarrow \\) 存在常数 \\( a,b\\ (a\\neq0) \\) 使 \\( P\\{Y=aX+b\\}=1 \\)<br>（即 \\( X \\) 与 \\( Y \\) 以概率 1 成<b>严格线性关系</b>）</div>' +
            '<div class="fml-row"><b>3. 符号的含义：</b>\\( \\rho_{XY}>0 \\) 正相关；\\( \\rho_{XY}<0 \\) 负相关；\\( \\rho_{XY}=0 \\) 不相关</div>' +
            '</div>'
          },
          { t: 'viz', build: 'correlation', title: '相关系数 ρ 的几何意义', sub: '拖动 ρ，观察散点云的「线性程度」' },
          { t: 'viz', build: 'corrEllipse', title: '相关系数：散点云与 1σ 椭圆', sub: '拖动 ρ，观察样本相关系数与椭圆形状同步变化' },
          { t: 'card', kind: 'key', tag: '核心', title: '「不相关」的四个等价说法', html:
            '<p class="tight">以下四条相互等价：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>①</b> \\( \\mathrm{Cov}(X,Y)=0 \\)</div>' +
            '<div class="fml-row"><b>②</b> \\( \\rho_{XY}=0 \\)</div>' +
            '<div class="fml-row"><b>③</b> \\( E(XY)=E(X)E(Y) \\)</div>' +
            '<div class="fml-row"><b>④</b> \\( D(X\\pm Y)=D(X)+D(Y) \\)</div>' +
            '</div>' +
            '<p class="tight">「不相关」只表示<b>没有线性关系</b>，不排除非线性关系。</p>'
          },
          { t: 'card', kind: 'warn', tag: '重中之重', title: '独立 vs 不相关', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>命题</th><th>是否成立</th><th>说明</th></tr></thead><tbody>' +
            '<tr><td><b>独立 \\( \\Rightarrow \\) 不相关</b></td><td style="color:var(--green)">成立</td><td>独立使 \\( E(XY)=E(X)E(Y) \\)</td></tr>' +
            '<tr><td><b>不相关 \\( \\Rightarrow \\) 独立</b></td><td style="color:var(--red)">不成立</td><td>反例：\\( X\\sim N(0,1),\\ Y=X^2 \\)</td></tr>' +
            '<tr><td><b>二维正态下二者等价</b></td><td style="color:var(--green)">成立</td><td>\\( \\rho=0\\Longleftrightarrow \\) 独立（正态专属）</td></tr>' +
            '</tbody></table></div>' +
            '<p class="tight" style="margin-top:10px"><b>经典反例详解：</b>取 \\( X\\sim N(0,1) \\)，\\( Y=X^2 \\)。则</p>' +
            '<div class="fml">\\( E(XY)=E(X^3)=0,\\qquad E(X)E(Y)=0\\cdot1=0 \\\)</div>' +
            '<div class="fml">\\( \\Rightarrow\\ \\mathrm{Cov}(X,Y)=0 \\)（不相关）；但 \\( Y \\) 由 \\( X \\) 完全决定（不独立）</div>'
          },
          { t: 'card', kind: 'tip', tag: '技巧', title: '常见结论速查', html:
            '<ul class="none">' +
            '<li>若 \\( X,Y \\) 独立，则 \\( \\mathrm{Cov}(X,Y)=0 \\)，从而 \\( \\rho=0 \\)。</li>' +
            '<li>\\( D(X+Y)=D(X)+D(Y)+2\\mathrm{Cov}(X,Y) \\)，\\( D(X-Y)=D(X)+D(Y)-2\\mathrm{Cov}(X,Y) \\)。</li>' +
            '<li>若 \\( Y=aX+b \\)，则 \\( \\rho_{XY}=\\mathrm{sgn}(a) \\)（\\( a>0 \\) 时为 1，\\( a<0 \\) 时为 −1）。</li>' +
            '<li>二维正态 \\( N(\\mu_1,\\sigma_1^2;\\mu_2,\\sigma_2^2;\\rho) \\) 中，\\( \\rho \\) 就是相关系数。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 4.12', meta: '基础 · 求协方差与相关系数',
            q: '设 \\( (X,Y) \\) 的联合分布律为<br>\\( P\\{X=0,Y=0\\}=0.3,\\ P\\{X=0,Y=1\\}=0.1,\\ P\\{X=1,Y=0\\}=0.2,\\ P\\{X=1,Y=1\\}=0.4 \\)。<br>求 \\( \\mathrm{Cov}(X,Y) \\) 与 \\( \\rho_{XY} \\)。',
            sol:
              '<p>先求边缘分布：\\( P\\{X=1\\}=0.2+0.4=0.6 \\)，\\( P\\{Y=1\\}=0.1+0.4=0.5 \\)。</p>' +
              '<p>于是 \\( E(X)=0.6,\\ E(Y)=0.5 \\)，且 \\( X\\sim B(1,0.6),\\ Y\\sim B(1,0.5) \\)：</p>' +
              '<div class="fml">\\( D(X)=0.6\\times0.4=0.24,\\qquad D(Y)=0.5\\times0.5=0.25 \\)</div>' +
              '<p>又 \\( E(XY)=1\\times1\\times0.4=0.4 \\)，故</p>' +
              '<div class="fml">\\( \\mathrm{Cov}(X,Y)=E(XY)-E(X)E(Y)=0.4-0.6\\times0.5=0.4-0.3=\\mathbf{0.1} \\)</div>' +
              '<div class="fml">\\( \\rho_{XY}=\\dfrac{0.1}{\\sqrt{0.24}\\sqrt{0.25}}=\\dfrac{0.1}{0.2449}\\approx\\mathbf{0.408} \\)</div>'
          },
          {
            no: '例 4.13', meta: '真题改编 · 不相关但不独立',
            q: '设 \\( X\\sim N(0,1) \\)，令 \\( Y=X^2 \\)。证明 \\( X \\) 与 \\( Y \\) 不相关，但不独立。',
            sol:
              '<p><b>不相关：</b>\\( E(X)=0 \\)，且</p>' +
              '<div class="fml">\\( E(XY)=E(X^3)=0 \\)（标准正态的三阶矩为 0，因密度是偶函数）</div>' +
              '<div class="fml">\\( \\mathrm{Cov}(X,Y)=E(XY)-E(X)E(Y)=0-0=0 \\)</div>' +
              '<p>故 \\( \\rho_{XY}=0 \\)，即不相关。</p>' +
              '<p><b>不独立：</b>\\( Y \\) 完全由 \\( X \\) 决定。例如验证</p>' +
              '<div class="fml">\\( P\\{X>1,\\ Y\\leqslant1\\}=0 \\)，而 \\( P\\{X>1\\}P\\{Y\\leqslant1\\}\\neq0 \\)</div>' +
              '<p>故不独立。这恰好说明「不相关」弱于「独立」。</p>'
          },
          {
            no: '例 4.14', meta: '提高 · 由方差反求协方差',
            q: '设 \\( D(X)=4,\\ D(Y)=9,\\ D(X+Y)=16 \\)。求 \\( \\mathrm{Cov}(X,Y) \\) 与 \\( \\rho_{XY} \\)。',
            sol:
              '<p>由 \\( D(X+Y)=D(X)+D(Y)+2\\mathrm{Cov}(X,Y) \\)：</p>' +
              '<div class="fml">\\( 16=4+9+2\\mathrm{Cov}(X,Y)\\ \\Longrightarrow\\ \\mathrm{Cov}(X,Y)=\\dfrac{16-13}{2}=\\mathbf{1.5} \\)</div>' +
              '<div class="fml">\\( \\rho_{XY}=\\dfrac{1.5}{\\sqrt4\\sqrt9}=\\dfrac{1.5}{2\\times3}=\\mathbf{0.25} \\)</div>'
          },
          {
            no: '例 4.15', meta: '提高 · 相关系数取到 ±1',
            q: '设 \\( Y=2X+3 \\)，且 \\( D(X)>0 \\)。求 \\( \\rho_{XY} \\)。',
            sol:
              '<div class="fml">\\( \\mathrm{Cov}(X,Y)=\\mathrm{Cov}(X,2X+3)=2\\mathrm{Cov}(X,X)+0=2D(X) \\)</div>' +
              '<div class="fml">\\( D(Y)=D(2X+3)=4D(X) \\)</div>' +
              '<div class="fml">\\( \\rho_{XY}=\\dfrac{2D(X)}{\\sqrt{D(X)}\\cdot\\sqrt{4D(X)}}=\\dfrac{2D(X)}{2D(X)}=\\mathbf{1} \\)</div>' +
              '<p class="fml-note">一般结论：\\( Y=aX+b \\) 时 \\( \\rho_{XY}=\\mathrm{sgn}(a) \\)。这验证了 \\( |\\rho|=1\\Leftrightarrow \\) 严格线性关系。</p>'
          }
        ],
        pitfalls: [
          '<b>不相关 \\( \\neq \\) 独立</b>（二维正态例外），这是本章最高频的判断题。',
          '\\( \\mathrm{Cov}(X,Y)=E(XY)-E(X)E(Y) \\)，切勿记成 \\( E(XY)-E(X)-E(Y) \\) 或 \\( E(XY)-E(X)\\cdot E(Y) \\) 之外的变形。',
          '\\( \\rho_{XY} \\) 只度量<b>线性</b>相关；\\( \\rho=0 \\) 不代表毫无关系。',
          '\\( D(X)>0,D(Y)>0 \\) 是定义相关系数的前提（否则分母为 0）。'
        ]
      },

      /* ================================================================
         4.5 数字特征的性质运用与综合
         ================================================================ */
      {
        id: 'ch4-s5',
        num: '4.5',
        title: '数字特征的性质运用与综合',
        lead: '大纲要求「会运用数字特征的基本性质」。本节把期望、方差、协方差的性质串成解题工具链。',
        blocks: [
          { t: 'card', kind: 'key', tag: '总表', title: '数字特征性质总表', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>运算</th><th>数学期望</th><th>方差</th></tr></thead><tbody>' +
            '<tr><td>常数 \\( C \\)</td><td>\\( E(C)=C \\)</td><td>\\( D(C)=0 \\)</td></tr>' +
            '<tr><td>数乘 \\( CX \\)</td><td>\\( CE(X) \\)</td><td>\\( C^2D(X) \\)</td></tr>' +
            '<tr><td>线性 \\( aX+b \\)</td><td>\\( aE(X)+b \\)</td><td>\\( a^2D(X) \\)</td></tr>' +
            '<tr><td>和 \\( X+Y \\)</td><td>\\( E(X)+E(Y) \\)<br><span style="color:var(--green)">恒成立</span></td><td>\\( D(X)+D(Y)+2\\mathrm{Cov}(X,Y) \\)<br><span style="color:var(--green)">独立/不相关时 \\( =D(X)+D(Y) \\)</span></td></tr>' +
            '<tr><td>积 \\( XY \\)</td><td>\\( E(X)E(Y) \\) <span style="color:var(--red)">需独立</span></td><td>—</td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'viz', build: 'properties', title: '性质验证器', sub: '输入参数，实时核对 E 与 D 的各项性质' },
          { t: 'viz', build: 'covBilinear', title: '协方差的双线性展开', sub: '拖动系数 a、b、c、d，逐项核对 Cov(aX+bY, cZ+dW)' },
          { t: 'card', kind: 'tip', tag: '方法', title: '解题工具链', html:
            '<ol class="clean">' +
            '<li><b>拆分</b>：把复杂变量写成简单变量的线性组合（示性变量很常用）。</li>' +
            '<li><b>算 E</b>：利用 \\( E \\) 的线性性，逐项求期望（无需独立）。</li>' +
            '<li><b>算 D</b>：先判断独立/不相关，再决定要不要加协方差项。</li>' +
            '<li><b>核对</b>：\\( D(X)\\geqslant0 \\)、\\( |\\rho|\\leqslant1 \\) 都是天然检验。</li>' +
            '</ol>'
          },
          { t: 'card', kind: 'exam', tag: '高频', title: '真题常见设问', html:
            '<ul class="none">' +
            '<li>由 \\( E(X),D(X) \\) 求 \\( E(aX^2+bX+c) \\)（先用 \\( E(X^2)=D(X)+[E(X)]^2 \\)）。</li>' +
            '<li>判断两随机变量是否独立、是否不相关（构造反例或验证等式）。</li>' +
            '<li>由 \\( D(X\\pm Y) \\) 反求 \\( \\mathrm{Cov}(X,Y) \\) 与 \\( \\rho \\)。</li>' +
            '<li>用示性变量求「个数型」随机变量的期望与方差。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 4.16', meta: '真题改编 · 二次函数的期望',
            q: '设 \\( E(X)=1,\\ D(X)=2 \\)。求 \\( E(X^2-3X+1) \\)。',
            sol:
              '<p>先求 \\( E(X^2) \\)：</p>' +
              '<div class="fml">\\( E(X^2)=D(X)+[E(X)]^2=2+1=3 \\)</div>' +
              '<p>再用线性性：</p>' +
              '<div class="fml">\\( E(X^2-3X+1)=E(X^2)-3E(X)+1=3-3\\times1+1=\\mathbf{1} \\)</div>'
          },
          {
            no: '例 4.17', meta: '提高 · 二项分布的期望与方差推导',
            q: '设 \\( X\\sim B(n,p) \\)。用示性变量分解法求 \\( E(X) \\) 与 \\( D(X) \\)。',
            sol:
              '<p>把 \\( X \\) 写成 \\( n \\) 次独立伯努利试验的成功次数之和：\\( X=\\sum_{i=1}^{n}X_i \\)，其中 \\( X_i\\sim B(1,p) \\) 且<b>相互独立</b>。</p>' +
              '<p><b>期望：</b>由可加性（无需独立）</p>' +
              '<div class="fml">\\( E(X)=\\sum_{i=1}^{n}E(X_i)=np \\)</div>' +
              '<p><b>方差：</b>由相互独立，方差可加</p>' +
              '<div class="fml">\\( D(X)=\\sum_{i=1}^{n}D(X_i)=n\\,p(1-p) \\)</div>' +
              '<p class="fml-note">这一推导说明：为什么方差可加必须依赖独立性，而期望可加不需要。</p>'
          },
          {
            no: '例 4.18', meta: '提高 · 综合运用',
            q: '设 \\( X,Y \\) 满足 \\( E(X)=1,\\ E(Y)=2,\\ D(X)=3,\\ D(Y)=4,\\ \\rho_{XY}=0.5 \\)。求 \\( E(2X-Y) \\) 与 \\( D(2X-Y) \\)。',
            sol:
              '<p><b>期望：</b></p>' +
              '<div class="fml">\\( E(2X-Y)=2E(X)-E(Y)=2\\times1-2=\\mathbf{0} \\)</div>' +
              '<p><b>方差：</b>先求协方差</p>' +
              '<div class="fml">\\( \\mathrm{Cov}(X,Y)=\\rho_{XY}\\sqrt{D(X)}\\sqrt{D(Y)}=0.5\\sqrt3\\cdot2=\\sqrt3\\approx1.732 \\)</div>' +
              '<div class="fml">\\( D(2X-Y)=4D(X)+D(Y)-2\\cdot2\\cdot\\mathrm{Cov}(X,Y) \\)</div>' +
              '<div class="fml">\\( =4\\times3+4-4\\times1.732=12+4-6.928\\approx\\mathbf{9.072} \\)</div>' +
              '<p class="fml-note">注意交叉项系数：\\( D(aX+bY)=a^2D(X)+b^2D(Y)+2ab\\,\\mathrm{Cov}(X,Y) \\)，此处 \\( a=2,b=-1 \\)，故 \\( 2ab=-4 \\)。</p>'
          }
        ],
        pitfalls: [
          '\\( D(aX+bY)=a^2D(X)+b^2D(Y)+2ab\\,\\mathrm{Cov}(X,Y) \\)，交叉项<b>不要漏</b>，符号随 \\( ab \\) 变化。',
          '\\( E(X^2) \\) 必须先用 \\( D(X)+[E(X)]^2 \\) 求出，不能想当然。',
          '方差可加<b>必须</b>独立或不相关；期望可加<b>永远</b>成立。',
          '求 \\( \\rho \\) 前先确认 \\( D(X)>0,D(Y)>0 \\)。'
        ]
      }

    ]
  };

})(window);
