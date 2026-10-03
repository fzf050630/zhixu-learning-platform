const {test,expect}=require('../../数据结构可视化/node_modules/@playwright/test');
const {createCatalog}=require('../../scripts/catalog.cjs');
const catalog=createCatalog();
const entries=catalog.entries;
const id=e=>e.subject+':'+e.hash.replace(/^#\/?/,'');
async function mock(page,{empty=false,fail=false}={}){
  const states=empty?[]:entries.slice(0,3).map((e,i)=>({nodeId:id(e),subject:e.subject,mastery:[0,84,93][i],level:['NOT_MASTERED','PROFICIENT','MASTERED'][i],stability:[20,70,92][i],nextReviewAt:null}));
  await page.route('**/api/session',route=>route.fulfill({json:{userId:'u-map-fixture',token:'test-only',expiresAt:'2099-01-01T00:00:00Z'}}));
  await page.route('**/api/learning/heatmap',route=>fail?route.fulfill({status:503,json:{}}):route.fulfill({json:{overall:{mastery:empty?null:73,evaluatedNodes:states.length,trackedNodes:states.length},subjects:empty?[]:[{subject:'data-structures',title:'数据结构',mastery:73,evaluatedNodes:3,trackedNodes:3,chapters:[]}]}}));
  await page.route('**/api/learning/overview',route=>route.fulfill({json:{evaluatedNodes:states.length,trackedNodes:states.length,states}}));
  await page.route('**/api/learning/reviews',route=>route.fulfill({json:{reviews:[]}}));
}
test('atlas includes all seven subjects and 248 real nodes, preserving weighted score and true zero',async({page})=>{
  await mock(page);await page.goto('/mastery.html');
  await expect(page.locator('#mpStatus')).toContainText('已更新');
  await expect(page.locator('.mp-subject')).toHaveCount(7);
  await expect(page.locator('.mp-cell')).toHaveCount(248);
  await expect(page.locator('#mpOverallScore')).toHaveText('73');
  await expect(page.locator('.mp-cell[data-level="NOT_MASTERED"]')).toHaveCount(1);
  await expect(page.locator('.mp-cell[data-level="NONE"]')).toHaveCount(245);
  await page.locator('.mp-cell').first().click();
  await expect(page.locator('#mpDetailTitle')).toHaveText(entries[0].title);
  await expect(page.locator('#mpDetailScore')).toHaveText('0%');
  await expect(page.locator('#mpDetailLink')).toHaveAttribute('href',/subjects\/data-structures\/index.html#\/lab\/sequence-insert/);
});
test('scope, title search and level filters work with keyboard-accessible node selection',async({page})=>{
  await mock(page);await page.goto('/mastery.html');
  await page.getByRole('button',{name:'考研数学',exact:true}).click();
  await expect(page.locator('.mp-subject')).toHaveCount(3);
  await expect(page.locator('.mp-cell')).toHaveCount(110);
  await page.getByRole('button',{name:'全部科目',exact:true}).click();
  await page.getByRole('searchbox',{name:'搜索节点或章节'}).fill('顺序表插入');
  await expect(page.locator('.mp-cell')).toHaveCount(1);
  await page.locator('.mp-cell').focus();await page.keyboard.press('Enter');
  await expect(page.locator('#mpDetailScore')).toHaveText('0%');
  await page.getByRole('searchbox',{name:'搜索节点或章节'}).fill('');
  await page.getByRole('button',{name:'熟练掌握 75–89',exact:true}).click();
  await expect(page.getByRole('button',{name:'熟练掌握 75–89',exact:true})).toBeFocused();
  await expect(page.locator('.mp-cell')).toHaveCount(1);
  await page.getByRole('button',{name:'全部等级',exact:true}).click();
  await expect(page.locator('.mp-cell')).toHaveCount(248);
});
test('empty and failed requests do not invent mastery scores or hide the curriculum',async({page})=>{
  await mock(page,{empty:true});await page.goto('/mastery.html');
  await expect(page.locator('#mpStatus')).toContainText('已更新');
  await expect(page.locator('#mpOverallScore')).toHaveText('--');
  await expect(page.locator('.mp-cell[data-level="NONE"]')).toHaveCount(248);
  await page.unroute('**/api/learning/heatmap');
  await page.route('**/api/learning/heatmap',route=>route.fulfill({status:503,json:{}}));
  await page.locator('#mpRefresh').click();
  await expect(page.locator('#mpBanner')).toContainText('保留');
  await expect(page.locator('.mp-cell')).toHaveCount(248);
});
test('heatmap fits light and dark tablet/mobile screens and touch cells remain reachable',async({page})=>{
  await mock(page);await page.goto('/mastery.html');
  for(const width of [1400,920,390,320]){
    await page.setViewportSize({width,height:width>600?920:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    const cell=page.locator('.mp-cell').first();await cell.click();
    await expect(page.locator('#mpDetail')).toBeVisible();
    await expect(page.locator('#mpDetailTitle')).toHaveText(entries[0].title);
    await page.locator('#platformTheme').click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  }
});
test('initial backend failure shows a neutral atlas and touch details survive refresh and resizing',async({browser})=>{
  const context=await browser.newContext({viewport:{width:920,height:1400},hasTouch:true,reducedMotion:'reduce'});
  const page=await context.newPage();await mock(page,{fail:true});await page.goto('/mastery.html');
  await expect(page.locator('#mpStatus')).toContainText('暂未读取');
  await expect(page.locator('#mpOverallScore')).toHaveText('--');
  await expect(page.locator('#mpEvaluated')).toHaveText('--');
  await expect(page.locator('.mp-cell')).toHaveCount(248);
  await expect(page.locator('#mpDetail')).toBeHidden();
  await page.locator('.mp-cell').first().click();
  await expect(page.locator('#mpDetail')).toBeVisible();
  await page.locator('#mpRefresh').click();
  await expect(page.locator('#mpStatus')).toContainText('暂未读取');
  await expect(page.locator('.mp-cell')).toHaveCount(248);
  await page.locator('.mp-cell').first().click();
  await page.setViewportSize({width:1440,height:1000});
  await expect(page.locator('.mp-workspace > #mpDetail')).toBeVisible();
  await context.close();
});
test('portal learning preview links to the upgraded knowledge atlas',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('zhixu-onboarding-v1','1'));
  await mock(page);await page.goto('/');
  await expect(page.getByRole('link',{name:'查看知识版图'})).toHaveAttribute('href',/mastery\.html$/);
});
