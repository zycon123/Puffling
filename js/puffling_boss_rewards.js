/* Puffling — Boss Puffling Rewards v0.3 */
(function(){
  const DROP_CHANCE=0.35;
  const EPIC_WITHIN_DROP=0.04;
  const LEGENDARY_WITHIN_DROP=0.01;
  let previousBoss=null,rewardedBossKey='';
  function fusion(){return window.SkyPuffFusion}
  function gameplay(){return window.SkyPuffPufflingGameplay}
  function all(){const F=fusion();return F?[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})]:[]}
  function byRarity(r){return all().filter(p=>p.rarity===r).map(p=>p.id)}
  function commonPool(){return all().filter(p=>p.rarity==='common'||p.rarity==='rare').map(p=>p.id)}
  function puffInfo(id){return gameplay()?.getPuff?.(id)||all().find(p=>p.id===id)||null}
  function randomFrom(list){return list.length?list[Math.floor(Math.random()*list.length)]:null}
  function rollPufflingId(){const rr=Math.random();if(rr<LEGENDARY_WITHIN_DROP)return randomFrom(byRarity('legendary'));if(rr<LEGENDARY_WITHIN_DROP+EPIC_WITHIN_DROP)return randomFrom(byRarity('epic'));return randomFrom(commonPool());}
  function rollBossReward(defeated){
    if(!defeated||typeof bossRushMode!=='undefined'&&bossRushMode)return;
    const key=`${defeated.id||'boss'}:${defeated.at||0}:${defeated.tier||1}`;if(key===rewardedBossKey)return;rewardedBossKey=key;
    if(Math.random()>DROP_CHANCE){if(typeof showToast==='function')showToast('Boss reward: Ingen Puffling denne gangen ☁️');return;}
    const id=rollPufflingId(),F=fusion();if(!id||!F)return;F.add(id,1);const p=puffInfo(id);if(gameplay()&&!gameplay().active())gameplay().setActive(id);window.SkyPuffFusionUI?.renderDex?.();const rarity=(p?.rarity||'common').toUpperCase();const rareText=(p?.rarity==='epic'||p?.rarity==='legendary')?` ${rarity}!`:' ';if(typeof showToast==='function')showToast(`BOSS DROP!${rareText} ${p?.icon||'☁️'} ${p?.name||id} funnet!`);
  }
  function tick(){try{if(typeof boss!=='undefined'){if(boss)previousBoss={id:boss.id,name:boss.name,at:boss.at,tier:boss.tier};else if(previousBoss){const defeated=previousBoss;previousBoss=null;if(typeof running==='undefined'||running)rollBossReward(defeated);}}}catch(e){}requestAnimationFrame(tick)}
  requestAnimationFrame(tick);window.SkyPuffBossPufflingRewards={dropChance:DROP_CHANCE,epicWithinDrop:EPIC_WITHIN_DROP,legendaryWithinDrop:LEGENDARY_WITHIN_DROP,rollBossReward};
})();