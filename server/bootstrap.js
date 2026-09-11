const http=require('http');
const createIapStore=require('./iap_store');
const createIapHttp=require('./iap_http');
const createLeaderboardStore=require('./leaderboard_store');
const createLeaderboardHttp=require('./leaderboard_http');
const createRankedStore=require('./ranked_store');
const createRankedHttp=require('./ranked_http');
const createAccountAuth=require('./account_auth');
const createAccountHttp=require('./account_http');

(async()=>{
  const iapStore=createIapStore();
  const leaderboardStore=createLeaderboardStore();
  const rankedStore=createRankedStore();
  const accountAuth=createAccountAuth();
  try{await iapStore.init();console.log('[IAP] Diamond wallet database ready');}catch(e){console.warn('[IAP] Diamond wallet database unavailable:',String(e?.message||e));}
  try{await leaderboardStore.init();console.log('[Leaderboard] Global score database ready');}catch(e){console.warn('[Leaderboard] Score database unavailable:',String(e?.message||e));}
  try{await rankedStore.init();console.log('[Ranked] Persistent rank database ready');}catch(e){console.warn('[Ranked] Rank database unavailable:',String(e?.message||e));}
  global.PufflingRankedStore=rankedStore;
  global.PufflingAccountAuth=accountAuth;
  const handleAccount=createAccountHttp(accountAuth,rankedStore);
  const handleIap=createIapHttp(iapStore),handleLeaderboard=createLeaderboardHttp(leaderboardStore),handleRanked=createRankedHttp(rankedStore);
  const originalCreateServer=http.createServer;
  http.createServer=function wrappedCreateServer(listener){return originalCreateServer.call(http,async(req,res)=>{
    try{if(await handleAccount(req,res))return;}catch(e){console.error('[Account] HTTP handler failure',e);if(!res.headersSent){res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({ok:false,error:'server_error'}));}return;}
    try{if(await handleRanked(req,res))return;}catch(e){console.error('[Ranked] HTTP handler failure',e);if(!res.headersSent){res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({ok:false,error:'server_error'}));}return;}
    try{if(await handleLeaderboard(req,res))return;}catch(e){console.error('[Leaderboard] HTTP handler failure',e);if(!res.headersSent){res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({ok:false,error:'server_error'}));}return;}
    try{if(await handleIap(req,res))return;}catch(e){console.error('[IAP] HTTP handler failure',e);if(!res.headersSent){res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({ok:false,error:'server_error'}));}return;}
    return listener(req,res);
  });};
  const closeStores=()=>Promise.allSettled([iapStore.close(),leaderboardStore.close(),rankedStore.close()]);
  process.on('SIGTERM',()=>closeStores());process.on('SIGINT',()=>closeStores());require('./index');
})();
