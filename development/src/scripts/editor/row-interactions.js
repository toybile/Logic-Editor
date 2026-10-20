(() => {
  const selected = new Set(),
    histories = new Map(),
    redoHistories = new Map();
  let selectionMode = false,
    suppressClickUntil = 0;
  const add = document.querySelector("#add-line"),
    tools = document.createElement("div"),
    undo = document.createElement("button"),
    bulk = document.createElement("button");
  const redo = document.createElement("button"),
    undoSplit = document.createElement("div");
  undoSplit.className = "hy-line-split hy-history-split";
  redo.type = "button";
  redo.className = "hy-button hy-redo-lines";
  redo.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4v6h-6M20 10a8 8 0 1 0 0 8"/></svg>';
  redo.setAttribute("aria-label", "Refazer alteração nas linhas");
  redo.title = "Refazer";
  tools.className = "hy-line-controls";
  add.before(tools);
  tools.append(add, bulk, undoSplit);
  undoSplit.append(undo, redo);
  add.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  add.setAttribute("aria-label", "Adicionar linha");
  undo.type = bulk.type = "button";
  undo.className = "hy-button hy-undo-lines";
  undo.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v6h6M4 10a8 8 0 1 1 0 8"/></svg>';
  undo.setAttribute("aria-label", "Desfazer alteração nas linhas");
  undo.title = "Desfazer";
  bulk.className = "hy-button hy-bulk-delete";
  bulk.textContent = "Excluir selecionadas";
  function history() {
    const id = argumentWorkspace.activeId;
    if (!histories.has(id)) histories.set(id, []);
    return histories.get(id);
  }
  function redoHistory() {
    const id = argumentWorkspace.activeId;
    if (!redoHistories.has(id)) redoHistories.set(id, []);
    return redoHistories.get(id);
  }
  function remember() {
    redoHistory().length = 0;
    history().push(rows.map((r) => ({ ...r })));
    if (history().length > 30) history().shift();
    updateControls();
  }
  root.addEventListener("lp-record-line-change", remember);
  function updateControls() {
    for (const r of selected) if (!rows.includes(r)) selected.delete(r);
    selectionMode = selected.size > 0;
    add.disabled = selectionMode;
    root.dataset.selectLines = String(selectionMode);
    undo.disabled = !history().length;
    redo.disabled = !redoHistory().length;
    bulk.hidden = !selected.size;
    bulk.textContent =
      (ui.language === "en" ? "Delete selected" : "Excluir selecionadas") +
      " (" +
      selected.size +
      ")";
    for (const r of rows) {
      const line = rowElements.get(r);
      line?.classList.toggle("hy-line-selected", selected.has(r));
      const checkbox = line?.querySelector(".hy-line-select");
      if (checkbox) checkbox.checked = selected.has(r);
    }
  }
  function selectRow(row, toggle = false) {
    if (toggle && selected.has(row)) selected.delete(row);
    else selected.add(row);
    updateControls();
  }
  rowController.build = function (row, index) {
    const built = createRowElement(row, index),
      line = built.container,
      checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "hy-line-select";
    checkbox.setAttribute("aria-label", "Selecionar linha " + (index + 1));
    checkbox.checked = selected.has(row);
    const highlight = document.createElement("span");
    highlight.className = "hy-selection-highlight";
    highlight.setAttribute("aria-hidden", "true");
    line.prepend(checkbox, highlight);
    checkbox.onchange = () => {
      selectRow(row, true);
    };
    line.addEventListener(
      "click",
      (event) => {
        if (Date.now() < suppressClickUntil) {
          event.stopImmediatePropagation();
          return;
        }
        if (event.target === checkbox || event.target.closest(".hy-delete-line")) return;
        if (selectionMode) {
          event.preventDefault();
          event.stopImmediatePropagation();
          selectRow(row, true);
        } else if (selected.size && !selected.has(row)) {
          selected.clear();
          updateControls();
        }
      },
      true,
    );

    let holdTimer = null,
      heldPointer = null,
      holdActivated = false;
    function cancelLineHold() {
      clearTimeout(holdTimer);
      holdTimer = null;
      heldPointer = null;
    }
    line.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target === checkbox || event.target.closest(".hy-role"))
        return;
      if (event.target.closest(".hy-row-move-handle")) return;
      const field = event.target.closest('.hy-block,.hy-continuous-field'),
        continuous = Boolean(event.target.closest('.hy-continuous-field'));
      if (event.target.closest("button") && !event.target.closest(".hy-delete-line")) return;
      if (selected.size && !selected.has(row) && !selectionMode) {
        selected.clear();
        updateControls();
      }
      cancelLineHold();
      holdActivated = false;
      heldPointer = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        deleteButton: event.target.closest(".hy-delete-line"),
      };
      if ((event.pointerType !== "touch" || continuous) && line.isConnected && !drag && (!selectionMode || selected.has(row))) {
        const pointer = heldPointer;
        startDrag(
          {
            button: 0,
            pointerId: pointer.pointerId,
            clientX: pointer.x,
            clientY: pointer.y,
            preventDefault() {},
            deferCapture: Boolean(field),
          },
          row,
          line,
          line,
        );
        if (drag) drag.continuousField = continuous;
      }
      if (!drag && !field) line.setPointerCapture(event.pointerId);
      holdTimer = setTimeout(() => {
        holdTimer = null;
        if (!heldPointer || !line.isConnected || !rows.includes(row) || drag?.ghost) return;
        holdActivated = true;
        const id = heldPointer.pointerId;
        if (heldPointer.deleteButton && drag?.handle === line) {
          cancelAnimationFrame(drag.frame);
          drag = null;
        }
        if (heldPointer.deleteButton) {
          suppressClickUntil = Date.now() + 500;
          if (line.hasPointerCapture(id)) line.releasePointerCapture(id);
          requestDeleteAll();
          return;
        }
        selectRow(row);
        if (!drag) {
          startDrag({button: 0, pointerId: id, clientX: heldPointer.x,
            clientY: heldPointer.y, preventDefault() {}, deferCapture: true}, row, line, line);
        }
        if (drag) {
          drag.members = rows.filter(item => selected.has(item));
          drag.continuousField = continuous;
        }
        suppressClickUntil = Date.now() + 350;
      }, getHoldDelay());
    });
    line.addEventListener("pointermove", (event) => {
      if (
        heldPointer &&
        holdTimer &&
        Math.hypot(event.clientX - heldPointer.x, event.clientY - heldPointer.y) > 4
      )
        cancelLineHold();
      if (drag?.handle === line) {
        if (drag.continuousField && !drag.ghost) {
          const dx = Math.abs(event.clientX - drag.startX),
            dy = Math.abs(event.clientY - drag.startY);
          // Horizontal movement keeps native text selection; vertical movement reorders.
          if (Math.max(dx, dy) < 6) return;
          if (dx > dy) { drag = null; return; }
        }
        moveDrag(event);
        if (drag.ghost) suppressClickUntil = Date.now() + 350;
      }
    });
    line.addEventListener("pointerup", (event) => {
      const deleteButton = !holdActivated && !drag?.ghost ? heldPointer?.deleteButton : null;
      if (holdActivated) {
        suppressClickUntil = Date.now() + 350;
        holdActivated = false;
      }
      cancelLineHold();
      if (drag?.handle === line) {
        if (drag.ghost) finishDrag(event);
        else {
          const id = drag.pointerId;
          drag = null;
          if (line.hasPointerCapture(id)) line.releasePointerCapture(id);
        }
      }
      if (deleteButton) {
        deleteButton.click();
        suppressClickUntil = Date.now() + 350;
      }
    });
    line.addEventListener("pointercancel", (event) => {
      cancelLineHold();
      if (drag?.handle === line) finishDrag(event, true);
    });
    line.addEventListener("lostpointercapture", (event) => {
      if (event.target !== line) return;
      cancelLineHold();
      if (drag?.handle === line) finishDrag(event, true);
    });
    line.addEventListener('keydown', event => {
      if (event.target.closest('.hy-row-move-handle') && [' ', 'Enter'].includes(event.key)) {
        event.preventDefault();
        if (!event.repeat) selectRow(row, true);
      }
    });
    return built;
  };
  rowController.add = function (index = rows.length) {
    if (selectionMode) return;
    remember();
    insertRow(index);
    updateControls();
  };
  rowController.remove = function (row) {
    const victims = selected.has(row) ? rows.filter((r) => selected.has(r)) : [row];
    deleteRows(victims);
  };
  async function requestDeleteAll() {
    if (root.querySelector("[data-delete-all]")) return;
    const argumentId = argumentWorkspace.activeId,
      targets = [...rows],
      priorSelection = [...selected],
      priorMode = selectionMode;
    selectionMode = true;
    selected.clear();
    targets.forEach((row) => selected.add(row));
    updateControls();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const en = ui.language === "en",
      dialog = document.createElement("dialog");
    dialog.className = "hy-feature-dialog hy-delete-all-dialog";
    dialog.setAttribute("data-delete-all", "");
    dialog.setAttribute("aria-labelledby", "delete-all-title");
    dialog.setAttribute("aria-describedby", "delete-all-message");
    const title = document.createElement("h3");
    title.id = "delete-all-title";
    title.textContent = en
      ? "Delete all premises and conclusions?"
      : "Excluir todas as premissas e conclusões?";
    const message = document.createElement("p");
    message.id = "delete-all-message";
    message.textContent = en
      ? "All " +
        targets.length +
        " highlighted rows in this argument will be deleted. You can undo this action."
      : "Todas as " +
        targets.length +
        " linhas destacadas deste argumento serão excluídas. Você pode desfazer esta ação.";
    const actions = document.createElement("div");
    actions.className = "hy-rename-actions";
    const cancel = document.createElement("button"),
      confirm = document.createElement("button");
    cancel.type = confirm.type = "button";
    cancel.className = "hy-button";
    confirm.className = "hy-button hy-delete-confirm";
    cancel.textContent = en ? "Cancel" : "Cancelar";
    confirm.textContent = en ? "Delete all" : "Excluir todas";
    actions.append(cancel, confirm);
    dialog.append(title, message, actions);
    root.append(dialog);
    const accepted = await new Promise((resolve) => {
      let result = false;
      confirm.onclick = () => {
        result = true;
        dialog.close();
      };
      cancel.onclick = () => dialog.close();
      dialog.onclose = () => {
        dialog.remove();
        resolve(result);
      };
      dialog.showModal();
      cancel.focus();
    });
    suppressClickUntil = Date.now() + 350;
    if (argumentWorkspace.activeId !== argumentId) return;
    selected.clear();
    if (accepted) {
      remember();
      for (const row of targets) {
        const state = spacing.get(row);
        if (state) clearTimeout(state.timer);
      }
      rows = [{ text: "", role: "premise" }];
      selectionMode = false;
      drawRows();
      render();
    } else {
      selectionMode = priorMode;
      priorSelection.filter((row) => rows.includes(row)).forEach((row) => selected.add(row));
    }
    updateControls();
  }
  async function deleteRows(victims) {
    if (!victims.length) return;
    const english = ui.language === "en";
    if (
      victims.some((r) => r.text.trim()) &&
      !(await confirmDeletion(
        english
          ? "Delete " + victims.length + " row(s)? Their text will be removed."
          : "Excluir " + victims.length + " linha(s)? O texto será apagado.",
      ))
    )
      return;
    remember();
    for (const r of victims) {
      const state = spacing.get(r);
      if (state) clearTimeout(state.timer);
      selected.delete(r);
    }
    rows = rows.filter((r) => !victims.includes(r));
    if (!rows.length) rows = [{ text: "", role: "premise" }];
    drawRows();
    render();
    updateControls();
  }
  rowController.start = function (event, row, container, handle) {
    if (!selected.has(row) && selected.size) {
      selected.clear();
      updateControls();
    }
    beginRowDrag(event, row, container, handle);
    if (drag) {
      drag.members = selected.has(row) ? rows.filter((r) => selected.has(r)) : [row];
      drag.undoSnapshot = rows.map((r) => ({ ...r }));
    }
  };
  rowController.update = function () {
    if (!drag || drag.members?.length < 2) return updateSingleRowDrag();
    const members = drag.members,
      others = rows.filter((r) => !members.includes(r));
    const direction = drag.y - drag.startY;
    let index = 0;
    for (const r of others) {
      const element = rowElements.get(r),
        box = element.getBoundingClientRect();
      if (drag.y > box.top + box.height * (direction >= 0 ? 0.65 : 0.35)) index++;
    }
    const next = [...others.slice(0, index), ...members, ...others.slice(index)];
    if (next.some((r, i) => r !== rows[i])) {
      rows = next;
      animateOrder();
      render();
    }
    for (const r of members)
      if (r !== drag.row) rowElements.get(r)?.classList.add("hy-group-moving");
    if (drag.ghost) {
      drag.ghost.style.transform =
        "translate(" + (drag.x - drag.offsetX - 10) + "px," + (drag.y - drag.offsetY - 8) + "px)";
      drag.ghost.dataset.groupCount = members.length;
    }
  };
  rowController.finish = function (event, cancel = false) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const state = drag;
    if (state.ghost) {
      suppressClickUntil = Date.now() + 350;
      if (!cancel && rows.some((r, i) => r !== state.original[i])) {
        redoHistory().length = 0;
        history().push(state.undoSnapshot);
        if (history().length > 30) history().shift();
      }
    }
    const changed = !cancel && state.ghost && rows.some((r, i) => r !== state.original[i]),
      before = state.undoSnapshot,
      after = rows.map((r) => ({ ...r })),
      id = argumentWorkspace.activeId;
    endRowDrag(event, cancel);
    updateControls();
    if (changed) {
      const restore = (snapshot) => {
        if (argumentWorkspace.activeId !== id) showArgument(id);
        rows = snapshot.map((r) => ({ ...r }));
        selected.clear();
        drawRows();
        render();
        updateControls();
      };
      LPPositionHistory.push({
        undo: () => {
          if (argumentWorkspace.activeId !== id) showArgument(id);
          if (history().at(-1) === before) history().pop();
          redoHistory().push(after);
          restore(before);
        },
        redo: () => {
          if (argumentWorkspace.activeId !== id) showArgument(id);
          if (redoHistory().at(-1) === after) redoHistory().pop();
          history().push(before);
          restore(after);
        },
      });
      rowsContainer.tabIndex = -1;
      rowsContainer.focus({ preventScroll: true });
    }
  };
  bulk.onclick = () => deleteRows(rows.filter((r) => selected.has(r)));
  undo.onclick = () => {
    const snapshot = history().pop();
    if (!snapshot) return;
    redoHistory().push(rows.map((r) => ({ ...r })));
    selected.clear();
    rows = snapshot.map((r) => ({ ...r }));
    drawRows();
    render();
    updateControls();
  };
  redo.onclick = () => {
    const snapshot = redoHistory().pop();
    if (!snapshot) return;
    history().push(rows.map((r) => ({ ...r })));
    selected.clear();
    rows = snapshot.map((r) => ({ ...r }));
    drawRows();
    render();
    updateControls();
  };
  let lastEdit = null,
    lastEditTime = 0;
  rowsContainer.addEventListener("beforeinput", (event) => {
    if (event.defaultPrevented) return;
    if (!event.target.matches(".hy-block,.hy-continuous-field")) return;
    const now = Date.now();
    if (lastEdit !== event.target || now - lastEditTime > 700) remember();
    lastEdit = event.target;
    lastEditTime = now;
  });
  rowsContainer.addEventListener("input", (event) => {
    if (!event.target.matches(".hy-block,.hy-continuous-field")) return;
    redoHistory().length = 0;
    updateControls();
  });
  rowController.afterDraw = updateControls;
  drawRows();
  updateControls();
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".hy-row,.hy-line-controls,[data-delete-all],#delete-dialog")) return;
    if (selected.size) {
      selected.clear();
      updateControls();
    }
  });
})();
