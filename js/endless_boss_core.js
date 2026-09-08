const ENDLESS_BOSS_GAP=1500;
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
 const beyond=Math.max(0,height-baseStages[baseStages.length-1].at);
 const cycle=Math.floor(beyond/ENDLESS_BOSS_GAP);
 const idx=cycle%baseStages.length;
 const tier=2+Math.floor(cycle/baseStages.length);
 const at=baseStages[baseStages.length-1].at+(cycle+1)*ENDLESS_BOSS_GAP;
 const b=baseStages[idx];
 return {...b,tier,at,name:`${b.name} ${tier}`};
}
function endlessBossHealth(stage){return Math.round(5*Math.pow(1.22,Math.max(0,(stage.tier||1)-1)));}
function endlessBossReward(stage){return Math.round(150*Math.pow(1.18,Math.max(0,(stage.tier||1)-1)));}
