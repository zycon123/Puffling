(function(){
 const unlockedThisRun=new Set();
 function unlock(key,title,reward){if(save[key])return false;save[key]=true;save.bank+=reward;persist();refreshMenu();showToast(`Achievement: ${title}! +${reward} 🪙 🏅`);return true;}
 function checkHeight(){if(score>=10000&&!save.achSkyLegend&&!unlockedThisRun.has('skyLegend')){unlockedThisRun.add('skyLegend');unlock('achSkyLegend','SKY LEGEND',1000);}}
 function eventCleared(){save.eventsCleared=(save.eventsCleared||0)+1;persist();if(save.eventsCleared>=5)unlock('achEventMaster','EVENT MASTER',750);}
 function bossDefeated(tier){if((tier||1)>=3)unlock('achBossHunter','BOSS HUNTER',1250);}
 const previousUpdate=update;
 update=function(dt){const hadBoss=!!boss,previousTier=hadBoss?(boss.tier||1):1;previousUpdate(dt);if(running)checkHeight();if(hadBoss&&!boss&&running&&bossDefeated&&previousTier>=3)bossDefeated(previousTier);};
 window.skyPuffAchievements={eventCleared,bossDefeated,checkHeight};
})();
