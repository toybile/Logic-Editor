// A finite catalogue of schemas, with explicit scope and a complete categorical subcatalogue.
(() => {
  const categories={all:['Todas as formas','All forms'],inference:['Inferências','Inferences'],equivalence:['Equivalências','Equivalences'],'proof-methods':['Métodos de prova','Proof methods'],quantifiers:['Quantificadores','Quantifiers'],identity:['Identidade e unicidade','Identity and uniqueness'],syllogisms:['15 modos modernos','15 modern moods'],'existential-import':['9 formas com existência','9 forms with existence']};
  const local=value=>typeof value==='string'?value:value[ui.language==='en'?'en':'pt'];
  const t=interfaceText,book='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h6a3 3 0 0 1 3 3v14a3 3 0 0 0-3-2H3ZM21 4h-6a3 3 0 0 0-3 3v14a3 3 0 0 1 3-2h6Z"/></svg>';
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  function launchButton(cls){const button=el('button','','hy-button '+cls);button.type='button';button.innerHTML=book;const caption=el('span',t('Guia de argumentos','Argument guide'));caption.dataset.pt='Guia de argumentos';caption.dataset.en='Argument guide';button.append(caption);button.onclick=()=>root.dispatchEvent(new Event('lp-open-argument-guide'));return button;}
  const addMenu=root.querySelector('#new-argument-options'),entry=launchButton('hy-open-argument-guide');entry.id='argument-guide-open';entry.onclick=()=>{addMenu.hidden=true;root.querySelector('#new-argument').setAttribute('aria-expanded','false');root.dispatchEvent(new Event('lp-open-argument-guide'));};addMenu.append(entry);
  let opened=null;
  root.addEventListener('lp-open-argument-guide',()=>{
    if(opened?.open){opened.focus();return;}
    root.querySelector('#argument-options')?.hidePopover();
    const returnFocus=document.activeElement;let loading=false,mode=currentLogicMode(),category='all',page='forms';
    const d=el('dialog','','hy-feature-dialog hy-guide-dialog');d.id='argument-guide-dialog';d.setAttribute('aria-labelledby','argument-guide-title');d.setAttribute('translate','no');opened=d;
    const header=el('header','','hy-guide-header'),identity=el('div','','hy-guide-identity'),modeButton=el('button','','hy-analysis-mode-icon');modeButton.type='button';
    const copy=el('div'),title=el('h2'),subtitle=el('p');title.id='argument-guide-title';title.tabIndex=-1;copy.append(title,subtitle);identity.append(modeButton,copy);
    const close=el('button','','hy-button hy-icon-button');close.type='button';LPDialogChrome.close(close);close.onclick=()=>d.close();header.append(identity,close);
    const body=el('div','','hy-guide-body'),nav=el('nav','','hy-guide-nav'),main=el('section','','hy-guide-main'),searchRow=el('div','','hy-guide-search-row'),search=el('input'),count=el('p','','hy-guide-count'),content=el('div','','hy-guide-content');
    search.type='search';search.id='argument-guide-search';count.setAttribute('role','status');searchRow.append(search,count);main.append(searchRow,content);body.append(nav,main);d.append(header,body);root.append(d);
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    function paragraph(pt,en){return el('p',t(pt,en));}
    function helpSection(titlePt,titleEn,paragraphs){const section=el('section','','hy-guide-reading');section.append(el('h3',t(titlePt,titleEn)));for(const[pt,en]of paragraphs)section.append(paragraph(pt,en));content.append(section);}
    let navSignature='';
    function drawNav(){
      const signature=mode+':'+ui.language,selected=page==='forms'?'forms:'+category:page;
      if(signature===navSignature){for(const button of nav.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.guideNav===selected));return;}
      navSignature=signature;
      nav.replaceChildren();nav.setAttribute('aria-label',t('Navegação do guia','Guide navigation'));
      const all=LPArgumentGuide.entries.filter(e=>e.mode===mode),keys=['all',...Object.keys(categories).filter(key=>key!=='all'&&all.some(e=>e.category===key))];
      nav.append(el('p',t('FORMAS DE ARGUMENTO','ARGUMENT FORMS'),'hy-guide-nav-label'));
      for(const key of keys){const button=el('button'),label=el('span',t(...categories[key])),badge=el('small',String(key==='all'?all.length:all.filter(e=>e.category===key).length));button.type='button';button.dataset.guideNav='forms:'+key;button.setAttribute('aria-pressed',String(page==='forms'&&category===key));button.append(label,badge);button.onclick=()=>{category=key;page='forms';draw();content.scrollTop=0;};nav.append(button);}
      nav.append(el('p',t('LEITURA E MÉTODO','READING AND METHOD'),'hy-guide-nav-label'));
      for(const[key,pt,en]of[['reading','Como ler o guia','How to read the guide'],['limits','Métodos e limites','Methods and limits'],['sources','Referências','References']]){const button=el('button',t(pt,en));button.type='button';button.dataset.guideNav=key;button.setAttribute('aria-pressed',String(page===key));button.onclick=()=>{page=key;draw();content.scrollTop=0;};nav.append(button);}
    }
    function draw(){
      const openIds=new Set([...content.querySelectorAll('details[open]')].map(e=>e.dataset.guideEntry));
      title.textContent=t('Guia de argumentos','Argument guide');subtitle.textContent=t(...logicModeDefinitions.find(([id])=>id===mode).slice(1));modeButton.innerHTML=logicModeIcon(mode);modeButton.setAttribute('aria-label',t('Escolher sistema lógico','Choose logical system'));close.setAttribute('aria-label',t('Fechar guia','Close guide'));search.placeholder=t('Buscar uma forma, regra ou símbolo…','Search for a form, rule or symbol…');search.setAttribute('aria-label',t('Buscar no guia','Search the guide'));drawNav();content.replaceChildren();searchRow.hidden=page!=='forms';
      if(page==='reading'){
        helpSection('Uma forma, infinitas instâncias','One form, infinitely many instances',[
          ['Não existe uma lista finita de todos os argumentos válidos. Um esquema, como P → Q; P; portanto Q, representa infinitas substituições uniformes. Este guia organiza 97 formas nos três sistemas oferecidos pelo editor.','No finite list contains every valid argument. A schema such as P → Q; P; therefore Q represents infinitely many uniform substitutions. This guide organizes 97 forms in the three systems offered by the editor.'],
          ['Em esquemas proposicionais, P, Q e R podem representar fórmulas inteiras. Use a mesma substituição em todas as ocorrências de uma letra e acrescente parênteses quando necessário.','In propositional schemas, P, Q and R may stand for whole formulas. Use the same substitution at every occurrence and add parentheses when needed.'],
          ['Em LPO, P e Q representam predicados, R representa uma relação, a e b são constantes e x, y e z são variáveis. A ordem dos argumentos de uma relação importa. Leia sempre as condições de uso.','In first-order logic, P and Q represent predicates, R a relation, a and b constants, and x, y and z variables. Relation argument order matters. Always read the application conditions.'],
          ['Na silogística, A(S,P) diz que todo S é P; E(S,P), que nenhum S é P; I(S,P), que algum S é P; O(S,P), que algum S não é P. O catálogo inclui os 15 modos de três termos válidos com classes vazias e os 9 adicionais com uma premissa explícita de existência.','In syllogistic logic, A(S,P) says every S is P; E(S,P) no S is P; I(S,P) some S is P; O(S,P) some S is not P. The catalogue includes all 15 three-term moods valid with possibly empty classes and 9 additional forms with an explicit existence premise.'],
          ['Carregar cria um argumento novo e preserva os seus documentos atuais. Validade significa que a conclusão não pode ser falsa quando todas as premissas são verdadeiras; não comprova que as premissas sejam fatos.','Loading creates a new argument and preserves your current documents. Validity means the conclusion cannot be false when every premise is true; it does not establish that the premises are facts.']]);
      }else if(page==='limits'){
        helpSection('O que cada análise pode afirmar','What each analysis can establish',[
          ['Proposicional: a decisão é exata para os conectivos clássicos aceitos. Até 16 proposições, o método tradicional enumera valorações; acima disso, a busca SAT aceita até 128 proposições. Um limite de recursos é apresentado como limite, nunca como validade. A tabela-verdade visual continua limitada a 16 proposições.','Propositional: decisions are exact for supported classical connectives. Up to 16 propositions, the traditional method enumerates valuations; beyond that, SAT search accepts up to 128 propositions. Resource exhaustion is reported as a limit, never as validity. The visual truth table remains limited to 16 propositions.'],
          ['LPO: um tableau com todos os ramos fechados demonstra consequência. Um contramodelo finito é conferido diretamente nas fórmulas originais. Se a busca atingir seus limites, o resultado é inconclusivo. Não existe um algoritmo que sempre decida todos os argumentos de LPO.','First-order logic: a tableau with every branch closed proves consequence. A finite countermodel is checked directly against the original formulas. If search reaches its bounds, the result is inconclusive. No algorithm always decides every first-order argument.'],
          ['A semântica de LPO usa domínio não vazio, igualdade e funções totais. Nomes distintos podem designar o mesmo objeto. Variáveis livres mantêm a mesma atribuição ao longo de todo o argumento. A busca adicional de modelos pequenos não é uma prova de validade quando não encontra um modelo.','First-order semantics uses nonempty domains, equality and total functions. Different names can denote the same object. Free variables retain the same assignment throughout the argument. An unsuccessful additional search for small models is not a proof of validity.'],
          ['Categórica: a busca usa regiões de pertencimento e testemunhas, até 12 termos e 200 linhas. Classes gerais podem ser vazias. Nomes próprios nas frases controladas denotam um indivíduo existente e podem correferir. Uma premissa I(S,S) afirma explicitamente a existência de S.','Categorical: search uses membership regions and witnesses, up to 12 terms and 200 rows. General classes may be empty. Proper names in controlled sentences denote an existing individual and may co-refer. I(S,S) explicitly asserts that S exists.'],
          ['Modal, temporal, intuicionista, paraconsistente e segunda ordem têm outras semânticas e regras. Seus símbolos continuam na biblioteca, mas não são silenciosamente interpretados como lógica clássica. Prosa livre pode ter ambiguidades: a interpretação proposta deve ser conferida antes da validação formal.','Modal, temporal, intuitionistic, paraconsistent and second-order logics have different semantics and rules. Their symbols remain in the library, but are not silently interpreted as classical logic. Free prose may be ambiguous: a proposed reading must be reviewed before formal validation.']]);
      }else if(page==='sources'){
        helpSection('Fontes e escopo','Sources and scope',[[LPArgumentGuide.scope.pt,LPArgumentGuide.scope.en]]);
        const list=el('ul','','hy-guide-sources');for(const reference of LPArgumentGuide.references){const item=el('li'),a=el('a',reference.title);a.href=reference.url;a.rel='noopener noreferrer';item.append(a);list.append(item);}content.append(list);
      }else{
        const query=normalize(search.value.trim()),items=LPArgumentGuide.entries.filter(e=>e.mode===mode&&(category==='all'||e.category===category)&&(!query||normalize([local(e.title),local(e.explanation),local(e.conditions),...e.premises,e.conclusion].join(' ')).includes(query)));
        count.textContent=items.length+' '+t('formas','forms');content.append(el('p',t('Esquemas representam infinitas instâncias. Abra uma forma para ver a leitura, as condições e um exemplo que você pode carregar.','Schemas represent infinitely many instances. Open a form to see its reading, conditions and a loadable example.'),'hy-guide-scope'));
        if(!items.length)content.append(el('p',t('Nenhuma forma corresponde a esta busca.','No form matches this search.'),'hy-guide-empty'));
        const grid=el('div','','hy-guide-grid');
        for(const item of items){
          const card=el('details','','hy-guide-entry');card.dataset.guideEntry=item.id;card.open=openIds.has(item.id);const summary=el('summary'),name=el('span',local(item.title),'hy-guide-entry-title'),formula=el('span',[...item.premises,'∴ '+item.conclusion].join(' · '),'hy-guide-entry-formula');summary.append(name,formula);card.append(summary);
          const detail=el('div','','hy-guide-entry-body');detail.append(el('p',local(item.explanation)));
          const argument=el('div','','hy-guide-argument');item.premises.forEach((premise,i)=>argument.append(el('p',(i+1)+'. '+premise)));argument.append(el('p','∴ '+item.conclusion));detail.append(argument);
          detail.append(el('h4',t('Condições de uso','Application conditions')),el('p',local(item.conditions)));
          const actions=el('div','','hy-guide-entry-actions'),load=el('button',t('Carregar como novo argumento','Load as new argument'),'hy-button');load.type='button';load.dataset.loadGuide=item.id;load.onclick=()=>{loading=true;d.close();root.dispatchEvent(new CustomEvent('lp-load-guide-example',{detail:{name:local(item.title),mode:item.mode,items:[...item.premises.map(text=>({text,role:'premise'})),{text:item.conclusion,role:'conclusion'}]}}));};
          const source=el('a',t('Referência','Reference'));source.href=item.source;source.setAttribute('aria-label',t('Referência: ','Reference: ')+local(item.title));source.rel='noopener noreferrer';actions.append(load,source);detail.append(actions);card.append(detail);grid.append(card);
        }
        content.append(grid);
      }
    }
    search.addEventListener('input',()=>{draw();content.scrollTop=0;});
    const dispose=attachLogicModePicker(modeButton,d,()=>mode,id=>{mode=id;category='all';page='forms';search.value='';draw();},'guide-mode-options');
    let guideLanguage=document.documentElement.lang;const languageObserver=new MutationObserver(()=>{if(document.documentElement.lang===guideLanguage)return;guideLanguage=document.documentElement.lang;draw();});languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    d.addEventListener('click',event=>{if(event.target!==d)return;const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();});
    d.addEventListener('close',()=>{dispose();languageObserver.disconnect();opened=null;d.remove();if(!loading){const target=returnFocus?.isConnected&&returnFocus.getClientRects().length?returnFocus:root.querySelector('#new-argument');target?.focus({preventScroll:true});}});
    draw();d.showModal();title.focus({preventScroll:true});
  });
})();
