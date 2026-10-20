const fs = require("fs"),
  assert = require("node:assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
    downloadsPath: require("path").resolve("test-artifacts/audit-downloads"),
  });
  try {
    const c = await b.newContext({
        acceptDownloads: true,
        viewport: { width: 1440, height: 1000 },
      }),
      p = await c.newPage(),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
    );
    await p.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await p.goto("https://lp.test");
    await p.waitForTimeout(1300);
    const snapshot = () => p.evaluate(() => JSON.stringify(rows));
    const initial = await snapshot();
    await p.locator(".hy-symbol-dock-stack .hy-mod-palette .hy-symbol").first().click();
    assert.notEqual(await snapshot(), initial);
    await p.locator(".hy-undo-lines").click();
    assert.equal(await snapshot(), initial);
    await p.locator(".hy-redo-lines").click();
    assert.notEqual(await snapshot(), initial);
    await p.locator(".hy-undo-lines").click();
    await p.locator(".hy-role").last().click();
    assert.equal(await p.locator(".hy-role").last().getAttribute("aria-pressed"), "false");
    await p.locator(".hy-undo-lines").click();
    assert.equal(await snapshot(), initial);
    await p.locator(".hy-redo-lines").click();
    await p.locator(".hy-undo-lines").click();
    await p.locator(".hy-role").first().click({ delay: 600 });
    await p.waitForTimeout(100);
    assert(
      await p
        .locator(".hy-row")
        .first()
        .evaluate((e) => e.classList.contains("hy-blank-line")),
    );
    await p.locator(".hy-undo-lines").click();
    assert.equal(await snapshot(), initial);
    console.log(
      "Symbols, role changes and held blank-row actions undo/redo with exact row restoration: OK",
    );
    const firstId = await p.evaluate(() => argumentWorkspace.activeId);
    await p.locator("#new-argument").click();
    await p.getByRole("button", { name: "Blank", exact: true }).click();
    await p.locator(".hy-block").first().fill("Q");
    const secondId = await p.evaluate(() => argumentWorkspace.activeId);
    await p.locator("#tab-" + firstId).click();
    assert.equal(await snapshot(), initial);
    await p.locator("#tab-" + secondId).click();
    assert.equal(await p.locator(".hy-block").first().inputValue(), "Q");
    await p.reload();
    await p.waitForTimeout(1300);
    assert.equal(await p.locator(".hy-block").first().inputValue(), "Q");
    console.log("Arguments remain independent and persist after switching/reload: OK");
    await p.locator("#tab-" + firstId).click();
    for (const extension of [".txt", ".pdf"]) {
      await p.locator("#download").click();
      const waiting = p.waitForEvent("download");
      await p.locator("#export-formats button").filter({ hasText: extension.slice(1).toUpperCase() }).click();
      const download = await waiting,
        bytes = fs.readFileSync(await download.path());
      if (extension === ".txt") assert(bytes.toString("utf8").includes("A → B"));
      else {
        assert.equal(bytes.subarray(0, 8).toString(), "%PDF-1.4");
        assert(bytes.toString("latin1").includes("%%EOF"));
      }
    }
    console.log("TXT and PDF downloads have expected content/signatures: OK");
    const docs = await p.evaluate(() => JSON.stringify(argumentWorkspace.documents));
    const file = p.locator(".hy-workspace-tools input[type=file]");
    await file.setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from("{broken"),
    });
    await p.getByRole("button", { name: "OK", exact: true }).click();
    assert.equal(await p.evaluate(() => JSON.stringify(argumentWorkspace.documents)), docs);
    await file.setInputFiles({
      name: "test.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          format: "lp-workspace",
          version: 1,
          documents: [
            {
              id: "imported",
              customName: "Imported test",
              numbered: true,
              rows: [{ text: "R", role: "conclusion" }],
              descriptions: { R: "Imported description" },
            },
          ],
        }),
      ),
    });
    await p.getByRole("button", { name: "Import selected", exact: true }).click();await p.waitForFunction(()=>rows[0]?.text==="R");
    assert.equal(await p.locator(".hy-block").first().inputValue(), "R");
    assert.equal(
      await p.evaluate(() => argumentWorkspace.documents.at(-1).descriptions.R),
      "Imported description",
    );
    assert.equal(await p.evaluate(() => argumentWorkspace.documents.length), 3);
    console.log(
      "Malformed import preserves content; valid import keeps existing documents and descriptions: OK",
    );
    assert.deepEqual(errors, []);
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
