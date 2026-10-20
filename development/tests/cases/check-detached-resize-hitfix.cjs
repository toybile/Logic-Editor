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
    await p.evaluate(() => {
      const e = document.querySelector(".hy-mod-palette");
      document.querySelector("#lp-hybrid").dispatchEvent(
        new CustomEvent("lp-set-palette-dock", {
          detail: { id: e.dataset.windowId, docked: false, x: 650, y: 150 },
        }),
      );
    });
    const win = p.locator(".hy-mod-palette[data-docked=false]");
    for (const side of ["right", "left"]) {
      const before = await win.boundingBox(),
        edge = await win.locator(".hy-library-width-" + side).boundingBox();
      await p.mouse.move(edge.x + edge.width / 2, edge.y + edge.height / 2);
      await p.mouse.down();
      await p.mouse.move(
        edge.x + edge.width / 2 + (side === "right" ? 70 : -40),
        edge.y + edge.height / 2,
        { steps: 8 },
      );
      await p.mouse.up();
      const after = await win.boundingBox();
      assert(after.width > before.width + 25);
      assert(Math.abs(after.y - before.y) < 1);
      if (side === "right") assert(Math.abs(after.x - before.x) < 1);
      else assert(Math.abs(after.x + after.width - before.x - before.width) < 1);
    }
    assert.equal(await p.locator(".hy-card-insert-preview").count(), 0);
    console.log(
      "Both resize edges change width without moving vertically or starting window drag. OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
