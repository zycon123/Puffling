/* Sky Puff — remove obsolete menu boss hint and beta UI v0.1 */
(function(){
 function clean(){
  // Remove the old boss-await/menu guidance but keep the Rainbow Puff control hint.
  const hint=document.getElementById('menuHint');
  if(hint)hint.innerHTML='Dobbelttrykk for Rainbow Puff.';
  // Remove beta badge/window-like beta elements from the player-facing UI.
  const badge=document.getElementById('betaBadge');if(badge)badge.remove();
  document.querySelectorAll('[id*="betaPopup"],[id*="betaModal"],[class*="betaPopup"],[class*="betaModal"]').forEach(e=>e.remove());
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(clean,50));else setTimeout(clean,50);
 // beta_release_ui loads earlier, so run once more after all synchronous menu setup.
 setTimeout(clean,500);
 window.SkyPuffMenuBetaCleanup={clean};
})();
