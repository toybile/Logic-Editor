const assert=require('node:assert/strict'),path=require('node:path');
const source=path.resolve(__dirname,'../../src/scripts/validation');
globalThis.LPLogic=require(source+'/logic-engine.js');globalThis.LPFirstOrder=require(source+'/first-order-syntax.js');globalThis.LPCategorical=require(source+'/categorical-logic.js');const text=require(source+'/natural-text-interpretation.js');
const rows=(premises,conclusion)=>[...premises.map(text=>({text,role:'premise'})),{text:conclusion,role:'conclusion'}];
for(const [premises,conclusion,status] of [
 [['Todo homem é mortal','Aristóteles é homem'],'Aristóteles é mortal','valid'],
 [['Todo ser humano é mortal','Aristóteles é um ser humano'],'Aristóteles é mortal','valid'],
 [['Todo homem é mortal','Aristóteles é mortal'],'Aristóteles é homem','invalid'],
 [['Nenhum homem é imortal','Aristóteles é homem'],'Aristóteles não é imortal','valid'],
 [['Aristóteles é homem'],'Algum homem é homem','valid'],
 [['Todo homem é mortal'],'Algum homem é mortal','invalid'],
 [['Aristóteles é homem','Aristóteles não é homem'],'Aristóteles é homem','valid'],
 [['Every human is mortal','Aristotle is a human'],'Aristotle is mortal','valid'],
 [['No human is immortal','Aristotle is human'],'Aristotle is not immortal','valid'],
 [['Todo homem é mortal','ARISTÓTELES é Homem'],'Aristóteles é Mortal','valid'],
]){
 const input=rows(premises,conclusion),result=LPCategorical.validate(input);assert.equal(result.status,status,JSON.stringify(input));
 for(const conclusion of result.conclusions||[])if(conclusion.countermodel){const regions=conclusion.countermodel.map(object=>result.terms.reduce((bits,term,index)=>bits|(object.terms.includes(term)?1<<index:0),0));for(const entry of result.entries.filter(entry=>entry.role==='premise'))assert(LPCategorical.evaluate(entry,regions,result.terms));assert(!LPCategorical.evaluate(result.entries.find(entry=>entry.index===conclusion.index),regions,result.terms));for(const name of result.names)assert.equal(conclusion.countermodel.filter(object=>object.terms.includes(name)).length,1);}
}
// Two different names may refer to the same object; no unique-names assumption is introduced.
assert.equal(LPCategorical.validate(rows(['Ana é pessoa','Bia é pessoa'],'Nenhum Ana é Bia')).status,'invalid');
for(const sentence of ['Ele é homem','Aristóteles é homem e mortal','Todo homem que corre é mortal','Todo homem é mortal ou imortal','Todo homem é mortal porque respira','All S are not P','Todo S não é P'])assert.throws(()=>LPCategorical.parse(sentence),undefined,sentence);
let result=text.analyze('Todo homem é mortal. Aristóteles é homem. Logo, Aristóteles é mortal.','propositional');assert.equal(result.mode,'syllogistic');assert.equal(result.errors.length,0);assert.equal(result.explicitConclusion,true);assert.deepEqual(result.rows.map(row=>row.role),['premise','premise','conclusion']);assert.equal(LPCategorical.validate(result.rows).status,'valid');
result=text.analyze('Todo homem é mortal; Aristóteles é homem, portanto Aristóteles é mortal.');assert.equal(result.errors.length,0);assert.equal(result.rows.length,3);
result=text.analyze('Aristóteles é mortal. Todo homem é mortal. Aristóteles é homem.');assert.equal(result.explicitConclusion,false);assert.equal(result.rows.at(-1).role,'conclusion');
result=text.analyze('Logo, Aristóteles é mortal, pois todo homem é mortal; Aristóteles é homem.');assert.deepEqual(result.rows.map(row=>row.role),['conclusion','premise','premise']);assert.equal(LPCategorical.validate(result.rows).status,'valid');
result=text.analyze('Se chove, então a rua fica molhada. Chove. Logo, a rua fica molhada.');assert.equal(result.mode,'propositional');assert.equal(result.translated,true);assert.deepEqual(result.interpretations.map(entry=>entry.formula),['P1 → P2','P1','P2']);assert.equal(result.descriptions.P2,'a rua fica molhada');
result=text.analyze('If it rains, then the street is wet. It rains. Therefore, the street is wet.');assert(result.errors.length>0,'unresolved it is not silently formalized');
result=text.analyze('Se chove, então venta. Não venta. Logo, não chove.');assert.deepEqual(result.interpretations.map(entry=>entry.formula),['P1 → P2','¬P2','¬P1']);
result=text.analyze('Todo homem é mortal. Ele é homem. Logo, ele é mortal.');assert.equal(result.errors.length,2);assert.equal(result.rows.length,3,'unrecognized sentences are retained');
result=text.analyze('∀x P(x). Portanto, P(a).');assert.equal(result.mode,'first-order');assert.equal(result.errors.length,0);
result=text.analyze('A → B. A. ∴ B.');assert.equal(result.mode,'propositional');assert.equal(result.errors.length,0);
assert.throws(()=>text.analyze(''));assert.throws(()=>text.analyze('a'.repeat(20001)));assert.throws(()=>text.analyze('A.'.repeat(201)));assert.throws(()=>text.inspect([{text:'a'.repeat(10001),role:'premise'}]));
const input=rows(['Todo homem é mortal'],'Aristóteles é mortal'),snapshot=JSON.stringify(input);text.inspect(input);assert.equal(JSON.stringify(input),snapshot);
console.log('Natural categorical sentences, singular existence, countermodels, name co-reference, ambiguity rejection, paragraph boundaries, proposed roles, controlled conditionals, three formal modes, limits and immutability passed.');
