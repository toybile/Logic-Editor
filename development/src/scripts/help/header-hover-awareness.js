(() => {
  const settings = root.querySelector(".hy-head>[popovertarget=editor-settings]"),
    group = document.createElement("div");
  group.className = "hy-head-end";
  settings.before(group);
  group.append(settings);
})();
