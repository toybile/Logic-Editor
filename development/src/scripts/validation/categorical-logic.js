(function(scope){
  function statement(form, subject, predicate) {
    subject=subject.trim().replace(/\s+/gu,' ');predicate=predicate.trim().replace(/\s+/gu,' ');
    const term=/^[_\p{L}][_\p{L}\p{M}\p{N} ′'-]*$/u;
    if(!term.test(subject)||!term.test(predicate)||subject.length>240||predicate.length>240)throw Error('categorical-term');
    return {form,subject,predicate};
  }
  function parse(text){
    if(typeof text!=='string'||text.length>10000)throw Error('categorical-limit');
    const formal=text.trim().match(/^([AEIO])\s*\(\s*([^,()]+?)\s*,\s*([^,()]+?)\s*\)$/u);
    if(formal)return statement(formal[1],formal[2],formal[3]);
    const patterns=[
      ['O',/^(?:Algum|Alguma)\s+(.+?)\s+não\s+(?:é|e)\s+(.+?)[.]?$/iu],
      ['A',/^(?:Todo|Toda)\s+(.+?)\s+(?:é|e)\s+(.+?)[.]?$/iu],
      ['E',/^(?:Nenhum|Nenhuma)\s+(.+?)\s+(?:é|e)\s+(.+?)[.]?$/iu],
      ['I',/^(?:Algum|Alguma)\s+(.+?)\s+(?:é|e)\s+(.+?)[.]?$/iu],
      ['O',/^Some\s+(.+?)\s+(?:is|are)\s+not\s+(.+?)[.]?$/iu],
      ['A',/^(?:All|Every)\s+(.+?)\s+(?:is|are)\s+(.+?)[.]?$/iu],
      ['E',/^No\s+(.+?)\s+(?:is|are)\s+(.+?)[.]?$/iu],
      ['I',/^Some\s+(.+?)\s+(?:is|are)\s+(.+?)[.]?$/iu],
    ];
    for(const [form,pattern] of patterns){const match=text.trim().match(pattern);if(match){if(/\s/u.test(match[1].trim())||/\s/u.test(match[2].trim()))throw Error('categorical-template');return statement(form,match[1],match[2]);}}
    throw Error('categorical-syntax');
  }
  function evaluate(entry,regions,terms){
    const s=terms.indexOf(entry.subject),p=terms.indexOf(entry.predicate);
    const both=regions.some(region=>(region&(1<<s))&&(region&(1<<p)));
    const outside=regions.some(region=>(region&(1<<s))&&!(region&(1<<p)));
    return entry.form==='A'?!outside:entry.form==='E'?!both:entry.form==='I'?both:outside;
  }
  function validate(rows){
    const entries=[],errors=[];
    rows.forEach((row,index)=>{if(row.role==='blank'||!row.text.trim())return;try{entries.push({index,role:row.role,...parse(row.text)});}catch{errors.push({index});}});
    if(errors.length)return {status:'errors',errors};
    if(entries.length>200)return {status:'limit'};
    const terms=[...new Set(entries.flatMap(e=>[e.subject,e.predicate]))],premises=entries.filter(e=>e.role==='premise'),conclusions=entries.filter(e=>e.role==='conclusion');
    if(!conclusions.length)return {status:'missingConclusion'};
    if(terms.length>3)return {status:'limit'};
    const failures=new Map();let satisfiable=false;
    // Every object has one membership pattern. One representative of each
    // occupied region suffices for A/E/I/O sentences; no cardinality is asserted.
    for(let occupied=1;occupied<2**(2**terms.length);occupied++){
      const regions=Array.from({length:2**terms.length},(_,i)=>i).filter(i=>occupied&(1<<i));
      if(!premises.every(e=>evaluate(e,regions,terms)))continue;
      satisfiable=true;
      for(const conclusion of conclusions){if(!failures.has(conclusion.index)&&!evaluate(conclusion,regions,terms)){
        const domain=regions.map((region,i)=>({id:'d'+(i+1),terms:terms.filter((_,j)=>region&(1<<j))}));
        failures.set(conclusion.index,domain);
      }}
    }
    return {status:failures.size?'invalid':'valid',satisfiable,terms,conclusions:conclusions.map(e=>({index:e.index,valid:!failures.has(e.index),countermodel:failures.get(e.index)||null}))};
  }
  scope.LPCategorical={parse,evaluate,validate};
  if(typeof module!=='undefined')module.exports=scope.LPCategorical;
})(globalThis);
