import fs from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
async function pngMeta(file){
  const data=await fs.readFile(file);
  const signature='89504e470d0a1a0a';
  if(data.length<33||data.subarray(0,8).toString('hex')!==signature||data.subarray(12,16).toString('ascii')!=='IHDR')throw new Error(`${file} is not a valid PNG`);
  const colorType=data[25];
  return {width:data.readUInt32BE(16),height:data.readUInt32BE(20),hasAlpha:colorType===4||colorType===6};
}
const required=[
  ['store-assets/icon/orbuff-icon-master-1024.png',1024,1024],
  ['store-assets/icon/google-play-icon-512.png',512,512],
  ['store-assets/google-play/feature-graphic-1024x500.png',1024,500]
];

for(const [relative,width,height] of required){
  const file=path.join(root,relative);
  const stat=await fs.stat(file).catch(()=>null);
  if(!stat?.isFile()||stat.size<1024)throw new Error(`${relative} is missing or empty`);
  const meta=await pngMeta(file);
  if(meta.width!==width||meta.height!==height)throw new Error(`${relative} must be a ${width}x${height} PNG`);
  if(meta.hasAlpha)throw new Error(`${relative} must be opaque; store masks are applied by Apple and Google`);
}

const screenshotDir=path.join(root,'store-assets','google-play');
const screenshots=(await fs.readdir(screenshotDir).catch(()=>[])).filter(name=>/^phone-\d{2}-.*-1080x1920\.png$/.test(name));
for(const name of screenshots){
  const meta=await pngMeta(path.join(screenshotDir,name));
  if(meta.width!==1080||meta.height!==1920||meta.hasAlpha)throw new Error(`${name} must be an opaque 1080x1920 PNG`);
}

console.log(`Store assets OK (${required.length} required graphics, ${screenshots.length} phone screenshots).`);
