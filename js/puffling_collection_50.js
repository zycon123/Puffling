/* Puffling — 50 additional lightweight collectible Pufflings v1 */
(function(){
 const F=window.SkyPuffFusion;if(!F||!F.BASE)return;
 const add=[
  ['moss','Moss Puffling','🌿','common','jumpControl',['#b9ef83','#58a85f'],'✿'],
  ['pebble','Pebble Puffling','🪨','common','blastDamage',['#d6d1c8','#82796e'],'◆'],
  ['bubble','Bubble Puffling','🫧','common','rainbowGain',['#d9fbff','#6edcf1'],'○'],
  ['sprout','Sprout Puffling','🌱','common','jumpControl',['#d9f98b','#59b86a'],'♧'],
  ['drizzle','Drizzle Puffling','🌧️','common','freeze',['#d9efff','#719bd4'],'⌁'],
  ['sand','Sand Puffling','🏖️','common','blastDamage',['#ffe4a3','#c99a58'],'◈'],
  ['petal','Petal Puffling','🌸','common','rainbowGain',['#ffd7ec','#ef7eb7'],'✿'],
  ['acorn','Acorn Puffling','🌰','common','jumpControl',['#dfc08a','#895d35'],'♢'],
  ['mist','Mist Puffling','🌫️','common','airDash',['#eef8ff','#9eb9ca'],'≈'],
  ['coral','Coral Puffling','🪸','common','blastDamage',['#ffbdad','#e56f69'],'♨'],
  ['clover','Clover Puffling','🍀','common','rainbowGain',['#b9f58a','#3ba85c'],'✣'],
  ['snowdrop','Snowdrop Puffling','💧','common','freeze',['#ecffff','#78cce8'],'❄'],
  ['honey','Honey Puffling','🍯','common','jumpControl',['#ffe478','#e3a334'],'⬡'],
  ['leaf','Leaf Puffling','🍃','common','jumpControl',['#d2f690','#5ba95d'],'⌁'],
  ['cloudlet','Cloudlet Puffling','☁️','common','rainbowGain',['#ffffff','#acdff7'],'☁'],
  ['spark','Spark Puffling','✨','common','chainShot',['#fff4a0','#f2bb3d'],'✦'],
  ['berry','Berry Puffling','🫐','common','blastDamage',['#c9b8ff','#6655a8'],'●'],
  ['dew','Dew Puffling','💦','common','freeze',['#d6ffff','#55bdd8'],'◇'],
  ['feather','Feather Puffling','🪶','common','airDash',['#fff4e8','#aeb8d3'],'〰'],
  ['pollen','Pollen Puffling','🌼','common','rainbowGain',['#fff39a','#f0bb48'],'✺'],

  ['moonbeam','Moonbeam Puffling','🌙','rare','airDash',['#ddd9ff','#6f67b8'],'☾'],
  ['sunflare','Sunflare Puffling','🌞','rare','blastDamage',['#fff29a','#ff914d'],'☀'],
  ['tidal','Tidal Puffling','🌊','rare','freeze',['#c5f1ff','#377fd1'],'≈'],
  ['thorn','Thorn Puffling','🌵','rare','blastDamage',['#c6ef88','#4e8a48'],'✥'],
  ['amber','Amber Puffling','🟠','rare','rainbowGain',['#ffd47d','#d67a2e'],'◆'],
  ['lunar','Lunar Puffling','🌘','rare','airDash',['#c9c7e6','#4d4a78'],'◐'],
  ['echo','Echo Puffling','🔊','rare','chainShot',['#d5c9ff','#7a5cc8'],'≈'],
  ['glimmer','Glimmer Puffling','💫','rare','rainbowGain',['#fff6bd','#be8cff'],'✧'],
  ['reef','Reef Puffling','🐚','rare','freeze',['#ffe0d5','#63b9c7'],'◒'],
  ['meteor','Meteor Puffling','☄️','rare','blastDamage',['#ffc293','#9d4a49'],'☄'],
  ['bloom','Bloom Puffling','🌺','rare','rainbowGain',['#ffd3ed','#d65b9b'],'✾'],
  ['quartz','Quartz Puffling','🔷','rare','freeze',['#e3f5ff','#6689d7'],'◇'],
  ['zephyr','Zephyr Puffling','🌬️','rare','airDash',['#e8ffff','#69c8d5'],'〰'],
  ['static','Static Puffling','📡','rare','chainShot',['#f4efaf','#7582c6'],'ϟ'],
  ['dusk','Dusk Puffling','🌆','rare','airDash',['#efc4df','#6d5b94'],'☽'],

  ['nova','Nova Puffling','🌟','epic','chainShot',['#fff59d','#ff6e6e'],'✹'],
  ['monsoon','Monsoon Puffling','⛈️','epic','freeze',['#c4efff','#465fba'],'☂'],
  ['wildfire','Wildfire Puffling','🔥','epic','blastDamage',['#ffd071','#ed493e'],'♨'],
  ['starlight','Starlight Puffling','⭐','epic','rainbowGain',['#fffbd0','#8d8cff'],'✦'],
  ['phantom','Phantom Puffling','👻','epic','airDash',['#e8dfff','#62528c'],'☾'],
  ['cyclone','Cyclone Puffling','🌪️','epic','jumpControl',['#d9fbff','#5da6bc'],'↻'],
  ['geode','Geode Puffling','💠','epic','freeze',['#e5d7ff','#675ad4'],'✧'],
  ['flare','Flare Puffling','🔆','epic','blastDamage',['#fff1a3','#f3783f'],'☀'],
  ['mirage','Mirage Puffling','🔮','epic','airDash',['#eed7ff','#8b59bf'],'◉'],
  ['auric','Auric Puffling','🟡','epic','rainbowGain',['#fff2a3','#c99a2e'],'♛'],

  ['supernova','Supernova Puffling','💥','legendary','chainShot',['#fff8ba','#ff4f79'],'✹'],
  ['abyss','Abyss Puffling','🕳️','legendary','phaseDash',['#9f8ad8','#1f183b'],'◉'],
  ['celestial','Celestial Puffling','🌌','legendary','rainbowChain',['#e9e4ff','#6751c7'],'✧'],
  ['phoenix','Phoenix Puffling','🪽','legendary','blastDamage',['#ffe499','#e94d37'],'♨'],
  ['timewarp','Timewarp Puffling','⌛','legendary','phaseDash',['#f4e4b5','#6d64b6'],'∞']
 ];
 for(const [id,name,icon,rarity,ability,palette,mark] of add){
  if(!F.BASE[id])F.BASE[id]={id,name,icon,rarity,ability,value:1,palette,mark,collection:true};
 }
 window.PufflingExtraCollection={count:add.length,ids:add.map(x=>x[0])};
})();