(function(){
  const missing=[];
  const requiredFunctions=['reset','startGame','update','draw','loop','spawnBoss','openBossRush','openMultiplayer','openShop','closeShop','renderShop','loadLeaderboard','submitOnlineScore','persist','refreshMenu','tr','startMusic','stopMusic','getEndlessBossStage'];
  for(const name of requiredFunctions){if(typeof window[name]!=='function'&&typeof globalThis[name]!=='function')missing.push('fn:'+name);}
  const requiredValues=['canvas','ctx','save','skins','bossStages','missions','SKY_PUFF_VERSION','API_BASE','SKY_PUFF_SUPPORT_EMAIL'];
  for(const name of requiredValues){try{if(typeof eval(name)==='undefined')missing.push('value:'+name);}catch(e){missing.push('value:'+name);}}
  const requiredDom=['game','start','playBtn','bossRushBtn','multiplayerBtn','achievementsBtn','achievementsMenu','diagnosticsBtn','diagnosticsMenu','sendBugReportBtn','shopBtn','shop','skinrow','facerow','hatrow','trailrow','closeShop','upgrades','pauseMenu','gameOver','leaderboardMenu'];
  for(const id of requiredDom){if(!document.getElementById(id))missing.push('dom:#'+id);}
  const criticalHandlers=['playBtn','retryBtn','pauseBtn','shopBtn','closeShop','upgradeBtn','closeUpgrades','dailyBtn','multiplayerBtn','closeMultiplayer','quickMatchBtn','createRoomBtn','joinRoomBtn','bossRushBtn','closeBossRush','diagnosticsBtn','closeDiagnostics','leaderboardBtn','closeLeaderboard','audioSettingsBtn','closeAudioSettings'];
  for(const id of criticalHandlers){const el=document.getElementById(id);if(el&&typeof el.onclick!=='function')missing.push('handler:#'+id);}
  if(!window.skyPuffAchievements)missing.push('api:skyPuffAchievements');
  if(!window.skyPuffAchievementsMenu)missing.push('api:skyPuffAchievementsMenu');
  if(!window.skyPuffBetaDiagnostics)missing.push('api:skyPuffBetaDiagnostics');
  if(!window.skyPuffAIDiagnostics)missing.push('api:skyPuffAIDiagnostics');
  if(!window.skyPuffAntiCheat)missing.push('api:skyPuffAntiCheat');
  if(!window.skyPuffDiagnosticsSupport)missing.push('api:skyPuffDiagnosticsSupport');
  if(!window.skyPuffPlatform)missing.push('api:skyPuffPlatform');
  const antiReady=!!(window.skyPuffAntiCheat&&window.skyPuffAntiCheat.status&&Number.isFinite(window.skyPuffAntiCheat.status.runStartedAt));
  if(!antiReady)missing.push('anti-cheat:run-state');
  const result={ok:missing.length===0,missing,version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown',apiMode:API_BASE?'online':'local-fallback',autoDiagnostics:!!window.skyPuffAIDiagnostics,antiCheat:!!window.skyPuffAntiCheat,diagnosticsSupport:!!window.skyPuffDiagnosticsSupport,skinsMenu:typeof openShop==='function'&&!!document.getElementById('shopBtn')&&!!document.getElementById('shop'),platform:window.skyPuffPlatform?{ios:!!skyPuffPlatform.ios,android:!!skyPuffPlatform.android,mobile:!!skyPuffPlatform.mobile,desktop:!!skyPuffPlatform.desktop,touch:!!skyPuffPlatform.touch}:null,supportEmail:typeof SKY_PUFF_SUPPORT_EMAIL==='string'?SKY_PUFF_SUPPORT_EMAIL:'missing',checkedAt:new Date().toISOString()};
  window.skyPuffSmokeCheck=result;
  if(result.ok)console.info('Sky Puff beta smoke check: OK',result);else console.error('Sky Puff beta smoke check failed:',missing);
})();