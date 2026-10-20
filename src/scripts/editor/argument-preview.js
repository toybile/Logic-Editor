function formatPrefixSpacing(text) {
  if (!ui.compactPrefixSpacing) return text;
  return text.replace(/([¬~∼∽!∀∃∄□◇])[^\S\r\n]+(?=\S)/gu, "$1")
    .replace(/\([^\S\r\n]+/gu, "(")
    .replace(/[^\S\r\n]+\)/gu, ")")
    .replace(/([\p{L}\p{N}_'′])[^\S\r\n]+(?=\()/gu, "$1");
}
function argument(withNumbers = numbered) {
  let number = 0;
  const lines = rows.map((row) => {
    if (row.role === "blank") return "";
    const text = formatPrefixSpacing(row.text.trim());
    if (!text) return "";
    if (row.role === "conclusion") return "∴ " + text;
    return withNumbers ? `${++number}. ${text}` : text;
  });
  while (lines.length && lines.at(-1) === "" && rows[lines.length - 1].role !== "blank")
    lines.pop();
  return lines.join("\n");
}
function render() {
  if (typeof scheduleLogicValidation === "function") scheduleLogicValidation();
  saveArguments();
  preview.textContent = argument();
  numberToggle.checked = numbered;
  numberToggle.setAttribute("aria-pressed", String(numbered));
  try {
    localStorage.setItem("formal-argument", JSON.stringify({ rows, numbered }));
  } catch {}
}
function argumentNotice(message) {
  status.textContent = "";
  favoriteNotice(translated(message));
}
async function copyArgument(numbered) {
  const text = argument(numbered);
  try {
    await navigator.clipboard.writeText(text);
    argumentNotice(numbered
      ? "Argumento copiado com números."
      : "Argumento copiado sem números.");
  } catch {
    setSection("preview", true);
    preview.textContent = text;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(preview);
    selection.removeAllRanges();
    selection.addRange(range);
    argumentNotice("Argumento selecionado. Use Ctrl+C para copiar.");
  }
}
numberToggle.onclick = () => {
  numbered = !numbered;
  status.textContent = "";
  render();
};
numberToggle.onchange = () => {
  numbered = numberToggle.checked;
  status.textContent = "";
  render();
};
document.querySelector("#copy").onclick = () => copyArgument(numbered);
document.querySelector("#download").onclick = () => {
  const url = URL.createObjectURL(new Blob([argument()], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "argumento.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  argumentNotice("Arquivo de texto gerado.");
};
