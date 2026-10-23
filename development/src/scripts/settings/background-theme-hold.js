function isThemeBackgroundTarget(node) {
  return node instanceof Element && (node === document.body || node === document.documentElement || node.matches('#lp-hybrid,.hy-layout,.hy-work,.hy-panel-board'));
}
function openBackgroundThemes(pointerId) {
  if(root.querySelector('.hy-theme-dialog[open]'))return;
  const dialog=document.createElement('dialog');dialog.className='hy-feature-dialog hy-theme-dialog';
  const head=document.createElement('div');head.className='hy-settings-head';
  const title=document.createElement('h2');title.textContent=interfaceText('Temas e aparência','Themes and appearance');title.id='background-theme-title';
  dialog.setAttribute('aria-labelledby',title.id);
  const close=document.createElement('button');close.type='button';close.className='hy-button hy-icon-button';close.setAttribute('aria-label',interfaceText('Fechar','Close'));
  close.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  LPDialogChrome.close(close);close.onclick=()=>dialog.close();const eyebrow=document.createElement('p');eyebrow.className='hy-theme-eyebrow';eyebrow.textContent=interfaceText('Do seu jeito','Make it yours');
  const subtitle=document.createElement('p');subtitle.className='hy-theme-subtitle';subtitle.textContent=interfaceText('Cores tranquilas para acompanhar o seu raciocínio.','Calm colors to accompany your reasoning.');
  head.append(eyebrow,title,subtitle,close);
  const options=createThemeOptions();
  const done=document.createElement('button');done.type='button';done.className='hy-button hy-theme-done';done.textContent=interfaceText('Pronto','Done');done.onclick=()=>dialog.close();options.querySelector('.hy-theme-actions').append(done);
  dialog.append(head,options);
  let openingPointer=pointerId;
  const released=e=>{if(e.pointerId!==openingPointer)return;document.removeEventListener('pointerup',released,true);document.removeEventListener('pointercancel',released,true);requestAnimationFrame(()=>{openingPointer=undefined;});};
  if(pointerId!==undefined){document.addEventListener('pointerup',released,true);document.addEventListener('pointercancel',released,true);}
  dialog.addEventListener('click',e=>{if(openingPointer!==undefined&&e.pointerId===openingPointer){e.preventDefault();e.stopImmediatePropagation();}},true);
  dialog.onclose=()=>{document.removeEventListener('pointerup',released,true);document.removeEventListener('pointercancel',released,true);dialog.remove();};dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();});
  root.append(dialog);applyUI();dialog.showModal();
}
(() => {
  let gesture=null;
  function cancel(){if(gesture)clearTimeout(gesture.timer);gesture=null;}
  document.addEventListener('pointerdown',event=>{
    cancel();if(event.button!==0||!event.isPrimary||!isThemeBackgroundTarget(event.target))return;
    const state={id:event.pointerId,x:event.clientX,y:event.clientY};gesture=state;
    state.timer=setTimeout(()=>{if(gesture!==state)return;gesture=null;openBackgroundThemes(state.id);},getHoldDelay());
  });
  document.addEventListener('pointermove',event=>{if(gesture&&event.pointerId===gesture.id&&Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)>5)cancel();});
  for(const name of ['pointerup','pointercancel','scroll'])document.addEventListener(name,cancel,true);
  window.addEventListener('blur',cancel);document.addEventListener('keydown',cancel);
})();
