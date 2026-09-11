/* Puffling — dynamic Boss Rush unlocks for every defeated boss */
(function(){
 function saveKey(id){return 'boss'+id.charAt(0).toUpperCase()+id.slice(1)}
 function unlocked(id){try{return !!(save&&save[saveKey(id)])}catch(e){return false}}
 function wins(){try{return window.skyPuffBossRushProgress?.wins?.()||JSON.parse(localStorage.getItem('skyPuffBossRushWinsV1')||'{}')}catch(e){return {}}}
 function rewardFor(id){const E=window.PufflingRewardEconomy;return wins()[id]?(E?.REPLAY_RUSH_REWARD||25):(E?.FIRST_RUSH_REWARD||250)}
 function allStages(){
  const seen=new Set();
  return (typeof bossStages!=='undefined'?bossStages:[])
   .filter(s=>s&&s.id&&!String(s.id).startsWith('endless-'))
   .sort((a,b)=>(a.at||0)-(b.at||0))
   .filter(s=>{if(seen.has(s.id))return false;seen.add(s.id);return true;});
 }
 function render(){
  if(typeof bossRushListEl==='undefined'||!bossRushListEl)return;
  const t=typeof modeText==='function'?modeText():{reward:'Reward',locked:'Defeat a boss in the main game first to unlock it here.'};
  bossRushListEl.innerHTML='';let any=false;const w=wins();
  for(const stage of allStages()){
   if(!unlocked(stage.id))continue;any=true;
   const b=document.createElement('button');b.className='secondary';b.style.margin='6px';const reward=rewardFor(stage.id),label=w[stage.id]?'Replay':'First clear';
   b.innerHTML=`${stage.emoji||'👑'} ${stage.name||stage.id}<br><span style="font-size:12px">${label} • ${t.reward}: ${reward} 🪙</span>`;
   b.onclick=()=>typeof startBossRush==='function'&&startBossRush(stage);
   bossRushListEl.appendChild(b);
  }
  if(!any){const empty=document.createElement('div');empty.className='small';empty.textContent=t.locked;bossRushListEl.appendChild(empty);}
 }
 function open(){
  if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='none';
  if(typeof multiplayerHudEl!=='undefined'&&multiplayerHudEl)multiplayerHudEl.style.display='none';
  render();
  if(typeof bossRushMenuEl!=='undefined'&&bossRushMenuEl)bossRushMenuEl.style.display='flex';
 }
 window.renderBossRush=render;window.openBossRush=open;
 const btn=document.getElementById('bossRushBtn');if(btn)btn.onclick=open;
 window.PufflingBossRush={render,allStages,unlocked,open,rewardFor};
})();