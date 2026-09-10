/* Sky Puff — Multiplayer -> Race My Puffling bridge v1.0
 * Compatibility filename retained for the current beta loader.
 */
(function(){
  const baseStart=typeof startMultiplayerRace==='function'?startMultiplayerRace:null;
  const baseTick=typeof multiplayerTick==='function'?multiplayerTick:null;
  const baseFinish=typeof finishMultiplayerRace==='function'?finishMultiplayerRace:null;
  if(!baseStart||!baseTick||!baseFinish)return;

  function currentPufflingId(){
    try{
      const F=window.SkyPuffFusion,st=F?.load?.();
      return st?.active||st?.selected||st?.equipped||Object.keys(st?.owned||{})[0]||null;
    }catch(e){return null;}
  }

  startMultiplayerRace=function(type){
    baseStart(type);
    if(!multiplayerMode)return;
    multiplayerRaceSeconds=9999;
    multiplayerEndAt=Date.now()+multiplayerRaceSeconds*1000;
    const R=window.SkyPuffRace;
    R?.start?.({selectedPufflingId:currentPufflingId()});
    window.SkyPuffRaceUI?.show?.();
    if(mpTimerEl)mpTimerEl.textContent='1500m';
    if(multiplayerStatusEl)multiplayerStatusEl.textContent='Race My Puffling — first to 1500m wins.';
    if(typeof showToast==='function')showToast('🏁 RACE MY PUFFLING — FIRST TO 1500m!');
  };

  multiplayerTick=function(){
    if(!multiplayerMode||multiplayerState!=='racing')return;
    const R=window.SkyPuffRace,s=R?.snapshot?.();
    if(!R||!s)return baseTick();

    // Lightweight test ghost until the backend replaces this with real opponent packets.
    const difficulty=.78+Math.random()*.18;
    let ghostGain=(8+Math.random()*18)*difficulty;
    const now=Date.now();
    const active=R.tickEffects?.(now)||[];
    // Local attacks affect the simulated rival only. Real online mode must validate this server-side.
    const recentLocalAttack=s.lastAttackAt&&now-s.lastAttackAt<550;
    if(recentLocalAttack){
      const a=s.ability||{};
      const slow=Math.max(.45,1-(a.strength||.2));
      ghostGain*=slow;
    }
    multiplayerOpponentScore=Math.max(multiplayerOpponentScore,multiplayerOpponentScore+ghostGain);
    const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);
    if(mpYouEl)mpYouEl.textContent=you+'m';
    if(mpRivalEl)mpRivalEl.textContent=rival+'m';
    if(mpTimerEl)mpTimerEl.textContent='🏁1500m';
    const next=R.updateHeights?.(you,rival);
    window.SkyPuffRaceUI?.render?.();
    if(next&&!next.active)finishMultiplayerRace();
  };

  finishMultiplayerRace=function(){
    if(!multiplayerMode)return;
    const R=window.SkyPuffRace;
    let s=R?.snapshot?.();
    const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);
    if(!s)R?.start?.({selectedPufflingId:currentPufflingId()});
    s=R?.updateHeights?.(you,rival)||R?.snapshot?.();
    if(s?.active){
      const winner=you>=1500&&rival<1500?'you':rival>=1500&&you<1500?'rival':you>=rival?'you':'rival';
      s=R?.finish?.(winner)||s;
    }
    multiplayerMode=false;multiplayerState='finished';running=false;
    if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}
    if(multiplayerHudEl)multiplayerHudEl.style.display='none';
    window.SkyPuffRaceUI?.showResult?.(s);
  };

  window.addEventListener('race:attack',function(ev){
    if(!multiplayerMode||multiplayerState!=='racing')return;
    const a=ev.detail?.ability;if(!a)return;
    // Test ghost reacts immediately. Backend version should send an attack event instead.
    const penalty=Math.max(4,Math.round(24*(a.strength||.25)));
    multiplayerOpponentScore=Math.max(0,multiplayerOpponentScore-penalty);
  });
})();