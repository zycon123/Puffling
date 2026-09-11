import fs from 'node:fs';
import vm from 'node:vm';

const root=process.cwd();
const fail=msg=>{console.error(`❌ ${msg}`);process.exitCode=1;};
const ok=msg=>console.log(`✅ ${msg}`);
function storage(){const m=new Map();return{getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),clear:()=>m.clear()};}
function run(ctx,rel){vm.runInNewContext(fs.readFileSync(`${root}/${rel}`,'utf8'),ctx,{filename:rel});}

const localStorage=storage();
const ctx={window:{},localStorage,console,requestAnimationFrame:()=>0,showToast:()=>{}};ctx.window=ctx;
run(ctx,'js/puff_fusion_core.js');
const F=ctx.SkyPuffFusion;
F.add('ember',1);F.add('ember',2);
if(F.load().owned.ember!==3)fail('Duplicate Pufflings do not stack and persist as xN');else ok('Duplicate Pufflings persist as owned counts');

const first=F.tradeTransfer('ember','prism','trade_test_1');
if(!first.ok||first.duplicate||F.load().owned.ember!==2||F.load().owned.prism!==1||!first.incomingWasNew)fail('Trade did not atomically move exactly one Puffling copy');else ok('Trade moves one copy and preserves remaining duplicates');
const replay=F.tradeTransfer('ember','prism','trade_test_1');
if(!replay.ok||!replay.duplicate||F.load().owned.ember!==2||F.load().owned.prism!==1)fail('Trade transaction receipt did not block duplicate application');else ok('Trade commits are idempotent by transaction ID');

F.add('shadow',1);const s=F.load();s.vault=['shadow'];F.save(s);
const blocked=F.tradeTransfer('shadow','frost','trade_test_vault');
if(blocked.ok||blocked.reason!=='protected_or_missing'||F.load().owned.shadow!==1)fail('Vault-protected Puffling could be traded');else ok('Vault-protected copies cannot be traded');
const starter=F.tradeTransfer('starterpuff','frost','trade_test_starter');
if(starter.ok||starter.reason!=='starter_locked')fail('Starter Puffling trade was not blocked');else ok('Starter Pufflings cannot be traded');

ctx.SkyPuffFusionUI={renderDex:()=>{}};ctx.SkyPuffPufflingGameplay={active:()=>'',getPuff:()=>({name:'Prism Puff'})};ctx.running=false;ctx.score=0;ctx.boss=null;ctx.bossDefeated=false;
run(ctx,'js/puffling_progression.js');
ctx.SkyPuffPufflingProgress.addXp('prism',500);
const before=ctx.SkyPuffPufflingProgress.get('prism');if(before.level===1&&before.xp===0)fail('Progression setup did not create XP before reset');
const reset=ctx.SkyPuffPufflingProgress.reset('prism');if(reset.level!==1||reset.xp!==0)fail('Trade XP reset does not return Puffling to Level 1 / 0 XP');else ok('Trade XP reset returns Puffling to Level 1 / 0 XP');

const client=fs.readFileSync(`${root}/js/puffling_trade.js`,'utf8');
for(const token of ['trade:prepare','trade:prepared','trade:commit','tradeTransfer','starterOnly','availableCount','incomingWasNew','outgoingRemaining'])if(!client.includes(token))fail(`Trade client missing ${token}`);
if(!process.exitCode)ok('Trade client uses two-phase confirmation and local inventory safeguards');
const server=fs.readFileSync(`${root}/server/trade.js`,'utf8');
for(const token of ['trade:offer','trade:accept','trade:prepare','trade:prepared','trade:commit','starter_locked'])if(!server.includes(token))fail(`Trade server missing ${token}`);
if(!process.exitCode)ok('Trade server requires offer, dual approval and prepare before commit');
const loader=fs.readFileSync(`${root}/game.js`,'utf8');if(!loader.includes("'js/puffling_trade.js'"))fail('Puffling trade module is not active in game loader');else ok('Puffling trade module is active');

if(process.exitCode)process.exit(process.exitCode);
console.log('✅ Puffling duplicate inventory and trading checks passed');
