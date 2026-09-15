import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'store-assets');
const logo=await fs.readFile(path.join(root,'assets','logo.svg'));
const ensure=(...parts)=>fs.mkdir(path.join(out,...parts),{recursive:true});

await Promise.all([ensure('icon'),ensure('google-play'),ensure('captures')]);

const mascot=await sharp(logo,{density:384}).resize(820,820,{fit:'contain'}).png().toBuffer();
const iconBackground=Buffer.from(`<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="34%" cy="24%" r="86%"><stop stop-color="#214c9b"/><stop offset=".52" stop-color="#081b3f"/><stop offset="1" stop-color="#030a18"/></radialGradient>
    <radialGradient id="n"><stop stop-color="#9be8ff" stop-opacity=".48"/><stop offset="1" stop-color="#6a48d7" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
  <circle cx="170" cy="210" r="210" fill="url(#n)"/><circle cx="870" cy="820" r="280" fill="url(#n)"/>
  <g fill="#fff"><circle cx="128" cy="390" r="5"/><circle cx="870" cy="180" r="7"/><circle cx="786" cy="318" r="4"/><circle cx="224" cy="760" r="6"/><circle cx="920" cy="586" r="4"/></g>
</svg>`);

await sharp(iconBackground).composite([{input:mascot,left:102,top:92}]).flatten({background:'#081b3f'}).removeAlpha().png({compressionLevel:9}).toFile(path.join(out,'icon','orbuff-icon-master-1024.png'));
await sharp(path.join(out,'icon','orbuff-icon-master-1024.png')).resize(512,512).removeAlpha().png({compressionLevel:9}).toFile(path.join(out,'icon','google-play-icon-512.png'));

const featureBackground=Buffer.from(`<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#030a18"/><stop offset=".46" stop-color="#102e68"/><stop offset="1" stop-color="#6a3f9f"/></linearGradient>
    <radialGradient id="neb"><stop stop-color="#59bfff" stop-opacity=".56"/><stop offset="1" stop-color="#59bfff" stop-opacity="0"/></radialGradient>
    <linearGradient id="word" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a8efff"/><stop offset=".55" stop-color="#73a5ff"/><stop offset="1" stop-color="#ffc64d"/></linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <ellipse cx="250" cy="250" rx="330" ry="285" fill="url(#neb)"/>
  <ellipse cx="910" cy="90" rx="250" ry="190" fill="url(#neb)" opacity=".34"/>
  <g fill="#fff" opacity=".78"><circle cx="61" cy="72" r="3"/><circle cx="142" cy="419" r="2"/><circle cx="418" cy="77" r="3"/><circle cx="498" cy="402" r="4"/><circle cx="692" cy="78" r="2"/><circle cx="862" cy="422" r="3"/><circle cx="963" cy="184" r="4"/></g>
  <path d="M-30 455 C120 365 290 420 415 362 C530 310 647 335 748 286 C851 236 946 256 1060 188 L1060 510 L-30 510 Z" fill="#153875" opacity=".42"/>
  <text x="472" y="222" fill="url(#word)" font-family="Arial,Helvetica,sans-serif" font-size="104" font-weight="900" letter-spacing="-3">ORBUFF</text>
  <text x="480" y="286" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" font-size="25" font-weight="800" letter-spacing="4">COLLECT · EVOLVE · COMPETE</text>
  <rect x="480" y="320" width="338" height="5" rx="3" fill="#ffc64d" opacity=".9"/>
</svg>`);
const featureMascot=await sharp(logo,{density:384}).resize(410,410,{fit:'contain'}).png().toBuffer();
await sharp(featureBackground).composite([{input:featureMascot,left:38,top:48}]).flatten({background:'#030a18'}).removeAlpha().png({compressionLevel:9}).toFile(path.join(out,'google-play','feature-graphic-1024x500.png'));

console.log('Generated Orbuff icon and Google Play feature graphic.');
