const assert=require('node:assert/strict'),logic=require('../../src/scripts/validation/logic-engine.js'),fol=require('../../src/scripts/validation/first-order-engine.js'),cat=require('../../src/scripts/validation/categorical-logic.js'),guide=require('../../src/scripts/help/argument-guide-data.js');
const row=(text,role='premise')=>({text,role});
(async()=>{
 let checked=0;for(const e of guide.entries){const rows=[...e.premises.map(t=>row(t)),row(e.conclusion,'conclusion')],result=e.mode==='first-order'?await fol.validate(rows):e.mode==='syllogistic'?cat.validate(rows):await logic.validate(rows);assert.equal(result.status,'valid',e.id);checked++;}
 for(const[p,c]of[[['P(a)'],'∀x P(x)'],[['∃x P(x)'],'P(a)'],[['P(x)'],'∀x P(x)'],[['∀x∃y R(x,y)'],'∃y∀x R(x,y)'],[['∃x P(x)'],'∃!x P(x)'],[[],'a≠b']]){const rows=[...p.map(t=>row(t)),row(c,'conclusion')],result=await fol.validate(rows);assert.equal(result.status,'invalid',c);const model=result.conclusions[0].countermodel;assert(p.every(t=>fol.evaluate(fol.parse(t).tree,model)));assert(!fol.evaluate(fol.parse(c).tree,model));}
 const infinite=await fol.validate([row('∀x∃y R(x,y)'),row('∀x ¬R(x,x)'),row('∀x∀y∀z((R(x,y) ∧ R(y,z)) → R(x,z))'),row('⊥','conclusion')],{maxMs:100,maxSteps:180,maxTerms:10});assert.equal(infinite.status,'unknown','No finite model does not entail validity');
 const deep='f('.repeat(45)+'a'+')'.repeat(45);assert.equal((await fol.validate([row(deep+'='+deep,'conclusion')])).status,'valid','deep term keys remain bounded');
 assert.equal((await fol.validate([row('P(a)','conclusion')],{cancelled:()=>true})).status,'cancelled');
 assert.equal((await logic.validate([row(Array.from({length:96},(_,i)=>'P'+i).join(' ∧ ')),row('P95','conclusion')])).status,'valid');
 assert.equal((await logic.validate([row(Array.from({length:129},(_,i)=>'P'+i).join(' ∧ ')),row('P0','conclusion')])).status,'limit');
 let seed=42;const next=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;},ops=['∧','∨','→','↔','⊕','↑','↓','←','↛'];
 function formula(depth){if(!depth||next(3)===0)return['A','B','C'][next(3)];if(next(5)===0)return'¬('+formula(depth-1)+')';return'('+formula(depth-1)+' '+ops[next(ops.length)]+' '+formula(depth-1)+')';}
 for(let i=0;i<150;i++){const rows=[row(formula(3)),row(formula(3),'conclusion')],truth=await logic.validate(rows),sat=await logic.validate(rows,{forceSAT:true});assert.equal(sat.status,truth.status);assert.equal(sat.satisfiable,truth.satisfiable);if(sat.status==='invalid'){const model=sat.conclusions[0].counterexample;assert(logic.evaluate(logic.parse(rows[0].text).tree,model));assert(!logic.evaluate(logic.parse(rows[1].text).tree,model));}}
 console.log(checked+' guide forms, FOL side-condition counterexamples, infinite-only model guard, deep terms, cancellation, 96/129 atom bounds and 150 SAT/truth-table comparisons passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
