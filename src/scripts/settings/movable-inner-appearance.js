function innerDetailEnabled(panel) {
  return Boolean(
    panel &&
      !["none", "gradient"].includes(panel.dataset.internalDetail) &&
      getComputedStyle(panel.querySelector(".hy-inner-appearance-handle")).display !== "none",
  );
}
(() => {
  for (const [key, selector] of [
    ["editor", ".hy-editor"],
    ["preview", ".hy-argument-panel"],
  ]) {
    const panel = root.querySelector(selector),
      handle = document.createElement("button"),
      eye = panel.querySelector('[data-action="' + key + '"]');
    handle.type = "button";
    handle.className = "hy-inner-appearance-handle";
    handle.setAttribute("aria-label", "Mover detalhe interno horizontalmente");
    panel.append(handle);
    let gesture = null;
    function apply() {
      const value = Number(ui[key + "DetailOffset"]) || 0;
      panel.style.setProperty("--detail-offset", value + "px");
      const box = panel.getBoundingClientRect(), eyeBox = eye.getBoundingClientRect();
      if (!eyeBox.width) return;
      const scale = box.width / panel.offsetWidth || 1;
      const center = eyeBox.left + eyeBox.width / 2;
      const border = parseFloat(getComputedStyle(panel).borderLeftWidth) || 0;
      panel.style.setProperty("--eye-column", (center - box.left) / scale - border + "px");
      const symbolBox = eye.querySelector("svg").getBoundingClientRect();
      const borderTop = parseFloat(getComputedStyle(panel).borderTopWidth) || 0;
      panel.style.setProperty("--detail-top", (symbolBox.bottom - box.top) / scale + 8 - borderTop + "px");
      const firstRow = panel.querySelector(".hy-row");
      if (firstRow) {
        const rowBox = firstRow.getBoundingClientRect();
        const rowBorder = parseFloat(getComputedStyle(firstRow).borderLeftWidth) || 0;
        panel.style.setProperty("--row-eye-column", (center - rowBox.left) / scale - rowBorder + "px");
      }
    }
    function set(value) {
      ui[key + "DetailOffset"] = Math.max(-24, Math.min(14, Math.round(value)));
      apply();
      saveUI();
    }
    handle.onpointerdown = (e) => {
      if (e.button !== 0 || !e.altKey || !innerDetailEnabled(panel)) return;
      e.preventDefault();
      e.stopPropagation();
      gesture = { id: e.pointerId, x: e.clientX, offset: Number(ui[key + "DetailOffset"]) || 0 };
      handle.setPointerCapture(e.pointerId);
    };
    handle.onpointermove = (e) => {
      if (gesture?.id === e.pointerId) {
        const offset = gesture.offset + e.clientX - gesture.x;
        set(Math.abs(offset) <= 3 ? 0 : offset);
      }
    };
    handle.onpointerup = handle.onpointercancel = (e) => {
      if (gesture?.id !== e.pointerId) return;
      gesture = null;
      if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
    };
    handle.onkeydown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        set((Number(ui[key + "DetailOffset"]) || 0) + (e.key === "ArrowRight" ? 1 : -1));
      }
      if (e.key === "Home") {
        e.preventDefault();
        set(0);
      }
    };
    handle.ondblclick = () => set(0);
    const scheduleGeometry = () => requestAnimationFrame(() => requestAnimationFrame(apply));
    root.addEventListener("lp-ui-colors", scheduleGeometry);
    root.querySelector("#scale-writing").addEventListener("input", scheduleGeometry);
    window.addEventListener("resize", scheduleGeometry);
    panel.addEventListener("animationend", scheduleGeometry);
    const geometryObserver = new ResizeObserver(apply);
    geometryObserver.observe(panel);
    geometryObserver.observe(eye);
    apply();
  }
  Object.assign(translations, {
    "Mover detalhe interno horizontalmente": "Move inner detail horizontally",
  });
  applyLanguage();
})();
