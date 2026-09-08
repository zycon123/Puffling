let skyPuffRunStartedAt=0;
let skyPuffLastGameOverReason='none';
let skyPuffStartupRescues=0;
let skyPuffSmoothUntil=0;

(function(){
  const originalStartGame=startGame;
  const originalEndGame=endGame;
  const originalUpdate=update;
  const START_BOUNCE_SPEED=-8.2;
  const SMOOTH_MS=3600;

  function beginSmoothWindow(){
    skyPuffSmoothUntil=performance.now()+SMOOTH_MS;
  }

  function markStart(){
    skyPuffRunStartedAt=performance.now();
    skyPuffLastGameOverReason='none';
    skyPuffStartupRescues=0;
    beginSmoothWindow();
  }

  function rescueStartup(reason='startup-fall',scheduleFrame=false){
    if(!player||skyPuffStartupRescues>=4)return false;
    skyPuffStartupRescues++;
    const startPlatform=platforms&&platforms[0];
    const platformY=startPlatform?startPlatform.y:H*.82;
    running=true;paused=false;
    player.x=W/2;
    player.y=platformY-player.r-2;
    player.vx=0;
    player.vy=START_BOUNCE_SPEED;
    cameraY=0;
    invuln=120;
    pointerX=W/2;
    lastTime=performance.now();
    beginSmoothWindow();
    if(gameOverEl)gameOverEl.style.display='none';
    if(startEl)startEl.style.display='none';
    skyPuffLastGameOverReason=String(reason);
    console.warn('Sky Puff startup rescue',{reason,rescues:skyPuffStartupRescues,scheduleFrame,smoothUntil:skyPuffSmoothUntil});
    if(scheduleFrame)requestAnimationFrame(loop);
    return true;
  }

  startGame=function(){
    markStart();
    const result=originalStartGame();
    skyPuffRunStartedAt=performance.now();
    beginSmoothWindow();
    setTimeout(()=>{
      if(running&&!paused){
        try{localStorage.removeItem('skyPuffLastError');}catch(_){}
        window.skyPuffRuntimeLastError=null;
        if(window.skyPuffBetaDiagnostics&&typeof window.skyPuffBetaDiagnostics.clearLastError==='function'){
          window.skyPuffBetaDiagnostics.clearLastError();
        }
      }
    },2500);
    return result;
  };

  if(playBtnEl)playBtnEl.onclick=startGame;
  if(retryBtnEl)retryBtnEl.onclick=startGame;

  /* Use the same calm vertical speed after both a fresh start and a startup respawn.
     The smoothing window is restarted on every rescue, so a respawn can never jump
     faster just because the original run had already been alive for a few seconds. */
  update=function(dt){
    const smoothing=performance.now()<skyPuffSmoothUntil;
    if(smoothing&&!bossArena&&player&&player.vy<START_BOUNCE_SPEED){
      player.vy=START_BOUNCE_SPEED;
    }
    return originalUpdate(dt);
  };

  endGame=function(reason='unknown'){
    const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
    skyPuffLastGameOverReason=String(reason||'unknown');
    const startup=elapsed<7000&&score<=5&&player&&player.hp>0;
    if(startup&&rescueStartup(reason||'endGame',false))return;
    return originalEndGame();
  };

  if(gameOverEl&&window.MutationObserver){
    new MutationObserver(()=>{
      const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
      const visible=getComputedStyle(gameOverEl).display!=='none';
      if(visible&&elapsed<7000&&score<=5&&player&&player.hp>0){
        rescueStartup('game-over-overlay',true);
      }
    }).observe(gameOverEl,{attributes:true,attributeFilter:['style','class']});
  }

  window.skyPuffStartGuard={
    get status(){return{active:true,runStartedAt:skyPuffRunStartedAt,lastGameOverReason:skyPuffLastGameOverReason,startupRescues:skyPuffStartupRescues,smoothUntil:skyPuffSmoothUntil}}
  };
})();