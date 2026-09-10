(function(){
  const missing=[];
  const requiredFunctions=['reset','startGame','update','draw','loop','spawnBoss','openBossRush','openMultiplayer','openShop','closeShop','renderShop','loadLeaderboard','submitOnlineScore','persist','refreshMenu','tr','startMusic','stopMusic','getEndlessBossStage'];
  for(const name of requiredFunctions){if(typeof window[name]!=='function'&&typeof globalThis[name]!=='function')missing.push('fn:'+name);}
  const requiredValues=['canvas','ctx','save','skins','bossStages','missions','SKY_PUFF_VERSION','API_BASE','SKY_PUFF_SUPPORT_EMAIL'];
  for(const name of requiredValues){try{if(typeof eval(name)==='undefined')missing.push('value:'+name);}catch(e){missing.push('value:'+name);}}
  const requiredDom=['game','start','playBtn','bossRushBtn','multiplayerBtn','achievementsBtn','achievementsMenu','diagnosticsBtn','diagnosticsMenu','sendBugReportBtn','shopBtn','shop','skinrow','facerow','hatrow','trailrow','closeShop','upgrades','pauseMenu','gameOver','leaderboardMenu','stealMyPufflingBtn'];
  for(const id of requiredDom){if(!document.getElementById(id))missing.push('dom:#'+id);}
  const criticalHandlers=['playBtn','retryBtn','pauseBtn','shopBtn','closeShop','upgradeBtn','closeUpgrades','dailyBtn','multiplayerBtn','closeMultiplayer','quickMatchBtn','createRoomBtn','joinRoomBtn','bossRushBtn','closeBossRush','diagnosticsBtn','closeDiagnostics','leaderboardBtn','closeLeaderboard','audioSettingsBtn','closeAudioSettings','stealMyPufflingBtn'];
  for(const id of criticalHandlers){const el=document.getElementById(id);if(el&&typeof el.onclick!=='function')missing.push('handler:#'+id);}
  const requiredApis=['skyPuffAchievements','skyPuffAchievementsMenu','skyPuffBetaDiagnostics','skyPuffAIDiagnostics','skyPuffAntiCheat','skyPuffDiagnosticsSupport','skyPuffPlatform','SkyPuffFusion','SkyPuffFusionUI','SkyPuffPufflingGameplay','SkyPuffPufflingProgress','SkyPuffPufflingEvolution','SkyPuffPerformance','SkyPuffPerformanceUI','SkyPuffBossPufflingRewards','SkyPuffRace','SkyPuffRaceUI','SkyPuffRaceTransport','SkyPuffRaceNetwork','SkyPuffRaceProgress','SkyPuffQuickRank','SkyPuffNurseryVault','SkyPuffDiamonds','SkyPuffMysteryShop','SkyPuffUniqueTraits','PufflingBossRush','PufflingBossPersistence','PufflingRaceMode','PufflingBrand','PufflingExtraCollection','PufflingExpansion36'];
  for(const name of requiredApis){if(!window[name])missing.push('api:'+name);}
  const antiReady=!!(window.skyPuffAntiCheat&&window.skyPuffAntiCheat.status&&Number.isFinite(window.skyPuffAntiCheat.status.runStartedAt));if(!antiReady)missing.push('anti-cheat:run-state');
  try{
    const F=window.SkyPuffFusion,s=F?.load?.();
    if(!s||typeof s.owned!=='object'||!Array.isArray(s.discovered)||!Array.isArray(s.vault))missing.push('puffling:invalid-save');
    else if(s.vault.length>3)missing.push('vault:too-many-slots');
    else if(new Set(s.vault).size!==s.vault.length)missing.push('vault:duplicate-slots');
    const total=Object.keys(F?.BASE||{}).length+Object.keys(F?.FUSIONS||{}).length;
    if(total!==100)missing.push('puffling:expected-100-total:'+total);
    if(window.PufflingExtraCollection?.count!==50)missing.push('puffling:extra-50-count');
    if(window.PufflingExpansion36?.count!==36)missing.push('puffling:expansion-36-count');
    if(window.PufflingExpansion36?.legendaryIds?.length!==10)missing.push('puffling:expansion-legendary-count');
    if(window.SkyPuffUniqueTraits?.count!==100)missing.push('puffling:trait-count');
  }catch(e){missing.push('puffling:save-read-failed');}
  try{
    const N=window.SkyPuffNurseryVault,e=N?.loadEggs?.();
    if(!e||typeof e!=='object')missing.push('nursery:invalid-eggs');
    const starterIds=new Set(['starterpuff','starterspark','starterdrop']);
    for(const t of ['rare','epic','legendary']){
      if((+e?.[t]||0)<0)missing.push('nursery:negative-'+t);
      const p=N?.pool?.(t)||[];
      if(!p.length)missing.push('nursery:empty-pool-'+t);
      if(p.some(id=>starterIds.has(id)))missing.push('nursery:starter-in-'+t+'-pool');
    }
  }catch(e){missing.push('nursery:read-failed');}
  try{
    const R=window.SkyPuffRace;
    if(R?.GOAL_METERS!==1500)missing.push('race:goal-not-1500');
    if(R?.MAX_ATTACKS!==3)missing.push('race:max-attacks-not-3');
    if(!window.SkyPuffRaceProgress?.liveProgress)missing.push('race:progress-source-missing');
    const ranked=window.SkyPuffQuickRank?.profile?.();
    if(!ranked||!Number.isFinite(Number(ranked.rating))||!ranked.rank?.name)missing.push('race:rank-profile-invalid');
  }catch(e){missing.push('race:core-check-failed');}
  try{const M=window.SkyPuffMysteryShop;if(M?.rewards?.some(x=>x.id==='vaultShield'))missing.push('shop:obsolete-vault-shield');const total=(M?.rewards||[]).reduce((n,x)=>n+(+x.weight||0),0);if(total!==100)missing.push('shop:weight-'+total);}catch(e){missing.push('shop:check-failed');}
  try{const late=window.SkyPuffLateBosses;if(!Array.isArray(late)||late.length!==6)missing.push('late-bosses:expected-6');}catch(e){missing.push('late-bosses:check-failed');}
  try{const fixed=window.PufflingBossRush?.allStages?.()||[];if(fixed.length<10)missing.push('boss-rush:expected-at-least-10-fixed-bosses');}catch(e){missing.push('boss-rush:check-failed');}
  try{if(document.title!=='Puffling')missing.push('brand:title');const h=document.querySelector('#start h1');if(h&&h.textContent.trim()!=='Puffling')missing.push('brand:main-heading');}catch(e){missing.push('brand:check-failed');}
  const result={ok:missing.length===0,missing,version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown',pufflingCount:(Object.keys(window.SkyPuffFusion?.BASE||{}).length+Object.keys(window.SkyPuffFusion?.FUSIONS||{}).length),extraPufflings:window.PufflingExtraCollection?.count||0,expansion36:window.PufflingExpansion36?.count||0,quickRaceRating:window.SkyPuffQuickRank?.profile?.().rating||0,checkedAt:new Date().toISOString()};window.skyPuffSmokeCheck=result;if(result.ok)console.info('Puffling smoke check: OK',result);else console.error('Puffling smoke check failed:',missing);
})();