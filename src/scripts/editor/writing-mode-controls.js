(() => {
  const head = root.querySelector('.hy-editor > .hy-section-head'),
    toggle = document.createElement('button'), setting = document.createElement('section'),
    title = document.createElement('h3'), choices = document.createElement('div');
  toggle.type = 'button'; toggle.id = 'writing-mode-toggle'; toggle.className = 'hy-button hy-icon-button';
  head.querySelector('#caps-lock').before(toggle);
  setting.className = 'hy-setting hy-writing-mode-setting';
  title.id = 'writing-mode-label'; choices.className = 'hy-writing-mode-choices';
  choices.setAttribute('role','group'); choices.setAttribute('aria-labelledby', title.id);
  const labels = [['blocks','Blocos','Blocks'],['continuous','Linha contínua','Continuous line']];
  function refresh() {
    const continuous = ui.writingMode === 'continuous';
    root.dataset.writingMode = continuous ? 'continuous' : 'blocks';
    toggle.hidden = !ui.editor;
    toggle.setAttribute('aria-pressed',String(continuous));
    const action = continuous ? interfaceText('Escrever em blocos','Write in blocks') : interfaceText('Escrever em linha contínua','Write in a continuous line');
    toggle.setAttribute('aria-label',action); toggle.dataset.hintText = action;
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (continuous
      ? '<rect x="3" y="5" width="5" height="14" rx="1.5"/><rect x="11" y="5" width="5" height="14" rx="1.5"/><path d="M20 5v14"/>'
      : '<path d="M3 6h18M3 12h18M3 18h12"/>') + '</svg>';
    title.textContent = interfaceText('Modo de escrita','Writing mode');
    labels.forEach(([mode,pt,en],i) => {
      choices.children[i].textContent = interfaceText(pt,en);
      choices.children[i].setAttribute('aria-pressed',String((continuous ? 'continuous':'blocks') === mode));
    });
  }
  function setMode(mode, focus=false) {
    if (ui.writingMode === mode) return;
    const index = Math.max(0,rows.findIndex(row => rowElements.get(row)?.contains(active)));
    ui.writingMode = mode; saveUI(); refresh(); drawRows(); render();
    if (focus) {
      const fields = rowElements.get(rows[index])?.querySelectorAll('.hy-block,.hy-continuous-field'), field = fields?.[fields.length-1];
      field?.focus({preventScroll:true}); field?.setSelectionRange(field.value.length,field.value.length);
    }
  }
  for (const [mode] of labels) {
    const button = document.createElement('button'); button.type='button'; button.dataset.writingMode = mode;
    button.onclick = () => setMode(mode); choices.append(button);
  }
  toggle.onclick = () => setMode(ui.writingMode === 'continuous' ? 'blocks':'continuous',true);
  setting.append(title,choices); root.querySelector('#settings-functionalities').prepend(setting);
  root.addEventListener('lp-ui-colors',refresh);
  root.querySelector('#settings-language').addEventListener('click',refresh);
  const resize = () => requestAnimationFrame(resizeContinuousFields);
  window.addEventListener('resize',resize);
  root.querySelector('#scale-writing').addEventListener('input',resize);
  new ResizeObserver(resize).observe(root.querySelector('.hy-editor'));
  refresh();
})();
