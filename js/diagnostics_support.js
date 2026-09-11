(function(){
 function statusCard(label,state,detail){const ok=state==='ok',warn=state==='warn';const icon=ok?'✅':warn?'⚠️':'❌';return `<div style="background:rgba(255,255,255,.84);border:2px solid ${ok?'rgba(80,190,120,.25)':warn?'rgba(255,190,60,.32)':'rgba(235,80,80,.28)'};border-radius:15px;padding:11px 13px"><div style="font-weight:1000;color:#35516b">${icon} ${label}</div><div style="font-size:12px;font-weight:800;color:#65788b;margin-top:4px;word-break:break-word">${detail}</div></div>`;}
 function safeString(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}
 function raceEndpoint(){try{return String(window.SkyPuffRaceTransport?.snapshot?.().endpoint||localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'').trim()}catch(e){return String(window.SKY_PUFF_RACE_WS_URL||'').trim()}}
 function collect(){
   const smoke=window.skyPuffSmokeCheck||null,ai=window.skyPuffAIDiagnostics||null,antiApi=window.skyPuffAntiCheat||null,beta=window.skyPuffBetaDiagnostics||null;
   let anti=null;try{anti=antiApi&&antiApi.status?antiApi.status:null}catch(e){anti=null}
   let iap=null;try{iap=window.PufflingDiamondStore?.status?.()||null}catch(e){iap=null}
   let saveOk=true;try{localStorage.setItem('__skyPuffDiagTest','1');localStorage.removeItem('__skyPuffDiagTest')}catch(e){saveOk=false}
   const endpoint=raceEndpoint(),leaderboardOnline=typeof API_BASE==='string'&&!!API_BASE;
   const account=window.PufflingAccountProfile||null;
   const rankServerAuthoritative=!!account?.rankServerAuthoritative;
   const tradeServerInventory=!!account?.inventoryServerAuthoritative;
   return {version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown',support:typeof SKY_PUFF_SUPPORT_EMAIL==='string'?SKY_PUFF_SUPPORT_EMAIL:'zyconstudios@protonmail.com',smoke,ai,anti,iap,saveOk,leaderboardMode:leaderboardOnline?'online':'local fallback',leaderboardOnline,raceEndpoint:endpoint,raceServerMode:endpoint?'configured':'not configured',rankServerAuthoritative,tradeServerInventory,userAgent:navigator.userAgent,lastError:beta&&beta.lastError?beta.lastError:null};
 }
 function codesFor(d){
   const codes=[];
   const smokeOk=!!(d.smoke&&d.smoke.ok),flags=d.anti&&Array.isArray(d.anti.flags)?d.anti.flags:[],blocked=d.anti&&Number.isFinite(d.anti.blockedSubmissions)?d.anti.blockedSubmissions:0;
   if(!d.smoke)codes.push({code:'PFL-SMOKE-000',level:'error',detail:'Smoke Check mangler'});
   else if(!smokeOk)codes.push({code:'PFL-SMOKE-001',level:'error',detail:(d.smoke.missing||[]).join(', ')||'Smoke Check feilet'});
   if(!d.saveOk)codes.push({code:'PFL-SAVE-001',level:'error',detail:'localStorage er ikke tilgjengelig'});
   if(d.lastError)codes.push({code:'PFL-RUNTIME-001',level:'warn',detail:safeString(d.lastError)});
   if(flags.length||blocked)codes.push({code:'PFL-AC-001',level:'warn',detail:`${flags.length} flag(s), ${blocked} blokkerte submissions`});
   if(d.ai?.lastIssue)codes.push({code:'PFL-AI-001',level:'warn',detail:safeString(d.ai.lastIssue)});
   if(!d.raceEndpoint)codes.push({code:'PFL-LAUNCH-101',level:'launch',detail:'Race-server/WebSocket er ikke konfigurert; multiplayer bruker lokal fallback'});
   if(!d.leaderboardOnline)codes.push({code:'PFL-LAUNCH-102',level:'launch',detail:'Global leaderboard-backend er ikke konfigurert; lokal fallback brukes'});
   if(!d.iap?.canPurchase){const reason=!d.iap?'Diamond Store API mangler':!d.iap.bridgeReady?'Native App Store/Google Play-bro er ikke koblet til':!d.iap.verifyReady?'Serververifisering for kjøp er ikke konfigurert':'Betaling er ikke klar';codes.push({code:'PFL-LAUNCH-103',level:'launch',detail:reason});}
   if(!d.rankServerAuthoritative)codes.push({code:'PFL-LAUNCH-104',level:'launch',detail:'Ranked MMR/W/L er fortsatt lagret lokalt i nettleseren; offentlig ranked krever konto- og serverlagret profil'});
   if(!d.tradeServerInventory)codes.push({code:'PFL-LAUNCH-105',level:'launch',detail:'Trade-eierskap er fortsatt klientlokalt; offentlig trading krever server-autoritativ inventory'});
   return codes;
 }
 function render(){
   if(!diagnosticsListEl||!diagnosticsSummaryEl)return;
   const d=collect(),codes=codesFor(d),smokeOk=!!(d.smoke&&d.smoke.ok),aiRepairs=d.ai&&typeof d.ai.repairs==='number'?d.ai.repairs:0,aiLast=d.ai&&d.ai.lastRepair?safeString(d.ai.lastRepair):'Ingen reparasjoner registrert';
   const flags=d.anti&&Array.isArray(d.anti.flags)?d.anti.flags:[],blocked=d.anti&&Number.isFinite(d.anti.blockedSubmissions)?d.anti.blockedSubmissions:0,acFlagged=flags.length>0||blocked>0;
   const acDetail=d.anti?`${flags.length} flag(s) • ${blocked} blokkerte submissions`:'Ikke tilgjengelig';
   const iapDetail=d.iap?(d.iap.canPurchase?`${d.iap.platform} • kjøp aktivt`:`${d.iap.platform} • bridge ${d.iap.bridgeReady?'OK':'mangler'} • verifier ${d.iap.verifyReady?'OK':'mangler'}`):'Diamond Store API mangler';
   const hard=codes.filter(x=>x.level==='error').length,warnings=codes.filter(x=>x.level==='warn').length,launch=codes.filter(x=>x.level==='launch').length;
   diagnosticsSummaryEl.textContent=hard?`Systemstatus: ${hard} feil funnet ❌`:warnings?`Systemstatus: ${warnings} advarsel(er) ⚠️`:launch?`Spillstatus: OK ✅ • ${launch} launch-punkt gjenstår`:'Systemstatus: OK ✅ • Launch-klar';
   const codeDetail=codes.length?codes.map(x=>`${x.code}: ${x.detail}`).join(' | '):'Ingen aktive feilkoder';
   diagnosticsListEl.innerHTML=statusCard('Build','ok',d.version)+statusCard('Smoke Check',smokeOk?'ok':'bad',d.smoke?safeString(d.smoke):'Smoke check mangler')+statusCard('AI Diagnostics',d.ai?(d.ai.lastIssue?'warn':'ok'):'bad',d.ai?`${aiRepairs} auto-reparasjoner • ${aiLast}${d.ai.lastIssue?' • Siste issue: '+safeString(d.ai.lastIssue):''}`:'Diagnostikkmotor mangler')+statusCard('Anti-Cheat',acFlagged?'warn':d.anti?'ok':'bad',acDetail)+statusCard('Save System',d.saveOk?'ok':'bad',d.saveOk?'localStorage tilgjengelig':'localStorage utilgjengelig')+statusCard('Race Server',d.raceEndpoint?'ok':'warn',d.raceEndpoint||'Ikke konfigurert — lokal/test-ghost brukes')+statusCard('Leaderboard',d.leaderboardOnline?'ok':'warn',d.leaderboardMode)+statusCard('Ranked profile',d.rankServerAuthoritative?'ok':'warn',d.rankServerAuthoritative?'MMR/W/L er server-autoritativt':'MMR/W/L er lokal beta-profil')+statusCard('Trade inventory',d.tradeServerInventory?'ok':'warn',d.tradeServerInventory?'Inventory valideres på server':'Inventory/eierskap er lokal beta-data')+statusCard('Diamond IAP',d.iap?.canPurchase?'ok':'warn',iapDetail)+statusCard('Feilkoder / launch-koder',hard?'bad':warnings||launch?'warn':'ok',codeDetail)+statusCard('Support','ok',d.support)+statusCard('Siste runtime-feil',d.lastError?'warn':'ok',d.lastError?safeString(d.lastError):'Ingen lagret feil');
 }
 function open(){render();startEl.style.display='none';diagnosticsMenuEl.style.display='flex';}
 function close(){diagnosticsMenuEl.style.display='none';startEl.style.display='flex';}
 function sendReport(){
   const d=collect(),codes=codesFor(d);const ai=d.ai?{repairs:d.ai.repairs,lastRepair:d.ai.lastRepair,lastIssue:d.ai.lastIssue}:null;const ac=d.anti?{flags:d.anti.flags||[],blockedSubmissions:d.anti.blockedSubmissions||0,runStartedAt:d.anti.runStartedAt||0}:null;
   const body=['Puffling Beta Bug Report','',`Build: ${d.version}`,`Codes: ${codes.length?safeString(codes):'none'}`,`Smoke check: ${d.smoke?safeString(d.smoke):'missing'}`,`AI diagnostics: ${safeString(ai)}`,`Anti-cheat: ${safeString(ac)}`,`Race server: ${d.raceServerMode}${d.raceEndpoint?' • '+d.raceEndpoint:''}`,`Leaderboard: ${d.leaderboardMode}`,`Rank server profile: ${d.rankServerAuthoritative?'yes':'no'}`,`Trade server inventory: ${d.tradeServerInventory?'yes':'no'}`,`Diamond IAP: ${safeString(d.iap)}`,`Last runtime error: ${d.lastError?safeString(d.lastError):'none'}`,`Device/browser: ${d.userAgent}`,'','Hva skjedde?','','Hva gjorde du rett før feilen?','','Høyde / boss / modus:'].join('\n');
   location.href=`mailto:${d.support}?subject=${encodeURIComponent(`Puffling Beta Support ${d.version}`)}&body=${encodeURIComponent(body)}`;
 }
 if(diagnosticsBtnEl)diagnosticsBtnEl.onclick=open;if(closeDiagnosticsEl)closeDiagnosticsEl.onclick=close;if(refreshDiagnosticsBtnEl)refreshDiagnosticsBtnEl.onclick=render;if(sendBugReportBtnEl)sendBugReportBtnEl.onclick=sendReport;window.skyPuffDiagnosticsSupport={open,close,render,collect,codesFor,sendReport};
})();