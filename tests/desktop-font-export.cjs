const {launch,open,assert,fs}=require('./mobile-runtime.cjs');
(async()=>{const b=await launch();try{
 const {p,c,errors}=await open(b,1440,1000);
 await p.evaluate(()=>{ui.panelAppearance.preview.font='georgia';root.dispatchEvent(new Event('lp-ui-colors'));});
 for(const modal of [false,true]){
  if(modal){await p.locator('.hy-logic-button').click();await p.waitForFunction(()=>logicPanel.dataset.state==='valid');}
  assert((await p.locator('#preview').evaluate(e=>getComputedStyle(e).fontFamily)).includes('Georgia'));
  for(const ext of ['.pdf','.png']){
   await p.locator('#download').click();const pending=p.waitForEvent('download');
   await p.locator('#export-formats').getByRole('button',{name:ext,exact:true}).click();
   const d=await pending;assert.equal(await d.failure(),null);
   const bytes=fs.readFileSync(await d.path());
   assert(ext==='.pdf'?bytes.subarray(0,5).toString()==='%PDF-':bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a');
  }
 }
 assert.deepEqual(errors,[]);await c.close();console.log('Desktop selected-font PDF/PNG downloads passed in panel and validation modal');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
