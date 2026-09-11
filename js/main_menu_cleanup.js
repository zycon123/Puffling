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
