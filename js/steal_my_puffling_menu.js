/* Puffling — Steal My Puffling multiplayer entry v0.2 */
(function(){
 function ensure(){
  let b=document.getElementById('stealMyPufflingBtn');
  if(!b){b=document.createElement('button');b.id='stealMyPufflingBtn';b.className='gold';}
  b.textContent='STEAL MY PUFFLING 😈';
  b.onclick=()=>{
   if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent='Steal My Puffling: Vinn kampen og velg Mystery Box eller stjel én ubeskyttet Puffling.';
   if(typeof quickMatch==='function')quickMatch();
  };
  const card=document.querySelector('#multiplayerMenu .card');
  if(card){
   const close=document.getElementById('closeMultiplayer');
   if(b.parentElement!==card)card.insertBefore(b,close||null);
   b.style.marginTop='12px';
  }
 }
 function rename(){
  const result=document.getElementById('stealMyPuffResult');if(result){const small=result.querySelector('.card>.small');if(small)small.textContent='Velg Mystery Box eller stjel én ubeskyttet Puffling fra motstanderen.';}
  const steal=document.getElementById('chooseStealPuff');if(steal)steal.textContent='😈 STJEL PUFFLING';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ensure();rename();},100));else setTimeout(()=>{ensure();rename();},100);
 window.PufflingStealMode={ensure,open:()=>{if(typeof openMultiplayer==='function')openMultiplayer();setTimeout(()=>document.getElementById('stealMyPufflingBtn')?.focus(),50);}};
})();