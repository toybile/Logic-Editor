(() => {
  const root = document.querySelector("#lp-hybrid");
  let lang = "";
  const seen = new WeakMap();
  function update() {
    const pt = document.documentElement.lang.startsWith("pt");
    for (const e of root.querySelectorAll(
      ".hy-pane-close,.hy-pane-collapse,.hy-mod-palette .hy-mod-grip,.hy-mod-rail-window .hy-mod-grip,.hy-docked-create,.hy-mod-rail-toggle,.hy-mod-orientation",
    )) {
      let hint;
      if (e.matches(".hy-pane-close")) hint = pt ? "Fechar categoria" : "Close category";
      else if (e.matches(".hy-pane-collapse,.hy-mod-grip"))
        hint = pt
          ? "Clique para recolher ou expandir. Segure e arraste para mover."
          : "Click to collapse or expand. Hold and drag to move.";
      else if (e.matches(".hy-docked-create"))
        hint = pt
          ? "Duplicar categoria. Clique para criar uma cópia abaixo; arraste para escolher a posição da cópia."
          : "Duplicate category. Click to create a copy below; drag to choose the copy’s position.";
      else if (e.matches(".hy-mod-rail-toggle"))
        hint =
          e.dataset.closeRail === "true"
            ? pt
              ? "Recolher categorias à biblioteca"
              : "Return categories to library"
            : pt
              ? "Desacoplar categorias. Segure e arraste em qualquer direção."
              : "Detach categories. Hold and drag in any direction.";
      else
        hint =
          root.querySelector(".hy-mod-nav")?.dataset.axis === "vertical"
            ? pt
              ? "Colocar barra na horizontal"
              : "Make category bar horizontal"
            : pt
              ? "Colocar barra na vertical"
              : "Make category bar vertical";
      if (seen.get(e) !== hint) {
        seen.set(e, hint);
        e.dataset.hintText = hint;
        e.setAttribute("aria-label", hint);
      }
    }
  }
  new MutationObserver(update).observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-axis", "data-close-rail"],
  });
  new MutationObserver(() => {
    if (lang !== document.documentElement.lang) {
      lang = document.documentElement.lang;
      seen.clear?.();
      update();
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  update();
})();
