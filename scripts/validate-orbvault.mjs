import fs from 'node:fs';import vm from 'node:vm';
const fail=m=>{throw new Error(m)},data=new Map(),localStorage={getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
let now=Date.parse('2026-09-14T12:00:00Z'),energy=0,xp=0,persisted=0;class FakeDate extends Date{static now(){return now}}
const ctx={window:null,console,JSON,Object,Number,String,Math:{...Math,random:()=>0},Date:FakeDate,localStorage,setInterval:()=>0,save:{bank:20000},persist:()=>persisted++,refreshMenu:()=>{},SkyPuffNurseryVault:{loadVaultSlots:()=>['ember'],render:()=>{}},OrbuffEnergy:{recharge:(id,n)=>{energy+=n}},SkyPuffPufflingProgress:{addXp:(id,n)=>{xp+=n}}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/orbvault_progression.js','utf8'),ctx);
const V=ctx.OrbuffVaultProgress;if(!V||V.slots()!==3||V.config().energyMinutes!==15)fail('OrbVault level 1 configuration failed');
V.startRest('ember');now+=60*60*1000;V.settle();if(energy!==4||xp!==5)fail(`Level 1 passive rest failed: energy=${energy}, xp=${xp}`);
for(const expected of [2,3,4,5]){const r=V.upgrade();if(!r.ok||r.level!==expected)fail(`Upgrade to level ${expected} failed`)}
if(V.slots()!==8||V.config().energyMinutes!==10||V.config().xpHour!==10||ctx.save.bank!==1500||persisted!==4)fail('Max OrbVault upgrade effects or costs failed');
if(V.load().reviveOrbs!==1||!V.useReviveOrb()||V.load().reviveOrbs!==0)fail('Level 5 daily Revive Orb lifecycle failed');
console.log('✅ OrbVault validated: upgrades, 3→8 slots, energy rest, passive XP and Revive Orb');