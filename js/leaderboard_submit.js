function cleanPlayerName(v){return(v||'').trim().replace(/[^\p{L}\p{N} _.-]/gu,'').slice(0,16)||'SkyPuffer';}
function readLocalScores(){try{return JSON.parse(localStorage.skyPuffLocalScores||'[]')}catch(e){return[]}}
function writeLocalScores(rows){localStorage.skyPuffLocalScores=JSON.stringify(rows.slice(0,50));}
function saveLocalScore(name,height,meta={}){const rows=readLocalScores();rows.push({name,height:Math.floor(height),at:Date.now(),...meta});rows.sort((a,b)=>b.height-a.height);writeLocalScores(rows);}
async function leaderboardAuthToken(){
 try{
  let token=String(localStorage.getItem('pufflingAccountAuthToken')||'');
  if(!token&&window.SkyPuffRaceTransport?.ensureGuestIdentity){try{const id=await window.SkyPuffRaceTransport.ensureGuestIdentity();token=String(id?.token||localStorage.getItem('pufflingAccountAuthToken')||'');}catch(e){}}
  return token;
 }catch(e){return'';}
}
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
   showToast(tr('scoreSavedLocalAntiCheat'));
   return;
 }
 if(!API_BASE)return;
 try{
   const token=await leaderboardAuthToken(),headers={'Content-Type':'application/json'};if(token)headers.Authorization=`Bearer ${token}`;
   const r=await fetch(API_BASE+'/score',{
     method:'POST',
     headers,
     body:JSON.stringify({height:Math.floor(height),runSignature:anti.signature,version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'beta'})
   });
   if(!r.ok)throw new Error('HTTP '+r.status);
 }catch(e){
   console.warn('Highscore submit failed; local score kept',e);
 }
}
