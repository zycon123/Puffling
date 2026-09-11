const http=require('http');
const createIapStore=require('./iap_store');
const createIapHttp=require('./iap_http');

(async()=>{
  const store=createIapStore();
  try{await store.init();console.log('[IAP] Diamond wallet database ready');}
  catch(e){console.warn('[IAP] Diamond wallet database unavailable:',String(e?.message||e));}
  const handleIap=createIapHttp(store);
  const originalCreateServer=http.createServer;
  http.createServer=function wrappedCreateServer(listener){
    return originalCreateServer.call(http,async(req,res)=>{
      try{if(await handleIap(req,res))return;}
      catch(e){console.error('[IAP] HTTP handler failure',e);if(!res.headersSent){res.writeHead(500,{'content-type':'application/json'});res.end(JSON.stringify({ok:false,error:'server_error'}));}return;}
      return listener(req,res);
    });
  };
  process.on('SIGTERM',()=>store.close().catch(()=>{}));
  process.on('SIGINT',()=>store.close().catch(()=>{}));
  require('./index');
})();
