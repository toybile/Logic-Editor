const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    const p = await b.newPage({ locale: "en", viewport: { width: 1440, height: 1100 } }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.addInitScript(() => {
      if (localStorage.getItem("appearance-test-seeded")) return;
      localStorage.setItem("appearance-test-seeded", "true");
      localStorage.setItem(
        "formal-argument-ui",
        JSON.stringify({
          language: "en",
          internalDetail: "none",
          panelAppearance: {
            editor: { detail: "numbers", external: true, border: false },
            preview: { detail: "recess", external: true, border: false },
          },
        }),
      );
      localStorage.setItem(
        "formal-arguments-v1",
        JSON.stringify({
          documents: [
            {
              id: "test",
              rows: [
                { text: "A", role: "premise" },
                { text: "B", role: "conclusion" },
              ],
              descriptions: {},
            },
          ],
          activeId: "test",
          nextNumber: 2,
        }),
      );
    });
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }),
    );
    await p.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await p.goto("https://lp.test");
    await p.waitForTimeout(900);
    const marks = p.locator("#rows .hy-row-decoration");
    assert.deepEqual(await marks.allTextContents(), ["1", "2"]);
    assert(await marks.first().isVisible());
    await p.locator("[data-action=preview]").click({ delay: 600 });
    const dialog = p.locator(".hy-panel-appearance-dialog");
    await dialog.locator(".hy-detail-picker summary").click();
    await dialog.locator(".hy-detail-options button").filter({ hasText: "Soft wave" }).click();
    await dialog.locator("[data-close]").click();
    assert.equal(await p.locator(".hy-editor").getAttribute("data-internal-detail"), "numbers");
    assert.equal(
      await p.locator(".hy-argument-panel").getAttribute("data-internal-detail"),
      "wave",
    );
    assert(await marks.first().isVisible());
    await p.locator("#rows .hy-block").last().press("Enter");
    await p.waitForTimeout(150);
    assert.deepEqual(await marks.allTextContents(), ["1", "2", "3"]);
    await p.reload();
    await p.waitForTimeout(900);
    assert.equal(await p.locator(".hy-editor").getAttribute("data-internal-detail"), "numbers");
    assert.equal(
      await p.locator(".hy-argument-panel").getAttribute("data-internal-detail"),
      "wave",
    );
    assert(await marks.first().isVisible());
    assert.deepEqual(errors, []);
    console.log("Independent panel details, new-row decoration and persisted appearance PASS");
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
