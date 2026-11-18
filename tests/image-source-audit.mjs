import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

// Network diagnostic, intentionally separate from the functional release gate.
// Artwork URLs can disappear; the public interface must always show a labeled local fallback.
const app=readFileSync('app.js','utf8');
const raw=app.split('\n').filter(line=>/^\s*C\(/.test(line));
const titles=raw.map(line=>{
  const game=line.match(/roms\/[^'"]+/)?.[0]||null;
  const url=line.match(/https:\/\/[^'"]+/)?.[0]||null;
  const title=line.slice(0,200).match(/(?:\.nes|\.gbc|\.gba|\.nds|\.sfc|\.n64|\.gb|\.bin|\.md|\.a26|\.ngp)',['"]([^'"]+)/)?.[1]||game;
  return {game,title,source:url};
});
if(titles.length!==79)throw Error('Image audit expected 79 hosted game cards; got '+titles.length);
if(new Set(titles.map(x=>x.game)).size!==79)throw Error('Duplicate game paths in catalog');
const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
const report=[];
try{
  await new Promise(done=>setTimeout(done,800));
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  await page.goto('http://127.0.0.1:8765/library.html',{waitUntil:'domcontentloaded',timeout:30000});
  const sourced=titles.filter(x=>x.source);
  for(let i=0;i<sourced.length;i+=8){
    const chunk=sourced.slice(i,i+8);
    const checked=await page.evaluate(async entries=>{
      return await Promise.all(entries.map(entry=>new Promise(resolve=>{
        const img=new Image();
        img.referrerPolicy='no-referrer';
        let finished=false;
        const finish=(status,width=0)=>{if(finished)return;finished=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve({...entry,status,width})};
        const timer=setTimeout(()=>finish('timeout'),14000);
        img.onload=()=>finish(img.naturalWidth>0?'ok':'invalid',img.naturalWidth);
        img.onerror=()=>finish('error');
        img.src=entry.source;
      })));
    },chunk);
    report.push(...checked);
    console.log('Checked remote game artwork:',Math.min(i+8,sourced.length)+'/'+sourced.length);
  }
  report.push(...titles.filter(x=>!x.source).map(x=>({...x,status:'ugn-original-cover',width:480})));
  report.sort((a,b)=>a.game.localeCompare(b.game));
  const summary={
    total:titles.length,source_urls:sourced.length,verified_source_urls:report.filter(x=>x.status==='ok').length,
    unreachable_sources:report.filter(x=>!['ok','ugn-original-cover'].includes(x.status)).length,
    dedicated_ugn_covers:report.filter(x=>x.status==='ugn-original-cover').length,
    note:'Unavailable original sources are transparently replaced in-app by labeled UGN archive sleeves. Network results can vary by time and origin.'
  };
  const data={checked_at:new Date().toISOString(),summary,games:report};
  writeFileSync('artwork-audit.json',JSON.stringify(data,null,2)+'\n');
  console.log('SOURCE ARTWORK AUDIT:',JSON.stringify(summary));
  for(const item of report.filter(x=>!['ok','ugn-original-cover'].includes(x.status)))console.warn('BROKEN SOURCE ART:',item.game,item.status,item.source);
  if(summary.total!==summary.verified_source_urls+summary.unreachable_sources+summary.dedicated_ugn_covers)throw Error('Invalid audit accounting');
}finally{if(browser)await browser.close();server.kill();}
