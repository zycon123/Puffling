/* Sky Puff — lightweight unique late boss attack patterns v0.1 */
(function(){
 const old=window.bossAttackPattern;if(typeof old!=='function')return;
 function aimed(speed,r,type,off=0){fireAimedBossShot(speed,r,type,off)}
 window.bossAttackPattern=function(){
  if(!boss)return;
  const id=boss.id,t=Math.max(1,boss.tier||1);
  if(id==='solar'){[-.38,-.19,0,.19,.38].forEach(o=>aimed(4.25,9,'solar',o));return;}
  if(id==='void'){aimed(5.0,12,'void',0);aimed(4.25,10,'void',-.55);aimed(4.25,10,'void',.55);return;}
  if(id==='thunder'){[-.28,.28].forEach(o=>aimed(5.55,11,'thunder',o));setTimeout(()=>{if(running&&boss?.id==='thunder')aimed(6.0,10,'thunder',0)},130);return;}
  if(id==='crystal'){[-.6,-.3,0,.3,.6].forEach((o,i)=>aimed(3.9+(i%2)*.35,10,'crystal',o));return;}
  if(id==='inferno'){aimed(5.3,13,'inferno',0);aimed(4.8,11,'inferno',-.32);aimed(4.8,11,'inferno',.32);setTimeout(()=>{if(running&&boss?.id==='inferno')aimed(5.6,10,'inferno',Math.random()*.28-.14)},110);return;}
  if(id==='cosmic'){const phase=(performance.now()/700)%1;[-.48,-.24,0,.24,.48].forEach((o,i)=>aimed(4.8+(i===2?.6:0),10+(i===2?2:0),'cosmic',o+(phase-.5)*.16));return;}
  return old();
 };
})();
