(() => {
  const root = document.querySelector("#lp-hybrid"),
    menu = root.querySelector(".hy-card-picker-menu");
  let gesture = null,
    suppressUntil = 0;
  function cleanup() {
    if (!gesture) return;
    const g = gesture;
    gesture = null;
    if (g.option.hasPointerCapture(g.id)) g.option.releasePointerCapture(g.id);
    g.ghost?.remove();
  }
  function place(e) {
    const g = gesture,
      ghost = g.ghost;
    const x = Math.max(8, Math.min(innerWidth - ghost.offsetWidth - 8, e.clientX - g.offsetX)),
      y = Math.max(8, Math.min(innerHeight - ghost.offsetHeight - 8, e.clientY - 18));
    ghost.style.left = x + "px";
    ghost.style.top = y + "px";
    g.left = x;
    g.top = y;
  }
  menu.addEventListener("pointerdown", (e) => {
    const option = e.target.closest("[data-card-category]");
    if (!option || e.button !== 0) return;
    cleanup();
    const box = option.getBoundingClientRect();
    gesture = {
      option,
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      time: performance.now(),
      offsetX: Math.min(100, e.clientX - box.left),
      ghost: null,
    };
    option.setPointerCapture(e.pointerId);
  });
  menu.addEventListener("pointermove", (e) => {
    const g = gesture;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x,
      dy = e.clientY - g.y;
    if (!g.ghost) {
      if (Math.hypot(dx, dy) < 14 || performance.now() - g.time < 120) return;
      const ghost = document.createElement("section");
      ghost.className = "hy-mod-palette hy-category-drag-preview";
      ghost.setAttribute("popover", "manual");
      ghost.setAttribute("aria-hidden", "true");
      root.dispatchEvent(
        new CustomEvent("lp-preview-category", {
          detail: { id: g.option.dataset.cardCategory, host: ghost },
        }),
      );
      root.append(ghost);
      g.ghost = ghost;
      ghost.showPopover();
      suppressUntil = performance.now() + 1000;
    }
    e.preventDefault();
    place(e);
  });
  menu.addEventListener("pointerup", (e) => {
    if (!gesture || gesture.id !== e.pointerId) return;
    const g = gesture;
    if (g.ghost) {
      place(e);
      const origin = root.getBoundingClientRect();
      root.dispatchEvent(
        new CustomEvent("lp-detach-category", {
          detail: {
            id: g.option.dataset.cardCategory,
            x: g.left - origin.left,
            y: g.top - origin.top,
          },
        }),
      );
      suppressUntil = performance.now() + 500;
      menu.hidePopover();
    }
    cleanup();
  });
  menu.addEventListener("pointercancel", cleanup);
  menu.addEventListener("lostpointercapture", () => {
    if (gesture) cleanup();
  });
  menu.addEventListener(
    "click",
    (e) => {
      if (performance.now() < suppressUntil) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && gesture) {
        cleanup();
        suppressUntil = performance.now() + 500;
      }
    },
    true,
  );
  menu.addEventListener("toggle", () => {
    if (!menu.matches(":popover-open")) cleanup();
  });
})();
