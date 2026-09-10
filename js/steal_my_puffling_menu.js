/* Puffling — Race My Puffling multiplayer entry v1.0
 * Compatibility filename retained for the current beta loader.
 */
(function(){
 function ensure(){
  let b=document.getElementById('stealMyPufflingBtn')||document.getElementById('raceMyPufflingBtn');
  if(!b){b=document.createElement('button');b.className='gold';}
  b.id='raceMyPufflingBtn';
  b.textContent='RACE MY PUFFLING 🏁';
  b.onclick=()=>{
   if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent='Race My Puffling: Førstemann til 1500m. Bruk Puffling-evnen din opptil 3 ganger for å forstyrre ghost-motstanderen.';
   if(typeof quickMatch==='function')quickMatch();
  };
  const card=document.querySelector('#multiplayerMenu .card');
  if(card){const close=document.getElementById('closeMultiplayer');if(b.parentElement!==card)card.insertBefore(b,close||null);b.style.marginTop='12px';}
 }
 function removeLegacyCopy(){
  const old=document.getElementById('stealMyPuffResult');if(old)old.remove();
  document.querySelectorAll('button').forEach(btn=>{if(/STEAL MY PUFFLING|STJEL PUFFLING/i.test(btn.textContent||''))btn.style.display='none';});
 }
 function open(){if(typeof openMultiplayer==='function')openMultiplayer();setTimeout(()=>document.getElementById('raceMyPufflingBtn')?.focus(),50);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ensure();removeLegacyCopy();},100));else setTimeout(()=>{ensure();removeLegacyCopy();},100);
 window.PufflingRaceMode={ensure,open};
 window.PufflingStealMode={ensure,open};
})();