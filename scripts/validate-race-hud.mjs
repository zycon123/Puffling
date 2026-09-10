import fs from 'node:fs';

const read=rel=>fs.readFileSync(new URL('../'+rel,import.meta.url),'utf8');
const ui=read('js/steal_my_puff_ui.js');
const progress=read('js/race_progress_sync.js');
const desktop=read('js/desktop_game_width.js');
const input=read('js/input_missions_boss_spawn.js');
const game=read('game.js');

function requireToken(src,label,token){
  if(!src.includes(token)){
    console.error(`❌ Missing ${label}`);
    process.exit(1);
  }
}

for(const [label,token] of [
  ['shared live progress source','SkyPuffRaceNetwork?.liveProgress?.()'],
  ['legacy multiplayer HUD suppression','function hideLegacyHud'],
  ['Race HUD above legacy HUD',"zIndex:'24'"],
  ['animation-frame HUD loop','function startHudLoop'],
  ['progress event refresh',"addEventListener('race:progress'"],
  ['clamped player bar','Math.max(0,Math.min(100,youH/goal*100))'],
  ['clamped rival bar','Math.max(0,Math.min(100,rivalH/goal*100))']
])requireToken(ui,label,token);

for(const [label,token] of [
  ['live Race progress function','function liveProgress'],
  ['network opponent height','SkyPuffRaceNetwork?.opponent?.()'],
  ['local fallback opponent height','multiplayerOpponentScore'],
  ['Race progress event',"CustomEvent('race:progress'"],
  ['shared Race progress API','SkyPuffRaceProgress']
])requireToken(progress,label,token);

for(const [label,token] of [
  ['620px desktop playfield cap','MAX_DESKTOP_WIDTH=620'],
  ['desktop logical width cap','W=narrow?Math.min(vw,MAX_DESKTOP_WIDTH):vw'],
  ['centered desktop canvas',"canvas.style.marginLeft='auto'"],
  ['desktop HUD width alignment','function applyHudWidth'],
  ['desktop pointer coordinate mapper','function toGameX']
])requireToken(desktop,label,token);
requireToken(input,'game pointer uses centered playfield coordinates','PufflingDesktopViewport?.toGameX?.(clientX)');

const desktopPos=game.indexOf("'js/desktop_game_width.js'");
const statePos=game.indexOf("'js/state_content.js'");
const bridgePos=game.indexOf("'js/steal_my_puff_multiplayer_bridge.js'");
const progressPos=game.indexOf("'js/race_progress_sync.js'");
if(desktopPos<0||statePos<0||desktopPos>statePos){console.error('❌ Desktop width module must load before state_content');process.exit(1);}
if(bridgePos<0||progressPos<0||bridgePos>progressPos){console.error('❌ Race progress sync must load after multiplayer bridge');process.exit(1);}

console.log('✅ Race height HUD uses one live progress source and suppresses the legacy HUD');
console.log('✅ Desktop gameplay is centered and capped at 620px with corrected pointer coordinates');
