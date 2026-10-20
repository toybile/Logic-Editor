(() => {
  function label() {
    root.querySelectorAll(".hy-delete-line").forEach((button) => {
      const text = ui.language === "en" ? "Delete" : "Deletar";
      if (button.dataset.deleteLabel !== text) button.dataset.deleteLabel = text;
    });
  }
  new MutationObserver(label).observe(root, { childList: true, subtree: true });
  root.querySelector("#settings-language").addEventListener("click", label);
  label();
})();
