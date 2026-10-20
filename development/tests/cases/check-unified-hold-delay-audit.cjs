const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
      
      headless: true,
    }),
    p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
  try {
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
    );
    await p.goto("https://lp.test");
    await p.waitForTimeout(1200);
    assert.equal(await p.evaluate(() => getHoldDelay()), 500);
    for (const duration of [500, 750]) {
      if (duration === 750)
        await p.locator("#hold-delay-range").evaluate((e) => {
          e.value = ".75";
          e.dispatchEvent(new Event("input", { bubbles: true }));
        });
      assert.equal(await p.evaluate(() => getHoldDelay()), duration);
      await p.evaluate(() => {
        const e = document.querySelector(".hy-mod-palette");
        document.querySelector("#lp-hybrid").dispatchEvent(
          new CustomEvent("lp-set-palette-dock", {
            detail: { id: e.dataset.windowId, docked: false, x: 650, y: 150 },
          }),
        );
      });
      await p.locator(".hy-mod-palette .hy-mod-grip").hover();
      await p.waitForTimeout(650);
      const tip = p.locator("#lp-shared-hover-hint");
      assert(await tip.evaluate((e) => e.matches(":popover-open")));
      assert((await tip.textContent()).includes((duration / 1000).toLocaleString("en") + " s"));
      assert((await tip.textContent()).includes("return to the library"));
      await p.mouse.down();
      await p.waitForTimeout(80);
      assert.equal(
        await p
          .locator(".hy-hold-fill")
          .evaluate((e) => e.getAnimations()[0].effect.getTiming().duration),
        duration,
      );
      await p.waitForTimeout(duration - 200);
      assert.equal(await p.locator(".hy-mod-palette").getAttribute("data-docked"), "false");
      await p.waitForTimeout(180);
      assert.equal(await p.locator(".hy-mod-palette").getAttribute("data-docked"), "true");
      await p.mouse.up();
      console.log(duration + "ms: progress and detached-return action match configured duration");
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
