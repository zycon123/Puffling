/* Orbuff — late-menu English localization safety net v1.0.
 * Legacy feature modules still use Norwegian internally. This reversible layer
 * keeps every player-facing menu English when English is selected.
 */
(function(){
 const EXACT=new Map([
  ['Kontrollerer spillstatus…','Checking game status…'],['Laster...','Loading...'],['Laster…','Loading…'],['NULLSTILL BETA-DATA','RESET BETA DATA'],
  ['Grafikkmodus','Graphics mode'],['Auto anbefales. Low reduserer Orbuff-glow og effekter for bedre stabilitet.','Auto is recommended. Low reduces Orbuff glow and effects for better stability.'],
  ['TILBAKE TIL ORBDEX','BACK TO ORBDEX'],['TILBAKE','BACK'],['FUSIONER','FUSE'],['Uoppdaget Orbuff ❔','Undiscovered Orbuff ❔'],
  ['Finn denne Orbuffen for å låse opp detaljene og evolution-formene.','Find this Orbuff to unlock its details and evolution forms.'],
  ['Begge Orbuffs må være Ascended og level 20 før de kan fusion.','Both Orbuffs must be Ascended and level 20 before they can fuse.'],
  ['Begge Orbuffs må være level 20 og Ascended.','Both Orbuffs must be level 20 and Ascended.'],['🔒 Begge Orbuffs må være level 20 og Ascended.','🔒 Both Orbuffs must be level 20 and Ascended.'],
  ['Ingen kjent fusion for denne kombinasjonen.','No known Fusion for this combination.'],['Ingen level 20 Ascended Orbuffs','No level 20 Ascended Orbuffs'],
  ['Klekk egg og legg opptil 3 Orbuffs i OrbVault for å beskytte dem mot Fusion.','Hatch eggs and place up to 3 Orbuffs in the OrbVault to protect them from Fusion.'],
  ['Trykk på en tom plass og velg Orbuffen du vil beskytte.','Tap an empty slot and choose the Orbuff you want to protect.'],
  ['Alle Orbuffs – trykk på en Orbuff under for å legge den i neste ledige plass eller fjerne den fra OrbVault.','All Orbuffs — tap an Orbuff below to place it in the next available slot or remove it from the OrbVault.'],
  ['OPPGRADER ORBVAULT','UPGRADE ORBVAULT'],['ORBVAULT MAX LEVEL ✓','ORBVAULT MAX LEVEL ✓'],['TOM PLASS','EMPTY SLOT'],['LEGG I NESTE LEDIGE','PLACE IN NEXT AVAILABLE SLOT'],['FJERN','REMOVE'],['AVBRYT','CANCEL'],
  ['Standard og vanlige Orbuffs vises først.','Standard and Common Orbuffs are shown first.'],['Ingen ubeskyttede Orbuffs er tilgjengelige.','No unprotected Orbuffs are available.'],['Ingen Orbuffs eid ennå.','No Orbuffs owned yet.'],
  ['Legg en Orbuff i OrbVault for å starte hvile, energilading og passiv XP.','Place an Orbuff in the OrbVault to start resting, recharging energy, and earning passive XP.'],
  ['Kjøpte Mystery Boxer lagres uåpnet i Mystery Vault.','Purchased Mystery Boxes are stored unopened in the Mystery Vault.'],['KJØP DIAMANTER 💎','BUY DIAMONDS 💎'],
  ['Åpne én vanlig Mystery Box, eller kombiner 3 uåpnede boxer til ett garantert Orbuff-egg.','Open one regular Mystery Box, or combine 3 unopened boxes into one guaranteed Orbuff Egg.'],
  ['ÅPNE 1 BOX','OPEN 1 BOX'],['Vanlig Mystery Box','Regular Mystery Box'],['3 Boxer → garantert egg','3 Boxes → guaranteed Egg'],
  ['Odds vises før diamanter brukes. Betalte diamanter verifiseres og lagres på server.','Odds are shown before Diamonds are spent. Paid Diamonds are verified and stored on the server.'],
  ['Saldo:','Balance:'],['Kjøp med ekte penger er deaktivert i web-betaen.','Real-money purchases are disabled in the web beta.'],
  ['Målpriser: 25 💎 = €1 • 75 💎 = €3 • 250 💎 = €9 • 600 💎 = €16. Endelig pris og valuta kommer alltid fra App Store eller Google Play. Diamanter krediteres først etter serververifisering.','Target prices: 25 💎 = €1 • 75 💎 = €3 • 250 💎 = €9 • 600 💎 = €16. Final price and currency always come from the App Store or Google Play. Diamonds are credited only after server verification.'],
  ['Bytt én Orbuff mot én Orbuff. Serveren kontrollerer eierskap og fullfører byttet atomisk.','Trade one Orbuff for one Orbuff. The server verifies ownership and completes the trade atomically.'],
  ['Trade-regler: Starter Orbuffs og Vault-beskyttede kopier kan ikke trades. XP/evolution følger ikke den tradede kopien.','Trade rules: Starter Orbuffs and Vault-protected copies cannot be traded. XP/evolution does not follow the traded copy.'],
  ['LAG TRADE-KODE','CREATE TRADE CODE'],['BLI MED','JOIN'],['TRADE-KODE','TRADE CODE'],['Lag eller bli med i et trade-rom.','Create or join a Trade room.'],['DIN ORBUFF','YOUR ORBUFF'],['Velg Orbuff…','Choose Orbuff…'],['Velg en Orbuff du vil tilby.','Choose an Orbuff to offer.'],['MOTSPILLER','OPPONENT'],['Venter på motspillerens tilbud…','Waiting for the opponent’s offer…'],['GODKJENN BYTTE','ACCEPT TRADE'],['NULLSTILL TILBUD','RESET OFFER'],
  ['FULLFØRT ✅','COMPLETED ✅'],['LÅST 🔒','LOCKED 🔒'],['Ingen reparasjoner registrert','No repairs recorded'],['Ikke tilgjengelig','Unavailable'],['Ingen aktive feil','No active errors'],['Ingen lagret feil','No saved errors'],['Siste runtime-feil','Latest runtime error'],
  ['localStorage tilgjengelig','localStorage available'],['localStorage utilgjengelig','localStorage unavailable'],['Diagnostikkmotor mangler','Diagnostics engine missing'],['Smoke check mangler','Smoke Check missing'],
  ['Lokal beta-profil er forventet i nettlesertest','A local beta profile is expected in browser testing'],['Lokal beta-inventory er forventet før innlogging/synk','Local beta inventory is expected before sign-in/sync'],['Web-beta: ekte kjøp er med vilje deaktivert; aktiveres i signert mobilapp','Web beta: real purchases are intentionally disabled; enabled in the signed mobile app'],
  ['Systemstatus: OK ✅ • Launch-klar','System status: OK ✅ • Launch-ready'],['Aktiv: AUTO (HIGH)','Active: AUTO (HIGH)'],['Aktiv: AUTO (LOW)','Active: AUTO (LOW)']
 ]);
 const RULES=[
  [/\bAlle (?:Pufflings|Orbuffs)\b/g,'All Orbuffs'],
  [/– trykk på en (?:Puffling|Orbuff) under for å legge den i neste ledige plass eller fjerne den fra OrbVault\./g,'— tap an Orbuff below to place it in the next available slot or remove it from the OrbVault.'],
  [/Åpne én vanlig Mystery Box, eller kombiner 3 uåpnede (?:boxer|boxes) til ett garantert (?:Puffling|Orbuff)-egg\./g,'Open one regular Mystery Box, or combine 3 unopened boxes into one guaranteed Orbuff Egg.'],
  [/Starter (?:Pufflings|Orbuffs) og Vault-beskyttede kopier kan ikke trades\. XP\/evolution følger ikke den tradede kopien\./g,'Starter Orbuffs and Vault-protected copies cannot be traded. XP/evolution does not follow the traded copy.'],
  [/\bTrade-regler:/g,'Trade rules:'],[/\bSaldo:/g,'Balance:'],[/\bDu:/g,'You:'],[/\bMotspiller:/g,'Opponent:'],
  [/Ingen reparasjoner registrert/g,'No repairs recorded'],[/Statusdetaljer/g,'Status details'],[/Siste runtime-feil/g,'Latest runtime error'],
  [/\bAktiv:\s*/g,'Active: '],[/\bOppdaget (\d+) \/ (\d+) Orbuffs • Trykk på en Orbuff for detaljer/g,'Discovered $1 / $2 Orbuffs • Tap an Orbuff for details'],
  [/\bIkke oppdaget\b/g,'Not discovered'],[/\bTrykk for detaljer\b/g,'Tap for details'],[/\bTrykk for evolution →\b/g,'Tap for evolution →'],[/\bTRYKK FOR Å SE\b/g,'TAP TO VIEW'],
  [/\bEier x/g,'Owned x'],[/\bEnergi:/g,'Energy:'],[/\bUTMATTET\b/g,'EXHAUSTED'],[/\bLÅST OPP ✓\b/g,'UNLOCKED ✓'],[/\bFORHÅNDSVISNING 🔒\b/g,'PREVIEW 🔒'],[/\bLÅSES OPP SENERE 🔒\b/g,'UNLOCKS LATER 🔒'],
  [/\bGJENOPPLIV\b/g,'REVIVE'],[/\bBRUK REVIVE ORB\b/g,'USE REVIVE ORB'],[/\bAKTIV ORBUFF ✓\b/g,'ACTIVE ORBUFF ✓'],[/\bVELG ORBUFF\b/g,'SELECT ORBUFF'],
  [/Evolution låses opp automatisk på Level 10 og Level 20\./g,'Evolution unlocks automatically at Level 10 and Level 20.'],
  [/OPPGRADER TIL LEVEL (\d+) •/g,'UPGRADE TO LEVEL $1 •'],[/([0-9]+) plasser • \+1 energi hvert ([0-9]+)\. min • ([0-9]+) XP\/time/g,'$1 slots • +1 energy every $2 min • $3 XP/hour'],
  [/Revive Orbs: ([0-9]+) • låses opp som daglig bonus på Level 5/g,'Revive Orbs: $1 • unlock as a daily bonus at Level 5'],[/ • 15 % daglig sjanse/g,' • 15% daily chance'],
  [/PLASS ([0-9]+) • TRYGG 🔒/g,'SLOT $1 • SAFE 🔒'],[/TRYKK • PLASS ([0-9]+)/g,'TAP • SLOT $1'],[/Velg Orbuff til plass ([0-9]+)/g,'Choose an Orbuff for slot $1'],[/EIER x/g,'OWNED x'],[/1 TRYGG 🔒 • ([0-9]+) UTE/g,'1 SAFE 🔒 • $1 OUTSIDE'],
  [/Full energi/g,'Full energy'],[/Neste energi om/g,'Next energy in'],[/Neste ([0-9]+) XP om/g,'Next $1 XP in'],
  [/\bOpptjent: ([0-9]+) • Kjøpt: ([0-9]+)/g,'Earned: $1 • Purchased: $2'],[/\bBOXER\b/g,'BOXES'],[/\bBoxer\b/g,'Boxes'],[/\bboxer\b/g,'boxes'],[/\bgarantert egg\b/g,'guaranteed Egg'],
  [/€([0-9]+) målpris/g,'€$1 target price'],[/€([0-9]+) • pris lastes fra butikk/g,'€$1 • price loading from store'],
  [/([0-9]+)\/7 achievements fullført/g,'$1/7 achievements completed'],[/ i én run/g,' in one run'],[/endless-events fullført/g,'endless events completed'],[/Tier 3\+ boss beseiret/g,'Tier 3+ boss defeated'],[/Beseir en Tier 3\+ boss/g,'Defeat a Tier 3+ boss'],[/boss-seire/g,'boss wins'],
  [/([0-9]+) auto-reparasjoner/g,'$1 automatic repairs'],[/([0-9]+) blokkerte submissions/g,'$1 blocked submissions'],[/Systemstatus: ([0-9]+) feil funnet/g,'System status: $1 errors found'],[/Systemstatus: ([0-9]+) advarsel\(er\)/g,'System status: $1 warning(s)'],[/Spillstatus: OK ✅ • ([0-9]+) launch-punkt gjenstår/g,'Game status: OK ✅ • $1 launch item(s) remain'],
  [/Ikke konfigurert — lokal\/test-ghost brukes/g,'Not configured — local/test ghost is used'],[/Lokal fallback/g,'Local fallback'],[/konto- og serverlagret profil/g,'account and server-stored profile'],
  [/TILBAKE/g,'BACK']
 ];
 const originalText=new WeakMap(),originalAttr=new WeakMap();let scheduled=false;
 function english(){return document.getElementById('languageSelect')?.value==='en'}
 function translated(value){let out=EXACT.get(value)||value;for(const [pattern,replacement] of RULES)out=out.replace(pattern,replacement);return out}
 function textNodes(root,out=[]){for(const node of root?.childNodes||[]){if(node.nodeType===3)out.push(node);else if(node.nodeType===1)textNodes(node,out)}return out}
 function syncText(node,useEnglish){const record=originalText.get(node);if(useEnglish){if(record&&node.nodeValue===record.translated)return;const source=record&&node.nodeValue===record.original?record.original:node.nodeValue;const value=translated(source);originalText.set(node,{original:source,translated:value});if(value!==node.nodeValue)node.nodeValue=value;}else if(record){if(node.nodeValue===record.translated)node.nodeValue=record.original;originalText.delete(node)}}
 function syncAttr(el,name,useEnglish){const key=`${name}`;let records=originalAttr.get(el);if(!records){records={};originalAttr.set(el,records)}const record=records[key];if(useEnglish){const current=el.getAttribute(name);if(current==null)return;if(record&&current===record.translated)return;const source=record&&current===record.original?record.original:current,value=translated(source);records[key]={original:source,translated:value};if(value!==current)el.setAttribute(name,value);}else if(record){if(el.getAttribute(name)===record.translated)el.setAttribute(name,record.original);delete records[key]}}
 function sync(){scheduled=false;const useEnglish=english();for(const root of document.querySelectorAll('.overlay[id]')){for(const node of textNodes(root))syncText(node,useEnglish);for(const el of root.querySelectorAll('[placeholder],[aria-label],[title]'))for(const name of ['placeholder','aria-label','title'])syncAttr(el,name,useEnglish)}}
 function schedule(){if(scheduled)return;scheduled=true;setTimeout(sync,0)}
 const select=document.getElementById('languageSelect');select?.addEventListener('change',()=>{sync();setTimeout(sync,60);setTimeout(sync,300)});
 if(typeof MutationObserver==='function')new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
 [0,120,500,1200].forEach(ms=>setTimeout(sync,ms));window.OrbuffMenuLocalization={sync,translated};
})();
