const {launch,open,assert,fs}=require('../mobile-runtime.cjs');
(async()=>{const b=await launch();try{for(const width of [320,390,1440]){
 const {p,c,errors,fits}=await open(b,width,1100);
 const click=l=>width===1440?l.click():l.tap();
 await p.waitForTimeout(850);
 const icons=await p.locator('#copy svg,#download svg,.hy-logic-button svg').evaluateAll(es=>es.map(e=>e.innerHTML));
 assert.equal(await p.locator('.hy-argument-panel>.hy-section-head #number-toggle').count(),1);
 assert.equal(await p.locator('.hy-panel-actions #copy').count(),1);
 assert.equal(await p.locator('.hy-panel-actions .hy-logic-button').count(),1);
 for(const theme of ['light','dark','indigo-light','indigo-dark','petroleum','graphite','sand','sage']){
  await p.evaluate(theme=>{ui.theme=theme;applyUI()},theme);
  await click(p.locator('#download'));
  const menu=p.locator('#export-formats');await fits('#export-formats');
  assert.deepEqual(await menu.locator('button').allTextContents(),['TXT','PDF','PNG']);
  const boxes=await menu.locator('button').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().top));assert(Math.max(...boxes)-Math.min(...boxes)<1,'formats one row');
  await p.keyboard.press('Escape');await fits();
 }
 for(const modal of [false,true]){
  if(modal){await click(p.locator('.hy-logic-button'));await p.waitForFunction(()=>logicPanel.dataset.state==='valid');}
  for(const ext of ['.txt','.pdf','.png']){
   await click(p.locator('#download'));const pending=p.waitForEvent('download');
   await click(p.locator('#export-formats').getByRole('button',{name:ext,exact:true}));
   const file=await pending;assert.equal(await file.failure(),null);assert(file.suggestedFilename().endsWith(ext));const bytes=fs.readFileSync(await file.path());
   if(ext==='.txt')assert(bytes.toString('utf8').includes('A → B'));
   if(ext==='.pdf')assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
   if(ext==='.png'){
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert(bytes.readUInt32BE(16)>300);assert(bytes.readUInt32BE(20)>=240);
    fs.writeFileSync('test-artifacts/argument-export-preview.png',bytes);
   }
  }
  if(modal){await click(p.locator('.hy-validation-heading button'));await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});}
 }
 assert.deepEqual(await p.locator('#copy svg,#download svg,.hy-logic-button svg').evaluateAll(es=>es.map(e=>e.innerHTML)),icons,'SVG symbols preserved after moving controls');
 await click(p.locator('[data-action=preview]'));assert(await p.locator('.hy-panel-actions').isHidden());assert(await p.locator('#number-toggle').isHidden());await click(p.locator('[data-action=preview]'));
 await p.screenshot({path:`test-artifacts/header-footer-${width}.png`,fullPage:true});
 assert.deepEqual(errors,[]);await c.close();console.log(width+'px: header adjustments/footer actions, all 8 themes, TXT/PDF/PNG downloads in panel and validation, SVG unchanged, collapse and restoration');
}}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
