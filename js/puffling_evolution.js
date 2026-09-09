/* Sky Puff — Puffling evolution milestones v0.1 */
(function(){
 const stageFor=id=>{const g=window.SkyPuffPufflingProgress?.get?.(id)||{level:1};return g.level>=20?2:g.level>=10?1:0};
 const bonusFor=id=>{const s=stageFor(id);return s===2?1.12:s===1?1.06:1};
 const titleFor=id=>{const p=window.SkyPuffPufflingGameplay?.getPuff?.(id);const s=stageFor(id);if(!p)return '';return s===2?`Ascended ${p.name}`:s===1?`Evolved ${p.name}`:p.name};
 let last={};
 function tick(){
  try{
   const F=window.SkyPuffFusion,s=F?.load?.();if(s){Object.keys(s.owned||{}).forEach(id=>{if((s.owned[id]||0)<=0)return;const st=stageFor(id),prev=last[id]??st;last[id]=st;if(st>prev&&typeof showToast==='function'){const p=window.SkyPuffPufflingGameplay?.getPuff?.(id);showToast(st===2?`ASCENDED! ${p?.icon||'☁️'} ${p?.name||id}`:`EVOLVED! ${p?.icon||'☁️'} ${p?.name||id}`);window.SkyPuffFusionUI?.renderDex?.();}});}
  }catch(e){}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 window.SkyPuffPufflingEvolution={stageFor,bonusFor,titleFor};
})();
