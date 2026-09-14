/* Orbuff — in-game rules and rewards guide v1.0 */
(function(){
 const sections=[
  ['🎮 Slik spiller du','Hopp oppover, land på plattformer og samle mynter. Unngå fiender og bruk Rainbow Boost når måleren er klar. Et tap avslutter runden og bruker 1 energi på aktiv Orbuff.'],
  ['❤️ Orbuff-energi','Vanlige Orbuffs har 5 energi. Ascended Orbuffs har 6. Ett energipoeng mistes ved tap. Ved 0 energi er Orbuffen utmattet og må hvile eller gjenopplives. Level og evolution beholdes.'],
  ['🔐 OrbVault – hvile og trening','Orbuffs i OrbVault er beskyttet mot Fusion og Trade, kan ikke brukes mens de hviler, får passiv XP og lader energi. Level 1 har 3 plasser og gir 1 energi hvert 15. minutt. Oppgraderinger gir opptil 8 plasser, raskere lading og 10 XP per time. Level 5 gir også 15 % daglig sjanse for en Revive Orb.'],
  ['🌱 Evolution','Orbuffs blir Evolved på level 10 og Ascended på level 20. Starterne Airbuff, Rainbuff og Sparkbuff utvikler seg ikke.'],
  ['🧬 Fusion','Begge Orbuffs må være level 20 og Ascended. Fusion bruker begge valgte Orbuffs. Beskyttede kopier i OrbVault kan ikke brukes.'],
  ['🥚 Nursery','Egg kan klekke nye Orbuffs. Rare Egg gir Common eller Rare, Epic Egg gir Epic, og Legendary Egg gir Legendary. Starter-Orbuffs kan ikke klekkes fra egg.'],
  ['🎁 Belønninger','Mynter fås gjennom spilling, oppdrag, daglig belønning og Boss Rush. Bosser kan gi Orbuffs og andre belønninger. Mystery Boxes kan gi mynter, diamanter og egg-relaterte belønninger.'],
  ['👑 Bosser og Boss Rush','Vanlig spill fortsetter etter hver beseiret boss. Boss Rush lar deg kjempe på nytt mot bosser du allerede har slått og gir 100 mynter per seier.'],
  ['🏁 Race My Orbuff','Førstemann til 1500 meter vinner. Hver spiller kan angripe opptil 3 ganger, med 4 sekunders cooldown. Orbuffene har forskjellige Race-effekter.'],
  ['💰 Gjenoppliving','Startere: gratis. Common: 250 mynter. Rare: 500. Epic: 1 000. Legendary: 2 000. Mythic: 2 500. Full hviletid uten OrbVault er 30/60/90/120 minutter etter sjeldenhet. En Revive Orb gjenoppliver umiddelbart.']
 ];
 function ensure(){
  if(document.getElementById('gameGuideMenu'))return;
  const menu=document.createElement('div');menu.id='gameGuideMenu';menu.className='overlay';menu.style.display='none';
  menu.innerHTML=`<div class="card" style="width:min(94vw,680px);max-height:94dvh;overflow-y:auto;text-align:left"><button id="closeGameGuideTop" class="secondary" style="display:block;width:auto;min-width:0;margin:0 0 8px;padding:9px 14px;font-size:13px">← TILBAKE</button><h1 style="font-size:34px;text-align:center">Spillguide 📖</h1><div class="small" style="text-align:center;margin-bottom:14px">Regler, belønninger og systemer i Orbuff.</div><div id="gameGuideSections">${sections.map(([title,body],i)=>`<details ${i===0?'open':''} style="margin:8px 0;padding:11px 13px;border-radius:15px;background:rgba(255,255,255,.82);text-align:left"><summary style="font-weight:1000;color:#35516b;cursor:pointer">${title}</summary><div class="small" style="margin-top:8px;line-height:1.55">${body}</div></details>`).join('')}</div><button id="closeGameGuide" class="secondary">TILBAKE</button></div>`;
  document.body.appendChild(menu);const close=()=>{menu.style.display='none';document.getElementById('start').style.display='flex'};document.getElementById('closeGameGuideTop').onclick=close;document.getElementById('closeGameGuide').onclick=close;
  const b=document.createElement('button');b.id='gameGuideBtn';b.className='secondary';b.textContent='SPILLGUIDE 📖';b.onclick=()=>{document.getElementById('start').style.display='none';menu.style.display='flex';menu.scrollTop=0};(document.getElementById('menuMoreGrid')||document.querySelector('#start .menuActions'))?.appendChild(b);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ensure,80));else setTimeout(ensure,80);
 window.OrbuffGameGuide={open:()=>{ensure();document.getElementById('gameGuideBtn')?.click()},sections};
})();