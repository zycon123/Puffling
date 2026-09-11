/* Puffling — Multiplayer -> Race My Puffling bridge v1.6
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
  let reconnectDisplayTimer=null;
  let serverStartAt=0;
  let reconnecting=false;
  let opponentReconnectDeadline=0;

  function currentPufflingId(){
    try{
      const F=window.SkyPuffFusion,st=F?.load?.();
      return st?.active||st?.selected||st?.equipped||Object.keys(st?.owned||{})[0]||null;
    }catch(e){return null;}
  }
  function currentSkinId(){
    try{return typeof save!=='undefined'&&save?.skin?String(save.skin):null;}catch(e){return null;}
  }
  function currentEvolutionStage(id=currentPufflingId()){
    try{return Math.max(0,Math.min(2,Number(window.SkyPuffPufflingEvolution?.stageFor?.(id))||0));}catch(e){return 0;}
  }
  function currentPlayerId(){
    try{
      let id=localStorage.getItem('skyPuffRacePlayerId');
      if(!id){id='p_'+Math.random().toString(36).slice(2,10);localStorage.setItem('skyPuffRacePlayerId',id);}
      return id;
    }catch(e){return 'p_'+Math.random().toString(36).slice(2,10);}
  }
  function roomFor(type){return multiplayerRoom||(type==='random'?'quickmatch':'room_'+Math.random().toString(36).slice(2,8));}
  function visualProfile(){
    const id=currentPufflingId();
    return {pufflingId:id,skin:currentSkinId(),evolutionStage:currentEvolutionStage(id)};
  }
  function ensureCountdown(){
    let el=document.getElementById('raceCountdownOverlay');
    if(el)return el;
    el=document.createElement('div');el.id='raceCountdownOverlay';
    el.style.cssText='display:none;position:fixed;inset:0;z-index:40;pointer-events:none;align-items:center;justify-content:center;background:rgba(21,58,103,.18);backdrop-filter:blur(1px)';
    el.innerHTML='<div id="raceCountdownText" style="font-size:clamp(48px,15vw,108px);font-weight:1000;color:white;text-align:center;white-space:pre-line;text-shadow:0 7px 28px rgba(0,0,0,.38);transform:scale(1)">3</div>';
    document.body.appendChild(el);return el;
  }
  function clearOverlayTimers(){
    if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}
    if(reconnectDisplayTimer){clearInterval(reconnectDisplayTimer);reconnectDisplayTimer=null;}
  }
  function hideCountdown(){clearOverlayTimers();const el=document.getElementById('raceCountdownOverlay');if(el)el.style.display='none';}
  function setCountdownText(text){const el=ensureCountdown(),txt=document.getElementById('raceCountdownText');el.style.display='flex';if(txt)txt.textContent=text;}
  function unlockOnlineRace(){
    if(!multiplayerMode)return;
    awaitingServerStart=false;reconnecting=false;opponentReconnectDeadline=0;multiplayerState='racing';running=true;paused=false;lastTime=performance.now();
    setCountdownText('GO!');if(typeof showToast==='function')showToast('🏁 GO!');setTimeout(hideCountdown,650);requestAnimationFrame(loop);
  }
  function scheduleServerCountdown(startAt){
    clearOverlayTimers();serverStartAt=Number(startAt)||Date.now();awaitingServerStart=true;running=false;paused=false;multiplayerState='countdown';
    const render=()=>{const left=serverStartAt-Date.now();if(left<=0){if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}unlockOnlineRace();return;}const n=Math.max(1,Math.ceil(left/1000));setCountdownText(String(Math.min(3,n)));};
    render();countdownTimer=setInterval(render,50);
  }
  function showReconnectWait(deadline,ownConnection=false){
    clearOverlayTimers();reconnecting=true;awaitingServerStart=true;running=false;paused=false;multiplayerState='reconnecting';
    const until=Number(deadline)||Date.now()+11000;
    const render=()=>{const sec=Math.max(0,Math.ceil((until-Date.now())/1000));setCountdownText(ownConnection?`↻\n${sec}s`:`⏳\n${sec}s`);};
    render();reconnectDisplayTimer=setInterval(render,100);
    if(multiplayerStatusEl)multiplayerStatusEl.textContent=ownConnection?'Tilkoblingen falt ut — prøver å koble til igjen…':'Motstanderen mistet forbindelsen — racet er midlertidig satt på pause.';
  }
  function failOnlineStart(reason='connection_failed'){
    hideCountdown();awaitingServerStart=false;reconnecting=false;onlineMode=false;onlineOpponent=null;serverResult=null;
    multiplayerMode=false;multiplayerState='connection_failed';running=false;paused=false;
    if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}
    if(multiplayerHudEl)multiplayerHudEl.style.display='none';
    try{window.SkyPuffRaceTransport?.disconnect?.();}catch(e){}
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
    const msg=reason==='race_auth_failed'||reason==='race_auth_required'||reason==='rank_auth_required'?'Kunne ikke bekrefte spillerkontoen. Prøv igjen.':'Kunne ikke koble til Race-serveren. Prøv igjen når forbindelsen er tilbake.';
    if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=msg;
    if(typeof showToast==='function')showToast('⚠️ '+msg);
    window.dispatchEvent?.(new CustomEvent('race:connectionFailed',{detail:{reason}}));
  }
  function opponentSnapshot(p,state='idle'){
    return {x:Number(p?.x)||0,y:p?.y==null?null:Number(p.y),worldY:p?.worldY==null?null:Number(p.worldY),height:Math.max(0,Number(p?.height)||0),state,pufflingId:p?.pufflingId||null,skin:p?.skin||null,evolutionStage:Math.max(0,Math.min(2,Number(p?.evolutionStage)||0)),t:Number(p?.t)||Date.now()};
  }
  function applyOpponentFromPlayers(players){
    const mine=window.SkyPuffRaceTransport?.snapshot?.().playerId;
    const p=Array.isArray(players)?players.find(x=>x&&x.playerId!==mine):null;if(!p)return;
    onlineOpponent=opponentSnapshot(p,'idle');multiplayerOpponentScore=onlineOpponent.height;window.dispatchEvent(new CustomEvent('race:ghost',{detail:onlineOpponent}));
  }
  function loseByDisconnect(){
    if(!multiplayerMode)return;
    hideCountdown();reconnecting=false;awaitingServerStart=false;
    const R=window.SkyPuffRace,T=window.SkyPuffRaceTransport;let s=R?.snapshot?.()||{};s.active=false;s.finishedAt=Date.now();s.winner='rival';s.disconnectLoss=true;
    multiplayerMode=false;multiplayerState='finished';running=false;paused=false;if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';
    T?.disconnect?.();onlineMode=false;onlineOpponent=null;if(typeof showToast==='function')showToast('Forbindelsen kom ikke tilbake i tide.');window.SkyPuffRaceUI?.showResult?.(s);
  }
  function bindTransport(){
    if(transportBound)return;transportBound=true;const T=window.SkyPuffRaceTransport;if(!T)return;
    T.on('state',m=>{
      if(m?.state==='online'||m?.state==='bot'){onlineMode=true;reconnecting=false;return;}
      if(m?.state==='reconnecting'){onlineMode=false;if(multiplayerMode)showReconnectWait(m.reconnectDeadline,true);return;}
      if(m?.state==='reconnect_failed'){onlineMode=false;if(multiplayerMode)loseByDisconnect();return;}
      if(['connect_failed','server_rejected','race_auth_failed'].includes(m?.state)&&multiplayerMode)failOnlineStart(m?.code||m?.state);
    });
    T.on('race:matched',m=>{if(m?.room)multiplayerRoom=m.room;reconnecting=false;if(typeof showToast==='function')showToast(m?.mode==='quick'?'🔎 Motstander funnet!':'👥 Race room ready');if(multiplayerStatusEl)multiplayerStatusEl.textContent='Begge spillere må være klare før nedtellingen starter.';});
    T.on('race:start',m=>{onlineMode=true;scheduleServerCountdown(m?.serverStartAt);});
    T.on('race:notStarted',m=>{if(m?.serverStartAt)scheduleServerCountdown(m.serverStartAt);});
    T.on('race:paused',()=>{if(multiplayerMode&&!reconnecting)showReconnectWait(opponentReconnectDeadline||Date.now()+11000,false);});
    T.on('race:resumed',m=>{if(m?.room)multiplayerRoom=m.room;applyOpponentFromPlayers(m?.players);reconnecting=true;onlineMode=true;if(multiplayerStatusEl)multiplayerStatusEl.textContent='Tilkoblet igjen — synkroniserer racet…';if(m?.winnerId){serverResult={...m,finishedAt:Date.now()};finishMultiplayerRace();}});
    T.on('race:resume',m=>{reconnecting=false;opponentReconnectDeadline=0;onlineMode=true;applyOpponentFromPlayers(m?.players);if(multiplayerStatusEl)multiplayerStatusEl.textContent='Begge er tilbake — fortsetter racet…';scheduleServerCountdown(m?.serverResumeAt||Date.now()+1000);});
    T.on('race:opponentDisconnected',m=>{if(!multiplayerMode)return;opponentReconnectDeadline=Number(m?.reconnectDeadline)||Date.now()+12000;showReconnectWait(opponentReconnectDeadline,false);if(typeof showToast==='function')showToast('Motstanderen mistet nettet — racet er pauset.');});
    T.on('race:opponentReconnected',()=>{if(typeof showToast==='function')showToast('Motstanderen er tilbake!');if(multiplayerStatusEl)multiplayerStatusEl.textContent='Motstanderen er tilbake — synkroniserer…';});
    T.on('race:position',m=>{
      if(!m||m.playerId===T.snapshot().playerId)return;
      onlineOpponent=opponentSnapshot(m,m.state||'jumping');multiplayerOpponentScore=Math.max(0,onlineOpponent.height);window.dispatchEvent(new CustomEvent('race:ghost',{detail:onlineOpponent}));
    });
    T.on('race:attack',m=>{if(!m||m.playerId===T.snapshot().playerId)return;window.SkyPuffRace?.receiveAttack?.(m.ability||m.abilityId,m);window.dispatchEvent(new CustomEvent('race:incomingAttack',{detail:m}));});
    T.on('race:attackRejected',m=>{if(typeof showToast==='function')showToast(m?.reason==='cooldown'?'⏳ Attack on cooldown':'⚠️ Attack rejected');});
    T.on('race:error',m=>{if(reconnecting&&(m?.code==='resume_expired'||m?.code==='room_full'))loseByDisconnect();else if(multiplayerMode&&['race_auth_required','rank_auth_required','unsupported_protocol','race_inventory_unavailable','puffling_not_owned'].includes(m?.code))failOnlineStart(m.code);});
    T.on('race:result',m=>{if(!m?.winnerId)return;serverResult=m;if(multiplayerMode)finishMultiplayerRace();});
    T.on('race:opponentLeft',()=>{if(multiplayerMode&&typeof showToast==='function')showToast('Motstanderen forlot racet.');});
  }
  function connectTransport(type){
    bindTransport();const T=window.SkyPuffRaceTransport;if(!T){failOnlineStart('transport_missing');return;}
    T.connect({room:roomFor(type),playerId:currentPlayerId()}).then(info=>{
      onlineMode=info?.mode==='online';
      if(!onlineMode){failOnlineStart(info?.error||info?.mode||'connection_failed');return;}
      awaitingServerStart=true;multiplayerState='waiting_start';running=false;T.sendReady({...visualProfile(),mode:type});
      if(typeof showToast==='function')showToast('🌐 Live Race connection ready');if(multiplayerStatusEl)multiplayerStatusEl.textContent='Venter på motstander…';setCountdownText('…');
    }).catch(e=>failOnlineStart(String(e?.message||e||'connection_failed')));
  }

  startMultiplayerRace=function(type){
    baseStart(type);if(!multiplayerMode)return;multiplayerRaceSeconds=9999;multiplayerEndAt=Date.now()+multiplayerRaceSeconds*1000;
    onlineOpponent=null;onlineMode=false;lastLocalHeight=0;serverResult=null;awaitingServerStart=true;serverStartAt=0;reconnecting=false;opponentReconnectDeadline=0;
    const R=window.SkyPuffRace;R?.start?.({selectedPufflingId:currentPufflingId()});window.SkyPuffRaceUI?.show?.();running=false;multiplayerState='connecting';connectTransport(type);
    if(mpTimerEl)mpTimerEl.textContent='1500m';if(multiplayerStatusEl)multiplayerStatusEl.textContent='Kobler til Race My Puffling…';if(typeof showToast==='function')showToast('🏁 RACE MY PUFFLING — FIRST TO 1500m!');
  };

  multiplayerTick=function(){
    if(!multiplayerMode||multiplayerState!=='racing'||awaitingServerStart||reconnecting)return;
    const R=window.SkyPuffRace,s=R?.snapshot?.();if(!R||!s)return baseTick();
    const you=Math.floor(score),T=window.SkyPuffRaceTransport;
    const px=typeof player!=='undefined'&&player?Number(player.x)||0:0;
    const py=typeof player!=='undefined'&&player?Number(player.y)||0:0;
    const worldY=typeof cameraY==='number'?py+cameraY:null;
    const pstate=typeof player!=='undefined'&&player?(player.vy<0?'jumping':player.vy>0?'falling':'idle'):'jumping';
    T?.sendPosition?.({x:px,y:py,worldY,height:you,state:pstate,...visualProfile()});

    if(onlineOpponent)multiplayerOpponentScore=Math.max(0,Number(onlineOpponent.height)||0);

    const rival=Math.floor(multiplayerOpponentScore);
    if(mpYouEl)mpYouEl.textContent=you+'m';if(mpRivalEl)mpRivalEl.textContent=rival+'m';if(mpTimerEl)mpTimerEl.textContent='🏁1500m';
    const next=R.updateHeights?.(you,rival);window.SkyPuffRaceUI?.render?.();
    if(you>=1500&&lastLocalHeight<1500)T?.sendFinish?.({height:you,...visualProfile()});lastLocalHeight=you;
    if(next&&!next.active){if(onlineMode&&!serverResult){if(typeof showToast==='function')showToast('🏁 Venter på serverresultat…');return;}finishMultiplayerRace();}
  };

  finishMultiplayerRace=function(){
    if(!multiplayerMode)return;const R=window.SkyPuffRace,T=window.SkyPuffRaceTransport;if((onlineMode||reconnecting)&&!serverResult)return;
    hideCountdown();awaitingServerStart=false;reconnecting=false;opponentReconnectDeadline=0;
    let s=R?.snapshot?.();const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);if(!s)R?.start?.({selectedPufflingId:currentPufflingId()});s=R?.updateHeights?.(you,rival)||R?.snapshot?.();
    if(serverResult){const mine=T?.snapshot?.().playerId;s=s||{};s.active=false;s.finishedAt=Number(serverResult.finishedAt)||Date.now();s.winner=serverResult.winnerId===mine?'you':'rival';s.finishReason=serverResult.reason||'finish';}
    else if(s?.active){const winner=you>=1500&&rival<1500?'you':rival>=1500&&you<1500?'rival':you>=rival?'you':'rival';s=R?.finish?.(winner)||s;}
    multiplayerMode=false;multiplayerState='finished';running=false;if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';T?.disconnect?.();onlineMode=false;onlineOpponent=null;window.SkyPuffRaceUI?.showResult?.(s);
  };

  window.addEventListener('race:attack',function(ev){
    if(!multiplayerMode||multiplayerState!=='racing'||awaitingServerStart||reconnecting)return;
    const a=ev.detail?.ability;if(!a)return;const T=window.SkyPuffRaceTransport;
    if(onlineMode)T?.sendAttack?.({ability:a,abilityId:a.id||a.abilityType||a.name});
  });

  window.SkyPuffRaceNetwork={
    isOnline:()=>onlineMode,
    isReconnecting:()=>reconnecting,
    opponent:()=>onlineOpponent?{...onlineOpponent}:null,
    serverResult:()=>serverResult?{...serverResult}:null,
    awaitingStart:()=>awaitingServerStart,
    serverStartAt:()=>serverStartAt,
    opponentReconnectDeadline:()=>opponentReconnectDeadline,
    transport:()=>window.SkyPuffRaceTransport?.snapshot?.()||null
  };
})();
