/* ============================================================
   stats.js — 概率分布计算库（第一至第八章所需全部分布）
   ============================================================ */
(function (global) {
  'use strict';

  const M = global.MathX;
  const { clamp } = global.Draw;

  /* ============ 组合与阶乘 ============ */
  const C = M.C;
  const fact = M.fact;

  /* ============ 一、离散型分布 ============ */

  /** 0–1 分布 B(1,p) */
  const bern = {
    name: '0–1 分布', short: 'B(1,p)',
    pmf: (k, p) => k === 1 ? p : (k === 0 ? 1 - p : 0),
    cdf: (k, p) => k < 0 ? 0 : (k < 1 ? 1 - p : 1),
    mean: p => p, varr: p => p * (1 - p),
    support: (p, n) => [0, 1]
  };

  /** 二项分布 B(n,p) */
  const binom = {
    name: '二项分布', short: 'B(n,p)',
    pmf: (k, n, p) => {
      if (k < 0 || k > n || !Number.isInteger(k)) return 0;
      if (p === 0) return k === 0 ? 1 : 0;
      if (p === 1) return k === n ? 1 : 0;
      return Math.exp(M.lC(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
    },
    cdf: (k, n, p) => {
      k = Math.floor(k);
      if (k < 0) return 0; if (k >= n) return 1;
      let s = 0;
      for (let i = 0; i <= k; i++) s += binom.pmf(i, n, p);
      return clamp(s, 0, 1);
    },
    mean: (n, p) => n * p,
    varr: (n, p) => n * p * (1 - p),
    support: (p, n) => [0, n]
  };

  /** 几何分布 G(p)：P{X=k}=(1-p)^{k-1} p, k=1,2,… */
  const geom = {
    name: '几何分布', short: 'G(p)',
    pmf: (k, p) => (k < 1 || !Number.isInteger(k)) ? 0 : p * Math.pow(1 - p, k - 1),
    cdf: (k, p) => k < 1 ? 0 : 1 - Math.pow(1 - p, Math.floor(k)),
    mean: p => 1 / p,
    varr: p => (1 - p) / (p * p),
    support: (p, n) => [1, n || 12]
  };

  /** 超几何分布 H(N,M,n) */
  const hyper = {
    name: '超几何分布', short: 'H(N,M,n)',
    pmf: (k, N, M, n) => {
      const lo = Math.max(0, n - (N - M)), hi = Math.min(n, M);
      if (k < lo || k > hi || !Number.isInteger(k)) return 0;
      return C(M, k) * C(N - M, n - k) / C(N, n);
    },
    cdf: (k, N, M, n) => {
      k = Math.floor(k);
      const lo = Math.max(0, n - (N - M));
      let s = 0;
      for (let i = lo; i <= Math.min(k, n, M); i++) s += hyper.pmf(i, N, M, n);
      return clamp(s, 0, 1);
    },
    mean: (N, M, n) => n * M / N,
    varr: (N, M, n) => n * (M / N) * (1 - M / N) * (N - n) / (N - 1),
    support: (p, n, N, M) => [Math.max(0, n - (N - M)), Math.min(n, M)]
  };

  /** 泊松分布 P(λ) */
  const poisson = {
    name: '泊松分布', short: 'P(λ)',
    pmf: (k, lam) => {
      if (k < 0 || !Number.isInteger(k)) return 0;
      return Math.exp(-lam + k * Math.log(lam) - M.lfact(k));
    },
    cdf: (k, lam) => {
      k = Math.floor(k);
      if (k < 0) return 0;
      let s = 0;
      for (let i = 0; i <= k; i++) s += poisson.pmf(i, lam);
      return clamp(s, 0, 1);
    },
    mean: lam => lam,
    varr: lam => lam,
    support: (lam, n) => [0, n || Math.ceil(lam + 4 * Math.sqrt(lam) + 3)]
  };

  /* ============ 二、连续型分布 ============ */

  /** 均匀分布 U(a,b) */
  const uniform = {
    name: '均匀分布', short: 'U(a,b)',
    pdf: (x, a, b) => (x < a || x > b) ? 0 : 1 / (b - a),
    cdf: (x, a, b) => x <= a ? 0 : (x >= b ? 1 : (x - a) / (b - a)),
    mean: (a, b) => (a + b) / 2,
    varr: (a, b) => (b - a) * (b - a) / 12
  };

  /** 正态分布 N(μ,σ²) */
  const normal = {
    name: '正态分布', short: 'N(μ,σ²)',
    pdf: (x, mu, sg) => M.normPdf(x, mu, sg),
    cdf: (x, mu, sg) => M.normCdf(x, mu, sg),
    mean: (mu) => mu,
    varr: (mu, sg) => sg * sg,
    /** 上分位点 u_α：P{X > u_α} = α */
    upperQuantile: (alpha) => M.normInv(1 - alpha),
    /** 标准正态密度 φ */
    phi: x => M.normPdf(x, 0, 1),
    Phi: x => M.normCdf(x, 0, 1)
  };

  /** 指数分布 E(λ)：f(x)=λe^{-λx} (x>0) */
  const expon = {
    name: '指数分布', short: 'E(λ)',
    pdf: (x, lam) => x > 0 ? lam * Math.exp(-lam * x) : 0,
    cdf: (x, lam) => x > 0 ? 1 - Math.exp(-lam * x) : 0,
    mean: lam => 1 / lam,
    varr: lam => 1 / (lam * lam)
  };

  /* ============ 三、常用工具 ============ */

  /** 泊松定理：n→∞, np→λ 时二项分布 → 泊松分布 */
  function poissonApprox(k, n, p) {
    const lam = n * p;
    return { lam, exact: binom.pmf(k, n, p), approx: poisson.pmf(k, lam) };
  }

  /** 贝叶斯公式：给定先验 prior[] 与似然 lik[][]（lik[i][j] = P(B_j | A_i)） */
  function bayes(prior, lik) {
    const n = prior.length;
    const evid = [];
    for (let j = 0; j < lik[0].length; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += prior[i] * lik[i][j];
      evid.push(s);
    }
    const post = lik.map(row => row.map((v, j) => prior[lik.indexOf(row)] * v / evid[j]));
    return { evid, post };
  }

  /** 全概率：P(B) = Σ P(A_i)P(B|A_i) */
  function totalProb(prior, cond) {
    return prior.reduce((s, p, i) => s + p * cond[i], 0);
  }

  /** 从离散分布采样 */
  function sampleDiscrete(pmfList, rnd) {
    rnd = rnd || Math.random;
    const s = pmfList.reduce((a, b) => a + b, 0);
    let r = rnd() * s;
    for (let i = 0; i < pmfList.length; i++) { r -= pmfList[i]; if (r <= 0) return i; }
    return pmfList.length - 1;
  }

  /** 简单可复现随机数（mulberry32） */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /** 伯努利试验序列（用于几何分布 / 独立重复试验演示） */
  function bernoulliSeq(p, n, rand) {
    rand = rand || Math.random;
    const out = [];
    for (let i = 0; i < n; i++) out.push(rand() < p ? 1 : 0);
    return out;
  }

  /** 二项分布经验频率（Monte-Carlo） */
  function binomSim(n, p, trials, rand) {
    rand = rand || Math.random;
    const cnt = new Array(n + 1).fill(0);
    for (let t = 0; t < trials; t++) {
      let k = 0;
      for (let i = 0; i < n; i++) if (rand() < p) k++;
      cnt[k]++;
    }
    return cnt.map(c => c / trials);
  }

  /** 几何分布经验频率 */
  function geomSim(p, trials, maxK, rand) {
    rand = rand || Math.random;
    const cnt = new Array(maxK + 2).fill(0);
    for (let t = 0; t < trials; t++) {
      let k = 1;
      while (k <= maxK && rand() >= p) k++;
      cnt[Math.min(k, maxK + 1)]++;
    }
    return cnt.map(c => c / trials);
  }

  /** 超几何：从 N 个含 M 个次品中抽 n 个，模拟次品数分布 */
  function hyperSim(N, M, n, trials, rand) {
    rand = rand || Math.random;
    const cnt = new Array(n + 1).fill(0);
    for (let t = 0; t < trials; t++) {
      // 洗牌抽样
      const idx = Array.from({ length: N }, (_, i) => i);
      for (let i = 0; i < n; i++) {
        const j = i + Math.floor(rand() * (N - i));
        [idx[i], idx[j]] = [idx[j], idx[i]];
      }
      let c = 0;
      for (let i = 0; i < n; i++) if (idx[i] < M) c++;
      cnt[c]++;
    }
    return cnt.map(c => c / trials);
  }

  /* ============ 四、随机变量函数的分布 ============ */

  /**
   * 离散型：Y = g(X)，合并同值概率
   * @returns [{y, p}]
   */
  function transformDiscrete(xs, ps, g) {
    const map = new Map();
    xs.forEach((x, i) => {
      const y = g(x);
      map.set(y, (map.get(y) || 0) + ps[i]);
    });
    return [...map.entries()].map(([y, p]) => ({ y, p })).sort((a, b) => a.y - b.y);
  }

  /**
   * 连续型：用分布函数法 / 数值法求 Y=g(X) 的密度
   * 数值方法：对 y 求 F_Y(y)=P{g(X)≤y} 的数值估计（用于非单调 g）
   * 单调情形提供精确公式。
   */
  function transformContinuous(fX, cdfX, g, ginv, gp) {
    if (ginv && gp) {
      return {
        kind: 'monotone',
        pdf: y => {
          const x = ginv(y);
          if (!isFinite(x)) return 0;
          return fX(x) * Math.abs(gp(x));
        }
      };
    }
    return {
      kind: 'numeric',
      cdf: (y, xMin, xMax, N = 2000) => {
        // P{g(X) ≤ y}
        let s = 0, prev = xMin;
        for (let i = 1; i <= N; i++) {
          const x = xMin + (xMax - xMin) * i / N;
          if (g((x + prev) / 2) <= y) s += (cdfX(x) - cdfX(prev));
          prev = x;
        }
        return clamp(s, 0, 1);
      }
    };
  }

  /* ============ 四、三大抽样分布（第六~八章） ============ */

  /** lnΓ(x) 快捷别名 */
  const lgamma = M.lgamma;

  /**
   * 下不完全 gamma 函数 P(a,x) = γ(a,x)/Γ(a)
   * 级数（x<a+1）+ 连分式（x≥a+1）混合，Numerical Recipes 方案
   */
  function gammap(a, x) {
    if (!(a > 0) || x < 0) return NaN;
    if (x === 0) return 0;
    if (x < a + 1) {
      let ap = a, del = 1 / a, sum = del;
      for (let n = 1; n <= 500; n++) {
        ap += 1; del *= x / ap; sum += del;
        if (Math.abs(del) < Math.abs(sum) * 1e-15) break;
      }
      return clamp(sum * Math.exp(-x + a * Math.log(x) - lgamma(a)), 0, 1);
    }
    const FPMIN = 1e-300;
    let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
    for (let i = 1; i <= 500; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return clamp(1 - Math.exp(-x + a * Math.log(x) - lgamma(a)) * h, 0, 1);
  }

  /** 不完全 beta 的连分式 */
  function betacf(a, b, x) {
    const FPMIN = 1e-300, EPS = 1e-15;
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      const del = d * c; h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }

  /** 正则化不完全 beta 函数 I_x(a,b) */
  function betai(a, b, x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) return clamp(bt * betacf(a, b, x) / a, 0, 1);
    return clamp(1 - bt * betacf(b, a, 1 - x) / b, 0, 1);
  }

  /** 通用上侧分位数：求 x 使 P{X > x} = alpha（survival 单调递减） */
  function upperQuantileFromSurvival(surv, lo, hi, alpha) {
    let a = lo, b = hi;
    if (!(surv(a) > alpha)) return a;            // 上界不足时返回端点
    if (surv(b) > alpha) return b;
    for (let i = 0; i < 300; i++) {
      const mid = (a + b) / 2;
      if (mid <= a || mid >= b) break;
      if (surv(mid) > alpha) a = mid; else b = mid;
    }
    return (a + b) / 2;
  }

  /** χ² 分布 χ²(n) */
  const chi2 = {
    name: 'χ² 分布', short: 'χ²(n)',
    pdf: (x, n) => {
      if (x <= 0) return 0;
      return Math.exp((n / 2 - 1) * Math.log(x) - x / 2 - (n / 2) * Math.LN2 - lgamma(n / 2));
    },
    cdf: (x, n) => x <= 0 ? 0 : gammap(n / 2, x / 2),
    mean: n => n,
    varr: n => 2 * n,
    /** 上侧 α 分位数 χ²_α(n)：P{χ² > χ²_α(n)} = α */
    upper: (alpha, n) => upperQuantileFromSurvival(
      x => 1 - chi2.cdf(x, n), 1e-9, Math.max(10, n + 400), alpha)
  };

  /** t 分布 t(n) */
  const tDist = {
    name: 't 分布', short: 't(n)',
    pdf: (x, n) => {
      const lg = lgamma((n + 1) / 2) - lgamma(n / 2) - 0.5 * Math.log(n * Math.PI);
      return Math.exp(lg - (n + 1) / 2 * Math.log(1 + x * x / n));
    },
    cdf: (x, n) => {
      const p = 0.5 * betai(n / 2, 0.5, n / (n + x * x));
      return x >= 0 ? 1 - p : p;
    },
    mean: n => n > 1 ? 0 : NaN,
    varr: n => n > 2 ? n / (n - 2) : NaN,
    /** 上侧 α 分位数 t_α(n) */
    upper: (alpha, n) => upperQuantileFromSurvival(
      x => 1 - tDist.cdf(x, n), -1e3, 1e3, alpha),
    /** 双侧临界值：P{|T| > c} = alpha */
    twoSided: (alpha, n) => tDist.upper(alpha / 2, n)
  };

  /** F 分布 F(m,n) */
  const fDist = {
    name: 'F 分布', short: 'F(m,n)',
    pdf: (x, m, n) => {
      if (x <= 0) return 0;
      const lg = (m / 2) * Math.log(m) + (n / 2) * Math.log(n)
        + lgamma((m + n) / 2) - lgamma(m / 2) - lgamma(n / 2);
      return Math.exp(lg + (m / 2 - 1) * Math.log(x) - ((m + n) / 2) * Math.log(n + m * x));
    },
    cdf: (x, m, n) => x <= 0 ? 0 : betai(m / 2, n / 2, m * x / (m * x + n)),
    mean: (m, n) => n > 2 ? n / (n - 2) : NaN,
    /** 上侧 α 分位数 F_α(m,n) */
    upper: (alpha, m, n) => upperQuantileFromSurvival(
      x => 1 - fDist.cdf(x, m, n), 1e-9, 1e4, alpha),
    /** 下侧分位数：F_{1−α}(m,n) = 1 / F_α(n,m) */
    lower: (alpha, m, n) => 1 / fDist.upper(alpha, n, m)
  };

  /** 标准正态上侧分位数 u_α：P{Z > u_α} = α */
  const normUpper = alpha => M.normInv(1 - alpha);

  /* ============ 五、随机数补充（模拟用） ============ */

  /** 标准正态随机数（Box–Muller） */
  function randn(rand) {
    rand = rand || Math.random;
    let u1 = rand(), u2 = rand();
    if (u1 < 1e-12) u1 = 1e-12;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  /** 标准正态样本 */
  function normSample(n, rand) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(randn(rand));
    return out;
  }

  /** 样本均值与样本方差（分母 n−1） */
  function meanVar(xs) {
    const n = xs.length;
    const m = xs.reduce((a, b) => a + b, 0) / n;
    const s2 = xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (n - 1);
    return { mean: m, varr: s2, n };
  }

  /* ============ 六、导出 ============ */

  global.Stats = {
    C, fact,
    bern, binom, geom, hyper, poisson,
    uniform, normal, expon,
    poissonApprox, bayes, totalProb,
    sampleDiscrete, rng, bernoulliSeq, binomSim, geomSim, hyperSim,
    transformDiscrete, transformContinuous,
    /* 第六~八章：三大抽样分布与模拟辅助 */
    chi2, tDist, fDist, normUpper,
    gammap, betai, randn, normSample, meanVar,
    /** 上侧分位数别名，便于书写 */
    tUpper: (a, n) => tDist.upper(a, n),
    chi2Upper: (a, n) => chi2.upper(a, n),
    fUpper: (a, m, n) => fDist.upper(a, m, n)
  };

})(window);
