/* UGN Emulator — fully original, first-party browser games. No ROM uploads. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const games=[
{id:'nebula',name:'Nebula Defender',type:'action',icon:'✦',glow:'#1efad3',desc:'Defend the sector from incoming cosmic threats.',help:'← → move • SPACE fire. Survive the waves.'},
{id:'snake',name:'Cosmic Serpent',type:'arcade',icon:'〰',glow:'#61ff8e',desc:'Gobble star shards and grow across the grid.',help:'Arrow keys to steer. Avoid your tail and the walls.'},
{id:'pong',name:'Orbit Pong',type:'arcade',icon:'◉',glow:'#29d6ff',desc:'Classic paddle duels against a clever AI.',help:'↑ ↓ or W S move your paddle. First to 7 wins.'},
{id:'breakout',name:'Prism Breaker',type:'arcade',icon:'▤',glow:'#a581ff',desc:'Shatter glowing cosmic crystals with your energy ball.',help:'← → move paddle • SPACE launch.'},
{id:'dodge',name:'Meteor Run',type:'action',icon:'☄',glow:'#ff9a72',desc:'Pilot between falling asteroids as speed increases.',help:'← → move. Avoid the meteors.'},
{id:'memory',name:'Signal Match',type:'puzzle',icon:'◇',glow:'#e89aff',desc:'Decode and match the hidden pairs of star signals.',help:'Click two tiles to reveal and match their signals.'},
{id:'reaction',name:'Hyper Reflex',type:'arcade',icon:'⚡',glow:'#faff75',desc:'Tap targets before they fade into the void.',help:'Click or tap the glowing circles. Missed targets cost lives.'},
{id:'lander',name:'Lunar Descent',type:'chill',icon:'☾',glow:'#8fd7ff',desc:'Land a spacecraft safely on the alien moon.',help:'← → rotate • ↑ or SPACE thrust • land slowly and upright.'}
];
const systemData=[
['NES','8-BIT CLASSICS','▦'],['SNES','16-BIT CLASSICS','▤'],['Game Boy','HANDHELD','▣'],['Game Boy Color','HANDHELD','▨'],['Game Boy Advance','HANDHELD','◈'],['Genesis','16-BIT CLASSICS','◆'],['Master System','8-BIT CLASSICS','◇'],['Game Gear','HANDHELD','▣'],['N64','3D CLASSICS','⬡'],['PlayStation','DISC CLASSICS','◉'],['Nintendo DS','DUAL SCREEN','▥'],['PSP','RESEARCH ONLY','▰'],['GameCube','RESEARCH ONLY','⬢'],['Wii','RESEARCH ONLY','◐'],['PS2','RESEARCH ONLY','▱']
];
const KEY='ugn-emulator-local-v1';let store={scores:{},plays:{},favs:[],recent:[]};try{store={...store,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
let activeCategory='all',search='',sort='featured';
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(store))}catch{}};
const toast=s=>{const t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2800)};
function renderGames(){
let list=games.filter(g=>(activeCategory==='all'||(activeCategory==='favorites'?store.favs.includes(g.id):g.type===activeCategory))&&(g.name+' '+g.desc).toLowerCase().includes(search));
if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
if(sort==='highscore')list.sort((a,b)=>(store.scores[b.id]||0)-(store.scores[a.id]||0));
$('#game-grid').innerHTML=list.map(g=>'<article class="game-card"><div class="game-cover" style="--glow:'+g.glow+'"><span class="game-badge">UGN ORIGINAL</span><button class="fav-btn '+(store.favs.includes(g.id)?'active':'')+'" data-fav="'+g.id+'" aria-label="Toggle favorite" aria-pressed="'+store.favs.includes(g.id)+'">♥</button><span class="game-glyph">'+g.icon+'</span></div><div class="game-meta"><h3>'+g.name+'</h3><p>'+g.desc+'</p><div class="game-foot"><span>BEST '+(store.scores[g.id]||0)+'</span><button class="play-btn" data-play="'+g.id+'">PLAY NOW ↗</button></div></div></article>').join('');
$('#no-results').hidden=!!list.length;
$$('[data-fav]').forEach(b=>b.onclick=()=>{const id=b.dataset.fav;store.favs=store.favs.includes(id)?store.favs.filter(v=>v!==id):[...store.favs,id];persist();renderGames();renderVault()});
$$('[data-play]').forEach(b=>b.onclick=()=>launch(b.dataset.play));
}
function renderVault(){
$('#vault-played').textContent=Object.keys(store.plays||{}).length;
$('#vault-favs').textContent=store.favs.length;
$('#vault-scores').textContent=Object.keys(store.scores||{}).length;
$('#recent-games').innerHTML=(store.recent||[]).slice(0,6).map(id=>{const g=games.find(x=>x.id===id);return g?'<button data-recent="'+id+'">'+g.icon+' '+g.name+'</button>':''}).join('');
$$('[data-recent]').forEach(b=>b.onclick=()=>launch(b.dataset.recent));
}
$('#stat-games').textContent=games.length;
$('#console-grid').innerHTML=systemData.map(([name,desc,icon],i)=>'<div class="console-card experimental"><span class="console-status">PLANNED</span><span class="console-icon">'+icon+'</span><strong>'+name+'</strong><small>'+desc+'</small></div>').join('');
$('#category-pills').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;$$('.pill').forEach(x=>x.classList.toggle('active',x===b));renderGames()});
$('#search').oninput=e=>{search=e.target.value.toLowerCase();renderGames()};
$('#sort').onchange=e=>{sort=e.target.value;renderGames()};
$('#random-game').onclick=()=>launch(games[Math.floor(Math.random()*games.length)].id);
$('#export-data').onclick=()=>{const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ugn-emulator-stats.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('Local stats exported')};
renderGames();renderVault();
const canvas=$('#game-canvas'),ctx=canvas.getContext('2d'),W=800,H=450;let game=null,raf=0,last=0,elapsed=0,paused=false,keys=new Set(),pointer={x:400,y:225,down:false};
function rand(a,b){return a+Math.random()*(b-a)}
function background(){ctx.fillStyle='#050b1f';ctx.fillRect(0,0,W,H);for(let i=0;i<58;i++){const x=(i*137.3+elapsed*8*(i%3+1))%W,y=(i*71.1+Math.floor(i/7)*37)%H;ctx.fillStyle=i%5?'#29446d':'#5e9be0';ctx.fillRect(x,y,i%3?1:2,i%3?1:2)}}
function text(t,x,y,size=20,color='#d4edff',align='center'){ctx.fillStyle=color;ctx.font='700 '+size+'px "Chakra Petch",monospace';ctx.textAlign=align;ctx.fillText(t,x,y)}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function circle(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function init(id){const g={id,score:0,over:false,won:false,t:0,lives:3,balls:[],shots:[],enemies:[],grid:[],state:'ready'};switch(id){
case 'snake':g.snake=[{x:12,y:10},{x:11,y:10},{x:10,y:10}];g.dir={x:1,y:0};g.next=g.dir;g.food={x:6,y:6};g.tick=0;break;
case 'pong':g.py=190;g.ai=190;g.bx=400;g.by=220;g.vx=240;g.vy=120;g.opp=0;break;
case 'breakout':g.px=350;g.bx=400;g.by=360;g.vx=155;g.vy=-230;g.started=false;g.bricks=Array.from({length:60},(_,i)=>({x:48+(i%10)*71,y:55+Math.floor(i/10)*28,on:true}));break;
case 'nebula':g.px=400;g.spawn=0;g.shotTimer=0;break;
case 'dodge':g.px=400;g.spawn=0;g.speed=150;break;
case 'memory':g.cards=Array.from({length:16},(_,i)=>({value:i%8,open:false,matched:false}));for(let i=g.cards.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[g.cards[i],g.cards[j]]=[g.cards[j],g.cards[i]]}g.chosen=[];g.moves=0;g.hideAt=0;break;
case 'reaction':g.target={x:rand(70,730),y:rand(100,385),r:35};g.timer=0;break;
case 'lander':g.x=400;g.y=85;g.vx=0;g.vy=0;g.angle=0;g.fuel=100;break;
}return g}
function score(n){if(!game||game.over)return;game.score+=n;$('#game-score').textContent='SCORE '+String(game.score).padStart(6,'0');if(game.score>(store.scores[game.id]||0)){$('#game-best').textContent='BEST '+String(game.score).padStart(6,'0');store.scores[game.id]=game.score;persist();}}
function end(won=false){if(!game||game.over)return;game.over=true;game.won=won;$('#game-state').textContent=won?'CLEARED':'GAME OVER';$('#game-hint').textContent='Press R or restart ↺ to play again';persist();renderVault();renderGames()}
function launch(id){const g=games.find(g=>g.id===id);if(!g)return;stop();game=init(id);paused=false;elapsed=0;last=0;keys.clear();$('#play-title').textContent=g.name.toUpperCase();$('#play-tag').textContent='UGN ORIGINAL • '+g.type.toUpperCase();$('#game-instructions').textContent=g.help;$('#game-hint').textContent='';$('#game-state').textContent='LIVE';$('#game-score').textContent='SCORE 000000';$('#game-best').textContent='BEST '+String(store.scores[id]||0).padStart(6,'0');store.plays[id]=(store.plays[id]||0)+1;store.recent=[id,...(store.recent||[]).filter(x=>x!==id)].slice(0,10);persist();renderVault();$('#game-dialog').showModal();canvas.focus();raf=requestAnimationFrame(loop)}
function stop(){cancelAnimationFrame(raf);game=null;keys.clear();last=0;paused=false}
function loop(ts){if(!game)return;let dt=Math.min((ts-last)/1000||0,.04);last=ts;if(!paused&&!game.over){elapsed+=dt;game.t+=dt;update(game,dt)}draw(game);raf=requestAnimationFrame(loop)}
function pressed(...options){return options.some(k=>keys.has(k))}
function update(g,dt){switch(g.id){
case 'snake':{if(pressed('ArrowUp','KeyW')&&g.dir.y!==1)g.next={x:0,y:-1};else if(pressed('ArrowDown','KeyS')&&g.dir.y!==-1)g.next={x:0,y:1};else if(pressed('ArrowLeft','KeyA')&&g.dir.x!==1)g.next={x:-1,y:0};else if(pressed('ArrowRight','KeyD')&&g.dir.x!==-1)g.next={x:1,y:0};g.tick+=dt;if(g.tick>.115){g.tick=0;g.dir=g.next;const h={x:g.snake[0].x+g.dir.x,y:g.snake[0].y+g.dir.y};const eat=h.x===g.food.x&&h.y===g.food.y;const body=eat?g.snake:g.snake.slice(0,-1);if(h.x<0||h.x>=25||h.y<0||h.y>=17||body.some(s=>s.x===h.x&&s.y===h.y)){end();break}g.snake.unshift(h);if(eat){score(10);let attempts=0;do{g.food={x:Math.floor(rand(0,25)),y:Math.floor(rand(0,17))}}while(g.snake.some(s=>s.x===g.food.x&&s.y===g.food.y)&&++attempts<1000);if(g.snake.length===425)end(true)}else g.snake.pop()}break}
case 'pong':{let d=pressed('ArrowUp','KeyW')?-1:pressed('ArrowDown','KeyS')?1:0;g.py=Math.max(18,Math.min(342,g.py+d*320*dt));g.ai+=Math.sign(g.by-(g.ai+45))*Math.min(Math.abs(g.by-(g.ai+45)),200*dt);g.ai=Math.max(18,Math.min(342,g.ai));g.bx+=g.vx*dt;g.by+=g.vy*dt;if(g.by<13||g.by>H-13)g.vy*=-1;if(g.bx<38&&g.vx<0&&g.by>g.py&&g.by<g.py+90){g.vx=Math.abs(g.vx)*1.07;g.vy+=(g.by-g.py-45)*2}else if(g.bx>W-38&&g.vx>0&&g.by>g.ai&&g.by<g.ai+90){g.vx=-Math.abs(g.vx)*1.07;g.vy+=(g.by-g.ai-45)*2}if(g.bx<0||g.bx>W){const player=g.bx>W;if(player)score(1);else g.opp++;g.bx=400;g.by=225;g.vx=(player?-1:1)*240;g.vy=rand(-170,170);if(g.score>=7||g.opp>=7)end(g.score>=7)}break}
case 'breakout':{let d=pressed('ArrowLeft','KeyA')?-1:pressed('ArrowRight','KeyD')?1:0;g.px=Math.max(0,Math.min(680,g.px+d*420*dt));if(!g.started){g.bx=g.px+60;g.by=360;if(pressed('Space','ArrowUp'))g.started=true;break}g.bx+=g.vx*dt;g.by+=g.vy*dt;if(g.bx<10||g.bx>790)g.vx*=-1;if(g.by<10)g.vy=Math.abs(g.vy);if(g.by>H){end();break}if(g.by>383&&g.by<403&&g.bx>g.px&&g.bx<g.px+120&&g.vy>0){g.vy=-Math.abs(g.vy);g.vx=(g.bx-g.px-60)*5}for(const b of g.bricks){if(b.on&&g.bx>b.x&&g.bx<b.x+64&&g.by>b.y&&g.by<b.y+20){b.on=false;g.vy*=-1;score(10);break}}if(g.bricks.every(b=>!b.on))end(true);break}
case 'nebula':{let d=pressed('ArrowLeft','KeyA')?-1:pressed('ArrowRight','KeyD')?1:0;g.px=Math.max(28,Math.min(772,g.px+d*370*dt));g.spawn-=dt;g.shotTimer-=dt;if(g.spawn<=0){g.spawn=Math.max(.25,1.05-g.t*.008);g.enemies.push({x:rand(35,765),y:-18,v:rand(55,135)+g.t*2})}if(pressed('Space','ArrowUp')&&g.shotTimer<=0){g.shotTimer=.17;g.shots.push({x:g.px,y:380})}g.shots.forEach(s=>s.y-=550*dt);g.enemies.forEach(e=>e.y+=e.v*dt);g.shots=g.shots.filter(s=>s.y>-20);for(const e of g.enemies){if(e.y>H-35||Math.hypot(e.x-g.px,e.y-406)<27){e.dead=true;g.lives--;if(g.lives<=0)end()}for(const s of g.shots){if(Math.abs(s.x-e.x)<18&&Math.abs(s.y-e.y)<18&&!e.dead){e.dead=true;s.y=-999;score(15)}}}g.enemies=g.enemies.filter(e=>!e.dead);break}
case 'dodge':{let d=pressed('ArrowLeft','KeyA')?-1:pressed('ArrowRight','KeyD')?1:0;g.px=Math.max(30,Math.min(770,g.px+d*420*dt));g.spawn-=dt;if(g.spawn<0){g.spawn=Math.max(.19,.65-g.t*.005);g.enemies.push({x:rand(26,774),y:-20,r:rand(12,28),v:rand(145,220)+g.t*3})}for(const e of g.enemies){e.y+=e.v*dt;if(Math.hypot(g.px-e.x,405-e.y)<e.r+18){end();break}if(e.y>470){e.dead=true;score(5)}}g.enemies=g.enemies.filter(e=>!e.dead);break}
case 'memory':if(g.hideAt&&g.t>g.hideAt){for(const i of g.chosen)g.cards[i].open=false;g.chosen=[];g.hideAt=0}break;
case 'reaction':g.timer+=dt;if(g.timer>1.4){g.timer=0;g.lives--;g.target={x:rand(75,725),y:rand(85,370),r:rand(22,42)};if(g.lives<=0)end()}break;
case 'lander':{if(pressed('ArrowLeft','KeyA'))g.angle-=2.2*dt;if(pressed('ArrowRight','KeyD'))g.angle+=2.2*dt;if(pressed('ArrowUp','KeyW','Space')&&g.fuel>0){g.vx+=Math.sin(g.angle)*155*dt;g.vy-=Math.cos(g.angle)*155*dt;g.fuel=Math.max(0,g.fuel-17*dt)}g.vy+=64*dt;g.x+=g.vx*dt;g.y+=g.vy*dt;if(g.x<0)g.x=W;if(g.x>W)g.x=0;if(g.y>=390){g.y=390;if(g.x>300&&g.x<500&&Math.abs(g.angle)<.16&&Math.abs(g.vy)<48&&Math.abs(g.vx)<38){score(Math.round(g.fuel*10+500));end(true)}else end()}break}
}}
function draw(g){background();switch(g.id){
case 'snake':{const z=22,x0=125,y0=35;for(let y=0;y<17;y++)for(let x=0;x<25;x++)rect(x0+x*z,y0+y*z,z-2,z-2,(x+y)%2?'#101d38':'#10213b');circle(x0+(g.food.x+.5)*z,y0+(g.food.y+.5)*z,8,'#ff8bae');g.snake.forEach((s,i)=>rect(x0+s.x*z,y0+s.y*z,z-2,z-2,i?'#2fe1bc':'#c8ff73'));text('LENGTH '+g.snake.length,690,28,15,'#75fbac');break}
case 'pong':rect(392,0,5,450,'#182a52');rect(23,g.py,13,90,'#5cfc76');rect(764,g.ai,13,90,'#00d4ff');circle(g.bx,g.by,9,'#f0f9ff');text(g.score+'  :  '+g.opp,400,75,45);break;
case 'breakout':{const colors=['#46daf6','#8873ff','#e181ff','#66faaa','#fcd977','#f884bd'];for(let i=0;i<g.bricks.length;i++){const b=g.bricks[i];if(b.on)rect(b.x,b.y,64,20,colors[Math.floor(i/10)])}rect(g.px,399,120,13,'#5cfc76');circle(g.bx,g.by,9,'#fff');if(!g.started)text('PRESS SPACE TO LAUNCH',400,340,22,'#c5e8fc');break}
case 'nebula':{ctx.fillStyle='#183b65';ctx.beginPath();ctx.moveTo(g.px,380);ctx.lineTo(g.px+24,430);ctx.lineTo(g.px-24,430);ctx.closePath();ctx.fill();ctx.fillStyle='#5cfc76';ctx.beginPath();ctx.moveTo(g.px,380);ctx.lineTo(g.px+14,420);ctx.lineTo(g.px-14,420);ctx.fill();for(const s of g.shots)rect(s.x-2,s.y-10,4,17,'#aeffa3');for(const e of g.enemies){circle(e.x,e.y,18,'#ad53f0');circle(e.x,e.y,9,'#e6a7ff')}text('SHIELDS '+g.lives,95,37,16,'#5cfc76');break}
case 'dodge':{rect(35,0,2,450,'#2e5480');rect(763,0,2,450,'#2e5480');ctx.beginPath();ctx.moveTo(g.px,382);ctx.lineTo(g.px+19,428);ctx.lineTo(g.px-19,428);ctx.closePath();ctx.fillStyle='#59ffe0';ctx.fill();for(const e of g.enemies){circle(e.x,e.y,e.r,'#754e59');circle(e.x-5,e.y-4,e.r*.4,'#c17962')}text('DISTANCE '+Math.floor(g.t*10),680,33,16,'#c2edff');break}
case 'memory':{const sy=42;g.cards.forEach((c,i)=>{const x=196+(i%4)*105,y=sy+Math.floor(i/4)*97;rect(x,y,88,81,c.matched?'#1c7469':c.open?'#283c78':'#122443');ctx.strokeStyle=c.open?'#a6b5ff':'#386185';ctx.strokeRect(x,y,88,81);text(c.open||c.matched?['✦','◈','◆','☾','☄','◉','✧','✳'][c.value]:'?',x+44,y+53,40,c.matched?'#5cfc76':'#a7dcff')});text('MATCHES '+g.score+'/8',400,438,16);break}
case 'reaction':{circle(g.target.x,g.target.y,g.target.r+10,'#153c57');circle(g.target.x,g.target.y,g.target.r,'#18dae5');circle(g.target.x,g.target.y,g.target.r*.48,'#d7fff8');text('LIVES '+g.lives,100,40,19,'#d7ff9e');text('HIT THE SIGNAL',680,40,16);break}
case 'lander':{rect(0,420,W,30,'#294c69');rect(300,417,200,4,'#5cfc76');ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.angle);rect(-17,-13,34,25,'#c5e9f6');rect(-8,-20,16,9,'#54c4ff');if(pressed('ArrowUp','Space','KeyW')&&g.fuel>0){ctx.beginPath();ctx.moveTo(-8,13);ctx.lineTo(0,29+Math.random()*15);ctx.lineTo(8,13);ctx.fillStyle='#ffac60';ctx.fill()}ctx.restore();text('FUEL '+Math.floor(g.fuel)+'%',100,35,17,'#5cfc76');text('SPEED '+Math.floor(Math.hypot(g.vx,g.vy)),680,35,17,'#9adfff');break}
}
if(paused||g.over){rect(0,0,W,H,'#030818bd');text(g.over?(g.won?'MISSION COMPLETE':'GAME OVER'):'PAUSED',400,198,48,g.won?'#5cfc76':'#fff');text(g.over?'PRESS R TO RESTART':'PRESS P TO RESUME',400,241,19,'#93d8f5')}
}
window.addEventListener('keydown',e=>{if(!game||!$('#game-dialog').open)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.code==='KeyP'&&!e.repeat){paused=!paused;$('#game-state').textContent=paused?'PAUSED':'LIVE'}if(e.code==='KeyR'&&!e.repeat)launch(game.id)});
window.addEventListener('keyup',e=>keys.delete(e.code));
canvas.addEventListener('pointerdown',e=>{if(!game||paused||game.over)return;const b=canvas.getBoundingClientRect();pointer.x=(e.clientX-b.left)/b.width*W;pointer.y=(e.clientY-b.top)/b.height*H;const g=game;if(g.id==='reaction'){if(Math.hypot(pointer.x-g.target.x,pointer.y-g.target.y)<g.target.r+7){score(10);g.timer=0;g.target={x:rand(75,725),y:rand(85,370),r:rand(22,42)}}}else if(g.id==='memory'){const x=pointer.x,y=pointer.y;const col=Math.floor((x-196)/105),row=Math.floor((y-42)/97),index=row*4+col;if(col<0||col>3||row<0||row>3||x>196+col*105+88||y>42+row*97+81||g.chosen.length===2)return;const c=g.cards[index];if(!c||c.open||c.matched)return;c.open=true;g.chosen.push(index);if(g.chosen.length===2){g.moves++;const [a,b]=g.chosen;if(g.cards[a].value===g.cards[b].value){g.cards[a].matched=g.cards[b].matched=true;score(1);g.chosen=[];if(g.score===8)end(true)}else g.hideAt=g.t+.75}}else if(g.id==='breakout')g.started=true});
for(const b of $$('[data-key]')){const code=b.dataset.key;const down=e=>{e.preventDefault();b.classList.add('pressed');keys.add(code)};const up=e=>{e.preventDefault();b.classList.remove('pressed');keys.delete(code)};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)}
$('#close-game').onclick=()=>$('#game-dialog').close();
$('#game-dialog').addEventListener('close',stop);
$('#restart-game').onclick=()=>{if(game)launch(game.id)};
$('#pause-game').onclick=()=>{paused=!paused;$('#game-state').textContent=paused?'PAUSED':'LIVE'};
$('#fullscreen-game').onclick=()=>{if(!document.fullscreenElement)$('#game-dialog').requestFullscreen?.().catch(()=>toast('Fullscreen unavailable'));else document.exitFullscreen?.()};
window.addEventListener('blur',()=>{keys.clear();if(game)paused=true});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game)paused=true});
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
