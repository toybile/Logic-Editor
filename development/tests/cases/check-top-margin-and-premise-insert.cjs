const fs = require("fs"), assert = require("assert/strict");
const { chromium } = require("../browser-runtime.cjs");
(async () => {
  const browser = await chromium.launch({  headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" });
    const errors = []; page.on("pageerror", e => errors.push(e.message));
    await page.route("https://lp.test/**", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }));
    await page.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await page.goto("https://lp.test"); await page.waitForFunction(() => !document.getAnimations().some(a => a.id === "lp-window-entrance"));
    const top = page.locator('.hy-premise-add-line[data-insert-index="0"]');
    const original = await page.evaluate(() => JSON.stringify(rows));
    const first = await page.locator("#rows > .hy-row").first().boundingBox();
    const bounds = await top.boundingBox();
    assert(Math.abs(bounds.y + bounds.height / 2 - first.y) < 1, "premise insertion centered at top boundary");
    await top.hover();
    await page.screenshot({ path: "test-artifacts/premise-top-insert.png" });
    await top.locator("button").click();
    assert.equal(await page.evaluate(() => rows[0].role), "premise");
    assert.equal(await page.evaluate(() => rows[0].text), "");
    assert.equal(await page.evaluate(() => JSON.stringify(rows.slice(1))), original);
    await page.locator(".hy-undo-lines").click();
    assert.equal(await page.evaluate(() => JSON.stringify(rows)), original);
    await page.locator("#rows .hy-block").first().hover(); await page.mouse.down(); await page.waitForTimeout(600); await page.mouse.up(); await page.waitForTimeout(400);
    assert.equal(await top.isVisible(), false);
    await page.evaluate(() => root.dispatchEvent(new CustomEvent("lp-insert-premise-line", { detail: { index: 0 } })));
    assert.equal(await page.evaluate(() => JSON.stringify(rows)), original, "selection blocks top insertion");
    await page.locator(".hy-line-select").first().uncheck();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1100 }); await page.waitForTimeout(200);
      await page.mouse.move(0, 1000);
      const geometry = await page.locator(".hy-modular-library > .hy-side").evaluate(body => {
        const b = body.getBoundingClientRect(), card = body.querySelector(".hy-mod-palette"), head = card.querySelector(".hy-card-picker").getBoundingClientRect(), grid = card.querySelector(".hy-mod-symbols").lastElementChild.getBoundingClientRect();
        return { top: head.top - b.top, bottom: b.bottom - grid.bottom };
      });
      assert(Math.abs(geometry.top - geometry.bottom) < 2, `balanced library margins ${width}: ${JSON.stringify(geometry)}`);
      const zone = page.locator(".hy-symbol-dock-stack > .hy-add-section-zone").first();
      assert.equal(await zone.evaluate(e => getComputedStyle(e, "::before").display), "none");
      assert.equal(await zone.locator("button").evaluate(e => getComputedStyle(e).opacity), "0");
      await page.screenshot({ path: `test-artifacts/library-balanced-${width}.png` });
      await zone.hover();
      assert.equal(await zone.locator("button").evaluate(e => getComputedStyle(e).opacity), "1");
      await page.screenshot({ path: `test-artifacts/library-top-hover-${width}.png` });
    }
    assert.deepEqual(errors, []);
    console.log("Top premise insertion/undo/selection guard, balanced library margins and hover-only upper line OK");
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
