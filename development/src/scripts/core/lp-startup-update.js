(() => {
  if (!/^https?:$/.test(location.protocol)) return;
  const url = new URL(location.href),
    fresh = url.searchParams.has("__lp_fresh");
  if (fresh) {
    url.searchParams.delete("__lp_fresh");
    history.replaceState(history.state, "", url.href);
    return;
  }
  let interacted = false;
  const noteInteraction = () => {
    interacted = true;
  };
  for (const name of ["pointerdown", "keydown", "input"])
    document.addEventListener(name, noteInteraction, { capture: true, once: true });
  const assets = (doc) =>
    [...doc.querySelectorAll("script,style")]
      .map((e) => e.tagName + "\n" + e.textContent)
      .join("\n");
  const stopTracking = () => {
    for (const name of ["pointerdown", "keydown", "input"])
      document.removeEventListener(name, noteInteraction, true);
  };
  document.addEventListener(
    "DOMContentLoaded",
    async () => {
      if (!navigator.onLine) {
        stopTracking();
        return;
      }
      const current = assets(document),
        probe = new URL(location.href);
      probe.hash = "";
      probe.searchParams.set("__lp_check", String(Date.now()));
      const controller = new AbortController(),
        timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(probe.href, { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const next = new DOMParser().parseFromString(await response.text(), "text/html");
        if (!next.querySelector("#lp-hybrid") || assets(next) === current) return;
        const reload = () => {
          if (typeof saveArguments === "function") saveArguments();
          const target = new URL(location.href);
          target.searchParams.set("__lp_fresh", String(Date.now()));
          location.replace(target.href);
        };
        if (!interacted) {
          reload();
          return;
        }
        const banner = document.createElement("div");
        banner.className = "hy-update-notice";
        banner.setAttribute("role", "status");
        const english = () => document.documentElement.lang === "en",
          message = document.createElement("span"),
          update = document.createElement("button"),
          dismiss = document.createElement("button");
        message.textContent = english()
          ? "A new version is available."
          : "Uma nova versão está disponível.";
        update.textContent = english() ? "Update" : "Atualizar";
        dismiss.textContent = "×";
        update.type = dismiss.type = "button";
        dismiss.setAttribute(
          "aria-label",
          english() ? "Dismiss update notice" : "Fechar aviso de atualização",
        );
        update.onclick = reload;
        dismiss.onclick = () => banner.remove();
        banner.append(message, update, dismiss);
        document.body.append(banner);
      } catch {
      } finally {
        clearTimeout(timeout);
        stopTracking();
      }
    },
    { once: true },
  );
})();
