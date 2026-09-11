/* Puffling — Fusion Crystal runtime v1 */
(function(){
 const KEY='skyPuffItemsV1',ITEM='fusionCrystal';
 function items(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'?v:{}}catch(e){return {}}}
 function count(){return Math.max(0,Math.floor(Number(items()[ITEM])||0))}
 function spend(){const v=items(),n=count();if(n<1)return false;v[ITEM]=n-1;if(v[ITEM]<=0)delete v[ITEM];localStorage.setItem(KEY,JSON.stringify(v));return true}
 function ensure(){
  const normal=document.getElementById('doFusionBtn'),lab=document.getElementById('fusionLabMenu');if(!normal||!lab||document.getElementById('doCrystalFusionBtn'))return;
  const b=document.createElement('button');b.id='doCrystalFusionBtn';b.className='secondary';b.style.marginTop='8px';normal.insertAdjacentElement('afterend',b);
  const note=document.createElement('div');note.id='fusionCrystalInfo';note.className='small';note.style.marginTop='7px';b.insertAdjacentElement('afterend',note);
  b.onclick=()=>{
   const F=window.SkyPuffFusion,a=document.getElementById('fusionA')?.value||'',c=document.getElementById('fusionB')?.value||'';
   if(count()<1){if(typeof showToast==='function')showToast('Ingen Fusion Crystal tilgjengelig 💠');render();return}
   const res=F?.fuse?.(a,c,{crystal:true});if(!res?.ok){if(typeof showToast==='function')showToast('Crystal Fusion krever en gyldig fusion og tilgjengelige Pufflings.');return}
   if(!spend()){if(typeof showToast==='function')showToast('Fusion Crystal kunne ikke brukes.');return}
   if(typeof showToast==='function')showToast(`💠 Crystal Fusion! ${res.puffling?.name||'Ny Puffling'} • ${res.preservedParent||'én forelder'} bevart`);
   window.SkyPuffFusionUI?.renderDex?.();document.getElementById('fusionA')?.dispatchEvent?.(new Event('change'));render();
  };
  render();
 }
 function render(){const b=document.getElementById('doCrystalFusionBtn'),n=document.getElementById('fusionCrystalInfo'),c=count();if(b){b.disabled=c<1;b.textContent=`CRYSTAL FUSION 💠 (${c})`;}if(n)n.textContent=c?`Bruk 1 Fusion Crystal for å lage fusionen og bevare den andre valgte forelderen.`:'Finn Fusion Crystal i Mystery Box for å bruke Crystal Fusion.';}
 const obs=typeof MutationObserver!=='undefined'?new MutationObserver(()=>{ensure();render()}):null;if(obs&&document.body)obs.observe(document.body,{childList:true,subtree:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,60));else setTimeout(ensure,60);
 window.PufflingFusionCrystals={count,spend,refresh:render};
})();