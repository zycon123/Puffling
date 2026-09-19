import fs from 'node:fs';

const source=fs.readFileSync('js/puffling_evolution_ui_guard.js','utf8');
const fail=message=>{throw new Error(message)};
for(const code of ['no','en','de','es','fr'])if(!source.includes(`${code}:{card:`))fail(`Starter evolution copy is missing ${code}`);
for(const text of ['Starter • does not evolve','Starter • entwickelt sich nicht','Inicial • no evoluciona','Starter • n’évolue pas'])if(!source.includes(text))fail(`Starter evolution localization is missing: ${text}`);
if(!source.includes("document.getElementById('languageSelect')?.addEventListener('change'"))fail('Starter evolution cards are not refreshed when language changes');
if(/if\(hint\)hint\.textContent='Starter • utvikler seg ikke'/.test(source))fail('Starter evolution guard still hard-codes Norwegian');
console.log('✅ Starter Orbdex evolution copy is localized in all five selectable languages');

// MutationObserver must settle after translating, including when a starter is
// first selected and the previously empty Orbdex grid is populated.
const {default:vm}=await import('node:vm');
const {default:assert}=await import('node:assert/strict');
for(const language of ['no','en','de','es','fr']){
 let value='Evolution available',writes=0;
 const hint={get textContent(){return value},set textContent(text){value=text;writes++}};
 const card={dataset:{pufflingId:'starterpuff'},querySelectorAll:()=>[hint]};
 const context={lang:language,setTimeout(){},document:{readyState:'complete',querySelectorAll:()=>[card],getElementById:()=>null}};
 context.window=context;vm.createContext(context);vm.runInContext(source,context);
 context.SkyPuffEvolutionEligibilityUI.patch();
 assert.equal(writes,1,language+' translates the initial hint');
 context.SkyPuffEvolutionEligibilityUI.patch();
 context.SkyPuffEvolutionEligibilityUI.patch();
 assert.equal(writes,1,language+' observer converges without redundant DOM writes');
}
console.log('✅ Starter evolution observer settles in all five languages without freezing onboarding');
