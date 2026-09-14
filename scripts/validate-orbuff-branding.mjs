import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const fail=msg=>{throw new Error(msg)};

const rebrand=read('js/puffling_rebrand.js');
const gameplay=read('js/puffling_gameplay.js');
const progression=read('js/puffling_progression.js');
const creator=read('js/boss_puff_creator_v2.js');
const bossUnlock=read('js/boss_puff_main_unlock.js');
const economy=read('js/reward_economy_hardening.js');

for(const token of ['patchToast','BOSS ORBUFF','RAINBOW BOOST','window.showToast=wrapped']){
  if(!rebrand.includes(token))fail(`Rebrand layer missing ${token}`);
}
if(gameplay.includes('Ingen aktiv Puffling'))fail('Active gameplay HUD can still show Puffling');
if(progression.includes("p?.name||'Puffling'"))fail('Level-up fallback can still show Puffling');
for(const [name,source] of [['Boss Creator',creator],['Boss main unlock',bossUnlock],['Reward copy',economy]]){
  if(/Boss Puff(?![A-Za-z])/i.test(source))fail(`${name} still contains player-facing Boss Puff copy`);
}
for(const token of ['alle 10 bossene','all 10 bosses'])if(!creator.includes(token))fail(`Boss Orbuff Creator missing 10-boss rule: ${token}`);
if(!bossUnlock.includes("IDS=['storm','candy','ice','galaxy','solar','void','thunder','crystal','inferno','cosmic']"))fail('Boss Orbuff unlock no longer requires all 10 boss IDs');

console.log('✅ Orbuff branding validated: toast normalization, HUD/level copy, Boss Orbuff Creator and 10-boss unlock rules');
