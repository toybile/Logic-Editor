const {launch,open,assert}=require('../mobile-runtime.cjs');
(async()=>{
 const browser=await launch();
 try {
  for(const width of [390,1440]) for(const mode of ['blocks','continuous']) {
   const {p,c,errors}=await open(browser,width,950);
   await p.evaluate(mode=>{
    ui.writingMode=mode;
    rows.splice(0,rows.length,
     {text:'∀x(∃x(F(x) ∧ I(x)) ∧ ∃x(F(x) ∨ ¬I(x)))',role:'premise'},
     {text:'P ∧ (Q',role:'premise'},
     {text:'Hidden',role:'blank'},
     {text:'¬Q',role:'conclusion'});
    drawRows();
   },mode);
   const controls=p.locator('.hy-editor > .hy-section-head');
   const boxes=await Promise.all(['#writing-mode-toggle','#caps-lock','.hy-proposition-descriptions'].map(s=>controls.locator(s).boundingBox()));
   assert(boxes.every(Boolean));
   assert(Math.abs(boxes[0].width-boxes[2].width)<1,'equal button widths');
   assert(Math.abs(boxes[1].x-boxes[0].x-boxes[0].width-(boxes[2].x-boxes[1].x-boxes[1].width))<1,'equal button gaps');
   await p.locator('.hy-proposition-descriptions').click();
   const d=p.locator('.hy-beta-dialog');
   assert.deepEqual(await d.locator('label').evaluateAll(ls=>ls.map(l=>l.firstChild.textContent)),['F','I','P','Q']);
   await d.locator('input').first().fill('Description from premise');
   await d.locator('button[type=submit]').click();
   await p.locator('.hy-proposition-descriptions').click();
   assert.equal(await d.locator('input').first().inputValue(),'Description from premise');
   await d.locator('.hy-beta-close').click();
   assert.deepEqual(errors,[]);
   await c.close();
  }
  console.log('Premise descriptions, persistence and header spacing: 4 cases passed');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
