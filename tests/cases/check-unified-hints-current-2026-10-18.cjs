const fs = require("fs"),
  assert = require("node:assert/strict");
const { chromium } = require("../browser-runtime.cjs");
(async () => {
  const browser = await chromium.launch({
    
    headless: true,
  });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } }),
      errors = [];
    await context.addInitScript(() => {
      localStorage.setItem(
        "formal-argument-ui",
        JSON.stringify({
          language: "en",
          theme: "light",
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
              id: "test",
              name: "Test",
              customName: "Test",
              descriptions: { A: "It is raining." },
              rows: [
                { text: "A → B", role: "premise" },
                { text: "A", role: "premise" },
                { text: "B", role: "conclusion" },
              ],
              numbered: true,
            },
          ],
          activeId: "test",
          nextNumber: 2,
        }),
      );
    });
    await context.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }),
    );
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await page.goto("https://lp.test/");
    await page.waitForTimeout(850);
    assert.deepEqual(errors, []);
    assert.equal(await page.locator("body [title]").count(), 0);
    const tip = page.locator("#lp-shared-hover-hint");
    await page.locator("#number-toggle").hover();
    await page.waitForTimeout(600);
    assert(await tip.evaluate((e) => e.matches(":popover-open")));
    assert.equal(await tip.locator(".lp-hint-heading").textContent(), "Line numbering");
    assert.equal(await tip.evaluate((e) => getComputedStyle(e).borderRadius), "15px");
    await tip.screenshot({ path: "test-artifacts/shared-hint-numbering.png" });
    await page.locator("#number-toggle").click();
    assert.equal(await tip.evaluate((e) => e.matches(":popover-open")), false);
    assert.equal(await page.locator("#number-toggle").getAttribute("aria-pressed"), "false");
    console.log("Native titles replaced; numbering hint styled; click preserved.");
    await page.locator("#rows .hy-block").first().hover();
    await page.waitForTimeout(600);
    assert((await tip.locator(".lp-hint-body").textContent()).includes("It is raining."));
    assert.equal(await tip.locator(".lp-hint-heading>span").last().textContent(), "A");
    await page.locator("#rows .hy-block").nth(1).hover();
    await page.waitForTimeout(600);
    assert((await tip.locator("kbd").count()) >= 6);
    assert((await tip.textContent()).includes("Space"));
    await tip.screenshot({ path: "test-artifacts/shared-hint-edit-block.png" });
    console.log("Proposition descriptions and keyboard shortcuts preserved.");
    await page.locator("[popovertarget=editor-settings]").first().click();
    await page.locator("#settings-functionalities-tab").click();
    await page.locator("#hover-hints-toggle").hover();
    await page.waitForTimeout(600);
    assert((await tip.textContent()).includes("Hover hints"));
    assert((await tip.textContent()).includes("explanations"));
    await tip.screenshot({ path: "test-artifacts/shared-hint-appearance.png" });
    const tipBox = await tip.boundingBox();
    assert(tipBox.x >= 0 && tipBox.x + tipBox.width <= 1440);
    await page.locator("#settings-language").click();
    await page.locator("#settings-functionalities-tab").click();
    await page.locator("#hover-hints-toggle").hover();
    await page.waitForTimeout(600);
    assert((await tip.textContent()).includes("explicações"));
    await page.locator("[popovertargetaction=hide]").click();
    console.log("Appearance-help hint shared, top-layer and bilingual.");
    const symbol = page
      .locator(".hy-symbol-dock-stack .hy-symbol-cell .hy-symbol")
      .filter({ hasText: "¬" })
      .first();
    await symbol.hover();
    await page.waitForTimeout(650);
    const notation = page.locator("#notation-panel");
    assert(await notation.evaluate((e) => e.matches(":popover-open")));
    assert(await notation.evaluate((e) => e.classList.contains("lp-styled-hover")));
    assert.equal(await notation.locator(".lp-hint-icon").textContent(), "¬");
    assert.equal(await notation.evaluate((e) => getComputedStyle(e).borderRadius), "15px");
    await notation.screenshot({ path: "test-artifacts/shared-hint-symbol.png" });
    assert.equal(await tip.evaluate((e) => e.matches(":popover-open")), false);
    await notation.locator(".hy-notation-choice").first().click();
    assert.equal(await notation.evaluate((e) => e.matches(":popover-open")), false);
    console.log("Symbol hover matches styling; alternative notation remains clickable.");
    await page.locator("[popovertarget=editor-settings]").first().click();
    await page.locator("#settings-appearance-tab").click();
    await page.locator("[data-theme-value=dark]").click();
    await page.locator("#settings-functionalities-tab").click();
    await page.locator("#hover-hints-toggle").hover();
    await page.waitForTimeout(600);
    assert(await tip.evaluate((e) => e.matches(":popover-open")));
    await tip.screenshot({ path: "test-artifacts/shared-hint-dark.png" });
    await page.locator("[popovertargetaction=hide]").click();
    await page.locator("[data-action=editor]").click({ delay: 600 });
    assert(await page.locator(".hy-panel-appearance-dialog").isVisible());
    await page.locator(".hy-panel-appearance-dialog [data-close]").hover();
    await page.waitForTimeout(600);
    assert(await tip.evaluate((e) => e.matches(":popover-open")));
    await page.locator(".hy-panel-appearance-dialog [data-close]").click();
    console.log("Theme switching and hints above modal dialogs: OK.");
    await page.setViewportSize({ width: 320, height: 800 });
    await page.locator("#number-toggle").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.mouse.move(0, 0);
    await page.locator("#number-toggle").hover();
    await page.waitForTimeout(650);
    const narrow = await tip.boundingBox();
    assert(narrow.x >= 0 && narrow.x + narrow.width <= 320);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.keyboard.press("Escape");
    assert.equal(await tip.evaluate((e) => e.matches(":popover-open")), false);
    assert.deepEqual(errors, []);
    assert.equal(await page.locator("body [title]").count(), 0);
    console.log("320px placement, Escape dismissal, dynamic titles and browser errors: OK.");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
