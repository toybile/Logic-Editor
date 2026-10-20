(() => {
  const side = root.querySelector(".hy-side"),
    heading = side.querySelector(".hy-side-heading"),
    region = document.createElement("div");
  region.className = "hy-sidebar-region";
  side.before(region);
  region.append(heading, side);
  function update() {
    region.inert = root.dataset.focus === "true";
  }
  new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ["data-focus"] });
  update();
})();
