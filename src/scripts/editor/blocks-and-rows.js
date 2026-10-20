let capsLock = false;
try {
  const saved = localStorage.getItem("formal-caps-lock");
  if (saved !== null) capsLock = saved === "true";
  else localStorage.setItem("formal-caps-lock", "false");
} catch {}
const blockFields = new WeakMap();
function resizeContinuousFields() {
  document.querySelectorAll('.hy-continuous-field').forEach(field => {
    field.style.height = 'auto';
    field.style.height = Math.max(44, field.scrollHeight + 2) + 'px';
  });
}
function buildContinuousRow(row, body) {
  const field = document.createElement('textarea');
  field.className = 'hy-continuous-field';
  field.rows = 1;
  field.value = row.text;
  field.autocapitalize = 'off'; field.autocomplete = 'off'; field.spellcheck = false;
  field.setAttribute('autocorrect', 'off'); field.enterKeyHint = 'next';
  field.setAttribute('aria-label', ui.language === 'en' ? 'Formula — continuous writing' : 'Fórmula — escrita contínua');
  field.onfocus = () => { active = field; };
  field.oninput = event => {
    if (capsLock && !event?.isComposing) {
      const start = field.value.slice(0, field.selectionStart).toUpperCase().length,
        end = field.value.slice(0, field.selectionEnd).toUpperCase().length;
      field.value = field.value.toUpperCase(); field.setSelectionRange(start, end);
    }
    row.text = field.value;
    resizeContinuousFields(); render();
  };
  field.oncompositionend = () => field.oninput();
  function nextRow(event) { event.preventDefault(); addLine(rows.indexOf(row) + 1); }
  field.onbeforeinput = event => {
    if (!event.isComposing && ['insertParagraph','insertLineBreak'].includes(event.inputType)) nextRow(event);
  };
  field.onkeydown = event => {
    if (event.isComposing) return;
    if (event.key === 'Enter') nextRow(event);
  };
  blockFields.set(field, { insert(symbol) {
    let value = symbol;
    const before = field.value.slice(0, field.selectionStart), after = field.value.slice(field.selectionEnd);
    if (/^[∧∨→↔⇒⇔⊕⊻↑↓]$/u.test(symbol)) {
      if (before && !/\s$/u.test(before)) value = ' ' + value;
      if (!/^\s/u.test(after)) value += ' ';
    }
    field.setRangeText(value, field.selectionStart, field.selectionEnd, 'end');
    field.focus({ preventScroll:true }); field.oninput();
  }});
  body.replaceChildren(field);
  requestAnimationFrame(resizeContinuousFields);
  return { first: () => field, update() { field.value = row.text; requestAnimationFrame(resizeContinuousFields); } };
}
function buildBlocks(row, body) {
  const composer = document.createElement("div");
  composer.className = "hy-blocks";
  body.replaceChildren(composer);
  let tokens = row.text.match(/[\p{L}\p{N}_'′]+|[^\s]/gu) || [""],
    ghosts = new Set();
  function sync() {
    row.text = tokens.filter((value, index) => !ghosts.has(index) && value !== "").join(" ");
    render();
  }
  function spliceTokens(index, count, ...values) {
    const shift = values.length - count;
    ghosts = new Set(
      [...ghosts]
        .filter((i) => i < index || i >= index + count)
        .map((i) => (i >= index + count ? i + shift : i)),
    );
    tokens.splice(index, count, ...values);
  }
  function previous(index) {
    for (let i = index - 1; i >= 0; i--) if (!ghosts.has(i)) return i;
    return -1;
  }
  function next(index) {
    for (let i = index + 1; i < tokens.length; i++) if (!ghosts.has(i)) return i;
    return -1;
  }
  function resize(input) {
    if (!input.isConnected) {
      requestAnimationFrame(() => {
        if (input.isConnected) resize(input);
      });
      return;
    }
    const style = getComputedStyle(input),
      measure = document.createElement("span");
    measure.style.cssText =
      "position:absolute;visibility:hidden;white-space:pre;font:" + style.font;
    measure.textContent = input.value || "M";
    composer.append(measure);
    const extra =
      parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight) +
      parseFloat(style.borderLeftWidth) +
      parseFloat(style.borderRightWidth) +
      4;
    input.style.width =
      Math.max(
        parseFloat(style.minWidth) || 36,
        Math.ceil(measure.getBoundingClientRect().width + extra),
      ) + "px";
    measure.remove();
  }
  function focus(index) {
    const input = composer.querySelectorAll(".hy-block")[index];
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
  function pruneGhosts() {
    if (!ghosts.size) return;
    tokens = tokens.filter((_, index) => !ghosts.has(index));
    ghosts.clear();
    if (!tokens.length) tokens = [""];
    draw();
  }
  body.addEventListener("focusout", () =>
    setTimeout(() => {
      const line = body.closest(".hy-row");
      if (!line?.contains(document.activeElement)) pruneGhosts();
    }, 0),
  );
  body.addEventListener("pointerleave", () => {
    const line = body.closest(".hy-row");
    if (!line?.contains(document.activeElement)) pruneGhosts();
  });
  function draw(focusIndex) {
    composer.replaceChildren();
    tokens.forEach((text, index) => {
      const input = document.createElement("input");
      input.type = "text";
      input.autocapitalize = "off";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.setAttribute("autocorrect", "off");
      input.enterKeyHint = "next";
      input.className = "hy-block";
      input.placeholder = " ";
      input.value = text;
      input.readOnly = false;
      const wasGhost = ghosts.has(index);
      if (wasGhost) {
        input.classList.add("hy-block-ghost");
        input.tabIndex = -1;
      }
      input.setAttribute(
        "aria-label",
        wasGhost
          ? ui.language === "en"
            ? "Deleted block. Click to restore."
            : "Bloco removido. Clique para restaurar."
          : ui.language === "en"
            ? "Proposition or connective"
            : "Proposição ou conectivo",
      );
      input.title = ui.language === "en" ? "Space: next block" : "Espaço: próximo bloco";
      input.autocomplete = "off";
      input.spellcheck = false;
      blockFields.set(input, {
        insert(symbol) {
          let target;
          if (tokens[index].trim()) {
            spliceTokens(index + 1, 0, symbol);
            target = index + 2;
          } else {
            tokens[index] = symbol;
            ghosts.delete(index);
            target = index + 1;
          }
          if (target === tokens.length || tokens[target].trim()) spliceTokens(target, 0, "");
          draw(target);
          sync();
        },
      });
      input.onfocus = () => {
        active = input;
        if (ghosts.delete(index)) {
          input.classList.remove("hy-block-ghost");
          input.removeAttribute("tabindex");
          input.setAttribute(
            "aria-label",
            ui.language === "en" ? "Proposition or connective" : "Proposição ou conectivo",
          );
        }
      };
      input.oninput = (event) => {
        if (capsLock && !event?.isComposing) {
          const start = input.selectionStart,
            end = input.selectionEnd;
          const a = input.value.slice(0, start).toUpperCase().length,
            b = input.value.slice(0, end).toUpperCase().length;
          input.value = input.value.toUpperCase();
          input.setSelectionRange(a, b);
        }
        ghosts.delete(index);
        input.classList.remove("hy-block-ghost");
        tokens[index] = input.value;
        resize(input);
        sync();
      };
      input.oncompositionend = () => input.oninput();
      // Software keyboards may emit beforeinput without a useful keydown key.
      input.onbeforeinput = (event) => {
        if (event.isComposing) return;
        const key = event.inputType === "insertText" && event.data === " " ? " "
          : ["insertParagraph", "insertLineBreak"].includes(event.inputType) ? "Enter"
          : event.inputType === "deleteContentBackward" && !input.value ? "Backspace"
          : event.inputType === "deleteContentForward" && !input.value ? "Delete" : null;
        if (key) input.onkeydown({ key, preventDefault: () => event.preventDefault() });
      };
      input.onkeydown = (event) => {
        if (event.isComposing) return;
        if (
          (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
          !event.shiftKey &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          input.selectionStart === input.selectionEnd
        ) {
          const left = event.key === "ArrowLeft",
            atEdge = left ? input.selectionStart === 0 : input.selectionEnd === input.value.length;
          if (atEdge) {
            const target = left ? previous(index) : next(index),
              neighbor = composer.querySelectorAll(".hy-block")[target];
            if (target >= 0 && neighbor) {
              event.preventDefault();
              neighbor.focus();
              const caret = left ? neighbor.value.length : 0;
              neighbor.setSelectionRange(caret, caret);
            }
          }
          return;
        }
        if (event.key === "Tab" && !event.ctrlKey && !event.altKey) {
          const adjacent = rows.indexOf(row) + (event.shiftKey ? -1 : 1),
            target = rowElements.get(rows[adjacent]),
            fields = target?.querySelectorAll(".hy-block:not(.hy-block-ghost)"),
            last = fields?.[fields.length - 1];
          if (last) {
            event.preventDefault();
            active = last;
            last.focus();
            last.setSelectionRange(last.value.length, last.value.length);
          }
          return;
        }
        if (event.key === " ") {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          event.preventDefault();
          if (event.shiftKey) {
            spliceTokens(index + 1, 0, "");
            draw(index + 1);
            sync();
            return;
          }
          if (!tokens[index].trim()) return;
          let target = next(index);
          if (target < 0) {
            spliceTokens(tokens.length, 0, "");
            target = tokens.length - 1;
          }
          draw(target);
          sync();
        } else if ((event.key === "Backspace" || event.key === "Delete") && !input.value) {
          event.preventDefault();
          if (tokens.length - ghosts.size <= 1) return;
          const before = previous(index),
            after = next(index);
          spliceTokens(index, 1);
          const target = event.key === 'Delete'
            ? (after >= 0 ? after - 1 : Math.max(0, before))
            : (before >= 0 ? before : Math.max(0, after - 1));
          draw(target);
          sync();
        } else if (event.key === "Enter") {
          event.preventDefault();
          addLine(rows.indexOf(row) + 1);
        }
      };
      composer.append(input);
      resize(input);
    });
    if (focusIndex !== undefined) focus(focusIndex);
  }
  draw();
  return {
    first: () => composer.querySelector(".hy-block:not(.hy-block-ghost)"),
    update() {
      draw();
    },
  };
}

function createRowElement(row, index) {
  const container = document.createElement("div");
  container.className = "hy-row";
  rowElements.set(row, container);
  const field = document.createElement("input");
  field.type = "text";
  field.value = row.text;
  field.setAttribute("aria-label", `Expressão da linha ${index + 1}`);
  const existingSpacing = spacing.get(row);
  if (existingSpacing) existingSpacing.field = field;
  const shell = document.createElement("div");
  shell.className = "hy-line-shell";
  const body = document.createElement("div");
  body.className = "hy-line-body";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "hy-button hy-role";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "hy-button hy-icon-button hy-delete-line";
  remove.setAttribute("aria-label", "Excluir linha");
  remove.title = "Excluir linha";
  remove.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></svg>';
  remove.onclick = () => deleteLine(row);
  const blocks = ui.writingMode === 'continuous' ? buildContinuousRow(row, body) : buildBlocks(row, body);
  shell.append(toggle, body);
  function updateRole() {
    const isConclusion = row.role === "conclusion",
      blank = row.role === "blank";
    toggle.replaceChildren();
    field.readOnly = blank;
    field.value = blank ? "" : row.text;
    container.classList.toggle("hy-blank-line", blank);
    blocks.update();
    toggle.title = blank
      ? "Clique para voltar a premissa"
      : "Segure por 0,3 segundo para criar uma linha vazia";
    if (!blank) {
      const symbol = document.createElement("span");
      symbol.className = "hy-role-symbol";
      symbol.textContent = isConclusion ? "∴" : "∵";
      symbol.setAttribute("aria-hidden", "true");
      toggle.append(symbol);
      const label = document.createElement("span");
      label.className = "hy-role-name";
      label.textContent = isConclusion ? "Conclusão" : "Premissa";
      toggle.append(label);
      toggle.title =
        (ui.language === "en"
          ? isConclusion
            ? "Conclusion"
            : "Premise"
          : isConclusion
            ? "Conclusão"
            : "Premissa") +
        (ui.language === "en"
          ? " — click to switch; double-click changes display. ∵ is an interface marker for premises, not a formula or validation operator. Hold for a blank line"
          : " — clique para alternar; duplo clique muda a exibição. ∵ identifica premissas nesta interface, não integra a fórmula nem a validação. Segure para uma linha vazia");
    }
    toggle.setAttribute("aria-pressed", String(isConclusion));
    toggle.setAttribute(
      "aria-label",
      blank
        ? "Linha vazia. Clique para voltar a premissa"
        : `Linha ${index + 1}: ${isConclusion ? "conclusão" : "premissa"}. Alternar tipo`,
    );
  }
  field.addEventListener("focus", () => (active = field));
  field.addEventListener("input", (event) => automaticSpace(row, field, event));
  field.addEventListener("compositionend", () =>
    automaticSpace(row, field, { inputType: "insertText" }),
  );
  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addLine(index + 1);
    }
  });
  let holdTimer = null,
    roleHeld = false;
  function cancelRoleHold() {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  function startRoleHold() {
    cancelRoleHold();
    roleHeld = false;
    holdTimer = setTimeout(() => {
      if (!toggle.isConnected || !rows.includes(row)) return;
      const state = spacing.get(row);
      if (state) {
        clearTimeout(state.timer);
        if (state.generated && row.text.endsWith(" ")) row.text = row.text.slice(0, -1);
        state.generated = false;
      }
      if (row.role !== "blank") root.dispatchEvent(new Event("lp-record-line-change"));
      row.role = "blank";
      roleHeld = true;
      updateRole();
      render();
    }, getHoldDelay());
  }
  let dragOriginalRole = null;
  toggle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    dragOriginalRole = row.role;
    startRoleHold();
    startDrag(event, row, container, toggle);
  });
  toggle.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) >= 4) {
      cancelRoleHold();
      roleHeld = true;
      if (row.role !== dragOriginalRole) {
        row.role = dragOriginalRole;
        updateRole();
      }
    }
    moveDrag(event);
  });
  function endRoleDrag(event, cancel = false) {
    cancelRoleHold();
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.ghost) {
      roleHeld = true;
      finishDrag(event, cancel);
    } else {
      const state = drag;
      drag = null;
      if (toggle.hasPointerCapture(state.pointerId)) toggle.releasePointerCapture(state.pointerId);
    }
  }
  toggle.addEventListener("pointerup", (event) => endRoleDrag(event));
  toggle.addEventListener("pointercancel", (event) => endRoleDrag(event, true));
  toggle.addEventListener("lostpointercapture", (event) => endRoleDrag(event, true));
  for (const name of ["pointerup", "pointercancel", "pointerleave", "blur"])
    toggle.addEventListener(name, cancelRoleHold);
  toggle.addEventListener("keydown", (event) => {
    if (event.key === " " && !event.repeat) startRoleHold();
  });
  toggle.addEventListener("keyup", (event) => {
    if (event.key === " ") cancelRoleHold();
  });
  toggle.addEventListener("contextmenu", (event) => event.preventDefault());
  toggle.onclick = () => {
    cancelRoleHold();
    if (roleHeld) {
      roleHeld = false;
      return;
    }
    root.dispatchEvent(new Event("lp-record-line-change"));
    row.role = row.role === "premise" ? "conclusion" : "premise";
    updateRole();
    render();
  };
  toggle.ondblclick = (event) => {
    event.preventDefault();
    const modes = ["names", "both", "symbols"];
    ui.roleDisplay = modes[(modes.indexOf(ui.roleDisplay || "names") + 1) % 3];
    root.dataset.roleDisplay = ui.roleDisplay;
    saveUI();
  };
  updateRole();
  const handle = document.createElement("span");
  handle.className = "hy-grip hy-row-move-handle";
  handle.tabIndex = 0;
  handle.title = "Arraste para mover a linha";
  handle.setAttribute(
    "aria-label",
    `Mover linha ${index + 1}. Arraste ou use as setas do teclado. Espaço ou Enter seleciona a linha.`,
  );
  handle.setAttribute("role", "button");
  handle.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  handle.addEventListener("pointerdown", (event) => startDrag(event, row, container, handle));
  handle.addEventListener("pointermove", moveDrag);
  handle.addEventListener("pointerup", (event) => finishDrag(event));
  handle.addEventListener("pointercancel", (event) => finishDrag(event, true));
  handle.addEventListener("lostpointercapture", (event) => finishDrag(event, true));
  handle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      moveLine(rows.indexOf(row), event.key === "ArrowUp" ? -1 : 1);
    }
  });
  container.addEventListener("click", (event) => {
    if (event.target.closest("button,input,textarea") || drag) return;
    const inputs = body.querySelectorAll(".hy-block,.hy-continuous-field");
    const last = inputs[inputs.length - 1];
    if (last) {
      active = last;
      last.focus();
      last.setSelectionRange(last.value.length, last.value.length);
    }
  });
  container.append(remove, handle, shell);
  return { container, field: blocks.first() };
}
function drawRows(focusIndex) {
  rowsContainer.replaceChildren();
  rows.forEach((row, index) => {
    const built = buildRow(row, index);
    rowsContainer.append(built.container);
    if (index === 0) active = built.field;
    if (index === focusIndex) {
      active = built.field;
      built.field.focus();
    }
  });
  rowController.afterDraw?.();
}
function insertRow(index = rows.length) {
  rows.splice(index, 0, { text: "", role: "premise" });
  drawRows(index);
  render();
}

function moveLine(index, direction) {
  const destination = index + direction;
  if (destination < 0 || destination >= rows.length) return;
  const [row] = rows.splice(index, 1);
  rows.splice(destination, 0, row);
  drawRows(destination);
  render();
}
document.querySelector("#lp-hybrid").addEventListener("lp-insert-premise-line", (e) => {
  addLine(Math.max(0, Math.min(rows.length, e.detail.index)));
});
document.querySelector("#add-line").onclick = () => addLine();
