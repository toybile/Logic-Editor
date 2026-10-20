const fs = require("fs"),
  assert = require("assert/strict"),
  { chromium } = require("../browser-runtime.cjs");
(async () => {
  const b = await chromium.launch({
    
    headless: true,
  });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1100 } }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.route("https://lp.test/**", (r) =>
      r.fulfill({ contentType: "text/html", body: fs.readFileSync("../index.html", "utf8") }),
    );
    await p.addInitScript(() => { const state = JSON.parse(localStorage.getItem('formal-argument-ui') || '{}'); state.writingMode = 'blocks'; state.language ??= /^pt/i.test(navigator.language) ? 'pt-BR' : 'en'; localStorage.setItem('formal-argument-ui', JSON.stringify(state)); if (!localStorage.getItem('formal-arguments-v1')) localStorage.setItem('formal-arguments-v1', JSON.stringify({documents:[{id:'fixture',name:'Argument 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'fixture',nextNumber:2})); });
    await p.goto("https://lp.test");
    await p.waitForTimeout(1200);
    await p.locator("#rows .hy-block").first().focus();
    const symbol = p.locator(".hy-symbol-dock-stack .hy-symbol").first(),
      cell = await symbol.locator("..").getAttribute("data-modular-symbol");
    await symbol.click({ modifiers: ["Alt"], position: { x: 8, y: 11 } });
    assert(await p.evaluate((s) => LPModularLibrary.state.favorites.includes(s), cell));
    const wave = p
      .locator(".hy-symbol-dock-stack .hy-library-wave[data-favorite=true] span")
      .first();
    assert(await wave.count());
    const surface = await symbol.evaluate((e) => getComputedStyle(e).backgroundColor);
    await p.mouse.move(1400, 1000);
    const base = await symbol.evaluate((e) => getComputedStyle(e).backgroundColor);
    assert.equal(surface, base);
    await symbol.hover();
    assert(Math.abs(parseFloat(await wave.evaluate((e) => e.style.left)) - 8) < 2);
    assert(Math.abs(parseFloat(await wave.evaluate((e) => e.style.top)) - 11) < 2);
    await p.waitForTimeout(800);
    assert.notEqual(await symbol.evaluate((e) => getComputedStyle(e).backgroundColor), base);
    await symbol.click({ position: { x: 17, y: 20 } });
    const normal = p
      .locator(".hy-symbol-dock-stack .hy-library-wave[data-favorite=false] span")
      .first();
    assert(await normal.count());
    assert(Math.abs(parseFloat(await normal.evaluate((e) => e.style.left)) - 17) < 2);
    await p.waitForTimeout(800);
    await symbol.click({ modifiers: ["Alt"] });
    assert.equal(
      await p.evaluate((s) => LPModularLibrary.state.favorites.includes(s), cell),
      false,
    );
    assert.deepEqual(errors, []);
    console.log(
      "Alt-click toggles favorite; favorite/normal waves originate at actual click coordinates. OK",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
