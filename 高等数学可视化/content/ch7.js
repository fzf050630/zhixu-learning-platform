/* ============================================================
   ch7.js — 第七章 无穷级数
   覆盖 2026 大纲「七、无穷级数」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH7 = {
    id: 'ch7', no: '七', title: '无穷级数',
    subtitle: '把无穷多个数“加起来”是否有意义？——级数用部分和的极限回答这个问题，而幂级数把函数变成“无穷次多项式”。',
    tags: ['级数', '正项级数', '交错级数', '幂级数', '泰勒展开', '傅里叶级数', '常数项级数', '绝对收敛', '条件收敛', '收敛半径', '麦克劳林级数', '狄利克雷定理', '正弦级数', '余弦级数'],
    sections: [

      /* ---------------- 7.1 ---------------- */
      {
        id: 'ch7-s1', num: '7.1', title: '常数项级数的概念与性质',
        lead: '大纲要求：理解常数项级数收敛、发散以及收敛级数的和的概念，掌握级数的基本性质及收敛的必要条件，掌握几何级数与 p 级数的收敛与发散的条件。',
        blocks: [
          { t: 'h3', idx: '①', text: '常数项级数的定义' },
          { t: 'p', html: '给定数列 \\( u_1,u_2,\\cdots,u_n,\\cdots \\)，把它们依次相加所得的表达式称为（常数项）无穷级数：' },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\sum_{n=1}^{\\infty}u_n=u_1+u_2+\\cdots+u_n+\\cdots \\)，其中 \\( u_n \\) 称为通项（一般项）。</div>' +
            '<div class="fml-row">\\( S_n=\\sum_{k=1}^{n}u_k=u_1+u_2+\\cdots+u_n \\) 称为级数的前 \\( n \\) 项部分和。</div>'
          },
          { t: 'card', kind: 'def', tag: '定义', title: '级数的收敛与发散', html:
            '<p class="tight">若部分和数列 \\( \\{S_n\\} \\) 收敛于有限数 \\( S \\)，则称级数 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) <b>收敛</b>，并称 \\( S \\) 为该级数的<b>和</b>，记作 \\( \\sum\\limits_{n=1}^{\\infty}u_n=S \\)；若 \\( \\{S_n\\} \\) 发散，则称级数<b>发散</b>，发散级数没有和。</p>' +
            '<p class="tight">收敛时，称 \\( r_n=S-S_n=\\sum\\limits_{k=n+1}^{\\infty}u_k \\) 为级数的<b>余项</b>，显然 \\( \\lim\\limits_{n\\to\\infty}r_n=0 \\)。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\sum_{n=1}^{\\infty}u_n=S \\iff \\lim_{n\\to\\infty}S_n=S \\quad (S \\text{ 为有限数}) \\)</div>' +
            '<div class="fml-row">\\( S=S_n+r_n,\\qquad r_n=\\sum_{k=n+1}^{\\infty}u_k,\\qquad \\lim_{n\\to\\infty}r_n=0 \\)</div>'
          },
          { t: 'h3', idx: '②', text: '级数收敛的必要条件' },
          { t: 'card', kind: 'thm', tag: '定理', title: '收敛的必要条件', html:
            '<p class="tight">若级数 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) 收敛，则必有 \\( \\lim\\limits_{n\\to\\infty}u_n=0 \\)。</p>' +
            '<p class="tight"><b>逆否命题（判发散最常用）</b>：若 \\( \\lim\\limits_{n\\to\\infty}u_n\\neq 0 \\) 或该极限不存在，则级数 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) 必发散。</p>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: 'uₙ → 0 推不出收敛', html:
            '<p class="tight">\\( \\lim\\limits_{n\\to\\infty}u_n=0 \\) 只是收敛的<b>必要</b>条件。调和级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac1n \\) 的通项趋于 0，但级数发散（部分和 \\( S_n\\sim\\ln n\\to\\infty \\)）。</p>'
          },
          { t: 'card', kind: 'tip', tag: '柯西准则', title: '级数收敛的充要条件', html:
            '<p class="tight">\\( \\sum\\limits_{n=1}^{\\infty}u_n \\) 收敛 \\( \\iff \\forall\\varepsilon>0,\\ \\exists N>0 \\)，当 \\( m>n>N \\) 时，\\( \\left|\\sum\\limits_{k=n+1}^{m}u_k\\right|<\\varepsilon \\)。</p>' +
            '<p class="tight">它对常数项级数与函数项级数都适用，是判断“是否收敛”的理论总开关。</p>'
          },
          { t: 'h3', idx: '③', text: '收敛级数的基本性质' },
          { t: 'table', head: ['性质', '内容与注意点'], rows: [
            ['性质 1（线性性）', '若 \\( \\sum u_n,\\ \\sum v_n \\) 都收敛，则 \\( \\sum(\\alpha u_n+\\beta v_n)=\\alpha\\sum u_n+\\beta\\sum v_n \\)；前提是两个级数都收敛'],
            ['性质 2（有限项无关）', '增加、减少或改变级数的有限项，不改变级数的敛散性（收敛时和一般会改变）'],
            ['性质 3（可加括号）', '收敛级数任意加括号后仍收敛且和不变；但加括号后收敛推不出原级数收敛'],
            ['性质 4（必要条件）', '级数收敛 \\( \\Rightarrow \\lim\\limits_{n\\to\\infty}u_n=0 \\)'],
            ['性质 5（发散判定）', '若 \\( \\sum u_n \\) 收敛而 \\( \\sum v_n \\) 发散，则 \\( \\sum(u_n\\pm v_n) \\) 必发散']
          ]},
          { t: 'card', kind: 'warn', tag: '易错', title: '两个“反直觉”的结论', html:
            '<ul class="none">' +
            '<li>两个发散级数逐项相加所得级数<b>未必</b>发散：\\( \\sum\\dfrac1n \\) 与 \\( \\sum\\left(-\\dfrac1n\\right) \\) 都发散，但逐项相加后为零级数，收敛于 0；</li>' +
            '<li>加括号与去括号不能随意进行：\\( 1-1+1-1+\\cdots \\) 加括号得 \\( (1-1)+(1-1)+\\cdots=0 \\)，但不加括号时部分和在 0 与 1 之间跳动，原级数发散。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '④', text: '两个基准级数：几何级数与 p 级数' },
          { t: 'fml', html:
            '<div class="fml-row"><b>几何级数：</b>\\( \\sum\\limits_{n=0}^{\\infty}aq^n=a+aq+aq^2+\\cdots=\\dfrac{a}{1-q}\\quad(|q|<1,\\ a\\neq 0) \\)；当 \\( |q|\\geqslant 1 \\) 时发散。</div>' +
            '<div class="fml-row"><b>p 级数：</b>\\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n^p} \\) 当 \\( p>1 \\) 时收敛，当 \\( p\\leqslant 1 \\) 时发散；\\( p=1 \\) 即调和级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac1n \\)，发散。</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '基准级数速查', html:
            '<ul class="none">' +
            '<li>几何级数 \\( \\sum\\limits_{n=0}^{\\infty}aq^n \\)：\\( |q|<1 \\) 时收敛于 \\( \\dfrac{a}{1-q} \\)；\\( |q|\\geqslant 1 \\) 时发散；</li>' +
            '<li>p 级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n^p} \\)：\\( p>1 \\) 收敛；\\( p\\leqslant 1 \\) 发散；</li>' +
            '<li>常用两个特殊值：\\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n^2}=\\dfrac{\\pi^2}{6} \\)，\\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n-1}}{n}=\\ln 2 \\)（7.3、7.5 中反复出现）。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'seriesPartial', title: '级数的部分和与敛散性', sub: '切换几何级数、调和级数、p 级数与交错级数，拖动 n 观察 Sₙ 的走向' },
          { t: 'h3', idx: '⑤', text: '判定级数敛散的基本流程' },
          { t: 'list', items: [
            '第一步看通项：若 \\( \\lim\\limits_{n\\to\\infty}u_n\\neq 0 \\)，立即判定级数发散；',
            '若通项趋于 0，再区分类型：正项级数用 7.2 节的比较、比值、根值、积分判别法；交错级数用 7.3 节的莱布尼茨判别法；任意项级数先考察绝对值级数；',
            '善于把通项与几何级数、p 级数比较，确定通项的“阶”是核心；',
            '收敛级数的和一般难以直接求出，常用“部分和取极限”“裂项相消”或“借助幂级数展开式”求值。'
          ]}
        ],
        examples: [
          {
            no: '例 7.1', meta: '基础 · 裂项相消求部分和',
            q: '判断级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n(n+1)} \\) 的敛散性，若收敛求其和。',
            sol: '<p>裂项：\\( u_n=\\dfrac{1}{n(n+1)}=\\dfrac1n-\\dfrac{1}{n+1} \\)，于是</p>' +
              '<p>\\( S_n=\\left(1-\\dfrac12\\right)+\\left(\\dfrac12-\\dfrac13\\right)+\\cdots+\\left(\\dfrac1n-\\dfrac{1}{n+1}\\right)=1-\\dfrac{1}{n+1} \\)。</p>' +
              '<p>\\( \\lim\\limits_{n\\to\\infty}S_n=1 \\)，故级数<b>收敛</b>，和为 \\( 1 \\)。</p>'
          },
          {
            no: '例 7.2', meta: '基础 · 几何级数求和',
            q: '判断级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{2^n+3^n}{6^n} \\) 的敛散性，若收敛求其和。',
            sol: '<p>拆项：\\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{2^n+3^n}{6^n}=\\sum\\limits_{n=1}^{\\infty}\\left(\\dfrac{1}{3^n}+\\dfrac{1}{2^n}\\right) \\)。</p>' +
              '<p>两个几何级数都收敛：\\( \\sum\\limits_{n=1}^{\\infty}\\left(\\dfrac13\\right)^n=\\dfrac{1/3}{1-1/3}=\\dfrac12 \\)，\\( \\sum\\limits_{n=1}^{\\infty}\\left(\\dfrac12\\right)^n=1 \\)。</p>' +
              '<p>由线性性质，原级数<b>收敛</b>，和为 \\( \\dfrac12+1=\\dfrac32 \\)。</p>'
          },
          {
            no: '例 7.3', meta: '综合 · 必要条件与性质',
            q: '（1）判断 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{2n^2+1}{3n^2+n} \\) 的敛散性；（2）已知 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) 收敛于 \\( S \\)，判断 \\( \\sum\\limits_{n=1}^{\\infty}(u_n+u_{n+1}) \\) 的敛散性并求和。',
            sol: '<p>（1）\\( \\lim\\limits_{n\\to\\infty}u_n=\\lim\\limits_{n\\to\\infty}\\dfrac{2n^2+1}{3n^2+n}=\\dfrac23\\neq 0 \\)，由收敛的必要条件，级数<b>发散</b>。</p>' +
              '<p>（2）记部分和 \\( T_N=\\sum\\limits_{n=1}^{N}(u_n+u_{n+1})=2S_N-u_1+u_{N+1} \\)。因为 \\( \\sum u_n \\) 收敛，故 \\( S_N\\to S \\) 且 \\( u_{N+1}\\to 0 \\)，</p>' +
              '<p>所以 \\( T_N\\to 2S-u_1 \\)，即 \\( \\sum\\limits_{n=1}^{\\infty}(u_n+u_{n+1}) \\) <b>收敛</b>且和为 \\( 2S-u_1 \\)。</p>'
          }
        ],
        pitfalls: [
          '\\( \\lim\\limits_{n\\to\\infty}u_n=0 \\) 只是收敛的必要条件：调和级数 \\( \\sum\\dfrac1n \\) 就是“通项趋于 0 但级数发散”的经典反例。',
          '线性性质要求两个级数都收敛，不能对发散级数使用；且两个发散级数之和可能收敛（如 \\( \\sum\\dfrac1n \\) 与 \\( \\sum\\left(-\\dfrac1n\\right) \\)）。',
          '收敛级数加括号不改变和，但“加括号后收敛”推不出原级数收敛，例如 \\( 1-1+1-1+\\cdots \\)。',
          '几何级数求和要数清首项与公比：从 \\( n=1 \\) 开始时首项是 \\( aq \\)，公式为 \\( \\dfrac{aq}{1-q} \\)，不要与 \\( \\dfrac{a}{1-q} \\) 混淆。'
        ]
      },

      /* ---------------- 7.2 ---------------- */
      {
        id: 'ch7-s2', num: '7.2', title: '正项级数的判别法',
        lead: '大纲要求：掌握正项级数收敛性的比较判别法、比值判别法、根值判别法，会用积分判别法。',
        blocks: [
          { t: 'h3', idx: '①', text: '正项级数的收敛原理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '部分和有界准则', html:
            '<p class="tight">设 \\( u_n\\geqslant 0 \\)，则正项级数 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) 的部分和数列 \\( \\{S_n\\} \\) 单调不减，于是</p>' +
            '<div class="fml">\\( \\sum_{n=1}^{\\infty}u_n \\text{ 收敛} \\iff \\{S_n\\} \\text{ 有上界} \\)</div>' +
            '<p class="tight">正项级数的敛散性完全由“部分和是否有界”决定，这为各种判别法提供了统一出发点。</p>'
          },
          { t: 'h3', idx: '②', text: '比较判别法' },
          { t: 'fml', html:
            '<div class="fml-row"><b>一般形式：</b>设 \\( 0\\leqslant u_n\\leqslant v_n \\)，则 \\( \\sum v_n \\) 收敛 \\( \\Rightarrow \\sum u_n \\) 收敛；\\( \\sum u_n \\) 发散 \\( \\Rightarrow \\sum v_n \\) 发散。</div>' +
            '<div class="fml-row"><b>极限形式：</b>设 \\( \\lim\\limits_{n\\to\\infty}\\dfrac{u_n}{v_n}=\\rho\\ (v_n>0) \\)：若 \\( 0<\\rho<+\\infty \\)，则两级数同敛散；若 \\( \\rho=0 \\)，则 \\( \\sum v_n \\) 收敛 \\( \\Rightarrow \\sum u_n \\) 收敛；若 \\( \\rho=+\\infty \\)，则 \\( \\sum v_n \\) 发散 \\( \\Rightarrow \\sum u_n \\) 发散。</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '比较法的“标尺”与实用结论', html:
            '<ul class="none">' +
            '<li>标尺一：几何级数 \\( \\sum aq^n\\ (|q|<1) \\)；标尺二：p 级数 \\( \\sum\\dfrac{1}{n^p}\\ (p>1) \\)；</li>' +
            '<li>若 \\( \\lim\\limits_{n\\to\\infty}n^pu_n=l \\) 且 \\( 0<l<+\\infty \\)，则 \\( \\sum u_n \\) 与 \\( \\sum\\dfrac{1}{n^p} \\) 同敛散——“看阶定敛散”；</li>' +
            '<li>常见阶的估计：\\( \\sin\\dfrac1n\\sim\\dfrac1n \\)，\\( \\ln\\left(1+\\dfrac1n\\right)\\sim\\dfrac1n \\)，\\( 1-\\cos\\dfrac1n\\sim\\dfrac{1}{2n^2} \\)。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '比值判别法与根值判别法' },
          { t: 'table', head: ['判别法', '条件（设极限存在）', '结论'], rows: [
            ['比值判别法（达朗贝尔）', '\\( \\lim\\limits_{n\\to\\infty}\\dfrac{u_{n+1}}{u_n}=\\rho \\)', '\\( \\rho<1 \\) 收敛；\\( \\rho>1 \\)（含 \\( +\\infty \\)）发散；\\( \\rho=1 \\) 失效'],
            ['根值判别法（柯西）', '\\( \\lim\\limits_{n\\to\\infty}\\sqrt[n]{u_n}=\\rho \\)', '\\( \\rho<1 \\) 收敛；\\( \\rho>1 \\)（含 \\( +\\infty \\)）发散；\\( \\rho=1 \\) 失效']
          ]},
          { t: 'p', html: '当 \\( \\rho>1 \\) 时，通项 \\( u_n \\) 不可能趋于 0，故级数发散；当 \\( \\rho=1 \\) 时判别法失效，必须换用比较法、积分判别法或回到部分和定义。' },
          { t: 'card', kind: 'tip', tag: '选择原则', title: '比值还是根值？', html:
            '<ul class="none">' +
            '<li>一般项含 <b>n!、\\( a^n \\) 或连乘积</b>：优先用比值判别法，求 \\( \\dfrac{u_{n+1}}{u_n} \\) 时大量因子相消；</li>' +
            '<li>一般项是 <b>整体 n 次方</b>（形如 \\( [\\ \\cdot\\ ]^n \\)）：优先用根值判别法；</li>' +
            '<li>若算出 \\( \\rho=1 \\)，多半要回到比较法，与 p 级数比较定阶。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'seriesTests', title: '正项级数判别法与 p 级数数轴', sub: '切换多个级数观察部分和的走向，拖动 p 在数轴上定位收敛 / 发散分界' },
          { t: 'h3', idx: '④', text: '积分判别法' },
          { t: 'card', kind: 'thm', tag: '定理', title: '积分判别法', html:
            '<p class="tight">设 \\( f(x) \\) 在 \\( [1,+\\infty) \\) 上<b>非负、连续、单调减少</b>，令 \\( u_n=f(n) \\)，则</p>' +
            '<div class="fml">\\( \\sum_{n=1}^{\\infty}u_n \\text{ 与反常积分} \\int_1^{+\\infty}f(x)\\,\\mathrm{d}x \\text{ 同敛散} \\)</div>' +
            '<p class="tight">典型应用：取 \\( f(x)=\\dfrac{1}{x^p} \\) 即得 p 级数结论 \\( \\int_1^{+\\infty}\\dfrac{\\mathrm{d}x}{x^p} \\) 当 \\( p>1 \\) 收敛、\\( p\\leqslant 1 \\) 发散。</p>'
          },
          { t: 'card', kind: 'warn', tag: '注意', title: '使用积分判别法的前提', html:
            '<p class="tight">要求 \\( f \\) 非负、单调减少。若 \\( f \\) 不单调（如含 \\( \\sin n \\) 的项），不能直接使用，应先放缩或分段处理。</p>'
          },
          { t: 'h3', idx: '⑤', text: '判别流程小结' },
          { t: 'list', items: [
            '通项是否趋于 0？不趋于 0 直接判发散；',
            '含 \\( n! \\)、\\( a^n \\)、连乘积 → 比值判别法；形如 \\( [\\ \\cdot\\ ]^n \\) → 根值判别法；',
            '含 n 的幂、有理分式、根式 → 比较判别法（与 p 级数定阶）；',
            '以上都失效（\\( \\rho=1 \\)）→ 积分判别法，或对通项放缩后重新使用比较法。'
          ]}
        ],
        examples: [
          {
            no: '例 7.4', meta: '比值判别法',
            q: '判断级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{n!}{n^n} \\) 的敛散性。',
            sol: '<p>\\( \\dfrac{u_{n+1}}{u_n}=\\dfrac{(n+1)!}{(n+1)^{n+1}}\\cdot\\dfrac{n^n}{n!}=\\dfrac{(n+1)n^n}{(n+1)^{n+1}}=\\left(\\dfrac{n}{n+1}\\right)^n=\\dfrac{1}{\\left(1+\\frac1n\\right)^n}\\to\\dfrac1{\\mathrm{e}} \\)。</p>' +
              '<p>因为 \\( \\rho=\\dfrac1{\\mathrm{e}}<1 \\)，由比值判别法，级数<b>收敛</b>。</p>'
          },
          {
            no: '例 7.5', meta: '根值判别法',
            q: '判断级数 \\( \\sum\\limits_{n=1}^{\\infty}\\left(\\dfrac{n}{2n+1}\\right)^{n} \\) 的敛散性。',
            sol: '<p>\\( \\sqrt[n]{u_n}=\\dfrac{n}{2n+1}\\to\\dfrac12 \\)，即 \\( \\rho=\\dfrac12<1 \\)。</p>' +
              '<p>由根值判别法，级数<b>收敛</b>。</p>'
          },
          {
            no: '例 7.6', meta: '比较判别法（极限形式）',
            q: '判断级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n}\\sin\\dfrac1n \\) 的敛散性。',
            sol: '<p>取标尺 \\( v_n=\\dfrac{1}{n^2} \\)，则</p>' +
              '<p>\\( \\lim\\limits_{n\\to\\infty}\\dfrac{u_n}{v_n}=\\lim\\limits_{n\\to\\infty}\\dfrac{\\frac1n\\sin\\frac1n}{\\frac{1}{n^2}}=\\lim\\limits_{n\\to\\infty}\\dfrac{\\sin\\frac1n}{\\frac1n}=1 \\in(0,+\\infty) \\)。</p>' +
              '<p>由极限形式的比较判别法，原级数与 \\( \\sum\\dfrac{1}{n^2} \\) 同敛散；而 \\( p=2>1 \\) 的 p 级数收敛，故原级数<b>收敛</b>。</p>'
          },
          {
            no: '例 7.7', meta: '积分判别法',
            q: '判断级数 \\( \\sum\\limits_{n=2}^{\\infty}\\dfrac{1}{n\\ln n} \\) 与 \\( \\sum\\limits_{n=2}^{\\infty}\\dfrac{1}{n(\\ln n)^2} \\) 的敛散性。',
            sol: '<p>取 \\( f(x)=\\dfrac{1}{x\\ln x} \\)（非负、连续、单调减少）：\\( \\int_2^{+\\infty}\\dfrac{\\mathrm{d}x}{x\\ln x}=\\ln\\ln x\\Big|_2^{+\\infty}=+\\infty \\)，故 \\( \\sum\\dfrac{1}{n\\ln n} \\) <b>发散</b>。</p>' +
              '<p>取 \\( g(x)=\\dfrac{1}{x(\\ln x)^2} \\)：\\( \\int_2^{+\\infty}\\dfrac{\\mathrm{d}x}{x(\\ln x)^2}=-\\dfrac{1}{\\ln x}\\Big|_2^{+\\infty}=\\dfrac{1}{\\ln 2} \\) 收敛，故 \\( \\sum\\dfrac{1}{n(\\ln n)^2} \\) <b>收敛</b>。</p>'
          }
        ],
        pitfalls: [
          '比值、根值判别法中 \\( \\rho=1 \\) 时判别法失效，必须换方法：\\( \\sum\\dfrac1n \\) 与 \\( \\sum\\dfrac{1}{n^2} \\) 都有 \\( \\rho=1 \\)，但一个发散、一个收敛。',
          '比较判别法极限形式中 \\( \\rho=0 \\) 与 \\( \\rho=+\\infty \\) 的结论方向不能记反：\\( \\rho=0 \\) 时“小项随大项收敛”，\\( \\rho=+\\infty \\) 时“大项随小项发散”。',
          '积分判别法要求 \\( f \\) 非负且单调减少：\\( \\sum\\dfrac{1+\\sin n}{n^2} \\) 这类项不能直接积分判别，应放缩：\\( \\dfrac{1+\\sin n}{n^2}\\leqslant\\dfrac{2}{n^2} \\)，再用比较法。'
        ]
      },

      /* ---------------- 7.3 ---------------- */
      {
        id: 'ch7-s3', num: '7.3', title: '交错级数与绝对收敛',
        lead: '大纲要求：掌握交错级数的莱布尼茨判别法；了解任意项级数绝对收敛与条件收敛的概念以及绝对收敛与收敛的关系。',
        blocks: [
          { t: 'h3', idx: '①', text: '交错级数与莱布尼茨判别法' },
          { t: 'card', kind: 'def', tag: '定义', title: '交错级数', html:
            '<p class="tight">形如 \\( \\sum\\limits_{n=1}^{\\infty}(-1)^{n-1}u_n=u_1-u_2+u_3-u_4+\\cdots\\ (u_n>0) \\) 的级数称为<b>交错级数</b>。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '莱布尼茨判别法', html:
            '<p class="tight">若交错级数 \\( \\sum\\limits_{n=1}^{\\infty}(-1)^{n-1}u_n \\) 满足：</p>' +
            '<ul class="none">' +
            '<li>（1）\\( u_n \\) <b>单调减少</b>：\\( u_1\\geqslant u_2\\geqslant\\cdots \\)；</li>' +
            '<li>（2）\\( \\lim\\limits_{n\\to\\infty}u_n=0 \\)，</li>' +
            '</ul>' +
            '<p class="tight">则该级数<b>收敛</b>，且其和 \\( S\\leqslant u_1 \\)，余项估计为 \\( |r_n|=|S-S_n|\\leqslant u_{n+1} \\)（截断误差不超过第一个被舍去的项）。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row">\\( u_n\\ \\text{单调递减},\\ \\lim_{n\\to\\infty}u_n=0 \\ \\Longrightarrow\\ \\sum_{n=1}^{\\infty}(-1)^{n-1}u_n=S,\\quad 0<S\\leqslant u_1 \\)</div>' +
            '<div class="fml-row">\\( |r_n|=|S-S_n|\\leqslant u_{n+1} \\)</div>'
          },
          { t: 'viz', build: 'leibnizTest', title: '交错级数部分和的上下振荡夹逼', sub: '切换三组交错级数，拖动 / 播放 n：奇数项部分和下降、偶数项上升，夹逼到极限 S' },
          { t: 'card', kind: 'warn', tag: '易错', title: '三个条件缺一不可', html:
            '<p class="tight">“交错”“\\( u_n \\) 单调减少”“\\( u_n\\to 0 \\)”缺一不可。例如把正项取 \\( \\dfrac{1}{2k-1} \\)、负项取 \\( \\dfrac{1}{(2k)^2} \\) 构成的交错级数，虽然通项趋于 0 但不单调，其正项部分发散、负项部分收敛，级数实际发散。</p>'
          },
          { t: 'h3', idx: '②', text: '绝对收敛与条件收敛' },
          { t: 'card', kind: 'def', tag: '定义', title: '绝对收敛与条件收敛', html:
            '<p class="tight">对任意项级数 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\)：</p>' +
            '<ul class="none">' +
            '<li>若 \\( \\sum\\limits_{n=1}^{\\infty}|u_n| \\) 收敛，则称 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) <b>绝对收敛</b>；</li>' +
            '<li>若 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) 收敛，而 \\( \\sum\\limits_{n=1}^{\\infty}|u_n| \\) 发散，则称 \\( \\sum\\limits_{n=1}^{\\infty}u_n \\) <b>条件收敛</b>。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '绝对收敛必收敛', html:
            '<p class="tight">若 \\( \\sum |u_n| \\) 收敛，则 \\( \\sum u_n \\) 必收敛。</p>' +
            '<p class="tight"><b>证明思路：</b>由 \\( 0\\leqslant u_n+|u_n|\\leqslant 2|u_n| \\)，比较判别法得 \\( \\sum(u_n+|u_n|) \\) 收敛；再由 \\( \\sum u_n=\\sum(u_n+|u_n|)-\\sum|u_n| \\) 及线性性质即得。</p>' +
            '<p class="tight">反之不成立：\\( \\sum\\dfrac{(-1)^{n-1}}{n} \\) 收敛，但 \\( \\sum\\dfrac1n \\) 发散。该定理把“任意项级数”问题化归为“正项级数”问题。</p>'
          },
          { t: 'card', kind: 'tip', tag: '了解', title: '绝对收敛级数的优良性质', html:
            '<ul class="none">' +
            '<li>绝对收敛级数任意交换项的次序后仍绝对收敛，且和不变；</li>' +
            '<li>条件收敛级数可以经过重排而改变和，甚至可重排为任意指定的和（黎曼定理）；</li>' +
            '<li>两个绝对收敛级数的柯西乘积仍绝对收敛，其和等于两级数和的乘积。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '任意项级数的判别顺序' },
          { t: 'list', items: [
            '第一步考察绝对值级数 \\( \\sum|u_n| \\)（这是正项级数，可用 7.2 的一切方法）：若收敛，则原级数绝对收敛；',
            '若 \\( \\sum|u_n| \\) 发散，<b>不能</b>立即断言原级数发散，还要再看原级数本身；',
            '若原级数是交错级数（或可整理为交错级数），试用莱布尼茨判别法；若收敛，则为条件收敛；',
            '若上述都不行，可回到定义研究部分和，或利用收敛的必要条件先排除一部分情形。'
          ]}
        ],
        examples: [
          {
            no: '例 7.8', meta: '莱布尼茨判别法 · 条件收敛',
            q: '判断级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n-1}}{\\sqrt n} \\) 的敛散性；若收敛，说明是绝对收敛还是条件收敛。',
            sol: '<p>取 \\( u_n=\\dfrac{1}{\\sqrt n} \\)，显然 \\( u_n \\) 单调减少且 \\( \\lim\\limits_{n\\to\\infty}u_n=0 \\)，由莱布尼茨判别法，原级数<b>收敛</b>。</p>' +
              '<p>再看绝对值级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{\\sqrt n} \\)：这是 \\( p=\\dfrac12<1 \\) 的 p 级数，<b>发散</b>。</p>' +
              '<p>故原级数<b>条件收敛</b>。</p>'
          },
          {
            no: '例 7.9', meta: '绝对收敛的判定',
            q: '判断级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{\\sin n}{n^{2}} \\) 的敛散性。',
            sol: '<p>考察绝对值级数：\\( \\left|\\dfrac{\\sin n}{n^2}\\right|\\leqslant\\dfrac{1}{n^2} \\)，而 \\( \\sum\\dfrac{1}{n^2} \\) 是 \\( p=2>1 \\) 的收敛 p 级数。</p>' +
              '<p>由比较判别法，\\( \\sum\\left|\\dfrac{\\sin n}{n^2}\\right| \\) 收敛，故原级数<b>绝对收敛</b>，从而收敛。</p>'
          },
          {
            no: '例 7.10', meta: '综合 · 含参数的讨论',
            q: '讨论级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n-1}}{n^{p}}\\ (p>0) \\) 的敛散性（绝对收敛还是条件收敛）。',
            sol: '<p>绝对值级数为 p 级数 \\( \\sum\\dfrac{1}{n^p} \\)：</p>' +
              '<p>当 \\( p>1 \\) 时收敛，故原级数<b>绝对收敛</b>；</p>' +
              '<p>当 \\( 0<p\\leqslant 1 \\) 时 \\( \\sum\\dfrac{1}{n^p} \\) 发散。但 \\( u_n=\\dfrac{1}{n^p} \\) 单调减少且趋于 0，由莱布尼茨判别法原级数收敛，故此时<b>条件收敛</b>。</p>'
          }
        ],
        pitfalls: [
          '莱布尼茨判别法只适用于交错级数，且必须验证单调性：像 \\( \\sum\\dfrac{(-1)^n}{\\sqrt n+(-1)^n} \\) 这类“伪装”的交错级数，\\( u_n \\) 不单调，不能直接套用。',
          '“\\( \\sum|u_n| \\) 发散”不等于“\\( \\sum u_n \\) 发散”：条件收敛级数正是反例，必须再单独判断原级数。',
          '判断 \\( \\sum|u_n| \\) 时它是正项级数，可用比较、比值等一切方法；但比值法用于 \\( \\sum\\dfrac{(-1)^n}{n} \\) 会得到 \\( \\rho=1 \\) 失效，不可据此下结论。'
        ]
      },

      /* ---------------- 7.4 ---------------- */
      {
        id: 'ch7-s4', num: '7.4', title: '幂级数与收敛半径',
        lead: '大纲要求：了解函数项级数的收敛域及和函数的概念；理解幂级数收敛半径的概念，并掌握幂级数的收敛半径、收敛区间及收敛域的求法；了解幂级数在其收敛区间内的基本性质，会求一些幂级数在收敛区间内的和函数，并会由此求出某些数项级数的和。',
        blocks: [
          { t: 'h3', idx: '①', text: '函数项级数、收敛域与和函数' },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\sum_{n=1}^{\\infty}u_n(x)=u_1(x)+u_2(x)+\\cdots+u_n(x)+\\cdots \\)，其中每一项都是定义在区间 \\( I \\) 上的函数。</div>'
          },
          { t: 'card', kind: 'def', tag: '定义', title: '收敛点、收敛域与和函数', html:
            '<p class="tight">对固定的 \\( x_0\\in I \\)，若数项级数 \\( \\sum\\limits_{n=1}^{\\infty}u_n(x_0) \\) 收敛，则称 \\( x_0 \\) 为函数项级数的<b>收敛点</b>；收敛点的全体称为<b>收敛域</b> \\( D \\)。</p>' +
            '<p class="tight">在 \\( D \\) 上，令 \\( S(x)=\\sum\\limits_{n=1}^{\\infty}u_n(x) \\)，称 \\( S(x) \\) 为级数的<b>和函数</b>；并称 \\( r_n(x)=S(x)-S_n(x) \\) 为余项。</p>'
          },
          { t: 'h3', idx: '②', text: '阿贝尔定理与收敛半径' },
          { t: 'card', kind: 'thm', tag: '定理', title: '阿贝尔（Abel）定理', html:
            '<p class="tight">对幂级数 \\( \\sum\\limits_{n=0}^{\\infty}a_nx^n \\)：</p>' +
            '<ul class="none">' +
            '<li>若它在 \\( x_0\\neq 0 \\) 处收敛，则对一切满足 \\( |x|<|x_0| \\) 的 \\( x \\)，它<b>绝对收敛</b>；</li>' +
            '<li>若它在 \\( x_1 \\) 处发散，则对一切满足 \\( |x|>|x_1| \\) 的 \\( x \\)，它<b>发散</b>。</li>' +
            '</ul>' +
            '<p class="tight">推论：存在唯一的 \\( R\\in[0,+\\infty] \\)（<b>收敛半径</b>），使 \\( |x|<R \\) 时绝对收敛，\\( |x|>R \\) 时发散；\\( x=\\pm R \\) 处敛散性需单独判定。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>收敛半径公式：</b>\\( R=\\lim\\limits_{n\\to\\infty}\\left|\\dfrac{a_n}{a_{n+1}}\\right| \\)（当极限存在时），或 \\( R=\\dfrac{1}{\\limsup\\limits_{n\\to\\infty}\\sqrt[n]{|a_n|}} \\)。</div>' +
            '<div class="fml-row">三种情形：\\( R=0 \\)：只在 \\( x=0 \\) 收敛；\\( R=+\\infty \\)：对一切 \\( x \\\) 收敛；\\( 0<R<+\\infty \\)：在 \\( (-R,R) \\) 内绝对收敛。</div>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '收敛区间 ≠ 收敛域', html:
            '<p class="tight"><b>收敛区间</b>指开区间 \\( (-R,R) \\)；<b>收敛域</b> = 收敛区间 ∪ 收敛的端点。端点处的敛散性必须把 \\( x=\\pm R \\) 代入原级数化为数项级数后单独判断，这是考试最容易漏掉的一步。</p>'
          },
          { t: 'h3', idx: '③', text: '求收敛半径与收敛域的步骤' },
          { t: 'list', items: [
            '用比值法或根值法（或收敛半径公式）求出 \\( R \\)；',
            '写出开区间 \\( (-R,R) \\)；',
            '把 \\( x=R \\) 与 \\( x=-R \\) 分别代入原级数，化为数项级数，逐个判断敛散性；',
            '把端点中收敛的并入开区间，得到收敛域。'
          ]},
          { t: 'h3', idx: '④', text: '幂级数在收敛区间内的性质' },
          { t: 'card', kind: 'key', tag: '必记', title: '和函数的连续性、逐项求导与逐项积分', html:
            '<p class="tight">设 \\( \\sum\\limits_{n=0}^{\\infty}a_nx^n \\) 的收敛半径为 \\( R>0 \\)，则在 \\( (-R,R) \\) 内：</p>' +
            '<ul class="none">' +
            '<li>和函数 \\( S(x) \\) 连续；</li>' +
            '<li>可逐项求导：\\( S\'(x)=\\sum\\limits_{n=1}^{\\infty}na_nx^{n-1} \\)，且收敛半径仍为 \\( R \\)；</li>' +
            '<li>可逐项积分：\\( \\int_0^xS(t)\\,\\mathrm{d}t=\\sum\\limits_{n=0}^{\\infty}\\dfrac{a_n}{n+1}x^{n+1} \\)，且收敛半径仍为 \\( R \\)。</li>' +
            '</ul>' +
            '<p class="tight"><b>注意：</b>求导、积分后收敛半径不变，但<b>端点处的敛散性可能改变</b>。</p>'
          },
          { t: 'fml', html:
            '<div class="fml-row">\\( S\'(x)=\\left(\\sum_{n=0}^{\\infty}a_nx^n\\right)\'=\\sum_{n=1}^{\\infty}na_nx^{n-1},\\qquad \\int_0^xS(t)\\,\\mathrm{d}t=\\sum_{n=0}^{\\infty}\\dfrac{a_n}{n+1}x^{n+1} \\)</div>'
          },
          { t: 'h3', idx: '⑤', text: '和函数的求法与常用展开式' },
          { t: 'card', kind: 'key', tag: '必记', title: '常用和函数（|x| < 1）', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( \\sum_{n=0}^{\\infty}x^n=\\dfrac{1}{1-x},\\qquad \\sum_{n=0}^{\\infty}(-1)^nx^n=\\dfrac{1}{1+x} \\)</div>' +
            '<div class="fml-row">\\( \\sum_{n=1}^{\\infty}\\dfrac{x^n}{n}=-\\ln(1-x)\\quad(-1\\leqslant x<1) \\)</div>' +
            '<div class="fml-row">\\( \\sum_{n=1}^{\\infty}nx^{n-1}=\\dfrac{1}{(1-x)^2},\\qquad \\sum_{n=1}^{\\infty}n x^n=\\dfrac{x}{(1-x)^2} \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'tip', tag: '方法', title: '求和的两种基本技巧', html:
            '<ul class="none">' +
            '<li><b>先求导后求和</b>：通项中带因子 \\( n \\)（如 \\( \\sum nx^n \\)）时，先逐项求导消去 \\( n \\)，求和后再积分回去；</li>' +
            '<li><b>先积分后求和</b>：通项中带因子 \\( \\dfrac1n,\\dfrac{1}{n+1} \\) 时，先逐项积分，求和后再求导；</li>' +
            '<li>凑标准形：把 \\( \\sum a_n(x-x_0)^n \\) 通过换元 \\( t=x-x_0 \\) 化为 \\( \\sum a_nt^n \\)；</li>' +
            '<li>最后务必写清和函数的定义域（收敛域）。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'powerSeries', title: '幂级数的部分和与收敛区间', sub: '以 Σxⁿ = 1/(1−x) 为例，观察部分和函数在收敛区间内逼近和函数' }
        ],
        examples: [
          {
            no: '例 7.11', meta: '基础 · 求收敛半径与收敛域',
            q: '求幂级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{x^n}{n\\cdot 3^n} \\) 的收敛半径与收敛域。',
            sol: '<p>系数 \\( a_n=\\dfrac{1}{n\\cdot 3^n} \\)，则</p>' +
              '<p>\\( R=\\lim\\limits_{n\\to\\infty}\\left|\\dfrac{a_n}{a_{n+1}}\\right|=\\lim\\limits_{n\\to\\infty}\\dfrac{(n+1)3^{n+1}}{n\\cdot 3^n}=3\\lim\\limits_{n\\to\\infty}\\dfrac{n+1}{n}=3 \\)。</p>' +
              '<p>端点：\\( x=3 \\) 时级数为 \\( \\sum\\dfrac1n \\)，发散；\\( x=-3 \\) 时级数为 \\( \\sum\\dfrac{(-1)^n}{n} \\)，由莱布尼茨判别法收敛。</p>' +
              '<p>故收敛域为 \\( [-3,\\,3) \\)。</p>'
          },
          {
            no: '例 7.12', meta: '综合 · 中心不在原点的幂级数',
            q: '求幂级数 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{(2x+1)^n}{n} \\) 的收敛域。',
            sol: '<p>令 \\( t=2x+1 \\)，级数化为 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{t^n}{n} \\)，其收敛半径为 \\( R=1 \\)：\\( t=1 \\) 时发散（调和级数），\\( t=-1 \\) 时收敛（交错调和级数），故 \\( t\\in[-1,1) \\)。</p>' +
              '<p>由 \\( -1\\leqslant 2x+1<1 \\) 解得 \\( -1\\leqslant x<0 \\)。</p>' +
              '<p>所以原级数的收敛域为 \\( [-1,\\,0) \\)。</p>'
          },
          {
            no: '例 7.13', meta: '拔高 · 和函数与数项级数求和',
            q: '求幂级数 \\( \\sum\\limits_{n=1}^{\\infty}nx^{n-1} \\) 在收敛区间内的和函数，并求 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{n}{2^n} \\)。',
            sol: '<p>当 \\( |x|<1 \\) 时 \\( \\sum\\limits_{n=0}^{\\infty}x^n=\\dfrac{1}{1-x} \\)。两边逐项求导：</p>' +
              '<p>\\( \\sum\\limits_{n=1}^{\\infty}nx^{n-1}=\\left(\\dfrac{1}{1-x}\\right)\'=\\dfrac{1}{(1-x)^2},\\quad |x|<1 \\)。</p>' +
              '<p>于是 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{n}{2^n}=\\sum\\limits_{n=1}^{\\infty}n\\left(\\dfrac12\\right)^{n}=\\dfrac12\\sum\\limits_{n=1}^{\\infty}n\\left(\\dfrac12\\right)^{n-1}=\\dfrac12\\cdot\\dfrac{1}{\\left(1-\\frac12\\right)^2}=2 \\)。</p>'
          }
        ],
        pitfalls: [
          '收敛半径公式 \\( R=\\lim\\left|\\dfrac{a_n}{a_{n+1}}\\right| \\) 适用于标准幂级数 \\( \\sum a_n(x-x_0)^n \\)；像 \\( \\sum x^{2n} \\) 这样的缺项级数必须直接用比值法（或换元）求收敛半径。',
          '求导、积分不改变收敛半径，但端点处的敛散性可能改变，最终收敛域必须对端点重新讨论。',
          '用幂级数求数项级数之和时，先要把该数项级数写成幂级数在某点 \\( x_0 \\) 的取值，并确认 \\( x_0 \\) 落在收敛域内。'
        ]
      },

      /* ---------------- 7.5 ---------------- */
      {
        id: 'ch7-s5', num: '7.5', title: '函数的幂级数展开',
        lead: '大纲要求：了解函数展开为泰勒级数的充分必要条件；掌握 eˣ、sin x、cos x、ln(1+x) 及 (1+x)^α 的麦克劳林展开式，会用它们将一些简单函数间接展开为幂级数。',
        blocks: [
          { t: 'h3', idx: '①', text: '泰勒级数与麦克劳林级数' },
          { t: 'card', kind: 'def', tag: '定义', title: '泰勒级数与麦克劳林级数', html:
            '<p class="tight">设 \\( f(x) \\) 在 \\( x_0 \\) 的某邻域内具有任意阶导数，称级数 \\( \\sum\\limits_{n=0}^{\\infty}\\dfrac{f^{(n)}(x_0)}{n!}(x-x_0)^n \\) 为 \\( f \\) 在 \\( x_0 \\) 处的<b>泰勒级数</b>；当 \\( x_0=0 \\) 时称为<b>麦克劳林级数</b>。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '展开为泰勒级数的充要条件', html:
            '<p class="tight">由泰勒公式 \\( f(x)=\\sum\\limits_{k=0}^{n}\\dfrac{f^{(k)}(x_0)}{k!}(x-x_0)^k+R_n(x) \\)，有</p>' +
            '<div class="fml">\\( f(x)=\\sum_{n=0}^{\\infty}\\dfrac{f^{(n)}(x_0)}{n!}(x-x_0)^n \\iff \\lim_{n\\to\\infty}R_n(x)=0 \\)</div>' +
            '<p class="tight">其中拉格朗日余项 \\( R_n(x)=\\dfrac{f^{(n+1)}\\big(\\xi\\big)}{(n+1)!}(x-x_0)^{n+1} \\)（\\( \\xi \\) 在 \\( x_0 \\) 与 \\( x \\) 之间）。</p>'
          },
          { t: 'card', kind: 'tip', tag: '实用', title: '系数与高阶导数的互读', html:
            '<p class="tight">若 \\( f(x)=\\sum\\limits_{n=0}^{\\infty}a_nx^n \\)，则 \\( a_n=\\dfrac{f^{(n)}(0)}{n!} \\)，即 \\( f^{(n)}(0)=n!\\,a_n \\)。因此可由展开式反读 \\( f^{(n)}(0) \\)（这是求高阶导数的高效方法）。</p>'
          },
          { t: 'h3', idx: '②', text: '五个必记的麦克劳林展开式' },
          { t: 'card', kind: 'key', tag: '必记', title: '五个基本展开式', html:
            '<div class="fml">' +
            '<div class="fml-row">\\( \\mathrm{e}^{x}=\\sum\\limits_{n=0}^{\\infty}\\dfrac{x^n}{n!}=1+x+\\dfrac{x^2}{2!}+\\cdots,\\qquad -\\infty<x<+\\infty \\)</div>' +
            '<div class="fml-row">\\( \\sin x=\\sum\\limits_{n=0}^{\\infty}\\dfrac{(-1)^n}{(2n+1)!}x^{2n+1}=x-\\dfrac{x^3}{3!}+\\dfrac{x^5}{5!}-\\cdots,\\qquad -\\infty<x<+\\infty \\)</div>' +
            '<div class="fml-row">\\( \\cos x=\\sum\\limits_{n=0}^{\\infty}\\dfrac{(-1)^n}{(2n)!}x^{2n}=1-\\dfrac{x^2}{2!}+\\dfrac{x^4}{4!}-\\cdots,\\qquad -\\infty<x<+\\infty \\)</div>' +
            '<div class="fml-row">\\( \\ln(1+x)=\\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n-1}}{n}x^{n}=x-\\dfrac{x^2}{2}+\\dfrac{x^3}{3}-\\cdots,\\qquad -1<x\\leqslant 1 \\)</div>' +
            '<div class="fml-row">\\( (1+x)^{\\alpha}=1+\\alpha x+\\dfrac{\\alpha(\\alpha-1)}{2!}x^2+\\cdots+\\dfrac{\\alpha(\\alpha-1)\\cdots(\\alpha-n+1)}{n!}x^n+\\cdots,\\qquad |x|<1 \\)</div>' +
            '</div>' +
            '<p class="tight">\\( (1+x)^{\\alpha} \\) 端点处的敛散性与 \\( \\alpha \\) 有关：\\( \\alpha\\leqslant-1 \\) 时收敛域为 \\( (-1,1] \\)；\\( -1<\\alpha<0 \\) 时为 \\( (-1,1] \\)；\\( \\alpha>0 \\) 时为 \\( [-1,1] \\)。</p>'
          },
          { t: 'table', head: ['函数', '麦克劳林展开式', '收敛范围'], rows: [
            ['\\( \\mathrm{e}^x \\)', '\\( \\sum\\dfrac{x^n}{n!} \\)', '\\( (-\\infty,+\\infty) \\)'],
            ['\\( \\sin x \\)', '\\( \\sum\\dfrac{(-1)^nx^{2n+1}}{(2n+1)!} \\)', '\\( (-\\infty,+\\infty) \\)'],
            ['\\( \\cos x \\)', '\\( \\sum\\dfrac{(-1)^nx^{2n}}{(2n)!} \\)', '\\( (-\\infty,+\\infty) \\)'],
            ['\\( \\ln(1+x) \\)', '\\( \\sum\\dfrac{(-1)^{n-1}x^n}{n} \\)', '\\( (-1,1] \\)'],
            ['\\( (1+x)^{\\alpha} \\)', '\\( 1+\\sum\\dfrac{\\alpha(\\alpha-1)\\cdots(\\alpha-n+1)}{n!}x^n \\)', '\\( |x|<1 \\)（端点看 \\( \\alpha \\)）']
          ]},
          { t: 'h3', idx: '③', text: '间接展开法' },
          { t: 'list', items: [
            '<b>变量代换</b>：由 \\( \\mathrm{e}^x \\) 得 \\( \\mathrm{e}^{-x^2}=\\sum\\limits_{n=0}^{\\infty}\\dfrac{(-1)^nx^{2n}}{n!} \\)；由 \\( \\ln(1+x) \\) 得 \\( \\ln(1-2x)=\\sum\\dfrac{(-1)^{n-1}(2x)^n}{n} \\)；',
            '<b>逐项求导</b>：由 \\( \\dfrac{1}{1+x}=\\sum(-1)^nx^n \\) 出发，可求更高阶展开；',
            '<b>逐项积分</b>：\\( \\dfrac{1}{1+x^2}=\\sum(-1)^nx^{2n}\\Rightarrow \\arctan x=\\sum\\limits_{n=0}^{\\infty}\\dfrac{(-1)^n}{2n+1}x^{2n+1},\\ |x|\\leqslant 1 \\)；',
            '<b>部分分式与四则运算</b>：有理函数先拆成 \\( \\dfrac{1}{a\\pm x} \\) 的组合再展开；',
            '<b>待定系数法</b>（了解）：设 \\( f(x)=\\sum a_nx^n \\)，代入微分方程或恒等式比较系数。'
          ]},
          { t: 'table', head: ['函数', '展开式', '收敛范围'], rows: [
            ['\\( \\dfrac{1}{1-x} \\)', '\\( \\sum\\limits_{n=0}^{\\infty}x^n \\)', '\\( (-1,1) \\)'],
            ['\\( \\dfrac{1}{1+x} \\)', '\\( \\sum\\limits_{n=0}^{\\infty}(-1)^nx^n \\)', '\\( (-1,1) \\)'],
            ['\\( -\\ln(1-x) \\)', '\\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{x^n}{n} \\)', '\\( [-1,1) \\)'],
            ['\\( \\arctan x \\)', '\\( \\sum\\limits_{n=0}^{\\infty}\\dfrac{(-1)^n}{2n+1}x^{2n+1} \\)', '\\( [-1,1] \\)'],
            ['\\( \\mathrm{e}^{-x^2} \\)', '\\( \\sum\\limits_{n=0}^{\\infty}\\dfrac{(-1)^n}{n!}x^{2n} \\)', '\\( (-\\infty,+\\infty) \\)']
          ]},
          { t: 'viz', build: 'taylorApprox', title: '泰勒多项式的逼近效果', sub: '切换 sin x、eˣ、ln(1+x)，增大展开阶数观察逼近范围与收敛半径的关系' }
        ],
        examples: [
          {
            no: '例 7.14', meta: '综合 · 有理函数的展开',
            q: '将函数 \\( f(x)=\\dfrac{1}{x^2-3x+2} \\) 展开为 \\( x \\) 的幂级数。',
            sol: '<p>先作部分分式分解：\\( f(x)=\\dfrac{1}{(x-1)(x-2)}=\\dfrac{1}{1-x}-\\dfrac{1}{2-x} \\)。</p>' +
              '<p>由 \\( \\dfrac{1}{1-x}=\\sum\\limits_{n=0}^{\\infty}x^n\\ (|x|<1) \\)，以及 \\( \\dfrac{1}{2-x}=\\dfrac12\\cdot\\dfrac{1}{1-\\frac x2}=\\sum\\limits_{n=0}^{\\infty}\\dfrac{x^n}{2^{n+1}}\\ (|x|<2) \\)，</p>' +
              '<p>得 \\( f(x)=\\sum\\limits_{n=0}^{\\infty}\\left(1-\\dfrac{1}{2^{n+1}}\\right)x^n,\\qquad |x|<1 \\)（受 \\( x=1 \\) 处奇点限制）。</p>'
          },
          {
            no: '例 7.15', meta: '综合 · 逐项积分法',
            q: '将 \\( f(x)=\\arctan x \\) 展开成麦克劳林级数，并由此求出 \\( 1-\\dfrac13+\\dfrac15-\\dfrac17+\\cdots \\) 的和。',
            sol: '<p>因为 \\( f\'(x)=\\dfrac{1}{1+x^2}=\\sum\\limits_{n=0}^{\\infty}(-1)^nx^{2n}\\ (|x|<1) \\)，从 \\( 0 \\) 到 \\( x \\) 逐项积分：</p>' +
              '<p>\\( \\arctan x=\\sum\\limits_{n=0}^{\\infty}\\dfrac{(-1)^n}{2n+1}x^{2n+1},\\qquad |x|<1 \\)。</p>' +
              '<p>在 \\( x=\\pm 1 \\) 处，右端为莱布尼茨型交错级数，收敛；由和函数的连续性，展开式在 \\( [-1,1] \\) 上成立。</p>' +
              '<p>取 \\( x=1 \\)：\\( \\dfrac{\\pi}{4}=1-\\dfrac13+\\dfrac15-\\dfrac17+\\cdots \\)，即所求级数的和为 \\( \\dfrac{\\pi}{4} \\)。</p>'
          },
          {
            no: '例 7.16', meta: '应用 · 用展开式求极限',
            q: '利用麦克劳林展开式求 \\( \\lim\\limits_{x\\to 0}\\dfrac{x-\\sin x}{x^3} \\)。',
            sol: '<p>\\( \\sin x=x-\\dfrac{x^3}{3!}+\\dfrac{x^5}{5!}-\\cdots \\)，故</p>' +
              '<p>\\( x-\\sin x=\\dfrac{x^3}{6}-\\dfrac{x^5}{120}+\\cdots \\)。</p>' +
              '<p>于是 \\( \\lim\\limits_{x\\to 0}\\dfrac{x-\\sin x}{x^3}=\\lim\\limits_{x\\to 0}\\left(\\dfrac16-\\dfrac{x^2}{120}+\\cdots\\right)=\\dfrac16 \\)。</p>'
          }
        ],
        pitfalls: [
          '直接展开（逐阶求导再代入）计算量极大，考试以间接展开为主；但每一步都要检查所用展开式的成立范围。',
          '\\( \\ln(1+x) \\) 的展开区间是 \\( -1<x\\leqslant 1 \\)（\\( x=-1 \\) 处发散）；\\( (1+x)^{\\alpha} \\) 的端点必须按 \\( \\alpha \\) 单独讨论，不能一概写成 \\( |x|<1 \\)。',
          '用展开式求极限时，展开阶数必须与分母同阶或更高；阶数不够会错误地消去主部（如例 7.16 若只展开到 \\( x \\) 会得到 0）。',
          '变量代换时新变量的范围要同步变形：如由 \\( \\dfrac{1}{1-x} \\) 展开 \\( \\dfrac{1}{2-x} \\) 时，收敛条件是 \\( \\left|\\dfrac x2\\right|<1 \\)。'
        ]
      },

      /* ---------------- 7.6 ---------------- */
      {
        id: 'ch7-s6', num: '7.6', title: '傅里叶级数',
        lead: '大纲要求：了解傅里叶级数的概念和狄利克雷收敛定理，会将定义在 [−l,l] 上的函数展开为傅里叶级数，会将定义在 [0,l] 上的函数展开为正弦级数与余弦级数，会写出傅里叶级数的和函数的表达式。',
        blocks: [
          { t: 'h3', idx: '①', text: '三角函数系的正交性与三角级数' },
          { t: 'p', html: '三角函数系 \\( 1,\\cos x,\\sin x,\\cos 2x,\\sin 2x,\\cdots,\\cos nx,\\sin nx,\\cdots \\) 在 \\( [-\\pi,\\pi] \\) 上具有<b>正交性</b>：' },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\int_{-\\pi}^{\\pi}\\cos nx\\,\\mathrm{d}x=0,\\qquad \\int_{-\\pi}^{\\pi}\\sin nx\\,\\mathrm{d}x=0\\quad(n=1,2,\\cdots) \\)</div>' +
            '<div class="fml-row">\\( \\int_{-\\pi}^{\\pi}\\sin mx\\cos nx\\,\\mathrm{d}x=0\\quad(\\text{任意 } m,n) \\)</div>' +
            '<div class="fml-row">\\( \\int_{-\\pi}^{\\pi}\\cos mx\\cos nx\\,\\mathrm{d}x=\\begin{cases}0,&m\\neq n\\\\ \\pi,&m=n\\geqslant 1\\end{cases},\\qquad \\int_{-\\pi}^{\\pi}\\sin mx\\sin nx\\,\\mathrm{d}x=\\begin{cases}0,&m\\neq n\\\\ \\pi,&m=n\\geqslant 1\\end{cases} \\)</div>'
          },
          { t: 'card', kind: 'def', tag: '定义', title: '三角级数', html:
            '<p class="tight">形如 \\( \\dfrac{a_0}{2}+\\sum\\limits_{n=1}^{\\infty}\\left(a_n\\cos nx+b_n\\sin nx\\right) \\) 的级数称为三角级数。</p>'
          },
          { t: 'h3', idx: '②', text: '傅里叶系数与傅里叶级数（周期 2π）' },
          { t: 'fml', html:
            '<div class="fml-row"><b>傅里叶系数：</b>\\( a_n=\\dfrac1{\\pi}\\int_{-\\pi}^{\\pi}f(x)\\cos nx\\,\\mathrm{d}x\\quad(n=0,1,2,\\cdots),\\) \\( b_n=\\dfrac1{\\pi}\\int_{-\\pi}^{\\pi}f(x)\\sin nx\\,\\mathrm{d}x\\quad(n=1,2,\\cdots) \\)</div>' +
            '<div class="fml-row"><b>傅里叶级数：</b>\\( f(x)\\sim\\dfrac{a_0}{2}+\\sum\\limits_{n=1}^{\\infty}\\left(a_n\\cos nx+b_n\\sin nx\\right) \\)</div>'
          },
          { t: 'card', kind: 'tip', tag: '注意', title: '“~”的含义', html:
            '<p class="tight">记号“\\( \\sim \\)”只表示“由上述公式形式地写出的级数”，并不表示等号成立；只有当 \\( f \\) 满足狄利克雷收敛定理的条件时，才能把“\\( \\sim \\)”写成“\\( = \\)”，并注明等于和函数。</p>'
          },
          { t: 'h3', idx: '③', text: '狄利克雷收敛定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '狄利克雷（Dirichlet）收敛定理', html:
            '<p class="tight">设 \\( f(x) \\) 以 \\( 2\\pi \\) 为周期，且在 \\( [-\\pi,\\pi] \\) 上满足：</p>' +
            '<ul class="none">' +
            '<li>连续或只有有限个第一类间断点；</li>' +
            '<li>至多只有有限个极值点，</li>' +
            '</ul>' +
            '<p class="tight">则 \\( f \\) 的傅里叶级数处处收敛，且其和函数为</p>' +
            '<div class="fml">\\( S(x)=\\dfrac{f(x^-)+f(x^+)}{2} \\)</div>' +
            '<p class="tight">即在连续点处 \\( S(x)=f(x) \\)；在间断点处收敛于左右极限的算术平均；在端点 \\( x=\\pm\\pi \\) 处收敛于 \\( \\dfrac{f(-\\pi^+)+f(\\pi^-)}{2} \\)。</p>'
          },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '傅里叶级数的两类考法', html:
            '<ul class="none">' +
            '<li><b>展开型</b>：求 \\( a_n,b_n \\) 并写出级数与和函数（注意分段写出和函数表达式）；</li>' +
            '<li><b>求值型</b>：在展开式中取某个特殊点 \\( x_0 \\)，把数项级数求和问题化归为 \\( S(x_0) \\) 的值（如由 \\( f(x)=x^2 \\) 求 \\( \\sum\\dfrac{1}{n^2} \\)）。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '④', text: '[−l, l] 上的傅里叶级数（周期 2l）' },
          { t: 'fml', html:
            '<div class="fml-row">\\( a_n=\\dfrac1l\\int_{-l}^{l}f(x)\\cos\\dfrac{n\\pi x}{l}\\,\\mathrm{d}x\\ (n=0,1,2,\\cdots),\\qquad b_n=\\dfrac1l\\int_{-l}^{l}f(x)\\sin\\dfrac{n\\pi x}{l}\\,\\mathrm{d}x\\ (n=1,2,\\cdots) \\)</div>' +
            '<div class="fml-row">\\( f(x)\\sim\\dfrac{a_0}{2}+\\sum\\limits_{n=1}^{\\infty}\\left(a_n\\cos\\dfrac{n\\pi x}{l}+b_n\\sin\\dfrac{n\\pi x}{l}\\right) \\)</div>'
          },
          { t: 'card', kind: 'tip', tag: '记忆', title: '从 2π 到 2l 的推广', html:
            '<p class="tight">把周期 \\( 2\\pi \\) 的公式中所有 \\( x \\) 换成 \\( \\dfrac{\\pi x}{l} \\)，同时把积分区间 \\( [-\\pi,\\pi] \\) 换成 \\( [-l,l] \\)、系数前的 \\( \\dfrac1{\\pi} \\) 换成 \\( \\dfrac1l \\)，即得周期 \\( 2l \\) 的公式。作代换 \\( t=\\dfrac{\\pi x}{l} \\) 即可严格验证。</p>'
          },
          { t: 'h3', idx: '⑤', text: '[0, l] 上的正弦级数与余弦级数' },
          { t: 'table', head: ['延拓方式', '级数形式', '系数公式'], rows: [
            ['奇延拓（正弦级数）', '\\( f(x)\\sim\\sum\\limits_{n=1}^{\\infty}b_n\\sin\\dfrac{n\\pi x}{l} \\)', '\\( b_n=\\dfrac2l\\int_0^{l}f(x)\\sin\\dfrac{n\\pi x}{l}\\,\\mathrm{d}x \\)'],
            ['偶延拓（余弦级数）', '\\( f(x)\\sim\\dfrac{a_0}{2}+\\sum\\limits_{n=1}^{\\infty}a_n\\cos\\dfrac{n\\pi x}{l} \\)', '\\( a_n=\\dfrac2l\\int_0^{l}f(x)\\cos\\dfrac{n\\pi x}{l}\\,\\mathrm{d}x \\)']
          ]},
          { t: 'card', kind: 'warn', tag: '易错', title: '延拓后的端点行为', html:
            '<p class="tight">奇延拓在 \\( x=0 \\)（当 \\( f(0)\\neq 0 \\) 时）会产生跳跃间断，正弦级数在 \\( x=0 \\) 与 \\( x=l \\) 处收敛于 0；偶延拓保持连续，余弦级数在端点处收敛于 \\( f(l) \\)（当 \\( f \\) 在 \\( [0,l] \\) 上连续时）。写和函数时要分段说明。</p>'
          },
          { t: 'viz', build: 'fourierSeries', title: '傅里叶级数的逼近与吉布斯现象', sub: '切换方波与锯齿波，增大谐波数 N 观察逼近效果与间断点附近的过冲' }
        ],
        examples: [
          {
            no: '例 7.17', meta: '基础 · 奇函数展开',
            q: '设 \\( f(x) \\) 以 \\( 2\\pi \\) 为周期，且 \\( f(x)=x\\ (-\\pi<x<\\pi) \\)。求其傅里叶级数，并写出和函数在 \\( [-\\pi,\\pi] \\) 上的表达式。',
            sol: '<p>\\( f \\) 为奇函数，故 \\( a_n=0\\ (n=0,1,2,\\cdots) \\)。</p>' +
              '<p>\\( b_n=\\dfrac1{\\pi}\\int_{-\\pi}^{\\pi}x\\sin nx\\,\\mathrm{d}x=\\dfrac2{\\pi}\\int_0^{\\pi}x\\sin nx\\,\\mathrm{d}x=\\dfrac2{\\pi}\\cdot\\dfrac{\\pi(-1)^{n+1}}{n}=\\dfrac{2(-1)^{n+1}}{n} \\)。</p>' +
              '<p>所以 \\( f(x)\\sim 2\\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n+1}}{n}\\sin nx \\)。和函数：\\( S(x)=x\\ (x\\in(-\\pi,\\pi)),\\) \\( S(\\pm\\pi)=0 \\)，且以 \\( 2\\pi \\) 为周期。</p>' +
              '<p>取 \\( x=\\dfrac{\\pi}{2} \\)，得 \\( 1-\\dfrac13+\\dfrac15-\\cdots=\\dfrac{\\pi}{4} \\)。</p>'
          },
          {
            no: '例 7.18', meta: '综合 · 偶函数展开与数项级数求和',
            q: '将 \\( f(x)=x^2 \\) 在 \\( [-\\pi,\\pi] \\) 上展开为傅里叶级数，并求 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n^2} \\) 与 \\( \\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n+1}}{n^2} \\)。',
            sol: '<p>\\( f \\) 为偶函数，故 \\( b_n=0 \\)。</p>' +
              '<p>\\( a_0=\\dfrac2{\\pi}\\int_0^{\\pi}x^2\\,\\mathrm{d}x=\\dfrac{2\\pi^2}{3} \\)；\\( a_n=\\dfrac2{\\pi}\\int_0^{\\pi}x^2\\cos nx\\,\\mathrm{d}x=\\dfrac{4(-1)^n}{n^2}\\ (n\\geqslant 1) \\)。</p>' +
              '<p>于是 \\( x^2=\\dfrac{\\pi^2}{3}+4\\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^n}{n^2}\\cos nx,\\qquad x\\in[-\\pi,\\pi] \\)。</p>' +
              '<p>取 \\( x=\\pi \\)：\\( \\pi^2=\\dfrac{\\pi^2}{3}+4\\sum\\dfrac{1}{n^2} \\Rightarrow \\sum\\limits_{n=1}^{\\infty}\\dfrac{1}{n^2}=\\dfrac{\\pi^2}{6} \\)；</p>' +
              '<p>取 \\( x=0 \\)：\\( 0=\\dfrac{\\pi^2}{3}+4\\sum\\dfrac{(-1)^n}{n^2} \\Rightarrow \\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n+1}}{n^2}=\\dfrac{\\pi^2}{12} \\)。</p>'
          },
          {
            no: '例 7.19', meta: '拔高 · 正弦级数与余弦级数',
            q: '将 \\( f(x)=x \\) 在 \\( [0,\\pi] \\) 上分别展开为正弦级数与余弦级数。',
            sol: '<p><b>正弦级数（奇延拓）：</b>\\( b_n=\\dfrac2{\\pi}\\int_0^{\\pi}x\\sin nx\\,\\mathrm{d}x=\\dfrac{2(-1)^{n+1}}{n} \\)，故</p>' +
              '<p>\\( x\\sim 2\\sum\\limits_{n=1}^{\\infty}\\dfrac{(-1)^{n+1}}{n}\\sin nx,\\qquad x\\in(0,\\pi) \\)。</p>' +
              '<p><b>余弦级数（偶延拓）：</b>\\( a_0=\\dfrac2{\\pi}\\int_0^{\\pi}x\\,\\mathrm{d}x=\\pi \\)，\\( a_n=\\dfrac2{\\pi}\\int_0^{\\pi}x\\cos nx\\,\\mathrm{d}x=\\dfrac{2\\left[(-1)^n-1\\right]}{\\pi n^2}\\ (n\\geqslant 1) \\)，即奇下标为 \\( -\\dfrac{4}{\\pi n^2} \\)、偶下标为 0。</p>' +
              '<p>所以 \\( x=\\dfrac{\\pi}{2}-\\dfrac4{\\pi}\\sum\\limits_{n=1}^{\\infty}\\dfrac{\\cos(2n-1)x}{(2n-1)^2},\\qquad x\\in[0,\\pi] \\)。</p>'
          }
        ],
        pitfalls: [
          '级数首项是 \\( \\dfrac{a_0}{2} \\) 而非 \\( a_0 \\)：用 \\( a_0 \\) 的公式算完后不要忘记除以 2。',
          '利用奇偶性可简化计算：奇函数的 \\( a_n=0 \\)（包括 \\( a_0 \\)），偶函数的 \\( b_n=0 \\)；但前提是积分区间关于原点对称。',
          '狄利克雷定理给出的是和函数：间断点处收敛于左右极限平均；写和函数时要分段写出，并把 \\( x=\\pm\\pi \\) 等端点单独代入验证。',
          '把 \\( [0,l] \\) 上的函数展开为正弦/余弦级数时，系数公式前的因子是 \\( \\dfrac2l \\)（不是 \\( \\dfrac1l \\)），因为积分区间只有半个周期。'
        ]
      }
    ]
  };
})(window);
