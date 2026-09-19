const {test,expect}=require('@playwright/test');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const url=pathToFileURL(path.resolve(__dirname,'../../index.html')).href;
test('deleting nodes reconciles draft edges and invalidates removed start without applying',async({page})=>{
 await page.goto(url+'#/lab/bfs');
 const before=await page.locator('#stateTables').innerText();
 await page.locator('#input-nodes').fill('B C D E F');
 await page.locator('#input-edges').focus();
 await expect(page.locator('#input-start')).toHaveValue('');
 await expect(page.locator('#input-edges')).not.toHaveValue(/A/);
 await expect(page.locator('#inputError')).toContainText('起点已删除');
 expect(await page.locator('#stateTables').innerText()).toBe(before);
 await page.locator('#input-start').fill('B');
 await page.locator('#applyInputBtn').click();
 await expect(page.locator('#inputError')).toBeHidden();
 await page.locator('#presetInputBtn').click();
 await expect(page.locator('#input-start')).toHaveValue('A');
});
test('mobile menu returns focus and hidden navigation cannot receive keyboard focus',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(url+'#/lab/kmp');
 expect(await page.locator('#sidebar').evaluate(e=>e.inert)).toBe(true);
 await page.locator('#menuBtn').click();
 await page.locator('#sideSearch').focus();
 await page.keyboard.press('Escape');
 await expect(page.locator('#menuBtn')).toBeFocused();
 expect(await page.locator('#sidebar').evaluate(e=>e.inert)).toBe(true);
 await page.locator('#input-text').focus();
 await page.keyboard.press('/');
 await expect(page.locator('#input-text')).toBeFocused();
});
test('new interfaces fit desktop and mobile in both themes',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,390,1440])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:1000});
  for(const id of ['bfs','kmp','graph-representations','red-black-tree','b-tree','b-plus-tree']){
   await page.goto(url+'#/lab/'+id);
   await page.evaluate(theme=>{document.documentElement.dataset.theme=theme;window.dispatchEvent(new Event('resize'));},theme);
   await expect(page.locator('#playBtn')).toBeEnabled();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id).toBe(true);
  }
  await page.screenshot({path:'docs/verification/final-'+width+'-'+theme+'.png',fullPage:true});
 }
 expect(errors).toEqual([]);
});

