/* Orbuff — 50 additional lightweight collectible Orbuffs v2 (legacy filename retained) */
(function(){
 const F=window.SkyPuffFusion;if(!F||!F.BASE)return;
 const add=[
  ['moss','Moss Orbuff','🌿','common','jumpControl',['#b9ef83','#58a85f'],'✿'],
  ['pebble','Pebble Orbuff','🪨','common','blastDamage',['#d6d1c8','#82796e'],'◆'],
  ['bubble','Bubble Orbuff','🫧','common','rainbowGain',['#d9fbff','#6edcf1'],'○'],
  ['sprout','Sprout Orbuff','🌱','common','jumpControl',['#d9f98b','#59b86a'],'♧'],
  ['drizzle','Drizzle Orbuff','🌧️','common','freeze',['#d9efff','#719bd4'],'⌁'],
  ['sand','Sand Orbuff','🏖️','common','blastDamage',['#ffe4a3','#c99a58'],'◈'],
  ['petal','Petal Orbuff','🌸','common','rainbowGain',['#ffd7ec','#ef7eb7'],'✿'],
  ['acorn','Acorn Orbuff','🌰','common','jumpControl',['#dfc08a','#895d35'],'♢'],
  ['mist','Mist Orbuff','🌫️','common','airDash',['#eef8ff','#9eb9ca'],'≈'],
  ['coral','Coral Orbuff','🪸','common','blastDamage',['#ffbdad','#e56f69'],'♨'],
  ['clover','Clover Orbuff','🍀','common','rainbowGain',['#b9f58a','#3ba85c'],'✣'],
  ['snowdrop','Snowdrop Orbuff','💧','common','freeze',['#ecffff','#78cce8'],'❄'],
  ['honey','Honey Orbuff','🍯','common','jumpControl',['#ffe478','#e3a334'],'⬡'],
  ['leaf','Leaf Orbuff','🍃','common','jumpControl',['#d2f690','#5ba95d'],'⌁'],
  ['cloudlet','Cloudlet Orbuff','☁️','common','rainbowGain',['#ffffff','#acdff7'],'☁'],
  ['spark','Spark Orbuff','✨','common','chainShot',['#fff4a0','#f2bb3d'],'✦'],
  ['berry','Berry Orbuff','🫐','common','blastDamage',['#c9b8ff','#6655a8'],'●'],
  ['dew','Dew Orbuff','💦','common','freeze',['#d6ffff','#55bdd8'],'◇'],
  ['feather','Feather Orbuff','🪶','common','airDash',['#fff4e8','#aeb8d3'],'〰'],
  ['pollen','Pollen Orbuff','🌼','common','rainbowGain',['#fff39a','#f0bb48'],'✺'],

  ['moonbeam','Moonbeam Orbuff','🌙','rare','airDash',['#ddd9ff','#6f67b8'],'☾'],
  ['sunflare','Sunflare Orbuff','🌞','rare','blastDamage',['#fff29a','#ff914d'],'☀'],
  ['tidal','Tidal Orbuff','🌊','rare','freeze',['#c5f1ff','#377fd1'],'≈'],
  ['thorn','Thorn Orbuff','🌵','rare','blastDamage',['#c6ef88','#4e8a48'],'✥'],
  ['amber','Amber Orbuff','🟠','rare','rainbowGain',['#ffd47d','#d67a2e'],'◆'],
  ['lunar','Lunar Orbuff','🌘','rare','airDash',['#c9c7e6','#4d4a78'],'◐'],
  ['echo','Echo Orbuff','🔊','rare','chainShot',['#d5c9ff','#7a5cc8'],'≈'],
  ['glimmer','Glimmer Orbuff','💫','rare','rainbowGain',['#fff6bd','#be8cff'],'✧'],
  ['reef','Reef Orbuff','🐚','rare','freeze',['#ffe0d5','#63b9c7'],'◒'],
  ['meteor','Meteor Orbuff','☄️','rare','blastDamage',['#ffc293','#9d4a49'],'☄'],
  ['bloom','Bloom Orbuff','🌺','rare','rainbowGain',['#ffd3ed','#d65b9b'],'✾'],
  ['quartz','Quartz Orbuff','🔷','rare','freeze',['#e3f5ff','#6689d7'],'◇'],
  ['zephyr','Zephyr Orbuff','🌬️','rare','airDash',['#e8ffff','#69c8d5'],'〰'],
  ['static','Static Orbuff','📡','rare','chainShot',['#f4efaf','#7582c6'],'ϟ'],
  ['dusk','Dusk Orbuff','🌆','rare','airDash',['#efc4df','#6d5b94'],'☽'],

  ['nova','Nova Orbuff','🌟','epic','chainShot',['#fff59d','#ff6e6e'],'✹'],
  ['monsoon','Monsoon Orbuff','⛈️','epic','freeze',['#c4efff','#465fba'],'☂'],
  ['wildfire','Wildfire Orbuff','🔥','epic','blastDamage',['#ffd071','#ed493e'],'♨'],
  ['starlight','Starlight Orbuff','⭐','epic','rainbowGain',['#fffbd0','#8d8cff'],'✦'],
  ['phantom','Phantom Orbuff','👻','epic','airDash',['#e8dfff','#62528c'],'☾'],
  ['cyclone','Cyclone Orbuff','🌪️','epic','jumpControl',['#d9fbff','#5da6bc'],'↻'],
  ['geode','Geode Orbuff','💠','epic','freeze',['#e5d7ff','#675ad4'],'✧'],
  ['flare','Flare Orbuff','🔆','epic','blastDamage',['#fff1a3','#f3783f'],'☀'],
  ['mirage','Mirage Orbuff','🔮','epic','airDash',['#eed7ff','#8b59bf'],'◉'],
  ['auric','Auric Orbuff','🟡','epic','rainbowGain',['#fff2a3','#c99a2e'],'♛'],

  ['supernova','Supernova Orbuff','💥','legendary','chainShot',['#fff8ba','#ff4f79'],'✹'],
  ['abyss','Abyss Orbuff','🕳️','legendary','phaseDash',['#9f8ad8','#1f183b'],'◉'],
  ['celestial','Celestial Orbuff','🌌','legendary','rainbowChain',['#e9e4ff','#6751c7'],'✧'],
  ['phoenix','Phoenix Orbuff','🪽','legendary','blastDamage',['#ffe499','#e94d37'],'♨'],
  ['timewarp','Timewarp Orbuff','⌛','legendary','phaseDash',['#f4e4b5','#6d64b6'],'∞']
 ];
 for(const [id,name,icon,rarity,ability,palette,mark] of add){
  if(!F.BASE[id])F.BASE[id]={id,name,icon,rarity,ability,value:1,palette,mark,collection:true};
 }
 const api={count:add.length,ids:add.map(x=>x[0])};
 window.OrbuffExtraCollection=api;
 window.PufflingExtraCollection=api;
})();