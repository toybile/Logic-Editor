(() => {
  function resize() {
    root.querySelectorAll(".hy-block").forEach((input) => {
      const style = getComputedStyle(input),
        measure = document.createElement("span");
      measure.style.cssText =
        "position:absolute;visibility:hidden;white-space:pre;font:" + style.font;
      measure.textContent = input.value || "M";
      root.append(measure);
      const extra =
        parseFloat(style.paddingLeft) +
        parseFloat(style.paddingRight) +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.borderRightWidth) +
        4;
      input.style.width =
        Math.max(
          parseFloat(style.minWidth) || 36,
          Math.ceil(measure.getBoundingClientRect().width + extra),
        ) + "px";
      measure.remove();
    });
  }
  root
    .querySelector("#scale-writing")
    .addEventListener("input", () => requestAnimationFrame(resize));
  document.fonts.ready.then(resize);
})();
