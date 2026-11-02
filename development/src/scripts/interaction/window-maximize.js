// Maximize is temporary presentation state; stored window geometry is preserved.
(() => {
  const states=new Map(),installed=new WeakMap();
  const motions=new WeakMap();
  function capture(window){motions.get(window)?.cancel();return window.getBoundingClientRect();}
  function spring(window,before){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||!window.isConnected)return;
    const after=window.getBoundingClientRect();if(!before.width||!before.height||!after.width||!after.height)return;
    const dx=before.left-after.left,dy=before.top-after.top,sx=before.width/after.width,sy=before.height/after.height;
    const origin=window.style.transformOrigin;window.style.transformOrigin='0 0';
    const base=getComputedStyle(window).transform,tail=base==='none'?'':' '+base;
    const pose=t=>'translate('+dx*t+'px,'+dy*t+'px) scale('+(1+(sx-1)*t)+','+(1+(sy-1)*t)+')'+tail;
    const animation=window.animate([{transform:pose(1),offset:0,easing:'cubic-bezier(.2,.75,.25,1)'},{transform:pose(-.025),offset:.72,easing:'ease-in-out'},{transform:pose(.006),offset:.88,easing:'ease-out'},{transform:pose(0),offset:1}],{duration:540});
    motions.set(window,animation);const clean=()=>{if(motions.get(window)===animation){window.style.transformOrigin=origin;motions.delete(window);}};animation.onfinish=clean;animation.oncancel=clean;return animation;
  }
  const icons={maximize:'<rect x="4" y="4" width="16" height="16" rx="2"/>',restore:'<path d="M8 8V4h12v12h-4"/><rect x="4" y="8" width="12" height="12" rx="1.5"/>'};
  function label(button,maximized){const text=interfaceText(maximized?'Restaurar tamanho':'Maximizar janela',maximized?'Restore size':'Maximize window');button.setAttribute('aria-label',text);button.dataset.hintText=text;button.setAttribute('aria-pressed',String(maximized));button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[maximized?'restore':'maximize']+'</svg>';}
  function restore(window){const state=states.get(window);if(!state)return;const before=capture(window);window.classList.remove('hy-window-maximized');if(state.frame){window.hidePopover();if(state.popover===null)window.removeAttribute('popover');else window.setAttribute('popover',state.popover);state.placeholder.remove();window.style.cssText=state.style;}states.delete(window);window.scrollTop=state.scrollTop;label(state.button,false);const motion=spring(window,before);if(state.frame){const release=()=>{if(![...states.values()].some(s=>s.frame))delete root.dataset.windowMaximized;};if(motion)motion.finished.then(release,release);else release();}}
  function toggle(window,button){if(states.has(window)){restore(window);return;}const frame=window.matches('.hy-panel-frame');if(frame){for(const [other,state]of states)if(state.frame)restore(other);}
    const before=capture(window);
    const state={button,frame,style:window.style.cssText,scrollTop:window.scrollTop,popover:window.getAttribute('popover')};
    if(frame){const box=window.getBoundingClientRect(),placeholder=document.createElement('div');placeholder.className='hy-maximize-placeholder';placeholder.setAttribute('aria-hidden','true');placeholder.style.cssText='width:'+box.width+'px;height:'+box.height+'px;pointer-events:none;';if(window.parentElement.dataset.manual==='true'){placeholder.style.position='absolute';placeholder.style.left=window.style.left;placeholder.style.top=window.style.top;}window.before(placeholder);state.placeholder=placeholder;root.dataset.windowMaximized='true';window.setAttribute('popover','manual');window.showPopover();}
    states.set(window,state);window.classList.add('hy-window-maximized');label(button,true);spring(window,before);
  }
  function install(window){if(installed.has(window))return;const frame=window.matches('.hy-panel-frame');const close=frame?null:window.querySelector('.hy-dialog-close,.hy-analysis-close,.hy-beta-close');const head=frame?window.querySelector('.hy-panel > .hy-section-head'):close?.parentElement;if(!head)return;
    const button=document.createElement('button');button.type='button';button.className='hy-button hy-icon-button hy-window-maximize';label(button,false);button.addEventListener('pointerdown',e=>e.stopPropagation());button.onclick=e=>{e.stopPropagation();toggle(window,button);};
    if(close){let actions=close.closest('.hy-settings-actions,.hy-window-actions');if(!actions){actions=document.createElement('span');actions.className='hy-window-actions';close.before(actions);actions.append(close);}actions.insertBefore(button,close);}else head.append(button);
    installed.set(window,button);window.addEventListener('close',()=>restore(window));window.addEventListener('toggle',e=>{if(e.target===window&&e.newState==='closed'&&states.has(window))restore(window);});window.addEventListener('cancel',e=>{if(states.has(window)){e.preventDefault();restore(window);button.focus({preventScroll:true});}});
  }
  function scan(){for(const window of root.querySelectorAll('dialog,#editor-settings,.hy-panel-frame'))install(window);for(const [window]of states)if(!window.isConnected)restore(window);}
  let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;scan();});}).observe(root,{childList:true,subtree:true});
  document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;for(const [window,state]of states){if(state.frame&&!root.querySelector('dialog[open]')&&!document.querySelector('#editor-settings:popover-open')){event.preventDefault();restore(window);state.button.focus({preventScroll:true});return;}}});
  root.querySelector('#settings-language').addEventListener('languagechange',()=>{for(const window of root.querySelectorAll('dialog,#editor-settings,.hy-panel-frame')){const button=installed.get(window);if(button)label(button,states.has(window));}});scan();
})();
