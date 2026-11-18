// UGN interactive controls regression suite.
// Runs in Chromium; real click handlers are exercised, not only existence in the DOM.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

const server=spawn('python3',['-m','http.server','8000','--bind','127.0.0.1'],{stdio:'ignore'});
await new Promise(resolve=>setTimeout(resolve,1100));
let browser;
const base='http://127.0.0.1:8000';
try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
  const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));

  await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>Boolean(window.UGN_GALACTIC),null,{timeout:30000});
  await page.waitForFunction(()=>document.querySelector('#galactic-stage')?.dataset.renderer,null,{timeout:30000});
  await page.waitForFunction(()=>document.querySelector('#index-grid [data-copy]'),null,{timeout:25000});
  assert.equal(await page.locator('header .wordmark').getAttribute('href'),'./index.html');
  assert.equal(await page.locator('footer .footer-logo').getAttribute('href'),'./index.html');

  // Header navigation must move to the requested real 3D deck and open its controls.
  await page.locator('[data-nav-sector="room"]').click();
  assert.equal(await page.locator('#room-panel').isVisible(),true);
  assert.equal(await page.locator('.world-dock [data-sector="room"]').getAttribute('class'),'dock-active');
  const initial=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')));
  assert.ok(initial.furniture.length>=16,'Photo-match room should be furnished');
  await page.locator('#room-preset').selectOption('bedroom90');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).preset),'bedroom90');
  await page.locator('#room-window').selectOption('galaxy');
  await page.locator('#room-lights').selectOption('warm');
  await page.locator('#room-effects').uncheck();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).roomEffects),false);
  await page.locator('#room-effects').check();
  await page.locator('[data-room-view="desk"]').click();
  assert.ok((await page.locator('[data-room-view="desk"]').getAttribute('class')).includes('room-view-active'));

  // Verify each category button changes the furniture inventory.
  await page.locator('[data-furniture-category="decor"]').click();
  assert.equal(await page.locator('[data-furniture="crt"]').getAttribute('hidden'),'');
  await page.locator('[data-furniture-category="all"]').click();
  assert.equal(await page.locator('[data-furniture="crt"]').getAttribute('hidden'),null);
  const count=await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).furniture.length);
  await page.locator('[data-furniture="holo"]').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).furniture.length),count+1);
  await page.locator('#furniture-rotate').click();
  await page.locator('[data-nudge-x="1"][data-nudge-z="0"]').click();
  await page.locator('#furniture-duplicate').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).furniture.length),count+2);
  await page.locator('summary').filter({hasText:'SAVE, SHARE & RESET'}).click();
  await page.locator('#room-undo').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).furniture.length),count+1);
  await page.locator('#room-redo').click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).furniture.length),count+2);
  await page.locator('#room-show-reference').click();
  assert.equal(await page.locator('.room-reference-overlay').isVisible(),true);
  await page.locator('#room-show-reference').click();
  assert.equal(await page.locator('.room-reference-overlay').isVisible(),false);
  const [roomDownload]=await Promise.all([page.waitForEvent('download',{timeout:10000}),page.locator('#room-export').click()]);
  assert.ok(roomDownload.suggestedFilename().endsWith('.json'));
  await page.locator('#room-reset').click();
  assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('ugn-galactic-room-v1')).furniture.length)>=12);

  // Holographic shelf controls and header navigation (not just a visible menu).
  await page.locator('[data-nav-sector="shelves"]').click();
  assert.equal(await page.locator('#holo-shelf').isVisible(),true);
  await page.locator('#holo-next').click();
  await page.locator('#holo-prev').click();
  assert.ok(Number((await page.locator('#holo-counter').innerText()).split('/')[1])>0);
  await page.locator('#holo-play').click();
  await page.locator('#title-dialog[open]').waitFor({timeout:10000});
  await page.locator('#title-close').click();
  await page.locator('#close-holo-shelf').click();
  await page.locator('[data-nav-sector="exhibits"]').click();
  assert.ok((await page.locator('.world-dock [data-sector="exhibits"]').getAttribute('class')).includes('dock-active'));
  await page.evaluate(()=>window.UGN_GALACTIC.focusExhibit('nes'));
  assert.equal(await page.locator('#exhibit-panel').isVisible(),true);
  await page.locator('#exhibit-open-own').click();
  await page.locator('#my-copy-dialog[open]').waitFor({timeout:10000});
  await page.locator('#copy-close').click();
  await page.locator('#exhibit-view-library').click();
  await page.waitForFunction(()=>document.querySelector('#index-console')?.value==='nes',null,{timeout:15000});
  await page.locator('[data-nav-sector="archive"]').click();
  assert.ok((await page.locator('.world-dock [data-sector="archive"]').getAttribute('class')).includes('dock-active'));
  await page.locator('#open-display-settings').click();
  assert.equal(await page.locator('#quality-panel').isVisible(),true);
  await page.locator('#graphics-preset').selectOption('low');
  await page.locator('#close-display-settings').click();
  assert.equal(await page.locator('#quality-panel').isVisible(),false);
  await page.locator('#toggle-sound').click();
  assert.ok((await page.locator('#toggle-sound').innerText()).includes('AUDIO ON'));
  await page.locator('#toggle-sound').click();

  // Full game index: pagination, title buttons, favorites, owned collection.
  await page.locator('#index-console').selectOption('nes');
  await page.waitForFunction(()=>document.querySelectorAll('#index-grid [data-copy]').length>=2,null,{timeout:25000});
  const firstKey=await page.locator('#index-grid [data-copy]').first().getAttribute('data-copy');
  await page.locator('#index-grid [data-index-fav]').first().click();
  await page.locator('#owned-recent-list [data-owned]').first().click();
  await page.locator('#my-copy-dialog[open]').waitFor({timeout:10000});
  await page.locator('#copy-close').click();
  await page.locator('#index-grid [data-copy]').first().click();
  await page.locator('#my-copy-dialog[open]').waitFor({timeout:10000});
  assert.ok(await page.locator('#copy-game-name').innerText());
  // The file selector is local and should enable launch for a format-valid game.
  const romData=Buffer.alloc(4096,0);romData.write('NES\x1a',0,'latin1');
  await page.locator('#copy-rom-file').setInputFiles({name:'my-homebrew.nes',mimeType:'application/octet-stream',buffer:romData});
  assert.equal(await page.locator('#copy-launch').isDisabled(),false);
  await page.locator('#copy-close').click();
  await page.locator('#index-next').click();
  assert.ok((await page.locator('#index-page').innerText()).includes('PAGE 2'));
  await page.locator('#index-prev').click();
  assert.ok((await page.locator('#index-page').innerText()).includes('PAGE 1'));
  assert.equal(await page.locator('#index-grid [data-copy]').first().getAttribute('data-copy'),firstKey);

  // Main library buttons: tabs, sort, filters, favorites and reset.
  await page.locator('#view-personal').click();
  assert.equal(await page.locator('#view-personal').getAttribute('aria-pressed'),'true');
  await page.locator('#view-everything').click();
  assert.equal(await page.locator('#view-everything').getAttribute('aria-pressed'),'true');
  await page.locator('#game-search').fill('Tetris');
  await page.locator('#game-sort').selectOption('az');
  await page.locator('#show-favorites').click();
  await page.locator('#reset-filters').click();
  assert.equal(await page.locator('#view-hosted').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#game-search').inputValue(),'');
  assert.equal(await page.locator('#game-sort').inputValue(),'featured');
  assert.equal(await page.locator('#show-favorites').getAttribute('aria-pressed'),'false');
  await page.locator('#feature-next').click();
  await page.locator('#feature-prev').click();
  await page.locator('.sys-filter[data-maker="Sega"]').click();
  await page.locator('.sys-filter[data-maker="all"]').click();

  // Logos return to the experience's home, not an arbitrary anchor or UGN network.
  await page.locator('header .wordmark').click();
  await page.waitForURL(url=>url.pathname.endsWith('/index.html'),{timeout:15000});
  assert.equal(await page.locator('#world-intro').isVisible(),true);
  await page.goto(base+'/library.html',{waitUntil:'domcontentloaded'});
  await page.locator('header .wordmark').click();
  await page.waitForURL(url=>url.pathname.endsWith('/index.html'),{timeout:15000});
  await page.goto(base+'/library.html',{waitUntil:'domcontentloaded'});
  await page.locator('footer .footer-logo').click();
  await page.waitForURL(url=>url.pathname.endsWith('/index.html'),{timeout:15000});

  // Mobile hamburger opens/closes, all header sector buttons remain operable.
  await page.setViewportSize({width:390,height:844});
  await page.waitForFunction(()=>Boolean(window.UGN_GALACTIC),null,{timeout:30000});
  await page.locator('#nav-toggle').click();
  assert.equal(await page.locator('#nav-toggle').getAttribute('aria-expanded'),'true');
  await page.locator('[data-nav-sector="room"]').click();
  assert.equal(await page.locator('#nav-toggle').getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('#room-panel').isVisible(),true);
  await page.locator('header .wordmark').click();
  await page.waitForURL(url=>url.pathname.endsWith('/index.html'),{timeout:15000});

  const unexpected=errors.filter(e=>!e.includes('Wake Lock permission request denied'));
  assert.deepEqual(unexpected,[], 'Browser errors during button and navigation audit');
  console.log('PASS: UGN logos and footer, four desktop header sectors, mobile menu, room edit/save/undo/redo, holo shelf, graphics/audio, console exhibits, catalog paging/favorites/local-copy, game filters and reset.');
}finally{
  if(browser)await browser.close();
  server.kill();
}