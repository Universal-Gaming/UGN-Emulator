/* Title-only index for personal-copy compatibility.
 * We NEVER import, retain, expose or link commercial ROM download URLs.
 * A public reference spreadsheet is queried for game names and, where supplied,
 * cover thumbnails. Any external thumbnail remains remotely hosted.
 * When that catalog is unavailable, known console titles remain selectable
 * by providing your own legally obtained file.
 */
const PUBLIC_CATALOG="https://docs.google.com/spreadsheets/d/1qLJ3-k50ZvMmpxeO9C-72G9uat9BnYYezZC-nKmFzaY/gviz/tq";
const referenceIds={nes:"nes",snes:"snes",n64:"n64",gb:"gb",gbc:"gb",gba:"gba",nds:"nds",segaMD:"sega",segaGG:"gg",sega32x:"sega32x",segaCD:"segacd",segaSaturn:"saturn",psx:"ps1",atari2600:"atari2600",ngp:"ngp",neogeo:"neogeo"};
const cache=new Map();
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
function extract(text){
  const start=text.indexOf("("),end=text.lastIndexOf(")");
  if(start<0||end<=start)throw Error("Invalid public catalog response");
  const data=JSON.parse(text.slice(start+1,end));
  if(data.status!=="ok"||!data.table)throw Error("Public catalog unavailable");
  const cols=data.table.cols||[];
  const keys=cols.map((c,i)=>String(c.label||c.id||"col"+i).trim());
  return (data.table.rows||[]).map(row=>{
    const vals=(row.c||[]).map(x=>x&&x.v!=null?x.v:"");
    const out={};for(let i=0;i<keys.length;i++)out[keys[i]]=vals[i]||"";
    return out;
  });
}
export async function loadPersonalTitles(consoleId) {
  if(cache.has(consoleId))return cache.get(consoleId);
  const fallback=(seeds[consoleId]||[]).map(n=>game(consoleId,n));
  const load=async()=>{
    const id=referenceIds[consoleId];if(!id)return fallback;
    const query="select * where A = '"+id+"'";
    const params=new URLSearchParams({tqx:"out:json",headers:"1",sheet:"games",tq:query});
    let rows;
    try{
      const result=await fetch(PUBLIC_CATALOG+"?"+params,{mode:"cors",credentials:"omit",signal:AbortSignal.timeout(18000)});
      if(!result.ok)throw Error("Public catalog HTTP "+result.status);
      rows=extract(await result.text());
    }catch(e){console.warn("Public title index unavailable; showing locally curated names",e);return fallback;}
    const unique=new Map(fallback.map(g=>[normalize(g.name),g]));
    for(const row of rows){
      const title=String(row.name||row.title||row.col1||"").trim();
      if(!title||title.length>180)continue;
      const image=String(row.thumbnailUrl||"").trim();
      const validImage=/^https:\/\//.test(image)&&image.length<1500?image:null;
      const x=game(consoleId,title,validImage,"public-reference-metadata");
      // The spreadsheet's ROM downloadUrl and other file links are never used.
      const key=normalize(title);if(key)unique.set(key,x);
    }
    const result=[...unique.values()];
    if(!result.length)return fallback;
    return result;
  };
  const promise=load().catch(()=>fallback);
  cache.set(consoleId,promise);
  return promise;
}
export function builtinTitleCount(consoleId){return(seeds[consoleId]||[]).length;}
