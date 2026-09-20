/* ============================================================
   ch3.js — 第三章 多维随机变量及其分布
   覆盖 2026 大纲「三、多维随机变量及其分布」全部考试内容与考试要求
   大纲原文（OCR 自大纲 p.21–22）：
     考试内容：多维随机变量及其分布 二维离散型随机变量的概率分布、边缘分布和
               条件分布 二维连续型随机变量的概率密度、边缘概率密度和条件密度
               随机变量的独立性和不相关性 常用二维随机变量的分布 两个及两个
               以上随机变量简单函数的分布
     考试要求：1. 理解多维随机变量的概念，理解多维随机变量的分布的概念和性质，
                 理解二维离散型随机变量的概率分布、边缘分布和条件分布，理解二维
                 连续型随机变量的概率密度、边缘密度和条件密度，会求与二维随机变量
                 相关事件的概率；2. 理解随机变量的独立性及不相关性的概念，掌握随机
                 变量相互独立的条件；3. 掌握二维均匀分布，了解二维正态分布
                 N(μ1,σ1²;μ2,σ2²;ρ) 的概率密度，理解其中参数的概率意义；
                 4. 会求两个随机变量简单函数的分布，会求多个相互独立随机变量简单
                 函数的分布。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH3 = {
    id: 'ch3',
    no: '三',
    title: '多维随机变量及其分布',
    subtitle: '把单个随机变量推广到二维与多维：联合分布 → 边缘分布 → 条件分布 → 独立性 → 函数分布',
    tags: ['二维随机变量', '联合分布函数', '联合分布律', '联合概率密度', '边缘分布', '条件分布', '独立性', '不相关性', '二维均匀分布', '二维正态分布', '卷积公式', 'max/min 分布'],
    sections: [

      /* ================================================================
         3.1 二维随机变量与联合分布函数
         ================================================================ */
      {
        id: 'ch3-s1',
        num: '3.1',
        title: '二维随机变量与联合分布函数',
        lead: '两个随机变量放在一起考察——它们的取值配对 (X,Y) 构成平面上的随机点，用联合分布函数统一描述。',
        blocks: [
          { t: 'h3', idx: '①', text: '二维随机变量' },
          { t: 'card', kind: 'def', tag: '定义', title: '二维随机变量', html:
            '<p class="tight">设 <code>E</code> 是随机试验，样本空间为 \\( \\Omega=\\{\\omega\\} \\)。若对每个样本点 \\( \\omega \\) 都有两个确定的实数 \\( X(\\omega),\\ Y(\\omega) \\) 与之对应，则称 \\( (X,Y) \\) 为<b>二维随机变量</b>（二维随机向量）。</p>' +
            '<p class="tight">它本质上是 \\( \\Omega\\to\\mathbb{R}^2 \\) 的映射，可视为平面上随机取的一个点。</p>'
          },
          { t: 'card', kind: 'tip', tag: '本质', title: '为什么要研究「联合」？', html:
            '<ul class="none">' +
            '<li>仅有 \\( X \\)、\\( Y \\) 各自的分布（边缘分布）<b>不足以</b>确定它们的共同规律；</li>' +
            '<li>「联合分布」刻画 \\( X \\) 与 \\( Y \\) 的<b>相互依赖关系</b>，这是二维相对一维的新增内容；</li>' +
            '<li>掌握了联合分布，边缘分布、条件分布、独立性、函数分布都可推出——它是本章的「总源头」。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '②', text: '联合分布函数' },
          { t: 'card', kind: 'def', tag: '定义', title: '联合分布函数', html:
            '<p class="tight">对任意实数 \\( x,y \\)，称二元函数</p>' +
            '<div class="fml">\\( F(x,y)=P\\{X\\leqslant x,\\ Y\\leqslant y\\} \\)</div>' +
            '<p class="tight">为二维随机变量 \\( (X,Y) \\) 的<b>分布函数</b>（联合分布函数）。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '联合分布函数的四条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 单调不减：</b>\\( F(x,y) \\) 关于 \\( x \\)、关于 \\( y \\) 分别单调不减</div>' +
            '<div class="fml-row"><b>2. 有界性：</b>\\( 0\\leqslant F(x,y)\\leqslant 1 \\)</div>' +
            '<div class="fml-row"><b>3. 右连续：</b>\\( F(x,y) \\) 关于 \\( x \\)、关于 \\( y \\) 分别右连续</div>' +
            '<div class="fml-row"><b>4. 极限性质：</b></div>' +
            '</div>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( F(-\\infty,y)=\\lim_{x\\to-\\infty}F(x,y)=0,\\qquad F(x,-\\infty)=\\lim_{y\\to-\\infty}F(x,y)=0 \\)</div>' +
            '<div class="fml-row">\\( F(+\\infty,+\\infty)=\\lim_{x\\to+\\infty,\\,y\\to+\\infty}F(x,y)=1 \\)</div>' +
            '<div class="fml-row">\\( F(x,+\\infty)=F_X(x) \\)（\\( X \\) 的边缘分布函数），\\( F(+\\infty,y)=F_Y(y) \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '用联合分布函数计算矩形区域的概率', html:
            '<p class="tight">对 \\( x_1<x_2,\\ y_1<y_2 \\)：</p>' +
            '<div class="fml">\\( P\\{x_1<X\\leqslant x_2,\\ y_1<Y\\leqslant y_2\\}=F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)+F(x_1,y_1) \\)</div>' +
            '<p class="tight"><b>记忆法：</b>左上＋右下 减去 右上＋左下（画一个矩形，四个顶点按「同号对角」配对）。</p>' +
            '<p class="tight"><b>另一常用形式：</b>\\( P\\{X\\leqslant x,Y\\leqslant y\\} \\) 直接就是 \\( F(x,y) \\)。</p>'
          },
          { t: 'viz', build: 'jointCdf', title: '联合分布函数与矩形概率', sub: '拖动 x₁,x₂,y₁,y₂，观察四个顶点如何组合出矩形概率' },
          { t: 'viz', build: 'jointRegion', title: '联合分布：区域 D 上的概率', sub: '切换联合密度并拖动矩形边界，观察热力图与区域高亮' },
          { t: 'card', kind: 'warn', tag: '易错', title: '三个高频陷阱', html:
            '<ul class="none">' +
            '<li>\\( F(x,y)=P\\{X\\leqslant x,\\ Y\\leqslant y\\} \\) 是<b>两个条件同时成立</b>的累积概率，不是 \\( P\\{X\\leqslant x\\}P\\{Y\\leqslant y\\} \\)（除非独立）。</li>' +
            '<li>由边缘分布 \\( F_X,F_Y \\) <b>不能</b>唯一确定联合分布 \\( F(x,y) \\)——这是本章最重要的观念之一。</li>' +
            '<li>求矩形概率时符号极易记错，务必画图确认「\\( +F(x_2,y_2)+F(x_1,y_1)-F(x_1,y_2)-F(x_2,y_1) \\)」。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 3.1', meta: '基础 · 由联合分布函数求概率',
            q: '设 \\( (X,Y) \\) 的联合分布函数为 \\( F(x,y)=\\begin{cases}(1-e^{-x})(1-e^{-y}), & x>0,\\,y>0\\\\ 0, & \\text{其他}\\end{cases} \\)<br>求 \\( P\\{1<X\\leqslant 2,\\ 1<Y\\leqslant 2\\} \\)。',
            sol:
              '<p>由矩形概率公式：</p>' +
              '<div class="fml">\\( P=F(2,2)-F(1,2)-F(2,1)+F(1,1) \\)</div>' +
              '<p>逐项代入 \\( F(x,y)=(1-e^{-x})(1-e^{-y}) \\)：</p>' +
              '<div class="fml">\\( F(2,2)=(1-e^{-2})^2,\\quad F(1,2)=F(2,1)=(1-e^{-1})(1-e^{-2}),\\quad F(1,1)=(1-e^{-1})^2 \\)</div>' +
              '<p>注意到 \\( F(x,y)=F_X(x)F_Y(y) \\)，其中 \\( F_X(x)=1-e^{-x} \\)（\\( x>0 \\)）。于是</p>' +
              '<div class="fml">\\( P=[F_X(2)-F_X(1)][F_Y(2)-F_Y(1)]=(e^{-1}-e^{-2})^2 \\)</div>' +
              '<p class="fml-note">这里 \\( F(x,y)=F_X(x)F_Y(y) \\) 说明 \\( X \\) 与 \\( Y \\) 独立——这是快速计算的关键。</p>'
          },
          {
            no: '例 3.2', meta: '提高 · 由联合分布函数定参数',
            q: '设 \\( F(x,y)=\\begin{cases}A\\,(1-e^{-x})(1-e^{-y}), & x>0,\\,y>0\\\\ 0, & \\text{其他}\\end{cases} \\) 是某二维随机变量的分布函数。求 \\( A \\)。',
            sol:
              '<p>由 \\( F(+\\infty,+\\infty)=1 \\)：</p>' +
              '<div class="fml">\\( \\lim_{x\\to+\\infty,\\,y\\to+\\infty}A(1-e^{-x})(1-e^{-y})=A\\cdot 1\\cdot 1=A=1 \\)</div>' +
              '<p>故 \\( A=1 \\)。</p>' +
              '<p class="fml-note">注意：二维分布函数求参数除用 \\( F(+\\infty,+\\infty)=1 \\) 外，有时还需用「\\( F \\) 关于 \\( x,y \\) 分别右连续」或「矩形概率非负」来定。</p>'
          }
        ],
        pitfalls: [
          '\\( F(x,y) \\) 关于 \\( x \\)、关于 \\( y \\) 分别单调不减，但「关于两者联合单调」不成立，不要误用。',
          '四个极限条件缺一不可，\\( F(-\\infty,y)=F(x,-\\infty)=0 \\) 常被漏写。',
          '边缘分布不能反推联合分布——除非已知 \\( X,Y \\) 独立。'
        ]
      },

      /* ================================================================
         3.2 二维离散型随机变量
         ================================================================ */
      {
        id: 'ch3-s2',
        num: '3.2',
        title: '二维离散型随机变量',
        lead: '取值可逐个列举——用「联合分布律」描述，边缘分布与条件分布都是它的「投影」与「切片」。',
        blocks: [
          { t: 'h3', idx: '①', text: '联合分布律' },
          { t: 'card', kind: 'def', tag: '定义', title: '二维离散型随机变量与联合分布律', html:
            '<p class="tight">若 \\( (X,Y) \\) 的全部可能取值为有限个或可列无穷个，则称其为<b>二维离散型随机变量</b>。</p>' +
            '<p class="tight">设取值 \\( (x_i,y_j)\\ (i,j=1,2,\\cdots) \\)，称</p>' +
            '<div class="fml">\\( P\\{X=x_i,\\ Y=y_j\\}=p_{ij},\\qquad i,j=1,2,\\cdots \\)</div>' +
            '<p class="tight">为 \\( (X,Y) \\) 的<b>联合分布律</b>（联合概率分布）。</p>'
          },
          { t: 'card', kind: 'key', tag: '性质', title: '联合分布律的两条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>非负性：</b>\\( p_{ij}\\geqslant 0 \\)</div>' +
            '<div class="fml-row"><b>归一性：</b>\\( \\displaystyle\\sum_{i}\\sum_{j}p_{ij}=1 \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'tip', tag: '表示', title: '二维分布律表', html:
            '<p class="tight">习惯上把 \\( X \\) 的取值排在行首、\\( Y \\) 的取值排在列首，形成一张表：</p>' +
            '<div class="tbl-wrap" style="margin:10px 0 0"><table class="tbl">' +
            '<thead><tr><th>\\( X\\backslash Y \\)</th><th>\\( y_1 \\)</th><th>\\( y_2 \\)</th><th>\\( \\cdots \\)</th><th class="center">\\( P\\{X=x_i\\} \\)</th></tr></thead><tbody>' +
            '<tr><td>\\( x_1 \\)</td><td>\\( p_{11} \\)</td><td>\\( p_{12} \\)</td><td>\\( \\cdots \\)</td><td class="center"><b>\\( p_{1\\cdot} \\)</b></td></tr>' +
            '<tr><td>\\( x_2 \\)</td><td>\\( p_{21} \\)</td><td>\\( p_{22} \\)</td><td>\\( \\cdots \\)</td><td class="center"><b>\\( p_{2\\cdot} \\)</b></td></tr>' +
            '<tr><td>\\( \\vdots \\)</td><td>\\( \\vdots \\)</td><td>\\( \\vdots \\)</td><td></td><td></td></tr>' +
            '<tr><td><b>\\( P\\{Y=y_j\\} \\)</b></td><td><b>\\( p_{\\cdot1} \\)</b></td><td><b>\\( p_{\\cdot2} \\)</b></td><td>\\( \\cdots \\)</td><td class="center"><b>1</b></td></tr>' +
            '</tbody></table></div>' +
            '<p class="tight" style="margin-top:10px">行和、列和（<b>边缘分布</b>）必须写在表格中——这是解题的标准动作。</p>'
          },
          { t: 'h3', idx: '②', text: '边缘分布律' },
          { t: 'card', kind: 'thm', tag: '定义', title: '边缘分布律', html:
            '<p class="tight">在联合分布律中，对另一变量<b>求和</b>（「边际化」）：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>X 的边缘分布律：</b>\\( p_{i\\cdot}=P\\{X=x_i\\}=\\displaystyle\\sum_{j=1}^{\\infty}p_{ij} \\)</div>' +
            '<div class="fml-row"><b>Y 的边缘分布律：</b>\\( p_{\\cdot j}=P\\{Y=y_j\\}=\\displaystyle\\sum_{i=1}^{\\infty}p_{ij} \\)</div>' +
            '</div>' +
            '<p class="tight">即：<b>边缘分布 = 联合分布对另一变量求和</b>，对应表格中的行和与列和。</p>'
          },
          { t: 'h3', idx: '③', text: '条件分布律' },
          { t: 'card', kind: 'thm', tag: '定义', title: '条件分布律', html:
            '<p class="tight">当 \\( P\\{Y=y_j\\}>0 \\) 时，在 \\( Y=y_j \\) 条件下 \\( X \\) 的<b>条件分布律</b>为</p>' +
            '<div class="fml">\\( P\\{X=x_i\\mid Y=y_j\\}=\\dfrac{p_{ij}}{p_{\\cdot j}},\\qquad i=1,2,\\cdots \\)</div>' +
            '<p class="tight">同理，当 \\( P\\{X=x_i\\}>0 \\) 时：</p>' +
            '<div class="fml">\\( P\\{Y=y_j\\mid X=x_i\\}=\\dfrac{p_{ij}}{p_{i\\cdot}} \\)</div>'
          },
          { t: 'viz', build: 'discrete2d', title: '二维离散型：联合分布与边缘分布', sub: '切换示例，观察联合分布表与热力图、边缘分布的对应' },
          { t: 'viz', build: 'marginalTable', title: '边缘分布与条件分布：逐行逐列求和', sub: '选中行与列，查看行和 / 列和与条件分布的对应关系' },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>给联合求边缘</b>：横竖求和，是必考的基本功。</li>' +
            '<li><b>给联合求条件</b>：用定义 \\( p_{ij}/p_{\\cdot j} \\) 或 \\( p_{ij}/p_{i\\cdot} \\)。</li>' +
            '<li><b>判断独立</b>：检验是否每格都有 \\( p_{ij}=p_{i\\cdot}p_{\\cdot j} \\)。</li>' +
            '<li><b>由题意求联合</b>：摸球、掷骰、射击等实际背景，用古典概型或乘法公式列表。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 3.3', meta: '基础 · 联合分布律与边缘分布',
            q: '袋中有 2 个白球、3 个黑球，不放回地连续取 2 个球，令 \\( X \\) 为第一次取到白球的个数（0 或 1），\\( Y \\) 为第二次取到白球的个数（0 或 1）。求 \\( (X,Y) \\) 的联合分布律与边缘分布律。',
            sol:
              '<p>样本点总数 \\( 5\\times4=20 \\)（有序）。逐个计算：</p>' +
              '<div class="fml">\\( P\\{X=0,Y=0\\}=\\dfrac{3\\times2}{20}=\\dfrac{6}{20},\\quad P\\{X=0,Y=1\\}=\\dfrac{3\\times2}{20}=\\dfrac{6}{20} \\)</div>' +
              '<div class="fml">\\( P\\{X=1,Y=0\\}=\\dfrac{2\\times3}{20}=\\dfrac{6}{20},\\quad P\\{X=1,Y=1\\}=\\dfrac{2\\times1}{20}=\\dfrac{2}{20} \\)</div>' +
              '<p>列成表并求边缘：</p>' +
              '<div class="tbl-wrap" style="margin:10px 0 0"><table class="tbl">' +
              '<thead><tr><th>\\( X\\backslash Y \\)</th><th>0</th><th>1</th><th class="center">\\( p_{i\\cdot} \\)</th></tr></thead><tbody>' +
              '<tr><td>0</td><td>6/20</td><td>6/20</td><td class="center"><b>12/20</b></td></tr>' +
              '<tr><td>1</td><td>6/20</td><td>2/20</td><td class="center"><b>8/20</b></td></tr>' +
              '<tr><td><b>\\( p_{\\cdot j} \\)</b></td><td><b>12/20</b></td><td><b>8/20</b></td><td class="center"><b>1</b></td></tr>' +
              '</tbody></table></div>' +
              '<p class="tight" style="margin-top:10px">注意 \\( X \\)、\\( Y \\) 的边缘分布相同（都是 12/20、8/20），但联合分布<b>不对称</b>，且显然 \\( X,Y \\) 不独立（如 \\( p_{11}=2/20 \\neq \\frac{8}{20}\\cdot\\frac{8}{20} \\)）。</p>'
          },
          {
            no: '例 3.4', meta: '真题改编 · 条件分布律',
            q: '接上题，求在 \\( X=0 \\) 的条件下 \\( Y \\) 的条件分布律，以及在 \\( Y=1 \\) 的条件下 \\( X \\) 的条件分布律。',
            sol:
              '<p><b>\\( X=0 \\) 时 \\( Y \\) 的条件分布：</b>\\( p_{1\\cdot}=12/20 \\)</p>' +
              '<div class="fml">\\( P\\{Y=0\\mid X=0\\}=\\dfrac{6/20}{12/20}=\\dfrac12,\\qquad P\\{Y=1\\mid X=0\\}=\\dfrac{6/20}{12/20}=\\dfrac12 \\)</div>' +
              '<p><b>\\( Y=1 \\) 时 \\( X \\) 的条件分布：</b>\\( p_{\\cdot2}=8/20 \\)</p>' +
              '<div class="fml">\\( P\\{X=0\\mid Y=1\\}=\\dfrac{6/20}{8/20}=\\dfrac34,\\qquad P\\{X=1\\mid Y=1\\}=\\dfrac{2/20}{8/20}=\\dfrac14 \\)</div>' +
              '<p class="fml-note">条件的分布律各自求和为 1，可用于自检。</p>'
          }
        ],
        pitfalls: [
          '边缘分布律必须<b>同时对另一个变量的所有取值求和</b>，漏项是常见错误。',
          '条件分布律的分母是<b>条件事件</b>的边缘概率，不要写反。',
          '验证独立性要逐格检验 \\( p_{ij}=p_{i\\cdot}p_{\\cdot j} \\)，只查一格不足以判定，但<b>找到一格不成立即可否定</b>。',
          '有放回与无放回会影响联合分布律，进而影响独立性判断。'
        ]
      },

      /* ================================================================
         3.3 二维连续型随机变量
         ================================================================ */
      {
        id: 'ch3-s3',
        num: '3.3',
        title: '二维连续型随机变量',
        lead: '取值充满平面区域——用联合概率密度描述，「体积」即概率；边缘与条件密度由积分与作商得到。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '二维连续型随机变量与联合概率密度', html:
            '<p class="tight">若存在非负可积函数 \\( f(x,y) \\)，使 \\( (X,Y) \\) 的分布函数可表示为</p>' +
            '<div class="fml">\\( F(x,y)=\\int_{-\\infty}^{x}\\int_{-\\infty}^{y}f(u,v)\\,\\mathrm{d}u\\,\\mathrm{d}v \\)</div>' +
            '<p class="tight">则称 \\( (X,Y) \\) 为<b>二维连续型随机变量</b>，\\( f(x,y) \\) 为<b>联合概率密度</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '性质', title: '联合概率密度的性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>非负性：</b>\\( f(x,y)\\geqslant 0 \\)</div>' +
            '<div class="fml-row"><b>归一性：</b>\\( \\displaystyle\\int_{-\\infty}^{+\\infty}\\int_{-\\infty}^{+\\infty}f(x,y)\\,\\mathrm{d}x\\,\\mathrm{d}y=1 \\)</div>' +
            '<div class="fml-row"><b>区域概率：</b>\\( P\\{(X,Y)\\in D\\}=\\displaystyle\\iint_{D}f(x,y)\\,\\mathrm{d}x\\,\\mathrm{d}y \\)</div>' +
            '<div class="fml-row"><b>由 \\( F \\) 求 \\( f \\)：</b>在可导点处 \\( f(x,y)=\\dfrac{\\partial^2 F(x,y)}{\\partial x\\,\\partial y} \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '①', text: '边缘概率密度' },
          { t: 'card', kind: 'thm', tag: '定义', title: '边缘概率密度', html:
            '<p class="tight">把另一变量「积掉」：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>X 的边缘密度：</b>\\( f_X(x)=\\displaystyle\\int_{-\\infty}^{+\\infty}f(x,y)\\,\\mathrm{d}y \\)</div>' +
            '<div class="fml-row"><b>Y 的边缘密度：</b>\\( f_Y(y)=\\displaystyle\\int_{-\\infty}^{+\\infty}f(x,y)\\,\\mathrm{d}x \\)</div>' +
            '</div>' +
            '<p class="tight"><b>几何意义：</b>把联合密度沿一个方向「压扁」——对应积分区域要用<b>支撑集（非零区域）</b>截取，并注意积分上下限随另一变量变化。</p>'
          },
          { t: 'h3', idx: '②', text: '条件概率密度' },
          { t: 'card', kind: 'thm', tag: '定义', title: '条件概率密度', html:
            '<p class="tight">当 \\( f_Y(y)>0 \\) 时，在 \\( Y=y \\) 条件下 \\( X \\) 的<b>条件概率密度</b>为</p>' +
            '<div class="fml">\\( f_{X\\mid Y}(x\\mid y)=\\dfrac{f(x,y)}{f_Y(y)} \\)</div>' +
            '<p class="tight">同理当 \\( f_X(x)>0 \\) 时：\\( f_{Y\\mid X}(y\\mid x)=\\dfrac{f(x,y)}{f_X(x)} \\)。</p>' +
            '<p class="tight">由此得到<b>乘法公式</b>：\\( f(x,y)=f_X(x)\\,f_{Y\\mid X}(y\\mid x)=f_Y(y)\\,f_{X\\mid Y}(x\\mid y) \\)。</p>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '边缘密度的积分限', html:
            '<p class="tight">这是本章最容易失分的地方：联合密度 \\( f(x,y) \\) 只在某个区域 <b>非零</b>（如三角形、矩形）。求 \\( f_X(x) \\) 时，\\( y \\) 的积分限<b>由该区域的边界决定，并随 \\( x \\) 变化</b>。</p>' +
            '<p class="tight"><b>正确做法：</b>先画出支撑集 \\( D=\\{(x,y):f(x,y)>0\\} \\)，再对固定的 \\( x \\) 作竖直切片，读出 \\( y \\) 的上下界。</p>'
          },
          { t: 'viz', build: 'continuous2d', title: '二维连续型：联合密度与边缘密度', sub: '观察二维密度曲面如何「压扁」成边缘密度' },
          { t: 'viz', build: 'jointIntegral', title: '联合密度在区域上的二重积分', sub: '切换密度与区域形状，比较数值积分与解析结果' },
          { t: 'card', kind: 'tip', tag: '结论', title: '两个重要提醒', html:
            '<ul class="none">' +
            '<li>连续型时 \\( P\\{(X,Y)=(a,b)\\}=0 \\)，线条与单点的概率都为零，故边界是否计入不影响结果。</li>' +
            '<li>\\( f_X(x)f_Y(y)=f(x,y) \\) 是 \\( X,Y \\) 独立的<b>充要条件</b>（连续型），但要注意定义域是否可分。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 3.5', meta: '基础 · 定常数与边缘密度',
            q: '设 \\( (X,Y) \\) 的联合密度为 \\( f(x,y)=\\begin{cases}k\\,xy, & 0\\leqslant x\\leqslant 1,\\ 0\\leqslant y\\leqslant 1\\\\ 0, & \\text{其他}\\end{cases} \\)。求 \\( k \\)、\\( f_X(x) \\)、\\( f_Y(y) \\)，并判断独立性。',
            sol:
              '<p><b>定 \\( k \\)：</b>由归一性</p>' +
              '<div class="fml">\\( \\int_0^1\\!\\!\\int_0^1 kxy\\,\\mathrm{d}x\\,\\mathrm{d}y=k\\left(\\int_0^1x\\,\\mathrm{d}x\\right)\\left(\\int_0^1y\\,\\mathrm{d}y\\right)=k\\cdot\\frac12\\cdot\\frac12=\\frac{k}{4}=1 \\\)</div>' +
              '<p>故 \\( k=4 \\)。</p>' +
              '<p><b>边缘密度：</b></p>' +
              '<div class="fml">\\( f_X(x)=\\int_0^1 4xy\\,\\mathrm{d}y=4x\\cdot\\frac12=2x,\\qquad 0\\leqslant x\\leqslant 1 \\)</div>' +
              '<div class="fml">\\( f_Y(y)=\\int_0^1 4xy\\,\\mathrm{d}x=2y,\\qquad 0\\leqslant y\\leqslant 1 \\)</div>' +
              '<p><b>独立性：</b>因对 \\( 0\\leqslant x,y\\leqslant 1 \\) 有 \\( f(x,y)=4xy=2x\\cdot 2y=f_X(x)f_Y(y) \\)，故 \\( X \\) 与 \\( Y \\) 相互独立。</p>'
          },
          {
            no: '例 3.6', meta: '真题改编 · 三角形支撑集',
            q: '设 \\( (X,Y) \\) 的联合密度为 \\( f(x,y)=\\begin{cases}8xy, & 0\\leqslant x\\leqslant 1,\\ 0\\leqslant y\\leqslant x\\\\ 0, & \\text{其他}\\end{cases} \\)。求 \\( f_X(x) \\)、\\( f_Y(y) \\) 与 \\( P\\{X+Y\\leqslant 1\\} \\)。',
            sol:
              '<p><b>先验证归一化：</b>\\( \\displaystyle\\int_0^1\\!\\!\\int_0^{x}8xy\\,\\mathrm{d}y\\,\\mathrm{d}x=\\int_0^1 4x^3\\mathrm{d}x=1 \\) ✓</p>' +
              '<p>支撑集是以 \\( (0,0),(1,0),(1,1) \\) 为顶点的三角形（\\( 0\\leqslant y\\leqslant x\\leqslant 1 \\)）。</p>' +
              '<p><b>\\( f_X(x) \\)：</b>固定 \\( x\\in[0,1] \\)，\\( y \\) 从 0 到 \\( x \\)：</p>' +
              '<div class="fml">\\( f_X(x)=\\int_0^{x}8xy\\,\\mathrm{d}y=8x\\cdot\\frac{x^2}{2}=4x^3,\\qquad 0\\leqslant x\\leqslant 1 \\)</div>' +
              '<p><b>\\( f_Y(y) \\)：</b>固定 \\( y\\in[0,1] \\)，\\( x \\) 从 \\( y \\) 到 1：</p>' +
              '<div class="fml">\\( f_Y(y)=\\int_y^{1}8xy\\,\\mathrm{d}x=8y\\cdot\\frac{1-y^2}{2}=4y(1-y^2),\\qquad 0\\leqslant y\\leqslant 1 \\)</div>' +
              '<p><b>\\( P\\{X+Y\\leqslant 1\\} \\)：</b>在三角形支撑集内再截 \\( x+y\\leqslant 1 \\)，即 \\( 0\\leqslant y\\leqslant\\min(x,1-x) \\)。当 \\( x\\in[0,\\tfrac12] \\) 时 \\( y\\in[0,x] \\)；当 \\( x\\in[\\tfrac12,1] \\) 时 \\( y\\in[0,1-x] \\)：</p>' +
              '<div class="fml">\\( P=\\int_0^{1/2}\\!\\!\\int_0^{x}8xy\\,\\mathrm{d}y\\,\\mathrm{d}x+\\int_{1/2}^{1}\\!\\!\\int_0^{1-x}8xy\\,\\mathrm{d}y\\,\\mathrm{d}x \\)</div>' +
              '<div class="fml">\\( =\\int_0^{1/2}4x^3\\mathrm{d}x+\\int_{1/2}^{1}4x(1-x)^2\\mathrm{d}x=\\frac{1}{16}+\\frac{5}{48}=\\mathbf{\\dfrac16} \\)</div>' +
              '<p class="fml-note">注意本例 \\( f(x,y)=8xy \\) 可以「分离」为 \\( (8x)\\cdot y \\)，但支撑集是三角形，所以 \\( X \\) 与 \\( Y \\) <b>仍不独立</b>——判别独立性必须同时看密度形式和支撑集形状。</p>'
          },
          {
            no: '例 3.7', meta: '提高 · 条件密度',
            q: '设 \\( f(x,y)=\\begin{cases}8xy, & 0\\leqslant x\\leqslant 1,\\ 0\\leqslant y\\leqslant x\\\\ 0, & \\text{其他}\\end{cases} \\)（同例 3.6）。求 \\( f_{Y\\mid X}(y\\mid x) \\) 与 \\( P\\{Y\\leqslant \\tfrac{x}{2}\\mid X=x\\} \\)。',
            sol:
              '<p>由例 3.6，\\( f_X(x)=4x^3\\ (0\\leqslant x\\leqslant 1) \\)。故</p>' +
              '<div class="fml">\\( f_{Y\\mid X}(y\\mid x)=\\dfrac{f(x,y)}{f_X(x)}=\\dfrac{8xy}{4x^3}=\\dfrac{2y}{x^2},\\qquad 0\\leqslant y\\leqslant x \\)</div>' +
              '<p><b>自检：</b>\\( \\displaystyle\\int_0^{x}\\dfrac{2y}{x^2}\\,\\mathrm{d}y=\\dfrac{x^2}{x^2}=1 \\) ✓</p>' +
              '<p>于是</p>' +
              '<div class="fml">\\( P\\!\\left\\{Y\\leqslant\\frac{x}{2}\\,\\Big|\\,X=x\\right\\}=\\int_0^{x/2}\\dfrac{2y}{x^2}\\,\\mathrm{d}y=\\dfrac{x^2/4}{x^2}=\\mathbf{\\dfrac14} \\)</div>' +
              '<p class="fml-note">该条件概率与 \\( x \\) 无关，恒为 \\( 1/4 \\)；这与「条件密度是 \\( y \\) 的正比函数」的形态一致。</p>'
          }
        ],
        pitfalls: [
          '求边缘密度时，<b>必须先画支撑集</b>，否则积分限容易写错（尤其三角形区域）。',
          '条件密度 \\( f_{X\\mid Y}(x\\mid y) \\) 作为 \\( x \\) 的函数，其积分应为 1，可用于检验。',
          '\\( f(x,y) \\) 只在支撑集内非零，集外积分限必须体现这一点。',
          '\\( f_X(x)·f_Y(y)=f(x,y) \\) 成立才独立；需在<b>整个平面</b>上验证，不能只看局部。'
        ]
      },

      /* ================================================================
         3.4 随机变量的独立性
         ================================================================ */
      {
        id: 'ch3-s4',
        num: '3.4',
        title: '随机变量的独立性与不相关性',
        lead: '独立性让联合分布「拆成两份」，是二维问题降维的关键；不相关性则只反映「无线性关系」。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '随机变量相互独立', html:
            '<p class="tight">设 \\( F(x,y) \\)、\\( F_X(x) \\)、\\( F_Y(y) \\) 分别为 \\( (X,Y) \\) 的联合分布函数与边缘分布函数。若对一切 \\( x,y \\) 有</p>' +
            '<div class="fml">\\( F(x,y)=F_X(x)\\,F_Y(y) \\)</div>' +
            '<p class="tight">则称 \\( X \\) 与 \\( Y \\) <b>相互独立</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '判定', title: '不同情形下的等价判定条件', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>类型</th><th>独立 ⟺</th></tr></thead><tbody>' +
            '<tr><td><b>一般（分布函数）</b></td><td>\\( F(x,y)=F_X(x)F_Y(y) \\) 对一切 \\( x,y \\) 成立</td></tr>' +
            '<tr><td><b>离散型</b></td><td>\\( p_{ij}=p_{i\\cdot}\\,p_{\\cdot j} \\) 对所有 \\( i,j \\) 成立</td></tr>' +
            '<tr><td><b>连续型</b></td><td>\\( f(x,y)=f_X(x)f_Y(y) \\) 对几乎所有 \\( (x,y) \\) 成立</td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'card', kind: 'thm', tag: '判别法', title: '快速判别独立的实用方法', html:
            '<ul class="none">' +
            '<li><b>分离变量法（连续型）：</b>若 \\( f(x,y) \\) 在支撑集上可写成 \\( g(x)h(y) \\) 的形式，且非零区域是矩形（\\( a\\leqslant x\\leqslant b,\\ c\\leqslant y\\leqslant d \\)），则独立。</li>' +
            '<li><b>反例否定法：</b>只要找到一点 \\( (x_0,y_0) \\) 使 \\( f(x_0,y_0)\\neq f_X(x_0)f_Y(y_0) \\)，即可判定不独立。</li>' +
            '<li><b>支撑集判别：</b>若非零区域<b>不是矩形</b>（如三角形 \\( 0\\leqslant y\\leqslant x \\)），则一定不独立——因为 \\( y \\) 的取值范围依赖于 \\( x \\)。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'independence2d', title: '独立性：支撑集形状决定成败', sub: '对比矩形支撑集与三角形支撑集' },
          { t: 'viz', build: 'uncorrelatedNotIndep', title: '不相关 ≠ 独立：Y = X² 反例', sub: '观察 Cov = 0 而条件概率随 Y 改变的反例' },
          { t: 'card', kind: 'key', tag: '重要', title: '独立性与不相关性', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>独立 \\( \\Longrightarrow \\) 不相关</b>（前提：方差存在）</div>' +
            '<div class="fml-row"><b>不相关 \\( \\nRightarrow \\) 独立</b>（一般情形）</div>' +
            '<div class="fml-row"><b>特例：二维正态</b> \\( X,Y \\) 独立 \\( \\Longleftrightarrow \\) 不相关 \\( \\Longleftrightarrow \\rho=0 \\)</div>' +
            '</div>' +
            '<p class="tight"><b>「不相关」的定义</b>：\\( \\mathrm{Cov}(X,Y)=0 \\)，即相关系数 \\( \\rho_{XY}=0 \\)（详见第四章）。它只排除<b>线性</b>关系。</p>'
          },
          { t: 'card', kind: 'tip', tag: '性质', title: '独立性的常用结论', html:
            '<ul class="none">' +
            '<li>若 \\( X \\) 与 \\( Y \\) 独立，则 \\( g(X) \\) 与 \\( h(Y) \\) 也独立（\\( g,h \\) 为任意函数）。</li>' +
            '<li>独立时：\\( E(XY)=E(X)E(Y) \\)，\\( D(X\\pm Y)=D(X)+D(Y) \\)。</li>' +
            '<li>n 维情形：\\( X_1,\\cdots,X_n \\) 相互独立 \\( \\Longleftrightarrow \\) 联合分布 = 各边缘分布之积。</li>' +
            '<li>独立同分布（i.i.d.）是后续大数定律与数理统计的核心前提。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'warn', tag: '经典反例', title: '不相关但不独立', html:
            '<p class="tight">设 \\( X\\sim N(0,1) \\)，\\( Y=X^2 \\)。则 \\( \\mathrm{Cov}(X,Y)=E(X^3)-E(X)E(X^2)=0 \\)（因 \\( E(X^3)=0 \\)），故 \\( X,Y \\) <b>不相关</b>；但 \\( Y \\) 完全由 \\( X \\) 决定，显然<b>不独立</b>。</p>' +
            '<p class="tight">这说明「不相关」远比「独立」弱——它只说明没有线性关系，可能存在非线性关系。</p>'
          }
        ],
        examples: [
          {
            no: '例 3.8', meta: '基础 · 判断独立性',
            q: '设 \\( (X,Y) \\) 在三角形区域 \\( D=\\{(x,y):0\\leqslant y\\leqslant x\\leqslant 1\\} \\) 上服从均匀分布。判断 \\( X \\) 与 \\( Y \\) 是否独立。',
            sol:
              '<p>均匀分布意味着密度为常数。三角形面积为 \\( \\tfrac12 \\)，故密度</p>' +
              '<div class="fml">\\( f(x,y)=2,\\qquad (x,y)\\in D \\)</div>' +
              '<p>其支撑集是<b>三角形</b>，非零区域中 \\( y \\) 的范围（\\( 0\\leqslant y\\leqslant x \\)）依赖于 \\( x \\)，<b>不是矩形</b>。</p>' +
              '<p>严格验证：\\( f_X(x)=2x\\ (0\\leqslant x\\leqslant1) \\)，\\( f_Y(y)=2(1-y)\\ (0\\leqslant y\\leqslant1) \\)。取 \\( x=0.2,y=0.5 \\)：\\( f=0 \\)（不在 \\( D \\) 内），但 \\( f_X(0.2)f_Y(0.5)=0.4\\times1=0.4\\neq 0 \\)。</p>' +
              '<p>故 <b>\\( X \\) 与 \\( Y \\) 不独立</b>。</p>' +
              '<p class="fml-note">结论：均匀分布的支撑集不是矩形 ⟹ 一定不独立。</p>'
          },
          {
            no: '例 3.9', meta: '提高 · 分离变量法',
            q: '设 \\( f(x,y)=\\begin{cases}e^{-(x+y)}, & x>0,\\ y>0\\\\ 0, & \\text{其他}\\end{cases} \\)。判断独立性并求边缘密度。',
            sol:
              '<p><b>分离变量：</b>在支撑集 \\( \\{x>0,y>0\\} \\)（矩形）上，</p>' +
              '<div class="fml">\\( f(x,y)=e^{-x}\\cdot e^{-y} \\)</div>' +
              '<p>是 \\( x \\) 的函数与 \\( y \\) 的函数的乘积，且支撑集为矩形，故<b>独立</b>。</p>' +
              '<p><b>边缘密度（验证）：</b></p>' +
              '<div class="fml">\\( f_X(x)=\\int_0^{+\\infty}e^{-(x+y)}\\mathrm{d}y=e^{-x},\\quad x>0;\\qquad f_Y(y)=e^{-y},\\quad y>0 \\)</div>' +
              '<p>即 \\( X,Y\\sim E(1) \\) 且独立，\\( f_Xf_Y=e^{-(x+y)}=f(x,y) \\) ✓</p>'
          },
          {
            no: '例 3.10', meta: '提高 · 独立性应用',
            q: '设 \\( X,Y \\) 独立同分布，概率密度均为 \\( f(t)=2t\\ (0<t<1) \\)，其他为 0。求 \\( P\\{X+Y\\leqslant 1\\} \\)。',
            sol:
              '<p>由独立性，联合密度 \\( f(x,y)=f(x)f(y)=4xy \\)，支撑集为<b>正方形</b> \\( 0<x<1,0<y<1 \\)。</p>' +
              '<p>所求区域为正方形内 \\( x+y\\leqslant 1 \\) 的部分（以 \\( (0,0),(1,0),(0,1) \\) 为顶点的三角形）：</p>' +
              '<div class="fml">\\( P\\{X+Y\\leqslant 1\\}=\\int_0^1\\!\\!\\int_0^{1-x}4xy\\,\\mathrm{d}y\\,\\mathrm{d}x=2\\int_0^1 x(1-x)^2\\mathrm{d}x \\)</div>' +
              '<p>计算：\\( \\int_0^1(x-2x^2+x^3)\\mathrm{d}x=\\frac12-\\frac23+\\frac14=\\frac{1}{12} \\)，故</p>' +
              '<div class="fml">\\( P=2\\times\\frac{1}{12}=\\mathbf{\\dfrac16} \\)</div>'
          }
        ],
        pitfalls: [
          '<b>不相关 ≠ 独立</b>（除非联合正态）。这是最高频的判断题陷阱。',
          '判断连续型独立性要看<b>支撑集是否矩形</b>——非矩形支撑集一定不独立。',
          '拆成 \\( g(x)h(y) \\) 时，必须保证非零区域的边界是常数（不依赖于另一变量）。',
          '\\( f(x,y)=g(x)h(y) \\) 若 \\( g,h \\) 未归一化，需要先求边缘密度再比较。'
        ]
      },

      /* ================================================================
         3.5 常用二维随机变量的分布
         ================================================================ */
      {
        id: 'ch3-s5',
        num: '3.5',
        title: '常用二维随机变量分布',
        lead: '大纲要求「掌握二维均匀分布」「了解二维正态分布的概率密度，理解其中参数的概率意义」。',
        blocks: [
          { t: 'h3', idx: '①', text: '二维均匀分布（掌握）' },
          { t: 'card', kind: 'def', tag: '定义', title: '二维均匀分布', html:
            '<p class="tight">设 \\( D \\) 是平面上的有界区域，面积为 \\( S_D \\)。若 \\( (X,Y) \\) 的联合密度为</p>' +
            '<div class="fml">\\( f(x,y)=\\begin{cases}\\dfrac{1}{S_D}, & (x,y)\\in D\\\\[6pt] 0, & \\text{其他}\\end{cases} \\)</div>' +
            '<p class="tight">则称 \\( (X,Y) \\) 在 \\( D \\) 上服从<b>二维均匀分布</b>，记作 \\( (X,Y)\\sim U(D) \\)。</p>'
          },
          { t: 'card', kind: 'key', tag: '结论', title: '二维均匀分布的核心性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>区域概率 = 面积比：</b>\\( P\\{(X,Y)\\in G\\}=\\dfrac{S_G}{S_D},\\qquad G\\subseteq D \\)</div>' +
            '</div>' +
            '<p class="tight">即几何概型在分布论中的对应物——概率只取决于区域面积。</p>' +
            '<p class="tight"><b>重要提醒：</b>二维均匀分布的两个边缘分布<b>未必是</b>一维均匀分布（只在 \\( D \\) 为矩形时才成立）。</p>'
          },
          { t: 'viz', build: 'uniform2d', title: '二维均匀分布：面积比即概率', sub: '切换矩形/三角形/圆形区域，拖动子区域' },

          { t: 'h3', idx: '②', text: '二维正态分布（了解）' },
          { t: 'card', kind: 'def', tag: '定义', title: '二维正态分布', html:
            '<p class="tight">若 \\( (X,Y) \\) 的联合密度为</p>' +
            '<div class="fml">\\( f(x,y)=\\dfrac{1}{2\\pi\\sigma_1\\sigma_2\\sqrt{1-\\rho^2}}\\exp\\left\\{-\\dfrac{1}{2(1-\\rho^2)}\\left[\\dfrac{(x-\\mu_1)^2}{\\sigma_1^2}-2\\rho\\dfrac{(x-\\mu_1)(y-\\mu_2)}{\\sigma_1\\sigma_2}+\\dfrac{(y-\\mu_2)^2}{\\sigma_2^2}\\right]\\right\\} \\)</div>' +
            '<p class="tight">其中 \\( \\mu_1,\\mu_2\\in\\mathbb{R},\\ \\sigma_1,\\sigma_2>0,\\ |\\rho|<1 \\)，则称 \\( (X,Y) \\) 服从<b>二维正态分布</b>，记作</p>' +
            '<div class="fml">\\( (X,Y)\\sim N(\\mu_1,\\sigma_1^2;\\ \\mu_2,\\sigma_2^2;\\ \\rho) \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '参数意义', title: '五个参数的概率意义（大纲要求「理解」）', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>参数</th><th>含义</th></tr></thead><tbody>' +
            '<tr><td>\\( \\mu_1 \\)</td><td>\\( X \\) 的均值，\\( E(X)=\\mu_1 \\)，决定密度中心的位置</td></tr>' +
            '<tr><td>\\( \\mu_2 \\)</td><td>\\( Y \\) 的均值，\\( E(Y)=\\mu_2 \\)</td></tr>' +
            '<tr><td>\\( \\sigma_1^2 \\)</td><td>\\( X \\) 的方差，\\( D(X)=\\sigma_1^2 \\)，决定 \\( X \\) 方向的分散程度</td></tr>' +
            '<tr><td>\\( \\sigma_2^2 \\)</td><td>\\( Y \\) 的方差，\\( D(Y)=\\sigma_2^2 \\)</td></tr>' +
            '<tr><td>\\( \\rho \\)</td><td>\\( X,Y \\) 的相关系数，\\( \\rho=\\rho_{XY}\\in(-1,1) \\)，刻画二者的<b>线性相关程度</b></td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'card', kind: 'thm', tag: '四条重要结论', title: '二维正态分布的性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 边缘分布：</b>\\( X\\sim N(\\mu_1,\\sigma_1^2) \\)，\\( Y\\sim N(\\mu_2,\\sigma_2^2) \\)，<b>与 \\( \\rho \\) 无关</b></div>' +
            '<div class="fml-row"><b>2. 独立条件：</b>\\( X \\) 与 \\( Y \\) 独立 \\( \\Longleftrightarrow \\rho=0 \\)（这是正态独有的福利）</div>' +
            '<div class="fml-row"><b>3. 条件分布仍是正态：</b>\\( Y\\mid X=x\\sim N\\!\\left(\\mu_2+\\rho\\dfrac{\\sigma_2}{\\sigma_1}(x-\\mu_1),\\ \\sigma_2^2(1-\\rho^2)\\right) \\)</div>' +
            '<div class="fml-row"><b>4. 线性组合仍正态：</b>\\( aX+bY\\sim N\\!\\left(a\\mu_1+b\\mu_2,\\ a^2\\sigma_1^2+2ab\\rho\\sigma_1\\sigma_2+b^2\\sigma_2^2\\right) \\)</div>' +
            '</div>'
          },
          { t: 'viz', build: 'normal2d', title: '二维正态分布：ρ 决定椭圆的「扁平方向」', sub: '拖动 ρ、σ₁、σ₂，观察等高线与边缘分布' },
          { t: 'viz', build: 'normal2dParams', title: '二维正态：ρ 与 σ 对等高线椭圆的影响', sub: '观察椭圆半轴、倾角随参数的变化与 ρ=0 时的独立性' },
          { t: 'card', kind: 'warn', tag: '易错', title: '关于 \\( \\rho=0 \\) 的三点提醒', html:
            '<ul class="none">' +
            '<li>\\( \\rho=0 \\Leftrightarrow \\) 独立，<b>仅对二维正态成立</b>！一般随机变量不成立。</li>' +
            '<li>二维正态的边缘分布仍是正态，<b>反之不真</b>：边缘都正态不能保证联合正态。</li>' +
            '<li>\\( \\rho \\) 只刻画<b>线性</b>相关，\\( \\rho=0 \\) 不代表 \\( X,Y \\) 之间无任何关系。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 3.11', meta: '基础 · 二维均匀分布',
            q: '设 \\( (X,Y) \\) 在圆域 \\( D=\\{(x,y):x^2+y^2\\leqslant 4\\} \\) 上服从均匀分布。求 \\( P\\{X^2+Y^2\\leqslant 1\\} \\)。',
            sol:
              '<p>由面积比公式：</p>' +
              '<div class="fml">\\( P=\\dfrac{S_{G}}{S_D}=\\dfrac{\\pi\\cdot 1^2}{\\pi\\cdot 2^2}=\\mathbf{\\dfrac14} \\)</div>'
          },
          {
            no: '例 3.12', meta: '真题改编 · 二维正态的参数应用',
            q: '设 \\( (X,Y)\\sim N(1,4;\\ 2,9;\\ 0.5) \\)。求：(1) \\( X \\)、\\( Y \\) 的边缘分布；(2) 条件期望 \\( E(Y\\mid X=1) \\)；(3) \\( X+Y \\) 的分布。',
            sol:
              '<p>对照记号 \\( N(\\mu_1,\\sigma_1^2;\\mu_2,\\sigma_2^2;\\rho) \\)，知 \\( \\mu_1=1,\\ \\sigma_1^2=4,\\ \\mu_2=2,\\ \\sigma_2^2=9,\\ \\rho=0.5 \\)。</p>' +
              '<p><b>(1) 边缘分布（与 \\( \\rho \\) 无关）：</b></p>' +
              '<div class="fml">\\( X\\sim N(1,4),\\qquad Y\\sim N(2,9) \\)</div>' +
              '<p><b>(2) 条件分布公式：</b></p>' +
              '<div class="fml">\\( Y\\mid X=x\\sim N\\!\\left(\\mu_2+\\rho\\dfrac{\\sigma_2}{\\sigma_1}(x-\\mu_1),\\ \\sigma_2^2(1-\\rho^2)\\right) \\)</div>' +
              '<p>代入 \\( x=1 \\)（即 \\( X \\) 取均值处）：</p>' +
              '<div class="fml">\\( E(Y\\mid X=1)=2+0.5\\cdot\\dfrac{3}{2}\\cdot(1-1)=\\mathbf{2} \\)</div>' +
              '<p class="fml-note">此时条件均值等于 \\( \\mu_2 \\)，因为 \\( X \\) 正好取在中心。若取 \\( x=2 \\)：\\( E(Y\\mid X=2)=2+0.75\\times1=2.75 \\)。</p>' +
              '<p><b>(3) 线性组合仍正态：</b>对 \\( a=b=1 \\)，</p>' +
              '<div class="fml">\\( X+Y\\sim N\\!\\left(1+2,\\ 4+9+2\\cdot1\\cdot1\\cdot0.5\\cdot2\\cdot3\\right)=N\\!\\left(3,\\ 4+9+6\\right)=N(3,19) \\)</div>' +
              '<p class="fml-note">注意：由于 \\( \\rho\\neq0 \\)，方差不能简单相加，须加协方差项 \\( 2ab\\rho\\sigma_1\\sigma_2 \\)。</p>'
          }
        ],
        pitfalls: [
          '二维均匀分布的边缘<b>未必均匀</b>，除非区域是矩形——这是最容易被忽略的结论。',
          '\\( \\rho=0\\Leftrightarrow \\) 独立<b>只对二维正态</b>成立。',
          '二维正态的 \\( \\rho \\) 与 \\( \\mu,\\sigma \\) 相互独立地决定「位置、形状、相关方向」三件事。',
          '边缘正态推不出联合正态，不要反向使用结论。'
        ]
      },

      /* ================================================================
         3.6 两个随机变量函数的分布
         ================================================================ */
      {
        id: 'ch3-s6',
        num: '3.6',
        title: '两个及多个随机变量函数的分布',
        lead: '大纲要求「会求两个随机变量简单函数的分布，会求多个相互独立随机变量简单函数的分布」——核心是和的分布与最值分布。',
        blocks: [
          { t: 'card', kind: 'tip', tag: '总纲', title: '两类高频函数', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>函数</th><th>方法</th><th>典型结论</th></tr></thead><tbody>' +
            '<tr><td><b>和</b> \\( Z=X+Y \\)</td><td>卷积公式 / 分布函数法</td><td>正态＋正态＝正态；泊松＋泊松＝泊松</td></tr>' +
            '<tr><td><b>最值</b> \\( Z=\\max(X,Y),\\) \\( \\min(X,Y) \\)</td><td>分布函数法</td><td>用「都不超过 / 都超过」的对立事件</td></tr>' +
            '</tbody></table></div>'
          },

          { t: 'h3', idx: '①', text: '和的分布 Z = X + Y' },
          { t: 'card', kind: 'thm', tag: '定理', title: '卷积公式（X,Y 独立时）', html:
            '<p class="tight">设 \\( X,Y \\) 相互独立，密度分别为 \\( f_X,f_Y \\)，则 \\( Z=X+Y \\) 的密度为</p>' +
            '<div class="fml">\\( f_Z(z)=\\int_{-\\infty}^{+\\infty}f_X(x)\\,f_Y(z-x)\\,\\mathrm{d}x=\\int_{-\\infty}^{+\\infty}f_X(z-y)\\,f_Y(y)\\,\\mathrm{d}y \\)</div>' +
            '<p class="tight">称为 \\( f_X \\) 与 \\( f_Y \\) 的<b>卷积</b>。</p>' +
            '<p class="tight"><b>通用做法（分布函数法，无需独立时也可用）：</b></p>' +
            '<div class="fml">\\( F_Z(z)=P\\{X+Y\\leqslant z\\}=\\iint_{x+y\\leqslant z}f(x,y)\\,\\mathrm{d}x\\,\\mathrm{d}y \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '必记结论', title: '可加性（独立时）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>正态：</b>\\( X\\sim N(\\mu_1,\\sigma_1^2),\\ Y\\sim N(\\mu_2,\\sigma_2^2) \\) \\( \\Longrightarrow \\) \\( X+Y\\sim N(\\mu_1+\\mu_2,\\ \\sigma_1^2+\\sigma_2^2) \\)</div>' +
            '<div class="fml-row"><b>泊松：</b>\\( X\\sim P(\\lambda_1),\\ Y\\sim P(\\lambda_2) \\) \\( \\Longrightarrow \\) \\( X+Y\\sim P(\\lambda_1+\\lambda_2) \\)</div>' +
            '<div class="fml-row"><b>二项：</b>\\( X\\sim B(n_1,p),\\ Y\\sim B(n_2,p) \\) \\( \\Longrightarrow \\) \\( X+Y\\sim B(n_1+n_2,p) \\)</div>' +
            '<div class="fml-row"><b>卡方：</b>\\( X\\sim\\chi^2(m),\\ Y\\sim\\chi^2(n) \\) \\( \\Longrightarrow \\) \\( X+Y\\sim\\chi^2(m+n) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>注意：</b>均匀分布<b>不</b>具有对「和」的可加性（\\( U(0,1)+U(0,1) \\) 是三角形分布，不是均匀分布）。</p>'
          },
          { t: 'viz', build: 'convSum', title: '卷积：两个均匀分布之和', sub: '观察两个矩形密度如何「卷积」出三角形密度' },

          { t: 'h3', idx: '②', text: '最值分布 Z = max / min' },
          { t: 'card', kind: 'thm', tag: '定理', title: '最大值与最小值的分布', html:
            '<p class="tight">设 \\( X,Y \\) 相互独立，分布函数分别为 \\( F_X,F_Y \\)。</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>最大值：</b>\\( F_{\\max}(z)=P\\{\\max(X,Y)\\leqslant z\\}=P\\{X\\leqslant z\\}P\\{Y\\leqslant z\\}=F_X(z)F_Y(z) \\)</div>' +
            '<div class="fml-row"><b>最小值：</b>\\( F_{\\min}(z)=1-P\\{\\min(X,Y)>z\\}=1-\\left[1-F_X(z)\\right]\\left[1-F_Y(z)\\right] \\)</div>' +
            '</div>' +
            '<p class="tight"><b>n 个独立同分布推广（设分布函数为 \\( F \\)）：</b></p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( F_{\\max}(z)=[F(z)]^n \\)</div>' +
            '<div class="fml-row">\\( F_{\\min}(z)=1-[1-F(z)]^n \\)</div>' +
            '</div>'
          },
          { t: 'viz', build: 'maxMin', title: 'max / min 分布', sub: '拖动样本个数 n（1–10），观察最值分布随 n 增大而向两端极化的差异' },
          { t: 'viz', build: 'maxMinDerive', title: '最值分布公式的验证', sub: '拖动 n 与 x₀，核对 F_max=F^n、F_min=1−(1−F)^n' },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>和的分布</b>：卷积公式或二重积分，注意支撑集的<b>分段讨论</b>。</li>' +
            '<li><b>最值分布</b>：几乎必考。串联系统寿命 = min，并联系统寿命 = max。</li>' +
            '<li><b>可加性</b>：直接套正态/泊松/二项/卡方的可加性结论。</li>' +
            '<li><b>商的分布、积的分布</b>：用分布函数法（\\( P\\{X/Y\\leqslant z\\} \\) 化为区域积分）。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '分段讨论不可省略', html:
            '<p class="tight">求 \\( Z=X+Y \\) 的密度时，\\( z \\) 的取值区间不同，积分限不同（几何上是直线 \\( x+y=z \\) 扫过支撑集的过程）。必须<b>按 \\( z \\) 分段</b>写出 \\( f_Z(z) \\)，并在最后注明定义域。</p>'
          }
        ],
        examples: [
          {
            no: '例 3.13', meta: '真题改编 · 均匀分布之和',
            q: '设 \\( X,Y \\) 独立同分布，均服从 \\( U(0,1) \\)。求 \\( Z=X+Y \\) 的概率密度。',
            sol:
              '<p>用卷积公式，\\( f_X(x)=f_Y(x)=1\\ (0<x<1) \\)：</p>' +
              '<div class="fml">\\( f_Z(z)=\\int_{-\\infty}^{+\\infty}f_X(x)f_Y(z-x)\\,\\mathrm{d}x \\)</div>' +
              '<p>被积函数非零需 \\( 0<x<1 \\) 且 \\( 0<z-x<1 \\)，即 \\( x\\in(0,1)\\cap(z-1,z) \\)。分三段：</p>' +
              '<div class="fml">\\( f_Z(z)=\\begin{cases}\\displaystyle\\int_0^{z}1\\,\\mathrm{d}x=z, & 0\\leqslant z<1\\\\[8pt] \\displaystyle\\int_{z-1}^{1}1\\,\\mathrm{d}x=2-z, & 1\\leqslant z\\leqslant 2\\\\[8pt] 0, & \\text{其他}\\end{cases} \\)</div>' +
              '<p>这是著名的<b>三角形（辛普森）分布</b>——两个均匀分布之和不再均匀。</p>'
          },
          {
            no: '例 3.14', meta: '真题改编 · 最值分布',
            q: '设系统由两个独立工作的元件串联而成，元件寿命分别为 \\( X,Y \\)，均服从参数为 \\( \\lambda \\) 的指数分布。求系统寿命 \\( Z=\\min(X,Y) \\) 的分布。',
            sol:
              '<p>串联系统寿命 = 最先失效的元件寿命 = \\( \\min(X,Y) \\)。</p>' +
              '<p>指数分布 \\( F(t)=1-e^{-\\lambda t}\\ (t>0) \\)，故 \\( 1-F(t)=e^{-\\lambda t} \\)。</p>' +
              '<div class="fml">\\( F_Z(z)=1-[1-F(z)]^2=1-e^{-2\\lambda z},\\qquad z>0 \\)</div>' +
              '<p>即 \\( Z=\\min(X,Y)\\sim E(2\\lambda) \\)。</p>' +
              '<p class="fml-note">推广：\\( n \\) 个独立同分布指数分布取最小值仍服从指数分布，参数为 \\( n\\lambda \\)。这是串联系统可靠性的经典结论。</p>'
          },
          {
            no: '例 3.15', meta: '提高 · 正态可加性',
            q: '设 \\( X\\sim N(1,4) \\)，\\( Y\\sim N(2,9) \\)，且 \\( X,Y \\) 相互独立。求 \\( P\\{X+Y\\leqslant 3\\} \\)（已知 \\( \\Phi(0)=0.5 \\)）。',
            sol:
              '<p>由正态可加性：</p>' +
              '<div class="fml">\\( X+Y\\sim N(1+2,\\ 4+9)=N(3,13) \\)</div>' +
              '<p>标准化：</p>' +
              '<div class="fml">\\( P\\{X+Y\\leqslant 3\\}=\\Phi\\!\\left(\\dfrac{3-3}{\\sqrt{13}}\\right)=\\Phi(0)=\\mathbf{0.5} \\)</div>'
          },
          {
            no: '例 3.16', meta: '提高 · 最大值分布',
            q: '设 \\( X_1,X_2,X_3 \\) 独立同分布，均服从 \\( U(0,\\theta) \\)。求 \\( M=\\max(X_1,X_2,X_3) \\) 的密度。',
            sol:
              '<p>\\( F(x)=\\dfrac{x}{\\theta}\\ (0<x<\\theta) \\)，故</p>' +
              '<div class="fml">\\( F_M(z)=\\left[F(z)\\right]^3=\\left(\\dfrac{z}{\\theta}\\right)^3,\\qquad 0<z<\\theta \\)</div>' +
              '<p>求导：</p>' +
              '<div class="fml">\\( f_M(z)=\\dfrac{3z^2}{\\theta^3},\\qquad 0<z<\\theta \\)</div>' +
              '<p class="fml-note">这是极大似然估计中 \\( \\hat\\theta=\\max X_i \\) 的理论基础（见第七章）。</p>'
          }
        ],
        pitfalls: [
          '卷积公式要求 \\( X,Y \\) <b>独立</b>；不独立时必须回到二重积分（分布函数法）。',
          '求 \\( f_Z(z) \\) 必须按 \\( z \\) <b>分段</b>给出，并注明各段的定义域。',
          '\\( \\max \\) 与 \\( \\min \\) 的公式不要记反：\\( \\max \\) 用「都 \\( \\leqslant \\)」，\\( \\min \\) 用「都不 \\( > \\)」取对立。',
          '均匀分布对「和」无可加性；正态、泊松、二项、卡方具有可加性。'
        ]
      }

    ]
  };

})(window);
