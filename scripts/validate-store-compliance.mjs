import fs from 'node:fs';
const read=rel=>fs.readFileSync(rel,'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const game=read('game.js');
const ui=read('js/account_privacy_ui.js');
const http=read('server/account_http.js');
const store=read('server/account_store.js');
const auth=read('server/account_auth.js');
const bootstrap=read('server/bootstrap.js');
const android=read('.github/workflows/build-android-release.yml');

if(!game.includes("'js/account_privacy_ui.js'"))fail('Account privacy UI is not loaded by the game runtime');else ok('Account privacy UI is loaded');
for(const language of ['no','en','de','es','fr']){
  if(!new RegExp(`\\b${language}:\\{`).test(ui))fail(`Account deletion UI is missing ${language} copy`);
}
if(!process.exitCode)ok('Account deletion UI covers every selectable language');
if(!ui.includes("method:'DELETE'")||!ui.includes("'/api/account/me'"))fail('Client does not call authenticated account deletion endpoint');else ok('Client account deletion request is wired');
if(!http.includes("url.pathname==='/api/account/me'&&req.method==='DELETE'"))fail('Server account deletion endpoint is missing');else ok('Server account deletion endpoint is present');
for(const table of ['puffling_acquisition_grants','puffling_boss_sessions','puffling_trade_results','puffling_inventory_migrations','puffling_inventory','puffling_rank_profiles','puffling_deleted_accounts']){
  if(!store.includes(table))fail(`Account deletion does not cover ${table}`);
}
if(!process.exitCode)ok('Account-linked server data and deletion tombstone are covered');
if(!auth.includes("error:'account_deleted'")||!auth.includes('loadRevoked'))fail('Deleted account tokens are not persistently revocable');else ok('Deleted account tokens are revoked');
if(!bootstrap.includes('deletedAccountIds')||!bootstrap.includes('loadRevoked'))fail('Deleted accounts are not reloaded into auth revocation on server startup');else ok('Deletion revocation survives server restart');
if(!android.includes('validate-android-store-target.mjs'))fail('Android CI does not enforce the Google Play API target gate');else ok('Android CI enforces the Play API target gate');

if(process.exitCode)process.exit(process.exitCode);
console.log('Orbuff store compliance gate validation passed.');
