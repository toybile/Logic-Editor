const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true});try{
 for(const mode of ['blocks','continuous']){
  const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en',reducedMotion:'reduce'}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(mode=>{
    localStorage.setItem('formal-argument-ui',JSON.stringify({language:'en',writingMode:mode,holdDelaySeconds:.5}));
    localStorage.setItem('formal-arguments-v1',JSON.stringify({documents:[{id:'test',name:'Argument 1',rows:[{text:'A',role:'premise'},{text:'B',role:'premise'},{text:'C',role:'conclusion'}],numbered:true}],activeId:'test',nextNumber:2}));
  },mode);
  await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(path.resolve(__dirname,'../../../index.html'),'utf8')}));await p.goto('https://lp.test');
  const row=p.locator('#rows>.hy-row').first(),field=row.locator(mode==='blocks'?'.hy-block':'.hy-continuous-field').first();
  for(const locator of [field,row.locator('.hy-role'),row.locator('.hy-delete-line'),p.locator('[data-action=editor]')]){
   await row.hover();await locator.hover(await locator.evaluate(e=>e.classList.contains('hy-delete-line'))?{position:{x:6,y:18}}:{});await p.mouse.down();await p.waitForTimeout(80);
   assert.equal(await p.locator('.hy-hold-progress:popover-open').count(),0,'quick press has no indicator');
   await p.waitForTimeout(140);assert.equal(await p.locator('.hy-hold-progress:popover-open').count(),1,'intentional hold shows progress');
   await p.keyboard.press('Escape');await p.mouse.up();assert.equal(await p.locator('.hy-hold-progress:popover-open').count(),0);await p.reload();
  }
  await field.hover();await p.mouse.down();await p.waitForTimeout(570);await p.mouse.up();
  assert.equal(await row.getAttribute('class').then(s=>s.includes('hy-line-selected')),true,'configured hold still selects');
  assert.deepEqual(errors,[]);await p.close();
 }
 console.log('Desktop premises: short press hidden, delayed progress and full hold preserved in both writing modes');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
