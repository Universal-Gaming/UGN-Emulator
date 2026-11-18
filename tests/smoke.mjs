import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
const index=readFileSync('index.html','utf8'),js=readFileSync('app.js','utf8');
assert.match(index,/<title>UGN Emulator/);
assert.match(index,/id=["']copy-rom-file["']/i,'Support private use-your-own-copy console playback');
assert.doesNotMatch(index,/Nebula Defender|Cosmic Serpent|Prism Breaker|Orbit Pong/i);
assert.match(js,/cdn\.emulatorjs\.org/);
const roms=[];
for(const dir of readdirSync('roms',{withFileTypes:true}).filter(x=>x.isDirectory()))for(const f of readdirSync(path.join('roms',dir.name)))roms.push('roms/'+dir.name+'/'+f);
const additional=JSON.parse(readFileSync('catalog/licensed-rom-expansion.json','utf8'));
assert.equal(additional.length,17,'Expect seventeen rights-documented expansion titles');
assert.ok([62,62+additional.length].includes(roms.length),'Expect baseline or fully bundled homebrew ROM set');
for(const record of additional)assert.ok(js.includes(record.path),'Missing catalog game-card mapping: '+record.path);
for(const f of roms)assert.ok(existsSync(f),'Missing '+f);
const server=spawn('python3',['-m','http.server','8000','--bind','127.0.0.1'],{stdio:'ignore'});
await new Promise(r=>setTimeout(r,1300));
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const fatal=[];page.on('pageerror',e=>fatal.push(String(e)));
 await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('#game-grid .game-card').first().waitFor({timeout:15000});
 await page.waitForFunction(expected=>Number(document.querySelector('#hero-games')?.textContent)===expected,roms.length,{timeout:25000});
 assert.equal(Number(await page.locator('#hero-games').innerText()),roms.length);
 assert.equal(Number(await page.locator('#hero-systems').innerText()),10);
 assert.equal(await page.locator('#game-grid .game-card').count(),36,'First page shows 36 real titles');
 await page.locator('#load-more-games').click();
 assert.equal(await page.locator('#game-grid .game-card').count(),roms.length,'Load More displays the entire bundled game collection');
 await page.locator('#game-search').fill('Celeste');
 assert.equal(await page.locator('#game-grid .game-card').count(),1);
 await page.locator('#game-search').fill('');
 await page.locator('[data-platform=nes]').click();
 assert.equal(await page.locator('#game-grid .game-card').count(),10);
 const distinctGameIds=await page.locator('#game-grid .game-card .game-art[data-inspect]').evaluateAll(nodes=>nodes.map(n=>n.dataset.inspect));
 assert.equal(new Set(distinctGameIds).size,distinctGameIds.length,'Every NES game must have a unique launch identifier');
 await page.locator('#game-grid .game-card .game-art[data-inspect]').nth(1).click();
 await page.locator('#title-dialog[open]').waitFor({timeout:10000});
 const selectedName=await page.locator('#title-name').innerText();
 const exactCardName=await page.locator('#game-grid .game-card').nth(1).locator('h3').innerText();
 assert.equal(selectedName,exactCardName,'Selecting any ROM must show its own game title rather than the first ROM for its console');
 await page.locator('#title-close').click();
 await page.locator('[data-platform=all]').click();
 // The starship is the primary experience, not a static marketing hero.
 await page.locator('#galactic-stage').waitFor({timeout:10000});
 await page.locator('#home').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>{const img=document.querySelector('.concept-backdrop img');return img?.complete&&img.naturalWidth>500;},null,{timeout:10000});
 assert.equal(await page.locator('.location-card img').count(),4);
 await page.screenshot({path:'smoke-intro.png',fullPage:false});
 await page.locator('#enter-archive').click();
 await page.locator('#skip-cinematic').click();
 await page.locator('[data-sector="shelves"]').click();
 await page.locator('#holo-shelf:not([hidden])').waitFor();
 assert.ok((await page.locator('#holo-selected-name').innerText()).length>0);
 await page.locator('#holo-next').click();
 await page.screenshot({path:'smoke-shelf.png',fullPage:false});
 await page.locator('[data-sector="room"]').click();
 await page.locator('#room-panel:not([hidden])').waitFor();
 await page.waitForFunction(()=>document.querySelector('#galactic-stage')?.dataset.renderer, null, {timeout:30000});
 assert.equal(await page.locator('#galactic-stage').getAttribute('data-renderer'),'webgl','Three.js must produce a real WebGL scene');
 assert.ok(Number(await page.locator('#galactic-stage').getAttribute('data-room-object-count'))>=18,'Room 3D meshes should be built');

 await page.waitForFunction(()=>document.querySelector('#room-preset')?.value==='photo',null,{timeout:15000});
 const initialRoom=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1'))||{furniture:[]});
 assert.ok(initialRoom.furniture?.length>=16,'Photographic UGN starter room should contain detailed furnishings');
 assert.ok(initialRoom.furniture.some(f=>f.type==='holo'),'Photo-match room should include a holographic terminal');
 assert.ok(initialRoom.furniture.some(f=>f.type==='neonsign'),'Photo-match room should include the UGN wall sign');
 await page.screenshot({path:'smoke-photo-room.png',fullPage:false});

 await page.locator('#room-preset').selectOption('bedroom90');
 const countBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).furniture.length);
 assert.ok(countBefore>=12,'The 90s gaming bedroom must be fully furnished');
 await page.locator('[data-furniture="crt"]').click();
 assert.equal(await page.locator('#room-walls').inputValue(),'purple');
 let roomSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')));
 assert.equal(roomSave.preset,'bedroom90');
 assert.equal(roomSave.furniture.length,countBefore+1);
 await page.locator('#room-window').selectOption('galaxy');
 await page.locator('#room-clutter').selectOption('minimal');
 await page.locator('#room-lights').selectOption('warm');
 await page.locator('#furniture-duplicate').click();
 roomSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')));
 assert.equal(roomSave.furniture.length,countBefore+2);
 assert.equal(roomSave.window,'galaxy');assert.equal(roomSave.clutter,'minimal');
 await page.locator('summary').filter({hasText:'SAVE, SHARE & RESET'}).click();
 await page.locator('#room-undo').click();
 roomSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')));
 assert.equal(roomSave.furniture.length,countBefore+1);
 await page.locator('#room-redo').click();
 roomSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')));
 assert.equal(roomSave.furniture.length,countBefore+2);
 await page.locator('#room-show-reference').click();
 assert.equal(await page.locator('.room-reference-overlay').isVisible(),true);
 await page.locator('#room-show-reference').click();
 assert.equal(await page.locator('.room-reference-overlay').isVisible(),false);
 await page.locator('#room-effects').uncheck();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).roomEffects),false);
 await page.locator('#room-effects').check();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).roomEffects),true);
 await page.locator('[data-furniture="controller"]').click();
 await page.locator('[data-furniture="holo"]').click();
 await page.locator('[data-furniture="neonsign"]').click();
 const newRoom=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')));
 assert.ok(newRoom.furniture.some(f=>f.type==='controller'));
 assert.ok(newRoom.furniture.some(f=>f.type==='holo'));
 assert.ok(newRoom.furniture.some(f=>f.type==='neonsign'));
 await page.locator('[data-room-view="desk"]').click();
 assert.equal(await page.locator('[data-room-view="desk"]').getAttribute('class'),'room-view-active');
 await page.locator('#room-display-0').evaluate(el=>el.closest('details').open=true);
 await page.locator('#room-display-0').selectOption('gba');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).displayConsoles[0]),'gba');

 await page.screenshot({path:'smoke-room.png',fullPage:false});
 await page.locator('[data-sector="archive"]').click();
 await page.locator('#exhibit-panel').evaluate(el=>el.hidden=true);
 await page.locator('#game-grid [data-play]').first().click();
 await page.locator('#game-dialog[open]').waitFor({timeout:10000});
 assert.equal(await page.locator('#player-viewport iframe').count(),1);
 const player=await page.locator('#player-viewport iframe').getAttribute('srcdoc');
 assert.match(player,/EJS_core/);
 await page.waitForFunction(()=>document.querySelector('#player-status')?.textContent?.includes('CORE READY')||document.querySelector('#player-status')?.textContent?.includes('GAME RUNNING'),null,{timeout:25000});
 // EmulatorJS documents that auto-start freezes until the user interacts with the iframe.
 if(!(await page.locator('#player-status').innerText()).includes('GAME RUNNING'))
   await page.locator('#player-viewport iframe').contentFrame().locator('#game').click({position:{x:180,y:170},force:true});
 try {await page.waitForFunction(()=>document.querySelector('#player-status')?.textContent?.includes('GAME RUNNING'),null,{timeout:45000});}
 catch (e) {console.warn('Actual game startup not confirmed:',await page.locator('#player-status').textContent());console.warn('Emulator diagnostics:',await page.locator('#player-viewport iframe').contentFrame().locator('body').evaluate(el=>({canvas:el.querySelectorAll('canvas').length,body:el.innerText?.slice(0,500),emulator:!!el.ownerDocument.defaultView?.EJS_emulator,gameManager:!!el.ownerDocument.defaultView?.EJS_emulator?.gameManager})));throw e;}
 await page.locator('#player-close').click();
 assert.equal(await page.locator('#game-dialog[open]').count(),0);
 // Massive console catalog is metadata only; ROM files for unhosted games stay local.
 await page.waitForFunction(()=>document.querySelector('#full-index-total')?.textContent?.match(/[0-9,]{4,}/),null,{timeout:20000});
 const indexTotal=Number((await page.locator('#full-index-total').innerText()).replaceAll(',',''));
 assert.ok(indexTotal>40000,'Expect >40,000 console title/edition entries, got '+indexTotal);
 await page.locator('#index-console').selectOption('nes');
 await page.locator('#index-query').fill('Super Mario Bros.');
 await page.locator('#index-grid .index-card').first().waitFor({timeout:15000});
 await page.locator('#index-grid [data-copy]').first().click();
 await page.locator('#my-copy-dialog[open]').waitFor({timeout:10000});
 await page.locator('#copy-rom-file').setInputFiles('roms/nes/2048.nes');
 assert.equal(await page.locator('#copy-launch').isEnabled(),true);
 await page.locator('#copy-launch').click();
 await page.locator('#game-dialog[open]').waitFor({timeout:10000});
 const localSource=await page.locator('#player-viewport iframe').getAttribute('srcdoc');
 assert.match(localSource,/blob:/,'The game file must load locally from an object URL');
 assert.match(localSource,/EJS_core/);
 assert.match(localSource,/<\/script><script src=/i,'Personal-copy iframe must contain real closing script tags so the EmulatorJS loader runs');
 try{
   await page.waitForFunction(()=>document.querySelector('#player-status')?.textContent?.includes('CORE READY')||document.querySelector('#player-status')?.textContent?.includes('GAME RUNNING'),null,{timeout:25000});
   if(!(await page.locator('#player-status').innerText()).includes('GAME RUNNING'))
     await page.locator('#player-viewport iframe').contentFrame().locator('#game').click({position:{x:180,y:170},force:true});
   await page.waitForFunction(()=>document.querySelector('#player-status')?.textContent?.includes('GAME RUNNING'),null,{timeout:45000});
 } catch(e) {
   console.warn('Local-file emulator boot failed:',await page.locator('#player-status').textContent());
   const diag=await page.locator('#player-viewport iframe').contentFrame().locator('body').evaluate(el=>({html:el.innerHTML.slice(0,600),emulator:!!el.ownerDocument.defaultView?.EJS_emulator,gameDiv:!!el.querySelector('#game')}));
   console.warn('Local-copy iframe diagnostics:',diag);throw e;
 }
 await page.locator('#player-close').click();
 assert.equal(await page.locator('#game-dialog[open]').count(),0);
 await page.screenshot({path:'smoke-catalog.png',fullPage:false});
 // Full-page WebGL captures can stall Chromium/SwiftShader on shared CI runners.
 // The screenshots are diagnostic artifacts, not functional acceptance criteria.
 try { await page.screenshot({path:'smoke-desktop.png',fullPage:false,timeout:15000}); }
 catch (e) { console.warn('Optional desktop screenshot skipped:',e.message); }
 await page.setViewportSize({width:390,height:844});
 try { await page.screenshot({path:'smoke-mobile.png',fullPage:false,timeout:15000}); }
 catch (e) { console.warn('Optional mobile screenshot skipped:',e.message); }
 const unexpected=fatal.filter(msg=>!msg.includes('Wake Lock permission request denied'));
 assert.equal(unexpected.length,0,'Uncaught application JS exceptions: '+unexpected.join('; '));
 console.log('PASS: 41K title index + local-file browser emulation; '+roms.length+' real ROMs, ten installed systems, 3D starship, holographic library, editable room, search, launcher and responsive layouts');
}finally{if(browser)await browser.close();server.kill();}
