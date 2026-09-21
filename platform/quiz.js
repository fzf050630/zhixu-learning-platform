/* 知序 · 自测运行时
   从 window.ZhixuQuestions 读取当前知识节点的题目，弹出答题面板，
   把 QUESTION_START / HINT_OPEN / ANSWER_VIEW / QUESTION_SUBMIT 写入掌握度事件流。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const bank = global.ZhixuQuestions || {};

  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('quiz.css', document.currentScript.src).href;
    document.head.appendChild(link);
  } catch (_) { /* ignore */ }

  const escape = P.escape || (text => String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])));

  let scrim = null;

  function questionsFor(nodeId) {
    return Array.isArray(bank[nodeId]) ? bank[nodeId] : [];
  }

  function has(nodeId) {
    return questionsFor(nodeId).length > 0;
  }

  function countFor(nodeId) {
    return questionsFor(nodeId).length;
  }

  function track(type, data) {
    if (P.mastery && typeof P.mastery.track === 'function') P.mastery.track(type, data);
  }

  function close() {
    if (scrim) { scrim.remove(); scrim = null; }
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function open(nodeId, title) {
    const questions = questionsFor(nodeId);
    if (!questions.length) return;
    close();
    track('QUESTION_START', { questionCount: questions.length });

    const states = questions.map(question => ({
      question,
      selected: null,
      submitted: false,
      correct: null,
      hintUsed: false,
      attempts: 0,
      startedAt: Date.now(),
    }));
    let quizCompleted = false;

    scrim = document.createElement('div');
    scrim.className = 'zx-quiz-scrim';
    scrim.setAttribute('role', 'dialog');
    scrim.setAttribute('aria-modal', 'true');
    scrim.innerHTML =
      '<div class="zx-quiz">' +
      '<div class="zx-quiz-head"><div><h3>自测 · ' + escape(title || '当前节点') + '</h3>' +
      '<p>共 ' + questions.length + ' 题 · 作答结果用于计算你的掌握度</p></div>' +
      '<button class="zx-quiz-close" type="button" aria-label="关闭自测">×</button></div>' +
      '<div class="zx-quiz-body"></div>' +
      '<div class="zx-quiz-summary" hidden></div>' +
      '</div>';

    const body = scrim.querySelector('.zx-quiz-body');
    states.forEach((state, index) => {
      const question = state.question;
      const options = Object.entries(question.options || {});
      const item = document.createElement('section');
      item.className = 'zx-quiz-q';
      item.innerHTML =
        '<p class="zx-quiz-stem"><span class="zx-quiz-no">' + (index + 1) + '.</span>' + escape(question.stem) + '</p>' +
        '<div class="zx-quiz-options">' + options.map(([key, text]) =>
          '<label class="zx-quiz-option" data-key="' + escape(key) + '">' +
          '<input type="radio" name="zx-q-' + index + '" value="' + escape(key) + '">' +
          '<span><span class="zx-quiz-key">' + escape(key) + '.</span> ' + escape(text) + '</span></label>').join('') + '</div>' +
        '<div class="zx-quiz-actions">' +
        '<button class="zx-quiz-btn primary" type="button" data-role="submit">提交</button>' +
        (question.hint ? '<button class="zx-quiz-btn" type="button" data-role="hint">提示</button>' : '') +
        '<span class="zx-quiz-feedback"></span>' +
        '</div>' +
        '<div class="zx-quiz-note" data-role="hint-note" hidden><b>提示</b>' + escape(question.hint || '') + '</div>' +
        '<div class="zx-quiz-note" data-role="explain" hidden><b>解析</b>' + escape(question.explanation || '') + '</div>';

      const feedback = item.querySelector('.zx-quiz-feedback');
      const submitButton = item.querySelector('[data-role="submit"]');
      const hintButton = item.querySelector('[data-role="hint"]');
      const hintNote = item.querySelector('[data-role="hint-note"]');
      const explain = item.querySelector('[data-role="explain"]');

      item.querySelectorAll('input[type="radio"]').forEach(input => {
        input.addEventListener('change', () => {
          if (state.submitted) return;
          state.selected = input.value;
          item.querySelectorAll('.zx-quiz-option').forEach(option => option.classList.remove('correct', 'wrong'));
        });
      });

      if (hintButton) {
        hintButton.addEventListener('click', () => {
          state.hintUsed = true;
          hintNote.hidden = false;
          hintButton.disabled = true;
          track('HINT_OPEN', { questionId: question.id });
        });
      }

      submitButton.addEventListener('click', () => {
        if (state.submitted) {
          state.submitted = false;
          state.selected = null;
          state.startedAt = Date.now();
          item.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; input.disabled = false; });
          item.querySelectorAll('.zx-quiz-option').forEach(option => option.classList.remove('correct', 'wrong'));
          explain.hidden = true;
          feedback.textContent = '';
          submitButton.textContent = '提交';
          return;
        }
        if (!state.selected) { feedback.textContent = '请先选择答案'; feedback.className = 'zx-quiz-feedback no'; return; }
        const correct = state.selected === question.answer;
        state.attempts += 1;
        state.submitted = true;
        state.correct = correct;
        const durationSeconds = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
        track('QUESTION_SUBMIT', {
          questionId: question.id,
          questionType: question.type || 'single',
          correct,
          durationSeconds,
          hintUsed: state.hintUsed,
          attempt: state.attempts,
        });
        track('ANSWER_VIEW', { questionId: question.id });
        item.querySelectorAll('input[type="radio"]').forEach(input => { input.disabled = true; });
        item.querySelectorAll('.zx-quiz-option').forEach(option => {
          const key = option.dataset.key;
          if (key === question.answer) option.classList.add('correct');
          else if (key === state.selected) option.classList.add('wrong');
        });
        feedback.textContent = correct ? '回答正确' : '回答错误';
        feedback.className = 'zx-quiz-feedback ' + (correct ? 'ok' : 'no');
        explain.hidden = false;
        submitButton.textContent = '再试一次';
        renderSummary(states);
        if (!quizCompleted && states.every(item => item.attempts > 0)) {
          quizCompleted = true;
          track('QUIZ_COMPLETE', { questionCount: questions.length });
        }
      });

      body.appendChild(item);
    });

    scrim.querySelector('.zx-quiz-close').addEventListener('click', close);
    scrim.addEventListener('click', event => { if (event.target === scrim) close(); });
    document.addEventListener('keydown', onKeydown);
    document.body.appendChild(scrim);
    scrim.querySelector('.zx-quiz-close').focus();
  }

  function renderSummary(states) {
    if (!scrim) return;
    const answered = states.filter(state => state.attempts > 0);
    if (!answered.length) return;
    const correct = answered.filter(state => state.correct).length;
    const summary = scrim.querySelector('.zx-quiz-summary');
    summary.hidden = false;
    summary.innerHTML = '已作答 <strong>' + answered.length + '</strong> / ' + states.length + ' 题，当前答对 <strong>' + correct + '</strong> 题。' +
      '<br><span style="font-size:12.5px;color:var(--zx-muted,#697587)">完成练习后，掌握度会在你返回或刷新时更新。</span>';
  }

  P.quiz = { has, countFor, open };
  global.ZhixuQuiz = P.quiz;

  // 始终可见的自测入口：不依赖后端，离线（file://）也可用。
  function mountEntry() {
    const mastery = P.mastery;
    const actions = document.querySelector('#platformHeader .zx-header-actions') || document.querySelector('.zx-header-actions');
    if (!actions) return;
    let host = document.getElementById('zxQuizEntry');
    if (!host) {
      host = document.createElement('span');
      host.id = 'zxQuizEntry';
      host.className = 'zx-quiz-entry';
      actions.insertBefore(host, actions.firstChild);
    }
    const node = mastery && mastery.currentNode;
    host.replaceChildren();
    if (!node || !has(node.id)) { host.hidden = true; return; }
    host.hidden = false;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'zx-quiz-entry-btn';
    button.textContent = '自测 · ' + countFor(node.id) + ' 题';
    button.title = '对当前知识节点做自测';
    button.addEventListener('click', () => open(node.id, node.title));
    host.appendChild(button);
  }

  global.addEventListener('hashchange', () => setTimeout(mountEntry, 0));
  global.addEventListener('load', mountEntry);
  setTimeout(mountEntry, 0);
})(window);
