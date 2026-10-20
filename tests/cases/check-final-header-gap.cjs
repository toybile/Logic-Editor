const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }),
    );
    await p.goto("https://lp.test");
    await p.waitForTimeout(1200);
    for (const scale of [0.8, 1, 1.5]) {
      await p.evaluate(
        (s) => document.querySelector("#lp-hybrid").style.setProperty("--library-scale", s),
        scale,
      );
      await p.waitForTimeout(150);
      const a = await p.locator(".hy-library-heading .hy-mod-grip").boundingBox(),
        b = await p.locator(".hy-search-trigger").boundingBox(),
        t = await p.locator(".hy-library-heading h3").boundingBox();
      assert(Math.abs(t.x + t.width / 2 - (a.x + a.width + b.x) / 2) < 1);
      console.log(scale + ": title centered in gap");
    }
    await p.evaluate(() =>
      document.querySelector("#lp-hybrid").style.setProperty("--library-scale", "1"),
    );
    await p
      .locator(".hy-modular-library")
      .screenshot({ path: "test-artifacts/final-header-gap.png" });
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
