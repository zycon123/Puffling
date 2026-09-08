(function(){
 function card(title,icon,done,progress,reward){
  const status=done?'FULLFØRT ✅':'LÅST 🔒';
  return `<div style="background:rgba(255,255,255,.82);border:2px solid ${done?'rgba(255,200,55,.8)':'rgba(90,140,190,.18)'};border-radius:16px;padding:12px 14px;box-shadow:0 6px 18px rgba(40,90,130,.10)"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><strong style="font-size:17px;color:#35516b">${icon} ${title}</strong><span style="font-size:12px;font-weight:1000;color:${done?'#cc8c00':'#6c7d8e'}">${status}</span></div><div style="font-size:13px;font-weight:800;color:#5b6f82;margin-top:6px">${progress}</div><div style="font-size:12px;font-weight:900;color:#8b6b22;margin-top:5px">Reward: ${reward}</div></div>`;
 }
 function render(){
  if(!achievementsListEl||!achievementsSummaryEl)return;
  const doneCount=[save.achSkyLegend,save.achEventMaster,save.achBossHunter].filter(Boolean).length;
  achievementsSummaryEl.textContent=`${doneCount}/3 achievements fullført`;
  const h=Math.min(10000,Math.max(save.best||0,score||0));
  const events=Math.min(5,save.eventsCleared||0);
  achievementsListEl.innerHTML=
   card('SKY LEGEND','☁️🏆',!!save.achSkyLegend,`${h.toLocaleString()} / 10 000 m i én run`,'1000 🪙 + Sky Legend Halo ✨')+
   card('EVENT MASTER','🌪️🏅',!!save.achEventMaster,`${events} / 5 endless-events fullført`,'750 🪙 + Event Crown 🌪️')+
   card('BOSS HUNTER','👑⚔️',!!save.achBossHunter,save.achBossHunter?'Tier 3+ boss beseiret':'Beseir en Tier 3+ boss','1250 🪙 + Boss Hunter Helm 👑');
 }
 function open(){render();startEl.style.display='none';achievementsMenuEl.style.display='flex';}
 function close(){achievementsMenuEl.style.display='none';startEl.style.display='flex';}
 if(achievementsBtnEl)achievementsBtnEl.onclick=open;
 if(closeAchievementsEl)closeAchievementsEl.onclick=close;
 window.skyPuffAchievementsMenu={open,close,render};
})();