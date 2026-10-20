const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
      
      headless: true,
    }),
    p = await b.newPage({ locale: "pt-BR", viewport: { width: 320, height: 650 } });
  try {
    p.setDefaultTimeout(10000);
    await p.addInitScript(() => {
      localStorage.setItem("formal-argument-ui", JSON.stringify({ language: "pt-BR" }));
      localStorage.setItem(
        "formal-arguments-v1",
        JSON.stringify({
          documents: [
            {
              id: "test",
              rows: [
                { text: "A →", role: "premise" },
                { text: "B", role: "conclusion" },
              ],
              descriptions: Object.fromEntries(
                Array.from({ length: 20 }, (_, i) => ["P" + i, "Descrição " + i]),
              ),
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
    await p.waitForTimeout(700);
    await p.locator(".hy-proposition-descriptions").click();
    const d = p.locator(".hy-beta-dialog"),
      box = await d.boundingBox();
    assert(box.x >= 0 && box.x + box.width <= 320 && box.height <= 622);
    await d.getByRole("button", { name: "Cancelar", exact: true }).click();
    await p.locator(".hy-logic-button").click();
    await p.waitForFunction(
      () => document.querySelector("#logic-panel").dataset.state === "errors",
    );
    await p.locator("#logic-panel").screenshot({ path: "test-artifacts/beta-syntax-320.png" });
    await p.locator("#logic-panel button.hy-logic-result").click();
    assert(
      await p
        .locator("#rows .hy-block")
        .first()
        .evaluate((e) => e === document.activeElement),
    );
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    console.log(
      "320px: long description form scroll/actions, syntax state and focus-error action PASS",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
