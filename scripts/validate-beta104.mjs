import fs from'node:fs';let f=0;const r=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'),ok=m=>console.log('✓',m),bad=m=>{console.error('✗',m);f++};const s=r('server/acquisition_store.js'),h=r('server/acquisition_http.js');
for(const x of ['BOSS_REWARDS','BOSS_REWARD_SET','validReward','grant_conflict','old.rows[0].account_id!==accountId','old.rows[0].source_ref!==sourceRef'])s.includes(x)?ok('store '+x):bad('missing '+x);
for(const id of ['NONE','ember','volt','frost','wind','prism','nova','supernova','phoenix'])s.includes(`'${id}'`)?ok('allowlist '+id):bad('missing reward '+id);
if(s.includes("if(s==='boss')return BOSS_REWARD_SET.has(p)"))ok('boss grants fail closed outside canonical reward pool');else bad('boss reward allowlist not enforced');
if(s.includes("throw new Error('grant_conflict')"))ok('duplicate grant conflicts fail closed');else bad('grant conflict guard missing');
if(h.includes('rewardFor(sessionId)')&&!h.includes('data?.pufflingId'))ok('HTTP reward remains server-selected');else bad('client can influence reward');
if(f)process.exit(1);console.log('beta.104 acquisition hardening validation passed');