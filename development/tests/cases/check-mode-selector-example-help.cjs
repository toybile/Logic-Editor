const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
fs.mkdirSync('test-artifacts',{recursive:true});
(async()=>{const b=await chromium.launch({headless:true});try{
 for(const theme of ['light','indigo-dark']){
  const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en',reducedMotion:'reduce'}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(path.resolve(__dirname,'../../../index.html'),'utf8')}));
  await p.goto('https://lp.test');await p.evaluate(theme=>{ui.theme=theme;applyUI();},theme);
  const selector=p.locator('#logic-mode-select'),title=p.locator('.hy-title strong');
  const a=await title.boundingBox(),s=await selector.boundingBox();assert(s.y>=a.y+a.height,'selector below title');assert(s.x>=0&&s.x+s.width<=1440);
  assert(!(await title.innerText()).includes('⌄'));
  await selector.click();const menu=p.locator('#logic-mode-options');await menu.waitFor({state:'visible'});
  assert((await menu.boundingBox()).y>=s.y+s.height);
  await p.screenshot({path:'test-artifacts/mode-selector-'+theme+'.png'});
  await menu.getByRole('menuitemradio',{name:'Classical first-order logic',exact:true}).click();
  assert((await selector.innerText()).includes('Classical first-order logic'));
  await selector.hover();await p.mouse.down();await p.waitForTimeout(600);await p.mouse.up();
  const about=p.locator('.hy-logic-mode-help');await about.waitFor();const reference=await about.evaluate(e=>{const s=getComputedStyle(e);return[s.padding,s.borderRadius,e.getBoundingClientRect().width]});
  await about.getByRole('button',{name:'Close',exact:true}).click();
  await p.evaluate(()=>root.dispatchEvent(new Event('lp-open-argument-examples')));
  await p.locator('.hy-examples-help').click();const help=p.locator('.hy-examples-help-dialog');await help.waitFor();
  assert(await help.evaluate(e=>e.matches(':modal')));
  assert.equal(await p.locator('.hy-examples-help-page').count(),0);
  assert.equal(await p.evaluate(()=>root.hidden||root.inert),false);
  assert.equal(await p.evaluate(()=>location.hash),'');
  assert.deepEqual(await help.evaluate(e=>{const s=getComputedStyle(e);return[s.padding,s.borderRadius,e.getBoundingClientRect().width]}),reference);
  await help.screenshot({path:'test-artifacts/example-help-'+theme+'.png'});
  await p.keyboard.press('Escape');await p.locator('.hy-examples-dialog').waitFor({state:'visible'});
  assert.deepEqual(errors,[]);await p.close();
 }
 console.log('Desktop selector below title, labels, menu, hold help, themed example modal and return to examples passed');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
