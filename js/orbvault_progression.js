/* Orbuff — OrbVault rest, training and upgrade progression v1.0 */
(function(){
 const KEY='skyPuffOrbVaultProgressV1',MAX_OFFLINE=24*60*60*1000;
 const LEVELS={
  1:{slots:3,energyMinutes:15,xpHour:5,cost:0},
  2:{slots:4,energyMinutes:12,xpHour:5,cost:1000},
  3:{slots:5,energyMinutes:10,xpHour:5,cost:2500},
  4:{slots:6,energyMinutes:10,xpHour:10,cost:5000},
  5:{slots:8,energyMinutes:10,xpHour:10,cost:10000}
 };
 function normalize(raw){const r=raw&&typeof raw==='object'?raw:{},level=Math.max(1,Math.min(5,Math.floor(+r.level||1))),rest=r.rest&&typeof r.rest==='object'?r.rest:{};return {level,rest,reviveOrbs:Math.max(0,Math.floor(+r.reviveOrbs||0)),lastDailyRoll:String(r.lastDailyRoll||'')}}
 function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null'))}catch(e){return normalize(null)}}
 function saveState(s){const n=normalize(s);try{localStorage.setItem(KEY,JSON.stringify(n))}catch(e){}return n}
 function config(){return LEVELS[load().level]}
 function slots(){return config().slots}
 function isVaulted(id){try{return (window.SkyPuffNurseryVault?.loadVaultSlots?.()||[]).includes(id)}catch(e){return false}}
 function startRest(id){if(!id)return;const s=load(),now=Date.now();s.rest[id]={energyAt:now,xpAt:now};saveState(s)}
 function stopRest(id){settle(id);const s=load();delete s.rest[id];saveState(s)}
 function settle(id){
  const s=load(),ids=id?[id]:(window.SkyPuffNurseryVault?.loadVaultSlots?.()||[]).filter(Boolean),now=Date.now(),cfg=LEVELS[s.level];let changed=false;
  for(const orbId of ids){if(!orbId)continue;const r=s.rest[orbId]||{energyAt:now,xpAt:now};const energyElapsed=Math.min(MAX_OFFLINE,Math.max(0,now-(+r.energyAt||now))),energyTicks=Math.floor(energyElapsed/(cfg.energyMinutes*60000));if(energyTicks>0){window.OrbuffEnergy?.recharge?.(orbId,energyTicks);r.energyAt=(+r.energyAt||now)+energyTicks*cfg.energyMinutes*60000;changed=true}
   const xpElapsed=Math.min(MAX_OFFLINE,Math.max(0,now-(+r.xpAt||now))),xpTicks=Math.floor(xpElapsed/3600000);if(xpTicks>0){window.SkyPuffPufflingProgress?.addXp?.(orbId,xpTicks*cfg.xpHour);r.xpAt=(+r.xpAt||now)+xpTicks*3600000;changed=true}s.rest[orbId]=r}
  for(const savedId of Object.keys(s.rest))if(!ids.includes(savedId)&&!isVaulted(savedId)){delete s.rest[savedId];changed=true}
  const day=new Date(now).toISOString().slice(0,10);if(s.level>=5&&s.lastDailyRoll!==day){s.lastDailyRoll=day;if(Math.random()<.15)s.reviveOrbs++;changed=true}
  if(changed)saveState(s);return s
 }
 function upgrade(){
  const s=load();if(s.level>=5)return {ok:false,reason:'max_level'};const next=LEVELS[s.level+1],bank=Number(window.save?.bank||0);if(bank<next.cost)return {ok:false,reason:'not_enough_coins',cost:next.cost};
  window.save.bank=bank-next.cost;s.level++;saveState(s);try{window.persist?.();window.refreshMenu?.()}catch(e){}window.SkyPuffNurseryVault?.render?.();return {ok:true,level:s.level,cost:next.cost}
 }
 function useReviveOrb(){const s=load();if(s.reviveOrbs<1)return false;s.reviveOrbs--;saveState(s);return true}
 function next(){const s=load();return s.level<5?LEVELS[s.level+1]:null}
 const api={load,config,slots,isVaulted,startRest,stopRest,settle,upgrade,useReviveOrb,next,levels:LEVELS};
 window.OrbuffVaultProgress=api;window.SkyPuffOrbVaultProgress=api;
 setInterval(()=>{try{settle()}catch(e){}},60000);
})();