function updateExtendedLogicValidation(mode) {
  const t = interfaceText, section = document.createElement('div');
  section.className = 'hy-extended-logic';
  function node(tag, value, cls) {
    const element = document.createElement(tag);
    if (value) element.textContent = value;
    if (cls) element.className = cls;
    return element;
  }
  function summary(title, description, tone) {
    const card = node('section', '', 'hy-analysis-summary');
    card.dataset.tone = tone;
    const heading = node('h3', '', 'hy-analysis-result-heading');
    heading.append(analysisIcon(tone === 'valid' ? 'valid' : tone === 'invalid' ? 'invalid' : 'syntax'), node('span', title));
    card.append(heading);
    if (description) card.append(node('p', description));
    section.append(card);
    return card;
  }
  function guide(title, ...paragraphs) {
    const details = node('details');
    details.append(node('summary', title), ...paragraphs.map(p => node('p', p)));
    section.append(details);
  }
  function finish(status) {
    logicPanel.dataset.state = status;
    logicPanel.replaceChildren(section);
    refreshValidationWorkspace();
  }
  if (mode === 'first-order') {
    if (rows.length > 200) {
      summary(t('Limite da análise', 'Analysis limit'), t('Análise limitada a 200 linhas.', 'Analysis is limited to 200 rows.'), 'syntax');
      finish('limit'); return;
    }
    const result = LPFirstOrder.analyze(rows);
    const messages = {
      name: t('Esperado um nome de símbolo ou variável.', 'Expected a symbol or variable name.'),
      variable: t('Quantificadores de primeira ordem ligam variáveis individuais em minúsculas.', 'First-order quantifiers bind lowercase individual variables.'),
      predicate: t('Use predicados com inicial maiúscula, como P(a) ou Ama(a,b).', 'Use uppercase-initial predicates, such as P(a) or Loves(a,b).'),
      term: t('Os argumentos devem ser termos: variáveis, constantes ou funções com inicial minúscula.', 'Arguments must be terms: variables, constants or lowercase-initial functions.'),
      signature: t('O mesmo símbolo foi usado com tipos ou números de argumentos diferentes.', 'The same symbol was used with different kinds or argument counts.'),
      delimiter: t('Confira os parênteses e as vírgulas dos argumentos.', 'Check parentheses and argument commas.'),
      operator: t('Confira o conectivo ou símbolo: esta escrita não pertence à sintaxe de LPO suportada.', 'Check the connective or symbol: this expression is outside the supported FOL syntax.'),
      limit: t('A fórmula excede o limite desta análise.', 'The formula exceeds the analysis limit.'),
    };
    if (result.status === 'errors') {
      summary(t('Problemas de sintaxe ou vocabulário', 'Syntax or vocabulary issues'), t('Esses problemas não são um veredito de invalidade lógica.', 'These issues are not a verdict of logical invalidity.'), 'invalid');
      for (const error of result.errors) {
        const item = node('div', '', 'hy-analysis-diagnostic');
        item.append(node('span', t('Linha ', 'Line ') + (error.index + 1) + ' · ' + t('coluna ', 'column ') + error.column, 'hy-analysis-location'));
        item.append(node('p', (messages[error.code] || messages.operator) + (error.token ? ' [' + error.token + ']' : '')));
        section.append(item);
      }
    } else if (result.status === 'empty') {
      summary(t('Nenhuma fórmula para analisar', 'No formula to analyze'), t('Escreva uma fórmula para analisar.', 'Enter a formula to analyze.'), 'syntax');
    } else {
      summary(t('Sintaxe de LPO verificada', 'First-order syntax checked'), t('A escrita e a consistência dos símbolos foram conferidas. A validade do argumento ainda não foi determinada.', 'The syntax and consistency of symbols were checked. Argument validity has not been determined.'), 'syntax');
      for (const entry of result.entries) {
        if (!entry.freeVariables.length) continue;
        const note = node('div', '', 'hy-analysis-diagnostic');
        note.append(node('span', t('Linha ', 'Line ') + (entry.index + 1), 'hy-analysis-location'));
        note.append(node('p', t('variáveis livres — ', 'free variables — ') + entry.freeVariables.join(', ') + '. ' + t('A fórmula não é uma sentença fechada.', 'The formula is not a closed sentence.')));
        section.append(note);
      }
      if (result.symbols.length) {
        const symbols = node('section', '', 'hy-analysis-symbols');
        symbols.append(node('h4', t('Símbolos identificados', 'Identified symbols')));
        const list = node('div', '', 'hy-analysis-symbol-list');
        for (const s of result.symbols) {
          const chip = node('span', '', 'hy-analysis-symbol-chip');
          const kind = s.kind === 'constant' ? t('constante', 'constant') : s.kind === 'function' ? t('função', 'function') : t('predicado', 'predicate');
          chip.append(node('b', s.name), node('small', kind + (s.kind === 'constant' ? '' : ' · ' + t('aridade ', 'arity ') + s.arity)));
          list.append(chip);
        }
        symbols.append(list); section.append(symbols);
      }
    }
    guide(t('Convenções e limites', 'Conventions and limits'), t('Convenção: variáveis livres x, y, z, u, v, w (com índices); nomes ligados por quantificadores também são variáveis. Quantificadores têm o alcance da fórmula imediatamente seguinte; use parênteses para ampliar esse alcance. Descrições em linguagem natural não são usadas como axiomas.', 'Convention: free variables x, y, z, u, v, w (with indices); names bound by quantifiers are also variables. Quantifiers scope over the immediately following formula; use parentheses for a wider scope. Natural-language descriptions are not used as axioms.'));
    finish(result.status); return;
  }
  const result = LPCategorical.validate(rows);
  if (result.status === 'errors') {
    summary(t('Confira a forma das proposições', 'Check the proposition forms'), '', 'invalid');
    for (const error of result.errors) section.append(node('p', t('Linha ', 'Line ') + (error.index + 1) + ': ' + t('escrita não reconhecida. Use uma forma como “Todo homem é mortal”, “Aristóteles é homem” ou A(S,P). Frases com orações adicionais precisam ser reformuladas.', 'notation not recognized. Use a form such as “Every human is mortal”, “Aristotle is human” or A(S,P). Sentences with additional clauses need reformulation.'), 'hy-analysis-diagnostic'));
  } else if (result.status === 'limit') {
    summary(t('Limite da análise', 'Analysis limit'), t('Este verificador aceita até três termos distintos e 200 linhas.', 'This checker accepts up to three distinct terms and 200 rows.'), 'syntax');
  } else if (result.status === 'missingConclusion') {
    summary(t('Conclusão não indicada', 'No conclusion indicated'), t('Marque pelo menos uma conclusão.', 'Mark at least one conclusion.'), 'syntax');
  } else {
    summary(result.status === 'valid' ? t('Argumento válido nesta semântica', 'Valid argument under these semantics') : t('Argumento inválido nesta semântica', 'Invalid argument under these semantics'), '', result.status);
    if (!result.satisfiable) section.append(node('p', t('As premissas são conjuntamente impossíveis. As conclusões decorrem por vacuidade; isso não comprova a verdade das premissas.', 'The premises are jointly impossible. The conclusions follow vacuously; this does not establish the truth of the premises.'), 'hy-analysis-diagnostic'));
    for (const conclusion of result.conclusions) {
      const card = node('section', '', 'hy-categorical-conclusion');
      const heading = node('h4');
      heading.append(analysisIcon(conclusion.valid ? 'valid' : 'invalid'), node('span', t('Conclusão da linha ', 'Conclusion on line ') + (conclusion.index + 1) + ' — ' + (conclusion.valid ? t('decorre', 'follows') : t('não decorre', 'does not follow'))));
      card.append(heading);
      if (conclusion.countermodel) {
        card.append(node('p', t('Contramodelo: todas as premissas são verdadeiras e esta conclusão é falsa.', 'Countermodel: all premises are true and this conclusion is false.')));
        const scroll = node('div', '', 'hy-table-scroll');
        const table = node('table', '', 'hy-countermodel-table');
        table.append(node('caption', t('Objetos e pertencimento aos termos', 'Objects and term membership')));
        const head = node('tr');
        for (const label of [t('Objeto', 'Object'), ...result.terms]) { const cell = node('th', label); cell.scope = 'col'; head.append(cell); }
        const thead = node('thead'); thead.append(head); table.append(thead);
        const body = node('tbody');
        for (const object of conclusion.countermodel) {
          const row = node('tr');
          for (const label of [object.id, ...result.terms.map(term => object.terms.includes(term) ? t('Sim', 'Yes') : t('Não', 'No'))]) row.append(node('td', label));
          body.append(row);
        }
        table.append(body); scroll.append(table); card.append(scroll);
      }
      section.append(card);
    }
  }
  if (result.entries?.length) {
    const interpretation=node('details');interpretation.append(node('summary',t('Interpretação do texto','Text interpretation')));
    const presentation=LPCategoricalPresentation.explain(result.entries.map(entry=>({...entry,text:rows[entry.index].text})),ui.language);
    const content=node('div','','hy-didactic-interpretation');
    for(const entry of presentation.entries){
      const item=node('section','','hy-didactic-statement');
      item.append(node('h4',t('Linha ','Line ')+(entry.index+1)+' · '+(entry.role==='conclusion'?t('Conclusão','Conclusion'):t('Premissa','Premise'))),node('p',entry.text,'hy-didactic-original'),node('p',entry.formula,'hy-didactic-formula'),node('p',entry.reading,'hy-didactic-reading'));content.append(item);
    }
    appendCategoricalVocabulary(content,presentation);
    const conventions=node('details','','hy-didactic-conventions');conventions.append(node('summary',t('Convenções e notação categórica','Conventions and categorical notation')));
    conventions.append(node('p',t('Aqui, predicados começam com maiúscula, constantes com minúscula, e x é uma variável individual. Nomes próprios designam um indivíduo existente; nomes diferentes podem designar o mesmo indivíduo. Esta apresentação em predicados descreve o fragmento categórico analisado; não amplia o verificador para toda a lógica de primeira ordem.','Here, predicates start with uppercase, constants with lowercase, and x is an individual variable. Proper names denote one existing individual; different names may denote the same individual. This predicate rendering describes the analyzed categorical fragment; it does not extend the checker to all of first-order logic.')));
    for(const entry of presentation.entries)conventions.append(node('p',t('Linha ','Line ')+(entry.index+1)+': '+entry.technical));
    const reference=node('a',t('Referência didática: Lógica de Predicados — IME/USP','Teaching reference: Predicate Logic — IME/USP'));reference.href='https://www.ime.usp.br/~slago/IA-logicaDePredicados.pdf';reference.target='_blank';reference.rel='noopener noreferrer';conventions.append(reference);content.append(conventions);interpretation.append(content);section.append(interpretation);
  }
  section.append(node('p', t('Termos gerais podem ser vazios; universais não afirmam existência.', 'General terms may be empty; universals do not assert existence.'), 'hy-analysis-scope-note'));
  guide(t('Semântica e limites', 'Semantics and limits'), t('Semântica adotada: domínio não vazio; termos podem ser vazios. A e E não pressupõem existência. Para afirmar existência, acrescente I(S,S).', 'Semantics: nonempty domain; terms may be empty. A and E carry no existential import. To assert existence, add I(S,S).'), t('A notação formal diferencia maiúsculas de minúsculas; nas frases, palavras são normalizadas e nomes próprios designam indivíduos existentes. Não há resolução de pronomes, sinônimos ou flexões. A análise enumera regiões de pertencimento; não pretende representar toda a tradição aristotélica ou escolástica.', 'Formal notation is case-sensitive; natural-language words are normalized and proper names denote existing individuals. Pronouns, synonyms and inflections are not resolved. The analysis enumerates membership regions; it does not represent the entire Aristotelian or scholastic tradition.'));
  const forms = node('details');
  forms.append(node('summary', t('Formas das proposições', 'Proposition forms')));
  for (const [form, pt, en] of [['A(S,P)', 'Todo S é P.', 'Every S is P.'], ['E(S,P)', 'Nenhum S é P.', 'No S is P.'], ['I(S,P)', 'Algum S é P.', 'Some S is P.'], ['O(S,P)', 'Algum S não é P.', 'Some S is not P.']]) {
    const line = node('p', '', 'hy-analysis-form'); line.append(node('code', form), node('span', t(pt, en))); forms.append(line);
  }
  section.append(forms);
  finish(result.status);
}
