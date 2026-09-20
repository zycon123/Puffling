import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// js/orbuff_menu_localization.js is a DOM-text/attribute patch layer that
// rewrites hardcoded Norwegian strings (mostly from legacy feature modules
// like js/puffling_trade.js) into the player's selected language. Strings
// missing from its EXACT/RULES/LEXICON tables silently stay in Norwegian for
// English/German/Spanish/French players. This test extracts every Norwegian
// trade string from the source files and asserts the patch layer actually
// translates each one, for every non-Norwegian language.
const tradeSrc=fs.readFileSync('js/puffling_trade.js','utf8')+fs.readFileSync('js/puffling_trade_inventory_sync.js','utf8');

const KNOWN_NORWEGIAN=[
  'Velg Orbuff…','Velg en Orbuff du vil tilby.','Venn koblet til. Velg Orbuffs.',
  'Serveren fullførte handelen, men lokal samling kunne ikke synkroniseres. Åpne spillet på nytt før ny trade.',
  'Trade-rommet er fullt.','Ugyldig trade-kode.','Trade krever en gyldig Orbuff-konto.',
  'Du kan ikke trade med samme konto.','Trade-inventory er midlertidig utilgjengelig.',
  'Starter Orbuffs kan ikke trades.','Begge må velge en Orbuff først.',
  'Serveren finner ikke den tilbudte Orbuffen i inventory.','Handelen fullføres allerede.',
  'Trade-serveren avviste handlingen.',
  'Trade krever live Orbuff-server. Serveradressen er ikke konfigurert ennå.',
  'Sikrer Orbuff-konto…','Kunne ikke opprette sikker Orbuff-konto for Trade.',
  'Kunne ikke åpne trade-serveren.','Forbindelsen til trade-serveren ble lukket.',
  'Denne Orbuffen kan ikke trades.','Serveren kontrollerer begge inventory…',
  'Trade Orbuffs 🔄','TRADE ORBUFFS 🔄','KODE',
  'DIN ORBUFF','Skriv inn en gyldig 6-tegns trade-kode.',
  'Synkroniserer sikker Orbuff-samling…',
  'Kunne ikke synkronisere Orbuff-samlingen med serveren. Trade er stoppet for å beskytte inventory.',
];

// Sanity check: every string this test actually checks below must still be
// present, verbatim, in the trade source files -- otherwise this test would
// silently stop testing anything if the source text ever drifts again.
for(const s of KNOWN_NORWEGIAN){
  assert.ok(tradeSrc.includes(s),`Expected source string not found (test is stale or source changed): ${JSON.stringify(s)}`);
}

// Load the real localization patch file. It touches `document`/observers at
// top level, so give it just enough of a DOM stub to initialize safely.
const src=fs.readFileSync('js/orbuff_menu_localization.js','utf8');
const context={
  console,
  document:{
    getElementById(){return null},
    querySelectorAll(){return []},
    body:{},
    addEventListener(){},
  },
  MutationObserver:class{observe(){}},
  setTimeout(fn){/* never auto-fire; we call translated() directly */},
};
context.window=context;
vm.createContext(context);
vm.runInContext(src,context,{filename:'js/orbuff_menu_localization.js'});
const {translated}=context.OrbuffMenuLocalization;

// A couple of Norwegian trade strings already happen to equal their English
// form (the "Orbuffs" brand name is used as-is in Norwegian too), so English
// is a legitimate no-op for them -- only German/Spanish/French must change.
const EN_IDENTITY=new Set(['Trade Orbuffs 🔄','TRADE ORBUFFS 🔄']);

for(const lang of ['en','de','es','fr']){
  for(const original of KNOWN_NORWEGIAN){
    const out=translated(original,lang);
    if(lang==='en'&&EN_IDENTITY.has(original))continue;
    assert.notEqual(out,original,
      `${lang}: "${original}" was not translated at all (missing from EXACT/RULES/LEXICON in js/orbuff_menu_localization.js)`);
  }
}

console.log('✅ Every known Puffling Trade string is translated out of Norwegian for en/de/es/fr');
