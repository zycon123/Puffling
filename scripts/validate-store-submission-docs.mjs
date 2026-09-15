import fs from 'node:fs';

const read=rel=>fs.readFileSync(rel,'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const privacy=read('docs/STORE_PRIVACY_FORM_ANSWERS.md');
const signing=read('docs/STORE_SIGNING_SETUP.md');
const metadata=read('docs/STORE_SUBMISSION_METADATA.md');
const listing=read('docs/STORE_LISTING_COPY.md');
const rating=read('docs/CONTENT_RATING_AUDIT.md');
const assets=read('docs/STORE_ASSET_SPEC.md');
const deviceChecklist=read('docs/PHYSICAL_DEVICE_RELEASE_CHECKLIST.md');
const mystery=read('js/diamond_mystery_shop.js');
const leaderboardClient=read('js/leaderboard_submit.js');
const leaderboardStore=read('server/leaderboard_store.js');
const androidWorkflow=read('.github/workflows/build-android-release.yml');
const release=JSON.parse(read('release.config.json'));

const identity=[release.appName,release.appId,release.version,String(release.buildNumber)];
for(const [name,source] of [['privacy answers',privacy],['signing guide',signing],['submission metadata',metadata],['device checklist',deviceChecklist]]){
  for(const value of identity)if(!source.includes(value))fail(`${name} is missing release identity value: ${value}`);
}
if(!process.exitCode)ok('Store documents use the canonical Orbuff release identity');

for(const url of ['https://zycon123.github.io/Puffling/privacy.html','https://zycon123.github.io/Puffling/delete-account.html']){
  if(!privacy.includes(url)||!metadata.includes(url))fail(`Store privacy/submission docs are missing public URL: ${url}`);
}
if(!process.exitCode)ok('Store documents contain the public privacy and deletion URLs');

for(const key of ['User ID','Gameplay Content','Email Address','Customer Support','Other Diagnostic Data']){
  if(!privacy.includes(key))fail(`Apple privacy working sheet is missing: ${key}`);
}
for(const key of ['Personal info → User IDs','App activity → Other actions','App info and performance → Diagnostics','Other user-generated content']){
  if(!privacy.includes(key))fail(`Google Data Safety working sheet is missing: ${key}`);
}
if(!privacy.includes('Personal info → Name / local player nickname — not transmitted'))fail('Privacy sheet must document that the local player nickname is not collected by the audited leaderboard flow');
if(!process.exitCode)ok('Apple and Google data categories match the anonymous public leaderboard design');

if(!privacy.includes('real-money purchases remain disabled')&&!privacy.includes('real-money Diamond purchasing is **not enabled'))fail('Privacy sheet must keep paid IAP scoped as disabled for the current submission');
if(!listing.includes('Real-money Diamond purchases must not be described as live'))fail('Store listing copy must keep paid Diamonds fail-closed');
else ok('Store forms/listing keep paid IAP fail-closed');

for(const token of ['Cartoon or Fantasy Violence','Loot Boxes','Gambling = **No**','Contests = **Yes**','Messaging and Chat = **No**','User-Generated Content = **No**']){
  if(!rating.includes(token))fail(`Content rating audit is missing: ${token}`);
}
if(!rating.includes('target audience is a publisher decision'))fail('Content rating audit must leave target audience as an explicit publisher decision');
if(!process.exitCode)ok('Content-rating questionnaire working answers are documented');

for(const token of ['512 × 512 px','1024 × 500 px','1080 × 1920','1320 × 2868','2064 × 2752']){
  if(!assets.includes(token))fail(`Store asset spec is missing required working size: ${token}`);
}
if(!assets.includes('real-money Diamond purchasing')&&!assets.includes('paid Diamonds'))fail('Store asset spec must prevent disabled paid IAP from appearing in launch screenshots');
if(!process.exitCode)ok('Store asset production sizes and capture rules are documented');

for(const token of ['Clean install succeeds','Boss 10','No Fusion Crystal appears as a Mystery Box reward','Orbuff-XXXXXX','Google Play Internal','TestFlight']){
  if(!deviceChecklist.includes(token))fail(`Physical device checklist is missing launch test: ${token}`);
}
if(!process.exitCode)ok('Physical Android/iOS end-to-end release checklist is documented');

if(/Fusion Crystal/.test(mystery))fail('Mystery Shop still exposes removed Fusion Crystal content');
for(const token of ["id:'coins1000'","weight:26","amount:1000",'1000 Coins — 26%'])if(!mystery.includes(token))fail(`Mystery Shop replacement reward is missing: ${token}`);
if(!process.exitCode)ok('Mystery Shop no longer contains Fusion Crystal and preserves the 26% reward slot');

if(/JSON\.stringify\(\{name,/.test(leaderboardClient)||/body:JSON\.stringify\(\{name/.test(leaderboardClient))fail('Leaderboard client is still transmitting the player-entered name');
for(const token of ['publicAlias(identityKey)',"return `Orbuff-${code}`","userGeneratedNames:false","player_name='Orbuff Player'"]){
  if(!leaderboardStore.includes(token))fail(`Leaderboard public-alias protection is missing: ${token}`);
}
if(!process.exitCode)ok('Public leaderboard uses server-generated aliases instead of player-entered free text');

const secrets=['ORBUFF_ANDROID_KEYSTORE_BASE64','ORBUFF_ANDROID_KEY_ALIAS','ORBUFF_ANDROID_STORE_PASSWORD','ORBUFF_ANDROID_KEY_PASSWORD'];
for(const secret of secrets){
  if(!signing.includes(secret))fail(`Signing guide is missing secret: ${secret}`);
  if(!androidWorkflow.includes(secret))fail(`Android workflow is missing secret: ${secret}`);
}
if(!androidWorkflow.includes('Android production signing is partially configured'))fail('Android workflow does not fail closed on partial signing configuration');
if(!androidWorkflow.includes('jarsigner -verify'))fail('Android signed bundle is not verified after signing');
if(!process.exitCode)ok('Android production signing is documented and fail-closed in CI');

for(const appleKey of ['ORBUFF_APPLE_TEAM_ID','ORBUFF_ASC_KEY_ID','ORBUFF_ASC_ISSUER_ID','ORBUFF_ASC_PRIVATE_KEY']){
  if(!signing.includes(appleKey))fail(`iOS future signing guide is missing placeholder: ${appleKey}`);
}
if(!signing.includes('Xcode')||!signing.includes('Product → Archive')||!signing.includes('TestFlight'))fail('iOS signing guide is incomplete');
if(!process.exitCode)ok('iOS manual signing/TestFlight path is documented');

if(process.exitCode)process.exit(process.exitCode);
console.log('Orbuff store submission documentation validation passed.');
