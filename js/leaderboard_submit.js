function readLocalScores(){try{return JSON.parse(localStorage.skyPuffLocalScores||'[]')}catch(e){return[]}}
function writeLocalScores(rows){localStorage.skyPuffLocalScores=JSON.stringify(rows.slice(0,50));}
function saveLocalScore(name,height){const rows=readLocalScores();rows.push({name,height:Math.floor(height),at:Date.now()});rows.sort((a,b)=>b.height-a.height);writeLocalScores(rows);}
async function submitOnlineScore(height){
 if(!height||height<1)return;
 const name=cleanPlayerName(playerNameEl.value)||'SkyPuff';
 save.playerName=name;
 persist();
 saveLocalScore(name,height);
 if(!API_BASE)return;
 try{
   const r=await fetch(API_BASE+'/score',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({name,height:Math.floor(height)})
   });
   if(!r.ok)throw new Error('HTTP '+r.status);
 }catch(e){
   console.warn('Highscore submit failed; local score kept',e);
 }
}
