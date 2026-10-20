(() => {
  const button = root.querySelector("[data-action=focus]");
  button.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7"/></svg>';
  button.setAttribute("aria-label", "Home");
  button.dataset.hintText = "Home";
  button.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      location.assign("https://toybile.github.io/");
    },
    true,
  );
})();
