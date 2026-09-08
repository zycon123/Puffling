(function(){
 const originalDoBoost=doBoost;
 doBoost=function(){
  if(window.skyBossExitLockUntil&&performance.now()<window.skyBossExitLockUntil)return;
  return originalDoBoost();
 };

 const originalReset=reset;
 reset=function(){
  window.skyBossExitLockUntil=0;
  if(resumeCountdownEl)resumeCountdownEl.style.display='none';
  return originalReset();
 };
})();