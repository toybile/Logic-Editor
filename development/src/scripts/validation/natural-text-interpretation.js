// Controlled-language interpretation proposes a reading; it never supplies a validity verdict.
(function(scope){
  const conclusion=/^(?:logo|portanto|assim|por conseguinte|consequentemente|conclui-se que|therefore|thus|hence|consequently|∴)\s*[:,]?\s*/iu;
  const premise=/^(?:porque|pois|uma vez que|já que|because|since)\s*[:,]?\s*/iu;
  function split(text){
    if(typeof text!=='string'||text.length>20000)throw Error('text-limit');
    const parts=text.trim().replace(/^\s*(?:\d+[.)]|[-•])\s+/gmu,'')
      .replace(/,\s*(?=(?:logo|portanto|por conseguinte|therefore|thus|hence|pois|porque|because)\s)/giu,'; ')
      .split(/[.;\n]+/u).map(part=>part.trim()).filter(Boolean);
    if(!parts.length)throw Error('text-empty');
    if(parts.length>200)throw Error('text-limit');
    let explicit=false;
    const rows=parts.map(part=>{
      const marked=conclusion.test(part);if(marked)explicit=true;
      return {text:part.replace(marked?conclusion:premise,'').trim(),role:marked?'conclusion':'premise'};
    });
    if(!explicit)rows.at(-1).role='conclusion';
    return {rows,explicit};
  }
  function formalReading(rows,mode){
    const parser=mode==='syllogistic'?scope.LPCategorical.parse:mode==='first-order'?scope.LPFirstOrder.parse:scope.LPLogic.parse;
    return rows.map((row,index)=>{
      try{
        const parsed=parser(row.text);
        return {index,text:row.text,formula:mode==='syllogistic'?`${parsed.form}(${parsed.subject}, ${parsed.predicate})`:row.text,singular:Boolean(parsed.singular)};
      }catch{return {index,text:row.text,error:'unsupported'};}
    });
  }
  function conditionalReading(rows){
    const atoms=new Map(),descriptions=Object.create(null);
    function atom(value){
      value=value.trim().replace(/\s+/gu,' ');
      const negation=value.match(/^(?:não é o caso que|não|it is not the case that|not)\s+(.+)$/iu);
      if(negation)return '¬'+atom(negation[1]);
      // Nested logical clauses, questions and unresolved references are left for the user.
      if(!value||value.length>500||/[,:;?!()∀∃→∧∨↔]/u.test(value)||/(?:^|\s)(?:se|então|e|ou|if|then|and|or|ele|ela|eles|elas|isso|he|she|they|it)(?:\s|$)/iu.test(value))throw Error('unsupported');
      const key=value.normalize('NFC').toLocaleLowerCase();
      if(!atoms.has(key)){const symbol='P'+(atoms.size+1);atoms.set(key,symbol);descriptions[symbol]=value;}
      return atoms.get(key);
    }
    if(!rows.some(row=>/^(?:Se|If)\s+.+,\s*(?:(?:então|then)\s+)?\S/iu.test(row.text)))return null;
    const interpretations=rows.map((row,index)=>{
      try{
        const conditional=row.text.match(/^(?:Se|If)\s+(.+?),\s*(?:(?:então|then)\s+)?(.+)$/iu);
        const formula=conditional?`${atom(conditional[1])} → ${atom(conditional[2])}`:atom(row.text);
        scope.LPLogic.parse(formula);
        return {index,text:row.text,formula};
      }catch{return {index,text:row.text,error:'unsupported'};}
    });
    return {mode:'propositional',interpretations,descriptions,translated:true};
  }
  function inspect(rows,preferred='syllogistic'){
    if(!Array.isArray(rows)||rows.length>200||rows.some(row=>typeof row.text!=='string'||row.text.length>10000))throw Error('text-limit');
    const active=rows.filter(row=>row.role!=='blank');
    const order=[...new Set([preferred,'syllogistic','propositional','first-order'])];
    const candidates=order.map(mode=>({mode,interpretations:formalReading(active,mode),descriptions:{},translated:false}));
    const complete=candidates.find(candidate=>candidate.interpretations.every(entry=>!entry.error));
    const result=complete||conditionalReading(active)||candidates.reduce((best,next)=>next.interpretations.filter(entry=>entry.error).length<best.interpretations.filter(entry=>entry.error).length?next:best);
    return {...result,rows:active.map(row=>({...row})),errors:result.interpretations.filter(entry=>entry.error)};
  }
  function analyze(text,preferred){const draft=split(text);return {...inspect(draft.rows,preferred),explicitConclusion:draft.explicit};}
  scope.LPNaturalText={split,inspect,analyze};
  if(typeof module!=='undefined')module.exports=scope.LPNaturalText;
})(globalThis);
