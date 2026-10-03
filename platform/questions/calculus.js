/* 逐题知识与质量复核后的学习练习；由审计草稿合并。 */
(function(g){
  g.ZhixuQuestionBankVersion="question-quality-20261002-r2";
  Object.assign(g.ZhixuQuestions=g.ZhixuQuestions||{},{
  "calculus:ch1-s1": [
    {
      "id": "ca-fn-1",
      "type": "single",
      "stem": "确定一个函数需要哪三个要素？",
      "options": {
        "A": "定义域、值域、对应法则",
        "B": "自变量、因变量、常数",
        "C": "导数、积分、极限",
        "D": "单调、有界、周期"
      },
      "answer": "A",
      "explanation": "函数由定义域、值域和对应法则确定，其中对应法则和定义域是关键。"
    },
    {
      "id": "ca-fn-2",
      "type": "single",
      "stem": "奇函数与偶函数的图像分别关于什么对称？",
      "options": {
        "A": "奇函数关于原点，偶函数关于 y 轴",
        "B": "都关于原点",
        "C": "都关于 y 轴",
        "D": "奇函数关于 x 轴"
      },
      "answer": "A",
      "explanation": "奇函数满足 f(−x)=−f(x)，图像关于原点对称；偶函数满足 f(−x)=f(x)，关于 y 轴对称。"
    },
    {
      "id": "ca-fn-4-r2",
      "type": "single",
      "stem": "实函数 h(x)=ln(1−x²) 的最大定义域是？",
      "options": {
        "A": "(−1,1)",
        "B": "[−1,1]",
        "C": "R",
        "D": "(−∞,−1)∪(1,+∞)"
      },
      "answer": "A",
      "explanation": "对数真数须严格大于0，1−x²>0，故−1<x<1。仅内外定义域有交集不足以确定全部允许输入。"
    },
    {
      "id": "ca-fn-5-r2",
      "type": "judge",
      "stem": "函数在区间上非严格单调，就一定能以其值域为定义域建立单值反函数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "反函数要求原对应一一映射。常函数非严格单调，却让多个输入对应同一个值；严格单调是足够条件。"
    },
    {
      "id": "qa-20261002-ca-inverse-domain",
      "type": "single",
      "stem": "f(x)=x²，定义域为[0,+∞)，以值域为反函数定义域。反函数是什么？",
      "options": {
        "A": "√x，x≥0",
        "B": "±√x，x≥0",
        "C": "√x，x∈R",
        "D": "x²，x≥0"
      },
      "answer": "A",
      "explanation": "限制原定义域后f严格递增，值域[0,+∞)；反解取非负根。±√x不是单值函数。"
    }
  ],
  "calculus:ch1-s2": [
    {
      "id": "ca-elem-1",
      "type": "single",
      "stem": "基本初等函数包括哪几类？",
      "options": {
        "A": "幂、指数、对数、三角、反三角及常数函数",
        "B": "只有幂函数与指数函数",
        "C": "只有三角函数",
        "D": "所有连续函数"
      },
      "answer": "A",
      "explanation": "基本初等函数共六类，是构造初等函数的基础。"
    },
    {
      "id": "ca-elem-2",
      "type": "single",
      "stem": "指数函数 y=aˣ 的底数要求是？",
      "options": {
        "A": "a > 0 且 a ≠ 1",
        "B": "a > 1",
        "C": "a < 0",
        "D": "a = 1"
      },
      "answer": "A",
      "explanation": "指数函数要求底数 a>0 且 a≠1，定义域为全体实数。"
    },
    {
      "id": "ca-elem-3",
      "type": "judge",
      "stem": "对数函数与同底的指数函数互为反函数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "y=aˣ 与 y=log_a x 互为反函数，图像关于 y=x 对称。"
    },
    {
      "id": "ca-elem-4",
      "type": "single",
      "stem": "初等函数是指哪一类函数？",
      "options": {
        "A": "由基本初等函数经有限次四则运算与复合得到并用一个式子表示的函数",
        "B": "任意连续函数",
        "C": "只有多项式",
        "D": "只有三角函数"
      },
      "answer": "A",
      "explanation": "初等函数由基本初等函数经过有限次运算和复合构成。"
    },
    {
      "id": "ca-elem-5",
      "type": "judge",
      "stem": "初等函数在其定义区间内是连续的。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是初等函数的重要性质，为求极限带来方便。"
    },
    {
      "id": "qa-20261002-ca-log-base",
      "type": "single",
      "stem": "f(x)=log_{1/2}x。下列哪项正确？",
      "options": {
        "A": "定义域(0,+∞)，严格递减",
        "B": "定义域R，严格递增",
        "C": "定义域[0,+∞)，严格递减",
        "D": "值域(0,+∞)"
      },
      "answer": "A",
      "explanation": "ln(1/2)<0，f(x)=ln x/ln(1/2)随x增大而减小；真数严格为正，值域R。"
    }
  ],
  "calculus:ch1-s3": [
    {
      "id": "ca-lim-1-r2",
      "type": "judge",
      "stem": "实函数在x₀的某删去双侧邻域内有定义。其有限双侧极限存在，当且仅当左右极限均存在、有限且相等。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "两个单侧极限为同一实数L时，取两侧δ的较小值即得双侧ε-δ条件；反向由双侧条件限制到单侧得到。"
    },
    {
      "id": "ca-lim-3-r2",
      "type": "single",
      "stem": "已知lim(x→a)f(x)=−2，以下哪项必成立？",
      "options": {
        "A": "在a的某删去邻域内f(x)<−1",
        "B": "f(a)=−2",
        "C": "f在a处可导",
        "D": "f在整个定义域有界"
      },
      "answer": "A",
      "explanation": "取ε=1，则去心邻域中−3<f(x)<−1。点值、可导和全域有界均不是极限定义的结论。"
    },
    {
      "id": "ca-lim-5",
      "type": "single",
      "stem": "无穷小量与有界函数的乘积是？",
      "options": {
        "A": "无穷小量",
        "B": "无穷大量",
        "C": "常数",
        "D": "不一定"
      },
      "answer": "A",
      "explanation": "无穷小乘以有界量仍是无穷小，这是求极限的常用结论。"
    },
    {
      "id": "ca-lim-6",
      "type": "judge",
      "stem": "非零无穷小量的倒数是无穷大量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "无穷小与无穷大在一定条件下互为倒数关系。"
    },
    {
      "id": "exam-calculus-ch1-s3-2014-3-a-r2",
      "type": "single",
      "stem": "若 lim(x→a) f(x)=L，极限定义中 ε>0 对应的 δ 条件是？",
      "options": {
        "A": "|x−a|>δ 时 f(x)=L",
        "B": "x=a 时 f(x)=ε",
        "C": "0<|x−a|<δ 时 |f(x)−L|<ε",
        "D": "f(x) 的导数小于 δ"
      },
      "answer": "C",
      "explanation": "ε-δ 定义以函数值距离 L 小于 ε 刻画极限。"
    },
    {
      "id": "exam-calculus-ch1-s3-2022-7-b-r2",
      "type": "single",
      "stem": "当 x→0 时，sin x 与 x 的等价无穷小关系是？",
      "options": {
        "A": "sin x~x",
        "B": "sin x~x²",
        "C": "sin x~1/x",
        "D": "sin x~eˣ"
      },
      "answer": "A",
      "explanation": "第一重要极限给出 sin x/x→1。"
    },
    {
      "id": "qa-20261002-ca-oscillating-reciprocal",
      "type": "single",
      "stem": "aₙ=(−1)ⁿ/n。关于bₙ=1/aₙ，下列哪项正确？",
      "options": {
        "A": "|bₙ|→+∞，但bₙ既不趋+∞也不趋−∞",
        "B": "bₙ→+∞",
        "C": "bₙ→−∞",
        "D": "bₙ→0"
      },
      "answer": "A",
      "explanation": "bₙ=(−1)ⁿn，偶数子列趋+∞，奇数子列趋−∞；绝对值为n。无穷小的倒数须区分绝对值发散与带符号的无限极限。"
    }
  ],
  "calculus:ch1-s4": [
    {
      "id": "ca-lim-2",
      "type": "single",
      "stem": "极限 lim(x→0) (sin x)/x 的值是？",
      "options": {
        "A": "1",
        "B": "0",
        "C": "∞",
        "D": "不存在"
      },
      "answer": "A",
      "explanation": "这是第一个重要极限 lim(x→0) sinx/x = 1，可用夹逼准则或等价无穷小证明。"
    },
    {
      "id": "ca-limrule-1-r2",
      "type": "single",
      "stem": "以下哪组重要极限及趋近方式均正确？",
      "options": {
        "A": "x→0时sin x/x→1；t→+∞时(1+1/t)^t→e",
        "B": "x→0时sin x/x→0；t→+∞时(1+1/t)^t→e",
        "C": "x→+∞时sin x/x→1；t→0+时(1+1/t)^t→e",
        "D": "x→0时sin x/x→1；t→+∞时(1+1/t)^t→1"
      },
      "answer": "A",
      "explanation": "三角极限在角度按弧度且x→0时成立；幂指极限在t→+∞时成立。换错趋近方式会改变极限。"
    },
    {
      "id": "ca-limrule-3",
      "type": "single",
      "stem": "单调有界准则说明？",
      "options": {
        "A": "单调有界数列必有极限",
        "B": "有界数列必有极限",
        "C": "单调数列必有极限",
        "D": "任意数列都有极限"
      },
      "answer": "A",
      "explanation": "单调且有界的数列一定收敛，这是判断极限存在的重要准则。"
    },
    {
      "id": "ca-limrule-4-r2",
      "type": "judge",
      "stem": "x→0时u(x)=x+x²、v(x)=x满足u~v，因此求lim(u−v)/x²时可以把u直接替换为v。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "u/v=1+x→1，但(u−v)/x²恒为1；直接替换使分子为0，改变结果。等价无穷小不保证相减后的高阶差保持。"
    },
    {
      "id": "exam-calculus-ch1-s4-2015-4-a-r2",
      "type": "single",
      "stem": "lim(x→0)(eˣ−1)/x 等于？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "−1",
        "D": "不存在"
      },
      "answer": "B",
      "explanation": "由 eˣ 在 0 处的导数或等价无穷小 eˣ−1~x 得极限为 1。"
    },
    {
      "id": "exam-calculus-ch1-s4-2020-8-b-r2",
      "type": "single",
      "stem": "数列 aₙ→0 时，若 |bₙ|≤|aₙ|，则 bₙ？",
      "options": {
        "A": "必发散",
        "B": "必趋于 1",
        "C": "无任何结论",
        "D": "也趋于 0"
      },
      "answer": "D",
      "explanation": "由夹逼定理，绝对值被趋于零的量控制时 bₙ→0。"
    },
    {
      "id": "qa-20261002-ca-squeeze",
      "type": "single",
      "stem": "x≠0时f(x)=x²sin(1/x²)。lim(x→0)f(x)为？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "不存在，因为sin(1/x²)无极限",
        "D": "+∞"
      },
      "answer": "A",
      "explanation": "−x²≤x²sin(1/x²)≤x²，两侧均趋0，夹逼得0。内部振荡不能单独决定乘积极限。"
    }
  ],
  "calculus:ch1-s5": [
    {
      "id": "ca-cont-1",
      "type": "judge",
      "stem": "函数在某点可导，则它在该点一定连续；但连续不一定可导。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "可导 ⇒ 连续，反之不成立，例如 y=|x| 在 x=0 处连续但不可导。"
    },
    {
      "id": "ca-cont-2",
      "type": "single",
      "stem": "函数 f(x) 在 x₀ 处连续的定义是？",
      "options": {
        "A": "lim(x→x₀) f(x) = f(x₀)",
        "B": "f 在 x₀ 可导",
        "C": "f 在 x₀ 有定义即可",
        "D": "f 在 x₀ 单调"
      },
      "answer": "A",
      "explanation": "连续要求极限存在、函数有定义且二者相等。"
    },
    {
      "id": "ca-cont-3",
      "type": "judge",
      "stem": "间断点可分为第一类（可去、跳跃）和第二类（无穷、振荡）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "按左右极限是否存在与相等来分类。"
    },
    {
      "id": "ca-cont-4",
      "type": "single",
      "stem": "闭区间上连续函数具有哪些重要性质？",
      "options": {
        "A": "有界性、最值定理、介值定理",
        "B": "可导性、可积性",
        "C": "单调性、周期性",
        "D": "奇偶性、对称性"
      },
      "answer": "A",
      "explanation": "闭区间连续函数必有界、能取到最值，并满足介值定理。"
    },
    {
      "id": "exam-calculus-ch1-s5-2021-4-b-r2",
      "type": "single",
      "stem": "第一类间断点的典型条件是？",
      "options": {
        "A": "左右极限都存在且有限，但不满足连续条件",
        "B": "函数在两侧都无界",
        "C": "函数处处可导",
        "D": "左右极限均不存在"
      },
      "answer": "A",
      "explanation": "可去间断和跳跃间断都属于第一类间断点。"
    },
    {
      "id": "qa-20261002-ca-removable",
      "type": "single",
      "stem": "x≠0时f(x)=sin x/x，f(0)=c。f在0处连续所需c为？",
      "options": {
        "A": "1",
        "B": "0",
        "C": "−1",
        "D": "任意实数"
      },
      "answer": "A",
      "explanation": "去心极限为1；连续要求f(0)等于该极限，因此c=1，其余值产生可去间断。"
    }
  ],
  "calculus:ch2-s1": [
    {
      "id": "ca-deriv-1",
      "type": "single",
      "stem": "函数 f(x) 在 x₀ 处导数的定义是？",
      "options": {
        "A": "lim(Δx→0) [f(x₀+Δx)−f(x₀)]/Δx",
        "B": "f(x₀)",
        "C": "lim(Δx→0) [f(x₀+Δx)+f(x₀)]",
        "D": "f(x₀+Δx)−f(x₀)"
      },
      "answer": "A",
      "explanation": "导数是函数增量与自变量增量之比的极限，即平均变化率的极限。"
    },
    {
      "id": "ca-deriv-2",
      "type": "single",
      "stem": "导数 f′(x₀) 的几何意义是？",
      "options": {
        "A": "曲线 y=f(x) 在点 (x₀,f(x₀)) 处切线的斜率",
        "B": "曲线的面积",
        "C": "函数的平均值",
        "D": "曲线的长度"
      },
      "answer": "A",
      "explanation": "导数表示曲线在该点切线的斜率，即瞬时变化率。"
    },
    {
      "id": "ca-deriv-3",
      "type": "judge",
      "stem": "函数在某点可导，则它在该点一定连续。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "可导必连续，但连续不一定可导（如 |x| 在 0 处）。"
    },
    {
      "id": "ca-deriv-4",
      "type": "single",
      "stem": "函数 y=f(x) 的微分 dy 等于？",
      "options": {
        "A": "f′(x)dx",
        "B": "f(x)dx",
        "C": "dx",
        "D": "f″(x)dx"
      },
      "answer": "A",
      "explanation": "微分 dy=f′(x)dx，是函数增量的线性主部。"
    },
    {
      "id": "ca-deriv-5",
      "type": "judge",
      "stem": "函数在某点可导的充要条件是左右导数存在且相等。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "左右导数都存在且相等时，该点导数存在。"
    },
    {
      "id": "qa-20261002-ca-piecewise-differentiability",
      "type": "single",
      "stem": "f(x)=x²（x≥0），f(x)=ax（x<0），且f(0)=0。f在0可导的条件是？",
      "options": {
        "A": "a=0",
        "B": "a=1",
        "C": "a=2",
        "D": "任意a"
      },
      "answer": "A",
      "explanation": "右差商h²/h=h→0，左差商ah/h=a；二者相等要求a=0。函数对任意a连续，但可导另有条件。"
    }
  ],
  "calculus:ch2-s2": [
    {
      "id": "ca-rule-1",
      "type": "single",
      "stem": "求导的四则运算法则中，(uv)′ 等于？",
      "options": {
        "A": "u′v + uv′",
        "B": "u′v′",
        "C": "u′v − uv′",
        "D": "u′/v′"
      },
      "answer": "A",
      "explanation": "乘积求导为“前导后不导加前不导后导”。"
    },
    {
      "id": "ca-rule-2",
      "type": "single",
      "stem": "复合函数求导使用什么法则？",
      "options": {
        "A": "链式法则（外层导数乘以内层导数）",
        "B": "乘积法则",
        "C": "商法则",
        "D": "洛必达法则"
      },
      "answer": "A",
      "explanation": "dy/dx=dy/du·du/dx，逐层求导相乘。"
    },
    {
      "id": "ca-rule-3-r2",
      "type": "judge",
      "stem": "f在某区间严格单调可导，在x₀处f′(x₀)≠0。其反函数g在y₀=f(x₀)处可导时，g′(y₀)=1/f′(x₀)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "对g(f(x))=x在对应点求导得g′(y₀)f′(x₀)=1；必须区分x₀与y₀，且不能除以零。"
    },
    {
      "id": "ca-rule-4-r2",
      "type": "single",
      "stem": "圆x²+y²=25在点(3,4)附近把y看作x的可导函数。y′(3)为？",
      "options": {
        "A": "−3/4",
        "B": "−4/3",
        "C": "3/4",
        "D": "4/3"
      },
      "answer": "A",
      "explanation": "隐式求导2x+2yy′=0，y′=−x/y；y=4非零，代入得−3/4。"
    },
    {
      "id": "ca-rule-5-r2",
      "type": "judge",
      "stem": "可导参数x(t)、y(t)在t₀满足x′(t₀)≠0，并在附近确定可导y(x)，则dy/dx在t₀等于y′(t₀)/x′(t₀)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由y′(t₀)=(dy/dx)x′(t₀)和分母非零得公式。x′=0时不能直接用该比值。"
    },
    {
      "id": "exam-calculus-ch2-s2-2015-16-b-r2",
      "type": "single",
      "stem": "复合函数 y=f(g(x)) 的二阶导数包含？",
      "options": {
        "A": "f″(x)+g″(x)",
        "B": "f″(g(x))[g′(x)]²+f′(g(x))g″(x)",
        "C": "f′(g(x))g′(x)",
        "D": "f″(g(x))g″(x)"
      },
      "answer": "B",
      "explanation": "对一阶链式法则再求导，需同时对外层导数和内层导数求导。"
    },
    {
      "id": "qa-20261002-ca-chain-second",
      "type": "single",
      "stem": "y=e^{x²}。y″(0)为？",
      "options": {
        "A": "2",
        "B": "0",
        "C": "1",
        "D": "4"
      },
      "answer": "A",
      "explanation": "y′=2xe^{x²}，y″=(2+4x²)e^{x²}，在0取2。只对外函数再求导会漏掉内层二阶项。"
    }
  ],
  "calculus:ch2-s3": [
    {
      "id": "ca-mvt-1-r2",
      "type": "single",
      "stem": "设a<b，拉格朗日中值定理的标准假设是？",
      "options": {
        "A": "f在[a,b]连续，在(a,b)可导",
        "B": "f仅在(a,b)连续",
        "C": "f仅在a、b连续",
        "D": "f仅在(a,b)二阶可导，不要求端点连续"
      },
      "answer": "A",
      "explanation": "端点连续和内部可导共同保证存在ξ∈(a,b)，f′(ξ)=[f(b)−f(a)]/(b−a)。仅内部高阶可导不补足端点条件。"
    },
    {
      "id": "ca-mvt-2",
      "type": "single",
      "stem": "罗尔定理比拉格朗日中值定理多出的条件是？",
      "options": {
        "A": "f(a) = f(b)",
        "B": "f′(x) > 0",
        "C": "f 二阶可导",
        "D": "区间长度为 1"
      },
      "answer": "A",
      "explanation": "罗尔定理要求端点函数值相等 f(a)=f(b)，结论是存在 ξ 使 f′(ξ)=0。"
    },
    {
      "id": "ca-mvt-3",
      "type": "single",
      "stem": "罗尔定理、拉格朗日中值定理、柯西中值定理之间的关系是？",
      "options": {
        "A": "罗尔是拉格朗日的特例，拉格朗日是柯西的特例",
        "B": "三者无关",
        "C": "柯西是罗尔的特例",
        "D": "完全等价"
      },
      "answer": "A",
      "explanation": "柯西中值定理最一般，取 g(x)=x 得拉格朗日，再取端点相等得罗尔。"
    },
    {
      "id": "qa-20261002-ca-rolle-polynomial",
      "type": "single",
      "stem": "f(x)=x²−x在[0,1]满足罗尔定理。满足f′(ξ)=0的ξ为？",
      "options": {
        "A": "1/2",
        "B": "0",
        "C": "1",
        "D": "不存在"
      },
      "answer": "A",
      "explanation": "多项式闭区间连续、内部可导，端值均0；2ξ−1=0得ξ=1/2，属于开区间。"
    }
  ],
  "calculus:ch2-s4": [
    {
      "id": "ca-lhop-1",
      "type": "judge",
      "stem": "洛必达法则只能用于 0/0 型或 ∞/∞ 型未定式，且若求导后的极限不存在（也非无穷），不能据此断定原极限不存在。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "洛必达法则有适用条件；当 lim f′/g′ 不存在时法则失效，不能说明原极限不存在。"
    },
    {
      "id": "ca-lhop-4",
      "type": "single",
      "stem": "对于 0·∞ 型未定式，常用的处理方法是？",
      "options": {
        "A": "化为 0/0 或 ∞/∞ 型",
        "B": "直接代入",
        "C": "求导数",
        "D": "取对数"
      },
      "answer": "A",
      "explanation": "把乘积写成商的形式，转化为 0/0 或 ∞/∞。"
    },
    {
      "id": "ca-lhop-5-r2",
      "type": "judge",
      "stem": "一次洛必达后仍得到0/0型，仅凭这一点就能再次使用，不必重新检查可导性和新分母的导数是否为零。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "每一轮都要满足该轮分子分母的可导条件、新分母导数非零及相应导数比极限条件；未定式类型不是全部假设。"
    },
    {
      "id": "qa-20261002-ca-lhop-counterexample",
      "type": "single",
      "stem": "x→0时x²sin(1/x)/x的极限是0，但分子分母导数之比2xsin(1/x)−cos(1/x)没有极限。这说明？",
      "options": {
        "A": "导数比无极限，不能断定原比值无极限",
        "B": "原比值极限也不存在",
        "C": "原比值极限必为1",
        "D": "洛必达条件不需要导数比极限"
      },
      "answer": "A",
      "explanation": "原式为xsin(1/x)，绝对值≤|x|，极限0；导数比沿cos=±1子列取不同极限。洛必达结论不可逆。"
    }
  ],
  "calculus:ch2-s5": [
    {
      "id": "ca-extrema-1-r2",
      "type": "single",
      "stem": "对定义域内点x₀，以下极值判断正确的是？",
      "options": {
        "A": "若在x₀可导且取局部极值，则f′(x₀)=0；不可导内点也可能取极值",
        "B": "内点导数为0一定是极值点",
        "C": "所有内点极值都必须可导",
        "D": "任何极大值都大于任何极小值"
      },
      "answer": "A",
      "explanation": "费马定理针对可导内点；|x|在0不可导却极小，x³在0为驻点却无极值。端点最值不能套内点驻点条件。"
    },
    {
      "id": "ca-mono-1-r2",
      "type": "single",
      "stem": "f(x)=x³−3x的严格递增区间是？",
      "options": {
        "A": "(−∞,−1)和(1,+∞)",
        "B": "(−1,1)",
        "C": "整个R",
        "D": "(−∞,1)"
      },
      "answer": "A",
      "explanation": "f′=3(x²−1)，在x<−1或x>1时为正，在−1<x<1为负；两个递增区间分别表述，不把它们的并集当一个全局单调区间。"
    },
    {
      "id": "ca-mono-2",
      "type": "judge",
      "stem": "函数的极值点可能出现在导数为 0 的点，也可能出现在导数不存在的点。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "如 |x| 在 0 处导数不存在但取极小值。"
    },
    {
      "id": "ca-mono-3",
      "type": "single",
      "stem": "用二阶导数判断极值：若 f′(x₀)=0 且 f″(x₀)>0，则 x₀ 是？",
      "options": {
        "A": "极小值点",
        "B": "极大值点",
        "C": "拐点",
        "D": "不可导点"
      },
      "answer": "A",
      "explanation": "f″>0 说明曲线下凸，驻点处取极小值。"
    },
    {
      "id": "ca-mono-4-r2",
      "type": "judge",
      "stem": "对闭区间上的连续函数，求最值时只比较内部驻点和端点就总能得到正确结果，无需检查内部不可导点。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "f(x)=|x|在[−1,2]无驻点，端值1、2，最小值却在内部不可导点0取得。候选还应包含内部不可导点。"
    },
    {
      "id": "qa-20261002-ca-stationary-not-extremum",
      "type": "single",
      "stem": "f(x)=x³在0处满足f′(0)=0。以下判断正确的是？",
      "options": {
        "A": "0为驻点但不是极值点",
        "B": "0必为极小值点",
        "C": "0必为极大值点",
        "D": "f在0不连续"
      },
      "answer": "A",
      "explanation": "f′=3x²≥0，0两侧函数继续递增；左值负、右值正，均无局部极大/小。驻点只是可导极值的必要候选。"
    }
  ],
  "calculus:ch2-s6": [
    {
      "id": "ca-concave-1-r2",
      "type": "single",
      "stem": "f在区间上二阶可导且f″>0。对于区间内任意两点，图像与连接两点的弦相比如何？",
      "options": {
        "A": "内部图像低于弦",
        "B": "内部图像高于弦",
        "C": "一定是直线",
        "D": "每点都是拐点"
      },
      "answer": "A",
      "explanation": "f″>0使f′严格递增，函数严格凸，内部函数值低于线性插值。使用弦关系避免中英文凹/凸命名差异。"
    },
    {
      "id": "ca-concave-2",
      "type": "single",
      "stem": "曲线的拐点是指什么样的点？",
      "options": {
        "A": "曲线凹凸性发生改变的点",
        "B": "导数为 0 的点",
        "C": "函数值为 0 的点",
        "D": "函数的极值点"
      },
      "answer": "A",
      "explanation": "拐点是凹凸性改变的点，可能是 f″=0 或 f″ 不存在的点。"
    },
    {
      "id": "ca-concave-3",
      "type": "judge",
      "stem": "拐点处二阶导数可能为 0，也可能不存在。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "拐点的必要条件与极值类似，需具体判断两侧凹凸性是否改变。"
    },
    {
      "id": "ca-concave-4",
      "type": "single",
      "stem": "曲线的渐近线通常分为哪几类？",
      "options": {
        "A": "水平、垂直、斜渐近线",
        "B": "只有水平渐近线",
        "C": "只有垂直渐近线",
        "D": "只有斜渐近线"
      },
      "answer": "A",
      "explanation": "按 x→∞ 或 x→x₀ 时曲线的趋势分为三类。"
    },
    {
      "id": "qa-20261002-ca-rational-asymptote",
      "type": "single",
      "stem": "f(x)=(x²+1)/(x−1)。当x→+∞时的斜渐近线是？",
      "options": {
        "A": "y=x+1",
        "B": "y=x−1",
        "C": "y=x",
        "D": "y=1"
      },
      "answer": "A",
      "explanation": "多项式除法得f=x+1+2/(x−1)，差项趋0；故k=1、b=1。"
    }
  ],
  "calculus:ch2-s7": [
    {
      "id": "ca-arc-1-r2",
      "type": "single",
      "stem": "对可导图像y=f(x)，若ds表示非负弧长元素，不预先限定运动方向，则ds为？",
      "options": {
        "A": "√(1+[f′(x)]²)|dx|",
        "B": "f′(x)dx",
        "C": "dx",
        "D": "√(1+[f″(x)]²)dx"
      },
      "answer": "A",
      "explanation": "弧長元素来自√(dx²+dy²)，dy=f′dx；开方给|dx|。只有沿x增大计算定向微分时可直接写正系数乘dx。"
    },
    {
      "id": "ca-arc-2",
      "type": "single",
      "stem": "曲线 y=f(x) 的曲率 K 等于？",
      "options": {
        "A": "|y″| / (1+y′²)^{3/2}",
        "B": "|y′|",
        "C": "|y″|",
        "D": "1/|y′|"
      },
      "answer": "A",
      "explanation": "曲率刻画曲线弯曲程度，公式为 K=|y″|/(1+y′²)^{3/2}。"
    },
    {
      "id": "ca-arc-3-r2",
      "type": "judge",
      "stem": "曲线上一点的曲率K>0时，曲率半径R=1/K；K=0时不能得到有限曲率圆。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "圆的曲率为1/R；仅非零曲率可确定有限半径，直线为K=0的极限情况。"
    },
    {
      "id": "ca-arc-4",
      "type": "single",
      "stem": "曲率圆与曲线在该点有什么关系？",
      "options": {
        "A": "有相同的切线与相同的曲率",
        "B": "完全相同",
        "C": "无关系",
        "D": "只有相同面积"
      },
      "answer": "A",
      "explanation": "曲率圆与曲线在该点相切且曲率相等，圆心在法线上。"
    },
    {
      "id": "ca-arc-5",
      "type": "judge",
      "stem": "直线的曲率为 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "直线不弯曲，曲率为 0，曲率半径无穷大。"
    },
    {
      "id": "exam-calculus-ch2-s7-2019-16-b-r2",
      "type": "single",
      "stem": "曲率描述曲线在一点附近？",
      "options": {
        "A": "函数值的绝对大小",
        "B": "积分区域面积",
        "C": "切线方向变化的快慢",
        "D": "切线截距"
      },
      "answer": "C",
      "explanation": "曲率衡量单位弧长上的切向角变化率。"
    },
    {
      "id": "qa-20261002-ca-parabola-curvature",
      "type": "single",
      "stem": "曲线y=x²在x=1处的曲率K是？",
      "options": {
        "A": "2/(5√5)",
        "B": "2/√5",
        "C": "2",
        "D": "5√5/2"
      },
      "answer": "A",
      "explanation": "y′=2、y″=2，K=2/(1+4)^{3/2}=2/(5√5)。最后一项是半径而不是曲率。"
    }
  ],
  "calculus:ch3-s1": [
    {
      "id": "ca-antideriv-1-r2",
      "type": "single",
      "stem": "在同一开区间I上，F′=f。f在I上的全体原函数可以表示为？",
      "options": {
        "A": "F+C，C为一个任意实常数",
        "B": "只有F",
        "C": "所有C·F",
        "D": "F²+C"
      },
      "answer": "A",
      "explanation": "任意另一原函数G满足(G−F)′=0，由中值定理在区间I上差恒为常数。若定义域不连通，各连通分支的常数可不同。"
    },
    {
      "id": "ca-antideriv-2",
      "type": "single",
      "stem": "不定积分 ∫f(x)dx 表示？",
      "options": {
        "A": "f(x) 的全体原函数",
        "B": "f(x) 的导数",
        "C": "f(x) 本身",
        "D": "一个确定的数"
      },
      "answer": "A",
      "explanation": "不定积分是原函数族，结果要加任意常数 C。"
    },
    {
      "id": "ca-antideriv-3-r2",
      "type": "judge",
      "stem": "在开区间上连续的实函数必有原函数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "固定区间内一点a，令F(x)=∫ₐˣf(t)dt；由连续性和微积分基本定理，F′=f。单独黎曼可积并不足以得原函数。"
    },
    {
      "id": "ca-antideriv-4",
      "type": "single",
      "stem": "基本积分公式中 ∫xⁿdx（n≠−1）等于？",
      "options": {
        "A": "xⁿ⁺¹/(n+1) + C",
        "B": "xⁿ/n + C",
        "C": "nxⁿ⁻¹ + C",
        "D": "ln|x| + C"
      },
      "answer": "A",
      "explanation": "幂函数积分公式，n=−1 时对应 ln|x|。"
    },
    {
      "id": "qa-20261002-ca-disconnected-antiderivative",
      "type": "single",
      "stem": "f(x)=1/x定义在(−∞,0)∪(0,+∞)。令F=ln|x|，G在x<0取ln|x|，x>0取ln|x|+1。哪项正确？",
      "options": {
        "A": "F、G都是原函数，但G−F不在整个定义域恒为同一个常数",
        "B": "G不是原函数",
        "C": "F不是原函数",
        "D": "G−F在整个定义域恒为1"
      },
      "answer": "A",
      "explanation": "两分支中F′=G′=1/x；差在负半轴0、正半轴1。一个常数的结论需要同一连通区间。"
    }
  ],
  "calculus:ch3-s2": [
    {
      "id": "ca-defint-1",
      "type": "single",
      "stem": "定积分 ∫ₐᵃ f(x)dx 的值是？",
      "options": {
        "A": "0",
        "B": "f(a)",
        "C": "2f(a)",
        "D": "不存在"
      },
      "answer": "A",
      "explanation": "积分上限等于下限时定积分为 0。"
    },
    {
      "id": "ca-defint-2",
      "type": "single",
      "stem": "定积分 ∫ₐᵇf(x)dx 的本质是？",
      "options": {
        "A": "黎曼和的极限",
        "B": "导数的极限",
        "C": "一个不定积分",
        "D": "函数值"
      },
      "answer": "A",
      "explanation": "定积分定义为分割、求和、取极限的结果。"
    },
    {
      "id": "ca-defint-3",
      "type": "judge",
      "stem": "定积分的值与积分变量用什么字母无关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "∫ₐᵇf(x)dx=∫ₐᵇf(t)dt，积分变量只是记号。"
    },
    {
      "id": "ca-defint-4",
      "type": "single",
      "stem": "定积分的几何意义是？",
      "options": {
        "A": "曲边梯形面积的代数和",
        "B": "曲线长度",
        "C": "切线斜率",
        "D": "函数平均值"
      },
      "answer": "A",
      "explanation": "x 轴上方面积取正、下方面积取负，故为代数和。"
    },
    {
      "id": "ca-defint-5",
      "type": "judge",
      "stem": "交换定积分的上下限，积分值变号。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "∫ₐᵇf dx = −∫ᵦᵃf dx。"
    },
    {
      "id": "qa-20261002-ca-symmetry-integral",
      "type": "single",
      "stem": "f在[−2,2]可积且f(−x)=−f(x)。∫_{−2}²f(x)dx为？",
      "options": {
        "A": "0",
        "B": "2",
        "C": "−2",
        "D": "仅凭奇性不能确定"
      },
      "answer": "A",
      "explanation": "把负区间作x=−t换元，得到−∫₀²f(t)dt，与正区间积分抵消。可积条件确保操作合法。"
    }
  ],
  "calculus:ch3-s3": [
    {
      "id": "ca-varlim-1",
      "type": "single",
      "stem": "设 F(x)=∫ₐˣ f(t)dt，其中 f 连续，则 F′(x) 等于？",
      "options": {
        "A": "f(x)",
        "B": "f′(x)",
        "C": "F(x)",
        "D": "0"
      },
      "answer": "A",
      "explanation": "变限积分求导定理：对连续函数 f，F′(x)=f(x)。"
    },
    {
      "id": "ca-nl-1-r2",
      "type": "single",
      "stem": "f在[a,b]连续，F在该区间上满足F′=f。∫ₐᵇf(x)dx等于？",
      "options": {
        "A": "F(b)−F(a)",
        "B": "F(a)−F(b)",
        "C": "F(a)+F(b)",
        "D": "f(b)−f(a)"
      },
      "answer": "A",
      "explanation": "在上述假设下牛顿–莱布尼茨公式给原函数端值差，与积分方向一致。不能只看被积函数的端值。"
    },
    {
      "id": "qa-20261002-ca-moving-both-limits",
      "type": "single",
      "stem": "F(x)=∫_{x}^{x²}(1+t²)dt。F′(1)为？",
      "options": {
        "A": "2",
        "B": "4",
        "C": "0",
        "D": "−2"
      },
      "answer": "A",
      "explanation": "上下限均变化，F′(x)=(1+x⁴)·2x−(1+x²)，代1得4−2=2。下限项不能漏。"
    }
  ],
  "calculus:ch3-s4": [
    {
      "id": "ca-int-1",
      "type": "single",
      "stem": "∫ x·eˣ dx 的结果是？",
      "options": {
        "A": "(x−1)eˣ + C",
        "B": "(x+1)eˣ + C",
        "C": "x²eˣ/2 + C",
        "D": "x eˣ + C"
      },
      "answer": "A",
      "explanation": "分部积分：∫x eˣdx = x eˣ − ∫eˣdx = x eˣ − eˣ + C = (x−1)eˣ + C。"
    },
    {
      "id": "ca-int-2",
      "type": "single",
      "stem": "定积分 ∫₀¹ x² dx 的值是？",
      "options": {
        "A": "1/3",
        "B": "1/2",
        "C": "1",
        "D": "2/3"
      },
      "answer": "A",
      "explanation": "原函数为 x³/3，代入上下限得 1/3 − 0 = 1/3。"
    },
    {
      "id": "ca-sub-2",
      "type": "judge",
      "stem": "分部积分公式为 ∫u dv = uv − ∫v du。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由乘积求导公式移项得到，常用于处理乘积型积分。"
    },
    {
      "id": "ca-sub-3",
      "type": "single",
      "stem": "用换元法计算定积分时，除了换被积表达式，还必须？",
      "options": {
        "A": "同时更换积分上下限",
        "B": "保持上下限不变",
        "C": "把上下限取倒数",
        "D": "去掉上下限"
      },
      "answer": "A",
      "explanation": "定积分换元时积分限要随新变量相应改变。"
    },
    {
      "id": "exam-calculus-ch3-s4-2017-11-b-r2",
      "type": "single",
      "stem": "定积分换元 x=φ(t) 时，dx 应替换为？",
      "options": {
        "A": "φ(t)dt",
        "B": "φ′(t)dt",
        "C": "φ″(t)dt",
        "D": "dt/φ(t)"
      },
      "answer": "B",
      "explanation": "换元时微分需按链式法则乘 φ′(t)。"
    },
    {
      "id": "qa-20261002-ca-substitution-bound",
      "type": "single",
      "stem": "计算∫₀¹ 2x/(1+x²)dx，令u=1+x²。新上下限与结果为？",
      "options": {
        "A": "u从1到2，结果ln2",
        "B": "u从0到1，结果ln2",
        "C": "u从1到2，结果2",
        "D": "u从0到2，结果ln2"
      },
      "answer": "A",
      "explanation": "du=2x dx；x=0对应u=1，x=1对应u=2，∫₁²du/u=ln2。错误上下限不能仅因结果看似正确而选。"
    }
  ],
  "calculus:ch3-s5": [
    {
      "id": "ca-improp-1",
      "type": "single",
      "stem": "反常积分 ∫₁^∞ (1/xᵖ) dx 收敛的充要条件是？",
      "options": {
        "A": "p > 1",
        "B": "p ≥ 1",
        "C": "p < 1",
        "D": "p ≤ 1"
      },
      "answer": "A",
      "explanation": "p 积分在无穷区间上 p>1 时收敛、p≤1 时发散。"
    },
    {
      "id": "ca-improp-2",
      "type": "single",
      "stem": "无穷限反常积分 ∫ₐ^∞f(x)dx 的定义是？",
      "options": {
        "A": "lim(b→∞)∫ₐᵇf(x)dx",
        "B": "∫ₐᵇf(x)dx",
        "C": "f(∞)",
        "D": "0"
      },
      "answer": "A",
      "explanation": "无穷限积分用极限定义，极限存在则收敛。"
    },
    {
      "id": "ca-improp-4",
      "type": "single",
      "stem": "被积函数在积分区间内无界（有瑕点）的反常积分称为？",
      "options": {
        "A": "瑕积分",
        "B": "定积分",
        "C": "不定积分",
        "D": "曲线积分"
      },
      "answer": "A",
      "explanation": "有瑕点的反常积分称为瑕积分（无界函数的反常积分）。"
    },
    {
      "id": "qa-20261002-ca-principal-value-not-convergence",
      "type": "single",
      "stem": "关于∫_{−1}¹(1/x)dx，采用通常反常积分定义而非柯西主值，正确的是？",
      "options": {
        "A": "发散，虽对称截断值为0",
        "B": "收敛到0，因为函数奇",
        "C": "收敛到1",
        "D": "收敛到−1"
      },
      "answer": "A",
      "explanation": "0为内部瑕点，必须分别要求∫_{−1}⁰与∫₀¹收敛；两侧各自对数发散。对称截断相消只给主值0，不是通常收敛。"
    }
  ],
  "calculus:ch3-s6": [
    {
      "id": "ca-app-1-r2",
      "type": "single",
      "stem": "y=x与x轴、x=−1、x=1围成图形的几何面积是？",
      "options": {
        "A": "1",
        "B": "0",
        "C": "2",
        "D": "−1"
      },
      "answer": "A",
      "explanation": "面积∫_{−1}¹|x|dx=2∫₀¹x dx=1；有向积分为0，不能代替几何面积。"
    },
    {
      "id": "ca-app-2",
      "type": "single",
      "stem": "旋转体体积可用什么方法计算？",
      "options": {
        "A": "定积分的微元法（圆盘/壳层法）",
        "B": "求导",
        "C": "洛必达法则",
        "D": "中值定理"
      },
      "answer": "A",
      "explanation": "把旋转体切成薄圆盘或薄壳，积分求体积。"
    },
    {
      "id": "ca-app-3",
      "type": "judge",
      "stem": "曲线弧长可以用定积分计算。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "弧长 s=∫√(1+y′²)dx（或参数形式）。"
    },
    {
      "id": "ca-app-4",
      "type": "single",
      "stem": "下列哪一项是定积分的物理应用？",
      "options": {
        "A": "变力做功与水压力",
        "B": "求导数",
        "C": "判断单调性",
        "D": "解方程"
      },
      "answer": "A",
      "explanation": "变力做功、液体压力、质心等都可用定积分求解。"
    },
    {
      "id": "exam-calculus-ch3-s6-2014-9-a-r2",
      "type": "single",
      "stem": "曲线 y=f(x) 与 x 轴围成面积，在 f 变号时应计算？",
      "options": {
        "A": "∫f(x)dx 后不考虑符号",
        "B": "∫|f(x)|dx",
        "C": "∫f′(x)dx",
        "D": "∫x f″(x)dx"
      },
      "answer": "B",
      "explanation": "几何面积非负，跨越 x 轴时需按零点分段或取绝对值。"
    },
    {
      "id": "exam-calculus-ch3-s6-2017-11-b-r2",
      "type": "single",
      "stem": "旋转体体积用截面法计算时，常将横截面积对哪个变量积分？",
      "options": {
        "A": "曲率变量",
        "B": "随机变量",
        "C": "矩阵秩",
        "D": "沿旋转轴方向的变量"
      },
      "answer": "D",
      "explanation": "体积等于垂直旋转轴的截面积沿轴向累积。"
    },
    {
      "id": "qa-20261002-ca-washer-volume",
      "type": "single",
      "stem": "区域0≤x≤1、0≤y≤x绕x轴旋转，体积为？",
      "options": {
        "A": "π/3",
        "B": "π/2",
        "C": "π",
        "D": "1/3"
      },
      "answer": "A",
      "explanation": "垂直x轴截面为半径x的圆盘，A(x)=πx²；V=π∫₀¹x²dx=π/3。"
    }
  ],
  "calculus:ch4-s1": [
    {
      "id": "ca-vec-2",
      "type": "single",
      "stem": "向量的线性运算包括？",
      "options": {
        "A": "加法与数乘",
        "B": "求导与积分",
        "C": "极限与连续",
        "D": "排列与组合"
      },
      "answer": "A",
      "explanation": "向量可进行加法、减法与数乘等线性运算。"
    },
    {
      "id": "ca-vec-3",
      "type": "single",
      "stem": "两个非零向量共线（平行）的充要条件是？",
      "options": {
        "A": "存在常数 λ 使 a = λb",
        "B": "a·b = 0",
        "C": "|a|=|b|",
        "D": "a×b ≠ 0"
      },
      "answer": "A",
      "explanation": "共线即方向相同或相反，可用一个数乘表示。"
    },
    {
      "id": "ca-vec-4",
      "type": "judge",
      "stem": "单位向量是模等于 1 的向量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "把非零向量除以其模即得同方向的单位向量。"
    },
    {
      "id": "ca-vec-5-r2",
      "type": "single",
      "stem": "非零空间向量的三个方向余弦满足？",
      "options": {
        "A": "cos²α+cos²β+cos²γ=1",
        "B": "cosα+cosβ+cosγ=1",
        "C": "三者之积为1",
        "D": "三者都为1"
      },
      "answer": "A",
      "explanation": "把向量分量除以长度，得到单位向量，三个分量平方和为1；零向量无确定方向余弦。"
    },
    {
      "id": "ca-vec-6-r2",
      "type": "judge",
      "stem": "对两个非零空间向量，平行等价于存在非零λ使a=λb；检查坐标比例时须单独处理零分量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "标量倍数定义消除对零分母直接作比的错误；不能要求每一坐标分式都能写出。"
    },
    {
      "id": "qa-20261002-ca-normalize-vector",
      "type": "single",
      "stem": "向量a=(1,2,2)的同向单位向量为？",
      "options": {
        "A": "(1/3,2/3,2/3)",
        "B": "(1,2,2)",
        "C": "(1/9,2/9,2/9)",
        "D": "(−1/3,−2/3,−2/3)"
      },
      "answer": "A",
      "explanation": "|a|=√(1+4+4)=3，除以3；D单位但反向，C长度1/3。"
    }
  ],
  "calculus:ch4-s2": [
    {
      "id": "ca-vector-1",
      "type": "single",
      "stem": "两个非零向量垂直的充要条件是？",
      "options": {
        "A": "数量积为 0",
        "B": "向量积为零向量",
        "C": "模相等",
        "D": "方向相同"
      },
      "answer": "A",
      "explanation": "a·b = |a||b|cosθ，垂直时 cosθ=0 故数量积为 0；向量积为零向量表示两向量平行。"
    },
    {
      "id": "ca-dot-1",
      "type": "single",
      "stem": "两向量数量积 a·b 等于？",
      "options": {
        "A": "|a||b|cosθ",
        "B": "|a||b|sinθ",
        "C": "|a|+|b|",
        "D": "|a||b|"
      },
      "answer": "A",
      "explanation": "数量积是一个数，等于两向量模与其夹角余弦之积。"
    },
    {
      "id": "ca-dot-2",
      "type": "judge",
      "stem": "向量积 a×b 的模等于以 a、b 为邻边的平行四边形的面积。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "|a×b|=|a||b|sinθ，即平行四边形面积。"
    },
    {
      "id": "ca-dot-3-r2",
      "type": "single",
      "stem": "a=(1,0,0)、b=(0,1,0)。a×b为？",
      "options": {
        "A": "(0,0,1)",
        "B": "(0,0,−1)",
        "C": "(1,1,0)",
        "D": "(0,0,0)"
      },
      "answer": "A",
      "explanation": "标准右手基下e₁×e₂=e₃；交换顺序才得−e₃。一般叉积为零时不谈方向。"
    },
    {
      "id": "qa-20261002-ca-triangle-cross",
      "type": "single",
      "stem": "a=(1,0,0)，b=(0,2,0)。以a、b为两边的三角形面积为？",
      "options": {
        "A": "1",
        "B": "2",
        "C": "0",
        "D": "4"
      },
      "answer": "A",
      "explanation": "|a×b|=2为平行四边形面积，三角形面积取一半得1。"
    }
  ],
  "calculus:ch4-s3": [
    {
      "id": "ca-plane-1",
      "type": "single",
      "stem": "过点 M₀ 且以非零向量 n 为法向量的平面方程是？",
      "options": {
        "A": "n·(r − r₀) = 0（点法式）",
        "B": "n × (r − r₀) = 0",
        "C": "n·r = 0",
        "D": "r − r₀ = 0"
      },
      "answer": "A",
      "explanation": "平面点法式：法向量与平面上任一点到 M₀ 的向量垂直，即 n·(r−r₀)=0。"
    },
    {
      "id": "ca-plane-2-r2",
      "type": "single",
      "stem": "过(1,2,3)且法向量为(1,−2,1)的平面方程为？",
      "options": {
        "A": "x−2y+z=0",
        "B": "x+2y+z=0",
        "C": "x−2y+z=1",
        "D": "2x−y+z=0"
      },
      "answer": "A",
      "explanation": "点法式(x−1)−2(y−2)+(z−3)=0，常数项−1+4−3=0。"
    },
    {
      "id": "ca-plane-3-r2",
      "type": "judge",
      "stem": "方向向量(0,1,2)且过原点的直线可写为x=0、y=t、z=2t；不能把方向向量的零分量直接作对称式分母。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "参数式r=t(0,1,2)始终合法；若写x/0就是未定义运算，应改成固定坐标x=0。"
    },
    {
      "id": "ca-plane-4",
      "type": "single",
      "stem": "两个平面的夹角由什么确定？",
      "options": {
        "A": "两平面法向量的夹角",
        "B": "两平面交线",
        "C": "原点位置",
        "D": "截距之和"
      },
      "answer": "A",
      "explanation": "两平面夹角等于其法向量夹角（或其补角）。"
    },
    {
      "id": "ca-plane-5-r2",
      "type": "single",
      "stem": "直线r(t)=(t,1,0)与平面y=1的位置关系是？",
      "options": {
        "A": "直线包含于平面",
        "B": "平行且无公共点",
        "C": "只有一个交点",
        "D": "相互垂直"
      },
      "answer": "A",
      "explanation": "方向(1,0,0)与法向量(0,1,0)正交，且直线任意点满足y=1，故包含；正交方向不能单独推出无交平行。"
    },
    {
      "id": "exam-calculus-ch4-s3-2014-9-a-r2",
      "type": "single",
      "stem": "平面 ax+by+cz+d=0 的一个法向量是？",
      "options": {
        "A": "(d,a,b)",
        "B": "(a,b,c)",
        "C": "(b,c,d)",
        "D": "(1,1,1)"
      },
      "answer": "B",
      "explanation": "平面方程中 x、y、z 的系数组成法向量。"
    },
    {
      "id": "exam-calculus-ch4-s3-2015-17-b-r2",
      "type": "single",
      "stem": "平面P₁:x+y+z=1与P₂:2x+2y+2z=2如何？",
      "options": {
        "A": "重合",
        "B": "平行且不重合",
        "C": "垂直",
        "D": "交于一条直线"
      },
      "answer": "A",
      "explanation": "第二方程为第一方程两倍，点集完全相同；法向量平行并不保证无公共点。"
    },
    {
      "id": "qa-20261002-ca-three-planes-common-line",
      "type": "single",
      "stem": "平面x=0、y=0、x+y=0两两相交。三者的公共交集是什么？",
      "options": {
        "A": "z轴",
        "B": "仅原点",
        "C": "空集",
        "D": "整个xy平面"
      },
      "answer": "A",
      "explanation": "同时x=0,y=0即满足第三式，z任意。三条两两交线都是z轴，交线共点不能保证唯一公共点。"
    }
  ],
  "calculus:ch4-s4": [
    {
      "id": "ca-surface-1-r2",
      "type": "single",
      "stem": "以下哪个方程表示的曲面不是二次曲面？",
      "options": {
        "A": "z=sin x",
        "B": "x²+y²=1",
        "C": "x²+y²=z²",
        "D": "z=x²+y²"
      },
      "answer": "A",
      "explanation": "后三个方程均为常见二次曲面；sin x不是坐标的二次多项式。一般柱面、锥面名称本身不保证二次性。"
    },
    {
      "id": "ca-surface-2",
      "type": "single",
      "stem": "球心在原点、半径为 R 的球面方程是？",
      "options": {
        "A": "x²+y²+z²=R²",
        "B": "x²+y²=R²",
        "C": "x+y+z=R",
        "D": "xyz=R"
      },
      "answer": "A",
      "explanation": "球面是到原点距离等于 R 的点集。"
    },
    {
      "id": "ca-surface-3",
      "type": "judge",
      "stem": "空间曲线可以用参数方程表示。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "空间曲线常用参数方程 x=x(t), y=y(t), z=z(t) 表示。"
    },
    {
      "id": "ca-surface-4",
      "type": "single",
      "stem": "空间曲线在坐标面上的投影是通过消元得到的？",
      "options": {
        "A": "投影柱面与坐标面的交线",
        "B": "曲线的切线",
        "C": "曲线的法线",
        "D": "曲面的法向量"
      },
      "answer": "A",
      "explanation": "先求投影柱面方程，再与坐标面联立得投影曲线。"
    },
    {
      "id": "ca-surface-5",
      "type": "judge",
      "stem": "旋转曲面由一条母线绕定轴旋转生成。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "母线绕轴旋转扫出旋转曲面，如 yOz 面曲线绕 z 轴生成旋转曲面。"
    },
    {
      "id": "exam-calculus-ch4-s4-2015-17-a-r2",
      "type": "single",
      "stem": "圆柱面 x²+y²=1 的母线方向平行于？",
      "options": {
        "A": "x 轴",
        "B": "y 轴且只在一点相交",
        "C": "z 轴",
        "D": "法向量方向"
      },
      "answer": "C",
      "explanation": "方程不含 z，沿 z 方向平移保持曲面不变。"
    },
    {
      "id": "exam-calculus-ch4-s4-2014-9-b-r2",
      "type": "single",
      "stem": "正则参数曲线r(t)在t₀满足r′(t₀)≠0，切线方向可取？",
      "options": {
        "A": "r′(t₀)",
        "B": "r(t₀)",
        "C": "零向量",
        "D": "任意固定向量"
      },
      "answer": "A",
      "explanation": "正则条件下参数导向量非零，并与切线方向平行；参数导数为零时不能直接用零向量作方向。"
    },
    {
      "id": "qa-20261002-ca-projection-ellipse",
      "type": "single",
      "stem": "空间曲线由x²+y²+z²=1与z=x联立。其在xy平面的投影为？",
      "options": {
        "A": "2x²+y²=1，z=0",
        "B": "x²+y²=1，z=0",
        "C": "x+y=1，z=0",
        "D": "2x²+y²≤1，z=0"
      },
      "answer": "A",
      "explanation": "代z=x得到2x²+y²=1；每个投影点唯一对应z=x，因此是椭圆边界而非内部区域。"
    }
  ],
  "calculus:ch5-s1": [
    {
      "id": "ca-multivar-1-r2",
      "type": "single",
      "stem": "二元实函数f:D→R的定义域D应如何理解？",
      "options": {
        "A": "R²的非空子集，可能是区域、曲线或更一般集合",
        "B": "必须为开矩形",
        "C": "必须为整个R²",
        "D": "必须是数轴区间"
      },
      "answer": "A",
      "explanation": "定义只要求每个(x,y)∈D有唯一实值，不要求D含开区域。讨论偏导/全微分时还需相应局部定义域假设。"
    },
    {
      "id": "ca-multivar-2-r2",
      "type": "single",
      "stem": "f(x,y)=xy/(x²+y²)，(x,y)≠(0,0)。原点处极限如何？",
      "options": {
        "A": "不存在",
        "B": "0，因为沿两坐标轴均为0",
        "C": "1/2",
        "D": "1"
      },
      "answer": "A",
      "explanation": "沿y=0得到0，沿y=x且x≠0得到1/2；两条路径的不同值已否定统一极限。"
    },
    {
      "id": "ca-multivar-3",
      "type": "judge",
      "stem": "若沿不同路径趋近同一点得到不同的极限，则该点极限不存在。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是判断多元函数极限不存在的常用方法。"
    },
    {
      "id": "ca-multivar-4",
      "type": "single",
      "stem": "多元函数在某点连续的定义是？",
      "options": {
        "A": "极限存在且等于该点函数值",
        "B": "函数有定义即可",
        "C": "偏导数存在",
        "D": "函数有界"
      },
      "answer": "A",
      "explanation": "与一元函数类似，连续要求极限值等于函数值。"
    },
    {
      "id": "qa-20261002-ca-polar-bound",
      "type": "single",
      "stem": "f(x,y)=x²y²/(x²+y²)，原点外定义。原点处极限为？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "1/4",
        "D": "不存在"
      },
      "answer": "A",
      "explanation": "由4x²y²≤(x²+y²)²，0≤f≤(x²+y²)/4→0，给全方向统一界，不只验证有限路径。"
    }
  ],
  "calculus:ch5-s2": [
    {
      "id": "ca-partial-1",
      "type": "judge",
      "stem": "函数在某点可微，则它在该点的偏导数一定存在；反之不一定成立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "可微 ⇒ 偏导存在，但偏导存在不保证可微；偏导数连续是可微的充分条件。"
    },
    {
      "id": "ca-partial-2",
      "type": "single",
      "stem": "偏导数 ∂z/∂x 的求法是？",
      "options": {
        "A": "把 y 看作常数，对 x 求导",
        "B": "把 x 看作常数",
        "C": "对 x、y 同时求导",
        "D": "求全导数"
      },
      "answer": "A",
      "explanation": "求偏导时固定其余变量，按一元函数求导。"
    },
    {
      "id": "ca-partial-4-r2",
      "type": "single",
      "stem": "f在(x₀,y₀)处可微，则其全微分df为？",
      "options": {
        "A": "fₓ(x₀,y₀)dx+fᵧ(x₀,y₀)dy",
        "B": "fₓ+fᵧ",
        "C": "fₓdx−fᵧdy",
        "D": "fₓfᵧ"
      },
      "answer": "A",
      "explanation": "可微增量为fₓΔx+fᵧΔy+o(√(Δx²+Δy²))，线性主部即全微分；只有偏导存在不够。"
    },
    {
      "id": "ca-partial-5",
      "type": "judge",
      "stem": "当二阶混合偏导数连续时，它们相等。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "混合偏导连续时求导次序可交换。"
    },
    {
      "id": "exam-calculus-ch5-s2-2024-18-b-r2",
      "type": "single",
      "stem": "二元函数在一点可微可以推出该点？",
      "options": {
        "A": "函数值必为零",
        "B": "所有二阶偏导均为零",
        "C": "梯度为单位向量",
        "D": "连续且偏导数存在"
      },
      "answer": "D",
      "explanation": "可微蕴含连续，并蕴含一阶偏导存在。"
    },
    {
      "id": "qa-20261002-ca-partials-not-continuous",
      "type": "single",
      "stem": "f=xy/(x²+y²)在原点外，f(0,0)=0。原点处哪项正确？",
      "options": {
        "A": "两偏导均存在且为0，但f不连续",
        "B": "f可微",
        "C": "只有x偏导存在",
        "D": "只有y偏导存在"
      },
      "answer": "A",
      "explanation": "两轴上函数恒0，差商均0；沿y=x函数恒1/2，不趋点值0，故不连续、更不可微。"
    }
  ],
  "calculus:ch5-s3": [
    {
      "id": "ca-chain-1",
      "type": "single",
      "stem": "多元复合函数求导使用的法则是？",
      "options": {
        "A": "链式法则",
        "B": "乘积法则",
        "C": "洛必达法则",
        "D": "中值定理"
      },
      "answer": "A",
      "explanation": "按复合路径逐层求导相乘再求和。"
    },
    {
      "id": "ca-chain-2-r2",
      "type": "single",
      "stem": "F(x,y)=eˣ+y²−2，在(0,1)附近定义隐函数y(x)。y′(0)为？",
      "options": {
        "A": "−1/2",
        "B": "1/2",
        "C": "−2",
        "D": "2"
      },
      "answer": "A",
      "explanation": "F是C¹，F(0,1)=0且Fᵧ=2非零。y′=−Fₓ/Fᵧ=−1/2。"
    },
    {
      "id": "ca-chain-3",
      "type": "judge",
      "stem": "全导数与偏导数的区别在于：全导数考虑了所有中间变量的依赖关系。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "当所有中间变量都依赖于同一自变量时用全导数。"
    },
    {
      "id": "ca-chain-4-r2",
      "type": "single",
      "stem": "在点(x₀,y₀)附近，哪组标准条件保证F(x,y)=0局部唯一确定C¹的y(x)？",
      "options": {
        "A": "F为C¹、F(x₀,y₀)=0、Fᵧ(x₀,y₀)≠0",
        "B": "仅F连续",
        "C": "仅Fₓ(x₀,y₀)≠0",
        "D": "仅F(x₀,y₀)=0"
      },
      "answer": "A",
      "explanation": "隐函数定理需对应被解变量的非零偏导及邻域C¹；仅Fₓ非零保证的是可能解x(y)，不能替代Fᵧ。"
    },
    {
      "id": "qa-20261002-ca-two-path-chain",
      "type": "single",
      "stem": "z=u²+v²，u=x+y、v=x−y。zₓ在(1,2)的值为？",
      "options": {
        "A": "4",
        "B": "6",
        "C": "−2",
        "D": "8"
      },
      "answer": "A",
      "explanation": "zₓ=2u·1+2v·1=2(x+y)+2(x−y)=4x；代入1得4。两条依赖路径都要相加。"
    }
  ],
  "calculus:ch5-s4": [
    {
      "id": "ca-grad-1-r2",
      "type": "single",
      "stem": "f在P可微且∇f(P)≠0。对单位方向求方向导数，唯一最大方向是？",
      "options": {
        "A": "∇f(P)/|∇f(P)|",
        "B": "−∇f(P)/|∇f(P)|",
        "C": "任意垂直梯度的方向",
        "D": "任意单位方向"
      },
      "answer": "A",
      "explanation": "Dᵤf=∇f·u≤|∇f|，等号只在同向单位向量时取；非零保证方向唯一。"
    },
    {
      "id": "ca-grad-2",
      "type": "single",
      "stem": "方向导数表示的是？",
      "options": {
        "A": "函数沿某一指定方向的变化率",
        "B": "函数的最大值",
        "C": "函数的积分",
        "D": "函数的周期"
      },
      "answer": "A",
      "explanation": "方向导数刻画函数在某点沿给定方向的变化快慢。"
    },
    {
      "id": "ca-grad-4-r2",
      "type": "single",
      "stem": "f在P可微且∇f(P)=0，此时各单位方向的方向导数如何？",
      "options": {
        "A": "均为0，最大方向不唯一",
        "B": "只有一个方向为0",
        "C": "均不存在",
        "D": "最大值为1"
      },
      "answer": "A",
      "explanation": "可微下Dᵤf=∇f·u=0，所有单位方向都达到同一值；零向量本身没有方向。"
    },
    {
      "id": "ca-grad-5-r2",
      "type": "judge",
      "stem": "f在P可微，u为单位向量，则沿u的方向导数为∇f(P)·u；仅各偏导存在不保证此式。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "可微的线性增量对hu除h即得点积。偏导存在只给坐标轴信息，不保证所有方向共享线性主部。"
    },
    {
      "id": "qa-20261002-ca-unit-direction",
      "type": "single",
      "stem": "f(x,y)=x²+3y。在(1,0)沿单位方向(3/5,4/5)的方向导数为？",
      "options": {
        "A": "18/5",
        "B": "√13",
        "C": "2",
        "D": "3"
      },
      "answer": "A",
      "explanation": "梯度(2,3)，点积2·3/5+3·4/5=18/5；√13是最大值，不是给定方向值。"
    }
  ],
  "calculus:ch5-s5": [
    {
      "id": "ca-tangent-1-r2",
      "type": "single",
      "stem": "C¹参数曲线r(t)在t₀满足r′(t₀)≠0，其切线的方向向量可取？",
      "options": {
        "A": "r′(t₀)",
        "B": "任意法向量",
        "C": "零向量",
        "D": "位置向量r(t₀)"
      },
      "answer": "A",
      "explanation": "正则条件保证导向量非零，并给切向；位置向量无此必然关系。"
    },
    {
      "id": "ca-tangent-2-r2",
      "type": "single",
      "stem": "F为C¹，F(P)=0且∇F(P)≠0。正则曲面F=0在P的切平面法向量可取？",
      "options": {
        "A": "∇F(P)",
        "B": "P的位置向量",
        "C": "任意切向量",
        "D": "零向量"
      },
      "answer": "A",
      "explanation": "水平集上任意切向v满足dF(v)=∇F·v=0；非零梯度作有效法向量。"
    },
    {
      "id": "ca-tangent-4",
      "type": "single",
      "stem": "曲面在一点的切平面与法线的关系是？",
      "options": {
        "A": "相互垂直",
        "B": "相互平行",
        "C": "重合",
        "D": "无关系"
      },
      "answer": "A",
      "explanation": "法线方向即法向量方向，与切平面垂直。"
    },
    {
      "id": "exam-calculus-ch5-s5-2024-18-a-r2",
      "type": "single",
      "stem": "曲面z=x²+y²在P=(1,2,5)的一个法向量为？",
      "options": {
        "A": "(−2,−4,1)",
        "B": "(2,4,1)",
        "C": "(1,1,1)",
        "D": "(−1,−2,0)"
      },
      "answer": "A",
      "explanation": "写F=x²+y²−z，梯度在P为(2,4,−1)；其相反向量(-2,-4,1)也有效，其他项不成比例。"
    },
    {
      "id": "exam-calculus-ch5-s5-2015-17-b-r2",
      "type": "single",
      "stem": "两平面x+y+z=0和x−y=0交线的方向向量可取？",
      "options": {
        "A": "(1,1,−2)",
        "B": "(1,0,1)",
        "C": "(1,−1,0)",
        "D": "(1,1,1)"
      },
      "answer": "A",
      "explanation": "法向量(1,1,1)与(1,-1,0)叉积(1,1,-2)非零，且分别点积为0。"
    },
    {
      "id": "qa-20261002-ca-helix-tangent",
      "type": "single",
      "stem": "r(t)=(cos t,sin t,t)。在t=0处的切线参数式为？",
      "options": {
        "A": "(x,y,z)=(1,0,0)+s(0,1,1)",
        "B": "(x,y,z)=s(1,0,0)",
        "C": "(x,y,z)=(1,0,0)+s(1,1,0)",
        "D": "(x,y,z)=(0,1,0)+s(0,1,1)"
      },
      "answer": "A",
      "explanation": "r(0)=(1,0,0)，r′(0)=(0,1,1)非零；切线通过该点沿导向量。"
    }
  ],
  "calculus:ch5-s6": [
    {
      "id": "ca-lagrange-1",
      "type": "single",
      "stem": "求多元函数在约束条件下的极值，常用方法是？",
      "options": {
        "A": "拉格朗日乘数法",
        "B": "洛必达法则",
        "C": "分部积分法",
        "D": "夹逼准则"
      },
      "answer": "A",
      "explanation": "构造拉格朗日函数 L = f + λφ，令各偏导为 0，解出驻点再判断。"
    },
    {
      "id": "ca-extrema-2-r2",
      "type": "single",
      "stem": "f在内点P邻域为C²，且∇f(P)=0。若Hessian行列式为0，二阶判别法给什么结论？",
      "options": {
        "A": "此法不能决定，需进一步分析",
        "B": "必为极小值",
        "C": "必为极大值",
        "D": "必为鞍点"
      },
      "answer": "A",
      "explanation": "x⁴+y⁴、−x⁴−y⁴、x⁴−y⁴在原点Hessian均零，却分别极小、极大、鞍点。二阶退化不能作充分分类。"
    },
    {
      "id": "ca-extrema-4-r2",
      "type": "single",
      "stem": "f在P附近为C²、∇f(P)=0。令A=fₓₓ(P)、B=fₓᵧ(P)、C=fᵧᵧ(P)，AC−B²>0且A>0，则P为？",
      "options": {
        "A": "严格局部极小值点",
        "B": "严格局部极大值点",
        "C": "鞍点",
        "D": "以上条件不足以判断"
      },
      "answer": "A",
      "explanation": "Hessian为正定，非零小增量的二阶主部正，余项阶更高，因此严格局部极小。"
    },
    {
      "id": "ca-extrema-5-r2",
      "type": "judge",
      "stem": "f=x³，约束y=0。在(0,0)满足拉格朗日乘数方程，所以(0,0)必是约束极值点。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "取λ=0可满足∇f+λ∇y=0，但约束线上f=x³在原点两侧异号，原点不是极值；乘数方程仅给候选。"
    },
    {
      "id": "qa-20261002-ca-constraint-max",
      "type": "single",
      "stem": "在约束x²+y²=1下，f(x,y)=xy的最大值是？",
      "options": {
        "A": "1/2",
        "B": "1",
        "C": "0",
        "D": "−1/2"
      },
      "answer": "A",
      "explanation": "由(x−y)²≥0得2xy≤x²+y²=1，等号在x=y=±1/√2取得。约束是闭有界圆，确能取最大。"
    }
  ],
  "calculus:ch6-s1": [
    {
      "id": "ca-double-1",
      "type": "single",
      "stem": "计算二重积分的基本思路通常是？",
      "options": {
        "A": "化为累次积分（先对一个变量积分）",
        "B": "直接求原函数",
        "C": "用洛必达法则",
        "D": "用夹逼准则"
      },
      "answer": "A",
      "explanation": "根据积分区域选择直角坐标或极坐标，把二重积分化为两次定积分（累次积分）计算。"
    },
    {
      "id": "ca-double-3",
      "type": "judge",
      "stem": "极坐标下二重积分的面积元素 dσ = ρ dρ dθ。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "极坐标变换的雅可比行列式为 ρ，故 dσ=ρdρdθ。"
    },
    {
      "id": "ca-double-4",
      "type": "single",
      "stem": "三重积分可选用哪些坐标系？",
      "options": {
        "A": "直角、柱面、球面坐标",
        "B": "只有直角坐标",
        "C": "只有极坐标",
        "D": "只有球坐标"
      },
      "answer": "A",
      "explanation": "根据积分区域形状选择直角、柱面或球面坐标。"
    },
    {
      "id": "ca-double-5",
      "type": "judge",
      "stem": "二重积分可以表示曲顶柱体的体积。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "当被积函数非负时，二重积分等于曲顶柱体体积。"
    },
    {
      "id": "exam-calculus-multiintegral-2014-3-r2",
      "type": "single",
      "stem": "设f在原三角区域上连续。∫₀¹dx∫ₓ¹ f(x,y)dy交换次序后，正确的完整表达式为？",
      "options": {
        "A": "∫₀¹dy∫₀ʸf(x,y)dx",
        "B": "∫₀¹dy∫ᵧ¹f(x,y)dx",
        "C": "∫₀¹dy∫₀¹f(x,y)dx",
        "D": "∫₀¹dy∫₀ʸf(y,x)dx"
      },
      "answer": "A",
      "explanation": "原区域0≤x≤y≤1。先固定y∈[0,1]，x从0到y，保持被积函数变量含义不变；假定f可积且允许换序。"
    },
    {
      "id": "qa-20261002-ca-unit-disk",
      "type": "single",
      "stem": "D为单位圆盘。∬_D(x²+y²)dA为？",
      "options": {
        "A": "π/2",
        "B": "π",
        "C": "2π",
        "D": "1/4"
      },
      "answer": "A",
      "explanation": "极坐标被积为r²，面积元r dr dθ，∫₀^{2π}dθ∫₀¹r³dr=π/2。"
    }
  ],
  "calculus:ch6-s2": [
    {
      "id": "ca-lineint-1",
      "type": "single",
      "stem": "第一类曲线积分是？",
      "options": {
        "A": "对弧长的曲线积分",
        "B": "对坐标的曲线积分",
        "C": "对面积的曲面积分",
        "D": "对体积的积分"
      },
      "answer": "A",
      "explanation": "第一类曲线积分 ∫f(x,y)ds 对弧长积分。"
    },
    {
      "id": "ca-lineint-2",
      "type": "single",
      "stem": "第二类曲线积分是？",
      "options": {
        "A": "对坐标的曲线积分",
        "B": "对弧长的曲线积分",
        "C": "对面积的积分",
        "D": "对体积的积分"
      },
      "answer": "A",
      "explanation": "第二类曲线积分 ∫Pdx+Qdy 对坐标积分。"
    },
    {
      "id": "ca-lineint-3",
      "type": "judge",
      "stem": "第一类曲线积分与曲线的方向无关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "对弧长积分只与曲线形状有关，与方向无关。"
    },
    {
      "id": "ca-lineint-4",
      "type": "single",
      "stem": "第二类曲线积分与方向的关系是？",
      "options": {
        "A": "反向时积分值变号",
        "B": "与方向无关",
        "C": "方向改变积分值不变",
        "D": "只能沿正向"
      },
      "answer": "A",
      "explanation": "第二类曲线积分有方向性，改变方向积分变号。"
    },
    {
      "id": "ca-lineint-5",
      "type": "judge",
      "stem": "第一类曲线积分的几何/物理意义可以是曲线的质量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "若 f 为线密度，∫f ds 即曲线质量。"
    },
    {
      "id": "qa-20261002-ca-line-orientation",
      "type": "single",
      "stem": "L为(0,0)到(1,1)的直线段。I₁=∫_Lds，I₂=∫_L(x dx+y dy)。反向后两值分别为？",
      "options": {
        "A": "√2、−1",
        "B": "−√2、−1",
        "C": "√2、1",
        "D": "1、−√2"
      },
      "answer": "A",
      "explanation": "第一类为段长√2，与方向无关。第二类原值[(x²+y²)/2]起终点差=1，反向为−1。"
    }
  ],
  "calculus:ch6-s3": [
    {
      "id": "ca-green-1-r2",
      "type": "single",
      "stem": "D为有界平面区域，边界由有限条分段C¹简单闭曲线组成（可有孔）；P,Q在包含闭区域的邻域内为C¹，边界按正向。格林公式联系哪两种积分？",
      "options": {
        "A": "边界第二类曲线积分与D上的二重积分",
        "B": "曲面积分与三重积分",
        "C": "第一类曲线积分与弧长",
        "D": "不定积分与反函数"
      },
      "answer": "A",
      "explanation": "∮∂D(Pdx+Qdy)=∬D(Qₓ−Pᵧ)dA。零curl若要推出全域路径独立，还需合适拓扑条件，不能单凭这一等式泛化。"
    },
    {
      "id": "ca-green-3-r2",
      "type": "judge",
      "stem": "在任意平面开域内，只要P,Q为C¹且Qₓ=Pᵧ，就一定全域路径无关，不需考虑区域是否有孔。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "穿孔平面上P=−y/(x²+y²)、Q=x/(x²+y²)满足Qₓ=Pᵧ，但单位圆逆时针积分为2π；没有全局势。单连通等条件不能省略。"
    },
    {
      "id": "ca-green-4-r2",
      "type": "single",
      "stem": "P,Q在开连通平面域内连续。对所有分段C¹路径，∫Pdx+Qdy只依赖起终点，等价于哪项？",
      "options": {
        "A": "存在C¹势函数u且uₓ=P、uᵧ=Q",
        "B": "P和Q均恒为0",
        "C": "区域必须无界",
        "D": "每条路径都是直线"
      },
      "answer": "A",
      "explanation": "路径独立可从固定起点积分定义u；开域内沿短水平/竖直段求差商，连续性给uₓ=P、uᵧ=Q。反向由全微分积分等于势函数端值差。"
    },
    {
      "id": "ca-green-5-r2",
      "type": "judge",
      "stem": "平面环形区域的格林正向边界为：外圈逆时针、内圈顺时针，使区域始终位于行进方向左侧。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "外边界包围区域用逆时针；孔边界反向才令有物质区域在左侧。不是所有边界分支都逆时针。"
    },
    {
      "id": "qa-20261002-ca-green-area",
      "type": "single",
      "stem": "L为单位圆逆时针边界。∮_L(−y/2 dx+x/2 dy)为？",
      "options": {
        "A": "π",
        "B": "2π",
        "C": "0",
        "D": "−π"
      },
      "answer": "A",
      "explanation": "Qₓ−Pᵧ=1，Green给单位圆盘面积π；逆时针为正向。"
    }
  ],
  "calculus:ch6-s4": [
    {
      "id": "ca-surfint-1",
      "type": "single",
      "stem": "第一类曲面积分是？",
      "options": {
        "A": "对面积的曲面积分",
        "B": "对坐标的曲面积分",
        "C": "对弧长的积分",
        "D": "对体积的积分"
      },
      "answer": "A",
      "explanation": "第一类曲面积分 ∬f dS 对面积积分。"
    },
    {
      "id": "ca-surfint-2",
      "type": "single",
      "stem": "第二类曲面积分是？",
      "options": {
        "A": "对坐标的曲面积分",
        "B": "对面积的曲面积分",
        "C": "对弧长的积分",
        "D": "对长度的积分"
      },
      "answer": "A",
      "explanation": "第二类曲面积分对坐标积分，与曲面的侧有关。"
    },
    {
      "id": "ca-surfint-3",
      "type": "judge",
      "stem": "第一类曲面积分与曲面的侧（方向）无关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "对面积积分只与曲面形状有关。"
    },
    {
      "id": "ca-surfint-4-r2",
      "type": "single",
      "stem": "固定向量场和曲面点集，原选定向的通量为3。仅反转法向定向后通量为？",
      "options": {
        "A": "−3",
        "B": "3",
        "C": "9",
        "D": "0"
      },
      "answer": "A",
      "explanation": "通量∬F·n dS，n变为−n使积分变号；面积没有改变。"
    },
    {
      "id": "ca-surfint-5",
      "type": "judge",
      "stem": "第一类曲面积分可表示曲面薄片的质量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "若 f 为面密度，∬f dS 即曲面质量。"
    },
    {
      "id": "qa-20261002-ca-tilted-surface-area",
      "type": "single",
      "stem": "S为z=x+y，0≤x≤1、0≤y≤1上的曲面片。∬_S1 dS为？",
      "options": {
        "A": "√3",
        "B": "1",
        "C": "3",
        "D": "2"
      },
      "answer": "A",
      "explanation": "图像面积元√(1+zₓ²+zᵧ²)dxdy=√3 dxdy，投影单位正方形面积1。"
    }
  ],
  "calculus:ch6-s5": [
    {
      "id": "ca-gauss-1",
      "type": "single",
      "stem": "高斯公式建立了哪两者之间的联系？",
      "options": {
        "A": "闭曲面上的曲面积分与所围区域上的三重积分",
        "B": "曲线积分与二重积分",
        "C": "第一类与第二类曲线积分",
        "D": "定积分与不定积分"
      },
      "answer": "A",
      "explanation": "高斯公式把闭曲面上的通量与三重积分联系起来。"
    },
    {
      "id": "ca-gauss-2",
      "type": "single",
      "stem": "斯托克斯公式建立了哪两者之间的联系？",
      "options": {
        "A": "空间闭曲线上的曲线积分与所张曲面上的曲面积分",
        "B": "三重积分与二重积分",
        "C": "定积分与不定积分",
        "D": "级数与积分"
      },
      "answer": "A",
      "explanation": "斯托克斯公式是格林公式在空间中的推广。"
    },
    {
      "id": "ca-gauss-3",
      "type": "judge",
      "stem": "使用高斯公式时，闭曲面通常取外侧。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "高斯公式要求闭曲面取外侧（法向量指向区域外部）。"
    },
    {
      "id": "ca-gauss-5",
      "type": "judge",
      "stem": "散度对应高斯公式，旋度对应斯托克斯公式。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "高斯公式的向量形式用散度，斯托克斯用旋度。"
    },
    {
      "id": "qa-20261002-ca-sphere-flux",
      "type": "single",
      "stem": "F=(x,y,z)，S为单位球面并取外向。通量∬_S F·n dS为？",
      "options": {
        "A": "4π",
        "B": "4π/3",
        "C": "3",
        "D": "0"
      },
      "answer": "A",
      "explanation": "F全空间C¹，divF=3，Gauss给3乘单位球体积4π/3=4π。球面上F=n亦可直接得面积4π。"
    }
  ],
  "calculus:ch6-s6": [
    {
      "id": "ca-field-1",
      "type": "single",
      "stem": "向量场的散度 div F 表示？",
      "options": {
        "A": "场中某点的源强度",
        "B": "场的旋转程度",
        "C": "场的模",
        "D": "场的积分"
      },
      "answer": "A",
      "explanation": "散度刻画向量场在某点发散（源）或汇聚（汇）的程度。"
    },
    {
      "id": "ca-field-2",
      "type": "single",
      "stem": "向量场的旋度 rot F 表示？",
      "options": {
        "A": "场中某点的旋转程度",
        "B": "场的源强度",
        "C": "场的模",
        "D": "场的梯度"
      },
      "answer": "A",
      "explanation": "旋度刻画向量场在某点的旋转趋势。"
    },
    {
      "id": "ca-field-3-r2",
      "type": "judge",
      "stem": "若φ为C²且F=∇φ，则curl F=0；但C¹无旋场在任意开域中不一定存在全域势函数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "第一句由混合偏导换序得到；逆向存在全域势要排除非零闭路环量，区域有孔可使无旋但非保守。"
    },
    {
      "id": "ca-field-4",
      "type": "single",
      "stem": "向量场中的无源场是指什么？",
      "options": {
        "A": "散度处处为 0 的向量场",
        "B": "旋度为 0 的场",
        "C": "模为 0 的场",
        "D": "梯度为 0 的场"
      },
      "answer": "A",
      "explanation": "无源场（管形场）散度为 0，如磁场。"
    },
    {
      "id": "ca-field-5",
      "type": "judge",
      "stem": "保守场中的曲线积分与路径无关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "保守场存在势函数，曲线积分只与起终点有关。"
    },
    {
      "id": "qa-20261002-ca-div-curl-compute",
      "type": "single",
      "stem": "F(x,y,z)=(x²,yz,y²)。在(1,2,3)处的(divF,curlF)是？",
      "options": {
        "A": "(5,(2,0,0))",
        "B": "(3,(2,0,0))",
        "C": "(5,(0,0,2))",
        "D": "(5,(0,0,0))"
      },
      "answer": "A",
      "explanation": "divF=2x+z；curlF=(2y−y,0,0)=(y,0,0)，代点得5和(2,0,0)。"
    }
  ],
  "calculus:ch7-s1": [
    {
      "id": "ca-series-2",
      "type": "single",
      "stem": "级数收敛的定义是？",
      "options": {
        "A": "部分和数列收敛",
        "B": "通项趋于 0",
        "C": "通项有界",
        "D": "项数为有限"
      },
      "answer": "A",
      "explanation": "级数收敛当且仅当其部分和数列有有限极限。"
    },
    {
      "id": "ca-series-3",
      "type": "single",
      "stem": "收敛级数的通项一定满足？",
      "options": {
        "A": "趋于 0",
        "B": "趋于无穷",
        "C": "为常数",
        "D": "递增"
      },
      "answer": "A",
      "explanation": "收敛级数的通项必趋于 0（反之不成立）。"
    },
    {
      "id": "ca-series-5",
      "type": "single",
      "stem": "关于收敛级数的运算，下列正确的是？",
      "options": {
        "A": "两个收敛级数可逐项相加",
        "B": "收敛级数任意重排都收敛",
        "C": "收敛级数去掉括号仍收敛",
        "D": "收敛级数通项可不为 0"
      },
      "answer": "A",
      "explanation": "收敛级数满足线性运算；重排只对绝对收敛级数保证。"
    },
    {
      "id": "ca-series-6",
      "type": "judge",
      "stem": "收敛级数任意加括号后仍然收敛。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "加括号不改变部分和的极限，故收敛性保持。"
    },
    {
      "id": "qa-20261002-ca-grouping-converse",
      "type": "single",
      "stem": "级数1−1+1−1+⋯按(1−1)+(1−1)+⋯分组后收敛到0。能否据此断定原级数收敛？",
      "options": {
        "A": "不能，原部分和在1、0间振荡",
        "B": "能，分组和就是原和",
        "C": "能，通项趋0",
        "D": "能，原和必为1/2"
      },
      "answer": "A",
      "explanation": "分组部分和是原部分和的子列；子列收敛不保证全数列收敛。原通项±1也不趋0。"
    }
  ],
  "calculus:ch7-s2": [
    {
      "id": "ca-posseries-1",
      "type": "single",
      "stem": "p 级数 Σ 1/nᵖ 收敛的充要条件是？",
      "options": {
        "A": "p > 1",
        "B": "p < 1",
        "C": "p ≥ 1",
        "D": "p = 1"
      },
      "answer": "A",
      "explanation": "p 级数 p>1 收敛、p≤1 发散；p=1 时是发散的调和级数。"
    },
    {
      "id": "ca-posseries-3",
      "type": "judge",
      "stem": "正项级数收敛的充要条件是其部分和数列有界。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "正项级数部分和单调递增，故收敛 ⇔ 有界。"
    },
    {
      "id": "ca-posseries-4",
      "type": "single",
      "stem": "用比值判别法时，若极限 ρ < 1，则级数？",
      "options": {
        "A": "收敛",
        "B": "发散",
        "C": "不确定",
        "D": "为 0"
      },
      "answer": "A",
      "explanation": "ρ<1 收敛，ρ>1 发散，ρ=1 失效需另判。"
    },
    {
      "id": "qa-20261002-ca-telescoping",
      "type": "single",
      "stem": "Σ_{n=1}∞1/[n(n+1)]的和为？",
      "options": {
        "A": "1",
        "B": "2",
        "C": "0",
        "D": "发散，因为项趋0"
      },
      "answer": "A",
      "explanation": "1/[n(n+1)]=1/n−1/(n+1)，S_N=1−1/(N+1)→1。通项趋0并不能判发散。"
    }
  ],
  "calculus:ch7-s3": [
    {
      "id": "ca-alt-1-r2",
      "type": "single",
      "stem": "Σ_{n=1}∞(−1)^{n−1}/n的敛散性为？",
      "options": {
        "A": "条件收敛",
        "B": "绝对收敛",
        "C": "发散",
        "D": "有限项之和"
      },
      "answer": "A",
      "explanation": "1/n单调趋0，交错和依莱布尼茨收敛；绝对值级数为发散调和级数，因此条件收敛。"
    },
    {
      "id": "ca-alt-3",
      "type": "judge",
      "stem": "绝对收敛的级数一定收敛。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "绝对收敛 ⇒ 收敛，反之不成立。"
    },
    {
      "id": "ca-alt-4",
      "type": "single",
      "stem": "级数的条件收敛是指什么？",
      "options": {
        "A": "级数收敛但取绝对值后发散",
        "B": "级数发散",
        "C": "级数绝对收敛",
        "D": "级数为正项"
      },
      "answer": "A",
      "explanation": "条件收敛的级数本身收敛，但不绝对收敛。"
    },
    {
      "id": "ca-alt-5",
      "type": "judge",
      "stem": "绝对收敛的级数可以任意重排而不改变其和。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "绝对收敛级数具有可交换性；条件收敛级数重排可能改变和。"
    },
    {
      "id": "qa-20261002-ca-alternating-error",
      "type": "single",
      "stem": "用莱布尼茨“误差不超过首个舍去项”估计Σ_{n=1}∞(−1)^{n−1}/n。为保证误差≤0.01，至少保留几项？",
      "options": {
        "A": "99",
        "B": "100",
        "C": "98",
        "D": "50"
      },
      "answer": "A",
      "explanation": "保留N项后该估计给|余项|≤1/(N+1)，要求N+1≥100，所以最小N=99。100项也能保证，但不是最小项数。"
    }
  ],
  "calculus:ch7-s4": [
    {
      "id": "ca-series-1-r2",
      "type": "single",
      "stem": "幂级数Σaₙxⁿ的系数从某项起非零，且lim|aₙ/aₙ₊₁|存在为R，则收敛半径为？",
      "options": {
        "A": "R",
        "B": "1/R",
        "C": "R²",
        "D": "必为0"
      },
      "answer": "A",
      "explanation": "尾部非零比值极限存在时用比值判别得半径R；更一般是1/R=limsup |aₙ|^{1/n}，不能擅自假设根式极限总存在。"
    },
    {
      "id": "ca-series-8-r2",
      "type": "judge",
      "stem": "幂级数以x₀为中心、半径R>0，在|x−x₀|<R处绝对收敛；边界点可能条件收敛或发散。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "绝对收敛保证的是严格内部，端点要分别代入原系数级数。Σxⁿ/n在−1条件收敛、1发散。"
    },
    {
      "id": "ca-series-9",
      "type": "single",
      "stem": "求幂级数收敛域时，端点需要？",
      "options": {
        "A": "单独判断敛散性",
        "B": "直接包含",
        "C": "直接排除",
        "D": "取平均值"
      },
      "answer": "A",
      "explanation": "收敛半径只确定开区间，端点要代入原级数单独判断。"
    },
    {
      "id": "ca-series-10",
      "type": "judge",
      "stem": "幂级数逐项求导或逐项积分后，收敛半径不变。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "逐项求导/积分保持收敛半径，但端点敛散性可能改变。"
    },
    {
      "id": "qa-20261002-ca-endpoint-domain",
      "type": "single",
      "stem": "幂级数Σ_{n=1}∞xⁿ/n的实收敛域是？",
      "options": {
        "A": "[−1,1)",
        "B": "(−1,1)",
        "C": "[−1,1]",
        "D": "(−1,1]"
      },
      "answer": "A",
      "explanation": "比值法得R=1。x=1为调和级数发散，x=−1为交错调和级数收敛；严格内部绝对收敛。"
    }
  ],
  "calculus:ch7-s5": [
    {
      "id": "ca-taylor-1-r2",
      "type": "judge",
      "stem": "函数在0附近有任意阶导数，就必定在邻域内等于其0点Taylor级数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "反例f(x)=e^{−1/x²}（x≠0），f(0)=0，各阶导数在0均0，但任意非零x的f>0。Taylor级数恒0，不等于函数。需解析性或相应余项趋0等条件。"
    },
    {
      "id": "ca-taylor-2",
      "type": "single",
      "stem": "麦克劳林级数是泰勒级数在何处展开的特例？",
      "options": {
        "A": "x₀ = 0",
        "B": "x₀ = 1",
        "C": "x₀ = ∞",
        "D": "x₀ = −1"
      },
      "answer": "A",
      "explanation": "麦克劳林级数是 x₀=0 处的泰勒级数。"
    },
    {
      "id": "ca-taylor-4-r2",
      "type": "single",
      "stem": "若函数在同一中心x₀的一个邻域内由收敛幂级数表示，则这组系数如何？",
      "options": {
        "A": "唯一，aₙ=f⁽ⁿ⁾(x₀)/n!",
        "B": "可任意改变",
        "C": "全为0",
        "D": "只由函数最大值决定"
      },
      "answer": "A",
      "explanation": "在收敛圆内部逐项求导，代中心得f⁽ⁿ⁾(x₀)=n!aₙ。不同中心的系数不要求相同。"
    },
    {
      "id": "exam-calculus-ch7-s5-2023-11-b-r2",
      "type": "single",
      "stem": "eˣ的0点展开式为哪一项（每个Σ从n=0到∞）？",
      "options": {
        "A": "Σ(−1)ⁿxⁿ",
        "B": "Σxⁿ/n!",
        "C": "Σn!xⁿ",
        "D": "Σx^{2n}"
      },
      "answer": "B",
      "explanation": "eˣ各阶导数在0均1，系数1/n!，全实轴收敛。n=0常数项不可遗漏。"
    },
    {
      "id": "qa-20261002-ca-log-coefficient",
      "type": "single",
      "stem": "ln(1+x)在0处的幂级数中，x³的系数为？",
      "options": {
        "A": "1/3",
        "B": "−1/3",
        "C": "1/6",
        "D": "3"
      },
      "answer": "A",
      "explanation": "展开x−x²/2+x³/3−⋯，亦可算f‴(0)=2，除3!=6得1/3，展开在|x|<1有效。"
    }
  ],
  "calculus:ch7-s6": [
    {
      "id": "ca-fourier-1-r2",
      "type": "single",
      "stem": "对2π周期的可积实函数，通常定义的傅里叶级数使用哪组基函数？",
      "options": {
        "A": "1、cos(nx)、sin(nx)，n为正整数",
        "B": "只有xⁿ",
        "C": "只有e^{−nx}",
        "D": "只有常数"
      },
      "answer": "A",
      "explanation": "三角正交系定义傅里叶系数；定义级数不等于保证任意可积函数在每点都收敛到该点值。"
    },
    {
      "id": "ca-fourier-2",
      "type": "single",
      "stem": "傅里叶系数 aₙ、bₙ 通过什么计算？",
      "options": {
        "A": "对函数与三角函数乘积在一个周期上积分",
        "B": "求导",
        "C": "求极限",
        "D": "解方程"
      },
      "answer": "A",
      "explanation": "利用三角函数的正交性，通过积分求出各系数。"
    },
    {
      "id": "ca-fourier-3-r2",
      "type": "judge",
      "stem": "周期函数在一周期内分段C¹且各分段端点单侧函数值/导数有限，则其傅里叶级数在每点收敛到左右极限平均值。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这些足够正则条件保证通常Dirichlet结论；连续点平均等于点值，跳跃点可不等于人为指定点值。不能省略有限值等条件。"
    },
    {
      "id": "ca-fourier-4",
      "type": "single",
      "stem": "奇函数和偶函数的傅里叶展开分别是？",
      "options": {
        "A": "奇函数展开为正弦级数，偶函数展开为余弦级数",
        "B": "都为正弦级数",
        "C": "都为余弦级数",
        "D": "都含正余弦项"
      },
      "answer": "A",
      "explanation": "利用奇偶性可使一部分傅里叶系数为 0。"
    },
    {
      "id": "ca-fourier-5-r2",
      "type": "single",
      "stem": "满足Dirichlet条件的周期函数，在某跳点左右极限分别为−1与3，点值指定为100。级数在该点和为？",
      "options": {
        "A": "1",
        "B": "100",
        "C": "−1",
        "D": "3"
      },
      "answer": "A",
      "explanation": "和为(−1+3)/2=1；单点重新赋值不改变积分系数，也不改变左右极限平均。"
    },
    {
      "id": "qa-20261002-ca-periodic-sawtooth",
      "type": "single",
      "stem": "f(x)=x在(−π,π)上，作2π周期延拓并任意定义端点值。其傅里叶级数在x=π处收敛到？",
      "options": {
        "A": "0",
        "B": "π",
        "C": "−π",
        "D": "任意端点指定值"
      },
      "answer": "A",
      "explanation": "周期延拓在π的左极限π、右极限−π，满足分段光滑，平均0。端点赋值不改变傅里叶系数。"
    }
  ],
  "calculus:ch8-s1": [
    {
      "id": "ca-ode-2",
      "type": "single",
      "stem": "微分方程是指什么样的方程？",
      "options": {
        "A": "含有未知函数及其导数的方程",
        "B": "只含常数的方程",
        "C": "线性方程组",
        "D": "不等式"
      },
      "answer": "A",
      "explanation": "微分方程把未知函数与它的导数联系起来。"
    },
    {
      "id": "ca-ode-3",
      "type": "single",
      "stem": "微分方程的阶数由什么决定？",
      "options": {
        "A": "方程中未知函数最高阶导数的阶数",
        "B": "未知数的个数",
        "C": "方程的项数",
        "D": "系数的大小"
      },
      "answer": "A",
      "explanation": "阶数等于最高阶导数的阶数。"
    },
    {
      "id": "ca-ode-4-r2",
      "type": "judge",
      "stem": "在区间I上，正规n阶线性常微分方程的系数和右端连续，其通解包含n个独立任意常数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "正规指最高阶导数系数在I上不为零，可化成标准式。存在唯一初值解给n维齐次解空间，非齐次通解为特解加此空间；任意非线性或退化隐式方程不保证有n参数解族。"
    },
    {
      "id": "ca-ode-5",
      "type": "single",
      "stem": "由初始条件确定通解中的任意常数后得到的是？",
      "options": {
        "A": "特解",
        "B": "通解",
        "C": "齐次解",
        "D": "隐式解"
      },
      "answer": "A",
      "explanation": "代入初始条件确定常数即得满足条件的特解。"
    },
    {
      "id": "exam-calculus-ode-2015-2-r2",
      "type": "single",
      "stem": "若 y=eˣ 是齐次方程 y″+ay′+by=0 的解，则系数必须满足什么关系？",
      "options": {
        "A": "a+b=1",
        "B": "a−b=1",
        "C": "a+b=−1",
        "D": "a−b=−1"
      },
      "answer": "C",
      "explanation": "代入 y=eˣ 得到 (1+a+b)eˣ=0，所以 1+a+b=0。"
    },
    {
      "id": "exam-calculus-ode-2017-10-r2",
      "type": "single",
      "stem": "微分方程 y′+2y=0 且 y(0)=3 的解是哪一个？",
      "options": {
        "A": "3e²ˣ",
        "B": "3e⁻²ˣ",
        "C": "2e⁻³ˣ",
        "D": "3−2x"
      },
      "answer": "B",
      "explanation": "方程通解为 Ce⁻²ˣ；代入初值 y(0)=3 得 C=3。"
    },
    {
      "id": "qa-20261002-ca-verify-solution",
      "type": "single",
      "stem": "函数y=x²满足哪一组微分方程与初值？",
      "options": {
        "A": "y′=2x，y(1)=1",
        "B": "y′=x，y(1)=1",
        "C": "y′=2x，y(1)=0",
        "D": "y″=x，y(1)=1"
      },
      "answer": "A",
      "explanation": "y′=2x、y″=2，且y(1)=1；必须同时验证方程和给定初值。"
    }
  ],
  "calculus:ch8-s2": [
    {
      "id": "ca-ode-1",
      "type": "single",
      "stem": "形如 y′ + P(x)y = Q(x) 的一阶线性微分方程，其通解公式中的积分因子是？",
      "options": {
        "A": "e^∫P(x)dx",
        "B": "e^∫Q(x)dx",
        "C": "P(x)Q(x)",
        "D": "1/P(x)"
      },
      "answer": "A",
      "explanation": "两边同乘积分因子 e^∫P(x)dx 后，左边可写成 (y·e^∫Pdx)′，再积分即得通解。"
    },
    {
      "id": "ca-ode-7-r2",
      "type": "single",
      "stem": "求y′=y(1−y)时，直接除以y(1−y)再分离变量，需要另查什么？",
      "options": {
        "A": "常值解y=0与y=1",
        "B": "只有y=2",
        "C": "只有y=x",
        "D": "不可能漏任何解"
      },
      "answer": "A",
      "explanation": "两个常值解使原方程两边均0，却令被除因子为0。非零分支积分不能包含它们，须单独补查。"
    },
    {
      "id": "ca-ode-9",
      "type": "single",
      "stem": "对于齐次方程 dy/dx = φ(y/x)，常用什么代换？",
      "options": {
        "A": "u = y/x",
        "B": "u = xy",
        "C": "u = x+y",
        "D": "u = x−y"
      },
      "answer": "A",
      "explanation": "令 u=y/x，可把齐次方程化为可分离变量方程。"
    },
    {
      "id": "ca-ode-10-r2",
      "type": "judge",
      "stem": "Bernoulli方程y′+P(x)y=Q(x)yⁿ，n≠0,1。在y≠0且幂有实意义的分支上，z=y^{1−n}使其化为一阶线性方程；被除去的常值解须另查。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "z′=(1−n)y^{−n}y′，得到z′+(1−n)Pz=(1−n)Q。n=1代换不可逆，y=0也不能直接除。"
    },
    {
      "id": "qa-20261002-ca-linear-initial",
      "type": "single",
      "stem": "y′+y=eˣ，y(0)=0。解为？",
      "options": {
        "A": "(eˣ−e^{−x})/2",
        "B": "eˣ",
        "C": "(eˣ+e^{−x})/2",
        "D": "xeˣ"
      },
      "answer": "A",
      "explanation": "乘eˣ得(yeˣ)′=e^{2x}，积分并用初值确定常数−1/2；除eˣ给答案。"
    }
  ],
  "calculus:ch8-s3": [
    {
      "id": "ca-reduce-1-r2",
      "type": "single",
      "stem": "y″=2，y(0)=1，y′(0)=3。解为？",
      "options": {
        "A": "x²+3x+1",
        "B": "2x²+3x+1",
        "C": "x²+x+3",
        "D": "x²+1"
      },
      "answer": "A",
      "explanation": "先积分y′=2x+C₁，初值给C₁3；再积分y=x²+3x+C₂，C₂1。先设p=y′也合法，原方式题不能排除此法。"
    },
    {
      "id": "ca-reduce-2",
      "type": "single",
      "stem": "方程 y″ = f(x, y′) 的降阶方法是？",
      "options": {
        "A": "令 p = y′，则 y″ = p′，化为关于 p 的一阶方程",
        "B": "令 p = y",
        "C": "直接积分",
        "D": "用特征方程"
      },
      "answer": "A",
      "explanation": "不显含 y 的方程令 p=y′ 降为一阶。"
    },
    {
      "id": "ca-reduce-3-r2",
      "type": "judge",
      "stem": "对不显x的方程y″=f(y,y′)，在可局部以y为自变量且p(y)=y′可导的分支上，有y″=p·dp/dy；常值或退化分支须另查。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由p(y(x))链式求导给y″=(dp/dy)y′。不得把不能局部反解/不可导的p分支当作同样合法。"
    },
    {
      "id": "exam-calculus-ch8-s3-2017-10-a-r2",
      "type": "single",
      "stem": "若 y″=f(x)，先对方程积分一次可得到？",
      "options": {
        "A": "y=f(x)+C",
        "B": "y″=0",
        "C": "y′=∫f(x)dx+C",
        "D": "y′=f′(x)"
      },
      "answer": "C",
      "explanation": "逐次积分降低阶数，每次引入一个积分常数。"
    },
    {
      "id": "qa-20261002-ca-reduce-exponential",
      "type": "single",
      "stem": "y″=y′，y(0)=0，y′(0)=2。令p=y′降阶后所得y为？",
      "options": {
        "A": "2(eˣ−1)",
        "B": "2xeˣ",
        "C": "e^{2x}−1",
        "D": "2"
      },
      "answer": "A",
      "explanation": "p′=p且p(0)=2，故p=2eˣ；再积分并用y0=0得2eˣ−2。"
    }
  ],
  "calculus:ch8-s4": [
    {
      "id": "ca-linst-1-r2",
      "type": "single",
      "stem": "在p,q连续的区间I上，y″+p(x)y′+q(x)y=0有两个线性无关解y₁、y₂，其通解为？",
      "options": {
        "A": "C₁y₁+C₂y₂",
        "B": "只有y₁+y₂",
        "C": "y₁y₂",
        "D": "任意常数函数"
      },
      "answer": "A",
      "explanation": "正规二阶线性方程解空间维数2，两个线性无关解构成基；常数需独立可选。"
    },
    {
      "id": "ca-linst-2",
      "type": "single",
      "stem": "非齐次线性方程的通解结构是？",
      "options": {
        "A": "特解 + 对应齐次方程的通解",
        "B": "只有特解",
        "C": "只有齐次通解",
        "D": "两个特解之积"
      },
      "answer": "A",
      "explanation": "非齐次通解 = 一个特解 + 齐次通解。"
    },
    {
      "id": "ca-linst-3",
      "type": "judge",
      "stem": "齐次线性方程的解构成一个向量空间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "齐次解对加法与数乘封闭，构成解空间。"
    },
    {
      "id": "ca-linst-4",
      "type": "single",
      "stem": "非齐次线性方程的叠加原理指出什么？",
      "options": {
        "A": "非齐次方程多个特解可相加（对应多个非齐次项）",
        "B": "齐次解只有一个",
        "C": "特解唯一",
        "D": "通解不含常数"
      },
      "answer": "A",
      "explanation": "若 f=Σfᵢ，则可分别求各 fᵢ 的特解再相加。"
    },
    {
      "id": "ca-linst-5-r2",
      "type": "judge",
      "stem": "对线性算子L，同一个非齐次方程L[y]=f（f不恒为0）的两个特解相加，仍一定是该方程的特解。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "L[y₁+y₂]=2f而非f。可叠加的是分别对应不同右端f₁、f₂的特解，得到右端f₁+f₂。"
    },
    {
      "id": "qa-20261002-ca-nonhomogeneous-structure",
      "type": "single",
      "stem": "方程y″−y=x的通解为？",
      "options": {
        "A": "−x+C₁eˣ+C₂e^{−x}",
        "B": "x+C₁eˣ+C₂e^{−x}",
        "C": "(C₁+C₂x)eˣ",
        "D": "C₁eˣ+C₂e^{−x}"
      },
      "answer": "A",
      "explanation": "yp=−x代入给x；齐次根±1。A为特解加齐次通解，B右端−x，D右端0。"
    }
  ],
  "calculus:ch8-s5": [
    {
      "id": "ca-ode2-1",
      "type": "single",
      "stem": "求解二阶常系数齐次线性方程 y″+py′+qy=0 时，关键是解？",
      "options": {
        "A": "特征方程 r²+pr+q=0",
        "B": "一次方程 y′+py=0",
        "C": "不等式 r²>0",
        "D": "方程组 y″=0"
      },
      "answer": "A",
      "explanation": "设 y=e^{rx} 得特征方程 r²+pr+q=0，按两相异实根、重根、共轭复根三种情况写通解。"
    },
    {
      "id": "ca-ode2-4-r2",
      "type": "single",
      "stem": "用待定系数法求y″−2y′+y=eˣ的特解，最低次数试探形式为？",
      "options": {
        "A": "Cx²eˣ",
        "B": "Ceˣ",
        "C": "Cxeˣ",
        "D": "Cx³eˣ"
      },
      "answer": "A",
      "explanation": "特征根1为二重根，eˣ和xeˣ已经齐次，必须乘x²；代入L[Cx²eˣ]=2Ceˣ，C=1/2。"
    },
    {
      "id": "ca-ode2-5",
      "type": "judge",
      "stem": "当特征方程有重根 r 时，通解中含有 x·e^{rx} 形式的项。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "重根情形通解为 (C₁+C₂x)e^{rx}。"
    },
    {
      "id": "exam-calculus-ch8-s5-2015-2-b-r2",
      "type": "single",
      "stem": "特征方程有一对共轭复根 α±iβ 时，实通解包含？",
      "options": {
        "A": "C₁e^(αx)+C₂e^(βx)",
        "B": "C₁x+C₂",
        "C": "C₁cosαx+C₂sinβx",
        "D": "e^(αx)(C₁cosβx+C₂sinβx)"
      },
      "answer": "D",
      "explanation": "共轭复根对应指数包络乘正弦、余弦的实解。"
    },
    {
      "id": "qa-20261002-ca-oscillator-initial",
      "type": "single",
      "stem": "y″+4y=0，y(0)=0，y′(0)=2。解为？",
      "options": {
        "A": "sin(2x)",
        "B": "2sin(2x)",
        "C": "cos(2x)",
        "D": "e^{2x}"
      },
      "answer": "A",
      "explanation": "通解C₁cos2x+C₂sin2x，初值C₁0、2C₂2，故C₂1。"
    }
  ],
  "calculus:ch8-s6": [
    {
      "id": "ca-odeapp-1",
      "type": "single",
      "stem": "用微分方程解决实际问题的第一步通常是？",
      "options": {
        "A": "根据变化率关系建立微分方程",
        "B": "直接求导",
        "C": "直接积分",
        "D": "查表"
      },
      "answer": "A",
      "explanation": "把实际问题中的变化规律翻译成微分方程。"
    },
    {
      "id": "ca-odeapp-2",
      "type": "single",
      "stem": "人口增长模型（Malthus 模型）的微分方程是？",
      "options": {
        "A": "dP/dt = kP",
        "B": "dP/dt = k",
        "C": "dP/dt = k/P",
        "D": "dP/dt = 0"
      },
      "answer": "A",
      "explanation": "增长率与当前人口成正比，解得指数增长。"
    },
    {
      "id": "ca-odeapp-3",
      "type": "judge",
      "stem": "牛顿冷却定律可用微分方程描述温度随时间的变化。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "冷却速率与物体和环境温差成正比。"
    },
    {
      "id": "ca-odeapp-4-r2",
      "type": "single",
      "stem": "10 L充分混合溶液初始无盐。以2 L/min流入浓度3 g/L盐水，同时2 L/min流出。盐量S(t)（g）的方程为？",
      "options": {
        "A": "S′=6−S/5，S(0)=0",
        "B": "S′=6−2S，S(0)=0",
        "C": "S′=3−S/10，S(0)=0",
        "D": "S′=6−S/10，S(0)=0"
      },
      "answer": "A",
      "explanation": "体积保持10 L；流入盐6 g/min，流出盐2·S/10=S/5 g/min，物质守恒给A。"
    },
    {
      "id": "exam-calculus-ch8-s6-2015-17-b-r2",
      "type": "judge",
      "stem": "常数k的一阶模型y′=ky，其全体解为y=Ce^{kx}；k=0或C=0时包含常值退化情形。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "积分因子或分离得Ce^{kx}，允许k0给任意常数、C0给零解；不能把指数形式与不变常数互斥。"
    },
    {
      "id": "qa-20261002-ca-newton-cooling",
      "type": "single",
      "stem": "恒环境20℃，物体初温80℃，按牛顿冷却，10分钟后50℃。20分钟后温度为？",
      "options": {
        "A": "35℃",
        "B": "25℃",
        "C": "40℃",
        "D": "20℃"
      },
      "answer": "A",
      "explanation": "温差初始60、10分钟后30，温差每10分钟乘1/2；20分钟后15，加环境20得35。"
    }
  ]
});
})(window);
