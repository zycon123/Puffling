import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const root=process.cwd(),read=p=>fs.readFileSync(`${root}/${p}`,'utf8');

const createStore=require('../server/boss_session_store.js');const store=createStore();
const fixed={storm:120,candy:175,ice:240,galaxy:340,solar:430,void:500,thunder:575,crystal:660,inferno:760,cosmic:900};
for(const [id,hp] of Object.entries(fixed)){assert.equal(store.validBossRef(`${id}:1`),true,`server rejects ${id}:1`);assert.equal(store.maxHp(`${id}:1`),hp,`HP mismatch for ${id}`);}
for(const id of ['solar','void','thunder','crystal','inferno','cosmic'])assert.equal(store.validBossRef(`${id}:2`),false,`${id} must not repeat as an endless tier`);
for(const id of ['storm','candy','ice','galaxy']){assert.equal(store.validBossRef(`${id}:51`),true,`${id}:51 rejected`);assert.ok(store.maxHp(`${id}:51`)<=1440,`${id}:51 HP cap failed`);}
for(const dmg of [1,12,22,24,44])assert.equal(store.normalizeHitDamage(dmg),dmg,`legal damage ${dmg} rejected`);for(const dmg of [0,-1,45,999,NaN])assert.equal(store.normalizeHitDamage(dmg),0,`illegal damage ${dmg} accepted`);

const http=read('server/boss_session_http.js'),server=read('server/boss_session_store.js');
assert.ok(http.includes('data?.damage'),'boss hit HTTP route does not forward combat damage');
assert.ok(server.includes('boss_hp<=0')&&server.includes('completed_at=COALESCE'),'status cannot finalize a legitimately defeated fast boss after minimum fight time');
assert.ok(server.includes('minFightMs')&&server.includes('minHitMs'),'boss proof timing guards missing');

// Execute the real browser bridge with a fake server to verify damage chunking and reward handoff.
const calls=[],now=Date.now(),localStorage={getItem:k=>k==='pufflingAccountAuthToken'?'signed-test-token':'',setItem(){}};
let reward=null;
const ctx={
 console,Date,Math,Number,String,Object,Array,Promise,JSON,localStorage,
 window:null,boss:{id:'storm',name:'Storm Boss',tier:1,hp:120,maxHp:120,at:1200},bossDefeated:false,bossRushMode:false,
 requestAnimationFrame(){return 0;},setTimeout(fn){fn();return 0;},showToast(){},
 fetch:async(url,opts)=>{const path=new URL(url).pathname,body=opts?.body?JSON.parse(opts.body):{};calls.push({path,body});if(path.endsWith('/start'))return{ok:true,status:201,json:async()=>({ok:true,sessionId:'BS_TEST',nonce:'N_TEST',bossRef:'storm:1',maxHp:120,minFightMs:5000,minHitMs:180,startedAt:new Date(now-6000).toISOString()})};if(path.endsWith('/hit'))return{ok:true,status:200,json:async()=>({ok:true,accepted:true,bossHp:0,completed:true})};if(path.endsWith('/status'))return{ok:true,status:200,json:async()=>({ok:true,bossHp:0,completedAt:new Date().toISOString(),startedAt:new Date(now-6000).toISOString(),minFightMs:5000,minHitMs:180})};throw new Error(`unexpected path ${path}`);},
 skyPuffConfig:{apiBase:'https://example.test'},SkyPuffRaceTransport:{ensureGuestIdentity:async()=>({token:'signed-test-token'})},SkyPuffBossPufflingRewards:{rollBossReward:async x=>{reward=x;return x;}}
};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(read('js/boss_session_client.js'),ctx,{filename:'boss_session_client.js'});
await ctx.SkyPuffBossSessionClient.start(ctx.boss);ctx.SkyPuffBossSessionClient.reportDamage(88);await ctx.SkyPuffBossSessionClient.finish({id:'storm',name:'Storm Boss',tier:1,at:1200});
const hitCalls=calls.filter(x=>x.path.endsWith('/hit'));assert.deepEqual(hitCalls.map(x=>x.body.damage),[44,44],'88 local damage must be represented as two validated 44-damage server hits');
assert.ok(reward?.sessionId==='BS_TEST'&&reward?.bossRef==='storm:1','verified boss reward handoff failed');
console.log('✅ Boss Session sync validated for all 10 bosses, endless tiers, legal damage 1-44 and client reward handoff');
