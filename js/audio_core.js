let musicEnabled=localStorage.skyPuffMusicEnabled!=='0';
let musicVolume=Math.max(0,Math.min(1,Number(localStorage.skyPuffMusicVolume||.55)));
bgMusicEl.volume=musicVolume;
musicVolumeEl.value=Math.round(musicVolume*100);
function refreshAudioUI(){musicToggleEl.textContent=musicEnabled?tr('on'):tr('off');audioSettingsBtnEl.textContent=musicEnabled?'🔊':'🔇';audioTitleEl.textContent=tr('audio');musicLabelEl.textContent=tr('music');volumeLabelEl.textContent=tr('musicVolume');closeAudioSettingsEl.textContent=tr('back');}
function startMusic(){if(!musicEnabled||bossMusicId)return;bgMusicEl.volume=musicVolume;const p=bgMusicEl.play();if(p&&p.catch)p.catch(()=>{});}
function stopMusic(){bgMusicEl.pause();}
let bossAudioCtx=null,bossMusicTimer=null,bossMusicStep=0,bossMusicId=null,bossMusicGain=null;
const bossMusicThemes={storm:{bpm:148,root:146.83,scale:[0,3,7,10,12,15,19,22],wave:'square'},candy:{bpm:164,root:196.00,scale:[0,4,7,11,12,16,19,23],wave:'triangle'},ice:{bpm:126,root:130.81,scale:[0,2,7,9,12,14,19,21],wave:'sine'},galaxy:{bpm:176,root:110.00,scale:[0,3,7,8,12,15,19,20,24],wave:'sawtooth'}};
function bossFreq(root,semitone){return root*Math.pow(2,semitone/12)}
