const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1300 } }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }),
    );
    await p.goto("https://lp.test");
    await p.waitForTimeout(1200);
    await p
      .locator(".hy-modular-library .hy-add-section-zone")
      .last()
      .locator("button")
      .click({ force: true });
    const cards = p.locator(".hy-symbol-dock-stack>.hy-mod-palette"),
      id = await cards.first().getAttribute("data-window-id"),
      r = await cards.first().locator(".hy-mod-grip").boundingBox();
    await p.mouse.move(r.x + 8, r.y + 8);
    await p.mouse.down();
    await p.mouse.move(r.x + 100, r.y + 90, { steps: 8 });
    assert(await p.locator(".hy-card-insert-preview").count());
    await p.mouse.move(800, 200, { steps: 8 });
    await p.mouse.up();
    const detached = p.locator('.hy-mod-palette[data-window-id="' + id + '"]');
    assert.equal(await detached.getAttribute("data-docked"), "false");
    const d = await detached.locator(".hy-mod-grip").boundingBox(),
      library = await p.locator(".hy-modular-library").boundingBox();
    await p.mouse.move(d.x + 8, d.y + 8);
    await p.mouse.down();
    await p.mouse.move(library.x + 50, library.y + 100, { steps: 8 });
    await p.waitForTimeout(300);
    assert.equal(await detached.getAttribute("data-docked"), "false");
    await p.mouse.up();
    const grip = detached.locator(".hy-mod-grip");
    await grip.hover();
    await p.mouse.down();
    await p.waitForTimeout(600);
    assert.equal(await detached.getAttribute("data-docked"), "true");
    await p.mouse.up();
    assert.equal(await p.locator(".hy-card-insert-preview").count(), 0);
    assert.deepEqual(errors, []);
    console.log(
      "Origin docked: live placeholder; detached origin: no magnet; configured grip hold restores. OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
