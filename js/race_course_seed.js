/* Puffling — deterministic Race course generator v1.0 */
(function(){
  let enabled=false,seedText='',seed=0,nextIndex=0,nextY=0;
  function hash(text){let h=2166136261;for(const ch of String(text||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function unit(index,salt){
    let x=(seed^Math.imul((index+1)>>>0,0x9e3779b1)^Math.imul((salt+1)>>>0,0x85ebca6b))>>>0;
    x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);x^=x>>>16;
    return (x>>>0)/4294967296;
  }
  function activate(value){seedText=String(value||'');seed=hash(seedText||'puffling-race');enabled=!!seedText;nextIndex=0;nextY=0;return snapshot();}
  function deactivate(){enabled=false;seedText='';seed=0;nextIndex=0;nextY=0;}
  function begin(startY){nextIndex=0;nextY=Number(startY)||0;return snapshot();}
  function isActive(){return enabled;}
  function gapFor(index){return 70+unit(index,0)*36;}
  function peekNextY(){return nextY-gapFor(nextIndex);}
  function nextPlatform(width){
    const index=nextIndex++,y=nextY-gapFor(index);nextY=y;
    const W=Math.max(180,Number(width)||390),w=70+unit(index,1)*55,x=12+unit(index,2)*Math.max(1,W-w-24);
    const normalPower=unit(index,7)<.12,rarePower=unit(index,9)<.035;
    const powerTypes=['shield','magnet','mega'],rareTypes=['coinRush','superShield','overcharge'];
    return {
      courseIndex:index,y,w,x,phase:unit(index,3)*6.28,
      move:false,breakable:unit(index,4)<.11,
      coin:unit(index,5)<.6,coinSpin:unit(index,6)*6,
      powerup:normalPower?powerTypes[Math.floor(unit(index,8)*powerTypes.length)]:null,
      rarePowerup:rarePower?rareTypes[Math.floor(unit(index,10)*rareTypes.length)]:null,
      enemy:(index%3===0&&unit(index,11)<.255),enemyX:30+unit(index,12)*Math.max(1,W-60),
      enemyDirection:unit(index,13)<.5?-1:1,enemySpeed:.9+unit(index,14)*.9,enemyPhase:unit(index,15)*6.28
    };
  }
  function snapshot(){return{active:enabled,courseSeed:seedText,nextIndex,nextY,version:1};}
  window.SkyPuffRaceCourse={activate,deactivate,begin,isActive,gapFor,peekNextY,nextPlatform,snapshot,version:1};
})();
