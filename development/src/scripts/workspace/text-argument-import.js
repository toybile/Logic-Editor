(() => {
  const t=interfaceText;
  root.addEventListener('lp-open-argument-text',()=>{
    if(root.querySelector('.hy-text-import-dialog'))return;
    const previous=document.activeElement,dialog=document.createElement('dialog');
    dialog.className='hy-feature-dialog hy-text-import-dialog';dialog.setAttribute('aria-labelledby','text-import-title');
    function element(tag,cls,value){const node=document.createElement(tag);if(cls)node.className=cls;if(value)node.textContent=value;return node;}
    function button(label,handler){const node=element('button','hy-button',label);node.type='button';node.onclick=handler;return node;}
    const header=element('header','hy-text-import-heading'),identity=element('div','hy-text-import-identity');
    const icon=element('span','hy-analysis-mode-icon');icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16M4 10h16M4 15h10M4 20h6"/></svg>';
    const heading=element('div'),title=element('h2','',t('Interpretar texto','Interpret text'));title.id='text-import-title';
    heading.append(title,element('p','hy-analysis-mode-name',t('Revisar antes de carregar','Review before loading')));identity.append(icon,heading);
    const close=button('×',()=>dialog.close());close.classList.add('hy-analysis-close');LPDialogChrome.close(close);close.setAttribute('aria-label',t('Fechar','Close'));header.append(identity,close);
    const workspace=element('div','hy-text-import-workspace'),source=element('section','hy-text-import-source'),review=element('section','hy-text-import-review');
    const sourceLabel=element('label','hy-text-import-label',t('Texto original','Original text'));sourceLabel.htmlFor='argument-prose';
    const input=element('textarea');input.id='argument-prose';input.maxLength=20000;input.spellcheck=false;
    input.placeholder=t('Todo homem é mortal. Aristóteles é homem. Logo, Aristóteles é mortal.','Every human is mortal. Aristotle is human. Therefore, Aristotle is mortal.');
    const analyze=button(t('Interpretar','Interpret'),interpret);
    source.append(sourceLabel,input,analyze);
    const reviewHead=element('div','hy-text-import-review-heading'),reviewTitle=element('h3','',t('Leitura proposta','Proposed reading')),modeLabel=element('span','hy-analysis-mode-name');reviewHead.append(reviewTitle,modeLabel);
    const note=element('p','hy-text-import-note',t('Frases categóricas e condicionais simples. Pronomes, sinônimos e sentidos implícitos não são resolvidos.','Categorical sentences and simple conditionals. Pronouns, synonyms and implicit meanings are not resolved.'));
    const notice=element('p','hy-text-import-notice');notice.setAttribute('role','status');
    const list=element('div','hy-text-import-list'),vocabulary=element('div','hy-text-import-vocabulary');
    review.append(reviewHead,note,notice,list,vocabulary);workspace.append(source,review);
    const footer=element('footer','hy-text-import-footer'),cancel=button(t('Cancelar','Cancel'),()=>dialog.close()),load=button(t('Carregar novo argumento','Load new argument'),loadArgument);load.disabled=true;footer.append(cancel,load);
    dialog.append(header,workspace,footer);root.append(dialog);
    let draft=[],reading=null,sourceDirty=false;
    input.oninput=()=>{sourceDirty=true;load.disabled=true;reading=null;notice.textContent=t('Interprete novamente para atualizar a leitura.','Interpret again to update the reading.');};
    function issue(code){return code==='text-limit'?t('Limite: 20.000 caracteres, 200 frases e 10.000 caracteres por frase.','Limit: 20,000 characters, 200 sentences and 10,000 characters per sentence.'):t('Escreva um texto para interpretar.','Enter a text to interpret.');}
    function interpret(){
      try{
        const result=LPNaturalText.analyze(input.value,currentLogicMode());sourceDirty=false;draft=result.rows.map(row=>({...row}));
        list.replaceChildren();
        for(const [index,row] of draft.entries()){
          const card=element('div','hy-text-import-row'),role=element('select'),field=element('textarea'),formula=element('p','hy-text-import-formula');
          role.setAttribute('aria-label',t('Função da frase ','Sentence role ')+(index+1));
          for(const [id,pt,en] of [['premise','Premissa','Premise'],['conclusion','Conclusão','Conclusion'],['blank','Ignorar','Ignore']]){const option=element('option','',t(pt,en));option.value=id;role.append(option);}role.value=row.role;
          field.value=row.text;field.rows=1;field.maxLength=10000;field.spellcheck=false;field.setAttribute('aria-label',t('Frase ','Sentence ')+(index+1));
          role.onchange=()=>{row.role=role.value;refresh(result.explicitConclusion);};field.oninput=()=>{field.style.height="auto";field.style.height=Math.min(180,Math.max(48,field.scrollHeight+2))+"px";row.text=field.value;refresh(result.explicitConclusion);};card.append(role,field,formula);list.append(card);field.style.height=Math.min(180,Math.max(48,field.scrollHeight+2))+"px";
        }
        refresh(result.explicitConclusion);
      }catch(error){reading=null;load.disabled=true;notice.textContent=issue(error.message);list.replaceChildren();vocabulary.replaceChildren();modeLabel.textContent='';}
    }
    function refresh(explicit){
      try{reading=LPNaturalText.inspect(draft,currentLogicMode());}catch(error){reading=null;load.disabled=true;notice.textContent=issue(error.message);return;}
      const definition=logicModeDefinitions.find(([id])=>id===reading.mode);modeLabel.textContent=t(definition[1],definition[2]);
      const presentation=reading.mode==='syllogistic'?LPCategoricalPresentation.explain(reading.rows.flatMap((row,index)=>{try{return [{...LPCategorical.parse(row.text),index,text:row.text}];}catch{return [];}}),ui.language):null;
      let at=0;draft.forEach((row,index)=>{
        const card=list.children[index],formula=card.querySelector('.hy-text-import-formula');card.dataset.ignored=String(row.role==='blank');
        if(row.role==='blank'){formula.textContent='';card.dataset.error='false';return;}
        const currentIndex=at,entry=reading.interpretations[at++],didactic=presentation?.entries.find(item=>item.index===currentIndex);card.dataset.error=String(Boolean(entry.error));
        formula.textContent=entry.error?t('Trecho não reconhecido; reformule ou ignore explicitamente.','Unrecognized passage; rephrase or explicitly ignore it.'):didactic?didactic.formula:entry.formula;
        if(didactic){const explanation=element('span','hy-text-import-reading',didactic.reading);formula.append(explanation);}
      });
      vocabulary.replaceChildren();if(presentation)appendCategoricalVocabulary(vocabulary,presentation);
      else if(Object.keys(reading.descriptions).length){const definitions=element('dl','hy-didactic-vocabulary');for(const [symbol,description] of Object.entries(reading.descriptions))definitions.append(element('dt','',symbol),element('dd','',description));vocabulary.append(definitions);}
      const complete=reading.rows.some(row=>row.role==='premise')&&reading.rows.some(row=>row.role==='conclusion');
      load.disabled=sourceDirty||Boolean(reading.errors.length)||!complete;
      notice.textContent=sourceDirty?t('Interprete novamente para atualizar a leitura.','Interpret again to update the reading.'):reading.errors.length?t('Há trechos não reconhecidos. Nenhum veredito de validade foi produzido.','Some passages are not recognized. No validity verdict has been produced.'):!complete?t('Indique pelo menos uma premissa e uma conclusão.','Indicate at least one premise and one conclusion.'):!explicit?t('A última frase foi sugerida como conclusão. Confira os papéis e a interpretação.','The last sentence was suggested as the conclusion. Check the roles and interpretation.'):t('Confira os papéis e a interpretação antes de carregar.','Check the roles and interpretation before loading.');
    }
    function loadArgument(){
      if(load.disabled||!reading)return;
      saveArguments();
      const doc={id:'argument-'+crypto.randomUUID(),name:t('Texto interpretado','Interpreted text'),customName:t('Texto interpretado','Interpreted text'),numbered:true,logicMode:reading.mode,descriptions:reading.descriptions,
        rows:reading.rows.map((row,index)=>({text:reading.translated?reading.interpretations[index].formula:row.text,role:row.role}))};
      argumentWorkspace.documents.push(doc);showArgument(doc.id,true);saveArguments();dialog.close();
    }
    dialog.onclose=()=>{dialog.remove();if(previous?.isConnected)previous.focus({preventScroll:true});};dialog.showModal();input.focus();
  });
})();
