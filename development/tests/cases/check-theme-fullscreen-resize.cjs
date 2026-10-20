const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('../browser-runtime.cjs');
(async()=>{const b=await chromium.launch({headless:true});try{
const p=await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('../index.html','utf8')}));await p.goto('https://lp.test');
for(const theme of ['light','dark','indigo-light','indigo-dark','petroleum','graphite','sand','sage']){
await p.setViewportSize({width:1440,height:900});await p.evaluate(t=>{ui.theme=t;applyUI();const element=document.querySelector('.hy-mod-palette');root.dispatchEvent(new CustomEvent('lp-displace-window',{detail:{element,dx:0,dy:0}}))},theme);
for(const size of [{width:1920,height:1080},{width:1440,height:1200},{width:1440,height:900}]){await p.setViewportSize(size);await p.waitForTimeout(80);assert(await p.evaluate(()=>root.getBoundingClientRect().bottom>=innerHeight-1),'background covers resized/fullscreen viewport for '+theme);assert.equal(await p.evaluate(()=>ui.theme),theme);}
if(theme==='indigo-light')await p.screenshot({path:'test-artifacts/fullscreen-theme-background.png'});
}
assert.deepEqual(errors,[]);console.log('All 8 themes cover viewport after 900→1080→1200→900px height changes, including manual library extent; theme choice retained and no script errors');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
