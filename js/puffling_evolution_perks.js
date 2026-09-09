/* Sky Puff — Evolution perks v0.1 */
(function(){
 const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
 const stage=id=>window.SkyPuffPufflingEvolution?.stageFor?.(id)||0;
 let emberBurstReady=0,voltChainReady=0,frostWardReady=0,prismSurgeReady=0,shadowVeilReady=0,windLiftReady=0;
 function now(){return performance.now()}
 function toast(s){if(typeof showToast==='function')showToast(s)}
 function tick(){
  try{
   const id=active(),st=stage(id),t=now();if(!id||st<=0){requestAnimationFrame(tick);return;}
   if(typeof running==='undefined'||!running){requestAnimationFrame(tick);return;}
   if(id==='prism'&&typeof boost==='number'&&st>=1&&t>=prismSurgeReady){boost=Math.min(100,boost+(st>=2?12:7));prismSurgeReady=t+(st>=2?9000:12000);toast(st>=2?'Ascended Prism Surge! 🌈👑':'Prism Surge! 🌈');}
   if(id==='wind'&&typeof player!=='undefined'&&player&&st>=1&&player.vy>4&&t>=windLiftReady){player.vy-=st>=2?4.2:2.6;windLiftReady=t+(st>=2?6500:9000);toast(st>=2?'Ascended Tailwind! 💨👑':'Tailwind! 💨');}
   if(id==='frost'&&typeof invuln!=='undefined'&&st>=2&&t>=frostWardReady&&typeof player!=='undefined'&&player&&typeof H!=='undefined'&&player.y>H-110&&player.vy>3){invuln=Math.max(invuln,55);player.vy=-7.5;frostWardReady=t+15000;toast('Ascended Frost Ward! ❄️👑');}
  }catch(e){}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 const oldBoost=window.doBoost;
 if(typeof oldBoost==='function')window.doBoost=function(){
  const id=active(),st=stage(id),before=typeof playerShots!=='undefined'?playerShots.length:0,r=oldBoost.apply(this,arguments),t=now();
  try{
   if(st>=1&&typeof playerShots!=='undefined'&&playerShots.length>before){const shot=playerShots[playerShots.length-1];
    if(id==='ember'&&t>=emberBurstReady&&shot){shot.damage*=st>=2?1.35:1.18;shot.r*=st>=2?1.18:1.08;emberBurstReady=t+(st>=2?5200:7600);toast(st>=2?'ASCENDED FLARE! 🔥👑':'Flare Burst! 🔥');}
    if(id==='volt'&&t>=voltChainReady&&shot&&typeof player!=='undefined'){const dmg=shot.damage*(st>=2?.34:.22);playerShots.push({x:player.x-14,y:player.y-player.r-4,vx:-2.2,vy:shot.vy*.9,r:7,life:85,damage:dmg});playerShots.push({x:player.x+14,y:player.y-player.r-4,vx:2.2,vy:shot.vy*.9,r:7,life:85,damage:dmg});voltChainReady=t+(st>=2?4800:7000);toast(st>=2?'ASCENDED ARC! ⚡👑':'Chain Spark! ⚡');}
   }
   if(id==='shadow'&&st>=1&&typeof invuln!=='undefined'&&t>=shadowVeilReady){invuln=Math.max(invuln,st>=2?48:28);shadowVeilReady=t+(st>=2?5500:8000);toast(st>=2?'ASCENDED VEIL! 🌑👑':'Shadow Veil! 🌑');}
  }catch(e){}
  return r;
 };
 window.SkyPuffEvolutionPerks={active,stage};
})();
