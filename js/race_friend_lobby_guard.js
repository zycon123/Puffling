/* Sky Puff — Race My Puffling friend-lobby guard v0.1 */
(function(){
 function el(id){return document.getElementById(id);}
 function panelVisible(){const p=el('raceFriendLobbyPanel');return !!(p&&p.style.display!=='none');}
 function waitingFriend(){
  try{return !!multiplayerMode&&panelVisible()&&['waiting','connecting','waiting_start','connecting'].includes(String(multiplayerState||''));}catch(e){return false;}
 }
 function clearRaceWait(){
  try{window.SkyPuffRaceTransport?.disconnect?.();}catch(e){}
  try{window.SkyPuffRaceUI?.hide?.();}catch(e){}
  try{window.SkyPuffRaceGhost?.reset?.();}catch(e){}
  try{multiplayerMode=false;multiplayerState='idle';running=false;paused=false;}catch(e){}
  try{if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}}catch(e){}
  const hud=el('multiplayerHud');if(hud)hud.style.display='none';
  const menu=el('multiplayerMenu');if(menu)menu.style.display='none';
  const panel=el('raceFriendLobbyPanel');if(panel)panel.style.display='none';
  try{if(typeof showMainMenu==='function')showMainMenu();else if(typeof startEl!=='undefined'&&startEl)startEl.style.display='flex';}catch(e){}
 }
 function bindClose(){
  const close=el('closeMultiplayer');if(!close||close.__raceLobbyGuard)return;
  const previous=close.onclick;
  close.onclick=function(ev){
   if(waitingFriend()){ev?.preventDefault?.();clearRaceWait();return;}
   if(typeof previous==='function')return previous.call(this,ev);
  };
  close.__raceLobbyGuard=true;
 }
 function bindTransport(){
  const T=window.SkyPuffRaceTransport;if(!T||T.__friendLobbyGuard)return;
  T.__friendLobbyGuard=true;
  T.on('state',m=>{
   if(m?.state!=='local')return;
   setTimeout(()=>{
    try{
     if(!multiplayerMode||T.snapshot?.().state!=='local')return;
     const menu=el('multiplayerMenu'),panel=el('raceFriendLobbyPanel'),hud=el('multiplayerHud');
     if(menu)menu.style.display='none';if(panel)panel.style.display='none';if(hud)hud.style.display='block';
     if(typeof showToast==='function')showToast('Online-server ikke tilkoblet — starter test-ghost.');
    }catch(e){}
   },30);
  });
 }
 function ensure(){bindClose();bindTransport();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,150));else setTimeout(ensure,150);
 [450,1000,1800].forEach(ms=>setTimeout(ensure,ms));
 window.SkyPuffRaceFriendLobbyGuard={ensure,cancel:clearRaceWait};
})();