(() => {
  const root = document.querySelector("#lp-hybrid"),
    key = "formal-detached-collapsed-v1";
  let states = {};
  try {
    states = JSON.parse(localStorage.getItem(key)) || {};
  } catch {}
  const id = (e) => (e.matches(".hy-mod-rail-window") ? "categories" : e.dataset.windowId);
  function apply(e) {
    const value = !!states[id(e)];
    e.dataset.collapsed = String(value);
    const grip = e.querySelector(".hy-mod-grip");
    if (grip) {
      grip.setAttribute("aria-expanded", String(!value));
      grip.dataset.hintText = document.documentElement.lang.startsWith("pt")
        ? "Clique para recolher ou expandir. Segure e arraste para mover."
        : "Click to collapse or expand. Hold and drag to move.";
    }
  }
  let press = null;
  root.addEventListener(
    "pointerdown",
    (event) => {
      const grip = event.target.closest(
        ".hy-mod-palette .hy-mod-grip,.hy-mod-rail-window .hy-mod-grip",
      );
      if (!grip || event.button !== 0) return;
      press = { id: event.pointerId, grip, x: event.clientX, y: event.clientY, moved: false };
    },
    true,
  );
  window.addEventListener(
    "pointermove",
    (e) => {
      if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 4) press.moved = true;
    },
    true,
  );
  root.addEventListener(
    "click",
    (e) => {
      const grip = e.target.closest(
        ".hy-mod-palette .hy-mod-grip,.hy-mod-rail-window .hy-mod-grip",
      );
      if (!grip) return;
      // The gesture owner already replays the click after releasing capture.
      if (e.detail > 0 && !press) return;
      const windowElement = grip.closest(".hy-mod-palette,.hy-mod-rail-window");
      if (press?.moved) {
        press = null;
        return;
      }
      press = null;
      states[id(windowElement)] = windowElement.dataset.collapsed !== "true";
      apply(windowElement);
      try {
        localStorage.setItem(key, JSON.stringify(states));
      } catch {}
    },
    true,
  );
  window.addEventListener("pointercancel", () => (press = null));
  const observed = new WeakSet();
  function scan() {
    for (const e of root.querySelectorAll(
      ".hy-mod-palette:not(.hy-category-drag-preview),.hy-mod-rail-window",
    ))
      if (!observed.has(e)) {
        observed.add(e);
        apply(e);
      }
  }
  new MutationObserver(scan).observe(root, { subtree: true, childList: true });
  scan();
})();
