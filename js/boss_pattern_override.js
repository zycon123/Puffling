// Boss 2+ use movement-forcing patterns so there is no permanent safe spot. Boss 1 (Storm) stays unchanged.
(function(){
  if(typeof bossAttackPattern!=='function') return;
  const originalBossAttackPattern=bossAttackPattern;

  function aimedAngle(offset=0,predict=0){
    const tx=player.x+(player.vx||0)*predict;
    const dx=tx-boss.x,dy=player.y-boss.y;
    return Math.atan2(dy,dx)+offset;
  }

  bossAttackPattern=function(){
    if(!boss) return;
    const tier=Math.max(1,boss.tier||1);
    const bonus=Math.min(.9,(tier-1)*.08);

    // Boss 1 must keep its original pattern exactly as before.
    if(boss.id==='storm') return originalBossAttackPattern();

    if(boss.id==='candy'){
      boss.patternStep=(boss.patternStep||0)+1;
      const speed=4.45+bonus;
      const base=aimedAngle(0,7);
      [-.34,-.17,0,.17,.34].forEach((off,i)=>fireBossShot(base+off,speed+(i===2?.15:0),10,'candy'));
      setTimeout(()=>{
        if(!running||!boss||boss.id!=='candy') return;
        const cross=aimedAngle(0,10);
        const shift=boss.patternStep%2===0?.10:-.10;
        [-.48,-.24,.24,.48].forEach(off=>fireBossShot(cross+off+shift,speed+.2,10,'candy'));
      },220);
      if(tier>=3){
        setTimeout(()=>{
          if(!running||!boss||boss.id!=='candy') return;
          fireBossShot(aimedAngle(0,14),speed+.45,11,'candy');
        },390);
      }
      return;
    }

    if(boss.id==='ice'){
      boss.patternStep=(boss.patternStep||0)+1;
      const speed=4.0+bonus*.7;
      const lead=aimedAngle(0,11);
      fireBossShot(lead,speed+.25,14,'ice');
      const dir=boss.patternStep%2===0?1:-1;
      const sweepBase=aimedAngle(dir*.16,4);
      [-.52,-.30,-.08,.14,.36].forEach((off,i)=>fireBossShot(sweepBase+off*dir,speed-(i%2)*.12,11,'ice'));
      if(tier>=2){
        setTimeout(()=>{
          if(!running||!boss||boss.id!=='ice') return;
          const late=aimedAngle(0,13);
          fireBossShot(late-.20,speed+.2,12,'ice');
          fireBossShot(late+.20,speed+.2,12,'ice');
        },180);
      }
      if(tier>=4){
        setTimeout(()=>{
          if(!running||!boss||boss.id!=='ice') return;
          const late=aimedAngle(0,16);
          fireBossShot(late,speed+.45,13,'ice');
        },360);
      }
      return;
    }

    if(boss.id==='galaxy'){
      // Boss 4+: alternating wall/sweep patterns plus a delayed predictive shot.
      boss.patternStep=(boss.patternStep||0)+1;
      const speed=5.15+bonus;
      const dir=boss.patternStep%2===0?1:-1;
      const base=aimedAngle(dir*.12,6);

      if(boss.patternStep%3===0){
        // Wide moving wall with one shifting lane; staying still is unsafe across cycles.
        [-.62,-.40,-.18,.18,.40,.62].forEach((off,i)=>{
          const laneShift=dir*.06*(i%2?1:-1);
          fireBossShot(base+off+laneShift,speed-(i%3)*.10,10,'galaxy');
        });
      }else{
        // Curved crossfire centered ahead of the player's movement.
        [-.46,-.23,0,.23,.46].forEach((off,i)=>fireBossShot(base+off*dir,speed+(i===2?.28:0),11,'galaxy'));
      }

      setTimeout(()=>{
        if(!running||!boss||boss.id!=='galaxy') return;
        const lead=aimedAngle(0,15);
        fireBossShot(lead,speed+.5,12,'galaxy');
        if(tier>=2){
          fireBossShot(lead-.18,speed+.25,10,'galaxy');
          fireBossShot(lead+.18,speed+.25,10,'galaxy');
        }
      },190);

      if(tier>=3){
        setTimeout(()=>{
          if(!running||!boss||boss.id!=='galaxy') return;
          const sweep=aimedAngle(dir*.22,8);
          [-.28,0,.28].forEach(off=>fireBossShot(sweep+off,speed+.15,10,'galaxy'));
        },370);
      }
      return;
    }

    return originalBossAttackPattern();
  };
})();