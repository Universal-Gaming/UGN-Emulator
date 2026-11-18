/* UGN Room Studio — original browser-native 3D furniture. No game clones or copied box art.
 * PBR surfaces, modular gaming furniture, 3D windows and optimized instanced game cases.
 */
export function createRoomStudio({THREE,api,createConsole,addPlanet,buildStarfield,sign}){
 const M=(c,m=.2,r=.65)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r});
 const L=(c,strength=.85)=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:strength,roughness:.28,metalness:.25});
 const G=(c=0xa2e8ff,o=.18)=>new THREE.MeshPhysicalMaterial({color:c,opacity:o,transparent:true,side:THREE.DoubleSide,roughness:.08,metalness:.12,depthWrite:false});
 const box=(w,h,d,mat)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
 const add=(p,obj,x=0,y=0,z=0)=>{obj.position.set(x,y,z);p.add(obj);return obj};
 const B=(p,w,h,d,x,y,z,mat)=>add(p,box(w,h,d,mat),x,y,z);
 const ball=(p,r,x,y,z,mat)=>add(p,new THREE.Mesh(new THREE.SphereGeometry(r,16,12),mat),x,y,z);
 const cyl=(p,r1,r2,h,x,y,z,mat,n=18)=>add(p,new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),mat),x,y,z);
 const strip=(p,w,h,d,x,y,z,c)=>B(p,w,h,d,x,y,z,L(c,1.05));
 const label=(p,t,w,x,y,z)=>add(p,sign(t,w,.62),x,y,z);
 const palette=[0x2d93c9,0x8956b5,0xe4a36e,0x37bd9b,0xad587c,0xd5dcff,0x7075bb,0xe2cc87];
 const accents={cyan:0x00d4ff,violet:0xa15cff,green:0x5cfc76,warm:0xffb973,white:0xe8edff};
 const wallColors={navy:0x142146,purple:0x31204e,gray:0x6b7185,dark:0x171729,cream:0xae9a8c};
 const floorColors={metal:0x172a40,wood:0x714f3d,carpet:0x37324f,tile:0x303c4e};
 const roomLightColors={cozy:0xffba80,chill:0x61b5fa,neon:0xa35cff,deep:0x433d9b};
 const themedTrim=(cfg)=>accents[cfg.lights]??0x00d4ff;
 const rand=n=>{const x=Math.sin(n*78.233)*43758.5453;return x-Math.floor(x)};
 let hitObjects=[];
 function makeTexture(kind,flavor=''){
   const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');
   if(kind==='screen'){let g=x.createRadialGradient(256,220,10,256,220,360);g.addColorStop(0,'#27688a');g.addColorStop(.55,'#0e2448');g.addColorStop(1,'#020a1d');x.fillStyle=g;x.fillRect(0,0,512,512);
     for(let i=0;i<110;i++){x.fillStyle=i%3?'#b7dffa5c':'#b3f7ff';x.fillRect(rand(i)*512,rand(i+88)*512,2,2)}
     x.strokeStyle='#08d8f6';x.lineWidth=4;x.beginPath();x.ellipse(256,225,165,73,-.26,0,Math.PI*2);x.stroke();
     x.textAlign='center';x.fillStyle='#5cfc76';x.font='bold 80px monospace';x.fillText('UGN',256,246);
     x.fillStyle='#dcfbff';x.font='bold 26px monospace';x.fillText(flavor==='desk'?'SYSTEM READY':'SELECT A CONSOLE',256,292);
     for(let i=0;i<512;i+=5){x.fillStyle='#000d1e44';x.fillRect(0,i,512,2)}
   }else if(kind==='wall'){
     const pale=flavor==='cream'||flavor==='gray';x.fillStyle=pale?'#666e82':'#19203b';x.fillRect(0,0,512,512);
     for(let i=0;i<512;i+=74){
       x.fillStyle=i%148===0?'#080d1c24':'#7782bd12';x.fillRect(i,0,70,512);
       x.strokeStyle=pale?'#0a142442':'#8b67b538';x.lineWidth=2;x.strokeRect(i+4,4,67,504);
     }
     for(let i=0;i<2600;i++){const xx=rand(i+110)*512,yy=rand(i+44)*512;
       x.fillStyle='rgba(234,231,255,'+(.012+rand(i+21)*.032)+')';x.fillRect(xx,yy,2,2)}
   }else if(kind==='wood'){x.fillStyle='#6e473e';x.fillRect(0,0,512,512);
     for(let i=0;i<110;i++){let y=rand(i)*512;x.strokeStyle=i%2?'#2d16232b':'#cf936838';x.lineWidth=1+rand(i+4)*2;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(180,y+rand(i+33)*5,380,y-3,512,y+1);x.stroke()}
   }else if(kind==='carpet'){
     x.fillStyle=flavor==='gray'?'#3b4760':'#3d315c';x.fillRect(0,0,512,512);
     for(let i=0;i<22000;i++){const v=60+Math.floor(rand(i+4)*64);
       x.fillStyle='rgba('+v+','+(v-12)+','+(v+68)+',.22)';
       x.fillRect(rand(i*3+1)*512,rand(i*5+9)*512,1+rand(i+25)*3,1+rand(i+13)*3);
     }
   }else if(kind==='metal'){
     x.fillStyle='#1b2638';x.fillRect(0,0,512,512);
     for(let y=0;y<512;y+=128){for(let xx=0;xx<512;xx+=128){
       x.fillStyle='#2b3b4c';x.fillRect(xx+3,y+3,122,122);
       x.strokeStyle='#516677';x.lineWidth=2;x.strokeRect(xx+6,y+6,116,116);
       x.fillStyle='#00cde83c';x.fillRect(xx+10,y+10,5,5);x.fillRect(xx+112,y+112,5,5);
     }}
     const light=x.createLinearGradient(0,0,512,512);light.addColorStop(0,'#7bb5e111');light.addColorStop(1,'#00001100');x.fillStyle=light;x.fillRect(0,0,512,512);
   }else if(kind==='rug'){x.fillStyle='#332751';x.fillRect(0,0,512,512);
     for(let j=0;j<7;j++){x.strokeStyle=j%2?'#09bfeea8':'#b773ffa8';x.lineWidth=8-j*.6;x.strokeRect(20+j*14,20+j*14,472-j*28,472-j*28)}
     let g=x.createRadialGradient(256,256,2,256,256,165);g.addColorStop(0,'#b36cfa');g.addColorStop(.4,'#195da7');g.addColorStop(1,'#101832');x.fillStyle=g;x.beginPath();x.arc(256,256,162,0,Math.PI*2);x.fill();
   }else if(kind==='duvet'){x.fillStyle='#17294d';x.fillRect(0,0,512,512);
     for(let i=-160;i<690;i+=115){x.save();x.translate(i,0);x.rotate(.5);x.fillStyle='#a052e1';x.fillRect(0,-160,44,800);x.fillStyle='#00d4ff';x.fillRect(53,-160,14,800);x.restore()}
     for(let i=0;i<30;i++){x.fillStyle=i%2?'#6ff9fb':'#fab1fc';x.fillRect(rand(i)*512,rand(i+100)*512,6,6)}
   }else if(kind==='gamecover'){
     let g=x.createLinearGradient(0,0,512,512);g.addColorStop(0,['#163e65','#5a267c','#3d603e','#7c2949'][Number(flavor)%4||0]);
     g.addColorStop(1,'#080f26');x.fillStyle=g;x.fillRect(0,0,512,512);
     x.lineWidth=10;x.strokeStyle='#b5dcfa';x.strokeRect(17,17,478,478);
     for(let i=0;i<11;i++){x.strokeStyle=i%2?'#77f4ef66':'#bc76f566';x.lineWidth=3;x.beginPath();
       x.ellipse(256,257,92+i*10,33+i*11,i*.11,0,Math.PI*2);x.stroke()}
     x.fillStyle='#d8fff6';x.textAlign='center';x.font='bold 83px monospace';x.fillText(['UGN','COSMOS','STAR','NOVA'][Number(flavor)%4||0],256,291);
     x.font='bold 25px monospace';x.fillStyle='#a8daeb';x.fillText('ORIGINAL COLLECTION',256,458);
   }else if(kind==='poster'){const g=x.createLinearGradient(0,0,512,512);g.addColorStop(0,'#19165b');g.addColorStop(.45,'#792e98');g.addColorStop(1,'#041f42');x.fillStyle=g;x.fillRect(0,0,512,512);
     for(let i=0;i<90;i++){x.fillStyle='#f4d3ff88';x.fillRect(rand(i)*512,rand(i+31)*512,2,2)}
     x.strokeStyle='#35eeff';x.lineWidth=9;x.beginPath();x.ellipse(260,255,144,57,-.45,0,Math.PI*2);x.stroke();
     x.textAlign='center';x.fillStyle='#5cfc76';x.font='bold 80px monospace';x.fillText(flavor==='retro'?'198X':'UGN',256,255);x.font='bold 24px monospace';x.fillText('GALACTIC ARCHIVE',256,325);
   }else if(kind==='space'){x.fillStyle='#020a22';x.fillRect(0,0,512,512);
     for(let i=0;i<430;i++){x.fillStyle=i%9?'#7ec2f96b':'#e7f6ff';x.fillRect(rand(i)*512,rand(i+43)*512,i%4?1:2,i%4?1:2)}
     if(flavor==='nebula'||flavor==='galaxy'){for(let i=0;i<90;i++){const px=128+rand(i+7)*340,py=100+rand(i+96)*280;const gr=x.createRadialGradient(px,py,2,px,py,25+rand(i)*110);
       gr.addColorStop(0,i%2?'#af64ff30':'#40b6f53b');gr.addColorStop(1,'#1a0c3600');x.fillStyle=gr;x.fillRect(px-115,py-115,230,230)}}
   }
   const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
 }
 function caseShelf(parent,config,idx){
   const total=config.clutter==='packed'?22:config.clutter==='minimal'?8:15;
   const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(.135,.47,.43),M(0xffffff,.14,.56),total);
   const dummy=new THREE.Object3D();
   for(let i=0;i<total;i++){dummy.position.set(-1.20+i*2.40/total,.31,0);dummy.rotation.z=(rand(idx*39+i)-.5)*.17;dummy.scale.set(1,.8+rand(i+idx)*.38,1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color(palette[(i+idx*3)%palette.length]))}
   mesh.instanceMatrix.needsUpdate=true;parent.add(mesh);
 }
 function hit(group,entry,w=2,h=2.8,d=1.5){
   const mesh=B(group,w,h,d,0,h/2,0,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
   mesh.userData.furnitureId=entry.id;mesh.userData.furnitureType=entry.type;group.userData.hitTarget=mesh;hitObjects.push(mesh);return mesh;
 }
 function furniture(entry,cfg){
   const g=new THREE.Group();g.userData.furnitureId=entry.id;g.userData.furnitureType=entry.type;g.name='UGN / '+entry.type;
   const wood=M(0x67443b,.10,.75),top=M(0x956549,.19,.53),iron=M(0x233a55,.65,.36),edge=M(0x69839c,.7,.27);
   const black=M(0x121828,.45,.37),plastic=M(0x8b929c,.2,.63),fabric=M(0x43345f,.03,.96);
   const neon=accents[cfg.lights]??0x00d4ff,em=L(neon);
   let w=2.3,h=2.5,d=1.6;
   const T=(text,width,x,y,z)=>label(g,text,width,x,y,z);
   const cb=(width,height,depth,x,y,z,m)=>B(g,width,height,depth,x,y,z,m);
   if(entry.type==='crt'){
     w=2.7;h=3.3;d=1.7;
     cb(2.55,.16,1.45,0,.92,0,top);for(const x of [-1.1,1.1])cb(.15,.82,1.36,x,.48,0,wood);
     cb(2.4,.12,1.33,0,.26,0,top);cb(2.4,.08,1.23,0,.56,0,wood);
     cb(2.05,1.49,1.29,0,1.83,-.05,M(0x3e4046,.23,.56));
     cb(1.78,1.21,.10,-.12,1.90,.63,black);
     const screen=new THREE.Mesh(new THREE.PlaneGeometry(1.60,1.05),new THREE.MeshBasicMaterial({map:makeTexture('screen'),toneMapped:false}));
     add(g,screen,-.12,1.90,.686);
     cb(.16,.58,.12,.90,1.78,.65,plastic);for(let i=0;i<2;i++){const b=cyl(g,.07,.07,.03,.9,1.7+i*.24,.73,iron);b.rotation.x=Math.PI/2;}
     cb(.55,.10,.55,-.6,.68,.16,black);cb(.55,.08,.08,-.6,.72,.48,em);
     T('CRT / PLAY GAMES',2.4,0,2.93,.15);
     const tvHit=cb(1.62,1.06,.05,-.12,1.90,.81,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));tvHit.userData.interact='room-play';hitObjects.push(tvHit);
   }else if(entry.type==='stand'){
     w=3.1;h=1.4;d=1.5;
     cb(3.0,.16,1.5,0,1.1,0,top);cb(2.98,.16,1.5,0,.14,0,wood);
     for(const x of [-1.38,0,1.38])cb(.13,.86,1.4,x,.6,0,wood);
     for(const y of [.49,.83])cb(2.82,.06,1.32,0,y,0,top);
     cb(.85,.16,.62,-.72,.91,0,black);cb(.78,.18,.58,.73,.91,0,plastic);
     strip(g,2.8,.025,.03,0,1.17,.72,neon);
   }else if(entry.type==='console'){
     w=1.9;h=1.15;d=1.6;
     cb(1.65,.42,1.07,0,.39,0,plastic);cb(1.30,.09,.85,0,.65,-.08,iron);cb(.73,.07,.05,0,.43,.55,black);
     ball(g,.05,-.54,.58,.5,em);ball(g,.05,-.38,.58,.5,em);T('UGN SYSTEM',1.2,0,.85,.45);
     cb(.74,.14,.37,.61,.12,.86,black);
   }else if(entry.type==='shelf'){
     w=2.8;h=4.3;d=.87;
     for(const x of [-1.34,1.34])cb(.14,4.1,.77,x,2.05,-.12,wood);
     cb(2.81,.13,.79,0,4.12,-.12,top);cb(2.73,4.06,.13,0,2.08,-.51,wood);
     for(let i=0;i<5;i++){const y=.24+i*.79;cb(2.70,.10,.78,0,y,-.08,top);
       const row=new THREE.Group();add(g,row,0,y+.09,.06);caseShelf(row,cfg,i+Number(entry.id)%11);
       // A few genuine 3D collectible cases face out on the shelf, using original UGN cover art.
       const covers=cfg.clutter==='packed'?2:cfg.clutter==='curated'?1:0;
       for(let j=0;j<covers;j++){
         const coverMat=new THREE.MeshStandardMaterial({map:makeTexture('gamecover',String(i+j)),roughness:.46,metalness:.12});
         const caseObj=cb(.34,.55,.075,-.93+j*1.85,y+.39,.19,coverMat);caseObj.rotation.y=j?.12:-.1;
       }
       strip(g,2.5,.019,.03,0,y+.13,.34,i%2?0xa55bff:0x00d4ff);}
     T('GAME COLLECTION',2.45,0,4.30,.26);
   }else if(entry.type==='cabinet'){
     w=3.2;h=5.2;d=1.4;
     cb(3.0,.20,1.26,0,.12,0,iron);cb(3.0,.19,1.26,0,4.72,0,iron);
     for(const x of [-1.44,1.44])for(const z of [-.61,.61])cb(.07,4.38,.07,x,2.44,z,edge);
     for(const y of [1.17,2.28,3.40]){cb(2.88,.075,1.17,0,y,0,G(0x76d2ff,.25));strip(g,2.78,.04,.08,0,y+.08,.57,neon)}
     for(const z of [-.63,.63])cb(2.91,4.28,.025,0,2.44,z,G(0x86dbf9,.13));
     for(let i=0;i<4;i++){const consoleId=cfg.displayConsoles?.[i]||['nes','snes','n64','psx'][i];
       const shell=new THREE.Group();add(g,shell,i%2?+.72:-.72,i<2?3.69:1.54,0);
       createConsole(shell,consoleId);shell.scale.setScalar(.28);
       const slot=B(g,1.16,.92,.08,i%2?.72:-.72,i<2?3.69:1.54,.78,
         new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
       slot.userData.interact='room-console';slot.userData.consoleId=consoleId;hitObjects.push(slot);
     }
     T('UGN / CONSOLE VAULT',2.85,0,4.91,.60);
     strip(g,2.95,.05,.05,0,.16,.65,0x9057ff);
   }else if(entry.type==='bed'){
     w=3.9;h=2;d=5.0;
     cb(3.77,.52,4.72,0,.43,0,wood);cb(3.75,1.43,.25,0,.93,-2.30,M(0x35314c,.2,.77));
     cb(3.62,.35,4.57,0,.87,0,M(0xb3bad2,.05,.88));
     const blanket=cb(3.58,.23,3.30,0,1.14,.58,new THREE.MeshStandardMaterial({map:makeTexture('duvet'),roughness:.94}));
     for(const x of [-.86,.86]){const p=cb(1.42,.29,.81,x,1.24,-1.44,M(0x7a5d9f,.05,.89));p.rotation.z=x>0?-.06:.05;}
     for(const x of [-1.77,1.77])cb(.10,.49,4.53,x,.37,0,top);
     cb(3.75,.17,.18,0,.28,2.33,top);
   }else if(entry.type==='desk'){
     w=4.2;h=2.85;d=2;
     cb(4.05,.17,1.88,0,1.07,-.1,top);
     for(const x of [-1.83,1.83])cb(.15,1.0,1.65,x,.58,-.1,iron);
     cb(1.74,1.13,.12,0,1.92,-.77,black);
     add(g,new THREE.Mesh(new THREE.PlaneGeometry(1.57,.97),new THREE.MeshBasicMaterial({map:makeTexture('screen','desk'),toneMapped:false})),0,1.92,-.704);
     cb(.16,.44,.15,0,1.33,-.75,iron);cb(1.0,.06,.38,0,1.19,.42,black);
     // Transparent floating editor screen above the gaming desk, like the reference photo.
     const holoframe=cb(2.6,1.28,.038,.72,2.59,-.62,G(0x16c4ff,.18));
     holoframe.rotation.y=-.12;
     const holoArt=new THREE.Mesh(new THREE.PlaneGeometry(2.25,1.02),
       new THREE.MeshBasicMaterial({map:makeTexture('screen','desk'),transparent:true,opacity:.79,side:THREE.DoubleSide,depthWrite:false}));
     holoArt.position.set(.72,2.59,-.578);holoArt.rotation.y=-.12;g.add(holoArt);
     holoArt.userData.roomAnimation='hologram';
     strip(g,2.55,.026,.05,.72,3.24,-.58,0x00d4ff);
     strip(g,2.55,.026,.05,.72,1.96,-.58,0x9b61ff);
     const deskHit=cb(2.5,1.16,.08,.72,2.59,-.46,
       new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
     deskHit.userData.interact='room-play';hitObjects.push(deskHit);
     for(let i=0;i<13;i++)cb(.055,.013,.10,-.41+i*.067,1.23,.40,i%3?iron:em);
     cyl(g,.07,.10,.75,-1.48,1.56,-.50,iron);cyl(g,.40,.28,.23,-1.48,2.02,-.50,M(0x9d90b8,.2,.65));
     ball(g,.16,-1.48,1.89,-.50,L(0xffd29a,1));ball(g,.10,.95,1.18,.38,black);
     strip(g,3.73,.03,.04,0,1.11,.83,neon);
   }else if(entry.type==='chair'){
     w=2;h=3.4;d=2;
     cb(1.27,.27,1.1,0,1.28,.06,black);cb(1.19,1.72,.35,0,2.23,-.49,black);
     cb(.85,1.27,.09,0,2.23,-.28,M(0x514974,.05,.92));
     for(const x of [-.65,.65]){cb(.17,.17,1.0,x,1.62,-.04,iron);cb(.10,.58,.11,x,1.43,-.27,iron);}
     cb(.20,.84,.22,0,.75,0,iron);
     for(let i=0;i<5;i++){let a=i*Math.PI*2/5,p=cb(.12,.10,.66,Math.sin(a)*.30,.29,Math.cos(a)*.30,iron);p.rotation.y=a}
     for(const x of [-.48,.48])strip(g,.05,1.26,.06,x,2.22,-.25,x<0?0xa05dff:0x00d4ff);
   }else if(entry.type==='sofa'){
     w=3.8;h=2;d=2;
     cb(3.50,.49,1.61,0,.72,0,fabric);cb(3.56,1.15,.39,0,1.27,-.73,fabric);
     for(const x of [-1.74,1.74])cb(.28,.94,1.56,x,.83,0,black);
     for(const x of [-1.1,0,1.1])cb(1.02,.20,1.33,x,1.05,.07,M(0x675589,.05,.9));
     strip(g,3.15,.025,.043,0,.27,.77,0xaf65ff);
   }else if(entry.type==='table'){
     w=2.8;h=1.4;d=1.6;
     cb(2.70,.15,1.52,0,1.04,0,top);
     for(const x of [-1.12,1.12])for(const z of [-.59,.59])cb(.13,.97,.13,x,.52,z,iron);
     cyl(g,.35,.28,.18,-.36,1.22,.04,M(0x6b799c,.35,.25));
     for(let i=0;i<9;i++)ball(g,.075,-.36+(rand(i)-.5)*.45,1.36,rand(i+10)*.3-.16,M(0xf2c06a,.04,.83));
     cb(.59,.12,.38,.64,1.18,-.05,black);
   }else if(entry.type==='rug'){
     w=4.8;h=.03;d=3.6;
     cb(4.55,.032,3.57,0,.03,0,new THREE.MeshStandardMaterial({map:makeTexture('rug'),roughness:1}));
   }else if(entry.type==='lamp'){
     w=1;h=3.1;d=1;
     cyl(g,.32,.42,.16,0,.12,0,iron);cyl(g,.06,.06,2.3,0,1.25,0,iron);
     cyl(g,.48,.25,.72,0,2.68,0,M(0xc2abd7,.1,.73));ball(g,.19,0,2.30,0,L(0xffda9c,1.2));
   }else if(entry.type==='lava'){
     w=.8;h=1.4;d=.8;
     cyl(g,.24,.30,.15,0,.15,0,iron);cyl(g,.19,.25,.80,0,.62,0,G(0xad5eff,.41));
     for(let i=0;i<5;i++){const blob=ball(g,.083+(i%3)*.021,(rand(i)-.5)*.2,.31+i*.14,0,L(i%2?0xff83d6:0xb363ff,.67));blob.userData.roomAnimation='lava';blob.userData.lavaPhase=i*1.26;blob.userData.lavaBase=blob.position.y;}
     cyl(g,.22,.22,.14,0,1.07,0,iron);
   }else if(entry.type==='plant'){
     w=1.25;h=2.8;d=1.25;
     cyl(g,.37,.25,.55,0,.30,0,M(0x695572,.19,.81));cyl(g,.065,.09,1.75,0,1.42,0,M(0x346447,.1,.7));
     for(let i=0;i<17;i++){let a=i*Math.PI*2/8,p=ball(g,.23,Math.cos(a)*(.20+(i%4)*.1),.79+i*.10,Math.sin(a)*(.20+(i%4)*.1),M(i%3?0x327d56:0x4db76a,.04,.88));p.scale.set(1.5,.36,.7);p.rotation.y=-a}
   }else if(entry.type==='poster'){
     w=2;h=2.5;d=.18;
     cb(1.96,2.25,.12,0,1.48,0,top);
     add(g,new THREE.Mesh(new THREE.PlaneGeometry(1.8,2.06),new THREE.MeshBasicMaterial({map:makeTexture('poster',Number(entry.id)%2?'retro':''),toneMapped:false})),0,1.48,.07);
     strip(g,1.96,.04,.06,0,2.64,.07,0xa65fff);strip(g,1.96,.04,.06,0,.31,.07,0x00d4ff);
   }else if(entry.type==='controller'){
     w=1.15;h=.6;d=.82;
     const body=cb(1.12,.21,.53,0,.23,0,black);
     for(const x of [-.47,.47]){const grip=cb(.24,.3,.65,x,.18,.13,plastic);grip.rotation.y=x>0?-.2:.2}
     cb(.37,.055,.105,-.29,.365,0,iron);cb(.12,.055,.33,-.29,.365,0,iron);
     for(const [x,z,col] of [[.18,.04,0x5cfc76],[.34,.14,0x9168ff],[.34,-.08,0xff97b6],[.49,.02,0x00d4ff]])
       cyl(g,.05,.05,.038,x,.365,z,L(col,.58));
     for(const x of [-.08,.09])cyl(g,.035,.035,.03,x,.365,.04,edge);
   }else if(entry.type==='holo'){
     w=2.0;h=2.8;d=1.3;
     cb(1.75,.17,.9,0,.70,0,iron);
     cb(.28,.75,.25,0,.35,0,iron);
     const glass=cb(1.65,1.42,.035,0,1.65,-.11,G(0x07e6ff,.17));glass.rotation.y=-.12;
     const panel=add(g,new THREE.Mesh(new THREE.PlaneGeometry(1.42,1.20),
       new THREE.MeshBasicMaterial({map:makeTexture('screen','desk'),transparent:true,opacity:.82,side:THREE.DoubleSide})),0,1.65,-.07);
     panel.userData.roomAnimation='hologram';
     strip(g,1.72,.06,.08,0,2.43,-.05,neon);
     const holoHit=cb(1.7,1.35,.09,0,1.65,.05,
       new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
     holoHit.userData.interact='room-play';hitObjects.push(holoHit);
   }else if(entry.type==='neonsign'){
     w=2.8;h=2.1;d=.2;
     cb(2.8,1.55,.12,0,1.5,0,black);
     cb(2.62,1.4,.04,0,1.5,.09,G(0x875bff,.22));
     const ugn=add(g,sign('UGN / RETRO',2.5,.90),0,1.68,.13);ugn.userData.roomAnimation='hologram';
     strip(g,2.74,.055,.06,0,2.29,.14,neon);
     strip(g,2.74,.055,.06,0,.72,.14,0xa05dff);
   }else if(entry.type==='figure'){
     w=.9;h=1.4;d=.9;
     cyl(g,.23,.2,.56,0,.43,0,M(0x5e68a8,.4,.38));
     ball(g,.29,0,.9,0,M(0xe0eaf3,.22,.55));
     cb(.44,.15,.065,0,.89,.27,G(0x00eaff,.67));
     for(const x of [-.30,.30])cb(.13,.39,.13,x,.48,0,iron);
     for(const x of [-.12,.12])cb(.14,.37,.16,x,.16,0,black);
     ball(g,.065,0,.45,.23,em);
   }else if(entry.type==='snacks'){
     w=.9;h=.5;d=.9;
     cyl(g,.37,.30,.21,0,.16,0,iron);
     for(let i=0;i<10;i++)ball(g,.073,(rand(i)-.5)*.52,.31+(i%3)*.035,(rand(i+40)-.5)*.44,M(0xe3af69,.06,.8));
   }
   // Lightweight contact shadows add depth without GPU-heavy real-time shadow maps.
   if(!['rug','poster','snacks','figure'].includes(entry.type)){
     const shadow=new THREE.Mesh(new THREE.CircleGeometry(Math.max(w,d)*.55,28),
       new THREE.MeshBasicMaterial({color:0x01020a,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide}));
     shadow.rotation.x=-Math.PI/2;shadow.scale.set(1,.68,1);shadow.position.y=.018;g.add(shadow);
   }
   g.position.set(Number(entry.x)||0,Number(entry.y)||0,Number(entry.z)||0);g.rotation.y=Number(entry.rot)||0;
   hit(g,entry,w,Math.max(h,1.1),entry.type==='crt'?1.28:d);return g;
 }
 function windowScene(room,config){
   const accent=accents[config.lights]??0x00d4ff;
   const frameX=3.35,y=4.15,z=-10.00;
   const space=new THREE.Mesh(new THREE.PlaneGeometry(10.4,4.4),new THREE.MeshBasicMaterial({map:makeTexture('space',config.window),toneMapped:false}));
   add(room,space,frameX,y,z);space.renderOrder=2;
   if(config.window==='earth'||config.window==='ringed'){
     // Planet silhouette is visible in the window with actual geometry layered in front of the star panel.
     const planet=new THREE.Mesh(new THREE.SphereGeometry(config.window==='earth'?1.54:1.26,40,24),new THREE.MeshStandardMaterial({color:config.window==='earth'?0x417bc2:0x9368a6,metalness:.08,roughness:.85,emissive:config.window==='earth'?0x1a3a7b:0x3b2066,emissiveIntensity:.48,depthTest:false}));
     add(room,planet,5.15,4.15,-9.90);planet.renderOrder=3;planet.userData.spin=true;
     if(config.window==='ringed'){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.9,.07,9,50),L(0xdec8ff,.45));ring.rotation.set(.45,.18,.24);add(room,ring,5.15,4.15,-9.85);ring.renderOrder=3;}
   }else if(config.window==='station'){
     const base=new THREE.Group();add(room,base,4.9,4.1,-9.86);
     const ring=new THREE.Mesh(new THREE.TorusGeometry(1.25,.09,9,44),M(0x8d9cbc,.62,.35));ring.rotation.x=.24;base.add(ring);
     B(base,2,.24,.35,0,0,0,M(0x66738e,.62,.28));for(const x of [-1.3,1.3])B(base,.45,.35,.56,x,0,0,L(0x00d4ff,.40));
   }
   for(const x of [-2.0,3.35,8.7])B(room,.19,4.7,.22,x,4.17,-9.86,M(0x4c7094,.68,.29));
   for(const yy of [1.83,6.46])B(room,10.9,.18,.20,3.35,yy,-9.86,M(0x4c7094,.68,.29));
   strip(room,10.4,.055,.10,3.35,6.60,-9.77,accent);
 }
 function build(config){
   const room=new THREE.Group();room.name='UGN / Photo-Match Gaming Room';hitObjects=[];
   const wc=wallColors[config.walls]??wallColors.navy,fc=floorColors[config.floor]??floorColors.metal;
   const floorMat=['wood','carpet','metal'].includes(config.floor)?
     new THREE.MeshStandardMaterial({map:makeTexture(config.floor),roughness:config.floor==='carpet'?.97:.49,metalness:config.floor==='metal'?.55:.035}):M(fc,.28,.6);
   const ground=B(room,19,.18,19,0,-.14,-.9,floorMat);
   const wallMat=new THREE.MeshStandardMaterial({color:wc,map:makeTexture('wall',config.walls),roughness:.88,metalness:.08});
   B(room,.28,7.65,19,-9.5,3.8,-.9,wallMat);
   B(room,.28,7.65,19,9.5,3.8,-.9,wallMat);
   B(room,19,7.65,.28,0,3.8,-10.25,wallMat);
   // Architectural framing, skirting and layered illumination make this a lived-in station cabin.
   for(const xx of [-9.18,9.18]){
     for(let z=-9.5;z<=7.5;z+=2.2){
       B(room,.15,6.85,.07,xx,3.45,z,M(0x364760,.47,.41));
     }
     strip(room,.06,.07,17.9,xx,.18,-.9,0x01bde8);
   }
   for(const z of [-9.89,-6.12,-2.31,1.5,5.31]){
     strip(room,18.0,.045,.08,0,6.80,z,z===-9.89?0x00d4ff:0x7b57dd);
   }
   const baseTrim=M(0x3c3a58,.35,.32);
   B(room,18.6,.26,.18,0,.13,-10.05,baseTrim);
   for(const xx of [-9.33,9.33])B(room,.18,.25,18.6,xx,.13,-.85,baseTrim);
   for(const x of [-9.2,9.2])B(room,.32,.26,19,x,7.59,-.9,M(0x182037,.54,.3));
   for(const z of [-10.1,8.3])B(room,19,.26,.35,0,7.59,z,M(0x182037,.54,.3));
   const ceiling=new THREE.Mesh(new THREE.TorusGeometry(3.15,.1,9,80),L(0x9d54ff,.75));ceiling.rotation.x=Math.PI/2;add(room,ceiling,0,7.43,-1.65);
   const inner=new THREE.Mesh(new THREE.TorusGeometry(2.79,.058,8,74),L(0x00d4ff,1));inner.rotation.x=Math.PI/2;add(room,inner,0,7.41,-1.65);
   const accent=accents[config.lights]??0x00d4ff;
   for(const x of [-9.15,9.15]){strip(room,.09,.08,18,x,.07,-.9,accent);for(const z of [-7.8,-3.1,2.3,6.8])strip(room,.09,6.6,.10,x,3.45,z,accent)}
   strip(room,18.5,.075,.10,0,6.95,-10.04,accent);
   windowScene(room,config);
   label(room,'UGN  //  THE GAME UNIVERSE',5.3,-4.4,6.8,-10.03);
   const ambient=new THREE.AmbientLight(0xc4c7ed,config.atmosphere==='deep'?1.05:1.8);room.add(ambient);
   const lights=[[-4.0,5.7,-3.0,accent,config.atmosphere==='deep'?35:65],[4,5,1,0xb86aff,45],[5,3,-4,0xffc596,config.atmosphere==='cozy'?55:24]];
   lights.forEach(([x,y,z,c,intensity])=>{const p=new THREE.PointLight(c,intensity,21,1.5);p.position.set(x,y,z);room.add(p)});
   // Underfloor walkway guides the camera toward the console cabinet and panoramic window.
   for(const xx of [-1.3,1.3])strip(room,.065,.019,12.8,xx,-.043,-.8,0x00b8e6);
   for(const z of [-8,-2,4]){const rib=new THREE.Mesh(new THREE.TorusGeometry(9.15,.05,7,46,Math.PI),M(0x456484,.50,.3));add(room,rib,0,-1,z)}
   // Ceiling light panels and a suspended UGN luminous controller emblem.
   const disc=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,.07,48),G(0x0ad3ff,.13));
   add(room,disc,0,7.42,-1.65);
   for(const x of [-6,6])for(const z of [-7,2]){
     const p=B(room,1.1,.045,.49,x,7.43,z,L(config.atmosphere==='cozy'?0xffb974:0x75dbfb,.65));
     p.userData.roomAnimation='ceiling';
   }
   return {group:room,floor:ground,hits:hitObjects};
 }
 return {build,makeFurniture:furniture,hits:()=>hitObjects};
}
