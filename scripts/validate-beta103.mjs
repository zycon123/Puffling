import fs from'node:fs';let f=0;const r=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'),ok=m=>console.log('✓',m),bad=m=>{console.error('✗',m);f++};const s=r('server/boss_session_store.js'),h=r('server/boss_session_http.js'),b=r('server/bootstrap.js'),a=r('server/acquisition_http.js');
for(const x of ['crypto.randomBytes','expires_at','FOR UPDATE','consumed_at','markCompletedTrusted','consumeCompleted','validBossRef','minFightMs'])s.includes(x)?ok('session '+x):bad('missing '+x);
if(s.includes("started_at<=now()-($3::bigint * interval '1 millisecond')"))ok('trusted completion enforces plausible minimum duration');else bad('trusted completion duration guard missing');
for(const x of ['/api/boss/session/start','/api/boss/session/status','auth.verify','serverIssued:true','store.validBossRef'])h.includes(x)?ok('api '+x):bad('missing '+x);
if(!h.includes('markCompletedTrusted')&&!h.includes('consumeCompleted'))ok('public API cannot complete/consume sessions');else bad('public API exposes trusted completion');
if(a.includes('boss_proof_required')&&!a.includes('store.grant('))ok('boss acquisition remains fail closed');else bad('boss acquisition trust boundary regressed');
for(const x of ['createBossSessionHttp','handleBossSession','PufflingBossSessionStore'])b.includes(x)?ok('bootstrap '+x):bad('missing '+x);
if(f)process.exit(1);console.log('beta.103 validation passed');