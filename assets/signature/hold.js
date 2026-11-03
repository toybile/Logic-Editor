/* Extracted from toybile/toybile.github.io, commit 4a82ca7.
 * Timing, cancellation, progress and dispatch code are copied unchanged.
 * The only added hook delegates the background selector to each site. */
(()=>{'use strict';
window.ToybileHold={install(options){
const root=options.root||document.documentElement,feedback=options.feedback,label=feedback.querySelector('.theme-hold-label'),icon=feedback.querySelector('.hold-icon');
const icons={
sun:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>',
moon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>',
mode:'<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.8-.1-1.6-.3-2.3A7 7 0 0 1 12 3Z"/></svg>',
themes:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 3-.7 2.2-2 .9-2.1-.5-2 3.4 1.5 1.7v2.6L2.7 15l2 3.4 2.1-.5 2 .9.7 2.2h4.9l.7-2.2 2-.9 2.1.5 2-3.4-1.5-1.7v-2.6L21.2 9l-2-3.4-2.1.5-2-.9L14.4 3Z"/><circle cx="12" cy="12" r="3"/></svg>',
check:'<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>'
};
const openThemes=options.openSettings,toggleMode=options.toggleMode;
  // A short tap arms the next hold; a solitary hold always toggles appearance.
  const HOLD_MS = 500, DOUBLE_TAP_MS = 420, MOVE_PX = 14, TAP_DISTANCE = 32;
  let active = null;
  let lastTap = null;
  let holdTimer = null;
  let hideTimer = null;
  let frame = null;
  function isBackground(target, x, y) {
    if (options.isBackground) return options.isBackground(target, x, y);
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
}};
})();
