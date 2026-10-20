// Appearance has one catalog, one configuration owner and one row-decoration observer.
const panelDetailOptions = [
  ["gradient", "Degradê suave", "Soft gradient"],
  ["none", "Nenhum", "None"],
  ["recess", "Rebaixo", "Inset channel"],
  ["branches", "Conexões curvas", "Curved connections"],
  ["wave", "Ondulação suave", "Soft wave"],
  ["corners", "Cantos internos", "Inner corners"],
  ["numbers", "Numeração discreta", "Subtle numbering"],
  ["hover", "Cor no hover", "Color on hover"],
  ["segments", "Linha segmentada", "Segmented line"],
  ["capsule", "Cápsula vertical", "Vertical capsule"],
  ["arcs", "Arcos por linha", "Row arcs"],
  ["glow", "Luz localizada", "Localized light"],
];
const panelColorPresets = ["#7899bc", "#7a9e88", "#a28aad", "#ba9971", "#b47d88", "#7b9e9e"];
const panelFontOptions = [
  ["math", "Cambria Math", '"Cambria Math", serif'],
  ["georgia", "Georgia", 'Georgia, "Cambria Math", serif'],
  ["times", "Times New Roman", '"Times New Roman", "Cambria Math", serif'],
  ["sans", "Segoe UI", '"Segoe UI", "Cambria Math", sans-serif'],
  ["mono", "Consolas", 'Consolas, "Cambria Math", monospace'],
];
(() => {
  const settings = document.createElement("section");
  settings.className = "hy-appearance-settings";
  root.querySelector("#editor-settings").append(settings);
  const options = panelDetailOptions
    .map(([value, pt, en]) => {
      translations[pt] = en;
      return { value, pt };
    })
    .sort((a, b) => (a.value === "none" ? -1 : b.value === "none" ? 1 : 0));
  Object.assign(translations, {
    Aparência: "Appearance",
    "Traço externo": "Outer marker",
    "Detalhe interno": "Inner detail",
    "Borda colorida": "Colored border",
  });
  for (const selector of [".hy-editor", ".hy-argument-panel"]) {
    const decoration = document.createElement("span");
    decoration.className = "hy-internal-decoration";
    decoration.setAttribute("aria-hidden", "true");
    root.querySelector(selector).append(decoration);
  }
  Object.assign(translations, {
    "Tente segurar os olhinhos": "Try holding the eye buttons",
    "Ajuda sobre aparência": "Appearance help",
    "Cor da janela": "Panel color",
  });
  function config(key) {
    ui.panelAppearance ??= {};
    return (ui.panelAppearance[key] ??= { detail: "none", external: true, border: false });
  }
  function apply() {
    if (ui.externalMarker === undefined) ui.externalMarker = true;
    if (!panelDetailOptions.some(([value]) => value === ui.internalDetail))
      ui.internalDetail = "none";
    root.dataset.externalMarker = String(ui.externalMarker);
    root.dataset.internalDetail = ui.internalDetail;
    root.dataset.colorPanelBorder = String(ui.colorPanelBorder === true);
    for (const type of ["premise", "conclusion"]) {
      const fallback = type === "premise" ? "#7899bc" : "#7a9e88";
      let color = ui[type + "Color"];
      if (!/^#[0-9a-f]{6}$/i.test(color || "")) color = fallback;
      ui[type + "Color"] = color;
      root.style.setProperty("--" + type + "-color", color);
      root.style.setProperty(
        "--soft-" + type + "-marker",
        color === fallback
          ? type === "premise"
            ? "light-dark(#b3c6e5,#6d8ebd)"
            : "light-dark(#b2cdbf,#6e9a84)"
          : "color-mix(in srgb," + color + " 55%,light-dark(#f9fafc,#282c33))",
      );
    }
    for (const [key, selector] of [
      ["editor", ".hy-editor"],
      ["preview", ".hy-argument-panel"],
    ]) {
      const panel = root.querySelector(selector),
        c = config(key);
      panel.dataset.internalDetail = c.detail;
      panel.dataset.externalMarker = String(c.external);
      panel.dataset.colorPanelBorder = String(c.border);
      const font = panelFontOptions.find(([id]) => id === c.font) || panelFontOptions[0];
      root.style.setProperty("--" + key + "-formula-font", font[2]);
    }
    root.querySelectorAll("#rows>.hy-row").forEach((row, i) => {
      let mark = row.querySelector(".hy-row-decoration");
      if (!mark) {
        mark = document.createElement("span");
        mark.className = "hy-row-decoration";
        mark.setAttribute("aria-hidden", "true");
        row.append(mark);
      }
      const detail = config("editor").detail;
      mark.hidden = !["numbers", "branches", "arcs", "hover"].includes(detail);
      const text = detail === "numbers" ? String(i + 1) : "";
      if (mark.textContent !== text) mark.textContent = text;
    });

  }
  let activeAppearance = null;
  function open(key, container) {
    const previous = activeAppearance;
    previous?.dismiss();
    if (previous?.key === key && !container && !previous.inline) return;
    const en = ui.language === "en",
      c = config(key),
      dialog = document.createElement(container ? "section" : "dialog");
    dialog.className = "hy-panel-appearance-dialog" + (container ? " hy-panel-appearance-inline" : "");
    dialog.innerHTML =
      '<div class="hy-settings-head"><h2 style="font-size:14px;margin:0">' +
      (key === "editor" ? (en ? "Premises and conclusions" : "Premissas e conclusões") : (en ? "Argument" : "Argumento")) +
      '</h2><button class="hy-button hy-icon-button" data-close aria-label="' +
      (en ? "Close" : "Fechar") +
      '">×</button></div>';
    const colorKey = key === "editor" ? "premiseColor" : "conclusionColor",
      colorLabel = document.createElement("label");
    colorLabel.textContent = en ? "Panel color" : "Cor da janela";
    colorLabel.className = "hy-panel-color-label";
    const color = document.createElement("input");
    color.type = "color";
    color.id = "panel-custom-color-" + key;
    colorLabel.htmlFor = color.id;
    color.value = ui[colorKey];
    dialog.append(colorLabel);
    const swatches = document.createElement("div");
    swatches.className = "hy-color-options";
    for (const value of panelColorPresets) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hy-color-swatch";
      b.style.setProperty("--swatch", value);
      b.setAttribute("aria-label", value);
      b.onclick = () => {
        color.value = value;
        color.dispatchEvent(new Event("input"));
      };
      swatches.append(b);
    }
    const customColor = document.createElement("label");
    customColor.className = "hy-custom-color-swatch";
    customColor.style.setProperty("--custom-color", color.value);
    color.setAttribute("aria-label", interfaceText("Escolher qualquer cor", "Choose any color"));
    customColor.dataset.hintText = color.getAttribute("aria-label");
    const currentColor = document.createElement("span");
    currentColor.className = "hy-custom-color-value";
    currentColor.setAttribute("aria-hidden", "true");
    customColor.append(currentColor, color);
    swatches.append(customColor);
    dialog.append(swatches);
    color.oninput = () => {
      ui[colorKey] = color.value;
      customColor.style.setProperty("--custom-color", color.value);
      swatches.querySelectorAll(".hy-color-swatch").forEach(button => button.setAttribute("aria-pressed", String(button.getAttribute("aria-label").toLowerCase() === color.value.toLowerCase())));
      root.dispatchEvent(new Event("lp-ui-colors"));
      saveUI();
    };
    swatches.querySelectorAll(".hy-color-swatch").forEach(button => button.setAttribute("aria-pressed", String(button.getAttribute("aria-label").toLowerCase() === color.value.toLowerCase())));
    for (const [property, pt, english] of [
      ["external", "Traço externo", "Outer marker"],
      ["border", "Borda colorida", "Colored border"],
    ]) {
      const label = document.createElement("label");
      label.textContent = en ? english : pt;
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = c[property];
      input.onchange = () => {
        c[property] = input.checked;
        apply();
        saveUI();
      };
      label.append(input);
      dialog.append(label);
    }
    const label = document.createElement("label");
    label.textContent = en ? "Inner detail" : "Detalhe interno";
    const choice = document.createElement("select");
    choice.setAttribute("aria-label", label.textContent);
    for (const option of options) {
      const o = document.createElement("option");
      o.value = option.value;
      o.textContent = en ? translations[option.pt] || option.pt : option.pt;
      choice.append(o);
    }
    choice.value = c.detail;
    choice.onchange = () => {
      c.detail = choice.value;
      ui.internalDetail = c.detail;
      root.dispatchEvent(new Event("lp-ui-colors"));
      saveUI();
    };
    const detailRow = document.createElement("div");
    detailRow.className = "hy-panel-detail-row";
    label.id = "panel-detail-label";
    dialog.append(detailRow, choice);
    choice.style.display = "none";
    const picker = document.createElement("details");
    picker.className = "hy-detail-picker";
    const summary = document.createElement("summary");
    summary.setAttribute("aria-labelledby", label.id);
    summary.textContent = choice.selectedOptions[0].textContent;
    const list = document.createElement("div");
    list.className = "hy-detail-options";
    for (const option of choice.options) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = option.textContent;
      b.setAttribute("aria-pressed", String(option.value === choice.value));
      b.onclick = () => {
        choice.value = option.value;
        choice.dispatchEvent(new Event("change"));
        summary.textContent = option.textContent;
        list
          .querySelectorAll("button")
          .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        list.hidePopover();
        picker.open = false;
      };
      list.append(b);
    }
    list.setAttribute("popover", "manual");
    summary.setAttribute("aria-expanded", "false");
    summary.onclick = (e) => {
      e.preventDefault();
      if (list.matches(":popover-open")) {
        list.hidePopover();
        summary.setAttribute("aria-expanded", "false");
        return;
      }
      list.style.colorScheme = root.style.colorScheme;
      list.showPopover();
      const bounds = summary.getBoundingClientRect();
      list.style.width = bounds.width + "px";
      list.style.left = bounds.left + "px";
      list.style.top = Math.min(bounds.bottom + 6, innerHeight - 270) + "px";
      summary.setAttribute("aria-expanded", "true");
    };
    picker.append(summary);
    detailRow.append(label, picker);
    dialog.append(list);
    const fontRow = document.createElement("label"),
      fontChoice = document.createElement("select"),
      fontSample = document.createElement("div");
    fontRow.className = "hy-panel-font-row";
    fontRow.textContent = en ? "Formula font" : "Fonte das fórmulas";
    fontChoice.setAttribute("aria-label", fontRow.textContent);
    for (const [id, name, family] of panelFontOptions) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = name;
      option.style.fontFamily = family;
      fontChoice.append(option);
    }
    fontChoice.value = panelFontOptions.some(([id]) => id === c.font) ? c.font : "math";
    fontSample.className = "hy-panel-font-sample";
    fontSample.textContent = "∀x(P(x) → Q(x)) ∧ ¬R";
    const updateFont = () => {
      fontSample.style.fontFamily = panelFontOptions.find(([id]) => id === fontChoice.value)[2];
    };
    fontChoice.onchange = () => {
      c.font = fontChoice.value;
      updateFont();
      apply();
      if (key === "editor") drawRows();
      saveUI();
    };
    updateFont();
    fontRow.append(fontChoice);
    dialog.append(fontRow, fontSample);
    list.classList.add("hy-floating-detail-options");
    const settingsPanel = root.querySelector("#editor-settings");
    const fromSettings = settingsPanel.matches(":popover-open");
    const listeners = new AbortController();
    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      listeners.abort();
      if (list.matches(":popover-open")) list.hidePopover();
      if (dialog.matches(":popover-open")) dialog.hidePopover();
      dialog.remove();
      if (activeAppearance?.dismiss === dismiss) activeAppearance = null;
    };
    activeAppearance = { key, dismiss, inline: Boolean(container) };
    dialog.dataset.panel = key;
    dialog.querySelector("[data-close]").onclick = dismiss;
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        dismiss();
    });
    if (container) container.replaceChildren(dialog);
    else {
      (fromSettings ? settingsPanel : root).append(dialog);
      dialog.setAttribute("popover", "manual");
      dialog.showPopover();
    }
    document.addEventListener("pointerdown", event => {
      if (container || dialog.contains(event.target)) return;
      if (event.target.closest("#editor-settings button,#editor-settings input,#editor-settings select,#editor-settings summary")) return;
      dismiss();
    }, { capture: true, signal: listeners.signal });
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (container && !list.matches(":popover-open")) return;
      event.preventDefault();
      event.stopPropagation();
      if (list.matches(":popover-open")) { list.hidePopover(); summary.setAttribute("aria-expanded", "false"); }
      else dismiss();
    }, { capture: true, signal: listeners.signal });
    dialog.addEventListener("toggle", event => { if (event.newState === "closed") dismiss(); }, { signal: listeners.signal });
    if (fromSettings || container) settingsPanel.addEventListener("toggle", event => {
      if (event.newState === "closed") dismiss();
    }, { signal: listeners.signal });
  }
  root.addEventListener("lp-open-panel-appearance", event => {
    const key=event.detail?.key;
    const container = event.detail?.container;
    if (container && (!(container instanceof HTMLElement) || !root.querySelector('#settings-panels')?.contains(container))) return;
    if (["editor","preview"].includes(key)) open(key, container);
  });
  for (const key of ["editor", "preview"]) {
    const eye = root.querySelector("[data-action=" + key + "]");
    let timer,
      held = false;
    eye.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      held = false;
      timer = setTimeout(() => {
        held = true;
        open(key);
      }, getHoldDelay());
    });
    for (const event of ["pointerup", "pointercancel", "pointerleave"])
      eye.addEventListener(event, () => clearTimeout(timer));
    eye.addEventListener(
      "click",
      (e) => {
        if (held) {
          e.preventDefault();
          e.stopImmediatePropagation();
          held = false;
        }
      },
      true,
    );
  }
  new MutationObserver(apply).observe(rowsContainer, { childList: true });
  root.addEventListener("lp-ui-colors", apply);
  root.querySelector("#settings-language").addEventListener("click", apply);
  apply();
  applyLanguage();
})();
