import { attachBootOverlay } from './player-boot.js';
import { artworkImage, wireArtwork, setArtworkImage } from './artwork.js';
/* UGN Emulator — complete title index and private use-your-own-copy browser playback.
   No commercial game binaries, BIOS or uploaded files are sent to UGN.
   Metadata: Libretro Database, CC BY-SA 4.0. */
export function mountConsoleIndex(api) {
  const $ = s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  if (!$('#index-console')) return;
  const dialog=$('#my-copy-dialog'), gameDialog=$('#game-dialog');
  const map=new Map();
  let manifest=null,active='nes',term='',region='all',page=0,results=[],loading=false;
  let selected=null,rom=null,bios=null,currentFrame=null,activeUrls=[],currentListKey=0,finishLocalBoot=null;
  const PAGE_SIZE=30;
  const prefsKey='ugn-emulator-my-copy-history-v1';
  let prefs={favorites:[],recent:[]};
  try{const p=JSON.parse(localStorage.getItem(prefsKey)||'{}');if(Array.isArray(p.favorites)&&Array.isArray(p.recent))prefs=p;}catch{}
  const prefId=e=>e.system+'::'+e.title;
  const savePrefs=()=>{try{localStorage.setItem(prefsKey,JSON.stringify(prefs))}catch{}};
  function renderOwnedCollection(){
    const node=$('#owned-recent-list');if(!node)return;
    const favs=prefs.favorites.slice(0,10).map(s=>{const sep=s.indexOf('::');return {system:s.slice(0,sep),title:s.slice(sep+2),tag:'♥ FAVORITE'}});
    const recent=prefs.recent.slice(0,10).filter(e=>!prefs.favorites.includes(prefId(e))).map(e=>({...e,tag:'◈ RECENT'}));
    const list=[...favs,...recent].slice(0,16);
    node.innerHTML=list.length?list.map(e=>'<button class="owned-recent" data-owned="'+clean(e.system)+'::'+clean(e.title)+'" title="Launch using your own file"><small>'+clean(e.tag)+'</small>'+clean(e.title)+' <span>↗</span></button>').join(''):'<span class="owned-empty">Your saved titles appear here after you add favorites or play your own copy.</span>';
    node.querySelectorAll('[data-owned]').forEach(btn=>btn.onclick=()=>{
      const raw=btn.dataset.owned||'',i=raw.indexOf('::');
      if(i<0)return;showCopy({system:raw.slice(0,i),title:raw.slice(i+2),region:'',key:'owned'});
    });
  }

  const titlesBySystem=Object.fromEntries(api.systems.map(s=>[s.id,s.name]));
  const systemById=id=>api.systems.find(s=>s.id===id);
  const allSystemLabel=id=>titlesBySystem[id]||id;
  const clean=s=>String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const normalize=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const accept={
    nes:'.nes,.unif,.unf,.zip',snes:'.sfc,.smc,.fig,.zip',n64:'.n64,.z64,.v64,.zip',
    gb:'.gb,.zip',gbc:'.gbc,.gb,.zip',gba:'.gba,.zip',nds:'.nds,.zip',
    segaMD:'.md,.gen,.bin,.smd,.zip',segaGG:'.gg,.zip',
    sega32x:'.32x,.bin,.md,.zip',
    segaCD:'.chd,.iso,.bin,.cue,.zip,.7z',segaSaturn:'.chd,.iso,.bin,.cue,.zip,.7z',
    psx:'.chd,.iso,.pbp,.bin,.cue,.zip,.7z',atari2600:'.a26,.bin,.zip',
    ngp:'.ngp,.ngc,.zip',neogeo:'.neo,.zip'
  };
  const biosRules={
    segaCD:'A Sega CD BIOS is generally required. Supply your own compatible regional BIOS.',
    segaSaturn:'The Saturn core commonly requires a compatible Saturn BIOS.',
    psx:'PlayStation BIOS can improve compatibility; some games can work without one.',
    neogeo:'Some Neo Geo titles require firmware/BIOS content. Use legally obtained files.',
    nds:'Nintendo DS BIOS/firmware is optional for some cores but may improve compatibility.'
  };
  const thumbnailFolder={
    nes:'Nintendo - Nintendo Entertainment System',snes:'Nintendo - Super Nintendo Entertainment System',
    n64:'Nintendo - Nintendo 64',gb:'Nintendo - Game Boy',gbc:'Nintendo - Game Boy Color',
    gba:'Nintendo - Game Boy Advance',nds:'Nintendo - Nintendo DS',
    segaMD:'Sega - Mega Drive - Genesis',segaGG:'Sega - Game Gear',
    sega32x:'Sega - 32X',segaCD:'Sega - Mega-CD - Sega CD',
    segaSaturn:'Sega - Saturn',psx:'Sony - PlayStation',
    atari2600:'Atari - 2600',ngp:'SNK - Neo Geo Pocket',neogeo:'SNK - Neo Geo'
  };
  const hostedByName=new Map();
  for(const g of api.hosted){
    const key=g.system+':'+normalize(g.name);
    hostedByName.set(key,g);
  }
  const hostedFor=(entry)=>{
    const exact=hostedByName.get(entry.system+':'+normalize(entry.title));
    if(exact&&api.installed[exact.file]===true)return exact;
    return null;
  };
  const covers=(e)=>{
    const playlist=thumbnailFolder[e.system]||allSystemLabel(e.system);
    const filename=e.title.replace(/[\/\\:?*"<>|]/g,'_')+'.png';
    return 'https://thumbnails.libretro.com/'+encodeURIComponent(playlist)+'/Named_Boxarts/'+encodeURIComponent(filename);
  };
  function setStatus(text){$('#index-status').textContent=text}
  function fileStatus(text,kind=''){const n=$('#copy-file-status');n.className='copy-status'+(kind?' '+kind:'');n.textContent=text}
  async function loadSystem(id){
    if(map.has(id))return map.get(id);
    const m=manifest?.systems.find(x=>x.id===id);
    if(!m)return[];
    const res=await fetch('./'+m.file,{cache:'force-cache'});
    if(!res.ok)throw new Error('Catalog for '+id+' unavailable ('+res.status+')');
    const data=await res.json();
    if(!Array.isArray(data))throw new Error('Invalid catalog format for '+id);
    const items=data.map(([name,reg],i)=>({system:id,title:String(name),region:String(reg||''),key:id+'-'+i}));
    map.set(id,items);
    return items;
  }
  async function loadAll(){
    const sources=manifest.systems;
    for(let at=0;at<sources.length;at+=4){
      await Promise.all(sources.slice(at,at+4).map(s=>loadSystem(s.id)));
      setStatus('LOADING ARCHIVES '+Math.min(at+4,sources.length)+' / '+sources.length+' SYSTEMS…');
    }
    return [...map.values()].flat();
  }
  async function buildResults(){
    const request=++currentListKey;
    loading=true;setStatus('OPENING CONSOLE ARCHIVES…');
    $('#index-grid').replaceChildren();
    $('#index-empty').hidden=true;
    $('#index-prev').disabled=true;$('#index-next').disabled=true;
    try{
      const data=active==='all'?await loadAll():await loadSystem(active);
      if(request!==currentListKey)return;
      results=data.filter(g=>(region==='all'||g.region===region)&&(g.title.toLowerCase().includes(term)));
      if(active==='all')results.sort((a,b)=>a.title.localeCompare(b.title));
      page=0;renderPage();
    }catch(error){
      if(request!==currentListKey)return;
      setStatus('ARCHIVE FAILED TO LOAD — TRY RELOADING THE PAGE');
      $('#index-grid').innerHTML='<div class="archive-load-error">The title index cannot be reached. Your installed homebrew games remain playable above.</div>';
      console.warn('UGN console catalog:',error);
    }finally{if(request===currentListKey)loading=false;}
  }
  function renderPage(){
    const total=results.length,start=page*PAGE_SIZE,end=Math.min(start+PAGE_SIZE,total),shown=results.slice(start,end);
    setStatus(total.toLocaleString()+' GAME ENTRIES · '+allSystemLabel(active==='all'?'all':active).toUpperCase());
    $('#index-page').textContent=total?'PAGE '+(page+1)+' / '+Math.max(1,Math.ceil(total/PAGE_SIZE)):'0 MATCHES';
    $('#index-prev').disabled=page===0;$('#index-next').disabled=end>=total;
    $('#index-empty').hidden=total!==0;
    $('#index-grid').innerHTML=shown.map(g=>{
      const host=hostedFor(g),isHost=!!host,art=host?.image||covers(g);
      return '<article class="index-card" data-entry="'+clean(g.key)+'"><div class="index-cover">'+
        '<button class="index-card-favorite '+(prefs.favorites.includes(prefId(g))?'active':'')+'" data-index-fav="'+clean(g.key)+'" aria-label="Toggle favorite for '+clean(g.title)+'" aria-pressed="'+prefs.favorites.includes(prefId(g))+'">♥</button>'+
        artworkImage(art,g.title,systemById(g.system)?.short||g.system)+
        '<span class="index-cover-label">'+clean(systemById(g.system)?.short||g.system)+'</span>'+
        (g.region?'<span class="index-region">'+clean(g.region)+'</span>':'')+'</div>'+
        '<div class="index-card-content"><h3 title="'+clean(g.title)+'">'+clean(g.title)+'</h3>'+
        '<div class="index-card-description">Genuine '+clean(allSystemLabel(g.system))+' title index entry</div>'+
        '<div class="index-card-action"><span class="'+(isHost?'ready':'')+'">'+(isHost?'● HOSTED':'◈ YOUR COPY')+'</span>'+
        '<button data-copy="'+clean(g.key)+'">'+(isHost?'PLAY NOW':'USE MY COPY')+' ↗</button></div></div></article>';
    }).join('');
    wireArtwork($('#index-grid'));
    document.querySelectorAll('[data-index-fav]').forEach(b=>b.addEventListener('click',()=>{
      const entry=shown.find(x=>x.key===b.dataset.indexFav);if(!entry)return;
      const id=prefId(entry);prefs.favorites=prefs.favorites.includes(id)?prefs.favorites.filter(v=>v!==id):[...prefs.favorites,id];
      savePrefs();renderPage();renderOwnedCollection();
    }));
    document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
      const entry=shown.find(x=>x.key===b.dataset.copy);
      if(!entry)return;
      const hosted=hostedFor(entry);
      if(hosted)api.launchHosted(hosted.id);
      else showCopy(entry);
    }));
  }
  const keyMap = {
    nes:'Nintendo NES',snes:'Super Nintendo',n64:'Nintendo 64',gb:'Nintendo Game Boy',gbc:'Game Boy Color',
    gba:'Game Boy Advance',nds:'Nintendo DS',segaMD:'Sega Genesis / Mega Drive',
    segaGG:'Sega Game Gear',sega32x:'Sega 32X',segaCD:'Sega CD',segaSaturn:'Sega Saturn',
    psx:'Sony PlayStation 1',atari2600:'Atari 2600',ngp:'Neo Geo Pocket',neogeo:'SNK Neo Geo'
  };
  function showCopy(entry){
    if(!systemById(entry.system))return;
    selected=entry;rom=null;bios=null;
    $('#copy-rom-file').value='';$('#copy-bios-file').value='';
    $('#copy-launch').disabled=true;
    $('#copy-title').textContent='YOUR '+(systemById(entry.system)?.short||'CONSOLE')+' COPY';
    $('#copy-console-name').textContent=keyMap[entry.system].toUpperCase();
    $('#copy-game-name').textContent=entry.title;
    $('#copy-required-ext').textContent='Supported: '+(accept[entry.system]||'.zip');
    $('#copy-rom-file').accept=accept[entry.system]||'.zip';
    $('#copy-rom-label').textContent='SELECT GAME FILE · '+(accept[entry.system]||'.zip').replaceAll(',',', ');
    $('#copy-bios-hint').textContent=biosRules[entry.system]||'Not normally required. Only add a BIOS if you have a legally usable copy.';
    const cover=$('#copy-art');
    setArtworkImage(cover,hostedFor(entry)?.image||covers(entry),entry.title,systemById(entry.system)?.short||entry.system);
    $('#copy-art-fallback').hidden=true;
    fileStatus('Files stay entirely in this browser session. UGN does not upload or store them.');
    dialog.showModal();
  }
  function validateFile(file,system){
    if(!file)return'Choose a game file first.';
    const ext=(file.name.match(/\.[^.]+$/)?.[0]||'').toLowerCase();
    if(!(accept[system]||'').split(',').includes(ext))return'Incorrect format for '+keyMap[system]+'. Choose '+accept[system];
    if(ext==='.cue')return'A .cue file is only a track list. Please select a ZIP containing the .cue and all required .bin tracks, or a complete .chd/.iso image.';
    if(file.size<128)return'This game file appears empty or invalid.';
    if(file.size>2*1024*1024*1024)return'This file exceeds the 2 GB browser limit for this launcher.';
    return null;
  }
  function checkSelection(){
    if(!selected)return;
    const err=validateFile(rom,selected.system);
    if(err){$('#copy-launch').disabled=true;fileStatus(err,rom?'error':'');return;}
    $('#copy-launch').disabled=false;
    const size=(rom.size/1024/1024).toFixed(1);
    fileStatus(rom.name+' · '+size+' MB · ready to emulate on your device'+(bios?' · BIOS selected':'')+'.','success');
  }
  $('#copy-rom-file').addEventListener('change',e=>{rom=e.target.files?.[0]||null;checkSelection()});
  $('#copy-bios-file').addEventListener('change',e=>{bios=e.target.files?.[0]||null;checkSelection()});
  const drop=$('#copy-dropzone');
  for(const type of ['dragenter','dragover'])drop.addEventListener(type,e=>{e.preventDefault();drop.classList.add('dragover')});
  for(const type of ['dragleave','drop'])drop.addEventListener(type,e=>{e.preventDefault();drop.classList.remove('dragover')});
  drop.addEventListener('drop',e=>{const f=e.dataTransfer?.files?.[0];if(f){rom=f;$('#copy-rom-label').textContent=f.name;checkSelection()}});
  $('#copy-close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{selected=null;rom=null;bios=null;$('#copy-rom-file').value='';$('#copy-bios-file').value=''});
  const createDoc=(entry,gameUrl,biosUrl,gameFilename)=>{
    const stableGameId=key=>{let hash=2166136261;for(const c of String(key)){hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0}return hash||1};
    const val=x=>JSON.stringify(x).replace(/</g,'\\u003c');
    const s=systemById(entry.system);
    return '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#030814">'+
    '<div id="game" style="width:100vw;height:100dvh"></div><script>'+
    'window.EJS_player="#game";window.EJS_core='+val(s.core)+';window.EJS_gameName='+val(gameFilename)+';window.EJS_gameID='+stableGameId(entry.system+'/'+entry.title)+';'+
    'window.EJS_gameUrl='+val(gameUrl)+';'+(biosUrl?'window.EJS_biosUrl='+val(biosUrl)+';':'')+
    'window.EJS_pathtodata="https://cdn.emulatorjs.org/stable/data/";window.EJS_startOnLoaded=true;'+
    'window.EJS_color="#00d4ff";window.EJS_backgroundColor="#050d20";'+
    'window.EJS_Buttons={playPause:true,restart:true,mute:true,settings:true,fullscreen:true,saveState:true,loadState:true};'+
    'window.EJS_ready=function(){parent.postMessage({ugnLocalStage:"ready"},"*")};'+
    'window.EJS_onGameStart=function(){parent.postMessage({ugnLocalStage:"started"},"*")};'+
    'window.addEventListener("error",function(e){var msg=String(e.message||"");if(/ResizeObserver loop (?:limit exceeded|completed with undelivered notifications)/i.test(msg)){e.preventDefault();return;}parent.postMessage({ugnLocalError:msg},"*")});'+
    '<\/script><script src="https://cdn.emulatorjs.org/stable/data/loader.js"><\/script></body></html>';
  };
  function launchFile(){
    if(!selected||!rom)return;
    const error=validateFile(rom,selected.system);
    if(error){fileStatus(error,'error');return;}
    const entry=selected,gameFile=rom,biosFile=bios;
    prefs.recent=[{system:entry.system,title:entry.title,lastOpened:Date.now()},...prefs.recent.filter(x=>prefId(x)!==prefId(entry))].slice(0,30);
    savePrefs();renderOwnedCollection();
    // Object URLs refer to the user's own file in memory; these bytes are never sent to UGN.
    activeUrls.forEach(url=>URL.revokeObjectURL(url));activeUrls=[];
    const gameUrl=URL.createObjectURL(gameFile);activeUrls.push(gameUrl);
    const biosUrl=biosFile?URL.createObjectURL(biosFile):'';if(biosUrl)activeUrls.push(biosUrl);
    const frame=document.createElement('iframe');
    frame.allow='autoplay; fullscreen; gamepad';frame.setAttribute('allowfullscreen','');
    frame.title='UGN Emulator · '+entry.title;frame.setAttribute('referrerpolicy','no-referrer');
    frame.srcdoc=createDoc(entry,gameUrl,biosUrl,gameFile.name);
    currentFrame=frame;
    $('#player-title').textContent=entry.title;
    $('#player-system').textContent=keyMap[entry.system].toUpperCase()+' / LOCAL USER COPY';
    $('#player-status').textContent='LOADING YOUR LOCAL FILE · NOTHING UPLOADED';
    const viewport=$('#player-viewport');viewport.replaceChildren(frame);finishLocalBoot?.();finishLocalBoot=attachBootOverlay(viewport,keyMap[entry.system],entry.title);
    dialog.close();gameDialog.showModal();
  }
  $('#copy-launch').onclick=launchFile;
  gameDialog.addEventListener('close',()=>{
    finishLocalBoot?.();finishLocalBoot=null;currentFrame=null;
    activeUrls.forEach(url=>URL.revokeObjectURL(url));activeUrls=[];
  });
  window.addEventListener('message',e=>{
    if(!currentFrame||e.source!==currentFrame.contentWindow||!e.data)return;
    if(e.data.ugnLocalStage==='ready')$('#player-status').textContent='CORE READY · CLICK INSIDE GAME WINDOW TO START YOUR COPY';
    if(e.data.ugnLocalStage==='started'){finishLocalBoot?.();$('#player-status').textContent='GAME RUNNING · LOCAL FILE';}
    if(e.data.ugnLocalError&&!/ResizeObserver loop (?:limit exceeded|completed with undelivered notifications)/i.test(String(e.data.ugnLocalError))){finishLocalBoot?.();$('#player-status').textContent='LOCAL EMULATOR ERROR · '+String(e.data.ugnLocalError).slice(0,140);}
  });
  $('#index-console').addEventListener('change',e=>{active=e.target.value;buildResults()});
  $('#index-query').addEventListener('input',e=>{
    term=e.target.value.trim().toLowerCase();
    clearTimeout(mountConsoleIndex.searchTimer);
    mountConsoleIndex.searchTimer=setTimeout(()=>{
      // When searching across all, the index files have already been downloaded on demand.
      if(!loading)buildResults();
    },150);
  });
  $('#index-region').addEventListener('change',e=>{region=e.target.value;buildResults()});
  $('#index-prev').onclick=()=>{if(page>0){page--;renderPage();$('#all-games').scrollIntoView({behavior:'smooth'})}};
  $('#index-next').onclick=()=>{if((page+1)*PAGE_SIZE<results.length){page++;renderPage();$('#all-games').scrollIntoView({behavior:'smooth'})}};
  async function init(){
    try{
      const res=await fetch('./catalog/manifest.json',{cache:'force-cache'});
      if(!res.ok)throw new Error('Manifest HTTP '+res.status);
      manifest=await res.json();
      $('#full-index-total').textContent=Number(manifest.total||0).toLocaleString('en-US');if($('#hero-catalog'))$('#hero-catalog').textContent=Number(manifest.total||0).toLocaleString('en-US');
      const opt=$('#index-console');
      opt.innerHTML='<option value="all">ALL 16 SYSTEMS</option>'+manifest.systems.map(m=>'<option value="'+clean(m.id)+'">'+clean(allSystemLabel(m.id))+' ('+Number(m.count).toLocaleString('en-US')+')</option>').join('');
      opt.value=active;
      await buildResults();
    }catch(err){
      $('#full-index-total').textContent='OFFLINE';
      setStatus('GAME INDEX UNAVAILABLE — BUILT-IN GAMES STILL WORK');
      console.warn('Could not start UGN complete console index:',err);
    }
  }
  function gotoSystem(id){
    if(!manifest)return;
    active=id&&manifest.systems.some(s=>s.id===id)?id:'all';
    $('#index-console').value=active;
    term='';region='all';$('#index-query').value='';$('#index-region').value='all';
    buildResults();
    $('#all-games').scrollIntoView({behavior:'smooth'});
  }
  function openCustom(id='nes'){
    const systemId=manifest?.systems.some(s=>s.id===id)?id:'nes';
    showCopy({system:systemId,title:'My '+(systemById(systemId)?.name||'Console')+' Game',region:'',key:'custom-'+systemId});
  }
  renderOwnedCollection();
  init();
  return {gotoSystem,openCustom,showCopy,counts:()=>manifest?.total||0};
}
