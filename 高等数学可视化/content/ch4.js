/* ============================================================
   ch4.js — 第四章 向量代数和空间解析几何
   覆盖 2026 大纲「四、向量代数和空间解析几何」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH4 = {
    id: 'ch4', no: '四', title: '向量代数和空间解析几何',
    subtitle: '用坐标和向量把空间里的点、线、面代数化——数量积管角度，向量积管面积，混合积管体积。',
    tags: ['空间直角坐标系', '向量', '线性运算', '数量积', '向量积', '混合积', '方向余弦', '平面方程', '直线方程', '点到平面距离', '球面', '柱面', '旋转曲面', '二次曲面', '投影曲线'],
    sections: [

      /* ---------------- 4.1 ---------------- */
      {
        id: 'ch4-s1', num: '4.1', title: '向量及其线性运算',
        lead: '大纲要求：理解空间直角坐标系与向量的概念及其表示，掌握向量的线性运算，了解两个向量平行（共线）的条件。',
        blocks: [
          { t: 'h3', idx: '①', text: '空间直角坐标系' },
          { t: 'list', items: [
            '<b>三条坐标轴：</b>\\( x \\) 轴、\\( y \\) 轴、\\( z \\) 轴，两两垂直，按右手系排列；',
            '<b>三个坐标面：</b>\\( xOy \\) 面（\\( z=0 \\)）、\\( yOz \\) 面（\\( x=0 \\)）、\\( zOx \\) 面（\\( y=0 \\)）把空间分成八个<b>卦限</b>；',
            '<b>点的坐标：</b>点 \\( M \\) 与有序数组 \\( (x,y,z) \\) 一一对应，记作 \\( M(x,y,z) \\)；',
            '<b>两点间距离：</b>\\( |M_1M_2|=\\sqrt{(x_2-x_1)^{2}+(y_2-y_1)^{2}+(z_2-z_1)^{2}} \\)。'
          ]},
          { t: 'h3', idx: '②', text: '向量的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '向量（矢量）', html:
            '<p class="tight">既有大小又有方向的量称为<b>向量</b>，用带箭头的线段表示：起点 \\( A \\)、终点 \\( B \\) 的向量记作 \\( \\overrightarrow{AB} \\)，也常记作 \\( \\vec{a} \\)。向量的大小称为<b>模</b>，记作 \\( |\\overrightarrow{AB}| \\) 或 \\( |\\vec{a}| \\)。</p>' +
            '<ul class="none">' +
            '<li><b>单位向量：</b>模为 1 的向量，\\( \\vec{a} \\) 的单位化向量为 \\( \\vec{a}^{\\,0}=\\dfrac{\\vec{a}}{|\\vec{a}|} \\)（\\( \\vec{a}\\neq\\vec{0} \\)）；</li>' +
            '<li><b>零向量：</b>模为 0、方向任意的向量 \\( \\vec{0} \\)；</li>' +
            '<li><b>自由向量：</b>只由大小和方向确定、与起点位置无关的向量（本课程讨论的都是自由向量）；</li>' +
            '<li><b>相等：</b>大小相同且方向相同；<b>负向量：</b>大小相同、方向相反，记作 \\( -\\vec{a} \\)；</li>' +
            '<li><b>平行（共线）：</b>两个非零向量方向相同或相反，记作 \\( \\vec{a}\\parallel\\vec{b} \\)；规定零向量与任何向量平行；</li>' +
            '<li><b>共面：</b>若干个向量平移到同一起点后位于同一平面内。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '向量的线性运算' },
          { t: 'card', kind: 'key', tag: '必记', title: '线性运算的坐标表示', html:
            '<p class="tight">设 \\( \\vec{a}=(a_x,a_y,a_z),\\ \\vec{b}=(b_x,b_y,b_z),\\ \\lambda\\in\\mathbb{R} \\)：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>加法：</b>\\( \\vec{a}+\\vec{b}=(a_x+b_x,\\ a_y+b_y,\\ a_z+b_z) \\)（三角形法则 / 平行四边形法则）</div>' +
            '<div class="fml-row"><b>减法：</b>\\( \\vec{a}-\\vec{b}=\\overrightarrow{BA}=(a_x-b_x,\\ a_y-b_y,\\ a_z-b_z) \\)（由 \\( \\vec{b} \\) 指向 \\( \\vec{a} \\)）</div>' +
            '<div class="fml-row"><b>数乘：</b>\\( \\lambda\\vec{a}=(\\lambda a_x,\\ \\lambda a_y,\\ \\lambda a_z) \\)，\\( |\\lambda\\vec{a}|=|\\lambda|\\,|\\vec{a}| \\)（\\( \\lambda\\gt 0 \\) 同向，\\( \\lambda\\lt 0 \\) 反向）</div>' +
            '<div class="fml-row"><b>模：</b>\\( |\\vec{a}|=\\sqrt{a_x^{2}+a_y^{2}+a_z^{2}} \\)</div>' +
            '</div>' +
            '<p class="tight"><b>运算律：</b>交换律 \\( \\vec{a}+\\vec{b}=\\vec{b}+\\vec{a} \\)；结合律 \\( (\\vec{a}+\\vec{b})+\\vec{c}=\\vec{a}+(\\vec{b}+\\vec{c}) \\)；分配律 \\( \\lambda(\\vec{a}+\\vec{b})=\\lambda\\vec{a}+\\lambda\\vec{b} \\)。</p>'
          },
          { t: 'h3', idx: '④', text: '向量共线的条件与定比分点' },
          { t: 'fml', html:
            '<div class="fml-row"><b>共线（平行）条件：</b>\\( \\vec{a}\\parallel\\vec{b}\\ (\\vec{b}\\neq\\vec{0}) \\iff \\vec{a}=\\lambda\\vec{b} \\iff \\dfrac{a_x}{b_x}=\\dfrac{a_y}{b_y}=\\dfrac{a_z}{b_z} \\)（约定分母为 0 时分子也为 0）</div>' +
            '<div class="fml-row"><b>三点共线：</b>\\( A,B,C \\) 三点共线 \\( \\iff \\overrightarrow{AB}\\parallel\\overrightarrow{AC} \\)（必须以同一起点 \\( A \\) 出发）</div>' +
            '<div class="fml-row"><b>定比分点：</b>点 \\( P \\) 在直线 \\( AB \\) 上且 \\( \\overrightarrow{AP}=\\lambda\\overrightarrow{PB} \\)，则 \\( \\overrightarrow{OP}=\\dfrac{\\overrightarrow{OA}+\\lambda\\overrightarrow{OB}}{1+\\lambda} \\)（\\( \\lambda\\neq -1 \\)）</div>' +
            '<div class="fml-row"><b>中点：</b>\\( \\lambda=1 \\) 时 \\( P \\) 为 \\( AB \\) 中点，坐标为 \\( \\left(\\dfrac{x_1+x_2}{2},\\dfrac{y_1+y_2}{2},\\dfrac{z_1+z_2}{2}\\right) \\)</div>'
          },
          { t: 'viz', build: 'vectorOps3d', title: '空间向量运算可视化', sub: '拖动向量观察加法、减法与数乘的几何意义' },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '用“共线”解决三点共线与参数问题', html:
            '<p class="tight">题型：已知三点求参数使其共线、或求直线上的分点。核心是把几何条件翻译为向量条件 \\( \\overrightarrow{AB}=k\\overrightarrow{AC} \\)，再比较分量得到方程组。</p>'
          }
        ],
        examples: [
          {
            no: '例 4.1', meta: '基础 · 坐标运算与单位向量',
            q: '已知 \\( A(1,2,3) \\)，\\( B(3,0,1) \\)，求 \\( \\overrightarrow{AB} \\)、\\( |\\overrightarrow{AB}| \\) 及 \\( \\overrightarrow{AB} \\) 的单位向量。',
            sol: '<p>\\( \\overrightarrow{AB}=(3-1,\\ 0-2,\\ 1-3)=(2,-2,-2) \\)。</p>' +
              '<p>\\( |\\overrightarrow{AB}|=\\sqrt{2^{2}+(-2)^{2}+(-2)^{2}}=\\sqrt{12}=2\\sqrt{3} \\)。</p>' +
              '<p>单位向量 \\( \\dfrac{\\overrightarrow{AB}}{|\\overrightarrow{AB}|}=\\dfrac{(2,-2,-2)}{2\\sqrt{3}}=\\left(\\dfrac{1}{\\sqrt{3}},\\ -\\dfrac{1}{\\sqrt{3}},\\ -\\dfrac{1}{\\sqrt{3}}\\right) \\)。</p>'
          },
          {
            no: '例 4.2', meta: '基础 · 共线条件求参数',
            q: '已知 \\( \\vec{a}=(1,-2,3) \\)，\\( \\vec{b}=(-2,4,\\lambda) \\)，且 \\( \\vec{a}\\parallel\\vec{b} \\)，求 \\( \\lambda \\)。',
            sol: '<p>由共线条件 \\( \\vec{b}=k\\vec{a} \\)：比较 \\( x \\) 分量得 \\( -2=k\\cdot 1 \\)，即 \\( k=-2 \\)。</p>' +
              '<p>比较 \\( y \\) 分量：\\( 4=k\\cdot(-2)=4 \\)，成立。</p>' +
              '<p>比较 \\( z \\) 分量：\\( \\lambda=k\\cdot 3=-6 \\)。</p>'
          },
          {
            no: '例 4.3', meta: '基础 · 定比分点',
            q: '已知 \\( A(1,0,2) \\)，\\( B(3,2,1) \\)，求 \\( AB \\) 的中点 \\( M \\) 以及靠近 \\( A \\) 的三等分点 \\( N \\) 的坐标。',
            sol: '<p>中点：\\( M\\left(\\dfrac{1+3}{2},\\dfrac{0+2}{2},\\dfrac{2+1}{2}\\right)=\\left(2,1,\\dfrac{3}{2}\\right) \\)。</p>' +
              '<p>三等分点满足 \\( \\overrightarrow{AN}=\\dfrac{1}{3}\\overrightarrow{AB} \\)，故 \\( \\overrightarrow{ON}=\\overrightarrow{OA}+\\dfrac{1}{3}\\overrightarrow{AB} \\)。</p>' +
              '<p>\\( \\overrightarrow{AB}=(2,2,-1) \\)，所以 \\( N=\\left(1+\\dfrac{2}{3},\\ 0+\\dfrac{2}{3},\\ 2-\\dfrac{1}{3}\\right)=\\left(\\dfrac{5}{3},\\dfrac{2}{3},\\dfrac{5}{3}\\right) \\)。</p>'
          }
        ],
        pitfalls: [
          '向量与数量不同：向量不能比较大小，只能说相等或平行；向量相等要求大小与方向都相同，与起点无关。',
          '零向量方向任意，与任何向量平行；写分量比例式 \\( \\dfrac{a_x}{b_x}=\\dfrac{a_y}{b_y}=\\dfrac{a_z}{b_z} \\) 时必须逐项检查分母为零的情形。',
          '判断三点共线必须用同一起点（如 \\( \\overrightarrow{AB} \\) 与 \\( \\overrightarrow{AC} \\)），不能用 \\( \\overrightarrow{AB} \\) 与 \\( \\overrightarrow{CD} \\) 的平行代替。',
          '单位向量是 \\( \\dfrac{\\vec{a}}{|\\vec{a}|} \\)，不要忘记除以模长，也不要写成 \\( \\vec{a} \\) 的分量直接归一。',
          '数乘后方向由 \\( \\lambda \\) 的符号决定：\\( \\lambda\\lt 0 \\) 时方向相反，这在与平行条件结合时最易出错。'
        ]
      },

      /* ---------------- 4.2 ---------------- */
      {
        id: 'ch4-s2', num: '4.2', title: '向量的坐标表示、数量积与向量积',
        lead: '大纲要求：理解单位向量、方向数与方向余弦、向量的坐标表达式，掌握数量积、向量积、混合积运算及两向量垂直、平行的条件，会求两向量的夹角。',
        blocks: [
          { t: 'h3', idx: '①', text: '向量的坐标表示与方向余弦' },
          { t: 'fml', html:
            '<div class="fml-row"><b>坐标分解式：</b>\\( \\vec{a}=a_x\\vec{i}+a_y\\vec{j}+a_z\\vec{k}=(a_x,a_y,a_z) \\)，其中 \\( \\vec{i},\\vec{j},\\vec{k} \\) 为坐标轴上的单位向量</div>' +
            '<div class="fml-row"><b>模：</b>\\( |\\vec{a}|=\\sqrt{a_x^{2}+a_y^{2}+a_z^{2}} \\)</div>' +
            '<div class="fml-row"><b>方向余弦：</b>\\( \\cos\\alpha=\\dfrac{a_x}{|\\vec{a}|},\\quad \\cos\\beta=\\dfrac{a_y}{|\\vec{a}|},\\quad \\cos\\gamma=\\dfrac{a_z}{|\\vec{a}|} \\)（\\( \\alpha,\\beta,\\gamma \\) 为向量与三坐标轴正向的夹角）</div>' +
            '<div class="fml-row"><b>恒等式：</b>\\( \\cos^{2}\\alpha+\\cos^{2}\\beta+\\cos^{2}\\gamma=1 \\)</div>' +
            '<div class="fml-row"><b>方向数：</b>方向余弦与方向数 \\( l,m,n \\) 成比例：\\( \\vec{s}=(l,m,n) \\) 的方向余弦为 \\( \\dfrac{(l,m,n)}{\\sqrt{l^{2}+m^{2}+n^{2}}} \\)</div>'
          },
          { t: 'h3', idx: '②', text: '数量积（点积）' },
          { t: 'card', kind: 'def', tag: '定义', title: '数量积', html:
            '<p class="tight">\\( \\vec{a}\\cdot\\vec{b}=|\\vec{a}||\\vec{b}|\\cos\\theta \\)（\\( \\theta \\) 为两向量夹角，\\( 0\\leqslant\\theta\\leqslant\\pi \\)），结果是<b>数量</b>。</p>' +
            '<div class="fml">\\( \\vec{a}\\cdot\\vec{b}=a_xb_x+a_yb_y+a_zb_z \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '数量积的性质、夹角与投影', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>垂直条件：</b>\\( \\vec{a}\\perp\\vec{b} \\iff \\vec{a}\\cdot\\vec{b}=0 \\iff a_xb_x+a_yb_y+a_zb_z=0 \\)</div>' +
            '<div class="fml-row"><b>夹角公式：</b>\\( \\cos\\theta=\\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}=\\dfrac{a_xb_x+a_yb_y+a_zb_z}{\\sqrt{a_x^{2}+a_y^{2}+a_z^{2}}\\sqrt{b_x^{2}+b_y^{2}+b_z^{2}}} \\)</div>' +
            '<div class="fml-row"><b>投影：</b>\\( \\mathrm{Prj}_{\\vec{a}}\\vec{b}=\\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}|}=|\\vec{b}|\\cos\\theta \\)</div>' +
            '<div class="fml-row"><b>运算律：</b>交换律 \\( \\vec{a}\\cdot\\vec{b}=\\vec{b}\\cdot\\vec{a} \\)；分配律 \\( (\\vec{a}+\\vec{b})\\cdot\\vec{c}=\\vec{a}\\cdot\\vec{c}+\\vec{b}\\cdot\\vec{c} \\)；\\( \\vec{a}\\cdot\\vec{a}=|\\vec{a}|^{2} \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '③', text: '向量积（叉积）' },
          { t: 'card', kind: 'def', tag: '定义', title: '向量积', html:
            '<p class="tight">\\( \\vec{c}=\\vec{a}\\times\\vec{b} \\) 是一个向量：模 \\( |\\vec{c}|=|\\vec{a}||\\vec{b}|\\sin\\theta \\)，方向垂直于 \\( \\vec{a},\\vec{b} \\) 且 \\( \\vec{a},\\vec{b},\\vec{c} \\) 构成右手系。</p>' +
            '<div class="fml">\\( \\vec{a}\\times\\vec{b}=\\begin{vmatrix}\\vec{i} & \\vec{j} & \\vec{k} \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z\\end{vmatrix}=\\big(a_yb_z-a_zb_y,\\ a_zb_x-a_xb_z,\\ a_xb_y-a_yb_x\\big) \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '向量积的性质与几何意义', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>反交换律：</b>\\( \\vec{a}\\times\\vec{b}=-\\vec{b}\\times\\vec{a} \\)；\\( \\vec{a}\\times\\vec{a}=\\vec{0} \\)</div>' +
            '<div class="fml-row"><b>平行条件：</b>\\( \\vec{a}\\parallel\\vec{b} \\iff \\vec{a}\\times\\vec{b}=\\vec{0} \\)（分量比 \\( \\dfrac{a_x}{b_x}=\\dfrac{a_y}{b_y}=\\dfrac{a_z}{b_z} \\)）</div>' +
            '<div class="fml-row"><b>几何意义：</b>\\( |\\vec{a}\\times\\vec{b}| \\) 等于以 \\( \\vec{a},\\vec{b} \\) 为邻边的平行四边形的面积</div>' +
            '<div class="fml-row"><b>三角形面积：</b>\\( S_{\\triangle}=\\dfrac{1}{2}|\\vec{a}\\times\\vec{b}| \\)</div>' +
            '<div class="fml-row"><b>分配律：</b>\\( (\\vec{a}+\\vec{b})\\times\\vec{c}=\\vec{a}\\times\\vec{c}+\\vec{b}\\times\\vec{c} \\)；\\( (\\lambda\\vec{a})\\times\\vec{b}=\\lambda(\\vec{a}\\times\\vec{b}) \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '④', text: '混合积' },
          { t: 'card', kind: 'def', tag: '定义', title: '混合积', html:
            '<p class="tight">\\( [\\vec{a},\\vec{b},\\vec{c}]=(\\vec{a}\\times\\vec{b})\\cdot\\vec{c} \\)，结果是<b>数量</b>。</p>' +
            '<div class="fml">\\( [\\vec{a},\\vec{b},\\vec{c}]=\\begin{vmatrix}a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z\\end{vmatrix} \\)</div>' +
            '<p class="tight"><b>几何意义：</b>\\( |[\\vec{a},\\vec{b},\\vec{c}]| \\) 等于以 \\( \\vec{a},\\vec{b},\\vec{c} \\) 为棱的平行六面体的体积。</p>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '混合积的性质与共面条件', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>共面条件：</b>\\( \\vec{a},\\vec{b},\\vec{c} \\) 共面 \\( \\iff [\\vec{a},\\vec{b},\\vec{c}]=0 \\)（三向量共面等价于四点共面）</div>' +
            '<div class="fml-row"><b>轮换不变：</b>\\( [\\vec{a},\\vec{b},\\vec{c}]=[\\vec{b},\\vec{c},\\vec{a}]=[\\vec{c},\\vec{a},\\vec{b}] \\)</div>' +
            '<div class="fml-row"><b>交换变号：</b>交换任意两个向量，混合积变号</div>' +
            '</div>'
          },
          { t: 'viz', build: 'vectorOps3d', title: '数量积与向量积的几何直观', sub: '观察投影、夹角与平行四边形面积的分解' },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '三种乘积的应用场景', html:
            '<p class="tight">求夹角、投影、垂直判定用<b>数量积</b>；求面积、法向量、平行判定用<b>向量积</b>；判断共面、求平行六面体体积、求异面直线距离用<b>混合积</b>。真题中常把它们与平面、直线的方程综合考查。</p>'
          }
        ],
        examples: [
          {
            no: '例 4.4', meta: '基础 · 数量积与夹角',
            q: '设 \\( \\vec{a}=(2,-1,1) \\)，\\( \\vec{b}=(1,1,2) \\)，求 \\( \\vec{a}\\cdot\\vec{b} \\)、两向量的夹角 \\( \\theta \\) 及 \\( \\vec{b} \\) 在 \\( \\vec{a} \\) 上的投影。',
            sol: '<p>\\( \\vec{a}\\cdot\\vec{b}=2\\cdot 1+(-1)\\cdot 1+1\\cdot 2=3 \\)。</p>' +
              '<p>\\( |\\vec{a}|=\\sqrt{4+1+1}=\\sqrt{6} \\)，\\( |\\vec{b}|=\\sqrt{1+1+4}=\\sqrt{6} \\)。</p>' +
              '<p>\\( \\cos\\theta=\\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}=\\dfrac{3}{6}=\\dfrac{1}{2} \\)，故 \\( \\theta=\\dfrac{\\pi}{3} \\)。</p>' +
              '<p>投影 \\( \\mathrm{Prj}_{\\vec{a}}\\vec{b}=\\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}|}=\\dfrac{3}{\\sqrt{6}}=\\dfrac{\\sqrt{6}}{2} \\)。</p>'
          },
          {
            no: '例 4.5', meta: '基础 · 向量积求面积',
            q: '已知三点 \\( A(1,2,3) \\)，\\( B(3,2,1) \\)，\\( C(2,3,1) \\)，求 \\( \\triangle ABC \\) 的面积。',
            sol: '<p>\\( \\overrightarrow{AB}=(2,0,-2) \\)，\\( \\overrightarrow{AC}=(1,1,-2) \\)。</p>' +
              '<p>\\( \\overrightarrow{AB}\\times\\overrightarrow{AC}=\\begin{vmatrix}\\vec{i} & \\vec{j} & \\vec{k} \\\\ 2 & 0 & -2 \\\\ 1 & 1 & -2\\end{vmatrix}=(0\\cdot(-2)-(-2)\\cdot 1,\\ (-2)\\cdot 1-2\\cdot(-2),\\ 2\\cdot 1-0\\cdot 1)=(2,2,2) \\)。</p>' +
              '<p>\\( |\\overrightarrow{AB}\\times\\overrightarrow{AC}|=\\sqrt{4+4+4}=2\\sqrt{3} \\)。</p>' +
              '<p>故 \\( S_{\\triangle ABC}=\\dfrac{1}{2}\\cdot 2\\sqrt{3}=\\sqrt{3} \\)。</p>'
          },
          {
            no: '例 4.6', meta: '综合 · 混合积判断共面',
            q: '判断四点 \\( A(1,0,0) \\)，\\( B(0,1,0) \\)，\\( C(0,0,1) \\)，\\( D(1,1,1) \\) 是否共面。',
            sol: '<p>\\( \\overrightarrow{AB}=(-1,1,0) \\)，\\( \\overrightarrow{AC}=(-1,0,1) \\)，\\( \\overrightarrow{AD}=(0,1,1) \\)。</p>' +
              '<p>\\( [\\overrightarrow{AB},\\overrightarrow{AC},\\overrightarrow{AD}]=\\begin{vmatrix}-1 & 1 & 0 \\\\ -1 & 0 & 1 \\\\ 0 & 1 & 1\\end{vmatrix} \\)。</p>' +
              '<p>按第一行展开：\\( -1(0-1)-1(-1-0)+0=-1\\cdot(-1)-1\\cdot(-1)=2\\neq 0 \\)。</p>' +
              '<p>混合积不为 0，故四点不共面。</p>'
          }
        ],
        pitfalls: [
          '数量积的结果是数量，向量积的结果是向量，不能混用；\\( \\vec{a}\\times\\vec{b} \\) 与 \\( \\vec{b}\\times\\vec{a} \\) 方向相反。',
          '\\( \\vec{a}\\cdot\\vec{b}=0 \\) 时可能有零向量参与；判断垂直时通常默认两向量非零。',
          '向量积的坐标公式是行列式，叉乘顺序不能颠倒：\\( \\vec{a}\\times\\vec{b}=(a_yb_z-a_zb_y,\\ a_zb_x-a_xb_z,\\ a_xb_y-a_yb_x) \\)，注意各项的符号。',
          '方向余弦满足平方和为 1，可作为计算检验；方向数只是与方向余弦成比例的数组，本身不是方向余弦。',
          '\\( [\\vec{a},\\vec{b},\\vec{c}]=0 \\) 说明三向量共面（或某向量为零），但不能说明它们两两平行。'
        ]
      },

      /* ---------------- 4.3 ---------------- */
      {
        id: 'ch4-s3', num: '4.3', title: '平面与直线的方程',
        lead: '大纲要求：掌握平面方程和直线方程及其求法，会求平面与平面、平面与直线、直线与直线之间的夹角，会利用它们的相互关系解决有关问题，会求点到直线以及点到平面的距离。',
        blocks: [
          { t: 'h3', idx: '①', text: '平面的方程' },
          { t: 'card', kind: 'def', tag: '定义', title: '平面方程的三类形式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>点法式：</b>\\( A(x-x_0)+B(y-y_0)+C(z-z_0)=0 \\)，其中 \\( \\vec{n}=(A,B,C) \\) 为平面的<b>法向量</b>，过点 \\( (x_0,y_0,z_0) \\)</div>' +
            '<div class="fml-row"><b>一般式：</b>\\( Ax+By+Cz+D=0 \\)，法向量 \\( \\vec{n}=(A,B,C) \\)；法向量不唯一，与 \\( \\vec{n} \\) 平行的任何非零向量都行</div>' +
            '<div class="fml-row"><b>截距式：</b>\\( \\dfrac{x}{a}+\\dfrac{y}{b}+\\dfrac{z}{c}=1\\ (abc\\neq 0) \\)，在三个坐标轴上的截距分别为 \\( a,b,c \\)</div>' +
            '</div>'
          },
          { t: 'list', items: [
            '<b>已知一点与法向量：</b>直接写点法式；',
            '<b>已知三点：</b>求两向量作向量积得法向量，再写点法式；',
            '<b>已知两向量平行于平面：</b>两向量叉乘得法向量；',
            '<b>过直线外一点且平行于已知平面：</b>法向量取已知平面的法向量。'
          ]},
          { t: 'viz', build: 'planeLine', title: '平面与直线的空间位置', sub: '切换平面/直线方程，观察法向量、方向向量与交点' },
          { t: 'h3', idx: '②', text: '直线的方程' },
          { t: 'card', kind: 'def', tag: '定义', title: '直线方程的三类形式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>点向式：</b>\\( \\dfrac{x-x_0}{l}=\\dfrac{y-y_0}{m}=\\dfrac{z-z_0}{n} \\)，其中 \\( \\vec{s}=(l,m,n) \\) 为直线的<b>方向向量</b>（分母为 0 时分子也须为 0）</div>' +
            '<div class="fml-row"><b>参数式：</b>\\( x=x_0+lt,\\quad y=y_0+mt,\\quad z=z_0+nt\\quad(t\\in\\mathbb{R}) \\)</div>' +
            '<div class="fml-row"><b>一般式：</b>\\( \\begin{cases}A_1x+B_1y+C_1z+D_1=0 \\\\ A_2x+B_2y+C_2z+D_2=0\\end{cases} \\)（两平面交线），方向向量 \\( \\vec{s}=\\vec{n}_1\\times\\vec{n}_2 \\)</div>' +
            '</div>' +
            '<p class="tight"><b>两点式：</b>过 \\( M_1,M_2 \\) 的直线方向向量取 \\( \\overrightarrow{M_1M_2} \\)，再写点向式。</p>'
          },
          { t: 'h3', idx: '③', text: '夹角、平行与垂直条件' },
          { t: 'table', head: ['位置关系', '夹角公式', '平行条件', '垂直条件'], rows: [
            ['平面 \\( \\pi_1 \\) 与 \\( \\pi_2 \\)（法向量 \\( \\vec{n}_1,\\vec{n}_2 \\)）', '\\( \\cos\\theta=\\dfrac{|\\vec{n}_1\\cdot\\vec{n}_2|}{|\\vec{n}_1||\\vec{n}_2|} \\)', '\\( \\vec{n}_1\\times\\vec{n}_2=\\vec{0} \\)（法向量平行）', '\\( \\vec{n}_1\\cdot\\vec{n}_2=0 \\)'],
            ['直线 \\( L_1 \\) 与 \\( L_2 \\)（方向向量 \\( \\vec{s}_1,\\vec{s}_2 \\)）', '\\( \\cos\\theta=\\dfrac{|\\vec{s}_1\\cdot\\vec{s}_2|}{|\\vec{s}_1||\\vec{s}_2|} \\)', '\\( \\vec{s}_1\\times\\vec{s}_2=\\vec{0} \\)', '\\( \\vec{s}_1\\cdot\\vec{s}_2=0 \\)'],
            ['直线 \\( L \\) 与平面 \\( \\pi \\)（\\( \\vec{s},\\vec{n} \\)）', '\\( \\sin\\varphi=\\dfrac{|\\vec{s}\\cdot\\vec{n}|}{|\\vec{s}||\\vec{n}|} \\)', '\\( \\vec{s}\\cdot\\vec{n}=0 \\)（且直线不在平面内时平行）', '\\( \\vec{s}\\times\\vec{n}=\\vec{0} \\)']
          ]},
          { t: 'card', kind: 'key', tag: '必记', title: '距离公式', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>点到平面：</b>\\( d=\\dfrac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^{2}+B^{2}+C^{2}}} \\)</div>' +
            '<div class="fml-row"><b>点到直线（\\( M_1 \\) 在直线上，方向向量 \\( \\vec{s} \\)）：</b>\\( d=\\dfrac{|\\overrightarrow{M_0M_1}\\times\\vec{s}|}{|\\vec{s}|} \\)</div>' +
            '<div class="fml-row"><b>两平行平面（法向量相同）：</b>\\( d=\\dfrac{|D_1-D_2|}{\\sqrt{A^{2}+B^{2}+C^{2}}} \\)</div>' +
            '<div class="fml-row"><b>异面直线（\\( M_1\\in L_1,M_2\\in L_2 \\)）：</b>\\( d=\\dfrac{|\\overrightarrow{M_1M_2}\\cdot(\\vec{s}_1\\times\\vec{s}_2)|}{|\\vec{s}_1\\times\\vec{s}_2|} \\)</div>' +
            '</div>'
          },
          { t: 'h3', idx: '④', text: '常见综合问题' },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '解题套路速查', html:
            '<ul class="none">' +
            '<li><b>求交点：</b>把直线参数式代入平面方程，解出 \\( t \\) 再回代；</li>' +
            '<li><b>求投影点/对称点：</b>过点作已知平面（或直线）的垂线，求垂足，再用中点公式求对称点；</li>' +
            '<li><b>已知直线与平面平行：</b>方向向量与法向量点积为 0；</li>' +
            '<li><b>直线在平面内：</b>方向向量与法向量垂直，且直线上一点满足平面方程；</li>' +
            '<li><b>求公垂线：</b>方向向量取 \\( \\vec{s}_1\\times\\vec{s}_2 \\)，再与两直线分别联立求交点。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 4.7', meta: '基础 · 三点求平面方程',
            q: '求过三点 \\( A(1,0,0) \\)，\\( B(0,1,0) \\)，\\( C(0,0,1) \\) 的平面方程。',
            sol: '<p>\\( \\overrightarrow{AB}=(-1,1,0) \\)，\\( \\overrightarrow{AC}=(-1,0,1) \\)。</p>' +
              '<p>法向量 \\( \\vec{n}=\\overrightarrow{AB}\\times\\overrightarrow{AC}=\\begin{vmatrix}\\vec{i} & \\vec{j} & \\vec{k} \\\\ -1 & 1 & 0 \\\\ -1 & 0 & 1\\end{vmatrix}=(1,1,1) \\)。</p>' +
              '<p>由点法式：\\( 1\\cdot(x-1)+1\\cdot(y-0)+1\\cdot(z-0)=0 \\)，即 \\( x+y+z=1 \\)。</p>'
          },
          {
            no: '例 4.8', meta: '综合 · 直线与平面的交点',
            q: '求过点 \\( P(1,-2,3) \\) 且垂直于平面 \\( \\pi:3x-2y+z=5 \\) 的直线方程，并求该直线与平面 \\( \\pi \\) 的交点。',
            sol: '<p>直线垂直于平面，故方向向量取平面法向量 \\( \\vec{s}=\\vec{n}=(3,-2,1) \\)，直线方程为 \\( \\dfrac{x-1}{3}=\\dfrac{y+2}{-2}=\\dfrac{z-3}{1} \\)。</p>' +
              '<p>写参数式：\\( x=1+3t,\\ y=-2-2t,\\ z=3+t \\)，代入平面方程：</p>' +
              '<p>\\( 3(1+3t)-2(-2-2t)+(3+t)=10+14t=5 \\)，解得 \\( t=-\\dfrac{5}{14} \\)。</p>' +
              '<p>交点坐标为 \\( \\left(-\\dfrac{1}{14},\\ -\\dfrac{9}{7},\\ \\dfrac{37}{14}\\right) \\)。</p>'
          },
          {
            no: '例 4.9', meta: '基础 · 点到平面的距离',
            q: '求点 \\( P(1,1,1) \\) 到平面 \\( x+2y+2z=6 \\) 的距离。',
            sol: '<p>由点到平面距离公式：</p>' +
              '<p>\\( d=\\dfrac{|1+2\\cdot 1+2\\cdot 1-6|}{\\sqrt{1^{2}+2^{2}+2^{2}}}=\\dfrac{|1+2+2-6|}{3}=\\dfrac{1}{3} \\)。</p>'
          },
          {
            no: '例 4.10', meta: '综合 · 点到直线的距离',
            q: '求点 \\( P(1,2,3) \\) 到直线 \\( L:\\ x=y=z \\) 的距离。',
            sol: '<p>取直线上一点 \\( M(0,0,0) \\)，方向向量 \\( \\vec{s}=(1,1,1) \\)，\\( \\overrightarrow{MP}=(1,2,3) \\)。</p>' +
              '<p>\\( \\vec{s}\\times\\overrightarrow{MP}=\\begin{vmatrix}\\vec{i} & \\vec{j} & \\vec{k} \\\\ 1 & 1 & 1 \\\\ 1 & 2 & 3\\end{vmatrix}=(1\\cdot 3-1\\cdot 2,\\ 1\\cdot 1-1\\cdot 3,\\ 1\\cdot 2-1\\cdot 1)=(1,-2,1) \\)。</p>' +
              '<p>\\( d=\\dfrac{|\\vec{s}\\times\\overrightarrow{MP}|}{|\\vec{s}|}=\\dfrac{\\sqrt{1+4+1}}{\\sqrt{3}}=\\dfrac{\\sqrt{6}}{\\sqrt{3}}=\\sqrt{2} \\)。</p>'
          }
        ],
        pitfalls: [
          '平面的法向量与直线的方向向量是两类不同的向量，不能混用；直线的一般式由两平面联立给出，方向向量等于两法向量的叉积。',
          '点向式中分母为 0 时应理解为“对应分子恒为 0”，例如 \\( l=0 \\) 表示 \\( x=x_0 \\)，不能直接写作除以 0。',
          '直线与平面夹角公式用 \\( \\sin\\varphi \\)（不是 \\( \\cos \\)），因为 \\( \\varphi \\) 是直线与平面内投影的夹角；而两平面、两直线的夹角用 \\( \\cos \\)。',
          '判断直线与平面平行时，除了 \\( \\vec{s}\\cdot\\vec{n}=0 \\) 还要确认直线不在平面内；判断直线在平面内则需要方向向量垂直于法向量且直线上一点满足平面方程。',
          '求投影点、对称点时要先作垂线：过点作平面的垂线（法向量作方向向量）或作直线的垂平面（方向向量作法向量），再解交点。'
        ]
      },

      /* ---------------- 4.4 ---------------- */
      {
        id: 'ch4-s4', num: '4.4', title: '曲面与空间曲线',
        lead: '大纲要求：了解曲面方程和空间曲线方程的概念；了解常用二次曲面的方程及其图形，会求简单的柱面和旋转曲面的方程；了解空间曲线的参数方程和一般方程，了解空间曲线在坐标平面上的投影并会求投影曲线的方程。',
        blocks: [
          { t: 'h3', idx: '①', text: '曲面方程的概念与球面' },
          { t: 'card', kind: 'def', tag: '定义', title: '曲面方程', html:
            '<p class="tight">若曲面 \\( S \\) 上的点与三元方程 \\( F(x,y,z)=0 \\) 的解一一对应，则称该方程为曲面 \\( S \\) 的方程，\\( S \\) 为该方程的图形。</p>' +
            '<div class="fml">\\( (x-x_0)^{2}+(y-y_0)^{2}+(z-z_0)^{2}=R^{2} \\)</div>' +
            '<p class="tight">这是以 \\( (x_0,y_0,z_0) \\) 为球心、\\( R \\) 为半径的<b>球面</b>方程；一般形式 \\( x^{2}+y^{2}+z^{2}+Dx+Ey+Fz+G=0 \\) 配方后可判断是否为球面。</p>'
          },
          { t: 'h3', idx: '②', text: '柱面' },
          { t: 'card', kind: 'def', tag: '定义', title: '柱面', html:
            '<p class="tight">平行于定直线 \\( L \\) 的动直线沿定曲线 \\( C \\) 移动所形成的曲面称为<b>柱面</b>；\\( C \\) 称为准线，动直线称为母线。</p>' +
            '<p class="tight"><b>特征：</b>只含两个变量的方程表示母线平行于另一个变量对应坐标轴的柱面：</p>' +
            '<div class="fml">' +
            '<div class="fml-row">\\( F(x,y)=0 \\)：母线平行于 \\( z \\) 轴的柱面；\\( F(y,z)=0 \\)：母线平行于 \\( x \\) 轴；\\( F(x,z)=0 \\)：母线平行于 \\( y \\) 轴。</div>' +
            '</div>' +
            '<p class="tight">例如 \\( x^{2}+y^{2}=R^{2} \\) 为圆柱面，\\( y^{2}=2px \\) 为抛物柱面，\\( \\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}}=1 \\) 为椭圆柱面。</p>'
          },
          { t: 'h3', idx: '③', text: '旋转曲面' },
          { t: 'card', kind: 'key', tag: '必记', title: '旋转曲面的求法', html:
            '<p class="tight">坐标平面上的曲线绕该平面内的一条坐标轴旋转：</p>' +
            '<div class="fml">' +
            '<div class="fml-row"><b>yOz 面曲线 \\( f(y,z)=0 \\) 绕 \\( z \\) 轴：</b>\\( f\\left(\\pm\\sqrt{x^{2}+y^{2}},\\ z\\right)=0 \\)（\\( z \\) 不变，\\( y\\to\\pm\\sqrt{x^{2}+y^{2}} \\)）</div>' +
            '<div class="fml-row"><b>yOz 面曲线 \\( f(y,z)=0 \\) 绕 \\( y \\) 轴：</b>\\( f\\left(y,\\ \\pm\\sqrt{x^{2}+z^{2}}\\right)=0 \\)</div>' +
            '<div class="fml-row"><b>口诀：</b>绕谁转，谁不变；另一个变量写成 \\( \\pm\\sqrt{\\text{另两变量平方和}} \\)，再平方去根号。</div>' +
            '</div>' +
            '<p class="tight">典型例子：\\( xOy \\) 面上的直线 \\( y=x \\) 绕 \\( y \\) 轴旋转得圆锥面 \\( x^{2}+z^{2}=y^{2} \\)；椭圆绕对称轴旋转得旋转椭球面。</p>'
          },
          { t: 'h3', idx: '④', text: '常用的二次曲面' },
          { t: 'table', head: ['名称', '标准方程', '图形特征'], rows: [
            ['椭球面', '\\( \\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}}+\\dfrac{z^{2}}{c^{2}}=1 \\)', '有界封闭曲面，三对对称平面，半轴为 \\( a,b,c \\)'],
            ['椭圆抛物面', '\\( z=\\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}} \\)', '顶点在原点，开口向上的“碗”形（\\( a=b \\) 时为旋转抛物面）'],
            ['双曲抛物面（马鞍面）', '\\( z=\\dfrac{x^{2}}{a^{2}}-\\dfrac{y^{2}}{b^{2}} \\)', '鞍形，一个方向弯曲向上、另一方向向下'],
            ['单叶双曲面', '\\( \\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}}-\\dfrac{z^{2}}{c^{2}}=1 \\)', '“腰身”中间细，绕 \\( z \\) 轴的单叶旋转体形'],
            ['双叶双曲面', '\\( \\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}}-\\dfrac{z^{2}}{c^{2}}=-1 \\)', '分成上下两叶，不连通'],
            ['圆锥面', '\\( \\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{a^{2}}=z^{2} \\)', '以原点为顶点、\\( z \\) 轴为对称轴，由直线旋转而成']
          ]},
          { t: 'viz', build: 'quadricSurfaces', title: '二次曲面与截痕法', sub: '切换椭球面 / 抛物面 / 锥面 / 柱面，旋转三维投影并用水平截平面观察截痕' },
          { t: 'h3', idx: '⑤', text: '空间曲线及其投影' },
          { t: 'card', kind: 'def', tag: '定义', title: '空间曲线的方程', html:
            '<div class="fml">' +
            '<div class="fml-row"><b>参数方程：</b>\\( x=x(t),\\quad y=y(t),\\quad z=z(t)\\quad(\\alpha\\leqslant t\\leqslant\\beta) \\)</div>' +
            '<div class="fml-row"><b>一般方程：</b>\\( \\begin{cases}F(x,y,z)=0 \\\\ G(x,y,z)=0\\end{cases} \\)（两个曲面的交线；不唯一）</div>' +
            '</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '投影曲线方程的求法', html:
            '<p class="tight">求空间曲线 \\( \\Gamma \\) 在 \\( xOy \\) 面上的投影：</p>' +
            '<ol class="clean">' +
            '<li>从曲线的一般方程中消去 \\( z \\)，得到<b>投影柱面</b>方程 \\( H(x,y)=0 \\)；</li>' +
            '<li>投影曲线方程为联立形式 \\( \\begin{cases}H(x,y)=0 \\\\ z=0\\end{cases} \\)。</li>' +
            '</ol>' +
            '<p class="tight">消去 \\( x \\) 得 \\( yOz \\) 面投影，消去 \\( y \\) 得 \\( zOx \\) 面投影。投影柱面是母线平行于对应坐标轴的柱面。</p>'
          },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '投影与截痕', html:
            '<p class="tight">二次曲面的图形可以通过“截痕法”理解：用坐标平面或平行平面去截曲面，观察截线的形状与变化。投影题目的关键是“消元”——消去哪个变量，就在哪个坐标面上投影。</p>'
          }
        ],
        examples: [
          {
            no: '例 4.11', meta: '基础 · 旋转曲面方程',
            q: '求 \\( xOy \\) 平面上的椭圆 \\( \\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}}=1 \\) 分别绕 \\( x \\) 轴、\\( y \\) 轴旋转所得旋转曲面的方程。',
            sol: '<p><b>绕 \\( x \\) 轴：</b>\\( x \\) 不变，\\( y\\to\\pm\\sqrt{y^{2}+z^{2}} \\)，得 \\( \\dfrac{x^{2}}{a^{2}}+\\dfrac{y^{2}+z^{2}}{b^{2}}=1 \\)。</p>' +
              '<p><b>绕 \\( y \\) 轴：</b>\\( y \\) 不变，\\( x\\to\\pm\\sqrt{x^{2}+z^{2}} \\)，得 \\( \\dfrac{x^{2}+z^{2}}{a^{2}}+\\dfrac{y^{2}}{b^{2}}=1 \\)。</p>' +
              '<p>两者都是旋转椭球面。</p>'
          },
          {
            no: '例 4.12', meta: '综合 · 投影曲线方程',
            q: '求球面 \\( x^{2}+y^{2}+z^{2}=1 \\) 与平面 \\( x+y+z=1 \\) 的交线在 \\( xOy \\) 面上的投影曲线方程。',
            sol: '<p>由平面方程得 \\( z=1-x-y \\)，代入球面方程消去 \\( z \\)：</p>' +
              '<p>\\( x^{2}+y^{2}+(1-x-y)^{2}=1 \\)。</p>' +
              '<p>展开整理：\\( x^{2}+y^{2}+1-2x-2y+2xy+x^{2}+y^{2}=1 \\)，即 \\( 2x^{2}+2y^{2}+2xy-2x-2y=0 \\)。</p>' +
              '<p>投影柱面为 \\( x^{2}+y^{2}+xy-x-y=0 \\)，故投影曲线方程为</p>' +
              '<p>\\( \\begin{cases}x^{2}+y^{2}+xy-x-y=0 \\\\ z=0\\end{cases} \\)。</p>'
          },
          {
            no: '例 4.13', meta: '综合 · 识别曲面类型',
            q: '指出下列方程所表示的曲面：\\( (1)\\ x^{2}+y^{2}=4 \\)；\\( (2)\\ z=x^{2}-y^{2} \\)；\\( (3)\\ \\dfrac{x^{2}}{4}+\\dfrac{y^{2}}{9}+\\dfrac{z^{2}}{16}=1 \\)；\\( (4)\\ y=x^{2} \\)。',
            sol: '<p>\\( (1) \\) 缺 \\( z \\)，母线平行于 \\( z \\) 轴，为准线是圆 \\( x^{2}+y^{2}=4 \\) 的<b>圆柱面</b>。</p>' +
              '<p>\\( (2) \\) 三个变量都出现且含平方差，为<b>双曲抛物面</b>（马鞍面）。</p>' +
              '<p>\\( (3) \\) 三个平方项系数同号，为<b>椭球面</b>。</p>' +
              '<p>\\( (4) \\) 缺 \\( z \\)，是母线平行于 \\( z \\) 轴的<b>抛物柱面</b>。</p>'
          },
          {
            no: '例 4.14', meta: '提高 · 由旋转求圆锥面',
            q: '求 \\( yOz \\) 平面上的直线 \\( z=y \\) 绕 \\( z \\) 轴旋转所得曲面的方程。',
            sol: '<p>绕 \\( z \\) 轴旋转时 \\( z \\) 不变，把 \\( y \\) 换成 \\( \\pm\\sqrt{x^{2}+y^{2}} \\)：\\( z=\\pm\\sqrt{x^{2}+y^{2}} \\)。</p>' +
              '<p>两边平方得 \\( z^{2}=x^{2}+y^{2} \\)，即 \\( x^{2}+y^{2}=z^{2} \\)。</p>' +
              '<p>这是以原点为顶点、\\( z \\) 轴为对称轴的<b>圆锥面</b>，半顶角为 \\( \\dfrac{\\pi}{4} \\)。</p>'
          }
        ],
        pitfalls: [
          '“缺一个变量”的方程表示母线平行于缺变量对应坐标轴的柱面，但要注意柱面与旋转曲面的区别：\\( x^{2}+y^{2}=z^{2} \\) 含三个变量，是圆锥面而不是柱面。',
          '旋转曲面中“绕谁转谁不变”，另一个变量替换成 \\( \\pm\\sqrt{\\text{另两变量平方和}} \\)；替换后要消去根号得到二次方程。',
          '投影曲线方程必须写成“投影柱面方程 + 投影平面方程（如 \\( z=0 \\)）”的联立形式，只写一个方程通常表示的是柱面而不是投影曲线。',
          '空间曲线的一般方程不唯一：同一条曲线可由不同的两张曲面联立表示；参数方程的参数取值范围也要写清楚。',
          '二次曲面的名称要按标准方程判断：先看是否有界、平方项符号（同号为椭球/双曲面，含一次项为抛物面），再对应图形特征。'
        ]
      }
    ]
  };
})(window);
