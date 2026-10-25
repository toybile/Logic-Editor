(() => {
  const editor = root.querySelector(".hy-editor"),
    argumentPanel = root.querySelector(".hy-argument-panel"),
    logic = root.querySelector(".hy-logic-area");
  const board = document.createElement("div");
  board.className = "hy-panel-board";
  editor.before(board);
  const frames = [editor, argumentPanel].map((panel, index) => {
    const frame = document.createElement("div");
    frame.className = "hy-panel-frame";
    frame.dataset.panel = String(index);
    board.append(frame);
    frame.append(panel);
    if (index && logic) frame.append(logic);
    return frame;
  });
  let manual = false,
    gesture = null,
    pending = null,
    saveTimer = null,
    anchors = null,
    separation = [];
  const compactLayout = () => matchMedia("(max-width:900px), (pointer:coarse) and (max-width:1100px)").matches;
  function panelBounds(frame) {
    const style = getComputedStyle(frame),
      top = number(frame.style.top) + number(style.paddingTop);
    return {
      top,
      bottom: number(frame.style.top) + frame.offsetHeight - number(style.paddingBottom),
      left: number(frame.style.left),
      right: number(frame.style.left) + frame.offsetWidth,
    };
  }
  function captureSeparation() {
    separation = [];
    frames.forEach((upper, i) =>
      frames.forEach((lower, j) => {
        if (i === j) return;
        const a = panelBounds(upper),
          b = panelBounds(lower),
          gap = b.top - a.bottom;
        if (gap >= -1) separation.push({ upper: i, lower: j, gap: Math.max(0, gap) });
      }),
    );
  }
  function keepSeparated() {
    for (const relation of separation) {
      const upper = frames[relation.upper],
        lower = frames[relation.lower],
        a = panelBounds(upper),
        b = panelBounds(lower);
      if (a.left < b.right && b.left < a.right) {
        const minimum = a.bottom + relation.gap - number(getComputedStyle(lower).paddingTop);
        const target = Math.max(0, minimum);
        if (Math.abs(number(lower.style.top) - target) > 0.1) lower.style.top = target + "px";
      }
    }
  }
  function layoutVisible() {
    return root.dataset.windowMaximized !== "true" && !root.hidden && board.getClientRects().length > 0 && board.clientWidth > 0;
  }
  function captureAnchors() {
    const width = board.clientWidth;
    if (!layoutVisible()) return;
    anchors = frames.map((frame) => ({
      widthRatio: frame.offsetWidth / width,
      position:
        width > frame.offsetWidth ? number(frame.style.left) / (width - frame.offsetWidth) : 0.5,
    }));
  }
  function applyAnchors() {
    if (!layoutVisible() || !anchors) return;
    const available = board.clientWidth;
    frames.forEach((frame, i) => {
      const anchor = anchors[i],
        width = Math.min(
          available,
          Math.max(minimumFrameWidth(frame), anchor.widthRatio * available),
        );
      frame.style.width = width + "px";
      frame.style.left = (available - width) * Math.max(0, Math.min(1, anchor.position)) + "px";
    });
  }
  const storageKey = "formal-panel-layout-v1",
    number = (value) => Number.parseFloat(value) || 0;
  function minimumFrameWidth(frame) {
    const panel = frame.querySelector(".hy-panel"),
      head = panel.querySelector(":scope > .hy-section-head"),
      tools = head.querySelector(".hy-tools");
    if (frame.dataset.panel === "0" || tools) {
      const children = [...head.children].filter(node => node.getClientRects().length),
        style = getComputedStyle(head),
        panelStyle = getComputedStyle(panel),
        frameStyle = getComputedStyle(frame);
      const width = children.reduce((sum, node) => {
        const s = getComputedStyle(node);
        const margins = node.computedStyleMap?.();
        return sum + Math.max(node.offsetWidth, node.scrollWidth)
          + (margins ? number(String(margins.get("margin-left"))) : (node === tools ? 0 : number(s.marginLeft)))
          + (margins ? number(String(margins.get("margin-right"))) : number(s.marginRight));
      }, 0) + number(style.columnGap) * Math.max(0, children.length - 1)
        + number(style.paddingLeft) + number(style.paddingRight)
        + number(panelStyle.paddingLeft) + number(panelStyle.paddingRight)
        + number(panelStyle.borderLeftWidth) + number(panelStyle.borderRightWidth)
        + number(frameStyle.paddingLeft) + number(frameStyle.paddingRight) + 4;
      frame.dataset.headerMinimum = String(Math.ceil(width));
    }
    return Math.min(board.clientWidth, number(frame.dataset.headerMinimum) || 280);
  }
  function fit() {
    if (!layoutVisible()) return;
    if (compactLayout()) return;
    const available = board.clientWidth;
    const argumentMinimum = minimumFrameWidth(frames[1]);
    const editorMinimum = minimumFrameWidth(frames[0]);
    if (!manual) {
      const columns = innerWidth >= 1440 && available >= argumentMinimum + editorMinimum + 12
        ? `minmax(${editorMinimum}px, 1.2fr) minmax(${argumentMinimum}px, 1fr)` : "minmax(0, 1fr)";
      if (board.style.gridTemplateColumns !== columns) board.style.gridTemplateColumns = columns;
    }
    for (const frame of frames) {
      const minimum = minimumFrameWidth(frame);
      frame.style.minWidth = minimum + "px";
      if (manual && number(frame.style.width) < minimum) frame.style.width = minimum + "px";
      if (number(frame.style.width) > available) frame.style.width = available + "px";
      if (manual)
        frame.style.left =
          Math.max(0, Math.min(number(frame.style.left), available - frame.offsetWidth)) + "px";
    }
    if (manual)
      board.style.minHeight =
        Math.max(360, ...frames.map((frame) => number(frame.style.top) + frame.offsetHeight + 28)) +
        "px";
  }
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (!layoutVisible() || compactLayout()) return;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            manual,
            anchors,
            separation,
            frames: frames.map((frame) => ({
              x: number(frame.style.left),
              y: number(frame.style.top),
              width: frame.style.width,
              height: frame.style.height,
            })),
          }),
        );
      } catch {}
    }, 160);
  }
  function expandBoard() {
    if (root.hidden || compactLayout()) return;
    if (!manual) {
      board.style.marginLeft = "";
      board.style.width = "";
      board.style.alignSelf = "";
      return;
    }
    board.style.alignSelf = "flex-start";
    board.style.marginLeft = "0px";
    board.style.width = Math.max(280, root.clientWidth - 16) + "px";
    const b = board.getBoundingClientRect(),
      r = root.getBoundingClientRect();
    board.style.marginLeft = r.left + 8 - b.left + "px";
  }
  function freeLayout() {
    if (manual) return;
    const positions = frames.map((frame) => frame.getBoundingClientRect());
    board.style.minHeight = board.offsetHeight + "px";
    manual = true;
    board.dataset.manual = "true";
    expandBoard();
    const bounds = board.getBoundingClientRect();
    frames.forEach((frame, index) => {
      frame.style.left = positions[index].left - bounds.left + "px";
      frame.style.top = positions[index].top - bounds.top + "px";
      frame.style.width = positions[index].width + "px";
    });
    captureAnchors();
    captureSeparation();
  }
  function layoutSnapshot() {
    return {
      manual,
      anchors: anchors ? anchors.map((a) => ({ ...a })) : null,
      frames: frames.map((f) => ({ left: f.style.left, top: f.style.top, width: f.style.width })),
    };
  }
  function restoreLayout(snapshot) {
    manual = snapshot.manual;
    anchors = snapshot.anchors ? snapshot.anchors.map((a) => ({ ...a })) : null;
    board.dataset.manual = String(manual);
    expandBoard();
    frames.forEach((f, i) => Object.assign(f.style, snapshot.frames[i]));
    if (manual) applyAnchors();
    else board.style.minHeight = "";
    fit();
    captureSeparation();
    save();
  }
  function recordLayout(before) {
    const after = layoutSnapshot();
    if (JSON.stringify(before) !== JSON.stringify(after))
      LPPositionHistory.push({
        undo: () => restoreLayout(before),
        redo: () => restoreLayout(after),
      });
  }
  function cancelPending() {
    if (pending) clearTimeout(pending.timer);
    pending = null;
  }
  function start(event, frame, edge = "") {
    if (root.dataset.windowMaximized === "true") return;
    if (compactLayout()) return;
    const before = layoutSnapshot();
    freeLayout();
    gesture = {
      before,
      frame,
      edge,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: number(frame.style.left),
      top: number(frame.style.top),
      width: frame.offsetWidth,
      height: frame.offsetHeight,
    };
    frame.setPointerCapture(event.pointerId);
    frame.classList.add("hy-panel-moving");
    if (!edge) board.classList.add("hy-show-center");
  }
  function move(event) {
    if (
      pending &&
      event.pointerId === pending.pointerId &&
      Math.hypot(event.clientX - pending.x, event.clientY - pending.y) > 6
    )
      cancelPending();
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    event.preventDefault();
    const state = gesture,
      frame = state.frame,
      dx = event.clientX - state.x,
      dy = event.clientY - state.y;
    let left = state.left,
      top = state.top,
      width = state.width,
      height = state.height;
    if (!state.edge) {
      const center = (board.clientWidth - frame.offsetWidth) / 2;
      left = Math.max(0, Math.min(left + dx, board.clientWidth - frame.offsetWidth));
      if (Math.abs(left - center) < 24) left = center;
      top = Math.max(0, top + dy);
    } else {
      const minWidth = minimumFrameWidth(frame);
      if (state.edge === "e")
        width = Math.max(minWidth, Math.min(state.width + dx, board.clientWidth - left));
      if (state.edge === "w") {
        left = Math.max(0, Math.min(state.left + dx, state.left + state.width - minWidth));
        width = state.left + state.width - left;
      }
      frame.style.width = width + "px";
    }
    frame.style.left = left + "px";
    frame.style.top = top + "px";
    fit();
  }
  function finish(event) {
    cancelPending();
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const state = gesture;
    gesture = null;
    if (state.frame.hasPointerCapture(state.pointerId))
      state.frame.releasePointerCapture(state.pointerId);
    state.frame.classList.remove("hy-panel-moving");
    board.classList.remove("hy-show-center");
    fit();
    captureAnchors();
    captureSeparation();
    save();
    recordLayout(state.before);
    state.frame.focus({ preventScroll: true });
  }
  frames.forEach((frame) => {
    frame.tabIndex = 0;
    frame.setAttribute("role", "group");
    frame.setAttribute(
      "aria-label",
      frame.dataset.panel === "0"
        ? "Editor panel. Arrow keys move; Shift + arrows resize."
        : "Argument panel. Arrow keys move; Shift + arrows resize.",
    );
    frame.addEventListener("keydown", (event) => {
      if (compactLayout()) return;
      if (
        event.target !== frame ||
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      const before = layoutSnapshot();
      freeLayout();
      const step = event.altKey ? 1 : 10;
      if (event.shiftKey) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight")
          frame.style.width =
            Math.max(
              minimumFrameWidth(frame),
              Math.min(
                board.clientWidth - number(frame.style.left),
                frame.offsetWidth + (event.key === "ArrowRight" ? step : -step),
              ),
            ) + "px";
      } else {
        frame.style.left =
          Math.max(
            0,
            Math.min(
              board.clientWidth - frame.offsetWidth,
              number(frame.style.left) +
                (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0),
            ),
          ) + "px";
        frame.style.top =
          Math.max(
            0,
            number(frame.style.top) +
              (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0),
          ) + "px";
      }
      fit();
      captureAnchors();
      captureSeparation();
      save();
      recordLayout(before);
    });
    for (const edge of ["e", "w"]) {
      const handle = document.createElement("div");
      handle.className = "hy-panel-edge hy-edge-" + edge;
      handle.dataset.resizeEdge = edge;
      handle.setAttribute("aria-hidden", "true");
      frame.append(handle);
    }
    frame.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || compactLayout()) return;
      const edge = event.target.dataset.resizeEdge;
      if (edge) {
        event.preventDefault();
        event.stopPropagation();
        start(event, frame, edge);
        return;
      }
      if (event.target.closest(".hy-row,button,input,label,a,summary,dialog,.hy-logic-panel,pre"))
        return;
      if (
        !event.target.matches(
          ".hy-panel-frame,.hy-editor,.hy-argument-panel,.hy-section-head,.hy-collapse,.hy-collapse-inner,.hy-rows,.hy-preview-wrap,.hy-preview-inner,.hy-logic-area,.hy-logic-footer,.hy-tools,.hy-export-group",
        )
      )
        return;
      cancelPending();
      const value = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY };
      pending = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        timer: setTimeout(() => {
          pending = null;
          if (frame.isConnected && !drag) start(value, frame);
        }, 50),
      };
    });
    frame.addEventListener("pointermove", move);
    frame.addEventListener("pointerup", finish);
    frame.addEventListener("pointercancel", finish);
    frame.addEventListener("lostpointercapture", finish);
  });
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved.manual === "boolean" && saved.frames?.length === 2) {
      manual = saved.manual;
      if (
        Array.isArray(saved.separation) &&
        saved.separation.every(
          (r) =>
            r &&
            [0, 1].includes(r.upper) &&
            [0, 1].includes(r.lower) &&
            r.upper !== r.lower &&
            Number.isFinite(r.gap) &&
            r.gap >= 0,
        )
      )
        separation = saved.separation;
      if (
        Array.isArray(saved.anchors) &&
        saved.anchors.length === 2 &&
        saved.anchors.every(
          (a) =>
            a && Number.isFinite(a.widthRatio) && a.widthRatio > 0 && Number.isFinite(a.position),
        )
      )
        anchors = saved.anchors;
      board.dataset.manual = String(manual);
      frames.forEach((frame, index) => {
        const value = saved.frames[index];
        if (Number.isFinite(value.x) && Number.isFinite(value.y)) {
          frame.style.left = Math.max(0, value.x) + "px";
          frame.style.top = Math.max(0, Math.min(5000, value.y)) + "px";
        }
        if (/^\d+(\.\d+)?px$/.test(value.width)) frame.style.width = value.width;
      });
      fit();
    }
  } catch {}
  expandBoard();
  window.addEventListener("resize", () => {
    expandBoard();
    fit();
  });
  if (manual) {
    if (!anchors) captureAnchors();
    applyAnchors();
    if (!separation.length) captureSeparation();
    keepSeparated();
  }
  root.addEventListener("lp-displace-window", (e) => {
    if (compactLayout()) return;
    const { element, dx, dy } = e.detail;
    if (!frames.includes(element)) return;
    freeLayout();
    element.style.left = number(element.style.left) + dx + "px";
    element.style.top = Math.max(0, number(element.style.top) + dy) + "px";
    fit();
    captureAnchors();
    captureSeparation();
    save();
  });
  root.addEventListener("lp-reset-panel-layout", () => {
    cancelPending();
    if (gesture) {
      const state = gesture;
      gesture = null;
      if (state.frame.hasPointerCapture(state.pointerId))
        state.frame.releasePointerCapture(state.pointerId);
      state.frame.classList.remove("hy-panel-moving");
    }
    manual = false;
    anchors = null;
    separation = [];
    board.dataset.manual = "false";
    expandBoard();
    board.classList.remove("hy-show-center");
    board.style.minHeight = "";
    frames.forEach((f) => {
      f.style.width = "";
      f.style.height = "";
      f.style.left = "";
      f.style.top = "";
    });
    fit();
    save();
  });
  let ready = false,
    lastWidth = board.clientWidth,
    lastGeometry = frames.map((f) => ({
      top: number(f.style.top),
      height: f.offsetHeight,
      left: number(f.style.left),
      width: f.offsetWidth,
    }));
  const observer = new ResizeObserver(() => {
    if (!layoutVisible() || compactLayout()) return;
    if (manual) expandBoard();
    const width = board.clientWidth;
    if (manual && ready && !gesture && width > 0 && Math.abs(width - lastWidth) > 0.1)
      applyAnchors();
    if (manual && ready && !gesture) keepSeparated();
    fit();
    lastWidth = width;
    lastGeometry = frames.map((f) => ({
      top: number(f.style.top),
      height: f.offsetHeight,
      left: number(f.style.left),
      width: f.offsetWidth,
    }));
    if (ready && !gesture) save();
  });
  frames.forEach((frame) => observer.observe(frame));
  observer.observe(board);
  observer.observe(board.parentElement);
  observer.observe(argumentPanel.querySelector(":scope > .hy-section-head"));
  observer.observe(argumentPanel.querySelector(".hy-tools"));
  const headerObserver = new MutationObserver(() => requestAnimationFrame(fit));
  for (const panel of [editor, argumentPanel]) headerObserver.observe(panel.querySelector(":scope > .hy-section-head"), {
    childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"],
  });
  requestAnimationFrame(() => {
    ready = true;
    expandBoard();
    fit();
  });
})();
