import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const required=[
  ['icon-only.png',1024,1024],
  ['icon-foreground.png',1024,1024],
  ['icon-background.png',1024,1024],
  ['splash.png',2732,2732],
  ['splash-dark.png',2732,2732]
];

function pngSize(file){
  const b=fs.readFileSync(file);
  if(b.length<24||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')return null;
  return {width:b.readUInt32BE(16),height:b.readUInt32BE(20)};
}

for(const rel of ['scripts/apply-native-assets.mjs','assets/README.md','.github/workflows/build-android-release.yml','.github/workflows/build-ios-release.yml','package.json']){
  if(!fs.existsSync(path.join(root,rel)))fail(`Native asset pipeline file missing: ${rel}`);
}
if(process.exitCode)process.exit(process.exitCode);

const helper=read('scripts/apply-native-assets.mjs');
const docs=read('assets/README.md');
const android=read('.github/workflows/build-android-release.yml');
const ios=read('.github/workflows/build-ios-release.yml');
const pkg=JSON.parse(read('package.json'));

for(const [name,minW,minH] of required){
  for(const [label,source] of [['asset helper',helper],['asset docs',docs]]){
    if(!source.includes(name))fail(`${label} is missing ${name}`);
  }
  if(!docs.includes(`${minW}×${minH}`))fail(`Asset docs are missing minimum dimension ${minW}×${minH}`);
}
if(!helper.includes("'@capacitor/assets@3.0.5'"))fail('Native asset generator version is not pinned');
else ok('Native asset source contract and pinned generator are documented');

for(const script of ['mobile:assets:android','mobile:assets:ios','mobile:assets:android:optional','mobile:assets:ios:optional']){
  if(!pkg.scripts?.[script])fail(`package.json is missing ${script}`);
}
if(!process.exitCode)ok('Package scripts expose strict and optional native asset generation');

for(const [platform,workflow] of [['Android',android],['iOS',ios]]){
  if(!workflow.includes("- 'assets/**'"))fail(`${platform} workflow does not trigger when source assets change`);
  if(!workflow.includes('scripts/apply-native-assets.mjs'))fail(`${platform} workflow does not trigger when the asset helper changes`);
  if(!workflow.includes(`mobile:assets:${platform.toLowerCase()}:optional`))fail(`${platform} workflow does not apply Orbuff native assets after project generation`);
}
if(!android.includes('Production signing requires the complete Orbuff native asset set'))fail('Android production signing is not gated on branded native assets');
if(!process.exitCode)ok('Android/iOS CI applies assets and Android signed builds require branded sources');

const assetsDir=path.join(root,'assets');
const present=required.filter(([name])=>fs.existsSync(path.join(assetsDir,name)));
if(present.length!==0&&present.length!==required.length){
  const missing=required.filter(([name])=>!fs.existsSync(path.join(assetsDir,name))).map(([name])=>name);
  fail(`Partial production asset set detected. Missing: ${missing.join(', ')}`);
}else if(present.length===0){
  ok('Production PNG artwork not committed yet; optional test-build path remains valid');
}else{
  for(const [name,minW,minH] of required){
    const size=pngSize(path.join(assetsDir,name));
    if(!size)fail(`${name} is not a valid PNG`);
    else if(size.width<minW||size.height<minH)fail(`${name} is ${size.width}×${size.height}; minimum ${minW}×${minH}`);
  }
  if(!process.exitCode)ok('Complete production native artwork set passes PNG dimension checks');
}

if(process.exitCode)process.exit(process.exitCode);
console.log('Orbuff native asset pipeline validation passed.');
