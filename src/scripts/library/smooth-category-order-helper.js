globalThis.LPAnimateCategoryOrder = (stack, change) => {
  const elements = [...stack.querySelectorAll(":scope>.hy-mod-palette")],
    positions = new Map(elements.map((e) => [e, e.getBoundingClientRect().top]));
  change();
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  for (const e of elements) {
    if (!e.isConnected) continue;
    const previous = positions.get(e);
    for (const a of e.getAnimations()) a.cancel();
    const dy = previous - e.getBoundingClientRect().top;
    if (Math.abs(dy) > 0.5)
      e.animate([{ transform: "translateY(" + dy + "px)" }, { transform: "translateY(0)" }], {
        duration: 180,
        easing: "cubic-bezier(.2,.8,.2,1)",
      });
  }
};
