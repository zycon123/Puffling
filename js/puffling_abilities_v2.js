/* Sky Puff — Puffling abilities v0.3 (level-scaled) */
(function(){
  let shadowReadyAt=0;
  const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
  const prog=()=>window.SkyPuffPufflingProgress;
  function lv(id){return prog()?.get?.(id)?.level||1}
  function t01(id){return Math.max(0,Math.min(1,(lv(id)-1)/19))}
  const oldBoost=window.doBoost;
  if(typeof oldBoost==='function')window.doBoost=function(){
    const beforeShots=typeof playerShots!=='undefined'?playerShots.length:0;
    const beforeBoost=typeof boost==='number'?boost:0;
    const r=oldBoost.apply(this,arguments);
    const id=active(),scale=t01(id);
    if(typeof playerShots!=='undefined'&&playerShots.length>beforeShots){
      const shot=playerShots[playerShots.length-1];
      if((id==='ember'||id==='thunderflame'||id==='eclipse')&&shot){
        const dmg=1.18+scale*.14; // 1.18 -> 1.32
        shot.damage*=dmg;
        shot.r*=1.08+scale*.06;
      }
      if((id==='volt'||id==='thunderflame'||id==='neonstorm')&&shot&&typeof player!=='undefined'){
        const sideDamage=.42+scale*.16; // .42 -> .58
        const spread=1.25+scale*.35;
        const sideR=Math.max(7,shot.r*(.72+scale*.06));
        playerShots.push({x:player.x-8,y:player.y-player.r-8,vx:-spread,vy:shot.vy*.94,r:sideR,life:100,damage:shot.damage*sideDamage});
        playerShots.push({x:player.x+8,y:player.y-player.r-8,vx:spread,vy:shot.vy*.94,r:sideR,life:100,damage:shot.damage*sideDamage});
      }
    }
    if((id==='shadow'||id==='eclipse')&&typeof performance!=='undefined'&&typeof invuln!=='undefined'&&typeof boost==='number'&&boost<beforeBoost){
      const now=performance.now();
      const cooldown=6500-scale*1600; // 6.5s -> 4.9s
      const phase=34+Math.round(scale*18); // 34 -> 52 frames-ish
      if(now>=shadowReadyAt){invuln=Math.max(invuln,phase);shadowReadyAt=now+cooldown;if(typeof showToast==='function')showToast(`Shadow Phase! 🌑 Lv.${lv(id)}`);}
    }
    return r;
  };
  window.SkyPuffPufflingAbilities={active,level:lv};
})();
