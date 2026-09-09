/* Sky Puff — Puffling abilities v0.2 */
(function(){
  let shadowReadyAt=0;
  const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
  const oldBoost=window.doBoost;
  if(typeof oldBoost==='function')window.doBoost=function(){
    const beforeShots=typeof playerShots!=='undefined'?playerShots.length:0;
    const beforeBoost=typeof boost==='number'?boost:0;
    const r=oldBoost.apply(this,arguments);
    const id=active();
    if(typeof playerShots!=='undefined'&&playerShots.length>beforeShots){
      const shot=playerShots[playerShots.length-1];
      if((id==='ember'||id==='thunderflame'||id==='eclipse')&&shot){shot.damage*=1.18;shot.r*=1.08;}
      if((id==='volt'||id==='thunderflame'||id==='neonstorm')&&shot&&typeof player!=='undefined'){
        playerShots.push({x:player.x-8,y:player.y-player.r-8,vx:-1.25,vy:shot.vy*.94,r:Math.max(7,shot.r*.72),life:100,damage:shot.damage*.42});
        playerShots.push({x:player.x+8,y:player.y-player.r-8,vx:1.25,vy:shot.vy*.94,r:Math.max(7,shot.r*.72),life:100,damage:shot.damage*.42});
      }
    }
    if((id==='shadow'||id==='eclipse')&&typeof performance!=='undefined'&&typeof invuln!=='undefined'&&typeof boost==='number'&&boost<beforeBoost){
      const now=performance.now();if(now>=shadowReadyAt){invuln=Math.max(invuln,34);shadowReadyAt=now+6500;if(typeof showToast==='function')showToast('Shadow Phase! 🌑');}
    }
    return r;
  };
  window.SkyPuffPufflingAbilities={active};
})();
