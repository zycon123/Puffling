/* Puffling — unique Puffling trait runtime v1.1 */
(function(){
 const G=()=>window.SkyPuffPufflingGameplay;
 const T=id=>window.SkyPuffUniqueTraits?.get?.(id)||null;
 const E=id=>Math.max(1,Number(window.SkyPuffPufflingEvolution?.bonusFor?.(id)||1));
 let jumpLatch=false;
 function active(){return G()?.active?.()||'';}
 function applyFrame(dt){
  const id=active(),trait=T(id);if(!id||!trait||typeof running==='undefined'||!running)return;const evo=E(id);
  const s=Math.min((Number(dt)||16.67)/16.67,1.6);
  if(typeof boost==='number'&&trait.boostRegen>0){boost=Math.min(100,boost+trait.boostRegen*evo*s);if(typeof boostEl!=='undefined'&&boostEl)boostEl.style.width=boost+'%';}
  if(typeof player!=='undefined'&&player){
   const jumpScale=1+(Math.max(1,trait.jumpScale)-1)*evo;
   if(!jumpLatch&&player.vy<-10.35&&player.vy>-11.1&&jumpScale>1){player.vy*=jumpScale;jumpLatch=true;}
   if(player.vy>-2)jumpLatch=false;
  }
 }
 const oldUpdate=window.update;
 if(typeof oldUpdate==='function')window.update=function(dt){const r=oldUpdate.apply(this,arguments);applyFrame(dt);return r;};
 const oldBoost=window.doBoost;
 if(typeof oldBoost==='function')window.doBoost=function(){
  const id=active(),before=typeof playerShots!=='undefined'?playerShots.length:0,r=oldBoost.apply(this,arguments),trait=T(id),evo=E(id);
  if(trait&&typeof playerShots!=='undefined'&&playerShots.length>before){for(let i=before;i<playerShots.length;i++){if(playerShots[i]?.damage!=null)playerShots[i].damage*=trait.shotPower*evo;}}
  return r;
 };
 const oldAbsorb=window.absorbHit;
 if(typeof oldAbsorb==='function')window.absorbHit=function(){
  const id=active(),trait=T(id),chance=Math.min(.5,(trait?.rescueChance||0)*E(id));
  if(chance>0&&Math.random()<chance){if(typeof invuln!=='undefined')invuln=Math.max(invuln,26);if(typeof showToast==='function')showToast(`${G()?.getPuff?.(id)?.name||'Puffling'} trait save! ✨`);return true;}
  return oldAbsorb.apply(this,arguments);
 };
 function enhanceDex(){document.querySelectorAll('#puffdexGrid [data-puffling-id]').forEach(card=>{if(card.querySelector('[data-unique-trait]'))return;const trait=T(card.dataset.pufflingId);if(!trait)return;const d=document.createElement('div');d.dataset.uniqueTrait='1';d.className='small';d.style.cssText='margin-top:5px;font-weight:900;opacity:.78';d.textContent=`✦ ${trait.traitName}`;card.appendChild(d);});}
 function detailObserver(){
  const root=document.getElementById('pufflingDetailContent');if(!root)return;
  const inject=()=>{if(root.querySelector('[data-trait-detail]'))return;const title=root.querySelector('h1');if(!title||/Uoppdaget/.test(title.textContent||''))return;const list=[...Object.values(window.SkyPuffFusion?.BASE||{}),...Object.values(window.SkyPuffFusion?.FUSIONS||{})];const p=list.find(x=>title.textContent?.includes(x.name));if(!p?.trait)return;const t=p.trait,box=document.createElement('div');box.dataset.traitDetail='1';box.style.cssText='margin:10px 0 14px;padding:12px;border-radius:14px;background:rgba(255,255,255,.62);text-align:left';const evo=E(p.id);box.innerHTML=`<b>✦ ${t.traitName}</b><div class="small" style="margin-top:5px">Hopp x${t.jumpScale.toFixed(4)} • Boost ${t.boostRegen.toFixed(4)} • Skudd x${t.shotPower.toFixed(3)} • Kontroll ${t.controlBonus.toFixed(3)} • Rescue ${(t.rescueChance*100).toFixed(2)}% • Race ${t.raceStrength.toFixed(3)}${evo>1?` • Evolution bonus +${Math.round((evo-1)*100)}%`:''}</div>`;title.insertAdjacentElement('afterend',box);};
  new MutationObserver(()=>{inject();enhanceDex();}).observe(root,{childList:true,subtree:true});inject();
 }
 if(typeof MutationObserver!=='undefined'){const boot=()=>{enhanceDex();detailObserver();const grid=document.getElementById('puffdexGrid');if(grid)new MutationObserver(enhanceDex).observe(grid,{childList:true,subtree:true});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));else setTimeout(boot,50);}
 window.SkyPuffTraitRuntime={active,trait:()=>T(active()),evolutionBonus:()=>E(active()),applyFrame};
})();