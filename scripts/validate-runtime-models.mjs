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

console.log('✅ Runtime model regression checks passed');
