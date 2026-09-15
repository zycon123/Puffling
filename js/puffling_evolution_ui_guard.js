/* Sky Puff — Puffdex evolution eligibility UI v1.0 */
(function(){
 const STARTERS=new Set(['starterpuff','starterspark','starterdrop']);
 const COPY={
  no:{card:'Starter • utvikler seg ikke',heading:'STARTFORM',detail:'Starter-Orbuffs utvikler seg ikke. Finn andre Orbuffs for å låse opp Evolved og Ascended forms.'},
  en:{card:'Starter • does not evolve',heading:'STARTER FORM',detail:'Starter Orbuffs do not evolve. Find other Orbuffs to unlock Evolved and Ascended forms.'},
  de:{card:'Starter • entwickelt sich nicht',heading:'STARTFORM',detail:'Starter-Orbuffs entwickeln sich nicht. Finde andere Orbuffs, um Evolved- und Ascended-Formen freizuschalten.'},
  es:{card:'Inicial • no evoluciona',heading:'FORMA INICIAL',detail:'Los Orbuffs iniciales no evolucionan. Encuentra otros Orbuffs para desbloquear las formas Evolved y Ascended.'},
  fr:{card:'Starter • n’évolue pas',heading:'FORME DE DÉPART',detail:'Les Orbuffs de départ n’évoluent pas. Trouvez d’autres Orbuffs pour débloquer les formes Evolved et Ascended.'}
 };
 function copy(){let code='en';try{code=typeof lang==='string'?lang:(localStorage.getItem('skyPuffLang')||'en')}catch(e){}return COPY[code]||COPY.en;}
 function patchGrid(){
  const t=copy();
  document.querySelectorAll('#puffdexGrid [data-puffling-id]').forEach(card=>{
   if(!STARTERS.has(card.dataset.pufflingId))return;
   const lines=[...card.querySelectorAll('.small')];
   const hint=lines.find(el=>/evolution|utvikler|evolve|entwickelt|evoluc|évolu/i.test(el.textContent||''));
   if(hint)hint.textContent=t.card;
  });
 }
 function patchDetail(){
  const t=copy();
  const root=document.getElementById('pufflingDetailContent');if(!root)return;
  const title=root.querySelector('h1');if(!title)return;
  const list=[...Object.values(window.SkyPuffFusion?.BASE||{}),...Object.values(window.SkyPuffFusion?.FUSIONS||{})];
  const p=list.find(x=>title.textContent?.includes(x.name));if(!p?.starterOnly)return;
  const heading=[...root.querySelectorAll('h3')].find(el=>/EVOLUTION FORMS/i.test(el.textContent||''));
  if(heading)heading.textContent=t.heading;
  root.querySelectorAll('.pufflingFormCard').forEach(card=>{
   const stage=Number(card.dataset.stage)||0;
   if(stage>0)card.style.display='none';
   else card.style.gridColumn='1 / -1';
  });
  const formGrid=root.querySelector('.pufflingFormCard')?.parentElement;if(formGrid)formGrid.style.gridTemplateColumns='1fr';
  [...root.querySelectorAll('.small')].forEach(el=>{
   if(/Evolution låses opp automatisk|Evolution unlocks automatically|Evolution wird automatisch|Evolution se desbloquea|Evolution se débloque/i.test(el.textContent||''))el.textContent=t.detail;
  });
 }
 function patch(){patchGrid();patchDetail();}
 function boot(){
  patch();
  const grid=document.getElementById('puffdexGrid');if(grid&&typeof MutationObserver!=='undefined')new MutationObserver(patchGrid).observe(grid,{childList:true,subtree:true});
  const detail=document.getElementById('pufflingDetailContent');if(detail&&typeof MutationObserver!=='undefined')new MutationObserver(patchDetail).observe(detail,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));else setTimeout(boot,50);
 document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(patch,0));
 window.SkyPuffEvolutionEligibilityUI={patch};
})();
