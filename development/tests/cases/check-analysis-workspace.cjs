const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('../browser-runtime.cjs');
fs.mkdirSync('test-artifacts',{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  for(const theme of ['light','indigo-dark']){
   const c=await browser.newContext({viewport:{width:1440,height:1000},locale:'pt-BR',reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write'],acceptDownloads:true});
   const p=await c.newPage(),errors=[];p.on('pageerror',e=>{errors.push(e.message);console.log('Browser error:',e.message);});p.setDefaultTimeout(8000);
   await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('../index.html','utf8')}));await p.goto('https://lp.test');
   await p.evaluate(theme=>{ui.theme=theme;applyUI();},theme);
   const dialog=p.locator('.hy-validation-dialog'),sheet=p.locator('.hy-beta-dialog'),inspector=p.locator('.hy-analysis-inspector');
   async function paint(){await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
   async function seed(mode,premises,conclusion){await p.evaluate(({mode,premises,conclusion})=>{argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId).logicMode=mode;rows=[...premises.map(text=>({text,role:'premise'})),{text:conclusion,role:'conclusion'}];drawRows();render();},{mode,premises,conclusion});}
   async function open(state){await p.locator('.hy-logic-button').click();await p.waitForFunction(state=>logicPanel.dataset.state===state,state);await paint();}
   async function close(){await p.locator('.hy-analysis-close').click();await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});}
   async function geometry(){
    const bounds=await dialog.boundingBox(),preview=await p.locator('.hy-validation-preview').boundingBox(),analysis=await p.locator('.hy-analysis-results').boundingBox();
    const viewport=p.viewportSize();assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=viewport.width+1&&bounds.y+bounds.height<=viewport.height+1);
    assert(Math.abs(bounds.x+bounds.width/2-viewport.width/2)<1);assert(Math.abs(preview.y-analysis.y)<1);assert(Math.abs(preview.x+preview.width-analysis.x)<1);
    assert(await dialog.evaluate(d=>d.scrollTop===0&&d.scrollWidth<=d.clientWidth+1));
    const labels=await p.locator('.hy-validation-preview>.hy-analysis-section-label,.hy-analysis-results>.hy-analysis-section-label').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().y));assert(Math.abs(labels[0]-labels[1])<1);
   }
   for(const [width,height] of [[1440,1000],[1024,768]]){
    await p.setViewportSize({width,height});
    for(const e of [
     {mode:'propositional',premises:['A → B','A'],conclusion:'B',state:'valid'},
     {mode:'syllogistic',premises:['Todo mamífero é animal','Todo cão é mamífero'],conclusion:'Todo cão é animal',state:'valid'},
     {mode:'first-order',premises:['∀x(H(x) → M(x))','H(s)'],conclusion:'M(s)',state:'valid'}]){
     await seed(e.mode,e.premises,e.conclusion);const before=await p.evaluate(()=>JSON.stringify(rows));await open(e.state);await geometry();
     if(width===1440)await p.screenshot({path:`test-artifacts/analysis-${e.mode}-${theme}.png`});
     if(e.mode==='first-order')assert((await p.locator('#logic-panel').innerText()).includes('demonstrada'));
     const card=p.locator('#logic-panel details[data-analysis-tool]>summary').first(),previous=await p.locator('.hy-validation-preview').boundingBox();
     await card.click();assert(await inspector.isVisible());assert.deepEqual(await p.locator('.hy-validation-preview').boundingBox(),previous);
     assert(await p.locator('.hy-analysis-back').evaluate(e=>e===document.activeElement));await p.keyboard.press('Escape');assert(!(await inspector.isVisible()));assert(await dialog.isVisible());
     await p.keyboard.press('Escape');await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});assert.equal(await p.evaluate(()=>JSON.stringify(rows)),before);
    }
   }
   await p.setViewportSize({width:1440,height:1000});
   await seed('propositional',['A → B','B'],'A');await open('invalid');
   await p.locator('.hy-truth-table>summary').click();await p.locator('.hy-analysis-inspector-body tbody tr').first().waitFor();
   assert.equal(await p.locator('.hy-analysis-inspector-body tbody tr').count(),4);
   await inspector.getByRole('combobox').selectOption('counter');await p.waitForFunction(()=>document.querySelectorAll('.hy-analysis-inspector-body tbody tr').length===1);
   await p.screenshot({path:`test-artifacts/analysis-table-${theme}.png`});await p.locator('.hy-analysis-back').click();
   await p.getByText('Analisar premissas redundantes',{exact:true}).click();await inspector.getByRole('button',{name:'Analisar',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.hy-analysis-inspector-body')?.textContent.includes('Cada resultado considera'));
   await p.locator('.hy-analysis-back').click();
   await p.getByRole('button',{name:'Comparar fórmulas',exact:true}).click();
   await sheet.getByLabel('Primeira fórmula').fill('A → B');await sheet.getByLabel('Segunda fórmula').fill('¬A ∨ B');await sheet.getByRole('button',{name:'Comparar',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.hy-beta-dialog [role=status]')?.textContent.includes('equivalentes'));
   await sheet.getByLabel('Segunda fórmula').fill('A ∧ B');await sheet.getByRole('button',{name:'Comparar',exact:true}).click();await p.waitForFunction(()=>document.querySelector('.hy-beta-dialog [role=status]')?.textContent.includes('diferem'));
   await p.screenshot({path:`test-artifacts/analysis-comparison-${theme}.png`});await p.keyboard.press('Escape');await sheet.waitFor({state:'detached'});assert(await dialog.isVisible());
   await dialog.locator('#copy').click();assert((await p.evaluate(()=>navigator.clipboard.readText())).includes('A → B'));
   for(const format of ['TXT','PDF','PNG']){ console.log('Checking export',theme,format);
    await dialog.locator('#download').click();const pending=p.waitForEvent('download');pending.catch(()=>{});await p.getByRole('button',{name:'.'+format.toLowerCase(),exact:true}).click();const file=await pending,data=fs.readFileSync(await file.path());
    assert(data.length>20);if(format==='PNG')assert.equal(data.subarray(1,4).toString(),'PNG');if(format==='PDF')assert.equal(data.subarray(0,5).toString(),'%PDF-');if(format==='TXT')assert(data.toString().includes('A → B'));
    assert(await dialog.locator('#preview').isVisible());
   }
   await close();
   await seed('syllogistic',['A(S,P)'],'I(S,P)');await open('invalid');assert.equal(await p.locator('.hy-countermodel-table tbody tr').count(),1);
   await p.getByText('Semântica e limites',{exact:true}).click();assert((await inspector.innerText()).includes('A e E não pressupõem existência'));await p.keyboard.press('Escape');await close();
   await seed('first-order',['P(x)'],'P(a)');await open('invalid');assert((await p.locator('#logic-panel').innerText()).includes('variáveis livres — x'));await close();
   await seed('first-order',['P(a)'],'P(a,b)');await open('errors');assert((await p.locator('#logic-panel').innerText()).includes('tipos ou números de argumentos diferentes'));await close();
   await seed('first-order',['∀x(H(x) → M(x))','H(s)'],'M(s)');await open('valid');await p.locator('.hy-analysis-vocabulary').click();
   assert(await sheet.isVisible());assert((await sheet.innerText()).includes('Predicados'));assert((await sheet.innerText()).includes('Constantes'));
   assert.equal(await sheet.locator('input').count(),4);await sheet.getByLabel('Domínio de discurso').fill('Pessoas');await sheet.locator('input').nth(1).fill('x é humano');await sheet.locator('input').nth(2).fill('x é mortal');await sheet.locator('input').nth(3).fill('Sócrates');
   const panelBounds=await sheet.boundingBox();assert.equal(panelBounds.x+panelBounds.width,1424);
   await p.screenshot({path:`test-artifacts/analysis-vocabulary-${theme}.png`});await sheet.getByRole('button',{name:'Salvar',exact:true}).click();await sheet.waitFor({state:'detached'});assert(await dialog.isVisible());assert(await p.locator('.hy-analysis-vocabulary').evaluate(e=>e===document.activeElement));await close();
   await p.reload();await p.locator('.hy-proposition-descriptions').click();assert.equal(await sheet.getByLabel('Domínio de discurso').inputValue(),'Pessoas');assert.equal(await sheet.locator('input').nth(1).inputValue(),'x é humano');await sheet.locator('input').nth(1).fill('Descartar');await p.keyboard.press('Escape');await sheet.waitFor({state:'detached'});await p.locator('.hy-proposition-descriptions').click();assert.equal(await sheet.locator('input').nth(1).inputValue(),'x é humano');await sheet.locator('.hy-beta-close').click();await sheet.waitFor({state:'detached'});
   await p.evaluate(()=>{const d=argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId);d.descriptions=Object.fromEntries(Array.from({length:30},(_,i)=>['Predicado_'+i,'Descrição '+i]));});await p.locator('.hy-proposition-descriptions').click();
   assert(await sheet.locator('.hy-beta-scroll').evaluate(e=>e.scrollHeight>e.clientHeight));const actions=await sheet.locator('.hy-beta-actions').boundingBox();assert(actions.y+actions.height<=1000);await sheet.locator('.hy-beta-close').click();await sheet.waitFor({state:'detached'});
   await seed('propositional',['A →'],'A');await open('errors');await p.locator('#logic-panel button.hy-logic-result').first().click();await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});assert(await p.locator('.hy-continuous-field').first().evaluate(e=>e===document.activeElement));
   assert.deepEqual(errors,[]);await c.close();
  }
  const p=await browser.newPage({locale:'en',viewport:{width:1366,height:768},reducedMotion:'reduce'});
  await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('../index.html','utf8')}));await p.goto('https://lp.test');await p.evaluate(()=>{rows=[{text:'A',role:'conclusion'}];drawRows();render();});await p.locator('.hy-logic-button').click();await p.waitForFunction(()=>logicPanel.dataset.state==='invalid');assert.equal(await p.locator('#validation-title').textContent(),'Logic validation');await p.getByText('How it works',{exact:true}).click();assert((await p.locator('.hy-analysis-inspector').innerText()).includes('Classical propositional logic'));await p.close();
  console.log('Desktop analysis: three modes, two themes, 1440/1024 geometry, lateral tools and vocabulary, keyboard/focus, table filtering, redundancy, comparison, clipboard, TXT/PDF/PNG, form save/cancel/reload and long-form scrolling passed; English 1366 passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
