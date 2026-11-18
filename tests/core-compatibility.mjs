import { chromium } from 'playwright';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

// One genuine installed homebrew game for each of the 10 preinstalled console categories.
// This is evidence of core startup, not a full playthrough or proof all 79 ROMs are compatible.
const cases=[
 {system:'NES',title:'2048 NES',path:'roms/nes/2048.nes'},
 {system:'SNES',title:'Super Boss Gaiden',path:'roms/snes/super-boss-gaiden.sfc'},
 {system:'N64',title:'Kumi-Daiko Beatoff 64',path:'roms/n64/kumi-daiko.n64'},
 {system:'Game Boy',title:'2048gb',path:'roms/gb/2048gb.gb'},
 {system:'Game Boy Color',title:'µCity',path:'roms/gbc/ucity.gbc'},
 {system:'Game Boy Advance',title:'GRIMLIGHT: The Hollow Bell',path:'roms/gba/grimlight.gba'},
 {system:'Nintendo DS',title:'Lunar Runner',path:'roms/nds/lunar-runner.nds'},
 {system:'Sega Genesis',title:'Tank Battle',path:'roms/genesis/tank-battle.bin'},
 {system:'Atari 2600',title:'Sheep It Up!',path:'roms/atari2600/sheep-it-up.a26'},
 {system:'Neo Geo Pocket',title:'Asteroids neo',path:'roms/ngp/asteroids-neo.ngp'}
];
for(const sample of cases)if(!existsSync(sample.path))throw Error('Installed ROM missing: '+sample.path);
const server=spawn('python3',['-m','http.server','8767','--bind','127.0.0.1'],{stdio:'ignore'});
const results=[];
mkdirSync('core-previews',{recursive:true});
let browser;
try{
 await new Promise(done=>setTimeout(done,1000));
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 for(const sample of cases){
   const start=Date.now();
   const page=await browser.newPage({viewport:{width:1280,height:900}});
   const diagnostics=[];
   page.on('pageerror',e=>diagnostics.push('page error: '+e.message.slice(0,180)));
   page.on('console',msg=>{if(msg.type()==='error'&&diagnostics.length<8)diagnostics.push('console: '+msg.text().slice(0,180))});
   let result={system:sample.system,title:sample.title,path:sample.path,passed:false,diagnostics:[]};
   try{
     await page.goto('http://127.0.0.1:8767/library.html',{waitUntil:'domcontentloaded',timeout:30000});
     await page.waitForFunction(()=>Number(document.querySelector('#hero-games')?.textContent)===79,null,{timeout:25000});
     await page.locator('#game-search').fill(sample.title);
     const play=page.locator('#game-grid [data-play="'+sample.path+'"]');
     await play.waitFor({timeout:15000});
     await play.click();
     await page.locator('#game-dialog[open]').waitFor({timeout:12000});
     const frame=page.locator('#player-viewport iframe');
     await frame.waitFor();
     const srcdoc=await frame.getAttribute('srcdoc');
     if(!srcdoc?.includes('EJS_core'))throw Error('Emulator iframe missing configured core');
     await page.waitForFunction(()=>{
       const text=document.querySelector('#player-status')?.textContent||'';
       return text.includes('CORE READY')||text.includes('GAME RUNNING')||text.includes('EMULATOR ERROR');
     },null,{timeout:35000});
     let status=(await page.locator('#player-status').innerText()).trim();
     if(status.includes('EMULATOR ERROR'))throw Error(status);
     if(!status.includes('GAME RUNNING')){
       await frame.contentFrame().locator('#game').click({position:{x:180,y:170},force:true,timeout:12000});
     }
     await page.waitForFunction(()=>{
       const status=document.querySelector('#player-status')?.textContent||'';
       return status.includes('GAME RUNNING')||status.includes('EMULATOR ERROR');
     },null,{timeout:45000});
     status=(await page.locator('#player-status').innerText()).trim();
     if(!status.includes('GAME RUNNING'))throw Error(status);
     const state=await frame.contentFrame().locator('body').evaluate(el=>({canvases:el.querySelectorAll('canvas').length,loaded:!!el.ownerDocument.defaultView?.EJS_emulator,coreReady:!!el.ownerDocument.defaultView?.EJS_emulator?.gameManager}));
     result={...result,passed:true,stage:status,canvas_count:state.canvases,core_manager:state.coreReady};
     try{await frame.screenshot({path:'core-previews/'+sample.path.split('/').pop().replace(/[^a-z0-9._-]/gi,'_')+'.png',timeout:10000});}
     catch(e){diagnostics.push('optional frame screenshot: '+e.message.slice(0,130));}
     await page.locator('#player-close').click();
   }catch(error){
     result.error=String(error.message||error).slice(0,600);
     try{result.status=(await page.locator('#player-status').innerText({timeout:3000})).slice(0,200)}catch{}
     try{result.emulator=await page.locator('#player-viewport iframe').contentFrame().locator('body').evaluate(el=>({canvas:el.querySelectorAll('canvas').length,emulator:!!el.ownerDocument.defaultView?.EJS_emulator,manager:!!el.ownerDocument.defaultView?.EJS_emulator?.gameManager}),{timeout:3000})}catch{}
   }finally{
     result.duration_ms=Date.now()-start;
     result.diagnostics=diagnostics.slice(0,8);
     results.push(result);
     console.log((result.passed?'PASS':'FAIL')+' '+sample.system+' :: '+sample.title+' ('+result.duration_ms+'ms)'+(result.error?' '+result.error:''));
     await page.close().catch(()=>{});
   }
 }
}finally{
 if(browser)await browser.close();
 server.kill();
 const summary={checked:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length};
 writeFileSync('core-compatibility.json',JSON.stringify({checked_at:new Date().toISOString(),summary,results},null,2)+'\n');
 console.log('CORE COMPATIBILITY MATRIX:',JSON.stringify(summary));
}
if(results.length!==10||results.some(x=>!x.passed))process.exitCode=1;
