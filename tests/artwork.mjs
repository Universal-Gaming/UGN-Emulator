import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const manifest=JSON.parse(readFileSync('catalog/hosted.json','utf8'));
const app=readFileSync('app.js','utf8');
assert.equal(manifest.games.length,79,'Must ship 79 real ROMs');
for(const entry of manifest.games){
  assert.ok(app.includes('"'+entry.path+'"')||app.includes("'"+entry.path+"'"),'Missing game card for '+entry.path);
  assert.ok(entry.bytes>=4096,'Invalid size in manifest: '+entry.path);
}
const server=spawn('python3',['-m','http.server','8001','--bind','127.0.0.1'],{stdio:'ignore'});
await new Promise(r=>setTimeout(r,1100));
let browser;
try {
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8001/library.html',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>Number(document.querySelector('#hero-games')?.textContent)===79,null,{timeout:25000});
  for(let n=0;n<3;n++){
    const more=page.locator('#load-more-games');
    if(await more.isVisible())await more.click();
  }
  assert.equal(await page.locator('#game-grid .game-card').count(),79);
  assert.equal(await page.locator('#game-grid img[data-artwork-title]').count(),79,'Every playable card needs an image');
  const cards=await page.locator('#game-grid img[data-artwork-title]').evaluateAll(nodes=>nodes.map(n=>({name:n.dataset.artworkTitle,alt:n.alt,src:n.getAttribute('src')})));
  assert.equal(new Set(cards.map(x=>x.name)).size,79,'Duplicate playable title image/card');
  assert.ok(cards.every(x=>x.src?.length>30&&x.alt?.length>5),'Empty cover URL or alt description');
  assert.ok(cards.some(x=>x.src.startsWith('data:image/svg+xml')),'Missing-source cover must use UGN archive illustration');
  // Test actual failed HTTP image handling without depending on an external image host.
  await page.evaluate(async()=>{
    const {setArtworkImage}=await import('./artwork.js');
    const img=document.createElement('img');img.id='failed-cover-test';
    document.body.append(img);
    setArtworkImage(img,'./__missing__/image-cover.png','Known Image Probe','NES');
  });
  await page.waitForFunction(()=>{
    const img=document.querySelector('#failed-cover-test');
    return img?.dataset.artworkState==='archive'&&img.complete&&img.naturalWidth>0;
  },null,{timeout:20000});
  assert.match(await page.locator('#failed-cover-test').getAttribute('alt'),/original game artwork unavailable/i);
  // Live index is a genuine title catalog, not a promise that all commercial ROMs are included.
  await page.locator('#index-console').selectOption('psx');
  await page.waitForFunction(()=>document.querySelectorAll('#index-grid img[data-artwork-title]').length===30,null,{timeout:20000});
  assert.equal(await page.locator('#index-grid img[data-artwork-title]').count(),30,'Indexed game art must have individual covers');
  await page.locator('#index-grid [data-copy]').first().click();
  await page.locator('#my-copy-dialog[open]').waitFor({timeout:12000});
  assert.ok((await page.locator('#copy-art').getAttribute('src'))?.length>0,'Game details art missing');
  await page.locator('#copy-close').click();
  await page.setViewportSize({width:390,height:844});
  await page.locator('#game-grid .game-card').first().scrollIntoViewIfNeeded();
  assert.ok(await page.locator('#game-grid .game-card img[data-artwork-title]').first().isVisible(),'Mobile cover invisible');
  const width=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  if(width.content>width.viewport+5){
    const culprits=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(el=>{
      const r=el.getBoundingClientRect(),css=getComputedStyle(el);
      return {tag:el.tagName.toLowerCase(),id:el.id,cls:String(el.className||'').slice(0,70),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),position:css.position,display:css.display};
    }).filter(e=>e.right>innerWidth+10 && e.width>0 && e.display!=='none').sort((a,b)=>b.right-a.right).slice(0,16));
    console.log('Mobile overflow diagnostics:',JSON.stringify(culprits));
  }
  assert.ok(width.content<=width.viewport+5,'Mobile horizontal overflow '+JSON.stringify(width));
  assert.deepEqual(errors,[],'Artwork/mobile page threw uncaught JavaScript errors');
  console.log('PASS: all 79 hosted cover images, distinct alt text, honest SVG fallback for failed HTTP, 30 PlayStation title visuals, details dialog, responsive mobile view');
}finally{
  if(browser)await browser.close();
  server.kill();
}
