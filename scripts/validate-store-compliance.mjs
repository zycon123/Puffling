import fs from 'node:fs';
const read=rel=>fs.readFileSync(rel,'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const game=read('game.js');
const ui=read('js/account_privacy_ui.js');
const links=read('js/privacy_links_ui.js');
const privacy=read('privacy.html');
const deletion=read('delete-account.html');
const leaderboardClient=read('js/leaderboard_submit.js');
const leaderboardHttp=read('server/leaderboard_http.js');
const leaderboardStore=read('server/leaderboard_store.js');
const http=read('server/account_http.js');
const store=read('server/account_store.js');
const auth=read('server/account_auth.js');
const bootstrap=read('server/bootstrap.js');
const android=read('.github/workflows/build-android-release.yml');

if(!game.includes("'js/account_privacy_ui.js'"))fail('Account privacy UI is not loaded by the game runtime');else ok('Account privacy UI is loaded');
if(!game.includes("'js/privacy_links_ui.js'"))fail('Public privacy/deletion links are not loaded by the game runtime');else ok('Public privacy/deletion links are loaded');
for(const language of ['no','en','de','es','fr']){
  if(!new RegExp(`\\b${language}:\\{`).test(ui))fail(`Account deletion UI is missing ${language} copy`);
  if(!new RegExp(`\\b${language}:\\{`).test(links))fail(`Privacy links UI is missing ${language} copy`);
}
if(!process.exitCode)ok('Privacy/account UI covers every selectable language');
if(!ui.includes("method:'DELETE'")||!ui.includes("'/api/account/me'"))fail('Client does not call authenticated account deletion endpoint');else ok('Client account deletion request is wired');
if(!http.includes("url.pathname==='/api/account/me'&&req.method==='DELETE'"))fail('Server account deletion endpoint is missing');else ok('Server account deletion endpoint is present');
for(const table of ['puffling_acquisition_grants','puffling_boss_sessions','puffling_trade_results','puffling_inventory_migrations','puffling_inventory','puffling_rank_profiles','puffling_scores','puffling_deleted_accounts']){
  if(!store.includes(table))fail(`Account deletion does not cover ${table}`);
}
if(!process.exitCode)ok('Account-linked server data, leaderboard rows and deletion tombstone are covered');
if(!auth.includes("error:'account_deleted'")||!auth.includes('loadRevoked'))fail('Deleted account tokens are not persistently revocable');else ok('Deleted account tokens are revoked');
if(!bootstrap.includes('deletedAccountIds')||!bootstrap.includes('loadRevoked'))fail('Deleted accounts are not reloaded into auth revocation on server startup');else ok('Deletion revocation survives server restart');
if(!android.includes('validate-android-store-target.mjs'))fail('Android CI does not enforce the Google Play API target gate');else ok('Android CI enforces the Play API target gate');

if(!leaderboardStore.includes('account_id varchar(96)')||!leaderboardStore.includes('puffling_scores_account_idx'))fail('Leaderboard database is not prepared for guest-account linkage');else ok('Leaderboard database supports guest-account linkage');
if(!leaderboardHttp.includes('authorization')||!leaderboardHttp.includes('auth.verify(token)'))fail('Leaderboard HTTP route does not validate optional guest auth');else ok('Leaderboard HTTP route validates linked guest accounts');
if(!leaderboardClient.includes('pufflingAccountAuthToken')||!leaderboardClient.includes('Authorization'))fail('Leaderboard client does not attach guest auth when available');else ok('Leaderboard client links new online scores to guest accounts');

const privacyUrl='https://zycon123.github.io/Puffling/privacy.html';
const deletionUrl='https://zycon123.github.io/Puffling/delete-account.html';
if(!links.includes(privacyUrl)||!links.includes(deletionUrl))fail('In-app privacy links do not point to the public GitHub Pages resources');else ok('In-app privacy links point to public resources');
for(const [name,source,needles] of [
  ['privacy policy',privacy,['Orbuff Privacy Policy','Zycon Studios','zyconstudios@protonmail.com','delete-account.html']],
  ['account deletion page',deletion,['Delete Orbuff Account & Data','Zycon Studios','zyconstudios@protonmail.com','Account Deletion Request']]
]){
  for(const needle of needles)if(!source.includes(needle))fail(`${name} is missing required content: ${needle}`);
}
if(!process.exitCode)ok('Public privacy and deletion pages contain required app/developer/contact information');
if(!/mailto:zyconstudios@protonmail\.com\?subject=Orbuff%20Account%20Deletion%20Request/.test(deletion))fail('External deletion page does not provide a direct deletion request route');else ok('External deletion request route is present');

if(process.exitCode)process.exit(process.exitCode);
console.log('Orbuff store compliance gate validation passed.');
