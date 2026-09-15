import fs from 'node:fs';

const read=rel=>fs.readFileSync(rel,'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const privacy=read('docs/STORE_PRIVACY_FORM_ANSWERS.md');
const signing=read('docs/STORE_SIGNING_SETUP.md');
const metadata=read('docs/STORE_SUBMISSION_METADATA.md');
const listing=read('docs/STORE_LISTING_COPY.md');
const androidWorkflow=read('.github/workflows/build-android-release.yml');
const release=JSON.parse(read('release.config.json'));

const identity=[release.appName,release.appId,release.version,String(release.buildNumber)];
for(const [name,source] of [['privacy answers',privacy],['signing guide',signing],['submission metadata',metadata]]){
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
for(const key of ['Personal info → Name','Personal info → User IDs','App activity → Other actions','App info and performance → Diagnostics','Other user-generated content']){
  if(!privacy.includes(key))fail(`Google Data Safety working sheet is missing: ${key}`);
}
if(!process.exitCode)ok('Apple and Google data categories are documented');

if(!privacy.includes('real-money purchases remain disabled')&&!privacy.includes('real-money Diamond purchasing is **not enabled'))fail('Privacy sheet must keep paid IAP scoped as disabled for the current submission');
if(!listing.includes('Real-money Diamond purchases must not be described as live'))fail('Store listing copy must keep paid Diamonds fail-closed');
else ok('Store forms/listing keep paid IAP fail-closed');

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
