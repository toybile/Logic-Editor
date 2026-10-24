// Reuse the settings controls and their owners; navigation only redistributes them.
(() => {
  const settings = root.querySelector('#editor-settings');
  settings.setAttribute('role','dialog');
  const head = settings.querySelector(':scope > .hy-settings-head');
  LPDialogChrome.close(head.querySelector('button'));
  const switches = settings.querySelector('.hy-settings-switches');
  const actions = document.createElement('div'); actions.className='hy-settings-actions';
  actions.append(...switches.children,head.querySelector('button')); head.append(actions); switches.remove();
  const identity=document.createElement('div');identity.className='hy-settings-identity';
  const symbol=document.createElement('span');symbol.className='hy-settings-identity-icon';
  symbol.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 17h16M8 4v6M16 14v6"/></svg>';
  identity.append(symbol,head.querySelector('h2'));head.prepend(identity);
  const tabs=document.createElement('nav');tabs.className='hy-settings-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-orientation','vertical');
  const body=document.createElement('div');body.className='hy-settings-body';
  const pages=document.createElement('div');pages.className='hy-settings-pages';
  const definitions=[
    ['appearance','Aparência','Appearance','<circle cx="12" cy="12" r="8"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M9 16h6"/>'],
    ['panels','Painéis','Panels','<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M10 4v16"/>'],
    ['writing','Escrita','Writing','<path d="M5 5h14M12 5v14M8 19h8"/>'],
    ['functionalities','Interações','Interactions','<path d="m5 3 14 10-7 1-3 7Z"/>'],
  ];
  const panels=definitions.map(([key])=>{const panel=document.createElement('section');panel.id='settings-'+key;panel.className='hy-settings-panel';panel.setAttribute('role','tabpanel');pages.append(panel);return panel;});
  const [appearance,panelPage,writing,interactions]=panels;
  appearance.append(settings.querySelector('.hy-theme-choices'));
  const librarySize=settings.querySelector('.hy-setting:has(#scale-library)');
  writing.append(settings.querySelector('.hy-setting:has(#scale-writing)'));
  interactions.append(...settings.querySelectorAll('.hy-hover-delay-setting'));
  settings.querySelector('.hy-appearance-settings')?.remove();
  function infoButton(pt,en,labelPt,labelEn) {
    const button=document.createElement('button');button.type='button';button.className='hy-icon-button hy-settings-info';
    button.setAttribute('aria-label',interfaceText(labelPt,labelEn));button.dataset.hintText=interfaceText(pt,en);
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>';return button;
  }
  const panelSection=document.createElement('section');panelSection.className='hy-panel-shortcuts';
  const title=document.createElement('h3');title.className='hy-settings-section-heading';
  const titleText=document.createElement('span');titleText.textContent=interfaceText('Personalizar painéis','Customize panels');
  title.append(titleText,infoButton('Clique em um painel abaixo ou segure o olhinho dele para personalizar.','Click a panel below or hold its eye button to customize it.','Informações sobre personalização dos painéis','Panel customization information'));
  const buttons=document.createElement('div');buttons.className='hy-panel-shortcut-grid';
  const panelEditor=document.createElement('div');panelEditor.className='hy-settings-panel-editor';
  function showPanel(key) {
    ui.settingsPanel=key;
    buttons.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.panelSettings===key)));
    root.dispatchEvent(new CustomEvent('lp-open-panel-appearance',{detail:{key,container:panelEditor}}));
  }
  for(const [key,pt,en,path] of [
    ['editor','Premissas e conclusões','Premises and conclusions','<path d="M9 6h12M9 12h12M9 18h12M3 6h2M3 12h2M3 18h2"/>'],
    ['preview','Argumento','Argument','<path d="M14 3H5v18h14V8ZM14 3v5h5M8 12h8M8 16h8"/>'],
  ]){
    const button=document.createElement('button');button.type='button';button.dataset.panelSettings=key;
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';
    const name=document.createElement('span');name.textContent=interfaceText(pt,en);button.append(name);
    button.onclick=()=>{showPanel(key);saveUI();};buttons.append(button);
  }
  panelSection.append(title,buttons,panelEditor);panelPage.append(panelSection,librarySize,settings.querySelector('.hy-layout-recovery-setting'));
  const themeHeading=appearance.querySelector('.hy-theme-choices legend');themeHeading.classList.add('hy-settings-section-heading');
  themeHeading.append(infoButton('Segure o fundo para alternar claro/escuro. Clique e segure novamente para abrir as configurações.','Hold the background to switch light/dark. Click, then hold again to open settings.','Informações sobre temas','Theme information'));
  const prefixRow=document.createElement('label');prefixRow.className='hy-setting hy-settings-prefix-row';
  const prefixLabel=document.createElement('span');prefixLabel.textContent=interfaceText('Compactar prefixos e parênteses','Compact prefix symbols and parentheses');
  const prefix=document.createElement('input');prefix.type='checkbox';prefix.id='settings-compact-prefix';prefixRow.append(prefixLabel,prefix);writing.append(prefixRow);
  const prefixButton=root.querySelector('#compact-prefix-spacing');
  const refreshPrefix=()=>{prefix.checked=ui.compactPrefixSpacing===true;};
  prefix.onchange=()=>{if(prefix.checked!==(ui.compactPrefixSpacing===true))prefixButton.click();refreshPrefix();};
  new MutationObserver(refreshPrefix).observe(prefixButton,{attributes:true,attributeFilter:['aria-pressed']});refreshPrefix();
  let selected=0;
  function select(index,focus=false){
    selected=index;
    panels.forEach((panel,i)=>{panel.hidden=i!==index;const tab=tabs.children[i];tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    ui.settingsTab=definitions[index][0];saveUI();
    if(index===1&&settings.matches(':popover-open'))showPanel(ui.settingsPanel==='preview'?'preview':'editor');
    if(focus)tabs.children[index].focus();
  }
  definitions.forEach(([key,pt,en,path],index)=>{
    const tab=document.createElement('button');tab.type='button';tab.id='settings-'+key+'-tab';tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[index].id);
    tab.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';
    const name=document.createElement('span');name.textContent=interfaceText(pt,en);tab.append(name);panels[index].setAttribute('aria-labelledby',tab.id);
    tab.onclick=()=>select(index);tab.onkeydown=event=>{const keys=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'];if(!keys.includes(event.key))return;event.preventDefault();select(event.key==='Home'?0:event.key==='End'?3:(index+(['ArrowUp','ArrowLeft'].includes(event.key)?3:1))%4,true);};tabs.append(tab);
  });
  body.append(tabs,pages);settings.append(body);
  const footer=document.createElement('footer');footer.className='hy-settings-footer';
  const restore=settings.querySelector('#settings-default');restore.classList.remove('hy-icon-button');
  const restoreLabel=document.createElement('span');restoreLabel.textContent=interfaceText('Restaurar padrões','Restore defaults');restore.append(restoreLabel);
  const note=document.createElement('span');note.textContent=interfaceText('Alterações automáticas','Changes apply automatically');footer.append(restore,note);settings.append(footer);
  Object.assign(translations,{'Painéis':'Panels','Escrita':'Writing','Interações':'Interactions','Alterações automáticas':'Changes apply automatically','Compactar prefixos e parênteses':'Compact prefix symbols and parentheses'});
  tabs.setAttribute('aria-label',interfaceText('Seções das configurações','Settings sections'));
  settings.addEventListener('toggle',event=>{if(event.newState==='open'&&selected===1)showPanel(ui.settingsPanel==='preview'?'preview':'editor');});
  root.querySelector('#settings-language').addEventListener('languagechange',()=>{if(selected===1&&settings.matches(':popover-open'))showPanel(ui.settingsPanel==='preview'?'preview':'editor');});
  select(Math.max(0,definitions.findIndex(([key])=>key===ui.settingsTab)));applyLanguage();
})();
