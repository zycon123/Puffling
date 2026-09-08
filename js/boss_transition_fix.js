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
  if(Number.isFinite(entry.cameraY))cameraY=entry.cameraY;
  if(Number.isFinite(entry.score)){score=entry.score;scoreEl.textContent=score;}
  const landingY=cameraY+Math.min(H-115,H*.78);
  const landingW=Math.min(150,W-40);
  const preferredX=Number.isFinite(entry.playerX)?entry.playerX:player.x;
  const landingX=Math.max(20,Math.min(W-landingW-20,preferredX-landingW/2));
  platforms=platforms.filter(p=>Math.abs((p.y-cameraY)-Math.min(H-115,H*.78))>26);
  platforms.push({x:landingX,y:landingY,w:landingW,h:16,phase:0,move:false,breakable:false,used:false,safeBossExit:true});
  player.x=landingX+landingW/2;
  player.y=landingY-player.r-2;
  player.vx=0;
  player.vy=-8.8;
  pointerX=player.x;
  invuln=Math.max(invuln,90);
  window.skyBossResumeGate=(Number.isFinite(entry.stageAt)?entry.stageAt:score)+35;
  window.skyBossEntryState=null;
 };
})();