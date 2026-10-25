const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('../browser-runtime.cjs');
fs.mkdirSync('test-artifacts',{recursive:true});
(async()=>{const b=await chromium.launch({headless:true});try{
 for(const theme of ['light','indigo-dark']){
  const p=await b.newPage({viewport:{width:1440,height:1000},locale:'pt-BR',reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.log(e.message)});p.setDefaultTimeout(7000);
  await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('../index.html','utf8')}));await p.goto('https://lp.test');await p.evaluate(theme=>{ui.theme=theme;applyUI();},theme);
  const settings=p.locator('#editor-settings');await p.locator('[popovertarget=editor-settings]').first().click();
  assert.equal(await settings.locator('[role=tab]').count(),4);assert(await p.locator('#settings-appearance').isVisible());assert.equal(await settings.locator('.hy-theme-option').count(),8);
  let rect=await settings.boundingBox();assert(rect.x>=0&&rect.y>=0&&rect.x+rect.width<=1440&&rect.y+rect.height<=1000);await settings.screenshot({path:`test-artifacts/sidebar-settings-${theme}.png`});
  await p.locator('#settings-panels-tab').click();assert(await p.locator('.hy-panel-appearance-inline').isVisible());assert.equal(await p.locator('.hy-panel-appearance-inline .hy-color-swatch').count(),6);
  const inline=p.locator('.hy-panel-appearance-inline');await inline.locator('input[type=color]').evaluate(e=>{e.value='#249ac7';e.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal(await p.evaluate(()=>ui.premiseColor),'#249ac7');
  await inline.getByRole('combobox',{name:'Fonte das fórmulas'}).selectOption('mono');assert((await p.locator('.hy-continuous-field').first().evaluate(e=>getComputedStyle(e).fontFamily)).includes('Consolas'));
  await p.locator('[data-panel-settings=preview]').click();await inline.getByRole('combobox',{name:'Fonte das fórmulas'}).selectOption('georgia');assert((await p.locator('#preview').evaluate(e=>getComputedStyle(e).fontFamily)).includes('Georgia'));
  await settings.screenshot({path:`test-artifacts/sidebar-panels-${theme}.png`});
  await p.locator('#settings-writing-tab').click();await p.locator('[data-writing-mode=blocks]').click();assert.equal(await p.locator('.hy-block').count()>0,true);await p.locator('[data-writing-mode=continuous]').click();
  const prefix=p.locator('#settings-compact-prefix');await prefix.check();assert.equal(await p.evaluate(()=>ui.compactPrefixSpacing),true);
  await p.locator('#settings-functionalities-tab').click();await p.locator('#hold-delay-number').fill('0.37');await p.locator('#hold-delay-number').press('Tab');assert.equal(await p.evaluate(()=>getHoldDelay()),370);
  await p.locator('#hover-hints-toggle').click();assert(await p.locator('#hover-delay-range').isDisabled());await p.locator('#hover-hints-toggle').click();
  await p.locator('#settings-functionalities-tab').press('ArrowUp');assert(await p.locator('#settings-writing').isVisible());
  await p.locator('#settings-language').click();await p.locator('[data-language-choice=en]').click();assert((await p.locator('#settings-writing-tab').textContent()).includes('Writing'));await p.locator('#settings-language').click();await p.locator('[data-language-choice="pt-BR"]').click();
  await settings.locator('#settings-default').click();assert(await p.locator('#default-settings-confirmation').isVisible());await p.locator('#default-settings-confirmation .hy-reset-head button').click();
  await p.waitForFunction(()=>document.querySelector('#editor-settings').matches(':popover-open'));
  await p.locator('#settings-panels-tab').click();await p.keyboard.press('Escape');await settings.waitFor({state:'hidden'});
  await p.locator('[popovertarget=editor-settings]').first().click();await inline.waitFor({state:'visible'});await p.keyboard.press('Escape');await settings.waitFor({state:'hidden'});
  async function seed(mode,premises,conclusion){await p.evaluate(({mode,premises,conclusion})=>{const d=argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId);d.logicMode=mode;d.descriptions={P:'Pessoa',Q:'Mortal'};rows=[...premises.map(text=>({text,role:'premise'})),{text:conclusion,role:'conclusion'}];drawRows();render();},{mode,premises,conclusion});}
  const dialog=p.locator('.hy-validation-dialog'),notice=p.locator('.hy-analysis-mode-notice'),trigger=p.locator('.hy-analysis-mode-icon');
  await seed('propositional',['∀x(P(x) → Q(x))','P(a)'],'Q(a)');const before=await p.evaluate(()=>JSON.stringify({rows,descriptions:argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId).descriptions}));
  await p.locator('.hy-logic-button').click();await notice.waitFor({state:'visible'});await p.waitForFunction(()=>logicPanel.dataset.state==='mode-mismatch');assert((await notice.innerText()).includes('Primeira ordem'));await dialog.screenshot({path:`test-artifacts/mode-advice-${theme}.png`});
  await notice.getByRole('button').click();await p.waitForFunction(()=>logicPanel.dataset.state==='valid');assert(!(await notice.isVisible()));assert.equal(await p.evaluate(()=>currentLogicMode()),'first-order');assert.equal(await p.evaluate(()=>JSON.stringify({rows,descriptions:argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId).descriptions})),before);
  await trigger.click();const menu=p.locator('#validation-mode-options');assert.equal(await menu.getByRole('menuitemradio').count(),3);await p.keyboard.press('Escape');assert(await dialog.isVisible());assert(!(await menu.isVisible()));
  await trigger.click();await menu.getByRole('menuitemradio').filter({hasText:'proposicional'}).click();await notice.waitFor({state:'visible'});await trigger.click();await menu.getByRole('menuitemradio').filter({hasText:'primeira ordem'}).click();await p.waitForFunction(()=>logicPanel.dataset.state==='valid');
  await p.locator('.hy-analysis-close').click();await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});await p.reload();assert.equal(await p.evaluate(()=>currentLogicMode()),'first-order');
  await seed('first-order',['A → B','A'],'B');await p.locator('.hy-logic-button').click();await p.waitForFunction(()=>logicPanel.dataset.state==='valid');assert(!(await notice.isVisible()));await p.locator('.hy-analysis-close').click();await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});
  await seed('first-order',['A(M,P)','A(S,M)'],'A(S,P)');await p.locator('.hy-logic-button').click();await notice.waitFor({state:'visible'});assert((await notice.innerText()).includes('Silogística'));await notice.getByRole('button').click();await p.waitForFunction(()=>logicPanel.dataset.state==='valid');assert.equal(await p.evaluate(()=>currentLogicMode()),'syllogistic');await p.locator('.hy-analysis-close').click();await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});
  await seed('propositional',['A →'],'B');await p.locator('.hy-logic-button').click();await p.waitForFunction(()=>logicPanel.dataset.state==='errors');assert(!(await notice.isVisible()));
  await p.locator('.hy-analysis-close').click();await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});
  await p.setViewportSize({width:1024,height:768});await p.locator('[popovertarget=editor-settings]').first().click();rect=await settings.boundingBox();assert(rect.x>=0&&rect.y>=0&&rect.x+rect.width<=1024&&rect.y+rect.height<=768);assert(await settings.locator('.hy-settings-footer').isVisible());assert(await settings.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  assert.deepEqual(errors,[]);await p.close();
 }
 console.log('Desktop sidebar settings and notation advice: all four sections, inline panel controls, fonts, writing, delays, reset, Escape/reopen, localization, mode switching, data preservation and persistence passed in light and dark.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
