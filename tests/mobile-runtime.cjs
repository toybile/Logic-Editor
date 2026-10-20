const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require('./browser-runtime.cjs');
const launch=()=>chromium.launch({headless:true});
async function open(browser,width=390,height=844,language='en') {
 const c=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1,locale:language,reducedMotion:'reduce',acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
 const p=await c.newPage(),errors=[];p.setDefaultTimeout(10000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(language=>{
  if(!localStorage.getItem('formal-argument-ui'))localStorage.setItem('formal-argument-ui',JSON.stringify({language,holdDelaySeconds:.15,writingMode:'blocks'}));
  if(!localStorage.getItem('formal-arguments-v1'))localStorage.setItem('formal-arguments-v1',JSON.stringify({documents:[{id:'mobile-test',name:'Argumento 1',rows:[{text:'A → B',role:'premise'},{text:'A',role:'premise'},{text:'B',role:'conclusion'}],descriptions:{},numbered:true}],activeId:'mobile-test',nextNumber:2}));
 },language);
 await p.route('https://lp.test/**',r=>r.fulfill({contentType:'text/html',body:fs.readFileSync('index.html','utf8')}));
 await p.goto('https://lp.test');await p.waitForTimeout(250);
 const session=await c.newCDPSession(p);
 async function gesture(locator,dx=0,dy=0,hold=0) {
  await locator.scrollIntoViewIfNeeded();const r=await locator.boundingBox();assert(r);
  const x=r.x+r.width/2,y=r.y+r.height/2;
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  if(hold)await p.waitForTimeout(hold);
  if(dx||dy)for(let i=1;i<=12;i++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/12,y:y+dy*i/12}]});await p.waitForTimeout(15);}
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(120);
 }
 async function fits(selector) {
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page width');
  if(selector){const r=await p.locator(selector).boundingBox();assert(r&&r.x>=-1&&r.x+r.width<=width+1&&r.y>=-1&&r.y+r.height<=height+1,selector+' viewport '+JSON.stringify(r));}
 }
 return {p,c,errors,gesture,fits,session};
}
module.exports={launch,open,assert,fs};
