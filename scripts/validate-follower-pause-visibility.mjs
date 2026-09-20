import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// js/puffling_follower.js draws the player's active Orbuff floating next to
// them during gameplay via a self-perpetuating requestAnimationFrame loop, at
// a hardcoded z-index:6 -- above every menu overlay (all <=5). It only hid
// itself when the run fully ended (`!running`), not when merely paused
// (`running` stays true, only `paused` flips), so pausing left the follower
// glued to the screen at the player's last position, rendering on top of the
// Pause menu (and any other overlay opened while paused, e.g. PC Settings).
const src=fs.readFileSync('js/puffling_follower.js','utf8');

{
  let el=null;
  const context={
    console,Math,
    document:{createElement:()=>{el={style:{}};return el;},body:{appendChild(){}}},
    window:{},
    canvas:{getBoundingClientRect:()=>({left:0,top:0})},
    innerWidth:800,innerHeight:600,
    requestAnimationFrame(fn){context.__raf=fn;},
    running:true,paused:false,
    player:{x:100,y:100,vx:0},
    SkyPuffPufflingGameplay:{active:()=>'ember',getPuff:()=>({id:'ember',icon:'🔥'})},
    SkyPuffPufflingEvolution:{stageFor:()=>0},
    SkyPuffVisuals:{art:()=>null},
    performance:{now:()=>0},
  };
  context.window=context;
  vm.createContext(context);
  vm.runInContext(src,context,{filename:'js/puffling_follower.js'});

  context.__raf(0);
  assert.equal(el.style.display,'flex','follower must be visible during normal unpaused gameplay');

  context.paused=true;
  context.__raf(16);
  assert.equal(el.style.display,'none','follower must hide once the game is paused, not just when it fully stops');

  context.paused=false;
  context.__raf(32);
  assert.equal(el.style.display,'flex','follower must reappear once gameplay resumes');
}

console.log('✅ Puffling follower hides while the game is paused (no longer floats over the Pause menu)');
