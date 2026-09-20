/* ============================================================
   ch5.js — 第五章 大数定律和中心极限定理
   覆盖 2026 大纲「五、大数定律和中心极限定理」全部考试内容与考试要求
   大纲原文（OCR 自大纲 p.22–23）：
     考试内容：切比雪夫（Chebyshev）不等式　切比雪夫大数定律　伯努利
               （Bernoulli）大数定律　辛钦（Khinchin）大数定律　棣莫弗-拉
               普拉斯（De Moivre-Laplace）定理　列维-林德伯格（Levy-
               Lindeberg）定理
     考试要求：1. 了解切比雪夫不等式；
               2. 了解切比雪夫大数定律、伯努利大数定律和辛钦大数定律
                  （独立同分布随机变量序列的大数定律）；
               3. 了解棣莫弗-拉普拉斯定理（二项分布以正态分布为极限分
                  布）和列维-林德伯格定理（独立同分布随机变量序列的中
                  心极限定理）．
   说明：本章大纲要求均为「了解」，但极限定理是概率论的理论枢纽——
         大数定律说「平均稳定」，中心极限定理说「误差正态」。
   ============================================================ */
(function (global) {
  'use strict';

  global.CH5 = {
    id: 'ch5',
    no: '五',
    title: '大数定律和中心极限定理',
    subtitle: '前四章回答「分布是什么」，本章回答「大量重复之后会怎样」——平均值稳定于期望，误差近似服从正态',
    tags: ['切比雪夫不等式', '依概率收敛', '切比雪夫大数定律', '伯努利大数定律', '辛钦大数定律', '棣莫弗-拉普拉斯定理', '列维-林德伯格定理', '正态近似'],
    sections: [

      /* ================================================================
         5.1 切比雪夫不等式
         ================================================================ */
      {
        id: 'ch5-s1',
        num: '5.1',
        title: '切比雪夫不等式',
        lead: '只用到期望与方差两个数字特征，就能对「偏离中心超过 ε」的概率给出一个通用上界 —— 这正是它能不依赖具体分布的原因。',
        blocks: [
          { t: 'h3', idx: '①', text: '不等式的陈述' },
          { t: 'card', kind: 'def', tag: '定理', title: '切比雪夫（Chebyshev）不等式', html:
            '<p class="tight">设随机变量 \\( X \\) 的数学期望 \\( E(X)=\\mu \\) 与方差 \\( D(X)=\\sigma^2 \\) 都存在，则对<b>任意</b> \\( \\varepsilon>0 \\)，有</p>' +
            '<div class="fml">\\( \\boxed{\\ P\\{|X-\\mu|\\geqslant\\varepsilon\\}\\leqslant\\dfrac{\\sigma^2}{\\varepsilon^2}\\ } \\)</div>' +
            '<p class="tight">取对立事件，得到常用的等价形式：</p>' +
            '<div class="fml">\\( P\\{|X-\\mu|<\\varepsilon\\}\\geqslant 1-\\dfrac{\\sigma^2}{\\varepsilon^2} \\)</div>' +
            '<p class="tight"><b>适用条件极弱：</b>不要求 \\( X \\) 服从什么分布，也不要求 \\( X \\) 连续或离散，只要 \\( E(X),D(X) \\) 存在即可。</p>'
          },
          { t: 'card', kind: 'key', tag: '直观', title: '它到底在说什么？', html:
            '<p class="tight">把它写成「面积」的语言：以 \\( \\mu \\) 为中心、半宽为 \\( \\varepsilon \\) 开一个窗口，则<b>窗口之外</b>的概率（尾部面积）不会超过 \\( \\sigma^2/\\varepsilon^2 \\)。</p>' +
            '<ul class="none">' +
            '<li>\\( \\varepsilon \\) 越大（窗口越宽），上界 \\( \\sigma^2/\\varepsilon^2 \\) 越小 —— 偏移越远越不可能。</li>' +
            '<li>\\( \\sigma^2 \\) 越小（分布越集中），上界越小 —— 越集中越不容易偏出去。</li>' +
            '<li>当 \\( \\varepsilon\\leqslant\\sigma \\) 时上界 \\( \\geqslant1 \\)，此时不等式<b>不提供信息</b>（本身没错，只是没用）。</li>' +
            '</ul>'
          },
          { t: 'viz', build: 'chebyshev', title: '切比雪夫不等式：界与真实概率的差距', sub: '切换分布与 ε，对照上界 σ²/ε² 与真实尾部概率' },
          { t: 'h3', idx: '②', text: '证明思路（连续型）' },
          { t: 'card', kind: 'thm', tag: '证明', title: '「放大被积函数」的技巧', html:
            '<p class="tight">设 \\( X \\) 的密度为 \\( f(x) \\)。在积分区域 \\( \\{|x-\\mu|\\geqslant\\varepsilon\\} \\) 上有</p>' +
            '<div class="fml">\\( \\dfrac{(x-\\mu)^2}{\\varepsilon^2}\\geqslant 1 \\quad\\Longrightarrow\\quad f(x)\\leqslant \\dfrac{(x-\\mu)^2}{\\varepsilon^2}f(x) \\)</div>' +
            '<p class="tight">于是</p>' +
            '<div class="fml">\\( P\\{|X-\\mu|\\geqslant\\varepsilon\\}=\\int_{|x-\\mu|\\geqslant\\varepsilon}\\!\\!f(x)\\,\\mathrm{d}x\\leqslant\\int_{|x-\\mu|\\geqslant\\varepsilon}\\!\\!\\dfrac{(x-\\mu)^2}{\\varepsilon^2}f(x)\\,\\mathrm{d}x \\\)</div>' +
            '<div class="fml">\\( \\leqslant\\dfrac{1}{\\varepsilon^2}\\int_{-\\infty}^{+\\infty}(x-\\mu)^2f(x)\\,\\mathrm{d}x=\\dfrac{D(X)}{\\varepsilon^2} \\)</div>' +
            '<p class="tight">把积分区域从「外尾部」<b>放大</b>到全实轴，正是这一步产生了不等号。离散型只需把积分换成求和，证明完全平行。</p>'
          },
          { t: 'h3', idx: '③', text: '使用要点与题型' },
          { t: 'card', kind: 'tip', tag: '要点', title: '三条使用纪律', html:
            '<ol class="clean">' +
            '<li><b>先配对</b>：把待估事件写成 \\( \\{|X-\\mu|<\\varepsilon\\} \\) 或 \\( \\{|X-\\mu|\\geqslant\\varepsilon\\} \\) 的形状，再解出 \\( \\varepsilon \\)。</li>' +
            '<li><b>区间要同向</b>：\\( P\\{a<X<b\\} \\) 若关于 \\( \\mu \\) 对称则直接套；若不对称，只能取「包含它的最大对称区间」得到<b>偏保守</b>的下界。</li>' +
            '<li><b>它是估计不是计算</b>：结果是一个界，通常比真实概率松很多；要精确值必须知道分布。</li>' +
            '</ol>'
          },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>给 \\( E(X),D(X) \\) 估概率</b>：直接套不等式，注意 \\( \\varepsilon \\) 的选择。</li>' +
            '<li><b>给概率反求 \\( n \\) 或 \\( \\varepsilon \\)</b>：把 \\( n \\) 代进 \\( D \\) 的表达式，再解不等式。</li>' +
            '<li><b>证明大数定律</b>：对 \\( \\bar X \\) 用切比雪夫不等式，令 \\( n\\to\\infty \\) 即得。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 5.1', meta: '基础 · 直接用不等式',
            q: '设 \\( E(X)=10,\\ D(X)=4 \\)。用切比雪夫不等式估计 \\( P\\{6<X<14\\} \\) 的下界。',
            sol:
              '<p>把事件写成关于 \\( \\mu=10 \\) 的对称形式：</p>' +
              '<div class="fml">\\( \\{6<X<14\\}=\\{|X-10|<4\\} \\)</div>' +
              '<p>取 \\( \\varepsilon=4 \\)：</p>' +
              '<div class="fml">\\( P\\{6<X<14\\}\\geqslant 1-\\dfrac{D(X)}{\\varepsilon^2}=1-\\dfrac{4}{16}=\\mathbf{0.75} \\)</div>'
          },
          {
            no: '例 5.2', meta: '提高 · 界与真值的对比',
            q: '设 \\( X\\sim N(0,1) \\)。<br>(1) 用切比雪夫不等式估计 \\( P\\{|X|<3\\} \\)；<br>(2) 求其精确值，并比较。',
            sol:
              '<p><b>(1)</b> \\( \\mu=0,\\ \\sigma^2=1,\\ \\varepsilon=3 \\)：</p>' +
              '<div class="fml">\\( P\\{|X|<3\\}\\geqslant 1-\\dfrac{1}{9}\\approx\\mathbf{0.889} \\)</div>' +
              '<p><b>(2)</b> 查标准正态表：</p>' +
              '<div class="fml">\\( P\\{|X|<3\\}=2\\Phi(3)-1\\approx 2\\times0.99865-1=\\mathbf{0.9973} \\)</div>' +
              '<p class="fml-note">精确值 0.9973 远大于下界 0.889 —— 切比雪夫不等式<b>普适但粗糙</b>。它的价值在于「不需要知道分布」，而不是给出精确值。</p>'
          },
          {
            no: '例 5.3', meta: '真题改编 · 反求样本量',
            q: '设 \\( X_1,\\cdots,X_n \\) 独立同分布，\\( E(X_i)=\\mu,\\ D(X_i)=\\sigma^2 \\)，记 \\( \\bar X=\\dfrac1n\\sum_{i=1}^{n}X_i \\)。用切比雪夫不等式求 \\( n \\)，使得 \\( P\\{|\\bar X-\\mu|<\\varepsilon\\}\\geqslant 0.9 \\)。',
            sol:
              '<p>先算 \\( \\bar X \\) 的期望与方差：</p>' +
              '<div class="fml">\\( E(\\bar X)=\\mu,\\qquad D(\\bar X)=\\dfrac{1}{n^2}\\sum_{i=1}^{n}D(X_i)=\\dfrac{\\sigma^2}{n} \\)</div>' +
              '<p>对 \\( \\bar X \\) 用切比雪夫不等式：</p>' +
              '<div class="fml">\\( P\\{|\\bar X-\\mu|<\\varepsilon\\}\\geqslant 1-\\dfrac{\\sigma^2/n}{\\varepsilon^2} \\)</div>' +
              '<p>要求右端 \\( \\geqslant0.9 \\)，只需</p>' +
              '<div class="fml">\\( \\dfrac{\\sigma^2}{n\\varepsilon^2}\\leqslant 0.1\\quad\\Longrightarrow\\quad n\\geqslant\\dfrac{10\\sigma^2}{\\varepsilon^2} \\)</div>' +
              '<p class="fml-note">这条思路正是切比雪夫大数定律的证明：固定 \\( \\varepsilon \\)，令 \\( n\\to\\infty \\)，右端趋于 1。</p>'
          }
        ],
        pitfalls: [
          '切比雪夫不等式要求 \\( \\varepsilon>0 \\)；\\( \\varepsilon \\) 的单位与 \\( X \\) 相同，不要漏。<b>不要</b>把 \\( \\varepsilon \\) 与 \\( \\sigma \\) 混用。',
          '当 \\( \\varepsilon\\leqslant\\sigma \\)，上界 \\( \\sigma^2/\\varepsilon^2\\geqslant1 \\)，此时结论平凡，题目一般会避开这种取值。',
          '不等式给的是<b>界</b>：\\( \\geqslant \\) 方向不能当成精确值，也不要反向使用。',
          '对不对称区间只能取包含它的最大对称区间，得到的是<b>更保守</b>（更小）的下界。'
        ]
      },

      /* ================================================================
         5.2 大数定律
         ================================================================ */
      {
        id: 'ch5-s2',
        num: '5.2',
        title: '大数定律',
        lead: '大数定律回答：为什么大量重复试验后「频率稳定于概率」、「平均稳定于期望」。它的数学语言是「依概率收敛」。',
        blocks: [
          { t: 'h3', idx: '①', text: '依概率收敛' },
          { t: 'card', kind: 'def', tag: '定义', title: '依概率收敛', html:
            '<p class="tight">设 \\( Y_1,Y_2,\\cdots \\) 是一列随机变量，\\( Y \\) 也是随机变量。若对任意 \\( \\varepsilon>0 \\)，都有</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}P\\{|Y_n-Y|\\geqslant\\varepsilon\\}=0 \\)</div>' +
            '<p class="tight">则称 \\( \\{Y_n\\} \\) <b>依概率收敛</b>于 \\( Y \\)，记作</p>' +
            '<div class="fml">\\( Y_n\\overset{P}{\\longrightarrow}Y\\qquad(\\text{即 }P\\{|Y_n-Y|<\\varepsilon\\}\\to1) \\)</div>' +
            '<p class="tight"><b>含义：</b>\\( Y_n \\) 与 \\( Y \\) 相差超过任意给定精度 \\( \\varepsilon \\) 的可能性，随 \\( n \\) 增大而趋于 0。它<b>不</b>保证每个样本点上 \\( Y_n(\\omega)\\to Y(\\omega) \\)。</p>'
          },
          { t: 'h3', idx: '②', text: '三个大数定律' },
          { t: 'card', kind: 'thm', tag: '定理', title: '一、切比雪夫大数定律', html:
            '<p class="tight">设 \\( X_1,X_2,\\cdots \\) <b>相互独立</b>，各自的期望 \\( E(X_k)=\\mu_k \\) 存在，且方差有<b>共同上界</b> \\( D(X_k)\\leqslant C \\)（\\( k=1,2,\\cdots \\)），则对任意 \\( \\varepsilon>0 \\)：</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}P\\left\\{\\left|\\dfrac1n\\sum_{k=1}^{n}X_k-\\dfrac1n\\sum_{k=1}^{n}E(X_k)\\right|<\\varepsilon\\right\\}=1 \\)</div>' +
            '<p class="tight"><b>条件要点：</b>独立 + 方差一致有界。它不要求同分布。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '二、伯努利大数定律', html:
            '<p class="tight">设 \\( n_A \\) 是 \\( n \\) 重伯努利试验中事件 \\( A \\) 发生的次数，\\( p \\) 是每次试验中 \\( A \\) 发生的概率，则对任意 \\( \\varepsilon>0 \\)：</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}P\\left\\{\\left|\\dfrac{n_A}{n}-p\\right|<\\varepsilon\\right\\}=1\\qquad\\text{即}\\quad \\dfrac{n_A}{n}\\overset{P}{\\longrightarrow}p \\)</div>' +
            '<p class="tight"><b>意义：</b>这是「频率稳定于概率」的严格表述，也是「用频率估计概率」这一统计做法的理论依据。</p>'
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '三、辛钦大数定律', html:
            '<p class="tight">设 \\( X_1,X_2,\\cdots \\) <b>独立同分布</b>，且 \\( E(X_k)=\\mu \\) 存在，则对任意 \\( \\varepsilon>0 \\)：</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}P\\left\\{\\left|\\dfrac1n\\sum_{k=1}^{n}X_k-\\mu\\right|<\\varepsilon\\right\\}=1\\qquad\\text{即}\\quad \\bar X\\overset{P}{\\longrightarrow}\\mu \\)</div>' +
            '<p class="tight"><b>条件要点：</b>独立同分布 + 期望存在。<b>不要求方差存在</b>——这是它强于切比雪夫大数定律之处（切比雪夫要求方差有界，柯西分布等反而不能用切比雪夫，但柯西的期望本身也不存在，故也不能用辛钦）。</p>'
          },
          { t: 'viz', build: 'lln', title: '大数定律：样本均值的「收敛轨道」', sub: '多次独立模拟（最多 30 条轨道），观察 Ᾱₙ 如何向 μ 收拢' },
          { t: 'viz', build: 'llnFrequency', title: '伯努利大数定律：频率稳定到 p', sub: '调节 p 与轮数（最多 30 轮），观察频率轨迹被 p 与 ±3σ/√n 带收拢' },
          { t: 'card', kind: 'key', tag: '对比', title: '三个大数定律的条件差异', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>定律</th><th>独立性</th><th>同分布</th><th>矩条件</th></tr></thead><tbody>' +
            '<tr><td><b>切比雪夫</b>大数定律</td><td>相互独立</td><td>不要求</td><td>期望存在且方差<b>一致有界</b></td></tr>' +
            '<tr><td><b>伯努利</b>大数定律</td><td>（伯努利试验序列自带）</td><td>同分布（两值）</td><td>方差 \\( p(1-p) \\) 天然有界</td></tr>' +
            '<tr><td><b>辛钦</b>大数定律</td><td>相互独立</td><td><b>要求同分布</b></td><td>只要期望存在（<b>不要求方差</b>）</td></tr>' +
            '</tbody></table></div>' +
            '<p class="tight" style="margin-top:10px"><b>共同结论：</b>样本均值 \\( \\bar X \\) 依概率收敛于期望 \\( \\mu \\)。</p>'
          },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>条件辨析</b>：给出某个具体分布（如柯西分布），判断能否用某条大数定律。</li>' +
            '<li><b>用频率估计概率</b>：由伯努利大数定律说明 \\( n_A/n\\to p \\)。</li>' +
            '<li><b>求 \\( n \\)</b>：结合切比雪夫不等式给 \\( \\bar X \\) 定一个「接近 \\( \\mu \\)」的样本量。</li>' +
            '<li><b>判断收敛性</b>：用辛钦大数定律论证 \\( \\frac1n\\sum g(X_i)\\to E[g(X_1)] \\)。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 5.4', meta: '基础 · 条件辨析',
            q: '判断：设 \\( X_1,X_2,\\cdots \\) 相互独立同分布，且 \\( D(X_i) \\) 存在，则 \\( \\bar X\\overset{P}{\\longrightarrow}E(X_1) \\) 可由哪些大数定律得到？',
            sol:
              '<p>三条定律<b>都可以</b>用：</p>' +
              '<ul class="none">' +
              '<li>同分布 \\( \\Rightarrow \\) 各 \\( D(X_i) \\) 相同，从而有共同上界 \\( C=D(X_1) \\)，满足<b>切比雪夫</b>大数定律。</li>' +
              '<li>独立同分布且期望存在，满足<b>辛钦</b>大数定律。</li>' +
              '<li>若取 \\( X_i \\) 为两值变量，即退化为<b>伯努利</b>大数定律。</li>' +
              '</ul>' +
              '<p class="fml-note">结论一致，但条件强弱不同：辛钦的条件<b>最弱</b>（不要方差），切比雪夫要求方差有界。</p>'
          },
          {
            no: '例 5.5', meta: '提高 · 柯西分布的反例',
            q: '设 \\( X_1,X_2,\\cdots \\) 相互独立且都服从柯西分布（密度 \\( f(x)=\\dfrac{1}{\\pi(1+x^2)} \\)）。能否用辛钦大数定律断定 \\( \\bar X\\overset{P}{\\longrightarrow}0 \\)？',
            sol:
              '<p><b>不能。</b>辛钦大数定律要求期望 \\( E(X_1) \\) <b>存在</b>，而柯西分布的期望不存在（见例 4.3）。</p>' +
              '<p>事实上柯西分布有个反常性质：\\( \\bar X=\\frac1n\\sum X_i \\) <b>仍然服从柯西分布</b>，与 \\( n \\) 无关，所以 \\( \\bar X \\) 根本不收敛于任何常数。</p>' +
              '<p class="fml-note">这说明大数定律的「矩条件」不是装饰：少了它，结论真的会失效。切比雪夫大数定律同样不适用（方差也不存在）。</p>'
          },
          {
            no: '例 5.6', meta: '真题改编 · 用辛钦大数定律',
            q: '设 \\( X_1,X_2,\\cdots \\) 独立同分布，\\( E(X_i)=\\mu,\\ D(X_i)=\\sigma^2 \\) 都存在。证明 \\( \\dfrac1n\\sum_{i=1}^{n}X_i^2\\overset{P}{\\longrightarrow}\\mu^2+\\sigma^2 \\)。',
            sol:
              '<p>令 \\( Y_i=X_i^2 \\)，则 \\( Y_1,Y_2,\\cdots \\) 仍<b>独立同分布</b>，且</p>' +
              '<div class="fml">\\( E(Y_1)=E(X_1^2)=D(X_1)+[E(X_1)]^2=\\sigma^2+\\mu^2 \\)</div>' +
              '<p>由<b>辛钦</b>大数定律（只要求期望存在）：</p>' +
              '<div class="fml">\\( \\dfrac1n\\sum_{i=1}^{n}Y_i=\\dfrac1n\\sum_{i=1}^{n}X_i^2\\overset{P}{\\longrightarrow}E(Y_1)=\\mu^2+\\sigma^2 \\)</div>' +
              '<p class="fml-note">「连续函数的复合仍是独立同分布」是这类题的通用套路。</p>'
          },
          {
            no: '例 5.7', meta: '提高 · 大数定律 + 切比雪夫不等式',
            q: '某种电子元件寿命的期望为 1000 小时、标准差不超过 100 小时。随机取 \\( n \\) 只，用其平均寿命估计总体平均寿命。要使误差小于 50 小时的概率不低于 0.95，至少取多少只？',
            sol:
              '<p>设第 \\( i \\) 只寿命为 \\( X_i \\)，\\( E(X_i)=1000,\\ D(X_i)\\leqslant100^2 \\)。由切比雪夫不等式：</p>' +
              '<div class="fml">\\( P\\{|\\bar X-1000|<50\\}\\geqslant 1-\\dfrac{D(\\bar X)}{50^2}=1-\\dfrac{100^2}{n\\cdot50^2}=1-\\dfrac{4}{n} \\)</div>' +
              '<p>要求 \\( 1-\\dfrac4n\\geqslant0.95 \\)，即 \\( \\dfrac4n\\leqslant0.05 \\)，解得</p>' +
              '<div class="fml">\\( n\\geqslant\\dfrac{4}{0.05}=\\mathbf{80} \\)</div>' +
              '<p class="fml-note">现实中若已知近似正态，用中心极限定理可得到远小于 80 的答案 —— 可见切比雪夫估计<b>保守</b>（要求更严、需要更大样本）。</p>'
          }
        ],
        pitfalls: [
          '三种收敛要分清：本章用的是<b>依概率收敛</b>，不是「几乎必然」或「均方」收敛。',
          '辛钦大数定律<b>不要求方差存在</b>，但<b>要求期望存在</b>且<b>独立同分布</b>——柯西分布是经典反例。',
          '切比雪夫大数定律<b>不要求同分布</b>，但要求方差一致有界。',
          '伯努利大数定律中的 \\( n_A/n \\) 是频率，\\( p \\) 是概率；两者是「收敛」关系而不是「相等」。'
        ]
      },

      /* ================================================================
         5.3 中心极限定理
         ================================================================ */
      {
        id: 'ch5-s3',
        num: '5.3',
        title: '中心极限定理',
        lead: '为什么正态分布在自然界无处不在？中心极限定理给出了答案：大量相互独立的微小随机因素叠加，其和的分布在标准化后必然趋于标准正态。',
        blocks: [
          { t: 'h3', idx: '①', text: '列维-林德伯格定理（独立同分布的中心极限定理）' },
          { t: 'card', kind: 'thm', tag: '定理', title: '列维-林德伯格（Levy-Lindeberg）定理', html:
            '<p class="tight">设 \\( X_1,X_2,\\cdots \\) <b>独立同分布</b>，\\( E(X_i)=\\mu,\\ D(X_i)=\\sigma^2 \\)（\\( 0<\\sigma^2<+\\infty \\)）。记 \\( S_n=\\sum_{i=1}^{n}X_i \\)，则对任意实数 \\( x \\)：</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}P\\left\\{\\dfrac{S_n-n\\mu}{\\sqrt{n}\\,\\sigma}\\leqslant x\\right\\}=\\Phi(x)=\\dfrac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^{x}e^{-t^2/2}\\,\\mathrm{d}t \\)</div>' +
            '<p class="tight"><b>即：</b>当 \\( n \\) 充分大时，\\( \\dfrac{S_n-n\\mu}{\\sqrt{n}\\sigma} \\) <b>近似服从</b> \\( N(0,1) \\)。</p>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '三种等价的说法（必记）', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>① 和：</b>\\( S_n=\\sum_{i=1}^{n}X_i\\ \\ \\text{近似}\\ \\ N(n\\mu,\\ n\\sigma^2) \\)</div>' +
            '<div class="fml-row"><b>② 均值：</b>\\( \\bar X=\\dfrac1n\\sum_{i=1}^{n}X_i\\ \\ \\text{近似}\\ \\ N\\!\\left(\\mu,\\ \\dfrac{\\sigma^2}{n}\\right) \\)</div>' +
            '<div class="fml-row"><b>③ 标准化：</b>\\( \\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt{n}}\\ \\ \\text{近似}\\ \\ N(0,1) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>注意：</b>这三个式子彼此等价，考试中按题目的问法挑最方便的形式。均值形式说明：<b>样本量越大，均值越集中</b>（方差 \\( \\sigma^2/n \\) 随 \\( n \\) 减小）。</p>'
          },
          { t: 'h3', idx: '②', text: '棣莫弗-拉普拉斯定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '棣莫弗-拉普拉斯（De Moivre-Laplace）定理', html:
            '<p class="tight">设 \\( X\\sim B(n,p) \\)（\\( 0<p<1 \\)），则对任意实数 \\( x \\)：</p>' +
            '<div class="fml">\\( \\lim_{n\\to\\infty}P\\left\\{\\dfrac{X-np}{\\sqrt{np(1-p)}}\\leqslant x\\right\\}=\\Phi(x) \\)</div>' +
            '<p class="tight"><b>即：</b>当 \\( n \\) 充分大时，\\( X \\) 近似服从 \\( N\\big(np,\\ np(1-p)\\big) \\)——二项分布<b>以正态分布为极限分布</b>。</p>' +
            '<p class="tight"><b>来源：</b>把 \\( X \\) 写成 \\( n \\) 个独立 0–1 变量之和 \\( X=\\sum_{i=1}^{n}X_i \\)，\\( E(X_i)=p,\\ D(X_i)=p(1-p) \\)，直接代入列维-林德伯格定理即得。</p>'
          },
          { t: 'viz', build: 'clt', title: '中心极限定理：从任意分布到正态', sub: '切换总体分布与样本量 n，观察标准化的和如何逼近 N(0,1)' },
          { t: 'viz', build: 'cltDice', title: '中心极限定理：掷骰子点数和', sub: '增大骰子个数 n，观察标准化点数和逼近标准正态' },
          { t: 'card', kind: 'tip', tag: '辨析', title: '大数定律 vs 中心极限定理', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>对比项</th><th>大数定律</th><th>中心极限定理</th></tr></thead><tbody>' +
            '<tr><td>回答的问题</td><td>平均<b>稳定在哪里</b>（收敛到 \\( \\mu \\)）</td><td>波动<b>有多大、什么形状</b>（近似正态）</td></tr>' +
            '<tr><td>结论形式</td><td>\\( \\bar X\\overset{P}{\\longrightarrow}\\mu \\)</td><td>\\( \\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n}\\ \\text{近似}\\ N(0,1) \\)</td></tr>' +
            '<tr><td>对分布的要求</td><td>期望存在（+独立性等）</td><td>期望、方差存在，且 <b>方差有限</b></td></tr>' +
            '<tr><td>典型用途</td><td>频率估计概率、参数估计的相合性</td><td>近似计算概率、构造置信区间与检验统计量</td></tr>' +
            '</tbody></table></div>' +
            '<p class="tight" style="margin-top:10px">大数定律讲「一阶」信息（位置），中心极限定理讲「二阶」信息（波动）。两者合起来，才完整刻画了样本均值的渐近行为。</p>'
          },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>近似求概率</b>：\\( n \\) 大时用 \\( \\bar X \\) 或 \\( S_n \\) 的正态近似计算区间概率。</li>' +
            '<li><b>二项的正态近似</b>：\\( X\\sim B(n,p) \\) 求 \\( P\\{a\\leqslant X\\leqslant b\\} \\)，配合连续性修正。</li>' +
            '<li><b>反求 \\( n \\)</b>：使 \\( P\\{|\\bar X-\\mu|<\\varepsilon\\}\\geqslant 1-\\alpha \\)，用 \\( \\Phi \\) 的反函数解出 \\( n \\)。</li>' +
            '<li><b>定理条件判定</b>：判断能否用中心极限定理（同分布？独立？方差有限？）。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 5.8', meta: '基础 · 独立同分布之和',
            q: '设 \\( X_1,\\cdots,X_{50} \\) 独立同分布，\\( E(X_i)=2,\\ D(X_i)=9 \\)。用中心极限定理近似计算 \\( P\\left\\{\\sum_{i=1}^{50}X_i>120\\right\\} \\)。',
            sol:
              '<p>\\( S=\\sum_{i=1}^{50}X_i \\) 近似服从 \\( N(50\\times2,\\ 50\\times9)=N(100,\\ 450) \\)，标准差 \\( \\sqrt{450}=15\\sqrt2\\approx21.213 \\)。</p>' +
              '<div class="fml">\\( P\\{S>120\\}=1-\\Phi\\!\\left(\\dfrac{120-100}{21.213}\\right)=1-\\Phi(0.9428) \\)</div>' +
              '<p>查表 \\( \\Phi(0.94)\\approx0.8264 \\)，故</p>' +
              '<div class="fml">\\( P\\{S>120\\}\\approx1-0.8264=\\mathbf{0.1736} \\)</div>'
          },
          {
            no: '例 5.9', meta: '真题改编 · 伯努利试验',
            q: '某保险公司有 10000 个同一年龄段的投保人，每人一年内出险的概率为 0.006，且相互独立。用中心极限定理近似计算一年内出险人数不超过 70 人的概率。',
            sol:
              '<p>设出险人数 \\( X\\sim B(10000,\\ 0.006) \\)，则</p>' +
              '<div class="fml">\\( np=60,\\qquad np(1-p)=60\\times0.994=59.64 \\)</div>' +
              '<p>用棣莫弗-拉普拉斯定理，并作连续性修正 \\( X\\leqslant70\\ \\Leftarrow\\ X\\leqslant70.5 \\)：</p>' +
              '<div class="fml">\\( P\\{X\\leqslant70\\}\\approx\\Phi\\!\\left(\\dfrac{70.5-60}{\\sqrt{59.64}}\\right)=\\Phi\\!\\left(\\dfrac{10.5}{7.723}\\right)=\\Phi(1.3596) \\)</div>' +
              '<p>查表得 \\( \\Phi(1.36)\\approx0.9131 \\)，故概率约为 <b>0.913</b>。</p>' +
              '<p class="fml-note">若不作修正，会得到 \\( \\Phi(1.295)\\approx0.902 \\)，误差约 0.011。\\( n \\) 越大修正的相对影响越小，但在「\\( \\leqslant k \\)」型问题中它总是提高精度。</p>'
          },
          {
            no: '例 5.10', meta: '提高 · 反求样本量',
            q: '设 \\( X_1,X_2,\\cdots \\) 独立同分布，\\( E(X_i)=1,\\ D(X_i)=4 \\)。要使 \\( P\\{|\\bar X-1|<0.1\\}\\geqslant0.95 \\)，样本量 \\( n \\) 至少为多少？',
            sol:
              '<p>\\( \\bar X \\) 近似服从 \\( N\\!\\left(1,\\dfrac4n\\right) \\)，故</p>' +
              '<div class="fml">\\( P\\{|\\bar X-1|<0.1\\}\\approx 2\\Phi\\!\\left(\\dfrac{0.1}{2/\\sqrt n}\\right)-1=2\\Phi(0.05\\sqrt n)-1 \\)</div>' +
              '<p>要求 \\( 2\\Phi(0.05\\sqrt n)-1\\geqslant0.95 \\)，即 \\( \\Phi(0.05\\sqrt n)\\geqslant0.975 \\)。查表 \\( \\Phi(1.96)=0.975 \\)，于是</p>' +
              '<div class="fml">\\( 0.05\\sqrt n\\geqslant1.96\\quad\\Longrightarrow\\quad \\sqrt n\\geqslant39.2\\quad\\Longrightarrow\\quad n\\geqslant1536.6 \\)</div>' +
              '<p>故至少取 <b>\\( n=1537 \\)</b>。</p>' +
              '<p class="fml-note">与例 5.7 对比：切比雪夫不等式给出 \\( n\\geqslant D(X)/\\varepsilon^2/0.05=4/0.01/0.05=8000 \\)，比中心极限定理的 1537 保守得多。</p>'
          }
        ],
        pitfalls: [
          '中心极限定理要求方差<b>有限</b>，且要求<b>独立</b>（同分布可放宽为「林德伯格条件」，考研不考）。',
          '「\\( n \\) 充分大」没有统一门槛，一般 \\( n\\geqslant30 \\) 可用；二项的正态近似常要求 \\( np\\geqslant5 \\) 且 \\( n(1-p)\\geqslant5 \\)。',
          '标准化时切勿漏掉 \\( \\sqrt{n} \\)：\\( D(S_n)=n\\sigma^2 \\)，所以 \\( S_n \\) 的标准差是 \\( \\sqrt n\\,\\sigma \\) 而不是 \\( \\sigma \\)。',
          '二项分布既可用泊松近似（\\( p \\) 小、\\( \\lambda=np \\) 适中）也可用正态近似（\\( n \\) 大、\\( p \\) 不接近 0 或 1），要按题目条件选择。'
        ]
      },

      /* ================================================================
         5.4 中心极限定理的应用：正态近似
         ================================================================ */
      {
        id: 'ch5-s4',
        num: '5.4',
        title: '中心极限定理的应用：正态近似',
        lead: '把定理变成算概率的工具：如何选分布、如何标准化、什么时候需要连续性修正 —— 本节给出可直接照抄的操作流程。',
        blocks: [
          { t: 'h3', idx: '①', text: '操作流程' },
          { t: 'card', kind: 'key', tag: '流程', title: '四步走', html:
            '<ol class="clean">' +
            '<li><b>识别</b>：题目是「\\( n \\) 个独立随机变量之和/均值」的形状吗？若是二项 \\( B(n,p) \\)，它本身就是 \\( n \\) 个 0–1 之和。</li>' +
            '<li><b>算两个参数</b>：\\( E(S_n)=n\\mu,\\ D(S_n)=n\\sigma^2 \\)；或对 \\( \\bar X \\) 用 \\( \\mu,\\ \\sigma^2/n \\)。</li>' +
            '<li><b>标准化</b>：\\( \\dfrac{S_n-E(S_n)}{\\sqrt{D(S_n)}} \\)，写成 \\( \\Phi(\\cdot) \\) 的形式。</li>' +
            '<li><b>查表 / 修正</b>：离散情形（二项、泊松）涉及「\\( \\leqslant k \\)」时用连续性修正。</li>' +
            '</ol>'
          },
          { t: 'card', kind: 'tip', tag: '关键', title: '连续性修正：为什么 \\( +0.5 \\)', html:
            '<p class="tight">离散变量只能取整数，而正态是连续的。用「阶梯」去逼近「曲线」时，取整点 \\( k \\) 处的「台阶」应当覆盖区间 \\( [k-0.5,\\ k+0.5] \\)。所以：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>1.</b> \\( P\\{X\\leqslant k\\}\\approx\\Phi\\!\\left(\\dfrac{k+0.5-np}{\\sqrt{np(1-p)}}\\right) \\)</div>' +
            '<div class="fml-row"><b>2.</b> \\( P\\{X\\geqslant k\\}\\approx 1-\\Phi\\!\\left(\\dfrac{k-0.5-np}{\\sqrt{np(1-p)}}\\right) \\)</div>' +
            '<div class="fml-row"><b>3.</b> \\( P\\{a\\leqslant X\\leqslant b\\}\\approx\\Phi\\!\\left(\\dfrac{b+0.5-np}{\\sqrt{np(1-p)}}\\right)-\\Phi\\!\\left(\\dfrac{a-0.5-np}{\\sqrt{np(1-p)}}\\right) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>口诀：</b>小的往<b>小</b>挪 0.5（\\( a-0.5 \\)），大的往<b>大</b>挪 0.5（\\( b+0.5 \\)）—— 总是把区间「放宽」半格。</p>'
          },
          { t: 'viz', build: 'normalApproxBinom', title: '二项分布的正态近似与连续性修正', sub: '拖动 n、p 与分界点，对比精确值、修正近似与未修正近似' },
          { t: 'viz', build: 'continuityCorrection', title: '连续性修正：±0.5 的来由', sub: '切换 P{X≤k} / P{X≥k} / P{X=k}，比较修正前后的误差' },
          { t: 'h3', idx: '②', text: '近似方案的选择' },
          { t: 'card', kind: 'tip', tag: '选择', title: '泊松近似 还是 正态近似？', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>情形</th><th>近似方案</th><th>参数</th></tr></thead><tbody>' +
            '<tr><td>\\( n \\) 很大，\\( p \\) 很<b>小</b>，\\( \\lambda=np \\) 适中</td><td>泊松分布</td><td>\\( \\lambda=np \\)</td></tr>' +
            '<tr><td>\\( n \\) 很大，\\( p \\) <b>不接近</b> 0 或 1</td><td>正态分布</td><td>\\( N\\big(np,\\ np(1-p)\\big) \\)</td></tr>' +
            '<tr><td>\\( n \\) 很大且 \\( np\\geqslant5,\\ n(1-p)\\geqslant5 \\)</td><td>正态分布（更精确）</td><td>同上，建议作连续性修正</td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'card', kind: 'exam', tag: '高频', title: '典型设问', html:
            '<ul class="none">' +
            '<li><b>区间概率</b>：\\( P\\{a\\leqslant X\\leqslant b\\} \\)，\\( X\\sim B(n,p) \\)。</li>' +
            '<li><b>「至少/至多」型</b>：\\( P\\{X\\geqslant k\\} \\) 或 \\( P\\{X\\leqslant k\\} \\)，注意修正方向。</li>' +
            '<li><b>给定概率反求参数</b>：由 \\( \\Phi(z_{1-\\alpha}) \\) 反解 \\( n \\) 或 \\( k \\)。</li>' +
            '<li><b>报酬/误差模型</b>：把总报酬、总误差写成独立变量之和，再用定理。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 5.11', meta: '基础 · 区间概率',
            q: '某彩票中奖率为 0.02。某人买了 500 张，求中奖张数 \\( X \\) 在 8 到 14 之间的概率（用正态近似）。',
            sol:
              '<p>\\( X\\sim B(500,\\ 0.02) \\)，\\( np=10 \\)，\\( np(1-p)=10\\times0.98=9.8 \\)，\\( \\sqrt{9.8}\\approx3.130 \\)。</p>' +
              '<p>作连续性修正：\\( P\\{8\\leqslant X\\leqslant14\\}\\approx P\\{7.5\\leqslant X\\leqslant14.5\\} \\)：</p>' +
              '<div class="fml">\\( \\approx\\Phi\\!\\left(\\dfrac{14.5-10}{3.130}\\right)-\\Phi\\!\\left(\\dfrac{7.5-10}{3.130}\\right)=\\Phi(1.438)-\\Phi(-0.799) \\)</div>' +
              '<div class="fml">\\( \\approx0.9249-(1-0.7881)=\\mathbf{0.7130} \\)</div>'
          },
          {
            no: '例 5.12', meta: '真题改编 · 误差的累加',
            q: '设某台仪器在测量中每次产生的随机误差 \\( X_i \\) 相互独立，都在 \\( [-1,1] \\) 上服从均匀分布。求 100 次独立测量的误差总和绝对值不超过 10 的概率。',
            sol:
              '<p>均匀分布 \\( U(-1,1) \\)：\\( E(X_i)=0,\\ D(X_i)=\\dfrac{(1-(-1))^2}{12}=\\dfrac13 \\)。</p>' +
              '<p>故 \\( S_{100} \\) 近似服从 \\( N\\!\\left(0,\\ \\dfrac{100}{3}\\right) \\)，标准差 \\( \\dfrac{10}{\\sqrt3}\\approx5.774 \\)。</p>' +
              '<div class="fml">\\( P\\{|S_{100}|\\leqslant10\\}\\approx 2\\Phi\\!\\left(\\dfrac{10}{5.774}\\right)-1=2\\Phi(1.732)-1 \\)</div>' +
              '<p>查表 \\( \\Phi(1.73)\\approx0.9582 \\)，故概率约为 \\( 2\\times0.9582-1=\\mathbf{0.9164} \\)。</p>'
          },
          {
            no: '例 5.13', meta: '提高 · 反求 \\( k \\)',
            q: '某厂生产的产品废品率为 0.01，各产品相互独立。问一箱应装多少件，才能使「废品数不超过 1 件」的概率不小于 0.95？（用泊松近似）',
            sol:
              '<p>设一箱装 \\( n \\) 件，废品数 \\( X\\sim B(n,\\ 0.01) \\)。因 \\( p \\) 很小、\\( n \\) 较大，用泊松近似 \\( \\lambda=np=0.01n \\)：</p>' +
              '<div class="fml">\\( P\\{X\\leqslant1\\}\\approx e^{-\\lambda}(1+\\lambda)\\geqslant0.95 \\)</div>' +
              '<p>试算：\\( \\lambda=0.35 \\) 时 \\( e^{-0.35}(1.35)\\approx0.7047\\times1.35=0.9513\\geqslant0.95 \\)；\\( \\lambda=0.36 \\) 时约 0.9489。故</p>' +
              '<div class="fml">\\( 0.01n\\leqslant0.35\\quad\\Longrightarrow\\quad n\\leqslant35 \\)</div>' +
              '<p>即一箱最多装 <b>35 件</b>。</p>' +
              '<p class="fml-note">这里用泊松而不是正态：\\( p \\) 很小、\\( \\lambda \\) 适中，泊松近似更准。这是「近似方案选择」的典型判断。</p>'
          }
        ],
        pitfalls: [
          '连续性修正的方向记错会带来约 10%–20% 的相对误差：<b>区间一律放宽半格</b>。',
          '对 \\( \\bar X \\) 作标准化时分母是 \\( \\sigma/\\sqrt n \\)，对 \\( S_n \\) 作标准化时分母是 \\( \\sigma\\sqrt n \\)——两者不可混用。',
          '标准正态表的读数只到两位小数，中间值需线性插值；考试一般可直接取值。',
          '\\( \\Phi(-z)=1-\\Phi(z) \\)，负号不要漏。'
        ]
      }

    ]
  };

})(window);
