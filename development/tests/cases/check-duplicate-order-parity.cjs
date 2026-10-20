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
      source = await first.boundingBox(),
      next = await cards.nth(1).boundingBox(),
      button = await first.locator("[data-create-category]").boundingBox();
    await p.mouse.move(button.x + 8, button.y + 8);
    await p.mouse.down();
    await p.mouse.move(button.x + 8, next.y + next.height * 0.8, { steps: 12 });
    await p.waitForTimeout(230);
    const ghost = await p.locator(".hy-category-drag-preview").boundingBox(),
      preview = await p.locator(".hy-card-insert-preview").boundingBox();
    assert(Math.abs(source.width - ghost.width) < 1);
    assert(Math.abs(source.height - ghost.height) < 1);
    assert(Math.abs(source.height - preview.height) < 1);
    assert(
      await p
        .locator(".hy-symbol-dock-stack")
        .evaluate((e) => e.lastElementChild.classList.contains("hy-card-insert-preview")),
    );
    await p.screenshot({ path: "test-artifacts/duplicate-order-parity.png" });
    await p.mouse.up();
    assert.equal(await cards.count(), 3);
    console.log(
      "Duplicate uses shared row overlap target; placeholder moves below neighbor; ghost and slot match source size. OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
