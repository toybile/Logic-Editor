const {launch,open,assert,fs}=require('../mobile-runtime.cjs');
(async()=>{
 const browser=await launch();
 try {
  const initial=await open(browser,1440,1000);
  const c=await browser.newContext({storageState:await initial.c.storageState(),viewport:{width:1440,height:1000},reducedMotion:'reduce',locale:'en'});
  await initial.c.close();
  const p=await c.newPage(),errors=[];
  p.on('pageerror',error=>errors.push(error.message));
  await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('index.html','utf8')}));
  await p.goto('https://lp.test');
  await p.evaluate(()=>{ui.writingMode='continuous';drawRows();});
  const button=p.locator('.hy-proposition-descriptions'), dialog=p.locator('[data-feature=descriptions]');
  await button.click();
  await dialog.locator('input').first().fill('Rain <strong>literal</strong>');
  await dialog.locator('input').nth(1).fill('Wet ground');
  await dialog.locator('[type=submit]').click();
  assert((await p.locator('.hy-continuous-field').first().getAttribute('data-description-hint')).includes('Rain <strong>literal</strong>'));
  await p.locator('.hy-continuous-field').first().hover();
  await p.waitForTimeout(800);
  assert((await p.locator('.lp-unified-hint').innerText()).includes('Rain <strong>literal</strong>'));
  assert.equal(await p.locator('.lp-unified-hint strong').count(),0);
  await button.click();
  await dialog.locator('input').first().fill('Discard this');
  await p.keyboard.press('Escape');
  await button.click();
  assert.equal(await dialog.locator('input').first().inputValue(),'Rain <strong>literal</strong>');
  await dialog.locator('input').nth(1).fill('');
  await dialog.locator('[type=submit]').click();
  assert(!(await p.locator('#preview').getAttribute('data-description-hint')).includes('Wet ground'));
  await p.evaluate(()=>{
   const previous=argumentWorkspace.activeId;
   argumentWorkspace.documents.push({id:'other',name:'Other',rows:[{text:'A',role:'premise'}],descriptions:{A:'Different meaning'},numbered:true});
   showArgument('other');
   window.testPreviousArgument=previous;
  });
  assert.equal(await p.locator('.hy-continuous-field').first().getAttribute('data-description-hint'),'A — Different meaning');
  await p.evaluate(()=>showArgument(window.testPreviousArgument));
  assert((await p.locator('.hy-continuous-field').first().getAttribute('data-description-hint')).includes('Rain'));
  for(const key of ['editor','preview']) {
   await p.evaluate(key=>root.dispatchEvent(new CustomEvent('lp-open-panel-appearance',{detail:{key}})),key);
   const appearance=p.locator('.hy-panel-appearance-dialog');
   const select=appearance.getByRole('combobox',{name:'Formula font'});
   for(const [font,name] of [['georgia','Georgia'],['times','Times New Roman'],['sans','Segoe UI'],['mono','Consolas'],['math','Cambria Math']]) {
    await select.selectOption(font);
    const actual=await p.locator(key==='editor'?'.hy-continuous-field':'#preview').first().evaluate(e=>getComputedStyle(e).fontFamily);
    assert(actual.includes(name),key+' '+font+' '+actual);
   }
   await select.selectOption(key==='editor'?'mono':'georgia');
   await appearance.screenshot({path:'test-artifacts/font-'+key+'-desktop.png'});
   await appearance.locator('[data-close]').click();
  }
  await p.reload();
  assert((await p.locator('.hy-continuous-field').first().evaluate(e=>getComputedStyle(e).fontFamily)).includes('Consolas'));
  assert((await p.locator('#preview').evaluate(e=>getComputedStyle(e).fontFamily)).includes('Georgia'));
  await p.evaluate(()=>{ui.writingMode='blocks';drawRows();});
  assert((await p.locator('.hy-block').first().evaluate(e=>getComputedStyle(e).fontFamily)).includes('Consolas'));
  await button.click();
  assert.equal(await dialog.locator('input').first().inputValue(),'Rain <strong>literal</strong>');
  await dialog.screenshot({path:'test-artifacts/descriptions-desktop.png'});
  assert.deepEqual(errors,[]);
  await c.close();
  console.log('Desktop descriptions: save/cancel/erase, literal text, hints, document isolation, reload; five independent panel fonts passed.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
