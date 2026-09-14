import fs from 'node:fs';import vm from 'node:vm';
const fail=m=>{throw new Error(m)};let active='volt',usable={ember:true,volt:true},seen=[],setCalls=[];
const state={owned:{ember:1,volt:1}},F={load:()=>({owned:{...state.owned}})},G={active:()=>active,setActive:id=>{setCalls.push(id);active=id;return true}};
const status={textContent:''},ctx={window:null,console,document:{getElementById:id=>id==='multiplayerStatus'?status:null},SkyPuffFusion:F,SkyPuffPufflingGameplay:G,OrbuffEnergy:{canUse:id=>!!usable[id]},startMultiplayerRace:async type=>{seen.push({type,active:F.load().active});return true}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/race_active_orbuff_guard.js','utf8'),ctx,{filename:'js/race_active_orbuff_guard.js'});
if(!ctx.OrbuffRaceActiveGuard)fail('Race active Orbuff guard API missing');
await ctx.startMultiplayerRace('random');if(seen.at(-1)?.active!=='volt')fail(`Race ignored selected active Orbuff: ${JSON.stringify(seen.at(-1))}`);
usable.volt=false;await ctx.startMultiplayerRace('friend');if(active!=='ember'||seen.at(-1)?.active!=='ember'||setCalls.at(-1)!=='ember')fail('Race did not switch away from an unavailable active Orbuff');
usable.ember=false;const before=seen.length,result=await ctx.startMultiplayerRace('random');if(result!==false||seen.length!==before||!status.textContent.includes('Ingen Orbuff'))fail('Race was not blocked when every owned Orbuff was exhausted/vaulted');
console.log('✅ Race uses the selected active Orbuff, falls back to a usable one and blocks exhausted/vaulted-only rosters');