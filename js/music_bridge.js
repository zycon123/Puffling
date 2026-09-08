startMusic=function(){
 if(!musicEnabled||bossMusicId)return;
 if(window.setSkyThemeVolume)window.setSkyThemeVolume(musicVolume);
 if(window.startSkyTheme)window.startSkyTheme();
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
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(window.stopSkyTheme)window.stopSkyTheme();}
 else if(musicEnabled&&!boss)startMusic();
});
