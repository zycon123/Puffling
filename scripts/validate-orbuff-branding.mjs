import fs from 'node:fs';
import vm from 'node:vm';

const read=path=>fs.readFileSync(path,'utf8');
const fail=msg=>{throw new Error(msg)};

const rebrand=read('js/puffling_rebrand.js');
const gameplay=read('js/puffling_gameplay.js');
const progression=read('js/puffling_progression.js');
const creator=read('js/boss_puff_creator_v2.js');
const bossUnlock=read('js/boss_puff_main_unlock.js');
const economy=read('js/reward_economy_hardening.js');
const guide=read('js/orbuff_game_guide.js');
const menuLocalization=read('js/orbuff_menu_localization.js');
const localizationCore=read('js/localization_core.js');

for(const token of ['patchToast','BOSS ORBUFF','RAINBOW BOOST','window.showToast=wrapped']){
  if(!rebrand.includes(token))fail(`Rebrand layer missing ${token}`);
}
if(gameplay.includes('Ingen aktiv Puffling'))fail('Active gameplay HUD can still show Puffling');
if(progression.includes("p?.name||'Puffling'"))fail('Level-up fallback can still show Puffling');
for(const [name,source] of [['Boss Creator',creator],['Boss main unlock',bossUnlock],['Reward copy',economy]]){
  if(/Boss Puff(?![A-Za-z])/i.test(source))fail(`${name} still contains player-facing Boss Puff copy`);
}
for(const token of ['alle 10 bossene','all 10 bosses'])if(!creator.includes(token))fail(`Boss Orbuff Creator missing 10-boss rule: ${token}`);
if(!bossUnlock.includes("IDS=['storm','candy','ice','galaxy','solar','void','thunder','crystal','inferno','cosmic']"))fail('Boss Orbuff unlock no longer requires all 10 boss IDs');
for(const token of ["en:{button:'GAME GUIDE 📖'","title:'Game Guide 📖'","['🎮 How to play'","document.getElementById('languageSelect')?.addEventListener('change',render)"])if(!guide.includes(token))fail(`Localized game guide missing ${token}`);
for(const token of ["['Grafikkmodus','Graphics mode']","['TILBAKE TIL ORBDEX','BACK TO ORBDEX']","['LAG TRADE-KODE','CREATE TRADE CODE']","['KJØP DIAMANTER 💎','BUY DIAMONDS 💎']","LANG_INDEX={de:1,es:2,fr:3}","['Graphics mode','Grafikmodus','Modo gráfico','Mode graphique']","new MutationObserver(schedule)"])if(!menuLocalization.includes(token))fail(`Multilingual menu localization safety net missing ${token}`);

let selectedLanguage='en';
const localizationSandbox={window:{},document:{body:{},getElementById:()=>({value:selectedLanguage,addEventListener(){}}),querySelectorAll:()=>[]},MutationObserver:class{observe(){}},setTimeout(){}};
vm.runInNewContext(menuLocalization,localizationSandbox);
const translate=(language,text)=>{selectedLanguage=language;return localizationSandbox.window.OrbuffMenuLocalization.translated(text)};
for(const [language,source,expected] of [
 ['en','Saldo:','Balance:'],
 ['de','Längere Magnet-varighet.','Längere Magnetdauer.'],
 ['de','Venn koblet til. Velg Pufflings.','Freund verbunden. Wähle Orbuffs.'],
 ['es','Kobler til trade-rom ABC123…','Conectando a la sala de intercambio ABC123…'],
 ['fr','✅ Trade fullført! Du mottok Airbuff.','✅ Échange terminé ! Vous avez reçu Airbuff.'],
 ['de','Begge Orbuffs må være Ascended og level 20 før de kan fusion.','Beide Orbuffs müssen Ascended und Level 20 sein, bevor sie fusionieren können.'],
 ['es','Kjøpte Mystery Boxer lagres uåpnet i Mystery Vault.','Las Mystery Boxes compradas se guardan sin abrir en el Mystery Vault.'],
 ['fr','Bytt én Orbuff mot én Orbuff. Serveren kontrollerer eierskap og fullfører byttet atomisk.','Échangez un Orbuff contre un Orbuff. Le serveur vérifie la propriété et effectue l’échange de façon atomique.']
])if(translate(language,source)!==expected)fail(`${language} late-menu translation failed for ${source}`);

const coreSandbox={window:{},localStorage:{skyPuffLang:'no'}};
vm.runInNewContext(`${localizationCore};window.__testI18n=i18n`,coreSandbox);
const core=coreSandbox.window.__testI18n;
for(const language of ['no','en','de','es','fr']){
 const values=[core[language].hint,core[language].skinsLabel].join(' ');
 if(/Puffling|Sky[ -]?Puff|90\s+(?:seconds|Sekunden|segundos|secondes)|1200, 2000, 3000/i.test(values))fail(`${language} core menu copy still exposes retired branding or rules`);
 if(!/Orbuff/i.test(core[language].skinsLabel))fail(`${language} cosmetics label no longer uses Orbuff branding`);
}

console.log('✅ Orbuff branding validated: toast normalization, HUD/level copy, Boss Orbuff Creator, 10-boss unlock rules and multilingual menu localization');
