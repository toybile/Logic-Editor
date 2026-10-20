const {launch,open,assert}=require('../mobile-runtime.cjs');
(async()=>{const b=await launch();try{for(const width of [320,390,768]){
const {p,c,errors,gesture,fits}=await open(b,width);await p.locator('#argument-view-toggle').tap();await p.locator('#argument-select').tap();
await fits('#argument-options');await p.locator('.hy-argument-grid-add').tap();assert.equal(await p.evaluate(()=>argumentWorkspace.documents.length),2);
if(!await p.locator('#argument-options').isVisible())await p.locator('#argument-select').tap();await gesture(p.locator('.hy-argument-option').first(),0,0,300);await fits('.hy-argument-card-editor');
await p.locator('.hy-argument-card-editor input').fill('Nome editado');await p.locator('.hy-argument-card-editor button[type=submit]').tap();
assert.equal(await p.evaluate(()=>argumentWorkspace.documents[0].customName),'Nome editado');
await gesture(p.locator('.hy-argument-option').first(),0,0,300);await p.locator('.hy-argument-card-editor button[aria-label=Cancel]').tap();assert(await p.locator('#argument-options').isVisible());
const ids=await p.evaluate(()=>argumentWorkspace.documents.map(d=>d.id));const boxes=await p.locator('.hy-argument-option').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}}));
await gesture(p.locator('.hy-argument-option').first(),boxes[1].x-boxes[0].x,boxes[1].y-boxes[0].y);assert.notDeepEqual(await p.evaluate(()=>argumentWorkspace.documents.map(d=>d.id)),ids);
await p.locator('.hy-argument-option').first().tap();
await p.locator('[popovertarget=editor-settings]').first().tap();await p.waitForTimeout(250);await fits('#editor-settings');
await p.locator('.hy-theme-section-toggle').tap();assert.equal(await p.locator('.hy-theme-section-toggle').getAttribute('aria-expanded'),'false');await p.locator('.hy-theme-section-toggle').tap();await p.waitForTimeout(50);
for(const theme of ['light','dark','indigo-light','indigo-dark','petroleum','graphite','sand','sage']){await p.locator('[data-theme-value='+theme+']').tap();assert.equal(await p.evaluate(()=>ui.theme),theme);await fits();}
await p.locator('.hy-theme-choices .hy-settings-info').tap();assert(await p.locator('#lp-shared-hover-hint').isVisible());
for(const key of ['editor','preview']){await p.locator('[data-panel-settings='+key+']').tap();await fits('.hy-panel-appearance-dialog');assert(await p.locator('#editor-settings').isVisible());await p.locator('.hy-color-swatch').nth(3).tap();await p.locator('.hy-custom-color-swatch input').evaluate(e=>{e.value='#974db2';e.dispatchEvent(new Event('input',{bubbles:true}))});assert.equal(await p.evaluate(k=>ui[k==='editor'?'premiseColor':'conclusionColor'],key),'#974db2');await p.locator('.hy-panel-appearance-dialog input[type=checkbox]').first().tap();await p.locator('.hy-detail-picker summary').tap();await fits('.hy-floating-detail-options');await p.locator('.hy-floating-detail-options button').nth(2).tap();await p.locator('.hy-panel-appearance-dialog [data-close]').tap();}
for(const scale of ['library','writing']){await p.locator('#scale-'+scale).evaluate(e=>{e.value='150';e.dispatchEvent(new Event('input',{bubbles:true}))});await fits();}
await p.locator('#settings-functionalities-tab').tap();await p.locator('#hover-hints-toggle').tap();await p.locator('#hold-delay-range').evaluate(e=>{e.value='0.2';e.dispatchEvent(new Event('input',{bubbles:true}))});
await p.locator('#settings-language').tap();assert.equal(await p.locator('#settings-title').textContent(),'Configurações');await fits('#editor-settings');
await p.locator('#editor-settings [popovertargetaction=hide]').tap();await p.reload();assert.equal(await p.evaluate(()=>ui.theme),'sage');await fits();
await p.screenshot({path:`test-artifacts/mobile-settings-flow-${width}.png`,fullPage:true});assert.deepEqual(errors,[]);await c.close();console.log(width+'px compact arguments, rename/cancel/reorder, all themes, both custom panels, scales, touch info, hold/hover settings, language and persistence passed');
}}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
