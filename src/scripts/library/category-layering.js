// Docked categories keep their original stacking order when inserted or duplicated.
(() => {
  const stack = root.querySelector(".hy-symbol-dock-stack");
  function updateDepth() {
    stack.querySelectorAll(":scope > .hy-mod-palette").forEach((element, index) => {
      const value = String(index + 1);
      if (element.style.zIndex !== value) element.style.zIndex = value;
    });
  }
  new MutationObserver(updateDepth).observe(stack, { childList: true });
  updateDepth();
})();
