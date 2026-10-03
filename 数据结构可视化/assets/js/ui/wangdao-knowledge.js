(function (g) {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const chapters = () => g.DS.Wangdao.chapters;
  function navHtml() {
    return '<section class="knowledge-nav"><h2>王道教材知识主线</h2>' + chapters().map(chapter => `<a class="knowledge-link" href="#/knowledge/${chapter.id}" data-search="${esc([chapter.title, ...chapter.topics.map(topic => topic.title)].join(' ').toLowerCase())}"><span>${chapter.no}</span><strong>${esc(chapter.title)}</strong><small>${chapter.topics.length}</small></a>`).join('') + '</section><p class="knowledge-nav-caption">算法实验目录</p>';
  }
  function homeHtml() {
    return chapters().map(chapter => `<a class="knowledge-chapter-card" href="#/knowledge/${chapter.id}"><span>第 ${chapter.no} 章</span><strong>${esc(chapter.title)}</strong><small>${chapter.topics.length} 个教材知识主题 · 进入学习 →</small></a>`).join('');
  }
  function formHtml(tool) {
    if (tool === 'complexity') return '<label>规模 n <input name="n" type="number" min="1" max="1000000" value="16"></label><label>循环形式<select name="kind"><option value="linear">i 从 1 到 n</option><option value="triangle">内层 j 从 1 到 i</option><option value="double">i 每轮加倍，i&lt;n</option></select></label>';
    if (tool === 'matrix') return '<label>行数 m<input name="m" type="number" min="1" max="100" value="3"></label><label>列数 n<input name="n" type="number" min="1" max="100" value="4"></label><label>行 i（0起）<input name="i" type="number" min="0" value="2"></label><label>列 j（0起）<input name="j" type="number" min="0" value="1"></label><label>顺序<select name="kind"><option value="row">行优先</option><option value="column">列优先</option></select></label>';
    if (tool === 'compressed-matrix') return '<label>阶数 n<input name="n" type="number" min="1" max="100" value="4"></label><label>行 i（1起）<input name="i" type="number" min="1" value="2"></label><label>列 j（1起）<input name="j" type="number" min="1" value="4"></label><label>矩阵<select name="kind"><option value="symmetric">对称矩阵·下三角行优先</option><option value="lower">下三角·常量区</option><option value="upper">上三角·常量区</option><option value="tridiagonal">三对角·行优先</option></select></label>';
    return '<label>文件块数 N<input name="n" type="number" min="1" max="1000000" value="100"></label><label>初始段数 r<input name="r" type="number" min="1" max="1000" value="10"></label><label>归并路数 k<input name="k" type="number" min="2" max="16" value="3"></label><label>可用缓冲块<input name="buffers" type="number" min="3" max="128" value="4"></label>';
  }
  function compute(tool, values) {
    const integer = (name, min, max) => {
      const value = Number(values[name]);
      if (values[name] == null || String(values[name]).trim() === '' || !Number.isInteger(value) || value < min || value > max) throw new Error(`${name} 应是 ${min}…${max} 内的整数`);
      return value;
    };
    if (tool === 'complexity') {
      const n = integer('n', 1, 1000000);
      if (values.kind === 'triangle') return `基本操作次数 ${n * (n + 1) / 2}；量级 O(n²)。这是 Σi 的真实频度。`;
      if (values.kind === 'double') return `循环次数 ${Math.ceil(Math.log2(n))}；量级 O(log n)。循环从 i=1 开始，在 i<n 时加倍。`;
      return `循环次数 ${n}；量级 O(n)。这是每项处理一次的模型。`;
    }
    if (tool === 'matrix') {
      const m = integer('m', 1, 100), n = integer('n', 1, 100), i = integer('i', 0, m - 1), j = integer('j', 0, n - 1);
      const offset = values.kind === 'row' ? i * n + j : j * m + i;
      return `0 起元素偏移 ${offset}；若每元素 4 字节，则字节偏移 ${4 * offset}。地址还须加基址。`;
    }
    if (tool === 'compressed-matrix') {
      const n = integer('n', 1, 100), i = integer('i', 1, n), j = integer('j', 1, n);
      const triangle = n * (n + 1) / 2;
      if (values.kind === 'tridiagonal') return Math.abs(i - j) > 1 ? '带外为固定零，不分配存储槽；三条对角线共 3n−2 个槽。' : `k=${2 * i + j - 3}（0起）；共 ${3 * n - 2} 个槽。`;
      if (values.kind === 'lower') return `k=${i >= j ? i * (i - 1) / 2 + j - 1 : triangle}（0起）；共 ${triangle + 1} 个槽，最后槽存常量区。`;
      if (values.kind === 'upper') return `k=${i <= j ? (i - 1) * (2 * n - i + 2) / 2 + j - i : triangle}（0起）；共 ${triangle + 1} 个槽，最后槽存常量区。`;
      const r = Math.max(i, j), c = Math.min(i, j);
      return `对称到 (${r},${c})，k=${r * (r - 1) / 2 + c - 1}（0起）；共 ${triangle} 个槽。`;
    }
    const n = integer('n', 1, 1000000), r = integer('r', 1, Math.min(n, 1000)), k = integer('k', 2, 16), buffers = integer('buffers', 3, 128);
    if (buffers < k + 1) throw new Error('每路一块输入缓冲、另需一块输出缓冲：至少 k+1 块');
    let current = r, passes = 0;
    const levels = [r];
    while (current > 1) { current = Math.ceil(current / k); passes++; levels.push(current); }
    const dummy = (k - 1 - ((r - 1) % (k - 1))) % (k - 1);
    return `段数 ${levels.join(' → ')}；归并 ${passes} 趟。完整读写模型的归并 I/O ${2 * n * passes} 块，连同普通初始段生成 ${2 * n * (passes + 1)} 块。最佳 k 叉树需补 ${dummy} 个零权虚段；不等长段的真实成本仍需计算 WPL。`;
  }
  function render(id, host) {
    const chapter = chapters().find(item => item.id === id);
    if (!chapter) return null;
    const usedTools = new Set();
    const labById = new Map(g.DS.Content.experiments.map(experiment => [experiment.id, experiment]));
    host.innerHTML = `<header class="knowledge-head"><p class="eyebrow">王道教材知识主线 · 第 ${chapter.no} 章</p><h1>${esc(chapter.title)}</h1><p>依据本地 2027 版教材的 ${chapter.topics.length} 个知识主题核对；讲解与小例独立编写，配合原有实验学习。</p></header><details class="knowledge-outline"><summary>本章知识点导航</summary><nav>${chapter.topics.map(topic => `<button type="button" data-topic="${topic.id}">${topic.id} ${esc(topic.title)}</button>`).join('')}</nav></details>` + chapter.topics.map(topic => {
      const topicId = 'wd-topic-' + topic.id.replace(/\./g, '-');
      const labs = (topic.labs || []).filter(lab => labById.has(lab));
      let tool = '';
      if (topic.tool && !usedTools.has(topic.tool)) {
        usedTools.add(topic.tool);
        tool = `<section class="knowledge-tool" data-tool="${topic.tool}"><h3>动手核对计算</h3><form>${formHtml(topic.tool)}<button type="submit">计算</button></form><output aria-live="polite"></output></section>`;
      }
      return `<article class="knowledge-topic" id="${topicId}" data-wangdao-topic="${topic.id}"><div class="knowledge-topic-head"><h2>${topic.id} ${esc(topic.title)}</h2><span>教材 PDF 第 ${topic.pdfPage} 页</span></div>${topic.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}<ul>${topic.rules.map(rule => `<li>${esc(rule)}</li>`).join('')}</ul><aside class="knowledge-example"><strong>原创核对小例</strong><p>${esc(topic.example)}</p></aside>${tool}${labs.length ? `<div class="knowledge-lab-links"><span>关联实验</span>${labs.map(lab => `<a href="#/lab/${lab}">${esc(labById.get(lab).title)} ↗</a>`).join('')}</div>` : ''}</article>`;
    }).join('') + `<footer class="knowledge-footer">${chapter.no > 1 ? `<a href="#/knowledge/ch${chapter.no - 1}">← 上一章</a>` : '<span></span>'}<a href="#/">实验概览</a>${chapter.no < 8 ? `<a href="#/knowledge/ch${chapter.no + 1}">下一章 →</a>` : '<span></span>'}</footer>`;
    host.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => host.querySelector('#wd-topic-' + button.dataset.topic.replace(/\./g, '-'))?.scrollIntoView({ block: 'start', behavior: g.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })));
    host.querySelectorAll('[data-tool]').forEach(section => {
      const form = section.querySelector('form'), output = section.querySelector('output');
      const update = event => {
        event?.preventDefault();
        try { output.textContent = compute(section.dataset.tool, Object.fromEntries(new FormData(form))); output.classList.remove('error'); }
        catch (error) { output.textContent = error.message; output.classList.add('error'); }
      };
      form.addEventListener('submit', update);
      form.addEventListener('input', update);
      update();
    });
    return chapter;
  }
  g.DS.WangdaoView = { navHtml, homeHtml, render, compute };
})(globalThis);
