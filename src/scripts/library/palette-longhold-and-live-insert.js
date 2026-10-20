(() => {
  const root = document.querySelector("#lp-hybrid"),
    stack = root.querySelector(".hy-symbol-dock-stack");
  let gesture = null,
    ignoreClickUntil = 0;
  function setDock(g, docked, beforeId) {
    root.dispatchEvent(
      new CustomEvent("lp-set-palette-dock", {
        detail: {
          id: g.id,
          docked,
          beforeId,
          insertEnd: docked && g.moved && !beforeId,
          width: g.width,
          x: g.x,
          y: g.y,
        },
      }),
    );
  }
  function clearPreview(g) {
    g.preview?.remove();
    g.preview = null;
    g.beforeId = null;
    g.accept = false;
  }
  function finish() {
    const g = gesture;
    if (!g) return;
    gesture = null;
    clearTimeout(g.timer);
    clearPreview(g);
    g.element.classList.remove("hy-palette-dragging");
    g.element.style.height = g.originalHeight || "";
    g.element.style.minWidth = g.originalMinWidth || "";
    g.element.style.setProperty("padding", g.originalPadding || "");
    g.element.style.setProperty("border", g.originalBorder || "");
    if (root.hasPointerCapture(g.pointer)) root.releasePointerCapture(g.pointer);
  }
  function move(e) {
    const g = gesture;
    if (!g) return;
    const dx = e.clientX - g.startX,
      dy = e.clientY - g.startY;
    if (!g.moved) {
      if (Math.hypot(dx, dy) < 5) return;
      clearTimeout(g.timer);
      g.moved = true;
      const r = g.element.getBoundingClientRect();
      g.width = r.width;
      g.height = r.height;
      if (g.fromDock) setDock(g, false);
      g.element.style.setProperty("width", g.width + "px", "important");
      g.element.style.height = g.height + "px";
      g.element.style.minWidth = "0px";
      g.element.style.setProperty("padding", g.sourcePadding, "important");
      g.element.style.setProperty("border", g.sourceBorder, "important");
      g.element.classList.add("hy-palette-dragging");
    }
    const origin = root.getBoundingClientRect();
    g.x = Math.max(8, e.clientX - g.offsetX - origin.left);
    g.y = Math.max(80, e.clientY - g.offsetY - origin.top);
    g.element.style.left = g.x + "px";
    g.element.style.top = g.y + "px";
    if (g.fromDock) {
      const lib = root.querySelector(".hy-modular-library").getBoundingClientRect(),
        cards = [...stack.querySelectorAll(":scope>.hy-mod-palette")].filter(
          (c) => c !== g.element,
        ),
        bounds = stack.getBoundingClientRect();
      if (
        e.clientX >= lib.left - 20 &&
        e.clientX <= lib.right + 20 &&
        e.clientY >= bounds.top - 20 &&
        e.clientY <= Math.max(bounds.bottom, bounds.top + 50) + 30
      ) {
        if (!g.preview) {
          g.preview = document.createElement("div");
          g.preview.className = "hy-card-insert-preview";
          g.preview.style.width = g.width + "px";
          g.preview.style.height = g.height + "px";
          const clone = g.element.querySelector(".hy-mod-symbols")?.cloneNode(true);
          g.preview.setAttribute("aria-hidden", "true");
        }
        const target = globalThis.LPCategoryRowTarget
          ? LPCategoryRowTarget(
              stack,
              g.preview,
              cards,
              e.clientY - (g.offsetY ?? 18),
              g.height || g.sourceHeight || g.ghost?.offsetHeight,
              g.nextId,
            )
          : cards.find((c) => e.clientY < c.getBoundingClientRect().top);
        g.beforeId = target?.dataset.windowId || null;
        g.accept = true;
        if (
          (target && target.previousElementSibling !== g.preview) ||
          (!target && stack.lastElementChild !== g.preview)
        ) {
          const change = () => (target ? target.before(g.preview) : stack.append(g.preview));
          if (globalThis.LPAnimateCategoryOrder) LPAnimateCategoryOrder(stack, change);
          else change();
        }
      } else clearPreview(g);
    }
  }
  root.addEventListener(
    "pointerdown",
    (e) => {
      ignoreClickUntil = 0;
      const element = e.target.closest(".hy-mod-palette:not(.hy-category-drag-preview)");
      if (
        !element ||
        e.button !== 0 ||
        e.target.closest("[data-create-category],.hy-library-width-edge,.hy-mod-resize")
      )
        return;
      finish();
      const r = element.getBoundingClientRect(),
        grip = e.target.closest(".hy-mod-grip");
      // Symbol holds and native vertical scrolling must reach their own controls.
      if (e.pointerType === "touch" && !grip) return;
      gesture = {
        element,
        id: element.dataset.windowId,
        pointer: e.pointerId,
        clickTarget: e.target.closest("button"),
        fromDock: element.dataset.docked === "true",
        originalHeight: element.style.height,
        originalMinWidth: element.style.minWidth,
        originalBorder: element.style.border,
        sourceBorder: getComputedStyle(element).border,
        originalPadding: element.style.padding,
        sourcePadding: getComputedStyle(element).padding,
        nextId: [...stack.querySelectorAll(":scope>.hy-mod-palette")].slice(
          [...stack.querySelectorAll(":scope>.hy-mod-palette")].indexOf(element) + 1,
        )[0]?.dataset.windowId,
        slots: [...stack.querySelectorAll(":scope>.hy-mod-palette")]
          .filter((c) => c !== element)
          .map((c) => ({ id: c.dataset.windowId, top: c.getBoundingClientRect().top })),
        startX: e.clientX,
        startY: e.clientY,
        offsetX: e.clientX - r.left,
        offsetY: e.clientY - r.top,
        moved: false,
      };
      const g = gesture;
      if (grip && !g.fromDock)
        g.timer = setTimeout(() => {
          if (gesture !== g || g.moved) return;
          g.held = true;
          setDock(g, true);
          ignoreClickUntil = performance.now() + 400;
        }, getHoldDelay());
      root.setPointerCapture(e.pointerId);
      e.stopImmediatePropagation();
    },
    true,
  );
  root.addEventListener(
    "pointermove",
    (e) => {
      if (!gesture || gesture.pointer !== e.pointerId || gesture.held) return;
      move(e);
      if (gesture?.moved) e.preventDefault();
    },
    true,
  );
  root.addEventListener(
    "pointerup",
    (e) => {
      const g = gesture;
      if (!g || g.pointer !== e.pointerId) return;
      clearTimeout(g.timer);
      if (g.moved) {
        move(e);
        const accepted = g.accept,
          before = g.beforeId;
        clearPreview(g);
        setDock(g, !!accepted, before);
        ignoreClickUntil = performance.now() + 250;
        root.dispatchEvent(
          new CustomEvent("lp-window-manual-placement", { detail: { element: g.element } }),
        );
      } else if (!g.held && g.clickTarget) {
        g.clickTarget.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
            detail: 1,
            clientX: e.clientX,
            clientY: e.clientY,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
          }),
        );
        // A captured touch can still deliver its compatibility click to the original button.
        ignoreClickUntil = performance.now() + 250;
      }
      finish();
    },
    true,
  );
  root.addEventListener(
    "click",
    (e) => {
      if (performance.now() < ignoreClickUntil && e.target.closest(".hy-mod-palette")) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );
  root.addEventListener("pointercancel", finish, true);
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") finish();
    },
    true,
  );
})();
