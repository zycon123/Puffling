/* Sky Puff — Boss Puffling Rewards v0.2
 * Normal boss fights can reward Pufflings. Rare fusion Pufflings have a very small chance.
 */
(function(){
  const BASE_IDS=['ember','volt','frost','prism','shadow','wind'];
  const EPIC_IDS=['thunderflame','aurora','tempest'];
  const LEGENDARY_IDS=['eclipse','neonstorm'];
  const DROP_CHANCE=0.35;
  const EPIC_WITHIN_DROP=0.04;       // 4% of successful Puffling drops (~1.4% per boss)
  const LEGENDARY_WITHIN_DROP=0.01;  // 1% of successful Puffling drops (~0.35% per boss)
  let previousBoss=null;
  let rewardedBossKey='';

  function fusion(){return window.SkyPuffFusion}
  function gameplay(){return window.SkyPuffPufflingGameplay}
  function puffInfo(id){
    const F=fusion();
    return gameplay()?.getPuff?.(id)||F?.BASE?.[id]||Object.values(F?.FUSIONS||{}).find(p=>p.id===id)||null;
  }
  function randomFrom(list){return list[Math.floor(Math.random()*list.length)]}
  function rollPufflingId(){
    const rarityRoll=Math.random();
    if(rarityRoll<LEGENDARY_WITHIN_DROP)return randomFrom(LEGENDARY_IDS);
    if(rarityRoll<LEGENDARY_WITHIN_DROP+EPIC_WITHIN_DROP)return randomFrom(EPIC_IDS);
    return randomFrom(BASE_IDS);
  }

  function rollBossReward(defeated){
    if(!defeated||typeof bossRushMode!=='undefined'&&bossRushMode)return;
    const key=`${defeated.id||'boss'}:${defeated.at||0}:${defeated.tier||1}`;
    if(key===rewardedBossKey)return;
    rewardedBossKey=key;
    if(Math.random()>DROP_CHANCE){
      if(typeof showToast==='function')showToast('Boss reward: Ingen Puffling denne gangen ☁️');
      return;
    }
    const id=rollPufflingId();
    const F=fusion();if(!F)return;
    F.add(id,1);
    const p=puffInfo(id);
    if(gameplay()&&!gameplay().active())gameplay().setActive(id);
    window.SkyPuffFusionUI?.renderDex?.();
    const rarity=(p?.rarity||'common').toUpperCase();
    const rareText=(p?.rarity==='epic'||p?.rarity==='legendary')?` ${rarity}!`:' ';
    if(typeof showToast==='function')showToast(`BOSS DROP!${rareText} ${p?.icon||'☁️'} ${p?.name||id} funnet!`);
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
  window.SkyPuffBossPufflingRewards={
    dropChance:DROP_CHANCE,
    epicWithinDrop:EPIC_WITHIN_DROP,
    legendaryWithinDrop:LEGENDARY_WITHIN_DROP,
    rollBossReward
  };
})();
