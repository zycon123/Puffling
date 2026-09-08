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

  startGame=function(){
    markStart();
    return originalStartGame();
  };

  if(playBtnEl)playBtnEl.onclick=startGame;
  if(retryBtnEl)retryBtnEl.onclick=startGame;

  endGame=function(reason='unknown'){
    const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
    skyPuffLastGameOverReason=String(reason||'unknown');

    const looksLikeStartupFall=
      running&&
      elapsed<4500&&
      score<=1&&
      player&&
      player.hp>0;

    if(looksLikeStartupFall&&skyPuffStartupRescues<2){
      skyPuffStartupRescues++;
      const startPlatform=platforms&&platforms[0];
      const platformY=startPlatform?startPlatform.y:H*.82;
      player.x=W/2;
      player.y=platformY-player.r-2;
      player.vx=0;
      player.vy=-10.6;
      cameraY=0;
      invuln=90;
      pointerX=W/2;
      lastTime=performance.now();
      if(gameOverEl)gameOverEl.style.display='none';
      if(startEl)startEl.style.display='none';
      if(typeof showToast==='function')showToast('Starten er stabilisert ☁️');
      console.warn('Sky Puff startup guard rescued run',{reason,elapsed,playerY:player.y,H,rescues:skyPuffStartupRescues});
      return;
    }

    console.info('Sky Puff game over',{reason,elapsed,score,hp:player?.hp,playerY:player?.y,H});
    return originalEndGame();
  };

  window.skyPuffStartGuard={
    get status(){return{
      active:true,
      runStartedAt:skyPuffRunStartedAt,
      lastGameOverReason:skyPuffLastGameOverReason,
      startupRescues:skyPuffStartupRescues
    }}
  };
})();
