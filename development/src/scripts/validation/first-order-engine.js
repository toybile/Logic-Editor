/* Sound bounded first-order tableaux and independently checked finite countermodels.
   Nonempty domains, identity as equality, total functions; bounds mean unknown. */
(function(scope){
  const syntax=scope.LPFirstOrder||(typeof require==='function'?require('./first-order-syntax.js'):null);
  const propositional=scope.LPLogic||(typeof require==='function'?require('./logic-engine.js'):null);
  class ResourceLimit extends Error {}
  const termKey=t=>JSON.stringify([t.name,!!t.applied])+'('+t.args.map(termKey).join(',')+')';
  const term=(name,args=[],applied=false)=>({kind:'term',name,args,applied});
  function substituteTerm(t,name,value){return !t.applied&&t.name===name?value:{...t,args:t.args.map(a=>substituteTerm(a,name,value))};}
  function substitute(node,name,value){
    if(['all','some','none','unique'].includes(node.op)){if(node.variable===name)return node;return {...node,body:substitute(node.body,name,value)};}
    if(node.op==='predicate'||node.op==='lit')return {...node,args:node.args.map(t=>substituteTerm(t,name,value))};
    if(['equal','unequal','eq'].includes(node.op))return {...node,left:substituteTerm(node.left,name,value),right:substituteTerm(node.right,name,value)};
    if(node.op==='truth')return node;
    if(node.op==='not')return {...node,body:substitute(node.body,name,value)};
    return {...node,left:substitute(node.left,name,value),right:substitute(node.right,name,value)};
  }
  function formulaKey(n){
    if(n.op==='lit')return JSON.stringify([n.op,n.negative,n.name])+'('+n.args.map(termKey).join(',')+')';
    if(n.op==='eq')return JSON.stringify([n.op,n.negative])+'('+termKey(n.left)+','+termKey(n.right)+')';
    if(n.op==='truth')return String(n.value);
    if(n.body)return JSON.stringify([n.op,n.variable])+'('+formulaKey(n.body)+')';
    return n.op+'('+formulaKey(n.left)+','+formulaKey(n.right)+')';
  }
  function normalize(tree,negative=false,budget={nodes:0,unique:0}){
    if(++budget.nodes>18000)throw new ResourceLimit();
    const go=(n,neg=negative)=>normalize(n,neg,budget),not=body=>({op:'not',body});
    switch(tree.op){
      case'truth':return {op:'truth',value:negative?!tree.value:tree.value};
      case'predicate':return {op:'lit',name:tree.name,args:tree.args,negative};
      case'equal':case'unequal':return {op:'eq',left:tree.left,right:tree.right,negative:negative!==(tree.op==='unequal')};
      case'not':return go(tree.body,!negative);
      case'none':return go({...tree,op:'some'},!negative);
      case'all':case'some':return {op:negative?(tree.op==='all'?'some':'all'):tree.op,variable:tree.variable,body:go(tree.body)};
      case'unique':{
        const other='$unique'+budget.unique++,otherTerm=term(other),original=term(tree.variable);
        return go({op:'some',variable:tree.variable,body:{op:'and',left:tree.body,right:{op:'all',variable:other,body:{op:'implies',left:substitute(tree.body,tree.variable,otherTerm),right:{op:'equal',left:otherTerm,right:original}}}}});
      }
      case'and':case'or':return {op:negative?(tree.op==='and'?'or':'and'):tree.op,left:go(tree.left),right:go(tree.right)};
      case'implies':return go({op:'or',left:not(tree.left),right:tree.right});
      case'reverse':return go({op:'implies',left:tree.right,right:tree.left});
      case'notImplies':return go({op:'and',left:tree.left,right:not(tree.right)});
      case'nand':case'nor':return go({op:tree.op==='nand'?'and':'or',left:tree.left,right:tree.right},!negative);
      case'iff':case'xor':{
        const flip=negative!==(tree.op==='xor');
        return normalize({op:'or',left:{op:'and',left:tree.left,right:flip?not(tree.right):tree.right},right:{op:'and',left:not(tree.left),right:flip?tree.right:not(tree.right)}},false,budget);
      }
      default:throw new ResourceLimit();
    }
  }
  function branchClosure(branch){
    const terms=[...branch.terms.values()],parents=new Map(terms.map(t=>[termKey(t),termKey(t)]));
    function find(k){let p=parents.get(k);if(p===undefined){parents.set(k,k);return k;}while(p!==parents.get(p))p=parents.get(p);let at=k;while(parents.get(at)!==p){const next=parents.get(at);parents.set(at,p);at=next;}return p;}
    function union(a,b){a=find(a);b=find(b);if(a===b)return false;parents.set(a,b);return true;}
    for(const literal of branch.literals)if(literal.op==='eq'&&!literal.negative)union(termKey(literal.left),termKey(literal.right));
    let changed=true;
    while(changed){changed=false;const functions=new Map();for(const t of terms){if(!t.applied)continue;const k=JSON.stringify([t.name,t.args.map(a=>find(termKey(a)))]),old=functions.get(k);if(old)changed=union(old,termKey(t))||changed;else functions.set(k,termKey(t));}}
    const positive=new Set(),negative=new Set();
    for(const literal of branch.literals){
      if(literal.op==='eq'){if(literal.negative&&find(termKey(literal.left))===find(termKey(literal.right)))return {closed:true};}
      else{const k=JSON.stringify([literal.name,literal.args.map(t=>find(termKey(t)))]);(literal.negative?negative:positive).add(k);}
    }
    for(const k of positive)if(negative.has(k))return {closed:true};
    return {closed:false,find,terms};
  }
  function evaluate(tree,model,{maxOperations=100000}={}){
    const domain=model.domain,constants=new Map(Object.entries(model.constants||{})),free=new Map(Object.entries(model.freeVariables||{}));
    const predicates=new Map(model.predicates.map(p=>[p.name,new Set(p.tuples.map(t=>JSON.stringify(t)))]));
    const functions=new Map(model.functions.map(f=>[f.name,{fallback:f.default,values:new Map(f.values.map(v=>[JSON.stringify(v.args),v.value]))}]));
    let operations=0;
    const tick=()=>{if(++operations>maxOperations)throw new ResourceLimit();};
    function value(t,env){tick();if(!t.applied)return env.has(t.name)?env.get(t.name):constants.get(t.name)||domain[0];const args=t.args.map(a=>value(a,env)),f=functions.get(t.name);return f?.values.get(JSON.stringify(args))||f?.fallback||domain[0];}
    function go(n,env){
      tick();switch(n.op){
        case'truth':return n.value;
        case'predicate':return predicates.get(n.name)?.has(JSON.stringify(n.args.map(t=>value(t,env))))||false;
        case'equal':return value(n.left,env)===value(n.right,env);
        case'unequal':return value(n.left,env)!==value(n.right,env);
        case'not':return !go(n.body,env);
        case'all':return domain.every(d=>go(n.body,new Map(env).set(n.variable,d)));
        case'some':return domain.some(d=>go(n.body,new Map(env).set(n.variable,d)));
        case'none':return !domain.some(d=>go(n.body,new Map(env).set(n.variable,d)));
        case'unique':return domain.filter(d=>go(n.body,new Map(env).set(n.variable,d))).length===1;
        default:{const a=go(n.left,env),b=go(n.right,env);switch(n.op){case'and':return a&&b;case'or':return a||b;case'implies':return !a||b;case'reverse':return !b||a;case'notImplies':return a&&!b;case'iff':return a===b;case'xor':return a!==b;case'nand':return !(a&&b);case'nor':return !(a||b);default:throw new ResourceLimit();}}
      }
    }
    return go(tree,free);
  }
  function modelFromBranch(branch,closure,analysis){
    const representatives=[...new Set(closure.terms.map(t=>closure.find(termKey(t))))],domain=representatives.map((_,i)=>'d'+(i+1));
    if(!domain.length)return null;
    const identify=t=>domain[representatives.indexOf(closure.find(termKey(t)))];
    const constants=Object.create(null),freeVariables=Object.create(null),predicates=[],functions=[];
    for(const symbol of analysis.symbols){
      if(symbol.kind==='constant')constants[symbol.name]=identify(term(symbol.name));
      if(symbol.kind==='predicate'){
        const tuples=[];for(const lit of branch.literals)if(lit.op==='lit'&&!lit.negative&&lit.name===symbol.name)tuples.push(lit.args.map(identify));
        predicates.push({name:symbol.name,arity:symbol.arity,tuples:[...new Map(tuples.map(t=>[JSON.stringify(t),t])).values()]});
      }
      if(symbol.kind==='function'){
        const values=closure.terms.filter(t=>t.applied&&t.name===symbol.name).map(t=>({args:t.args.map(identify),value:identify(t)}));functions.push({name:symbol.name,arity:symbol.arity,default:domain[0],values});
      }
    }
    for(const name of new Set(analysis.entries.flatMap(e=>e.freeVariables)))freeVariables[name]=identify(term('$free:'+name));
    return {domain,constants,freeVariables,predicates,functions};
  }
  function verified(model,entries){try{return entries.every(({tree,negative})=>evaluate(tree,model)!==Boolean(negative));}catch(_){return false;}}
  async function tableau(entries,analysis,options){
    const {cancelled,yieldTask,maxMs=1600,maxSteps=2200,maxTerms=56}=options,started=Date.now();let steps=0,witness=0,closed=0,branches=1;
    const counts={and:0,or:0,all:0,some:0,equality:0};
    function addTerm(branch,t){for(const a of t.args)addTerm(branch,a);branch.terms.set(termKey(t),t);if(branch.terms.size>maxTerms)throw new ResourceLimit();}
    function fork(branch){return {...branch,pending:branch.pending.slice(),choices:branch.choices.slice(),literals:branch.literals.slice(),universals:branch.universals.map(q=>({...q,done:new Set(q.done)})),terms:new Map(branch.terms),seen:new Set(branch.seen)};}
    const initial={pending:[],choices:[],literals:[],universals:[],terms:new Map(),seen:new Set(),cursor:0};
    try{
      for(const item of entries){let tree=item.tree;for(const name of item.freeVariables||[])tree=substitute(tree,name,term('$free:'+name));initial.pending.push(normalize(tree,item.negative));}
      for(const s of analysis.symbols)if(s.kind==='constant')addTerm(initial,term(s.name));
      for(const name of new Set(analysis.entries.flatMap(e=>e.freeVariables)))addTerm(initial,term('$free:'+name));
      if(!initial.terms.size)addTerm(initial,term('$w'+witness++));
      const stack=[initial];
      while(stack.length){
        const branch=stack.pop();let ended=false;
        while(!ended){
          if(cancelled())return {status:'cancelled'};
          if(steps>maxSteps||Date.now()-started>maxMs||branches>180)throw new ResourceLimit();
          while(branch.pending.length){
            if(++steps>maxSteps||Date.now()-started>maxMs)throw new ResourceLimit();
            if(steps%24===0){await yieldTask();if(cancelled())return {status:'cancelled'};}
            const n=branch.pending.pop(),key=formulaKey(n);if(branch.seen.has(key))continue;branch.seen.add(key);
            if(n.op==='truth'){if(!n.value){ended=true;closed++;break;}}
            else if(n.op==='and'){counts.and++;branch.pending.push(n.left,n.right);}
            else if(n.op==='or'){branch.choices.push(n);}
            else if(n.op==='all'){branch.universals.push({node:n,done:new Set()});}
            else if(n.op==='some'){counts.some++;const fresh=term('$w'+witness++);addTerm(branch,fresh);branch.pending.push(substitute(n.body,n.variable,fresh));}
            else{branch.literals.push(n);if(n.op==='eq'){counts.equality++;addTerm(branch,n.left);addTerm(branch,n.right);}else n.args.forEach(t=>addTerm(branch,t));}
          }
          if(ended)break;
          const closure=branchClosure(branch);if(closure.closed){closed++;break;}
          // A countermodel is returned only after evaluating the original formulas over its full finite domain.
          if(branch.terms.size<=12){const model=modelFromBranch(branch,closure,analysis);if(model&&verified(model,entries))return {status:'sat',model,steps,closed,counts};}
          if(branch.choices.length){counts.or++;const choice=branch.choices.pop(),right=fork(branch);right.pending.push(choice.right);branch.pending.push(choice.left);stack.push(right,branch);branches++;break;}
          let instantiated=false;
          for(let offset=0;offset<branch.universals.length&&!instantiated;offset++){
            const at=(branch.cursor+offset)%branch.universals.length,q=branch.universals[at];
            for(const[key,t]of branch.terms){if(q.done.has(key))continue;q.done.add(key);branch.pending.push(substitute(q.node.body,q.node.variable,t));branch.cursor=(at+1)%branch.universals.length;counts.all++;instantiated=true;break;}
          }
          if(!instantiated){const model=modelFromBranch(branch,closure,analysis);if(model&&verified(model,entries))return {status:'sat',model,steps,closed,counts};throw new ResourceLimit();}
        }
      }
      return {status:'unsat',steps,closed,counts};
    }catch(error){if(!(error instanceof ResourceLimit))throw error;return {status:'unknown',steps,closed,counts};}
  }
  // Small finite-domain SAT search complements tableaux; exhausting it is not a proof.
  async function finiteModel(entries,analysis,{cancelled,yieldTask,maxMs=600}={}){
    if(analysis.symbols.some(s=>s.kind==='function'))return {status:'unknown'};
    const began=Date.now(),names=analysis.symbols.filter(s=>s.kind==='constant').map(s=>s.name),free=[...new Set(analysis.entries.flatMap(e=>e.freeVariables))],bindings=[...names,...free.map(n=>'$free:'+n)];let attempts=0;
    for(let size=1;size<=3;size++){
      if(size**bindings.length>180)continue;
      for(let mask=0;mask<size**bindings.length;mask++){
        if(cancelled())return {status:'cancelled'};if(Date.now()-began>maxMs||++attempts>200)return {status:'unknown'};
        let cursor=mask;const constants=new Map();for(const name of bindings){constants.set(name,cursor%size);cursor=Math.floor(cursor/size);}
        const atoms=new Map();let nodes=0;
        const value=(t,env)=>env.has(t.name)?env.get(t.name):constants.get(t.name);
        function expand(n,env){
          if(++nodes>6000)throw new ResourceLimit();
          if(n.op==='predicate'){const tuple=n.args.map(t=>value(t,env)),key=JSON.stringify([n.name,tuple]);atoms.set(key,{name:n.name,tuple});return {op:'atom',value:key};}
          if(n.op==='truth')return {op:'constant',value:n.value};
          if(n.op==='equal'||n.op==='unequal')return {op:'constant',value:(value(n.left,env)===value(n.right,env))===(n.op==='equal')};
          if(n.op==='not')return {op:'not',left:expand(n.body,env)};
          if(['all','some','none','unique'].includes(n.op)){
            const instances=Array.from({length:size},(_,i)=>expand(n.body,new Map(env).set(n.variable,i)));
            const fold=(op,list,identity)=>list.reduce((a,b)=>({op,left:a,right:b}),{op:'constant',value:identity});
            if(n.op==='all')return fold('and',instances,true);
            if(n.op==='some'||n.op==='none'){const some=fold('or',instances,false);return n.op==='none'?{op:'not',left:some}:some;}
            return fold('or',instances.map((v,i)=>fold('and',instances.map((other,j)=>i===j?other:{op:'not',left:other}),true)),false);
          }
          return {op:n.op,left:expand(n.left,env),right:expand(n.right,env)};
        }
        try{
          const env=new Map(free.map(n=>[n,constants.get('$free:'+n)])),trees=entries.map(e=>{const tree=expand(e.tree,env);return e.negative?{op:'not',left:tree}:tree;});
          if(atoms.size>90)continue;
          const result=await propositional.solveSAT(trees,{cancelled,yieldTask,maxMs:Math.max(10,maxMs-(Date.now()-began)),maxOperations:400000});
          if(result.status==='cancelled')return result;
          if(result.status!=='sat')continue;
          const domain=Array.from({length:size},(_,i)=>'d'+(i+1)),model={domain,constants:Object.fromEntries(names.map(n=>[n,domain[constants.get(n)]])),freeVariables:Object.fromEntries(free.map(n=>[n,domain[constants.get('$free:'+n)]])),predicates:analysis.symbols.filter(s=>s.kind==='predicate').map(s=>({name:s.name,arity:s.arity,tuples:[...atoms].filter(([k,a])=>a.name===s.name&&result.model[k]).map(([,a])=>a.tuple.map(i=>domain[i]))})),functions:[]};
          if(verified(model,entries))return {status:'sat',model};
        }catch(error){if(!(error instanceof ResourceLimit))throw error;}
        await yieldTask();
      }
    }
    return {status:'unknown'};
  }
  async function validate(rows,{cancelled=()=>false,yieldTask=()=>Promise.resolve(),maxMs=1800,maxSteps=2200,maxTerms=56}={}){
    const analysis=syntax.analyze(rows);if(analysis.status==='errors'||analysis.status==='empty')return analysis;
    if(analysis.entries.length>200||analysis.symbols.length>128)return {...analysis,status:'limit'};
    const premises=analysis.entries.filter(e=>e.role==='premise'),conclusions=analysis.entries.filter(e=>e.role==='conclusion');
    if(!conclusions.length)return {...analysis,status:'missingConclusion'};
    const results=[],options={cancelled,yieldTask,maxMs,maxSteps,maxTerms},deadline=Date.now()+Math.max(250,Math.min(6000,maxMs*2));let satisfiable=null;
    for(const conclusion of conclusions){
      const entries=[...premises.map(e=>({...e,negative:false})),{...conclusion,negative:true}];
      if(Date.now()>=deadline){results.push({index:conclusion.index,status:'unknown',valid:null,countermodel:null,proof:null});continue;}
      let result=await tableau(entries,analysis,{...options,maxMs:Math.min(maxMs,deadline-Date.now())});if(result.status==='cancelled')return {status:'cancelled'};
      if(result.status==='unknown'){const model=await finiteModel(entries,analysis,{cancelled,yieldTask,maxMs:Math.max(1,Math.min(600,maxMs,deadline-Date.now()))});if(model.status==='cancelled')return {status:'cancelled'};if(model.status==='sat')result={...result,...model};}
      if(result.status==='sat')satisfiable=true;
      results.push({index:conclusion.index,status:result.status==='unsat'?'valid':result.status==='sat'?'invalid':'unknown',valid:result.status==='unsat'?true:result.status==='sat'?false:null,countermodel:result.model||null,proof:result.status==='unsat'?{method:'tableau',steps:result.steps,closedBranches:result.closed,rules:result.counts}:null});
      if(cancelled())return {status:'cancelled'};
    }
    if(satisfiable===null&&Date.now()<deadline){const check=await tableau(premises.map(e=>({...e,negative:false})),analysis,{...options,maxMs:Math.min(300,maxMs),maxSteps:Math.min(250,maxSteps)});if(check.status==='cancelled')return {status:'cancelled'};satisfiable=check.status==='unsat'?false:check.status==='sat'?true:null;}
    return {...analysis,status:results.some(r=>r.status==='invalid')?'invalid':results.some(r=>r.status==='unknown')?'unknown':'valid',satisfiable,premiseCount:premises.length,conclusions:results,method:'bounded-tableau',limits:{maxMs,maxSteps,maxTerms}};
  }
  Object.assign(syntax,{validate,evaluate,normalize});scope.LPFirstOrder=syntax;
  if(typeof module!=='undefined')module.exports=syntax;
})(globalThis);
