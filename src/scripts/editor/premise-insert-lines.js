(() => {
  const root = document.querySelector("#lp-hybrid"),
    rows = root.querySelector("#rows"),
    parent = rows.parentElement,
    overlay = document.createElement("div");
  overlay.className = "hy-premise-line-overlay";
  parent.append(overlay);
  let scheduled = false;
  function scan() {
    scheduled = false;
    const list = [...rows.querySelectorAll(":scope>.hy-row")],
      bounds = rows.getBoundingClientRect();
    const boundaries = list.length ? [
      { row: list[0], index: 0, top: list[0].offsetTop },
      ...list.map((row, index) => ({ row, index: index + 1, top: row.offsetTop + row.offsetHeight })),
    ] : [];
    while (overlay.children.length > boundaries.length) overlay.lastChild.remove();
    boundaries.forEach(({ row, index, top }, slot) => {
      let zone = overlay.children[slot];
      if (!zone) {
        zone = document.createElement("div");
        zone.className = "hy-add-section-zone hy-premise-add-line";
        const button = document.createElement("button");
        button.type = "button";
        button.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';
        button.onclick = () =>
          root.dispatchEvent(
            new CustomEvent("lp-insert-premise-line", { detail: { index: Number(zone.dataset.insertIndex) } }),
          );
        zone.append(button);
        overlay.append(zone);
      }
      zone.dataset.insertIndex = String(index);
      zone.querySelector("button").setAttribute("aria-label", index === 0 ? "Adicionar premissa acima" : "Adicionar premissa abaixo");
      const inset = parseFloat(getComputedStyle(row).getPropertyValue("--content-gutter")) || 44;
      zone.style.left = rows.offsetLeft + inset + "px";
      zone.style.top = rows.offsetTop + top - 10 + "px";
      zone.style.width = Math.max(0, bounds.width - inset) + "px";
    });
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(scan);
    }
  }
  new MutationObserver(schedule).observe(rows, { childList: true });
  new ResizeObserver(schedule).observe(rows);
  window.addEventListener("resize", schedule);
  schedule();
})();
