import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const root=process.cwd();
const read=p=>fs.readFileSync(`${root}/${p}`,'utf8');
const run=(ctx,file)=>vm.runInContext(read(file),ctx,{filename:file});
const require=createRequire(import.meta.url);

function baseBossStages(){
  const src=read('js/state_content.js'),needle='const bossStages=';
  const start=src.indexOf(needle);assert.ok(start>=0,'bossStages declaration missing');
  const end=src.indexOf(';',start);assert.ok(end>start,'bossStages declaration malformed');
  return vm.runInNewContext(src.slice(start+needle.length,end));
}
function functionBlock(src,name,nextName){
  const start=src.indexOf(`function ${name}`);assert.ok(start>=0,`${name} missing`);
  const end=nextName?src.indexOf(`function ${nextName}`,start):src.length;assert.ok(end>start,`${name} boundary missing`);
  return src.slice(start,end);
}

// Build the actual boss progression from production game modules.
const input=read('js/input_missions_boss_spawn.js');
const bossCtx={
  console,Math,Number,String,Object,Array,Set,Map,Date,JSON,
  W:430,H:760,cameraY:0,score:0,lastBossTriggerAt:0,bossStages:baseBossStages(),
  defeatedBosses:{},bossDefeated:false,bossArena:false,bossArenaY:0,boss:null,bossSpawned:false,
  enemies:[],player:{x:215,y:600,vx:0,vy:0,r:28},pointerX:215,
  bossWrap:{style:{}},bossBar:{style:{}},bossIdentityEl:null,bossIdentityNameEl:null,bossTierEl:null,
  showToast(){},startBossMusic(){},reset(){},
};
bossCtx.window=bossCtx;vm.createContext(bossCtx);
run(bossCtx,'js/endless_boss_core.js');
vm.runInContext(functionBlock(input,'nextBossStage','cancelBossWarning'),bossCtx);
vm.runInContext(functionBlock(input,'spawnBoss'),bossCtx);
run(bossCtx,'js/late_game_bosses.js');

const expectedFixed=[
  ['storm',1200,120],['candy',2000,175],['ice',3000,240],['galaxy',4500,340],
  ['solar',10500,430],['void',12500,500],['thunder',14500,575],['crystal',17000,660],['inferno',20000,760],['cosmic',24000,900]
];
assert.equal(bossCtx.bossStages.length,10,'expected exactly ten unique fixed bosses');
for(const [id,at,hp] of expectedFixed){
  const stage=bossCtx.bossStages.find(b=>b.id===id);assert.ok(stage,`missing fixed boss ${id}`);
  assert.equal(stage.at,at,`${id} height changed`);assert.equal(stage.hp,hp,`${id} HP changed`);
  bossCtx.score=at;bossCtx.cameraY=-at*10;bossCtx.player={x:215,y:600,vx:0,vy:0,r:28};bossCtx.enemies=[];bossCtx.boss=null;
  bossCtx.spawnBoss(stage);
  assert.equal(bossCtx.boss?.id,id,`${id} failed to spawn`);
  assert.equal(bossCtx.boss?.hp,hp,`${id} spawned with wrong HP`);
  assert.ok(Number.isFinite(bossCtx.boss?.x)&&Number.isFinite(bossCtx.boss?.y)&&Number.isFinite(bossCtx.boss?.r),`${id} spawn contains non-finite geometry`);
  assert.equal(bossCtx.bossArena,true,`${id} did not enter boss arena`);
}

// Simulate every metre from 0 to 300,000m and instantly settle each defeated boss.
bossCtx.defeatedBosses=Object.fromEntries(expectedFixed.map(([id])=>[id,false]));
bossCtx.lastBossTriggerAt=0;const encounters=[];
for(let h=0;h<=300000;h++){
  bossCtx.score=h;
  const stage=bossCtx.nextBossStage();
  if(!stage)continue;
  assert.ok(Number.isFinite(stage.at)&&stage.at<=h,`future/unreachable boss returned at ${h}m: ${stage.id}@${stage.at}`);
  assert.ok(stage.at>bossCtx.lastBossTriggerAt,`boss threshold repeated/backtracked at ${stage.at}m`);
  if(stage.tier>1){assert.ok(Number.isFinite(stage.hp)&&stage.hp>0&&stage.hp<=1440,`endless boss HP invalid at ${stage.at}m: ${stage.hp}`);assert.ok(Number.isFinite(stage.reward)&&stage.reward>0,`endless reward invalid at ${stage.at}m`);}
  encounters.push({id:stage.id,tier:stage.tier||1,at:stage.at,hp:stage.hp,reward:stage.reward});
  bossCtx.lastBossTriggerAt=stage.at;
  if((stage.tier||1)===1)bossCtx.defeatedBosses[stage.id]=true;
}
assert.ok(encounters.some(x=>x.id==='storm'&&x.tier===2&&x.at===6000),'Storm Boss tier 2 is not reachable at 6000m');
for(const [id,at] of expectedFixed){assert.ok(encounters.some(x=>x.id===id&&x.tier===1&&x.at===at),`${id} never triggered in the 300000m run`);}
assert.ok(encounters.length>150,`endless boss progression stalled; only ${encounters.length} encounters by 300000m`);
for(let i=1;i<encounters.length;i++)assert.ok(encounters[i].at>encounters[i-1].at,'boss encounter heights must stay strictly increasing');
const extreme=bossCtx.getEndlessBossStage(300000);assert.ok(extreme&&extreme.at<=300000&&extreme.tier>1,'300000m endless stage missing');
const extremeBase=bossCtx.bossStages.find(x=>x.id===extreme.id);const extremeHp=Math.max(extremeBase.hp,bossCtx.endlessBossHealth(extreme)*24);
assert.ok(Number.isFinite(extremeHp)&&extremeHp<=1440,`300000m boss HP is not bounded: ${extremeHp}`);

// Every unique boss must have a live attack pattern.
let now=1_000_000,shots=[];
const patternCtx={console,Math,Number,String,Object,Array,Set,Map,Date,JSON,window:null,bossAttackPattern(){},boss:null,running:true,performance:{now:()=>now},fireAimedBossShot(...a){shots.push(a)},setTimeout(fn){fn();return 0;}};
patternCtx.window=patternCtx;vm.createContext(patternCtx);run(patternCtx,'js/boss_pattern_override.js');run(patternCtx,'js/late_game_boss_patterns.js');
for(const [id] of expectedFixed){shots=[];now+=5000;patternCtx.boss={id,tier:1,patternShotCount:0,altPatternCount:0};patternCtx.bossAttackPattern();assert.ok(shots.length>=2&&shots.length<=3,`${id} attack pattern produced ${shots.length} projectiles`);}

// Server-authoritative Boss Sessions must accept the same ten bosses and the same HP values.
const createBossSessionStore=require('../server/boss_session_store.js');const bossStore=createBossSessionStore();
for(const [id,,hp] of expectedFixed){assert.equal(bossStore.validBossRef(`${id}:1`),true,`server rejects ${id}:1`);assert.equal(bossStore.maxHp(`${id}:1`),hp,`server/client HP mismatch for ${id}`);}
for(const id of ['solar','void','thunder','crystal','inferno','cosmic'])assert.equal(bossStore.validBossRef(`${id}:2`),false,`${id} must remain a one-time fixed boss`);
const extremeRef=`${extreme.id}:${extreme.tier}`;assert.equal(bossStore.validBossRef(extremeRef),true,`server rejects 300000m boss ${extremeRef}`);assert.equal(bossStore.maxHp(extremeRef),extremeHp,`server/client 300000m HP mismatch for ${extremeRef}`);

// Soak-test procedural world generation to 300,000m using the actual addPlatform().
let seed=0x51f15e;const simMath=Object.create(Math);simMath.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const world={console,Math:simMath,Number,String,Object,Array,Set,Map,Date,JSON,window:null,W:430,H:760,platforms:[],coinItems:[],powerups:[],enemies:[],missions:[],missionEl:{textContent:''},lang:'no',tr:()=>'',missionText:()=>'',SkyPuffRaceCourse:null};world.window=world;vm.createContext(world);run(world,'js/world_helpers.js');
let y=world.H*.82;world.platforms.push({x:160,y,w:110,h:18,move:false,breakable:false,used:false});for(let i=0;i<30;i++){y-=70+simMath.random()*35;world.addPlatform(y)}
let generated=31,maxPlatforms=world.platforms.length,maxCoins=world.coinItems.length,maxPowerups=world.powerups.length,maxEnemies=world.enemies.length;
for(let height=0;height<=300000;height+=10){
  const cameraY=-height*10;let minY=world.platforms.length?Math.min(...world.platforms.map(p=>p.y)):cameraY-100;let guard=0;
  while(minY-cameraY>-140){minY-=70+simMath.random()*38;world.addPlatform(minY);generated++;if(++guard>50)throw new Error(`world generator runaway near ${height}m`);}
  world.platforms=world.platforms.filter(p=>p.y-cameraY<world.H+120&&!p.used);
  world.coinItems=world.coinItems.filter(c=>c.y-cameraY<world.H+100&&!c.taken);
  world.powerups=world.powerups.filter(p=>p.y-cameraY<world.H+100&&!p.taken);
  world.enemies=world.enemies.filter(e=>e.y-cameraY<world.H+130);
  for(const group of [world.platforms,world.coinItems,world.powerups,world.enemies])for(const obj of group)for(const key of ['x','y'])assert.ok(Number.isFinite(Number(obj[key])),`non-finite ${key} near ${height}m`);
  maxPlatforms=Math.max(maxPlatforms,world.platforms.length);maxCoins=Math.max(maxCoins,world.coinItems.length);maxPowerups=Math.max(maxPowerups,world.powerups.length);maxEnemies=Math.max(maxEnemies,world.enemies.length);
  assert.ok(world.platforms.length<80&&world.coinItems.length<80&&world.powerups.length<80&&world.enemies.length<80,`world arrays grew without bound near ${height}m`);
}
assert.ok(generated>30000,'300000m soak did not generate enough real platforms');

// Verify the post-boss transition remains numerically safe at extreme height.
const transition={console,Math,Number,String,Object,Array,Set,Map,Date,JSON,window:null,W:430,H:760,score:300000,cameraY:-3000000,coins:0,platforms:[],player:{x:215,y:400,vx:0,vy:0,r:28},pointerX:215,invuln:0,puffAnim:0,running:true,boss:null,resumeCountdownEl:null,resumeCountdownTextEl:null,scoreEl:{textContent:''},performance:{now:()=>1_000_000},requestAnimationFrame(){},setTimeout(fn){fn();return 0;},nextBossStage(){return null},createSafeBossExit(){}};transition.window=transition;transition.skyBossEntryState={cameraY:-3000000,score:300000,playerX:215,stageAt:300000};vm.createContext(transition);run(transition,'js/boss_transition_fix.js');transition.createSafeBossExit();
assert.equal(transition.score,300000,'boss exit lost extreme score');assert.equal(transition.cameraY,-3000000,'boss exit corrupted extreme camera position');assert.ok(transition.platforms.some(p=>p.safeBossExit)&&transition.platforms.some(p=>p.safeBossContinuation),'boss exit did not create safe continuation platforms at 300000m');assert.ok(Number.isFinite(transition.player.x)&&Number.isFinite(transition.player.y)&&Number.isFinite(transition.player.vy),'boss exit produced invalid player state at 300000m');

// Loader coverage: all modules responsible for late/endless boss behavior must actually be active.
const loader=read('game.js');for(const file of ['js/endless_boss_core.js','js/late_game_bosses.js','js/late_boss_persistence_fix.js','js/boss_pattern_override.js','js/late_game_boss_patterns.js','js/boss_movement_fix.js','js/boss_transition_fix.js','js/post_boss_guard.js','js/boss_visual_override.js','js/late_boss_visuals.js','js/boss_session_client.js'])assert.ok(loader.includes(`'${file}'`),`loader missing ${file}`);
const lateVisuals=read('js/late_boss_visuals.js');for(const id of ['solar','void','thunder','crystal','inferno','cosmic'])assert.ok(lateVisuals.includes(`'${id}'`),`late boss visual missing ${id}`);

console.log(`✅ Full-game endurance simulation passed: 10 unique bosses, ${encounters.length} total boss encounters through 300000m, ${generated} procedural platforms; bounded arrays max platforms=${maxPlatforms}, coins=${maxCoins}, powerups=${maxPowerups}, enemies=${maxEnemies}; extreme boss=${extremeRef} HP=${extremeHp}`);
