(() => {
  const button = document.createElement("button");
  button.type = "button";
  button.id = "settings-default";
  button.className = "hy-button hy-icon-button";
  button.setAttribute("aria-label", "Restore defaults");
  button.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11a9 9 0 1 1 2.7 7M3 4v7h7"/></svg>';
  document.querySelector("#settings-language").before(button);
  button.onclick = () => {
    const en = ui.language === "en",
      dialog = document.createElement("dialog");
    dialog.id = "default-settings-confirmation";
    dialog.className = "hy-feature-dialog hy-selective-reset";
    dialog.setAttribute("aria-labelledby", "reset-default-title");
    dialog.setAttribute("aria-describedby", "reset-default-description");
    const header = document.createElement("div");
    header.className = "hy-reset-head";
    const title = document.createElement("h3");
    title.id = "reset-default-title";
    title.textContent = en ? "Restore defaults" : "Restaurar padrões";
    const x = document.createElement("button");
    x.type = "button";
    x.className = "hy-button hy-icon-button";
    LPDialogChrome.close(x);
    x.setAttribute("aria-label", en ? "Close" : "Fechar");
    x.onclick = () => dialog.close();
    header.append(title, x);
    const description = document.createElement("p");
    description.id = "reset-default-description";
    description.textContent = en
      ? "Each item shows the value to restore. Turn on Preserve for anything you want to keep. Arguments and descriptions are kept."
      : "Cada item mostra como ficará após restaurar. Ative Preservar no que deseja manter. Argumentos e descrições serão mantidos.";
    const entries = [
      [
        "language",
        "Idioma",
        "Language",
        "International English",
        "International English",
        () => (ui.language = "en"),
      ],
      ["theme", "Tema", "Theme", "Claro", "Light", () => (ui.theme = "light")],
      ['writing-mode','Modo de escrita','Writing mode','Linha contínua','Continuous writing',()=>{ui.writingMode='continuous';}],
      ['panel-fonts','Fontes das fórmulas','Formula fonts','Cambria Math','Cambria Math',()=>{
        config('editor').font = config('preview').font = 'math';
        root.dispatchEvent(new Event('lp-ui-colors'));
      }],
      ["sidebar", "Barra lateral", "Sidebar", "Visível", "Visible", () => (ui.focus = false)],
      [
        "panels-visible",
        "Conteúdo dos painéis",
        "Panel contents",
        "Editor e Argumento visíveis",
        "Editor and Argument visible",
        () => {
          ui.editor = true;
          ui.preview = true;
        },
      ],
      [
        "library-size",
        "Tamanho da seção de símbolos lógicos",
        "Logical symbols section size",
        "100%",
        "100%",
        () => {
          const i = root.querySelector("#scale-library");
          i.value = 100;
          i.dispatchEvent(new Event("input", { bubbles: true }));
        },
      ],
      [
        "writing-size",
        "Tamanho dos argumentos",
        "Argument size",
        "100%",
        "100%",
        () => {
          const i = root.querySelector("#scale-writing");
          i.value = 100;
          i.dispatchEvent(new Event("input", { bubbles: true }));
        },
      ],
      [
        "hints-enabled",
        "Dicas de hover",
        "Hover hints",
        "Ativadas",
        "Enabled",
        () => (ui.hoverHintsEnabled = true),
      ],
      [
        "hint-delay",
        "Tempo das dicas",
        "Hover hint delay",
        "0,5 s",
        "0.5 s",
        () => (ui.hoverDelaySeconds = 0.5),
      ],
      [
        "hold-delay",
        "Tempo de segurar",
        "Hold action delay",
        "0,5 s",
        "0.5 s",
        () => (ui.holdDelaySeconds = 0.5),
      ],
      [
        "uppercase",
        "Digitação em maiúsculas",
        "Uppercase typing",
        "Desativada",
        "Disabled",
        () => {
          if (capsLock) root.querySelector("#caps-lock").click();
        },
      ],
      [
        "roles",
        "Botões Premissa / Conclusão",
        "Premise / Conclusion labels",
        "Nomes (Premissa / Conclusão)",
        "Names (Premise / Conclusion)",
        () => {
          ui.roleDisplay = "names";
          root.dataset.roleDisplay = "names";
        },
      ],
      [
        "numbering",
        "Enumeração do argumento atual",
        "Current argument numbering",
        "Ativada",
        "Enabled",
        () => (numbered = true),
      ],
      [
        "prefix",
        "Espaçamento dos prefixos",
        "Prefix spacing",
        "Compacto (¬A, ∀x)",
        "Compact (¬A, ∀x)",
        () => (ui.compactPrefixSpacing = true),
      ],
      [
        "colors",
        "Cores dos painéis",
        "Panel colors",
        "Azul suave e verde suave",
        "Soft blue and soft green",
        () => {
          ui.premiseColor = "#7899bc";
          ui.conclusionColor = "#7a9e88";
        },
      ],
      [
        "outer",
        "Traços externos",
        "Outer markers",
        "Ativados em ambos os painéis",
        "Enabled on both panels",
        () => {
          ui.externalMarker = true;
          for (const key of ["editor", "preview"]) config(key).external = true;
        },
      ],
      [
        "borders",
        "Bordas coloridas",
        "Colored borders",
        "Desativadas em ambos os painéis",
        "Disabled on both panels",
        () => {
          ui.colorPanelBorder = false;
          for (const key of ["editor", "preview"]) config(key).border = false;
        },
      ],
      [
        "inner",
        "Detalhes internos",
        "Inner details",
        "Nenhum; alinhamento na coluna do olho",
        "None; aligned to the eye column",
        () => {
          ui.internalDetail = "none";
          ui.editorDetailOffset = 0;
          ui.previewDetailOffset = 0;
          for (const key of ["editor", "preview"]) config(key).detail = "none";
        },
      ],
      [
        "library-layout",
        "Disposição da biblioteca",
        "Library arrangement",
        "Horizontal, fixa, com Mais comuns aberta",
        "Horizontal, docked, with Most common open",
        () => root.dispatchEvent(new Event("lp-reset-library-layout")),
      ],
      [
        "layout",
        "Posição e largura das janelas",
        "Panel positions and widths",
        "Disposição inicial; lado a lado em telas largas",
        "Initial arrangement; side by side on wide screens",
        restoreInitialLayoutProfile,
      ],
    ];
    function config(key) {
      ui.panelAppearance ??= {};
      return (ui.panelAppearance[key] ??= {
        detail: ui.internalDetail || "none",
        external: ui.externalMarker !== false,
        border: ui.colorPanelBorder === true,
      });
    }
    const list = document.createElement("div");
    list.className = "hy-reset-list";
    const states = [];
    for (const [key, pt, english, ptValue, enValue, apply] of entries) {
      const row = document.createElement("label");
      row.className = "hy-reset-item";
      const details = document.createElement("span"),
        name = document.createElement("span"),
        value = document.createElement("span");
      details.className = "hy-reset-details";
      name.className = "hy-reset-name";
      value.className = "hy-reset-value";
      name.textContent = en ? english : pt;
      value.textContent = en ? enValue : ptValue;
      details.append(name, value);
      const preserve = document.createElement("span"),
        input = document.createElement("input"),
        label = document.createElement("span");
      preserve.className = "hy-reset-preserve";
      input.type = "checkbox";
      input.setAttribute("role", "switch");
      input.dataset.resetKey = key;
      input.setAttribute("aria-label", (en ? "Preserve " : "Preservar ") + (en ? english : pt));
      label.textContent = en ? "Preserve" : "Preservar";
      preserve.append(label, input);
      row.append(details, preserve);
      list.append(row);
      states.push({ input, apply, key });
      input.onchange = () => {
        row.dataset.preserved = String(input.checked);
        update();
      };
    }
    const count = document.createElement("p");
    count.className = "hy-reset-count";
    count.setAttribute("aria-live", "polite");
    const actions = document.createElement("div");
    actions.className = "hy-default-actions";
    const cancel = document.createElement("button"),
      confirm = document.createElement("button");
    cancel.type = confirm.type = "button";
    cancel.className = confirm.className = "hy-button";
    cancel.textContent = en ? "Cancel" : "Cancelar";
    confirm.textContent = en ? "Restore selected" : "Restaurar selecionados";
    cancel.onclick = () => dialog.close();
    function update() {
      const total = states.filter((s) => !s.input.checked).length;
      count.textContent = en
        ? total + " settings to restore"
        : total + " ajustes serão restaurados";
      confirm.disabled = total === 0;
    }
    confirm.onclick = () => {
      for (const state of states) if (!state.input.checked) state.apply();
      applyUI();
      applyLanguage();
      root.dispatchEvent(new Event("lp-hover-delay-change"));
      drawRows();
      render();
      saveArguments();
      saveUI();
      if (!states.find((s) => s.key === "layout").input.checked)
        root.dispatchEvent(new Event("lp-reset-panel-layout"));
      dialog.close();
    };
    actions.append(cancel, confirm);
    const body=document.createElement('div');body.className='hy-reset-body';body.append(description,list,count);
    dialog.append(header,body,actions);
    root.append(dialog);
    dialog.onclose = () => {
      dialog.remove();
      const settings = root.querySelector("#editor-settings");
      if (!settings.matches(":popover-open")) settings.showPopover();
      button.focus();
    };
    dialog.addEventListener("click", (e) => {
      const b = dialog.getBoundingClientRect();
      if (
        e.target === dialog &&
        (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom)
      )
        dialog.close();
    });
    update();
    dialog.showModal();
    cancel.focus();
  };
})();
