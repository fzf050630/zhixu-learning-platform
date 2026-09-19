const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const url=pathToFileURL(path.resolve(__dirname,'../../index.html')).href;

// Observe actual renderer inputs without adding a production-only test API.
async function observe(page) {
  await page.evaluate(()=>{
    const render=DS.Renderers.graph;
    window.frames=[];
    DS.Renderers.graph=(canvas,state,options)=>{
      window.frames.push(structuredClone({state,layout:options.layout}));
      return render(canvas,state,options);
    };
  });
}
for(const dpr of [1,2])for(const width of [320,390,1440]){
  test('mouse drag '+width+'px DPR '+dpr,async({browser})=>{
    const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:dpr});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.clock.install();
    await page.goto(url+'#/lab/dijkstra');
    await observe(page);
    await page.locator('#playBtn').click();
    const canvas=page.locator('#stageCanvas');
    await canvas.scrollIntoViewIfNeeded();
    const r=await canvas.boundingBox();
    await page.mouse.move(r.x+r.width*.12,r.y+r.height*.45);
    await page.mouse.down();
    const state=await page.evaluate(()=>frames.at(-1).state);
    const counter=await page.locator('#stepCounter').innerText();
    await page.mouse.move(r.x+r.width*.22,r.y+r.height*.57,{steps:8});
    await page.mouse.up();
    const moved=await page.evaluate(()=>frames.at(-1));
    expect(moved.layout.A.x).toBeCloseTo(.22,2);
    expect(moved.layout.A.y).toBeCloseTo(.57,2);
    expect(moved.state).toEqual(state);
    await page.clock.runFor(3000);
    await expect(page.locator('#stepCounter')).toHaveText(counter);
    await expect(page.locator('#playBtn')).toHaveText('播放');
    await page.locator('#nextBtn').click();
    await page.locator('#prevBtn').click();
    expect(await page.evaluate(()=>frames.at(-1).layout)).toEqual(moved.layout);
    await page.evaluate(()=>document.getElementById('themeBtn').click());
    expect(await page.evaluate(()=>frames.at(-1).layout)).toEqual(moved.layout);
    await page.setViewportSize({width:width===1440?390:1440,height:900});
    await expect.poll(()=>page.evaluate(()=>frames.at(-1).layout.A.x)).toBeCloseTo(.22,2);
    expect(errors).toEqual([]);
    await context.close();
  });
}
test('touch cancellation, edge clamping and route disposal release capture',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:900},hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'#/lab/dijkstra');
  await observe(page);
  const canvas=page.locator('#stageCanvas');
  await canvas.scrollIntoViewIfNeeded();
  const r=await canvas.boundingBox();
  const cdp=await context.newCDPSession(page);
  const touch=async(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{x,y,id:1}]});
  await touch('touchStart',r.x+r.width*.12,r.y+r.height*.45);
  await touch('touchMove',r.x+1,r.y+1);
  const moved=await page.evaluate(()=>frames.at(-1));
  expect(moved.layout.A.x).toBeGreaterThan(0);
  expect(moved.layout.A.y).toBeGreaterThan(0);
  await touch('touchCancel');
  const prior=await page.evaluate(()=>frames.length);
  await touch('touchStart',r.x+r.width*.12,r.y+r.height*.8);
  await touch('touchMove',r.x+r.width*.8,r.y+r.height*.8);
  await touch('touchEnd');
  expect(await page.evaluate(()=>frames.length)).toBe(prior);
  await touch('touchStart',r.x+r.width*moved.layout.A.x,r.y+r.height*moved.layout.A.y);
  await page.evaluate(()=>{location.hash='#/lab/quick-sort';});
  await expect(page.locator('#layoutControls')).toBeHidden();
  await touch('touchEnd');
  await expect(canvas).not.toHaveCSS('touch-action','none');
  await page.evaluate(()=>{location.hash='#/lab/dijkstra';});
  await expect(page.locator('#layoutControls select')).toHaveCount(1);
  await page.getByRole('button',{name:'移动所选节点 →',exact:true}).click();
  expect(await page.evaluate(()=>frames.at(-1).layout.A.x)).toBeCloseTo(.155,5);
  expect(errors).toEqual([]);
  await context.close();
});

