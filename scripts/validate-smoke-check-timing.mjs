import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// smoke_check.js runs last in game.js's loader and reports overall system
// health in the System & Support panel. Several menu modules -- e.g.
// steal_my_puffling_menu.js's Race My Orbuff button -- finish their own DOM
// setup via a deferred setTimeout(fn,100) rather than synchronously. Running
// the smoke check immediately (synchronously, as the last loaded script) races
// that timer and always reports the button "missing", even on a perfectly
// healthy load, for every player, every time.
const src=fs.readFileSync('js/smoke_check.js','utf8');

function harness(){
  let raceBtnExists=false;
  const timers=[]; // {at, fn}
  let now=0;
  const el=id=>{
    if(id==='raceMyPufflingBtn')return raceBtnExists?{onclick(){}}:null;
    return {onclick(){}}; // present but otherwise irrelevant for this test
  };
  const context={
    // The mock context deliberately leaves ~90 unrelated APIs unmocked (this
    // test only cares about the raceMyPufflingBtn timing race), so the real
    // console.error(...) the source calls on a failed check is expected --
    // silence it here so CI logs don't read like a real failure.
    console:{...console,error(){}},
    Object,Array,Number,String,Date,JSON,Math,
    document:{getElementById:el,querySelector:()=>null,title:'Orbuff'},
    window:{},
    setTimeout(fn,delay){timers.push({at:now+(delay||0),fn});return timers.length;},
    eval(name){ throw new ReferenceError(name+' is not defined'); },
  };
  context.window=context;
  vm.createContext(context);
  vm.runInContext(src,context,{filename:'js/smoke_check.js'});
  return {
    context,
    // Simulate steal_my_puffling_menu.js's own deferred DOM setup landing at
    // the same real-world delay it actually uses.
    scheduleRaceButtonCreation(){timers.push({at:now+100,fn:()=>{raceBtnExists=true;}});},
    runUntilSettled(){
      timers.sort((a,b)=>a.at-b.at);
      while(timers.length){const t=timers.shift();now=t.at;t.fn();}
    },
  };
}

{
  const h=harness();
  h.scheduleRaceButtonCreation(); // the real-world 100ms deferred button creation
  h.runUntilSettled();
  const result=h.context.window.skyPuffSmokeCheck;
  assert.ok(result,'smoke check must have produced a result');
  assert.ok(!result.missing.includes('dom:#raceMyPufflingBtn'),
    'smoke check must not race the 100ms deferred Race My Orbuff button setup and falsely report it missing');
}

console.log('✅ Smoke check waits for deferred menu setup before reporting missing DOM elements');
