// All bosses use the same shooting pattern as Boss 1 (Storm).
// Projectile visuals still match the active boss.
(function(){
  if(typeof bossAttackPattern!=='function') return;

  bossAttackPattern=function(){
    if(!boss) return;
    const tier=Math.max(1,boss.tier||1);
    const bonus=Math.min(.9,(tier-1)*.08);
    const speed=4.7+bonus;
    const type=boss.id||'storm';

    fireAimedBossShot(speed,11,type,-.16);
    fireAimedBossShot(speed,11,type,.16);
    if(tier>=3) fireAimedBossShot(speed+.2,10,type,0);
  };
})();