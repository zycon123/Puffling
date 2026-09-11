const {spawn}=require('child_process');
const {WebSocket}=require('ws');

const PORT=12000+Math.floor(Math.random()*1000);
const URL=`ws://127.0.0.1:${PORT}`;
const ROOM='quickmatch';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fail=msg=>{throw new Error(msg)};

function peer(playerId){
  const ws=new WebSocket(URL);
  const queue=[];
  const waiters=[];
  ws.on('message',raw=>{
    let m;try{m=JSON.parse(raw.toString())}catch{return;}
    const idx=waiters.findIndex(w=>w.type===m.type);
    if(idx>=0){const w=waiters.splice(idx,1)[0];clearTimeout(w.timer);w.resolve(m);}
    else queue.push(m);
  });
  return {
    ws,playerId,
    open:()=>new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject)}),
    send:m=>ws.send(JSON.stringify(m)),
    wait(type,timeout=5000){
      const idx=queue.findIndex(m=>m.type===type);
      if(idx>=0)return Promise.resolve(queue.splice(idx,1)[0]);
      return new Promise((resolve,reject)=>{
        const waiter={type,resolve,timer:setTimeout(()=>{const i=waiters.indexOf(waiter);if(i>=0)waiters.splice(i,1);reject(new Error(`timeout waiting for ${type} (${playerId})`));},timeout)};
        waiters.push(waiter);
      });
    },
    close:()=>{try{ws.close()}catch{}}
  };
}
async function waitUntil(p,type,pred,timeout=5000){
  const end=Date.now()+timeout;
  while(Date.now()<end){const m=await p.wait(type,Math.max(50,end-Date.now()));if(pred(m))return m;}
  throw new Error(`timeout waiting for matching ${type} (${p.playerId})`);
}
async function waitForServer(child){
  let output='';
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error(`server start timeout: ${output}`)),5000);
    child.stdout.on('data',buf=>{output+=buf.toString();if(output.includes('listening on')){clearTimeout(timer);resolve();}});
    child.stderr.on('data',buf=>{output+=buf.toString();});
    child.once('exit',code=>{clearTimeout(timer);reject(new Error(`server exited early (${code}): ${output}`));});
  });
}

(async()=>{
  const server=spawn(process.execPath,['index.js'],{cwd:__dirname,env:{...process.env,PORT:String(PORT)},stdio:['ignore','pipe','pipe']});
  const peers=[];
  try{
    await waitForServer(server);
    const a=peer('launch_a'),b=peer('launch_b');peers.push(a,b);
    await Promise.all([a.open(),b.open()]);
    a.send({type:'race:hello',room:ROOM,playerId:a.playerId,protocol:2,rankRating:1030});
    const matchA=await a.wait('race:matched');
    b.send({type:'race:hello',room:ROOM,playerId:b.playerId,protocol:2,rankRating:1180});
    const matchB=await b.wait('race:matched');
    const joinedA=await a.wait('race:opponentJoined');
    if(matchA.mode!=='quick'||matchB.mode!=='quick')fail('Quick Match did not create a ranked quick room');
    if(joinedA.player?.rankRating!==1180)fail('Opponent MMR was not relayed to the waiting Quick Race player');
    const bSawA=matchB.players?.find(p=>p.playerId===a.playerId);
    if(bSawA?.rankRating!==1030)fail('Matched player list did not include opponent MMR');

    const startA=a.wait('race:start'),startB=b.wait('race:start');
    a.send({type:'race:ready',room:ROOM,playerId:a.playerId,pufflingId:'ember',evolutionStage:0});
    b.send({type:'race:ready',room:ROOM,playerId:b.playerId,pufflingId:'volt',evolutionStage:0});
    const [sa,sb]=await Promise.all([startA,startB]);
    if(!sa.serverStartAt||sa.serverStartAt!==sb.serverStartAt)fail('players did not receive one synchronized serverStartAt');
    if(sa.goal!==1500||sb.goal!==1500)fail('server race goal is not 1500m');

    const notStarted=a.wait('race:notStarted');
    a.send({type:'race:position',room:ROOM,playerId:a.playerId,height:25,x:100,y:300});
    await notStarted;

    await sleep(Math.max(0,sa.serverStartAt-Date.now()+180));
    const relay=b.wait('race:position');
    a.send({type:'race:position',room:ROOM,playerId:a.playerId,height:100,x:120,y:280,state:'jumping'});
    const pos=await relay;
    if(pos.playerId!==a.playerId||pos.height!==100)fail('position relay did not preserve authoritative player/height');

    await sleep(50);
    const resultA=a.wait('race:result'),resultB=b.wait('race:result');
    a.send({type:'race:position',room:ROOM,playerId:a.playerId,height:1500,x:130,y:240,state:'jumping'});
    const [ra,rb]=await Promise.all([resultA,resultB]);
    if(ra.winnerId!==a.playerId||rb.winnerId!==a.playerId)fail('server did not authoritatively award the 1500m finisher');
    if(ra.mode!=='quick'||!Array.isArray(ra.players)||ra.players.length!==2)fail('Ranked Quick Race result is missing authoritative player profiles');
    const ranks=new Map(ra.players.map(p=>[p.playerId,p.rankRating]));
    if(ranks.get(a.playerId)!==1030||ranks.get(b.playerId)!==1180)fail('Authoritative Race result did not preserve both MMR values');
    a.close();b.close();
    console.log('✅ Race server two-client ranked Quick Race integration check passed');

    const c=peer('trade_a'),d=peer('trade_b');peers.push(c,d);await Promise.all([c.open(),d.open()]);
    c.send({type:'trade:hello',room:'TRD123',playerId:c.playerId,protocol:1});
    await c.wait('trade:matched');
    d.send({type:'trade:hello',room:'TRD123',playerId:d.playerId,protocol:1});
    await d.wait('trade:matched');await c.wait('trade:opponentJoined');
    c.send({type:'trade:offer',pufflingId:'ember',availableCount:2});
    d.send({type:'trade:offer',pufflingId:'volt',availableCount:1});
    const bothOffers=s=>Array.isArray(s.players)&&s.players.length===2&&s.players.every(p=>p.offer?.pufflingId);
    await Promise.all([waitUntil(c,'trade:state',bothOffers),waitUntil(d,'trade:state',bothOffers)]);
    c.send({type:'trade:accept'});d.send({type:'trade:accept'});
    const [pc,pd]=await Promise.all([c.wait('trade:prepare'),d.wait('trade:prepare')]);
    if(!pc.txId||pc.txId!==pd.txId||pc.transfers?.length!==2)fail('Trade prepare did not create one shared transaction');
    const ids=new Set(pc.transfers.map(t=>t.pufflingId));if(!ids.has('ember')||!ids.has('volt'))fail('Trade prepare lost one of the offered Pufflings');
    c.send({type:'trade:prepared',txId:pc.txId,ok:true});d.send({type:'trade:prepared',txId:pd.txId,ok:true});
    const [cc,cd]=await Promise.all([c.wait('trade:commit'),d.wait('trade:commit')]);
    if(cc.txId!==pc.txId||cd.txId!==pc.txId)fail('Both players did not receive the same committed trade');
    if(cc.transfers?.length!==2)fail('Committed trade is missing transfers');
    console.log('✅ Puffling two-player trade integration check passed');
  }finally{
    peers.forEach(p=>p.close());
    try{server.kill('SIGTERM')}catch{}
  }
})().catch(err=>{console.error('❌ Multiplayer integration check failed:',err.message||err);process.exitCode=1;});
