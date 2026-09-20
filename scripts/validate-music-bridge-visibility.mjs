import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// js/music_bridge.js loads before js/state_content.js (which declares `let
// boss`) in game.js's loader. Both share one global lexical environment, so a
// bare `boss` reference normally still resolves once state_content.js has run
// -- but if a real visibilitychange event fires while the script loader is
// still partway through the ~130-file sequence (a slow connection, or the
// user backgrounding the app during startup), music_bridge.js's own listener
// runs before `boss` exists anywhere, throwing ReferenceError: boss is not defined.
const src=fs.readFileSync('js/music_bridge.js','utf8');

function harness(){
  const events=new Map();
  const calls=[];
  const context={
    console,
    musicEnabled:true,bossMusicId:null,musicVolume:.5,
    bgMusicEl:{pause(){calls.push('pause')}},
    startBossMusic(id){calls.push('startBossMusic:'+id);return id;},
    document:{
      hidden:false,
      addEventListener(type,fn){if(!events.has(type))events.set(type,[]);events.get(type).push(fn);},
    },
    musicVolumeEl:null,
  };
  context.window=context;
  context.window.startSkyTheme=()=>calls.push('startSkyTheme');
  context.window.stopSkyTheme=()=>calls.push('stopSkyTheme');
  context.window.setSkyThemeVolume=()=>calls.push('setSkyThemeVolume');
  vm.createContext(context);
  vm.runInContext(src,context,{filename:'js/music_bridge.js'});
  return {context,events,calls};
}

{
  // Simulate the real load-order gap: music_bridge.js has run, but
  // state_content.js (which declares `let boss`) has not loaded yet, so
  // `boss` is not merely null -- it does not exist as a binding at all.
  const {context,events,calls}=harness();
  context.document.hidden=false;
  const handler=events.get('visibilitychange')[0];
  assert.doesNotThrow(()=>handler(),
    'visibilitychange handler must not throw ReferenceError when boss has not been declared yet');
  assert.ok(calls.includes('startSkyTheme'),'music should still start once boss is genuinely undeclared/not in a fight');
}

console.log('✅ music_bridge.js visibilitychange handler tolerates boss not being declared yet');
