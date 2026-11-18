/* UGN Emulator: premium console-only experience. No fake games, no upload interface. */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const commons=name=>name?'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(name)+'?width=700':'';
const systemCatalog=[
{id:'nes',name:'Nintendo Entertainment System',short:'NES',maker:'Nintendo',year:1985,photo:'NES-Console-Set.jpg',about:'The 8-bit system that helped redefine home video games.',core:'nes'},
{id:'snes',name:'Super Nintendo',short:'SNES',maker:'Nintendo',year:1991,photo:'SNES-Console-Set.jpg',about:'The golden age of 16-bit adventures and brilliant sprite art.',core:'snes'},
{id:'n64',name:'Nintendo 64',short:'N64',maker:'Nintendo',year:1996,photo:'N64-Console-Set.jpg',about:'A landmark generation that brought analog controls into 3D gaming.',core:'n64'},
{id:'gb',name:'Game Boy',short:'GAME BOY',maker:'Nintendo',year:1989,photo:'Game-Boy-FL.jpg',about:'The portable console that made gaming a pocket-sized adventure.',core:'gb'},
{id:'gbc',name:'Game Boy Color',short:'GAME BOY COLOR',maker:'Nintendo',year:1998,photo:'Game-Boy-Color-FL.jpg',about:'A colorful new era for Nintendo handheld adventures.',core:'gb'},
{id:'gba',name:'Game Boy Advance',short:'GBA',maker:'Nintendo',year:2001,photo:'Game-Boy-Advance-FL.jpg',about:'32-bit portable power in a compact handheld console.',core:'gba'},
{id:'nds',name:'Nintendo DS',short:'NINTENDO DS',maker:'Nintendo',year:2004,photo:'Nintendo-DS-Fat-Blue.jpg',about:'Two screens and a touchscreen reshaped handheld play.',core:'nds'},
{id:'segaMD',name:'Sega Genesis',short:'GENESIS',maker:'Sega',year:1989,photo:'Sega-Genesis-Mod1-Set.jpg',about:'Sega’s fast, unmistakable 16-bit era.',core:'segaMD'},
{id:'segaGG',name:'Sega Game Gear',short:'GAME GEAR',maker:'Sega',year:1991,photo:'Sega-Game-Gear-WB.png',about:'Full-color portable Sega gaming on the move.',core:'segaGG'},
{id:'sega32x',name:'Sega 32X',short:'32X',maker:'Sega',year:1994,photo:'Sega-Genesis-32X-Set.jpg',about:'An ambitious 32-bit expansion for Genesis hardware.',core:'sega32x'},
{id:'segaCD',name:'Sega CD',short:'SEGA CD',maker:'Sega',year:1992,photo:'Sega-CD-Model1-Set.jpg',about:'An experimental era of CD-based home console games.',core:'segaCD'},
{id:'segaSaturn',name:'Sega Saturn',short:'SATURN',maker:'Sega',year:1995,photo:'Sega-Saturn-Console-Set-Mk1.jpg',about:'A distinctive chapter in 32-bit CD gaming.',core:'segaSaturn'},
{id:'psx',name:'Sony PlayStation',short:'PLAYSTATION',maker:'Sony',year:1995,photo:'PSone-Console-Set-NoLCD.jpg',about:'Disc-based games that transformed home console experiences.',core:'psx'},
{id:'atari2600',name:'Atari 2600',short:'ATARI 2600',maker:'Other',year:1977,photo:'Atari-2600-Wood-4Sw-Set.jpg',about:'An unmistakable cornerstone of the earliest console generations.',core:'atari2600'},
{id:'ngp',name:'Neo Geo Pocket',short:'NEO GEO POCKET',maker:'Other',year:1998,photo:'NeoGeo-Pocket-Color.jpg',about:'SNK’s cult-favorite portable gaming hardware.',core:'ngp'},
{id:'neogeo',name:'Neo Geo',short:'NEO GEO',maker:'Other',year:1990,photo:'Neo-Geo-AES-Console-Set.jpg',about:'Legendary premium home-console hardware from SNK.',core:'arcade'}
];
const C=(id,file,name,genre,creator,year,desc,color='cyan',image='')=>({id,file,name,genre,creator,year,desc,system:id,color,image});
const games=[
C('nes','roms/nes/2048.nes','2048 NES','Puzzle','mmuszkow',2014,'The number-combining puzzle, compiled for the original Nintendo Entertainment System.','cyan','https://raw.githubusercontent.com/mmuszkow/2048-nes/master/screen0.png'),
C('nes','roms/nes/table-tennis.nes','8-Bit Table Tennis','Sports','mike42',2021,'An authentic table tennis homebrew made for the NES.','lime'),
C('nes','roms/nes/nova-the-squirrel.nes','Nova the Squirrel','Platformer','NovaSquirrel',2018,'Copy enemy powers and explore a full-length 8-bit adventure.','violet'),
C('nes','roms/nes/alter-ego.nes','Alter Ego','Puzzle Platformer','Shiru',2011,'Change places with your phantom twin in a clever puzzle platformer.','cyan'),
C('nes','roms/nes/spacegulls.nes','Spacegulls','Platformer','Morphcat Games',2021,'A cosmic NES platformer from a modern homebrew creator.','lime'),
C('snes','roms/snes/super-boss-gaiden.sfc','Super Boss Gaiden','Action','Dieter von Laser / Chilly Willy',2015,'A real 16-bit action game developed for Super Nintendo.','violet'),
C('snes','roms/snes/n-warp-daisakusen.sfc','N-Warp Daisakusen','Multiplayer','d4s',2008,'Multiplayer Super Nintendo homebrew built for competitive fun.','cyan'),
C('n64','roms/n64/kumi-daiko.n64','Kumi-Daiko Beatoff 64','Rhythm','Team Riistahillo',2020,'Nintendo 64 homebrew from the N64brew game jam.','violet'),
C('gb','roms/gb/libbet.gb','Libbet and the Magic Floor','Puzzle','Damian Yerrick',2012,'Roll across a magical floor in this original Game Boy puzzle.','lime'),
C('gb','roms/gb/tobu-tobu-girl.gb','Tobu Tobu Girl','Platformer','Tangram Games',2017,'A challenging platformer developed for Game Boy hardware.','cyan'),
C('gb','roms/gb/deadeus.gb','Deadeus','Horror','-IZMA-',2019,'Narrative horror released for the original Nintendo Game Boy.','violet'),
C('gbc','roms/gb/tobudx.gb','Tobu Tobu Girl Deluxe','Platformer','Simon Larsen',2020,'The enhanced color edition of the original Game Boy platformer.','violet'),
C('gbc','roms/gbc/ucity.gbc','µCity','Simulation','Antonio Niño Díaz',2014,'A surprisingly rich city-building simulation on Game Boy Color.','lime'),
C('gbc','roms/gbc/geometrix.gbc','Geometrix','Puzzle','Antonio Niño Díaz',2017,'A colorful geometric Game Boy Color puzzle challenge.','cyan'),
C('gba','roms/gba/cebelix.gba','Cebelix','Homebrew','gbadev contributors',2005,'Compiled Game Boy Advance software from the homebrew community.','violet'),
C('gba','roms/gba/dezgex.gba','Dezgex','Homebrew','gbadev contributors',2005,'Authentic GBA homebrew running through a GBA emulator core.','cyan'),
C('gba','roms/gba/mystic-q.gba','Mystic Q','Homebrew','gbadev contributors',2005,'A genuine third-party Game Boy Advance homebrew title.','lime'),
C('gba','roms/gba/pik-roll.gba','Pik Roll','Homebrew','gbadev contributors',2005,'A real GBA binary built for the handheld hardware.','violet'),
C('gba','roms/gba/celeste-classic.gba','Celeste Classic GBA','Platformer','JeffRuLz',2020,'A Game Boy Advance homebrew port of Celeste Classic.','cyan'),
C('segaMD','roms/genesis/tank-battle.bin','Tank Battle','Action','monteslu',2026,'Top-down tank combat on the Sega Genesis hardware.','lime'),
C('segaMD','roms/genesis/battle-4tris.bin','Battle 4Tris','Puzzle','monteslu',2026,'Competitive four-block puzzle combat for Genesis.','violet'),
C('segaMD','roms/genesis/space-shooter.bin','Space Shooter','Shooter','monteslu',2026,'An authentic vertical scrolling Genesis homebrew.','cyan'),
C('segaMD','roms/genesis/cave-story.md','Cave Story MD','Adventure','Studio Pixel / andwn',2019,'Cave Story adapted as a Sega Mega Drive homebrew project.','violet'),
C('segaMD','roms/genesis/ultimate-tetris.md','Ultimate Tetris','Puzzle','Haroldo O. Pinheiro',2021,'A Genesis release of a classic puzzle formula.','lime'),
C('segaMD','roms/genesis/break-an-egg.md','Break An Egg','Action','Studio Vetea',2017,'An independent Sega Mega Drive game.','cyan'),
C('atari2600','roms/atari2600/sheep-it-up.a26','Sheep It Up!','Platformer','Dr. Ludos',2017,'A genuine Atari 2600 homebrew with a charming sheep protagonist.','lime'),
C('ngp','roms/ngp/asteroids-neo.ngp','Asteroids neo','Shooter','Steven MacDonald',2026,'An independently developed Neo Geo Pocket shooter.','violet')
];
const storageKey='ugn-emulator-prefs-v3';let memory={favorites:[],played:{},recent:[]};
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(saved&&typeof saved==='object'){memory={...memory,...saved};if(!Array.isArray(memory.favorites))memory.favorites=[];if(!Array.isArray(memory.recent))memory.recent=[];if(!memory.played||typeof memory.played!=='object')memory.played={}}}catch{}
const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(memory))}catch{}};
const system=id=>systemCatalog.find(s=>s.id===id);
const installed={};let platform='all',maker='all',search='',sort='featured',favoritesOnly=false,spot=0;
const escapes=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageMarkup=(file,alt='',extra='')=>file?'<img loading="lazy" src="'+escapes(file)+'" alt="'+escapes(alt)+'" '+extra+'>':'';
const photo=s=>commons(s?.photo);
function notify(message){let el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>el.classList.remove('show'),3200)}
function installedCount(id){return games.filter(g=>g.system===id&&installed[g.file]===true).length}
function selectSystem(id){platform=id;renderPills();renderGames();$('#library').scrollIntoView({behavior:'smooth'});notify('Viewing '+(system(id)?.name||'all systems'))}
function changeSpot(i){spot=(i+systemCatalog.length)%systemCatalog.length;const s=systemCatalog[spot];$('#feature-index').textContent=String(spot+1).padStart(2,'0');$('#feature-position').textContent=String(spot+1).padStart(2,'0')+' / '+systemCatalog.length;$('#feature-era').textContent=s.year+' / '+s.maker.toUpperCase();$('#feature-title').textContent=s.name;$('#feature-description').textContent=s.about;$('#feature-count').textContent=installedCount(s.id)?installedCount(s.id)+' INSTALLED GAME'+(installedCount(s.id)===1?'':'S'):'NO INSTALLED GAMES YET';const img=$('#feature-image');img.alt='Authentic '+s.name+' console hardware';img.src=photo(s);img.onerror=()=>{img.onerror=null;img.removeAttribute('src');img.alt=s.name+' photo temporarily unavailable'};$('#feature-explore').onclick=()=>selectSystem(s.id)}
$('#feature-prev').onclick=()=>changeSpot(spot-1);$('#feature-next').onclick=()=>changeSpot(spot+1);
function renderSystems(){const list=systemCatalog.filter(s=>maker==='all'||s.maker===maker);
$('#system-grid').innerHTML=list.map(s=>{const amount=installedCount(s.id);return '<button class="system-card '+(amount?'':'soon')+'" data-system="'+s.id+'"><span class="system-status">'+(amount?amount+' GAME'+(amount===1?'':'S'):'COMING SOON')+'</span><div class="system-img">'+imageMarkup(photo(s),s.name+' hardware','onerror="this.hidden=true;this.nextElementSibling.hidden=false"')+'<span class="system-noimage" hidden>'+escapes(s.short.slice(0,3))+'</span></div><div class="system-card-body"><div class="system-name">'+escapes(s.short)+'</div><div class="system-sub">'+s.maker.toUpperCase()+' / '+s.year+'</div></div></button>'}).join('');
$$('[data-system]').forEach(b=>b.onclick=()=>{const id=b.dataset.system;const i=systemCatalog.findIndex(s=>s.id===id);changeSpot(i);if(installedCount(id))selectSystem(id);else notify(system(id).name+' — no licensed games installed yet')});
}
$$('.sys-filter').forEach(b=>b.onclick=()=>{maker=b.dataset.maker;$$('.sys-filter').forEach(x=>x.classList.toggle('active',x===b));renderSystems()});
function renderPills(){const options=[['all','ALL GAMES'],...systemCatalog.filter(s=>games.some(g=>g.system===s.id)).map(s=>[s.id,s.short])];$('#platform-pills').innerHTML=options.map(([id,label])=>'<button data-platform="'+escapes(id)+'" class="'+(id===platform?'active':'')+'">'+escapes(label)+'</button>').join('');$$('[data-platform]').forEach(b=>b.onclick=()=>{platform=b.dataset.platform;renderPills();renderGames()})}
function renderGames(){
let list=games.filter(g=>installed[g.file]!==false&&(!favoritesOnly||memory.favorites.includes(g.id))&&(platform==='all'||g.system===platform)&&(g.name+' '+g.creator+' '+g.genre+' '+system(g.system)?.name).toLowerCase().includes(search));
if(sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name));
if(sort==='year')list.sort((a,b)=>b.year-a.year);
if(sort==='system')list.sort((a,b)=>system(a.system).name.localeCompare(system(b.system).name));
$('#library-count').textContent=games.filter(g=>installed[g.file]===true).length+' VERIFIED ROMS / '+games.length+' IN CATALOG';
$('#game-grid').innerHTML=list.map(g=>{const s=system(g.system),isReady=installed[g.file]===true;return '<article class="game-card"><div class="game-art" style="--art:var(--'+g.color+')"><span class="game-system">'+escapes(s.short)+'</span><button class="game-favorite '+(memory.favorites.includes(g.id)?'saved':'')+'" data-fav="'+g.id+'" aria-label="Toggle favorite for '+escapes(g.name)+'" aria-pressed="'+memory.favorites.includes(g.id)+'">♥</button>'+imageMarkup(g.image||photo(s),g.image?'Gameplay screenshot of '+g.name:s.name+' console hardware','onerror="this.hidden=true;this.nextElementSibling.hidden=false"')+'<div class="art-placeholder" hidden>'+escapes(s.short.slice(0,3))+'</div><span class="art-note">'+(g.image?'GAME SCREENSHOT':'AUTHENTIC CONSOLE PHOTO')+'</span></div><div class="game-info"><h3>'+escapes(g.name)+'</h3><div class="game-byline">'+escapes(g.creator)+' · '+g.year+'</div><p class="game-description">'+escapes(g.desc)+'</p><div class="game-bottom"><span class="rom-state '+(isReady?'':'checking')+'">'+(isReady?'● INSTALLED':'◌ VERIFYING')+'</span><button class="game-play" data-play="'+g.id+'" '+(!isReady?'disabled':'')+'>PLAY NOW ↗</button></div></div></article>'}).join('');
$('#empty-state').hidden=list.length!==0;$('#hero-games').textContent=games.filter(g=>installed[g.file]===true).length;$('#hero-systems').textContent=systemCatalog.filter(s=>installedCount(s.id)>0).length;
$$('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav;memory.favorites=memory.favorites.includes(id)?memory.favorites.filter(x=>x!==id):[...memory.favorites,id];save();renderGames();renderHistory()});
$$('[data-play]').forEach(b=>b.onclick=()=>launch(b.dataset.play));
}
function renderHistory(){const played=Object.keys(memory.played);$('#stat-played').textContent=played.length;$('#stat-favorites').textContent=memory.favorites.length;$('#stat-consoles').textContent=new Set(played.map(id=>games.find(g=>g.id===id)?.system).filter(Boolean)).size;
$('#recent-list').innerHTML=memory.recent.length?memory.recent.map(id=>{const g=games.find(x=>x.id===id);return g?'<button data-recent="'+escapes(id)+'">'+escapes(system(g.system).short)+' / '+escapes(g.name)+'</button>':''}).join(''):'<span style="color:#93a7c3">Your console journey starts with the first game you launch.</span>';
$$('[data-recent]').forEach(b=>b.onclick=()=>launch(b.dataset.recent));
}
$('#game-search').oninput=e=>{search=e.target.value.toLowerCase().trim();renderGames()};
$('#game-sort').onchange=e=>{sort=e.target.value;renderGames()};
$('#show-favorites').onclick=()=>{favoritesOnly=!favoritesOnly;$('#show-favorites').classList.toggle('active',favoritesOnly);$('#show-favorites').setAttribute('aria-pressed',String(favoritesOnly));renderGames()};
$('#reset-filters').onclick=()=>{platform='all';search='';favoritesOnly=false;$('#game-search').value='';$('#show-favorites').classList.remove('active');renderPills();renderGames()};
$('#export-history').onclick=()=>{const blob=new Blob([JSON.stringify(memory,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ugn-emulator-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)};
$('#nav-toggle').onclick=()=>{const nav=$('.primary-nav');nav.classList.toggle('open');$('#nav-toggle').setAttribute('aria-expanded',String(nav.classList.contains('open')))};
$$('.primary-nav a').forEach(a=>a.onclick=()=>{$('.primary-nav').classList.remove('open');$('#nav-toggle').setAttribute('aria-expanded','false')});
const dialog=$('#game-dialog'),viewport=$('#player-viewport');let frame=null;
async function launch(id){const g=games.find(g=>g.id===id);if(!g)return;if(installed[g.file]!==true){notify('This ROM is not installed');return}
try{const res=await fetch('./'+g.file,{method:'HEAD'});if(!res.ok)throw Error('ROM not found')}catch{notify('This ROM cannot be reached right now');return}
const s=system(g.system);$('#player-title').textContent=g.name;$('#player-system').textContent=s.name.toUpperCase()+' / GENUINE CONSOLE EMULATION';$('#player-status').textContent='LOADING '+s.short+' EMULATOR';viewport.replaceChildren();frame=document.createElement('iframe');frame.title='UGN Emulator — '+g.name;frame.allow='autoplay; fullscreen; gamepad';frame.setAttribute('allowfullscreen','');frame.setAttribute('referrerpolicy','no-referrer');viewport.append(frame);
const rom=new URL('./'+g.file,location.href).href;
const safe=v=>JSON.stringify(v).replace(/</g,'\\u003c');
frame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#030816;margin:0;color:#fff"><div id="game" style="height:100dvh;width:100vw"></div><script>window.EJS_player="#game";window.EJS_core='+safe(s.core)+';window.EJS_gameUrl='+safe(rom)+';window.EJS_gameName='+safe(g.name)+';window.EJS_pathtodata="https://cdn.emulatorjs.org/stable/data/";window.EJS_startOnLoaded=true;window.EJS_color="#00d4ff";window.EJS_backgroundColor="#040b1b";window.EJS_Buttons={playPause:true,restart:true,mute:true,settings:true,fullscreen:true,saveState:true,loadState:true};window.addEventListener("error",function(e){parent.postMessage({ugnError:e.message},"*")});<\/script><script src="https://cdn.emulatorjs.org/stable/data/loader.js"><\/script></body></html>';
memory.played[g.id]=(memory.played[g.id]||0)+1;memory.recent=[g.id,...memory.recent.filter(x=>x!==g.id)].slice(0,8);save();renderHistory();dialog.showModal();
}
$('#player-close').onclick=()=>dialog.close();
$('#player-fullscreen').onclick=()=>{if(!document.fullscreenElement)dialog.requestFullscreen?.().catch(()=>notify('Fullscreen is unavailable'));else document.exitFullscreen?.()};
dialog.addEventListener('close',()=>{viewport.replaceChildren();frame=null});
window.addEventListener('message',e=>{if(!frame||e.source!==frame.contentWindow)return;if(e.data?.ugnError)$('#player-status').textContent='EMULATOR ERROR: '+String(e.data.ugnError).slice(0,150)});
async function validateROMS(){await Promise.all(games.map(async g=>{try{let res=await fetch('./'+g.file,{method:'HEAD',cache:'no-store'});installed[g.file]=res.ok&&Number(res.headers.get('content-length')||10000)>2000}catch{installed[g.file]=false}}));renderSystems();renderGames();renderHistory();changeSpot(0);window.__ugnArchiveRefresh?.();}
renderPills();renderSystems();renderGames();renderHistory();validateROMS();
/* Galactic Archive: the starship world is the primary UI. The classic console grid remains an accessibility fallback. */
if(document.querySelector('#galactic-stage')){
  import('./galactic.js').then(module=>{
    module.mountGalacticArchive({
      systems:systemCatalog,
      games,
      installed,
      launch,
      photo,
      notify,
      selectSystem
    });
    window.__ugnArchiveRefresh?.();
  }).catch(err=>{
    console.error('Galactic Archive could not start',err);
    notify('3D world temporarily unavailable — open the classic library below');
  });
}
