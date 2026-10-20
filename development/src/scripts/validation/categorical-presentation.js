// A pedagogical first-order rendering of the categorical fragment; no validity calculation.
(function(scope){
  function explain(entries,language='pt'){
    const t=(pt,en)=>language==='en'?en:pt,names=new Set(entries.filter(e=>e.singular).map(e=>e.subject));
    const vocabulary=[],symbols=new Map(),used=new Set(['x']),operators=new Set();
    const upper=value=>value[0].toLocaleUpperCase()+value.slice(1);
    function symbol(term,individual=false){
      const key=(individual?'individual:':'predicate:')+term;
      if(symbols.has(key))return symbols.get(key);
      let base=term.normalize('NFC').replace(/[^\p{L}\p{M}\p{N}_′']/gu,'_');
      base=individual?base.toLocaleLowerCase():upper(base);
      if(individual? !/^\p{Ll}/u.test(base)||/^[uvwxyz][\d_′']*$/u.test(base):!/^\p{Lu}/u.test(base))base=(individual?'c_':'P_')+base;
      let value=base,index=2;while(used.has(value))value=base+'_'+index++;used.add(value);symbols.set(key,value);
      let label=upper(term);
      if(individual){const original=entries.find(e=>e.singular&&e.subject===term)?.text;const match=original?.match(/^(.+?)\s+(?:não\s+é|é|is)\s/iu);if(match)label=match[1];}
      vocabulary.push({symbol:individual?value:value+'(x)',meaning:individual?t(label+' — indivíduo nomeado',label+' — named individual'):t('x pertence à classe “'+term+'”','x belongs to the class “'+term+'”'),kind:individual?'individual':'predicate'});
      return value;
    }
    const member=(term,variable)=>{if(names.has(term)){operators.add('=');return variable+' = '+symbol(term,true);}return symbol(term)+'('+variable+')';};
    const output=entries.map(entry=>{
      const negative=entry.form==='E'||entry.form==='O';if(negative)operators.add('¬');
      let formula,reading;
      if(entry.singular){
        const constant=symbol(entry.subject,true),predicate=member(entry.predicate,constant);
        formula=(negative?'¬':'')+(negative&&names.has(entry.predicate)?'('+predicate+')':predicate);
        reading=t('Afirma '+(negative?'que o indivíduo não pertence':'o pertencimento do indivíduo')+' à classe indicada.','Asserts that the individual '+(negative?'does not belong':'belongs')+' to the indicated class.');
      }else{
        const subject=member(entry.subject,'x'),predicate=member(entry.predicate,'x');
        const negated=negative?'¬'+(names.has(entry.predicate)?'('+predicate+')':predicate):predicate;
        const universal=entry.form==='A'||entry.form==='E';
        operators.add(universal?'∀x':'∃x');operators.add(universal?'→':'∧');
        formula=(universal?'∀x':'∃x')+'('+subject+(universal?' → ':' ∧ ')+negated+')';
        reading=universal?t('Para todo indivíduo x, se x pertence a “'+entry.subject+'”, então '+(negative?'não pertence':'pertence')+' a “'+entry.predicate+'”.','For every individual x, if x belongs to “'+entry.subject+'”, then x '+(negative?'does not belong':'belongs')+' to “'+entry.predicate+'”.'):t('Existe pelo menos um indivíduo x que pertence a “'+entry.subject+'” e '+(negative?'não pertence':'pertence')+' a “'+entry.predicate+'”.','There is at least one individual x that belongs to “'+entry.subject+'” and '+(negative?'does not belong':'belongs')+' to “'+entry.predicate+'”.');
      }
      return {...entry,formula,reading,technical:entry.form+'('+entry.subject+', '+entry.predicate+')'};
    });
    const meanings={
      '∀x':['para todo indivíduo x','for every individual x'],
      '∃x':['existe pelo menos um indivíduo x','there is at least one individual x'],
      '→':['se … então …','if … then …'],
      '∧':['e','and'],
      '¬':['não','not'],
      '=':['é o mesmo indivíduo que','is the same individual as'],
    };
    return {entries:output,vocabulary,operators:[...operators].map(symbol=>({symbol,meaning:t(...meanings[symbol])}))};
  }
  scope.LPCategoricalPresentation={explain};
  if(typeof module!=='undefined')module.exports=scope.LPCategoricalPresentation;
})(globalThis);

function appendCategoricalVocabulary(host,presentation){
  const title=document.createElement('h4'),list=document.createElement('dl');
  title.textContent=interfaceText('Como ler os símbolos','How to read the symbols');list.className='hy-didactic-vocabulary';
  for(const entry of [...presentation.vocabulary,...presentation.operators]){
    const symbol=document.createElement('dt'),meaning=document.createElement('dd');symbol.textContent=entry.symbol;meaning.textContent=entry.meaning;list.append(symbol,meaning);
  }
  host.append(title,list);
}
