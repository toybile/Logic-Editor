const {launch,open,assert}=require('../mobile-runtime.cjs');
(async()=>{const b=await launch();try{
const {p,c,errors,gesture,session}=await open(b,390);const content=await p.evaluate(()=>JSON.stringify(rows));
await p.setViewportSize({width:1440,height:1000});await p.waitForTimeout(200);await p.evaluate(()=>root.dispatchEvent(new CustomEvent('lp-displace-window',{detail:{element:document.querySelector('.hy-panel-frame'),dx:20,dy:60}})));await p.waitForTimeout(250);
const desktop=await p.evaluate(()=>localStorage.getItem('formal-panel-layout-v1'));
for(const [width,height] of [[320,650],[360,780],[390,844],[430,932],[768,1024],[844,390],[900,700],[932,430],[1024,768],[1100,700]]){
await p.setViewportSize({width,height});await p.waitForTimeout(150);
for(const theme of ['light','dark','indigo-light','indigo-dark','petroleum','graphite','sand','sage']){
await p.evaluate(t=>{ui.theme=t;applyUI()},theme);
for(const scale of [80,150]){await p.locator('#scale-writing').evaluate((e,s)=>{e.value=s;e.dispatchEvent(new Event('input',{bubbles:true}))},String(scale));await p.waitForTimeout(30);
const geometry=await p.evaluate(()=>({viewport:innerWidth,doc:document.documentElement.scrollWidth,frames:[...document.querySelectorAll('.hy-panel-frame')].map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom}})}));
assert(geometry.doc<=width+1,JSON.stringify({width,height,theme,scale,geometry}));assert(geometry.frames.every(r=>r.x>=0&&r.right<=width));assert(geometry.frames[1].y>=geometry.frames[0].bottom,'panels stack without overlap');
}
}
// Full-page capture changes Chrome's emulated pointer media during its temporary resize.
await p.locator('#scale-writing').evaluate(e=>{e.value='100';e.dispatchEvent(new Event('input',{bubbles:true}))});await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:`test-artifacts/mobile-layout-${width}x${height}.png`});
assert.equal(await p.evaluate(()=>JSON.stringify(rows)),content);
assert.equal(await p.evaluate(()=>localStorage.getItem('formal-panel-layout-v1')),desktop,'desktop position changed at '+width+'px '+JSON.stringify(await p.evaluate(()=>({coarse:matchMedia('(pointer:coarse)').matches,q:matchMedia('(max-width:900px), (pointer:coarse) and (max-width:1100px)').matches,inner:innerWidth}))));
}
assert.equal(await p.evaluate(()=>localStorage.getItem('formal-panel-layout-v1')),desktop,'mobile must preserve stored desktop positions');
await p.locator('[popovertarget=editor-settings]').first().tap();await p.locator('.hy-layout-recovery-button').tap();assert.equal(await p.locator('.hy-panel-board').getAttribute('data-manual'),'false');assert(await p.locator('.hy-symbol-dock-stack .hy-symbol').first().isVisible());
await p.setViewportSize({width:390,height:420});await p.locator('[popovertarget=editor-settings]').first().tap();await p.locator('#settings-default').tap();const d=p.locator('#default-settings-confirmation'),r=await d.boundingBox();assert(r.x>=0&&r.y>=0&&r.y+r.height<=420);await d.locator('button').last().tap();assert.equal(await p.evaluate(()=>ui.theme),'light');assert.equal(await p.evaluate(()=>JSON.stringify(rows)),content);
await p.locator('#editor-settings').evaluate(e=>{if(e.matches(':popover-open'))e.hidePopover()});await p.setViewportSize({width:390,height:844});await p.waitForTimeout(150);
await p.locator('#new-argument').tap();await p.locator('#new-argument-options button').filter({hasText:'Example'}).tap();assert(await p.locator('.hy-feature-dialog').isVisible());await p.locator('.hy-feature-dialog').getByRole('button',{name:'Close',exact:true}).tap();
await p.evaluate(()=>window.scrollTo(0,0));const tabs=p.locator('.hy-argument-tabs [role=tab]');await gesture(tabs.first(),0,0,650);assert(await p.locator('.hy-argument-card-editor').isVisible());await p.locator('.hy-argument-card-editor button[aria-label=Cancel]').tap();
await p.evaluate(()=>{ui.writingMode='blocks';drawRows();});await p.locator('#rows .hy-block').first().tap();const first=await p.locator('#rows .hy-block').first().inputValue();await gesture(p.locator('.hy-editor'),0,-180);assert.equal(await p.locator('#rows .hy-block').first().inputValue(),first,'vertical swipe must not modify argument');
await p.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});await p.waitForTimeout(200);const point=await p.locator('.hy-work').evaluate(e=>({x:2,y:e.getBoundingClientRect().top+10}));
await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await p.waitForTimeout(650);await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(100);assert(await p.locator('.hy-theme-dialog').isVisible(),'theme picker survives release outside its bounds');assert.equal(await p.locator('.hy-theme-dialog .hy-theme-option').count(),8);await p.locator('.hy-theme-dialog [data-theme-value=petroleum]').tap();assert.equal(await p.evaluate(()=>ui.theme),'petroleum');await p.locator('.hy-theme-dialog button[aria-label=Close]').tap();
assert.deepEqual(errors,[]);await c.close();console.log('8 themes × 10 portrait/landscape sizes × 80/150% writing: no page overflow or overlapping panels; desktop layout saved, reorganize/reset/content retained; examples, underline hold and native scroll passed');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
