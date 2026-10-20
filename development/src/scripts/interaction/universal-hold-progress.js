(() => {
  const root = document.querySelector("#lp-hybrid");
  let hold = null;
  function stop() {
    if (!hold) return;
    hold.visual.remove();
    cancelAnimationFrame(hold.frame);
    hold = null;
  }
  document.addEventListener(
    "pointerdown",
    (e) => {
      const background = typeof isThemeBackgroundTarget === "function" && isThemeBackgroundTarget(e.target);
      if (e.button !== 0 || (!root.contains(e.target) && !background)) return;
      stop();
      if (e.target.closest("button:disabled,input:disabled,[aria-disabled=true]")) return;
      const detachedGrip = e.target.closest(".hy-mod-palette[data-docked=false] .hy-mod-grip"),
        role = e.target.closest(".hy-role"),
        tab = e.target.closest(".hy-argument-tab,#argument-options [role=menuitemradio],.hy-argument-grid-add"),
        eye = e.target.closest('[data-action="editor"],[data-action="preview"]'),
        row = e.target.closest("#rows>.hy-row"),
        symbol = e.pointerType !== "mouse" && e.target.closest(".hy-symbol");
      let owner = detachedGrip || role || tab || eye || symbol || row || (background ? root : null);
      if (!owner) return;
      if (row && !role && !symbol && e.target.closest("button,input,textarea,label,select,a") &&
          !e.target.closest(".hy-delete-line,.hy-block,.hy-continuous-field")) return;
      if (row && !role && !symbol && e.target.closest(".hy-premise-add-line")) return;
      const duration = typeof getHoldDelay === "function" ? getHoldDelay() : 500,
        visual = document.createElement("div");
      visual.className = "hy-hold-progress";
      visual.setAttribute("popover", "manual");
      visual.setAttribute("aria-hidden", "true");
      visual.innerHTML =
        '<div class="hy-hold-track"><div class="hy-hold-fill"></div></div><span class="hy-hold-duration"></span>';
      visual.querySelector("span").textContent =
        (duration / 1000).toLocaleString(document.documentElement.lang, {
          maximumFractionDigits: 2,
        }) + " s";
      root.append(visual);
      visual.showPopover();
      const g = { owner, visual, x: e.clientX, y: e.clientY, pointer: e.pointerId };
      hold = g;
      function position() {
        if (hold !== g) return;
        if (!owner.isConnected) {
          stop();
          return;
        }
        const r = background ? {left:g.x,width:0,bottom:g.y+8} : owner.getBoundingClientRect();
        visual.style.left =
          Math.max(4, Math.min(innerWidth - 48, r.left + r.width / 2 - 22)) + "px";
        visual.style.top = Math.min(innerHeight - 27, r.bottom + 3) + "px";
        g.frame = requestAnimationFrame(position);
      }
      position();
      visual
        .querySelector(".hy-hold-fill")
        .animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
          duration,
          easing: "linear",
          fill: "forwards",
        });
    },
    true,
  );
  document.addEventListener(
    "pointermove",
    (e) => {
      if (
        hold &&
        hold.pointer === e.pointerId &&
        Math.hypot(e.clientX - hold.x, e.clientY - hold.y) > 4
      )
        stop();
    },
    true,
  );
  for (const event of ["pointerup", "pointercancel"]) document.addEventListener(event, stop, true);
  window.addEventListener("blur", stop);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") stop();
  });
})();
