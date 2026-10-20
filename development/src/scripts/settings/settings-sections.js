// Keep existing settings nodes and their listeners; only their presentation changes.
(() => {
  const settings=root.querySelector('#editor-settings');
  const head=settings.querySelector(':scope > .hy-settings-head');
  const switches=settings.querySelector('.hy-settings-switches');
  const actions=document.createElement('div');actions.className='hy-settings-actions';
  actions.append(...switches.children,head.querySelector('button'));
  head.append(actions);switches.remove();
  const tabs=document.createElement('div');tabs.className='hy-settings-tabs';tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label',interfaceText('Seções das configurações','Settings sections'));
  const appearance=document.createElement('section'),functionalities=document.createElement('section');
  appearance.id='settings-appearance';functionalities.id='settings-functionalities';
  for(const panel of [appearance,functionalities]){panel.className='hy-settings-panel';panel.setAttribute('role','tabpanel');}
  appearance.append(settings.querySelector('.hy-theme-choices'),settings.querySelector('.hy-setting:has(#scale-library)'),settings.querySelector('.hy-setting:has(#scale-writing)'),settings.querySelector('.hy-layout-recovery-setting'));
  const panelSection=document.createElement("section");panelSection.className="hy-panel-shortcuts";
  const title=document.createElement("h3");title.textContent=interfaceText("Personalizar painéis","Customize panels");
  function infoButton(pt,en,labelPt,labelEn) {
    const button=document.createElement("button");button.type="button";
    button.className="hy-icon-button hy-settings-info";
    button.setAttribute("aria-label",interfaceText(labelPt,labelEn));
    button.dataset.hintText=interfaceText(pt,en);
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>';
    return button;
  }
  title.className="hy-settings-section-heading";
  title.append(infoButton("Clique em um painel abaixo ou segure o olhinho dele para personalizar.","Click a panel below or hold its eye button to customize it.","Informações sobre personalização dos painéis","Panel customization information"));
  const buttons=document.createElement("div");buttons.className="hy-panel-shortcut-grid";
  [["editor","Premissas e conclusões","Premises and conclusions",'<path d="M9 6h12M9 12h12M9 18h12M3 6h2M3 12h2M3 18h2"/>'],["preview","Argumento","Argument",'<path d="M14 3H5v18h14V8ZM14 3v5h5M8 12h8M8 16h8"/>']].forEach(([key,pt,en,icon])=>{
    const button=document.createElement("button");button.type="button";button.dataset.panelSettings=key;
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icon+'</svg>';
    const name=document.createElement("span");name.textContent=interfaceText(pt,en);button.append(name);
    button.onclick=()=>{root.dispatchEvent(new CustomEvent("lp-open-panel-appearance",{detail:{key}}));};buttons.append(button);
  });
  const themeHeading=appearance.querySelector(".hy-theme-choices legend");
  themeHeading.classList.add("hy-settings-section-heading");
  themeHeading.append(infoButton("Segure uma área vazia do fundo para escolher o tema.","Hold an empty area of the background to choose a theme.","Informações sobre temas","Theme information"));
  panelSection.append(title,buttons);
  appearance.querySelector(".hy-theme-choices").after(panelSection);
  functionalities.append(...settings.querySelectorAll('.hy-hover-delay-setting'));
  settings.querySelector('.hy-appearance-settings')?.remove();
  const panels=[appearance,functionalities];
  function select(index,focus=false){
    panels.forEach((panel,i)=>{panel.hidden=i!==index;const tab=tabs.children[i];tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    ui.settingsTab=index===1?'functionalities':'appearance';saveUI();if(focus)tabs.children[index].focus();
  }
  [['Aparência','Appearance'],['Funcionalidades','Functionalities']].forEach(([pt,en],i)=>{
    const tab=document.createElement('button');tab.type='button';tab.id=panels[i].id+'-tab';tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[i].id);
    tab.textContent=interfaceText(pt,en);panels[i].setAttribute('aria-labelledby',tab.id);
    tab.onclick=()=>select(i);tab.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();select(e.key==='Home'?0:e.key==='End'?1:1-i,true);}};
    tabs.append(tab);
  });
  head.after(tabs);settings.append(appearance,functionalities);
  select(ui.settingsTab==='functionalities'?1:0);applyLanguage();
})();
