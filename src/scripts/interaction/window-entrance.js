// Presentation only: retain saved sizes, positions and each panel's own transforms.
(() => {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || !Element.prototype.animate) return;
  const windows = [...root.querySelectorAll(
    ".hy-modular-library, .hy-editor, .hy-argument-panel, .hy-mod-palette[data-docked='false']",
  )].filter(node => node.getClientRects().length && getComputedStyle(node).visibility !== "hidden");
  const animations = [];
  let stopped = false;
  const stop = () => {
    stopped = true;
    for (const animation of animations) animation.cancel();
    for (const node of windows) node.style.removeProperty("opacity");
    document.removeEventListener("pointerdown", pauseForPointer, true);
    document.removeEventListener("click", stop, true);
    document.removeEventListener("pointercancel", stop, true);
    document.removeEventListener("keydown", stop, true);
    motion.removeEventListener("change", stop);
  };
  const pauseForPointer = () => {
    for (const animation of animations) animation.pause();
    document.addEventListener("pointerup", () => requestAnimationFrame(stop), { capture: true, once: true });
  };
  for (const node of windows) node.style.opacity = "0";
  document.addEventListener("pointerdown", pauseForPointer, true);
  document.addEventListener("click", stop, true);
  document.addEventListener("pointercancel", stop, true);
  document.addEventListener("keydown", stop, true);
  motion.addEventListener("change", stop);
  // Let the saved workspace finish its initial layout before the entrance begins.
  document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => {
    if (stopped) return;
    windows.forEach((node, index) => {
      const animation = node.animate([
        { opacity: 0, scale: ".78", offset: 0, easing: "cubic-bezier(.16,1,.3,1)" },
        { opacity: 1, scale: "1.035 1.045", offset: .43, easing: "ease-in-out" },
        { opacity: 1, scale: ".987 .98", offset: .64, easing: "ease-in-out" },
        { opacity: 1, scale: "1.008 1.012", offset: .80, easing: "ease-in-out" },
        { opacity: 1, scale: ".997 .995", offset: .92, easing: "ease-in-out" },
        { opacity: 1, scale: "1", offset: 1 },
      ], { duration: 820, delay: Math.min(index * 65, 260), fill: "both" });
      animation.id = "lp-window-entrance";
      animations.push(animation);
      node.style.removeProperty("opacity");
    });
    Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(stop);
  }))));
})();
