  // A short tap arms the next hold; a solitary hold always toggles appearance.
  const HOLD_MS = 500, DOUBLE_TAP_MS = 420, MOVE_PX = 14, TAP_DISTANCE = 32;
  let active = null;
  let lastTap = null;
  let holdTimer = null;
  let hideTimer = null;
  let frame = null;
  function isBackground(target, x, y) {
    // Empty space inside a heading's layout box is background; its text is not.
    if (target instanceof Element && target.closest('header,.hub-section h2') && !document.querySelector('dialog[open]') && !target.closest('button,a,summary,input,textarea,select,[role="button"],[contenteditable="true"]')) {
      const container=target.closest('header,.hub-section h2'),walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()) {
        if(!walker.currentNode.nodeValue.trim())continue;
        const range=document.createRange();range.selectNodeContents(walker.currentNode);
        for(const rect of range.getClientRects())if(x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom)return false;
      }
      return true;
    }

    if (!(target instanceof Element) || document.querySelector("dialog[open]")) return false;
    if (target.closest('button, a, summary, input, textarea, select, dialog, [role="button"], [contenteditable="true"], .column, .hero h1, .hero p, .hub-tile, .hub-section h2, .extras-trigger')) return false;
    return target === document.body || target === root || Boolean(target.closest(".hero, .columns, .page, .hub-product"));
  }
  function hideFeedback() {
    // Leave label and progress untouched during the opacity transition.
    feedback.classList.remove("is-visible");
  }
  function clearTimers() {
    clearTimeout(holdTimer); clearTimeout(hideTimer);
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }
  function cancelGesture() { clearTimers(); active = null; lastTap = null; hideFeedback(); }
  function updateProgress(now) {
    if (!active || active.triggered) return;
    feedback.style.setProperty("--hold-progress", Math.min(100, (now - active.started) / HOLD_MS * 100) + "%");
    frame = requestAnimationFrame(updateProgress);
  }
  function startHold(event) {
    if (!event.isPrimary) { cancelGesture(); return; }
    if (event.button !== 0 || !isBackground(event.target,event.clientX,event.clientY)) { lastTap = null; return; }
    if (active) cancelGesture();
    clearTimers();
    const now = performance.now();
    const isSecond = lastTap && now - lastTap.at <= DOUBLE_TAP_MS && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) <= TAP_DISTANCE;
    active = { id: event.pointerId, x: event.clientX, y: event.clientY, started: now, action: isSecond ? "themes" : "mode", triggered: false };
    lastTap = null;
    feedback.dataset.action = active.action;
    feedback.classList.remove("is-complete");
    feedback.style.setProperty("--hold-x", Math.max(84, Math.min(innerWidth - 84, event.clientX)) + "px");
    feedback.style.setProperty("--hold-y", Math.max(80, Math.min(innerHeight - 8, event.clientY)) + "px");
    feedback.style.setProperty("--hold-progress", "0%");
    label.textContent = "";
    icon.innerHTML = isSecond ? icons.themes : (root.dataset.theme === "dark" ? icons.sun : icons.moon);
    feedback.classList.add("is-visible");
    frame = requestAnimationFrame(updateProgress);
    holdTimer = setTimeout(function () {
      if (!active) return;
      active.triggered = true;
      if (frame !== null) cancelAnimationFrame(frame);
      feedback.style.setProperty("--hold-progress", "100%");
      if (active.action === "themes") {
        hideFeedback();
        openThemes();
      } else {
        toggleMode();
        label.textContent = "";
        icon.innerHTML = root.dataset.theme === "dark" ? icons.moon : icons.sun;
        feedback.classList.add("is-complete");
        hideTimer = setTimeout(hideFeedback, 200);
      }
    }, HOLD_MS);
  }
  function moveHold(event) {
    if (!active || event.pointerId !== active.id || active.triggered) return;
    if (Math.hypot(event.clientX - active.x, event.clientY - active.y) > MOVE_PX) cancelGesture();
  }
  function finishHold(event) {
    if (!active || event.pointerId !== active.id) return;
    clearTimeout(holdTimer);
    if (frame !== null) cancelAnimationFrame(frame);
    if (!active.triggered) {
      lastTap = active.action === "mode" && performance.now() - active.started < 300
        ? { at: performance.now(), x: active.x, y: active.y } : null;
      hideFeedback();
    }
    active = null;
  }
  // Word selection starts on mousedown, before the later dblclick event.
  document.addEventListener("mousedown", function (event) {
    if (event.button === 0 && event.detail > 1 && isBackground(event.target,event.clientX,event.clientY)) event.preventDefault();
  }, true);
  document.addEventListener("pointerdown", startHold, { passive: true });
  document.addEventListener("pointermove", moveHold, { passive: true });
  document.addEventListener("pointerup", finishHold, { passive: true });
  document.addEventListener("pointercancel", cancelGesture, { passive: true });
  window.addEventListener("blur", cancelGesture);
  document.addEventListener("scroll", function () { if (active && !active.triggered) cancelGesture(); }, { passive: true, capture: true });
  document.addEventListener("contextmenu", function (event) { if (active) event.preventDefault(); });
  document.addEventListener("dblclick", function (event) { if (isBackground(event.target,event.clientX,event.clientY)) event.preventDefault(); });
  document.addEventListener("keydown", function (event) {
    if (event.altKey && event.key.toLowerCase() === "t" && !event.repeat) { event.preventDefault(); cancelGesture(); openThemes(); }
  });
