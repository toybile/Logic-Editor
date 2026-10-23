const root = document.querySelector("#lp-hybrid");
// Show the portfolio return control only when opened by its wrapper.
if (new URLSearchParams(location.search).get("from") === "portfolio") {
  const home = document.createElement("a");
  home.href = "https://toybile.github.io/";
  home.target = "_top";
  home.className = "hy-button hy-icon-button hy-home";
  home.setAttribute("aria-label", "Todas as criações");
  home.title = "Todas as criações";
  home.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7"/></svg>';
  root.querySelector(".hy-title").prepend(home);
}

const icons = {
  "panel-left": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off":
    '<path d="m3 3 18 18M10.6 5.1A13 13 0 0 1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3.1 4M6.5 6.5A20 20 0 0 0 2 12s3.5 7 10 7a13 13 0 0 0 5.5-1.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
};
function uiIcon(name) {
  return '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[name] + "</svg>";
}
let ui = {
  focus: false,
  theme: "light",
  editor: true,
  preview: true,
  writingMode: "continuous",
  language: "pt-BR",
  premiseColor: "#7899bc",
  conclusionColor: "#7a9e88",
  hoverDelaySeconds: 0.2,
  hoverHintsEnabled: true,
  holdDelaySeconds: 0.5,
};
const preferredBrowserLanguage =
  (navigator.languages || [navigator.language]).find((lang) => /^(pt|en)(?:-|$)/i.test(lang)) ||
  "en";
const browserLanguage = /^pt(?:-|$)/i.test(preferredBrowserLanguage) ? "pt-BR" : "en";
if (!LPReturningUser)
  Object.assign(ui, {
    language: browserLanguage,
    hoverDelaySeconds: 0.5,
    holdDelaySeconds: 0.5,
    roleDisplay: "names",
    compactPrefixSpacing: true,
    initialLayout: "guided",
  });
try {
  Object.assign(ui, JSON.parse(localStorage.getItem("formal-argument-ui")) || {});
} catch {}
function hoverHintsEnabled() {
  return ui.hoverHintsEnabled !== false;
}
function getHoldDelay() {
  const value = Number(ui.holdDelaySeconds);
  return Math.round(Math.max(0.01, Math.min(1, Number.isFinite(value) ? value : 0.5)) * 1000);
}
function getHoverDelay() {
  const value = Number(ui.hoverDelaySeconds);
  return Math.round(Math.max(0.01, Math.min(1, Number.isFinite(value) ? value : 0.2)) * 1000);
}
function saveUI() {
  try {
    localStorage.setItem("formal-argument-ui", JSON.stringify(ui));
  } catch {}
}
function setSection(section, open) {
  ui[section] = open;
  if (section === 'editor') {
    const mode = root.querySelector('#writing-mode-toggle');
    if (mode) mode.hidden = !open;
  }
  const panel = document.querySelector(
    section === "editor" ? "#hy-editor-content" : "#hy-argument",
  );
  panel.dataset.open = String(open);
  panel.inert = !open;
  panel.setAttribute("aria-hidden", String(!open));
  const button = root.querySelector('[data-action="' + section + '"]');
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute(
    "aria-label",
    (open ? "Ocultar " : "Mostrar ") +
      (section === "editor" ? "premissas e conclusões" : "argumento"),
  );
  button.innerHTML = uiIcon(open ? "eye" : "eye-off");
  if (section === "editor") {
    const caps = root.querySelector("#caps-lock");
    if (caps) caps.hidden = !open;
  }
  if (section === "preview") {
    const validation = root.querySelector(".hy-logic-button");
    if (validation) { validation.hidden = !open; validation.inert = !open; }
    const area = root.querySelector(".hy-logic-area");
    if (area) area.hidden = !open;
    const tools = root.querySelector(".hy-tools");
    tools.hidden = !open;
    tools.inert = !open;
  }
  saveUI();
}
function isDarkTheme(theme = ui.theme) { return ["dark", "indigo-dark", "petroleum", "graphite"].includes(theme); }
const editorThemeChoices = [
  ["light", "Claro original", "Original light"],
  ["dark", "Escuro original", "Original dark"],
  ["indigo-light", "Índigo claro", "Indigo light"],
  ["indigo-dark", "Índigo escuro", "Indigo dark"],
  ["petroleum", "Petróleo e turquesa", "Petroleum and turquoise"],
  ["graphite", "Grafite e âmbar", "Graphite and amber"],
  ["sand", "Areia e azul", "Sand and blue"],
  ["sage", "Sálvia e oliva", "Sage and olive"],
];
if (!editorThemeChoices.some(([value]) => value === ui.theme)) ui.theme = "light";
const themeChoices = document.createElement("fieldset");
themeChoices.className = "hy-theme-choices";
const themeLegend = document.createElement("legend");
const themeToggle=document.createElement("button");
themeToggle.type="button";themeToggle.className="hy-theme-section-toggle";
const themeToggleLabel=document.createElement("span");themeToggleLabel.textContent=interfaceText("Temas","Themes");
themeToggle.append(themeToggleLabel);
themeToggle.insertAdjacentHTML("beforeend",'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>');
themeLegend.append(themeToggle);themeChoices.append(themeLegend);
const themeSystemScheme=matchMedia("(prefers-color-scheme: dark)");
const themePartners={light:"dark",dark:"light","indigo-light":"indigo-dark","indigo-dark":"indigo-light",sand:"graphite",graphite:"sand",sage:"petroleum",petroleum:"sage"};
function resolveThemeScheme(mode) {
  const dark=mode==="auto"?themeSystemScheme.matches:mode==="dark";
  if(isDarkTheme()!==dark)ui.theme=themePartners[ui.theme];
}
themeSystemScheme.addEventListener("change",()=>{if(ui.themeMode==="auto")applyUI();});
function restoreThemeAppearance() {
  ui.theme="light";ui.themeMode="light";delete ui.backgroundTranslucency;applyUI();
}
function createThemeOptions() {
  const options=document.createElement("div");options.className="hy-theme-options";
  const modeLabel=document.createElement("h3");modeLabel.className="hy-theme-group-title";modeLabel.textContent=interfaceText("Modo de exibição","Display mode");
  const modes=document.createElement("div");modes.className="hy-theme-modes";modes.setAttribute("role","group");modes.setAttribute("aria-label",modeLabel.textContent);
  for(const [mode,pt,en,icon] of [["auto","Automático","Automatic",'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'],["light","Claro","Light",icons.sun],["dark","Escuro","Dark",icons.moon]]) {
    const button=document.createElement("button");button.type="button";button.className="hy-theme-mode";button.dataset.themeMode=mode;
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icon+'</svg>';
    const caption=document.createElement("span");caption.textContent=interfaceText(pt,en);button.append(caption);
    button.onclick=()=>{ui.themeMode=mode;resolveThemeScheme(mode);applyUI();};modes.append(button);
  }
  const modeNote=document.createElement("p");modeNote.className="hy-theme-mode-note";
  options.append(modeLabel,modes,modeNote);
  const translucency=document.createElement("label");translucency.className="hy-theme-translucency";
  const text=document.createElement("span");text.className="hy-theme-translucency-copy";
  const caption=document.createElement("strong");caption.textContent=interfaceText("Fundo translúcido","Translucent background");
  const description=document.createElement("span");description.textContent=interfaceText("Luz e cores suaves sob os painéis.","Soft light and colors beneath the panels.");text.append(caption,description);
  const status=document.createElement("span");status.className="hy-theme-translucency-status";
  const control=document.createElement("input");control.type="checkbox";control.className="hy-theme-translucency-input";control.setAttribute("role","switch");control.setAttribute("aria-label",caption.textContent);
  control.checked=ui.backgroundTranslucency ?? !["light","dark"].includes(ui.theme);
  control.onchange=()=>{ui.backgroundTranslucency=control.checked;applyUI();};
  translucency.append(text,status,control);options.append(translucency);
  const title=document.createElement("h3");title.className="hy-theme-group-title";title.textContent=interfaceText("Temas","Themes");options.append(title);
  const grid=document.createElement("div");grid.className="hy-theme-grid";
  for(const dark of [false,true]) {
    const column=document.createElement("section");column.className="hy-theme-column";column.dataset.scheme=dark?"dark":"light";
    const heading=document.createElement("h4");heading.textContent=dark?interfaceText("Escuros","Dark themes"):interfaceText("Claros","Light themes");column.append(heading);
    editorThemeChoices.filter(([value])=>isDarkTheme(value)===dark).forEach(([value,pt,en])=>{
      const choice=document.createElement("button");choice.type="button";choice.className="hy-theme-option";choice.dataset.themeValue=value;
      const swatch=document.createElement("span");swatch.className="hy-theme-swatch";swatch.setAttribute("aria-hidden","true");
      swatch.innerHTML='<span class="hy-theme-mini-bar"></span><span class="hy-theme-mini-side"></span><span class="hy-theme-mini-line"></span><span class="hy-theme-mini-line hy-theme-mini-short"></span>';
      const name=document.createElement("span");name.textContent=interfaceText(pt,en);
      choice.append(swatch,name);choice.onclick=()=>{ui.theme=value;ui.themeMode=isDarkTheme(value)?"dark":"light";applyUI();};column.append(choice);
    });grid.append(column);
  }
  const footer=document.createElement("div");footer.className="hy-theme-actions";
  const reset=document.createElement("button");reset.type="button";reset.className="hy-button hy-theme-reset";reset.textContent=interfaceText("Restaurar padrão","Restore default");reset.onclick=restoreThemeAppearance;
  footer.append(reset);options.append(grid,footer);return options;
}
const themeGrid=createThemeOptions();
const themeCollapse=document.createElement("div"),themeCollapseInner=document.createElement("div");
themeCollapse.className="hy-theme-collapse";themeCollapse.id="settings-theme-options";
themeCollapseInner.className="hy-theme-collapse-inner";
themeCollapseInner.append(themeGrid);themeCollapse.append(themeCollapseInner);themeChoices.append(themeCollapse);
themeToggle.setAttribute("aria-controls",themeCollapse.id);
function setThemeSectionOpen(open) {
  themeToggle.setAttribute("aria-expanded",String(open));themeCollapse.dataset.open=String(open);
  themeCollapse.inert=!open;themeCollapse.setAttribute("aria-hidden",String(!open));
}
setThemeSectionOpen(ui.themeSectionOpen!==false);
themeToggle.onclick=()=>{ui.themeSectionOpen=themeToggle.getAttribute("aria-expanded")!=="true";setThemeSectionOpen(ui.themeSectionOpen);saveUI();};
root.querySelector(".hy-settings-switches").after(themeChoices);
function applyUI() {
  if(ui.themeMode==="auto")resolveThemeScheme("auto");
  root.dispatchEvent(new Event("lp-ui-colors"));
  root.dataset.focus = String(ui.focus);
  root.dataset.theme=ui.theme;
  document.documentElement.dataset.editorTheme=ui.theme;
  root.dataset.palette = ["light", "dark"].includes(ui.theme) ? "original" : "ambient";
  document.documentElement.dataset.editorPalette = root.dataset.palette;
  const translucent=ui.backgroundTranslucency ?? root.dataset.palette === "ambient";
  root.dataset.translucency=String(translucent);
  root.querySelectorAll(".hy-theme-translucency-input").forEach(control=>control.checked=translucent);
  root.querySelectorAll(".hy-theme-mode").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.themeMode===(ui.themeMode==="auto"?"auto":isDarkTheme()?"dark":"light"))));
  root.querySelectorAll(".hy-theme-translucency-status").forEach(label=>label.textContent=translucent?interfaceText("Ativado","On"):interfaceText("Desativado","Off"));
  root.querySelectorAll(".hy-theme-mode-note").forEach(note=>note.textContent=ui.themeMode==="auto"?interfaceText("Acompanha o tema do navegador.","Follows your browser theme."):interfaceText("Escolha uma tonalidade abaixo.","Choose a palette below."));
  const paletteStyle = getComputedStyle(root);
  for (const token of ["paper", "ink", "edge"]) document.documentElement.style.setProperty("--editor-hint-" + token, paletteStyle.getPropertyValue("--" + token));
  root.style.colorScheme = isDarkTheme() ? "dark" : "light";
  root.querySelectorAll(".hy-theme-option").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.themeValue===ui.theme)));
  document.documentElement.style.colorScheme = root.style.colorScheme;
  const side = root.querySelector(".hy-side");
  side.inert = ui.focus;
  side.setAttribute("aria-hidden", String(ui.focus));
  const focus = root.querySelector('[data-action="focus"]');
  focus.setAttribute("aria-expanded", String(!ui.focus));
  focus.setAttribute("aria-label", ui.focus ? "Mostrar biblioteca" : "Ocultar biblioteca");
  setSection("editor", ui.editor);
  setSection("preview", ui.preview);
  saveUI();
}
root.querySelector('[data-action="editor"]').onclick = () => setSection("editor", !ui.editor);
root.querySelector('[data-action="preview"]').onclick = () => setSection("preview", !ui.preview);
const focusButton = root.querySelector('[data-action="focus"]');
focusButton.onmousedown = (e) => e.preventDefault();
focusButton.onclick = (e) => {
  const start = active?.selectionStart,
    end = active?.selectionEnd;
  closeNotations();
  ui.focus = !ui.focus;
  applyUI();
  if (active && ui.editor && e.detail > 0) {
    active.focus();
    active.setSelectionRange(start, end);
  }
};
document.querySelector("#add-line").addEventListener("click", () => setSection("editor", true));
applyUI();
for (const area of ["library", "writing"]) {
  const input = document.querySelector("#scale-" + area),
    output = document.querySelector("#scale-" + area + "-value");
  let saved = 100;
  try {
    saved = Number(localStorage.getItem("formal-size-" + area)) || 100;
  } catch {}
  input.value = Math.max(80, Math.min(150, saved));
  const resize = () => {
    const value = Number(input.value);
    root.style.setProperty("--" + area + "-scale", String(value / 100));
    output.value = value + "%";
    input.style.setProperty("--range-fill", ((value - 80) / 70) * 100 + "%");
    input.setAttribute("aria-valuetext", value + "%");
    try {
      localStorage.setItem("formal-size-" + area, String(value));
    } catch {}
  };
  const buttons = root.querySelectorAll('[data-scale="' + area + '"]');
  const refresh = () => {
    resize();
    buttons.forEach(
      (button) =>
        (button.disabled =
          Number(input.value) + Number(button.dataset.step) < 80 ||
          Number(input.value) + Number(button.dataset.step) > 150),
    );
  };
  input.addEventListener("input", refresh);
  buttons.forEach(
    (button) =>
      (button.onclick = () => {
        input.value = Math.max(
          80,
          Math.min(150, Number(input.value) + Number(button.dataset.step)),
        );
        refresh();
      }),
  );
  refresh();
}

drawRows();
render();

const argumentTabs = document.querySelector(".hy-argument-tabs");
window.addEventListener("resize", hideArgumentTools);
window.addEventListener("scroll", hideArgumentTools, true);
document.addEventListener("pointerdown", event => {
  if (!event.target.closest(".hy-tab-shell,.hy-tab-tools")) hideArgumentTools();
});
argumentTabs.addEventListener("pointerdown", startArgumentTabDrag);
window.addEventListener("pointermove", moveArgumentTabDrag, { passive: false });
window.addEventListener("pointerup", finishArgumentTabDrag);
window.addEventListener("pointercancel", finishArgumentTabDrag);
argumentTabs.addEventListener("lostpointercapture", finishArgumentTabDrag);
const renameDialog = document.querySelector("#rename-dialog");
document.querySelector("#rename-form").onsubmit = (event) => {
  event.preventDefault();
  commitArgumentName(renameId, document.querySelector("#rename-name").value);
  renameDialog.close();
};
renameDialog
  .querySelectorAll("[data-rename-cancel]")
  .forEach((button) => (button.onclick = () => renameDialog.close()));
renameDialog.addEventListener("close", () => {
  const id = renameId;
  renameId = null;
  (compactArgumentView ? document.querySelector("#argument-select") : document.getElementById("tab-" + id))?.focus();
});
drawArgumentTabs();

document.querySelector("#argument-view-toggle").onclick = toggleArgumentView;
const argumentPickerMenu = document.querySelector("#argument-options");
const argumentPickerButton = document.querySelector("#argument-select");
argumentPickerMenu.addEventListener("beforetoggle", event => {
  if (event.newState === "open") positionArgumentPicker();
  else { hideArgumentTools(); hideArgumentCardEditor(); finishArgumentCardDrag({}); }
  argumentPickerButton.setAttribute("aria-expanded", String(event.newState === "open"));
});
argumentPickerButton.onkeydown = event => {
  if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
  event.preventDefault();
  argumentPickerMenu.showPopover();
  const choices = [...argumentPickerMenu.querySelectorAll('[role="menuitemradio"]')];
  (choices.find(button => button.getAttribute("aria-checked") === "true") || choices[0])?.focus();
};
argumentPickerMenu.onkeydown = event => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const choices = [...argumentPickerMenu.querySelectorAll('[role="menuitemradio"]')];
  const index = choices.findIndex(button => button.parentElement.contains(document.activeElement));
  const next = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length;
  choices[next]?.focus();
};
window.addEventListener("resize", () => { if (argumentPickerMenu.matches(":popover-open")) positionArgumentPicker(); });
document.querySelector("#new-argument").onmousedown = (event) => event.preventDefault();
document.querySelector("#new-argument").onclick = createArgument;
const translations = interfaceLanguagePairs;
const reverseTranslations = interfaceLanguageReverse;
function translated(text) {
  const words = text.trim(),
    english = ui.language === "en";
  const dict = english ? translations : reverseTranslations;
  let value = dict[words];
  if (value === undefined) {
    let match;
    if (english && (match = words.match(/^Expressão da linha (\d+)$/)))
      value = "Expression on line " + match[1];
    else if (!english && (match = words.match(/^Expression on line (\d+)$/)))
      value = "Expressão da linha " + match[1];
    else if (
      english &&
      (match = words.match(/^Linha (\d+): (conclusão|premissa)\. Alternar tipo$/))
    )
      value =
        "Line " +
        match[1] +
        ": " +
        (match[2] === "conclusão" ? "conclusion" : "premise") +
        ". Toggle type";
    else if (!english && (match = words.match(/^Line (\d+): (conclusion|premise)\. Toggle type$/)))
      value =
        "Linha " +
        match[1] +
        ": " +
        (match[2] === "conclusion" ? "conclusão" : "premissa") +
        ". Alternar tipo";
    else if (
      english &&
      (match = words.match(/^Mover linha (\d+)\. Arraste ou use as setas do teclado\.$/))
    )
      value = "Move line " + match[1] + ". Drag or use the arrow keys.";
    else if (!english && (match = words.match(/^Move line (\d+)\. Drag or use the arrow keys\.$/)))
      value = "Mover linha " + match[1] + ". Arraste ou use as setas do teclado.";
  }
  if (value === undefined && english && /^Excluir Argumento \d+$/.test(words))
    value = words.replace("Excluir Argumento", "Delete Argument");
  else if (value === undefined && !english && /^Delete Argument \d+$/.test(words))
    value = words.replace("Delete Argument", "Excluir Argumento");
  if (value === undefined && english && /^Argumento \d+$/.test(words))
    value = words.replace("Argumento", "Argument");
  else if (value === undefined && !english && /^Argument \d+$/.test(words))
    value = words.replace("Argument", "Argumento");
  if (value === undefined && words.includes(" · ")) {
    const [operation, ...rest] = words.split(" · ");
    if (dict[operation]) value = dict[operation] + " · " + rest.join(" · ");
  }
  if (value === undefined) {
    for (const separator of [" — ", ": "]) {
      const split = words.indexOf(separator);
      if (split < 0) continue;
      const prefix = words.slice(0, split);
      const suffix = words.slice(split + separator.length);
      if (dict[prefix]) value = dict[prefix] + separator + suffix;
      else if (separator === ": " && dict[prefix + ":"]) value = dict[prefix + ":"] + " " + suffix;
      else if (separator === " — " && dict[suffix]) value = prefix + separator + dict[suffix];
      if (value !== undefined) break;
    }
  }
  return value === undefined ? text : text.replace(words, value);
}
const languageFlags = {
  pt: '<svg viewBox="0 0 30 20" aria-hidden="true" style="stroke:none;width:26px;height:18px"><rect width="30" height="20" rx="2" fill="#229e45"/><path d="M15 2 28 10 15 18 2 10Z" fill="#ffdf42"/><circle cx="15" cy="10" r="5" fill="#24459b"/><path d="M10.5 8.5q5-1 9 3" fill="none" stroke="#fff" stroke-width="1"/></svg>',
  en: '<svg viewBox="0 0 30 20" aria-hidden="true" style="stroke:none;width:26px;height:18px"><rect width="30" height="20" rx="2" fill="#243b79"/><path d="m0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="5"/><path d="m0 0 30 20M30 0 0 20" stroke="#ce3545" stroke-width="2"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="7"/><path d="M15 0v20M0 10h30" stroke="#ce3545" stroke-width="4"/></svg>',
};
function applyLanguage() {
  const english = ui.language === "en";
  document.documentElement.lang = english ? "en" : "pt-BR";
  document.title = english ? "Logic Editor" : "Editor de Lógica";
  const flag = root.querySelector("#settings-language");
  const code = english ? "en" : "pt";
  if (flag.dataset.language !== code) {
    flag.dataset.language = code;
    flag.innerHTML = languageFlags[code];
  }
  const flagLabel = english ? "Switch to Portuguese (Brazil)" : "Mudar para inglês",
    flagTitle = english ? "International English" : "Português (Brasil)";
  if (flag.getAttribute("aria-label") !== flagLabel) flag.setAttribute("aria-label", flagLabel);
  if (flag.dataset.hintText !== undefined) {
    if (flag.dataset.hintText !== flagTitle) flag.dataset.hintText = flagTitle;
  } else if (flag.title !== flagTitle) flag.title = flagTitle;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (
      node.parentElement.closest(
        "pre,input,textarea,script,style,output,#settings-language,.hy-custom-argument-name,[data-user-content]",
      )
    )
      continue;
    const value = translated(node.nodeValue);
    if (value !== node.nodeValue) node.nodeValue = value;
  }
  const sharedHint = document.querySelector("#lp-shared-hover-hint");
  if (sharedHint) {
    const hintWalker = document.createTreeWalker(sharedHint, NodeFilter.SHOW_TEXT);
    while (hintWalker.nextNode()) {
      const node = hintWalker.currentNode;
      const value = translated(node.nodeValue);
      if (value !== node.nodeValue) node.nodeValue = value;
    }
  }
  root.querySelectorAll("[aria-label],[title],[data-hint-text],[placeholder]").forEach((element) => {
    if (element === flag || element.closest(".hy-custom-argument-name")) return;
    for (const attribute of ["aria-label", "title", "data-hint-text", "placeholder"]) {
      if (attribute === "aria-label" && element.dataset.userLabel === "true") continue;
      const value = element.getAttribute(attribute);
      if (value !== null) {
        const next = translated(value);
        if (next !== value) element.setAttribute(attribute, next);
      }
    }
  });
}
root.querySelector("#settings-language").onclick = () => {
  ui.language = ui.language === "en" ? "pt-BR" : "en";
  applyLanguage();
  saveUI();
};
const languageObserver = new MutationObserver(() => applyLanguage());
languageObserver.observe(root, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ["aria-label", "title", "data-hint-text", "placeholder"],
});
applyLanguage();

if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(
      document.modelContext.registerTool(
        {
          name: "get_argument",
          title: "Read argument",
          description:
            "Read the argument currently displayed in this editor, including its ordered premises and conclusions.",
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true, untrustedContentHint: true },
          execute(input) {
            if (
              !input ||
              typeof input !== "object" ||
              Array.isArray(input) ||
              Object.keys(input).length
            )
              throw new Error("Expected an empty object");
            return {
              rows: rows.map((row) => ({ text: row.text, role: row.role })),
              numbered,
              text: argument(),
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
  } catch {}
}
