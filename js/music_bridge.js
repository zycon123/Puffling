startMusic=function(){
 if(!musicEnabled||bossMusicId)return;
 if(window.startSkyTheme)window.startSkyTheme();
 if(window.setSkyThemeVolume)window.setSkyThemeVolume(musicVolume);
};
stopMusic=function(){
 bgMusicEl.pause();
 if(window.stopSkyTheme)window.stopSkyTheme();
};
const __skyStartBossMusic=startBossMusic;
startBossMusic=function(id){
 if(window.stopSkyTheme)window.stopSkyTheme();
 return __skyStartBossMusic(id);
};
if(musicVolumeEl){
 musicVolumeEl.addEventListener('input',()=>{
  if(window.setSkyThemeVolume)window.setSkyThemeVolume(musicVolume);
 });
}
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(window.stopSkyTheme)window.stopSkyTheme();}
 else if(musicEnabled&&!boss)startMusic();
});
