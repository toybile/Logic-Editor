const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
fs.mkdirSync('test-artifacts',{recursive:true});
(async()=>{const b=await chromium.launch({headless:true});try{
 for(const theme of ['light','indigo-dark']){
  const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en',reducedMotion:'reduce'}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(path.resolve(__dirname,'../../../index.html'),'utf8')}));
  await p.goto('https://lp.test');await p.evaluate(theme=>{ui.theme=theme;applyUI();},theme);
  const selector=p.locator('#logic-mode-select'),title=p.locator('.hy-title strong');
  const a=await title.boundingBox(),s=await p.locator('.hy-logic-mode-select').boundingBox();assert(s.y>=a.y+a.height,'selector below title');assert(Math.abs(s.x+s.width/2-a.x-a.width/2)<1,'selector centered on title');assert(s.x>=0&&s.x+s.width<=1440);
  assert(!(await title.innerText()).includes('⌄'));
  const head=await p.locator('.hy-head').boundingBox();assert(Math.abs(s.y-head.y-head.height)<=1,'selector joins header without a gap');
  assert.equal(await p.locator('.hy-logic-mode-select').evaluate(e=>getComputedStyle(e).borderTopWidth),'0px');
  await selector.click();const menu=p.locator('#logic-mode-options');await menu.waitFor({state:'visible'});assert.equal(await menu.getByRole('menuitem').count(),0);assert.equal(await menu.getByRole('menuitemradio').count(),3);const icons=await menu.locator('button svg').evaluateAll(es=>es.map(e=>e.innerHTML));assert.equal(new Set(icons).size,3,'distinct compact icons');assert(!(await menu.innerText()).includes('S · M · P'));const tops=await menu.getByRole('menuitemradio').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().top));assert(Math.abs(tops[0]-tops[1])<1&&tops[2]>tops[0],'two mode cards per row');const bounds=await menu.boundingBox();assert(Math.abs(bounds.x-Math.max(8,s.x+s.width/2-bounds.width/2))<1,'menu centered and clamped');await title.click();assert(await menu.isHidden(),'title toggles closed');await title.click();assert(await menu.isVisible(),'title toggles open');
  assert((await menu.boundingBox()).y>=s.y+s.height);
  await p.screenshot({path:'test-artifacts/mode-selector-'+theme+'.png'});
  await menu.getByRole('menuitemradio',{name:'Classical first-order logic',exact:true}).click();
  assert((await selector.innerText()).includes('First order'));
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
