function cleanPlayerName(v){return(v||'').trim().replace(/[^\p{L}\p{N} _.-]/gu,'').slice(0,16)||'SkyPuffer';}
function readLocalScores(){try{return JSON.parse(localStorage.skyPuffLocalScores||'[]')}catch(e){return[]}}
function writeLocalScores(rows){localStorage.skyPuffLocalScores=JSON.stringify(rows.slice(0,50));}
function saveLocalScore(name,height,meta={}){const rows=readLocalScores();rows.push({name,height:Math.floor(height),at:Date.now(),...meta});rows.sort((a,b)=>b.height-a.height);writeLocalScores(rows);}
async function submitOnlineScore(height){
 if(!height||height<1)return;
 const name=cleanPlayerName(playerNameEl.value)||'SkyPuff';
 save.playerName=name;
 persist();
 const anti=window.skyPuffAntiCheat?window.skyPuffAntiCheat.verdict(height,coins):{ok:true,signature:'',flags:[]};
 saveLocalScore(name,height,{verified:!!anti.ok,signature:anti.signature||'',flags:(anti.flags||[]).length});
 if(!anti.ok){
   if(window.skyPuffAntiCheat)window.skyPuffAntiCheat.noteBlockedSubmission();
   console.warn('Online score blocked by anti-cheat',anti);
   showToast('Score lagret lokalt • anti-cheat review');
   return;
 }
 if(!API_BASE)return;
 try{
   const r=await fetch(API_BASE+'/score',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({name,height:Math.floor(height),runSignature:anti.signature,version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'beta'})
   });
   if(!r.ok)throw new Error('HTTP '+r.status);
 }catch(e){
   console.warn('Highscore submit failed; local score kept',e);
 }
}
