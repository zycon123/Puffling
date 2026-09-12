/* Orbuff — 36 additional Orbuffs v1.1 (legacy filename retained) */
(function(){
 const F=window.SkyPuffFusion;if(!F||!F.BASE)return;
 const add=[
  ['nib','Nib Orbuff','🟤','common','jumpControl',['#efe2c6','#9d7e58'],'•'],
  ['pogo','Pogo Orbuff','🟢','common','jumpControl',['#dff5a6','#76ad42'],'↟'],
  ['wisp','Wisp Orbuff','〰️','common','airDash',['#edf7ff','#91b7d6'],'~'],
  ['doodle','Doodle Orbuff','✏️','common','rainbowGain',['#fff2c9','#c9955d'],'✎'],
  ['pippin','Pippin Orbuff','🍏','common','jumpControl',['#e5f7a9','#76ad4f'],'●'],
  ['glint','Glint Orbuff','🔹','common','chainShot',['#dff8ff','#6caed6'],'✧'],
  ['mallow','Mallow Orbuff','🍡','common','freeze',['#fff0f6','#d99caf'],'○'],
  ['tumble','Tumble Orbuff','🌀','common','airDash',['#e7f4ff','#7c9fc1'],'↻'],
  ['nudge','Nudge Orbuff','👉','common','blastDamage',['#fff0d4','#d5a35e'],'›'],
  ['soot','Soot Orbuff','⚫','common','blastDamage',['#d5d5d5','#555555'],'●'],

  ['halo','Halo Orbuff','😇','rare','rainbowGain',['#fff7c1','#e2bd58'],'◉'],
  ['bramble','Bramble Orbuff','🌿','rare','blastDamage',['#d8efb0','#527f45'],'✤'],
  ['torrent','Torrent Orbuff','💦','rare','freeze',['#dff7ff','#438cc5'],'≈'],
  ['cinder','Cinder Orbuff','🧨','rare','blastDamage',['#ffd2a1','#d9653f'],'✹'],
  ['pulse','Pulse Orbuff','💓','rare','chainShot',['#ffd7e7','#ca5e89'],'⌁'],
  ['nimbus','Nimbus Orbuff','☁️','rare','airDash',['#f5fbff','#8fb3cf'],'☁'],
  ['rune','Rune Orbuff','🔮','rare','rainbowGain',['#ead9ff','#7961b6'],'ᚱ'],
  ['glacier','Glacier Orbuff','🧊','rare','freeze',['#e9fbff','#6db8d8'],'❅'],

  ['helix','Helix Orbuff','🧬','epic','chainShot',['#e6dcff','#785dc5'],'⌬'],
  ['overdrive','Overdrive Orbuff','🏎️','epic','airDash',['#fff0ae','#e56c48'],'»'],
  ['frostbite','Frostbite Orbuff','🥶','epic','freeze',['#e7fbff','#4c8fd1'],'✣'],
  ['starforge','Starforge Orbuff','🌠','epic','blastDamage',['#fff0af','#c86549'],'✦'],
  ['dreamveil','Dreamveil Orbuff','🌙','epic','phaseDash',['#eadfff','#6554a7'],'☾'],
  ['quakewing','Quakewing Orbuff','🪽','epic','blastDamage',['#f1dfc6','#84644c'],'✶'],
  ['radiant','Radiant Orbuff','🌞','epic','rainbowGain',['#fff5b6','#e0a13e'],'☀'],
  ['stormcore','Stormcore Orbuff','🌩️','epic','chainShot',['#dfe8ff','#4f68b4'],'ϟ'],

  ['titanflare','Titanflare Orbuff','🔥','legendary','blastDamage',['#ffe09f','#b9302d'],'♨'],
  ['voidheart','Voidheart Orbuff','🖤','legendary','phaseDash',['#c9b8eb','#241c43'],'◆'],
  ['chronos','Chronos Orbuff','⏱️','legendary','phaseDash',['#efe2b7','#6b59a8'],'⌛'],
  ['leviathan','Leviathan Orbuff','🐉','legendary','freeze',['#c9f4ff','#2f709e'],'≋'],
  ['zenith','Zenith Orbuff','🔆','legendary','rainbowChain',['#fff3ae','#d27635'],'✺'],
  ['empyrean','Empyrean Orbuff','👑','legendary','rainbowChain',['#fff6ce','#9d71d8'],'♛'],
  ['nightfall','Nightfall Orbuff','🌑','legendary','phaseDash',['#bdbbd9','#2e315a'],'☽'],
  ['arcstorm','Arcstorm Orbuff','⚡','legendary','chainShot',['#f4f0a4','#4d68c4'],'ϟ'],
  ['everfrost','Everfrost Orbuff','❄️','legendary','freeze',['#efffff','#589bc6'],'❄'],
  ['worldroot','Worldroot Orbuff','🌳','legendary','jumpControl',['#dff0af','#4d7540'],'♣']
 ];
 for(const [id,name,icon,rarity,ability,palette,mark] of add){
  if(!F.BASE[id])F.BASE[id]={id,name,icon,rarity,ability,value:rarity==='legendary'?1.45:rarity==='epic'?1.24:rarity==='rare'?1.10:1.00,palette,mark,collection:true};
 }
 const api={count:add.length,ids:add.map(x=>x[0]),legendaryIds:add.filter(x=>x[3]==='legendary').map(x=>x[0])};
 window.OrbuffExpansion36=api;
 window.PufflingExpansion36=api;
})();