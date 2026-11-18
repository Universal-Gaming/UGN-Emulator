/* UGN Emulator — resilient artwork rendering.
 * Never presents a generated archive sleeve as authentic game box art.
 * Genuine screenshots/covers remain external unless the author explicitly permits redistribution.
 */
const htmlEscape=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const xmlEscape=htmlEscape;
const shorten=(value,max)=>{const s=String(value??'').trim();return s.length>max?s.slice(0,max-1)+'…':s};
function titleLines(title){
  const words=String(title||'UNTITLED GAME').replace(/\s+/g,' ').trim().split(' ');
  const out=[];let line='';
  for(const word of words){
    const next=line?line+' '+word:word;
    if(next.length>22&&line){out.push(line);line=word;}else line=next;
    if(out.length>=3)break;
  }
  if(line&&out.length<3)out.push(line);
  return out.slice(0,3).map(s=>shorten(s,22));
}
export function archiveArtwork(title,system){
  const short=shorten(system||'CONSOLE',23).toUpperCase();
  const lines=titleLines(title);
  const txt=lines.map((line,i)=>'<text x="36" y="'+(320+i*43)+'" fill="#f8fcff" font-family="Arial,Helvetica,sans-serif" font-size="31" font-weight="800">'+xmlEscape(line)+'</text>').join('');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600" role="img" aria-label="UGN archive cover: '+xmlEscape(title)+'">'+
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#08112d"/><stop offset=".55" stop-color="#1d1747"/><stop offset="1" stop-color="#042b3a"/></linearGradient><linearGradient id="orbit" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="#00d4ff"/><stop offset="1" stop-color="#9472ff"/></linearGradient></defs>'+
    '<rect width="480" height="600" fill="url(#bg)"/><g opacity=".35" stroke="#59b8ff" fill="none"><path d="M0 140 L480 140 M0 450 L480 450 M40 0 L40 600 M440 0 L440 600"/></g>'+
    '<g fill="none" stroke="url(#orbit)"><circle cx="252" cy="175" r="93" stroke-width="5"/><ellipse cx="252" cy="175" rx="168" ry="52" transform="rotate(-20 252 175)" stroke-width="4"/><circle cx="252" cy="175" r="18" fill="#00d4ff" stroke-width="0"/></g>'+
    '<text x="36" y="66" fill="#5cfc76" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="900">UGN</text>'+
    '<text x="136" y="66" fill="#c8e8ff" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="3">GALACTIC ARCHIVE</text>'+
    '<text x="36" y="267" fill="#4ddfff" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" letter-spacing="3">'+xmlEscape(short)+'</text>'+
    txt+
    '<path d="M36 486 H444" stroke="#58ceff" opacity=".6"/>'+
    '<text x="36" y="524" fill="#c4d6ff" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700">UGN ARCHIVE COVER</text>'+
    '<text x="36" y="548" fill="#a9b7d3" font-family="Arial,Helvetica,sans-serif" font-size="12">Original cover or screenshot unavailable</text>'+
    '<text x="36" y="571" fill="#70829f" font-family="Arial,Helvetica,sans-serif" font-size="11">Not official game artwork</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function useArchiveFallback(img,title,system,note){
  img.onerror=null;
  img.src=archiveArtwork(title,system);
  img.alt='UGN archive sleeve for '+title+' — original game artwork unavailable';
  img.dataset.artworkState='archive';
  img.dataset.artworkVerified='false';
  if(note)note.textContent='UGN ARCHIVE COVER · NOT OFFICIAL ARTWORK';
}
export function artworkImage(source,title,system,extra=''){
  const art=source||archiveArtwork(title,system);
  return '<img loading="lazy" decoding="async" referrerpolicy="no-referrer" data-artwork-title="'+htmlEscape(title)+'" data-artwork-system="'+htmlEscape(system)+'" data-artwork-state="'+(source?'original':'archive')+'" src="'+htmlEscape(art)+'" alt="'+htmlEscape(source?'Source artwork for '+title:'UGN archive sleeve for '+title+' — official art unavailable')+'" '+extra+'>';
}
export function wireArtwork(root=document){
  const nodes=root.matches?.('img[data-artwork-title]')?[root]:root.querySelectorAll('img[data-artwork-title]');
  for(const img of nodes){
    if(img.dataset.artworkBound==='true')continue;
    img.dataset.artworkBound='true';
    const title=img.dataset.artworkTitle||'Unknown game',system=img.dataset.artworkSystem||'Console';
    const note=img.closest('.game-art')?.querySelector('.art-note');
    if(img.dataset.artworkState==='archive'){
      img.dataset.artworkVerified='false';
      if(note)note.textContent='UGN ARCHIVE COVER · NOT OFFICIAL ARTWORK';
      continue;
    }
    img.addEventListener('error',()=>useArchiveFallback(img,title,system,note),{once:true});
    if(img.complete&&img.naturalWidth===0)useArchiveFallback(img,title,system,note);
  }
}
export function setArtworkImage(img,source,title,system,caption){
  img.hidden=false;img.onerror=null;
  if(caption)caption.textContent=source?'ORIGINAL SOURCE ARTWORK · IF AVAILABLE':'UGN ARCHIVE COVER · NOT OFFICIAL ARTWORK';
  if(!source){useArchiveFallback(img,title,system,caption);return;}
  img.alt='Source artwork for '+title;img.dataset.artworkState='original';
  img.onerror=()=>useArchiveFallback(img,title,system,caption);
  img.src=source;
}
