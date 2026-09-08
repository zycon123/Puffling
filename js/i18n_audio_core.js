const i18n={
 no:{
  play:'SPILL',upgrade:'OPPGRADER',skins:'SKINS',daily:'DAGLIG BELØNNING',
  tag:'Nye himler. Nye utfordringer. Samme regnbuefis. ☁️🌈💨',
  hint:'Bosser ved 1200, 2000, 3000 og 4500 m.<br>Dobbelttrykk for Rainbow Puff.',
  best:'Best',bank:'Bank',total:'Total',streak:'Streak',
  mission:'Mission',back:'TILBAKE',retry:'PRØV IGJEN',menu:'MENY',continue:'FORTSETT',
  shopTitle:'Sky Cosmetics',upTitle:'Oppgraderinger',gameOver:'Puff down! 💨',missionComplete:'Mission fullført! ⭐',
  pause:'Pause',resume:'FORTSETT',mainMenu:'HOVEDMENY',
  pauseText:'Sky Puff tar en liten pust i bakken ☁️',
  skinsLabel:'Skins',faceLabel:'Ansikt',hatsLabel:'Hatter',trailsLabel:'Spor',
  upgradeText:'Bruk permanente mynter for å bli sterkere i alle fremtidige runder.',
  height:'Høyde',coins:'Mynter',bestCombo:'Beste combo',
  dailyClaimed:'Daglig belønning er allerede hentet',
  dailyReward:'Daglig streak {streak}: +{reward} 🪙',
  needCoins:'Ikke nok mynter',maxLevel:'Maks nivå',upgraded:'{name} oppgradert!',
  needHeight:'Trenger {need} m total høyde',bossUnlock:'Beseir bossen for å låse opp',
  shieldSaved:'Skjold reddet deg! 🛡️',megaSmash:'MEGA SMASH!',shield:'SKJOLD! 🛡️',magnet:'MYNTMAGNET! 🧲',mega:'MEGA PUFF! ☁️',
  bossHit:'Boss truffet! 🌈',bossDefeated:'{name} beseiret! +{reward} 🪙',bossCosmetic:'Ny boss-cosmetic låst opp! 🎁',
  missionReward:'Du fikk {reward} mynter!',bossIncoming:'BOSS KOMMER!',leaderboard:'HIGHSCORE',globalHighscore:'Global Highscore',refresh:'OPPDATER',loading:'Laster...',noScores:'Ingen scores ennå',scoreSendFail:'Kunne ikke sende highscore',namePlaceholder:'Spillernavn',audio:'Lyd',music:'Musikk',musicVolume:'Musikkvolum',on:'PÅ',off:'AV'
 },
 en:{
  play:'PLAY',upgrade:'UPGRADES',skins:'SKINS',daily:'DAILY REWARD',
  tag:'New skies. New challenges. Same rainbow fart. ☁️🌈💨',
  hint:'Bosses at 1200, 2000, 3000 and 4500 m – then the climb continues forever with new boss rounds.<br>Double-tap for Rainbow Puff.',
  best:'Best',bank:'Bank',total:'Total',streak:'Streak',
  mission:'Mission',back:'BACK',retry:'TRY AGAIN',menu:'MENU',continue:'CONTINUE',
  shopTitle:'Sky Cosmetics',upTitle:'Upgrades',gameOver:'Puff down! 💨',missionComplete:'Mission complete! ⭐',
  pause:'Pause',resume:'CONTINUE',mainMenu:'MAIN MENU',
  pauseText:'Sky Puff is taking a tiny breather ☁️',
  skinsLabel:'Skins',faceLabel:'Face',hatsLabel:'Hats',trailsLabel:'Trails',
  upgradeText:'Spend permanent coins to become stronger in every future run.',
  height:'Height',coins:'Coins',bestCombo:'Best combo',
  dailyClaimed:'Daily reward already claimed',
  dailyReward:'Daily streak {streak}: +{reward} 🪙',
  needCoins:'Not enough coins',maxLevel:'Max level',upgraded:'{name} upgraded!',
  needHeight:'Need {need} m total height',bossUnlock:'Defeat the boss to unlock',
  shieldSaved:'Shield saved you! 🛡️',megaSmash:'MEGA SMASH!',shield:'SHIELD! 🛡️',magnet:'COIN MAGNET! 🧲',mega:'MEGA PUFF! ☁️',
  bossHit:'Boss hit! 🌈',bossDefeated:'{name} defeated! +{reward} 🪙',bossCosmetic:'New boss cosmetic unlocked! 🎁',
  missionReward:'You got {reward} coins!',bossIncoming:'BOSS INCOMING!',leaderboard:'HIGHSCORE',globalHighscore:'Global Highscore',refresh:'REFRESH',loading:'Loading...',noScores:'No scores yet',scoreSendFail:'Could not submit score',namePlaceholder:'Player name',audio:'Audio',music:'Music',musicVolume:'Music volume',on:'ON',off:'OFF'
 }
};
let lang=localStorage.skyPuffLang||'no';
function tr(key,vars={}){const t=(i18n[lang]&&i18n[lang][key])||i18n.no[key]||key;return Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),t);}
let musicEnabled=localStorage.skyPuffMusicEnabled!=='0';
let musicVolume=Math.max(0,Math.min(1,Number(localStorage.skyPuffMusicVolume||.55)));
bgMusicEl.volume=musicVolume;
musicVolumeEl.value=Math.round(musicVolume*100);
function refreshAudioUI(){musicToggleEl.textContent=musicEnabled?tr('on'):tr('off');audioSettingsBtnEl.textContent=musicEnabled?'🔊':'🔇';audioTitleEl.textContent=tr('audio');musicLabelEl.textContent=tr('music');volumeLabelEl.textContent=tr('musicVolume');closeAudioSettingsEl.textContent=tr('back');}
function startMusic(){if(!musicEnabled||bossMusicId)return;bgMusicEl.volume=musicVolume;const p=bgMusicEl.play();if(p&&p.catch)p.catch(()=>{});}
function stopMusic(){bgMusicEl.pause();}
let bossAudioCtx=null,bossMusicTimer=null,bossMusicStep=0,bossMusicId=null,bossMusicGain=null;
const bossMusicThemes={storm:{bpm:148,root:146.83,scale:[0,3,7,10,12,15,19,22],wave:'square'},candy:{bpm:164,root:196.00,scale:[0,4,7,11,12,16,19,23],wave:'triangle'},ice:{bpm:126,root:130.81,scale:[0,2,7,9,12,14,19,21],wave:'sine'},galaxy:{bpm:176,root:110.00,scale:[0,3,7,8,12,15,19,20,24],wave:'sawtooth'}};
const ENDLESS_BOSS_GAP=1500;
function getEndlessBossStage(height){const baseStages=[{id:'storm',name:'Storm Boss',emoji:'🌩️',at:1200},{id:'candy',name:'Candy Dragon',emoji:'🐉',at:2000},{id:'ice',name:'Ice Titan',emoji:'❄️',at:3000},{id:'galaxy',name:'Galaxy King',emoji:'🌌',at:4500}];if(height<baseStages[0].at)return null;for(let i=baseStages.length-1;i>=0;i--){if(height>=baseStages[i].at&&height<(i===baseStages.length-1?baseStages[i].at+ENDLESS_BOSS_GAP:baseStages[i+1].at))return {...baseStages[i],tier:1,at:baseStages[i].at};}const beyond=Math.max(0,height-baseStages[baseStages.length-1].at),cycle=Math.floor(beyond/ENDLESS_BOSS_GAP),idx=cycle%baseStages.length,tier=2+Math.floor(cycle/baseStages.length),at=baseStages[baseStages.length-1].at+(cycle+1)*ENDLESS_BOSS_GAP,b=baseStages[idx];return {...b,tier,at,name:`${b.name} ${tier}`};}
function endlessBossHealth(stage){return Math.round(5*Math.pow(1.22,Math.max(0,(stage.tier||1)-1)));}
function endlessBossReward(stage){return Math.round(150*Math.pow(1.18,Math.max(0,(stage.tier||1)-1)));}
function bossFreq(root,semitone){return root*Math.pow(2,semitone/12)}
