/* 逐题知识与质量复核后的学习练习；由审计草稿合并。 */
(function(g){
  g.ZhixuQuestionBankVersion="question-quality-20261002-r2";
  Object.assign(g.ZhixuQuestions=g.ZhixuQuestions||{},{
  "linear-algebra:ch1-s1": [
    {
      "id": "la-det-1",
      "type": "single",
      "stem": "交换行列式的两行，行列式的值会？",
      "options": {
        "A": "变号",
        "B": "不变",
        "C": "变为 0",
        "D": "变为原来的 2 倍"
      },
      "answer": "A",
      "explanation": "行列式交换两行（列）要变号，这是行列式的基本性质之一。"
    },
    {
      "id": "la-det-3",
      "type": "single",
      "stem": "若行列式某一行全为 0，则该行列式的值为？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "该行元素之和",
        "D": "不确定"
      },
      "answer": "A",
      "explanation": "按该行展开，各项都含因子 0，故行列式为 0。"
    },
    {
      "id": "la-det-4",
      "type": "judge",
      "stem": "把行列式某一行的 k 倍加到另一行上，行列式的值不变。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是行列式的倍加性质，是化简计算的基础。"
    },
    {
      "id": "la-det-5",
      "type": "single",
      "stem": "行列式与它的转置行列式的关系是？",
      "options": {
        "A": "相等",
        "B": "互为相反数",
        "C": "互为倒数",
        "D": "无关"
      },
      "answer": "A",
      "explanation": "|Aᵀ| = |A|，行列式对行与列的性质对称。"
    },
    {
      "id": "la-det-6",
      "type": "judge",
      "stem": "若行列式中有两行对应成比例，则行列式为 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "两行成比例（含相等）时行列式为 0，可用于快速判断。"
    },
    {
      "id": "exam-linear-det-2014-5-r2",
      "type": "single",
      "stem": "令 M=[[a,b],[c,d]]。由两个相同的 M 组成的 4 阶分块对角矩阵，其行列式等于？",
      "options": {
        "A": "ad−bc",
        "B": "2(ad−bc)",
        "C": "(ad−bc)²",
        "D": "−(ad−bc)²"
      },
      "answer": "C",
      "explanation": "分块对角矩阵的行列式等于各对角块行列式的乘积。"
    },
    {
      "id": "exam-linear-det-2015-13-r2",
      "type": "single",
      "stem": "若 A 为 3 阶矩阵，则 det(2A) 与 det(A) 的关系是？",
      "options": {
        "A": "det(2A)=2det(A)",
        "B": "det(2A)=4det(A)",
        "C": "det(2A)=8det(A)",
        "D": "det(2A)=det(A)"
      },
      "answer": "C",
      "explanation": "n 阶矩阵整体乘以常数 k，行列式乘以 kⁿ；此处为 2³=8。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch1-s1",
      "type": "single",
      "stem": "3阶A满足detA=2，B由A交换一次两行并把第一行乘3得到，detB是多少？",
      "options": {
        "A": "−6",
        "B": "6",
        "C": "−12",
        "D": "2"
      },
      "answer": "A",
      "explanation": "交换给−2，单行乘3再给−6。"
    }
  ],
  "linear-algebra:ch1-s2": [
    {
      "id": "la-det-2",
      "type": "single",
      "stem": "上三角行列式的值等于？",
      "options": {
        "A": "主对角线元素的乘积",
        "B": "副对角线元素之和",
        "C": "所有元素之和",
        "D": "1"
      },
      "answer": "A",
      "explanation": "三角行列式等于主对角线上元素的乘积，常用于化简计算。"
    },
    {
      "id": "la-det-8-r2",
      "type": "judge",
      "stem": "利用初等行变换把行列式化为上三角后，其值等于主对角线元素之积。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "F",
      "explanation": "任意初等行变换可能改变行列式。例diag(1,2)交换两行后再三角化会涉及符号；若第一行乘3，三角阵对角积变6而原值2。倍加不改变值，换行与倍乘需追踪因子。"
    },
    {
      "id": "la-det-9",
      "type": "single",
      "stem": "n 阶矩阵 A 的数乘行列式 |kA| 等于？",
      "options": {
        "A": "kⁿ|A|",
        "B": "k|A|",
        "C": "kⁿ⁻¹|A|",
        "D": "|A|"
      },
      "answer": "A",
      "explanation": "每一行都提出一个 k，共 n 行，故 |kA| = kⁿ|A|。"
    },
    {
      "id": "la-det-10-r2",
      "type": "judge",
      "stem": "标准范德蒙德矩阵 V 的第 i 行为 (1,xᵢ,…,xᵢⁿ⁻¹)，则 det(V)=∏ᵢ<ⱼ(xⱼ−xᵢ)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "指定幂次与行顺序后，交替多项式被每个xⱼ−xᵢ整除且首项系数为1；交换行或倒序幂次会改变符号。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch1-s2",
      "type": "single",
      "stem": "行列式 [[1,2,3],[0,2,1],[2,4,7]] 的值是多少？",
      "options": {
        "A": "14",
        "B": "2",
        "C": "0",
        "D": "4"
      },
      "answer": "B",
      "explanation": "第三行减第一行2倍得到[0,0,1]，三角对角积1·2·1=2。"
    }
  ],
  "linear-algebra:ch2-s1": [
    {
      "id": "la-trans-1",
      "type": "single",
      "stem": "矩阵乘积的转置满足 (AB)ᵀ 等于？",
      "options": {
        "A": "BᵀAᵀ",
        "B": "AᵀBᵀ",
        "C": "AB",
        "D": "(BA)ᵀ 且一定等于 AᵀBᵀ"
      },
      "answer": "A",
      "explanation": "转置要反序：(AB)ᵀ = BᵀAᵀ。"
    },
    {
      "id": "la-mat-1",
      "type": "single",
      "stem": "矩阵乘法一般不满足下列哪条运算律？",
      "options": {
        "A": "交换律",
        "B": "结合律",
        "C": "左分配律",
        "D": "右分配律"
      },
      "answer": "A",
      "explanation": "一般 AB ≠ BA；结合律与分配律成立。"
    },
    {
      "id": "la-mat-2",
      "type": "judge",
      "stem": "矩阵乘法满足结合律 (AB)C = A(BC)。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "在维度相容时矩阵乘法满足结合律，这使分块与幂运算可行。"
    },
    {
      "id": "la-mat-3",
      "type": "single",
      "stem": "关于转置，下列等式正确的是？",
      "options": {
        "A": "(A+B)ᵀ = Aᵀ+Bᵀ",
        "B": "(AB)ᵀ = AᵀBᵀ",
        "C": "(kA)ᵀ = k⁻¹Aᵀ",
        "D": "(A²)ᵀ = (Aᵀ)² 不成立"
      },
      "answer": "A",
      "explanation": "转置对加法分配；(AB)ᵀ=BᵀAᵀ，且 (A²)ᵀ=(Aᵀ)² 成立。"
    },
    {
      "id": "la-mat-4",
      "type": "judge",
      "stem": "由 AB = O 不能推出 A = O 或 B = O。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "存在非零矩阵乘积为零，例如两个非零矩阵相乘得零矩阵。"
    },
    {
      "id": "exam-linear-matrix-2024-7-r2",
      "type": "single",
      "stem": "矩阵 A 的主对角线元素为 2、3、4，则 tr(A) 等于多少？",
      "options": {
        "A": "5",
        "B": "6",
        "C": "7",
        "D": "9"
      },
      "answer": "D",
      "explanation": "矩阵的迹是主对角线元素之和。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch2-s1",
      "type": "single",
      "stem": "A=[[0,1],[0,0]]、B=[[0,0],[1,0]]。AB−BA 等于？",
      "options": {
        "A": "单位矩阵",
        "B": "diag(−1,1)",
        "C": "diag(1,−1)",
        "D": "零矩阵"
      },
      "answer": "C",
      "explanation": "逐项乘法给AB=diag(1,0)，BA=diag(0,1)。"
    }
  ],
  "linear-algebra:ch2-s2": [
    {
      "id": "la-inv-1",
      "type": "single",
      "stem": "若 A、B 均为 n 阶可逆矩阵，则 (AB)⁻¹ 等于？",
      "options": {
        "A": "B⁻¹A⁻¹",
        "B": "A⁻¹B⁻¹",
        "C": "AB",
        "D": "(BA)⁻¹ 且一定等于 A⁻¹B⁻¹"
      },
      "answer": "A",
      "explanation": "矩阵乘积求逆要反序：(AB)⁻¹ = B⁻¹A⁻¹。"
    },
    {
      "id": "la-inv-2",
      "type": "judge",
      "stem": "n 阶方阵 A 可逆的充要条件是 |A| ≠ 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "A 可逆 ⇔ |A|≠0 ⇔ r(A)=n ⇔ 齐次方程组 Ax=0 只有零解。"
    },
    {
      "id": "la-inv-3",
      "type": "single",
      "stem": "当 |A| ≠ 0 时，A 的逆矩阵可用伴随矩阵表示为？",
      "options": {
        "A": "A⁻¹ = A*/|A|",
        "B": "A⁻¹ = |A|·A*",
        "C": "A⁻¹ = A*",
        "D": "A⁻¹ = |A|/A*"
      },
      "answer": "A",
      "explanation": "A·A* = |A|E，故 A⁻¹ = A*/|A|。"
    },
    {
      "id": "la-inv-4-r2",
      "type": "judge",
      "stem": "设方阵 A 可逆，则 (Aᵀ)⁻¹=(A⁻¹)ᵀ。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "转置与求逆可交换次序。"
    },
    {
      "id": "la-inv-5",
      "type": "single",
      "stem": "若 A 可逆，则 |A⁻¹| 等于？",
      "options": {
        "A": "1/|A|",
        "B": "|A|",
        "C": "|A|²",
        "D": "−|A|"
      },
      "answer": "A",
      "explanation": "由 |A·A⁻¹|=|E|=1 得 |A⁻¹|=1/|A|。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch2-s2",
      "type": "single",
      "stem": "A=[[2,1],[1,1]]，A⁻¹ 的第二行是？",
      "options": {
        "A": "(1,2)",
        "B": "(−1,1)",
        "C": "(1,−2)",
        "D": "(−1,2)"
      },
      "answer": "D",
      "explanation": "detA=1，余子式转置逆为[[1,−1],[−1,2]]。"
    }
  ],
  "linear-algebra:ch2-s3": [
    {
      "id": "la-rank-1",
      "type": "judge",
      "stem": "对矩阵做初等行变换不改变矩阵的秩。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "初等变换对应左乘可逆矩阵，不改变行空间维数，因此秩不变。"
    },
    {
      "id": "la-rank-2",
      "type": "single",
      "stem": "关于矩阵乘积的秩，下列关系正确的是？",
      "options": {
        "A": "r(AB) ≤ min{r(A), r(B)}",
        "B": "r(AB) = r(A) + r(B)",
        "C": "r(AB) ≥ max{r(A), r(B)}",
        "D": "r(AB) 一定等于 r(A)"
      },
      "answer": "A",
      "explanation": "乘积的秩不超过任一因子的秩，即 r(AB) ≤ min{r(A),r(B)}。"
    },
    {
      "id": "la-rank-3",
      "type": "single",
      "stem": "用初等矩阵左乘矩阵 A，相当于对 A 做？",
      "options": {
        "A": "相应的初等行变换",
        "B": "相应的初等列变换",
        "C": "转置",
        "D": "求逆"
      },
      "answer": "A",
      "explanation": "左乘初等矩阵对应行变换，右乘对应列变换。"
    },
    {
      "id": "la-rank-4",
      "type": "judge",
      "stem": "初等矩阵都是可逆矩阵。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "初等变换可逆，故初等矩阵可逆，其逆仍是同类型初等矩阵。"
    },
    {
      "id": "la-rank-5-r2",
      "type": "single",
      "stem": "设方阵 A 可逆，用初等行变换求 A⁻¹ 的做法是？",
      "options": {
        "A": "对 (A|E) 做行变换化为 (E|A⁻¹)",
        "B": "对 (A|E) 做列变换",
        "C": "直接转置",
        "D": "求伴随矩阵即可"
      },
      "answer": "A",
      "explanation": "对增广矩阵 (A|E) 实施初等行变换，A 化为 E 时右侧即为 A⁻¹。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch2-s3",
      "type": "single",
      "stem": "A=[[1,2,3],[2,4,6],[1,1,1]]。A 的秩是多少？",
      "options": {
        "A": "2",
        "B": "1",
        "C": "3",
        "D": "0"
      },
      "answer": "A",
      "explanation": "第二行依赖第一行，第一与第三行的前两列子式−1非零，秩恰为2。"
    }
  ],
  "linear-algebra:ch2-s4": [
    {
      "id": "la-block-1",
      "type": "single",
      "stem": "分块对角矩阵 diag(A₁,A₂,…,Aₛ) 可逆的条件是？",
      "options": {
        "A": "每个对角块 Aᵢ 都可逆",
        "B": "只有 A₁ 可逆",
        "C": "所有块行列式之和不为 0",
        "D": "矩阵为方阵即可"
      },
      "answer": "A",
      "explanation": "分块对角矩阵可逆当且仅当每个对角块可逆，其逆为 diag(A₁⁻¹,…,Aₛ⁻¹)。"
    },
    {
      "id": "la-block-2",
      "type": "single",
      "stem": "分块矩阵相乘时，要求？",
      "options": {
        "A": "对应分块的维度相容（可乘）",
        "B": "所有分块都是方阵",
        "C": "分块大小相同",
        "D": "分块都是对角阵"
      },
      "answer": "A",
      "explanation": "分块乘法按块进行，需保证对应块的列数与行数匹配。"
    },
    {
      "id": "la-block-3",
      "type": "judge",
      "stem": "分块对角矩阵的行列式等于各对角块行列式之积。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "分块对角（或三角）矩阵的行列式等于各对角块行列式的乘积。"
    },
    {
      "id": "la-block-4",
      "type": "single",
      "stem": "分块上三角矩阵 [[A,C],[O,B]]（A、B 为方阵）的行列式等于？",
      "options": {
        "A": "|A|·|B|",
        "B": "|A|+|B|",
        "C": "|C|",
        "D": "|A·B|·|C|"
      },
      "answer": "A",
      "explanation": "分块三角矩阵行列式等于对角块行列式之积 |A||B|。"
    },
    {
      "id": "la-block-5",
      "type": "judge",
      "stem": "分块矩阵转置时，既要转置每个子块，又要转置子块的位置。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "[[A,B],[C,D]]ᵀ = [[Aᵀ,Cᵀ],[Bᵀ,Dᵀ]]，块位置与块内都要转置。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch2-s4",
      "type": "single",
      "stem": "分块矩阵 M=[[A,C],[0,B]]，A=diag(2,3)、B=[4]，C任意相容。detM是多少？",
      "options": {
        "A": "依赖C",
        "B": "24",
        "C": "9",
        "D": "6"
      },
      "answer": "B",
      "explanation": "分块上三角det=detA detB=2·3·4=24。"
    }
  ],
  "linear-algebra:ch3-s1": [
    {
      "id": "la-combo-1",
      "type": "single",
      "stem": "若向量 β 能由向量组 α₁,…,αₛ 线性表示，则？",
      "options": {
        "A": "方程组 x₁α₁+…+xₛαₛ=β 有解",
        "B": "β 一定为零向量",
        "C": "αᵢ 之间一定线性无关",
        "D": "β 与 αᵢ 一定正交"
      },
      "answer": "A",
      "explanation": "线性表示等价于相应的非齐次线性方程组有解。"
    },
    {
      "id": "la-combo-2",
      "type": "single",
      "stem": "两个向量组等价是指？",
      "options": {
        "A": "可以相互线性表示",
        "B": "长度相等",
        "C": "秩相等",
        "D": "包含相同向量"
      },
      "answer": "A",
      "explanation": "向量组等价定义为可互相线性表示，等价组秩相等（反之不成立）。"
    },
    {
      "id": "la-combo-3",
      "type": "judge",
      "stem": "零向量可以由任意向量组线性表示（取系数全为 0）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "系数全取 0 即可表示零向量，这是平凡的线性组合。"
    },
    {
      "id": "la-combo-4",
      "type": "single",
      "stem": "若向量组 B 可由向量组 A 线性表示，则？",
      "options": {
        "A": "r(B) ≤ r(A)",
        "B": "r(B) ≥ r(A)",
        "C": "r(B) = r(A)",
        "D": "r(B) = 0"
      },
      "answer": "A",
      "explanation": "能被表示的向量组的秩不超过表示它的向量组的秩。"
    },
    {
      "id": "exam-linear-vector-2024-6-r2",
      "type": "single",
      "stem": "三个向量整体线性相关，但任取其中两个都线性无关，则该向量组的秩是多少？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "2",
        "D": "3"
      },
      "answer": "C",
      "explanation": "任意两个向量独立说明秩至少为 2；三个整体相关说明秩小于 3，因此秩为 2。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch3-s1",
      "type": "single",
      "stem": "α=(1,0,1)、β=(0,1,1)。γ=(2,−1,t) 可由α、β线性表示，t须为？",
      "options": {
        "A": "2",
        "B": "任意实数",
        "C": "1",
        "D": "−1"
      },
      "answer": "C",
      "explanation": "前两坐标强制系数2与−1，第三坐标2−1=1。"
    }
  ],
  "linear-algebra:ch3-s2": [
    {
      "id": "la-indep-1",
      "type": "single",
      "stem": "下列向量组一定线性相关的是？",
      "options": {
        "A": "含有零向量的向量组",
        "B": "单位向量组",
        "C": "任意两个不成比例的向量",
        "D": "n 个 n 维线性无关向量"
      },
      "answer": "A",
      "explanation": "含零向量时取零向量系数非零即可线性表出 0，故线性相关。"
    },
    {
      "id": "la-indep-2",
      "type": "judge",
      "stem": "n+1 个 n 维向量一定线性相关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "向量个数超过维数时必线性相关，因为矩阵的秩不超过 n。"
    },
    {
      "id": "la-indep-3",
      "type": "single",
      "stem": "向量组 α₁,…,αₛ 线性相关的充要条件是？",
      "options": {
        "A": "存在不全为零的系数使 Σkᵢαᵢ = 0",
        "B": "所有系数都为 0",
        "C": "秩等于 s",
        "D": "向量两两正交"
      },
      "answer": "A",
      "explanation": "线性相关即存在非平凡线性组合为零向量。"
    },
    {
      "id": "la-indep-4",
      "type": "judge",
      "stem": "若向量组的一部分线性相关，则整体也线性相关；若整体线性无关，则任一部分也线性无关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "相关性可向上传递，无关性可向下传递。"
    },
    {
      "id": "la-indep-5",
      "type": "single",
      "stem": "向量组线性无关等价于？",
      "options": {
        "A": "其秩等于向量个数",
        "B": "其秩小于向量个数",
        "C": "含有零向量",
        "D": "向量个数大于维数"
      },
      "answer": "A",
      "explanation": "线性无关 ⇔ 秩 = 向量个数；秩小于个数则线性相关。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch3-s2",
      "type": "single",
      "stem": "三个列向量 (1,0,1)、(0,1,1)、(1,1,t) 线性相关，t须为？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "任意实数",
        "D": "2"
      },
      "answer": "D",
      "explanation": "第三列减前两列为(0,0,t−2)，行列式t−2，相关当且仅当t=2。"
    }
  ],
  "linear-algebra:ch3-s3": [
    {
      "id": "la-maxindep-1",
      "type": "single",
      "stem": "向量组的极大线性无关组所含向量的个数等于？",
      "options": {
        "A": "该向量组的秩",
        "B": "向量总数",
        "C": "向量维数",
        "D": "1"
      },
      "answer": "A",
      "explanation": "极大无关组所含向量个数就是向量组的秩，且任一极大无关组含向量个数相同。"
    },
    {
      "id": "la-maxindep-2",
      "type": "single",
      "stem": "关于向量组的极大线性无关组，下列说法正确的是？",
      "options": {
        "A": "一般不唯一，但所含向量个数（秩）唯一",
        "B": "一定唯一",
        "C": "所含向量个数可以不同",
        "D": "一定是整个向量组"
      },
      "answer": "A",
      "explanation": "极大无关组可能有多个，但向量个数都等于向量组的秩。"
    },
    {
      "id": "la-maxindep-3",
      "type": "judge",
      "stem": "向量组的秩等于其构成矩阵的秩。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "把向量按列（或行）排成矩阵，向量组的秩即矩阵的秩。"
    },
    {
      "id": "la-maxindep-4-r2",
      "type": "single",
      "stem": "求极大线性无关组的常用方法是？",
      "options": {
        "A": "对列向量组成的矩阵做行阶梯化，取原矩阵中主元对应的列",
        "B": "取变换后全部非零列",
        "C": "取全部零列",
        "D": "取任意与秩相同数量的列"
      },
      "answer": "A",
      "explanation": "化行阶梯形后，主元所在列对应的原向量构成一个极大无关组。"
    },
    {
      "id": "la-maxindep-5",
      "type": "judge",
      "stem": "矩阵的行秩等于列秩。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "矩阵的行秩与列秩相等，统称为矩阵的秩。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch3-s3",
      "type": "single",
      "stem": "α₁=(1,0)、α₂=(0,1)、α₃=(1,1)、α₄=(2,2)。哪组可作极大无关组？",
      "options": {
        "A": "α₁,α₃",
        "B": "α₃,α₄",
        "C": "α₁,α₂,α₃",
        "D": "仅α₄"
      },
      "answer": "A",
      "explanation": "α₁与α₃行列式1非零，张成二维；α₃和α₄相关，三元相关，单元不极大。"
    }
  ],
  "linear-algebra:ch3-s4": [
    {
      "id": "la-vspace-1",
      "type": "single",
      "stem": "向量空间（线性空间）对哪两种运算封闭？",
      "options": {
        "A": "加法与数乘",
        "B": "乘法与除法",
        "C": "内积与叉积",
        "D": "转置与求逆"
      },
      "answer": "A",
      "explanation": "向量空间对加法与数乘封闭，并满足八条公理。"
    },
    {
      "id": "la-vspace-2-r2",
      "type": "single",
      "stem": "向量空间的一组基是指？",
      "options": {
        "A": "空间中线性无关且张成整个空间的向量组",
        "B": "任意有限无关向量组",
        "C": "所有向量的集合",
        "D": "零向量的集合"
      },
      "answer": "A",
      "explanation": "基是线性无关且能生成整个空间的向量组，即极大无关组。"
    },
    {
      "id": "la-vspace-3",
      "type": "judge",
      "stem": "向量空间的维数等于其任意一组基所含向量的个数。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "不同基含向量个数相同，这个数就是空间的维数。"
    },
    {
      "id": "la-vspace-4",
      "type": "single",
      "stem": "过渡矩阵的作用是？",
      "options": {
        "A": "描述两组基之间的坐标变换关系",
        "B": "求行列式",
        "C": "判断正定",
        "D": "计算内积"
      },
      "answer": "A",
      "explanation": "若 (β₁,…,βₙ)=(α₁,…,αₙ)P，则 P 为从旧基到新基的过渡矩阵，用于坐标变换。"
    },
    {
      "id": "la-vspace-5",
      "type": "judge",
      "stem": "n 维向量空间中任意 n 个线性无关的向量都构成一组基。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "n 个线性无关向量已是极大无关组，故构成基。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch3-s4",
      "type": "single",
      "stem": "旧基为e₁,e₂，新基β₁=(1,1)、β₂=(1,−1)。向量旧坐标(3,1)的新坐标是？",
      "options": {
        "A": "(1,2)",
        "B": "(2,1)",
        "C": "(3,1)",
        "D": "(4,2)"
      },
      "answer": "B",
      "explanation": "解u+v=3、u−v=1，得u=2,v=1。"
    }
  ],
  "linear-algebra:ch3-s5": [
    {
      "id": "la-orth-1",
      "type": "single",
      "stem": "把一组线性无关向量化为标准正交组的常用方法是？",
      "options": {
        "A": "施密特（Schmidt）正交化",
        "B": "克拉默法则",
        "C": "初等行变换",
        "D": "洛必达法则"
      },
      "answer": "A",
      "explanation": "施密特正交化先逐次减去在已有正交向量上的投影，再单位化得到标准正交组。"
    },
    {
      "id": "la-orth-2",
      "type": "single",
      "stem": "关于正交向量组，下列说法正确的是？",
      "options": {
        "A": "非零正交向量组一定线性无关",
        "B": "正交向量组一定相关",
        "C": "正交向量组含零向量",
        "D": "正交即平行"
      },
      "answer": "A",
      "explanation": "两两正交的非零向量组线性无关，可作为正交基。"
    },
    {
      "id": "la-orth-3-r2",
      "type": "judge",
      "stem": "两向量正交的充要条件是它们的内积为 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "正交定义为内积为0。两个非零向量时这等价于夹角90°；零向量也与任意向量正交，但零向量的夹角没有定义。"
    },
    {
      "id": "la-orth-5",
      "type": "judge",
      "stem": "标准正交组中的向量两两正交且每个向量的模都为 1。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "标准正交（规范正交）组满足正交且单位化两个条件。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch3-s5",
      "type": "single",
      "stem": "对u=(1,1,0)、v=(1,0,1)做施密特，v减其在u上的投影得到？",
      "options": {
        "A": "(1,1,0)",
        "B": "(1/2,1/2,1)",
        "C": "(1/2,−1/2,1)",
        "D": "(0,−1,1)"
      },
      "answer": "C",
      "explanation": "投影系数内积1除u平方范数2，为1/2，减后(1/2,−1/2,1)。"
    }
  ],
  "linear-algebra:ch4-s1": [
    {
      "id": "la-cramer-1",
      "type": "single",
      "stem": "克拉默法则适用于怎样的线性方程组？",
      "options": {
        "A": "方程个数等于未知数个数且系数行列式不为 0",
        "B": "任意线性方程组",
        "C": "只有齐次方程组",
        "D": "方程个数少于未知数个数"
      },
      "answer": "A",
      "explanation": "克拉默法则要求系数矩阵为方阵且 |A|≠0，此时方程组有唯一解 xᵢ=|Aᵢ|/|A|。"
    },
    {
      "id": "la-cramer-3",
      "type": "judge",
      "stem": "当 |A| ≠ 0 时，齐次线性方程组 Ax=0 只有零解。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "系数行列式非零说明 A 可逆，Ax=0 两边左乘 A⁻¹ 得 x=0。"
    },
    {
      "id": "la-cramer-4",
      "type": "single",
      "stem": "克拉默法则给出的解为？",
      "options": {
        "A": "xᵢ = |Aᵢ| / |A|",
        "B": "xᵢ = |A| / |Aᵢ|",
        "C": "xᵢ = |Aᵢ|",
        "D": "xᵢ = |A|·|Aᵢ|"
      },
      "answer": "A",
      "explanation": "把 A 的第 i 列换成常数列 b 得 Aᵢ，则 xᵢ=|Aᵢ|/|A|。"
    },
    {
      "id": "la-cramer-5",
      "type": "judge",
      "stem": "克拉默法则计算量大，主要用于理论推导而非大规模数值求解。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "需要计算 n+1 个 n 阶行列式，代价高，实际求解多用消元法。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch4-s1",
      "type": "single",
      "stem": "方程 2x+y=5、x−y=1 的克拉默法则给出x是多少？",
      "options": {
        "A": "1",
        "B": "3",
        "C": "−2",
        "D": "2"
      },
      "answer": "D",
      "explanation": "系数det=−3，换第一列det=−6，比值2；回代y=1。"
    }
  ],
  "linear-algebra:ch4-s2": [
    {
      "id": "la-homo-1",
      "type": "single",
      "stem": "n 元齐次线性方程组 Ax=0 有非零解的充要条件是？",
      "options": {
        "A": "r(A) < n",
        "B": "r(A) = n",
        "C": "|A| ≠ 0",
        "D": "r(A) > n"
      },
      "answer": "A",
      "explanation": "齐次方程组有非零解 ⇔ 系数矩阵的秩小于未知数个数 n（存在自由变量）。"
    },
    {
      "id": "la-homo-2",
      "type": "single",
      "stem": "n 元齐次方程组 Ax=0 解空间的维数等于？",
      "options": {
        "A": "n − r(A)",
        "B": "n",
        "C": "r(A)",
        "D": "n + r(A)"
      },
      "answer": "A",
      "explanation": "解空间维数 = 未知数个数 − 系数矩阵的秩，即自由变量个数。"
    },
    {
      "id": "la-homo-3",
      "type": "judge",
      "stem": "齐次线性方程组的全体解构成一个向量空间（解空间）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "齐次解对加法与数乘封闭，构成解空间。"
    },
    {
      "id": "la-homo-4",
      "type": "single",
      "stem": "齐次方程组的基础解系含有多少个解向量？",
      "options": {
        "A": "n − r(A)",
        "B": "r(A)",
        "C": "n",
        "D": "1"
      },
      "answer": "A",
      "explanation": "基础解系所含向量个数等于解空间维数 n−r(A)。"
    },
    {
      "id": "la-homo-5",
      "type": "judge",
      "stem": "齐次线性方程组一定有解（至少有零解）。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "零向量总是解，故齐次方程组必有解。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch4-s2",
      "type": "single",
      "stem": "齐次方程 x+2y−z=0 的基础解系可取哪组？",
      "options": {
        "A": "(−2,1,0),(1,0,1)",
        "B": "(1,0,0),(0,1,0)",
        "C": "(−2,1,0)仅一个",
        "D": "(0,0,0),(1,0,1)"
      },
      "answer": "A",
      "explanation": "自由变量y,z给x=−2y+z，两列独立且生成全部解。"
    }
  ],
  "linear-algebra:ch4-s3": [
    {
      "id": "la-nonhomo-1",
      "type": "single",
      "stem": "非齐次线性方程组 Ax=b 有解的充要条件是？",
      "options": {
        "A": "r(A) = r(A|b)",
        "B": "r(A) = n",
        "C": "|A| ≠ 0",
        "D": "b = 0"
      },
      "answer": "A",
      "explanation": "有解 ⇔ 系数矩阵的秩等于增广矩阵的秩；当等于未知数个数时解唯一，否则有无穷多解。"
    },
    {
      "id": "la-nonhomo-3",
      "type": "judge",
      "stem": "非齐次方程组的通解等于一个特解加上对应齐次方程组的通解。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是非齐次方程组解的结构定理。"
    },
    {
      "id": "la-nonhomo-4",
      "type": "single",
      "stem": "若 r(A) = r(A|b) = n（n 为未知数个数），则方程组？",
      "options": {
        "A": "有唯一解",
        "B": "有无穷多解",
        "C": "无解",
        "D": "只有零解"
      },
      "answer": "A",
      "explanation": "秩等于未知数个数说明无自由变量，解唯一。"
    },
    {
      "id": "la-nonhomo-5",
      "type": "judge",
      "stem": "若 r(A) = r(A|b) < n，则方程组有无穷多解。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "相容且存在自由变量（n−r>0），故有无穷多解。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch4-s3",
      "type": "single",
      "stem": "方程 x+y=1、2x+2y=b 有无穷多解的条件是？",
      "options": {
        "A": "任意b",
        "B": "b=2",
        "C": "b=1",
        "D": "b=0"
      },
      "answer": "B",
      "explanation": "第二行系数为第一行2倍，常数需同倍；b=2时秩1小于未知数2。"
    }
  ],
  "linear-algebra:ch5-s1": [
    {
      "id": "la-eig-1-r2",
      "type": "single",
      "stem": "在复数域中按代数重数计数 n 阶矩阵 A 的全部特征值，下列说法正确的是？",
      "options": {
        "A": "全部特征值之和等于 A 的迹，之积等于 |A|",
        "B": "特征值之和等于 |A|",
        "C": "特征值一定都是实数",
        "D": "特征值之积等于迹"
      },
      "answer": "A",
      "explanation": "由特征多项式，Σλᵢ = tr(A)，Πλᵢ = |A|；实矩阵的特征值可能是复数。"
    },
    {
      "id": "la-eig-2",
      "type": "single",
      "stem": "求矩阵 A 的特征值需要解哪个方程？",
      "options": {
        "A": "|λE − A| = 0",
        "B": "|A| = 0",
        "C": "Ax = 0",
        "D": "A² = A"
      },
      "answer": "A",
      "explanation": "由 (λE−A)x=0 有非零解，得特征方程 |λE−A|=0。"
    },
    {
      "id": "la-eig-3",
      "type": "judge",
      "stem": "特征向量必须是非零向量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "零向量对任何 λ 都满足，无意义，故特征向量非零。"
    },
    {
      "id": "la-eig-5",
      "type": "judge",
      "stem": "矩阵属于不同特征值的特征向量线性无关。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "不同特征值对应的特征向量必线性无关。"
    },
    {
      "id": "exam-linear-eigen-2020-21-r2",
      "type": "single",
      "stem": "3 阶矩阵的三个特征值为 1、2、4，则其迹等于多少？",
      "options": {
        "A": "4",
        "B": "6",
        "C": "7",
        "D": "8"
      },
      "answer": "C",
      "explanation": "矩阵的迹等于全部特征值之和，即 1+2+4=7。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch5-s1",
      "type": "single",
      "stem": "A=[[2,1],[0,2]]，关于λ=2的特征空间维数是？",
      "options": {
        "A": "0",
        "B": "不能确定",
        "C": "1",
        "D": "2"
      },
      "answer": "C",
      "explanation": "A−2I仅第一行第二列为1，核要求x₂=0，自由x₁，维数1。"
    }
  ],
  "linear-algebra:ch5-s2": [
    {
      "id": "la-diag-1",
      "type": "single",
      "stem": "n 阶矩阵 A 可相似对角化的充要条件是？",
      "options": {
        "A": "A 有 n 个线性无关的特征向量",
        "B": "A 有 n 个互不相同的特征值",
        "C": "A 是对称矩阵",
        "D": "|A| ≠ 0"
      },
      "answer": "A",
      "explanation": "可对角化 ⇔ 存在 n 个线性无关特征向量；n 个互异特征值只是充分条件。"
    },
    {
      "id": "la-diag-2",
      "type": "single",
      "stem": "相似矩阵具有相同的？",
      "options": {
        "A": "特征值",
        "B": "元素",
        "C": "转置",
        "D": "逆矩阵"
      },
      "answer": "A",
      "explanation": "相似矩阵有相同的特征多项式，故特征值相同。"
    },
    {
      "id": "la-diag-3",
      "type": "judge",
      "stem": "相似矩阵的行列式、迹和秩都相同。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这些都是相似不变量，可用于判断是否相似。"
    },
    {
      "id": "la-diag-4-r2",
      "type": "single",
      "stem": "复数域上的 n 阶矩阵可相似对角化的充要条件是？",
      "options": {
        "A": "每个特征值的几何重数等于其代数重数",
        "B": "特征值互不相同",
        "C": "|A| ≠ 0",
        "D": "A 对称"
      },
      "answer": "A",
      "explanation": "在复数域特征多项式分裂，对每个根几何重数等于代数重数即给出n个无关特征向量。实数域还需所有特征值为实数。"
    },
    {
      "id": "la-diag-5",
      "type": "judge",
      "stem": "实对称矩阵一定可以相似对角化。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "实对称矩阵甚至可正交对角化，必有 n 个线性无关特征向量。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch5-s2",
      "type": "single",
      "stem": "A=[[1,1],[0,1]]、B=单位矩阵。哪项正确？",
      "options": {
        "A": "A与B相似",
        "B": "A可对角化",
        "C": "A有两个无关特征向量",
        "D": "A与B特征值相同但不相似"
      },
      "answer": "D",
      "explanation": "A的λ=1特征空间一维，B二维；相似保几何重数，故不相似。"
    }
  ],
  "linear-algebra:ch5-s3": [
    {
      "id": "la-sym-1",
      "type": "judge",
      "stem": "实对称矩阵属于不同特征值的特征向量一定相互正交。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "实对称矩阵必可正交对角化，不同特征值对应的特征向量相互正交。"
    },
    {
      "id": "la-sym-2",
      "type": "single",
      "stem": "实对称矩阵的特征值具有什么性质？",
      "options": {
        "A": "全为实数",
        "B": "全为虚数",
        "C": "必有负数",
        "D": "全为零"
      },
      "answer": "A",
      "explanation": "实对称矩阵的特征值必为实数，且特征向量可取为实向量。"
    },
    {
      "id": "la-sym-3",
      "type": "judge",
      "stem": "实对称矩阵一定可以正交对角化。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "存在正交矩阵 Q 使 QᵀAQ 为对角矩阵。"
    },
    {
      "id": "la-sym-4",
      "type": "single",
      "stem": "n 阶实对称矩阵一定有多少个线性无关的特征向量？",
      "options": {
        "A": "n 个",
        "B": "1 个",
        "C": "n−1 个",
        "D": "不确定"
      },
      "answer": "A",
      "explanation": "实对称矩阵可对角化，必有 n 个线性无关特征向量。"
    },
    {
      "id": "la-sym-5",
      "type": "judge",
      "stem": "实对称矩阵的 k 重特征值一定对应 k 个线性无关的特征向量。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "实对称矩阵每个特征值的几何重数等于代数重数，故成立。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch5-s3",
      "type": "single",
      "stem": "实对称矩阵 A=[[2,1],[1,2]]，向量(1,−1)的特征值是？",
      "options": {
        "A": "1",
        "B": "2",
        "C": "3",
        "D": "−1"
      },
      "answer": "A",
      "explanation": "矩阵乘向量=(1,−1)=1倍原向量，另一个特征值3对应(1,1)。"
    }
  ],
  "linear-algebra:ch6-s1": [
    {
      "id": "la-quad-1",
      "type": "single",
      "stem": "二次型 f(x)=xᵀAx 中，矩阵 A 通常取为？",
      "options": {
        "A": "对称矩阵",
        "B": "对角矩阵",
        "C": "上三角矩阵",
        "D": "任意矩阵"
      },
      "answer": "A",
      "explanation": "二次型总可写成 xᵀAx 且取 A 为对称矩阵，此时 A 唯一确定。"
    },
    {
      "id": "la-quad-3",
      "type": "judge",
      "stem": "二次型的秩等于其矩阵的秩。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "二次型的秩定义为其矩阵的秩，反映平方项个数（标准形中非零系数个数）。"
    },
    {
      "id": "la-quad-4",
      "type": "single",
      "stem": "作可逆线性变换 x = Cy 化简二次型，属于？",
      "options": {
        "A": "合同变换",
        "B": "相似变换",
        "C": "正交变换（特例）",
        "D": "初等变换"
      },
      "answer": "A",
      "explanation": "x=Cy（C 可逆）使 A 与 CᵀAC 合同，二次型化为新二次型。"
    },
    {
      "id": "la-quad-5",
      "type": "judge",
      "stem": "二次型经可逆线性变换后，其秩保持不变。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "合同变换不改变矩阵的秩，故二次型的秩不变。"
    },
    {
      "id": "exam-linear-quadratic-2015-6-r2",
      "type": "single",
      "stem": "二次型在正交变换下化为 2y₁²+y₂²−y₃²，其正惯性指数和负惯性指数分别是多少？",
      "options": {
        "A": "1 和 2",
        "B": "2 和 1",
        "C": "3 和 0",
        "D": "0 和 3"
      },
      "answer": "B",
      "explanation": "标准形中有两个正系数和一个负系数。"
    },
    {
      "id": "exam-linear-quadratic-2014-13-r2",
      "type": "single",
      "stem": "一个非退化三元二次型的负惯性指数为 1，则其正惯性指数是多少？",
      "options": {
        "A": "0",
        "B": "1",
        "C": "2",
        "D": "3"
      },
      "answer": "C",
      "explanation": "非退化三元二次型的正、负惯性指数之和为 3；负惯性指数为 1 时正惯性指数为 2。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch6-s1",
      "type": "single",
      "stem": "实二次型 x₁²+4x₁x₂+3x₂² 的对称矩阵是？",
      "options": {
        "A": "[[1,1],[1,3]]",
        "B": "[[1,2],[2,3]]",
        "C": "[[1,4],[4,3]]",
        "D": "[[1,0],[4,3]]"
      },
      "answer": "B",
      "explanation": "xTAx交叉系数2a12=4，故a12=a21=2。"
    }
  ],
  "linear-algebra:ch6-s2": [
    {
      "id": "la-std-1",
      "type": "single",
      "stem": "二次型的标准形是指？",
      "options": {
        "A": "只含平方项、不含交叉项的二次型",
        "B": "系数全为 1 的二次型",
        "C": "矩阵为对角阵且系数为 ±1",
        "D": "秩为 n 的二次型"
      },
      "answer": "A",
      "explanation": "标准形形如 d₁y₁²+…+dᵣyᵣ²，只含平方项。"
    },
    {
      "id": "la-std-2",
      "type": "single",
      "stem": "二次型的规范形中，平方项系数只能是？",
      "options": {
        "A": "1、−1 或 0",
        "B": "任意实数",
        "C": "正整数",
        "D": "0 或 1"
      },
      "answer": "A",
      "explanation": "规范形把标准形进一步归一，系数为 +1、−1、0。"
    },
    {
      "id": "la-std-3",
      "type": "judge",
      "stem": "惯性定理说明二次型的正、负惯性指数在可逆线性变换下不变。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "正平方项个数 p 与负平方项个数 q 是合同不变量。"
    },
    {
      "id": "la-std-4",
      "type": "single",
      "stem": "化二次型为标准形的常用方法有？",
      "options": {
        "A": "配方法与正交变换法",
        "B": "求逆与转置",
        "C": "克拉默法则",
        "D": "洛必达法则"
      },
      "answer": "A",
      "explanation": "配方法（合同变换）和正交变换法都可化二次型为标准形。"
    },
    {
      "id": "la-std-5-r2",
      "type": "judge",
      "stem": "在固定维数的实二次型中，允许变量重排时，规范形由其正、负惯性指数唯一确定。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "不同方法得到的规范形相同，只由 p、q（及秩）决定。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch6-s2",
      "type": "single",
      "stem": "实二次型 x²+4xy+3y² 的正、负惯性指数是？",
      "options": {
        "A": "0和2",
        "B": "1和0",
        "C": "1和1",
        "D": "2和0"
      },
      "answer": "C",
      "explanation": "配方(x+2y)²−y²，可逆变换下一个正平方一个负平方。"
    }
  ],
  "linear-algebra:ch6-s3": [
    {
      "id": "la-pd-1",
      "type": "judge",
      "stem": "实对称矩阵 A 正定的充要条件是 A 的各阶顺序主子式都大于 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "这是正定的顺序主子式判别法，适用于实对称矩阵。"
    },
    {
      "id": "la-pd-2",
      "type": "single",
      "stem": "实对称矩阵 A 正定的另一个等价条件是？",
      "options": {
        "A": "A 的特征值全为正",
        "B": "A 的特征值全为负",
        "C": "|A| < 0",
        "D": "r(A) < n"
      },
      "answer": "A",
      "explanation": "实对称矩阵正定 ⇔ 特征值全正 ⇔ 正惯性指数为 n ⇔ 顺序主子式全正。"
    },
    {
      "id": "la-pd-3",
      "type": "single",
      "stem": "实二次型正定的等价条件是？",
      "options": {
        "A": "正惯性指数为 n",
        "B": "负惯性指数为 n",
        "C": "秩小于 n",
        "D": "存在零特征值"
      },
      "answer": "A",
      "explanation": "正定 ⇔ 正惯性指数 p=n ⇔ 特征值全正 ⇔ 顺序主子式全正。"
    },
    {
      "id": "la-pd-4",
      "type": "judge",
      "stem": "正定矩阵的行列式一定大于 0。",
      "options": {
        "T": "正确",
        "F": "错误"
      },
      "answer": "T",
      "explanation": "正定矩阵特征值全正，行列式等于特征值之积，故 > 0。"
    },
    {
      "id": "la-pd-5",
      "type": "single",
      "stem": "正定矩阵的主对角元素一定？",
      "options": {
        "A": "都大于 0",
        "B": "都小于 0",
        "C": "都等于 0",
        "D": "无限制"
      },
      "answer": "A",
      "explanation": "取标准基向量 eᵢ，有 aᵢᵢ = eᵢᵀAeᵢ > 0。"
    },
    {
      "id": "qa-20261002-linear-algebra-ch6-s3",
      "type": "single",
      "stem": "实对称矩阵 [[1,t],[t,4]] 正定，当且仅当？",
      "options": {
        "A": "t>0",
        "B": "t≠±2",
        "C": "任意t",
        "D": "−2<t<2"
      },
      "answer": "D",
      "explanation": "顺序主子式1>0及4−t²>0，得绝对值t<2。"
    }
  ]
});
})(window);
