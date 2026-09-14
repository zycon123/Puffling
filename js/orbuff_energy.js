/* Orbuff energy and revival system v1.2
 * Legacy collection/progression data is untouched. Energy is stored separately.
 */
(function(){
 const KEY='skyPuffOrbuffEnergyV1',STARTERS=new Set(['starterpuff','starterspark','starterdrop']);
 const COST={common:250,rare:500,epic:1000,legendary:2000,mythic:2500};
 const WAIT={common:30,rare:60,epic:90,legendary:120,mythic:120};
 let runArmed=false;
 function gameplay(){return window.SkyPuffPufflingGameplay}
 function fusion(){return window.SkyPuffFusion}
 function puff(id){return gameplay()?.getPuff?.(id)||[...Object.values(fusion()?.BASE||{}),...Object.values(fusion()?.FUSIONS||{})].find(x=>x.id===id)||null}
 function maxEnergy(id){return window.SkyPuffPufflingEvolution?.stageFor?.(id)===2?6:5}
 function load(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');return raw&&typeof raw==='object'?raw:{}}catch(e){return {}}}
 function saveState(s){try{localStorage.setItem(KEY,JSON.stringify(s||{}))}catch(e){}return s}
 function get(id){
  id=String(id||'');const max=maxEnergy(id),s=load(),raw=s[id]&&typeof s[id]==='object'?s[id]:{},exhaustedAt=Math.max(0,Number(raw.exhaustedAt)||0);
  let energy=Math.max(0,Math.min(max,Math.floor(Number.isFinite(Number(raw.energy))?Number(raw.energy):max)));
  const rarity=puff(id)?.rarity||'common',waitMs=(WAIT[rarity]||30)*60000;
  if(energy===0&&exhaustedAt&&Date.now()-exhaustedAt>=waitMs){energy=max;s[id]={energy,exhaustedAt:0};saveState(s)}
  else if(raw.energy!==energy||raw.exhaustedAt!==exhaustedAt){s[id]={energy,exhaustedAt};saveState(s)}
  return {id,energy,max,exhausted:energy<=0,exhaustedAt,waitMs,readyAt:exhaustedAt?exhaustedAt+waitMs:0};
 }
 function consumeLoss(id=gameplay()?.active?.()){
  if(!id)return {ok:false,reason:'no_active_orbuff'};const cur=get(id),s=load(),energy=Math.max(0,cur.energy-1),exhaustedAt=energy===0?Date.now():0;s[id]={energy,exhaustedAt};saveState(s);
  window.SkyPuffFusionUI?.renderDex?.();return {ok:true,...get(id)};
 }
 function recharge(id,amount=1){const cur=get(id),gain=Math.max(0,Math.floor(+amount||0));if(!id||gain<1)return cur;const s=load(),energy=Math.min(cur.max,cur.energy+gain);s[id]={energy,exhaustedAt:energy>0?0:cur.exhaustedAt};saveState(s);window.SkyPuffFusionUI?.renderDex?.();return get(id)}
 function revive(id,method='coins'){
  const cur=get(id);if(!cur.exhausted)return {ok:true,unchanged:true,...cur};
  const p=puff(id),cost=STARTERS.has(id)?0:(COST[p?.rarity||'common']||250);
  if(method==='orb'&&!window.OrbuffVaultProgress?.useReviveOrb?.())return {ok:false,reason:'no_revive_orb',cost};
  if(method==='coins'){
   if(typeof save!=='object'||Number(save.bank||0)<cost)return {ok:false,reason:'not_enough_coins',cost};
   save.bank=Math.max(0,Number(save.bank||0)-cost);try{persist?.();refreshMenu?.()}catch(e){}
  }
  const s=load();s[id]={energy:cur.max,exhaustedAt:0};saveState(s);window.SkyPuffFusionUI?.renderDex?.();
  return {ok:true,cost,...get(id)};
 }
 function canUse(id){return !!id&&!get(id).exhausted&&!window.OrbuffVaultProgress?.isVaulted?.(id)}
 function reviveCost(id){return STARTERS.has(id)?0:(COST[puff(id)?.rarity||'common']||250)}
 function unavailableMessage(id){const vaulted=window.OrbuffVaultProgress?.isVaulted?.(id);return vaulted?'Aktiv Orbuff hviler i OrbVault. Velg en annen Orbuff 🔐':'Aktiv Orbuff er utmattet. Gjenoppliv den i Orbdex ❤️'}
 function guardActive(){const id=gameplay()?.active?.();if(id&&!canUse(id)){runArmed=false;if(typeof showToast==='function')showToast(unavailableMessage(id));return false}return true}
 function patchGameplay(){
  const g=gameplay();if(!g||g.__energyPatched)return;const oldSet=g.setActive;
  g.setActive=function(id){if(window.OrbuffVaultProgress?.isVaulted?.(id)){if(typeof showToast==='function')showToast('Denne Orbuffen hviler i OrbVault 🔐');return false}if(!canUse(id)){if(typeof showToast==='function')showToast('Denne Orbuffen er utmattet og må gjenopplives ❤️');return false}return oldSet.call(g,id)};
  g.__energyPatched=true;
 }
 function patchRun(){
  if(typeof startGame==='function'&&!startGame.__orbuffEnergyGuard){const oldStart=startGame;const wrapped=function(){if(!guardActive())return false;const result=oldStart.apply(this,arguments);runArmed=typeof running==='undefined'||!!running;return result};wrapped.__orbuffEnergyGuard=true;startGame=wrapped;if(typeof playBtnEl!=='undefined'&&playBtnEl)playBtnEl.onclick=startGame;if(typeof retryBtnEl!=='undefined'&&retryBtnEl)retryBtnEl.onclick=startGame}
  if(typeof startBossRush==='function'&&!startBossRush.__orbuffEnergyGuard){const oldBossRush=startBossRush;const wrapped=function(){if(!guardActive())return false;const result=oldBossRush.apply(this,arguments);runArmed=typeof running==='undefined'||!!running;return result};wrapped.__orbuffEnergyGuard=true;startBossRush=wrapped}
  if(typeof finishBossRushWin==='function'&&!finishBossRushWin.__orbuffEnergyWin){const oldWin=finishBossRushWin;const wrapped=function(){runArmed=false;return oldWin.apply(this,arguments)};wrapped.__orbuffEnergyWin=true;finishBossRushWin=wrapped}
  if(typeof endGame==='function'&&!endGame.__orbuffEnergyLoss){const oldEnd=endGame;const wrapped=function(){const wasRace=typeof multiplayerMode!=='undefined'&&!!multiplayerMode,shouldCharge=runArmed&&!wasRace;const result=oldEnd.apply(this,arguments);runArmed=false;if(shouldCharge&&(typeof running==='undefined'||!running)){const r=consumeLoss();if(r.ok&&typeof showToast==='function')showToast(`Orbuff mistet 1 energi • ❤️ ${r.energy}/${r.max}`)}return result};wrapped.__orbuffEnergyLoss=true;endGame=wrapped}
 }
 patchGameplay();patchRun();
 window.OrbuffEnergy={get,maxEnergy,consumeLoss,recharge,revive,reviveCost,canUse,load,guardActive};
 window.SkyPuffOrbuffEnergy=window.OrbuffEnergy;
})();