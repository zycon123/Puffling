// Increase Rainbow Puff recharge during boss fights without changing normal gameplay.
(function(){
  if(typeof update!=='function')return;
  const originalUpdate=update;
  update=function(dt){
    const wasBossFight=!!(bossArena&&boss&&running);
    originalUpdate(dt);
    if(!wasBossFight||!running)return;
    const s=Math.min(dt/16.67,1.6);
    // Base gameplay already adds 0.105 per frame-step in boss fights.
    // Add 0.21 more for roughly 3x the original boss recharge rate.
    boost=Math.min(100,boost+0.21*s);
    if(boostEl)boostEl.style.width=boost+'%';
  };
})();