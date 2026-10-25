function currentLogicMode() {
  return argumentWorkspace.documents.find(doc => doc.id === argumentWorkspace.activeId)?.logicMode || 'propositional';
}
attachLogicModePicker(validationModeIcon,validationDialog,currentLogicMode,setLogicMode,'validation-mode-options');
