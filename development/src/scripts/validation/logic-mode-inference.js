// Classify supported notation, not the intended semantics or truth of premises.
(function(scope){
  function inspect(rows,selected){
    if(!Array.isArray(rows)||rows.length>200)return null;
    const formulas=rows.filter(row=>row.role==='premise'||row.role==='conclusion').map(row=>row.text?.trim()).filter(Boolean);
    if(!formulas.length||formulas.some(text=>text.length>10000))return null;
    const parsers={propositional:scope.LPLogic.parse,syllogistic:scope.LPCategorical.parse,'first-order':scope.LPFirstOrder.parse};
    if(!Object.hasOwn(parsers,selected))return null;
    const fits=parser=>formulas.every(text=>{try{parser(text);return true;}catch{return false;}});
    if(fits(parsers[selected]))return null;
    const candidates=Object.keys(parsers).filter(mode=>mode!==selected&&fits(parsers[mode]));
    // Zero-place predicates also form the propositional fragment of FOL.
    // Prefer the smaller language only when the selected mode rejects the text.
    const suggested=candidates.length===1?candidates[0]
      :candidates.length===2&&candidates.includes('propositional')&&candidates.includes('first-order')?'propositional':null;
    return suggested?{selected,suggested,candidates}:null;
  }
  scope.LPModeInference={inspect};
  if(typeof module!=='undefined')module.exports=scope.LPModeInference;
})(globalThis);
