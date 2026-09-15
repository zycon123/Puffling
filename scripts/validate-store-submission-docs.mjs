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
const iosWorkflow=read('.github/workflows/build-ios-release.yml');
const iosSigningValidator=read('scripts/validate-ios-signing.mjs');
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

const androidSecrets=['ORBUFF_ANDROID_KEYSTORE_BASE64','ORBUFF_ANDROID_KEY_ALIAS','ORBUFF_ANDROID_STORE_PASSWORD','ORBUFF_ANDROID_KEY_PASSWORD'];
for(const secret of androidSecrets){
  if(!signing.includes(secret))fail(`Signing guide is missing Android secret: ${secret}`);
  if(!androidWorkflow.includes(secret))fail(`Android workflow is missing secret: ${secret}`);
}
if(!androidWorkflow.includes('Android production signing is partially configured'))fail('Android workflow does not fail closed on partial signing configuration');
if(!androidWorkflow.includes('jarsigner -verify'))fail('Android signed bundle is not verified after signing');
if(!signing.includes('assets/logo.svg')||!signing.includes('assets/logo-dark.svg'))fail('Signing guide must use canonical SVG native artwork');
if(!process.exitCode)ok('Android production signing is documented and fail-closed in CI');

const iosSecrets=['ORBUFF_IOS_DISTRIBUTION_CERT_BASE64','ORBUFF_IOS_CERT_PASSWORD','ORBUFF_IOS_PROVISIONING_PROFILE_BASE64','ORBUFF_APPLE_TEAM_ID'];
for(const secret of iosSecrets){
  if(!signing.includes(secret))fail(`Signing guide is missing iOS secret: ${secret}`);
  if(!iosWorkflow.includes(secret))fail(`iOS workflow is missing secret: ${secret}`);
  if(!iosSigningValidator.includes(secret))fail(`iOS signing validator is missing secret: ${secret}`);
}
for(const token of ['Xcode 26','iOS 26 SDK','Provisioning profile Team ID','com.zyconstudios.orbuff','orbuff-ios-app-store-ipa','orbuff-ios-app-store-xcarchive']){
  if(!signing.includes(token))fail(`iOS signing guide is missing: ${token}`);
}
for(const token of ['Validate Apple toolchain','Validate production signing secret set','Production App Store signing material validated','xcodebuild -exportArchive','codesign --verify --deep --strict','app-store-connect']){
  if(!iosWorkflow.includes(token))fail(`iOS workflow is missing production signing control: ${token}`);
}
if(!iosSigningValidator.includes('partially configured'))fail('iOS signing validator does not fail closed on partial secret configuration');
if(!process.exitCode)ok('iOS App Store archive/IPA signing is documented and fail-closed in CI');

for(const futureUploadKey of ['ORBUFF_ASC_KEY_ID','ORBUFF_ASC_ISSUER_ID','ORBUFF_ASC_PRIVATE_KEY']){
  if(!signing.includes(futureUploadKey))fail(`Signing guide is missing future explicit TestFlight upload key: ${futureUploadKey}`);
}
if(!signing.includes('Product → Archive')||!signing.includes('TestFlight'))fail('iOS local signing/TestFlight path is incomplete');
if(!process.exitCode)ok('Manual and future explicit TestFlight upload paths are documented');

if(process.exitCode)process.exit(process.exitCode);
console.log('Orbuff store submission documentation validation passed.');
