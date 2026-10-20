root.dataset.initialLayout = ui.initialLayout || "legacy";

function restoreInitialLayoutProfile() {
  ui.initialLayout = "guided";
  root.dataset.initialLayout = "guided";
  saveUI();
}
