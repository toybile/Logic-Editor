// Reuse the live preview and its controls; restore their exact positions on close.
const validationDialog = document.createElement("dialog");
validationDialog.className = "hy-validation-dialog";
const validationHeader = document.createElement("header");
validationHeader.className = "hy-validation-heading";
const validationTitle = document.createElement("h2");
validationTitle.id = "validation-title";
validationTitle.textContent = interfaceText("Validação lógica", "Logic validation");
validationDialog.setAttribute("aria-labelledby", validationTitle.id);
const validationClose = document.createElement("button");
validationClose.type = "button";
validationClose.className = "hy-button hy-icon-button";
validationClose.setAttribute("aria-label", interfaceText("Fechar", "Close"));
validationClose.textContent = "×";
validationClose.onclick = () => validationDialog.close();
validationHeader.append(validationTitle, validationClose);
const validationPreview = document.createElement("section");
validationPreview.className = "hy-validation-preview";
const validationControls = document.createElement("div");
validationControls.className = "hy-section-head";
validationPreview.append(validationControls);
validationDialog.append(validationHeader, validationPreview, logicFooter, logicPanel);
root.append(validationDialog);
const argumentActions = document.createElement('footer');
argumentActions.className = 'hy-panel-actions';
const argumentOutput = root.querySelector('.hy-argument-panel .hy-export-group');
argumentActions.append(logicButton, argumentOutput);
root.querySelector('.hy-argument-panel .hy-preview-inner').append(argumentActions);
logicButton.hidden = !ui.preview;
logicButton.inert = !ui.preview;
logicButton.setAttribute("aria-haspopup", "dialog");
logicButton.setAttribute("aria-controls", "logic-validation-dialog");
validationDialog.id = "logic-validation-dialog";
let validationRestore = [];
let validationReturnFocus = null;
// Measure the normal argument panel synchronously, even while its live content is in the dialog.
function withArgumentPanelSnapshot(capture) {
  if (!validationDialog.open) return capture(root.querySelector('.hy-argument-panel'));
  const temporary = validationRestore.map(({node,marker}) => {
    const current = document.createComment('snapshot restore');
    node.before(current); marker.before(node);
    return {node,current};
  });
  try { return capture(root.querySelector('.hy-argument-panel')); }
  finally { for (const {node,current} of temporary) current.replaceWith(node); }
}
function openLogicValidation() {
  if (validationDialog.open) return;
  const tools = root.querySelector(".hy-argument-panel .hy-tools"),
    content = root.querySelector("#hy-argument");
  validationRestore = [tools, content, argumentOutput].map(node => {
    const marker = document.createComment("validation restore");
    node.before(marker);
    return { node, marker };
  });
  validationControls.append(tools);
  tools.append(argumentOutput);
  validationPreview.append(content);
  logicEnabled = true;
  logicPanel.hidden = false;
  logicButton.setAttribute("aria-expanded", "true");
  validationDialog.showModal();
  updateLogicValidation();
}
validationDialog.addEventListener("close", () => {
  logicEnabled = false;
  logicRevision++;
  clearTimeout(logicTimer);
  for (const { node, marker } of validationRestore) marker.replaceWith(node);
  validationRestore = [];
  logicPanel.hidden = true;
  logicButton.setAttribute("aria-expanded", "false");
  (validationReturnFocus || logicButton).focus();
  validationReturnFocus = null;
});
validationDialog.addEventListener("click", event => {
  if (event.target !== validationDialog) return;
  const b = validationDialog.getBoundingClientRect();
  if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) validationDialog.close();
});
