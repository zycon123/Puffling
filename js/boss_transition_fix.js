(function(){
 const originalNextBossStage=nextBossStage;
 nextBossStage=function(){
  if(window.skyBossResumeGate!=null){
   if(score<window.skyBossResumeGate)return null;
   window.skyBossResumeGate=null;
  }
  return originalNextBossStage();
 };

 createSafeBossExit=function(){
  const entry=window.skyBossEntryState||{};
  const stageAt=Number.isFinite(entry.stageAt)?entry.stageAt:null;

  if(stageAt!=null){
   score=stageAt;
   cameraY=-stageAt*10;
  }else{
   if(Number.isFinite(entry.cameraY))cameraY=entry.cameraY;
   if(Number.isFinite(entry.score))score=entry.score;
  }
  scoreEl.textContent=score;

  const landingScreenY=Math.min(H-115,H*.78);
  const landingY=cameraY+landingScreenY;
  const landingW=Math.min(150,W-40);
  const preferredX=Number.isFinite(entry.playerX)?entry.playerX:player.x;
  const landingX=Math.max(20,Math.min(W-landingW-20,preferredX-landingW/2));

  platforms=platforms.filter(p=>Math.abs((p.y-cameraY)-landingScreenY)>26);
  platforms.push({x:landingX,y:landingY,w:landingW,h:16,phase:0,move:false,breakable:false,used:false,safeBossExit:true});

  player.x=landingX+landingW/2;
  player.y=landingScreenY-player.r-2;
  player.vx=0;
  player.vy=0;
  pointerX=player.x;
  invuln=Math.max(invuln,220);

  window.skyBossResumeGate=score+80;
  window.skyBossEntryState=null;

  // Freeze Puff safely on the exit platform, then count 3-2-1 before jumping again.
  window.skyBossExitLockUntil=performance.now()+3000;
  if(resumeCountdownEl&&resumeCountdownTextEl){
   resumeCountdownEl.style.display='flex';
   const started=performance.now();
   function tick(now){
    const left=Math.max(0,3000-(now-started));
    const seconds=Math.max(1,Math.ceil(left/1000));
    resumeCountdownTextEl.textContent=left>0?String(seconds):'GO!';
    if(left>0&&running&&!boss){
     player.y=landingScreenY-player.r-2;
     player.vx=0;
     player.vy=0;
     requestAnimationFrame(tick);
    }else{
     resumeCountdownEl.style.display='none';
     if(running&&!boss){
      player.vy=-10.6;
      puffAnim=-1;
     }
    }
   }
   requestAnimationFrame(tick);
  }else{
   setTimeout(()=>{if(running&&!boss)player.vy=-10.6;},3000);
  }
 };
})();