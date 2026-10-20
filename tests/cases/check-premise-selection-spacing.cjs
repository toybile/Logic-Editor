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
    await p.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await p.goto("https://lp.test");
    await p.waitForTimeout(1200);
    assert(await p.locator("#add-line").isVisible());
    for (let i = 0; i < 6; i++) await p.locator("#add-line").click();
    await p.waitForTimeout(300);
    const offsets = await p.evaluate(() => {
      const rows = [...document.querySelectorAll("#rows>.hy-row")],
        lines = [...document.querySelectorAll(".hy-premise-add-line")];
      return rows.map((r, i) => {
        const a = r.getBoundingClientRect(),
          b = lines.find(line => Number(line.dataset.insertIndex) === i + 1).getBoundingClientRect();
        return a.bottom - (b.y + b.height / 2);
      });
    });
    assert(
      offsets.every((x) => Math.abs(x) < 1),
      JSON.stringify(offsets),
    );
    assert(
      await p
        .locator("#rows>.hy-row")
        .first()
        .evaluate((e) => getComputedStyle(e, "::after").display === "none"),
    );
    const count = await p.locator("#rows>.hy-row").count();
    await p.locator("#rows .hy-block").first().hover(); await p.mouse.down(); await p.waitForTimeout(600); await p.mouse.up(); await p.waitForTimeout(400);
    assert(await p.locator("#add-line").isDisabled());
    await p.locator("#rows .hy-block").first().focus();
    await p.keyboard.press("Enter");
    assert.equal(await p.locator("#rows>.hy-row").count(), count);
    await p.evaluate(() =>
      document
        .querySelector("#lp-hybrid")
        .dispatchEvent(new CustomEvent("lp-insert-premise-line", { detail: { index: 1 } })),
    );
    assert.equal(await p.locator("#rows>.hy-row").count(), count);
    await p.locator(".hy-line-select").first().uncheck();
    assert.equal(await p.locator("#add-line").isDisabled(), false);
    assert.deepEqual(errors, []);
    console.log(
      "Restored +; selection blocks button/Enter/line insertion; 9 dividers aligned without cumulative drift or double lines. OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
