/* Puffling — Steal My Puffling menu entry v0.1 */
(function(){
 function ensure(){
  if(document.getElementById('stealMyPufflingBtn'))return;
  const b=document.createElement('button');b.id='stealMyPufflingBtn';b.className='secondary';b.textContent='STEAL MY PUFFLING 😈';
  b.onclick=()=>{
   // This mode uses the existing multiplayer race: winner chooses Mystery Box or stealing one unprotected Puffling.
   if(typeof openMultiplayer==='function')openMultiplayer();
   else if(typeof multiplayerBtnEl!=='undefined'&&multiplayerBtnEl)multiplayerBtnEl.click();
  };
  const group=document.getElementById('menuCollectionGroup')||document.getElementById('menuMoreGrid')||document.querySelector('#start .menuActions');
  if(group)group.appendChild(b);
 }
 function rename(){
  const result=document.getElementById('stealMyPuffResult');if(result){const small=result.querySelector('.card>.small');if(small)small.textContent='Velg Mystery Box eller stjel én ubeskyttet Puffling fra motstanderen.';}
  const steal=document.getElementById('chooseStealPuff');if(steal)steal.textContent='😈 STEAL PUFFLING';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ensure();rename();},100));else setTimeout(()=>{ensure();rename();},100);
 window.PufflingStealMode={ensure,open:()=>document.getElementById('stealMyPufflingBtn')?.click()};
})();