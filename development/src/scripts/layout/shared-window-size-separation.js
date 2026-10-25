(() => {
  const selector = ".hy-modular-library,.hy-mod-palette,.hy-mod-rail-window,.hy-panel-frame",
    bases = new Map(),
    relations = new Map(),
    watched = new WeakSet();
  let scheduled = false,
    press = null,
    ready = false,
    resetUntil = 0,
    pendingKeyMoves = 0;
  const visible = () =>
    [...root.querySelectorAll(selector)].filter(
      (e) =>
        e.dataset.docked !== "true" &&
        e.getClientRects().length &&
        getComputedStyle(e).visibility !== "hidden",
    );
  const rect = (e) => {
    const r = e.getBoundingClientRect(),
      origin = root.getBoundingClientRect();
    return {
      x: r.x - origin.x,
      y: r.y - origin.y,
      width: r.width,
      height: r.height,
      right: r.right - origin.x,
      bottom: r.bottom - origin.y,
    };
  };
  const overlap = (a, b) =>
    a.x < b.right - 1 && a.right > b.x + 1 && a.y < b.bottom - 1 && a.bottom > b.y + 1;
  const key = (e) =>
    e.matches(".hy-modular-library")
      ? "library"
      : e.matches(".hy-mod-rail-window")
        ? "categories"
        : e.matches(".hy-panel-frame")
          ? "frame-" + e.dataset.panel
          : "group-" + (e.dataset.windowId || e.dataset.group);
  let saved = {};
  try {
    const stored = JSON.parse(localStorage.getItem("formal-window-preferred-positions-v1"));
    saved =
      stored?.schema === 2 && Math.abs(stored.viewportWidth - root.clientWidth) < 2
        ? stored.positions || {}
        : {};
  } catch {}
  function save() {
    for (const [e, b] of bases) if (e.isConnected) saved[key(e)] = b;
    try {
      localStorage.setItem(
        "formal-window-preferred-positions-v1",
        JSON.stringify({ schema: 2, viewportWidth: root.clientWidth, positions: saved }),
      );
    } catch {}
  }
  function remember(e, manual = false) {
    const current = rect(e),
      old = saved[key(e)];
    bases.set(
      e,
      !manual &&
        !(e.matches(".hy-modular-library") && e.dataset.floating !== "true") &&
        old &&
        Number.isFinite(old.x) &&
        Number.isFinite(old.y)
        ? { ...current, ...old }
        : current,
    );
  }
  function pair(a, b) {
    let row = relations.get(a);
    if (!row) {
      row = new Map();
      relations.set(a, row);
    }
    if (row.has(b)) return row.get(b);
    const x = bases.get(a),
      y = bases.get(b);
    let relation = null;
    if (!overlap(x, y)) {
      if (x.bottom <= y.y + 1)
        relation = { axis: "y", first: a, second: b, gap: Math.max(12, y.y - x.bottom) };
      else if (y.bottom <= x.y + 1)
        relation = { axis: "y", first: b, second: a, gap: Math.max(12, x.y - y.bottom) };
      else if (x.right <= y.x + 1)
        relation = { axis: "x", first: a, second: b, gap: Math.max(12, y.x - x.right) };
      else relation = { axis: "x", first: b, second: a, gap: Math.max(12, x.x - y.right) };
    }
    row.set(b, relation);
    return relation;
  }
  function invalidate(e) {
    relations.delete(e);
    for (const row of relations.values()) row.delete(e);
  }
  function adopt(e) {
    if (!e || !e.isConnected) return;
    remember(e, true);
    invalidate(e);
    save();
  }
  function update() {
    if (root.dataset.windowMaximized === "true") { scheduled = false; return; }
    scheduled = false;
    if (root.hidden || !root.getClientRects().length) return;
    if (Date.now() < resetUntil) {
      setTimeout(schedule, 280);
      return;
    }
    if (!ready || matchMedia("(max-width:900px), (pointer:coarse) and (max-width:1100px)").matches || press?.moved || pendingKeyMoves)
      return;
    const list = visible();
    for (const e of list) {
      if (e.matches(".hy-panel-frame") && e.parentElement.dataset.manual !== "true") {
        remember(e, true);
        invalidate(e);
      } else if (!bases.has(e)) remember(e);
    }
    const targets = new Map(
      list.map((e) => {
        const b = bases.get(e),
          r = rect(e);
        return [e, { ...r, x: b.x, y: b.y, right: b.x + r.width, bottom: b.y + r.height }];
      }),
    );
    function shift(e, axis, amount) {
      const t = targets.get(e);
      t[axis] += amount;
      t.right = t.x + t.width;
      t.bottom = t.y + t.height;
    }
    for (let pass = 0; pass < list.length * 2; pass++) {
      let changed = false;
      for (let i = 0; i < list.length; i++)
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i],
            b = list[j],
            relation = pair(a, b),
            x = targets.get(a),
            y = targets.get(b);
          if (!relation || !overlap(x, y)) continue;
          const library = a.matches(".hy-modular-library")
              ? a
              : b.matches(".hy-modular-library")
                ? b
                : null,
            panel = a.matches(".hy-panel-frame") ? a : b.matches(".hy-panel-frame") ? b : null;
          if (library && panel) {
            const l = targets.get(library),
              p = targets.get(panel);
            shift(library, "y", p.bottom + 12 - l.y);
          } else {
            const first = targets.get(relation.first),
              second = targets.get(relation.second);
            if (relation.axis === "y")
              shift(relation.second, "y", first.bottom + relation.gap - second.y);
            else {
              const dx = first.right + relation.gap - second.x;
              if (second.right + dx <= innerWidth - 8) shift(relation.second, "x", dx);
              else shift(relation.second, "y", first.bottom + 12 - second.y);
            }
          }
          changed = true;
        }
      if (!changed) break;
    }
    for (const [element, target] of targets) {
      const current = rect(element),
        dx = target.x - current.x,
        dy = target.y - current.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)
        root.dispatchEvent(new CustomEvent("lp-displace-window", { detail: { element, dx, dy } }));
    }
    save();
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  const observer = new ResizeObserver(schedule);
  function watch() {
    for (const e of root.querySelectorAll(selector))
      if (!watched.has(e)) {
        watched.add(e);
        observer.observe(e);
      }
    schedule();
  }
  new MutationObserver(watch).observe(root, { childList: true, subtree: true });
  root.addEventListener(
    "pointerdown",
    (e) => {
      const element = e.target.closest(selector);
      if (element) press = { element, x: e.clientX, y: e.clientY, moved: false };
    },
    true,
  );
  window.addEventListener(
    "pointermove",
    (e) => {
      if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 6) press.moved = true;
    },
    true,
  );
  function release() {
    if (press?.moved) adopt(press.element);
    press = null;
    schedule();
  }
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  root.addEventListener(
    "keydown",
    (e) => {
      if (e.target.matches(".hy-panel-frame,.hy-mod-grip") && e.key.startsWith("Arrow")) {
        pendingKeyMoves++;
        setTimeout(() => {
          adopt(e.target.closest(selector));
          pendingKeyMoves--;
          schedule();
        }, 0);
      }
    },
    true,
  );
  function clearPreferred(filter) {
    for (const e of [...bases.keys()])
      if (filter(e)) {
        bases.delete(e);
        delete saved[key(e)];
        invalidate(e);
      }
  }
  root.addEventListener("lp-reset-library-layout", () => {
    resetUntil = Date.now() + 250;
    clearPreferred((e) => !e.matches(".hy-panel-frame"));
    setTimeout(() => {
      for (const e of visible()) if (!e.matches(".hy-panel-frame")) adopt(e);
      schedule();
    }, 0);
  });
  root.addEventListener("lp-reset-panel-layout", () => {
    resetUntil = Date.now() + 250;
    clearPreferred((e) => e.matches(".hy-panel-frame"));
    setTimeout(() => {
      for (const e of visible()) if (e.matches(".hy-panel-frame")) adopt(e);
      schedule();
    }, 0);
  });
  root.addEventListener("lp-window-manual-placement", (e) => {
    adopt(e.detail.element);
    schedule();
  });
  window.addEventListener("resize", schedule);
  setTimeout(() => {
    for (const e of visible()) remember(e);
    ready = true;
    watch();
  }, 950);
})();
