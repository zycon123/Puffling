import fs from 'node:fs';

const source=fs.readFileSync('js/puffling_evolution_ui_guard.js','utf8');
const fail=message=>{throw new Error(message)};
for(const code of ['no','en','de','es','fr'])if(!source.includes(`${code}:{card:`))fail(`Starter evolution copy is missing ${code}`);
for(const text of ['Starter • does not evolve','Starter • entwickelt sich nicht','Inicial • no evoluciona','Starter • n’évolue pas'])if(!source.includes(text))fail(`Starter evolution localization is missing: ${text}`);
if(!source.includes("document.getElementById('languageSelect')?.addEventListener('change'"))fail('Starter evolution cards are not refreshed when language changes');
if(/if\(hint\)hint\.textContent='Starter • utvikler seg ikke'/.test(source))fail('Starter evolution guard still hard-codes Norwegian');
console.log('✅ Starter Orbdex evolution copy is localized in all five selectable languages');
