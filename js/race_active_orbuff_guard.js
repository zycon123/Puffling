/* Orbuff — Race active-Orbuff selection guard v1.0
 * Keeps legacy Fusion state compatible while making Race use the player's real active Orbuff.
 */
(function(){
 const F=window.SkyPuffFusion,G=window.SkyPuffPufflingGameplay;if(!F||!G)return;
 function rawOwned(){try{return F.load?.().owned||{}}catch(e){return {}}}
 function canUse(id){if(!id||Number(rawOwned()[id]||0)<=0)return false;const check=window.OrbuffEnergy?.canUse;return typeof check==='function'?!!check(id):true}
 function usableIds(){return Object.keys(rawOwned()).filter(canUse)}
 function ensureActive(){
  const active=G.active?.();if(canUse(active))return active;
  const fallback=usableIds()[0]||'';if(!fallback)return '';
  if(G.setActive?.(fallback)!==false){if(active&&typeof showToast==='function')showToast('Race byttet til en Orbuff som er klar til bruk 🏁');return fallback}return '';
 }
 // The legacy Race bridge reads active/selected/equipped from the collection snapshot.
 // Decorate load() with the real gameplay selection without changing persisted save data.
 if(!F.__orbuffRaceActiveDecorated){
  const baseLoad=F.load.bind(F);F.load=function(){const state=baseLoad(),active=G.active?.();if(active&&Number(state?.owned?.[active]||0)>0)state.active=active;return state};F.__orbuffRaceActiveDecorated=true;
 }
 function block(){
  const msg='Ingen Orbuff er klar til Race. Gjenoppliv en utmattet Orbuff eller ta en Orbuff ut av OrbVault.';
  const status=document.getElementById('multiplayerStatus');if(status)status.textContent=msg;
  if(typeof showToast==='function')showToast('🔒 '+msg);
  return false;
 }
 const baseStart=window.startMultiplayerRace;
 if(typeof baseStart==='function'&&!baseStart.__orbuffActiveGuard){
  const wrapped=async function(){const id=ensureActive();if(!id)return block();return await baseStart.apply(this,arguments)};
  wrapped.__orbuffActiveGuard=true;window.startMultiplayerRace=wrapped;
 }
 const api={canUse,usableIds,ensureActive};window.OrbuffRaceActiveGuard=api;
})();