const fs=require('fs'),assert=require('assert/strict');const {chromium}=require('../browser-runtime.cjs');
(async()=>{const b=await chromium.launch({headless:true});try{
const p=await b.newPage({viewport:{width:1440,height:1000},locale:'pt-BR'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('index.html','utf8')}));await p.goto('https://lp.test');
await p.evaluate(()=>{for(let i=0;i<7;i++)createArgument();ui.holdDelaySeconds=.12;});await p.locator('#argument-view-toggle').click();await p.locator('#argument-select').click();await p.waitForTimeout(250);
assert.equal(await p.locator('.hy-argument-insert').count(),0);
const cards=p.locator('#argument-options [role=menuitemradio]');assert.equal(await cards.count(),8);
const boxes=await cards.evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}}));
assert(Math.abs(boxes[0].y-boxes[2].y)<1);assert(boxes[3].y>boxes[0].y);
const add=p.locator('.hy-argument-grid-add'),ab=await add.boundingBox();assert(Math.abs(ab.width-ab.height)<1);assert(Math.abs(ab.height-boxes[0].height)<1,JSON.stringify({ab,first:boxes[0]}));
const initial=await p.evaluate(()=>argumentWorkspace.documents.map(d=>d.id));const first=boxes[0],target=boxes[4];
await p.mouse.move(first.x+first.width/2,first.y+first.height/2);await p.mouse.down();await p.waitForTimeout(60);assert(!await p.locator('.hy-argument-card-ghost').count());await p.waitForTimeout(110);assert(await p.locator('.hy-argument-card-editor').isVisible());
await p.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:10});await p.mouse.up();await p.waitForTimeout(220);
let ids=await p.evaluate(()=>argumentWorkspace.documents.map(d=>d.id));assert.equal(ids[4],initial[0]);assert.equal(await p.evaluate(()=>argumentWorkspace.activeId),initial[7]);assert(await p.locator('#argument-options').evaluate(e=>e.matches(':popover-open')));
await p.screenshot({path:'test-artifacts/argument-grid-desktop.png'});
const beforeCancel=await p.evaluate(()=>argumentWorkspace.documents.map(d=>d.id));
const from=await cards.first().boundingBox(),to=await cards.nth(5).boundingBox();
await p.mouse.move(from.x+from.width/2,from.y+from.height/2);await p.mouse.down();await p.waitForTimeout(180);await p.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:8});await p.keyboard.press('Escape');await p.mouse.up();assert.deepEqual(await p.evaluate(()=>argumentWorkspace.documents.map(d=>d.id)),beforeCancel);
if(!await p.locator('#argument-options').evaluate(e=>e.matches(':popover-open')))await p.locator('#argument-select').click();
await p.waitForTimeout(360);
await add.click();assert.equal(await cards.count(),9);assert(await p.locator('#argument-options').evaluate(e=>e.matches(':popover-open')));
await p.keyboard.press('Escape');await p.reload();assert.equal(await p.evaluate(()=>argumentWorkspace.documents[4].id),initial[0]);
await p.locator('#argument-select').click();await p.waitForTimeout(200);
const row=p.locator('.hy-argument-option').first();await row.locator('[role=menuitemradio]').hover();await p.mouse.down();await p.waitForTimeout(600);await p.mouse.up();const editor=p.locator('.hy-argument-card-editor');assert(await editor.isVisible());await editor.locator('input').fill('Teste');await editor.locator('form').evaluate(e=>e.requestSubmit());
for(const width of [390,320]) {await p.setViewportSize({width,height:1000});await p.locator('#argument-select').click();await p.waitForTimeout(200);const bxs=await cards.evaluateAll(es=>es.slice(0,3).map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right}}));assert(Math.abs(bxs[0].y-bxs[2].y)<1);assert(bxs[0].x>=0&&bxs[2].right<=width);await p.screenshot({path:`test-artifacts/argument-grid-${width}.png`});await p.keyboard.press('Escape');}
assert.deepEqual(errors,[]);console.log('Three-column grid, square add, configured hold/reorder across rows, active selection, persistence, rename and 320/390px bounds OK');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});


