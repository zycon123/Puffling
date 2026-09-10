/* Sky Puff — Multiplayer -> Race My Puffling bridge v1.3
 * Compatibility filename retained for the current beta loader.
 */
(function(){
  const baseStart=typeof startMultiplayerRace==='function'?startMultiplayerRace:null;
  const baseTick=typeof multiplayerTick==='function'?multiplayerTick:null;
  const baseFinish=typeof finishMultiplayerRace==='function'?finishMultiplayerRace:null;
  if(!baseStart||!baseTick||!baseFinish)return;

  let onlineOpponent=null;
  let onlineMode=false;
  let transportBound=false;
  let lastLocalHeight=0;
  let serverResult=null;
  let awaitingServerStart=false;
  let countdownTimer=null;
  let serverStartAt=0;

  function currentPufflingId(){
    try{
      const F=window.SkyPuffFusion,st=F?.load?.();
      return st?.active||st?.selected||st?.equipped||Object.keys(st?.owned||{})[0]||null;
    }catch(e){return null;}
  }
  function currentPlayerId(){
    try{
      let id=localStorage.getItem('skyPuffRacePlayerId');
      if(!id){id='p_'+Math.random().toString(36).slice(2,10);localStorage.setItem('skyPuffRacePlayerId',id);}
      return id;
    }catch(e){return 'p_'+Math.random().toString(36).slice(2,10);}
  }
  function roomFor(type){return multiplayerRoom||(type==='random'?'quickmatch':'room_'+Math.random().toString(36).slice(2,8));}
  function ensureCountdown(){
    let el=document.getElementById('raceCountdownOverlay');
    if(el)return el;
    el=document.createElement('div');el.id='raceCountdownOverlay';
    el.style.cssText='display:none;position:fixed;inset:0;z-index:40;pointer-events:none;align-items:center;justify-content:center;background:rgba(21,58,103,.18);backdrop-filter:blur(1px)';
    el.innerHTML='<div id="raceCountdownText" style="font-size:clamp(58px,18vw,118px);font-weight:1000;color:white;text-shadow:0 7px 28px rgba(0,0,0,.38);transform:scale(1)">3</div>';
    document.body.appendChild(el);return el;
  }
  function hideCountdown(){
    if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}
    const el=document.getElementById('raceCountdownOverlay');if(el)el.style.display='none';
  }
  function setCountdownText(text){
    const el=ensureCountdown(),txt=document.getElementById('raceCountdownText');
    el.style.display='flex';if(txt)txt.textContent=text;
  }
  function unlockOnlineRace(){
    if(!multiplayerMode)return;
    awaitingServerStart=false;multiplayerState='racing';running=true;paused=false;lastTime=performance.now();
    setCountdownText('GO!');
    if(typeof showToast==='function')showToast('🏁 GO!');
    setTimeout(hideCountdown,650);
    requestAnimationFrame(loop);
  }
  function scheduleServerCountdown(startAt){
    serverStartAt=Number(startAt)||Date.now();awaitingServerStart=true;running=false;paused=false;multiplayerState='countdown';
    if(countdownTimer)clearInterval(countdownTimer);
    const render=()=>{
      const left=serverStartAt-Date.now();
      if(left<=0){if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}unlockOnlineRace();return;}
      const n=Math.max(1,Math.ceil(left/1000));setCountdownText(String(Math.min(3,n)));
    };
    render();countdownTimer=setInterval(render,50);
  }
  function startLocalFallback(){
    awaitingServerStart=false;multiplayerState='racing';running=true;paused=false;lastTime=performance.now();
    hideCountdown();requestAnimationFrame(loop);
  }
  function bindTransport(){
    if(transportBound)return;transportBound=true;
    const T=window.SkyPuffRaceTransport;if(!T)return;
    T.on('state',m=>{onlineMode=m?.state==='online';});
    T.on('race:matched',m=>{
      if(m?.room) multiplayerRoom=m.room;
      if(typeof showToast==='function')showToast(m?.mode==='quick'?'🔎 Motstander funnet!':'👥 Race room ready');
      if(multiplayerStatusEl)multiplayerStatusEl.textContent='Begge spillere må være klare før nedtellingen starter.';
    });
    T.on('race:start',m=>{
      scheduleServerCountdown(m?.serverStartAt);
    });
    T.on('race:notStarted',m=>{
      if(m?.serverStartAt) scheduleServerCountdown(m.serverStartAt);
    });
    T.on('race:position',m=>{
      if(!m||m.playerId===T.snapshot().playerId)return;
      onlineOpponent={x:Number(m.x)||0,height:Math.max(0,Number(m.height)||0),state:m.state||'jumping',pufflingId:m.pufflingId||null,skin:m.skin||null,t:Number(m.t)||Date.now()};
      multiplayerOpponentScore=Math.max(0,onlineOpponent.height);
      window.dispatchEvent(new CustomEvent('race:ghost',{detail:onlineOpponent}));
    });
    T.on('race:attack',m=>{
      if(!m||m.playerId===T.snapshot().playerId)return;
      window.SkyPuffRace?.receiveAttack?.(m.ability||m.abilityId,m);
      window.dispatchEvent(new CustomEvent('race:incomingAttack',{detail:m}));
    });
    T.on('race:attackRejected',m=>{
      if(typeof showToast==='function')showToast(m?.reason==='cooldown'?'⏳ Attack on cooldown':'⚠️ Attack rejected');
    });
    T.on('race:result',m=>{
      if(!m?.winnerId)return;
      serverResult=m;
      if(multiplayerMode) finishMultiplayerRace();
    });
    T.on('race:opponentLeft',()=>{
      if(multiplayerMode&&typeof showToast==='function')showToast('Motstanderen koblet fra.');
    });
  }
  function connectTransport(type){
    bindTransport();
    const T=window.SkyPuffRaceTransport;if(!T){startLocalFallback();return;}
    T.connect({room:roomFor(type),playerId:currentPlayerId()}).then(info=>{
      onlineMode=info?.mode==='online';
      if(!onlineMode){startLocalFallback();return;}
      awaitingServerStart=true;multiplayerState='waiting_start';running=false;
      T.sendReady({pufflingId:currentPufflingId(),mode:type});
      if(typeof showToast==='function')showToast('🌐 Live Race connection ready');
      if(multiplayerStatusEl)multiplayerStatusEl.textContent='Venter på motstander…';
      setCountdownText('…');
    });
  }

  startMultiplayerRace=function(type){
    baseStart(type);
    if(!multiplayerMode)return;
    multiplayerRaceSeconds=9999;
    multiplayerEndAt=Date.now()+multiplayerRaceSeconds*1000;
    onlineOpponent=null;onlineMode=false;lastLocalHeight=0;serverResult=null;awaitingServerStart=true;serverStartAt=0;
    const R=window.SkyPuffRace;
    R?.start?.({selectedPufflingId:currentPufflingId()});
    window.SkyPuffRaceUI?.show?.();
    running=false;multiplayerState='connecting';
    connectTransport(type);
    if(mpTimerEl)mpTimerEl.textContent='1500m';
    if(multiplayerStatusEl)multiplayerStatusEl.textContent='Kobler til Race My Puffling…';
    if(typeof showToast==='function')showToast('🏁 RACE MY PUFFLING — FIRST TO 1500m!');
  };

  multiplayerTick=function(){
    if(!multiplayerMode||multiplayerState!=='racing'||awaitingServerStart)return;
    const R=window.SkyPuffRace,s=R?.snapshot?.();
    if(!R||!s)return baseTick();

    const you=Math.floor(score);
    const T=window.SkyPuffRaceTransport;
    const px=typeof player!=='undefined'&&player?Number(player.x)||0:0;
    const pstate=typeof player!=='undefined'&&player?(player.vy<0?'jumping':player.vy>0?'falling':'idle'):'jumping';
    T?.sendPosition?.({x:px,height:you,state:pstate,pufflingId:currentPufflingId()});

    if(onlineMode&&onlineOpponent){
      multiplayerOpponentScore=Math.max(0,Number(onlineOpponent.height)||0);
    }else if(!onlineMode){
      const difficulty=.78+Math.random()*.18;
      let ghostGain=(8+Math.random()*18)*difficulty;
      const now=Date.now();
      R.tickEffects?.(now);
      const recentLocalAttack=s.lastAttackAt&&now-s.lastAttackAt<550;
      if(recentLocalAttack){const a=s.ability||{};ghostGain*=Math.max(.45,1-(a.strength||.2));}
      multiplayerOpponentScore=Math.max(multiplayerOpponentScore,multiplayerOpponentScore+ghostGain);
    }

    const rival=Math.floor(multiplayerOpponentScore);
    if(mpYouEl)mpYouEl.textContent=you+'m';
    if(mpRivalEl)mpRivalEl.textContent=rival+'m';
    if(mpTimerEl)mpTimerEl.textContent='🏁1500m';
    const next=R.updateHeights?.(you,rival);
    window.SkyPuffRaceUI?.render?.();

    if(you>=1500&&lastLocalHeight<1500)T?.sendFinish?.({height:you,pufflingId:currentPufflingId()});
    lastLocalHeight=you;
    if(next&&!next.active){
      if(onlineMode&&!serverResult){if(typeof showToast==='function')showToast('🏁 Venter på serverresultat…');return;}
      finishMultiplayerRace();
    }
  };

  finishMultiplayerRace=function(){
    if(!multiplayerMode)return;
    const R=window.SkyPuffRace,T=window.SkyPuffRaceTransport;
    if(onlineMode&&!serverResult)return;
    hideCountdown();awaitingServerStart=false;
    let s=R?.snapshot?.();
    const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);
    if(!s)R?.start?.({selectedPufflingId:currentPufflingId()});
    s=R?.updateHeights?.(you,rival)||R?.snapshot?.();
    if(serverResult){
      const mine=T?.snapshot?.().playerId;
      s=s||{};s.active=false;s.finishedAt=Number(serverResult.finishedAt)||Date.now();s.winner=serverResult.winnerId===mine?'you':'rival';
    }else if(s?.active){
      const winner=you>=1500&&rival<1500?'you':rival>=1500&&you<1500?'rival':you>=rival?'you':'rival';
      s=R?.finish?.(winner)||s;
    }
    multiplayerMode=false;multiplayerState='finished';running=false;
    if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}
    if(multiplayerHudEl)multiplayerHudEl.style.display='none';
    T?.disconnect?.();onlineMode=false;onlineOpponent=null;
    window.SkyPuffRaceUI?.showResult?.(s);
  };

  window.addEventListener('race:attack',function(ev){
    if(!multiplayerMode||multiplayerState!=='racing'||awaitingServerStart)return;
    const a=ev.detail?.ability;if(!a)return;
    const T=window.SkyPuffRaceTransport;
    if(onlineMode){T?.sendAttack?.({ability:a,abilityId:a.id||a.abilityType||a.name});return;}
    const penalty=Math.max(4,Math.round(24*(a.strength||.25)));
    multiplayerOpponentScore=Math.max(0,multiplayerOpponentScore-penalty);
  });

  window.SkyPuffRaceNetwork={
    isOnline:()=>onlineMode,
    opponent:()=>onlineOpponent?{...onlineOpponent}:null,
    serverResult:()=>serverResult?{...serverResult}:null,
    awaitingStart:()=>awaitingServerStart,
    serverStartAt:()=>serverStartAt,
    transport:()=>window.SkyPuffRaceTransport?.snapshot?.()||null
  };
})();