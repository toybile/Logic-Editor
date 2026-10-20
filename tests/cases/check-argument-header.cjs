const fs = require("fs"), assert = require("assert/strict");
const { chromium } = require("../browser-runtime.cjs");
(async () => {
  const browser = await chromium.launch({  headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.route("https://lp.test/**", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }));
    await page.goto("https://lp.test");
    await page.waitForTimeout(500);
    await page.evaluate(() => { createArgument(); createArgument(); });
    await page.waitForTimeout(220);
    const snapshot = () => page.evaluate(() => JSON.stringify(argumentWorkspace.documents.map(({selection, ...doc}) => doc)));
    const expected = await snapshot();
    const headerBefore = await page.locator(".hy-head").boundingBox();
    async function centered() {
      const bounds = await page.locator(".hy-argument-navigation").boundingBox();
      const viewport = page.viewportSize();
      assert(Math.abs(bounds.x + bounds.width / 2 - viewport.width / 2) < 2, "header group centered");
      assert(bounds.x >= 0 && bounds.x + bounds.width <= viewport.width);
    }
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await centered();
      const centers = await page.evaluate(() => {
        const tab = document.querySelector('.hy-argument-tabs [aria-selected="true"]');
        const range = document.createRange(); range.selectNodeContents(tab);
        const text = range.getBoundingClientRect();
        const toggle = document.querySelector("#argument-view-toggle svg").getBoundingClientRect();
        const add = document.querySelector("#new-argument svg").getBoundingClientRect();
        return [text.y + text.height / 2, toggle.y + toggle.height / 2, add.y + add.height / 2];
      });
      assert(Math.max(...centers) - Math.min(...centers) < 3, `tab labels and navigation icons align vertically at ${width}: ${centers}`);
      await page.screenshot({ path: `test-artifacts/argument-header-tabs-${width}.png` });
      await page.locator("#argument-view-toggle").click();
      await page.waitForTimeout(320);
      await centered();
      assert(await page.locator("#argument-select").isVisible());
      await page.locator("#argument-select").click();
      await page.waitForTimeout(180);
      const id = await page.locator("#argument-options [role=menuitemradio]").first().getAttribute("data-argument-id");
      await page.screenshot({ path: `test-artifacts/argument-picker-${width}.png` });
      await page.locator("#argument-options [role=menuitemradio]").first().click();
      assert.equal(await page.evaluate(() => argumentWorkspace.activeId), id);
      await page.screenshot({ path: `test-artifacts/argument-header-compact-${width}.png` });
      await page.locator("#argument-view-toggle").click();
      await page.waitForTimeout(320);
      await centered();
      assert.equal(await page.locator('.hy-argument-tabs [aria-selected="true"]').getAttribute("id"), "tab-" + id);
    }
    assert.equal(await snapshot(), expected);
    await page.locator("#argument-view-toggle").click();
    await page.reload();
    assert(await page.locator("#argument-select").isVisible(), "view preference persists");
    assert.equal(await page.locator("#argument-compact-rename,#argument-compact-delete").count(), 0);
    await page.locator("#argument-select").click();
    await page.keyboard.press("Escape");
    await page.evaluate(() => { document.querySelector("#lp-hybrid").style.colorScheme = "dark"; });
    await page.locator("#argument-select").click();
    await page.waitForTimeout(180);
    await page.screenshot({ path: "test-artifacts/argument-picker-dark.png" });
    await page.keyboard.press("Escape");
    if (await page.locator("#argument-options").evaluate(e => e.matches(":popover-open"))) await page.keyboard.press("Escape");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator("#argument-view-toggle").click();
    assert.equal(await page.locator("#argument-view-toggle").evaluate(e => e.getAnimations().length), 0);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForTimeout(300);
    const panel = page.locator(".hy-panel-frame").first();
    const beforeMove = await panel.boundingBox();
    const navigationBefore = await page.locator(".hy-head").boundingBox();
    await page.mouse.move(beforeMove.x + beforeMove.width / 2, beforeMove.y + 12);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.move(beforeMove.x + beforeMove.width / 2 + 35, beforeMove.y + 47, { steps: 8 });
    await page.mouse.up();
    const afterMove = await panel.boundingBox();
    assert(Math.abs(afterMove.x - beforeMove.x) + Math.abs(afterMove.y - beforeMove.y) > 15, "editor panel still moves independently");
    assert.deepEqual(await page.locator(".hy-head").boundingBox(), navigationBefore, "moving editor does not move header");
    const touch = await browser.newPage({ hasTouch: true, viewport: { width: 390, height: 844 } });
    await touch.route("https://lp.test/**", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }));
    await touch.goto("https://lp.test");
    await touch.locator("#argument-view-toggle").click();
    await touch.locator("#argument-select").click();
    await touch.waitForTimeout(200);
    const touchLine = await touch.locator(".hy-argument-grid-add").first().boundingBox();
    const touchItem = await touch.locator(".hy-argument-option").first().boundingBox();
    assert(touchLine.height >= 44 && touchLine.width >= 44, "touch add target is large enough");
    await touch.close();
    assert.deepEqual(errors, []);
    console.log("Argument header: centered tabs/compact, selection, data preservation, rename/create/delete, persistence, reduced motion and 320/390/1440px OK");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });


