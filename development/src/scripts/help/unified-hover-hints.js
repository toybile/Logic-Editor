const LPHints = (() => {
  const tip = document.createElement("div");
  tip.id = "lp-shared-hover-hint";
  tip.className = "lp-decoration-alt-hint lp-unified-hint";
  tip.setAttribute("popover", "manual");
  tip.setAttribute("role", "tooltip");
  document.body.append(tip);
  let pending = null,
    anchor = null,
    visibleAnchor = null,
    lastTrigger = null;
  const en = () => ui.language === "en";
  const text = interfaceText;
  function bodyKeys(container, value) {
    const pattern =
      /\b(?:Ctrl\s*\+\s*Shift\s*\+\s*Z|Ctrl\s*\+\s*Z|Shift\s*\+\s*(?:Tab|Space|Espaço)|Alt\s*\+\s*(?:clique|click)|duplo clique|double[- ]click|clique(?: direito| esquerdo)?|right[- ]click|left[- ]click|click|segure|hold|arraste|drag|Space|Espaço|Tab|Alt|Enter|Backspace|Delete|edit|editar|excluir|Escape|Home)\b/giu;
    for (const paragraph of String(value).split(/\n+/)) {
      for (const sentence of paragraph.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý∵∴])/u)) {
        if (!sentence.trim()) continue;
        const line = document.createElement("span");
        line.className = "lp-hint-line";
        let last = 0;
        for (const match of sentence.matchAll(pattern)) {
          line.append(document.createTextNode(sentence.slice(last, match.index)));
          const key = document.createElement("kbd");
          key.textContent = match[0];
          line.append(key);
          last = match.index + match[0].length;
        }
        line.append(document.createTextNode(sentence.slice(last)));
        container.append(line);
      }
    }
  }

  function described(element, add) {
    if (!element) return;
    const ids = new Set(
      (element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean),
    );
    if (add) ids.add(tip.id);
    else ids.delete(tip.id);
    if (ids.size) element.setAttribute("aria-describedby", [...ids].join(" "));
    else element.removeAttribute("aria-describedby");
  }
  function hide() {
    clearTimeout(pending);
    pending = null;
    if (tip.matches(":popover-open")) tip.hidePopover();
    described(visibleAnchor, false);
    visibleAnchor = null;
  }
  function content(element) {
    if (element.matches("[data-create-category]"))
      return {
        title: text("Duplicar categoria", "Duplicate category"),
        body: text(
          "Clique para criar uma cópia acoplada logo abaixo. Arraste para criar uma cópia e escolher sua posição, dentro ou fora da biblioteca.",
          "Click to create a docked copy directly below. Drag to create a copy and choose its position inside or outside the library.",
        ),
      };
    if (element.matches(".hy-card-picker"))
      return {
        title: text("Selecionar categoria", "Choose category"),
        body: text(
          "Clique para abrir ou fechar a grade. Escolher uma categoria troca somente o conteúdo desta seção.",
          "Click to open or close the grid. Choosing a category replaces only this section’s content.",
        ),
      };
    if (element.matches("[data-card-category]"))
      return {
        title: element.getAttribute("aria-label"),
        body: text(
          "Clique para selecionar nesta seção. Segure e arraste para criar uma janela desta categoria.",
          "Click to select in this section. Hold and drag to create a window of this category.",
        ),
      };
    if (element.matches("[data-argument-insert]"))
      return { title: text("Inserir argumento", "Insert argument"), body: text("Clique para criar um argumento em branco nesta posição, preservando os demais.", "Click to create a blank argument at this position, keeping the others.") };
    if (element.matches(".hy-add-section-zone button"))
      return {
        title: element.getAttribute("aria-label"),
        body: element.closest(".hy-premise-add-line")
          ? text(
              "Clique para inserir uma premissa nesta posição. Indisponível durante a seleção de linhas.",
              "Click to insert a premise at this position. Unavailable while selecting rows.",
            )
          : text(
              "Clique para adicionar uma categoria nesta posição.",
              "Click to add a category at this position.",
            ),
      };
    if (element.matches(".hy-mod-palette .hy-mod-grip"))
      return {
        title: text("Mover ou recolher", "Move or collapse"),
        body:
          element.closest(".hy-mod-palette").dataset.docked === "true"
            ? text(
                "Clique para recolher ou expandir. Arraste para reorganizar ou desacoplar.",
                "Click to collapse or expand. Drag to reorder or detach.",
              )
            : text(
                "Clique para recolher ou expandir. Arraste para mover. Segure sem mover por ",
                "Click to collapse or expand. Drag to move. Hold still for ",
              ) +
              (getHoldDelay() / 1000).toLocaleString(ui.language) +
              " s " +
              text("para voltar à biblioteca.", "to return to the library."),
      };
    if (element.matches(".hy-mod-nav [data-category]") && globalThis.LPModularLibrary?.describe)
      return LPModularLibrary.describe(element.dataset.category);
    if (element.matches(".hy-mod-grip"))
      return {
        title: text("Mover ou recolher", "Move or collapse"),
        body: element.closest(".hy-modular-library")
          ? text(
              "Clique para recolher ou reabrir a biblioteca. Arraste para mover.",
              "Click to collapse or reopen the library. Drag to move.",
            )
          : text(
              "Clique para recolher ou expandir. Arraste para mover a janela.",
              "Click to collapse or expand. Drag to move the window.",
            ),
      };
    if (element.matches(".hy-search-trigger"))
      return {
        title: text("Pesquisar símbolos", "Search symbols"),
        body: text(
          "Clique para abrir ou fechar a pesquisa. Digite um nome ou símbolo. Escape: fechar a pesquisa.",
          "Click to open or close search. Type a name or symbol. Escape: close search.",
        ),
      };
    if (element.matches(".hy-mod-orientation"))
      return {
        title: text("Orientação das categorias", "Category orientation"),
        body: text(
          "Clique para alternar entre horizontal e vertical.",
          "Click to switch between horizontal and vertical.",
        ),
      };
    if (element.matches(".hy-mod-rail-toggle,.hy-mod-detach-group"))
      return {
        title: element.getAttribute("aria-label"),
        body: text(
          "Clique para destacar ou recolher esta janela.",
          "Click to detach or dock this window.",
        ),
      };
    if (element.matches(".hy-appearance-help"))
      return {
        title: text("Aparência dos painéis", "Panel appearance"),
        body: text(
          "Tente segurar os olhinhos por 0,2 segundo para personalizar cada janela.",
          "Try holding the eye buttons for 0.2 seconds to customize each panel.",
        ),
        icon: "?",
      };
    if (element.matches(".hy-role")) {
      const blank = element.closest(".hy-blank-line"),
        conclusion = element.getAttribute("aria-pressed") === "true";
      return {
        title: blank
          ? text("Linha vazia", "Blank row")
          : conclusion
            ? text("Conclusão", "Conclusion")
            : text("Premissa", "Premise"),
        body: blank
          ? text("Clique para voltar a premissa.", "Click to return to a premise.")
          : text(
              "Clique para alternar o tipo. Duplo clique muda a exibição. Segure por 0,3 segundo para criar uma linha vazia. ∵ e ∴ identificam o tipo na interface; não integram a validação.",
              "Click to switch the role. Double-click changes the labels. Hold for 0.3 seconds to create a blank row. ∵ and ∴ mark roles in the interface; they are not part of validation.",
            ),
        icon: blank ? "—" : conclusion ? "∴" : "∵",
      };
    }
    if (element.matches(".hy-delete-line"))
      return {
        title: text("Excluir linha", "Delete line"),
        body: text(
          "Clique para excluir. Segure por 0,3 segundo para selecionar e confirmar a exclusão de todas as linhas deste argumento.",
          "Click to delete. Hold for 0.3 seconds to select and confirm deletion of every row in this argument.",
        ),
      };
    if (element.matches("[data-action=focus]"))
      return {
        title: "Home",
        body: text("Clique para voltar ao portfólio.", "Click to return to the portfolio."),
        icon: "⌂",
      };
    if (element.dataset.descriptionHint) return {
      title: text("Descrição dos símbolos", "Symbol descriptions"),
      body: element.dataset.descriptionHint,
    };
    if (element.matches(".hy-block")) {
      const doc = argumentWorkspace.documents.find((d) => d.id === argumentWorkspace.activeId),
        description = doc?.descriptions?.[element.value];
      const instructions = text(
        "Clique em qualquer bloco para editar.\nEspaço: avançar ao próximo bloco; no último preenchido, criar outro.\nShift + Espaço: inserir um bloco após o atual.\nSetas esquerda/direita: no limite do texto, ir ao bloco vizinho.\nEnter: criar linha (fora do modo de seleção); Tab: próxima linha; Shift+Tab: linha anterior.\nEm bloco vazio, Backspace remove e volta ao anterior; Delete remove e mantém a posição, focando o próximo bloco disponível. Pelo menos um bloco é mantido.",
        "Click any block to edit.\nSpace: next block; from the last filled block, create another.\nShift + Space: insert a block after the current one.\nLeft/right arrows: at the text boundary, move to the adjacent block.\nEnter: new row (outside selection mode); Tab: next row; Shift+Tab: previous row.\nIn an empty block, Backspace removes it and returns to the previous one; Delete removes it and keeps the position, focusing the next available block. At least one block is kept.",
      );
      return {
        title: description ? element.value : text("Editar bloco", "Edit block"),
        body: description ? String(description) + "\n\n" + instructions : instructions,
        icon: element.value.length <= 3 && element.value ? element.value : "Aa",
      };
    }
    if (element.matches("#number-toggle"))
      return {
        title: text("Enumeração das linhas", "Line numbering"),
        body: text(
          "Mostrar ou ocultar os números no argumento formatado.",
          "Show or hide line numbers in the formatted argument.",
        ),
      };
    if (element.matches("#compact-prefix-spacing"))
      return {
        title: text("Espaços de prefixos", "Prefix spacing"),
        body: text(
          "Compactar prefixos e parênteses na apresentação: ¬ A → ¬A, ∀ x → ∀x, F ( x ) → F(x). Os espaços entre operadores binários, a escrita e a validação são preservados.",
          "Compact prefixes and parentheses in the display: ¬ A → ¬A, ∀ x → ∀x, F ( x ) → F(x). Spacing around binary operators, editing and validation are preserved.",
        ),
      };
    if (element.matches("[data-action=editor],[data-action=preview]"))
      return {
        title: element.matches("[data-action=editor]")
          ? text("Premissas e conclusões", "Premises and conclusions")
          : text("Argumento", "Argument"),
        body: text(
          "Clique para mostrar ou recolher. Segure por 0,2 segundo para abrir a aparência desta janela.",
          "Click to expand or collapse. Hold for 0.2 seconds to customize this panel.",
        ),
      };
    if (element.matches("[popovertarget=editor-settings]"))
      return {
        title: text("Configurações", "Settings"),
        body: text(
          "Ajustar idioma, tema e tamanho da interface.",
          "Adjust the language, theme and interface size.",
        ),
      };
    if (element.matches("#new-argument"))
      return {
        title: text("Adicionar argumento", "Add argument"),
        body: text(
          "Criar um argumento em branco ou carregar um exemplo.",
          "Create a blank argument or load an example.",
        ),
      };
    if (element.matches("#argument-view-toggle"))
      return {
        title: element.getAttribute("aria-label"),
        body: text("Alternar entre abas com linha discreta e seletor compacto, mantendo o argumento atual.", "Switch between underline tabs and a compact selector, keeping the current argument."),
      };
    if (element.matches('.hy-argument-tab,#argument-options [role="menuitemradio"]'))
      return {
        title: text("Argumento", "Argument"),
        body: text(
          "Clique para selecionar. Arraste para mudar a posição na grade. Segure sem mover para editar o nome ou excluir.",
          "Click to select. Drag to change its position in the grid. Hold still to edit the name or delete.",
        ),
      };
    if (element.matches(".hy-argument-grid-add"))
      return {
        title: text("Adicionar argumento", "Add argument"),
        body: text("Clique para criar um argumento em branco. Segure para escolher um exemplo.", "Click to create a blank argument. Hold to choose an example."),
      };
    if (element.matches(".hy-option-rename"))
      return { title: text("Renomear argumento", "Rename argument"), body: text("Alterar o nome deste argumento.", "Change this argument's name.") };
    if (element.matches(".hy-option-delete"))
      return { title: text("Excluir argumento", "Delete argument"), body: text("Excluir este argumento. Se houver texto, será pedida confirmação.", "Delete this argument. Confirmation is requested if it contains text.") };
    if (element.matches("#hover-hints-toggle"))
      return {
        title: text("Dicas de hover", "Hover hints"),
        body: text("Ative para mostrar explicações ao passar o mouse sobre os controles. Ajuste o tempo abaixo.", "Enable explanations when hovering over controls. Adjust the delay below."),
      };
    if (element.matches("#caps-lock"))
      return {
        title: text("Digitação em maiúsculas", "Uppercase typing"),
        body:
          element.getAttribute("aria-pressed") === "true"
            ? text(
                "Ativada. Clique para desativar a conversão das próximas letras.",
                "Enabled. Click to stop converting newly typed letters.",
              )
            : text(
                "Clique para converter as próximas letras em maiúsculas.",
                "Click to convert newly typed letters to uppercase.",
              ),
      };
    if (element.matches("#settings-language"))
      return {
        title: text("Idioma", "Language"),
        body: text("Mudar para International English.", "Switch to Português (Brasil)."),
        icon: "A",
      };
    if (element.matches("#settings-theme"))
      return {
        title: text("Tema", "Theme"),
        body:
          isDarkTheme()
            ? text("Ativar tema claro.", "Switch to light theme.")
            : text("Ativar tema escuro.", "Switch to dark theme."),
      };
    if (element.matches(".hy-undo-lines"))
      return {
        title: text("Desfazer", "Undo"),
        body: text(
          "Desfazer a última operação registrada nas linhas. Ctrl+Z também permite desfazer operações.",
          "Undo the last recorded row operation. Ctrl+Z also undoes operations.",
        ),
      };
    if (element.matches(".hy-redo-lines"))
      return {
        title: text("Refazer", "Redo"),
        body: text(
          "Refazer a última operação desfeita. Ctrl+Shift+Z também refaz operações.",
          "Redo the last undone operation. Ctrl+Shift+Z also redoes operations.",
        ),
      };
    const raw = translated(element.dataset.hintText || element.getAttribute("aria-label") || "");
    const action = raw.search(
      /\b(?:duplo clique|double[- ]click|clique|click|segure|hold|arraste|drag|Alt\s*\+|Ctrl\s*\+)/iu,
    );
    if (action >= 0) {
      const label = raw.slice(0, action).replace(/[\s—–:;,.]+$/u, "");
      return { title: label || text("Como usar", "How to use"), body: raw.slice(action) };
    }
    return { title: raw, body: "" };
  }
  function target(node) {
    const element =
      node instanceof Element
        ? node.closest(
            "[data-description-hint],[data-hint-text],.hy-search-trigger,.hy-appearance-help,.hy-icon-button[aria-label],.hy-symbol-help,.hy-role,.hy-delete-line,.hy-block,.hy-card-picker,.hy-add-section-zone button,#hover-hints-toggle,.hy-argument-grid-add,.hy-argument-tab,#argument-options [role=menuitemradio]",
          )
        : null;
    if (
      !element ||
      element.closest(".hy-symbol-cell,.lp-unified-hint") ||
      element.matches(".hy-inner-appearance-handle")
    )
      return null;
    return element;
  }
  function position() {
    if (!visibleAnchor?.isConnected) {
      hide();
      return;
    }
    const b = visibleAnchor.getBoundingClientRect(),
      size = tip.getBoundingClientRect();
    const left = Math.max(
        12,
        Math.min(innerWidth - size.width - 12, b.left + b.width / 2 - size.width / 2),
      ),
      below = (visibleAnchor.id !== 'hover-hints-toggle' || b.top - size.height - 9 < 12) && b.bottom + 9 + size.height <= innerHeight - 12;
    tip.dataset.side = below ? "bottom" : "top";
    tip.style.left = left + "px";
    tip.style.top =
      Math.max(
        12,
        Math.min(innerHeight - size.height - 12, below ? b.bottom + 9 : b.top - size.height - 9),
      ) + "px";
    tip.style.setProperty(
      "--hint-pointer",
      Math.max(14, Math.min(size.width - 24, b.left + b.width / 2 - left - 4)) + "px",
    );
  }
  function show(element) {
    if (!hoverHintsEnabled() || !element?.isConnected || drag?.ghost || argumentTabDrag?.active)
      return;
    hide();
    const info = content(element);
    if (info.body)
      info.body = info.body
        .replace(/0,[234] segundo/g, (getHoldDelay() / 1000).toLocaleString("pt-BR") + " segundo")
        .replace(/0\.[234] seconds/g, getHoldDelay() / 1000 + " seconds");
    if (!info.title) return;
    const heading = document.createElement("span"),
      icon = document.createElement("span"),
      title = document.createElement("span");
    heading.className = "lp-hint-heading";
    icon.className = "lp-hint-icon";
    icon.setAttribute("aria-hidden", "true");
    if (info.icon) icon.textContent = info.icon;
    else if (element.querySelector("svg")) {
      const svg = element.querySelector("svg").cloneNode(true);
      svg.removeAttribute("id");
      icon.append(svg);
    } else icon.textContent = "?";
    bodyKeys(title, info.title);
    heading.append(icon, title);
    tip.replaceChildren(heading);
    tip.dataset.compact = String(!info.body);
    if (info.body) {
      const body = document.createElement("span");
      body.className = "lp-hint-body";
      bodyKeys(body, info.body);
      tip.append(body);
    }
    const decoration = document.getElementById("decoration-alt-hint");
    if (decoration?.matches(":popover-open")) decoration.hidePopover();
    tip.style.colorScheme = root.style.colorScheme;
    const panel = element.closest(".hy-editor,.hy-argument-panel");
    tip.style.setProperty(
      "--hint-accent",
      panel
        ? getComputedStyle(panel).getPropertyValue("--panel-marker")
        : "light-dark(#7899bc,#9bb7d2)",
    );
    visibleAnchor = element;
    described(element, true);
    tip.showPopover();
    position();
  }
  function schedule(element, delay = getHoverDelay()) {
    if (!hoverHintsEnabled()) return;
    if (anchor === element && (pending || visibleAnchor === element)) return;
    hide();
    anchor = element;
    pending = setTimeout(() => {
      pending = null;
      show(element);
    }, delay);
  }
  function captureTitles(node) {
    if (!(node instanceof Element) || node === tip || node.closest(".lp-unified-hint")) return;
    for (const element of [node, ...node.querySelectorAll("[title]")]) {
      if (!element.hasAttribute("title")) continue;
      const value = element.getAttribute("title");
      if (value) element.dataset.hintText = value;
      element.removeAttribute("title");
    }
  }
  captureTitles(document.body);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") captureTitles(record.target);
      else for (const node of record.addedNodes) captureTitles(node);
    }
    if (visibleAnchor && !visibleAnchor.isConnected) hide();
  }).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["title"],
  });
  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const element = target(event.target);
    if (!element) return;
    if (element.contains(event.relatedTarget)) return;
    lastTrigger = "pointer";
    schedule(element);
  });
  document.addEventListener("pointerout", (event) => {
    if (!anchor || anchor.contains(event.relatedTarget)) return;
    if (anchor.contains(event.target)) {
      hide();
      anchor = null;
    }
  });
  document.addEventListener("focusin", (event) => {
    const element = target(event.target);
    if (element && element.matches(":focus-visible") && !element.matches("input,textarea")) {
      lastTrigger = "focus";
      schedule(element);
    }
  });
  document.addEventListener("focusout", (event) => {
    if (lastTrigger === "focus" && anchor?.contains(event.target)) {
      hide();
      anchor = null;
    }
  });
  document.addEventListener("click", event => {
    const info = event.target.closest(".hy-settings-info");
    if (info && matchMedia("(pointer:coarse)").matches) {
      lastTrigger = "touch";
      anchor = info;
      show(info);
    }
  });
  document.addEventListener(
    "pointerdown",
    () => {
      hide();
      anchor = null;
    },
    true,
  );
  document.addEventListener(
    "keydown",
    () => {
      hide();
      anchor = null;
    },
    true,
  );
  window.addEventListener(
    "scroll",
    () => {
      hide();
      anchor = null;
    },
    true,
  );
  window.addEventListener("resize", hide);
  window.addEventListener("blur", hide);
  root.addEventListener("lp-ui-colors", hide);
  root.querySelector("#settings-language").addEventListener("click", hide);
  root.addEventListener("lp-hover-delay-change", () => {
    hide();
    anchor = null;
  });
  function decorateSymbols(panel, symbol) {
    panel.classList.add("lp-styled-hover");
    const heading = panel.querySelector(".hy-notation-head"),
      icon = document.createElement("span");
    icon.className = "lp-hint-icon";
    icon.textContent = symbol;
    icon.setAttribute("aria-hidden", "true");
    heading.prepend(icon);
  }
  return { hide, decorateSymbols, format: bodyKeys };
})();

