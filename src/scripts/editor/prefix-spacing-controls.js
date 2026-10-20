(() => {
  const button = document.createElement("button");
  button.id = "compact-prefix-spacing";
  button.type = "button";
  button.className = "hy-button hy-prefix-toggle";
  button.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h6v9M15 6h5M17.5 6v12M12 4v16M3 21h17"/></svg>';
  numberToggle.after(button);
  function update() {
    const en = ui.language === "en";
    button.setAttribute("aria-pressed", String(ui.compactPrefixSpacing === true));
    const text = en
      ? "Compact prefix symbols and parentheses (¬ ∀ ∃)"
      : "Compactar prefixos e parênteses (¬ ∀ ∃)";
    button.setAttribute("aria-label", text);
    button.title = text;
  }
  button.onclick = () => {
    ui.compactPrefixSpacing = !ui.compactPrefixSpacing;
    update();
    saveUI();
    render();
  };
  root.addEventListener("lp-ui-colors", () => {
    update();
    render();
  });
  root.querySelector("#settings-language").addEventListener("click", update);
  update();
  render();
})();
