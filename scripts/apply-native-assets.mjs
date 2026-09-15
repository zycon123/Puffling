import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const platform=String(process.argv[2]||'').toLowerCase();
const allowMissing=process.argv.includes('--allow-missing');
const assetsDir=path.join(root,'assets');
const svgSources=['logo.svg','logo-dark.svg'];
const customPngSources=[
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

function validSvg(file){
  const text=fs.readFileSync(file,'utf8');
  return /<svg\b/i.test(text)&&/viewBox\s*=\s*["']0\s+0\s+1024\s+1024["']/i.test(text);
}

const svgPresent=svgSources.filter(name=>fs.existsSync(path.join(assetsDir,name)));
const pngPresent=customPngSources.filter(([name])=>fs.existsSync(path.join(assetsDir,name)));
const anyPresent=svgPresent.length||pngPresent.length;

if(!anyPresent){
  const message='Production Orbuff native source art is not present; asset generation skipped.';
  if(allowMissing){console.log(`ℹ️ ${message}`);process.exit(0);}
  console.error(`❌ ${message}`);
  process.exit(1);
}

if(svgPresent.length>0&&svgPresent.length!==svgSources.length){
  const missing=svgSources.filter(name=>!fs.existsSync(path.join(assetsDir,name)));
  console.error(`❌ Partial SVG native asset set found. Missing: ${missing.join(', ')}`);
  process.exit(1);
}

if(pngPresent.length>0&&pngPresent.length!==customPngSources.length){
  const missing=customPngSources.filter(([name])=>!fs.existsSync(path.join(assetsDir,name))).map(([name])=>name);
  console.error(`❌ Partial custom PNG native asset set found. Missing: ${missing.join(', ')}`);
  process.exit(1);
}

let mode='';
if(svgPresent.length===svgSources.length){
  for(const name of svgSources){
    const file=path.join(assetsDir,name);
    if(!validSvg(file)){
      console.error(`❌ ${name} must be a valid 1024×1024 SVG master with viewBox="0 0 1024 1024"`);
      process.exit(1);
    }
    console.log(`✅ ${name}: approved 1024×1024 SVG master`);
  }
  mode='easy-svg';
}else{
  for(const [name,minW,minH] of customPngSources){
    const file=path.join(assetsDir,name);
    const {width,height}=pngSize(file);
    if(width<minW||height<minH){
      console.error(`❌ ${name} is ${width}×${height}; minimum is ${minW}×${minH}`);
      process.exit(1);
    }
    console.log(`✅ ${name}: ${width}×${height}`);
  }
  mode='custom-png';
}

const platformDir=path.join(root,platform);
if(!fs.existsSync(platformDir)){
  console.error(`❌ Native ${platform} project is missing. Run npx cap add ${platform} first.`);
  process.exit(1);
}

const args=['--yes','--package','@capacitor/assets@3.0.5','capacitor-assets','generate',`--${platform}`,'--assetPath','assets'];
if(mode==='easy-svg'){
  args.push('--iconBackgroundColor','#081B3F','--iconBackgroundColorDark','#030A18','--splashBackgroundColor','#59BFFF','--splashBackgroundColorDark','#030A18');
}
console.log(`Generating Orbuff ${platform} icons/splash screens from ${mode} sources with @capacitor/assets 3.0.5…`);
execFileSync('npx',args,{cwd:root,stdio:'inherit',shell:process.platform==='win32'});
console.log(`✅ Orbuff ${platform} native assets generated from approved production sources.`);
