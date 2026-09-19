/* Orbuff — Race active-Orbuff selection + energy guard v1.1
 * Keeps legacy Fusion state compatible while making Race use the player's real active Orbuff.
 */
(function(){
 const F=window.SkyPuffFusion,G=window.SkyPuffPufflingGameplay;if(!F||!G)return;
 let raceOrbuffId='',raceLossCharged=false;
 function rawOwned(){try{return F.load?.().owned||{}}catch(e){return {}}}
 function canUse(id){if(!id||Number(rawOwned()[id]||0)<=0)return false;const check=window.OrbuffEnergy?.canUse;return typeof check==='function'?!!check(id):true}
 function usableIds(){return Object.keys(rawOwned()).filter(canUse)}
 function ensureActive(){
  const active=G.active?.();if(canUse(active))return active;
  const fallback=usableIds()[0]||'';if(!fallback)return '';
  if(G.setActive?.(fallback)!==false){if(active&&typeof showToast==='function')showToast(tr('raceSwitchedOrbuff'));return fallback}return '';
 }
 // The legacy Race bridge reads active/selected/equipped from the collection snapshot.
 // Decorate load() with the real gameplay selection without changing persisted save data.
 if(!F.__orbuffRaceActiveDecorated){
  const baseLoad=F.load.bind(F);F.load=function(){const state=baseLoad(),active=G.active?.();if(active&&Number(state?.owned?.[active]||0)>0)state.active=active;return state};F.__orbuffRaceActiveDecorated=true;
 }
 function block(){
  const msg=tr('raceNoOrbuffReady');
  const status=document.getElementById('multiplayerStatus');if(status)status.textContent=msg;
  if(typeof showToast==='function')showToast('🔒 '+msg);
  return false;
 }
 const baseStart=window.startMultiplayerRace;
 if(typeof baseStart==='function'&&!baseStart.__orbuffActiveGuard){
  const wrapped=async function(){const id=ensureActive();if(!id)return block();raceOrbuffId=id;raceLossCharged=false;return await baseStart.apply(this,arguments)};
  wrapped.__orbuffActiveGuard=true;window.startMultiplayerRace=wrapped;
 }
 function chargeRaceLoss(state){
  if(raceLossCharged||!state||!(state.winner==='rival'||state.disconnectLoss))return null;
  raceLossCharged=true;const id=raceOrbuffId||G.active?.(),r=window.OrbuffEnergy?.consumeLoss?.(id);
  if(r?.ok&&typeof showToast==='function')setTimeout(()=>showToast(tr('raceLossEnergy',{energy:r.energy,max:r.max})),150);
  return r||null;
 }
 const raceUi=window.SkyPuffRaceUI;
 if(raceUi&&typeof raceUi.showResult==='function'&&!raceUi.showResult.__orbuffEnergyLoss){
  const baseShowResult=raceUi.showResult.bind(raceUi);const wrapped=function(state){chargeRaceLoss(state||window.SkyPuffRace?.snapshot?.());return baseShowResult(state)};wrapped.__orbuffEnergyLoss=true;raceUi.showResult=wrapped;
 }
 const api={canUse,usableIds,ensureActive,chargeRaceLoss,get raceOrbuffId(){return raceOrbuffId}};window.OrbuffRaceActiveGuard=api;
})();