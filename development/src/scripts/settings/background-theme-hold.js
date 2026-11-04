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
  let gesture=null,lastTap=null,frame=0,hideTimer=0;
  const visual=document.createElement('div');visual.className='hy-background-feedback';visual.setAttribute('popover','manual');visual.setAttribute('aria-hidden','true');root.append(visual);
  const icons={
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon:'<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
    gear:'<path d="m9.5 3-.7 2.2-2 .9-2.1-.5-2 3.4 1.5 1.7v2.6L2.7 15l2 3.4 2.1-.5 2 .9.7 2.2h4.9l.7-2.2 2-.9 2.1.5 2-3.4-1.5-1.7v-2.6L21.2 9l-2-3.4-2.1.5-2-.9L14.4 3Z"/><circle cx="12" cy="12" r="3"/>'
  };
  function icon(name){visual.innerHTML='<span><svg viewBox="0 0 24 24">'+icons[name]+'</svg></span>';}
  function cancel(){if(gesture)clearTimeout(gesture.timer);gesture=null;cancelAnimationFrame(frame);clearTimeout(hideTimer);if(visual.matches(':popover-open'))visual.hidePopover();}
  // Prevent the browser's multi-click word selection only on gesture background.
  document.addEventListener('mousedown',event=>{
    if(event.button===0&&event.detail>1&&isThemeBackgroundTarget(event.target))event.preventDefault();
  },true);
  document.addEventListener('pointerdown',event=>{
    cancel();if(event.button!==0||!event.isPrimary||!isThemeBackgroundTarget(event.target)){lastTap=null;return;}
    const now=performance.now(),second=lastTap&&now-lastTap.time<420&&Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y)<32;
    lastTap=null;const state={id:event.pointerId,x:event.clientX,y:event.clientY,start:now,duration:getHoldDelay(),second};gesture=state;
    icon(second?'gear':(isDarkTheme()?'sun':'moon'));
    visual.style.left=Math.min(innerWidth-44,Math.max(8,event.clientX+18))+'px';visual.style.top=Math.min(innerHeight-44,Math.max(8,event.clientY+18))+'px';visual.style.setProperty('--hold-progress','0%');visual.showPopover();
    function progress(){if(gesture!==state)return;visual.style.setProperty('--hold-progress',Math.min(100,(performance.now()-now)/state.duration*100)+'%');frame=requestAnimationFrame(progress);}frame=requestAnimationFrame(progress);
    state.timer=setTimeout(()=>{if(gesture!==state)return;state.fired=true;cancelAnimationFrame(frame);visual.style.setProperty('--hold-progress','100%');if(second){visual.hidePopover();root.querySelector('#editor-settings').showPopover();}else{ui.themeMode=isDarkTheme()?'light':'dark';resolveThemeScheme(ui.themeMode);applyUI();icon(isDarkTheme()?'moon':'sun');hideTimer=setTimeout(()=>{if(visual.matches(':popover-open'))visual.hidePopover();},200);}},state.duration);
  });
  document.addEventListener('pointerup',event=>{if(!gesture||event.pointerId!==gesture.id)return;const state=gesture;if(state.fired&&state.second)requestAnimationFrame(()=>root.querySelector('#editor-settings').showPopover());if(!state.fired&&!state.second&&performance.now()-state.start<300)lastTap={time:performance.now(),x:state.x,y:state.y};cancel();},true);
  document.addEventListener('pointermove',event=>{if(gesture&&event.pointerId===gesture.id&&Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)>14){lastTap=null;cancel();}});
  for(const name of ['pointercancel','scroll','keydown'])document.addEventListener(name,()=>{lastTap=null;cancel();},true);
  window.addEventListener('blur',()=>{lastTap=null;cancel();});
})();
