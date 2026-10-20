// The argument stays in view while a detail panel presents the analysis tools.
const validationDialog = document.createElement('dialog');
validationDialog.className = 'hy-validation-dialog';
validationDialog.id = 'logic-validation-dialog';
const validationHeader = document.createElement('header');
validationHeader.className = 'hy-validation-heading';
const validationIdentity = document.createElement('div');
validationIdentity.className = 'hy-analysis-identity';
const validationModeIcon = document.createElement('button');
validationModeIcon.type = 'button';
validationModeIcon.className = 'hy-analysis-mode-icon';
const validationHeadingText = document.createElement('div');
const validationTitle = document.createElement('h2');
validationTitle.id = 'validation-title';
const validationMode = document.createElement('p');
validationMode.className = 'hy-analysis-mode-name';
validationHeadingText.append(validationTitle, validationMode);
validationIdentity.append(validationModeIcon, validationHeadingText);
validationDialog.setAttribute('aria-labelledby', validationTitle.id);
const validationClose = document.createElement('button');
validationClose.type = 'button';
validationClose.className = 'hy-button hy-icon-button hy-analysis-close';
validationClose.textContent = '×';
validationClose.onclick = () => validationDialog.close();
validationHeader.append(validationIdentity, validationClose);
const validationWorkspace = document.createElement('div');
validationWorkspace.className = 'hy-analysis-workspace';
const validationPreview = document.createElement('section');
validationPreview.className = 'hy-validation-preview';
const validationPreviewHeading = document.createElement('div');
validationPreviewHeading.className = 'hy-analysis-section-label';
const validationArgumentLabel = document.createElement('h3');
const validationRowCount = document.createElement('span');
validationPreviewHeading.append(validationArgumentLabel, validationRowCount);
const validationControls = document.createElement('div');
validationControls.className = 'hy-section-head';
const validationPreviewFooter = document.createElement('footer');
validationPreviewFooter.className = 'hy-analysis-preview-actions';
const validationVocabulary = document.createElement('button');
validationVocabulary.type = 'button';
validationVocabulary.className = 'hy-button hy-analysis-vocabulary';
validationVocabulary.onclick = () => root.querySelector('.hy-proposition-descriptions').click();
validationPreviewFooter.append(validationVocabulary);
validationPreview.append(validationPreviewHeading, validationControls, validationPreviewFooter);
const validationAnalysis = document.createElement('section');
validationAnalysis.className = 'hy-analysis-results';
const validationResultLabel = document.createElement('h3');
validationResultLabel.className = 'hy-analysis-section-label';
validationAnalysis.append(validationResultLabel, logicPanel);
const validationInspector = document.createElement('section');
validationInspector.className = 'hy-analysis-inspector';
validationInspector.id = 'analysis-detail-panel';
validationInspector.hidden = true;
const validationInspectorHead = document.createElement('header');
validationInspectorHead.className = 'hy-analysis-inspector-heading';
const validationBack = document.createElement('button');
validationBack.type = 'button';
validationBack.className = 'hy-button hy-analysis-back';
const validationInspectorTitle = document.createElement('h3');
validationInspectorTitle.id = 'analysis-detail-title';
const validationInspectorBody = document.createElement('div');
validationInspectorBody.className = 'hy-analysis-inspector-body';
validationInspector.setAttribute('aria-labelledby', validationInspectorTitle.id);
validationInspectorHead.append(validationBack, validationInspectorTitle);
validationInspector.append(validationInspectorHead, validationInspectorBody);
validationWorkspace.append(validationPreview, validationAnalysis, validationInspector);
const validationModeNotice = document.createElement('div');
validationModeNotice.className = 'hy-analysis-mode-notice';
validationModeNotice.setAttribute('role','status');validationModeNotice.hidden=true;
const validationModeSuggestion = document.createElement('button');validationModeSuggestion.type='button';
validationModeNotice.append(validationModeSuggestion);
validationDialog.append(validationHeader, validationModeNotice, validationWorkspace, logicFooter);
root.append(validationDialog);

const argumentActions = document.createElement('footer');
argumentActions.className = 'hy-panel-actions';
const argumentOutput = root.querySelector('.hy-argument-panel .hy-export-group');
argumentActions.append(logicButton, argumentOutput);
root.querySelector('.hy-argument-panel .hy-preview-inner').append(argumentActions);
logicButton.hidden = !ui.preview;
logicButton.inert = !ui.preview;
logicButton.setAttribute('aria-haspopup', 'dialog');
logicButton.setAttribute('aria-controls', validationDialog.id);
let validationRestore = [];
let validationReturnFocus = null;
let validationDetail = null;

function analysisIcon(name) {
  const paths = {
    table: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 9h16M9 4v16M4 14h16"/>',
    guide: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    redundancy: '<path d="M8 7h12M8 12h12M8 17h7M3 7h.01M3 12h.01M3 17h.01"/>',
    vocabulary: '<path d="M5 4h14a1 1 0 0 1 1 1v15H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2M4 17h16M9 8h7M9 12h4"/>',
    compare: '<path d="M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4"/>',
    back: '<path d="m14 6-6 6 6 6"/>',
    valid: '<path d="m5 12 4 4 10-10"/>',
    invalid: '<path d="m7 7 10 10M17 7 7 17"/>',
    syntax: '<path d="m8 6-5 6 5 6M16 6l5 6-5 6"/>',
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = paths[name] || paths.guide;
  return svg;
}

function resetValidationInspector(returnFocus = false) {
  if (!validationDetail) return;
  const { section, marker, trigger } = validationDetail;
  validationDetail = null;
  section.open = false;
  delete section.dataset.inspected;
  marker.replaceWith(section);
  trigger.setAttribute('aria-expanded', 'false');
  validationInspector.hidden = true;
  validationAnalysis.hidden = false;
  if (returnFocus) trigger.focus();
}
validationBack.onclick = () => resetValidationInspector(true);
validationDialog.addEventListener('cancel', event => {
  if (!validationDetail || root.querySelector('.hy-beta-dialog[open]')) return;
  event.preventDefault();
  resetValidationInspector(true);
});

function showValidationModeMismatch() {
  logicPanel.dataset.state='mode-mismatch';
  const card=document.createElement('section');card.className='hy-analysis-summary';
  const heading=document.createElement('h3');heading.className='hy-analysis-result-heading';
  heading.append(analysisIcon('guide'),document.createTextNode(interfaceText('Modo incompatível com esta escrita','Mode does not support this notation')));
  const description=document.createElement('p');description.textContent=interfaceText('Escolha um modo compatível para analisar este argumento. As fórmulas e descrições serão preservadas.','Choose a compatible mode to analyze this argument. Formulas and descriptions will be preserved.');
  card.append(heading,description);logicPanel.replaceChildren(card);refreshValidationWorkspace();
}
function refreshValidationModeAdvice() {
  const advice=LPModeInference.inspect(rows,currentLogicMode());
  validationModeNotice.hidden=!advice;
  if(!advice){validationModeSuggestion.replaceChildren();return;}
  const target=interfaceText(...logicModeShortNames[advice.suggested]), selected=interfaceText(...logicModeShortNames[advice.selected]);
  const label=document.createElement('span');
  label.textContent=interfaceText('Esta escrita é compatível com '+target+'. Trocar de '+selected+'?', 'This notation is compatible with '+target+'. Switch from '+selected+'?');
  const action=document.createElement('strong');action.textContent=interfaceText('Trocar lógica','Switch logic');
  validationModeSuggestion.replaceChildren(analysisIcon('guide'),label,action);
  validationModeSuggestion.dataset.suggestedMode=advice.suggested;
  validationModeSuggestion.onclick=()=>{setLogicMode(advice.suggested);validationModeIcon.focus();};
}
function refreshValidationWorkspace() {
  const t = interfaceText;
  refreshValidationModeAdvice();
  validationTitle.textContent = t('Validação lógica', 'Logic validation');
  validationClose.setAttribute('aria-label', t('Fechar', 'Close'));
  validationMode.textContent = currentLogicMode() === 'syllogistic'
    ? t('Silogística categórica', 'Categorical syllogistic')
    : currentLogicMode() === 'first-order'
      ? t('Lógica de primeira ordem', 'First-order logic')
      : t('Lógica proposicional', 'Propositional logic');
  validationModeIcon.replaceChildren(root.querySelector('.hy-mode-icon svg')?.cloneNode(true) || analysisIcon('syntax'));
  validationModeIcon.setAttribute('aria-label',t('Alterar lógica: ','Change logic: ')+validationMode.textContent);
  validationModeIcon.dataset.hintText=t('Escolher lógica','Choose logic');
  validationArgumentLabel.textContent = t('Argumento', 'Argument');
  validationResultLabel.textContent = t('Análise', 'Analysis');
  const count = rows.filter(row => row.role === 'premise' && row.text.trim()).length;
  validationRowCount.textContent = count + ' ' + (count === 1 ? t('premissa', 'premise') : t('premissas', 'premises'));
  validationVocabulary.replaceChildren(analysisIcon('vocabulary'), document.createTextNode(t('Vocabulário', 'Vocabulary')));
  validationBack.replaceChildren(analysisIcon('back'));
  validationBack.setAttribute('aria-label', t('Voltar à análise', 'Back to analysis'));
  for (const section of logicPanel.querySelectorAll(':scope > details, :scope > .hy-extended-logic > details')) {
    if (section.dataset.analysisTool) continue;
    const summary = section.querySelector(':scope > summary');
    if (!summary) continue;
    const title = summary.textContent;
    const icon = section.classList.contains('hy-truth-table') ? 'table'
      : section.classList.contains('hy-redundancy') ? 'redundancy' : 'guide';
    section.dataset.analysisTool = icon;
    const caption = document.createElement('span');
    caption.textContent = title;
    summary.replaceChildren(analysisIcon(icon), caption);
    summary.setAttribute('aria-controls', validationInspector.id);
    summary.setAttribute('aria-expanded', 'false');
    summary.addEventListener('click', event => {
      event.preventDefault();
      resetValidationInspector();
      const marker = document.createComment('analysis detail');
      section.before(marker);
      validationDetail = { section, marker, trigger: summary };
      section.dataset.inspected = '';
      section.open = true;
      summary.setAttribute('aria-expanded', 'true');
      validationInspectorTitle.textContent = title;
      validationInspectorBody.replaceChildren(section);
      validationAnalysis.hidden = true;
      validationInspector.hidden = false;
      validationInspectorBody.scrollTop = 0;
      validationBack.focus();
    });
  }
  const compare = logicPanel.querySelector('.hy-advanced-tools button');
  if (compare && !compare.querySelector('svg')) {
    const label = compare.textContent;
    compare.replaceChildren(analysisIcon('compare'), document.createTextNode(label));
  }
}

// Exports capture the original panel geometry, even while its content is in analysis.
function withArgumentPanelSnapshot(capture) {
  if (!validationDialog.open) return capture(root.querySelector('.hy-argument-panel'));
  const temporary = validationRestore.map(({ node, marker }) => {
    const current = document.createComment('snapshot restore');
    node.before(current); marker.before(node);
    return { node, current };
  });
  try { return capture(root.querySelector('.hy-argument-panel')); }
  finally { for (const { node, current } of temporary) current.replaceWith(node); }
}
function openLogicValidation() {
  if (validationDialog.open) return;
  const tools = root.querySelector('.hy-argument-panel .hy-tools'),
    content = root.querySelector('#hy-argument');
  validationRestore = [tools, content, argumentOutput].map(node => {
    const marker = document.createComment('validation restore');
    node.before(marker);
    return { node, marker };
  });
  validationControls.append(tools);
  validationPreviewFooter.append(argumentOutput);
  validationPreviewFooter.before(content);
  logicEnabled = true;
  logicPanel.hidden = false;
  logicButton.setAttribute('aria-expanded', 'true');
  refreshValidationWorkspace();
  validationDialog.showModal();
  updateLogicValidation();
}
validationDialog.addEventListener('close', () => {
  resetValidationInspector();
  logicEnabled = false;
  logicRevision++;
  clearTimeout(logicTimer);
  for (const { node, marker } of validationRestore) marker.replaceWith(node);
  validationRestore = [];
  logicPanel.hidden = true;
  logicButton.setAttribute('aria-expanded', 'false');
  (validationReturnFocus || logicButton).focus();
  validationReturnFocus = null;
});
validationDialog.addEventListener('click', event => {
  if (event.target !== validationDialog) return;
  const b = validationDialog.getBoundingClientRect();
  if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) validationDialog.close();
});
