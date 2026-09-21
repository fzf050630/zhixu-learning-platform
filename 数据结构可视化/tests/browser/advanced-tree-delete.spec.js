const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const url=pathToFileURL(path.resolve(__dirname,'../../index.html')).href;

test('红黑树删除：默认案例演示双黑修复四情形，状态表标出双黑结点',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'#/lab/red-black-tree');
  await expect(page.locator('#input-deletes')).toHaveValue('20, 22, 25, 28');
  await page.locator('#applyInputBtn').click();
  await expect(page.locator('#stepCounter')).toHaveText(/^01/);
  let sawDouble=false,sawFixup=false,sawDeleted=false;
  const cases=new Set();
  while(await page.locator('#nextBtn').isEnabled()){
    await page.locator('#nextBtn').click();
    const message=await page.locator('#stepMessage').innerText();
    const tables=await page.locator('#stateTables').innerText();
    if(tables.includes('双黑'))sawDouble=true;
    const hit=/情形([①②③④])/.exec(message);
    if(hit){sawFixup=true;cases.add(hit[1]);}
    if(/删除完成/.test(message))sawDeleted=true;
  }
  expect(sawDouble).toBe(true);
  expect(sawFixup).toBe(true);
  expect(sawDeleted).toBe(true);
  expect([...cases].sort()).toEqual(['①','②','③','④']);
  await expect(page.locator('#stepMessage')).toContainText('找到关键字 18');
  expect(errors).toEqual([]);
});

test('B+ 树删除：借位或合并后仍能查到剩余关键字，且已删关键字不再出现',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'#/lab/b-plus-tree');
  await expect(page.locator('#input-deletes')).toHaveValue('15, 18, 12');
  await page.locator('#applyInputBtn').click();
  const phases=[];
  while(await page.locator('#nextBtn').isEnabled()){
    await page.locator('#nextBtn').click();
    phases.push(await page.locator('#stepMessage').innerText());
  }
  expect(phases.some(m=>/借位/.test(m))).toBe(true);
  expect(phases.some(m=>/合并/.test(m))).toBe(true);
  await expect(page.locator('#stepMessage')).toContainText('找到关键字 22');
  const tables=await page.locator('#stateTables').innerText();
  expect(tables).toMatch(/关键字|索引|叶子/);
  for(const gone of ['12','15','18']) expect(tables).not.toMatch(new RegExp('(^|[\\s,])'+gone+'([\\s,]|$)'));
  expect(errors).toEqual([]);
});

test('AVL 删除：默认预设触发多次旋转，非法删除序列保留当前案例',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'#/lab/avl-rotations');
  await expect(page.locator('#input-values')).toHaveValue(/70, 60, 50/);
  await page.locator('#applyInputBtn').click();
  let sawTwoRotations=false,sawSuccessor=false;
  while(await page.locator('#nextBtn').isEnabled()){
    await page.locator('#nextBtn').click();
    const message=await page.locator('#stepMessage').innerText();
    if(/共旋转 2 次/.test(message))sawTwoRotations=true;
    if(/中序后继/.test(message))sawSuccessor=true;
    if(sawTwoRotations&&sawSuccessor)break;
  }
  expect(sawTwoRotations).toBe(true);
  expect(sawSuccessor).toBe(true);
  const before=await page.locator('#stateTables').innerText();
  await page.locator('#input-deletes').fill('oops');
  await page.locator('#applyInputBtn').click();
  await expect(page.locator('#inputError')).toContainText('删除序列');
  expect(await page.locator('#stateTables').innerText()).toBe(before);
  await page.locator('#input-values').fill('70, 70');
  await page.locator('#applyInputBtn').click();
  await expect(page.locator('#inputError')).toContainText('互不相同');
  await page.locator('#presetInputBtn').click();
  await expect(page.locator('#stepCounter')).toHaveText(/^01/);
  expect(errors).toEqual([]);
});
