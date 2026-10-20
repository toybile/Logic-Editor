(() => {
  const tooltip = document.createElement("div");
  tooltip.id = "decoration-alt-hint";
  tooltip.className = "lp-decoration-alt-hint";
  tooltip.setAttribute("popover", "manual");
  tooltip.setAttribute("role", "tooltip");
  document.body.append(tooltip);
  let timer = null,
    hovered = null,
    lastPoint = null;
  function hide() {
    clearTimeout(timer);
    timer = null;
    if (tooltip.matches(":popover-open")) tooltip.hidePopover();
  }
  const enabled = innerDetailEnabled;
  function alt(value) {
    root.dataset.decorationAlt = String(value);
    root
      .querySelectorAll(".hy-inner-appearance-handle")
      .forEach((handle) => (handle.tabIndex = value && enabled(handle.parentElement) ? 0 : -1));
    if (value) hide();
  }
  window.addEventListener("keydown", (event) => {
    if (event.key === "Alt") alt(true);
  });
  window.addEventListener("keyup", (event) => {
    if (event.key === "Alt") alt(false);
  });
  window.addEventListener("blur", () => {
    alt(false);
    hide();
  });
  for (const panel of root.querySelectorAll(".hy-editor,.hy-argument-panel")) {
    const handle = panel.querySelector(".hy-inner-appearance-handle");
    handle.setAttribute("aria-describedby", tooltip.id);
    panel.addEventListener("pointermove", (event) => {
      if (
        !hoverHintsEnabled() ||
        event.pointerType !== "mouse" ||
        event.buttons ||
        event.altKey ||
        !enabled(panel)
      ) {
        hide();
        hovered = null;
        return;
      }
      const b = handle.getBoundingClientRect(),
        inside =
          event.clientX >= b.left &&
          event.clientX <= b.right &&
          event.clientY >= b.top &&
          event.clientY <= b.bottom;
      if (!inside) {
        hide();
        hovered = null;
        return;
      }
      if (
        hovered === panel &&
        lastPoint &&
        Math.hypot(lastPoint.x - event.clientX, lastPoint.y - event.clientY) < 2
      )
        return;
      hide();
      hovered = panel;
      lastPoint = { x: event.clientX, y: event.clientY };
      timer = setTimeout(() => {
        if (!enabled(panel)) return;
        tooltip.replaceChildren();
        const heading = document.createElement("span"),
          icon = document.createElement("span"),
          title = document.createElement("span"),
          body = document.createElement("span"),
          key = document.createElement("kbd");
        heading.className = "lp-hint-heading";
        icon.className = "lp-hint-icon";
        icon.textContent = "↔";
        icon.setAttribute("aria-hidden", "true");
        title.textContent = ui.language === "en" ? "Move decoration" : "Mover decoração";
        heading.append(icon, title);
        body.className = "lp-hint-body";
        key.textContent = "Alt";
        LPHints.format(
          body,
          ui.language === "en"
            ? "Hold Alt and drag horizontally."
            : "Segure Alt e arraste na horizontal.",
        );
        tooltip.append(heading, body);
        tooltip.style.setProperty(
          "--hint-accent",
          getComputedStyle(panel).getPropertyValue("--panel-marker"),
        );
        tooltip.style.colorScheme = root.style.colorScheme;
        tooltip.showPopover();
        const size = tooltip.getBoundingClientRect();
        tooltip.style.left = Math.max(8, Math.min(innerWidth - size.width - 8, b.right + 9)) + "px";
        tooltip.style.top =
          Math.max(8, Math.min(innerHeight - size.height - 8, event.clientY - 12)) + "px";
      }, getHoverDelay());
    });
    panel.addEventListener("pointerleave", () => {
      hide();
      hovered = null;
    });
  }
  root.addEventListener("lp-hover-delay-change", () => {
    hide();
    hovered = null;
  });
  root.addEventListener("pointerdown", hide);
  root.addEventListener("lp-ui-colors", () => {
    hide();
    alt(false);
  });
  new MutationObserver(() => {
    if (hovered && !enabled(hovered)) {
      hide();
      hovered = null;
    }
  }).observe(root, { subtree: true, attributes: true, attributeFilter: ["data-internal-detail"] });
  alt(false);
})();
