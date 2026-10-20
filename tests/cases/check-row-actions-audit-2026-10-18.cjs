const fs = require("fs"),
  assert = require("node:assert/strict");
const { chromium } = require("../browser-runtime.cjs");
const html = fs.readFileSync("index.html", "utf8");
(async () => {
  const browser = await chromium.launch({
    
    headless: true,
  });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } }),
      errors = [];
    await context.addInitScript(() => {
      if (localStorage.getItem("test-seeded")) return;
      localStorage.setItem("test-seeded", "yes");
      localStorage.setItem(
        "formal-argument-ui",
        JSON.stringify({
          language: "en",
          theme: "light",
          holdDelaySeconds: 0.3,
          hoverDelaySeconds: 0.5,
          panelAppearance: {
            editor: { detail: "recess", external: true, border: false },
            preview: { detail: "none", external: true, border: false },
          },
        }),
      );
      localStorage.setItem(
        "formal-arguments-v1",
        JSON.stringify({
          documents: [
            {
              id: "first",
              customName: "Test",
              name: "Test",
              rows: [
                { text: "A → B", role: "premise" },
                { text: "¬ B", role: "premise" },
                { text: "¬ A", role: "conclusion" },
              ],
              numbered: true,
            },
            {
              id: "second",
              name: "Keep",
              customName: "Keep",
              rows: [{ text: "Q", role: "premise" }],
              numbered: true,
            },
          ],
          activeId: "first",
          nextNumber: 3,
        }),
      );
    });
    await context.route("https://lp.test/**", (route) =>
      route.fulfill({ contentType: "text/html", body: html }),
    );
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await page.goto("https://lp.test/");
    await page.waitForTimeout(850);
    assert.deepEqual(errors, []);
    const row = page.locator("#rows>.hy-row").first(),
      first = row.locator(".hy-block").first(),
      last = row.locator(".hy-block").last();
    await first.click();
    assert(await first.evaluate((e) => e === document.activeElement));
    await page.keyboard.press("Control+a");
    await page.keyboard.type("C");
    assert.equal(await first.inputValue(), "C");
    assert.equal(await last.inputValue(), "B");
    assert((await page.locator("#preview").textContent()).includes("C → B"));
    console.log("Earlier block editing by real click/typing: OK");
    const prefix = page.locator("#compact-prefix-spacing");
    assert.equal(await prefix.evaluate((e) => e.previousElementSibling.id), "number-toggle");
    assert((await page.locator("#preview").textContent()).includes("¬ B"));
    await prefix.click();
    assert((await page.locator("#preview").textContent()).includes("¬B"));
    assert.equal(await page.evaluate(() => rows[1].text), "¬ B");
    assert.equal(await page.evaluate(() => formatPrefixSpacing("∀ x ∃ y ¬ P → Q")), "∀x ∃y ¬P → Q");
    assert.equal(
      await page.evaluate(() => argument()),
      await page.locator("#preview").textContent(),
    );
    await page.reload();
    await page.waitForTimeout(850);
    assert.equal(await prefix.getAttribute("aria-pressed"), "true");
    console.log("Prefix spacing, numbering adjacency, data preservation and persistence: OK");
    const handle = page.locator(".hy-editor .hy-inner-appearance-handle"),
      offset = () =>
        page.locator(".hy-editor").evaluate((e) => e.style.getPropertyValue("--detail-offset"));
    assert.equal(await handle.evaluate((e) => getComputedStyle(e).pointerEvents), "none");
    const box = await handle.boundingBox();
    await page.mouse.move(box.x + 10, box.y + 20);
    await page.waitForTimeout(250);
    assert.equal(
      await page.locator("#decoration-alt-hint").evaluate((e) => e.matches(":popover-open")),
      false,
    );
    await page.waitForTimeout(320);
    assert(await page.locator("#decoration-alt-hint").evaluate((e) => e.matches(":popover-open")));
    await page.keyboard.down("Alt");
    assert.equal(await handle.evaluate((e) => getComputedStyle(e).pointerEvents), "auto");
    await page.mouse.down();
    await page.mouse.move(box.x + 20, box.y + 20, { steps: 4 });
    await page.mouse.up();
    await page.keyboard.up("Alt");
    assert.equal(await offset(), "10px");
    assert.equal(await handle.evaluate((e) => getComputedStyle(e).pointerEvents), "none");
    console.log("Alt drag and 0.5-second stationary hint: OK");
    await page.evaluate(() => {
      ui.panelAppearance.editor.detail = "none";
      root.dispatchEvent(new Event("lp-ui-colors"));
    });
    await page.mouse.move(1300, 1000);
    await page.mouse.move(box.x + 10, box.y + 20);
    await page.waitForTimeout(600);
    assert.equal(
      await page.locator("#decoration-alt-hint").evaluate((e) => e.matches(":popover-open")),
      false,
    );
    assert.equal(await handle.evaluate((e) => getComputedStyle(e).display), "none");
    await page.keyboard.down("Alt");
    assert.equal(await handle.evaluate((e) => getComputedStyle(e).display), "none");
    await page.keyboard.up("Alt");
    await page.evaluate(() => {
      ui.panelAppearance.editor.detail = "recess";
      root.dispatchEvent(new Event("lp-ui-colors"));
    });
    console.log("None disables both decoration hit area and hint, including with Alt: OK");
    await page.locator("#rows>.hy-row").first().hover();
    let trash = page.locator("#rows>.hy-row").first().locator(".hy-delete-line");
    await trash.click({ delay: 350, position: { x: 6, y: 18 } });
    await page.waitForTimeout(150);
    assert(await page.locator("[data-delete-all]").isVisible());
    assert.equal(await page.locator("#rows>.hy-line-selected").count(), 3);
    assert.equal(await page.locator("#rows>.hy-row").count(), 3);
    await page.screenshot({ path: "test-artifacts/audit-delete-all.png" });
    await page.locator("[data-delete-all] button").first().click();
    assert.equal(await page.locator("#rows>.hy-row").count(), 3);
    assert.equal(await page.locator("#lp-hybrid").getAttribute("data-select-lines"), "true");
    console.log("Delete hold: selection before confirmation and Cancel restore: OK");
    await page.waitForTimeout(400);
    await page.locator("#rows>.hy-row").first().hover();
    await trash.click({ delay: 350, position: { x: 6, y: 18 } });
    await page.waitForTimeout(150);
    await page.locator("[data-delete-all] .hy-delete-confirm").click();await page.waitForFunction(()=>rows.length===1);
    assert.equal(await page.locator("#rows>.hy-row").count(), 1);
    assert.equal(await page.locator("#rows .hy-block").first().inputValue(), "");
    await page.locator(".hy-undo-lines").click();
    assert.equal(await page.locator("#rows>.hy-row").count(), 3);
    await page.locator(".hy-argument-tab").filter({ hasText: "Keep" }).click();
    assert.equal(await page.locator("#rows .hy-block").first().inputValue(), "Q");
    await page.locator(".hy-argument-tab").filter({ hasText: "Test" }).click();
    await page.locator("#rows>.hy-row").first().hover();
    await trash.click({ position: { x: 6, y: 18 } });
    assert(await page.locator("#delete-dialog").isVisible());
    assert.equal(await page.locator("[data-delete-all]").count(), 0);
    await page.locator("#delete-dialog [data-delete-cancel]").last().click();
    console.log("Confirm all + undo, second argument preserved, short delete still works: OK");
    assert.deepEqual(errors, []);
    await page.setViewportSize({ width: 390, height: 850 });
    await page.waitForTimeout(350);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    console.log("No browser exceptions or page overflow at 390px.");
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.locator("[data-action=editor]").click({ delay: 350 });
    await page.locator(".hy-panel-appearance-dialog [data-close]").click();
    await page.waitForTimeout(400);
    assert.equal(await page.locator("[data-action=editor]").getAttribute("aria-expanded"), "true");
    await page.evaluate(() => {
      ui.theme = "dark";
      applyUI();
    });
    await page.locator("#rows>.hy-row").first().hover();
    await page.waitForTimeout(300);
    const r = await page.locator("#rows>.hy-row").first().boundingBox();
    await page.mouse.move(r.x + r.width - 30, r.y + 25);
    await page.mouse.down();
    await page.mouse.move(r.x + r.width - 30, r.y + 75, { steps: 5 });
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".drag-ghost.lifted").count(), 1);
    await page.mouse.up();
    await page.waitForTimeout(400);
    assert.equal(await page.locator("[data-delete-all]").count(), 0);
    assert.deepEqual(errors, []);
    console.log("Panel appearance hold and floating row drag preserved in dark mode: OK");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
