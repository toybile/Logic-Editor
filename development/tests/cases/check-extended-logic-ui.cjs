const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
fs.mkdirSync('test-artifacts',{recursive:true});
(async()=>{const b=await chromium.launch({headless:true});try{
 for(const theme of ['light','indigo-dark']){
  const p=await b.newPage({viewport:{width:1440,height:1000},locale:'en',reducedMotion:'reduce',acceptDownloads:true}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(path.resolve(__dirname,'../../../index.html'),'utf8')}));await p.goto('https://lp.test');
  await p.evaluate(theme=>{ui.theme=theme;applyUI();},theme);
  async function seed(mode,premises,conclusion){await p.evaluate(({mode,premises,conclusion})=>{argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId).logicMode=mode;rows=[...premises.map(text=>({text,role:'premise'})),{text:conclusion,role:'conclusion'}];drawRows();render();},{mode,premises,conclusion});}
  async function open(status){await p.locator('.hy-logic-button').click();await p.waitForFunction(status=>logicPanel.dataset.state===status,status);}
  async function close(){await p.locator('.hy-analysis-close').click();await p.locator('.hy-panel-actions #copy').waitFor({state:'visible'});}
  await seed('syllogistic',['A(M,P)','A(S,M)'],'A(S,P)');await open('valid');
  await p.getByText('Semantics and limits',{exact:true}).click();assert((await p.locator('.hy-analysis-inspector').innerText()).includes('no existential import'));await p.locator('.hy-analysis-back').click();await close();
  await seed('syllogistic',['A(S,P)'],'I(S,P)');await open('invalid');
  assert.equal(await p.locator('.hy-countermodel-table tbody tr').count(),1);await p.locator('.hy-validation-dialog').screenshot({path:'test-artifacts/categorical-'+theme+'.png'});await close();
  await seed('first-order',['∀x(P(x) → Q(x))','P(a)'],'Q(a)');await open('valid');
  assert((await p.locator('#logic-panel').innerText()).includes('Valid first-order argument'));await close();
  await seed('first-order',['P(x)'],'P(a)');await open('invalid');assert((await p.locator('#logic-panel').innerText()).includes('free variables — x'));await close();
  await seed('first-order',['P(a)'],'P(a,b)');await open('errors');assert((await p.locator('#logic-panel').innerText()).includes('different kinds or argument counts'));await close();
  await seed('first-order',['∀x R(x,f(a))'],'R(a,f(a))');
  await p.locator('.hy-proposition-descriptions').click();const d=p.locator('[data-feature=descriptions]');
  assert((await d.innerText()).includes('First-order vocabulary'));assert((await d.innerText()).includes('arity 2'));assert((await d.innerText()).includes('Functions'));
  assert.equal(await d.locator('input').count(),4,'domain, R, a and f; no variable x');
  await d.getByLabel('Domain of discourse').fill('People');
  await d.locator('input').nth(1).fill('x is related to y');
  await d.screenshot({path:'test-artifacts/first-order-vocabulary-'+theme+'.png'});
  await d.locator('[type=submit]').click();await p.reload();
  await p.locator('.hy-proposition-descriptions').click();assert.equal(await d.getByLabel('Domain of discourse').inputValue(),'People');await d.locator('.hy-beta-close').click();
  await p.locator('.hy-file-menu summary').click();const [download]=await Promise.all([p.waitForEvent('download',{timeout:5000}),p.getByRole('button',{name:'Save current argument',exact:true}).click()]);assert.equal(await download.failure(),null);
  const data=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(data.documents[0].domainDescription,'People');assert.equal(data.documents[0].logicMode,'first-order');
  data.documents[0].domainDescription='Imported domain';
  await p.locator('input[type=file]').setInputFiles({name:'vocabulary.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await p.getByRole('button',{name:'Import selected',exact:true}).click();await p.waitForFunction(()=>argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId).domainDescription==='Imported domain');
  const savedDocs=await p.evaluate(()=>JSON.stringify(argumentWorkspace.documents));
  data.documents[0].domainDescription={invalid:true};
  await p.locator('input[type=file]').setInputFiles({name:'invalid-vocabulary.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await p.getByRole('button',{name:'OK',exact:true}).click();assert.equal(await p.evaluate(()=>JSON.stringify(argumentWorkspace.documents)),savedDocs,'malformed vocabulary does not change documents');
  await open('valid');await p.locator('.hy-validation-dialog').screenshot({path:'test-artifacts/first-order-syntax-'+theme+'.png'});await close();
  assert.deepEqual(errors,[]);await p.close();
 }
 const pt=await b.newPage({viewport:{width:1440,height:1000},locale:'pt-BR',reducedMotion:'reduce'});
 await pt.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(path.resolve(__dirname,'../../../index.html'),'utf8')}));await pt.goto('https://lp.test');
 await pt.evaluate(()=>{argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId).logicMode='first-order';rows=[{text:'P(x)',role:'premise'},{text:'P(a)',role:'conclusion'}];drawRows();render();});
 await pt.locator('.hy-logic-button').click();await pt.waitForFunction(()=>logicPanel.dataset.state==='invalid');assert((await pt.locator('#logic-panel').innerText()).includes('variáveis livres'));
 await pt.locator('.hy-analysis-close').click();await pt.locator('.hy-proposition-descriptions').click();assert((await pt.locator('[data-feature=descriptions]').innerText()).includes('Domínio de discurso'));await pt.close();
 console.log('Desktop categorical verdicts/countermodels, FOL syntax/free variables/signatures, domain vocabulary persistence and real JSON export/import passed in light and dark themes.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
