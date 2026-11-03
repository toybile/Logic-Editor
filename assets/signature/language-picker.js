/* Original Portfolio language picker, extracted without behavioral changes. */
(()=>{function createLanguagePicker(button,flags,getLanguage,setLanguage){
 const icon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h12M9 2v3M5 5c1 5 4 8 8 10M13 5c-1 5-4 8-8 10m9 6 4-10 4 10m-6.5-4h5"/></svg>';
 button.innerHTML=icon;button.setAttribute('aria-label','Idioma / Language');button.removeAttribute('title');button.dataset.hintText='Idioma / Language';
 const picker=document.createElement('div');picker.id='signature-language-picker';picker.className='signature-language-picker';picker.setAttribute('popover','auto');picker.setAttribute('role','menu');picker.setAttribute('aria-label','Idioma / Language');picker.setAttribute('translate','no');
 const choices=[['pt-BR','pt','Português Brasileiro (pt-br)'],['en','en','International English (en)']];
 for(const [code,flag,label] of choices){const option=document.createElement('button');option.type='button';option.className='site-language-card';option.dataset.languageChoice=code;option.setAttribute('role','menuitemradio');option.setAttribute('lang',code);option.innerHTML='<span class="site-language-flag" aria-hidden="true">'+flags[flag]+'</span><span class="site-language-name"></span>';option.lastElementChild.textContent=label;option.addEventListener('click',()=>{if(getLanguage()!==code)setLanguage(code);refresh();picker.hidePopover();button.focus({preventScroll:true});button.dispatchEvent(new Event('languagechange'));});picker.append(option);}
 const parent=button.closest('dialog,[popover]')||document.body;parent.append(picker);button.setAttribute('popovertarget',picker.id);button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');
 function refresh(){const code=getLanguage()==='en'?'en':'pt-BR';button.dataset.language=code==='en'?'en':'pt';for(const option of picker.children){const active=option.dataset.languageChoice===code;option.setAttribute('aria-checked',String(active));option.tabIndex=active?0:-1;}}
 function position(){const anchor=button.getBoundingClientRect(),width=picker.offsetWidth||Math.min(448,innerWidth-24),height=picker.offsetHeight||88;const bounds=parent.getBoundingClientRect(),left=anchor.left+width>Math.min(innerWidth-12,bounds.right-12)?anchor.right-width:anchor.left;picker.style.left=Math.max(12,Math.min(innerWidth-width-12,left))+'px';picker.style.top=Math.max(12,anchor.bottom+8+height<=innerHeight-12?anchor.bottom+8:anchor.top-height-8)+'px';}
 picker.addEventListener('beforetoggle',event=>{if(event.newState==='open'){refresh();position();}});
 picker.addEventListener('toggle',event=>{const open=event.newState==='open';button.setAttribute('aria-expanded',String(open));if(open){position();picker.querySelector('[aria-checked="true"]').focus({preventScroll:true});}});
 picker.addEventListener('keydown',event=>{if(event.key==='Tab'){picker.hidePopover();button.focus({preventScroll:true});return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const options=[...picker.children],index=options.indexOf(document.activeElement);options[event.key==='Home'?0:event.key==='End'?1:(index+1)%2].focus();});
 window.addEventListener('resize',()=>{if(picker.matches(':popover-open'))position();});
 parent.addEventListener('scroll',event=>{if(picker.matches(':popover-open')&&!picker.contains(event.target))picker.hidePopover();},true);
 parent.addEventListener('close',()=>{if(picker.matches(':popover-open'))picker.hidePopover();});parent.addEventListener('toggle',event=>{if(event.target===parent&&event.newState==='closed'&&picker.matches(':popover-open'))picker.hidePopover();});
 refresh();return{refresh};
}

window.ToybileLanguagePicker=createLanguagePicker;})();
