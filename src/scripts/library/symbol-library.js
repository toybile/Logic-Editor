(() => {
  const region = root.querySelector(".hy-sidebar-region"),
    side = root.querySelector(".hy-side"),
    source = root.querySelector("#symbols"),
    search = root.querySelector(".hy-symbol-search"),
    heading = root.querySelector(".hy-library-heading");
  const originalGroups = [...source.children],
    definitions = [
      { id: "common", pt: "Mais comuns", entries: commonSymbols, icon: "grid" },
      ...symbolGroups.map(([pt, entries], i) => ({
        id: "group-" + i,
        pt,
        entries,
        icon: ["∧", "⇒", "∀", "□", "⊢", "∪", "∈", "⋀", "≔", "( )"][i],
      })),
    ];
  const catalog = new Map();
  for (const d of definitions)
    for (const entry of d.entries) {
      if (!catalog.has(entry[0])) catalog.set(entry[0], entry);
      for (const form of entry[2] || [])
        if (!catalog.has(form)) catalog.set(form, [form, entry[1], entry[2], entry[3]]);
    }
  const raw = ui.modularLibrary || {};
  const valid = (id) => ["recent", "favorite", ...definitions.map((d) => d.id)].includes(id);
  const unique = (values) => [
    ...new Set(Array.isArray(values) ? values.filter((s) => catalog.has(s)) : []),
  ];
  let state = {
    axis: raw.axis === "vertical" ? "vertical" : "horizontal",
    selected: valid(raw.selected) ? raw.selected : "common",
    favorites: unique(raw.favorites),
    recent: unique(raw.recent).slice(0, 20),
    floating: raw.floating === true,
    main: raw.main || { x: 16, y: 80, width: 320 },
    railDetached: raw.railDetached === true,
    rail: raw.rail || { x: 350, y: 90 },
    cardsVersion: raw.cardsVersion || 0,
    panels: Array.isArray(raw.panels)
      ? raw.panels
          .filter((p) => p && valid(p.group))
          .slice(0, 100)
          .map((p) => ({
            ...p,
            width: Math.min(Number(p.width) || 280, 420),
            id: typeof p.id === "string" ? p.id : crypto.randomUUID(),
          }))
      : [],
  };
  const layer = document.createElement("div");
  layer.className = "hy-modular-layer";
  root.append(layer);
  const placeholder = document.createElement("div");
  placeholder.className = "hy-modular-placeholder";
  region.before(placeholder);
  placeholder.append(region);
  region.classList.add("hy-modular-library");
  const mobilePanels = document.createElement("div");
  mobilePanels.className = "hy-mod-mobile-panels";
  region.append(mobilePanels);
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
    grip: '<path d="M8 5h.01M16 5h.01M8 12h.01M16 12h.01M8 19h.01M16 19h.01" stroke-width="3"/>',
    orientation: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    detach: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m4-10 3 2-3 2"/>',
    dock: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m7-10-3 2 3 2"/>',
  };
  const icon = (name) => '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths[name] + "</svg>";
  const text = interfaceText;
  const name = (id) =>
    id === "recent"
      ? text("Recentes", "Recent")
      : id === "favorite"
        ? text("Favoritos", "Favorites")
        : translated(definitions.find((d) => d.id === id)?.pt || "");
  function control(cls, art) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.innerHTML = icon(art);
    b.onmousedown = (e) => e.preventDefault();
    return b;
  }
  const grip = control("hy-mod-grip", "grip"),
    axis = control("hy-mod-control hy-mod-orientation", "orientation"),
    railToggle = control("hy-mod-control hy-mod-rail-toggle", "detach");
  heading.append(grip, axis, railToggle);
  const body = document.createElement("div");
  body.className = "hy-mod-body";
  const nav = document.createElement("nav");
  nav.className = "hy-mod-nav";
  const pane = document.createElement("div");
  pane.className = "hy-mod-pane";
  const paneHead = document.createElement("div");
  paneHead.className = "hy-mod-pane-head";
  const paneName = document.createElement("span");
  paneName.className = "hy-mod-group-name";
  const detach = control("hy-mod-detach-group", "detach"),
    paneGrip = control("hy-pane-collapse", "grip"),
    paneClose = control("hy-pane-close", "dock");
  paneClose.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  paneGrip.setAttribute(
    "aria-label",
    text("Recolher ou expandir categoria", "Collapse or expand category"),
  );
  paneClose.setAttribute("aria-label", text("Fechar categoria", "Close category"));
  paneGrip.onclick = () => pane.classList.toggle("hy-pane-collapsed");
  paneClose.onclick = () => {
    pane.dataset.userClosed = "true";
    pane.hidden = true;
    root.dispatchEvent(new CustomEvent("lp-primary-category-visibility"));
  };
  paneHead.append(paneGrip, paneName, detach, paneClose);
  source.before(body);
  body.append(nav, pane);
  pane.append(paneHead, source);
  side.querySelector(".hy-rail")?.remove();
  const cutSpace = document.createElement("div");
  cutSpace.className = "hy-mod-cut-space";
  cutSpace.hidden = true;
  body.insertBefore(cutSpace, pane);
  const railWindow = document.createElement("section");
  railWindow.className = "hy-mod-rail-window";
  const railHead = document.createElement("div");
  railHead.className = "hy-mod-rail-head";
  const railGrip = control("hy-mod-grip", "grip"),
    railTitle = document.createElement("span");
  railHead.append(railGrip, railTitle);
  railWindow.append(railHead);
  layer.append(railWindow);
  const special = {};
  for (const id of ["recent", "favorite"]) {
    const d = document.createElement("details");
    d.className = "hy-mod-group";
    d.open = true;
    const s = document.createElement("summary"),
      grid = document.createElement("div");
    grid.className = "hy-symbols";
    d.append(s, grid);
    source.append(d);
    special[id] = d;
  }
  originalGroups.forEach((group, i) => {
    group.classList.add("hy-mod-group");
    group.dataset.modGroup = definitions[i].id;
    group.open = true;
    [...group.querySelectorAll(".hy-symbol-cell")].forEach((cell, j) =>
      enhance(cell, definitions[i].entries[j]),
    );
  });
  for (const id of ["recent", "favorite", ...definitions.map((d) => d.id)]) {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.category = id;
    if (id === "recent" || id === "favorite" || id === "common")
      b.innerHTML = icon(id === "recent" ? "clock" : id === "favorite" ? "star" : "grid");
    else b.textContent = definitions.find((d) => d.id === id).icon;
    b.onmousedown = (e) => e.preventDefault();
    b.onclick = () => {
      delete pane.dataset.userClosed;
      state.selected = id;
      search.value = "";
      paint();
      persist();
    };
    nav.append(b);
  }
  const quick = document.createElement("div"),
    common = document.createElement("div"),
    categories = document.createElement("div");
  quick.className = "hy-mod-nav-quick";
  common.className = "hy-mod-nav-common";
  categories.className = "hy-mod-nav-categories";
  for (const b of [...nav.children]) {
    (b.dataset.category === "recent" || b.dataset.category === "favorite"
      ? quick
      : b.dataset.category === "common"
        ? common
        : categories
    ).append(b);
  }
  const shortcuts = document.createElement("div");
  shortcuts.className = "hy-mod-shortcuts";
  shortcuts.append(...common.children, ...quick.children);
  nav.append(shortcuts, categories);
  function entries(id) {
    return id === "recent"
      ? state.recent.map((s) => catalog.get(s))
      : id === "favorite"
        ? state.favorites.map((s) => catalog.get(s))
        : definitions.find((d) => d.id === id)?.entries || [];
  }
  function persist() {
    ui.modularLibrary = state;
    saveUI();
  }
  function wave(host, x, y, favorite) {
    if (!host) return;
    const box = host.getBoundingClientRect(),
      overlay = document.createElement("div"),
      disc = document.createElement("span");
    overlay.className = "hy-library-wave";
    overlay.dataset.favorite = String(favorite);
    disc.style.left = x - box.left + "px";
    disc.style.top = y - box.top + "px";
    const radius = Math.hypot(
      Math.max(x - box.left, box.right - x),
      Math.max(y - box.top, box.bottom - y),
    );
    disc.style.setProperty("--wave-radius", radius + "px");
    overlay.append(disc);
    host.append(overlay);
    const owner = host.closest(".hy-side,.hy-mod-palette"),
      symbol = host.closest(".hy-symbol-cell")?.dataset.modularSymbol;
    queueMicrotask(() => {
      if (!host.isConnected && owner?.isConnected) {
        const next = [...owner.querySelectorAll(".hy-symbol-cell")]
          .find((c) => c.dataset.modularSymbol === symbol && !c.closest("[hidden]"))
          ?.querySelector(".hy-symbol");
        if (next) next.append(overlay);
      }
    });
    overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
    setTimeout(() => overlay.remove(), 1000);
  }
  function enhance(cell, entry) {
    if (!entry || cell.dataset.modularEnhanced) return;
    cell.dataset.modularEnhanced = "true";
    cell.dataset.modularSymbol = entry[0];
    cell.querySelector(".hy-symbol").addEventListener(
      "click",
      (e) => {
        const host = cell.querySelector(".hy-symbol");
        if (!e.altKey) {
          if (active && !active.readOnly)
            wave(
              host,
              e.detail ? e.clientX : host.getBoundingClientRect().x + host.offsetWidth / 2,
              e.detail ? e.clientY : host.getBoundingClientRect().y + host.offsetHeight / 2,
              false,
            );
          return;
        }
        wave(
          host,
          e.clientX || cell.getBoundingClientRect().x,
          e.clientY || cell.getBoundingClientRect().y,
          true,
        );
        e.preventDefault();
        e.stopImmediatePropagation();
        closeNotations();
        const symbol = entry[0],
          had = state.favorites.includes(symbol);
        state.favorites = had
          ? state.favorites.filter((s) => s !== symbol)
          : [...state.favorites, symbol];
        favoriteNotice(had
          ? text("Removido dos favoritos", "Removed from favorites")
          : text("Adicionado aos favoritos", "Added to favorites"));
        paintCollections();
        persist();
      },
      true,
    );
  }
  symbolBehavior.enhance = enhance;
  symbolBehavior.afterInsert = function (symbol) {
    if (catalog.has(symbol)) {
      state.recent = [symbol, ...state.recent.filter((s) => s !== symbol)].slice(0, 20);
      paintCollections();
      persist();
    }
  };
  symbolBehavior.afterShow = function (cell, entry) {
    notationPanel.querySelector(".hy-mod-favorite-hint")?.remove();
    notationPanel.querySelector(".hy-symbol-favorite-toggle")?.remove();
    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "hy-button hy-symbol-favorite-toggle";
    favorite.setAttribute("aria-pressed", String(state.favorites.includes(entry[0])));
    favorite.textContent = state.favorites.includes(entry[0])
      ? text("★ Remover dos favoritos", "★ Remove from favorites")
      : text("☆ Favoritar", "☆ Add to favorites");
    favorite.onclick = () => {
      const button = cell.querySelector(".hy-symbol");
      button.dispatchEvent(new MouseEvent("click", { bubbles:true, altKey:true }));
    };
    notationPanel.append(favorite);
    const note = document.createElement("p");
    note.className = "hy-mod-favorite-hint";
    const key = document.createElement("kbd");
    key.textContent = "Alt";
    LPHints.format(
      note,
      text("Alt + clique para ", "Alt + click to ") +
        (state.favorites.includes(entry[0])
          ? text("remover dos favoritos", "remove from favorites")
          : text("favoritar", "add to favorites")),
    );
    notationPanel.append(note);
  };
  const empty = document.createElement("div");
  empty.className = "hy-mod-empty";
  source.append(empty);
  function fill(target, list) {
    target.replaceChildren();
    list.forEach((entry) => target.append(symbolCell(entry)));
  }
  function paintCollections() {
    for (const id of ["recent", "favorite"])
      fill(special[id].querySelector(".hy-symbols"), entries(id));
    for (const panel of windows.values()) {
      fill(panel.element.querySelector(".hy-mod-symbols"), entries(panel.model.group));
      panel.empty.hidden = entries(panel.model.group).length > 0;
      panel.empty.textContent = text(
        "Nenhum símbolo nesta coleção.",
        "No symbols in this collection.",
      );
    }
    filter();
  }
  const resultGroup = document.createElement("div");
  resultGroup.className = "hy-mod-group hy-mod-search-results";
  const resultGrid = document.createElement("div");
  resultGrid.className = "hy-symbols";
  resultGroup.append(resultGrid);
  body.after(resultGroup);
  const searchEmpty = document.createElement("p");
  searchEmpty.className = "hy-mod-empty";
  resultGroup.append(searchEmpty);
  const resultStatus = document.createElement("span");
  resultStatus.className = "hy-mod-search-status";
  resultStatus.setAttribute("role", "status");
  resultStatus.setAttribute("aria-live", "polite");
  resultGroup.append(resultStatus);
  let lastResultAnnouncement = "";
  const normalizeSearch = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  function searchEntries(query) {
    const words = query.split(/\s+/).filter(Boolean),
      matches = new Map();
    for (const d of definitions)
      for (const entry of d.entries) {
        const namePT = entry[1],
          nameEN = translations[namePT] || namePT,
          groupEN = translations[d.pt] || d.pt,
          forms = [entry[0], ...(entry[2] || [])];
        const labels = normalizeSearch([namePT, nameEN, d.pt, groupEN, ...forms].join(" "));
        if (!words.every((word) => labels.includes(word))) continue;
        const score = forms.some((s) => normalizeSearch(s) === query)
          ? 0
          : normalizeSearch(namePT) === query || normalizeSearch(nameEN) === query
            ? 1
            : normalizeSearch(namePT).startsWith(query) || normalizeSearch(nameEN).startsWith(query)
              ? 2
              : 3;
        const old = matches.get(entry[0]);
        if (!old || score < old.score) matches.set(entry[0], { entry, score });
      }
    return [...matches.values()].sort((a, b) => a.score - b.score).map((m) => m.entry);
  }
  function filter() {
    pane.hidden = pane.dataset.userClosed === "true";
    closeNotations();
    const q = normalizeSearch(search.value);
    for (const [i, group] of originalGroups.entries()) {
      group.hidden = !!q || state.selected !== definitions[i].id;
      group.dataset.searchResult = "false";
      group.open = true;
      for (const cell of group.querySelectorAll(".hy-symbol-cell")) cell.hidden = false;
    }
    for (const id of ["recent", "favorite"]) special[id].hidden = !!q || state.selected !== id;
    let found = 0;
    resultGroup.hidden = !q;
    if (q) {
      const matches = searchEntries(q);
      fill(resultGrid, matches);
      found = matches.length;
      searchEmpty.hidden = found > 0;
      searchEmpty.textContent = text(
        "Nenhum símbolo encontrado. Tente outro nome ou símbolo.",
        "No symbols found. Try another name or symbol.",
      );
      paneName.textContent =
        found +
        " " +
        text(found === 1 ? "resultado" : "resultados", found === 1 ? "result" : "results");
      const announcement =
        found +
        " " +
        text(
          found === 1 ? "símbolo encontrado" : "símbolos encontrados",
          found === 1 ? "symbol found" : "symbols found",
        );
      if (announcement !== lastResultAnnouncement) {
        resultStatus.textContent = announcement;
        lastResultAnnouncement = announcement;
      }
    } else {
      resultGrid.replaceChildren();
      resultStatus.textContent = "";
      lastResultAnnouncement = "";
      paneName.textContent = name(state.selected);
      found = entries(state.selected).length;
    }
    detach.hidden = !!q;
    body.dataset.searching = String(!!q);
    region.dataset.searching = String(!!q);
    empty.hidden = found > 0;
    empty.textContent = q
      ? text(
          "Nenhum símbolo encontrado. Tente outro nome ou símbolo.",
          "No symbols found. Try another name or symbol.",
        )
      : state.selected === "favorite"
        ? text("Nenhum símbolo favorito.", "No favorite symbols.")
        : state.selected === "recent"
          ? text("Os símbolos inseridos aparecem aqui.", "Inserted symbols appear here.")
          : text("Nenhum símbolo encontrado.", "No symbols found.");
  }

  function mobile() {
    return matchMedia("(max-width:900px), (pointer:coarse) and (max-width:1100px)").matches;
  }
  function constrain(element, model) {
    const minY = root.querySelector(".hy-head").offsetHeight + 8,
      maxX = Math.max(8, root.clientWidth - element.offsetWidth - 8),
      maxY = Math.max(minY, root.offsetHeight - element.offsetHeight - 8);
    return {
      x: Math.max(8, Math.min(maxX, Number(model.x) || 8)),
      y: Math.max(minY, Math.min(maxY, Number(model.y) || minY)),
    };
  }
  function position(element, model) {
    if (mobile()) return;
    const p = constrain(element, model);
    element.style.left = p.x + "px";
    element.style.top = p.y + "px";
  }
  function freeLibrary() {
    if (!state.floating) {
      const b = region.getBoundingClientRect(),
        r = root.getBoundingClientRect();
      state.main = { x: b.left - r.left, y: b.top - r.top, width: Math.max(220, b.width) };
      state.floating = true;
      region.dataset.floating = "true";
      region.style.width = state.main.width + "px";
      if (region.parentElement !== layer) layer.append(region);
      position(region, state.main);
    }
  }
  let highest = 40;
  function configureWindowKeyboard(element, handle, modelFn, isMain = false) {
    handle.onkeydown = (e) => {
      if (mobile()) return;
      if (e.key === "Home" && isMain) {
        state.floating = false;
        placeAll();
        persist();
        return;
      }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      if (isMain) freeLibrary();
      const model = modelFn(),
        p = constrain(element, {
          x: model.x + (e.key === "ArrowRight" ? 10 : e.key === "ArrowLeft" ? -10 : 0),
          y: model.y + (e.key === "ArrowDown" ? 10 : e.key === "ArrowUp" ? -10 : 0),
        });
      model.x = p.x;
      model.y = p.y;
      position(element, model);
      persist();
    };
  }
  function movable(element, handle, modelFn, isMain = false) {
    let gesture = null;
    handle.ondblclick = () => {
      if (isMain) {
        state.floating = false;
        placeAll();
        persist();
      }
    };
    element.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || mobile() || e.target.closest(".hy-symbol-cell")) return;
      const control = e.target.closest("button,input,textarea,select,a,summary");
      if (control && control !== handle) return;
      const b = element.getBoundingClientRect(),
        r = root.getBoundingClientRect();
      gesture = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        left: b.left - r.left,
        top: b.top - r.top,
        active: false,
      };
    });
    element.addEventListener("pointermove", (e) => {
      if (!gesture || gesture.id !== e.pointerId) return;
      if (!gesture.active) {
        if (Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) < 4) return;
        if (isMain) freeLibrary();
        gesture.active = true;
        element.setPointerCapture(e.pointerId);
        element.classList.add("hy-mod-moving");
        element.style.zIndex = String(++highest);
        closeNotations();
      }
      e.preventDefault();
      const model = modelFn(),
        p = constrain(element, {
          x: gesture.left + e.clientX - gesture.x,
          y: gesture.top + e.clientY - gesture.y,
        });
      model.x = p.x;
      model.y = p.y;
      position(element, model);
    });
    function stop(e) {
      if (!gesture || gesture.id !== e.pointerId) return;
      const moved = gesture.active;
      gesture = null;
      if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId);
      element.classList.remove("hy-mod-moving");
      if (moved) {
        handle.dataset.draggedAt = String(Date.now());
        persist();
      }
    }
    element.addEventListener("pointerup", stop);
    element.addEventListener("pointercancel", stop);
    element.addEventListener("pointerleave", () => {
      if (gesture && !gesture.active) gesture = null;
    });
    configureWindowKeyboard(element, handle, modelFn, isMain);
  }
  const dockStack = document.createElement("div");
  dockStack.className = "hy-symbol-dock-stack";
  body.after(dockStack);
  if (state.cardsVersion !== 1) {
    if (pane.dataset.userClosed !== "true")
      state.panels.unshift({ id: crypto.randomUUID(), group: state.selected, docked: true });
    state.cardsVersion = 1;
    persist();
  }
  const windows = new Map();
  function syncWindows() {
    for (const [id, panel] of windows)
      if (!state.panels.some((p) => p.id === id)) {
        panel.element.remove();
        windows.delete(id);
      }
    for (const model of state.panels) {
      if (!model.id) model.id = crypto.randomUUID();
      if (windows.has(model.id)) continue;
      const element = document.createElement("section");
      element.className = "hy-mod-palette";
      element.dataset.group = model.group;
      element.dataset.windowId = model.id;
      const head = document.createElement("div");
      head.className = "hy-mod-palette-head";
      const handle = control("hy-mod-grip", "grip"),
        title = document.createElement("span"),
        close = control("hy-mod-control", "dock");
      head.append(handle, title, close);
      const symbols = document.createElement("div");
      symbols.className = "hy-mod-symbols";
      const noSymbols = document.createElement("div");
      noSymbols.className = "hy-mod-empty";
      close.onclick = () => {
        state.panels = state.panels.filter((p) => p.id !== model.id);
        paint();
        persist();
      };
      element.append(head, symbols, noSymbols);
      layer.append(element);
      windows.set(model.id, { element, title, close, handle, empty: noSymbols, model });
      configureWindowKeyboard(element, handle, () => model);
      horizontalResize(element, () => model);
    }
    for (const panel of windows.values()) {
      let hand = panel.element.querySelector(".hy-docked-create");
      if (!hand) {
        hand = control("hy-docked-create", "detach");
        hand.dataset.createCategory = panel.model.group;
        hand.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="8" width="12" height="13" rx="2"/><path d="M8 5V3h13v13h-3M7 14h4m-2-2v4"/></svg>';
        panel.close.before(hand);
      }
      panel.element.dataset.group = panel.model.group;
      let picker = panel.title.querySelector("select");
      if (!picker) {
        picker = document.createElement("select");
        picker.className = "hy-card-category";
        picker.setAttribute("aria-label", text("Categoria deste card", "Card category"));
        for (const id of [
          "common",
          "recent",
          "favorite",
          ...definitions.map((d) => d.id).filter((id) => id !== "common"),
        ]) {
          const option = document.createElement("option");
          option.value = id;
          option.textContent = name(id);
          picker.append(option);
        }
        picker.onchange = () => {
          panel.model.group = picker.value;
          paint();
          persist();
        };
        const pickerButton = document.createElement("button");
        pickerButton.type = "button";
        pickerButton.className = "hy-card-picker";
        pickerButton.innerHTML =
          '<span class="hy-card-picker-label"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
        pickerButton.setAttribute("aria-haspopup", "dialog");
        pickerButton.onclick = () =>
          root.dispatchEvent(
            new CustomEvent("lp-open-card-picker", {
              detail: { select: picker, button: pickerButton },
            }),
          );
        panel.title.replaceChildren(picker, pickerButton);
      }
      picker.value = panel.model.group;
      panel.title.querySelector(".hy-card-picker-label").textContent = name(panel.model.group);
      for (const option of picker.options) option.textContent = name(option.value);
      hand.dataset.createCategory = panel.model.group;
      panel.element.setAttribute("aria-label", name(panel.model.group));
      panel.close.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
      panel.close.setAttribute("aria-label", text("Fechar janela", "Close window"));
      panel.close.dataset.hintText = panel.close.getAttribute("aria-label");
      panel.handle.setAttribute("aria-label", text("Mover janela", "Move window"));
    }
  }
  const widthMeasure = document.createElement("canvas").getContext("2d");
  function textWidth(node) {
    if (!node) return 0;
    const st = getComputedStyle(node);
    widthMeasure.font = st.font;
    return Math.ceil(
      widthMeasure.measureText(
        (
          node.querySelector("select")?.selectedOptions[0]?.textContent ||
          node.querySelector(".hy-card-picker-label")?.textContent ||
          node.textContent
        ).trim(),
      ).width,
    );
  }
  function minimumWindowWidth(element) {
    const scale = Number(getComputedStyle(root).getPropertyValue("--library-scale")) || 1;
    if (mobile()) return Math.min(300, root.clientWidth - 16);
    let minimum = 220 * scale;
    if (element === region) {
      const header = heading,
        st = getComputedStyle(header),
        parent = getComputedStyle(header.parentElement),
        buttons = [...header.children].filter(
          (e) => e.tagName === "BUTTON" && e.getClientRects().length,
        ),
        title = header.querySelector("h3"),
        gap = parseFloat(st.columnGap) || 0;
      const titleWidth = textWidth(title);
      minimum = Math.max(
        minimum,
        buttons.reduce((sum, e) => sum + e.offsetWidth, 0) +
          gap * buttons.length +
          titleWidth +
          (parseFloat(parent.paddingLeft) || 0) +
          (parseFloat(parent.paddingRight) || 0) +
          28,
      );
      if (!state.railDetached) minimum = Math.max(minimum, 5 * 30 * scale + 24 + 24 + 16);
    } else if (element === railWindow) {
      if (state.axis === "vertical") {
        const shell = getComputedStyle(railWindow),
          bar = getComputedStyle(nav),
          outer =
            (parseFloat(shell.paddingLeft) || 0) +
            (parseFloat(shell.paddingRight) || 0) +
            (parseFloat(shell.borderLeftWidth) || 0) +
            (parseFloat(shell.borderRightWidth) || 0),
          barPadding = (parseFloat(bar.paddingLeft) || 0) + (parseFloat(bar.paddingRight) || 0);
        minimum = outer + Math.max(36 * scale + barPadding, railGrip.offsetWidth);
      } else
        minimum = Math.max(
          5 * 30 * scale + 24 + 24,
          textWidth(railTitle) +
            railGrip.offsetWidth +
            axis.offsetWidth +
            railToggle.offsetWidth +
            45,
        );
    } else {
      const title = element.querySelector(".hy-mod-palette-head>span");
      minimum = Math.max(minimum, textWidth(title) + 90 * scale, 4 * 42 * scale + 48);
    }
    return Math.ceil(minimum);
  }
  function enforceWindowWidths() {
    if (root.hidden) return;
    const items = [
      [region, state.main],
      [railWindow, state.rail],
      ...[...windows.values()].map((p) => [p.element, p.model]),
    ];
    for (const [element, model] of items) {
      if (element.dataset.docked === "true") {
        element.style.setProperty("--library-min-width", "0px");
        continue;
      }
      const min = minimumWindowWidth(element);
      element.style.setProperty("--library-min-width", min + "px");
      if (mobile()) continue;
      const current = element.getBoundingClientRect().width;
      if (element === region && !state.floating) continue;
      if (model.width || current < min) {
        model.width = Math.max(min, Number(model.width) || current);
        element.style.width = model.width + "px";
      }
    }
  }
  function horizontalResize(element, modelFn, isMain = false) {
    for (const edge of ["left", "right"]) {
      const handle = document.createElement("div");
      handle.className = "hy-library-width-edge hy-library-width-" + edge;
      handle.setAttribute("aria-hidden", "true");
      element.append(handle);
      let dragSize = null;
      handle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0 || mobile()) return;
        e.preventDefault();
        e.stopPropagation();
        if (isMain) freeLibrary();
        const box = element.getBoundingClientRect(),
          base = root.getBoundingClientRect();
        dragSize = {
          id: e.pointerId,
          start: e.clientX,
          left: box.left - base.left,
          width: box.width,
        };
        handle.setPointerCapture(e.pointerId);
      });
      handle.addEventListener("pointermove", (e) => {
        if (!dragSize || dragSize.id !== e.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        const model = modelFn(),
          min = minimumWindowWidth(element),
          dx = e.clientX - dragSize.start;
        if (edge === "right") {
          model.x = dragSize.left;
          model.width = Math.max(
            min,
            Math.min(dragSize.width + dx, root.clientWidth - model.x - 8),
          );
        } else {
          model.x = Math.max(8, Math.min(dragSize.left + dx, dragSize.left + dragSize.width - min));
          model.width = dragSize.left + dragSize.width - model.x;
        }
        element.style.width = model.width + "px";
        position(element, model);
      });
      const end = (e) => {
        if (!dragSize || dragSize.id !== e.pointerId) return;
        dragSize = null;
        if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
        persist();
        root.dispatchEvent(new CustomEvent("lp-window-manual-placement", { detail: { element } }));
      };
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    }
  }
  function resizable(element, modelFn) {
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "hy-mod-resize";
    handle.setAttribute("aria-label", text("Redimensionar janela", "Resize window"));
    handle.dataset.hintText = text(
      "Arraste para ajustar largura e altura. Setas ajustam em 10 pixels.",
      "Drag to adjust width and height. Arrow keys adjust by 10 pixels.",
    );
    element.append(handle);
    let gesture = null;
    function size(width, height) {
      const r = element.getBoundingClientRect(),
        base = root.getBoundingClientRect(),
        model = modelFn();
      model.width = Math.max(
        element === railWindow ? 62 : 220,
        Math.min(width, root.clientWidth - (r.left - base.left) - 8),
      );
      model.height = Math.max(100, Math.min(height, Math.max(160, innerHeight - 80)));
      element.style.width = model.width + "px";
      element.style.height = model.height + "px";
      element.dataset.resized = "true";
    }
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || mobile()) return;
      e.preventDefault();
      e.stopPropagation();
      const r = element.getBoundingClientRect();
      gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, width: r.width, height: r.height };
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!gesture || gesture.id !== e.pointerId) return;
      e.preventDefault();
      e.stopPropagation();
      size(gesture.width + e.clientX - gesture.x, gesture.height + e.clientY - gesture.y);
    });
    const stop = (e) => {
      if (!gesture || gesture.id !== e.pointerId) return;
      gesture = null;
      if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
      persist();
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
    handle.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      size(
        element.offsetWidth + (e.key === "ArrowRight" ? 10 : e.key === "ArrowLeft" ? -10 : 0),
        element.offsetHeight + (e.key === "ArrowDown" ? 10 : e.key === "ArrowUp" ? -10 : 0),
      );
      persist();
    });
  }
  function restoreSize(element, model) {
    if (model.width) element.style.width = Math.min(root.clientWidth - 16, model.width) + "px";
    if (model.height) {
      element.style.height = model.height + "px";
      element.dataset.resized = "true";
    }
  }
  function placeAll() {
    region.dataset.floating = String(state.floating);
    if (state.floating && !mobile()) {
      if (region.parentElement !== layer) layer.append(region);
      region.style.width =
        Math.max(220, Math.min(root.clientWidth - 16, Number(state.main.width) || 320)) + "px";
      position(region, state.main);
    } else {
      if (region.parentElement !== placeholder) placeholder.append(region);
      region.style.width = "";
      region.style.left = "";
      region.style.top = "";
    }
    for (const panel of windows.values()) {
      const target = panel.model.docked ? dockStack : mobile() ? mobilePanels : layer;
      panel.element.dataset.docked = String(!!panel.model.docked);
      if (panel.element.parentElement !== target) target.append(panel.element);
      if (panel.model.width)
        panel.element.style.width = Math.min(root.clientWidth - 16, panel.model.width) + "px";
      position(panel.element, panel.model);
    }
    const railTarget = mobile() ? mobilePanels : layer;
    if (railWindow.parentElement !== railTarget) railTarget.append(railWindow);
    if (state.rail.width) railWindow.style.width = state.rail.width + "px";
    position(railWindow, state.rail);
    enforceWindowWidths();
    layer.inert = ui.focus;
  }
  function paint() {
    cutSpace.hidden = true;
    delete state.rail.cutHeight;
    region.dataset.railDetached = String(state.railDetached);
    body.dataset.axis = state.axis;
    body.dataset.detached = String(state.railDetached);
    nav.dataset.axis = state.axis;
    railWindow.dataset.axis = state.axis;
    railWindow.hidden = !state.railDetached;
    railTitle.textContent = text("Categorias", "Categories");
    nav.setAttribute("aria-label", text("Categorias de símbolos", "Symbol categories"));
    for (const button of nav.querySelectorAll("button[data-category]")) {
      const selected = button.dataset.category === state.selected;
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute("aria-label", name(button.dataset.category));
      button.dataset.hintText = button.getAttribute("aria-label");
    }
    axis.setAttribute(
      "aria-label",
      state.axis === "horizontal"
        ? text("Colocar barra na vertical", "Make category bar vertical")
        : text("Colocar barra na horizontal", "Make category bar horizontal"),
    );
    axis.dataset.hintText = axis.getAttribute("aria-label");
    railToggle.dataset.closeRail = String(state.railDetached);
    railToggle.innerHTML = state.railDetached
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 13V5a1.5 1.5 0 0 1 3 0v6-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v7c0 4-2.5 6-6 6h-1c-2 0-3-1-4-2l-5-6a1.5 1.5 0 0 1 2-2l2 1Z"/></svg>';
    railToggle.setAttribute(
      "aria-label",
      state.railDetached
        ? text("Recolher barra à biblioteca", "Return category bar to library")
        : text("Destacar barra de categorias", "Detach category bar"),
    );
    railToggle.dataset.hintText = text(
      "Mover barra de categorias. Segure e arraste em qualquer direção.",
      "Move category bar. Hold and drag in any direction.",
    );
    grip.setAttribute(
      "aria-label",
      text("Mover biblioteca; duplo clique recolhe", "Move library; double-click docks"),
    );
    grip.dataset.hintText = grip.getAttribute("aria-label");
    railGrip.setAttribute("aria-label", text("Mover barra de categorias", "Move category bar"));
    railWindow.setAttribute("aria-label", text("Barra de categorias", "Category bar"));
    detach.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 13V5a1.5 1.5 0 0 1 3 0v6-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v7c0 4-2.5 6-6 6h-1c-2 0-3-1-4-2l-5-6a1.5 1.5 0 0 1 2-2l2 1Z"/></svg>';
    detach.dataset.createCategory = state.selected;
    detach.setAttribute(
      "aria-label",
      text(
        "Criar janela desta categoria. Segure e arraste em qualquer direção.",
        "Create a window of this category. Hold and drag in any direction.",
      ),
    );
    detach.dataset.hintText = detach.getAttribute("aria-label");
    if (state.railDetached) {
      railHead.append(axis, railToggle);
      railWindow.append(nav);
    } else {
      heading.append(axis, railToggle);
      body.prepend(nav);
    }
    syncWindows();
    paintCollections();
    placeAll();
  }
  for (const [button, mode] of [
    [axis, "orientation"],
    [railToggle, "detach"],
  ]) {
    const start = () => {
        if (button === railToggle) {
          delete body.dataset.dividerHint;
          delete railWindow.dataset.dividerHint;
          return;
        }
        body.dataset.dividerHint = mode;
        railWindow.dataset.dividerHint = mode;
      },
      end = () => {
        delete body.dataset.dividerHint;
        delete railWindow.dataset.dividerHint;
      };
    button.addEventListener("pointerenter", start);
    button.addEventListener("pointerleave", end);
    button.addEventListener("focus", start);
    button.addEventListener("blur", end);
  }
  let lastLibraryScale = Number(getComputedStyle(root).getPropertyValue("--library-scale")) || 1;
  new MutationObserver(() => {
    const scale = Number(root.style.getPropertyValue("--library-scale")) || 1;
    if (scale === lastLibraryScale) return;
    if (state.floating)
      state.main.width = ((Number(state.main.width) || 320) * scale) / lastLibraryScale;
    lastLibraryScale = scale;
    placeAll();
    persist();
  }).observe(root, { attributes: true, attributeFilter: ["style"] });
  axis.onclick = () => {
    state.axis = state.axis === "horizontal" ? "vertical" : "horizontal";
    paint();
    if (state.railDetached) {
      state.rail.width = minimumWindowWidth(railWindow);
      railWindow.style.width = state.rail.width + "px";
      position(railWindow, state.rail);
      root.dispatchEvent(
        new CustomEvent("lp-window-manual-placement", { detail: { element: railWindow } }),
      );
    }
    persist();
  };
  railToggle.onclick = () => {
    if (!state.railDetached) {
      const before = region.getBoundingClientRect(),
        base = root.getBoundingClientRect(),
        navBox = nav.getBoundingClientRect();
      freeLibrary();
      delete state.rail.cutHeight;
      cutSpace.hidden = true;
      state.railDetached = true;
      state.rail.width =
        state.axis === "vertical" ? minimumWindowWidth(railWindow) : before.width - 16;
      railWindow.style.width = state.rail.width + "px";
      state.rail.x = Math.max(8, before.left - base.left) + 8;
      state.rail.y = Math.max(
        root.querySelector(".hy-head").offsetHeight + 8,
        before.top - base.top - 10,
      );
      paint();
      position(railWindow, state.rail);
      state.main.x = Math.max(8, before.left - base.left);
      state.main.y = state.rail.y + railWindow.offsetHeight + 12;
      root.style.setProperty('--workspace-min-height',
        Math.max(root.offsetHeight, state.main.y + region.offsetHeight + 20) + "px");
      position(region, state.main);
      for (const element of [region, railWindow])
        root.dispatchEvent(new CustomEvent("lp-window-manual-placement", { detail: { element } }));
    } else {
      const top = railWindow.getBoundingClientRect(),
        base = root.getBoundingClientRect();
      state.railDetached = false;
      cutSpace.hidden = true;
      state.main.y = Math.max(root.querySelector(".hy-head").offsetHeight + 8, top.top - base.top);
      paint();
      position(region, state.main);
      root.dispatchEvent(
        new CustomEvent("lp-window-manual-placement", { detail: { element: region } }),
      );
    }
    persist();
  };
  root.addEventListener("lp-clone-symbol-card", (e) => {
    const i = state.panels.findIndex((p) => p.id === e.detail.id);
    if (i < 0) return;
    const original = state.panels[i],
      model = { id: crypto.randomUUID(), group: original.group, docked: true };
    state.panels.splice(i + 1, 0, model);
    paint();
    const old = windows.get(original.id)?.element,
      next = windows.get(model.id)?.element;
    if (old?.parentElement === dockStack && next) old.after(next);
    persist();
  });
  root.addEventListener("lp-add-symbol-card", (e) => {
    const group = valid(e.detail?.group) ? e.detail.group : state.selected;
    const model = { id: crypto.randomUUID(), group, docked: true },
      index = state.panels.findIndex((p) => p.id === e.detail?.beforeId);
    if (index >= 0) state.panels.splice(index, 0, model);
    else state.panels.push(model);
    paint();
    if (index >= 0) {
      const target = windows.get(e.detail.beforeId)?.element,
        element = windows.get(model.id)?.element;
      if (target && element) target.before(element);
    }
    persist();
  });
  root.addEventListener("lp-set-palette-dock", (e) => {
    const p = state.panels.find((p) => p.id === e.detail.id);
    if (!p) return;
    const wasDocked = p.docked;
    p.docked = e.detail.docked;
    if (wasDocked && !p.docked) {
      p.width = Number(e.detail.width) || 280;
      const el = windows.get(p.id)?.element;
      if (el) el.style.width = p.width + "px";
    }
    if (Number.isFinite(e.detail.x)) p.x = e.detail.x;
    if (Number.isFinite(e.detail.y)) p.y = e.detail.y;
    if (p.docked && e.detail.insertEnd) {
      state.panels = state.panels.filter((x) => x !== p);
      state.panels.push(p);
    }
    if (p.docked && e.detail.beforeId) {
      const from = state.panels.indexOf(p),
        target = state.panels.findIndex((x) => x.id === e.detail.beforeId);
      if (target >= 0 && from !== target) {
        state.panels.splice(from, 1);
        state.panels.splice(
          state.panels.indexOf(state.panels.find((x) => x.id === e.detail.beforeId)),
          0,
          p,
        );
      }
    }
    syncWindows();
    placeAll();
    if (p.docked && e.detail.beforeId) {
      const target = windows.get(e.detail.beforeId)?.element,
        el = windows.get(p.id)?.element;
      if (target && el) target.before(el);
    }
    persist();
  });
  let railMagnet = null,
    railDwell = null,
    railCandidate = null,
    railDragging = false;
  root.addEventListener("lp-rail-live-drag", (e) => {
    if (e.detail.phase === "start") {
      railDragging = true;
      railMagnet = null;
      if (!state.railDetached) railToggle.onclick();
    } else if (e.detail.phase === "move") {
      if (railMagnet) {
        if (Math.hypot(e.detail.x - railMagnet.x, e.detail.y - railMagnet.y) < 16) return;
        railToggle.onclick();
        railMagnet = null;
      }
      state.rail.x = e.detail.x;
      state.rail.y = e.detail.y;
      position(railWindow, state.rail);
      const b = region.getBoundingClientRect(),
        r = root.getBoundingClientRect(),
        x = b.left - r.left + (b.width - railWindow.offsetWidth) / 2,
        y = b.top - r.top - railWindow.offsetHeight - 4;
      if (railDragging && Math.abs(state.rail.x - x) < 7 && Math.abs(state.rail.y - y) < 7) {
        if (
          !railCandidate ||
          Math.hypot(e.detail.x - railCandidate.x, e.detail.y - railCandidate.y) > 1
        ) {
          clearTimeout(railDwell);
          railCandidate = { x: e.detail.x, y: e.detail.y };
          railDwell = setTimeout(() => {
            if (!railDragging || !state.railDetached) return;
            railMagnet = { ...railCandidate };
            railToggle.onclick();
          }, getHoldDelay());
        }
      } else {
        clearTimeout(railDwell);
        railCandidate = null;
      }
    } else if (e.detail.phase === "end") {
      railDragging = false;
      clearTimeout(railDwell);
      railCandidate = null;
      railMagnet = null;
      persist();
      root.dispatchEvent(
        new CustomEvent("lp-window-manual-placement", { detail: { element: railWindow } }),
      );
    }
  });
  root.addEventListener("lp-drop-category-bar", (e) => {
    if (!state.railDetached) railToggle.onclick();
    state.rail.x = e.detail.x;
    state.rail.y = e.detail.y;
    position(railWindow, state.rail);
    persist();
    root.dispatchEvent(
      new CustomEvent("lp-window-manual-placement", { detail: { element: railWindow } }),
    );
  });
  root.addEventListener("lp-preview-category", (e) => {
    const host = e.detail.host,
      id = e.detail.id;
    if (!valid(id)) return;
    const head = document.createElement("div");
    head.className = "hy-mod-palette-head";
    const title = document.createElement("span");
    title.textContent = name(id);
    head.append(title);
    const grid = document.createElement("div");
    grid.className = "hy-mod-symbols";
    const group = special[id] || originalGroups.find((g) => g.dataset.modGroup === id);
    if (group)
      for (const cell of group.querySelectorAll(".hy-symbol-cell")) {
        const copy = cell.cloneNode(true);
        copy.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
        copy.querySelectorAll("button").forEach((b) => (b.tabIndex = -1));
        grid.append(copy);
      }
    host.append(head, grid);
  });
  root.addEventListener("lp-detach-category", (e) => {
    const id = e.detail.id;
    if (!valid(id)) return;
    state.panels.push({
      id: crypto.randomUUID(),
      group: id,
      x: Number.isFinite(e.detail.x)
        ? e.detail.x
        : Math.max(8, Math.min(root.clientWidth - 290, 350 + state.panels.length * 20)),
      y: Number.isFinite(e.detail.y) ? e.detail.y : 120 + state.panels.length * 45,
    });
    paint();
    persist();
  });
  detach.onclick = () => {
    state.panels.push({
      id: crypto.randomUUID(),
      group: state.selected,
      x: Math.min(root.clientWidth - 290, 350 + state.panels.length * 20),
      y: 120 + state.panels.length * 45,
    });
    paint();
    persist();
  };
  search.oninput = filter;
  grip.addEventListener("click", (e) => {
    if (Date.now() - Number(grip.dataset.draggedAt || 0) < 250) return;
    e.stopPropagation();
    state.collapsed = !state.collapsed;
    region.dataset.collapsed = String(state.collapsed);
    grip.setAttribute("aria-expanded", String(!state.collapsed));
    persist();
  });
  region.dataset.collapsed = String(raw.collapsed === true);
  state.collapsed = raw.collapsed === true;
  grip.setAttribute("aria-expanded", String(!state.collapsed));
  delete state.main.height;
  delete state.rail.height;
  for (const panel of state.panels) {
    delete panel.height;
  }
  horizontalResize(region, () => state.main, true);
  horizontalResize(railWindow, () => state.rail);
  movable(region, grip, () => state.main, true);
  movable(railWindow, railGrip, () => state.rail);
  root.addEventListener("lp-ui-colors", paint);
  root.querySelector("#settings-language").addEventListener("click", paint);
  new MutationObserver(() => {
    layer.inert = root.dataset.focus === "true";
  }).observe(root, { attributes: true, attributeFilter: ["data-focus"] });
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(placeAll, 80);
  });
  root.addEventListener("lp-reset-library-layout", () => {
    state.main = { x: 16, y: 80, width: 320 };
    state.rail = { x: 350, y: 90 };
    state.collapsed = false;
    region.dataset.collapsed = "false";
    state.axis = "horizontal";
    state.selected = "common";
    state.floating = false;
    state.railDetached = false;
    state.panels = [{ id: crypto.randomUUID(), group: "common", docked: true }];
    state.cardsVersion = 1;
    delete pane.dataset.userClosed;
    pane.classList.remove("hy-pane-collapsed");
    search.value = "";
    paint();
    persist();
  });
  function describe(id) {
    const details = {
      recent: [
        "Símbolos inseridos recentemente, sem repetições.",
        "Recently inserted symbols, without duplicates.",
        "Clique para abrir Recentes.",
        "Click to open Recent.",
      ],
      favorite: [
        "Sua coleção pessoal de símbolos.",
        "Your personal symbol collection.",
        "Alt + clique num símbolo para adicioná-lo ou removê-lo.",
        "Alt + click a symbol to add or remove it.",
      ],
      common: [
        "Acesso rápido a uma seleção fixa de símbolos frequentes.",
        "Quick access to a fixed selection of frequently used symbols.",
        "¬ ∧ ∨ → ↔ ⊕ ( )",
        "¬ ∧ ∨ → ↔ ⊕ ( )",
      ],
      "group-0": [
        "Conectivos usados para compor fórmulas proposicionais.",
        "Connectives used to build propositional formulas.",
        "¬: negação · ∧: conjunção · ∨: disjunção.",
        "¬: negation · ∧: conjunction · ∨: disjunction.",
      ],
      "group-1": [
        "Notações de implicação, equivalência e suas negações.",
        "Notations for implication, equivalence and their negations.",
        "⇒ ⇔ ↛ ↮",
        "⇒ ⇔ ↛ ↮",
      ],
      "group-2": [
        "Quantificação e relações de igualdade.",
        "Quantification and equality relations.",
        "∀: universal · ∃: existencial. Escrita disponível; sem validação de lógica de predicados.",
        "∀: universal · ∃: existential. Notation is available; predicate logic is not validated.",
      ],
      "group-3": [
        "Notações de necessidade e possibilidade.",
        "Notations for necessity and possibility.",
        "□: necessidade · ◇: possibilidade. Escrita disponível; sem validação modal.",
        "□: necessity · ◇: possibility. Notation is available; modal logic is not validated.",
      ],
      "group-4": [
        "Derivabilidade, consequência semântica e marcadores de conclusão.",
        "Derivability, semantic consequence and conclusion markers.",
        "⊢: derivabilidade · ⊨: consequência semântica.",
        "⊢: derivability · ⊨: semantic consequence.",
      ],
      "group-5": [
        "Operações sobre conjuntos.",
        "Operations on sets.",
        "∪: união · ∩: interseção · ×: produto cartesiano.",
        "∪: union · ∩: intersection · ×: Cartesian product.",
      ],
      "group-6": [
        "Relações de pertinência e inclusão.",
        "Membership and inclusion relations.",
        "∈: pertinência · ⊆: inclusão.",
        "∈: membership · ⊆: inclusion.",
      ],
      "group-7": [
        "Operações sobre famílias de fórmulas ou conjuntos.",
        "Operations over families of formulas or sets.",
        "⋀ ⋁ ⋃ ⋂",
        "⋀ ⋁ ⋃ ⋂",
      ],
      "group-8": [
        "Relações de ordem, aproximação e definições.",
        "Order, approximation and definition notations.",
        "≤ ≥ ≈ ≔",
        "≤ ≥ ≈ ≔",
      ],
      "group-9": [
        "Agrupamento de expressões e pontuação.",
        "Grouping expressions and punctuation.",
        "( ) [ ] { } …",
        "( ) [ ] { } …",
      ],
    };
    const d = details[id] || details.common,
      definition = definitions.find((g) => g.id === id);
    return {
      title: name(id),
      body:
        text(d[0], d[1]) +
        "\n" +
        text(d[2], d[3]) +
        "\n\n" +
        text("Clique para mostrar esta coleção.", "Click to show this collection."),
      icon: definition && definition.icon !== "grid" ? definition.icon : undefined,
    };
  }
  root.addEventListener("lp-displace-window", (e) => {
    const { element, dx, dy } = e.detail;
    let model;
    if (element === region) {
      freeLibrary();
      model = state.main;
    } else if (element === railWindow) model = state.rail;
    else model = [...windows.values()].find((p) => p.element === element)?.model;
    if (!model) return;
    model.x = (Number(model.x) || 0) + dx;
    model.y = (Number(model.y) || 0) + dy;
    root.style.setProperty('--workspace-min-height', Math.max(root.offsetHeight, model.y + element.offsetHeight + 16) + "px");
    position(element, model);
    persist();
  });
  requestAnimationFrame(() => {
    enforceWindowWidths();
    persist();
  });
  window.addEventListener("resize", () => requestAnimationFrame(enforceWindowWidths));
  globalThis.LPModularLibrary = {
    describe,
    get state() {
      return state;
    },
    reset() {
      root.dispatchEvent(new Event("lp-reset-library-layout"));
    },
  };
  paint();
  persist();
})();
