const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    for (const width of [1440, 390, 320]) {
      const p = await b.newPage({ locale: "pt-BR", viewport: { width, height: 1000 } }),
        errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.route("https://lp.test/**", (r) =>
        r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
      );
      await p.goto("https://lp.test");
      await p.waitForTimeout(1200);
      await p.locator(".hy-card-picker").first().click();
      assert.equal(await p.locator(".hy-picker-quick-cards button").count(), 3);
      assert.equal(await p.locator(".hy-picker-category-cards button").count(), 10);
      assert.equal(
        await p
          .locator(".hy-picker-category-cards")
          .evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(" ").length),
        2,
      );
      const menu = await p.locator(".hy-card-picker-menu").boundingBox();
      assert(menu.x >= 0 && menu.x + menu.width <= width);
      await p.screenshot({ path: "test-artifacts/grid-picker-" + width + ".png" });
      await p.locator(".hy-picker-category-cards button").nth(3).click();
      assert.equal(await p.locator(".hy-card-picker-menu").isVisible(), false);
      assert.deepEqual(errors, []);
      console.log(
        width +
          ": 3 quick cards, 10 category cards in 2 columns, selection and viewport containment OK",
      );
      await p.close();
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
