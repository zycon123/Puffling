/* Sky Puff — Performance settings UI v0.1 */
(function(){
 function label(){const P=window.SkyPuffPerformance;if(!P)return 'AUTO';const m=P.mode();if(m==='high')return 'HIGH';if(m==='low')return 'LOW';return P.low()?'AUTO (LOW)':'AUTO (HIGH)';}
 function ensure(){
  const panel=document.querySelector('#audioSettings .card');if(!panel||document.getElementById('graphicsModeRow'))return;
  const row=document.createElement('div');row.id='graphicsModeRow';row.style.cssText='margin:18px 0;padding-top:14px;border-top:1px solid rgba(70,110,150,.18);text-align:left';
  row.innerHTML='<strong id="graphicsModeTitle"></strong><div id="graphicsModeDesc" class="small" style="margin-top:4px"></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px"><button data-spgfx="auto" class="secondary" style="padding:9px">AUTO</button><button data-spgfx="high" class="secondary" style="padding:9px">HIGH</button><button data-spgfx="low" class="secondary" style="padding:9px">LOW</button></div><div id="graphicsModeStatus" class="small" style="margin-top:9px;font-weight:900"></div>';
  const close=document.getElementById('closeAudioSettings');panel.insertBefore(row,close||null);
  row.querySelectorAll('[data-spgfx]').forEach(b=>b.addEventListener('click',()=>{if(window.SkyPuffPerformance?.setMode?.(b.dataset.spgfx)){refresh();if(typeof showToast==='function')showToast(tr('graphicsModeToast',{mode:label()}));}}));refresh();
  document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(refresh,0));
 }
 function refresh(){const P=window.SkyPuffPerformance,s=document.getElementById('graphicsModeStatus');if(!P||!s)return;const titleEl=document.getElementById('graphicsModeTitle'),descEl=document.getElementById('graphicsModeDesc');if(titleEl)titleEl.textContent=tr('graphicsModeTitle');if(descEl)descEl.textContent=tr('graphicsModeDesc');s.textContent=tr('graphicsModeActive',{mode:label()});document.querySelectorAll('[data-spgfx]').forEach(b=>{const on=P.mode()===b.dataset.spgfx;b.classList.toggle('gold',on);b.classList.toggle('secondary',!on);});}
 const oldApply=window.SkyPuffPerformance?.apply;if(oldApply)window.SkyPuffPerformance.apply=function(){const r=oldApply.apply(this,arguments);refresh();return r};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
 window.SkyPuffPerformanceUI={ensure,refresh};
})();
