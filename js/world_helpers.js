let lastBossTriggerAt=0;
let nextLifePickupAt=500;
function addPlatform(y,courseSpec=null){
 const course=window.SkyPuffRaceCourse;
 if(!courseSpec&&course?.isActive?.())courseSpec=course.nextPlatform(W);
 if(courseSpec){
  const p=courseSpec,x=p.x,w=p.w;y=p.y;
  platforms.push({x,y,w,h:16,phase:p.phase||0,move:!!p.move,breakable:!!p.breakable,used:false,courseIndex:p.courseIndex,baseX:x});
  if(p.coin)coinItems.push({x:x+w/2,y:y-30,r:10,taken:false,spin:p.coinSpin||0});
  if(p.powerup)powerups.push({x:x+w/2,y:y-43,type:p.powerup,taken:false});
  if(p.rarePowerup)powerups.push({x:x+w/2,y:y-58,type:p.rarePowerup,taken:false,rare:true});
  if(p.enemy)enemies.push({x:p.enemyX,y:y-90,vx:p.enemyDirection*p.enemySpeed,phase:p.enemyPhase,r:18,courseIndex:p.courseIndex});
  return;
 }
 const w=70+Math.random()*55,x=12+Math.random()*(W-w-24);
 platforms.push({x,y,w,h:16,phase:Math.random()*6.28,move:Math.random()<.24,breakable:Math.random()<.11,used:false});
 if(Math.random()<.6)coinItems.push({x:x+w/2,y:y-30,r:10,taken:false,spin:Math.random()*6});
 if(Math.random()<.12)powerups.push({x:x+w/2,y:y-43,type:['shield','magnet','mega'][Math.floor(Math.random()*3)],taken:false});
 if(Math.random()<.035){const rare=['coinRush','superShield','overcharge'][Math.floor(Math.random()*3)];powerups.push({x:x+w/2,y:y-58,type:rare,taken:false,rare:true});}
 // Slightly fewer enemies, with enough vertical separation to keep a fair route through the level.
 if(Math.random()<.085){
  const enemyY=y-90,minGap=145;
  const tooClose=enemies.some(e=>Math.abs(e.y-enemyY)<minGap);
  if(!tooClose)enemies.push({x:Math.random()*(W-60)+30,y:enemyY,vx:(Math.random()<.5?-1:1)*(.9+Math.random()*.9),phase:Math.random()*6.28,r:18});
 }
}
function setMission(){missionIndex=Math.floor(Math.random()*missions.length);const m=missions[missionIndex];missionEl.textContent=tr('mission')+': '+missionText(m);missionDone=false;}
