/* Sky Puff — Puffling XP + Levels v0.1 */
(function(){
 const KEY='skyPuffPufflingProgressV1';
 const MAX_LEVEL=20;
 let lastScore=0,lastBossSeen=null;
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}}
 function saveData(d){localStorage.setItem(KEY,JSON.stringify(d))}
 function xpNeed(level){return Math.floor(80+level*35+level*level*8)}
 function get(id){const d=load();const row=d[id]||{level:1,xp:0};return {...row,next:row.level>=MAX_LEVEL?0:xpNeed(row.level)}}
 function addXp(id,amount){if(!id||amount<=0)return get(id);const d=load(),row=d[id]||{level:1,xp:0};row.xp+=Math.floor(amount);let leveled=false;while(row.level<MAX_LEVEL&&row.xp>=xpNeed(row.level)){row.xp-=xpNeed(row.level);row.level++;leveled=true;}if(row.level>=MAX_LEVEL)row.xp=0;d[id]=row;saveData(d);if(leveled&&typeof showToast==='function'){const p=window.SkyPuffPufflingGameplay?.getPuff?.(id);showToast(`${p?.icon||'☁️'} ${p?.name||'Puffling'} nådde level ${row.level}!`);}window.SkyPuffFusionUI?.renderDex?.();return {...row,next:row.level>=MAX_LEVEL?0:xpNeed(row.level)}}
 function multiplier(id){const g=get(id);return 1+Math.min(.20,(g.level-1)*.01)}
 function active(){return window.SkyPuffPufflingGameplay?.active?.()||''}
 function tick(){try{if(typeof running!=='undefined'&&running&&typeof score==='number'){const id=active();if(id&&score>lastScore){const gain=Math.floor((score-lastScore)/25);if(gain>0)addXp(id,gain);}lastScore=score}else lastScore=0;if(typeof boss!=='undefined'){if(boss)lastBossSeen=boss.id;else if(lastBossSeen){const id=active();if(id)addXp(id,35);lastBossSeen=null;}}}catch(e){}requestAnimationFrame(tick)}
 requestAnimationFrame(tick);
 window.SkyPuffPufflingProgress={get,addXp,multiplier,xpNeed,maxLevel:MAX_LEVEL};
})();
