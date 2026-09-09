/* Sky Puff — remove obsolete boss hint and beta UI v0.2 */
(function(){
 const hints={no:'Dobbelttrykk for Rainbow Puff.',en:'Double-tap for Rainbow Puff.',de:'Doppeltippen für Rainbow Puff.',es:'Doble toque para Rainbow Puff.',fr:'Double-tapez pour Rainbow Puff.'};
 function clean(){
  try{if(typeof i18n!=='undefined')for(const [k,v] of Object.entries(hints))if(i18n[k])i18n[k].hint=v;}catch(e){}
  const hint=document.getElementById('menuHint');
  if(hint){const l=(typeof lang!=='undefined'&&hints[lang])?lang:'no';hint.innerHTML=hints[l];}
  const badge=document.getElementById('betaBadge');if(badge)badge.remove();
  document.querySelectorAll('[id*="betaPopup"],[id*="betaModal"],[class*="betaPopup"],[class*="betaModal"]').forEach(e=>e.remove());
 }
 clean();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean);
 setTimeout(clean,250);setTimeout(clean,900);
 // Language changes may re-render menu text, so clean right after selection changes too.
 document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(clean,0));
 window.SkyPuffMenuBetaCleanup={clean};
})();
