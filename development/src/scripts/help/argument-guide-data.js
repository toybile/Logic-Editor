(function(scope){
  const guide={
  "entries": [
    {
      "id": "mp",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Modus ponens",
        "en": "Modus ponens"
      },
      "premises": [
        "P → Q",
        "P"
      ],
      "conclusion": "Q",
      "explanation": {
        "pt": "O antecedente afirmado permite aplicar a condicional.",
        "en": "An affirmed antecedent lets us apply the conditional."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "mt",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Modus tollens",
        "en": "Modus tollens"
      },
      "premises": [
        "P → Q",
        "¬Q"
      ],
      "conclusion": "¬P",
      "explanation": {
        "pt": "Negar o consequente exclui o antecedente desta condicional.",
        "en": "Denying the consequent rules out this conditional’s antecedent."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "hs",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Silogismo hipotético",
        "en": "Hypothetical syllogism"
      },
      "premises": [
        "P → Q",
        "Q → R"
      ],
      "conclusion": "P → R",
      "explanation": {
        "pt": "Encadeie as duas condicionais pelo termo intermediário Q.",
        "en": "Chain the two conditionals through the intermediate formula Q."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "ds",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Silogismo disjuntivo",
        "en": "Disjunctive syllogism"
      },
      "premises": [
        "P ∨ Q",
        "¬P"
      ],
      "conclusion": "Q",
      "explanation": {
        "pt": "Com pelo menos uma alternativa verdadeira e P falsa, Q permanece.",
        "en": "With at least one true alternative and P false, Q remains."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "and-intro",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Introdução da conjunção",
        "en": "Conjunction introduction"
      },
      "premises": [
        "P",
        "Q"
      ],
      "conclusion": "P ∧ Q",
      "explanation": {
        "pt": "Reúna duas afirmações já estabelecidas.",
        "en": "Combine two already established statements."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "and-elim-left",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Eliminação da conjunção: esquerda",
        "en": "Conjunction elimination: left"
      },
      "premises": [
        "P ∧ Q"
      ],
      "conclusion": "P",
      "explanation": {
        "pt": "Uma conjunção verdadeira garante seu primeiro componente.",
        "en": "A true conjunction guarantees its first component."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "and-elim-right",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Eliminação da conjunção: direita",
        "en": "Conjunction elimination: right"
      },
      "premises": [
        "P ∧ Q"
      ],
      "conclusion": "Q",
      "explanation": {
        "pt": "Uma conjunção verdadeira garante seu segundo componente.",
        "en": "A true conjunction guarantees its second component."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "or-intro",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Introdução da disjunção",
        "en": "Disjunction introduction"
      },
      "premises": [
        "P"
      ],
      "conclusion": "P ∨ Q",
      "explanation": {
        "pt": "Uma alternativa verdadeira basta para a disjunção inclusiva.",
        "en": "One true alternative suffices for an inclusive disjunction."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "or-elim",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Eliminação da disjunção: casos",
        "en": "Disjunction elimination: cases"
      },
      "premises": [
        "P ∨ Q",
        "P → R",
        "Q → R"
      ],
      "conclusion": "R",
      "explanation": {
        "pt": "A mesma conclusão resulta de cada alternativa possível.",
        "en": "The same conclusion follows from either possible alternative."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme. Na regra geral, descarregue separadamente as hipóteses P e Q das duas subprovas.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly. In the general rule, discharge the P and Q assumptions separately in their subproofs."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "constructive-dilemma",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Dilema construtivo",
        "en": "Constructive dilemma"
      },
      "premises": [
        "P → R",
        "Q → S",
        "P ∨ Q"
      ],
      "conclusion": "R ∨ S",
      "explanation": {
        "pt": "Cada alternativa inicial conduz a uma alternativa da conclusão.",
        "en": "Each initial alternative leads to one alternative in the conclusion."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "destructive-dilemma",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Dilema destrutivo",
        "en": "Destructive dilemma"
      },
      "premises": [
        "P → Q",
        "R → S",
        "¬Q ∨ ¬S"
      ],
      "conclusion": "¬P ∨ ¬R",
      "explanation": {
        "pt": "A falha de um consequente força a falha de seu antecedente.",
        "en": "The failure of a consequent forces its antecedent to fail."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "implication-absorption",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Absorção da condicional",
        "en": "Conditional absorption"
      },
      "premises": [
        "P → Q"
      ],
      "conclusion": "P → (P ∧ Q)",
      "explanation": {
        "pt": "Sob a hipótese P, retenha P e obtenha Q.",
        "en": "Under assumption P, retain P and obtain Q."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "resolution",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Resolução proposicional",
        "en": "Propositional resolution"
      },
      "premises": [
        "P ∨ Q",
        "¬P ∨ R"
      ],
      "conclusion": "Q ∨ R",
      "explanation": {
        "pt": "Resolver as ocorrências opostas de P preserva Q ou R.",
        "en": "Resolving the opposite occurrences of P preserves Q or R."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://avigad.github.io/lamr/decision_procedures_for_propositional_logic.html"
    },
    {
      "id": "double-negation",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Dupla negação",
        "en": "Double negation"
      },
      "premises": [],
      "conclusion": "¬¬P ↔ P",
      "explanation": {
        "pt": "Na lógica clássica, duas negações se cancelam.",
        "en": "In classical logic, two negations cancel."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme. A eliminação de dupla negação não é uma regra irrestrita da lógica intuicionista.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly. Double-negation elimination is not unrestricted in intuitionistic logic."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "contraposition",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Contraposição",
        "en": "Contraposition"
      },
      "premises": [],
      "conclusion": "(P → Q) ↔ (¬Q → ¬P)",
      "explanation": {
        "pt": "Inverta os lados da condicional e negue ambos.",
        "en": "Reverse the conditional’s sides and negate both."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "material-implication",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Condicional material",
        "en": "Material conditional"
      },
      "premises": [],
      "conclusion": "(P → Q) ↔ (¬P ∨ Q)",
      "explanation": {
        "pt": "Uma condicional material só falha com P verdadeira e Q falsa.",
        "en": "A material conditional fails only when P is true and Q false."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "iff-definition",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Bicondicional: duas direções",
        "en": "Biconditional: both directions"
      },
      "premises": [],
      "conclusion": "(P ↔ Q) ↔ ((P → Q) ∧ (Q → P))",
      "explanation": {
        "pt": "A bicondicional reúne as duas implicações.",
        "en": "A biconditional combines implications in both directions."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "iff-agreement",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Bicondicional: concordância",
        "en": "Biconditional: agreement"
      },
      "premises": [],
      "conclusion": "(P ↔ Q) ↔ ((P ∧ Q) ∨ (¬P ∧ ¬Q))",
      "explanation": {
        "pt": "Os componentes de uma bicondicional verdadeira têm o mesmo valor.",
        "en": "The components of a true biconditional have the same truth value."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "demorgan-and",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "De Morgan: negação da conjunção",
        "en": "De Morgan: negated conjunction"
      },
      "premises": [],
      "conclusion": "¬(P ∧ Q) ↔ (¬P ∨ ¬Q)",
      "explanation": {
        "pt": "Negar que ambos ocorram permite ao menos uma negação.",
        "en": "Denying that both hold yields at least one negation."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "demorgan-or",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "De Morgan: negação da disjunção",
        "en": "De Morgan: negated disjunction"
      },
      "premises": [],
      "conclusion": "¬(P ∨ Q) ↔ (¬P ∧ ¬Q)",
      "explanation": {
        "pt": "Negar a disjunção exige negar as duas alternativas.",
        "en": "Denying the disjunction requires denying both alternatives."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "commutation-and",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Comutatividade da conjunção",
        "en": "Conjunction commutativity"
      },
      "premises": [],
      "conclusion": "(P ∧ Q) ↔ (Q ∧ P)",
      "explanation": {
        "pt": "A ordem dos componentes não altera a conjunção.",
        "en": "Component order does not change a conjunction."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "commutation-or",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Comutatividade da disjunção",
        "en": "Disjunction commutativity"
      },
      "premises": [],
      "conclusion": "(P ∨ Q) ↔ (Q ∨ P)",
      "explanation": {
        "pt": "A ordem das alternativas não altera a disjunção inclusiva.",
        "en": "Alternative order does not change an inclusive disjunction."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "association-and",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Associatividade da conjunção",
        "en": "Conjunction associativity"
      },
      "premises": [],
      "conclusion": "((P ∧ Q) ∧ R) ↔ (P ∧ (Q ∧ R))",
      "explanation": {
        "pt": "Apenas o agrupamento das três conjunções muda.",
        "en": "Only the grouping of the three conjuncts changes."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "association-or",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Associatividade da disjunção",
        "en": "Disjunction associativity"
      },
      "premises": [],
      "conclusion": "((P ∨ Q) ∨ R) ↔ (P ∨ (Q ∨ R))",
      "explanation": {
        "pt": "Apenas o agrupamento das três alternativas muda.",
        "en": "Only the grouping of the three alternatives changes."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "distribution-and",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Distribuição de ∧ sobre ∨",
        "en": "Distribution of ∧ over ∨"
      },
      "premises": [],
      "conclusion": "(P ∧ (Q ∨ R)) ↔ ((P ∧ Q) ∨ (P ∧ R))",
      "explanation": {
        "pt": "Distribua o componente comum por cada alternativa.",
        "en": "Distribute the common conjunct across each alternative."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "distribution-or",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Distribuição de ∨ sobre ∧",
        "en": "Distribution of ∨ over ∧"
      },
      "premises": [],
      "conclusion": "(P ∨ (Q ∧ R)) ↔ ((P ∨ Q) ∧ (P ∨ R))",
      "explanation": {
        "pt": "Distribua a alternativa comum pelas duas conjunções.",
        "en": "Distribute the common alternative across both conjuncts."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "absorption-and",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Absorção: P ∧ (P ∨ Q)",
        "en": "Absorption: P ∧ (P ∨ Q)"
      },
      "premises": [],
      "conclusion": "(P ∧ (P ∨ Q)) ↔ P",
      "explanation": {
        "pt": "A exigência adicional é garantida por P.",
        "en": "P already guarantees the additional requirement."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "absorption-or",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Absorção: P ∨ (P ∧ Q)",
        "en": "Absorption: P ∨ (P ∧ Q)"
      },
      "premises": [],
      "conclusion": "(P ∨ (P ∧ Q)) ↔ P",
      "explanation": {
        "pt": "A segunda alternativa já implica a primeira.",
        "en": "The second alternative already implies the first."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "idempotence-and",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Idempotência da conjunção",
        "en": "Conjunction idempotence"
      },
      "premises": [],
      "conclusion": "(P ∧ P) ↔ P",
      "explanation": {
        "pt": "Repetir a mesma exigência não a fortalece.",
        "en": "Repeating the same requirement does not strengthen it."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "idempotence-or",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Idempotência da disjunção",
        "en": "Disjunction idempotence"
      },
      "premises": [],
      "conclusion": "(P ∨ P) ↔ P",
      "explanation": {
        "pt": "Repetir a mesma alternativa não a amplia.",
        "en": "Repeating the same alternative does not broaden it."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "excluded-middle",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Terceiro excluído",
        "en": "Excluded middle"
      },
      "premises": [],
      "conclusion": "P ∨ ¬P",
      "explanation": {
        "pt": "A disjunção entre uma fórmula e sua negação é clássicamente válida.",
        "en": "A formula disjoined with its negation is classically valid."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme. Este princípio não vale irrestritamente em todas as lógicas.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly. This principle is not unrestricted across all logics."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "noncontradiction",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Não contradição",
        "en": "Noncontradiction"
      },
      "premises": [],
      "conclusion": "¬(P ∧ ¬P)",
      "explanation": {
        "pt": "Uma fórmula e sua negação não são conjuntamente verdadeiras na semântica clássica.",
        "en": "A formula and its negation are not jointly true under classical semantics."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "explosion",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Eliminação da contradição",
        "en": "Contradiction elimination"
      },
      "premises": [
        "P",
        "¬P"
      ],
      "conclusion": "Q",
      "explanation": {
        "pt": "Premissas conjuntamente impossíveis implicam qualquer conclusão na lógica clássica.",
        "en": "Jointly impossible premises entail any conclusion in classical logic."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme. Isso não demonstra a verdade das premissas nem vale para toda lógica paraconsistente.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly. This establishes neither the truth of the premises nor a principle of every paraconsistent logic."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "reiteration",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Reiteração",
        "en": "Reiteration"
      },
      "premises": [
        "P"
      ],
      "conclusion": "P",
      "explanation": {
        "pt": "Uma afirmação disponível pode ser reutilizada.",
        "en": "An available statement may be reused."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "identity-conditional",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Identidade condicional",
        "en": "Conditional identity"
      },
      "premises": [],
      "conclusion": "P → P",
      "explanation": {
        "pt": "Assuma P e conclua a própria P; depois descarregue a hipótese.",
        "en": "Assume P and conclude P itself; then discharge the assumption."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "conditional-introduction",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Introdução da condicional",
        "en": "Conditional introduction"
      },
      "premises": [
        "Q"
      ],
      "conclusion": "P → Q",
      "explanation": {
        "pt": "Neste exemplo, Q já está disponível sob a hipótese adicional P.",
        "en": "In this example, Q is already available under the additional assumption P."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme. A regra geral descarrega a hipótese P de uma subprova que terminou em Q; não basta escrever a hipótese como premissa permanente.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly. The general rule discharges assumption P from a subproof ending in Q; merely listing the assumption as a permanent premise is insufficient."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "negation-introduction",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Introdução da negação",
        "en": "Negation introduction"
      },
      "premises": [
        "P → Q",
        "P → ¬Q"
      ],
      "conclusion": "¬P",
      "explanation": {
        "pt": "Assumir P produziria Q e ¬Q; descarregue P e conclua ¬P.",
        "en": "Assuming P would produce Q and ¬Q; discharge P and conclude ¬P."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme. As duas condicionais representam obrigações de uma mesma subprova sob P.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly. The two conditionals encode obligations within the same subproof under P."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "reductio",
      "mode": "propositional",
      "category": "proof-methods",
      "title": {
        "pt": "Redução ao absurdo clássica",
        "en": "Classical reductio"
      },
      "premises": [
        "¬P → Q",
        "¬P → ¬Q"
      ],
      "conclusion": "P",
      "explanation": {
        "pt": "A hipótese ¬P conduz à contradição; descarregue-a.",
        "en": "Assumption ¬P leads to a contradiction; discharge it."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme. A passagem final de ¬¬P para P usa um princípio clássico.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly. The final passage from ¬¬P to P uses a classical principle."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "iff-introduction",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Introdução da bicondicional",
        "en": "Biconditional introduction"
      },
      "premises": [
        "P → Q",
        "Q → P"
      ],
      "conclusion": "P ↔ Q",
      "explanation": {
        "pt": "Duas implicações em sentidos opostos estabelecem a bicondicional.",
        "en": "Implications in opposite directions establish the biconditional."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "iff-elimination",
      "mode": "propositional",
      "category": "inference",
      "title": {
        "pt": "Eliminação da bicondicional",
        "en": "Biconditional elimination"
      },
      "premises": [
        "P ↔ Q"
      ],
      "conclusion": "P → Q",
      "explanation": {
        "pt": "Extraia uma direção da relação bicondicional.",
        "en": "Extract one direction of a biconditional relation."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "xor-definition",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Disjunção exclusiva",
        "en": "Exclusive disjunction"
      },
      "premises": [],
      "conclusion": "(P ⊕ Q) ↔ ((P ∨ Q) ∧ ¬(P ∧ Q))",
      "explanation": {
        "pt": "Exatamente uma das alternativas deve ser verdadeira.",
        "en": "Exactly one alternative must be true."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch5.html"
    },
    {
      "id": "nand-definition",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "NAND: negação conjunta",
        "en": "NAND: not both"
      },
      "premises": [],
      "conclusion": "(P ↑ Q) ↔ ¬(P ∧ Q)",
      "explanation": {
        "pt": "O operador NAND nega a conjunção.",
        "en": "The NAND operator negates conjunction."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch46.html"
    },
    {
      "id": "nor-definition",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "NOR: nenhuma alternativa",
        "en": "NOR: neither alternative"
      },
      "premises": [],
      "conclusion": "(P ↓ Q) ↔ ¬(P ∨ Q)",
      "explanation": {
        "pt": "O operador NOR nega a disjunção inclusiva.",
        "en": "The NOR operator negates inclusive disjunction."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch46.html"
    },
    {
      "id": "truth-conjunction",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Elemento neutro de ∧",
        "en": "Identity element of ∧"
      },
      "premises": [],
      "conclusion": "(P ∧ ⊤) ↔ P",
      "explanation": {
        "pt": "Acrescentar uma verdade lógica por conjunção preserva P.",
        "en": "Conjoining a logical truth preserves P."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "false-disjunction",
      "mode": "propositional",
      "category": "equivalence",
      "title": {
        "pt": "Elemento neutro de ∨",
        "en": "Identity element of ∨"
      },
      "premises": [],
      "conclusion": "(P ∨ ⊥) ↔ P",
      "explanation": {
        "pt": "Acrescentar uma alternativa impossível preserva P.",
        "en": "Adding an impossible alternative preserves P."
      },
      "conditions": {
        "pt": "Lógica proposicional clássica. P, Q, R e S representam fórmulas; substitua cada letra de modo uniforme.",
        "en": "Classical propositional logic. P, Q, R and S stand for formulas; replace each letter uniformly."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "all-elimination",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Eliminação do universal",
        "en": "Universal elimination"
      },
      "premises": [
        "∀x P(x)"
      ],
      "conclusion": "P(a)",
      "explanation": {
        "pt": "Uma afirmação sobre todo objeto vale para o objeto nomeado a.",
        "en": "A statement about every object holds of the object named a."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. O termo substituído deve ser livre para x na fórmula; evite captura.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. The substituted term must be free for x in the formula; avoid capture."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch36.html"
    },
    {
      "id": "some-introduction",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Introdução do existencial",
        "en": "Existential introduction"
      },
      "premises": [
        "P(a)"
      ],
      "conclusion": "∃x P(x)",
      "explanation": {
        "pt": "Um objeto que satisfaz P fornece uma testemunha de existência.",
        "en": "An object satisfying P provides an existential witness."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. Generalize apenas ocorrências escolhidas sem capturar variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. Generalize only chosen occurrences without capturing variables."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch36.html"
    },
    {
      "id": "all-implication-transfer",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Generalização de uma aplicação universal",
        "en": "Universal implication transfer"
      },
      "premises": [
        "∀x (P(x) → Q(x))",
        "∀x P(x)"
      ],
      "conclusion": "∀x Q(x)",
      "explanation": {
        "pt": "Aplique ambas as universais a um objeto arbitrário e generalize Q.",
        "en": "Apply both universals to an arbitrary object and generalize Q."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. Na introdução de ∀, o parâmetro deve ser arbitrário e não ocorrer nas hipóteses não descarregadas.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. For ∀ introduction, the parameter must be arbitrary and absent from undischarged assumptions."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch36.html"
    },
    {
      "id": "some-implication-transfer",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Transporte de uma testemunha existencial",
        "en": "Existential witness transfer"
      },
      "premises": [
        "∀x (P(x) → Q(x))",
        "∃x P(x)"
      ],
      "conclusion": "∃x Q(x)",
      "explanation": {
        "pt": "A testemunha de P também satisfaz Q.",
        "en": "The witness for P also satisfies Q."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. Ao eliminar ∃, use um parâmetro novo, ausente da conclusão e das demais hipóteses abertas.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. For ∃ elimination, use a fresh parameter absent from the conclusion and other open assumptions."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch36.html"
    },
    {
      "id": "all-contraposition",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Contraposição sob universal",
        "en": "Contraposition under a universal"
      },
      "premises": [
        "∀x (P(x) → Q(x))"
      ],
      "conclusion": "∀x (¬Q(x) → ¬P(x))",
      "explanation": {
        "pt": "A contraposição vale separadamente para cada objeto.",
        "en": "Contraposition applies separately to each object."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "not-all",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Negação do universal",
        "en": "Negated universal"
      },
      "premises": [],
      "conclusion": "¬∀x P(x) ↔ ∃x ¬P(x)",
      "explanation": {
        "pt": "A universal falha exatamente quando existe uma exceção.",
        "en": "The universal fails exactly when a counterinstance exists."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch38.html"
    },
    {
      "id": "not-some",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Negação do existencial",
        "en": "Negated existential"
      },
      "premises": [],
      "conclusion": "¬∃x P(x) ↔ ∀x ¬P(x)",
      "explanation": {
        "pt": "Não haver testemunha de P equivale a todos falharem em P.",
        "en": "Having no witness for P means that every object fails P."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch38.html"
    },
    {
      "id": "all-conjunction",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Universal e conjunção",
        "en": "Universal and conjunction"
      },
      "premises": [],
      "conclusion": "∀x (P(x) ∧ Q(x)) ↔ (∀x P(x) ∧ ∀x Q(x))",
      "explanation": {
        "pt": "A mesma exigência universal pode ser conferida componente a componente.",
        "en": "The universal requirement can be checked component by component."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "some-disjunction",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Existencial e disjunção",
        "en": "Existential and disjunction"
      },
      "premises": [],
      "conclusion": "∃x (P(x) ∨ Q(x)) ↔ (∃x P(x) ∨ ∃x Q(x))",
      "explanation": {
        "pt": "Uma testemunha serve para pelo menos uma das alternativas.",
        "en": "A witness satisfies at least one alternative."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "some-conjunction-one-way",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Separar propriedades da mesma testemunha",
        "en": "Separate properties of one witness"
      },
      "premises": [
        "∃x (P(x) ∧ Q(x))"
      ],
      "conclusion": "∃x P(x) ∧ ∃x Q(x)",
      "explanation": {
        "pt": "Uma testemunha comum garante as duas existências.",
        "en": "A shared witness guarantees both existentials."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. A recíproca é inválida: as duas existências podem ter testemunhas diferentes.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. The converse is invalid: the two existentials may have different witnesses."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "all-disjunction-one-way",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Unir alternativas universais",
        "en": "Combine universal alternatives"
      },
      "premises": [
        "∀x P(x) ∨ ∀x Q(x)"
      ],
      "conclusion": "∀x (P(x) ∨ Q(x))",
      "explanation": {
        "pt": "Se uma propriedade vale para todos, a alternativa vale para todos.",
        "en": "If one property holds of everyone, the alternative holds of everyone."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. A recíproca é inválida: objetos diferentes podem satisfazer alternativas diferentes.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. The converse is invalid: different objects may satisfy different alternatives."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "all-commutation",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Comutação de universais",
        "en": "Commutation of universals"
      },
      "premises": [],
      "conclusion": "∀x ∀y R(x,y) ↔ ∀y ∀x R(x,y)",
      "explanation": {
        "pt": "Dois universais sucessivos podem trocar de ordem.",
        "en": "Two successive universals may exchange order."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "some-commutation",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Comutação de existenciais",
        "en": "Commutation of existentials"
      },
      "premises": [],
      "conclusion": "∃x ∃y R(x,y) ↔ ∃y ∃x R(x,y)",
      "explanation": {
        "pt": "Dois existenciais sucessivos podem trocar de ordem.",
        "en": "Two successive existentials may exchange order."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "witness-independence",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Testemunha independente do segundo objeto",
        "en": "Witness independent of the second object"
      },
      "premises": [
        "∃x ∀y R(x,y)"
      ],
      "conclusion": "∀y ∃x R(x,y)",
      "explanation": {
        "pt": "Uma testemunha que serve para todos serve para cada um.",
        "en": "A witness working for everyone works for each individual."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. A recíproca é inválida: em ∀y∃x, a testemunha pode depender de y.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. The converse is invalid: in ∀y∃x, the witness may depend on y."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "all-to-existence",
      "mode": "first-order",
      "category": "quantifiers",
      "title": {
        "pt": "Universal em domínio não vazio",
        "en": "Universal in a nonempty domain"
      },
      "premises": [
        "∀x P(x)"
      ],
      "conclusion": "∃x P(x)",
      "explanation": {
        "pt": "Como o domínio tem algum objeto, a propriedade universal tem uma testemunha.",
        "en": "Because the domain contains an object, a universal property has a witness."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. Exige domínio não vazio. Não confunda com ∀x(S(x)→P(x)), que não afirma que S exista.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. Requires a nonempty domain. Do not confuse it with ∀x(S(x)→P(x)), which does not assert that S exists."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "all-conditional-move",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Mover quantificador do antecedente",
        "en": "Move a quantifier from the antecedent"
      },
      "premises": [],
      "conclusion": "∀x (P(x) → Q) ↔ (∃x P(x) → Q)",
      "explanation": {
        "pt": "A condicional universal só exige Q quando há algum P.",
        "en": "The universal conditional requires Q only when some P exists."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. x não pode ocorrer livre em Q; Q é uma fórmula sem dependência de x.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. x must not occur free in Q; Q is a formula independent of x."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "all-consequent-move",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Mover universal do consequente",
        "en": "Move a universal from the consequent"
      },
      "premises": [],
      "conclusion": "(Q → ∀x P(x)) ↔ ∀x (Q → P(x))",
      "explanation": {
        "pt": "Q pode ficar fora do alcance de um quantificador do qual não depende.",
        "en": "Q may stay outside the scope of a quantifier it does not depend on."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. x não pode ocorrer livre em Q.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. x must not occur free in Q."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "some-conjunction-move",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Mover existencial pela conjunção",
        "en": "Move an existential across conjunction"
      },
      "premises": [],
      "conclusion": "∃x (P(x) ∧ Q) ↔ (∃x P(x) ∧ Q)",
      "explanation": {
        "pt": "A condição independente Q pode ser conferida fora do existencial.",
        "en": "The independent condition Q may be checked outside the existential."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. x não pode ocorrer livre em Q.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. x must not occur free in Q."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "all-disjunction-move",
      "mode": "first-order",
      "category": "equivalence",
      "title": {
        "pt": "Mover universal pela disjunção",
        "en": "Move a universal across disjunction"
      },
      "premises": [],
      "conclusion": "∀x (P(x) ∨ Q) ↔ (∀x P(x) ∨ Q)",
      "explanation": {
        "pt": "A alternativa independente Q pode ficar fora do universal.",
        "en": "The independent alternative Q may stay outside the universal."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. x não pode ocorrer livre em Q.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. x must not occur free in Q."
      },
      "source": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "identity-reflexivity",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Reflexividade da identidade",
        "en": "Identity reflexivity"
      },
      "premises": [],
      "conclusion": "a = a",
      "explanation": {
        "pt": "Todo objeto é idêntico a si próprio.",
        "en": "Every object is identical to itself."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "identity-symmetry",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Simetria da identidade",
        "en": "Identity symmetry"
      },
      "premises": [
        "a = b"
      ],
      "conclusion": "b = a",
      "explanation": {
        "pt": "A direção de uma igualdade pode ser invertida.",
        "en": "An equality may be reversed."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "identity-transitivity",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Transitividade da identidade",
        "en": "Identity transitivity"
      },
      "premises": [],
      "conclusion": "∀x ∀y ∀z ((x = y ∧ y = z) → x = z)",
      "explanation": {
        "pt": "Identidades sucessivas preservam o mesmo objeto.",
        "en": "Successive identities preserve the same object."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "identity-substitution",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Substituição por identidade",
        "en": "Identity substitution"
      },
      "premises": [
        "a = b",
        "P(a)"
      ],
      "conclusion": "P(b)",
      "explanation": {
        "pt": "Nomes do mesmo objeto podem ser trocados em um predicado extensional.",
        "en": "Names for the same object may be exchanged in an extensional predicate."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. Substitua ocorrências de termos sem captura; isto não autoriza troca irrestrita em citações ou contextos intensionais.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. Replace term occurrences without capture; this does not authorize unrestricted replacement in quotation or intensional contexts."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "identity-relation-substitution",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Substituição parcial em uma relação",
        "en": "Partial substitution in a relation"
      },
      "premises": [
        "a = b",
        "R(a,a)"
      ],
      "conclusion": "R(b,a)",
      "explanation": {
        "pt": "Pode-se substituir uma ocorrência do nome, preservando a outra.",
        "en": "One occurrence of the name may be replaced while retaining the other."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "some-elimination",
      "mode": "first-order",
      "category": "proof-methods",
      "title": {
        "pt": "Eliminação do existencial",
        "en": "Existential elimination"
      },
      "premises": [
        "∃x P(x)",
        "∀x (P(x) → Q)"
      ],
      "conclusion": "Q",
      "explanation": {
        "pt": "A conclusão independente da testemunha segue de qualquer testemunha possível.",
        "en": "The witness-independent conclusion follows from any possible witness."
      },
      "conditions": {
        "pt": "LPO clássica: domínio não vazio; nomes denotam objetos. Substituições devem evitar captura de variáveis. x não ocorre livre em Q. Na regra por subprova, o parâmetro da testemunha é novo e não aparece em Q nem nas demais hipóteses abertas.",
        "en": "Classical FOL: nonempty domain; names denote objects. Substitutions must avoid variable capture. x is not free in Q. In the subproof rule, the witness parameter is fresh and absent from Q and other open assumptions."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch36.html"
    },
    {
      "id": "syllogism-aaa1",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Barbara · AAA-1",
        "en": "Barbara · AAA-1"
      },
      "premises": [
        "A(M,P)",
        "A(S,M)"
      ],
      "conclusion": "A(S,P)",
      "explanation": {
        "pt": "Figura 1: a primeira premissa relaciona M e P; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 1: the first premise relates M and P; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eae1",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Celarent · EAE-1",
        "en": "Celarent · EAE-1"
      },
      "premises": [
        "E(M,P)",
        "A(S,M)"
      ],
      "conclusion": "E(S,P)",
      "explanation": {
        "pt": "Figura 1: a primeira premissa relaciona M e P; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 1: the first premise relates M and P; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aii1",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Darii · AII-1",
        "en": "Darii · AII-1"
      },
      "premises": [
        "A(M,P)",
        "I(S,M)"
      ],
      "conclusion": "I(S,P)",
      "explanation": {
        "pt": "Figura 1: a primeira premissa relaciona M e P; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 1: the first premise relates M and P; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eio1",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Ferio · EIO-1",
        "en": "Ferio · EIO-1"
      },
      "premises": [
        "E(M,P)",
        "I(S,M)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 1: a primeira premissa relaciona M e P; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 1: the first premise relates M and P; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eae2",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Cesare · EAE-2",
        "en": "Cesare · EAE-2"
      },
      "premises": [
        "E(P,M)",
        "A(S,M)"
      ],
      "conclusion": "E(S,P)",
      "explanation": {
        "pt": "Figura 2: a primeira premissa relaciona P e M; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 2: the first premise relates P and M; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aee2",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Camestres · AEE-2",
        "en": "Camestres · AEE-2"
      },
      "premises": [
        "A(P,M)",
        "E(S,M)"
      ],
      "conclusion": "E(S,P)",
      "explanation": {
        "pt": "Figura 2: a primeira premissa relaciona P e M; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 2: the first premise relates P and M; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eio2",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Festino · EIO-2",
        "en": "Festino · EIO-2"
      },
      "premises": [
        "E(P,M)",
        "I(S,M)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 2: a primeira premissa relaciona P e M; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 2: the first premise relates P and M; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aoo2",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Baroco · AOO-2",
        "en": "Baroco · AOO-2"
      },
      "premises": [
        "A(P,M)",
        "O(S,M)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 2: a primeira premissa relaciona P e M; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 2: the first premise relates P and M; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-iai3",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Disamis · IAI-3",
        "en": "Disamis · IAI-3"
      },
      "premises": [
        "I(M,P)",
        "A(M,S)"
      ],
      "conclusion": "I(S,P)",
      "explanation": {
        "pt": "Figura 3: a primeira premissa relaciona M e P; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 3: the first premise relates M and P; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aii3",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Datisi · AII-3",
        "en": "Datisi · AII-3"
      },
      "premises": [
        "A(M,P)",
        "I(M,S)"
      ],
      "conclusion": "I(S,P)",
      "explanation": {
        "pt": "Figura 3: a primeira premissa relaciona M e P; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 3: the first premise relates M and P; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-oao3",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Bocardo · OAO-3",
        "en": "Bocardo · OAO-3"
      },
      "premises": [
        "O(M,P)",
        "A(M,S)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 3: a primeira premissa relaciona M e P; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 3: the first premise relates M and P; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eio3",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Ferison · EIO-3",
        "en": "Ferison · EIO-3"
      },
      "premises": [
        "E(M,P)",
        "I(M,S)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 3: a primeira premissa relaciona M e P; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 3: the first premise relates M and P; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aee4",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Camenes · AEE-4",
        "en": "Camenes · AEE-4"
      },
      "premises": [
        "A(P,M)",
        "E(M,S)"
      ],
      "conclusion": "E(S,P)",
      "explanation": {
        "pt": "Figura 4: a primeira premissa relaciona P e M; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 4: the first premise relates P and M; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-iai4",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Dimaris · IAI-4",
        "en": "Dimaris · IAI-4"
      },
      "premises": [
        "I(P,M)",
        "A(M,S)"
      ],
      "conclusion": "I(S,P)",
      "explanation": {
        "pt": "Figura 4: a primeira premissa relaciona P e M; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 4: the first premise relates P and M; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eio4",
      "mode": "syllogistic",
      "category": "syllogisms",
      "title": {
        "pt": "Fresison · EIO-4",
        "en": "Fresison · EIO-4"
      },
      "premises": [
        "E(P,M)",
        "I(M,S)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 4: a primeira premissa relaciona P e M; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 4: the first premise relates P and M; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Classes podem ser vazias. A forma é válida sem acrescentar existência.",
        "en": "Classes may be empty. This form is valid without adding existence."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aai1",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Barbari · AAI-1",
        "en": "Barbari · AAI-1"
      },
      "premises": [
        "A(M,P)",
        "A(S,M)",
        "I(S,S)"
      ],
      "conclusion": "I(S,P)",
      "explanation": {
        "pt": "Figura 1: a primeira premissa relaciona M e P; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 1: the first premise relates M and P; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que S não seja vazio: I(S,S) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty S: I(S,S) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eao1",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Celaront · EAO-1",
        "en": "Celaront · EAO-1"
      },
      "premises": [
        "E(M,P)",
        "A(S,M)",
        "I(S,S)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 1: a primeira premissa relaciona M e P; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 1: the first premise relates M and P; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que S não seja vazio: I(S,S) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty S: I(S,S) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eao2",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Cesaro · EAO-2",
        "en": "Cesaro · EAO-2"
      },
      "premises": [
        "E(P,M)",
        "A(S,M)",
        "I(S,S)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 2: a primeira premissa relaciona P e M; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 2: the first premise relates P and M; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que S não seja vazio: I(S,S) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty S: I(S,S) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aeo2",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Camestros · AEO-2",
        "en": "Camestros · AEO-2"
      },
      "premises": [
        "A(P,M)",
        "E(S,M)",
        "I(S,S)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 2: a primeira premissa relaciona P e M; a segunda, S e M. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 2: the first premise relates P and M; the second relates S and M. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que S não seja vazio: I(S,S) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty S: I(S,S) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aai3",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Darapti · AAI-3",
        "en": "Darapti · AAI-3"
      },
      "premises": [
        "A(M,P)",
        "A(M,S)",
        "I(M,M)"
      ],
      "conclusion": "I(S,P)",
      "explanation": {
        "pt": "Figura 3: a primeira premissa relaciona M e P; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 3: the first premise relates M and P; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que M não seja vazio: I(M,M) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty M: I(M,M) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eao3",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Felapton · EAO-3",
        "en": "Felapton · EAO-3"
      },
      "premises": [
        "E(M,P)",
        "A(M,S)",
        "I(M,M)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 3: a primeira premissa relaciona M e P; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 3: the first premise relates M and P; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que M não seja vazio: I(M,M) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty M: I(M,M) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aai4",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Bramantip · AAI-4",
        "en": "Bramantip · AAI-4"
      },
      "premises": [
        "A(P,M)",
        "A(M,S)",
        "I(P,P)"
      ],
      "conclusion": "I(S,P)",
      "explanation": {
        "pt": "Figura 4: a primeira premissa relaciona P e M; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 4: the first premise relates P and M; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que P não seja vazio: I(P,P) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty P: I(P,P) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-eao4",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Fesapo · EAO-4",
        "en": "Fesapo · EAO-4"
      },
      "premises": [
        "E(P,M)",
        "A(M,S)",
        "I(M,M)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 4: a primeira premissa relaciona P e M; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 4: the first premise relates P and M; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que M não seja vazio: I(M,M) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty M: I(M,M) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "syllogism-aeo4",
      "mode": "syllogistic",
      "category": "existential-import",
      "title": {
        "pt": "Camenop · AEO-4",
        "en": "Camenop · AEO-4"
      },
      "premises": [
        "A(P,M)",
        "E(M,S)",
        "I(S,S)"
      ],
      "conclusion": "O(S,P)",
      "explanation": {
        "pt": "Figura 4: a primeira premissa relaciona P e M; a segunda, M e S. S é o sujeito da conclusão, P é seu predicado, e M é o termo médio.",
        "en": "Figure 4: the first premise relates P and M; the second relates M and S. S is the conclusion subject, P its predicate, and M the middle term."
      },
      "conditions": {
        "pt": "Exige que S não seja vazio: I(S,S) é uma premissa explícita. Sem ela, esta forma é inválida na semântica moderna.",
        "en": "Requires nonempty S: I(S,S) is an explicit premise. Without it, this form is invalid in modern semantics."
      },
      "source": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "unique-existence",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Unicidade implica existência",
        "en": "Uniqueness entails existence"
      },
      "premises": [
        "∃!x P(x)"
      ],
      "conclusion": "∃x P(x)",
      "explanation": {
        "pt": "Se exatamente um objeto tem P, então pelo menos um objeto tem P.",
        "en": "If exactly one object has P, then at least one object has P."
      },
      "conditions": {
        "pt": "∃! significa existência de exatamente um objeto. A identidade é a igualdade do domínio; nomes diferentes não pressupõem objetos diferentes.",
        "en": "∃! means exactly one object exists. Identity is domain equality; different names do not imply different objects."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "unique-witnesses",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Identidade das testemunhas únicas",
        "en": "Identity of unique witnesses"
      },
      "premises": [
        "∃!x P(x)",
        "P(a)",
        "P(b)"
      ],
      "conclusion": "a=b",
      "explanation": {
        "pt": "Duas constantes que satisfazem uma propriedade com testemunha única designam o mesmo objeto.",
        "en": "Two constants satisfying a property with a unique witness denote the same object."
      },
      "conditions": {
        "pt": "∃! significa existência de exatamente um objeto. A identidade é a igualdade do domínio; nomes diferentes não pressupõem objetos diferentes.",
        "en": "∃! means exactly one object exists. Identity is domain equality; different names do not imply different objects."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "unique-characterization",
      "mode": "first-order",
      "category": "identity",
      "title": {
        "pt": "Caracterização de uma testemunha única",
        "en": "Characterizing a unique witness"
      },
      "premises": [
        "P(a)",
        "∀x(P(x) → x=a)"
      ],
      "conclusion": "∃!x P(x)",
      "explanation": {
        "pt": "a satisfaz P e todos os objetos que satisfazem P são idênticos a a.",
        "en": "a satisfies P and every object satisfying P is identical to a."
      },
      "conditions": {
        "pt": "∃! significa existência de exatamente um objeto. A identidade é a igualdade do domínio; nomes diferentes não pressupõem objetos diferentes.",
        "en": "∃! means exactly one object exists. Identity is domain equality; different names do not imply different objects."
      },
      "source": "https://forallx.openlogicproject.org/html/Ch39.html"
    }
  ],
  "references": [
    {
      "id": "tfl-basic",
      "title": "forall x: Calgary — Basic rules for TFL",
      "url": "https://forallx.openlogicproject.org/html/Ch17.html"
    },
    {
      "id": "tfl-additional",
      "title": "forall x: Calgary — Additional rules for TFL",
      "url": "https://forallx.openlogicproject.org/html/Ch19.html"
    },
    {
      "id": "tfl-derived",
      "title": "forall x: Calgary — Derived rules",
      "url": "https://forallx.openlogicproject.org/html/Ch21.html"
    },
    {
      "id": "fol-basic",
      "title": "forall x: Calgary — Basic rules for FOL",
      "url": "https://forallx.openlogicproject.org/html/Ch36.html"
    },
    {
      "id": "fol-negation",
      "title": "forall x: Calgary — Conversion of quantifiers",
      "url": "https://forallx.openlogicproject.org/html/Ch38.html"
    },
    {
      "id": "identity",
      "title": "forall x: Calgary — Rules for identity",
      "url": "https://forallx.openlogicproject.org/html/Ch39.html"
    },
    {
      "id": "syllogistic",
      "title": "Logic in Action — Syllogistic Reasoning",
      "url": "https://www.logicinaction.org/docs/ch3.pdf"
    },
    {
      "id": "predicate",
      "title": "Logic in Action — The World According to Predicate Logic",
      "url": "https://logicinaction.org/docs/ch4.pdf"
    },
    {
      "id": "completeness",
      "title": "forall x: Calgary — Soundness and completeness",
      "url": "https://forallx.openlogicproject.org/html/Ch22.html"
    },
    {
      "id": "proof-search",
      "title": "Logic and Mechanized Reasoning — Proof Systems for First-Order Logic",
      "url": "https://avigad.github.io/lamr/proof_systems_for_first_order_logic.html"
    },
    {
      "id": "truth-connectives",
      "title": "forall x: Calgary — Connectives",
      "url": "https://forallx.openlogicproject.org/html/Ch5.html"
    },
    {
      "id": "functional-completeness",
      "title": "forall x: Calgary — Functional completeness",
      "url": "https://forallx.openlogicproject.org/html/Ch46.html"
    },
    {
      "id": "propositional-decision",
      "title": "Logic and Mechanized Reasoning — Decision Procedures for Propositional Logic",
      "url": "https://avigad.github.io/lamr/decision_procedures_for_propositional_logic.html"
    }
  ],
  "scope": {
    "pt": "97 formas: regras e esquemas clássicos, 15 modos silogísticos modernos e 9 condicionais com existência explícita. Uma lista finita não contém todos os argumentos válidos: cada esquema representa infinitas instâncias.",
    "en": "97 forms: classical rules and schemas, 15 modern syllogistic moods and 9 conditional forms with explicit existence. No finite list contains every valid argument: each schema represents infinitely many instances."
  }
};
  scope.LPArgumentGuide=guide;
  if(typeof module!=='undefined')module.exports=guide;
})(globalThis);
