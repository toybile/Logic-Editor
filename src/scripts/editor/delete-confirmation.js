async function confirmDeletion(message) {
  let dialog = document.querySelector("#delete-dialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "delete-dialog";
    dialog.setAttribute("aria-labelledby", "delete-title");
    dialog.setAttribute("aria-describedby", "delete-message");
    dialog.innerHTML =
      '<div class="hy-settings-head"><h2 id="delete-title"></h2><button type="button" class="hy-button hy-icon-button" data-delete-cancel aria-label="Fechar">×</button></div><p id="delete-message"></p><div class="hy-rename-actions"><button type="button" class="hy-button" data-delete-cancel></button><button type="button" class="hy-button hy-delete-confirm"></button></div>';
    root.append(dialog);
  }
  if (dialog.open) return false;
  const english = ui.language === "en";
  dialog.querySelector("#delete-title").textContent = english
    ? "Confirm deletion"
    : "Confirmar exclusão";
  dialog.querySelector("#delete-message").textContent = message;
  const cancels = dialog.querySelectorAll("[data-delete-cancel]");
  cancels[1].textContent = english ? "Cancel" : "Cancelar";
  const confirm = dialog.querySelector(".hy-delete-confirm");
  confirm.textContent = english ? "Delete" : "Excluir";
  return new Promise((resolve) => {
    let settled = false;
    function finish(value) {
      if (settled) return;
      settled = true;
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("close", closed);
      dialog.close();
      resolve(value);
    }
    function cancel(event) {
      event.preventDefault();
      finish(false);
    }
    function closed() {
      finish(false);
    }
    cancels.forEach((button) => (button.onclick = () => finish(false)));
    confirm.onclick = () => finish(true);
    dialog.addEventListener("cancel", cancel);
    dialog.addEventListener("close", closed);
    dialog.showModal();
    cancels[1].focus();
  });
}
