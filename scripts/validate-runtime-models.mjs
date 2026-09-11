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
 run(context,'js/puff_fusion_core.js');run(context,'js/puffling_collection_50.js');run(context,'js/puffling_collection_36.js');run(context,'js/puffling_unique_traits.js');run(context,'js/steal_my_puff_core.js');
 const F=context.SkyPuffFusion,total=Object.keys(F.BASE).length+Object.keys(F.FUSIONS).length;
 if(total!==100)fail(`Puffling catalog must contain 100 entries, got ${total}`);
 if(context.PufflingExpansion36?.count!==36||context.PufflingExpansion36?.legendaryIds?.length!==10)fail('36-Puffling expansion metadata is invalid');
 if(context.SkyPuffUniqueTraits?.count!==100)fail('Unique trait system did not cover all 100 Pufflings');
 const starterIds=['starterpuff','starterspark','starterdrop'];
 for(const id of starterIds){const p=F.BASE[id];if(!p||p.rarity!=='common'||p.starterOnly!==true||p.value!==0.35||p.ability!=='starter')fail(`Starter Puffling ${id} is not configured as a weak Common starter`);}
 if(!starterIds.every(id=>F.load().discovered.includes(id)))fail('Starter Pufflings must stay visible in Puffdex before selection');
 const starterRaceAbility=context.SkyPuffRace?.abilityFor?.('starterpuff');
 if(!starterRaceAbility||starterRaceAbility.id!=='tinyGust'||starterRaceAbility.strength!==0.08||starterRaceAbility.duration!==350)fail('Starter Puffling Race ability is not the weak Tiny Gust profile');
 F.add('ember',1);F.add('volt',1);let state=F.load();state.vault=['ember'];F.save(state);
 if(F.canFuse('ember','volt'))fail('Vaulted Puffling was incorrectly available for Fusion');
 F.add('ember',1);if(!F.canFuse('ember','volt'))fail('Extra unprotected Puffling was not available for Fusion');
 if(!F.fuse('ember','volt').ok||F.load().owned.ember!==1||!F.load().vault.includes('ember'))fail('Fusion did not preserve the protected Vault copy');
 localStorage.setItem('skyPuffActivePuffling','volt');state=F.load();state.owned.volt=0;F.save(state);
 if(localStorage.getItem('skyPuffActivePuffling'))fail('Invalid active Puffling was not cleared');
 ok('100-Puffling catalog, starter tuning, unique traits, Vault-safe Fusion and active selection');
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
 const context={window:{},localStorage,console,document:{readyState:'loading',addEventListener:()=>{},getElementById:()=>null}};context.window=context;
 run(context,'js/puff_fusion_core.js');run(context,'js/puffling_collection_50.js');run(context,'js/puffling_collection_36.js');
 context.SkyPuffFusion.add('ember',1);context.SkyPuffFusion.add('prism',1);
 run(context,'js/puffling_nursery_vault.js');const nursery=context.SkyPuffNurseryVault,eggs=nursery.loadEggs();
 if(eggs.rare!==0||eggs.epic!==4||eggs.legendary!==0)fail('Egg inventory normalization failed');
 const starters=new Set(['starterpuff','starterspark','starterdrop']);
 for(const tier of ['rare','epic','legendary'])if(nursery.pool(tier).some(id=>starters.has(id)))fail(`Starter Puffling leaked into ${tier} egg pool`);
 if(!nursery.placeInVault('ember',2)||nursery.loadVaultSlots()[2]!=='ember')fail('Empty Vault slot did not accept selected Puffling');
 if(!nursery.placeInVault('prism',0)||nursery.loadVaultSlots()[0]!=='prism')fail('Vault picker did not preserve the selected slot');
 if(!nursery.removeVaultSlot(2)||nursery.loadVaultSlots()[2]!==null)fail('Occupied Vault slot could not be cleared');
 if(context.SkyPuffFusion.load().vault.join(',')!=='prism')fail('Interactive Vault slots did not sync protection state');
 ok('Egg normalization, starter-only acquisition and interactive fixed Vault slots');
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

{
 function loaderScenario(failures){
  const pending=[],timers=[],attempts=[],executed=[],events=[],nodes=new Map(),start={inert:false,attributes:new Map(),setAttribute(key,value){this.attributes.set(key,String(value));},removeAttribute(key){this.attributes.delete(key);}};let reloads=0;
  const localStorage=storage({skyPuffLang:'no',skyPuffPufflings:'saved inventory'});
  const document={currentScript:null,getElementById:id=>id==='start'?start:nodes.get(id),
   createElement:tag=>{
    const children={p:{},button:{style:{}}};
    const el={tag,style:{},querySelector:selector=>children[selector],remove:()=>nodes.delete(el.id)};return el;
   },body:{appendChild:el=>{if(el.tag==='script')pending.push(el);else nodes.set(el.id,el);}}
  };
  const context={document,localStorage,console:{error:()=>{}},location:{reload:()=>reloads++},setTimeout:fn=>timers.push(fn),Event:class{constructor(type){this.type=type}},dispatchEvent:event=>events.push(event.type)};
  context.window=context;run(context,'game.js');
  if(!start.inert||start.attributes.get('aria-busy')!=='true'||events.includes('sky-puff-ready'))fail('Main menu became ready before modules finished loading');
  let steps=0;
  while((pending.length||timers.length)&&steps++<500){
   if(!pending.length){timers.shift()();continue;}
   const script=pending.shift(),path=script.src.split('?')[0];attempts.push(path);
   if(path==='js/puffling_nursery_vault.js'&&failures>0){failures--;script.onerror();}
   else{executed.push(path);script.onload();}
  }
  if(steps>=500)fail('Loader did not stop retrying');
  return {start,events,nodes,attempts,executed,localStorage,get reloads(){return reloads;}};
 }
 const normal=loaderScenario(0);
 if(normal.start.inert||normal.start.attributes.has('aria-busy')||normal.nodes.size||!normal.executed.includes('js/smoke_check.js')||normal.events.filter(type=>type==='sky-puff-ready').length!==1)fail('Normal module startup did not complete atomically');
 const recovered=loaderScenario(1);
 if(recovered.start.inert||recovered.events.filter(type=>type==='sky-puff-ready').length!==1||recovered.nodes.size||JSON.stringify(recovered.executed)!==JSON.stringify(normal.executed))fail('Transient module failure changed execution order or failed recovery');
 if(recovered.attempts.filter(p=>p==='js/puffling_nursery_vault.js').length!==2)fail('Transient module failure was not retried once');
 const failed=loaderScenario(Infinity),notice=failed.nodes.get('skyPuffLoadNotice');
 if(!failed.start.inert||failed.events.includes('sky-puff-ready')||!notice||failed.executed.includes('js/diamond_mystery_shop.js'))fail('Permanent module failure allowed partial startup');
 if(failed.attempts.filter(p=>p==='js/puffling_nursery_vault.js').length!==3)fail('Module retry limit was not respected');
 if(notice.querySelector('button').style.display!=='inline-block')fail('Startup recovery button is hidden');
 notice.querySelector('button').onclick();
 if(failed.reloads!==1||failed.localStorage.getItem('skyPuffPufflings')!=='saved inventory')fail('Startup recovery did not preserve saved inventory');
 ok('Atomic menu readiness, module loader order, bounded retries, recovery button and saved progress');
}

console.log('✅ Runtime model regression checks passed');
