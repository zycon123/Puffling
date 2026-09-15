import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const checkOnly=process.argv.includes('--check');
const packagePath=path.join(root,'node_modules','@capgo','native-purchases','package.json');
const swiftPath=path.join(root,'node_modules','@capgo','native-purchases','ios','Sources','NativePurchasesPlugin','NativePurchasesPlugin.swift');
const expectedVersion='8.7.0';
const marker='ORBUFF_SERVER_VERIFICATION_PATCH';

function fail(message){
  console.error(`❌ ${message}`);
  process.exit(1);
}

if(!fs.existsSync(packagePath))fail('@capgo/native-purchases is not installed');
const pkg=JSON.parse(fs.readFileSync(packagePath,'utf8'));
if(pkg.version!==expectedVersion)fail(`Expected @capgo/native-purchases ${expectedVersion}, found ${pkg.version||'unknown'}`);
if(!fs.existsSync(swiftPath))fail('NativePurchasesPlugin.swift was not found in the installed plugin');

let source=fs.readFileSync(swiftPath,'utf8');
if(source.includes(marker)){
  console.log(`✅ Orbuff native-purchases safety patch is present for ${expectedVersion}`);
  process.exit(0);
}
if(checkOnly)fail('Orbuff native-purchases safety patch is missing');

const start=source.indexOf('private func startTransactionUpdatesListener()');
const end=source.indexOf('@objc func isBillingSupported',start);
if(start<0||end<0)fail('Could not locate the iOS Transaction.updates listener');
const before=source.slice(0,start);
let block=source.slice(start,end);
const after=source.slice(end);
const finishLine='                    await transaction.finish()\n';
const sleepLine='                    try? await Task.sleep(nanoseconds: 500_000_000)\n';
const finishCount=block.split(finishLine).length-1;
if(finishCount!==1)fail(`Expected exactly one automatic transaction.finish() in Transaction.updates listener, found ${finishCount}`);
block=block.replace(
  finishLine+sleepLine,
  `                    // ${marker}: keep verified transactions unfinished until Orbuff server verification succeeds.\n`
);
source=before+block+after;
fs.writeFileSync(swiftPath,source,'utf8');

const verified=fs.readFileSync(swiftPath,'utf8');
if(!verified.includes(marker))fail('Patch write completed but marker is missing');
console.log(`✅ Patched @capgo/native-purchases ${expectedVersion}: iOS Transaction.updates no longer auto-finishes before Orbuff server verification`);
