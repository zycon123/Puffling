import fs from 'node:fs';

const src=fs.readFileSync(new URL('../js/steal_my_puff_ui.js',import.meta.url),'utf8');
const required=[
  ['live height resolver','function liveHudHeights'],
  ['live player score',"typeof score!=='undefined'"],
  ['live opponent score',"typeof multiplayerOpponentScore!=='undefined'"],
  ['ghost fallback height','SkyPuffRaceGhost?.status?.().last?.height'],
  ['animation-frame HUD loop','function startHudLoop'],
  ['ghost event refresh',"addEventListener('race:ghost'"],
  ['clamped player bar','Math.max(0,Math.min(100,youH/goal*100))'],
  ['clamped rival bar','Math.max(0,Math.min(100,rivalH/goal*100))']
];
for(const [label,token] of required){
  if(!src.includes(token)){
    console.error(`❌ Race HUD missing ${label}`);
    process.exit(1);
  }
}
console.log('✅ Race height HUD follows live player and ghost progress');
