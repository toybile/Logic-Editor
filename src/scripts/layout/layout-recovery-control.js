(() => {
  const settings = root.querySelector("#editor-settings"),
    row = document.createElement("div"),
    button = document.createElement("button");
  row.className = "hy-setting hy-layout-recovery-setting";
  button.type = "button";
  button.className = "hy-button hy-layout-recovery-button";
  function label() {
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="8" height="7" rx="2"/><rect x="13" y="4" width="8" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/></svg>';
    const name=document.createElement("span");name.textContent=ui.language === "en" ? "Reorganize windows" : "Reorganizar janelas";button.append(name);
    button.dataset.hintText =
      ui.language === "en"
        ? "Restore the first-visit window arrangement. Content and other settings are preserved."
        : "Restaura a disposição das janelas do primeiro acesso. Textos e demais configurações são preservados.";
  }
  button.onclick = () => {
    restoreInitialLayoutProfile();
    root.dispatchEvent(new Event("lp-reset-library-layout"));
    root.dispatchEvent(new Event("lp-reset-panel-layout"));
    root.style.removeProperty('--workspace-min-height');
    settings.hidePopover();
  };
  row.append(button);
  settings.append(row);
  root.querySelector("#settings-language").addEventListener("click", label);
  label();
})();
