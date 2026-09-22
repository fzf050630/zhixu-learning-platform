/* 知序 · 首次访问说明
   第一次打开平台门户时显示一次：平台架构、Jev 决策层、与主站的关系、免责声明与数据说明。
   说明必须滚动到底部才能确认；确认后写入 localStorage，并在页脚「关于本站」可再次打开。
   打开页面的同时会把本次访问的匿名网络信息记录到后端（file:// 与后端不可用时静默跳过）。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const STORE_KEY = 'zhixu-onboarding-v1';
  const UID_KEY = 'zhixu-uid-v1';
  const canSync = location.protocol === 'http:' || location.protocol === 'https:';
  const API_BASE = global.ZHIXU_API_BASE
    ? String(global.ZHIXU_API_BASE).replace(/\/$/, '')
    : (P.root ? String(P.root).replace(/\/$/, '') : '');
  const MAIN_SITE = 'https://recaord.top';
  const ICP = '冀ICP备2026001094号';

  const escape = P.escape || (text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])));

  /* ---------- 匿名设备标识与访问上报 ---------- */
  function deviceId() {
    try {
      const stored = localStorage.getItem(UID_KEY);
      if (stored) return stored;
      const created = 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(UID_KEY, created);
      return created;
    } catch (_) {
      return 'anonymous';
    }
  }

  function today() {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }

  function visitId() {
    return deviceId() + ':' + today();
  }

  function report(payload) {
    if (!canSync) return;
    let timezone = '';
    try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (_) { /* ignore */ }
    const body = JSON.stringify({
      userId: deviceId(),
      visitId: visitId(),
      path: location.pathname + location.hash,
      screen: (global.screen ? screen.width + 'x' + screen.height : ''),
      timezone,
      language: global.navigator ? navigator.language || '' : '',
      ...payload,
    });
    try {
      fetch(API_BASE + '/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Zhixu-User': deviceId() },
        body,
        keepalive: true,
      }).catch(() => { /* 记录失败不影响阅读 */ });
    } catch (_) { /* ignore */ }
  }

  /* ---------- 说明内容 ---------- */
  const SECTIONS = [
    {
      title: '你正在打开什么',
      body: [
        '「知序」是一个 408 与考研数学的交互学习平台：把抽象概念拆成可以逐步播放、拖动参数的图形与动画，并在你练习之后给出<b>知识掌握度</b>。',
        '目前开放七科：数据结构、计算机组成原理、操作系统、计算机网络、高等数学、线性代数、概率论与数理统计，共 240 个学习入口、1200 道自测题。',
      ],
    },
    {
      title: '平台架构：一条从行为到决策的链路',
      body: [
        '整个平台由三部分组成，彼此解耦，任何一层都可以单独替换：',
        '<span class="zx-onboard-list">① 交互前端</span>零框架的静态站点，算法一次性生成完整快照，播放器只负责选择快照并同步图形、伪代码、说明与状态表；可以直接离线打开，不依赖后端。',
        '<span class="zx-onboard-list">② 数据与规则层</span>后端记录学习行为（答题、提示、实验、复习），计算出正确率、稳定性、独立性、复习紧迫度等指标，再由规则引擎给出规则掌握度。',
        '<span class="zx-onboard-list">③ Jev 决策层</span>把结构化上下文交给 Jev，得到掌握程度、稳定度、薄弱类型与下一步动作，并与规则分融合。',
      ],
    },
    {
      title: '重点：Jev 决策层',
      body: [
        'Jev（TypeSafe）是本平台在「规则」之上的一层判断：规则引擎擅长算得准，Jev 擅长在<b>证据不完整</b>时判断你到底卡在哪一步、下一步该做什么。',
        '它读取的是你的学习状态摘要（作答与复习次数、近期正确率、提示使用、稳定性、复习紧迫度等结构化字段），返回四类结构化判断：掌握程度、掌握稳定性、错误类型、下一步建议；后端按 <b>规则 0.7 / Jev 0.3</b> 融合，形成最终掌握度。',
        '三条工程约束：<b>Key 只在服务器</b>——浏览器拿不到 API Key，所有 Jev 调用都在后端完成；<b>置信度不足就回退</b>——当 Jev 的把握低于阈值时，该项自动改用规则引擎结果；<b>失败不阻塞学习</b>——Jev 超时、限流或报错时静默回退规则引擎，页面不会因此不可用。',
        '也就是说：Jev 负责「判断」，规则负责「兜底」，数据层负责「留痕」。',
      ],
    },
    {
      title: '与主站的关系',
      body: [
        '本页面是「<b>李嘉图笔记（编程寻道）</b>」的<b>分站</b>，专注学习与可视化实验；主站是个人博客，写技术，也记录生活与光线。',
        '主站：<a href="' + MAIN_SITE + '" target="_blank" rel="noopener noreferrer">recaord.top ↗</a>　本站：recaord.top/math-modeling/',
      ],
    },
    {
      title: '免责声明',
      body: [
        '本站内容依据公开考试大纲与教材主线<b>独立编写、独立绘制</b>，仓库与站点均不含教材、大纲的扫描件或影印内容；知识点整理、步骤说明与图示仅供学习参考，可能存在疏漏或与最新大纲不一致之处。',
        '本站为个人学习项目，不提供任何形式的考试承诺、押题保证或备考效果担保；因使用本站内容产生的任何后果，由使用者自行承担。',
        '主站已在中国境内完成 ICP 备案：<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">' + ICP + ' ↗</a>，本分站沿用同一备案主体。转载、引用请注明来源，不得用于商业用途。',
      ],
    },
    {
      title: '数据与隐私',
      body: [
        '为了让作者了解访问情况并排查问题，本页面加载时会记录一次<b>匿名访问信息</b>：IP 地址、浏览器 User-Agent、来源页面、语言、屏幕尺寸、时区与访问时间。这些信息<b>不做广告追踪、不与第三方共享、不用于识别个人身份</b>，你可以用浏览器隐私模式访问以避免写入本地标识。',
        '掌握度数据以浏览器随机生成的设备标识区分，不采集姓名、邮箱、手机号等身份信息；练习行为只用于计算你自己的掌握度与复习计划。',
        '在本站做的练习记录保存在平台后端；未连接后端时，平台自动降级为纯离线使用，不产生任何网络请求。',
      ],
    },
    {
      title: '开始之前',
      body: [
        '建议的顺序：选一门科目 → 打开一个实验或小节 → 先读「算法流程」再动手 → 逐步播放并调整参数 → 用「自测」检验 → 在侧栏百分比与掌握度页面查看进度。',
        '每一节的底部都有「下一节」按钮，可以按顺序连续学习；平台说明之后想再看，可以点页面底部的「关于本站」。',
      ],
    },
  ];

  function sectionsHtml() {
    return SECTIONS.map(section => (
      '<section class="zx-onboard-section">' +
        '<h3>' + escape(section.title) + '</h3>' +
        section.body.map(paragraph => '<p>' + paragraph + '</p>').join('') +
      '</section>'
    )).join('');
  }

  /* ---------- 弹层 ---------- */
  let overlay = null;
  let bodyEl = null;
  let acceptBtn = null;
  let hintEl = null;
  let progressEl = null;
  let onAccept = null;

  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('onboarding.css', document.currentScript.src).href;
    document.head.appendChild(link);
  } catch (_) { /* 样式失败不影响功能 */ }

  function build() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'zx-onboard';
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="zx-onboard-card" role="dialog" aria-modal="true" aria-labelledby="zxOnboardTitle" aria-describedby="zxOnboardHint">' +
        '<header class="zx-onboard-head">' +
          '<p class="zx-onboard-eyebrow">首次访问说明</p>' +
          '<h2 id="zxOnboardTitle">欢迎来到知序</h2>' +
          '<p class="zx-onboard-sub">408 与考研数学交互学习平台 · 李嘉图笔记（编程寻道）分站</p>' +
        '</header>' +
        '<div class="zx-onboard-body" id="zxOnboardBody" tabindex="0" role="document" aria-label="平台说明全文">' + sectionsHtml() + '</div>' +
        '<footer class="zx-onboard-foot">' +
          '<div class="zx-onboard-progress"><i id="zxOnboardBar"></i></div>' +
          '<p class="zx-onboard-hint" id="zxOnboardHint">请向下滚动读完全部说明</p>' +
          '<button type="button" class="zx-onboard-accept" id="zxOnboardAccept" disabled aria-disabled="true">我已阅读并开始学习</button>' +
        '</footer>' +
      '</div>';
    document.body.appendChild(overlay);
    bodyEl = overlay.querySelector('#zxOnboardBody');
    acceptBtn = overlay.querySelector('#zxOnboardAccept');
    hintEl = overlay.querySelector('#zxOnboardHint');
    progressEl = overlay.querySelector('#zxOnboardBar');

    bodyEl.addEventListener('scroll', updateGate, { passive: true });
    acceptBtn.addEventListener('click', () => {
      if (acceptBtn.disabled) return;
      try { localStorage.setItem(STORE_KEY, '1'); } catch (_) { /* ignore */ }
      report({ onboarded: true });
      hide();
      if (typeof onAccept === 'function') onAccept();
    });
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); return; }
      if (event.key !== 'Tab') return;
      event.preventDefault();       // 说明是必读内容，焦点留在弹层内
      (bodyEl.scrollHeight > bodyEl.clientHeight ? bodyEl : acceptBtn).focus({ preventScroll: true });
    });
    global.addEventListener('resize', updateGate);
  }

  function updateGate() {
    if (!bodyEl) return;
    const max = bodyEl.scrollHeight - bodyEl.clientHeight;
    const read = max <= 4 ? max : Math.max(0, Math.min(max, bodyEl.scrollTop));
    const done = max <= 4 || read >= max - 8;
    const percent = max <= 4 ? 100 : Math.round((read / max) * 100);
    acceptBtn.disabled = !done;
    acceptBtn.setAttribute('aria-disabled', String(!done));
    hintEl.textContent = done ? '已读完全部说明，可以开始学习' : '请向下滚动读完全部说明（已读 ' + percent + '%）';
    progressEl.style.width = percent + '%';
  }

  function show() {
    build();
    overlay.hidden = false;
    document.documentElement.classList.add('zx-onboard-open');
    bodyEl.scrollTop = 0;
    updateGate();
    bodyEl.focus({ preventScroll: true });
  }

  function hide() {
    if (!overlay) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('zx-onboard-open');
  }

  function shouldShow() {
    try { return localStorage.getItem(STORE_KEY) !== '1'; } catch (_) { return true; }
  }

  report({});
  if (shouldShow()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }

  /* 页脚「关于本站」等入口：随时可以重新阅读本说明 */
  function bindOpeners() {
    document.querySelectorAll('[data-zx-onboarding-open]').forEach(element => {
      if (element.dataset.zxOnboardingBound) return;
      element.dataset.zxOnboardingBound = '1';
      element.addEventListener('click', event => { event.preventDefault(); show(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindOpeners);
  else bindOpeners();

  P.onboarding = { open: show, close: hide, sections: SECTIONS, report };
})(window);
