// Keep forms visible when a software keyboard reduces the visual viewport.
(() => {
  const viewport = window.visualViewport;
  if (!viewport) return;
  let pending = false;
  function update() {
    pending = false;
    root.style.setProperty("--visual-height", viewport.height + "px");
    root.style.setProperty("--visual-top", viewport.offsetTop + "px");
    const field = document.activeElement;
    if (matchMedia("(max-width:900px), (pointer:coarse) and (max-width:1100px)").matches && field?.matches("input,textarea")
      && viewport.height < innerHeight - 100) field.scrollIntoView({ block:"nearest" });
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  viewport.addEventListener("resize", schedule);
  viewport.addEventListener("scroll", schedule);
  update();
})();
