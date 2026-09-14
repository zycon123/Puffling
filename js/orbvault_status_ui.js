/* Orbuff — live OrbVault status and player-facing polish v1.0 */
(function(){
 const HOST_ID='orbVaultLiveStatus',STYLE_ID='orbVaultLiveStatusCss';let lastSettle=0;
 const P=()=>window.OrbuffVaultProgress,N=()=>window.SkyPuffNurseryVault,E=()=>window.OrbuffEnergy,X=()=>window.SkyPuffPufflingProgress,G=()=>window.SkyPuffPufflingGameplay;
 function fmt(ms){ms=Math.max(0,Math.ceil((Number(ms)||0)/1000));const m=Math.floor(ms/60),s=ms%60;return `${m}:${String(s).padStart(2,'0')}`}
 function puff(id){return G()?.getPuff?.(id)||window.SkyPuffFusion?.BASE?.[id]||window.SkyPuffFusion?.FUSIONS?.[id]||null}
 function ensureCss(){if(document.getElementById(STYLE_ID))return;const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`#${HOST_ID}{display:grid;gap:7px;margin:8px 0 10px}.orbVaultLiveRow{padding:9px 10px;border-radius:13px;background:rgba(255,255,255,.76);border:1px solid rgba(80,145,185,.14);text-align:left;color:#35516b}.orbVaultLiveTop{display:flex;align-items:center;justify-content:space-between;gap:8px;font-weight:1000}.orbVaultLiveMeta{font-size:10px;font-weight:800;line-height:1.45;margin-top:4px;opacity:.82}.orbVaultLiveEmpty{font-size:11px;font-weight:800;opacity:.72;text-align:center;padding:7px}`;document.head.appendChild(s)}
 function polishLabels(){const menu=document.getElementById('nurseryVaultMenu');if(!menu)return;const h=menu.querySelector('h1');if(h)h.textContent='Nursery & OrbVault 🥚🔐';menu.querySelectorAll('.small').forEach(el=>{if(!el.dataset.orbuffPolished){el.innerHTML=el.innerHTML.replace(/Pufflings/g,'Orbuffs').replace(/Pufflingen/g,'Orbuffen').replace(/Puffling/g,'Orbuff');el.dataset.orbuffPolished='1'}})}
 function ensureHost(){ensureCss();polishLabels();const progress=document.getElementById('orbVaultProgress');if(!progress)return null;let host=document.getElementById(HOST_ID);if(!host){host=document.createElement('div');host.id=HOST_ID;progress.insertAdjacentElement('afterend',host)}return host}
 function render(){
  const host=ensureHost(),p=P(),n=N();if(!host||!p||!n)return;
  const menu=document.getElementById('nurseryVaultMenu');if(!menu||menu.style.display==='none')return;
  const now=Date.now();if(now-lastSettle>30000){try{p.settle()}catch(e){}lastSettle=now}
  const state=p.load(),cfg=p.config(),slots=n.loadVaultSlots?.()||[],progress=document.getElementById('orbVaultProgress');
  if(progress)progress.innerHTML=`<b>OrbVault Level ${state.level}/5</b><br>${cfg.slots} plasser • +1 energi hvert ${cfg.energyMinutes}. min • ${cfg.xpHour} XP/time<br>Revive Orbs: <b>${state.reviveOrbs}</b>${state.level<5?' • låses opp som daglig bonus på Level 5':' • 15 % daglig sjanse'}`;
  const filled=slots.filter(Boolean);if(!filled.length){host.innerHTML='<div class="orbVaultLiveEmpty">Legg en Orbuff i OrbVault for å starte hvile, energilading og passiv XP.</div>';return}
  host.innerHTML=filled.map(id=>{const q=puff(id),energy=E()?.get?.(id),xp=X()?.get?.(id),rest=state.rest?.[id],energyFull=energy&&energy.energy>=energy.max,nextEnergy=rest&&!energyFull?(+rest.energyAt||now)+cfg.energyMinutes*60000-now:0,nextXp=rest?(+rest.xpAt||now)+3600000-now:0;return `<div class="orbVaultLiveRow"><div class="orbVaultLiveTop"><span>${q?.icon||'☁️'} ${q?.name||id}</span><span>❤️ ${energy?.energy??'?'} / ${energy?.max??'?'}</span></div><div class="orbVaultLiveMeta">Level ${xp?.level||1} • ${energyFull?'Full energi':`Neste energi om ${fmt(nextEnergy)}`} • Neste ${cfg.xpHour} XP om ${fmt(nextXp)}</div></div>`}).join('')
 }
 function tick(){try{render()}catch(e){}setTimeout(tick,1000)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(tick,100));else setTimeout(tick,100);
 window.OrbuffVaultStatusUI={render};
})();