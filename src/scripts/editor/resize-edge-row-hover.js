(() => {
  const panel = root.querySelector(".hy-editor"),
    frame = panel.closest(".hy-panel-frame");
  function clear() {
    panel
      .querySelectorAll("[data-gutter-hover]")
      .forEach((row) => row.removeAttribute("data-gutter-hover"));
  }
  frame.addEventListener("pointermove", (event) => {
    for (const row of panel.querySelectorAll("#rows>.hy-row")) {
      const b = row.getBoundingClientRect();
      const hit =
        event.clientX >= b.left - 36 &&
        event.clientX <= b.left + 44 &&
        event.clientY >= b.top &&
        event.clientY <= b.bottom;
      if (hit) row.dataset.gutterHover = "true";
      else row.removeAttribute("data-gutter-hover");
    }
  });
  frame.addEventListener("pointerleave", clear);
})();
