/* Orbuff single-request browser bundle. Generated in game.js module order. */
(function(){
const FALLBACK_BUILD='5.27-beta.106';let BUILD=FALLBACK_BUILD;try{const src=document.currentScript&&document.currentScript.src;if(src){const v=new URL(src,location.href).searchParams.get('v');if(v)BUILD=v;}}catch(e){}
try{document.title='Orbuff';const set=(sel,text)=>{const el=document.querySelector(sel);if(el)el.textContent=text;};set('#studioSplash .studioGame','ORBUFF');set('#start h1','Orbuff');set('#start .menuVersion','ORBUFF • 5.27 BETA • ZYCON STUDIOS');set('#pauseText','Orbuff tar en liten pust i bakken ☁️');const mp=document.querySelector('#multiplayerMenu .card .small');if(mp&&/90\s*sekunder/i.test(mp.textContent||''))mp.textContent='Race mot en venn eller en tilfeldig spiller. Førstemann til 1500 m vinner.';const timer=document.getElementById('mpTimer');if(timer&&timer.textContent.trim()==='90')timer.textContent='1500 m';}catch(e){}

})();

;/* js/platform_compat.js */
(function(){
  const ua=navigator.userAgent||'';
  const platform={
    ios:/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),
    android:/Android/i.test(ua),
    mobile:/Android|iPhone|iPad|iPod|Mobile/i.test(ua)||(navigator.maxTouchPoints||0)>1,
    touch:'ontouchstart' in window||(navigator.maxTouchPoints||0)>0
  };
  platform.desktop=!platform.mobile;

  let viewport=document.querySelector('meta[name="viewport"]');
  if(!viewport){viewport=document.createElement('meta');viewport.name='viewport';document.head.appendChild(viewport);}
  viewport.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover');

  let theme=document.querySelector('meta[name="theme-color"]');
  if(!theme){theme=document.createElement('meta');theme.name='theme-color';document.head.appendChild(theme);}
  theme.setAttribute('content','#73c9f5');

  if(platform.ios){
    let capable=document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if(!capable){capable=document.createElement('meta');capable.name='apple-mobile-web-app-capable';document.head.appendChild(capable);}
    capable.content='yes';
    let status=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if(!status){status=document.createElement('meta');status.name='apple-mobile-web-app-status-bar-style';document.head.appendChild(status);}
    status.content='black-translucent';
  }

  const setViewportVars=()=>{
    const vv=window.visualViewport;
    const h=vv?vv.height:window.innerHeight;
    const w=vv?vv.width:window.innerWidth;
    document.documentElement.style.setProperty('--sky-vh',`${h}px`);
    document.documentElement.style.setProperty('--sky-vw',`${w}px`);
    document.documentElement.dataset.platform=platform.ios?'ios':platform.android?'android':'desktop';
  };
  setViewportVars();
  window.addEventListener('resize',setViewportVars,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(setViewportVars,120),{passive:true});
  if(window.visualViewport){visualViewport.addEventListener('resize',setViewportVars,{passive:true});visualViewport.addEventListener('scroll',setViewportVars,{passive:true});}

  document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
  document.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
  document.addEventListener('gestureend',e=>e.preventDefault(),{passive:false});
  let lastTouchEnd=0;
  document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<280&&e.target===document.body)e.preventDefault();lastTouchEnd=now;},{passive:false});

  window.skyPuffPlatform={...platform,userAgent:ua,viewport(){return{width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio||1}}};
})();


;/* js/beta_config.js */
var SKY_PUFF_VERSION='5.27-beta.106';
var SKY_PUFF_BETA=true;
var SKY_PUFF_SUPPORT_EMAIL='zyconstudios@protonmail.com';
var SKY_PUFF_RACE_WS_URL='wss://puffling-race-server.onrender.com';
var SKY_PUFF_GAME_API_URL='https://puffling-race-server.onrender.com';
var SKY_PUFF_IAP_VERIFY_URL=SKY_PUFF_GAME_API_URL+'/iap/verify';
window.SKY_PUFF_RACE_WS_URL=SKY_PUFF_RACE_WS_URL;window.SKY_PUFF_GAME_API_URL=SKY_PUFF_GAME_API_URL;window.SKY_PUFF_IAP_VERIFY_URL=SKY_PUFF_IAP_VERIFY_URL;
var API_BASE=SKY_PUFF_GAME_API_URL;try{var storedApiBase=String(localStorage.getItem('skyPuffApiBase')||'').trim();if(storedApiBase)API_BASE=storedApiBase;}catch(e){}API_BASE=String(API_BASE||'').trim().replace(/\/$/,'');
window.skyPuffConfig={version:SKY_PUFF_VERSION,beta:SKY_PUFF_BETA,supportEmail:SKY_PUFF_SUPPORT_EMAIL,raceWsUrl:SKY_PUFF_RACE_WS_URL,gameApiUrl:SKY_PUFF_GAME_API_URL,iapVerifyUrl:SKY_PUFF_IAP_VERIFY_URL,get apiBase(){return API_BASE;},setApiBase(url){API_BASE=String(url||SKY_PUFF_GAME_API_URL||'').trim().replace(/\/$/,'');try{localStorage.setItem('skyPuffApiBase',API_BASE);}catch(e){}return API_BASE;}};


;/* js/dom_refs.js */
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),coinsEl=document.getElementById('coins'),hpEl=document.getElementById('hp'),streakEl=document.getElementById('streak');
const boostEl=document.getElementById('boost'),comboEl=document.getElementById('combo'),toast=document.getElementById('toast'),missionEl=document.getElementById('mission');
const bossWrap=document.getElementById('bossBarWrap'),bossBar=document.getElementById('bossBar'),bossIdentityEl=document.getElementById('bossIdentity'),bossIdentityNameEl=document.getElementById('bossIdentityName'),bossTierEl=document.getElementById('bossTier');
const startEl=document.getElementById('start'),gameOverEl=document.getElementById('gameOver'),missionCompleteEl=document.getElementById('missionComplete'),shopEl=document.getElementById('shop'),upgradesEl=document.getElementById('upgrades');
const playBtnEl=document.getElementById('playBtn'),retryBtnEl=document.getElementById('retryBtn'),menuBtnEl=document.getElementById('menuBtn'),continueBtnEl=document.getElementById('continueBtn'),shopBtnEl=document.getElementById('shopBtn'),closeShopEl=document.getElementById('closeShop'),upgradeBtnEl=document.getElementById('upgradeBtn'),closeUpgradesEl=document.getElementById('closeUpgrades'),dailyBtnEl=document.getElementById('dailyBtn');
const achievementsBtnEl=document.getElementById('achievementsBtn'),achievementsMenuEl=document.getElementById('achievementsMenu'),achievementsSummaryEl=document.getElementById('achievementsSummary'),achievementsListEl=document.getElementById('achievementsList'),closeAchievementsEl=document.getElementById('closeAchievements');
const diagnosticsBtnEl=document.getElementById('diagnosticsBtn'),diagnosticsMenuEl=document.getElementById('diagnosticsMenu'),diagnosticsSummaryEl=document.getElementById('diagnosticsSummary'),diagnosticsListEl=document.getElementById('diagnosticsList'),sendBugReportBtnEl=document.getElementById('sendBugReportBtn'),refreshDiagnosticsBtnEl=document.getElementById('refreshDiagnosticsBtn'),closeDiagnosticsEl=document.getElementById('closeDiagnostics');
const skinrowEl=document.getElementById('skinrow'),facerowEl=document.getElementById('facerow'),hatrowEl=document.getElementById('hatrow'),trailrowEl=document.getElementById('trailrow'),upgraderowEl=document.getElementById('upgraderow');
const missionRewardTextEl=document.getElementById('missionRewardText'),bestHeightEl=document.getElementById('bestHeight'),bankCoinsEl=document.getElementById('bankCoins'),totalHeightEl=document.getElementById('totalHeight'),menuStreakEl=document.getElementById('menuStreak'),finalScoreEl=document.getElementById('finalScore'),finalCoinsEl=document.getElementById('finalCoins'),finalComboEl=document.getElementById('finalCombo'),bankGainEl=document.getElementById('bankGain');
const bgMusicEl=document.getElementById('bgMusic'),audioSettingsBtnEl=document.getElementById('audioSettingsBtn'),audioSettingsEl=document.getElementById('audioSettings'),audioTitleEl=document.getElementById('audioTitle'),musicLabelEl=document.getElementById('musicLabel'),musicToggleEl=document.getElementById('musicToggle'),volumeLabelEl=document.getElementById('volumeLabel'),musicVolumeEl=document.getElementById('musicVolume'),closeAudioSettingsEl=document.getElementById('closeAudioSettings');
const playerNameEl=document.getElementById('playerName'),leaderboardBtnEl=document.getElementById('leaderboardBtn');
const multiplayerBtnEl=document.getElementById('multiplayerBtn'),multiplayerMenuEl=document.getElementById('multiplayerMenu'),quickMatchBtnEl=document.getElementById('quickMatchBtn'),createRoomBtnEl=document.getElementById('createRoomBtn'),roomCodeInputEl=document.getElementById('roomCodeInput'),joinRoomBtnEl=document.getElementById('joinRoomBtn'),multiplayerStatusEl=document.getElementById('multiplayerStatus'),roomCodeDisplayEl=document.getElementById('roomCodeDisplay'),closeMultiplayerEl=document.getElementById('closeMultiplayer'),multiplayerHudEl=document.getElementById('multiplayerHud'),mpTimerEl=document.getElementById('mpTimer'),mpYouEl=document.getElementById('mpYou'),mpRivalEl=document.getElementById('mpRival');
const bossRushBtnEl=document.getElementById('bossRushBtn'),bossRushMenuEl=document.getElementById('bossRushMenu'),bossRushListEl=document.getElementById('bossRushList'),closeBossRushEl=document.getElementById('closeBossRush');
const leaderboardMenuEl=document.getElementById('leaderboardMenu'),leaderboardTitleEl=document.getElementById('leaderboardTitle'),leaderboardStatusEl=document.getElementById('leaderboardStatus'),leaderboardListEl=document.getElementById('leaderboardList'),refreshLeaderboardEl=document.getElementById('refreshLeaderboard'),closeLeaderboardEl=document.getElementById('closeLeaderboard');
const bossWarningEl=document.getElementById('bossWarning'),bossWarningTextEl=document.getElementById('bossWarningText');
const pauseBtnEl=document.getElementById('pauseBtn'),pauseMenuEl=document.getElementById('pauseMenu'),resumeBtnEl=document.getElementById('resumeBtn'),pauseMenuBtnEl=document.getElementById('pauseMenuBtn'),resumeCountdownEl=document.getElementById('resumeCountdown'),resumeCountdownTextEl=document.getElementById('resumeCountdownText'),pauseTextEl=document.getElementById('pauseText');
const skinsLabelEl=document.getElementById('skinsLabel'),faceLabelEl=document.getElementById('faceLabel'),hatsLabelEl=document.getElementById('hatsLabel'),trailsLabelEl=document.getElementById('trailsLabel'),upgradeTextEl=document.getElementById('upgradeText'),goHeightLabelEl=document.getElementById('goHeightLabel'),goCoinsLabelEl=document.getElementById('goCoinsLabel'),goComboLabelEl=document.getElementById('goComboLabel'),goBankLabelEl=document.getElementById('goBankLabel');
const languageSelectEl=document.getElementById('languageSelect'),menuTagEl=document.getElementById('menuTag'),menuHintEl=document.getElementById('menuHint'),bestStatEl=document.getElementById('bestStat'),bankStatEl=document.getElementById('bankStat'),totalStatEl=document.getElementById('totalStat'),streakStatEl=document.getElementById('streakStat');

;/* js/localization_core.js */
const i18n={
 no:{play:'START SPILLET',upgrade:'OPPGRADERINGER',skins:'KOSMETIKK',daily:'DAGLIG BELØNNING',tag:'Svev høyere, samle belønninger og slå nye rekorder. ☁️🌈',hint:'Bosser venter ved 1200, 2000, 3000 og 4500 m.<br>Dobbelttrykk for Rainbow Puff.',best:'Beste',bank:'Mynter',total:'Total høyde',streak:'Dager på rad',mission:'Oppdrag',back:'TILBAKE',retry:'PRØV IGJEN',menu:'HOVEDMENY',continue:'FORTSETT',shopTitle:'Kosmetikk',upTitle:'Oppgraderinger',gameOver:'Runden er over 💨',missionComplete:'Oppdrag fullført ⭐',pause:'Pause',resume:'FORTSETT',mainMenu:'HOVEDMENY',pauseText:'Spillet er satt på pause.',skinsLabel:'Puffling-skall',faceLabel:'Ansikter',hatsLabel:'Hodeplagg',trailsLabel:'Effekter',upgradeText:'Bruk opptjente mynter på permanente forbedringer som gjelder i alle nye runder.',height:'Høyde',coins:'Mynter',bestCombo:'Beste kombinasjon',dailyClaimed:'Dagens belønning er allerede hentet.',dailyReward:'Daglig serie: {streak} dager • +{reward} 🪙',needCoins:'Du har ikke nok mynter.',maxLevel:'Maks nivå',upgraded:'{name} er oppgradert.',needHeight:'Krever {need} m total høyde.',bossUnlock:'Beseir bossen for å låse opp denne belønningen.',shieldSaved:'Skjoldet tok støyten 🛡️',megaSmash:'MEGA PUFF!',shield:'Skjold aktivert 🛡️',magnet:'Myntmagnet aktivert 🧲',mega:'Mega Puff aktivert ☁️',bossHit:'Treff! 🌈',bossDefeated:'{name} beseiret • +{reward} 🪙',bossCosmetic:'Ny boss-belønning låst opp 🎁',missionReward:'Belønning: +{reward} 🪙',bossIncoming:'BOSS NÆRMER SEG',leaderboard:'HIGHSCORE',globalHighscore:'Global highscore',refresh:'OPPDATER',loading:'Laster…',noScores:'Ingen resultater ennå.',scoreSendFail:'Kunne ikke sende resultatet.',namePlaceholder:'Spillernavn',audio:'LYD',music:'Musikk',musicVolume:'Musikkvolum',on:'PÅ',off:'AV',multiplayer:'MULTIPLAYER',bossRush:'BOSS RUSH',achievements:'PRESTASJONER',diagnostics:'SYSTEM & SUPPORT',quickMatch:'FINN MOTSTANDER',createRoom:'OPPRETT VENNEKODE',joinRoom:'BLI MED',notConnected:'Ikke tilkoblet',bossRushIntro:'Spill tidligere beseirede bosser på nytt og tjen ekstra belønninger.',multiplayerIntro:'Førstemann til 1500 m vinner. Spill mot en venn eller en tilfeldig spiller.',systemTitle:'System & support',systemLoading:'Kontrollerer spillstatus…',sendReport:'SEND FEILRAPPORT',updateStatus:'OPPDATER STATUS',achievementsTitle:'Prestasjoner',audioTitle:'Lydinnstillinger'},
 en:{play:'START GAME',upgrade:'UPGRADES',skins:'COSMETICS',daily:'DAILY REWARD',tag:'Climb higher, collect rewards, and chase a new record. ☁️🌈',hint:'Bosses await at 1200, 2000, 3000 and 4500 m.<br>Double-tap for Rainbow Puff.',best:'Best',bank:'Coins',total:'Total height',streak:'Daily streak',mission:'Mission',back:'BACK',retry:'TRY AGAIN',menu:'MAIN MENU',continue:'CONTINUE',shopTitle:'Cosmetics',upTitle:'Upgrades',gameOver:'Run complete 💨',missionComplete:'Mission complete ⭐',pause:'Pause',resume:'CONTINUE',mainMenu:'MAIN MENU',pauseText:'The game is paused.',skinsLabel:'Puffling skins',faceLabel:'Faces',hatsLabel:'Headwear',trailsLabel:'Effects',upgradeText:'Spend earned coins on permanent improvements for future runs.',height:'Height',coins:'Coins',bestCombo:'Best combo',dailyClaimed:'Today’s reward has already been claimed.',dailyReward:'Daily streak: {streak} days • +{reward} 🪙',needCoins:'You do not have enough coins.',maxLevel:'Max level',upgraded:'{name} upgraded.',needHeight:'Requires {need} m total height.',bossUnlock:'Defeat the boss to unlock this reward.',shieldSaved:'Shield absorbed the hit 🛡️',megaSmash:'MEGA PUFF!',shield:'Shield activated 🛡️',magnet:'Coin magnet activated 🧲',mega:'Mega Puff activated ☁️',bossHit:'Hit! 🌈',bossDefeated:'{name} defeated • +{reward} 🪙',bossCosmetic:'New boss reward unlocked 🎁',missionReward:'Reward: +{reward} 🪙',bossIncoming:'BOSS APPROACHING',leaderboard:'HIGHSCORE',globalHighscore:'Global highscore',refresh:'REFRESH',loading:'Loading…',noScores:'No results yet.',scoreSendFail:'Could not submit the result.',namePlaceholder:'Player name',audio:'AUDIO',music:'Music',musicVolume:'Music volume',on:'ON',off:'OFF',multiplayer:'MULTIPLAYER',bossRush:'BOSS RUSH',achievements:'ACHIEVEMENTS',diagnostics:'SYSTEM & SUPPORT',quickMatch:'FIND OPPONENT',createRoom:'CREATE FRIEND CODE',joinRoom:'JOIN',notConnected:'Not connected',bossRushIntro:'Replay previously defeated bosses and earn extra rewards.',multiplayerIntro:'First to 1500m wins. Race a friend or a random player.',systemTitle:'System & Support',systemLoading:'Checking game status…',sendReport:'SEND BUG REPORT',updateStatus:'REFRESH STATUS',achievementsTitle:'Achievements',audioTitle:'Audio settings'},
 de:{play:'SPIEL STARTEN',upgrade:'UPGRADES',skins:'KOSMETIK',daily:'TAGESBELOHNUNG',tag:'Steige höher, sammle Belohnungen und jage einen neuen Rekord. ☁️🌈',hint:'Bosse warten bei 1200, 2000, 3000 und 4500 m.<br>Doppeltippen für Rainbow Puff.',best:'Bestwert',bank:'Münzen',total:'Gesamthöhe',streak:'Tages-Serie',mission:'Mission',back:'ZURÜCK',retry:'NOCHMAL',menu:'HAUPTMENÜ',continue:'WEITER',shopTitle:'Kosmetik',upTitle:'Upgrades',gameOver:'Runde beendet 💨',missionComplete:'Mission abgeschlossen ⭐',pause:'Pause',resume:'WEITER',mainMenu:'HAUPTMENÜ',pauseText:'Das Spiel ist pausiert.',skinsLabel:'Sky-Puff-Skins',faceLabel:'Gesichter',hatsLabel:'Kopfbedeckungen',trailsLabel:'Effekte',upgradeText:'Nutze verdiente Münzen für dauerhafte Verbesserungen in zukünftigen Runden.',height:'Höhe',coins:'Münzen',bestCombo:'Beste Combo',dailyClaimed:'Die heutige Belohnung wurde bereits abgeholt.',dailyReward:'Tages-Serie: {streak} Tage • +{reward} 🪙',needCoins:'Nicht genügend Münzen.',maxLevel:'Maximales Level',upgraded:'{name} verbessert.',needHeight:'Benötigt {need} m Gesamthöhe.',bossUnlock:'Besiege den Boss, um diese Belohnung freizuschalten.',shieldSaved:'Der Schild hat den Treffer abgefangen 🛡️',megaSmash:'MEGA PUFF!',shield:'Schild aktiviert 🛡️',magnet:'Münzmagnet aktiviert 🧲',mega:'Mega Puff aktiviert ☁️',bossHit:'Treffer! 🌈',bossDefeated:'{name} besiegt • +{reward} 🪙',bossCosmetic:'Neue Boss-Belohnung freigeschaltet 🎁',missionReward:'Belohnung: +{reward} 🪙',bossIncoming:'BOSS NÄHERT SICH',leaderboard:'HIGHSCORE',globalHighscore:'Globale Highscore',refresh:'AKTUALISIEREN',loading:'Lädt…',noScores:'Noch keine Ergebnisse.',scoreSendFail:'Ergebnis konnte nicht gesendet werden.',namePlaceholder:'Spielername',audio:'Audio',music:'Musik',musicVolume:'Musiklautstärke',on:'AN',off:'AUS',multiplayer:'MULTIPLAYER',bossRush:'BOSS RUSH',achievements:'ERFOLGE',diagnostics:'SYSTEM & SUPPORT',quickMatch:'GEGNER FINDEN',createRoom:'FREUNDESCODE ERSTELLEN',joinRoom:'BEITRETEN',notConnected:'Nicht verbunden',bossRushIntro:'Spiele bereits besiegte Bosse erneut und verdiene zusätzliche Belohnungen.',multiplayerIntro:'Tritt gegen einen Freund oder zufälligen Spieler an. Die höchste Punktzahl nach 90 Sekunden gewinnt.',systemTitle:'System & Support',systemLoading:'Spielstatus wird geprüft…',sendReport:'FEHLER MELDEN',updateStatus:'STATUS AKTUALISIEREN',achievementsTitle:'Erfolge',audioTitle:'Audioeinstellungen'},
 es:{play:'INICIAR PARTIDA',upgrade:'MEJORAS',skins:'COSMÉTICOS',daily:'RECOMPENSA DIARIA',tag:'Sube más alto, consigue recompensas y supera tu récord. ☁️🌈',hint:'Los jefes aparecen a 1200, 2000, 3000 y 4500 m.<br>Doble toque para Rainbow Puff.',best:'Récord',bank:'Monedas',total:'Altura total',streak:'Racha diaria',mission:'Misión',back:'VOLVER',retry:'INTENTAR DE NUEVO',menu:'MENÚ PRINCIPAL',continue:'CONTINUAR',shopTitle:'Cosméticos',upTitle:'Mejoras',gameOver:'Partida terminada 💨',missionComplete:'Misión completada ⭐',pause:'Pausa',resume:'CONTINUAR',mainMenu:'MENÚ PRINCIPAL',pauseText:'La partida está en pausa.',skinsLabel:'Skins de Sky Puff',faceLabel:'Caras',hatsLabel:'Accesorios',trailsLabel:'Efectos',upgradeText:'Usa las monedas obtenidas para conseguir mejoras permanentes.',height:'Altura',coins:'Monedas',bestCombo:'Mejor combo',dailyClaimed:'La recompensa de hoy ya fue recogida.',dailyReward:'Racha diaria: {streak} días • +{reward} 🪙',needCoins:'No tienes suficientes monedas.',maxLevel:'Nivel máximo',upgraded:'{name} mejorado.',needHeight:'Requiere {need} m de altura total.',bossUnlock:'Derrota al jefe para desbloquear esta recompensa.',shieldSaved:'El escudo absorbió el golpe 🛡️',megaSmash:'¡MEGA PUFF!',shield:'Escudo activado 🛡️',magnet:'Imán de monedas activado 🧲',mega:'Mega Puff activado ☁️',bossHit:'¡Impacto! 🌈',bossDefeated:'{name} derrotado • +{reward} 🪙',bossCosmetic:'Nueva recompensa de jefe desbloqueada 🎁',missionReward:'Recompensa: +{reward} 🪙',bossIncoming:'JEFE ACERCÁNDOSE',leaderboard:'RÉCORDS',globalHighscore:'Clasificación global',refresh:'ACTUALIZAR',loading:'Cargando…',noScores:'Aún no hay resultados.',scoreSendFail:'No se pudo enviar el resultado.',namePlaceholder:'Nombre del jugador',audio:'Audio',music:'Música',musicVolume:'Volumen de música',on:'SÍ',off:'NO',multiplayer:'MULTIJUGADOR',bossRush:'BOSS RUSH',achievements:'LOGROS',diagnostics:'SISTEMA Y SOPORTE',quickMatch:'BUSCAR RIVAL',createRoom:'CREAR CÓDIGO',joinRoom:'UNIRSE',notConnected:'Sin conexión',bossRushIntro:'Vuelve a enfrentarte a jefes derrotados y consigue recompensas adicionales.',multiplayerIntro:'Compite contra un amigo o jugador aleatorio. Gana quien tenga la puntuación más alta tras 90 segundos.',systemTitle:'Sistema y soporte',systemLoading:'Comprobando el estado del juego…',sendReport:'ENVIAR INFORME',updateStatus:'ACTUALIZAR ESTADO',achievementsTitle:'Logros',audioTitle:'Ajustes de audio'},
 fr:{play:'LANCER LA PARTIE',upgrade:'AMÉLIORATIONS',skins:'COSMÉTIQUES',daily:'RÉCOMPENSE DU JOUR',tag:'Montez plus haut, gagnez des récompenses et battez votre record. ☁️🌈',hint:'Des boss vous attendent à 1200, 2000, 3000 et 4500 m.<br>Double-tapez pour Rainbow Puff.',best:'Record',bank:'Pièces',total:'Hauteur totale',streak:'Série quotidienne',mission:'Mission',back:'RETOUR',retry:'RÉESSAYER',menu:'MENU PRINCIPAL',continue:'CONTINUER',shopTitle:'Cosmétiques',upTitle:'Améliorations',gameOver:'Partie terminée 💨',missionComplete:'Mission accomplie ⭐',pause:'Pause',resume:'CONTINUER',mainMenu:'MENU PRINCIPAL',pauseText:'La partie est en pause.',skinsLabel:'Skins Sky Puff',faceLabel:'Visages',hatsLabel:'Accessoires',trailsLabel:'Effets',upgradeText:'Utilisez vos pièces pour obtenir des améliorations permanentes.',height:'Hauteur',coins:'Pièces',bestCombo:'Meilleur combo',dailyClaimed:'La récompense du jour a déjà été récupérée.',dailyReward:'Série quotidienne : {streak} jours • +{reward} 🪙',needCoins:'Vous n’avez pas assez de pièces.',maxLevel:'Niveau maximum',upgraded:'{name} amélioré.',needHeight:'Nécessite {need} m de hauteur totale.',bossUnlock:'Battez le boss pour débloquer cette récompense.',shieldSaved:'Le bouclier a absorbé le coup 🛡️',megaSmash:'MEGA PUFF !',shield:'Bouclier activé 🛡️',magnet:'Aimant à pièces activé 🧲',mega:'Mega Puff activé ☁️',bossHit:'Touché ! 🌈',bossDefeated:'{name} vaincu • +{reward} 🪙',bossCosmetic:'Nouvelle récompense de boss débloquée 🎁',missionReward:'Récompense : +{reward} 🪙',bossIncoming:'BOSS EN APPROCHE',leaderboard:'CLASSEMENT',globalHighscore:'Classement mondial',refresh:'ACTUALISER',loading:'Chargement…',noScores:'Aucun résultat pour le moment.',scoreSendFail:'Impossible d’envoyer le résultat.',namePlaceholder:'Nom du joueur',audio:'Audio',music:'Musique',musicVolume:'Volume de la musique',on:'ON',off:'OFF',multiplayer:'MULTIJOUEUR',bossRush:'BOSS RUSH',achievements:'SUCCÈS',diagnostics:'SYSTÈME & SUPPORT',quickMatch:'TROUVER UN ADVERSAIRE',createRoom:'CRÉER UN CODE AMI',joinRoom:'REJOINDRE',notConnected:'Non connecté',bossRushIntro:'Rejouez les boss déjà vaincus et gagnez des récompenses supplémentaires.',multiplayerIntro:'Affrontez un ami ou un joueur aléatoire. Le meilleur score après 90 secondes gagne.',systemTitle:'Système & support',systemLoading:'Vérification de l’état du jeu…',sendReport:'ENVOYER UN RAPPORT',updateStatus:'ACTUALISER LE STATUT',achievementsTitle:'Succès',audioTitle:'Paramètres audio'}
};
Object.assign(i18n.de,{multiplayerIntro:'Wer zuerst 1500 m erreicht, gewinnt. Spiele gegen einen Freund oder einen zufälligen Gegner.'});
Object.assign(i18n.es,{multiplayerIntro:'Gana quien llegue primero a 1500 m. Compite contra un amigo o un jugador aleatorio.'});
Object.assign(i18n.fr,{multiplayerIntro:'Le premier à atteindre 1500 m gagne. Affrontez un ami ou un joueur aléatoire.'});
Object.assign(i18n.no,{scoreSavedLocalAntiCheat:'Resultat lagret lokalt • sikkerhetskontroll'});
Object.assign(i18n.en,{scoreSavedLocalAntiCheat:'Score saved locally • anti-cheat review'});
Object.assign(i18n.de,{scoreSavedLocalAntiCheat:'Ergebnis lokal gespeichert • Anti-Cheat-Prüfung'});
Object.assign(i18n.es,{scoreSavedLocalAntiCheat:'Resultado guardado localmente • revisión anti-trampas'});
Object.assign(i18n.fr,{scoreSavedLocalAntiCheat:'Score enregistré localement • vérification anti-triche'});
let lang=localStorage.skyPuffLang||'no';
function tr(key,vars={}){const t=(i18n[lang]&&i18n[lang][key])||i18n.no[key]||key;return Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),t);}


;/* js/language_default.js */
(function(){
 const supported=['no','en','de','es','fr'];
 const saved=localStorage.skyPuffLang;
 if(saved&&supported.includes(saved)){
  lang=saved;
 }else{
  lang='en';
 }
})();

;/* js/audio_core.js */
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


;/* js/endless_boss_core.js */
const ENDLESS_BOSS_GAP=1500;
const ENDLESS_BOSS_HP_CAP=1440;
const ENDLESS_BOSS_REWARD_CAP=6000;
function getEndlessBossStage(height){
 const baseStages=[
  {id:'storm',name:'Storm Boss',emoji:'🌩️',at:1200},
  {id:'candy',name:'Candy Dragon',emoji:'🐉',at:2000},
  {id:'ice',name:'Ice Titan',emoji:'❄️',at:3000},
  {id:'galaxy',name:'Galaxy King',emoji:'🌌',at:4500}
 ];
 if(height<baseStages[0].at)return null;
 for(let i=baseStages.length-1;i>=0;i--){
  if(height>=baseStages[i].at&&height<(i===baseStages.length-1?baseStages[i].at+ENDLESS_BOSS_GAP:baseStages[i+1].at)){
   return {...baseStages[i],tier:1,at:baseStages[i].at};
  }
 }
 const firstRepeatAt=baseStages[baseStages.length-1].at+ENDLESS_BOSS_GAP;
 const cycle=Math.max(0,Math.floor((height-firstRepeatAt)/ENDLESS_BOSS_GAP));
 const idx=cycle%baseStages.length;
 const tier=2+Math.floor(cycle/baseStages.length);
 const at=firstRepeatAt+cycle*ENDLESS_BOSS_GAP;
 const b=baseStages[idx];
 return {...b,tier,at,name:`${b.name} ${tier}`};
}
function endlessBossHealth(stage){
 const scaled=Math.round(5*Math.pow(1.22,Math.max(0,(stage.tier||1)-1)))*24;
 return Math.min(ENDLESS_BOSS_HP_CAP,scaled)/24;
}
function endlessBossReward(stage){return Math.min(ENDLESS_BOSS_REWARD_CAP,Math.round(150*Math.pow(1.18,Math.max(0,(stage.tier||1)-1))));}


;/* js/boss_multiplayer.js */
function bossTone(freq,when,dur,type,vol){
 const o=bossAudioCtx.createOscillator(),g=bossAudioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,when);g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),when+.012);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(g);g.connect(bossMusicGain);o.start(when);o.stop(when+dur+.03);
}
function bossKick(when,vol=.18){const o=bossAudioCtx.createOscillator(),g=bossAudioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(125,when);o.frequency.exponentialRampToValueAtTime(42,when+.12);g.gain.setValueAtTime(vol,when);g.gain.exponentialRampToValueAtTime(.0001,when+.16);o.connect(g);g.connect(bossMusicGain);o.start(when);o.stop(when+.18);}
function scheduleBossBeat(){if(!bossMusicId||!bossAudioCtx)return;const th=bossMusicThemes[bossMusicId],beat=60/th.bpm,now=bossAudioCtx.currentTime+.025,st=bossMusicStep++;const patterns={storm:[0,7,3,10,7,12,10,7,0,7,15,12,10,7,3,10],candy:[0,4,7,11,12,7,16,11,4,7,12,16,19,16,12,7],ice:[0,7,2,9,7,12,9,7,0,7,14,12,9,7,2,7],galaxy:[0,7,12,15,19,15,12,8,0,8,12,19,24,20,15,12]},p=patterns[bossMusicId],semi=p[st%p.length];bossTone(bossFreq(th.root,semi),now,beat*.72,th.wave,bossMusicId==='galaxy'?.065:.055);if(st%2===0)bossTone(bossFreq(th.root,-12+(st%4===0?0:7)),now,beat*.85,'square',.035);if(st%4===0)bossKick(now,bossMusicId==='galaxy'?.22:.16);if(bossMusicId==='storm'&&st%4===2)bossTone(bossFreq(th.root,24),now,beat*.16,'sawtooth',.025);if(bossMusicId==='candy'&&st%2===1)bossTone(bossFreq(th.root,12+th.scale[st%th.scale.length]),now,beat*.28,'triangle',.028);if(bossMusicId==='ice'&&st%4===0)bossTone(bossFreq(th.root,24+th.scale[(st/4)%th.scale.length|0]),now,beat*2.8,'sine',.025);if(bossMusicId==='galaxy'&&st%4===0)[0,7,12].forEach((x,i)=>bossTone(bossFreq(th.root,x),now,beat*1.8,'sawtooth',.018-i*.003));}
let bossRushMode=false,bossRushSelected=null,multiplayerMode=false,multiplayerState='idle',multiplayerRoom='',multiplayerOpponentScore=0,multiplayerEndAt=0,multiplayerInterval=null,multiplayerRaceSeconds=90;
function modeText(){const L={no:{choose:'Velg hvordan du vil spille',share:'Del koden med en venn. Simulert motstander kobles til om et øyeblikk.',search:'Søker etter motstander…',invalid:'Skriv inn en gyldig vennekode',connect:'Kobler til rom',found:'Motstander funnet! ⚔️',friend:'Vennekamp startet! ⚔️',won:'DU VANT!',rival:'Rivalen vant',draw:'UAVGJORT!',reward:'Belønning',locked:'Beseir en boss i hovedspillet først for å låse den opp her.',startFail:'Kunne ikke starte bossen',bossWon:'Boss beseiret!'},en:{choose:'Choose how you want to play',share:'Share the code with a friend. A simulated opponent will connect shortly.',search:'Searching for opponent…',invalid:'Enter a valid friend code',connect:'Connecting to room',found:'Opponent found! ⚔️',friend:'Friend match started! ⚔️',won:'YOU WON!',rival:'Rival won',draw:'DRAW!',reward:'Reward',locked:'Defeat a boss in the main game first to unlock it here.',startFail:'Could not start the boss',bossWon:'Boss defeated!'},de:{choose:'Wähle, wie du spielen möchtest',share:'Teile den Code mit einem Freund. Ein simulierter Gegner verbindet sich gleich.',search:'Gegner wird gesucht…',invalid:'Gib einen gültigen Freundescode ein',connect:'Verbindung mit Raum',found:'Gegner gefunden! ⚔️',friend:'Freundeskampf gestartet! ⚔️',won:'DU HAST GEWONNEN!',rival:'Der Gegner hat gewonnen',draw:'UNENTSCHIEDEN!',reward:'Belohnung',locked:'Besiege zuerst einen Boss im Hauptspiel, um ihn hier freizuschalten.',startFail:'Boss konnte nicht gestartet werden',bossWon:'Boss besiegt!'},es:{choose:'Elige cómo quieres jugar',share:'Comparte el código con un amigo. Un rival simulado se conectará en breve.',search:'Buscando rival…',invalid:'Introduce un código de amigo válido',connect:'Conectando a la sala',found:'¡Rival encontrado! ⚔️',friend:'¡Partida con amigo iniciada! ⚔️',won:'¡HAS GANADO!',rival:'El rival ganó',draw:'¡EMPATE!',reward:'Recompensa',locked:'Derrota primero a un jefe en el juego principal para desbloquearlo aquí.',startFail:'No se pudo iniciar el jefe',bossWon:'¡Jefe derrotado!'},fr:{choose:'Choisissez votre mode de jeu',share:'Partagez le code avec un ami. Un adversaire simulé va bientôt se connecter.',search:'Recherche d’un adversaire…',invalid:'Entrez un code ami valide',connect:'Connexion à la salle',found:'Adversaire trouvé ! ⚔️',friend:'Partie entre amis lancée ! ⚔️',won:'VOUS AVEZ GAGNÉ !',rival:'L’adversaire a gagné',draw:'ÉGALITÉ !',reward:'Récompense',locked:'Battez d’abord un boss dans le jeu principal pour le débloquer ici.',startFail:'Impossible de lancer le boss',bossWon:'Boss vaincu !'}};return L[typeof lang==='string'?lang:'en']||L.en}
function randomRoomCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s;}
function openMultiplayer(){const t=modeText();if(bossRushMenuEl)bossRushMenuEl.style.display='none';if(multiplayerMenuEl)multiplayerMenuEl.style.display='flex';if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.choose;if(roomCodeDisplayEl)roomCodeDisplayEl.textContent='';}
function closeMultiplayer(){if(multiplayerMenuEl)multiplayerMenuEl.style.display='none';}
function createFriendRoom(){const t=modeText();multiplayerRoom=randomRoomCode();multiplayerState='waiting';if(roomCodeDisplayEl)roomCodeDisplayEl.textContent=multiplayerRoom;if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.share;setTimeout(()=>startMultiplayerRace('friend'),700);}
function quickMatch(){multiplayerState='searching';if(multiplayerStatusEl)multiplayerStatusEl.textContent=modeText().search;setTimeout(()=>startMultiplayerRace('random'),700);}
function joinFriendRoom(){const t=modeText(),code=(roomCodeInputEl?.value||'').trim().toUpperCase();if(code.length<4){if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.invalid;return;}multiplayerRoom=code;if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.connect+' '+code+'…';setTimeout(()=>startMultiplayerRace('friend'),500);}
function startMultiplayerRace(type){const t=modeText();closeMultiplayer();bossRushMode=false;reset();multiplayerMode=true;multiplayerState='racing';multiplayerOpponentScore=0;multiplayerEndAt=Date.now()+multiplayerRaceSeconds*1000;if(multiplayerHudEl)multiplayerHudEl.style.display='block';if(mpRivalEl)mpRivalEl.textContent='0m';if(mpYouEl)mpYouEl.textContent='0m';if(mpTimerEl)mpTimerEl.textContent=multiplayerRaceSeconds;startEl.style.display='none';running=true;paused=false;lastTime=performance.now();startMusic();if(multiplayerInterval)clearInterval(multiplayerInterval);multiplayerInterval=setInterval(multiplayerTick,500);requestAnimationFrame(loop);showToast(type==='random'?t.found:t.friend);}
function multiplayerTick(){if(!multiplayerMode||multiplayerState!=='racing')return;const remaining=Math.max(0,Math.ceil((multiplayerEndAt-Date.now())/1000));if(mpTimerEl)mpTimerEl.textContent=remaining;if(mpYouEl)mpYouEl.textContent=Math.floor(score)+'m';const difficulty=.76+Math.random()*.18;multiplayerOpponentScore=Math.max(multiplayerOpponentScore,multiplayerOpponentScore+(8+Math.random()*18)*difficulty);if(mpRivalEl)mpRivalEl.textContent=Math.floor(multiplayerOpponentScore)+'m';if(remaining<=0)finishMultiplayerRace();}
function finishMultiplayerRace(){if(!multiplayerMode)return;const t=modeText();multiplayerMode=false;multiplayerState='finished';running=false;if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);let msg='';if(you>rival){msg=`${t.won} ${you}m - ${rival}m 🏆`;save.bank=(save.bank||0)+75;persist();refreshMenu();}else if(you<rival)msg=`${t.rival} ${rival}m - ${you}m`;else msg=`${t.draw} ${you}m`;showToast(msg);setTimeout(()=>showMainMenu(),500);}
const bossRushBaseStages=[{id:'storm',name:'Storm Boss',emoji:'🌩️',at:1200},{id:'candy',name:'Candy Dragon',emoji:'🐉',at:2000},{id:'ice',name:'Ice Titan',emoji:'❄️',at:3000},{id:'galaxy',name:'Galaxy King',emoji:'🌌',at:4500}];
function bossSaveKey(id){return'boss'+id.charAt(0).toUpperCase()+id.slice(1)}function isBossUnlockedForRush(id){try{return !!(save&&save[bossSaveKey(id)])}catch(e){return false}}
function renderBossRush(){if(!bossRushListEl)return;const t=modeText();bossRushListEl.innerHTML='';let any=false;bossRushBaseStages.forEach(stage=>{if(!isBossUnlockedForRush(stage.id))return;any=true;const b=document.createElement('button');b.className='secondary';b.style.margin='6px';b.innerHTML=`${stage.emoji} ${stage.name}<br><span style="font-size:12px">${t.reward}: 100 🪙</span>`;b.onclick=()=>startBossRush(stage);bossRushListEl.appendChild(b)});if(!any){const empty=document.createElement('div');empty.className='small';empty.textContent=t.locked;bossRushListEl.appendChild(empty)}}
function openBossRush(){if(multiplayerMenuEl)multiplayerMenuEl.style.display='none';if(multiplayerHudEl)multiplayerHudEl.style.display='none';renderBossRush();if(bossRushMenuEl)bossRushMenuEl.style.display='flex'}function closeBossRush(){if(bossRushMenuEl)bossRushMenuEl.style.display='none'}
function startBossRush(stage){closeBossRush();reset();bossRushMode=true;bossRushSelected={...stage,tier:1};paused=false;running=true;startEl.style.display='none';gameOverEl.style.display='none';missionCompleteEl.style.display='none';shopEl.style.display='none';upgradesEl.style.display='none';if(audioSettingsEl)audioSettingsEl.style.display='none';if(leaderboardMenuEl)leaderboardMenuEl.style.display='none';const realStage=bossStages.find(b=>b.id===stage.id);if(!realStage){bossRushMode=false;running=false;showToast(modeText().startFail);showMainMenu();return}spawnBoss({...realStage,tier:1});lastTime=performance.now();requestAnimationFrame(loop)}
function finishBossRushWin(){const reward=100,wonId=bossRushSelected&&bossRushSelected.id;if(wonId&&window.skyPuffBossRushProgress)window.skyPuffBossRushProgress.record(wonId);else if(wonId){try{const k='skyPuffBossRushWinsV1',w=JSON.parse(localStorage.getItem(k)||'{}');w[wonId]=true;localStorage.setItem(k,JSON.stringify(w))}catch(e){}}save.bank=(save.bank||0)+reward;persist();refreshMenu();bossRushMode=false;bossRushSelected=null;boss=null;bossSpawned=false;bossArena=false;bossArenaY=0;playerShots=[];bossShots=[];running=false;paused=false;stopBossMusic(false);if(bossWrap)bossWrap.style.display='none';if(bossWarningEl)bossWarningEl.style.display='none';if(bossRushMenuEl)bossRushMenuEl.style.display='none';showToast(`${modeText().bossWon} +${reward} 🪙`);setTimeout(()=>{showMainMenu();renderBossRush()},350)}
function startBossMusic(id){if(!musicEnabled||!bossMusicThemes[id])return;stopBossMusic(false);try{bossAudioCtx=bossAudioCtx||new(window.AudioContext||window.webkitAudioContext)();if(bossAudioCtx.state==='suspended')bossAudioCtx.resume();bossMusicGain=bossAudioCtx.createGain();bossMusicGain.gain.value=Math.max(.04,musicVolume*.42);bossMusicGain.connect(bossAudioCtx.destination);bossMusicId=id;bossMusicStep=0;bgMusicEl.pause();const beat=60/bossMusicThemes[id].bpm;scheduleBossBeat();bossMusicTimer=setInterval(scheduleBossBeat,beat*1000)}catch(e){startMusic()}}
function stopBossMusic(resumeNormal=true){if(bossMusicTimer){clearInterval(bossMusicTimer);bossMusicTimer=null}bossMusicId=null;bossMusicStep=0;if(bossMusicGain&&bossAudioCtx){try{const t=bossAudioCtx.currentTime;bossMusicGain.gain.cancelScheduledValues(t);bossMusicGain.gain.setValueAtTime(Math.max(.0001,bossMusicGain.gain.value),t);bossMusicGain.gain.exponentialRampToValueAtTime(.0001,t+.22)}catch(e){}}bossMusicGain=null;if(resumeNormal&&musicEnabled)setTimeout(()=>startMusic(),180)}
audioSettingsBtnEl.onclick=()=>{audioSettingsEl.style.display='flex';refreshAudioUI()};closeAudioSettingsEl.onclick=()=>audioSettingsEl.style.display='none';musicToggleEl.onclick=()=>{musicEnabled=!musicEnabled;localStorage.skyPuffMusicEnabled=musicEnabled?'1':'0';if(musicEnabled){if(boss)startBossMusic(boss.id);else startMusic()}else{stopMusic();stopBossMusic(false)}refreshAudioUI()};musicVolumeEl.oninput=()=>{musicVolume=Number(musicVolumeEl.value)/100;bgMusicEl.volume=musicVolume;if(bossMusicGain)bossMusicGain.gain.value=Math.max(.04,musicVolume*.42);localStorage.skyPuffMusicVolume=String(musicVolume);if(musicEnabled&&bgMusicEl.paused)startMusic()};startMusic();document.addEventListener('pointerdown',()=>startMusic(),{once:true});document.addEventListener('keydown',()=>startMusic(),{once:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)bgMusicEl.pause();else if(musicEnabled)startMusic()});

;/* js/music_bridge.js */
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


;/* js/leaderboard_submit.js */
function cleanPlayerName(v){return(v||'').trim().replace(/[^\p{L}\p{N} _.-]/gu,'').slice(0,16)||'SkyPuffer';}
function readLocalScores(){try{return JSON.parse(localStorage.skyPuffLocalScores||'[]')}catch(e){return[]}}
function writeLocalScores(rows){localStorage.skyPuffLocalScores=JSON.stringify(rows.slice(0,50));}
function saveLocalScore(name,height,meta={}){const rows=readLocalScores();rows.push({name,height:Math.floor(height),at:Date.now(),...meta});rows.sort((a,b)=>b.height-a.height);writeLocalScores(rows);}
async function submitOnlineScore(height){
 if(!height||height<1)return;
 const name=cleanPlayerName(playerNameEl.value)||'SkyPuff';
 save.playerName=name;
 persist();
 const anti=window.skyPuffAntiCheat?window.skyPuffAntiCheat.verdict(height,coins):{ok:true,signature:'',flags:[]};
 saveLocalScore(name,height,{verified:!!anti.ok,signature:anti.signature||'',flags:(anti.flags||[]).length});
 if(!anti.ok){
   if(window.skyPuffAntiCheat)window.skyPuffAntiCheat.noteBlockedSubmission();
   console.warn('Online score blocked by anti-cheat',anti);
   showToast(tr('scoreSavedLocalAntiCheat'));
   return;
 }
 if(!API_BASE)return;
 try{
   const r=await fetch(API_BASE+'/score',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({name,height:Math.floor(height),runSignature:anti.signature,version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'beta'})
   });
   if(!r.ok)throw new Error('HTTP '+r.status);
 }catch(e){
   console.warn('Highscore submit failed; local score kept',e);
 }
}


;/* js/leaderboard_language_ui.js */
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


;/* js/desktop_game_width.js */
/* Puffling — desktop playfield width v1.1 */
(function(){
  const MAX_DESKTOP_WIDTH=620;
  function isNarrowDesktop(){
    const fine=typeof matchMedia==='function'&&matchMedia('(pointer:fine)').matches;
    const desktop=window.skyPuffPlatform?.desktop||fine;
    return !!desktop&&window.innerWidth>=900;
  }
  function applyHudWidth(narrow){
    const hud=document.getElementById('hud');
    if(!hud)return;
    if(narrow){
      hud.style.left='50%';hud.style.right='auto';hud.style.width=W+'px';hud.style.transform='translateX(-50%)';
    }else{
      hud.style.left='0';hud.style.right='0';hud.style.width='auto';hud.style.transform='none';
    }
  }
  function apply(){
    const vw=Math.max(320,Math.floor(window.innerWidth||320));
    const vh=Math.max(240,Math.floor(window.innerHeight||480));
    const narrow=isNarrowDesktop();
    W=narrow?Math.min(vw,MAX_DESKTOP_WIDTH):vw;
    H=vh;
    dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(W*dpr);
    canvas.height=Math.round(H*dpr);
    canvas.style.width=W+'px';
    canvas.style.height=H+'px';
    canvas.style.marginLeft='auto';
    canvas.style.marginRight='auto';
    canvas.style.maxWidth='100vw';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    applyHudWidth(narrow);
    document.documentElement.style.setProperty('--puffling-playfield-width',W+'px');
    document.documentElement.dataset.playfield=narrow?'desktop-narrow':'full';
    try{if(typeof pointerX==='number')pointerX=Math.max(0,Math.min(W,pointerX));}catch(e){}
  }
  function toGameX(clientX){
    const r=canvas.getBoundingClientRect();
    const raw=Number(clientX)-r.left;
    const x=Number.isFinite(raw)?raw:W/2;
    return Math.max(0,Math.min(W,x));
  }
  let scheduled=false;
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});}
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
  apply();
  window.PufflingDesktopViewport={MAX_DESKTOP_WIDTH,isNarrowDesktop,apply,toGameX,width:()=>W};
})();


;/* js/race_course_seed.js */
/* Puffling — deterministic Race course generator v1.0 */
(function(){
  let enabled=false,seedText='',seed=0,nextIndex=0,nextY=0;
  function hash(text){let h=2166136261;for(const ch of String(text||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function unit(index,salt){
    let x=(seed^Math.imul((index+1)>>>0,0x9e3779b1)^Math.imul((salt+1)>>>0,0x85ebca6b))>>>0;
    x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);x^=x>>>16;
    return (x>>>0)/4294967296;
  }
  function activate(value){seedText=String(value||'');seed=hash(seedText||'puffling-race');enabled=!!seedText;nextIndex=0;nextY=0;return snapshot();}
  function deactivate(){enabled=false;seedText='';seed=0;nextIndex=0;nextY=0;}
  function begin(startY){nextIndex=0;nextY=Number(startY)||0;return snapshot();}
  function isActive(){return enabled;}
  function gapFor(index){return 70+unit(index,0)*36;}
  function peekNextY(){return nextY-gapFor(nextIndex);}
  function nextPlatform(width){
    const index=nextIndex++,y=nextY-gapFor(index);nextY=y;
    const W=Math.max(180,Number(width)||390),w=70+unit(index,1)*55,x=12+unit(index,2)*Math.max(1,W-w-24);
    const normalPower=unit(index,7)<.12,rarePower=unit(index,9)<.035;
    const powerTypes=['shield','magnet','mega'],rareTypes=['coinRush','superShield','overcharge'];
    return {
      courseIndex:index,y,w,x,phase:unit(index,3)*6.28,
      move:false,breakable:unit(index,4)<.11,
      coin:unit(index,5)<.6,coinSpin:unit(index,6)*6,
      powerup:normalPower?powerTypes[Math.floor(unit(index,8)*powerTypes.length)]:null,
      rarePowerup:rarePower?rareTypes[Math.floor(unit(index,10)*rareTypes.length)]:null,
      enemy:(index%3===0&&unit(index,11)<.255),enemyX:30+unit(index,12)*Math.max(1,W-60),
      enemyDirection:unit(index,13)<.5?-1:1,enemySpeed:.9+unit(index,14)*.9,enemyPhase:unit(index,15)*6.28
    };
  }
  function snapshot(){return{active:enabled,courseSeed:seedText,nextIndex,nextY,version:1};}
  window.SkyPuffRaceCourse={activate,deactivate,begin,isActive,gapFor,peekNextY,nextPlatform,snapshot,version:1};
})();


;/* js/state_content.js */
const save={bank:+(localStorage.skyPuffBank||0),best:+(localStorage.skyPuffBest||0),total:+(localStorage.skyPuffTotal||0),skin:localStorage.skyPuffSkin||'classic',upBoost:+(localStorage.skyPuffUpBoost||0),upHealth:+(localStorage.skyPuffUpHealth||0),upCoin:+(localStorage.skyPuffUpCoin||0),upMagnet:+(localStorage.skyPuffUpMagnet||0),lastDaily:+(localStorage.skyPuffDaily||0),streak:+(localStorage.skyPuffStreak||0),face:localStorage.skyPuffFace||'smile',hat:localStorage.skyPuffHat||'none',trail:localStorage.skyPuffTrail||'auto',bossStorm:localStorage.skyPuffBossStorm==='1',bossCandy:localStorage.skyPuffBossCandy==='1',bossIce:localStorage.skyPuffBossIce==='1',bossGalaxy:localStorage.skyPuffBossGalaxy==='1',playerName:localStorage.skyPuffPlayerName||'',eventsCleared:+(localStorage.skyPuffEventsCleared||0),bossWins:+(localStorage.skyPuffBossWins||0),treasuresCollected:+(localStorage.skyPuffTreasuresCollected||0),achSkyLegend:localStorage.skyPuffAchSkyLegend==='1',achCloudBreaker:localStorage.skyPuffAchCloudBreaker==='1',achSkyImmortal:localStorage.skyPuffAchSkyImmortal==='1',achEventMaster:localStorage.skyPuffAchEventMaster==='1',achBossHunter:localStorage.skyPuffAchBossHunter==='1',achBossVeteran:localStorage.skyPuffAchBossVeteran==='1',achTreasureHunter:localStorage.skyPuffAchTreasureHunter==='1'};
function persist(){Object.entries({skyPuffBank:save.bank,skyPuffBest:save.best,skyPuffTotal:save.total,skyPuffSkin:save.skin,skyPuffUpBoost:save.upBoost,skyPuffUpHealth:save.upHealth,skyPuffUpCoin:save.upCoin,skyPuffUpMagnet:save.upMagnet,skyPuffDaily:save.lastDaily,skyPuffStreak:save.streak,skyPuffFace:save.face,skyPuffHat:save.hat,skyPuffTrail:save.trail,skyPuffBossStorm:save.bossStorm?'1':'0',skyPuffBossCandy:save.bossCandy?'1':'0',skyPuffBossIce:save.bossIce?'1':'0',skyPuffBossGalaxy:save.bossGalaxy?'1':'0',skyPuffPlayerName:save.playerName,skyPuffEventsCleared:save.eventsCleared,skyPuffBossWins:save.bossWins,skyPuffTreasuresCollected:save.treasuresCollected,skyPuffAchSkyLegend:save.achSkyLegend?'1':'0',skyPuffAchCloudBreaker:save.achCloudBreaker?'1':'0',skyPuffAchSkyImmortal:save.achSkyImmortal?'1':'0',skyPuffAchEventMaster:save.achEventMaster?'1':'0',skyPuffAchBossHunter:save.achBossHunter?'1':'0',skyPuffAchBossVeteran:save.achBossVeteran?'1':'0',skyPuffAchTreasureHunter:save.achTreasureHunter?'1':'0'}).forEach(([k,v])=>localStorage[k]=v)}
function refreshMenu(){const a=document.getElementById('bestHeight'),b=document.getElementById('bankCoins'),c=document.getElementById('totalHeight'),d=document.getElementById('menuStreak');if(a)a.textContent=save.best;if(b)b.textContent=save.bank;if(c)c.textContent=save.total;if(d)d.textContent=save.streak;}
refreshMenu();playerNameEl.value=save.playerName;
const skins={classic:{name:'Classic',need:0,body:'#ffffff',cheek:'rgba(255,115,160,.45)',eye:'#2b4665',trail:'rainbow'},sunset:{name:'Sunset',need:500,body:'#ffd6e8',cheek:'rgba(255,80,130,.5)',eye:'#5a3b55',trail:'rainbow'},mint:{name:'Mint',need:1500,body:'#c9fff0',cheek:'rgba(40,200,160,.45)',eye:'#245d56',trail:'mint'},golden:{name:'Golden',need:4000,body:'#fff0a8',cheek:'rgba(255,170,30,.5)',eye:'#6b5320',trail:'gold'},storm:{name:'Storm',need:8000,body:'#b6c3d1',cheek:'rgba(120,140,180,.5)',eye:'#26313d',trail:'storm'},candy:{name:'Candy',need:12000,body:'#ffc8f0',cheek:'rgba(255,80,180,.5)',eye:'#6a2d63',trail:'candy'},frost:{name:'Frost',need:18000,body:'#dff7ff',cheek:'rgba(80,180,255,.45)',eye:'#2e617a',trail:'ice'},galaxy:{name:'Galaxy',need:26000,body:'#c9c0ff',cheek:'rgba(160,110,255,.45)',eye:'#322d63',trail:'galaxy'},lava:{name:'Lava',need:36000,body:'#ffb08f',cheek:'rgba(255,80,40,.5)',eye:'#6a261e',trail:'fire'},royal:{name:'Royal',need:50000,body:'#eee5ff',cheek:'rgba(130,90,255,.45)',eye:'#3f2b68',trail:'royal'}};
const cosmetics={face:'smile',hat:'none',trail:'auto'};
const faceStyles={smile:{name:'Smile',need:0},sleepy:{name:'Sleepy',need:3000},happy:{name:'Happy',need:9000},cool:{name:'Cool',need:20000}};
const hats={none:{name:'None',need:0},crown:{name:'Crown',need:7000},propeller:{name:'Propeller',need:14000},halo:{name:'Halo',need:24000},wizard:{name:'Wizard Hat',need:40000},legendHalo:{name:'Sky Legend Halo ✨',need:999999,achievement:'achSkyLegend'},eventCrown:{name:'Event Crown 🌪️',need:999999,achievement:'achEventMaster'},hunterHelm:{name:'Boss Hunter Helm 👑',need:999999,achievement:'achBossHunter'},cloudBreakerCrown:{name:'Cloud Breaker Crown ☁️💥',need:999999,achievement:'achCloudBreaker'},immortalHalo:{name:'Sky Immortal Halo ♾️',need:999999,achievement:'achSkyImmortal'},bossVeteranCrown:{name:'Boss Veteran Crown ⚔️',need:999999,achievement:'achBossVeteran'},treasureCrown:{name:'Treasure Crown 💎',need:999999,achievement:'achTreasureHunter'},stormCrown:{name:'Storm Crown ⚡',need:999999,boss:'storm'},candyCrown:{name:'Candy Horns 🍭',need:999999,boss:'candy'},iceCrown:{name:'Ice Crown ❄️',need:999999,boss:'ice'},galaxyCrown:{name:'Galaxy Crown 👑',need:999999,boss:'galaxy'}};
const trailStyles={auto:{name:'Skin Trail',need:0},rainbow:{name:'Rainbow',need:0},hearts:{name:'Hearts',need:10000},stars:{name:'Stars',need:22000},neon:{name:'Neon',need:35000},aurora:{name:'Aurora',need:50000}};
const missions=[{type:'height',target:300,reward:25},{type:'coins',target:25,reward:30},{type:'combo',target:5,reward:35},{type:'height',target:900,reward:50}];
function missionText(m){if(lang==='en')return m.type==='height'?`reach ${m.target} m`:m.type==='coins'?`collect ${m.target} coins`:`get combo x${m.target}`;if(lang==='de')return m.type==='height'?`${m.target} m erreichen`:m.type==='coins'?`${m.target} Münzen sammeln`:`Combo x${m.target} erreichen`;if(lang==='es')return m.type==='height'?`llega a ${m.target} m`:m.type==='coins'?`recoge ${m.target} monedas`:`consigue combo x${m.target}`;if(lang==='fr')return m.type==='height'?`atteindre ${m.target} m`:m.type==='coins'?`ramasser ${m.target} pièces`:`obtenir combo x${m.target}`;return m.type==='height'?`nå ${m.target} m`:m.type==='coins'?`samle ${m.target} mynter`:`få combo x${m.target}`;}
let missionIndex=0,missionDone=false;let paused=false;let screenShake=0;let puffAnim=0;let bossFlash=0;let skySparkles=[];let running=false,platforms=[],coinItems=[],clouds=[],enemies=[],powerups=[],particles=[],playerShots=[],bossShots=[];let player,cameraY=0,score=0,coins=0,boost=100,lastTime=0,pointerX=W/2,active=false,lastTap=0,combo=1,bestCombo=1,comboTimer=0,invuln=0,shield=0,superShieldCharges=0,magnet=0,mega=0,coinRush=0,rainbowOvercharge=0;let nextMilestoneRewardAt=2500;let endlessEvent=null,endlessEventTime=0,nextEndlessEventAt=5200;let boss=null,bossSpawned=false,bossDefeated=false,bossWarningActive=false,bossPendingStage=null;let bossArena=false,bossArenaY=0;let defeatedBosses={storm:false,candy:false,ice:false,galaxy:false};
const bossStages=[{id:'storm',at:1200,name:'Storm Boss',hp:120,reward:250,emoji:'⚡'},{id:'candy',at:2000,name:'Candy Dragon',hp:175,reward:500,emoji:'🐉'},{id:'ice',at:3000,name:'Ice Titan',hp:240,reward:850,emoji:'❄️'},{id:'galaxy',at:4500,name:'Galaxy King',hp:340,reward:1500,emoji:'👑'}];
function clearTransientUi(){clearTimeout(showToast.t);showToast.t=null;if(toast){toast.textContent='';toast.style.opacity=0;}clearTimeout(window.skyMissionToastTimer);window.skyMissionToastTimer=null;if(missionCompleteEl)missionCompleteEl.style.display='none';if(comboEl){comboEl.textContent='';comboEl.style.opacity=0;comboEl.style.transform='translateX(-50%) scale(.8)';}if(bossWarningEl)bossWarningEl.style.display='none';}
function showToast(txt){clearTimeout(showToast.t);toast.textContent=txt;toast.style.opacity=1;showToast.t=setTimeout(()=>{toast.style.opacity=0;toast.textContent='';showToast.t=null;},1200)}
function biome(){if(score<500)return'blue';if(score<1000)return'sunset';if(score<1200)return'space';if(score<2000)return'candy';if(score<3000)return'frozen';if(score<4500)return'galaxy';return'endless';}


;/* js/save_integrity.js */
/* Puffling — core save integrity guard v1.0 */
(function(){
  const repaired=[];
  function repairNumber(key,{integer=true,min=0,max=1e12,fallback=0}={}){
    const before=save[key];let n=Number(before);
    if(!Number.isFinite(n))n=fallback;
    if(integer)n=Math.floor(n);
    n=Math.max(min,Math.min(max,n));
    if(before!==n){save[key]=n;repaired.push(key);}
  }
  for(const key of ['bank','best','total','upBoost','upHealth','upCoin','upMagnet','lastDaily','streak','eventsCleared','bossWins','treasuresCollected'])repairNumber(key);
  const catalogs=[
    ['skin',typeof skins!=='undefined'?skins:null,'classic'],
    ['face',typeof faceStyles!=='undefined'?faceStyles:null,'smile'],
    ['hat',typeof hats!=='undefined'?hats:null,'none'],
    ['trail',typeof trailStyles!=='undefined'?trailStyles:null,'auto']
  ];
  for(const [key,catalog,fallback] of catalogs){
    const value=String(save[key]||'');
    if(!catalog||!Object.prototype.hasOwnProperty.call(catalog,value)){save[key]=fallback;repaired.push(key);}
  }
  const cleanName=String(save.playerName||'').replace(/[^\p{L}\p{N} _.-]/gu,'').slice(0,16);
  if(save.playerName!==cleanName){save.playerName=cleanName;repaired.push('playerName');}
  if(repaired.length){try{persist();}catch(e){console.warn('[Puffling SaveIntegrity] Could not persist repair',e);}}
  window.PufflingSaveIntegrity={ok:true,repaired:[...new Set(repaired)],version:1};
})();


;/* js/world_helpers.js */
let lastBossTriggerAt=0;
let nextLifePickupAt=500;
function addPlatform(y,courseSpec=null){
 const course=window.SkyPuffRaceCourse;
 if(!courseSpec&&course?.isActive?.())courseSpec=course.nextPlatform(W);
 if(courseSpec){
  const p=courseSpec,x=p.x,w=p.w;y=p.y;
  platforms.push({x,y,w,h:16,phase:p.phase||0,move:!!p.move,breakable:!!p.breakable,used:false,courseIndex:p.courseIndex,baseX:x});
  if(p.coin)coinItems.push({x:x+w/2,y:y-30,r:10,taken:false,spin:p.coinSpin||0});
  if(p.powerup)powerups.push({x:x+w/2,y:y-43,type:p.powerup,taken:false});
  if(p.rarePowerup)powerups.push({x:x+w/2,y:y-58,type:p.rarePowerup,taken:false,rare:true});
  if(p.enemy)enemies.push({x:p.enemyX,y:y-90,vx:p.enemyDirection*p.enemySpeed,phase:p.enemyPhase,r:18,courseIndex:p.courseIndex});
  return;
 }
 const w=70+Math.random()*55,x=12+Math.random()*(W-w-24);
 platforms.push({x,y,w,h:16,phase:Math.random()*6.28,move:Math.random()<.24,breakable:Math.random()<.11,used:false});
 if(Math.random()<.6)coinItems.push({x:x+w/2,y:y-30,r:10,taken:false,spin:Math.random()*6});
 if(Math.random()<.12)powerups.push({x:x+w/2,y:y-43,type:['shield','magnet','mega'][Math.floor(Math.random()*3)],taken:false});
 if(Math.random()<.035){const rare=['coinRush','superShield','overcharge'][Math.floor(Math.random()*3)];powerups.push({x:x+w/2,y:y-58,type:rare,taken:false,rare:true});}
 if(Math.random()<.085){const enemyY=y-90,minGap=145;const tooClose=enemies.some(e=>Math.abs(e.y-enemyY)<minGap);if(!tooClose)enemies.push({x:Math.random()*(W-60)+30,y:enemyY,vx:(Math.random()<.5?-1:1)*(.9+Math.random()*.9),phase:Math.random()*6.28,r:18});}
}
// Legacy missions were removed from the product UI. Keep reset() safe without silently
// awarding hidden mission coins or selecting an unreachable mission.
function setMission(){missionDone=true;if(typeof missionEl!=='undefined'&&missionEl){missionEl.textContent='';missionEl.style.display='none';}}


;/* js/run_menu_shop_upgrades.js */
function stopActiveModes(){
 running=false;paused=false;bossRushMode=false;bossRushSelected=null;
 if(typeof cancelBossWarning==='function')cancelBossWarning();else{bossWarningActive=false;bossPendingStage=null;if(bossWarningEl)bossWarningEl.style.display='none';}
 bossArena=false;bossArenaY=0;boss=null;bossSpawned=false;playerShots=[];bossShots=[];
 if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}
 multiplayerMode=false;multiplayerState='idle';multiplayerOpponentScore=0;multiplayerEndAt=0;endlessEvent=null;endlessEventTime=0;
 stopBossMusic(false);
 if(typeof clearTransientUi==='function')clearTransientUi();
 if(multiplayerHudEl)multiplayerHudEl.style.display='none';if(multiplayerMenuEl)multiplayerMenuEl.style.display='none';if(bossRushMenuEl)bossRushMenuEl.style.display='none';if(pauseMenuEl)pauseMenuEl.style.display='none';if(resumeCountdownEl)resumeCountdownEl.style.display='none';if(bossWrap)bossWrap.style.display='none';if(bossIdentityEl)bossIdentityEl.style.display='none';
}
function showMainMenu(){stopActiveModes();gameOverEl.style.display='none';missionCompleteEl.style.display='none';shopEl.style.display='none';upgradesEl.style.display='none';if(audioSettingsEl)audioSettingsEl.style.display='none';if(leaderboardMenuEl)leaderboardMenuEl.style.display='none';refreshMenu();startEl.style.display='flex';startMusic();}
function reset(){stopBossMusic(false);if(typeof clearTransientUi==='function')clearTransientUi();if(typeof cancelBossWarning==='function')cancelBossWarning();bossRushMode=false;bossRushSelected=null;lastBossTriggerAt=0;cameraY=0;score=0;coins=0;boost=100;combo=1;bestCombo=1;comboTimer=0;invuln=0;shield=0;superShieldCharges=0;magnet=0;mega=0;coinRush=0;rainbowOvercharge=0;endlessEvent=null;endlessEventTime=0;nextEndlessEventAt=5200;boss=null;bossSpawned=false;bossDefeated=false;bossArena=false;bossArenaY=0;defeatedBosses={storm:false,candy:false,ice:false,galaxy:false};nextLifePickupAt=500;nextMilestoneRewardAt=2500;if(window.skyPuffWorldBurst)window.skyPuffWorldBurst={count:0,cooldownUntil:0,lastBoostAt:0};const startPlatformY=H*.82;player={x:W/2,y:startPlatformY-28,vx:0,vy:-12.2,r:28,rot:0,hp:3+save.upHealth};platforms=[];coinItems=[];clouds=[];enemies=[];powerups=[];particles=[];playerShots=[];bossShots=[];skySparkles=[];screenShake=0;puffAnim=-1;bossFlash=0;let y=startPlatformY;platforms.push({x:W/2-55,y,w:110,h:18,move:false,breakable:false});for(let i=0;i<30;i++){y-=70+Math.random()*35;addPlatform(y)}for(let i=0;i<11;i++)clouds.push({x:Math.random()*W,y:Math.random()*H,s:.5+Math.random()*.9,drift:.08+Math.random()*.18});for(let i=0;i<28;i++)skySparkles.push({x:Math.random()*W,y:Math.random()*H,tw:Math.random()*6.28,s:.7+Math.random()*1.8});setMission();scoreEl.textContent=0;coinsEl.textContent=0;hpEl.textContent=player.hp;streakEl.textContent=save.streak;boostEl.style.width='100%';bossWrap.style.display='none';if(bossIdentityEl)bossIdentityEl.style.display='none';}
function startGame(){stopActiveModes();reset();paused=false;running=true;startEl.style.display='none';gameOverEl.style.display='none';missionCompleteEl.style.display='none';shopEl.style.display='none';upgradesEl.style.display='none';lastTime=performance.now();startMusic();requestAnimationFrame(loop)}
function openShop(){renderShop();applyLanguage();startEl.style.display='none';shopEl.style.display='flex';}
function closeShop(){shopEl.style.display='none';startEl.style.display='flex';}
playBtnEl.onclick=startGame;retryBtnEl.onclick=startGame;menuBtnEl.onclick=showMainMenu;if(continueBtnEl)continueBtnEl.onclick=()=>{missionCompleteEl.style.display='none'};
leaderboardBtnEl.onclick=()=>{startEl.style.display='none';leaderboardMenuEl.style.display='flex';loadLeaderboard();};closeLeaderboardEl.onclick=()=>{leaderboardMenuEl.style.display='none';startEl.style.display='flex';};refreshLeaderboardEl.onclick=loadLeaderboard;playerNameEl.addEventListener('change',()=>{save.playerName=cleanPlayerName(playerNameEl.value);playerNameEl.value=save.playerName;persist();});shopBtnEl.onclick=openShop;closeShopEl.onclick=closeShop;upgradeBtnEl.onclick=()=>{renderUpgrades();applyLanguage();startEl.style.display='none';upgradesEl.style.display='flex'};closeUpgradesEl.onclick=()=>{upgradesEl.style.display='none';startEl.style.display='flex'};dailyBtnEl.onclick=()=>{const now=Date.now(),day=86400000;if(now-save.lastDaily>=day){const reward=250;save.bank+=reward;save.lastDaily=now;save.streak++;persist();refreshMenu();showToast(tr('dailyReward',{streak:save.streak,reward}))}else showToast(tr('dailyClaimed'))};
function pauseGame(){if(!running||paused)return;paused=true;pauseMenuEl.style.display='flex';}function resumeGame(){if(!running||!paused)return;pauseMenuEl.style.display='none';resumeCountdownEl.style.display='flex';const started=performance.now();function countdown(now){if(!running){resumeCountdownEl.style.display='none';return;}const left=Math.max(0,1500-(now-started));resumeCountdownTextEl.textContent=(left/1000).toFixed(1);if(left>0){requestAnimationFrame(countdown);}else{resumeCountdownEl.style.display='none';paused=false;lastTime=performance.now();requestAnimationFrame(loop);}}requestAnimationFrame(countdown);}pauseBtnEl.onclick=pauseGame;resumeBtnEl.onclick=resumeGame;pauseMenuBtnEl.onclick=showMainMenu;
function unlockBossCosmetic(id){const key='boss'+id.charAt(0).toUpperCase()+id.slice(1);if(!save[key]){save[key]=true;persist();setTimeout(()=>showToast(tr('bossCosmetic')),1250);}}
function renderChoiceRow(row,obj,currentKey,saveKey){row.innerHTML='';Object.entries(obj).forEach(([id,s])=>{const bossUnlocked=s.boss?save['boss'+s.boss.charAt(0).toUpperCase()+s.boss.slice(1)]:false;const achievementUnlocked=s.achievement?!!save[s.achievement]:false;const unlocked=bossUnlocked||achievementUnlocked||save.total>=s.need,b=document.createElement('button');b.className='skin'+(unlocked?'':' locked')+(save[currentKey]===id?' selected':'');b.textContent=unlocked?s.name:(s.boss?'🔒 Boss reward':s.achievement?'🔒 Achievement reward':`🔒 ${s.need}m`);b.onclick=()=>{if(!unlocked)return showToast(s.boss?tr('bossUnlock'):s.achievement?'Krev achievement 🏅':tr('needHeight',{need:s.need}));save[currentKey]=id;persist();renderShop();};row.appendChild(b);});}
function renderShop(){renderChoiceRow(skinrowEl,skins,'skin','skyPuffSkin');renderChoiceRow(facerowEl,faceStyles,'face','skyPuffFace');renderChoiceRow(hatrowEl,hats,'hat','skyPuffHat');renderChoiceRow(trailrowEl,trailStyles,'trail','skyPuffTrail');}
const upgrades=[{key:'upBoost',name:'Rainbow Tank',desc:'Lavere puff-kostnad og sterkere boost.',base:1000,max:5},{key:'upMagnet',name:'Magnet Power',desc:'Lengre magnet-varighet.',base:1250,max:5},{key:'upCoin',name:'Coin Bonus',desc:'Flere bankmynter per runde.',base:1500,max:5},{key:'upHealth',name:'Ekstra Liv',desc:'Starter med mer helse.',base:2000,max:3}];
function upgradeLabel(u){const map={no:{upBoost:['Rainbow Tank','Lavere puff-kostnad og sterkere boost.'],upHealth:['Ekstra Liv','Starter med mer helse.'],upCoin:['Coin Bonus','Flere bankmynter per runde.'],upMagnet:['Magnet Power','Lengre magnet-varighet.']},en:{upBoost:['Rainbow Tank','Lower puff cost and stronger boost.'],upHealth:['Extra Life','Start each run with more health.'],upCoin:['Coin Bonus','More bank coins per run.'],upMagnet:['Magnet Power','Longer magnet duration.']},de:{upBoost:['Rainbow Tank','Geringere Puff-Kosten und stärkerer Boost.'],upHealth:['Extra Leben','Starte jede Runde mit mehr Leben.'],upCoin:['Coin Bonus','Mehr Bankmünzen pro Runde.'],upMagnet:['Magnet Power','Längere Magnet-varighet.']},es:{upBoost:['Rainbow Tank','Menor coste de puff y boost más fuerte.'],upHealth:['Vida Extra','Empieza cada partida con más vida.'],upCoin:['Coin Bonus','Más monedas para el banco por partida.'],upMagnet:['Magnet Power','Mayor duración del imán.']},fr:{upBoost:['Rainbow Tank','Coût de puff réduit et boost plus puissant.'],upHealth:['Vie Supplémentaire','Commence chaque partie avec plus de vie.'],upCoin:['Coin Bonus','Plus de pièces en banque par partie.'],upMagnet:['Magnet Power','Durée de l’aimant augmentée.']}};return(map[lang]||map.no)[u.key]||[u.name,u.desc];}
function renderUpgrades(){upgraderowEl.innerHTML='';upgrades.forEach(u=>{const lv=save[u.key],cost=Math.floor(u.base*Math.pow(1.8,lv)),b=document.createElement('button');b.className='upgrade';const[nm,ds]=upgradeLabel(u);const priceLabel=lang==='en'?'Price':lang==='de'?'Preis':lang==='es'?'Precio':lang==='fr'?'Prix':'Pris';b.innerHTML=`<strong>${nm} — Lv ${lv}/${u.max}</strong><small>${ds}<br>${lv>=u.max?tr('maxLevel'):`${priceLabel}: ${cost} 🪙`}</small>`;b.onclick=()=>{if(lv>=u.max)return showToast(tr('maxLevel'));if(save.bank<cost)return showToast(tr('needCoins'));save.bank-=cost;save[u.key]++;persist();renderUpgrades();refreshMenu();showToast(tr('upgraded',{name:upgradeLabel(u)[0]}))};upgraderowEl.appendChild(b)})}

;/* js/anti_cheat.js */
(function(){
 const session={startedAt:Date.now(),runStartedAt:0,lastScore:0,lastCoins:0,flags:[],blockedSubmissions:0,signature:''};
 function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
 function flag(type,detail){const now=Date.now(),text=String(detail||''),previous=session.flags[session.flags.length-1];if(previous&&previous.type===type&&previous.detail===text&&now-previous.at<10000)return;const item={type,detail:text,at:now,score:Math.floor(Number(score)||0),coins:Math.floor(Number(coins)||0)};session.flags.push(item);if(session.flags.length>40)session.flags.shift();try{localStorage.skyPuffAntiCheatFlags=JSON.stringify(session.flags);}catch(_){}console.warn('[SkyPuff AntiCheat]',item);}
 function clearStoredFlags(){try{localStorage.removeItem('skyPuffAntiCheatFlags');}catch(_){} }
 function beginRun(){session.runStartedAt=Date.now();session.lastScore=0;session.lastCoins=0;session.flags=[];session.blockedSubmissions=0;session.signature=hash([session.runStartedAt,Math.random(),navigator.userAgent,SKY_PUFF_VERSION].join('|'));clearStoredFlags();}
 function acceptTransition(height=score,coinCount=coins){session.lastScore=Math.max(0,Math.floor(Number(height)||0));session.lastCoins=Math.max(0,Math.floor(Number(coinCount)||0));}
 function plausibleRun(height,coinCount){const now=Date.now();const elapsed=Math.max(1,now-(session.runStartedAt||now));const h=Math.max(0,Math.floor(Number(height)||0));const c=Math.max(0,Math.floor(Number(coinCount)||0));const maxHeight=Math.max(2500,Math.floor(elapsed/1000*130+2500));const maxCoins=Math.max(500,Math.floor(h*1.8+1200));let ok=true;if(h>maxHeight){flag('height_rate',`${h}>${maxHeight} in ${elapsed}ms`);ok=false;}if(c>maxCoins){flag('coin_rate',`${c}>${maxCoins} at ${h}m`);ok=false;}if(h<session.lastScore-25){flag('score_rollback',`${h}<${session.lastScore}`);ok=false;}session.lastScore=Math.max(session.lastScore,h);session.lastCoins=Math.max(session.lastCoins,c);return ok;}
 function inspectState(){try{if(!running)return true;let ok=true;if(!Number.isFinite(score)||score<0){flag('invalid_score',score);ok=false;}if(!Number.isFinite(coins)||coins<0){flag('invalid_coins',coins);ok=false;}if(player&&(!Number.isFinite(player.hp)||player.hp<0||player.hp>20)){flag('invalid_hp',player.hp);ok=false;}if(save&&(save.bank<0||save.bank>1e9)){flag('invalid_bank',save.bank);ok=false;}if(Number.isFinite(score)&&Number.isFinite(coins))ok=plausibleRun(score,coins)&&ok;return ok;}catch(e){flag('inspect_error',e.message||e);return false;}}
 function verdict(height,coinCount){const clean=plausibleRun(height,coinCount)&&session.flags.filter(f=>Date.now()-f.at<300000).length<4;const payload=[Math.floor(height||0),Math.floor(coinCount||0),session.runStartedAt,session.signature,SKY_PUFF_VERSION].join('|');return {ok:clean,signature:hash(payload),flags:session.flags.slice(-8),runStartedAt:session.runStartedAt};}
 const previousStartGame=typeof startGame==='function'?startGame:null;if(previousStartGame){startGame=function(){beginRun();return previousStartGame.apply(this,arguments);};}
 setInterval(inspectState,2500);
 window.skyPuffAntiCheat={beginRun,inspectState,verdict,acceptTransition,get status(){return {runStartedAt:session.runStartedAt,flags:session.flags.slice(),blockedSubmissions:session.blockedSubmissions,sessionSignature:session.signature};},noteBlockedSubmission(){session.blockedSubmissions++;}};
 beginRun();
})();


;/* js/input_missions_boss_spawn.js */
window.skyPuffTapState={time:0,x:0,y:0,lockUntil:0};
window.skyPuffWorldBurst={count:0,cooldownUntil:0,lastBoostAt:0};
canvas.style.touchAction='none';
function gamePointerX(clientX){try{const mapped=window.PufflingDesktopViewport?.toGameX?.(clientX);if(Number.isFinite(Number(mapped)))return Number(mapped);const raw=Number(clientX);return Number.isFinite(raw)?raw:W/2}catch(e){const raw=Number(clientX);return Number.isFinite(raw)?raw:W/2}}
canvas.addEventListener('pointerdown',e=>{const gx=gamePointerX(e.clientX);active=true;pointerX=gx;const n=performance.now(),tap=window.skyPuffTapState,dt=n-tap.time,dx=gx-tap.x,dy=e.clientY-tap.y,close=Math.hypot(dx,dy)<110;if(dt>=55&&dt<=360&&close&&n>=tap.lockUntil){doBoost();tap.time=0;tap.lockUntil=n+170;}else{tap.time=n;tap.x=gx;tap.y=e.clientY;}lastTap=n;});canvas.addEventListener('pointermove',e=>{if(active)pointerX=gamePointerX(e.clientX)});canvas.addEventListener('pointerup',()=>active=false);canvas.addEventListener('pointercancel',()=>active=false);
function doBoost(){const now=performance.now();const baseCost=Math.max(20,28-save.upBoost*2);const cost=bossArena?baseCost:Math.max(16,baseCost-4);if(!running||boost<cost)return;let burstStep=1;if(!bossArena){const burst=window.skyPuffWorldBurst;if(now<burst.cooldownUntil)return;if(burst.cooldownUntil&&now>=burst.cooldownUntil){burst.count=0;burst.cooldownUntil=0;burst.lastBoostAt=0;}if(burst.lastBoostAt&&now-burst.lastBoostAt>900)burst.count=0;if(burst.count>=5){burst.cooldownUntil=now+2000;return;}burst.count++;burstStep=burst.count;burst.lastBoostAt=now;if(burst.count>=5)burst.cooldownUntil=now+2000;}boost-=cost;if(!bossArena){const chainBonus=(burstStep-1)*1.0;const lift=8.6+save.upBoost*.28+chainBonus;const speedCap=-13.2-(burstStep-1)*.75;player.vy=Math.max(speedCap,Math.min(player.vy,0)-lift);}puffAnim=1.25;screenShake=Math.max(screenShake,4);combo=Math.min(9,combo+1);bestCombo=Math.max(bestCombo,combo);comboTimer=95;if(boss){const over=rainbowOvercharge>0;playerShots.push({x:player.x,y:player.y-player.r-8,vx:0,vy:over?-12:-10.2,r:over?14:11,life:120,damage:(12+save.upBoost*2)*(over?2:1)});for(let i=0;i<(over?16:8);i++)particles.push({x:player.x+(Math.random()-.5)*12,y:player.y-player.r,vx:(Math.random()-.5)*(over?2:1.2),vy:-2-Math.random()*(over?5:3),life:18+Math.random()*12,hue:(i*42)%360,size:3+Math.random()*(over?6:4)});}for(let i=0;i<25;i++)particles.push({x:player.x+(Math.random()-.5)*22,y:player.y+22,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,life:38+Math.random()*18,hue:(i*15)%360,size:4+Math.random()*7});}
function hitPlayer(x,y,r){return Math.hypot(player.x-x,player.y-y)<player.r+r}
function checkMission(){return;}
function nextBossStage(){for(const b of bossStages){if(score>=b.at&&!defeatedBosses[b.id]&&b.at>lastBossTriggerAt)return {...b,tier:1};}const endless=getEndlessBossStage(score);if(!endless||endless.tier<=1||endless.at<=lastBossTriggerAt||score<endless.at)return null;const base=bossStages.find(b=>b.id===endless.id);if(!base)return null;return {...base,...endless,hp:Math.max(base.hp,endlessBossHealth(endless)*24),reward:Math.max(base.reward,endlessBossReward(endless))};}
function cancelBossWarning(){if(window.skyBossWarningTimer){clearTimeout(window.skyBossWarningTimer);window.skyBossWarningTimer=null;}bossWarningActive=false;bossPendingStage=null;if(bossWarningEl)bossWarningEl.style.display='none';}
function triggerBossWarning(stage){if(bossWarningActive||boss||!stage)return;cancelBossWarning();bossWarningActive=true;bossPendingStage=stage;const tier=stage.tier||1;bossWarningTextEl.textContent=tier>1?`${stage.emoji} ${stage.name} • TIER ${tier}`:tr('bossIncoming');bossWarningEl.style.display='block';window.skyBossWarningTimer=setTimeout(()=>{window.skyBossWarningTimer=null;if(bossWarningEl)bossWarningEl.style.display='none';bossWarningActive=false;const s=bossPendingStage;bossPendingStage=null;if(running&&!paused&&s&&!boss&&s.at>lastBossTriggerAt)spawnBoss(s);},1200);}
function spawnBoss(stage){
 bossDefeated=false;
 window.skyBossEntryState={cameraY,score,playerX:player.x,stageAt:stage.at||score};
 bossArena=true;
 enemies.length=0;
 bossArenaY=Math.max(330,Math.min(H-105,H*.78));
 const bossY=Math.max(105,Math.min(155,H*.20));
 player.y=bossArenaY;player.vy=0;player.vx=0;pointerX=player.x;
 boss={id:stage.id,name:stage.name,x:W/2,y:bossY,hp:stage.hp,maxHp:stage.hp,dir:1,r:stage.id==='galaxy'?48:40,shot:0,reward:stage.reward,emoji:stage.emoji,at:stage.at||0,tier:stage.tier||1};bossSpawned=true;bossWrap.style.display='block';bossBar.style.width='100%';if(bossIdentityEl){bossIdentityEl.style.display='block';bossIdentityNameEl.textContent=`${stage.emoji} ${stage.name}`;bossTierEl.textContent=(stage.tier||1)>1?`• TIER ${stage.tier}`:'';}showToast(`${stage.name}! ${stage.emoji}`);startBossMusic(stage.id);}


;/* js/gameplay_update.js */
function fireBossShot(angle,speed,r,type,life=180){bossShots.push({x:boss.x,y:boss.y+30,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r,type,life});}
function fireAimedBossShot(speed,r,type,offset=0){const dx=player.x-boss.x,dy=player.y-boss.y;const angle=Math.atan2(dy,dx)+offset;fireBossShot(angle,speed,r,type);}
function bossAttackPattern(){const tier=Math.max(1,boss.tier||1),bonus=Math.min(.9,(tier-1)*.08);if(boss.id==='storm'){const speed=4.7+bonus;fireAimedBossShot(speed,11,'storm',-.16);fireAimedBossShot(speed,11,'storm',.16);if(tier>=3)fireAimedBossShot(speed+0.2,10,'storm',0);return;}if(boss.id==='candy'){const speed=4.35+bonus;fireAimedBossShot(speed,11,'candy',-.28);fireAimedBossShot(speed,11,'candy',.28);return;}if(boss.id==='ice'){const speed=3.8+bonus*.65;fireAimedBossShot(speed,15,'ice',0);if(tier>=2)fireAimedBossShot(speed*.92,12,'ice',tier%2?-.24:.24);return;}const speed=5.2+bonus;fireAimedBossShot(speed,12,'galaxy',0);setTimeout(()=>{if(running&&boss&&boss.id==='galaxy')fireAimedBossShot(speed+.25,11,'galaxy',tier>=3?.12:0);},120);}
function absorbHit(){if(superShieldCharges>0){superShieldCharges--;invuln=65;screenShake=5;showToast(`Super Shield! ${superShieldCharges} igjen 🛡️`);if(superShieldCharges<=0)shield=0;return true;}if(shield>0){shield=0;invuln=55;showToast(tr('shieldSaved'));return true;}return false;}
function enemyContactEffect(x,y){screenShake=Math.max(screenShake,7);puffAnim=1;for(let i=0;i<12;i++){const a=Math.PI*2*i/12+Math.random()*.3,sp=2+Math.random()*3;particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:16+Math.random()*10,hue:8+Math.random()*45,size:2.5+Math.random()*4});}}
function createSafeBossExit(){const landingY=cameraY+Math.min(H-115,H*.78);const landingW=Math.min(150,W-40);const landingX=Math.max(20,Math.min(W-landingW-20,player.x-landingW/2));platforms.push({x:landingX,y:landingY,w:landingW,h:16,phase:0,move:false,breakable:false,used:false,safeBossExit:true});player.x=landingX+landingW/2;player.y=landingY-player.r-2;player.vx=0;player.vy=-8.8;pointerX=player.x;invuln=Math.max(invuln,75);}
function update(dt){
 const s=Math.min(dt/16.67,1.6);if(screenShake>0)screenShake=Math.max(0,screenShake-.45*s);if(Math.abs(puffAnim)>.01)puffAnim*=Math.pow(.82,s);else puffAnim=0;if(bossFlash>0)bossFlash-=s;for(const sp of skySparkles){sp.tw+=.035*s;sp.y+=.03*s;if(sp.y>H+5)sp.y=-5;}
 const target=(pointerX-player.x)*.035;player.vx+=target*s;player.vx*=Math.pow(.86,s);player.vx=Math.max(-7.5,Math.min(7.5,player.vx));player.x+=player.vx*s;if(bossArena&&boss){player.y=bossArenaY;player.vy=0;}player.vy+=.42*s;if(!bossArena)player.y+=player.vy*s;else player.y=bossArenaY;player.rot=player.vx*.035;if(player.x<-player.r)player.x=W+player.r;if(player.x>W+player.r)player.x=-player.r;
 if(invuln>0)invuln-=s;if(shield>0)shield-=s;if(magnet>0)magnet-=s;if(mega>0)mega-=s;if(coinRush>0)coinRush-=s;if(rainbowOvercharge>0)rainbowOvercharge-=s;player.r=mega>0?38:28;
 if(!bossArena&&player.vy>0){for(const p of platforms){const py=p.y-cameraY,prev=(player.y-player.vy*s)+player.r,curr=player.y+player.r;if(!p.used&&prev<=py+4&&curr>=py&&player.x+player.r*.72>p.x&&player.x-player.r*.72<p.x+p.w){player.y=py-player.r;player.vy=-10.6;puffAnim=-1;boost=Math.min(100,boost+7);combo=Math.min(9,combo+1);bestCombo=Math.max(bestCombo,combo);comboTimer=80;if(p.breakable)p.used=true}}}
 const ceiling=H*.40;if(player.y<ceiling){const sh=ceiling-player.y;cameraY-=sh;player.y=ceiling;score=Math.max(score,Math.floor((-cameraY)/10));scoreEl.textContent=score}
 if(!bossArena&&score>=nextLifePickupAt){const targetPlatform=platforms.filter(p=>{const sy=p.y-cameraY;return !p.used&&sy>-120&&sy<160;}).sort((a,b)=>a.y-b.y)[0];const px=targetPlatform?targetPlatform.x+targetPlatform.w/2:40+Math.random()*(W-80);const py=targetPlatform?targetPlatform.y-48:cameraY-120;powerups.push({x:px,y:py,type:'life',taken:false,milestone:nextLifePickupAt});showToast(`Ekstra liv ved ${nextLifePickupAt} m! ❤️`);nextLifePickupAt+=500;}
 if(!bossArena&&score>=nextMilestoneRewardAt){const targetPlatform=platforms.filter(p=>{const sy=p.y-cameraY;return !p.used&&sy>-150&&sy<130;}).sort((a,b)=>a.y-b.y)[0];const reward=100+Math.floor(nextMilestoneRewardAt/2500)*25;const px=targetPlatform?targetPlatform.x+targetPlatform.w/2:45+Math.random()*(W-90);const py=targetPlatform?targetPlatform.y-62:cameraY-140;powerups.push({x:px,y:py,type:'treasure',taken:false,reward,milestone:nextMilestoneRewardAt});showToast(`Milepæl ${nextMilestoneRewardAt} m! Finn skatten 💎`);nextMilestoneRewardAt+=2500;}
 let minY=Infinity;for(const p of platforms){if(p.move)p.x+=Math.sin(performance.now()/650+p.phase)*.4*s;minY=Math.min(minY,p.y)}while(minY-cameraY>-140){minY-=70+Math.random()*38;addPlatform(minY)}
 for(const e of enemies){e.x+=e.vx*s;e.y+=Math.sin(performance.now()/300+e.phase)*.15*s;if(e.x<20||e.x>W-20)e.vx*=-1;const sy=e.y-cameraY;if(hitPlayer(e.x,sy,e.r)&&invuln<=0){enemyContactEffect((player.x+e.x)/2,(player.y+sy)/2);if(absorbHit()){}else if(mega>0){invuln=35;showToast(tr('megaSmash'))}else{player.hp--;hpEl.textContent=player.hp;invuln=75;player.vy=-7;combo=1;if(player.hp<=0)return endGame()}}}
 for(const c of coinItems){const sy=c.y-cameraY;c.spin+=.08*s;const range=150+save.upMagnet*25;if(magnet>0&&!c.taken){const dx=player.x-c.x,dy=player.y-sy,d=Math.hypot(dx,dy);if(d<range){c.x+=dx*.08*s;c.y+=(dy*.08*s)}}if(!c.taken&&hitPlayer(c.x,sy,c.r)){c.taken=true;const mult=coinRush>0?2:1;coins+=combo*mult;coinsEl.textContent=coins;boost=Math.min(100,boost+10);combo=Math.min(9,combo+1);bestCombo=Math.max(bestCombo,combo);comboTimer=90}}
 for(const p of powerups){const sy=p.y-cameraY;if(!p.taken&&hitPlayer(p.x,sy,16)){p.taken=true;if(p.type==='shield'){shield=480;superShieldCharges=0;showToast(tr('shield'))}if(p.type==='magnet'){magnet=520+save.upMagnet*100;showToast(tr('magnet'))}if(p.type==='mega'){mega=420;showToast(tr('mega'))}if(p.type==='life'){const maxHp=6+save.upHealth,before=player.hp;player.hp=Math.min(maxHp,player.hp+1);hpEl.textContent=player.hp;showToast(player.hp>before?'Ekstra liv! +1 ❤️':'Maks liv ❤️');}if(p.type==='treasure'){save.bank+=p.reward||100;window.SkyPuffDiamonds?.add?.(1);persist();refreshMenu();if(window.skyPuffAchievements?.treasureCollected)window.skyPuffAchievements.treasureCollected();showToast(`Puffling Treasure! +${p.reward||100} 🪙 +1 💎`);for(let i=0;i<28;i++)particles.push({x:p.x,y:sy,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,life:28+Math.random()*20,hue:40+Math.random()*70,size:3+Math.random()*5});}if(p.type==='coinRush'){coinRush=600;showToast('Coin Rush! Mynter x2 🪙✨');}if(p.type==='superShield'){shield=900;superShieldCharges=3;showToast('Super Shield! 3 treff 🛡️💙');}if(p.type==='overcharge'){rainbowOvercharge=600;boost=100;boostEl.style.width='100%';showToast('Rainbow Overcharge! 🌈⚡');}}}
 if(!boss&&!bossWarningActive){const stage=nextBossStage();if(stage)triggerBossWarning(stage);}
 if(boss){let bossSpeed=1.4;if(boss.id==='candy')bossSpeed=1.7;if(boss.id==='ice')bossSpeed=1.15;if(boss.id==='galaxy')bossSpeed=2.0;bossSpeed*=1+Math.min(.28,Math.max(0,(boss.tier||1)-1)*.035);boss.x+=boss.dir*bossSpeed*s;if(boss.x<55||boss.x>W-55)boss.dir*=-1;boss.shot+=s;const tier=Math.max(1,boss.tier||1);let cadence=102;if(boss.id==='storm')cadence=94;if(boss.id==='candy')cadence=108;if(boss.id==='ice')cadence=126;if(boss.id==='galaxy')cadence=88;cadence=Math.max(54,cadence-(tier-1)*5);if(boss.shot>cadence){boss.shot=0;bossAttackPattern();}if(hitPlayer(boss.x,boss.y,boss.r)&&invuln<=0){if(!absorbHit()){player.hp--;hpEl.textContent=player.hp;invuln=90;screenShake=10;if(player.hp<=0)return endGame();}}}
 for(const shot of playerShots){shot.x+=shot.vx*s;shot.y+=shot.vy*s;shot.life-=s;if(boss&&Math.hypot(shot.x-boss.x,shot.y-boss.y)<shot.r+boss.r){shot.life=0;boss.hp-=shot.damage;bossFlash=7;screenShake=Math.max(screenShake,5);bossBar.style.width=Math.max(0,boss.hp/boss.maxHp*100)+'%';showToast(tr('bossHit'));for(let i=0;i<14;i++)particles.push({x:shot.x,y:shot.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:24,hue:(i*25)%360,size:3+Math.random()*4});if(boss.hp<=0){if(bossRushMode){finishBossRushWin();return;}const defeatedId=boss.id,reward=boss.reward,bossName=boss.name,bossAt=boss.at||0,bossTier=boss.tier||1;lastBossTriggerAt=Math.max(lastBossTriggerAt,bossAt);if(bossTier===1)defeatedBosses[defeatedId]=true;bossDefeated=true;boss=null;bossSpawned=false;bossArena=false;createSafeBossExit();puffAnim=1;bossShots=[];bossWrap.style.display='none';if(bossIdentityEl)bossIdentityEl.style.display='none';stopBossMusic(true);running=true;save.bank+=reward;persist();if(bossTier===1)unlockBossCosmetic(defeatedId);showToast(tr('bossDefeated',{name:bossName,reward}));}}}
 playerShots=playerShots.filter(q=>q.life>0&&q.x>-30&&q.x<W+30&&q.y>-60&&q.y<H+60);for(const shot of bossShots){shot.x+=shot.vx*s;shot.y+=shot.vy*s;shot.life-=s;if(hitPlayer(shot.x,shot.y,shot.r)&&invuln<=0){shot.life=0;if(absorbHit()){}else if(mega>0){invuln=35;showToast(tr('megaSmash'));}else{player.hp--;hpEl.textContent=player.hp;invuln=75;player.vy=-6;combo=1;screenShake=8;if(player.hp<=0)return endGame();}}}bossShots=bossShots.filter(q=>q.life>0&&q.x>-40&&q.x<W+40&&q.y>-80&&q.y<H+80);
 if(comboTimer>0){comboTimer-=s;comboEl.textContent='COMBO x'+combo;comboEl.style.opacity=1;comboEl.style.transform='translateX(-50%) scale(1)'}else{combo=1;comboEl.style.opacity=0;comboEl.style.transform='translateX(-50%) scale(.8)'}boost=Math.min(100,boost+(bossArena?.105:.035)*s);boostEl.style.width=boost+'%';for(const q of particles){q.x+=q.vx*s;q.y+=q.vy*s;q.life-=s}particles=particles.filter(q=>q.life>0);platforms=platforms.filter(p=>p.y-cameraY<H+120&&!p.used);coinItems=coinItems.filter(c=>c.y-cameraY<H+100&&!c.taken);powerups=powerups.filter(p=>p.y-cameraY<H+100&&!p.taken);enemies=enemies.filter(e=>e.y-cameraY<H+130);checkMission();if(player.y-player.r>H+90)endGame();
}
function endGame(){if(!running)return;running=false;paused=false;if(typeof cancelBossWarning==='function')cancelBossWarning();else{bossWarningActive=false;bossPendingStage=null;if(bossWarningEl)bossWarningEl.style.display='none';}stopBossMusic(false);bossArena=false;bossArenaY=0;boss=null;bossSpawned=false;playerShots=[];bossShots=[];if(bossWrap)bossWrap.style.display='none';if(bossIdentityEl)bossIdentityEl.style.display='none';if(pauseMenuEl)pauseMenuEl.style.display='none';if(resumeCountdownEl)resumeCountdownEl.style.display='none';if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';multiplayerMode=false;multiplayerState='idle';const gain=Math.floor(coins*(1+save.upCoin*.15));save.bank+=gain;save.total+=score;save.best=Math.max(save.best,score);if(score<300)save.streak=0;persist();submitOnlineScore(score);finalScoreEl.textContent=score;finalCoinsEl.textContent=coins;finalComboEl.textContent=bestCombo;bankGainEl.textContent=gain;gameOverEl.style.display='flex';}


;/* js/late_game_bosses.js */
/* Sky Puff — six unique late-game bosses after 10,000m v0.2 */
(function(){
 const LATE=[
  {id:'solar',at:10500,name:'Solar Seraph',emoji:'☀️',hp:430,reward:1900,r:43},
  {id:'void',at:12500,name:'Void Phantom',emoji:'🕳️',hp:500,reward:2250,r:42},
  {id:'thunder',at:14500,name:'Thunder Colossus',emoji:'⚡',hp:575,reward:2650,r:47},
  {id:'crystal',at:17000,name:'Crystal Hydra',emoji:'💎',hp:660,reward:3100,r:46},
  {id:'inferno',at:20000,name:'Inferno Emperor',emoji:'🔥',hp:760,reward:3700,r:48},
  {id:'cosmic',at:24000,name:'Cosmic Devourer',emoji:'🌌',hp:900,reward:4500,r:52}
 ];
 window.SkyPuffLateBosses=LATE;
 // Add as normal one-time boss stages. Existing nextBossStage() will pick these before endless repeats.
 if(typeof bossStages!=='undefined'){
  for(const b of LATE)if(!bossStages.some(x=>x.id===b.id))bossStages.push({...b});
  bossStages.sort((a,b)=>(a.at||0)-(b.at||0));
 }
 // Ensure reset tracks them as unbeaten each run.
 const oldReset=window.reset;
 if(typeof oldReset==='function')window.reset=function(){const out=oldReset.apply(this,arguments);for(const b of LATE)defeatedBosses[b.id]=false;return out;};
 // Give each boss a lightweight identity via radius; attack patterns are overridden separately.
 const oldSpawn=window.spawnBoss;
 if(typeof oldSpawn==='function')window.spawnBoss=function(stage){oldSpawn(stage);const cfg=LATE.find(x=>x.id===stage.id);if(cfg&&boss)boss.r=cfg.r;};
 // The synth engine has four canonical themes. Map every late boss to a safe theme so
 // startBossMusic never falls silent or enters an undefined pattern.
 const oldMusic=window.startBossMusic;
 const musicMap={solar:'candy',void:'ice',thunder:'storm',crystal:'ice',inferno:'storm',cosmic:'galaxy'};
 if(typeof oldMusic==='function')window.startBossMusic=function(id){return oldMusic(musicMap[id]||id);};
 window.SkyPuffLateBossMusicMap=Object.freeze({...musicMap});
})();


;/* js/late_boss_persistence_fix.js */
/* Puffling — persist unlocks for all fixed bosses, including late-game bosses */
(function(){
 const late=Array.isArray(window.SkyPuffLateBosses)?window.SkyPuffLateBosses:[];
 function key(id){return 'boss'+String(id).charAt(0).toUpperCase()+String(id).slice(1)}
 function storageKey(id){return 'skyPuffBoss'+String(id).charAt(0).toUpperCase()+String(id).slice(1)}
 for(const b of late){try{save[key(b.id)]=localStorage.getItem(storageKey(b.id))==='1';}catch(e){save[key(b.id)]=!!save[key(b.id)];}}
 const oldPersist=window.persist;
 if(typeof oldPersist==='function')window.persist=function(){const out=oldPersist.apply(this,arguments);for(const b of late){try{localStorage.setItem(storageKey(b.id),save[key(b.id)]?'1':'0');}catch(e){}}return out;};
 window.PufflingBossPersistence={ids:late.map(x=>x.id),key,storageKey};
})();

;/* js/boss_rush_all_defeated.js */
/* Puffling — dynamic Boss Rush unlocks for every defeated boss */
(function(){
 function saveKey(id){return 'boss'+id.charAt(0).toUpperCase()+id.slice(1)}
 function unlocked(id){try{return !!(save&&save[saveKey(id)])}catch(e){return false}}
 function wins(){try{return window.skyPuffBossRushProgress?.wins?.()||JSON.parse(localStorage.getItem('skyPuffBossRushWinsV1')||'{}')}catch(e){return {}}}
 function rewardFor(id){const E=window.PufflingRewardEconomy;return wins()[id]?(E?.REPLAY_RUSH_REWARD||25):(E?.FIRST_RUSH_REWARD||250)}
 function allStages(){
  const seen=new Set();
  return (typeof bossStages!=='undefined'?bossStages:[])
   .filter(s=>s&&s.id&&!String(s.id).startsWith('endless-'))
   .sort((a,b)=>(a.at||0)-(b.at||0))
   .filter(s=>{if(seen.has(s.id))return false;seen.add(s.id);return true;});
 }
 function render(){
  if(typeof bossRushListEl==='undefined'||!bossRushListEl)return;
  const t=typeof modeText==='function'?modeText():{reward:'Reward',locked:'Defeat a boss in the main game first to unlock it here.'};
  bossRushListEl.innerHTML='';let any=false;const w=wins();
  for(const stage of allStages()){
   if(!unlocked(stage.id))continue;any=true;
   const b=document.createElement('button');b.className='secondary';b.style.margin='6px';const reward=rewardFor(stage.id),label=w[stage.id]?'Replay':'First clear';
   b.innerHTML=`${stage.emoji||'👑'} ${stage.name||stage.id}<br><span style="font-size:12px">${label} • ${t.reward}: ${reward} 🪙</span>`;
   b.onclick=()=>typeof startBossRush==='function'&&startBossRush(stage);
   bossRushListEl.appendChild(b);
  }
  if(!any){const empty=document.createElement('div');empty.className='small';empty.textContent=t.locked;bossRushListEl.appendChild(empty);}
 }
 function open(){
  if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='none';
  if(typeof multiplayerHudEl!=='undefined'&&multiplayerHudEl)multiplayerHudEl.style.display='none';
  render();
  if(typeof bossRushMenuEl!=='undefined'&&bossRushMenuEl)bossRushMenuEl.style.display='flex';
 }
 window.renderBossRush=render;window.openBossRush=open;
 const btn=document.getElementById('bossRushBtn');if(btn)btn.onclick=open;
 window.PufflingBossRush={render,allStages,unlocked,open,rewardFor};
})();

;/* js/boss_pattern_override.js */
// Boss attack loop: 3 normal attacks, 1 alternate pattern, 2 normal attacks,
// 1 alternate pattern, then repeat. Alternate patterns always fire exactly 3 projectiles.
(function(){
  if(typeof bossAttackPattern!=='function') return;

  function normalAttack(speed,type,tier){
    fireAimedBossShot(speed,11,type,-.16);
    fireAimedBossShot(speed,11,type,.16);
    if(tier>=3)fireAimedBossShot(speed+.2,10,type,0);
  }

  function alternateAttack(speed,type,variant){
    if(variant%2===1){
      // Alternate A: wide three-lane fan, exactly 3 simultaneous projectiles.
      fireAimedBossShot(speed*.96,10,type,-.32);
      fireAimedBossShot(speed+.08,11,type,0);
      fireAimedBossShot(speed*.96,10,type,.32);
      return;
    }

    // Alternate B: tighter three-lane fan, exactly 3 simultaneous projectiles.
    fireAimedBossShot(speed+.12,10,type,-.20);
    fireAimedBossShot(speed+.18,11,type,0);
    fireAimedBossShot(speed+.12,10,type,.20);
  }

  bossAttackPattern=function(){
    if(!boss)return;
    const tier=Math.max(1,boss.tier||1);
    const bonus=Math.min(.9,(tier-1)*.08);
    const speed=4.7+bonus;
    const type=boss.id||'storm';

    boss.patternShotCount=(boss.patternShotCount||0)+1;
    const step=(boss.patternShotCount-1)%7;

    // Sequence: N N N A N N A -> repeat.
    if(step===3||step===6){
      boss.altPatternCount=(boss.altPatternCount||0)+1;
      alternateAttack(speed,type,boss.altPatternCount);
    }else{
      normalAttack(speed,type,tier);
    }
  };
})();

;/* js/late_game_boss_patterns.js */
/* Sky Puff — readable late boss patterns with guaranteed dodge windows v0.2 */
(function(){
 const old=window.bossAttackPattern;if(typeof old!=='function')return;
 const state={};
 const cfg={
  solar:{cool:1500},void:{cool:1650},thunder:{cool:1750},crystal:{cool:1850},inferno:{cool:1700},cosmic:{cool:1900}
 };
 function aimed(speed,r,type,off=0){fireAimedBossShot(speed,r,type,off)}
 function ready(id){const n=performance.now(),s=state[id]||(state[id]={next:0,step:0});if(n<s.next)return null;s.next=n+cfg[id].cool;s.step++;return s;}
 window.bossAttackPattern=function(){
  if(!boss)return;
  const id=boss.id;if(!cfg[id])return old();
  const s=ready(id);if(!s)return;
  // Design rule: no full-screen walls. Every volley leaves a wide lane and at least 1.5s before the next volley.
  if(id==='solar'){
   // Alternates left/right fans, deliberately leaving the opposite outer side open.
   const side=s.step%2?-1:1;[.06,.22,.38].forEach(o=>aimed(4.05,9,id,o*side));return;
  }
  if(id==='void'){
   // Three readable lanes with very wide gaps; center is omitted every other volley.
   if(s.step%2){aimed(4.35,10,id,-.48);aimed(4.35,10,id,.12);}else{aimed(4.35,10,id,-.12);aimed(4.35,10,id,.48);}return;
  }
  if(id==='thunder'){
   // Two-shot telegraphed-feeling sweep; delayed shot follows same side instead of cutting off escape.
   const side=s.step%2?-1:1;aimed(4.7,10,id,.18*side);setTimeout(()=>{if(running&&boss?.id===id)aimed(4.9,9,id,.38*side)},260);return;
  }
  if(id==='crystal'){
   // Slow three-projectile fan; generous outside lanes remain safe.
   [-.30,0,.30].forEach(o=>aimed(3.65,9,id,o));return;
  }
  if(id==='inferno'){
   // Alternating two-lane burst. Never fires a follow-up into the current escape side.
   const side=s.step%2?-1:1;aimed(4.55,11,id,.08*side);aimed(4.35,9,id,.34*side);return;
  }
  if(id==='cosmic'){
   // Final boss: 3-shot sweep, but one whole outer lane is always intentionally empty.
   const side=s.step%2?-1:1;[.02,.20,.38].forEach((o,i)=>aimed(4.25+(i===1?.15:0),9+(i===1?1:0),id,o*side));return;
  }
 };
 window.SkyPuffLateBossPatternSafety={minVolleyGap:1500,rule:'one-wide-safe-lane'};
})();


;/* js/boss_movement_fix.js */
// Keep bosses inside the arena so reversing direction can never leave them stuck off-screen.
(function(){
  if(typeof update!=='function') return;
  const originalUpdate=update;
  update=function(dt){
    originalUpdate(dt);
    if(!boss) return;
    const minX=55,maxX=W-55;
    if(boss.x<minX){boss.x=minX;boss.dir=Math.abs(boss.dir||1);}
    else if(boss.x>maxX){boss.x=maxX;boss.dir=-Math.abs(boss.dir||1);}
    if(!Number.isFinite(boss.dir)||boss.dir===0) boss.dir=Math.random()<.5?-1:1;
  };
})();

;/* js/boss_transition_fix.js */
(function(){
 const originalNextBossStage=nextBossStage;
 nextBossStage=function(){
  if(window.skyBossResumeGate!=null){
   if(score<window.skyBossResumeGate)return null;
   window.skyBossResumeGate=null;
  }
  return originalNextBossStage();
 };

 createSafeBossExit=function(){
  const entry=window.skyBossEntryState||{};
  const stageAt=Number.isFinite(entry.stageAt)?entry.stageAt:null;

  if(stageAt!=null){score=stageAt;cameraY=-stageAt*10;}
  else{if(Number.isFinite(entry.cameraY))cameraY=entry.cameraY;if(Number.isFinite(entry.score))score=entry.score;}
  scoreEl.textContent=score;
  window.skyPuffAntiCheat?.acceptTransition?.(score,coins);

  // Always create a guaranteed landing cloud under Puff plus a reachable continuation cloud above it.
  const landingScreenY=Math.min(H-105,H*.76);
  const landingY=cameraY+landingScreenY;
  const landingW=Math.min(170,W-36);
  const preferredX=Number.isFinite(entry.playerX)?entry.playerX:player.x;
  const landingX=Math.max(18,Math.min(W-landingW-18,preferredX-landingW/2));
  const landingCenter=landingX+landingW/2;

  const nextScreenY=landingScreenY-88;
  const nextW=Math.min(125,W-44);
  // Limit horizontal gap so a normal jump can always reach the next cloud.
  const desiredNextX=landingCenter+(landingCenter<W/2?58:-58)-nextW/2;
  const nextX=Math.max(22,Math.min(W-nextW-22,desiredNextX));

  platforms=platforms.filter(p=>{const sy=p.y-cameraY;return Math.abs(sy-landingScreenY)>30&&Math.abs(sy-nextScreenY)>26;});
  platforms.push({x:landingX,y:landingY,w:landingW,h:18,phase:0,move:false,breakable:false,used:false,safeBossExit:true});
  platforms.push({x:nextX,y:cameraY+nextScreenY,w:nextW,h:16,phase:0,move:false,breakable:false,used:false,safeBossContinuation:true});

  player.x=landingCenter;player.y=landingScreenY-player.r-2;player.vx=0;player.vy=0;pointerX=player.x;
  invuln=Math.max(invuln,220);
  window.skyBossResumeGate=score+80;window.skyBossEntryState=null;

  // Hold Puff safely on the lower cloud, then resume with a normal jump toward the guaranteed continuation cloud.
  window.skyBossExitLockUntil=performance.now()+3000;
  if(resumeCountdownEl&&resumeCountdownTextEl){
   resumeCountdownEl.style.display='flex';const started=performance.now();
   function tick(now){
    const left=Math.max(0,3000-(now-started));const seconds=Math.max(1,Math.ceil(left/1000));resumeCountdownTextEl.textContent=left>0?String(seconds):'GO!';
    if(left>0&&running&&!boss){player.y=landingScreenY-player.r-2;player.vx=0;player.vy=0;requestAnimationFrame(tick);}
    else{resumeCountdownEl.style.display='none';if(running&&!boss){player.vy=-10.6;puffAnim=-1;}}
   }
   requestAnimationFrame(tick);
  }else setTimeout(()=>{if(running&&!boss)player.vy=-10.6;},3000);
 };
})();


;/* js/post_boss_guard.js */
(function(){
 const originalDoBoost=doBoost;
 doBoost=function(){
  if(window.skyBossExitLockUntil&&performance.now()<window.skyBossExitLockUntil)return;
  return originalDoBoost();
 };

 const originalReset=reset;
 reset=function(){
  window.skyBossExitLockUntil=0;
  if(resumeCountdownEl)resumeCountdownEl.style.display='none';
  return originalReset();
 };
})();

;/* js/boss_boost_tuning.js */
// Increase Rainbow Puff recharge during boss fights without changing normal gameplay.
(function(){
  if(typeof update!=='function')return;
  const originalUpdate=update;
  update=function(dt){
    const wasBossFight=!!(bossArena&&boss&&running);
    originalUpdate(dt);
    if(!wasBossFight||!running)return;
    const s=Math.min(dt/16.67,1.6);
    // Base gameplay already adds 0.105 per frame-step in boss fights.
    // Add 0.21 more for roughly 3x the original boss recharge rate.
    boost=Math.min(100,boost+0.21*s);
    if(boostEl)boostEl.style.width=boost+'%';
  };
})();

;/* js/combo_ui_remove.js */
(function(){
  if(typeof comboEl!=='undefined'&&comboEl){
    comboEl.style.display='none';
    comboEl.setAttribute('aria-hidden','true');
  }
})();


;/* js/mission_ui_remove.js */
(function(){
 const mission=document.getElementById('mission');
 const complete=document.getElementById('missionComplete');
 if(mission)mission.style.display='none';
 if(complete)complete.style.display='none';
})();


;/* js/rainbow_puff_hint.js */
(function(){
 const hint=document.createElement('div');hint.id='rainbowPuffHint';
 const texts={no:'Dobbeltklikk for boost 🌈',en:'Double tap for boost 🌈',de:'Doppeltippen für Boost 🌈',es:'Doble toque para boost 🌈',fr:'Double-tapez pour le boost 🌈'};
 function updateHint(){const selected=(typeof lang!=='undefined'&&lang)||(typeof save!=='undefined'&&save.lang)||'en';const next=texts[selected]||texts.en;if(hint.textContent!==next)hint.textContent=next;const visible=typeof running!=='undefined'&&running&&!(typeof paused!=='undefined'&&paused);const d=visible?'block':'none';if(hint.style.display!==d)hint.style.display=d}
 Object.assign(hint.style,{position:'fixed',left:'50%',bottom:'calc(env(safe-area-inset-bottom, 0px) + 8px)',transform:'translateX(-50%)',zIndex:'7',pointerEvents:'none',fontSize:'12px',fontWeight:'900',letterSpacing:'.2px',color:'rgba(255,255,255,.92)',textShadow:'0 2px 6px rgba(0,0,0,.45)',background:'rgba(20,55,90,.22)',padding:'4px 9px',borderRadius:'999px',whiteSpace:'nowrap',opacity:'.82',display:'none'});
 document.body.appendChild(hint);updateHint();
 if(typeof languageSelectEl!=='undefined'&&languageSelectEl)languageSelectEl.addEventListener('change',updateHint);
 setInterval(updateHint,750);
})();

;/* js/start_guard.js */
let skyPuffRunStartedAt=0;
let skyPuffLastGameOverReason='none';
let skyPuffStartupRescues=0;

(function(){
  const originalStartGame=startGame;
  const originalEndGame=endGame;
  const START_BOUNCE_SPEED=-10.6;

  function markStart(){skyPuffRunStartedAt=performance.now();skyPuffLastGameOverReason='none';skyPuffStartupRescues=0;}
  function rescueStartup(reason='startup-fall',scheduleFrame=false){
    if(!player||skyPuffStartupRescues>=3)return false;
    skyPuffStartupRescues++;
    const startPlatform=platforms&&platforms[0];
    const platformY=startPlatform?startPlatform.y:H*.82;
    running=true;paused=false;player.x=W/2;player.y=platformY-player.r-2;player.vx=0;player.vy=START_BOUNCE_SPEED;cameraY=0;invuln=120;pointerX=W/2;lastTime=performance.now();
    if(gameOverEl)gameOverEl.style.display='none';if(startEl)startEl.style.display='none';
    skyPuffLastGameOverReason=String(reason);
    console.warn('Sky Puff startup rescue',{reason,rescues:skyPuffStartupRescues,scheduleFrame});
    if(scheduleFrame)requestAnimationFrame(loop);
    return true;
  }
  startGame=function(){markStart();const result=originalStartGame();skyPuffRunStartedAt=performance.now();setTimeout(()=>{if(running&&!paused){try{localStorage.removeItem('skyPuffLastError')}catch(_){}window.skyPuffRuntimeLastError=null;if(window.skyPuffBetaDiagnostics&&typeof window.skyPuffBetaDiagnostics.clearLastError==='function')window.skyPuffBetaDiagnostics.clearLastError();}},2500);return result;};
  if(playBtnEl)playBtnEl.onclick=startGame;if(retryBtnEl)retryBtnEl.onclick=startGame;
  endGame=function(reason='unknown'){
    const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;
    skyPuffLastGameOverReason=String(reason||'unknown');
    const startup=elapsed<6000&&score<=5&&player&&player.hp>0;
    if(startup&&rescueStartup(reason||'endGame',false))return;
    return originalEndGame();
  };
  if(gameOverEl&&window.MutationObserver){new MutationObserver(()=>{const elapsed=skyPuffRunStartedAt?performance.now()-skyPuffRunStartedAt:Infinity;const visible=getComputedStyle(gameOverEl).display!=='none';if(visible&&elapsed<6000&&score<=5&&player&&player.hp>0)rescueStartup('game-over-overlay',true);}).observe(gameOverEl,{attributes:true,attributeFilter:['style','class']});}
  window.skyPuffStartGuard={get status(){return{active:true,runStartedAt:skyPuffRunStartedAt,lastGameOverReason:skyPuffLastGameOverReason,startupRescues:skyPuffStartupRescues}}};
})();

;/* js/achievements.js */
(function(){
 const unlockedThisRun=new Set();
 function unlock(key,title,reward){if(save[key])return false;save[key]=true;save.bank+=reward;persist();refreshMenu();showToast(`Achievement: ${title}! +${reward} 🪙 🏅`);return true;}
 function checkHeight(){
  const targets=[
   ['achSkyLegend','skyLegend',10000,'SKY LEGEND',1000],
   ['achCloudBreaker','cloudBreaker',25000,'CLOUD BREAKER',1800],
   ['achSkyImmortal','skyImmortal',50000,'SKY IMMORTAL',3000]
  ];
  for(const [key,runKey,target,title,reward] of targets){if(score>=target&&!save[key]&&!unlockedThisRun.has(runKey)){unlockedThisRun.add(runKey);unlock(key,title,reward);}}
 }
 function eventCleared(){save.eventsCleared=(save.eventsCleared||0)+1;persist();if(save.eventsCleared>=5)unlock('achEventMaster','EVENT MASTER',750);}
 function recordBossDefeat(tier){
  save.bossWins=(save.bossWins||0)+1;persist();
  if((tier||1)>=3)unlock('achBossHunter','BOSS HUNTER',1250);
  if(save.bossWins>=10)unlock('achBossVeteran','BOSS VETERAN',2000);
 }
 function treasureCollected(){save.treasuresCollected=(save.treasuresCollected||0)+1;persist();if(save.treasuresCollected>=10)unlock('achTreasureHunter','TREASURE HUNTER',1500);}
 const previousUpdate=update;
 update=function(dt){const hadBoss=!!boss,previousTier=hadBoss?(boss.tier||1):1;previousUpdate(dt);if(running)checkHeight();if(hadBoss&&!boss&&running&&bossDefeated)recordBossDefeat(previousTier);};
 window.skyPuffAchievements={eventCleared,bossDefeated:recordBossDefeat,treasureCollected,checkHeight};
})();


;/* js/achievements_menu.js */
(function(){
 function card(title,icon,done,progress,reward){const status=done?'FULLFØRT ✅':'LÅST 🔒';return `<div style="background:rgba(255,255,255,.82);border:2px solid ${done?'rgba(255,200,55,.8)':'rgba(90,140,190,.18)'};border-radius:16px;padding:12px 14px;box-shadow:0 6px 18px rgba(40,90,130,.10)"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><strong style="font-size:17px;color:#35516b">${icon} ${title}</strong><span style="font-size:12px;font-weight:1000;color:${done?'#cc8c00':'#6c7d8e'}">${status}</span></div><div style="font-size:13px;font-weight:800;color:#5b6f82;margin-top:6px">${progress}</div><div style="font-size:12px;font-weight:900;color:#8b6b22;margin-top:5px">Reward: ${reward}</div></div>`;}
 function render(){if(!achievementsListEl||!achievementsSummaryEl)return;const flags=[save.achSkyLegend,save.achCloudBreaker,save.achSkyImmortal,save.achEventMaster,save.achBossHunter,save.achBossVeteran,save.achTreasureHunter];const doneCount=flags.filter(Boolean).length;achievementsSummaryEl.textContent=`${doneCount}/7 achievements fullført`;const currentHeight=Math.max(save.best||0,score||0);achievementsListEl.innerHTML=
  card('SKY LEGEND','☁️🏆',!!save.achSkyLegend,`${Math.min(10000,currentHeight).toLocaleString()} / 10 000 m i én run`,'1000 🪙 + Sky Legend Halo ✨')+
  card('CLOUD BREAKER','☁️💥',!!save.achCloudBreaker,`${Math.min(25000,currentHeight).toLocaleString()} / 25 000 m i én run`,'1800 🪙 + Cloud Breaker Crown ☁️💥')+
  card('SKY IMMORTAL','♾️☁️',!!save.achSkyImmortal,`${Math.min(50000,currentHeight).toLocaleString()} / 50 000 m i én run`,'3000 🪙 + Sky Immortal Halo ♾️')+
  card('EVENT MASTER','🌪️🏅',!!save.achEventMaster,`${Math.min(5,save.eventsCleared||0)} / 5 endless-events fullført`,'750 🪙 + Event Crown 🌪️')+
  card('BOSS HUNTER','👑⚔️',!!save.achBossHunter,save.achBossHunter?'Tier 3+ boss beseiret':'Beseir en Tier 3+ boss','1250 🪙 + Boss Hunter Helm 👑')+
  card('BOSS VETERAN','⚔️🏆',!!save.achBossVeteran,`${Math.min(10,save.bossWins||0)} / 10 boss-seire`,'2000 🪙 + Boss Veteran Crown ⚔️')+
  card('TREASURE HUNTER','💎🏅',!!save.achTreasureHunter,`${Math.min(10,save.treasuresCollected||0)} / 10 Sky Treasures`,'1500 🪙 + Treasure Crown 💎');}
 function open(){render();startEl.style.display='none';achievementsMenuEl.style.display='flex';}
 function close(){achievementsMenuEl.style.display='none';startEl.style.display='flex';}
 if(achievementsBtnEl)achievementsBtnEl.onclick=open;if(closeAchievementsEl)closeAchievementsEl.onclick=close;window.skyPuffAchievementsMenu={open,close,render};
})();

;/* js/endless_events.js */
(function(){
 const originalUpdate=update;
 let coinStormTick=0;
 const banner=document.createElement('div');
 banner.id='endlessEventBanner';
 banner.style.cssText='display:none;position:fixed;left:50%;top:130px;transform:translateX(-50%);z-index:7;pointer-events:none;background:rgba(20,30,60,.82);color:#fff;border:2px solid rgba(255,255,255,.55);border-radius:18px;padding:10px 16px;font:1000 16px Arial;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.22);backdrop-filter:blur(6px)';
 document.body.appendChild(banner);
 const defs={coinStorm:{name:'COIN STORM',icon:'🪙🌪️',duration:620},lowGravity:{name:'LOW GRAVITY',icon:'🌙☁️',duration:660},rainbowFrenzy:{name:'RAINBOW FRENZY',icon:'🌈⚡',duration:560}};
 function startEvent(id){const d=defs[id];if(!d)return;endlessEvent=id;endlessEventTime=d.duration;coinStormTick=0;banner.textContent=`${d.icon} ${d.name}`;banner.style.display='block';if(id==='rainbowFrenzy'){boost=100;rainbowOvercharge=Math.max(rainbowOvercharge,d.duration);}showToast(`${d.name}! ${d.icon}`);}
 function stopEvent(completed=false){if(completed&&endlessEvent&&window.skyPuffAchievements)window.skyPuffAchievements.eventCleared();endlessEvent=null;endlessEventTime=0;coinStormTick=0;banner.style.display='none';}
 function maybeStart(){if(score<4500||boss||bossWarningActive||bossArena||endlessEvent||score<nextEndlessEventAt)return;const ids=['coinStorm','lowGravity','rainbowFrenzy'];startEvent(ids[Math.floor(Math.random()*ids.length)]);nextEndlessEventAt=score+900+Math.floor(Math.random()*700);}
 update=function(dt){const wasVy=player&&player.vy;originalUpdate(dt);if(!running){stopEvent(false);return;}maybeStart();if(!endlessEvent)return;if(boss||bossWarningActive||bossArena){stopEvent(false);nextEndlessEventAt=Math.max(nextEndlessEventAt,score+700);return;}const s=Math.min(dt/16.67,1.6);endlessEventTime-=s;if(endlessEvent==='lowGravity'&&player&&Number.isFinite(player.vy)&&Number.isFinite(wasVy))player.vy-=.20*s;if(endlessEvent==='coinStorm'){coinStormTick+=s;if(coinStormTick>18){coinStormTick=0;coinItems.push({x:28+Math.random()*(W-56),y:cameraY-40-Math.random()*110,r:10,taken:false,spin:Math.random()*6});}}if(endlessEvent==='rainbowFrenzy'){boost=Math.min(100,boost+.28*s);rainbowOvercharge=Math.max(rainbowOvercharge,12);boostEl.style.width=boost+'%';}banner.style.opacity=String(Math.max(.45,Math.min(1,endlessEventTime/80)));if(endlessEventTime<=0){showToast('Event ferdig! ✨');stopEvent(true);}};
 window.skyPuffEndlessEvents={start:startEvent,stop:()=>stopEvent(false),get active(){return endlessEvent;}};
})();


;/* js/player_render_helpers.js */
function drawCloud(x,y,s,a=.3){ctx.save();ctx.globalAlpha=a;const g=ctx.createLinearGradient(x,y-30*s,x,y+28*s);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#dff4ff');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,26*s,0,Math.PI*2);ctx.arc(x+28*s,y-8*s,34*s,0,Math.PI*2);ctx.arc(x+60*s,y,25*s,0,Math.PI*2);ctx.fill();ctx.globalAlpha=a*.22;ctx.fillStyle='#4fa6d8';ctx.beginPath();ctx.ellipse(x+30*s,y+18*s,43*s,10*s,0,0,Math.PI*2);ctx.fill();ctx.restore();}
function activeSkin(){return skins[save.skin]||skins.classic;}
function drawTrail(){const sk=activeSkin();const trail=save.trail==='auto'?sk.trail:save.trail;if(player.vy>=0)return;if(trail==='rainbow'||trail==='candy'||trail==='mint'||trail==='gold'||trail==='storm'||trail==='ice'||trail==='galaxy'||trail==='fire'||trail==='royal'||trail==='neon'||trail==='aurora'){let cols=['#ff4d6d','#ff9f1c','#ffe66d','#4cd97b','#4dabf7','#8b5cf6'];if(trail==='mint')cols=['#8fffe0','#4de0bd','#22bfa0','#9affef','#5fe8ce','#c8fff4'];if(trail==='gold')cols=['#fff1a8','#ffd84d','#ffbd2e','#ffe77a','#ffc24b','#fff4bf'];if(trail==='storm')cols=['#d8e0ea','#8da0b5','#67798b','#c6d1dc','#7e91a3','#edf2f7'];if(trail==='ice')cols=['#e8fbff','#aeeeff','#74d8ff','#d2f6ff','#8be6ff','#ffffff'];if(trail==='galaxy')cols=['#7b61ff','#a55eea','#5f27cd','#00d2d3','#c56cf0','#341f97'];if(trail==='fire')cols=['#fff36b','#ffb12b','#ff6b2b','#ff3b30','#ff8d4d','#ffd166'];if(trail==='royal')cols=['#d8c6ff','#9b7cff','#6c4cff','#f0e7ff','#ad95ff','#ffffff'];if(trail==='neon')cols=['#00fff0','#ff00f5','#8cff00','#00a8ff','#ffea00','#ff3b81'];if(trail==='aurora')cols=['#6fffe9','#5eead4','#8b5cf6','#60a5fa','#34d399','#a7f3d0'];if(trail==='candy')cols=['#ff9bd6','#ffd2f0','#ff7ac8','#b794ff','#9ee7ff','#ffffff'];for(let i=0;i<6;i++){ctx.strokeStyle=cols[i%cols.length];ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-12+i*5,22);ctx.quadraticCurveTo(-15+i*4,36,(-18+i*5)+Math.sin(performance.now()/120+i)*5,55);ctx.stroke();}}else if(trail==='hearts'||trail==='stars'){ctx.font='18px Arial';ctx.textAlign='center';for(let i=0;i<4;i++){ctx.globalAlpha=.75-i*.15;ctx.fillText(trail==='hearts'?'💖':'⭐',(i-1.5)*11,32+i*11);}ctx.globalAlpha=1;}}
function drawHat(){
 const h=hats[save.hat]?save.hat:'none';if(h==='none')return;
 const icon={crown:'👑',propeller:'🚁',halo:'😇',wizard:'🧙',legendHalo:'✨',eventCrown:'🌪️',hunterHelm:'🛡️',cloudBreakerCrown:'☁️',immortalHalo:'♾️',bossVeteranCrown:'⚔️',treasureCrown:'💎',stormCrown:'⚡',candyCrown:'🍭',iceCrown:'❄️',galaxyCrown:'👑'}[h];
 if(!icon)return;
 ctx.save();ctx.translate(0,-29);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=(h==='cloudBreakerCrown'||h==='hunterHelm')?'24px Arial':'26px Arial';
 if(h==='legendHalo'||h==='immortalHalo'){ctx.globalAlpha=.45;ctx.strokeStyle=h==='immortalHalo'?'#b197fc':'#ffe66d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-3,20,7,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
 ctx.fillText(icon,0,-2);
 if(h==='eventCrown'){ctx.font='14px Arial';ctx.fillText('👑',0,5)}
 if(h==='cloudBreakerCrown'){ctx.font='13px Arial';ctx.fillText('💥',15,-9)}
 if(h==='bossVeteranCrown'){ctx.font='13px Arial';ctx.fillText('👑',0,-11)}
 if(h==='treasureCrown'){ctx.font='13px Arial';ctx.fillText('👑',0,-10)}
 ctx.restore();
}
function drawFace(){const sk=activeSkin();const face=faceStyles[save.face]?save.face:'smile';ctx.fillStyle=sk.eye;if(face==='sleepy'){ctx.strokeStyle=sk.eye;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(-9,3,5,.15*Math.PI,.85*Math.PI);ctx.stroke();ctx.beginPath();ctx.arc(10,3,5,.15*Math.PI,.85*Math.PI);ctx.stroke();ctx.beginPath();ctx.arc(1,8,5,1.1*Math.PI,1.9*Math.PI);ctx.stroke();}else if(face==='happy'){ctx.strokeStyle=sk.eye;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(-9,3,5,.1*Math.PI,.9*Math.PI);ctx.stroke();ctx.beginPath();ctx.arc(10,3,5,.1*Math.PI,.9*Math.PI);ctx.stroke();ctx.beginPath();ctx.arc(1,6,9,.1*Math.PI,.9*Math.PI);ctx.stroke();}else if(face==='cool'){ctx.fillStyle='#1d2530';ctx.fillRect(-18,-2,14,7);ctx.fillRect(4,-2,14,7);ctx.fillRect(-4,0,8,2);ctx.strokeStyle=sk.eye;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(1,8,6,.05*Math.PI,.95*Math.PI);ctx.stroke();}else{ctx.beginPath();ctx.arc(-9,2,3.8,0,Math.PI*2);ctx.arc(10,2,3.8,0,Math.PI*2);ctx.fill();ctx.strokeStyle=sk.eye;ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(1,7,7,.1*Math.PI,.9*Math.PI);ctx.stroke();}}


;/* js/renderer_runtime.js */
function drawPlayer(){ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.rot);const squash=1+puffAnim*.10;const stretch=1-puffAnim*.07;ctx.scale(squash,stretch);drawTrail();const sk=skins[save.skin]||skins.classic;ctx.globalAlpha=.18;ctx.fillStyle='#4b7ea5';ctx.beginPath();ctx.ellipse(0,28,30,8,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;const grad=ctx.createLinearGradient(0,-34,0,32);grad.addColorStop(0,'#ffffff');grad.addColorStop(.55,sk.body);grad.addColorStop(1,'#dbeeff');ctx.fillStyle=grad;ctx.strokeStyle=superShieldCharges>0?'#59c3ff':shield>0?'#79f5ff':'rgba(45,120,180,.24)';ctx.lineWidth=superShieldCharges>0?8:shield>0?6:3.2;ctx.beginPath();ctx.arc(-17,3,18,0,Math.PI*2);ctx.arc(-2,-9,22,0,Math.PI*2);ctx.arc(19,1,20,0,Math.PI*2);ctx.arc(0,9,25,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.globalAlpha=.55;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-7,-15,9,5,-.3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;drawFace();const blushPulse=.88+Math.sin(performance.now()/260)*.08;ctx.fillStyle=sk.cheek;ctx.beginPath();ctx.arc(-18,9,5*blushPulse,0,Math.PI*2);ctx.arc(19,9,5*blushPulse,0,Math.PI*2);ctx.fill();drawHat();ctx.restore();}
function drawEnemy(e,y){ctx.save();ctx.translate(e.x,y);const bob=Math.sin(performance.now()/220+e.phase)*3;ctx.translate(0,bob);const bodyR=e.r*.72;ctx.globalAlpha=.18;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(0,21,e.r*.9,5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;const spikePulse=.96+Math.sin(performance.now()/180+e.phase)*.02;ctx.fillStyle='#26313c';ctx.strokeStyle='#161e27';ctx.lineWidth=1.5;for(let i=0;i<10;i++){const a=i*Math.PI*2/10,base=bodyR*.82,tip=e.r*spikePulse,side=.18;ctx.beginPath();ctx.moveTo(Math.cos(a-side)*base,Math.sin(a-side)*base);ctx.lineTo(Math.cos(a)*tip,Math.sin(a)*tip);ctx.lineTo(Math.cos(a+side)*base,Math.sin(a+side)*base);ctx.closePath();ctx.fill();ctx.stroke();}const g=ctx.createRadialGradient(-4,-5,2,0,0,bodyR*1.2);g.addColorStop(0,'#7f92a7');g.addColorStop(1,'#3f4b59');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,bodyR,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#2a333e';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-4,-1.5,3.2,0,Math.PI*2);ctx.arc(4,-1.5,3.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#b71c1c';ctx.beginPath();ctx.arc(-4,-1.5,1.6,0,Math.PI*2);ctx.arc(4,-1.5,1.6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#202832';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-8,-6);ctx.lineTo(-2,-4);ctx.moveTo(8,-6);ctx.lineTo(2,-4);ctx.stroke();ctx.restore()}
function drawPlayerShot(q){ctx.save();ctx.translate(q.x,q.y);const cols=['#ff4d6d','#ff9f1c','#ffe66d','#4cd97b','#4dabf7','#8b5cf6'];for(let i=0;i<6;i++){ctx.strokeStyle=cols[i];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8+i*3,24);ctx.lineTo(-8+i*3,5);ctx.stroke();}ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(0,0,q.r,0,Math.PI*2);ctx.fill();ctx.restore();}
function drawBossShot(q){ctx.save();ctx.translate(q.x,q.y);if(q.type==='storm'){ctx.fillStyle='#ffd43b';ctx.beginPath();ctx.arc(0,0,q.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff176';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(2,-2);ctx.lineTo(-3,8);ctx.lineTo(12,15);ctx.stroke();}else if(q.type==='candy'){ctx.fillStyle='#ff77c8';ctx.beginPath();ctx.arc(0,0,q.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-4,-4,3,0,Math.PI*2);ctx.fill();}else if(q.type==='ice'){ctx.fillStyle='#9eeaff';ctx.beginPath();ctx.moveTo(0,-q.r);ctx.lineTo(q.r,0);ctx.lineTo(0,q.r);ctx.lineTo(-q.r,0);ctx.closePath();ctx.fill();}else{const g=ctx.createRadialGradient(0,0,2,0,0,q.r);g.addColorStop(0,'#ffffff');g.addColorStop(.4,'#9b7cff');g.addColorStop(1,'#402080');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,q.r,0,Math.PI*2);ctx.fill();}ctx.restore();}
function drawBoss(){if(!boss)return;ctx.save();ctx.translate(boss.x,boss.y);const hover=Math.sin(performance.now()/260)*4;ctx.translate(0,hover);let col='#3d4655',glow='#7e91ff';if(boss.id==='candy'){col='#d75ba6';glow='#ff9ddd'}if(boss.id==='ice'){col='#77cde8';glow='#bdf6ff'}if(boss.id==='galaxy'){col='#6c55a8';glow='#bf9cff'}ctx.shadowColor=glow;ctx.shadowBlur=18;ctx.fillStyle=bossFlash>0?'#ffffff':col;ctx.beginPath();ctx.arc(-25,0,28,0,Math.PI*2);ctx.arc(0,-15,36,0,Math.PI*2);ctx.arc(28,0,30,0,Math.PI*2);ctx.arc(0,13,38,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=.35;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-10,-24,18,8,-.2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-12,-2,5,0,Math.PI*2);ctx.arc(12,-2,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#251d36';ctx.beginPath();ctx.arc(-12,-2,2.2,0,Math.PI*2);ctx.arc(12,-2,2.2,0,Math.PI*2);ctx.fill();ctx.font='25px Arial';ctx.textAlign='center';ctx.fillText(boss.emoji,0,18);ctx.restore();}
function drawPower(p,y){ctx.save();ctx.translate(p.x,y);const pulse=1+Math.sin(performance.now()/160)*.08;if(p.type==='life'){ctx.scale(pulse,pulse);ctx.shadowColor='#ff5a7a';ctx.shadowBlur=16;ctx.font='30px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('❤️',0,0);}else if(p.type==='treasure'){ctx.scale(pulse,pulse);ctx.shadowColor='#ffe66d';ctx.shadowBlur=20;ctx.font='32px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('💎',0,0);ctx.globalAlpha=.8;ctx.font='14px Arial';ctx.fillText('✨',-20,-16);ctx.fillText('✨',20,14);}else if(p.type==='coinRush'){ctx.scale(pulse,pulse);ctx.shadowColor='#ffd43b';ctx.shadowBlur=18;ctx.font='31px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🪙',0,0);ctx.font='13px Arial';ctx.fillText('x2',0,24);}else if(p.type==='superShield'){ctx.scale(pulse,pulse);ctx.shadowColor='#59c3ff';ctx.shadowBlur=20;ctx.font='32px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🛡️',0,0);ctx.font='13px Arial';ctx.fillText('x3',0,24);}else if(p.type==='overcharge'){ctx.scale(pulse,pulse);ctx.shadowColor='#c77dff';ctx.shadowBlur=22;ctx.font='32px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🌈',0,-2);ctx.font='16px Arial';ctx.fillText('⚡',18,15);}else{ctx.font='26px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.type==='shield'?'🛡️':p.type==='magnet'?'🧲':'⭐',0,0);}ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.restore()}
function draw(){const b=biome(),g=ctx.createLinearGradient(0,0,0,H);if(b==='blue'){g.addColorStop(0,'#58c4ff');g.addColorStop(1,'#d9f8ff')}if(b==='sunset'){g.addColorStop(0,'#ff9a76');g.addColorStop(1,'#ffd6c9')}if(b==='space'){g.addColorStop(0,'#1b2351');g.addColorStop(1,'#5f55a8')}if(b==='candy'){g.addColorStop(0,'#ff91d2');g.addColorStop(1,'#ffe1f5')}if(b==='frozen'){g.addColorStop(0,'#80dfff');g.addColorStop(1,'#eefcff')}if(b==='galaxy'){g.addColorStop(0,'#25164f');g.addColorStop(1,'#7858b8')}if(b==='endless'){g.addColorStop(0,'#101633');g.addColorStop(1,'#394c8b')}ctx.save();const sx=screenShake>0?(Math.random()-.5)*screenShake:0,sy=screenShake>0?(Math.random()-.5)*screenShake:0;ctx.translate(sx,sy);ctx.fillStyle=g;ctx.fillRect(-12,-12,W+24,H+24);for(const sp of skySparkles){const a=.18+.32*(.5+.5*Math.sin(sp.tw));ctx.globalAlpha=a;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(sp.x,sp.y,sp.s,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;for(const c of clouds){c.x+=c.drift||.08;if(c.x>W+90)c.x=-100;let y=(c.y+(-cameraY*.08))%(H+150)-75;drawCloud(c.x,y,c.s,b==='space'?.12:.28)}if(b==='space'||b==='galaxy'||b==='endless'){for(let i=0;i<35;i++){ctx.globalAlpha=.55;ctx.fillStyle='#fff';ctx.fillRect((i*83)%W,(i*137)%H,2,2)}ctx.globalAlpha=1}for(const p of platforms){const y=p.y-cameraY;if(y<-60||y>H+60)continue;ctx.save();ctx.globalAlpha=.18;ctx.fillStyle='#245a7a';ctx.beginPath();ctx.ellipse(p.x+p.w/2,y+17,p.w*.5,8,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;const pg=ctx.createLinearGradient(0,y-20,0,y+25);let top='#ffffff',bot='#d7efff';if(b==='candy'){top='#fff7fc';bot='#ffd9ef'}if(b==='frozen'){top='#ffffff';bot='#bfeeff'}if(b==='space'||b==='galaxy'||b==='endless'){top='#edf0ff';bot='#c2c8ff'}pg.addColorStop(0,top);pg.addColorStop(1,bot);ctx.fillStyle=pg;ctx.beginPath();ctx.arc(p.x+18,y+1,18,0,Math.PI*2);ctx.arc(p.x+p.w/2,y-7,23,0,Math.PI*2);ctx.arc(p.x+p.w-18,y+1,18,0,Math.PI*2);ctx.rect(p.x+16,y-1,p.w-32,20);ctx.fill();ctx.restore();}for(const c of coinItems){const y=c.y-cameraY;if(c.taken||y<-30||y>H+30)continue;ctx.fillStyle='#ffd43b';ctx.beginPath();ctx.arc(c.x,y,c.r,0,Math.PI*2);ctx.fill()}for(const p of powerups){const y=p.y-cameraY;if(!p.taken&&y>-40&&y<H+40)drawPower(p,y)}for(const e of enemies){const y=e.y-cameraY;if(y>-50&&y<H+50)drawEnemy(e,y)}for(const q of particles){ctx.globalAlpha=Math.max(0,q.life/25);ctx.fillStyle=`hsl(${q.hue} 90% 60%)`;ctx.beginPath();ctx.arc(q.x,q.y,q.size,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;for(const q of bossShots)drawBossShot(q);for(const q of playerShots)drawPlayerShot(q);drawBoss();drawPlayer();ctx.restore();}
function recordRuntimeError(err,phase){const payload={message:String(err&&err.message||err||'Unknown runtime error'),stack:String(err&&err.stack||''),phase:phase||'unknown',score:Number(score)||0,hp:player&&Number.isFinite(player.hp)?player.hp:null,playerY:player&&Number.isFinite(player.y)?Math.round(player.y):null,H:Number(H)||0,at:new Date().toISOString(),version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown'};window.skyPuffRuntimeLastError=payload;try{localStorage.skyPuffLastError=JSON.stringify(payload);}catch(_){}console.error('Sky Puff runtime error:',payload,err);return payload;}
function loop(t){if(multiplayerMode&&mpYouEl)mpYouEl.textContent=Math.floor(score)+'m';if(boss){if(!Number.isFinite(boss.t))boss.t=0;if(!Number.isFinite(boss.time))boss.time=0;if(!Number.isFinite(boss.timer))boss.timer=0;if(!Number.isFinite(boss.shotTimer))boss.shotTimer=0;if(!Number.isFinite(boss.attackTimer))boss.attackTimer=0;if(!Number.isFinite(boss.x))boss.x=W/2;if(!Number.isFinite(boss.y))boss.y=Math.max(120,H*.20);if(!Number.isFinite(boss.hp))boss.hp=5;if(!Number.isFinite(boss.maxHp))boss.maxHp=boss.hp;}if(!running||paused)return;let phase='frame';try{const dt=Math.min(34,Math.max(0,t-lastTime||16.67));lastTime=t;phase='update';update(dt);if(running){phase='draw';draw();}phase='schedule';}catch(err){recordRuntimeError(err,phase);running=false;paused=false;if(gameOverEl)gameOverEl.style.display='none';showToast('Teknisk feil registrert – åpne System & Support');setTimeout(()=>{try{showMainMenu();}catch(_){if(startEl)startEl.style.display='flex';}},700);return;}if(running&&!paused)requestAnimationFrame(loop);}
if(multiplayerBtnEl)multiplayerBtnEl.onclick=openMultiplayer;if(closeMultiplayerEl)closeMultiplayerEl.onclick=closeMultiplayer;if(quickMatchBtnEl)quickMatchBtnEl.onclick=quickMatch;if(createRoomBtnEl)createRoomBtnEl.onclick=createFriendRoom;if(joinRoomBtnEl)joinRoomBtnEl.onclick=joinFriendRoom;if(bossRushBtnEl)bossRushBtnEl.onclick=openBossRush;if(closeBossRushEl)closeBossRushEl.onclick=closeBossRush;reset();applyLanguage();draw();window.__skyPuffCoreReady=true;


;/* js/boss_puff_creator_v2.js */
(function(){
const KEY='skyPuffBossCreatorV1',D={body:'classic',color:'sky',face:'smile',hat:'none',aura:'rainbow',eyes:'round'};
const bodies={classic:'Classic Puff',round:'Round Puff',wide:'Wide Puff',mini:'Mini Puff'},colors={sky:'#dff4ff',pink:'#ffd8ee',mint:'#d7fff0',gold:'#fff0ad',violet:'#e4d8ff',storm:'#cbd8e8'},faces={smile:'Smile',happy:'Happy',cool:'Cool',fierce:'Fierce'},hats={none:'None',crown:'👑',halo:'😇',wizard:'🧙',storm:'⚡',ice:'❄️',star:'⭐'},auras={rainbow:'Rainbow',fire:'Fire',ice:'Ice',galaxy:'Galaxy',gold:'Gold'},eyes={round:'Round',spark:'Sparkle',angry:'Battle'};
let cfg=load(),overlay,preview;function load(){try{return {...D,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...D}}}function store(){localStorage.setItem(KEY,JSON.stringify(cfg))}function unlocked(){try{return ['storm','candy','ice','galaxy'].some(id=>!!save['boss'+id[0].toUpperCase()+id.slice(1)])}catch(e){return false}}
function tx(){const M={
no:['LAG DIN BOSS PUFF','Lag din Boss Puff','Kropp','Farge','Ansikt','Hodeplagg','Effekt','Øyne','LAGRE FIGUR','TILBAKE','Beseir minst én boss for å låse opp Boss Puff Creator.','Boss Puff kan kun brukes i Boss Rush frem til alle 4 bossene er beseiret i Boss Rush. Deretter kan den også brukes i vanlig spill.'],
en:['CREATE BOSS PUFF','Create your Boss Puff','Body','Color','Face','Headwear','Effect','Eyes','SAVE CHARACTER','BACK','Defeat at least one boss to unlock Boss Puff Creator.','Boss Puff can only be used in Boss Rush until all 4 bosses have been defeated in Boss Rush. After that, it can also be used in the main game.'],
de:['BOSS PUFF ERSTELLEN','Erstelle deinen Boss Puff','Körper','Farbe','Gesicht','Kopfbedeckung','Effekt','Augen','FIGUR SPEICHERN','ZURÜCK','Besiege mindestens einen Boss, um den Boss Puff Creator freizuschalten.','Boss Puff kann nur im Boss Rush verwendet werden, bis alle 4 Bosse im Boss Rush besiegt wurden. Danach kann er auch im Hauptspiel verwendet werden.'],
es:['CREAR BOSS PUFF','Crea tu Boss Puff','Cuerpo','Color','Cara','Accesorio','Efecto','Ojos','GUARDAR PERSONAJE','VOLVER','Derrota al menos a un jefe para desbloquear Boss Puff Creator.','Boss Puff solo puede usarse en Boss Rush hasta derrotar a los 4 jefes en Boss Rush. Después también podrá usarse en el juego principal.'],
fr:['CRÉER BOSS PUFF','Créez votre Boss Puff','Corps','Couleur','Visage','Accessoire','Effet','Yeux','ENREGISTRER','RETOUR','Battez au moins un boss pour débloquer Boss Puff Creator.','Boss Puff ne peut être utilisé que dans Boss Rush jusqu’à ce que les 4 boss y soient vaincus. Ensuite, il pourra aussi être utilisé dans le jeu principal.']};return M[typeof lang==='string'?lang:'en']||M.en}
function aura(id){return id==='fire'?['#fff36b','#ff8a2b','#ff3b30']:id==='ice'?['#eaffff','#8fe7ff','#4db8ff']:id==='galaxy'?['#8b5cf6','#d946ef','#22d3ee']:id==='gold'?['#fff5b8','#ffd43b','#ffb020']:['#ff4d6d','#ff9f1c','#ffe66d','#4cd97b','#4dabf7','#8b5cf6']}
function paint(c,x,y,s=1,rot=0,puff=0){c.save();c.translate(x,y);c.rotate(rot||0);c.scale(s,s);const A=aura(cfg.aura);c.globalAlpha=.42;A.forEach((v,i)=>{c.strokeStyle=v;c.lineWidth=3;c.beginPath();c.arc(0,3,34+i*2,.15*Math.PI+i*.06,.85*Math.PI+i*.06);c.stroke()});c.globalAlpha=1;let sx=1,sy=1;if(cfg.body==='round'){sx=.9;sy=1.08}else if(cfg.body==='wide'){sx=1.18;sy=.88}else if(cfg.body==='mini'){sx=.82;sy=.82}c.scale(sx*(1+puff*.07),sy*(1-puff*.05));const g=c.createLinearGradient(0,-35,0,32);g.addColorStop(0,'#fff');g.addColorStop(.55,colors[cfg.color]||colors.sky);g.addColorStop(1,'#cfe9ff');c.fillStyle=g;c.strokeStyle='rgba(42,105,165,.35)';c.lineWidth=3;c.beginPath();c.arc(-17,3,18,0,Math.PI*2);c.arc(-2,-9,22,0,Math.PI*2);c.arc(19,1,20,0,Math.PI*2);c.arc(0,9,25,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#24364a';if(cfg.eyes==='spark'){c.font='14px Arial';c.textAlign='center';c.fillText('✦',-9,4);c.fillText('✦',10,4)}else if(cfg.eyes==='angry'){c.strokeStyle='#24364a';c.lineWidth=3;c.beginPath();c.moveTo(-15,-1);c.lineTo(-5,3);c.moveTo(15,-1);c.lineTo(5,3);c.stroke();c.beginPath();c.arc(-9,5,2.5,0,Math.PI*2);c.arc(10,5,2.5,0,Math.PI*2);c.fill()}else{c.beginPath();c.arc(-9,2,3.8,0,Math.PI*2);c.arc(10,2,3.8,0,Math.PI*2);c.fill()}c.strokeStyle='#24364a';c.lineWidth=2.4;if(cfg.face==='happy'){c.beginPath();c.arc(1,5,9,.1*Math.PI,.9*Math.PI);c.stroke()}else if(cfg.face==='cool'){c.fillStyle='#17202b';c.fillRect(-18,-1,14,6);c.fillRect(4,-1,14,6);c.fillRect(-4,1,8,2)}else if(cfg.face==='fierce'){c.beginPath();c.moveTo(-5,12);c.lineTo(5,12);c.stroke()}else{c.beginPath();c.arc(1,7,7,.1*Math.PI,.9*Math.PI);c.stroke()}if(cfg.hat!=='none'){c.font='27px Arial';c.textAlign='center';c.textBaseline='middle';c.fillText(hats[cfg.hat]||'',0,-30)}c.restore()}
function renderPreview(){if(!preview)return;const c=preview.getContext('2d');c.clearRect(0,0,260,150);paint(c,130,83,1.45,0,.12)}function select(label,key,obj){const w=document.createElement('label');w.style.cssText='display:grid;gap:5px;text-align:left;font-weight:900;color:#35516b';w.textContent=label;const s=document.createElement('select');s.style.cssText='border:0;border-radius:12px;padding:10px;font-weight:800;background:#eef8ff;color:#35516b';Object.entries(obj).forEach(([id,n])=>{const o=document.createElement('option');o.value=id;o.textContent=n;o.selected=cfg[key]===id;s.appendChild(o)});s.onchange=()=>{cfg[key]=s.value;store();renderPreview()};w.appendChild(s);return w}
function ensure(){if(overlay)return;overlay=document.createElement('div');overlay.className='overlay';overlay.id='bossPuffCreator';overlay.style.display='none';const card=document.createElement('div');card.className='card';card.style.cssText='max-height:88vh;overflow:auto;width:min(88vw,390px)';const title=document.createElement('h1'),note=document.createElement('div');title.style.fontSize='30px';note.className='small';preview=document.createElement('canvas');preview.width=260;preview.height=150;preview.style.cssText='width:100%;max-width:260px;height:150px;margin:10px auto 12px;display:block;background:linear-gradient(#7dd7ff,#eafcff);border-radius:18px';const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:9px';const saveB=document.createElement('button'),back=document.createElement('button');saveB.className='gold';saveB.style.marginTop='14px';back.className='secondary';back.onclick=()=>{overlay.style.display='none';bossRushMenuEl.style.display='flex';button()};saveB.onclick=()=>{store();showToast('✓')};card.append(title,note,preview,grid,saveB,back);overlay.appendChild(card);document.body.appendChild(overlay);overlay._r={title,note,grid,saveB,back}}
function open(){ensure();const t=tx();if(!unlocked()){showToast(t[10]);return}cfg=load();bossRushMenuEl.style.display='none';overlay.style.display='flex';overlay._r.title.textContent=t[1];overlay._r.note.textContent=t[11];overlay._r.grid.innerHTML='';overlay._r.grid.append(select(t[2],'body',bodies),select(t[3],'color',Object.fromEntries(Object.keys(colors).map(k=>[k,k[0].toUpperCase()+k.slice(1)]))),select(t[4],'face',faces),select(t[5],'hat',hats),select(t[6],'aura',auras),select(t[7],'eyes',eyes));overlay._r.saveB.textContent=t[8];overlay._r.back.textContent=t[9];renderPreview()}
function button(){if(!bossRushMenuEl)return;let b=document.getElementById('bossPuffCreatorBtn');if(!b){b=document.createElement('button');b.id='bossPuffCreatorBtn';b.className='gold';b.style.cssText='display:block;width:100%;margin:8px 0 14px;padding:13px 12px;font-size:15px;position:relative;z-index:20';b.onclick=open;const card=bossRushMenuEl.querySelector('.card');if(card){const heading=card.querySelector('h1,h2');if(heading&&heading.nextSibling)card.insertBefore(b,heading.nextSibling);else card.insertBefore(b,card.firstChild)}else bossRushMenuEl.appendChild(b)}const t=tx();b.textContent=(unlocked()?'✨ ':'🔒 ')+t[0];b.style.display='block'}
const oldOpen=openBossRush;openBossRush=function(){oldOpen();setTimeout(button,0)};const oldDraw=drawPlayer;drawPlayer=function(){if(!bossRushMode)return oldDraw();paint(ctx,player.x,player.y,1,player.rot,puffAnim)};window.skyPuffBossCreator={open,getConfig:()=>({...cfg}),isUnlocked:unlocked,refreshButton:button};button();
})();

;/* js/boss_puff_premium.js */
(function(){
 const premiumCatalog=[];
 const groups=[
  ['headwear',['Royal Crown','Neon Crown','Dragon Horns','Crystal Horns','Galaxy Helm','Storm Helm','Ice Tiara','Fire Tiara','Angel Wings','Devil Horns','Cyber Visor','Pirate Hat','Samurai Helm','Knight Helm','Space Helmet','Wizard Crown','Flower Crown','Candy Crown','Golden Halo','Meteor Crown']],
  ['aura',['Solar Flare','Lunar Glow','Black Hole','Electric Storm','Frozen Mist','Inferno','Emerald Pulse','Ruby Pulse','Sapphire Pulse','Diamond Spark','Cosmic Dust','Pixel Burst','Retro Wave','Royal Glow','Ghost Mist','Dragon Fire','Aurora Max','Starfall','Rainbow Nova','Void Energy']],
  ['eyes',['Laser Eyes','Heart Eyes','Galaxy Eyes','Fire Eyes','Ice Eyes','Lightning Eyes','Star Eyes','Pixel Eyes','Robot Eyes','Cat Eyes','Dragon Eyes','Sleepy Glow','Diamond Eyes','Golden Eyes','Void Eyes','Retro Shades','Monocle','Royal Eyes','Storm Eyes','Candy Eyes']],
  ['face',['Hero Smile','Boss Grin','Battle Face','Cute Face','Mischief','Shocked','Focused','Sleepy','Royal Smile','Cyber Face','Dragon Face','Ghost Face','Pixel Face','Retro Face','Galaxy Face','Fire Face','Ice Face','Storm Face','Candy Face','Legend Face']],
  ['body',['Royal Puff','Dragon Puff','Galaxy Puff','Cyber Puff','Crystal Puff','Fire Puff','Ice Puff','Storm Puff','Candy Puff','Neon Puff','Shadow Puff','Golden Puff','Diamond Puff','Knight Puff','Wizard Puff','Angel Puff','Demon Puff','Pixel Puff','Retro Puff','Legend Puff']]
 ];
 groups.forEach(([type,names])=>names.forEach((name,i)=>premiumCatalog.push({id:`premium_${type}_${String(i+1).padStart(2,'0')}`,type,name,sku:`skypuff.creator.${type}.${String(i+1).padStart(2,'0')}`,premium:true})));
 const txt={
  no:{title:'Premium Creator',intro:'100 eksklusive accessories og stiler. Kjøp aktiveres når betalingsløsningen er koblet til.',open:'PREMIUM CREATOR',buy:'KJØP',soon:'Betaling er ikke aktivert i beta ennå.',back:'TILBAKE'},
  en:{title:'Premium Creator',intro:'100 exclusive accessories and styles. Purchases activate when the payment provider is connected.',open:'PREMIUM CREATOR',buy:'BUY',soon:'Payments are not enabled in the beta yet.',back:'BACK'},
  de:{title:'Premium Creator',intro:'100 exklusive Accessoires und Stile. Käufe werden nach Anbindung der Zahlung aktiviert.',open:'PREMIUM CREATOR',buy:'KAUFEN',soon:'Zahlungen sind in der Beta noch nicht aktiviert.',back:'ZURÜCK'},
  es:{title:'Premium Creator',intro:'100 accesorios y estilos exclusivos. Las compras se activarán al conectar el sistema de pago.',open:'PREMIUM CREATOR',buy:'COMPRAR',soon:'Los pagos aún no están activados en la beta.',back:'VOLVER'},
  fr:{title:'Premium Creator',intro:'100 accessoires et styles exclusifs. Les achats seront activés après connexion du paiement.',open:'PREMIUM CREATOR',buy:'ACHETER',soon:'Les paiements ne sont pas encore activés dans la bêta.',back:'RETOUR'}
 };
 let overlay=null;
 function T(){return txt[typeof lang==='string'?lang:'en']||txt.en;}
 async function purchase(item){
  const provider=window.skyPuffPremiumPurchaseProvider;
  if(provider&&typeof provider.purchase==='function'){
   try{const result=await provider.purchase(item.sku,item);if(result&&result.ok){showToast('Premium unlocked ✨');return true;}}catch(e){console.warn('Premium purchase failed',e);}
  }
  showToast(T().soon);return false;
 }
 function ensure(){
  if(overlay)return;
  overlay=document.createElement('div');overlay.id='bossPuffPremium';overlay.className='overlay';overlay.style.display='none';overlay.style.zIndex='30';
  const card=document.createElement('div');card.className='card';card.style.cssText='width:min(92vw,440px);max-height:90vh;overflow:auto';
  const title=document.createElement('h1');title.style.fontSize='30px';
  const intro=document.createElement('div');intro.className='small';intro.style.marginBottom='12px';
  const tabs=document.createElement('div');tabs.style.cssText='display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:10px 0';
  const list=document.createElement('div');list.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left';
  const back=document.createElement('button');back.className='secondary';back.style.marginTop='14px';back.onclick=()=>{overlay.style.display='none';const creator=document.getElementById('bossPuffCreator');if(creator)creator.style.display='flex';};
  card.append(title,intro,tabs,list,back);overlay.appendChild(card);document.body.appendChild(overlay);overlay._r={title,intro,tabs,list,back};
 }
 function render(type='headwear'){
  ensure();const t=T();overlay._r.title.textContent='✨ '+t.title;overlay._r.intro.textContent=t.intro;overlay._r.back.textContent=t.back;overlay._r.tabs.innerHTML='';overlay._r.list.innerHTML='';
  ['headwear','aura','eyes','face','body'].forEach(g=>{const b=document.createElement('button');b.className='secondary';b.style.cssText='width:auto;padding:8px 10px;font-size:12px';b.textContent=g.toUpperCase();b.onclick=()=>render(g);overlay._r.tabs.appendChild(b);});
  premiumCatalog.filter(x=>x.type===type).forEach(item=>{const b=document.createElement('button');b.className='secondary';b.style.cssText='min-height:68px;padding:8px;font-size:12px';b.innerHTML=`<strong>🔒 ${item.name}</strong><br><span style="opacity:.75">PREMIUM • ${item.sku.split('.').pop()}</span>`;b.onclick=()=>purchase(item);overlay._r.list.appendChild(b);});
 }
 function open(){render('headwear');const creator=document.getElementById('bossPuffCreator');if(creator)creator.style.display='none';overlay.style.display='flex';}
 function addButton(){
  const creator=document.getElementById('bossPuffCreator');if(!creator)return false;const card=creator.querySelector('.card');if(!card)return false;
  let b=document.getElementById('bossPuffPremiumBtn');if(!b){b=document.createElement('button');b.id='bossPuffPremiumBtn';b.className='gold';b.style.marginTop='10px';b.onclick=open;const back=[...card.querySelectorAll('button.secondary')].pop();if(back)card.insertBefore(b,back);else card.appendChild(b);}b.textContent='✨ '+T().open;return true;
 }
 if(!addButton()&&window.MutationObserver){
  const observer=new MutationObserver(()=>{if(addButton())observer.disconnect();});
  observer.observe(document.body,{childList:true,subtree:true});
 }
 if(typeof languageSelectEl!=='undefined'&&languageSelectEl)languageSelectEl.addEventListener('change',()=>setTimeout(addButton,0));
 window.skyPuffPremiumCreator={catalog:premiumCatalog,open,purchase,productCount:premiumCatalog.length,setPurchaseProvider(provider){window.skyPuffPremiumPurchaseProvider=provider;}};
})();

;/* js/boss_puff_main_unlock.js */
(function(){
const KEY='skyPuffBossRushWinsV1',USE='skyPuffUseBossPuffMain',IDS=['storm','candy','ice','galaxy','solar','void','thunder','crystal','inferno','cosmic'];
function readWins(){try{return {...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {}}}
let cachedWins=readWins();
let cachedAllWon=IDS.every(id=>!!cachedWins[id]);
let cachedUseMain=localStorage.getItem(USE)==='1';
function wins(){return {...cachedWins}}
function allWon(){return cachedAllWon}
function refreshCache(){cachedWins=readWins();cachedAllWon=IDS.every(id=>!!cachedWins[id]);cachedUseMain=localStorage.getItem(USE)==='1'}
function text(){const l=typeof lang==='string'?lang:'en';const M={no:['BRUK BOSS PUFF I HOVEDSPILLET','Boss Puff låses opp i hovedspillet når alle 10 bossene er beseiret i Boss Rush.','Boss Puff er nå låst opp i hovedspillet! ✨'],en:['USE BOSS PUFF IN MAIN GAME','Boss Puff unlocks in the main game after defeating all 10 bosses in Boss Rush.','Boss Puff is now unlocked in the main game! ✨'],de:['BOSS PUFF IM HAUPTSPIEL NUTZEN','Boss Puff wird nach Siegen über alle 10 Bosse im Boss Rush freigeschaltet.','Boss Puff ist jetzt im Hauptspiel freigeschaltet! ✨'],es:['USAR BOSS PUFF EN JUEGO PRINCIPAL','Boss Puff se desbloquea tras derrotar a los 10 jefes en Boss Rush.','¡Boss Puff ya está desbloqueado en el juego principal! ✨'],fr:['UTILISER BOSS PUFF DANS LE JEU PRINCIPAL','Boss Puff se débloque après avoir vaincu les 10 boss dans Boss Rush.','Boss Puff est maintenant débloqué dans le jeu principal ! ✨']};return M[l]||M.en}
function addToggle(){if(!cachedAllWon||document.getElementById('bossPuffMainToggle'))return;const host=document.querySelector('#start .card')||document.getElementById('start');if(!host)return;const b=document.createElement('button');b.id='bossPuffMainToggle';b.className='secondary';b.style.marginTop='8px';function sync(){b.textContent=(cachedUseMain?'✓ ':'')+text()[0]}b.onclick=()=>{cachedUseMain=!cachedUseMain;localStorage.setItem(USE,cachedUseMain?'1':'0');sync()};sync();host.appendChild(b)}
window.skyPuffBossRushProgress={record:function(id){if(!IDS.includes(id))return;const before=cachedAllWon;cachedWins[id]=true;cachedAllWon=IDS.every(x=>!!cachedWins[x]);localStorage.setItem(KEY,JSON.stringify(cachedWins));if(!before&&cachedAllWon){cachedUseMain=true;localStorage.setItem(USE,'1');showToast(text()[2]);addToggle()}},allWon,wins,refresh:refreshCache,ids:[...IDS]};
function hook(){if(typeof drawPlayer!=='function'||!window.skyPuffBossCreator){setTimeout(hook,250);return}const old=drawPlayer;drawPlayer=function(){const useMain=!bossRushMode&&cachedAllWon&&cachedUseMain;if(useMain){const was=bossRushMode;bossRushMode=true;try{return old()}finally{bossRushMode=was}}return old()};addToggle()}
hook();
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===USE){refreshCache();addToggle()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshCache();addToggle()}});
})();

;/* js/reward_economy_hardening.js */
/* Puffling — reward/economy hardening v1.1 */
(function(){
 const DAY=86400000;
 const FIRST_RUSH_REWARD=250,REPLAY_RUSH_REWARD=25;
 const lateCosmetics={
  solarCrown:{name:'Solar Crown ☀️',need:999999,boss:'solar'},
  voidMask:{name:'Void Mask 🕳️',need:999999,boss:'void'},
  thunderHelm:{name:'Thunder Helm ⚡',need:999999,boss:'thunder'},
  crystalCrown:{name:'Crystal Crown 💎',need:999999,boss:'crystal'},
  infernoCrown:{name:'Inferno Crown 🔥',need:999999,boss:'inferno'},
  cosmicCrown:{name:'Cosmic Crown 🌌',need:999999,boss:'cosmic'}
 };
 try{if(typeof hats!=='undefined')Object.assign(hats,lateCosmetics);}catch(e){}

 function claimDaily(){
  const now=Date.now();
  if(now-(Number(save.lastDaily)||0)<DAY){showToast(tr('dailyClaimed'));return false;}
  const previous=Number(save.lastDaily)||0,gap=previous?now-previous:Infinity;
  save.streak=previous&&gap<DAY*2?Math.max(1,(Number(save.streak)||0)+1):1;
  const reward=250;save.bank=(Number(save.bank)||0)+reward;save.lastDaily=now;persist();refreshMenu();
  if(typeof streakEl!=='undefined'&&streakEl)streakEl.textContent=save.streak;
  showToast(tr('dailyReward',{streak:save.streak,reward}));return true;
 }
 try{if(typeof dailyBtnEl!=='undefined'&&dailyBtnEl)dailyBtnEl.onclick=claimDaily;}catch(e){}

 const baseEnd=window.endGame;
 if(typeof baseEnd==='function'&&!baseEnd.__rewardStreakFixed){
  const wrapped=function(){const dailyStreak=Math.max(0,Number(save.streak)||0),out=baseEnd.apply(this,arguments);if(save.streak!==dailyStreak){save.streak=dailyStreak;persist();refreshMenu();if(typeof streakEl!=='undefined'&&streakEl)streakEl.textContent=dailyStreak;}return out;};
  wrapped.__rewardStreakFixed=true;window.endGame=wrapped;
 }

 function rushWins(){try{return window.skyPuffBossRushProgress?.wins?.()||JSON.parse(localStorage.getItem('skyPuffBossRushWinsV1')||'{}')}catch(e){return {}}}
 function rushReward(id){return rushWins()[id]?REPLAY_RUSH_REWARD:FIRST_RUSH_REWARD;}
 const originalFinish=window.finishBossRushWin;
 if(typeof originalFinish==='function')window.finishBossRushWin=function(){
  const wonId=typeof bossRushSelected!=='undefined'&&bossRushSelected&&bossRushSelected.id,reward=rushReward(wonId);
  if(wonId&&window.skyPuffBossRushProgress)window.skyPuffBossRushProgress.record(wonId);else if(wonId){try{const k='skyPuffBossRushWinsV1',w=JSON.parse(localStorage.getItem(k)||'{}');w[wonId]=true;localStorage.setItem(k,JSON.stringify(w))}catch(e){}}
  save.bank=(save.bank||0)+reward;persist();refreshMenu();bossRushMode=false;bossRushSelected=null;boss=null;bossSpawned=false;bossArena=false;bossArenaY=0;playerShots=[];bossShots=[];running=false;paused=false;stopBossMusic(false);if(bossWrap)bossWrap.style.display='none';if(bossWarningEl)bossWarningEl.style.display='none';if(bossRushMenuEl)bossRushMenuEl.style.display='none';showToast(`${modeText().bossWon} +${reward} 🪙`);setTimeout(()=>{showMainMenu();renderBossRush()},350);
 };

 function bossPuffNote(){const l=typeof lang==='string'?lang:'en';return({no:'Boss Puff kan brukes i Boss Rush. Beseir alle 10 bossene i Boss Rush for å låse den opp i hovedspillet.',en:'Boss Puff can be used in Boss Rush. Defeat all 10 bosses in Boss Rush to unlock it in the main game.',de:'Boss Puff kann im Boss Rush benutzt werden. Besiege alle 10 Bosse, um ihn im Hauptspiel freizuschalten.',es:'Boss Puff puede usarse en Boss Rush. Derrota a los 10 jefes para desbloquearlo en el juego principal.',fr:'Boss Puff peut être utilisé en Boss Rush. Battez les 10 boss pour le débloquer dans le jeu principal.'})[l]||'Boss Puff can be used in Boss Rush. Defeat all 10 bosses in Boss Rush to unlock it in the main game.';}
 function fixBossPuffCopy(){const root=document.getElementById('bossPuffCreator');if(!root)return;const note=root.querySelector('.card .small');if(note&&/4|four|vier|cuatro|quatre/.test(note.textContent||''))note.textContent=bossPuffNote();}
 if(typeof MutationObserver!=='undefined'&&document.body)new MutationObserver(fixBossPuffCopy).observe(document.body,{childList:true,subtree:true,characterData:true});setTimeout(fixBossPuffCopy,100);
 window.PufflingRewardEconomy={claimDaily,rushReward,FIRST_RUSH_REWARD,REPLAY_RUSH_REWARD,lateCosmetics,dailyStreakProtected:true,endlessRewardCap:6000,bossPuffRequires:10};
})();

;/* js/boss_visual_override.js */
// Visual-only boss upgrade. Gameplay sizes/hitboxes remain unchanged.
(function(){
  if(typeof drawBoss!=='function') return;

  function eye(x,y,iris,angry){
    ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x,y,6,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=iris;ctx.beginPath();ctx.arc(x,y,2.6,0,Math.PI*2);ctx.fill();
    if(angry){ctx.strokeStyle='rgba(20,20,35,.75)';ctx.lineWidth=2.3;ctx.beginPath();ctx.moveTo(x-7,y-8);ctx.lineTo(x+2,y-5);ctx.stroke();}
  }

  function aura(col,pulse){
    ctx.save();ctx.globalAlpha=.24+.09*pulse;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,2,54+4*pulse,45+3*pulse,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }

  drawBoss=function(){
    if(!boss)return;
    ctx.save();ctx.translate(boss.x,boss.y);
    const now=performance.now(),hover=Math.sin(now/260)*4,pulse=.5+.5*Math.sin(now/180);
    ctx.translate(0,hover);

    let main='#566273',dark='#26313d',light='#a7b6c8',glow='#ffe66d';
    if(boss.id==='candy'){main='#d75ba6';dark='#7b2d68';light='#ffb5e5';glow='#ff8ad8';}
    if(boss.id==='ice'){main='#72cde9';dark='#2e7694';light='#d9f8ff';glow='#9ff1ff';}
    if(boss.id==='galaxy'){main='#6853a8';dark='#281d5d';light='#c6b7ff';glow='#bb94ff';}

    aura(glow,pulse);
    ctx.shadowColor=glow;ctx.shadowBlur=20+8*pulse;

    if(boss.id==='storm'){
      // Armored thunder cloud with horn-like lightning fins.
      ctx.fillStyle='#ffd43b';
      for(const sx of [-1,1]){ctx.save();ctx.scale(sx,1);ctx.beginPath();ctx.moveTo(28,-28);ctx.lineTo(48,-39);ctx.lineTo(38,-18);ctx.lineTo(53,-15);ctx.lineTo(31,3);ctx.closePath();ctx.fill();ctx.restore();}
      const g=ctx.createLinearGradient(0,-42,0,38);g.addColorStop(0,light);g.addColorStop(.52,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;
      ctx.beginPath();ctx.arc(-27,2,27,0,Math.PI*2);ctx.arc(0,-16,35,0,Math.PI*2);ctx.arc(29,2,29,0,Math.PI*2);ctx.arc(0,15,37,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;ctx.strokeStyle='#dfe7ef';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-21,-27);ctx.lineTo(-10,-14);ctx.lineTo(-17,-2);ctx.moveTo(19,-27);ctx.lineTo(9,-13);ctx.lineTo(16,-1);ctx.stroke();
      eye(-13,-3,'#ffd43b',true);eye(13,-3,'#ffd43b',true);
      ctx.strokeStyle='#19232e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,12,13,.15*Math.PI,.85*Math.PI);ctx.stroke();
    }else if(boss.id==='candy'){
      // Candy dragon: horns, cheek scales, fangs and glossy candy body.
      ctx.fillStyle='#fff1a8';for(const sx of [-1,1]){ctx.save();ctx.scale(sx,1);ctx.beginPath();ctx.moveTo(18,-32);ctx.quadraticCurveTo(32,-53,38,-31);ctx.lineTo(28,-18);ctx.closePath();ctx.fill();ctx.restore();}
      const g=ctx.createRadialGradient(-10,-20,5,0,0,52);g.addColorStop(0,'#ffd7f0');g.addColorStop(.45,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;ctx.beginPath();ctx.ellipse(0,0,43,38,0,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;ctx.fillStyle='#ff8fcf';ctx.beginPath();ctx.arc(-28,9,8,0,Math.PI*2);ctx.arc(28,9,8,0,Math.PI*2);ctx.fill();
      eye(-14,-5,'#7b2d68',true);eye(14,-5,'#7b2d68',true);
      ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-10,13);ctx.lineTo(-4,24);ctx.lineTo(1,13);ctx.moveTo(10,13);ctx.lineTo(4,24);ctx.lineTo(-1,13);ctx.fill();
      ctx.strokeStyle='#8d2f72';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,10,16,.1*Math.PI,.9*Math.PI);ctx.stroke();
      ctx.globalAlpha=.5;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-12,-22,13,6,-.2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }else if(boss.id==='ice'){
      // Ice titan: crystal crown, angular jaw and frosty core.
      ctx.fillStyle='#dffaff';for(let i=-2;i<=2;i++){const x=i*15,h=24-Math.abs(i)*5;ctx.beginPath();ctx.moveTo(x-7,-28);ctx.lineTo(x,-28-h);ctx.lineTo(x+7,-28);ctx.closePath();ctx.fill();}
      const g=ctx.createLinearGradient(0,-45,0,40);g.addColorStop(0,'#e9fdff');g.addColorStop(.42,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;ctx.beginPath();ctx.moveTo(-40,-20);ctx.lineTo(-31,25);ctx.lineTo(-12,40);ctx.lineTo(12,40);ctx.lineTo(31,25);ctx.lineTo(40,-20);ctx.lineTo(20,-36);ctx.lineTo(-20,-36);ctx.closePath();ctx.fill();
      ctx.shadowBlur=0;ctx.strokeStyle='#b9f6ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-27,-20);ctx.lineTo(-15,2);ctx.lineTo(-26,24);ctx.moveTo(27,-20);ctx.lineTo(15,2);ctx.lineTo(26,24);ctx.stroke();
      eye(-13,-6,'#2e7694',true);eye(13,-6,'#2e7694',true);
      ctx.fillStyle='#d9fbff';ctx.beginPath();ctx.moveTo(-10,12);ctx.lineTo(0,22);ctx.lineTo(10,12);ctx.lineTo(0,30);ctx.closePath();ctx.fill();
      ctx.globalAlpha=.55+.25*pulse;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,6,6+2*pulse,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }else{
      // Galaxy King: crown, orbiting stars and royal cosmic face.
      ctx.strokeStyle='#bfa8ff';ctx.lineWidth=2;ctx.globalAlpha=.7;ctx.beginPath();ctx.ellipse(0,0,51,24,now/1100,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
      for(let i=0;i<4;i++){const a=now/700+i*Math.PI/2;ctx.fillStyle=i%2?'#ffe66d':'#d6c4ff';ctx.beginPath();ctx.arc(Math.cos(a)*49,Math.sin(a)*24,3.2,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#f7d76b';ctx.beginPath();ctx.moveTo(-27,-29);ctx.lineTo(-20,-48);ctx.lineTo(-8,-35);ctx.lineTo(0,-53);ctx.lineTo(9,-35);ctx.lineTo(22,-48);ctx.lineTo(29,-28);ctx.closePath();ctx.fill();
      const g=ctx.createRadialGradient(-12,-20,5,0,0,50);g.addColorStop(0,light);g.addColorStop(.48,main);g.addColorStop(1,dark);ctx.fillStyle=bossFlash>0?'#fff':g;ctx.beginPath();ctx.arc(0,2,40,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;eye(-14,-5,'#ffe66d',true);eye(14,-5,'#ffe66d',true);
      ctx.fillStyle='#fff';ctx.globalAlpha=.45;ctx.beginPath();ctx.arc(-23,16,2,0,Math.PI*2);ctx.arc(24,-17,2.5,0,Math.PI*2);ctx.arc(5,-24,1.8,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      ctx.strokeStyle='#2b1d58';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,13,15,.12*Math.PI,.88*Math.PI);ctx.stroke();
    }

    ctx.shadowBlur=0;
    if((boss.tier||1)>1){ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillText('TIER '+boss.tier,0,54);}
    ctx.restore();
  };
})();

;/* js/late_boss_visuals.js */
/* Sky Puff — lightweight late boss visual identities v0.1 */
(function(){
 const late=new Set(['solar','void','thunder','crystal','inferno','cosmic']);
 const old=window.drawBoss;if(typeof old!=='function')return;
 window.drawBoss=function(){
  if(!boss||!late.has(boss.id))return old();
  const id=boss.id,n=performance.now(),pulse=.5+.5*Math.sin(n/220);
  const pal={solar:['#ffd85a','#ff8b38'],void:['#8e69c7','#26183f'],thunder:['#ffe45c','#536b9e'],crystal:['#bdf9ff','#668cff'],inferno:['#ff9a3d','#a72d2d'],cosmic:['#d2b5ff','#38256f']}[id];
  ctx.save();ctx.translate(boss.x,boss.y+Math.sin(n/300)*3);
  ctx.globalAlpha=.18+.08*pulse;ctx.strokeStyle=pal[0];ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,boss.r+9+3*pulse,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
  ctx.shadowColor=pal[0];ctx.shadowBlur=12;
  const g=ctx.createRadialGradient(-10,-12,4,0,0,boss.r);g.addColorStop(0,'#fff');g.addColorStop(.28,pal[0]);g.addColorStop(1,pal[1]);ctx.fillStyle=typeof bossFlash!=='undefined'&&bossFlash>0?'#fff':g;
  ctx.beginPath();
  if(id==='crystal'){for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,r1=boss.r*.72,r2=boss.r;const x=Math.cos(a)*r2,y=Math.sin(a)*r2;const x1=Math.cos(a-.22)*r1,y1=Math.sin(a-.22)*r1;const x2=Math.cos(a+.22)*r1,y2=Math.sin(a+.22)*r1;ctx.moveTo(x1,y1);ctx.lineTo(x,y);ctx.lineTo(x2,y2);}ctx.fill();ctx.beginPath();ctx.arc(0,0,boss.r*.72,0,Math.PI*2);ctx.fill();}else{ctx.arc(0,0,boss.r*.82,0,Math.PI*2);ctx.fill();}
  ctx.shadowBlur=0;
  // Small identity ornaments only; avoids heavy textures/particles.
  ctx.fillStyle=pal[0];ctx.font='bold 22px system-ui';ctx.textAlign='center';const mark={solar:'☀',void:'◆',thunder:'ϟ',crystal:'✦',inferno:'♨',cosmic:'✧'}[id];ctx.fillText(mark,0,-boss.r*.93);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-13,-5,6,5,0,0,Math.PI*2);ctx.ellipse(13,-5,6,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#20223a';ctx.beginPath();ctx.arc(-13,-5,2.5,0,Math.PI*2);ctx.arc(13,-5,2.5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#2b2340';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,10,13,.12*Math.PI,.88*Math.PI);ctx.stroke();
  ctx.font='800 10px system-ui';ctx.fillStyle='rgba(255,255,255,.92)';ctx.fillText(boss.name,0,boss.r+15);
  ctx.restore();
 };
})();


;/* js/ai_diagnostics.js */
(function(){
 const LOG_KEY='skyPuffAutoRepairLogV2';
 let repairs=0,lastRepair=null,lastIssue=null,lastLoopPulse=performance.now(),watchdog=null;
 function persistLog(){try{localStorage.setItem(LOG_KEY,JSON.stringify({repairs,lastRepair,lastIssue}));}catch(e){}}
 function log(issue,repair){lastIssue={issue,at:new Date().toISOString()};if(repair){repairs++;lastRepair={repair,at:new Date().toISOString()};persistLog();console.warn('Sky Puff AI Diagnostics:',issue,'→',repair);}}
 function finite(n){return Number.isFinite(n)}
 function visible(el){if(!el||!el.isConnected)return false;const style=getComputedStyle(el);return style.display!=='none'&&style.visibility!=='hidden'&&style.opacity!=='0';}
 function visibleOverlay(){return Array.from(document.querySelectorAll('.overlay')).some(el=>el!==startEl&&visible(el));}
 function repairPlayer(){if(!player)return false;let fixed=false;if(!finite(player.x)){player.x=W/2;fixed=true;}if(!finite(player.y)){player.y=H*.68;fixed=true;}if(!finite(player.vx)){player.vx=0;fixed=true;}if(!finite(player.vy)){player.vy=-8;fixed=true;}if(!finite(player.hp)||player.hp<0){player.hp=Math.max(1,3+(save&&save.upHealth||0));if(hpEl)hpEl.textContent=player.hp;fixed=true;}if(fixed)log('Invalid player state','Player values restored');return fixed;}
 function repairBoss(){if(!boss)return false;let fixed=false;if(!finite(boss.x)){boss.x=W/2;fixed=true;}if(!finite(boss.y)){boss.y=Math.max(120,H*.2);fixed=true;}if(!finite(boss.hp)||boss.hp<=0){boss.hp=Math.max(1,boss.maxHp||100);fixed=true;}if(!finite(boss.maxHp)||boss.maxHp<=0){boss.maxHp=Math.max(1,boss.hp||100);fixed=true;}if(fixed)log('Invalid boss state','Boss values restored');return fixed;}
 function repairWorld(){if(running&&!bossArena&&Array.isArray(platforms)&&platforms.length===0){try{let y=(player&&finite(player.y)?player.y:H*.7)+80;for(let i=0;i<18;i++){y-=75+Math.random()*30;addPlatform(y);}log('World had no platforms','Platform field regenerated');return true;}catch(e){}}return false;}
 function repairOverlays(){if(!running&&startEl&&gameOverEl&&!visible(startEl)&&!visibleOverlay()){try{showMainMenu();log('No visible menu while game stopped','Main menu restored');return true;}catch(e){}}return false;}
 function check(){try{repairPlayer();repairBoss();repairWorld();repairOverlays();}catch(e){lastIssue={issue:String(e.message||e),at:new Date().toISOString()};persistLog();}}
 const originalLoop=typeof loop==='function'?loop:null;
 if(originalLoop){loop=function(t){lastLoopPulse=performance.now();return originalLoop(t);};}
 watchdog=setInterval(()=>{
   check();
   if(running&&!paused&&!document.hidden&&performance.now()-lastLoopPulse>2500){
     lastIssue={issue:'Main animation loop appears stalled; waiting for browser RAF recovery to avoid duplicate loops',at:new Date().toISOString()};
     persistLog();console.warn('Sky Puff AI Diagnostics: main loop heartbeat delayed; no forced RAF restart');
   }
 },1500);
 try{localStorage.removeItem('skyPuffAutoRepairLog');const old=JSON.parse(localStorage.getItem(LOG_KEY)||'null');if(old){repairs=Math.max(0,Math.floor(Number(old.repairs)||0));lastRepair=old.lastRepair||null;lastIssue=old.lastIssue||null;}}catch(e){}
 window.skyPuffAIDiagnostics={get repairs(){return repairs},get lastRepair(){return lastRepair},get lastIssue(){return lastIssue},runCheck:check,clearLog(){repairs=0;lastRepair=null;lastIssue=null;try{localStorage.removeItem(LOG_KEY);localStorage.removeItem('skyPuffAutoRepairLog');}catch(e){}},stop(){if(watchdog){clearInterval(watchdog);watchdog=null;}}};
})();


;/* js/beta_release_ui.js */
(function(){
 const version=typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'beta';
 const supportEmail=typeof SKY_PUFF_SUPPORT_EMAIL==='string'?SKY_PUFF_SUPPORT_EMAIL:'zyconstudios@protonmail.com';
 document.title='Puffling';
 // Keep diagnostics/support plumbing, but do not show a beta badge or beta popup in the player-facing UI.
 const oldBadge=document.getElementById('betaBadge');if(oldBadge)oldBadge.remove();
 if(multiplayerBtnEl){multiplayerBtnEl.textContent='MULTIPLAYER ⚔️';multiplayerBtnEl.removeAttribute('title');}
 if(multiplayerStatusEl&&/BETA|Simulert rival/i.test(multiplayerStatusEl.textContent))multiplayerStatusEl.textContent='Ikke tilkoblet';
 try{const previous=JSON.parse(localStorage.skyPuffLastError||'null');if(previous?.version&&previous.version!==version)localStorage.removeItem('skyPuffLastError');}catch(_){localStorage.removeItem('skyPuffLastError');}
 window.addEventListener('error',e=>{try{localStorage.skyPuffLastError=JSON.stringify({message:e.message||'Unknown error',file:e.filename||'',line:e.lineno||0,at:new Date().toISOString(),version});}catch(_){} });
 window.addEventListener('unhandledrejection',e=>{try{localStorage.skyPuffLastError=JSON.stringify({message:String(e.reason&&e.reason.message||e.reason||'Unhandled promise rejection'),at:new Date().toISOString(),version});}catch(_){} });
 window.skyPuffBetaDiagnostics={version,supportEmail,get lastError(){try{return JSON.parse(localStorage.skyPuffLastError||'null')}catch(e){return null}},clearLastError(){localStorage.removeItem('skyPuffLastError')}};
})();

;/* js/diagnostics_support.js */
(function(){
 const RESET_COPY={
  no:{button:'NULLSTILL BETA-DATA',confirm:'Dette sletter all lokal Puffling-progresjon på denne enheten. Språkvalget beholdes. Vil du starte helt på nytt?'},
  en:{button:'RESET BETA DATA',confirm:'This deletes all local Puffling progress on this device. Your language choice is kept. Start completely fresh?'},
  de:{button:'BETA-DATEN ZURÜCKSETZEN',confirm:'Dadurch wird der gesamte lokale Puffling-Fortschritt auf diesem Gerät gelöscht. Die Sprache bleibt erhalten. Neu starten?'},
  es:{button:'RESTABLECER DATOS BETA',confirm:'Esto elimina todo el progreso local de Puffling en este dispositivo. Se conserva el idioma. ¿Empezar de cero?'},
  fr:{button:'RÉINITIALISER LES DONNÉES BÊTA',confirm:'Cela supprime toute la progression Puffling locale sur cet appareil. La langue est conservée. Recommencer à zéro ?'}
 };
 function resetCopy(){try{return RESET_COPY[typeof lang==='string'?lang:'no']||RESET_COPY.en}catch(e){return RESET_COPY.en}}
 function clearPufflingStorage(storage){const keep=storage.getItem('skyPuffLang');for(let i=storage.length-1;i>=0;i--){const key=storage.key(i);if(/^(skyPuff|puffling)/i.test(String(key||'')))storage.removeItem(key);}if(keep)storage.setItem('skyPuffLang',keep);}
 function resetBetaData(){const t=resetCopy();if(!window.confirm(t.confirm))return false;try{clearPufflingStorage(localStorage);clearPufflingStorage(sessionStorage);}catch(e){window.alert('Puffling-data could not be reset on this device.');return false;}location.reload();return true;}
 function statusCard(label,state,detail){const ok=state==='ok',warn=state==='warn';const icon=ok?'✅':warn?'⚠️':'❌';return `<div style="background:rgba(255,255,255,.84);border:2px solid ${ok?'rgba(80,190,120,.25)':warn?'rgba(255,190,60,.32)':'rgba(235,80,80,.28)'};border-radius:15px;padding:11px 13px"><div style="font-weight:1000;color:#35516b">${icon} ${label}</div><div style="font-size:12px;font-weight:800;color:#65788b;margin-top:4px;word-break:break-word">${detail}</div></div>`;}
 function safeString(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}
 function raceEndpoint(){try{return String(window.SkyPuffRaceTransport?.snapshot?.().endpoint||localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'').trim()}catch(e){return String(window.SKY_PUFF_RACE_WS_URL||'').trim()}}
 function collect(){
   const smoke=window.skyPuffSmokeCheck||null,ai=window.skyPuffAIDiagnostics||null,antiApi=window.skyPuffAntiCheat||null,beta=window.skyPuffBetaDiagnostics||null;
   let anti=null;try{anti=antiApi&&antiApi.status?antiApi.status:null}catch(e){anti=null}
   let iap=null;try{iap=window.PufflingDiamondStore?.status?.()||null}catch(e){iap=null}
   let saveOk=true;try{localStorage.setItem('__skyPuffDiagTest','1');localStorage.removeItem('__skyPuffDiagTest')}catch(e){saveOk=false}
   const endpoint=raceEndpoint(),leaderboardOnline=typeof API_BASE==='string'&&!!API_BASE;
   const account=window.PufflingAccountProfile||null;
   const rankServerAuthoritative=!!account?.rankServerAuthoritative;
   const tradeServerInventory=!!account?.inventoryServerAuthoritative;
   return {version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown',support:typeof SKY_PUFF_SUPPORT_EMAIL==='string'?SKY_PUFF_SUPPORT_EMAIL:'zyconstudios@protonmail.com',smoke,ai,anti,iap,saveOk,leaderboardMode:leaderboardOnline?'online':'local fallback',leaderboardOnline,raceEndpoint:endpoint,raceServerMode:endpoint?'configured':'not configured',rankServerAuthoritative,tradeServerInventory,userAgent:navigator.userAgent,lastError:beta&&beta.lastError?beta.lastError:null};
 }
 function codesFor(d){
   const codes=[];
   const smokeOk=!!(d.smoke&&d.smoke.ok),flags=d.anti&&Array.isArray(d.anti.flags)?d.anti.flags:[],blocked=d.anti&&Number.isFinite(d.anti.blockedSubmissions)?d.anti.blockedSubmissions:0;
   if(!d.smoke)codes.push({code:'PFL-SMOKE-000',level:'error',detail:'Smoke Check mangler'});
   else if(!smokeOk)codes.push({code:'PFL-SMOKE-001',level:'error',detail:(d.smoke.missing||[]).join(', ')||'Smoke Check feilet'});
   if(!d.saveOk)codes.push({code:'PFL-SAVE-001',level:'error',detail:'localStorage er ikke tilgjengelig'});
   if(d.lastError)codes.push({code:'PFL-RUNTIME-001',level:'warn',detail:safeString(d.lastError)});
   if(flags.length||blocked)codes.push({code:'PFL-AC-001',level:'warn',detail:`${flags.length} flag(s), ${blocked} blokkerte submissions`});
   if(d.ai?.lastIssue)codes.push({code:'PFL-AI-001',level:'warn',detail:safeString(d.ai.lastIssue)});
   if(!d.raceEndpoint)codes.push({code:'PFL-LAUNCH-101',level:'launch',detail:'Race-server/WebSocket er ikke konfigurert; multiplayer bruker lokal fallback'});
   if(!d.leaderboardOnline)codes.push({code:'PFL-LAUNCH-102',level:'launch',detail:'Global leaderboard-backend er ikke konfigurert; lokal fallback brukes'});
   if(!d.iap?.canPurchase){const reason=!d.iap?'Diamond Store API mangler':!d.iap.bridgeReady?'Native App Store/Google Play-bro er ikke koblet til':!d.iap.verifyReady?'Serververifisering for kjøp er ikke konfigurert':'Betaling er ikke klar';codes.push({code:'PFL-LAUNCH-103',level:'launch',detail:reason});}
   if(!d.rankServerAuthoritative)codes.push({code:'PFL-LAUNCH-104',level:'launch',detail:'Ranked MMR/W/L er fortsatt lagret lokalt i nettleseren; offentlig ranked krever konto- og serverlagret profil'});
   if(!d.tradeServerInventory)codes.push({code:'PFL-LAUNCH-105',level:'launch',detail:'Trade-eierskap er fortsatt klientlokalt; offentlig trading krever server-autoritativ inventory'});
   return codes;
 }
 function render(){
   if(!diagnosticsListEl||!diagnosticsSummaryEl)return;
   const d=collect(),codes=codesFor(d),smokeOk=!!(d.smoke&&d.smoke.ok),aiRepairs=d.ai&&typeof d.ai.repairs==='number'?d.ai.repairs:0,aiLast=d.ai&&d.ai.lastRepair?safeString(d.ai.lastRepair):'Ingen reparasjoner registrert';
   const flags=d.anti&&Array.isArray(d.anti.flags)?d.anti.flags:[],blocked=d.anti&&Number.isFinite(d.anti.blockedSubmissions)?d.anti.blockedSubmissions:0,acFlagged=flags.length>0||blocked>0;
   const acDetail=d.anti?`${flags.length} flag(s) • ${blocked} blokkerte submissions`:'Ikke tilgjengelig';
   const iapDetail=d.iap?(d.iap.canPurchase?`${d.iap.platform} • kjøp aktivt`:`${d.iap.platform} • bridge ${d.iap.bridgeReady?'OK':'mangler'} • verifier ${d.iap.verifyReady?'OK':'mangler'}`):'Diamond Store API mangler';
   const hard=codes.filter(x=>x.level==='error').length,warnings=codes.filter(x=>x.level==='warn').length,launch=codes.filter(x=>x.level==='launch').length;
   diagnosticsSummaryEl.textContent=hard?`Systemstatus: ${hard} feil funnet ❌`:warnings?`Systemstatus: ${warnings} advarsel(er) ⚠️`:launch?`Spillstatus: OK ✅ • ${launch} launch-punkt gjenstår`:'Systemstatus: OK ✅ • Launch-klar';
   const codeDetail=codes.length?codes.map(x=>`${x.code}: ${x.detail}`).join(' | '):'Ingen aktive feilkoder';
   diagnosticsListEl.innerHTML=statusCard('Build','ok',d.version)+statusCard('Smoke Check',smokeOk?'ok':'bad',d.smoke?safeString(d.smoke):'Smoke check mangler')+statusCard('AI Diagnostics',d.ai?(d.ai.lastIssue?'warn':'ok'):'bad',d.ai?`${aiRepairs} auto-reparasjoner • ${aiLast}${d.ai.lastIssue?' • Siste issue: '+safeString(d.ai.lastIssue):''}`:'Diagnostikkmotor mangler')+statusCard('Anti-Cheat',acFlagged?'warn':d.anti?'ok':'bad',acDetail)+statusCard('Save System',d.saveOk?'ok':'bad',d.saveOk?'localStorage tilgjengelig':'localStorage utilgjengelig')+statusCard('Race Server',d.raceEndpoint?'ok':'warn',d.raceEndpoint||'Ikke konfigurert — lokal/test-ghost brukes')+statusCard('Leaderboard',d.leaderboardOnline?'ok':'warn',d.leaderboardMode)+statusCard('Ranked profile',d.rankServerAuthoritative?'ok':'warn',d.rankServerAuthoritative?'MMR/W/L er server-autoritativt':'MMR/W/L er lokal beta-profil')+statusCard('Trade inventory',d.tradeServerInventory?'ok':'warn',d.tradeServerInventory?'Inventory valideres på server':'Inventory/eierskap er lokal beta-data')+statusCard('Diamond IAP',d.iap?.canPurchase?'ok':'warn',iapDetail)+statusCard('Feilkoder / launch-koder',hard?'bad':warnings||launch?'warn':'ok',codeDetail)+statusCard('Support','ok',d.support)+statusCard('Siste runtime-feil',d.lastError?'warn':'ok',d.lastError?safeString(d.lastError):'Ingen lagret feil');
   const reset=document.getElementById('resetBetaDataBtn');if(reset)reset.textContent=resetCopy().button;
 }
 function open(){render();startEl.style.display='none';diagnosticsMenuEl.style.display='flex';}
 function close(){diagnosticsMenuEl.style.display='none';startEl.style.display='flex';}
 function sendReport(){
   const d=collect(),codes=codesFor(d);const ai=d.ai?{repairs:d.ai.repairs,lastRepair:d.ai.lastRepair,lastIssue:d.ai.lastIssue}:null;const ac=d.anti?{flags:d.anti.flags||[],blockedSubmissions:d.anti.blockedSubmissions||0,runStartedAt:d.anti.runStartedAt||0}:null;
   const body=['Puffling Beta Bug Report','',`Build: ${d.version}`,`Codes: ${codes.length?safeString(codes):'none'}`,`Smoke check: ${d.smoke?safeString(d.smoke):'missing'}`,`AI diagnostics: ${safeString(ai)}`,`Anti-cheat: ${safeString(ac)}`,`Race server: ${d.raceServerMode}${d.raceEndpoint?' • '+d.raceEndpoint:''}`,`Leaderboard: ${d.leaderboardMode}`,`Rank server profile: ${d.rankServerAuthoritative?'yes':'no'}`,`Trade server inventory: ${d.tradeServerInventory?'yes':'no'}`,`Diamond IAP: ${safeString(d.iap)}`,`Last runtime error: ${d.lastError?safeString(d.lastError):'none'}`,`Device/browser: ${d.userAgent}`,'','Hva skjedde?','','Hva gjorde du rett før feilen?','','Høyde / boss / modus:'].join('\n');
   location.href=`mailto:${d.support}?subject=${encodeURIComponent(`Puffling Beta Support ${d.version}`)}&body=${encodeURIComponent(body)}`;
 }
 const resetBetaDataBtn=document.getElementById('resetBetaDataBtn');if(diagnosticsBtnEl)diagnosticsBtnEl.onclick=open;if(closeDiagnosticsEl)closeDiagnosticsEl.onclick=close;if(refreshDiagnosticsBtnEl)refreshDiagnosticsBtnEl.onclick=render;if(sendBugReportBtnEl)sendBugReportBtnEl.onclick=sendReport;if(resetBetaDataBtn)resetBetaDataBtn.onclick=resetBetaData;window.skyPuffDiagnosticsSupport={open,close,render,collect,codesFor,sendReport,resetBetaData,clearPufflingStorage};
})();


;/* js/puff_fusion_core.js */
/* Orbuff — Fusion Core v0.7
 * Legacy storage keys and Puffling response fields are retained for beta save/API compatibility.
 */
(function(){
  const BASE = {
    starterpuff:{id:'starterpuff',name:'Starter Orbuff',icon:'☁️',rarity:'common',ability:'starter',value:.35,palette:['#eef8ff','#8fc7e8'],mark:'○',starterOnly:true},
    starterspark:{id:'starterspark',name:'Spark Orbuff',icon:'✨',rarity:'common',ability:'starter',value:.35,palette:['#fff6bc','#e7bd54'],mark:'✦',starterOnly:true},
    starterdrop:{id:'starterdrop',name:'Drop Orbuff',icon:'💧',rarity:'common',ability:'starter',value:.35,palette:['#dff7ff','#67b8de'],mark:'◇',starterOnly:true},
    ember:{id:'ember',name:'Ember Orbuff',icon:'🔥',rarity:'common',ability:'blastDamage',value:1.10},
    volt:{id:'volt',name:'Volt Orbuff',icon:'⚡',rarity:'common',ability:'chainShot',value:1},
    frost:{id:'frost',name:'Frost Orbuff',icon:'❄️',rarity:'common',ability:'freeze',value:0.8},
    prism:{id:'prism',name:'Prism Orbuff',icon:'🌈',rarity:'rare',ability:'rainbowGain',value:1.15},
    shadow:{id:'shadow',name:'Shadow Orbuff',icon:'🌑',rarity:'rare',ability:'airDash',value:1},
    wind:{id:'wind',name:'Wind Orbuff',icon:'💨',rarity:'common',ability:'jumpControl',value:1.10}
  };
  const FUSIONS = {
    'ember+volt':{id:'thunderflame',name:'Thunderflame Orbuff',icon:'🔥⚡',rarity:'epic',ability:'chainBlast'},
    'frost+prism':{id:'aurora',name:'Aurora Orbuff',icon:'❄️🌈',rarity:'epic',ability:'rescuePlatform'},
    'ember+shadow':{id:'eclipse',name:'Eclipse Orbuff',icon:'🌑🔥',rarity:'legendary',ability:'phaseDash'},
    'volt+wind':{id:'tempest',name:'Tempest Orbuff',icon:'💨⚡',rarity:'epic',ability:'stormJump'},
    'prism+volt':{id:'neonstorm',name:'Neon Storm Orbuff',icon:'🌈⚡',rarity:'legendary',ability:'rainbowChain'}
  };
  const STARTER_IDS=['starterpuff','starterspark','starterdrop'];
  const key=(a,b)=>[a,b].sort().join('+');
  function normalize(raw){
    const s=raw&&typeof raw==='object'?raw:{};
    const owned={};for(const [id,n] of Object.entries(s.owned&&typeof s.owned==='object'?s.owned:{})){const v=Math.max(0,Math.floor(+n||0));if(v>0)owned[id]=v;}
    const discovered=[...new Set((Array.isArray(s.discovered)?s.discovered:[]).filter(id=>typeof id==='string'))];
    for(const id of STARTER_IDS)if(!discovered.includes(id))discovered.push(id);
    for(const id of Object.keys(owned))if(!discovered.includes(id))discovered.push(id);
    const vault=[...new Set((Array.isArray(s.vault)?s.vault:[]).filter(id=>owned[id]>0))].slice(0,3);
    const tradeReceipts=[...new Set((Array.isArray(s.tradeReceipts)?s.tradeReceipts:[]).filter(id=>typeof id==='string'&&id.length<=80))].slice(-50);
    return {owned,vault,discovered,tradeReceipts};
  }
  function load(){try{return normalize(JSON.parse(localStorage.getItem('skyPuffPufflings')||'null'));}catch(e){return normalize(null);}}
  function save(s){const n=normalize(s);localStorage.setItem('skyPuffPufflings',JSON.stringify(n));try{const active=localStorage.getItem('skyPuffActivePuffling');if(active&&!(n.owned[active]>0))localStorage.removeItem('skyPuffActivePuffling');}catch(e){}return n;}
  function add(id,count=1){const s=load(),inc=Math.max(0,Math.floor(+count||0));if(!id||inc<=0)return s;s.owned[id]=(s.owned[id]||0)+inc;if(!s.discovered.includes(id))s.discovered.push(id);return save(s);}
  function availableCountFrom(s,id){return Math.max(0,(s.owned[id]||0)-(s.vault.includes(id)?1:0));}
  function availableCount(id){return availableCountFrom(load(),id);}
  function remove(id,count=1){const s=load(),dec=Math.max(0,Math.floor(+count||0));if(!id||dec<=0)return {ok:false,reason:'invalid'};if(availableCountFrom(s,id)<dec)return {ok:false,reason:'protected_or_missing',state:s};s.owned[id]=(s.owned[id]||0)-dec;if(s.owned[id]<=0)delete s.owned[id];const state=save(s);return {ok:true,state,remaining:state.owned[id]||0};}
  function canFuse(a,b,opts={}){const s=load(),recipe=FUSIONS[key(a,b)];if(!recipe)return false;if(opts.crystal){return a===b?availableCountFrom(s,a)>=1:availableCountFrom(s,a)>0&&availableCountFrom(s,b)>0;}return a===b?availableCountFrom(s,a)>=2:availableCountFrom(s,a)>0&&availableCountFrom(s,b)>0;}
  function fuse(a,b,opts={}){const recipe=FUSIONS[key(a,b)];if(!recipe)return {ok:false,reason:'unknown_recipe'};const s=load(),crystal=!!opts.crystal;if(!canFuse(a,b,{crystal}))return {ok:false,reason:'protected_or_missing'};if(crystal){s.owned[a]--;if(s.owned[a]<=0)delete s.owned[a];}else{s.owned[a]--;s.owned[b]--;if(s.owned[a]<=0)delete s.owned[a];if(s.owned[b]<=0)delete s.owned[b];}s.owned[recipe.id]=(s.owned[recipe.id]||0)+1;if(!s.discovered.includes(recipe.id))s.discovered.push(recipe.id);const state=save(s);return {ok:true,orbuff:recipe,puffling:recipe,state,crystalUsed:crystal,preservedParent:crystal?b:null};}
  function tradeTransfer(outgoing,incoming,txId){
    outgoing=String(outgoing||'');incoming=String(incoming||'');txId=String(txId||'').slice(0,80);
    const s=load();
    if(!outgoing||!incoming||!txId)return {ok:false,reason:'invalid_trade',state:s};
    if(STARTER_IDS.includes(outgoing)||STARTER_IDS.includes(incoming))return {ok:false,reason:'starter_locked',state:s};
    if(s.tradeReceipts.includes(txId))return {ok:true,duplicate:true,state:s,outgoingRemaining:s.owned[outgoing]||0,incomingWasNew:false};
    if(availableCountFrom(s,outgoing)<1)return {ok:false,reason:'protected_or_missing',state:s};
    const incomingWasNew=(s.owned[incoming]||0)===0;
    s.owned[outgoing]=(s.owned[outgoing]||0)-1;if(s.owned[outgoing]<=0)delete s.owned[outgoing];
    s.owned[incoming]=(s.owned[incoming]||0)+1;
    if(!s.discovered.includes(incoming))s.discovered.push(incoming);
    s.tradeReceipts=[...(s.tradeReceipts||[]),txId].slice(-50);
    const state=save(s);
    return {ok:true,duplicate:false,state,outgoingRemaining:state.owned[outgoing]||0,incomingWasNew};
  }
  const api={BASE,FUSIONS,STARTER_IDS,key,load,save,add,remove,canFuse,fuse,normalize,availableCount,tradeTransfer,crystalFusion:true};
  window.OrbuffFusion=api;
  window.SkyPuffFusion=api;
})();

;/* js/puffling_collection_50.js */
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

;/* js/puffling_collection_36.js */
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

;/* js/puffling_unique_traits.js */
/* Sky Puff — unique trait profiles for all Pufflings v1.1 */
(function(){
 const F=window.SkyPuffFusion;if(!F)return;
 const all=[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})];
 const rarityBase={common:0,rare:1,epic:2,legendary:3,mythic:4};
 function round(n,d=3){const p=10**d;return Math.round(n*p)/p;}
 function profileFor(p,index){
  const r=rarityBase[p.rarity]??0;
  const unique=index+1;
  if(p.starterOnly){
   const starterRank=Math.max(0,['starterpuff','starterspark','starterdrop'].indexOf(p.id));
   return {traitId:`starter-${p.id}`,traitName:`${p.name} Basics`,signatureIndex:unique,jumpScale:round(1+starterRank*.0004,4),boostRegen:round(starterRank*.0003,4),shotPower:round(.78+starterRank*.015,3),controlBonus:round(starterRank*.001,3),rescueChance:round(starterRank*.0005,4),raceStrength:round(.06+starterRank*.01,3),raceDuration:300+starterRank*25,raceCooldown:4400-starterRank*100};
  }
  return {
   traitId:`trait-${String(unique).padStart(3,'0')}-${p.id}`,
   traitName:`${p.name} Instinct`,
   signatureIndex:unique,
   jumpScale:round(1.002 + r*.004 + (unique%17)*.0007,4),
   boostRegen:round(.003 + r*.002 + (unique%13)*.0006,4),
   shotPower:round(1.01 + r*.025 + (unique%19)*.003,3),
   controlBonus:round(.005 + r*.006 + (unique%11)*.002,3),
   rescueChance:round(.002 + r*.004 + (unique%7)*.0015,4),
   raceStrength:round(.16 + r*.045 + (unique%23)*.006,3),
   raceDuration:520 + r*120 + unique*7,
   raceCooldown:Math.max(4000,5200-r*180-(unique%9)*70)
  };
 }
 all.forEach((p,index)=>{p.trait=profileFor(p,index);p.signatureTrait=p.trait.traitName;});
 function get(id){return all.find(p=>p.id===id)?.trait||null;}
 function allProfiles(){const out={};all.forEach(p=>{out[p.id]=p.trait;});return out;}
 window.SkyPuffUniqueTraits={get,allProfiles,count:all.length};
})();

;/* js/steal_my_puff_core.js */
/* Sky Puff — Race My Puffling foundation v1.2
 * Compatibility note: filename is retained so older beta loaders keep working.
 * The API is exposed as window.SkyPuffRace; SkyPuffSteal is intentionally retired.
 */
(function(){
  const GOAL_METERS=1500;
  const MAX_ATTACKS=3;
  const ATTACK_COOLDOWN_MS=4000;
  const STATUS_IMMUNITY_MS=1200;
  const CHECKPOINTS=[0,300,600,900,1200];
  const TYPES=['wind','ice','gravity','vision','control','bounce','platform','shock','boostSteal'];

  const ABILITIES={
    wind:{id:'gustBlast',name:'Gust Blast',description:'Skyver rivalen sidelengs med et kort vindkast.',duration:900,strength:.55,icon:'💨',visualEffect:'wind'},
    ice:{id:'frozenFeet',name:'Frozen Feet',description:'Senker rivalens bevegelse en kort stund.',duration:2000,strength:.35,icon:'❄️',visualEffect:'ice'},
    gravity:{id:'heavyCloud',name:'Heavy Cloud',description:'Gjør rivalens neste hopp tyngre.',duration:2400,strength:.28,icon:'🌑',visualEffect:'gravity'},
    vision:{id:'darkMist',name:'Dark Mist',description:'Dekker deler av rivalens sikt med mørke skyer.',duration:1800,strength:.45,icon:'🌫️',visualEffect:'mist'},
    control:{id:'confusion',name:'Confusion',description:'Gjør sidebevegelsen mindre presis.',duration:1400,strength:.25,icon:'🌀',visualEffect:'confusion'},
    bounce:{id:'bounceCurse',name:'Bounce Curse',description:'Gjør rivalens neste landing ekstra sprettende.',duration:2200,strength:.35,icon:'🟣',visualEffect:'bounce'},
    platform:{id:'cloudBreak',name:'Cloud Break',description:'Gjør en kommende plattform ustabil uten å blokkere løpet.',duration:1800,strength:.3,icon:'☁️',visualEffect:'platform'},
    shock:{id:'thunderPop',name:'Thunder Pop',description:'Avbryter rivalens bevegelse svært kort.',duration:500,strength:1,icon:'⚡',visualEffect:'shock'},
    boostSteal:{id:'puffDrain',name:'Puff Drain',description:'Bremser rivalens momentum og gir deg et lite boost.',duration:1000,strength:.22,icon:'✨',visualEffect:'drain'}
  };
  const STARTER_ABILITY={id:'tinyGust',name:'Tiny Gust',description:'Et lite starter-vindpuff som forstyrrer rivalen svært kort.',duration:350,strength:.08,icon:'☁️',visualEffect:'wind',type:'wind'};

  function hash(text){let h=2166136261;for(const ch of String(text||'puffling')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
  function allPufflings(){const F=window.SkyPuffFusion;if(!F)return [];return [...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})];}
  function abilityFor(puffling){
    const p=typeof puffling==='string'?allPufflings().find(x=>x.id===puffling):puffling;
    if(p?.starterOnly)return {...STARTER_ABILITY,cooldown:ATTACK_COOLDOWN_MS,rarityModifier:.25,pufflingId:p.id};
    const idx=hash(p?.id||p?.name||'puffling')%TYPES.length;const type=TYPES[idx],base=ABILITIES[type];return {...base,type,cooldown:ATTACK_COOLDOWN_MS,rarityModifier:1,pufflingId:p?.id||null};
  }
  function abilityMap(){const out={};allPufflings().forEach(p=>{out[p.id]=abilityFor(p)});return out;}
  function createState(opts={}){return {
    active:true,startedAt:opts.startedAt||Date.now(),finishedAt:0,winner:null,
    goal:GOAL_METERS,youHeight:0,rivalHeight:0,youCheckpoint:0,rivalCheckpoint:0,
    attacksRemaining:MAX_ATTACKS,lastAttackAt:0,attacksUsed:0,attacksHit:0,
    selectedPufflingId:opts.selectedPufflingId||null,ability:abilityFor(opts.selectedPufflingId),
    activeEffects:[],immuneUntil:0,falls:0,rivalFalls:0
  };}
  let state=null;
  function start(opts={}){state=createState(opts);emit('race:start',snapshot());return snapshot();}
  function snapshot(){return state?JSON.parse(JSON.stringify(state)):null;}
  function checkpointFor(height){let cp=0;for(const x of CHECKPOINTS)if(height>=x)cp=x;return cp;}
  function updateHeights(you,rival){if(!state||!state.active)return snapshot();state.youHeight=Math.max(0,+you||0);state.rivalHeight=Math.max(0,+rival||0);state.youCheckpoint=checkpointFor(state.youHeight);state.rivalCheckpoint=checkpointFor(state.rivalHeight);if(state.youHeight>=GOAL_METERS)finish('you');else if(state.rivalHeight>=GOAL_METERS)finish('rival');return snapshot();}
  function canAttack(now=Date.now()){return !!(state&&state.active&&state.attacksRemaining>0&&now-state.lastAttackAt>=ATTACK_COOLDOWN_MS);}
  function attack(now=Date.now()){
    if(!canAttack(now))return {ok:false,reason:state?.attacksRemaining<=0?'empty':'cooldown',remaining:state?.attacksRemaining||0,cooldownLeft:Math.max(0,ATTACK_COOLDOWN_MS-(now-(state?.lastAttackAt||0)))};
    state.lastAttackAt=now;state.attacksRemaining--;state.attacksUsed++;
    const ability=state.ability||abilityFor(state.selectedPufflingId);
    emit('race:attack',{ability,remaining:state.attacksRemaining,at:now});
    return {ok:true,ability,remaining:state.attacksRemaining,cooldownLeft:ATTACK_COOLDOWN_MS};
  }
  function receiveEffect(effect,now=Date.now()){
    if(!state||!state.active)return {ok:false,reason:'inactive'};
    if(now<state.immuneUntil)return {ok:false,reason:'immune'};
    const e={...effect,startTime:now,duration:Math.max(200,Math.min(4000,+effect.duration||1000)),sourcePlayer:effect.sourcePlayer||'rival'};
    const strong=['shock','gravity','control'].includes(e.type);
    if(strong&&state.activeEffects.some(x=>['shock','gravity','control'].includes(x.type)))return {ok:false,reason:'strong_effect_active'};
    state.activeEffects.push(e);emit('race:effectStart',e);return {ok:true,effect:e};
  }
  function receiveAttack(abilityOrId,meta={},now=Date.now()){
    let ability=null;
    if(abilityOrId&&typeof abilityOrId==='object')ability=abilityOrId;
    else ability=Object.values(ABILITIES).find(a=>a.id===abilityOrId)||ABILITIES[meta?.abilityType]||null;
    if(!ability)return {ok:false,reason:'unknown_ability'};
    const effect={...ability,type:ability.type||meta?.abilityType||Object.keys(ABILITIES).find(k=>ABILITIES[k].id===ability.id)||'control',sourcePlayer:meta?.playerId||'rival'};
    const res=receiveEffect(effect,now);
    if(res.ok&&state)state.attacksHit++;
    emit('race:attackReceived',{ability:effect,result:res});
    return res;
  }
  function tickEffects(now=Date.now()){
    if(!state)return [];
    const ended=[];state.activeEffects=state.activeEffects.filter(e=>{if(now-e.startTime>=e.duration){ended.push(e);return false;}return true;});
    if(ended.length){state.immuneUntil=Math.max(state.immuneUntil,now+STATUS_IMMUNITY_MS);ended.forEach(e=>emit('race:effectEnd',e));}
    return state.activeEffects.slice();
  }
  function recordFall(side='you'){if(!state)return 0;if(side==='you')state.falls++;else state.rivalFalls++;return side==='you'?state.youCheckpoint:state.rivalCheckpoint;}
  function finish(winner){if(!state||!state.active)return snapshot();state.active=false;state.finishedAt=Date.now();state.winner=winner;emit('race:finish',snapshot());return snapshot();}
  function reset(){state=null;emit('race:reset',null);}
  function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail}));}catch(e){}}

  window.SkyPuffRace={GOAL_METERS,MAX_ATTACKS,ATTACK_COOLDOWN_MS,STATUS_IMMUNITY_MS,CHECKPOINTS,TYPES,ABILITIES,STARTER_ABILITY,allPufflings,abilityFor,abilityMap,start,snapshot,updateHeights,canAttack,attack,receiveEffect,receiveAttack,tickEffects,recordFall,finish,reset,requiresServerAuthority:true};
  try{delete window.SkyPuffSteal;}catch(e){window.SkyPuffSteal=undefined;}
})();


;/* js/puffling_visual_upgrade.js */
/* Puffling — Premium procedural Puffling visuals v0.2 */
(function(){
 const palettes={ember:['#ffb13b','#ff5a36'],volt:['#ffe75a','#ffbd20'],frost:['#bdf6ff','#55bfff'],prism:['#fff','#ff8de7'],shadow:['#8050bb','#211235'],wind:['#d8f8ff','#80d8ff'],thunderflame:['#ff853c','#ffd84c'],aurora:['#e8fbff','#d183ff'],eclipse:['#9b4cdd','#ff6738'],tempest:['#8be8ff','#477cff'],neonstorm:['#f1f8ff','#9b69ff']};
 function meta(id){const F=window.SkyPuffFusion;return F?.BASE?.[id]||Object.values(F?.FUSIONS||{}).find(x=>x.id===id)||null}
 function art(id,stage=0){const p=meta(id),safeStage=Math.max(0,Math.min(2,stage|0)),c=p?.palette||palettes[id]||['#fff','#aeeaff'],crown=safeStage>=2?'♛':'',mark=p?.mark||({ember:'◆',volt:'ϟ',frost:'✦',prism:'◇',shadow:'☾',wind:'〰',thunderflame:'ϟ',aurora:'✧',eclipse:'☽',tempest:'↯',neonstorm:'✦'})[id]||'✦';return `<div class="spPuffArt s${safeStage}" data-form="${safeStage}" style="--p1:${c[0]};--p2:${c[1]}"><i class="wing w1"></i><i class="wing w2"></i><i class="ear e1"></i><i class="ear e2"></i><b class="face"><i class="eye l"></i><i class="eye r"></i><i class="mouth"></i></b><em>${mark}</em><strong>${crown}</strong></div>`}
 function css(){if(document.getElementById('spPuffVisualCss'))return;const s=document.createElement('style');s.id='spPuffVisualCss';s.textContent=`.spPuffArt{position:relative;width:42px;height:38px;border-radius:48% 52% 54% 46%;background:radial-gradient(circle at 35% 27%,#fff 0 9%,var(--p1) 27%,var(--p2) 78%);box-shadow:0 0 12px var(--p1),0 5px 10px #0003;filter:saturate(1.15);animation:spPuffFloat 1.8s ease-in-out infinite}.spPuffArt.s1{width:49px;height:44px;border-radius:44% 56% 48% 52%;box-shadow:0 0 18px var(--p1),0 0 7px var(--p2),0 5px 10px #0003}.spPuffArt.s2{width:56px;height:49px;border-radius:42% 58% 46% 54%;filter:saturate(1.35);box-shadow:0 0 25px var(--p1),0 0 12px var(--p2),0 5px 12px #0004}.spPuffArt .ear{position:absolute;top:-5px;width:14px;height:17px;background:linear-gradient(var(--p1),var(--p2));clip-path:polygon(50% 0,100% 100%,0 82%)}.spPuffArt.s1 .ear{height:21px;top:-9px}.spPuffArt.s2 .ear{height:25px;top:-13px}.spPuffArt .e1{left:5px;transform:rotate(-20deg)}.spPuffArt .e2{right:5px;transform:rotate(20deg)}.spPuffArt .wing{display:none;position:absolute;top:12px;width:19px;height:25px;background:linear-gradient(145deg,#fff,var(--p1));opacity:.85;clip-path:polygon(50% 0,100% 30%,72% 100%,0 64%)}.spPuffArt.s1 .wing,.spPuffArt.s2 .wing{display:block}.spPuffArt .w1{left:-14px;transform:rotate(-20deg)}.spPuffArt .w2{right:-14px;transform:scaleX(-1) rotate(-20deg)}.spPuffArt.s2 .wing{width:23px;height:31px;top:10px}.spPuffArt.s2 .w1{left:-18px}.spPuffArt.s2 .w2{right:-18px}.spPuffArt .eye{position:absolute;top:14px;width:7px;height:9px;border-radius:50%;background:#17213d;box-shadow:inset 2px 2px #fff}.spPuffArt.s1 .eye,.spPuffArt.s2 .eye{top:16px}.spPuffArt .eye.l{left:10px}.spPuffArt .eye.r{right:10px}.spPuffArt.s1 .eye.r,.spPuffArt.s2 .eye.r{right:11px}.spPuffArt .mouth{position:absolute;left:19px;top:25px;width:5px;height:3px;border-bottom:2px solid #70334a;border-radius:50%}.spPuffArt.s1 .mouth,.spPuffArt.s2 .mouth{left:22px;top:29px}.spPuffArt em{position:absolute;left:50%;top:-12px;transform:translateX(-50%);font:900 12px sans-serif;color:#fff;text-shadow:0 0 6px var(--p2)}.spPuffArt.s1 em{font-size:15px;top:-16px}.spPuffArt.s2 em{font-size:18px;top:-21px}.spPuffArt strong{position:absolute;right:-6px;top:-15px;color:#ffe36b;font-size:16px;text-shadow:0 1px 5px #a65b00}.spPuffArt.s2 strong{right:-8px;top:-22px;font-size:22px}.spPuffArt.s1:after,.spPuffArt.s2:after{content:'';position:absolute;inset:-8px;border:2px dotted var(--p1);border-radius:50%;animation:spAura 3s linear infinite}.spPuffArt.s2:before{content:'✦';position:absolute;left:-10px;top:2px;color:#fff;filter:drop-shadow(0 0 5px var(--p1));animation:spSpark 1s ease-in-out infinite alternate}@keyframes spPuffFloat{50%{transform:translateY(-3px) rotate(2deg)}}@keyframes spAura{to{transform:rotate(360deg)}}@keyframes spSpark{to{opacity:.25;transform:scale(.65)}}`;document.head.appendChild(s)}
 css();window.SkyPuffVisuals={art,palettes};
})();


;/* js/puffling_performance_mode.js */
/* Sky Puff — Puffling Performance Mode v0.1 */
(function(){
 const KEY='skyPuffPerformanceMode';
 function autoLow(){try{return (navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||innerWidth<430}catch(e){return false}}
 function mode(){try{return localStorage.getItem(KEY)||'auto'}catch(e){return 'auto'}}
 function low(){const m=mode();return m==='low'||(m==='auto'&&autoLow())}
 function apply(){document.documentElement.classList.toggle('spLowFx',low());}
 function setMode(v){if(!['auto','high','low'].includes(v))return false;localStorage.setItem(KEY,v);apply();return true}
 const s=document.createElement('style');s.textContent=`.spLowFx .spPuffArt{animation-duration:2.5s!important;box-shadow:0 3px 7px #0002!important;filter:none!important}.spLowFx .spPuffArt:after,.spLowFx .spPuffArt:before{display:none!important}.spLowFx .spPuffArt.s1,.spLowFx .spPuffArt.s2{box-shadow:0 4px 9px #0003!important}.spLowFx #pufflingFollower{filter:none!important}`;document.head.appendChild(s);apply();
 window.SkyPuffPerformance={mode,low,setMode,apply};
})();


;/* js/performance_settings_ui.js */
/* Sky Puff — Performance settings UI v0.1 */
(function(){
 function label(){const P=window.SkyPuffPerformance;if(!P)return 'AUTO';const m=P.mode();if(m==='high')return 'HIGH';if(m==='low')return 'LOW';return P.low()?'AUTO (LOW)':'AUTO (HIGH)';}
 function ensure(){
  const panel=document.querySelector('#audioSettings .card');if(!panel||document.getElementById('graphicsModeRow'))return;
  const row=document.createElement('div');row.id='graphicsModeRow';row.style.cssText='margin:18px 0;padding-top:14px;border-top:1px solid rgba(70,110,150,.18);text-align:left';
  row.innerHTML='<strong>Grafikkmodus</strong><div class="small" style="margin-top:4px">Auto anbefales. Low reduserer Puffling-glow og effekter for bedre stabilitet.</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px"><button data-spgfx="auto" class="secondary" style="padding:9px">AUTO</button><button data-spgfx="high" class="secondary" style="padding:9px">HIGH</button><button data-spgfx="low" class="secondary" style="padding:9px">LOW</button></div><div id="graphicsModeStatus" class="small" style="margin-top:9px;font-weight:900"></div>';
  const close=document.getElementById('closeAudioSettings');panel.insertBefore(row,close||null);
  row.querySelectorAll('[data-spgfx]').forEach(b=>b.addEventListener('click',()=>{if(window.SkyPuffPerformance?.setMode?.(b.dataset.spgfx)){refresh();if(typeof showToast==='function')showToast(`Grafikkmodus: ${label()}`);}}));refresh();
 }
 function refresh(){const P=window.SkyPuffPerformance,s=document.getElementById('graphicsModeStatus');if(!P||!s)return;s.textContent=`Aktiv: ${label()}`;document.querySelectorAll('[data-spgfx]').forEach(b=>{const on=P.mode()===b.dataset.spgfx;b.classList.toggle('gold',on);b.classList.toggle('secondary',!on);});}
 const oldApply=window.SkyPuffPerformance?.apply;if(oldApply)window.SkyPuffPerformance.apply=function(){const r=oldApply.apply(this,arguments);refresh();return r};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
 window.SkyPuffPerformanceUI={ensure,refresh};
})();


;/* js/puff_fusion_ui.js */
/* Puffling — Puffdex + Evolution Viewer + Fusion Lab UI v0.7 */
(function(){
  function allPuffs(){const F=window.SkyPuffFusion;if(!F)return [];return [...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})];}
  function rarityLabel(r){return ({common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary',mythic:'Mythic'})[r]||r;}
  function dexNo(i){return '#'+String(i+1).padStart(3,'0');}
  function artFor(id,stage,p){return window.SkyPuffVisuals?.art?.(id,stage)||`<div style="font-size:${stage===2?58:stage===1?52:46}px">${p?.icon||'☁️'}</div>`;}
  function ensureUI(){
    if(document.getElementById('puffdexMenu'))return;
    const wrap=document.createElement('div');wrap.id='puffdexMenu';wrap.className='overlay';wrap.style.display='none';
    wrap.innerHTML='<div class="card" style="max-width:760px"><h1 style="font-size:36px">Puffdex ☁️</h1><div id="puffdexSummary" class="small" style="margin-bottom:12px"></div><div id="puffdexGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;text-align:left"></div><button id="openFusionLabBtn" class="gold" style="margin-top:14px">FUSION LAB 🧬</button><button id="closePuffdex" class="secondary">TILBAKE</button></div>';document.body.appendChild(wrap);
    const detail=document.createElement('div');detail.id='pufflingDetailMenu';detail.className='overlay';detail.style.display='none';detail.innerHTML='<div class="card" style="max-width:700px"><div id="pufflingDetailContent"></div><button id="closePufflingDetail" class="secondary" style="margin-top:14px">TILBAKE TIL PUFFDEX</button></div>';document.body.appendChild(detail);
    const lab=document.createElement('div');lab.id='fusionLabMenu';lab.className='overlay';lab.style.display='none';lab.innerHTML='<div class="card" style="max-width:620px"><h1 style="font-size:36px">Fusion Lab 🧬</h1><div class="small" style="margin-bottom:12px">Velg to Pufflings du eier. Gyldige kombinasjoner viser hva du kan lage.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><select id="fusionA" style="padding:12px;border:0;border-radius:12px"></select><select id="fusionB" style="padding:12px;border:0;border-radius:12px"></select></div><div id="fusionPreview" style="margin:14px 0;padding:14px;border-radius:16px;background:rgba(255,255,255,.72);font-weight:900"></div><button id="doFusionBtn" class="gold">FUSIONER</button><button id="closeFusionLab" class="secondary">TILBAKE</button></div>';document.body.appendChild(lab);
    const startActions=document.querySelector('#start .menuActions');if(startActions&&!document.getElementById('puffdexBtn')){const b=document.createElement('button');b.id='puffdexBtn';b.className='gold';b.textContent='PUFFDEX ☁️';startActions.appendChild(b);}
    document.getElementById('puffdexBtn')?.addEventListener('click',openDex);document.getElementById('closePuffdex')?.addEventListener('click',()=>{wrap.style.display='none';document.getElementById('start').style.display='flex';});document.getElementById('closePufflingDetail')?.addEventListener('click',()=>{detail.style.display='none';wrap.style.display='flex';});document.getElementById('openFusionLabBtn')?.addEventListener('click',()=>{wrap.style.display='none';openLab();});document.getElementById('closeFusionLab')?.addEventListener('click',()=>{lab.style.display='none';openDex();});document.getElementById('fusionA')?.addEventListener('change',renderPreview);document.getElementById('fusionB')?.addEventListener('change',renderPreview);document.getElementById('doFusionBtn')?.addEventListener('click',doFusion);
  }
  function openDex(){ensureUI();document.getElementById('start').style.display='none';document.getElementById('pufflingDetailMenu').style.display='none';document.getElementById('puffdexMenu').style.display='flex';renderDex();}
  function openDetail(id){
    ensureUI();const list=allPuffs(),index=list.findIndex(x=>x.id===id),p=list[index];if(!p)return;const F=window.SkyPuffFusion,s=F.load(),found=s.discovered.includes(id),owned=s.owned[id]||0,no=dexNo(index),prog=window.SkyPuffPufflingProgress?.get?.(id)||{level:1,xp:0,next:0},currentStage=window.SkyPuffPufflingEvolution?.stageFor?.(id)||0,content=document.getElementById('pufflingDetailContent');
    document.getElementById('puffdexMenu').style.display='none';document.getElementById('pufflingDetailMenu').style.display='flex';
    if(!found){content.innerHTML=`<div style="font-size:13px;font-weight:1000;opacity:.6">${no}</div><h1 style="font-size:34px">Uoppdaget Puffling ❔</h1><div style="font-size:68px;margin:18px">❔</div><div class="small">Finn denne Pufflingen for å låse opp detaljene og evolution-formene.</div>`;return;}
    const stages=[
      {stage:0,label:'BASE FORM',need:'Level 1',title:p.name},
      {stage:1,label:'EVOLVED FORM',need:'Level 10',title:`Evolved ${p.name}`},
      {stage:2,label:'ASCENDED FORM',need:'Level 20',title:`Ascended ${p.name}`}
    ];
    const cards=stages.map(x=>{const unlocked=currentStage>=x.stage;return `<button class="pufflingFormCard" data-stage="${x.stage}" style="position:relative;padding:16px 10px;border-radius:18px;background:${unlocked?'rgba(255,255,255,.86)':'rgba(235,240,248,.62)'};border:2px solid ${x.stage===currentStage?'#62c6ff':'transparent'};min-height:178px;overflow:hidden;color:inherit"><div style="font-size:11px;font-weight:1000;opacity:.65">${x.label}</div><div style="height:78px;display:flex;align-items:center;justify-content:center;${unlocked?'':'filter:grayscale(1);opacity:.38'}">${artFor(id,x.stage,p)}</div><b style="font-size:13px">${x.title}</b><div class="small" style="margin-top:4px">${x.need}${unlocked?' • LÅST OPP ✓':' • FORHÅNDSVISNING 🔒'}</div><div class="small" style="margin-top:5px">TRYKK FOR Å SE</div></button>`;}).join('');
    const isActive=window.SkyPuffPufflingGameplay?.active?.()===id;
    content.innerHTML=`<div style="font-size:13px;font-weight:1000;opacity:.65">${no}</div><h1 style="font-size:34px;margin-bottom:3px">${p.icon||'☁️'} ${p.name}</h1><div class="small">${rarityLabel(p.rarity)} • Eier x${owned} • Level ${prog.level}</div><div class="small" style="margin:5px 0 16px">Ability: <b>${p.ability||'—'}</b></div><h3 style="margin:8px 0">EVOLUTION FORMS</h3><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px">${cards}</div><div id="pufflingFormPreview" style="display:none;margin-top:14px;padding:18px;border-radius:18px;background:rgba(215,248,255,.92)"></div>${owned>0?`<button id="detailEquipPuffling" class="${isActive?'gold':'secondary'}" style="margin-top:14px">${isActive?'AKTIV PUFFLING ✓':'EQUIP PUFFLING'}</button>`:''}<div class="small" style="margin-top:10px">Evolution låses opp automatisk på Level 10 og Level 20.</div>`;
    content.querySelectorAll('.pufflingFormCard').forEach(card=>card.addEventListener('click',()=>{const stage=+card.dataset.stage,form=stages[stage],preview=document.getElementById('pufflingFormPreview');preview.style.display='block';preview.innerHTML=`<div style="min-height:118px;display:flex;align-items:center;justify-content:center">${artFor(id,stage,p)}</div><h2 style="margin:4px 0">${form.title}</h2><div class="small">${form.label} • ${form.need}${currentStage>=stage?' • LÅST OPP ✓':' • LÅSES OPP SENERE 🔒'}</div>`;preview.scrollIntoView?.({behavior:'smooth',block:'nearest'});}));
    document.getElementById('detailEquipPuffling')?.addEventListener('click',()=>{if(window.SkyPuffPufflingGameplay?.setActive?.(id)){if(typeof showToast==='function')showToast(`${p.icon||'☁️'} ${p.name} er nå aktiv!`);openDetail(id);}});
  }
  function renderDex(){
    const F=window.SkyPuffFusion;if(!F)return;const s=F.load(),grid=document.getElementById('puffdexGrid');if(!grid)return;grid.innerHTML='';const list=allPuffs(),activeId=window.SkyPuffPufflingGameplay?.active?.()||'';document.getElementById('puffdexSummary').textContent=`Oppdaget ${s.discovered.length} / ${list.length} Pufflings • Trykk på en Puffling for detaljer`;
    list.forEach((p,index)=>{const no=dexNo(index),owned=s.owned[p.id]||0,found=s.discovered.includes(p.id),isActive=activeId===p.id,prog=window.SkyPuffPufflingProgress?.get?.(p.id)||{level:1,xp:0,next:0},stage=window.SkyPuffPufflingEvolution?.stageFor?.(p.id)||0,pct=prog.next?Math.min(100,Math.round(prog.xp/prog.next*100)):100;const d=document.createElement('div');d.dataset.dexNumber=no;d.dataset.pufflingId=p.id;d.style.cssText=`position:relative;padding:12px;border-radius:16px;background:${isActive?'rgba(215,248,255,.95)':'rgba(255,255,255,.78)'};min-height:176px;border:${isActive?'2px solid #55c8ff':'2px solid transparent'};cursor:pointer`;
      const badge=`<div style="display:inline-block;padding:3px 7px;margin-bottom:5px;border-radius:999px;background:rgba(45,85,125,.12);font-size:12px;font-weight:1000;letter-spacing:.4px;color:#35516b">${no}</div>`;
      if(found){const art=artFor(p.id,stage,p);d.innerHTML=`${badge}<div style="height:58px;display:flex;align-items:center;justify-content:center">${art}</div><b style="display:block">${no} • ${window.SkyPuffPufflingEvolution?.titleFor?.(p.id)||p.name}</b><div class="small">${rarityLabel(p.rarity)} • x${owned}</div><div class="small">Level ${prog.level}${prog.next?` • ${prog.xp}/${prog.next} XP`:' • MAX'}</div><div style="height:6px;background:rgba(0,0,0,.1);border-radius:99px;overflow:hidden;margin:5px 0 7px"><div style="height:100%;width:${pct}%;background:#62c6ff"></div></div><div class="small">Trykk for evolution →</div>`;}else d.innerHTML=`${badge}<div style="font-size:30px;margin-top:10px">❔</div><b>${no} • ???</b><div class="small">Ikke oppdaget</div><div class="small" style="margin-top:8px">Trykk for detaljer</div>`;d.addEventListener('click',()=>openDetail(p.id));grid.appendChild(d);});
  }
  function openLab(){ensureUI();document.getElementById('fusionLabMenu').style.display='flex';populateSelectors();renderPreview();}
  function populateSelectors(){const F=window.SkyPuffFusion,s=F.load(),ids=Object.keys(s.owned).filter(id=>F.availableCount(id)>0);const opts=ids.map(id=>{const p=allPuffs().find(x=>x.id===id),available=F.availableCount(id);return p?`<option value="${id}">${p.icon||'☁️'} ${p.name} (x${available} tilgjengelig)</option>`:''}).join('');['fusionA','fusionB'].forEach(id=>document.getElementById(id).innerHTML=opts||'<option value="">Ingen tilgjengelige Pufflings</option>');}
  function renderPreview(){const F=window.SkyPuffFusion,a=document.getElementById('fusionA')?.value,b=document.getElementById('fusionB')?.value,box=document.getElementById('fusionPreview');if(!box||!F)return;const recipe=F.FUSIONS[F.key(a,b)];box.textContent=recipe?`${recipe.icon||'✨'} ${recipe.name} — ${rarityLabel(recipe.rarity)}`:'Ingen kjent fusion for denne kombinasjonen.';}
  function doFusion(){const F=window.SkyPuffFusion,a=document.getElementById('fusionA').value,b=document.getElementById('fusionB').value,res=F.fuse(a,b);if(!res.ok){alert(res.reason==='protected_or_missing'?'Fusion krever ubeskyttede Pufflings. Fjern en kopi fra Vault eller finn en ekstra.':'Fusion kunne ikke gjennomføres.');return;}alert(`✨ Ny Puffling: ${res.puffling.name}!`);populateSelectors();renderPreview();renderDex();}
  window.SkyPuffFusionUI={openDex,openDetail,openLab,renderDex,dexNo};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureUI);else ensureUI();
})();


;/* js/fusion_crystal_runtime.js */
/* Puffling — Fusion Crystal runtime v1 */
(function(){
 const KEY='skyPuffItemsV1',ITEM='fusionCrystal';
 function items(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'?v:{}}catch(e){return {}}}
 function count(){return Math.max(0,Math.floor(Number(items()[ITEM])||0))}
 function spend(){const v=items(),n=count();if(n<1)return false;v[ITEM]=n-1;if(v[ITEM]<=0)delete v[ITEM];localStorage.setItem(KEY,JSON.stringify(v));return true}
 function ensure(){
  const normal=document.getElementById('doFusionBtn'),lab=document.getElementById('fusionLabMenu');if(!normal||!lab||document.getElementById('doCrystalFusionBtn'))return;
  const b=document.createElement('button');b.id='doCrystalFusionBtn';b.className='secondary';b.style.marginTop='8px';normal.insertAdjacentElement('afterend',b);
  const note=document.createElement('div');note.id='fusionCrystalInfo';note.className='small';note.style.marginTop='7px';b.insertAdjacentElement('afterend',note);
  b.onclick=()=>{
   const F=window.SkyPuffFusion,a=document.getElementById('fusionA')?.value||'',c=document.getElementById('fusionB')?.value||'';
   if(count()<1){if(typeof showToast==='function')showToast('Ingen Fusion Crystal tilgjengelig 💠');render();return}
   const res=F?.fuse?.(a,c,{crystal:true});if(!res?.ok){if(typeof showToast==='function')showToast('Crystal Fusion krever en gyldig fusion og tilgjengelige Pufflings.');return}
   if(!spend()){if(typeof showToast==='function')showToast('Fusion Crystal kunne ikke brukes.');return}
   if(typeof showToast==='function')showToast(`💠 Crystal Fusion! ${res.puffling?.name||'Ny Puffling'} • ${res.preservedParent||'én forelder'} bevart`);
   window.SkyPuffFusionUI?.renderDex?.();document.getElementById('fusionA')?.dispatchEvent?.(new Event('change'));render();
  };
  render();
 }
 function render(){const b=document.getElementById('doCrystalFusionBtn'),n=document.getElementById('fusionCrystalInfo'),c=count();if(b){b.disabled=c<1;b.textContent=`CRYSTAL FUSION 💠 (${c})`;}if(n)n.textContent=c?`Bruk 1 Fusion Crystal for å lage fusionen og bevare den andre valgte forelderen.`:'Finn Fusion Crystal i Mystery Box for å bruke Crystal Fusion.';}
 const obs=typeof MutationObserver!=='undefined'?new MutationObserver(()=>{ensure();render()}):null;if(obs&&document.body)obs.observe(document.body,{childList:true,subtree:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,60));else setTimeout(ensure,60);
 window.PufflingFusionCrystals={count,spend,refresh:render};
})();

;/* js/main_menu_cleanup.js */
/* Puffling — compact categorized main navigation v1.1 */
(function(){
 const COPY={
  no:{pufflings:'PUFFLINGS ☁️',modes:'SPILLMODUSER ⚔️',more:'MER ☰',back:'TILBAKE',open:'ÅPNE',audio:'Lyd',titles:{pufflings:'Pufflings',modes:'Spillmoduser',more:'Mer'},sub:{pufflings:'Samling, egg og Mystery Shop',modes:'Velg hvordan du vil spille',more:'Belønninger, oppgraderinger og hjelp'}},
  en:{pufflings:'PUFFLINGS ☁️',modes:'GAME MODES ⚔️',more:'MORE ☰',back:'BACK',open:'OPEN',audio:'Audio',titles:{pufflings:'Pufflings',modes:'Game Modes',more:'More'},sub:{pufflings:'Collection, eggs and Mystery Shop',modes:'Choose how you want to play',more:'Rewards, upgrades and help'}},
  de:{pufflings:'PUFFLINGS ☁️',modes:'SPIELMODI ⚔️',more:'MEHR ☰',back:'ZURÜCK',open:'ÖFFNEN',audio:'Audio',titles:{pufflings:'Pufflings',modes:'Spielmodi',more:'Mehr'},sub:{pufflings:'Sammlung, Eier und Mystery Shop',modes:'Wähle deinen Spielmodus',more:'Belohnungen, Upgrades und Hilfe'}},
  es:{pufflings:'PUFFLINGS ☁️',modes:'MODOS DE JUEGO ⚔️',more:'MÁS ☰',back:'VOLVER',open:'ABRIR',audio:'Audio',titles:{pufflings:'Pufflings',modes:'Modos de juego',more:'Más'},sub:{pufflings:'Colección, huevos y Mystery Shop',modes:'Elige cómo quieres jugar',more:'Recompensas, mejoras y ayuda'}},
  fr:{pufflings:'PUFFLINGS ☁️',modes:'MODES DE JEU ⚔️',more:'PLUS ☰',back:'RETOUR',open:'OUVRIR',audio:'Audio',titles:{pufflings:'Pufflings',modes:'Modes de jeu',more:'Plus'},sub:{pufflings:'Collection, œufs et Mystery Shop',modes:'Choisissez votre mode de jeu',more:'Récompenses, améliorations et aide'}}};
 const GROUPS={
  pufflings:[['puffdexBtn','☁️','Puffdex'],['nurseryVaultBtn','🥚','Nursery & Vault'],['mysteryShopBtn','💎','Mystery Shop']],
  modes:[['multiplayerBtn','⚔️','Multiplayer'],['bossRushBtn','👑','Boss Rush'],['leaderboardBtn','🏆','Highscore']],
  more:[['dailyBtn','🎁','Daglig belønning'],['shopBtn','🎨','Cosmetics'],['upgradeBtn','⬆️','Oppgraderinger'],['achievementsBtn','🏅','Achievements'],['audioSettingsBtn','🔊','Lyd'],['diagnosticsBtn','🛠️','System & Support']]
 };
 let currentGroup='';
 function copy(){try{return COPY[typeof lang!=='undefined'?lang:'no']||COPY.en}catch(e){return COPY.en}}
 function ensureHub(){
  let hub=document.getElementById('spMenuHub');if(hub)return hub;
  hub=document.createElement('div');hub.id='spMenuHub';hub.className='overlay';hub.style.display='none';
  hub.innerHTML='<div class="card spHubCard"><div class="spHubIcon">☁️</div><h1 id="spHubTitle"></h1><div id="spHubSubtitle" class="small"></div><div id="spHubGrid"></div><button id="spHubBack" class="secondary">TILBAKE</button></div>';
  document.body.appendChild(hub);document.getElementById('spHubBack').onclick=closeHub;return hub;
 }
 function closeHub(){const hub=document.getElementById('spMenuHub');if(hub)hub.style.display='none';if(startEl)startEl.style.display='flex';currentGroup='';}
 function openHub(group){
  currentGroup=group;const hub=ensureHub(),t=copy(),grid=document.getElementById('spHubGrid');
  document.getElementById('spHubTitle').textContent=t.titles[group];document.getElementById('spHubSubtitle').textContent=t.sub[group];document.getElementById('spHubBack').textContent=t.back;grid.innerHTML='';
  for(const [id,icon,fallback] of GROUPS[group]){
   const original=document.getElementById(id);if(!original)continue;
   const button=document.createElement('button');button.className=original.classList.contains('gold')?'spHubItem gold':'spHubItem secondary';
   const stripped=(original.textContent||'').replace(/[☁️🥚🔐💎⚔️👑🏆🎁🎨⬆️🏅🔊🛠️😈]/gu,'').trim();
   const label=id==='audioSettingsBtn'?(t.audio||fallback):(stripped||fallback);
   button.innerHTML=`<span>${icon}</span><b>${label}</b><small>${t.open} →</small>`;
   button.onclick=()=>{hub.style.display='none';if(startEl)startEl.style.display='flex';currentGroup='';original.click();};grid.appendChild(button);
  }
  if(startEl)startEl.style.display='none';hub.style.display='flex';
 }
 function updateLabels(){const t=copy();const p=document.getElementById('pufflingsHubBtn'),m=document.getElementById('modesHubBtn'),m2=document.getElementById('moreHubBtn');if(p)p.textContent=t.pufflings;if(m)m.textContent=t.modes;if(m2)m2.textContent=t.more;if(currentGroup)openHub(currentGroup);}
 function ensure(){
  const actions=document.querySelector('#start .menuActions');if(!actions)return;
  let primary=document.getElementById('menuPrimaryGroup');
  if(!primary){primary=document.createElement('div');primary.id='menuPrimaryGroup';primary.className='spMenuPrimary';actions.parentNode.insertBefore(primary,actions);const play=document.getElementById('playBtn');if(play)primary.appendChild(play);}
  let nav=document.getElementById('spMainNav');
  if(!nav){nav=document.createElement('div');nav.id='spMainNav';nav.innerHTML='<button id="pufflingsHubBtn" class="gold"></button><button id="modesHubBtn" class="secondary"></button><button id="moreHubBtn" class="secondary spNavWide"></button>';actions.parentNode.insertBefore(nav,actions);}
  const pufflings=document.getElementById('pufflingsHubBtn'),modes=document.getElementById('modesHubBtn'),more=document.getElementById('moreHubBtn');if(pufflings)pufflings.onclick=()=>openHub('pufflings');if(modes)modes.onclick=()=>openHub('modes');if(more)more.onclick=()=>openHub('more');
  actions.style.display='none';ensureHub();updateLabels();
  if(!document.getElementById('spCompactMenuCss')){const style=document.createElement('style');style.id='spCompactMenuCss';style.textContent=`
   #start .card{max-width:430px!important;padding:16px!important;max-height:96vh;overflow:auto}
   #start h1{margin:2px 0!important}.menuHero{height:82px!important;margin-bottom:2px!important}.menuRainbow{top:52px!important}.menuCloud{transform:translate(-50%,-50%) scale(.78)!important}
   #start .tag{margin-bottom:8px!important;font-size:12px!important}.menuStats{margin:7px 0!important;gap:6px!important}.menuStats .stat{padding:7px 4px!important;font-size:11px!important}
   #menuPrimaryGroup{margin-top:8px}#menuPrimaryGroup button{width:100%!important;max-width:none!important;min-height:50px!important;margin:0!important}
   #spMainNav{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}#spMainNav button{width:100%;min-width:0!important;min-height:44px;margin:0!important;padding:10px 7px!important;font-size:12px!important}.spNavWide{grid-column:1/-1}
   #start .menuActions{display:none!important}#start .small#menuHint{font-size:10px!important;line-height:1.25;margin-top:7px!important;opacity:.72}#start .menuVersion{font-size:9px!important;margin-top:5px!important;opacity:.58}
   .spHubCard{width:min(88vw,420px)!important;padding:22px 18px!important}.spHubIcon{font-size:42px;margin-bottom:2px}.spHubCard h1{font-size:34px!important;margin:2px 0 4px!important}.spHubCard>.small{margin-bottom:14px}
   #spHubGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}.spHubItem{min-width:0!important;min-height:86px!important;margin:0!important;padding:12px 8px!important;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.spHubItem span{font-size:23px}.spHubItem b{font-size:13px}.spHubItem small{font-size:9px;opacity:.68}
   #spHubBack{margin-top:4px!important}@media(max-width:360px){#spHubGrid{gap:7px}.spHubItem{min-height:78px!important;padding:9px 5px!important}.spHubItem b{font-size:11px}}
  `;document.head.appendChild(style);}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,0));else setTimeout(ensure,0);
 [120,450,1100].forEach(ms=>setTimeout(ensure,ms));document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(updateLabels,0));
 window.SkyPuffMenuCleanup={ensure,openHub,closeHub};
})();


;/* js/puffling_nursery_vault.js */
/* Puffling — interactive responsive Puffling Nursery + Vault v0.8 */
(function(){
 const EGG_KEY='skyPuffEggInventoryV1',PENDING_KEY='skyPuffPendingEggsV1',VAULT_SLOTS_KEY='skyPuffVaultSlotsV2',MAX_VAULT=3;let hatching=false,pendingVaultSlot=-1;
 const F=()=>window.SkyPuffFusion;
 function loadEggs(){try{const raw=JSON.parse(localStorage.getItem(EGG_KEY)||'{}'),out={};for(const t of ['rare','epic','legendary'])out[t]=Math.max(0,Math.floor(Number(raw?.[t])||0));return out;}catch(e){return {rare:0,epic:0,legendary:0}}}
 function saveEggs(v){localStorage.setItem(EGG_KEY,JSON.stringify(v||{}));}
 function migratePending(){try{const p=JSON.parse(localStorage.getItem(PENDING_KEY)||'{}');if(!p||typeof p!=='object')return;const e=loadEggs();let changed=false;for(const t of ['rare','epic','legendary']){const n=Math.max(0,+p[t]||0);if(n){e[t]=(e[t]||0)+n;changed=true;}}if(changed)saveEggs(e);localStorage.removeItem(PENDING_KEY);}catch(e){}}
 function addEgg(tier,count=1){const e=loadEggs();e[tier]=(e[tier]||0)+Math.max(1,count|0);saveEggs(e);render();return e;}
 function allPuffs(){const f=F();if(!f)return[];return [...Object.values(f.BASE||{}),...Object.values(f.FUSIONS||{})];}
 function pool(tier){
  const all=allPuffs().filter(p=>!p.starterOnly);
  if(tier==='legendary')return all.filter(p=>p.rarity==='legendary').map(p=>p.id);
  if(tier==='epic')return all.filter(p=>p.rarity==='epic').map(p=>p.id);
  if(tier==='rare')return all.filter(p=>p.rarity==='rare'||p.rarity==='common').map(p=>p.id);
  return all.filter(p=>p.rarity==='common').map(p=>p.id);
 }
 function getPuff(id){return allPuffs().find(x=>x.id===id)||null}
 const STANDARD_IDS=['ember','volt','frost','prism','shadow','wind'],RARITY_ORDER={common:0,rare:1,epic:2,legendary:3,mythic:4};
 function rarityLabel(p){return STANDARD_IDS.includes(p?.id)?'STANDARD':p?.rarity==='common'?'VANLIG':String(p?.rarity||'PUFFLING').toUpperCase()}
 function vaultChoices(state,slots=[]){const s=state||{owned:{}};return Object.entries(s.owned||{}).map(([id,n])=>({id,n:Number(n)||0,p:getPuff(id)})).filter(x=>x.n>0&&!slots.includes(x.id)).sort((a,b)=>{const ai=STANDARD_IDS.indexOf(a.id),bi=STANDARD_IDS.indexOf(b.id);if(ai>=0||bi>=0)return ai<0?1:bi<0?-1:ai-bi;const ar=RARITY_ORDER[a.p?.rarity]??9,br=RARITY_ORDER[b.p?.rarity]??9;return ar-br||String(a.p?.name||a.id).localeCompare(String(b.p?.name||b.id));});}
 function saveVaultSlots(slots){try{localStorage.setItem(VAULT_SLOTS_KEY,JSON.stringify(slots.slice(0,MAX_VAULT)))}catch(e){}}
 function loadVaultSlots(state){
  const s=state||F()?.load?.()||{owned:{},vault:[]};let raw=[];try{raw=JSON.parse(localStorage.getItem(VAULT_SLOTS_KEY)||'[]')}catch(e){}
  const slots=Array(MAX_VAULT).fill(null),seen=new Set();if(Array.isArray(raw))raw.slice(0,MAX_VAULT).forEach((id,i)=>{if(typeof id==='string'&&(s.owned?.[id]||0)>0&&!seen.has(id)){slots[i]=id;seen.add(id);}});
  for(const id of Array.isArray(s.vault)?s.vault:[]){if(seen.has(id)||(s.owned?.[id]||0)<=0)continue;const empty=slots.indexOf(null);if(empty<0)break;slots[empty]=id;seen.add(id);}
  saveVaultSlots(slots);return slots;
 }
 function placeInVault(id,slotIndex){const f=F();if(!f||slotIndex<0||slotIndex>=MAX_VAULT)return false;const s=f.load(),slots=loadVaultSlots(s);if(!id||(s.owned?.[id]||0)<=0||slots[slotIndex])return false;const previous=slots.indexOf(id);if(previous>=0)slots[previous]=null;slots[slotIndex]=id;s.vault=slots.filter(Boolean);f.save(s);saveVaultSlots(slots);pendingVaultSlot=-1;render();return true;}
 function removeVaultSlot(slotIndex){const f=F();if(!f)return false;const s=f.load(),slots=loadVaultSlots(s);if(slotIndex<0||slotIndex>=MAX_VAULT||!slots[slotIndex])return false;slots[slotIndex]=null;s.vault=slots.filter(Boolean);f.save(s);saveVaultSlots(slots);pendingVaultSlot=-1;render();return true;}
 function beginVaultSelection(slotIndex){pendingVaultSlot=slotIndex;renderVaultPicker();document.getElementById('vaultPicker')?.scrollIntoView?.({behavior:'smooth',block:'nearest'});}
 function renderVaultPicker(){const picker=document.getElementById('vaultPicker');if(!picker)return;if(pendingVaultSlot<0){picker.style.display='none';picker.innerHTML='';return;}const f=F(),s=f?.load?.(),slots=loadVaultSlots(s),available=vaultChoices(s,slots);picker.style.display='block';picker.innerHTML=`<div class="vaultPickerTitle">Velg Puffling til plass ${pendingVaultSlot+1}</div><div class="small vaultPickerHelp">Standard og vanlige Pufflings vises først.</div><div id="vaultPickerGrid"></div><button id="cancelVaultPicker" class="secondary">AVBRYT</button>`;const grid=document.getElementById('vaultPickerGrid');available.forEach(({id,n,p})=>{const b=document.createElement('button');b.className='secondary';b.innerHTML=`<span>${p?.icon||'☁️'}</span><b>${p?.name||id}</b><small>${rarityLabel(p)} • EIER x${n}</small>`;b.onclick=()=>placeInVault(id,pendingVaultSlot);grid.appendChild(b)});if(!available.length)grid.innerHTML='<div class="small">Ingen ubeskyttede Pufflings er tilgjengelige.</div>';document.getElementById('cancelVaultPicker').onclick=()=>{pendingVaultSlot=-1;renderVaultPicker();};}
 function reserveHatch(tier){if(hatching)return null;const e=loadEggs(),p=pool(tier),f=F();if(!f||(e[tier]||0)<=0||!p.length)return null;const id=p[Math.floor(Math.random()*p.length)];e[tier]--;saveEggs(e);f.add(id,1);window.SkyPuffFusionUI?.renderDex?.();return id;}
 function hatch(tier){const id=reserveHatch(tier);if(id)render();return id;}
 function animateHatch(tier){const id=reserveHatch(tier);if(!id)return;hatching=true;render();const p=getPuff(id),layer=document.getElementById('eggHatchLayer'),egg=document.getElementById('eggHatchEgg'),reveal=document.getElementById('eggHatchReveal');if(!layer||!egg||!reveal){hatching=false;render();return;}layer.style.display='flex';reveal.style.display='none';egg.style.display='block';egg.className='eggHatchEgg '+tier;egg.textContent='🥚';requestAnimationFrame(()=>egg.classList.add('shake'));setTimeout(()=>{egg.classList.remove('shake');egg.classList.add('crack');egg.textContent='✨';},850);setTimeout(()=>{egg.style.display='none';reveal.style.display='block';const art=window.SkyPuffVisuals?.art?.(id,0);reveal.innerHTML=`<div class="hatchBurst">${art||`<div style="font-size:58px">${p?.icon||'☁️'}</div>`}<b>${p?.name||id}</b><small>${tier.toUpperCase()} HATCH!</small></div>`;render();},1250);setTimeout(()=>{layer.style.display='none';egg.style.display='block';egg.className='eggHatchEgg';reveal.innerHTML='';hatching=false;render();},2700);}
 function toggleVault(id){const f=F();if(!f)return false;const s=f.load(),slots=loadVaultSlots(s),used=slots.indexOf(id);if(used>=0)return removeVaultSlot(used);const empty=slots.indexOf(null);return empty>=0&&placeInVault(id,empty);}
 function ensure(){
  if(document.getElementById('nurseryVaultMenu'))return;
  const style=document.createElement('style');style.id='nurseryVaultResponsiveCss';style.textContent=`
   #nurseryVaultMenu{align-items:flex-start;overflow-y:auto;padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom));overscroll-behavior:contain}
   #nurseryVaultMenu .nurseryVaultCard{width:min(94vw,620px);max-height:calc(100dvh - 20px);margin:auto;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:20px 18px 12px;scrollbar-gutter:stable}
   #nurseryVaultMenu h1{font-size:32px!important;line-height:1.08;margin:2px 0 6px}
   .nurserySection{margin-top:14px;padding:13px;border-radius:18px;background:rgba(255,255,255,.5);border:1px solid rgba(85,150,190,.14)}.nurserySection h3{margin:0 0 9px;color:#35516b}
   #nurseryEggs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}#nurseryEggs button{min-width:0!important;margin:0!important;padding:11px 5px!important;font-size:12px!important}
   #hatchResult:empty{display:none}#vaultSlots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:9px 0 12px}.vaultSlot{min-width:0;min-height:94px;padding:9px 5px;border-radius:15px;background:rgba(226,242,252,.88);border:2px dashed rgba(74,133,173,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#5c7488;cursor:pointer}.vaultSlot:not(.filled):active{transform:scale(.97);background:rgba(205,235,252,.95)}.vaultSlot.filled{background:linear-gradient(150deg,rgba(255,235,151,.92),rgba(255,178,115,.82));border-style:solid;border-color:rgba(238,151,66,.42);color:#3d5367;cursor:default}.vaultSlotIcon{font-size:25px}.vaultSlot b{font-size:11px;line-height:1.15;overflow-wrap:anywhere}.vaultSlot small{font-size:9px;font-weight:900}.vaultSlot button{min-width:0!important;width:auto!important;margin:3px 0 0!important;padding:5px 8px!important;font-size:9px!important;min-height:0!important}#vaultPicker{display:none;margin:10px 0;padding:11px;border-radius:16px;background:rgba(214,244,255,.95);border:2px solid rgba(68,171,222,.25)}.vaultPickerTitle{font-weight:1000;color:#35516b;margin-bottom:3px}.vaultPickerHelp{margin-bottom:8px}#vaultPickerGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;max-height:230px;overflow-y:auto}#vaultPickerGrid button{min-width:0!important;margin:0!important;padding:9px 5px!important;display:flex;flex-direction:column;align-items:center;gap:2px}#vaultPickerGrid button span{font-size:23px}#vaultPickerGrid button b{font-size:11px}#vaultPickerGrid button small{font-size:9px}#cancelVaultPicker{margin:9px 0 0!important;padding:8px!important;font-size:11px!important;min-height:0!important}#vaultList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#vaultList button{min-width:0!important;margin:0!important;padding:10px 7px!important;font-size:12px!important;overflow-wrap:anywhere}
   #closeNurseryVault{position:sticky;bottom:0;z-index:3;width:100%;margin:12px 0 0!important;box-shadow:0 -8px 18px rgba(238,249,255,.92),0 7px 16px rgba(80,120,170,.14)}
   #eggHatchLayer{position:fixed;inset:0;z-index:9999;background:rgba(25,30,60,.62);backdrop-filter:blur(4px);align-items:center;justify-content:center}.eggHatchEgg{font-size:88px;filter:drop-shadow(0 8px 12px #0004);will-change:transform}.eggHatchEgg.shake{animation:eggShake .18s ease-in-out 5}.eggHatchEgg.crack{animation:eggPop .4s ease-out}.hatchBurst{text-align:center;color:#fff;animation:hatchReveal .42s cubic-bezier(.2,.9,.3,1.25)}.hatchBurst .spPuffArt{margin:0 auto 18px;transform:scale(1.35)}.hatchBurst b,.hatchBurst small{display:block;text-shadow:0 2px 8px #0008}.hatchBurst b{font-size:28px}.hatchBurst small{font-size:13px;margin-top:5px}
   @keyframes eggShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}@keyframes eggPop{50%{transform:scale(1.22)}100%{transform:scale(.1);opacity:.2}}@keyframes hatchReveal{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
   @media(max-width:430px){#nurseryVaultMenu{padding-left:6px;padding-right:6px}#nurseryVaultMenu .nurseryVaultCard{width:96vw;max-height:calc(100dvh - 12px);padding:15px 11px 9px;border-radius:22px}#nurseryVaultMenu h1{font-size:27px!important}.nurserySection{padding:10px;margin-top:10px}#nurseryEggs{grid-template-columns:1fr}#nurseryEggs button{min-height:46px!important}#vaultSlots{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.vaultSlot{min-height:88px;padding:7px 3px}.vaultSlot b{font-size:10px}#vaultPickerGrid{grid-template-columns:1fr}#vaultList{grid-template-columns:1fr}#vaultList button{min-height:48px!important}}
   @media(prefers-reduced-motion:reduce){.eggHatchEgg.shake,.eggHatchEgg.crack,.hatchBurst{animation:none!important}}
  `;document.head.appendChild(style);
  const el=document.createElement('div');el.id='nurseryVaultMenu';el.className='overlay';el.style.display='none';el.innerHTML=`<div class="card nurseryVaultCard"><h1>Nursery & Vault 🥚🔐</h1><div class="small">Klekk egg og legg opptil ${MAX_VAULT} Pufflings i Vault for å beskytte dem mot Fusion.</div><section class="nurserySection"><h3>🥚 Nursery</h3><div id="nurseryEggs"></div><div id="hatchResult"></div></section><section class="nurserySection"><h3>🔐 Puff Vault <span id="vaultCount"></span></h3><div class="small">Trykk på en tom plass og velg Pufflingen du vil beskytte.</div><div id="vaultSlots" aria-label="Tre Puff Vault-plasser"></div><div id="vaultPicker"></div><div class="small" style="margin-bottom:8px"><b>Alle Pufflings</b> – trykk på en Puffling under for å legge den i neste ledige plass eller fjerne den fra Vault.</div><div id="vaultList"></div></section><button id="closeNurseryVault" class="secondary">TILBAKE</button></div>`;document.body.appendChild(el);
  const layer=document.createElement('div');layer.id='eggHatchLayer';layer.style.display='none';layer.innerHTML='<div id="eggHatchEgg" class="eggHatchEgg">🥚</div><div id="eggHatchReveal"></div>';document.body.appendChild(layer);
  document.getElementById('closeNurseryVault').onclick=()=>{pendingVaultSlot=-1;el.style.display='none';document.getElementById('start').style.display='flex'};
  const b=document.createElement('button');b.id='nurseryVaultBtn';b.className='secondary';b.textContent='NURSERY & VAULT 🥚🔐';b.onclick=open;(document.getElementById('menuMoreGrid')||document.querySelector('#start .menuActions'))?.appendChild(b);render();
 }
 function render(){
  const f=F();if(!f)return;const eggs=loadEggs(),box=document.getElementById('nurseryEggs');
  if(box){box.innerHTML='';['rare','epic','legendary'].forEach(t=>{const n=eggs[t]||0,b=document.createElement('button');b.className=t==='legendary'?'gold':'secondary';b.innerHTML=`${t==='rare'?'💙':t==='epic'?'💜':'💛'} ${t.toUpperCase()} EGG<br><small>x${n}</small>`;b.disabled=n<=0||hatching;b.onclick=()=>animateHatch(t);box.appendChild(b)});}
  const s=f.load(),slotState=loadVaultSlots(s),protectedIds=slotState.filter(Boolean);s.vault=protectedIds;f.save(s);
  const count=document.getElementById('vaultCount');if(count)count.textContent=`${protectedIds.length}/${MAX_VAULT}`;
  const slots=document.getElementById('vaultSlots');if(slots){slots.innerHTML='';for(let i=0;i<MAX_VAULT;i++){const id=slotState[i],p=id?getPuff(id):null,slot=document.createElement('div');slot.className='vaultSlot'+(id?' filled':'');slot.tabIndex=id?-1:0;if(id){slot.innerHTML=`<span class="vaultSlotIcon">${p?.icon||'☁️'}</span><b>${p?.name||id}</b><small>PLASS ${i+1} • TRYGG 🔒</small>`;const remove=document.createElement('button');remove.className='secondary';remove.textContent='FJERN';remove.onclick=()=>removeVaultSlot(i);slot.appendChild(remove);}else{slot.setAttribute('role','button');slot.setAttribute('aria-label',`Velg Puffling til tom Vault-plass ${i+1}`);slot.innerHTML=`<span class="vaultSlotIcon">➕</span><b>TOM PLASS</b><small>TRYKK • PLASS ${i+1}</small>`;slot.onclick=()=>beginVaultSelection(i);slot.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();beginVaultSelection(i);}};}slots.appendChild(slot);}}
  renderVaultPicker();
  const list=document.getElementById('vaultList');if(list){list.innerHTML='';vaultChoices(s).forEach(({id,n,p})=>{const locked=protectedIds.includes(id),safe=locked?1:0,b=document.createElement('button');b.className=locked?'gold':'secondary';b.innerHTML=`${p?.icon||'☁️'} ${p?.name||id} x${n}<br><small>${locked?`1 TRYGG 🔒 • ${Math.max(0,n-safe)} UTE`:'LEGG I NESTE LEDIGE'}</small>`;b.onclick=()=>{if(!toggleVault(id)&&!locked&&typeof showToast==='function')showToast(`Vault er full (${MAX_VAULT}/${MAX_VAULT})`);};list.appendChild(b)});if(!list.children.length)list.innerHTML='<div class="small">Ingen Pufflings eid ennå.</div>';}
 }
 function open(){ensure();pendingVaultSlot=-1;document.getElementById('start').style.display='none';const menu=document.getElementById('nurseryVaultMenu');menu.style.display='flex';menu.scrollTop=0;menu.querySelector('.nurseryVaultCard').scrollTop=0;render();}
 migratePending();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,40));else setTimeout(ensure,40);window.SkyPuffNurseryVault={loadEggs,addEgg,hatch,animateHatch,toggleVault,placeInVault,removeVaultSlot,loadVaultSlots,open,render,maxVault:MAX_VAULT,pool};
})();

;/* js/diamond_wallet_client.js */
/* Puffling — paid Diamond wallet client v1.0 */
(function(){
 const ID_KEY='pufflingWalletIdV1',KEY_KEY='pufflingWalletClientKeyV1',TOKEN_KEY='pufflingWalletTokenV1',PAID_KEY='pufflingPaidDiamondsCacheV1';
 let state='idle',lastError='',inflight=null;
 const rand=()=>{try{return crypto.randomUUID().replace(/-/g,'')}catch(e){return Math.random().toString(36).slice(2)+Date.now().toString(36)+Math.random().toString(36).slice(2)}};
 function apiBase(){return String(window.skyPuffConfig?.gameApiUrl||'https://puffling-race-server.onrender.com').replace(/\/$/,'');}
 function ensureCreds(){
  let id=localStorage.getItem(ID_KEY),key=localStorage.getItem(KEY_KEY);
  if(!id){id='w_'+rand()+rand();localStorage.setItem(ID_KEY,id);}
  if(!key){key=rand()+rand()+rand();localStorage.setItem(KEY_KEY,key);}
  return {walletId:id,clientKey:key};
 }
 function token(){return localStorage.getItem(TOKEN_KEY)||'';}
 function paidBalance(){const n=Number(localStorage.getItem(PAID_KEY));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0;}
 function acceptServerBalance(v){const n=Math.max(0,Math.floor(Number(v)||0));localStorage.setItem(PAID_KEY,String(n));window.dispatchEvent?.(new CustomEvent('puffling:wallet',{detail:{state,paidDiamondBalance:n}}));return n;}
 function status(){return {state,ready:state==='ready',paidDiamondBalance:paidBalance(),hasToken:!!token(),lastError,apiBase:apiBase()};}
 async function request(path,opts={}){
  const headers={'content-type':'application/json',...(opts.headers||{})};if(opts.auth!==false&&token())headers.authorization=`Bearer ${token()}`;
  const res=await fetch(apiBase()+path,{method:opts.method||'GET',headers,body:opts.body?JSON.stringify(opts.body):undefined});
  const data=await res.json().catch(()=>({ok:false,error:`http_${res.status}`}));if(!res.ok||data?.ok===false)throw new Error(String(data?.error||`http_${res.status}`));return data;
 }
 async function init(force=false){
  if(inflight&&!force)return inflight;if(state==='ready'&&!force)return status();
  inflight=(async()=>{state='connecting';lastError='';try{const creds=ensureCreds();const data=await request('/wallet/session',{method:'POST',auth:false,body:creds});if(!data.walletToken)throw new Error('wallet_token_missing');localStorage.setItem(TOKEN_KEY,String(data.walletToken));acceptServerBalance(data.paidDiamondBalance);state='ready';window.dispatchEvent?.(new CustomEvent('puffling:wallet',{detail:status()}));return status();}catch(e){state='unavailable';lastError=String(e?.message||e);return status();}finally{inflight=null;}})();return inflight;
 }
 async function refreshBalance(){if(state!=='ready')await init();if(state!=='ready')return status();try{const data=await request('/wallet/balance');acceptServerBalance(data.paidDiamondBalance);lastError='';return status();}catch(e){lastError=String(e?.message||e);return status();}}
 async function spend(amount,reason='mystery_box'){
  const n=Math.max(0,Math.floor(Number(amount)||0));if(!n)return {ok:true,spent:0,paidDiamondBalance:paidBalance()};if(state!=='ready')await init();if(state!=='ready')return {ok:false,error:lastError||'wallet_unavailable'};
  try{const data=await request('/wallet/spend',{method:'POST',body:{amount:n,reason}});acceptServerBalance(data.paidDiamondBalance);lastError='';return data;}catch(e){lastError=String(e?.message||e);return {ok:false,error:lastError};}
 }
 window.PufflingDiamondWallet={init,status,token,paidBalance,acceptServerBalance,refreshBalance,spend,apiBase};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>init(),80));else setTimeout(()=>init(),80);
})();


;/* js/diamond_mystery_shop.js */
/* Puffling — Diamond Mystery Shop + Mystery Vault v0.5 */
(function(){
 const KEY='skyPuffDiamonds',BOX_KEY='skyPuffMysteryBoxesV1';
 const COST=25;
 const bundles=[{count:1,cost:25},{count:3,cost:75},{count:10,cost:250}];
 const eggFusionChances=[
  {tier:'rare',label:'Rare Puffling Egg',weight:70},
  {tier:'epic',label:'Epic Puffling Egg',weight:25},
  {tier:'legendary',label:'Legendary Puffling Egg',weight:5}
 ];
 let buyBusy=false;
 const earnedGet=()=>{const n=Number(localStorage.getItem(KEY));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0;};
 const paidGet=()=>Math.max(0,Math.floor(Number(window.PufflingDiamondWallet?.paidBalance?.()||0)));
 const get=()=>earnedGet()+paidGet();
 const set=v=>{localStorage.setItem(KEY,String(Math.max(0,Math.floor(v))));refresh();return earnedGet();};
 const add=n=>{set(earnedGet()+Math.max(0,Math.floor(n)));return get();};
 function spend(n){
  n=Math.max(0,Math.floor(n));if(!n)return true;
  const earned=earnedGet();if(earned>=n){set(earned-n);return true;}
  const need=n-earned,W=window.PufflingDiamondWallet;if(!W||paidGet()<need)return false;
  return W.spend(need,'mystery_box').then(r=>{if(!r?.ok)return false;set(0);refresh();return true;}).catch(()=>false);
 }
 const boxCount=()=>{const n=Number(localStorage.getItem(BOX_KEY));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0;};
 function setBoxes(v){const n=Math.max(0,Math.floor(Number(v)||0));localStorage.setItem(BOX_KEY,String(n));refresh();return n;}
 function addBoxes(n){return setBoxes(boxCount()+Math.max(0,Math.floor(Number(n)||0)));}
 function takeBoxes(n){n=Math.max(0,Math.floor(Number(n)||0));const have=boxCount();if(have<n)return false;setBoxes(have-n);return true;}
 const rewards=[
  {id:'coins500',label:'500 Coins',weight:38,type:'coins',amount:500},
  {id:'fusionCrystal',label:'Fusion Crystal',weight:26,type:'item',amount:1},
  {id:'rareEgg',label:'Rare Puffling Egg',weight:18,type:'egg',tier:'rare'},
  {id:'epicEgg',label:'Epic Puffling Egg',weight:11,type:'egg',tier:'epic'},
  {id:'legendaryEgg',label:'Legendary Puffling Egg',weight:6,type:'egg',tier:'legendary'},
  {id:'legendaryPuff',label:'Random Legendary Puffling',weight:1,type:'legendaryPuff'}
 ];
 function weightedRoll(list){const total=list.reduce((n,x)=>n+(Number(x.weight)||0),0);let x=Math.random()*total;for(const item of list){x-=Number(item.weight)||0;if(x<0)return item;}return list[0];}
 function roll(){return weightedRoll(rewards);}
 function rollFusionEgg(){return weightedRoll(eggFusionChances);}
 function addEgg(tier,count=1){
  if(window.SkyPuffNurseryVault?.addEgg){window.SkyPuffNurseryVault.addEgg(tier,count);return true;}
  try{const k='skyPuffPendingEggsV1',v=JSON.parse(localStorage.getItem(k)||'{}');v[tier]=(v[tier]||0)+Math.max(1,count|0);localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}
 }
 function grant(r){const F=window.SkyPuffFusion;
  if(r.type==='coins'){if(typeof save!=='undefined'){save.bank=(save.bank||0)+r.amount;persist?.();refreshMenu?.();}}
  else if(r.type==='egg')addEgg(r.tier,1);
  else if(r.type==='legendaryPuff'&&F){const leg=[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})].filter(p=>p.rarity==='legendary'&&!p.starterOnly).map(p=>p.id),id=leg[Math.floor(Math.random()*leg.length)];if(id)F.add(id,1);window.SkyPuffFusionUI?.renderDex?.();}
  else{try{const k='skyPuffItemsV1',v=JSON.parse(localStorage.getItem(k)||'{}');v[r.id]=(v[r.id]||0)+(r.amount||1);localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
 }
 function result(text){const out=document.getElementById('diamondBoxResult');if(out)out.textContent=text||'';}
 async function buyBoxes(count){
  if(buyBusy)return false;const bundle=bundles.find(x=>x.count===Number(count));if(!bundle)return false;
  if(get()<bundle.cost){result(`Du trenger ${bundle.cost} diamanter 💎`);return false;}
  buyBusy=true;refresh();
  try{
   const ok=await spend(bundle.cost);if(!ok){result('Betalt Diamond-saldo kunne ikke trekkes akkurat nå. Prøv igjen.');return false;}
   addBoxes(bundle.count);result(`🔐 ${bundle.count} Mystery Box${bundle.count===1?'':'er'} lagt i Mystery Vault.`);if(typeof showToast==='function')showToast(`+${bundle.count} Mystery Box${bundle.count===1?'':'er'} 🔐`);return true;
  }finally{buyBusy=false;refresh();}
 }
 function openBox(){
  if(!takeBoxes(1)){result('Mystery Vault er tomt.');return null;}
  const r=roll();grant(r);result(r.type==='egg'?`🎁 ${r.label}! Lagt i Nursery 🥚`:`🎁 ${r.label}!`);if(typeof showToast==='function')showToast(`Mystery Box: ${r.label}!`);refresh();return r;
 }
 function combineBoxes(){
  if(boxCount()<3){result('Du trenger 3 uåpnede Mystery Boxer for å lage et egg.');return null;}
  if(!takeBoxes(3))return null;
  const egg=rollFusionEgg();addEgg(egg.tier,1);result(`✨ 3 Mystery Boxer ble til ${egg.label}! Egget ligger i Nursery.`);if(typeof showToast==='function')showToast(`🥚 ${egg.label} lagt i Nursery!`);refresh();return egg;
 }
 function ensure(){
  if(document.getElementById('mysteryShopMenu'))return;
  const style=document.createElement('style');style.id='mysteryVaultCss';style.textContent=`#mysteryBoxBundles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}#mysteryBoxBundles button{min-width:0!important;margin:0!important;padding:10px 4px!important;font-size:11px!important}.mysteryVaultBox{margin:14px 0;padding:13px;border-radius:17px;background:linear-gradient(145deg,rgba(223,239,255,.96),rgba(240,228,255,.94));border:2px solid rgba(104,112,210,.18)}.mysteryVaultCount{font-size:27px;font-weight:1000;margin:4px 0 9px}.mysteryVaultActions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.mysteryVaultActions button{min-width:0!important;margin:0!important;padding:10px 5px!important;font-size:11px!important}@media(max-width:420px){#mysteryBoxBundles{grid-template-columns:1fr}.mysteryVaultActions{grid-template-columns:1fr}}`;
  document.head.appendChild(style);
  const el=document.createElement('div');el.id='mysteryShopMenu';el.className='overlay';el.style.display='none';el.innerHTML=`<div class="card" style="max-width:540px;max-height:92dvh;overflow-y:auto"><h1 style="font-size:34px">Mystery Shop 💎</h1><div style="font-size:24px;font-weight:1000;margin:8px 0">💎 <span id="diamondBalance">0</span></div><div id="diamondBalanceSplit" class="small" style="margin:-4px 0 10px"></div><div class="small" style="margin-bottom:10px">Kjøpte Mystery Boxer lagres uåpnet i Mystery Vault.</div><div id="mysteryBoxBundles"><button class="gold" data-buy-boxes="1">1 BOX<br>${bundles[0].cost} 💎</button><button class="gold" data-buy-boxes="3">3 BOXER<br>${bundles[1].cost} 💎</button><button class="gold" data-buy-boxes="10">10 BOXER<br>${bundles[2].cost} 💎</button></div><div class="mysteryVaultBox"><div style="font-size:12px;font-weight:1000;letter-spacing:.7px;opacity:.68">🔐 MYSTERY VAULT</div><div class="mysteryVaultCount">🎁 x<span id="mysteryBoxCount">0</span></div><div class="small" style="margin-bottom:9px">Åpne én vanlig Mystery Box, eller kombiner 3 uåpnede boxer til ett garantert Puffling-egg.</div><div class="mysteryVaultActions"><button id="openMysteryBox" class="secondary">ÅPNE 1 BOX</button><button id="combineMysteryBoxes" class="gold">3 BOXER → 🥚</button></div></div><div id="diamondBoxResult" style="margin:12px 0;font-weight:900;min-height:18px"></div><div style="text-align:left;background:rgba(255,255,255,.6);padding:12px;border-radius:14px;font-size:12px;line-height:1.55"><b>Vanlig Mystery Box</b><br>500 Coins — 38%<br>Fusion Crystal — 26%<br>Rare Puffling Egg — 18%<br>Epic Puffling Egg — 11%<br>Legendary Puffling Egg — 6%<br>Random Legendary Puffling — 1%<br><br><b>3 Boxer → garantert egg</b><br>Rare Puffling Egg — 70%<br>Epic Puffling Egg — 25%<br>Legendary Puffling Egg — 5%</div><div class="small" style="margin-top:10px;opacity:.72">Odds vises før diamanter brukes. Betalte diamanter verifiseres og lagres på server.</div><button id="closeMysteryShop" class="secondary" style="margin-top:12px">TILBAKE</button></div>`;document.body.appendChild(el);
  el.querySelectorAll('[data-buy-boxes]').forEach(b=>b.onclick=()=>buyBoxes(Number(b.dataset.buyBoxes)));
  document.getElementById('openMysteryBox').onclick=openBox;document.getElementById('combineMysteryBoxes').onclick=combineBoxes;
  document.getElementById('closeMysteryShop').onclick=()=>{el.style.display='none';document.getElementById('start').style.display='flex';};
  const btn=document.createElement('button');btn.id='mysteryShopBtn';btn.className='gold';btn.textContent='MYSTERY SHOP 💎';btn.onclick=open;const more=document.getElementById('menuMoreGrid')||document.querySelector('#start .menuActions');more?.appendChild(btn);refresh();
 }
 function refresh(){
  const d=document.getElementById('diamondBalance');if(d)d.textContent=get();
  const split=document.getElementById('diamondBalanceSplit');if(split)split.textContent=paidGet()?`Opptjent: ${earnedGet()} • Kjøpt: ${paidGet()}`:'';
  const b=document.getElementById('mysteryBoxCount');if(b)b.textContent=boxCount();
  document.querySelectorAll?.('[data-buy-boxes]').forEach(btn=>{const bundle=bundles.find(x=>x.count===Number(btn.dataset.buyBoxes));btn.disabled=buyBusy||!bundle||get()<bundle.cost;});
  const openBtn=document.getElementById('openMysteryBox');if(openBtn)openBtn.disabled=boxCount()<1;
  const combineBtn=document.getElementById('combineMysteryBoxes');if(combineBtn)combineBtn.disabled=boxCount()<3;
 }
 function open(){ensure();document.getElementById('start').style.display='none';document.getElementById('mysteryShopMenu').style.display='flex';result('');window.PufflingDiamondWallet?.refreshBalance?.().then(refresh);refresh();}
 window.addEventListener?.('puffling:wallet',refresh);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,20));else setTimeout(ensure,20);
 window.SkyPuffDiamonds={get,set,add,spend,earned:earnedGet,paid:paidGet};
 window.SkyPuffMysteryShop={open,roll,rewards,cost:COST,bundles,boxCount,setBoxes,addBoxes,takeBoxes,buyBoxes,openBox,combineBoxes,rollFusionEgg,eggFusionChances};
})();


;/* js/diamond_iap_store.js */
/* Puffling — Diamond Store / native IAP scaffold v1.3
 * Web purchases remain disabled. Native purchases require store billing,
 * a signed Puffling wallet session and server-side provider verification.
 */
(function(){
  const RECEIPT_KEY='pufflingIapReceiptsV1';
  const CATALOG=[
    {id:'puffling.diamonds.25',diamonds:25,label:'25 Diamonds',tag:'1 Mystery Box',targetEur:1},
    {id:'puffling.diamonds.75',diamonds:75,label:'75 Diamonds',tag:'3 Mystery Boxer',targetEur:3},
    {id:'puffling.diamonds.250',diamonds:250,label:'250 Diamonds',tag:'10 Mystery Boxer',targetEur:9},
    {id:'puffling.diamonds.600',diamonds:600,label:'600 Diamonds',tag:'Best value',targetEur:16}
  ];
  let productMeta=new Map(),busy=false,recovering=false,serverState={checked:false,providerReady:false,ready:false,error:''};
  function bridge(){return window.PufflingIAP||null;}
  function wallet(){return window.PufflingDiamondWallet||null;}
  function verifyUrl(){return String(window.skyPuffConfig?.iapVerifyUrl||window.SKY_PUFF_IAP_VERIFY_URL||'').trim();}
  function statusUrl(){const configured=verifyUrl();if(configured)return configured.replace(/\/iap\/verify(?:\?.*)?$/,'/iap/status');const base=String(window.skyPuffConfig?.gameApiUrl||window.SKY_PUFF_GAME_API_URL||'').replace(/\/$/,'');return base?base+'/iap/status':'';}
  function platform(){const b=bridge();try{return String(typeof b?.getPlatform==='function'?b.getPlatform():b?.platform||'web').toLowerCase();}catch(e){return 'web';}}
  function bridgeReady(){const b=bridge();if(!b||typeof b.purchase!=='function'||typeof b.loadProducts!=='function'||typeof b.finishTransaction!=='function'||typeof b.getPendingPurchases!=='function')return false;try{return typeof b.isAvailable==='function'?!!b.isAvailable():b.isAvailable!==false;}catch(e){return false;}}
  function walletReady(){return !!wallet()?.status?.().ready&&!!wallet()?.token?.();}
  function canPurchase(){return bridgeReady()&&walletReady()&&!!verifyUrl()&&serverState.checked&&serverState.providerReady===true&&['ios','android'].includes(platform());}
  function status(){return {bridgeReady:bridgeReady(),walletReady:walletReady(),verifyReady:!!verifyUrl(),serverChecked:serverState.checked,serverReady:serverState.ready,providerReady:serverState.providerReady,platform:platform(),canPurchase:canPurchase(),busy,recovering,serverError:serverState.error};}
  function receipts(){try{const v=JSON.parse(localStorage.getItem(RECEIPT_KEY)||'[]');return Array.isArray(v)?v.slice(-200):[];}catch(e){return [];}}
  function rememberReceipt(tx){const id=String(tx||'');if(!id)return;const arr=receipts();if(!arr.includes(id)){arr.push(id);try{localStorage.setItem(RECEIPT_KEY,JSON.stringify(arr.slice(-200)));}catch(e){}}}
  function hasReceipt(tx){return receipts().includes(String(tx||''));}
  function catalog(){return CATALOG.map(p=>({...p,...(productMeta.get(p.id)||{})}));}
  function targetPriceLabel(product){return `€${Number(product.targetEur).toFixed(0)}`;}
  function setMessage(text,type='info'){const el=typeof document!=='undefined'?document.getElementById('diamondStoreStatus'):null;if(!el)return;el.textContent=text||'';el.dataset.type=type;}
  async function refreshServerStatus(){const url=statusUrl();if(!url){serverState={checked:true,providerReady:false,ready:false,error:'status_url_missing'};render();return serverState;}try{const res=await fetch(url,{headers:{accept:'application/json'}});const data=await res.json().catch(()=>({}));serverState={checked:true,providerReady:res.ok&&data?.providerReady===true,ready:res.ok&&data?.ready===true,error:res.ok?'':String(data?.error||`http_${res.status}`),providerMode:String(data?.providerMode||'')};}catch(e){serverState={checked:true,providerReady:false,ready:false,error:String(e?.message||e)};}render();return serverState;}
  function render(){
    if(typeof document==='undefined')return;const list=document.getElementById('diamondStoreProducts');if(!list)return;const s=status();list.innerHTML='';
    catalog().forEach(p=>{const btn=document.createElement('button');btn.className='diamondIapPack';btn.disabled=!s.canPurchase||busy||recovering;const price=p.displayPrice||p.priceLabel||(s.platform==='web'?`${targetPriceLabel(p)} målpris`:`${targetPriceLabel(p)} • pris lastes fra butikk`);btn.innerHTML=`<span class="diamondIapAmount">💎 ${p.diamonds.toLocaleString('nb-NO')}</span><span class="diamondIapTag">${p.tag||''}</span><span class="diamondIapPrice">${price}</span>`;btn.onclick=()=>purchase(p.id);list.appendChild(btn);});
    const bal=document.getElementById('diamondStoreBalance');if(bal)bal.textContent=window.SkyPuffDiamonds?.get?.()??0;
    const state=document.getElementById('diamondStoreAvailability');if(state){if(s.canPurchase)state.textContent=`${s.platform==='ios'?'App Store':'Google Play'} klar • serververifisering aktiv`;else if(s.platform==='web')state.textContent='Kjøp med ekte penger er deaktivert i web-betaen.';else if(!s.bridgeReady)state.textContent='Native butikkbro er ikke komplett i denne app-builden.';else if(!s.walletReady)state.textContent='Sikker Diamond-wallet er ikke koblet til.';else if(!s.serverChecked)state.textContent='Kontrollerer betalingsserver…';else if(!s.providerReady)state.textContent='Ekte betaling er sperret til Apple/Google-verifisering er aktiv på serveren.';else state.textContent='Betaling er ikke tilgjengelig akkurat nå.';}
  }
  async function refreshProducts(){const b=bridge();await refreshServerStatus();if(!bridgeReady())return catalog();try{const rows=await b.loadProducts(CATALOG.map(p=>p.id));if(Array.isArray(rows))for(const row of rows){const id=String(row?.productId||row?.id||'');if(CATALOG.some(p=>p.id===id))productMeta.set(id,{displayPrice:String(row.displayPrice||row.localizedPrice||''),currencyCode:String(row.currencyCode||''),title:String(row.title||'')});}}catch(e){console.warn('Puffling IAP product metadata failed',e);}render();return catalog();}
  async function verifyPurchase(purchaseResult,product){
    const url=verifyUrl(),W=wallet();if(!url)throw new Error('verification_not_configured');if(!W?.token?.())throw new Error('wallet_not_ready');
    const payload={productId:product.id,expectedDiamonds:product.diamonds,platform:platform(),transactionId:String(purchaseResult?.transactionId||purchaseResult?.purchaseToken||''),verificationData:purchaseResult?.verificationData||purchaseResult?.signedTransaction||purchaseResult?.receipt||purchaseResult?.purchaseToken||null,appVersion:String(window.SKY_PUFF_VERSION||window.skyPuffConfig?.version||'')};
    if(!payload.transactionId||!payload.verificationData)throw new Error('invalid_purchase_payload');
    const res=await fetch(url,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${W.token()}`},body:JSON.stringify(payload)});
    const data=await res.json().catch(()=>({ok:false,error:`verification_http_${res.status}`}));if(!res.ok||!data?.ok)throw new Error(String(data?.error||`verification_http_${res.status}`));
    if(String(data.productId||'')!==product.id)throw new Error('verification_product_mismatch');if(String(data.transactionId||'')!==payload.transactionId)throw new Error('verification_transaction_mismatch');if(Number(data.diamonds)!==product.diamonds)throw new Error('verification_amount_mismatch');if(!Number.isFinite(Number(data.paidDiamondBalance))||Number(data.paidDiamondBalance)<0)throw new Error('verification_balance_missing');return {...data,transactionId:payload.transactionId};
  }
  async function finishVerified(purchaseResult,product,verified){const b=bridge();const payload={productId:product.id,platform:platform(),transactionId:verified.transactionId,purchaseToken:String(purchaseResult?.purchaseToken||''),verificationData:purchaseResult?.verificationData||purchaseResult?.signedTransaction||purchaseResult?.receipt||purchaseResult?.purchaseToken||null};await b.finishTransaction(payload);}
  async function processVerifiedPurchase(purchaseResult,{silent=false}={}){const productId=String(purchaseResult?.productId||purchaseResult?.id||'');const product=CATALOG.find(p=>p.id===productId);if(!product)throw new Error('unknown_product');const purchaseState=String(purchaseResult?.status||'purchased').toLowerCase();if(['cancelled','canceled'].includes(purchaseState))return{ok:false,reason:'cancelled'};if(purchaseState==='pending')return{ok:false,reason:'pending'};const clientTx=String(purchaseResult?.transactionId||purchaseResult?.purchaseToken||''),wasKnown=!!clientTx&&hasReceipt(clientTx);const verified=await verifyPurchase(purchaseResult,product);const duplicate=verified.duplicate===true||wasKnown;wallet()?.acceptServerBalance?.(verified.paidDiamondBalance);await finishVerified(purchaseResult,product,verified);rememberReceipt(verified.transactionId);if(!silent){setMessage(duplicate?'Kjøpet var allerede registrert og er nå ferdigbehandlet.':`Kjøp fullført! +${product.diamonds} 💎`,'success');if(typeof showToast==='function'&&!duplicate)showToast(`+${product.diamonds} Diamonds 💎`);}window.dispatchEvent?.(new CustomEvent('puffling:iapPurchase',{detail:{productId:product.id,diamonds:product.diamonds,transactionId:verified.transactionId,duplicate}}));return{ok:true,product,verified};}
  async function recoverPending(){const b=bridge();if(recovering||!bridgeReady()||!walletReady())return[];await refreshServerStatus();if(!serverState.providerReady)return[];recovering=true;render();const out=[];try{const rows=await b.getPendingPurchases();for(const row of Array.isArray(rows)?rows:[]){try{const result=await processVerifiedPurchase(row,{silent:true});out.push(result);}catch(e){console.warn('Puffling IAP recovery failed',String(e?.message||e));}}if(out.some(x=>x?.ok))setMessage('Tidligere kjøp ble kontrollert og ferdigbehandlet.','success');return out;}finally{recovering=false;render();}}
  async function purchase(productId){
    const product=CATALOG.find(p=>p.id===String(productId||''));if(!product)return {ok:false,reason:'unknown_product'};if(busy||recovering)return {ok:false,reason:'busy'};
    await refreshServerStatus();if(!canPurchase()){setMessage('Betaling er ikke aktivert før butikk og serververifisering begge er klare.','warn');render();return {ok:false,reason:'not_ready'};}
    busy=true;render();setMessage('Åpner butikk…');
    try{const result=await bridge().purchase(product.id);if(String(result?.status||'purchased').toLowerCase()==='pending'){setMessage('Kjøpet venter på godkjenning. Diamanter legges til først etter serververifisering.');return{ok:false,reason:'pending'};}if(['cancelled','canceled'].includes(String(result?.status||'').toLowerCase())){setMessage('Kjøpet ble avbrutt.');return{ok:false,reason:'cancelled'};}setMessage('Verifiserer kjøpet…');return await processVerifiedPurchase({...result,productId:result?.productId||product.id});}
    catch(e){const code=String(e?.message||e||'purchase_failed');console.error('Puffling IAP purchase failed',code);setMessage('Kjøpet kunne ikke fullføres. Ingen diamanter ble lagt til. Kjøpet forsøkes kontrollert igjen ved neste oppstart.','error');return {ok:false,reason:code};}
    finally{busy=false;render();}
  }
  function ensure(){
    if(typeof document==='undefined'||document.getElementById('diamondStoreMenu'))return;const style=document.createElement('style');style.id='diamondIapCss';style.textContent=`#diamondStoreProducts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.diamondIapPack{display:flex!important;flex-direction:column;align-items:center;gap:3px;padding:12px 8px!important;min-height:82px}.diamondIapAmount{font-size:17px;font-weight:1000}.diamondIapTag{font-size:10px;opacity:.65;font-weight:900}.diamondIapPrice{font-size:12px;font-weight:1000;margin-top:3px}#diamondStoreStatus[data-type="error"]{color:#9c2635}#diamondStoreStatus[data-type="success"]{color:#187343}@media(max-width:420px){#diamondStoreProducts{grid-template-columns:1fr}}`;document.head.appendChild(style);
    const el=document.createElement('div');el.id='diamondStoreMenu';el.className='overlay';el.style.display='none';el.innerHTML=`<div class="card" style="max-width:520px;max-height:92dvh;overflow-y:auto"><h1 style="font-size:32px">Diamond Store 💎</h1><div style="font-size:22px;font-weight:1000">Saldo: 💎 <span id="diamondStoreBalance">0</span></div><div id="diamondStoreAvailability" class="small" style="margin:8px 0"></div><div id="diamondStoreProducts"></div><div id="diamondStoreStatus" class="small" style="min-height:18px;margin:8px 0"></div><div class="small" style="text-align:left;background:rgba(255,255,255,.6);padding:11px;border-radius:14px;line-height:1.5">Målpriser: 25 💎 = €1 • 75 💎 = €3 • 250 💎 = €9 • 600 💎 = €16. Endelig pris og valuta kommer alltid fra App Store eller Google Play. Diamanter krediteres først etter serververifisering.</div><button id="closeDiamondStore" class="secondary" style="margin-top:12px">TILBAKE</button></div>`;document.body.appendChild(el);
    document.getElementById('closeDiamondStore').onclick=()=>{el.style.display='none';const ms=document.getElementById('mysteryShopMenu');if(ms)ms.style.display='flex';else document.getElementById('start').style.display='flex';};
    const addEntry=()=>{const menu=document.getElementById('mysteryShopMenu');if(!menu||menu.querySelector('#openDiamondStore'))return;const card=menu.querySelector('.card');if(!card)return;const btn=document.createElement('button');btn.id='openDiamondStore';btn.className='gold';btn.style.marginBottom='10px';btn.textContent='KJØP DIAMANTER 💎';btn.onclick=open;const bundles=menu.querySelector('#mysteryBoxBundles');if(bundles)bundles.insertAdjacentElement('beforebegin',btn);else card.appendChild(btn);};addEntry();setTimeout(addEntry,100);render();refreshProducts().then(()=>recoverPending());
  }
  function open(){ensure();wallet()?.init?.().then(()=>refreshProducts()).then(()=>recoverPending()).then(render);const mystery=document.getElementById('mysteryShopMenu');if(mystery)mystery.style.display='none';const el=document.getElementById('diamondStoreMenu');if(el)el.style.display='flex';setMessage('');render();}
  window.addEventListener?.('puffling:wallet',()=>{render();recoverPending();});
  window.PufflingDiamondStore={CATALOG,catalog,status,canPurchase,refreshServerStatus,refreshProducts,recoverPending,purchase,open,render,version:3};
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,30));else setTimeout(ensure,30);}
})();


;/* js/menu_beta_cleanup.js */
/* Puffling — remove obsolete menu hints and beta UI v0.3 */
(function(){
 function clean(){
  const hint=document.getElementById('menuHint');if(hint)hint.remove();
  const badge=document.getElementById('betaBadge');if(badge)badge.remove();
  document.querySelectorAll('[id*="betaPopup"],[id*="betaModal"],[class*="betaPopup"],[class*="betaModal"]').forEach(e=>e.remove());
 }
 clean();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean);
 setTimeout(clean,250);setTimeout(clean,900);
 document.getElementById('languageSelect')?.addEventListener('change',()=>setTimeout(clean,0));
 window.SkyPuffMenuBetaCleanup={clean};
})();


;/* js/puffling_gameplay.js */
/* Puffling — gameplay integration v0.2 */
(function(){
  const ACTIVE_KEY='skyPuffActivePuffling';
  let windLatch=false,frostUsed=false;
  function F(){return window.SkyPuffFusion}
  function active(){try{return localStorage.getItem(ACTIVE_KEY)||''}catch(e){return ''}}
  function setActive(id){const f=F(),s=f&&f.load();if(!f||!s||!(s.owned[id]>0))return false;localStorage.setItem(ACTIVE_KEY,id);refreshHud();return true}
  function getPuff(id){const f=F();if(!f)return null;return [...Object.values(f.BASE||{}),...Object.values(f.FUSIONS||{})].find(p=>p.id===id)||null}
  function ensureHud(){if(document.getElementById('activePufflingHud'))return;const d=document.createElement('div');d.id='activePufflingHud';d.style.cssText='position:fixed;left:12px;bottom:14px;z-index:7;display:none;background:rgba(24,49,82,.72);color:#fff;padding:7px 10px;border-radius:14px;font:800 12px system-ui;backdrop-filter:blur(5px);pointer-events:none';document.body.appendChild(d)}
  function refreshHud(){ensureHud();const d=document.getElementById('activePufflingHud'),p=getPuff(active());if(!d)return;d.innerHTML=p?`${p.icon||'☁️'} ${p.name}`:'☁️ Ingen aktiv Puffling';d.style.display=(typeof running!=='undefined'&&running)?'block':'none'}
  function resetRunState(){windLatch=false;frostUsed=false}
  function applyPassives(dt){const id=active(),ability=getPuff(id)?.ability;if(!id||typeof running==='undefined'||!running)return;const s=Math.min((dt||16.67)/16.67,1.6);
    if((ability==='rainbowGain'||ability==='rainbowChain')&&typeof boost==='number'){boost=Math.min(100,boost+.055*s);if(typeof boostEl!=='undefined'&&boostEl)boostEl.style.width=boost+'%';}
    if((ability==='jumpControl'||ability==='stormJump')&&typeof player!=='undefined'&&player&&!windLatch&&player.vy<-10.35&&player.vy>-10.9){player.vy*=1.06;windLatch=true;}if(typeof player!=='undefined'&&player&&player.vy>-2)windLatch=false;
  }
  const oldUpdate=window.update;
  if(typeof oldUpdate==='function')window.update=function(dt){oldUpdate(dt);applyPassives(dt);refreshHud()};
  const oldReset=window.reset;
  if(typeof oldReset==='function')window.reset=function(){const r=oldReset.apply(this,arguments);resetRunState();refreshHud();return r};
  const oldAbsorb=window.absorbHit;
  if(typeof oldAbsorb==='function')window.absorbHit=function(){const id=active(),ability=getPuff(id)?.ability;if(!frostUsed&&(ability==='freeze'||ability==='rescuePlatform')){frostUsed=true;if(typeof invuln!=='undefined')invuln=Math.max(invuln,70);if(typeof showToast==='function')showToast(`${getPuff(id)?.name||'Puffling'} reddet deg! ❄️`);return true;}return oldAbsorb.apply(this,arguments)};
  window.SkyPuffPufflingGameplay={active,setActive,getPuff,refreshHud,runHeightReward:false};
  ensureHud();
})();

;/* js/puffling_trait_runtime.js */
/* Puffling — unique Puffling trait runtime v1.1 */
(function(){
 const G=()=>window.SkyPuffPufflingGameplay;
 const T=id=>window.SkyPuffUniqueTraits?.get?.(id)||null;
 const E=id=>Math.max(1,Number(window.SkyPuffPufflingEvolution?.bonusFor?.(id)||1));
 let jumpLatch=false;
 function active(){return G()?.active?.()||'';}
 function applyFrame(dt){
  const id=active(),trait=T(id);if(!id||!trait||typeof running==='undefined'||!running)return;const evo=E(id);
  const s=Math.min((Number(dt)||16.67)/16.67,1.6);
  if(typeof boost==='number'&&trait.boostRegen>0){boost=Math.min(100,boost+trait.boostRegen*evo*s);if(typeof boostEl!=='undefined'&&boostEl)boostEl.style.width=boost+'%';}
  if(typeof player!=='undefined'&&player){
   const jumpScale=1+(Math.max(1,trait.jumpScale)-1)*evo;
   if(!jumpLatch&&player.vy<-10.35&&player.vy>-11.1&&jumpScale>1){player.vy*=jumpScale;jumpLatch=true;}
   if(player.vy>-2)jumpLatch=false;
  }
 }
 const oldUpdate=window.update;
 if(typeof oldUpdate==='function')window.update=function(dt){const r=oldUpdate.apply(this,arguments);applyFrame(dt);return r;};
 const oldBoost=window.doBoost;
 if(typeof oldBoost==='function')window.doBoost=function(){
  const id=active(),before=typeof playerShots!=='undefined'?playerShots.length:0,r=oldBoost.apply(this,arguments),trait=T(id),evo=E(id);
  if(trait&&typeof playerShots!=='undefined'&&playerShots.length>before){for(let i=before;i<playerShots.length;i++){if(playerShots[i]?.damage!=null)playerShots[i].damage*=trait.shotPower*evo;}}
  return r;
 };
 const oldAbsorb=window.absorbHit;
 if(typeof oldAbsorb==='function')window.absorbHit=function(){
  const id=active(),trait=T(id),chance=Math.min(.5,(trait?.rescueChance||0)*E(id));
  if(chance>0&&Math.random()<chance){if(typeof invuln!=='undefined')invuln=Math.max(invuln,26);if(typeof showToast==='function')showToast(`${G()?.getPuff?.(id)?.name||'Puffling'} trait save! ✨`);return true;}
  return oldAbsorb.apply(this,arguments);
 };
 function enhanceDex(){document.querySelectorAll('#puffdexGrid [data-puffling-id]').forEach(card=>{if(card.querySelector('[data-unique-trait]'))return;const trait=T(card.dataset.pufflingId);if(!trait)return;const d=document.createElement('div');d.dataset.uniqueTrait='1';d.className='small';d.style.cssText='margin-top:5px;font-weight:900;opacity:.78';d.textContent=`✦ ${trait.traitName}`;card.appendChild(d);});}
 function detailObserver(){
  const root=document.getElementById('pufflingDetailContent');if(!root)return;
  const inject=()=>{if(root.querySelector('[data-trait-detail]'))return;const title=root.querySelector('h1');if(!title||/Uoppdaget/.test(title.textContent||''))return;const list=[...Object.values(window.SkyPuffFusion?.BASE||{}),...Object.values(window.SkyPuffFusion?.FUSIONS||{})];const p=list.find(x=>title.textContent?.includes(x.name));if(!p?.trait)return;const t=p.trait,box=document.createElement('div');box.dataset.traitDetail='1';box.style.cssText='margin:10px 0 14px;padding:12px;border-radius:14px;background:rgba(255,255,255,.62);text-align:left';const evo=E(p.id);box.innerHTML=`<b>✦ ${t.traitName}</b><div class="small" style="margin-top:5px">Hopp x${t.jumpScale.toFixed(4)} • Boost ${t.boostRegen.toFixed(4)} • Skudd x${t.shotPower.toFixed(3)} • Kontroll ${t.controlBonus.toFixed(3)} • Rescue ${(t.rescueChance*100).toFixed(2)}% • Race ${t.raceStrength.toFixed(3)}${evo>1?` • Evolution bonus +${Math.round((evo-1)*100)}%`:''}</div>`;title.insertAdjacentElement('afterend',box);};
  new MutationObserver(()=>{inject();enhanceDex();}).observe(root,{childList:true,subtree:true});inject();
 }
 if(typeof MutationObserver!=='undefined'){const boot=()=>{enhanceDex();detailObserver();const grid=document.getElementById('puffdexGrid');if(grid)new MutationObserver(enhanceDex).observe(grid,{childList:true,subtree:true});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));else setTimeout(boot,50);}
 window.SkyPuffTraitRuntime={active,trait:()=>T(active()),evolutionBonus:()=>E(active()),applyFrame};
})();

;/* js/puffling_starter_choice.js */
/* Orbuff — first Orbuff starter choice v1.2 (legacy Puffling internals retained for save compatibility) */
(function(){
 const KEY='skyPuffStarterChoiceV1';
 const IDS=['starterpuff','starterspark','starterdrop'];
 const COPY={
  no:{title:'Velg din første Orbuff',sub:'Velg én starter-Orbuff. Alle tre er enkle og klart svakere enn Orbuffs du kan finne senere.',choose:'VELG',common:'COMMON • STARTER',weak:'Lav styrke',picked:'Din første Orbuff er klar!'},
  en:{title:'Choose your first Orbuff',sub:'Choose one starter Orbuff. All three are simple and clearly weaker than Orbuffs you can find later.',choose:'CHOOSE',common:'COMMON • STARTER',weak:'Low power',picked:'Your first Orbuff is ready!'},
  de:{title:'Wähle deinen ersten Orbuff',sub:'Wähle einen Starter-Orbuff. Alle drei sind einfach und deutlich schwächer als spätere Orbuffs.',choose:'WÄHLEN',common:'COMMON • STARTER',weak:'Geringe Stärke',picked:'Dein erster Orbuff ist bereit!'},
  es:{title:'Elige tu primer Orbuff',sub:'Elige un Orbuff inicial. Los tres son simples y claramente más débiles que los Orbuffs que encontrarás después.',choose:'ELEGIR',common:'COMMON • STARTER',weak:'Poca fuerza',picked:'¡Tu primer Orbuff está listo!'},
  fr:{title:'Choisissez votre premier Orbuff',sub:'Choisissez un Orbuff de départ. Tous les trois sont simples et nettement plus faibles que les Orbuffs trouvés plus tard.',choose:'CHOISIR',common:'COMMON • STARTER',weak:'Faible puissance',picked:'Votre premier Orbuff est prêt !'}
 };
 function tr(){try{return COPY[typeof lang==='string'?lang:'no']||COPY.en}catch(e){return COPY.en}}
 function F(){return window.SkyPuffFusion}
 function state(){return F()?.load?.()||{owned:{}}}
 function ownsAny(){return Object.values(state().owned||{}).some(n=>Number(n)>0)}
 function ownedStarter(){const owned=state().owned||{};return IDS.find(id=>Number(owned[id])>0)||''}
 function storedChoice(){try{const id=localStorage.getItem(KEY)||'';return IDS.includes(id)?id:''}catch(e){return ''}}
 function chosen(){
  const owned=ownedStarter(),stored=storedChoice();
  if(stored&&stored===owned)return stored;
  if(owned){try{localStorage.setItem(KEY,owned)}catch(e){}return owned;}
  if(stored){try{localStorage.removeItem(KEY)}catch(e){}}
  return '';
 }
 function puff(id){return F()?.BASE?.[id]||null}
 function eligible(){return !chosen()}
 function ensure(){
  let root=document.getElementById('starterPufflingChoice');if(root)return root;
  root=document.createElement('div');root.id='starterPufflingChoice';root.className='overlay';root.style.cssText='display:none;z-index:120;align-items:flex-start;overflow:auto;padding:max(12px,env(safe-area-inset-top)) 10px max(12px,env(safe-area-inset-bottom))';
  root.innerHTML='<div class="card" style="width:min(94vw,560px);margin:auto;padding:20px 16px"><div style="font-size:48px">☁️✨💧</div><h1 id="starterChoiceTitle" style="font-size:clamp(28px,8vw,38px);margin:4px 0"></h1><div id="starterChoiceSub" class="small" style="max-width:470px;margin:0 auto 15px;line-height:1.45"></div><div id="starterChoiceGrid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px"></div></div>';
  document.body.appendChild(root);
  if(!document.getElementById('starterPufflingChoiceCss')){const s=document.createElement('style');s.id='starterPufflingChoiceCss';s.textContent='@media(max-width:500px){#starterChoiceGrid{grid-template-columns:1fr!important}#starterChoiceGrid button{min-height:112px!important}}';document.head.appendChild(s);}
  return root;
 }
 function render(){
  const t=tr(),root=ensure(),grid=document.getElementById('starterChoiceGrid');
  document.getElementById('starterChoiceTitle').textContent=t.title;document.getElementById('starterChoiceSub').textContent=t.sub;grid.innerHTML='';
  IDS.forEach(id=>{const p=puff(id);if(!p)return;const b=document.createElement('button');b.type='button';b.className='secondary';b.dataset.starterPuffling=id;b.setAttribute('aria-label',`${t.choose}: ${p.name}`);b.style.cssText='min-width:0;margin:0;padding:14px 8px;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:2px solid rgba(80,160,210,.22);pointer-events:auto;touch-action:manipulation';b.innerHTML=`<span style="font-size:38px">${p.icon||'☁️'}</span><b style="font-size:15px">${p.name}</b><small style="font-weight:1000;opacity:.7">${t.common}</small><small style="opacity:.68">${t.weak}</small><span style="margin-top:5px;font-weight:1000">${t.choose}</span>`;b.onclick=()=>select(id);grid.appendChild(b);});
  root.style.display='flex';
 }
 function select(id){
  if(!IDS.includes(id)||!eligible())return false;const f=F(),p=puff(id);if(!f||!p)return false;
  f.add(id,1);const after=f.load();if(!(after.owned?.[id]>0))return false;
  try{localStorage.setItem(KEY,id)}catch(e){}
  window.SkyPuffPufflingGameplay?.setActive?.(id);window.SkyPuffFusionUI?.renderDex?.();window.SkyPuffRaceEligibility?.refresh?.();
  const root=ensure();root.style.display='none';
  if(typeof showToast==='function')showToast(`${tr().picked} ${p.icon||'☁️'} ${window.OrbuffBrand?.replaceText?.(p.name)||p.name}`);
  const detail={id,orbuff:p,puffling:p};
  window.dispatchEvent(new CustomEvent('orbuff:starterChosen',{detail}));
  window.dispatchEvent(new CustomEvent('puffling:starterChosen',{detail}));
  return true;
 }
 function open(){if(eligible())render();return eligible()}
 function maybeShow(){if(!eligible())return;const start=document.getElementById('start');if(start?.inert){setTimeout(maybeShow,80);return;}render();}
 function guardPlay(event){
  if(!eligible())return;
  event?.preventDefault?.();event?.stopImmediatePropagation?.();
  try{if(typeof running!=='undefined')running=false;}catch(e){}
  const start=document.getElementById('start');if(start)start.style.display='flex';
  render();return false;
 }
 function bindGuards(){
  for(const id of ['playBtn','retryBtn']){const button=document.getElementById(id);if(button&&!button.dataset.starterGuard){button.dataset.starterGuard='1';button.addEventListener('click',guardPlay,true);}}
 }
 ensure();bindGuards();
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{bindGuards();setTimeout(maybeShow,120)});else setTimeout(maybeShow,120);
 document.getElementById('languageSelect')?.addEventListener('change',()=>{if(ensure().style.display!=='none')render()});
 const api={IDS,ownsAny,ownedStarter,chosen,eligible,open,select,render,guardPlay,bindGuards};
 window.OrbuffStarterChoice=api;
 window.SkyPuffStarterChoice=api;
})();


;/* js/puffling_progression.js */
/* Sky Puff — Puffling XP + Levels v0.3 */
(function(){
 const KEY='skyPuffPufflingProgressV1';
 const MAX_LEVEL=20;
 let lastScore=0,heightRemainder=0,lastActive='',lastBossSeen=null;
 function normalize(raw){const out={};if(!raw||typeof raw!=='object')return out;for(const [id,value] of Object.entries(raw)){if(!value||typeof value!=='object')continue;let level=Math.max(1,Math.min(MAX_LEVEL,Math.floor(Number(value.level)||1))),xp=Math.max(0,Math.floor(Number(value.xp)||0));while(level<MAX_LEVEL&&xp>=xpNeed(level)){xp-=xpNeed(level);level++;}if(level>=MAX_LEVEL)xp=0;out[id]={level,xp};}return out;}
 function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return {}}}
 function saveData(d){localStorage.setItem(KEY,JSON.stringify(d))}
 function xpNeed(level){return Math.floor(80+level*35+level*level*8)}
 function get(id){const d=load();const row=d[id]||{level:1,xp:0};return {...row,next:row.level>=MAX_LEVEL?0:xpNeed(row.level)}}
 function addXp(id,amount){if(!id||amount<=0)return get(id);const d=load(),row=d[id]||{level:1,xp:0};row.xp+=Math.floor(amount);let leveled=false;while(row.level<MAX_LEVEL&&row.xp>=xpNeed(row.level)){row.xp-=xpNeed(row.level);row.level++;leveled=true;}if(row.level>=MAX_LEVEL)row.xp=0;d[id]=row;saveData(d);if(leveled&&typeof showToast==='function'){const p=window.SkyPuffPufflingGameplay?.getPuff?.(id);showToast(`${p?.icon||'☁️'} ${p?.name||'Puffling'} nådde level ${row.level}!`);}window.SkyPuffFusionUI?.renderDex?.();return {...row,next:row.level>=MAX_LEVEL?0:xpNeed(row.level)}}
 function reset(id){if(!id)return {level:1,xp:0,next:xpNeed(1)};const d=load();delete d[id];saveData(d);window.SkyPuffFusionUI?.renderDex?.();return get(id);}
 function multiplier(id){const g=get(id);return 1+Math.min(.20,(g.level-1)*.01)}
 function active(){return window.SkyPuffPufflingGameplay?.active?.()||''}
 function tick(){
  try{
   const isRunning=typeof running!=='undefined'&&running;
   if(isRunning&&typeof score==='number'){
    const id=active(),delta=Math.max(0,score-lastScore);if(id!==lastActive)heightRemainder=0;lastActive=id;if(id){heightRemainder+=delta;const gain=Math.floor(heightRemainder/25);if(gain>0){addXp(id,gain);heightRemainder-=gain*25;}}else heightRemainder=0;lastScore=score;
   }else{lastScore=0;heightRemainder=0;lastActive='';}
   if(typeof boss!=='undefined'){
    if(boss&&isRunning)lastBossSeen={id:boss.id,tier:boss.tier||1};
    else if(lastBossSeen){
      if(isRunning&&typeof bossDefeated!=='undefined'&&bossDefeated){const id=active();if(id)addXp(id,35);}
      lastBossSeen=null;
    }
   }
  }catch(e){}
  requestAnimationFrame(tick)
 }
 requestAnimationFrame(tick);
 window.SkyPuffPufflingProgress={get,addXp,reset,multiplier,xpNeed,maxLevel:MAX_LEVEL,normalize};
})();

;/* js/puffling_trade.js */
/* Puffling — server-authoritative two-player Puffling Trade v2.0 */
(function(){
 const PLAYER_KEY='pufflingTradePlayerIdV1';
 let ws=null,room='',myOffer='',theirOffer='',theirPlayer='',connected=false,myAccepted=false,theirAccepted=false,pendingTx='';
 const el=id=>document.getElementById(id);const F=()=>window.SkyPuffFusion;
 function endpoint(){try{return localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'';}catch(e){return window.SKY_PUFF_RACE_WS_URL||'';}}
 function apiBase(wsUrl){try{const u=new URL(wsUrl);u.protocol=u.protocol==='wss:'?'https:':'http:';u.pathname='';u.search='';u.hash='';return u.origin;}catch(e){return '';}}
 function playerId(){try{let id=localStorage.getItem(PLAYER_KEY);if(!id){id='trade_'+Math.random().toString(36).slice(2,10);localStorage.setItem(PLAYER_KEY,id);}return id;}catch(e){return 'trade_'+Math.random().toString(36).slice(2,10);}}
 function identity(){try{return{token:String(localStorage.getItem('pufflingAccountAuthToken')||''),accountId:String(localStorage.getItem('pufflingAccountId')||'')}}catch(e){return{token:'',accountId:''}}}
 async function ensureIdentity(){let saved=identity();if(saved.token)return saved;const transport=window.SkyPuffRaceTransport;if(transport?.ensureGuestIdentity){await transport.ensureGuestIdentity();saved=identity();if(saved.token)return saved;}const base=apiBase(endpoint());if(!base)throw new Error('account_endpoint_missing');const response=await fetch(base+'/api/account/guest',{method:'POST',headers:{accept:'application/json'}});let body={};try{body=await response.json()}catch(e){}if(!response.ok||!body?.token||!body?.accountId)throw new Error(body?.error||'account_bootstrap_failed');try{localStorage.setItem('pufflingAccountAuthToken',body.token);localStorage.setItem('pufflingAccountId',body.accountId)}catch(e){}return{token:body.token,accountId:body.accountId};}
 function cleanCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);}function newCode(){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let out='';for(let i=0;i<6;i++)out+=chars[Math.floor(Math.random()*chars.length)];return out;}
 function allPuffs(){const f=F();return f?[...Object.values(f.BASE||{}),...Object.values(f.FUSIONS||{})]:[];}function puff(id){return allPuffs().find(p=>p.id===id)||null;}
 function tradeable(){const f=F(),s=f?.load?.();if(!f||!s)return[];return allPuffs().filter(p=>!p.starterOnly&&f.availableCount(p.id)>0).map(p=>({p,count:s.owned[p.id]||0,available:f.availableCount(p.id)})).sort((a,b)=>String(a.p.name).localeCompare(String(b.p.name)));}
 function status(text,bad=false){const e=el('tradeStatus');if(e){e.textContent=text||'';e.style.color=bad?'#a73535':'#35516b';}}function send(m){if(ws&&ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify(m));return true;}return false;}function closeSocket(){if(ws){try{ws.close(1000,'leave trade')}catch(e){}}ws=null;connected=false;pendingTx='';}
 function renderOfferSelectors(){const select=el('tradeMySelect');if(!select)return;const current=select.value||myOffer,choices=tradeable();select.innerHTML='<option value="">Velg Puffling…</option>'+choices.map(({p,count,available})=>`<option value="${p.id}">${p.icon||'☁️'} ${p.name} — eier x${count}${available!==count?` • ${available} kan trades`:''}</option>`).join('');if(choices.some(x=>x.p.id===current))select.value=current;else if(myOffer&&!choices.some(x=>x.p.id===myOffer)){myOffer='';send({type:'trade:cancel'});}}
 function render(){renderOfferSelectors();const mine=puff(myOffer),theirs=puff(theirOffer),my=el('tradeMyOffer');if(my)my.innerHTML=mine?`${mine.icon||'☁️'} <b>${mine.name}</b><br><small>Din tilbudte kopi</small>`:'Velg en Puffling du vil tilby.';const other=el('tradeTheirOffer');if(other)other.innerHTML=theirs?`${theirs.icon||'☁️'} <b>${theirs.name}</b><br><small>Motspillerens tilbud</small>`:'Venter på motspillerens tilbud…';const accept=el('tradeAcceptBtn');if(accept){accept.disabled=!connected||!myOffer||!theirOffer||myAccepted||!!pendingTx;accept.textContent=myAccepted?'GODKJENT ✓':'GODKJENN BYTTE';}const badge=el('tradeAcceptState');if(badge)badge.textContent=`Du: ${myAccepted?'✓':'—'}   •   Motspiller: ${theirAccepted?'✓':'—'}`;const code=el('tradeRoomCode');if(code)code.textContent=room||'------';}
 function applyState(m){const mineId=playerId(),players=Array.isArray(m?.players)?m.players:[],mine=players.find(p=>p.playerId===mineId),other=players.find(p=>p.playerId!==mineId);if(mine){myOffer=mine.offer?.pufflingId||'';myAccepted=!!mine.accepted;}if(other){theirPlayer=other.playerId||theirPlayer;theirOffer=other.offer?.pufflingId||'';theirAccepted=!!other.accepted;}render();}
 function applyCommit(m){const mineId=playerId(),transfers=Array.isArray(m?.transfers)?m.transfers:[],outgoing=transfers.find(t=>t.from===mineId),incoming=transfers.find(t=>t.to===mineId);if(!outgoing||!incoming||!m.txId)return;const f=F(),progress=window.SkyPuffPufflingProgress;if(!f?.tradeTransfer)return;const res=f.tradeTransfer(outgoing.pufflingId,incoming.pufflingId,String(m.txId));if(!res.ok){status('Serveren fullførte handelen, men lokal samling kunne ikke synkroniseres. Åpne spillet på nytt før ny trade.',true);return;}if(!res.duplicate){if(res.outgoingRemaining===0)progress?.reset?.(outgoing.pufflingId);if(res.incomingWasNew)progress?.reset?.(incoming.pufflingId);}const p=puff(incoming.pufflingId);status(`✅ Trade fullført! Du mottok ${p?.name||incoming.pufflingId}.`);myOffer='';theirOffer='';myAccepted=false;theirAccepted=false;pendingTx='';window.SkyPuffFusionUI?.renderDex?.();render();}
 function handle(raw){let m;try{m=JSON.parse(raw.data)}catch(e){return;}if(!m?.type)return;if(m.type==='trade:matched'){room=m.room||room;connected=true;applyState(m);status((m.players||[]).length>=2?'Venn koblet til. Velg Pufflings.':'Venter på venn…');}else if(m.type==='trade:opponentJoined'){theirPlayer=m.player?.playerId||'';connected=true;status('Venn koblet til. Velg Pufflings.');render();}else if(m.type==='trade:state')applyState(m);else if(m.type==='trade:commit')applyCommit(m);else if(m.type==='trade:canceled'){pendingTx='';status('Trade ble endret eller avbrutt. Begge må godkjenne på nytt.');}else if(m.type==='trade:opponentLeft'){theirPlayer='';theirOffer='';theirAccepted=false;pendingTx='';status('Motspilleren forlot trade-rommet.');render();}else if(m.type==='trade:error'){pendingTx='';const text=({room_full:'Trade-rommet er fullt.',invalid_room:'Ugyldig trade-kode.',trade_auth_required:'Trade krever en gyldig Puffling-konto.',same_account:'Du kan ikke trade med samme konto.',trade_inventory_unavailable:'Trade-inventory er midlertidig utilgjengelig.',starter_locked:'Starter Pufflings kan ikke trades.',offers_required:'Begge må velge en Puffling først.',inventory_missing:'Serveren finner ikke den tilbudte Pufflingen i inventory.',trade_settling:'Handelen fullføres allerede.'})[m.code]||'Trade-serveren avviste handlingen.';status(text,true);render();}}
 async function connect(code){closeSocket();room=cleanCode(code);myOffer='';theirOffer='';myAccepted=false;theirAccepted=false;theirPlayer='';render();const url=endpoint();if(!url){status('Trade krever live Puffling-server. Serveradressen er ikke konfigurert ennå.',true);return;}status('Sikrer Puffling-konto…');let auth;try{auth=await ensureIdentity();}catch(e){status('Kunne ikke opprette sikker Puffling-konto for Trade.',true);return;}status(`Kobler til trade-rom ${room}…`);try{ws=new WebSocket(url);}catch(e){status('Kunne ikke åpne trade-serveren.',true);return;}ws.onopen=()=>send({type:'trade:hello',room,playerId:playerId(),protocol:2,authToken:auth.token});ws.onmessage=handle;ws.onerror=()=>{};ws.onclose=()=>{connected=false;if(el('pufflingTradeMenu')?.style.display!=='none')status('Forbindelsen til trade-serveren ble lukket.',true);render();};}
 function setOffer(id){id=String(id||'');const p=puff(id);if(!id||!p){myOffer='';send({type:'trade:cancel'});render();return;}if(p.starterOnly||F().availableCount(id)<1){status('Denne Pufflingen kan ikke trades.',true);render();return;}myOffer=id;myAccepted=false;theirAccepted=false;pendingTx='';send({type:'trade:offer',pufflingId:id});render();}function accept(){if(!connected||!myOffer||!theirOffer)return;pendingTx='settling';send({type:'trade:accept'});status('Serveren kontrollerer begge inventory…');render();}
 function ensure(){if(el('pufflingTradeMenu'))return;const style=document.createElement('style');style.id='pufflingTradeCss';style.textContent=`#pufflingTradeMenu{align-items:flex-start;overflow-y:auto;padding:12px}#pufflingTradeMenu .tradeCard{width:min(94vw,620px);margin:auto;max-height:calc(100dvh - 24px);overflow-y:auto}.tradeCode{font-size:36px;font-weight:1000;letter-spacing:5px;color:#285e7f;margin:5px 0 10px}.tradeConnect{display:grid;grid-template-columns:1fr 1fr;gap:8px}.tradeConnect input,.tradeOffer select{width:100%;box-sizing:border-box;padding:12px;border:0;border-radius:12px;background:#fff}.tradeOffers{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0}.tradeOffer{padding:12px;border-radius:16px;background:rgba(255,255,255,.68);min-height:92px}.tradeOfferTitle{font-size:11px;font-weight:1000;opacity:.65;margin-bottom:7px}.tradeWarning{font-size:11px;line-height:1.45;background:rgba(255,241,190,.8);padding:10px;border-radius:13px;margin:10px 0}@media(max-width:460px){.tradeConnect,.tradeOffers{grid-template-columns:1fr}.tradeCode{font-size:31px}}`;document.head.appendChild(style);const menu=document.createElement('div');menu.id='pufflingTradeMenu';menu.className='overlay';menu.style.display='none';menu.innerHTML=`<div class="card tradeCard"><h1 style="font-size:34px">Trade Pufflings 🔄</h1><div class="small">Bytt én Puffling mot én Puffling. Serveren kontrollerer eierskap og fullfører byttet atomisk.</div><div class="tradeWarning"><b>Trade-regler:</b> Starter Pufflings og Vault-beskyttede kopier kan ikke trades. XP/evolution følger ikke den tradede kopien.</div><div class="tradeConnect"><button id="tradeCreateBtn" class="gold">LAG TRADE-KODE</button><div style="display:grid;grid-template-columns:1fr auto;gap:6px"><input id="tradeJoinInput" maxlength="6" placeholder="KODE"><button id="tradeJoinBtn" class="secondary" style="margin:0;min-width:78px">BLI MED</button></div></div><div style="margin-top:12px;text-align:center"><div class="small">TRADE-KODE</div><div id="tradeRoomCode" class="tradeCode">------</div><div id="tradeStatus" class="small" style="font-weight:900;min-height:20px">Lag eller bli med i et trade-rom.</div></div><div class="tradeOffers"><div class="tradeOffer"><div class="tradeOfferTitle">DIN PUFFLING</div><select id="tradeMySelect"><option value="">Velg Puffling…</option></select><div id="tradeMyOffer" class="small" style="margin-top:9px"></div></div><div class="tradeOffer"><div class="tradeOfferTitle">MOTSPILLER</div><div id="tradeTheirOffer" class="small"></div></div></div><div id="tradeAcceptState" class="small" style="text-align:center;font-weight:900;margin-bottom:7px"></div><button id="tradeAcceptBtn" class="gold">GODKJENN BYTTE</button><button id="tradeCancelBtn" class="secondary">NULLSTILL TILBUD</button><button id="closePufflingTrade" class="secondary">TILBAKE</button></div>`;document.body.appendChild(menu);el('tradeCreateBtn').onclick=()=>connect(newCode());el('tradeJoinBtn').onclick=()=>{const c=cleanCode(el('tradeJoinInput').value);if(c.length!==6)return status('Skriv inn en gyldig 6-tegns trade-kode.',true);connect(c);};el('tradeJoinInput').oninput=e=>e.target.value=cleanCode(e.target.value);el('tradeMySelect').onchange=e=>setOffer(e.target.value);el('tradeAcceptBtn').onclick=accept;el('tradeCancelBtn').onclick=()=>{myOffer='';myAccepted=false;theirAccepted=false;pendingTx='';send({type:'trade:cancel'});render();};el('closePufflingTrade').onclick=()=>{closeSocket();menu.style.display='none';el('start').style.display='flex';};let btn=el('tradePufflingBtn');if(!btn){btn=document.createElement('button');btn.id='tradePufflingBtn';btn.className='secondary';btn.textContent='TRADE PUFFLINGS 🔄';btn.onclick=open;const host=el('menuMoreGrid')||document.querySelector('#start .menuActions');host?.appendChild(btn);}render();}
 function open(){ensure();el('start').style.display='none';el('pufflingTradeMenu').style.display='flex';status('Lag eller bli med i et trade-rom.');render();}window.PufflingTrade={open,ensure,tradeable,connect,setOffer,accept,endpoint,playerId,ensureIdentity};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,80));else setTimeout(ensure,80);
})();


;/* js/puffling_trade_inventory_sync.js */
/* Puffling — one-time legacy collection -> authoritative Trade inventory */
(function(){
 const MIGRATION_KEY='pufflingTradeInventoryMigrationV1';
 function endpoint(){try{return localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'';}catch(e){return window.SKY_PUFF_RACE_WS_URL||'';}}
 function apiBase(){try{const u=new URL(endpoint());u.protocol=u.protocol==='wss:'?'https:':'http:';u.pathname='';u.search='';u.hash='';return u.origin;}catch(e){return '';}}
 function token(){try{return String(localStorage.getItem('pufflingAccountAuthToken')||'');}catch(e){return '';}}
 function localSnapshot(){const f=window.SkyPuffFusion,s=f?.load?.();if(!s)return{owned:{},vault:[]};const allowed=new Set([...Object.keys(f.BASE||{}),...Object.values(f.FUSIONS||{}).map(x=>x.id)]);const owned={};for(const [id,n] of Object.entries(s.owned||{})){const q=Math.max(0,Math.floor(Number(n)||0));if(allowed.has(id)&&q>0)owned[id]=q;}const vault=[...new Set((s.vault||[]).filter(id=>allowed.has(id)&&(owned[id]||0)>0))].slice(0,3);return{owned,vault};}
 async function request(path,options={}){const base=apiBase(),auth=token();if(!base||!auth)throw new Error('trade_inventory_auth_missing');const r=await fetch(base+path,{...options,headers:{accept:'application/json',authorization:`Bearer ${auth}`,'content-type':'application/json',...(options.headers||{})}});let b={};try{b=await r.json();}catch(e){}if(!r.ok){const err=new Error(b?.error||`http_${r.status}`);err.status=r.status;throw err;}return b;}
 async function ensure(){if(!window.PufflingTrade?.ensureIdentity)throw new Error('trade_identity_unavailable');await window.PufflingTrade.ensureIdentity();let migrated=false;try{migrated=localStorage.getItem(MIGRATION_KEY)==='1';}catch(e){}if(!migrated){try{await request('/api/trade/inventory/migrate',{method:'POST',body:JSON.stringify(localSnapshot())});}catch(e){if(e.status!==409)throw e;}try{localStorage.setItem(MIGRATION_KEY,'1');}catch(e){}}
 return request('/api/trade/inventory',{method:'GET'});}
 function fail(){const e=document.getElementById('tradeStatus');if(e){e.textContent='Kunne ikke synkronisere Puffling-samlingen med serveren. Trade er stoppet for å beskytte inventory.';e.style.color='#a73535';}}
 function install(){const t=window.PufflingTrade;if(!t||t.__inventorySyncInstalled)return false;const original=t.connect.bind(t);t.connect=async function(code){const e=document.getElementById('tradeStatus');if(e)e.textContent='Synkroniserer sikker Puffling-samling…';try{await ensure();return original(code);}catch(err){fail();return false;}};t.ensureServerInventory=ensure;t.__inventorySyncInstalled=true;
  const create=document.getElementById('tradeCreateBtn'),join=document.getElementById('tradeJoinBtn'),input=document.getElementById('tradeJoinInput');
  if(create)create.onclick=()=>t.connect((()=>{const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let out='';for(let i=0;i<6;i++)out+=chars[Math.floor(Math.random()*chars.length)];return out;})());
  if(join)join.onclick=()=>{const code=String(input?.value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);if(code.length!==6){const e=document.getElementById('tradeStatus');if(e)e.textContent='Skriv inn en gyldig 6-tegns trade-kode.';return;}t.connect(code);};
  return true;}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,120));else setTimeout(install,120);
 window.PufflingTradeInventorySync={ensure,localSnapshot,install};
})();


;/* js/puffling_evolution.js */
/* Sky Puff — Puffling evolution milestones v0.2 */
(function(){
 function puffFor(id){
  const F=window.SkyPuffFusion;
  return F?.BASE?.[id]||Object.values(F?.FUSIONS||{}).find(p=>p.id===id)||window.SkyPuffPufflingGameplay?.getPuff?.(id)||null;
 }
 const canEvolve=id=>{const p=puffFor(id);return !!p&&!p.starterOnly;};
 const stageFor=id=>{
  if(!canEvolve(id))return 0;
  const g=window.SkyPuffPufflingProgress?.get?.(id)||{level:1};
  return g.level>=20?2:g.level>=10?1:0;
 };
 const bonusFor=id=>{const s=stageFor(id);return s===2?1.12:s===1?1.06:1};
 const titleFor=id=>{const p=puffFor(id);const s=stageFor(id);if(!p)return '';return s===2?`Ascended ${p.name}`:s===1?`Evolved ${p.name}`:p.name};
 let last={};
 function tick(){
  try{
   const F=window.SkyPuffFusion,s=F?.load?.();if(s){Object.keys(s.owned||{}).forEach(id=>{if((s.owned[id]||0)<=0||!canEvolve(id))return;const st=stageFor(id),prev=last[id]??st;last[id]=st;if(st>prev&&typeof showToast==='function'){const p=puffFor(id);showToast(st===2?`ASCENDED! ${p?.icon||'☁️'} ${p?.name||id}`:`EVOLVED! ${p?.icon||'☁️'} ${p?.name||id}`);window.SkyPuffFusionUI?.renderDex?.();}});}
  }catch(e){}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 window.SkyPuffPufflingEvolution={canEvolve,stageFor,bonusFor,titleFor};
})();


;/* js/puffling_evolution_ui_guard.js */
/* Sky Puff — Puffdex evolution eligibility UI v1.0 */
(function(){
 const STARTERS=new Set(['starterpuff','starterspark','starterdrop']);
 function patchGrid(){
  document.querySelectorAll('#puffdexGrid [data-puffling-id]').forEach(card=>{
   if(!STARTERS.has(card.dataset.pufflingId))return;
   const lines=[...card.querySelectorAll('.small')];
   const hint=lines.find(el=>/evolution/i.test(el.textContent||''));
   if(hint)hint.textContent='Starter • utvikler seg ikke';
  });
 }
 function patchDetail(){
  const root=document.getElementById('pufflingDetailContent');if(!root)return;
  const title=root.querySelector('h1');if(!title)return;
  const list=[...Object.values(window.SkyPuffFusion?.BASE||{}),...Object.values(window.SkyPuffFusion?.FUSIONS||{})];
  const p=list.find(x=>title.textContent?.includes(x.name));if(!p?.starterOnly)return;
  const heading=[...root.querySelectorAll('h3')].find(el=>/EVOLUTION FORMS/i.test(el.textContent||''));
  if(heading)heading.textContent='STARTER FORM';
  root.querySelectorAll('.pufflingFormCard').forEach(card=>{
   const stage=Number(card.dataset.stage)||0;
   if(stage>0)card.style.display='none';
   else card.style.gridColumn='1 / -1';
  });
  const formGrid=root.querySelector('.pufflingFormCard')?.parentElement;if(formGrid)formGrid.style.gridTemplateColumns='1fr';
  [...root.querySelectorAll('.small')].forEach(el=>{
   if(/Evolution låses opp automatisk/i.test(el.textContent||''))el.textContent='Starter-Pufflings utvikler seg ikke. Finn andre Pufflings for å låse opp Evolved og Ascended forms.';
  });
 }
 function patch(){patchGrid();patchDetail();}
 function boot(){
  patch();
  const grid=document.getElementById('puffdexGrid');if(grid&&typeof MutationObserver!=='undefined')new MutationObserver(patchGrid).observe(grid,{childList:true,subtree:true});
  const detail=document.getElementById('pufflingDetailContent');if(detail&&typeof MutationObserver!=='undefined')new MutationObserver(patchDetail).observe(detail,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,50));else setTimeout(boot,50);
 window.SkyPuffEvolutionEligibilityUI={patch};
})();


;/* js/puffling_evolution_perks.js */
/* Sky Puff — Evolution perks v0.1 */
(function(){
 const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
 const stage=id=>window.SkyPuffPufflingEvolution?.stageFor?.(id)||0;
 let emberBurstReady=0,voltChainReady=0,frostWardReady=0,prismSurgeReady=0,shadowVeilReady=0,windLiftReady=0;
 function now(){return performance.now()}
 function toast(s){if(typeof showToast==='function')showToast(s)}
 function tick(){
  try{
   const id=active(),st=stage(id),t=now();if(!id||st<=0){requestAnimationFrame(tick);return;}
   if(typeof running==='undefined'||!running){requestAnimationFrame(tick);return;}
   if(id==='prism'&&typeof boost==='number'&&st>=1&&t>=prismSurgeReady){boost=Math.min(100,boost+(st>=2?12:7));prismSurgeReady=t+(st>=2?9000:12000);toast(st>=2?'Ascended Prism Surge! 🌈👑':'Prism Surge! 🌈');}
   if(id==='wind'&&typeof player!=='undefined'&&player&&st>=1&&player.vy>4&&t>=windLiftReady){player.vy-=st>=2?4.2:2.6;windLiftReady=t+(st>=2?6500:9000);toast(st>=2?'Ascended Tailwind! 💨👑':'Tailwind! 💨');}
   if(id==='frost'&&typeof invuln!=='undefined'&&st>=2&&t>=frostWardReady&&typeof player!=='undefined'&&player&&typeof H!=='undefined'&&player.y>H-110&&player.vy>3){invuln=Math.max(invuln,55);player.vy=-7.5;frostWardReady=t+15000;toast('Ascended Frost Ward! ❄️👑');}
  }catch(e){}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 const oldBoost=window.doBoost;
 if(typeof oldBoost==='function')window.doBoost=function(){
  const id=active(),st=stage(id),before=typeof playerShots!=='undefined'?playerShots.length:0,r=oldBoost.apply(this,arguments),t=now();
  try{
   if(st>=1&&typeof playerShots!=='undefined'&&playerShots.length>before){const shot=playerShots[playerShots.length-1];
    if(id==='ember'&&t>=emberBurstReady&&shot){shot.damage*=st>=2?1.35:1.18;shot.r*=st>=2?1.18:1.08;emberBurstReady=t+(st>=2?5200:7600);toast(st>=2?'ASCENDED FLARE! 🔥👑':'Flare Burst! 🔥');}
    if(id==='volt'&&t>=voltChainReady&&shot&&typeof player!=='undefined'){const dmg=shot.damage*(st>=2?.34:.22);playerShots.push({x:player.x-14,y:player.y-player.r-4,vx:-2.2,vy:shot.vy*.9,r:7,life:85,damage:dmg});playerShots.push({x:player.x+14,y:player.y-player.r-4,vx:2.2,vy:shot.vy*.9,r:7,life:85,damage:dmg});voltChainReady=t+(st>=2?4800:7000);toast(st>=2?'ASCENDED ARC! ⚡👑':'Chain Spark! ⚡');}
   }
   if(id==='shadow'&&st>=1&&typeof invuln!=='undefined'&&t>=shadowVeilReady){invuln=Math.max(invuln,st>=2?48:28);shadowVeilReady=t+(st>=2?5500:8000);toast(st>=2?'ASCENDED VEIL! 🌑👑':'Shadow Veil! 🌑');}
  }catch(e){}
  return r;
 };
 window.SkyPuffEvolutionPerks={active,stage};
})();


;/* js/boss_session_client.js */
/* Puffling beta.104 — server-validated Boss Session bridge */
(function(){
 let active=null,starting=null,lastBoss=null,lastHp=null,queue=Promise.resolve(),lastHitSentAt=0;
 const sleep=ms=>new Promise(r=>setTimeout(r,Math.max(0,ms||0)));
 function base(){return String(window.skyPuffConfig?.apiBase||window.SKY_PUFF_GAME_API_URL||'').replace(/\/$/,'')}
 async function token(){try{let t=localStorage.getItem('pufflingAccountAuthToken')||'';if(t)return t;const x=await window.SkyPuffRaceTransport?.ensureGuestIdentity?.();return x?.token||localStorage.getItem('pufflingAccountAuthToken')||''}catch(e){return''}}
 async function post(path,data){const t=await token(),u=base();if(!t||!u)throw new Error('boss_server_unavailable');const r=await fetch(u+path,{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+t,'accept':'application/json'},body:JSON.stringify(data||{})});let b={};try{b=await r.json()}catch(e){}if(!r.ok||!b?.ok){const err=new Error(b?.error||'boss_server_rejected');err.status=r.status;err.code=b?.error||'';throw err}return b}
 function refOf(b){return `${String(b?.id||'').toLowerCase()}:${Math.max(1,Math.floor(Number(b?.tier)||1))}`}
 async function start(b){if(!b||active||starting||typeof bossRushMode!=='undefined'&&bossRushMode)return;const ref=refOf(b);starting=(async()=>{try{const s=await post('/api/boss/session/start',{bossRef:ref});const stillSame=(typeof boss!=='undefined'&&boss&&refOf(boss)===ref)||(!boss&&lastBoss&&refOf(lastBoss)===ref);if(!stillSame)return null;active={sessionId:s.sessionId,nonce:s.nonce,bossRef:ref,maxHp:Number(s.maxHp)||Number(b?.maxHp)||Number(b?.hp)||0,minFightMs:Number(s.minFightMs)||5000,minHitMs:Number(s.minHitMs)||180,startedAt:s.startedAt||new Date().toISOString(),startedAtMs:Date.parse(s.startedAt||'')||Date.now()};lastHitSentAt=0;window.SkyPuffBossSessionClient.active=active;return active}catch(e){active=null;return null}finally{starting=null}})();return starting}
 function hit(damage){if(!active)return;const amount=Math.max(1,Math.min(44,Math.floor(Number(damage)||0))),a={...active};queue=queue.then(async()=>{const pace=(a.minHitMs||180)+25,wait=pace-(Date.now()-lastHitSentAt);if(wait>0)await sleep(wait);for(let attempt=0;attempt<3;attempt++){try{const x=await post('/api/boss/session/hit',{sessionId:a.sessionId,nonce:a.nonce,damage:amount});lastHitSentAt=Date.now();if(active?.sessionId===a.sessionId)active.server=x;return x}catch(e){if(e?.code==='hit_rate_limited'||e?.status===429){await sleep(pace+30);continue}if(attempt<2){await sleep(180*(attempt+1));continue}throw e}}}).catch(e=>{if(active?.sessionId===a.sessionId)active.serverError=String(e?.message||e)});}
 function reportDamage(delta){let left=Math.max(0,Math.round(Number(delta)||0));while(left>0){const chunk=Math.min(44,left);hit(chunk);left-=chunk;}}
 async function finish(defeated){if(starting)await starting.catch(()=>null);const a=active;active=null;lastHp=null;window.SkyPuffBossSessionClient.active=null;if(!a||!defeated)return;await queue;try{let st=await post('/api/boss/session/status',{sessionId:a.sessionId});if(st.bossHp>0)throw new Error('boss_proof_incomplete');if(!st.completedAt){const began=Date.parse(st.startedAt||a.startedAt)||a.startedAtMs||Date.now(),minimum=Number(st.minFightMs||a.minFightMs)||5000,wait=minimum-(Date.now()-began)+100;if(wait>0)await sleep(wait);st=await post('/api/boss/session/status',{sessionId:a.sessionId});}if(!st.completedAt||st.bossHp>0)throw new Error('boss_proof_incomplete');await window.SkyPuffBossPufflingRewards?.rollBossReward?.({...defeated,sessionId:a.sessionId,bossRef:a.bossRef});}catch(e){if(typeof showToast==='function')showToast('Boss beseiret, men Puffling-belønningen kunne ikke verifiseres.')}}
 function tick(){try{const b=typeof boss!=='undefined'?boss:null;if(b){if(!lastBoss||lastBoss.id!==b.id||lastBoss.tier!==b.tier){active=null;starting=null;queue=Promise.resolve();lastHitSentAt=0;lastHp=Number(b.hp);start(b)}else if(active&&Number(b.hp)<Number(lastHp)){const current=Number(b.hp);reportDamage(Number(lastHp)-current);lastHp=current}lastBoss={id:b.id,name:b.name,at:b.at,tier:b.tier};}else if(lastBoss){const d=lastBoss;lastBoss=null;if(typeof bossDefeated!=='undefined'&&bossDefeated)finish(d);else{active=null;starting=null;lastHp=null;}}}catch(e){}requestAnimationFrame(tick)}
 window.SkyPuffBossSessionClient={active:null,start,hit,reportDamage,finish,post};requestAnimationFrame(tick);
})();

;/* js/puffling_boss_rewards.js */
/* Puffling — Boss Puffling Rewards v0.7 verified session reward */
(function(){
 let grantPending=false,rewardedSession='';
 function fusion(){return window.SkyPuffFusion}function gameplay(){return window.SkyPuffPufflingGameplay}
 function all(){const F=fusion();return F?[...Object.values(F.BASE||{}),...Object.values(F.FUSIONS||{})]:[]}
 function puffInfo(id){return gameplay()?.getPuff?.(id)||all().find(p=>p.id===id)||null}
 function endpoint(){return String(window.skyPuffConfig?.apiBase||window.SKY_PUFF_GAME_API_URL||'').replace(/\/$/,'')}
 async function identity(){let token='';try{token=localStorage.getItem('pufflingAccountAuthToken')||''}catch(e){}if(token)return token;try{const x=await window.SkyPuffRaceTransport?.ensureGuestIdentity?.();return x?.token||localStorage.getItem('pufflingAccountAuthToken')||''}catch(e){return''}}
 function applyGranted(id){const F=fusion();if(!F||!id)return;F.add(id,1);const p=puffInfo(id);if(gameplay()&&!gameplay().active())gameplay().setActive(id);window.SkyPuffFusionUI?.renderDex?.();const rarity=(p?.rarity||'common').toUpperCase(),rare=(p?.rarity==='epic'||p?.rarity==='legendary')?` ${rarity}!`:' ';if(typeof showToast==='function')showToast(`BOSS DROP!${rare} ${p?.icon||'☁️'} ${p?.name||id} funnet!`)}
 async function requestGrant(sessionId){const base=endpoint(),token=await identity();if(!base||!token||!sessionId)throw new Error('reward_server_unavailable');const r=await fetch(base+'/api/acquisition/boss',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+token,'accept':'application/json'},body:JSON.stringify({sessionId})});let b={};try{b=await r.json()}catch(e){}if(!r.ok||!b?.ok||!b?.serverAuthoritative)throw new Error(b?.error||'reward_rejected');return b}
 async function rollBossReward(defeated){const sessionId=String(defeated?.sessionId||'');if(grantPending||!sessionId||sessionId===rewardedSession||typeof bossRushMode!=='undefined'&&bossRushMode)return;grantPending=true;try{const grant=await requestGrant(sessionId);rewardedSession=sessionId;if(grant.noDrop||!grant.pufflingId){if(typeof showToast==='function')showToast('Boss reward: Ingen Puffling denne gangen ☁️');return}applyGranted(grant.pufflingId)}catch(e){if(typeof showToast==='function')showToast('Boss reward kunne ikke bekreftes av serveren — ingen Puffling ble lagt til.')}finally{grantPending=false}}
 window.SkyPuffBossPufflingRewards={rollBossReward,requestGrant};
})();

;/* js/diamond_boss_rewards.js */
/* Sky Puff — Diamond boss rewards v0.1 */
(function(){
 let last=null;
 function tick(){try{
  if(typeof boss!=='undefined'){
   if(boss)last={id:boss.id,tier:boss.tier||1,at:boss.at||0};
   else if(last&&typeof running!=='undefined'&&running){const won=typeof bossDefeated!=='undefined'&&bossDefeated;if(won&&window.SkyPuffDiamonds){let amount=1;if(last.at>=10000)amount=2;if(last.at>=17000)amount=3;if(last.at>=24000)amount=4;window.SkyPuffDiamonds.add(amount);if(typeof showToast==='function')showToast(`Boss reward: +${amount} 💎`);}last=null;}
  }
 }catch(e){}requestAnimationFrame(tick)}
 requestAnimationFrame(tick);
})();

;/* js/puffling_follower.js */
/* Puffling — Visible Puffling follower v0.5 */
(function(){
  let el=null,lastVisualKey='';
  function ensure(){
    if(el)return el;
    el=document.createElement('div');
    el.id='pufflingFollower';
    el.style.cssText='position:fixed;z-index:6;display:none;pointer-events:none;transform:translate(-50%,-50%);align-items:center;justify-content:center;transition:opacity .18s ease;will-change:left,top';
    document.body.appendChild(el);return el;
  }
  function setVisual(d,id,p){
    const stage=window.SkyPuffPufflingEvolution?.stageFor?.(id)||0;
    const key=id+':'+stage;
    if(key===lastVisualKey)return;
    lastVisualKey=key;
    d.innerHTML=window.SkyPuffVisuals?.art?.(id,stage)||`<span style="font-size:23px">${p?.icon||'☁️'}</span>`;
  }
  function screenX(gameX){
    try{const r=canvas.getBoundingClientRect();return r.left+Number(gameX||0);}catch(e){return Number(gameX||0);}
  }
  function tick(t){
    const d=ensure(),G=window.SkyPuffPufflingGameplay;
    try{
      const id=G?.active?.(),p=G?.getPuff?.(id);
      if(!p||typeof running==='undefined'||!running||typeof player==='undefined'||!player){d.style.display='none';requestAnimationFrame(tick);return;}
      setVisual(d,id,p);
      const bob=Math.sin(t/280)*4;
      const side=(typeof player.vx==='number'&&player.vx<0)?36:-36;
      const x=screenX(player.x+side);
      d.style.left=`${Math.max(22,Math.min(innerWidth-22,x))}px`;
      d.style.top=`${Math.max(22,Math.min(innerHeight-22,player.y-12+bob))}px`;
      d.style.display='flex';
    }catch(e){d.style.display='none'}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


;/* js/puffling_abilities_v2.js */
/* Sky Puff — Puffling abilities v0.3 (level-scaled) */
(function(){
  let shadowReadyAt=0;
  const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
  const prog=()=>window.SkyPuffPufflingProgress;
  function lv(id){return prog()?.get?.(id)?.level||1}
  function t01(id){return Math.max(0,Math.min(1,(lv(id)-1)/19))}
  const oldBoost=window.doBoost;
  if(typeof oldBoost==='function')window.doBoost=function(){
    const beforeShots=typeof playerShots!=='undefined'?playerShots.length:0;
    const beforeBoost=typeof boost==='number'?boost:0;
    const r=oldBoost.apply(this,arguments);
    const id=active(),ability=window.SkyPuffPufflingGameplay?.getPuff?.(id)?.ability,scale=t01(id);
    if(typeof playerShots!=='undefined'&&playerShots.length>beforeShots){
      const shot=playerShots[playerShots.length-1];
      if((ability==='blastDamage'||ability==='chainBlast')&&shot){
        const dmg=1.18+scale*.14; // 1.18 -> 1.32
        shot.damage*=dmg;
        shot.r*=1.08+scale*.06;
      }
      if((ability==='chainShot'||ability==='chainBlast'||ability==='rainbowChain')&&shot&&typeof player!=='undefined'){
        const sideDamage=.42+scale*.16; // .42 -> .58
        const spread=1.25+scale*.35;
        const sideR=Math.max(7,shot.r*(.72+scale*.06));
        playerShots.push({x:player.x-8,y:player.y-player.r-8,vx:-spread,vy:shot.vy*.94,r:sideR,life:100,damage:shot.damage*sideDamage});
        playerShots.push({x:player.x+8,y:player.y-player.r-8,vx:spread,vy:shot.vy*.94,r:sideR,life:100,damage:shot.damage*sideDamage});
      }
    }
    if((ability==='airDash'||ability==='phaseDash')&&typeof performance!=='undefined'&&typeof invuln!=='undefined'&&typeof boost==='number'&&boost<beforeBoost){
      const now=performance.now();
      const cooldown=6500-scale*1600; // 6.5s -> 4.9s
      const phase=34+Math.round(scale*18); // 34 -> 52 frames-ish
      if(now>=shadowReadyAt){invuln=Math.max(invuln,phase);shadowReadyAt=now+cooldown;if(typeof showToast==='function')showToast(`Shadow Phase! 🌑 Lv.${lv(id)}`);}
    }
    return r;
  };
  window.SkyPuffPufflingAbilities={active,level:lv};
})();


;/* js/puffling_fusion_abilities.js */
/* Sky Puff — Unique Fusion Puffling abilities v0.2 (level-scaled) */
(function(){
 let auroraReady=0,tempestReady=0,neonReady=0;
 const active=()=>window.SkyPuffPufflingGameplay?.active?.()||'';
 const prog=()=>window.SkyPuffPufflingProgress;
 const level=id=>prog()?.get?.(id)?.level||1;
 const t01=id=>Math.max(0,Math.min(1,(level(id)-1)/19));
 const now=()=>performance.now();
 function toast(s){if(typeof showToast==='function')showToast(s)}
 function tick(){
  try{
   const id=active(),t=now(),scale=t01(id);
   if(id==='aurora'&&typeof running!=='undefined'&&running&&typeof player!=='undefined'&&player&&typeof H!=='undefined'&&player.y>H-75&&player.vy>2&&t>=auroraReady){
    const rescueVy=-11.5-scale*2.2;
    const inv=42+Math.round(scale*24);
    const cd=14000-scale*3500;
    player.vy=rescueVy; invuln=Math.max(typeof invuln==='number'?invuln:0,inv); auroraReady=t+cd; toast(`AURORA RESCUE! ❄️🌈 Lv.${level(id)}`);
   }
   if(id==='tempest'&&typeof running!=='undefined'&&running&&typeof player!=='undefined'&&player&&player.vy<0&&t>=tempestReady){
    player.vy-=2.4+scale*1.6;
    tempestReady=t+(5200-scale*1400);
   }
   if(id==='neonstorm'&&typeof boss!=='undefined'&&boss&&t>=neonReady&&typeof rainbowOvercharge!=='undefined'){
    rainbowOvercharge=Math.max(rainbowOvercharge,150+Math.round(scale*90));
    neonReady=t+(12000-scale*2500);
    toast(`NEON OVERCHARGE! 🌈⚡ Lv.${level(id)}`);
   }
  }catch(e){}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 window.SkyPuffFusionAbilities={active,level};
})();


;/* js/puffling_fusion_signature.js */
/* Sky Puff — Fusion evolution signature abilities v0.1 */
(function(){let ready={};const t=()=>performance.now(),active=()=>window.SkyPuffPufflingGameplay?.active?.()||'',stage=id=>window.SkyPuffPufflingEvolution?.stageFor?.(id)||0;function toast(x){if(typeof showToast==='function')showToast(x)}function tick(){try{const id=active(),s=stage(id),n=t();if(s<1){requestAnimationFrame(tick);return}if(typeof running==='undefined'||!running){requestAnimationFrame(tick);return}if(n<(ready[id]||0)){requestAnimationFrame(tick);return}if(id==='thunderflame'&&typeof boost==='number'){boost=Math.min(100,boost+(s===2?18:10));ready[id]=n-(0)+(s===2?9000:13000);toast(s===2?'ASCENDED THUNDERCORE! 🔥⚡':'Thundercharge! 🔥⚡')}else if(id==='aurora'&&typeof invuln==='number'){invuln=Math.max(invuln,s===2?55:32);ready[id]=n+(s===2?10500:15000);toast(s===2?'CELESTIAL AURORA! ✨':'Aurora Veil! ❄️🌈')}else if(id==='eclipse'&&typeof invuln==='number'){invuln=Math.max(invuln,s===2?48:28);if(typeof boost==='number')boost=Math.min(100,boost+(s===2?14:7));ready[id]=n+(s===2?9500:14000);toast(s===2?'TOTAL ECLIPSE! 🌑🔥':'Eclipse Veil! 🌘')}else if(id==='tempest'&&typeof player!=='undefined'&&player){if(player.vy>0)player.vy=s===2?-9.5:-7.5;else player.vy-=s===2?2.8:1.7;ready[id]=n+(s===2?8500:12500);toast(s===2?'SKY HURRICANE! 🌪️⚡':'Tempest Surge! 🌪️')}else if(id==='neonstorm'&&typeof boost==='number'){boost=Math.min(100,boost+(s===2?25:14));if(typeof invuln==='number'&&s===2)invuln=Math.max(invuln,26);ready[id]=n+(s===2?9000:13500);toast(s===2?'NEON SUPERNOVA! 🌈⚡':'Neon Pulse! 🌈⚡')}}catch(e){}requestAnimationFrame(tick)}requestAnimationFrame(tick);})();


;/* js/race_multiplayer_transport.js */
/* Puffling — Race My Puffling network transport v0.7 */
(function(){
  const PROTOCOL_VERSION=3;
  const listeners=new Map();let socket=null,state='offline',room='',playerId='',authToken='',accountId='',lastSentAt=0,manualClose=false,reconnectTimer=null,reconnectDeadline=0,reconnectAttempt=0,connectedOnce=false,activeUrl='';
  const MIN_POSITION_INTERVAL=66,RECONNECT_WINDOW_MS=11000,RETRY_DELAYS=[300,700,1200,1800,2500,3000],BOT_WAIT_MS=8000,BOT_TICK_MS=100;
  let botTimer=null,botTick=null,bot=null,lastPlayerHeight=0;
  function emit(type,payload){const set=listeners.get(type);if(!set)return;set.forEach(fn=>{try{fn(payload)}catch(e){console.error('[RaceTransport]',e)}});}
  function on(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn);return()=>listeners.get(type)?.delete(fn);}
  function endpoint(){try{return localStorage.getItem('skyPuffRaceWsUrl')||window.SKY_PUFF_RACE_WS_URL||'';}catch(e){return window.SKY_PUFF_RACE_WS_URL||'';}}
  function apiBase(wsUrl){try{const u=new URL(wsUrl);u.protocol=u.protocol==='wss:'?'https:':'http:';u.pathname='';u.search='';u.hash='';return u.origin;}catch(e){return '';}}
  function readIdentity(){try{return{token:String(localStorage.getItem('pufflingAccountAuthToken')||''),accountId:String(localStorage.getItem('pufflingAccountId')||'')}}catch(e){return{token:'',accountId:''}}}
  function storeIdentity(token,id){authToken=String(token||'');accountId=String(id||'');try{if(authToken)localStorage.setItem('pufflingAccountAuthToken',authToken);if(accountId)localStorage.setItem('pufflingAccountId',accountId);}catch(e){}}
  function setAuthToken(token,{persist=true}={}){authToken=String(token||'');if(persist)storeIdentity(authToken,accountId);return authToken;}
  async function ensureGuestIdentity(){const saved=readIdentity();if(saved.token){authToken=saved.token;accountId=saved.accountId;return saved;}const base=apiBase(activeUrl||endpoint());if(!base)throw new Error('account_endpoint_missing');const response=await fetch(base+'/api/account/guest',{method:'POST',headers:{accept:'application/json'}});let body={};try{body=await response.json();}catch(e){}if(!response.ok||!body?.token||!body?.accountId)throw new Error(body?.error||'account_bootstrap_failed');storeIdentity(body.token,body.accountId);return{token:authToken,accountId};}
  function setState(next,extra={}){state=next;emit('state',{state,room,playerId,reconnectDeadline,...extra});}
  function clearReconnect(){if(reconnectTimer){clearTimeout(reconnectTimer);reconnectTimer=null;}}
  function clearBot(){if(botTimer){clearTimeout(botTimer);botTimer=null;}if(botTick){clearInterval(botTick);botTick=null;}bot=null;lastPlayerHeight=0;}
  function sendRaw(msg){if(socket&&socket.readyState===WebSocket.OPEN){socket.send(JSON.stringify(msg));return true;}return false;}
  function botPublic(){return{playerId:'BOT_MEDIUM',accountId:null,pufflingId:bot?.pufflingId||'volt',skin:'default',evolutionStage:1,rankRating:1000,rankAuthenticated:false,ready:true,connected:true,height:Math.floor(bot?.height||0),x:bot?.x||0,y:null,worldY:null,attacksUsed:bot?.attacksUsed||0,bot:true,difficulty:'medium'};}
  function startBotFallback(){if(bot||manualClose)return;manualClose=true;try{socket?.close(1000,'bot fallback')}catch(e){}socket=null;clearReconnect();const startAt=Date.now()+3000;bot={height:0,x:0,startedAt:startAt,lastAt:startAt,attacksUsed:0,nextAttackAt:.32,finished:false,pufflingId:['ember','volt','frost','wind'][Math.floor(Math.random()*4)]};setState('bot',{bot:true,difficulty:'medium'});emit('race:opponentJoined',{room,player:botPublic(),bot:true});emit('race:start',{room,mode:'bot',serverStartAt:startAt,countdownMs:3000,goal:1500,courseSeed:`BOT_${room}`,courseVersion:1,players:[{playerId,accountId,pufflingId:null,ready:true,connected:true,height:0},botPublic()],bot:true,difficulty:'medium'});
    botTick=setInterval(()=>{if(!bot||bot.finished||Date.now()<bot.startedAt)return;const t=Date.now(),dt=Math.min(.25,Math.max(.02,(t-bot.lastAt)/1000));bot.lastAt=t;const progress=Math.max(lastPlayerHeight,bot.height)/1500;const rubber=(lastPlayerHeight-bot.height)*.018;const base=11.2+Math.sin(t/1700)*1.2;const jitter=(Math.random()-.5)*2.2;bot.height=Math.max(bot.height,Math.min(1500,bot.height+(base+rubber+jitter)*dt));bot.x=Math.sin(t/700)*120;emit('race:position',{type:'race:position',room,playerId:'BOT_MEDIUM',t,x:bot.x,y:null,worldY:null,height:bot.height,state:'jumping',pufflingId:bot.pufflingId,skin:'default',evolutionStage:1,bot:true});if(bot.attacksUsed<3&&progress>=bot.nextAttackAt){bot.attacksUsed++;bot.nextAttackAt=[.32,.60,.82,2][bot.attacksUsed]||2;emit('race:attack',{type:'race:attack',room,playerId:'BOT_MEDIUM',ability:'gust',abilityId:'gust',attacksUsed:bot.attacksUsed,remaining:3-bot.attacksUsed,bot:true});}if(bot.height>=1500){bot.finished=true;clearInterval(botTick);botTick=null;emit('race:result',{type:'race:result',room,mode:'bot',winnerId:'BOT_MEDIUM',finishedAt:t,goal:1500,reason:'bot_finish',rank:null,rankServerAuthoritative:false,players:[{playerId,height:lastPlayerHeight},botPublic()],bot:true});}},BOT_TICK_MS);
  }
  function armBotFallback(m){if(botTimer||bot||m?.mode!=='quick'||!Array.isArray(m.players)||m.players.length!==1)return;botTimer=setTimeout(()=>{botTimer=null;startBotFallback();},BOT_WAIT_MS);}
  function handleMessage(ev){try{const m=JSON.parse(ev.data);if(!m||!m.type)return;if(m.room)room=String(m.room);if(m.type==='race:matched')armBotFallback(m);if(m.type==='race:opponentJoined'||m.type==='race:start'){if(botTimer){clearTimeout(botTimer);botTimer=null;}}if(m.type==='race:error'&&['race_auth_required','rank_auth_required','unsupported_protocol'].includes(String(m.code||'')))setState('server_rejected',{code:m.code,expectedProtocol:m.expectedProtocol});emit(m.type,m);}catch(e){}}
  function scheduleReconnect(){clearReconnect();if(manualClose||!activeUrl)return;if(!reconnectDeadline)reconnectDeadline=Date.now()+RECONNECT_WINDOW_MS;if(Date.now()>=reconnectDeadline){setState('reconnect_failed');emit('reconnect_failed',{room,playerId});return;}const delay=RETRY_DELAYS[Math.min(reconnectAttempt,RETRY_DELAYS.length-1)];reconnectAttempt++;reconnectTimer=setTimeout(()=>openSocket(activeUrl,true),delay);}
  function openSocket(url,isReconnect=false){clearReconnect();if(manualClose)return;try{socket=new WebSocket(url);setState(isReconnect?'reconnecting':'connecting',{attempt:reconnectAttempt});const timeout=setTimeout(()=>{if(socket&&socket.readyState!==WebSocket.OPEN){try{socket.close()}catch(e){}}},3500);socket.onopen=()=>{clearTimeout(timeout);connectedOnce=true;reconnectAttempt=0;setState('online',{resumed:isReconnect});sendRaw({type:'race:hello',room,playerId,protocol:PROTOCOL_VERSION,resume:isReconnect,authToken});};socket.onmessage=handleMessage;socket.onerror=()=>{};socket.onclose=()=>{clearTimeout(timeout);socket=null;if(manualClose){if(!bot)setState('offline');return;}if(connectedOnce){setState('reconnecting');scheduleReconnect();}else setState('connect_failed');};}catch(e){socket=null;if(connectedOnce){setState('reconnecting');scheduleReconnect();}else setState('connect_failed');}}
  async function connect(opts={}){clearBot();room=opts.room||room||'';playerId=opts.playerId||playerId||('p_'+Math.random().toString(36).slice(2,10));activeUrl=opts.url||endpoint();manualClose=false;reconnectAttempt=0;reconnectDeadline=0;connectedOnce=false;const saved=readIdentity();authToken=String(opts.authToken||saved.token||'');accountId=saved.accountId||'';if(!activeUrl){setState('local');return{mode:'local',room,playerId,authenticated:!!authToken,accountId};}if(!authToken){setState('authenticating');try{await ensureGuestIdentity();}catch(e){setState('race_auth_failed',{error:String(e?.message||e)});return{mode:'auth_failed',room,playerId,authenticated:false,error:String(e?.message||e)};}}return new Promise(resolve=>{let settled=false;const off=on('state',m=>{if(settled)return;if(m.state==='online'){settled=true;off();resolve({mode:'online',room,playerId,authenticated:!!authToken,accountId});}if(['connect_failed','server_rejected'].includes(m.state)){settled=true;off();manualClose=true;try{socket?.close()}catch(e){}socket=null;resolve({mode:'error',room,playerId,authenticated:!!authToken,accountId,error:m.code||m.state});}});openSocket(activeUrl,false);setTimeout(()=>{if(settled)return;settled=true;off();manualClose=true;try{socket?.close()}catch(e){}socket=null;setState('local');resolve({mode:'local',room,playerId,authenticated:!!authToken,accountId});},4200);});}
  function sendPosition(data){const t=performance.now();if(t-lastSentAt<MIN_POSITION_INTERVAL)return false;lastSentAt=t;if(bot){lastPlayerHeight=Math.max(lastPlayerHeight,Number(data?.height)||0);if(lastPlayerHeight>=1500&&!bot.finished){bot.finished=true;if(botTick){clearInterval(botTick);botTick=null;}emit('race:result',{type:'race:result',room,mode:'bot',winnerId:playerId,finishedAt:Date.now(),goal:1500,reason:'finish',rank:null,rankServerAuthoritative:false,players:[{playerId,height:lastPlayerHeight},botPublic()],bot:true});}return true;}return sendRaw({type:'race:position',room,playerId,t:Date.now(),...data});}
  function sendAttack(data){if(bot)return true;return sendRaw({type:'race:attack',room,playerId,t:Date.now(),...data});}function sendFinish(data){if(bot){lastPlayerHeight=Math.max(lastPlayerHeight,Number(data?.height)||0);return true;}return sendRaw({type:'race:finish',room,playerId,t:Date.now(),...data});}function sendReady(data={}){if(bot)return true;return sendRaw({type:'race:ready',room,playerId,t:Date.now(),...data});}
  function disconnect(){manualClose=true;clearReconnect();clearBot();reconnectDeadline=0;reconnectAttempt=0;if(socket){try{socket.close(1000,'leave race')}catch(e){}}socket=null;setState('offline');}
  function snapshot(){return{state,room,playerId,accountId,authenticated:!!authToken,online:state==='online'||state==='bot',bot:!!bot,reconnecting:state==='reconnecting',reconnectDeadline,endpoint:endpoint(),protocolVersion:PROTOCOL_VERSION};}
  window.SkyPuffRaceTransport={connect,disconnect,on,sendPosition,sendAttack,sendFinish,sendReady,snapshot,setAuthToken,ensureGuestIdentity,protocolVersion:PROTOCOL_VERSION,botFallbackMs:BOT_WAIT_MS};
})();


;/* js/steal_my_puff_ui.js */
/* Puffling — Race My Puffling HUD + result UI v1.2
 * Compatibility filename retained for beta loader stability.
 */
(function(){
  let attackBtn=null,root=null,result=null,hudFrame=null,lastHudPaint=0;
  function css(el,styles){Object.assign(el.style,styles);return el;}
  function raf(cb){return typeof requestAnimationFrame==='function'?requestAnimationFrame(cb):setTimeout(()=>cb(Date.now()),50);}
  function caf(id){if(typeof cancelAnimationFrame==='function')cancelAnimationFrame(id);else clearTimeout(id);}
  function hideLegacyHud(){
    try{
      const legacy=(typeof multiplayerHudEl!=='undefined'&&multiplayerHudEl)||document.getElementById('multiplayerHud');
      if(legacy)legacy.style.display='none';
    }catch(e){}
  }
  function ensure(){
    if(root)return;
    root=document.createElement('div');root.id='raceMyPufflingHud';
    css(root,{position:'fixed',left:'50%',top:'78px',transform:'translateX(-50%)',zIndex:'24',display:'none',width:'min(92vw,430px)',pointerEvents:'none'});
    root.innerHTML='<div style="background:rgba(18,45,82,.88);backdrop-filter:blur(8px);border:2px solid rgba(255,255,255,.35);border-radius:18px;padding:10px 12px;color:#fff;box-shadow:0 8px 26px rgba(0,0,0,.2)"><div style="display:flex;justify-content:space-between;gap:10px;font-size:12px;font-weight:1000"><span>YOU <b id="raceYou">0m</b></span><span>🏁 1500m</span><span>GHOST <b id="raceRival">0m</b></span></div><div style="height:12px;background:rgba(255,255,255,.17);border-radius:999px;margin-top:7px;overflow:hidden;position:relative"><div id="raceYouBar" style="position:absolute;left:0;top:0;bottom:0;width:0;background:#62e6a7;border-radius:999px;transition:width .08s linear"></div><div id="raceRivalBar" style="position:absolute;left:0;top:4px;height:4px;width:0;background:rgba(255,255,255,.86);border-radius:999px;transition:width .08s linear"></div></div><div id="raceLeader" style="font-size:10px;font-weight:900;text-align:center;margin-top:5px;opacity:.9">EVEN</div></div>';
    document.body.appendChild(root);

    attackBtn=document.createElement('button');attackBtn.id='raceAttackBtn';attackBtn.className='gold';
    css(attackBtn,{position:'fixed',right:'14px',bottom:'24px',zIndex:'25',display:'none',pointerEvents:'auto',minWidth:'112px',minHeight:'60px',borderRadius:'20px',fontWeight:'1000'});
    attackBtn.onclick=useAttack;document.body.appendChild(attackBtn);

    result=document.createElement('div');result.id='raceMyPufflingResult';result.className='overlay';result.style.display='none';
    result.innerHTML='<div class="card" style="max-width:520px"><h1 id="raceResultTitle" style="font-size:38px">RACE COMPLETE</h1><div id="raceResultBody" class="small" style="margin:12px 0 18px"></div><button id="raceAgainBtn" class="gold">RACE AGAIN</button><button id="raceMenuBtn" class="secondary">MAIN MENU</button></div>';
    document.body.appendChild(result);
    document.getElementById('raceAgainBtn').onclick=()=>{hideResult();if(typeof quickMatch==='function')quickMatch();};
    document.getElementById('raceMenuBtn').onclick=()=>{hideResult();if(typeof showMainMenu==='function')showMainMenu();};
    window.addEventListener('race:attack',e=>{flashAttack(e.detail?.ability);render();});
    window.addEventListener('race:effectStart',e=>effectNotice(e.detail));
    window.addEventListener('race:ghost',()=>{if(root?.style.display!=='none')render();});
    window.addEventListener('race:progress',()=>{if(root?.style.display!=='none')render();});
    window.addEventListener('race:reset',()=>hide());
  }
  function liveHudHeights(s={}){
    try{
      const p=window.SkyPuffRaceNetwork?.liveProgress?.();
      if(p&&Number.isFinite(Number(p.you))&&Number.isFinite(Number(p.rival))){
        return {you:Math.max(0,Number(p.you)),rival:Math.max(0,Number(p.rival)),goal:Math.max(1,Number(p.goal)||1500)};
      }
    }catch(e){}
    let you=Math.max(0,Number(s.youHeight)||0),rival=Math.max(0,Number(s.rivalHeight)||0);
    try{const n=Number(score);if(Number.isFinite(n))you=Math.max(0,n);}catch(e){}
    try{
      const n=Number(window.SkyPuffRaceNetwork?.opponent?.()?.height);
      if(Number.isFinite(n))rival=Math.max(0,n);
      else{
        const fallback=Number(multiplayerOpponentScore);
        if(Number.isFinite(fallback))rival=Math.max(0,fallback);
      }
    }catch(e){
      try{const n=Number(window.SkyPuffRaceGhost?.status?.().last?.height);if(Number.isFinite(n))rival=Math.max(0,n);}catch(_){}
    }
    return {you,rival,goal:Math.max(1,Number(s.goal)||1500)};
  }
  function startHudLoop(){
    if(hudFrame!==null)return;lastHudPaint=0;
    const frame=ts=>{
      hudFrame=null;
      if(!root||root.style.display==='none')return;
      const t=Number(ts)||Date.now();
      if(!lastHudPaint||t-lastHudPaint>=33){lastHudPaint=t;render();}
      hudFrame=raf(frame);
    };
    hudFrame=raf(frame);
  }
  function stopHudLoop(){if(hudFrame!==null){caf(hudFrame);hudFrame=null;}lastHudPaint=0;}
  function show(){ensure();hideLegacyHud();root.style.display='block';attackBtn.style.display='block';render();startHudLoop();}
  function hide(){ensure();root.style.display='none';attackBtn.style.display='none';stopHudLoop();}
  function hideResult(){ensure();result.style.display='none';}
  function render(){
    ensure();hideLegacyHud();const R=window.SkyPuffRace,s=R?.snapshot?.()||{};
    const h=liveHudHeights(s),youH=h.you,rivalH=h.rival,goal=h.goal;
    const you=document.getElementById('raceYou'),rival=document.getElementById('raceRival'),yb=document.getElementById('raceYouBar'),rb=document.getElementById('raceRivalBar'),lead=document.getElementById('raceLeader');
    if(you)you.textContent=Math.floor(youH)+'m';if(rival)rival.textContent=Math.floor(rivalH)+'m';
    if(yb)yb.style.width=Math.max(0,Math.min(100,youH/goal*100))+'%';if(rb)rb.style.width=Math.max(0,Math.min(100,rivalH/goal*100))+'%';
    if(lead)lead.textContent=youH>rivalH?'YOU LEAD':youH<rivalH?'GHOST LEADS':'EVEN';
    const a=s.ability||R?.abilityFor?.(s.selectedPufflingId),left=Number.isFinite(Number(s.attacksRemaining))?Number(s.attacksRemaining):(R?.MAX_ATTACKS||3),elapsed=Date.now()-(Number(s.lastAttackAt)||0),cd=Math.max(0,(R?.ATTACK_COOLDOWN_MS||4000)-elapsed);
    if(left<=0){attackBtn.disabled=true;attackBtn.innerHTML=`${a?.icon||'⚡'}<br>EMPTY`;}
    else if(cd>0&&s.lastAttackAt){attackBtn.disabled=true;attackBtn.innerHTML=`${a?.icon||'⚡'} ${a?.name||'ATTACK'}<br>${(cd/1000).toFixed(1)}s`;}
    else{attackBtn.disabled=false;attackBtn.innerHTML=`${a?.icon||'⚡'} ${a?.name||'ATTACK'}<br>${left} LEFT`;}
  }
  function useAttack(){const r=window.SkyPuffRace?.attack?.();if(!r?.ok){render();return;}if(typeof showToast==='function')showToast(`${r.ability?.icon||'⚡'} ${r.ability?.name||'ATTACK'}!`);}
  function flashAttack(a){if(!attackBtn)return;attackBtn.animate?.([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:220});}
  function effectNotice(e){if(typeof showToast==='function'&&e)showToast(`${e.icon||'⚠️'} ${e.name||String(e.type||'Effect').toUpperCase()}!`);}
  function showResult(state){
    ensure();hide();const s=state||window.SkyPuffRace?.snapshot?.();if(!s)return;
    result.style.display='flex';const win=s.winner==='you';
    document.getElementById('raceResultTitle').textContent=win?'YOU WIN! 🏆':'YOU LOSE!';
    const secs=s.finishedAt&&s.startedAt?((s.finishedAt-s.startedAt)/1000).toFixed(1):'—';
    document.getElementById('raceResultBody').innerHTML=`Time: <b>${secs}s</b><br>You: <b>${Math.floor(s.youHeight||0)}m</b> · Ghost: <b>${Math.floor(s.rivalHeight||0)}m</b><br>Attacks used: <b>${s.attacksUsed||0}/${window.SkyPuffRace?.MAX_ATTACKS||3}</b> · Falls: <b>${s.falls||0}</b>`;
  }
  window.SkyPuffRaceUI={ensure,show,hide,render,showResult,hideResult,liveHudHeights,hideLegacyHud};
  window.SkyPuffStealUI={show:()=>{}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
})();


;/* js/race_ranked.js */
/* Puffling — Ranked Quick Race v2.0
 * Server-authoritative Quick Race rank. Friend/local races never change MMR.
 */
(function(){
  const KEY='pufflingQuickRaceRankV1';
  const START_RATING=1000,MIN_RATING=600;
  const TIERS=[{name:'Bronze',min:0,icon:'🟤'},{name:'Silver',min:1000,icon:'⚪'},{name:'Gold',min:1200,icon:'🟡'},{name:'Platinum',min:1400,icon:'🔷'},{name:'Diamond',min:1600,icon:'💎'},{name:'Master',min:1800,icon:'👑'},{name:'Champion',min:2000,icon:'🏆'}];
  let currentMode='idle',currentRoom='',lastUpdate=null,transportBound=false;
  function finite(v,f=0){const n=Number(v);return Number.isFinite(n)?n:f;}
  function normalize(raw={}){const rating=Math.max(MIN_RATING,Math.round(finite(raw.rating,START_RATING)));return{rating,wins:Math.max(0,Math.floor(finite(raw.wins,0))),losses:Math.max(0,Math.floor(finite(raw.losses,0))),games:Math.max(0,Math.floor(finite(raw.games,0))),streak:Math.max(0,Math.floor(finite(raw.streak,0))),bestRating:Math.max(rating,Math.round(finite(raw.bestRating,rating))),lastDelta:Math.round(finite(raw.lastDelta,0)),lastRaceId:String(raw.lastRaceId||'')};}
  function load(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return normalize();}}
  function saveState(s){s=normalize(s);try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}return s;}
  function rankFor(rating){const r=Math.max(0,Math.round(finite(rating,START_RATING)));let i=0;for(let x=0;x<TIERS.length;x++)if(r>=TIERS[x].min)i=x;const tier=TIERS[i],next=TIERS[i+1]||null;if(!next)return{...tier,division:'',label:`${tier.icon} ${tier.name}`,progress:1,nextMin:null,nextName:null};const span=Math.max(1,next.min-tier.min),within=Math.max(0,Math.min(span-1,r-tier.min)),third=span/3,division=within<third?'III':within<third*2?'II':'I';return{...tier,division,label:`${tier.icon} ${tier.name} ${division}`,progress:Math.max(0,Math.min(1,within/span)),nextMin:next.min,nextName:next.name};}
  function profile(){const s=load();return{...s,rank:rankFor(s.rating)};}
  function mineId(){try{return window.SkyPuffRaceTransport?.snapshot?.().playerId||'';}catch(e){return '';}}
  function applyServerResult(message){
    if(currentMode!=='quick'||!message?.rankServerAuthoritative||!message?.rank)return{applied:false,reason:'server-rank-required',profile:profile()};
    const raceId=String(message.room||currentRoom||'');if(!raceId)return{applied:false,reason:'missing-race-id',profile:profile()};
    const mine=mineId(),me=Array.isArray(message.players)?message.players.find(p=>p?.playerId===mine):null;
    const profiles=message.rank.profiles||{};let serverProfile=null;
    if(me?.accountId&&profiles[me.accountId])serverProfile=profiles[me.accountId];
    if(!serverProfile&&me?.rankRating!=null){const before=load();serverProfile={...before,rating:me.rankRating};}
    if(!serverProfile)return{applied:false,reason:'missing-server-profile',profile:profile()};
    const before=load();if(before.lastRaceId===raceId)return{applied:false,reason:'duplicate-result',profile:profile()};
    const after=saveState({...before,...serverProfile,lastRaceId:raceId,lastDelta:Math.round(finite(serverProfile.rating,before.rating)-before.rating)});
    lastUpdate={applied:true,won:message.winnerId===mine,delta:after.lastDelta,before:{...before,rank:rankFor(before.rating)},after:{...after,rank:rankFor(after.rating)},raceId,at:Date.now(),serverAuthoritative:true};
    try{window.dispatchEvent(new CustomEvent('race:rankUpdate',{detail:lastUpdate}));}catch(e){}render();return lastUpdate;
  }
  function resultRankHtml(){if(currentMode!=='quick')return'';if(lastUpdate&&Date.now()-lastUpdate.at<15000){const u=lastUpdate,a=u.after,sign=u.delta>0?'+':'';return`<div id="raceRankResult" style="margin-top:14px;padding:12px;border-radius:15px;background:rgba(255,255,255,.72);font-weight:900"><div style="font-size:15px">${a.rank.label}</div><div style="margin-top:4px">MMR <b>${a.rating}</b> <span style="font-weight:1000">(${sign}${u.delta})</span></div><div style="font-size:11px;opacity:.72;margin-top:3px">Server verified • ${a.wins}W / ${a.losses}L</div></div>`;}return'<div id="raceRankResult" style="margin-top:14px;padding:12px;border-radius:15px;background:rgba(255,255,255,.72);font-size:12px;font-weight:900">Rank unchanged — verified server result required.</div>';}
  function decorateResult(){if(typeof document==='undefined')return;const body=document.getElementById('raceResultBody');if(!body)return;body.querySelector('#raceRankResult')?.remove();const html=resultRankHtml();if(html)body.insertAdjacentHTML('beforeend',html);}
  function ensureCard(){const card=document.querySelector('#multiplayerMenu .card');if(!card)return null;let box=document.getElementById('raceRankPanel');if(!box){box=document.createElement('div');box.id='raceRankPanel';box.style.cssText='margin:10px 0 12px;padding:12px 14px;border-radius:17px;background:rgba(255,255,255,.78);border:1px solid rgba(63,136,190,.2);box-shadow:0 7px 20px rgba(37,94,137,.08)';const quick=document.getElementById('quickMatchBtn');if(quick)quick.insertAdjacentElement('beforebegin',box);else card.appendChild(box);}return box;}
  function render(){if(typeof document==='undefined')return;const p=profile(),box=ensureCard();if(!box)return;const next=p.rank.nextMin?`${Math.max(0,p.rank.nextMin-p.rating)} MMR to ${p.rank.nextName}`:'Top rank';box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><div><div style="font-size:11px;font-weight:1000;letter-spacing:.8px;opacity:.62">QUICK RACE RANK</div><div style="font-size:21px;font-weight:1000;margin-top:2px">${p.rank.label}</div></div><div style="text-align:right"><div style="font-size:19px;font-weight:1000">${p.rating}</div><div style="font-size:10px;font-weight:900;opacity:.64">MMR</div></div></div><div style="height:7px;background:rgba(40,80,120,.12);border-radius:999px;margin-top:9px;overflow:hidden"><div style="height:100%;width:${Math.round(p.rank.progress*100)}%;background:linear-gradient(90deg,#63b7ff,#9b75ff);border-radius:999px"></div></div><div style="display:flex;justify-content:space-between;gap:8px;margin-top:7px;font-size:10px;font-weight:900;opacity:.72"><span>${p.wins}W • ${p.losses}L</span><span>${next}</span></div>`;}
  function bindTransport(){if(transportBound)return;const T=window.SkyPuffRaceTransport;if(!T)return;transportBound=true;T.on('race:matched',m=>{currentMode=m?.mode==='quick'?'quick':'friend';currentRoom=String(m?.room||'');render();});T.on('race:result',m=>{if(currentMode!=='quick')return;applyServerResult(m);setTimeout(decorateResult,0);});}
  function patchGameHooks(){if(typeof window.startMultiplayerRace==='function'&&!window.startMultiplayerRace.__rankWrapped){const base=window.startMultiplayerRace,wrapped=function(type){currentMode=type==='random'?'quick':'friend';currentRoom='';lastUpdate=null;return base.apply(this,arguments);};wrapped.__rankWrapped=true;window.startMultiplayerRace=wrapped;}if(window.SkyPuffRaceUI?.showResult&&!window.SkyPuffRaceUI.showResult.__rankWrapped){const base=window.SkyPuffRaceUI.showResult,wrapped=function(){const out=base.apply(this,arguments);decorateResult();return out;};wrapped.__rankWrapped=true;window.SkyPuffRaceUI.showResult=wrapped;}if(typeof window.openMultiplayer==='function'&&!window.openMultiplayer.__rankWrapped){const base=window.openMultiplayer,wrapped=function(){const out=base.apply(this,arguments);setTimeout(render,0);return out;};wrapped.__rankWrapped=true;window.openMultiplayer=wrapped;}}
  function init(){bindTransport();patchGameHooks();render();}
  window.SkyPuffQuickRank={profile,rankFor,applyServerResult,render,decorateResult,get lastUpdate(){return lastUpdate;},START_RATING,MIN_RATING,rankServerAuthoritative:true,version:2};
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,40));else setTimeout(init,40);}else{bindTransport();patchGameHooks();}
})();


;/* js/steal_my_puff_multiplayer_bridge.js */
/* Puffling — Multiplayer -> Race My Puffling bridge v1.6
 * Compatibility filename retained for the current beta loader.
 */
(function(){
  const baseStart=typeof startMultiplayerRace==='function'?startMultiplayerRace:null;
  const baseTick=typeof multiplayerTick==='function'?multiplayerTick:null;
  const baseFinish=typeof finishMultiplayerRace==='function'?finishMultiplayerRace:null;
  if(!baseStart||!baseTick||!baseFinish)return;

  let onlineOpponent=null;
  let onlineMode=false;
  let transportBound=false;
  let lastLocalHeight=0;
  let serverResult=null;
  let awaitingServerStart=false;
  let countdownTimer=null;
  let reconnectDisplayTimer=null;
  let serverStartAt=0;
  let reconnecting=false;
  let opponentReconnectDeadline=0;

  function currentPufflingId(){
    try{
      const F=window.SkyPuffFusion,st=F?.load?.();
      return st?.active||st?.selected||st?.equipped||Object.keys(st?.owned||{})[0]||null;
    }catch(e){return null;}
  }
  function currentSkinId(){
    try{return typeof save!=='undefined'&&save?.skin?String(save.skin):null;}catch(e){return null;}
  }
  function currentEvolutionStage(id=currentPufflingId()){
    try{return Math.max(0,Math.min(2,Number(window.SkyPuffPufflingEvolution?.stageFor?.(id))||0));}catch(e){return 0;}
  }
  function currentPlayerId(){
    try{
      let id=localStorage.getItem('skyPuffRacePlayerId');
      if(!id){id='p_'+Math.random().toString(36).slice(2,10);localStorage.setItem('skyPuffRacePlayerId',id);}
      return id;
    }catch(e){return 'p_'+Math.random().toString(36).slice(2,10);}
  }
  function roomFor(type){return multiplayerRoom||(type==='random'?'quickmatch':'room_'+Math.random().toString(36).slice(2,8));}
  function visualProfile(){
    const id=currentPufflingId();
    return {pufflingId:id,skin:currentSkinId(),evolutionStage:currentEvolutionStage(id)};
  }
  function ensureCountdown(){
    let el=document.getElementById('raceCountdownOverlay');
    if(el)return el;
    el=document.createElement('div');el.id='raceCountdownOverlay';
    el.style.cssText='display:none;position:fixed;inset:0;z-index:40;pointer-events:none;align-items:center;justify-content:center;background:rgba(21,58,103,.18);backdrop-filter:blur(1px)';
    el.innerHTML='<div id="raceCountdownText" style="font-size:clamp(48px,15vw,108px);font-weight:1000;color:white;text-align:center;white-space:pre-line;text-shadow:0 7px 28px rgba(0,0,0,.38);transform:scale(1)">3</div>';
    document.body.appendChild(el);return el;
  }
  function clearOverlayTimers(){
    if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}
    if(reconnectDisplayTimer){clearInterval(reconnectDisplayTimer);reconnectDisplayTimer=null;}
  }
  function hideCountdown(){clearOverlayTimers();const el=document.getElementById('raceCountdownOverlay');if(el)el.style.display='none';}
  function setCountdownText(text){const el=ensureCountdown(),txt=document.getElementById('raceCountdownText');el.style.display='flex';if(txt)txt.textContent=text;}
  function unlockOnlineRace(){
    if(!multiplayerMode)return;
    awaitingServerStart=false;reconnecting=false;opponentReconnectDeadline=0;multiplayerState='racing';running=true;paused=false;lastTime=performance.now();
    setCountdownText('GO!');if(typeof showToast==='function')showToast('🏁 GO!');setTimeout(hideCountdown,650);requestAnimationFrame(loop);
  }
  function scheduleServerCountdown(startAt){
    clearOverlayTimers();serverStartAt=Number(startAt)||Date.now();awaitingServerStart=true;running=false;paused=false;multiplayerState='countdown';
    const render=()=>{const left=serverStartAt-Date.now();if(left<=0){if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;}unlockOnlineRace();return;}const n=Math.max(1,Math.ceil(left/1000));setCountdownText(String(Math.min(3,n)));};
    render();countdownTimer=setInterval(render,50);
  }
  function showReconnectWait(deadline,ownConnection=false){
    clearOverlayTimers();reconnecting=true;awaitingServerStart=true;running=false;paused=false;multiplayerState='reconnecting';
    const until=Number(deadline)||Date.now()+11000;
    const render=()=>{const sec=Math.max(0,Math.ceil((until-Date.now())/1000));setCountdownText(ownConnection?`↻\n${sec}s`:`⏳\n${sec}s`);};
    render();reconnectDisplayTimer=setInterval(render,100);
    if(multiplayerStatusEl)multiplayerStatusEl.textContent=ownConnection?'Tilkoblingen falt ut — prøver å koble til igjen…':'Motstanderen mistet forbindelsen — racet er midlertidig satt på pause.';
  }
  function failOnlineStart(reason='connection_failed'){
    hideCountdown();awaitingServerStart=false;reconnecting=false;onlineMode=false;onlineOpponent=null;serverResult=null;
    multiplayerMode=false;multiplayerState='connection_failed';running=false;paused=false;
    if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}
    if(multiplayerHudEl)multiplayerHudEl.style.display='none';
    try{window.SkyPuffRaceTransport?.disconnect?.();}catch(e){}
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
    const msg=reason==='race_auth_failed'||reason==='race_auth_required'||reason==='rank_auth_required'?'Kunne ikke bekrefte spillerkontoen. Prøv igjen.':'Kunne ikke koble til Race-serveren. Prøv igjen når forbindelsen er tilbake.';
    if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=msg;
    if(typeof showToast==='function')showToast('⚠️ '+msg);
    window.dispatchEvent?.(new CustomEvent('race:connectionFailed',{detail:{reason}}));
  }
  function opponentSnapshot(p,state='idle'){
    return {x:Number(p?.x)||0,y:p?.y==null?null:Number(p.y),worldY:p?.worldY==null?null:Number(p.worldY),height:Math.max(0,Number(p?.height)||0),state,pufflingId:p?.pufflingId||null,skin:p?.skin||null,evolutionStage:Math.max(0,Math.min(2,Number(p?.evolutionStage)||0)),t:Number(p?.t)||Date.now()};
  }
  function applyOpponentFromPlayers(players){
    const mine=window.SkyPuffRaceTransport?.snapshot?.().playerId;
    const p=Array.isArray(players)?players.find(x=>x&&x.playerId!==mine):null;if(!p)return;
    onlineOpponent=opponentSnapshot(p,'idle');multiplayerOpponentScore=onlineOpponent.height;window.dispatchEvent(new CustomEvent('race:ghost',{detail:onlineOpponent}));
  }
  function loseByDisconnect(){
    if(!multiplayerMode)return;
    hideCountdown();reconnecting=false;awaitingServerStart=false;
    const R=window.SkyPuffRace,T=window.SkyPuffRaceTransport;let s=R?.snapshot?.()||{};s.active=false;s.finishedAt=Date.now();s.winner='rival';s.disconnectLoss=true;
    multiplayerMode=false;multiplayerState='finished';running=false;paused=false;if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';
    T?.disconnect?.();onlineMode=false;onlineOpponent=null;if(typeof showToast==='function')showToast('Forbindelsen kom ikke tilbake i tide.');window.SkyPuffRaceUI?.showResult?.(s);
  }
  function bindTransport(){
    if(transportBound)return;transportBound=true;const T=window.SkyPuffRaceTransport;if(!T)return;
    T.on('state',m=>{
      if(m?.state==='online'||m?.state==='bot'){onlineMode=true;reconnecting=false;return;}
      if(m?.state==='reconnecting'){onlineMode=false;if(multiplayerMode)showReconnectWait(m.reconnectDeadline,true);return;}
      if(m?.state==='reconnect_failed'){onlineMode=false;if(multiplayerMode)loseByDisconnect();return;}
      if(['connect_failed','server_rejected','race_auth_failed'].includes(m?.state)&&multiplayerMode)failOnlineStart(m?.code||m?.state);
    });
    T.on('race:matched',m=>{if(m?.room)multiplayerRoom=m.room;reconnecting=false;if(typeof showToast==='function')showToast(m?.mode==='quick'?'🔎 Motstander funnet!':'👥 Race room ready');if(multiplayerStatusEl)multiplayerStatusEl.textContent='Begge spillere må være klare før nedtellingen starter.';});
    T.on('race:start',m=>{onlineMode=true;scheduleServerCountdown(m?.serverStartAt);});
    T.on('race:notStarted',m=>{if(m?.serverStartAt)scheduleServerCountdown(m.serverStartAt);});
    T.on('race:paused',()=>{if(multiplayerMode&&!reconnecting)showReconnectWait(opponentReconnectDeadline||Date.now()+11000,false);});
    T.on('race:resumed',m=>{if(m?.room)multiplayerRoom=m.room;applyOpponentFromPlayers(m?.players);reconnecting=true;onlineMode=true;if(multiplayerStatusEl)multiplayerStatusEl.textContent='Tilkoblet igjen — synkroniserer racet…';if(m?.winnerId){serverResult={...m,finishedAt:Date.now()};finishMultiplayerRace();}});
    T.on('race:resume',m=>{reconnecting=false;opponentReconnectDeadline=0;onlineMode=true;applyOpponentFromPlayers(m?.players);if(multiplayerStatusEl)multiplayerStatusEl.textContent='Begge er tilbake — fortsetter racet…';scheduleServerCountdown(m?.serverResumeAt||Date.now()+1000);});
    T.on('race:opponentDisconnected',m=>{if(!multiplayerMode)return;opponentReconnectDeadline=Number(m?.reconnectDeadline)||Date.now()+12000;showReconnectWait(opponentReconnectDeadline,false);if(typeof showToast==='function')showToast('Motstanderen mistet nettet — racet er pauset.');});
    T.on('race:opponentReconnected',()=>{if(typeof showToast==='function')showToast('Motstanderen er tilbake!');if(multiplayerStatusEl)multiplayerStatusEl.textContent='Motstanderen er tilbake — synkroniserer…';});
    T.on('race:position',m=>{
      if(!m||m.playerId===T.snapshot().playerId)return;
      onlineOpponent=opponentSnapshot(m,m.state||'jumping');multiplayerOpponentScore=Math.max(0,onlineOpponent.height);window.dispatchEvent(new CustomEvent('race:ghost',{detail:onlineOpponent}));
    });
    T.on('race:attack',m=>{if(!m||m.playerId===T.snapshot().playerId)return;window.SkyPuffRace?.receiveAttack?.(m.ability||m.abilityId,m);window.dispatchEvent(new CustomEvent('race:incomingAttack',{detail:m}));});
    T.on('race:attackRejected',m=>{if(typeof showToast==='function')showToast(m?.reason==='cooldown'?'⏳ Attack on cooldown':'⚠️ Attack rejected');});
    T.on('race:error',m=>{if(reconnecting&&(m?.code==='resume_expired'||m?.code==='room_full'))loseByDisconnect();else if(multiplayerMode&&['race_auth_required','rank_auth_required','unsupported_protocol','race_inventory_unavailable','puffling_not_owned'].includes(m?.code))failOnlineStart(m.code);});
    T.on('race:result',m=>{if(!m?.winnerId)return;serverResult=m;if(multiplayerMode)finishMultiplayerRace();});
    T.on('race:opponentLeft',()=>{if(multiplayerMode&&typeof showToast==='function')showToast('Motstanderen forlot racet.');});
  }
  function connectTransport(type){
    bindTransport();const T=window.SkyPuffRaceTransport;if(!T){failOnlineStart('transport_missing');return;}
    T.connect({room:roomFor(type),playerId:currentPlayerId()}).then(info=>{
      onlineMode=info?.mode==='online';
      if(!onlineMode){failOnlineStart(info?.error||info?.mode||'connection_failed');return;}
      awaitingServerStart=true;multiplayerState='waiting_start';running=false;T.sendReady({...visualProfile(),mode:type});
      if(typeof showToast==='function')showToast('🌐 Live Race connection ready');if(multiplayerStatusEl)multiplayerStatusEl.textContent='Venter på motstander…';setCountdownText('…');
    }).catch(e=>failOnlineStart(String(e?.message||e||'connection_failed')));
  }

  startMultiplayerRace=function(type){
    baseStart(type);if(!multiplayerMode)return;multiplayerRaceSeconds=9999;multiplayerEndAt=Date.now()+multiplayerRaceSeconds*1000;
    onlineOpponent=null;onlineMode=false;lastLocalHeight=0;serverResult=null;awaitingServerStart=true;serverStartAt=0;reconnecting=false;opponentReconnectDeadline=0;
    const R=window.SkyPuffRace;R?.start?.({selectedPufflingId:currentPufflingId()});window.SkyPuffRaceUI?.show?.();running=false;multiplayerState='connecting';connectTransport(type);
    if(mpTimerEl)mpTimerEl.textContent='1500m';if(multiplayerStatusEl)multiplayerStatusEl.textContent='Kobler til Race My Puffling…';if(typeof showToast==='function')showToast('🏁 RACE MY PUFFLING — FIRST TO 1500m!');
  };

  multiplayerTick=function(){
    if(!multiplayerMode||multiplayerState!=='racing'||awaitingServerStart||reconnecting)return;
    const R=window.SkyPuffRace,s=R?.snapshot?.();if(!R||!s)return baseTick();
    const you=Math.floor(score),T=window.SkyPuffRaceTransport;
    const px=typeof player!=='undefined'&&player?Number(player.x)||0:0;
    const py=typeof player!=='undefined'&&player?Number(player.y)||0:0;
    const worldY=typeof cameraY==='number'?py+cameraY:null;
    const pstate=typeof player!=='undefined'&&player?(player.vy<0?'jumping':player.vy>0?'falling':'idle'):'jumping';
    T?.sendPosition?.({x:px,y:py,worldY,height:you,state:pstate,...visualProfile()});

    if(onlineOpponent)multiplayerOpponentScore=Math.max(0,Number(onlineOpponent.height)||0);

    const rival=Math.floor(multiplayerOpponentScore);
    if(mpYouEl)mpYouEl.textContent=you+'m';if(mpRivalEl)mpRivalEl.textContent=rival+'m';if(mpTimerEl)mpTimerEl.textContent='🏁1500m';
    const next=R.updateHeights?.(you,rival);window.SkyPuffRaceUI?.render?.();
    if(you>=1500&&lastLocalHeight<1500)T?.sendFinish?.({height:you,...visualProfile()});lastLocalHeight=you;
    if(next&&!next.active){if(onlineMode&&!serverResult){if(typeof showToast==='function')showToast('🏁 Venter på serverresultat…');return;}finishMultiplayerRace();}
  };

  finishMultiplayerRace=function(){
    if(!multiplayerMode)return;const R=window.SkyPuffRace,T=window.SkyPuffRaceTransport;if((onlineMode||reconnecting)&&!serverResult)return;
    hideCountdown();awaitingServerStart=false;reconnecting=false;opponentReconnectDeadline=0;
    let s=R?.snapshot?.();const you=Math.floor(score),rival=Math.floor(multiplayerOpponentScore);if(!s)R?.start?.({selectedPufflingId:currentPufflingId()});s=R?.updateHeights?.(you,rival)||R?.snapshot?.();
    if(serverResult){const mine=T?.snapshot?.().playerId;s=s||{};s.active=false;s.finishedAt=Number(serverResult.finishedAt)||Date.now();s.winner=serverResult.winnerId===mine?'you':'rival';s.finishReason=serverResult.reason||'finish';}
    else if(s?.active){const winner=you>=1500&&rival<1500?'you':rival>=1500&&you<1500?'rival':you>=rival?'you':'rival';s=R?.finish?.(winner)||s;}
    multiplayerMode=false;multiplayerState='finished';running=false;if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}if(multiplayerHudEl)multiplayerHudEl.style.display='none';T?.disconnect?.();onlineMode=false;onlineOpponent=null;window.SkyPuffRaceUI?.showResult?.(s);
  };

  window.addEventListener('race:attack',function(ev){
    if(!multiplayerMode||multiplayerState!=='racing'||awaitingServerStart||reconnecting)return;
    const a=ev.detail?.ability;if(!a)return;const T=window.SkyPuffRaceTransport;
    if(onlineMode)T?.sendAttack?.({ability:a,abilityId:a.id||a.abilityType||a.name});
  });

  window.SkyPuffRaceNetwork={
    isOnline:()=>onlineMode,
    isReconnecting:()=>reconnecting,
    opponent:()=>onlineOpponent?{...onlineOpponent}:null,
    serverResult:()=>serverResult?{...serverResult}:null,
    awaitingStart:()=>awaitingServerStart,
    serverStartAt:()=>serverStartAt,
    opponentReconnectDeadline:()=>opponentReconnectDeadline,
    transport:()=>window.SkyPuffRaceTransport?.snapshot?.()||null
  };
})();


;/* js/race_course_sync.js */
/* Puffling — server-seeded Race course sync v1.0 */
(function(){
  const C=window.SkyPuffRaceCourse,T=window.SkyPuffRaceTransport;
  if(!C||!T)return;
  let roomSeed='';
  function remember(m){if(m?.courseSeed)roomSeed=String(m.courseSeed);return roomSeed;}
  function rebuild(seed){
    seed=String(seed||roomSeed||'');if(!seed)return false;
    roomSeed=seed;C.activate(seed);C.begin(typeof H==='number'?H*.82:692);
    if(typeof reset==='function')reset();
    try{multiplayerOpponentScore=0;}catch(e){}
    window.dispatchEvent(new CustomEvent('race:courseReady',{detail:{courseSeed:seed,courseVersion:C.version}}));
    return true;
  }
  T.on('race:matched',remember);
  T.on('race:notStarted',remember);
  T.on('race:resumed',remember);
  T.on('race:resume',remember);
  T.on('race:start',m=>rebuild(remember(m)));
  T.on('race:result',()=>setTimeout(()=>C.deactivate(),0));
  T.on('reconnect_failed',()=>C.deactivate());

  if(typeof window.startMultiplayerRace==='function'&&!window.startMultiplayerRace.__courseWrapped){
    const base=window.startMultiplayerRace;
    const wrapped=function(){C.deactivate();roomSeed='';return base.apply(this,arguments);};
    wrapped.__courseWrapped=true;window.startMultiplayerRace=wrapped;
  }
  if(typeof window.finishMultiplayerRace==='function'&&!window.finishMultiplayerRace.__courseWrapped){
    const base=window.finishMultiplayerRace;
    const wrapped=function(){const out=base.apply(this,arguments);setTimeout(()=>C.deactivate(),0);return out;};
    wrapped.__courseWrapped=true;window.finishMultiplayerRace=wrapped;
  }
  window.SkyPuffRaceCourseSync={rebuild,remember,get seed(){return roomSeed;}};
})();


;/* js/race_progress_sync.js */
/* Puffling — shared live Race progress source v1.0 */
(function(){
  function finite(v){const n=Number(v);return Number.isFinite(n)?n:null;}
  function liveProgress(){
    const snap=window.SkyPuffRace?.snapshot?.()||{};
    let you=finite(snap.youHeight)||0,rival=finite(snap.rivalHeight)||0;
    try{const n=finite(score);if(n!==null)you=Math.max(0,n);}catch(e){}
    try{
      const opponent=window.SkyPuffRaceNetwork?.opponent?.();
      const online=finite(opponent?.height);
      if(online!==null)rival=Math.max(0,online);
      else{
        const local=finite(multiplayerOpponentScore);
        if(local!==null)rival=Math.max(0,local);
      }
    }catch(e){
      try{const g=finite(window.SkyPuffRaceGhost?.status?.().last?.height);if(g!==null)rival=Math.max(0,g);}catch(_){}
    }
    return {
      you,rival,goal:Math.max(1,finite(snap.goal)||1500),
      online:!!window.SkyPuffRaceNetwork?.isOnline?.(),
      reconnecting:!!window.SkyPuffRaceNetwork?.isReconnecting?.(),
      opponentUpdatedAt:finite(window.SkyPuffRaceNetwork?.opponent?.()?.t)||0
    };
  }
  function publish(){
    const detail=liveProgress();
    try{window.dispatchEvent(new CustomEvent('race:progress',{detail}));}catch(e){}
    return detail;
  }
  function hideLegacy(){
    const legacy=document.getElementById('multiplayerHud');
    const race=document.getElementById('raceMyPufflingHud');
    if(legacy&&race&&race.style.display!=='none')legacy.style.display='none';
  }
  const install=()=>{
    const N=window.SkyPuffRaceNetwork;
    if(N)N.liveProgress=liveProgress;
    window.SkyPuffRaceProgress={liveProgress,publish,hideLegacy};
    hideLegacy();
  };
  window.addEventListener('race:ghost',()=>{install();publish();hideLegacy();});
  window.addEventListener('race:start',()=>{install();publish();setTimeout(hideLegacy,0);});
  window.addEventListener('race:reset',hideLegacy);
  install();
})();


;/* js/race_ghost_interpolation.js */
/* Sky Puff — Race My Puffling ghost interpolation v0.2
 * Visual-only opponent ghost. Never participates in collisions or gameplay state.
 */
(function(){
  const BUFFER_MS=90;
  const STALE_MS=900;
  const MAX_SAMPLES=16;
  const samples=[];
  let attackPulseUntil=0;
  let lastSample=null;

  function now(){return typeof performance!=='undefined'?performance.now():Date.now();}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function lerp(a,b,t){return a+(b-a)*t;}
  function finiteOrNull(v){if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null;}
  function lerpMaybe(a,b,t){if(Number.isFinite(a)&&Number.isFinite(b))return lerp(a,b,t);return Number.isFinite(b)?b:Number.isFinite(a)?a:null;}
  function reset(){samples.length=0;lastSample=null;attackPulseUntil=0;}
  function push(raw){
    if(!raw)return;
    const s={
      receivedAt:now(),
      x:Number(raw.x)||0,
      y:finiteOrNull(raw.y),
      worldY:finiteOrNull(raw.worldY),
      height:Math.max(0,Number(raw.height)||0),
      state:String(raw.state||'jumping'),
      pufflingId:raw.pufflingId||null,
      skin:raw.skin||null,
      evolutionStage:Math.max(0,Math.min(2,Number(raw.evolutionStage)||0))
    };
    samples.push(s);
    while(samples.length>MAX_SAMPLES)samples.shift();
  }
  function sample(){
    if(!samples.length)return null;
    const t=now()-BUFFER_MS;
    while(samples.length>2&&samples[1].receivedAt<t)samples.shift();
    const a=samples[0],b=samples[1]||a;
    if(now()-b.receivedAt>STALE_MS)return null;
    if(a===b){lastSample={...b};return lastSample;}
    const span=Math.max(1,b.receivedAt-a.receivedAt);
    const f=clamp((t-a.receivedAt)/span,0,1);
    lastSample={
      receivedAt:lerp(a.receivedAt,b.receivedAt,f),
      x:lerp(a.x,b.x,f),
      y:lerpMaybe(a.y,b.y,f),
      worldY:lerpMaybe(a.worldY,b.worldY,f),
      height:lerp(a.height,b.height,f),
      state:f<.5?a.state:b.state,
      pufflingId:b.pufflingId||a.pufflingId,
      skin:b.skin||a.skin,
      evolutionStage:b.evolutionStage||a.evolutionStage||0
    };
    return lastSample;
  }
  function pufflingInfo(id){
    try{
      const direct=window.SkyPuffPufflingGameplay?.getPuff?.(id);if(direct)return direct;
      const F=window.SkyPuffFusion;
      return [...Object.values(F?.BASE||{}),...Object.values(F?.FUSIONS||{})].find(p=>p.id===id)||null;
    }catch(e){return null;}
  }
  function ghostBodyColor(s){
    try{
      if(s?.skin&&typeof skins!=='undefined'&&skins[s.skin]?.body)return skins[s.skin].body;
    }catch(e){}
    return '#dff5ff';
  }
  function screenYFor(s){
    try{
      if(Number.isFinite(s.worldY)&&typeof cameraY==='number')return s.worldY-cameraY;
      if(Number.isFinite(s.y)&&typeof player!=='undefined')return player.y+(s.y-player.y);
      if(typeof player!=='undefined'&&typeof score==='number')return player.y-(s.height-score)*10;
    }catch(e){}
    return null;
  }
  function drawGhost(){
    try{
      if(typeof multiplayerMode==='undefined'||!multiplayerMode)return;
      if(!window.SkyPuffRaceNetwork?.isOnline?.())return;
      if(typeof ctx==='undefined'||typeof player==='undefined'||typeof score!=='number'||typeof H==='undefined')return;
      const s=sample();if(!s)return;
      const y=screenYFor(s);if(!Number.isFinite(y)||y<-90||y>H+90)return;
      const p=pufflingInfo(s.pufflingId);
      const pulse=attackPulseUntil>now()?1.13:1;
      const phase=now()/150;
      const animY=s.state==='jumping'?-5-Math.abs(Math.sin(phase))*4:s.state==='falling'?3+Math.abs(Math.sin(phase))*3:Math.sin(phase)*2;
      const rot=s.state==='jumping'?-0.06:s.state==='falling'?.06:0;
      ctx.save();
      ctx.translate(s.x,y+animY);ctx.rotate(rot);ctx.scale(pulse,pulse);
      ctx.globalAlpha=.42;
      ctx.fillStyle=ghostBodyColor(s);ctx.strokeStyle='rgba(120,220,255,.9)';ctx.lineWidth=3;
      ctx.shadowColor='rgba(90,210,255,.75)';ctx.shadowBlur=18;
      ctx.beginPath();
      ctx.arc(-17,3,18,0,Math.PI*2);ctx.arc(-2,-9,22,0,Math.PI*2);ctx.arc(19,1,20,0,Math.PI*2);ctx.arc(0,9,25,0,Math.PI*2);
      ctx.fill();ctx.stroke();ctx.shadowBlur=0;
      ctx.globalAlpha=.72;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(-7,-15,9,5,-.3,0,Math.PI*2);ctx.fill();
      ctx.globalAlpha=.92;ctx.fillStyle='#183b56';ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText('RIVAL',0,-40);
      if(p?.icon){ctx.globalAlpha=.96;ctx.font='20px Arial';ctx.fillText(p.icon,0,8);}
      if(s.evolutionStage>0){ctx.globalAlpha=.9;ctx.font='11px system-ui';ctx.fillText(s.evolutionStage>=2?'★★':'★',0,34);}
      ctx.restore();
    }catch(e){/* visual layer must never break gameplay */}
  }
  function installDrawHook(){
    const base=window.draw;
    if(typeof base!=='function'||base.__raceGhostWrapped)return false;
    function wrapped(){base.apply(this,arguments);drawGhost();}
    wrapped.__raceGhostWrapped=true;window.draw=wrapped;return true;
  }

  window.addEventListener('race:ghost',ev=>push(ev.detail));
  window.addEventListener('race:start',reset);
  window.addEventListener('race:reset',reset);
  window.addEventListener('race:incomingAttack',()=>{attackPulseUntil=now()+420;});
  if(!installDrawHook())setTimeout(installDrawHook,0);

  window.SkyPuffRaceGhost={BUFFER_MS,push,sample,reset,draw:drawGhost,status:()=>({samples:samples.length,last:lastSample?{...lastSample}:null})};
})();


;/* js/steal_my_puffling_menu.js */
/* Orbuff — Race My Orbuff multiplayer entry v1.3
 * Compatibility filename and legacy globals retained for the current beta loader.
 */
(function(){
 let lobbyMode='idle';
 let transportBound=false;
 let hostCode='';

 const copy={
  no:{race:'RACE MY ORBUFF 🏁',intro:'Førstemann til 1500m. Spill mot en venn med vennekode eller finn en motstander.',host:'LAG VENNEKODE',join:'BLI MED',placeholder:'VENNEKODE',waiting:'Venter på venn…',share:'Send denne koden til vennen din',copy:'KOPIER KODE',copied:'KOPIERT ✓',shareBtn:'DEL KODE',joining:'Kobler til rom',joined:'Venn koblet til ✓',ready:'Begge er klare — racet starter snart!',invalid:'Skriv inn en gyldig 6-tegns vennekode',copyFail:'Kunne ikke kopiere automatisk',back:'TILBAKE'},
  en:{race:'RACE MY ORBUFF 🏁',intro:'First to 1500m. Race a friend with a code or find an opponent.',host:'CREATE FRIEND CODE',join:'JOIN',placeholder:'FRIEND CODE',waiting:'Waiting for friend…',share:'Send this code to your friend',copy:'COPY CODE',copied:'COPIED ✓',shareBtn:'SHARE CODE',joining:'Connecting to room',joined:'Friend connected ✓',ready:'Both players are ready — race starting soon!',invalid:'Enter a valid 6-character friend code',copyFail:'Could not copy automatically',back:'BACK'},
  de:{race:'RACE MY ORBUFF 🏁',intro:'Wer zuerst 1500 m erreicht, gewinnt. Spiele per Freundescode oder finde einen Gegner.',host:'FREUNDESCODE ERSTELLEN',join:'BEITRETEN',placeholder:'FREUNDESCODE',waiting:'Warte auf Freund…',share:'Sende diesen Code an deinen Freund',copy:'CODE KOPIEREN',copied:'KOPIERT ✓',shareBtn:'CODE TEILEN',joining:'Verbindung zu Raum',joined:'Freund verbunden ✓',ready:'Beide sind bereit — das Rennen startet gleich!',invalid:'Gib einen gültigen 6-stelligen Freundescode ein',copyFail:'Code konnte nicht automatisch kopiert werden',back:'ZURÜCK'},
  es:{race:'RACE MY ORBUFF 🏁',intro:'El primero en llegar a 1500 m gana. Compite con un amigo mediante código o busca rival.',host:'CREAR CÓDIGO',join:'UNIRSE',placeholder:'CÓDIGO',waiting:'Esperando a tu amigo…',share:'Envía este código a tu amigo',copy:'COPIAR CÓDIGO',copied:'COPIADO ✓',shareBtn:'COMPARTIR',joining:'Conectando a la sala',joined:'Amigo conectado ✓',ready:'Ambos están listos — ¡la carrera empieza pronto!',invalid:'Introduce un código válido de 6 caracteres',copyFail:'No se pudo copiar automáticamente',back:'VOLVER'},
  fr:{race:'RACE MY ORBUFF 🏁',intro:'Le premier à 1500 m gagne. Affrontez un ami avec un code ou trouvez un adversaire.',host:'CRÉER UN CODE',join:'REJOINDRE',placeholder:'CODE AMI',waiting:'En attente de votre ami…',share:'Envoyez ce code à votre ami',copy:'COPIER LE CODE',copied:'COPIÉ ✓',shareBtn:'PARTAGER',joining:'Connexion au salon',joined:'Ami connecté ✓',ready:'Les deux joueurs sont prêts — départ imminent !',invalid:'Entrez un code ami valide à 6 caractères',copyFail:'Impossible de copier automatiquement',back:'RETOUR'}
 };
 function tr(){return copy[typeof lang==='string'?lang:'no']||copy.en;}
 function cleanCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);}
 function newCode(){
  if(typeof randomRoomCode==='function')return randomRoomCode();
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=chars[Math.floor(Math.random()*chars.length)];return s;
 }
 function el(id){return document.getElementById(id);}
 function ensureFriendPanel(){
  const card=document.querySelector('#multiplayerMenu .card');if(!card)return null;
  let panel=el('raceFriendLobbyPanel');
  if(!panel){
   panel=document.createElement('div');panel.id='raceFriendLobbyPanel';
   panel.style.cssText='display:none;margin:12px 0 4px;padding:15px;border-radius:18px;background:rgba(238,248,255,.92);border:1px solid rgba(83,164,220,.2);box-shadow:0 8px 24px rgba(30,90,135,.10)';
   panel.innerHTML='<div id="raceFriendLobbyLabel" style="font-size:12px;font-weight:900;letter-spacing:.8px;opacity:.68"></div><div id="raceFriendLobbyCode" style="font-size:clamp(34px,11vw,48px);font-weight:1000;letter-spacing:5px;margin:5px 0 8px;color:#245a7a;user-select:all"></div><div id="raceFriendLobbyState" class="small" style="font-weight:850;margin-bottom:11px"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button id="raceCopyCodeBtn" class="secondary" type="button" style="margin:0;min-width:0"></button><button id="raceShareCodeBtn" class="gold" type="button" style="margin:0;min-width:0"></button></div>';
   const status=el('multiplayerStatus');if(status)status.insertAdjacentElement('afterend',panel);else card.appendChild(panel);
   el('raceCopyCodeBtn').onclick=copyCode;
   el('raceShareCodeBtn').onclick=shareCode;
  }
  return panel;
 }
 function setPanel(code,state,visible=true){
  const t=tr(),panel=ensureFriendPanel();if(!panel)return;
  panel.style.display=visible?'block':'none';
  el('raceFriendLobbyLabel').textContent=t.share;
  el('raceFriendLobbyCode').textContent=code||'------';
  el('raceFriendLobbyState').textContent=state||'';
  el('raceCopyCodeBtn').textContent=t.copy;
  el('raceShareCodeBtn').textContent=t.shareBtn;
 }
 function styleBaseMenu(){
  const t=tr(),card=document.querySelector('#multiplayerMenu .card');if(!card)return;
  const h=card.querySelector('h1');if(h){h.textContent=t.race;h.style.fontSize='clamp(28px,8vw,38px)';}
  const quick=typeof quickMatchBtnEl!=='undefined'?quickMatchBtnEl:el('quickMatchBtn');if(quick)quick.textContent=typeof lang==='string'&&lang==='no'?'FINN MOTSTANDER':'QUICK MATCH';
  const create=typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn');if(create)create.textContent=t.host;
  const join=typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn');if(join)join.textContent=t.join;
  const input=typeof roomCodeInputEl!=='undefined'?roomCodeInputEl:el('roomCodeInput');if(input){input.placeholder=t.placeholder;input.maxLength=6;input.setAttribute('autocomplete','off');input.setAttribute('autocapitalize','characters');input.oninput=()=>{input.value=cleanCode(input.value);};}
  if(typeof roomCodeDisplayEl!=='undefined'&&roomCodeDisplayEl){roomCodeDisplayEl.style.display='none';roomCodeDisplayEl.textContent='';}
  const close=typeof closeMultiplayerEl!=='undefined'?closeMultiplayerEl:el('closeMultiplayer');if(close)close.textContent=t.back;
 }
 async function copyCode(){
  if(!hostCode)return;const t=tr(),btn=el('raceCopyCodeBtn');
  let ok=false;
  try{await navigator.clipboard.writeText(hostCode);ok=true;}catch(e){
   try{const ta=document.createElement('textarea');ta.value=hostCode;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove();}catch(_){}
  }
  if(btn){btn.textContent=ok?t.copied:t.copyFail;setTimeout(()=>{if(btn)btn.textContent=t.copy;},1300);}
  if(typeof showToast==='function')showToast(ok?`${t.copied} ${hostCode}`:t.copyFail);
 }
 async function shareCode(){
  if(!hostCode)return;const t=tr();
  const text=`Orbuff — Race My Orbuff\n${t.placeholder}: ${hostCode}`;
  if(navigator.share){try{await navigator.share({title:'Race My Orbuff',text,url:location.href});return;}catch(e){if(e&&e.name==='AbortError')return;}}
  await copyCode();
 }
 function keepLobbyVisible(){
  if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
  const hud=typeof multiplayerHudEl!=='undefined'?multiplayerHudEl:el('multiplayerHud');if(hud)hud.style.display='none';
 }
 function hostRoom(){
  const t=tr();hostCode=newCode();lobbyMode='host';
  multiplayerRoom=hostCode;multiplayerState='waiting';
  if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=t.waiting;
  setPanel(hostCode,t.waiting,true);
  if(typeof startMultiplayerRace==='function'){
   startMultiplayerRace('friend');
   setTimeout(()=>{keepLobbyVisible();setPanel(hostCode,t.waiting,true);if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.waiting;},0);
  }
 }
 function joinRoom(){
  const t=tr(),input=typeof roomCodeInputEl!=='undefined'?roomCodeInputEl:el('roomCodeInput');
  const code=cleanCode(input?.value);
  if(code.length!==6){if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.invalid;if(input)input.focus();return;}
  hostCode='';lobbyMode='join';multiplayerRoom=code;multiplayerState='connecting';setPanel('', '',false);
  if(multiplayerStatusEl)multiplayerStatusEl.textContent=`${t.joining} ${code}…`;
  if(typeof startMultiplayerRace==='function'){
   startMultiplayerRace('friend');
   setTimeout(()=>{keepLobbyVisible();if(multiplayerStatusEl)multiplayerStatusEl.textContent=`${t.joining} ${code}…`;},0);
  }
 }
 function bindTransport(){
  if(transportBound)return;const T=window.SkyPuffRaceTransport;if(!T)return;transportBound=true;
  T.on('race:opponentJoined',()=>{const t=tr();if(lobbyMode==='host'){setPanel(hostCode,t.joined,true);if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.joined;}});
  T.on('race:ready',()=>{const t=tr();if(lobbyMode==='host')setPanel(hostCode,t.ready,true);if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.ready;});
  T.on('race:matched',m=>{const t=tr();if(lobbyMode==='join'&&Array.isArray(m?.players)&&m.players.length>=1){if(multiplayerStatusEl)multiplayerStatusEl.textContent=t.joined;}});
  T.on('race:start',()=>{lobbyMode='racing';if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='none';setPanel('', '',false);const hud=typeof multiplayerHudEl!=='undefined'?multiplayerHudEl:el('multiplayerHud');if(hud)hud.style.display='block';});
  T.on('race:error',m=>{if(lobbyMode!=='host'&&lobbyMode!=='join')return;const msg=m?.code==='room_full'?'Rommet er fullt.':m?.code==='resume_expired'?'Rommet finnes ikke lenger.':'Kunne ikke koble til rommet.';if(multiplayerStatusEl)multiplayerStatusEl.textContent=msg;});
 }
 function ensure(){
  styleBaseMenu();ensureFriendPanel();bindTransport();
  let b=el('stealMyPufflingBtn')||el('raceMyPufflingBtn');
  if(!b){b=document.createElement('button');b.className='gold';}
  b.id='raceMyPufflingBtn';b.textContent=tr().race;
  b.onclick=()=>{if(typeof openMultiplayer==='function')openMultiplayer();setTimeout(()=>{styleBaseMenu();if(multiplayerStatusEl)multiplayerStatusEl.textContent=tr().intro;},0);};
  const card=document.querySelector('#multiplayerMenu .card');if(card){const close=el('closeMultiplayer');if(b.parentElement!==card)card.insertBefore(b,close||null);b.style.marginTop='12px';}
  const create=typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn');if(create)create.onclick=hostRoom;
  const join=typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn');if(join)join.onclick=joinRoom;
 }
 function removeLegacyCopy(){
  const old=el('stealMyPuffResult');if(old)old.remove();
  document.querySelectorAll('button').forEach(btn=>{if(/STEAL MY PUFFLING|STJEL PUFFLING/i.test(btn.textContent||''))btn.style.display='none';});
 }
 const originalOpen=typeof openMultiplayer==='function'?openMultiplayer:null;
 if(originalOpen){
  openMultiplayer=function(){lobbyMode='idle';hostCode='';originalOpen();styleBaseMenu();setPanel('', '',false);if(multiplayerStatusEl)multiplayerStatusEl.textContent=tr().intro;};
  const mp=typeof multiplayerBtnEl!=='undefined'?multiplayerBtnEl:el('multiplayerBtn');if(mp)mp.onclick=openMultiplayer;
 }
 function open(){if(typeof openMultiplayer==='function')openMultiplayer();setTimeout(()=>el('raceMyPufflingBtn')?.focus(),50);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{ensure();removeLegacyCopy();},100));else setTimeout(()=>{ensure();removeLegacyCopy();},100);
 const api={ensure,open,hostRoom,joinRoom};
 window.OrbuffRaceMode=api;
 window.PufflingRaceMode=api;
 window.PufflingStealMode=api;
})();

;/* js/race_friend_lobby_guard.js */
/* Sky Puff — Race My Puffling friend-lobby guard v0.1 */
(function(){
 function el(id){return document.getElementById(id);}
 function panelVisible(){const p=el('raceFriendLobbyPanel');return !!(p&&p.style.display!=='none');}
 function waitingFriend(){
  try{return !!multiplayerMode&&panelVisible()&&['waiting','connecting','waiting_start','connecting'].includes(String(multiplayerState||''));}catch(e){return false;}
 }
 function clearRaceWait(){
  try{window.SkyPuffRaceTransport?.disconnect?.();}catch(e){}
  try{window.SkyPuffRaceUI?.hide?.();}catch(e){}
  try{window.SkyPuffRaceGhost?.reset?.();}catch(e){}
  try{multiplayerMode=false;multiplayerState='idle';running=false;paused=false;}catch(e){}
  try{if(multiplayerInterval){clearInterval(multiplayerInterval);multiplayerInterval=null;}}catch(e){}
  const hud=el('multiplayerHud');if(hud)hud.style.display='none';
  const menu=el('multiplayerMenu');if(menu)menu.style.display='none';
  const panel=el('raceFriendLobbyPanel');if(panel)panel.style.display='none';
  try{if(typeof showMainMenu==='function')showMainMenu();else if(typeof startEl!=='undefined'&&startEl)startEl.style.display='flex';}catch(e){}
 }
 function bindClose(){
  const close=el('closeMultiplayer');if(!close||close.__raceLobbyGuard)return;
  const previous=close.onclick;
  close.onclick=function(ev){
   if(waitingFriend()){ev?.preventDefault?.();clearRaceWait();return;}
   if(typeof previous==='function')return previous.call(this,ev);
  };
  close.__raceLobbyGuard=true;
 }
 function bindTransport(){
  const T=window.SkyPuffRaceTransport;if(!T||T.__friendLobbyGuard)return;
  T.__friendLobbyGuard=true;
  T.on('state',m=>{
   if(m?.state!=='local')return;
   setTimeout(()=>{
    try{
     if(!multiplayerMode||T.snapshot?.().state!=='local')return;
     const menu=el('multiplayerMenu'),panel=el('raceFriendLobbyPanel'),hud=el('multiplayerHud');
     if(menu)menu.style.display='none';if(panel)panel.style.display='none';if(hud)hud.style.display='block';
     if(typeof showToast==='function')showToast('Online-server ikke tilkoblet — starter test-ghost.');
    }catch(e){}
   },30);
  });
 }
 function ensure(){bindClose();bindTransport();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,150));else setTimeout(ensure,150);
 [450,1000,1800].forEach(ms=>setTimeout(ensure,ms));
 window.SkyPuffRaceFriendLobbyGuard={ensure,cancel:clearRaceWait};
})();

;/* js/race_puffling_eligibility.js */
/* Orbuff — Race My Orbuff eligibility gate v1.3
 * Race mode is unavailable until the player owns at least one Orbuff.
 * Online Race syncs authoritative inventory before joining.
 * Legacy Puffling identifiers remain for save/API compatibility.
 */
(function(){
  const baseOpen=typeof window.openMultiplayer==='function'?window.openMultiplayer:null;
  const baseQuick=typeof window.quickMatch==='function'?window.quickMatch:null;
  const baseStart=typeof window.startMultiplayerRace==='function'?window.startMultiplayerRace:null;
  if(!baseStart)return;

  const COPY={
    no:{need:'Du må skaffe deg minst én Orbuff før du kan spille Race My Orbuff.',hint:'Velg en gratis starter-Orbuff først. Deretter låses Race My Orbuff opp automatisk.',cta:'VELG STARTER-ORBUFF',locked:'🔒 RACE MY ORBUFF — VELG EN ORBUFF FØRST',syncFail:'Kunne ikke bekrefte Orbuff-samlingen med serveren. Race ble stoppet for å beskytte inventory.'},
    en:{need:'You need to own at least one Orbuff before you can play Race My Orbuff.',hint:'Choose a free starter Orbuff first. Race My Orbuff will then unlock automatically.',cta:'CHOOSE STARTER ORBUFF',locked:'🔒 RACE MY ORBUFF — CHOOSE AN ORBUFF FIRST',syncFail:'Could not verify your Orbuff collection with the server. Race was stopped to protect inventory.'},
    de:{need:'Du brauchst mindestens einen Orbuff, bevor du Race My Orbuff spielen kannst.',hint:'Wähle zuerst einen kostenlosen Starter-Orbuff. Danach wird Race My Orbuff automatisch freigeschaltet.',cta:'STARTER-ORBUFF WÄHLEN',locked:'🔒 RACE MY ORBUFF — ZUERST ORBUFF WÄHLEN',syncFail:'Die Orbuff-Sammlung konnte nicht mit dem Server bestätigt werden. Das Rennen wurde zum Schutz des Inventars gestoppt.'},
    es:{need:'Necesitas al menos un Orbuff antes de jugar Race My Orbuff.',hint:'Elige primero un Orbuff inicial gratis. Race My Orbuff se desbloqueará automáticamente.',cta:'ELEGIR ORBUFF INICIAL',locked:'🔒 RACE MY ORBUFF — ELIGE UN ORBUFF',syncFail:'No se pudo verificar tu colección de Orbuffs con el servidor. La carrera se detuvo para proteger el inventario.'},
    fr:{need:'Vous devez posséder au moins un Orbuff avant de jouer à Race My Orbuff.',hint:'Choisissez d’abord un Orbuff de départ gratuit. Race My Orbuff sera ensuite débloqué automatiquement.',cta:'CHOISIR UN ORBUFF DE DÉPART',locked:'🔒 RACE MY ORBUFF — CHOISISSEZ UN ORBUFF',syncFail:'Impossible de vérifier votre collection d’Orbuffs avec le serveur. La course a été arrêtée pour protéger l’inventaire.'}
  };

  function tr(){try{return COPY[typeof lang==='string'?lang:'no']||COPY.en;}catch(e){return COPY.no;}}
  function ownedIds(){
    try{
      const s=window.SkyPuffFusion?.load?.();
      return Object.entries(s?.owned||{}).filter(([,count])=>Number(count)>0).map(([id])=>id);
    }catch(e){return [];}
  }
  function eligible(){return ownedIds().length>0;}
  function el(id){return document.getElementById(id);}
  function ensurePanel(){
    let panel=el('racePufflingRequired');
    if(panel)return panel;
    const card=document.querySelector('#multiplayerMenu .card');if(!card)return null;
    panel=document.createElement('div');panel.id='racePufflingRequired';
    panel.style.cssText='display:none;margin:12px 0;padding:16px;border-radius:18px;background:rgba(255,244,210,.96);border:2px solid rgba(239,179,45,.45);box-shadow:0 9px 24px rgba(75,55,10,.10);text-align:center';
    panel.innerHTML='<div style="font-size:34px;margin-bottom:5px">🔒☁️</div><div id="racePufflingRequiredTitle" style="font-size:16px;font-weight:1000;color:#624b18"></div><div id="racePufflingRequiredHint" class="small" style="margin:7px 0 12px;color:#705d2b"></div><button id="racePufflingRequiredCta" class="gold" type="button" style="margin:0;width:100%"></button>';
    const status=el('multiplayerStatus');if(status)status.insertAdjacentElement('afterend',panel);else card.appendChild(panel);
    el('racePufflingRequiredCta').onclick=goToOrbuffs;
    return panel;
  }
  function controls(){
    return [
      typeof quickMatchBtnEl!=='undefined'?quickMatchBtnEl:el('quickMatchBtn'),
      typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn'),
      typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn'),
      typeof roomCodeInputEl!=='undefined'?roomCodeInputEl:el('roomCodeInput')
    ].filter(Boolean);
  }
  function refresh(){
    const ok=eligible(),t=tr(),panel=ensurePanel();
    if(panel){
      panel.style.display=ok?'none':'block';
      const title=el('racePufflingRequiredTitle'),hint=el('racePufflingRequiredHint'),cta=el('racePufflingRequiredCta');
      if(title)title.textContent=t.need;if(hint)hint.textContent=t.hint;if(cta)cta.textContent=t.cta;
    }
    controls().forEach(node=>{node.disabled=!ok;node.style.opacity=ok?'':'0.45';node.style.cursor=ok?'':'not-allowed';});
    const race=el('raceMyPufflingBtn');
    if(race){race.disabled=!ok;race.style.opacity=ok?'':'0.55';race.textContent=ok?'RACE MY ORBUFF 🏁':t.locked;}
    const friendPanel=el('raceFriendLobbyPanel');if(friendPanel&&!ok)friendPanel.style.display='none';
    return ok;
  }
  function deny(){
    const t=tr();
    if(baseOpen)baseOpen();
    if(typeof multiplayerMode!=='undefined')multiplayerMode=false;
    if(typeof multiplayerState!=='undefined')multiplayerState='locked_orbuff_required';
    if(typeof running!=='undefined')running=false;
    if(el('multiplayerHud'))el('multiplayerHud').style.display='none';
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
    if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=t.need;
    refresh();
    if(typeof showToast==='function')showToast('🔒 '+t.need);
    window.dispatchEvent(new CustomEvent('race:orbuffRequired'));
    window.dispatchEvent(new CustomEvent('race:pufflingRequired'));
    return false;
  }
  function requireOrbuff(){return eligible()?true:deny();}
  async function syncServerInventory(){
    const sync=window.PufflingTradeInventorySync?.ensure;
    if(typeof sync!=='function')return true;
    try{await sync();return true;}catch(e){
      const t=tr();
      try{window.SkyPuffRaceTransport?.disconnect?.();}catch(_){}
      if(typeof multiplayerMode!=='undefined')multiplayerMode=false;
      if(typeof multiplayerState!=='undefined')multiplayerState='inventory_sync_failed';
      if(typeof running!=='undefined')running=false;
      if(typeof multiplayerHudEl!=='undefined'&&multiplayerHudEl)multiplayerHudEl.style.display='none';
      if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='flex';
      if(typeof multiplayerStatusEl!=='undefined'&&multiplayerStatusEl)multiplayerStatusEl.textContent=t.syncFail;
      if(typeof showToast==='function')showToast('⚠️ '+t.syncFail);
      return false;
    }
  }
  function goToOrbuffs(){
    try{window.SkyPuffRaceTransport?.disconnect?.();}catch(e){}
    if(typeof multiplayerMenuEl!=='undefined'&&multiplayerMenuEl)multiplayerMenuEl.style.display='none';
    if(window.SkyPuffStarterChoice?.eligible?.()){window.SkyPuffStarterChoice.open();return;}
    const start=typeof startEl!=='undefined'?startEl:el('start');if(start)start.style.display='flex';
    if(window.SkyPuffMenuCleanup?.openHub){window.SkyPuffMenuCleanup.openHub('pufflings');return;}
    setTimeout(()=>el('pufflingsHubBtn')?.click(),0);
  }

  window.openMultiplayer=function(){if(!eligible())return deny();const result=baseOpen?.apply(this,arguments);refresh();return result;};
  if(baseQuick)window.quickMatch=function(){if(!requireOrbuff())return;return baseQuick.apply(this,arguments);};
  window.startMultiplayerRace=async function(){if(!requireOrbuff())return false;if(!await syncServerInventory())return false;return baseStart.apply(this,arguments);};

  function bindButtons(){
    const mp=typeof multiplayerBtnEl!=='undefined'?multiplayerBtnEl:el('multiplayerBtn');if(mp)mp.onclick=()=>window.openMultiplayer();
    const quick=typeof quickMatchBtnEl!=='undefined'?quickMatchBtnEl:el('quickMatchBtn');if(quick)quick.onclick=()=>{if(requireOrbuff())window.quickMatch?.();};
    const create=typeof createRoomBtnEl!=='undefined'?createRoomBtnEl:el('createRoomBtn');if(create)create.onclick=()=>{if(requireOrbuff())(window.OrbuffRaceMode||window.PufflingRaceMode)?.hostRoom?.();};
    const join=typeof joinRoomBtnEl!=='undefined'?joinRoomBtnEl:el('joinRoomBtn');if(join)join.onclick=()=>{if(requireOrbuff())(window.OrbuffRaceMode||window.PufflingRaceMode)?.joinRoom?.();};
    const race=el('raceMyPufflingBtn');if(race)race.onclick=()=>{if(requireOrbuff())window.openMultiplayer();};
    refresh();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(bindButtons,0));else setTimeout(bindButtons,0);
  [150,500,1200].forEach(ms=>setTimeout(bindButtons,ms));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  window.addEventListener('storage',ev=>{if(ev.key==='skyPuffPufflings')refresh();});
  window.addEventListener('race:pufflingAcquired',refresh);
  window.addEventListener('race:orbuffAcquired',refresh);
  window.addEventListener('puffling:starterChosen',refresh);
  window.addEventListener('orbuff:starterChosen',refresh);

  const api={eligible,ownedIds,refresh,requireOrbuff,requirePuffling:requireOrbuff,syncServerInventory,goToOrbuffs,goToPufflings:goToOrbuffs};
  window.OrbuffRaceEligibility=api;
  window.SkyPuffRaceEligibility=api;
})();


;/* js/puffling_rebrand.js */
/* Orbuff — player-facing rebrand with legacy Puffling/Sky Puff compatibility.
 * Internal save/API keys intentionally remain unchanged so existing beta progress survives the rename.
 */
(function(){
 const BRAND='Orbuff';
 const textRules=[
  [/PUFFLINGS/g,'ORBUFFS'],[/Pufflings/g,'Orbuffs'],[/pufflings/g,'orbuffs'],
  [/PUFFLING/g,'ORBUFF'],[/Puffling/g,'Orbuff'],[/puffling/g,'orbuff'],
  [/SKY PUFF/g,'ORBUFF'],[/Sky Puff/g,'Orbuff'],[/sky puff/g,'orbuff'],
  [/Sky Cosmetics/g,'Orbuff Cosmetics'],[/SKY COSMETICS/g,'ORBUFF COSMETICS'],
  [/Sky Treasure/g,'Orbuff Treasure'],[/SKY TREASURE/g,'ORBUFF TREASURE'],
  [/Sky Legend/g,'Orbuff Legend'],[/SKY LEGEND/g,'ORBUFF LEGEND'],
  [/Sky Immortal/g,'Orbuff Immortal'],[/SKY IMMORTAL/g,'ORBUFF IMMORTAL'],
  [/Steal My Puff(?!ling)/g,'Race My Orbuff'],[/STEAL MY PUFF(?!LING)/g,'RACE MY ORBUFF'],
  [/Puff down!/g,'Orbuff down!'],[/PUFF DOWN!/g,'ORBUFF DOWN!']
 ];
 function replaceText(s){let out=String(s??'');for(const [re,v] of textRules)out=out.replace(re,v);return out;}
 function cleanNode(root){
  if(!root)return;
  if(root.nodeType===3){const old=root.nodeValue,v=replaceText(old);if(v!==old)root.nodeValue=v;return;}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const old=n.nodeValue,v=replaceText(old);if(v!==old)n.nodeValue=v;}
  if(root.querySelectorAll)root.querySelectorAll('[title],[aria-label],[placeholder],[alt]').forEach(el=>{for(const a of ['title','aria-label','placeholder','alt'])if(el.hasAttribute(a)){const old=el.getAttribute(a),v=replaceText(old);if(v!==old)el.setAttribute(a,v);}});
 }
 function apply(){
  document.title=BRAND;
  const splash=document.querySelector('.studioGame');if(splash)splash.textContent='ORBUFF';
  const main=document.querySelector('#start h1');if(main)main.textContent=BRAND;
  cleanNode(document.body);
 }
 let queued=false,pending=[];
 function flush(){queued=false;const nodes=pending;pending=[];for(const n of nodes)cleanNode(n);}
 // Only inspect newly inserted UI. Do not observe characterData: rewriting text while observing text mutations could create a feedback loop on some mobile browsers.
 const observer=new MutationObserver(list=>{for(const m of list)for(const n of m.addedNodes||[])pending.push(n);if(pending.length&&!queued){queued=true;requestAnimationFrame(flush);}});
 function start(){apply();observer.observe(document.body,{subtree:true,childList:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 const api={name:BRAND,legacyName:'Puffling',apply,replaceText};
 window.OrbuffBrand=api;
 // Backward-compatible alias for existing modules/tests that still reference PufflingBrand.
 window.PufflingBrand=api;
})();


;/* js/smoke_check.js */
(function(){
  const missing=[];
  const requiredFunctions=['reset','startGame','update','draw','loop','spawnBoss','openBossRush','openMultiplayer','openShop','closeShop','renderShop','loadLeaderboard','submitOnlineScore','persist','refreshMenu','tr','startMusic','stopMusic','getEndlessBossStage'];
  for(const name of requiredFunctions){if(typeof window[name]!=='function'&&typeof globalThis[name]!=='function')missing.push('fn:'+name);}
  const requiredValues=['canvas','ctx','save','skins','bossStages','missions','SKY_PUFF_VERSION','API_BASE','SKY_PUFF_SUPPORT_EMAIL'];
  for(const name of requiredValues){try{if(typeof eval(name)==='undefined')missing.push('value:'+name);}catch(e){missing.push('value:'+name);}}
  const requiredDom=['game','start','playBtn','bossRushBtn','multiplayerBtn','achievementsBtn','achievementsMenu','diagnosticsBtn','diagnosticsMenu','sendBugReportBtn','shopBtn','shop','skinrow','facerow','hatrow','trailrow','closeShop','upgrades','pauseMenu','gameOver','leaderboardMenu','raceMyPufflingBtn','starterPufflingChoice'];
  for(const id of requiredDom){if(!document.getElementById(id))missing.push('dom:#'+id);}
  const criticalHandlers=['playBtn','retryBtn','pauseBtn','shopBtn','closeShop','upgradeBtn','closeUpgrades','dailyBtn','multiplayerBtn','closeMultiplayer','quickMatchBtn','createRoomBtn','joinRoomBtn','bossRushBtn','closeBossRush','diagnosticsBtn','closeDiagnostics','leaderboardBtn','closeLeaderboard','audioSettingsBtn','closeAudioSettings','raceMyPufflingBtn'];
  for(const id of criticalHandlers){const el=document.getElementById(id);if(el&&typeof el.onclick!=='function')missing.push('handler:#'+id);}
  const requiredApis=['skyPuffAchievements','skyPuffAchievementsMenu','skyPuffBetaDiagnostics','skyPuffAIDiagnostics','skyPuffAntiCheat','skyPuffDiagnosticsSupport','skyPuffPlatform','SkyPuffFusion','SkyPuffFusionUI','SkyPuffPufflingGameplay','SkyPuffPufflingProgress','SkyPuffPufflingEvolution','SkyPuffPerformance','SkyPuffPerformanceUI','SkyPuffBossPufflingRewards','SkyPuffRace','SkyPuffRaceUI','SkyPuffRaceTransport','SkyPuffRaceNetwork','SkyPuffRaceProgress','SkyPuffQuickRank','SkyPuffNurseryVault','SkyPuffDiamonds','SkyPuffMysteryShop','PufflingDiamondWallet','PufflingDiamondStore','SkyPuffUniqueTraits','PufflingBossRush','PufflingBossPersistence','PufflingRaceMode','PufflingTrade','PufflingBrand','PufflingExtraCollection','PufflingExpansion36','PufflingSaveIntegrity'];
  for(const name of requiredApis){if(!window[name])missing.push('api:'+name);}
  const antiReady=!!(window.skyPuffAntiCheat&&window.skyPuffAntiCheat.status&&Number.isFinite(window.skyPuffAntiCheat.status.runStartedAt));if(!antiReady)missing.push('anti-cheat:run-state');
  if(!window.PufflingSaveIntegrity?.ok)missing.push('save:integrity-guard');
  try{if(typeof API_BASE!=='string'||!API_BASE.trim())missing.push('leaderboard:api-base-missing');}catch(e){missing.push('leaderboard:api-base-read-failed');}
  try{
    const F=window.SkyPuffFusion,s=F?.load?.();
    if(!s||typeof s.owned!=='object'||!Array.isArray(s.discovered)||!Array.isArray(s.vault)||!Array.isArray(s.tradeReceipts))missing.push('puffling:invalid-save');
    else if(s.vault.length>3)missing.push('vault:too-many-slots');
    else if(new Set(s.vault).size!==s.vault.length)missing.push('vault:duplicate-slots');
    if(typeof F?.tradeTransfer!=='function'||typeof F?.availableCount!=='function')missing.push('trade:inventory-api-missing');
    if(typeof window.SkyPuffPufflingProgress?.reset!=='function')missing.push('trade:xp-reset-missing');
    const total=Object.keys(F?.BASE||{}).length+Object.keys(F?.FUSIONS||{}).length;
    if(total!==100)missing.push('puffling:expected-100-total:'+total);
    if(window.PufflingExtraCollection?.count!==50)missing.push('puffling:extra-50-count');
    if(window.PufflingExpansion36?.count!==36)missing.push('puffling:expansion-36-count');
    if(window.PufflingExpansion36?.legendaryIds?.length!==10)missing.push('puffling:expansion-legendary-count');
    if(window.SkyPuffUniqueTraits?.count!==100)missing.push('puffling:trait-count');
  }catch(e){missing.push('puffling:save-read-failed');}
  try{
    const N=window.SkyPuffNurseryVault,e=N?.loadEggs?.();
    if(!e||typeof e!=='object')missing.push('nursery:invalid-eggs');
    const starterIds=new Set(['starterpuff','starterspark','starterdrop']);
    for(const t of ['rare','epic','legendary']){
      if((+e?.[t]||0)<0)missing.push('nursery:negative-'+t);
      const p=N?.pool?.(t)||[];
      if(!p.length)missing.push('nursery:empty-pool-'+t);
      if(p.some(id=>starterIds.has(id)))missing.push('nursery:starter-in-'+t+'-pool');
    }
  }catch(e){missing.push('nursery:read-failed');}
  try{
    const R=window.SkyPuffRace;
    if(R?.GOAL_METERS!==1500)missing.push('race:goal-not-1500');
    if(R?.MAX_ATTACKS!==3)missing.push('race:max-attacks-not-3');
    if(!window.SkyPuffRaceProgress?.liveProgress)missing.push('race:progress-source-missing');
    const ranked=window.SkyPuffQuickRank?.profile?.();
    if(!ranked||!Number.isFinite(Number(ranked.rating))||!ranked.rank?.name)missing.push('race:rank-profile-invalid');
  }catch(e){missing.push('race:core-check-failed');}
  try{const M=window.SkyPuffMysteryShop;if(M?.rewards?.some(x=>x.id==='vaultShield'))missing.push('shop:obsolete-vault-shield');const total=(M?.rewards||[]).reduce((n,x)=>n+(+x.weight||0),0);if(total!==100)missing.push('shop:weight-'+total);if(typeof window.SkyPuffDiamonds?.earned!=='function'||typeof window.SkyPuffDiamonds?.paid!=='function')missing.push('shop:diamond-split-api');}catch(e){missing.push('shop:check-failed');}
  try{const I=window.PufflingDiamondStore,c=I?.catalog?.()||[];if(c.length!==4)missing.push('iap:expected-4-products');if(c.some(x=>!/^puffling\.diamonds\./.test(x.id)||!Number.isFinite(Number(x.diamonds))))missing.push('iap:invalid-product-catalog');if(typeof I?.purchase!=='function'||typeof I?.status!=='function')missing.push('iap:store-api-missing');const W=window.PufflingDiamondWallet;if(typeof W?.init!=='function'||typeof W?.spend!=='function'||typeof W?.paidBalance!=='function')missing.push('iap:wallet-api-missing');}catch(e){missing.push('iap:check-failed');}
  try{const late=window.SkyPuffLateBosses;if(!Array.isArray(late)||late.length!==6)missing.push('late-bosses:expected-6');}catch(e){missing.push('late-bosses:check-failed');}
  try{const fixed=window.PufflingBossRush?.allStages?.()||[];if(fixed.length<10)missing.push('boss-rush:expected-at-least-10-fixed-bosses');}catch(e){missing.push('boss-rush:check-failed');}
  try{if(document.title!=='Puffling')missing.push('brand:title');const h=document.querySelector('#start h1');if(h&&h.textContent.trim()!=='Puffling')missing.push('brand:main-heading');}catch(e){missing.push('brand:check-failed');}
  const result={ok:missing.length===0,missing,version:typeof SKY_PUFF_VERSION==='string'?SKY_PUFF_VERSION:'unknown',pufflingCount:(Object.keys(window.SkyPuffFusion?.BASE||{}).length+Object.keys(window.SkyPuffFusion?.FUSIONS||{}).length),extraPufflings:window.PufflingExtraCollection?.count||0,expansion36:window.PufflingExpansion36?.count||0,quickRaceRating:window.SkyPuffQuickRank?.profile?.().rating||0,tradeReady:!!window.PufflingTrade,leaderboardReady:typeof API_BASE==='string'&&!!API_BASE,iapReady:!!window.PufflingDiamondStore?.canPurchase?.(),paidDiamondWallet:window.PufflingDiamondWallet?.status?.()||null,saveRepairs:window.PufflingSaveIntegrity?.repaired||[],checkedAt:new Date().toISOString()};window.skyPuffSmokeCheck=result;if(result.ok)console.info('Puffling smoke check: OK',result);else console.error('Puffling smoke check failed:',missing);
})();


;/* Signal that every bundled module has executed. */
(function(){const start=document.getElementById('start');if(start){start.inert=false;start.removeAttribute&&start.removeAttribute('aria-busy');}window.__skyPuffModulesReady=true;window.dispatchEvent&&window.dispatchEvent(new Event('sky-puff-ready'));})();
