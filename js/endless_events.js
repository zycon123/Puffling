(function(){
 const originalUpdate=update;
 let coinStormTick=0;
 const banner=document.createElement('div');
 banner.id='endlessEventBanner';
 banner.style.cssText='display:none;position:fixed;left:50%;top:130px;transform:translateX(-50%);z-index:7;pointer-events:none;background:rgba(20,30,60,.82);color:#fff;border:2px solid rgba(255,255,255,.55);border-radius:18px;padding:10px 16px;font:1000 16px Arial;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.22);backdrop-filter:blur(6px)';
 document.body.appendChild(banner);
 const defs={coinStorm:{name:'COIN STORM',icon:'🪙🌪️',duration:620},lowGravity:{name:'LOW GRAVITY',icon:'🌙☁️',duration:660},rainbowFrenzy:{name:'RAINBOW FRENZY',icon:'🌈⚡',duration:560}};
 function startEvent(id){const d=defs[id];if(!d)return;endlessEvent=id;endlessEventTime=d.duration;coinStormTick=0;banner.textContent=`${d.icon} ${d.name}`;banner.style.display='block';if(id==='rainbowFrenzy'){boost=100;rainbowOvercharge=Math.max(rainbowOvercharge,d.duration);}showToast(`${d.name}! ${d.icon}`);}
 function stopEvent(completed=false){if(completed&&endlessEvent&&window.skyPuffAchievements)window.skyPuffAchievements.eventCleared();endlessEvent=null;endlessEventTime=0;coinStormTick=0;banner.style.display='none';}
 function maybeStart(){if(score<4500||boss||bossWarningActive||bossArena||endlessEvent||score<nextEndlessEventAt)return;const ids=['coinStorm','lowGravity','rainbowFrenzy'];startEvent(ids[Math.floor(Math.random()*ids.length)]);nextEndlessEventAt=score+900+Math.floor(Math.random()*700);}
 update=function(dt){const wasVy=player&&player.vy;originalUpdate(dt);if(!running){stopEvent(false);return;}maybeStart();if(!endlessEvent)return;if(boss||bossWarningActive||bossArena){stopEvent(false);nextEndlessEventAt=Math.max(nextEndlessEventAt,score+700);return;}const s=Math.min(dt/16.67,1.6);endlessEventTime-=s;if(endlessEvent==='lowGravity'&&player&&Number.isFinite(player.vy)&&Number.isFinite(wasVy))player.vy-=.20*s;if(endlessEvent==='coinStorm'){coinStormTick+=s;if(coinStormTick>18){coinStormTick=0;coinItems.push({x:28+Math.random()*(W-56),y:cameraY-40-Math.random()*110,r:10,taken:false,spin:Math.random()*6});}}if(endlessEvent==='rainbowFrenzy'){boost=Math.min(100,boost+.28*s);rainbowOvercharge=Math.max(rainbowOvercharge,12);boostEl.style.width=boost+'%';}banner.style.opacity=String(Math.max(.45,Math.min(1,endlessEventTime/80)));if(endlessEventTime<=0){showToast('Event ferdig! ✨');stopEvent(true);}};
 window.skyPuffEndlessEvents={start:startEvent,stop:()=>stopEvent(false),get active(){return endlessEvent;}};
})();
