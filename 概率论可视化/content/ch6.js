/* ============================================================
   ch6.js — 第六章 数理统计的基本概念
   覆盖 2026 大纲「六、数理统计的基本概念」全部考试内容与考试要求
   大纲原文（OCR 自大纲 p.23）：
     考试内容：总体　个体　简单随机样本　统计量　样本均值　样本方差和
               样本矩　χ² 分布　t 分布　F 分布　分位数　正态总体的常用
               抽样分布
     考试要求：1. 理解总体、简单随机样本、统计量、样本均值、样本方差及
                  样本矩的概念，其中样本方差定义为
                  S² = 1/(n−1) Σ(Xi − X̄)²
               2. 了解 χ² 分布、t 分布和 F 分布的概念及性质，了解上侧 α
                  分位数的概念并会查表计算；
               3. 了解正态总体的常用抽样分布．
   ============================================================ */
(function (global) {
  'use strict';

  global.CH6 = {
    id: 'ch6',
    no: '六',
    title: '数理统计的基本概念',
    subtitle: '从「已知分布求概率」转向「已知数据推断分布」—— 总体、样本、统计量是这门语言的三个基本词',
    tags: ['总体', '个体', '简单随机样本', '统计量', '样本均值', '样本方差', '样本矩', 'χ²分布', 't分布', 'F分布', '上侧分位数', '抽样分布'],
    sections: [

      /* ================================================================
         6.1 总体、个体与简单随机样本
         ================================================================ */
      {
        id: 'ch6-s1',
        num: '6.1',
        title: '总体、个体与简单随机样本',
        lead: '数理统计是「由部分推断整体」的科学，它的第一步是把研究对象抽象成一个随机变量，再把观测抽象成一组独立同分布的随机变量。',
        blocks: [
          { t: 'h3', idx: '①', text: '总体与个体' },
          { t: 'card', kind: 'def', tag: '定义', title: '总体与个体', html:
            '<p class="tight">把研究对象的<b>全体</b>称为<b>总体</b>；组成总体的每一个基本单元称为<b>个体</b>。</p>' +
            '<p class="tight">在数理统计中，我们关心的不是个体本身，而是它的某个（或某些）<b>数量指标</b>。因此约定：</p>' +
            '<ul class="none">' +
            '<li><b>总体＝一个随机变量 \\( X \\)</b>，其分布称为<b>总体分布</b>。</li>' +
            '<li>若 \\( X \\) 的分布函数为 \\( F(x) \\)，也称总体 \\( F \\)；若 \\( X \\) 的密度为 \\( f(x) \\)，也称总体 \\( f \\)。</li>' +
            '<li>总体的数字特征 \\( E(X)=\\mu,\\ D(X)=\\sigma^2 \\) 称为<b>总体均值</b>与<b>总体方差</b>。</li>' +
            '</ul>' +
            '<p class="tight"><b>例：</b>「某批灯泡的寿命」是总体，每只灯泡的寿命是样本点，而「寿命」这个数量指标服从的分布就是我们对总体的建模。</p>'
          },
          { t: 'h3', idx: '②', text: '简单随机样本' },
          { t: 'card', kind: 'def', tag: '定义', title: '简单随机样本（i.i.d. 样本）', html:
            '<p class="tight">设 \\( X \\) 是总体。若 \\( X_1,X_2,\\cdots,X_n \\) 相互<b>独立</b>，且每个 \\( X_i \\) 都与总体 \\( X \\) 有<b>相同分布</b>，则称 \\( (X_1,X_2,\\cdots,X_n) \\) 为来自总体 \\( X \\) 的<b>简单随机样本</b>（简称样本），\\( n \\) 称为<b>样本容量</b>。</p>' +
            '<p class="tight">它们的观测值 \\( (x_1,x_2,\\cdots,x_n) \\) 称为<b>样本值</b>（样本观测值）。</p>'
          },
          { t: 'card', kind: 'key', tag: '理解', title: '「独立」与「同分布」各管什么', html:
            '<ul class="none">' +
            '<li><b>同分布</b>：保证每个 \\( X_i \\) 都能代表总体，即「样本是总体的缩影」——没有系统性偏差。</li>' +
            '<li><b>独立</b>：保证一次观测的结果不泄露另一次的信息——没有相互影响。</li>' +
            '</ul>' +
            '<p class="tight"><b>两条合起来</b>，意味着样本中每个个体提供等量的、不重复的新信息，这是后续一切统计推断（估计、检验）的基础。</p>'
          },
          { t: 'card', kind: 'thm', tag: '结论', title: '样本的联合分布', html:
            '<p class="tight">若总体 \\( X \\) 的分布函数为 \\( F(x) \\)，则简单随机样本 \\( (X_1,\\cdots,X_n) \\) 的联合分布函数为</p>' +
            '<div class="fml">\\( F(x_1,x_2,\\cdots,x_n)=\\prod_{i=1}^{n}F(x_i) \\)</div>' +
            '<p class="tight">若总体为连续型，密度为 \\( f(x) \\)，则联合密度为</p>' +
            '<div class="fml">\\( f(x_1,x_2,\\cdots,x_n)=\\prod_{i=1}^{n}f(x_i) \\)</div>' +
            '<p class="tight">若总体为离散型，分布律为 \\( p(x) \\)，则联合分布律为 \\( \\prod_{i=1}^{n}p(x_i) \\)。</p>' +
            '<p class="tight"><b>这是最大似然估计（第七章）的出发点。</b></p>'
          },
          { t: 'viz', build: 'sampling', title: '从总体到样本：抽样的直观图景', sub: '选择总体分布，观察样本直方图如何逼近总体密度' }
        ],
        examples: [
          {
            no: '例 6.1', meta: '基础 · 概念辨析',
            q: '为估计一批产品的废品率 \\( p \\)，从中随机抽取 20 件检验。请指出总体、个体、样本、样本容量与样本值。',
            sol:
              '<ul class="none">' +
              '<li><b>总体</b>：这批产品废品情况的分布，即 \\( X\\sim B(1,p) \\)——每件产品对「是否废品」这个 0–1 指标服从的分布。</li>' +
              '<li><b>个体</b>：每件产品关于「是否废品」的指标值。</li>' +
              '<li><b>样本</b>：\\( (X_1,\\cdots,X_{20}) \\)，其中 \\( X_i=1 \\) 表示第 \\( i \\) 件是废品。</li>' +
              '<li><b>样本容量</b>：\\( n=20 \\)。</li>' +
              '<li><b>样本值</b>：实际抽检结果，如 \\( (1,0,0,1,\\cdots,0) \\)，是一个确定的 0–1 序列。</li>' +
              '</ul>' +
              '<p class="fml-note">关键点：抽样<b>前</b>样本是随机变量（每件产品是否废品未知），抽样<b>后</b>得到确定的数（样本值）。</p>'
          },
          {
            no: '例 6.2', meta: '提高 · 联合分布',
            q: '设总体 \\( X\\sim E(\\lambda) \\)（密度 \\( f(x)=\\lambda e^{-\\lambda x},\\ x>0 \\)），\\( (X_1,\\cdots,X_n) \\) 为简单随机样本。写出其联合密度。',
            sol:
              '<p>由独立性与同分布：</p>' +
              '<div class="fml">\\( f(x_1,\\cdots,x_n)=\\prod_{i=1}^{n}\\lambda e^{-\\lambda x_i}=\\lambda^n e^{-\\lambda\\sum_{i=1}^{n}x_i},\\qquad x_i>0 \\)</div>' +
              '<p class="fml-note">注意这是「关于各 \\( x_i \\) 的连乘」，且每个分量都要求 \\( x_i>0 \\)。写错定义域是常见扣分点。</p>'
          }
        ],
        pitfalls: [
          '总体是<b>随机变量</b>（或其分布），不是一批具体数值；「总体 1000 只灯泡」是通俗说法，数学上指寿命这个变量。',
          '样本 \\( (X_1,\\cdots,X_n) \\) 是 <b>\\( n \\) 维随机变量</b>，而样本值 \\( (x_1,\\cdots,x_n) \\) 是常数向量，两者不可混用。',
          '简单随机样本必须同时满足<b>独立</b>与<b>同分布</b>；有放回抽样才天然满足独立，无放回抽样一般<b>不</b>是简单随机样本。',
          '写联合分布时不要漏掉各分量的定义域（支撑集）条件。'
        ]
      },

      /* ================================================================
         6.2 统计量、样本均值与样本矩
         ================================================================ */
      {
        id: 'ch6-s2',
        num: '6.2',
        title: '统计量与样本矩',
        lead: '统计量是「样本的加工品」—— 它把 \\( n \\) 个数据压缩成少数几个数，且压缩过程不能依赖任何未知参数。',
        blocks: [
          { t: 'h3', idx: '①', text: '统计量' },
          { t: 'card', kind: 'def', tag: '定义', title: '统计量', html:
            '<p class="tight">设 \\( (X_1,X_2,\\cdots,X_n) \\) 是来自总体 \\( X \\) 的样本。若 \\( g(x_1,\\cdots,x_n) \\) 是一个 <b>不含任何未知参数</b> 的普通函数，则称</p>' +
            '<div class="fml">\\( T=g(X_1,X_2,\\cdots,X_n) \\)</div>' +
            '<p class="tight">为一个<b>统计量</b>；代入样本值后得到的具体数值称为该统计量的<b>观测值</b>。</p>' +
            '<p class="tight"><b>关键限制：</b>统计量中<b>不能含未知参数</b>，但可以含<b>已知参数</b>。这是判定一个式子是否为统计量的唯一标准。</p>'
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '判断是否为统计量', html:
            '<p class="tight">设 \\( X\\sim N(\\mu,\\sigma^2) \\)，其中 \\( \\mu \\) 未知、\\( \\sigma^2 \\) 未知，样本为 \\( X_1,\\cdots,X_n \\)：</p>' +
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>表达式</th><th class="center">是否统计量</th><th>理由</th></tr></thead><tbody>' +
            '<tr><td>\\( \\bar X=\\dfrac1n\\sum X_i \\)</td><td class="center" style="color:var(--green)">是</td><td>只含样本</td></tr>' +
            '<tr><td>\\( \\sum(X_i-\\mu)^2 \\)</td><td class="center" style="color:var(--red)">不是</td><td>含未知参数 \\( \\mu \\)</td></tr>' +
            '<tr><td>\\( \\dfrac1{\\sigma^2}\\sum(X_i-\\bar X)^2 \\)</td><td class="center" style="color:var(--red)">不是</td><td>含未知参数 \\( \\sigma^2 \\)</td></tr>' +
            '<tr><td>\\( \\max\\{X_1,\\cdots,X_n\\} \\)</td><td class="center" style="color:var(--green)">是</td><td>只含样本</td></tr>' +
            '</tbody></table></div>' +
            '<p class="tight" style="margin-top:10px">若 \\( \\mu \\) 已知而 \\( \\sigma^2 \\) 未知，则 \\( \\sum(X_i-\\mu)^2 \\) <b>就</b>是统计量 —— 判定要依据「哪些参数已知」。</p>'
          },
          { t: 'h3', idx: '②', text: '常用统计量：样本均值、样本方差与样本矩' },
          { t: 'card', kind: 'def', tag: '定义', title: '五个核心统计量', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>样本均值：</b>\\( \\bar X=\\dfrac1n\\sum_{i=1}^{n}X_i \\)</div>' +
            '<div class="fml-row"><b>样本方差（大纲指定定义）：</b>\\( S^2=\\dfrac{1}{n-1}\\sum_{i=1}^{n}(X_i-\\bar X)^2 \\)</div>' +
            '<div class="fml-row"><b>样本标准差：</b>\\( S=\\sqrt{S^2} \\)</div>' +
            '<div class="fml-row"><b>样本 \\( k \\) 阶原点矩：</b>\\( A_k=\\dfrac1n\\sum_{i=1}^{n}X_i^k\\qquad(k=1,2,\\cdots) \\)</div>' +
            '<div class="fml-row"><b>样本 \\( k \\) 阶中心矩：</b>\\( B_k=\\dfrac1n\\sum_{i=1}^{n}(X_i-\\bar X)^k\\qquad(k=1,2,\\cdots) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>注意：</b>\\( A_1=\\bar X \\)；一阶中心矩 \\( B_1=\\dfrac1n\\sum(X_i-\\bar X)=0 \\)（恒成立，可作为计算自检）。</p>'
          },
          { t: 'card', kind: 'warn', tag: '重点', title: '分母为什么是 \\( n-1 \\) 而不是 \\( n \\)', html:
            '<p class="tight">记未修正的「样本二阶中心矩」为</p>' +
            '<div class="fml">\\( B_2=\\dfrac1n\\sum_{i=1}^{n}(X_i-\\bar X)^2=\\dfrac{n-1}{n}S^2 \\)</div>' +
            '<p class="tight">两者只差一个系数，但性质完全不同：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>\\( S^2 \\)：</b>\\( E(S^2)=\\sigma^2 \\) —— <b>无偏</b>（不偏大也不偏小）</div>' +
            '<div class="fml-row"><b>\\( B_2 \\)：</b>\\( E(B_2)=\\dfrac{n-1}{n}\\sigma^2 \\) —— <b>系统性偏小</b></div>' +
            '</div>' +
            '<p class="tight"><b>直观解释：</b>数据本来就围绕 \\( \\bar X \\)（样本自己的中心）散布，比围绕真实的 \\( \\mu \\) 更紧密，因此除以 \\( n \\) 会低估方差；除以 \\( n-1 \\) 恰好补偿掉这一项（消掉一个自由度）。</p>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '样本均值的期望与方差（必记）', html:
            '<p class="tight">设 \\( E(X)=\\mu,\\ D(X)=\\sigma^2 \\)，则对简单随机样本：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>无偏性：</b>\\( E(\\bar X)=\\mu \\)</div>' +
            '<div class="fml-row"><b>方差：</b>\\( D(\\bar X)=\\dfrac{\\sigma^2}{n} \\)（\\( n \\) 越大，估计越稳）</div>' +
            '<div class="fml-row"><b>正态总体下：</b>\\( \\bar X\\sim N\\!\\left(\\mu,\\dfrac{\\sigma^2}{n}\\right) \\)</div>' +
            '</div>' +
            '<p class="tight"><b>推导要点：</b>\\( D(\\bar X)=\\dfrac{1}{n^2}\\sum D(X_i)=\\dfrac{n\\sigma^2}{n^2}=\\dfrac{\\sigma^2}{n} \\)，用到了独立性。</p>'
          },
          { t: 'viz', build: 'sampleStats', title: '样本均值与样本方差：逐步计算', sub: '输入或随机生成样本，逐步核对 X̄、S²、B₂ 的关系' }
        ],
        examples: [
          {
            no: '例 6.3', meta: '基础 · 概念判定',
            q: '设总体 \\( X\\sim N(\\mu,\\sigma^2) \\)，\\( \\mu \\) 已知、\\( \\sigma^2 \\) 未知，\\( X_1,\\cdots,X_6 \\) 为样本。判断下列各式哪些是统计量：<br>(1) \\( \\sum_{i=1}^{6}(X_i-\\mu)^2 \\)；(2) \\( \\dfrac{1}{\\sigma^2}\\sum_{i=1}^{6}(X_i-\\bar X)^2 \\)；(3) \\( \\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt6} \\)；(4) \\( X_1+X_6 \\)。',
            sol:
              '<ul class="none">' +
              '<li><b>(1) 是</b>：\\( \\mu \\) 已知，式中不含未知量。</li>' +
              '<li><b>(2) 不是</b>：含未知参数 \\( \\sigma^2 \\)。</li>' +
              '<li><b>(3) 不是</b>：含未知参数 \\( \\sigma \\)。</li>' +
              '<li><b>(4) 是</b>：只是样本的函数。</li>' +
              '</ul>'
          },
          {
            no: '例 6.4', meta: '真题改编 · 计算样本均值与样本方差',
            q: '从总体中抽取容量为 5 的样本：\\( 4,\\ 6,\\ 5,\\ 7,\\ 8 \\)。求样本均值 \\( \\bar x \\)、样本方差 \\( s^2 \\) 与未修正的样本二阶中心矩 \\( b_2 \\)。',
            sol:
              '<p><b>样本均值：</b></p>' +
              '<div class="fml">\\( \\bar x=\\dfrac{4+6+5+7+8}{5}=\\dfrac{30}{5}=6 \\)</div>' +
              '<p><b>偏差平方和：</b></p>' +
              '<div class="fml">\\( \\sum(x_i-\\bar x)^2=(-2)^2+0^2+(-1)^2+1^2+2^2=4+0+1+1+4=10 \\)</div>' +
              '<p><b>样本方差与未修正矩：</b></p>' +
              '<div class="fml">\\( s^2=\\dfrac{10}{5-1}=2.5,\\qquad b_2=\\dfrac{10}{5}=2 \\)</div>' +
              '<p class="fml-note">校验：\\( b_2=\\dfrac{n-1}{n}s^2=\\dfrac45\\times2.5=2 \\) ✓</p>'
          },
          {
            no: '例 6.5', meta: '提高 · 证明 S² 无偏',
            q: '设 \\( E(X)=\\mu,\\ D(X)=\\sigma^2 \\)，\\( X_1,\\cdots,X_n \\) 为样本。证明 \\( E(S^2)=\\sigma^2 \\)。',
            sol:
              '<p>利用恒等式 \\( \\sum(X_i-\\bar X)^2=\\sum(X_i-\\mu)^2-n(\\bar X-\\mu)^2 \\)（请自行展开验证）：</p>' +
              '<div class="fml">\\( \\sum_{i=1}^{n}(X_i-\\bar X)^2=\\sum_{i=1}^{n}(X_i-\\mu)^2-2(\\bar X-\\mu)\\sum_{i=1}^{n}(X_i-\\mu)+n(\\bar X-\\mu)^2 \\)</div>' +
              '<p>而 \\( \\sum(X_i-\\mu)=n(\\bar X-\\mu) \\)，故后两项合并为 \\( -n(\\bar X-\\mu)^2 \\)。于是</p>' +
              '<div class="fml">\\( E\\!\\left[\\sum(X_i-\\bar X)^2\\right]=\\sum E(X_i-\\mu)^2-nE(\\bar X-\\mu)^2=n\\sigma^2-n\\cdot\\dfrac{\\sigma^2}{n}=(n-1)\\sigma^2 \\)</div>' +
              '<p>两边除以 \\( n-1 \\)：</p>' +
              '<div class="fml">\\( E(S^2)=\\dfrac{(n-1)\\sigma^2}{n-1}=\\sigma^2 \\)</div>' +
              '<p class="fml-note">同一推导立刻给出 \\( E(B_2)=\\dfrac{n-1}{n}\\sigma^2 \\)，即 \\( B_2 \\) <b>有偏</b>。</p>'
          },
          {
            no: '例 6.6', meta: '提高 · 常见零和恒等式',
            q: '设 \\( X_1,\\cdots,X_n \\) 为样本，\\( \\bar X \\) 为样本均值。证明 \\( \\sum_{i=1}^{n}(X_i-\\bar X)=0 \\) 与 \\( \\sum_{i=1}^{n}(X_i-\\bar X)(X_i-a)=0 \\) 对 \\( a=\\bar X \\) 成立，并说明后者的用途。',
            sol:
              '<p><b>第一个：</b></p>' +
              '<div class="fml">\\( \\sum(X_i-\\bar X)=\\sum X_i-n\\bar X=n\\bar X-n\\bar X=0 \\)</div>' +
              '<p><b>第二个：</b>展开得</p>' +
              '<div class="fml">\\( \\sum(X_i-\\bar X)(X_i-a)=\\sum(X_i-\\bar X)^2-(a-\\bar X)\\sum(X_i-\\bar X)=\\sum(X_i-\\bar X)^2 \\)</div>' +
              '<p>取 \\( a=\\bar X \\) 时第二项为 0，故恒等式成立。</p>' +
              '<p class="fml-note"><b>用途：</b>\\( \\sum(X_i-a)^2=\\sum(X_i-\\bar X)^2+n(\\bar X-a)^2 \\) —— 这说明<b>样本均值使偏差平方和达到最小</b>，是「最小二乘」思想的雏形。</p>'
          }
        ],
        pitfalls: [
          '统计量的判定标准是「<b>不含未知参数</b>」，而不是「不含参数」——\\( \\mu \\) 已知时 \\( \\sum(X_i-\\mu)^2 \\) 仍是统计量。',
          '样本方差 \\( S^2 \\) 的分母是 \\( n-1 \\)（大纲明确规定），不是 \\( n \\)，也不是 \\( n+1 \\)。',
          '\\( D(\\bar X)=\\sigma^2/n \\) 而不是 \\( \\sigma^2 \\)；漏掉 \\( 1/n \\) 是最常见的错误。',
          '一阶中心矩恒为 0，但二阶中心矩不为 0；不要把两者混为一谈。'
        ]
      },

      /* ================================================================
         6.3 χ² 分布、t 分布与 F 分布
         ================================================================ */
      {
        id: 'ch6-s3',
        num: '6.3',
        title: 'χ² 分布、t 分布与 F 分布',
        lead: '这三大分布都是「正态变量加工而成」的抽样分布，它们构成了区间估计与假设检验的全部工具。',
        blocks: [
          { t: 'h3', idx: '①', text: 'χ² 分布' },
          { t: 'card', kind: 'def', tag: '定义', title: 'χ² 分布', html:
            '<p class="tight">设 \\( X_1,X_2,\\cdots,X_n \\) 相互独立且都服从 \\( N(0,1) \\)，则称</p>' +
            '<div class="fml">\\( \\chi^2=X_1^2+X_2^2+\\cdots+X_n^2 \\)</div>' +
            '<p class="tight">服从自由度为 \\( n \\) 的 <b>\\( \\chi^2 \\) 分布</b>，记作 \\( \\chi^2\\sim\\chi^2(n) \\)。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: 'χ² 分布的三条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 期望与方差：</b>\\( E(\\chi^2)=n,\\qquad D(\\chi^2)=2n \\)</div>' +
            '<div class="fml-row"><b>2. 可加性：</b>若 \\( \\chi_1^2\\sim\\chi^2(n_1),\\ \\chi_2^2\\sim\\chi^2(n_2) \\) 且相互独立，则 \\( \\chi_1^2+\\chi_2^2\\sim\\chi^2(n_1+n_2) \\)</div>' +
            '<div class="fml-row"><b>3. 非负性与形态：</b>取值非负、右偏；\\( n \\) 增大时逐渐对称并趋向正态</div>' +
            '</div>' +
            '<p class="tight"><b>密度表达式（只需了解）：</b></p>' +
            '<div class="fml">\\( f(x)=\\dfrac{1}{2^{n/2}\\Gamma(n/2)}x^{n/2-1}e^{-x/2},\\qquad x>0 \\)</div>'
          },
          { t: 'viz', build: 'chi2Dist', title: 'χ² 分布：自由度决定形态', sub: '拖动 n，观察密度曲线与上侧分位数' },
          { t: 'viz', build: 'chi2Sim', title: 'χ² 分布的构造：正态平方和的模拟', sub: '增大自由度 n，观察模拟直方图贴合理论密度并核对 E=n、D=2n' },
          { t: 'h3', idx: '②', text: 't 分布' },
          { t: 'card', kind: 'def', tag: '定义', title: 't 分布（学生氏分布）', html:
            '<p class="tight">设 \\( X\\sim N(0,1) \\)，\\( Y\\sim\\chi^2(n) \\)，且 \\( X \\) 与 \\( Y \\) <b>相互独立</b>，则称</p>' +
            '<div class="fml">\\( T=\\dfrac{X}{\\sqrt{Y/n}} \\)</div>' +
            '<p class="tight">服从自由度为 \\( n \\) 的 <b>\\( t \\) 分布</b>，记作 \\( T\\sim t(n) \\)。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: 't 分布的四条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 对称性：</b>密度关于原点对称，即 \\( f(-x)=f(x) \\)；\\( E(T)=0 \\)（\\( n>1 \\)）</div>' +
            '<div class="fml-row"><b>2. 厚尾：</b>比标准正态的尾部<b>更厚</b>，即同样的分位点 \\( t_\\alpha(n)>u_\\alpha \\)</div>' +
            '<div class="fml-row"><b>3. 极限：</b>\\( n\\to\\infty \\) 时 \\( t(n) \\) 趋于 \\( N(0,1) \\)，实际 \\( n\\geqslant45 \\) 时两者已很接近</div>' +
            '<div class="fml-row"><b>4. 方差：</b>\\( D(T)=\\dfrac{n}{n-2} \\)（\\( n>2 \\)），比 1 略大</div>' +
            '</div>'
          },
          { t: 'viz', build: 'tDist', title: 't 分布与标准正态：尾部厚度对比', sub: '拖动 n，观察 t 曲线向 N(0,1) 收敛' },
          { t: 'h3', idx: '③', text: 'F 分布' },
          { t: 'card', kind: 'def', tag: '定义', title: 'F 分布', html:
            '<p class="tight">设 \\( U\\sim\\chi^2(m) \\)，\\( V\\sim\\chi^2(n) \\)，且 \\( U \\) 与 \\( V \\) <b>相互独立</b>，则称</p>' +
            '<div class="fml">\\( F=\\dfrac{U/m}{V/n} \\)</div>' +
            '<p class="tight">服从自由度为 \\( m \\) 与 \\( n \\) 的 <b>F 分布</b>，记作 \\( F\\sim F(m,n) \\)。\\( m \\) 称为第一自由度，\\( n \\) 称为第二自由度。</p>'
          },
          { t: 'card', kind: 'thm', tag: '性质', title: 'F 分布的三条性质', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 倒数：</b>若 \\( F\\sim F(m,n) \\)，则 \\( \\dfrac1F\\sim F(n,m) \\)</div>' +
            '<div class="fml-row"><b>2. 与 t 的关系：</b>若 \\( T\\sim t(n) \\)，则 \\( T^2\\sim F(1,n) \\)</div>' +
            '<div class="fml-row"><b>3. 期望：</b>\\( E(F)=\\dfrac{n}{n-2} \\)（\\( n>2 \\)）</div>' +
            '</div>' +
            '<p class="tight"><b>由此得到分位数的转换公式（查表常用）：</b></p>' +
            '<div class="fml">\\( F_{1-\\alpha}(m,n)=\\dfrac{1}{F_\\alpha(n,m)} \\)</div>'
          },
          { t: 'viz', build: 'fDist', title: 'F 分布：两个自由度共同塑形', sub: '拖动 m、n，观察密度曲线与峰值位置' },
          { t: 'card', kind: 'tip', tag: '速记', title: '三大分布的关系图', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>分布</th><th>构造</th><th>典型用途</th></tr></thead><tbody>' +
            '<tr><td>\\( \\chi^2(n) \\)</td><td>\\( n \\) 个标准正态的<b>平方和</b></td><td>正态总体<b>方差</b>的估计与检验</td></tr>' +
            '<tr><td>\\( t(n) \\)</td><td>标准正态 <b>除以</b> 独立 \\( \\chi^2 \\) 的开方</td><td>\\( \\sigma \\) 未知时正态总体<b>均值</b>的估计与检验</td></tr>' +
            '<tr><td>\\( F(m,n) \\)</td><td>两个独立 \\( \\chi^2 \\) 的<b>比</b>（各除自由度）</td><td>两个正态总体<b>方差比</b>与方差分析</td></tr>' +
            '</tbody></table></div>'
          }
        ],
        examples: [
          {
            no: '例 6.7', meta: '基础 · χ² 的期望与方差',
            q: '设 \\( \\chi^2\\sim\\chi^2(8) \\)。求 \\( E(\\chi^2) \\)、\\( D(\\chi^2) \\)，并求 \\( E\\!\\left[\\left(\\dfrac{\\chi^2-8}{4}\\right)^2\\right] \\)。',
            sol:
              '<div class="fml">\\( E(\\chi^2)=n=8,\\qquad D(\\chi^2)=2n=16 \\)</div>' +
              '<p>第二个式子即标准化的平方：</p>' +
              '<div class="fml">\\( E\\!\\left[\\left(\\dfrac{\\chi^2-8}{4}\\right)^2\\right]=\\dfrac{1}{16}E\\big[(\\chi^2-8)^2\\big]=\\dfrac{D(\\chi^2)}{16}=\\dfrac{16}{16}=\\mathbf{1} \\)</div>'
          },
          {
            no: '例 6.8', meta: '提高 · χ² 的可加性',
            q: '设 \\( X_1,\\cdots,X_6 \\) 独立同服从 \\( N(0,1) \\)，\\( Y_1,\\cdots,Y_4 \\) 独立同服从 \\( N(0,1) \\)，且两组相互独立。求 \\( \\sum_{i=1}^{6}X_i^2+\\sum_{j=1}^{4}Y_j^2 \\) 服从的分布，并求其期望与方差。',
            sol:
              '<p>由定义 \\( \\sum_{i=1}^{6}X_i^2\\sim\\chi^2(6) \\)，\\( \\sum_{j=1}^{4}Y_j^2\\sim\\chi^2(4) \\)，且两者独立，由<b>可加性</b>：</p>' +
              '<div class="fml">\\( \\sum_{i=1}^{6}X_i^2+\\sum_{j=1}^{4}Y_j^2\\ \\sim\\ \\chi^2(6+4)=\\chi^2(10) \\)</div>' +
              '<div class="fml">\\( E=10,\\qquad D=2\\times10=20 \\)</div>'
          },
          {
            no: '例 6.9', meta: '提高 · t 与 F 的互相转化',
            q: '设 \\( T\\sim t(10) \\)。求 \\( T^2 \\) 服从的分布，并写出 \\( P\\{T^2>c\\}=0.05 \\) 中 \\( c \\) 与某个 F 分位数的关系。',
            sol:
              '<p>由性质 2：</p>' +
              '<div class="fml">\\( T^2\\sim F(1,10) \\)</div>' +
              '<p>于是</p>' +
              '<div class="fml">\\( P\\{T^2>c\\}=0.05\\quad\\Longleftrightarrow\\quad c=F_{0.05}(1,10) \\)</div>' +
              '<p class="fml-note">也可由 \\( t \\) 分布的对称性写成 \\( c=\\big[t_{0.025}(10)\\big]^2 \\)。两种写法等价，是查表练习的常见考点。</p>'
          },
          {
            no: '例 6.10', meta: '提高 · F 的倒数性质',
            q: '已知 \\( F_{0.05}(5,8)=3.69 \\)。求 \\( F_{0.95}(8,5) \\)。',
            sol:
              '<p>由倒数性质 \\( F_{1-\\alpha}(m,n)=\\dfrac{1}{F_\\alpha(n,m)} \\)，取 \\( m=8,\\ n=5,\\ \\alpha=0.05 \\)：</p>' +
              '<div class="fml">\\( F_{0.95}(8,5)=\\dfrac{1}{F_{0.05}(5,8)}=\\dfrac{1}{3.69}\\approx\\mathbf{0.271} \\)</div>' +
              '<p class="fml-note">因为几乎所有 F 分布表只给出「上侧小概率」，左侧分位数全靠这个公式反算。</p>'
          }
        ],
        pitfalls: [
          '\\( \\chi^2(n) \\) 是 \\( n \\) 个<b>标准</b>正态的平方和；若 \\( X_i\\sim N(\\mu,\\sigma^2) \\)，必须先标准化，\\( \\sum(X_i-\\mu)^2/\\sigma^2\\sim\\chi^2(n) \\)。',
          '\\( D(\\chi^2)=2n \\)，不是 \\( n \\)，也不是 \\( n^2 \\)。',
          '构造 \\( t \\) 与 \\( F \\) 时，分子分母的随机变量必须<b>相互独立</b>，否则结论不成立。',
          '\\( F \\) 分布的两个自由度<b>顺序不同则分布不同</b>：\\( F(m,n)\\neq F(n,m) \\)（只有倒数关系）。'
        ]
      },

      /* ================================================================
         6.4 上侧 α 分位数
         ================================================================ */
      {
        id: 'ch6-s4',
        num: '6.4',
        title: '上侧 α 分位数',
        lead: '区间估计与假设检验的全部临界值都来自分位数 —— 理解「上侧」二字的含义，才能正确查表、正确设拒绝域。',
        blocks: [
          { t: 'h3', idx: '①', text: '定义' },
          { t: 'card', kind: 'def', tag: '定义', title: '上侧 α 分位数', html:
            '<p class="tight">设 \\( X \\) 是随机变量，\\( 0<\\alpha<1 \\)。若数 \\( z_\\alpha \\) 满足</p>' +
            '<div class="fml">\\( P\\{X>z_\\alpha\\}=\\alpha \\)</div>' +
            '<p class="tight">则称 \\( z_\\alpha \\) 为 \\( X \\) 的<b>上侧 \\( \\alpha \\) 分位数</b>（或上侧 \\( \\alpha \\) 分位点）。</p>' +
            '<p class="tight"><b>几何含义：</b>密度曲线下，\\( z_\\alpha \\) <b>右侧</b>的面积为 \\( \\alpha \\)。故 \\( \\alpha \\) 越小，分位数越靠<b>右</b>。</p>'
          },
          { t: 'card', kind: 'key', tag: '记号', title: '常用分布的记法', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>标准正态：</b>\\( u_\\alpha \\)，满足 \\( P\\{X>u_\\alpha\\}=\\alpha \\)，即 \\( \\Phi(u_\\alpha)=1-\\alpha \\)</div>' +
            '<div class="fml-row"><b>\\( \\chi^2 \\) 分布：</b>\\( \\chi^2_\\alpha(n) \\)，满足 \\( P\\{\\chi^2>\\chi^2_\\alpha(n)\\}=\\alpha \\)</div>' +
            '<div class="fml-row"><b>\\( t \\) 分布：</b>\\( t_\\alpha(n) \\)，满足 \\( P\\{T>t_\\alpha(n)\\}=\\alpha \\)</div>' +
            '<div class="fml-row"><b>\\( F \\) 分布：</b>\\( F_\\alpha(m,n) \\)，满足 \\( P\\{F>F_\\alpha(m,n)\\}=\\alpha \\)</div>' +
            '</div>' +
            '<p class="tight"><b>高频数值（务必背下）：</b>\\( u_{0.025}=1.96,\\quad u_{0.05}=1.645,\\quad u_{0.005}=2.576 \\)。</p>'
          },
          { t: 'viz', build: 'quantile', title: '上侧 α 分位数：面积与临界值', sub: '选择分布与 α，观察右侧面积 α 如何确定分位数' },
          { t: 'h3', idx: '②', text: '对称性与转换公式' },
          { t: 'card', kind: 'thm', tag: '公式', title: '五个必记的转换', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>1. 正态对称：</b>\\( u_{1-\\alpha}=-u_\\alpha \\)（因为 \\( \\Phi(-x)=1-\\Phi(x) \\)）</div>' +
            '<div class="fml-row"><b>2. t 的对称：</b>\\( t_{1-\\alpha}(n)=-t_\\alpha(n) \\)（\\( t \\) 密度关于 0 对称）</div>' +
            '<div class="fml-row"><b>3. F 的倒数：</b>\\( F_{1-\\alpha}(m,n)=\\dfrac{1}{F_\\alpha(n,m)} \\)</div>' +
            '<div class="fml-row"><b>4. t 与 F：</b>\\( T\\sim t(n)\\Rightarrow T^2\\sim F(1,n) \\)，故 \\( \\big[t_{\\alpha/2}(n)\\big]^2=F_\\alpha(1,n) \\)</div>' +
            '<div class="fml-row"><b>5. 正态与 χ²：</b>\\( u_{\\alpha/2}^2=\\chi^2_\\alpha(1) \\)</div>' +
            '</div>'
          },
          { t: 'card', kind: 'tip', tag: '易错辨析', title: '「上侧」与「双侧」不要混', html:
            '<p class="tight">以正态为例，两个常用量含义完全不同：</p>' +
            '<ul class="none">' +
            '<li>\\( u_{0.025}=1.96 \\)：<b>右侧</b>面积 0.025。</li>' +
            '<li>「双侧 \\( 0.05 \\)」的两条临界线也是 \\( \\pm1.96 \\)，因为每侧面积是 \\( 0.05/2=0.025 \\)。</li>' +
            '</ul>' +
            '<p class="tight">所以在双侧检验中写 \\( \\alpha=0.05 \\) 时，查表用的是 <b>\\( u_{\\alpha/2}=u_{0.025} \\)</b>，而不是 \\( u_{0.05} \\)。这是最高频的查表错误。</p>'
          }
        ],
        examples: [
          {
            no: '例 6.11', meta: '基础 · 查表与对称性',
            q: '已知 \\( \\Phi(1.645)=0.95 \\)。求 \\( u_{0.05} \\)、\\( u_{0.95} \\)。',
            sol:
              '<p>由定义 \\( \\Phi(u_\\alpha)=1-\\alpha \\)：</p>' +
              '<div class="fml">\\( \\Phi(u_{0.05})=0.95\\ \\Longrightarrow\\ u_{0.05}=1.645 \\)</div>' +
              '<p>再由对称性：</p>' +
              '<div class="fml">\\( u_{0.95}=-u_{0.05}=-1.645 \\)</div>' +
              '<p class="fml-note">记忆法：\\( \\alpha \\) 小（0.05）\\( \\Rightarrow \\) 分位数靠右（正数）；\\( \\alpha \\) 大（0.95）\\( \\Rightarrow \\) 分位数靠左（负数）。</p>'
          },
          {
            no: '例 6.12', meta: '真题改编 · t 分位数的用法',
            q: '设 \\( T\\sim t(15) \\)，\\( t_{0.05}(15)=1.7531 \\)。求 \\( c \\) 使得 \\( P\\{|T|>c\\}=0.10 \\)。',
            sol:
              '<p>由对称性，\\( P\\{|T|>c\\}=2P\\{T>c\\} \\)，故要求 \\( P\\{T>c\\}=0.05 \\)，即</p>' +
              '<div class="fml">\\( c=t_{0.05}(15)=\\mathbf{1.7531} \\)</div>' +
              '<p class="fml-note">双侧检验中「每侧面积 = \\( \\alpha/2 \\)」，所以 \\( \\alpha=0.10 \\) 的双侧临界值就是单侧 \\( 0.05 \\) 的分位数。</p>'
          },
          {
            no: '例 6.13', meta: '提高 · 由 χ² 分位数反求概率',
            q: '设 \\( \\chi^2\\sim\\chi^2(9) \\)，已知 \\( \\chi^2_{0.05}(9)=16.919,\\ \\chi^2_{0.95}(9)=3.325 \\)。求 \\( P\\{3.325<\\chi^2<16.919\\} \\)。',
            sol:
              '<p>注意 \\( \\chi^2_{0.95}(9)=3.325 \\) 表示 \\( P\\{\\chi^2>3.325\\}=0.95 \\)，即「小于 3.325 的概率」为 0.05。</p>' +
              '<div class="fml">\\( P\\{3.325<\\chi^2<16.919\\}=P\\{\\chi^2>3.325\\}-P\\{\\chi^2>16.919\\}=0.95-0.05=\\mathbf{0.90} \\)</div>' +
              '<p class="fml-note">这是最常见的「\\( \\chi^2 \\) 型置信区间」概率结构，记住「大减小」的写法。</p>'
          }
        ],
        pitfalls: [
          '混淆 \\( u_{\\alpha} \\) 与 \\( u_{\\alpha/2} \\)：单侧用 \\( \\alpha \\)，双侧用 \\( \\alpha/2 \\)。',
          '\\( \\Phi(u_\\alpha)=1-\\alpha \\)，不是 \\( \\alpha \\)；这是「\\( \\alpha \\) 是右尾面积」的直接后果。',
          '\\( F \\) 分布分位数不能直接由对称性得到（分布不对称），必须用倒数公式。',
          '\\( \\chi^2 \\) 与 \\( F \\) 分布的密度都不对称，左侧分位数不能取负号。'
        ]
      },

      /* ================================================================
         6.5 正态总体的常用抽样分布
         ================================================================ */
      {
        id: 'ch6-s5',
        num: '6.5',
        title: '正态总体的常用抽样分布',
        lead: '四个定理构成全部区间估计与假设检验的骨架 —— 把正态总体样本的均值、方差与三大分布接上电。',
        blocks: [
          { t: 'card', kind: 'thm', tag: '定理组', title: '设 \\( X_1,\\cdots,X_n \\) 为来自 \\( N(\\mu,\\sigma^2) \\) 的简单随机样本', html:
            '<p class="tight"><b>定理 1（样本均值的分布）：</b></p>' +
            '<div class="fml">\\( \\bar X\\sim N\\!\\left(\\mu,\\ \\dfrac{\\sigma^2}{n}\\right)\\qquad\\Longleftrightarrow\\qquad \\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n}\\sim N(0,1) \\)</div>' +
            '<p class="tight"><b>定理 2（样本方差的分布）：</b></p>' +
            '<div class="fml">\\( \\dfrac{(n-1)S^2}{\\sigma^2}=\\dfrac{1}{\\sigma^2}\\sum_{i=1}^{n}(X_i-\\bar X)^2\\ \\sim\\ \\chi^2(n-1) \\)</div>' +
            '<p class="tight"><b>定理 3（独立性）：</b>\\( \\bar X \\) 与 \\( S^2 \\) <b>相互独立</b>。</p>' +
            '<p class="tight"><b>定理 4（t 统计量）：</b>当 \\( \\sigma \\) 未知时，由定理 1–3 得</p>' +
            '<div class="fml">\\( T=\\dfrac{\\bar X-\\mu}{S/\\sqrt n}\\ \\sim\\ t(n-1) \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '核心', title: '定理 4 的推导（考点）', html:
            '<p class="tight">把 \\( T \\) 拆成「标准正态 ÷ 独立 \\( \\chi^2 \\) 的开方」：</p>' +
            '<div class="fml">\\( T=\\dfrac{\\bar X-\\mu}{S/\\sqrt n}=\\dfrac{\\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n}}{\\sqrt{\\dfrac{(n-1)S^2}{\\sigma^2}\\Big/(n-1)}} \\)</div>' +
            '<p class="tight">分子 \\( \\sim N(0,1) \\)（定理 1），分母根号内 \\( \\sim\\chi^2(n-1) \\)（定理 2），两者独立（定理 3），按 \\( t \\) 分布定义即得 \\( T\\sim t(n-1) \\)。</p>' +
            '<p class="tight"><b>自由度为什么是 \\( n-1 \\)：</b>因为 \\( \\sum(X_i-\\bar X)=0 \\)，\\( n \\) 个偏差中只有 \\( n-1 \\) 个可以自由变动。</p>'
          },
          { t: 'card', kind: 'tip', tag: '速查', title: '常用统计量总表', html:
            '<div class="tbl-wrap" style="margin:0"><table class="tbl">' +
            '<thead><tr><th>统计量</th><th>分布</th><th>适用条件</th></tr></thead><tbody>' +
            '<tr><td>\\( \\dfrac{\\bar X-\\mu}{\\sigma/\\sqrt n} \\)</td><td>\\( N(0,1) \\)</td><td>正态总体，\\( \\sigma \\) <b>已知</b></td></tr>' +
            '<tr><td>\\( \\dfrac{\\bar X-\\mu}{S/\\sqrt n} \\)</td><td>\\( t(n-1) \\)</td><td>正态总体，\\( \\sigma \\) <b>未知</b></td></tr>' +
            '<tr><td>\\( \\dfrac{1}{\\sigma^2}\\sum(X_i-\\mu)^2 \\)</td><td>\\( \\chi^2(n) \\)</td><td>正态总体，\\( \\mu \\) 已知</td></tr>' +
            '<tr><td>\\( \\dfrac{(n-1)S^2}{\\sigma^2} \\)</td><td>\\( \\chi^2(n-1) \\)</td><td>正态总体，\\( \\mu \\) 未知</td></tr>' +
            '<tr><td>\\( \\dfrac{S_1^2/\\sigma_1^2}{S_2^2/\\sigma_2^2} \\)</td><td>\\( F(n_1-1,\\ n_2-1) \\)</td><td>两个<b>独立</b>正态总体</td></tr>' +
            '</tbody></table></div>'
          },
          { t: 'viz', build: 'normalSampling', title: '正态总体的抽样分布：定理链条', sub: '用蒙特卡洛模拟验证四个定理' },
          { t: 'card', kind: 'exam', tag: '高频', title: '命题模式', html:
            '<ul class="none">' +
            '<li><b>判断统计量分布</b>：给出线性组合或平方和，判断服从什么分布、自由度是多少。</li>' +
            '<li><b>标准化组合</b>：把 \\( \\sum a_iX_i \\) 型统计量标准化为 \\( N(0,1) \\)。</li>' +
            '<li><b>凑 t 或 F</b>：把式子整理成「\\( N(0,1) \\) ÷ \\( \\sqrt{\\chi^2/\\text{df}} \\)」的形状。</li>' +
            '<li><b>两个总体的组合</b>：\\( \\bar X-\\bar Y\\sim N\\!\\left(\\mu_1-\\mu_2,\\ \\frac{\\sigma_1^2}{n_1}+\\frac{\\sigma_2^2}{n_2}\\right) \\)。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 6.14', meta: '基础 · 样本均值的分布',
            q: '设 \\( X_1,\\cdots,X_{16} \\) 为来自 \\( N(3,\\ 4) \\) 的样本。求 \\( P\\{\\bar X>4\\} \\)。',
            sol:
              '<p>\\( \\bar X\\sim N\\!\\left(3,\\dfrac{4}{16}\\right)=N(3,\\ 0.25) \\)，\\( \\sigma_{\\bar X}=0.5 \\)。</p>' +
              '<div class="fml">\\( P\\{\\bar X>4\\}=1-\\Phi\\!\\left(\\dfrac{4-3}{0.5}\\right)=1-\\Phi(2)=1-0.9772=\\mathbf{0.0228} \\)</div>'
          },
          {
            no: '例 6.15', meta: '真题改编 · 识别 χ² 统计量',
            q: '设 \\( X_1,\\cdots,X_{9} \\) 为来自 \\( N(0,\\ 1) \\) 的样本。判断下列统计量的分布：<br>(1) \\( \\sum_{i=1}^{9}X_i^2 \\)；<br>(2) \\( \\sum_{i=1}^{9}(X_i-\\bar X)^2 \\)；<br>(3) \\( \\dfrac{9\\bar X^2}{\\sum_{i=1}^{9}(X_i-\\bar X)^2/8} \\)。',
            sol:
              '<p><b>(1)</b> \\( \\mu=0,\\ \\sigma^2=1 \\) 已知，直接按定义：</p>' +
              '<div class="fml">\\( \\sum_{i=1}^{9}X_i^2\\sim\\chi^2(9) \\)</div>' +
              '<p><b>(2)</b> 用定理 2（\\( \\sigma^2=1 \\)）：</p>' +
              '<div class="fml">\\( \\sum_{i=1}^{9}(X_i-\\bar X)^2=\\dfrac{(9-1)S^2}{1}\\sim\\chi^2(8) \\)</div>' +
              '<p><b>(3)</b> 分子 \\( \\dfrac{\\bar X-0}{1/\\sqrt9}=3\\bar X\\sim N(0,1) \\)，故 \\( 9\\bar X^2=(3\\bar X)^2\\sim\\chi^2(1) \\)；分母中 \\( \\sum(X_i-\\bar X)^2/8=S^2\\sim\\chi^2(8)/8 \\)。由 \\( \\bar X \\) 与 \\( S^2 \\) 独立，按 \\( t \\) 分布定义：</p>' +
              '<div class="fml">\\( \\dfrac{9\\bar X^2}{\\sum_{i=1}^{9}(X_i-\\bar X)^2/8}=\\dfrac{\\chi^2(1)/1}{\\chi^2(8)/8}=\\dfrac{U/1}{V/8}\\ \\sim\\ F(1,8) \\)</div>' +
              '<p class="fml-note">关键是先看出分子是 \\( \\chi^2(1) \\)、分母是 \\( \\chi^2(8)/8 \\)，且两者独立。</p>'
          },
          {
            no: '例 6.16', meta: '提高 · 两个正态总体',
            q: '设 \\( X_1,\\cdots,X_{10} \\) 取自 \\( N(\\mu_1,4) \\)，\\( Y_1,\\cdots,Y_{15} \\) 取自 \\( N(\\mu_2,9) \\)，两组独立。若 \\( \\mu_1=0,\\mu_2=1 \\)，求 \\( P\\{\\bar X-\\bar Y<0\\} \\)。',
            sol:
              '<p>\\( \\bar X\\sim N\\!\\left(0,\\dfrac4{10}\\right),\\ \\bar Y\\sim N\\!\\left(1,\\dfrac9{15}\\right) \\)，独立故</p>' +
              '<div class="fml">\\( \\bar X-\\bar Y\\sim N\\!\\left(0-1,\\ \\dfrac4{10}+\\dfrac9{15}\\right)=N(-1,\\ 0.4+0.6)=N(-1,\\ 1) \\)</div>' +
              '<div class="fml">\\( P\\{\\bar X-\\bar Y<0\\}=\\Phi\\!\\left(\\dfrac{0-(-1)}{1}\\right)=\\Phi(1)=\\mathbf{0.8413} \\)</div>'
          },
          {
            no: '例 6.17', meta: '提高 · 综合判定',
            q: '设 \\( X_1,\\cdots,X_{n} \\) 为来自 \\( N(\\mu,\\sigma^2) \\) 的样本。判断 \\( Y=\\dfrac{(n-1)S^2}{\\sigma^2} \\) 与 \\( Z=\\dfrac{(n-1)S^2}{4} \\) 谁是统计量，并说明 \\( Z \\) 在什么条件下服从 \\( \\chi^2(n-1) \\)。',
            sol:
              '<p><b>\\( Y \\) 不是统计量</b>：含未知参数 \\( \\sigma^2 \\)。</p>' +
              '<p><b>\\( Z \\) 是统计量</b>：只含样本与已知常数 4。</p>' +
              '<p>由定理 2，\\( \\dfrac{(n-1)S^2}{\\sigma^2}\\sim\\chi^2(n-1) \\)。要使 \\( Z \\) 也服从 \\( \\chi^2(n-1) \\)，需 \\( \\sigma^2=4 \\)，即<b>总体方差已知且等于 4</b>。</p>'
          }
        ],
        pitfalls: [
          '定理 2 的自由度是 \\( n-1 \\)（因 \\( \\mu \\) 未知、用 \\( \\bar X \\) 代替）；若 \\( \\mu \\) <b>已知</b>，则 \\( \\sum(X_i-\\mu)^2/\\sigma^2\\sim\\chi^2(n) \\)，自由度是 \\( n \\)。',
          '定理 1 中 \\( D(\\bar X)=\\sigma^2/n \\)；求概率时忘记除以 \\( n \\) 会得到完全不同的答案。',
          '用 \\( t(n-1) \\) 的前提是「\\( \\sigma \\) 未知」；若 \\( \\sigma \\) 已知却仍用 \\( t \\)，答案会偏大（更保守）。',
          '\\( \\bar X \\) 与 \\( S^2 \\) 的独立性是<b>正态总体特有</b>的性质，非正态总体下一般不成立。'
        ]
      }

    ]
  };

})(window);
