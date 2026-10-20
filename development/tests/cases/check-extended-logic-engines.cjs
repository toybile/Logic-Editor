const assert=require('node:assert/strict');
const fol=require('../../src/scripts/validation/first-order-syntax.js');
const cat=require('../../src/scripts/validation/categorical-logic.js');
const rows=(premises,conclusion)=>[...premises.map(text=>({text,role:'premise'})),{text:conclusion,role:'conclusion'}];
const expected=[new Set(['AAA','EAE','AII','EIO']),new Set(['EAE','AEE','EIO','AOO']),new Set(['IAI','AII','OAO','EIO']),new Set(['AEE','IAI','EIO'])];
let checks=0,valid=0;
const figures=[[['M','P'],['S','M']],[['P','M'],['S','M']],[['M','P'],['M','S']],[['P','M'],['M','S']]];
function oracle(form,s,p,domain){const belongs=(x,t)=>x.terms.includes(t);switch(form){case'A':return domain.every(x=>!belongs(x,s)||belongs(x,p));case'E':return domain.every(x=>!belongs(x,s)||!belongs(x,p));case'I':return domain.some(x=>belongs(x,s)&&belongs(x,p));case'O':return domain.some(x=>belongs(x,s)&&!belongs(x,p));}}
for(let f=0;f<4;f++)for(const a of 'AEIO')for(const b of 'AEIO')for(const c of 'AEIO'){
 const [major,minor]=figures[f],input=rows([`${a}(${major})`,`${b}(${minor})`],`${c}(S,P)`),result=cat.validate(input);
 assert.equal(result.status==='valid',expected[f].has(a+b+c),`${a+b+c}-${f+1}`);
 if(result.status==='valid')valid++;
 else{const domain=result.conclusions[0].countermodel;assert(domain.length>0);assert(oracle(a,...major,domain));assert(oracle(b,...minor,domain));assert(!oracle(c,'S','P',domain));}
 checks++;
}
assert.equal(valid,15);
assert.equal(cat.validate(rows(['A(S,P)'],'I(S,P)')).status,'invalid','universal statements do not assert existence');
assert.equal(cat.validate(rows(['A(S,P)','I(S,S)'],'I(S,P)')).status,'valid','existence is explicit');
assert.equal(cat.validate(rows(['I(S,S)','E(S,S)'],'A(S,P)')).satisfiable,false);
assert.equal(cat.validate(rows(['A(S,P)'],'I(P,S)')).status,'invalid');
assert.equal(cat.validate(rows(['∀x P(x)'],'I(P,S)')).status,'errors');
assert.equal(cat.validate(rows(['A(S,M)','A(M,P)'],'A(S,Q)')).status,'limit');
assert.deepEqual(cat.parse('Algum estudante não é leitor.'),{form:'O',subject:'estudante',predicate:'leitor'});
assert.deepEqual(cat.parse('Some S are not P'),{form:'O',subject:'S',predicate:'P'});
const good=['∀x(P(x) → Q(x))','∀xP(x)','∀x ∃y R(x,y)','∃x(∀x F(x) → G(x))','∀x(x = x)','a ≠ b','P(f(a),g(b,c))','P → Q','¬(⊤ ∧ ⊥)','∀person Loves(person,a)'];
for(const text of good){assert(fol.parse(text).tree,text);checks++;}
assert.deepEqual(fol.parse('∀x(P(x) ∧ Q(y))').freeVariables,['y']);
assert.deepEqual(fol.parse('∀xP(x) ∧ Q(x)').freeVariables,['x']);
assert.deepEqual(fol.parse('∃x(∀x F(x) → G(x))').freeVariables,[]);
assert.deepEqual(fol.parse('P(f(a),b)').symbols.map(s=>[s.name,s.kind,s.arity]),[['P','predicate',2],['f','function',1],['a','constant',0],['b','constant',0]]);
for(const text of ['','∀P P(a)','P(a','P(a,,b)','P(a) Q(a)','a','P(P(a))','∀x(P(x) ∧)','P(x) ∧ P(x,y)','P(a) | Q(a)','∃!x P(x)','□P(a)']){assert.throws(()=>fol.parse(text),undefined,text);checks++;}
assert.equal(fol.analyze(rows(['P(a)'],'P(a,b)')).errors[0].code,'signature');
assert.equal(fol.analyze(rows(['P(f(a))'],'Q(f)')).errors[0].code,'signature');
assert.equal(fol.analyze([{text:'garbage',role:'blank'},{text:'P(a)',role:'premise'}]).status,'syntax-checked');
assert.equal(fol.analyze(rows(['∀xP(x)'],'P(a)')).status,'syntax-checked','syntax checker must not claim validity');
console.log(`${checks} engine cases; all 256 categorical moods/figures match the 15 modern valid forms; every countermodel checked by an independent evaluator; FOL syntax, scope, signatures and free variables checked.`);

for(const ambiguous of ['All S are not P','Todo S não é P','A( ,P)','I(S,)'])assert.throws(()=>cat.parse(ambiguous));
