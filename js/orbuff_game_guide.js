/* Orbuff — localized in-game rules and rewards guide v1.2 */
(function(){
 const COPY={
  no:{button:'SPILLGUIDE 📖',title:'Spillguide 📖',subtitle:'Regler, belønninger og systemer i Orbuff.',back:'TILBAKE',sections:[
   ['🎮 Slik spiller du','Hopp oppover, land på plattformer og samle mynter. Unngå fiender og bruk Rainbow Boost når måleren er klar. Et tap avslutter runden og bruker 1 energi på aktiv Orbuff.'],
   ['❤️ Orbuff-energi','Vanlige Orbuffs har 5 energi. Ascended Orbuffs har 6. Ett energipoeng mistes ved tap. Ved 0 energi er Orbuffen utmattet og må hvile eller gjenopplives. Level og evolution beholdes.'],
   ['🔐 OrbVault – hvile og trening','Orbuffs i OrbVault er beskyttet mot Fusion og Trade, kan ikke brukes mens de hviler, får passiv XP og lader energi. Level 1 har 3 plasser og gir 1 energi hvert 15. minutt. Oppgraderinger gir opptil 8 beskyttede plasser, raskere lading og 10 XP per time. Level 5 gir også 15 % daglig sjanse for en Revive Orb.'],
   ['🌱 Evolution','Orbuffs blir Evolved på level 10 og Ascended på level 20. Starterne Airbuff, Rainbuff og Sparkbuff utvikler seg ikke.'],
   ['🧬 Fusion','Begge Orbuffs må være level 20 og Ascended. Fusion bruker begge valgte Orbuffs. Beskyttede kopier i alle OrbVault-plasser kan ikke brukes.'],
   ['🥚 Nursery','Egg kan klekke nye Orbuffs. Rare Egg gir Common eller Rare, Epic Egg gir Epic, og Legendary Egg gir Legendary. Starter-Orbuffs kan ikke klekkes fra egg.'],
   ['🎁 Belønninger','Mynter fås gjennom spilling, oppdrag, daglig belønning og Boss Rush. Bosser kan gi Orbuffs og andre belønninger. Mystery Boxes kan gi mynter, diamanter og egg-relaterte belønninger.'],
   ['👑 Bosser og Boss Rush','Vanlig spill fortsetter etter hver beseiret boss. Boss Rush lar deg kjempe på nytt mot bosser du allerede har slått. Første Boss Rush-seier mot hver boss gir 250 mynter, og senere replay-seiere gir 25 mynter.'],
   ['🏁 Race My Orbuff','Førstemann til 1500 meter vinner. Hver spiller kan angripe opptil 3 ganger, med 4 sekunders cooldown. Race bruker den aktive Orbuffen din. Utmattede Orbuffs og Orbuffs som hviler i OrbVault kan ikke brukes i Race.'],
   ['💰 Gjenoppliving','Startere: gratis. Common: 250 mynter. Rare: 500. Epic: 1 000. Legendary: 2 000. Mythic: 2 500. Full hviletid uten OrbVault er Common 30 min, Rare 60 min, Epic 90 min og Legendary/Mythic 120 min. En Revive Orb gjenoppliver umiddelbart.']
  ]},
  en:{button:'GAME GUIDE 📖',title:'Game Guide 📖',subtitle:'Rules, rewards, and systems in Orbuff.',back:'BACK',sections:[
   ['🎮 How to play','Jump upward, land on platforms, and collect coins. Avoid enemies and use Rainbow Boost when the meter is ready. Losing ends the run and costs your active Orbuff 1 energy.'],
   ['❤️ Orbuff energy','Regular Orbuffs have 5 energy. Ascended Orbuffs have 6. You lose one energy when you lose. At 0 energy, the Orbuff is exhausted and must rest or be revived. Its level and evolution are kept.'],
   ['🔐 OrbVault – rest and training','Orbuffs in the OrbVault are protected from Fusion and Trade, cannot be used while resting, gain passive XP, and recharge energy. Level 1 has 3 slots and restores 1 energy every 15 minutes. Upgrades provide up to 8 protected slots, faster charging, and 10 XP per hour. Level 5 also gives a 15% daily chance of a Revive Orb.'],
   ['🌱 Evolution','Orbuffs become Evolved at level 10 and Ascended at level 20. The starters Airbuff, Rainbuff, and Sparkbuff do not evolve.'],
   ['🧬 Fusion','Both Orbuffs must be level 20 and Ascended. Fusion consumes both selected Orbuffs. Protected copies in every OrbVault slot cannot be used.'],
   ['🥚 Nursery','Eggs can hatch new Orbuffs. Rare Eggs give Common or Rare, Epic Eggs give Epic, and Legendary Eggs give Legendary. Starter Orbuffs cannot hatch from eggs.'],
   ['🎁 Rewards','Coins are earned through gameplay, missions, daily rewards, and Boss Rush. Bosses can award Orbuffs and other rewards. Mystery Boxes can contain coins, Diamonds, and egg-related rewards.'],
   ['👑 Bosses and Boss Rush','Normal play continues after each defeated boss. Boss Rush lets you fight bosses you have already defeated. Your first Boss Rush win against each boss awards 250 coins; later replay wins award 25 coins.'],
   ['🏁 Race My Orbuff','The first player to 1500 meters wins. Each player can attack up to 3 times with a 4-second cooldown. Race uses your active Orbuff. Exhausted Orbuffs and Orbuffs resting in the OrbVault cannot race.'],
   ['💰 Revival','Starters: free. Common: 250 coins. Rare: 500. Epic: 1,000. Legendary: 2,000. Mythic: 2,500. Full rest time outside the OrbVault is 30 min for Common, 60 min for Rare, 90 min for Epic, and 120 min for Legendary/Mythic. A Revive Orb revives instantly.']
  ]},
  de:{button:'SPIELANLEITUNG 📖',title:'Spielanleitung 📖',subtitle:'Regeln, Belohnungen und Systeme in Orbuff.',back:'ZURÜCK',sections:[
   ['🎮 Spielweise','Springe nach oben, lande auf Plattformen und sammle Münzen. Weiche Gegnern aus und nutze Rainbow Boost, wenn die Anzeige bereit ist. Eine Niederlage beendet den Lauf und kostet deinen aktiven Orbuff 1 Energie.'],
   ['❤️ Orbuff-Energie','Normale Orbuffs haben 5 Energie. Ascended Orbuffs haben 6. Bei einer Niederlage geht eine Energie verloren. Bei 0 Energie ist der Orbuff erschöpft und muss ruhen oder wiederbelebt werden. Level und Evolution bleiben erhalten.'],
   ['🔐 OrbVault – Ruhe und Training','Orbuffs im OrbVault sind vor Fusion und Trade geschützt, können während der Ruhe nicht benutzt werden, erhalten passive XP und laden Energie. Level 1 hat 3 Plätze und stellt alle 15 Minuten 1 Energie wieder her. Upgrades bieten bis zu 8 geschützte Plätze, schnelleres Laden und 10 XP pro Stunde. Level 5 bietet außerdem täglich eine Chance von 15 % auf einen Revive Orb.'],
   ['🌱 Evolution','Orbuffs werden auf Level 10 Evolved und auf Level 20 Ascended. Die Starter Airbuff, Rainbuff und Sparkbuff entwickeln sich nicht.'],
   ['🧬 Fusion','Beide Orbuffs müssen Level 20 und Ascended sein. Fusion verbraucht beide ausgewählten Orbuffs. Geschützte Kopien in allen OrbVault-Plätzen können nicht verwendet werden.'],
   ['🥚 Nursery','Aus Eiern können neue Orbuffs schlüpfen. Rare Eggs geben Common oder Rare, Epic Eggs geben Epic und Legendary Eggs geben Legendary. Starter-Orbuffs können nicht aus Eiern schlüpfen.'],
   ['🎁 Belohnungen','Münzen erhältst du durch Spielen, Missionen, tägliche Belohnungen und Boss Rush. Bosse können Orbuffs und andere Belohnungen geben. Mystery Boxes können Münzen, Diamanten und eibezogene Belohnungen enthalten.'],
   ['👑 Bosse und Boss Rush','Das normale Spiel geht nach jedem besiegten Boss weiter. In Boss Rush kannst du bereits besiegte Bosse erneut bekämpfen. Der erste Boss-Rush-Sieg gegen jeden Boss bringt 250 Münzen, spätere Wiederholungssiege bringen 25 Münzen.'],
   ['🏁 Race My Orbuff','Wer zuerst 1500 Meter erreicht, gewinnt. Jeder Spieler kann bis zu 3-mal mit 4 Sekunden Cooldown angreifen. Race verwendet deinen aktiven Orbuff. Erschöpfte Orbuffs und Orbuffs im OrbVault können nicht teilnehmen.'],
   ['💰 Wiederbelebung','Starter: kostenlos. Common: 250 Münzen. Rare: 500. Epic: 1.000. Legendary: 2.000. Mythic: 2.500. Die vollständige Ruhezeit außerhalb des OrbVault beträgt 30 Min. für Common, 60 Min. für Rare, 90 Min. für Epic und 120 Min. für Legendary/Mythic. Ein Revive Orb belebt sofort wieder.']
  ]},
  es:{button:'GUÍA DEL JUEGO 📖',title:'Guía del juego 📖',subtitle:'Reglas, recompensas y sistemas de Orbuff.',back:'VOLVER',sections:[
   ['🎮 Cómo jugar','Salta hacia arriba, aterriza en plataformas y recoge monedas. Evita a los enemigos y usa Rainbow Boost cuando el medidor esté listo. Perder termina la partida y consume 1 de energía del Orbuff activo.'],
   ['❤️ Energía de Orbuff','Los Orbuffs normales tienen 5 de energía. Los Ascended tienen 6. Pierdes una energía al perder. Con 0 de energía, el Orbuff queda agotado y debe descansar o revivir. Conserva su nivel y evolución.'],
   ['🔐 OrbVault – descanso y entrenamiento','Los Orbuffs del OrbVault están protegidos de Fusion y Trade, no pueden usarse mientras descansan, obtienen XP pasiva y recargan energía. El nivel 1 tiene 3 espacios y recupera 1 de energía cada 15 minutos. Las mejoras ofrecen hasta 8 espacios protegidos, recarga más rápida y 10 XP por hora. El nivel 5 también da un 15 % de probabilidad diaria de conseguir un Revive Orb.'],
   ['🌱 Evolution','Los Orbuffs se vuelven Evolved en el nivel 10 y Ascended en el nivel 20. Los iniciales Airbuff, Rainbuff y Sparkbuff no evolucionan.'],
   ['🧬 Fusion','Ambos Orbuffs deben ser nivel 20 y Ascended. Fusion consume los dos Orbuffs seleccionados. Las copias protegidas en cualquier espacio del OrbVault no pueden usarse.'],
   ['🥚 Nursery','Los huevos pueden eclosionar nuevos Orbuffs. Rare Egg da Common o Rare, Epic Egg da Epic y Legendary Egg da Legendary. Los Orbuffs iniciales no salen de huevos.'],
   ['🎁 Recompensas','Consigue monedas jugando, completando misiones, con la recompensa diaria y en Boss Rush. Los jefes pueden dar Orbuffs y otras recompensas. Las Mystery Boxes pueden contener monedas, diamantes y recompensas relacionadas con huevos.'],
   ['👑 Jefes y Boss Rush','La partida normal continúa después de derrotar a cada jefe. Boss Rush permite volver a luchar contra jefes ya derrotados. La primera victoria contra cada jefe da 250 monedas; las siguientes dan 25.'],
   ['🏁 Race My Orbuff','Gana quien llegue primero a 1500 metros. Cada jugador puede atacar hasta 3 veces, con 4 segundos de recarga. Race usa tu Orbuff activo. Los Orbuffs agotados o descansando en el OrbVault no pueden competir.'],
   ['💰 Reanimación','Iniciales: gratis. Common: 250 monedas. Rare: 500. Epic: 1.000. Legendary: 2.000. Mythic: 2.500. El descanso completo fuera del OrbVault dura 30 min para Common, 60 para Rare, 90 para Epic y 120 para Legendary/Mythic. Un Revive Orb revive al instante.']
  ]},
  fr:{button:'GUIDE DU JEU 📖',title:'Guide du jeu 📖',subtitle:'Règles, récompenses et systèmes dans Orbuff.',back:'RETOUR',sections:[
   ['🎮 Comment jouer','Sautez vers le haut, atterrissez sur les plateformes et ramassez des pièces. Évitez les ennemis et utilisez Rainbow Boost lorsque la jauge est prête. Une défaite termine la partie et retire 1 énergie à votre Orbuff actif.'],
   ['❤️ Énergie des Orbuffs','Les Orbuffs normaux ont 5 énergies. Les Ascended en ont 6. Une défaite fait perdre une énergie. À 0 énergie, l’Orbuff est épuisé et doit se reposer ou être réanimé. Son niveau et son évolution sont conservés.'],
   ['🔐 OrbVault – repos et entraînement','Les Orbuffs dans l’OrbVault sont protégés contre Fusion et Trade, ne peuvent pas être utilisés pendant leur repos, gagnent de l’XP passive et rechargent leur énergie. Le niveau 1 offre 3 places et rend 1 énergie toutes les 15 minutes. Les améliorations offrent jusqu’à 8 places protégées, une recharge plus rapide et 10 XP par heure. Le niveau 5 donne aussi 15 % de chance quotidienne d’obtenir un Revive Orb.'],
   ['🌱 Evolution','Les Orbuffs deviennent Evolved au niveau 10 et Ascended au niveau 20. Les starters Airbuff, Rainbuff et Sparkbuff n’évoluent pas.'],
   ['🧬 Fusion','Les deux Orbuffs doivent être de niveau 20 et Ascended. Fusion consomme les deux Orbuffs sélectionnés. Les copies protégées dans toutes les places de l’OrbVault ne peuvent pas être utilisées.'],
   ['🥚 Nursery','Les œufs peuvent faire éclore de nouveaux Orbuffs. Rare Egg donne Common ou Rare, Epic Egg donne Epic et Legendary Egg donne Legendary. Les Orbuffs starters ne peuvent pas éclore d’un œuf.'],
   ['🎁 Récompenses','Vous gagnez des pièces en jouant, avec les missions, la récompense quotidienne et Boss Rush. Les boss peuvent donner des Orbuffs et d’autres récompenses. Les Mystery Boxes peuvent contenir des pièces, des diamants et des récompenses liées aux œufs.'],
   ['👑 Boss et Boss Rush','Le jeu normal continue après chaque boss vaincu. Boss Rush permet de combattre à nouveau les boss déjà vaincus. La première victoire contre chaque boss rapporte 250 pièces, puis les victoires suivantes en rapportent 25.'],
   ['🏁 Race My Orbuff','Le premier joueur à atteindre 1 500 mètres gagne. Chaque joueur peut attaquer jusqu’à 3 fois, avec un délai de 4 secondes. Race utilise votre Orbuff actif. Les Orbuffs épuisés ou au repos dans l’OrbVault ne peuvent pas participer.'],
   ['💰 Réanimation','Starters : gratuit. Common : 250 pièces. Rare : 500. Epic : 1 000. Legendary : 2 000. Mythic : 2 500. Le repos complet hors de l’OrbVault dure 30 min pour Common, 60 pour Rare, 90 min pour Epic et 120 min pour Legendary/Mythic. Un Revive Orb réanime instantanément.']
  ]}
 };
 function language(){try{if(typeof lang!=='undefined'&&COPY[lang])return lang;const selected=document.getElementById('languageSelect')?.value;if(COPY[selected])return selected;const stored=localStorage.getItem('skyPuffLang');if(COPY[stored])return stored}catch(e){}return 'en'}
 function copy(){return COPY[language()]||COPY.en}
 function render(){
  const c=copy(),menu=document.getElementById('gameGuideMenu'),button=document.getElementById('gameGuideBtn');if(button)button.textContent=c.button;if(!menu)return;
  document.getElementById('gameGuideTitle').textContent=c.title;document.getElementById('gameGuideSubtitle').textContent=c.subtitle;document.getElementById('closeGameGuideTop').textContent=`← ${c.back}`;document.getElementById('closeGameGuide').textContent=c.back;
  document.getElementById('gameGuideSections').innerHTML=c.sections.map(([title,body],i)=>`<details ${i===0?'open':''} style="margin:8px 0;padding:11px 13px;border-radius:15px;background:rgba(255,255,255,.82);text-align:left"><summary style="font-weight:1000;color:#35516b;cursor:pointer">${title}</summary><div class="small" style="margin-top:8px;line-height:1.55">${body}</div></details>`).join('');
 }
 function ensure(){
  if(document.getElementById('gameGuideMenu')){render();return}
  const menu=document.createElement('div');menu.id='gameGuideMenu';menu.className='overlay';menu.style.display='none';
  menu.innerHTML='<div class="card" style="width:min(94vw,680px);max-height:94dvh;overflow-y:auto;text-align:left"><button id="closeGameGuideTop" class="secondary" style="display:block;width:auto;min-width:0;margin:0 0 8px;padding:9px 14px;font-size:13px"></button><h1 id="gameGuideTitle" style="font-size:34px;text-align:center"></h1><div id="gameGuideSubtitle" class="small" style="text-align:center;margin-bottom:14px"></div><div id="gameGuideSections"></div><button id="closeGameGuide" class="secondary"></button></div>';
  document.body.appendChild(menu);const close=()=>{menu.style.display='none';document.getElementById('start').style.display='flex'};document.getElementById('closeGameGuideTop').onclick=close;document.getElementById('closeGameGuide').onclick=close;
  const b=document.createElement('button');b.id='gameGuideBtn';b.className='secondary';b.onclick=()=>{render();document.getElementById('start').style.display='none';menu.style.display='flex';menu.scrollTop=0};(document.getElementById('menuMoreGrid')||document.querySelector('#start .menuActions'))?.appendChild(b);render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,80));else setTimeout(ensure,80);
 document.getElementById('languageSelect')?.addEventListener('change',render);
 window.OrbuffGameGuide={open:()=>{ensure();document.getElementById('gameGuideBtn')?.click()},render,getSections:()=>copy().sections,sections:COPY.no.sections};
})();
