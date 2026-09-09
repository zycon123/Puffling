/* Sky Puff — Multiplayer -> Steal My Puff reward bridge v0.1 */
(function(){
  if(typeof window.finishMultiplayerRace!=='function')return;
  window.finishMultiplayerRace=function(){
    if(!multiplayerMode)return;
    const t=modeText();multiplayerMode=false;multiplayerState='finished';running=false;
    if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}
    if(multiplayerHudEl)multiplayerHudEl.style.display='none';
    const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);
    if(you>rival){
      showToast(`${t.won} ${you}m - ${rival}m 🏆`);
      setTimeout(()=>window.SkyPuffStealUI?.show?.(),300);
      return;
    }
    const msg=you<rival?`${t.rival} ${rival}m - ${you}m`:`${t.draw} ${you}m`;
    showToast(msg);setTimeout(()=>showMainMenu(),500);
  };
})();
