globalThis.LPCategoryRowTarget = (stack, preview, cards, top, height, nextId) => {
  if (!preview.isConnected) {
    const initial = cards.find((c) => c.dataset.windowId === nextId);
    if (initial) initial.before(preview);
    else stack.append(preview);
  }
  const children = [...stack.children],
    source = children.indexOf(preview),
    above = children.slice(0, source).filter((e) => e.matches(".hy-mod-palette")),
    below = children.slice(source + 1).filter((e) => e.matches(".hy-mod-palette")),
    origin = stack.getBoundingClientRect().top,
    bottom = top + height;
  let target = below[0] || null;
  for (const card of below) {
    if (bottom <= origin + card.offsetTop + card.offsetHeight * 0.65) break;
    target = cards[cards.indexOf(card) + 1] || null;
  }
  if (target === (below[0] || null)) {
    for (let i = above.length - 1; i >= 0; i--) {
      const card = above[i];
      if (top >= origin + card.offsetTop + card.offsetHeight * 0.35) break;
      target = card;
    }
  }
  return target;
};
