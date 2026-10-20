// Stable entry points: bootstrap uses primitives until the row controller installs its behavior.
const rowController = {};
const workspaceEvents = new EventTarget();
function buildRow(...args) {
  return (rowController.build || createRowElement)(...args);
}
function addLine(...args) {
  return (rowController.add || insertRow)(...args);
}
function deleteLine(...args) {
  return rowController.remove?.(...args);
}
function startDrag(...args) {
  return (rowController.start || beginRowDrag)(...args);
}
function updateDrag(...args) {
  return (rowController.update || updateSingleRowDrag)(...args);
}
function finishDrag(...args) {
  return (rowController.finish || endRowDrag)(...args);
}

const LPReturningUser = (() => {
  try {
    return [
      "formal-argument-ui",
      "formal-arguments-v1",
      "formal-argument",
      "formal-caps-lock",
      "formal-size-library",
      "formal-size-writing",
      "formal-panel-layout-v1",
    ].some((key) => localStorage.getItem(key) !== null);
  } catch {
    return true;
  }
})();
const rowsContainer = document.querySelector("#rows"),
  preview = document.querySelector("#preview"),
  status = document.querySelector("#status");
let rows = [{ text: "", role: "premise" }];
let active = null,
  numbered = true;
let drag = null;
const rowElements = new WeakMap();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function animateOrder() {
  const positions = new Map(
    [...rowsContainer.children].map((line) => [line, line.getBoundingClientRect().top]),
  );
  // Keep the captured handle connected; moving its row would cancel the drag.
  let anchor = null;
  for (let index = rows.length - 1; index >= 0; index--) {
    const line = rowElements.get(rows[index]);
    if (line !== drag?.container && line.nextElementSibling !== anchor)
      rowsContainer.insertBefore(line, anchor);
    anchor = line;
  }
  for (const line of rowsContainer.children) {
    const previous = positions.get(line);
    line.getAnimations().forEach((animation) => animation.cancel());
    const delta = previous - line.getBoundingClientRect().top;
    if (delta && !reducedMotion.matches)
      line.animate([{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }], {
        duration: 220,
        easing: "cubic-bezier(.2,.8,.2,1)",
      });
  }
}
function beginRowDrag(event, row, container, handle) {
  if (event.button !== 0 || drag) return;
  event.preventDefault();
  const bounds = container.getBoundingClientRect();
  drag = {
    row,
    container,
    handle,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    x: event.clientX,
    y: event.clientY,
    offsetX: event.clientX - bounds.left,
    offsetY: event.clientY - bounds.top,
    height: bounds.height,
    width: bounds.width,
    original: [...rows],
    ghost: null,
    frame: null,
  };
  if (!event.deferCapture) handle.setPointerCapture(event.pointerId);
}
function updateSingleRowDrag() {
  if (!drag || !drag.ghost) return;
  const top = drag.y - drag.offsetY;
  drag.ghost.style.transform = `translate(${drag.x - drag.offsetX - 10}px,${top - 8}px)`;
  const bottom = top + drag.height,
    parentTop = rowsContainer.getBoundingClientRect().top;
  const source = rows.indexOf(drag.row);
  let destination = source;
  const threshold = 0.65;
  if (source + 1 < rows.length) {
    const below = rowElements.get(rows[source + 1]);
    if (bottom > parentTop + below.offsetTop + below.offsetHeight * threshold) {
      while (destination + 1 < rows.length) {
        const line = rowElements.get(rows[destination + 1]);
        if (bottom <= parentTop + line.offsetTop + line.offsetHeight * threshold) break;
        destination++;
      }
    }
  }
  if (destination === source && source > 0) {
    const above = rowElements.get(rows[source - 1]);
    if (top < parentTop + above.offsetTop + above.offsetHeight * (1 - threshold)) {
      while (destination > 0) {
        const line = rowElements.get(rows[destination - 1]);
        if (top >= parentTop + line.offsetTop + line.offsetHeight * (1 - threshold)) break;
        destination--;
      }
    }
  }
  if (source !== destination) {
    rows.splice(source, 1);
    rows.splice(destination, 0, drag.row);
    animateOrder();
    render();
  }
}
function dragFrame() {
  if (!drag || !drag.ghost) return;
  const margin = 65;
  const speed =
    drag.y < margin
      ? -Math.min(12, (margin - drag.y) / 5)
      : drag.y > window.innerHeight - margin
        ? Math.min(12, (drag.y - window.innerHeight + margin) / 5)
        : 0;
  if (speed) window.scrollBy(0, speed);
  updateDrag();
  drag.frame = requestAnimationFrame(dragFrame);
}
function moveDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  drag.x = event.clientX;
  drag.y = event.clientY;
  if (!drag.ghost && Math.hypot(drag.x - drag.startX, drag.y - drag.startY) < 4) return;
  event.preventDefault();
  if (!drag.ghost) {
    if (!drag.handle.hasPointerCapture(event.pointerId))
      drag.handle.setPointerCapture(event.pointerId);
    const ghost = drag.container.cloneNode(true);
    ghost.classList.add("drag-ghost");
    ghost.setAttribute("aria-hidden", "true");
    ghost
      .querySelectorAll("input")
      .forEach(
        (field, index) => (field.value = drag.container.querySelectorAll("input")[index].value),
      );
    ghost.style.left = "0";
    ghost.style.top = "0";
    ghost.style.width = `${drag.width + 20}px`;
    document.querySelector("#lp-hybrid").append(ghost);
    drag.ghost = ghost;
    drag.container.classList.add("drag-placeholder");
    document.body.classList.add("is-dragging");
    updateDrag();
    ghost.getBoundingClientRect();
    ghost.classList.add("lifted");
    drag.frame = requestAnimationFrame(dragFrame);
  }
  updateDrag();
}
function endRowDrag(event, cancel = false) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const finished = drag;
  drag = null;
  cancelAnimationFrame(finished.frame);
  if (cancel) rows = finished.original;
  if (finished.handle.hasPointerCapture(finished.pointerId))
    finished.handle.releasePointerCapture(finished.pointerId);
  document.body.classList.remove("is-dragging");
  finished.container.classList.remove("drag-placeholder");
  if (cancel) animateOrder();
  if (finished.ghost) {
    const bounds = finished.container.getBoundingClientRect();
    const ghost = finished.ghost;
    ghost.style.transition = reducedMotion.matches
      ? "none"
      : "transform .16s ease,scale .16s ease,opacity .16s ease";
    ghost.style.transform = `translate(${bounds.left - 10}px,${bounds.top - 8}px)`;
    ghost.classList.remove("lifted");
    setTimeout(() => ghost.remove(), reducedMotion.matches ? 0 : 170);
  }
  drawRows();
  render();
}
const spacing = new WeakMap();
function automaticSpace(row, field, event) {
  let state = spacing.get(row);
  if (!state) {
    state = { timer: null, generated: false };
    spacing.set(row, state);
  }
  state.field = field;
  clearTimeout(state.timer);
  if (event.isComposing) {
    row.text = field.value;
    render();
    return;
  }
  const deleting = event.inputType && event.inputType.startsWith("delete");
  if (deleting || !field.value.endsWith(" ") || (event.data && /\s$/.test(event.data)))
    state.generated = false;
  if (
    !deleting &&
    field.value &&
    field.selectionStart === field.value.length &&
    field.selectionEnd === field.value.length &&
    !/\s$/.test(field.value)
  ) {
    field.setRangeText(" ", field.value.length, field.value.length, "end");
    state.generated = true;
  }
  row.text = field.value;
  render();
  if (state.generated) {
    state.timer = setTimeout(() => {
      if (!state.generated || !row.text.endsWith(" ")) return;
      const currentField = state.field;
      const start = currentField.selectionStart,
        end = currentField.selectionEnd;
      row.text = row.text.slice(0, -1);
      currentField.value = row.text;
      currentField.setSelectionRange(
        Math.min(start, currentField.value.length),
        Math.min(end, currentField.value.length),
      );
      state.generated = false;
      render();
    }, 5000);
  }
}
