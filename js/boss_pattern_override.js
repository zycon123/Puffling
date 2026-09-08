// Boss attack loop: 3 normal attacks, 1 alternate pattern, 2 normal attacks,
// 1 alternate pattern, then repeat. Alternate patterns always fire exactly 3 projectiles.
(function(){
  if(typeof bossAttackPattern!=='function') return;

  function normalAttack(speed,type,tier){
    fireAimedBossShot(speed,11,type,-.16);
    fireAimedBossShot(speed,11,type,.16);
    if(tier>=3)fireAimedBossShot(speed+.2,10,type,0);
  }

  function alternateAttack(speed,type,variant){
    if(variant%2===1){
      // Alternate A: wide three-lane fan, exactly 3 simultaneous projectiles.
      fireAimedBossShot(speed*.96,10,type,-.32);
      fireAimedBossShot(speed+.08,11,type,0);
      fireAimedBossShot(speed*.96,10,type,.32);
      return;
    }

    // Alternate B: tighter three-lane fan, exactly 3 simultaneous projectiles.
    fireAimedBossShot(speed+.12,10,type,-.20);
    fireAimedBossShot(speed+.18,11,type,0);
    fireAimedBossShot(speed+.12,10,type,.20);
  }

  bossAttackPattern=function(){
    if(!boss)return;
    const tier=Math.max(1,boss.tier||1);
    const bonus=Math.min(.9,(tier-1)*.08);
    const speed=4.7+bonus;
    const type=boss.id||'storm';

    boss.patternShotCount=(boss.patternShotCount||0)+1;
    const step=(boss.patternShotCount-1)%7;

    // Sequence: N N N A N N A -> repeat.
    if(step===3||step===6){
      boss.altPatternCount=(boss.altPatternCount||0)+1;
      alternateAttack(speed,type,boss.altPatternCount);
    }else{
      normalAttack(speed,type,tier);
    }
  };
})();