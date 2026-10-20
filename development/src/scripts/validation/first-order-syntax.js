(function(scope){
  class SyntaxIssue extends Error {
    constructor(code,column,token=''){super(code);Object.assign(this,{code,column,token});}
  }
  const binary={'↔':[1,'iff'],'⇔':[1,'iff'],'<->':[1,'iff'],'→':[2,'implies'],'⇒':[2,'implies'],'->':[2,'implies'],'∨':[3,'or'],'∧':[4,'and'],'&':[4,'and']};
  const variable = name => /^[uvwxyz][\d_′']*$/u.test(name);
  const upper = name => /^\p{Lu}/u.test(name);
  function parse(text){
    if(typeof text!=='string'||text.length>10000)throw new SyntaxIssue('limit',1);
    const tokens=[];
    let offset=0;
    while(offset<text.length){
      if(/\s/u.test(text[offset])){offset++;continue;}
      const rest=text.slice(offset),value=rest.match(/^(?:<->|->|[\p{L}_][\p{L}\p{M}\p{N}_′']*|.)/u)?.[0];
      if(!value)throw new SyntaxIssue('symbol',offset+1);
      if(tokens.at(-1)&&['∀','∃','∄'].includes(tokens.at(-1).value)){
        const compact=value.match(/^([uvwxyz][\d_′']*)(\p{Lu}[\p{L}\p{M}\p{N}_′']*)$/u);
        if(compact){tokens.push({value:compact[1],column:offset+1},{value:compact[2],column:offset+1+compact[1].length});offset+=value.length;continue;}
      }
      tokens.push({value,column:offset+1});offset+=value.length;
      if(tokens.length>1024)throw new SyntaxIssue('limit',offset);
    }
    let index=0,depth=0;
    const peek=()=>tokens[index]?.value;
    const fail=(code,token=tokens[index])=>{throw new SyntaxIssue(code,token?.column||text.length+1,token?.value||'');};
    const take=expected=>{if(peek()!==expected)fail('delimiter');return tokens[index++];};
    const identifier=()=>{const token=tokens[index];if(!token||!/^[_\p{L}][\p{L}\p{M}\p{N}_′']*$/u.test(token.value))fail('name');index++;return token;};
    function term(){
      if(++depth>96)fail('limit');
      const name=identifier(),args=[];
      const applied=peek()==='(';
      if(applied){index++;if(peek()!==')'){args.push(term());while(peek()===','){index++;args.push(term());}}take(')');}
      depth--;return {kind:'term',name:name.value,args,applied,column:name.column};
    }
    function unary(){
      if(++depth>96)fail('limit');
      let node;
      if(['¬','~','∼','!'].includes(peek())){index++;node={op:'not',body:unary()};}
      else if(['∀','∃','∄'].includes(peek())){
        const q=tokens[index++],name=identifier();
        if(upper(name.value))throw new SyntaxIssue('variable',name.column,name.value);
        node={op:q.value==='∀'?'all':q.value==='∃'?'some':'none',variable:name.value,body:unary()};
      }else if(peek()==='('){index++;node=expression(0);take(')');}
      else if(['⊤','⊥'].includes(peek())){node={op:'truth',value:peek()==='⊤'};index++;}
      else{
        const left=term();
        if(['=','≠'].includes(peek())){const operator=tokens[index++].value;node={op:operator==='='?'equal':'unequal',left,right:term()};}
        else{if(!upper(left.name))throw new SyntaxIssue('predicate',left.column,left.name);node={op:'predicate',name:left.name,args:left.args,column:left.column};}
      }
      depth--;return node;
    }
    function expression(min){
      let left=unary();
      while(binary[peek()]&&binary[peek()][0]>=min){const [level,op]=binary[tokens[index++].value];left={op,left,right:expression(op==='implies'?level:level+1)};}
      return left;
    }
    const tree=expression(0);if(index!==tokens.length)fail('operator');
    const symbols=new Map(),freeVariables=new Set();
    function register(name,kind,arity,column){
      const old=symbols.get(name);
      if(old&&(old.kind!==kind||old.arity!==arity))throw new SyntaxIssue('signature',column,name);
      symbols.set(name,{name,kind,arity,column});
    }
    function visitTerm(node,bound){
      if(upper(node.name))throw new SyntaxIssue('term',node.column,node.name);
      if(node.applied){if(bound.has(node.name)||variable(node.name))throw new SyntaxIssue('term',node.column,node.name);register(node.name,'function',node.args.length,node.column);node.args.forEach(t=>visitTerm(t,bound));}
      else if(bound.has(node.name)||variable(node.name)){if(!bound.has(node.name))freeVariables.add(node.name);}
      else register(node.name,'constant',0,node.column);
    }
    function visit(node,bound=new Set()){
      if(node.op==='predicate'){register(node.name,'predicate',node.args.length,node.column);node.args.forEach(t=>visitTerm(t,bound));}
      else if(['all','some','none'].includes(node.op)){const next=new Set(bound);next.add(node.variable);visit(node.body,next);}
      else if(node.op==='not')visit(node.body,bound);
      else if(['equal','unequal'].includes(node.op)){visitTerm(node.left,bound);visitTerm(node.right,bound);}
      else if(node.op!=='truth'){visit(node.left,bound);visit(node.right,bound);}
    }
    visit(tree);return {tree,symbols:[...symbols.values()],freeVariables:[...freeVariables]};
  }
  function analyze(rows){
    const entries=[],errors=[],symbols=new Map();
    rows.forEach((row,index)=>{
      if(row.role==='blank'||!row.text.trim())return;
      try{
        const result=parse(row.text);
        for(const symbol of result.symbols){const old=symbols.get(symbol.name);if(old&&(old.kind!==symbol.kind||old.arity!==symbol.arity))throw new SyntaxIssue('signature',symbol.column,symbol.name);}
        result.symbols.forEach(s=>symbols.set(s.name,s));entries.push({index,role:row.role,...result});
      }catch(error){errors.push({index,code:error.code||'limit',column:error.column||1,token:error.token||''});}
    });
    return {status:errors.length?'errors':entries.length?'syntax-checked':'empty',entries,errors,symbols:[...symbols.values()]};
  }
  scope.LPFirstOrder={parse,analyze};
  if(typeof module!=='undefined')module.exports=scope.LPFirstOrder;
})(globalThis);
