const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
      
      headless: true,
    }),
    p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
    );
    await p.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await p.goto("https://lp.test");
    await p.waitForTimeout(1200);
    const fields = p.locator("#rows>.hy-row").first().locator(".hy-block");
    await fields.nth(2).focus();
    await fields.nth(2).evaluate((e) => e.setSelectionRange(0, 0));
    await p.keyboard.press("ArrowLeft");
    assert(
      await fields
        .nth(1)
        .evaluate((e) => document.activeElement === e && e.selectionStart === e.value.length),
    );
    await p.keyboard.press("ArrowRight");
    assert(
      await fields.nth(2).evaluate((e) => document.activeElement === e && e.selectionStart === 0),
    );
    await fields.first().fill("ABC");
    await fields.first().evaluate((e) => {
      e.focus();
      e.setSelectionRange(2, 2);
    });
    await p.keyboard.press("ArrowLeft");
    assert(
      await fields.first().evaluate((e) => document.activeElement === e && e.selectionStart === 1),
    );
    await fields.first().evaluate((e) => e.setSelectionRange(0, 0));
    await p.keyboard.press("ArrowLeft");
    assert(await fields.first().evaluate((e) => document.activeElement === e));
    console.log(
      "Arrow navigation crosses both block boundaries; internal caret movement and outer edges preserved. OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
