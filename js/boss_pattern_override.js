// Boss 2 (Candy) and Boss 3 (Ice) use movement-forcing patterns so there is no permanent safe spot.
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

    if(boss.id==='candy'){
      // Boss 2: alternating fan + delayed crossing fan. Standing still gets covered.
      const speed=4.45+bonus;
      const base=aimedAngle(0,7);
      [-.34,-.17,0,.17,.34].forEach((off,i)=>fireBossShot(base+off,speed+(i===2?.15:0),10,'candy'));
      setTimeout(()=>{
        if(!running||!boss||boss.id!=='candy') return;
        const cross=aimedAngle(0,10);
        [-.48,-.24,.24,.48].forEach(off=>fireBossShot(cross+off,speed+.2,10,'candy'));
      },220);
      return;
    }

    if(boss.id==='ice'){
      // Boss 3: predictive center shot plus a wide sweeping gate that alternates sides.
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
      return;
    }

    return originalBossAttackPattern();
  };
})();