/* Puffling — core save integrity guard v1.0 */
(function(){
  const repaired=[];
  function repairNumber(key,{integer=true,min=0,max=1e12,fallback=0}={}){
    const before=save[key];let n=Number(before);
    if(!Number.isFinite(n))n=fallback;
    if(integer)n=Math.floor(n);
    n=Math.max(min,Math.min(max,n));
    if(before!==n){save[key]=n;repaired.push(key);}
  }
  for(const key of ['bank','best','total','upBoost','upHealth','upCoin','upMagnet','lastDaily','streak','eventsCleared','bossWins','treasuresCollected'])repairNumber(key);
  const catalogs=[
    ['skin',typeof skins!=='undefined'?skins:null,'classic'],
    ['face',typeof faceStyles!=='undefined'?faceStyles:null,'smile'],
    ['hat',typeof hats!=='undefined'?hats:null,'none'],
    ['trail',typeof trailStyles!=='undefined'?trailStyles:null,'auto']
  ];
  for(const [key,catalog,fallback] of catalogs){
    const value=String(save[key]||'');
    if(!catalog||!Object.prototype.hasOwnProperty.call(catalog,value)){save[key]=fallback;repaired.push(key);}
  }
  const cleanName=String(save.playerName||'').replace(/[^\p{L}\p{N} _.-]/gu,'').slice(0,16);
  if(save.playerName!==cleanName){save.playerName=cleanName;repaired.push('playerName');}
  if(repaired.length){try{persist();}catch(e){console.warn('[Puffling SaveIntegrity] Could not persist repair',e);}}
  window.PufflingSaveIntegrity={ok:true,repaired:[...new Set(repaired)],version:1};
})();
