const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
      
      headless: true,
    }),
    p = await b.newPage({ viewport: { width: 1440, height: 1200 } });
  try {
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
    );
    await p.goto("https://lp.test");
    await p.waitForTimeout(1200);
    await p
      .locator(".hy-modular-library .hy-add-section-zone")
      .last()
      .locator("button")
      .click({ force: true });
    const cards = p.locator(".hy-symbol-dock-stack>.hy-mod-palette"),
      first = cards.first(),
      firstID = await first.getAttribute("data-window-id"),
      second = await cards.nth(1).boundingBox(),
      r = await first.locator(".hy-mod-grip").boundingBox(),
      before = await first.boundingBox(),
      symbolBefore = await first.locator(".hy-symbol").first().boundingBox();
    await p.mouse.move(r.x + 8, r.y + 8);
    await p.mouse.down();
    await p.mouse.move(r.x + 10, second.y + 10, { steps: 12 });
    await p.waitForTimeout(220);
    assert.equal(
      await p
        .locator(".hy-symbol-dock-stack")
        .evaluate((e) => e.lastElementChild.classList.contains("hy-card-insert-preview")),
      true,
    );
    const moved = await p.locator('[data-window-id="' + firstID + '"]').boundingBox(),
      symbolAfter = await p
        .locator('[data-window-id="' + firstID + '"] .hy-symbol')
        .first()
        .boundingBox(),
      preview = await p.locator(".hy-card-insert-preview").boundingBox();
    console.log({ before, moved, preview, symbolBefore, symbolAfter });
    await p.screenshot({ path: "test-artifacts/verified-first-card-drag.png" });
    for (const key of ["width", "height"]) {
      assert(Math.abs(before[key] - moved[key]) < 1);
      assert(Math.abs(before[key] - preview[key]) < 1);
      assert(Math.abs(symbolBefore[key] - symbolAfter[key]) < 1);
    }
    await p.screenshot({ path: "test-artifacts/verified-first-card-drag.png" });
    await p.mouse.up();
    assert.equal(await cards.last().getAttribute("data-window-id"), firstID);
    await p.reload();
    await p.waitForTimeout(1200);
    assert.equal(await cards.last().getAttribute("data-window-id"), firstID);
    console.log(
      "First category crosses next divider and moves below; window/placeholder/symbol sizes match; order persists. OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
