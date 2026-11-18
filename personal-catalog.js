/* Title-only index for personal-copy compatibility.
 * We NEVER download, serve or link commercial ROM files.
 * The title index is generated from rights-neutral Libretro DAT metadata, CC BY-SA 4.0.
 * Cover thumbnails are loaded by exact game title from the independent Libretro thumbnail service when available.
 * When that catalog is unavailable, known console titles remain selectable
 * by providing your own legally obtained file.
 */
/* Static in-repository, rights-neutral metadata licensed CC BY-SA from Libretro Database. */
const cache=new Map();
const playlists={nes:"Nintendo - Nintendo Entertainment System",snes:"Nintendo - Super Nintendo Entertainment System",n64:"Nintendo - Nintendo 64",gb:"Nintendo - Game Boy",gbc:"Nintendo - Game Boy Color",gba:"Nintendo - Game Boy Advance",nds:"Nintendo - Nintendo DS",segaMD:"Sega - Mega Drive - Genesis",segaGG:"Sega - Game Gear",sega32x:"Sega - 32X",segaCD:"Sega - Mega-CD - Sega CD",segaSaturn:"Sega - Saturn",psx:"Sony - PlayStation",atari2600:"Atari - 2600",ngp:"SNK - Neo Geo Pocket",neogeo:"SNK - Neo Geo"};
export const acceptedFormats={
  nes:".nes,.zip,.7z",snes:".sfc,.smc,.zip,.7z",n64:".z64,.n64,.v64,.zip",gb:".gb,.gbc,.zip",
  gbc:".gbc,.gb,.zip",gba:".gba,.zip",nds:".nds,.zip",segaMD:".md,.gen,.bin,.smd,.zip",segaGG:".gg,.zip",
  sega32x:".32x,.bin,.zip",segaCD:".chd,.iso,.cue,.bin,.zip",segaSaturn:".chd,.iso,.cue,.zip",
  psx:".chd,.pbp,.cue,.iso,.bin,.zip",atari2600:".a26,.bin,.zip",ngp:".ngp,.ngc,.zip",
  neogeo:".zip"
};
export const needsBios=new Set(["segaCD","segaSaturn","psx","neogeo"]);
export const coreNeedsIsolation=new Set(["segaSaturn"]);
const seeds={
  nes:["Super Mario Bros.","The Legend of Zelda","Metroid","Mega Man 2","Castlevania","Contra","Kirby's Adventure","DuckTales","Dragon Warrior"],
  snes:["Super Mario World","The Legend of Zelda: A Link to the Past","Super Metroid","Chrono Trigger","Donkey Kong Country","Super Mario Kart","EarthBound","F-Zero"],
  n64:["Super Mario 64","The Legend of Zelda: Ocarina of Time","Mario Kart 64","GoldenEye 007","Banjo-Kazooie","Star Fox 64","Paper Mario"],
  gb:["Tetris","Pokémon Red Version","Pokémon Blue Version","Kirby's Dream Land","The Legend of Zelda: Link's Awakening","Super Mario Land"],
  gbc:["Pokémon Crystal Version","The Legend of Zelda: Oracle of Ages","The Legend of Zelda: Oracle of Seasons","Wario Land 3","Shantae"],
  gba:["Pokémon Emerald Version","Metroid Fusion","Metroid: Zero Mission","Mario Kart: Super Circuit","Advance Wars","The Legend of Zelda: The Minish Cap"],
  nds:["New Super Mario Bros.","Mario Kart DS","Pokémon Diamond Version","The Legend of Zelda: Phantom Hourglass","Animal Crossing: Wild World"],
  segaMD:["Sonic the Hedgehog","Sonic the Hedgehog 2","Streets of Rage 2","Gunstar Heroes","Shining Force II","Phantasy Star IV"],
  segaGG:["Sonic the Hedgehog","Columns","The GG Shinobi","Sonic Chaos"],
  sega32x:["Knuckles' Chaotix","Virtua Racing Deluxe","Star Wars Arcade","Doom"],
  segaCD:["Sonic CD","Lunar: The Silver Star","Snatcher","Ecco the Dolphin"],
  segaSaturn:["NiGHTS into Dreams...","Panzer Dragoon","Guardian Heroes","Sega Rally Championship","Radiant Silvergun"],
  psx:["Final Fantasy VII","Metal Gear Solid","Crash Bandicoot","Resident Evil 2","Gran Turismo 2","Tekken 3","Spyro the Dragon"],
  atari2600:["Adventure","Pitfall!","Yars' Revenge","Asteroids","River Raid"],
  ngp:["Sonic Pocket Adventure","SNK vs. Capcom: The Match of the Millennium","Metal Slug: 1st Mission","King of Fighters R-2"],
  neogeo:["Metal Slug","The King of Fighters '98","Samurai Shodown II","Garou: Mark of the Wolves","Fatal Fury Special"]
};
function normalize(title){return String(title||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9]+/g," ").toLowerCase().trim()}
function titleId(consoleId,title){let h=2166136261;const s=consoleId+"|"+normalize(title);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return"personal-"+consoleId+"-"+(h>>>0).toString(36)}
function game(consoleId,name,img=null,source="manual"){
  return{id:titleId(consoleId,name),name,system:consoleId,file:null,mode:"personal",genre:"Classic Console",creator:"Original copyright holder",year:"Classic",desc:"Play the original console title with your own compatible, lawfully obtained game file. UGN does not provide this ROM.",image:img,color:"violet",source};
}
function canonicalCoverPath(consoleId,name){
  const playlist=playlists[consoleId];if(!playlist)return null;
  // Exact DAT title match; a failed URL falls back to a genuine photo of the console.
  return "https://raw.githubusercontent.com/libretro-thumbnails/"+
    encodeURIComponent(playlist.replaceAll(" ","_").replaceAll("-","-"))+
    "/master/Named_Boxarts/"+encodeURIComponent(name.replaceAll("&","_").replaceAll("/","_"))+".png";
}
export async function loadPersonalTitles(consoleId){
  if(cache.has(consoleId))return cache.get(consoleId);
  const fallback=(seeds[consoleId]||[]).map(name=>game(consoleId,name));
  const task=(async()=>{
    if(!playlists[consoleId])return fallback;
    try{
      const res=await fetch('./catalog/byo/'+consoleId+'.json',{cache:'force-cache'});
      if(!res.ok)throw Error('Title index HTTP '+res.status);
      const rows=await res.json();
      if(!Array.isArray(rows))throw Error('Invalid title index');
      const seen=new Set();
      const titles=[];
      for(const row of rows){
        const name=String(row?.[0]||'').trim();
        if(!name||name.length>220)continue;
        const key=normalize(name);
        if(!key||seen.has(key))continue;
        seen.add(key);
        const item=game(consoleId,name,canonicalCoverPath(consoleId,name),"libretro-database");
        item.region=String(row?.[1]||"");
        titles.push(item);
      }
      return titles.length?titles:fallback;
    }catch(error){
      console.warn('Local title index unavailable for '+consoleId,error);
      return fallback;
    }
  })();
  cache.set(consoleId,task);
  return task;
}
export function builtinTitleCount(consoleId){return(seeds[consoleId]||[]).length;}

export function seedPersonalTitles(){return Object.keys(seeds).flatMap(id=>(seeds[id]||[]).map(n=>game(id,n)));}
