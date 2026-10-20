(() => {
  const root = document.querySelector("#lp-hybrid");
  let gesture = null,
    ignoreClickUntil = 0;
  const selector =
    "[data-create-category],.hy-mod-rail-toggle:not([data-close-rail=true]),.hy-mod-rail-window .hy-mod-grip";
  function cleanup() {
    if (!gesture) return;
    const g = gesture;
    gesture = null;
    g.preview?.remove();
    if (g.ghost && !g.liveDrag) g.ghost.remove();
    if (root.hasPointerCapture(g.id)) root.releasePointerCapture(g.id);
  }
  function place(e) {
    const g = gesture;
    g.left = Math.max(8, Math.min(innerWidth - g.ghost.offsetWidth - 8, e.clientX - g.offsetX));
    g.top = Math.max(
      8,
      Math.min(innerHeight - g.ghost.offsetHeight - 8, e.clientY - (g.offsetY ?? 18)),
    );
    if (g.liveDrag) {
      const r = root.getBoundingClientRect();
      root.dispatchEvent(
        new CustomEvent("lp-rail-live-drag", {
          detail: { phase: "move", x: g.left - r.left, y: g.top - r.top },
        }),
      );
    } else {
      g.ghost.style.left = g.left + "px";
      g.ghost.style.top = g.top + "px";
      if (g.fromDock) {
        const stack = root.querySelector(".hy-symbol-dock-stack"),
          lib = root.querySelector(".hy-modular-library").getBoundingClientRect(),
          r = stack.getBoundingClientRect();
        g.accept =
          e.clientX >= lib.left - 20 &&
          e.clientX <= lib.right + 20 &&
          e.clientY >= r.top - 20 &&
          e.clientY <= r.bottom + 30;
        if (g.accept) {
          if (!g.preview) {
            g.preview = document.createElement("div");
            g.preview.className = "hy-card-insert-preview";
            g.preview.style.height = (g.sourceHeight || g.ghost.offsetHeight) + "px";
            g.preview.style.width = (g.sourceWidth || g.ghost.offsetWidth) + "px";
          }
          const cards = [...stack.querySelectorAll(":scope>.hy-mod-palette")],
            target = LPCategoryRowTarget(
              stack,
              g.preview,
              cards,
              g.top,
              g.sourceHeight || g.ghost.offsetHeight,
              g.nextId,
            );
          g.beforeId = target?.dataset.windowId;
          if (
            (target && target.previousElementSibling !== g.preview) ||
            (!target && stack.lastElementChild !== g.preview)
          ) {
            const change = () => (target ? target.before(g.preview) : stack.append(g.preview));
            if (globalThis.LPAnimateCategoryOrder) LPAnimateCategoryOrder(stack, change);
            else change();
          }
        } else {
          g.preview?.remove();
          g.preview = null;
        }
      }
    }
  }
  root.addEventListener(
    "click",
    (e) => {
      if (
        e.target.closest("[data-create-category],.hy-mod-rail-toggle:not([data-close-rail=true])")
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const button = e.target.closest("[data-create-category]");
        if (button && performance.now() > ignoreClickUntil) {
          const owner = button.closest("[data-window-id]");
          if (owner)
            root.dispatchEvent(
              new CustomEvent("lp-clone-symbol-card", { detail: { id: owner.dataset.windowId } }),
            );
        }
      }
    },
    true,
  );
  root.addEventListener(
    "pointerdown",
    (e) => {
      const button = e.target.closest(selector);
      if (!button || e.button !== 0) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      cleanup();
      gesture = {
        button,
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
        offsetX: 80,
        rail: button.matches(".hy-mod-rail-toggle,.hy-mod-grip"),
        sourceWidth: button.closest(".hy-mod-palette")?.getBoundingClientRect().width,
        sourceHeight: button.closest(".hy-mod-palette")?.getBoundingClientRect().height,
        sourcePadding: button.closest(".hy-mod-palette")
          ? getComputedStyle(button.closest(".hy-mod-palette")).padding
          : null,
        source: button.closest(".hy-mod-palette"),
        nextId: (() => {
          const all = [...root.querySelectorAll(".hy-symbol-dock-stack>.hy-mod-palette")],
            i = all.indexOf(button.closest(".hy-mod-palette"));
          return all[i + 1]?.dataset.windowId;
        })(),
        slots: [...root.querySelectorAll(".hy-symbol-dock-stack>.hy-mod-palette")].map((c) => ({
          id: c.dataset.windowId,
          top: c.getBoundingClientRect().top,
        })),
        category: button.dataset.createCategory,
        fromDock: button.closest(".hy-mod-palette")?.dataset.docked === "true",
      };
      if (gesture.source && !gesture.rail) {
        const bounds = gesture.source.getBoundingClientRect();
        gesture.offsetX = e.clientX - bounds.left;
        gesture.offsetY = e.clientY - bounds.top;
      }
      if (gesture.rail) {
        const r = (
          button.matches(".hy-mod-grip")
            ? button.closest(".hy-mod-rail-window")
            : root.querySelector(".hy-mod-nav")
        ).getBoundingClientRect();
        gesture.offsetX = e.clientX - r.left;
        gesture.offsetY = e.clientY - r.top;
      }
      root.setPointerCapture(e.pointerId);
    },
    true,
  );
  root.addEventListener(
    "pointermove",
    (e) => {
      const g = gesture;
      if (!g || g.id !== e.pointerId) return;
      if (!g.ghost) {
        if (Math.hypot(e.clientX - g.x, e.clientY - g.y) < 5) return;
        const ghost = document.createElement("section");
        ghost.className = "hy-mod-palette hy-category-drag-preview";
        ghost.setAttribute("popover", "manual");
        ghost.setAttribute("aria-hidden", "true");
        if (g.rail) {
          root.dispatchEvent(new CustomEvent("lp-rail-live-drag", { detail: { phase: "start" } }));
          g.live = root.querySelector(".hy-mod-rail-window");
          g.ghost = g.live;
          g.liveDrag = true;
          place(e);
          return;
        } else
          root.dispatchEvent(
            new CustomEvent("lp-preview-category", { detail: { id: g.category, host: ghost } }),
          );
        if (g.source) {
          ghost.replaceChildren(
            ...[...g.source.children]
              .filter((c) => !c.matches(".hy-library-width-edge"))
              .map((c) => c.cloneNode(true)),
          );
          ghost.style.setProperty("width", g.sourceWidth + "px", "important");
          ghost.style.height = g.sourceHeight + "px";
          ghost.style.setProperty("padding", g.sourcePadding, "important");
          ghost.style.setProperty("border", getComputedStyle(g.source).border, "important");
          ghost.style.boxSizing = "border-box";
        }
        root.append(ghost);
        g.ghost = ghost;
        ghost.showPopover();
      }
      e.preventDefault();
      place(e);
    },
    true,
  );
  root.addEventListener(
    "pointerup",
    (e) => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const g = gesture;
      if (g.ghost) {
        place(e);
        const r = root.getBoundingClientRect();
        if (g.accept) {
          root.dispatchEvent(
            new CustomEvent("lp-add-symbol-card", {
              detail: { group: g.category, beforeId: g.beforeId },
            }),
          );
        } else
          root.dispatchEvent(
            new CustomEvent(g.rail ? "lp-rail-live-drag" : "lp-detach-category", {
              detail: { phase: "end", id: g.category, x: g.left - r.left, y: g.top - r.top },
            }),
          );
      } else if (g.button.matches(".hy-mod-grip")) g.button.click();
      else {
        const owner = g.button.closest("[data-window-id]");
        if (owner)
          root.dispatchEvent(
            new CustomEvent("lp-clone-symbol-card", { detail: { id: owner.dataset.windowId } }),
          );
      }
      ignoreClickUntil = performance.now() + 400;
      cleanup();
    },
    true,
  );
  root.addEventListener("pointercancel", cleanup, true);
  root.addEventListener(
    "lostpointercapture",
    () => {
      if (gesture && !root.hasPointerCapture(gesture.id)) cleanup();
    },
    true,
  );
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") cleanup();
    },
    true,
  );
})();
