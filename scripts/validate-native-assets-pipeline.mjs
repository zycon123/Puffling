import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);

const svgSources=['logo.svg','logo-dark.svg'];
const customPngSources=[
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
function validSvg(file){
  const text=fs.readFileSync(file,'utf8');
  return /<svg\b/i.test(text)&&/viewBox\s*=\s*["']0\s+0\s+1024\s+1024["']/i.test(text);
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

for(const name of svgSources){
  if(!fs.existsSync(path.join(root,'assets',name)))fail(`Approved SVG source missing: assets/${name}`);
  else if(!validSvg(path.join(root,'assets',name)))fail(`assets/${name} must use viewBox="0 0 1024 1024"`);
  if(!helper.includes(name))fail(`Asset helper is missing ${name}`);
  if(!docs.includes(name))fail(`Asset docs are missing ${name}`);
}
if(!process.exitCode)ok('Approved light/dark SVG masters are present and valid');

for(const token of ['#081B3F','#030A18','#59BFFF']){
  if(!helper.includes(token))fail(`Native brand color missing from asset helper: ${token}`);
}
if(!helper.includes("'@capacitor/assets@3.0.5'"))fail('Native asset generator version is not pinned');
else ok('Native brand colors and pinned asset generator are enforced');

for(const script of ['mobile:assets:android','mobile:assets:ios','mobile:assets:android:optional','mobile:assets:ios:optional']){
  if(!pkg.scripts?.[script])fail(`package.json is missing ${script}`);
}
if(!process.exitCode)ok('Package scripts expose strict and optional native asset generation');

for(const [platform,workflow] of [['Android',android],['iOS',ios]]){
  if(!workflow.includes("- 'assets/**'"))fail(`${platform} workflow does not trigger when source assets change`);
  if(!workflow.includes('scripts/apply-native-assets.mjs'))fail(`${platform} workflow does not trigger when the asset helper changes`);
  if(!workflow.includes(`mobile:assets:${platform.toLowerCase()}:optional`))fail(`${platform} workflow does not apply Orbuff native assets after project generation`);
}
if(!android.includes('Production signing requires approved Orbuff SVG masters'))fail('Android production signing is not gated on approved SVG masters');
if(!process.exitCode)ok('Android/iOS CI applies approved art and Android signing requires it');

const assetsDir=path.join(root,'assets');
const pngPresent=customPngSources.filter(([name])=>fs.existsSync(path.join(assetsDir,name)));
if(pngPresent.length!==0&&pngPresent.length!==customPngSources.length){
  const missing=customPngSources.filter(([name])=>!fs.existsSync(path.join(assetsDir,name))).map(([name])=>name);
  fail(`Partial legacy custom PNG source set detected. Missing: ${missing.join(', ')}`);
}else if(pngPresent.length===customPngSources.length){
  for(const [name,minW,minH] of customPngSources){
    const size=pngSize(path.join(assetsDir,name));
    if(!size)fail(`${name} is not a valid PNG`);
    else if(size.width<minW||size.height<minH)fail(`${name} is ${size.width}×${size.height}; minimum ${minW}×${minH}`);
  }
  if(!process.exitCode)ok('Optional custom PNG source set also passes dimension checks');
}else{
  ok('No legacy custom PNG source set; approved SVG easy-mode path is canonical');
}

if(process.exitCode)process.exit(process.exitCode);
console.log('Orbuff native asset pipeline validation passed.');
