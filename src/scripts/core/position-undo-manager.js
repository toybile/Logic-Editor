globalThis.LPPositionHistory = (() => {
  const undo = [],
    redo = [];
  return {
    push(action) {
      undo.push(action);
      if (undo.length > 50) undo.shift();
      redo.length = 0;
    },
    undo() {
      const action = undo.pop();
      if (!action) return false;
      action.undo();
      redo.push(action);
      return true;
    },
    redo() {
      const action = redo.pop();
      if (!action) return false;
      action.redo();
      undo.push(action);
      return true;
    },
  };
})();
document.addEventListener("keydown", (event) => {
  if (
    !(event.ctrlKey || event.metaKey) ||
    event.altKey ||
    event.key.toLowerCase() !== "z" ||
    event.target.closest("input,textarea,[contenteditable=true],dialog")
  )
    return;
  const done = event.shiftKey ? LPPositionHistory.redo() : LPPositionHistory.undo();
  if (done) event.preventDefault();
  else {
    const button = document.querySelector(event.shiftKey ? ".hy-redo-lines" : ".hy-undo-lines");
    if (button && !button.disabled) {
      event.preventDefault();
      button.click();
    }
  }
});
