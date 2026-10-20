const fs=require("fs"), assert=require("assert/strict");
const {chromium}=require("../browser-runtime.cjs");
(async()=>{
  const b=await chromium.launch({headless:true});
  try {
    const p=await b.newPage({locale:"pt-BR",viewport:{width:1440,height:1100}}), errors=[];
    p.on("pageerror",e=>errors.push(e.message));
    await p.route("https://lp.test/**",r=>r.fulfill({contentType:"text/html",body:fs.readFileSync("../index.html","utf8")}));
    await p.goto("https://lp.test"); await p.waitForTimeout(400);
    await p.evaluate(() => commitArgumentName(argumentWorkspace.activeId, "Save"));
    await p.locator(".hy-proposition-descriptions").click();
    const d=p.locator(".hy-beta-dialog");
    const input=d.locator("input").first(); await input.fill("Save — minha descrição");
    for (const lang of ["en","pt-BR","en","pt-BR"]) {
      await p.evaluate(lang=>{ui.language=lang;applyLanguage();},lang); await p.waitForTimeout(120);
      const en=lang==="en";
      assert.equal(await d.locator("h3").textContent(),en?"Proposition descriptions":"Descrição das proposições");
      assert.equal(await input.getAttribute("placeholder"),en?"E.g. It is raining":"Ex.: Está chovendo");
      assert.equal(await input.inputValue(),"Save — minha descrição");
      assert.equal(await p.locator('.hy-argument-tab[aria-selected="true"]').textContent(), "Save");
      assert(await d.getByRole("button",{name:en?"Save":"Salvar",exact:true}).isVisible());
      await d.screenshot({path:`test-artifacts/live-language-${lang}.png`});
    }
    await d.getByRole("button",{name:"Cancelar",exact:true}).click();
    const geometry=await p.evaluate(()=>{const side=document.querySelector('.hy-modular-library > .hy-side'), b=side.getBoundingClientRect(), picker=side.querySelector('.hy-card-picker').getBoundingClientRect(), last=side.querySelector('.hy-mod-symbols').lastElementChild.getBoundingClientRect();return {top:picker.top-b.top,bottom:b.bottom-last.bottom};});
    assert(Math.abs(geometry.top-geometry.bottom)<1,JSON.stringify(geometry));
    assert.deepEqual(errors,[]);
    console.log("Live dialog text, placeholders and buttons switch both directions; user input preserved; visible category margins balanced: "+JSON.stringify(geometry));
  } finally {await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

