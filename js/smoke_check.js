(function(){
  const missing=[];
  const requiredFunctions=['reset','startGame','update','draw','loop','spawnBoss','openBossRush','openMultiplayer','loadLeaderboard','submitOnlineScore','persist','refreshMenu','tr','startMusic','stopMusic','getEndlessBossStage'];
  for(const name of requiredFunctions){if(typeof window[name]!=='function'&&typeof globalThis[name]!=='function')missing.push('fn:'+name);}
  const requiredValues=['canvas','ctx','save','skins','bossStages','missions','SKY_PUFF_VERSION','API_BASE'];
  for(const name of requiredValues){try{if(typeof eval(name)==='undefined')missing.push('value:'+name);}catch(e){missing.push('value:'+name);}}
  const requiredDom=['game','start','playBtn','bossRushBtn','multiplayerBtn','achievementsBtn','achievementsMenu','shop','upgrades','pauseMenu','gameOver','leaderboardMenu'];
  for(const id of requiredDom){if(!document.getElementById(id))missing.push('dom:#'+id);}
  if(!window.skyPuffAchievements)missing.push('api:skyPuffAchievements');
  if(!window.skyPuffAchievementsMenu)missing.push('api:skyPuffAchievementsMenu');
  if(!window.skyPuffBetaDiagnostics)missing.push('api:skyPuffBetaDiagnostics');
  if(!window.skyPuffAIDiagnostics)missing.push('api:skyPuffAIDiagnostics');
  if(!window.skyPuffAntiCheat)missing.push('api:skyPuffAntiCheat');
  const result={ok:missing.length===0,missing,version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown',apiMode:API_BASE?'online':'local-fallback',autoDiagnostics:!!window.skyPuffAIDiagnostics,antiCheat:!!window.skyPuffAntiCheat,checkedAt:new Date().toISOString()};
  window.skyPuffSmokeCheck=result;
  if(result.ok)console.info('Sky Puff beta smoke check: OK',result);else console.error('Sky Puff beta smoke check failed:',missing);
})();
