(function(){
 const unlockedThisRun=new Set();
 function unlock(key,title,reward){if(save[key])return false;save[key]=true;save.bank+=reward;persist();refreshMenu();showToast(`Achievement: ${title}! +${reward} 🪙 🏅`);return true;}
 function checkHeight(){
  const targets=[
   ['achSkyLegend','skyLegend',10000,'SKY LEGEND',1000],
   ['achCloudBreaker','cloudBreaker',25000,'CLOUD BREAKER',1800],
   ['achSkyImmortal','skyImmortal',50000,'SKY IMMORTAL',3000]
  ];
  for(const [key,runKey,target,title,reward] of targets){if(score>=target&&!save[key]&&!unlockedThisRun.has(runKey)){unlockedThisRun.add(runKey);unlock(key,title,reward);}}
 }
 function eventCleared(){save.eventsCleared=(save.eventsCleared||0)+1;persist();if(save.eventsCleared>=5)unlock('achEventMaster','EVENT MASTER',750);}
 function recordBossDefeat(tier){
  save.bossWins=(save.bossWins||0)+1;persist();
  if((tier||1)>=3)unlock('achBossHunter','BOSS HUNTER',1250);
  if(save.bossWins>=10)unlock('achBossVeteran','BOSS VETERAN',2000);
 }
 function treasureCollected(){save.treasuresCollected=(save.treasuresCollected||0)+1;persist();if(save.treasuresCollected>=10)unlock('achTreasureHunter','TREASURE HUNTER',1500);}
 const previousUpdate=update;
 update=function(dt){const hadBoss=!!boss,previousTier=hadBoss?(boss.tier||1):1;previousUpdate(dt);if(running)checkHeight();if(hadBoss&&!boss&&running)recordBossDefeat(previousTier);};
 window.skyPuffAchievements={eventCleared,bossDefeated:recordBossDefeat,treasureCollected,checkHeight};
})();
