import fs from 'node:fs';
import vm from 'node:vm';

const root=process.cwd();
const fail=message=>{throw new Error(message)};
const run=(context,file)=>{context.globalThis=context;vm.createContext(context);vm.runInContext(fs.readFileSync(`${root}/${file}`,'utf8'),context,{filename:file});};
const localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
let level=1;
const fakeHead={appendChild:()=>{}};
const context={window:{},localStorage,console,requestAnimationFrame:()=>{},document:{getElementById:()=>null,createElement:()=>({}),head:fakeHead}};
context.window=context;

run(context,'js/puff_fusion_core.js');
run(context,'js/puffling_collection_50.js');
run(context,'js/puffling_collection_36.js');
context.SkyPuffPufflingProgress={get:()=>({level})};
run(context,'js/puffling_evolution.js');
run(context,'js/puffling_visual_upgrade.js');

const F=context.SkyPuffFusion;
const E=context.SkyPuffPufflingEvolution;
const all=[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})];
const starters=all.filter(p=>p.starterOnly);
const normal=all.filter(p=>!p.starterOnly);
if(all.length!==100)fail(`Expected 100 Pufflings, got ${all.length}`);
if(starters.length!==3)fail(`Expected exactly 3 non-evolving starter Pufflings, got ${starters.length}`);
if(normal.length!==97)fail(`Expected 97 evolvable Pufflings, got ${normal.length}`);
if(normal.some(p=>!E.canEvolve(p.id)))fail('At least one non-starter Puffling is incorrectly blocked from evolution');
if(starters.some(p=>E.canEvolve(p.id)))fail('A starter Puffling is incorrectly marked evolvable');

level=1;
if(all.some(p=>E.stageFor(p.id)!==0))fail('All Pufflings must begin at base form');
level=10;
if(normal.some(p=>E.stageFor(p.id)!==1))fail('At least one non-starter does not reach Evolved form at level 10');
if(starters.some(p=>E.stageFor(p.id)!==0))fail('Starter Pufflings must remain base form at level 10');
level=20;
if(normal.some(p=>E.stageFor(p.id)!==2))fail('At least one non-starter does not reach Ascended form at level 20');
if(starters.some(p=>E.stageFor(p.id)!==0))fail('Starter Pufflings must remain base form at level 20');
if(starters.some(p=>E.bonusFor(p.id)!==1))fail('Starter Pufflings must not receive evolution bonuses');
if(starters.some(p=>E.titleFor(p.id)!==p.name))fail('Starter Pufflings must not receive evolved/ascended titles');

for(const p of normal){
 const evolved=context.SkyPuffVisuals.art(p.id,1),ascended=context.SkyPuffVisuals.art(p.id,2);
 if(!evolved.includes('spPuffArt s1'))fail(`${p.id} has no Evolved visual form`);
 if(!ascended.includes('spPuffArt s2'))fail(`${p.id} has no Ascended visual form`);
}

console.log('✅ Exactly 97 Pufflings can evolve');
console.log('✅ All 97 reach Evolved at level 10 and Ascended at level 20');
console.log('✅ All 97 have procedural Evolved and Ascended visuals');
console.log('✅ Starter Puff, Starter Spark and Starter Drop remain permanently base form');
