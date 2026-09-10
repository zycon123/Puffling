/* Sky Puff — 36 additional Pufflings v1.0 */
(function(){
 const F=window.SkyPuffFusion;if(!F||!F.BASE)return;
 const add=[
  ['nib','Nib Puffling','🟤','common','jumpControl',['#efe2c6','#9d7e58'],'•'],
  ['pogo','Pogo Puffling','🟢','common','jumpControl',['#dff5a6','#76ad42'],'↟'],
  ['wisp','Wisp Puffling','〰️','common','airDash',['#edf7ff','#91b7d6'],'~'],
  ['doodle','Doodle Puffling','✏️','common','rainbowGain',['#fff2c9','#c9955d'],'✎'],
  ['pippin','Pippin Puffling','🍏','common','jumpControl',['#e5f7a9','#76ad4f'],'●'],
  ['glint','Glint Puffling','🔹','common','chainShot',['#dff8ff','#6caed6'],'✧'],
  ['mallow','Mallow Puffling','🍡','common','freeze',['#fff0f6','#d99caf'],'○'],
  ['tumble','Tumble Puffling','🌀','common','airDash',['#e7f4ff','#7c9fc1'],'↻'],
  ['nudge','Nudge Puffling','👉','common','blastDamage',['#fff0d4','#d5a35e'],'›'],
  ['soot','Soot Puffling','⚫','common','blastDamage',['#d5d5d5','#555555'],'●'],

  ['halo','Halo Puffling','😇','rare','rainbowGain',['#fff7c1','#e2bd58'],'◉'],
  ['bramble','Bramble Puffling','🌿','rare','blastDamage',['#d8efb0','#527f45'],'✤'],
  ['torrent','Torrent Puffling','💦','rare','freeze',['#dff7ff','#438cc5'],'≈'],
  ['cinder','Cinder Puffling','🧨','rare','blastDamage',['#ffd2a1','#d9653f'],'✹'],
  ['pulse','Pulse Puffling','💓','rare','chainShot',['#ffd7e7','#ca5e89'],'⌁'],
  ['nimbus','Nimbus Puffling','☁️','rare','airDash',['#f5fbff','#8fb3cf'],'☁'],
  ['rune','Rune Puffling','🔮','rare','rainbowGain',['#ead9ff','#7961b6'],'ᚱ'],
  ['glacier','Glacier Puffling','🧊','rare','freeze',['#e9fbff','#6db8d8'],'❅'],

  ['helix','Helix Puffling','🧬','epic','chainShot',['#e6dcff','#785dc5'],'⌬'],
  ['overdrive','Overdrive Puffling','🏎️','epic','airDash',['#fff0ae','#e56c48'],'»'],
  ['frostbite','Frostbite Puffling','🥶','epic','freeze',['#e7fbff','#4c8fd1'],'✣'],
  ['starforge','Starforge Puffling','🌠','epic','blastDamage',['#fff0af','#c86549'],'✦'],
  ['dreamveil','Dreamveil Puffling','🌙','epic','phaseDash',['#eadfff','#6554a7'],'☾'],
  ['quakewing','Quakewing Puffling','🪽','epic','blastDamage',['#f1dfc6','#84644c'],'✶'],
  ['radiant','Radiant Puffling','🌞','epic','rainbowGain',['#fff5b6','#e0a13e'],'☀'],
  ['stormcore','Stormcore Puffling','🌩️','epic','chainShot',['#dfe8ff','#4f68b4'],'ϟ'],

  ['titanflare','Titanflare Puffling','🔥','legendary','blastDamage',['#ffe09f','#b9302d'],'♨'],
  ['voidheart','Voidheart Puffling','🖤','legendary','phaseDash',['#c9b8eb','#241c43'],'◆'],
  ['chronos','Chronos Puffling','⏱️','legendary','phaseDash',['#efe2b7','#6b59a8'],'⌛'],
  ['leviathan','Leviathan Puffling','🐉','legendary','freeze',['#c9f4ff','#2f709e'],'≋'],
  ['zenith','Zenith Puffling','🔆','legendary','rainbowChain',['#fff3ae','#d27635'],'✺'],
  ['empyrean','Empyrean Puffling','👑','legendary','rainbowChain',['#fff6ce','#9d71d8'],'♛'],
  ['nightfall','Nightfall Puffling','🌑','legendary','phaseDash',['#bdbbd9','#2e315a'],'☽'],
  ['arcstorm','Arcstorm Puffling','⚡','legendary','chainShot',['#f4f0a4','#4d68c4'],'ϟ'],
  ['everfrost','Everfrost Puffling','❄️','legendary','freeze',['#efffff','#589bc6'],'❄'],
  ['worldroot','Worldroot Puffling','🌳','legendary','jumpControl',['#dff0af','#4d7540'],'♣']
 ];
 for(const [id,name,icon,rarity,ability,palette,mark] of add){
  if(!F.BASE[id])F.BASE[id]={id,name,icon,rarity,ability,value:rarity==='legendary'?1.45:rarity==='epic'?1.24:rarity==='rare'?1.10:1.00,palette,mark,collection:true};
 }
 window.PufflingExpansion36={count:add.length,ids:add.map(x=>x[0]),legendaryIds:add.filter(x=>x[3]==='legendary').map(x=>x[0])};
})();