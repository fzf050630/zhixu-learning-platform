const { test, expect } = require('../../数据结构可视化/node_modules/@playwright/test');

const origin = process.env.ZHIXU_TABLET_ORIGIN || 'http://127.0.0.1:8766';
const nodeId = 'data-structures:lab/heap-insert';

test('single-choice answer positions vary and remapped answers still score correctly', async ({ page }) => {
  await page.goto(`${origin}/subjects/data-structures/index.html#/lab/heap-insert`);
  await page.evaluate(({ nodeId }) => window.ZhixuQuiz.open(nodeId, '大根堆插入与上调'), { nodeId });

  const answerPositions = await page.evaluate(({ nodeId }) => {
    const questions = window.ZhixuQuestions[nodeId];
    const sections = [...document.querySelectorAll('.zx-quiz-q')];
    return questions.map((question, index) => {
      const correctText = question.options[question.answer];
      const correctOption = [...sections[index].querySelectorAll('.zx-quiz-option')]
        .find(option => option.innerText.includes(correctText));
      return { type: question.type, key: correctOption && correctOption.dataset.key };
    });
  }, { nodeId });

  const singlePositions = answerPositions.filter(answer => answer.type === 'single').map(answer => answer.key);
  expect(new Set(singlePositions).size, 'single-choice answers should not all occupy the same letter').toBeGreaterThanOrEqual(2);

  const questions = page.locator('.zx-quiz-q');
  for (let index = 0; index < await questions.count(); index += 1) {
    const question = questions.nth(index);
    const correctText = await page.evaluate(({ nodeId, index }) => {
      const question = [
        ...(window.ZhixuQuestions[nodeId] || []),
        ...(window.ZhixuPastExamQuestions[nodeId] || []),
      ][index];
      return question.options[question.answer];
    }, { nodeId, index });
    await question.locator('.zx-quiz-option').filter({ hasText: correctText }).click();
    await question.locator('[data-role="submit"]').click();
    await expect(question.locator('.zx-quiz-feedback')).toHaveText('回答正确');
  }
});


test('all reviewed lesson self-tests expose their actual variable question counts', async ({ page }) => {
  const manifest=require('../../docs/question-audit/final-manifest.json');
  let totalNodes=0, totalQuestions=0;
  for(const subject of Object.keys(manifest.subjects)) {
    await page.goto(`${origin}/subjects/${subject}/index.html`);
    const results=await page.evaluate(subject=>window.Zhixu.catalog.entries.filter(e=>e.subject===subject).map(entry=>{
      const nodeId=entry.subject+':'+entry.hash.replace(/^#\/?/,'');
      return {nodeId,count:window.ZhixuQuiz.countFor(nodeId),practice:(window.ZhixuQuestions[nodeId]||[]).length};
    }),subject);
    for(const row of results) {
      expect(row.count,row.nodeId).toBe(manifest.nodes[row.nodeId].count);
      expect(row.practice,row.nodeId).toBeGreaterThan(0);
      totalQuestions+=row.count;
    }
    totalNodes+=results.length;
  }
  expect(totalNodes).toBe(248);
  expect(totalQuestions).toBe(manifest.summary.finalQuestions);
});
