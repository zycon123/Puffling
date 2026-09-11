const ENDLESS_BOSS_GAP=1500;
const ENDLESS_BOSS_HP_CAP=1440;
function getEndlessBossStage(height){
 const baseStages=[
  {id:'storm',name:'Storm Boss',emoji:'🌩️',at:1200},
  {id:'candy',name:'Candy Dragon',emoji:'🐉',at:2000},
  {id:'ice',name:'Ice Titan',emoji:'❄️',at:3000},
  {id:'galaxy',name:'Galaxy King',emoji:'🌌',at:4500}
 ];
 if(height<baseStages[0].at)return null;
 for(let i=baseStages.length-1;i>=0;i--){
  if(height>=baseStages[i].at&&height<(i===baseStages.length-1?baseStages[i].at+ENDLESS_BOSS_GAP:baseStages[i+1].at)){
   return {...baseStages[i],tier:1,at:baseStages[i].at};
  }
 }
 // Tier 2 starts exactly one ENDLESS_BOSS_GAP after the final fixed base boss.
 // Keep the current stage active until the next threshold so nextBossStage() can
 // actually trigger it when score reaches stage.at.
 const firstRepeatAt=baseStages[baseStages.length-1].at+ENDLESS_BOSS_GAP;
 const cycle=Math.max(0,Math.floor((height-firstRepeatAt)/ENDLESS_BOSS_GAP));
 const idx=cycle%baseStages.length;
 const tier=2+Math.floor(cycle/baseStages.length);
 const at=firstRepeatAt+cycle*ENDLESS_BOSS_GAP;
 const b=baseStages[idx];
 return {...b,tier,at,name:`${b.name} ${tier}`};
}
function endlessBossHealth(stage){
 const scaled=Math.round(5*Math.pow(1.22,Math.max(0,(stage.tier||1)-1)))*24;
 return Math.min(ENDLESS_BOSS_HP_CAP,scaled)/24;
}
function endlessBossReward(stage){return Math.round(150*Math.pow(1.18,Math.max(0,(stage.tier||1)-1)));}
