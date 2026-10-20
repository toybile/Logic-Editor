(() => {
  const root = document.querySelector("#lp-hybrid");
  root.addEventListener(
    "click",
    (e) => {
      const button = e.target.closest(".hy-add-section-zone button");
      if (!button || e.detail === 0) return;
      requestAnimationFrame(() => {
        if (document.activeElement === button) button.blur();
      });
    },
    true,
  );
})();
