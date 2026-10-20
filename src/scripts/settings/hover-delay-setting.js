(() => {
  const settings = root.querySelector("#editor-settings"),
    controls = [];
  function normalize(value) {
    return (
      Math.round(Math.max(0.01, Math.min(1, Number.isFinite(value) ? value : 0.2)) * 100) / 100
    );
  }
  for (const item of [
    {
      key: "hoverDelaySeconds",
      id: "hover-delay",
      pt: "Tempo das dicas",
      en: "Hover hint delay",
      toggle: true,
    },
    {
      key: "holdDelaySeconds",
      id: "hold-delay",
      pt: "Tempo de segurar os botões",
      en: "Hold action delay",
    },
  ]) {
    const setting = document.createElement("div");
    setting.className = "hy-setting hy-hover-delay-setting";
    setting.innerHTML =
      '<label for="' +
      item.id +
      '-range"></label><div class="hy-hover-delay-control' +
      (item.toggle ? " hy-has-hint-toggle" : "") +
      '">' +
      (item.toggle
        ? '<button type="button" id="hover-hints-toggle" role="switch" aria-checked="true" class="hy-hints-toggle"><span aria-hidden="true"></span></button>'
        : "") +
      '<div class="hy-size-range hy-hover-delay-track"><input id="' +
      item.id +
      '-range" type="range" min="0.01" max="1" step="0.01" value="0.2"></div><div class="hy-hover-delay-value"><input id="' +
      item.id +
      '-number" type="number" min="0.01" max="1" step="0.01" value="0.2" inputmode="decimal"><span aria-hidden="true">s</span></div></div>';
    settings.insertBefore(setting, settings.querySelector(".hy-appearance-settings"));
    const header=document.createElement("div");header.className="hy-setting-heading";
    header.append(setting.querySelector("label"));
    const switchButton=setting.querySelector("[role=switch]");
    if(switchButton) { header.append(switchButton); setting.querySelector(".hy-hover-delay-control").classList.remove("hy-has-hint-toggle"); }
    setting.prepend(header);
    const range = setting.querySelector("[type=range]"),
      number = setting.querySelector("[type=number]"),
      label = setting.querySelector("label"),
      toggle = setting.querySelector("[role=switch]");
    function update(source) {
      const value = normalize(Number(ui[item.key]));
      ui[item.key] = value;
      range.value = String(value);
      if (source !== "number") number.value = String(value);
      range.style.setProperty("--range-fill", ((value - 0.01) / 0.99) * 100 + "%");
      const en = ui.language === "en";
      label.textContent = item.toggle ? (en ? "Hover hints" : "Dicas de hover") : (en ? item.en : item.pt);
      const name = (en ? item.en : item.pt) + (en ? " in seconds" : " em segundos");
      range.setAttribute("aria-label", name);
      number.setAttribute("aria-label", name);
      range.setAttribute("aria-valuetext", value + " s");
      if (toggle) {
        const enabled = hoverHintsEnabled();
        toggle.setAttribute("aria-checked", String(enabled));
        toggle.setAttribute("aria-label", en ? "Enable hover hints" : "Ativar dicas de hover");
        range.disabled = number.disabled = !enabled;
        setting.dataset.disabled = String(!enabled);
      }
    }
    function set(value, source) {
      ui[item.key] = normalize(value);
      update(source);
      saveUI();
      root.dispatchEvent(new Event("lp-hover-delay-change"));
    }
    range.oninput = () => set(range.valueAsNumber, "range");
    number.oninput = () => {
      const value = number.valueAsNumber;
      if (Number.isFinite(value) && value >= 0.01 && value <= 1) set(value, "number");
    };
    function commit() {
      if (number.value === "") {
        update();
        return;
      }
      set(number.valueAsNumber, "commit");
    }
    number.onchange = commit;
    number.onblur = commit;
    number.onkeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit();
      }
    };
    if (toggle)
      toggle.onclick = () => {
        ui.hoverHintsEnabled = !hoverHintsEnabled();
        update();
        saveUI();
        root.dispatchEvent(new Event("lp-hover-delay-change"));
      };
    controls.push(update);
    update();
  }
  function updateAll() {
    controls.forEach((update) => update());
    saveUI();
  }
  root.addEventListener("lp-ui-colors", updateAll);
  root.querySelector("#settings-language").addEventListener("click", updateAll);
  root.addEventListener("lp-hover-delay-change", () => {
    clearTimeout(notationOpenTimer);
    closeNotations();
  });
})();
