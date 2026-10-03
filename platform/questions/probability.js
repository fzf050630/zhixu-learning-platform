/* 逐题知识与质量复核后的学习练习；由审计草稿合并。 */
(function(g){
  g.ZhixuQuestionBankVersion="question-quality-20261002-r2";
  Object.assign(g.ZhixuQuestions=g.ZhixuQuestions||{},{
  "probability:ch1-s1": [
    {
      "id": "pr-event-1",
      "type": "single",
      "stem": "若事件 A 与 B 互斥（互不相容），则？",
      "options": {
        "A": "P(A∪B) = P(A) + P(B)",
        "B": "P(AB) = P(A)P(B)",
        "C": "A 与 B 相互独立",
        "D": "P(A) = P(B)"
      },
      "answer": "A",
      "explanation": "互斥即 AB=∅，由可加性得 P(A∪B)=P(A)+P(B)；独立性是 P(AB)=P(A)P(B)，与互斥不同。"
    },
    {
      "id": "pr-ss-1-r2",
      "type": "single",
      "stem": "随机试验通常具有哪些特点？",
      "options": {
        "A": "可在相同条件下重复、全部可能结果已知、本次结果事先不确定",
        "B": "不可重复",
        "C": "全部可能结果都未知",
        "D": "本次结果事先确定"
      },
      "answer": "A",
      "explanation": "随机试验可重复进行，所有可能结果已知，但每次结果事先不确定。"
    },
    {
      "id": "pr-ss-2",
      "type": "judge",
      "stem": "样本空间是随机试验所有可能结果组成的集合。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "样本空间 Ω 包含全部样本点，每个样本点是一个可能结果。"
    },
    {
      "id": "pr-ss-3",
      "type": "single",
      "stem": "必然事件与不可能事件分别对应？",
      "options": {
        "A": "Ω 与 ∅",
        "B": "∅ 与 Ω",
        "C": "都为 Ω",
        "D": "都为 ∅"
      },
      "answer": "A",
      "explanation": "必然事件在每次试验中发生，即 Ω；不可能事件为 ∅。"
    },
    {
      "id": "pr-ss-4",
      "type": "judge",
      "stem": "基本事件是由单个样本点构成的事件。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "基本事件不能再分解为更小的事件，对应一个样本点。"
    },
    {
      "id": "exam-prob-event-2014-7-r2",
      "type": "single",
      "stem": "事件 A、B 相互独立，P(B)=0.5，P(A−B)=0.3，则 P(B−A) 等于多少？",
      "options": {
        "A": "0.1",
        "B": "0.2",
        "C": "0.3",
        "D": "0.4"
      },
      "answer": "B",
      "explanation": "先由 P(A−B)=P(A)(1−P(B)) 得 P(A)=0.6，再由 P(AB)=0.3 得 P(B−A)=0.2。"
    },
    {
      "id": "exam-prob-event-2015-7-r2",
      "type": "single",
      "stem": "A、B 相互独立，P(A)=0.6、P(B)=0.5，则 P(A∩B) 等于多少？",
      "options": {
        "A": "0.1",
        "B": "0.2",
        "C": "0.3",
        "D": "0.5"
      },
      "answer": "C",
      "explanation": "独立事件满足 P(A∩B)=P(A)P(B)=0.6×0.5=0.3。"
    },
    {
      "id": "qa-20261002-probability-ch1-s1",
      "type": "single",
      "stem": "公平六面骰一次，A={1,2,3}、B={3,4}。恰发生A、B之一的概率是？",
      "options": {
        "A": "1/2",
        "B": "2/3",
        "C": "1/3",
        "D": "5/6"
      },
      "answer": "A",
      "explanation": "对称差{1,2,4}三个结果，概率3/6。"
    }
  ],
  "probability:ch1-s2": [
    {
      "id": "pr-op-1",
      "type": "single",
      "stem": "A ⊂ B 表示？",
      "options": {
        "A": "A 发生必然导致 B 发生",
        "B": "B 发生必然导致 A 发生",
        "C": "A 与 B 互斥",
        "D": "A 与 B 独立"
      },
      "answer": "A",
      "explanation": "A 包含于 B 意味着 A 的样本点都属于 B，A 发生则 B 必发生。"
    },
    {
      "id": "pr-op-2",
      "type": "single",
      "stem": "德摩根律指出 (A∪B)ᶜ 等于？",
      "options": {
        "A": "Aᶜ∩Bᶜ",
        "B": "Aᶜ∪Bᶜ",
        "C": "A∩B",
        "D": "A∪B"
      },
      "answer": "A",
      "explanation": "德摩根律：(A∪B)ᶜ=Aᶜ∩Bᶜ，(A∩B)ᶜ=Aᶜ∪Bᶜ。"
    },
    {
      "id": "pr-op-3",
      "type": "judge",
      "stem": "A − B = A ∩ Bᶜ。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "A 发生而 B 不发生，即 A 与 B 的补集之交。"
    },
    {
      "id": "pr-op-4",
      "type": "single",
      "stem": "互斥与对立的区别是？",
      "options": {
        "A": "对立要求 A∪B=Ω 且 AB=∅，互斥只要求 AB=∅",
        "B": "两者相同",
        "C": "互斥要求并为全集",
        "D": "对立只要求不相交"
      },
      "answer": "A",
      "explanation": "对立（互逆）是更强的条件，对立一定互斥，互斥不一定对立。"
    },
    {
      "id": "qa-20261002-probability-ch1-s2",
      "type": "single",
      "stem": "公平六面骰一次，A={1,2,3}、B={3,4}，事件 (A∪B)ᶜ 对应？",
      "options": {
        "A": "{4,5,6}",
        "B": "{5,6}",
        "C": "{1,2}",
        "D": "{3}"
      },
      "answer": "B",
      "explanation": "先并得到{1,2,3,4}，相对全集取补为{5,6}。"
    }
  ],
  "probability:ch1-s3": [
    {
      "id": "pr-def-1",
      "type": "single",
      "stem": "概率的公理化定义包含哪三条？",
      "options": {
        "A": "非负性、规范性、可列可加性",
        "B": "连续性、可导性、单调性",
        "C": "独立性、互斥性、对立性",
        "D": "对称性、传递性、完备性"
      },
      "answer": "A",
      "explanation": "概率 P 满足非负性、P(Ω)=1 和可列可加性。"
    },
    {
      "id": "pr-def-2",
      "type": "single",
      "stem": "P(Aᶜ) 等于？",
      "options": {
        "A": "1 − P(A)",
        "B": "P(A)",
        "C": "0",
        "D": "1 + P(A)"
      },
      "answer": "A",
      "explanation": "由 A 与 Aᶜ 互斥且并为 Ω，得 P(Aᶜ)=1−P(A)。"
    },
    {
      "id": "pr-def-3",
      "type": "judge",
      "stem": "不可能事件的概率为 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由规范性 P(Ω)=1 与补事件关系可得 P(∅)=0。"
    },
    {
      "id": "pr-def-4",
      "type": "single",
      "stem": "概率的加法公式是？",
      "options": {
        "A": "P(A∪B)=P(A)+P(B)−P(AB)",
        "B": "P(A∪B)=P(A)+P(B)",
        "C": "P(A∪B)=P(A)P(B)",
        "D": "P(A∪B)=P(A)−P(B)"
      },
      "answer": "A",
      "explanation": "一般加法公式需减去交集，A、B 互斥时 P(AB)=0。"
    },
    {
      "id": "pr-def-5",
      "type": "judge",
      "stem": "概率具有单调性：若 A ⊂ B，则 P(A) ≤ P(B)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由 B=A∪(B−A) 且互斥可得 P(B)=P(A)+P(B−A)≥P(A)。"
    },
    {
      "id": "qa-20261002-probability-ch1-s3",
      "type": "single",
      "stem": "P(A)=0.7、P(B)=0.6，P(A∩B) 的最小可能值是？",
      "options": {
        "A": "0.1",
        "B": "0.6",
        "C": "0.3",
        "D": "0"
      },
      "answer": "C",
      "explanation": "容斥并概率≤1给交≥0.7+0.6−1=0.3，可构造并为全集达到。"
    }
  ],
  "probability:ch1-s4": [
    {
      "id": "pr-classic-1",
      "type": "single",
      "stem": "古典概型要求样本空间满足什么条件？",
      "options": {
        "A": "样本点有限且每个样本点等可能",
        "B": "样本点无限但等可能",
        "C": "样本点有限但概率可不等",
        "D": "样本空间连续"
      },
      "answer": "A",
      "explanation": "古典概型的两个前提：样本点总数有限、每个基本事件发生的可能性相同。"
    },
    {
      "id": "pr-classic-2",
      "type": "single",
      "stem": "古典概型中事件 A 的概率计算为？",
      "options": {
        "A": "A 所含样本点数 ÷ 样本空间样本点总数",
        "B": "A 的面积 ÷ 总面积",
        "C": "A 的次数 ÷ 试验次数",
        "D": "P(A)P(B)"
      },
      "answer": "A",
      "explanation": "等可能条件下，概率等于有利样本点数与总样本点数之比。"
    },
    {
      "id": "pr-classic-4",
      "type": "single",
      "stem": "计算古典概型概率时常用的计数工具是？",
      "options": {
        "A": "排列与组合",
        "B": "导数与积分",
        "C": "极限与连续",
        "D": "矩阵与行列式"
      },
      "answer": "A",
      "explanation": "通过排列、组合等计数方法确定有利与总的样本点数。"
    },
    {
      "id": "pr-classic-5-r2",
      "type": "judge",
      "stem": "对于整数 0≤k≤n，从 n 个不同元素中无序选取 k 个的组合数为 C(n,k)=n!/[k!(n−k)!]。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "组合不计顺序，排列 A(n,k)=C(n,k)·k!。"
    },
    {
      "id": "qa-20261002-probability-ch1-s4",
      "type": "single",
      "stem": "5件产品中2件次品，无放回随机抽2件。恰1件次品的概率是？",
      "options": {
        "A": "2/5",
        "B": "1/5",
        "C": "4/5",
        "D": "3/5"
      },
      "answer": "D",
      "explanation": "等可能无序对共C5,2=10，有利C2,1C3,1=6。"
    }
  ],
  "probability:ch1-s5": [
    {
      "id": "pr-geo-1",
      "type": "single",
      "stem": "几何概型中概率的计算方式是？",
      "options": {
        "A": "用区域测度（长度/面积/体积）之比",
        "B": "用样本点个数之比",
        "C": "用频率",
        "D": "用条件概率"
      },
      "answer": "A",
      "explanation": "几何概型用有利区域的测度与总区域测度之比表示概率。"
    },
    {
      "id": "pr-geo-2-r2",
      "type": "single",
      "stem": "几何概型的样本空间具有什么特点？",
      "options": {
        "A": "在有限正测度的连续区域内均匀分布，子区域概率正比于其测度",
        "B": "任何无限样本空间均符合几何概型",
        "C": "各单点概率均为0就足以说明均匀",
        "D": "样本空间只有一个点"
      },
      "answer": "A",
      "explanation": "几何概型需要均匀测度假设。单点概率全为0的指数分布并不均匀，所以不能用单点等可能替代均匀性。"
    },
    {
      "id": "pr-geo-3",
      "type": "judge",
      "stem": "几何概型中单个样本点的概率为 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "单点测度为 0，故概率为 0，但并非不可能事件。"
    },
    {
      "id": "pr-geo-4",
      "type": "single",
      "stem": "下列哪个是几何概型的经典例子？",
      "options": {
        "A": "会面问题与蒲丰投针",
        "B": "掷骰子",
        "C": "抽签",
        "D": "抛硬币"
      },
      "answer": "A",
      "explanation": "会面问题、蒲丰投针的样本空间是连续区域，属几何概型。"
    },
    {
      "id": "pr-geo-5",
      "type": "judge",
      "stem": "几何概型中事件概率与区域的测度成正比。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是几何概型的等可能性假设的直接结果。"
    },
    {
      "id": "exam-probability-ch1-s5-2021-7-b-r2",
      "type": "single",
      "stem": "在单位正方形内均匀取点，落入面积为 1/4 的子区域的概率是？",
      "options": {
        "A": "1/2",
        "B": "3/4",
        "C": "1/4",
        "D": "1"
      },
      "answer": "C",
      "explanation": "均匀取点时概率等于子区域面积与总面积之比。"
    },
    {
      "id": "qa-20261002-probability-ch1-s5",
      "type": "single",
      "stem": "X,Y在单位正方形内联合均匀，P(X+Y≤1/2)是多少？",
      "options": {
        "A": "1/8",
        "B": "1/4",
        "C": "1/2",
        "D": "3/4"
      },
      "answer": "A",
      "explanation": "左下三角直角边各1/2，面积(1/2)(1/2)/2=1/8。"
    }
  ],
  "probability:ch1-s6": [
    {
      "id": "pr-cond-1",
      "type": "single",
      "stem": "当 P(B) > 0 时，条件概率 P(A|B) 的定义是？",
      "options": {
        "A": "P(AB) / P(B)",
        "B": "P(B) / P(AB)",
        "C": "P(A) / P(B)",
        "D": "P(A) + P(B) − P(AB)"
      },
      "answer": "A",
      "explanation": "条件概率定义为 P(A|B) = P(AB)/P(B)（P(B)>0），把样本空间限制到事件 B 上。"
    },
    {
      "id": "pr-cond-2-r2",
      "type": "single",
      "stem": "固定 P(B)>0 的事件 B，条件概率 P(·|B) 作为 A 的函数是否满足概率的三条公理？",
      "options": {
        "A": "满足，是一个概率",
        "B": "不满足",
        "C": "只满足非负性",
        "D": "只满足规范性"
      },
      "answer": "A",
      "explanation": "固定 B 后，P(A|B) 关于 A 满足非负性、规范性与可列可加性。"
    },
    {
      "id": "pr-cond-3-r2",
      "type": "judge",
      "stem": "当 P(A)>0、P(B)>0 时，乘法公式为 P(AB)=P(A|B)P(B)=P(B|A)P(A)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由条件概率定义直接得到，用于计算积事件概率。"
    },
    {
      "id": "pr-cond-4-r2",
      "type": "single",
      "stem": "设 P(AB)>0，三个事件的乘法公式 P(ABC) 等于？",
      "options": {
        "A": "P(A)P(B|A)P(C|AB)",
        "B": "P(A)P(B)P(C)",
        "C": "P(A)+P(B)+P(C)",
        "D": "P(A|B)P(B|C)P(C|A)"
      },
      "answer": "A",
      "explanation": "逐步使用条件概率：P(ABC)=P(A)P(B|A)P(C|AB)。"
    },
    {
      "id": "pr-cond-5-r2",
      "type": "judge",
      "stem": "当 P(B)>0 时，初等条件概率相当于把样本空间限制到事件 B 并重新归一化。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "在已知 B 发生的条件下，讨论范围限制在 B 内。"
    },
    {
      "id": "qa-20261002-probability-ch1-s6",
      "type": "single",
      "stem": "公平六面骰一次，已知结果为偶数，结果大于3的条件概率是？",
      "options": {
        "A": "1",
        "B": "2/3",
        "C": "1/2",
        "D": "1/3"
      },
      "answer": "B",
      "explanation": "条件集合{2,4,6}，有利{4,6}，归一计数2/3。"
    }
  ],
  "probability:ch1-s7": [
    {
      "id": "pr-bayes-1-r2",
      "type": "single",
      "stem": "设 B₁,B₂ 构成样本空间划分，P(Bᵢ)>0、P(A)>0。已知先验及 P(A|Bᵢ)，求 P(Bᵢ|A) 应使用？",
      "options": {
        "A": "贝叶斯公式",
        "B": "全概率公式",
        "C": "伯努利概型",
        "D": "切比雪夫不等式"
      },
      "answer": "A",
      "explanation": "P(Bᵢ|A)=P(A|Bᵢ)P(Bᵢ)/ΣP(A|Bⱼ)P(Bⱼ)，即贝叶斯公式；分母用全概率公式计算。"
    },
    {
      "id": "pr-total-1-r2",
      "type": "single",
      "stem": "设 B₁,…,Bₙ 两两互斥且并为 Ω，P(Bᵢ)>0。全概率公式为？",
      "options": {
        "A": "P(A)=Σ P(A|Bᵢ)P(Bᵢ)",
        "B": "P(A)=P(A|B₁)P(B₁)",
        "C": "P(A)=ΠP(A|Bᵢ)",
        "D": "P(A)=ΣP(Bᵢ)"
      },
      "answer": "A",
      "explanation": "全概率公式把复杂事件 A 按划分分解后加权求和。"
    },
    {
      "id": "pr-total-2",
      "type": "judge",
      "stem": "全概率公式常用于由原因的概率推结果事件的概率。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "把各种“原因”Bᵢ 下 A 发生的条件概率加权求和，得到 P(A)。"
    },
    {
      "id": "pr-bayes-2",
      "type": "single",
      "stem": "贝叶斯公式主要用于？",
      "options": {
        "A": "由结果反推原因的后验概率",
        "B": "计算独立事件",
        "C": "求期望",
        "D": "判断收敛"
      },
      "answer": "A",
      "explanation": "已知 P(A|Bᵢ) 与先验 P(Bᵢ)，求后验 P(Bᵢ|A)。"
    },
    {
      "id": "pr-bayes-3",
      "type": "judge",
      "stem": "划分 B₁,…,Bₙ 要求两两互斥且并为整个样本空间。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "划分必须互不相容且完备（覆盖 Ω）。"
    },
    {
      "id": "qa-20261002-probability-ch1-s7",
      "type": "single",
      "stem": "两厂供货占比为3/4与1/4，次品率为1/100与3/100。抽得次品来自第二厂的概率是？",
      "options": {
        "A": "3/4",
        "B": "1/3",
        "C": "1/2",
        "D": "1/4"
      },
      "answer": "C",
      "explanation": "后验=(1/4·3/100)/(3/4·1/100+1/4·3/100)=1/2。"
    }
  ],
  "probability:ch1-s8": [
    {
      "id": "pr-indep-1",
      "type": "single",
      "stem": "事件 A 与 B 相互独立的充要条件是？",
      "options": {
        "A": "P(AB) = P(A)P(B)",
        "B": "P(A∪B) = P(A) + P(B)",
        "C": "AB = ∅",
        "D": "P(A) = P(B)"
      },
      "answer": "A",
      "explanation": "独立的定义就是 P(AB)=P(A)P(B)；互斥是 AB=∅，两者不能混淆。"
    },
    {
      "id": "pr-indep-2",
      "type": "single",
      "stem": "若 A 与 B 独立且 P(B)>0，则 P(A|B) 等于？",
      "options": {
        "A": "P(A)",
        "B": "P(B)",
        "C": "P(AB)",
        "D": "0"
      },
      "answer": "A",
      "explanation": "独立意味着 B 的发生不影响 A 的概率，故 P(A|B)=P(A)。"
    },
    {
      "id": "pr-indep-3",
      "type": "judge",
      "stem": "两个事件既互斥又独立，只有当其中一个概率为 0 时才可能。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "互斥要求 P(AB)=0，独立要求 P(AB)=P(A)P(B)，故至少一个为 0。"
    },
    {
      "id": "pr-indep-4",
      "type": "single",
      "stem": "三个事件两两独立与相互独立的关系是？",
      "options": {
        "A": "两两独立不一定相互独立",
        "B": "相互独立不一定两两独立",
        "C": "两者等价",
        "D": "无关"
      },
      "answer": "A",
      "explanation": "相互独立要求所有组合的乘积关系都成立，强于两两独立。"
    },
    {
      "id": "pr-indep-5",
      "type": "judge",
      "stem": "若 A 与 B 独立，则 A 与 Bᶜ 也独立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "P(A∩Bᶜ)=P(A)−P(AB)=P(A)(1−P(B))=P(A)P(Bᶜ)。"
    },
    {
      "id": "qa-20261002-probability-ch1-s8",
      "type": "single",
      "stem": "两枚独立公平硬币。A为第一枚正面，B为第二枚正面，C为两枚相同。哪项正确？",
      "options": {
        "A": "相互独立",
        "B": "A与C不独立",
        "C": "B与C互斥",
        "D": "两两独立但不相互独立"
      },
      "answer": "D",
      "explanation": "各概率1/2，任意两交1/4，但三交只有HH概率1/4≠1/8。"
    }
  ],
  "probability:ch1-s9": [
    {
      "id": "pr-bern-1",
      "type": "single",
      "stem": "n 重伯努利试验中成功 k 次的概率是？",
      "options": {
        "A": "C(n,k)pᵏ(1−p)ⁿ⁻ᵏ",
        "B": "pᵏ",
        "C": "C(n,k)pⁿ",
        "D": "np"
      },
      "answer": "A",
      "explanation": "成功 k 次的组合数与对应概率的乘积，即二项分布。"
    },
    {
      "id": "pr-bern-2",
      "type": "single",
      "stem": "伯努利试验的特点是？",
      "options": {
        "A": "每次试验只有两个可能结果",
        "B": "结果有无数个",
        "C": "各次试验不独立",
        "D": "概率每次变化"
      },
      "answer": "A",
      "explanation": "伯努利试验只有“成功/失败”两个结果，且各次独立、概率相同。"
    },
    {
      "id": "pr-bern-3",
      "type": "judge",
      "stem": "n 重伯努利试验要求各次试验相互独立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "独立性是 n 重伯努利试验的基本要求。"
    },
    {
      "id": "pr-bern-4",
      "type": "single",
      "stem": "n 重伯努利试验中成功次数服从什么分布？",
      "options": {
        "A": "二项分布 B(n,p)",
        "B": "泊松分布",
        "C": "均匀分布",
        "D": "指数分布"
      },
      "answer": "A",
      "explanation": "成功次数 X ~ B(n,p)，是二项分布的典型来源。"
    },
    {
      "id": "pr-bern-5",
      "type": "judge",
      "stem": "伯努利概型要求每次试验成功的概率 p 相同。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "各次试验条件相同，成功概率保持不变。"
    },
    {
      "id": "exam-probability-ch1-s9-2015-22-a-r2",
      "type": "single",
      "stem": "独立重复试验每次成功概率为 p，直到第 2 次成功停止。恰好进行 k 次的概率是？（0<p<1，整数 k≥2）",
      "options": {
        "A": "C(k−1,1)p²(1−p)^(k−2)",
        "B": "p^k",
        "C": "(1−p)^k",
        "D": "C(k,2)p(1−p)"
      },
      "answer": "A",
      "explanation": "前 k−1 次中恰有一次成功，且第 k 次成功。"
    },
    {
      "id": "qa-20261002-probability-ch1-s9",
      "type": "single",
      "stem": "独立重复试验成功率1/3，3次恰成功2次的概率是？",
      "options": {
        "A": "2/9",
        "B": "1/9",
        "C": "1/3",
        "D": "4/9"
      },
      "answer": "A",
      "explanation": "C3,2(1/3)²(2/3)=2/9。"
    }
  ],
  "probability:ch2-s1": [
    {
      "id": "pr-cdf-1",
      "type": "single",
      "stem": "随机变量的分布函数 F(x)=P(X≤x) 一定满足？",
      "options": {
        "A": "单调不减、右连续，且 F(−∞)=0、F(+∞)=1",
        "B": "单调不增",
        "C": "左连续",
        "D": "处处可导"
      },
      "answer": "A",
      "explanation": "分布函数的基本性质：单调不减、右连续，两端极限为 0 和 1。"
    },
    {
      "id": "pr-rv-2",
      "type": "judge",
      "stem": "P(a < X ≤ b) = F(b) − F(a)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由分布函数定义直接得到，注意区间端点开闭的差别。"
    },
    {
      "id": "pr-rv-3",
      "type": "single",
      "stem": "描述随机变量分布的两类工具是？",
      "options": {
        "A": "离散型用分布律，连续型用概率密度",
        "B": "都用分布函数以外的量",
        "C": "都用期望",
        "D": "都用方差"
      },
      "answer": "A",
      "explanation": "离散型用分布律，连续型用概率密度，二者都可由分布函数描述。"
    },
    {
      "id": "pr-rv-4",
      "type": "judge",
      "stem": "分布函数可以完整描述一个随机变量的概率规律。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由 F(x) 可求出任意事件的概率，故完整刻画分布。"
    },
    {
      "id": "exam-prob-onevar-2024-10-r2",
      "type": "single",
      "stem": "X、Y 相互独立且均服从参数为 λ 的指数分布。min(X,Y) 服从什么分布？",
      "options": {
        "A": "指数分布，参数 2λ",
        "B": "指数分布，参数 λ/2",
        "C": "均匀分布",
        "D": "正态分布"
      },
      "answer": "A",
      "explanation": "P(min(X,Y)>t)=P(X>t)P(Y>t)=e⁻²λᵗ，因此最小值服从参数 2λ 的指数分布。"
    },
    {
      "id": "qa-20261002-probability-ch2-s1",
      "type": "single",
      "stem": "P(X=0)=1/4、P(X=1)=3/4。P(0≤X<1) 等于？",
      "options": {
        "A": "0",
        "B": "1/4",
        "C": "3/4",
        "D": "1"
      },
      "answer": "B",
      "explanation": "区间含0不含1，所以只取0质量；不可误用F(1)−F(0)。"
    }
  ],
  "probability:ch2-s2": [
    {
      "id": "pr-discrete-1",
      "type": "judge",
      "stem": "离散型随机变量的所有可能取值对应的概率之和等于 1。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "概率分布律满足非负性与归一性 Σpᵢ=1。"
    },
    {
      "id": "pr-disc-2",
      "type": "single",
      "stem": "离散型随机变量的分布律 pₖ 必须满足？",
      "options": {
        "A": "pₖ ≥ 0 且 Σpₖ = 1",
        "B": "pₖ > 1",
        "C": "Σpₖ = 0",
        "D": "pₖ 递减"
      },
      "answer": "A",
      "explanation": "非负性与归一性是分布律的两个条件。"
    },
    {
      "id": "pr-disc-3",
      "type": "judge",
      "stem": "0-1 分布是离散型分布的一个特例。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "0-1 分布（伯努利分布）只取 0、1 两个值，是 B(1,p)。"
    },
    {
      "id": "pr-disc-4-r2",
      "type": "single",
      "stem": "只取有限多个值的离散型随机变量，其分布函数呈什么形式？",
      "options": {
        "A": "阶梯函数",
        "B": "连续函数",
        "C": "常数",
        "D": "指数函数"
      },
      "answer": "A",
      "explanation": "有限支撑时在各取值点跳跃并在相邻点间为常数，呈阶梯形；一般可数支撑可能稠密，不能不加限定地说普通阶梯函数。"
    },
    {
      "id": "pr-disc-5",
      "type": "judge",
      "stem": "分布律决定了离散型随机变量的全部概率信息。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "已知分布律即可计算任意事件的概率。"
    },
    {
      "id": "qa-20261002-probability-ch2-s2",
      "type": "single",
      "stem": "X只取0,1,2，概率依次c,2c,3c。P(X≥1)是多少？",
      "options": {
        "A": "2/3",
        "B": "1/6",
        "C": "5/6",
        "D": "1/2"
      },
      "answer": "C",
      "explanation": "归一6c=1得c=1/6，后两质量相加5/6。"
    }
  ],
  "probability:ch2-s3": [
    {
      "id": "pr-dist-1",
      "type": "single",
      "stem": "二项分布 B(n,p) 的记法表示？",
      "options": {
        "A": "n 重伯努利试验中成功次数服从的分布",
        "B": "泊松分布",
        "C": "几何分布",
        "D": "均匀分布"
      },
      "answer": "A",
      "explanation": "B(n,p) 表示 n 次独立重复试验中成功次数的分布。"
    },
    {
      "id": "pr-dist-2",
      "type": "single",
      "stem": "泊松分布 P(λ) 的期望和方差分别是？",
      "options": {
        "A": "都为 λ",
        "B": "λ 和 λ²",
        "C": "λ² 和 λ",
        "D": "都为 1"
      },
      "answer": "A",
      "explanation": "泊松分布 E(X)=D(X)=λ，这是它的重要特点。"
    },
    {
      "id": "pr-dist-3",
      "type": "judge",
      "stem": "当 n 很大、p 很小时，二项分布可用泊松分布近似。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "泊松定理：n→∞、np→λ 时二项分布趋于泊松分布。"
    },
    {
      "id": "pr-dist-4-r2",
      "type": "single",
      "stem": "采用取值为 1,2,… 的几何分布约定时，它描述什么？",
      "options": {
        "A": "首次成功所需的总试验次数（含成功那次）",
        "B": "固定n次试验中的成功总次数",
        "C": "首次成功之前的失败次数",
        "D": "固定样本容量"
      },
      "answer": "A",
      "explanation": "P(X=k)=(1−p)^(k−1)p。若改记首次成功前失败次数，则支撑从0开始，两者相差1。"
    },
    {
      "id": "pr-dist-5",
      "type": "judge",
      "stem": "超几何分布对应不放回抽样模型。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "超几何分布描述有限总体不放回抽样中成功次数；放回时对应二项分布。"
    },
    {
      "id": "qa-20261002-probability-ch2-s3",
      "type": "single",
      "stem": "独立成功率p=1/4，X是含首次成功的总试验次数。P(X>3)是多少？",
      "options": {
        "A": "1/64",
        "B": "3/4",
        "C": "37/64",
        "D": "27/64"
      },
      "answer": "D",
      "explanation": "前三次全失败，概率(3/4)³=27/64。"
    }
  ],
  "probability:ch2-s4": [
    {
      "id": "pr-pdf-1",
      "type": "single",
      "stem": "概率密度函数 f(x) 必须满足？",
      "options": {
        "A": "f(x) ≥ 0 且 ∫f(x)dx = 1",
        "B": "f(x) ≤ 1",
        "C": "∫f(x)dx = 0",
        "D": "f(x) 单调"
      },
      "answer": "A",
      "explanation": "密度的非负性与积分为 1 是基本条件。"
    },
    {
      "id": "pr-pdf-2",
      "type": "single",
      "stem": "连续型随机变量在区间 (a,b) 内的概率等于？",
      "options": {
        "A": "∫ₐᵇ f(x)dx",
        "B": "f(b) − f(a)",
        "C": "f(a)f(b)",
        "D": "F(a)F(b)"
      },
      "answer": "A",
      "explanation": "连续型概率由密度在该区间上的积分给出。"
    },
    {
      "id": "pr-pdf-3",
      "type": "judge",
      "stem": "连续型随机变量取任一单点的概率为 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "单点积分为 0，因此 P(X=a)=0，区间端点开闭不影响概率。"
    },
    {
      "id": "pr-pdf-4",
      "type": "single",
      "stem": "在密度函数的连续点处，F′(x) 等于？",
      "options": {
        "A": "f(x)",
        "B": "0",
        "C": "F(x)",
        "D": "1"
      },
      "answer": "A",
      "explanation": "分布函数是密度的变限积分，故在连续点处 F′(x)=f(x)。"
    },
    {
      "id": "pr-pdf-5",
      "type": "judge",
      "stem": "连续型随机变量的密度函数不唯一，改变有限个点的取值不影响概率。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "积分不受有限点改动影响，故密度不唯一。"
    },
    {
      "id": "qa-20261002-probability-ch2-s4",
      "type": "single",
      "stem": "f(x)=cx在0<x<2，其余为0。使其成为概率密度的c是？",
      "options": {
        "A": "1/2",
        "B": "1",
        "C": "1/4",
        "D": "2"
      },
      "answer": "A",
      "explanation": "∫0²cx dx=2c=1，c=1/2，非负满足。"
    }
  ],
  "probability:ch2-s5": [
    {
      "id": "pr-cont-1",
      "type": "single",
      "stem": "关于常见连续型分布，下列说法正确的是？",
      "options": {
        "A": "正态分布由均值 μ 与方差 σ² 完全确定",
        "B": "指数分布是连续型的对称分布",
        "C": "均匀分布的期望与方差均为 1/2",
        "D": "标准正态分布的方差为 1、期望为 1"
      },
      "answer": "A",
      "explanation": "正态分布 N(μ,σ²) 由 μ 和 σ² 唯一确定；标准正态分布期望 0、方差 1。"
    },
    {
      "id": "pr-cont-2",
      "type": "single",
      "stem": "若 X~N(μ,σ²)，则 (X−μ)/σ 服从？",
      "options": {
        "A": "标准正态分布 N(0,1)",
        "B": "N(μ,σ²)",
        "C": "均匀分布",
        "D": "指数分布"
      },
      "answer": "A",
      "explanation": "正态分布的标准化：(X−μ)/σ ~ N(0,1)。"
    },
    {
      "id": "pr-cont-3",
      "type": "single",
      "stem": "均匀分布 U(a,b) 的概率密度在 (a,b) 内为？",
      "options": {
        "A": "常数 1/(b−a)",
        "B": "线性函数",
        "C": "指数函数",
        "D": "正态曲线"
      },
      "answer": "A",
      "explanation": "均匀分布在区间内密度为常数 1/(b−a)，区间外为 0。"
    },
    {
      "id": "pr-cont-4",
      "type": "judge",
      "stem": "指数分布具有“无记忆性”。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "P(X>s+t|X>s)=P(X>t)，这是指数分布的重要特性。"
    },
    {
      "id": "pr-cont-5-r2",
      "type": "single",
      "stem": "正态分布 N(μ,σ²) 的密度函数图像关于哪条直线对称？",
      "options": {
        "A": "x=μ",
        "B": "x=μ+σ（σ>0）",
        "C": "x=μ−σ（σ>0）",
        "D": "y=μ"
      },
      "answer": "A",
      "explanation": "正态密度只依赖(x−μ)²，故关于x=μ对称；σ>0时其他所列直线不是对称轴。"
    },
    {
      "id": "qa-20261002-probability-ch2-s5",
      "type": "single",
      "stem": "X服从参数2的指数分布，P(X>3∣X>1)是？",
      "options": {
        "A": "1−e⁻⁴",
        "B": "e⁻⁴",
        "C": "e⁻⁶",
        "D": "e⁻²"
      },
      "answer": "B",
      "explanation": "生存函数e^(−2t)相除e^(−6)/e^(−2)=e^(−4)。"
    }
  ],
  "probability:ch2-s6": [
    {
      "id": "pr-func-1",
      "type": "single",
      "stem": "求离散型随机变量函数 Y=g(X) 的分布，关键是？",
      "options": {
        "A": "把相同取值的概率合并",
        "B": "求导",
        "C": "积分",
        "D": "求极限"
      },
      "answer": "A",
      "explanation": "g 可能把多个 x 映射到同一 y，需把对应概率相加。"
    },
    {
      "id": "pr-func-2",
      "type": "single",
      "stem": "求连续型随机变量函数分布常用方法有？",
      "options": {
        "A": "分布函数法与公式法",
        "B": "矩估计法",
        "C": "最大似然法",
        "D": "假设检验法"
      },
      "answer": "A",
      "explanation": "先求 F_Y(y)=P(g(X)≤y)，再求导得密度（分布函数法）。"
    },
    {
      "id": "pr-func-3",
      "type": "judge",
      "stem": "Y=g(X) 的分布可由 F_Y(y)=P(g(X)≤y) 求得。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "把事件 {g(X)≤y} 转化为关于 X 的不等式，再用 X 的分布计算。"
    },
    {
      "id": "pr-func-4",
      "type": "single",
      "stem": "正态随机变量的线性变换 aX+b（a≠0）服从？",
      "options": {
        "A": "仍为正态分布",
        "B": "均匀分布",
        "C": "指数分布",
        "D": "χ² 分布"
      },
      "answer": "A",
      "explanation": "若 X~N(μ,σ²)，则 aX+b~N(aμ+b, a²σ²)。"
    },
    {
      "id": "pr-func-5",
      "type": "judge",
      "stem": "用公式法求连续型函数分布时要注意 g 的单调性。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "单调时可直接用反函数求密度；非单调需分段处理。"
    },
    {
      "id": "qa-20261002-probability-ch2-s6",
      "type": "single",
      "stem": "X~U(−1,1)，Y=X²。对0<y<1，F_Y(y)是？",
      "options": {
        "A": "y²",
        "B": "1−√y",
        "C": "√y",
        "D": "y"
      },
      "answer": "C",
      "explanation": "事件为−√y≤X≤√y，区间长2√y除总长2。"
    }
  ],
  "probability:ch3-s1": [
    {
      "id": "pr-joint-1",
      "type": "single",
      "stem": "二维随机变量 (X,Y) 的联合分布函数定义为？",
      "options": {
        "A": "F(x,y)=P(X≤x, Y≤y)",
        "B": "F(x,y)=P(X≤x)+P(Y≤y)",
        "C": "F(x,y)=P(X=x, Y=y)",
        "D": "F(x,y)=P(X>x, Y>y)"
      },
      "answer": "A",
      "explanation": "联合分布函数 F(x,y)=P(X≤x, Y≤y)，描述落入左下方区域的概率。"
    },
    {
      "id": "pr-joint-3",
      "type": "judge",
      "stem": "联合分布可以决定边缘分布，但边缘分布不能决定联合分布。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由联合分布可求边缘，但相同的边缘可对应不同的联合分布。"
    },
    {
      "id": "pr-joint-4",
      "type": "single",
      "stem": "由联合分布求边缘分布 F_X(x) 的方法是？",
      "options": {
        "A": "令 y→+∞ 取极限",
        "B": "令 x→−∞",
        "C": "对 x 求导",
        "D": "求乘积"
      },
      "answer": "A",
      "explanation": "F_X(x)=F(x,+∞)，即对 y 取遍全体实数。"
    },
    {
      "id": "pr-joint-5",
      "type": "judge",
      "stem": "联合分布函数对每个变量单调不减，且满足相应边界条件。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "二维分布函数具有单调性与边界极限等性质。"
    },
    {
      "id": "exam-prob-multivar-2024-9-r2",
      "type": "single",
      "stem": "若 (X,Y) 在区域 0<y<x<1 上的联合密度为 2，则给定 X=x 后，Y 的条件密度在什么区间非零？（给定 0<x<1）",
      "options": {
        "A": "0<y<1，密度 1",
        "B": "0<y<x，密度 1/x",
        "C": "x<y<1，密度 1/(1−x)",
        "D": "0<x<y，密度 x"
      },
      "answer": "B",
      "explanation": "边缘密度 fX(x)=2x，故 fY|X(y|x)=2/(2x)=1/x，定义域为 0<y<x。"
    },
    {
      "id": "qa-20261002-probability-ch3-s1",
      "type": "single",
      "stem": "(X,Y)只取(0,0),(0,1),(1,0),(1,1)，概率1/10,2/10,3/10,4/10。F(0,0)是多少？",
      "options": {
        "A": "3/10",
        "B": "4/10",
        "C": "1",
        "D": "1/10"
      },
      "answer": "D",
      "explanation": "左下事件只包含(0,0)一个质量点。"
    }
  ],
  "probability:ch3-s2": [
    {
      "id": "pr-2d-1",
      "type": "single",
      "stem": "二维离散型随机变量的联合分布律记为？",
      "options": {
        "A": "p_ij = P(X=xᵢ, Y=yⱼ)",
        "B": "p_i = P(X=xᵢ)",
        "C": "f(x,y)",
        "D": "F(x,y)"
      },
      "answer": "A",
      "explanation": "联合分布律列出所有可能取值组合的概率。"
    },
    {
      "id": "pr-2d-2",
      "type": "single",
      "stem": "由联合分布律求边缘分布律的方法是？",
      "options": {
        "A": "按行或按列求和",
        "B": "求导",
        "C": "积分",
        "D": "取最大"
      },
      "answer": "A",
      "explanation": "p_i·=Σⱼp_ij（对 Y 求和得 X 的边缘分布律）。"
    },
    {
      "id": "pr-2d-4",
      "type": "single",
      "stem": "二维离散型随机变量 X 与 Y 独立的充要条件是？",
      "options": {
        "A": "对所有 i,j 有 p_ij = p_i·p_·j",
        "B": "存在一组 i,j 满足",
        "C": "协方差为 0",
        "D": "边缘分布相同"
      },
      "answer": "A",
      "explanation": "独立性要求所有取值组合都满足乘积关系。"
    },
    {
      "id": "pr-2d-5-r2",
      "type": "judge",
      "stem": "二维离散变量独立性等价于：对所有可能取值对 (i,j)，联合质量 pᵢⱼ 都等于两个边缘质量的乘积。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "等价条件涉及全体取值对。但实际验证时可借助归一性推出未单独检验的单元，因此不应说程序上必须逐个单元直接检验。"
    },
    {
      "id": "qa-20261002-probability-ch3-s2",
      "type": "single",
      "stem": "联合质量p00=1/4,p01=1/4,p10=1/2,p11=0。P(Y=1∣X=0)是多少？",
      "options": {
        "A": "1/2",
        "B": "1/4",
        "C": "0",
        "D": "1"
      },
      "answer": "A",
      "explanation": "X=0边缘1/2，交质量1/4，相除1/2。"
    }
  ],
  "probability:ch3-s3": [
    {
      "id": "pr-2dc-1",
      "type": "single",
      "stem": "二维连续型随机变量的联合密度 f(x,y) 满足？",
      "options": {
        "A": "f(x,y) ≥ 0 且二重积分 = 1",
        "B": "f(x,y) ≤ 1",
        "C": "积分为 0",
        "D": "f 单调"
      },
      "answer": "A",
      "explanation": "联合密度非负且在全平面上的二重积分为 1。"
    },
    {
      "id": "pr-2dc-2",
      "type": "single",
      "stem": "由联合密度求边缘密度 f_X(x) 的方法是？",
      "options": {
        "A": "对 y 积分：∫f(x,y)dy",
        "B": "对 x 积分",
        "C": "求导",
        "D": "取极限"
      },
      "answer": "A",
      "explanation": "边缘密度是把联合密度对另一个变量积分得到的。"
    },
    {
      "id": "pr-2dc-3-r2",
      "type": "judge",
      "stem": "连续型 X、Y 独立，当且仅当联合密度等于边缘密度之积几乎处处成立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "密度只在几乎处处意义上确定，零测集上改值不改变分布。独立性要求的是几乎处处的乘积分解。"
    },
    {
      "id": "pr-2dc-4",
      "type": "single",
      "stem": "二维均匀分布在区域 D 上的概率与什么成正比？",
      "options": {
        "A": "区域的面积",
        "B": "区域的周长",
        "C": "区域的位置",
        "D": "区域的形状"
      },
      "answer": "A",
      "explanation": "二维均匀分布下概率正比于子区域面积。"
    },
    {
      "id": "pr-2dc-5",
      "type": "judge",
      "stem": "二维连续型随机变量落在区域 D 内的概率由联合密度在 D 上的二重积分给出。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "P((X,Y)∈D)=∬_D f(x,y)dxdy。"
    },
    {
      "id": "qa-20261002-probability-ch3-s3",
      "type": "single",
      "stem": "f(x,y)=2在0<y<x<1，其余0。X的边缘密度在0<x<1为？",
      "options": {
        "A": "x²",
        "B": "2x",
        "C": "2(1−x)",
        "D": "1"
      },
      "answer": "B",
      "explanation": "对y的正确积分范围0到x，∫2dy=2x。"
    }
  ],
  "probability:ch3-s4": [
    {
      "id": "pr-indep2-1-r2",
      "type": "judge",
      "stem": "若 X、Y 有有限二阶矩且相互独立，则 Cov(X,Y)=0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "有限二阶矩保证协方差有定义，独立再给E(XY)=EX EY。不加矩存在条件，独立Cauchy变量没有协方差。"
    },
    {
      "id": "pr-indep2-2",
      "type": "single",
      "stem": "随机变量 X 与 Y 独立的充要条件是？",
      "options": {
        "A": "联合分布等于边缘分布之积",
        "B": "协方差为 0",
        "C": "期望相等",
        "D": "方差相等"
      },
      "answer": "A",
      "explanation": "独立 ⇔ F(x,y)=F_X(x)F_Y(y)（离散/连续对应乘积形式）。"
    },
    {
      "id": "pr-indep2-4-r2",
      "type": "single",
      "stem": "设 X、Y 有有限二阶矩。它们不相关的等价条件是？",
      "options": {
        "A": "Cov(X,Y)=0 即 E(XY)=E(X)E(Y)",
        "B": "E(X)=E(Y)",
        "C": "D(X)=D(Y)",
        "D": "联合分布等于边缘乘积"
      },
      "answer": "A",
      "explanation": "不相关 ⇔ 协方差为 0 ⇔ E(XY)=E(X)E(Y)。"
    },
    {
      "id": "pr-indep2-5",
      "type": "judge",
      "stem": "对于二维正态分布，不相关等价于独立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "二维正态是特例，ρ=0（不相关）即可推出独立。"
    },
    {
      "id": "qa-20261002-probability-ch3-s4",
      "type": "single",
      "stem": "X~U(−1,1)，Y=X²。哪项正确？",
      "options": {
        "A": "Cov(X,Y)>0",
        "B": "Y方差为0",
        "C": "X,Y不相关但不独立",
        "D": "X,Y独立"
      },
      "answer": "C",
      "explanation": "EX=EX³=0所以Cov=0；Y由X决定且非恒定，因此不独立。"
    }
  ],
  "probability:ch3-s5": [
    {
      "id": "pr-2dist-1",
      "type": "single",
      "stem": "二维均匀分布的联合密度在区域 D 内为？",
      "options": {
        "A": "常数 1/S_D（S_D 为 D 的面积）",
        "B": "随位置变化",
        "C": "正态曲线",
        "D": "指数函数"
      },
      "answer": "A",
      "explanation": "二维均匀分布在 D 内密度为 1/面积，D 外为 0。"
    },
    {
      "id": "pr-2dist-2",
      "type": "single",
      "stem": "二维正态分布由几个参数完全确定？",
      "options": {
        "A": "5 个（μ₁,μ₂,σ₁²,σ₂²,ρ）",
        "B": "2 个",
        "C": "3 个",
        "D": "4 个"
      },
      "answer": "A",
      "explanation": "两个均值、两个方差和一个相关系数共 5 个参数。"
    },
    {
      "id": "pr-2dist-3",
      "type": "judge",
      "stem": "二维正态分布的边缘分布都是一维正态分布。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "二维正态的边缘仍为正态，这是其重要性质。"
    },
    {
      "id": "pr-2dist-4",
      "type": "single",
      "stem": "二维正态分布中，X 与 Y 独立的充要条件是？",
      "options": {
        "A": "相关系数 ρ = 0",
        "B": "μ₁ = μ₂",
        "C": "σ₁ = σ₂",
        "D": "方差为 1"
      },
      "answer": "A",
      "explanation": "二维正态下 ρ=0 既表示不相关也表示独立。"
    },
    {
      "id": "pr-2dist-5-r2",
      "type": "judge",
      "stem": "非退化二维正态随机变量的非零系数线性组合 aX+bY（a²+b²>0）仍服从非退化一维正态分布。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "线性组合正态，协方差矩阵正定使非零系数组合方差严格正；零系数组合则为常数，不属于本题的非退化正态。"
    },
    {
      "id": "qa-20261002-probability-ch3-s5",
      "type": "single",
      "stem": "联合正态X,Y均值0、方差1、相关系数1/2。Var(X−Y)是多少？",
      "options": {
        "A": "2",
        "B": "3",
        "C": "1/2",
        "D": "1"
      },
      "answer": "D",
      "explanation": "Cov=1/2，差方差1+1−2(1/2)=1。"
    }
  ],
  "probability:ch3-s6": [
    {
      "id": "pr-sum-1",
      "type": "single",
      "stem": "求两个独立连续型随机变量之和的分布，常用？",
      "options": {
        "A": "卷积公式",
        "B": "洛必达法则",
        "C": "克拉默法则",
        "D": "夹逼准则"
      },
      "answer": "A",
      "explanation": "Z=X+Y 的密度为 f_Z(z)=∫f_X(x)f_Y(z−x)dx（卷积）。"
    },
    {
      "id": "pr-sum-2",
      "type": "single",
      "stem": "n 个独立同分布随机变量最大值 M 的分布函数为？",
      "options": {
        "A": "[F(x)]ⁿ",
        "B": "1−[1−F(x)]ⁿ",
        "C": "nF(x)",
        "D": "F(x)/n"
      },
      "answer": "A",
      "explanation": "P(M≤x)=P(所有 Xᵢ≤x)=[F(x)]ⁿ。"
    },
    {
      "id": "pr-sum-4",
      "type": "single",
      "stem": "n 个独立同分布随机变量最小值 N 的分布函数为？",
      "options": {
        "A": "1 − [1−F(x)]ⁿ",
        "B": "[F(x)]ⁿ",
        "C": "nF(x)",
        "D": "F(x)"
      },
      "answer": "A",
      "explanation": "P(N≤x)=1−P(所有 Xᵢ>x)=1−[1−F(x)]ⁿ。"
    },
    {
      "id": "pr-sum-5",
      "type": "judge",
      "stem": "两个独立正态随机变量之和仍服从正态分布。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "若 X~N(μ₁,σ₁²)、Y~N(μ₂,σ₂²) 且独立，则 X+Y~N(μ₁+μ₂, σ₁²+σ₂²)。"
    },
    {
      "id": "qa-20261002-probability-ch3-s6",
      "type": "single",
      "stem": "X,Y独立且都服从U(0,1)，M=max(X,Y)。P(M≤1/2)是多少？",
      "options": {
        "A": "1/4",
        "B": "1/2",
        "C": "3/4",
        "D": "1/8"
      },
      "answer": "A",
      "explanation": "最大≤1/2要求两者均≤1/2，独立概率(1/2)²。"
    }
  ],
  "probability:ch4-s1": [
    {
      "id": "pr-exp-1-r2",
      "type": "judge",
      "stem": "若 E|X|<∞，对任意常数 a、b 都有 E(aX+b)=aE(X)+b。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "数学期望具有线性性，无需 X、Y 独立。"
    },
    {
      "id": "pr-exp-2",
      "type": "single",
      "stem": "离散型随机变量的数学期望定义为？",
      "options": {
        "A": "Σ xₖ pₖ",
        "B": "Σ pₖ",
        "C": "max xₖ",
        "D": "Σ xₖ"
      },
      "answer": "A",
      "explanation": "期望是各取值与其概率乘积之和（要求绝对收敛）。"
    },
    {
      "id": "pr-exp-3-r2",
      "type": "judge",
      "stem": "若 X、Y 可积，则 E(aX+bY)=aE(X)+bE(Y)，无需独立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "期望的线性性无需 X、Y 独立。"
    },
    {
      "id": "pr-exp-4-r2",
      "type": "single",
      "stem": "若连续型 X 满足 ∫全轴 |x|f(x)dx<∞，其有限数学期望定义为？",
      "options": {
        "A": "∫ x f(x)dx",
        "B": "∫ f(x)dx",
        "C": "f(0)",
        "D": "∫ x²f(x)dx"
      },
      "answer": "A",
      "explanation": "连续型期望是 x 与密度乘积的积分。"
    },
    {
      "id": "pr-exp-5",
      "type": "judge",
      "stem": "数学期望存在要求相应的级数或积分绝对收敛。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "绝对收敛保证期望的定义无歧义，否则称期望不存在。"
    },
    {
      "id": "exam-prob-moments-2015-8-r2",
      "type": "single",
      "stem": "X、Y 不相关，E(X)=2、E(Y)=1、D(X)=3、D(Y)=4，则 E[(X+Y)²] 等于多少？",
      "options": {
        "A": "7",
        "B": "12",
        "C": "14",
        "D": "16"
      },
      "answer": "D",
      "explanation": "不相关时 Cov(X,Y)=0；E[(X+Y)²]=D(X+Y)+[E(X+Y)]²=7+9=16。"
    },
    {
      "id": "qa-20261002-probability-ch4-s1",
      "type": "single",
      "stem": "P(X=−1)=1/4，P(X=3)=3/4。E(X)是多少？",
      "options": {
        "A": "5/2",
        "B": "2",
        "C": "1",
        "D": "3/2"
      },
      "answer": "B",
      "explanation": "按质量加权−1/4+9/4=2。"
    }
  ],
  "probability:ch4-s2": [
    {
      "id": "pr-var-1-r2",
      "type": "single",
      "stem": "设 X 有有限二阶矩。对常数 a，D(aX) 等于？",
      "options": {
        "A": "a²D(X)",
        "B": "aD(X)",
        "C": "D(X)",
        "D": "a²D(X) + a"
      },
      "answer": "A",
      "explanation": "D(aX)=a²D(X)，常数倍使方差按平方缩放；D(X+b)=D(X)。"
    },
    {
      "id": "pr-var-2-r2",
      "type": "single",
      "stem": "设 X 有有限二阶矩。方差 D(X) 的计算公式是？",
      "options": {
        "A": "E(X²) − [E(X)]²",
        "B": "E(X²) + [E(X)]²",
        "C": "[E(X)]²",
        "D": "E(X) − E(X²)"
      },
      "answer": "A",
      "explanation": "这是方差最常用的计算公式，常比按定义计算更简便。"
    },
    {
      "id": "pr-var-3-r2",
      "type": "judge",
      "stem": "设 X 有有限二阶矩。D(X)=0 当且仅当 X 几乎处处等于一个常数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "方差衡量偏离均值的程度，为 0 表示没有波动。"
    },
    {
      "id": "pr-var-4-r2",
      "type": "single",
      "stem": "设 X、Y 有有限二阶矩。D(X+Y) 等于？",
      "options": {
        "A": "D(X)+D(Y)+2Cov(X,Y)",
        "B": "D(X)+D(Y)",
        "C": "D(X)·D(Y)",
        "D": "D(X)−D(Y)"
      },
      "answer": "A",
      "explanation": "一般地 D(X+Y)=D(X)+D(Y)+2Cov(X,Y)；独立时协方差为 0。"
    },
    {
      "id": "pr-var-5-r2",
      "type": "judge",
      "stem": "设 X、Y 有有限二阶矩。若 X、Y 独立，则 D(X+Y)=D(X)+D(Y)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "独立使 Cov(X,Y)=0，故方差可加。"
    },
    {
      "id": "qa-20261002-probability-ch4-s2",
      "type": "single",
      "stem": "EX=2、E(X²)=7。Var(3X−5)是多少？",
      "options": {
        "A": "63",
        "B": "3",
        "C": "27",
        "D": "9"
      },
      "answer": "C",
      "explanation": "VarX=7−4=3，平方缩放乘9得27。"
    }
  ],
  "probability:ch4-s3": [
    {
      "id": "pr-efunc-1",
      "type": "single",
      "stem": "求 E(g(X)) 时，是否必须先求 g(X) 的分布？",
      "options": {
        "A": "不必，可直接用 X 的分布计算",
        "B": "必须先求",
        "C": "只能数值计算",
        "D": "无法计算"
      },
      "answer": "A",
      "explanation": "E(g(X))=Σg(xₖ)pₖ 或 ∫g(x)f(x)dx，无需先求 g(X) 的分布。"
    },
    {
      "id": "pr-efunc-2",
      "type": "single",
      "stem": "离散型随机变量 E(g(X)) 的计算公式是？",
      "options": {
        "A": "Σ g(xₖ)pₖ",
        "B": "Σ g(pₖ)",
        "C": "g(Σxₖpₖ)",
        "D": "Σ xₖ"
      },
      "answer": "A",
      "explanation": "把 g 作用于每个取值后按概率加权求和。"
    },
    {
      "id": "pr-efunc-3-r2",
      "type": "judge",
      "stem": "若 X、Y 独立且 E|X|、E|Y| 均有限，则 E(XY)=E(X)E(Y)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "独立时乘积的期望等于期望的乘积。"
    },
    {
      "id": "pr-efunc-4-r2",
      "type": "single",
      "stem": "利用期望的线性性可以？",
      "options": {
        "A": "无需独立，把可积变量的和的期望写成各期望之和",
        "B": "对任意g都可用g(EX)代替E(g(X))",
        "C": "把所有相关变量的方差直接相加",
        "D": "从EX=EY推出独立"
      },
      "answer": "A",
      "explanation": "如 E(X₁+…+Xₙ)=ΣE(Xᵢ)，即使变量不独立也成立。"
    },
    {
      "id": "pr-efunc-5-r2",
      "type": "judge",
      "stem": "一般地 E(g(X)) ≠ g(E(X))。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "通常不能交换非线性函数与期望，例P(X=±1)=1/2时E(X²)=1≠(EX)²=0。但非线性也可能相等，例如同一X下E(X³)=0=(EX)³，因此线性是充分条件而非必要条件。"
    },
    {
      "id": "qa-20261002-probability-ch4-s3",
      "type": "single",
      "stem": "X取−1,0,1的概率分别1/4,1/2,1/4。E(X²)是多少？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "1/4",
        "D": "1/2"
      },
      "answer": "D",
      "explanation": "非零两点平方均1，加权1/4+1/4=1/2；(EX)²=0。"
    }
  ],
  "probability:ch4-s4": [
    {
      "id": "pr-corr-1-r2",
      "type": "single",
      "stem": "设 X、Y 的方差均有限且严格大于0。相关系数 ρ 的取值范围是？",
      "options": {
        "A": "[−1, 1]",
        "B": "[0, 1]",
        "C": "(−∞, +∞)",
        "D": "[0, +∞)"
      },
      "answer": "A",
      "explanation": "相关系数 |ρ|≤1；|ρ|=1 表示 X 与 Y 以概率 1 存在线性关系。"
    },
    {
      "id": "pr-cov-1-r2",
      "type": "single",
      "stem": "设 X、Y 有有限二阶矩。Cov(X,Y) 等于？",
      "options": {
        "A": "E(XY) − E(X)E(Y)",
        "B": "E(XY) + E(X)E(Y)",
        "C": "E(X)E(Y)",
        "D": "D(X)D(Y)"
      },
      "answer": "A",
      "explanation": "协方差衡量 X、Y 的线性相关程度。"
    },
    {
      "id": "pr-cov-2-r2",
      "type": "judge",
      "stem": "设 X 有有限二阶矩，则 Cov(X,X)=D(X)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "变量与自身的协方差就是其方差。"
    },
    {
      "id": "pr-cov-3-r2",
      "type": "single",
      "stem": "设 X、Y 的方差均有限且严格大于0。相关系数 ρ 的计算公式是？",
      "options": {
        "A": "Cov(X,Y) / (σ_X σ_Y)",
        "B": "Cov(X,Y) / (σ_X + σ_Y)",
        "C": "σ_X σ_Y / Cov",
        "D": "E(XY)"
      },
      "answer": "A",
      "explanation": "相关系数是标准化后的协方差。"
    },
    {
      "id": "pr-cov-4-r2",
      "type": "judge",
      "stem": "设 X、Y 的方差均有限且严格大于0。相关系数满足 |ρ|≤1，且 |ρ|=1 时 X 与 Y 以概率1存在线性关系。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "|ρ|=1 表示完全线性相关（正相关或负相关）。"
    },
    {
      "id": "qa-20261002-probability-ch4-s4",
      "type": "single",
      "stem": "Var(X)=4，Y=−3X+1。ρ(X,Y)是多少？",
      "options": {
        "A": "−1",
        "B": "1",
        "C": "−3",
        "D": "0"
      },
      "answer": "A",
      "explanation": "Cov=−3·4=−12，σX=2，σY=6，归一为−1。"
    }
  ],
  "probability:ch4-s5": [
    {
      "id": "pr-df-1",
      "type": "single",
      "stem": "二项分布 B(n,p) 的期望和方差分别是？",
      "options": {
        "A": "np 和 np(1−p)",
        "B": "p 和 p(1−p)",
        "C": "n 和 np",
        "D": "np 和 np"
      },
      "answer": "A",
      "explanation": "二项分布 E(X)=np，D(X)=np(1−p)。"
    },
    {
      "id": "pr-df-2",
      "type": "single",
      "stem": "指数分布 Exp(λ) 的期望和方差分别是？",
      "options": {
        "A": "1/λ 和 1/λ²",
        "B": "λ 和 λ²",
        "C": "1/λ 和 1/λ",
        "D": "λ 和 1/λ"
      },
      "answer": "A",
      "explanation": "指数分布 E(X)=1/λ，D(X)=1/λ²。"
    },
    {
      "id": "pr-df-3",
      "type": "judge",
      "stem": "正态分布 N(μ,σ²) 的期望为 μ、方差为 σ²。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "μ 是位置参数即期望，σ² 是尺度参数即方差。"
    },
    {
      "id": "pr-df-4-r2",
      "type": "single",
      "stem": "已知随机变量的期望有限，利用对称性求期望通常适用于哪类分布？",
      "options": {
        "A": "关于某点对称的分布（如正态、均匀）",
        "B": "只有离散分布",
        "C": "只有偏态分布",
        "D": "任意分布"
      },
      "answer": "A",
      "explanation": "可积且关于c对称时EX=c；对称Cauchy分布没有有限期望，单有对称性不够。"
    },
    {
      "id": "pr-df-5",
      "type": "judge",
      "stem": "切比雪夫不等式把期望、方差与偏离概率联系起来。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "P{|X−μ|≥ε} ≤ σ²/ε²，无需知道具体分布。"
    },
    {
      "id": "qa-20261002-probability-ch4-s5",
      "type": "single",
      "stem": "X,Y独立，各自均值1方差2。E[(X+Y)²]是多少？",
      "options": {
        "A": "10",
        "B": "8",
        "C": "4",
        "D": "6"
      },
      "answer": "B",
      "explanation": "均值和2，方差和4，二阶矩4+2²=8。"
    }
  ],
  "probability:ch5-s1": [
    {
      "id": "pr-cheb-1-r2",
      "type": "single",
      "stem": "设 X 的方差有限且 ε>0，切比雪夫不等式给出的是？",
      "options": {
        "A": "P{|X−E(X)| ≥ ε} ≤ D(X)/ε²",
        "B": "P{|X−E(X)| ≥ ε} ≥ D(X)/ε²",
        "C": "P{X ≥ ε} = D(X)/ε²",
        "D": "P{|X| ≤ ε} = 1"
      },
      "answer": "A",
      "explanation": "切比雪夫不等式用方差给出偏离均值概率的上界：P{|X−μ|≥ε} ≤ σ²/ε²。"
    },
    {
      "id": "pr-cheb-3",
      "type": "judge",
      "stem": "切比雪夫不等式对任意方差存在的分布都成立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "不要求具体分布，只要期望和方差存在即可。"
    },
    {
      "id": "pr-cheb-4",
      "type": "single",
      "stem": "切比雪夫不等式的主要用途是？",
      "options": {
        "A": "估计随机变量偏离均值的概率上界",
        "B": "计算精确概率",
        "C": "求导数",
        "D": "判断独立"
      },
      "answer": "A",
      "explanation": "在分布未知时给出概率的粗略上界。"
    },
    {
      "id": "pr-cheb-5-r2",
      "type": "judge",
      "stem": "在切比雪夫不等式中，固定有限方差，ε>0 增大时 σ²/ε² 不会增大。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "σ²/ε² 随 ε 增大而减小，偏离越远概率上界越小。"
    },
    {
      "id": "exam-prob-limit-2020-8-r2",
      "type": "single",
      "stem": "随机变量 X 的方差为 4。根据切比雪夫不等式，P(|X−E(X)|≥4) 的上界是多少？",
      "options": {
        "A": "1/16",
        "B": "1/4",
        "C": "1/2",
        "D": "3/4"
      },
      "answer": "B",
      "explanation": "切比雪夫不等式给出 P(|X−E(X)|≥a)≤D(X)/a²=4/16=1/4。"
    },
    {
      "id": "qa-20261002-probability-ch5-s1",
      "type": "single",
      "stem": "EX=10、VarX=9。Chebyshev给P(绝对值(X−10)≥6)的上界是？",
      "options": {
        "A": "3/4",
        "B": "1/6",
        "C": "1/4",
        "D": "1/2"
      },
      "answer": "C",
      "explanation": "方差9除阈值平方36为1/4。"
    }
  ],
  "probability:ch5-s2": [
    {
      "id": "pr-lln-1",
      "type": "single",
      "stem": "辛钦大数定律的条件是？",
      "options": {
        "A": "随机变量独立同分布且期望存在",
        "B": "方差为 0",
        "C": "变量互斥",
        "D": "变量只有两个取值"
      },
      "answer": "A",
      "explanation": "辛钦大数定律要求独立同分布、数学期望存在，则样本均值依概率收敛于期望。"
    },
    {
      "id": "pr-lln-2",
      "type": "single",
      "stem": "伯努利大数定律说明？",
      "options": {
        "A": "频率依概率收敛于概率",
        "B": "期望等于方差",
        "C": "变量相互独立",
        "D": "分布为正态"
      },
      "answer": "A",
      "explanation": "伯努利大数定律表明事件发生的频率稳定于其概率。"
    },
    {
      "id": "pr-lln-3",
      "type": "judge",
      "stem": "大数定律说明大量随机现象的平均结果具有稳定性。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "样本均值随样本量增大趋于总体期望，这是平均稳定性的体现。"
    },
    {
      "id": "pr-lln-4",
      "type": "single",
      "stem": "切比雪夫大数定律的证明主要借助？",
      "options": {
        "A": "切比雪夫不等式",
        "B": "中心极限定理",
        "C": "洛必达法则",
        "D": "全概率公式"
      },
      "answer": "A",
      "explanation": "用切比雪夫不等式估计样本均值偏离期望的概率趋于 0。"
    },
    {
      "id": "pr-lln-5",
      "type": "judge",
      "stem": "大数定律是频率稳定性（概率的频率解释）的理论依据。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "伯努利大数定律为用频率估计概率提供了理论保证。"
    },
    {
      "id": "qa-20261002-probability-ch5-s2",
      "type": "single",
      "stem": "独立样本均为Bernoulli(1/2)，均值X̄。Chebyshev给P(绝对值(X̄−1/2)≥1/10)≤？",
      "options": {
        "A": "5/n",
        "B": "1/(4n)",
        "C": "1/n²",
        "D": "25/n"
      },
      "answer": "D",
      "explanation": "均值方差1/(4n)除(1/10)²=25/n，可再与1取最小。"
    }
  ],
  "probability:ch5-s3": [
    {
      "id": "pr-clt-1-r2",
      "type": "single",
      "stem": "Xᵢ 独立同分布，EXᵢ=μ、0<Var(Xᵢ)=σ²<∞。当 n 趋于无穷时，(ΣXᵢ−nμ)/(σ√n) 的极限分布是？",
      "options": {
        "A": "标准正态分布 N(0,1)",
        "B": "均匀分布",
        "C": "指数分布",
        "D": "χ² 分布"
      },
      "answer": "A",
      "explanation": "林德伯格–列维定理：独立同分布且方差有限的变量，其和标准化后依分布收敛于 N(0,1)。"
    },
    {
      "id": "pr-clt-2-r2",
      "type": "single",
      "stem": "林德伯格–列维中心极限定理的条件是？",
      "options": {
        "A": "独立同分布且方差有限、严格大于0",
        "B": "仅变量只有两个取值，不要求独立",
        "C": "仅期望为0",
        "D": "仅变量两两相关"
      },
      "answer": "A",
      "explanation": "独立同分布、方差有限时，标准化样本和趋于标准正态。"
    },
    {
      "id": "pr-clt-3-r2",
      "type": "judge",
      "stem": "独立同分布且方差有限、严格大于0的随机变量之和，在减去均值并除以标准差后依分布收敛于标准正态。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是中心极限定理的核心结论。"
    },
    {
      "id": "pr-clt-4-r2",
      "type": "single",
      "stem": "固定 0<p<1，棣莫弗–拉普拉斯定理是关于什么的？",
      "options": {
        "A": "二项分布的正态近似",
        "B": "泊松分布",
        "C": "指数分布",
        "D": "均匀分布"
      },
      "answer": "A",
      "explanation": "棣莫弗–拉普拉斯定理是中心极限定理在二项分布上的特例。"
    },
    {
      "id": "pr-clt-5-r2",
      "type": "judge",
      "stem": "中心极限定理保证：对所有满足其条件的总体，正态近似误差随每一次样本量增加都严格减小。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "CLT保证极限收敛，不给有限n的严格单调误差结论。格点分布的跳跃位置随n变化；正态总体则对每个n误差均为0，已反驳严格减小。"
    },
    {
      "id": "qa-20261002-probability-ch5-s3",
      "type": "single",
      "stem": "Xᵢ iid，均值2、方差9。用于CLT的标准化样本和是？",
      "options": {
        "A": "(ΣXᵢ−2n)/(3√n)",
        "B": "(ΣXᵢ−2)/(9n)",
        "C": "(ΣXᵢ−2n)/(9n)",
        "D": "(ΣXᵢ)/(3√n)"
      },
      "answer": "A",
      "explanation": "和均值2n，标准差√(9n)=3√n。"
    }
  ],
  "probability:ch5-s4": [
    {
      "id": "pr-norm-1",
      "type": "single",
      "stem": "用正态近似计算二项分布概率时，常需做？",
      "options": {
        "A": "连续性修正",
        "B": "求导",
        "C": "取对数",
        "D": "正交化"
      },
      "answer": "A",
      "explanation": "离散分布用连续正态近似时，边界加减 0.5 进行连续性修正。"
    },
    {
      "id": "pr-norm-2-r2",
      "type": "single",
      "stem": "设 n≥1 且 0<p<1，对二项分布 B(n,p) 使用正态近似时的标准化变量是？",
      "options": {
        "A": "(X − np)/√(np(1−p))",
        "B": "(X − p)/n",
        "C": "(X − np)/n",
        "D": "X/n"
      },
      "answer": "A",
      "explanation": "按中心极限定理对二项分布标准化后近似 N(0,1)。"
    },
    {
      "id": "pr-norm-3",
      "type": "judge",
      "stem": "连续性修正的做法是对边界值加减 0.5。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "把离散点 P(X=k) 近似为连续区间 [k−0.5, k+0.5] 上的概率。"
    },
    {
      "id": "pr-norm-4-r2",
      "type": "single",
      "stem": "对二项分布使用通常较可靠的正态近似，常用的经验检查条件是？",
      "options": {
        "A": "np 与 n(1−p) 都不太小（如均至少5，仅为经验准则）",
        "B": "仅n很大，无论p如何",
        "C": "仅n为偶数",
        "D": "仅p接近0"
      },
      "answer": "A",
      "explanation": "p极端时即使n很大，成功数或失败数仍很少并明显偏斜，正态近似可能很差；阈值5不是普适误差保证。"
    },
    {
      "id": "qa-20261002-probability-ch5-s4",
      "type": "single",
      "stem": "X~B(100,1/2)。用连续性修正近似P(45≤X≤55)时，正态标准化上下限是？",
      "options": {
        "A": "−2.2与2.2",
        "B": "−1.1与1.1",
        "C": "−1与1",
        "D": "−0.9与0.9"
      },
      "answer": "B",
      "explanation": "均值50标准差5，边界44.5及55.5，标准化为±1.1。"
    }
  ],
  "probability:ch6-s1": [
    {
      "id": "pr-pop-1",
      "type": "single",
      "stem": "总体与个体的关系是？",
      "options": {
        "A": "总体是研究对象的全体，个体是其中的单个对象",
        "B": "总体是个体的一部分",
        "C": "两者相同",
        "D": "个体是总体的子集"
      },
      "answer": "A",
      "explanation": "总体是研究对象的全体，个体是组成总体的每个基本单位。"
    },
    {
      "id": "pr-pop-2",
      "type": "single",
      "stem": "简单随机样本要求？",
      "options": {
        "A": "样本与总体同分布且相互独立",
        "B": "样本必须有序",
        "C": "样本量固定为 1",
        "D": "样本不能重复"
      },
      "answer": "A",
      "explanation": "简单随机样本是独立同分布（i.i.d.）的随机变量。"
    },
    {
      "id": "pr-pop-3",
      "type": "judge",
      "stem": "简单随机样本中每个样本与总体具有相同的分布。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "同分布是简单随机样本的基本特征。"
    },
    {
      "id": "pr-pop-4",
      "type": "single",
      "stem": "样本中所含个体的数目称为？",
      "options": {
        "A": "样本容量",
        "B": "总体容量",
        "C": "统计量",
        "D": "自由度"
      },
      "answer": "A",
      "explanation": "样本容量 n 表示样本中个体的个数。"
    },
    {
      "id": "pr-pop-5",
      "type": "judge",
      "stem": "数理统计的基本任务是用样本信息推断总体的性质。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "统计推断包括参数估计与假设检验等。"
    },
    {
      "id": "exam-prob-statistics-2000-5-r2",
      "type": "single",
      "stem": "X̄ 为样本均值，S² 为样本方差，μ、σ² 为未知总体参数。下列哪一个一定是统计量？",
      "options": {
        "A": "X̄−μ",
        "B": "(X̄−μ)/(S/√n)",
        "C": "S²+σ²",
        "D": "X̄"
      },
      "answer": "D",
      "explanation": "统计量只能由样本构成，不能含未知总体参数；样本均值满足这一条件。"
    },
    {
      "id": "exam-prob-statistics-2005-14-r2",
      "type": "single",
      "stem": "来自 N(0,1) 的容量为 n 的简单随机样本，其样本方差记为 S²。哪一个量服从自由度 n−1 的卡方分布？（n≥2，S²=(1/(n−1))Σ(Xᵢ−X̄)²）",
      "options": {
        "A": "nS²",
        "B": "(n−1)S²",
        "C": "√n S",
        "D": "S²/(n−1)"
      },
      "answer": "B",
      "explanation": "正态总体样本方差满足 (n−1)S²/σ² 服从自由度 n−1 的 χ² 分布；此处 σ²=1。"
    },
    {
      "id": "qa-20261002-probability-ch6-s1",
      "type": "single",
      "stem": "从有限总体{0,1}无放回抽取两个对象，观测顺序记X₁,X₂。它们是数理统计定义的iid简单随机样本吗？",
      "options": {
        "A": "是，所有无放回样本均独立",
        "B": "不是，因为容量必须大于2",
        "C": "不是，二者依赖",
        "D": "是，边缘同分布就够"
      },
      "answer": "C",
      "explanation": "P(X₂=1∣X₁=0)=1而P(X₂=1)=1/2，不能独立。"
    }
  ],
  "probability:ch6-s2": [
    {
      "id": "pr-sample-1",
      "type": "single",
      "stem": "设 X₁,…,Xₙ 是来自总体 N(μ,σ²) 的简单随机样本，则样本均值 X̄ 满足？",
      "options": {
        "A": "E(X̄)=μ，D(X̄)=σ²/n",
        "B": "E(X̄)=μ，D(X̄)=σ²",
        "C": "E(X̄)=μ/n，D(X̄)=σ²",
        "D": "E(X̄)=0，D(X̄)=1"
      },
      "answer": "A",
      "explanation": "样本均值是总体均值的无偏估计，其方差为总体方差的 1/n，n 越大越集中。"
    },
    {
      "id": "pr-stat-1",
      "type": "single",
      "stem": "样本均值 X̄ 与样本方差 S² 都是？",
      "options": {
        "A": "统计量",
        "B": "参数",
        "C": "总体矩",
        "D": "分布函数"
      },
      "answer": "A",
      "explanation": "统计量是样本的函数且不含未知参数，X̄、S² 都是统计量。"
    },
    {
      "id": "pr-stat-2",
      "type": "judge",
      "stem": "样本方差 S² 的分母取 n−1 时是总体方差的无偏估计。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "除以 n−1 使 E(S²)=σ²，保证无偏性。"
    },
    {
      "id": "pr-stat-3",
      "type": "single",
      "stem": "样本 k 阶原点矩是指？",
      "options": {
        "A": "(1/n)ΣXᵢᵏ",
        "B": "ΣXᵢ",
        "C": "max Xᵢ",
        "D": "X̄ᵏ"
      },
      "answer": "A",
      "explanation": "样本 k 阶原点矩为 (1/n)ΣXᵢᵏ，用于矩估计。"
    },
    {
      "id": "pr-stat-4",
      "type": "judge",
      "stem": "统计量中不能含有未知参数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "统计量必须是样本的、不含未知参数的函数。"
    },
    {
      "id": "qa-20261002-probability-ch6-s2",
      "type": "single",
      "stem": "观测值1,2,3。分母为n−1的样本方差S²是多少？",
      "options": {
        "A": "2/3",
        "B": "2",
        "C": "3",
        "D": "1"
      },
      "answer": "D",
      "explanation": "均值2，残差平方和1+0+1=2，除n−1=2得1。"
    }
  ],
  "probability:ch6-s3": [
    {
      "id": "pr-chi-1",
      "type": "single",
      "stem": "设 X₁,…,Xₙ 独立同服从 N(0,1)，则 ΣXᵢ² 服从？",
      "options": {
        "A": "自由度为 n 的 χ² 分布",
        "B": "t 分布",
        "C": "F 分布",
        "D": "标准正态分布"
      },
      "answer": "A",
      "explanation": "n 个独立标准正态变量的平方和服从 χ²(n)，这是 χ² 分布的定义。"
    },
    {
      "id": "pr-chi-3",
      "type": "judge",
      "stem": "t 分布关于 0 对称。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "t 分布是类似标准正态的对称分布，自由度越大越接近正态。"
    },
    {
      "id": "pr-chi-4",
      "type": "single",
      "stem": "F 分布的定义是？",
      "options": {
        "A": "两个独立 χ² 变量（各除以其自由度）之比",
        "B": "两个正态变量之比",
        "C": "一个 χ² 的平方",
        "D": "t 分布的平方根"
      },
      "answer": "A",
      "explanation": "若 U~χ²(m)、V~χ²(n) 独立，则 (U/m)/(V/n)~F(m,n)。"
    },
    {
      "id": "pr-chi-5",
      "type": "judge",
      "stem": "若 T~t(n)，则 T²~F(1,n)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "t 分布变量的平方服从第一自由度为 1 的 F 分布。"
    },
    {
      "id": "qa-20261002-probability-ch6-s3",
      "type": "single",
      "stem": "Z~N(0,1)、V~χ²(5)，两者独立。Z/√(V/5)服从？",
      "options": {
        "A": "t(5)",
        "B": "t(4)",
        "C": "F(1,5)",
        "D": "χ²(5)"
      },
      "answer": "A",
      "explanation": "标准正态除独立归一卡方的正平方根，是t分布定义。"
    }
  ],
  "probability:ch6-s4": [
    {
      "id": "pr-quant-1-r2",
      "type": "single",
      "stem": "对于连续分布，上侧 α 分位数 u_α 的尾概率条件是？",
      "options": {
        "A": "P(X > u_α) = α",
        "B": "P(X < u_α) = α",
        "C": "P(X = u_α) = α",
        "D": "P(X > u_α) = 1−α"
      },
      "answer": "A",
      "explanation": "上侧 α 分位数右侧面积为 α。"
    },
    {
      "id": "pr-quant-2",
      "type": "single",
      "stem": "标准正态分布的上侧 0.025 分位数约为？",
      "options": {
        "A": "1.96",
        "B": "1.645",
        "C": "2.58",
        "D": "1.28"
      },
      "answer": "A",
      "explanation": "u₀.₀₂₅=1.96，是 95% 置信区间的常用临界值。"
    },
    {
      "id": "pr-quant-3",
      "type": "judge",
      "stem": "标准正态分布满足 u_α = −u_{1−α}。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由标准正态关于 0 对称可得。"
    },
    {
      "id": "pr-quant-4-r2",
      "type": "single",
      "stem": "χ²、t、F 分布的分位数通常通过什么获得？",
      "options": {
        "A": "查表或统计软件",
        "B": "手工求导",
        "C": "积分公式直接计算",
        "D": "不能获得"
      },
      "answer": "A",
      "explanation": "常用分位数通过查表或数值反演CDF获得；部分特殊自由度可用初等表达式，例如t(1)即Cauchy，因此不应断言全部都没有初等原函数。"
    },
    {
      "id": "pr-quant-5",
      "type": "judge",
      "stem": "分位数在区间估计和假设检验中用于确定临界值。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "置信区间与拒绝域都由相应分布的分位数确定。"
    },
    {
      "id": "qa-20261002-probability-ch6-s4",
      "type": "single",
      "stem": "标准正态上侧0.05分位数约1.645，则上侧0.95分位数约为？",
      "options": {
        "A": "0.95",
        "B": "−1.645",
        "C": "1.645",
        "D": "0.05"
      },
      "answer": "B",
      "explanation": "标准正态对称uα=−u1−α。"
    }
  ],
  "probability:ch6-s5": [
    {
      "id": "pr-t-1-r2",
      "type": "single",
      "stem": "设 X₁,…,Xₙ 为 N(μ,σ²) 的独立同分布样本，n≥2、σ²>0，S²=(1/(n−1))Σ(Xᵢ−X̄)²。(X̄−μ)/(S/√n) 服从什么分布？",
      "options": {
        "A": "自由度为 n−1 的 t 分布",
        "B": "标准正态分布",
        "C": "自由度为 n 的 χ² 分布",
        "D": "F 分布"
      },
      "answer": "A",
      "explanation": "σ² 未知时用样本标准差 S 代替 σ，得到服从 t(n−1) 的统计量。"
    },
    {
      "id": "pr-samp-2-r2",
      "type": "single",
      "stem": "设 X₁,…,Xₙ 为 N(μ,σ²) 的独立同分布样本，n≥2、σ²>0，S²=(1/(n−1))Σ(Xᵢ−X̄)²。(n−1)S²/σ² 服从什么分布？",
      "options": {
        "A": "χ²(n−1)",
        "B": "N(0,1)",
        "C": "t(n)",
        "D": "F(n,n)"
      },
      "answer": "A",
      "explanation": "这是正态总体样本方差的抽样分布，自由度为 n−1。"
    },
    {
      "id": "pr-samp-3-r2",
      "type": "judge",
      "stem": "设 X₁,…,Xₙ 为 N(μ,σ²) 的独立同分布样本，n≥2、σ²>0，S²=(1/(n−1))Σ(Xᵢ−X̄)²。样本均值 X̄ 与样本方差 S² 相互独立。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "正态总体的一个重要性质：X̄ 与 S² 独立。"
    },
    {
      "id": "pr-samp-4-r2",
      "type": "single",
      "stem": "设 X₁,…,Xₙ 为 N(μ,σ²) 的独立同分布样本，n≥2、σ²>0，S²=(1/(n−1))Σ(Xᵢ−X̄)²。(X̄−μ)/(σ/√n) 服从什么分布？",
      "options": {
        "A": "N(0,1)",
        "B": "t(n−1)",
        "C": "χ²(n)",
        "D": "F(1,n)"
      },
      "answer": "A",
      "explanation": "σ 已知时样本均值标准化后服从标准正态分布。"
    },
    {
      "id": "pr-samp-5-r2",
      "type": "judge",
      "stem": "设 X₁,…,Xₙ 为 N(μ,σ²) 的独立同分布样本，n≥2、σ²>0，S²=(1/(n−1))Σ(Xᵢ−X̄)²。用样本标准差 S 代替 σ，(X̄−μ)/(S/√n) 服从 t(n−1)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是 t 分布的典型来源，也是 t 检验的基础。"
    },
    {
      "id": "qa-20261002-probability-ch6-s5",
      "type": "single",
      "stem": "来自N(μ,σ²)的iid样本容量9，S²分母8。8S²/σ²服从？",
      "options": {
        "A": "t(8)",
        "B": "F(8,9)",
        "C": "χ²(8)",
        "D": "χ²(9)"
      },
      "answer": "C",
      "explanation": "n−1残差自由度为8，标准化平方和服从卡方8。"
    }
  ],
  "probability:ch7-s1": [
    {
      "id": "pr-moment-1",
      "type": "single",
      "stem": "矩估计法的基本思想是？",
      "options": {
        "A": "用样本矩等于总体矩来建立方程估计参数",
        "B": "使似然函数最大",
        "C": "使方差最小",
        "D": "随机选取参数"
      },
      "answer": "A",
      "explanation": "令样本矩与总体矩相等，解出参数即得矩估计。"
    },
    {
      "id": "pr-moment-2",
      "type": "single",
      "stem": "估计总体期望时，常用的一阶矩估计量是？",
      "options": {
        "A": "样本均值 X̄",
        "B": "样本方差 S²",
        "C": "样本中位数",
        "D": "样本极差"
      },
      "answer": "A",
      "explanation": "总体一阶原点矩即期望，用样本一阶原点矩 X̄ 估计。"
    },
    {
      "id": "pr-moment-3",
      "type": "judge",
      "stem": "矩估计的结果可能不唯一。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "可选择不同阶矩建立方程，可能得到不同估计量。"
    },
    {
      "id": "pr-moment-4",
      "type": "single",
      "stem": "参数的点估计是指什么？",
      "options": {
        "A": "用样本算出一个数值作为参数的估计",
        "B": "给出一个区间",
        "C": "给出概率",
        "D": "检验假设"
      },
      "answer": "A",
      "explanation": "点估计给出参数的单一估计值，区别于区间估计。"
    },
    {
      "id": "qa-20261002-probability-ch7-s1",
      "type": "single",
      "stem": "样本来自U(0,θ)，θ>0，观测均值为3。一阶矩估计θ是？",
      "options": {
        "A": "3",
        "B": "3/2",
        "C": "9",
        "D": "6"
      },
      "answer": "D",
      "explanation": "总体均值θ/2=样本均值3，解θ=6。"
    }
  ],
  "probability:ch7-s2": [
    {
      "id": "pr-mle-1-r2",
      "type": "single",
      "stem": "最大似然估计的基本思想是？",
      "options": {
        "A": "在参数空间中最大化已观测样本的联合密度或概率质量作为参数函数的似然",
        "B": "令样本均值等于总体均值",
        "C": "使估计量方差最小",
        "D": "随机选参数"
      },
      "answer": "A",
      "explanation": "连续样本每个精确观测点概率为0，最大化的是密度似然而非单点概率。还需比较边界与内部极值。"
    },
    {
      "id": "pr-mle-2-r2",
      "type": "single",
      "stem": "似然函数 L(θ) 的定义是？",
      "options": {
        "A": "样本联合密度/分布律作为 θ 的函数",
        "B": "θ 的分布函数",
        "C": "样本均值",
        "D": "θ 的期望"
      },
      "answer": "A",
      "explanation": "把已观测数据固定，样本联合密度或联合概率质量作为θ的函数即L(θ)。独立样本才分解成乘积。连续密度的数值不是精确样本点的概率。"
    },
    {
      "id": "pr-mle-3-r2",
      "type": "judge",
      "stem": "对于可导的对数似然，令其导数为0可寻找内部候选极值，但还须检查边界与是否达到全局最大值。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "驻点可能是极小值且最大值可能在边界；U(0,θ)的MLE就在θ=maxXi的边界。"
    },
    {
      "id": "pr-mle-4",
      "type": "single",
      "stem": "最大似然估计具有什么重要性质？",
      "options": {
        "A": "不变性（函数的最大似然估计等于估计的函数）",
        "B": "一定无偏",
        "C": "一定有效",
        "D": "不需要样本"
      },
      "answer": "A",
      "explanation": "若 θ̂ 是 θ 的 MLE，则 g(θ̂) 是 g(θ) 的 MLE。"
    },
    {
      "id": "qa-20261002-probability-ch7-s2",
      "type": "single",
      "stem": "采用闭区间密度 f(x;θ)=1/θ（0≤x≤θ，θ>0），观测为1,2,4。θ的MLE是？",
      "options": {
        "A": "4",
        "B": "14/3",
        "C": "7/3",
        "D": "2"
      },
      "answer": "A",
      "explanation": "似然θ⁻³指示θ≥4，递减，边界θ=4最大；显式约定避免开端点不取最大问题。"
    }
  ],
  "probability:ch7-s3": [
    {
      "id": "pr-unbiased-1",
      "type": "single",
      "stem": "若 E(θ̂) = θ，则称 θ̂ 是 θ 的？",
      "options": {
        "A": "无偏估计量",
        "B": "有效估计量",
        "C": "一致估计量",
        "D": "最大似然估计量"
      },
      "answer": "A",
      "explanation": "无偏性指估计量的数学期望等于被估参数；有效性比较方差，一致性指依概率收敛于 θ。"
    },
    {
      "id": "pr-unbiased-2",
      "type": "single",
      "stem": "估计量的三条常用评选标准是？",
      "options": {
        "A": "无偏性、有效性、一致性",
        "B": "连续性、可导性、单调性",
        "C": "非负性、规范性、可加性",
        "D": "对称性、传递性、完备性"
      },
      "answer": "A",
      "explanation": "无偏性看期望，有效性看方差，一致性看依概率收敛。"
    },
    {
      "id": "pr-unbiased-3",
      "type": "judge",
      "stem": "有效性是指在无偏估计中方差最小。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "有效估计在无偏估计类中方差最小，更接近真值。"
    },
    {
      "id": "pr-unbiased-4",
      "type": "single",
      "stem": "一致估计量的含义是？",
      "options": {
        "A": "样本量增大时依概率收敛于被估参数",
        "B": "期望等于参数",
        "C": "方差最小",
        "D": "分布为正态"
      },
      "answer": "A",
      "explanation": "一致性（相合性）要求 n→∞ 时估计量收敛于真值。"
    },
    {
      "id": "pr-unbiased-5",
      "type": "judge",
      "stem": "无偏估计量不一定有效。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "无偏只保证平均准确，方差大小由有效性衡量。"
    },
    {
      "id": "qa-20261002-probability-ch7-s3",
      "type": "single",
      "stem": "Xi iid均值μ方差σ²>0。估计量X₁与X̄均无偏，n>1时哪个方差小？",
      "options": {
        "A": "不能比较",
        "B": "X̄",
        "C": "X₁",
        "D": "二者相同"
      },
      "answer": "B",
      "explanation": "VarX₁=σ²，VarX̄=σ²/n，n>1下后者更小。"
    }
  ],
  "probability:ch7-s4": [
    {
      "id": "pr-ci-1",
      "type": "single",
      "stem": "单个正态总体均值 μ 的区间估计中，若 σ 已知应使用？",
      "options": {
        "A": "标准正态分布 u",
        "B": "t 分布",
        "C": "χ² 分布",
        "D": "F 分布"
      },
      "answer": "A",
      "explanation": "σ 已知时用 u 统计量构造置信区间；σ 未知时改用 t。"
    },
    {
      "id": "pr-ci-2-r2",
      "type": "single",
      "stem": "置信水平 1−α 的含义是？",
      "options": {
        "A": "抽样前随机区间在重复抽样中覆盖固定参数真值的比例为1−α",
        "B": "观测后的固定区间使参数变成随机变量",
        "C": "每个观测区间的长度是1−α",
        "D": "观测后的参数真值以1−α概率改变"
      },
      "answer": "A",
      "explanation": "频率置信度描述构造程序的重复抽样覆盖率。数据确定后区间与参数都固定，不能给参数分配后验概率。"
    },
    {
      "id": "pr-ci-3",
      "type": "judge",
      "stem": "当 σ 未知时，单个正态总体均值的区间估计使用 t(n−1) 分布。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "σ 未知用样本标准差 S，统计量服从 t(n−1)。"
    },
    {
      "id": "pr-ci-4",
      "type": "single",
      "stem": "正态总体方差的区间估计使用什么分布？",
      "options": {
        "A": "χ² 分布",
        "B": "t 分布",
        "C": "F 分布",
        "D": "正态分布"
      },
      "answer": "A",
      "explanation": "由 (n−1)S²/σ²~χ²(n−1) 构造方差的置信区间。"
    },
    {
      "id": "pr-ci-5-r2",
      "type": "judge",
      "stem": "对于同一份正态样本、同一常规双侧均值区间构造且标准误严格为正，提高置信水平会使置信区间变宽。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "提高置信水平需要更大的临界值，区间随之变宽。"
    },
    {
      "id": "qa-20261002-probability-ch7-s4",
      "type": "single",
      "stem": "正态总体σ=2已知，n=16，X̄=10，z0.025=1.96。95%均值区间是？",
      "options": {
        "A": "[9.51,10.49]",
        "B": "[9.5,10.5]",
        "C": "[9.02,10.98]",
        "D": "[8.04,11.96]"
      },
      "answer": "C",
      "explanation": "标准误2/4=0.5，半宽1.96·0.5=0.98。"
    }
  ],
  "probability:ch7-s5": [
    {
      "id": "pr-ci2-1-r2",
      "type": "single",
      "stem": "两个独立正态总体的独立简单随机样本，方差未知但相等时，均值差的区间估计常用？",
      "options": {
        "A": "合并方差构造的 t 统计量",
        "B": "标准正态",
        "C": "χ² 分布",
        "D": "F 分布"
      },
      "answer": "A",
      "explanation": "方差相等时用合并方差估计公共方差，得到 t 分布统计量。"
    },
    {
      "id": "pr-ci2-2-r2",
      "type": "single",
      "stem": "两个独立正态总体的独立简单随机样本，方差比的区间估计使用什么分布？",
      "options": {
        "A": "F 分布",
        "B": "t 分布",
        "C": "χ² 分布",
        "D": "正态分布"
      },
      "answer": "A",
      "explanation": "由两样本方差之比构造 F 统计量估计方差比。"
    },
    {
      "id": "pr-ci2-3",
      "type": "judge",
      "stem": "对配对数据做区间估计时，可转化为对差值的单样本问题。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "配对试验先求每对差值，再按单样本方法处理。"
    },
    {
      "id": "pr-ci2-4",
      "type": "single",
      "stem": "两总体独立抽样时，通常要求？",
      "options": {
        "A": "两个样本相互独立",
        "B": "两个样本量相等",
        "C": "方差相等",
        "D": "均值相等"
      },
      "answer": "A",
      "explanation": "独立两样本要求两组观测相互独立，方差相等与否影响所用统计量。"
    },
    {
      "id": "pr-ci2-5",
      "type": "judge",
      "stem": "两正态总体均值差的置信区间可用于比较两组平均水平。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "若区间不包含 0，说明两组均值存在显著差异。"
    },
    {
      "id": "exam-probability-ch7-s5-2020-8-b-r2",
      "type": "single",
      "stem": "比较两个独立正态总体均值时，若总体方差未知且不等，常用？",
      "options": {
        "A": "Welch t 方法",
        "B": "单样本 z 检验",
        "C": "χ² 拟合优度检验",
        "D": "几何分布区间"
      },
      "answer": "A",
      "explanation": "不等方差两样本均值推断使用 Welch t 统计量及近似自由度。"
    },
    {
      "id": "qa-20261002-probability-ch7-s5",
      "type": "single",
      "stem": "两个独立正态样本n₁=5,n₂=7，未知总体方差相等。合并方差t枢轴的自由度是？",
      "options": {
        "A": "12",
        "B": "11",
        "C": "6",
        "D": "10"
      },
      "answer": "D",
      "explanation": "两残差自由度相加(n₁−1)+(n₂−1)=10。"
    }
  ],
  "probability:ch8-s1": [
    {
      "id": "pr-test-1",
      "type": "single",
      "stem": "假设检验的基本思想是？",
      "options": {
        "A": "基于小概率原理，用样本信息判断是否拒绝原假设",
        "B": "直接证明原假设成立",
        "C": "随机接受所有假设",
        "D": "只计算点估计"
      },
      "answer": "A",
      "explanation": "在“原假设成立”的前提下，若观测到的小概率事件发生了，就有理由拒绝原假设。"
    },
    {
      "id": "pr-test-2",
      "type": "single",
      "stem": "假设检验的第一步通常是？",
      "options": {
        "A": "提出原假设 H₀ 与备择假设 H₁",
        "B": "计算统计量",
        "C": "查表",
        "D": "下结论"
      },
      "answer": "A",
      "explanation": "先明确要检验的原假设与备择假设。"
    },
    {
      "id": "pr-test-3-r2",
      "type": "judge",
      "stem": "假设检验的拒绝域应事先规定，并控制原假设下落入拒绝域的概率足够小。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "连续样本每个精确结果的概率都为0，不能因观测点本身概率小而拒绝H0；应使用预先规定的极端区域及其尾概率。"
    },
    {
      "id": "pr-test-4",
      "type": "single",
      "stem": "假设检验的一般步骤是？",
      "options": {
        "A": "提假设→选统计量→定拒绝域→作判断",
        "B": "先下结论再检验",
        "C": "只计算均值",
        "D": "只画图"
      },
      "answer": "A",
      "explanation": "完整流程为提出假设、构造统计量、确定拒绝域、根据样本判断。"
    },
    {
      "id": "pr-test-5",
      "type": "judge",
      "stem": "假设检验的结论基于样本，因此可能犯错误。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "样本的随机性导致可能弃真或取伪，即两类错误。"
    },
    {
      "id": "exam-prob-hypothesis-2018-8-r2",
      "type": "single",
      "stem": "同一双侧检验中，检验水平从 0.05 降到 0.01，原假设的接受域通常怎样变化？",
      "options": {
        "A": "变小",
        "B": "变大",
        "C": "不变",
        "D": "必为空集"
      },
      "answer": "B",
      "explanation": "显著性水平变小会使拒绝域收窄，接受域相应变大。"
    },
    {
      "id": "qa-20261002-probability-ch8-s1",
      "type": "single",
      "stem": "某连续检验p值0.03，预设显著性水平0.05。决策是？",
      "options": {
        "A": "拒绝H₀",
        "B": "证明H₀为假",
        "C": "证明H₀为真",
        "D": "把α改为0.01再作决定"
      },
      "answer": "A",
      "explanation": "预设规则p≤α拒绝；决定可能犯第一类错误，不是数学证明。"
    }
  ],
  "probability:ch8-s2": [
    {
      "id": "pr-error-1-r2",
      "type": "single",
      "stem": "在假设检验中，第一类错误（弃真）的概率通常记为？",
      "options": {
        "A": "α",
        "B": "β",
        "C": "1−α",
        "D": "1−β"
      },
      "answer": "A",
      "explanation": "第一类错误是H0为真却被拒绝；显著性水平α通常是其概率的上限，离散检验或复合原假设下实际错误概率未必恰好等于α。"
    },
    {
      "id": "pr-error-2-r2",
      "type": "single",
      "stem": "第一类错误的含义是？",
      "options": {
        "A": "原假设为真却拒绝它（弃真）",
        "B": "原假设为假却接受它",
        "C": "样本量过大",
        "D": "计算错误"
      },
      "answer": "A",
      "explanation": "第一类错误定义为弃真。显著性水平控制弃真概率不超过α，并非所有检验下实际概率都恰好α。"
    },
    {
      "id": "pr-error-3",
      "type": "judge",
      "stem": "第二类错误的含义是原假设为假却接受它（取伪），概率记为 β。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "第二类错误为“取伪”，概率 β。"
    },
    {
      "id": "pr-error-4",
      "type": "single",
      "stem": "检验的功效（power）等于？",
      "options": {
        "A": "1 − β",
        "B": "α",
        "C": "1 − α",
        "D": "β"
      },
      "answer": "A",
      "explanation": "功效表示正确拒绝错误原假设的概率，即 1−β。"
    },
    {
      "id": "pr-error-5",
      "type": "judge",
      "stem": "在样本量固定时，减小 α 通常会使 β 增大。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "两类错误此消彼长；增大样本量才能同时减小二者。"
    },
    {
      "id": "qa-20261002-probability-ch8-s2",
      "type": "single",
      "stem": "在某固定备择下，检验功效为0.8，第二类错误概率是？",
      "options": {
        "A": "0.95",
        "B": "0.2",
        "C": "0.8",
        "D": "0.05"
      },
      "answer": "B",
      "explanation": "拒绝与未拒绝分割样本空间，β=1−功效=0.2。"
    }
  ],
  "probability:ch8-s3": [
    {
      "id": "pr-ht1-1",
      "type": "single",
      "stem": "单个正态总体均值检验，当 σ 已知时应使用？",
      "options": {
        "A": "u 检验",
        "B": "t 检验",
        "C": "χ² 检验",
        "D": "F 检验"
      },
      "answer": "A",
      "explanation": "σ 已知用标准正态 u 统计量进行 u 检验。"
    },
    {
      "id": "pr-ht1-2",
      "type": "single",
      "stem": "单个正态总体均值检验，当 σ 未知时应使用？",
      "options": {
        "A": "t 检验",
        "B": "u 检验",
        "C": "χ² 检验",
        "D": "F 检验"
      },
      "answer": "A",
      "explanation": "σ 未知用样本标准差，统计量服从 t(n−1)，进行 t 检验。"
    },
    {
      "id": "pr-ht1-3",
      "type": "judge",
      "stem": "单个正态总体方差的假设检验使用 χ² 检验。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "由 (n−1)S²/σ₀²~χ²(n−1) 构造检验统计量。"
    },
    {
      "id": "pr-ht1-4",
      "type": "single",
      "stem": "双边检验的拒绝域位于？",
      "options": {
        "A": "分布两侧",
        "B": "仅左侧",
        "C": "仅右侧",
        "D": "分布中心"
      },
      "answer": "A",
      "explanation": "备择假设为 μ≠μ₀ 时，拒绝域在分布两端。"
    },
    {
      "id": "pr-ht1-5",
      "type": "judge",
      "stem": "单边检验的拒绝域位于分布的一侧。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "备择假设为 μ>μ₀ 或 μ<μ₀ 时，拒绝域在右尾或左尾。"
    },
    {
      "id": "qa-20261002-probability-ch8-s3",
      "type": "single",
      "stem": "正态总体σ=2已知，n=25，X̄=11，检验H₀:μ=10。Z统计量是？",
      "options": {
        "A": "5",
        "B": "1.25",
        "C": "2.5",
        "D": "0.5"
      },
      "answer": "C",
      "explanation": "Z=(11−10)/(2/√25)=1/0.4=2.5。"
    }
  ],
  "probability:ch8-s4": [
    {
      "id": "pr-ht2-1-r2",
      "type": "single",
      "stem": "两个独立正态总体的独立简单随机样本，方差未知时，比较均值常用？",
      "options": {
        "A": "两样本 t 检验",
        "B": "χ² 检验",
        "C": "F 检验",
        "D": "符号检验"
      },
      "answer": "A",
      "explanation": "两均值差的检验在方差未知时用 t 检验（视方差是否齐性）。"
    },
    {
      "id": "pr-ht2-2-r2",
      "type": "single",
      "stem": "两个独立正态总体的独立简单随机样本，检验方差是否相等使用？",
      "options": {
        "A": "F 检验",
        "B": "t 检验",
        "C": "u 检验",
        "D": "χ² 检验"
      },
      "answer": "A",
      "explanation": "两样本方差之比服从 F 分布，故用 F 检验比较方差。"
    },
    {
      "id": "pr-ht2-3-r2",
      "type": "judge",
      "stem": "两个独立正态总体的独立简单随机样本，其方差齐性检验可使用经典 F 分布。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "F 检验用于判断两总体方差是否相等（方差齐性）。"
    },
    {
      "id": "pr-ht2-4-r2",
      "type": "single",
      "stem": "配对差值是来自正态总体的独立简单随机样本时，配对均值差检验可转化为？",
      "options": {
        "A": "对差值的单样本 t 检验",
        "B": "两独立样本 F 检验",
        "C": "χ² 检验",
        "D": "方差分析"
      },
      "answer": "A",
      "explanation": "配对数据求差后按单个正态总体均值检验处理。"
    },
    {
      "id": "pr-ht2-5-r2",
      "type": "judge",
      "stem": "两个独立正态总体方差未知时，必须先做方差齐性检验，才能对均值差使用 Welch t 方法。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "Welch方法直接按两组各自样本方差计算标准误与近似自由度，不依赖先接受方差齐性；把预检验作为必经步骤并不成立。"
    },
    {
      "id": "qa-20261002-probability-ch8-s4",
      "type": "single",
      "stem": "两个独立正态样本n₁=n₂=10，均值差2，S₁²=4,S₂²=9。Welch统计量是？",
      "options": {
        "A": "2/√13",
        "B": "2/1.3",
        "C": "2/√0.5",
        "D": "2/√1.3"
      },
      "answer": "D",
      "explanation": "标准误√(4/10+9/10)=√1.3，均值差除标准误。"
    }
  ]
});
})(window);
