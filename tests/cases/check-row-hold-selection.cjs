const {launch,open,assert}=require('../mobile-runtime.cjs');
(async()=>{const browser=await launch();try{for(const width of [320,390,1440])for(const continuous of [true,false]){
 const {p,c,errors,gesture,fits}=await open(browser,width,1100);
 const click=l=>width===1440?l.click():l.tap();
 if(continuous)await click(p.locator('#writing-mode-toggle'));
 await p.waitForTimeout(850);
 const original=await p.evaluate(()=>JSON.stringify(rows));
 const field=i=>p.locator('#rows>.hy-row').nth(i).locator(continuous?'.hy-continuous-field':'.hy-block').first();
 async function hold(locator){
  if(width===1440){await locator.hover();await p.mouse.down();await p.waitForTimeout(250);await p.mouse.up();await p.waitForTimeout(450);}
  else {await gesture(locator,0,0,250);await p.waitForTimeout(450);}
 }
 assert.equal(await p.locator('.hy-select-mode').count(),0,'selection button removed');
 await hold(field(0));
 assert.equal(await p.locator('#rows>.hy-line-selected').count(),1);
 assert.equal(await p.locator('#lp-hybrid').getAttribute('data-select-lines'),'true');
 assert(await p.locator('#add-line').isDisabled());
 await hold(field(1));assert.equal(await p.locator('#rows>.hy-line-selected').count(),2,'hold adds the held row');
 await hold(field(1));assert.equal(await p.locator('#rows>.hy-line-selected').count(),2,'holding selected row keeps selection');
 await click(p.locator('.hy-line-select').nth(0));assert.equal(await p.locator('#rows>.hy-line-selected').count(),1);
 assert.equal(await p.locator('#lp-hybrid').getAttribute('data-select-lines'),'true');
 await click(p.locator('.hy-line-select').nth(1));
 assert.equal(await p.locator('#lp-hybrid').getAttribute('data-select-lines'),'false','last deselection exits mode');
 assert(await p.locator('.hy-line-select').first().isHidden());assert(await p.locator('#add-line').isEnabled());
 assert(await p.locator('.hy-bulk-delete').isHidden());assert.equal(await p.evaluate(()=>JSON.stringify(rows)),original);
 await hold(field(0));await click(field(0));assert.equal(await p.locator('#lp-hybrid').getAttribute('data-select-lines'),'false','click row deselects last row');
 // Keyboard alternative on the existing move handle.
 await p.locator('.hy-row-move-handle').first().dispatchEvent('keydown',{key:' '});
 assert.equal(await p.locator('#rows>.hy-line-selected').count(),1);
 await p.locator('.hy-row-move-handle').first().dispatchEvent('keydown',{key:' '});
 assert.equal(await p.locator('#lp-hybrid').getAttribute('data-select-lines'),'false');
 const layout=await p.evaluate(()=>{const add=document.querySelector('#add-line').getBoundingClientRect(),history=document.querySelector('.hy-history-split').getBoundingClientRect(),bar=document.querySelector('.hy-line-controls').getBoundingClientRect();return{a:add.x,b:history.x,end:history.right,barEnd:bar.right}});
 assert(layout.b>layout.a+50,'add and history separated');assert(Math.abs(layout.end-layout.barEnd)<2,'history right aligned');
 await fits();await p.screenshot({path:`test-artifacts/row-selection-${width}-${continuous?'continuous':'blocks'}.png`,fullPage:true});
 assert.deepEqual(errors,[]);await c.close();console.log(width+'px '+(continuous?'continuous':'blocks')+': hold adds rows, repeated hold preserves selection, last deselection exits, keyboard toggle, separated toolbar, text unchanged');
}}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
