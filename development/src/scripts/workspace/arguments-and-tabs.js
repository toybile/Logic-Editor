const numberToggle = document.querySelector("#number-toggle");
try {
  const saved = JSON.parse(localStorage.getItem("formal-argument"));
  if (saved) {
    numbered = saved.numbered !== false;
    if (Array.isArray(saved.rows) && saved.rows.length) {
      rows = saved.rows.map((row) => ({
        text: typeof row.text === "string" ? row.text : "",
        role: row.role === "blank" ? "blank" : row.role === "conclusion" ? "conclusion" : "premise",
      }));
    } else if (saved.premises || saved.conclusion) {
      rows = String(saved.premises || "")
        .split("\n")
        .map((text) => ({ text, role: "premise" }));
      rows.push({ text: String(saved.conclusion || ""), role: "conclusion" });
    }
  }
} catch {}

if (!LPReturningUser) {
  rows = [
    { text: "A → B", role: "premise" },
    { text: "A", role: "premise" },
    { text: "B", role: "conclusion" },
  ];
  numbered = true;
}
let argumentWorkspace = {
  documents: [{ id: "argument-1", name: "Argumento 1", rows, numbered }],
  activeId: "argument-1",
  nextNumber: 2,
};
try {
  const saved = JSON.parse(localStorage.getItem("formal-arguments-v1"));
  if (saved && Array.isArray(saved.documents) && saved.documents.length) {
    const ids = new Set();
    const documents = saved.documents
      .filter(
        (doc) =>
          doc &&
          typeof doc.id === "string" &&
          !ids.has(doc.id) &&
          ids.add(doc.id) &&
          Array.isArray(doc.rows),
      )
      .map((doc, index) => ({
        id: doc.id,
        name: "Argumento " + (index + 1),
        autoNumber: Number.isSafeInteger(doc.autoNumber) && doc.autoNumber > 0 ? doc.autoNumber : undefined,
        logicMode: ['propositional','syllogistic','first-order'].includes(doc.logicMode) ? doc.logicMode : 'propositional',
        customName: typeof doc.customName === "string" ? doc.customName.trim() : "",
        descriptions:
          doc.descriptions && typeof doc.descriptions === "object" ? doc.descriptions : {},
        rows: doc.rows.length
          ? doc.rows.map((row) => ({
              text: typeof row?.text === "string" ? row.text : "",
              role:
                row?.role === "blank"
                  ? "blank"
                  : row?.role === "conclusion"
                    ? "conclusion"
                    : "premise",
            }))
          : [{ text: "", role: "premise" }],
        numbered: doc.numbered !== false,
      }));
    if (documents.length) {
      argumentWorkspace = {
        documents,
        activeId: documents.some((doc) => doc.id === saved.activeId)
          ? saved.activeId
          : documents[0].id,
        nextNumber: Math.max(
          Number.isSafeInteger(saved.nextNumber) ? saved.nextNumber : 1,
          ...documents.map((doc) => Number(doc.name.split(" ")[1]) + 1),
        ),
      };
      const selected = documents.find((doc) => doc.id === argumentWorkspace.activeId);
      rows = selected.rows;
      numbered = selected.numbered;
    }
  }
} catch {}
if (!LPReturningUser) argumentWorkspace.documents[0].customName = "Modus ponens";
function renumberArguments() {
  const used = new Set();
  for (const doc of argumentWorkspace.documents) {
    if (doc.customName) { delete doc.autoNumber; continue; }
    if (Number.isSafeInteger(doc.autoNumber) && doc.autoNumber > 0 && !used.has(doc.autoNumber)) used.add(doc.autoNumber);
    else delete doc.autoNumber;
  }
  let next = 1;
  for (const doc of argumentWorkspace.documents) {
    if (doc.customName) { doc.name=doc.customName; continue; }
    if (!doc.autoNumber) {
      while (used.has(next)) next++;
      doc.autoNumber=next; used.add(next);
    }
    doc.name='Argumento '+doc.autoNumber;
  }
  next=1; while(used.has(next)) next++;
  argumentWorkspace.nextNumber=next;
}
renumberArguments();
function saveArguments() {
  renumberArguments();
  const doc = argumentWorkspace.documents.find((doc) => doc.id === argumentWorkspace.activeId);
  doc.rows = rows;
  doc.numbered = numbered;
  let saved = false;
  try {
    localStorage.setItem("formal-arguments-v1", JSON.stringify(argumentWorkspace));
    saved = true;
  } catch {}
  workspaceEvents.dispatchEvent(new CustomEvent("saved", { detail: { saved } }));
}
function captureArgumentSelection() {
  const doc = argumentWorkspace.documents.find((doc) => doc.id === argumentWorkspace.activeId);
  const index = rows.findIndex(row => rowElements.get(row)?.contains(active));
  if (index >= 0) {
    const fields = [...rowElements.get(rows[index]).querySelectorAll('.hy-block,.hy-continuous-field')];
    doc.selection = { index, blockIndex:fields.indexOf(active), start:active.selectionStart, end:active.selectionEnd };
  }
}
function showArgument(id, focusField = false) {
  if (drag) finishDrag({ pointerId: drag.pointerId });
  captureArgumentSelection();
  saveArguments();
  const doc = argumentWorkspace.documents.find((doc) => doc.id === id);
  if (!doc) return;
  argumentWorkspace.activeId = id;
  rows = doc.rows;
  numbered = doc.numbered;
  drawRows(focusField ? (doc.selection?.index ?? 0) : undefined);
  if (focusField && doc.selection && active) {
    const fields = rowElements.get(rows[doc.selection.index])?.querySelectorAll('.hy-block,.hy-continuous-field');
    const selectedField = fields?.[Math.max(0,Math.min(fields.length-1,doc.selection.blockIndex || 0))];
    if(selectedField){active=selectedField;active.focus();}
    active.setSelectionRange(
      Math.min(doc.selection.start, active.value.length),
      Math.min(doc.selection.end, active.value.length),
    );
  }
  drawArgumentTabs();
  render();
}
let compactArgumentView = false;
try { compactArgumentView = localStorage.getItem("formal-argument-view") === "compact"; } catch {}
function updateArgumentView() {
  const navigation = document.querySelector(".hy-argument-navigation");
  const toggle = document.querySelector("#argument-view-toggle");
  const english = typeof ui !== "undefined" && ui.language === "en";
  const selector = document.querySelector("#argument-select");
  const menu = document.querySelector("#argument-options");
  menu.replaceChildren();
  const list = document.createElement("div");
  list.id = "argument-option-list";
  list.setAttribute("role", "presentation");
  menu.append(list);
  argumentWorkspace.documents.forEach((doc) => {
    const option = document.createElement("button");
    option.type = "button";
    option.dataset.argumentId = doc.id;
    option.setAttribute("role", "menuitemradio");
    option.setAttribute("aria-checked", String(doc.id === argumentWorkspace.activeId));
    const name = document.createElement("span");
    name.textContent = doc.name;
    option.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9ZM14 3v6h6M8 13h8M8 17h5"/></svg>';
    option.append(name);
    if (doc.customName) option.className = "hy-custom-argument-name";
    option.onclick = () => {
      if (Date.now() < cardSuppressUntil) return;
      hideArgumentTools();
      menu.hidePopover();
      showArgument(doc.id);
      selector.focus();
    };
    const item = document.createElement("div");
    item.className = "hy-argument-option";
    item.dataset.argumentId = doc.id;
    option.addEventListener("pointerdown", startArgumentCardDrag);
    item.setAttribute("role", "presentation");
    item.append(option);
    list.append(item);
  });
  const add = document.createElement("button");
  add.type = "button";
  add.className = "hy-argument-grid-add";
  add.setAttribute("aria-label", english ? "Add argument" : "Adicionar argumento");
  add.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';
  add.onclick = () => {
    if (Date.now() < gridAddSuppressUntil) return;
    hideArgumentTools();
    createArgument();
    positionArgumentPicker();
    menu.querySelector('[aria-checked="true"]')?.scrollIntoView({ block: "nearest" });
  };
  add.addEventListener("pointerdown", startArgumentGridAddHold);
  list.append(add);
  const current = argumentWorkspace.documents.find(doc => doc.id === argumentWorkspace.activeId);
  selector.querySelector("span").textContent = current.name;
  selector.querySelector("span").classList.toggle("hy-custom-argument-name", !!current.customName);
  navigation.classList.toggle("hy-compact-arguments", compactArgumentView);
  navigation.querySelector(".hy-argument-tabs").hidden = compactArgumentView;
  document.querySelector("#argument-compact-view").hidden = !compactArgumentView;
  toggle.setAttribute("aria-pressed", String(compactArgumentView));
  toggle.setAttribute("aria-label", compactArgumentView
    ? (english ? "Use underline tabs" : "Usar linha discreta")
    : (english ? "Use compact selector" : "Usar seletor compacto"));
  toggle.querySelector("path").setAttribute("d", compactArgumentView
    ? "M4 5h16v14H4zM9 5v14M15 5v14"
    : "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01");
  const workspace = document.querySelector("#argument-workspace");
  workspace.dataset.userLabel = String(!!current.customName);
  if (compactArgumentView) {
    workspace.removeAttribute("aria-labelledby");
    workspace.setAttribute("aria-label", current.name);
  } else {
    workspace.removeAttribute("aria-label");
    workspace.setAttribute("aria-labelledby", "tab-" + argumentWorkspace.activeId);
  }
}
function toggleArgumentView() {
  hideArgumentTools();
  if (argumentTabDrag) finishArgumentTabDrag({ pointerId: argumentTabDrag.pointerId });
  const navigation = document.querySelector(".hy-argument-navigation");
  const elements = [document.querySelector("#argument-view-toggle"), document.querySelector("#new-argument")];
  const before = elements.map(element => element.getBoundingClientRect());
  elements.forEach(element => element.getAnimations().forEach(animation => animation.cancel()));
  compactArgumentView = !compactArgumentView;
  document.querySelector("#argument-options").hidePopover();
  updateArgumentView();
  try { localStorage.setItem("formal-argument-view", compactArgumentView ? "compact" : "tabs"); } catch {}
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element, index) => {
      const after = element.getBoundingClientRect(), previous = before[index];
      element.animate([{ transform: `translate(${previous.x - after.x}px, ${previous.y - after.y}px)` }, { transform: "translate(0, 0)" }], { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" });
    });
    const content = navigation.querySelector(compactArgumentView ? "#argument-compact-view" : ".hy-argument-tabs");
    content.animate([{ transform: "translateY(4px)", opacity: 0.5 }, { transform: "translateY(0)", opacity: 1 }], { duration: 200, easing: "ease-out" });
  }
}
function positionArgumentPicker() {
  const button = document.querySelector("#argument-select"), menu = document.querySelector("#argument-options");
  const box = button.getBoundingClientRect();
  const gutter = 0;
  menu.style.setProperty("--argument-action-gutter", gutter + "px");
  const width = Math.min(Math.max(box.width, 610), window.innerWidth - 24);
  menu.style.width = width + "px";
  menu.style.left = Math.max(12, Math.min(box.left + box.width / 2 - width / 2, window.innerWidth - width - 12)) + "px";
  menu.style.top = (box.bottom + 8) + "px";
  menu.style.maxHeight = Math.max(100, window.innerHeight - box.bottom - 80) + "px";
}
let openArgumentTools = null;
function hideArgumentTools() {
  if (!openArgumentTools) return;
  clearTimeout(openArgumentTools.timer);
  openArgumentTools.menu.hidePopover();
  openArgumentTools = null;
}
function showArgumentTools(shell, menu) {
  if (argumentTabDrag?.active) return;
  if (openArgumentTools?.menu !== menu) hideArgumentTools();
  const box = shell.getBoundingClientRect();
  menu.showPopover();
  const width = menu.offsetWidth, height = menu.offsetHeight;
  menu.style.left = Math.max(6, Math.min(innerWidth - width - 6, box.left + box.width / 2 - width / 2)) + "px";
  const bottom = menu.classList.contains("hy-argument-card-tools")
    ? document.querySelector("#argument-options").getBoundingClientRect().bottom : box.bottom;
  menu.style.top = Math.min(innerHeight - height - 6, bottom + 3) + "px";
  clearTimeout(openArgumentTools?.timer);
  openArgumentTools = { menu, shell, timer: null };
}
function drawArgumentTabs() {
  hideArgumentTools();
  renumberArguments();
  const tabs = document.querySelector(".hy-argument-tabs");
  tabs.replaceChildren();
  argumentWorkspace.documents.forEach((doc) => {
    const button = document.createElement("button");
    button.type = "button";
    button.id = "tab-" + doc.id;
    button.className =
      "hy-button hy-argument-tab" + (doc.customName ? " hy-custom-argument-name" : "");
    button.textContent = doc.name;
    button.setAttribute("role", "tab");
    const selected = doc.id === argumentWorkspace.activeId;
    button.setAttribute("aria-selected", String(selected));
    button.setAttribute("aria-controls", "argument-workspace");
    button.tabIndex = selected ? 0 : -1;
    button.onmousedown = (event) => event.preventDefault();
    button.onclick = () => {
      if (Date.now() < tabSuppressUntil) return;
      const touch = matchMedia("(pointer: coarse)").matches;
      showArgument(doc.id, !touch);
      if (touch) document.getElementById("tab-" + doc.id)?.focus();
    };
    button.onkeydown = (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const list = argumentWorkspace.documents,
        index = list.findIndex((item) => item.id === doc.id);
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? list.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
      showArgument(list[next].id);
      document.getElementById("tab-" + list[next].id).focus();
    };
    const shell = document.createElement("div");
    shell.className = "hy-tab-shell";
    shell.dataset.argumentId = doc.id;
    shell.setAttribute("role", "presentation");
    shell.append(button);
    tabs.append(shell);
    if (selected)
      document.querySelector("#argument-workspace").setAttribute("aria-labelledby", button.id);
  });
  updateArgumentView();
}

let renameId = null;
function commitArgumentName(id, name) {
  if (typeof name !== "string") return;
  const doc = argumentWorkspace.documents.find((doc) => doc.id === id);
  if (!doc) return;
  doc.customName = name.trim();
  renumberArguments();
  drawArgumentTabs();
  saveArguments();
}
function renameArgument(id) {
  const doc = argumentWorkspace.documents.find((doc) => doc.id === id);
  if (!doc) return;
  renameId = id;
  const dialog = document.querySelector("#rename-dialog"),
    field = document.querySelector("#rename-name");
  field.value = doc.customName || "";
  field.placeholder =
    ui.language === "en" && !doc.customName ? doc.name.replace("Argumento", "Argument") : doc.name;
  dialog.showModal();
  field.focus();
  field.select();
}
async function deleteArgument(id) {
  const index = argumentWorkspace.documents.findIndex((doc) => doc.id === id);
  if (index < 0) return;
  if (drag) finishDrag({ pointerId: drag.pointerId });
  saveArguments();
  const doc = argumentWorkspace.documents[index];
  const english = ui.language === "en";
  if (doc.rows.some((row) => row.text.trim().length)) {
    const name = english && !doc.customName ? doc.name.replace("Argumento", "Argument") : doc.name;
    if (
      !(await confirmDeletion(
        english
          ? "Delete " + name + "? Its text will be permanently removed."
          : "Excluir " + name + "? O texto dele será apagado definitivamente.",
      ))
    )
      return;
  }
  const selected = id === argumentWorkspace.activeId;
  doc.rows.forEach((row) => {
    const state = spacing.get(row);
    if (state) {
      clearTimeout(state.timer);
      state.generated = false;
    }
  });
  argumentWorkspace.documents.splice(index, 1);
  if (!argumentWorkspace.documents.length) {
    const number = argumentWorkspace.nextNumber++;
    argumentWorkspace.documents.push({
      id: "argument-" + crypto.randomUUID(),
      name: "Argumento " + number,
      rows: [
        { text: "", role: "premise" },
        { text: "", role: "premise" },
        { text: "", role: "conclusion" },
      ],
      numbered: true,
    });
  }
  if (selected) {
    const next =
      argumentWorkspace.documents[Math.min(index, argumentWorkspace.documents.length - 1)];
    argumentWorkspace.activeId = next.id;
    rows = next.rows;
    numbered = next.numbered;
    drawRows(0);
  }
  drawArgumentTabs();
  render();
  saveArguments();
}
function createArgument(position = argumentWorkspace.documents.length) {
  const index = argumentWorkspace.nextNumber++;
  const doc = {
    id: "argument-" + crypto.randomUUID(),
    name: "Argumento " + index,
    rows: [
      { text: "", role: "premise" },
      { text: "", role: "premise" },
      { text: "", role: "conclusion" },
    ],
    numbered: true,
  };
  const insertion = Number.isInteger(position)
    ? Math.max(0, Math.min(argumentWorkspace.documents.length, position))
    : argumentWorkspace.documents.length;
  argumentWorkspace.documents.splice(insertion, 0, doc);
  showArgument(doc.id, true);
  document
    .querySelector(compactArgumentView ? "#argument-select" : '.hy-argument-tabs [aria-selected="true"]')
    .scrollIntoView({ block: "nearest", inline: "nearest" });
}

let argumentTabDrag = null,
  tabSuppressUntil = 0;
function reorderArgument(id, destination) {
  const list = argumentWorkspace.documents,
    index = list.findIndex((doc) => doc.id === id);
  if (index < 0) return;
  destination = Math.max(0, Math.min(list.length - 1, destination));
  if (index === destination) return;
  const [doc] = list.splice(index, 1);
  list.splice(destination, 0, doc);
  renumberArguments();
  saveArguments();
}
function arrangeArgumentTabs() {
  const nav = document.querySelector(".hy-argument-tabs"),
    positions = new Map(
      [...nav.children].map((shell) => [shell, shell.getBoundingClientRect().left]),
    ),
    shells = new Map([...nav.children].map((shell) => [shell.dataset.argumentId, shell]));
  let anchor = null;
  for (let i = argumentWorkspace.documents.length - 1; i >= 0; i--) {
    const shell = shells.get(argumentWorkspace.documents[i].id);
    if (shell !== argumentTabDrag?.shell && shell.nextElementSibling !== anchor)
      nav.insertBefore(shell, anchor);
    anchor = shell;
  }
  for (const doc of argumentWorkspace.documents) {
    const shell = shells.get(doc.id),
      button = shell.querySelector("[role=tab]");
    button.textContent = doc.name;
    const before = positions.get(shell);
    shell.getAnimations().forEach((animation) => animation.cancel());
    const delta = before - shell.getBoundingClientRect().left;
    if (delta && !reducedMotion.matches && shell !== argumentTabDrag?.shell)
      shell.animate(
        [{ transform: "translateX(" + delta + "px)" }, { transform: "translateX(0)" }],
        { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
  }
}
function startArgumentTabDrag(event) {
  if (event.target.closest(".hy-tab-tools")) return;
  if (event.button !== 0 || argumentTabDrag || drag) return;
  const shell = event.target.closest(".hy-tab-shell");
  if (!shell) return;
  const box = shell.getBoundingClientRect();
  argumentTabDrag = {
    id: shell.dataset.argumentId,
    shell,
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    startX: event.clientX,
    startY: event.clientY,
    x: event.clientX,
    y: event.clientY,
    offsetX: event.clientX - box.left,
    offsetY: event.clientY - box.top,
    width: box.width,
    height: box.height,
    active: false,
    ghost: null,
    timer: null,
    frame: null,
  };
  const state = argumentTabDrag;
  state.timer = setTimeout(() => {
    if (argumentTabDrag !== state || state.active) return;
    state.held = true;
    state.shell.setPointerCapture(state.pointerId);
    showArgumentCardEditor(state.id,state.shell.querySelector('[role=tab]'));
  },getHoldDelay());
}
function liftArgumentTab() {
  hideArgumentCardEditor();
  const state = argumentTabDrag;
  if (!state || state.active) return;
  hideArgumentTools();
  state.active = true;
  clearTimeout(state.timer);
  state.shell.setPointerCapture(state.pointerId);
  state.shell.classList.add("hy-tab-dragging");
  const ghost = state.shell.cloneNode(true);
  ghost.classList.remove("hy-tab-dragging");
  ghost.classList.add("hy-tab-ghost");
  ghost.setAttribute("aria-hidden", "true");
  ghost.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
  ghost.querySelectorAll("button").forEach((button) => (button.tabIndex = -1));
  ghost.style.width = state.width + "px";
  ghost.style.height = state.height + "px";
  document.querySelector("#lp-hybrid").append(ghost);
  state.ghost = ghost;
  document.body.classList.add("is-dragging");
  moveArgumentTabGhost();
  ghost.getBoundingClientRect();
  ghost.classList.add("lifted");
  state.frame = requestAnimationFrame(argumentTabDragFrame);
}
function moveArgumentTabGhost() {
  const state = argumentTabDrag;
  if (!state?.ghost) return;
  const left = state.x - state.offsetX;
  state.ghost.style.transform = "translate(" + left + "px," + (state.y - state.offsetY) + "px)";
  const nav = document.querySelector(".hy-argument-tabs"),
    list = argumentWorkspace.documents,
    index = list.findIndex((doc) => doc.id === state.id),
    bounds = nav.getBoundingClientRect();
  let destination = index;
  const stableBox = (id) => {
    const shell = [...nav.children].find((node) => node.dataset.argumentId === id);
    return { left: bounds.left + shell.offsetLeft - nav.scrollLeft, width: shell.offsetWidth };
  };
  while (destination + 1 < list.length) {
    const box = stableBox(list[destination + 1].id);
    if (left + state.width <= box.left + box.width * 0.65) break;
    destination++;
  }
  if (destination === index)
    while (destination > 0) {
      const box = stableBox(list[destination - 1].id);
      if (left >= box.left + box.width * 0.35) break;
      destination--;
    }
  if (destination !== index) {
    reorderArgument(state.id, destination);
    arrangeArgumentTabs();
  }
}
function argumentTabDragFrame() {
  const state = argumentTabDrag;
  if (!state?.active) return;
  const nav = document.querySelector(".hy-argument-tabs"),
    box = nav.getBoundingClientRect();
  if (state.x < box.left + 30) nav.scrollLeft -= 8;
  else if (state.x > box.right - 30) nav.scrollLeft += 8;
  moveArgumentTabGhost();
  state.frame = requestAnimationFrame(argumentTabDragFrame);
}
function moveArgumentTabDrag(event) {
  const state = argumentTabDrag;
  if (!state || state.pointerId !== event.pointerId) return;
  state.x = event.clientX;
  state.y = event.clientY;
  if (
    !state.active &&
    Math.hypot(state.x - state.startX, state.y - state.startY) > 5
  )
    liftArgumentTab();
  if (state.active) {
    event.preventDefault();
    moveArgumentTabGhost();
  }
}
function finishArgumentTabDrag(event) {
  const state = argumentTabDrag;
  if (!state || state.pointerId !== event.pointerId) return;
  argumentTabDrag = null;
  clearTimeout(state.timer);
  cancelAnimationFrame(state.frame);
  if (!state.active) {
    if (state.held) {
      tabSuppressUntil=Date.now()+350;
      if (state.shell.hasPointerCapture(state.pointerId)) state.shell.releasePointerCapture(state.pointerId);
      if (event.type==='pointerup') argumentCardEditor?.querySelector('input')?.focus();
      else hideArgumentCardEditor();
    }
    return;
  }
  tabSuppressUntil = Date.now() + 350;
  event.preventDefault?.();
  if (state.shell.hasPointerCapture(state.pointerId))
    state.shell.releasePointerCapture(state.pointerId);
  state.shell.classList.remove("hy-tab-dragging");
  document.body.classList.remove("is-dragging");
  drawArgumentTabs();
  saveArguments();
  if (state.ghost) {
    const target = document
      .getElementById("tab-" + state.id)
      .closest(".hy-tab-shell")
      .getBoundingClientRect();
    state.ghost.style.transition = reducedMotion.matches
      ? "none"
      : "transform .16s ease,opacity .16s ease,scale .16s ease";
    state.ghost.style.transform = "translate(" + target.left + "px," + target.top + "px)";
    state.ghost.classList.remove("lifted");
    setTimeout(() => state.ghost.remove(), reducedMotion.matches ? 0 : 170);
  }
}
let argumentCardDrag = null, cardSuppressUntil = 0;
function startArgumentCardDrag(event) {
  if (event.button !== 0 || argumentCardDrag) return;
  const card = event.currentTarget, box = card.getBoundingClientRect();
  const state = { card, item: card.closest('.hy-argument-option'), id: card.dataset.argumentId,
    pointer: event.pointerId, x: event.clientX, y: event.clientY,
    dx: event.clientX-box.left, dy: event.clientY-box.top, active: false,
    original: argumentWorkspace.documents.map(doc => doc.id) };
  argumentCardDrag = state;
  state.timer = setTimeout(() => {
    if (argumentCardDrag !== state) return;
    state.held = true;
    card.setPointerCapture(state.pointer);
    showArgumentCardEditor(state.id,card);
  }, getHoldDelay());
}
function liftArgumentCard(state) {
  hideArgumentCardEditor();
  state.active = true;
  state.item.classList.add('hy-card-dragging');
  const box = state.card.getBoundingClientRect(), ghost = document.createElement('div');
  ghost.className = 'hy-argument-card-ghost'; ghost.dataset.userContent = '';
  ghost.setAttribute('popover','manual'); ghost.setAttribute('aria-hidden','true');
  ghost.innerHTML = state.card.innerHTML;
  ghost.style.width = box.width+'px'; ghost.style.height = box.height+'px';
  root.append(ghost); ghost.showPopover(); state.ghost=ghost;
}

function positionArgumentCardGhost(x,y) {
  const state = argumentCardDrag;
  if (state?.ghost) state.ghost.style.transform = `translate(${x-state.dx}px,${y-state.dy}px)`;
}
function moveArgumentCardDrag(event) {
  const state = argumentCardDrag;
  if (!state || state.pointer !== event.pointerId) return;
  if (!state.active) {
    const distance=Math.hypot(event.clientX-state.x,event.clientY-state.y);
    if (distance<=6) return;
    clearTimeout(state.timer);
    state.held = true;
    state.card.setPointerCapture(state.pointer);
    liftArgumentCard(state);
  }
  event.preventDefault();
  positionArgumentCardGhost(event.clientX,event.clientY);
  const list = document.querySelector('#argument-option-list');
  const bounds = list.getBoundingClientRect();
  if (event.clientY < bounds.top+28) list.scrollTop -= 12;
  if (event.clientY > bounds.bottom-28) list.scrollTop += 12;
  const items = [...list.querySelectorAll('.hy-argument-option')];
  const target = items.find(item => {
    const b = item.getBoundingClientRect();
    const transform = getComputedStyle(item).transform;
    const matrix = transform === 'none' ? {m41:0,m42:0} : new DOMMatrixReadOnly(transform);
    return event.clientX>=b.left-matrix.m41 && event.clientX<=b.right-matrix.m41 && event.clientY>=b.top-matrix.m42 && event.clientY<=b.bottom-matrix.m42;
  });
  if (!target || target===state.item) return;
  const before = new Map(items.map(item=>[item,item.getBoundingClientRect()]));
  const index = argumentWorkspace.documents.findIndex(doc=>doc.id===target.dataset.argumentId);
  reorderArgument(state.id,index);
  const map = new Map(items.map(item=>[item.dataset.argumentId,item]));
  const add = list.querySelector('.hy-argument-grid-add');
  argumentWorkspace.documents.forEach(doc=>{
    const item=map.get(doc.id); list.insertBefore(item,add);
    item.querySelector('[role="menuitemradio"] span').textContent=doc.name;
  });
  if (!reducedMotion.matches) items.forEach(item=>{
    item.getAnimations().forEach(a=>a.cancel());
    const old=before.get(item), now=item.getBoundingClientRect();
    if (item!==state.item) item.animate([{transform:`translate(${old.x-now.x}px,${old.y-now.y}px)`},{transform:'translate(0,0)'}],{duration:180,easing:'ease-out'});
  });
}
function finishArgumentCardDrag(event) {
  const state=argumentCardDrag;
  if (!state || (event.pointerId!==undefined && state.pointer!==event.pointerId)) return;
  argumentCardDrag=null; clearTimeout(state.timer);
  if (!state.held) return;
  cardSuppressUntil=Date.now()+350;
  if (state.card.hasPointerCapture(state.pointer)) state.card.releasePointerCapture(state.pointer);
  if (!state.active) {
    if (event.type==='pointerup') argumentCardEditor?.querySelector('input')?.focus();
    else hideArgumentCardEditor();
    return;
  }
  state.item.classList.remove('hy-card-dragging');
  if (state.card.hasPointerCapture(state.pointer)) state.card.releasePointerCapture(state.pointer);
  state.ghost?.remove();
  if (event.type==='pointercancel' || event.key==='Escape') {
    const map=new Map(argumentWorkspace.documents.map(doc=>[doc.id,doc]));
    argumentWorkspace.documents=state.original.map(id=>map.get(id));
  }
  drawArgumentTabs(); saveArguments(); positionArgumentPicker();
}
window.addEventListener('pointermove',moveArgumentCardDrag,{passive:false});
window.addEventListener('pointerup',finishArgumentCardDrag);
window.addEventListener('pointercancel',finishArgumentCardDrag);
window.addEventListener('blur',finishArgumentCardDrag);
window.addEventListener('keydown',event=>{if(event.key==='Escape') finishArgumentCardDrag(event);});
let argumentCardEditor = null, argumentGridAddHold = null, gridAddSuppressUntil = 0;
function hideArgumentCardEditor() { argumentCardEditor?.remove(); argumentCardEditor=null; }
function showArgumentCardEditor(id,card) {
  hideArgumentCardEditor();
  const doc=argumentWorkspace.documents.find(doc=>doc.id===id);
  if (!doc) return;
  const panel=document.createElement('div');
  panel.className='hy-argument-card-editor'; panel.setAttribute('popover','manual');
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label',interfaceText('Editar argumento','Edit argument'));
  const form=document.createElement('form'), label=document.createElement('label'), input=document.createElement('input');
  label.textContent=interfaceText('Nome do argumento','Argument name');
  input.value=doc.customName || ''; input.placeholder=doc.name; input.maxLength=200;
  label.append(input);
  const actions=document.createElement('div'), save=document.createElement('button'), remove=document.createElement('button'), cancel=document.createElement('button');
  save.type='submit';save.textContent=interfaceText('Salvar','Save');
  remove.type=cancel.type='button';
  cancel.setAttribute('aria-label',interfaceText('Cancelar','Cancel'));
  cancel.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  remove.setAttribute('aria-label',interfaceText('Excluir','Delete'));
  save.setAttribute('aria-label',interfaceText('Salvar','Save'));
  remove.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6"/></svg>';
  save.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h13l4 4v14H3V3ZM7 3v6h10V3M7 21v-8h10v8"/></svg>';
  remove.className='hy-argument-editor-delete';
  actions.append(cancel,remove,save);form.append(label,actions);panel.append(form);(card.closest("#argument-options") || root).append(panel);argumentCardEditor=panel;
  form.onsubmit=e=>{e.preventDefault();commitArgumentName(id,input.value);hideArgumentCardEditor();positionArgumentPicker();};
  remove.onclick=()=>{hideArgumentCardEditor();document.querySelector('#argument-options').hidePopover();deleteArgument(id);};
  cancel.onclick=hideArgumentCardEditor;
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();hideArgumentCardEditor();card.focus();}});
  panel.showPopover();const box=card.getBoundingClientRect();
  panel.style.left=Math.max(8,Math.min(innerWidth-panel.offsetWidth-8,box.left+box.width/2-panel.offsetWidth/2))+'px';
  panel.style.top=Math.max(8,Math.min(innerHeight-panel.offsetHeight-8,box.bottom+6))+'px';
}
function startArgumentGridAddHold(event) {
  if(event.button!==0)return;
  const state={pointer:event.pointerId,x:event.clientX,y:event.clientY};argumentGridAddHold=state;
  state.timer=setTimeout(()=>{
    if(argumentGridAddHold!==state)return;
    gridAddSuppressUntil=Date.now()+500;
    root.dispatchEvent(new Event('lp-open-argument-examples'));
    argumentGridAddHold=null;
  },getHoldDelay());
}
function stopArgumentGridAddHold(event) {
  const state=argumentGridAddHold;
  if(!state || (event.pointerId!==undefined && state.pointer!==event.pointerId))return;
  if(event.type==='pointermove'&&Math.hypot(event.clientX-state.x,event.clientY-state.y)<=6)return;
  clearTimeout(state.timer);argumentGridAddHold=null;
}
window.addEventListener('pointerup',stopArgumentGridAddHold);
window.addEventListener('pointercancel',stopArgumentGridAddHold);
window.addEventListener('pointermove',stopArgumentGridAddHold);
window.addEventListener('blur',stopArgumentGridAddHold);
document.addEventListener('pointerdown',event=>{
  if(argumentCardEditor&&!argumentCardEditor.contains(event.target)&&!event.target.closest('#argument-options [role=menuitemradio]'))hideArgumentCardEditor();
});
