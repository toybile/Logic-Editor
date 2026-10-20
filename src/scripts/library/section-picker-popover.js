(() => {
  const root = document.querySelector("#lp-hybrid"),
    menu = document.createElement("div");
  menu.className = "hy-card-picker-menu";
  menu.setAttribute("popover", "manual");
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-label", "Selecionar categoria");
  root.append(menu);
  let current = null;
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (
        menu.matches(":popover-open") &&
        !menu.contains(e.target) &&
        !e.target.closest(".hy-card-picker")
      )
        menu.hidePopover();
    },
    true,
  );
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.matches(":popover-open")) menu.hidePopover();
  });
  function close() {
    if (current) current.button.setAttribute("aria-expanded", "false");
  }
  menu.addEventListener("toggle", () => {
    if (!menu.matches(":popover-open")) close();
  });
  root.addEventListener("lp-open-card-picker", (e) => {
    if (menu.matches(":popover-open")) {
      const same = current?.button === e.detail.button;
      menu.hidePopover();
      if (same) {
        e.detail.button.setAttribute("aria-expanded", "false");
        return;
      }
    }
    current = e.detail;
    menu.replaceChildren();
    const quick = document.createElement("div"),
      choices = document.createElement("div");
    quick.className = "hy-picker-quick-cards";
    choices.className = "hy-picker-category-cards";
    menu.append(quick, choices);
    for (const option of current.select.options) {
      const button = document.createElement("button");
      button.type = "button";
      const original = root.querySelector('[data-category="' + option.value + '"]'),
        mark = document.createElement("span");
      mark.className = "mark";
      const specials = { common: "⊞", recent: "◷", favorite: "☆" };
      mark.textContent = specials[option.value] || original?.textContent || "";
      const name = document.createElement("span");
      name.className = "hy-picker-card-name";
      const shortPT = {
          "Conectivos proposicionais": "Conectivos",
          "Implicação e equivalência": "Implicação",
          "Quantificadores e igualdade": "Quantificadores",
          "Operadores modais": "Modais",
          "Dedução e consequência": "Dedução",
          "Conjuntos: operações": "Operações com conjuntos",
          "Conjuntos: relações": "Relações entre conjuntos",
          "Delimitadores e pontuação": "Delimitadores",
          "Mais comuns": "Comuns",
        },
        shortEN = {
          "Propositional connectives": "Connectives",
          "Implication and equivalence": "Implication",
          "Quantifiers and equality": "Quantifiers",
          "Modal operators": "Modal",
          "Deduction and consequence": "Deduction",
          "Sets: operations": "Set operations",
          "Sets: relations": "Set relations",
          "Delimiters and punctuation": "Delimiters",
          "Most common": "Common",
        };
      name.textContent =
        shortPT[option.textContent] || shortEN[option.textContent] || option.textContent;
      button.setAttribute("aria-label", option.textContent);
      button.dataset.hintText = option.textContent;
      if (specials[option.value] && original?.querySelector("svg"))
        mark.replaceChildren(original.querySelector("svg").cloneNode(true));
      button.append(mark, name);
      button.dataset.cardCategory = option.value;
      button.setAttribute("aria-pressed", String(option.selected));
      button.onclick = () => {
        current.select.value = option.value;
        current.select.dispatchEvent(new Event("change", { bubbles: true }));
        menu.hidePopover();
        current.button.focus({ preventScroll: true });
      };
      (specials[option.value] ? quick : choices).append(button);
    }
    const r = current.button.getBoundingClientRect(),
      owner = (
        current.button.closest(".hy-mod-palette[data-docked=false]") ||
        current.button.closest(".hy-modular-library") ||
        current.button.closest(".hy-mod-palette")
      ).getBoundingClientRect(),
      width = Math.min(Math.max(340, r.width), innerWidth - 16);
    menu.style.width = width + "px";
    menu.showPopover();
    menu.style.left =
      Math.max(8, Math.min(owner.left + (owner.width - width) / 2, innerWidth - width - 8)) + "px";
    menu.style.top =
      Math.max(8, Math.min(r.bottom + 5, innerHeight - menu.offsetHeight - 8)) + "px";
    current.button.setAttribute("aria-expanded", "true");
  });
  const zone = document.createElement("div");
  zone.className = "hy-add-section-zone";
  const add = document.createElement("button");
  add.type = "button";
  add.textContent = "+";
  add.setAttribute("aria-label", "Adicionar categoria");
  add.onclick = () =>
    root.dispatchEvent(new CustomEvent("lp-add-symbol-card", { detail: { group: "common" } }));
  zone.append(add);
  root.querySelector(".hy-symbol-dock-stack").after(zone);
})();
