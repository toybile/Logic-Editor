function currentLogicMode() {
  return argumentWorkspace.documents.find(doc => doc.id === argumentWorkspace.activeId)?.logicMode || 'propositional';
}
(() => {
  const t = interfaceText;
  const modes = [
    ['syllogistic','Silogística categórica','Categorical syllogistic'],
    ['propositional','Lógica proposicional clássica','Classical propositional logic'],
    ['first-order','Lógica de primeira ordem clássica','Classical first-order logic'],
  ];
  const title = root.querySelector('.hy-title strong');
  const trigger = document.createElement('button');
  trigger.id = 'logic-mode-select'; trigger.type = 'button';
  trigger.className = 'hy-logic-mode-select';
  const anchor = document.createElement('div'); anchor.className = 'hy-mode-anchor';
  title.before(anchor); anchor.append(title, trigger);
  const selectedName = document.createElement('span'); trigger.append(selectedName);
  trigger.insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>');
  const menu = document.createElement('div'); menu.className = 'hy-logic-mode-menu';
  menu.id = 'logic-mode-options'; menu.setAttribute('popover','auto'); menu.setAttribute('role','menu'); root.append(menu);
  trigger.setAttribute('aria-haspopup','menu'); trigger.setAttribute('aria-expanded','false'); trigger.setAttribute('aria-controls',menu.id);
  function help() {
    if(menu.matches(':popover-open'))menu.hidePopover();
    const d=document.createElement('dialog'); d.className='hy-feature-dialog hy-logic-mode-help';
    const head=document.createElement('header'), h=document.createElement('h2'),close=document.createElement('button');
    h.id='logic-modes-help-title';h.textContent=t('Modos de lógica','Logic modes');d.setAttribute('aria-labelledby',h.id);
    close.type='button';close.className='hy-button hy-icon-button';close.textContent='×';close.setAttribute('aria-label',t('Fechar','Close'));close.onclick=()=>d.close();head.append(h,close);d.append(head);
    const intro=document.createElement('p');intro.textContent=t('O modo pertence a este argumento e orienta sua análise. Todos os símbolos continuam disponíveis. Mudar o modo preserva fórmulas e descrições; não traduz automaticamente entre linguagens.','The mode belongs to this argument and guides its analysis. All symbols remain available. Switching preserves formulas and descriptions; it does not translate automatically between languages.');d.append(intro);
    const lessons=[
      [modes[0],
       'Estuda inferências entre termos, por meio de proposições como “Todo S é P”, “Nenhum S é P”, “Algum S é P” e “Algum S não é P”. Num silogismo categórico há duas premissas e uma conclusão, articuladas por três termos. Exemplo: todo M é P; todo S é M; portanto, todo S é P.',
       'Studies inferences between terms through propositions such as “Every S is P”, “No S is P”, “Some S is P” and “Some S is not P”. A categorical syllogism has two premises and a conclusion involving three terms. Example: every M is P; every S is M; therefore every S is P.',
       'As descrições identificam os termos. Pressupostos de existência e o tratamento de termos vazios precisam ser declarados. Silogística, lógica aristotélica e tradição escolástica não são expressões perfeitamente equivalentes. A validação específica deste modo ainda está em desenvolvimento.',
       'Descriptions identify the terms. Existential assumptions and treatment of empty terms must be specified. Syllogistic, Aristotelian logic and the scholastic tradition are not exactly interchangeable expressions. The dedicated validator for this mode is still in development.'],
      [modes[1],
       'Trata enunciados completos como unidades, representadas por A, B, P etc. Conectivos como ¬, ∧, ∨ e → determinam como os valores de verdade se combinam. Exemplo: A → B; A; portanto, B.',
       'Treats complete statements as units represented by A, B, P and so on. Connectives such as ¬, ∧, ∨ and → determine how truth values combine. Example: A → B; A; therefore B.',
       'As descrições registram o significado pretendido das letras. O verificador atual usa valorações clássicas para procurar premissas verdadeiras com conclusão falsa. Uma descrição não comprova que uma premissa é verdadeira no mundo. Quantificadores e operadores de outras lógicas ficam fora desse verificador.',
       'Descriptions record the intended meanings of letters. The current validator uses classical valuations to search for true premises with a false conclusion. A description does not establish that a premise is true in the world. Quantifiers and operators of other logics are outside this validator.'],
      [modes[2],
       'Analisa a estrutura interna das afirmações: indivíduos, predicados, relações e quantificação. Em ∀x(P(x) → Q(x)), quantificamos sobre indivíduos de um domínio. Exemplo: ∀x(P(x) → Q(x)); P(a); portanto, Q(a).',
       'Analyzes the internal structure of statements: individuals, predicates, relations and quantification. In ∀x(P(x) → Q(x)), quantification ranges over individuals in a domain. Example: ∀x(P(x) → Q(x)); P(a); therefore Q(a).',
       'Um vocabulário formal deve distinguir domínio, constantes, funções e predicados com sua aridade e ordem dos argumentos. O formulário atual ainda registra descrições livres de símbolos, não uma interpretação formal completa. A validação de primeira ordem está em desenvolvimento. Em geral, não existe um algoritmo que sempre termine decidindo todos os casos; uma busca sem resultado pode ser inconclusiva.',
       'A formal vocabulary must distinguish domain, constants, functions and predicates with their arity and argument order. The current form still stores free symbol descriptions, not a complete formal interpretation. First-order validation is in development. In general, no algorithm always terminates deciding every case; an unsuccessful search may be inconclusive.'],
    ];
    for(const [mode,pt,en,ptNote,enNote] of lessons){const section=document.createElement('section'),heading=document.createElement('h3'),p=document.createElement('p'),note=document.createElement('p');heading.textContent=t(mode[1],mode[2]);p.textContent=t(pt,en);note.textContent=t(ptNote,enNote);section.append(heading,p,note);d.append(section);}
    const link=document.createElement('a');link.href='https://forallx.openlogicproject.org/';link.target='_blank';link.rel='noopener noreferrer';link.textContent=t('Leitura: forall x — Open Logic Project','Reading: forall x — Open Logic Project');d.append(link);
    root.append(d);d.onclose=()=>{d.remove();trigger.focus();};d.showModal();
  }
  function refresh(){
    const mode=modes.find(([id])=>id===currentLogicMode())||modes[1];
    trigger.setAttribute('aria-label',t('Sistema lógico: ','Logical system: ')+t(mode[1],mode[2]));
    trigger.dataset.hintText=t(mode[1],mode[2])+'. '+t('Clique para escolher. Segure para conhecer os modos.','Click to choose. Hold to learn about the modes.');
    trigger.dataset.mode=mode[0];
    selectedName.textContent=t(mode[1],mode[2]);
    menu.replaceChildren();
    for(const [id,pt,en] of modes){const b=document.createElement('button');b.type='button';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9ZM14 3v6h6M8 13h8M8 17h5"/></svg>';const name=document.createElement('span');name.textContent=t(pt,en);b.append(name);b.setAttribute('role','menuitemradio');b.setAttribute('aria-checked',String(id===mode[0]));b.onclick=()=>{argumentWorkspace.documents.find(doc=>doc.id===argumentWorkspace.activeId).logicMode=id;menu.hidePopover();saveArguments();refresh();if(logicEnabled)updateLogicValidation();trigger.focus();};menu.append(b);}

  }
  let timer,held=false;
  const cancel=()=>clearTimeout(timer);
  trigger.addEventListener('pointerdown',e=>{if(e.button!==0)return;held=false;timer=setTimeout(()=>{held=true;help();},getHoldDelay());});
  for(const event of ['pointerup','pointercancel','pointerleave'])trigger.addEventListener(event,cancel);
  window.addEventListener('blur',cancel);
  trigger.onclick=()=>{if(held){held=false;return;}if(menu.matches(':popover-open')){menu.hidePopover();return;}refresh();menu.showPopover();const r=trigger.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(innerWidth-menu.offsetWidth-8,r.left))+'px';menu.style.top=r.bottom+8+'px';};
  menu.addEventListener('toggle',e=>trigger.setAttribute('aria-expanded',String(e.newState==='open')));
  workspaceEvents.addEventListener('saved',refresh);
  root.querySelector('#settings-language').addEventListener('click',refresh);
  const header = root.querySelector('.hy-head');
  function alignDock() {
    trigger.style.top = header.getBoundingClientRect().bottom - anchor.getBoundingClientRect().top - 1 + 'px';
    trigger.style.setProperty('--mode-header-background', getComputedStyle(header).backgroundColor);
  }
  new ResizeObserver(alignDock).observe(header);
  root.addEventListener('lp-ui-colors', () => requestAnimationFrame(alignDock));
  refresh();
  alignDock();
})();
