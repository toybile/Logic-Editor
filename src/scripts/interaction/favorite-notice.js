const favoriteNotice = (() => {
  const notice = document.createElement("div");
  notice.className = "hy-favorite-notice";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  notice.setAttribute("popover", "manual");
  notice.hidden = true;
  document.querySelector("#lp-hybrid").append(notice);
  let timer, animation, hovered = false, revision = 0;
  const duration = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
  function schedule() {
    clearTimeout(timer);
    if (hovered || notice.hidden) return;
    timer = setTimeout(async () => {
      const current = ++revision;
      animation?.cancel();
      animation = notice.animate(
        [{ opacity: 1, transform: "translate(-50%, 0)" },
          { opacity: 0, transform: "translate(-50%, 14px)" }],
        { duration: duration(), easing: "ease-in", fill: "forwards" },
      );
      try { await animation.finished; } catch { return; }
      if (current === revision) { if (notice.matches(":popover-open")) notice.hidePopover(); notice.hidden = true; }
    }, 1000);
  }
  notice.addEventListener("pointerenter", () => {
    hovered = true;
    clearTimeout(timer);
    ++revision;
    animation?.cancel();
  });
  notice.addEventListener("pointerleave", () => {
    hovered = false;
    schedule();
  });
  return async function showFavoriteNotice(message) {
    const current = ++revision;
    clearTimeout(timer);
    animation?.cancel();
    if (notice.matches(":popover-open")) notice.hidePopover();
    const parent = [...document.querySelectorAll("dialog:modal")].at(-1) || document.querySelector("#lp-hybrid");
    if (notice.parentElement !== parent) parent.append(notice);
    notice.textContent = message;
    notice.hidden = false;
    notice.showPopover();
    hovered = notice.matches(":hover");
    animation = notice.animate(
      [{ opacity: 0, transform: "translate(-50%, 14px)" },
        { opacity: 1, transform: "translate(-50%, 0)" }],
      { duration: duration(), easing: "ease-out" },
    );
    try { await animation.finished; } catch { return; }
    if (current === revision) schedule();
  };
})();
