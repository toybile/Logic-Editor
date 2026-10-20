const fs = require("fs"),
  assert = require("node:assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    async function context(seed) {
      const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
      if (seed) await c.addInitScript(seed);
      await c.route("https://lp.test/**", (r) =>
        r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
      );
      return c;
    }
    const fresh = await context(),
      p = await fresh.newPage(),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("https://lp.test/");
    await p.waitForTimeout(850);
    assert.equal(await p.evaluate(() => LPReturningUser), false);
    assert.equal(await p.evaluate(() => getHoverDelay()), 500);
    assert.equal(await p.evaluate(() => getHoldDelay()), 500);
    assert.equal(await p.evaluate(() => ui.language), "en");
    assert.equal(await p.locator("#caps-lock").getAttribute("aria-pressed"), "false");
    assert.equal(await p.locator("#compact-prefix-spacing").getAttribute("aria-pressed"), "true");
    assert.equal(await p.locator("#lp-hybrid").getAttribute("data-role-display"), "names");
    assert.equal(await p.locator("#number-toggle").getAttribute("aria-pressed"), "true");
    assert.equal(
      await p.evaluate(() => getComputedStyle(root).getPropertyValue("--writing-scale").trim()),
      "1",
    );
    assert(!(await p.locator("#editor-settings").evaluate((e) => e.matches(":popover-open"))));
    await p.reload();
    await p.waitForTimeout(850);
    assert.equal(await p.locator("#caps-lock").getAttribute("aria-pressed"), "false");
    console.log("New visitor defaults and subsequent reload: OK");
    const old = await context(() => {
      if (localStorage.getItem("seeded")) return;
      localStorage.setItem("seeded", "yes");
      localStorage.setItem(
        "formal-argument-ui",
        JSON.stringify({
          language: "pt-BR",
          theme: "dark",
          hoverDelaySeconds: 0.11,
          holdDelaySeconds: 0.8,
          hoverHintsEnabled: false,
          roleDisplay: "both",
          compactPrefixSpacing: false,
          premiseColor: "#a28aad",
          conclusionColor: "#ba9971",
        }),
      );
      localStorage.setItem("formal-size-library", "130");
      localStorage.setItem("formal-size-writing", "140");
      localStorage.setItem("formal-caps-lock", "false");
      localStorage.setItem(
        "formal-arguments-v1",
        JSON.stringify({
          documents: [
            {
              id: "kept",
              name: "Argumento 1",
              customName: "Meu argumento",
              rows: [{ text: "Q → R", role: "premise" }],
              numbered: false,
              descriptions: { Q: "Texto guardado" },
            },
          ],
          activeId: "kept",
          nextNumber: 2,
        }),
      );
    });
    const q = await old.newPage();
    q.on("pageerror", (e) => errors.push(e.message));
    await q.goto("https://lp.test/");
    await q.waitForTimeout(850);
    assert.equal(await q.evaluate(() => getHoverDelay()), 110);
    assert.equal(await q.evaluate(() => getHoldDelay()), 800);
    assert.equal(await q.locator("#caps-lock").getAttribute("aria-pressed"), "false");
    assert.equal(await q.locator("#lp-hybrid").getAttribute("data-role-display"), "both");
    assert.equal(
      await q.evaluate(() => getComputedStyle(root).getPropertyValue("--writing-scale").trim()),
      "1.4",
    );
    const before = await q.evaluate(() => JSON.stringify(argumentWorkspace.documents));
    const settings = q.locator("[popovertarget=editor-settings]").first();
    await settings.click();
    await q.locator("#settings-default").click();
    const dialog = q.locator("#default-settings-confirmation");
    assert((await dialog.locator("[role=switch]").count()) >= 20);
    assert((await dialog.textContent()).includes("0,5 s"));
    assert((await dialog.textContent()).includes("100%"));
    for (const key of ["theme", "hint-delay", "uppercase", "numbering", "colors", "layout"])
      await dialog.locator('[data-reset-key="' + key + '"]').check();
    await dialog.locator("button").last().click();
    assert.equal(await q.evaluate(() => ui.theme), "dark");
    assert.equal(await q.evaluate(() => getHoverDelay()), 110);
    assert.equal(await q.evaluate(() => getHoldDelay()), 500);
    assert.equal(await q.evaluate(() => ui.language), "en");
    assert.equal(await q.locator("#caps-lock").getAttribute("aria-pressed"), "false");
    assert.equal(await q.locator("#number-toggle").getAttribute("aria-pressed"), "false");
    assert.equal(await q.evaluate(() => ui.premiseColor), "#a28aad");
    assert.equal(await q.locator("#compact-prefix-spacing").getAttribute("aria-pressed"), "true");
    assert.equal(await q.locator("#scale-writing").inputValue(), "100");
    assert.equal(await q.evaluate(() => JSON.stringify(argumentWorkspace.documents)), before);
    console.log(
      "Returning visitor preserved; selective reset honors exclusions and keeps argument content: OK",
    );
    await q.locator("#settings-default").click();
    for (const item of await dialog.locator("[role=switch]").all()) await item.check();
    assert(await dialog.locator("button").last().isDisabled());
    await dialog.locator("button").first().click();
    await q.locator("#settings-default").click();
    await dialog.locator("button").last().click();
    assert.equal(await q.evaluate(() => ui.theme), "light");
    assert.equal(await q.evaluate(() => getHoverDelay()), 500);
    assert.equal(await q.locator("#caps-lock").getAttribute("aria-pressed"), "false");
    assert.equal(await q.locator("#number-toggle").getAttribute("aria-pressed"), "true");
    assert.equal(await q.locator(".hy-panel-board").getAttribute("data-manual"), "false");
    assert.equal(await q.evaluate(() => argumentWorkspace.documents[0].rows[0].text), "Q → R");
    assert.equal(
      await q.evaluate(() => argumentWorkspace.documents[0].descriptions.Q),
      "Texto guardado",
    );
    await q.reload();
    await q.waitForTimeout(850);
    assert.equal(await q.evaluate(() => getHoldDelay()), 500);
    assert.equal(await q.locator("#caps-lock").getAttribute("aria-pressed"), "false");
    await settings.click();
    await q.locator("#settings-default").click();
    await q.setViewportSize({ width: 390, height: 850 });
    await q.waitForTimeout(250);
    assert(await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert(await dialog.locator(".hy-reset-body").evaluate((e) => e.scrollHeight > e.clientHeight));
    assert(await dialog.locator(".hy-reset-head").isVisible());
    assert(await dialog.locator(".hy-default-actions").isVisible());
    await q.screenshot({ path: "test-artifacts/selective-reset-mobile.png" });
    assert.deepEqual(errors, []);
    console.log(
      "Full reset, all-preserved state, persistence, argument safety and mobile dialog: OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
