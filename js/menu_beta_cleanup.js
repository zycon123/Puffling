/* Puffling — remove obsolete menu hints and beta UI v0.3 */
(function(){
 function clean(){
  const hint=document.getElementById('menuHint');if(hint)hint.remove();
  const badge=document.getElementById('betaBadge');if(badge)badge.remove();
  document.querySelectorAll('[id*="betaPopup"],[id*="betaModal"],[class*="betaPopup"],[class*="betaModal"]').forEach(e=>e.remove());
 }
 clean();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean);
 setTimeout(clean,250);setTimeout(clean,900);
 document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(clean,0));
 window.SkyPuffMenuBetaCleanup={clean};
})();
