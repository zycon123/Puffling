/* Sky Puff — Boss Puffling Rewards v0.1
 * Gives a chance to find a Puffling after defeating a boss in the normal game.
 */
(function(){
  const BASE_IDS=['ember','volt','frost','prism','shadow','wind'];
  const DROP_CHANCE=0.35;
  let previousBoss=null;
  let rewardedBossKey='';

  function fusion(){return window.SkyPuffFusion}
  function gameplay(){return window.SkyPuffPufflingGameplay}
  function puffInfo(id){return gameplay()?.getPuff?.(id)||fusion()?.BASE?.[id]||null}

  function rollBossReward(defeated){
    if(!defeated||typeof bossRushMode!=='undefined'&&bossRushMode)return;
    const key=`${defeated.id||'boss'}:${defeated.at||0}:${defeated.tier||1}`;
    if(key===rewardedBossKey)return;
    rewardedBossKey=key;
    if(Math.random()>DROP_CHANCE){
      if(typeof showToast==='function')showToast('Boss reward: Ingen Puffling denne gangen ☁️');
      return;
    }
    const id=BASE_IDS[Math.floor(Math.random()*BASE_IDS.length)];
    const F=fusion();if(!F)return;
    F.add(id,1);
    const p=puffInfo(id);
    if(gameplay()&&!gameplay().active())gameplay().setActive(id);
    window.SkyPuffFusionUI?.renderDex?.();
    if(typeof showToast==='function')showToast(`BOSS DROP! ${p?.icon||'☁️'} ${p?.name||id} funnet!`);
  }

  function tick(){
    try{
      if(typeof boss!=='undefined'){
        if(boss)previousBoss={id:boss.id,name:boss.name,at:boss.at,tier:boss.tier};
        else if(previousBoss){const defeated=previousBoss;previousBoss=null;if(typeof running==='undefined'||running)rollBossReward(defeated);}
      }
    }catch(e){}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  window.SkyPuffBossPufflingRewards={dropChance:DROP_CHANCE,rollBossReward};
})();
