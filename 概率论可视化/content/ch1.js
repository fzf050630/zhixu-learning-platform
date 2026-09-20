/* ============================================================
   ch1.js — 第一章 随机事件和概率
   覆盖 2026 大纲「一、随机事件和概率」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';

  global.CH1 = {
    id: 'ch1',
    no: '一',
    title: '随机事件和概率',
    subtitle: '从样本空间出发，建立事件运算 → 概率公理化 → 条件概率 → 独立性 的完整逻辑链',
    tags: ['样本空间', '事件运算', '古典概型', '几何概型', '条件概率', '全概率', '贝叶斯', '独立性', '伯努利概型'],
    sections: [

      /* ================================================================
         1.1 样本空间与随机事件
         ================================================================ */
      {
        id: 'ch1-s1',
        num: '1.1',
        title: '样本空间与随机事件',
        lead: '随机现象的研究从「把试验的所有可能结果收集起来」开始——这个集合就是样本空间。',
        blocks: [
          { t: 'h3', idx: '①', text: '随机试验' },
          { t: 'p', html: '对随机现象进行观察与记录，称为<b>随机试验</b>，记作 <code>E</code>。它须满足三条特征：' },
          { t: 'list', ordered: true, items: [
            '可以在相同条件下<b>重复</b>进行；',
            '每次试验的<b>可能结果不止一个</b>，且能事先明确试验的所有可能结果；',
            '每次试验前<b>不能确定</b>哪一个结果会出现。'
          ]},

          { t: 'h3', idx: '②', text: '样本空间与样本点' },
          { t: 'card', kind: 'def', tag: '定义', title: '样本空间', html:
            '<p class="tight">随机试验 <code>E</code> 的<b>所有可能结果</b>组成的集合称为 <b>样本空间</b>（基本事件空间），记作 <code>Ω</code>。</p>' +
            '<p class="tight">样本空间中的元素，即每一个可能结果，称为 <b>样本点</b>，记作 <code>ω</code>。</p>' +
            '<div class="fml">\\( \\Omega=\\{\\omega\\} \\)</div>'
          },
          { t: 'card', kind: 'def', tag: '定义', title: '随机事件', html:
            '<p class="tight">样本空间 <code>Ω</code> 的<b>子集</b>称为<b>随机事件</b>，简称事件，通常记作 <code>A, B, C, …</code>。</p>' +
            '<ul class="none">' +
            '<li>事件发生 \\( \\Longleftrightarrow \\) 试验结果属于该子集，即 \\( \\omega\\in A \\)；</li>' +
            '<li><b>必然事件</b>：\\( \\Omega \\)（每次试验必然发生）；</li>' +
            '<li><b>不可能事件</b>：\\( \\varnothing \\)（每次试验都不发生）；</li>' +
            '<li><b>基本事件</b>：只含一个样本点的事件 \\( \\{\\omega\\} \\)。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'tip', tag: '本质', title: '关键对应关系', html:
            '<p class="tight">事件是集合，因此<b>事件的运算 = 集合的运算</b>，事件的关系 = 集合的关系。这是本章全部公式的来源。</p>' +
            '<table class="tbl" style="margin:10px 0 0">' +
            '<thead><tr><th>概率语言</th><th>集合语言</th><th>记号</th></tr></thead><tbody>' +
            '<tr><td>必然事件</td><td>全集</td><td>\\( \\Omega \\)</td></tr>' +
            '<tr><td>不可能事件</td><td>空集</td><td>\\( \\varnothing \\)</td></tr>' +
            '<tr><td>事件 A 发生</td><td>\\( \\omega\\in A \\)</td><td>\\( \\omega \\in A \\)</td></tr>' +
            '<tr><td>A 发生则 B 必发生</td><td>A 是 B 的子集</td><td>\\( A\\subset B \\)</td></tr>' +
            '</tbody></table>'
          },
          { t: 'viz', build: 'sampleSpace', title: '样本空间与事件的生成', sub: '选择试验，观察样本点如何组成事件' },
          { t: 'viz', build: 'sampleTree', title: '样本空间枚举树', sub: '切换分步试验，展开每一步的分支并高亮样本点路径' },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '常考形式', html:
            '<p class="tight">本知识点极少单独命题，但它是后续一切内容的语言基础。常见考法：给出文字描述，要求<b>写出样本空间</b>或<b>用事件运算表示给定事件</b>（如「A、B 中至少有一个发生」「A、B 恰有一个发生」）。</p>'
          }
        ],
        examples: [
          {
            no: '例 1.1', meta: '基础 · 写出样本空间',
            q: '写出下列随机试验的样本空间：<br>(1) 连续抛一枚硬币 3 次，记录正反面出现情况；<br>(2) 记录某交换台在 1 分钟内接到的呼叫次数。',
            sol:
              '<p><b>(1)</b> 用 <code>H</code> 表示正面、<code>T</code> 表示反面，则<br>' +
              '\\( \\Omega=\\{HHH,HHT,HTH,THH,HTT,THT,TTH,TTT\\} \\)，共 \\( 2^3=8 \\) 个样本点。</p>' +
              '<p><b>(2)</b> 呼叫次数只能取非负整数，故 \\( \\Omega=\\{0,1,2,3,\\cdots\\} \\)。</p>' +
              '<div class="fml"><span class="fml-note">要点：样本空间由「我们关心什么」决定——同一试验目的不同，样本空间可以不同。</span></div>'
          },
          {
            no: '例 1.2', meta: '基础 · 事件的集合表示',
            q: '设 <code>A</code>、<code>B</code>、<code>C</code> 为三个事件，用它们表示下列事件：<br>(1) A、B、C 中至少有一个发生；(2) A、B、C 都发生；(3) A、B、C 恰有一个发生；(4) A、B、C 中不多于两个发生。',
            sol:
              '<p><b>(1)</b> \\( A\\cup B\\cup C \\)</p>' +
              '<p><b>(2)</b> \\( ABC \\)</p>' +
              '<p><b>(3)</b> \\( A\\bar B\\bar C\\cup \\bar A B\\bar C\\cup \\bar A\\bar B C \\)</p>' +
              '<p><b>(4)</b> 「不多于两个发生」= 「不是三个都发生」= \\( \\overline{ABC} \\)</p>'
          }
        ],
        pitfalls: [
          '<b>必然事件 \\( \\Omega \\) 与不可能事件 \\( \\varnothing \\)</b>是两个特殊的随机事件。',
          '样本点必须是<b>互斥且完备</b>的：任何一次试验必落入且只落入一个样本点。',
          '注意 \\( \\{\\varnothing\\} \\) 与 \\( \\varnothing \\) 的区别：前者含一个元素（是事件），后者不含元素。'
        ]
      },

      /* ================================================================
         1.2 事件的关系与运算
         ================================================================ */
      {
        id: 'ch1-s2',
        num: '1.2',
        title: '事件的关系与运算',
        lead: '大纲要求「掌握事件的关系及运算」——这是本章最核心的基本功，所有概率公式都建立在它之上。',
        blocks: [
          { t: 'h3', idx: '①', text: '六种基本关系' },
          { t: 'table', head: ['关系', '记号', '含义', '概率含义'], rows: [
            ['包含', '\\( A\\subset B \\)', 'A 发生必导致 B 发生', '若 \\( A\\subset B \\)，则 \\( P(A)\\leqslant P(B) \\)'],
            ['相等', '\\( A=B \\)', '\\( A\\subset B \\) 且 \\( B\\subset A \\)', '\\( P(A)=P(B) \\)'],
            ['互不相容', '\\( AB=\\varnothing \\)', 'A、B 不能同时发生（互斥）', '\\( P(AB)=0 \\)'],
            ['对立', '\\( B=\\bar A \\)', '\\( A\\cup B=\\Omega,\\ AB=\\varnothing \\)', '\\( P(A)+P(\\bar A)=1 \\)'],
            ['差', '\\( A-B \\)', 'A 发生而 B 不发生', '\\( P(A-B)=P(A)-P(AB) \\)'],
            ['积', '\\( AB \\) 或 \\( A\\cap B \\)', 'A、B 同时发生', '—']
          ]},
          { t: 'card', kind: 'def', tag: '定义', title: '完备事件组（划分）', html:
            '<p class="tight">若事件组 \\( A_1,A_2,\\cdots,A_n \\) 满足：</p>' +
            '<div class="fml">\\( A_iA_j=\\varnothing\\ (i\\neq j),\\qquad \\bigcup_{i=1}^{n}A_i=\\Omega \\)</div>' +
            '<p class="tight">则称其为<b>完备事件组</b>（也称 \\( \\Omega \\) 的一个划分）。</p>' +
            '<p class="tight">它是全概率公式与贝叶斯公式的<b>前提条件</b>——大纲单独列出这一术语，务必会判断、会构造。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '常用恒等式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>差化积：</b>\\( A-B=A\\bar B=A-AB \\)</div>' +
            '<div class="fml-row"><b>并化互斥：</b>\\( A\\cup B=A\\cup(B-AB)=A\\cup B\\bar A \\)</div>' +
            '<div class="fml-row"><b>补与差：</b>\\( A-B=A-(AB) \\)，且 \\( (A-B)\\cup AB=A \\)，\\( (A-B) \\) 与 \\( AB \\) 互斥</div>' +
            '</div>'
          },
          { t: 'h3', idx: '②', text: '运算律' },
          { t: 'table', head: ['运算律', '表达式'], rows: [
            ['交换律', '\\( A\\cup B=B\\cup A,\\quad AB=BA \\)'],
            ['结合律', '\\( (A\\cup B)\\cup C=A\\cup(B\\cup C),\\quad (AB)C=A(BC) \\)'],
            ['分配律', '\\( A(B\\cup C)=AB\\cup AC,\\quad A\\cup(BC)=(A\\cup B)(A\\cup C) \\)'],
            ['对偶律（德摩根）', '\\( \\overline{A\\cup B}=\\bar A\\bar B,\\qquad \\overline{AB}=\\bar A\\cup\\bar B \\)'],
            ['对偶律推广', '\\( \\overline{\\bigcup_{i=1}^{n}A_i}=\\bigcap_{i=1}^{n}\\bar A_i,\\qquad \\overline{\\bigcap_{i=1}^{n}A_i}=\\bigcup_{i=1}^{n}\\bar A_i \\)']
          ]},
          { t: 'viz', build: 'eventAlgebra', title: '事件运算韦恩图', sub: '点击运算查看阴影区域' },
          { t: 'card', kind: 'warn', tag: '易错', title: '互斥 ≠ 对立', html:
            '<ul class="none">' +
            '<li><b>互不相容</b>只要求不能同时发生：\\( AB=\\varnothing \\)；</li>' +
            '<li><b>对立</b>要求既互斥又完备：\\( AB=\\varnothing \\) 且 \\( A\\cup B=\\Omega \\)。</li>' +
            '</ul>' +
            '<p class="tight" style="margin-top:10px">因此：对立一定互斥，互斥不一定对立。例如掷骰子，\\( A=\\{1\\} \\)、\\( B=\\{2\\} \\) 互斥但不对立（还有 3,4,5,6 的可能）。</p>'
          },
          { t: 'viz', build: 'deMorgan', title: '德摩根律的直观验证', sub: '拖动观察两个等式两侧的阴影是否重合' },
          { t: 'viz', build: 'vennThree', title: '三事件文氏图', sub: '点击并 / 交 / 差与对偶律，高亮对应的集合区域' }
        ],
        examples: [
          {
            no: '例 1.3', meta: '基础 · 化简事件表达式',
            q: '设 <code>A</code>、<code>B</code>、<code>C</code> 为事件，化简 \\( (A\\cup B)(A\\cup \\bar B) \\)。',
            sol:
              '<p>由分配律（逆向）：</p>' +
              '<div class="fml">\\( (A\\cup B)(A\\cup\\bar B)=A\\cup(B\\bar B)=A\\cup\\varnothing=A \\)</div>' +
              '<p><b>直观理解：</b>「A 或 B 发生」且「A 或 B 不发生」，无论 B 是否发生，都必须 A 发生。</p>'
          },
          {
            no: '例 1.4', meta: '真题改编 · 德摩根律应用',
            q: '设 <code>A</code>、<code>B</code> 满足 \\( P(A)=0.5 \\)，\\( P(B)=0.4 \\)，\\( P(AB)=0.2 \\)。求 \\( P(\\bar A\\bar B) \\)。',
            sol:
              '<p>由德摩根律 \\( \\bar A\\bar B=\\overline{A\\cup B} \\)：</p>' +
              '<div class="fml">\\( P(\\bar A\\bar B)=1-P(A\\cup B)=1-[P(A)+P(B)-P(AB)] \\)</div>' +
              '<div class="fml">\\( =1-(0.5+0.4-0.2)=1-0.7=\\mathbf{0.3} \\)</div>' +
              '<p class="fml-note">套路：凡遇「A、B 都不发生」，立刻用德摩根律转成 \\( 1-P(A\\cup B) \\)。</p>'
          }
        ],
        pitfalls: [
          '\\( \\overline{AB}\\neq \\bar A\\bar B \\)！正确是 \\( \\overline{AB}=\\bar A\\cup\\bar B \\)。德摩根律极易记反。',
          '\\( A\\cup B=A+B \\) 只在 \\( A \\)、\\( B \\) 互斥时成立，一般情形必须减去 \\( P(AB) \\)。',
          '\\( A-B \\) 与 \\( B-A \\) 一般不相等，但恒互斥（交集必为空）。'
        ]
      },

      /* ================================================================
         1.3 概率的定义与基本性质
         ================================================================ */
      {
        id: 'ch1-s3',
        num: '1.3',
        title: '概率的定义与基本性质',
        lead: '概率是事件的「测度」：满足三条公理，就能推出全部性质与加法、减法公式。',
        blocks: [
          { t: 'h3', idx: '①', text: '频率与概率' },
          { t: 'p', html: '在相同条件下重复 \\( n \\) 次试验，事件 \\( A \\) 发生 \\( n_A \\) 次，则 <b>频率</b> \\( f_n(A)=\\dfrac{n_A}{n} \\)。频率具有<b>稳定性</b>：随 \\( n \\) 增大，它稳定在某个常数附近，这个常数就是概率的客观背景。' },
          { t: 'card', kind: 'def', tag: '公理化定义', title: '概率的三条公理', html:
            '<p class="tight">设 \\( \\Omega \\) 为样本空间，对每个事件 \\( A \\) 赋予实数 \\( P(A) \\)，若满足：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>非负性：</b>\\( P(A)\\geqslant 0 \\)</div>' +
            '<div class="fml-row"><b>规范性：</b>\\( P(\\Omega)=1 \\)</div>' +
            '<div class="fml-row"><b>可列可加性：</b>若 \\( A_1,A_2,\\cdots \\) 两两互斥，则 \\( P\\left(\\bigcup_{i=1}^{\\infty}A_i\\right)=\\sum_{i=1}^{\\infty}P(A_i) \\)</div>' +
            '</div>' +
            '<p class="tight">则称 \\( P(A) \\) 为事件 \\( A \\) 的<b>概率</b>。</p>'
          },
          { t: 'h3', idx: '②', text: '由公理推出的基本性质' },
          { t: 'card', kind: 'thm', tag: '性质', title: '概率的基本性质（大纲要求「掌握」）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1.</b> \\( P(\\varnothing)=0 \\)</div>' +
            '<div class="fml-row"><b>2. 有限可加性：</b>若 \\( A_1,\\cdots,A_n \\) 两两互斥，则 \\( P\\left(\\bigcup_{i=1}^{n}A_i\\right)=\\sum_{i=1}^{n}P(A_i) \\)</div>' +
            '<div class="fml-row"><b>3. 对立事件：</b>\\( P(\\bar A)=1-P(A) \\)</div>' +
            '<div class="fml-row"><b>4. 单调性：</b>若 \\( A\\subset B \\)，则 \\( P(A)\\leqslant P(B) \\)，且 \\( P(B-A)=P(B)-P(A) \\)</div>' +
            '<div class="fml-row"><b>5. 有界性：</b>\\( 0\\leqslant P(A)\\leqslant 1 \\)</div>' +
            '<div class="fml-row"><b>6. 减法公式：</b>\\( P(A-B)=P(A)-P(AB) \\)</div>' +
            '<div class="fml-row"><b>7. 加法公式：</b>\\( P(A\\cup B)=P(A)+P(B)-P(AB) \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '加法公式的三个层次', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>两事件：</b>\\( P(A\\cup B)=P(A)+P(B)-P(AB) \\)</div>' +
            '<div class="fml-row"><b>三事件：</b>\\( P(A\\cup B\\cup C)=P(A)+P(B)+P(C)-P(AB)-P(AC)-P(BC)+P(ABC) \\)</div>' +
            '<div class="fml-row"><b>n 事件（容斥原理）：</b>\\( P\\left(\\bigcup_{i=1}^{n}A_i\\right)=\\sum_{i}P(A_i)-\\sum_{i<j}P(A_iA_j)+\\sum_{i<j<k}P(A_iA_jA_k)-\\cdots+(-1)^{n-1}P(A_1A_2\\cdots A_n) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>记忆法：</b>奇数次项为正，偶数次项为负。</p>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '互斥时的简化', html:
            '<p class="tight">若 \\( A \\)、\\( B \\) <b>互斥</b>（\\( AB=\\varnothing \\)）：</p>' +
            '<div class="fml">\\( P(A\\cup B)=P(A)+P(B) \\)</div>' +
            '<p class="tight">若 \\( A_1,\\cdots,A_n \\) 两两互斥且构成完备事件组：</p>' +
            '<div class="fml">\\( \\sum_{i=1}^{n}P(A_i)=1 \\)</div>'
          },
          { t: 'viz', build: 'additiveFormula', title: '加法公式的面积分解', sub: '拖动调整，验证 P(A∪B)=P(A)+P(B)−P(AB)' },
          { t: 'viz', build: 'probMonotone', title: '概率性质的推演', sub: '在可行范围内拖动 P(A)、P(B)、P(AB)，逐条核对单调性、减法与加法公式' }
        ],
        examples: [
          {
            no: '例 1.5', meta: '基础 · 加法公式',
            q: '已知 \\( P(A)=0.4 \\)，\\( P(B)=0.5 \\)，\\( P(A\\cup B)=0.7 \\)。求 \\( P(AB) \\) 与 \\( P(A-B) \\)。',
            sol:
              '<p>由加法公式：</p>' +
              '<div class="fml">\\( P(AB)=P(A)+P(B)-P(A\\cup B)=0.4+0.5-0.7=\\mathbf{0.2} \\)</div>' +
              '<p>由减法公式：</p>' +
              '<div class="fml">\\( P(A-B)=P(A)-P(AB)=0.4-0.2=\\mathbf{0.2} \\)</div>'
          },
          {
            no: '例 1.6', meta: '真题改编 · 三事件容斥',
            q: '设 \\( P(A)=P(B)=P(C)=\\dfrac14 \\)，\\( P(AB)=P(BC)=0 \\)，\\( P(AC)=\\dfrac18 \\)。求 A、B、C 至少有一个发生的概率。',
            sol:
              '<div class="fml">\\( P(A\\cup B\\cup C)=P(A)+P(B)+P(C)-P(AB)-P(BC)-P(AC)+P(ABC) \\)</div>' +
              '<p>因 \\( ABC\\subset AB \\)，而 \\( P(AB)=0 \\)，故 \\( P(ABC)=0 \\)。代入：</p>' +
              '<div class="fml">\\( =\\frac14+\\frac14+\\frac14-0-0-\\frac18+0=\\frac34-\\frac18=\\mathbf{\\frac58} \\)</div>' +
              '<p class="fml-note">陷阱：不要漏掉 \\( +P(ABC) \\) 项，即使它为零也要写出来再代入。</p>'
          },
          {
            no: '例 1.7', meta: '提高 · 单调性应用',
            q: '设 \\( P(A)=0.6 \\)，\\( P(B)=0.4 \\)。证明：\\( P(AB)\\geqslant 0 \\) 且 \\( P(A\\cup B)\\geqslant 0.6 \\)，并求 \\( P(A\\cup B) \\) 的最小值。',
            sol:
              '<p>由加法公式 \\( P(A\\cup B)=P(A)+P(B)-P(AB)=1-P(AB) \\)。</p>' +
              '<p>由单调性 \\( AB\\subset A \\)，故 \\( P(AB)\\leqslant P(A)=0.6 \\)，于是</p>' +
              '<div class="fml">\\( P(A\\cup B)=1-P(AB)\\geqslant 1-0.6=\\mathbf{0.4} \\)</div>' +
              '<p>又 \\( P(A\\cup B)\\geqslant \\max\\{P(A),P(B)\\}=0.6 \\)。两者取较大者，故最小值为 \\( 0.6 \\)（此时 \\( B\\subset A \\)）。</p>'
          }
        ],
        pitfalls: [
          '\\( P(A\\cup B)=P(A)+P(B) \\) <b>仅当互斥</b>时成立，一般要减 \\( P(AB) \\)。',
          '\\( P(A-B)=P(A)-P(B) \\) 是<b>错误</b>的，正确的是 \\( P(A-B)=P(A)-P(AB) \\)。',
          '\\( P(A)=0 \\) 不意味着 \\( A=\\varnothing \\)（连续型随机变量取单点的概率为 0 却可能发生）。',
          '减法公式中，只有当 \\( B\\subset A \\) 时才有 \\( P(A-B)=P(A)-P(B) \\)。'
        ]
      },

      /* ================================================================
         1.4 古典型概率
         ================================================================ */
      {
        id: 'ch1-s4',
        num: '1.4',
        title: '古典型概率',
        lead: '样本空间有限、每个样本点等可能——此时概率归结为「计数」。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '古典概型', html:
            '<p class="tight">若随机试验满足：</p>' +
            '<ul class="none">' +
            '<li>样本空间只含<b>有限个</b>样本点；</li>' +
            '<li>每个样本点出现的<b>可能性相同</b>。</li>' +
            '</ul>' +
            '<p class="tight" style="margin-top:10px">则称其为<b>古典概型</b>，此时</p>' +
            '<div class="fml">\\( P(A)=\\dfrac{A\\text{ 所含样本点数}}{\\Omega\\text{ 所含样本点总数}}=\\dfrac{k}{n} \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '工具', title: '计数必备：排列与组合', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>排列（有顺序）：</b>\\( A_n^m=\\dfrac{n!}{(n-m)!} \\)</div>' +
            '<div class="fml-row"><b>组合（无顺序）：</b>\\( C_n^m=\\dbinom{n}{m}=\\dfrac{n!}{m!(n-m)!} \\)</div>' +
            '<div class="fml-row"><b>可重复排列：</b>\\( n^m \\)　（m 个位置，每个位置 n 种选择）</div>' +
            '<div class="fml-row"><b>重复组合：</b>\\( \\dbinom{n+m-1}{m} \\)</div>' +
            '<div class="fml-row"><b>分组：</b>n 个不同物体分成 \\( k \\) 组，各组 \\( n_1,\\cdots,n_k \\) 个，则 \\( \\dfrac{n!}{n_1!n_2!\\cdots n_k!} \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'tip', tag: '方法', title: '古典概型解题三步法', html:
            '<ol class="clean">' +
            '<li><b>定样本空间</b>：明确 \\( n \\) 是什么——是「有放回」还是「无放回」？「有序」还是「无序」？</li>' +
            '<li><b>数有利结果</b>：把事件 \\( A \\) 翻译成计数问题，善用分类加法与分步乘法。</li>' +
            '<li><b>作比</b>：\\( P(A)=k/n \\)。<b>关键</b>：\\( n \\) 与 \\( k \\) 的计数口径必须一致！</li>' +
            '</ol>'
          },
          { t: 'viz', build: 'classicalProb', title: '古典概型：摸球实验', sub: '调节参数，对比理论概率与大量模拟频率' },
          { t: 'viz', build: 'samplingModel', title: '放回 / 不放回抽样模型', sub: '切换抽样方式，对比二项与超几何的同一概率与数字特征' },
          { t: 'card', kind: 'exam', tag: '高频', title: '四大经典模型', html:
            '<div class="tbl-wrap" style="margin:10px 0 0"><table class="tbl">' +
            '<thead><tr><th>模型</th><th>问题</th><th>结论</th></tr></thead><tbody>' +
            '<tr><td><b>抽签模型</b></td><td>n 个签中有 m 个「中」，第 k 个人抽中的概率</td><td>\\( \\dfrac{m}{n} \\)，与抽签顺序无关（公平性）</td></tr>' +
            '<tr><td><b>分房模型</b></td><td>n 个人随机住进 N 个房间，指定 n 个不同房间各一人的概率</td><td>\\( \\dfrac{n!}{N^n} \\)</td></tr>' +
            '<tr><td><b>生日问题</b></td><td>n 个人中至少两人生日相同的概率</td><td>\\( 1-\\dfrac{365\\cdot364\\cdots(365-n+1)}{365^n} \\)</td></tr>' +
            '<tr><td><b>配对问题</b></td><td>n 封信随机装入 n 个信封，至少一封装对的概率</td><td>\\( 1-\\sum_{k=0}^{n}\\dfrac{(-1)^k}{k!}\\to 1-e^{-1} \\)</td></tr>' +
            '</tbody></table></div>'
          }
        ],
        examples: [
          {
            no: '例 1.8', meta: '基础 · 无放回摸球',
            q: '袋中有 5 个白球、3 个黑球，从中不放回地任取 3 个球。求：(1) 恰有 2 个白球的概率；(2) 至少 1 个白球的概率。',
            sol:
              '<p>样本点总数（组合口径）：\\( n=\\dbinom{8}{3}=56 \\)。</p>' +
              '<p><b>(1)</b> 恰有 2 白 1 黑：\\( k=\\dbinom{5}{2}\\dbinom{3}{1}=10\\times3=30 \\)，故</p>' +
              '<div class="fml">\\( P=\\dfrac{30}{56}=\\dfrac{15}{28} \\)</div>' +
              '<p><b>(2)</b> 用对立事件「全是黑球」：\\( \\dbinom{3}{3}=1 \\)，故</p>' +
              '<div class="fml">\\( P(\\text{至少 1 白})=1-\\dfrac{1}{56}=\\dfrac{55}{56} \\)</div>' +
              '<p class="fml-note">「至少」类问题优先考虑对立事件，可大幅减少计算量。</p>'
          },
          {
            no: '例 1.9', meta: '真题改编 · 分房模型',
            q: '将 4 个不同的球随机放入 3 个不同的盒子中（每个盒子容纳球数不限）。求：(1) 每个盒子至少 1 个球的概率；(2) 恰有 2 个空盒的概率。',
            sol:
              '<p>样本点总数 \\( n=3^4=81 \\)。</p>' +
              '<p><b>(1)</b> 每个盒子至少 1 球，只能是「2,1,1」型。先选哪个盒子放 2 个：\\( \\dbinom{3}{1} \\)；再选哪 2 个球：\\( \\dbinom{4}{2} \\)；剩下 2 球放入 2 盒：\\( 2! \\)。故</p>' +
              '<div class="fml">\\( k=\\dbinom{3}{1}\\dbinom{4}{2}\\cdot2!=3\\times6\\times2=36,\\quad P=\\dfrac{36}{81}=\\dfrac{4}{9} \\)</div>' +
              '<p><b>(2)</b> 恰有 2 个空盒 = 4 个球全在同一个盒中：选盒子 \\( \\dbinom{3}{1}=3 \\)，故</p>' +
              '<div class="fml">\\( P=\\dfrac{3}{81}=\\dfrac{1}{27} \\)</div>'
          },
          {
            no: '例 1.10', meta: '提高 · 抽签公平性',
            q: '袋中有 <code>a</code> 个白球、<code>b</code> 个黑球，不放回地逐个抽取。证明第 <code>k</code> 次抽到白球的概率与 <code>k</code> 无关。',
            sol:
              '<p>把所有球视为不同（人为标记），则前 \\( k \\) 次抽取的<b>有序</b>结果共 \\( A_{a+b}^{k} \\) 种，等可能。</p>' +
              '<p>第 \\( k \\) 次为白球：该位置有 \\( a \\) 种选择，其余 \\( k-1 \\) 个位置从剩下 \\( a+b-1 \\) 个球中排列，共 \\( A_{a+b-1}^{k-1} \\) 种。故</p>' +
              '<div class="fml">\\( P=\\dfrac{a\\cdot A_{a+b-1}^{k-1}}{A_{a+b}^{k}}=\\dfrac{a\\cdot\\dfrac{(a+b-1)!}{(a+b-k)!}}{\\dfrac{(a+b)!}{(a+b-k)!}}=\\dfrac{a}{a+b} \\)</div>' +
              '<p>与 \\( k \\) 无关，这正是「抽签公平」的本质。</p>'
          }
        ],
        pitfalls: [
          '有放回与无放回、有序与无序——<b>分子分母口径必须统一</b>，混用是最常见错误。',
          '「至少」问题用对立事件；「恰好」问题用分类计数。',
          '分房模型以「人」为样本点（\\( N^n \\)），不要误用组合数。',
          '区分「不同的球」与「相同的球」，前者用 \\( N^n \\)，后者用组合数。'
        ]
      },

      /* ================================================================
         1.5 几何型概率
         ================================================================ */
      {
        id: 'ch1-s5',
        num: '1.5',
        title: '几何型概率',
        lead: '样本空间是一个区域，样本点等可能地落入其中——概率归结为「测度之比」。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '几何概型', html:
            '<p class="tight">若随机试验的样本空间 \\( \\Omega \\) 是某个可度量的区域（长度、面积、体积），且样本点<b>等可能</b>地落入 \\( \\Omega \\) 中任意位置，则</p>' +
            '<div class="fml">\\( P(A)=\\dfrac{m(A)}{m(\\Omega)}=\\dfrac{A\\text{ 的测度}}{\\Omega\\text{ 的测度}} \\)</div>' +
            '<p class="tight">其中 \\( m(\\cdot) \\) 表示长度、面积或体积。</p>'
          },
          { t: 'card', kind: 'tip', tag: '方法', title: '几何概型解题要点', html:
            '<ul class="none">' +
            '<li>把试验结果对应为区域中的点（坐标化）；</li>' +
            '<li>把事件 \\( A \\) 翻译为区域中的<b>子区域</b>；</li>' +
            '<li>计算测度之比。难点在于<b>画出区域</b>与<b>确定边界</b>。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'geometricProb', title: '会面问题：几何概型的经典模型', sub: '拖动时间差，观察可行区域的变化' },
          { t: 'viz', build: 'buffonNeedle', title: '蒲丰投针', sub: '拖动针长与间距，用投针频率估计 π 并观察收敛' },
          { t: 'card', kind: 'exam', tag: '高频', title: '经典模型清单', html:
            '<div class="tbl-wrap" style="margin:10px 0 0"><table class="tbl">' +
            '<thead><tr><th>模型</th><th>描述</th><th>概率</th></tr></thead><tbody>' +
            '<tr><td><b>会面问题</b></td><td>两人在 \\( [0,T] \\) 内独立到达，等待 \\( t \\) 分钟，能会面</td><td>\\( \\dfrac{T^2-(T-t)^2}{T^2} \\)</td></tr>' +
            '<tr><td><b>蒲丰投针</b></td><td>针长 \\( l \\)，平行线间距 \\( a \\)（\\( l<a \\)），针与线相交</td><td>\\( \\dfrac{2l}{\\pi a} \\)</td></tr>' +
            '<tr><td><b>随机取数</b></td><td>在 \\( [0,1] \\) 中随机取两数，和小于 1 的概率</td><td>\\( \\dfrac12 \\)</td></tr>' +
            '<tr><td><b>贝特朗奇论</b></td><td>圆内随机弦长大于内接正三角形边长</td><td>取决于「随机」的定义（1/3、1/2、1/4）</td></tr>' +
            '</tbody></table></div>'
          }
        ],
        examples: [
          {
            no: '例 1.11', meta: '经典 · 会面问题',
            q: '甲、乙两人约定在 \\( [0,60] \\) 分钟内某时刻到达某地，先到者等待 20 分钟后离开。设两人到达时刻相互独立且均匀分布，求两人能会面的概率。',
            sol:
              '<p>设甲、乙到达时刻分别为 \\( x,y \\)，则样本空间为正方形</p>' +
              '<div class="fml">\\( \\Omega=\\{(x,y)\\mid 0\\leqslant x\\leqslant 60,\\ 0\\leqslant y\\leqslant 60\\},\\quad m(\\Omega)=3600 \\)</div>' +
              '<p>能会面等价于 \\( |x-y|\\leqslant 20 \\)，即 \\( y\\geqslant x-20 \\) 且 \\( y\\leqslant x+20 \\)。它是正方形内夹在两条平行线之间的带形，其补集是两个腰长为 40 的等腰直角三角形：</p>' +
              '<div class="fml">\\( m(A)=3600-2\\times\\dfrac{1}{2}\\times40^2=3600-1600=2000 \\)</div>' +
              '<div class="fml">\\( P(A)=\\dfrac{2000}{3600}=\\mathbf{\\dfrac59} \\)</div>'
          },
          {
            no: '例 1.12', meta: '提高 · 蒲丰投针',
            q: '平面上画有间距为 \\( a \\) 的平行线，向平面随机投掷一根长为 \\( l \\)（\\( l<a \\)）的针。求针与某条平行线相交的概率。',
            sol:
              '<p>设针的中点到最近一条平行线的距离为 \\( x\\in[0,a/2] \\)，针与平行线的夹角为 \\( \\theta\\in[0,\\pi/2] \\)。样本空间为矩形，面积 \\( \\dfrac{a}{2}\\cdot\\dfrac{\\pi}{2}=\\dfrac{\\pi a}{4} \\)。</p>' +
              '<p>相交条件为 \\( x\\leqslant\\dfrac{l}{2}\\sin\\theta \\)，该区域面积为</p>' +
              '<div class="fml">\\( \\int_0^{\\pi/2}\\dfrac{l}{2}\\sin\\theta\\,\\mathrm{d}\\theta=\\dfrac{l}{2} \\)</div>' +
              '<div class="fml">\\( P=\\dfrac{l/2}{\\pi a/4}=\\mathbf{\\dfrac{2l}{\\pi a}} \\)</div>' +
              '<p class="fml-note">这正是历史上用随机投针估计 \\( \\pi \\) 的著名方法。</p>'
          }
        ],
        pitfalls: [
          '几何概型中「等可能」必须明确——贝特朗奇论说明不同的随机化方式给出不同答案。',
          '区域的边界是否计入不影响概率（测度为 0），可放心使用开闭区间。',
          '务必先<b>写出 \\( \\Omega \\) 与 \\( A \\) 的解析表达式</b>再画图，避免凭感觉算面积。'
        ]
      },

      /* ================================================================
         1.6 条件概率
         ================================================================ */
      {
        id: 'ch1-s6',
        num: '1.6',
        title: '条件概率',
        lead: '条件概率是「在缩小后的样本空间中重新计算概率」，它是乘法公式、全概率公式与贝叶斯的基石。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '条件概率', html:
            '<p class="tight">设 \\( A \\)、\\( B \\) 为两事件，且 \\( P(A)>0 \\)，则称</p>' +
            '<div class="fml">\\( P(B\\mid A)=\\dfrac{P(AB)}{P(A)} \\)</div>' +
            '<p class="tight">为<b>在事件 A 发生的条件下，事件 B 发生的条件概率</b>。</p>'
          },
          { t: 'card', kind: 'tip', tag: '直观', title: '样本空间收缩', html:
            '<p class="tight">条件概率 \\( P(\\cdot\\mid A) \\) 相当于把样本空间从 \\( \\Omega \\) <b>压缩</b>为 \\( A \\)，并在 \\( A \\) 内按比例重新度量：</p>' +
            '<div class="fml">\\( P(B\\mid A)=\\dfrac{\\text{AB 的测度}}{\\text{A 的测度}} \\)</div>' +
            '<p class="tight">因此 \\( P(\\cdot\\mid A) \\) 本身也满足概率的三条公理。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '条件概率的性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>非负性：</b>\\( P(B\\mid A)\\geqslant 0 \\)</div>' +
            '<div class="fml-row"><b>规范性：</b>\\( P(\\Omega\\mid A)=1 \\)</div>' +
            '<div class="fml-row"><b>可加性：</b>\\( B_1,B_2 \\) 互斥时 \\( P(B_1\\cup B_2\\mid A)=P(B_1\\mid A)+P(B_2\\mid A) \\)</div>' +
            '<div class="fml-row"><b>对立：</b>\\( P(\\bar B\\mid A)=1-P(B\\mid A) \\)</div>' +
            '<div class="fml-row"><b>加法：</b>\\( P(B\\cup C\\mid A)=P(B\\mid A)+P(C\\mid A)-P(BC\\mid A) \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '乘法公式（大纲要求「掌握」）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>两事件：</b>\\( P(AB)=P(A)P(B\\mid A)=P(B)P(A\\mid B)\\quad (P(A)>0) \\)</div>' +
            '<div class="fml-row"><b>三事件：</b>\\( P(ABC)=P(A)P(B\\mid A)P(C\\mid AB) \\)</div>' +
            '<div class="fml-row"><b>n 事件：</b>\\( P(A_1A_2\\cdots A_n)=P(A_1)P(A_2\\mid A_1)P(A_3\\mid A_1A_2)\\cdots P(A_n\\mid A_1\\cdots A_{n-1}) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>使用时机：</b>当「同时发生」可以分解为「一步一步发生」的串联过程时。</p>'
          },
          { t: 'viz', build: 'conditionalProb', title: '条件概率：样本空间收缩', sub: '拖动选择条件事件，观察分母如何改变' },
          { t: 'viz', build: 'conditionalTree', title: '条件概率树', sub: '调节 P(A) 与两个条件概率，核对 P(AB)=P(A)P(B|A) 与全概率分解' }
        ],
        examples: [
          {
            no: '例 1.13', meta: '基础 · 条件概率计算',
            q: '某家庭有两个孩子。已知其中至少有一个是女孩，求两个都是女孩的概率（假设男女等可能）。',
            sol:
              '<p>样本空间 \\( \\Omega=\\{GG,GB,BG,BB\\} \\)，每个样本点概率 \\( 1/4 \\)。</p>' +
              '<p>设 \\( A= \\)「至少一个女孩」\\( =\\{GG,GB,BG\\} \\)，\\( B= \\)「两个都是女孩」\\( =\\{GG\\} \\)。</p>' +
              '<div class="fml">\\( P(B\\mid A)=\\dfrac{P(AB)}{P(A)}=\\dfrac{1/4}{3/4}=\\mathbf{\\dfrac13} \\)</div>' +
              '<p class="fml-note">注意：若条件改为「第一个是女孩」，答案将是 \\( 1/2 \\)——条件不同，样本空间收缩方式不同。</p>'
          },
          {
            no: '例 1.14', meta: '真题改编 · 乘法公式',
            q: '袋中有 5 个白球、3 个黑球。不放回地依次取出 3 个球，求「前两个是白球、第三个是黑球」的概率。',
            sol:
              '<p>设 \\( A_i= \\)「第 \\( i \\) 次取到白球」。所求为 \\( P(A_1A_2\\bar A_3) \\)。由乘法公式：</p>' +
              '<div class="fml">\\( P(A_1A_2\\bar A_3)=P(A_1)P(A_2\\mid A_1)P(\\bar A_3\\mid A_1A_2) \\)</div>' +
              '<div class="fml">\\( =\\dfrac58\\times\\dfrac47\\times\\dfrac36=\\dfrac{5\\times4\\times3}{8\\times7\\times6}=\\dfrac{60}{336}=\\mathbf{\\dfrac{5}{28}} \\)</div>' +
              '<p class="fml-note">与用组合数 \\( \\dfrac{\\binom52\\binom31}{\\binom83}=\\dfrac{30}{56}=\\dfrac{15}{28} \\) 对比：注意本题要求<b>顺序</b>固定，故概率是后者的 \\( \\frac13 \\)（有序化的修正因子）。</p>'
          }
        ],
        pitfalls: [
          '\\( P(B\\mid A) \\) 与 \\( P(A\\mid B) \\) <b>一般不相等</b>，切勿混淆（这正是贝叶斯公式要解决的问题）。',
          '\\( P(B\\mid A) \\) 有意义的前提是 \\( P(A)>0 \\)。',
          '乘法公式使用条件：每一步的条件概率都要在前面积事件已发生的前提下计算。',
          '\\( P(AB)=P(A)P(B) \\) 仅在独立时成立；一般必须用乘法公式。'
        ]
      },

      /* ================================================================
         1.7 全概率公式与贝叶斯公式
         ================================================================ */
      {
        id: 'ch1-s7',
        num: '1.7',
        title: '全概率公式与贝叶斯公式',
        lead: '全概率是「由因推果」（分情况求和），贝叶斯是「由果溯因」（反推后验）——考研概率第一高频考点。',
        blocks: [
          { t: 'card', kind: 'thm', tag: '定理', title: '全概率公式', html:
            '<p class="tight">设 \\( A_1,A_2,\\cdots,A_n \\) 为完备事件组，且 \\( P(A_i)>0 \\)，则对任意事件 \\( B \\)：</p>' +
            '<div class="fml">\\( P(B)=\\sum_{i=1}^{n}P(A_i)P(B\\mid A_i) \\)</div>' +
            '<p class="tight"><b>逻辑：</b>把 \\( B \\) 按「原因」\\( A_i \\) 分解为互斥的若干块 \\( B A_i \\)，再逐块用乘法公式求和。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '贝叶斯（Bayes）公式', html:
            '<p class="tight">设 \\( A_1,\\cdots,A_n \\) 为完备事件组，\\( P(A_i)>0 \\)，\\( P(B)>0 \\)，则</p>' +
            '<div class="fml">\\( P(A_k\\mid B)=\\dfrac{P(A_kB)}{P(B)}=\\dfrac{P(A_k)P(B\\mid A_k)}{\\displaystyle\\sum_{i=1}^{n}P(A_i)P(B\\mid A_i)} \\)</div>' +
            '<p class="tight">其中 \\( P(A_k) \\) 称为<b>先验概率</b>，\\( P(A_k\\mid B) \\) 称为<b>后验概率</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '辨析', title: '两个公式的分工', html:
            '<table class="tbl" style="margin:0">' +
            '<thead><tr><th>公式</th><th>方向</th><th>已知</th><th>求</th><th>口诀</th></tr></thead><tbody>' +
            '<tr><td>全概率</td><td>因 → 果</td><td>各原因的<br>先验与条件概率</td><td>\\( P(B) \\)</td><td>分情况，加权求和</td></tr>' +
            '<tr><td>贝叶斯</td><td>果 → 因</td><td>\\( P(B) \\) 及各项</td><td>\\( P(A_k\\mid B) \\)</td><td>倒过来，比值计算</td></tr>' +
            '</tbody></table>'
          },
          { t: 'viz', build: 'totalProb', title: '全概率公式：加权分解', sub: '拖动调整各分支概率，观察总概率如何变化' },
          { t: 'viz', build: 'bayes', title: '贝叶斯公式：先验 → 后验', sub: '调节先验与似然，实时观察后验概率的修正' },
          { t: 'viz', build: 'bayesSequential', title: '序贯贝叶斯：证据逐次更新', sub: '拖动连续阳性 / 阴性次数（最多 20 次），观察后验随证据累积的变化曲线' },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>产品检验</b>：多台机床/多条生产线，求次品率（全概率），或已知取到次品反推来自哪条线（贝叶斯）。</li>' +
            '<li><b>疾病检测</b>：患病率低时，阳性结果的后验概率往往远低于直觉（贝叶斯陷阱）。</li>' +
            '<li><b>两阶段抽取</b>：先选盒子/袋子，再取球；先选人，再射击。</li>' +
            '<li><b>信号传输</b>：发送 0/1，信道有误码率，求收到信号后判断原信号。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 1.15', meta: '真题改编 · 全概率 + 贝叶斯',
            q: '某工厂有甲、乙、丙三条生产线，产量分别占 25%、35%、40%，次品率分别为 5%、4%、2%。<br>(1) 从产品中任取一件，求它是次品的概率；<br>(2) 已知取到的是次品，求它来自甲生产线的概率。',
            sol:
              '<p>设 \\( A_1,A_2,A_3 \\) 分别表示产品来自甲、乙、丙，\\( B \\) 表示「是次品」。则 \\( A_i \\) 构成完备事件组。</p>' +
              '<p><b>(1) 全概率公式：</b></p>' +
              '<div class="fml">\\( P(B)=\\sum_{i=1}^{3}P(A_i)P(B\\mid A_i) \\)</div>' +
              '<div class="fml">\\( =0.25\\times0.05+0.35\\times0.04+0.40\\times0.02 \\)</div>' +
              '<div class="fml">\\( =0.0125+0.0140+0.0080=\\mathbf{0.0345} \\)</div>' +
              '<p><b>(2) 贝叶斯公式：</b></p>' +
              '<div class="fml">\\( P(A_1\\mid B)=\\dfrac{P(A_1)P(B\\mid A_1)}{P(B)}=\\dfrac{0.0125}{0.0345}\\approx\\mathbf{0.3623} \\)</div>' +
              '<p class="fml-note">注意：甲的产量占 25%，但在次品中占比约 36%——因为甲次品率最高，贝叶斯「放大了」它的嫌疑。</p>'
          },
          {
            no: '例 1.16', meta: '提高 · 贝叶斯陷阱',
            q: '某疾病的患病率为 0.1%。某检测方法对患者的检出率（灵敏度）为 99%，对健康人的误报率（假阳性）为 1%。若某人检测结果为阳性，求他真正患病的概率。',
            sol:
              '<p>设 \\( A= \\)「患病」，\\( B= \\)「检测阳性」。则 \\( P(A)=0.001 \\)，\\( P(\\bar A)=0.999 \\)，\\( P(B\\mid A)=0.99 \\)，\\( P(B\\mid\\bar A)=0.01 \\)。</p>' +
              '<p>先求阳性总概率：</p>' +
              '<div class="fml">\\( P(B)=0.001\\times0.99+0.999\\times0.01=0.00099+0.00999=0.01098 \\)</div>' +
              '<div class="fml">\\( P(A\\mid B)=\\dfrac{0.00099}{0.01098}\\approx\\mathbf{0.0902} \\)</div>' +
              '<p><b>结论：</b>即使检测「准确率 99%」，阳性者真正患病的概率也只有约 <b>9%</b>。原因在于患病率极低，健康人基数巨大，假阳性数量远超真阳性。这就是贝叶斯公式的反直觉之处，也是高频命题点。</p>'
          },
          {
            no: '例 1.17', meta: '提高 · 两阶段抽取',
            q: '有两个袋子：甲袋有 3 白 2 黑，乙袋有 2 白 3 黑。先随机选一个袋子，再从中随机取一球，发现是白球。求此球来自甲袋的概率。',
            sol:
              '<p>设 \\( A_1= \\)「选甲袋」，\\( A_2= \\)「选乙袋」，\\( B= \\)「取到白球」。\\( P(A_1)=P(A_2)=1/2 \\)，\\( P(B\\mid A_1)=3/5 \\)，\\( P(B\\mid A_2)=2/5 \\)。</p>' +
              '<div class="fml">\\( P(B)=\\dfrac12\\cdot\\dfrac35+\\dfrac12\\cdot\\dfrac25=\\dfrac{3}{10}+\\dfrac{2}{10}=\\dfrac12 \\)</div>' +
              '<div class="fml">\\( P(A_1\\mid B)=\\dfrac{\\frac12\\cdot\\frac35}{\\frac12}=\\dfrac{3}{5} \\)</div>' +
              '<p class="fml-note">直觉检验：甲袋白球比例更高，取到白球后来自甲袋的概率应大于 1/2，\\( 3/5 \\) 合理。</p>'
          }
        ],
        pitfalls: [
          '<b>必须先验证 \\( A_i \\) 构成完备事件组</b>（两两互斥且并为 \\( \\Omega \\)），这是公式使用前提。',
          '贝叶斯公式分母就是全概率 \\( P(B) \\)，忘记计算或算错分母是失分重灾区。',
          '不要混淆 \\( P(B\\mid A_i) \\)（已知原因求结果）与 \\( P(A_i\\mid B) \\)（已知结果求原因）。',
          '全概率公式中 \\( B \\) 必须能被 \\( A_i \\) 完全覆盖：\\( B=\\bigcup_i BA_i \\)。'
        ]
      },

      /* ================================================================
         1.8 事件的独立性
         ================================================================ */
      {
        id: 'ch1-s8',
        num: '1.8',
        title: '事件的独立性',
        lead: '独立性把乘法公式「升级」为 \\( P(AB)=P(A)P(B) \\)，是简化计算的最强工具。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '两事件独立', html:
            '<p class="tight">设 \\( A \\)、\\( B \\) 为两事件，若</p>' +
            '<div class="fml">\\( P(AB)=P(A)P(B) \\)</div>' +
            '<p class="tight">则称 \\( A \\) 与 \\( B \\) <b>相互独立</b>。</p>' +
            '<p class="tight">等价地（当 \\( P(A)>0 \\)）：\\( P(B\\mid A)=P(B) \\)——A 的发生不影响 B 的概率。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '独立性的重要结论', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1.</b> 若 \\( A \\) 与 \\( B \\) 独立，则 \\( \\bar A \\) 与 \\( B \\)、\\( A \\) 与 \\( \\bar B \\)、\\( \\bar A \\) 与 \\( \\bar B \\) 均独立。</div>' +
            '<div class="fml-row"><b>2.</b> \\( P(A)=0 \\) 或 \\( P(A)=1 \\) 时，\\( A \\) 与任意事件独立。</div>' +
            '<div class="fml-row"><b>3.</b> 若 \\( 0<P(A)<1 \\)，则 \\( A \\) 与自身不独立（因为 \\( P(AA)=P(A)\\neq P(A)^2 \\)）。</div>' +
            '</div>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '独立 vs 互斥（重中之重）', html:
            '<table class="tbl" style="margin:0">' +
            '<thead><tr><th></th><th>互不相容（互斥）</th><th>相互独立</th></tr></thead><tbody>' +
            '<tr><td><b>定义</b></td><td>\\( AB=\\varnothing \\)</td><td>\\( P(AB)=P(A)P(B) \\)</td></tr>' +
            '<tr><td><b>直观</b></td><td>A 发生则 B 必不发生</td><td>A 是否发生不影响 B</td></tr>' +
            '<tr><td><b>关系</b></td><td colspan="2" style="text-align:center">两者<b>不是</b>同一层次的概念，不能互推</td></tr>' +
            '<tr><td><b>联系</b></td><td colspan="2">当 \\( P(A)>0,P(B)>0 \\) 时，互斥 \\( \\Rightarrow \\) 不独立（因 \\( P(AB)=0\\neq P(A)P(B) \\)）</td></tr>' +
            '</tbody></table>' +
            '<p class="tight" style="margin-top:10px"><b>记忆：</b>互斥是「不能同时发生」，独立是「互不影响」。若两事件概率均正，互斥恰恰意味着强依赖（一个发生就排除另一个）。</p>'
          },
          { t: 'card', kind: 'def', tag: '定义', title: '三个事件相互独立', html:
            '<p class="tight">称 \\( A,B,C \\) <b>相互独立</b>，若同时满足四个等式：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( P(AB)=P(A)P(B),\\quad P(AC)=P(A)P(C),\\quad P(BC)=P(B)P(C) \\)</div>' +
            '<div class="fml-row">\\( P(ABC)=P(A)P(B)P(C) \\)</div>' +
            '</div>' +
            '<p class="tight">若只满足前三个，称 \\( A,B,C \\) <b>两两独立</b>。注意：<b>两两独立 \\( \\nRightarrow \\) 相互独立</b>！</p>'
          },
          { t: 'viz', build: 'independence', title: '独立性的几何验证', sub: '拖动调整 P(A)、P(B)、P(AB)，观察独立条件何时成立' },
          { t: 'viz', build: 'reliabilitySystem', title: '独立系统可靠性', sub: '切换串联 / 并联 / 混合 / 表决结构，并调节元件数（2–8）对比系统可靠度' },
          { t: 'card', kind: 'tip', tag: '技巧', title: '独立性简化计算', html:
            '<p class="tight">当 \\( A_1,\\cdots,A_n \\) 相互独立时：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>同时发生：</b>\\( P(A_1A_2\\cdots A_n)=\\prod_{i=1}^{n}P(A_i) \\)</div>' +
            '<div class="fml-row"><b>至少一个发生：</b>\\( P\\left(\\bigcup_{i=1}^{n}A_i\\right)=1-\\prod_{i=1}^{n}P(\\bar A_i) \\)</div>' +
            '<div class="fml-row"><b>都不发生：</b>\\( P(\\bar A_1\\bar A_2\\cdots\\bar A_n)=\\prod_{i=1}^{n}P(\\bar A_i) \\)</div>' +
            '</div>' +
            '<p class="tight">「至少一个发生」用对立事件 + 独立性，是最高频的解题套路。</p>'
          }
        ],
        examples: [
          {
            no: '例 1.18', meta: '基础 · 至少一个发生',
            q: '设三次独立射击中，每次命中率为 0.8。求至少命中一次的概率。',
            sol:
              '<p>设 \\( A_i= \\)「第 \\( i \\) 次命中」，\\( A_1,A_2,A_3 \\) 相互独立，\\( P(\\bar A_i)=0.2 \\)。</p>' +
              '<div class="fml">\\( P\\left(\\bigcup_{i=1}^{3}A_i\\right)=1-P(\\bar A_1\\bar A_2\\bar A_3)=1-0.2^3=1-0.008=\\mathbf{0.992} \\)</div>'
          },
          {
            no: '例 1.19', meta: '真题改编 · 两两独立不推相互独立',
            q: '设 \\( P(A)=P(B)=P(C)=\\dfrac12 \\)，\\( P(AB)=P(AC)=P(BC)=\\dfrac14 \\)，\\( P(ABC)=\\dfrac14 \\)。判断 A、B、C 是否两两独立？是否相互独立？',
            sol:
              '<p><b>两两独立：</b>三个等式 \\( P(AB)=P(A)P(B) \\) 等均成立，故两两独立。</p>' +
              '<p><b>相互独立：</b>检验第四个等式</p>' +
              '<div class="fml">\\( P(ABC)=\\dfrac14\\neq P(A)P(B)P(C)=\\dfrac12\\cdot\\dfrac12\\cdot\\dfrac12=\\dfrac18 \\)</div>' +
              '<p>故<b>不相互独立</b>。这说明两两独立只是必要条件，不充分。</p>'
          },
          {
            no: '例 1.20', meta: '提高 · 独立性判定',
            q: '设 \\( 0<P(B)<1 \\)。证明：\\( A \\) 与 \\( B \\) 独立 \\( \\Longleftrightarrow P(A\\mid B)=P(A\\mid\\bar B) \\)。',
            sol:
              '<p><b>必要性：</b>若 \\( A \\) 与 \\( B \\) 独立，则 \\( A \\) 与 \\( \\bar B \\) 也独立，故</p>' +
              '<div class="fml">\\( P(A\\mid B)=P(A)=P(A\\mid\\bar B) \\)</div>' +
              '<p><b>充分性：</b>设 \\( P(A\\mid B)=P(A\\mid\\bar B)=p \\)。由全概率公式</p>' +
              '<div class="fml">\\( P(A)=P(A\\mid B)P(B)+P(A\\mid\\bar B)P(\\bar B)=p[P(B)+P(\\bar B)]=p \\)</div>' +
              '<p>于是 \\( P(A\\mid B)=P(A) \\)，即 \\( P(AB)=P(A)P(B) \\)，独立性成立。</p>' +
              '<p class="fml-note">这个等价条件给出了独立性的直观含义：无论 B 发生与否，A 的概率都不变。</p>'
          }
        ],
        pitfalls: [
          '<b>互斥与独立不能混淆</b>，也不能由互斥推独立。',
          '两两独立 \\( \\nRightarrow \\) 相互独立；相互独立 \\( \\Rightarrow \\) 两两独立。',
          '\\( P(AB)=P(A)P(B) \\) 是定义式，不能由「A、B 看起来无关」直接使用。',
          '独立性的结论对补事件保持：\\( A\\perp B \\Rightarrow \\bar A\\perp B,\\ A\\perp\\bar B,\\ \\bar A\\perp\\bar B \\)。'
        ]
      },

      /* ================================================================
         1.9 独立重复试验与伯努利概型
         ================================================================ */
      {
        id: 'ch1-s9',
        num: '1.9',
        title: '独立重复试验与伯努利概型',
        lead: '把独立性用到极致：n 次独立重复试验中「成功 k 次」的概率——直接通向第二章的二项分布。',
        blocks: [
          { t: 'card', kind: 'def', tag: '定义', title: '伯努利试验与 n 重伯努利试验', html:
            '<p class="tight"><b>伯努利（Bernoulli）试验</b>：只有两个可能结果（成功 A 与失败 \\( \\bar A \\)）的试验，记 \\( P(A)=p \\)。</p>' +
            '<p class="tight"><b>n 重伯努利试验</b>：把伯努利试验<b>独立重复</b>进行 \\( n \\) 次。它满足：</p>' +
            '<ul class="none">' +
            '<li>每次试验只有两个结果 \\( A \\) 与 \\( \\bar A \\)；</li>' +
            '<li>各次试验<b>相互独立</b>；</li>' +
            '<li>每次试验中 \\( P(A)=p \\) <b>保持不变</b>。</li>' +
            '</ul>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '伯努利概型公式', html:
            '<p class="tight">在 \\( n \\) 重伯努利试验中，事件 \\( A \\) 恰好发生 \\( k \\) 次的概率为</p>' +
            '<div class="fml">\\( P_n(k)=\\dbinom{n}{k}p^k(1-p)^{n-k},\\qquad k=0,1,2,\\cdots,n \\)</div>' +
            '<p class="tight"><b>推导思路：</b>某个指定顺序（如前 k 次成功）的概率为 \\( p^k(1-p)^{n-k} \\)；共有 \\( \\dbinom{n}{k} \\) 种顺序，由独立性逐项相加。</p>'
          },
          { t: 'card', kind: 'key', tag: '衔接', title: '通向第二章', html:
            '<p class="tight">若令 \\( X \\) 表示 \\( n \\) 次试验中 \\( A \\) 发生的次数，则</p>' +
            '<div class="fml">\\( P\\{X=k\\}=\\dbinom{n}{k}p^k(1-p)^{n-k} \\)</div>' +
            '<p class="tight">这正是<b>二项分布 \\( B(n,p) \\)</b> 的分布律。因此本章 1.9 节是第二章 2.3 节的直接铺垫——两章在此处无缝衔接。</p>'
          },
          { t: 'viz', build: 'bernoulli', title: 'n 重伯努利试验模拟', sub: '调节 n 与 p，观察频率向理论概率收敛' },
          { t: 'card', kind: 'tip', tag: '结论', title: '常用结论', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>至少成功一次：</b>\\( P_n(k\\geqslant 1)=1-(1-p)^n \\)</div>' +
            '<div class="fml-row"><b>全部成功：</b>\\( P_n(n)=p^n \\)</div>' +
            '<div class="fml-row"><b>全部失败：</b>\\( P_n(0)=(1-p)^n \\)</div>' +
            '<div class="fml-row"><b>归一性：</b>\\( \\sum_{k=0}^{n}P_n(k)=1 \\)</div>' +
            '</div>' +
            '<p class="tight"><b>「直到首次成功」</b>的试验次数服从几何分布（见 2.3 节），概率 \\( P\\{X=k\\}=(1-p)^{k-1}p \\)。</p>'
          },
          { t: 'viz', build: 'firstSuccess', title: '首次成功模型：等待次数的分布', sub: '拖动 p、显示上限 K 与已失败次数 m（最多 12），核对几何分布频率、期望 1/p 与无记忆性' }
        ],
        examples: [
          {
            no: '例 1.21', meta: '基础 · 伯努利公式',
            q: '某射手每次命中率为 0.8，独立射击 5 次。求：(1) 恰好命中 3 次的概率；(2) 至少命中 4 次的概率。',
            sol:
              '<p><b>(1)</b></p>' +
              '<div class="fml">\\( P_5(3)=\\dbinom{5}{3}(0.8)^3(0.2)^2=10\\times0.512\\times0.04=\\mathbf{0.2048} \\)</div>' +
              '<p><b>(2)</b></p>' +
              '<div class="fml">\\( P_5(4)+P_5(5)=\\dbinom{5}{4}(0.8)^4(0.2)+(0.8)^5 \\)</div>' +
              '<div class="fml">\\( =5\\times0.4096\\times0.2+0.32768=0.4096+0.32768=\\mathbf{0.73728} \\)</div>'
          },
          {
            no: '例 1.22', meta: '真题改编 · 至少一次',
            q: '某试验成功的概率为 0.02。问至少要做多少次独立重复试验，才能保证至少成功一次的概率不小于 0.95？',
            sol:
              '<p>设试验次数为 \\( n \\)，则</p>' +
              '<div class="fml">\\( 1-(1-0.02)^n\\geqslant 0.95\\ \\Longrightarrow\\ 0.98^n\\leqslant 0.05 \\)</div>' +
              '<p>取对数：</p>' +
              '<div class="fml">\\( n\\geqslant\\dfrac{\\ln 0.05}{\\ln 0.98}=\\dfrac{-2.9957}{-0.0202}\\approx 148.3 \\)</div>' +
              '<p>故至少需要 <b>149</b> 次。</p>' +
              '<p class="fml-note">注意「至少」要向上取整。</p>'
          }
        ],
        pitfalls: [
          '必须满足「独立 + 概率不变」，否则不能套用伯努利公式。',
          '「恰好 k 次」用 \\( \\binom{n}{k} \\)；「前 k 次成功」没有组合系数。',
          '「至少 k 次」通常用对立事件或累加 \\( \\sum_{j\\geqslant k}P_n(j) \\)。',
          '求 \\( n \\) 的不等式问题，注意取整方向（「至少」向上取整）。'
        ]
      }

    ]
  };

})(window);
