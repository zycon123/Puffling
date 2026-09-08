async function submitOnlineScore(height){
 if(!height || height<1)return;
 const name=cleanPlayerName(playerNameEl.value);
 save.playerName=name;
 persist();
 try{
   await fetch(API_BASE+'/score',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({name,height:Math.floor(height)})
   });
 }catch(e){
   console.warn('Highscore submit failed',e);
 }
}
