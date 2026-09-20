const {spawn}=require('child_process');
const {WebSocket}=require('ws');
const createAccountAuth=require('./account_auth');
const PORT=13000+Math.floor(Math.random()*1000),URL=`ws://127.0.0.1:${PORT}`,ROOM='quickmatch';
const SECRET='concurrency-test-secret-0123456789abcdef';
const auth=createAccountAuth({secret:SECRET});
const fail=msg=>{throw new Error(msg)};
function peer(playerId){const ws=new WebSocket(URL),queue=[],waiters=[];ws.on('message',raw=>{let m;try{m=JSON.parse(raw.toString())}catch{return;}const idx=waiters.findIndex(w=>w.type===m.type);if(idx>=0){const w=waiters.splice(idx,1)[0];clearTimeout(w.timer);w.resolve(m);}else queue.push(m);});return{ws,playerId,open:()=>new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject)}),send:m=>ws.send(JSON.stringify(m)),wait(type,timeout=5000){const idx=queue.findIndex(m=>m.type===type);if(idx>=0)return Promise.resolve(queue.splice(idx,1)[0]);return new Promise((resolve,reject)=>{const waiter={type,resolve,timer:setTimeout(()=>{const i=waiters.indexOf(waiter);if(i>=0)waiters.splice(i,1);reject(new Error(`timeout waiting for ${type} (${playerId})`));},timeout)};waiters.push(waiter);});},close:()=>{try{ws.close()}catch{}}};}
async function waitForServer(child){let output='';return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`server start timeout: ${output}`)),5000);child.stdout.on('data',buf=>{output+=buf.toString();if(output.includes('listening on')){clearTimeout(timer);resolve();}});child.stderr.on('data',buf=>{output+=buf.toString();});child.once('exit',code=>{clearTimeout(timer);reject(new Error(`server exited early (${code}): ${output}`));});});}

// Quick Match pairing decides who joins an existing waiting room vs. creates a
// new one via a synchronous check-and-claim on the in-memory `quickWaiting`
// slot -- but the player object used to be built with
// `rankRating: await resolveRank(accountId)` *after* that claim, leaving an
// async gap before the player was actually added to `room.players`. Under
// real concurrent load (many players clicking Quick Match within the same
// slow rank-lookup round trip), a second arrival could read the still-empty
// room as "not actually waiting yet" and spawn its own separate room instead
// of pairing up -- silently doubling bot-fallback matches under load. This
// test forces that async gap open (PUFFLING_TEST_RANK_DELAY_MS) and asserts
// two simultaneous Quick Match requests still land in the same room.
(async()=>{
  const server=spawn(process.execPath,['index.js'],{cwd:__dirname,env:{...process.env,PORT:String(PORT),PUFFLING_AUTH_SECRET:SECRET,PUFFLING_TEST_RANK_DELAY_MS:'150'},stdio:['ignore','pipe','pipe']});
  const peers=[];
  try{
    await waitForServer(server);
    const tokenA=auth.issue('acct_concurrent_a',{kind:'guest'}),tokenB=auth.issue('acct_concurrent_b',{kind:'guest'});
    const a=peer('concurrent_a'),b=peer('concurrent_b');peers.push(a,b);
    await Promise.all([a.open(),b.open()]);
    // Fire both Quick Match requests back-to-back, with no await between
    // sends, so their resolveRank() delays overlap exactly as they would
    // under real simultaneous load.
    a.send({type:'race:hello',room:ROOM,playerId:a.playerId,protocol:3,authToken:tokenA});
    b.send({type:'race:hello',room:ROOM,playerId:b.playerId,protocol:3,authToken:tokenB});
    const [matchA,matchB]=await Promise.all([a.wait('race:matched'),b.wait('race:matched')]);
    if(matchA.room!==matchB.room)fail(`Simultaneous Quick Match requests were not paired into the same room (got ${matchA.room} and ${matchB.room} instead of one shared room)`);
    if(matchA.mode!=='quick'||matchB.mode!=='quick')fail('Quick Match did not create a quick room');
    if(matchA.players?.length!==2&&matchB.players?.length!==2){
      // Whichever side joined second should see both players already listed.
      const withBoth=[matchA,matchB].find(m=>m.players?.length===2);
      if(!withBoth)fail('Paired room never reached 2 players');
    }
    console.log('✅ Simultaneous Quick Match requests pair into one room even with a slow rank lookup');
  }finally{
    peers.forEach(p=>p.close());
    try{server.kill('SIGTERM')}catch{}
  }
})().catch(err=>{console.error('❌ Matchmaking concurrency check failed:',err.message||err);process.exitCode=1;});
