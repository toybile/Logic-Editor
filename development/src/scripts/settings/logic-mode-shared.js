const logicModeDefinitions = [
  ['syllogistic','Silogística categórica','Categorical syllogistic'],
  ['propositional','Lógica proposicional clássica','Classical propositional logic'],
  ['first-order','Lógica de primeira ordem clássica','Classical first-order logic'],
];
const logicModeShortNames = {
  syllogistic:['Silogística','Syllogistic'],
  propositional:['Proposicional','Propositional'],
  'first-order':['Primeira ordem','First order'],
};
function logicModeIcon(id) {
  const shapes = {
    syllogistic:'<circle cx="8" cy="14" r="5"/><circle cx="16" cy="14" r="5"/><circle cx="12" cy="7.5" r="5"/>',
    propositional:'<circle cx="4" cy="12" r="2.5"/><circle cx="20" cy="12" r="2.5"/><path d="M7 12h10m-3-3 3 3-3 3"/>',
    'first-order':'<path d="m5 4 7 16 7-16M8.5 12h7"/>',
  };
  return '<svg viewBox="0 0 24 24" aria-hidden="true">'+shapes[id]+'</svg>';
}
function setLogicMode(mode) {
  if(!logicModeDefinitions.some(([id])=>id===mode))return false;
  const doc=argumentWorkspace.documents.find(document=>document.id===argumentWorkspace.activeId);
  if(!doc||doc.logicMode===mode)return false;
  doc.logicMode=mode;saveArguments();
  if(logicEnabled)updateLogicValidation();
  return true;
}

function attachLogicModePicker(trigger, dialog, getMode, onSelect, menuId) {
  const menu=document.createElement('div');menu.id=menuId;menu.className='hy-logic-mode-menu hy-analysis-mode-menu';
  menu.setAttribute('popover','manual');menu.setAttribute('role','menu');dialog.append(menu);
  trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',menu.id);
  function close(focus=false){if(menu.matches(':popover-open'))menu.hidePopover();trigger.setAttribute('aria-expanded','false');if(focus&&dialog.open)trigger.focus();}
  function position(){if(!menu.matches(':popover-open'))return;const bounds=trigger.getBoundingClientRect();menu.style.left=Math.max(12,Math.min(innerWidth-menu.offsetWidth-12,bounds.left))+'px';menu.style.top=Math.min(innerHeight-menu.offsetHeight-12,bounds.bottom+10)+'px';}
  trigger.onclick=()=>{
    if(menu.matches(':popover-open')){close();return;}
    menu.replaceChildren();
    for(const [id,pt,en] of logicModeDefinitions){
      const button=document.createElement('button');button.type='button';button.innerHTML=logicModeIcon(id);
      const name=document.createElement('span');name.textContent=interfaceText(pt,en);button.append(name);
      button.setAttribute('role','menuitemradio');button.setAttribute('aria-checked',String(id===getMode()));
      button.onclick=()=>{close();onSelect(id);trigger.focus();};menu.append(button);
    }
    menu.showPopover();trigger.setAttribute('aria-expanded','true');position();
    menu.querySelector('[aria-checked=true]').focus();
  };
  menu.addEventListener('keydown',event=>{
    const buttons=[...menu.children],index=buttons.indexOf(document.activeElement);
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?2:(index+(['ArrowUp','ArrowLeft'].includes(event.key)?2:1))%3;buttons[next].focus();
    }
  });
  const outside=event=>{if(!trigger.contains(event.target)&&!menu.contains(event.target))close();};document.addEventListener('pointerdown',outside,true);
  const escape=event=>{if(event.key==='Escape'&&menu.matches(':popover-open')){event.preventDefault();event.stopImmediatePropagation();close(true);}};document.addEventListener('keydown',escape,true);
  dialog.addEventListener('close',()=>close());window.addEventListener('resize',position);
  menu.addEventListener('toggle',event=>trigger.setAttribute('aria-expanded',String(event.newState==='open')));

  return ()=>{close();menu.remove();document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',escape,true);window.removeEventListener('resize',position);};
}
