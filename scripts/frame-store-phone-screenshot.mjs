import path from 'node:path';
import sharp from 'sharp';

const [input,output,cropArg]=process.argv.slice(2);
if(!input||!output)throw new Error('Usage: node scripts/frame-store-phone-screenshot.mjs <input> <output> [x,y,width,height]');
let image=sharp(path.resolve(input));
if(cropArg){
  const [left,top,width,height]=cropArg.split(',').map(Number);
  if(![left,top,width,height].every(Number.isFinite)||width<1||height<1)throw new Error('Crop must be x,y,width,height');
  image=image.extract({left,top,width,height});
}
const source=await image.png().toBuffer();
const background=await sharp(source).resize(1080,1920,{fit:'cover'}).blur(26).modulate({brightness:.76,saturation:.9}).removeAlpha().png().toBuffer();
const foreground=await sharp(source).resize(1080,1920,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
await sharp(background).composite([{input:foreground,left:0,top:0}]).removeAlpha().png({compressionLevel:9}).toFile(path.resolve(output));
console.log(`Prepared ${output} as an opaque 1080x1920 store screenshot.`);
