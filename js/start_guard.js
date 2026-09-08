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

  function rescueStartup(reason='startup-fall'){
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
    console.warn('Sky Puff startup rescue',{reason,rescues:skyPuffStartupRescues});
    requestAnimationFrame(loop);
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

  /* Keep the first seconds calm when the player has not chosen a direction yet.
     This prevents repeated full-strength bounces on the start platform from feeling 2x faster. */
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
    if(startup&&rescueStartup(reason||'endGame'))return;
    return originalEndGame();
  };

  if(gameOverEl&&window.MutationObserver){
    new MutationObserver(()=>{
      const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
      const visible=getComputedStyle(gameOverEl).display!=='none';
      if(visible&&elapsed<7000&&score<=5&&player&&player.hp>0){
        rescueStartup('game-over-overlay');
      }
    }).observe(gameOverEl,{attributes:true,attributeFilter:['style','class']});
  }

  window.skyPuffStartGuard={
    get status(){return{active:true,runStartedAt:skyPuffRunStartedAt,lastGameOverReason:skyPuffLastGameOverReason,startupRescues:skyPuffStartupRescues}}
  };
})();