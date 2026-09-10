import fs from 'node:fs';
import vm from 'node:vm';

const root=process.cwd();
const fail=m=>{throw new Error(m)};
function run(context,file){context.globalThis=context;vm.createContext(context);vm.runInContext(fs.readFileSync(`${root}/${file}`,'utf8'),context,{filename:file});}
const localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
const context={window:{},localStorage,console};context.window=context;
run(context,'js/puff_fusion_core.js');
run(context,'js/puffling_collection_50.js');
run(context,'js/puffling_collection_36.js');
run(context,'js/puffling_unique_traits.js');

const F=context.SkyPuffFusion;
const all=[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})];
if(all.length!==100)fail(`Expected 100 Pufflings, got ${all.length}`);
const ids=all.map(p=>p.id);
if(new Set(ids).size!==100)fail('Duplicate Puffling IDs detected');
const exp=context.PufflingExpansion36;
if(!exp||exp.count!==36)fail('36-Puffling expansion did not load correctly');
if(exp.legendaryIds.length!==10)fail(`Expected 10 new Legendary Pufflings, got ${exp.legendaryIds.length}`);
const added=exp.ids.map(id=>F.BASE[id]);
const dist=added.reduce((a,p)=>(a[p.rarity]=(a[p.rarity]||0)+1,a),{});
if(dist.common!==10||dist.rare!==8||dist.epic!==8||dist.legendary!==10)fail(`Unexpected rarity distribution: ${JSON.stringify(dist)}`);

const profiles=all.map(p=>p.trait);
if(profiles.some(t=>!t))fail('At least one Puffling is missing a trait profile');
if(new Set(profiles.map(t=>t.traitId)).size!==100)fail('Trait IDs are not unique');
if(new Set(profiles.map(t=>t.traitName)).size!==100)fail('Trait names are not unique');
const fingerprints=profiles.map(t=>[t.jumpScale,t.boostRegen,t.shotPower,t.controlBonus,t.rescueChance,t.raceStrength,t.raceDuration,t.raceCooldown].join('|'));
if(new Set(fingerprints).size!==100)fail('At least two Pufflings share the same gameplay trait profile');
const starters=['starterpuff','starterspark','starterdrop'].map(id=>F.BASE[id]);
if(starters.some(p=>!p.starterOnly||p.trait.raceStrength!==0.08||p.trait.boostRegen!==0))fail('Starter Pufflings are no longer the weakest starter tier');

console.log('✅ 100 Pufflings loaded');
console.log('✅ New rarity split: 10 Common / 8 Rare / 8 Epic / 10 Legendary');
console.log('✅ All 100 Pufflings have unique gameplay trait profiles');