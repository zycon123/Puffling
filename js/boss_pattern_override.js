// Boss attack loop: 3 normal attacks, 1 alternate pattern, 2 normal attacks,
// 1 alternate pattern, then repeat. Projectile visuals still match each boss.
(function(){
  if(typeof bossAttackPattern!=='function') return;

  function normalAttack(speed,type,tier){
    fireAimedBossShot(speed,11,type,-.16);
    fireAimedBossShot(speed,11,type,.16);
    if(tier>=3)fireAimedBossShot(speed+.2,10,type,0);
  }

  function alternateAttack(speed,type,variant){
    if(variant%2===0){
      // Wide three-lane fan: exactly 3 projectiles with a dodgeable gap.
      fireAimedBossShot(speed*.96,10,type,-.34);
      fireAimedBossShot(speed+.1,11,type,0);
      fireAimedBossShot(speed*.96,10,type,.34);
      return;
    }

    // Staggered three-shot crossfire: 2 first, then 1 delayed center shot.
    fireAimedBossShot(speed+.15,10,type,-.18);
    fireAimedBossShot(speed+.15,10,type,.18);
    setTimeout(()=>{
      if(!running||!boss)return;
      const currentType=boss.id||type;
      fireAimedBossShot(speed+.3,11,currentType,0);
    },180);
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