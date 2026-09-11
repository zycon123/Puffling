function renderLeaderboardRows(rows,label){
 leaderboardListEl.innerHTML='';
 leaderboardStatusEl.textContent=label||'';
 if(!rows.length){leaderboardStatusEl.textContent=tr('noScores');return;}
 leaderboardListEl.innerHTML=rows.slice(0,20).map((row,i)=>{
   const safeName=String(row.name||'SkyPuff').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
   const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}.`;
   return `<div style="display:grid;grid-template-columns:42px 1fr auto;gap:8px;align-items:center;padding:9px 10px;margin:5px 0;background:#eef8ff;border-radius:13px;font-weight:800"><span>${medal}</span><span>${safeName}</span><span>${Number(row.height)||0} m</span></div>`;
 }).join('');
}
async function loadLeaderboard(){
 leaderboardStatusEl.textContent=tr('loading');
 leaderboardListEl.innerHTML='';
 const localRows=typeof readLocalScores==='function'?readLocalScores():[];
 if(!API_BASE){renderLeaderboardRows(localRows,lang==='no'?'BETA • Lokal highscore':'BETA • Local highscore');return;}
 try{
   const r=await fetch(API_BASE+'/leaderboard?limit=20',{cache:'no-store'});
   if(!r.ok)throw new Error('HTTP '+r.status);
   const rows=await r.json();
   renderLeaderboardRows(Array.isArray(rows)?rows:[], tr('globalHighscore'));
 }catch(e){
   console.warn('Leaderboard unavailable; showing local scores',e);
   renderLeaderboardRows(localRows,lang==='no'?'⚠️ Frakoblet • Lokal highscore':'⚠️ Offline • Local highscore');
 }
}
function applyLanguage(){
 const t=i18n[lang]||i18n.no;
 languageSelectEl.value=lang;playBtnEl.textContent=t.play;upgradeBtnEl.textContent=t.upgrade;shopBtnEl.textContent=t.skins;dailyBtnEl.textContent=t.daily;leaderboardBtnEl.textContent='🏆 '+t.leaderboard;leaderboardTitleEl.textContent=t.globalHighscore;refreshLeaderboardEl.textContent=t.refresh;closeLeaderboardEl.textContent=t.back;playerNameEl.placeholder=t.namePlaceholder;menuTagEl.innerHTML=t.tag;if(menuHintEl)menuHintEl.innerHTML=t.hint;
 bestStatEl.innerHTML=`🏆 ${t.best}<br><span id="bestHeight">${save.best}</span> m`;bankStatEl.innerHTML=`💰 ${t.bank}<br><span id="bankCoins">${save.bank}</span>`;totalStatEl.innerHTML=`📈 ${t.total}<br><span id="totalHeight">${save.total}</span> m`;streakStatEl.innerHTML=`🔥 ${t.streak}<br><span id="menuStreak">${save.streak}</span>`;
 closeShopEl.textContent=t.back;closeUpgradesEl.textContent=t.back;retryBtnEl.textContent=t.retry;menuBtnEl.textContent=t.menu;if(continueBtnEl)continueBtnEl.textContent=t.continue;
 const pt=document.getElementById('pauseTitle');if(pt)pt.textContent=t.pause;if(resumeBtnEl)resumeBtnEl.textContent=t.resume;if(pauseMenuBtnEl)pauseMenuBtnEl.textContent=t.mainMenu;if(pauseTextEl)pauseTextEl.textContent=t.pauseText;
 document.querySelector('#shop h1').textContent=t.shopTitle;document.querySelector('#upgrades h1').textContent=t.upTitle;document.querySelector('#gameOver h1').textContent=t.gameOver;const mct=document.getElementById('missionCompleteTitle');if(mct)mct.textContent=t.missionComplete;
 if(skinsLabelEl)skinsLabelEl.textContent=t.skinsLabel;if(faceLabelEl)faceLabelEl.textContent=t.faceLabel;if(hatsLabelEl)hatsLabelEl.textContent=t.hatsLabel;if(trailsLabelEl)trailsLabelEl.textContent=t.trailsLabel;if(upgradeTextEl)upgradeTextEl.textContent=t.upgradeText;
 if(goHeightLabelEl)goHeightLabelEl.textContent=t.height;if(goCoinsLabelEl)goCoinsLabelEl.textContent=t.coins;if(goComboLabelEl)goComboLabelEl.textContent=t.bestCombo;if(goBankLabelEl)goBankLabelEl.textContent=t.bank;
 if(multiplayerBtnEl)multiplayerBtnEl.textContent=t.multiplayer+' ⚔️';if(bossRushBtnEl)bossRushBtnEl.textContent=t.bossRush+' 👑';if(achievementsBtnEl)achievementsBtnEl.textContent=t.achievements+' 🏅';if(diagnosticsBtnEl)diagnosticsBtnEl.textContent=t.diagnostics+' 🛠️';if(audioSettingsBtnEl)audioSettingsBtnEl.setAttribute('aria-label',t.audio);
 const mpTitle=document.querySelector('#multiplayerMenu h1');if(mpTitle)mpTitle.textContent=t.multiplayer+' ⚔️';const mpIntro=document.querySelector('#multiplayerMenu .small');if(mpIntro)mpIntro.textContent=t.multiplayerIntro;if(quickMatchBtnEl)quickMatchBtnEl.textContent=t.quickMatch;if(createRoomBtnEl)createRoomBtnEl.textContent=t.createRoom;if(joinRoomBtnEl)joinRoomBtnEl.textContent=t.joinRoom;if(multiplayerStatusEl&&multiplayerState==='idle')multiplayerStatusEl.textContent=t.notConnected;if(closeMultiplayerEl)closeMultiplayerEl.textContent=t.back;
 const brTitle=document.querySelector('#bossRushMenu h1');if(brTitle)brTitle.textContent=t.bossRush+' 👑';const brIntro=document.querySelector('#bossRushMenu .small');if(brIntro)brIntro.textContent=t.bossRushIntro;if(closeBossRushEl)closeBossRushEl.textContent=t.back;
 const achTitle=document.querySelector('#achievementsMenu h1');if(achTitle)achTitle.textContent=t.achievementsTitle+' 🏅';if(closeAchievementsEl)closeAchievementsEl.textContent=t.back;
 const diagTitle=document.querySelector('#diagnosticsMenu h1');if(diagTitle)diagTitle.textContent=t.systemTitle+' 🛠️';if(diagnosticsSummaryEl&&/Laster|Loading|Lädt|Cargando|Chargement/i.test(diagnosticsSummaryEl.textContent))diagnosticsSummaryEl.textContent=t.systemLoading;if(sendBugReportBtnEl)sendBugReportBtnEl.textContent=t.sendReport+' ✉️';if(refreshDiagnosticsBtnEl)refreshDiagnosticsBtnEl.textContent=t.updateStatus;if(closeDiagnosticsEl)closeDiagnosticsEl.textContent=t.back;
 if(audioTitleEl)audioTitleEl.textContent=t.audioTitle;if(musicLabelEl)musicLabelEl.textContent=t.music;if(volumeLabelEl)volumeLabelEl.textContent=t.musicVolume;if(closeAudioSettingsEl)closeAudioSettingsEl.textContent=t.back;
 refreshAudioUI();if(running||paused){const m=missions[missionIndex];if(m)missionEl.textContent=t.mission+': '+missionText(m);}
}
languageSelectEl.addEventListener('change',()=>{lang=languageSelectEl.value;localStorage.skyPuffLang=lang;applyLanguage();});
let W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',resize);resize();
