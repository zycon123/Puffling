/* Puffling — persist unlocks for all fixed bosses, including late-game bosses */
(function(){
 const late=Array.isArray(window.SkyPuffLateBosses)?window.SkyPuffLateBosses:[];
 function key(id){return 'boss'+String(id).charAt(0).toUpperCase()+String(id).slice(1)}
 function storageKey(id){return 'skyPuffBoss'+String(id).charAt(0).toUpperCase()+String(id).slice(1)}
 for(const b of late){try{save[key(b.id)]=localStorage.getItem(storageKey(b.id))==='1';}catch(e){save[key(b.id)]=!!save[key(b.id)];}}
 const oldPersist=window.persist;
 if(typeof oldPersist==='function')window.persist=function(){const out=oldPersist.apply(this,arguments);for(const b of late){try{localStorage.setItem(storageKey(b.id),save[key(b.id)]?'1':'0');}catch(e){}}return out;};
 window.PufflingBossPersistence={ids:late.map(x=>x.id),key,storageKey};
})();