(function(){
 const state={repairs:0,lastRepair:null,lastIssue:null,startedAt:new Date().toISOString(),watchdog:null,lastFrameAt:performance.now()};
 function finite(v,fallback){return Number.isFinite(v)?v:fallback;}
 function remember(issue,repair){state.lastIssue=issue;state.lastRepair=repair;state.repairs++;try{localStorage.skyPuffAutoDiagnostics=JSON.stringify({...state,watchdog:null});}catch(_){} }
 function notify(msg){try{if(typeof showToast==='function')showToast(msg);}catch(_){} }
 function repairCoreState(reason){
  let changed=false;
  try{
   if(player){
    if(!Number.isFinite(player.x)){player.x=W/2;changed=true;}
    if(!Number.isFinite(player.y)){player.y=H*.68;changed=true;}
    if(!Number.isFinite(player.vx)){player.vx=0;changed=true;}
    if(!Number.isFinite(player.vy)){player.vy=-8;changed=true;}
    if(!Number.isFinite(player.hp)||player.hp<1){player.hp=Math.max(1,3+(save.upHealth||0));if(hpEl)hpEl.textContent=player.hp;changed=true;}
   }
   cameraY=finite(cameraY,0);score=Math.max(0,finite(score,0));coins=Math.max(0,finite(coins,0));boost=Math.max(0,Math.min(100,finite(boost,100)));
   if(!Array.isArray(platforms)){platforms=[];changed=true;}if(!Array.isArray(coinItems)){coinItems=[];changed=true;}if(!Array.isArray(enemies)){enemies=[];changed=true;}if(!Array.isArray(powerups)){powerups=[];changed=true;}if(!Array.isArray(particles)){particles=[];changed=true;}if(!Array.isArray(playerShots)){playerShots=[];changed=true;}if(!Array.isArray(bossShots)){bossShots=[];changed=true;}
   if(boss){
    boss.x=finite(boss.x,W/2);boss.y=finite(boss.y,150);boss.hp=Math.max(1,finite(boss.hp,5));boss.maxHp=Math.max(boss.hp,finite(boss.maxHp,boss.hp));boss.shot=finite(boss.shot,0);
   }
   if(running&&!bossArena&&platforms.length===0&&typeof addPlatform==='function'){
    let y=cameraY+H*.82;platforms.push({x:W/2-55,y,w:110,h:18,move:false,breakable:false});for(let i=0;i<18;i++){y-=78;addPlatform(y);}changed=true;
   }
  }catch(e){console.warn('Auto diagnostics core repair failed',e);}
  if(changed){remember(reason||'invalid-state','core-state-repair');notify('AI Diagnostics reparerte spilltilstanden ✨');}
  return changed;
 }
 function repairOverlays(){
  try{
   if(!running&&startEl&&gameOverEl&&shopEl&&upgradesEl&&pauseMenuEl){
    const visible=[startEl,gameOverEl,shopEl,upgradesEl,pauseMenuEl,leaderboardMenuEl,bossRushMenuEl,multiplayerMenuEl,achievementsMenuEl].filter(Boolean).filter(el=>getComputedStyle(el).display!=='none');
    if(visible.length===0){if(typeof showMainMenu==='function')showMainMenu();remember('no-visible-menu','restore-main-menu');return true;}
   }
  }catch(_){}
  return false;
 }
 function repairBossState(){
  try{
   if(bossArena&&!boss){bossArena=false;bossArenaY=0;if(bossWrap)bossWrap.style.display='none';if(bossIdentityEl)bossIdentityEl.style.display='none';stopBossMusic(false);remember('boss-arena-without-boss','clear-boss-arena');notify('AI Diagnostics ryddet boss-state');return true;}
   if(boss&&!running){boss=null;bossArena=false;playerShots=[];bossShots=[];if(bossWrap)bossWrap.style.display='none';stopBossMusic(false);remember('boss-active-while-stopped','clear-stale-boss');return true;}
  }catch(_){}
  return false;
 }
 function recoverFromError(err,source){
  const message=String(err&&err.message||err||'Unknown error');
  state.lastIssue={message,source:source||'runtime',at:new Date().toISOString()};
  const repaired=repairCoreState('runtime-error')||repairBossState()||repairOverlays();
  if(!repaired){
   try{if(typeof cancelBossWarning==='function')cancelBossWarning();playerShots=[];bossShots=[];if(running){lastTime=performance.now();requestAnimationFrame(loop);remember('runtime-error-retry','resume-main-loop');notify('AI Diagnostics prøver å fortsette spillet 🔧');return true;}}catch(_){}
  }
  return repaired;
 }
 window.addEventListener('error',e=>recoverFromError(e.error||e.message,'window.error'));
 window.addEventListener('unhandledrejection',e=>recoverFromError(e.reason,'unhandledrejection'));
 const oldLoop=typeof loop==='function'?loop:null;
 if(oldLoop){
  loop=function(t){state.lastFrameAt=performance.now();return oldLoop(t);};
 }
 state.watchdog=setInterval(()=>{
  try{
   repairCoreState('watchdog');repairBossState();repairOverlays();
   if(running&&!paused&&performance.now()-state.lastFrameAt>2600){lastTime=performance.now();state.lastFrameAt=performance.now();requestAnimationFrame(loop);remember('stalled-main-loop','restart-animation-loop');notify('AI Diagnostics startet spill-loopen på nytt 🔄');}
  }catch(e){console.warn('Auto diagnostics watchdog error',e);}
 },1800);
 window.skyPuffAIDiagnostics={
  get status(){return {repairs:state.repairs,lastRepair:state.lastRepair,lastIssue:state.lastIssue,startedAt:state.startedAt};},
  run(){const a=repairCoreState('manual-check'),b=repairBossState(),c=repairOverlays();return {repaired:!!(a||b||c),status:this.status};},
  recoverFromError
 };
})();
