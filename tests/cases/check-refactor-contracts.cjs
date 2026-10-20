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
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("index.html", "utf8") }),
    );
    await p.goto("https://lp.test");
    assert.equal(
      await p.evaluate(() => document.compatMode),
      "CSS1Compat",
      "Generated page must use standards mode",
    );
    await p.waitForTimeout(900);
    await p.locator(".hy-logic-button").click();
    await p.locator("#logic-panel .hy-advanced-tools").waitFor({ state: "visible" });
    const outcome = await p.evaluate(async () => {
      let calls = 0;
      const original = LPLogic.validate;
      LPLogic.validate = async (...args) => {
        calls++;
        return original(...args);
      };
      try {
        logicEnabled = true;
        await updateLogicValidation();
        const onePass = calls;
        const correct = document.querySelector("#logic-panel").dataset.state === "valid";
        rows = [
          { text: Array.from({ length: 16 }, (_, i) => "P" + i).join(" ∨ "), role: "conclusion" },
        ];
        const stale = updateLogicValidation();
        rows = [
          { text: "A", role: "premise" },
          { text: "B", role: "conclusion" },
        ];
        const fresh = updateLogicValidation();
        await Promise.all([stale, fresh]);
        return {
          onePass,
          correct,
          state: document.querySelector("#logic-panel").dataset.state,
          text: document.querySelector("#logic-panel").textContent,
        };
      } finally {
        LPLogic.validate = original;
      }
    });
    assert.equal(outcome.onePass, 1, "One complete argument evaluation per refresh");
    assert(outcome.correct);
    assert.equal(outcome.state, "invalid", "Latest edit owns the rendered result");
    assert(
      !outcome.text.includes("P15"),
      "Stale asynchronous result must not overwrite newer argument",
    );
    assert(await p.locator("#logic-panel .hy-advanced-tools").isVisible());
    await p.locator('.hy-validation-heading button').click();
    await p.evaluate(() => {
      window.restoreTestStorage = Storage.prototype.setItem;
      Storage.prototype.setItem = function () {
        throw new Error("Blocked storage for regression test");
      };
      saveArguments();
    });
    await p.waitForTimeout(300);
    assert.equal(await p.locator(".hy-save-indicator").getAttribute("data-saved"), "false");
    assert((await p.locator(".hy-save-indicator").textContent()).includes("Could not save"));
    await p.evaluate(() => {
      Storage.prototype.setItem = window.restoreTestStorage;
      delete window.restoreTestStorage;
      saveArguments();
    });
    await p.waitForTimeout(300);
    assert.equal(await p.locator(".hy-save-indicator").getAttribute("data-saved"), "true");
    await p.evaluate(() => {
      const element = document.querySelector(".hy-mod-palette");
      root.dispatchEvent(
        new CustomEvent("lp-set-palette-dock", {
          detail: { id: element.dataset.windowId, docked: false, x: 650, y: 150 },
        }),
      );
    });
    const palette = p.locator(".hy-mod-palette[data-docked=false]").first(),
      grip = palette.locator(".hy-mod-grip");
    const before = await palette.boundingBox();
    await grip.focus();
    await grip.press("ArrowRight");
    await p.waitForTimeout(250);
    const after = await palette.boundingBox();
    assert(after.x > before.x, "Detached grip retains keyboard movement");
    await grip.click();
    assert.equal(await palette.getAttribute("data-collapsed"), "true");
    await grip.click();
    assert.equal(await palette.getAttribute("data-collapsed"), "false");
    assert.deepEqual(errors, []);
    console.log(
      "One-pass validation, asynchronous cancellation, storage failure/recovery and detached keyboard/collapse PASS",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
