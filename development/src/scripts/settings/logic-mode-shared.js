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
