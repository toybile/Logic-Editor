(() => {
  const button = document.createElement("button");
  button.id = "caps-lock";
  button.type = "button";
  button.className = "hy-button hy-caps-lock";
  button.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 8h-5v5H9v-5H4Z M5 20h14"/></svg>';
  button.setAttribute(
    "aria-label",
    ui.language === "en" ? "Type in uppercase" : "Digitar em maiúsculas",
  );
  button.title = ui.language === "en" ? "Type in uppercase" : "Digitar em maiúsculas";
  button.setAttribute("aria-pressed", String(capsLock));
  button.hidden = !ui.editor;
  function describeCaps() {
    const label = capsLock
      ? ui.language === "en"
        ? "Uppercase enabled — click to disable"
        : "Maiúsculas ativadas — clique para desativar"
      : ui.language === "en"
        ? "Type in uppercase"
        : "Digitar em maiúsculas";
    button.title = label;
    button.setAttribute("aria-label", label);
  }
  describeCaps();
  button.onclick = () => {
    capsLock = !capsLock;
    button.setAttribute("aria-pressed", String(capsLock));
    describeCaps();
    try {
      localStorage.setItem("formal-caps-lock", String(capsLock));
    } catch {}
  };
  root.querySelector(".hy-editor .hy-section-head").append(button);
})();
