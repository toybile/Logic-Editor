const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true});try{const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(path.resolve(__dirname,'../../../index.html'),'utf8')}));await page.goto('https://lp.test');
for(const theme of ['light','dark','indigo-light','indigo-dark','petroleum','graphite','sand','sage']){
 await page.evaluate(theme=>{ui.theme=theme;delete ui.backgroundTranslucency;applyUI();openBackgroundThemes();},theme);
 const toggle=page.locator('.hy-theme-dialog .hy-theme-translucency-input');assert.equal(await toggle.isChecked(),!['light','dark'].includes(theme));
 const before=await page.evaluate(()=>JSON.stringify(rows));
 await toggle.uncheck();assert.equal(await page.locator('#lp-hybrid').evaluate(e=>getComputedStyle(e).backgroundImage),'none');
 await toggle.check();assert((await page.locator('#lp-hybrid').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('radial-gradient'));
 assert.equal(await page.evaluate(()=>JSON.stringify(rows)),before);
 assert.equal(await page.locator('.hy-theme-translucency-input').evaluateAll(es=>es.every(e=>e.checked)),true);
 await page.keyboard.press('Escape');await page.reload();assert.equal(await page.evaluate(()=>ui.backgroundTranslucency),true);assert.equal(await page.locator('#lp-hybrid').getAttribute('data-translucency'),'true');
}
await page.evaluate(()=>{ui.language='en';applyLanguage();openBackgroundThemes();});assert.equal(await page.locator('.hy-theme-dialog label').innerText(),'Translucency');await page.keyboard.press('Escape');
await page.evaluate(()=>{ui.backgroundTranslucency=false;ui.theme='sage';applyUI();});await page.reload();assert.equal(await page.locator('#lp-hybrid').evaluate(e=>getComputedStyle(e).backgroundImage),'none');
await page.setViewportSize({width:1024,height:768});await page.evaluate(()=>openBackgroundThemes());const box=await page.locator('.hy-theme-dialog').boundingBox();assert(box.x>=0&&box.x+box.width<=1024);assert.equal(await page.locator('.hy-theme-dialog .hy-theme-option').count(),8);assert.deepEqual(errors,[]);console.log('Translucency: eight themes, solid/mixed backgrounds, synchronized controls, persistence, unchanged arguments, English and desktop geometry passed');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
