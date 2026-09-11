/* Puffling — reward/economy hardening v1 */
(function(){
 const DAY=86400000;
 const FIRST_RUSH_REWARD=250,REPLAY_RUSH_REWARD=25;
 const lateCosmetics={
  solarCrown:{name:'Solar Crown ☀️',need:999999,boss:'solar'},
  voidMask:{name:'Void Mask 🕳️',need:999999,boss:'void'},
  thunderHelm:{name:'Thunder Helm ⚡',need:999999,boss:'thunder'},
  crystalCrown:{name:'Crystal Crown 💎',need:999999,boss:'crystal'},
  infernoCrown:{name:'Inferno Crown 🔥',need:999999,boss:'inferno'},
  cosmicCrown:{name:'Cosmic Crown 🌌',need:999999,boss:'cosmic'}
 };
 try{if(typeof hats!=='undefined')Object.assign(hats,lateCosmetics);}catch(e){}

 function claimDaily(){
  const now=Date.now();
  if(now-(Number(save.lastDaily)||0)<DAY){showToast(tr('dailyClaimed'));return false;}
  const previous=Number(save.lastDaily)||0,gap=previous?now-previous:Infinity;
  save.streak=previous&&gap<DAY*2?Math.max(1,(Number(save.streak)||0)+1):1;
  const reward=250;save.bank=(Number(save.bank)||0)+reward;save.lastDaily=now;persist();refreshMenu();
  if(typeof streakEl!=='undefined'&&streakEl)streakEl.textContent=save.streak;
  showToast(tr('dailyReward',{streak:save.streak,reward}));return true;
 }
 try{if(typeof dailyBtnEl!=='undefined'&&dailyBtnEl)dailyBtnEl.onclick=claimDaily;}catch(e){}

 const baseEnd=window.endGame;
 if(typeof baseEnd==='function'&&!baseEnd.__rewardStreakFixed){
  const wrapped=function(){const dailyStreak=Math.max(0,Number(save.streak)||0),out=baseEnd.apply(this,arguments);if(save.streak!==dailyStreak){save.streak=dailyStreak;persist();refreshMenu();if(typeof streakEl!=='undefined'&&streakEl)streakEl.textContent=dailyStreak;}return out;};
  wrapped.__rewardStreakFixed=true;window.endGame=wrapped;
 }

 function rushWins(){try{return window.skyPuffBossRushProgress?.wins?.()||JSON.parse(localStorage.getItem('skyPuffBossRushWinsV1')||'{}')}catch(e){return {}}}
 function rushReward(id){return rushWins()[id]?REPLAY_RUSH_REWARD:FIRST_RUSH_REWARD;}
 const originalFinish=window.finishBossRushWin;
 if(typeof originalFinish==='function')window.finishBossRushWin=function(){
  const wonId=typeof bossRushSelected!=='undefined'&&bossRushSelected&&bossRushSelected.id,reward=rushReward(wonId);
  if(wonId&&window.skyPuffBossRushProgress)window.skyPuffBossRushProgress.record(wonId);else if(wonId){try{const k='skyPuffBossRushWinsV1',w=JSON.parse(localStorage.getItem(k)||'{}');w[wonId]=true;localStorage.setItem(k,JSON.stringify(w))}catch(e){}}
  save.bank=(save.bank||0)+reward;persist();refreshMenu();bossRushMode=false;bossRushSelected=null;boss=null;bossSpawned=false;bossArena=false;bossArenaY=0;playerShots=[];bossShots=[];running=false;paused=false;stopBossMusic(false);if(bossWrap)bossWrap.style.display='none';if(bossWarningEl)bossWarningEl.style.display='none';if(bossRushMenuEl)bossRushMenuEl.style.display='none';showToast(`${modeText().bossWon} +${reward} 🪙`);setTimeout(()=>{showMainMenu();renderBossRush()},350);
 };
 window.PufflingRewardEconomy={claimDaily,rushReward,FIRST_RUSH_REWARD,REPLAY_RUSH_REWARD,lateCosmetics,dailyStreakProtected:true,endlessRewardCap:6000};
})();