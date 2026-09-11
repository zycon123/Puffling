const createAccountHttp=require('./account_http');
const createTradeInventoryHttp=require('./trade_inventory_http');
const createBossSessionHttp=require('./boss_session_http');
const createAcquisitionHttp=require('./acquisition_http');
const createRankedHttp=require('./ranked_http');
const createLeaderboardHttp=require('./leaderboard_http');
const createIapHttp=require('./iap_http');

function response(){
  return {headersSent:false,writes:0,ends:0,status:0,body:'',writeHead(status){if(this.headersSent)throw new Error('duplicate_headers');this.headersSent=true;this.writes++;this.status=status;},end(value=''){this.ends++;this.body+=String(value);}};
}
function request(url,method='GET'){return {url,method,headers:{},socket:{remoteAddress:'127.0.0.1'}};}
async function handledOnce(name,handler,req){
  const res=response(),handled=await handler(req,res);
  if(handled!==true)throw new Error(`${name} wrote a response without reporting the route handled`);
  if(res.writes!==1||res.ends!==1)throw new Error(`${name} wrote ${res.writes} headers and ended ${res.ends} times`);
}

(async()=>{
  const auth={enabled:()=>true,issuer:'puffling',audience:'puffling',ttlSeconds:3600,verify:()=>({ok:false,error:'invalid_token'})};
  await handledOnce('account',createAccountHttp(auth,null),request('/api/account/status'));
  await handledOnce('trade inventory',createTradeInventoryHttp(auth,{status:()=>({ready:false})}),request('/api/trade/inventory'));
  await handledOnce('boss session',createBossSessionHttp(auth,{statusInfo:()=>({ready:false})}),request('/api/boss/session/status','POST'));
  await handledOnce('acquisition',createAcquisitionHttp(auth,{status:()=>({ready:false})},{statusInfo:()=>({ready:false})}),request('/api/acquisition/boss','POST'));
  await handledOnce('ranked',createRankedHttp({version:1,status:()=>({ready:true})}),request('/api/ranked/status'));
  await handledOnce('leaderboard',createLeaderboardHttp({list:async()=>[]}),request('/leaderboard'));
  await handledOnce('IAP',createIapHttp({status:()=>({ready:true,providerReady:false})}),request('/iap/status'));
  console.log('HTTP handler routing checks passed: every response stops the bootstrap chain');
})().catch(error=>{console.error(error);process.exitCode=1;});
