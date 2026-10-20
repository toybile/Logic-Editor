const {launch,open,assert}=require('../mobile-runtime.cjs');
(async()=>{const browser=await launch();try{for(const width of [390,1440]){
  const {p,c,errors,session,fits}=await open(browser,width,1050);
  const click=l=>width===1440?l.click():l.tap();
  await click(p.locator('#writing-mode-toggle'));
  await p.waitForTimeout(850);
  const initial=await p.evaluate(()=>JSON.stringify(rows));
  const fields=p.locator('#rows .hy-continuous-field');
  await fields.first().scrollIntoViewIfNeeded();
  const a=await fields.first().boundingBox(),b=await fields.nth(1).boundingBox();
  const x=a.x+a.width/2,y=a.y+a.height/2;
  if(width===1440){await p.mouse.move(x,y);await p.mouse.down();}
  else await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await p.waitForTimeout(650);
  assert.equal(await p.locator('#rows>.hy-line-selected').count(),1,'hold selects the formula row');
  assert.equal(await p.locator('#lp-hybrid').getAttribute('data-select-lines'),'true','holding field selects rows');
  assert.equal(await p.evaluate(()=>JSON.stringify(rows)),initial);
  const dy=b.y+b.height/2-y+15;
  for(let step=1;step<=15;step++){
    if(width===1440)await p.mouse.move(x,y+dy*step/15);
    else await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+dy*step/15}]});
    await p.waitForTimeout(15);
  }
  assert.equal(await p.locator('.drag-ghost.lifted').count(),1,'drag begins inside formula');
  if(width===1440)await p.mouse.up();
  else await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await p.waitForTimeout(450);
  assert.deepEqual(await p.evaluate(()=>rows.map(r=>r.text)),['A','A → B','B']);
  await p.waitForTimeout(350);await p.locator('.hy-undo-lines').press('Enter');await p.waitForFunction(snapshot=>JSON.stringify(rows)===snapshot,initial);assert.equal(await p.evaluate(()=>JSON.stringify(rows)),initial);
  await p.locator('.hy-redo-lines').press('Enter');assert.deepEqual(await p.evaluate(()=>rows.map(r=>r.text)),['A','A → B','B']);
  await p.locator('.hy-undo-lines').press('Enter');
  if(width===1440){
    const box=await fields.first().boundingBox();
    await p.mouse.move(box.x+15,box.y+20);await p.mouse.down();
    await p.mouse.move(box.x+65,box.y+20,{steps:8});await p.mouse.up();
    assert.equal(await p.locator('.drag-ghost').count(),0,'horizontal text selection does not reorder');
    assert(await fields.first().evaluate(e=>e.selectionEnd>e.selectionStart));
  }
  await fields.first().focus();await fields.first().press('End');await fields.first().press('Shift+ArrowLeft');
  assert(await fields.first().evaluate(e=>e.selectionEnd-e.selectionStart===1),'keyboard selection retained');
  await fields.first().fill('P → Q');assert((await p.locator('#preview').textContent()).includes('P → Q'));
  await click(p.locator('#writing-mode-toggle'));assert(await p.locator('#rows .hy-block').count()>0);
  await click(p.locator('#writing-mode-toggle'));assert.equal(await fields.first().inputValue(),'P → Q');
  await fits();assert.deepEqual(errors,[]);await c.close();
  console.log(width+'px: hold selects, vertical drag inside continuous field, undo/redo, text editing and block mode retained');
}}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
