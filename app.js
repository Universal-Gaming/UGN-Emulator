/* UGN Emulator — genuine retro console cores, exclusively preinstalled licensed ROMs. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const systems=[
{id:'nes',title:'Nintendo NES',family:'NINTENDO',icon:'▦',state:'ready'},
{id:'segaMD',title:'Sega Genesis',family:'SEGA',icon:'◆',state:'ready'},
{id:'segaGG',title:'Game Gear',family:'SEGA',icon:'▣',state:'planned'},
{id:'sega32x',title:'Sega 32X',family:'SEGA',icon:'⬡',state:'planned'},
{id:'segaCD',title:'Sega CD',family:'SEGA',icon:'◉',state:'planned'},
{id:'segaSaturn',title:'Sega Saturn',family:'SEGA',icon:'◈',state:'planned'},
{id:'gb',title:'Game Boy',family:'NINTENDO',icon:'▥',state:'ready'},
{id:'gbc',title:'Game Boy Color',family:'NINTENDO',icon:'▨',state:'ready'},
{id:'gba',title:'Game Boy Advance',family:'NINTENDO',icon:'▰',state:'ready'},
{id:'nds',title:'Nintendo DS',family:'NINTENDO',icon:'▤',state:'planned'},
{id:'arcade',title:'Neo Geo AES / MVS',family:'SNK',icon:'✦',state:'planned'},
{id:'ngp',title:'Neo Geo Pocket',family:'SNK',icon:'▣',state:'planned'},
{id:'snes',title:'Super Nintendo',family:'NINTENDO',icon:'▧',state:'planned'},
{id:'n64',title:'Nintendo 64',family:'NINTENDO',icon:'⬢',state:'planned'},
{id:'psx',title:'PlayStation 1',family:'SONY',icon:'◎',state:'planned'},
{id:'atari2600',title:'Atari 2600',family:'ATARI',icon:'✹',state:'planned'},
{id:'flash',title:'Classic Flash',family:'OTHER',icon:'⚡',state:'planned'}
];
const games=[
{id:'tobudx',name:'Tobu Tobu Girl Deluxe',core:'gbc',file:'roms/gb/tobudx.gb',tag:'ACTION / PLATFORMER',symbol:'✦',color:'#f08cbe',credit:'Simon Larsen / Tangram Games',description:'A genuine Game Boy Color platforming homebrew.'},
{id:'ucity',name:'µCity',core:'gbc',file:'roms/gbc/ucity.gbc',tag:'SIMULATION / CITY',symbol:'▥',color:'#68eab5',credit:'Antonio Niño Díaz',description:'Build and manage your own miniature city.'},
{id:'geometrix',name:'Geometrix',core:'gbc',file:'roms/gbc/geometrix.gbc',tag:'PUZZLE',symbol:'◇',color:'#a7acff',credit:'Antonio Niño Díaz',description:'Original geometric puzzle game for Game Boy Color.'},
{id:'libbet',name:'Libbet and the Magic Floor',core:'gb',file:'roms/gb/libbet.gb',tag:'PUZZLE',symbol:'▧',color:'#f7dd91',credit:'Damian Yerrick',description:'A real Game Boy puzzle game involving a magical floor.'},
{id:'nes2048',name:'2048 NES',core:'nes',file:'roms/nes/2048.nes',tag:'PUZZLE',symbol:'▦',color:'#94e6ff',credit:'mmuszkow',description:'The iconic number puzzle compiled for the NES.'},
{id:'tennis',name:'8-Bit Table Tennis',core:'nes',file:'roms/nes/table-tennis.nes',tag:'SPORTS',symbol:'◉',color:'#60c5fd',credit:'mike42',description:'Play original homebrew table tennis on a NES core.'},
{id:'cebelix',name:'Cebelix',core:'gba',file:'roms/gba/cebelix.gba',tag:'GBA HOMEBREW',symbol:'◆',color:'#dc91ff',credit:'gbadev contributors',description:'Game Boy Advance homebrew.'},
{id:'dezgex',name:'Dezgex',core:'gba',file:'roms/gba/dezgex.gba',tag:'GBA HOMEBREW',symbol:'✧',color:'#77e6eb',credit:'gbadev contributors',description:'Game Boy Advance homebrew.'},
{id:'mystic',name:'Mystic Q',core:'gba',file:'roms/gba/mystic-q.gba',tag:'GBA HOMEBREW',symbol:'☾',color:'#ff94c4',credit:'gbadev contributors',description:'Game Boy Advance homebrew.'},
{id:'pik',name:'Pik Roll',core:'gba',file:'roms/gba/pik-roll.gba',tag:'GBA HOMEBREW',symbol:'◈',color:'#d9fa92',credit:'gbadev contributors',description:'Game Boy Advance homebrew.'},
{id:'tank',name:'Tank Battle',core:'segaMD',file:'roms/genesis/tank-battle.bin',tag:'ACTION / 1-2 PLAYERS',symbol:'⬡',color:'#a4ff9a',credit:'monteslu',description:'Sega Genesis homebrew tank combat.'},
{id:'tris',name:'Battle 4Tris',core:'segaMD',file:'roms/genesis/battle-4tris.bin',tag:'PUZZLE / 1-2 PLAYERS',symbol:'▥',color:'#8dd7ff',credit:'monteslu',description:'A competitive Sega Genesis puzzle game.'},
{id:'shooter',name:'Space Shooter',core:'segaMD',file:'roms/genesis/space-shooter.bin',tag:'ACTION / 1-2 PLAYERS',symbol:'✦',color:'#ffb7a7',credit:'monteslu',description:'Vertical shooting homebrew for Sega Genesis.'}
];
const KEY='ugn-console-history-v2';let history={played:{},recent:[],favorites:[]};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');if(saved&&typeof saved==='object')history={...history,...saved}}catch{}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(history))}catch{}};
const toast=msg=>{let t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>t.classList.remove('show'),3400)};
let filter='all',query='',sort='featured',available={},active=null;
const sysName=id=>systems.find(s=>s.id===id)?.title||id;
function render(){
let selected=games.filter(g=>(filter==='all'||filter===g.core)&&(g.name+' '+g.description+' '+sysName(g.core)).toLowerCase().includes(query));
if(sort==='name')selected.sort((a,b)=>a.name.localeCompare(b.name));
if(sort==='console')selected.sort((a,b)=>sysName(a.core).localeCompare(sysName(b.core)));
$('#game-grid').innerHTML=selected.map(g=>{const ready=available[g.file]===true,missing=available[g.file]===false;return '<article class="game-card"><div class="game-cover" style="--glow:'+g.color+'"><span class="game-badge">'+sysName(g.core)+'</span><button class="fav-btn '+(history.favorites.includes(g.id)?'active':'')+'" data-fav="'+g.id+'" aria-label="Favorite '+g.name+'" aria-pressed="'+history.favorites.includes(g.id)+'">♥</button><span class="game-glyph">'+g.symbol+'</span></div><div class="game-meta"><h3>'+g.name+'</h3><p>'+g.description+'</p><div class="game-foot"><span>'+(ready?'ROM INSTALLED':missing?'ROM PENDING':'CHECKING ROM')+'</span><button class="play-btn" data-play="'+g.id+'" '+(missing?'disabled':'')+'>'+(missing?'PENDING':'PLAY GAME ↗')+'</button></div></div></article>'}).join('');
$('#no-results').hidden=selected.length>0;
$$('[data-fav]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.fav;history.favorites=history.favorites.includes(id)?history.favorites.filter(x=>x!==id):[...history.favorites,id];save();render();renderHistory()}));
$$('[data-play]').forEach(b=>b.addEventListener('click',()=>launch(b.dataset.play)));
}
function renderSystems(){
$('#console-grid').innerHTML=systems.map(s=>{const count=games.filter(g=>g.core===s.id&&available[g.file]===true).length;return '<button class="console-card '+(count?'':'experimental')+'" data-system="'+s.id+'"><span class="console-status">'+(count?count+' GAME'+(count>1?'S':''):'NOT INSTALLED')+'</span><span class="console-icon">'+s.icon+'</span><strong>'+s.title+'</strong><small>'+s.family+' · '+(count?'LAUNCH READY':'COMING LATER')+'</small></button>'}).join('');
$$('[data-system]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.system;if(!games.some(g=>g.core===id)){toast('No licensed built-in games for this console yet');return}filter=id;$$('.pill').forEach(p=>p.classList.toggle('active',p.dataset.category===id));document.querySelector('#emulator').scrollIntoView({behavior:'smooth'});render()}));
}
function renderHistory(){
$('#vault-played').textContent=Object.keys(history.played).length;
$('#vault-favs').textContent=history.favorites.length;
$('#vault-scores').textContent=systems.filter(s=>games.some(g=>g.core===s.id&&available[g.file])).length;
$('#recent-games').innerHTML=history.recent.map(id=>{const g=games.find(x=>x.id===id);return g?'<button data-recent="'+id+'">'+g.symbol+' '+g.name+'</button>':''}).join('');
$$('[data-recent]').forEach(b=>b.onclick=()=>launch(b.dataset.recent));
}
$('#stat-games').textContent=games.length;
$('#category-pills').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;filter=b.dataset.category;$$('.pill').forEach(x=>x.classList.toggle('active',x===b));render()});
$('#search').oninput=e=>{query=e.target.value.toLowerCase();render()};
$('#sort').onchange=e=>{sort=e.target.value;render()};
$('#random-game').onclick=()=>{const installed=games.filter(g=>available[g.file]);if(!installed.length){toast('ROM bundle still deploying');return}launch(installed[Math.floor(Math.random()*installed.length)].id)};
$('#export-data').onclick=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(history,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='ugn-emulator-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)};
render();renderSystems();renderHistory();
async function checkROMS(){
await Promise.all(games.map(async g=>{try{const r=await fetch('./'+g.file,{method:'HEAD',cache:'no-store'});available[g.file]=r.ok}catch{available[g.file]=false}}));
render();renderSystems();renderHistory();
}
checkROMS();
const dlg=$('#emulator-dialog'),host=$('#emulator-host'),status=$('#emulator-status');
async function launch(id){
const g=games.find(g=>g.id===id);if(!g)return;
if(available[g.file]===false){toast('ROM not installed yet. Please check after bundle deployment');return}
try{const response=await fetch('./'+g.file,{method:'HEAD'});if(!response.ok)throw Error('ROM missing ('+response.status+')')}catch(e){toast('This ROM is not installed yet');available[g.file]=false;render();return}
active=g;history.played[g.id]=(history.played[g.id]||0)+1;history.recent=[g.id,...history.recent.filter(x=>x!==g.id)].slice(0,8);save();renderHistory();
$('#play-title').textContent=g.name.toUpperCase();$('#play-tag').textContent=sysName(g.core)+' · ACTUAL CONSOLE ROM';status.textContent='Loading '+g.name+' through the '+sysName(g.core)+' emulation core…';host.replaceChildren();
const frame=document.createElement('iframe');frame.title='UGN Emulator: '+g.name;frame.allow='autoplay; fullscreen; gamepad';frame.setAttribute('allowfullscreen','');frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#030711';host.appendChild(frame);
const gamePath=new URL('./'+g.file,location.href).href;
const safePath=JSON.stringify(gamePath).replace(/</g,'\\u003c');
const safeCore=JSON.stringify(g.core==='gbc'?'gb':g.core);
const safeName=JSON.stringify(g.name).replace(/</g,'\\u003c');
frame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#020614;color:white"><div id="game" style="height:100dvh;width:100vw"></div><script>window.EJS_player="#game";window.EJS_core='+safeCore+';window.EJS_gameUrl='+safePath+';window.EJS_gameName='+safeName+';window.EJS_pathtodata="https://cdn.emulatorjs.org/stable/data/";window.EJS_startOnLoaded=true;window.EJS_color="#00d4ff";window.EJS_backgroundColor="#050b1b";window.EJS_backgroundImage="";window.EJS_Buttons={playPause:true,restart:true,mute:true,settings:true,fullscreen:true,saveState:true,loadState:true,screenRecord:false};window.addEventListener("error",e=>parent.postMessage({ugnEmulatorError:String(e.message)},"*"));<\/script><script src="https://cdn.emulatorjs.org/stable/data/loader.js"><\/script></body></html>';
dlg.showModal();status.textContent='Emulator core loading from EmulatorJS; game ROM hosted inside the UGN repository.';
}
$('#close-game').onclick=()=>dlg.close();
$('#fullscreen-game').onclick=()=>{if(!document.fullscreenElement)dlg.requestFullscreen?.().catch(()=>toast('Fullscreen unavailable'));else document.exitFullscreen?.()};
dlg.addEventListener('close',()=>{active=null;host.replaceChildren()});
window.addEventListener('message',e=>{if(e.source!==host.querySelector('iframe')?.contentWindow)return;if(e.data?.ugnEmulatorError)status.textContent='Emulator error: '+e.data.ugnEmulatorError});

/* Lightweight original perspective renderer, no runtime dependencies. */
const mount=$('#scene'),scene=document.createElement('canvas');mount.append(scene);const sc=scene.getContext('2d');let turning=true,angle=.25,targetAngle=.25,drag=false,lastX=0,selected=0,sceneRaf=0;
function resize(){const d=Math.min(devicePixelRatio||1,1.7);scene.width=Math.floor(mount.clientWidth*d);scene.height=Math.floor(mount.clientHeight*d);sc.setTransform(d,0,0,d,0,0)}
window.addEventListener('resize',resize);resize();
function project(x,y,z,w,h){const ca=Math.cos(angle),sa=Math.sin(angle),rx=x*ca-z*sa,rz=x*sa+z*ca+9,scale=Math.min(w,h)*.9/(rz+3);return {x:w*.68+rx*scale,y:h*.52-y*scale,s:scale}}
function line3(a,b,color,w,h){const p=project(...a,w,h),q=project(...b,w,h);sc.strokeStyle=color;sc.lineWidth=1;sc.beginPath();sc.moveTo(p.x,p.y);sc.lineTo(q.x,q.y);sc.stroke()}
function poly(points,color,w,h){sc.beginPath();points.forEach((v,i)=>{const p=project(...v,w,h);if(i)sc.lineTo(p.x,p.y);else sc.moveTo(p.x,p.y)});sc.closePath();sc.fillStyle=color;sc.fill()}
function cabinet(x,z,n,w,h){const y=-1.05,wide=.9,dep=.68,top=2.2;poly([[x-wide,y,z-dep],[x+wide,y,z-dep],[x+wide,top,z-dep],[x-wide,top,z-dep]],'#172650',w,h);poly([[x+wide,y,z-dep],[x+wide,y,z+dep],[x+wide,top,z+dep],[x+wide,top,z-dep]],'#152042',w,h);poly([[x-wide,top,z-dep],[x+wide,top,z-dep],[x+wide,top,z+dep],[x-wide,top,z+dep]],'#294273',w,h);poly([[x-.68,.1,z-dep-.015],[x+.68,.1,z-dep-.015],[x+.68,1.57,z-dep-.015],[x-.68,1.57,z-dep-.015]],['#1daabe','#865cfd','#49cd83','#db6b98'][n%4],w,h);poly([[x-.57,.22,z-dep-.02],[x+.57,.22,z-dep-.02],[x+.57,1.43,z-dep-.02],[x-.57,1.43,z-dep-.02]],'#06152f',w,h);poly([[x-.69,1.75,z-dep-.02],[x+.69,1.75,z-dep-.02],[x+.69,2.08,z-dep-.02],[x-.69,2.08,z-dep-.02]],'#1a4a72',w,h);const p=project(x,1.91,z-dep-.05,w,h);sc.fillStyle='#c1faff';sc.font=Math.max(8,p.s*.22)+'px monospace';sc.textAlign='center';sc.fillText(['UGN','RETRO','PLAY','SPACE'][n%4],p.x,p.y+4);const screen=project(x,.85,z-dep-.04,w,h);sc.font=Math.max(12,screen.s*.75)+'px monospace';sc.fillStyle=['#5cfc76','#00d4ff','#b09aff','#fc8fc2'][n%4];sc.fillText(['✦','◈','◉','◆'][n%4],screen.x,screen.y+15);const button=project(x,-.18,z-dep-.04,w,h);sc.fillStyle='#51fdda';sc.beginPath();sc.arc(button.x,button.y,Math.max(2,button.s*.09),0,Math.PI*2);sc.fill()}
function drawScene(t){const w=mount.clientWidth,h=mount.clientHeight;sc.clearRect(0,0,w,h);const grad=sc.createRadialGradient(w*.68,h*.55,10,w*.68,h*.55,w*.7);grad.addColorStop(0,'#17426a');grad.addColorStop(.45,'#1b174b');grad.addColorStop(1,'#040b20');sc.fillStyle=grad;sc.fillRect(0,0,w,h);for(let i=0;i<150;i++){const x=(i*131.91)%w,y=(i*79.31)%h;sc.fillStyle=i%7?'#a1bfea55':'#9becf9aa';sc.fillRect(x,y,i%4?1:2,i%4?1:2)}if(turning&&!drag){angle+=(targetAngle-angle)*.028;targetAngle=.28+Math.sin(t*.00015)*.13}for(let i=-9;i<=9;i++)line3([i,-1.12,-8],[i,-1.12,8],'#1c557166',w,h);for(let i=-8;i<=8;i++)line3([-9,-1.12,i],[9,-1.12,i],'#1c557166',w,h);[[-3.5,0],[-1.25,-.4],[1.2,.1],[3.5,-.2]].forEach(([x,z],i)=>cabinet(x,z,i,w,h));if(turning)sceneRaf=requestAnimationFrame(drawScene)}
scene.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;scene.setPointerCapture(e.pointerId)});
scene.addEventListener('pointermove',e=>{if(drag){angle+=(e.clientX-lastX)*.005;targetAngle=angle;lastX=e.clientX}});
scene.addEventListener('pointerup',e=>{if(!drag)return;drag=false;if(Math.abs(angle-targetAngle)<.1)toast('Explore consoles below • original games are ready to play')});
$('#scene-toggle').onclick=()=>{turning=!turning;$('#scene-toggle').textContent=turning?'✦ 3D ON':'✦ 3D PAUSED';if(turning)sceneRaf=requestAnimationFrame(drawScene);else cancelAnimationFrame(sceneRaf)};
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)sceneRaf=requestAnimationFrame(drawScene);else{turning=false;drawScene(0);$('#scene-toggle').textContent='✦ 3D PAUSED'}
