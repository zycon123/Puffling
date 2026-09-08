(function(){
  const missing=[];
  const requiredFunctions=['reset','startGame','update','draw','loop','spawnBoss','openBossRush','openMultiplayer','loadLeaderboard','submitOnlineScore','persist','refreshMenu','tr','startMusic','stopMusic','getEndlessBossStage'];
  for(const name of requiredFunctions){
    if(typeof window[name]!=='function' && typeof globalThis[name]!=='function') missing.push('fn:'+name);
  }
  const requiredValues=['canvas','ctx','save','skins','bossStages','missions'];
  for(const name of requiredValues){
    try{ if(typeof eval(name)==='undefined') missing.push('value:'+name); }catch(e){ missing.push('value:'+name); }
  }
  const requiredDom=['game','start','playBtn','bossRushBtn','multiplayerBtn','shop','upgrades','pauseMenu','gameOver'];
  for(const id of requiredDom){ if(!document.getElementById(id)) missing.push('dom:#'+id); }
  const result={ok:missing.length===0,missing,checkedAt:new Date().toISOString()};
  window.skyPuffSmokeCheck=result;
  if(result.ok) console.info('Sky Puff smoke check: OK');
  else console.error('Sky Puff smoke check failed:',missing);
})();
