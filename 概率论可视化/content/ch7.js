/* ============================================================
   ch7.js — 第七章 参数估计
   覆盖 2026 大纲「七、参数估计」全部考试内容与考试要求
   大纲原文（OCR 自大纲 p.23–24）：
     考试内容：点估计的概念　估计量与估计值　矩估计法　最大似然估计法
               估计量的评选标准　区间估计的概念　单个正态总体的均值和方
               差的区间估计　两个正态总体的均值差和方差比的区间估计
     考试要求：1. 理解参数的点估计、估计量与估计值的概念；
               2. 掌握矩估计法（一阶矩、二阶矩）和最大似然估计法；
               3. 了解估计量的无偏性、有效性（最小方差性）和一致性（相
                  合性）的概念，并会验证估计量的无偏性；
               4. 理解区间估计的概念，会求单个正态总体的均值和方差的置
                  信区间，会求两个正态总体的均值差和方差比的置信区间．
   ============================================================ */
(function (global) {
  'use strict';

  global.CH7 = {
    id: 'ch7',
    no: '七',
    title: '参数估计',
    subtitle: '用样本给未知参数「定值」用点估计，给未知参数「定范围」用区间估计 —— 这是数理统计最核心的推断任务之一',
    tags: ['点估计', '矩估计法', '最大似然估计', '无偏性', '有效性', '一致性', '置信区间', '单个正态总体', '两个正态总体', '均值差', '方差比'],
    sections: [

      /* ================================================================
         7.1 点估计与矩估计法
         ================================================================ */
      {
        id: 'ch7-s1',
        num: '7.1',
        title: '点估计的概念与矩估计法',
        lead: '点估计就是「用一个数去猜未知参数」。矩估计法的思想极其朴素：样本的矩应当接近总体的矩。',
        blocks: [
          { t: 'h3', idx: '①', text: '点估计的基本概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '估计量与估计值', html:
            '<p class="tight">设总体 \\( X \\) 的分布中含未知参数 \\( \\theta \\)（可以是向量 \\( (\\theta_1,\\cdots,\\theta_k) \\)）。构造一个<b>统计量</b></p>' +
            '<div class="fml">\\( \\hat\\theta=\\hat\\theta(X_1,X_2,\\cdots,X_n) \\)</div>' +
            '<p class="tight">用它来估计 \\( \\theta \\)，则称 \\( \\hat\\theta \\) 为 \\( \\theta \\) 的<b>估计量</b>；代入样本值后得到的具体数值 \\( \\hat\\theta(x_1,\\cdots,x_n) \\) 称为 \\( \\theta \\) 的<b>估计值</b>。</p>' +
            '<p class="tight"><b>区别：</b>估计量是<b>随机变量</b>（抽样前），估计值是<b>数</b>（抽样后）。考试中常把两者都记作 \\( \\hat\\theta \\)，靠上下文区分。</p>'
          },
          { t: 'h3', idx: '②', text: '矩估计法' },
          { t: 'card', kind: 'thm', tag: '方法', title: '矩估计法的原理：用样本矩「替身」总体矩', html:
            '<p class="tight">由辛钦大数定律，样本矩依概率收敛于总体矩：\\( A_k\\overset{P}{\\longrightarrow}\\mu_k=E(X^k) \\)。因此直观上令</p>' +
            '<div class="fml">\\( A_k=\\mu_k(\\theta)\\qquad(k=1,2,\\cdots) \\)</div>' +
            '<p class="tight">即</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>一阶矩：</b>\\( \\bar X=E(X) \\)</div>' +
            '<div class="fml-row"><b>二阶矩：</b>\\( A_2=\\dfrac1n\\sum_{i=1}^{n}X_i^2=E(X^2) \\)</div>' +
            '</div>' +
            '<p class="tight">有几个未知参数就列几个方程，解出的 \\( \\hat\\theta \\) 即为<b>矩估计量</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '技巧', title: '「一阶 + 二阶」的典型推导', html:
            '<p class="tight">若 \\( E(X),D(X) \\) 形式简单，可先由</p>' +
            '<div class="fml">\\( \\hat E(X)=\\bar X,\\qquad \\widehat{D(X)}=\\dfrac1n\\sum_{i=1}^{n}(X_i-\\bar X)^2=B_2 \\)</div>' +
            '<p class="tight">再反解参数。这比直接用二阶原点矩 \\( A_2 \\) 更快，因为 \\( B_2=A_2-\\bar X^2 \\)。</p>' +
            '<p class="tight"><b>注意：</b>矩估计得到的是 \\( B_2 \\)（分母 \\( n \\)），<b>不是</b> \\( S^2 \\)（分母 \\( n-1 \\)）——矩估计一般不保证无偏性。</p>'
          },
          { t: 'viz', build: 'momentEst', title: '矩估计：让样本矩与理论矩对齐', sub: '选择总体分布，观察 X̄、B₂ 如何被解成参数的估计' }
        ],
        examples: [
          {
            no: '例 7.1', meta: '基础 · 一个参数',
            q: '设总体 \\( X\\sim E(\\lambda) \\)（密度 \\( f(x)=\\lambda e^{-\\lambda x},\\ x>0 \\)），\\( X_1,\\cdots,X_n \\) 为样本。求 \\( \\lambda \\) 的矩估计量。',
            sol:
              '<p>指数分布的期望为 \\( E(X)=\\dfrac1\\lambda \\)，令它等于样本均值：</p>' +
              '<div class="fml">\\( \\bar X=\\dfrac1\\lambda\\quad\\Longrightarrow\\quad \\hat\\lambda_{\\text{矩}}=\\dfrac{1}{\\bar X} \\)</div>'
          },
          {
            no: '例 7.2', meta: '基础 · 两个参数',
            q: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( N(\\mu,\\sigma^2) \\) 的样本。求 \\( \\mu,\\sigma^2 \\) 的矩估计量。',
            sol:
              '<p>正态分布的一阶矩与二阶中心矩就是 \\( \\mu,\\sigma^2 \\)：</p>' +
              '<div class="fml">\\( \\hat\\mu=\\bar X,\\qquad \\hat\\sigma^2=\\dfrac1n\\sum_{i=1}^{n}(X_i-\\bar X)^2=B_2 \\)</div>' +
              '<p class="fml-note">这里 \\( \\hat\\sigma^2 \\) 的<b>分母是 \\( n \\)</b>，与第六章的 \\( S^2 \\)（分母 \\( n-1 \\)）不同。矩估计不要求无偏，因此 \\( E(\\hat\\sigma^2)=\\frac{n-1}{n}\\sigma^2\\neq\\sigma^2 \\)。</p>'
          },
          {
            no: '例 7.3', meta: '真题改编 · 均匀分布',
            q: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( U(a,b) \\) 的样本。求 \\( a,b \\) 的矩估计量。',
            sol:
              '<p>均匀分布：\\( E(X)=\\dfrac{a+b}2,\\qquad D(X)=\\dfrac{(b-a)^2}{12} \\)。令两者分别等于 \\( \\bar X \\) 与 \\( B_2 \\)：</p>' +
              '<div class="fml">\\( \\dfrac{\\hat a+\\hat b}{2}=\\bar X,\\qquad \\dfrac{(\\hat b-\\hat a)^2}{12}=B_2 \\)</div>' +
              '<p>由第二式 \\( \\hat b-\\hat a=\\sqrt{12B_2}=2\\sqrt{3B_2} \\)，联立解得</p>' +
              '<div class="fml">\\( \\hat a=\\bar X-\\sqrt{3B_2},\\qquad \\hat b=\\bar X+\\sqrt{3B_2} \\)</div>' +
              '<p class="fml-note">其中 \\( B_2=\\dfrac1n\\sum(X_i-\\bar X)^2 \\)。注意要取正根（\\( b>a \\)）。</p>'
          },
          {
            no: '例 7.4', meta: '提高 · 泊松分布',
            q: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( P(\\lambda) \\) 的样本。求 \\( \\lambda \\) 的矩估计量，并说明为什么只用一个方程就够。',
            sol:
              '<p>泊松分布只有一个参数，且 \\( E(X)=\\lambda \\)：</p>' +
              '<div class="fml">\\( \\hat\\lambda=\\bar X \\)</div>' +
              '<p>若用二阶矩也能得到同样的结论：\\( E(X^2)=D(X)+[E(X)]^2=\\lambda+\\lambda^2 \\)，令 \\( A_2=\\hat\\lambda+\\hat\\lambda^2 \\)，解方程得 \\( \\hat\\lambda=\\bar X \\)（另一根不合理）。</p>' +
              '<p class="fml-note">这说明矩估计不唯一，通常取形式最简单的那个。考研中「\\( k \\) 个未知参数就用前 \\( k \\) 阶矩」是最稳妥的做法。</p>'
          }
        ],
        pitfalls: [
          '矩估计的方程个数 = 未知参数个数，参数不要漏、方程不要重。',
          '矩估计得到的是 \\( B_2=\\frac1n\\sum(X_i-\\bar X)^2 \\)（分母 \\( n \\)），与最大似然估计一致，但与无偏的 \\( S^2 \\) 不同。',
          '解方程时注意参数的取值范围（如 \\( \\lambda>0,\\ b>a \\)），舍去不合理解。',
          '用二阶原点矩 \\( A_2 \\) 还是二阶中心矩 \\( B_2 \\) 都要回到同一个答案，但计算量差别很大，优先用 \\( B_2 \\)。'
        ]
      },

      /* ================================================================
         7.2 最大似然估计法
         ================================================================ */
      {
        id: 'ch7-s2',
        num: '7.2',
        title: '最大似然估计法',
        lead: '最大似然的思想只有一句话：既然样本已经出现了，那就选那个「让这次结果最可能出现」的参数值。',
        blocks: [
          { t: 'h3', idx: '①', text: '似然函数' },
          { t: 'card', kind: 'def', tag: '定义', title: '似然函数', html:
            '<p class="tight">设总体 \\( X \\) 的分布含未知参数 \\( \\theta \\)，样本 \\( (X_1,\\cdots,X_n) \\) 的联合分布（在观测值处）作为 \\( \\theta \\) 的函数</p>' +
            '<div class="fml">\\( L(\\theta)=\\prod_{i=1}^{n}f(x_i;\\theta)\\quad(\\text{连续型})\\qquad L(\\theta)=\\prod_{i=1}^{n}p(x_i;\\theta)\\quad(\\text{离散型}) \\)</div>' +
            '<p class="tight">称为<b>似然函数</b>。若存在 \\( \\hat\\theta \\) 使得</p>' +
            '<div class="fml">\\( L(\\hat\\theta)=\\max_{\\theta}L(\\theta) \\)</div>' +
            '<p class="tight">则称 \\( \\hat\\theta \\) 为 \\( \\theta \\) 的<b>最大似然估计值</b>，对应的统计量称为<b>最大似然估计量（MLE）</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '流程', title: '求 MLE 的标准三步', html:
            '<ol class="clean">' +
            '<li><b>写似然</b>：\\( L(\\theta)=\\prod_{i=1}^{n}f(x_i;\\theta) \\)，注意定义域的<b>交</b>。</li>' +
            '<li><b>取对数</b>：\\( \\ln L(\\theta)=\\sum_{i=1}^{n}\\ln f(x_i;\\theta) \\)（乘积变求和，便于求导；对数单调，极大点不变）。</li>' +
            '<li><b>求导令零</b>：解似然方程 \\( \\dfrac{\\mathrm{d}\\ln L}{\\mathrm{d}\\theta}=0 \\)；多参数时对每个参数求偏导并联立。</li>' +
            '</ol>' +
            '<p class="tight"><b>特殊情形（不可导）</b>：当似然函数的定义域依赖 \\( \\theta \\)（如 \\( U(0,\\theta) \\)），求导法失效，必须用<b>单调性</b>直接看最大点。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '不变性原理', html:
            '<p class="tight">若 \\( \\hat\\theta \\) 是 \\( \\theta \\) 的最大似然估计，而 \\( g(\\cdot) \\) 是<b>任意</b>函数，则 \\( g(\\hat\\theta) \\) 是 \\( g(\\theta) \\) 的最大似然估计。</p>' +
            '<p class="tight"><b>用途：</b>已知 \\( \\hat\\sigma^2 \\) 后可立刻写出 \\( \\hat\\sigma \\)（标准差）、\\( e^{-\\hat\\lambda} \\)（如 \\( P\\{X=0\\} \\)）等的 MLE，无需重新求导。</p>'
          },
          { t: 'viz', build: 'mle', title: '最大似然：似然函数的峰值在哪', sub: '拖动样本，观察对数似然曲线如何被数据「拉」到峰点' },
          { t: 'viz', build: 'mleLikelihood', title: '最大似然：似然 / 对数似然 / 得分函数', sub: '切换分布与样本量，观察三条曲线的峰与零点的对应' },
          { t: 'card', kind: 'warn', tag: '重点', title: 'MLE 与矩估计的差异（正态方差）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>MLE：</b>\\( \\hat\\sigma^2_{\\text{MLE}}=\\dfrac1n\\sum_{i=1}^{n}(X_i-\\bar X)^2=B_2 \\)（<b>有偏</b>）</div>' +
            '<div class="fml-row"><b>无偏估计：</b>\\( S^2=\\dfrac1{n-1}\\sum_{i=1}^{n}(X_i-\\bar X)^2 \\)（\\( E(S^2)=\\sigma^2 \\)）</div>' +
            '</div>' +
            '<p class="tight">两者在 \\( n \\) 大时几乎相同，但<b>数值不同、性质不同</b>：MLE 有偏但一致；\\( S^2 \\) 无偏。考试中必须按题目要求选择，问 MLE 就写 \\( \\frac1n \\)。</p>'
          }
        ],
        examples: [
          {
            no: '例 7.5', meta: '基础 · 指数分布',
            q: '设总体 \\( X\\sim E(\\lambda) \\)，\\( X_1,\\cdots,X_n \\) 为样本。求 \\( \\lambda \\) 的最大似然估计。',
            sol:
              '<p><b>似然函数：</b></p>' +
              '<div class="fml">\\( L(\\lambda)=\\prod_{i=1}^{n}\\lambda e^{-\\lambda x_i}=\\lambda^n e^{-\\lambda\\sum x_i}\\qquad(x_i>0) \\)</div>' +
              '<p><b>取对数并求导：</b></p>' +
              '<div class="fml">\\( \\ln L=n\\ln\\lambda-\\lambda\\sum_{i=1}^{n}x_i,\\qquad \\dfrac{\\mathrm{d}\\ln L}{\\mathrm{d}\\lambda}=\\dfrac n\\lambda-\\sum_{i=1}^{n}x_i \\)</div>' +
              '<p>令为零：</p>' +
              '<div class="fml">\\( \\dfrac n\\lambda=\\sum x_i=n\\bar x\\quad\\Longrightarrow\\quad \\hat\\lambda=\\dfrac{1}{\\bar X} \\)</div>' +
              '<p class="fml-note">与矩估计结果一致。</p>'
          },
          {
            no: '例 7.6', meta: '真题改编 · 正态分布（两个参数）',
            q: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( N(\\mu,\\sigma^2) \\) 的样本。求 \\( \\mu,\\sigma^2 \\) 的最大似然估计。',
            sol:
              '<p><b>似然：</b></p>' +
              '<div class="fml">\\( L=(2\\pi\\sigma^2)^{-n/2}\\exp\\left\\{-\\dfrac{1}{2\\sigma^2}\\sum_{i=1}^{n}(x_i-\\mu)^2\\right\\} \\)</div>' +
              '<p><b>对数似然：</b></p>' +
              '<div class="fml">\\( \\ln L=-\\dfrac n2\\ln(2\\pi)-\\dfrac n2\\ln\\sigma^2-\\dfrac{1}{2\\sigma^2}\\sum_{i=1}^{n}(x_i-\\mu)^2 \\)</div>' +
              '<p><b>对 \\( \\mu \\) 求偏导：</b></p>' +
              '<div class="fml">\\( \\dfrac{\\partial\\ln L}{\\partial\\mu}=\\dfrac{1}{\\sigma^2}\\sum_{i=1}^{n}(x_i-\\mu)=0\\quad\\Longrightarrow\\quad \\hat\\mu=\\bar X \\)</div>' +
              '<p><b>对 \\( \\sigma^2 \\) 求偏导：</b></p>' +
              '<div class="fml">\\( \\dfrac{\\partial\\ln L}{\\partial\\sigma^2}=-\\dfrac{n}{2\\sigma^2}+\\dfrac{1}{2\\sigma^4}\\sum_{i=1}^{n}(x_i-\\bar x)^2=0\\quad\\Longrightarrow\\quad \\hat\\sigma^2=\\dfrac1n\\sum_{i=1}^{n}(X_i-\\bar X)^2 \\)</div>'
          },
          {
            no: '例 7.7', meta: '提高 · 定义域依赖参数的经典题',
            q: '设总体 \\( X\\sim U(0,\\theta) \\)（\\( \\theta>0 \\)），\\( X_1,\\cdots,X_n \\) 为样本。求 \\( \\theta \\) 的最大似然估计。',
            sol:
              '<p><b>似然函数：</b>\\( f(x;\\theta)=\\dfrac1\\theta\\ (0<x<\\theta) \\)，因此每个 \\( x_i \\) 都必须满足 \\( 0<x_i<\\theta \\)，即 \\( \\theta>x_{(n)}=\\max\\{x_1,\\cdots,x_n\\} \\)：</p>' +
              '<div class="fml">\\( L(\\theta)=\\prod_{i=1}^{n}\\dfrac1\\theta=\\dfrac{1}{\\theta^n},\\qquad \\theta>x_{(n)} \\)</div>' +
              '<p><b>不能用求导法</b>（解出的驻点落在定义域外）。注意到 \\( L(\\theta)=\\theta^{-n} \\) 关于 \\( \\theta \\) 严格<b>递减</b>，故在定义域内取 \\( \\theta \\) 最小者时最大：</p>' +
              '<div class="fml">\\( \\hat\\theta=\\max\\{X_1,X_2,\\cdots,X_n\\}=X_{(n)} \\)</div>' +
              '<p class="fml-note">重要结论：\\( E(X_{(n)})=\\dfrac{n}{n+1}\\theta\\neq\\theta \\)，所以 <b>\\( X_{(n)} \\) 是有偏的</b>（偏小）。无偏修正为 \\( \\dfrac{n+1}{n}X_{(n)} \\)。</p>'
          },
          {
            no: '例 7.8', meta: '提高 · 离散型 + 不变性',
            q: '设总体 \\( X\\sim B(1,p) \\)（0–1 分布），\\( X_1,\\cdots,X_n \\) 为样本，取值中 1 的个数为 \\( k \\)。求 \\( p \\) 的 MLE 及 \\( P\\{X=1\\} \\)、\\( D(X) \\) 的 MLE。',
            sol:
              '<p><b>似然（离散）：</b></p>' +
              '<div class="fml">\\( L(p)=\\prod_{i=1}^{n}p^{x_i}(1-p)^{1-x_i}=p^{k}(1-p)^{n-k} \\)</div>' +
              '<p><b>对数似然与求导：</b></p>' +
              '<div class="fml">\\( \\ln L=k\\ln p+(n-k)\\ln(1-p),\\qquad \\dfrac{\\mathrm{d}\\ln L}{\\mathrm{d}p}=\\dfrac kp-\\dfrac{n-k}{1-p}=0 \\)</div>' +
              '<div class="fml">\\( \\hat p=\\dfrac kn=\\bar X \\)</div>' +
              '<p><b>由不变性原理：</b></p>' +
              '<div class="fml">\\( \\widehat{P\\{X=1\\}}=\\hat p=\\bar X,\\qquad \\widehat{D(X)}=\\hat p(1-\\hat p)=\\bar X(1-\\bar X) \\)</div>'
          }
        ],
        pitfalls: [
          '写似然函数时<b>必须写出定义域</b>（尤其 \\( U(0,\\theta) \\) 型），否则会漏掉 \\( \\theta>\\max x_i \\) 这一关键约束。',
          '求导法失效时要回到「单调性 + 定义域端点」直接判断，这是 \\( U \\) 类题目的唯一正确做法。',
          'MLE 的方差估计分母是 \\( n \\)（有偏），不要写成 \\( n-1 \\)。',
          '多参数时对每个参数求偏导，联立求解；注意偏导数方程组的对称性可以化简。',
          '似然函数里的连乘别写成连加——取完对数之后才是连加。'
        ]
      },

      /* ================================================================
         7.3 估计量的评选标准
         ================================================================ */
      {
        id: 'ch7-s3',
        num: '7.3',
        title: '估计量的评选标准',
        lead: '同一个参数可以有很多估计量，凭什么说一个比另一个好？无偏性管「准不准」，有效性管「稳不稳」，一致性管「样本多了会不会对」。',
        blocks: [
          { t: 'h3', idx: '①', text: '无偏性' },
          { t: 'card', kind: 'def', tag: '定义', title: '无偏估计量', html:
            '<p class="tight">若 \\( E(\\hat\\theta)=\\theta \\) 对一切 \\( \\theta \\) 成立，则称 \\( \\hat\\theta \\) 是 \\( \\theta \\) 的<b>无偏估计量</b>。</p>' +
            '<p class="tight"><b>含义：</b>多次抽样得到的估计值平均起来正好等于参数真值 —— <b>没有系统性偏差</b>（不系统性地偏高或偏低）。</p>'
          },
          { t: 'card', kind: 'key', tag: '常用结论', title: '无偏性速查', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>估计量</th><th>估计对象</th><th>是否无偏</th></tr></thead><tbody>' +
            '<tr><td>\\( \\bar X \\)</td><td>\\( \\mu=E(X) \\)</td><td style="color:var(--green)">无偏（任何总体）</td></tr>' +
            '<tr><td>\\( S^2=\\frac1{n-1}\\sum(X_i-\\bar X)^2 \\)</td><td>\\( \\sigma^2=D(X) \\)</td><td style="color:var(--green)">无偏（任何总体）</td></tr>' +
            '<tr><td>\\( B_2=\\frac1n\\sum(X_i-\\bar X)^2 \\)</td><td>\\( \\sigma^2 \\)</td><td style="color:var(--red)">有偏，\\( E(B_2)=\\frac{n-1}{n}\\sigma^2 \\)</td></tr>' +
            '<tr><td>样本二阶原点矩 \\( A_2=\\frac1n\\sum X_i^2 \\)</td><td>\\( E(X^2) \\)</td><td style="color:var(--green)">无偏</td></tr>' +
            '<tr><td>样本 \\( k \\) 阶原点矩 \\( A_k \\)</td><td>\\( E(X^k) \\)</td><td style="color:var(--green)">无偏</td></tr>' +
            '<tr><td>样本 \\( k \\) 阶中心矩 \\( B_k\\ (k\\geqslant2) \\)</td><td>\\( E[X-E(X)]^k \\)</td><td style="color:var(--red)">一般有偏</td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'h3', idx: '②', text: '有效性与一致性' },
          { t: 'card', kind: 'def', tag: '定义', title: '有效性与一致性', html:
            '<p class="tight"><b>有效性：</b>设 \\( \\hat\\theta_1,\\hat\\theta_2 \\) 都是 \\( \\theta \\) 的无偏估计量。若</p>' +
            '<div class="fml">\\( D(\\hat\\theta_1)<D(\\hat\\theta_2) \\)</div>' +
            '<p class="tight">则称 \\( \\hat\\theta_1 \\) 比 \\( \\hat\\theta_2 \\) <b>更有效</b>。在所有无偏估计中方差最小者称为<b>最小方差无偏估计</b>。</p>' +
            '<p class="tight"><b>一致性（相合性）：</b>若对任意 \\( \\varepsilon>0 \\)，有</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}P\\{|\\hat\\theta_n-\\theta|\\geqslant\\varepsilon\\}=0\\qquad\\text{即}\\ \\ \\hat\\theta_n\\overset{P}{\\longrightarrow}\\theta \\)</div>' +
            '<p class="tight">则称 \\( \\hat\\theta_n \\) 是 \\( \\theta \\) 的<b>一致估计量</b>（相合估计量）。它是「大样本性质」。</p>'
          },
          { t: 'card', kind: 'tip', tag: '辨析', title: '三个标准的分工', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>标准</th><th>回答的问题</th><th>数学表达</th></tr></thead><tbody>' +
            '<tr><td><b>无偏性</b></td><td>平均而言准不准（有无系统偏差）</td><td>\\( E(\\hat\\theta)=\\theta \\)</td></tr>' +
            '<tr><td><b>有效性</b></td><td>在无偏的前提下谁更稳定</td><td>\\( D(\\hat\\theta_1)<D(\\hat\\theta_2) \\)</td></tr>' +
            '<tr><td><b>一致性</b></td><td>样本量增大时能否逼近真值</td><td>\\( \\hat\\theta_n\\overset{P}{\\longrightarrow}\\theta \\)</td></tr>' +
            '</tbody></table></div>' +
            '<p class="tight" style="margin-top:10px"><b>注意：</b>无偏与有效都是「固定 \\( n \\)」的<b>小样本性质</b>，一致性是 <b>\\( n\\to\\infty \\)</b> 的大样本性质；三者<b>不能互相推出</b>。</p>'
          },
          { t: 'viz', build: 'estimatorEval', title: '无偏性与有效性：模拟抽样验证', sub: '反复抽样，比较不同估计量的均值与方差' },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>验证无偏性</b>：算 \\( E(\\hat\\theta) \\)，与 \\( \\theta \\) 比较；若不等，说明偏差来源。</li>' +
            '<li><b>无偏化修正</b>：已知 \\( E(\\hat\\theta)=c\\theta \\)，则 \\( \\hat\\theta/c \\) 无偏。</li>' +
            '<li><b>比较有效性</b>：计算两个无偏估计量的方差，比大小。</li>' +
            '<li><b>判断一致性</b>：用切比雪夫不等式或大数定律证明 \\( \\hat\\theta_n\\overset{P}{\\longrightarrow}\\theta \\)。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 7.9', meta: '基础 · 验证无偏性',
            q: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( N(\\mu,\\sigma^2) \\) 的样本。验证 \\( \\bar X \\) 与 \\( S^2 \\) 分别是 \\( \\mu \\) 与 \\( \\sigma^2 \\) 的无偏估计。',
            sol:
              '<p><b>\\( \\bar X \\)：</b></p>' +
              '<div class="fml">\\( E(\\bar X)=\\dfrac1n\\sum_{i=1}^{n}E(X_i)=\\dfrac1n\\cdot n\\mu=\\mu\\quad\\checkmark \\)</div>' +
              '<p><b>\\( S^2 \\)：</b>由例 6.5 的推导</p>' +
              '<div class="fml">\\( E\\!\\left[\\sum(X_i-\\bar X)^2\\right]=(n-1)\\sigma^2\\quad\\Longrightarrow\\quad E(S^2)=\\sigma^2\\quad\\checkmark \\)</div>'
          },
          {
            no: '例 7.10', meta: '真题改编 · 无偏化修正',
            q: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( U(0,\\theta) \\) 的样本，已知 \\( E(X_{(n)})=\\dfrac{n}{n+1}\\theta \\)（\\( X_{(n)}=\\max X_i \\)）。求 \\( \\theta \\) 的一个无偏估计量。',
            sol:
              '<p>由 \\( E(X_{(n)})=\\dfrac{n}{n+1}\\theta \\) 得</p>' +
              '<div class="fml">\\( E\\!\\left(\\dfrac{n+1}{n}X_{(n)}\\right)=\\dfrac{n+1}{n}\\cdot\\dfrac{n}{n+1}\\theta=\\theta \\)</div>' +
              '<p>故</p>' +
              '<div class="fml">\\( \\tilde\\theta=\\dfrac{n+1}{n}\\max\\{X_1,\\cdots,X_n\\} \\)</div>' +
              '<p>是 \\( \\theta \\) 的无偏估计量。</p>'
          },
          {
            no: '例 7.11', meta: '提高 · 比较有效性',
            q: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( N(\\mu,\\sigma^2) \\) 的样本（\\( n\\geqslant2 \\)）。比较 \\( \\hat\\mu_1=\\bar X \\) 与 \\( \\hat\\mu_2=X_1 \\) 的无偏性与有效性。',
            sol:
              '<p><b>无偏性：</b>两者都有 \\( E(\\bar X)=\\mu,\\ E(X_1)=\\mu \\)，都是无偏的。</p>' +
              '<p><b>有效性：</b></p>' +
              '<div class="fml">\\( D(\\hat\\mu_1)=D(\\bar X)=\\dfrac{\\sigma^2}{n},\\qquad D(\\hat\\mu_2)=D(X_1)=\\sigma^2 \\)</div>' +
              '<p>因为 \\( \\dfrac{\\sigma^2}{n}<\\sigma^2\\ (n\\geqslant2) \\)，故 \\( \\bar X \\) 比 \\( X_1 \\) 更有效。</p>' +
              '<p class="fml-note">直觉：样本均值用上了全部 \\( n \\) 条信息，而单个观测只用了 1 条。这就是为什么「均值」是默认的估计量。</p>'
          },
          {
            no: '例 7.12', meta: '提高 · 证明一致性',
            q: '设 \\( X_1,\\cdots,X_n \\) 独立同分布，\\( E(X_i)=\\mu,\\ D(X_i)=\\sigma^2<\\infty \\)。用切比雪夫不等式证明 \\( \\bar X \\) 是 \\( \\mu \\) 的一致估计量。',
            sol:
              '<p>对任意 \\( \\varepsilon>0 \\)，由切比雪夫不等式：</p>' +
              '<div class="fml">\\( P\\{|\\bar X-\\mu|\\geqslant\\varepsilon\\}\\leqslant\\dfrac{D(\\bar X)}{\\varepsilon^2}=\\dfrac{\\sigma^2}{n\\varepsilon^2}\\xrightarrow[n\\to\\infty]{}0 \\)</div>' +
              '<p>故 \\( \\bar X\\overset{P}{\\longrightarrow}\\mu \\)，即 \\( \\bar X \\) 是 \\( \\mu \\) 的一致估计量。</p>' +
              '<p class="fml-note">这同时也是辛钦大数定律的一个特例。一致性是「大样本」性质，而无偏性是「小样本」性质，两者互不包含。</p>'
          }
        ],
        pitfalls: [
          '无偏 ≠ 每个估计值都准，而是「平均而言对」；不要与「估计值等于参数」混淆。',
          '\\( E(\\bar X)=\\mu \\) 对<b>任何</b>总体都成立（只要 \\( \\mu \\) 存在），不要求正态。',
          '有效性只在<b>同无偏</b>的两个估计量之间比较才有意义；一个无偏一个有偏，不能直接比方差。',
          '\\( B_2 \\) 有偏但<b>一致</b>；\\( S^2 \\) 无偏也一致 —— 「有偏」不等于「差」。',
          '一致估计量不要求无偏（如 \\( B_2 \\) 有偏但一致），无偏估计量也不一定一致。'
        ]
      },

      /* ================================================================
         7.4 单个正态总体的区间估计
         ================================================================ */
      {
        id: 'ch7-s4',
        num: '7.4',
        title: '单个正态总体的区间估计',
        lead: '点估计给出一个数，区间估计给出一个「可信范围」。它的核心是把「统计量的抽样分布」反解成关于参数的不等式。',
        blocks: [
          { t: 'h3', idx: '①', text: '置信区间的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '置信区间与置信度', html:
            '<p class="tight">设 \\( \\theta \\) 是未知参数，\\( \\hat\\theta_1=\\hat\\theta_1(X_1,\\cdots,X_n) \\)、\\( \\hat\\theta_2=\\hat\\theta_2(X_1,\\cdots,X_n) \\) 是两个统计量。若对给定 \\( 0<\\alpha<1 \\)，有</p>' +
            '<div class="fml">\\( P\\{\\hat\\theta_1<\\theta<\\hat\\theta_2\\}=1-\\alpha \\)</div>' +
            '<p class="tight">则称随机区间 \\( (\\hat\\theta_1,\\hat\\theta_2) \\) 为 \\( \\theta \\) 的<b>置信度为 \\( 1-\\alpha \\) 的置信区间</b>，\\( 1-\\alpha \\) 称为<b>置信度</b>（置信水平），\\( \\alpha \\) 称为显著性水平。</p>' +
            '<p class="tight"><b>正确理解：</b>置信度 0.95 说的是「用这套方法<b>重复抽样</b>构造区间，约 95% 的区间能盖住真值」，而<b>不是</b>「参数落在某个具体区间内的概率为 0.95」（参数是常数，没有概率可言）。</p>'
          },
          { t: 'card', kind: 'key', tag: '方法', title: '构造置信区间的通用套路', html:
            '<ol class="clean">' +
            '<li><b>找枢轴量</b>：构造一个含 \\( \\theta \\) 但分布<b>已知且不含其他未知参数</b>的量 \\( G \\)。</li>' +
            '<li><b>定分位数</b>：由 \\( P\\{a<G<b\\}=1-\\alpha \\) 查表定出 \\( a,b \\)（双侧时两侧各 \\( \\alpha/2 \\)）。</li>' +
            '<li><b>反解</b>：把不等式 \\( a<G<b \\) 等价变形为 \\( \\hat\\theta_1<\\theta<\\hat\\theta_2 \\)。</li>' +
            '</ol>'
          },
          { t: 'h3', idx: '②', text: '均值 μ 的置信区间' },
          { t: 'card', kind: 'thm', tag: '公式', title: 'μ 的置信区间（置信度 1−α）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>① \\( \\sigma^2 \\) 已知：</b>\\( \\left(\\bar X\\pm u_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt n}\\right) \\)，枢轴量 \\( \\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n}\\sim N(0,1) \\)</div>' +
            '<div class="fml-row"><b>② \\( \\sigma^2 \\) 未知：</b>\\( \\left(\\bar X\\pm t_{\\alpha/2}(n-1)\\dfrac{S}{\\sqrt n}\\right) \\)，枢轴量 \\( \\dfrac{\\bar X-\\mu}{S/\\sqrt n}\\sim t(n-1) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>为什么未知时用 \\( t \\)：</b>把 \\( \\sigma \\) 换成 \\( S \\) 引入了额外的随机性，分布由 \\( N(0,1) \\) 变成尾部更厚的 \\( t(n-1) \\)，于是区间<b>更宽</b>（更保守）。</p>'
          },
          { t: 'card', kind: 'tip', tag: '要点', title: '影响区间长度的三个因素', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 样本量 \\( n \\)：</b>\\( n \\) 越大，\\( \\sigma/\\sqrt n \\) 越小，区间越<b>窄</b>（精度越高）</div>' +
            '<div class="fml-row"><b>2. 置信度 \\( 1-\\alpha \\)：</b>要求越高（\\( \\alpha \\) 越小），分位数越大，区间越<b>宽</b>（越保险越模糊）</div>' +
            '<div class="fml-row"><b>3. 总体波动 \\( \\sigma \\)：</b>数据越分散，区间越<b>宽</b></div>' +
            '</div>' +
            '<p class="tight"><b>工程含义：</b>「精度」与「把握」是一对矛盾；要同时做到「窄」且「准」，唯一办法是加大样本量，且 \\( n \\) 需按 \\( 1/\\sqrt n \\) 的量级增长。</p>'
          },
          { t: 'viz', build: 'ciMean', title: '均值的置信区间：覆盖率的直观验证', sub: '重复抽样构造区间，看有多少条盖住了真值 μ' },
          { t: 'h3', idx: '③', text: '方差 σ² 的置信区间' },
          { t: 'card', kind: 'thm', tag: '公式', title: 'σ² 的置信区间（μ 未知）', html:
            '<p class="tight">枢轴量 \\( \\dfrac{(n-1)S^2}{\\sigma^2}\\sim\\chi^2(n-1) \\)，由</p>' +
            '<div class="fml">\\( P\\left\\{\\chi^2_{1-\\alpha/2}(n-1)<\\dfrac{(n-1)S^2}{\\sigma^2}<\\chi^2_{\\alpha/2}(n-1)\\right\\}=1-\\alpha \\)</div>' +
            '<p class="tight">反解得</p>' +
            '<div class="fml">\\( \\left(\\dfrac{(n-1)S^2}{\\chi^2_{\\alpha/2}(n-1)},\\ \\ \\dfrac{(n-1)S^2}{\\chi^2_{1-\\alpha/2}(n-1)}\\right) \\)</div>' +
            '<p class="tight"><b>注意不等号方向：</b>左分位数 \\( \\chi^2_{1-\\alpha/2} \\) 数值<b>小</b>，做分母时给出<b>上</b>界；右分位数 \\( \\chi^2_{\\alpha/2} \\) 数值<b>大</b>，做分母时给出<b>下</b>界。记成「<b>大除小、小除大</b>」不易出错。</p>' +
            '<p class="tight"><b>若 \\( \\mu \\) 已知</b>，改用 \\( \\dfrac{\\sum(X_i-\\mu)^2}{\\sigma^2}\\sim\\chi^2(n) \\)，自由度为 \\( n \\)。</p>'
          }
        ],
        examples: [
          {
            no: '例 7.13', meta: '基础 · σ 已知',
            q: '某车间生产的零件长度 \\( X\\sim N(\\mu,0.09) \\)（单位：mm）。抽取 16 件，测得 \\( \\bar x=12.4 \\)。求 \\( \\mu \\) 的置信度为 0.95 的置信区间。',
            sol:
              '<p>\\( \\sigma=0.3,\\ n=16,\\ u_{0.025}=1.96 \\)，故</p>' +
              '<div class="fml">\\( u_{\\alpha/2}\\dfrac{\\sigma}{\\sqrt n}=1.96\\times\\dfrac{0.3}{4}=0.147 \\)</div>' +
              '<div class="fml">\\( \\mu\\in(12.4-0.147,\\ 12.4+0.147)=(\\mathbf{12.253},\\ \\mathbf{12.547}) \\)</div>'
          },
          {
            no: '例 7.14', meta: '真题改编 · σ 未知',
            q: '设 \\( X\\sim N(\\mu,\\sigma^2) \\)，\\( \\mu,\\sigma^2 \\) 均未知。抽取容量 \\( n=9 \\) 的样本，得 \\( \\bar x=5,\\ s=0.6 \\)。求 \\( \\mu \\) 的置信度为 0.95 的置信区间（\\( t_{0.025}(8)=2.306 \\)）。',
            sol:
              '<div class="fml">\\( t_{0.025}(8)\\dfrac{s}{\\sqrt n}=2.306\\times\\dfrac{0.6}{3}=2.306\\times0.2=0.4612 \\)</div>' +
              '<div class="fml">\\( \\mu\\in(5-0.4612,\\ 5+0.4612)=(\\mathbf{4.539},\\ \\mathbf{5.461}) \\)</div>' +
              '<p class="fml-note">与上例相比，虽然 \\( n \\) 更小、\\( s \\) 更大，但要注意 \\( t \\) 分位数（2.306）比 \\( u \\)（1.96）大 —— 这正是「\\( \\sigma \\) 未知」付出的代价。</p>'
          },
          {
            no: '例 7.15', meta: '提高 · 方差的置信区间',
            q: '设 \\( X\\sim N(\\mu,\\sigma^2) \\)，\\( \\mu,\\sigma^2 \\) 均未知。\\( n=10 \\) 时算得 \\( s^2=4 \\)。已知 \\( \\chi^2_{0.025}(9)=19.023,\\ \\chi^2_{0.975}(9)=2.700 \\)。求 \\( \\sigma^2 \\) 的置信度为 0.95 的置信区间。',
            sol:
              '<p>\\( (n-1)s^2=9\\times4=36 \\)，故</p>' +
              '<div class="fml">\\( \\sigma^2\\in\\left(\\dfrac{36}{19.023},\\ \\dfrac{36}{2.700}\\right)=(\\mathbf{1.892},\\ \\mathbf{13.333}) \\)</div>' +
              '<p class="fml-note">区间明显不对称（\\( \\chi^2 \\) 分布右偏），这是方差区间估计的特点。若要 \\( \\sigma \\) 的区间，对两端开方即可。</p>'
          }
        ],
        pitfalls: [
          '\\( \\sigma \\) 已知用 \\( u_{\\alpha/2} \\)，\\( \\sigma \\) 未知用 \\( t_{\\alpha/2}(n-1) \\)，切勿一律用 1.96。',
          '方差的置信区间<b>不是</b>对称的 \\( s^2\\pm\\cdots \\)，必须用 \\( \\chi^2 \\) 分位数构造。',
          '\\( \\chi^2 \\) 区间的分母顺序容易反：\\( \\chi^2_{\\alpha/2} \\)（大）作下界的分母、\\( \\chi^2_{1-\\alpha/2} \\)（小）作上界的分母。',
          '自由度不要写错：\\( \\mu \\) 未知时 \\( n-1 \\)，\\( \\mu \\) 已知时 \\( n \\)。',
          '置信度是「方法的覆盖比例」，不是「某个具体区间包含参数的概率」。'
        ]
      },

      /* ================================================================
         7.5 两个正态总体的区间估计
         ================================================================ */
      {
        id: 'ch7-s5',
        num: '7.5',
        title: '两个正态总体的区间估计',
        lead: '把单总体的结论推广到两总体：均值差用 t 或 N，方差比用 F —— 这四组公式必须能默写。',
        blocks: [
          { t: 'card', kind: 'tip', tag: '前提', title: '记号与假设', html:
            '<p class="tight">设 \\( X_1,\\cdots,X_{n_1} \\) 来自 \\( N(\\mu_1,\\sigma_1^2) \\)，\\( Y_1,\\cdots,Y_{n_2} \\) 来自 \\( N(\\mu_2,\\sigma_2^2) \\)，两组样本<b>相互独立</b>。记</p>' +
            '<div class="fml">\\( \\bar X,\\ S_1^2,\\qquad \\bar Y,\\ S_2^2 \\)</div>' +
            '<p class="tight">则 \\( \\bar X\\sim N\\!\\left(\\mu_1,\\frac{\\sigma_1^2}{n_1}\\right),\\ \\bar Y\\sim N\\!\\left(\\mu_2,\\frac{\\sigma_2^2}{n_2}\\right) \\)，且两者独立。</p>'
          },
          { t: 'h3', idx: '①', text: '均值差 μ₁ − μ₂ 的置信区间' },
          { t: 'card', kind: 'thm', tag: '公式', title: '三种情形', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>① \\( \\sigma_1^2,\\sigma_2^2 \\) 均已知：</b>\\( (\\bar X-\\bar Y)\\pm u_{\\alpha/2}\\sqrt{\\dfrac{\\sigma_1^2}{n_1}+\\dfrac{\\sigma_2^2}{n_2}} \\)</div>' +
            '<div class="fml-row"><b>② \\( \\sigma_1^2=\\sigma_2^2=\\sigma^2 \\) 但未知：</b>\\( (\\bar X-\\bar Y)\\pm t_{\\alpha/2}(n_1+n_2-2)\\,S_w\\sqrt{\\dfrac1{n_1}+\\dfrac1{n_2}} \\)</div>' +
            '<div class="fml-row" style="border:0;padding:0"><span style="color:var(--ink-3)">其中合并方差 \\( S_w^2=\\dfrac{(n_1-1)S_1^2+(n_2-1)S_2^2}{n_1+n_2-2} \\)</span></div>' +
            '<div class="fml-row"><b>③ \\( \\sigma_1^2\\neq\\sigma_2^2 \\) 且未知（大样本）：</b>用 \\( \\dfrac{\\bar X-\\bar Y-(\\mu_1-\\mu_2)}{\\sqrt{S_1^2/n_1+S_2^2/n_2}}\\ \\dot\\sim\\ N(0,1) \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '理解', title: '为什么方差可以「合并」', html:
            '<p class="tight">当 \\( \\sigma_1^2=\\sigma_2^2=\\sigma^2 \\) 时，两组样本提供的是<b>同一个</b> \\( \\sigma^2 \\) 的信息，把它们的偏差平方和加起来再除以总自由度，就得到精度更高的估计：</p>' +
            '<div class="fml">\\( S_w^2=\\dfrac{(n_1-1)S_1^2+(n_2-1)S_2^2}{(n_1-1)+(n_2-1)} \\)</div>' +
            '<p class="tight">这是「加权平均」的形式，权重是各自的自由度。自由度合计 \\( n_1+n_2-2 \\)，正是两个样本各损失 1 个自由度。</p>'
          },
          { t: 'h3', idx: '②', text: '方差比 σ₁²/σ₂² 的置信区间' },
          { t: 'card', kind: 'thm', tag: '公式', title: '方差比的置信区间', html:
            '<p class="tight">枢轴量 \\( F=\\dfrac{S_1^2/\\sigma_1^2}{S_2^2/\\sigma_2^2}\\sim F(n_1-1,\\ n_2-1) \\)，由</p>' +
            '<div class="fml">\\( P\\left\\{F_{1-\\alpha/2}(n_1-1,n_2-1)<\\dfrac{S_1^2/\\sigma_1^2}{S_2^2/\\sigma_2^2}<F_{\\alpha/2}(n_1-1,n_2-1)\\right\\}=1-\\alpha \\)</div>' +
            '<p class="tight">反解得</p>' +
            '<div class="fml">\\( \\dfrac{\\sigma_1^2}{\\sigma_2^2}\\in\\left(\\dfrac{S_1^2}{S_2^2}\\cdot\\dfrac{1}{F_{\\alpha/2}(n_1-1,n_2-1)},\\ \\ \\dfrac{S_1^2}{S_2^2}\\cdot\\dfrac{1}{F_{1-\\alpha/2}(n_1-1,n_2-1)}\\right) \\)</div>' +
            '<p class="tight"><b>常用的等价写法：</b></p>' +
            '<div class="fml">\\( \\dfrac{\\sigma_1^2}{\\sigma_2^2}\\in\\left(\\dfrac{S_1^2}{S_2^2}\\cdot\\dfrac{1}{F_{\\alpha/2}(n_1-1,n_2-1)},\\ \\ \\dfrac{S_1^2}{S_2^2}\\cdot F_{\\alpha/2}(n_2-1,n_1-1)\\right) \\)</div>' +
            '<p class="tight">因为 \\( \\dfrac{1}{F_{1-\\alpha/2}(n_1-1,n_2-1)}=F_{\\alpha/2}(n_2-1,n_1-1) \\)，这样只需查一种上侧分位数表。</p>'
          },
          { t: 'viz', build: 'ciTwoSample', title: '两个正态总体：均值差与方差比的区间', sub: '调整两组的样本量与样本方差，观察区间长度与位置' },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>直接套公式</b>：给出 \\( \\bar x,\\bar y,s_1^2,s_2^2,n_1,n_2 \\)，求 \\( \\mu_1-\\mu_2 \\) 或 \\( \\sigma_1^2/\\sigma_2^2 \\) 的区间。</li>' +
            '<li><b>判断是否包含 0 或 1</b>：区间含 0 \\( \\Rightarrow \\) 不能断定 \\( \\mu_1\\neq\\mu_2 \\)；含 1 \\( \\Rightarrow \\) 不能断定 \\( \\sigma_1^2\\neq\\sigma_2^2 \\)。这是与第八章假设检验的桥梁。</li>' +
            '<li><b>补全推导</b>：给出枢轴量与分布，写出反解过程。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 7.16', meta: '基础 · 均值差（方差已知）',
            q: '甲、乙两台机器加工同种零件，直径分别服从 \\( N(\\mu_1,0.04) \\)、\\( N(\\mu_2,0.09) \\)。各抽 10 件与 12 件，得 \\( \\bar x=20.1,\\ \\bar y=20.5 \\)。求 \\( \\mu_1-\\mu_2 \\) 的置信度为 0.95 的置信区间。',
            sol:
              '<p>\\( \\sqrt{\\dfrac{0.04}{10}+\\dfrac{0.09}{12}}=\\sqrt{0.004+0.0075}=\\sqrt{0.0115}\\approx0.1072 \\)</p>' +
              '<div class="fml">\\( (20.1-20.5)\\pm1.96\\times0.1072=-0.4\\pm0.2101 \\)</div>' +
              '<div class="fml">\\( \\mu_1-\\mu_2\\in(\\mathbf{-0.610},\\ \\mathbf{-0.190}) \\)</div>' +
              '<p class="fml-note">区间<b>不含 0</b>，说明有 95% 的把握认为两台机器的平均直径确实不同（甲更小）。</p>'
          },
          {
            no: '例 7.17', meta: '真题改编 · 均值差（方差未知但相等）',
            q: '设两总体都服从正态分布且方差相等。\\( n_1=10,\\ n_2=8,\\ s_1^2=2.4,\\ s_2^2=1.6,\\ \\bar x=82,\\ \\bar y=79 \\)。求 \\( \\mu_1-\\mu_2 \\) 的置信度为 0.95 的置信区间（\\( t_{0.025}(16)=2.120 \\)）。',
            sol:
              '<p><b>合并方差：</b></p>' +
              '<div class="fml">\\( s_w^2=\\dfrac{9\\times2.4+7\\times1.6}{10+8-2}=\\dfrac{21.6+11.2}{16}=\\dfrac{32.8}{16}=2.05 \\)</div>' +
              '<p><b>标准误：</b></p>' +
              '<div class="fml">\\( s_w\\sqrt{\\dfrac1{10}+\\dfrac1{8}}=\\sqrt{2.05}\\times\\sqrt{0.225}=1.4319\\times0.4743\\approx0.6792 \\)</div>' +
              '<p><b>区间：</b></p>' +
              '<div class="fml">\\( 3\\pm2.120\\times0.6792=3\\pm1.440=(\\mathbf{1.560},\\ \\mathbf{4.440}) \\)</div>'
          },
          {
            no: '例 7.18', meta: '提高 · 方差比',
            q: '设两正态总体独立，\\( n_1=13,\\ n_2=10,\\ s_1^2=2.5,\\ s_2^2=0.9 \\)。已知 \\( F_{0.025}(12,9)=3.87 \\)。求 \\( \\dfrac{\\sigma_1^2}{\\sigma_2^2} \\) 的置信度为 0.95 的置信区间。',
            sol:
              '<p>\\( \\dfrac{s_1^2}{s_2^2}=\\dfrac{2.5}{0.9}=2.7778 \\)。用只查上侧分位数表的等价写法：</p>' +
              '<p>下界：\\( 2.7778\\times\\dfrac1{3.87}=0.7178 \\)</p>' +
              '<p>上界：需 \\( F_{0.025}(9,12)=\\dfrac1{F_{0.975}(12,9)} \\)。若已知 \\( F_{0.975}(12,9)=0.2985 \\)，则 \\( F_{0.025}(9,12)=\\dfrac1{0.2985}=3.350 \\)，上界为</p>' +
              '<div class="fml">\\( 2.7778\\times3.350=9.306 \\)</div>' +
              '<div class="fml">\\( \\dfrac{\\sigma_1^2}{\\sigma_2^2}\\in(\\mathbf{0.718},\\ \\mathbf{9.306}) \\)</div>' +
              '<p class="fml-note">区间<b>包含 1</b>，说明不能排除 \\( \\sigma_1^2=\\sigma_2^2 \\)。另外注意区间很宽——在样本量不大的情况下，方差比的估计精度本来就很低。</p>'
          }
        ],
        pitfalls: [
          '两总体独立的前提不可少；若两组样本来自同一批对象（配对数据），要用「成对差」的做法而不是这里的公式。',
          '均值差区间的两个方差是<b>相加</b>（\\( \\sigma_1^2/n_1+\\sigma_2^2/n_2 \\)），不是相减；因为差的方差等于方差之和。',
          '合并方差 \\( S_w^2 \\) 只在「方差相等」的前提下使用；若题目未说明，需先检验（第八章的 F 检验）。',
          '方差比区间的两个 \\( F \\) 分位数自由度顺序<b>相反</b>，务必核对 \\( (n_1-1,n_2-1) \\) 与 \\( (n_2-1,n_1-1) \\)。',
          '区间包含 0（或 1）只能说明「<b>不能拒绝</b>相等」，而不是「证明了相等」——这是统计推断的基本限度。'
        ]
      }

    ]
  };

})(window);
