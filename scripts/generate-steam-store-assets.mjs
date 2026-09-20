import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Generates the Steamworks store-page assets Valve requires before an app
// page can be set to "Coming Soon" or released: header/small/main capsules,
// the library capsule, library hero and a transparent library logo. Reuses
// the same mascot + gradient language as scripts/generate-store-assets.mjs
// (the mobile store graphics) so the Steam page matches the rest of the
// store presence. None of this needs a real Steam App ID -- only the
// SteamPipe upload step (scripts/prepare-steam-build.mjs) does.
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'store-assets','steam');
const logo=await fs.readFile(path.join(root,'assets','logo.svg'));
const ensure=()=>fs.mkdir(out,{recursive:true});
await ensure();

function background(w,h,{stars=8,wordmark=null}={}){
  const starDots=Array.from({length:stars},(_,i)=>{
    const x=Math.round((i*137.5+40)%(w-20))+10;
    const y=Math.round((i*71.3+30)%(h-20))+10;
    const r=1.5+((i*3)%3);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${0.4+((i%3)*0.2)}"/>`;
  }).join('');
  const word=wordmark?`<text x="${wordmark.x}" y="${wordmark.y}" fill="url(#word)" font-family="Arial,Helvetica,sans-serif" font-size="${wordmark.size}" font-weight="900" letter-spacing="-2">ORBUFF</text>`:'';
  return Buffer.from(`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#030a18"/><stop offset=".46" stop-color="#102e68"/><stop offset="1" stop-color="#6a3f9f"/></linearGradient>
      <radialGradient id="neb"><stop stop-color="#59bfff" stop-opacity=".5"/><stop offset="1" stop-color="#59bfff" stop-opacity="0"/></radialGradient>
      <linearGradient id="word" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a8efff"/><stop offset=".55" stop-color="#73a5ff"/><stop offset="1" stop-color="#ffc64d"/></linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <ellipse cx="${w*0.22}" cy="${h*0.3}" rx="${w*0.32}" ry="${h*0.55}" fill="url(#neb)"/>
    <ellipse cx="${w*0.86}" cy="${h*0.14}" rx="${w*0.24}" ry="${h*0.4}" fill="url(#neb)" opacity=".35"/>
    <g>${starDots}</g>
    ${word}
  </svg>`);
}

async function mascot(size){
  return sharp(logo,{density:384}).resize(size,size,{fit:'contain'}).png().toBuffer();
}

async function capsule(name,w,h,{mascotSize,mascotLeft,mascotTop,wordmark}={}){
  const bg=background(w,h,{wordmark});
  const composite=[];
  if(mascotSize)composite.push({input:await mascot(mascotSize),left:mascotLeft,top:mascotTop});
  await sharp(bg).composite(composite).flatten({background:'#030a18'}).removeAlpha().png({compressionLevel:9}).toFile(path.join(out,name));
}

// Header capsule -- the primary image shown in search results and wishlist.
await capsule('header-capsule-460x215.png',460,215,{mascotSize:150,mascotLeft:18,mascotTop:33,wordmark:{x:180,y:100,size:40}});
// Small capsule -- used in various listing/carousel contexts.
await capsule('small-capsule-231x87.png',231,87,{mascotSize:66,mascotLeft:10,mascotTop:11,wordmark:{x:82,y:52,size:20}});
// Main capsule -- featured/front-page placements.
await capsule('main-capsule-616x353.png',616,353,{mascotSize:230,mascotLeft:30,mascotTop:62,wordmark:{x:280,y:170,size:56}});
// Library capsule -- shown in the Steam library grid view.
await capsule('library-capsule-600x900.png',600,900,{mascotSize:360,mascotLeft:120,mascotTop:260,wordmark:{x:150,y:700,size:52}});
// Library hero -- large banner behind the game page in the library.
await capsule('library-hero-1920x620.png',1920,620,{mascotSize:420,mascotLeft:90,mascotTop:100,wordmark:{x:560,y:330,size:96}});

// Library logo -- transparent PNG, no background, placed by Steam over the
// hero image; must not be flattened/opaque like the capsules above.
const libraryLogoMascot=await sharp(logo,{density:384}).resize(360,360,{fit:'contain'}).png().toBuffer();
const libraryLogoText=Buffer.from(`<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="word" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a8efff"/><stop offset=".55" stop-color="#73a5ff"/><stop offset="1" stop-color="#ffc64d"/></linearGradient></defs>
  <text x="470" y="440" fill="url(#word)" font-family="Arial,Helvetica,sans-serif" font-size="110" font-weight="900" letter-spacing="-3">ORBUFF</text>
</svg>`);
await sharp({create:{width:1280,height:720,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
  .composite([{input:libraryLogoMascot,left:80,top:180},{input:libraryLogoText,left:0,top:0}])
  .png({compressionLevel:9})
  .toFile(path.join(out,'library-logo-1280x720.png'));

console.log('Generated Steam store capsules, library hero and library logo in store-assets/steam.');
