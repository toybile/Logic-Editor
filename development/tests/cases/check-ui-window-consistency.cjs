const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const project=path.resolve(__dirname,'../../..');
const out=path.resolve(__dirname,'../../test-artifacts/ui-window-audit');
const phase=process.argv[2]||'verified';fs.mkdirSync(path.join(out,phase),{recursive:true});
const seed=async(p,mode='propositional')=>p.evaluate(mode=>{argumentWorkspace.documents.find(d=>d.id===argumentWorkspace.activeId).logicMode=mode;rows=mode==='first-order'?[{text:'∀x(P(x) → Q(x))',role:'premise'},{text:'P(a)',role:'premise'},{text:'Q(a)',role:'conclusion'}]:mode==='syllogistic'?[{text:'Todo homem é mortal',role:'premise'},{text:'Aristóteles é homem',role:'premise'},{text:'Aristóteles é mortal',role:'conclusion'}]:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}];drawRows();render();},mode);
const validation=async(p,mode)=>{await seed(p,mode);await p.locator('.hy-logic-button').click();await p.locator('.hy-validation-dialog').waitFor();};
const settings=async(p,tab)=>{await p.locator('[popovertarget=editor-settings]').first().click();if(tab)await p.locator('#settings-'+tab+'-tab').click();};
const examples=async p=>p.evaluate(()=>root.dispatchEvent(new Event('lp-open-argument-examples')));
const specs=[
 ['workspace','#lp-hybrid',async()=>{}],
 ['argument-list','#argument-options',async p=>{await p.evaluate(()=>{createArgument();createArgument();});if(await p.locator('#argument-select').isHidden())await p.locator('#argument-view-toggle').click();await p.locator('#argument-select').click();}],
 ['argument-edit','.hy-argument-card-editor',async p=>{if(await p.locator('#argument-select').isHidden())await p.locator('#argument-view-toggle').click();await p.locator('#argument-select').click();await p.evaluate(()=>showArgumentCardEditor(argumentWorkspace.activeId,document.querySelector('#argument-options [data-argument]')||document.querySelector('#argument-options button')));}],
 ['rename','#rename-dialog',async p=>p.evaluate(()=>renameArgument(argumentWorkspace.activeId))],
 ['delete-all','.hy-delete-all-dialog',async p=>{await p.evaluate(()=>{ui.holdDelaySeconds=.05;});await p.locator('#rows>.hy-row').first().hover();const trash=p.locator('.hy-delete-line').first();await trash.hover({position:{x:8,y:18}});await p.mouse.down();await p.waitForTimeout(100);await p.mouse.up();}],
 ['delete','#delete-dialog',async p=>p.evaluate(()=>{void confirmDeletion('Excluir este argumento?');})],
 ['new-argument','#new-argument-options',async p=>p.locator('#new-argument').click()],
 ['files','.hy-workspace-tools',async p=>p.locator('.hy-file-menu summary').click()],
 ['mode-picker','#validation-mode-options',async p=>{await p.locator('.hy-logic-button').click();await p.locator('.hy-validation-dialog .hy-analysis-mode-icon').click();}],
 ['mode-help','.hy-logic-mode-help',async p=>{await p.evaluate(()=>root.dispatchEvent(new Event('lp-open-argument-examples')));await p.locator('.hy-examples-help').click();}],
 ['examples','.hy-examples-dialog',examples],
 ['example-help','.hy-examples-help-dialog',async p=>{await examples(p);await p.locator('.hy-examples-help').click();}],
 ['text','.hy-text-import-dialog',async p=>{await p.evaluate(()=>root.dispatchEvent(new Event('lp-open-argument-text')));await p.locator('#argument-prose').fill('Todo homem é mortal. Aristóteles é homem. Logo, Aristóteles é mortal.');await p.locator('.hy-text-import-source button').click();}],
 ['import','.hy-import-preview',async p=>{await p.locator('input[type=file]').setInputFiles({name:'example.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'lp-workspace',version:1,documents:[{customName:'Exemplo de argumento importado',rows:[{text:'A',role:'premise'},{text:'A',role:'conclusion'}],numbered:true}]}))});}],
 ['import-error','.hy-feature-dialog',async p=>p.locator('input[type=file]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{invalid')} )],
 ...['appearance','panels','writing','functionalities'].map(tab=>['settings-'+tab,'#editor-settings',async p=>settings(p,tab)]),
 ['reset','#default-settings-confirmation',async p=>{await settings(p);await p.locator('#settings-default').click();}],
 ['themes','.hy-theme-dialog',async p=>p.evaluate(()=>openBackgroundThemes())],
 ['panel-editor','.hy-panel-appearance-dialog',async p=>p.evaluate(()=>root.dispatchEvent(new CustomEvent('lp-open-panel-appearance',{detail:{key:'editor'}})))],
 ['panel-preview','.hy-panel-appearance-dialog',async p=>p.evaluate(()=>root.dispatchEvent(new CustomEvent('lp-open-panel-appearance',{detail:{key:'preview'}})))],
 ['panel-details','.hy-detail-options',async p=>{await p.evaluate(()=>root.dispatchEvent(new CustomEvent('lp-open-panel-appearance',{detail:{key:'editor'}})));await p.locator('.hy-detail-picker summary').click();}],
 ['category-picker','.hy-card-picker-menu',async p=>p.locator('.hy-card-picker').first().click()],
 ['notations','#notation-panel',async p=>p.evaluate(()=>showNotations(document.querySelector('.hy-symbol-cell'),symbolGroups[0][1][0]))],
 ['symbol-help','.hy-symbol-help-dialog',async p=>p.evaluate(()=>LPSymbolHelp.open(document.querySelector('.hy-symbol-cell'),symbolGroups[0][1][0]))],
 ['validation','.hy-validation-dialog',async p=>validation(p,'propositional')],
 ['validation-mode','#validation-mode-options',async p=>{await validation(p,'propositional');await p.locator('.hy-analysis-mode-icon').click();}],
 ['categorical','.hy-validation-dialog',async p=>validation(p,'syllogistic')],
 ['first-order','.hy-validation-dialog',async p=>validation(p,'first-order')],
 ['truth-table','.hy-validation-dialog',async p=>{await validation(p,'propositional');await p.locator('.hy-truth-table>summary').click();await p.locator('.hy-analysis-inspector-body tbody tr').first().waitFor();}],
 ['guide','.hy-validation-dialog',async p=>{await validation(p,'propositional');await p.locator('#logic-panel details[data-analysis-tool]>summary').first().click();}],
 ['redundancy','.hy-validation-dialog',async p=>{await validation(p,'propositional');await p.getByText('Analisar premissas redundantes',{exact:true}).click();}],
 ['comparison','.hy-beta-dialog',async p=>{await validation(p,'propositional');await p.getByRole('button',{name:'Comparar fórmulas',exact:true}).click();}],
 ['vocabulary','.hy-beta-dialog',async p=>{await seed(p,'first-order');await p.locator('.hy-proposition-descriptions').click();}],
 ['export','#export-formats',async p=>p.locator('#download').click()],
 ['example-mode','#examples-mode-options',async p=>{await examples(p);await p.locator('.hy-examples-dialog .hy-analysis-mode-icon').click();}],
 ['categorical-interpretation','.hy-validation-dialog',async p=>{await validation(p,'syllogistic');await p.getByText('Interpretação do texto',{exact:true}).click();}],
 ['categorical-forms','.hy-validation-dialog',async p=>{await validation(p,'syllogistic');await p.getByText('Formas das proposições',{exact:true}).click();}],
 ['categorical-semantics','.hy-validation-dialog',async p=>{await validation(p,'syllogistic');await p.getByText('Semântica e limites',{exact:true}).click();}],
 ['first-order-conventions','.hy-validation-dialog',async p=>{await validation(p,'first-order');await p.getByText('Convenções e limites',{exact:true}).click();}],
 ['mode-notice','.hy-validation-dialog',async p=>{await seed(p,'first-order');await p.evaluate(()=>setLogicMode('propositional'));await p.locator('.hy-logic-button').click();}],
 ['vocabulary-categorical','.hy-beta-dialog',async p=>{await seed(p,'syllogistic');await p.locator('.hy-proposition-descriptions').click();}],
 ['vocabulary-propositional','.hy-beta-dialog',async p=>{await seed(p,'propositional');await p.locator('.hy-proposition-descriptions').click();}],
 ['favorite-notice','.hy-favorite-notice',async p=>p.evaluate(()=>{void favoriteNotice('Símbolo adicionado aos favoritos');})],
 ['hover-help','#lp-shared-hover-hint',async p=>{await p.evaluate(()=>{ui.hoverDelaySeconds=.01;});await p.locator('#caps-lock').hover();await p.waitForTimeout(80);}],
 ['help-scrolled','.hy-logic-mode-help',async p=>{await p.evaluate(()=>root.dispatchEvent(new Event('lp-open-argument-examples')));await p.locator('.hy-examples-help').click();await p.locator('.hy-logic-mode-help').evaluate(e=>{e.scrollTop=e.scrollHeight;});}],
 ['reset-scrolled','#default-settings-confirmation',async p=>{await settings(p);await p.locator('#settings-default').click();await p.locator('.hy-reset-body').evaluate(e=>{e.scrollTop=e.scrollHeight;});}],
 ['validation-export','#export-formats',async p=>{await validation(p,'propositional');await p.locator('#download').click();}],
];
(async()=>{const b=await chromium.launch();const results=[];try{for(const theme of ['light','indigo-dark'])for(const [name,selector,open]of specs){const p=await b.newPage({viewport:{width:1366,height:900},reducedMotion:'reduce'});p.setDefaultTimeout(2500);const errors=[];p.on('pageerror',e=>errors.push(e.message));try{await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync(project+'/index.html','utf8')}));await p.goto('https://lp.test');await p.evaluate(theme=>{ui.theme=theme;ui.language='pt';applyUI();},theme);await open(p);const target=p.locator(selector).last();await target.waitFor({state:'visible'});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const data=await target.evaluate(root=>{const b=root.getBoundingClientRect(),s=getComputedStyle(root);const icons=[...root.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().width&&e.querySelector('svg')&&!e.innerText.trim()).map(e=>{const box=e.getBoundingClientRect(),icon=e.querySelector('svg').getBoundingClientRect();return {label:e.getAttribute('aria-label')||e.id||e.className,dx:+((icon.x+icon.width/2)-(box.x+box.width/2)).toFixed(2),dy:+((icon.y+icon.height/2)-(box.y+box.height/2)).toFixed(2),width:+box.width.toFixed(1),height:+box.height.toFixed(1)};});return {bounds:{x:b.x,y:b.y,width:b.width,height:b.height},padding:s.padding,radius:s.borderRadius,overflowX:root.scrollWidth>root.clientWidth+2,icons};});
 const clip=await target.boundingBox();if(clip&&clip.width>0&&clip.height>0)await p.screenshot({path:path.join(out,phase,theme+'-'+name+'.png'),clip:{x:Math.max(0,clip.x),y:Math.max(0,clip.y),width:Math.min(clip.width,1366-Math.max(0,clip.x)),height:Math.min(clip.height,900-Math.max(0,clip.y))}});results.push({name,theme,...data,errors});
 }catch(e){results.push({name,theme,failure:e.message,errors});}finally{await p.close();}}
 fs.writeFileSync(path.join(out,phase+'.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({phase,states:results.length,failures:results.filter(x=>x.failure).map(x=>({name:x.name,error:x.failure.slice(0,240)})),overflow:results.filter(x=>x.overflowX).map(x=>x.name),misaligned:results.flatMap(x=>(x.icons||[]).filter(i=>Math.abs(i.dx)>1.1||Math.abs(i.dy)>1.1).map(i=>({surface:x.name,theme:x.theme,...i})))}));
 const images=results.filter(x=>!x.failure).map(x=>({name:x.theme+' · '+x.name,file:fs.readFileSync(path.join(out,phase,x.theme+'-'+x.name+'.png')).toString('base64')}));const sheet=await b.newPage({viewport:{width:1320,height:1000}});await sheet.setContent('<html><body style="margin:0;background:#ddd;font:16px system-ui"><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:16px">'+images.map(x=>'<div><p>'+x.name+'</p><img style="width:100%;height:270px;object-fit:contain;object-position:top;background:#aaa" src="data:image/png;base64,'+x.file+'"></div>').join('')+'</div></body></html>');await sheet.screenshot({path:path.join(out,phase+'-contact.png'),fullPage:true});
if(results.some(result=>result.failure||result.overflowX||result.errors.length))throw Error('Window audit failed: '+results.filter(result=>result.failure||result.overflowX||result.errors.length).map(result=>result.name).join(', '));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
