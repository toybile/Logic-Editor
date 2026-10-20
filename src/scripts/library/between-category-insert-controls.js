(() => {
  const root = document.querySelector("#lp-hybrid"),
    stack = root.querySelector(".hy-symbol-dock-stack"),
    plus =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';
  let pending = false;
  function scan() {
    pending = false;
    const cards = [...stack.children].filter((e) => e.matches(".hy-mod-palette"));
    const ids = new Set(cards.map((e) => e.dataset.windowId));
    for (const zone of stack.querySelectorAll(".hy-add-section-zone"))
      if (!ids.has(zone.dataset.beforeId)) zone.remove();
    for (const card of cards) {
      let zone = [...stack.querySelectorAll(".hy-add-section-zone")].find(
        (z) => z.dataset.beforeId === card.dataset.windowId,
      );
      if (!zone) {
        zone = document.createElement("div");
        zone.className = "hy-add-section-zone";
        zone.dataset.beforeId = card.dataset.windowId;
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", "Adicionar categoria aqui");
        button.innerHTML = plus;
        button.onclick = () =>
          root.dispatchEvent(
            new CustomEvent("lp-add-symbol-card", {
              detail: { group: "common", beforeId: card.dataset.windowId },
            }),
          );
        zone.append(button);
      }
      if (card.previousElementSibling !== zone) card.before(zone);
    }
    for (const button of root.querySelectorAll(".hy-add-section-zone button"))
      if (!button.querySelector("svg")) button.innerHTML = plus;
  }
  new MutationObserver(() => {
    if (!pending) {
      pending = true;
      queueMicrotask(scan);
    }
  }).observe(stack, { childList: true });
  scan();
})();
