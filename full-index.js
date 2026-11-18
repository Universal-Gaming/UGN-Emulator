/* UGN's 41,408-entry, local, rights-neutral game-title browser.
 * No commercial ROM links, no external game download endpoints.
 * Metadata CC BY-SA 4.0, generated from Libretro DAT files. */
export function mountCompleteIndex(api){
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  if(!$('#index-grid'))return;
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let current='nes',page=0,query='',region='all',entries=[],loading=false,token=0,manifest=null;
  const pageSize=36;
  const systemName=id=>api.systems.find(s=>s.id===id)?.name||id;
  const consoleMenu=$('#index-console');
  consoleMenu.innerHTML=api.systems.map(s=>'<option value="'+escape(s.id)+'">'+escape(s.name)+'</option>').join('');
  const setStatus=value=>$('#index-status').textContent=value;
  function render(){
    const term=query.trim().toLowerCase().replace(/[^a-z0-9 ]/g,'');
    const chosen=entries.filter(g=>{
      if(region!=='all'&&(g.region||'')!==region)return false;
      return !term||g.name.toLowerCase().replace(/[^a-z0-9 ]/g,'').includes(term);
    });
    const totalPages=Math.max(1,Math.ceil(chosen.length/pageSize));
    page=Math.max(0,Math.min(page,totalPages-1));
    const chunk=chosen.slice(page*pageSize,(page+1)*pageSize);
    $('#index-grid').innerHTML=chunk.map(g=>{
      const pic=g.image||api.photo(api.systems.find(s=>s.id===current));
      return '<article class="index-card"><button class="index-card-favorite '+(api.memory.favorites.includes(g.id)?'active':'')+'" data-index-fav="'+escape(g.id)+'" aria-label="Favorite '+escape(g.name)+'">♥</button><div class="index-cover">'+(pic?'<img loading="lazy" referrerpolicy="no-referrer" src="'+escape(pic)+'" alt="'+escape(g.name)+' artwork" onerror="this.hidden=true;this.nextElementSibling.hidden=false">':'')+'<span class="index-placeholder" '+(pic?'hidden':'')+'>'+escape(api.systems.find(s=>s.id===current)?.short||'UGN')+'</span><span class="index-cover-label">'+escape(api.systems.find(s=>s.id===current)?.short||current)+'</span><span class="index-region">'+escape(g.region||'EDITION')+'</span></div><div class="index-card-content"><h3>'+escape(g.name)+'</h3><div class="index-card-description">Original console software. Compatible personal game file required.</div><div class="index-card-action"><span>◈ YOUR OWN COPY</span><button data-index-open="'+escape(g.id)+'">VIEW TITLE ↗</button></div></div></article>';
    }).join('');
    $('#index-page').textContent='PAGE '+(page+1)+' / '+totalPages+' · '+chosen.length+' TITLES';
    $('#index-prev').disabled=page<=0;
    $('#index-next').disabled=page+1>=totalPages;
    $('#index-empty').hidden=chunk.length>0;
    setStatus(loading?'INDEXING TITLES…':chosen.length+' MATCHING TITLES / '+systemName(current));
    $$('[data-index-open]').forEach(b=>b.onclick=()=>api.inspect(b.dataset.indexOpen));
    $$('[data-index-fav]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.indexFav;api.memory.favorites=api.memory.favorites.includes(id)?api.memory.favorites.filter(x=>x!==id):[...api.memory.favorites,id];api.save();render();
    });
  }
  async function showConsole(id){
    current=id;consoleMenu.value=id;query='';region='all';page=0;$('#index-query').value='';$('#index-region').value='all';
    loading=true;entries=[];setStatus('LOADING '+systemName(id).toUpperCase()+' TITLE INDEX');
    const nonce=++token;
    try{await api.ensure(id);if(nonce!==token)return;entries=api.allTitles.filter(g=>g.mode==='personal'&&g.system===id);entries.sort((a,b)=>a.name.localeCompare(b.name))}
    catch(e){if(nonce!==token)return;console.warn('Full title index unavailable',e);setStatus('LOCAL TITLE CATALOG UNAVAILABLE');}
    loading=false;render();
  }
  consoleMenu.onchange=()=>showConsole(consoleMenu.value);
  $('#index-query').oninput=e=>{query=e.target.value;page=0;render()};
  $('#index-region').onchange=e=>{region=e.target.value;page=0;render()};
  $('#index-prev').onclick=()=>{page=Math.max(0,page-1);render();$('#all-games').scrollIntoView({block:'start',behavior:'smooth'})};
  $('#index-next').onclick=()=>{page++;render();$('#all-games').scrollIntoView({block:'start',behavior:'smooth'})};
  fetch('./catalog/manifest.json',{cache:'force-cache'}).then(r=>r.json()).then(data=>{
    manifest=data;$('#full-index-total').textContent=Number(data.total||0).toLocaleString('en-US');
    const counted=api.systems.length;$('#index-status').textContent='INDEX AVAILABLE / '+counted+' CONSOLES';
  }).catch(()=>{$('#full-index-total').textContent='—'});
  showConsole('nes');
  window.UGN_FULL_INDEX={openSystem:(id)=>{if(api.systems.some(s=>s.id===id)){showConsole(id);$('#all-games').scrollIntoView({behavior:'smooth'})}}};
}
