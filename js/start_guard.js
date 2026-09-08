let skyPuffRunStartedAt=0;
let skyPuffLastGameOverReason='none';
let skyPuffStartupRescues=0;

(function(){
  const originalStartGame=startGame;
  const originalEndGame=endGame;
  const originalUpdate=update;

  function markStart(){
    skyPuffRunStartedAt=performance.now();
    skyPuffLastGameOverReason='none';
    skyPuffStartupRescues=0;
  }

  /* IMPORTANT: when rescueStartup is called from endGame() during update(),
     the current animation frame is still alive and loop() will schedule the
     next frame itself. Starting another RAF here would create two concurrent
     game loops and make physics appear roughly 2x faster after a respawn. */
  function rescueStartup(reason='startup-fall',scheduleFrame=false){
    if(!player||skyPuffStartupRescues>=4)return false;
    skyPuffStartupRescues++;
    const startPlatform=platforms&&platforms[0];
    const platformY=startPlatform?startPlatform.y:H*.82;
    running=true;paused=false;
    player.x=W/2;
    player.y=platformY-player.r-2;
    player.vx=0;
    player.vy=-8.2;
    cameraY=0;
    invuln=120;
    pointerX=W/2;
    lastTime=performance.now();
    if(gameOverEl)gameOverEl.style.display='none';
    if(startEl)startEl.style.display='none';
    skyPuffLastGameOverReason=String(reason);
    console.warn('Sky Puff startup rescue',{reason,rescues:skyPuffStartupRescues,scheduleFrame});
    if(scheduleFrame)requestAnimationFrame(loop);
    return true;
  }

  startGame=function(){
    markStart();
    const result=originalStartGame();
    skyPuffRunStartedAt=performance.now();

    /* Clear an old stored runtime error only after the new run proves stable.
       If a fresh runtime error occurs, running becomes false and the new error stays visible. */
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

  /* Keep the first seconds calm when the player has not chosen a direction yet. */
  update=function(dt){
    const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
    const noHorizontalIntent=player&&Math.abs((pointerX||W/2)-player.x)<14;
    if(elapsed<3200&&score<=2&&player&&noHorizontalIntent&&player.vy<-8.2){
      player.vy=-8.2;
    }
    return originalUpdate(dt);
  };

  endGame=function(reason='unknown'){
    const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
    skyPuffLastGameOverReason=String(reason||'unknown');
    const startup=elapsed<7000&&score<=5&&player&&player.hp>0;
    /* Do NOT schedule another RAF here. loop() is already executing and will
       continue naturally because rescueStartup restores running=true. */
    if(startup&&rescueStartup(reason||'endGame',false))return;
    return originalEndGame();
  };

  /* This observer is a last-resort path that may run after another code path
     has stopped the frame loop, so it is the only rescue allowed to schedule
     a fresh animation frame. */
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
    get status(){return{active:true,runStartedAt:skyPuffRunStartedAt,lastGameOverReason:skyPuffLastGameOverReason,startupRescues:skyPuffStartupRescues}}
  };
})();