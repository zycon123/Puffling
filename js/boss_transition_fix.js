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

  if(stageAt!=null){score=stageAt;cameraY=-stageAt*10;}
  else{if(Number.isFinite(entry.cameraY))cameraY=entry.cameraY;if(Number.isFinite(entry.score))score=entry.score;}
  scoreEl.textContent=score;
  window.skyPuffAntiCheat?.acceptTransition?.(score,coins);

  // Always create a guaranteed landing cloud under Puff plus a reachable continuation cloud above it.
  const landingScreenY=Math.min(H-105,H*.76);
  const landingY=cameraY+landingScreenY;
  const landingW=Math.min(170,W-36);
  const preferredX=Number.isFinite(entry.playerX)?entry.playerX:player.x;
  const landingX=Math.max(18,Math.min(W-landingW-18,preferredX-landingW/2));
  const landingCenter=landingX+landingW/2;

  const nextScreenY=landingScreenY-88;
  const nextW=Math.min(125,W-44);
  // Limit horizontal gap so a normal jump can always reach the next cloud.
  const desiredNextX=landingCenter+(landingCenter<W/2?58:-58)-nextW/2;
  const nextX=Math.max(22,Math.min(W-nextW-22,desiredNextX));

  platforms=platforms.filter(p=>{const sy=p.y-cameraY;return Math.abs(sy-landingScreenY)>30&&Math.abs(sy-nextScreenY)>26;});
  platforms.push({x:landingX,y:landingY,w:landingW,h:18,phase:0,move:false,breakable:false,used:false,safeBossExit:true});
  platforms.push({x:nextX,y:cameraY+nextScreenY,w:nextW,h:16,phase:0,move:false,breakable:false,used:false,safeBossContinuation:true});

  player.x=landingCenter;player.y=landingScreenY-player.r-2;player.vx=0;player.vy=0;pointerX=player.x;
  invuln=Math.max(invuln,220);
  window.skyBossResumeGate=score+80;window.skyBossEntryState=null;

  // Hold Puff safely on the lower cloud, then resume with a normal jump toward the guaranteed continuation cloud.
  window.skyBossExitLockUntil=performance.now()+3000;
  if(resumeCountdownEl&&resumeCountdownTextEl){
   resumeCountdownEl.style.display='flex';const started=performance.now();
   function tick(now){
    const left=Math.max(0,3000-(now-started));const seconds=Math.max(1,Math.ceil(left/1000));resumeCountdownTextEl.textContent=left>0?String(seconds):'GO!';
    if(left>0&&running&&!boss){player.y=landingScreenY-player.r-2;player.vx=0;player.vy=0;requestAnimationFrame(tick);}
    else{resumeCountdownEl.style.display='none';if(running&&!boss){player.vy=-10.6;puffAnim=-1;}}
   }
   requestAnimationFrame(tick);
  }else setTimeout(()=>{if(running&&!boss)player.vy=-10.6;},3000);
 };
})();
