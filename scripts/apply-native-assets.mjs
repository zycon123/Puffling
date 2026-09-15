import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const platform=String(process.argv[2]||'').toLowerCase();
const allowMissing=process.argv.includes('--allow-missing');
const assetsDir=path.join(root,'assets');
const required=[
  ['icon-only.png',1024,1024],
  ['icon-foreground.png',1024,1024],
  ['icon-background.png',1024,1024],
  ['splash.png',2732,2732],
  ['splash-dark.png',2732,2732]
];

if(!['android','ios'].includes(platform)){
  console.error('Usage: node scripts/apply-native-assets.mjs <android|ios> [--allow-missing]');
  process.exit(2);
}

function pngSize(file){
  const b=fs.readFileSync(file);
  const signature='89504e470d0a1a0a';
  if(b.length<24||b.subarray(0,8).toString('hex')!==signature)throw new Error(`${path.basename(file)} must be a valid PNG file`);
  return {width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
}

const present=required.filter(([name])=>fs.existsSync(path.join(assetsDir,name)));
if(present.length===0){
  const message='Production Orbuff icon/splash source assets are not present yet; native asset generation skipped.';
  if(allowMissing){console.log(`ℹ️ ${message}`);process.exit(0);}
  console.error(`❌ ${message}`);
  console.error('Add all five PNG files under assets/ before creating a production-signed store build.');
  process.exit(1);
}

if(present.length!==required.length){
  const missing=required.filter(([name])=>!fs.existsSync(path.join(assetsDir,name))).map(([name])=>name);
  console.error(`❌ Partial native asset set found. Missing: ${missing.join(', ')}`);
  process.exit(1);
}

for(const [name,minW,minH] of required){
  const file=path.join(assetsDir,name);
  const {width,height}=pngSize(file);
  if(width<minW||height<minH){
    console.error(`❌ ${name} is ${width}×${height}; minimum is ${minW}×${minH}`);
    process.exit(1);
  }
  console.log(`✅ ${name}: ${width}×${height}`);
}

const platformDir=path.join(root,platform);
if(!fs.existsSync(platformDir)){
  console.error(`❌ Native ${platform} project is missing. Run npx cap add ${platform} first.`);
  process.exit(1);
}

const args=['--yes','--package','@capacitor/assets@3.0.5','capacitor-assets','generate',`--${platform}`,'--assetPath','assets'];
console.log(`Generating Orbuff ${platform} icons/splash screens with @capacitor/assets 3.0.5…`);
execFileSync('npx',args,{cwd:root,stdio:'inherit',shell:process.platform==='win32'});
console.log(`✅ Orbuff ${platform} native assets generated from production sources.`);
