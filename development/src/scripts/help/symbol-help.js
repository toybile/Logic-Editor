const LPSymbolHelp = (() => {
  const data = {};
  function define(symbols, pt, en, example) {
    for (const s of symbols.split(" ")) data[s] = { pt, en, example };
  }
  define(
    "¬",
    "Nega uma proposição: ¬A é verdadeiro exatamente quando A é falso. A dupla negação ¬¬A tem o mesmo valor de A.",
    "Negates a proposition: ¬A is true exactly when A is false. Double negation ¬¬A has the same value as A.",
    "A = V ⇒ ¬A = F",
  );
  define(
    "∧",
    "A conjunção exige que as duas proposições sejam verdadeiras. Uma única parcela falsa torna o resultado falso.",
    "Conjunction requires both propositions to be true. One false operand makes the result false.",
    "V ∧ V = V; V ∧ F = F",
  );
  define(
    "∨",
    "A disjunção inclusiva exige pelo menos uma proposição verdadeira. Também é verdadeira quando ambas são verdadeiras.",
    "Inclusive disjunction requires at least one true proposition. It is also true when both are true.",
    "V ∨ F = V; F ∨ F = F",
  );
  define(
    "→ ⇒",
    "O condicional material só é falso quando o antecedente é verdadeiro e o consequente é falso. Não afirma, por si só, uma relação causal.",
    "The material conditional is false only when the antecedent is true and the consequent is false. It does not by itself assert causation.",
    "A → B ≡ ¬A ∨ B",
  );
  define(
    "↔ ⇔ ≡",
    "O bicondicional é verdadeiro quando os dois lados têm o mesmo valor de verdade. Na lógica proposicional, ≡ é aceito como outra notação do bicondicional; em outros contextos pode indicar equivalência ou congruência.",
    "The biconditional is true when both sides have the same truth value. In propositional validation, ≡ is another biconditional notation; elsewhere it can denote equivalence or congruence.",
    "V ↔ V = V; V ↔ F = F",
  );
  define(
    "⊕",
    "A disjunção exclusiva é verdadeira quando exatamente uma das duas proposições é verdadeira. Difere da disjunção inclusiva quando ambas são verdadeiras.",
    "Exclusive disjunction is true when exactly one proposition is true. It differs from inclusive disjunction when both are true.",
    "V ⊕ F = V; V ⊕ V = F",
  );
  define(
    "⊤",
    "Constante de verdade: seu valor é verdadeiro em qualquer interpretação. Não é uma variável que muda entre linhas da tabela.",
    "Truth constant: true in every interpretation. It is not a variable whose value changes between table rows.",
    "A ∧ ⊤ ↔ A",
  );
  define(
    "⊥",
    "Constante de falsidade: falsa em qualquer interpretação. Não confunda com uma variável que apenas recebeu valor falso em uma linha da tabela.",
    "Falsehood constant: false in every interpretation. Do not confuse it with a variable assigned false in one table row.",
    "A ∨ ⊥ ↔ A",
  );
  define(
    "↑",
    "NAND é a negação da conjunção. Só é falso quando ambas as proposições são verdadeiras.",
    "NAND is negated conjunction. It is false only when both propositions are true.",
    "A ↑ B ≡ ¬(A ∧ B)",
  );
  define(
    "↓",
    "NOR é a negação da disjunção inclusiva. Só é verdadeiro quando ambas as proposições são falsas.",
    "NOR is negated inclusive disjunction. It is true only when both propositions are false.",
    "A ↓ B ≡ ¬(A ∨ B)",
  );
  define(
    "← ⇐",
    "O condicional inverso troca os papéis de antecedente e consequente: A ← B tem o valor de B → A.",
    "Reverse conditional swaps antecedent and consequent: A ← B has the value of B → A.",
    "A ← B ≡ B → A",
  );
  define(
    "↛ ⇏",
    "Nega o condicional material. É verdadeiro precisamente quando o lado esquerdo é verdadeiro e o direito é falso. Fora deste validador, ⇏ pode expressar uma afirmação sobre não consequência.",
    "Negates the material conditional. True exactly when the left side is true and the right side false. Outside this validator, ⇏ can express a claim about non-entailment.",
    "A ↛ B ≡ A ∧ ¬B",
  );
  define(
    "↮ ⇎",
    "Nega o bicondicional: os dois lados precisam ter valores diferentes. No validador, equivale à disjunção exclusiva.",
    "Negates the biconditional: both sides must have different values. In the validator this equals exclusive disjunction.",
    "A ↮ B ≡ A ⊕ B",
  );
  define(
    "∀",
    "Quantifica sobre todos os objetos do domínio escolhido. ∀x P(x) exige que P valha para cada objeto desse domínio.",
    "Quantifies over all objects of the chosen domain. ∀x P(x) requires P to hold for every object in that domain.",
    "∀x (P(x) → Q(x))",
  );
  define(
    "∃",
    "Afirma que existe pelo menos um objeto do domínio que satisfaz a fórmula. O domínio e o predicado precisam ser especificados.",
    "Asserts that at least one object in the domain satisfies the formula. The domain and predicate must be specified.",
    "∃x P(x)",
  );
  define(
    "∃!",
    "Afirma existência e unicidade: exatamente um objeto do domínio satisfaz a condição. Não basta apenas existir algum objeto.",
    "Asserts existence and uniqueness: exactly one object satisfies the condition. Mere existence is not enough.",
    "∃!x P(x)",
  );
  define(
    "∄",
    "Afirma que nenhum objeto do domínio satisfaz a condição. Pode ser escrito como a negação de uma quantificação existencial.",
    "Asserts that no object in the domain satisfies the condition. It can be written as negated existential quantification.",
    "∄x P(x) ≡ ¬∃x P(x)",
  );
  define(
    "=",
    "Afirma igualdade entre os objetos ou valores dos termos. Não é o mesmo que dizer que duas proposições têm valores de verdade iguais.",
    "Asserts equality between the objects or values denoted by terms. This differs from two propositions sharing a truth value.",
    "2 + 3 = 5",
  );
  define(
    "≠",
    "Nega a igualdade dos dois termos. Exige um contexto que dê significado aos termos comparados.",
    "Negates equality of two terms. A context must assign meaning to the compared terms.",
    "2 ≠ 3",
  );
  define(
    "≢",
    "Indica que a equivalência ou congruência em questão não vale. Seu significado preciso depende da relação definida no contexto.",
    "Indicates that the relevant equivalence or congruence does not hold. Its exact meaning depends on the relation defined in context.",
    "2 ≢ 3 (mod 2)",
  );
  define(
    "□",
    "Na semântica modal relacional, □A exige A em todos os mundos acessíveis a partir do mundo de avaliação. As propriedades da acessibilidade dependem do sistema modal.",
    "In relational modal semantics, □A requires A in every world accessible from the evaluation world. Accessibility properties depend on the modal system.",
    "□A",
  );
  define(
    "◇",
    "Na semântica modal relacional, ◇A exige pelo menos um mundo acessível em que A valha. Possibilidade não significa que A já seja verdadeiro no mundo atual.",
    "In relational modal semantics, ◇A requires at least one accessible world where A holds. Possibility does not mean A is already true at the current world.",
    "◇A ≡ ¬□¬A (semântica modal clássica)",
  );
  define(
    "⊢",
    "Indica derivabilidade em um sistema de demonstração especificado: há uma derivação da fórmula à direita a partir das hipóteses à esquerda.",
    "Indicates derivability in a specified proof system: the right-hand formula has a derivation from the hypotheses on the left.",
    "A → B, A ⊢ B",
  );
  define(
    "⊬",
    "Indica ausência de derivação no sistema de demonstração especificado. É uma afirmação sobre derivabilidade, não um conectivo da fórmula.",
    "Indicates absence of a derivation in the specified proof system. It is a claim about derivability, not a formula connective.",
    "A ⊬ B (A e B independentes)",
  );
  define(
    "⊨",
    "Indica consequência semântica: toda interpretação que satisfaz as hipóteses satisfaz a conclusão. Com hipóteses vazias, indica validade.",
    "Indicates semantic consequence: every interpretation satisfying the hypotheses satisfies the conclusion. With no hypotheses it indicates validity.",
    "A → B, A ⊨ B",
  );
  define(
    "⊭",
    "Nega a consequência semântica: há uma interpretação que satisfaz as hipóteses e torna a conclusão falsa.",
    "Negates semantic consequence: an interpretation satisfies the hypotheses and makes the conclusion false.",
    "A → B, B ⊭ A",
  );
  define(
    "∴",
    "Marca uma conclusão na apresentação do raciocínio. No editor, use o botão Conclusão; não é necessário digitar ∴ no campo da fórmula.",
    "Marks a conclusion in the presentation of an argument. Use the Conclusion role button; you do not need to type ∴ into the formula field.",
    "A → B; A; ∴ B",
  );
  define(
    "∵",
    "Marca a apresentação de uma razão ou justificativa. Não é um conectivo proposicional que receba uma tabela de valores.",
    "Marks the presentation of a reason or justification. It is not a propositional connective with a truth table.",
    "B, ∵ A e A → B",
  );
  define(
    "∎",
    "Indica que uma demonstração terminou. Não verifica a correção da demonstração nem entra na avaliação de uma fórmula.",
    "Marks the end of a proof. It neither verifies the proof nor participates in formula evaluation.",
    "… ∎",
  );
  define(
    "∪",
    "A união contém os elementos que pertencem a pelo menos um dos conjuntos. Repetições de um elemento não criam novos elementos em conjuntos comuns.",
    "Union contains elements belonging to at least one set. Repeating an element does not add new elements to ordinary sets.",
    "{1,2} ∪ {2,3} = {1,2,3}",
  );
  define(
    "∩",
    "A interseção contém exatamente os elementos comuns aos dois conjuntos.",
    "Intersection contains exactly the elements common to both sets.",
    "{1,2} ∩ {2,3} = {2}",
  );
  define(
    "∖",
    "A diferença mantém os elementos do conjunto esquerdo que não pertencem ao direito. A ordem importa.",
    "Set difference keeps elements of the left set that are absent from the right. Order matters.",
    "{1,2} ∖ {2,3} = {1}",
  );
  define(
    "∁",
    "O complemento depende de um universo U: contém os elementos de U que não pertencem ao conjunto considerado.",
    "Complement depends on a universe U: it contains the elements of U absent from the chosen set.",
    "U={1,2,3}; ∁{1,2}={3}",
  );
  define(
    "∆",
    "A diferença simétrica contém elementos de exatamente um dos conjuntos, excluindo os comuns.",
    "Symmetric difference contains elements in exactly one set, excluding common elements.",
    "{1,2} ∆ {2,3} = {1,3}",
  );
  define(
    "⊎",
    "Nesta biblioteca, representa união de multiconjuntos: as multiplicidades dos elementos são somadas. Em outros textos também pode designar união disjunta; confira a convenção usada.",
    "In this library it represents multiset union: element multiplicities are added. Other texts also use it for disjoint union; check the convention.",
    "{1,1} ⊎ {1} = {1,1,1} (multiconjuntos)",
  );
  define(
    "∅",
    "O conjunto vazio não possui elementos. Ele é diferente de um conjunto contendo o próprio conjunto vazio.",
    "The empty set has no elements. It differs from a set containing the empty set itself.",
    "∅ ≠ {∅}",
  );
  define(
    "𝒫",
    "O conjunto das partes de A contém todos os subconjuntos de A, incluindo o vazio e A. Um conjunto finito com n elementos tem 2ⁿ subconjuntos.",
    "The power set of A contains every subset of A, including the empty set and A. A finite n-element set has 2ⁿ subsets.",
    "𝒫({1,2}) = {∅,{1},{2},{1,2}}",
  );
  define(
    "×",
    "O produto cartesiano contém pares ordenados, com o primeiro componente no conjunto esquerdo e o segundo no direito.",
    "Cartesian product contains ordered pairs, with the first component from the left set and the second from the right.",
    "{1,2} × {a} = {(1,a),(2,a)}",
  );
  define(
    "∈",
    "Expressa pertencimento de um elemento a um conjunto. Não confunda com inclusão entre conjuntos.",
    "Expresses membership of an element in a set. Do not confuse it with inclusion between sets.",
    "1 ∈ {1,2}",
  );
  define(
    "∉",
    "Nega pertencimento de um elemento ao conjunto.",
    "Negates membership of an element in a set.",
    "3 ∉ {1,2}",
  );
  define(
    "∋",
    "É a relação de pertencimento escrita na ordem inversa: o conjunto fica à esquerda e o elemento à direita.",
    "Membership written in reverse order: the set is on the left and the element on the right.",
    "{1,2} ∋ 1",
  );
  define(
    "∌",
    "Nega pertencimento na ordem inversa, com conjunto à esquerda e elemento à direita.",
    "Negates membership in reverse order, with the set on the left and element on the right.",
    "{1,2} ∌ 3",
  );
  define(
    "⊆",
    "A ⊆ B exige que todo elemento de A pertença a B. Permite A = B.",
    "A ⊆ B requires every element of A to belong to B. Equality A = B is allowed.",
    "{1} ⊆ {1,2}",
  );
  define(
    "⊈",
    "Nega inclusão: há pelo menos um elemento do conjunto esquerdo ausente no direito.",
    "Negates inclusion: at least one element of the left set is absent from the right.",
    "{1,3} ⊈ {1,2}",
  );
  define(
    "⊂ ⊊",
    "Nesta biblioteca indica inclusão estrita: A é subconjunto de B e A ≠ B. Alguns textos usam ⊂ permitindo igualdade; ⊊ explicita a desigualdade.",
    "In this library it means strict inclusion: A is a subset of B and A ≠ B. Some texts allow equality with ⊂; ⊊ makes inequality explicit.",
    "{1} ⊊ {1,2}",
  );
  define(
    "⊄",
    "Nega a inclusão estrita adotada nesta biblioteca. A negação pode ocorrer por falta de inclusão ou por igualdade entre os conjuntos.",
    "Negates strict inclusion as used in this library. It can fail because inclusion fails or because the sets are equal.",
    "{1,2} ⊄ {1}",
  );
  define(
    "⊇",
    "A ⊇ B afirma B ⊆ A. Permite igualdade.",
    "A ⊇ B states B ⊆ A. Equality is allowed.",
    "{1,2} ⊇ {1}",
  );
  define(
    "⊉",
    "Nega a inclusão inversa: algum elemento do conjunto direito não pertence ao esquerdo.",
    "Negates reverse inclusion: some element of the right set is absent from the left.",
    "{1} ⊉ {1,2}",
  );
  define(
    "⊃ ⊋",
    "Na categoria de conjuntos, indica inclusão estrita inversa: A contém B como subconjunto e A ≠ B. Na categoria proposicional, ⊃ representa o condicional material.",
    "In the sets category it means strict reverse inclusion: A contains B as a subset and A ≠ B. In the propositional category, ⊃ represents material implication.",
    "{1,2} ⊋ {1}",
  );
  define(
    "⊅",
    "Nega a inclusão estrita inversa segundo a convenção desta biblioteca. Confira se o texto consultado permite igualdade com ⊃.",
    "Negates strict reverse inclusion under this library convention. Check whether the consulted text allows equality with ⊃.",
    "{1} ⊅ {1,2}",
  );
  define(
    "⋀",
    "Conjunção indexada: exige todas as proposições da família. Em uma família finita, expande-se como uma sequência de conjunções.",
    "Indexed conjunction requires all propositions in a family. A finite family expands into a chain of conjunctions.",
    "⋀ᵢ₌₁³ Aᵢ = A₁ ∧ A₂ ∧ A₃",
  );
  define(
    "⋁",
    "Disjunção indexada: exige pelo menos uma proposição verdadeira na família.",
    "Indexed disjunction requires at least one true proposition in the family.",
    "⋁ᵢ₌₁³ Aᵢ = A₁ ∨ A₂ ∨ A₃",
  );
  define(
    "⋃",
    "União de uma família: reúne os elementos presentes em pelo menos um conjunto da família.",
    "Union of a family collects elements present in at least one member set.",
    "⋃ᵢ₌₁³ Sᵢ = S₁ ∪ S₂ ∪ S₃",
  );
  define(
    "⋂",
    "Interseção de uma família: mantém os elementos presentes em todos os conjuntos da família.",
    "Intersection of a family keeps elements present in every member set.",
    "⋂ᵢ₌₁³ Sᵢ = S₁ ∩ S₂ ∩ S₃",
  );
  define(
    "⨄",
    "Aplica a união de multiconjuntos a uma família, somando multiplicidades. Também pode denotar união disjunta em outra convenção.",
    "Applies multiset union to a family, adding multiplicities. It can also denote disjoint union under another convention.",
    "⨄ᵢ₌₁³ Sᵢ",
  );
  for (const [s, pt, en, ex] of [
    ["<", "menor que", "less than", "2 < 3"],
    [">", "maior que", "greater than", "3 > 2"],
    ["≤", "menor ou igual", "less than or equal", "2 ≤ 2"],
    ["≥", "maior ou igual", "greater than or equal", "3 ≥ 2"],
    ["≮", "não menor que", "not less than", "3 ≮ 2"],
    ["≯", "não maior que", "not greater than", "2 ≯ 3"],
    ["≰", "não menor ou igual", "not less than or equal", "3 ≰ 2"],
    ["≱", "não maior ou igual", "not greater than or equal", "2 ≱ 3"],
  ])
    define(
      s,
      "Compara valores segundo a relação de ordem adotada: " +
        pt +
        ". As versões negadas negam a relação correspondente; equivalências com a ordem oposta exigem hipóteses sobre essa ordem.",
      "Compares values under the chosen order: " +
        en +
        ". Negated forms deny the corresponding relation; equivalence with the opposite order requires assumptions about that order.",
      ex,
    );
  define(
    "≈",
    "Indica aproximação ou uma relação de equivalência convencionada. Para aproximações numéricas, a precisão ou tolerância deve ser definida.",
    "Indicates approximation or a stipulated equivalence relation. Numerical approximation requires a specified precision or tolerance.",
    "π ≈ 3,14159",
  );
  define(
    "≉",
    "Nega a aproximação ou relação indicada por ≈. A tolerância ou relação usada precisa ser conhecida.",
    "Negates the approximation or relation denoted by ≈. The tolerance or relation must be known.",
    "x ≉ y",
  );
  define(
    "≔ ≕ ≝ ≜",
    "Marca uma definição, não uma conclusão deduzida. Em x ≔ expressão, define-se x pela expressão; ≕ inverte essa apresentação. ≝ e ≜ também sinalizam igualdade por definição.",
    "Marks a definition, not a derived conclusion. In x ≔ expression, x is defined by the expression; ≕ reverses the presentation. ≝ and ≜ also mark equality by definition.",
    "f(x) ≔ x²",
  );
  define(
    "( ) [ ] { }",
    "Abre ou fecha um agrupamento. No validador proposicional, parênteses, colchetes e chaves podem agrupar fórmulas e precisam fechar com o mesmo tipo de delimitador. Chaves também representam conjuntos em outro contexto.",
    "Opens or closes a grouping. In propositional validation, parentheses, brackets and braces group formulas and must close with the matching delimiter type. Braces also denote sets in another context.",
    "(A ∨ B) ∧ C",
  );
  define(
    "⌈ ⌉",
    "O par ⌈x⌉ indica o teto: o menor inteiro maior ou igual a x. Use ambos os delimitadores para escrever a operação.",
    "The pair ⌈x⌉ denotes the ceiling: the smallest integer greater than or equal to x. Both delimiters form the operation.",
    "⌈2,3⌉ = 3",
  );
  define(
    "⌊ ⌋",
    "O par ⌊x⌋ indica o piso: o maior inteiro menor ou igual a x. Para números negativos, não equivale a simplesmente remover a parte decimal.",
    "The pair ⌊x⌋ denotes the floor: the greatest integer less than or equal to x. For negative numbers it is not simply truncation.",
    "⌊−2,3⌋ = −3",
  );
  define(
    "… ⋯ ⋮",
    "Indica continuação de uma sequência ou padrão, na direção da notação escolhida. Os termos omitidos precisam ser inferíveis do contexto; não é um operador proposicional.",
    "Indicates continuation of a sequence or pattern along the notation direction. Omitted terms must be inferable from context; it is not a propositional operator.",
    "1, 2, 3, …",
  );
  define(
    ":",
    "Separa uma identificação de seu conteúdo ou indica uma condição, conforme a convenção. Não possui um significado lógico único independente do contexto.",
    "Separates a label from its content or introduces a condition under the chosen convention. It has no single context-independent logical meaning.",
    "A: Está chovendo",
  );
  let page = null,
    returnCell = null,
    returnEntry = null,
    scroll = 0;
  const text = interfaceText;
  function close() {
    if (page) page.close();
  }
  function open(cell, entry) {
    const [symbol, name, forms = [symbol], note] = entry,
      info = data[symbol];
    if (!info) return;
    returnCell = cell;
    returnEntry = entry;
    closeNotations();
    page = document.createElement("dialog");
    page.className = "hy-symbol-help-dialog";
    page.setAttribute("aria-labelledby", "symbol-help-title");
    page.style.colorScheme = isDarkTheme() ? "dark" : "light";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "hy-symbol-help-close";
    LPDialogChrome.close(back);
    back.setAttribute("aria-label", text("Fechar explicação", "Close explanation"));

    back.onclick = close;
    const content = document.createElement("div");
    content.className = "hy-help-content";
    const title = document.createElement("h1");
    title.id = "symbol-help-title";
    title.textContent = symbol + " — " + translated(name);
    title.tabIndex = -1;
    const article = document.createElement("article");
    function paragraph(value, kind) {
      const p = document.createElement("p");
      p.textContent = value;
      if (kind) p.className = kind;
      article.append(p);
    }
    paragraph(text(info.pt, info.en));
    paragraph(text("Exemplo: ", "Example: ") + info.example, "hy-help-formula");
    paragraph(
      text("Notações nesta categoria: ", "Notations in this category: ") + forms.join(" · "),
    );
    if (note) paragraph(translated(note));
    const supported = [
      "¬",
      "∧",
      "∨",
      "→",
      "⇒",
      "⊃",
      "↔",
      "⇔",
      "≡",
      "⊕",
      "⊤",
      "⊥",
      "↑",
      "↓",
      "←",
      "⇐",
      "↛",
      "⇏",
      "↮",
      "⇎",
      "(",
      ")",
      "[",
      "]",
      "{",
      "}",
    ].includes(symbol);
    if (symbol === "⊃")
      paragraph(
        text(
          "Atenção: o validador interpreta ⊃ como condicional material entre proposições, não como relação de conjuntos.",
          "Note: the validator interprets ⊃ as material conditional between propositions, not as a set relation.",
        ),
      );
    paragraph(
      supported
        ? text(
            "No editor: aceito na sintaxe proposicional. Os termos dos exemplos matemáticos continuam fora do validador; use variáveis proposicionais e conectivos.",
            "In the editor: accepted in propositional syntax. Mathematical example terms remain outside the validator; use propositional variables and connectives.",
          )
        : text(
            "No editor: disponível para escrever e exportar, mas este símbolo não é avaliado pela validação proposicional atual.",
            "In the editor: available for writing and exporting, but this symbol is not evaluated by current propositional validation.",
          ),
    );
    paragraph(
      text(
        "Os valores V e F representam verdadeiro e falso. O significado de uma notação depende do contexto; símbolos parecidos não garantem a mesma operação.",
        "V and F stand for true and false in these examples. Notation depends on context; similar symbols do not guarantee the same operation.",
      ),
    );
    content.append(article);
    const sources = document.createElement("footer");
    sources.append(document.createTextNode(text("Referências: ", "References: ")));
    for (const [label, url] of [
      [
        "Open Logic Project",
        "https://builds.openlogicproject.org/courses/sample/open-logic-sample.pdf",
      ],
      ["Stanford — logic", "https://logic.stanford.edu/intrologic/dictionary/implication.html"],
      ["Stanford — modal logic", "https://plato.stanford.edu/entries/logic-modal/"],
    ]) {
      const a = document.createElement("a");
      a.textContent = label;
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      sources.append(a);
    }
    content.append(sources);
    const header=document.createElement("header");header.className="hy-symbol-help-heading";header.append(title,back);page.append(header,content);
    page.onclose = () => {
      page.remove();
      page = null;
      if (returnCell?.isConnected) {
        showNotations(returnCell, returnEntry);
        notationPanel.querySelector(".hy-symbol-help")?.focus();
      }
    };
    root.append(page);
    page.showModal();
    back.focus({ preventScroll: true });
  }
  return { data, open };
})();
