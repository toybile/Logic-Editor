const fs = require("fs"), assert = require("assert/strict");
const { chromium } = require("../browser-runtime.cjs");
(async () => {
  const browser = await chromium.launch({  headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("https://lp.test/**", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }));
    await page.goto("https://lp.test");
    await page.waitForTimeout(600);
    async function noHold(locator) {
      await locator.hover();
      await page.mouse.down();
      await page.waitForTimeout(80);
      assert.equal(await page.locator(".hy-hold-progress").count(), 0, "click-only button has no hold indicator");
      await locator.dispatchEvent("pointercancel", { pointerId: 1, pointerType: "mouse" });
      await page.mouse.move(1400, 1000);
      await page.mouse.up();
    }
    const stack = page.locator(".hy-symbol-dock-stack");
    const firstId = await stack.locator(":scope > .hy-mod-palette").first().getAttribute("data-window-id");
    const top = stack.locator(":scope > .hy-add-section-zone").first();
    assert.equal(await top.getAttribute("data-before-id"), firstId);
    await top.hover();
    const center = await top.locator("svg").evaluate(svg => {
      const icon = svg.getBoundingClientRect(), zone = svg.closest(".hy-add-section-zone").getBoundingClientRect();
      return [Math.abs(icon.x + icon.width/2 - zone.x - zone.width/2), Math.abs(icon.y + icon.height/2 - zone.y - zone.height/2)];
    });
    assert(center.every(delta => delta < 1), "symbol top plus centered in both axes");
    await top.locator("button").click();
    assert.equal(await stack.locator(":scope > .hy-mod-palette").nth(1).getAttribute("data-window-id"), firstId, "symbol category inserts before first");
    await page.locator("#argument-view-toggle").click();
    await page.locator("#argument-select").click();
    const count = await page.locator("#argument-options [role=menuitemradio]").count();
    await page.locator('.hy-argument-grid-add').click();
    assert.equal(await page.locator("#argument-options [role=menuitemradio]").count(),count+1);
    assert.deepEqual(errors, []);
    console.log("Click-only controls have no hold progress; real tab hold retained; outside actions, top insertion and plus centering OK");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
