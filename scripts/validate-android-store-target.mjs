import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const files=['android/variables.gradle','android/app/build.gradle','android/app/build.gradle.kts'];
const source=files.filter(f=>fs.existsSync(path.join(root,f))).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
if(!source)throw new Error('Android project not found. Run `npx cap add android` first.');

function readSdk(name){
  const patterns=[
    new RegExp(`${name}\\s*=\\s*(\\d+)`),
    new RegExp(`${name}\\s+(\\d+)`)
  ];
  for(const pattern of patterns){const m=source.match(pattern);if(m)return Number(m[1]);}
  return 0;
}

const compileSdk=readSdk('compileSdkVersion')||readSdk('compileSdk');
const targetSdk=readSdk('targetSdkVersion')||readSdk('targetSdk');
if(compileSdk<36)throw new Error(`Google Play launch gate failed: compile SDK ${compileSdk||'unknown'} is below API 36.`);
if(targetSdk<36)throw new Error(`Google Play launch gate failed: target SDK ${targetSdk||'unknown'} is below API 36.`);
console.log(`Google Play API gate OK: compileSdk=${compileSdk}, targetSdk=${targetSdk}`);
