(function(){
 function statusCard(label,state,detail){const ok=state==='ok',warn=state==='warn';const icon=ok?'✅':warn?'⚠️':'❌';return `<div style="background:rgba(255,255,255,.84);border:2px solid ${ok?'rgba(80,190,120,.25)':warn?'rgba(255,190,60,.32)':'rgba(235,80,80,.28)'};border-radius:15px;padding:11px 13px"><div style="font-weight:1000;color:#35516b">${icon} ${label}</div><div style="font-size:12px;font-weight:800;color:#65788b;margin-top:4px;word-break:break-word">${detail}</div></div>`;}
 function safeString(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}
 function collect(){
   const smoke=window.skyPuffSmokeCheck||null,ai=window.skyPuffAIDiagnostics||null,antiApi=window.skyPuffAntiCheat||null,beta=window.skyPuffBetaDiagnostics||null;
   let anti=null;try{anti=antiApi&&antiApi.status?antiApi.status:null}catch(e){anti=null}
   let saveOk=true;try{localStorage.setItem('__skyPuffDiagTest','1');localStorage.removeItem('__skyPuffDiagTest')}catch(e){saveOk=false}
   return {version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown',support:typeof SKY_PUFF_SUPPORT_EMAIL==='string'?SKY_PUFF_SUPPORT_EMAIL:'zyconstudios@protonmail.com',smoke,ai,anti,saveOk,leaderboardMode:typeof API_BASE==='string'&&API_BASE?'online':'local fallback',userAgent:navigator.userAgent,lastError:beta&&beta.lastError?beta.lastError:null};
 }
 function render(){
   if(!diagnosticsListEl||!diagnosticsSummaryEl)return;
   const d=collect(),smokeOk=!!(d.smoke&&d.smoke.ok),aiRepairs=d.ai&&typeof d.ai.repairs==='number'?d.ai.repairs:0,aiLast=d.ai&&d.ai.lastRepair?safeString(d.ai.lastRepair):'Ingen reparasjoner registrert';
   const flags=d.anti&&Array.isArray(d.anti.flags)?d.anti.flags:[],blocked=d.anti&&Number.isFinite(d.anti.blockedSubmissions)?d.anti.blockedSubmissions:0,acFlagged=flags.length>0||blocked>0;
   const acDetail=d.anti?`${flags.length} flag(s) • ${blocked} blokkerte submissions`:'Ikke tilgjengelig';
   diagnosticsSummaryEl.textContent=smokeOk&&!acFlagged&&d.saveOk?'Systemstatus: OK ✅':'Systemstatus: sjekk detaljer under';
   diagnosticsListEl.innerHTML=statusCard('Build','ok',d.version)+statusCard('Smoke Check',smokeOk?'ok':'bad',d.smoke?safeString(d.smoke):'Smoke check mangler')+statusCard('AI Diagnostics',d.ai?'ok':'bad',d.ai?`${aiRepairs} auto-reparasjoner • ${aiLast}`:'Diagnostikkmotor mangler')+statusCard('Anti-Cheat',acFlagged?'warn':d.anti?'ok':'bad',acDetail)+statusCard('Save System',d.saveOk?'ok':'bad',d.saveOk?'localStorage tilgjengelig':'localStorage utilgjengelig')+statusCard('Leaderboard','ok',d.leaderboardMode)+statusCard('Support','ok',d.support)+statusCard('Siste runtime-feil',d.lastError?'warn':'ok',d.lastError?safeString(d.lastError):'Ingen lagret feil');
 }
 function open(){render();startEl.style.display='none';diagnosticsMenuEl.style.display='flex';}
 function close(){diagnosticsMenuEl.style.display='none';startEl.style.display='flex';}
 function sendReport(){
   const d=collect();const ai=d.ai?{repairs:d.ai.repairs,lastRepair:d.ai.lastRepair,lastIssue:d.ai.lastIssue}:null;const ac=d.anti?{flags:d.anti.flags||[],blockedSubmissions:d.anti.blockedSubmissions||0,runStartedAt:d.anti.runStartedAt||0}:null;
   const body=['Sky Puff Beta Bug Report','',`Build: ${d.version}`,`Smoke check: ${d.smoke?safeString(d.smoke):'missing'}`,`AI diagnostics: ${safeString(ai)}`,`Anti-cheat: ${safeString(ac)}`,`Leaderboard: ${d.leaderboardMode}`,`Last runtime error: ${d.lastError?safeString(d.lastError):'none'}`,`Device/browser: ${d.userAgent}`,'','Hva skjedde?','','Hva gjorde du rett før feilen?','','Høyde / boss / modus:'].join('\n');
   location.href=`mailto:${d.support}?subject=${encodeURIComponent(`Sky Puff Beta Support ${d.version}`)}&body=${encodeURIComponent(body)}`;
 }
 if(diagnosticsBtnEl)diagnosticsBtnEl.onclick=open;if(closeDiagnosticsEl)closeDiagnosticsEl.onclick=close;if(refreshDiagnosticsBtnEl)refreshDiagnosticsBtnEl.onclick=render;if(sendBugReportBtnEl)sendBugReportBtnEl.onclick=sendReport;window.skyPuffDiagnosticsSupport={open,close,render,collect,sendReport};
})();