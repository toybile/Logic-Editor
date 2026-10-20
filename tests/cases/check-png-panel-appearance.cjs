const {launch,open,assert,fs}=require('../mobile-runtime.cjs');
(async()=>{const b=await launch();try{
 const {p,c,errors}=await open(b,1440,1100);
 await p.waitForTimeout(850);
 const cases=['light','dark','indigo-light','indigo-dark','petroleum','graphite','sand','sage'].map(theme=>({theme,custom:false}));
 cases.push({theme:'indigo-light',custom:true});
 for(const {theme,custom} of cases){
  await p.evaluate(({theme,custom})=>{
   ui.theme=theme;
   if(custom){
    rows=[{text:'∃x(F(x) ∧ I(x)) ∧ ∃x(F(x) ∨ ¬I(x))',role:'premise'},{text:'∃x(F(x) ∧ (I(x) ⊕ ¬I(x)))',role:'premise'},{text:'¬Q',role:'conclusion'}];
    numbered=false;ui.compactPrefixSpacing=true;
    ui.panelAppearance.preview={detail:'recess',external:true,border:true};
    drawRows();render();
   }
   applyUI();
  },{theme,custom});await p.waitForTimeout(100);
  await p.locator('#download').click();const pending=p.waitForEvent('download');await p.locator('#export-formats').getByRole('button',{name:'.png',exact:true}).click();const file=await pending;
  assert.equal(await file.failure(),null);const png=fs.readFileSync(await file.path());
  await p.mouse.move(0,0);await p.locator('#download').waitFor({state:'visible'});
  const bounds=await p.locator('.hy-argument-panel').boundingBox(),clip={x:bounds.x-24,y:bounds.y-24,width:Math.ceil(bounds.width+48),height:Math.ceil(bounds.height+48)};
  const actual=await p.screenshot({clip,scale:'css'});
  assert.equal(png.readUInt32BE(16),clip.width*2);assert.equal(png.readUInt32BE(20),clip.height*2);
  const label=theme+(custom?'-custom':'');
  fs.writeFileSync('test-artifacts/panel-png-'+label+'.png',png);fs.writeFileSync('test-artifacts/panel-screen-'+label+'.png',actual);
  const difference=await p.evaluate(async([exported,screen,width,height])=>{
    async function pixels(base64){const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src='data:image/png;base64,'+base64});const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,width,height);return ctx.getImageData(0,0,width,height).data;}
    const a=await pixels(exported),b=await pixels(screen);let sum=0,changed=0;for(let i=0;i<a.length;i+=4){let delta=0;for(let c=0;c<3;c++){sum+=Math.abs(a[i+c]-b[i+c]);delta=Math.max(delta,Math.abs(a[i+c]-b[i+c]));}if(delta>25)changed++;}return{mean:sum/(width*height*3),changed:changed/(width*height)};
  },[png.toString('base64'),actual.toString('base64'),clip.width,clip.height]);
  console.log(theme,JSON.stringify(difference));assert(difference.mean<2&&difference.changed<.025,'capture resembles actual panel '+theme);
 }
 assert.deepEqual(errors,[]);await c.close();
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
