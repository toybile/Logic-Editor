const {launch,assert,fs}=require('../mobile-runtime.cjs');
(async()=>{const b=await launch();try{
 const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('index.html','utf8')}));
 await p.goto('https://lp.test');
 async function defaults(){assert.equal(await p.locator('#writing-mode-toggle').getAttribute('aria-pressed'),'true');assert.equal(await p.locator('#caps-lock').getAttribute('aria-pressed'),'false');assert((await p.locator('.hy-continuous-field').count())>0);}
 await defaults();
 await p.locator('.hy-continuous-field').first().fill('abc');
 assert.equal(await p.locator('.hy-continuous-field').first().inputValue(),'abc');
 await p.locator('#writing-mode-toggle').click();await p.locator('#caps-lock').click();
 await p.reload();
 assert.equal(await p.locator('#writing-mode-toggle').getAttribute('aria-pressed'),'false');
 assert.equal(await p.locator('#caps-lock').getAttribute('aria-pressed'),'true');
 await p.evaluate(()=>document.querySelector('#editor-settings').showPopover());
 await p.locator('#settings-default').click();
 await p.locator('#default-settings-confirmation .hy-default-actions button').last().click();
 await defaults();await p.reload();await defaults();
 console.log('Desktop first visit, preserved choices and reset defaults passed');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

