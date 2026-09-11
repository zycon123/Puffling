function json(res,status,payload,origin=''){
  const headers={'content-type':'application/json','cache-control':'no-store'};
  if(origin)headers['access-control-allow-origin']=origin;
  res.writeHead(status,headers);res.end(JSON.stringify(payload));
}
function allowedOrigin(req){
  const origin=String(req.headers.origin||'');
  if(!origin)return '';
  if(origin==='https://zycon123.github.io'||origin==='capacitor://localhost'||origin==='http://localhost'||origin==='https://localhost')return origin;
  return '';
}
function bearer(req){const h=String(req.headers.authorization||'');return /^Bearer\s+/i.test(h)?h.replace(/^Bearer\s+/i,'').trim():'';}
function readJson(req,limit=64*1024){
  return new Promise((resolve,reject)=>{let size=0,body='';req.setEncoding('utf8');req.on('data',chunk=>{size+=Buffer.byteLength(chunk);if(size>limit){reject(new Error('body_too_large'));req.destroy();return;}body+=chunk;});req.on('end',()=>{if(!body)return resolve({});try{resolve(JSON.parse(body));}catch{reject(new Error('invalid_json'));}});req.on('error',reject);});
}
function statusFor(code){
  if(['unauthorized','wallet_key_mismatch'].includes(code))return 401;
  if(['wallet_not_found','unknown_product'].includes(code))return 404;
  if(['insufficient_paid_diamonds','transaction_conflict','purchase_revoked'].includes(code))return 409;
  if(['provider_not_configured','provider_verifier_not_implemented','database_unavailable','wallet_unavailable'].includes(code))return 503;
  if(['invalid_json','body_too_large','invalid_wallet_credentials','invalid_amount','amount_mismatch','invalid_platform','invalid_purchase_payload','invalid_store_receipt','provider_platform_mismatch','provider_product_mismatch','provider_transaction_mismatch'].includes(code))return 400;
  return 500;
}
module.exports=function createIapHttp(store){
  return async function handle(req,res){
    let path;try{path=new URL(req.url,'http://localhost').pathname;}catch{return false;}
    if(!path.startsWith('/wallet/')&&!path.startsWith('/iap/'))return false;
    const origin=allowedOrigin(req);
    if(req.method==='OPTIONS'){
      const headers={'access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type,authorization','access-control-max-age':'600'};
      if(origin)headers['access-control-allow-origin']=origin;res.writeHead(204,headers);res.end();return true;
    }
    try{
      if(req.method==='GET'&&path==='/iap/status')return json(res,200,{ok:true,...store.status()},origin),true;
      if(req.method==='POST'&&path==='/wallet/session'){
        const body=await readJson(req);const out=await store.issueWallet(body.walletId,body.clientKey);json(res,200,{ok:true,...out},origin);return true;
      }
      if(req.method==='GET'&&path==='/wallet/balance'){
        const out=await store.balance(bearer(req));json(res,200,{ok:true,...out},origin);return true;
      }
      if(req.method==='POST'&&path==='/wallet/spend'){
        const body=await readJson(req);const out=await store.spend(bearer(req),body.amount,body.reason);json(res,200,out,origin);return true;
      }
      if(req.method==='POST'&&path==='/iap/verify'){
        const body=await readJson(req);const out=await store.grantVerified(bearer(req),body);json(res,200,out,origin);return true;
      }
      json(res,404,{ok:false,error:'not_found'},origin);return true;
    }catch(e){const code=String(e?.message||'server_error');json(res,statusFor(code),{ok:false,error:code},origin);return true;}
  };
};
