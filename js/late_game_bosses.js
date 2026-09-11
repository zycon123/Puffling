/* Sky Puff — six unique late-game bosses after 10,000m v0.2 */
(function(){
 const LATE=[
  {id:'solar',at:10500,name:'Solar Seraph',emoji:'☀️',hp:430,reward:1900,r:43},
  {id:'void',at:12500,name:'Void Phantom',emoji:'🕳️',hp:500,reward:2250,r:42},
  {id:'thunder',at:14500,name:'Thunder Colossus',emoji:'⚡',hp:575,reward:2650,r:47},
  {id:'crystal',at:17000,name:'Crystal Hydra',emoji:'💎',hp:660,reward:3100,r:46},
  {id:'inferno',at:20000,name:'Inferno Emperor',emoji:'🔥',hp:760,reward:3700,r:48},
  {id:'cosmic',at:24000,name:'Cosmic Devourer',emoji:'🌌',hp:900,reward:4500,r:52}
 ];
 window.SkyPuffLateBosses=LATE;
 // Add as normal one-time boss stages. Existing nextBossStage() will pick these before endless repeats.
 if(typeof bossStages!=='undefined'){
  for(const b of LATE)if(!bossStages.some(x=>x.id===b.id))bossStages.push({...b});
  bossStages.sort((a,b)=>(a.at||0)-(b.at||0));
 }
 // Ensure reset tracks them as unbeaten each run.
 const oldReset=window.reset;
 if(typeof oldReset==='function')window.reset=function(){const out=oldReset.apply(this,arguments);for(const b of LATE)defeatedBosses[b.id]=false;return out;};
 // Give each boss a lightweight identity via radius; attack patterns are overridden separately.
 const oldSpawn=window.spawnBoss;
 if(typeof oldSpawn==='function')window.spawnBoss=function(stage){oldSpawn(stage);const cfg=LATE.find(x=>x.id===stage.id);if(cfg&&boss)boss.r=cfg.r;};
 // The synth engine has four canonical themes. Map every late boss to a safe theme so
 // startBossMusic never falls silent or enters an undefined pattern.
 const oldMusic=window.startBossMusic;
 const musicMap={solar:'candy',void:'ice',thunder:'storm',crystal:'ice',inferno:'storm',cosmic:'galaxy'};
 if(typeof oldMusic==='function')window.startBossMusic=function(id){return oldMusic(musicMap[id]||id);};
 window.SkyPuffLateBossMusicMap=Object.freeze({...musicMap});
})();
