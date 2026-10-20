(() => {
  const root = document.querySelector("#lp-hybrid");
  let active = false;
  root.addEventListener(
    "pointerdown",
    (e) => {
      if (e.target.closest(".hy-mod-rail-window .hy-mod-grip")) active = true;
    },
    true,
  );
  window.addEventListener("pointerup", () => {
    if (!active) return;
    active = false;
    root.dispatchEvent(new CustomEvent("lp-rail-live-drag", { detail: { phase: "end" } }));
  });
})();
