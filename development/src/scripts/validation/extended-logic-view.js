function updateExtendedLogicValidation(mode) {
  const t=interfaceText,section=document.createElement('div');section.className='hy-extended-logic';
  const add=(tag,value,cls)=>{const node=document.createElement(tag);node.textContent=value;if(cls)node.className=cls;section.append(node);return node;};
  const finish=status=>{logicPanel.dataset.state=status;logicPanel.replaceChildren(section);};
  if(mode==='first-order'){
    if(rows.length>200){add('p',t('Análise limitada a 200 linhas.','Analysis is limited to 200 rows.'));finish('limit');return;}
    const result=LPFirstOrder.analyze(rows);
    const messages={
      name:t('Esperado um nome de símbolo ou variável.','Expected a symbol or variable name.'),
      variable:t('Quantificadores de primeira ordem ligam variáveis individuais em minúsculas.','First-order quantifiers bind lowercase individual variables.'),
      predicate:t('Use predicados com inicial maiúscula, como P(a) ou Ama(a,b).','Use uppercase-initial predicates, such as P(a) or Loves(a,b).'),
      term:t('Os argumentos devem ser termos: variáveis, constantes ou funções com inicial minúscula.','Arguments must be terms: variables, constants or lowercase-initial functions.'),
      signature:t('O mesmo símbolo foi usado com tipos ou números de argumentos diferentes.','The same symbol was used with different kinds or argument counts.'),
      delimiter:t('Confira os parênteses e as vírgulas dos argumentos.','Check parentheses and argument commas.'),
      operator:t('Confira o conectivo ou símbolo: esta escrita não pertence à sintaxe de LPO suportada.','Check the connective or symbol: this expression is outside the supported FOL syntax.'),
      limit:t('A fórmula excede o limite desta análise.','The formula exceeds the analysis limit.'),
    };
    if(result.status==='errors'){
      add('h3',t('Problemas de sintaxe ou vocabulário','Syntax or vocabulary issues'));
      for(const error of result.errors)add('p',t('Linha ','Line ')+(error.index+1)+' · '+t('coluna ','column ')+error.column+': '+(messages[error.code]||messages.operator)+(error.token?' ['+error.token+']':''),'hy-logic-result');
      add('p',t('Esses problemas não são um veredito de invalidade lógica.','These issues are not a verdict of logical invalidity.'));
    }else if(result.status==='empty')add('p',t('Escreva uma fórmula para analisar.','Enter a formula to analyze.'));
    else{
      add('h3',t('Sintaxe de LPO verificada','First-order syntax checked'));
      for(const entry of result.entries){if(entry.freeVariables.length)add('p',t('Linha ','Line ')+(entry.index+1)+': '+t('variáveis livres — ','free variables — ')+entry.freeVariables.join(', ')+'. '+t('A fórmula não é uma sentença fechada.','The formula is not a closed sentence.'));}
      add('p',t('A escrita e a consistência dos símbolos foram conferidas. A validade do argumento ainda não foi determinada.','The syntax and consistency of symbols were checked. Argument validity has not been determined.'));
      if(result.symbols.length)add('p',result.symbols.map(s=>s.name+(s.kind==='constant'?'': '/'+s.arity)).join(' · '),'hy-description-note');
    }
    add('p',t('Convenção: variáveis livres x, y, z, u, v, w (com índices); nomes ligados por quantificadores também são variáveis. Quantificadores têm o alcance da fórmula imediatamente seguinte; use parênteses para ampliar esse alcance. Descrições em linguagem natural não são usadas como axiomas.','Convention: free variables x, y, z, u, v, w (with indices); names bound by quantifiers are also variables. Quantifiers scope over the immediately following formula; use parentheses for a wider scope. Natural-language descriptions are not used as axioms.'),'hy-description-note');
    finish(result.status);return;
  }
  const result=LPCategorical.validate(rows);
  add('p',t('Semântica adotada: domínio não vazio; termos podem ser vazios. A e E não pressupõem existência. Para afirmar existência, acrescente I(S,S).','Semantics: nonempty domain; terms may be empty. A and E carry no existential import. To assert existence, add I(S,S).'),'hy-description-note');
  if(result.status==='errors'){
    add('h3',t('Confira a forma das proposições','Check the proposition forms'));
    for(const error of result.errors)add('p',t('Linha ','Line ')+(error.index+1)+': '+t('use A(S,P), E(S,P), I(S,P) ou O(S,P).','use A(S,P), E(S,P), I(S,P) or O(S,P).'),'hy-logic-result');
  }else if(result.status==='limit')add('p',t('Este verificador aceita até três termos distintos e 200 linhas.','This checker accepts up to three distinct terms and 200 rows.'));
  else if(result.status==='missingConclusion')add('p',t('Marque pelo menos uma conclusão.','Mark at least one conclusion.'));
  else{
    add('h3',result.status==='valid'?t('Argumento válido nesta semântica','Valid argument under these semantics'):t('Argumento inválido nesta semântica','Invalid argument under these semantics'));
    if(!result.satisfiable)add('p',t('As premissas são conjuntamente impossíveis. As conclusões decorrem por vacuidade; isso não comprova a verdade das premissas.','The premises are jointly impossible. The conclusions follow vacuously; this does not establish the truth of the premises.'));
    for(const conclusion of result.conclusions){
      add('h4',t('Conclusão da linha ','Conclusion on line ')+(conclusion.index+1)+' — '+(conclusion.valid?t('decorre','follows'):t('não decorre','does not follow')));
      if(conclusion.countermodel){
        add('p',t('Contramodelo: todas as premissas são verdadeiras e esta conclusão é falsa.','Countermodel: all premises are true and this conclusion is false.'));
        const table=document.createElement('table');table.className='hy-countermodel-table';
        const caption=document.createElement('caption');caption.textContent=t('Objetos e pertencimento aos termos','Objects and term membership');table.append(caption);
        const head=document.createElement('tr');for(const label of [t('Objeto','Object'),...result.terms]){const cell=document.createElement('th');cell.scope='col';cell.textContent=label;head.append(cell);}const thead=document.createElement('thead');thead.append(head);table.append(thead);
        const body=document.createElement('tbody');for(const object of conclusion.countermodel){const row=document.createElement('tr');for(const label of [object.id,...result.terms.map(term=>object.terms.includes(term)?t('Sim','Yes'):t('Não','No'))]){const cell=document.createElement('td');cell.textContent=label;row.append(cell);}body.append(row);}table.append(body);section.append(table);
      }
    }
  }
  add('p',t('A: Todo S é P. E: Nenhum S é P. I: Algum S é P. O: Algum S não é P. Os nomes dos termos diferenciam maiúsculas de minúsculas. A análise enumera todas as regiões possíveis de pertencimento; não pretende representar toda a tradição aristotélica ou escolástica.','A: Every S is P. E: No S is P. I: Some S is P. O: Some S is not P. Term names are case-sensitive. The analysis enumerates all possible membership regions; it does not represent the entire Aristotelian or scholastic tradition.'),'hy-description-note');
  finish(result.status);
}
