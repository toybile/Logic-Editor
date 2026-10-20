// Symbol construction, insertion and popover rendering each keep one owner.
const symbolBehavior = {};
const symbolGroups = [
  [
    "Conectivos proposicionais",
    [
      ["¬", "Negação", ["¬", "∼", "~"], "Notações de negação clássica."],
      ["∧", "Conjunção", ["∧", "&", "•"]],
      ["∨", "Disjunção", ["∨", "+"], "O sinal + segue a convenção da álgebra booleana."],
      [
        "→",
        "Condicional",
        ["→", "⊃"],
        "O símbolo ⊃ também representa inclusão em conjuntos; aqui indica o condicional material.",
      ],
      ["↔", "Bicondicional", ["↔", "≡"], "Aqui, ≡ representa o bicondicional material."],
      ["⊕", "Disjunção exclusiva", ["⊕", "⊻"]],
      ["⊤", "Verdade"],
      ["⊥", "Falsidade"],
      ["↑", "Negação da conjunção", ["↑", "⊼", "|"], "Aqui, | representa a negação da conjunção."],
      ["↓", "Negação da disjunção", ["↓", "⊽"]],
    ],
  ],
  [
    "Implicação e equivalência",
    [
      ["⇒", "Implicação"],
      ["⇔", "Equivalência"],
      ["←", "Condicional inverso"],
      ["⇐", "Implicação inversa"],
      ["↛", "Negação do condicional"],
      ["↮", "Negação do bicondicional"],
      ["⇏", "Não implicação"],
      ["⇎", "Não equivalência"],
    ],
  ],
  [
    "Quantificadores e igualdade",
    [
      ["∀", "Quantificador universal"],
      ["∃", "Quantificador existencial"],
      ["∃!", "Existência única"],
      ["∄", "Não existência", ["∄", "¬∃"]],
      ["=", "Igualdade"],
      ["≠", "Desigualdade"],
      ["≡", "Equivalência"],
      ["≢", "Não equivalência"],
    ],
  ],
  [
    "Operadores modais",
    [
      ["□", "Necessidade"],
      ["◇", "Possibilidade"],
    ],
  ],
  [
    "Dedução e consequência",
    [
      ["⊢", "Derivabilidade"],
      ["⊬", "Não derivabilidade"],
      ["⊨", "Consequência semântica"],
      ["⊭", "Não consequência semântica"],
      ["∴", "Portanto"],
      ["∵", "Porque"],
      ["∎", "Fim da demonstração"],
    ],
  ],
  [
    "Conjuntos: operações",
    [
      ["∪", "União"],
      ["∩", "Interseção"],
      ["∖", "Diferença de conjuntos"],
      ["∁", "Complemento"],
      ["∆", "Diferença simétrica", ["∆", "⊖"]],
      ["⊎", "União de multiconjuntos"],
      ["∅", "Conjunto vazio"],
      ["𝒫", "Conjunto das partes"],
      ["×", "Produto cartesiano"],
    ],
  ],
  [
    "Conjuntos: relações",
    [
      ["∈", "Pertinência", ["∈", "∊"]],
      ["∉", "Não pertinência"],
      ["∋", "Contém como elemento", ["∋", "∍"]],
      ["∌", "Não contém como elemento"],
      ["⊆", "Inclusão"],
      ["⊈", "Não inclusão"],
      ["⊂", "Inclusão estrita"],
      ["⊄", "Não inclusão estrita"],
      ["⊇", "Inclusão inversa"],
      ["⊉", "Não inclusão inversa"],
      ["⊃", "Inclusão estrita inversa"],
      ["⊅", "Não inclusão estrita inversa"],
      ["⊊", "Inclusão com desigualdade explícita"],
      ["⊋", "Inclusão inversa com desigualdade explícita"],
    ],
  ],
  [
    "Operadores sobre famílias",
    [
      ["⋀", "Conjunção sobre uma família"],
      ["⋁", "Disjunção sobre uma família"],
      ["⋃", "União sobre uma família"],
      ["⋂", "Interseção sobre uma família"],
      ["⨄", "União de multiconjuntos sobre uma família"],
    ],
  ],
  [
    "Comparação e definição",
    [
      ["<", "Menor que"],
      [">", "Maior que"],
      ["≤", "Menor ou igual"],
      ["≥", "Maior ou igual"],
      ["≮", "Não menor que"],
      ["≯", "Não maior que"],
      ["≰", "Não menor ou igual"],
      ["≱", "Não maior ou igual"],
      ["≈", "Aproximação"],
      ["≉", "Não aproximação"],
      ["≔", "Definição à direita"],
      ["≕", "Definição à esquerda"],
      ["≝", "Igualdade por definição"],
      ["≜", "Igualdade por definição (triângulo)"],
    ],
  ],
  [
    "Delimitadores e pontuação",
    [
      ["(", "Abrir parênteses"],
      [")", "Fechar parênteses"],
      ["[", "Abrir colchetes"],
      ["]", "Fechar colchetes"],
      ["{", "Abrir chaves"],
      ["}", "Fechar chaves"],
      ["⌈", "Abrir teto"],
      ["⌉", "Fechar teto"],
      ["⌊", "Abrir piso"],
      ["⌋", "Fechar piso"],
      ["…", "Reticências"],
      ["⋯", "Reticências centrais"],
      ["⋮", "Reticências verticais"],
      [":", "Dois-pontos"],
    ],
  ],
];
function insertNotation(symbol) {
  if (!active || active.readOnly || !active.isConnected) return;
  root.dispatchEvent(new Event("lp-record-line-change"));
  if (blockFields.has(active)) {
    if (active.readOnly) return;
    setSection("editor", true);
    blockFields.get(active).insert(symbol);
    symbolBehavior.afterInsert?.(symbol);
    return;
  }
  if (!active || active.readOnly) return;
  setSection("editor", true);
  const start = active.selectionStart,
    end = active.selectionEnd;
  active.setRangeText(symbol, start, end, "end");
  active.focus();
  active.dispatchEvent(new Event("input"));
  symbolBehavior.afterInsert?.(symbol);
}
const notationPanel = document.createElement("div");
notationPanel.id = "notation-panel";
notationPanel.className = "hy-notation-panel";
notationPanel.setAttribute("popover", "manual");
notationPanel.setAttribute("role", "dialog");
notationPanel.setAttribute("aria-label", "Todas as notações");
document.querySelector("#lp-hybrid").append(notationPanel);
let notationAnchor = null,
  notationOpenTimer = null,
  notationCloseTimer = null,
  notationVisible = false;
function closeNotations() {
  clearTimeout(notationOpenTimer);
  clearTimeout(notationCloseTimer);
  if (notationVisible) {
    if (notationPanel.hidePopover) notationPanel.hidePopover();
    else notationPanel.hidden = true;
  }
  notationAnchor?.querySelector(".hy-symbol")?.setAttribute("aria-expanded", "false");
  notationVisible = false;
  notationAnchor = null;
}
function placeNotations() {
  if (!notationVisible || !notationAnchor) return;
  const rect = notationAnchor.getBoundingClientRect(),
    panel = notationPanel.getBoundingClientRect();
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - panel.width - 8));
  const top =
    rect.bottom + 8 + panel.height <= window.innerHeight - 8
      ? rect.bottom + 8
      : Math.max(8, rect.top - panel.height - 8);
  notationPanel.style.left = left + "px";
  notationPanel.style.top = top + "px";
}
function showNotations(cell, entry) {
  clearTimeout(notationOpenTimer);
  clearTimeout(notationCloseTimer);
  if (notationVisible && notationAnchor === cell) return;
  closeNotations();
  notationAnchor = cell;
  const [symbol, name, forms = [symbol], note] = entry;
  const heading = document.createElement("strong");
  heading.textContent = name;
  const label = document.createElement("p");
  label.className = "hy-notation-label";
  label.textContent = "Todas as notações";
  const choices = document.createElement("div");
  choices.className = "hy-notation-choices";
  for (const form of forms) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hy-button hy-notation-choice";
    button.textContent = form;
    button.setAttribute("aria-label", name + " · " + form);
    button.onmousedown = (event) => event.preventDefault();
    button.onclick = () => {
      insertNotation(form);
      closeNotations();
    };
    choices.append(button);
  }
  const help = document.createElement("button");
  help.type = "button";
  help.className = "hy-button hy-symbol-help";
  help.setAttribute(
    "aria-label",
    ui.language === "en" ? "Help about this symbol" : "Ajuda sobre este símbolo",
  );
  help.title = help.getAttribute("aria-label");
  help.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4M12 17h.01"/></svg>';
  help.onclick = () => LPSymbolHelp.open(cell, entry);
  const head = document.createElement("div");
  head.className = "hy-notation-head";
  head.append(heading, help);
  const description = document.createElement("p");
  description.className = "hy-notation-description";
  const info = LPSymbolHelp.data[symbol];
  description.textContent = info ? (ui.language === "en" ? info.en : info.pt) : "";
  notationPanel.replaceChildren(head, description, label, choices);
  if (typeof LPHints !== "undefined") LPHints.decorateSymbols(notationPanel, symbol);
  if (note) {
    const context = document.createElement("p");
    context.className = "hy-notation-context";
    context.textContent = note;
    notationPanel.append(context);
  }
  if (notationPanel.showPopover) notationPanel.showPopover();
  else notationPanel.hidden = false;
  notationVisible = true;
  cell.querySelector(".hy-symbol")?.setAttribute("aria-expanded", "true");
  symbolBehavior.afterShow?.(cell, entry);
  placeNotations();
}
function delayNotations(cell, entry) {
  if (!hoverHintsEnabled()) return;
  clearTimeout(notationOpenTimer);
  clearTimeout(notationCloseTimer);
  notationOpenTimer = setTimeout(() => showNotations(cell, entry), getHoverDelay());
}
function leaveNotations() {
  clearTimeout(notationOpenTimer);
  clearTimeout(notationCloseTimer);
  notationCloseTimer = setTimeout(closeNotations, 220);
}
notationPanel.addEventListener("pointerenter", () => {
  clearTimeout(notationCloseTimer);
});
notationPanel.addEventListener("pointerleave", leaveNotations);
notationPanel.addEventListener("focusin", () => clearTimeout(notationCloseTimer));
notationPanel.addEventListener("focusout", (event) => {
  if (
    !notationPanel.contains(event.relatedTarget) &&
    !notationAnchor?.contains(event.relatedTarget)
  )
    leaveNotations();
});
document.addEventListener("pointerdown", (event) => {
  if (
    notationVisible &&
    !notationPanel.contains(event.target) &&
    !notationAnchor?.contains(event.target)
  )
    closeNotations();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && notationVisible) {
    const toggle = notationAnchor?.querySelector(".hy-symbol"),
      keyboard = notationPanel.contains(document.activeElement);
    closeNotations();
    if (keyboard) toggle?.focus();
  }
});
window.addEventListener("resize", closeNotations);
window.addEventListener("scroll", closeNotations, { capture: true });
if (!notationPanel.showPopover) {
  notationPanel.removeAttribute("popover");
  notationPanel.hidden = true;
}
function symbolCell(entry) {
  const [symbol, name, forms = [symbol]] = entry;
  const cell = document.createElement("div");
  cell.className = "hy-symbol-cell";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "hy-button hy-symbol";
  button.textContent = symbol;
  button.setAttribute("aria-label", name);
  let touchTimer = null,
    touchStart = null,
    touchOpened = false;
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "notation-panel");
  button.setAttribute("aria-expanded", "false");
  button.onmousedown = (event) => event.preventDefault();
  button.onclick = () => {
    if (touchOpened) {
      touchOpened = false;
      return;
    }
    clearTimeout(notationOpenTimer);
    insertNotation(symbol);
    closeNotations();
  };
  cell.append(button);
  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    clearTimeout(touchTimer);
    touchOpened = false;
    touchStart = { x: event.clientX, y: event.clientY };
    touchTimer = setTimeout(() => {
      touchOpened = true;
      showNotations(cell, entry);
    }, getHoldDelay());
  });
  button.addEventListener("pointermove", (event) => {
    if (touchStart && Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y) > 6)
      clearTimeout(touchTimer);
  });
  for (const kind of ["pointerup", "pointercancel", "pointerleave"])
    button.addEventListener(kind, () => {
      clearTimeout(touchTimer);
      touchStart = null;
    });
  cell.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") delayNotations(cell, entry);
  });
  cell.addEventListener("pointerleave", leaveNotations);
  cell.addEventListener("focusin", () => clearTimeout(notationCloseTimer));
  cell.addEventListener("focusout", (event) => {
    if (!cell.contains(event.relatedTarget) && !notationPanel.contains(event.relatedTarget))
      leaveNotations();
  });
  cell.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      showNotations(cell, entry);
      notationPanel.querySelector(".hy-notation-choice")?.focus();
    }
  });
  symbolBehavior.enhance?.(cell, entry);
  return cell;
}
const commonSymbols = ["¬", "∧", "∨", "→", "↔", "⊕", "(", ")"].map((symbol) =>
  symbolGroups.flatMap(([, entries]) => entries).find((entry) => entry[0] === symbol),
);
for (const [groupName, symbols] of [["Mais comuns", commonSymbols], ...symbolGroups]) {
  const group = document.createElement("details");
  group.open = groupName === "Mais comuns";
  const heading = document.createElement("summary");
  heading.textContent = groupName;
  const toolbar = document.createElement("div");
  toolbar.className = "hy-symbols";
  symbols.forEach((entry) => toolbar.append(symbolCell(entry)));
  group.append(heading, toolbar);
  group.addEventListener("toggle", () => {
    if (!group.open && notationAnchor && group.contains(notationAnchor)) closeNotations();
  });
  document.querySelector("#symbols").append(group);
}
