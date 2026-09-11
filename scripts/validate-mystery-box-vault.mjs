import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('js/diamond_mystery_shop.js','utf8');
const store=new Map();
const eggs={rare:0,epic:0,legendary:0};
const localStorage={
  getItem:k=>store.has(k)?store.get(k):null,
  setItem:(k,v)=>store.set(k,String(v)),
  removeItem:k=>store.delete(k)
};
const fakeMath=Object.create(Math);fakeMath.random=()=>0;
const context={
  console,localStorage,Math:fakeMath,setTimeout:()=>0,
  document:{readyState:'loading',addEventListener(){},getElementById(){return null;}},
  window:{SkyPuffNurseryVault:{addEgg(t,c=1){eggs[t]=(eggs[t]||0)+c;}}}
};
context.window.window=context.window;
vm.createContext(context);vm.runInContext(source,context,{filename:'diamond_mystery_shop.js'});
const D=context.window.SkyPuffDiamonds,M=context.window.SkyPuffMysteryShop;
const fail=msg=>{throw new Error(msg)};
if(!D||!M)fail('Mystery Shop APIs missing');
if(M.cost!==25)fail('Mystery Box unit cost must remain 25 diamonds');
const bundles=JSON.stringify(M.bundles);if(bundles!==JSON.stringify([{count:1,cost:25},{count:3,cost:75},{count:10,cost:250}]))fail('Mystery Box bundle pricing mismatch');
D.set(1000);M.setBoxes(0);
if(!M.buyBoxes(1)||D.get()!==975||M.boxCount()!==1)fail('1-box purchase did not store unopened box');
if(!M.buyBoxes(3)||D.get()!==900||M.boxCount()!==4)fail('3-box purchase failed');
if(!M.buyBoxes(10)||D.get()!==650||M.boxCount()!==14)fail('10-box purchase failed');
M.openBox();if(M.boxCount()!==13)fail('Opening one box did not remove exactly one unopened box');
const chances=Object.fromEntries(M.eggFusionChances.map(x=>[x.tier,x.weight]));
if(chances.rare!==70||chances.epic!==25||chances.legendary!==5)fail('3-box egg chances must be 70/25/5');
if(M.eggFusionChances.reduce((n,x)=>n+x.weight,0)!==100)fail('Egg fusion chances must total 100%');
M.setBoxes(3);fakeMath.random=()=>0.99;const egg=M.combineBoxes();
if(!egg||egg.tier!=='legendary'||M.boxCount()!==0||eggs.legendary!==1)fail('3-box fusion did not create the expected guaranteed egg');
M.setBoxes(2);if(M.combineBoxes()!==null||M.boxCount()!==2)fail('Fusion must require three unopened boxes');
console.log('✅ Mystery Box vault, bundles and 3→1 egg fusion validated');
