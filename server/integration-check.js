const {spawn}=require('child_process');
const {WebSocket}=require('ws');

const PORT=12000+Math.floor(Math.random()*1000);
const URL=`ws://127.0.0.1:${PORT}`;
const ROOM='quickmatch';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fail=msg=>{throw new Error(msg)};

function peer(playerId){
  const ws=new WebSocket(URL),queue=[],waiters=[];
  ws.on('message',raw=>{
    let m;try{m=JSON.parse(raw.toString())}catch{return;}
    const idx=waiters.findIndex(w=>w.type===m.type);
    if(idx>=0){const w=waiters.splice(idx,1)[0];clearTimeout(w.timer);w.resolve(m);}else queue.push(m);
  });
  return {
    ws,playerId,
    open:()=>new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject)}),
    send:m=>ws.send(JSON.stringify(m)),
    wait(type,timeout=5000){
      const idx=queue.findIndex(m=>m.type===type);if(idx>=0)return Promise.resolve(queue.splice(idx,1)[0]);
      return new Promise((resolve,reject)=>{const waiter={type,resolve,timer:setTimeout(()=>{const i=waiters.indexOf(waiter);if(i>=0)waiters.splice(i,1);reject(new Error(`timeout waiting for ${type} (${playerId})`));},timeout)};waiters.push(waiter);});
    },
    close:()=>{try{ws.close()}catch{}}
  };
}
async function waitUntil(p,type,pred,timeout=5000){const end=Date.now()+timeout;while(Date.now()<end){const m=await p.wait(type,Math.max(50,end-Date.now()));if(pred(m))return m;}throw new Error(`timeout waiting for matching ${type} (${p.playerId})`);}
async function expectNo(p,type,timeout=220){try{await p.wait(type,timeout);fail(`unexpected ${type} (${p.playerId})`);}catch(e){if(!String(e.message||e).startsWith('timeout waiting'))throw e;}}
async function waitForServer(child){
  let output='';return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`server start timeout: ${output}`)),5000);child.stdout.on('data',buf=>{output+=buf.toString();if(output.includes('listening on')){clearTimeout(timer);resolve();}});child.stderr.on('data',buf=>{output+=buf.toString();});child.once('exit',code=>{clearTimeout(timer);reject(new Error(`server exited early (${code}): ${output}`));});});
}

(async()=>{
  const server=spawn(process.execPath,['index.js'],{cwd:__dirname,env:{...process.env,PORT:String(PORT)},stdio:['ignore','pipe','pipe']});
  const peers=[];
  try{
    await waitForServer(server);
    const a=peer('launch_a'),b=peer('launch_b');peers.push(a,b);await Promise.all([a.open(),b.open()]);
    a.send({type:'race:hello',room:ROOM,playerId:a.playerId,protocol:2,rankRating:1030});const matchA=await a.wait('race:matched');
    b.send({type:'race:hello',room:ROOM,playerId:b.playerId,protocol:2,rankRating:1180});const matchB=await b.wait('race:matched');const joinedA=await a.wait('race:opponentJoined');
    if(matchA.mode!=='quick'||matchB.mode!=='quick')fail('Quick Match did not create a ranked quick room');
    if(joinedA.player?.rankRating!==1180||matchB.players?.find(p=>p.playerId===a.playerId)?.rankRating!==1030)fail('Opponent MMR relay failed');
    if(!matchA.courseSeed||matchA.courseSeed!==matchB.courseSeed||matchA.courseVersion!==1||matchB.courseVersion!==1)fail('Shared deterministic course metadata failed');

    // Reconnect the second player before start to verify signed room state survives a socket loss.
    const disconnected=a.wait('race:opponentDisconnected');b.close();await disconnected;
    const br=peer('launch_b');peers.push(br);await br.open();const reconnected=a.wait('race:opponentReconnected');br.send({type:'race:hello',room:matchB.room,playerId:br.playerId,protocol:2,resume:true,rankRating:1180});
    const resumed=await br.wait('race:resumed');await reconnected;if(resumed.room!==matchB.room||resumed.courseSeed!==matchA.courseSeed)fail('Race reconnect did not restore authoritative room/course');

    const startA=a.wait('race:start'),startB=br.wait('race:start');a.send({type:'race:ready',pufflingId:'ember',evolutionStage:0});br.send({type:'race:ready',pufflingId:'volt',evolutionStage:0});
    const [sa,sb]=await Promise.all([startA,startB]);
    if(!sa.serverStartAt||sa.serverStartAt!==sb.serverStartAt||sa.goal!==1500||sb.goal!==1500)fail('Synchronized Race start failed');
    if(sa.courseSeed!==matchA.courseSeed||sb.courseSeed!==matchA.courseSeed)fail('Race start changed courseSeed');

    const notStarted=a.wait('race:notStarted');a.send({type:'race:position',height:25,x:100,y:300});const gate=await notStarted;if(gate.courseSeed!==matchA.courseSeed)fail('Pre-start gate lost courseSeed');
    await sleep(Math.max(0,sa.serverStartAt-Date.now()+180));

    // A direct 1500m teleport must never win a ranked race.
    const rejected=a.wait('race:positionRejected');a.send({type:'race:position',height:1500,x:120,y:280,state:'jumping'});const rejection=await rejected;
    if(!['height_rate','height_jump'].includes(rejection.reason)||rejection.acceptedHeight!==0)fail('Impossible finish teleport was not rejected');
    await expectNo(a,'race:result');

    // Normal movement is relayed and attacks obey the server cooldown.
    const relay=br.wait('race:position');a.send({type:'race:position',height:100,x:120,y:280,state:'jumping'});const pos=await relay;if(pos.playerId!==a.playerId||pos.height!==100)fail('Valid position relay failed');
    await sleep(50);const attackRelay=br.wait('race:attack');a.send({type:'race:attack',ability:{id:'tinyGust',type:'slow',duration:350,strength:.08}});const attack=await attackRelay;if(attack.playerId!==a.playerId||attack.remaining!==2)fail('Race attack relay failed');
    const cooldown=a.wait('race:attackRejected');a.send({type:'race:attack',ability:{id:'tinyGust'}});if((await cooldown).reason!=='cooldown')fail('Race attack cooldown was not enforced');

    // Simulate a plausible full climb so server-side integrity still permits a legitimate winner.
    const resultA=a.wait('race:result',8000),resultB=br.wait('race:result',8000);
    for(let height=200;height<=1500;height+=100){await sleep(205);a.send({type:'race:position',height,x:120+(height%40),y:260,state:'jumping'});}
    const [ra,rb]=await Promise.all([resultA,resultB]);
    if(ra.winnerId!==a.playerId||rb.winnerId!==a.playerId)fail('Server did not award the valid 1500m finisher');
    if(ra.mode!=='quick'||!Array.isArray(ra.players)||ra.players.length!==2||ra.courseSeed!==matchA.courseSeed)fail('Ranked result metadata is incomplete');
    const ranks=new Map(ra.players.map(p=>[p.playerId,p.rankRating]));if(ranks.get(a.playerId)!==1030||ranks.get(br.playerId)!==1180)fail('Authoritative result lost MMR values');
    a.close();br.close();console.log('✅ Race: sync, reconnect, teleport rejection, attack cooldown and legitimate finish passed');

    const c=peer('trade_a'),d=peer('trade_b');peers.push(c,d);await Promise.all([c.open(),d.open()]);
    c.send({type:'trade:hello',room:'TRD123',playerId:c.playerId,protocol:1});await c.wait('trade:matched');d.send({type:'trade:hello',room:'TRD123',playerId:d.playerId,protocol:1});await d.wait('trade:matched');await c.wait('trade:opponentJoined');
    c.send({type:'trade:offer',pufflingId:'starterpuff',availableCount:1});if((await c.wait('trade:error')).code!=='starter_locked')fail('Starter Puffling trade lock failed');
    c.send({type:'trade:offer',pufflingId:'ember',availableCount:2});d.send({type:'trade:offer',pufflingId:'volt',availableCount:1});const bothOffers=s=>Array.isArray(s.players)&&s.players.length===2&&s.players.every(p=>p.offer?.pufflingId);await Promise.all([waitUntil(c,'trade:state',bothOffers),waitUntil(d,'trade:state',bothOffers)]);
    c.send({type:'trade:accept'});d.send({type:'trade:accept'});const [pc,pd]=await Promise.all([c.wait('trade:prepare'),d.wait('trade:prepare')]);if(!pc.txId||pc.txId!==pd.txId||pc.transfers?.length!==2)fail('Trade prepare failed');
    c.send({type:'trade:prepared',txId:pc.txId,ok:true});d.send({type:'trade:prepared',txId:pd.txId,ok:true});const [cc,cd]=await Promise.all([c.wait('trade:commit'),d.wait('trade:commit')]);if(cc.txId!==pc.txId||cd.txId!==pc.txId||cc.transfers?.length!==2)fail('Two-phase Trade commit failed');
    console.log('✅ Trade: starter lock, offers, two-party prepare and atomic commit passed');
  }finally{peers.forEach(p=>p.close());try{server.kill('SIGTERM')}catch{}}
})().catch(err=>{console.error('❌ Multiplayer integration check failed:',err.message||err);process.exitCode=1;});
