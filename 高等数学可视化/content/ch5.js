/* ============================================================
   ch5.js — 第五章 多元函数微分学
   覆盖 2026 大纲「五、多元函数微分学」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH5 = {
    id: 'ch5', no: '五', title: '多元函数微分学',
    subtitle: '把一元微积分的“局部线性化”搬到平面上：偏导管方向，全微分管近似，梯度指上升最快的方向，拉格朗日乘数法管约束下的最优。',
    tags: ['偏导数', '全微分', '方向导数', '梯度', '切平面', '条件极值'],
    sections: [

      /* ---------------- 5.1 ---------------- */
      {
        id: 'ch5-s1', num: '5.1', title: '多元函数的概念与极限连续',
        lead: '大纲要求：理解多元函数的概念，理解二元函数的几何意义；了解二元函数的极限与连续的概念以及有界闭区域上连续函数的性质。',
        blocks: [
          { t: 'h3', idx: '①', text: '多元函数的概念' },
          { t: 'card', kind: 'def', tag: '定义', title: '二元函数', html:
            String.raw`<p class='tight'>设 \( D \) 是平面 \( xOy \) 上的非空点集，若对 \( D \) 中每一点 \( (x,y) \)，按对应法则 \( f \) 都有唯一确定的实数 \( z \) 与之对应，则称 \( f \) 是定义在 \( D \) 上的<b>二元函数</b>，记作</p>` +
            String.raw`<div class='fml'>\( z=f(x,y),\quad (x,y)\in D \)</div>` +
            `<ul class='none'>` +
            String.raw`<li><b>自变量：</b>\( x,y \)；<b>因变量：</b>\( z \)；<b>定义域：</b>\( D \)；<b>值域：</b>\( f(D)=\{z\mid z=f(x,y),\ (x,y)\in D\} \)；</li>` +
            String.raw`<li><b>推广：</b>二元及以上的函数统称<b>多元函数</b>，如 \( u=f(x,y,z) \)、\( u=f(x_1,x_2,\dots,x_n) \)；</li>` +
            String.raw`<li><b>定义域是平面点集</b>，由解析式有意义的所有 \( (x,y) \) 组成：分母不为零、偶次根式被开方数非负、对数真数为正、\( \arcsin,\arccos \) 的自变量在 \( [-1,1] \) 内。</li>` +
            `</ul>`
          },
          { t: 'p', html: '与一元函数一样，多元函数的两要素是<b>定义域</b>与<b>对应法则</b>；极限、连续、偏导、极值都必须在定义域（或其聚点、内点）上讨论。' },
          { t: 'h3', idx: '②', text: '二元函数的几何意义' },
          { t: 'p', html: String.raw`设 \( z=f(x,y) \) 的定义域为 \( D \)，则点集 \( \{(x,y,z)\mid z=f(x,y),\ (x,y)\in D\} \) 构成空间直角坐标系中的一张<b>曲面</b>，\( D \) 就是它在 \( xOy \) 面上的投影区域。` },
          { t: 'list', items: [
            String.raw`\( z=\sqrt{1-x^{2}-y^{2}} \)：上半单位球面（定义域 \( x^{2}+y^{2}\leqslant 1 \)）；`,
            String.raw`\( z=x^{2}+y^{2} \)：旋转抛物面，开口朝上，是研究极值最常用的模型；`,
            String.raw`\( z=xy \)：双曲抛物面（马鞍面），原点是一个典型的鞍点；`,
            String.raw`\( z=x^{2} \)：抛物柱面（式中不出现 \( y \)，沿 \( y \) 轴方向平移不变）。`
          ]},
          { t: 'viz', build: 'partialDerivative', title: '二元函数的图像与截线', sub: '拖动 x、y 观察曲面上的点、两条截线的切线斜率与切平面' },
          { t: 'h3', idx: '③', text: '二元函数的极限' },
          { t: 'card', kind: 'def', tag: '定义', title: '二重极限', html:
            String.raw`<p class='tight'>设函数 \( f(x,y) \) 在点 \( P_0(x_0,y_0) \) 的某去心邻域内有定义，若存在常数 \( A \)，使得对任意给定的 \( \varepsilon\gt 0 \)，总存在 \( \delta\gt 0 \)，当 \( 0\lt \sqrt{(x-x_0)^{2}+(y-y_0)^{2}}\lt \delta \) 时恒有 \( |f(x,y)-A|\lt \varepsilon \)，则称当 \( (x,y)\to(x_0,y_0) \) 时 \( f \) 的<b>二重极限</b>为 \( A \)：</p>` +
            String.raw`<div class='fml'>\( \lim\limits_{(x,y)\to(x_0,y_0)}f(x,y)=A \)</div>` +
            String.raw`<p class='tight'>记 \( \rho=\sqrt{(x-x_0)^{2}+(y-y_0)^{2}} \)，等价说法：\( \rho\to 0 \) 时 \( f\to A \)，且该极限与 \( (x,y) \) 趋近 \( P_0 \) 的<b>方向、路径无关</b>。</p>`
          },
          { t: 'card', kind: 'key', tag: '必记', title: '二重极限的判定方法', html:
            `<ul class='none'>` +
            String.raw`<li><b>夹逼法：</b>若 \( 0\leqslant |f(x,y)-A|\leqslant g(\rho) \) 且 \( \lim\limits_{\rho\to 0}g(\rho)=0 \)，则 \( \lim f=A \)；常用放缩 \( \dfrac{x^{2}}{x^{2}+y^{2}}\leqslant 1,\quad |xy|\leqslant\dfrac{x^{2}+y^{2}}{2} \)；</li>` +
            String.raw`<li><b>极坐标法：</b>令 \( x=x_0+r\cos\theta,\ y=y_0+r\sin\theta \)，若表达式关于 \( \theta \) 一致地趋于 \( A \)，则二重极限为 \( A \)；</li>` +
            String.raw`<li><b>证明不存在：</b>找两条路径使 \( f \) 趋于不同的值，常用 \( y=kx \)、\( y=kx^{2} \)、\( y=0 \) 等；只要两次结果不同，极限就不存在；</li>` +
            String.raw`<li><b>证明存在：</b>必须说明沿<b>任意</b>路径都趋于同一值，只验证有限条路径不够。</li>` +
            `</ul>`
          },
          { t: 'card', kind: 'tip', tag: '辨析', title: '累次极限与二重极限', html:
            String.raw`<p class='tight'>\( \lim\limits_{x\to x_0}\lim\limits_{y\to y_0}f(x,y) \) 与 \( \lim\limits_{y\to y_0}\lim\limits_{x\to x_0}f(x,y) \) 称为<b>累次极限</b>，它与二重极限是两种不同的极限过程：</p>` +
            `<ul class='none'>` +
            String.raw`<li>两个累次极限存在且相等，二重极限仍可能不存在（如 \( f=\dfrac{xy}{x^{2}+y^{2}} \) 在原点两个累次极限均为 0，但二重极限不存在）；</li>` +
            String.raw`<li>二重极限存在时，若某个累次极限也存在，则两者必相等（可用于求二重极限或否定它）。</li>` +
            `</ul>`
          },
          { t: 'h3', idx: '④', text: '二元函数的连续与有界闭区域上连续函数的性质' },
          { t: 'card', kind: 'def', tag: '定义', title: '二元函数的连续', html:
            String.raw`<p class='tight'>若 \( \lim\limits_{(x,y)\to(x_0,y_0)}f(x,y)=f(x_0,y_0) \)，则称 \( f \) 在点 \( P_0 \) 连续；\( f \) 在区域 \( D \) 上每一点都连续，则称 \( f \) 在 \( D \) 上连续。</p>` +
            String.raw`<p class='tight'>等价形式：\( \lim\limits_{\rho\to 0}\Delta z=\lim\limits_{\rho\to 0}[f(x_0+\Delta x,y_0+\Delta y)-f(x_0,y_0)]=0 \)。<b>多元初等函数在其定义区域内连续。</b></p>`
          },
          { t: 'card', kind: 'thm', tag: '性质', title: '有界闭区域上连续函数的性质', html:
            String.raw`<p class='tight'>设 \( f(x,y) \) 在有界闭区域 \( D \) 上连续，则：</p>` +
            `<ul class='none'>` +
            String.raw`<li><b>有界性：</b>\( f \) 在 \( D \) 上有界；</li>` +
            String.raw`<li><b>最值定理：</b>\( f \) 在 \( D \) 上必取得最大值和最小值；</li>` +
            String.raw`<li><b>介值定理：</b>对介于最小值 \( m \) 与最大值 \( M \) 之间的任何数 \( c \)，都存在 \( P\in D \) 使 \( f(P)=c \)；</li>` +
            String.raw`<li><b>一致连续性：</b>对任意 \( \varepsilon\gt 0 \) 存在仅与 \( \varepsilon \) 有关的 \( \delta\gt 0 \)，只要 \( P,Q\in D \) 且距离小于 \( \delta \)，就有 \( |f(P)-f(Q)|\lt \varepsilon \)。</li>` +
            `</ul>`
          }
        ],
        examples: [
          {
            no: '例 5.1', meta: '基础 · 求定义域',
            q: String.raw`求 \( z=\sqrt{4-x^{2}-y^{2}}+\ln(x^{2}+y^{2}-1) \) 的定义域，并指出该点集的几何形状。`,
            sol: String.raw`<p>根式要求 \( 4-x^{2}-y^{2}\geqslant 0 \)，即 \( x^{2}+y^{2}\leqslant 4 \)；对数要求 \( x^{2}+y^{2}-1\gt 0 \)，即 \( x^{2}+y^{2}\gt 1 \)。</p>` +
              String.raw`<p>联立得定义域 \( D=\{(x,y)\mid 1\lt x^{2}+y^{2}\leqslant 4\} \)：以原点为中心的圆环，内半径 1（不含内边界）、外半径 2（含外边界）。</p>` +
              String.raw`<p>\( D \) 是有界区域，但它既不是开区域（含外圆周），也不是闭区域（不含内圆周）。</p>`
          },
          {
            no: '例 5.2', meta: '基础 · 夹逼准则求二重极限',
            q: String.raw`求 \( \lim\limits_{(x,y)\to(0,0)}\dfrac{x^{2}y}{x^{2}+y^{2}} \)。`,
            sol: String.raw`<p>放缩：\( 0\leqslant \left|\dfrac{x^{2}y}{x^{2}+y^{2}}\right|=\dfrac{x^{2}}{x^{2}+y^{2}}\,|y|\leqslant |y| \)。</p>` +
              String.raw`<p>当 \( (x,y)\to(0,0) \) 时 \( |y|\to 0 \)，由夹逼准则得 \( \lim\limits_{(x,y)\to(0,0)}\dfrac{x^{2}y}{x^{2}+y^{2}}=0 \)。</p>` +
              String.raw`<p>（也可用极坐标：原式为 \( r\cos^{2}\theta\sin\theta \)，被 \( r \) 控制，关于 \( \theta \) 一致趋于 0。）</p>`
          },
          {
            no: '例 5.3', meta: '基础 · 证明极限不存在',
            q: String.raw`讨论 \( \lim\limits_{(x,y)\to(0,0)}\dfrac{xy}{x^{2}+y^{2}} \) 是否存在。`,
            sol: String.raw`<p>沿直线 \( y=kx \)（\( x\to 0 \)）：\( f(x,kx)=\dfrac{kx^{2}}{x^{2}(1+k^{2})}=\dfrac{k}{1+k^{2}} \)，与 \( k \) 有关。</p>` +
              String.raw`<p>例如沿 \( y=x \) 得 \( \dfrac{1}{2} \)，沿 \( y=-x \) 得 \( -\dfrac{1}{2} \)，沿 \( y=0 \) 得 0。</p>` +
              String.raw`<p>不同路径的极限不同，故该二重极限不存在。</p>`
          }
        ],
        pitfalls: [
          '求定义域必须把所有约束联立，并区分边界的开闭：偶次根号内可取 0（边界含等号），分母与对数真数不能取 0（边界不含）。',
          '二重极限必须“沿任意路径”趋近，验证若干条路径结果相同不能证明极限存在；用极坐标时必须说明关于 θ 一致地趋于同一值。',
          '累次极限与二重极限互不蕴含，不能随意交换极限次序；但二重极限存在且某累次极限也存在时，两者相等。',
          '多元函数在某点连续不要求也不蕴含偏导数存在；分段函数在分界点的连续性要用定义或路径讨论。'
        ]
      },

      /* ---------------- 5.2 ---------------- */
      {
        id: 'ch5-s2', num: '5.2', title: '偏导数与全微分',
        lead: '大纲要求：理解多元函数偏导数和全微分的概念，会求全微分，了解全微分存在的必要条件和充分条件，了解全微分形式的不变性；掌握一阶、二阶偏导数的计算。',
        blocks: [
          { t: 'h3', idx: '①', text: '偏导数及其几何意义' },
          { t: 'card', kind: 'def', tag: '定义', title: '偏导数', html:
            String.raw`<p class='tight'>设 \( z=f(x,y) \) 在点 \( P_0(x_0,y_0) \) 的某邻域内有定义，固定 \( y=y_0 \)，若极限 \( \lim\limits_{\Delta x\to 0}\dfrac{f(x_0+\Delta x,y_0)-f(x_0,y_0)}{\Delta x} \) 存在，则称它为 \( f \) 在 \( P_0 \) 处对 \( x \) 的<b>偏导数</b>：</p>` +
            String.raw`<div class='fml'>\( f_x(x_0,y_0)=\dfrac{\partial z}{\partial x}\Big|_{(x_0,y_0)}=\lim\limits_{\Delta x\to 0}\dfrac{f(x_0+\Delta x,y_0)-f(x_0,y_0)}{\Delta x} \)</div>` +
            `<ul class='none'>` +
            String.raw`<li><b>几何意义：</b>曲面 \( z=f(x,y) \) 与平面 \( y=y_0 \) 的截曲线在点 \( M_0(x_0,y_0,f(P_0)) \) 处切线的斜率（对 \( x \) 轴正向）；同理 \( f_y \) 是平面 \( x=x_0 \) 的截曲线对 \( y \) 轴正向的斜率；</li>` +
            String.raw`<li><b>求法：</b>对 \( x \) 求偏导时把 \( y \) 看作常数，对 \( y \) 求偏导时把 \( x \) 看作常数，直接用一元函数求导公式；</li>` +
            String.raw`<li><b>记号：</b>\( f_x,\ f_y,\ \dfrac{\partial z}{\partial x},\ \dfrac{\partial z}{\partial y},\ z_x,\ z_y \)。</li>` +
            `</ul>`
          },
          { t: 'card', kind: 'warn', tag: '易错', title: '分界点上的偏导必须用定义', html:
            String.raw`<p class='tight'>分段函数在分界点的偏导数必须按定义计算：\( f_x(x_0,y_0)=\lim\limits_{\Delta x\to 0}\dfrac{f(x_0+\Delta x,y_0)-f(x_0,y_0)}{\Delta x} \)，不能先对表达式求导再代点。</p>`
          },
          { t: 'h3', idx: '②', text: '高阶偏导数与混合偏导数' },
          { t: 'fml', html:
            String.raw`<div class='fml-row'>\( \dfrac{\partial^{2}z}{\partial x^{2}}=\dfrac{\partial}{\partial x}\left(\dfrac{\partial z}{\partial x}\right),\qquad \dfrac{\partial^{2}z}{\partial y^{2}}=\dfrac{\partial}{\partial y}\left(\dfrac{\partial z}{\partial y}\right) \)</div>` +
            String.raw`<div class='fml-row'>\( \dfrac{\partial^{2}z}{\partial x\partial y}=\dfrac{\partial}{\partial y}\left(\dfrac{\partial z}{\partial x}\right),\qquad \dfrac{\partial^{2}z}{\partial y\partial x}=\dfrac{\partial}{\partial x}\left(\dfrac{\partial z}{\partial y}\right) \)</div>`
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '混合偏导数相等的条件', html:
            String.raw`<p class='tight'>若 \( z=f(x,y) \) 在区域 \( D \) 内的两个二阶混合偏导数 \( f_{xy} \) 与 \( f_{yx} \) 都连续，则在 \( D \) 内恒有 \( f_{xy}=f_{yx} \)。初等函数在其定义区域内均满足此条件，计算时可任选其一。</p>`
          },
          { t: 'h3', idx: '③', text: '全微分' },
          { t: 'card', kind: 'def', tag: '定义', title: '全微分与可微', html:
            String.raw`<p class='tight'>设 \( z=f(x,y) \) 在点 \( P_0(x_0,y_0) \) 的某邻域内有定义，若全增量可表示为</p>` +
            String.raw`<div class='fml'>\( \Delta z=f(x_0+\Delta x,y_0+\Delta y)-f(x_0,y_0)=A\Delta x+B\Delta y+o(\rho) \)</div>` +
            String.raw`<p class='tight'>其中 \( A,B \) 只与 \( P_0 \) 有关，\( \rho=\sqrt{(\Delta x)^{2}+(\Delta y)^{2}} \)，则称 \( f \) 在 \( P_0 \) <b>可微</b>，并称 \( A\Delta x+B\Delta y \) 为 \( f \) 在 \( P_0 \) 的<b>全微分</b>，记作 \( \mathrm{d}z \)：</p>` +
            String.raw`<div class='fml'>\( \mathrm{d}z=f_x(x_0,y_0)\,\mathrm{d}x+f_y(x_0,y_0)\,\mathrm{d}y\quad(\Delta x=\mathrm{d}x,\ \Delta y=\mathrm{d}y) \)</div>`
          },
          { t: 'card', kind: 'key', tag: '必记', title: '可微的判别（必要 / 充分 / 充要）', html:
            `<ul class='none'>` +
            String.raw`<li><b>必要条件：</b>可微 \( \Rightarrow \) 偏导存在（且 \( A=f_x(P_0),B=f_y(P_0) \)）；可微 \( \Rightarrow \) 连续；</li>` +
            String.raw`<li><b>充分条件：</b>偏导在 \( P_0 \) 的某邻域内存在且在 \( P_0 \) 连续 \( \Rightarrow \) 可微；</li>` +
            String.raw`<li><b>充要条件（判别式）：</b>\( f \) 在 \( P_0 \) 可微 \( \iff \) 偏导存在且 \( \lim\limits_{\rho\to 0}\dfrac{\Delta z-f_x(P_0)\Delta x-f_y(P_0)\Delta y}{\rho}=0 \)；</li>` +
            String.raw`<li><b>强弱链条：</b>偏导连续 \( \Rightarrow \) 可微 \( \Rightarrow \) 连续，且可微 \( \Rightarrow \) 偏导存在；反向箭头都不成立。</li>` +
            `</ul>`
          },
          { t: 'card', kind: 'key', tag: '必记', title: '全微分形式不变性', html:
            String.raw`<p class='tight'>设 \( z=f(u,v) \) 可微，则无论 \( u,v \) 是自变量还是中间变量（\( u=u(x,y),v=v(x,y) \) 也可微），都有 \( \mathrm{d}z=f_u\,\mathrm{d}u+f_v\,\mathrm{d}v \)。据此“先写 \( \mathrm{d}z \)，再代入 \( \mathrm{d}u,\mathrm{d}v \)”，可一次求出全部偏导。</p>`
          },
          { t: 'table', head: ['关系', '是否成立', '反例 / 说明'], rows: [
            [String.raw`可微 \( \Rightarrow \) 偏导存在`, '成立', String.raw`可微定义中必有 \( A=f_x(P_0),\ B=f_y(P_0) \)`],
            [String.raw`偏导存在 \( \Rightarrow \) 可微`, '不成立', String.raw`\( f=\dfrac{xy}{x^{2}+y^{2}} \)（原点）偏导存在但不可微`],
            [String.raw`可微 \( \Rightarrow \) 连续`, '成立', String.raw`\( \Delta z=f_x\Delta x+f_y\Delta y+o(\rho)\to 0 \)`],
            [String.raw`连续 \( \Rightarrow \) 偏导存在`, '不成立', String.raw`\( f=|x|+|y| \) 在原点连续但偏导不存在`],
            [String.raw`偏导连续 \( \Rightarrow \) 可微`, '成立', '可微的充分条件'],
            [String.raw`可微 \( \Rightarrow \) 偏导连续`, '不成立', String.raw`\( f=(x^{2}+y^{2})\sin\dfrac{1}{x^{2}+y^{2}} \)（原点补充定义 0）可微但偏导在原点不连续`]
          ]},
          { t: 'p', html: String.raw`近似计算：当 \( |\Delta x|,|\Delta y| \) 很小时 \( \Delta z\approx \mathrm{d}z \)，即 \( f(x_0+\Delta x,y_0+\Delta y)\approx f(x_0,y_0)+f_x(P_0)\Delta x+f_y(P_0)\Delta y \)，这是全微分用于近似计算的依据。` },
          { t: 'viz', build: 'partialDerivative', title: '偏导数与全微分的几何意义', sub: '两条截线的切线张成切平面，dz 是 Δz 的线性主部' }
        ],
        examples: [
          {
            no: '例 5.4', meta: '基础 · 求偏导与全微分',
            q: String.raw`设 \( z=x^{y}\ (x\gt 0) \)，求 \( \dfrac{\partial z}{\partial x} \)、\( \dfrac{\partial z}{\partial y} \) 与 \( \mathrm{d}z \)。`,
            sol: String.raw`<p>对 \( x \) 求导（视 \( y \) 为常数）：\( z_x=y x^{y-1} \)。</p>` +
              String.raw`<p>对 \( y \) 求导（视 \( x \) 为常数），先写成 \( z=\mathrm{e}^{y\ln x} \)：\( z_y=x^{y}\ln x \)。</p>` +
              String.raw`<p>故 \( \mathrm{d}z=y x^{y-1}\mathrm{d}x+x^{y}\ln x\,\mathrm{d}y \)。例如 \( z_x(1,2)=2,\ z_y(1,2)=1\cdot\ln 1=0 \)。</p>`
          },
          {
            no: '例 5.5', meta: '基础 · 二阶偏导数',
            q: String.raw`设 \( z=x^{3}y^{2}-3xy^{3} \)，求所有二阶偏导数，并验证 \( z_{xy}=z_{yx} \)。`,
            sol: String.raw`<p>一阶：\( z_x=3x^{2}y^{2}-3y^{3},\qquad z_y=2x^{3}y-9xy^{2} \)。</p>` +
              String.raw`<p>二阶：\( z_{xx}=6xy^{2},\qquad z_{yy}=2x^{3}-18xy \)。</p>` +
              String.raw`<p>混合：\( z_{xy}=6x^{2}y-9y^{2},\qquad z_{yx}=6x^{2}y-9y^{2} \)，两者相等（二阶混合偏导连续）。</p>`
          },
          {
            no: '例 5.6', meta: '综合 · 偏导存在与可微性',
            q: String.raw`设 \( f(x,y)=\begin{cases}\dfrac{xy}{x^{2}+y^{2}},&(x,y)\neq(0,0),\\ 0,&(x,y)=(0,0),\end{cases} \) 求 \( f_x(0,0),f_y(0,0) \)，并判断 \( f \) 在原点是否连续、是否可微。`,
            sol: String.raw`<p>用定义：\( f_x(0,0)=\lim\limits_{\Delta x\to 0}\dfrac{f(\Delta x,0)-f(0,0)}{\Delta x}=\lim\limits_{\Delta x\to 0}\dfrac{0-0}{\Delta x}=0 \)，同理 \( f_y(0,0)=0 \)。</p>` +
              String.raw`<p>沿 \( y=x \) 有 \( f(x,x)=\dfrac{1}{2}\to\dfrac{1}{2}\neq f(0,0)=0 \)，故 \( f \) 在原点不连续。</p>` +
              String.raw`<p>而可微必连续，所以 \( f \) 在原点不可微。这说明“偏导存在”既推不出连续，更推不出可微。</p>`
          },
          {
            no: '例 5.7', meta: '应用 · 全微分作近似计算',
            q: String.raw`利用全微分求 \( (1.04)^{2.02} \) 的近似值。`,
            sol: String.raw`<p>取 \( f(x,y)=x^{y} \)，\( (x_0,y_0)=(1,2) \)：\( f(1,2)=1 \)，\( f_x=y x^{y-1} \) 得 \( f_x(1,2)=2 \)，\( f_y=x^{y}\ln x \) 得 \( f_y(1,2)=0 \)。</p>` +
              String.raw`<p>取 \( \Delta x=0.04,\ \Delta y=0.02 \)，则 \( \Delta z\approx \mathrm{d}z=2\times 0.04+0\times 0.02=0.08 \)。</p>` +
              String.raw`<p>所以 \( (1.04)^{2.02}\approx 1+0.08=1.08 \)。</p>`
          }
        ],
        pitfalls: [
          String.raw`分界点的偏导必须用定义求，先对表达式求导再代点对分段函数往往出错。`,
          String.raw`偏导存在推不出连续、偏导存在推不出可微、可微也推不出偏导连续；判断可微要用充要条件，或验证“偏导连续”这一充分条件。`,
          String.raw`对 \( x^{y} \)、\( \arctan\dfrac{y}{x} \) 这类幂指、商式结构，“把另一个变量看成常数”要贯彻到底。`,
          String.raw`全微分 \( \mathrm{d}z=f_x\,\mathrm{d}x+f_y\,\mathrm{d}y \) 的两个系数必须在同一点取值，不能一处代点、一处保留。`,
          String.raw`混合偏导数相等需要 \( f_{xy},f_{yx} \) 连续这一条件，仅二阶偏导存在时未必相等。`
        ]
      },

      /* ---------------- 5.3 ---------------- */
      {
        id: 'ch5-s3', num: '5.3', title: '复合函数与隐函数求导',
        lead: '大纲要求：掌握多元复合函数一阶、二阶偏导数的求法；了解隐函数存在定理，会求多元隐函数（含由方程组确定的隐函数）的偏导数。',
        blocks: [
          { t: 'h3', idx: '①', text: '多元复合函数的链式法则' },
          { t: 'card', kind: 'key', tag: '必记', title: '链式法则（画变量树）', html:
            `<ul class='none'>` +
            String.raw`<li><b>中间变量是自变量函数：</b>设 \( z=f(u,v) \)，\( u=u(x,y),\ v=v(x,y) \)，则<br>\( \dfrac{\partial z}{\partial x}=\dfrac{\partial f}{\partial u}\dfrac{\partial u}{\partial x}+\dfrac{\partial f}{\partial v}\dfrac{\partial v}{\partial x},\qquad \dfrac{\partial z}{\partial y}=\dfrac{\partial f}{\partial u}\dfrac{\partial u}{\partial y}+\dfrac{\partial f}{\partial v}\dfrac{\partial v}{\partial y} \)；</li>` +
            String.raw`<li><b>全导数：</b>设 \( z=f(u,v,w),\ u=u(t),v=v(t),w=w(t) \)，则 \( \dfrac{\mathrm{d}z}{\mathrm{d}t}=\dfrac{\partial f}{\partial u}\dfrac{\mathrm{d}u}{\mathrm{d}t}+\dfrac{\partial f}{\partial v}\dfrac{\mathrm{d}v}{\mathrm{d}t}+\dfrac{\partial f}{\partial w}\dfrac{\mathrm{d}w}{\mathrm{d}t} \)；</li>` +
            String.raw`<li><b>口诀：</b>画出变量树，从 \( z \) 到自变量 \( x \) 的每条路径各段导数相乘，所有路径的结果相加——有几条路径，公式就有几项；既有中间变量又直接含自变量的混合情形也别漏项。</li>` +
            `</ul>`
          },
          { t: 'viz', build: 'chainRuleTree', title: '链式法则的变量依赖树', sub: '切换 ∂z/∂x 与 ∂z/∂y，逐步播放路径求和：每条路径相乘，所有路径相加' },
          { t: 'card', kind: 'warn', tag: '易错', title: '抽象函数的二阶偏导', html:
            String.raw`<p class='tight'>\( f_1'=\dfrac{\partial f}{\partial u} \)、\( f_2'=\dfrac{\partial f}{\partial v} \) 仍然是 \( u,v \) 的函数，对它们再求导必须继续用链式法则：</p>` +
            String.raw`<div class='fml'>\( \dfrac{\partial}{\partial x}f_1'(u,v)=f_{11}''\dfrac{\partial u}{\partial x}+f_{12}''\dfrac{\partial v}{\partial x},\qquad \dfrac{\partial}{\partial x}f_2'(u,v)=f_{21}''\dfrac{\partial u}{\partial x}+f_{22}''\dfrac{\partial v}{\partial x} \)</div>` +
            String.raw`<p class='tight'>这是抽象复合函数求二阶偏导最容易漏项的地方。</p>`
          },
          { t: 'h3', idx: '②', text: '全微分形式不变性的应用' },
          { t: 'p', html: String.raw`“微分法”求偏导：先对最外层写 \( \mathrm{d}z=f_u\,\mathrm{d}u+f_v\,\mathrm{d}v \)，再代入 \( \mathrm{d}u=u_x\mathrm{d}x+u_y\mathrm{d}y \)、\( \mathrm{d}v=v_x\mathrm{d}x+v_y\mathrm{d}y \)，按 \( \mathrm{d}x,\mathrm{d}y \) 合并同类项，其系数就是相应的偏导数。` },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '先辨变量关系，再动笔求导', html:
            String.raw`<p class='tight'>题目中“\( f \) 具有二阶连续偏导数”意味着 \( f_{12}''=f_{21}'' \)，写答案时把混合项合并；求导后 \( f_1',f_2' \) 应写明在 \( (u,v) \) 处取值，不要丢掉中间变量的复合结构。</p>` },
          { t: 'h3', idx: '③', text: '隐函数求导与隐函数存在定理' },
          { t: 'card', kind: 'thm', tag: '定理', title: '隐函数存在定理（一个方程的情形）', html:
            `<ul class='none'>` +
            String.raw`<li><b>二元方程 \( F(x,y)=0 \)：</b>若 \( F \) 在 \( P_0(x_0,y_0) \) 的某邻域内有连续偏导数，\( F(P_0)=0 \) 且 \( F_y(P_0)\neq 0 \)，则方程在 \( P_0 \) 附近唯一确定可导函数 \( y=y(x) \)，且 \( \dfrac{\mathrm{d}y}{\mathrm{d}x}=-\dfrac{F_x}{F_y} \)；</li>` +
            String.raw`<li><b>三元方程 \( F(x,y,z)=0 \)：</b>若 \( F \) 有连续偏导数，\( F(P_0)=0 \) 且 \( F_z(P_0)\neq 0 \)，则唯一确定 \( z=z(x,y) \)，且 \( \dfrac{\partial z}{\partial x}=-\dfrac{F_x}{F_z},\qquad \dfrac{\partial z}{\partial y}=-\dfrac{F_y}{F_z} \)；</li>` +
            String.raw`<li><b>推导：</b>对 \( F(x,y,z(x,y))\equiv 0 \) 两边分别对 \( x,y \) 求偏导，得 \( F_x+F_z z_x=0,\ F_y+F_z z_y=0 \)。</li>` +
            `</ul>`
          },
          { t: 'card', kind: 'tip', tag: '方法', title: '方程组确定的隐函数', html:
            String.raw`<p class='tight'>由 \( \begin{cases}F(x,y,u,v)=0,\\ G(x,y,u,v)=0\end{cases} \) 确定 \( u=u(x,y),v=v(x,y) \) 时，把 \( x,y \) 看作自变量、\( u,v \) 看作函数，对两个方程分别求偏导，得到关于 \( u_x,v_x \)（或 \( u_y,v_y \)）的<b>线性方程组</b>，解出即可；当雅可比行列式 \( \dfrac{\partial(F,G)}{\partial(u,v)}\neq 0 \) 时方程组的解唯一。</p>`
          }
        ],
        examples: [
          {
            no: '例 5.8', meta: '基础 · 复合函数一阶偏导',
            q: String.raw`设 \( z=f(x^{2}-y^{2},xy) \)，\( f \) 可微，求 \( \dfrac{\partial z}{\partial x} \)、\( \dfrac{\partial z}{\partial y} \)。`,
            sol: String.raw`<p>令 \( u=x^{2}-y^{2},\ v=xy \)，则 \( u_x=2x,\ u_y=-2y,\ v_x=y,\ v_y=x \)。</p>` +
              String.raw`<p>\( \dfrac{\partial z}{\partial x}=f_1'\,u_x+f_2'\,v_x=2x f_1'+y f_2' \)；</p>` +
              String.raw`<p>\( \dfrac{\partial z}{\partial y}=f_1'\,u_y+f_2'\,v_y=-2y f_1'+x f_2' \)（其中 \( f_1',f_2' \) 均在 \( (u,v) \) 处取值）。</p>`
          },
          {
            no: '例 5.9', meta: '综合 · 抽象函数二阶偏导',
            q: String.raw`设 \( z=f(x+y,xy) \)，\( f \) 具有二阶连续偏导数，求 \( z_{xx} \) 与 \( z_{xy} \)。`,
            sol: String.raw`<p>令 \( u=x+y,\ v=xy \)，则 \( z_x=f_1'\cdot 1+f_2'\cdot y=f_1'+y f_2' \)。</p>` +
              String.raw`<p>再对 \( x \) 求导：\( z_{xx}=f_{11}''+y f_{12}''+y(f_{21}''+y f_{22}'')=f_{11}''+2y f_{12}''+y^{2}f_{22}'' \)。</p>` +
              String.raw`<p>对 \( y \) 求导：\( z_{xy}=f_{11}''+x f_{12}''+f_2'+y f_{21}''+xy f_{22}''=f_{11}''+(x+y)f_{12}''+xy f_{22}''+f_2' \)。</p>` +
              String.raw`<p>（利用 \( f_{12}''=f_{21}'' \) 合并了混合项。）</p>`
          },
          {
            no: '例 5.10', meta: '基础 · 隐函数求偏导',
            q: String.raw`设 \( z=z(x,y) \) 由方程 \( z^{3}-3xyz=a^{3} \) 确定，求 \( \dfrac{\partial z}{\partial x} \)、\( \dfrac{\partial z}{\partial y} \)。`,
            sol: String.raw`<p>令 \( F(x,y,z)=z^{3}-3xyz-a^{3} \)，则 \( F_x=-3yz,\ F_y=-3xz,\ F_z=3z^{2}-3xy \)。</p>` +
              String.raw`<p>所以 \( \dfrac{\partial z}{\partial x}=-\dfrac{F_x}{F_z}=\dfrac{yz}{z^{2}-xy},\qquad \dfrac{\partial z}{\partial y}=-\dfrac{F_y}{F_z}=\dfrac{xz}{z^{2}-xy}\quad(z^{2}\neq xy) \)。</p>`
          },
          {
            no: '例 5.11', meta: '综合 · 方程组确定的隐函数',
            q: String.raw`设 \( u=u(x,y),v=v(x,y) \) 由方程组 \( \begin{cases}u+v=x,\\ u^{2}+v^{2}=y\end{cases} \) 确定（\( u\neq v \)），求 \( u_x,v_x,u_y,v_y \)。`,
            sol: String.raw`<p>对 \( x \) 求偏导：\( u_x+v_x=1,\qquad 2uu_x+2vv_x=0 \)。</p>` +
              String.raw`<p>解得 \( u_x=\dfrac{v}{v-u},\qquad v_x=\dfrac{u}{u-v} \)。</p>` +
              String.raw`<p>对 \( y \) 求偏导：\( u_y+v_y=0,\qquad 2uu_y+2vv_y=1 \)。</p>` +
              String.raw`<p>解得 \( u_y=\dfrac{1}{2(u-v)},\qquad v_y=\dfrac{1}{2(v-u)} \)。</p>`
          }
        ],
        pitfalls: [
          String.raw`链式法则要按变量树写全，漏一条路径就漏一项；混合情形（如 \( z=f(x,u(x,y)) \) 时 \( z_x=f_x+f_u u_x \)）尤其容易漏掉直接项。`,
          String.raw`抽象函数 \( f_1',f_2' \) 仍是 \( u,v \) 的函数，求二阶偏导时必须继续用链式法则，不能把它们当常数。`,
          String.raw`隐函数求导公式带负号：\( z_x=-F_x/F_z \)，且使用前要验证 \( F_z\neq 0 \)；用错符号是高频失分点。`,
          String.raw`方程组情形：对同一个自变量求偏导时，两个方程都必须两边求导，再联立解出 \( u_x,v_x \) 等，不能只做一个方程。`,
          String.raw`在具体点求偏导值时应先求导、再代点，并确认该点满足隐函数方程；先代点会丢失求导所需的函数信息。`
        ]
      },

      /* ---------------- 5.4 ---------------- */
      {
        id: 'ch5-s4', num: '5.4', title: '方向导数与梯度',
        lead: '大纲要求：理解方向导数与梯度的概念，并掌握其计算方法。',
        blocks: [
          { t: 'h3', idx: '①', text: '方向导数' },
          { t: 'card', kind: 'def', tag: '定义', title: '方向导数', html:
            String.raw`<p class='tight'>设 \( z=f(x,y) \) 在点 \( P_0(x_0,y_0) \) 的某邻域内有定义，\( \boldsymbol{e}=(\cos\alpha,\cos\beta) \) 是与 \( x \) 轴、\( y \) 轴正向夹角分别为 \( \alpha,\beta \) 的<b>单位向量</b>，若极限</p>` +
            String.raw`<div class='fml'>\( \dfrac{\partial f}{\partial \boldsymbol{e}}\Big|_{P_0}=\lim\limits_{t\to 0^{+}}\dfrac{f(x_0+t\cos\alpha,\ y_0+t\cos\beta)-f(x_0,y_0)}{t} \)</div>` +
            String.raw`<p class='tight'>存在，则称其为 \( f \) 在 \( P_0 \) 沿方向 \( \boldsymbol{e} \) 的<b>方向导数</b>。三元函数 \( u=f(x,y,z) \) 沿单位方向 \( \boldsymbol{e}=(\cos\alpha,\cos\beta,\cos\gamma) \) 的方向导数定义完全类似。</p>`
          },
          { t: 'card', kind: 'key', tag: '必记', title: '方向导数的计算公式', html:
            String.raw`<p class='tight'>若 \( f \) 在 \( P_0 \) <b>可微</b>，则沿任意方向的方向导数都存在，且</p>` +
            `<div class='fml'>` +
            String.raw`<div class='fml-row'><b>二元：</b>\( \dfrac{\partial f}{\partial \boldsymbol{e}}=f_x\cos\alpha+f_y\cos\beta=(f_x,f_y)\cdot\boldsymbol{e} \)</div>` +
            String.raw`<div class='fml-row'><b>三元：</b>\( \dfrac{\partial f}{\partial \boldsymbol{e}}=f_x\cos\alpha+f_y\cos\beta+f_z\cos\gamma=\nabla f\cdot\boldsymbol{e} \)</div>` +
            `</div>` +
            String.raw`<p class='tight'>注意：公式中的 \( \boldsymbol{e} \) 必须是<b>单位向量</b>；若只给出方向向量 \( \boldsymbol{l} \)，须先单位化 \( \boldsymbol{e}=\dfrac{\boldsymbol{l}}{|\boldsymbol{l}|} \)。</p>`
          },
          { t: 'h3', idx: '②', text: '梯度' },
          { t: 'card', kind: 'def', tag: '定义', title: '梯度', html:
            String.raw`<p class='tight'>设 \( f(x,y,z) \) 在点 \( P_0 \) 有连续偏导数，称向量</p>` +
            String.raw`<div class='fml'>\( \operatorname{grad} f(P_0)=\nabla f(P_0)=\left(f_x,\ f_y,\ f_z\right)\big|_{P_0} \)</div>` +
            String.raw`<p class='tight'>为 \( f \) 在 \( P_0 \) 的<b>梯度</b>（二元函数为 \( (f_x,f_y) \)）。梯度是一个<b>向量</b>；方向导数 \( \dfrac{\partial f}{\partial \boldsymbol{e}}=\nabla f\cdot\boldsymbol{e} \) 是一个<b>数</b>。</p>`
          },
          { t: 'h3', idx: '③', text: '梯度与方向导数的关系及应用' },
          { t: 'card', kind: 'key', tag: '必记', title: '梯度的三条核心性质', html:
            `<div class='fml'>` +
            String.raw`<div class='fml-row'>\( \dfrac{\partial f}{\partial \boldsymbol{e}}=\nabla f\cdot\boldsymbol{e}=|\nabla f|\cos\varphi \)，其中 \( \varphi \) 为 \( \nabla f \) 与 \( \boldsymbol{e} \) 的夹角</div>` +
            String.raw`<div class='fml-row'>沿梯度方向方向导数最大：\( \max\limits_{\boldsymbol{e}}\dfrac{\partial f}{\partial \boldsymbol{e}}=|\nabla f| \)；沿负梯度方向最小：\( \min\limits_{\boldsymbol{e}}\dfrac{\partial f}{\partial \boldsymbol{e}}=-|\nabla f| \)</div>` +
            String.raw`<div class='fml-row'>\( \nabla f \) 垂直于等值线 \( f(x,y)=c \)（垂直于等值面 \( f(x,y,z)=c \)）</div>` +
            `</div>`
          },
          { t: 'card', kind: 'tip', tag: '模板', title: '方向导数题的四步走', html:
            String.raw`<p class='tight'>① 求 \( \nabla f(P_0) \)；② 把方向向量单位化得 \( \boldsymbol{e} \)；③ 点乘 \( \nabla f(P_0)\cdot\boldsymbol{e} \) 得方向导数；④ 若问最大（小）方向导数：方向为 \( \pm\nabla f(P_0) \)，值为 \( \pm|\nabla f(P_0)| \)。</p>`
          },
          { t: 'viz', build: 'directionalGradient', title: '方向导数与梯度', sub: '拖动位置与方向角，观察 ∇f·e 随夹角变化，梯度方向即变化最快的方向' }
        ],
        examples: [
          {
            no: '例 5.12', meta: '基础 · 二元函数的方向导数',
            q: String.raw`求 \( f(x,y)=x^{2}+y^{2} \) 在点 \( P_0(1,1) \) 沿方向 \( \boldsymbol{l}=(1,1) \) 的方向导数。`,
            sol: String.raw`<p>\( \nabla f=(2x,2y) \)，\( \nabla f(1,1)=(2,2) \)。</p>` +
              String.raw`<p>方向单位化：\( \boldsymbol{e}=\dfrac{(1,1)}{\sqrt{2}}=\left(\dfrac{1}{\sqrt{2}},\dfrac{1}{\sqrt{2}}\right) \)。</p>` +
              String.raw`<p>故 \( \dfrac{\partial f}{\partial \boldsymbol{e}}=\nabla f(1,1)\cdot\boldsymbol{e}=\dfrac{2}{\sqrt{2}}+\dfrac{2}{\sqrt{2}}=2\sqrt{2} \)。</p>`
          },
          {
            no: '例 5.13', meta: '基础 · 三元函数的方向导数',
            q: String.raw`求 \( u=xy+yz+zx \) 在点 \( P_0(1,2,3) \) 沿方向 \( \boldsymbol{l}=(2,-1,2) \) 的方向导数。`,
            sol: String.raw`<p>\( \nabla u=(y+z,\ x+z,\ x+y) \)，\( \nabla u(1,2,3)=(5,4,3) \)。</p>` +
              String.raw`<p>\( |\boldsymbol{l}|=\sqrt{4+1+4}=3 \)，\( \boldsymbol{e}=\left(\dfrac{2}{3},-\dfrac{1}{3},\dfrac{2}{3}\right) \)。</p>` +
              String.raw`<p>\( \dfrac{\partial u}{\partial \boldsymbol{e}}=\dfrac{5\times 2+4\times(-1)+3\times 2}{3}=\dfrac{12}{3}=4 \)。</p>`
          },
          {
            no: '例 5.14', meta: '综合 · 最大方向导数与等值线',
            q: String.raw`设 \( f(x,y)=x^{2}+2y^{2} \)，求 \( f \) 在点 \( P_0(1,1) \) 处方向导数的最大值与最小值，指出取最大值的方向，并验证梯度垂直于等值线 \( f=3 \) 在 \( P_0 \) 处的切线。`,
            sol: String.raw`<p>\( \nabla f=(2x,4y) \)，\( \nabla f(1,1)=(2,4) \)，\( |\nabla f|=\sqrt{2^{2}+4^{2}}=2\sqrt{5} \)。</p>` +
              String.raw`<p>最大方向导数为 \( 2\sqrt{5} \)，沿单位向量 \( \dfrac{(2,4)}{2\sqrt{5}} \) 的方向；最小方向导数为 \( -2\sqrt{5} \)，沿相反方向。</p>` +
              String.raw`<p>等值线 \( x^{2}+2y^{2}=3 \) 在 \( P_0 \) 处：两边微分得 \( 2x+4y\,y'=0 \)，故切线斜率 \( y'=-\dfrac{x}{2y}=-\dfrac{1}{2} \)，切向量可取 \( \boldsymbol{\tau}=(2,-1) \)。</p>` +
              String.raw`<p>\( \nabla f(1,1)\cdot\boldsymbol{\tau}=2\times 2+4\times(-1)=0 \)，梯度与切线垂直，结论成立。</p>`
          }
        ],
        pitfalls: [
          String.raw`方向导数公式中的方向必须单位化；直接用非单位向量与梯度点乘得到的不是方向导数。`,
          String.raw`方向导数公式 \( f_x\cos\alpha+f_y\cos\beta \) 的前提是函数在该点可微；仅偏导存在不能保证沿任意方向的方向导数都存在。`,
          String.raw`梯度是向量，方向导数是数；最大方向导数是 \( |\nabla f| \)，不要与梯度本身混淆。`,
          String.raw`沿 \( \boldsymbol{e} \) 与沿 \( -\boldsymbol{e} \) 的方向导数一般互为相反数（\( f \) 沿相反方向的变化率相反），不能认为相同。`
        ]
      },

      /* ---------------- 5.5 ---------------- */
      {
        id: 'ch5-s5', num: '5.5', title: '空间曲线的切线与曲面的切平面',
        lead: '大纲要求：了解空间曲线的切线和法平面及曲面的切平面和法线的概念，会求它们的方程；了解二元函数的二阶泰勒公式。',
        blocks: [
          { t: 'h3', idx: '①', text: '空间曲线的切线与法平面' },
          { t: 'card', kind: 'key', tag: '必记', title: '参数式曲线', html:
            String.raw`<p class='tight'>设曲线 \( \Gamma \) 的参数方程为 \( x=\varphi(t),\ y=\psi(t),\ z=\omega(t) \)，在 \( t=t_0 \) 对应的点 \( M_0(x_0,y_0,z_0) \) 处，若三个导数不同时为零，则 <b>切向量</b>为</p>` +
            String.raw`<div class='fml'>\( \boldsymbol{T}=(\varphi'(t_0),\ \psi'(t_0),\ \omega'(t_0)) \)</div>` +
            `<div class='fml'>` +
            String.raw`<div class='fml-row'><b>切线方程：</b>\( \dfrac{x-x_0}{\varphi'(t_0)}=\dfrac{y-y_0}{\psi'(t_0)}=\dfrac{z-z_0}{\omega'(t_0)} \)</div>` +
            String.raw`<div class='fml-row'><b>法平面方程：</b>\( \varphi'(t_0)(x-x_0)+\psi'(t_0)(y-y_0)+\omega'(t_0)(z-z_0)=0 \)</div>` +
            `</div>`
          },
          { t: 'card', kind: 'tip', tag: '方法', title: '一般式曲线（两曲面交线）', html:
            String.raw`<p class='tight'>曲线 \( \Gamma:\begin{cases}F(x,y,z)=0,\\ G(x,y,z)=0\end{cases} \) 在点 \( M_0 \) 处的切向量等于两曲面法向量之积：</p>` +
            String.raw`<div class='fml'>\( \boldsymbol{T}=\boldsymbol{n}_1\times\boldsymbol{n}_2=\nabla F(M_0)\times\nabla G(M_0)=\begin{vmatrix}\boldsymbol{i}&\boldsymbol{j}&\boldsymbol{k}\\ F_x&F_y&F_z\\ G_x&G_y&G_z\end{vmatrix}_{M_0} \)</div>` +
            String.raw`<p class='tight'>求出切向量后，再按参数式曲线的公式写切线方程与法平面方程。</p>`
          },
          { t: 'h3', idx: '②', text: '曲面的切平面与法线' },
          { t: 'card', kind: 'key', tag: '必记', title: '隐式曲面与显式曲面', html:
            `<ul class='none'>` +
            String.raw`<li><b>隐式 \( F(x,y,z)=0 \)：</b>在 \( M_0 \) 处法向量 \( \boldsymbol{n}=\nabla F(M_0) \)，<br>切平面：\( F_x(M_0)(x-x_0)+F_y(M_0)(y-y_0)+F_z(M_0)(z-z_0)=0 \)；<br>法线：\( \dfrac{x-x_0}{F_x(M_0)}=\dfrac{y-y_0}{F_y(M_0)}=\dfrac{z-z_0}{F_z(M_0)} \)；</li>` +
            String.raw`<li><b>显式 \( z=f(x,y) \)：</b>令 \( F=f(x,y)-z \)，得法向量 \( \boldsymbol{n}=(f_x,\ f_y,\ -1) \)（不要漏掉 \( -1 \)），<br>切平面：\( z-z_0=f_x(x_0,y_0)(x-x_0)+f_y(x_0,y_0)(y-y_0) \)；<br>法线：\( \dfrac{x-x_0}{f_x(x_0,y_0)}=\dfrac{y-y_0}{f_y(x_0,y_0)}=\dfrac{z-z_0}{-1} \)。</li>` +
            `</ul>`
          },
          { t: 'viz', build: 'tangentPlane', title: '空间曲线的切线与曲面的切平面', sub: '切换两类问题：拖动参数得到切向量与切线，或拖动切点观察切平面与法向量 (f_x, f_y, −1)' },
          { t: 'card', kind: 'tip', tag: '方法', title: '与已知平面平行的切平面', html:
            String.raw`<p class='tight'>求曲面与已知平面 \( \Pi \)（法向量 \( \boldsymbol{n}_{\Pi} \)）平行的切平面：设切点 \( M_0 \)，由 \( \nabla F(M_0)\parallel\boldsymbol{n}_{\Pi} \)（对应分量成比例）解出切点，再代回曲面方程检验并写切平面；若过已知直线，则用“切平面过该直线”联立。</p>`
          },
          { t: 'h3', idx: '③', text: '二元函数的二阶泰勒公式' },
          { t: 'card', kind: 'thm', tag: '定理', title: '二阶泰勒公式', html:
            String.raw`<p class='tight'>设 \( z=f(x,y) \) 在点 \( P_0(x_0,y_0) \) 的某邻域内有二阶连续偏导数，则对充分小的 \( h,k \)（使 \( P_0+(h,k) \) 落在邻域内）有</p>` +
            String.raw`<div class='fml'>\( f(x_0+h,\ y_0+k)=f(x_0,y_0)+\left(h\dfrac{\partial}{\partial x}+k\dfrac{\partial}{\partial y}\right)f(x_0,y_0)+\dfrac{1}{2!}\left(h\dfrac{\partial}{\partial x}+k\dfrac{\partial}{\partial y}\right)^{2}f(x_0,y_0)+R_2 \)</div>` +
            String.raw`<p class='tight'>其中拉格朗日型余项为</p>` +
            String.raw`<div class='fml'>\( R_2=\dfrac{1}{3!}\left(h\dfrac{\partial}{\partial x}+k\dfrac{\partial}{\partial y}\right)^{3}f(x_0+\theta h,\ y_0+\theta k),\qquad 0\lt \theta\lt 1 \)</div>` +
            String.raw`<p class='tight'>它表明二元函数在一点附近可用“常数 + 一次齐次项 + 二次齐次项”逼近，是一元泰勒公式的推广，也是二元极值充分条件的来源。</p>`
          },
          { t: 'card', kind: 'tip', tag: '记号', title: '算子记号的规定', html:
            String.raw`<p class='tight'>约定 \( \left(h\dfrac{\partial}{\partial x}+k\dfrac{\partial}{\partial y}\right)f=h f_x+k f_y \)，\( \left(h\dfrac{\partial}{\partial x}+k\dfrac{\partial}{\partial y}\right)^{2}f=h^{2}f_{xx}+2hk f_{xy}+k^{2}f_{yy} \)（二阶混合偏导连续）。</p>`
          }
        ],
        examples: [
          {
            no: '例 5.15', meta: '基础 · 参数曲线的切线与法平面',
            q: String.raw`求曲线 \( x=t,\ y=t^{2},\ z=t^{3} \) 在 \( t=1 \) 对应点处的切线方程与法平面方程。`,
            sol: String.raw`<p>切点 \( M_0(1,1,1) \)，切向量 \( \boldsymbol{T}=(1,\ 2t,\ 3t^{2})\big|_{t=1}=(1,2,3) \)。</p>` +
              String.raw`<p>切线：\( \dfrac{x-1}{1}=\dfrac{y-1}{2}=\dfrac{z-1}{3} \)。</p>` +
              String.raw`<p>法平面：\( 1\cdot(x-1)+2(y-1)+3(z-1)=0 \)，即 \( x+2y+3z=6 \)。</p>`
          },
          {
            no: '例 5.16', meta: '综合 · 两曲面交线的切线',
            q: String.raw`求曲线 \( \Gamma:\begin{cases}x^{2}+y^{2}+z^{2}=6,\\ x+y+z=0\end{cases} \) 在点 \( M_0(1,-2,1) \) 处的切线方程。`,
            sol: String.raw`<p>令 \( F=x^{2}+y^{2}+z^{2}-6,\ G=x+y+z \)，则 \( \nabla F=(2x,2y,2z) \)，\( \nabla G=(1,1,1) \)。</p>` +
              String.raw`<p>\( \nabla F(M_0)=(2,-4,2) \)，切向量 \( \boldsymbol{T}=\nabla F(M_0)\times\nabla G(M_0)=(2,-4,2)\times(1,1,1)=(-6,0,6)\parallel(-1,0,1) \)。</p>` +
              String.raw`<p>故切线方程为 \( \dfrac{x-1}{-1}=\dfrac{z-1}{1},\quad y=-2 \)。</p>`
          },
          {
            no: '例 5.17', meta: '基础 · 显式曲面的切平面与法线',
            q: String.raw`求曲面 \( z=x^{2}+y^{2} \) 在点 \( M_0(1,1,2) \) 处的切平面方程与法线方程。`,
            sol: String.raw`<p>\( f_x=2x,\ f_y=2y \)，得 \( f_x(1,1)=2,\ f_y(1,1)=2 \)，法向量 \( \boldsymbol{n}=(2,2,-1) \)。</p>` +
              String.raw`<p>切平面：\( 2(x-1)+2(y-1)-(z-2)=0 \)，即 \( 2x+2y-z=2 \)。</p>` +
              String.raw`<p>法线：\( \dfrac{x-1}{2}=\dfrac{y-1}{2}=\dfrac{z-2}{-1} \)。</p>`
          },
          {
            no: '例 5.18', meta: '综合 · 平行于已知平面的切平面',
            q: String.raw`求椭球面 \( x^{2}+2y^{2}+3z^{2}=21 \) 上平行于平面 \( x+4y+6z=0 \) 的切平面方程。`,
            sol: String.raw`<p>曲面法向量 \( \boldsymbol{n}=(2x,4y,6z) \)，要与已知平面法向量 \( (1,4,6) \) 平行，令 \( (2x,4y,6z)=k(1,4,6) \)，得 \( x=\dfrac{k}{2},\ y=k,\ z=k \)。</p>` +
              String.raw`<p>代入椭球面方程：\( \dfrac{k^{2}}{4}+2k^{2}+3k^{2}=21 \)，即 \( \dfrac{21}{4}k^{2}=21 \)，解得 \( k=\pm 2 \)。</p>` +
              String.raw`<p>切点为 \( (1,2,2) \) 与 \( (-1,-2,-2) \)，相应切平面为 \( x+4y+6z=21 \) 与 \( x+4y+6z=-21 \)。</p>`
          }
        ],
        pitfalls: [
          String.raw`曲线切向量是对参数求导得到的 \( (\varphi',\psi',\omega') \)；当某个导数为 0 时，切线应理解为 \( x-x_0=0 \) 这类形式，不能机械写出分母为零的连等式。`,
          String.raw`曲面 \( z=f(x,y) \) 的法向量是 \( (f_x,f_y,-1) \)，不能漏掉 \( -1 \)，也不要写成 \( (f_x,f_y,1) \)。`,
          String.raw`曲线的“法平面”以切向量为法向量，曲面的“法线”以梯度为方向，两个概念极易混淆。`,
          String.raw`求平行于已知平面的切平面，必须由 \( \nabla F\parallel\boldsymbol{n} \) 联立曲面方程解出切点，不能只算梯度方向。`,
          String.raw`二阶泰勒公式要交代展开点与增量 \( (h,k) \) 的含义，余项中的点 \( (x_0+\theta h,\ y_0+\theta k) \) 位于展开点与目标点的连线上。`
        ]
      },

      /* ---------------- 5.6 ---------------- */
      {
        id: 'ch5-s6', num: '5.6', title: '多元函数极值与条件极值',
        lead: '大纲要求：理解多元函数极值和条件极值的概念，掌握极值存在的必要条件，了解二元函数极值存在的充分条件，会求二元函数的极值，会用拉格朗日乘数法求条件极值，会求简单多元函数的最大值和最小值，并会解决简单的应用问题。',
        blocks: [
          { t: 'h3', idx: '①', text: '无条件极值：必要与充分条件' },
          { t: 'card', kind: 'def', tag: '定义', title: '极值', html:
            String.raw`<p class='tight'>若存在 \( P_0 \) 的某邻域，使对该邻域内一切点 \( P \) 都有 \( f(P)\leqslant f(P_0) \)（或 \( f(P)\geqslant f(P_0) \)），则称 \( f \) 在 \( P_0 \) 取<b>极大值</b>（或极小值），\( P_0 \) 称为极大值点（或极小值点）。极值点必为定义域的<b>内点</b>。</p>`
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '极值存在的必要条件', html:
            String.raw`<p class='tight'>设 \( f \) 在 \( P_0 \) 可微且取极值，则 \( f_x(P_0)=f_y(P_0)=0 \)，即 \( \nabla f(P_0)=\boldsymbol{0} \)；满足此条件的点称为<b>驻点</b>。可微的极值点必是驻点，但驻点不一定是极值点（如 \( z=xy \) 在原点）。</p>`
          },
          { t: 'card', kind: 'thm', tag: '定理', title: '极值存在的充分条件（AC−B² 判别法）', html:
            String.raw`<p class='tight'>设 \( f \) 在驻点 \( P_0 \) 的某邻域内有二阶连续偏导数，记</p>` +
            String.raw`<div class='fml'>\( A=f_{xx}(P_0),\qquad B=f_{xy}(P_0),\qquad C=f_{yy}(P_0) \)</div>` +
            `<ul class='none'>` +
            String.raw`<li>\( AC-B^{2}\gt 0 \)：\( P_0 \) 为极值点；其中 \( A\lt 0 \) 时取极大值，\( A\gt 0 \) 时取极小值；</li>` +
            String.raw`<li>\( AC-B^{2}\lt 0 \)：\( P_0 \) 不是极值点（鞍点）；</li>` +
            String.raw`<li>\( AC-B^{2}=0 \)：判别法失效，需用定义或泰勒公式另行判断。</li>` +
            `</ul>` +
            String.raw`<p class='tight'>由二阶泰勒公式，\( \Delta f\approx \dfrac{1}{2}(A h^{2}+2B hk+C k^{2}) \)，其符号由二次型 \( A h^{2}+2Bhk+Ck^{2} \) 的定性决定，这正是判别法的来源。</p>`
          },
          { t: 'h3', idx: '②', text: '条件极值与拉格朗日乘数法' },
          { t: 'card', kind: 'key', tag: '必记', title: '拉格朗日乘数法（一个约束）', html:
            String.raw`<p class='tight'>求目标函数 \( z=f(x,y) \) 在约束条件 \( \varphi(x,y)=0 \) 下的极值，构造<b>拉格朗日函数</b></p>` +
            String.raw`<div class='fml'>\( L(x,y,\lambda)=f(x,y)+\lambda\,\varphi(x,y) \)</div>` +
            String.raw`<p class='tight'>解方程组 \( \begin{cases}L_x=f_x+\lambda\varphi_x=0,\\ L_y=f_y+\lambda\varphi_y=0,\\ L_\lambda=\varphi(x,y)=0,\end{cases} \) 得到可能的极值点，再结合实际意义或二阶信息判定。</p>` +
            String.raw`<p class='tight'><b>几何解释：</b>条件极值点处目标函数的等值线与约束曲线相切，即 \( \nabla f=\lambda\nabla\varphi \)（两梯度平行）。</p>`
          },
          { t: 'card', kind: 'tip', tag: '推广', title: '多个约束与三元目标', html:
            String.raw`<p class='tight'>两个约束 \( \varphi=0,\ \psi=0 \)：令 \( L=f+\lambda\varphi+\mu\psi \)，对 \( x,y,z,\lambda,\mu \) 求偏导令零；三元目标 \( u=f(x,y,z) \) 与一个约束 \( \varphi(x,y,z)=0 \) 同理。</p>`
          },
          { t: 'h3', idx: '③', text: '最大值、最小值及其简单应用' },
          { t: 'card', kind: 'exam', tag: '真题视角', title: '有界闭区域上求最值的三步', html:
            String.raw`<p class='tight'>① 求 \( D \) <b>内部</b>的驻点（含偏导不存在的点）并计算函数值；② 求 <b>边界</b>上的最值（把边界方程代入化为一元函数，或用拉格朗日乘数法）；③ 比较全部候选值，最大者为最大值、最小者为最小值。应用题中若由实际背景知最值必在内部取得、且驻点唯一，则该驻点即为所求。</p>`
          },
          { t: 'viz', build: 'lagrange', title: '条件极值与拉格朗日乘数法', sub: '拖动约束圆半径，观察等值线与约束相切处取得条件极值 ∇f = λ∇g' }
        ],
        examples: [
          {
            no: '例 5.19', meta: '综合 · 求二元函数的极值',
            q: String.raw`求 \( f(x,y)=x^{3}-y^{3}+3x^{2}+3y^{2}-9x \) 的极值。`,
            sol: String.raw`<p>求偏导：\( f_x=3x^{2}+6x-9=3(x+3)(x-1) \)，\( f_y=-3y^{2}+6y=-3y(y-2) \)。</p>` +
              String.raw`<p>驻点有四个：\( (-3,0),\ (1,0),\ (-3,2),\ (1,2) \)。</p>` +
              String.raw`<p>\( A=f_{xx}=6x+6,\ B=f_{xy}=0,\ C=f_{yy}=-6y+6 \)，故 \( AC-B^{2}=36(x+1)(1-y) \)。</p>` +
              String.raw`<p>\( (-3,0) \)：\( AC-B^{2}=36\times(-2)\times 1\lt 0 \)，非极值；\( (1,2) \)：\( 36\times 2\times(-1)\lt 0 \)，非极值。</p>` +
              String.raw`<p>\( (1,0) \)：\( AC-B^{2}=72\gt 0 \) 且 \( A=12\gt 0 \)，取极小值 \( f(1,0)=-5 \)。</p>` +
              String.raw`<p>\( (-3,2) \)：\( AC-B^{2}=72\gt 0 \) 且 \( A=-12\lt 0 \)，取极大值 \( f(-3,2)=31 \)。</p>`
          },
          {
            no: '例 5.20', meta: '基础 · 拉格朗日乘数法',
            q: String.raw`求函数 \( f(x,y)=x+2y \) 在圆 \( x^{2}+y^{2}=5 \) 上的最大值与最小值。`,
            sol: String.raw`<p>令 \( L=x+2y+\lambda(x^{2}+y^{2}-5) \)，解 \( \begin{cases}L_x=1+2\lambda x=0,\\ L_y=2+2\lambda y=0,\\ x^{2}+y^{2}=5;\end{cases} \)</p>` +
              String.raw`<p>由前两式消去 \( \lambda \)：\( x=\dfrac{y}{2} \)，即 \( y=2x \)。</p>` +
              String.raw`<p>代入约束：\( x^{2}+4x^{2}=5 \)，得 \( x=\pm 1 \)，候选点为 \( (1,2) \) 与 \( (-1,-2) \)。</p>` +
              String.raw`<p>\( f(1,2)=5 \)，\( f(-1,-2)=-5 \)，故最大值为 5，最小值为 \( -5 \)。</p>`
          },
          {
            no: '例 5.21', meta: '应用 · 空间中的最值问题',
            q: String.raw`求表面积为 \( a^{2} \) 而体积最大的长方体的体积。`,
            sol: String.raw`<p>设长方体三棱长为 \( x,y,z\gt 0 \)，约束 \( 2(xy+yz+zx)=a^{2} \)，目标 \( V=xyz \)。</p>` +
              String.raw`<p>令 \( L=xyz+\lambda\left(xy+yz+zx-\dfrac{a^{2}}{2}\right) \)，令偏导为零得 \( \begin{cases}yz+\lambda(y+z)=0,\\ xz+\lambda(x+z)=0,\\ xy+\lambda(x+y)=0.\end{cases} \)</p>` +
              String.raw`<p>把三式分别乘 \( x,y,z \) 后相减，得 \( \lambda z(x-y)=0,\ \lambda x(y-z)=0,\ \lambda y(z-x)=0 \)。由 \( x,y,z\gt 0 \) 及 \( \lambda\neq 0 \) 推出 \( x=y=z \)。</p>` +
              String.raw`<p>代入约束：\( 6x^{2}=a^{2} \)，得 \( x=\dfrac{a}{\sqrt{6}} \)。</p>` +
              String.raw`<p>由实际意义最大值存在且驻点唯一，故 \( V_{\max}=x^{3}=\dfrac{a^{3}}{6\sqrt{6}}=\dfrac{\sqrt{6}}{36}a^{3} \)，此时长方体为棱长 \( \dfrac{a}{\sqrt{6}} \) 的正方体。</p>`
          }
        ],
        pitfalls: [
          String.raw`驻点不一定是极值点：\( z=xy \) 在 \( (0,0) \) 是驻点但非极值点（\( AC-B^{2}\lt 0 \)）。`,
          String.raw`极值也可能在偏导不存在的点取得（如 \( z=\sqrt{x^{2}+y^{2}} \) 在原点取极小值），求极值时要单独检查这类点。`,
          String.raw`\( AC-B^{2}=0 \) 时判别法失效，不能下“非极值”的结论，需用定义或泰勒公式判断。`,
          String.raw`条件极值不能一律把约束代入目标化为无条件极值（除非能解出显式关系且不遗漏端点）；拉格朗日乘数法得到的只是可能的极值点，最后要结合问题判定。`,
          String.raw`求有界闭区域上的最值不能只算内部驻点，必须把驻点值与边界上的最值一起比较；边界常化归为条件极值或一元函数最值。`,
          String.raw`乘子 \( \lambda \) 不必求出具体值，但方程组要成组解出候选点；约束方程退化（如 \( \nabla\varphi=\boldsymbol{0} \)）的点需要另行讨论。`
        ]
      }
    ]
  };
})(window);
