/* Sky Puff — readable late boss patterns with guaranteed dodge windows v0.2 */
(function(){
 const old=window.bossAttackPattern;if(typeof old!=='function')return;
 const state={};
 const cfg={
  solar:{cool:1500},void:{cool:1650},thunder:{cool:1750},crystal:{cool:1850},inferno:{cool:1700},cosmic:{cool:1900}
 };
 function aimed(speed,r,type,off=0){fireAimedBossShot(speed,r,type,off)}
 function ready(id){const n=performance.now(),s=state[id]||(state[id]={next:0,step:0});if(n<s.next)return null;s.next=n+cfg[id].cool;s.step++;return s;}
 window.bossAttackPattern=function(){
  if(!boss)return;
  const id=boss.id;if(!cfg[id])return old();
  const s=ready(id);if(!s)return;
  // Design rule: no full-screen walls. Every volley leaves a wide lane and at least 1.5s before the next volley.
  if(id==='solar'){
   // Alternates left/right fans, deliberately leaving the opposite outer side open.
   const side=s.step%2?-1:1;[.06,.22,.38].forEach(o=>aimed(4.05,9,id,o*side));return;
  }
  if(id==='void'){
   // Three readable lanes with very wide gaps; center is omitted every other volley.
   if(s.step%2){aimed(4.35,10,id,-.48);aimed(4.35,10,id,.12);}else{aimed(4.35,10,id,-.12);aimed(4.35,10,id,.48);}return;
  }
  if(id==='thunder'){
   // Two-shot telegraphed-feeling sweep; delayed shot follows same side instead of cutting off escape.
   const side=s.step%2?-1:1;aimed(4.7,10,id,.18*side);setTimeout(()=>{if(running&&boss?.id===id)aimed(4.9,9,id,.38*side)},260);return;
  }
  if(id==='crystal'){
   // Slow three-projectile fan; generous outside lanes remain safe.
   [-.30,0,.30].forEach(o=>aimed(3.65,9,id,o));return;
  }
  if(id==='inferno'){
   // Alternating two-lane burst. Never fires a follow-up into the current escape side.
   const side=s.step%2?-1:1;aimed(4.55,11,id,.08*side);aimed(4.35,9,id,.34*side);return;
  }
  if(id==='cosmic'){
   // Final boss: 3-shot sweep, but one whole outer lane is always intentionally empty.
   const side=s.step%2?-1:1;[.02,.20,.38].forEach((o,i)=>aimed(4.25+(i===1?.15:0),9+(i===1?1:0),id,o*side));return;
  }
 };
 window.SkyPuffLateBossPatternSafety={minVolleyGap:1500,rule:'one-wide-safe-lane'};
})();
