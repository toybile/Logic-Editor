const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    for (const width of [1440, 390])
      for (const theme of ["light", "dark"]) {
        const p = await b.newPage({ locale: "pt-BR", viewport: { width, height: 1000 } }),
          errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        p.setDefaultTimeout(10000);
        await p.addInitScript((theme) => {
          localStorage.setItem("formal-argument-ui", JSON.stringify({ language: "pt-BR", theme }));
          localStorage.setItem(
            "formal-arguments-v1",
            JSON.stringify({
              documents: [
                {
                  id: "beta",
                  name: "Teste",
                  rows: [
                    { text: "A → B", role: "premise" },
                    { text: "A", role: "premise" },
                    { text: "B", role: "conclusion" },
                  ],
                  descriptions: {},
                  numbered: true,
                },
              ],
              activeId: "beta",
              nextNumber: 2,
            }),
          );
        }, theme);
        await p.route("https://lp.test/**", (r) =>
          r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
        );
        await p.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await p.goto("https://lp.test");
        await p.waitForTimeout(800);
        await p.locator(".hy-proposition-descriptions").click();
        const d = p.locator(".hy-beta-dialog");
        assert.equal(await d.count(), 1);
        await d.locator("input").first().fill("Está chovendo.");
        await d.screenshot({
          path: "test-artifacts/beta-descriptions-" + width + "-" + theme + ".png",
        });
        const box = await d.boundingBox();
        assert(box.x >= 0 && box.x + box.width <= width);
        await d.getByRole("button", { name: "Salvar", exact: true }).click();
        assert.equal(
          await p.evaluate(
            () =>
              argumentWorkspace.documents.find((d) => d.id === argumentWorkspace.activeId)
                .descriptions.A,
          ),
          "Está chovendo.",
        );
        await p.locator(".hy-proposition-descriptions").click();
        await d.locator("input").first().fill("Não salvar");
        await d.locator(".hy-beta-close").click();
        assert.equal(
          await p.evaluate(
            () =>
              argumentWorkspace.documents.find((d) => d.id === argumentWorkspace.activeId)
                .descriptions.A,
          ),
          "Está chovendo.",
        );
        await p.locator(".hy-logic-button").click();
        await p.waitForFunction(
          () => document.querySelector("#logic-panel").dataset.state === "valid",
        );
        assert((await p.locator(".hy-logic-result[data-valid=true]").count()) > 0);
        await p.locator("#logic-panel .hy-advanced-tools button").click();
        await d.locator("input").nth(0).fill("A → B");
        await d.locator("input").nth(1).fill("¬A ∨ B");
        await d.locator("button[type=submit]").click();
        await p.waitForFunction(() =>
          document
            .querySelector(".hy-beta-dialog [role=status]")
            ?.textContent.includes("equivalentes"),
        );
        await d.screenshot({ path: "test-artifacts/beta-compare-" + width + "-" + theme + ".png" });
        await d.locator("input").nth(1).fill("A ∧ B");
        await d.locator("button[type=submit]").click();
        await p.waitForFunction(() =>
          document.querySelector(".hy-beta-dialog [role=status]")?.textContent.includes("diferem"),
        );
        await d.locator("[role=status]").click();
        await p.keyboard.press("Escape");
        if (await d.isVisible()) await p.keyboard.press("Escape");
        await d.waitFor({ state: "detached" });
        assert.equal(await d.count(), 0);
        if (await p.locator(".hy-validation-dialog[open]").count()) await p.locator(".hy-validation-heading button").click();
        await p.locator("#rows>.hy-row").last().locator(".hy-block").last().fill("C");
        await p.locator(".hy-logic-button").click();
        await p.waitForFunction(
          () => document.querySelector("#logic-panel").dataset.state === "invalid",
        );
        const panel = p.locator("#logic-panel");
        await panel.locator(".hy-logic-result details>summary").first().click();
        await panel.locator(".hy-truth-table>summary").click();
        await p.locator(".hy-analysis-inspector-body table tbody tr").first().waitFor();
        await p.waitForTimeout(250);
        await p.locator('.hy-validation-dialog').screenshot({
          path: "test-artifacts/beta-validation-" + width + "-" + theme + ".png",
        });
        assert((await p.locator(".hy-analysis-inspector-body table tbody tr").count()) > 0);
        assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.deepEqual(errors, []);
        console.log(
          width +
            " " +
            theme +
            ": description save/cancel, compare equivalent/different, close/Escape, validation/counterexample/table and viewport PASS",
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
