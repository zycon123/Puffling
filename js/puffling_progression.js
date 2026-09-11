/* Sky Puff — Puffling XP + Levels v0.3 */
(function(){
 const KEY='skyPuffPufflingProgressV1';
 const MAX_LEVEL=20;
 let lastScore=0,heightRemainder=0,lastActive='',lastBossSeen=null;
 function normalize(raw){const out={};if(!raw||typeof raw!=='object')return out;for(const [id,value] of Object.entries(raw)){if(!value||typeof value!=='object')continue;let level=Math.max(1,Math.min(MAX_LEVEL,Math.floor(Number(value.level)||1))),xp=Math.max(0,Math.floor(Number(value.xp)||0));while(level<MAX_LEVEL&&xp>=xpNeed(level)){xp-=xpNeed(level);level++;}if(level>=MAX_LEVEL)xp=0;out[id]={level,xp};}return out;}
 function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return {}}}
 function saveData(d){localStorage.setItem(KEY,JSON.stringify(d))}
 function xpNeed(level){return Math.floor(80+level*35+level*level*8)}
 function get(id){const d=load();const row=d[id]||{level:1,xp:0};return {...row,next:row.level>=MAX_LEVEL?0:xpNeed(row.level)}}
 function addXp(id,amount){if(!id||amount<=0)return get(id);const d=load(),row=d[id]||{level:1,xp:0};row.xp+=Math.floor(amount);let leveled=false;while(row.level<MAX_LEVEL&&row.xp>=xpNeed(row.level)){row.xp-=xpNeed(row.level);row.level++;leveled=true;}if(row.level>=MAX_LEVEL)row.xp=0;d[id]=row;saveData(d);if(leveled&&typeof showToast==='function'){const p=window.SkyPuffPufflingGameplay?.getPuff?.(id);showToast(`${p?.icon||'☁️'} ${p?.name||'Puffling'} nådde level ${row.level}!`);}window.SkyPuffFusionUI?.renderDex?.();return {...row,next:row.level>=MAX_LEVEL?0:xpNeed(row.level)}}
 function reset(id){if(!id)return {level:1,xp:0,next:xpNeed(1)};const d=load();delete d[id];saveData(d);window.SkyPuffFusionUI?.renderDex?.();return get(id);}
 function multiplier(id){const g=get(id);return 1+Math.min(.20,(g.level-1)*.01)}
 function active(){return window.SkyPuffPufflingGameplay?.active?.()||''}
 function tick(){
  try{
   const isRunning=typeof running!=='undefined'&&running;
   if(isRunning&&typeof score==='number'){
    const id=active(),delta=Math.max(0,score-lastScore);if(id!==lastActive)heightRemainder=0;lastActive=id;if(id){heightRemainder+=delta;const gain=Math.floor(heightRemainder/25);if(gain>0){addXp(id,gain);heightRemainder-=gain*25;}}else heightRemainder=0;lastScore=score;
   }else{lastScore=0;heightRemainder=0;lastActive='';}
   if(typeof boss!=='undefined'){
    if(boss&&isRunning)lastBossSeen={id:boss.id,tier:boss.tier||1};
    else if(lastBossSeen){
      if(isRunning&&typeof bossDefeated!=='undefined'&&bossDefeated){const id=active();if(id)addXp(id,35);}
      lastBossSeen=null;
    }
   }
  }catch(e){}
  requestAnimationFrame(tick)
 }
 requestAnimationFrame(tick);
 window.SkyPuffPufflingProgress={get,addXp,reset,multiplier,xpNeed,maxLevel:MAX_LEVEL,normalize};
})();