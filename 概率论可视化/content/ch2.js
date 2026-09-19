/* ============================================================
   ch2.js — 第二章 随机变量及其分布
   覆盖 2026 大纲「二、随机变量及其分布」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';

  global.CH2 = {
    id: 'ch2',
    no: '二',
    title: '随机变量及其分布',
    subtitle: '把随机试验的结果「数值化」，用分布函数统一刻画离散与连续两大类随机变量',
    tags: ['分布函数', '分布律', '概率密度', '二项分布', '几何分布', '超几何分布', '泊松分布', '均匀分布', '正态分布', '指数分布', '泊松定理', '随机变量函数'],
    sections: [

      /* ================================================================
         2.1 随机变量与分布函数
         ================================================================ */
      {
        id: 'ch2-s1',
        num: '2.1',
        title: '随机变量与分布函数',
        lead: '随机变量是把样本点映射为实数的函数；分布函数则是「用统一方式」记录随机变量全部概率信息的工具。',
        blocks: [
          { t: 'h3', idx: '①', text: '随机变量的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '随机变量', html:
            '<p class="tight">设随机试验的样本空间为 \\( \\Omega=\\{\\omega\\} \\)。若对每一个样本点 \\( \\omega\\in\\Omega \\)，都有一个确定的实数 \\( X(\\omega) \\) 与之对应，则称 \\( X=X(\\omega) \\) 为<b>随机变量</b>。</p>' +
            '<p class="tight">即：随机变量是定义在样本空间上的<b>实值函数</b>：</p>' +
            '<div class="fml">\\( X:\\ \\Omega\\longrightarrow\\mathbb{R},\\qquad \\omega\\mapsto X(\\omega) \\)</div>'
          },
          { t: 'card', kind: 'tip', tag: '本质', title: '为什么要把结果数值化？', html:
            '<ul class="none">' +
            '<li>数值化后可以<b>用函数、积分、求和</b>等分析工具处理随机现象；</li>' +
            '<li>事件「\\( X \\) 落在某区间」可直接写成 \\( \\{a<X\\leqslant b\\} \\)，成为集合运算；</li>' +
            '<li>所有随机变量都能用<b>分布函数</b>统一描述，从而离散与连续获得共同语言。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'randomVar', title: '随机变量：从样本点到实数轴', sub: '选择试验，观察映射过程' },
          { t: 'h3', idx: '②', text: '分布函数' },
          { t: 'card', kind: 'def', tag: '定义', title: '分布函数', html:
            '<p class="tight">设 \\( X \\) 是一个随机变量，对任意实数 \\( x \\)，称</p>' +
            '<div class="fml">\\( F(x)=P\\{X\\leqslant x\\},\\qquad -\\infty<x<+\\infty \\)</div>' +
            '<p class="tight">为 \\( X \\) 的<b>分布函数</b>（累积分布函数）。</p>' +
            '<p class="tight">注意：\\( F(x) \\) 是<b>普通函数</b>（不是随机变量），它完整地刻画了 \\( X \\) 的统计规律。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '分布函数的四条基本性质（大纲要求「理解」）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 单调不减：</b>若 \\( a<b \\)，则 \\( F(a)\\leqslant F(b) \\)</div>' +
            '<div class="fml-row"><b>2. 有界性：</b>\\( 0\\leqslant F(x)\\leqslant 1 \\)</div>' +
            '<div class="fml-row"><b>3. 极限性质：</b>\\( F(-\\infty)=\\lim\\limits_{x\\to-\\infty}F(x)=0,\\qquad F(+\\infty)=\\lim\\limits_{x\\to+\\infty}F(x)=1 \\)</div>' +
            '<div class="fml-row"><b>4. 右连续性：</b>\\( F(x+0)=F(x) \\)（即 \\( F \\) 在每点右连续）</div>' +
            '</div>' +
            '<p class="tight">反之，任何满足上述四条性质的函数，都可作为某个随机变量的分布函数。</p>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '用分布函数计算事件概率', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( P\\{X\\leqslant a\\}=F(a) \\)</div>' +
            '<div class="fml-row">\\( P\\{X>a\\}=1-F(a) \\)</div>' +
            '<div class="fml-row"><b>最重要：</b>\\( P\\{a<X\\leqslant b\\}=F(b)-F(a) \\)</div>' +
            '<div class="fml-row">\\( P\\{X=a\\}=F(a)-F(a-0) \\)（即 \\( F \\) 在该点的跳跃高度）</div>' +
            '<div class="fml-row">\\( P\\{a\\leqslant X\\leqslant b\\}=F(b)-F(a-0) \\)</div>' +
            '<div class="fml-row">\\( P\\{a<X<b\\}=F(b-0)-F(a) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>记忆要点：</b>左开右闭区间直接相减；端点是否含入，用 \\( F(a-0) \\) 修正。</p>'
          },
          { t: 'viz', build: 'cdf', title: '分布函数与区间概率', sub: '拖动 a、b，观察 F(b)−F(a) 的含义' },
          { t: 'viz', build: 'cdfProperties', title: '分布函数性质的逐项验证', sub: '切换分布与 x₁、x₂，核对单调不减、右连续、F(−∞)=0、F(+∞)=1' },
          { t: 'card', kind: 'warn', tag: '易错', title: '三个高频陷阱', html:
            '<ul class="none">' +
            '<li>\\( F(x)=P\\{X\\leqslant x\\} \\) 的累积区间为 \\( (-\\infty,x] \\)，右端点闭，不是 \\( P\\{X<x\\} \\)。</li>' +
            '<li>\\( P\\{X=a\\}=0 \\) 对<b>连续型</b>成立，对离散型不成立——离散型 \\( P\\{X=a\\} \\) 恰为该点跳跃高度。</li>' +
            '<li>求 \\( P\\{a<X\\leqslant b\\} \\) 时写成 \\( F(b)-F(a) \\) 是对的；写成 \\( P\\{a\\leqslant X\\leqslant b\\}=F(b)-F(a) \\) 则<b>错误</b>。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 2.1', meta: '基础 · 由分布函数求概率',
            q: '设 \\( X \\) 的分布函数为<br>\\( F(x)=\\begin{cases}0, & x<0\\\\[2pt] \\dfrac{x}{4}, & 0\\leqslant x<1\\\\[2pt] \\dfrac{1}{2}, & 1\\leqslant x<2\\\\[2pt] \\dfrac{3}{4}, & 2\\leqslant x<3\\\\[2pt] 1, & x\\geqslant 3\\end{cases} \\)<br>求 \\( P\\{X=1\\} \\)、\\( P\\{0.5<X\\leqslant 2.5\\} \\)、\\( P\\{X>2\\} \\)。',
            sol:
              '<p><b>\\( P\\{X=1\\} \\)：</b>取跳跃高度</p>' +
              '<div class="fml">\\( P\\{X=1\\}=F(1)-F(1-0)=\\dfrac12-\\dfrac14=\\mathbf{\\dfrac14} \\)</div>' +
              '<p><b>\\( P\\{0.5<X\\leqslant 2.5\\} \\)：</b></p>' +
              '<div class="fml">\\( =F(2.5)-F(0.5)=\\dfrac34-\\dfrac{0.5}{4}=\\dfrac34-\\dfrac18=\\mathbf{\\dfrac58} \\)</div>' +
              '<p><b>\\( P\\{X>2\\} \\)：</b></p>' +
              '<div class="fml">\\( =1-F(2)=1-\\dfrac34=\\mathbf{\\dfrac14} \\)</div>'
          },
          {
            no: '例 2.2', meta: '提高 · 由分布函数反求参数',
            q: '设连续型随机变量 \\( X \\) 的分布函数为 \\( F(x)=A+B\\arctan x \\)，\\( -\\infty<x<+\\infty \\)。求常数 \\( A \\)、\\( B \\) 及 \\( P\\{-1<X<1\\} \\)。',
            sol:
              '<p>由 \\( F(-\\infty)=0 \\)：\\( A+B\\left(-\\dfrac{\\pi}{2}\\right)=0 \\)；由 \\( F(+\\infty)=1 \\)：\\( A+B\\dfrac{\\pi}{2}=1 \\)。两式相加得 \\( 2A=1 \\)，故</p>' +
              '<div class="fml">\\( A=\\dfrac12,\\qquad B=\\dfrac{1}{\\pi} \\)</div>' +
              '<p>于是 \\( F(x)=\\dfrac12+\\dfrac{1}{\\pi}\\arctan x \\)，</p>' +
              '<div class="fml">\\( P\\{-1<X<1\\}=F(1)-F(-1)=\\dfrac{1}{\\pi}\\left[\\arctan 1-\\arctan(-1)\\right]=\\dfrac{1}{\\pi}\\cdot\\dfrac{\\pi}{2}=\\mathbf{\\dfrac12} \\)</div>'
          }
        ],
        pitfalls: [
          '分布函数的定义是 \\( F(x)=P\\{X\\leqslant x\\} \\)，注意「\\( \\leqslant \\)」不可改为「\\( < \\)」。',
          '右连续是分布函数的固有性质，画图时跳跃点取右侧值。',
          '\\( P\\{X=a\\}=F(a)-F(a-0) \\)：连续型该值为 0，离散型该值即 \\( p_a \\)。'
        ]
      },

      /* ================================================================
         2.2 离散型随机变量
         ================================================================ */
      {
        id: 'ch2-s2',
        num: '2.2',
        title: '离散型随机变量及其概率分布',
        lead: '取值可逐个列举的随机变量——用「分布律」完整描述，其分布函数是阶梯函数。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '离散型随机变量与分布律', html:
            '<p class="tight">若随机变量 \\( X \\) 的<b>全部可能取值</b>为有限个或可列无穷个，则称 \\( X \\) 为<b>离散型随机变量</b>。</p>' +
            '<p class="tight">设 \\( X \\) 的取值为 \\( x_1,x_2,\\cdots \\)，称</p>' +
            '<div class="fml">\\( P\\{X=x_k\\}=p_k,\\qquad k=1,2,\\cdots \\)</div>' +
            '<p class="tight">为 \\( X \\) 的<b>概率分布</b>（分布律）。</p>'
          },
          { t: 'card', kind: 'key', tag: '性质', title: '分布律的两条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>非负性：</b>\\( p_k\\geqslant 0,\\quad k=1,2,\\cdots \\)</div>' +
            '<div class="fml-row"><b>归一性：</b>\\( \\displaystyle\\sum_{k=1}^{\\infty}p_k=1 \\)</div>' +
            '</div>' +
            '<p class="tight">这两条既是性质，也是<b>检验</b>一个数列能否成为分布律的标准。</p>'
          },
          { t: 'h3', idx: '①', text: '三种表示方法' },
          { t: 'table', head: ['表示法', '形式', '适用场合'], rows: [
            ['表格法', '\\( \\begin{array}{c|cccc}X & x_1 & x_2 & \\cdots & x_n\\\\ \\hline p & p_1 & p_2 & \\cdots & p_n\\end{array} \\)', '取值较少，直观'],
            ['公式法', '\\( P\\{X=x_k\\}=p_k \\)', '有规律，便于推导'],
            ['图示法', '概率条形图', '展示形态与分布特征']
          ]},
          { t: 'h3', idx: '②', text: '分布函数' },
          { t: 'card', kind: 'thm', tag: '结论', title: '离散型的分布函数是阶梯函数', html:
            '<div class="fml">\\( F(x)=P\\{X\\leqslant x\\}=\\sum_{x_k\\leqslant x}p_k \\)</div>' +
            '<p class="tight">它满足：</p>' +
            '<ul class="none">' +
            '<li>是<b>右连续的阶梯函数</b>；</li>' +
            '<li>在 \\( x=x_k \\) 处有<b>跳跃</b>，跳跃高度恰为 \\( p_k \\)；</li>' +
            '<li>在相邻两个取值之间为常数。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'discretePmf', title: '分布律 ⇄ 分布函数', sub: '同一组概率的条形图与阶梯函数对照' },
          { t: 'viz', build: 'pmfSimulate', title: '频率逼近概率：模拟直方图', sub: '切换离散分布并增大试验次数，观察频率柱贴合概率柱' },
          { t: 'card', kind: 'tip', tag: '方法', title: '求分布律的一般步骤', html:
            '<ol class="clean">' +
            '<li><b>确定取值</b>：列出 \\( X \\) 的全部可能取值 \\( x_1,x_2,\\cdots \\)；</li>' +
            '<li><b>求各概率</b>：逐个计算 \\( p_k=P\\{X=x_k\\} \\)（常用古典概型、独立性、伯努利公式）；</li>' +
            '<li><b>检验</b>：验证 \\( \\sum p_k=1 \\)，否则说明漏算或重算。</li>' +
            '</ol>'
          }
        ],
        examples: [
          {
            no: '例 2.3', meta: '基础 · 求分布律',
            q: '袋中有 3 个白球、2 个黑球，从中不放回地取 2 个球，令 \\( X \\) 为取到的白球数。求 \\( X \\) 的分布律与分布函数 \\( F(x) \\)。',
            sol:
              '<p>样本点总数 \\( \\dbinom{5}{2}=10 \\)，\\( X \\) 的取值为 0, 1, 2。</p>' +
              '<div class="fml">\\( P\\{X=0\\}=\\dfrac{\\binom{2}{2}}{10}=\\dfrac{1}{10},\\quad P\\{X=1\\}=\\dfrac{\\binom{3}{1}\\binom{2}{1}}{10}=\\dfrac{6}{10}=\\dfrac35,\\quad P\\{X=2\\}=\\dfrac{\\binom{3}{2}}{10}=\\dfrac{3}{10} \\)</div>' +
              '<p>检验：\\( \\frac{1}{10}+\\frac{6}{10}+\\frac{3}{10}=1 \\) ✓</p>' +
              '<p>分布函数：</p>' +
              '<div class="fml">\\( F(x)=\\begin{cases}0, & x<0\\\\[2pt] \\dfrac{1}{10}, & 0\\leqslant x<1\\\\[2pt] \\dfrac{7}{10}, & 1\\leqslant x<2\\\\[2pt] 1, & x\\geqslant 2\\end{cases} \\)</div>'
          },
          {
            no: '例 2.4', meta: '真题改编 · 由分布律定参数',
            q: '设离散型随机变量 \\( X \\) 的分布律为 \\( P\\{X=k\\}=\\dfrac{a}{2^k} \\)，\\( k=1,2,3,\\cdots \\)。求 \\( a \\) 及 \\( P\\{X\\geqslant 3\\} \\)。',
            sol:
              '<p>由归一性：</p>' +
              '<div class="fml">\\( \\sum_{k=1}^{\\infty}\\dfrac{a}{2^k}=a\\cdot\\dfrac{\\frac12}{1-\\frac12}=a=1\\ \\Longrightarrow\\ a=\\mathbf{1} \\)</div>' +
              '<p>于是 \\( P\\{X=k\\}=\\dfrac{1}{2^k} \\)，</p>' +
              '<div class="fml">\\( P\\{X\\geqslant 3\\}=\\sum_{k=3}^{\\infty}\\dfrac{1}{2^k}=\\dfrac{\\frac18}{1-\\frac12}=\\mathbf{\\dfrac14} \\)</div>'
          }
        ],
        pitfalls: [
          '分布律中的取值必须<b>互不相同且列举完整</b>。',
          '求分布律后务必检验 \\( \\sum p_k=1 \\)。',
          '离散型随机变量在单点的概率可以大于 0，这是与连续型的本质区别。'
        ]
      },

      /* ================================================================
         2.3 常见离散型分布
         ================================================================ */
      {
        id: 'ch2-s3',
        num: '2.3',
        title: '常见离散型分布（五种）',
        lead: '大纲明确要求「掌握」0−1 分布、二项分布、几何分布、超几何分布、泊松分布，并「了解」泊松定理。',
        blocks: [
          { t: 'card', kind: 'key', tag: '总览', title: '五种常见离散型分布速查表', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>名称</th><th>记号</th><th>分布律</th><th>取值范围</th><th>背景</th></tr></thead><tbody>' +
            '<tr><td><b>0−1 分布</b></td><td>\\( B(1,p) \\)</td><td>\\( P\\{X=k\\}=p^k(1-p)^{1-k} \\)</td><td>\\( k=0,1 \\)</td><td>一次伯努利试验</td></tr>' +
            '<tr><td><b>二项分布</b></td><td>\\( B(n,p) \\)</td><td>\\( P\\{X=k\\}=\\dbinom{n}{k}p^k(1-p)^{n-k} \\)</td><td>\\( k=0,1,\\cdots,n \\)</td><td>n 重伯努利试验中成功次数</td></tr>' +
            '<tr><td><b>几何分布</b></td><td>\\( G(p) \\)</td><td>\\( P\\{X=k\\}=(1-p)^{k-1}p \\)</td><td>\\( k=1,2,\\cdots \\)</td><td>首次成功所需试验次数</td></tr>' +
            '<tr><td><b>超几何分布</b></td><td>\\( H(N,M,n) \\)</td><td>\\( P\\{X=k\\}=\\dfrac{\\binom{M}{k}\\binom{N-M}{n-k}}{\\binom{N}{n}} \\)</td><td>\\( \\max(0,n-N+M)\\leqslant k\\leqslant\\min(n,M) \\)</td><td>不放回抽样中的次品数</td></tr>' +
            '<tr><td><b>泊松分布</b></td><td>\\( P(\\lambda) \\)</td><td>\\( P\\{X=k\\}=\\dfrac{\\lambda^k}{k!}e^{-\\lambda} \\)</td><td>\\( k=0,1,2,\\cdots \\)</td><td>稀有事件计数</td></tr>' +
            '</tbody></table></div>'
          },

          { t: 'h3', idx: '①', text: '0−1 分布 B(1,p)' },
          { t: 'p', html: '若 \\( X \\) 只取 0 与 1 两个值，且 \\( P\\{X=1\\}=p,\\ P\\{X=0\\}=1-p \\)（\\( 0<p<1 \\)），则称 \\( X \\) 服从 <b>0−1 分布</b>（也称两点分布），记作 \\( X\\sim B(1,p) \\)。' },
          { t: 'p', html: '它是最简单的离散型分布，是二项分布 \\( n=1 \\) 的特例。任何只有两种结果的试验（成败、正反、合格与否）都可用它建模。' },

          { t: 'h3', idx: '②', text: '二项分布 B(n,p)' },
          { t: 'card', kind: 'def', tag: '定义', title: '二项分布', html:
            '<p class="tight">在 \\( n \\) 重伯努利试验中，设每次试验成功的概率为 \\( p \\)，令 \\( X \\) 为 \\( n \\) 次试验中成功的次数，则</p>' +
            '<div class="fml">\\( P\\{X=k\\}=\\dbinom{n}{k}p^k(1-p)^{n-k},\\qquad k=0,1,2,\\cdots,n \\)</div>' +
            '<p class="tight">称 \\( X \\) 服从参数为 \\( n,p \\) 的<b>二项分布</b>，记作 \\( X\\sim B(n,p) \\)。</p>'
          },
          { t: 'card', kind: 'tip', tag: '识别', title: '何时用二项分布？', html:
            '<ul class="none">' +
            '<li><b>n 次试验独立重复</b>（独立性）；</li>' +
            '<li>每次只有<b>两种结果</b>；</li>' +
            '<li>每次成功概率 \\( p \\) <b>不变</b>（有放回抽样）；</li>' +
            '<li>关心的是<b>成功总次数</b>。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'binomial', title: '二项分布 B(n,p) 形态', sub: '拖动 n、p，观察分布形状与最可能值' },

          { t: 'h3', idx: '③', text: '几何分布 G(p)' },
          { t: 'card', kind: 'def', tag: '定义', title: '几何分布', html:
            '<p class="tight">在伯努利试验序列中，设每次成功概率为 \\( p \\)，令 \\( X \\) 为<b>首次成功时已进行的试验次数</b>，则</p>' +
            '<div class="fml">\\( P\\{X=k\\}=(1-p)^{k-1}p,\\qquad k=1,2,3,\\cdots \\)</div>' +
            '<p class="tight">称 \\( X \\) 服从参数为 \\( p \\) 的<b>几何分布</b>，记作 \\( X\\sim G(p) \\)。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '几何分布的无记忆性', html:
            '<div class="fml">\\( P\\{X>m+n\\mid X>m\\}=P\\{X>n\\},\\qquad m,n\\geqslant 0 \\)</div>' +
            '<p class="tight"><b>含义：</b>「已经失败了 \\( m \\) 次」并不改变「还需再等 \\( n \\) 次以上」的概率——过去不影响未来。这是几何分布（以及连续型中的指数分布）独有的性质，也是常考点。</p>'
          },
          { t: 'card', kind: 'warn', tag: '辨析', title: '两种「几何分布」定义', html:
            '<p class="tight">部分教材定义 \\( X \\) 为<b>首次成功前失败的次数</b>，此时 \\( P\\{X=k\\}=(1-p)^k p,\\ k=0,1,2,\\cdots \\)。</p>' +
            '<p class="tight">浙大版等常用考研教材采用第一种定义（\\( k \\) 从 1 开始，表示<b>试验次数</b>）。做题时务必看清题目问的是「试验次数」还是「失败次数」。</p>'
          },
          { t: 'viz', build: 'geometric', title: '几何分布与首次成功', sub: '模拟伯努利序列，观察首次成功位置的分布' },

          { t: 'h3', idx: '④', text: '超几何分布 H(N,M,n)' },
          { t: 'card', kind: 'def', tag: '定义', title: '超几何分布', html:
            '<p class="tight">设 \\( N \\) 件产品中有 \\( M \\) 件次品，从中<b>不放回</b>地抽取 \\( n \\) 件，令 \\( X \\) 为抽到的次品数，则</p>' +
            '<div class="fml">\\( P\\{X=k\\}=\\dfrac{\\dbinom{M}{k}\\dbinom{N-M}{n-k}}{\\dbinom{N}{n}},\\qquad k=\\max(0,\\,n-N+M),\\cdots,\\min(n,M) \\)</div>' +
            '<p class="tight">称 \\( X \\) 服从<b>超几何分布</b>，记作 \\( X\\sim H(N,M,n) \\)。</p>'
          },
          { t: 'card', kind: 'tip', tag: '对比', title: '超几何 vs 二项', html:
            '<table class="tbl" style="margin:0">' +
            '<thead><tr><th></th><th>超几何分布</th><th>二项分布</th></tr></thead><tbody>' +
            '<tr><td>抽样方式</td><td><b>不放回</b></td><td><b>有放回</b></td></tr>' +
            '<tr><td>各次试验</td><td>不独立</td><td>独立</td></tr>' +
            '<tr><td>成功概率</td><td>逐次变化</td><td>保持 \\( p \\) 不变</td></tr>' +
            '<tr><td>关系</td><td colspan="2">当 \\( N \\) 很大、\\( n \\) 相对 \\( N \\) 很小时，超几何分布近似于 \\( B\\left(n,\\frac{M}{N}\\right) \\)</td></tr>' +
            '</tbody></table>'
          },
          { t: 'viz', build: 'hypergeom', title: '超几何分布：不放回抽样', sub: '调节 N、M、n，观察分布随抽取比例的变化' },

          { t: 'h3', idx: '⑤', text: '泊松分布 P(λ)' },
          { t: 'card', kind: 'def', tag: '定义', title: '泊松分布', html:
            '<p class="tight">若随机变量 \\( X \\) 的分布律为</p>' +
            '<div class="fml">\\( P\\{X=k\\}=\\dfrac{\\lambda^k}{k!}e^{-\\lambda},\\qquad k=0,1,2,\\cdots,\\ \\lambda>0 \\)</div>' +
            '<p class="tight">则称 \\( X \\) 服从参数为 \\( \\lambda \\) 的<b>泊松分布</b>，记作 \\( X\\sim P(\\lambda) \\)。</p>' +
            '<p class="tight">验证归一性：\\( \\sum\\limits_{k=0}^{\\infty}\\dfrac{\\lambda^k}{k!}e^{-\\lambda}=e^{\\lambda}\\cdot e^{-\\lambda}=1 \\)。</p>'
          },
          { t: 'p', html: '<b>典型背景：</b>单位时间内某电话交换台收到的呼叫次数、某放射源发出的粒子数、某路段交通事故数、稀有缺陷数——统称「稀有事件计数」。' },
          { t: 'viz', build: 'poisson', title: '泊松分布 P(λ) 形态', sub: '拖动 λ，观察分布如何趋于对称' },
          { t: 'viz', build: 'poissonProcess', title: '泊松流与到达间隔', sub: '观察事件时间线，核对间隔服从 E(λ)、计数服从 P(λT)' },

          { t: 'h3', idx: '⑥', text: '泊松定理（大纲：了解结论和应用条件）' },
          { t: 'card', kind: 'thm', tag: '定理', title: '泊松定理', html:
            '<p class="tight">设随机变量 \\( X_n\\sim B(n,p_n) \\)（\\( p_n \\) 与 \\( n \\) 有关）。若当 \\( n\\to\\infty \\) 时</p>' +
            '<div class="fml">\\( np_n\\longrightarrow\\lambda\\quad(\\lambda>0\\ \\text{为常数}) \\)</div>' +
            '<p class="tight">则对任意固定的非负整数 \\( k \\)：</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}\\dbinom{n}{k}p_n^k(1-p_n)^{n-k}=\\dfrac{\\lambda^k}{k!}e^{-\\lambda} \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '应用条件', title: '何时可用泊松分布近似二项分布？', html:
            '<div class="fml">\\( n\\ \\text{很大},\\qquad p\\ \\text{很小},\\qquad \\lambda=np\\ \\text{适中} \\)</div>' +
            '<p class="tight"><b>经验标准：</b>\\( n\\geqslant 100 \\) 且 \\( p\\leqslant 0.1 \\)（部分教材用 \\( n\\geqslant 20,\\ p\\leqslant 0.05 \\)），此时</p>' +
            '<div class="fml">\\( \\dbinom{n}{k}p^k(1-p)^{n-k}\\approx\\dfrac{(np)^k}{k!}e^{-np} \\)</div>' +
            '<p class="tight">这样可把难以计算的组合数运算化为简单的指数运算，这正是「会用泊松分布近似表示二项分布」的含义。</p>'
          },
          { t: 'viz', build: 'poissonApprox', title: '泊松定理验证', sub: '固定 λ=np，增大 n 观察二项分布如何逼近泊松分布' },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>辨识模型</b>：给出实际背景，判断服从哪种分布（关键是「有放回/无放回」「求次数/求总次数/求首次」）。</li>' +
            '<li><b>定参数</b>：由归一性或实际含义确定 \\( n,p,\\lambda,N,M \\)。</li>' +
            '<li><b>算概率</b>：直接套分布律，注意「至少/至多/恰好」的转化。</li>' +
            '<li><b>泊松近似</b>：给出 \\( n,p \\) 很大/很小的场景，要求用泊松分布近似。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 2.5', meta: '基础 · 二项分布',
            q: '某产品次品率为 0.05，从中随机抽取 20 件（有放回）。求：(1) 恰有 2 件次品的概率；(2) 至多有 1 件次品的概率。',
            sol:
              '<p>设 \\( X \\) 为次品数，则 \\( X\\sim B(20,0.05) \\)。</p>' +
              '<p><b>(1)</b></p>' +
              '<div class="fml">\\( P\\{X=2\\}=\\dbinom{20}{2}(0.05)^2(0.95)^{18}=190\\times0.0025\\times0.3972\\approx\\mathbf{0.1887} \\)</div>' +
              '<p><b>(2)</b></p>' +
              '<div class="fml">\\( P\\{X\\leqslant 1\\}=(0.95)^{20}+20\\times0.05\\times(0.95)^{19}\\approx0.3585+0.3774=\\mathbf{0.7359} \\)</div>'
          },
          {
            no: '例 2.6', meta: '真题改编 · 几何分布',
            q: '某射手命中率为 0.6，独立射击直到首次命中为止。求：(1) 恰好射击 3 次的概率；(2) 射击次数不超过 4 次的概率。',
            sol:
              '<p>设射击次数为 \\( X \\)，则 \\( X\\sim G(0.6) \\)，\\( P\\{X=k\\}=(0.4)^{k-1}\\times0.6 \\)。</p>' +
              '<p><b>(1)</b> \\( P\\{X=3\\}=(0.4)^2\\times0.6=0.16\\times0.6=\\mathbf{0.096} \\)</p>' +
              '<p><b>(2)</b></p>' +
              '<div class="fml">\\( P\\{X\\leqslant 4\\}=0.6+0.4\\times0.6+0.4^2\\times0.6+0.4^3\\times0.6 \\)</div>' +
              '<div class="fml">\\( =0.6(1+0.4+0.16+0.064)=0.6\\times1.624=\\mathbf{0.9744} \\)</div>' +
              '<p class="fml-note">或用公式 \\( P\\{X\\leqslant k\\}=1-(1-p)^k=1-0.4^4=1-0.0256=0.9744 \\)。</p>'
          },
          {
            no: '例 2.7', meta: '基础 · 超几何分布',
            q: '一批 100 件产品中有 10 件次品，从中不放回地抽取 5 件。求恰有 2 件次品的概率。',
            sol:
              '<p>设次品数为 \\( X \\)，则 \\( X\\sim H(100,10,5) \\)。</p>' +
              '<div class="fml">\\( P\\{X=2\\}=\\dfrac{\\dbinom{10}{2}\\dbinom{90}{3}}{\\dbinom{100}{5}}=\\dfrac{45\\times117480}{75287520}\\approx\\mathbf{0.0702} \\)</div>' +
              '<p class="fml-note">若近似用二项分布 \\( B(5,0.1) \\)：\\( \\dbinom52(0.1)^2(0.9)^3=0.0729 \\)，可见抽取比例较小时近似效果良好。</p>'
          },
          {
            no: '例 2.8', meta: '真题改编 · 泊松定理近似',
            q: '某厂生产的一批产品中，次品率为 0.001，共 1000 件。用泊松分布近似求：(1) 恰有 2 件次品的概率；(2) 至少有 1 件次品的概率。',
            sol:
              '<p>设次品数 \\( X\\sim B(1000,0.001) \\)，取 \\( \\lambda=np=1000\\times0.001=1 \\)，用 \\( P(1) \\) 近似。</p>' +
              '<p><b>(1)</b></p>' +
              '<div class="fml">\\( P\\{X=2\\}\\approx\\dfrac{1^2}{2!}e^{-1}=\\dfrac{1}{2e}\\approx\\mathbf{0.1839} \\)</div>' +
              '<p><b>(2)</b></p>' +
              '<div class="fml">\\( P\\{X\\geqslant 1\\}\\approx1-e^{-1}\\approx\\mathbf{0.6321} \\)</div>' +
              '<p class="fml-note">若直接算二项分布 \\( 1-0.999^{1000}\\approx0.6323 \\)，可见泊松近似精度很高。</p>'
          }
        ],
        pitfalls: [
          '<b>有放回</b>→二项分布；<b>无放回</b>→超几何分布。这是最常考的辨识点。',
          '几何分布的起点是 1（试验次数），不要写成 \\( (1-p)^k p \\)。',
          '泊松近似的条件是 \\( n \\) 大、\\( p \\) 小、\\( \\lambda=np \\) 适中，不能乱用。',
          '泊松分布取值范围从 0 开始，不要漏掉 \\( k=0 \\)。',
          '二项分布中 \\( p \\) 必须每次相同；若不放回，各次概率改变，须用超几何分布。'
        ]
      },

      /* ================================================================
         2.4 连续型随机变量与概率密度
         ================================================================ */
      {
        id: 'ch2-s4',
        num: '2.4',
        title: '连续型随机变量与概率密度',
        lead: '取值充满一个区间的随机变量——用「概率密度函数」描述，单点概率为 0。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '连续型随机变量与概率密度', html:
            '<p class="tight">若随机变量 \\( X \\) 的分布函数 \\( F(x) \\) 可以表示为</p>' +
            '<div class="fml">\\( F(x)=\\int_{-\\infty}^{x}f(t)\\,\\mathrm{d}t,\\qquad -\\infty<x<+\\infty \\)</div>' +
            '<p class="tight">其中 \\( f(x)\\geqslant 0 \\) 为可积函数，则称 \\( X \\) 为<b>连续型随机变量</b>，\\( f(x) \\) 为 \\( X \\) 的<b>概率密度函数</b>（简称概率密度）。</p>'
          },
          { t: 'card', kind: 'key', tag: '性质', title: '概率密度的两条性质（大纲要求「理解」）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>非负性：</b>\\( f(x)\\geqslant 0 \\)</div>' +
            '<div class="fml-row"><b>归一性：</b>\\( \\displaystyle\\int_{-\\infty}^{+\\infty}f(x)\\,\\mathrm{d}x=1 \\)</div>' +
            '</div>' +
            '<p class="tight">这两条既是性质，也是<b>判定</b>一个函数能否作为概率密度的标准，以及<b>求待定常数</b>的常用手段。</p>'
          },
          { t: 'card', kind: 'thm', tag: '结论', title: '核心计算公式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>区间概率：</b>\\( P\\{a<X\\leqslant b\\}=F(b)-F(a)=\\displaystyle\\int_{a}^{b}f(x)\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row"><b>单点概率：</b>\\( P\\{X=a\\}=0 \\)</div>' +
            '<div class="fml-row"><b>由 F 求 f：</b>在 \\( F \\) 可导点处 \\( f(x)=F\'(x) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>重要推论：</b>连续型随机变量取任一单点的概率为 0，故区间端点是否计入不影响概率：</p>' +
            '<div class="fml">\\( P\\{a<X<b\\}=P\\{a\\leqslant X\\leqslant b\\}=P\\{a\\leqslant X<b\\}=\\int_a^b f(x)\\,\\mathrm{d}x \\)</div>'
          },
          { t: 'viz', build: 'density', title: '概率密度与面积', sub: '拖动区间端点，观察面积即概率' },
          { t: 'viz', build: 'pdfArea', title: '面积 = F(x) 的联动', sub: '拖动 x 改变积分上界，左尾面积与 F(x) 同步变化' },
          { t: 'card', kind: 'warn', tag: '易错', title: '关于概率密度的三个误解', html:
            '<ul class="none">' +
            '<li>\\( f(x) \\) <b>不是概率</b>！\\( f(x) \\) 可以大于 1（例如 \\( U(0,0.5) \\) 的密度恒为 2）。</li>' +
            '<li>只有 \\( \\int_a^b f(x)\\mathrm{d}x \\) 才是概率。</li>' +
            '<li>\\( P\\{X=a\\}=0 \\) <b>不等于</b>「\\( X=a \\) 不可能发生」——概率为 0 的事件未必是不可能事件。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'tip', tag: '方法', title: '常见题型', html:
            '<ol class="clean">' +
            '<li><b>定常数</b>：用 \\( \\int_{-\\infty}^{+\\infty}f(x)\\mathrm{d}x=1 \\) 求待定参数。</li>' +
            '<li><b>求分布函数</b>：分段积分 \\( F(x)=\\int_{-\\infty}^x f(t)\\mathrm{d}t \\)。</li>' +
            '<li><b>求区间概率</b>：直接积分或 \\( F(b)-F(a) \\)。</li>' +
            '<li><b>由 F 求 f</b>：分段求导，注意在 \\( F \\) 不可导点处 \\( f \\) 可任意定义（不影响积分）。</li>' +
            '</ol>'
          }
        ],
        examples: [
          {
            no: '例 2.9', meta: '基础 · 由归一性定常数',
            q: '设连续型随机变量 \\( X \\) 的概率密度为<br>\\( f(x)=\\begin{cases}kx, & 0\\leqslant x\\leqslant 2\\\\ 0, & \\text{其他}\\end{cases} \\)<br>求 \\( k \\) 及 \\( P\\{1<X<1.5\\} \\)。',
            sol:
              '<p>由归一性：</p>' +
              '<div class="fml">\\( \\int_0^2 kx\\,\\mathrm{d}x=k\\cdot\\dfrac{x^2}{2}\\Big|_0^2=2k=1\\ \\Longrightarrow\\ k=\\mathbf{\\dfrac12} \\)</div>' +
              '<p>于是 \\( f(x)=\\dfrac{x}{2} \\)（\\( 0\\leqslant x\\leqslant 2 \\)），</p>' +
              '<div class="fml">\\( P\\{1<X<1.5\\}=\\int_1^{1.5}\\dfrac{x}{2}\\mathrm{d}x=\\dfrac{x^2}{4}\\Big|_1^{1.5}=\\dfrac{2.25-1}{4}=\\mathbf{\\dfrac{5}{16}} \\)</div>'
          },
          {
            no: '例 2.10', meta: '真题改编 · 求分布函数',
            q: '设 \\( X \\) 的概率密度为 \\( f(x)=\\begin{cases}\\lambda e^{-\\lambda x}, & x>0\\\\ 0, & x\\leqslant 0\\end{cases} \\)（\\( \\lambda>0 \\)）。求 \\( X \\) 的分布函数。',
            sol:
              '<p>当 \\( x\\leqslant 0 \\) 时，\\( F(x)=\\int_{-\\infty}^{x}0\\,\\mathrm{d}t=0 \\)。</p>' +
              '<p>当 \\( x>0 \\) 时，</p>' +
              '<div class="fml">\\( F(x)=\\int_0^{x}\\lambda e^{-\\lambda t}\\,\\mathrm{d}t=\\left[-e^{-\\lambda t}\\right]_0^x=1-e^{-\\lambda x} \\)</div>' +
              '<p>故</p>' +
              '<div class="fml">\\( F(x)=\\begin{cases}0, & x\\leqslant 0\\\\ 1-e^{-\\lambda x}, & x>0\\end{cases} \\)</div>'
          }
        ],
        pitfalls: [
          '概率密度可以大于 1，它不是概率。',
          '连续型随机变量在单点的概率为 0，因此 \\( P\\{X=a\\}=0 \\) 不代表不可能发生。',
          '由 \\( F \\) 求 \\( f \\) 时，在 \\( F \\) 的不可导点（如分段点）处，\\( f \\) 的取值不影响积分结果，可任取。',
          '注意概率密度的定义域必须写清楚，特别是分段函数的「其他」部分为 0。'
        ]
      },

      /* ================================================================
         2.5 常见连续型分布
         ================================================================ */
      {
        id: 'ch2-s5',
        num: '2.5',
        title: '常见连续型分布（三种）',
        lead: '大纲要求「掌握」均匀分布、正态分布、指数分布及其应用——正态分布是重中之重。',
        blocks: [
          { t: 'card', kind: 'key', tag: '总览', title: '三种常见连续型分布速查表', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>名称</th><th>记号</th><th>概率密度 \\( f(x) \\)</th><th>分布函数 \\( F(x) \\)</th></tr></thead><tbody>' +
            '<tr><td><b>均匀分布</b></td><td>\\( U(a,b) \\)</td><td>\\( \\dfrac{1}{b-a},\\ a\\leqslant x\\leqslant b \\)</td><td>\\( \\dfrac{x-a}{b-a},\\ a\\leqslant x\\leqslant b \\)</td></tr>' +
            '<tr><td><b>指数分布</b></td><td>\\( E(\\lambda) \\)</td><td>\\( \\lambda e^{-\\lambda x},\\ x>0 \\)</td><td>\\( 1-e^{-\\lambda x},\\ x>0 \\)</td></tr>' +
            '<tr><td><b>正态分布</b></td><td>\\( N(\\mu,\\sigma^2) \\)</td><td>\\( \\dfrac{1}{\\sqrt{2\\pi}\\,\\sigma}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\)</td><td>无初等原函数，查标准正态表</td></tr>' +
            '</tbody></table></div>'
          },

          { t: 'h3', idx: '①', text: '均匀分布 U(a,b)' },
          { t: 'card', kind: 'def', tag: '定义', title: '均匀分布', html:
            '<p class="tight">若 \\( X \\) 的概率密度为</p>' +
            '<div class="fml">\\( f(x)=\\begin{cases}\\dfrac{1}{b-a}, & a\\leqslant x\\leqslant b\\\\[6pt] 0, & \\text{其他}\\end{cases} \\)</div>' +
            '<p class="tight">则称 \\( X \\) 服从区间 \\( [a,b] \\) 上的<b>均匀分布</b>，记作 \\( X\\sim U(a,b) \\)。</p>' +
            '<p class="tight"><b>含义：</b>\\( X \\) 落在 \\( [a,b] \\) 内任一长度相同的子区间内的概率相等，只与<b>长度</b>有关。</p>'
          },
          { t: 'card', kind: 'key', tag: '结论', title: '均匀分布的重要公式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>子区间概率：</b>\\( P\\{c<X<d\\}=\\dfrac{d-c}{b-a},\\qquad a\\leqslant c<d\\leqslant b \\)</div>' +
            '<div class="fml-row"><b>分布函数：</b>\\( F(x)=\\begin{cases}0, & x<a\\\\ \\dfrac{x-a}{b-a}, & a\\leqslant x<b\\\\ 1, & x\\geqslant b\\end{cases} \\)</div>' +
            '</div>' +
            '<p class="tight"><b>应用：</b>随机取点、随机到达时刻、四舍五入误差等，是几何概型在分布论中的对应物。</p>'
          },
          { t: 'viz', build: 'uniform', title: '均匀分布 U(a,b)', sub: '拖动 a、b，观察密度与分布函数' },

          { t: 'h3', idx: '②', text: '指数分布 E(λ)' },
          { t: 'card', kind: 'def', tag: '定义', title: '指数分布（大纲给出标准形式）', html:
            '<p class="tight">若 \\( X \\) 的概率密度为</p>' +
            '<div class="fml">\\( f(x)=\\begin{cases}\\lambda e^{-\\lambda x}, & x>0\\\\ 0, & x\\leqslant 0\\end{cases}\\qquad(\\lambda>0) \\)</div>' +
            '<p class="tight">则称 \\( X \\) 服从参数为 \\( \\lambda \\) 的<b>指数分布</b>，记作 \\( X\\sim E(\\lambda) \\)。</p>' +
            '<p class="tight">其分布函数为</p>' +
            '<div class="fml">\\( F(x)=\\begin{cases}1-e^{-\\lambda x}, & x>0\\\\ 0, & x\\leqslant 0\\end{cases} \\)</div>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '指数分布的无记忆性', html:
            '<div class="fml">\\( P\\{X>s+t\\mid X>s\\}=P\\{X>t\\},\\qquad s,t>0 \\)</div>' +
            '<p class="tight"><b>证明：</b>\\( P\\{X>s+t\\mid X>s\\}=\\dfrac{P\\{X>s+t\\}}{P\\{X>s\\}}=\\dfrac{e^{-\\lambda(s+t)}}{e^{-\\lambda s}}=e^{-\\lambda t}=P\\{X>t\\} \\)。</p>' +
            '<p class="tight"><b>含义：</b>元件已使用 \\( s \\) 小时，其剩余寿命分布与全新时相同——「不老化」。指数分布是<b>唯一</b>具有无记忆性的连续型分布（与几何分布对应）。</p>'
          },
          { t: 'card', kind: 'tip', tag: '应用', title: '典型应用场景', html:
            '<ul class="none">' +
            '<li>元件寿命、设备无故障工作时间；</li>' +
            '<li>排队论中相邻两个顾客到达的时间间隔；</li>' +
            '<li>放射性衰变的等待时间。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'exponential', title: '指数分布 E(λ) 与无记忆性', sub: '拖动 λ，观察密度衰减与条件概率' },

          { t: 'h3', idx: '③', text: '正态分布 N(μ,σ²)' },
          { t: 'card', kind: 'def', tag: '定义', title: '正态分布', html:
            '<p class="tight">若 \\( X \\) 的概率密度为</p>' +
            '<div class="fml">\\( f(x)=\\dfrac{1}{\\sqrt{2\\pi}\\,\\sigma}\\,e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}},\\qquad -\\infty<x<+\\infty \\)</div>' +
            '<p class="tight">其中 \\( \\mu \\) 为任意实数，\\( \\sigma>0 \\)，则称 \\( X \\) 服从参数为 \\( \\mu,\\sigma^2 \\) 的<b>正态分布</b>，记作 \\( X\\sim N(\\mu,\\sigma^2) \\)。</p>' +
            '<p class="tight">当 \\( \\mu=0,\\ \\sigma=1 \\) 时，称为<b>标准正态分布</b>，记作 \\( X\\sim N(0,1) \\)，其密度记为 \\( \\varphi(x) \\)，分布函数记为 \\( \\Phi(x) \\)。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '标准正态分布 \\( \\Phi(x) \\) 的核心公式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>密度：</b>\\( \\varphi(x)=\\dfrac{1}{\\sqrt{2\\pi}}e^{-\\frac{x^2}{2}} \\)</div>' +
            '<div class="fml-row"><b>偶函数：</b>\\( \\varphi(-x)=\\varphi(x) \\)</div>' +
            '<div class="fml-row"><b>对称性：</b>\\( \\Phi(-x)=1-\\Phi(x) \\)，特别地 \\( \\Phi(0)=\\dfrac12 \\)</div>' +
            '<div class="fml-row"><b>区间概率：</b>\\( P\\{a<X<b\\}=\\Phi\\left(\\dfrac{b-\\mu}{\\sigma}\\right)-\\Phi\\left(\\dfrac{a-\\mu}{\\sigma}\\right) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>标准化：</b>若 \\( X\\sim N(\\mu,\\sigma^2) \\)，则 \\( \\dfrac{X-\\mu}{\\sigma}\\sim N(0,1) \\)。这是把一般正态转化为标准正态的桥梁。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '正态曲线的特征', html:
            '<ul class="none">' +
            '<li>关于 \\( x=\\mu \\) <b>对称</b>，在 \\( x=\\mu \\) 处取最大值 \\( \\dfrac{1}{\\sqrt{2\\pi}\\sigma} \\)；</li>' +
            '<li>\\( x=\\mu\\pm\\sigma \\) 为<b>拐点</b>；</li>' +
            '<li>以 \\( x \\) 轴为渐近线，\\( x\\to\\pm\\infty \\) 时趋于 0；</li>' +
            '<li>\\( \\sigma \\) 越大曲线越<b>平缓</b>，\\( \\sigma \\) 越小越<b>陡峭</b>；\\( \\mu \\) 决定<b>位置</b>，\\( \\sigma \\) 决定<b>形状</b>。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'key', tag: '结论', title: '3σ 原则与上分位点', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( P\\{|X-\\mu|<\\sigma\\}\\approx0.6826 \\)</div>' +
            '<div class="fml-row">\\( P\\{|X-\\mu|<2\\sigma\\}\\approx0.9544 \\)</div>' +
            '<div class="fml-row">\\( P\\{|X-\\mu|<3\\sigma\\}\\approx0.9974 \\)</div>' +
            '</div>' +
            '<p class="tight"><b>上 \\( \\alpha \\) 分位点</b> \\( u_\\alpha \\)：满足 \\( P\\{X>u_\\alpha\\}=\\alpha \\)，即 \\( \\Phi(u_\\alpha)=1-\\alpha \\)。常用值：</p>' +
            '<div class="tbl-wrap" style="margin:10px 0 0"><table class="tbl"><thead><tr><th>\\( \\alpha \\)</th><th>0.10</th><th>0.05</th><th>0.025</th><th>0.01</th></tr></thead>' +
            '<tbody><tr><td>\\( u_\\alpha \\)</td><td>1.282</td><td>1.645</td><td>1.960</td><td>2.326</td></tr></tbody></table></div>'
          },
          { t: 'viz', build: 'normal', title: '正态分布 N(μ,σ²) 与标准化', sub: '拖动 μ、σ 与区间，实时计算概率' },
          { t: 'viz', build: 'stdNormal', title: '标准正态分布表与阴影面积', sub: '悬停查看 Φ(x) 值' },
          { t: 'viz', build: 'normalThreeSigma', title: '正态的 3σ 规则', sub: '拖动 k，核对 68.27% / 95.45% / 99.73% 与模拟比例' }
        ],
        examples: [
          {
            no: '例 2.11', meta: '基础 · 均匀分布',
            q: '设 \\( X\\sim U(2,6) \\)。求 \\( P\\{3<X<5\\} \\) 与 \\( P\\{X>4\\mid X>3\\} \\)。',
            sol:
              '<p><b>(1)</b></p>' +
              '<div class="fml">\\( P\\{3<X<5\\}=\\dfrac{5-3}{6-2}=\\mathbf{\\dfrac12} \\)</div>' +
              '<p><b>(2)</b> 由条件概率：</p>' +
              '<div class="fml">\\( P\\{X>4\\mid X>3\\}=\\dfrac{P\\{X>4\\}}{P\\{X>3\\}}=\\dfrac{(6-4)/4}{(6-3)/4}=\\mathbf{\\dfrac23} \\)</div>'
          },
          {
            no: '例 2.12', meta: '真题改编 · 指数分布',
            q: '设某元件寿命 \\( X\\sim E(0.01) \\)（单位：小时）。求：(1) 该元件能工作 100 小时以上的概率；(2) 已工作 100 小时后，还能再工作 100 小时以上的概率。',
            sol:
              '<p><b>(1)</b></p>' +
              '<div class="fml">\\( P\\{X>100\\}=e^{-0.01\\times100}=e^{-1}\\approx\\mathbf{0.3679} \\)</div>' +
              '<p><b>(2)</b> 由无记忆性：</p>' +
              '<div class="fml">\\( P\\{X>200\\mid X>100\\}=P\\{X>100\\}=e^{-1}\\approx\\mathbf{0.3679} \\)</div>' +
              '<p class="fml-note">若用定义计算：\\( \\dfrac{e^{-2}}{e^{-1}}=e^{-1} \\)，结果一致——这正是无记忆性的体现。</p>'
          },
          {
            no: '例 2.13', meta: '真题改编 · 正态分布计算',
            q: '设 \\( X\\sim N(1,4) \\)。求 \\( P\\{0<X<3\\} \\)（已知 \\( \\Phi(0.5)=0.6915,\\ \\Phi(1)=0.8413 \\)）。',
            sol:
              '<p>标准化：\\( \\mu=1,\\ \\sigma=2 \\)，故</p>' +
              '<div class="fml">\\( P\\{0<X<3\\}=\\Phi\\left(\\dfrac{3-1}{2}\\right)-\\Phi\\left(\\dfrac{0-1}{2}\\right)=\\Phi(1)-\\Phi(-0.5) \\)</div>' +
              '<p>由对称性 \\( \\Phi(-0.5)=1-\\Phi(0.5)=1-0.6915=0.3085 \\)，于是</p>' +
              '<div class="fml">\\( P\\{0<X<3\\}=0.8413-0.3085=\\mathbf{0.5328} \\)</div>'
          },
          {
            no: '例 2.14', meta: '提高 · 正态分布反求参数',
            q: '设 \\( X\\sim N(\\mu,\\sigma^2) \\)，已知 \\( P\\{X<3\\}=0.5 \\)，\\( P\\{X>9\\}=0.0228 \\)（\\( \\Phi(2)=0.9772 \\)）。求 \\( \\mu \\) 与 \\( \\sigma \\)。',
            sol:
              '<p>由 \\( P\\{X<3\\}=0.5 \\) 知 \\( x=3 \\) 是对称中心，故 \\( \\mu=3 \\)。</p>' +
              '<p>由 \\( P\\{X>9\\}=0.0228 \\)：</p>' +
              '<div class="fml">\\( P\\{X\\leqslant 9\\}=1-0.0228=0.9772=\\Phi(2) \\)</div>' +
              '<p>故 \\( \\dfrac{9-3}{\\sigma}=2 \\)，得 \\( \\sigma=3 \\)。</p>'
          }
        ],
        pitfalls: [
          '正态分布密度中的 \\( \\sigma \\) 是<b>标准差</b>，参数写成 \\( N(\\mu,\\sigma^2) \\) 时第二个参数是<b>方差</b>。',
          '\\( \\Phi(-x)=1-\\Phi(x) \\) 必须熟练，很多题目直接给出 \\( \\Phi \\) 的正值。',
          '指数分布的密度只在 \\( x>0 \\) 非零，负半轴为 0，积分时注意下限。',
          '均匀分布的密度是 \\( \\frac{1}{b-a} \\)，注意分母是区间长度。',
          '正态分布计算务必先标准化，再查表或代入 \\( \\Phi \\)。'
        ]
      },

      /* ================================================================
         2.6 随机变量函数的分布
         ================================================================ */
      {
        id: 'ch2-s6',
        num: '2.6',
        title: '随机变量函数的分布',
        lead: '大纲要求「会求随机变量函数的分布」——已知 \\( X \\) 的分布，求 \\( Y=g(X) \\) 的分布。',
        blocks: [
          { t: 'card', kind: 'tip', tag: '总纲', title: '两条路线', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>类型</th><th>方法</th><th>要点</th></tr></thead><tbody>' +
            '<tr><td><b>离散型</b></td><td>逐点映射 + 合并同值</td><td>把相同 \\( g(x_k) \\) 的概率<b>相加</b></td></tr>' +
            '<tr><td><b>连续型</b></td><td>分布函数法（通用）<br>公式法（单调可导时）</td><td>先求 \\( F_Y(y)=P\\{g(X)\\leqslant y\\} \\)，再求导</td></tr>' +
            '</tbody></table></div>'
          },

          { t: 'h3', idx: '①', text: '离散型：逐点映射，合并同值' },
          { t: 'card', kind: 'thm', tag: '方法', title: '离散型随机变量函数的分布', html:
            '<p class="tight">设 \\( X \\) 的分布律为 \\( P\\{X=x_k\\}=p_k \\)，\\( Y=g(X) \\)，则 \\( Y \\) 的分布律为</p>' +
            '<div class="fml">\\( P\\{Y=y_j\\}=\\sum_{\\{k:\\,g(x_k)=y_j\\}}p_k \\)</div>' +
            '<p class="tight"><b>步骤：</b>① 计算 \\( y_j=g(x_j) \\)；② 把相同 \\( y_j \\) 对应的概率相加；③ 整理成分布律并检验归一性。</p>'
          },
          { t: 'viz', build: 'transformDiscrete', title: '离散型函数分布：合并同值', sub: '选择 g(x)，观察概率如何重新分配' },

          { t: 'h3', idx: '②', text: '连续型：分布函数法（万能法）' },
          { t: 'card', kind: 'thm', tag: '方法', title: '分布函数法', html:
            '<p class="tight">求 \\( Y=g(X) \\) 的分布，通用步骤为：</p>' +
            '<ol class="clean">' +
            '<li>求 \\( Y \\) 的取值范围（值域）；</li>' +
            '<li>对每个 \\( y \\)，写出分布函数 \\( F_Y(y)=P\\{Y\\leqslant y\\}=P\\{g(X)\\leqslant y\\} \\)，并把它<b>转化为关于 \\( X \\) 的事件</b>；</li>' +
            '<li>用 \\( X \\) 的分布计算该概率；</li>' +
            '<li>对 \\( y \\) 求导得 \\( f_Y(y)=F_Y\'(y) \\)。</li>' +
            '</ol>' +
            '<p class="tight"><b>关键技巧：</b>把不等式 \\( g(X)\\leqslant y \\) <b>解出 \\( X \\) 的范围</b>，这一步是全部难点所在。</p>'
          },
          { t: 'card', kind: 'thm', tag: '公式', title: '公式法（单调可导情形）', html:
            '<p class="tight">设 \\( y=g(x) \\) 严格单调、可导且 \\( g\'(x)\\neq0 \\)，其反函数为 \\( x=h(y) \\)，则</p>' +
            '<div class="fml">\\( f_Y(y)=\\begin{cases}f_X\\big(h(y)\\big)\\cdot\\big|h\'(y)\\big|, & y\\in g(\\text{值域})\\\\[4pt] 0, & \\text{其他}\\end{cases} \\)</div>' +
            '<p class="tight">若 \\( g \\) 分段单调（如 \\( Y=X^2 \\)），则把各单调段的结果<b>相加</b>：</p>' +
            '<div class="fml">\\( f_Y(y)=\\sum_{i}f_X\\big(h_i(y)\\big)\\cdot\\big|h_i\'(y)\\big| \\)</div>'
          },

          { t: 'h3', idx: '③', text: '四类必会情形' },
          { t: 'card', kind: 'key', tag: '必会', title: '常见函数 \\( Y=g(X) \\) 的分布', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>函数</th><th>条件</th><th>结论</th></tr></thead><tbody>' +
            '<tr><td><b>线性变换</b> \\( Y=aX+b \\)</td><td>\\( a\\neq0 \\)</td><td>若 \\( X\\sim N(\\mu,\\sigma^2) \\)，则 \\( Y\\sim N(a\\mu+b,\\ a^2\\sigma^2) \\)</td></tr>' +
            '<tr><td><b>标准正态的线性组合</b></td><td>\\( X\\sim N(0,1) \\)</td><td>\\( aX+b\\sim N(b,a^2) \\)</td></tr>' +
            '<tr><td><b>平方</b> \\( Y=X^2 \\)</td><td>\\( X\\sim N(0,1) \\)</td><td>\\( f_Y(y)=\\dfrac{1}{\\sqrt{2\\pi y}}e^{-y/2},\\ y>0 \\)（\\( \\chi^2(1) \\) 分布）</td></tr>' +
            '<tr><td><b>绝对值</b> \\( Y=|X| \\)</td><td>\\( X\\sim N(0,1) \\)</td><td>\\( f_Y(y)=\\sqrt{\\dfrac{2}{\\pi}}e^{-y^2/2},\\ y>0 \\)</td></tr>' +
            '<tr><td><b>max / min</b></td><td>\\( X_1,\\cdots,X_n \\) 独立</td><td>\\( F_{\\max}(y)=\\prod F_{X_i}(y),\\quad F_{\\min}(y)=1-\\prod\\left[1-F_{X_i}(y)\\right] \\)</td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'viz', build: 'transformContinuous', title: '连续型函数分布：Y=X² 的密度推导', sub: '观察 X 的密度如何映射为 Y 的密度' },
          { t: 'viz', build: 'transformMethod', title: '分布函数法 vs 公式法', sub: '切换 Y=g(X)，对照 F_Y(y₀) 的两条计算路线' },
          { t: 'card', kind: 'tip', tag: '技巧', title: 'max / min 的分布（重要）', html:
            '<p class="tight">设 \\( X_1,\\cdots,X_n \\) 相互独立，分布函数分别为 \\( F_i(x) \\)，则</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>最大值：</b>\\( F_{\\max}(y)=P\\{X_1\\leqslant y,\\cdots,X_n\\leqslant y\\}=\\prod_{i=1}^{n}F_i(y) \\)</div>' +
            '<div class="fml-row"><b>最小值：</b>\\( F_{\\min}(y)=1-P\\{X_1>y,\\cdots,X_n>y\\}=1-\\prod_{i=1}^{n}\\left[1-F_i(y)\\right] \\)</div>' +
            '</div>' +
            '<p class="tight">若 \\( X_i \\) 独立同分布且分布函数为 \\( F \\)，则 \\( F_{\\max}(y)=[F(y)]^n \\)，\\( F_{\\min}(y)=1-[1-F(y)]^n \\)。</p>' +
            '<p class="tight"><b>应用：</b>系统寿命（串联取 min、并联取 max）、n 个元件中最先/最后失效的时间。</p>'
          }
        ],
        examples: [
          {
            no: '例 2.15', meta: '基础 · 离散型函数分布',
            q: '设 \\( X \\) 的分布律为 \\( P\\{X=-1\\}=0.2,\\ P\\{X=0\\}=0.3,\\ P\\{X=1\\}=0.5 \\)。求 \\( Y=X^2 \\) 的分布律。',
            sol:
              '<p>逐点映射：\\( X=-1\\to Y=1 \\)；\\( X=0\\to Y=0 \\)；\\( X=1\\to Y=1 \\)。</p>' +
              '<p>合并同值：</p>' +
              '<div class="fml">\\( P\\{Y=0\\}=P\\{X=0\\}=0.3 \\)</div>' +
              '<div class="fml">\\( P\\{Y=1\\}=P\\{X=-1\\}+P\\{X=1\\}=0.2+0.5=0.7 \\)</div>' +
              '<p>检验：\\( 0.3+0.7=1 \\) ✓</p>'
          },
          {
            no: '例 2.16', meta: '真题改编 · 分布函数法',
            q: '设 \\( X\\sim U(0,1) \\)，求 \\( Y=-2\\ln X \\) 的概率密度。',
            sol:
              '<p>\\( X\\in(0,1) \\)，故 \\( Y=-2\\ln X\\in(0,+\\infty) \\)。</p>' +
              '<p>当 \\( y>0 \\) 时：</p>' +
              '<div class="fml">\\( F_Y(y)=P\\{Y\\leqslant y\\}=P\\{-2\\ln X\\leqslant y\\}=P\\{\\ln X\\geqslant-\\dfrac{y}{2}\\}=P\\{X\\geqslant e^{-y/2}\\} \\)</div>' +
              '<p>因 \\( X\\sim U(0,1) \\)，\\( P\\{X\\geqslant t\\}=1-t \\)（\\( 0<t<1 \\)），故</p>' +
              '<div class="fml">\\( F_Y(y)=1-e^{-y/2},\\qquad y>0 \\)</div>' +
              '<p>求导：</p>' +
              '<div class="fml">\\( f_Y(y)=\\dfrac12 e^{-y/2},\\qquad y>0 \\)</div>' +
              '<p>即 \\( Y\\sim E\\left(\\dfrac12\\right) \\)。</p>' +
              '<p class="fml-note">这是抽样中生成指数分布随机数的经典方法（逆变换法）。</p>'
          },
          {
            no: '例 2.17', meta: '提高 · 平方变换',
            q: '设 \\( X\\sim N(0,1) \\)，求 \\( Y=X^2 \\) 的概率密度。',
            sol:
              '<p>当 \\( y\\leqslant 0 \\) 时 \\( F_Y(y)=0 \\)。</p>' +
              '<p>当 \\( y>0 \\) 时：</p>' +
              '<div class="fml">\\( F_Y(y)=P\\{X^2\\leqslant y\\}=P\\{-\\sqrt{y}\\leqslant X\\leqslant\\sqrt{y}\\}=\\Phi(\\sqrt{y})-\\Phi(-\\sqrt{y})=2\\Phi(\\sqrt{y})-1 \\)</div>' +
              '<p>求导（用复合函数求导）：</p>' +
              '<div class="fml">\\( f_Y(y)=2\\varphi(\\sqrt{y})\\cdot\\dfrac{1}{2\\sqrt{y}}=\\dfrac{1}{\\sqrt{y}}\\cdot\\dfrac{1}{\\sqrt{2\\pi}}e^{-y/2}=\\dfrac{1}{\\sqrt{2\\pi y}}e^{-y/2},\\qquad y>0 \\)</div>' +
              '<p>这正是自由度为 1 的 \\( \\chi^2 \\) 分布的密度。</p>'
          },
          {
            no: '例 2.18', meta: '提高 · 最值分布',
            q: '设 \\( X_1,X_2,X_3 \\) 相互独立且都服从 \\( E(\\lambda) \\)。令 \\( Y=\\min(X_1,X_2,X_3) \\)。求 \\( Y \\) 的分布。',
            sol:
              '<p>由 \\( F(x)=1-e^{-\\lambda x}\\)（\\( x>0 \\)），\\( 1-F(x)=e^{-\\lambda x} \\)。</p>' +
              '<p>对 \\( y>0 \\)：</p>' +
              '<div class="fml">\\( F_Y(y)=1-\\prod_{i=1}^{3}\\left[1-F(y)\\right]=1-\\left(e^{-\\lambda y}\\right)^3=1-e^{-3\\lambda y} \\)</div>' +
              '<p>故 \\( Y\\sim E(3\\lambda) \\)。</p>' +
              '<p class="fml-note">结论：\\( n \\) 个独立同分布的指数分布取最小值，仍是指数分布，参数乘以 \\( n \\)。这是串联系统寿命的典型结论。</p>'
          }
        ],
        pitfalls: [
          '分布函数法必须先<b>确定 \\( Y \\) 的值域</b>，在值域外密度为 0，漏写会丢分。',
          '公式法要求 \\( g \\) 单调且 \\( g\'\\neq0 \\)；非单调时必须分段求和或用分布函数法。',
          '解不等式 \\( g(X)\\leqslant y \\) 时注意 \\( y \\) 的范围讨论（如 \\( y\\leqslant0 \\) 与 \\( y>0 \\) 分开）。',
          '离散型函数分布必须<b>合并同值</b>，否则分布律不完整。',
          '\\( Y=X^2 \\) 时不要忘记两支 \\( \\pm\\sqrt{y} \\)。'
        ]
      }

    ]
  };

})(window);
