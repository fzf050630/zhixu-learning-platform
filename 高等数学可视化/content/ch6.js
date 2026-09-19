/* ============================================================
   ch6.js — 第六章 多元函数积分学
   覆盖 2026 大纲「六、多元函数积分学」全部考试内容与考试要求
   ============================================================ */
(function (global) {
  'use strict';
  global.CH6 = {
    id: 'ch6', no: '六', title: '多元函数积分学',
    subtitle: '从二重、三重积分到曲线、曲面积分，格林、高斯、斯托克斯三大公式把不同类型的积分统一起来。',
    tags: ['二重积分', '三重积分', '曲线积分', '曲面积分', '格林公式', '高斯公式', '斯托克斯公式', '散度', '旋度'],
    sections: [

      /* ---------------- 6.1 ---------------- */
      {
        id: 'ch6-s1', num: '6.1', title: '二重积分与三重积分',
        lead: '大纲要求：理解重积分概念与性质，掌握二重积分的直角坐标与极坐标计算，会计算三重积分（直角、柱面、球面坐标）。',
        blocks: [
          { t: 'h3', idx: '①', text: '二重积分的概念与性质' },
          { t: 'card', kind: 'def', tag: '定义', title: '二重积分', html:
            '<p class="tight">设 \\( f(x,y) \\) 在有界闭区域 \\( D \\) 上有界。分割、取点、作和、取极限，若极限存在且与分法无关，则称此极限为 \\( f \\) 在 \\( D \\) 上的二重积分：</p>' +
            '<div class="fml">\\( \\iint\\limits_D f(x,y)\\,\\mathrm{d}\\sigma=\\lim\\limits_{\\lambda\\to 0}\\sum\\limits_{i=1}^{n}f(\\xi_i,\\eta_i)\\Delta\\sigma_i \\)</div>' +
            '<p class="tight">当 \\( f\\geqslant 0 \\) 时，其几何意义为曲顶柱体的体积。</p>'
          },
          { t: 'table', head: ['性质', '表达式'], rows: [
            ['线性性', '\\( \\iint_D(\\alpha f+\\beta g)\\,\\mathrm{d}\\sigma=\\alpha\\iint_D f+\\beta\\iint_D g \\)'],
            ['区域可加性', '\\( D=D_1\\cup D_2 \\)（无公共内点）⇒ 积分可拆'],
            ['保号性', '\\( f\\leqslant g \\) ⇒ \\( \\iint_D f\\leqslant\\iint_D g \\)'],
            ['估值定理', '\\( mA\\leqslant\\iint_D f\\leqslant MA \\)（\\( m,M \\) 为最值，\\( A \\) 为面积）'],
            ['中值定理', '\\( \\iint_D f=f(\\xi,\\eta)\\cdot A \\)（\\( f \\) 连续）']
          ]},
          { t: 'viz', build: 'doubleIntegral', title: '二重积分的黎曼和与坐标变换', sub: '调节分割数与坐标系，观察逼近过程' },
          { t: 'h3', idx: '②', text: '二重积分的计算' },
          { t: 'fml', html:
            '<div class="fml-row"><b>X 型区域</b>（先 y 后 x）：\\( \\iint\\limits_D f\\,\\mathrm{d}\\sigma=\\int_a^b\\!\\mathrm{d}x\\int_{y_1(x)}^{y_2(x)}f(x,y)\\,\\mathrm{d}y \\)</div>' +
            '<div class="fml-row"><b>Y 型区域</b>（先 x 后 y）：\\( \\iint\\limits_D f\\,\\mathrm{d}\\sigma=\\int_c^d\\!\\mathrm{d}y\\int_{x_1(y)}^{x_2(y)}f(x,y)\\,\\mathrm{d}x \\)</div>' +
            '<div class="fml-row"><b>极坐标</b>：\\( \\iint\\limits_D f\\,\\mathrm{d}\\sigma=\\int_{\\alpha}^{\\beta}\\!\\mathrm{d}\\theta\\int_{r_1(\\theta)}^{r_2(\\theta)}f(r\\cos\\theta,r\\sin\\theta)\\,r\\,\\mathrm{d}r \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '选择积分次序与坐标', html:
            '<ul class="none">' +
            '<li>被积函数含 \\( x^2+y^2 \\)、区域为圆/扇形/圆环 → 用<b>极坐标</b>，别忘了因子 \\( r \\)；</li>' +
            '<li>先积哪个变量，要看“穿过区域时另一变量的上下界是否好写”；</li>' +
            '<li>交换积分次序常能把积不出的内层积分变可积。</li>' +
            '</ul>'
          },
          { t: 'h3', idx: '③', text: '三重积分' },
          { t: 'fml', html:
            '<div class="fml-row"><b>直角坐标</b>（投影法）：\\( \\iiint\\limits_\\Omega f\\,\\mathrm{d}V=\\iint\\limits_{D_{xy}}\\!\\mathrm{d}\\sigma\\int_{z_1(x,y)}^{z_2(x,y)}f\\,\\mathrm{d}z \\)</div>' +
            '<div class="fml-row"><b>直角坐标</b>（截面法）：\\( \\iiint\\limits_\\Omega f\\,\\mathrm{d}V=\\int_{c}^{d}\\!\\mathrm{d}z\\iint\\limits_{D_z}f\\,\\mathrm{d}\\sigma \\)</div>' +
            '<div class="fml-row"><b>柱面坐标</b>：\\( \\mathrm{d}V=r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta\\,\\mathrm{d}z \\)</div>' +
            '<div class="fml-row"><b>球面坐标</b>：\\( \\mathrm{d}V=\\rho^2\\sin\\varphi\\,\\mathrm{d}\\rho\\,\\mathrm{d}\\varphi\\,\\mathrm{d}\\theta \\)</div>'
          },
          { t: 'viz', build: 'tripleIntegral', title: '三重积分的三种坐标', sub: '直角 / 柱面 / 球面坐标的体积元' },
          { t: 'table', head: ['区域特征', '推荐坐标', '体积元'], rows: [
            ['长方体、可分离', '直角坐标', '\\( \\mathrm{d}x\\,\\mathrm{d}y\\,\\mathrm{d}z \\)'],
            ['圆柱、圆锥、旋转体', '柱面坐标', '\\( r\\,\\mathrm{d}r\\,\\mathrm{d}\\theta\\,\\mathrm{d}z \\)'],
            ['球体、球壳、球对称', '球面坐标', '\\( \\rho^2\\sin\\varphi\\,\\mathrm{d}\\rho\\,\\mathrm{d}\\varphi\\,\\mathrm{d}\\theta \\)']
          ]}
        ],
        examples: [
          {
            no: '例 6.1', meta: '二重积分',
            q: '计算 \\( \\iint\\limits_D(x^2+y^2)\\,\\mathrm{d}\\sigma \\)，其中 \\( D: x^2+y^2\\leqslant 1 \\)。',
            sol: '<p>用极坐标：\\( \\int_0^{2\\pi}\\!\\mathrm{d}\\theta\\int_0^1 r^2\\cdot r\\,\\mathrm{d}r=2\\pi\\cdot\\dfrac14=\\dfrac{\\pi}{2} \\)。</p>'
          },
          {
            no: '例 6.2', meta: '三重积分',
            q: '计算 \\( \\iiint\\limits_\\Omega z\\,\\mathrm{d}V \\)，其中 \\( \\Omega \\) 为 \\( x^2+y^2\\leqslant z\\leqslant 1 \\) 所围区域。',
            sol: '<p>用截面法：在高度 \\( z \\) 处截面为圆 \\( D_z: x^2+y^2\\leqslant z \\)，面积 \\( \\pi z \\)。</p>' +
              '<p>\\( \\int_0^1 z\\cdot\\pi z\\,\\mathrm{d}z=\\pi\\int_0^1 z^2\\,\\mathrm{d}z=\\dfrac{\\pi}{3} \\)。</p>'
          }
        ],
        pitfalls: [
          '极坐标变换一定要乘雅可比因子 \\( r \\)，这是最高频的丢分点。',
          '三重积分的投影法要求“穿线法”上下界写正确，先确定投影区域再写 z 的界。',
          '被积函数为 1 时积分就是区域面积/体积，可用于检验。'
        ]
      },

      /* ---------------- 6.2 ---------------- */
      {
        id: 'ch6-s2', num: '6.2', title: '两类曲线积分',
        lead: '大纲要求：理解两类曲线积分概念、性质及关系，掌握计算两类曲线积分的方法。',
        blocks: [
          { t: 'h3', idx: '①', text: '第一类曲线积分（对弧长）' },
          { t: 'fml', html:
            '<div class="fml-row">定义：\\( \\int_L f(x,y)\\,\\mathrm{d}s=\\lim\\limits_{\\lambda\\to 0}\\sum\\limits_{i=1}^{n}f(\\xi_i,\\eta_i)\\Delta s_i \\)（与方向无关）</div>' +
            '<div class="fml-row">参数式：\\( x=\\varphi(t),\\ y=\\psi(t)\\ (\\alpha\\leqslant t\\leqslant\\beta) \\)，则</div>' +
            '<div class="fml-row">\\( \\int_L f\\,\\mathrm{d}s=\\int_{\\alpha}^{\\beta}f(\\varphi,\\psi)\\sqrt{\\varphi\'^2+\\psi\'^2}\\,\\mathrm{d}t \\)</div>' +
            '<div class="fml-row">空间曲线：\\( \\mathrm{d}s=\\sqrt{x\'^2+y\'^2+z\'^2}\\,\\mathrm{d}t \\)</div>'
          },
          { t: 'h3', idx: '②', text: '第二类曲线积分（对坐标）' },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\int_L P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=\\lim\\limits_{\\lambda\\to 0}\\sum\\left[P(\\xi_i,\\eta_i)\\Delta x_i+Q(\\xi_i,\\eta_i)\\Delta y_i\\right] \\)（<b>与方向有关</b>）</div>' +
            '<div class="fml-row">参数式：\\( \\int_L P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=\\int_{\\alpha}^{\\beta}\\left[P\\varphi\'+Q\\psi\'\\right]\\mathrm{d}t \\)</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '两类曲线积分的关系', html:
            '<div class="fml">\\( \\int_L P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=\\int_L(P\\cos\\alpha+Q\\cos\\beta)\\,\\mathrm{d}s \\)</div>' +
            '<p class="tight">其中 \\( \\cos\\alpha,\\cos\\beta \\) 为有向曲线 \\( L \\) 上点处切向量的方向余弦。第一类与方向无关，第二类反向变号。</p>'
          },
          { t: 'table', head: ['对比项', '第一类（弧长）', '第二类（坐标）'], rows: [
            ['微元', '\\( \\mathrm{d}s>0 \\)', '\\( \\mathrm{d}x,\\mathrm{d}y \\) 可正可负'],
            ['方向', '与方向无关', '反向变号'],
            ['几何意义', '曲线质量（线密度 f）', '变力沿曲线做的功'],
            ['计算', '化为参数 t 的定积分（下限 < 上限）', '参数 t 从起点到终点']
          ]},
          { t: 'viz', build: 'lineIntegral', title: '两类曲线积分的微元对比', sub: '切换弧长微元 Δs 与坐标微元 Δx、Δy，拖动分割段数与高亮序号观察黎曼和收敛' }
        ],
        examples: [
          {
            no: '例 6.3', meta: '第一类',
            q: '计算 \\( \\int_L(x+y)\\,\\mathrm{d}s \\)，\\( L \\) 为连接 \\( O(0,0) \\) 与 \\( A(1,1) \\) 的直线段。',
            sol: '<p>参数化：\\( x=t,\\ y=t,\\ t\\in[0,1] \\)，\\( \\mathrm{d}s=\\sqrt2\\,\\mathrm{d}t \\)。</p>' +
              '<p>\\( \\int_0^1 2t\\sqrt2\\,\\mathrm{d}t=\\sqrt2 \\)。</p>'
          },
          {
            no: '例 6.4', meta: '第二类',
            q: '计算 \\( \\int_L x\\,\\mathrm{d}y-y\\,\\mathrm{d}x \\)，\\( L \\) 为圆 \\( x^2+y^2=a^2 \\) 取逆时针方向。',
            sol: '<p>参数化：\\( x=a\\cos t,\\ y=a\\sin t,\\ t:0\\to 2\\pi \\)。</p>' +
              '<p>\\( \\int_0^{2\\pi}\\left[a\\cos t\\cdot a\\cos t-a\\sin t\\cdot(-a\\sin t)\\right]\\mathrm{d}t=a^2\\int_0^{2\\pi}\\mathrm{d}t=2\\pi a^2 \\)。</p>'
          }
        ],
        pitfalls: [
          '第一类曲线积分化为定积分时下限必须小于上限；第二类则按参数从起点到终点。',
          '第二类曲线积分中 \\( \\mathrm{d}x \\) 是参数函数的微分，不是简单的 \\( \\mathrm{d}t \\)。',
          '有向曲线反向时，第二类积分变号，第一类不变。'
        ]
      },

      /* ---------------- 6.3 ---------------- */
      {
        id: 'ch6-s3', num: '6.3', title: '格林公式与路径无关',
        lead: '大纲要求：掌握格林公式，会运用平面曲线积分与路径无关的条件，会求二元函数全微分的原函数。',
        blocks: [
          { t: 'h3', idx: '①', text: '格林公式' },
          { t: 'card', kind: 'thm', tag: '定理', title: '格林（Green）公式', html:
            '<p class="tight">设闭区域 \\( D \\) 由分段光滑闭曲线 \\( L \\) 围成，\\( P,Q \\) 在 \\( D \\) 上具有一阶连续偏导数，\\( L \\) 取<b>正方向</b>（沿 \\( L \\) 前进时 \\( D \\) 在左侧，即逆时针），则</p>' +
            '<div class="fml">\\( \\oint_L P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=\\iint\\limits_D\\left(\\dfrac{\\partial Q}{\\partial x}-\\dfrac{\\partial P}{\\partial y}\\right)\\mathrm{d}x\\,\\mathrm{d}y \\)</div>'
          },
          { t: 'viz', build: 'greenTheorem', title: '格林公式的数值验证', sub: '调节 P、Q 与区域半径，比较曲线积分与二重积分' },
          { t: 'h3', idx: '②', text: '路径无关的条件' },
          { t: 'card', kind: 'key', tag: '必记', title: '四个等价命题（单连通区域）', html:
            '<p class="tight">设 \\( D \\) 为单连通区域，\\( P,Q \\) 有一阶连续偏导数，则以下等价：</p>' +
            '<ul class="none">' +
            '<li>\\( \\oint_L P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y=0 \\) 对 \\( D \\) 内任意闭曲线成立；</li>' +
            '<li>曲线积分与路径无关，只与起点终点有关；</li>' +
            '<li>\\( P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y \\) 是某个函数 \\( u(x,y) \\) 的全微分；</li>' +
            '<li>\\( \\dfrac{\\partial P}{\\partial y}=\\dfrac{\\partial Q}{\\partial x} \\) 在 \\( D \\) 内恒成立。</li>' +
            '</ul>'
          },
          { t: 'fml', html:
            '<div class="fml-row"><b>求原函数</b>：\\( u(x,y)=\\int_{x_0}^{x}P(t,y_0)\\,\\mathrm{d}t+\\int_{y_0}^{y}Q(x,t)\\,\\mathrm{d}t \\)（折线法）</div>' +
            '<div class="fml-row"><b>有奇点时</b>：不能直接用 \\( \\dfrac{\\partial P}{\\partial y}=\\dfrac{\\partial Q}{\\partial x} \\)，需挖去奇点或用“曲线变形法”。</div>'
          },
          { t: 'card', kind: 'warn', tag: '经典反例', title: '非单连通区域', html:
            '<p class="tight">\\( P=\\dfrac{-y}{x^2+y^2},\\ Q=\\dfrac{x}{x^2+y^2} \\)，在去心区域上 \\( \\dfrac{\\partial P}{\\partial y}=\\dfrac{\\partial Q}{\\partial x} \\)，但绕原点一周的积分等于 \\( 2\\pi\\neq 0 \\)——因为区域不是单连通的（有洞）。</p>'
          }
        ],
        examples: [
          {
            no: '例 6.5', meta: '格林公式',
            q: '计算 \\( \\oint_L x\\,\\mathrm{d}y \\)，\\( L \\) 为圆 \\( x^2+y^2=a^2 \\) 逆时针。',
            sol: '<p>\\( P=0,\\ Q=x \\)，\\( \\dfrac{\\partial Q}{\\partial x}-\\dfrac{\\partial P}{\\partial y}=1 \\)。</p>' +
              '<p>由格林公式，积分 \\( =\\iint\\limits_D 1\\,\\mathrm{d}\\sigma=\\pi a^2 \\)（即圆面积）。</p>'
          },
          {
            no: '例 6.6', meta: '路径无关',
            q: '求 \\( (2x\\cos y-y^2\\sin x)\\,\\mathrm{d}x+(2y\\cos x-x^2\\sin y)\\,\\mathrm{d}y \\) 的原函数。',
            sol: '<p>验证 \\( \\dfrac{\\partial P}{\\partial y}=-2x\\sin y-2y\\sin x=\\dfrac{\\partial Q}{\\partial x} \\)，故为全微分。</p>' +
              '<p>取折线 \\( (0,0)\\to(x,0)\\to(x,y) \\)：\\( u=\\int_0^x 2t\\,\\mathrm{d}t+\\int_0^y(2t\\cos x-x^2\\sin t)\\,\\mathrm{d}t \\)</p>' +
              '<p>\\( =x^2+y^2\\cos x+x^2\\cos y-x^2= x^2\\cos y+y^2\\cos x+C \\)。</p>'
          }
        ],
        pitfalls: [
          '格林公式要求 \\( L \\) 为正向（逆时针）；顺时针需加负号。',
          '区域内有奇点时必须“挖洞”处理，不能直接套用。',
          '路径无关要求区域<b>单连通</b>且偏导连续，二者缺一不可。'
        ]
      },

      /* ---------------- 6.4 ---------------- */
      {
        id: 'ch6-s4', num: '6.4', title: '两类曲面积分',
        lead: '大纲要求：了解两类曲面积分的概念、性质及关系，掌握计算两类曲面积分的方法。',
        blocks: [
          { t: 'h3', idx: '①', text: '第一类曲面积分（对面积）' },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\iint\\limits_\\Sigma f(x,y,z)\\,\\mathrm{d}S=\\lim\\limits_{\\lambda\\to 0}\\sum f(\\xi_i,\\eta_i,\\zeta_i)\\Delta S_i \\)（与侧无关）</div>' +
            '<div class="fml-row">若 \\( \\Sigma: z=z(x,y) \\)，则 \\( \\mathrm{d}S=\\sqrt{1+z_x^2+z_y^2}\\,\\mathrm{d}x\\,\\mathrm{d}y \\)</div>' +
            '<div class="fml-row">投影法：\\( \\iint\\limits_\\Sigma f\\,\\mathrm{d}S=\\iint\\limits_{D_{xy}}f(x,y,z(x,y))\\sqrt{1+z_x^2+z_y^2}\\,\\mathrm{d}x\\,\\mathrm{d}y \\)</div>'
          },
          { t: 'h3', idx: '②', text: '第二类曲面积分（对坐标）' },
          { t: 'fml', html:
            '<div class="fml-row">\\( \\iint\\limits_\\Sigma P\\,\\mathrm{d}y\\,\\mathrm{d}z+Q\\,\\mathrm{d}z\\,\\mathrm{d}x+R\\,\\mathrm{d}x\\,\\mathrm{d}y \\)（<b>与侧有关</b>）</div>' +
            '<div class="fml-row">取上侧（\\( z=z(x,y) \\)）：\\( \\iint\\limits_\\Sigma R\\,\\mathrm{d}x\\,\\mathrm{d}y=\\iint\\limits_{D_{xy}}R(x,y,z(x,y))\\,\\mathrm{d}x\\,\\mathrm{d}y \\)；取下侧取负</div>'
          },
          { t: 'card', kind: 'key', tag: '必记', title: '两类曲面积分的关系', html:
            '<div class="fml">\\( \\iint\\limits_\\Sigma P\\,\\mathrm{d}y\\mathrm{d}z+Q\\,\\mathrm{d}z\\mathrm{d}x+R\\,\\mathrm{d}x\\mathrm{d}y=\\iint\\limits_\\Sigma(P\\cos\\alpha+Q\\cos\\beta+R\\cos\\gamma)\\,\\mathrm{d}S \\)</div>' +
            '<p class="tight">\\( (\\cos\\alpha,\\cos\\beta,\\cos\\gamma) \\) 为曲面指定侧的单位法向量。第一类与侧无关，第二类换侧变号。</p>'
          },
          { t: 'table', head: ['对比项', '第一类（面积）', '第二类（坐标）'], rows: [
            ['微元', '\\( \\mathrm{d}S>0 \\)', '\\( \\mathrm{d}y\\mathrm{d}z \\) 等可正可负'],
            ['侧/方向', '无关', '换侧变号'],
            ['物理意义', '曲面质量（面密度 f）', '流量（速度场穿过曲面的通量）']
          ]},
          { t: 'viz', build: 'surfaceIntegral', title: '两类曲面积分：投影微元与通量微元', sub: '拖动微元位置与边长，对比曲面微元 dS 与投影微元 dxdy，并观察垂直场的通量微元' }
        ],
        examples: [
          {
            no: '例 6.7', meta: '第一类',
            q: '计算 \\( \\iint\\limits_\\Sigma z\\,\\mathrm{d}S \\)，\\( \\Sigma \\) 为平面 \\( z=1 \\) 上 \\( x^2+y^2\\leqslant 1 \\) 的部分。',
            sol: '<p>\\( z=1 \\)，\\( z_x=z_y=0 \\)，\\( \\mathrm{d}S=\\mathrm{d}x\\mathrm{d}y \\)。</p>' +
              '<p>积分 \\( =\\iint\\limits_{x^2+y^2\\leqslant 1}1\\,\\mathrm{d}x\\mathrm{d}y=\\pi \\)。</p>'
          },
          {
            no: '例 6.8', meta: '第二类',
            q: '计算 \\( \\iint\\limits_\\Sigma z\\,\\mathrm{d}x\\,\\mathrm{d}y \\)，\\( \\Sigma \\) 为球面 \\( x^2+y^2+z^2=a^2 \\) 的上半部分取上侧。',
            sol: '<p>投影区域 \\( D: x^2+y^2\\leqslant a^2 \\)，取上侧 \\( z=\\sqrt{a^2-x^2-y^2} \\)。</p>' +
              '<p>积分 \\( =\\iint\\limits_D\\sqrt{a^2-x^2-y^2}\\,\\mathrm{d}x\\mathrm{d}y=\\int_0^{2\\pi}\\!\\mathrm{d}\\theta\\int_0^a\\sqrt{a^2-r^2}\\,r\\,\\mathrm{d}r=\\dfrac{2\\pi a^3}{3} \\)。</p>'
          }
        ],
        pitfalls: [
          '第二类曲面积分必须注意“取哪一侧”，换侧要变号。',
          '第一类曲面积分投影时不能丢掉 \\( \\sqrt{1+z_x^2+z_y^2} \\)。',
          '曲面法向量与坐标面垂直时（如 \\( R\\,\\mathrm{d}x\\mathrm{d}y \\) 在 \\( z \\) 为常数的曲面）要单独讨论。'
        ]
      },

      /* ---------------- 6.5 ---------------- */
      {
        id: 'ch6-s5', num: '6.5', title: '高斯公式与斯托克斯公式',
        lead: '大纲要求：掌握用高斯公式计算曲面积分，会用斯托克斯公式计算曲线积分，了解散度与旋度并会计算。',
        blocks: [
          { t: 'h3', idx: '①', text: '高斯公式与散度' },
          { t: 'card', kind: 'thm', tag: '定理', title: '高斯（Gauss）公式', html:
            '<p class="tight">设空间闭区域 \\( \\Omega \\) 由分片光滑闭曲面 \\( \\Sigma \\) 围成，\\( P,Q,R \\) 有一阶连续偏导数，\\( \\Sigma \\) 取<b>外侧</b>，则</p>' +
            '<div class="fml">\\( \\oiint\\limits_\\Sigma P\\,\\mathrm{d}y\\mathrm{d}z+Q\\,\\mathrm{d}z\\mathrm{d}x+R\\,\\mathrm{d}x\\mathrm{d}y=\\iiint\\limits_\\Omega\\left(\\dfrac{\\partial P}{\\partial x}+\\dfrac{\\partial Q}{\\partial y}+\\dfrac{\\partial R}{\\partial z}\\right)\\mathrm{d}V \\)</div>' +
            '<p class="tight"><b>散度</b>：\\( \\operatorname{div}\\boldsymbol{A}=\\dfrac{\\partial P}{\\partial x}+\\dfrac{\\partial Q}{\\partial y}+\\dfrac{\\partial R}{\\partial z}=\\nabla\\cdot\\boldsymbol{A} \\)，表示单位体积的通量（源的强度）。</p>'
          },
          { t: 'viz', build: 'fluxDivergence', title: '通量、散度与高斯公式', sub: '调节场强，观察净流出与散度的关系' },
          { t: 'h3', idx: '②', text: '斯托克斯公式与旋度' },
          { t: 'card', kind: 'thm', tag: '定理', title: '斯托克斯（Stokes）公式', html:
            '<p class="tight">设 \\( \\Gamma \\) 为分段光滑空间有向闭曲线，\\( \\Sigma \\) 是以 \\( \\Gamma \\) 为边界的分片光滑有向曲面，\\( \\Gamma \\) 的正向与 \\( \\Sigma \\) 的侧符合右手法则，则</p>' +
            '<div class="fml">\\( \\oint_\\Gamma P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y+R\\,\\mathrm{d}z=\\iint\\limits_\\Sigma\\begin{vmatrix}\\mathrm{d}y\\mathrm{d}z & \\mathrm{d}z\\mathrm{d}x & \\mathrm{d}x\\mathrm{d}y\\\\ \\dfrac{\\partial}{\\partial x} & \\dfrac{\\partial}{\\partial y} & \\dfrac{\\partial}{\\partial z}\\\\ P & Q & R\\end{vmatrix} \\)</div>' +
            '<p class="tight"><b>旋度</b>：\\( \\operatorname{rot}\\boldsymbol{A}=\\nabla\\times\\boldsymbol{A}=\\begin{vmatrix}\\boldsymbol{i}&\\boldsymbol{j}&\\boldsymbol{k}\\\\ \\partial_x&\\partial_y&\\partial_z\\\\ P&Q&R\\end{vmatrix} \\)，描述流体的旋转程度。</p>'
          },
          { t: 'table', head: ['公式', '把…化为…', '方向/侧'], rows: [
            ['格林公式', '平面闭曲线积分 → 二重积分', '\\( L \\) 正向（逆时针）'],
            ['高斯公式', '闭曲面积分 → 三重积分', '\\( \\Sigma \\) 外侧'],
            ['斯托克斯公式', '空间闭曲线积分 → 曲面积分', '右手法则'],
            ['格林公式', '是斯托克斯公式在平面上的特例', '—']
          ]},
          { t: 'card', kind: 'key', tag: '必记', title: '三大公式的统一', html:
            '<p class="tight">格林、高斯、斯托克斯公式本质上都是<b>广义斯托克斯公式</b> \\( \\int_{\\partial M}\\omega=\\int_M\\mathrm{d}\\omega \\) 的特例：边界上的积分等于内部“导数”的积分。它们把复杂的边界积分转化为更好算的内部积分（或反之）。</p>'
          }
        ],
        examples: [
          {
            no: '例 6.9', meta: '高斯公式',
            q: '计算 \\( \\oiint\\limits_\\Sigma x\\,\\mathrm{d}y\\mathrm{d}z+y\\,\\mathrm{d}z\\mathrm{d}x+z\\,\\mathrm{d}x\\mathrm{d}y \\)，\\( \\Sigma \\) 为球面 \\( x^2+y^2+z^2=a^2 \\) 外侧。',
            sol: '<p>由高斯公式，积分 \\( =\\iiint\\limits_\\Omega(1+1+1)\\,\\mathrm{d}V=3\\cdot\\dfrac43\\pi a^3=4\\pi a^3 \\)。</p>'
          },
          {
            no: '例 6.10', meta: '散度与旋度',
            q: '设 \\( \\boldsymbol{A}=(x^2y,\\ yz,\\ xz^2) \\)，求 \\( \\operatorname{div}\\boldsymbol{A} \\) 与 \\( \\operatorname{rot}\\boldsymbol{A} \\)。',
            sol: '<p>\\( \\operatorname{div}\\boldsymbol{A}=2xy+z+2xz \\)。</p>' +
              '<p>\\( \\operatorname{rot}\\boldsymbol{A}=(0-x,\\ 0-z^2,\\ 0-x^2)=(-x,\\,-z^2,\\,-x^2) \\)。</p>'
          }
        ],
        pitfalls: [
          '高斯公式要求曲面闭合且取外侧；不闭合需补面（补的面要减去对应积分）。',
          '斯托克斯公式的方向必须符合右手法则，方向反了要变号。',
          '散度是标量，旋度是向量，不要混用。'
        ]
      },

      /* ---------------- 6.6 ---------------- */
      {
        id: 'ch6-s6', num: '6.6', title: '场论初步与应用',
        lead: '大纲要求：会用重积分、曲线积分及曲面积分求几何量与物理量。',
        blocks: [
          { t: 'h3', idx: '①', text: '几何量与应用' },
          { t: 'table', head: ['量', '公式'], rows: [
            ['平面图形面积', '\\( A=\\iint\\limits_D\\mathrm{d}\\sigma \\)'],
            ['立体体积', '\\( V=\\iiint\\limits_\\Omega\\mathrm{d}V \\)'],
            ['曲面面积', '\\( S=\\iint\\limits_\\Sigma\\mathrm{d}S \\)'],
            ['曲线弧长', '\\( s=\\int_L\\mathrm{d}s \\)'],
            ['平面曲线所围面积（格林）', '\\( A=\\dfrac12\\oint_L x\\,\\mathrm{d}y-y\\,\\mathrm{d}x \\)']
          ]},
          { t: 'h3', idx: '②', text: '物理量与应用' },
          { t: 'fml', html:
            '<div class="fml-row"><b>质量</b>：平面 \\( m=\\iint\\limits_D\\rho\\,\\mathrm{d}\\sigma \\)；空间 \\( m=\\iiint\\limits_\\Omega\\rho\\,\\mathrm{d}V \\)；曲线 \\( m=\\int_L\\rho\\,\\mathrm{d}s \\)；曲面 \\( m=\\iint\\limits_\\Sigma\\rho\\,\\mathrm{d}S \\)</div>' +
            '<div class="fml-row"><b>质心/形心</b>：\\( \\bar x=\\dfrac{1}{m}\\iiint\\limits_\\Omega x\\rho\\,\\mathrm{d}V \\)（形心取 \\( \\rho=1 \\)）</div>' +
            '<div class="fml-row"><b>转动惯量</b>：\\( I_z=\\iiint\\limits_\\Omega(x^2+y^2)\\rho\\,\\mathrm{d}V \\)</div>' +
            '<div class="fml-row"><b>变力做功</b>：\\( W=\\int_L P\\,\\mathrm{d}x+Q\\,\\mathrm{d}y+R\\,\\mathrm{d}z \\)</div>' +
            '<div class="fml-row"><b>通量（流量）</b>：\\( \\Phi=\\iint\\limits_\\Sigma \\boldsymbol{v}\\cdot\\boldsymbol{n}\\,\\mathrm{d}S \\)</div>'
          },
          { t: 'viz', build: 'fieldFlow', title: '向量场的流线、散度与旋度', sub: '切换源 / 汇 / 旋转 / 剪切四种场，播放探针沿流线的运动，观察 div 与 rot 的局部含义' },
          { t: 'card', kind: 'tip', tag: '解题策略', title: '选对积分类型', html:
            '<ul class="none">' +
            '<li>求面积/体积优先用重积分；曲线所围面积可用格林公式；</li>' +
            '<li>求变力做功、环流量用第二类曲线积分（必要时格林/斯托克斯）；</li>' +
            '<li>求通量用第二类曲面积分（必要时高斯公式）；</li>' +
            '<li>对称区域上看被积函数的奇偶性可大幅简化计算。</li>' +
            '</ul>'
          }
        ],
        examples: [
          {
            no: '例 6.11', meta: '质心',
            q: '求由 \\( y=x^2 \\) 与 \\( y=x \\) 围成的均匀薄片的形心。',
            sol: '<p>区域 \\( D: 0\\leqslant x\\leqslant 1,\\ x^2\\leqslant y\\leqslant x \\)，面积 \\( A=\\int_0^1(x-x^2)\\mathrm{d}x=\\dfrac16 \\)。</p>' +
              '<p>\\( \\bar x=\\dfrac{1}{A}\\int_0^1 x(x-x^2)\\mathrm{d}x=\\dfrac{1}{A}\\left(\\dfrac13-\\dfrac14\\right)=\\dfrac{1/12}{1/6}=\\dfrac12 \\)。</p>' +
              '<p>\\( \\bar y=\\dfrac{1}{A}\\int_0^1\\dfrac{x^2-x^4}{2}\\mathrm{d}x=\\dfrac{\\frac{1}{2}\\left(\\frac13-\\frac15\\right)}{1/6}=\\dfrac25 \\)。形心 \\( \\left(\\dfrac12,\\dfrac25\\right) \\)。</p>'
          }
        ],
        pitfalls: [
          '质心公式中的分母是总质量，不要与面积混淆。',
          '转动惯量要明确对哪个轴（对 z 轴是 \\( x^2+y^2 \\)，对 x 轴是 \\( y^2+z^2 \\)）。',
          '利用对称性时要注意被积函数与区域的对称性必须匹配。'
        ]
      }
    ]
  };
})(window);
