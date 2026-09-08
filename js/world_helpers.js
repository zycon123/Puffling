let lastBossTriggerAt=0;
let nextLifePickupAt=500;
function addPlatform(y){
 const w=70+Math.random()*55,x=12+Math.random()*(W-w-24);
 platforms.push({x,y,w,h:16,phase:Math.random()*6.28,move:Math.random()<.24,breakable:Math.random()<.11,used:false});
 if(Math.random()<.6)coinItems.push({x:x+w/2,y:y-30,r:10,taken:false,spin:Math.random()*6});
 if(Math.random()<.12)powerups.push({x:x+w/2,y:y-43,type:['shield','magnet','mega'][Math.floor(Math.random()*3)],taken:false});
 if(Math.random()<.035){const rare=['coinRush','superShield','overcharge'][Math.floor(Math.random()*3)];powerups.push({x:x+w/2,y:y-58,type:rare,taken:false,rare:true});}
 if(Math.random()<.11)enemies.push({x:Math.random()*(W-60)+30,y:y-90,vx:(Math.random()<.5?-1:1)*(1+Math.random()*1.1),phase:Math.random()*6.28,r:18});
}
function setMission(){missionIndex=Math.floor(Math.random()*missions.length);const m=missions[missionIndex];missionEl.textContent=tr('mission')+': '+missionText(m);missionDone=false;}
