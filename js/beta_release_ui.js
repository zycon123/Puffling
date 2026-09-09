(function(){
 const version=typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'beta';
 const supportEmail=typeof SKY_PUFF_SUPPORT_EMAIL==='string'?SKY_PUFF_SUPPORT_EMAIL:'zyconstudios@protonmail.com';
 document.title='Puffling';
 // Keep diagnostics/support plumbing, but do not show a beta badge or beta popup in the player-facing UI.
 const oldBadge=document.getElementById('betaBadge');if(oldBadge)oldBadge.remove();
 if(multiplayerBtnEl){multiplayerBtnEl.textContent='MULTIPLAYER ⚔️';multiplayerBtnEl.removeAttribute('title');}
 if(multiplayerStatusEl&&/BETA|Simulert rival/i.test(multiplayerStatusEl.textContent))multiplayerStatusEl.textContent='Ikke tilkoblet';
 window.addEventListener('error',e=>{try{localStorage.skyPuffLastError=JSON.stringify({message:e.message||'Unknown error',file:e.filename||'',line:e.lineno||0,at:new Date().toISOString(),version});}catch(_){} });
 window.addEventListener('unhandledrejection',e=>{try{localStorage.skyPuffLastError=JSON.stringify({message:String(e.reason&&e.reason.message||e.reason||'Unhandled promise rejection'),at:new Date().toISOString(),version});}catch(_){} });
 window.skyPuffBetaDiagnostics={version,supportEmail,get lastError(){try{return JSON.parse(localStorage.skyPuffLastError||'null')}catch(e){return null}},clearLastError(){localStorage.removeItem('skyPuffLastError')}};
})();