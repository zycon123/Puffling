import fs from 'node:fs';
import vm from 'node:vm';

const root=process.cwd();
const fail=message=>{throw new Error(message)};
const ok=message=>console.log(`✅ ${message}`);

function storage(seed={}){
 const data=new Map(Object.entries(seed).map(([key,value])=>[key,String(value)]));
 return {getItem:key=>data.has(key)?data.get(key):null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};
}
function run(context,relativePath){
 context.globalThis=context;vm.createContext(context);vm.runInContext(fs.readFileSync(`${root}/${relativePath}`,'utf8'),context,{filename:relativePath});
}

{
 const localStorage=storage(),context={window:{},localStorage,console};context.window=context;
 run(context,'js/puff_fusion_core.js');run(context,'js/puffling_collection_50.js');
 const F=context.SkyPuffFusion;
 if(Object.keys(F.BASE).length+Object.keys(F.FUSIONS).length!==61)fail('Puffling catalog must contain 61 entries');
 F.add('ember',1);F.add('volt',1);let state=F.load();state.vault=['ember'];F.save(state);
 if(F.canFuse('ember','volt'))fail('Vaulted Puffling was incorrectly available for Fusion');
 F.add('ember',1);if(!F.canFuse('ember','volt'))fail('Extra unprotected Puffling was not available for Fusion');
 if(!F.fuse('ember','volt').ok||F.load().owned.ember!==1||!F.load().vault.includes('ember'))fail('Fusion did not preserve the protected Vault copy');
 localStorage.setItem('skyPuffActivePuffling','volt');state=F.load();state.owned.volt=0;F.save(state);
 if(localStorage.getItem('skyPuffActivePuffling'))fail('Invalid active Puffling was not cleared');
 ok('Puffling catalog, Vault-safe Fusion and active selection');
}

{
 const localStorage=storage(),raf=[];
 const context={window:{},localStorage,console,requestAnimationFrame:fn=>raf.push(fn),running:true,score:0,boss:null,bossDefeated:false,showToast:()=>{}};context.window=context;context.SkyPuffPufflingGameplay={active:()=> 'ember',getPuff:()=>({name:'Ember Puff'})};context.SkyPuffFusionUI={renderDex:()=>{}};
 run(context,'js/puffling_progression.js');
 const normalized=context.SkyPuffPufflingProgress.normalize({ember:{level:-5,xp:999999},bad:null});
 if(normalized.ember.level!==20||normalized.ember.xp!==0||normalized.bad)fail('Puffling progression normalization failed');
 for(let score=1;score<=25;score++){context.score=score;const tick=raf.shift();if(!tick)fail('Progression tick stopped');tick();}
 if(context.SkyPuffPufflingProgress.get('ember').xp!==1)fail('Incremental height did not award XP');
 ok('Puffling progression accumulation and normalization');
}

{
 const localStorage=storage({skyPuffEggInventoryV1:JSON.stringify({rare:-3,epic:'4.8',legendary:'bad'})});
 const context={window:{},localStorage,console,document:{readyState:'loading',addEventListener:()=>{}}};context.window=context;
 run(context,'js/puffling_nursery_vault.js');const eggs=context.SkyPuffNurseryVault.loadEggs();
 if(eggs.rare!==0||eggs.epic!==4||eggs.legendary!==0)fail('Egg inventory normalization failed');
 ok('Egg inventory normalization');
}

{
 const localStorage=storage({skyPuffAntiCheatFlags:'legacy'}),timers=[];
 const context={window:{},localStorage,console,navigator:{userAgent:'test'},SKY_PUFF_VERSION:'test',score:1000,coins:10,running:true,player:{hp:3},save:{bank:0},startGame:()=>{},setInterval:fn=>timers.push(fn)};context.window=context;
 run(context,'js/anti_cheat.js');const anti=context.skyPuffAntiCheat;
 if(localStorage.getItem('skyPuffAntiCheatFlags')!==null)fail('Anti-cheat did not clear stale flags at run start');
 if(!anti.inspectState())fail('Normal run state was incorrectly rejected');
 context.score=500;anti.acceptTransition(context.score,context.coins);
 if(!anti.inspectState()||anti.status.flags.length)fail('Approved boss score transition was flagged');
 context.score=400;anti.inspectState();anti.inspectState();
 if(anti.status.flags.length!==1||anti.status.flags[0].type!=='score_rollback')fail('Repeated identical anti-cheat flags were not deduplicated');
 ok('Anti-cheat boss transition baseline and duplicate suppression');
}

{
 const localStorage=storage({skyPuffAutoRepairLog:JSON.stringify({repairs:27,lastRepair:{repair:'Main menu restored'}})}),timers=[];
 const startEl={isConnected:true,style:{display:'none'}},otherOverlay={isConnected:true,style:{display:'flex'}};let restored=0;
 const context={window:{},localStorage,console,performance:{now:()=>0},setInterval:fn=>timers.push(fn),clearInterval:()=>{},document:{hidden:false,querySelectorAll:()=>[startEl,otherOverlay]},getComputedStyle:el=>el.style,startEl,gameOverEl:{isConnected:true,style:{display:'none'}},player:null,boss:null,running:false,paused:false,bossArena:false,platforms:[],W:390,H:844,showMainMenu:()=>{restored++}};context.window=context;
 run(context,'js/ai_diagnostics.js');const ai=context.skyPuffAIDiagnostics;
 if(ai.repairs!==0||localStorage.getItem('skyPuffAutoRepairLog')!==null)fail('Legacy false repair count was not cleared');
 ai.runCheck();if(restored!==0||ai.repairs!==0)fail('Visible dynamic overlay was incorrectly replaced by main menu');
 otherOverlay.style.display='none';ai.runCheck();if(restored!==1||ai.repairs!==1)fail('Missing-menu recovery no longer works');
 ok('AI diagnostics dynamic overlay detection and legacy log migration');
}

console.log('✅ Runtime model regression checks passed');
