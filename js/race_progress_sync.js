/* Puffling — shared live Race progress source v1.0 */
(function(){
  function finite(v){const n=Number(v);return Number.isFinite(n)?n:null;}
  function liveProgress(){
    const snap=window.SkyPuffRace?.snapshot?.()||{};
    let you=finite(snap.youHeight)||0,rival=finite(snap.rivalHeight)||0;
    try{const n=finite(score);if(n!==null)you=Math.max(0,n);}catch(e){}
    try{
      const opponent=window.SkyPuffRaceNetwork?.opponent?.();
      const online=finite(opponent?.height);
      if(online!==null)rival=Math.max(0,online);
      else{
        const local=finite(multiplayerOpponentScore);
        if(local!==null)rival=Math.max(0,local);
      }
    }catch(e){
      try{const g=finite(window.SkyPuffRaceGhost?.status?.().last?.height);if(g!==null)rival=Math.max(0,g);}catch(_){}
    }
    return {
      you,rival,goal:Math.max(1,finite(snap.goal)||1500),
      online:!!window.SkyPuffRaceNetwork?.isOnline?.(),
      reconnecting:!!window.SkyPuffRaceNetwork?.isReconnecting?.(),
      opponentUpdatedAt:finite(window.SkyPuffRaceNetwork?.opponent?.()?.t)||0
    };
  }
  function publish(){
    const detail=liveProgress();
    try{window.dispatchEvent(new CustomEvent('race:progress',{detail}));}catch(e){}
    return detail;
  }
  function hideLegacy(){
    const legacy=document.getElementById('multiplayerHud');
    const race=document.getElementById('raceMyPufflingHud');
    if(legacy&&race&&race.style.display!=='none')legacy.style.display='none';
  }
  const install=()=>{
    const N=window.SkyPuffRaceNetwork;
    if(N)N.liveProgress=liveProgress;
    window.SkyPuffRaceProgress={liveProgress,publish,hideLegacy};
    hideLegacy();
  };
  window.addEventListener('race:ghost',()=>{install();publish();hideLegacy();});
  window.addEventListener('race:start',()=>{install();publish();setTimeout(hideLegacy,0);});
  window.addEventListener('race:reset',hideLegacy);
  install();
})();
