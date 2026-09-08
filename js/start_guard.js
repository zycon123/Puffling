let skyPuffRunStartedAt=0;
let skyPuffLastGameOverReason='none';
let skyPuffStartupRescues=0;

(function(){
  const originalStartGame=startGame;
  const originalEndGame=endGame;

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
    player.vy=-10.6;
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
    /* A second timestamp after reset/start prevents a slow mobile first frame
       from being mistaken for an old run. */
    skyPuffRunStartedAt=performance.now();
    return result;
  };

  if(playBtnEl)playBtnEl.onclick=startGame;
  if(retryBtnEl)retryBtnEl.onclick=startGame;

  endGame=function(reason='unknown'){
    const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
    skyPuffLastGameOverReason=String(reason||'unknown');
    const startup=elapsed<7000&&score<=5&&player&&player.hp>0;
    if(startup&&rescueStartup(reason||'endGame'))return;
    return originalEndGame();
  };

  /* Last-resort mobile guard: if another code path shows the Game Over overlay
     without going through the wrapped endGame binding, recover the run. */
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
