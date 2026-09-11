import fs from 'node:fs';
import vm from 'node:vm';

const root=process.cwd();
const fail=msg=>{throw new Error(msg)};
const run=(ctx,file)=>vm.runInContext(fs.readFileSync(`${root}/${file}`,'utf8'),ctx,{filename:file});
function storage(){const map=new Map();return{getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),clear:()=>map.clear(),_map:map};}

let randomValue=0;
const fakeMath=Object.create(Math);fakeMath.random=()=>randomValue;
const localStorage=storage();
const document={readyState:'loading',addEventListener(){},getElementById(){return null;},querySelector(){return null;}};
const ctx={
  console,Math:fakeMath,Date,JSON,Map,Set,Number,String,Object,Array,RegExp,Promise,
  localStorage,document,setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:()=>0,
  CustomEvent:class CustomEvent{constructor(type,opts={}){this.type=type;this.detail=opts.detail;}},
  save:{bank:0},persist(){},refreshMenu(){},showToast(){},running:false,score:0,boss:null,bossDefeated:false
};
ctx.window=ctx;ctx.globalThis=ctx;ctx.addEventListener=()=>{};ctx.dispatchEvent=()=>true;
vm.createContext(ctx);

for(const file of ['js/puff_fusion_core.js','js/puffling_collection_50.js','js/puffling_collection_36.js','js/puffling_unique_traits.js','js/steal_my_puff_core.js','js/puffling_progression.js','js/puffling_evolution.js','js/puffling_nursery_vault.js','js/diamond_mystery_shop.js','js/diamond_iap_store.js'])run(ctx,file);

const F=ctx.SkyPuffFusion,N=ctx.SkyPuffNurseryVault,P=ctx.SkyPuffPufflingProgress,E=ctx.SkyPuffPufflingEvolution,M=ctx.SkyPuffMysteryShop,D=ctx.SkyPuffDiamonds,R=ctx.SkyPuffRace,I=ctx.PufflingDiamondStore;
if(!F||!N||!P||!E||!M||!D||!R||!I)fail('One or more core gameplay APIs did not initialize');
const total=Object.keys(F.BASE||{}).length+Object.keys(F.FUSIONS||{}).length;if(total!==100)fail(`Launch catalog expected 100 Pufflings, found ${total}`);
if(ctx.SkyPuffUniqueTraits?.count!==100)fail('Unique trait registry does not cover all 100 Pufflings');

// New-player ownership, duplicates and Vault protection.
F.add('starterpuff',1);F.add('ember',3);
if(F.load().owned.starterpuff!==1||F.load().owned.ember!==3)fail('Initial ownership/duplicate persistence failed');
if(!N.placeInVault('ember',0))fail('Could not place owned Puffling in Vault');
if(F.availableCount('ember')!==2)fail('Vault did not protect exactly one duplicate copy');
if(F.tradeTransfer('starterpuff','volt','sim_starter').reason!=='starter_locked')fail('Starter Puffling became tradeable');
const trade=F.tradeTransfer('ember','prism','sim_trade_1');if(!trade.ok||trade.duplicate||F.load().owned.ember!==2||F.load().owned.prism!==1)fail('Atomic duplicate Trade flow failed');
const replay=F.tradeTransfer('ember','prism','sim_trade_1');if(!replay.ok||!replay.duplicate||F.load().owned.prism!==1)fail('Trade receipt idempotency failed');

// Progression and evolution survive the inventory flow.
P.addXp('prism',100000);const prog=P.get('prism');if(prog.level!==20||E.stageFor('prism')!==2)fail('Puffling did not reach Ascended stage at level 20');
if(E.stageFor('starterpuff')!==0)fail('Starter Puffling incorrectly evolved');

// Nursery egg lifecycle.
N.addEgg('rare',1);randomValue=0;const hatch=N.hatch('rare');if(!hatch||['starterpuff','starterspark','starterdrop'].includes(hatch))fail('Rare egg failed to hatch a non-starter Puffling');
if((N.loadEggs().rare||0)!==0)fail('Hatched egg was not consumed');

// Diamond -> Mystery Vault -> guaranteed egg -> hatch -> normal box reward.
D.set(250);M.setBoxes(0);if(!await M.buyBoxes(10)||D.earned()!==0||M.boxCount()!==10)fail('250 earned Diamonds did not buy 10 unopened Mystery Boxes');
randomValue=.99;const fusedEgg=M.combineBoxes();if(!fusedEgg||fusedEgg.tier!=='legendary'||M.boxCount()!==7)fail('3 Mystery Boxes did not produce the guaranteed weighted egg');
randomValue=0;const legendary=N.hatch('legendary');if(!legendary)fail('Guaranteed legendary egg could not be hatched');
const bankBefore=ctx.save.bank;const reward=M.openBox();if(reward?.id!=='coins500'||ctx.save.bank!==bankBefore+500||M.boxCount()!==6)fail('Normal Mystery Box reward lifecycle failed');

// Core Race state, starter ability, cooldown and goal.
R.start({selectedPufflingId:'starterpuff',startedAt:1000});if(R.snapshot()?.ability?.id!=='tinyGust')fail('Starter Race ability mismatch');
const atk=R.attack(5000);if(!atk.ok||atk.remaining!==2)fail('First Race attack failed');if(R.attack(5001).reason!=='cooldown')fail('Local Race attack cooldown failed');
if(!R.updateHeights(1499,900)?.active)fail('Race ended before the 1500m goal');const finish=R.updateHeights(1500,900);if(finish.active||finish.winner!=='you')fail('Race did not finish at exactly 1500m');

// Real-money purchases must remain fail-closed in web until native store verification is present.
const catalog=I.catalog();if(JSON.stringify(catalog.map(x=>[x.diamonds,x.targetEur]))!==JSON.stringify([[25,1],[75,3],[250,9],[600,16]]))fail('Diamond IAP launch catalog/prices changed unexpectedly');
if(I.canPurchase())fail('Web simulation unexpectedly enabled real-money purchases');

// Corrupted legacy/local save values must self-repair instead of poisoning gameplay with NaN/invalid cosmetics.
const repairCtx={console,window:null,save:{bank:NaN,best:-8,total:Infinity,upBoost:-1,upHealth:2,upCoin:3,upMagnet:4,lastDaily:NaN,streak:-5,eventsCleared:0,bossWins:0,treasuresCollected:0,skin:'missing',face:'bad',hat:'bad',trail:'bad',playerName:'A<script>✨'},skins:{classic:{}},faceStyles:{smile:{}},hats:{none:{}},trailStyles:{auto:{}}};
repairCtx.persist=()=>{repairCtx.persisted=(repairCtx.persisted||0)+1;};repairCtx.window=repairCtx;vm.createContext(repairCtx);run(repairCtx,'js/save_integrity.js');
if(!repairCtx.PufflingSaveIntegrity?.ok||repairCtx.save.bank!==0||repairCtx.save.best!==0||repairCtx.save.total!==0)fail('Corrupted numeric save data was not repaired');
if(repairCtx.save.skin!=='classic'||repairCtx.save.face!=='smile'||repairCtx.save.hat!=='none'||repairCtx.save.trail!=='auto')fail('Invalid cosmetic save IDs were not repaired');
if(!repairCtx.PufflingSaveIntegrity.repaired.length||!repairCtx.persisted)fail('Save repair was not persisted/reported');

// Launch wiring/static contracts.
const config=fs.readFileSync(`${root}/js/beta_config.js`,'utf8'),loader=fs.readFileSync(`${root}/game.js`,'utf8'),server=fs.readFileSync(`${root}/server/index.js`,'utf8'),bootstrap=fs.readFileSync(`${root}/server/bootstrap.js`,'utf8');
if(!config.includes("SKY_PUFF_VERSION='5.26-beta.99'")||!config.includes('API_BASE=SKY_PUFF_GAME_API_URL'))fail('beta.99 production API configuration missing');
if(!loader.includes("'js/save_integrity.js'"))fail('Save integrity module is not active in loader');
for(const token of ['race:positionRejected','HEIGHT_RATE_LIMIT','integrityLocked'])if(!server.includes(token))fail(`Race integrity server missing ${token}`);
for(const token of ['leaderboard_store','leaderboard_http'])if(!bootstrap.includes(token))fail(`Production bootstrap missing ${token}`);

console.log('✅ Full launch simulation passed: catalog → Vault/Trade → progression/evolution → Nursery → Mystery Shop → Race → IAP fail-closed → save recovery');
