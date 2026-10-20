(() => {
  const english = () => document.documentElement.lang === "en",
    text = interfaceText;
  function el(tag, value, cls) {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = value;
    if (cls) node.className = cls;
    return node;
  }
  function action(value, fn) {
    const b = el("button", value, "hy-button");
    b.type = "button";
    b.onclick = fn;
    return b;
  }
  function dialog(title) {
    const d = el("dialog", undefined, "hy-feature-dialog hy-advanced-dialog hy-beta-dialog"),
      head = el("header", undefined, "hy-beta-heading"),
      heading = el("h3", title),
      badge = el("span", "beta", "hy-beta-tag"),
      close = action("×", () => d.close());
    heading.id = "hy-beta-title-" + crypto.randomUUID();
    d.setAttribute("aria-labelledby", heading.id);
    close.classList.add("hy-beta-close");
    close.setAttribute("aria-label", text("Fechar", "Close"));
    head.append(heading, badge, close);
    d.append(head);
    root.append(d);
    d.onclose = () => d.remove();
    return d;
  }
  function betaActions(form, ...buttons) {
    const footer = el("div", undefined, "hy-beta-actions");
    footer.append(...buttons);
    form.append(footer);
  }
  const savedIndicator = el("span", "", "hy-save-indicator");
  savedIndicator.setAttribute("role", "status");
  root.querySelector(".hy-title").append(savedIndicator);
  let saveTimer;
  workspaceEvents.addEventListener("saved", ({ detail: { saved } }) => {
    clearTimeout(saveTimer);
    savedIndicator.textContent = text("Salvando…", "Saving…");
    saveTimer = setTimeout(() => {
      savedIndicator.textContent = saved
        ? text("Salvo neste navegador", "Saved in this browser")
        : text("Não foi possível salvar neste navegador", "Could not save in this browser");
      savedIndicator.dataset.saved = String(saved);
    }, 200);
  });
  // Descriptions belong to individual documents and are included in exported workspaces.
  function currentDocument() {
    return argumentWorkspace.documents.find((d) => d.id === argumentWorkspace.activeId);
  }
  function explainTree(node, values, target) {
    const value = LPLogic.evaluate(node, values),
      truth = (v) => (v ? text("V", "T") : "F");
    if (node.op === "atom") return node.value;
    if (node.op === "constant") return node.value ? "⊤" : "⊥";
    const a = explainTree(node.left, values, target),
      av = LPLogic.evaluate(node.left, values);
    if (node.op === "not") {
      const expression = "¬ " + a;
      target.append(el("p", expression + ": ¬ " + truth(av) + " = " + truth(value)));
      return "(" + expression + ")";
    }
    const b = explainTree(node.right, values, target),
      bv = LPLogic.evaluate(node.right, values),
      operator = {
        and: "∧",
        or: "∨",
        implies: "→",
        reverse: "←",
        iff: "↔",
        xor: "⊕",
        nand: "↑",
        nor: "↓",
        notImplies: "↛",
      }[node.op],
      expression = a + " " + operator + " " + b;
    target.append(
      el(
        "p",
        expression + ": " + truth(av) + " " + operator + " " + truth(bv) + " = " + truth(value),
      ),
    );
    return "(" + expression + ")";
  }
  function descriptions() {
    const doc = currentDocument();
    return doc.descriptions && typeof doc.descriptions === "object" && !Array.isArray(doc.descriptions)
      ? doc.descriptions
      : Object.create(null);
  }
  function descriptionNames(formula) {
    const names = new Set();
    const mode = typeof currentLogicMode === 'function' ? currentLogicMode() : 'propositional';
    try {
      if (mode === 'first-order') return new Set(LPFirstOrder.parse(formula).symbols.map(s => s.name));
      if (mode === 'syllogistic') { const result=LPCategorical.parse(formula); return new Set([result.subject,result.predicate]); }

      LPLogic.parse(formula).atoms.forEach((a) => names.add(a));
    } catch {
          // Descriptions remain available while editing incomplete formulas and
          // formulas outside the propositional validator's supported language.
      const identifier = /[\p{L}_][\p{L}\p{M}\p{N}_′']*/gu;
      const bound = new Set(
        [...formula.matchAll(/[∀∃]\s*!?\s*([\p{L}_][\p{L}\p{M}\p{N}_′']*)/gu)]
          .map((match) => match[1]),
      );
      for (const match of formula.matchAll(identifier)) {
        if (!bound.has(match[0])) names.add(match[0]);
      }
    }
    return names;
  }
  const bar = el("div", undefined, "hy-advanced-tools");
  root.querySelector(".hy-logic-footer").append(bar);
  bar.append(
    action(text("Proposições", "Propositions"), () => {
      const d = dialog(text("Descrição das proposições", "Proposition descriptions")),
        form = el("form"),
        names = new Set();
      const documentAtOpen = currentDocument();
      const mode = typeof currentLogicMode === 'function' ? currentLogicMode() : 'propositional';
      const signature = mode === 'first-order' ? LPFirstOrder.analyze(rows) : null;
      const metadata = new Map((signature?.symbols || []).map(s => [s.name,s]));
      let domain;
      if (mode === 'first-order') {
        d.querySelector('h3').textContent=text('Vocabulário de primeira ordem','First-order vocabulary');
        const label=el('label',text('Domínio de discurso','Domain of discourse'));
        domain=el('input');domain.maxLength=1000;domain.value=documentAtOpen.domainDescription || '';
        domain.placeholder=text('Ex.: pessoas','E.g. people');label.append(domain);form.append(label);
      } else if (mode === 'syllogistic') d.querySelector('h3').textContent=text('Descrição dos termos','Term descriptions');

      for (const row of rows) {
        if (row.role !== "blank") descriptionNames(row.text).forEach(name => names.add(name));
      }
      const existing = descriptions();
      Object.keys(existing).forEach((a) => names.add(a));
      if (!names.size)
        d.append(
          el(
            "p",
            text(
              "Digite proposições no argumento primeiro.",
              "Enter propositions in the argument first.",
            ),
          ),
        );
      d.dataset.feature = "descriptions";
      d.append(el("p", text(
        "Registre o significado dos símbolos. As descrições são próprias deste argumento e não alteram a validação lógica.",
        "Record symbol meanings. Descriptions belong to this argument and do not change logical validation."
      ), "hy-description-note"));
      if(mode === 'first-order') d.append(el('p',text(
        'Predicados começam em maiúscula; constantes e funções, em minúscula. Variáveis ligadas não recebem descrição de símbolo. A anotação do domínio explica a intenção, mas não define uma estrutura matemática nem comprova premissas.',
        'Predicates start uppercase; constants and functions start lowercase. Bound variables do not receive symbol descriptions. The domain annotation explains intent, but does not define a mathematical structure or establish premises.'
      ),'hy-description-note'));
      const inputs = [];
      for (const atom of [...names].sort()) {
        const label = el("label", atom),
          input = el("input");
        label.dataset.userContent = "";
        const symbol=metadata.get(atom);
        if(symbol) {
          const kind=symbol.kind==='predicate'?text('predicado','predicate'):symbol.kind==='function'?text('função','function'):text('constante','constant');
          const detail=el('span',kind+(symbol.kind==='constant'?'':' · '+text('aridade ','arity ')+symbol.arity),'hy-symbol-metadata');
          label.append(detail);
        }

        input.value = typeof existing[atom] === "string" ? existing[atom] : "";
        input.maxLength = 1000;
        input.autocomplete = "off";
        input.placeholder = symbol?.kind === 'constant' ? text('Ex.: Ana','E.g. Alice')
          : symbol?.kind === 'function' ? text('Ex.: mãe de x','E.g. mother of x')
          : symbol?.kind === 'predicate' ? text('Ex.: x ama y','E.g. x loves y')
          : mode === 'syllogistic' ? text('Ex.: estudantes','E.g. students')
          : text("Ex.: Está chovendo", "E.g. It is raining");
        label.append(input);
        form.append(label);
        inputs.push([atom, input]);
      }
      const cancel = action(text("Cancelar", "Cancel"), () => d.close()),
        save = el("button", text("Salvar", "Save"), "hy-button");
      save.type = "submit";
      save.classList.add("hy-beta-primary");
      betaActions(form, cancel, save);
      form.onsubmit = (e) => {
        e.preventDefault();
        const values = Object.create(null);
        inputs.forEach(([atom, input]) => {
          if (input.value.trim()) values[atom] = input.value.trim();
        });
        documentAtOpen.descriptions = values;
        if (domain) documentAtOpen.domainDescription = domain.value.trim();
        saveArguments();
        refreshDescriptions();
        d.close();
      };
      d.append(form);
      d.showModal();
    }),
  );
  function refreshDescriptions() {
    const mode=typeof currentLogicMode === 'function' ? currentLogicMode() : 'propositional';
    const label=mode==='first-order' ? text('Vocabulário de primeira ordem','First-order vocabulary')
      : mode==='syllogistic' ? text('Descrição dos termos','Term descriptions')
      : text('Descrição das proposições','Proposition descriptions');
    proposition.setAttribute('aria-label',label);
    proposition.dataset.hintText=label;
    const values = descriptions();
    const hint = names => [...names]
      .filter(name => Object.hasOwn(values, name) && values[name])
      .map(name => name + " — " + values[name]).join("\n");
    root.querySelectorAll(".hy-block").forEach(input => {
      input.dataset.hintText = Object.hasOwn(values, input.value)
        ? input.value + " — " + values[input.value]
        : text("Espaço: próximo bloco", "Space: next block");
    });
    root.querySelectorAll(".hy-continuous-field").forEach(input => {
      const content = hint(descriptionNames(input.value));
      if (content) input.dataset.descriptionHint = content;
      else delete input.dataset.descriptionHint;
    });
    const names = new Set(rows.filter(row => row.role !== "blank")
      .flatMap(row => [...descriptionNames(row.text)]));
    const summary = hint(names);
    if (summary) preview.dataset.descriptionHint = summary;
    else delete preview.dataset.descriptionHint;
  }
  new MutationObserver(refreshDescriptions).observe(root.querySelector("#rows"), {
    childList: true,
    subtree: true,
  });
  workspaceEvents.addEventListener("saved", refreshDescriptions);
  root.querySelector("#rows").addEventListener("input", refreshDescriptions);
  bar.append(
    action(text("Comparar fórmulas", "Compare formulas"), () => {
      const d = dialog(text("Equivalência entre fórmulas", "Formula equivalence")),
        form = el("form"),
        a = el("input"),
        b = el("input"),
        result = el("div");
      result.setAttribute("role", "status");
      form.classList.add("hy-beta-formulas");
      for (const [name, input] of [
        [text("Primeira fórmula", "First formula"), a],
        [text("Segunda fórmula", "Second formula"), b],
      ]) {
        const label = el("label", name);
        input.required = true;
        label.append(input);
        form.append(label);
      }
      const compare = el("button", text("Comparar", "Compare"), "hy-button");
      compare.type = "submit";
      compare.classList.add("hy-beta-primary");
      betaActions(
        form,
        action(text("Fechar", "Close"), () => d.close()),
        compare,
      );
      let revision = 0;
      form.onsubmit = async (e) => {
        e.preventDefault();
        const run = ++revision;
        compare.disabled = true;
        result.textContent = text("Verificando…", "Checking…");
        try {
          const data = await LPLogic.validate(
            [{ text: "(" + a.value + ") ↔ (" + b.value + ")", role: "conclusion" }],
            {
              cancelled: () => run !== revision || !d.open,
              yieldTask: () => new Promise((r) => setTimeout(r, 0)),
            },
          );
          if (run !== revision || !d.open) return;
          if (data.status === "valid")
            result.textContent = text(
              "As fórmulas são equivalentes em todas as interpretações.",
              "The formulas are equivalent in every interpretation.",
            );
          else if (data.status === "invalid") {
            const values = data.conclusions[0].counterexample;
            result.textContent =
              text(
                "As fórmulas diferem nesta interpretação: ",
                "The formulas differ in this interpretation: ",
              ) +
              data.atoms
                .map((atom) => atom + " = " + (values[atom] ? text("V", "T") : "F"))
                .join(", ");
          } else
            result.textContent = text(
              "Confira a sintaxe das fórmulas e o limite de 16 proposições.",
              "Check formula syntax and the 16-proposition limit.",
            );
        } finally {
          compare.disabled = false;
        }
      };
      d.append(form, result);
      d.showModal();
    }),
  );

  registerLogicView(
    "explanations-and-redundancy",
    async ({ result, snapshot, prepared, revision }) => {
      if (
        revision !== logicRevision ||
        !logicEnabled ||
        !["valid", "invalid"].includes(logicPanel.dataset.state)
      )
        return;
      if (prepared.status !== "ready") return;
      const invalid = [...logicPanel.querySelectorAll(".hy-logic-result[data-valid=false]")];
      let index = 0;
      for (const conclusion of result.conclusions || []) {
        if (!conclusion.counterexample) continue;
        const section = invalid[index++];
        if (!section) continue;
        const explanation = el("details"),
          summary = el(
            "summary",
            text("Por que este é um contraexemplo?", "Why is this a counterexample?"),
          );
        explanation.append(summary);
        const values = conclusion.counterexample;
        for (const premise of prepared.premises)
          explanation.append(
            el(
              "p",
              snapshot[premise.index].text +
                " = " +
                (LPLogic.evaluate(premise.tree, values) ? text("V", "T") : "F"),
            ),
          );
        explanation.append(el("p", "∴ " + snapshot[conclusion.index].text + " = F"));
        explanation.append(
          el(
            "p",
            text(
              "Nesta interpretação, todas as premissas são verdadeiras, mas esta conclusão é falsa. Portanto, as premissas não garantem a conclusão.",
              "In this interpretation, every premise is true but this conclusion is false. Therefore, the premises do not guarantee this conclusion.",
            ),
          ),
        );
        const steps = el("details"),
          stepsTitle = el("summary", text("Avaliação dos conectivos", "Connective evaluation"));
        steps.append(stepsTitle);
        for (const formula of [
          ...prepared.premises,
          prepared.conclusions.find((c) => c.index === conclusion.index),
        ])
          explainTree(formula.tree, values, steps);
        explanation.append(steps);
        section.append(explanation);
      }
      const redundancy = el("details"),
        summary = el(
          "summary",
          text("Analisar premissas redundantes", "Analyze redundant premises"),
        ),
        output = el("div"),
        run = action(text("Analisar", "Analyze"), async () => {
          run.disabled = true;
          output.textContent = text("Analisando…", "Analyzing…");
          const found = [];
          for (const premise of prepared.premises) {
            if (revision !== logicRevision || !logicEnabled) return;
            const remaining = prepared.premises
              .filter((p) => p.index !== premise.index)
              .map((p) => ({ ...snapshot[p.index] }));
            remaining.push({ text: snapshot[premise.index].text, role: "conclusion" });
            const data = await LPLogic.validate(remaining, {
              cancelled: () => revision !== logicRevision || !logicEnabled,
              yieldTask: () => new Promise((r) => setTimeout(r, 0)),
            });
            if (data.status === "valid") found.push(premise);
          }
          if (revision !== logicRevision || !logicEnabled) return;
          output.replaceChildren();
          output.append(
            el(
              "p",
              text(
                "Uma premissa é redundante aqui quando decorre das outras. Cada resultado considera a retirada de uma única premissa; não retire todas simultaneamente.",
                "A premise is redundant here when it follows from the others. Each result considers removing only one premise; do not remove all of them together.",
              ),
            ),
          );
          if (!found.length)
            output.append(
              el(
                "p",
                text("Nenhuma premissa redundante encontrada.", "No redundant premises found."),
              ),
            );
          for (const premise of found)
            output.append(
              el(
                "p",
                text("Linha ", "Line ") + (premise.index + 1) + ": " + snapshot[premise.index].text,
              ),
            );
          run.disabled = false;
        });
      redundancy.append(summary, run, output);
      logicPanel.append(redundancy);
    },
  );
  const proposition = bar.querySelector("button");
  proposition.classList.add("hy-proposition-descriptions", "hy-icon-button");
  proposition.setAttribute(
    "aria-label",
    text("Descrição das proposições", "Proposition descriptions"),
  );

  proposition.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4Z M8 8h8 M8 12h8 M8 16h4"/></svg>';
  root.querySelector(".hy-editor .hy-section-head").append(proposition);
  logicPanel.append(bar);

  registerLogicView("comparison-tools", () => {
    logicPanel.append(bar);
  });
  let lastLanguage = document.documentElement.lang;
  new MutationObserver(() => {
    if (lastLanguage === document.documentElement.lang) return;
    lastLanguage = document.documentElement.lang;
    bar
      .querySelectorAll("button")
      .forEach((b) => (b.textContent = text("Comparar fórmulas", "Compare formulas")));
    proposition.setAttribute(
      "aria-label",
      text("Descrição das proposições", "Proposition descriptions"),
    );
  
    refreshDescriptions();
    saveArguments();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  saveArguments();
  refreshDescriptions();
})();
