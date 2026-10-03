const {test,expect}=require('../../数据结构可视化/node_modules/@playwright/test');
const nodeId='operating-systems:ch4-s2';
test('mastery panel distinguishes a Jev-assisted score from a rule-only score',async({page})=>{
  const payload={nodeId,subject:'operating-systems',title:'文件目录',chapter:'文件管理',status:'EVALUATED',mastery:{score:84,level:'PROFICIENT',label:'熟练掌握'},stability:70,reviewUrgency:4,attemptCount:6,reviewCount:0,weakness:null,recommendation:{label:'继续学习'},breakdown:{ruleScore:83.2,jevScore:90.3,confidence:0.67}};
  await page.route('**/api/knowledge/mastery?**',route=>route.fulfill({json:payload}));
  await page.goto('/subjects/operating-systems/index.html#ch4-s2');
  await page.locator('.zx-mastery-badge').click();
  await expect(page.locator('.zx-mastery-panel')).toContainText('规则 + Jev');
  await expect(page.locator('.zx-mastery-panel')).toContainText('90.3');
  await page.unroute('**/api/knowledge/mastery?**');
  await page.route('**/api/knowledge/mastery?**',route=>route.fulfill({json:{...payload,breakdown:{ruleScore:83.2,jevScore:null,confidence:0.67}}}));
  await page.reload();await page.locator('.zx-mastery-badge').click();
  await expect(page.locator('.zx-mastery-panel')).toContainText('规则评估');
  await expect(page.locator('.zx-mastery-panel')).not.toContainText('规则 + Jev');
});
test('unverified source metadata is never presented as a past exam',async({page})=>{
  await page.goto('/subjects/operating-systems/index.html#ch4-s2');
  await page.evaluate(nodeId=>{
    const q=window.ZhixuQuestions[nodeId][0];
    q.source={kind:'past-exam',verified:false,year:2023,paper:'测试夹具',questionNo:1,url:'https://example.com/paper.pdf'};
    window.ZhixuQuiz.open(nodeId,'来源核验测试');
  },nodeId);
  await expect(page.locator('.zx-quiz-q')).not.toHaveCount(0);
  await expect(page.locator('.zx-quiz-source')).toHaveCount(0);
});

test('navigating to another lesson closes the old quiz before an answer can be recorded under the new node',async({page})=>{
  await page.goto('/subjects/operating-systems/index.html#ch4-s2');
  await page.locator('#zxQuizEntry button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.evaluate(()=>{location.hash='#ch4-s3'});
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('#zxQuizEntry button').click();
  await expect(page.getByRole('dialog')).toContainText('文件系统实现');
});

test('reviewed answer grading supports wrong answers, retry and versioned learning events',async({page})=>{
  await page.goto('/subjects/operating-systems/index.html#ch4-s2');
  const target=await page.evaluate(nodeId=>{
    const q=window.ZhixuQuestions[nodeId].find(q=>q.id==='os-dir-4-r2');
    window.qaEvents=[];
    window.Zhixu.mastery.track=(type,data)=>window.qaEvents.push({type,data});
    window.ZhixuQuiz.open(nodeId,'硬链接');
    return {index:window.ZhixuQuestions[nodeId].indexOf(q),correct:q.options[q.answer]};
  },nodeId);
  const question=page.locator('.zx-quiz-q').nth(target.index);
  const correct=question.locator('.zx-quiz-option').filter({hasText:target.correct});
  const wrong=question.locator('.zx-quiz-option').filter({hasNotText:target.correct}).first();
  await wrong.click();
  await question.locator('[data-role="submit"]').click();
  await expect(question.locator('.zx-quiz-feedback')).toHaveText('回答错误');
  await expect(question.locator('[data-role="explain"]')).toBeVisible();
  await question.locator('[data-role="submit"]').click();
  await expect(question.locator('[data-role="explain"]')).toBeHidden();
  await correct.click();
  await question.locator('[data-role="submit"]').click();
  await expect(question.locator('.zx-quiz-feedback')).toHaveText('回答正确');
  const events=await page.evaluate(()=>window.qaEvents.filter(e=>e.type==='QUESTION_SUBMIT'));
  expect(events.map(e=>e.data.correct)).toEqual([false,true]);
  expect(events.map(e=>e.data.attempt)).toEqual([1,2]);
  expect(events.every(e=>e.data.questionBankVersion==='question-quality-20261002-r2')).toBeTruthy();
});

test('every reviewed question grades a wrong choice and a shuffled correct choice accurately',async({page})=>{
  test.setTimeout(90000);
  const manifest=require('../../docs/question-audit/final-manifest.json');
  let total=0;
  for(const subject of Object.keys(manifest.subjects)){
    await page.goto('/subjects/'+subject+'/index.html');
    const result=await page.evaluate(subject=>{
      const failures=[];
      let checked=0;
      const events=[];
      window.Zhixu.mastery.track=(type,data)=>{if(type==='QUESTION_SUBMIT')events.push(data)};
      for(const entry of window.Zhixu.catalog.entries.filter(e=>e.subject===subject)){
        const nodeId=subject+':'+entry.hash.replace(/^#\/?/,'');
        window.ZhixuQuiz.open(nodeId,entry.title);
        const data=[...(window.ZhixuQuestions[nodeId]||[]),...(window.ZhixuPastExamQuestions[nodeId]||[])];
        const sections=[...document.querySelectorAll('.zx-quiz-q')];
        data.forEach((q,index)=>{
          const section=sections[index];
          const options=[...section.querySelectorAll('.zx-quiz-option')];
          const correct=options.find(label=>label.querySelector('span').textContent.replace(/^[A-Z]\.\s*/,'')===q.options[q.answer]);
          const wrong=options.find(label=>label!==correct);
          if(!correct||!wrong){failures.push(q.id+': option mapping');return;}
          const submit=section.querySelector('[data-role="submit"]');
          const choose=label=>{const input=label.querySelector('input');input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));};
          choose(wrong);submit.click();
          if(section.querySelector('.zx-quiz-feedback').textContent!=='回答错误')failures.push(q.id+': wrong marked correct');
          submit.click();choose(correct);submit.click();
          if(section.querySelector('.zx-quiz-feedback').textContent!=='回答正确')failures.push(q.id+': correct marked wrong');
          const attempts=events.filter(e=>e.questionId===q.id);
          if(attempts.length!==2||attempts[0].correct!==false||attempts[1].correct!==true)failures.push(q.id+': recorded result');
          checked++;
        });
        document.querySelector('.zx-quiz-close').click();
      }
      return {checked,failures};
    },subject);
    expect(result.failures,subject).toEqual([]);
    expect(result.checked).toBe(manifest.subjects[subject].final);
    total+=result.checked;
  }
  expect(total).toBe(manifest.summary.finalQuestions);
});

test('all 248 reviewed quizzes fit inside a 390px mobile dialog',async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width:390,height:844});
  const manifest=require('../../docs/question-audit/final-manifest.json');
  for(const subject of Object.keys(manifest.subjects)){
    await page.goto('/subjects/'+subject+'/index.html');
    const issues=await page.evaluate(subject=>{
      const issues=[];
      window.Zhixu.mastery.track=()=>{};
      for(const entry of window.Zhixu.catalog.entries.filter(e=>e.subject===subject)){
        const nodeId=subject+':'+entry.hash.replace(/^#\/?/,'');
        window.ZhixuQuiz.open(nodeId,entry.title);
        const modal=document.querySelector('.zx-quiz');
        if(modal.scrollWidth>modal.clientWidth+1)issues.push({nodeId,scroll:modal.scrollWidth,width:modal.clientWidth});
        document.querySelector('.zx-quiz-close').click();
      }
      return issues;
    },subject);
    expect(issues,subject).toEqual([]);
  }
});
