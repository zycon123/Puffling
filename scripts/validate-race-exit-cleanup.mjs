import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Race My Orbuff runs its own HUD (js/steal_my_puff_ui.js), its own state
// module (js/steal_my_puff_core.js -> window.SkyPuffRace) and its own network
// connection (js/race_multiplayer_transport.js -> window.SkyPuffRaceTransport),
// entirely separate from the legacy multiplayerHudEl this file already knew
// about. Leaving a race without it finishing on its own -- Main Menu, pause ->
// Main Menu, or an interrupted match -- must tear all three down, or the Race
// HUD stays glued to the screen and the match keeps ticking in the background
// even after the player is back in normal/endless play.
const src=fs.readFileSync('js/run_menu_shop_upgrades.js','utf8');

function harness(){
  const calls=[];
  const elLike=()=>({style:{},textContent:'',value:'',onclick:null,disabled:false,
    addEventListener(){},dispatchEvent(){return true}});
  const store={
    console,Math,Object,Date,JSON,
    performance:{now:()=>0},requestAnimationFrame(){},
    persist(){},showToast(){},tr:(k)=>k,setMission(){},addPlatform(){},
    refreshMenu(){},startMusic(){},stopBossMusic(){},clearTransientUi(){},
    applyLanguage(){},renderUpgrades(){},openShop(){},closeShop(){},
    loadLeaderboard(){},cleanPlayerName:(v)=>v,
    document:{createElement:()=>elLike()},
    save:{upHealth:0,streak:0,bank:0},
    H:800,W:390,lang:'en',
    skins:{},faceStyles:{},hats:{},trailStyles:{},
  };
  const handler={
    get(target,prop){
      if(prop in target)return target[prop];
      if(typeof prop!=='string')return undefined;
      const value=/(El|Wrap)$/.test(prop)?elLike():function(){};
      target[prop]=value;return value;
    },
    has(){return true;}
  };
  const ctx=new Proxy(store,handler);
  store.window=ctx;
  store.SkyPuffRaceTransport={disconnect(){calls.push('transport.disconnect')}};
  store.SkyPuffRace={reset(){calls.push('race.reset')}};
  store.SkyPuffRaceUI={hide(){calls.push('ui.hide')},hideResult(){calls.push('ui.hideResult')}};
  vm.createContext(ctx);
  vm.runInContext(src,ctx,{filename:'js/run_menu_shop_upgrades.js'});
  return {ctx,calls};
}

{
  const {ctx,calls}=harness();
  ctx.multiplayerMode=true;ctx.multiplayerState='racing';ctx.running=true;
  ctx.stopActiveModes();
  assert.ok(calls.includes('transport.disconnect'),'exiting must disconnect the Race network connection');
  assert.ok(calls.includes('race.reset'),'exiting must reset Race My Orbuff\'s own state module');
  assert.ok(calls.includes('ui.hide'),'exiting must hide the Race HUD/attack button');
  assert.ok(calls.includes('ui.hideResult'),'exiting must hide any lingering Race result dialog');
  assert.equal(ctx.multiplayerMode,false,'legacy multiplayer flag still clears too');
}
{
  // showMainMenu() (Main Menu button, pause -> Main Menu) goes through
  // stopActiveModes() -- confirm the Race cleanup fires on that path too, not
  // just when stopActiveModes() is called directly.
  const {ctx,calls}=harness();
  ctx.multiplayerMode=true;ctx.running=true;
  ctx.showMainMenu();
  assert.ok(calls.includes('transport.disconnect')&&calls.includes('race.reset')&&calls.includes('ui.hide'),
    'Main Menu must clean up an in-progress Race the same way stopActiveModes() does');
}
{
  // Starting a fresh normal/endless run (startGame(), e.g. after Race My
  // Orbuff) must also clear any race left dangling in the background.
  const {ctx,calls}=harness();
  ctx.multiplayerMode=true;ctx.running=true;
  ctx.startGame();
  assert.ok(calls.includes('transport.disconnect')&&calls.includes('race.reset')&&calls.includes('ui.hide'),
    'Starting a normal run must clean up an in-progress Race the same way stopActiveModes() does');
}
{
  // No race was active -- cleanup calls are still safe/idempotent no-ops.
  const {ctx,calls}=harness();
  ctx.stopActiveModes();
  assert.ok(calls.includes('transport.disconnect')&&calls.includes('race.reset')&&calls.includes('ui.hide'),
    'cleanup runs unconditionally and must not throw when no race was active');
}

console.log('✅ Exiting to the main menu or starting a new run fully tears down an in-progress Race My Orbuff (HUD, state and network connection)');
