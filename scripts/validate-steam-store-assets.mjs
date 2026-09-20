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

// Dimensions Valve requires on the Steamworks store-page asset upload page.
const opaqueRequired=[
  ['store-assets/steam/header-capsule-460x215.png',460,215],
  ['store-assets/steam/small-capsule-231x87.png',231,87],
  ['store-assets/steam/main-capsule-616x353.png',616,353],
  ['store-assets/steam/library-capsule-600x900.png',600,900],
  ['store-assets/steam/library-hero-1920x620.png',1920,620],
];
for(const [relative,width,height] of opaqueRequired){
  const file=path.join(root,relative);
  const stat=await fs.stat(file).catch(()=>null);
  if(!stat?.isFile()||stat.size<512)throw new Error(`${relative} is missing or empty`);
  const meta=await pngMeta(file);
  if(meta.width!==width||meta.height!==height)throw new Error(`${relative} must be a ${width}x${height} PNG`);
  if(meta.hasAlpha)throw new Error(`${relative} must be opaque`);
}

const logoFile=path.join(root,'store-assets/steam/library-logo-1280x720.png');
const logoStat=await fs.stat(logoFile).catch(()=>null);
if(!logoStat?.isFile()||logoStat.size<512)throw new Error('store-assets/steam/library-logo-1280x720.png is missing or empty');
const logoMeta=await pngMeta(logoFile);
if(logoMeta.width!==1280||logoMeta.height!==720)throw new Error('store-assets/steam/library-logo-1280x720.png must be a 1280x720 PNG');
if(!logoMeta.hasAlpha)throw new Error('store-assets/steam/library-logo-1280x720.png must be transparent (Steam overlays it on the hero image)');

console.log(`Steam store assets OK (${opaqueRequired.length} capsules/hero + 1 transparent library logo).`);
