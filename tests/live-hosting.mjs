import { writeFileSync } from 'node:fs';
const origin='https://universal-gaming.github.io/UGN-Emulator/';
const deadlineMs=16000;
async function request(url,method='GET'){
  for(let attempt=1;attempt<=4;attempt++){
    try{
      const response=await fetch(url,{method,redirect:'follow',signal:AbortSignal.timeout(deadlineMs),headers:{'Cache-Control':'no-cache'}});
      if(response.ok)return response;
      if(attempt===4)throw Error('HTTP '+response.status+' '+response.statusText);
    }catch(error){if(attempt===4)throw error;}
    await new Promise(done=>setTimeout(done,attempt*1400));
  }
}
const report={site:origin,checked_at:new Date().toISOString(),checks:[],failures:[]};
const record=(name,status,info={})=>{report.checks.push({name,status,...info});if(status!=='PASS')report.failures.push(name+': '+(info.error||'failed'))};
async function check(name,url,type){
  try{
    const res=await request(new URL(url,origin).href,type==='json'?'GET':'HEAD');
    if(type==='json'){const value=await res.json();record(name,'PASS',{http:res.status,count:value.games?.length??value.total??null});return value;}
    const contentType=res.headers.get('content-type')||'';
    record(name,'PASS',{http:res.status,content_type:contentType,bytes:Number(res.headers.get('content-length')||0)});
    return res;
  }catch(e){record(name,'FAIL',{error:String(e.message||e).slice(0,220)});return null;}
}
let hosted;
try{
 await check('homepage','index.html');
 await check('classic library','library.html');
 await check('main application','app.js');
 await check('artwork fallback','artwork.js');
 await check('3D starship','galactic.js');
 await check('gallery artwork','assets/galactic-atrium.webp');
 await check('favicon','favicon.svg');
 hosted=await check('live 79-ROM manifest','catalog/hosted.json','json');
 const titleIndex=await check('live 41K metadata index','catalog/manifest.json','json');
 if(!titleIndex||titleIndex.total!==41408)record('expected title index count','FAIL',{error:'Expected 41,408 metadata records'});
 else record('expected title index count','PASS',{total:titleIndex.total});
 if(!hosted||!Array.isArray(hosted.games)||hosted.games.length!==79){
   record('79-ROM inventory','FAIL',{error:'Manifest absent or not 79'});
 }else{
   const found=[];
   for(let i=0;i<hosted.games.length;i+=10){
      const entries=hosted.games.slice(i,i+10);
      const checks=await Promise.all(entries.map(async entry=>{
        try{
          const res=await request(new URL(entry.path,origin).href,'HEAD');
          const size=Number(res.headers.get('content-length')||0);
          const encoding=res.headers.get('content-encoding');
          if(size&&(!encoding||encoding==='identity')&&size!==entry.bytes)throw Error('Size mismatch '+size+' vs '+entry.bytes);
          return {path:entry.path,status:'PASS',http:res.status,bytes:entry.bytes};
        }catch(e){return {path:entry.path,status:'FAIL',error:String(e.message||e).slice(0,190)}}
      }));
      found.push(...checks);
   }
   for(const item of found)record('ROM '+item.path,item.status,item);
 }
}finally{
 const summary={checks:report.checks.length,passed:report.checks.filter(x=>x.status==='PASS').length,failed:report.failures.length};
 report.summary=summary;
 writeFileSync('live-hosting-audit.json',JSON.stringify(report,null,2)+'\n');
 console.log('LIVE HOSTING AUDIT:',JSON.stringify(summary));
 for(const failure of report.failures)console.error('LIVE ASSET FAILURE:',failure);
}
if(report.failures.length)process.exitCode=1;
