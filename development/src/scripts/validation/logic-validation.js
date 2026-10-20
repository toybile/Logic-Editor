let logicEnabled = false,
  logicTimer = null,
  logicRevision = 0;
const logicArea = document.createElement("div");
logicArea.className = "hy-logic-area";
logicArea.hidden = !ui.preview;
document.querySelector(".hy-argument-panel").after(logicArea);
const logicPanel = document.createElement("section");
logicPanel.className = "hy-logic-panel";
logicPanel.id = "logic-panel";
logicPanel.hidden = true;
logicPanel.setAttribute(
  "aria-label",
  document.documentElement.lang === "en" ? "Logic validation" : "Validação lógica",
);
logicPanel.setAttribute("aria-live", "polite");
const logicButton = document.createElement("button");
logicButton.type = "button";
logicButton.className = "hy-button hy-logic-button";
logicButton.classList.add("hy-icon-button");
logicButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6Z"/><path d="m8 12 3 3 5-6"/></svg>';
logicButton.setAttribute("aria-expanded", "false");
logicButton.setAttribute("aria-controls", "logic-panel");
const logicFooter = document.createElement("div");
logicFooter.className = "hy-logic-footer";
logicFooter.append(logicButton);
logicArea.append(logicFooter, logicPanel);
const logicWords = {
  pt: {
    button: "Validar lógica",
    working: "Verificando o argumento…",
    valid: "Argumento válido",
    invalid: "Argumento inválido",
    missingConclusion: "Marque pelo menos uma linha como conclusão.",
    limit:
      "Validação limitada a 16 proposições diferentes, 200 fórmulas e 1.024 elementos por fórmula.",
    errors: "Corrija estas fórmulas antes de validar:",
    line: "Linha",
    column: "coluna",
    conclusion: "Conclusão",
    yes: "decorre das premissas",
    no: "não decorre das premissas",
    counter: "Contraexemplo — todas as premissas são verdadeiras e esta conclusão é falsa:",
    true: "V",
    false: "F",
    inconsistent:
      "As premissas são inconsistentes: nenhuma interpretação torna todas verdadeiras. A consequência é válida por vacuidade na lógica clássica.",
    noPremises: "Sem premissas, a conclusão precisa ser verdadeira em todas as interpretações.",
    guide:
      "Lógica proposicional clássica. Nomes como Chove e RuaMolhada representam proposições independentes e diferenciam maiúsculas de minúsculas. Linhas sem tipo e linhas vazias são ignoradas. Ordem: negação; conjunção/NAND; disjunção/XOR/NOR; condicional; bicondicional. Condicionais agrupam à direita; os demais, à esquerda. Use parênteses para explicitar a leitura.",
    help: "Como é verificado",
    messages: {
      operand: "Falta uma proposição ou fórmula.",
      operator: "Falta um conectivo entre as expressões.",
      delimiter: "Confira os delimitadores. Esperado: ",
      unsupported: "Símbolo fora da lógica proposicional suportada: ",
      limit: "Fórmula excede o limite da verificação.",
    },
  },
  en: {
    button: "Validate logic",
    working: "Checking the argument…",
    valid: "Valid argument",
    invalid: "Invalid argument",
    missingConclusion: "Mark at least one row as a conclusion.",
    limit: "Limited to 16 distinct propositions, 200 formulas and 1,024 tokens per formula.",
    errors: "Correct these formulas before checking validity:",
    line: "Line",
    column: "column",
    conclusion: "Conclusion",
    yes: "follows from the premises",
    no: "does not follow from the premises",
    counter: "Counterexample — all premises are true and this conclusion is false:",
    true: "T",
    false: "F",
    inconsistent:
      "The premises are inconsistent: no interpretation makes them all true. The consequence holds vacuously in classical logic.",
    noPremises: "Without premises, the conclusion must be true in every interpretation.",
    guide:
      "Classical propositional logic. Names such as Rain and WetStreet represent independent propositions and are case-sensitive. Untyped and empty rows are ignored. Precedence: negation; AND/NAND; OR/XOR/NOR; conditional; biconditional. Conditionals associate to the right; the others to the left. Use parentheses to make grouping explicit.",
    help: "How it works",
    messages: {
      operand: "A proposition or formula is missing.",
      operator: "A connective is missing between expressions.",
      delimiter: "Check the delimiters. Expected: ",
      unsupported: "Symbol outside the supported propositional logic: ",
      limit: "Formula exceeds the verification limit.",
    },
  },
};
function logicText() {
  return logicWords[document.documentElement.lang === "en" ? "en" : "pt"];
}
function scheduleLogicValidation() {
  logicRevision++;
  clearTimeout(logicTimer);
  if (logicEnabled) logicTimer = setTimeout(updateLogicValidation, 250);
}
function logicParagraph(text) {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
}
// Extensions consume the same result/snapshot instead of wrapping or rerunning validation.
const logicViews = new Map();
function registerLogicView(name, view) {
  if (logicViews.has(name)) throw new Error("Duplicate validation view: " + name);
  logicViews.set(name, view);
}
async function updateLogicValidation() {
  if (!logicEnabled) return;
  const revision = ++logicRevision,
    words = logicText();
  logicButton.setAttribute("aria-label", words.button);
  logicPanel.textContent = words.working;
  if (typeof currentLogicMode === "function" && currentLogicMode() !== 'propositional') {
    updateExtendedLogicValidation(currentLogicMode());
    return;
  }
  const snapshot = rows.map((row) => ({ ...row }));
  const result = await LPLogic.validate(snapshot, {
    cancelled: () => revision !== logicRevision || !logicEnabled,
    yieldTask: () => new Promise((resolve) => setTimeout(resolve, 0)),
  });
  if (revision !== logicRevision || result.status === "cancelled" || !logicEnabled) return;
  const heading = document.createElement("strong");
  heading.textContent = words[result.status] || words.errors;
  logicPanel.replaceChildren();
  if (!["valid", "invalid"].includes(result.status)) logicPanel.append(heading);
  logicPanel.dataset.state = result.status;
  if (result.status === "errors")
    for (const error of result.errors) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hy-logic-result";
      button.textContent =
        words.line +
        " " +
        (error.index + 1) +
        " · " +
        words.column +
        " " +
        error.column +
        ": " +
        (words.messages[error.code] || words.messages.limit) +
        error.token;
      button.onclick = () => {
          if (typeof validationDialog !== "undefined" && validationDialog.open)
            validationReturnFocus = rowElements.get(rows[error.index])?.querySelector(".hy-block,.hy-continuous-field");
        if (typeof validationDialog !== "undefined" && validationDialog.open) validationDialog.close();
        setSection("editor", true);
          const input = rowElements.get(rows[error.index])?.querySelector(".hy-block,.hy-continuous-field");
        input?.focus();
      };
      logicPanel.append(button);
    }
  if (["valid", "invalid"].includes(result.status)) {
    if (!result.satisfiable) logicPanel.append(logicParagraph(words.inconsistent));
    else if (!result.premiseCount) logicPanel.append(logicParagraph(words.noPremises));
    for (const conclusion of result.conclusions) {
      const section = document.createElement("div");
      section.className = "hy-logic-result";
      section.dataset.valid = String(conclusion.valid);
      section.append(
        logicParagraph(
          words.conclusion +
            " · " +
            words.line +
            " " +
            (conclusion.index + 1) +
            ": " +
            (conclusion.valid ? words.yes : words.no),
        ),
      );
      if (conclusion.counterexample) {
        section.append(logicParagraph(words.counter));
        const values = document.createElement("div");
        values.className = "hy-logic-values";
        for (const atom of result.atoms) {
          const item = document.createElement("span");
          item.textContent =
            atom + " = " + (conclusion.counterexample[atom] ? words.true : words.false);
          values.append(item);
        }
        section.append(values);
      }
      logicPanel.append(section);
    }
  }
  const help = document.createElement("details"),
    summary = document.createElement("summary");
  summary.textContent = words.help;
  help.append(summary, logicParagraph(words.guide));
  logicPanel.append(help);
  const prepared = ["valid", "invalid"].includes(result.status) ? LPLogic.prepare(snapshot) : null;
  for (const view of logicViews.values()) {
    if (revision !== logicRevision || !logicEnabled) return;
    await view({ result, snapshot, prepared, revision });
  }
}
logicButton.setAttribute("aria-label", logicText().button);
logicButton.onclick = () => {
  openLogicValidation();
};
let logicLanguage = document.documentElement.lang;
new MutationObserver(() => {
  if (logicLanguage === document.documentElement.lang) return;
  logicLanguage = document.documentElement.lang;
  logicButton.setAttribute("aria-label", logicText().button);
  scheduleLogicValidation();
}).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
