// Keep bosses inside the arena so reversing direction can never leave them stuck off-screen.
(function(){
  if(typeof update!=='function') return;
  const originalUpdate=update;
  update=function(dt){
    originalUpdate(dt);
    if(!boss) return;
    const minX=55,maxX=W-55;
    if(boss.x<minX){boss.x=minX;boss.dir=Math.abs(boss.dir||1);}
    else if(boss.x>maxX){boss.x=maxX;boss.dir=-Math.abs(boss.dir||1);}
    if(!Number.isFinite(boss.dir)||boss.dir===0) boss.dir=Math.random()<.5?-1:1;
  };
})();