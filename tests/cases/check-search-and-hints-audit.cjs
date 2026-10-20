const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    for (const width of [1440, 390]) {
      const p = await b.newPage({ locale: "pt-BR", viewport: { width, height: 1000 } }),
        errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.route("https://lp.test/**", (r) =>
        r.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }),
      );
      await p.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await p.goto("https://lp.test");
      await p.waitForTimeout(1000);
      const count = await p.locator(".hy-symbol-dock-stack .hy-mod-palette").count();
      await p.locator(".hy-search-trigger").click();
      await p.locator(".hy-symbol-search").fill("negacao");
      await p.waitForTimeout(250);
      assert(await p.locator(".hy-mod-search-results").isVisible());
      assert((await p.locator(".hy-mod-search-results .hy-symbol").count()) > 0);
      assert.equal(await p.locator(".hy-symbol-dock-stack").isVisible(), false);
      await p.screenshot({ path: "test-artifacts/audit-search-" + width + ".png" });
      await p.locator(".hy-mod-search-results .hy-symbol").first().click();
      await p.locator(".hy-symbol-search").fill("zzzzsemresultado");
      assert(await p.locator(".hy-mod-search-results .hy-mod-empty").isVisible());
      await p.locator(".hy-symbol-search").press("Escape");
      assert.equal(await p.locator(".hy-mod-search-results").isVisible(), false);
      assert.equal(await p.locator(".hy-symbol-dock-stack .hy-mod-palette").count(), count);
      assert(await p.locator(".hy-symbol-dock-stack").isVisible());
      if (width === 1440) {
        const tip = p.locator("#lp-shared-hover-hint");
        for (const [selector, match] of [
          [".hy-card-picker", "abrir ou fechar"],
          [".hy-symbol-dock-stack [data-create-category]", "Clique"],
          [".hy-add-section-zone:not(.hy-argument-insert) button", "Clique"],
        ]) {
          await p.locator(selector).first().hover();
          await p.waitForTimeout(650);
          assert(await tip.evaluate((e) => e.matches(":popover-open")), selector);
          assert((await tip.textContent()).includes(match), await tip.textContent());
          await p.mouse.move(900, 900);
        }
        await p.locator("#rows .hy-block").first().hover();
        await p.waitForTimeout(650);
        assert((await tip.textContent()).includes("bloco vizinho"));
        await p.screenshot({ path: "test-artifacts/audit-hint-block.png" });
      }
      assert.deepEqual(errors, []);
      console.log(
        width +
          ": visible accent-insensitive search, empty state, insertion, Escape restoration and hints PASS",
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
