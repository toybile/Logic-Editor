(() => {
  const en = () => document.documentElement.lang === "en",
    label = interfaceText;
  const tools = document.createElement("div");
  tools.className = "hy-workspace-tools";
  const fileMenu = document.createElement("details"),
    fileSummary = document.createElement("summary");
  fileMenu.className = "hy-file-menu";
  fileSummary.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>';
  fileSummary.setAttribute("aria-label", label("Arquivo", "File"));
  fileMenu.append(fileSummary, tools);
  root.querySelector(".hy-title").append(fileMenu);
  tools.addEventListener("click", (event) => {
    if (event.target.closest("button")) fileMenu.open = false;
  });
  document.addEventListener("pointerdown", (event) => {
    if (!fileMenu.contains(event.target)) fileMenu.open = false;
  });
  fileMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      fileMenu.open = false;
      fileSummary.focus();
    }
  });
  function button(pt, english, action) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hy-button";
    b.dataset.pt = pt;
    b.dataset.en = english;
    b.textContent = label(pt, english);
    b.onclick = action;
    tools.append(b);
    return b;
  }
  function message(text) {
    const dialog = document.createElement("dialog");
    dialog.className = "hy-feature-dialog hy-message-dialog";
    dialog.setAttribute("aria-label",label("Aviso","Notice"));
    const p = document.createElement("p"),
      ok = document.createElement("button");
    p.id="workspace-message-"+crypto.randomUUID();dialog.setAttribute("aria-describedby",p.id);
    p.textContent = text;
    ok.className = "hy-button";
    ok.textContent = "OK";
    ok.onclick = () => dialog.close();
    const actions=document.createElement("div");actions.className="hy-dialog-actions";actions.append(ok);
    dialog.append(p, actions);
    root.append(dialog);
    dialog.onclose = () => {
      dialog.querySelectorAll("[popover]").forEach((p) => {
        if (p.matches(":popover-open")) p.hidePopover();
      });
      dialog.remove();
    };
    dialog.showModal();
  }
  button("Interpretar texto", "Interpret text", () => root.dispatchEvent(new Event("lp-open-argument-text")));
  button("Salvar todos os argumentos", "Save all arguments", () => {
    saveArguments();
    const data = {
      format: "lp-workspace",
      version: 1,
      activeId: argumentWorkspace.activeId,
      documents: argumentWorkspace.documents.map((d) => ({
        id: d.id,
        customName: d.customName || "",
        numbered: d.numbered,
        logicMode: d.logicMode || 'propositional',
        domainDescription: d.domainDescription || '',
        descriptions: d.descriptions || {},
        rows: d.rows,
      })),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "argumentos.lp.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  button("Salvar argumento atual", "Save current argument", () => {
    saveArguments();
    const doc = argumentWorkspace.documents.find((d) => d.id === argumentWorkspace.activeId);
    const data = {
      format: "lp-workspace",
      version: 1,
      activeId: doc.id,
      documents: [
        {
          id: doc.id,
          customName: doc.customName || "",
          numbered: doc.numbered,
          logicMode: doc.logicMode || 'propositional',
          domainDescription: doc.domainDescription || '',
          descriptions: doc.descriptions || {},
          rows: doc.rows,
        },
      ],
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "argumento.lp.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const file = document.createElement("input");
  file.type = "file";
  file.accept = ".json,application/json";
  file.hidden = true;
  tools.append(file);
  button("Importar", "Import", () => file.click());
  function addDocument(name, items, numbered = true) {
    const id = crypto.randomUUID();
    argumentWorkspace.documents.push({ id, customName: name, name, rows: items, numbered });
    return id;
  }
  function previewImport(docs) {
    return new Promise((resolve) => {
      const d = document.createElement("dialog");
      d.className = "hy-feature-dialog hy-import-preview";
      const heading = document.createElement("h3");
      heading.textContent = label(
        "Escolha os argumentos para importar",
        "Choose arguments to import",
      );
      heading.id='import-preview-title';d.setAttribute('aria-labelledby',heading.id);
      const header=document.createElement('header'),list=document.createElement('div');header.className='hy-import-heading';list.className='hy-import-list';
      const close=document.createElement('button');close.type='button';close.className='hy-button';close.setAttribute('aria-label',label('Fechar','Close'));LPDialogChrome.close(close);close.onclick=()=>d.close();header.append(heading,close);d.append(header,list);
      const selected = [];
      docs.forEach((doc, index) => {
        const card = document.createElement("label"),
          check = document.createElement("input"),
          content = document.createElement("div"),
          title = document.createElement("strong"),
          preview = document.createElement("p");
        check.type = "checkbox";
        check.checked = true;
        title.textContent = doc.name || label("Argumento ", "Argument ") + (index + 1);
        preview.textContent = doc.items
          .slice(0, 4)
          .map((r) => (r.role === "conclusion" ? "∴ " : "") + r.text)
          .join(" · ");
        content.append(title, preview);
        card.append(check, content);
        list.append(card);
        selected.push(check);
      });
      const footer = document.createElement("div"),
        cancel = document.createElement("button"),
        confirm = document.createElement("button");
      cancel.className = confirm.className = "hy-button";
      cancel.type = confirm.type = "button";
      cancel.textContent = label("Cancelar", "Cancel");
      confirm.textContent = label("Importar selecionados", "Import selected");
      let accepted = false;
      cancel.onclick = () => d.close();
      confirm.onclick = () => {
        if (!selected.some((c) => c.checked)) return;
        accepted = true;
        d.close();
      };
      confirm.classList.add("hy-import-confirm");footer.className="hy-import-actions";footer.append(cancel, confirm);
      d.append(footer);
      root.append(d);
      d.onclose = () => {
        resolve(accepted ? docs.filter((_, i) => selected[i].checked) : []);
        d.remove();
      };
      d.showModal();
    });
  }
  file.onchange = async () => {
    const chosen = file.files[0];
    file.value = "";
    if (!chosen) return;
    try {
      if (chosen.size > 5 * 1024 * 1024) throw Error();
      const data = JSON.parse(await chosen.text());
      if (
        data.format !== "lp-workspace" ||
        data.version !== 1 ||
        !Array.isArray(data.documents) ||
        !data.documents.length ||
        data.documents.length > 100
      )
        throw Error();
      let total = 0;
      const docs = data.documents.map((d) => {
        if (
          !d ||
          typeof d.customName !== "string" ||
          d.customName.length > 240 ||
          !Array.isArray(d.rows) ||
          d.rows.length > 1000
        )
          throw Error();
        const items = d.rows.map((r) => {
          if (
            !r ||
            typeof r.text !== "string" ||
            r.text.length > 10000 ||
            !["premise", "conclusion", "blank"].includes(r.role)
          )
            throw Error();
          total += r.text.length;
          if (total > 1000000) throw Error();
          return { text: r.text, role: r.role };
        });
        if(d.domainDescription !== undefined && (typeof d.domainDescription !== 'string' || d.domainDescription.length > 1000)) throw Error();
        const descriptions = Object.create(null);
        if (d.descriptions !== undefined) {
          if (
            !d.descriptions ||
            typeof d.descriptions !== "object" ||
            Array.isArray(d.descriptions) ||
            Object.keys(d.descriptions).length > 1000
          )
            throw Error();
          for (const [name, value] of Object.entries(d.descriptions)) {
            if (name.length > 240 || typeof value !== "string" || value.length > 1000)
              throw Error();
            descriptions[name] = value;
          }
        }
        return {
          name: d.customName,
          items: items.length ? items : [{ text: "", role: "premise" }],
          numbered: d.numbered !== false,
          oldId: d.id,
          domainDescription: d.domainDescription || '',
          logicMode: ['propositional','syllogistic','first-order'].includes(d.logicMode) ? d.logicMode : 'propositional',
          descriptions,
        };
      });
      const chosenDocs = await previewImport(docs);
      if (!chosenDocs.length) return;
      saveArguments();
      let selected;
      for (const doc of chosenDocs) {
        const id = addDocument(doc.name, doc.items, doc.numbered);
        argumentWorkspace.documents.find((d) => d.id === id).descriptions = doc.descriptions;
        argumentWorkspace.documents.find((d) => d.id === id).logicMode = doc.logicMode;
        argumentWorkspace.documents.find((d) => d.id === id).domainDescription = doc.domainDescription;
        if (!selected || doc.oldId === data.activeId) selected = id;
      }
      showArgument(selected);
      saveArguments();
    } catch {
      message(
        label(
          "Arquivo inválido ou acima dos limites de importação. Seus argumentos foram preservados.",
          "Invalid file or import limits exceeded. Your arguments were preserved.",
        ),
      );
    }
  };
  const examples = [
    [
      "Modus ponens",
      [
        ["A → B", "premise"],
        ["A", "premise"],
        ["B", "conclusion"],
      ],
    ],
    [
      "Modus tollens",
      [
        ["A → B", "premise"],
        ["¬ B", "premise"],
        ["¬ A", "conclusion"],
      ],
    ],
    [
      "Silogismo disjuntivo",
      [
        ["A ∨ B", "premise"],
        ["¬ A", "premise"],
        ["B", "conclusion"],
      ],
    ],
    [
      "Afirmação do consequente",
      [
        ["A → B", "premise"],
        ["B", "premise"],
        ["A", "conclusion"],
      ],
    ],
    [
      "Nomes de proposições",
      [
        ["Chove → RuaMolhada", "premise"],
        ["Chove", "premise"],
        ["RuaMolhada", "conclusion"],
      ],
    ],
  ];
  const modeExamples = {
    syllogistic: [
      ['Barbara', [['A(M,P)','premise'],['A(S,M)','premise'],['A(S,P)','conclusion']]],
      ['Celarent', [['E(M,P)','premise'],['A(S,M)','premise'],['E(S,P)','conclusion']]],
      ['Darii', [['A(M,P)','premise'],['I(S,M)','premise'],['I(S,P)','conclusion']]],
      ['Ferio', [['E(M,P)','premise'],['I(S,M)','premise'],['O(S,P)','conclusion']]],
      [label('Universal sem existência','Universal without existence'), [['A(S,P)','premise'],['I(S,P)','conclusion']]],
    ],
    'first-order': [
      [label('Instanciação universal','Universal instantiation'), [['∀x P(x)','premise'],['P(a)','conclusion']]],
      [label('Predicação e condicional','Predication and conditional'), [['∀x(P(x) → Q(x))','premise'],['P(a)','premise'],['Q(a)','conclusion']]],
      [label('Generalização existencial','Existential generalization'), [['P(a)','premise'],['∃x P(x)','conclusion']]],
      [label('Relação simétrica','Symmetric relation'), [['∀x∀y(R(x,y) → R(y,x))','premise'],['R(a,b)','premise'],['R(b,a)','conclusion']]],
      [label('Substituição por identidade','Identity substitution'), [['a = b','premise'],['P(a)','premise'],['P(b)','conclusion']]],
    ],
    propositional: examples,
  };
  const modeNotes = {
    syllogistic: [
      'A(S,P): todo S é P; E(S,P): nenhum S é P; I(S,P): algum S é P; O(S,P): algum S não é P. O verificador permite termos vazios: universais não pressupõem existência. Os quatro primeiros exemplos são válidos; o último é inválido sem uma premissa de existência.',
      'A(S,P): every S is P; E(S,P): no S is P; I(S,P): some S is P; O(S,P): some S is not P. The checker permits empty terms: universals carry no existential import. The first four examples are valid; the last is invalid without an existence premise.',
    ],
    'first-order': [
      '∀ quantifica universalmente; ∃ quantifica existencialmente; P e Q são predicados unários, R é uma relação binária, a e b são constantes. Estes exemplos ilustram inferências válidas na lógica clássica com identidade. O analisador atual verifica sintaxe, aridades e variáveis livres; ainda não prova a validade.',
      '∀ is universal quantification; ∃ is existential quantification; P and Q are unary predicates, R is a binary relation, a and b are constants. These examples illustrate valid inferences in classical logic with identity. The current analyzer checks syntax, arities and free variables; it does not yet prove validity.',
    ],
  };
  const exampleHelp = [
    [
      "Modus ponens",
      "Modus ponens",
      "A → B · A · ∴ B",
      "Se A implica B e A é verdadeiro, B precisa ser verdadeiro. O condicional A → B só é falso quando A é verdadeiro e B é falso; essa combinação contrariaria a primeira premissa.",
      "If A implies B and A is true, B must be true. A → B is false only when A is true and B is false; that assignment would contradict the first premise.",
      "Exemplo: se chove, a rua fica molhada. Chove. Logo, a rua fica molhada. A validade considera as premissas como dadas, sem verificar se a rua realmente está molhada.",
      "Example: if it rains, the street gets wet. It rains. Therefore, the street gets wet. Validity takes the premises as given; it does not verify the actual street conditions.",
    ],
    [
      "Modus tollens",
      "Modus tollens",
      "A → B · ¬B · ∴ ¬A",
      "Se A implica B, mas B é falso, A não pode ser verdadeiro: isso tornaria o condicional falso. Por isso, conclui-se ¬A.",
      "If A implies B but B is false, A cannot be true: that would make the conditional false. Therefore, ¬A follows.",
      "Não confunda com negar A para concluir ¬B. B pode ser verdadeiro por outra condição, mesmo que A seja falso.",
      "Do not confuse this with denying A to conclude ¬B. B may be true under another condition even when A is false.",
    ],
    [
      "Silogismo disjuntivo",
      "Disjunctive syllogism",
      "A ∨ B · ¬A · ∴ B",
      "A ∨ B afirma que pelo menos uma das proposições é verdadeira. Ao excluir A pela premissa ¬A, B precisa ser verdadeiro para satisfazer a disjunção.",
      "A ∨ B states that at least one proposition is true. Once ¬A rules out A, B must be true to satisfy the disjunction.",
      "O símbolo ∨ é inclusivo: permite A e B verdadeiros juntos. A premissa ¬A é o que exclui essa possibilidade neste argumento.",
      "The symbol ∨ is inclusive: it permits A and B to be true together. The premise ¬A rules out that possibility in this argument.",
    ],
    [
      "Afirmação do consequente",
      "Affirming the consequent",
      "A → B · B · ∴ A",
      "Esta inferência é inválida. Saber que B é verdadeiro não estabelece A: o condicional não diz que A é a única condição em que B pode ser verdadeiro.",
      "This inference is invalid. Knowing B is true does not establish A: the conditional does not say A is the only condition under which B can be true.",
      "Contraexemplo: A = falso e B = verdadeiro. A → B e B são verdadeiros, mas A é falso. Carregue o exemplo e ative Validar lógica para ver essa atribuição.",
      "Counterexample: A = false and B = true. A → B and B are true, but A is false. Load the example and enable Validate logic to see this assignment.",
    ],
    [
      "Nomes de proposições",
      "Proposition names",
      "Chove → RuaMolhada · Chove · ∴ RuaMolhada",
      "É a mesma forma do modus ponens, usando nomes maiores no lugar de A e B. Os nomes identificam proposições; o programa não interpreta seu significado em linguagem natural.",
      "This is the same modus ponens form, using longer names instead of A and B. Names identify propositions; the program does not interpret their natural-language meaning.",
      "Chove e chove são variáveis distintas. As descrições de proposições ajudam a registrar significados, mas não entram na validação lógica.",
      "Chove and chove are different variables. Proposition descriptions help record meanings, but do not participate in logical validation.",
    ],
  ];
  function openExampleHelp(mode) {
    const page = document.createElement("dialog");
    page.className = "hy-feature-dialog hy-logic-mode-help hy-examples-help-dialog";
    page.setAttribute("aria-labelledby", "examples-help-title");
    const back = document.createElement("button");
    back.type = "button";
    back.className = "hy-button hy-icon-button";
    back.setAttribute("aria-label", label("Fechar", "Close"));
    back.title = back.getAttribute("aria-label");
    LPDialogChrome.close(back);
    back.onclick = () => page.close();
    const content = document.createElement("div");
    content.className = "hy-example-lesson-content";
    const title = document.createElement("h2");
    title.id = "examples-help-title";
    title.textContent = label("Entenda os exemplos", "Understanding the examples");
    title.tabIndex = -1;
    const intro = document.createElement("p");
    intro.textContent = label(
      "As formas abaixo pertencem à lógica proposicional clássica. ∴ indica a conclusão; ¬ significa negação, ∨ disjunção e → condicional. Uma inferência válida preserva a verdade: premissas verdadeiras não podem levar a uma conclusão falsa.",
      "These forms use classical propositional logic. ∴ marks the conclusion; ¬ means negation, ∨ disjunction, and → conditional. A valid inference preserves truth: true premises cannot lead to a false conclusion.",
    );
    if (modeNotes[mode]) intro.textContent = label(...modeNotes[mode]);
    content.append(title, intro);
    for (const [pt, en, formula, explanationPt, explanationEn, notePt, noteEn] of (mode === "propositional" ? exampleHelp : modeExamples[mode].map(([name,items]) => [name,name,items.map(([text,role]) => (role === "conclusion" ? "∴ " : "")+text).join(" · "),"","","",""]))) {
      const article = document.createElement("article"),
        heading = document.createElement("h2"),
        notation = document.createElement("p"),
        explanation = document.createElement("p"),
        note = document.createElement("p");
      heading.textContent = label(pt, en);
      notation.className = "hy-help-formula";
      notation.textContent = formula;
      explanation.textContent = label(explanationPt, explanationEn);
      note.textContent = label(notePt, noteEn);
      article.append(heading, notation);
      if (explanation.textContent) article.append(explanation);
      if (note.textContent) article.append(note);
      content.append(article);
    }
    const sources = document.createElement("footer");
    sources.append(
      document.createTextNode(label("Referências para continuar: ", "Further reading: ")),
    );
    for (const [name, url] of [
      ["forall x: Calgary", "https://forallx.openlogicproject.org/html/Ch19.html"],
      [
        "Stanford — material implication",
        "https://logic.stanford.edu/intrologic/dictionary/implication.html",
      ],
    ]) {
      const a = document.createElement("a");
      a.textContent = name;
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      sources.append(a, document.createTextNode(" · "));
    }
    content.append(sources);
    const header = document.createElement("header");
    header.append(title, back);
    page.append(header, content);
    root.append(page);
    page.onclose = () => {
      page.remove();
      openExamples(mode);
      requestAnimationFrame(() => root.querySelector(".hy-examples-help")?.focus());
    };
    page.showModal();
    title.focus({ preventScroll: true });
  }
  function openExamples(mode = currentLogicMode()) {
    const dialog = document.createElement("dialog");
    dialog.className = "hy-feature-dialog hy-examples-dialog";
    const heading = document.createElement("h3");
    heading.textContent = label("Carregar em um novo argumento", "Load as a new argument");
    heading.id="examples-title";dialog.setAttribute("aria-labelledby",heading.id);
    const help = document.createElement("button");
    help.type = "button";
    help.className = "hy-button hy-examples-help";
    help.textContent = label("Ajuda", "Help");
    help.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4M12 17h.01"/></svg><span>' +
      label("Ajuda", "Help") +
      "</span>";
    help.onclick = () => {
      dialog.close();
      openExampleHelp(mode);
    };
    const head = document.createElement("div");
    head.className = "hy-examples-heading";
    const modeButton = document.createElement('button');
    modeButton.type = 'button';modeButton.className = 'hy-analysis-mode-icon';
    const modeName = document.createElement('p');modeName.className = 'hy-analysis-mode-name';
    const identity = document.createElement('div');identity.className = 'hy-examples-identity';
    const text = document.createElement('div');text.append(heading,modeName);identity.append(modeButton,text);
    head.append(identity, help);
    const list=document.createElement("div");list.className="hy-examples-list";dialog.append(head,list);
    function drawExamples() {
    dialog.querySelectorAll('[data-example]').forEach(button => button.remove());
    modeButton.innerHTML = logicModeIcon(mode);
    const definition = logicModeDefinitions.find(([id]) => id === mode);
    modeName.textContent = label(definition[1],definition[2]);
    modeButton.setAttribute('aria-label',label('Sistema lógico: ','Logical system: ')+modeName.textContent);
    for (const [name, items] of modeExamples[mode]) {
      const b = document.createElement("button");
      b.className = "hy-button";b.dataset.example = "";
      const title = document.createElement("strong"),
        preview = document.createElement("span");
      title.textContent = name;
      preview.textContent = items
        .map(([text, role]) => (role === "conclusion" ? "∴ " : "") + text)
        .join("   ·   ");
      b.append(title, preview);
      b.onclick = () => {
        saveArguments();
        const id = addDocument(
          name,
          items.map(([text, role]) => ({ text, role })),
        );
        argumentWorkspace.documents.find(doc => doc.id === id).logicMode = mode;
        showArgument(id);
        saveArguments();
        dialog.close();
      };
      list.append(b);
    }
    }
    drawExamples();
    const disposePicker = attachLogicModePicker(modeButton,dialog,()=>mode,id=>{mode=id;drawExamples();},'examples-mode-options');
    const close = document.createElement("button");
    close.className = "hy-button";
    close.setAttribute("aria-label",label("Fechar","Close"));LPDialogChrome.close(close);
    close.onclick = () => dialog.close();
    head.append(close);
    root.append(dialog);
    dialog.onclose = () => {disposePicker();dialog.remove();};
    dialog.showModal();
  }

  root.addEventListener("lp-open-argument-examples", () => {
    document.querySelector("#argument-options").hidePopover();
    openExamples();
  });
  const newButton = root.querySelector("#new-argument"),
    createBlank = newButton.onclick;
  const addWrap = document.createElement("div");
  addWrap.className = "hy-add-argument-wrap";
  newButton.before(addWrap);
  addWrap.append(newButton);
  const addMenu = document.createElement("div");
  addMenu.className = "hy-new-argument-menu";
  addMenu.hidden = true;
  addMenu.id = "new-argument-options";
  addWrap.append(addMenu);
  newButton.setAttribute("aria-controls", addMenu.id);
  newButton.setAttribute("aria-expanded", "false");
  function closeAdd() {
    addMenu.hidden = true;
    newButton.setAttribute("aria-expanded", "false");
  }
  for (const [pt, english, action, icon] of [
    ["Em branco", "Blank", () => createBlank(), '<path d="M14 3H5v18h14V8ZM14 3v5h5"/>'],
    ["Exemplo", "Example", openExamples, '<path d="M4 4h6a2 2 0 0 1 2 2v15a3 3 0 0 0-3-2H4ZM20 4h-6a2 2 0 0 0-2 2v15a3 3 0 0 1 3-2h5Z"/>'],
    ["Interpretar texto", "Interpret text", () => root.dispatchEvent(new Event("lp-open-argument-text")), '<path d="M4 5h16M4 10h16M4 15h10M4 20h6"/>'],
  ]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hy-button";
    const iconNode=document.createElement("span"),caption=document.createElement("span");iconNode.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icon+"</svg>";caption.dataset.pt=pt;caption.dataset.en=english;caption.textContent=label(pt,english);b.append(iconNode,caption);
    b.onclick = () => {
      closeAdd();
      action();
    };
    addMenu.append(b);
  }
  newButton.onclick = () => {
    addMenu.hidden = !addMenu.hidden;
    newButton.setAttribute("aria-expanded", String(!addMenu.hidden));
  };
  document.addEventListener("pointerdown", (event) => {
    if (!addWrap.contains(event.target)) closeAdd();
  });
  addWrap.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAdd();
      newButton.focus();
    }
  });

  const search = document.createElement("input");
  search.type = "search";
  search.className = "hy-symbol-search";
  search.placeholder = "";
  search.setAttribute("aria-label", label("Buscar símbolos", "Search symbols"));
  const library = root.querySelector(".hy-library");
  const searchMenu = document.createElement("details"),
    searchSummary = document.createElement("summary");
  searchMenu.className = "hy-search-menu";
  searchSummary.setAttribute("aria-label", label("Buscar símbolos", "Search symbols"));
  searchMenu.append(searchSummary, search);
  searchMenu.hidden = true;
  searchMenu.open = true;
  searchSummary.hidden = true;
  library.before(searchMenu);
  const searchButton = document.createElement("button");
  searchButton.type = "button";
  searchButton.className = "hy-button hy-search-trigger";
  searchButton.setAttribute("aria-label", label("Buscar símbolos", "Search symbols"));
  searchButton.setAttribute("aria-expanded", "false");
  searchButton.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
  const heading = root.querySelector(".hy-side h3");
  const headingRow = document.createElement("div");
  headingRow.className = "hy-library-heading";
  heading.before(headingRow);
  headingRow.append(searchButton, heading, searchMenu);
  searchMenu.inert = true;
  function setSearchOpen(open) {
    searchMenu.hidden = !open;
    searchMenu.inert = !open;
    searchButton.setAttribute("aria-expanded", String(open));
    headingRow.classList.toggle("hy-search-open", open);
    heading.setAttribute("aria-hidden", String(open));
    if (open)
      requestAnimationFrame(() => {
        if (!searchMenu.hidden) {
          searchMenu.getBoundingClientRect();
          search.focus();
          search.select();
          if (document.activeElement !== search)
            setTimeout(() => {
              if (!searchMenu.hidden) {
                search.focus();
                search.select();
              }
            }, 320);
        }
      });
  }
  searchButton.onclick = () => {
    const open = searchMenu.hidden;
    setSearchOpen(open);
    if (!open) {
      search.value = "";
      search.oninput();
    }
  };
  function dismissEmptySearch(event) {
    if (!searchMenu.hidden && !search.value.trim() && !headingRow.contains(event.target))
      setSearchOpen(false);
  }
  document.addEventListener("pointerdown", dismissEmptySearch);
  document.addEventListener("focusin", dismissEmptySearch);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      search.value = "";
      search.oninput();
      searchButton.focus();
    }
  });

  const details = [...library.querySelectorAll("details")];
  let openBefore = null;
  const normalize = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  search.oninput = () => {
    const query = normalize(search.value.trim());
    if (query && !openBefore) openBefore = details.map((d) => d.open);
    closeNotations();
    for (const [i, d] of details.entries()) {
      let found = 0;
      for (const cell of d.querySelectorAll(".hy-symbol-cell")) {
        const text = cell.querySelector(".hy-symbol");
        const visible =
          !query ||
          normalize(
            (text?.getAttribute("aria-label") || "") +
              " " +
              cell.textContent +
              " " +
              d.querySelector("summary").textContent,
          ).includes(query);
        cell.hidden = !visible;
        if (visible) found++;
      }
      d.hidden = !!query && !found;
      if (query && found) d.open = true;
      else if (!query && openBefore) d.open = openBefore[i];
    }
    if (!query) openBefore = null;
  };
  let featureLanguage = document.documentElement.lang;
  new MutationObserver(() => {
    if (featureLanguage === document.documentElement.lang) return;
    featureLanguage = document.documentElement.lang;
    fileSummary.setAttribute("aria-label", label("Arquivo", "File"));
    searchSummary.textContent = label("Buscar símbolos", "Search symbols");
    root
      .querySelectorAll(".hy-workspace-tools button[data-pt],.hy-new-argument-menu button[data-pt]")
      .forEach((b) => (b.textContent = label(b.dataset.pt, b.dataset.en)));
    search.placeholder = "";
    search.setAttribute("aria-label", label("Buscar símbolos", "Search symbols"));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  registerLogicView("truth-table", async ({ result, snapshot, prepared, revision }) => {
    if (
      revision !== logicRevision ||
      !logicEnabled ||
      !["valid", "invalid"].includes(logicPanel.dataset.state)
    )
      return;
    if (prepared.status !== "ready") return;
    const section = document.createElement("details");
    section.className = "hy-truth-table";
    const summary = document.createElement("summary");
    summary.textContent = label("Tabela-verdade", "Truth table");
    section.append(summary);
    logicPanel.append(section);
    let offset = 0;
    const count = 2 ** prepared.atoms.length,
      entries = [...prepared.premises, ...prepared.conclusions];
    const note = document.createElement("p");
    note.textContent = label(
      "Linhas em vermelho são contraexemplos. Exibição em páginas de 128 interpretações.",
      "Red rows are counterexamples. Pages show 128 interpretations.",
    );
    const scroll = document.createElement("div");
    scroll.className = "hy-table-scroll";
    const table = document.createElement("table");
    scroll.append(table);
    const nav = document.createElement("div"),
      previous = document.createElement("button"),
      next = document.createElement("button"),
      page = document.createElement("span");
    previous.textContent = "←";
    next.textContent = "→";
    previous.className = next.className = "hy-button";
    nav.append(previous, page, next);
    section.append(note, scroll, nav);
    const filter = document.createElement("select");
    filter.setAttribute("aria-label", label("Filtrar interpretações", "Filter interpretations"));
    for (const [value, pt, en] of [
      ["all", "Todas as interpretações", "All interpretations"],
      ["counter", "Somente contraexemplos", "Counterexamples only"],
      ["premises", "Premissas verdadeiras", "True premises"],
    ]) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label(pt, en);
      filter.append(option);
    }
    section.insertBefore(filter, scroll);
    let filtered = null,
      drawRevision = 0;
    filter.onchange = () => {
      offset = 0;
      filtered = null;
      draw();
    };
    async function draw() {
      const revision = ++drawRevision;
      if (!filtered) {
        page.textContent = label("Calculando…", "Computing…");
        const list = [];
        for (let n = 0; n < count; n++) {
          if (filter.value === "all") list.push(n);
          else {
            const values = Object.create(null);
            prepared.atoms.forEach((a, i) => (values[a] = !!(n & (1 << i))));
            const premisesTrue = prepared.premises.every((e) => LPLogic.evaluate(e.tree, values));
            if (
              premisesTrue &&
              (filter.value === "premises" ||
                prepared.conclusions.some((e) => !LPLogic.evaluate(e.tree, values)))
            )
              list.push(n);
          }
          if (n % 256 === 0) {
            await new Promise((r) => setTimeout(r, 0));
            if (revision !== drawRevision || !section.isConnected) return;
          }
        }
        filtered = list;
      }
      table.replaceChildren();
      const head = document.createElement("tr");
      for (const text of [
        ...prepared.atoms,
        ...entries.map((e) => (e.role === "conclusion" ? "∴ " : "") + snapshot[e.index].text),
      ]) {
        const th = document.createElement("th");
        th.textContent = text;
        head.append(th);
      }
      const thead = document.createElement("thead");
      thead.append(head);
      table.append(thead);
      const body = document.createElement("tbody");
      for (const n of filtered.slice(offset, offset + 128)) {
        const values = Object.create(null);
        prepared.atoms.forEach((a, i) => (values[a] = !!(n & (1 << i))));
        const results = entries.map((e) => LPLogic.evaluate(e.tree, values));
        const counter =
          results.slice(0, prepared.premises.length).every(Boolean) &&
          results.slice(prepared.premises.length).some((v) => !v);
        const tr = document.createElement("tr");
        tr.dataset.counterexample = String(counter);
        for (const value of [...prepared.atoms.map((a) => values[a]), ...results]) {
          const td = document.createElement("td");
          td.textContent = value ? label("V", "T") : "F";
          tr.append(td);
        }
        body.append(tr);
      }
      table.append(body);
      page.textContent =
        (filtered.length ? offset + 1 : 0) +
        "–" +
        Math.min(filtered.length, offset + 128) +
        " / " +
        filtered.length;
      previous.disabled = offset === 0;
      next.disabled = offset + 128 >= filtered.length;
    }
    previous.onclick = () => {
      offset = Math.max(0, offset - 128);
      draw();
    };
    next.onclick = () => {
      offset += 128;
      draw();
    };
    section.addEventListener("toggle", () => {
      if (section.open && !table.children.length) draw();
    });
  });
  const known = new Set(argumentWorkspace.documents.map((d) => d.id));
  new MutationObserver(() => {
    for (const shell of root.querySelectorAll(".hy-argument-tabs .hy-tab-shell")) {
      const id = shell.dataset.argumentId;
      if (!known.has(id)) {
        known.add(id);
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
          shell.animate(
            [
              { opacity: 0, transform: "translateY(5px) scale(.97)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 180, easing: "ease-out" },
          );
      }
    }
  }).observe(root.querySelector(".hy-argument-tabs"), { childList: true });
})();
