function bossTone(freq,when,dur,type,vol){
 const o=bossAudioCtx.createOscillator(),g=bossAudioCtx.createGain();
 o.type=type;o.frequency.setValueAtTime(freq,when);
 g.gain.setValueAtTime(.0001,when);
 g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),when+.012);
 g.gain.exponentialRampToValueAtTime(.0001,when+dur);
 o.connect(g);g.connect(bossMusicGain);o.start(when);o.stop(when+dur+.03);
}
function bossKick(when,vol=.18){
 const o=bossAudioCtx.createOscillator(),g=bossAudioCtx.createGain();
 o.type='sine';o.frequency.setValueAtTime(125,when);o.frequency.exponentialRampToValueAtTime(42,when+.12);
 g.gain.setValueAtTime(vol,when);g.gain.exponentialRampToValueAtTime(.0001,when+.16);
 o.connect(g);g.connect(bossMusicGain);o.start(when);o.stop(when+.18);
}
function scheduleBossBeat(){
 if(!bossMusicId||!bossAudioCtx)return;
 const th=bossMusicThemes[bossMusicId],beat=60/th.bpm,now=bossAudioCtx.currentTime+.025;
 const st=bossMusicStep++;
 const patterns={storm:[0,7,3,10,7,12,10,7,0,7,15,12,10,7,3,10],candy:[0,4,7,11,12,7,16,11,4,7,12,16,19,16,12,7],ice:[0,7,2,9,7,12,9,7,0,7,14,12,9,7,2,7],galaxy:[0,7,12,15,19,15,12,8,0,8,12,19,24,20,15,12]};
 const p=patterns[bossMusicId],semi=p[st%p.length];
 bossTone(bossFreq(th.root,semi),now,beat*.72,th.wave,bossMusicId==='galaxy'?.065:.055);
 if(st%2===0)bossTone(bossFreq(th.root,-12+(st%4===0?0:7)),now,beat*.85,'square',.035);
 if(st%4===0)bossKick(now,bossMusicId==='galaxy'?.22:.16);
 if(bossMusicId==='storm'&&st%4===2)bossTone(bossFreq(th.root,24),now,beat*.16,'sawtooth',.025);
 if(bossMusicId==='candy'&&st%2===1)bossTone(bossFreq(th.root,12+th.scale[st%th.scale.length]),now,beat*.28,'triangle',.028);
 if(bossMusicId==='ice'&&st%4===0)bossTone(bossFreq(th.root,24+th.scale[(st/4)%th.scale.length|0]),now,beat*2.8,'sine',.025);
 if(bossMusicId==='galaxy'&&st%4===0)[0,7,12].forEach((x,i)=>bossTone(bossFreq(th.root,x),now,beat*1.8,'sawtooth',.018-i*.003));
}

let bossRushMode=false,bossRushSelected=null;
let multiplayerMode=false;
let multiplayerState='idle';
let multiplayerRoom='';
let multiplayerOpponentScore=0;
let multiplayerEndAt=0;
let multiplayerInterval=null;
let multiplayerRaceSeconds=90;
function randomRoomCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s;}
function openMultiplayer(){if(bossRushMenuEl)bossRushMenuEl.style.display='none';if(multiplayerMenuEl)multiplayerMenuEl.style.display='flex';if(multiplayerStatusEl)multiplayerStatusEl.textContent='Velg hvordan du vil spille';if(roomCodeDisplayEl)roomCodeDisplayEl.textContent='';}
function closeMultiplayer(){if(multiplayerMenuEl)multiplayerMenuEl.style.display='none';}
function createFriendRoom(){multiplayerRoom=randomRoomCode();multiplayerState='waiting';if(roomCodeDisplayEl)roomCodeDisplayEl.textContent=multiplayerRoom;if(multiplayerStatusEl)multiplayerStatusEl.textContent='Del koden med en venn. Simulert motstander kobles til om et øyeblikk.';setTimeout(()=>startMultiplayerRace('friend'),700);}
function quickMatch(){multiplayerState='searching';if(multiplayerStatusEl)multiplayerStatusEl.textContent='Søker etter motstander...';setTimeout(()=>startMultiplayerRace('random'),700);}
function joinFriendRoom(){const code=(roomCodeInputEl?.value||'').trim().toUpperCase();if(code.length<4){if(multiplayerStatusEl)multiplayerStatusEl.textContent='Skriv inn en gyldig vennekode';return;}multiplayerRoom=code;if(multiplayerStatusEl)multiplayerStatusEl.textContent='Kobler til rom '+code+'...';setTimeout(()=>startMultiplayerRace('friend'),500);}
function startMultiplayerRace(type){closeMultiplayer();bossRushMode=false;reset();multiplayerMode=true;multiplayerState='racing';multiplayerOpponentScore=0;multiplayerEndAt=Date.now()+multiplayerRaceSeconds*1000;if(multiplayerHudEl)multiplayerHudEl.style.display='block';if(mpRivalEl)mpRivalEl.textContent='0m';if(mpYouEl)mpYouEl.textContent='0m';if(mpTimerEl)mpTimerEl.textContent=multiplayerRaceSeconds;startEl.style.display='none';running=true;paused=false;lastTime=performance.now();startMusic();if(multiplayerInterval)clearInterval(multiplayerInterval);multiplayerInterval=setInterval(multiplayerTick,500);requestAnimationFrame(loop);showToast(type==='random'?'Motstander funnet! ⚔️':'Vennekamp startet! ⚔️');}
function multiplayerTick(){if(!multiplayerMode||multiplayerState!=='racing')return;const remaining=Math.max(0,Math.ceil((multiplayerEndAt-Date.now())/1000));if(mpTimerEl)mpTimerEl.textContent=remaining;if(mpYouEl)mpYouEl.textContent=Math.floor(score)+'m';const difficulty=.76+Math.random()*.18;multiplayerOpponentScore=Math.max(multiplayerOpponentScore,multiplayerOpponentScore+(8+Math.random()*18)*difficulty);if(mpRivalEl)mpRivalEl.textContent=Math.floor(multiplayerOpponentScore)+'m';if(remaining<=0)finishMultiplayerRace();}
function finishMultiplayerRace(){if(!multiplayerMode)return;multiplayerMode=false;multiplayerState='finished';running=false;if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);let msg='';if(you>rival){msg=`DU VANT! ${you}m - ${rival}m 🏆`;save.bank=(save.bank||0)+75;persist();refreshMenu();}else if(you<rival)msg=`Rivalen vant ${rival}m - ${you}m`;else msg=`UAVGJORT! ${you}m`;showToast(msg);setTimeout(()=>{showMainMenu();},500);}

const bossRushBaseStages=[{id:'storm',name:'Storm Boss',emoji:'🌩️',at:1200},{id:'candy',name:'Candy Dragon',emoji:'🐉',at:2000},{id:'ice',name:'Ice Titan',emoji:'❄️',at:3000},{id:'galaxy',name:'Galaxy King',emoji:'🌌',at:4500}];
function bossSaveKey(id){return'boss'+id.charAt(0).toUpperCase()+id.slice(1);}
function isBossUnlockedForRush(id){try{return !!(save&&save[bossSaveKey(id)]);}catch(e){return false;}}
function renderBossRush(){if(!bossRushListEl)return;bossRushListEl.innerHTML='';let any=false;bossRushBaseStages.forEach(stage=>{if(!isBossUnlockedForRush(stage.id))return;any=true;const b=document.createElement('button');b.className='secondary';b.style.margin='6px';b.innerHTML=`${stage.emoji} ${stage.name}<br><span style="font-size:12px">Reward: 100 🪙</span>`;b.onclick=()=>startBossRush(stage);bossRushListEl.appendChild(b);});if(!any)bossRushListEl.innerHTML='<div class="small">Beseir en boss i hovedspillet først for å låse den opp her.</div>';}
function openBossRush(){if(multiplayerMenuEl)multiplayerMenuEl.style.display='none';if(multiplayerHudEl)multiplayerHudEl.style.display='none';renderBossRush();if(bossRushMenuEl)bossRushMenuEl.style.display='flex';}
function closeBossRush(){if(bossRushMenuEl)bossRushMenuEl.style.display='none';}
function startBossRush(stage){closeBossRush();reset();bossRushMode=true;bossRushSelected={...stage,tier:1};paused=false;running=true;startEl.style.display='none';gameOverEl.style.display='none';missionCompleteEl.style.display='none';shopEl.style.display='none';upgradesEl.style.display='none';if(audioSettingsEl)audioSettingsEl.style.display='none';if(leaderboardMenuEl)leaderboardMenuEl.style.display='none';const realStage=bossStages.find(b=>b.id===stage.id);if(!realStage){bossRushMode=false;running=false;showToast('Kunne ikke starte bossen');showMainMenu();return;}spawnBoss({...realStage,tier:1});lastTime=performance.now();requestAnimationFrame(loop);}
function finishBossRushWin(){const reward=100;save.bank=(save.bank||0)+reward;persist();refreshMenu();bossRushMode=false;bossRushSelected=null;boss=null;bossSpawned=false;bossArena=false;bossArenaY=0;playerShots=[];bossShots=[];running=false;paused=false;stopBossMusic(false);if(bossWrap)bossWrap.style.display='none';if(bossWarningEl)bossWarningEl.style.display='none';if(bossRushMenuEl)bossRushMenuEl.style.display='none';showToast(`Boss beseiret! +${reward} 🪙`);setTimeout(()=>{showMainMenu();renderBossRush();},350);}
function startBossMusic(id){if(!musicEnabled||!bossMusicThemes[id])return;stopBossMusic(false);try{bossAudioCtx=bossAudioCtx||new(window.AudioContext||window.webkitAudioContext)();if(bossAudioCtx.state==='suspended')bossAudioCtx.resume();bossMusicGain=bossAudioCtx.createGain();bossMusicGain.gain.value=Math.max(.04,musicVolume*.42);bossMusicGain.connect(bossAudioCtx.destination);bossMusicId=id;bossMusicStep=0;bgMusicEl.pause();const beat=60/bossMusicThemes[id].bpm;scheduleBossBeat();bossMusicTimer=setInterval(scheduleBossBeat,beat*1000);}catch(e){startMusic();}}
function stopBossMusic(resumeNormal=true){if(bossMusicTimer){clearInterval(bossMusicTimer);bossMusicTimer=null}bossMusicId=null;bossMusicStep=0;if(bossMusicGain&&bossAudioCtx){try{const t=bossAudioCtx.currentTime;bossMusicGain.gain.cancelScheduledValues(t);bossMusicGain.gain.setValueAtTime(Math.max(.0001,bossMusicGain.gain.value),t);bossMusicGain.gain.exponentialRampToValueAtTime(.0001,t+.22);}catch(e){}}bossMusicGain=null;if(resumeNormal&&musicEnabled)setTimeout(()=>startMusic(),180);}
audioSettingsBtnEl.onclick=()=>{audioSettingsEl.style.display='flex';refreshAudioUI();};
closeAudioSettingsEl.onclick=()=>audioSettingsEl.style.display='none';
musicToggleEl.onclick=()=>{musicEnabled=!musicEnabled;localStorage.skyPuffMusicEnabled=musicEnabled?'1':'0';if(musicEnabled){if(boss)startBossMusic(boss.id);else startMusic();}else{stopMusic();stopBossMusic(false);}refreshAudioUI();};
musicVolumeEl.oninput=()=>{musicVolume=Number(musicVolumeEl.value)/100;bgMusicEl.volume=musicVolume;if(bossMusicGain)bossMusicGain.gain.value=Math.max(.04,musicVolume*.42);localStorage.skyPuffMusicVolume=String(musicVolume);if(musicEnabled&&bgMusicEl.paused)startMusic();};
startMusic();
document.addEventListener('pointerdown',()=>startMusic(),{once:true});
document.addEventListener('keydown',()=>startMusic(),{once:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)bgMusicEl.pause();else if(musicEnabled)startMusic();});
