(function(){
 const version=typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'beta';
 document.title=`Sky Puff ${version}`;
 const versionEl=document.querySelector('.menuVersion');
 if(versionEl)versionEl.textContent=`SKY PUFF • ${version.toUpperCase()} • BETA`;
 const badge=document.createElement('div');
 badge.id='betaBadge';
 badge.textContent='BETA';
 badge.style.cssText='position:fixed;left:10px;top:10px;z-index:30;background:rgba(255,190,45,.95);color:#503700;border:2px solid rgba(255,255,255,.8);border-radius:999px;padding:5px 9px;font:1000 11px Arial;letter-spacing:.8px;box-shadow:0 4px 14px rgba(0,0,0,.15);pointer-events:none';
 document.body.appendChild(badge);
 if(multiplayerBtnEl){multiplayerBtnEl.textContent='MULTIPLAYER BETA ⚔️';multiplayerBtnEl.title='Beta prototype – rivalen er simulert inntil nettverksbackend kobles til.';}
 if(multiplayerStatusEl&&multiplayerStatusEl.textContent==='Ikke tilkoblet')multiplayerStatusEl.textContent='BETA • Simulert rival';
 window.addEventListener('error',e=>{try{localStorage.skyPuffLastError=JSON.stringify({message:e.message||'Unknown error',file:e.filename||'',line:e.lineno||0,at:new Date().toISOString(),version});}catch(_){} });
 window.addEventListener('unhandledrejection',e=>{try{localStorage.skyPuffLastError=JSON.stringify({message:String(e.reason&&e.reason.message||e.reason||'Unhandled promise rejection'),at:new Date().toISOString(),version});}catch(_){} });
 window.skyPuffBetaDiagnostics={version,get lastError(){try{return JSON.parse(localStorage.skyPuffLastError||'null')}catch(e){return null}},clearLastError(){localStorage.removeItem('skyPuffLastError')}};
})();
