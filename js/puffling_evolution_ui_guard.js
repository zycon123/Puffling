/* Sky Puff — Puffdex evolution eligibility UI v1.0 */
(function(){
 const STARTERS=new Set(['starterpuff','starterspark','starterdrop']);
 function patchGrid(){
  document.querySelectorAll('#puffdexGrid [data-puffling-id]').forEach(card=>{
   if(!STARTERS.has(card.dataset.pufflingId))return;
   const lines=[...card.querySelectorAll('.small')];
   const hint=lines.find(el=>/evolution/i.test(el.textContent||''));
   if(hint)hint.textContent='Starter • utvikler seg ikke';
  });
 }
 function patchDetail(){
  const root=document.getElementById('pufflingDetailContent');if(!root)return;
  const title=root.querySelector('h1');if(!title)return;
  const list=[...Object.values(window.SkyPuffFusion?.BASE||{}),...Object.values(window.SkyPuffFusion?.FUSIONS||{})];
  const p=list.find(x=>title.textContent?.includes(x.name));if(!p?.starterOnly)return;
  const heading=[...root.querySelectorAll('h3')].find(el=>/EVOLUTION FORMS/i.test(el.textContent||''));
  if(heading)heading.textContent='STARTER FORM';
  root.querySelectorAll('.pufflingFormCard').forEach(card=>{
   const stage=Number(card.dataset.stage)||0;
   if(stage>0)card.style.display='none';
   else card.style.gridColumn='1 / -1';
  });
  const formGrid=root.querySelector('.pufflingFormCard')?.parentElement;if(formGrid)formGrid.style.gridTemplateColumns='1fr';
  [...root.querySelectorAll('.small')].forEach(el=>{
   if(/Evolution låses opp automatisk/i.test(el.textContent||''))el.textContent='Starter-Pufflings utvikler seg ikke. Finn andre Pufflings for å låse opp Evolved og Ascended forms.';
  });
 }
 function patch(){patchGrid();patchDetail();}
 function boot(){
  patch();
  const grid=document.getElementById('puffdexGrid');if(grid&&typeof MutationObserver!=='undefined')new MutationObserver(patchGrid).observe(grid,{childList:true,subtree:true});
  const detail=document.getElementById('pufflingDetailContent');if(detail&&typeof MutationObserver!=='undefined')new MutationObserver(patchDetail).observe(detail,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));else setTimeout(boot,50);
 window.SkyPuffEvolutionEligibilityUI={patch};
})();
